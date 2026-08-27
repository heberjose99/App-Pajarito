# App Pajarito

Página web hecha para el curso de Git & Git Bash. Es un sitio de una sola página sobre aves tropicales, con tarjetas que reproducen el canto de cada ave cuando pasás el mouse por encima (o le hacés foco con el teclado).

## Qué tiene

- 10 tarjetas de aves (tucán, colibrí, búho, guacamayo, benteveo, jacamar, tangara, motmot, carpintero y martín pescador), cada una con su foto y su audio real.
- Sonido ambiente de fondo que se puede activar/desactivar con el botón flotante de abajo a la derecha.
- Animaciones al hacer scroll (las secciones aparecen de a poco).
- Pensado para que se pueda usar con teclado: hay skip-link, `aria-label` en los botones y las tarjetas tienen foco visible.
- Estilos hechos con Tailwind CSS.

## Cómo probarlo

Lo más simple es abrir `index.html` directamente en el navegador, porque el CSS de Tailwind ya viene compilado en `tailwind.generated.css`.

Si querés modificar los estilos y volver a generar ese archivo:

```bash
npm install
npm run build:css
```

Eso corre Tailwind y regenera `tailwind.generated.css` a partir de `src/tailwind.css`.

## Estructura

```
├── index.html              → estructura de la página
├── style.css                → estilos que no maneja Tailwind (animaciones, fondo, etc.)
├── script.js                 → lógica de audio y animaciones al scrollear
├── src/tailwind.css          → entrada de Tailwind
├── tailwind.config.js        → configuración de Tailwind
└── tailwind.generated.css    → CSS ya compilado, listo para usar
```

## Créditos

Las fotos son de Unsplash y los audios de Wikimedia Commons, así que son de uso libre. Las fuentes (Cormorant Garamond y Lato) son de Google Fonts.

## Licencia

Este proyecto está bajo la licencia MIT. Podés ver el detalle en el archivo [LICENSE](./LICENSE).
