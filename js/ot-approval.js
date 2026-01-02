const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";

function approveOT(ticket){
  handleOTStatus(ticket, "Approved");
}

function denyOT(ticket){
  handleOTStatus(ticket, "Denied");
}

function handleOTStatus(ticket, status){
  fetch(`${GOOGLE_SCRIPT_URL}?action=updateOTStatus`, {
    method: "POST",
    body: JSON.stringify({ticket, status})
  })
  .then(() => {
    emailjs.send("service_lk56r2m", status==="Approved" ? "template_f5t0nig" : "template_zyx9oic", { ticket })
      .then(() => console.log(`${status} email sent for ticket ${ticket}`))
      .catch(err => console.error("EmailJS error:", err));

    alert(`OT Request ${status} for ticket ${ticket}`);
    window.location.reload();
  })
  .catch(err => console.error("Approval error:", err));
}
