(function () {
  const form = document.getElementById('demo-form');
  const reportEl = document.getElementById('field-report');
  const completionNum = document.getElementById('completion-num');
  const frictionNote = document.getElementById('friction-note');
  const resetBtn = document.getElementById('reset-form');

  const fieldNames = ['nombre', 'email', 'telefono', 'mensaje'];
  const fieldLabels = { nombre: 'Nombre completo', email: 'Correo electrónico', telefono: 'Teléfono', mensaje: 'Mensaje' };

  const stats = {};
  fieldNames.forEach((f) => {
    stats[f] = { totalMs: 0, focusStart: null, visits: 0, filled: false };
  });

  function buildReport() {
    reportEl.innerHTML = '';
    const maxTime = Math.max(1, ...fieldNames.map((f) => stats[f].totalMs));

    fieldNames.forEach((f) => {
      const s = stats[f];
      const seconds = (s.totalMs / 1000).toFixed(1);
      const isFriction = s.totalMs === maxTime && s.totalMs > 0 && s.visits > 0;
      const row = document.createElement('div');
      row.className = 'field-report-row' + (isFriction ? ' friction' : '');
      row.innerHTML = `
        <div class="top"><b>${fieldLabels[f]}</b><span>${seconds}s · ${s.visits} visita${s.visits === 1 ? '' : 's'}</span></div>
        <div class="mini-bar"><i style="width:${Math.min(100, (s.totalMs / maxTime) * 100)}%"></i></div>
      `;
      reportEl.appendChild(row);
    });

    updateCompletion();
  }

  function updateCompletion() {
    const filledCount = fieldNames.filter((f) => stats[f].filled).length;
    const pct = Math.round((filledCount / fieldNames.length) * 100);
    completionNum.textContent = pct + '%';

    const touched = fieldNames.filter((f) => stats[f].visits > 0);
    if (touched.length === 0) {
      frictionNote.textContent = 'Empieza a escribir para ver el análisis.';
      return;
    }
    const worst = touched.reduce((a, b) => (stats[b].totalMs > stats[a].totalMs ? b : a));
    if (stats[worst].totalMs > 1500) {
      frictionNote.innerHTML = `El campo <b>${fieldLabels[worst]}</b> concentra más tiempo de duda: podría ser el que más fricción genera.`;
    } else {
      frictionNote.textContent = 'De momento, ningún campo destaca por fricción.';
    }
  }

  fieldNames.forEach((f) => {
    const el = form.querySelector(`[name="${f}"]`);
    const wrapper = form.querySelector(`[data-field="${f}"]`);

    el.addEventListener('focus', () => {
      stats[f].focusStart = performance.now();
      stats[f].visits++;
    });

    el.addEventListener('blur', () => {
      if (stats[f].focusStart !== null) {
        stats[f].totalMs += performance.now() - stats[f].focusStart;
        stats[f].focusStart = null;
      }
      stats[f].filled = el.value.trim().length > 0;
      wrapper.classList.toggle('flagged', !stats[f].filled && stats[f].visits > 1);
      buildReport();
    });

    el.addEventListener('input', () => {
      stats[f].filled = el.value.trim().length > 0;
      updateCompletion();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fieldNames.forEach((f) => {
      const el = form.querySelector(`[name="${f}"]`);
      stats[f].filled = el.value.trim().length > 0;
    });
    buildReport();
    const allFilled = fieldNames.every((f) => stats[f].filled);
    frictionNote.innerHTML = allFilled
      ? '<b>Formulario completo.</b> Así es como se vería una conversión exitosa registrada.'
      : 'Formulario enviado con campos vacíos: así se detectaría un intento de abandono.';
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    fieldNames.forEach((f) => {
      stats[f] = { totalMs: 0, focusStart: null, visits: 0, filled: false };
      form.querySelector(`[data-field="${f}"]`).classList.remove('flagged');
    });
    buildReport();
    frictionNote.textContent = 'Empieza a escribir para ver el análisis.';
  });

  buildReport();
})();
