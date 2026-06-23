/**
 * Iron Tempo Tri — Google Sheets backend
 *
 * Setup:
 * 1) Create a Google Sheet.
 * 2) Extensions → Apps Script.
 * 3) Paste this file into Code.gs.
 * 4) Run setup() once and approve permissions.
 * 5) Deploy → New deployment → Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6) Copy the Web App URL into Iron Tempo Tri → Settings.
 */

const SHEET_NAME = 'WorkoutLog';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'receivedAt',
      'id',
      'date',
      'type',
      'title',
      'durationMin',
      'distanceKm',
      'volumeKg',
      'sets',
      'intensity',
      'strava',
      'notes',
      'detailsJson'
    ]);
  }

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, 13);
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, app: 'Iron Tempo Tri', message: 'POST workout records here.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      setup();
      sheet = ss.getSheetByName(SHEET_NAME);
    }

    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const record = JSON.parse(raw);

    sheet.appendRow([
      new Date().toISOString(),
      record.id || '',
      record.date || '',
      record.type || '',
      record.title || '',
      record.durationMin || '',
      record.distanceKm || '',
      record.volumeKg || '',
      record.type === 'strength' ? `${record.doneSets || 0}/${record.totalSets || 0}` : '',
      record.intensity || '',
      record.strava || '',
      record.notes || '',
      JSON.stringify(record.details || record)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
