// ---------------- CONFIG ----------------
emailjs.init("sLNm5JCzwihAuVon0"); 
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";

// ---------------- HELPERS ----------------
function generateTicket() { return "OT-" + Date.now(); }
function launchConfetti() { if(typeof confetti==="function") confetti({particleCount:150, spread:90, origin:{y:0.6}}); }

// ---------------- MAIN SUBMIT ----------------
function submitOT() {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("requester").value.trim();
  const email = document.getElementById("email").value.trim();
  const employee = document.getElementById("employee").value.trim();
  const otDates = document.getElementById("otDates").value.trim();
  const otShifts = document.getElementById("otShifts").value.trim();
  const hours = document.getElementById("hours").value.trim();
  const reason = document.getElementById("reason").value.trim();
  const callExhausted = document.getElementById("callExhausted").value;

  if (!requester || !email || !employee || !otDates || !otShifts || !hours || !reason || !callExhausted) {
    alert("Please fill in all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = { ticket, submittedDate, requester, email, employee, otDates, otShifts, hours, reason, callExhausted, type:"OT" };

  // ---------------- SEND EMAIL TO APPROVERS ----------------
  emailjs.send("service_lk56r2m","template_78v4e8s", payload)
    .then(() => console.log("OT Request email sent"))
    .catch(err => console.error("OT EmailJS Error:", err));

  // ---------------- LOG TO GOOGLE SHEET ----------------
  fetch(GOOGLE_SCRIPT_URL, { method:"POST", mode:"no-cors", body:JSON.stringify(payload) })
    .catch(err => console.error("Google Sheet logging error:", err));

  launchConfetti();
  document.getElementById("ticketDisplay").textContent = ticket;
  document.getElementById("successBox").style.display = "block";

  setTimeout(()=>{btn.disabled=false; window.location.href="index.html";},5000);
}

// ---------------- ATTACH EVENT ----------------
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitBtn");
  if(submitBtn) submitBtn.addEventListener("click", submitOT);
});
