(function () {
  const range = document.getElementById('usage-range');
  const fill = document.getElementById('usage-fill');
  const used = document.getElementById('usage-used');
  const note = document.getElementById('usage-note');

  function updateUsage() {
    const val = Number(range.value);
    const pct = (val / 500) * 100;
    fill.style.width = pct + '%';
    used.textContent = val;

    if (pct < 60) {
      note.textContent = 'Consumo saludable: te queda margen de sobra este mes.';
    } else if (pct < 90) {
      note.textContent = 'Te acercas al límite mensual; algunas sesiones nuevas podrían dejar de grabarse pronto.';
    } else {
      note.textContent = 'Límite casi alcanzado: en un plan real, las sesiones adicionales dejarían de registrarse hasta el próximo ciclo.';
    }
  }

  range.addEventListener('input', updateUsage);
  updateUsage();

  const npsRow = document.getElementById('nps-row');
  const npsWidget = document.getElementById('nps-widget');
  const npsThanks = document.getElementById('nps-thanks');

  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.addEventListener('click', () => {
      npsRow.querySelectorAll('button').forEach((b) => b.classList.remove('picked'));
      btn.classList.add('picked');
      setTimeout(() => {
        npsWidget.style.display = 'none';
        npsThanks.classList.add('show');
      }, 350);
    });
    npsRow.appendChild(btn);
  }
})();
