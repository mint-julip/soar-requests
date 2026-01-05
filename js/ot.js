// ---------------- INIT ----------------
// emailjs.init(EMAILJS_PUBLIC_KEY);

// ---------------- HELPERS ----------------
function generateTicket() {
  return "OT-" + Date.now();
}

// ---------------- SUBMIT ----------------
function submitOT() {

  const requester = document.getElementById("requester").value.trim();
  const requesterEmail = document.getElementById("requesterEmail").value.trim();
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
    alert("Please complete all fields.");
    return;
  }

  const ticket = generateTicket();

  const payload = {
    ticket,
    requester,
    requester_email: requesterEmail,
    employee,
    ot_dates: otDates,
    ot_shifts: otShifts,
    hours,
    call_exhausted: callExhausted,
    reason
  };

  // ---------- EMAIL: OT REQUEST ----------
  emailjs.send(
    EMAILJS_SERVICE_ID,
    template_78v4e8s,
    {
      ...payload,
      to_email: HR_EMAILS.join(",")
    }
  ).then(() => {

    document.getElementById("ticketDisplay").textContent = ticket;
    document.getElementById("successBox").style.display = "block";
    document.getElementById("otForm").reset();

  }).catch(err => {
    console.error("OT Error:", err);
    alert("Failed to submit OT request.");
  });

  // ---------- LOG TO SHEET ----------
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      type: "OT Request",
      ticket,
      ...payload
    })
  });
}

// ---------------- EVENT ----------------
document.getElementById("submitBtn").addEventListener("click", submitOT);
