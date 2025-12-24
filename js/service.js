// Generate a simple ticket number
function generateTicket(prefix) {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}`;
}

// Launch confetti
function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Map department emails
const deptEmails = {
  Medical: "soarmedicaldepartment@soartn.org",
  "Program Directors": "programmanagers@soartn.org",
  Finance: "finance@soartn.org",
  Compliance: "soarhr@soartn.org",
  Payroll: "soarhr@soartn.org",
  IT: "soarhr@soartn.org",
  Recruiting: "soarhr@soartn.org",
  HR: "soarhr@soartn.org",
  Other: "soarhr@soartn.org",
  "Admin Assist": "alishasanders@soartn.org"
};

// Form submission
function submitService() {
  const ticket = generateTicket("SR");

  const srName = document.getElementById("srName").value;
  const srEmail = document.getElementById("srEmail").value;
  const srDept = document.getElementById("srDept").value;
  const srDesc = document.getElementById("srDesc").value;

  if (!srName || !srEmail || !srDept || !srDesc) {
    alert("Please complete all fields.");
    return;
  }

  // Send EmailJS email
  emailjs.send("service_lk56r2m", "template_au6bbjp", {
    ticket,
    name: srName,
    email: srEmail,
    department: srDept,
    description: srDesc,
    to_email: "soarhr@soartn.org",
    cc_email: deptEmails[srDept]
  }).then(() => {
    launchConfetti();
    alert(`Service request submitted! Ticket #: ${ticket}`);

    // Log to Google Sheet via Apps Script
    const logData = {
      ticket,
      type: "Service",
      name: srName,
      email: srEmail,
      department: srDept,
      status: "Submitted"
    };

    fetch("https://script.google.com/macros/s/AKfycbyZI-DSofbhJY-H3OK5M10JiFj1CQGTJjmHTMMrnqOgM-B_7j8cKUg3t_yH-QzJUY-Fug/exec", {
      method: "POST",
      body: JSON.stringify(logData)
    }).then(resp => console.log("Logged to Sheet:", resp))
      .catch(err => console.error("Sheet logging error:", err));
  }).catch(err => {
    console.error("EmailJS error:", err);
    alert("Error sending Service Request. Check console.");
  });
}
