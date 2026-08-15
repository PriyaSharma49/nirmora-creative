import { waitUntil } from '@vercel/functions'
import { getSupabaseAdmin } from '../_lib/supabase.js'
import { formatTime12h, getAvailableSlots, isPastSlot, isSunday, TIMEZONE } from '../_lib/booking.js'
import { appendToSheet } from '../_lib/googleSheets.js'

// POST /api/bookings — "Confirm Booking" from BookingModal.jsx's details
// step. Re-validates everything server-side (date, time, business hours,
// availability) rather than trusting whatever the client last fetched —
// the client's own availability list may be stale by the time this runs.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' })
  }

  const body = req.body || {}
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const company = String(body.company || '').trim()
  const service = String(body.service || '').trim()
  const projectDetails = String(body.projectDetails || '').trim()
  const bookingDate = String(body.bookingDate || '').trim()
  const bookingTime = String(body.bookingTime || '').trim()

  if (!name) return res.status(400).json({ success: false, message: 'Name is required.' })
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ success: false, message: 'A valid email is required.' })
  if (!bookingDate || !DATE_RE.test(bookingDate)) return res.status(400).json({ success: false, message: 'A valid booking date is required.' })
  if (!bookingTime || !TIME_RE.test(bookingTime)) return res.status(400).json({ success: false, message: 'A valid booking time is required.' })
  if (isSunday(bookingDate)) return res.status(400).json({ success: false, message: 'That date is outside business days. Please choose another.' })
  if (isPastSlot(bookingDate, bookingTime)) return res.status(400).json({ success: false, message: 'That time has already passed. Please choose another.' })

  const supabase = getSupabaseAdmin()

  // Belt: a friendly pre-check against current availability, so the common
  // "someone else just took it" case gets a clear conflict message instead
  // of a generic DB error.
  const validSlots = await getAvailableSlots(supabase, bookingDate)
  if (!validSlots.includes(bookingTime)) {
    const { data: existing } = await supabase
      .from('call_bookings')
      .select('id')
      .eq('booking_date', bookingDate)
      .eq('booking_time', bookingTime)
      .neq('status', 'Cancelled')
      .maybeSingle()

    if (existing) {
      return res.status(409).json({
        success: false,
        conflict: true,
        message: 'This time was just booked. Please select another available time.',
      })
    }
    return res.status(400).json({ success: false, message: 'That time is outside business hours. Please choose another.' })
  }

  // Suspenders: the database-level partial unique index on
  // (booking_date, booking_time) WHERE status <> 'Cancelled' is what
  // actually prevents two concurrent requests from both succeeding — the
  // check above narrows the race window but cannot close it by itself.
  let record
  try {
    const { data, error } = await supabase
      .from('call_bookings')
      .insert({
        name,
        email,
        company: company || null,
        service: service || null,
        project_details: projectDetails || null,
        booking_date: bookingDate,
        booking_time: bookingTime,
        timezone: TIMEZONE,
        status: 'New',
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          conflict: true,
          message: 'This time was just booked. Please select another available time.',
        })
      }
      throw error
    }
    record = data
  } catch (err) {
    console.error('Booking insert failed:', err)
    return res.status(500).json({ success: false, message: 'Could not create your booking. Please try again.' })
  }

  // Supabase is the source of truth and the only thing the user waits on —
  // respond immediately once the booking is saved. The Sheet row + both
  // emails are downstream, best-effort work via waitUntil() (see
  // api/contact.js for the full reasoning — same pattern here).
  res.status(200).json({ success: true, booking: record })

  // Payload shape matches google-apps-script/Code.gs's handleBooking
  // exactly — it both writes the Sheet row AND sends both transactional
  // emails via GmailApp (client confirmation + Nirmora admin notification)
  // in this one call.
  waitUntil(
    appendToSheet({
      type: 'booking',
      referenceId: record.booking_id,
      name: record.name,
      email: record.email,
      company: record.company || '',
      service: record.service || '',
      message: record.project_details || '',
      bookingDate: record.booking_date,
      bookingTime: formatTime12h(record.booking_time),
      timezone: record.timezone,
    }).then((sheetResult) => {
      if (!sheetResult.ok) {
        console.error(`Booking ${record.booking_id}: Apps Script call failed — Sheet row and both emails may not have been sent. Booking is still safely stored in Supabase.`)
      } else {
        console.log(`Booking ${record.booking_id}: adminEmailSent=${sheetResult.adminEmailSent} clientEmailSent=${sheetResult.clientEmailSent}`)
      }
    })
  )
}
