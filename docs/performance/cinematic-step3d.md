# Cinematic Step 3D — responsive source replacement with visual retention

Date: 2026-09-30. Implemented and measured locally in development and production. Scope: responsive media replacement only.

## Root cause and original sequence

Graphify was queried first for breakpoint detection, source replacement, load, scheduler reset and retained-frame visibility. The actual resolver, both controllers, shared scheduler, Step 3C helpers and stage CSS were then inspected. Installed frontend/browser guidance and the local Next.js client-component guide were used.

The old sequence was:

1. `(max-width: 767px)` changes the resolver's profile.
2. Every attached video receives a new src, including distant previously visited clips.
3. The resolver pauses it and calls `load()`, clearing its decoded old media.
4. A metadata listener directly restores its pre-resize currentTime. This can be obsolete after responsive layout changes.
5. Source mutation and `emptied` reset Step 3B state; both could reset the same replacement generation.
6. Step 3C invalidates its retained layer because the source changed/emptied. No old pixels remain available while the replacement loads, seeks and confirms a frame.

Step 3C retention is appropriate for ordinary same-source seeks, but cannot preserve a video bitmap after `load()` destroys it. That produced the measured breakpoint gap.

## Baseline and final measurements

Chromium in the Codex browser. Desktop 1440×900, mobile 390×844. Each fresh document completed the native intro. Wheel input stopped in scene2 at progress 0.50 or scene1 at 0.98. The viewport crossed to the other profile without changing scrollY. State was sampled immediately and after cumulative waits of 50, 150, 350, 700 and 1200ms, plus browser-command overhead.

Timing starts at the observed src mutation/replacement event. Metadata and readiness timings are observations from one run, not statistically comparable decoder benchmarks. `loadedmetadata` alone is not readiness. The new layout can change active scene and local progress at the same scrollY.

| Direction / original stop | Baseline metadata ms | Baseline target ready ms | Baseline uncovered renders | Final metadata ms | Final target ready ms | Total visual hold ms | Final uncovered renders |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Desktop→mobile, scene2 mid-point | 409.7 | 678.0 | 9 | 35.7 | 390.0 | 491.3 | 0 |
| Desktop→mobile, scene1 near boundary | 155.8 | 277.5 | 4 | 28.9 | 508.0 | 605.6 | 0 |
| Mobile→desktop, scene2 mid-point | 136.3 | 708.4 | 7 | 24.6 | 535.5 | 633.9 | 0 |
| Mobile→desktop, scene1 near boundary | 108.7 | 611.8 | 6 | 29.9 | 718.5 | 839.9 | 0 |

The baseline had no exposed video layer in immediate/intermediate snapshots. All four final cases had either the old video, a populated hold, or the ready replacement. Capture happened before source replacement. Near-boundary captures retained two video layers in their original opacity/order. Three final releases used compositor proof, one used the existing bounded fallback. One replacement caused **one scheduler source reset** in all four final cases.

| Original scroll target | Required target after responsive remeasurement | Sources replaced in this crossing |
| --- | --- | --- |
| Scene2 ≈2.9988s desktop | Scene2 3.897189s mobile | 1, 2, 3 |
| Scene1 ≈5.8812s desktop | Scene2 0.572760s mobile | 1, 2 |
| Scene2 ≈2.9976s mobile | Scene2 2.155151s desktop | 1, 2 |
| Scene1 ≈5.8812s mobile | Scene1 5.231515s desktop | 0, 1, 2 |

The controller restores the new target, not the old timestamp. This is necessary when section dimensions or the active scene change after resizing.

## Visual retention strategy

`createCinematicSourceSwitch` is a shared imperative helper used by landing and internal-page controllers. It captures pixels only for responsive replacement or a subsequently required dormant clip still using the previous profile.

Before changing visible media, the helper copies each currently visible video into a temporary canvas, at most **1280×720** for these 16:9 assets. It copies the actual frame and original layer opacity/order. The canvases retain the source aspect ratio and use the video's computed `object-fit`, `object-position` and full-stage dimensions. During another resize, object position is refreshed without recapturing pixels. An opaque stage-colored container prevents changing videos underneath from altering the held blend. Existing cinematic overlays stay above the hold.

This was selected because changing src and calling load necessarily clears decoded media. Keeping another desktop/mobile video player would add duplicate media decoding and violate the requested architecture. A permanent canvas renderer would add continuous copy work. Here there is no additional player, no continuous drawing and no capture on normal scroll frames or same-profile resize.

The hold is absolutely positioned within the fixed stage, aria-hidden, non-interactive and outside document flow. It has no keyboard target and intercepts no pointer input. Internal production checks found no horizontal overflow. Canvas removal sets width/height to zero, and teardown also removes holds, clears recovery/quiet timers and removes listeners.

## Source-swap transaction

The resolver still selects exactly one profile at the existing 767px breakpoint and assigns only the original eager sources on initial mount. A genuine profile change now notifies the owning controller; it no longer independently reloads all attached sources or assigns restoration currentTime.

The shared transaction performs these steps:

1. Capture the valid visible blend before clearing any source. If a native seek temporarily lacks capturable data, keep the old source and retry after its existing completion/data wakeup.
2. Coalesce breakpoint bursts with a single 80ms quiet-period timer. This timer schedules source work, not opacity animation.
3. The controller remeasures the responsive layout and calculates current targets.
4. Replace only attached sources in the existing relevant preparation set: previous, current and next once Step 3C's 0.40 threshold permits it. Internal pages have one relevant source.
5. Pause/reload those elements. Leave dormant attached clips alone; upgrade them when future navigation genuinely requires them. Unattached future clips resolve directly to the selected profile when prepared.
6. Existing media events wake the controller. Step 3B issues the newest target after metadata, with its unchanged half-frame tolerance and coalescing behavior.
7. Require readiness for every layer semantically visible at the current scroll position. This includes both layers inside a crossfade.
8. Apply the existing current blend, then remove the hold in that same render.

One helper owns one visual transaction per root. Repeated crossings reuse its existing hold, cancel the old quiet/recovery work and apply the latest desired profile. Old-source compositor callbacks cannot establish new-source readiness because the scheduler's generation/source protections remain in force.

## Scheduler and readiness integration

The shared Step 3B scheduler remains responsible for all restoration seeks. No new source-switch code assigns currentTime. Its new `confirmFrame()` method allows internal pages to request confirmation of an unchanged initial frame **only during source replacement**. Normal internal-page behavior remains unchanged. Landing already uses Step 3C confirmation.

`getFrameReadiness(target)` remains the authoritative query. Replacement reveal requires either presented-frame evidence or the existing bounded fallback after seek completion/currentTime/data checks. Metadata/readyState alone cannot remove the hold. The 250ms compositor watchdog and half-frame tolerance remain unchanged.

The `emptied` handler now recognizes already-cleared state after a src mutation/flush reset. It does not invalidate the same replacement generation twice. A real same-source load still invalidates existing requested/presented state when present. Dedicated tests cover old callbacks, one reset per replacement and opt-in unchanged-frame confirmation.

## Scroll, blend and rapid resizing

Scrolling remains unlocked while replacement media loads. The controller continues calculating latest intent from the new layout. The hold stays still until the latest required frame(s) are ready; obsolete intermediate targets are not replayed.

Crossfade width **0.035**, boundary share **0.82** and preload threshold **0.40** are unchanged. No lerp or wall-clock blend was added. Additional tests deliberately repositioned inside the new layout's crossfade during replacement:

| Case | Final progress | Visible shares | Required frames / confirmation |
| --- | ---: | --- | --- |
| Forward scene5→6 on mobile | 0.979991675 | 5: 0.6488; 6: 0.3512 | 5: 5.879950s; 6: 0s; both fallback |
| Reverse edge on desktop scene6 | 0.009772345 | 5: 0.1297; 6: 0.8703 | 5: end frame; 6: 0.058634s; fallback + presented |

Both holds were removed only after both required frames became ready. There were zero uncovered renders. An ordinary desktop resize 1440→1439 left source-switch event count unchanged at 11→11.

After all seven scenes had been visited, a switch followed by continued scrolling required **four** new-profile replacements across the evolving relevant window, not seven replacements at crossing. Five rapid desktop/mobile crossings at a stationary scene produced **three** final-profile replacements total. Latest profile and target won. After settling, development render count remained **289→289** over 600ms; no permanent RAF or resize loop remained.

## Intro behavior

During native intro playback, the helper defers source mutation until completion or manual interruption. The original native video continues playing and driving scroll under the responsive CSS crop. The latest desired profile remains pending. It is applied at the safe handoff through the normal controller and readiness transaction.

In desktop→mobile testing, video0 progressed **0.421310→1.262316s**, remained playing with its original desktop source, and had no canvas hold during native playback. Mobile→desktop similarly progressed **0.512045→1.350318s** without restarting. Both completed the intro and replaced only videos0/1 with the selected profile; holds were then removed. No new intro timer or playback RAF was added.

A production mobile intro resized to desktop remained natively playing at 1.528106s. Real wheel input interrupted it, paused video0, applied the pending desktop sources and restored the new Hero scroll target. Hold count returned to zero. Normal isolated production intros also completed at Hero for both profiles.

## Internal pages

The same helper serves Nosotros, Soluciones, Servicios, Proceso and Contacto. Each has one video and keeps its original scroll mapping. All ten direction/route checks reached readyState 4 with the correct profile, matching the page's current progress within the displayed progress attribute's rounding. All holds were removed; diagnostic/debug counts were zero and no overflow was found.

| Route | Final mobile currentTime | Final desktop currentTime |
| --- | ---: | ---: |
| `/nosotros` | 0.391862s | 0.590814s |
| `/soluciones` | 0.498080s | 0.944050s |
| `/servicios` | 0.298295s | 0.531141s |
| `/proceso` | 0.455906s | 0.732225s |
| `/contacto` | 0.448502s | 0.987920s |

Some immediate 40ms samples occurred during an existing native seek, so capture was deferred and the old source retained until capturable data returned. Replacement was not allowed to clear that old visual without a hold.

## Network and initial payload

Fresh production loads requested only videos0/1 of their selected profile. Full isolated desktop/mobile traversals observed seven URLs each and **zero opposite-profile resource URLs**. No dual source markup or duplicate video elements were added.

Initial media body bytes observed in development were unchanged: **8,751,075 desktop** and **2,846,292 mobile**. These local requests received the complete two files; preload remains a hint rather than a promise of complete transfer. No encoding or media-file changes occurred.

Previously attached dormant sources may retain their old profile while hidden. That is intentional: they do not download the opposite variant at resize. When navigation later makes one relevant, it is replaced under the same transaction. Each element has one src; an old and a new profile can appear in a request inventory only when that scene has legitimately been replaced.

## Slow response and failure recovery

Browser-native throttling was unavailable. The existing local proxy forwarded the production build, delaying video2 headers by **1200ms** and limiting its body to approximately **2,000,000 bytes/s**.

Mobile→desktop mid-scene: at 300ms after resize, video2's replacement was at readyState 0 and all real video opacities were zero. A populated 1280×720 hold displayed the last valid frame, confirmed by an inspected production screenshot. Scrolling +220 then −70 remained possible. Once ready, the hold disappeared and desktop video2 was at **3.066666s**, matching the latest scrollY 2396/new desktop layout. It did not restore the obsolete mobile timestamp of 2.997576s or the earlier post-resize target of approximately 2.15515s.

A second fixture returned deliberate **503** responses for desktop video2. On media error, or after an **8-second** transaction timeout, recovery releases the large canvas after decoding a compressed last-valid JPEG still. There is no retry timer. The still is a stable failure state until valid media returns, a valid profile is selected, or navigation reaches another valid scene. It avoids a blank error state; it is not an endlessly running canvas transaction.

The production failure snapshot had **zero canvases**, one decoded 1280×720 image, and a data-URI length of 202,079 characters. Switching back to the valid mobile profile removed that still and restored video2. A separate final-build test continued forward instead: valid desktop video3 appeared at **3.002855s**, with hold count zero. The failed video2 was not automatically reloaded. Deterministic tests also exercise timeout recovery, cleanup and later valid-scene recovery.

Failure can intentionally leave a stable still while the required media remains permanently unavailable. It does not recover missing media through unlimited requests. A successful later media event/profile/navigation ends that error still. On successful swaps there is no persistent canvas or image hold.

## Regression and stress results

| Validation | Result |
| --- | --- |
| Four baseline breakpoint cases repeated | Final uncovered renders 0; holds removed after meaningful readiness |
| Forward/reverse crossfade at new layout position | Exact existing shares restored; both replacement frames gated |
| Scroll during delayed replacement | Latest target applied, input unlocked, inspected hold contained valid imagery |
| Rapid crossings | One hold/transaction, obsolete quiet work canceled, three final relevant replacements |
| All seven previously visited | Relevant window upgraded incrementally; no eager seven-file profile reload |
| Same-profile resize | No source-switch events, loads or captures |
| Native intro / manual interruption | Playback not restarted or fought; pending profile applied at safe handoff |
| Five internal routes, both directions | Correct profile/current mapping, readyState 4, no hold after settling |
| Normal isolated full forward/reverse traversal | Correct scene indices in all 22 samples; zero source holds and production diagnostics |
| Normal delayed Step 3C transition | Outgoing video1 stays at opacity 1 while video2 lacks data; later current scroll blend 0.6438/0.3562; no source-switch hold |
| Fresh profile inventories | Initial 0/1 only; full traversal seven selected-profile resources, no opposite variant |
| Production logs / hydration | Inspected production routes, normal traversal, slow/failure recovery: no error/warning logs |
| Step 3B seek tests | Pass, including one replacement reset and stale callback protection |
| Step 3C transition tests | Pass, unchanged formula/style-cache behavior |
| Dedicated source-switch tests | Pass: captures, relevant sources, latest profile/target, both blend frames, error/timeout, intro deferral, cleanup |
| `npm run lint` | Zero errors; existing `LogoLoop.jsx:244` img warning remains |
| `npx tsc --noEmit` | Pass |
| `npm run build` | Final build compiled, type checked and generated all pages successfully |
| Graphify | AST update succeeds; 1337 nodes / 3012 edges. Optional SQL-parser warning remains |

An earlier test harness used top-level await incompatible with this project's TypeScript target. It was moved into an async main function; final type checks and builds passed. Prisma generation used a command-local placeholder DATABASE_URL for build only; no database changes were made.

## Resource lifetime and limitations

A 1280×720 canvas has a theoretical RGBA pixel buffer of 3,686,400 bytes. Two visible blend layers cap those buffers at **7,372,800 bytes**, independent of display DPR. These are calculated buffer sizes, not measured browser/GPU allocation totals. Normal initial load and scrolling allocate no hold. Normal success zeros the buffers/removes the DOM in the ready render; teardown also clears them. The compressed failure image still needs a decoded bitmap, so compression is not proof of proportional total-memory savings.

The 491–840ms holds in the comparison deliberately freeze the last valid image rather than expose loading media. Slow networks can keep it longer until ready or bounded recovery. The page remains interactive. The selected capture cap can look softer than a full 1080p frame on a large/high-DPR display during a hold.

The helper requires a previously valid same-origin capturable frame. If an existing seek temporarily lacks capture data, source mutation is deferred. Initial loading cannot retain a frame that has never existed. Cross-origin/DRM media would need separate capture policy; these assets are same-origin.

Early normal-traversal testing with many simultaneously open media-test tabs showed long decoder holds. The isolated repeat used one test tab at a time and reached every correct scene in both directions. Both runs are retained in the measurement artifact. This is not a hardware frame-time benchmark. No main-thread profiler, GPU-memory trace or every-compositor-frame pixel trace was available, and physical mobile/iOS/Safari were not tested. No universal FPS or all-device seamlessness claim is made.

## Files modified / created

| File | Step 3D change |
| --- | --- |
| `components/cinematic/use-responsive-cinematic-sources.ts` | Profile notifications; remove bulk replacement and direct old-time restoration |
| `components/cinematic/cinematic-source-switch.ts` (new) | Shared capture/source/readiness/recovery transaction |
| `components/cinematic/use-cinematic-controller.ts` | Relevant-target synchronization and atomic blend readiness/release |
| `components/cinematic/use-cinematic-page-controller.ts` | Shared single-video transaction using unchanged page targets |
| `components/cinematic/cinematic-video-utils.ts` | Opt-in confirmation API and one reset per replacement |
| `components/cinematic/cinematic-transition-diagnostics.ts` | Count a populated source hold as exposed visual coverage |
| `scripts/test-cinematic-seek.ts` | Source-reset/confirmation regressions |
| `scripts/test-cinematic-source-switch.ts` (new) | Dedicated controlled transaction tests |
| `scripts/cinematic-transition-proxy.mjs` | Optional selected-profile failure fixture |
| `docs/performance/cinematic-step3d.md` (new) | This report |
| `docs/performance/cinematic-step3d-measurements.json` (new) | Baseline/final traces, sampled states, stress, network and production evidence |
| `docs/performance/cinematic-step3d-hold.png` (new) | Inspected production hold during delayed replacement |
| `graphify-out/` generated files | Required AST graph refresh |

Seven landing videos, single internal-page videos, breakpoint, media URLs, H.264 assets, tolerance, preload threshold, crossfade math, scene order, section heights and copy are preserved. No media re-encoding, VP9/AV1, extra player, framework, WebGL or continuous canvas renderer was introduced.

## Reproduction

```powershell
node scripts/run-ts.mjs scripts/test-cinematic-seek.ts
node scripts/run-ts.mjs scripts/test-cinematic-transitions.ts
node scripts/run-ts.mjs scripts/test-cinematic-source-switch.ts
npm run lint
npx tsc --noEmit
# Configure DATABASE_URL for Prisma generation in the local build environment.
npm run build
npx next start --hostname 127.0.0.1 --port 3001
$env:CINEMATIC_UPSTREAM_PORT = '3001'
node scripts/cinematic-transition-proxy.mjs
```

Use port 3002 for slow video2. For the failure fixture, set `CINEMATIC_PROXY_PORT=3003` and `CINEMATIC_FAIL_PROFILE=desktop` before launching a separate fixture process. Start in mobile so the original video2 remains available, then resize to desktop. Development-only `data-cinematic-source-switch` records bounded events; production has no diagnostic attribute. Stop owned fixture/production processes after testing.
