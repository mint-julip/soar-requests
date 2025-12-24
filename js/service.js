function submitService() {
  const ticket = generateTicket("SR");

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
  });
}

