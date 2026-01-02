// ---------------- CONFIG ----------------
emailjs.init("sLNm5JCzwihAuVon0"); // Your EmailJS public key
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";

const HR_EMAILS = [
  "soarhr@soartn.org"
];

// ---------------- HELPERS ----------------
function generateTicket() {
  return "SOAR-OT-" + Date.now();
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }
}

function generatePDFBase64(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("SOAR TN - OT Request", 20, 20);

  doc.setFontSize(11);
  doc.text(`Ticket #: ${data.ticket}`, 20, 30);
  doc.text(`Date Submitted: ${data.submittedDate}`, 20, 38);
  doc.text(`Requester: ${data.requester}`, 20, 46);
  doc.text(`Email: ${data.email}`, 20, 54);
  doc.text(`Employee: ${data.employee}`, 20, 62);
  doc.text(`OT Date(s): ${data.otDates}`, 20, 70);
  doc.text(`OT Shift(s): ${data.otShifts}`, 20, 78);
  doc.text(`Hours: ${data.hours}`, 20, 86);
  doc.text(`Reason:`, 20, 94);
  doc.text(doc.splitTextToSize(data.reason, 170), 20, 102);
  doc.text(`Has Call List Been Exhausted?: ${data.callListExhausted}`, 20, 140);

  doc.text("----- For Admin Use Only -----", 20, 160);
  doc.text("Approved By: ____________", 20, 170);
  doc.text("Date Approved: ____________", 20, 180);
  doc.text("Comments:", 20, 190);

  return doc.output("datauristring").split(",")[1];
}

// ---------------- MAIN SUBMIT ----------------
function submitOTRequest() {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("requester").value.trim();
  const email = document.getElementById("contact").value.trim();
  const employee = document.getElementById("employee").value.trim();
  const otDates = document.getElementById("otDates").value.trim();
  const otShifts = document.getElementById("otShifts").value.trim();
  const hours = document.getElementById("hours").value.trim();
  const reason = document.getElementById("reason").value.trim();
  const callListExhausted = document.getElementById("callListExhausted").value;

  if (!requester || !email || !employee || !otDates || !otShifts || !hours || !reason || !callListExhausted) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    ticket,
    submittedDate,
    requester,
    email,
    employee,
    otDates,
    otShifts,
    hours,
    reason,
    callListExhausted
  };

  payload.pdfBase64 = generatePDFBase64(payload);

  // ---------------- SEND EMAILS ----------------
  // HR email with PDF attachment
  HR_EMAILS.forEach(hrEmail => {
    emailjs.send("service_lk56r2m", "template_78v4e8s", {
      ...payload,
      to_email: hrEmail,
      attachment: payload.pdfBase64
    }).then(() => console.log(`Email sent to ${hrEmail}`))
      .catch(err => console.error("HR Email Error:", err));
  });

  // Auto-reply to requester
  emailjs.send("service_lk56r2m", "template_78v4e8s", {
    requester_name: requester,
    requester_email: email,
    ticket,
    employee,
    otDates,
    otShifts,
    hours,
    reason,
    callListExhausted
  }).then(() => console.log("Auto-reply sent to requester"))
    .catch(err => console.error("Auto-reply Error:", err));

  // ---------------- LOG TO GOOGLE SHEET ----------------
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload)
  }).catch(err => console.error("Google Sheet logging error:", err));

  // ---------------- UI FEEDBACK ----------------
  launchConfetti();
  document.getElementById("ticketDisplay").textContent = ticket;
  document.getElementById("successBox").style.display = "block";

  setTimeout(() => {
    btn.disabled = false;
    window.location.href = "index.html";
  }, 5000);
}

// ---------------- ATTACH EVENT ----------------
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) submitBtn.addEventListener("click", submitOTRequest);
});
