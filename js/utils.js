function generateTicket(prefix) {
  return `${prefix}-${Date.now()}`;
}

function launchConfetti() {
  if (window.confetti) confetti();
}

