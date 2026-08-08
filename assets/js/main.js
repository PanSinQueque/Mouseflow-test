// Compartido por todas las páginas: resalta el enlace activo del menú
// y anima el "cursor firma" del hero (index) como guiño al seguimiento de mouse.

(function () {
  const path = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-list a, .topbar-nav a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
})();

// --- Firma visual: cursor en vivo dentro del hero de portada ---
(function () {
  const hero = document.querySelector('[data-cursor-hero]');
  if (!hero) return;

  const dot = hero.querySelector('#cursor-dot');
  const coords = hero.querySelector('#cursor-coords');

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    dot.style.opacity = '1';
    coords.style.left = x + 'px';
    coords.style.top = y + 'px';
    coords.style.opacity = '1';
    coords.textContent = `x:${Math.round(x)} y:${Math.round(y)}`;
  });

  hero.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    coords.style.opacity = '0';
  });
})();
