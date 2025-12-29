/***********************************************************
 * SOAR TN – Maintenance Request (Client Script)
 * Includes:
 * - Ticket generation
 * - PDF generation (jsPDF)
 * - EmailJS (HR + auto-reply)
 * - Google Apps Script logging
 * - UI feedback
 ***********************************************************/

/* ================== CONFIG ================== */

// EmailJS
emailjs.init("sLNm5JCzwihAuVon0");

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";

// EmailJS service + templates
const EMAIL_SERVICE_ID = "service_lk56r2m";
const HR_TEMPLATE_ID = "template_vnfmovs";
const AUTO_REPLY_TEMPLATE_ID = "template_foh2u7z";

// HR recipients (used by EmailJS template)
const HR_EMAILS = ["soarhr@soartn.org"];

/* ================== HELPERS ================== */

function generateTicket() {
  return "SOAR-M-" + Date.now();
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

/* ================== PDF GENERATION ================== */

function generateMaintenancePDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("SOAR TN – Maintenance Request", 20, 20);

  doc.setFontSize(11);
  doc.text(`Submitted: ${new Date(data.timestamp).toLocaleString()}`, 20, 40);
  doc.text(`Ticket #: ${data.ticket}`, 20, 32);
  doc.text(`Type: ${data.type}`, 20, 48);
  doc.text(`Requested By: ${data.requester}`, 20, 48);
  doc.text(`Contact Email: ${data.contact}`, 20, 56);
  doc.text(`House / Dept: ${data.house_dept}`, 20, 64);
  doc.text(`Expected Completion: ${data.expected_date || "N/A"}`, 20, 72);

  doc.text("Description of Issue:", 20, 86);
  doc.text(doc.splitTextToSize(data.description, 170), 20, 94);

  doc.text("Supplies / Parts Needed:", 20, 134);
  doc.text(
    doc.splitTextToSize(data.amount_supplies || "N/A", 170),
    20,
    142
  );

  doc.text("----- Maintenance Use Only -----", 20, 182);
  doc.text("Assigned To: ____________________", 20, 192);
  doc.text("Completion Date: ________________", 20, 202);
  doc.text("Notes:", 20, 212);

  // Return Base64 (no prefix)
  return doc.output("datauristring").split(",")[1];
}

/* ================== MAIN SUBMIT ================== */

async function submitMaintenance() {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  // Collect form values
  const requester = document.getElementById("requester").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const houseDept = document.getElementById("house").value;
  const expectedDate = document.getElementById("expectedDate").value;
  const description = document.getElementById("description").value.trim();
  const supplies = document.getElementById("supplies").value.trim();

  // Validate
  if (!requester || !contact || !houseDept || !description) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  // Build payload
  const payload = {
    timestamp: new Date().toISOString(),
    ticket: generateTicket(),
    type: "Maintenance",
    requester: requester,
    contact: contact,
    house_dept: houseDept,
    description: description,
    amount_supplies: supplies || "N/A",
    priority: "Normal",
    expected_date: expectedDate || "",
    status: "Submitted",
    assigned_to: "",
    last_updated: "",
    source_form: "Maintenance Form"
  };

  // Generate PDF
  payload.pdfBase64 = generateMaintenancePDF(payload);

  /* ========== EMAIL HR (with PDF) ========== */
  try {
    for (const hr of HR_EMAILS) {
      await emailjs.send(EMAIL_SERVICE_ID, HR_TEMPLATE_ID, {
        ...payload,
        to_email: hr,
        attachment: payload.pdfBase64
      });
    }
  } catch (err) {
    console.error("HR email error:", err);
  }

  /* ========== AUTO-REPLY (NO PDF) ========== */
  try {
    await emailjs.send(EMAIL_SERVICE_ID, AUTO_REPLY_TEMPLATE_ID, {
      requester_name: requester,
      requester_email: contact,
      ticket: payload.ticket,
      house: houseDept,
      description: description
    });
  } catch (err) {
    console.error("Auto-reply error:", err);
  }

  /* ========== LOG TO GOOGLE SHEETS ========== */
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Google Sheet error:", err);
  }

  /* ========== UI FEEDBACK ========== */
  launchConfetti();
  document.getElementById("ticketNum").textContent = payload.ticket;
  document.getElementById("successBox").style.display = "block";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}

/* ================== EVENT BINDING ================== */

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submitBtn");
  if (btn) btn.addEventListener("click", submitMaintenance);
});
