# Cinematic Step 3B — measured seek scheduler

Date: 2026-09-30. Status: implemented and verified locally in development and production builds.

## Original seek behavior and trace

Graphify was queried before editing. Its scoped results and a caller search identified both controllers and all uses of `seekVideo`:

- Landing: passive scroll event → `requestFrame` → existing RAF `render` → scene progress → `renderVideos` → `seekVideo`.
- Internal pages: passive scroll event → `requestFrame` → RAF `render` → page progress → `seekVideo`.
- Intro fallback: existing intro RAF → elapsed progress → `seekVideo`. Native intro uses `play()` and a separate initial `currentTime = 0` reset.
- Responsive source restoration also assigns `currentTime` after metadata; that Step 3A code was preserved.

The old helper returned “another frame needed” while metadata was absent or `video.seeking` was true. Controllers repeatedly scheduled RAF until the condition cleared. Targets were recomputed on each render; no separate requested/presented state existed. A seek was assigned when currentTime differed from the clamped scroll target by more than **1/30 s (33.33 ms)**. Landing and internal pages shared that helper. `loadedmetadata`, `canplay`, and `seeked` woke their controllers; `loadeddata` and `timeupdate` did not. There was no compositor confirmation.

## Files changed

| File | Change |
| --- | --- |
| `components/cinematic/cinematic-video-utils.ts` | Replace seek helper with shared per-element scheduler and development diagnostics |
| `components/cinematic/use-cinematic-controller.ts` | Own seven scheduler instances; feed/flush active targets in existing RAF; suspend inactive/native-intro work; dispose on cleanup |
| `components/cinematic/use-cinematic-page-controller.ts` | Own one instance; use the same scheduler in existing RAF; remove seeking-driven RAF polling |
| `config/cinematic-scenes.ts` | Seek tolerance only: 1/30 → 1/48 seconds |
| `scripts/test-cinematic-seek.ts` | Deterministic media/event ordering regression checks |
| `docs/performance/cinematic-step3b.md` | This report |

Graphify generated graph files were refreshed with `graphify update .` after the final source edits. The working tree already contained extensive unrelated changes; they were preserved.

## Scheduler architecture and state

Each controller effect creates a local scheduler for each video. No React state or shared mutable application registry participates in seeking.

| Field | Meaning |
| --- | --- |
| `targetTime` | Newest continuous scroll-derived intent; survives source reset |
| `requestedTime` | Last timestamp successfully assigned by this scheduler; null after source reset/suspension |
| `presentedTime` | Last rVFC `metadata.mediaTime`; null until a compositor callback confirms a frame |
| `seekInFlight` | Native seek outstanding; cleared by seek completion, frame confirmation when native seeking has ended, or a later RAF observing completion |

`setTarget` replaces one pending target. `flush` runs only from an existing controller/intro RAF. While native seeking is active it stores intent without assigning another currentTime. On completion, media events or a frame callback request the owner's coalesced RAF, which issues the newest target. B/C are discarded when D supersedes them during A. Inactive layers suspend pending scheduler work; returning to a layer supplies its current scroll target.

Targets are assigned continuously, with only the existing duration/end clamp. There is no timeline quantization, lerp, smooth-scroll addition, interval, or additional scheduler RAF loop.

### Equivalent frames

Tolerance is **1/48 s = 20.833 ms**, half the 24 FPS frame duration. A target within that tolerance of currentTime needs no assignment. A confirmed presented frame can also satisfy the target, provided it belongs to the current request and currentTime still matches that request. A separate request association prevents an older displayed frame from validating a later seek. This is especially useful for small back-and-forth inputs near a frame boundary.

### Frame confirmation, fallback, and cleanup

`requestVideoFrameCallback` is feature detected. One callback is registered for a seek; `metadata.mediaTime` updates presentedTime. It does not continually re-register while idle. A generation token rejects callbacks from canceled requests or replaced sources. The callback must describe a frame within the requested timestamp's 24 FPS cadence before it can satisfy that request.

`seeked` releases a native seek immediately, so an obsolete request does not delay a newer target until composition. Without rVFC, seek completion/currentTime provides the fallback; presentedTime remains unknown rather than being mislabeled as a compositor confirmation. A single 250 ms watchdog cancels missing frame callbacks and checks native completion for paused/hidden videos. This timeout is a recovery check, not an imposed seek delay. A later scroll/media RAF also recovers if native completion occurred without a completion event. There is no idle polling for unavailable metadata or a stalled native seek. `loadedmetadata`, `loadeddata`, and `canplay` can wake pending work; there is no timeupdate loop.

Cleanup cancels frame callbacks/watchdogs, disconnects the source observer, removes listeners and cancels the controllers' existing RAFs. Source-attribute changes and `emptied` invalidate old requested/presented state while retaining intent; flushing waits for metadata. Step 3A's resolver was unchanged.

API references: [MDN requestVideoFrameCallback](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback) describes compositor submission and mediaTime; [MDN seeked](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event) describes native seek completion. Native completion and compositor presentation are distinct signals.

## Intro and internal-page compatibility

Video0 is suspended from scroll seeking for the entire native intro, including the play-promise pending period. Native currentTime still drives automatic scroll. Existing playback, completion, interruption, timers and Hero rebound remain. If play fails, the existing intro RAF supplies targets to the scheduler. Completion/interruption resumes normal scroll seeking. There is no new intro RAF.

All five internal routes use the same algorithm and their original videos: `/nosotros` → video2, `/soluciones` → video3, `/servicios` → video4, `/proceso` → video5, `/contacto` → video6. Their page progress remains mapped directly to 0..6 seconds.

## Instrumentation and measured before/after counts

Development-only `data-cinematic-seek` JSON exposes changed targets, assignments, overwritten pending targets, equivalent flushes, compositor/fallback confirmations, resets, and flushes. No console logging or new overlay was introduced. Production inspection found **zero diagnostic attributes** and no debug pre element.

Environment: Windows, Next.js 16.3.1, embedded Chromium, local optimized H.264 clips; desktop 1440×900 and mobile viewport 390×844. Counts include initial controller setup. Browser inputs were real CUA wheel actions, not script-written scroll positions.

| Trial | Changed targets before / after | Assignments before / after | Assignment reduction | Helper calls / final scheduler flushes | Final frame confirmations |
| --- | --- | --- | --- | --- | --- |
| Mixed direction, desktop video2 | 18 / 18 | 13 / 13 | 0% | 38 / 34 | 13 |
| Mixed direction, mobile video2 | 18 / 18 | 13 / 12 | 7.69% | 37 / 32 | 12 |
| Frame-equivalent jitter, desktop video2 | 14 / 14 | 13 / 1 | 92.31% | 41 / 19 | 1 |

Mixed trial scroll deltas in pixels: `40,40,40,40,400,800,-40,-40,-400,500,-500,8,8,-8,-8,1800,-1200`, with 60 ms between actions and 800 ms final settling. Both finish at scrollY 1480. Desktop requested target: 2.081916721 s; mobile: 1.380850343 s. Final compositor times: 2.041667 s and 1.375 s respectively, with seekInFlight false.

Jitter trial: start at scrollY 0, scroll +1480, then six pairs of −40/+40 with 60 ms between actions. Fonts/layout settle before a 1441→1440 resize remeasurement. Both algorithms finish at the same target, **2.081916721 s**, and scrollY 1480. The new scheduler holds the already confirmed 2.041667 s frame for equivalent reverse movements. The comparison replay temporarily wrapped the original unchanged helper and its 1/30 tolerance with the same RAF retry behavior; that adapter and all baseline instrumentation were removed. The final code was re-tested after callback safety fixes. The improvement is frame-phase dependent and is not a universal 92% reduction.

Additional measurements:

- Controlled A→B→C→D ordering issued `[A,D]` for both rVFC and fallback paths, with no intermediate queue. Natural mobile landing work also recorded a coalesced pending target.
- Deterministic settled jitter `[2.08,2.025,2.08,2.03,2.08]`: original helper **5** assignments; scheduler **1**.
- Browser forced-fallback mixed mobile trial: **18** changed targets, **13** assignments, **0** frame callbacks, final target/currentTime **1.38085 s**, no seek left in flight. The temporary feature-detection override was removed. Final automated checks cover absent rVFC, hidden-frame timeout, missed seeked, stale presentation and stalled media.
- At a desktop scene-boundary stop, visible videos had opacities **0.4167/0.5833**, readyState 4, and targets **5.939393939/0 s**. Their flush counts stayed **27/5** over a further 900 ms: no idle RAF work.

## Browser regression results

| Case | Observed result |
| --- | --- |
| Slow down/up, rapid down/up, repeated reversals, 8 px movements and large jumps | Latest targets settled; no observed target oscillation or scheduler-induced freeze |
| Abrupt scene stop and crossfade boundary stop | Decoded frames present; no new black frame observed in inspected views; idle counters stopped |
| Native desktop intro | Video0 played with zero scheduler assignments during playback; completed at scrollY 900, handed off to video1 at 0 s |
| Desktop/mobile manual interruption | Native playback stopped; direct scroll seeking resumed and confirmed a frame |
| Reverse rebound after completed intro | Production returned to Hero at scrollY 900; intro stayed complete |
| Internal routes at both widths | All five selected correct existing sources; final targets matched currentTime; all settled with two seek assignments/two frame confirmations per forward/reverse trial |
| Breakpoint crossing at scrollY 2100 | Mobile 1.959314675 s → desktop 2.954071192 s → mobile 1.959314675 s, matching each layout's latest target; requested/presented state reset; no residual in-flight seek |
| Existing preload threshold | Desktop next source absent at scrollY 1300, attached at 1444.8 with Hero start 900 and height 990: local progress ≈0.5503 |
| Production desktop resources | Seven desktop optimized MP4 URLs observed, no mobile URLs |
| Production mobile resources | Seven mobile optimized MP4 URLs observed, no desktop URLs; initial visit attached only video0/video1 |
| Production diagnostics/console | No seek diagnostics, no debug pre, zero errors in fresh final sessions, no hydration warning observed |

Viewport changes alter page geometry, so source-swap times are compared against the new layout's intended target, not forced to preserve an obsolete desktop/mobile progress value. Screenshots inspected desktop cloud detail and mobile technological lighting with the existing narrative/layout intact.

## Checks and limitations

- `node scripts/run-ts.mjs scripts/test-cinematic-seek.ts`: PASS. Covers coalescing, reverse convergence, conservative tolerance, stale request/source callbacks, missing completion events, fallback, suspension, timeout, stalled media and disposal.
- `npm run lint`: PASS with the existing `components/LogoLoop.jsx:244` `no-img-element` warning; no errors.
- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS; 30 static pages generated. Prisma generation used a temporary command-scoped dummy DATABASE_URL because the workspace has no configured URL. No database migration, connection check or deployment was performed.
- Production smoke test used `next start` on port 3001; its temporary server was stopped after validation.
- Graphify update: PASS for code. Its existing missing `tree_sitter_sql` dependency excludes two SQL files; unrelated to the scheduler.

These are local browser/decoder observations, not a frame-time benchmark or a guarantee of scroll smoothness on every device. Mobile tests resize Chromium and use rapid bidirectional wheel gestures; physical touch hardware, iOS/Safari and throttled networks were not tested. Callback availability/delivery can vary; fallback does not prove actual compositor presentation. Temporary HMR export errors occurred while the helper and callers were being edited; fresh final development and production sessions were clean. Short-GOP media and the original readiness logic can still encounter decoding/network delays.

## Scope confirmation

**Step 3C was not implemented.** Preload remains 0.55; crossfade remains 0.035 and scroll based. Incoming-frame readiness, opacity/style calculations, seven landing layers, scene order/heights, content, source URLs and responsive resolver remain unchanged. No distant-source unloading, memory strategy redesign, GSAP, Framer Motion, canvas or WebGL was added. Original masters, existing production media files and optimized media assets were not re-encoded or replaced during Step 3B.
