// ---------------- CONFIG ----------------
emailjs.init("sLNm5JCzwihAuVon0"); // Replace with your EmailJS key
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec"; // URL of your Apps Script
const HR_EMAILS = ["soarhr@soartn.org"];

// ---------------- HELPERS ----------------
function generateTicket() { return "OT-" + Date.now(); }

function launchConfetti() {
  if (window.confetti) confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
}

function generatePDFBase64(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("SOAR TN - OT Request", 20, 20);

  doc.setFontSize(11);
  doc.text(`Ticket #: ${data.ticket}`, 20, 30);
  doc.text(`Submitted: ${data.submittedDate}`, 20, 38);
  doc.text(`Requester: ${data.requester}`, 20, 46);
  doc.text(`Email: ${data.email}`, 20, 54);
  doc.text(`House: ${data.house}`, 20, 62);
  doc.text(`OT Date: ${data.otDate}`, 20, 70);
  doc.text(`Hours: ${data.hours}`, 20, 78);

  doc.text("Description:", 20, 90);
  doc.text(doc.splitTextToSize(data.description, 170), 20, 98);

  return doc.output("datauristring").split(",")[1];
}

// ---------------- MAIN SUBMIT ----------------
async function submitOT() {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  const requester = document.getElementById("requester").value.trim();
  const email = document.getElementById("contact").value.trim();
  const house = document.getElementById("house").value;
  const otDate = document.getElementById("otDate").value;
  const hours = document.getElementById("hours").value;
  const description = document.getElementById("description").value.trim();
  const submittedDate = new Date().toLocaleString();
  const ticket = generateTicket();

  if (!requester || !email || !house || !otDate || !hours || !description) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = { ticket, requester, email, house, otDate, hours, description, submittedDate };
  payload.pdfBase64 = generatePDFBase64(payload);

  // Email HR
  HR_EMAILS.forEach(hrEmail => {
    emailjs.send("service_lk56r2m", "template_ot_request", {
      ...payload, to_email: hrEmail, attachment: payload.pdfBase64
    }).then(() => console.log(`Email sent to ${hrEmail}`))
      .catch(err => console.error("HR Email Error:", err));
  });

  // Log to Google Sheet
  fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) })
    .catch(err => console.error("Google Sheet logging error:", err));

  // Success UI
  launchConfetti();
  document.getElementById("ticketNum").textContent = ticket;
  document.getElementById("successBox").style.display = "block";

  setTimeout(() => { window.location.href = "index.html"; }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submitBtn").addEventListener("click", submitOT);
});
