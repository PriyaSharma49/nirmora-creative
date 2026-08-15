import { getSupabaseAdmin } from '../_lib/supabase.js'
import { sendReminderEmail } from '../_lib/googleSheets.js'
import { formatTime12h, slotInstant, todayInBookingTimezone } from '../_lib/booking.js'

// GET/POST /api/reminders/run — the Vercel Cron target (see vercel.json).
// Runs frequently and is fully idempotent: a reminder is only ever sent
// once a booking crosses into its 24h/30m window AND its own sent-flag is
// still false, and the flag is set immediately after a successful send.
// Cancelled bookings are excluded by the status filter below, so a
// cancellation before the window is reached simply never gets a reminder.

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' })
  }

  const supabase = getSupabaseAdmin()
  const now = Date.now()
  const in24h = now + 24 * 60 * 60 * 1000
  const in30m = now + 30 * 60 * 1000

  const { data: upcoming, error } = await supabase
    .from('call_bookings')
    .select('*')
    .eq('status', 'New')
    .gte('booking_date', todayInBookingTimezone())
    .or('reminder_24h_sent.eq.false,reminder_30m_sent.eq.false')

  if (error) {
    console.error('Reminder lookup failed:', error)
    return res.status(500).json({ success: false })
  }

  let sent24h = 0
  let sent30m = 0

  for (const booking of upcoming || []) {
    const instant = slotInstant(booking.booking_date, booking.booking_time).getTime()
    if (instant <= now) continue // already happened — never reminds about the past

    const payload = {
      referenceId: booking.booking_id,
      name: booking.name,
      email: booking.email,
      bookingDate: booking.booking_date,
      bookingTime: formatTime12h(booking.booking_time),
      timezone: booking.timezone,
    }

    if (!booking.reminder_24h_sent && instant <= in24h) {
      const result = await sendReminderEmail({ ...payload, kind: '24h' })
      if (result.ok && result.clientEmailSent) {
        await supabase.from('call_bookings').update({ reminder_24h_sent: true }).eq('id', booking.id)
        sent24h++
      } else {
        console.error(`24h reminder failed for booking ${booking.booking_id}:`, result)
      }
    }

    if (!booking.reminder_30m_sent && instant <= in30m) {
      const result = await sendReminderEmail({ ...payload, kind: '30m' })
      if (result.ok && result.clientEmailSent) {
        await supabase.from('call_bookings').update({ reminder_30m_sent: true }).eq('id', booking.id)
        sent30m++
      } else {
        console.error(`30m reminder failed for booking ${booking.booking_id}:`, result)
      }
    }
  }

  return res.status(200).json({ success: true, checked: (upcoming || []).length, sent24h, sent30m })
}
