const params = new URLSearchParams(window.location.search);
const ticket = params.get("ticket");
const decision = params.get("decision");

const template =
  decision === "approved"
    ? "template_ot_approved"
    : "template_ot_denied";

emailjs.send("service_soartn", template, {
  ticket,
  status: decision.toUpperCase()
})
.then(() => {
  document.getElementById("status").innerText =
    `OT ${decision.toUpperCase()} — Ticket ${ticket}`;
})
.catch(err => console.error(err));

