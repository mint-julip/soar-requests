/*************************
 * EmailJS Initialization
 *************************/
emailjs.init("sLNm5JCzwihAuVon0"); // your public key

/*************************
 * Helpers
 *************************/
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

/*************************
 * PDF → Base64 Generator
 *************************/
function generatePDFBase64(data) {
  return new Promise((resolve) => {
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

    // Convert PDF → Base64 (EmailJS-compatible)
    const pdfBase64 = doc.output("datauristring").split(",")[1];
    resolve(pdfBase64);
  });
}

function savePDFToDrive(base64, filename) {
  const folderId = "PASTE_FOLDER_ID_HERE";
  const folder = DriveApp.getFolderById(folderId);

  const blob = Utilities.newBlob(
    Utilities.base64Decode(base64),
    "application/pdf",
    filename
  );

  const file = folder.createFile(blob);
  return file.getUrl();
}


/*************************
 * Main Submit Function
 *************************/
async function submitMaintenance() {
  const submitBtn = document.querySelector("button");
submitBtn.disabled = true;
submitBtn.innerText = "Submitting...";
  if (sessionStorage.getItem("submitted")) {
  alert("This request has already been submitted.");
  return;
}
sessionStorage.setItem("submitted", "true");


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

  try {
    // 🔹 Generate PDF Base64
    const pdfBase64 = await generatePDFBase64(emailData);

    // 🔹 Attach PDF for EmailJS
    emailData.attachment = pdfBase64;

    // 🔹 Send Email
    await emailjs.send(
      "service_lk56r2m",
      "template_vnfmovs",
      emailData
    );
    //auto reply to requestor
    await emailjs.send(
  "service_lk56r2m",
  "maintenance_autoreply",
  {
    requester: requester,
    requester_email: contact,
    ticket: ticket,
    house: house,
    description: description
  }
);


    launchConfetti();

    document.getElementById("ticketNum").textContent = ticket;
    document.getElementById("successBox").style.display = "block";


     // 🔹 Log to Google Sheets
    fetch("https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec", {
  method: "POST",
  body: JSON.stringify({
      ticket,
        type: "Maintenance",
        requester,
        contact,
        house,
        expectedDate,
        description,
        supplies,
    status: "Submitted",
    pdf_base64: pdfBase64
  })
});


    // 🔹 Redirect
    setTimeout(() => {
      window.location.href = "index.html";
    }, 5000);

  } catch (err) {
    console.error("Maintenance Submit Error:", err);
    alert("Failed to submit maintenance request.");
  }
}
