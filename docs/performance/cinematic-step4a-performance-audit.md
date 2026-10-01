# Cinematic Step 4A — production performance baseline

Date: 2026-09-30. Scope: measure the completed ConexaCod cinematic experience in a local production build. No production runtime, media, or tuning values were changed for this audit.

## Executive result

The production experience renders content quickly in this unthrottled local run, but the audit found one narrow controller concern: Chrome’s Long Animation Frame attribution associated intermittent 55–61 ms work with the landing controller’s RAF render callback, including 15–58 ms of forced style/layout. This appeared during mobile intro and desktop scene-boundary work. The final full scroll passes did not reproduce a long task during forward or reverse traversal.

Recommendation: keep the media profiles, seek scheduler, readiness gate, preload threshold, crossfade, and responsive source-switch transaction in place. Create one isolated follow-up to trace synchronous style/layout work in `use-cinematic-controller.ts`’s `render()` callback before declaring the controller fully closed. Do not change it as part of this measurement step.

The local LCP candidate appeared at 4.32–4.51 s even though FCP was 0.09–0.26 s. The candidate was the first Hero heading span. Validate this separately in Step 4B on physical devices before changing its reveal behavior.

## Environment and method

- Windows, Node.js 22.14.0, Next.js 16.3.1, Chrome 154.0.8037.92 headless.
- Production build made with `npm run build`; Prisma generation received a temporary process-scoped placeholder `DATABASE_URL`. No `.env` file was created or edited, and no database was contacted.
- Production server: `next start -p 4173 -H 127.0.0.1`.
- Desktop: 1440×900. Mobile emulation: 390×844, device scale factor 1. No CPU or network throttling.
- Three fresh desktop and three fresh mobile documents were used for initial-load samples. One complete full-cycle run per profile included the native intro, wheel-driven forward traversal, wheel-driven reverse traversal, three boundary stress points, and desktop↔mobile↔desktop or mobile↔desktop↔mobile viewport crossings. Two internal routes were sampled at both profiles.
- Frame intervals came from temporary `requestAnimationFrame` sampling. Long Tasks, Long Animation Frames, LCP, CLS, Event Timing, resource timing, and video events were observed with a temporary document-start script. No runtime diagnostics or overlays were added to the app.
- The headless browser’s RAF interval median was about 7 ms, consistent with its scheduling cadence. These are main-thread sampling intervals, not compositor FPS or a 60 FPS claim.

## Initial load and Core Web Vitals

Navigation response, DOMContentLoaded, and load timings were very short on loopback; they do not represent an external network. FCP varied between fresh documents, so ranges are more useful than a single result.

| Profile | FCP, 3 fresh docs | Full-run LCP | CLS after run | Initial total transfer | Initial MP4 transfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| Desktop 1440×900 | 92–228 ms | 4.51 s | 0.0023 | 8.81 MB | 8.75 MB |
| Mobile emulation 390×844 | 172–236 ms | 4.32 s | 0.0050 | 2.86 MB | 2.85 MB |

The completed full-run LCP samples ranged from 4.32–4.51 s. The candidate was the Hero headline span beginning “Transformamos problemas empresariales en” (`.ks-enter`), not a video element. The browser reported FCP much earlier. Video0 reached `loadeddata` and began native playback at about 378 ms desktop and 202 ms mobile in the final run. The data does not show initial media delaying FCP; it does show the Hero heading becoming the LCP candidate several seconds later. This is a presentation-timing finding, not evidence that the seek scheduler delayed the heading.

The initial document attached exactly two MP4 sources from the selected profile: video0 and video1. Their transfer was 3.66 MB + 5.09 MB on desktop and 1.18 MB + 1.66 MB on mobile. The other loaded page resources brought initial transfer to 8.81 MB and 2.86 MB respectively. The seven video elements are mounted, but only those two had a source at the initial checkpoint.

CLS remained below 0.005 in the completed local runs. Event Timing was supported by this Chrome build, but the short synthetic wheel session produced no qualifying Event Timing entries. True INP was not established. Lighthouse and its TBT audit were unavailable because Lighthouse was not installed; no score or TBT value is claimed.

## Intro, traversal, and media readiness

Video0 played natively: `playing` was observed at 378 ms desktop and 202 ms mobile. At handoff, video0 had reached 6 s and paused at the Hero boundary (scrollY 900 desktop / 844 mobile); video1 was paused at 0 s with `readyState=4`. This preserved the native-intro ownership model.

Controlled wheel input traversed from the Hero handoff to the document end and sampled scene indices 1 through 6. Reverse wheel input revisited scenes 6 through 0 and returned to the Hero handoff. Every selected-profile asset was requested by the completed traversal. After reverse traversal, seven video sources remained attached; no source was unloaded.

Three representative boundaries—Projects, Solutions, and Contact—received three alternating 24 px wheel reversals each. The browser showed all expected adjacent/active scene layers, and the screenshots inspected during the full traversal and a breakpoint hold showed covered cinematic imagery. No black or transparent gap was observed in those inspected frames. Production diagnostics/overlays were absent (`0` diagnostic attributes found).

The production build does not expose seek assignment/coalescing diagnostics, by design. Runtime assignment counts were therefore not read from production. The existing deterministic Step 3B suite continues to cover latest-target coalescing and bounded assignments.

## Frame intervals and long tasks

The table gives p50, p95, maximum RAF interval in milliseconds, followed by sample counts strictly above 16.7 / 33.3 / 50 ms. Counts are from one full run per viewport; the initial phase has few samples and should not be interpreted as a stable distribution.

| Profile / phase | p50 / p95 / max | >16.7 / >33.3 / >50 ms |
| --- | ---: | ---: |
| Desktop initial | 7.1 / 62.6 / 62.6 | 5 / 2 / 1 |
| Desktop intro | 7.0 / 13.9 / 34.9 | 10 / 3 / 0 |
| Desktop forward | 6.9 / 7.2 / 48.5 | 12 / 4 / 0 |
| Desktop reverse | 7.0 / 20.7 / 48.5 | 24 / 1 / 0 |
| Desktop boundaries | 7.0 / 27.9 / 83.3 | 74 / 8 / 1 |
| Desktop source switch | 7.0 / 7.1 / 41.7 | 6 / 2 / 0 |
| Mobile initial | 7.0 / 34.7 / 34.7 | 1 / 1 / 0 |
| Mobile intro | 7.0 / 13.9 / 62.6 | 7 / 4 / 3 |
| Mobile forward | 6.9 / 7.1 / 34.7 | 10 / 1 / 0 |
| Mobile reverse | 7.0 / 13.9 / 41.7 | 15 / 4 / 0 |
| Mobile boundaries | 7.0 / 27.9 / 41.8 | 78 / 10 / 0 |
| Mobile source switch | 7.0 / 7.2 / 97.2 | 6 / 5 / 2 |

PerformanceObserver reported these tasks longer than 50 ms in the final full run:

| Profile / phase | Count | Durations |
| --- | ---: | ---: |
| Desktop initial | 1 | 57 ms |
| Desktop boundaries | 1 | 72 ms |
| Mobile intro | 2 | 62, 68 ms |
| Mobile source switch | 1 | 61 ms |

Chrome’s Long Animation Frame entries tied the main callback to function `K` in the production client chunk `0j6gp2_9_nq35.js`. Inspecting that bundle against the source identified it as the landing controller render path: it computes scene progress, updates content/layer styles, prepares relevant media, and flushes the seek schedulers. In the sampled frames, that callback took 55–61 ms on mobile intro and 58 ms at a desktop boundary. Long Animation Frame attribution reported 55 ms forced style/layout in one mobile intro callback and 58 ms in the desktop boundary callback; a second mobile callback reported 15 ms forced style/layout. This is direct evidence for a targeted synchronous style/layout investigation in the controller.

The final forward and reverse phases did not emit a >50 ms Long Task. A prior full desktop run did record one 176 ms forward Long Task and a 166.8 ms RAF interval; it did not recur in the final pass and had no useful script attribution. Treat it as an intermittent sample, not a stable traversal cost. Chrome’s generic Long Task attribution alone reported `window/unknown`; the Long Animation Frame script attribution provided the specific controller evidence above. No evidence attributes these intervals to video decode, and no direct GPU/compositor trace was available.

## Responsive source replacement and network inventory

Both breakpoint directions were exercised at a stationary cinematic point. The source-switch hold appeared while the replacement frame was prepared and was removed after readiness. DOM observation measured individual hold lifetimes of 188–262 ms in the final run. At the first 80 ms checkpoint, there was one hold and no active video layer; the inspected screenshot still showed covered cinematic imagery. After replacement, the new layer was active, hold count returned to zero, and no temporary canvas or image remained.

The fresh desktop run used desktop video0/video1; the fresh mobile run used mobile video0/video1. Across the complete traversal, reverse traversal, and two real breakpoint crossings, Resource Timing recorded 52.61 MB desktop and 27.87 MB mobile media transfer. These totals include both directions of source replacement and repeated scene4/5/6 requests. The seven distinct selected-profile files accounted for 40.05 MB desktop and 13.21 MB mobile. Two opposite-profile clips were requested at each crossing for the relevant scene window; no opposite-profile assets appeared before a breakpoint change.

Representative final media states were `readyState=4` for video1 at handoff and for the sampled active videos after route traversal. `getVideoPlaybackQuality()` was available but is not treated as dropped-frame truth for paused/seek-driven video. No source unloading was introduced.

## Memory checkpoints

`performance.memory.usedJSHeapSize` was available in Chrome. Values are JavaScript heap only and exclude decoded video buffers, GPU memory, and browser media-process allocations.

| Profile | Fresh doc (~1.7 s) | After intro | After forward | After reverse | After 1.2 s settle |
| --- | ---: | ---: | ---: | ---: | ---: |
| Desktop | 5.21 MB | 5.33 MB | 6.05 MB | 6.01 MB | 5.69 MB |
| Mobile emulation | 8.55 MB | 5.20 MB | 5.77 MB | 5.94 MB | 7.47 MB |

Source counts were 2 after intro and 7 after traversal; hold counts were zero at each memory checkpoint. The heap varied rather than increasing monotonically. The short sample does not indicate a JS leak and says nothing conclusive about decoded media/GPU memory.

## Internal pages and non-cinematic UI

`/nosotros` and `/soluciones` were sampled at both viewport profiles. Each kept its single-video architecture, selected the expected responsive source, reached `readyState=4`, and produced no >50 ms Long Task during the brief scroll sample. Their RAF p95 intervals were about 7–14 ms; observed maxima were 35–42 ms. Their page transfer was dominated by their one video (desktop about 6.45–9.49 MB; mobile about 2.29–3.00 MB).

The controller Long Animation Frame callbacks were the only work directly tied to the cinematic render path. React scheduler callbacks present in one intro frame were each about 5–6 ms. The audit did not produce evidence that `LogoLoop`, fonts, navbar effects, gradients, or backdrop filters caused a material stall. `npm run lint` continues to report the existing `components/LogoLoop.jsx:244` `<img>` warning; that warning is not a measured LCP cause in this run. No Lighthouse render-blocking, image, or JavaScript-cost audit was available.

## Ranked findings and decision

1. **Medium — cinematic controller style/layout work.** Chrome attributed intermittent 55–61 ms work to the landing render callback and measured 15–58 ms forced style/layout in those callbacks. This justifies one narrow follow-up focused on `use-cinematic-controller.ts` `render()` around line 338 and its content/layer style work. The measurement did not isolate which individual operation is responsible, so make no speculative change before that profile.
2. **Medium — delayed Hero LCP candidate.** LCP was 4.32–4.51 s for the Hero heading while FCP was 0.09–0.26 s. The initial media frame was usable by about 0.20–0.38 s. Confirm the candidate timing on physical devices in Step 4B; this audit does not establish that video loading caused it.
3. **Medium for real-network validation — initial media payload.** The initial pair transfers 8.75 MB desktop or 2.85 MB mobile on this local server. It did not delay local FCP, but unthrottled loopback cannot establish real-network cost. Preserve preload settings until Step 4B measures actual device/network conditions.
4. **Low / intermittent — long frame samples.** There was one un-attributed 176 ms forward task in an earlier desktop run; it did not recur in the final pass. Forward and reverse phases otherwise had no repeatable >50 ms Long Task. Keep it as a variance item, not a reason for a broad refactor.
5. **No supported follow-up — memory, reverse readiness, visual coverage, and source cleanup.** Heap did not rise monotonically, all seven selected sources were retained for reverse traversal, and successful swaps removed their holds.

Steps 3A–3D do not need an architectural rewrite. Keep the media profiles, scheduler behavior, readiness system, responsive resolver, source-switch hold, preload threshold 0.40, crossfade width 0.035, 767 px breakpoint, and seven-layer composition. Keep the `use-cinematic-controller.ts` render path open for the one isolated style/layout follow-up above; make no other Step 4A code change.

## Step 4B scope

- Recheck the Hero LCP candidate and controller long frames on physical Android Chrome and iOS Safari, including a device with a 60 Hz display.
- Measure on realistic Wi-Fi and cellular conditions; compare initial video bytes and time to first usable frame. Run throttled-network cases in Step 4B, not this audit.
- Repeat forward/reverse and the same three boundaries using touch/wheel input, capture a browser performance trace, and verify whether the controller callback and forced layout remain reproducible on-device.
- Keep JavaScript heap separate from media/GPU memory; use browser/device tooling if decoded-memory evidence is needed.

## Verification and cleanup

- `npm run build`: PASS; Next.js 16.3.1 production build compiled, type-checked, and generated 30 static pages.
- `node scripts/run-ts.mjs scripts/test-cinematic-seek.ts`: PASS.
- `node scripts/run-ts.mjs scripts/test-cinematic-transitions.ts`: PASS.
- `node scripts/run-ts.mjs scripts/test-cinematic-source-switch.ts`: PASS.
- `npm run lint`: PASS with one existing `<img>` warning at `components/LogoLoop.jsx:244`.
- `npx tsc --noEmit`: PASS.
- No database connection or mutation occurred. Lighthouse/TBT and true INP were unavailable in this local environment.
- Temporary observers, profiler files, Chrome profile, and the production server are removed/stopped after the report is saved.
