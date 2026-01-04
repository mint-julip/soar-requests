// ---------------- OT.JS ----------------

function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 140, spread: 90 });
  }
}

function submitOT() {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  // Requester
  const requesterName = document.getElementById("requesterName").value.trim();
  const requesterEmail = document.getElementById("requesterEmail").value.trim();

  // Employee OT
  const employeeName = document.getElementById("employeeName").value.trim();
  const shifts = document.getElementById("shifts").value.trim();
  const callExhausted = document.getElementById("callExhausted").value;
  const otDates = document.getElementById("otDates").value.trim();
  const hours = document.getElementById("hours").value.trim();
  const reason = document.getElementById("reason").value.trim();

  if (
    !requesterName || !requesterEmail ||
    !employeeName || !shifts || !callExhausted ||
    !otDates || !hours || !reason
  ) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    type: "Overtime",
    ticket,
    submittedDate,

    requesterName,
    requesterEmail,

    employeeName,
    shifts,
    callExhausted,
    otDates,
    hours,
    reason,

    status: "Submitted"
  };

  // Send to HR
  HR_EMAILS.forEach(hr => {
    emailjs.send("service_lk56r2m", "template_ot_hr", {
      ...payload,
      to_email: hr
    });
  });

  // Auto-reply to requester
  emailjs.send("service_lk56r2m", "template_ot_auto", {
    requester_name: requesterName,
    requester_email: requesterEmail,
    employee: employeeName,
    ticket
  });

  // Log to Google Sheets
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload)
  });

  launchConfetti();

  document.getElementById("ticketDisplay").textContent = ticket;
  document.getElementById("successBox").style.display = "block";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("submitBtn").addEventListener("click", submitOT);
});
