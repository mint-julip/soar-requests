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
    cc_email: "cherylhintz@soartn.org,alishasanders@soartn.org,kobypresley@soartn.org"
  };
 

  // ✅ SEND EMAIL
  emailjs.send("service_lk56r2m", "template_vnfmovs", emailData)
    .then(() => {
      launchConfetti();

      document.getElementById("ticketNum").textContent = ticket;
      document.getElementById("successBox").style.display = "block";

      // ✅ GENERATE PDF
      generatePDF(emailData);

       // Data to log
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

// Send to Google Sheet via Apps Script Web App
     
fetch("https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec", {
  method: "POST",
  mode: "no-cors",
  body: JSON.stringify(logData)
});



      // ✅ REDIRECT AFTER 5 SECONDS
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    })
    .catch(err => {
      console.error("EmailJS Error:", err);
      alert("Failed to submit maintenance request.");
    });
}
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

  doc.text("----- Maintenance Use Only -----", 20, 170);
  doc.text("Materials Cost: ____________", 20, 180);
  doc.text("Mileage: ____________", 20, 190);
  doc.text("Completed Date: ____________", 20, 200);
  doc.text("Comments:", 20, 210);

  doc.save(`${data.ticket}-Maintenance.pdf`);
}

