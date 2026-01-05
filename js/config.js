// ============================
// GLOBAL CONFIG (SAFE LOAD)
// ============================

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




