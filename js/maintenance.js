// ---------------- CONFIG ----------------
emailjs.init("sLNm5JCzwihAuVon0"); // Your EmailJS public key
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";;

const HR_EMAILS = [
  "soarhr@soartn.org"
];

// ---------------- HELPERS ----------------
function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  }
}

function generatePDFBase64(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt" });

  doc.setFontSize(18);
  doc.text("SOAR TN - Maintenance Request", 40, 40);

  doc.setFontSize(12);
  doc.text(`Ticket #: ${data.ticket}`, 40, 70);
  doc.text(`Date Submitted: ${data.submittedDate}`, 40, 85);
  doc.text(`Requested By: ${data.requester}`, 40, 100);
  doc.text(`Email: ${data.email}`, 40, 115);
  doc.text(`House / Dept: ${data.house}`, 40, 130);
  doc.text(`Priority: ${data.priority}`, 40, 145);
  doc.text(`Expected Completion: ${data.expectedDate}`, 40, 160);

  doc.setFontSize(14);
  doc.text("Description:", 40, 185);
  doc.setFontSize(12);
  doc.text(doc.splitTextToSize(data.description, 500), 40, 200);

  doc.setFontSize(14);
  doc.text("Supplies / Parts Needed:", 40, 320);
  doc.setFontSize(12);
  doc.text(doc.splitTextToSize(data.supplies || "N/A", 500), 40, 335);

  doc.setFontSize(12);
  doc.text("----- Maintenance Use Only -----", 40, 400);
  doc.text("Materials Cost: ____________", 40, 420);
  doc.text("Mileage: ____________", 40, 440);
  doc.text("Completed Date: ____________", 40, 460);
  doc.text("Comments:", 40, 480);

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

  if (!requester || !email || !house || !priority || !description) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    type: "Maintenance",
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
  HR_EMAILS.forEach(hrEmail => {
    emailjs.send("service_lk56r2m", "template_vnfmovs", {
      ...payload,
      to_email: hrEmail,
      attachment: payload.pdfBase64
    }).then(() => console.log(`Email sent to ${hrEmail}`))
      .catch(err => console.error("HR Email Error:", err));
  });

  emailjs.send("service_lk56r2m", "template_foh2u7z", {
    requester_name: requester,
    requester_email: email,
    ticket,
    house,
    description,
    priority
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
  if (submitBtn) submitBtn.addEventListener("click", submitMaintenance);
});
