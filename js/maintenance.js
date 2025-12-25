// Initialize EmailJS
emailjs.init("sLNm5JCzwihAuVon0");

// Ticket generator
function generateTicket() {
  return "SOAR-" + Date.now();
}

// Confetti
function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Submit Maintenance Request
function submitMaintenance() {
  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  const requester = document.getElementById("requester").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const house = document.getElementById("house").value;
  const expectedDate = document.getElementById("expectedDate").value;
  const description = document.getElementById("description").value.trim();
  const supplies = document.getElementById("supplies").value.trim();

  if (!requester || !contact || !house || !description) {
    alert("Please complete all required fields.");
    return;
  }

  emailjs.send("service_lk56r2m", "template_vnfmovs", {
    ticket,
    requester,
    contact,
    house,
    expectedDate,
    description,
    supplies,
    submittedDate,
    to_email: "soarhr@soartn.org",
    cc_email: "cherylhintz@soartn.org,alishasanders@soartn.org,kobypresley@soartn.org"
  })
  .then(() => {
    launchConfetti();
    document.getElementById("ticketNum").textContent = ticket;
    document.getElementById("successBox").style.display = "block";

    // OPTIONAL: Google Sheets hook (safe to remove)
    fetch("https://script.google.com/macros/s/YOUR_SCRIPT_URL/exec", {
      method: "POST",
      body: JSON.stringify({
        ticket,
        requester,
        contact,
        house,
        expectedDate,
        description,
        supplies,
        submittedDate,
        type: "Maintenance"
      })
    }).catch(() => {});
  })
  .catch(err => {
    console.error("EmailJS Error:", err);
    alert("Failed to submit request.");
  });
}
