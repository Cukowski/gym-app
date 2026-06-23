/**
 * Iron Tempo Tri — Google Sheets backend v2
 *
 * What changed in v2:
 * - POST still appends workout/cardio records to Google Sheets.
 * - GET?action=list&callback=... returns all records as JSONP, so GitHub Pages,
 *   iPhone Safari, and laptop browsers can pull the same history.
 *
 * Setup / update:
 * 1) Open your Google Sheet → Extensions → Apps Script.
 * 2) Replace Code.gs with this file.
 * 3) Run setup() once if you have not already.
 * 4) Deploy → Manage deployments → Edit → Version: New version → Deploy.
 *    Keep the same Web App URL if possible.
 * 5) In Iron Tempo Tri → Settings, paste that Web App URL.
 */

const SHEET_NAME = 'WorkoutLog';
const HEADERS = [
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
];

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  } else {
    const current = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
    const hasHeaders = current.some(String);
    if (!hasHeaders) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'info';
    const callback = sanitizeCallback_((e && e.parameter && e.parameter.callback) || '');

    if (action === 'list') {
      const payload = { ok: true, records: readRecords_() };
      return output_(payload, callback);
    }

    if (action === 'ping') {
      return output_({ ok: true, app: 'Iron Tempo Tri', version: 2, time: new Date().toISOString() }, callback);
    }

    return output_({
      ok: true,
      app: 'Iron Tempo Tri',
      version: 2,
      message: 'Use POST to append records. Use GET?action=list&callback=yourCallback to read records.'
    }, callback);
  } catch (err) {
    return output_({ ok: false, error: String(err) }, '');
  }
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
    appendRecord_(sheet, record);

    return output_({ ok: true }, '');
  } catch (err) {
    return output_({ ok: false, error: String(err) }, '');
  }
}

function appendRecord_(sheet, record) {
  const sets = record.type === 'strength' ? `${record.doneSets || 0}/${record.totalSets || 0}` : '';
  sheet.appendRow([
    new Date().toISOString(),
    record.id || '',
    record.date || '',
    record.type || '',
    record.title || '',
    record.durationMin || '',
    record.distanceKm || '',
    record.volumeKg || '',
    sets,
    record.intensity || '',
    record.strava || '',
    record.notes || '',
    JSON.stringify(record.details || record)
  ]);
}

function readRecords_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName(SHEET_NAME);
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return [];

  const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  const headers = values.shift().map(String);

  return values
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => rowToRecord_(headers, row))
    .filter(r => r && r.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function rowToRecord_(headers, row) {
  const obj = {};
  headers.forEach((h, i) => obj[h] = row[i]);

  let details = [];
  try {
    const raw = obj.detailsJson ? String(obj.detailsJson) : '';
    const parsed = raw ? JSON.parse(raw) : [];
    details = Array.isArray(parsed) ? parsed : (parsed.details || []);
  } catch (err) {
    details = [];
  }

  const sets = String(obj.sets || '').split('/');
  const doneSets = Number(sets[0] || 0) || 0;
  const totalSets = Number(sets[1] || 0) || 0;

  return {
    id: String(obj.id || ''),
    date: dateToIso_(obj.date),
    type: String(obj.type || ''),
    title: String(obj.title || ''),
    durationMin: Number(obj.durationMin || 0) || 0,
    distanceKm: Number(obj.distanceKm || 0) || 0,
    volumeKg: Number(obj.volumeKg || 0) || 0,
    doneSets: doneSets,
    totalSets: totalSets,
    intensity: String(obj.intensity || ''),
    strava: String(obj.strava || ''),
    notes: String(obj.notes || ''),
    details: details
  };
}

function dateToIso_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) return value.toISOString();
  const s = String(value || '');
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t).toISOString() : new Date().toISOString();
}

function output_(payload, callback) {
  const json = JSON.stringify(payload);
  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitizeCallback_(name) {
  const s = String(name || '');
  return /^[A-Za-z_$][0-9A-Za-z_$\.]*$/.test(s) ? s : '';
}
