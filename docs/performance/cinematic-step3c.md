# Cinematic Step 3C — preparation, frame readiness and layer work

Date: 2026-09-30. Implemented and measured locally in development and production. This report covers Step 3C; media was not re-encoded.

## Trace and scope

Graphify was queried before editing for source attachment, `preloadNextAtProgress`, crossfade, readiness and style writes. Its scoped subgraph identified the landing controller, shared seek scheduler, responsive resolver, scene configuration and CSS. Actual sources were then read. The local Next.js `use client` guide and installed frontend/browser skill guidance were used.

The landing path remains scroll → coalesced controller RAF → scene progress → source preparation → Step 3B scheduler → layer blend. `ensurePrepared` attaches only a requested scene. Preparing N+1 does not recursively prepare N+2. Seven video elements remain mounted in their original order. The Step 3A resolver, source pairs and 767px breakpoint are unchanged. Internal pages still have one video and their original controller.

## Baseline measured before changing 0.55

Chromium in the Codex browser, desktop 1440×900 and mobile 390×844. Fresh landing documents completed the native intro. For video1→2, video2→3 and video5→6, local progress was sampled at 0.45, 0.54, 0.56, 0.965, 0.98 and 1.01 using real wheel input, with 180ms between samples. Values below are milliseconds relative to the observed source-attachment mutation. `network` is resource start, recorded retrospectively when the request completed. `loadedmetadata` had readyState 1; `loadeddata`/`canplay` had readyState 4.

| Profile | Transition | Attachment progress | Network start | Metadata | Loaded data | Can play |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Desktop | 1→2 | 0.56000 | 3.2 | 23.5 | 89.4 | 89.7 |
| Desktop | 2→3 | 0.56040 | 5.3 | 21.6 | 103.2 | 103.5 |
| Desktop | 5→6 | 0.55967 | 3.1 | 23.7 | 82.4 | 82.6 |
| Mobile | 1→2 | 0.56048 | 3.0 | 18.1 | 47.3 | 47.5 |
| Mobile | 2→3 | 0.55991 | 3.9 | 21.3 | 53.2 | 53.4 |
| Mobile | 5→6 | 0.56008 | 3.8 | 21.1 | 60.4 | 60.7 |

All six incoming visibility events had currentTime 0, readyState 4, **zero scheduler frame confirmations** and no recorded presented timestamp. An unchanged initial frame did not cause a seek, so the old scheduler never armed confirmation for that frame. Diagnostic compositor callbacks occurred after visibility began. This establishes missing confirmation; it does not prove the browser displayed a black frame in the baseline local-network run.

The old landing render assigned opacity and visibility on every one of the seven videos: **14 writes per render**, including unchanged distant layers. Pointer events and narrative stacking were CSS-controlled. All seven landing videos inherited permanent `will-change: opacity` from the shared video rule.

## Final preload threshold: 0.40

The configured threshold is now **0.40**. The coarse comparison sequence first visits 0.45, so its attachment observations near 0.45 are not the configured threshold. A separate production probe found video2 absent at progress 0.39 and attached at approximately 0.40081 when requesting 0.401; video3 remained absent. A mobile probe similarly attached video2 at approximately 0.40095.

Measured baseline data availability took 47–104ms locally, but meaningful initial-frame confirmation also needs time, and cold desktop decode showed larger variation in the final run. At the same scroll speed, preparation lead before the 0.965 crossfade start increases from **0.415 to 0.565 of a scene: 36.1% more lead**. For a 990px scene that adds 148.5px. The six comparison transitions had a ready initial frame before entering the blend band. One stable threshold was sufficient for these measurements. Arbitrary fast jumps and slow responses still require the readiness gate; no scroll-speed heuristic was added.

Initial source attachment remains **video0 and video1 only**. Previous and current sources are retained for reverse movement. No alternate responsive source is added to an element, and no source unloading was introduced.

## Incoming-frame preparation and confirmation

The landing supplies its targets to the existing Step 3B scheduler:

- Active scene: the continuous scroll-derived timestamp, with the existing half-frame tolerance.
- Next scene after the threshold: 0 seconds, or its configured still frame for reduced motion.
- Previous scene: its end-side timestamp. The scheduler clamps 6 seconds to duration−0.001; the last actual 24 FPS frame is approximately 5.958333 seconds.
- Hero is prepared at 0 seconds throughout the native intro.

No second seeking system was added. The scheduler still coalesces obsolete requests and wakes the owner's existing RAF on media/compositor events. Its new `getFrameReadiness(target)` query reports `presented`, `fallback` or `pending`. Landing opts into confirmation of an unchanged frame; internal pages keep the previous default behavior.

`presented` requires sufficient media data, no native seek in progress, the same source, matching requested/current position and a compositor timestamp consistent with the requested 24 FPS frame. A stale compositor callback cannot confirm a different target. Source reset and suspension cancel old confirmations.

Without `requestVideoFrameCallback`, completed seeking plus matching currentTime and available data provides the fallback. When a paused/hidden video never delivers its callback, the existing **250ms bounded watchdog** can establish fallback readiness after native seeking completes. If loading outlasts that check, later data/seek completion events resume work. Recovery never pretends a fallback proves compositor presentation. No indefinite wait or idle polling loop was added.

## Final transition measurements

Same progress sequence and viewport sizes as the baseline. Times are relative to attachment; developer instrumentation and local decoder/system load affect absolute timing. These are single local trials, not statistical latency benchmarks.

| Profile | Transition | Attachment progress | Network start ms | Metadata ms | Loaded data ms | Can play ms | Target ready ms | Readiness path |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Desktop | 1→2 | 0.45010 | 18.8 | 32.6 | 69.8 | 69.9 | 352.7 | Bounded fallback |
| Desktop | 2→3 | 0.44970 | 4.4 | 282.8 | 324.1 | 328.9 | 325.8 | Presented frame 0 |
| Desktop | 5→6 | 0.44977 | 5.6 | 57.1 | 178.7 | 178.9 | 188.1 | Presented frame 0 |
| Mobile | 1→2 | 0.44957 | 20.0 | 38.9 | 71.5 | 71.7 | 343.9 | Bounded fallback |
| Mobile | 2→3 | 0.44962 | 4.0 | 16.0 | 41.7 | 41.9 | 348.7 | Bounded fallback |
| Mobile | 5→6 | 0.44990 | 5.2 | 34.7 | 109.5 | 109.8 | 409.6 | Bounded fallback |

All six first incoming visibility events followed meaningful readiness and had readyState 4. Two used compositor proof and four used bounded fallback in this final run. First visibility occurred 861–1255ms after attachment, following the same scroll sampling procedure. Callback delivery varied across repeat runs; the bounded path is necessary for paused invisible media.

Hero's first visible frame was compositor-confirmed at 0 seconds in both final intro runs. Confirming that frame added **zero currentTime assignments** to video1.

## Outgoing retention, direction and scroll blend

Crossfade width remains **0.035** and boundary share remains **0.82**. Existing formulas are preserved. For example, near the forward boundary, incoming share is `0.82 × (progress−0.965)/0.035`. The gate suppresses an unready incoming layer; when readiness arrives, the blend immediately reflects current progress. There is no wall-clock opacity animation.

The controller remembers the last valid visible layer and its source. A native seek can temporarily reduce readyState to 1 while the compositor retains its old frame; that layer remains visible. A source change or `emptied` event invalidates it. Entering a new scene requires target readiness. Normal scrubbing within an already entered scene retains its last valid frame while Step 3B catches up.

Reverse preparation uses the previous scene's end frame and the same readiness query. Leaving a preparation window suspends obsolete confirmation work. Multi-range jumps may temporarily keep a distant outgoing layer visible; latest scroll intent still drives the scheduler. Once the new active target becomes ready, it takes over. Retention protects against gaps, but cannot make decoding instantaneous.

## Layer writes and compositor hints

A small imperative writer caches last opacity, visibility and hint values. High-frequency work visits previous/active/next plus any retained visible layer, and layers leaving that window are hidden once. Identical values cause zero writes. Seven mounted elements and stacking order are preserved.

| Profile / trial | Baseline renders | Baseline opacity/visibility writes | Final renders | Final writes | Avoided writes in final run | Hint writes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Desktop, three boundaries | 41 | 574 | 48 | 42 | 630 | 9 |
| Mobile, three boundaries | 43 | 602 | 44 | 40 | 576 | 9 |

Actual count reduction is **92.7% desktop / 93.4% mobile** in these sequences. Normalized to final renders, writes declined from 14 to 0.875/render desktop and 0.909/render mobile. Different media events produce different render counts. These numbers cover video opacity/visibility only; existing section-content CSS-variable writes are outside this optimization and metric.

Landing `will-change` is now limited to the relevant window. Normal production samples had three hinted layers; a fast jump holding a distant outgoing layer temporarily had four. Hints change when the window changes, not on every frame. Internal single-video pages retain their existing opacity hint. Browser tooling does not expose actual GPU-layer count or memory, so reduced hints are not a measured GPU-memory saving.

## Network observations

Fresh initial loads and production request inventories contain only video0 and video1 of the selected profile. Full desktop traversal observed exactly the seven desktop URLs; full mobile traversal observed exactly the seven mobile URLs. Opposite-profile requests appeared only during deliberate breakpoint changes.

| Profile | Initial media body bytes observed | Transfer bytes including observed resource overhead | Total seven-file payload on disk |
| --- | ---: | ---: | ---: |
| Desktop | 8,751,075 | 8,751,675 | 40,047,203 |
| Mobile | 2,846,292 | 2,846,892 | 13,203,441 |

These initial resource timings are local transfers where the browser received the complete two files. `preload="auto"` is only a hint and does not guarantee those same complete transfers on every browser/network. Earlier preparation changes request timing, not asset sizes or initial attachment count. Timing/bytes and observed production resource inventories are retained in the JSON evidence file.

## Slow-network experiment

Native network emulation was unavailable through the browser tools. The local `scripts/cinematic-transition-proxy.mjs` fixture forwarded the production build, delaying video2 responses by **1200ms** and limiting body transfer to approximately **2,000,000 bytes/second**. It preserved range requests. No application media URL or resolver change was required. The fixture was stopped after testing.

Desktop: video2 was absent at 0.39, attached at approximately 0.40081 and still at readyState 0 inside the 0.98 crossfade band. Video1 stayed at opacity 1 while video2 stayed at 0. After data/readiness arrived, the unchanged scrollY 1870.4000 produced opacities **0.6438 / 0.3562**. They remained identical after another 600ms idle period. The outgoing frame was available throughout the delayed snapshots.

Mobile: after a fresh completed intro, progress moved 0.401 → 0.98 → 1.01 → 0.99 before video2 loaded. All four snapshots retained video1 at opacity 1 and video2 at 0, including the crossed boundary and immediate reversal. Once ready at the final stopped position, video2 was at time **0**, with opacities **0.4242 / 0.5758**, reflecting the final forward-side blend. An obsolete target from the brief crossing did not become visible.

This artificial profile checks delayed readiness, not an optimized preload setting for every network. Slow incoming media can cause a visible hold of the outgoing scene; it cannot always keep narrative imagery advancing at wheel speed.

## Stress, intro and regression validation

| Check | Result |
| --- | --- |
| Desktop/mobile 25-action stress per profile | Forward/reverse, fast single-boundary crossings, repeated direction changes, distant jumps and stops; zero empty-opacity renders after first valid data, zero empty sampled views |
| Idle after stress | Desktop render count 438→438 and mobile 426→426 across 800ms; unchanged opacity values |
| Stop inside crossfade while loading | Outgoing retained; one readiness-driven blend update, then stable |
| Native automatic intro | Video0 playing natively during initial production sample; completes at Hero; video1 first frame confirmed in both development profiles |
| Manual intro interruption | Mobile real wheel input sets interrupted, pauses video0 and leaves scroll stable during subsequent idle |
| Completed-intro rebound | Returning above Hero moves back to Hero at scrollY 900; video0 remains paused |
| Production forward/reverse traversal | All scene indices reached expected target frames once settled; mobile 11 samples all correct; desktop settled repeat all correct |
| Responsive network selection | Desktop-only and mobile-only seven-URL resource inventories on separate fresh loads |
| Breakpoint crossing | Attached sources switch together to correct profile; active scroll-derived target resumes after loading; see limitation below |
| Five internal routes × two profiles | Exactly one correct source each; scroll changes currentTime; readyState 4 after seeks |
| Production diagnostics | Zero transition/seek attributes and zero debug pre elements on inspected landing/internal routes |
| Console/hydration | Fresh final production sessions and delayed-media tests: no error/warning logs |
| Step 3B deterministic tests | Pass, including latest-target coalescing, reverse, tolerance, source reset, fallback, stale callbacks, suspension and stalled media |
| Added transition tests | Pass: initial/end-frame readiness, stale compositor recovery, forward/reverse gate, jumps, unchanged blend, style caching and hint window |
| ESLint | Pass with one existing `components/LogoLoop.jsx:244` img warning; zero errors |
| TypeScript | `npx tsc --noEmit` passes |
| Production build | `npm run build` passes; command-local placeholder DATABASE_URL only for Prisma generation, no database changes |
| Graphify | `graphify update .` succeeds; 1291 nodes / 2944 edges. Existing optional SQL-parser warning remains |

## Memory and remaining limits

Seven sources remain attached after traversal. Development JS heap grew from **18,708,169 to 20,418,074 bytes desktop**, and **18,260,519 to 21,484,503 bytes mobile** during the comparison. Later stress snapshots were approximately 21.35–21.37MB. There was no obvious monotonic JS-heap explosion in this finite run. Development event buffers are bounded to 160 events and included in these observations. JS heap excludes decoded video buffers and GPU memory; it is not proof of low total media memory, nor a reason to unload sources.

Cold desktop production traversal with only 350ms at each range sometimes retained video1 across several rapidly crossed ranges while new targets decoded. A settled repeat reached the correct frame for each scene. Remaining holds in that test coincided with media decoding/readiness, not a continuing opacity animation. No browser main-thread profiler, compositor-layer inspector or frame-time trace was available. No universal FPS claim is made.

Crossing the responsive breakpoint reloads all attached elements under the preserved Step 3A policy. Old source confirmations must be discarded. One desktop return snapshot 700ms after resize had the active element still at readyState 1 and no video layer exposed; a later snapshot recovered the correct active frame at readyState 4. This is a source-reload/decode gap, outside ordinary same-source transition retention. The previous controller also could not retain decoded media after `video.load()` cleared it. Step 3C does not promise seamless profile replacement, and this observed gap remains a limitation for a later source-switch strategy. Initial page loading similarly needs a first decoded frame.

Ordinary same-source stress/delayed-media tests did not produce a new transparent gap, and inspected transition screenshots had valid imagery. Opacity counters are not a pixel-level proof of every compositor frame. Mobile testing uses resized Chromium and wheel input, not physical touch hardware or iOS/Safari. No remote deployment or hardware FPS benchmark was performed.

Earlier development-server history included transient Turbopack/RSC `chunk.reason.enqueueModel` errors during the editing/testing session and existing Next image-LCP advice. After restarting the final development server, fresh `/`, `/nosotros` and `/soluciones` documents worked without those errors or hydration warnings; only existing image-LCP advice remained. Production sessions had neither errors nor warnings. Development warnings are not included in the production-clean result above.

## Files changed / created

| File | Purpose |
| --- | --- |
| `config/cinematic-scenes.ts` | Threshold 0.55 → 0.40 only |
| `components/cinematic/use-cinematic-controller.ts` | Preparation targets, readiness gates, outgoing retention and cached writer |
| `components/cinematic/cinematic-video-utils.ts` | Minimal readiness query, opt-in unchanged-frame confirmation and bounded fallback handling |
| `components/cinematic/cinematic-transition-utils.ts` (new) | Pure scroll blend and imperative cached layer writer |
| `components/cinematic/cinematic-transition-diagnostics.ts` (new) | Development-only bounded event/style/readiness instrumentation |
| `app/globals.css` | Move permanent video hint to internal page rule; landing hints supplied per relevant window |
| `scripts/test-cinematic-seek.ts` | Additional readiness regression cases; retain Step 3B cases |
| `scripts/test-cinematic-transitions.ts` (new) | Pure transition/layer regression tests |
| `scripts/cinematic-transition-proxy.mjs` (new) | Reproducible local delayed-media fixture |
| `docs/performance/cinematic-step3c.md` (new) | This report |
| `docs/performance/cinematic-step3c-measurements.json` (new) | Baseline/final events, counters, stress snapshots, production and network evidence |
| `docs/performance/cinematic-step3c-boundary.png` (new) | Inspected production boundary screenshot |
| `graphify-out/` generated files | Required AST graph refresh |

Application copy, layout, section heights, durations, scene order, seven-video architecture, intro timing, responsive resolver and internal-page controller were preserved. No animation framework, canvas, WebGL, new permanent RAF, source unloading, VP9/AV1 integration or media encoding was added.

## Reproduction

Run the existing development server, then use fresh browser documents at the two viewport sizes and the progress sequence above. Development-only `data-cinematic-transitions` and `data-cinematic-seek` provide bounded evidence; production omits them. Media events or readiness recovery can produce a final render after scroll stops, followed by idle.

```powershell
node scripts/run-ts.mjs scripts/test-cinematic-seek.ts
node scripts/run-ts.mjs scripts/test-cinematic-transitions.ts
npm run lint
npx tsc --noEmit
# Set DATABASE_URL for Prisma generation according to the local build environment.
npm run build
npx next start --hostname 127.0.0.1 --port 3001
$env:CINEMATIC_UPSTREAM_PORT = '3001'
node scripts/cinematic-transition-proxy.mjs
```

Open the proxy at port 3002 for the video1→2 delayed-load test. Stop the local fixture and servers after inspection. The fixture is not part of runtime application routing.
