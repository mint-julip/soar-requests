emailjs.init("sLNm5JCzwihAuVon0");

function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
}

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

  const emailData = {
    ticket,
    requester,
    contact,
    house,
    expectedDate,
    description,
    supplies,
    submittedDate,
    to_email: "soarhr@soartn.org",
    cc_email: "toosandra@gmail.com" //"cherylhintz@soartn.org,alishasanders@soartn.org,kobypresley@soartn.org"
  };

  // ✅ SEND EMAIL
  emailjs.send("service_lk56r2m", "template_vnfmovs", emailData)
    .then(() => {
      launchConfetti();

      document.getElementById("ticketNum").textContent = ticket;
      document.getElementById("successBox").style.display = "block";

      // ✅ GENERATE PDF
      generatePDF(emailData);

      // ✅ LOG TO GOOGLE SHEETS
      fetch("https://script.google.com/macros/library/d/1ttOv8ZNs2OYaDHy4H3t1bbsy0FpxaYHNZ7fFrUJO47wFDBuaFRKrjifJ/1", {
        method: "POST",
        body: JSON.stringify({
          ...emailData,
          type: "Maintenance",
          status: "Submitted"
        })
      }).catch(err => console.error("Sheet error", err));

      // ✅ REDIRECT AFTER 3 SECONDS
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    })
    .catch(err => {
      console.error("EmailJS Error:", err);
      alert("Failed to submit maintenance request.");
    });
}

