const params = new URLSearchParams(window.location.search);
const ticket = params.get("ticket");
const decision = params.get("decision");

const template =
  decision === "approved"
    ? "template_f5t0nig"
    : "template_zyx9oic";

emailjs.send("service_lk56r2m", template, {
  ticket,
  status: decision.toUpperCase()
})
.then(() => {
  document.getElementById("status").innerText =
    `OT ${decision.toUpperCase()} — Ticket ${ticket}`;
})
.catch(err => console.error(err));

