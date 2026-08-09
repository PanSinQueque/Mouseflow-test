# Demo — Herramientas del plan gratuito

Sitio estático (HTML/CSS/JS puro, sin dependencias de build) que demuestra de
forma interactiva cómo funcionan las herramientas típicas de un plan gratuito
de análisis de comportamiento web: mapas de calor, grabaciones de sesión,
embudos de conversión, analítica de formularios y una encuesta de feedback.

Es un proyecto **independiente y no oficial**, con fines educativos. No se
conecta a ninguna cuenta real ni envía datos a un servidor: todo se simula
en el navegador.

## Estructura

```
mouseflow-demo/
├── index.html          # Portada
├── heatmaps.html        # Demo de mapas de calor
├── recordings.html      # Demo de grabaciones de sesión
├── funnels.html          # Demo de embudos de conversión
├── forms.html             # Demo de analítica de formularios
├── plan.html               # Resumen del plan + medidor de uso + NPS
├── assets/
│   ├── css/style.css
│   └── js/ (main.js, heatmaps.js, recordings.js, funnels.js, forms.js, plan.js)
└── README.md
```

## Publicarlo en GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser público o privado si tienes
   GitHub Pro/Team/Enterprise).
2. Sube el contenido de esta carpeta a la raíz del repositorio:
   ```bash
   git init
   git add .
   git commit -m "Demo plan gratuito"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```
3. En GitHub, ve a **Settings → Pages**.
4. En "Build and deployment", elige **Deploy from a branch**, rama `main` y
   carpeta `/ (root)`. Guarda.
5. Espera uno o dos minutos: GitHub te dará una URL del tipo
   `https://TU-USUARIO.github.io/TU-REPO/`.

No hace falta ningún paso de compilación: es HTML/CSS/JS servido tal cual.

## Personalizarlo

- Colores, tipografía y espaciados: `assets/css/style.css` (variables en `:root`).
- Textos y datos de ejemplo (sesiones, embudo, formulario): directamente en
  cada `.html` y en su `.js` correspondiente dentro de `assets/js/`.
