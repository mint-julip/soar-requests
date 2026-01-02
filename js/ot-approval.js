const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";

function sendApproval(status) {
  const ticket = document.getElementById("ticket").textContent;
  const employee = document.getElementById("employee").textContent;
  const requester = document.getElementById("requester").textContent;

  const payload = { ticket, employee, requester, status };

  // Send Email to requester and CC approvers
  const template = status === "Approved" ? "template_f5t0nig" : "template_zyx9oic";
  emailjs.send("service_lk56r2m", template, payload)
    .then(() => console.log(`OT ${status} email sent`))
    .catch(err => console.error("OT Approval Email Error:", err));

  // Log status update to Google Sheet
  fetch(GOOGLE_SCRIPT_URL, { method:"POST", mode:"no-cors", body:JSON.stringify(payload) })
    .catch(err => console.error("Google Sheet logging error:", err));

  alert(`OT Request ${status}`);
  window.close();
}

document.getElementById("approveBtn").addEventListener("click", ()=>sendApproval("Approved"));
document.getElementById("denyBtn").addEventListener("click", ()=>sendApproval("Denied"));
