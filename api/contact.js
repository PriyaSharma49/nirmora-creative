import { waitUntil } from '@vercel/functions'
import { getSupabaseAdmin } from './_lib/supabase.js'
import { appendToSheet } from './_lib/googleSheets.js'

// POST /api/contact — the "Send Message" action on ContactPanel.jsx.
// Never creates a booking; that's a separate table/endpoint entirely.
// Name, Email, Company and Service are required; Project Details is
// optional. submission_id (NRM-001, ...) is generated atomically by a
// Postgres sequence on insert (see the migration) — never computed here,
// so concurrent submissions can never collide.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' })
  }

  const body = req.body || {}
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const company = String(body.company || '').trim()
  const service = String(body.service || '').trim()
  // ContactPanel.jsx's existing field is called `message` in the UI; the
  // brief calls the same value "Project Details" — same field, two names.
  const projectDetails = String(body.projectDetails || body.message || '').trim()

  if (!name) return res.status(400).json({ success: false, message: 'Please enter your name.' })
  if (!email) return res.status(400).json({ success: false, message: 'Please enter your email.' })
  if (!EMAIL_RE.test(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address.' })
  if (!company) return res.status(400).json({ success: false, message: 'Please enter your company name.' })
  if (!service) return res.status(400).json({ success: false, message: 'Please select a service.' })

  // The database write is the only step that determines success/failure.
  // Everything after this point is best-effort and logged, never allowed
  // to turn a real submission into a reported failure.
  let record
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('contact_enquiries')
      .insert({
        name,
        email,
        company,
        service,
        project_details: projectDetails || null,
        status: 'New',
        source: 'Website',
      })
      .select()
      .single()
    if (error) throw error
    record = data
  } catch (err) {
    console.error('Contact enquiry insert failed:', err)
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' })
  }

  // Supabase is the source of truth and the only thing the user waits on —
  // respond immediately once the row is saved. The Sheet row + both emails
  // are downstream, best-effort work that must not block the success
  // message behind Apps Script/Gmail. waitUntil() (Vercel's own mechanism
  // for exactly this) keeps the serverless function alive long enough to
  // finish that work after the response has already been sent — a plain
  // unawaited promise risks Vercel freezing the function mid-flight, which
  // could silently drop the Sheet/email step even though this comment
  // would otherwise claim it always runs.
  res.status(200).json({ success: true, id: record.id, submissionId: record.submission_id })

  // Payload shape matches google-apps-script/Code.gs's handleContact
  // exactly — it both writes the Sheet row AND sends both transactional
  // emails via GmailApp (client confirmation + Nirmora admin notification)
  // in this one call. Only submission_id (never the Supabase UUID) is sent
  // as the record's identifier.
  waitUntil(
    appendToSheet({
      type: 'contact',
      referenceId: record.submission_id,
      name: record.name,
      email: record.email,
      company: record.company || '',
      phone: '',
      service: record.service,
      budget: '',
      message: record.project_details || '',
    }).then((sheetResult) => {
      if (!sheetResult.ok) {
        console.error(`Contact enquiry ${record.submission_id}: Apps Script call failed — Sheet row and both emails may not have been sent. Submission is still safely stored in Supabase.`)
      } else {
        console.log(`Contact enquiry ${record.submission_id}: adminEmailSent=${sheetResult.adminEmailSent} clientEmailSent=${sheetResult.clientEmailSent}`)
      }
    })
  )
}
