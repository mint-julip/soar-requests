function submitService() {
  const ticket = generateTicket("SR");

  // Prepare email data
  const deptMap = {
    Medical: "soarmedicaldepartment@soartn.org",
    "Program Directors": "programmanagers@soartn.org",
    Finance: "finance@soartn.org",
    Compliance: "soarhr@soartn.org",
    Payroll: "soarhr@soartn.org",
    IT: "soarhr@soartn.org",
    Recruiting: "soarhr@soartn.org",
    HR: "soarhr@soartn.org",
    Other: "soarhr@soartn.org"
  };

  // Send email with EmailJS
  emailjs.send("service_soartn", "template_service_request", {
    ticket,
    name: srName.value,
    email: srEmail.value,
    department: srDept.value,
    description: srDesc.value,
    to_email: "soarhr@soartn.org",
    cc_email: deptMap[srDept.value]
  }).then(() => {
    launchConfetti();
    alert(`Submitted. Ticket ${ticket}`);

    // ✅ Call Google Apps Script Web App to log request
    const logData = {
      ticket,
      type: "Service",
      name: srName.value,
      email: srEmail.value,
      department: srDept.value,
      status: "Submitted"
    };

    fetch("YOUR_SCRIPT_URL_HERE", {
      method: "POST",
      body: JSON.stringify(logData)
    }).then(resp => console.log("Logged to Sheet:", resp))
      .catch(err => console.error("Sheet logging error:", err));
  });
}
