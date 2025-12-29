/***********************
 * CONFIG
 ***********************/
emailjs.init("YOUR_PUBLIC_EMAILJS_KEY");

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

const HR_TEMPLATE_ID = "maintenance_hr_notify";
const AUTO_TEMPLATE_ID = "maintenance_autoreply";
const EMAIL_SERVICE_ID = "service_xxxxx";

/***********************
 * HELPERS
 ***********************/
function generateTicket() {
  return "SOAR-M-" + Date.now();
}

function requiredFieldsMissing(data) {
  return (
    !data.requester ||
    !data.email ||
    !data.house ||
    !data.priority ||
    !data.description
  );
}

/***********************
 * SUBMIT HANDLER
 ***********************/
async function submitMaintenance() {
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;

  const data = {
    timestamp: new Date().toISOString(),
    ticket: generateTicket(),
    type: "Maintenance",
    requester: document.getElementById("requester").value.trim(),
    contact: document.getElementById("email").value.trim(),
    house_dept: document.getElementById("house").value,
    priority: document.getElementById("priority").value,
    expected_date: document.getElementById("expectedDate").value,
    description: document.getElementById("description").value.trim(),
    amount_supplies: document.getElementById("supplies").value.trim(),
    status: "New",
    assigned_to: "",
    last_updated: new Date().toLocaleString(),
    source_form: "Maintenance Form"
  };

  if (requiredFieldsMissing(data)) {
    alert("Please complete all required fields.");
    btn.disabled = false;
    return;
  }

  try {
    /* HR EMAIL */
    await emailjs.send(EMAIL_SERVICE_ID, HR_TEMPLATE_ID, data);

    /* AUTO REPLY */
    await emailjs.send(EMAIL_SERVICE_ID, AUTO_TEMPLATE_ID, {
      requester_name: data.requester,
      requester_email: data.contact,
      ticket: data.ticket
    });

    /* LOG TO GOOGLE */
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data)
    });

    document.getElementById("ticketDisplay").textContent = data.ticket;
    document.getElementById("successBox").style.display = "block";

  } catch (err) {
    console.error("Submission error:", err);
    alert("There was an error submitting the request.");
    btn.disabled = false;
  }
}

/***********************
 * EVENT LISTENER
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("submitBtn")
    .addEventListener("click", submitMaintenance);
});
