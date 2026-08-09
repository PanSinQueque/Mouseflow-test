# Kobo — sitio de demostración

Sitio estático de varias páginas (tienda de cerámica ficticia) pensado como
entorno de prueba genérico: para conectarlo a una herramienta de analítica
de comportamiento y comprobar que capta clics, scroll, grabaciones de
sesión, formularios y embudos, antes de usarla en un sitio real.

No tiene backend: el carrito y el "pedido" viven en `localStorage` del
navegador. Ningún dato se envía a ningún servidor.

## Estructura

```
index.html       Inicio (hero, productos destacados, boletín)
shop.html         Catálogo con filtros por categoría y orden
product.html      Ficha de producto (galería, variantes, acordeón)
cart.html         Carrito (cantidades, cupón, resumen)
checkout.html     Pago en 3 pasos: envío → pago → revisión (embudo)
thank-you.html    Confirmación de pedido
contact.html      Formulario de contacto (texto, select, radio, checkbox)
faq.html          Preguntas frecuentes en acordeón
about.html        Página de contenido / scroll largo
assets/style.css  Estilos
assets/main.js    Catálogo de productos y lógica (carrito, acordeón, nav)
```

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser público o privado, según
   tu plan) y sube todo el contenido de esta carpeta a la raíz del
   repositorio.
2. En el repositorio, entra a **Settings → Pages**.
3. En **Source**, selecciona la rama `main` (o `master`) y la carpeta `/root`.
4. Guarda. GitHub te dará una URL del tipo
   `https://tu-usuario.github.io/nombre-del-repo/`.
5. Cuando el sitio esté publicado, añade el fragmento de seguimiento de tu
   herramienta de analítica justo antes de `</head>` en cada página (o usa un
   incluido común si tu herramienta lo permite), y navega el sitio para
   generar datos de prueba.

## Qué interacciones probar en cada página

- **Inicio**: scroll completo, clic en tarjetas de producto, clic en
  "Añadir al carrito" rápido, envío del formulario de boletín.
- **Tienda**: clic en chips de filtro, cambio del selector de orden, clic
  en varias tarjetas.
- **Producto**: cambio de miniatura, selección de talla, subir/bajar
  cantidad, abrir/cerrar los tres acordeones, añadir al carrito.
- **Carrito**: subir/bajar cantidad, quitar un artículo, aplicar un cupón
  (siempre "inválido", es intencional), pasar a pago.
- **Pago**: es el embudo de tres pasos — completa cada paso con datos
  ficticios para generar un evento de conversión completo hasta
  `thank-you.html`. También puedes abandonar a mitad para probar el
  seguimiento de embudo incompleto.
- **Contacto**: formulario con texto, correo, select, radios y checkbox —
  útil para analítica de formularios (campos con más fricción, abandono
  por campo, etc.).
- **Preguntas frecuentes**: abrir varios acordeones seguidos, buen caso
  para mapas de clics.

## Notas

- Las "fotos" de producto son ilustraciones SVG generadas en el propio
  sitio, no hay imágenes externas que cargar.
- Los textos, precios y datos de pago son ficticios.
- El diseño es intencionalmente minimalista: paleta piedra/pino, tipografía
  Fraunces + Work Sans + Space Mono, sin animaciones decorativas de más.
