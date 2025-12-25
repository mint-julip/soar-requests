function generateTicket() {
  return "SOAR-" + Date.now();
}

function submitMaintenance() {
  const requester = document.getElementById("requester").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const house = document.getElementById("house").value;
  const description = document.getElementById("description").value.trim();

  if (!requester || !contact || !house || !description) {
    alert("Please complete all required fields.");
    return;
  }

  const ticket = generateTicket();
  emailjs.send("service_lk56r2m", "template_vnfmovs", {
  to_email: "maintenance@soartn.org",
  cc_email: "director@soartn.org, hr@soartn.org",
  ticket,
      requester,
      contact,
      house,
      description,
      submitted: new Date().toLocaleString()
}).then(() => {
    confetti();
    alert("Request submitted!\nTicket #: " + ticket);


  // emailjs.send(
  //   "service_lk56r2m",
  //   "template_vnfmovs",
  //   {
  //     ticket,
  //     requester,
  //     contact,
  //     house,
  //     description,
  //     submitted: new Date().toLocaleString()
  //   }
  // ).then(() => {
  //   confetti();
  //   alert("Request submitted!\nTicket #: " + ticket);

    fetch("https://script.google.com/macros/library/d/1ttOv8ZNs2OYaDHy4H3t1bbsy0FpxaYHNZ7fFrUJO47wFDBuaFRKrjifJ/1", {
  method: "POST",
  body: JSON.stringify(data)
});


    // reset form
    document.getElementById("requester").value = "";
    document.getElementById("contact").value = "";
    document.getElementById("house").value = "";
    document.getElementById("description").value = "";
  }).catch(err => {
    console.error("EmailJS Error:", err);
    alert("Submission failed. See console.");
  });
}

// Make function accessible to HTML onclick
window.submitMaintenance = submitMaintenance;
