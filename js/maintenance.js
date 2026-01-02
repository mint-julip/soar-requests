// ---------------- CONFIG ----------------
emailjs.init("sLNm5JCzwihAuVon0"); // Your EmailJS public key
// const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";;

// const HR_EMAILS = [
//   "soarhr@soartn.org"
// ];

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
  const doc = new jsPDF();

  // ---------------- HEADER ----------------
  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text("SOAR TN", 105, 20, { align: "center" });
  doc.setFontSize(14);
  doc.text("Maintenance Request", 105, 28, { align: "center" });

  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.8);
  doc.line(20, 32, 190, 32); // underline

  // ---------------- TICKET & DATE ----------------
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Ticket #: ${data.ticket}`, 20, 42);
  doc.text(`Submitted: ${data.submittedDate}`, 140, 42);

  // ---------------- REQUESTER INFO ----------------
  doc.setFontSize(12);
  doc.text("Requester Information:", 20, 52);
  doc.setFontSize(11);
  doc.text(`Name: ${data.requester}`, 25, 60);
  doc.text(`Email: ${data.email}`, 25, 66);
  doc.text(`House / Dept: ${data.house}`, 25, 72);
  doc.text(`Priority: ${data.priority}`, 25, 78);
  doc.text(`Expected Completion: ${data.expectedDate}`, 25, 84);

  // ---------------- DESCRIPTION ----------------
  doc.setFontSize(12);
  doc.text("Description of Issue:", 20, 96);
  doc.setFontSize(11);
  const descLines = doc.splitTextToSize(data.description, 170);
  doc.text(descLines, 20, 104);

  // ---------------- SUPPLIES ----------------
  doc.setFontSize(12);
  doc.text("Supplies / Parts Needed:", 20, 140);
  doc.setFontSize(11);
  const suppliesLines = doc.splitTextToSize(data.supplies || "N/A", 170);
  doc.text(suppliesLines, 20, 148);

  // ---------------- MAINTENANCE USE ONLY ----------------
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("----- Maintenance Use Only -----", 20, 180);
  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.text("Materials Cost: ____________________", 20, 190);
  doc.text("Mileage: ____________________", 20, 200);
  doc.text("Completed Date: ____________________", 20, 210);
  doc.text("Comments:", 20, 220);
  doc.setLineWidth(0.3);
  doc.line(20, 225, 190, 225); // line for comments
  doc.line(20, 230, 190, 230);
  doc.line(20, 235, 190, 235);

  // ---------------- OUTPUT ----------------
  return doc.output("datauristring").split(",")[1]; // base64 string
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
