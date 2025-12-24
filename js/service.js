// Generate unique ticket number
function generateTicket() {
  return "SOAR-" + Date.now();
}

// Launch confetti
function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 }
  });
}

// Submit Service Request
function submitService() {
  const ticket = generateTicket();

  const name = document.getElementById("srName").value.trim();
  const email = document.getElementById("srEmail").value.trim();
  const dept = document.getElementById("srDept").value;
  const desc = document.getElementById("srDesc").value.trim();
  const date = new Date().toLocaleString();

  if (!name || !email || !dept || !desc) {
    alert("Please fill in all fields.");
    return;
  }

  // Department email routing
  const deptEmails = {
    Medical: "soarmedicaldepartment@soartn.org",
    Program: "programmanagers@soartn.org",
    Finance: "finance@soartn.org",
    Compliance: "soarhr@soartn.org",
    Payroll: "soarhr@soartn.org",
    IT: "soarhr@soartn.org",
    Recruiting: "soarhr@soartn.org",
    HR: "soarhr@soartn.org",
    Other: "soarhr@soartn.org"
  };

  const toEmail = deptEmails[dept] || "soarhr@soartn.org";

  const emailParams = {
    ticket: ticket,
    requester: name,
    email: email,
    department: dept,
    description: desc,
    date: date,
    to_email: toEmail,
    cc_email: "soarhr@soartn.org"
  };

  emailjs.send("service_lk56r2m", "template_au6bbjp", emailParams)
  .then(() => {
    launchConfetti();
    document.getElementById("ticketNum").textContent = ticket;
    document.getElementById("successMsg").style.display = "block";

    const logData = {
      ticket,
      type: "Service Request",
      name,
      email,
      department: dept,
      description: desc,
      status: "Submitted",
      submitted: date
    };

    fetch("https://script.google.com/macros/s/AKfycbyZI-DSofbhJY-H3OK5M10JiFj1CQGTJjmHTMMrnqOgM-B_7j8cKUg3t_yH-QzJUY-Fug/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData)
    });

    // clear form
    document.getElementById("srName").value = "";
    document.getElementById("srEmail").value = "";
    document.getElementById("srDept").value = "";
    document.getElementById("srDesc").value = "";
  })
  .catch(err => {
    console.error("EmailJS error:", err);
    alert("Failed to send Service Request.");
  });
}
