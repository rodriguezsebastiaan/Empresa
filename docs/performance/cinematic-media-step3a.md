# Cinematic media integration — Step 3A

Date: 2026-09-30  
Scope: select one optimized H.264 asset per cinematic video from the current responsive profile. Existing scene order, timing, controller scheduling, transitions, and page mappings are preserved.

## Files changed

- `config/cinematic-scenes.ts` — shared desktop/mobile media URLs and responsive sources on the seven landing scenes.
- `config/cinematic-pages.ts` — responsive sources for each internal page, keeping its existing video assignment and scroll/content metadata.
- `components/cinematic/use-responsive-cinematic-sources.ts` — new centralized profile resolver, source attachment, breakpoint listener, and source-change position restoration.
- `components/cinematic/cinematic-landing.tsx` — keep the seven video elements and their eager/deferred attributes; provide both URLs as inert data attributes with no initial `src`.
- `components/cinematic/cinematic-page.tsx` — use the same resolver for the existing single video element on internal pages.
- `components/cinematic/use-cinematic-controller.ts` — resolve the current URL at the existing deferred attachment point.
- `components/cinematic/use-cinematic-page-controller.ts` — resolve the URL for the current page video and display the active filename in its existing debug panel.
- `docs/performance/cinematic-media-step3a.md` — this report.
- `graphify-out/` — refreshed with `graphify update .` after the source changes, as required by the project instructions.

## Configuration and profile strategy

The source map in `config/cinematic-scenes.ts` stores the seven video pairs once. Landing scenes and internal page configs spread the same pair for the video they already use. IDs, labels, durations, section mapping, focal positions, reduced-motion frames, narrative order, and internal page scroll/content values are unchanged.

The shared hook classifies **mobile at 767 px or narrower** and desktop above 767 px, matching the existing CSS media query. It reads `matchMedia` only in a client effect. If `matchMedia` is missing or throws, it falls back to `window.innerWidth`; SSR emits no video `src`, so it cannot start the wrong variant before the browser knows the viewport. The client attaches the selected URL once the profile is known.

Each `<video>` carries desktop and mobile URLs in `data-*` fields. Only the chosen one is copied into `src`. There are no dual `<source media>` elements and no separate hidden players. For a true breakpoint crossing, the hook updates only already-attached videos, preserves their current time, and resumes a video that was playing. Deferred landing videos use the same profile getter when `ensurePrepared` requests them. Ordinary resizes within a profile do not replace sources.

## Loading behavior and preserved controller behavior

- Inicio keeps its seven mounted video elements. Video0 and video1 retain `preload="auto"`; videos2–6 retain `preload="none"` until the existing controller prepares them.
- The existing `preloadNextAtProgress: 0.55` threshold, intro timers and interruption handling, crossfade settings, seek mapping, reverse scroll behavior, and page scroll mappings were not changed.
- Internal pages retain one video per page and their existing video assignment.
- `muted`, `playsInline`, preload values, object-fit/object-position styling, accessibility attributes, and layout remain in place.
- No media was re-encoded or removed. VP9 is not referenced.

## Browser and network verification

Tested the final production build served locally at 1440×900 and 390×844. Browser asset inventory showed:

| View | Requests on initial Inicio load | Duplicate desktop/mobile pair |
|---|---|---|
| Desktop, 1440 px | `optimized/desktop/video0_Galaxia_h264.mp4`, `optimized/desktop/video1_SistemaSolar_h264.mp4` | None |
| Mobile, 390 px | `optimized/mobile/video0_Galaxia_720p_h264.mp4`, `optimized/mobile/video1_SistemaSolar_720p_h264.mp4` | None |

After scrolling through Inicio, the browser requested all seven files from the selected profile only. Desktop videos reported 1920×1080; mobile videos reported 1280×720. All reached `readyState` 4. Video2–6 had no `src` before the controller's normal prepare point.

The five internal pages were checked at both widths. Each loaded exactly its existing scene's responsive asset, reached `readyState` 4, and reported the expected dimensions:

| Page | Existing scene | Mobile asset | Desktop asset |
|---|---|---|---|
| Nosotros | Video2 Colombia | `video2_Colombia_720p_h264.mp4` | `video2_Colombia_h264.mp4` |
| Soluciones | Video3 Col_Iceberg | `video3_Col_Iceberg_720p_h264.mp4` | `video3_Col_Iceberg_h264.mp4` |
| Servicios | Video4 PuntaIceberg | `video4_PuntaIceberg_720p_h264.mp4` | `video4_PuntaIceberg_h264.mp4` |
| Procesos | Video5 IcebergAbajo | `video5_IcebergAbajo_720p_h264.mp4` | `video5_IcebergAbajo_h264.mp4` |
| Contacto | Video6 IcebergCompleto | `video6_IcebergCompleto_720p_h264.mp4` | `video6_IcebergCompleto_h264.mp4` |

The Video0 intro completed and transitioned to the Hero/video1 scene. Forward and reverse scrolling reached all seven scenes. A mobile-to-desktop-to-mobile breakpoint test changed attached sources on each breakpoint crossing; scroll-driven scene times were retained. The listener only changes profile when the media query crosses its boundary. No horizontal overflow, hydration warning, or browser console error was observed. The sampled final contact/iceberg scene rendered as video rather than a black frame.

## Validation

- `npx tsc --noEmit` — passed.
- `npm run lint` — passed with zero errors. It reports one unrelated warning at `components/LogoLoop.jsx:244` for `<img>`.
- `npm run build` — passed. Prisma's prebuild step requires `DATABASE_URL`; the first run stopped when it was absent. The successful run used a temporary local-only placeholder in the command environment, removed when the build process exited. No `.env` file was created and no database connection was made.
- The final production build was served locally and checked in the browser at desktop and mobile widths. The local server was stopped after verification.

## Limitations

Because server-rendered HTML has no `src`, the first video request begins when the client source hook runs after hydration rather than during HTML parsing. This avoids requesting a desktop file on a mobile first load and was observed to request only the selected pair. Browser tests used a local production build; they do not measure real-device network conditions.

## Step 3B boundary

Step 3B was not implemented. This change adds no seek scheduler, interpolation, `requestVideoFrameCallback`, crossfade change, preload threshold change, or controller rewrite.
