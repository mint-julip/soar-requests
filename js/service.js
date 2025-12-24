function submitService() {
  const ticket = "SR-" + Date.now();

  const deptEmails = {
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

  const dept = department.value;

  const params = {
    ticket,
    name: name.value,
    email: email.value,
    department: dept,
    description: description.value,
    cc_email: deptEmails[dept],
    to_email: "soarhr@soartn.org"
  };

  emailjs.send("service_soartn", "template_service_request", params)
    .then(() => {
      alert("Service Request Submitted. Ticket " + ticket);
      confetti();
    })
    .catch(err => console.error(err));
}

