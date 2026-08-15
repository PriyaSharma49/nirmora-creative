import { getSupabaseAdmin } from '../_lib/supabase.js'
import { getAvailableSlots } from '../_lib/booking.js'

// GET /api/bookings/availability?date=YYYY-MM-DD
// The backend is the sole source of truth for available times — the
// frontend never computes or hardcodes a slot list.

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' })
  }

  const date = req.query?.date
  if (!date || !DATE_RE.test(date)) {
    return res.status(400).json({ success: false, message: 'A valid date (YYYY-MM-DD) is required.' })
  }

  try {
    const supabase = getSupabaseAdmin()
    const times = await getAvailableSlots(supabase, date)
    return res.status(200).json({ success: true, date, times })
  } catch (err) {
    console.error('Availability lookup failed:', err)
    return res.status(500).json({ success: false, message: 'Could not load availability. Please try again.' })
  }
}
