/* ==========================================================================
   KOBO — script compartido
   Sitio de demostración estático. Todo el "carrito" y "pedidos" vive en
   localStorage del navegador; no hay backend real ni pagos reales.
   ========================================================================== */

/* ---------- Catálogo de productos (datos de muestra) ---------- */
const PRODUCTS = [
  { id: "p1", name: "Cuenco Nube",   cat: "bowls", price: 38, shape: "bowl",  tone: "#C9B79C", desc: "Cuenco de pared baja torneado a mano, esmalte mate color arena." },
  { id: "p2", name: "Cuenco Marea",  cat: "bowls", price: 44, shape: "bowl",  tone: "#B7C2AE", desc: "Perfil ancho para servir, borde ligeramente irregular de torno." },
  { id: "p3", name: "Taza Alba",     cat: "cups",  price: 26, shape: "cup",   tone: "#CBA88C", desc: "Taza de asa fina, capacidad 220ml, apta lavavajillas." },
  { id: "p4", name: "Taza Musgo",    cat: "cups",  price: 28, shape: "cup",   tone: "#9FA98B", desc: "Esmalte verde musgo con veladuras, cada pieza es única." },
  { id: "p5", name: "Jarrón Sereno", cat: "vases",  price: 68, shape: "vase", tone: "#B79E86", desc: "Jarrón de cuello alto, base ancha, ideal para ramas secas." },
  { id: "p6", name: "Jarrón Bruma",  cat: "vases",  price: 74, shape: "vase", tone: "#A7A093", desc: "Silueta bulbosa con textura de arcilla cruda en la base." },
  { id: "p7", name: "Plato Llano",   cat: "plates", price: 32, shape: "plate", tone: "#D2C3A5", desc: "Plato de presentación, 24cm de diámetro, borde recto." },
  { id: "p8", name: "Plato Hondo",   cat: "plates", price: 34, shape: "plate", tone: "#C4B08D", desc: "Plato hondo para sopas y guisos, buen agarre en la base." },
  { id: "p9", name: "Cuenco Río",    cat: "bowls",  price: 41, shape: "bowl",  tone: "#AEB6A0", desc: "Cuenco mediano de pared gruesa, retiene bien el calor." },
];

/* ---------- Siluetas SVG (motivo de marca) ---------- */
function potteryShape(shape, tone){
  const wobble = `<circle cx="86" cy="16" r="3.2" fill="none" stroke="${tone}" stroke-width="1.4" opacity="0.55"/>`;
  const paths = {
    bowl: `<path d="M14 46 C14 66 34 78 50 78 C66 78 86 66 86 46" fill="none" stroke="${tone}" stroke-width="3.4" stroke-linecap="round"/>
           <ellipse cx="50" cy="46" rx="36" ry="8" fill="none" stroke="${tone}" stroke-width="3.4"/>`,
    cup:  `<path d="M24 30 C22 30 22 62 30 68 C36 72 62 72 68 68 C76 62 76 30 74 30 Z" fill="none" stroke="${tone}" stroke-width="3.4" stroke-linejoin="round"/>
           <path d="M74 38 C88 38 88 58 74 58" fill="none" stroke="${tone}" stroke-width="3.4"/>`,
    vase: `<path d="M42 12 C40 12 40 22 36 26 C24 38 22 52 26 64 C29 74 71 74 74 64 C78 52 76 38 64 26 C60 22 60 12 58 12" fill="none" stroke="${tone}" stroke-width="3.4" stroke-linejoin="round"/>`,
    plate:`<ellipse cx="50" cy="50" rx="38" ry="20" fill="none" stroke="${tone}" stroke-width="3.4"/>
           <ellipse cx="50" cy="50" rx="20" ry="10" fill="none" stroke="${tone}" stroke-width="2.2" opacity="0.7"/>`,
  };
  return `<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">${paths[shape] || paths.bowl}${wobble}</svg>`;
}

/* ---------- Carrito (localStorage) ---------- */
const CART_KEY = "kobo_cart_v1";

function getCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function addToCart(id, qty=1){
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  if(line){ line.qty += qty; } else { cart.push({ id, qty }); }
  saveCart(cart);
  showToast("Añadido al carrito");
}
function removeFromCart(id){
  saveCart(getCart().filter(l => l.id !== id));
}
function setQty(id, qty){
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  if(!line) return;
  line.qty = Math.max(1, qty);
  saveCart(cart);
}
function cartCount(){
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}
function cartLinesWithData(){
  return getCart().map(l => ({ ...l, product: PRODUCTS.find(p => p.id === l.id) })).filter(l => l.product);
}
function cartSubtotal(){
  return cartLinesWithData().reduce((sum, l) => sum + l.product.price * l.qty, 0);
}
function updateCartCount(){
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    const n = cartCount();
    el.textContent = n;
    el.style.display = n > 0 ? "inline-flex" : "none";
  });
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg){
  let el = document.querySelector(".toast");
  if(!el){
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------- Navegación móvil ---------- */
function initNav(){
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if(toggle && links){
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
  }
}

/* ---------- Acordeón ---------- */
function initAccordions(){
  document.querySelectorAll(".accordion-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", (!expanded).toString());
      if(panel){
        panel.style.maxHeight = expanded ? "0px" : panel.scrollHeight + "px";
      }
    });
  });
}

/* ---------- Validación simple de formularios (demo, sin backend) ---------- */
function validateField(field){
  const input = field.querySelector("input, textarea, select");
  if(!input) return true;
  const valid = input.checkValidity();
  field.classList.toggle("invalid", !valid);
  return valid;
}
function initDemoForm(formEl, statusMsg){
  if(!formEl) return;
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    formEl.querySelectorAll(".field").forEach(f => { if(!validateField(f)) ok = false; });
    const status = formEl.querySelector(".form-status");
    if(!status) return;
    if(ok){
      status.textContent = statusMsg || "Listo. Esto es una demostración, no se ha enviado ningún dato a ningún servidor.";
      status.className = "form-status show ok";
      formEl.reset();
    } else {
      status.textContent = "Revisa los campos marcados antes de continuar.";
      status.className = "form-status show bad";
    }
  });
  formEl.querySelectorAll(".field input, .field textarea, .field select").forEach(input => {
    input.addEventListener("blur", () => validateField(input.closest(".field")));
  });
}

/* ---------- Inicialización global ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initAccordions();
  updateCartCount();

  document.querySelectorAll("[data-add-to-cart]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.getAttribute("data-add-to-cart")));
  });
});
