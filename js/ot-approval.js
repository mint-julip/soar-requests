// ---------------- CONFIG ----------------
emailjs.init("sLNm5JCzwihAuVon0"); // Your EmailJS public key

// Optional: default CC from settings (could be pulled from spreadsheet via Apps Script)
// const DEFAULT_CC = "marialaulusa@soartn.org";
const DEFAULT_CC = "soarhr@soartn.org";

// ---------------- HELPER ----------------
function sendOTApprovalEmail(data, approved = true) {
  const templateId = approved ? "template_f5t0nig" : "template_zyx9oic";

  // Compose email data for EmailJS
  const emailData = {
    ticket: data.ticket,
    requester_name: data.requester,
    requester_email: data.email,
    employee: data.employee,
    otDates: data.otDates,
    otShifts: data.otShifts,
    hours: data.hours,
    reason: data.reason,
    approval_comments: data.comments || "",
    cc_email: DEFAULT_CC
  };

  emailjs.send("service_lk56r2m", templateId, emailData)
    .then(() => {
      console.log(`OT ${approved ? "approved" : "denied"} email sent for ticket ${data.ticket}`);
      alert(`OT request ${approved ? "approved" : "denied"} successfully!`);
    })
    .catch(err => {
      console.error("EmailJS OT approval error:", err);
      alert("Failed to send OT approval email. Check console.");
    });
}

// ---------------- APPROVE ----------------
function approveOT(ticket) {
  const comments = prompt("Optional: Enter approval comments:");

  const payload = {
    ticket,
    comments,
    status: "Approved"
  };

  // Update Google Sheet via Apps Script
  fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload)
  }).catch(err => console.error("Google Sheet update error:", err));

  // Send approval email
  sendOTApprovalEmail(payload, true);

  // Optional: visual feedback
  launchConfetti();
}

// ---------------- DENY ----------------
function denyOT(ticket) {
  const comments = prompt("Optional: Enter denial reason:");

  const payload = {
    ticket,
    comments,
    status: "Denied"
  };

  // Update Google Sheet via Apps Script
  fetch("https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload)
  }).catch(err => console.error("Google Sheet update error:", err));

  // Send denial email
  sendOTApprovalEmail(payload, false);
}

// ---------------- CONFETTI ----------------
function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  }
}

// ---------------- ATTACH EVENTS ----------------
document.addEventListener("DOMContentLoaded", () => {
  // Buttons with data-ticket attribute
  const approveBtns = document.querySelectorAll(".approve-ot-btn");
  const denyBtns = document.querySelectorAll(".deny-ot-btn");

  approveBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const ticket = btn.getAttribute("data-ticket");
      approveOT(ticket);
    });
  });

  denyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const ticket = btn.getAttribute("data-ticket");
      denyOT(ticket);
    });
  });
});
