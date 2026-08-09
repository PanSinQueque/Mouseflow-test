(function () {
  const frame = document.getElementById('player-frame');
  const cursor = document.getElementById('rec-cursor');
  const clickFx = document.getElementById('rec-click');
  const scrub = document.getElementById('scrub');
  const timeNow = document.getElementById('time-now');
  const timeTotal = document.getElementById('time-total');
  const playBtn = document.getElementById('play-btn');
  const restartBtn = document.getElementById('restart-btn');
  const status = document.getElementById('rec-status');
  const speedToggle = document.getElementById('speed-toggle');
  const listEl = document.getElementById('session-list');
  const wireCta = document.getElementById('wire-cta');

  // Cada sesión: lista de puntos [xPct, yPct, esClic] recorridos en orden.
  const sessions = [
    {
      id: 1, name: 'Visitante #1042', device: 'Escritorio · Madrid', duration: 14, badge: '3 páginas',
      path: [[8, 12], [30, 20], [55, 18], [70, 30, true], [40, 55], [20, 70], [50, 85, true]]
    },
    {
      id: 2, name: 'Visitante #1041', device: 'Móvil · Bogotá', duration: 9, badge: '1 página',
      path: [[15, 10], [15, 40], [15, 75, true]]
    },
    {
      id: 3, name: 'Visitante #1040', device: 'Escritorio · CDMX', duration: 22, badge: '4 páginas',
      path: [[10, 15], [45, 10], [80, 15, true], [80, 45], [45, 45], [10, 45], [45, 80, true]]
    },
    {
      id: 4, name: 'Visitante #1039', device: 'Escritorio · Lima', duration: 14, badge: '2 páginas',
      path: [[6, 8], [35, 25], [62, 20], [62, 40], [50, 60], [50, 82, true]]
    },
    {
      id: 5, name: 'Visitante #1038', device: 'Tablet · Santiago', duration: 11, badge: '1 página',
      path: [[20, 12], [60, 12], [60, 50, true], [30, 70], [30, 85]]
    },
    {
      id: 6, name: 'Visitante #1037', device: 'Móvil · Tehuacán', duration: 17, badge: '3 páginas',
      path: [[12, 10], [12, 30], [45, 30], [45, 55], [70, 55], [50, 82, true]]
    }
  ];

  let activeSession = sessions[3]; // sesión #4 preseleccionada, coincide con el texto de estado inicial
  let playing = false;
  let elapsed = 0; // segundos virtuales
  let speed = 1;
  let rafId = null;
  let lastTs = null;

  function renderList() {
    listEl.innerHTML = '';
    sessions.forEach((s) => {
      const btn = document.createElement('button');
      btn.className = 'session-item' + (s.id === activeSession.id ? ' active' : '');
      btn.innerHTML = `
        <span class="avatar">${String(s.id).padStart(2, '0')}</span>
        <span class="meta"><b>${s.name}</b><span>${s.device}</span></span>
        <span class="badge">${s.duration}s · ${s.badge}</span>
      `;
      btn.addEventListener('click', () => selectSession(s));
      listEl.appendChild(btn);
    });
  }

  function selectSession(s) {
    activeSession = s;
    elapsed = 0;
    playing = false;
    playBtn.textContent = '▶';
    status.textContent = 'sesión #' + s.id + ' — ' + s.name;
    scrub.max = 1000;
    timeTotal.textContent = fmt(s.duration);
    clickFx.style.opacity = '0';
    renderList();
    positionAt(0);
    updateScrub();
  }

  function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function pointAt(t) {
    // t: 0..1 progreso dentro de la sesión, interpola entre waypoints del path
    const path = activeSession.path;
    const segCount = path.length - 1;
    const segF = t * segCount;
    let seg = Math.floor(segF);
    if (seg >= segCount) seg = segCount - 1;
    const localT = segF - seg;
    const a = path[seg];
    const b = path[seg + 1];
    const x = a[0] + (b[0] - a[0]) * localT;
    const y = a[1] + (b[1] - a[1]) * localT;
    const justClicked = b[2] && localT > 0.92;
    return { x, y, justClicked, atEnd: seg === segCount - 1 && localT > 0.97, waypointIndex: seg, localT };
  }

  function positionAt(tProgress) {
    const rect = frame.getBoundingClientRect();
    const { x, y } = pointAt(tProgress);
    const px = (x / 100) * rect.width;
    const py = (y / 100) * rect.height;
    cursor.style.left = px + 'px';
    cursor.style.top = py + 'px';
  }

  let lastClickSeg = -1;
  function tick(ts) {
    if (!playing) return;
    if (lastTs === null) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    elapsed += dt * speed;

    if (elapsed >= activeSession.duration) {
      elapsed = activeSession.duration;
      playing = false;
      playBtn.textContent = '▶';
    }

    const progress = elapsed / activeSession.duration;
    positionAt(progress);

    const pt = pointAt(progress);
    if (pt.justClicked && pt.waypointIndex !== lastClickSeg) {
      lastClickSeg = pt.waypointIndex;
      triggerClickFx(pt.x, pt.y);
      if (pt.waypointIndex === activeSession.path.length - 2) {
        pulseCta();
      }
    }

    updateScrub();

    if (playing) rafId = requestAnimationFrame(tick);
  }

  function triggerClickFx(xPct, yPct) {
    const rect = frame.getBoundingClientRect();
    clickFx.style.left = (xPct / 100) * rect.width + 'px';
    clickFx.style.top = (yPct / 100) * rect.height + 'px';
    clickFx.style.opacity = '1';
    clickFx.style.transition = 'none';
    clickFx.style.transform = 'translate(-50%,-50%) scale(0.4)';
    requestAnimationFrame(() => {
      clickFx.style.transition = 'transform .4s ease, opacity .4s ease';
      clickFx.style.transform = 'translate(-50%,-50%) scale(2.2)';
      clickFx.style.opacity = '0';
    });
  }

  function pulseCta() {
    wireCta.style.transition = 'transform .15s ease';
    wireCta.style.transform = 'scale(1.08)';
    setTimeout(() => (wireCta.style.transform = 'scale(1)'), 150);
  }

  function updateScrub() {
    const progress = elapsed / activeSession.duration;
    scrub.value = Math.round(progress * 1000);
    timeNow.textContent = fmt(elapsed);
  }

  playBtn.addEventListener('click', () => {
    if (elapsed >= activeSession.duration) elapsed = 0;
    playing = !playing;
    playBtn.textContent = playing ? '❚❚' : '▶';
    lastTs = null;
    if (playing) rafId = requestAnimationFrame(tick);
  });

  restartBtn.addEventListener('click', () => {
    elapsed = 0;
    lastClickSeg = -1;
    positionAt(0);
    updateScrub();
    clickFx.style.opacity = '0';
  });

  scrub.addEventListener('input', () => {
    playing = false;
    playBtn.textContent = '▶';
    const progress = scrub.value / 1000;
    elapsed = progress * activeSession.duration;
    positionAt(progress);
    timeNow.textContent = fmt(elapsed);
  });

  speedToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    speed = Number(btn.dataset.speed);
    speedToggle.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === btn));
  });

  window.addEventListener('resize', () => positionAt(elapsed / activeSession.duration));

  renderList();
  selectSession(activeSession);
})();
