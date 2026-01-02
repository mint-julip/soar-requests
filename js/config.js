// ---------------- CONFIG ----------------
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-a4gm5kpU1ZCBgQJyxkT3Pw5PeIYb63N0ZbnILJZVlCLIz1SxtxsjDV-aKzwGn5oyLA/exec";
const HR_EMAILS = ["soarhr@soartn.org"];
const EMAILJS_PUBLIC_KEY = "sLNm5JCzwihAuVon0";

// Department → email mapping for Service Requests
const DEPT_EMAILS = {
  Payroll: "soarhr@soartn.org",
  IT: "soarhr@soartn.org",
  Recruiting: "soarhr@soartn.org",
  HR: "soarhr@soartn.org",
  Other: "soarhr@soartn.org"
};

// Initialize EmailJS once
emailjs.init(EMAILJS_PUBLIC_KEY);

