function submitMaintenance() {
  const ticket = "MT-" + Date.now();

  const params = {
    ticket,
    name: name.value,
    contact: contact.value,
    house: house.value,
    work: work.value,
    expected: expected.value,
    to_email: "soarhr@soartn.org",
    cc_email: "kobypresley@soartn.org,cherylhintz@soartn.org,alishasanders@soartn.org"
  };

  emailjs.send("service_soartn", "template_maintenance_request", params)
    .then(() => {
      alert("Maintenance Request Submitted. Ticket " + ticket);
      confetti();
    })
    .catch(err => console.error(err));
}

