(function () {
  const page = document.getElementById('mock-page');
  const content = document.getElementById('mock-content');
  const canvas = document.getElementById('heat-canvas');
  const ctx = canvas.getContext('2d');
  const modeToggle = document.getElementById('mode-toggle');
  const resetBtn = document.getElementById('reset-btn');
  const pointCount = document.getElementById('point-count');
  const explainer = document.getElementById('mode-explainer');
  const scrollPanel = document.getElementById('scroll-panel');
  const scrollMeter = document.getElementById('scroll-meter');
  const scrollPct = document.getElementById('scroll-pct');
  const thumb = document.getElementById('scrollbar-thumb');
  const track = document.getElementById('scrollbar-track');

  let mode = 'click';
  let clickPoints = [];
  let movePoints = [];
  let maxScroll = 0;
  let moveThrottle = 0;

  const explainers = {
    click: 'Modo clics: cada clic añade una mancha de calor. Las zonas donde varias personas hacen clic repetidamente se vuelven más intensas.',
    move: 'Modo movimiento: sigue el recorrido del cursor sobre la página, como una versión aproximada de hacia dónde se dirige la atención.',
    scroll: 'Modo scroll: mide hasta qué punto de la página llegan los visitantes antes de irse.'
  };

  function resizeCanvas() {
    canvas.width = content.scrollWidth;
    canvas.height = content.scrollHeight;
    redraw();
  }

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const points = mode === 'move' ? movePoints : clickPoints;
    if (mode === 'scroll') return;

    ctx.globalCompositeOperation = 'lighter';
    points.forEach((p) => {
      const r = p.big ? 46 : 24;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      if (mode === 'move') {
        grad.addColorStop(0, 'rgba(31,95,235,0.18)');
        grad.addColorStop(1, 'rgba(31,95,235,0)');
      } else {
        grad.addColorStop(0, 'rgba(255,77,61,0.35)');
        grad.addColorStop(0.6, 'rgba(255,157,61,0.22)');
        grad.addColorStop(1, 'rgba(255,157,61,0)');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  function setMode(next) {
    mode = next;
    modeToggle.querySelectorAll('button').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === next);
    });
    explainer.textContent = explainers[next];
    scrollPanel.style.display = next === 'scroll' ? 'block' : 'none';
    canvas.style.display = next === 'scroll' ? 'none' : 'block';
    updateCount();
    redraw();
  }

  function updateCount() {
    if (mode === 'click') {
      pointCount.textContent = clickPoints.length + ' clics registrados';
      pointCount.style.display = 'inline-block';
    } else if (mode === 'move') {
      pointCount.textContent = Math.floor(movePoints.length / 3) + ' puntos de recorrido';
      pointCount.style.display = 'inline-block';
    } else {
      pointCount.style.display = 'none';
    }
  }

  modeToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    setMode(btn.dataset.mode);
  });

  resetBtn.addEventListener('click', () => {
    clickPoints = [];
    movePoints = [];
    maxScroll = 0;
    page.scrollTop = 0;
    updateScrollUI();
    updateCount();
    redraw();
  });

  page.addEventListener('click', (e) => {
    if (mode !== 'click') return;
    const rect = content.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const isCta = e.target.closest('#cta-btn') || e.target.closest('#cta-btn-2');
    clickPoints.push({ x, y, big: !!isCta });
    updateCount();
    redraw();
  });

  page.addEventListener('mousemove', (e) => {
    if (mode !== 'move') return;
    moveThrottle++;
    if (moveThrottle % 2 !== 0) return;
    const rect = content.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || y < 0) return;
    movePoints.push({ x, y });
    if (movePoints.length > 400) movePoints.shift();
    updateCount();
    redraw();
  });

  function updateScrollUI() {
    const scrollable = page.scrollHeight - page.clientHeight;
    const current = scrollable > 0 ? page.scrollTop / scrollable : 0;
    maxScroll = Math.max(maxScroll, current);
    const pct = Math.round(maxScroll * 100);
    scrollMeter.style.width = pct + '%';
    scrollPct.textContent = pct;

    const thumbH = Math.max(30, (page.clientHeight / page.scrollHeight) * track.clientHeight);
    const thumbTop = (page.scrollTop / (scrollable || 1)) * (track.clientHeight - thumbH);
    thumb.style.height = thumbH + 'px';
    thumb.style.top = (isFinite(thumbTop) ? thumbTop : 0) + 'px';
  }

  page.addEventListener('scroll', updateScrollUI);
  window.addEventListener('resize', resizeCanvas);

  resizeCanvas();
  updateScrollUI();
  setMode('click');
})();
