// import * as emailjs from 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/library/d/1ttOv8ZNs2OYaDHy4H3t1bbsy0FpxaYHNZ7fFrUJO47wFDBuaFRKrjifJ/1"; // replace with your Apps Script URL

// maintenance.js
import { emailjs } from './index.html'; // window.emailjs is available globally

function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
}

export function submitMaintenance() {
  const ticket = generateTicket();
  const requester = document.getElementById("requester").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const house = document.getElementById("house").value;
  const expectedDate = document.getElementById("expectedDate").value;
  const description = document.getElementById("description").value.trim();
  const materials = document.getElementById("materials").value.trim();
  const dateSubmitted = new Date().toLocaleString();

  if (!requester || !contact || !house || !description) {
    alert("Please fill in all required fields.");
    return;
  }

  const serviceID = "service_lk56r2m"; // Replace with your EmailJS service ID
  const templateID = "template_vnfmovs"; // Replace with your EmailJS template ID

  emailjs.send(serviceID, templateID, {
    ticket,
    requester,
    contact,
    house,
    expectedDate,
    description,
    materials,
    dateSubmitted,
    to_email: "toosandra@gmail.com",
    cc_email: "sandysmith@soartn.org"
  }).then(() => {
    launchConfetti();
    document.getElementById("ticketNum").textContent = ticket;
    document.getElementById("successMsg").style.display = "block";

    // Log to Google Sheet
    const logData = {
      ticket,
      type: "Maintenance",
      requester,
      contact,
      house,
      expectedDate,
      description,
      materials,
      status: "Submitted"
    };

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(logData)
    }).then(resp => console.log("Logged to Sheet:", resp))
      .catch(err => console.error("Sheet logging error:", err));

    // Reset form
    document.getElementById("requester").value = "";
    document.getElementById("contact").value = "";
    document.getElementById("house").value = "";
    document.getElementById("expectedDate").value = "";
    document.getElementById("description").value = "";
    document.getElementById("materials").value = "";

  }).catch(err => {
    console.error("EmailJS error:", err);
    alert("Failed to send request. Check console.");
  });
}

// Expose globally for onclick
window.submitMaintenance = submitMaintenance;

