// OT DECISION HANDLER
const params = new URLSearchParams(window.location.search);
const ticket = params.get("ticket");
const action = params.get("action"); // 'approve' or 'deny'

document.addEventListener("DOMContentLoaded", () => {
    if (!ticket) { alert("Missing ticket number."); return; }
    document.getElementById("ticketDisplay").textContent = ticket;

    const denyReasonEl = document.getElementById("denyReason");

    if (action === "deny") {
        denyReasonEl.style.display = "block";
    }

    document.getElementById("approveBtn").addEventListener("click", () => submitDecision("Approved"));
    document.getElementById("denyBtn").addEventListener("click", () => submitDecision("Denied"));
});

function submitDecision(status) {
    const approvedBy = document.getElementById("approvedBy").value.trim();
    const denyReasonEl = document.getElementById("denyReason");
    let denyReason = "";

    if (!approvedBy) {
        alert("Approver name is required.");
        return;
    }

    if (status === "Denied") {
        denyReason = denyReasonEl.value.trim();
        if (!denyReason) {
            alert("Denial reason is required.");
            return;
        }
    }

    const decisionPayload = {
        ticket,
        status,
        approvedBy,
        denyReason,
        decisionDate: new Date().toLocaleString()
    };

    console.log("Decision captured:", decisionPayload);

    // Generate PDF
    const pdfData = generateDecisionPDF(decisionPayload);

    // Send Email to HR
    HR_EMAILS.forEach(hrEmail => {
        emailjs.send(
            EMAILJS_SERVICE_ID,
            status === "Approved" ? OT_APPROVED_TEMPLATE : OT_DENIED_TEMPLATE,
            { ...decisionPayload, attachment: pdfData, to_email: hrEmail }
        )
        .then(()=>console.log(`Decision email sent to ${hrEmail}`))
        .catch(err=>console.error("HR Email Error:", err));
    });

    // Optional: Auto-reply to requester/employee (if desired)

    // Feedback
    alert(`OT ${status}. PDF + emails have been generated.`);
    if (typeof confetti === "function") confetti({ particleCount:150, spread:90, origin:{y:0.6} });
}

// ---------------- PDF GENERATOR ----------------
function generateDecisionPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(0,51,102);
    doc.text("SOAR TN",105,20,{align:"center"});
    doc.setFontSize(14);
    doc.text("Overtime Decision",105,28,{align:"center"});

    doc.setDrawColor(0,51,102);
    doc.setLineWidth(0.8);
    doc.line(20,32,190,32);

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Ticket #: ${data.ticket}`,20,42);
    doc.text(`Decision Date: ${data.decisionDate}`,140,42);

    doc.setFontSize(12);
    doc.text("Decision Information:",20,54);
    doc.setFontSize(11);
    doc.text(`Status: ${data.status}`,25,62);
    doc.text(`Approved By: ${data.approvedBy}`,25,68);
    if (data.status === "Denied") doc.text(`Reason for Denial: ${data.denyReason}`,25,74);

    return doc.output("datauristring").split(",")[1];
}
