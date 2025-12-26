// Initialize EmailJS
emailjs.init("sLNm5JCzwihAuVon0"); // Replace with your EmailJS public key

// Generate unique ticket number
function generateTicket() {
  return "SOAR-" + Date.now();
}

// Launch confetti
function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Submit Maintenance Request
async function submitMaintenance() {
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

  // Generate PDF as base64 string
  const pdfBase64 = generatePDFBase64({
    ticket,
    submittedDate,
    requester,
    contact,
    house,
    expectedDate,
    description,
    supplies
  });

  // EmailJS data with attachment
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
    cc_email: "sandysmith@soartn.org",
   // cc_email: "cherylhintz@soartn.org,alishasanders@soartn.org,kobypresley@soartn.org",
    attachment: [
      {
        content: pdfBase64.split(",")[1], // Remove data:image/pdf;base64 prefix
        filename: `${ticket}-Maintenance.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      }
    ]
  };

  // Send EmailJS
  // emailjs.send("service_lk56r2m", "template_vnfmovs", emailData)
  //   .then(() => {
  //     launchConfetti();

  const pdfBase64 = generatePDF(emailData);

emailjs.send("service_lk56r2m", "template_vnfmovs", {
  ...emailData,
  attachment: pdfBase64
}).then(() => {
  launchConfetti();
      document.getElementById("ticketNum").textContent = ticket;
  document.getElementById("successBox").style.display = "block";
});


      // Show success message with ticket
      document.getElementById("ticketNum").textContent = ticket;
      // document.getElementById("successBox").style.display = "block";

      // Log data to Google Sheets
      const logData = {
        ticket,
        type: "Maintenance",
        requester,
        contact,
        house,
        expectedDate,
        description,
        supplies,
        status: "Submitted"
      };

      fetch("https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(logData)
      }).catch(err => console.error("Google Sheet logging error:", err));

      // Redirect back to landing page after 5 seconds
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);

    })
    .catch(err => {
      console.error("EmailJS Error:", err);
      alert("Failed to submit maintenance request.");
    });
}

// Generate PDF and return as Base64
function generatePDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("SOAR TN - Maintenance Request", 20, 20);
  doc.setFontSize(11);
  doc.text(`Ticket #: ${data.ticket}`, 20, 30);
  doc.text(`Date Submitted: ${data.submittedDate}`, 20, 38);
  doc.text(`Requested By: ${data.requester}`, 20, 48);
  doc.text(`Contact Info: ${data.contact}`, 20, 56);
  doc.text(`House: ${data.house}`, 20, 64);
  doc.text(`Expected Completion: ${data.expectedDate}`, 20, 72);
  doc.text("Description:", 20, 84);
  doc.text(doc.splitTextToSize(data.description, 170), 20, 92);
  doc.text("Supplies Needed:", 20, 130);
  doc.text(doc.splitTextToSize(data.supplies || "N/A", 170), 20, 138);

  // Maintenance use only
  doc.text("----- Maintenance Use Only -----", 20, 170);
  doc.text("Materials Cost: ____________", 20, 180);
  doc.text("Mileage: ____________", 20, 190);
  doc.text("Completed Date: ____________", 20, 200);
  doc.text("Comments:", 20, 210);
}
