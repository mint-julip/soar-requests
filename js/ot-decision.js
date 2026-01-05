// ===============================
// OT DECISION HANDLER
// ===============================

// Get ticket from URL
const params = new URLSearchParams(window.location.search);
const ticket = params.get("ticket");

// Display ticket
document.addEventListener("DOMContentLoaded", () => {
  if (!ticket) {
    alert("Missing ticket number.");
    return;
  }
  document.getElementById("ticketDisplay").textContent = ticket;
});

// Submit decision
function submitDecision(status) {
  const approvedBy = document.getElementById("approvedBy").value.trim();
  const denyReasonEl = document.getElementById("denyReason");

  if (!approvedBy) {
    alert("Approver name is required.");
    return;
  }

  let denyReason = "";
  if (status === "Denied") {
    denyReason = denyReasonEl.value.trim();
    if (!denyReason) {
      alert("Denial reason is required.");
      return;
    }
  }

  const decisionPayload = {
    ticket,
    status,
    approvedBy,
    denyReason,
    decisionDate: new Date().toLocaleString()
  };

  console.log("Decision captured:", decisionPayload);

  alert(`OT ${status}. PDF + emails will be generated next step.`);
}
