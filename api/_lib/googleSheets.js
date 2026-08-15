// The single client for the Google Apps Script Web App, which now handles
// TWO jobs from one deployment: writing the Google Sheet row (secondary
// export/record — Supabase is still the source of truth) AND sending both
// transactional emails via GmailApp as nirmoracreative@gmail.com,
// replacing Resend entirely. See google-apps-script/Code.gs for the full
// contract and the reasoning behind moving email-sending there.
//
// A failure here is always logged, never thrown — it can never undo a
// successful Supabase write or be reported to the user as a submission
// failure. The caller is responsible for checking `.clientEmailSent` /
// `.adminEmailSent` on the returned object to log accurate per-email status.

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL
const GOOGLE_SCRIPT_SECRET = process.env.GOOGLE_SCRIPT_SECRET

async function callAppsScript(payload) {
  if (!GOOGLE_SCRIPT_URL) {
    console.error('GOOGLE_SCRIPT_URL is not set — skipping Apps Script call for', payload.type)
    return { ok: false, skipped: true }
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, secret: GOOGLE_SCRIPT_SECRET }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || data.success === false) {
      console.error('Apps Script call rejected:', payload.type, data)
      return { ok: false, ...data }
    }
    return { ok: true, ...data }
  } catch (err) {
    console.error('Apps Script call error:', payload.type, err)
    return { ok: false }
  }
}

// Contact/booking submissions: writes the Sheet row AND sends both emails
// in one request (Code.gs's handleContact/handleBooking do both). Returns
// { ok, clientEmailSent, adminEmailSent } so the caller can log each
// email's outcome individually.
export async function appendToSheet(payload) {
  return callAppsScript(payload)
}

// Reminder emails: client-only, no Sheet row (Code.gs's handleReminder).
export async function sendReminderEmail(payload) {
  return callAppsScript({ type: 'reminder', ...payload })
}
