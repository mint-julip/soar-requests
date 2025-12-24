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
  const ticket = generateTicket();

  // Get form values
  const name = document.getElementById("srName").value.trim();
  const email = document.getElementById("srEmail").value.trim();
  const dept = document.getElementById("srDept").value;
  const desc = document.getElementById("srDesc").value.trim();
  const submittedDate = new Date().toLocaleString();

  if (!name || !email || !dept || !desc) {
    alert("Please complete all fields.");
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

  const departmentEmail = deptEmails[dept] || "soarhr@soartn.org";

  // ============================
  // Send Email via EmailJS
  // ============================
 emailjs.send("service_lk56r2m", "template_au6bbjp", {
  ticket: ticket,
  requester: name,
  requester_email: email,      // ✅ MATCHES TEMPLATE
  department: dept,
  description: desc,
  submitted_date: date,        // ✅ MATCHES TEMPLATE
  to_email: toEmail,
  cc_email: "soarhr@soartn.org"
}

  )
  .then(() => {
    // Confetti
    launchConfetti();

    // ============================
    // Log to Google Sheets
    // ============================
    fetch(
      "https://script.google.com/macros/s/AKfycbyZI-DSofbhJY-H3OK5M10JiFj1CQGTJjmHTMMrnqOgM-B_7j8cKUg3t_yH-QzJUY-Fug/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket: ticket,
          type: "Service",
          requester: name,
          email: email,
          department: dept,
          description: desc,
          status: "Submitted",
          date: submittedDate
        })
      }
    );

    // Small delay so user sees success
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  })
  .catch(error => {
    console.error("EmailJS error:", error);
    alert("Error submitting service request. Check console.");
  });
}

