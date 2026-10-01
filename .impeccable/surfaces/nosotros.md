# Surface Contract: `/nosotros`

Status: implemented and verified on desktop and mobile.

Seed: not applicable. The user supplied the binding structure, copy, hierarchy,
visual constraints and preserved cinematic system. This was a precisely specified
extension of an established visual world, so no randomized concept selection was
used.

## THESIS

Conexacod earns credibility by showing the place where verified work belongs
before it explains its corporate philosophy. The page must feel like one
continuous cinematic argument, not a stack of interchangeable marketing cards.

## OWN-WORLD

The surface inherits Conexacod's dark navy and cyan system, iceberg identity,
approved readable type scale, translucent local supports and Video2 Colombia.
The moving geographic image is the material; typography and restrained rules
organize the narrative over it. No new visual identity is introduced.

## STORY

The fixed order is Hero → Portfolio → what Conexacod is → how Conexacod thinks
and works → local identity → final CTA → Footer. The Hero offers only portfolio
and advisory paths. The final CTA owns advisory and diagnostic conversion.
Corporate ideas are compressed so they support, rather than compete with, proof.

## FIRST VIEWPORT

The visitor sees the statement “Pensamos en grande. Construimos desde lo
cercano.” over the existing Video2 background, the Manizales-to-world message,
and exactly two actions: “Ver proyectos” and “Agendar asesoría”. The first action
must land on `#proyectos` without interrupting the single-film scroll timeline.

## FORM

- Portfolio is the dominant section immediately after the Hero, with a large
  editorial heading and two-card desktop / one-card mobile architecture.
- Project content comes only from the centralized verified data source. Empty
  slots never render, and disabled detail pages return not-found.
- Project cards use one border-based surface treatment, accessible disclosure,
  distinct direct/detail actions and optional metadata only when real.
- Supporting sections use editorial columns, rules and concise lists instead of
  repeated card grids or decorative glass containers.
- Motion stays subordinate: the existing scroll-to-video mapping, reverse scroll,
  subtle disclosure and `prefers-reduced-motion` behavior are preserved.

## QUALITY BAR

- One H1 and a semantic H2 sequence matching the fixed story.
- No invented project, client, logo, URL, technology, result or metric.
- Video2 remains the only cinematic asset for `/nosotros`; the final frame holds
  at the footer and reverse scrolling restores earlier frames.
- Controls retain visible focus, approximately 44px targets and explicit external
  link/disclosure semantics.
- No horizontal overflow at 390px; project cards become two columns at `md` and
  remain independently sized when expanded.
- Inicio keeps LogoLoop, identifies its generic marks as capabilities, and links
  to `/nosotros#proyectos` with a secondary text action.
