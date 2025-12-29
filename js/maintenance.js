// ---------------- CONFIG ----------------
emailjs.init("sLNm5JCzwihAuVon0"); // Your EmailJS public key
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";

const HR_EMAILS = [
  "soarhr@soartn.org"
  // "cherylhintz@soartn.org",
  // "alishasanders@soartn.org",
  // "kobypresley@soartn.org"
];

// ---------------- HELPERS ----------------
function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
}

function generatePDFBase64(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("SOAR TN - Maintenance Request", 20, 20);

  doc.setFontSize(11);
  doc.text(`Ticket #: ${data.ticket}`, 20, 30);
  doc.text(`Date Submitted: ${data.submittedDate}`, 20, 38);
  doc.text(`Requested By: ${data.requester}`, 20, 48);
  doc.text(`Email: ${data.email}`, 20, 56);
  doc.text(`House / Dept: ${data.house}`, 20, 64);
  doc.text(`Priority: ${data.priority}`, 20, 72);
  doc.text(`Expected Completion: ${data.expectedDate}`, 20, 80);

  doc.text("Description:", 20, 92);
  doc.text(doc.splitTextToSize(data.description, 170), 20, 100);

  doc.text("Supplies / Parts Needed:", 20, 140);
  doc.text(doc.splitTextToSize(data.supplies || "N/A", 170), 20, 148);

  doc.text("----- Maintenance Use Only -----", 20, 180);
  doc.text("Materials Cost: ____________", 20, 190);
  doc.text("Mileage: ____________", 20, 200);
  doc.text("Completed Date: ____________", 20, 210);
  doc.text("Comments:", 20, 220);

  return doc.output("datauristring").split(",")[1];
}

// ---------------- MAIN SUBMIT ----------------
function submitMaintenance() {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("requester").value.trim();
  const email = document.getElementById("contact").value.trim();
  const house = document.getElementById("house").value;
  const priority = document.getElementById("priority").value;
  const expectedDate = document.getElementById("expectedDate").value;
  const description = document.getElementById("description").value.trim();
  const supplies = document.getElementById("supplies").value.trim();

  // Validate required fields
  if (!requester || !email || !house || !priority || !description) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    ticket,
    requester,
    email,
    house,
    priority,
    expectedDate,
    description,
    supplies,
    submittedDate
  };

  payload.pdfBase64 = generatePDFBase64(payload);

  // ---------------- SEND EMAILS ----------------
  // HR email with PDF attachment
  HR_EMAILS.forEach(hrEmail => {
    emailjs.send("service_lk56r2m", "template_vnfmovs", {
      ...payload,
      to_email: hrEmail,
      attachment: payload.pdfBase64
    }).then(() => console.log(`Email sent to ${hrEmail}`))
      .catch(err => console.error("HR Email Error:", err));
  });

  // Auto-reply to requester
  emailjs.send("service_lk56r2m", "template_foh2u7z", {
    requester_name: requester,
    requester_email: email,
    ticket: ticket,
    house: house,
    description: description,
    priority: priority
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

  // Reset button after 5 seconds
  setTimeout(() => {
    btn.disabled = false;
    window.location.href = "index.html";
  }, 5000);
}

// ---------------- ATTACH EVENT ----------------
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitMaintenance);
  }
});
