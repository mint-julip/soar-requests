function submitOT() {
  const btn = document.getElementById("submitOTBtn");
  btn.disabled = true;

  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("otRequester").value.trim();
  const email = document.getElementById("otEmail").value.trim();
  const employee = document.getElementById("otEmployee").value.trim();
  const otDates = document.getElementById("otDates").value.trim();
  const otShifts = document.getElementById("otShifts").value.trim();
  const hours = document.getElementById("otHours").value.trim();
  const reason = document.getElementById("otReason").value.trim();
  const callExhausted = document.getElementById("otCallExhausted").checked;

  if (!requester || !email || !employee || !otDates || !otShifts || !hours || !reason) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  const payload = {
    type: "OT",
    ticket,
    requester,
    email,
    employee,
    otDates,
    otShifts,
    hours,
    reason,
    callExhausted,
    submittedDate
  };

  // Log to Google Sheet
  fetch(GOOGLE_SCRIPT_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) })
    .catch(err => console.error("Google Sheet logging error:", err));

  // Send OT Request Email
  emailjs.send("service_lk56r2m", "template_78v4e8s", {
    ticket,
    requester,
    requester_email: email,
    employee,
    ot_dates: otDates,
    ot_shifts: otShifts,
    hours,
    reason,
    call_exhausted: callExhausted
  }).catch(err => console.error("OT Request Email Error:", err));

  launchConfetti();
  alert(`OT Request submitted!\nTicket #: ${ticket}`);
  btn.disabled = false;
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submitOTBtn");
  if (submitBtn) submitBtn.addEventListener("click", submitOT);
});
