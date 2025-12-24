// ============================
// Ticket Generator
// ============================
function generateTicket() {
  return "SOAR-" + Date.now();
}

const ticket = generateTicket();

// ============================
// Confetti
// ============================
function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 }
  });
}

// ============================
// Submit Service Request
// ============================
function submitService() {
  const ticket = "SOAR-" + Date.now();

  const name = document.getElementById("srName").value.trim();
  const email = document.getElementById("srEmail").value.trim();
  const dept = document.getElementById("srDept").value;
  const desc = document.getElementById("srDesc").value.trim();

  if (!name || !email || !dept || !desc) {
    alert("Please fill in all fields.");
    return;
  }

  // ✅ Department → Email map
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
  fetch("https://script.google.com/macros/s/AKfycbygC4FTOpgZMlLaTgX5WhMRDRqI0d3hcuWsDHLoqECejAEHa-Chf8oOXfl5V7YWF4A8rg/exec", {
  method: "POST",
  body: JSON.stringify({
    ticket: ticket,
    type: "Service",
    name: name,
    email: email,
    department: dept,
    description: desc,
    status: "Submitted"
  })
});


  // ✅ DEFINE toEmail BEFORE using it
  const toEmail = deptEmails[dept] || "soarhr@soartn.org";

  // ✅ SEND EMAIL
  emailjs.send("service_lk56r2m", "template_au6bbjp", {
    ticket: ticket,
    requester: name,
    requester_email: email,
    department: dept,
    description: desc,
    submitted_date: new Date().toLocaleString(),
    to_email: toEmail,
    cc_email: "soarhr@soartn.org"
  })
  .then(() => {
    confetti();
    alert("Service Request submitted!\nTicket #: " + ticket);

    // Redirect back to landing page
    window.location.href = "index.html";
  })
  .catch(err => {
    console.error("EmailJS error:", err);
    alert("Failed to send request. Check console.");
  });
  
}
