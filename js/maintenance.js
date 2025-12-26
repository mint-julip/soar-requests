// Initialize EmailJS
emailjs.init("sLNm5JCzwihAuVon0"); // Your public key

function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
}

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

  // ✅ Generate PDF as Base64
  const pdfBase64 = await generatePDFBase64({
    ticket, submittedDate, requester, contact,
    house, expectedDate, description, supplies
  });

  // ✅ EmailJS data
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
    cc_email: "cherylhintz@soartn.org,alishasanders@soartn.org,kobypresley@soartn.org",
    attachment: pdfBase64
  };

  emailjs.send("service_lk56r2m", "template_vnfmovs", emailData)
    .then(() => {
      launchConfetti();
      document.getElementById("ticketNum").textContent = ticket;
      document.getElementById("successBox").style.display = "block";

      // Log to Google Sheets
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
      });

      // Auto redirect to landing page after 5 seconds
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    })
    .catch(err => {
      console.error("EmailJS Error:", err);
      alert("Failed to submit maintenance request.");
    });
}

// Generate PDF and return Base64
function generatePDFBase64(data) {
  return new Promise((resolve) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("SOAR TN - Maintenance Request", 20, 20);

    doc.setFontSize(11);
    doc.text(`Ticket #: ${data.ticket}`, 20, 30);
    doc.text(`Date Submitted: ${data.submittedDate}`, 20, 38);
    doc.text(`Requested By: ${data.requester}`, 20, 46);
    doc.text(`Contact Info: ${data.contact}`, 20, 54);
    doc.text(`House: ${data.house}`, 20, 62);
    doc.text(`Expected Completion: ${data.expectedDate}`, 20, 70);
    doc.text("Description:", 20, 82);
    doc.text(doc.splitTextToSize(data.description, 170), 20, 90);
    doc.text("Supplies Needed:", 20, 130);
    doc.text(doc.splitTextToSize(data.supplies || "N/A", 170), 20, 138);

    doc.text("----- Maintenance Use Only -----", 20, 170);
    doc.text("Materials Cost: ____________", 20, 180);
    doc.text("Mileage: ____________", 20, 190);
    doc.text("Completed Date: ____________", 20, 200);
    doc.text("Comments:", 20, 210);

    // Convert PDF to Base64
    const pdfBase64 = doc.output("datauristring").split(",")[1];
    resolve(pdfBase64);
  });
}

