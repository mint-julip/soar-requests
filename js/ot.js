// ---------------- OT.JS ----------------

// ---------------- HELPERS ----------------
function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }
}

// ---------------- MAIN SUBMIT ----------------
function submitOT() {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("requester").value.trim();
  const requesterEmail = document.getElementById("email").value.trim();
  const employee = document.getElementById("employee").value.trim();
  const otDates = document.getElementById("otDates").value.trim();
  const otShifts = document.getElementById("otShifts").value.trim();
  const hours = document.getElementById("hours").value.trim();
  const callExhausted = document.getElementById("callExhausted").value;
  const reason = document.getElementById("reason").value.trim();

  if (
    !requester || !requesterEmail || !employee ||
    !otDates || !otShifts || !hours || !callExhausted || !reason
  ) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    type: "OT Request",
    ticket,
    requester,
    requester_email: requesterEmail,
    employee,
    ot_dates: otDates,
    ot_shifts: otShifts,
    hours,
    call_exhausted: callExhausted,
    reason,
    submittedDate
  };

  // ---------------- SEND TO HR ----------------
  emailjs.send("service_lk56r2m", "template_78v4e8s", {
    ...payload,
    to_email: HR_EMAILS[0]
  })
  .then(() => {
    launchConfetti();
    document.getElementById("ticketDisplay").textContent = ticket;
    document.getElementById("successBox").style.display = "block";
  })
  .catch(err => {
    console.error("OT submission error:", err);
    alert("Failed to submit OT request.");
    btn.disabled = false;
  });

  // ---------------- LOG TO SHEET ----------------
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload)
  });

  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}

// ---------------- ATTACH EVENT ----------------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submitBtn").addEventListener("click", submitOT);
});
