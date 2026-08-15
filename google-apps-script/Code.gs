/**
 * Nirmora Leads & Bookings — Web App receiver.
 *
 * Handles TWO responsibilities from one Web App: (1) appending a row to the
 * Google Sheet (unchanged from before), and (2) sending both transactional
 * emails via GmailApp as nirmoracreative@gmail.com — replacing Resend
 * entirely. Resend's testing sender (onboarding@resend.dev) could only ever
 * reach the account's own address, and RESEND_FROM_EMAIL could never be
 * verified because nirmoracreative@gmail.com is a personal Gmail address,
 * not a domain Resend can verify. GmailApp sidesteps that completely: it
 * sends AS whichever Google account owns this Apps Script deployment, so as
 * long as this project is created and deployed while logged into
 * nirmoracreative@gmail.com itself, every email genuinely comes from that
 * address — no domain verification of any kind is needed.
 *
 * IMPORTANT ACCOUNT REQUIREMENT: GmailApp.sendEmail() cannot send "from" an
 * arbitrary address — it only ever sends as the Google account that
 * authorized this script. This script MUST be created/deployed while
 * signed into nirmoracreative@gmail.com (Execute as: Me), or emails will
 * come from a different Gmail account instead. See the deployment
 * instructions for the exact steps.
 *
 * GMAIL SENDING QUOTA: a standard (non-Workspace) Gmail account can send
 * ~100 recipients/day via GmailApp. Each submission sends 2 emails
 * (client + admin), so that's roughly 50 submissions/day of headroom — a
 * real Google-enforced limit, not a bug in this script. A Google Workspace
 * account has a much higher quota if that ceiling is ever reached.
 *
 * SETUP:
 * 1. Open the Nirmora Leads & Bookings Google Sheet AS nirmoracreative@gmail.com.
 * 2. Extensions > Apps Script.
 * 3. Replace the existing code with this file's contents.
 * 4. Project Settings (gear icon) > Script Properties > add:
 *      NIRMORA_EMAIL   = nirmoracreative@gmail.com
 *      SHARED_SECRET   = <a long random string you generate yourself>
 *    (Script Properties, not hardcoded here, so the secret is never
 *    committed to source and can be rotated without editing code.)
 * 5. Deploy > Manage deployments > (pencil icon) > Version: New version > Deploy.
 *    Editing an existing deployment keeps its Web App URL unchanged.
 *
 * Payload shape (matches api/contact.js, api/bookings/index.js,
 * api/reminders/run.js exactly):
 *   type: 'contact' | 'booking' | 'reminder'
 *   secret: must equal the SHARED_SECRET script property
 *   referenceId: 'NRM-001' (contact) | 'CALL-001' (booking/reminder) — from
 *   Supabase, always use this. Two fully independent sequences/prefixes.
 *   name, email, company, service, message
 *   Booking/reminder only: bookingDate, bookingTime, timezone
 *   Reminder only: kind: '24h' | '30m'
 */

var CONTACT_SHEET = 'Contact Enquiries';
var BOOKING_SHEET = 'Call Bookings';

var CONTACT_COLUMNS = ['Submission ID', 'Name', 'Email', 'Company', 'Service', 'Project Details', 'Status', 'Submitted At', 'Source'];
var BOOKING_COLUMNS = ['Booking ID', 'Name', 'Email', 'Company', 'Service', 'Project Details', 'Booking Date', 'Booking Time', 'Timezone', 'Status', 'Created At'];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    console.log('DEPLOYMENT TEST — CURRENT CODE IS RUNNING');
    console.log('REFERENCE ID: ' + body.referenceId);

    var expectedSecret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (expectedSecret && body.secret !== expectedSecret) {
      return jsonResponse({ success: false, error: 'Invalid or missing secret.' });
    }

    if (body.type === 'contact') return handleContact(body);
    if (body.type === 'booking') return handleBooking(body);
    if (body.type === 'reminder') return handleReminder(body);
    return jsonResponse({ success: false, error: 'Unknown type: ' + body.type });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}

// "14 Aug 2026, 6:34 PM" — written as a plain string, not a Date object, so
// the display format is guaranteed regardless of the Sheet column's own
// cell-formatting settings.
function formatCreatedAt(date) {
  return Utilities.formatDate(date, 'Asia/Kolkata', 'd MMM yyyy, h:mm a');
}

// bookingDate arrives as 'YYYY-MM-DD'; bookingTime arrives already
// formatted as '2:30 PM' (see api/bookings/index.js) — passed through
// unchanged, only the date needs turning into a readable weekday string.
function formatBookingWhen(body) {
  var parts = String(body.bookingDate || '').split('-').map(Number);
  var d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  var dateLabel = Utilities.formatDate(d, 'UTC', 'EEEE, MMMM d, yyyy');
  return dateLabel + ' at ' + body.bookingTime + ' (' + body.timezone + ')';
}

function handleContact(body) {
  if (!body.name) return jsonResponse({ success: false, error: 'Name is required.' });
  if (!body.referenceId) return jsonResponse({ success: false, error: 'Missing referenceId — the Supabase submission_id migration has not been applied yet, so no row was written.' });

  var row = [body.referenceId, body.name, body.email, body.company || '', body.service || '', body.message || '', 'New', formatCreatedAt(new Date()), 'Website'];
  appendRow(CONTACT_SHEET, CONTACT_COLUMNS, row);

  var clientResult = sendClientEmailSafely(function () { sendContactClientEmail(body); });
  var adminResult = sendAdminEmailSafely(function () { sendContactAdminEmail(body); });

  return jsonResponse({
    success: true,
    type: 'contact',
    submissionId: body.referenceId,
    message: 'Contact enquiry submitted successfully.',
    clientEmailSent: clientResult.sent,
    adminEmailSent: adminResult.sent,
    clientEmailError: clientResult.error,
    adminEmailError: adminResult.error,
  });
}

function handleBooking(body) {
  if (!body.name) return jsonResponse({ success: false, error: 'Name is required.' });
  if (!body.referenceId) return jsonResponse({ success: false, error: 'Missing referenceId — the Supabase booking_id migration has not been applied yet, so no row was written.' });

  var row = [body.referenceId, body.name, body.email, body.company || '', body.service || '', body.message || '', body.bookingDate || '', body.bookingTime || '', body.timezone || '', 'New', formatCreatedAt(new Date())];
  appendRow(BOOKING_SHEET, BOOKING_COLUMNS, row);

  var clientResult = sendClientEmailSafely(function () { sendBookingClientEmail(body); });
  var adminResult = sendAdminEmailSafely(function () { sendBookingAdminEmail(body); });

  return jsonResponse({
    success: true,
    type: 'booking',
    bookingId: body.referenceId,
    message: 'Call booking submitted successfully.',
    clientEmailSent: clientResult.sent,
    adminEmailSent: adminResult.sent,
    clientEmailError: clientResult.error,
    adminEmailError: adminResult.error,
  });
}

// Reminders never write a Sheet row — just the client-facing 24h/30m email
// for a booking that already has one.
function handleReminder(body) {
  if (!body.referenceId) return jsonResponse({ success: false, error: 'Missing referenceId.' });
  if (body.kind !== '24h' && body.kind !== '30m') return jsonResponse({ success: false, error: "kind must be '24h' or '30m'." });

  var clientResult = sendClientEmailSafely(function () { sendReminderClientEmail(body); });

  return jsonResponse({
    success: true,
    type: 'reminder',
    bookingId: body.referenceId,
    clientEmailSent: clientResult.sent,
    clientEmailError: clientResult.error,
  });
}

// Each email send is isolated in its own try/catch so one failing never
// blocks the other, and the Sheet row (already written above) is never
// undone by an email problem. Returns { sent, error } — error is the
// complete Gmail exception message on failure, null on success — instead
// of a bare boolean, so doPost's JSON response can expose the REAL cause
// (e.g. Gmail sending quota, invalid recipient, missing scope) rather than
// silently swallowing it. err.toString() and String(err) can both lose
// detail depending on the exception shape Apps Script throws, so this
// tries err.message first and falls back to the stringified error.
function sendClientEmailSafely(fn) {
  try {
    fn();
    return { sent: true, error: null };
  } catch (err) {
    var message = (err && err.message) ? err.message : String(err);
    console.error('Client email failed: ' + message);
    return { sent: false, error: message };
  }
}
function sendAdminEmailSafely(fn) {
  try {
    fn();
    return { sent: true, error: null };
  } catch (err) {
    var message = (err && err.message) ? err.message : String(err);
    console.error('Admin email failed: ' + message);
    return { sent: false, error: message };
  }
}

function getNirmoraEmail() {
  return PropertiesService.getScriptProperties().getProperty('NIRMORA_EMAIL') || Session.getActiveUser().getEmail();
}

// ============================================================================
// EMAIL TEMPLATES — same cream/charcoal/gold visual system as the rest of
// the site (ported from the previous api/_lib/emails.js, which sent these
// same templates via Resend).
// ============================================================================

var INK = '#20221F';
var MUTED = '#66665F';
var GOLD = '#C58A2A';
var BG = '#FBF7EF';
var CARD = '#FFFFFF';
var BORDER = 'rgba(32,34,31,0.12)';

function shell(bodyHtml) {
  return '' +
    '<div style="background:' + BG + ';padding:40px 20px;font-family:Helvetica,Arial,sans-serif;">' +
    '<div style="max-width:520px;margin:0 auto;">' +
    '<div style="font-family:Georgia,serif;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:' + GOLD + ';font-weight:700;margin-bottom:24px;">Nirmora Creative</div>' +
    '<div style="background:' + CARD + ';border:1px solid ' + BORDER + ';border-radius:16px;padding:36px 32px;">' + bodyHtml + '</div>' +
    '<p style="margin-top:24px;font-size:12px;color:' + MUTED + ';">Nirmora Creative &middot; Mulund, Maharashtra, India</p>' +
    '</div></div>';
}

function row(label, value) {
  if (!value) return '';
  return '' +
    '<tr>' +
    '<td style="padding:6px 0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:' + MUTED + ';vertical-align:top;width:140px;">' + label + '</td>' +
    '<td style="padding:6px 0;font-size:14px;color:' + INK + ';">' + escapeHtml(String(value)) + '</td>' +
    '</tr>';
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sendContactClientEmail(body) {
  var html = shell(
    '<h1 style="font-family:Georgia,serif;font-size:22px;color:' + INK + ';margin:0 0 12px;">Thanks, ' + escapeHtml(body.name) + '.</h1>' +
    '<p style="font-size:14.5px;line-height:1.6;color:' + MUTED + ';margin:0 0 20px;">We\'ve received your enquiry about <strong style="color:' + INK + ';">' + escapeHtml(body.service || '') + '</strong> and a member of the Nirmora team will get back to you within one business day with a clear next step.</p>' +
    '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">' +
    row('Reference', body.referenceId) +
    row('Company', body.company) +
    row('Service', body.service) +
    row('Project Details', body.message) +
    '</table>' +
    '<p style="font-size:13.5px;line-height:1.6;color:' + MUTED + ';margin:20px 0 0;">We look forward to speaking with you and understanding your requirements.</p>' +
   '<p style="font-size:13px;color:' + MUTED + ';margin:20px 0 0;">— Nirmora Creative</p>'
  );
  GmailApp.sendEmail(body.email, 'Nirmora Creative — We Received Your Inquiry [' + body.referenceId + ']', '', { htmlBody: html, name: 'Nirmora Creative' });
}

function sendContactAdminEmail(body) {
  var html = shell(
    '<h1 style="font-family:Georgia,serif;font-size:20px;color:' + INK + ';margin:0 0 18px;">New Contact Inquiry</h1>' +
    '<table style="width:100%;border-collapse:collapse;">' +
    row('Submission ID', body.referenceId) +
    row('Name', body.name) +
    row('Email', body.email) +
    row('Company', body.company) +
    row('Service', body.service) +
    row('Project Details', body.message) +
    row('Submitted At', formatCreatedAt(new Date())) +
    '</table>' +
    '<p style="font-size:13.5px;line-height:1.6;color:' + MUTED + ';margin:20px 0 0;">We look forward to speaking with you and understanding your requirements.</p>' +
    '<p style="font-size:13px;color:' + MUTED + ';margin:20px 0 0;">— Nirmora Creative</p>'
  );

  GmailApp.sendEmail(
    getNirmoraEmail(),
    'New Nirmora Contact Inquiry — ' + body.name + ' — ' + body.referenceId,
    '',
    { htmlBody: html, name: 'Nirmora Creative' }
  );
}

function sendBookingClientEmail(body) {
  var html = shell(
    '<h1 style="font-family:Georgia,serif;font-size:22px;color:' + INK + ';margin:0 0 12px;">Your call is confirmed.</h1>' +
    '<p style="font-size:14.5px;line-height:1.6;color:' + MUTED + ';margin:0 0 20px;">Hi ' + escapeHtml(body.name) + ', thank you for booking a consultation with Nirmora Creative. Your call has been successfully scheduled.</p>' +
    '<table style="width:100%;border-collapse:collapse;margin-bottom:20px;">' +
    row('Booking ID', body.referenceId) +
    row('Date', formatBookingWhen(body)) +
    row('Company', body.company) +
    row('Service', body.service) +
    row('Project Details', body.message) +
    '</table>' +
    '<p style="font-size:13.5px;line-height:1.6;color:' + MUTED + ';margin:0;">We look forward to speaking with you and understanding your requirements.</p>' +
    '<p style="font-size:13px;color:' + MUTED + ';margin:20px 0 0;">Regards,<br />Nirmora Creative — We engineer growth.</p>'
  );

  GmailApp.sendEmail(
    body.email,
    'Your Nirmora Creative Call is Confirmed — ' + body.referenceId,
    '',
    {
      htmlBody: html,
      name: 'Nirmora Creative'
    }
  );
}

function sendBookingAdminEmail(body) {
  var html = shell(
    '<h1 style="font-family:Georgia,serif;font-size:20px;color:' + INK + ';margin:0 0 18px;">New Call Booking</h1>' +
    '<table style="width:100%;border-collapse:collapse;">' +
    row('Booking ID', body.referenceId) +
    row('Name', body.name) +
    row('Email', body.email) +
    row('Company', body.company) +
    row('Date', formatBookingWhen(body)) +
    row('Service', body.service) +
    row('Project Details', body.message) +
    row('Created At', formatCreatedAt(new Date())) +
    '</table>' +
    '<p style="font-size:13.5px;line-height:1.6;color:' + MUTED + ';margin:20px 0 0;">We look forward to speaking with you and understanding your requirements.</p>' +
    '<p style="font-size:13px;color:' + MUTED + ';margin:20px 0 0;">Regards,<br />Nirmora Creative — We engineer growth.</p>'
  );

  GmailApp.sendEmail(
    getNirmoraEmail(),
    'New Call Booking — ' + body.name + ' — ' + body.referenceId,
    '',
    { htmlBody: html, name: 'Nirmora Creative' }
  );
}

function sendReminderClientEmail(body) {
  var lead = body.kind === '24h' ? 'in 24 hours' : 'in 30 minutes';
  var subject = body.kind === '24h' ? 'Reminder: your Nirmora call is tomorrow' : 'Reminder: your Nirmora call starts in 30 minutes';
  var html = shell(
    '<h1 style="font-family:Georgia,serif;font-size:22px;color:' + INK + ';margin:0 0 12px;">Your call is ' + lead + '.</h1>' +
    '<p style="font-size:14.5px;line-height:1.6;color:' + MUTED + ';margin:0 0 20px;">A quick reminder about your upcoming call with Nirmora Creative:</p>' +
    '<p style="font-size:17px;font-weight:600;color:' + INK + ';margin:0;">' + formatBookingWhen(body) + '</p>'
  );
  GmailApp.sendEmail(body.email, subject, '', { htmlBody: html, name: 'Nirmora Creative' });
}

// ============================================================================
// ONE-TIME GMAIL AUTHORIZATION — TEMPORARY, SAFE TO DELETE AFTER RUNNING ONCE.
//
// Web App executions (doPost/doGet) can never trigger Google's OAuth
// consent screen themselves — if this script's Gmail-send scope has never
// been explicitly authorized by the deploying account, every
// GmailApp.sendEmail() call inside doPost() fails silently (caught by the
// try/catch in sendClientEmailSafely/sendAdminEmailSafely), which is why
// the Web App can return a perfectly valid {success:true, ...} response
// with clientEmailSent:false and adminEmailSent:false — no error visible
// anywhere except this authorization gap. This function does nothing
// except touch GmailApp, purely so that manually running it from the
// editor triggers that one-time consent screen. It takes no parameters
// (unlike the real send functions, which require the POST body), and it
// never sends an email.
// ============================================================================
function authorizeGmailAccess() {
  GmailApp.getAliases();
}

// ============================================================================
// SHEET WRITING — unchanged.
// ============================================================================

function appendRow(sheetName, columns, row) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(columns);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(columns);
  }
  sheet.appendRow(row);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return jsonResponse({ success: true, service: 'Nirmora Creative Lead System', status: 'online', message: 'Google Apps Script is running.' });
}
function testGmailSend() {
  try {
    GmailApp.sendEmail(
      'nirmoracreative@gmail.com',
      'Nirmora Gmail Test',
      'This is a direct Gmail test from the Nirmora Creative Apps Script.',
      {
        name: 'Nirmora Creative'
      }
    );

    console.log('SUCCESS — GmailApp.sendEmail completed.');
  } catch (err) {
    console.error('GMAIL TEST FAILED — ' + (err && err.message ? err.message : String(err)));
    throw err;
  }
}
function testContactEmails() {
  var body = {
    referenceId: 'TEST-001',
    name: 'Priya Sharma',
    email: 'ps0078281@gmail.com',
    company: 'Test Company',
    service: 'Website Development',
    message: 'This is a direct Contact email test.'
  };

  sendContactClientEmail(body);
  sendContactAdminEmail(body);

  console.log('CONTACT EMAIL TEST COMPLETED');
}
// ============================================================================
// NIRMORA REMINDER SCHEDULER
// Google Apps Script replaces the Vercel 15-minute cron.
// ============================================================================

function runNirmoraReminders() {
  var props = PropertiesService.getScriptProperties();

  var vercelUrl = props.getProperty('VERCEL_REMINDER_URL');
  var secret = props.getProperty('REMINDER_CRON_SECRET');

  if (!vercelUrl) {
    throw new Error('VERCEL_REMINDER_URL is not configured.');
  }

  var options = {
    method: 'post',
    contentType: 'application/json',
    muteHttpExceptions: true,
    headers: {
      'X-Reminder-Secret': secret || ''
    }
  };

  var response = UrlFetchApp.fetch(vercelUrl, options);

  var code = response.getResponseCode();
  var body = response.getContentText();

  console.log('Reminder scheduler response: ' + code);
  console.log(body);

  if (code < 200 || code >= 300) {
    throw new Error(
      'Reminder scheduler failed. HTTP ' + code + ': ' + body
    );
  }
}


// Run this function ONCE manually.
// It removes old copies of the reminder trigger and creates
// exactly one new trigger that runs every 15 minutes.

function setupNirmoraReminderTrigger() {
  var triggers = ScriptApp.getProjectTriggers();

  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'runNirmoraReminders') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger('runNirmoraReminders')
    .timeBased()
    .everyMinutes(15)
    .create();

  console.log('Nirmora reminder trigger created: every 15 minutes.');
}
