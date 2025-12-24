// Generate ticket
function generateTicket(prefix) {
  return `${prefix}-${Date.now()}`;
}

// Confetti
function launchConfetti() {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

// Submit OT Request
function submitOT() {
  const ticket = generateTicket("OT");

  const hm = document.getElementById("hm").value;
  const hmEmail = document.getElementById("hm_email").value;
  const employee = document.getElementById("employee").value;
  const house = document.getElementById("house").value;
  const date = document.getElementById("date").value;
  const hours = document.getElementById("hours").value;
  const reason = document.getElementById("reason").value;

  if (!hm || !hmEmail || !employee || !house || !date || !hours || !reason) {
    alert("Please fill out all required fields.");
    return;
  }

  // EmailJS: send to CEO & COO, CC HR
  emailjs.send("service_soartn", "template_ot_request", {
    ticket,
    hm,
    hmEmail,
    employee,
    house,
    date,
    hours,
    reason,
    to_email: "nikkigoodwin@soartn.org,cherylhintz@soartn.org",
    cc_email: "soarhr@soartn.org"
  }).then(() => {
    launchConfetti();
    alert(`OT Request submitted! Ticket #: ${ticket}`);

    // Log to Google Sheet
    const logData = {
      ticket,
      type: "OT",
      name: hm,
      email: hmEmail,
      department: "OT",
      status: "Submitted"
    };

    fetch("https://script.google.com/macros/s/AKfycbyZI-DSofbhJY-H3OK5M10JiFj1CQGTJjmHTMMrnqOgM-B_7j8cKUg3t_yH-QzJUY-Fug/exec", {
      method: "POST",
      body: JSON.stringify(logData)
    }).then(resp => console.log("Logged OT to Sheet:", resp))
      .catch(err => console.error("Sheet logging error:", err));

  }).catch(err => {
    console.error("EmailJS error:", err);
    alert("Error sending OT Request. Check console.");
  });
}
