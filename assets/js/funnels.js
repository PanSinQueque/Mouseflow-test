(function () {
  const funnelEl = document.getElementById('funnel');
  const statsEl = document.getElementById('funnel-stats');
  const segmentToggle = document.getElementById('segment-toggle');
  const runBtn = document.getElementById('run-btn');

  const steps = ['Inicio', 'Producto', 'Carrito', 'Compra'];

  const data = {
    all:     [4820, 2610, 1180, 640],
    desktop: [2960, 1790, 890, 520],
    mobile:  [1860, 820, 290, 120]
  };

  let segment = 'all';

  function render() {
    const counts = data[segment];
    funnelEl.innerHTML = '';

    counts.forEach((count, i) => {
      const pctOfFirst = Math.round((count / counts[0]) * 100);
      const row = document.createElement('div');
      row.innerHTML = `
        <div class="funnel-step">
          <div class="label">${steps[i]}<small>paso ${i + 1} de ${counts.length}</small></div>
          <div class="funnel-bar-track"><div class="funnel-bar-fill" data-target="${pctOfFirst}"></div></div>
          <div class="count">${count.toLocaleString('es-ES')}</div>
        </div>
      `;
      funnelEl.appendChild(row);

      if (i > 0) {
        const prev = counts[i - 1];
        const dropPct = Math.round(((prev - count) / prev) * 100);
        const drop = document.createElement('div');
        drop.className = 'funnel-drop';
        drop.innerHTML = `<b>${dropPct}%</b> abandona entre "${steps[i - 1]}" y "${steps[i]}"`;
        funnelEl.appendChild(drop);
      }
    });

    renderStats(counts);
    animateBars();
  }

  function renderStats(counts) {
    const overall = Math.round((counts[counts.length - 1] / counts[0]) * 100);
    const biggestDropIdx = counts
      .map((c, i) => (i === 0 ? 0 : Math.round(((counts[i - 1] - c) / counts[i - 1]) * 100)))
      .reduce((best, v, i) => (v > counts.__max || i === 0 ? best : best), 1);

    let worst = { idx: 1, pct: 0 };
    for (let i = 1; i < counts.length; i++) {
      const p = Math.round(((counts[i - 1] - counts[i]) / counts[i - 1]) * 100);
      if (p > worst.pct) worst = { idx: i, pct: p };
    }

    statsEl.innerHTML = `
      <div class="stat"><b>${counts[0].toLocaleString('es-ES')}</b><span>entraron al embudo</span></div>
      <div class="stat"><b>${overall}%</b><span>conversión de extremo a extremo</span></div>
      <div class="stat"><b>${worst.pct}%</b><span>mayor caída: ${steps[worst.idx - 1]} → ${steps[worst.idx]}</span></div>
    `;
  }

  function animateBars() {
    requestAnimationFrame(() => {
      funnelEl.querySelectorAll('.funnel-bar-fill').forEach((el) => {
        el.style.width = '0%';
        requestAnimationFrame(() => {
          el.style.width = el.dataset.target + '%';
        });
      });
    });
  }

  segmentToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    segment = btn.dataset.segment;
    segmentToggle.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === btn));
    render();
  });

  runBtn.addEventListener('click', () => {
    // pequeña variación aleatoria para simular una nueva "corrida" de datos
    const base = data[segment];
    const varied = base.map((c, i) => (i === 0 ? c : Math.max(20, Math.round(c * (0.88 + Math.random() * 0.24)))));
    const backup = data[segment];
    data[segment] = varied;
    render();
    data[segment] = backup;
  });

  render();
})();
