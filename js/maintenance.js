function generateMaintenancePDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("SOAR TN – Maintenance Request", 20, 20);

  doc.setFontSize(11);
  doc.text(`Ticket #: ${data.ticket}`, 20, 32);
  doc.text(`Submitted: ${new Date(data.timestamp).toLocaleString()}`, 20, 40);
  doc.text(`Requester: ${data.requester}`, 20, 48);
  doc.text(`Email: ${data.contact}`, 20, 56);
  doc.text(`House / Dept: ${data.house_dept}`, 20, 64);
  doc.text(`Priority: ${data.priority}`, 20, 72);
  doc.text(`Expected Date: ${data.expected_date || "N/A"}`, 20, 80);

  doc.text("Description:", 20, 92);
  doc.text(doc.splitTextToSize(data.description, 170), 20, 100);

  doc.text("Supplies / Parts:", 20, 140);
  doc.text(doc.splitTextToSize(data.amount_supplies || "N/A", 170), 20, 148);

  doc.text("----- Maintenance Use Only -----", 20, 190);
  doc.text("Assigned To: ____________________", 20, 200);
  doc.text("Completion Date: ________________", 20, 210);
  doc.text("Notes:", 20, 220);

  return doc.output("datauristring").split(",")[1];
}
