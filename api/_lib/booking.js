// Business-hours / slot-grid logic shared by the availability endpoint and
// the booking-creation endpoint, so the frontend can never be shown a slot
// the backend wouldn't also accept.
//
// Asia/Kolkata has no DST, so its UTC offset is a fixed +05:30 year-round —
// safe to hardcode rather than pull in a timezone library for one constant.
// BOOKING_TIMEZONE is still read from env for the *label* stored in the
// database/emails, but the actual instant math below assumes IST.

export const TIMEZONE = process.env.BOOKING_TIMEZONE || 'Asia/Kolkata'
export const START_TIME = process.env.BOOKING_START_TIME || '10:00'
export const END_TIME = process.env.BOOKING_END_TIME || '16:30'
export const SLOT_MINUTES = Number(process.env.BOOKING_SLOT_MINUTES) || 30

const IST_OFFSET = '+05:30'

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function toHHMM(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, '0')
  const m = String(mins % 60).padStart(2, '0')
  return `${h}:${m}`
}

// The stored/DB value (booking_time) always stays 24-hour "HH:MM" — this is
// display-only, for every customer/business-facing surface (emails, Sheet,
// UI). Mirrors the frontend's own formatTime12h() in BookingModal.jsx so
// both sides render a given "14:30" as the same "2:30 PM" — same source
// value, same rule, just two places because one runs in the browser and
// one runs server-side.
export function formatTime12h(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

// Formats any ISO timestamp (Supabase's created_at, always stored/passed
// through untouched — this never writes back to the database) as
// "14 Aug 2026, 6:34 PM" in the booking timezone, for every business/
// customer-facing surface: emails, the Google Sheet, and any UI that shows
// a submission/creation time.
export function formatCreatedAt(iso) {
  const date = new Date(iso)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date)
  const get = (type) => parts.find((p) => p.type === type)?.value
  return `${get('day')} ${get('month')} ${get('year')}, ${get('hour')}:${get('minute')} ${get('dayPeriod')}`
}

// Every configured slot in the business day, regardless of past/booked
// status — the raw grid. e.g. START_TIME=10:00, END_TIME=18:00 produces
// 10:00 ... 17:30. END_TIME is the closing boundary, not itself a valid
// start time — a slot starting exactly at closing would run past it, so
// the loop is strictly-less-than, not inclusive.
export function generateAllSlots() {
  const slots = []
  const start = toMinutes(START_TIME)
  const end = toMinutes(END_TIME)
  for (let t = start; t < end; t += SLOT_MINUTES) slots.push(toHHMM(t))
  return slots
}

// "Today" as a calendar date in the booking timezone (YYYY-MM-DD) — used to
// disable past dates. Deliberately not the server's local date, which may
// be in UTC or any other zone depending on where the function runs.
export function todayInBookingTimezone() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

// A booking's real instant in time (a UTC Date), from its IST wall-clock
// date + time. Used to compare against "now" for past-slot checks and
// reminder timing — instant comparison, not string comparison.
export function slotInstant(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00${IST_OFFSET}`)
}

export function isPastSlot(dateStr, timeStr) {
  return slotInstant(dateStr, timeStr).getTime() <= Date.now()
}

// A plain YYYY-MM-DD calendar date's weekday doesn't depend on timezone —
// parsing at UTC midnight avoids any dependency on the server's local zone.
export function isSunday(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay() === 0
}

// The full source-of-truth availability computation: business hours minus
// past times minus already-booked times minus closed days (Sundays).
// `supabase` is passed in rather than imported here so this stays a pure,
// easily-testable function.
export async function getAvailableSlots(supabase, dateStr) {
  const today = todayInBookingTimezone()
  if (dateStr < today) return []
  if (isSunday(dateStr)) return []

  const all = generateAllSlots()

  const { data: booked, error } = await supabase
    .from('call_bookings')
    .select('booking_time')
    .eq('booking_date', dateStr)
    .neq('status', 'Cancelled')

  if (error) throw error

  const bookedSet = new Set((booked || []).map((b) => b.booking_time))
  return all.filter((t) => !bookedSet.has(t) && !isPastSlot(dateStr, t))
}
