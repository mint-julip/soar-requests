emailjs.init("sLNm5JCzwihAuVon0");

const HR_EMAILS = ["soarhr@soartn.org"];
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";
const template_ot_approved = "template_f5t0nig";
const template_ot_denied = "template_zyx9oic";


async function submitApproval() {
  const ticket = document.getElementById("ticket").value.trim();
  const decision = document.getElementById("decision").value;
  const comments = document.getElementById("comments").value.trim();

  if (!ticket || !decision) { alert("Ticket and decision are required."); return; }

  const payload = { ticket, decision, comments };

  // Email requester
  const template = decision === "Approved" ? "template_ot_approved" : "template_ot_denied";
  emailjs.send("service_lk56r2m", template, payload)
    .then(() => console.log(`OT ${decision} email sent`))
    .catch(err => console.error("Email error:", err));

  // Log approval/denial to Google Sheet
  fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) })
    .catch(err => console.error("Google Sheet error:", err));

  alert(`OT request ${decision} successfully submitted.`);
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("approveBtn").addEventListener("click", submitApproval);
});
