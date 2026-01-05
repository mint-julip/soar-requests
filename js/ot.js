// ---------------- OT.JS ----------------

// ---------------- CONFIG ----------------
const HR_EMAILS = ["soarhr@soartn.org"]; // HR emails to notify
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE"; // Replace with your Google Script URL

// Initialize EmailJS (make sure config.js already initialized EmailJS)
if (typeof emailjs !== "undefined") {
  console.log("EmailJS ready");
} else {
  console.warn("EmailJS not loaded");
}

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
  doc.setTextColor(0);
  doc.text(`Ticket #: ${data.ticket}`, 20, 42);
  doc.text(`Submitted: ${data.submittedDate}`, 140, 42);

  // Requester Info
  doc.setFontSize(12);
  doc.text("Requester Info:", 20, 54);
  doc.setFontSize(11);
  doc.text(`Name: ${data.requester}`, 25, 62);
  doc.text(`Email: ${data.requesterEmail}`, 25, 68);

  // Employee Info
  doc.setFontSize(12);
  doc.text("Employee Info:", 20, 78);
  doc.setFontSize(11);
  doc.text(`Name: ${data.employee}`, 25, 86);
  doc.text(`Email: ${data.email}`, 25, 92);
  doc.text(`House / Dept: ${data.house}`, 25, 98);
  doc.text(`Supervisor: ${data.supervisor}`, 25, 104);

  // OT Details
  doc.setFontSize(12);
  doc.text("OT Details:", 20, 114);
  doc.setFontSize(11);
  doc.text(`Date(s): ${data.otDates}`, 25, 122);
  doc.text(`Shift(s): ${data.shifts}`, 25, 128);
  doc.text(`Hours: ${data.hours}`, 25, 134);
  doc.text(`Call List Exhausted: ${data.callExhausted}`, 25, 140);

  // Reason
  doc.setFontSize(12);
  doc.text("Reason for OT:", 20, 150);
  doc.setFontSize(11);
  const reasonLines = doc.splitTextToSize(data.reason, 170);
  doc.text(reasonLines, 20, 158);

  return doc.output("datauristring").split(",")[1]; // base64
}

// ---------------- MAIN SUBMIT ----------------
function submitOT() {
  const btn = document.getElementById("submitBtn");
  if (!btn) return;

  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("requester").value.trim();
  const requesterEmail = document.getElementById("requesterEmail").value.trim();
  const employee = document.getElementById("employee").value.trim();
  const email = document.getElementById("email").value.trim();
  const house = document.getElementById("house").value.trim();
  const supervisor = document.getElementById("supervisor").value.trim();
  const otDates = document.getElementById("otDates").value.trim();
  const shifts = document.getElementById("shifts").value.trim();
  const hours = document.getElementById("hours").value.trim();
  const reason = document.getElementById("reason").value.trim();
  const callExhausted = document.getElementById("callExhausted").value;

  if (!requester || !requesterEmail || !employee || !email || !house || !supervisor || !otDates || !shifts || !hours || !reason || !callExhausted) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    type: "Overtime",
    ticket,
    requester,
    requesterEmail,
    employee,
    email,
    house,
    supervisor,
    otDates,
    shifts,
    hours,
    reason,
    callExhausted,
    submittedDate
  };

  payload.pdfBase64 = generatePDFBase64(payload);

  // ---------------- SEND EMAIL TO HR ----------------
  HR_EMAILS.forEach(hrEmail => {
    emailjs.send("service_lk56r2m", "template_ot_request", {
      ...payload,
      to_email: hrEmail,
      attachment: payload.pdfBase64
    }).then(() => console.log(`OT request sent to ${hrEmail}`))
      .catch(err => console.error("HR Email Error:", err));
  });

  // ---------------- AUTO-REPLY TO EMPLOYEE ----------------
  emailjs.send("service_lk56r2m", "template_ot_auto", {
    requester,
    requester_email: requesterEmail,
    employee,
    employee_email: email,
    ticket,
    otDates,
    shifts,
    hours
  }).then(() => console.log("OT auto-reply sent"))
    .catch(err => console.error("Auto-reply Error:", err));

  // ---------------- LOG TO GOOGLE SHEET ----------------
  if (typeof GOOGLE_SCRIPT_URL !== "undefined") {
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload)
    }).catch(err => console.error("Google Sheet logging error:", err));
  }

  // ---------------- UI FEEDBACK ----------------
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
