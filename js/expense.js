function submitExpense() {
  const ticket = "EX-" + Date.now();

  const params = {
    ticket,
    name: name.value,
    email: email.value,
    amount: amount.value,
    reason: reason.value,
    to_email: "finance@soartn.org",
    cc_email: "soarhr@soartn.org"
  };

  emailjs.send("service_soartn", "template_expense_request", params)
    .then(() => {
      alert("Expense Request Submitted. Ticket " + ticket);
      confetti();
    })
    .catch(err => console.error(err));
}

