const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";

function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
  } else {
    console.warn("Confetti library not loaded.");
  }
}

function submitExpense() {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("requester").value.trim();
  const email = document.getElementById("email").value.trim();
  const requestType = document.getElementById("requestType").value;
  const department = document.getElementById("department").value;
  const description = document.getElementById("description").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const expenseDate = document.getElementById("expenseDate").value;
  const attachments = document.getElementById("attachments").files;

  if (!requester || !email || !requestType || !department || !description || !amount || !expenseDate) {
    alert("Please fill in all required fields.");
    btn.disabled = false;
    return;
  }

  // Prepare payload
  const payload = {
    ticket,
    type: "Expense",
    requester,
    email,
    requestType,
    department,
    description,
    amount,
    expenseDate,
    submittedDate
  };

  // Convert attachments to base64 if needed
  if (attachments.length > 0) {
    payload.attachments = [];
    Array.from(attachments).forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        payload.attachments.push({
          name: file.name,
          base64: e.target.result.split(",")[1]
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // Log to Google Sheets
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload)
  }).catch(err => console.error("Google Sheet logging error:", err));

  // Send EmailJS
  emailjs.send("service_lk56r2m", "template_v09ilue", payload)
    .then(() => console.log("Expense Request email sent"))
    .catch(err => console.error("EmailJS error:", err));

  launchConfetti();
  document.getElementById("ticketDisplay").textContent = ticket;
  document.getElementById("successBox").style.display = "block";

  setTimeout(() => {
    btn.disabled = false;
    window.location.href = "index.html";
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) submitBtn.addEventListener("click", submitExpense);
});

