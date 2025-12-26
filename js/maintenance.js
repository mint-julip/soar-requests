// Initialize EmailJS
emailjs.init("sLNm5JCzwihAuVon0"); // <-- Your EmailJS Public Key

// Generate unique ticket number
function generateTicket() {
  return "SOAR-" + Date.now();
}

// Launch confetti animation
function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Main function to submit maintenance request
function submitMaintenance() {
  const ticket = generateTicket();
  const submittedDate = new Date().toLocaleString();

  // Get form values
  const requester = document.getElementById("requester").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const house = document.getElementById("house").value;
  const expectedDate = document.getElementById("expectedDate").value;
  const description = document.getElementById("description").value.trim();
  const supplies = document.getElementById("supplies").value.trim();

  // Validate required fields
  if (!requester || !contact || !house || !description) {
    alert("Please complete all required fields.");
    return;
  }

  // Show loader
  document.getElementById("loader").style.display = "block";

  // EmailJS email data
  const emailData = {
    ticket,
    requester,
    contact,
    house,
    expectedDate,
    description,
    supplies: supplies || "N/A",
    submittedDate,
    to_email: "soarhr@soartn.org",
    cc_email: "sandysmith@soartn.org"
    //cc_email: "cherylhintz@soartn.org,alishasanders@soartn.org,kobypresley@soartn.org"
  };

  // // Generate PDF
  const pdfBlob = generatePDF(emailData);

  // // Create FormData to attach PDF
  // const formData = new FormData();
  // formData.append("ticket", emailData.ticket);
  // formData.append("requester", emailData.requester);
  // formData.append("contact", emailData.contact);
  // formData.append("house", emailData.house);
  // formData.append("expectedDate", emailData.expectedDate);
  // formData.append("description", emailData.description);
  // formData.append("supplies", emailData.supplies);
  // formData.append("submittedDate", emailData.submittedDate);
  // formData.append("to_email", emailData.to_email);
  // formData.append("cc_email", emailData.cc_email);
  // formData.append("pdf_file", pdfBlob, `${ticket}-Maintenance.pdf`);

  // // Send Email via EmailJS (using template with attachment)
  // emailjs.send("service_lk56r2m", "template_vnfmovs", emailData)
  //   .then(() => {
  //     // Confetti & success display
  //     launchConfetti();
  //     document.getElementById("ticketNum").textContent = ticket;
  //     document.getElementById("successBox").style.display = "block";

  // Create FormData to attach PDF
const formData = new FormData();
formData.append("ticket", emailData.ticket);
formData.append("requester", emailData.requester);
formData.append("contact", emailData.contact);
formData.append("house", emailData.house);
formData.append("expectedDate", emailData.expectedDate);
formData.append("description", emailData.description);
formData.append("supplies", emailData.supplies);
formData.append("submittedDate", emailData.submittedDate);
formData.append("to_email", emailData.to_email);
formData.append("cc_email", emailData.cc_email);
formData.append("pdf_file", pdfBlob, `${ticket}-Maintenance.pdf`);

// Send email with PDF attachment
emailjs.send("service_lk56r2m", "template_vnfmovs", formData)


      // Log to Google Sheets via Web App
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
        mode: "no-cors", // Required for Google Apps Script CORS
        body: JSON.stringify(logData)
      }).catch(err => console.error("Sheet logging error:", err));

      // Hide loader after submission
      document.getElementById("loader").style.display = "none";

      // Redirect back to landing page after 5s
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    })
    .catch(err => {
      console.error("EmailJS error:", err);
      document.getElementById("loader").style.display = "none";
      alert("Failed to submit maintenance request. Check console.");
    });
}

// Generate PDF as blob
function generatePDF(data) {
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

  // Return PDF as Blob
  const pdfBlob = doc.output("blob");
  return pdfBlob;
}

