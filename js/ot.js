// ---------------- HELPERS ----------------
function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  } else {
    console.warn("Confetti not loaded");
  }
}

function generatePDFBase64(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text("SOAR TN", 105, 20, { align: "center" });
  doc.setFontSize(14);
  doc.text("Overtime Request", 105, 28, { align: "center" });

  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.8);
  doc.line(20, 32, 190, 32);

  // Ticket & Date
  doc.setFontSize(11);
  doc.text(`Ticket #: ${data.ticket}`, 20, 42);
  doc.text(`Submitted: ${data.submittedDate}`, 140, 42);

  // Employee Info
  doc.setFontSize(12);
  doc.text("Employee Information:", 20, 54);
  doc.setFontSize(11);
  doc.text(`Employee: ${data.employee}`, 25, 62);
  doc.text(`Email: ${data.email}`, 25, 68);
  doc.text(`House / Dept: ${data.house}`, 25, 74);
  doc.text(`Supervisor: ${data.supervisor}`, 25, 80);

  // OT Details
  doc.setFontSize(12);
  doc.text("Overtime Details:", 20, 92);
  doc.setFontSize(11);
  doc.text(`Date(s): ${data.otDates}`, 25, 100);
  doc.text(`Shift(s): ${data.otShifts}`, 25, 106);
  doc.text(`Hours Requested: ${data.hours}`, 25, 112);

  // Reason
  doc.setFontSize(12);
  doc.text("Reason for Overtime:", 20, 124);
  doc.setFontSize(11);
  const reasonLines = doc.splitTextToSize(data.reason, 170);
  doc.text(reasonLines, 20, 132);

  // Call List
  doc.setFontSize(12);
  doc.text(`Call List Exhausted: ${data.callExhausted}`, 20, 160);

  // Approval Section
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("----- Management Approval -----", 20, 180);
  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.text("Approved By: ____________________", 20, 192);
  doc.text("Approval Date: ____________________", 20, 202);
  doc.text("Comments:", 20, 212);
  doc.line(20, 217, 190, 217);
  doc.line(20, 222, 190, 222);

  return doc.output("datauristring").split(",")[1];
}

// ---------------- MAIN SUBMIT ----------------
function submitOT() {
  const btn = document.getElementById("submitBtn");
  if (!btn) return;

  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("requester").value.trim();
  const employee = document.getElementById("employee").value.trim();
  const email = document.getElementById("email").value.trim();
  const house = document.getElementById("house").value.trim();
  const supervisor = document.getElementById("supervisor").value.trim();
  const otDates = document.getElementById("otDates").value.trim();
  const otShifts = document.getElementById("otShifts").value.trim();
  const hours = document.getElementById("hours").value.trim();
  const reason = document.getElementById("reason").value.trim();
  const callExhausted = document.getElementById("callExhausted").value;

  // Validation
  if (!requester || !employee || !email || !house || !supervisor || !otDates || !otShifts || !hours || !reason || !callExhausted) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    type: "Overtime",
    ticket,
    requester,
    employee,
    email,
    house,
    supervisor,
    otDates,
    otShifts,
    hours,
    reason,
    callExhausted,
    submittedDate
  };

  payload.pdfBase64 = generatePDFBase64(payload);

  // Send to HR
  if (Array.isArray(HR_EMAILS)) {
    HR_EMAILS.forEach(hrEmail => {
      emailjs.send("service_lk56r2m", "template_ot_request", {
        ...payload,
        to_email: hrEmail,
        attachment: payload.pdfBase64
      })
      .then(() => console.log(`OT sent to ${hrEmail}`))
      .catch(err => console.error("HR Email Error:", err));
    });
  }

  // Auto reply to requester
  emailjs.send("service_lk56r2m", "template_ot_auto", {
    requester,
    requester_email: email,
    ticket,
    employee,
    otDates,
    hours
  })
  .then(() => console.log("OT auto-reply sent"))
  .catch(err => console.error("Auto-reply Error:", err));

  // Log to Google Sheets
  if (typeof GOOGLE_SCRIPT_URL !== "undefined") {
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload)
    }).catch(err => console.error("Google Sheet error:", err));
  }

  // UI Feedback
  launchConfetti();
  const ticketDisplay = document.getElementById("ticketDisplay");
  const successBox = document.getElementById("successBox");

  if (ticketDisplay) ticketDisplay.textContent = ticket;
  if (successBox) successBox.style.display = "block";

  setTimeout(() => {
    btn.disabled = false;
    window.location.href = "index.html";
  }, 5000);
}

// ---------------- ATTACH EVENT ----------------
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) submitBtn.addEventListener("click", submitOT);
});
// ---------------- HELPERS ----------------
function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  } else {
    console.warn("Confetti not loaded");
  }
}

function generatePDFBase64(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text("SOAR TN", 105, 20, { align: "center" });
  doc.setFontSize(14);
  doc.text("Overtime Request", 105, 28, { align: "center" });

  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.8);
  doc.line(20, 32, 190, 32);

  // Ticket & Date
  doc.setFontSize(11);
  doc.text(`Ticket #: ${data.ticket}`, 20, 42);
  doc.text(`Submitted: ${data.submittedDate}`, 140, 42);

  // Employee Info
  doc.setFontSize(12);
  doc.text("Employee Information:", 20, 54);
  doc.setFontSize(11);
  doc.text(`Employee: ${data.employee}`, 25, 62);
  doc.text(`Email: ${data.email}`, 25, 68);
  doc.text(`House / Dept: ${data.house}`, 25, 74);
  doc.text(`Supervisor: ${data.supervisor}`, 25, 80);

  // OT Details
  doc.setFontSize(12);
  doc.text("Overtime Details:", 20, 92);
  doc.setFontSize(11);
  doc.text(`Date(s): ${data.otDates}`, 25, 100);
  doc.text(`Shift(s): ${data.otShifts}`, 25, 106);
  doc.text(`Hours Requested: ${data.hours}`, 25, 112);

  // Reason
  doc.setFontSize(12);
  doc.text("Reason for Overtime:", 20, 124);
  doc.setFontSize(11);
  const reasonLines = doc.splitTextToSize(data.reason, 170);
  doc.text(reasonLines, 20, 132);

  // Call List
  doc.setFontSize(12);
  doc.text(`Call List Exhausted: ${data.callExhausted}`, 20, 160);

  // Approval Section
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("----- Management Approval -----", 20, 180);
  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.text("Approved By: ____________________", 20, 192);
  doc.text("Approval Date: ____________________", 20, 202);
  doc.text("Comments:", 20, 212);
  doc.line(20, 217, 190, 217);
  doc.line(20, 222, 190, 222);

  return doc.output("datauristring").split(",")[1];
}

// ---------------- MAIN SUBMIT ----------------
function submitOT() {
  const btn = document.getElementById("submitBtn");
  if (!btn) return;

  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("requester").value.trim();
  const employee = document.getElementById("employee").value.trim();
  const email = document.getElementById("email").value.trim();
  const house = document.getElementById("house").value.trim();
  const supervisor = document.getElementById("supervisor").value.trim();
  const otDates = document.getElementById("otDates").value.trim();
  const otShifts = document.getElementById("otShifts").value.trim();
  const hours = document.getElementById("hours").value.trim();
  const reason = document.getElementById("reason").value.trim();
  const callExhausted = document.getElementById("callExhausted").value;

  // Validation
  if (!requester || !employee || !email || !house || !supervisor || !otDates || !otShifts || !hours || !reason || !callExhausted) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    type: "Overtime",
    ticket,
    requester,
    employee,
    email,
    house,
    supervisor,
    otDates,
    otShifts,
    hours,
    reason,
    callExhausted,
    submittedDate
  };

  payload.pdfBase64 = generatePDFBase64(payload);

  // Send to HR
  if (Array.isArray(HR_EMAILS)) {
    HR_EMAILS.forEach(hrEmail => {
      emailjs.send("service_lk56r2m", "template_ot_request", {
        ...payload,
        to_email: hrEmail,
        attachment: payload.pdfBase64
      })
      .then(() => console.log(`OT sent to ${hrEmail}`))
      .catch(err => console.error("HR Email Error:", err));
    });
  }

  // Auto reply to requester
  emailjs.send("service_lk56r2m", "template_ot_auto", {
    requester,
    requester_email: email,
    ticket,
    employee,
    otDates,
    hours
  })
  .then(() => console.log("OT auto-reply sent"))
  .catch(err => console.error("Auto-reply Error:", err));

  // Log to Google Sheets
  if (typeof GOOGLE_SCRIPT_URL !== "undefined") {
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload)
    }).catch(err => console.error("Google Sheet error:", err));
  }

  // UI Feedback
  launchConfetti();
  const ticketDisplay = document.getElementById("ticketDisplay");
  const successBox = document.getElementById("successBox");

  if (ticketDisplay) ticketDisplay.textContent = ticket;
  if (successBox) successBox.style.display = "block";

  setTimeout(() => {
    btn.disabled = false;
    window.location.href = "index.html";
  }, 5000);
}

// ---------------- ATTACH EVENT ----------------
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) submitBtn.addEventListener("click", submitOT);
});
