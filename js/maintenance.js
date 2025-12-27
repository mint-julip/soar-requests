// ---------------- CONFIG ----------------
emailjs.init("sLNm5JCzwihAuVon0"); // <-- Your EmailJS Public Key
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"; // <-- Your Google Apps Script Web App
const HR_EMAILS = ["soarhr@soartn.org"]; //add other emails here
const HR_TEMPLATE_ID = "template_vnfmovs"; // HR email template
const AUTO_REPLY_TEMPLATE_ID = "template_foh2u7z";  // Requester auto-reply template

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
  doc.text(`Requested By: ${data.requester}`, 20, 46);
  doc.text(`Email: ${data.email}`, 20, 54);
  doc.text(`House: ${data.house}`, 20, 62);
  doc.text(`Expected Completion: ${data.expectedDate}`, 20, 70);
  doc.text("Description:", 20, 82);
  doc.text(doc.splitTextToSize(data.description, 170), 20, 90);
  doc.text("Supplies Needed:", 20, 130);
  doc.text(doc.splitTextToSize(data.supplies || "N/A", 170), 20, 138);
  doc.text("----- Maintenance Use Only -----", 20, 170);
  doc.text("Materials Cost: ____________", 20, 180);
  doc.text("Mileage: ____________", 20, 190);
  doc.text("Completed Date: ____________", 20, 200);
  doc.text("Comments:", 20, 210);

  return doc.output("datauristring").split(",")[1]; // Base64 string
}

// ---------------- MAIN SUBMIT ----------------
function submitMaintenance() {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("requester").value.trim();
  const email = document.getElementById("email").value.trim();
  const house = document.getElementById("house").value;
  const expectedDate = document.getElementById("expectedDate").value;
  const description = document.getElementById("description").value.trim();
  const supplies = document.getElementById("supplies").value.trim();

  if (!requester || !email || !house || !description) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    ticket,
    requester,
    email,
    house,
    expectedDate,
    description,
    supplies,
    submittedDate
  };

  // Generate PDF base64
  payload.pdfBase64 = generatePDFBase64(payload);

  // ---------------- SEND EMAILS ----------------
  // 1️⃣ Email to HR
  emailjs.send("service_lk56r2m", HR_TEMPLATE_ID, {
    ...payload,
    to_email: HR_EMAILS.join(","),
    attachment: payload.pdfBase64
  }).then(() => {
    console.log("HR email sent!");
  }).catch(err => console.error("HR EmailJS Error:", err));

  // 2️⃣ Auto-reply to requester
  emailjs.send("service_lk56r2m", AUTO_REPLY_TEMPLATE_ID, {
    ...payload,
    to_email: email,
    attachment: payload.pdfBase64
  }).then(() => {
    console.log("Auto-reply sent!");
  }).catch(err => console.error("Auto-reply Error:", err));

  // ---------------- LOG TO GOOGLE SHEETS ----------------
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload)
  }).catch(err => console.error("Google Sheet logging error:", err));

  // ---------------- SUCCESS UI ----------------
  launchConfetti();
  document.getElementById("ticketNum").textContent = ticket;
  document.getElementById("successBox").style.display = "block";

  // Redirect back after 5 seconds
  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}

