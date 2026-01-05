// ---------------- OT.JS ----------------

// ---------------- HELPERS ----------------
function generateTicket() {
    return "SOAR-" + Date.now();
}

function launchConfetti() {
    if (typeof confetti === "function") {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    } else {
        console.warn("Confetti not loaded");
    }
}

// ---------------- PDF GENERATOR ----------------
function generatePDFBase64(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    doc.text("SOAR TN", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text("Overtime Request", 105, 28, { align: "center" });
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.8);
    doc.line(20, 32, 190, 32);

    // Ticket & Date
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Ticket #: ${data.ticket}`, 20, 42);
    doc.text(`Submitted: ${data.submittedDate}`, 140, 42);

    // Employee Info
    doc.setFontSize(12);
    doc.text("Employee Information:", 20, 54);
    doc.setFontSize(11);
    doc.text(`Employee Name: ${data.employee}`, 25, 62);
    doc.text(`Requester: ${data.requester}`, 25, 68);
    doc.text(`Email: ${data.email}`, 25, 74);
    doc.text(`House/Dept: ${data.house}`, 25, 80);
    doc.text(`Supervisor: ${data.supervisor}`, 25, 86);

    // OT Details
    doc.setFontSize(12);
    doc.text("Overtime Details:", 20, 98);
    doc.setFontSize(11);
    doc.text(`Date(s): ${data.otDates}`, 25, 106);
    doc.text(`Shift(s): ${data.otShifts}`, 25, 112);
    doc.text(`Hours: ${data.hours}`, 25, 118);
    doc.text(`Call List Exhausted: ${data.callExhausted}`, 25, 124);

    // Reason
    doc.setFontSize(12);
    doc.text("Reason for Overtime:", 20, 136);
    doc.setFontSize(11);
    const reasonLines = doc.splitTextToSize(data.reason, 170);
    doc.text(reasonLines, 20, 144);

    return doc.output("datauristring").split(",")[1];
}

// ---------------- MAIN SUBMIT ----------------
function submitOT() {
    const btn = document.getElementById("submitBtn");
    if (!btn) return;

    btn.disabled = true;

    const ticket = generateTicket();
    const submittedDate = new Date().toLocaleString();

    // Get form values
    const requester = document.getElementById("requester").value.trim();
    const employee = document.getElementById("employee").value.trim();
    const email = document.getElementById("email").value.trim();
    const house = document.getElementById("house").value.trim();
    const supervisor = document.getElementById("supervisor").value.trim();
    const otDates = document.getElementById("otDates").value.trim();
    const otShifts = document.getElementById("otShifts").value.trim();
    const hours = document.getElementById("hours").value.trim();
    const reason = document.getElementById("reason").value.trim();
    const callExhausted = document.getElementById("callExhausted").value.trim();

    // Validate required fields
    if (!requester || !employee || !email || !house || !supervisor || !otDates || !otShifts || !hours || !reason || !callExhausted) {
        alert("Please complete all required fields.");
        btn.disabled = false;
        return;
    }

    const payload = {
        type: "Overtime",
        ticket,
        requester,
        employee,
        email,
        house,
        supervisor,
        otDates,
        otShifts,
        hours,
        reason,
        callExhausted,
        submittedDate
    };

    payload.pdfBase64 = generatePDFBase64(payload);

    // ---------------- SEND EMAILS ----------------

    // HR Notification
    HR_EMAILS.forEach(hrEmail => {
        emailjs.send("service_lk56r2m", "template_78v4e8s", {
            ...payload,
            to_email: hrEmail,
            attachment: payload.pdfBase64
        })
        .then(() => console.log(`OT request sent to ${hrEmail}`))
        .catch(err => console.error("HR Email Error:", err));
    });

    // Auto-reply to requester/employee
    emailjs.send("service_lk56r2m", "template_d8dsexn", {
        requester,
        employee,
        employee_email: email,
        ticket,
        otDates,
        otShifts,
        hours
    })
    .then(() => console.log("OT auto-reply sent"))
    .catch(err => console.error("Auto-reply Error:", err));

    // Optional: Log to Google Sheets
    if (typeof GOOGLE_SCRIPT_URL !== "undefined") {
        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(payload)
        }).catch(err => console.error("Google Sheet logging error:", err));
    }

    // ---------------- UI Feedback ----------------
    launchConfetti();
    const ticketDisplay = document.getElementById("ticketDisplay");
    const successBox = document.getElementById("successBox");

    if (ticketDisplay) ticketDisplay.textContent = ticket;
    if (successBox) successBox.style.display = "block";

    setTimeout(() => {
        btn.disabled = false;
        window.location.href = "index.html";
    }, 5000);
}

// ---------------- ATTACH EVENT ----------------
document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) submitBtn.addEventListener("click", submitOT);
});
