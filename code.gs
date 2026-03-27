// ============================================================
//  BioGuard Pest Control Nairobi — Code.gs
//  Google Apps Script Web App — Quote Request Capture Backend
// ============================================================
//
//  HOW TO DEPLOY (one-time setup, ~5 minutes):
//
//  1. Open Google Sheets → create a new spreadsheet.
//     Name it "BioGuard – Quote Requests".
//
//  2. Extensions → Apps Script
//
//  3. Delete any existing code, paste THIS entire file.
//
//  4. Set NOTIFY_EMAIL for instant quote alerts (optional).
//     Set EMERGENCY_EMAIL for a separate emergency alert address.
//
//  5. Deploy → New Deployment:
//       Type           → Web App
//       Execute as     → Me
//       Who has access → Anyone
//     Copy the Web App URL.
//
//  6. Paste that URL into script.js as SHEETS_WEBHOOK_URL.
//
//  7. Done — every quote form submission logs a new row,
//     with emergency requests highlighted in red automatically.
// ============================================================

// ─── CONFIGURATION ───────────────────────────────────────────
var SHEET_NAME       = 'Leads';
var NOTIFY_EMAIL     = '';       // e.g. 'info@bioguard.co.ke'
var EMERGENCY_EMAIL  = '';       // e.g. 'emergency@bioguard.co.ke' (separate urgent alert)
var EMAIL_SUBJECT    = '🦟 New Pest Control Quote — BioGuard';
var EMERGENCY_SUBJECT = '🚨 EMERGENCY PEST REQUEST — BioGuard';
// ─────────────────────────────────────────────────────────────

/**
 * Handles POST from the website quote form.
 */
function doPost(e) {
  try {
    var p = e.parameter;

    var name         = p.name         || '';
    var phone        = p.phone        || '';
    var email        = p.email        || '—';
    var pest         = p.pest         || 'Not specified';
    var propertyType = p.propertyType || 'Not specified';
    var location     = p.location     || 'Not specified';
    var urgency      = p.urgency      || 'Flexible';
    var notes        = p.notes        || '—';
    var ts           = p.submittedAt  || new Date().toLocaleString();
    var pageUrl      = p.pageUrl      || '—';
    var ua           = p.userAgent    || '—';

    // Server-side validation
    if (!name || !phone || !pest) {
      return jsonResponse({ result: 'error', error: 'Name, phone, and pest type are required.' });
    }

    // Detect if emergency
    var isEmergency = urgency.toLowerCase().indexOf('emergency') !== -1;

    // Detect device from user agent
    var device = /android|iphone|ipad|mobile/i.test(ua) ? 'Mobile' : 'Desktop';

    // Get or create sheet
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);

      // Header row
      sheet.appendRow([
        'Timestamp (Nairobi)',
        'Full Name',
        'Phone',
        'Email',
        'Pest Type',
        'Property Type',
        'Location / Estate',
        'Urgency',
        'Notes',
        'Status',
        'Assigned Technician',
        'Quote Sent',
        'Treatment Date',
        'Device',
        'Page URL',
      ]);

      // Style header row
      var hdr = sheet.getRange(1, 1, 1, 15);
      hdr.setFontWeight('bold');
      hdr.setBackground('#0f2219');
      hdr.setFontColor('#d4860a');
      sheet.setFrozenRows(1);

      // Column widths
      var widths = [200, 160, 140, 200, 160, 160, 180, 220, 280, 120, 180, 110, 130, 100, 220];
      widths.forEach(function(w, i) { sheet.setColumnWidth(i + 1, w); });
    }

    // Append new lead row
    sheet.appendRow([
      ts,
      name,
      phone,
      email,
      pest,
      propertyType,
      location,
      urgency,
      notes,
      isEmergency ? 'EMERGENCY' : 'New',   // Status
      '',   // Assigned Technician
      '',   // Quote Sent (Y/N)
      '',   // Treatment Date
      device,
      pageUrl,
    ]);

    // Row styling — emergency rows in red, normal in light green tint
    var lastRow = sheet.getLastRow();
    if (isEmergency) {
      sheet.getRange(lastRow, 1, 1, 15).setBackground('#fde8e8');
      sheet.getRange(lastRow, 8).setFontColor('#c0392b').setFontWeight('bold');
      sheet.getRange(lastRow, 10).setFontColor('#c0392b').setFontWeight('bold');
    } else {
      sheet.getRange(lastRow, 1, 1, 15).setBackground('#eef6ee');
    }

    // Bold the pest and location columns for fast reading
    sheet.getRange(lastRow, 5, 1, 3).setFontWeight('bold');

    // ── Email notifications ──────────────────────────────────
    var emailBody =
      '🦟 New Pest Control Quote Request — BioGuard\n\n' +
      'Name         : ' + name         + '\n' +
      'Phone        : ' + phone        + '\n' +
      'Email        : ' + email        + '\n' +
      'Pest Type    : ' + pest         + '\n' +
      'Property     : ' + propertyType + '\n' +
      'Location     : ' + location     + '\n' +
      'Urgency      : ' + urgency      + '\n' +
      'Notes        : ' + notes        + '\n\n' +
      'Submitted    : ' + ts           + '\n' +
      'Device       : ' + device       + '\n\n' +
      'Open spreadsheet: ' + ss.getUrl();

    // Standard notification
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        isEmergency ? EMERGENCY_SUBJECT : EMAIL_SUBJECT,
        emailBody
      );
    }

    // Separate emergency alert to a different address
    if (isEmergency && EMERGENCY_EMAIL && EMERGENCY_EMAIL !== NOTIFY_EMAIL) {
      MailApp.sendEmail(EMERGENCY_EMAIL, EMERGENCY_SUBJECT, emailBody);
    }

    return jsonResponse({ result: 'success' });

  } catch (err) {
    Logger.log('doPost error: ' + err.message);
    return jsonResponse({ result: 'error', error: err.message });
  }
}


/**
 * Health check — open the Web App URL in a browser to confirm it's live.
 */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<h2 style="font-family:Georgia,serif;color:#d4860a;background:#0f2219;padding:40px;margin:0">' +
    '✓ BioGuard Quote Webhook — LIVE</h2>' +
    '<p style="font-family:sans-serif;background:#0f2219;color:#5a8060;padding:0 40px 40px">' +
    'POST quote form data here to log leads.</p>'
  );
}


/**
 * JSON response helper.
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
