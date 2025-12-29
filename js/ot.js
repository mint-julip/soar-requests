// ---------------- CONFIG ----------------
emailjs.init("sLNm5JCzwihAuVon0"); // Replace with your EmailJS key
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec"; // URL of your Apps Script
const HR_EMAILS = ["soarhr@soartn.org"];

// ---------------- HELPERS ----------------
function generateTicket() {
  return "SOAR-OT-" + Date.now();
}

// Launch confetti
function launchConfetti() {
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
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
  doc.text(`Department: ${data.department}`, 20, 62);
  doc.text(`OT Date: ${data.otDate}`, 20, 70);
  doc.text(`Hours Requested: ${data.hours}`, 20, 78);

  doc.text("Description:", 20, 90);
  doc.text(doc.splitTextToSize(data.description, 170), 20, 98);

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
  const department = document.getElementById("department").value;
  const priority = document.getElementById("priority").value;
  const otDate = document.getElementById("otDate").value;
  const hours = document.getElementById("hours").value;
  const description = document.getElementById("description").value.trim();

  // Validate required fields
  if (!requester || !email || !department || !priority || !otDate || !hours || !description) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    ticket,
    requester,
    email,
    department,
    priority,
    otDate,
    hours,
    description,
    submittedDate,
    type: "OT Requests"
  };

  payload.pdfBase64 = generatePDFBase64(payload);

  // ---------------- SEND EMAILS ----------------
  HR_EMAILS.forEach(hrEmail => {
    emailjs.send("service_lk56r2m", "template_78v4e8s", {
      ...payload,
      to_email: hrEmail,
      attachment: payload.pdfBase64
    }).catch(err => console.error("HR Email Error:", err));
  });

  // Auto-reply to requester
  emailjs.send("service_lk56r2m", "template_foh2u7z", {
    requester_name: requester,
    requester_email: email,
    ticket: ticket,
    department: department,
    otDate: otDate,
    hours: hours,
    description: description
  }).catch(err => console.error("Auto-reply Error:", err));

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
    window.location.href = "index.html";
  }, 5000);
}

// ---------------- ATTACH EVENT ----------------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submitBtn").addEventListener("click", submitOTRequest);
});
