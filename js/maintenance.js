// Generate ticket
function generateTicket(prefix) {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}`;
}

// Confetti
function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Map houses (for dropdown)
const houses = [
  "Lee House","Alcoa House","Cusick House","Countryside House",
  "Cherokee House","Dell House","Gladstone House","Glascock House",
  "Jett House","May House","Merritt House","Emma House",
  "Wright House","Raulston House","Louisville House","SOAR OFFICE"
];

// Populate dropdown (call once on page load)
function populateHouseDropdown() {
  const houseSelect = document.getElementById("maintenanceHouse");
  houses.forEach(house => {
    const option = document.createElement("option");
    option.value = house;
    option.textContent = house;
    houseSelect.appendChild(option);
  });
}

// Generate PDF
function generateMaintenancePDF(data) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("SOAR TN - Maintenance Request", 20, 20);

  doc.setFontSize(11);
  doc.text(`Ticket: ${data.ticket}`, 20, 35);
  doc.text(`Requested By: ${data.requestedBy}`, 20, 45);
  doc.text(`House: ${data.house}`, 20, 55);
  doc.text(`Contact Info: ${data.contact}`, 20, 65);
  doc.text(`Submission Date: ${data.timestamp}`, 20, 75);
  doc.text(`Expected Completion: ${data.expectedDate}`, 20, 85);
  doc.text("Work Description:", 20, 95);
  doc.text(data.workDescription, 20, 105, { maxWidth: 170 });
  doc.text("Materials Required:", 20, 125);
  doc.text(data.materialsRequired, 20, 135, { maxWidth: 170 });
  doc.text("Cost of Materials:", 20, 155);
  doc.text(data.costMaterials || "", 20, 165);
  doc.text("Assigned To:", 20, 185);
  doc.text("Date Completed:", 20, 195);
  doc.text("Time Arrived:", 20, 205);
  doc.text("Time Completed:", 20, 215);
  doc.text("Mileage:", 20, 225);
  doc.text("Comments / Notes:", 20, 235);
  doc.text(data.comments || "", 20, 245);

  doc.save(`${data.ticket}.pdf`);
}

// Submit Maintenance Form
function submitMaintenance() {
  const ticket = generateTicket("MT");

  const requestedBy = document.getElementById("maintenanceRequestedBy").value;
  const house = document.getElementById("maintenanceHouse").value;
  const contact = document.getElementById("maintenanceContact").value;
  const expectedDate = document.getElementById("maintenanceExpectedDate").value;
  const workDescription = document.getElementById("maintenanceWork").value;
  const materialsRequired = document.getElementById("maintenanceMaterials").value;

  if (!requestedBy || !house || !contact || !workDescription) {
    alert("Please complete all required fields.");
    return;
  }

  const timestamp = new Date().toLocaleString();

  // EmailJS
  emailjs.send("service_lk56r2m", "template_vnfmovs", {
    ticket,
    requestedBy,
    house,
    contact,
    timestamp,
    expectedDate,
    workDescription,
    materialsRequired,
    to_email: "soarhr@soartn.org",
    // cc_email: "cherylhintz@soartn.org,alishasanders@soartn.org,kobypresley@soartn.org"
    cc_email: "toosandra@gmail.com"
  }).then(() => {
    launchConfetti();
    alert(`Maintenance request submitted! Ticket #: ${ticket}`);

    // Log to Google Sheet
    const logData = {
      ticket,
      type: "Maintenance",
      name: requestedBy,
      email: contact,
      department: "Maintenance",
      status: "Submitted"
    };

    fetch("https://script.google.com/macros/s/AKfycbyZI-DSofbhJY-H3OK5M10JiFj1CQGTJjmHTMMrnqOgM-B_7j8cKUg3t_yH-QzJUY-Fug/exec", {
      method: "POST",
      body: JSON.stringify(logData)
    }).then(resp => console.log("Logged to Sheet:", resp))
      .catch(err => console.error("Sheet logging error:", err));

    // Generate PDF
    generateMaintenancePDF({
      ticket,
      requestedBy,
      house,
      contact,
      timestamp,
      expectedDate,
      workDescription,
      materialsRequired,
      costMaterials: "", comments: ""
    });

  }).catch(err => {
    console.error("EmailJS error:", err);
    alert("Error sending Maintenance Request. Check console.");
  });
}
