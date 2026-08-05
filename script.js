// ============================================================
// Este archivo solo maneja la interactividad VISUAL de la demo.
// El registro real de eventos (heatmaps, grabaciones, funnels,
// formularios, feedback) lo hace Mouseflow automáticamente en
// segundo plano una vez que el script de tracking está activo
// en index.html con tu Website ID real.
// ============================================================

function logEvent(label) {
  const log = document.getElementById('eventLog');
  const item = document.createElement('li');
  const time = new Date().toLocaleTimeString();
  item.textContent = `[${time}] ${label}`;
  log.prepend(item);

  // Si tienes tags personalizados de Mouseflow, podrías además hacer:
  // window._mfq && window._mfq.push(['tag', label]);
}

function toggleBox() {
  const box = document.getElementById('hiddenBox');
  box.classList.toggle('hidden');
  logEvent('Panel dinámico ' + (box.classList.contains('hidden') ? 'ocultado' : 'mostrado'));
}

// ===== FUNNEL =====
function goToStep(stepNumber) {
  document.querySelectorAll('.funnel-step').forEach(el => el.classList.remove('active'));
  document.getElementById('step' + stepNumber).classList.add('active');
  document.getElementById('funnelProgress').style.width = (stepNumber / 3 * 100) + '%';
  logEvent('Funnel: paso ' + stepNumber);
}

function completeFunnel() {
  document.getElementById('funnelProgress').style.width = '100%';
  logEvent('Funnel: conversión completada ✔');
  alert('¡Embudo completado! En Mouseflow esto se vería reflejado como una conversión en el Funnel.');
}

// ===== FORM =====
function submitForm(event) {
  event.preventDefault();
  document.getElementById('formResult').textContent = 'Formulario enviado correctamente ✔';
  logEvent('Formulario enviado');
  event.target.reset();
  return false;
}

// ===== FEEDBACK MODAL =====
function showFeedback() {
  document.getElementById('feedbackModal').classList.remove('hidden');
  logEvent('Encuesta de feedback abierta');
}

function closeFeedback() {
  document.getElementById('feedbackModal').classList.add('hidden');
  logEvent('Encuesta de feedback cerrada');
}

function rate(value) {
  logEvent('Feedback calificado con ' + value + '/5');
  closeFeedback();
  alert('¡Gracias por tu calificación: ' + value + '/5!');
}
