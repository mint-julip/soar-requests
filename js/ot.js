function submitOT() {
  const ticket = "OT-" + Date.now();

  const params = {
    ticket,
    hm: hm.value,
    emp: employee.value,
    house: house.value,
    date: date.value,
    hours: hours.value,
    reason: reason.value,

    approve_link: `https://YOURUSERNAME.github.io/YOURREPO/ot-approval.html?ticket=${ticket}&decision=approved`,
    deny_link: `https://YOURUSERNAME.github.io/YOURREPO/ot-approval.html?ticket=${ticket}&decision=denied`
  };

  emailjs.send("service_soartn", "template_ot_request", params)
    .then(() => {
      alert("OT Submitted. Ticket " + ticket);
      confetti();
    })
    .catch(err => console.error(err));
}

