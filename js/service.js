// ---------------- SUBMIT SERVICE REQUEST ----------------

// ============================
// CONFIG
// ============================
emailjs.init("sLNm5JCzwihAuVon0");

// MUST be global
const DEPT_EMAILS = {
  Medical: "soarhr@soartn.org",
  Program: "soarhr@soartn.org",
  Finance: "soarhr@soartn.org",
  Compliance: "soarhr@soartn.org",
  Payroll: "soarhr@soartn.org",
  IT: "soarhr@soartn.org",
  Recruiting: "soarhr@soartn.org",
  HR: "soarhr@soartn.org",
  Other: "soarhr@soartn.org"
};

// ============================
// HELPERS
// ============================
function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }
}

// ============================
// SUBMIT SERVICE REQUEST
// ============================
function submitService() {
  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const name = document.getElementById("srName").value.trim();
  const email = document.getElementById("srEmail").value.trim();
  const dept = document.getElementById("srDept").value;
  const desc = document.getElementById("srDesc").value.trim();

  if (!name || !email || !dept || !desc) {
    alert("Please fill in all fields.");
    return;
  }

  const toEmail = DEPT_EMAILS[dept] || "soarhr@soartn.org";

  // Log to Google Sheets
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      type: "Service",
      ticket,
      requester: name,
      email,
      department: dept,
      description: desc,
      submittedDate,
      status: "Submitted"
    })
  });

  // Send email
  emailjs.send("service_lk56r2m", "template_au6bbjp", {
    ticket,
    requester: name,
    requester_email: email,
    department: dept,
    description: desc,
    submitted_date: submittedDate,
    to_email: toEmail,
    cc_email: "soarhr@soartn.org"
  // })
  // .then(() => {
  //   launchConfetti();
  //   alert(`Service Request submitted!\nTicket #: ${ticket}`);
  //   window.location.href = "index.html";
  // })
  // .catch(err => {
  //   console.error("EmailJS error:", err);
  //   alert("Failed to submit request.");
  });
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  } else {
    console.warn("Confetti not loaded");
  }
}


function submitService() {
  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const name = document.getElementById("srName").value.trim();
  const email = document.getElementById("srEmail").value.trim();
  const dept = document.getElementById("srDept").value;
  const desc = document.getElementById("srDesc").value.trim();

  if (!name || !email || !dept || !desc) {
    alert("Please fill in all fields.");
    return;
  }

  const toEmail = DEPT_EMAILS[dept] || "soarhr@soartn.org";

  const payload = {
    type: "Service",
    ticket,
    requester: name,
    email,
    department: dept,
    description: desc,
    submittedDate,
    status: "Submitted"
  };

  // Log to Google Sheet
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload)
  }).catch(err => console.error("Google Sheet logging error:", err));

  // Send Email
  emailjs.send("service_lk56r2m", "template_au6bbjp", {
    ticket,
    requester: name,
    requester_email: email,
    department: dept,
    description: desc,
    submitted_date: submittedDate,
    to_email: toEmail,
    cc_email: "soarhr@soartn.org"
  })
  .then(() => {
    launchConfetti();
    alert(`Service Request submitted!\nTicket #: ${ticket}`);
    window.location.href = "index.html";
  })
  .catch(err => {
    console.error("EmailJS error:", err);
    alert("Failed to send request. Check console.");
  });
}

// Attach event
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.querySelector("#requestForm button");
  if (submitBtn) submitBtn.addEventListener("click", submitService);
});
