// ============================
// GLOBAL CONFIG (SAFE LOAD)
// ============================

// config.js
const EMAILJS_SERVICE_ID = "service_lk56r2m";

const OT_REQUEST_TEMPLATE = "template_78v4e8s";
const OT_APPROVED_TEMPLATE = "template_f5t0nig";
const OT_DENIED_TEMPLATE = "template_zyx9oic";

// Google Apps Script endpoint (ONE place only)
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";

// EmailJS public key
const EMAILJS_PUBLIC_KEY = "sLNm5JCzwihAuVon0";

// HR email distribution list
const HR_EMAILS = [
  "soarhr@soartn.org",
  "alishasanders@soartn.org"
];

// Safety log
console.log("Config loaded: HR_EMAILS & GOOGLE_SCRIPT_URL");

// Initialize EmailJS ONLY if it exists
document.addEventListener("DOMContentLoaded", () => {
  if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log("EmailJS initialized");
  } else {
    console.warn("EmailJS not loaded on this page");
  }
});




