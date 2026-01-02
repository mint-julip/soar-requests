// ---------------- CONFIG ----------------
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";
const HR_EMAILS = ["soarhr@soartn.org"];
const EMAILJS_PUBLIC_KEY = "sLNm5JCzwihAuVon0";

/**
 * SOAR Unified Intake Endpoint
 * Handles: Service, Maintenance, OT, Expense
 */

function doPost(e) {
  try {
    const sheetName = "Requests"; // single master sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

    const data = JSON.parse(e.postData.contents);

    // Flatten payload (safe for Sheets)
    const rowData = {
      Timestamp: new Date(),
      Type: data.type || "",
      Ticket: data.ticket || "",
      Requester: data.requester || "",
      Email: data.email || "",
      Department: data.department || data.house || "",
      Priority: data.priority || "",
      Description: data.description || "",
      SubmittedDate: data.submittedDate || "",

      // Maintenance
      ExpectedCompletion: data.expectedDate || "",
      Supplies: data.supplies || "",

      // OT
      Employee: data.employee || "",
      OTDates: data.otDates || "",
      OTShifts: data.otShifts || "",
      Hours: data.hours || "",
      CallListExhausted: data.callExhausted ?? "",

      // Expense
      ExpenseType: data.expenseType || "",
      Amount: data.amount || "",
      ExpenseDate: data.date || "",

      Status: data.status || "Submitted"
    };

    ensureHeaders(sheet, Object.keys(rowData));
    appendRow(sheet, rowData);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Ensure headers exist
 */
function ensureHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
}

/**
 * Append data in correct column order
 */
function appendRow(sheet, rowData) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => rowData[h] ?? "");
  sheet.appendRow(row);
}
