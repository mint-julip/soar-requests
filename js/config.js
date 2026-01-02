// ---------------- CONFIG ----------------
const EMAILJS_PUBLIC_KEY = "sLNm5JCzwihAuVon0";

/**
 * SOAR Unified Intake Endpoint
 * Handles: Service, Maintenance, OT, Expense
 */

/*********************************
 * GLOBAL CONFIG & HELPERS
 *********************************/

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";

const HR_EMAILS = ["soarhr@soartn.org"];

/*********************************
 * HELPERS
 *********************************/
function generateTicket() {
  return "SOAR-" + Date.now();
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 140,
      spread: 85,
      origin: { y: 0.6 }
    });
  }
}
