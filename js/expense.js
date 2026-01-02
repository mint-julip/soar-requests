function submitExpense() {
  const btn = document.getElementById("submitExpenseBtn");
  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("expRequester").value.trim();
  const email = document.getElementById("expEmail").value.trim();
  const dept = document.getElementById("expDept").value;
  const type = document.getElementById("expType").value;
  const desc = document.getElementById("expDesc").value.trim();
  const amount = document.getElementById("expAmount").value.trim();
  const date = document.getElementById("expDate").value;

  if (!requester || !email || !dept || !type || !desc || !amount || !date) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    type: "Expense",
    ticket,
    requester,
    email,
    department: dept,
    expenseType: type,
    description: desc,
    amount,
    date,
    submittedDate
  };

  // Log to Google Sheet
  fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) })
    .catch(err => console.error("Google Sheet logging error:", err));

  // Send Expense Email
  emailjs.send("service_lk56r2m", "template_v09ilue", {
    ticket,
    requester,
    requester_email: email,
    department: dept,
    type,
    description: desc,
    amount,
    date
  }).catch(err => console.error("Expense Email Error:", err));

  launchConfetti();
  alert(`Expense Request submitted!\nTicket #: ${ticket}`);
  btn.disabled = false;
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitExpenseBtn");
  if (submitBtn) submitBtn.addEventListener("click", submitExpense);
});
