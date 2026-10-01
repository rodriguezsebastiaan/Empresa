---
name: Conexacod
description: Sistema cinematográfico en azul marino y cian para explicar y convertir problemas empresariales reales.
colors:
  background: "oklch(0.16 0.02 240)"
  foreground: "oklch(0.95 0.005 240)"
  card: "oklch(0.2 0.025 240)"
  primary: "oklch(0.82 0.13 190)"
  primary-foreground: "oklch(0.16 0.02 240)"
  secondary: "oklch(0.24 0.03 240)"
  muted-foreground: "oklch(0.78 0.018 235)"
  border: "oklch(0.3 0.03 235)"
  destructive: "oklch(0.6 0.2 25)"
typography:
  display:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", "Trebuchet MS", sans-serif'
    fontSize: "clamp(3rem, 4.5vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  headline:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", "Trebuchet MS", sans-serif'
    fontSize: "clamp(2.25rem, 3.2vw, 3.6rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.028em"
  title:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", "Trebuchet MS", sans-serif'
    fontSize: "clamp(1.05rem, 1.08vw, 1.18rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.012em"
  body:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", "Trebuchet MS", sans-serif'
    fontSize: "clamp(1.05rem, 1.12vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: '"Segoe UI Variable Display", "Segoe UI", "Trebuchet MS", sans-serif'
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.08em"
  mono:
    fontFamily: '"Consolas", "JetBrains Mono", "Courier New", monospace'
rounded:
  sm: "2px"
  md: "4px"
  lg: "6px"
  xl: "10px"
spacing:
  scene-mobile: "clamp(5rem, 14vw, 7rem)"
  scene-desktop: "clamp(6rem, 10vw, 10rem)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
  button-text:
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 0"
---

# Design System: Conexacod

## Overview

**Creative North Star: “El iceberg operativo”**

La interfaz muestra una capa visible clara —titulares, decisiones y rutas de acción— sobre un sistema profundo de procesos, integraciones y automatización. El iceberg no es decoración aislada: el símbolo de marca, el fondo cinematográfico y las capas oscuras hacen legible la relación entre lo que una empresa ve y la infraestructura que sostiene su operación.

El mundo visual es oscuro, técnico y espacial, con una sola señal cian para orientar. Las páginas públicas usan vídeo o gradientes profundos como atmósfera continua; el contenido se apoya en overlays localizados, líneas finas y superficies translúcidas para conservar legibilidad sin tapar la escena. La composición alterna grandes declaraciones editoriales con bloques operativos más compactos.

**Key Characteristics:**

- Fondo azul marino casi negro, texto glaciar y cian reservado para orientación y acción.
- Un relato cinematográfico continuo por página, no una colección de fondos inconexos.
- Titulares grandes, compactos y balanceados frente a copy de lectura con ancho controlado.
- Líneas, bordes y brillos ligeros que sugieren capas técnicas sin convertir la interfaz en glassmorphism.
- La identidad del iceberg y la procedencia desde Manizales permanecen visibles en los puntos de marca.

## Colors

La paleta se concentra en un espectro frío: profundidades marinas para el fondo, blancos ligeramente azulados para lectura y un cian luminoso como señal excepcional.

### Primary

- **Cian señal:** acciones principales, navegación activa, foco, iconos operativos y separadores de énfasis. No funciona como relleno dominante de toda la página.

### Neutral

- **Azul abisal:** plano base de la experiencia y soporte del vídeo cinematográfico.
- **Blanco glaciar:** texto principal y titulares.
- **Azul de cámara:** superficies locales como menús móviles, popovers y tarjetas.
- **Azul estrato:** acciones secundarias y capas de apoyo.
- **Niebla técnica:** texto secundario que debe seguir siendo legible.
- **Línea batimétrica:** bordes, divisores e inputs; establece estructura sin crear cajas pesadas.
- **Rojo de alerta:** estados destructivos; no sustituye al cian de interacción normal.

**The Cyan Signal Rule.** El cian aparece en acciones, foco, estado activo y líneas de lectura; su rareza mantiene clara la prioridad.

**The Local Contrast Rule.** El contraste se resuelve con overlays y superficies locales sobre el fondo cinematográfico, no ocultando la escena con paneles opacos de gran tamaño.

## Typography

**Display Font:** Segoe UI Variable Display, con Segoe UI y Trebuchet MS como fallback.

**Body Font:** Segoe UI Variable Display, con Segoe UI y Trebuchet MS como fallback.

**Label/Mono Font:** Consolas, con JetBrains Mono y Courier New como fallback para información técnica.

**Character:** Una sans de sistema nítida y contemporánea sostiene tanto el tono empresarial como la escala cinematográfica. El contraste jerárquico nace del tamaño, el peso y el espaciado; no de mezclar familias decorativas.

### Hierarchy

- **Display** (600, escala fluida, line-height 1.06): grandes declaraciones del hero.
- **Headline** (600, escala fluida, line-height 1.1): encabezados de sección y narrativa editorial.
- **Title** (600, escala fluida, line-height 1.25): títulos de tarjetas y conceptos breves.
- **Body** (400, escala fluida, line-height 1.65): explicación principal, limitada normalmente a 62 caracteres tipográficos (`62ch`).
- **Label** (600, 0.95rem, tracking 0.08em): botones, acciones y microjerarquías; los botones públicos suelen aparecer en mayúsculas.

**The Compression Rule.** Los titulares reducen interletrado y altura de línea para sostener masas compactas; el cuerpo abre la altura de línea y limita el ancho para recuperar calma.

## Layout

El contenedor público principal tiene un máximo de 80rem (`max-w-7xl`), con 24px laterales en pantallas pequeñas y 40px desde escritorio amplio. Las escenas cinematográficas ocupan como mínimo el viewport y usan un ritmo vertical fluido: más compacto en móvil y más amplio desde 1024px.

Las secciones editoriales alternan una columna en móvil con dos columnas asimétricas en escritorio. El portfolio usa una columna en móvil y dos desde 768px; sus tarjetas se alinean al inicio para que un detalle expandido no fuerce alturas artificialmente iguales. Las acciones pueden envolver, pero conservan objetivos interactivos de al menos 44px.

**The One Film Rule.** Cada página cinematográfica recorre una sola película a través del scroll; una sección nueva no reinicia el vídeo ni rompe su continuidad.

**The Mobile Stack Rule.** En móvil la jerarquía se preserva apilando, no encogiendo: títulos, copy, acciones y columnas cambian de orden espacial sin perder tamaño legible.

## Elevation & Depth

La profundidad es principalmente tonal y cinematográfica. El vídeo permanece en un escenario fijo detrás del contenido; gradientes oscuros, transparencias y bordes finos separan planos. Las sombras se reservan para señales interactivas: el cian produce un halo pequeño en botones, navegación activa y cabecera al hacer scroll.

### Shadow Vocabulary

- **Halo de acción:** `0 0 24px -8px var(--primary)`; refuerza la acción primaria en reposo.
- **Halo de acción elevado:** `0 0 30px -6px var(--primary)`; acompaña el hover sin convertir el botón en un objeto brillante permanente.
- **Cabecera suspendida:** `0 8px 30px -18px var(--primary)`; separa la navegación del contenido sólo después del desplazamiento.

**The Flat-Until-Interactive Rule.** Las superficies descansan en capas tonales y bordes; el brillo aparece como respuesta o señal, no como textura universal.

## Shapes

La geometría base es precisa y poco redondeada: 2px a 10px para foco, controles, botones y contenedores. Las tarjetas de portfolio constituyen una excepción deliberada con esquinas de 16px para contener información expandible sin suavizar todo el sistema. Las píldoras se reservan para tecnologías o metadatos compactos; los grandes bloques editoriales se definen por líneas horizontales, no por cajas redondeadas.

El iceberg introduce la silueta orgánica y facetada de la marca. Sus planos angulares, líneas de agua y degradados cian/blanco son el contrapeso expresivo de la retícula tipográfica.

**The Edge Hierarchy Rule.** Cuanto más estructural es el elemento, menos depende de la curva: secciones con líneas, controles con radios pequeños y sólo contenedores de información compleja con radios amplios.

## Components

### Buttons

- **Shape:** rectángulos compactos con radio medio (4px), altura interactiva mínima de 44px y flecha final.
- **Primary:** cian señal sobre tinta azul, padding 14px × 24px y halo controlado.
- **Secondary:** superficie azul translúcida con borde; cambia borde y texto a cian en hover.
- **Text:** sin contenedor pesado, cian y reducción de opacidad en hover.
- **Hover / Focus:** transiciones de 200–300ms; foco de 2px con offset sobre el fondo oscuro.

### Cards / Containers

- **Portfolio:** degradado azul-negro translúcido, borde cian de baja opacidad y esquinas amplias (16px). En hover asciende 4px y refuerza el borde.
- **Detalle expandible:** botón semántico de ancho completo, `aria-expanded`, chevron rotatorio y apertura mediante transición de filas de grid.
- **Empty state:** dos líneas horizontales y un mensaje factual; mientras no haya casos verificados, reemplaza la cuadrícula sin fabricar tarjetas.

### Navigation

La cabecera es fija. Antes del scroll es transparente; después incorpora fondo oscuro translúcido, blur medio, borde y sombra tenue. En escritorio, el estado activo usa texto cian y un punto luminoso; el hover dibuja una línea fina. En móvil, la navegación pasa a un panel vertical y mantiene la asesoría como acción visible.

### Section Headings

Los encabezados compartidos combinan eyebrow opcional en cian y tracking amplio, título balanceado, copy con ancho controlado y acciones envolventes. El portfolio rompe la escala común con un titular más grande para sostener su prioridad visual inmediata después del hero.

### Cinematic Page

Un stage fijo cubre el viewport; el contenido avanza por encima y recibe opacidad y desplazamiento desde el progreso de scroll. Las variantes de overlay “balanced” y “strong” permiten adaptar contraste sin cambiar la identidad. Con movimiento reducido, la animación se elimina y el contenido queda visible y estático.

**The Verified Work Rule.** Una tarjeta de proyecto sólo existe visualmente cuando hay nombre, logo, descripción, necesidad, solución, resultado y URL reales; el estado vacío es parte oficial del sistema.

## Do's and Don'ts

### Do:

- **Do** usar el cian para guiar: acción primaria, estado activo, foco, iconos y separadores importantes.
- **Do** mantener el vídeo o gradiente profundo como atmósfera continua y añadir contraste de forma localizada.
- **Do** sostener titulares compactos y copy respirado con anchos de lectura controlados.
- **Do** conservar foco visible, objetivos de al menos 44px y una experiencia estática completa con movimiento reducido.
- **Do** publicar proyectos únicamente cuando los datos y enlaces hayan sido verificados.

### Don't:

- **Don't** introducir colores de acento competidores ni convertir el cian en relleno indiscriminado.
- **Don't** cubrir el fondo cinematográfico con grandes tarjetas opacas o capas uniformes de glassmorphism.
- **Don't** reiniciar el vídeo por sección, usar animaciones llamativas o depender del movimiento para comprender contenido.
- **Don't** convertir cada sección en una cuadrícula uniforme de tarjetas; la jerarquía editorial debe seguir visible.
- **Don't** inventar casos, clientes, logos, métricas, tecnologías, resultados o testimonios para llenar el portfolio.
