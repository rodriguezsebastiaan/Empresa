# Cinematic Step 4B — controller and network validation

Date: 2026-09-30 / 2026-10-01 UTC. Local production profiling of ConexaCod.

## Decision

Keep the minimal controller correction. The two measured forced-style reads were isolated and the repeated comparison improved materially. Freeze Steps 3A–3D's seven-video architecture, seek scheduler, readiness gating, crossfade, responsive switching and current media encodings against further speculative optimization.

**One issue remains:** desktop native intro rebuffering under the custom Fast 4G-like profile. Define exactly one follow-up: validate a bounded desktop startup bandwidth/buffering policy for video0 while ensuring video1 is ready for Hero handoff. The entire initial preload policy cannot yet be declared complete. No network-policy change or re-encoding was implemented here.

## Environment and reproducibility

- Windows; Node 22.14.0; Chrome 154.0.8037.92 headless; native CDP over an isolated profile. agent-browser/Playwright were unavailable, so the browser workflow used CDP directly.
- Clean production builds, next start on 127.0.0.1:4173, desktop 1440×900 and mobile 390×844, DPR 1. No CPU throttle. Mobile means viewport emulation on this computer.
- The first exploratory baseline used Next 16.3.1. Concurrent work upgraded the shared checkout to 16.3.6 and briefly introduced an unrelated security-test type error. That work corrected its error. The **reported before/after comparison repeats both variants on 16.3.6**; exploratory data is retained separately.
- Another build replaced shared .next during a network trial and caused ChunkLoadError. That invalid trial is excluded. Final network/regression runs use a private snapshot of the final uninstrumented production output; the first snapshot warmup is also excluded from primary metrics.
- Each before/after variant: three fresh documents per viewport, 7.6 s navigation/intro/settle observation, then Projects, Solutions and Contact boundaries. Each boundary is positioned 12 px before its measured start, followed by three +24/−24 px wheel pairs, 100 ms apart, after a 220 ms positioning settle. Identical sequence and instrumentation in both variants. The first trial of each viewport has a Chrome trace.
- Profiling-only performance.mark checkpoints surrounded geometry, progress, preparation, root styles, content, source sync, scheduler, readiness, blend, layers and rebound work. Wrapped native geometry getters recorded durations and slow-read stacks. All controller marks were removed before the final build; no extra application RAF was introduced.
- Browser-injected observers and RAF sampling are measurement tooling. Initial observer scroll reads themselves can force layout; their MutationCallback LoAFs are excluded from controller attribution. Heading computed-style/rect sampling runs separately from timing comparisons. RAF statistics include browser rendering, decode, GC, tooling and host scheduling; they are not compositor FPS or field INP.
- Evidence: summary.json and network-summary.json; raw per-run JSON and Chrome traces retained compressed in step4b-evidence. Trace timestamps are monotonic microseconds; browser observations are navigation-relative milliseconds. Gzip traces can be decompressed and imported into Chrome Performance.

## Graph and synchronous render path

Graphify query render(), broader helper query and explain createVideoSeekScheduler ran before source inspection. The graph exposes named helper relationships but does not enumerate every nested closure; direct source inspection completed that mapping.

| Order | Synchronous operation / callees | Reads and writes |
| --- | --- | --- |
| 1 | render → measure when layoutDirty | Root + six section getBoundingClientRect and scrollY reads; cache rootStart, ranges, introEnd and timelineEnd. Dirty on resize/reduced-motion changes; initial/start/complete paths also explicitly measure. No ResizeObserver path. |
| 2 | Scene/progress → clamp; diagnostics.sample | Cached ranges plus live scrollY; diagnostics return null in production. |
| 3 | ensurePrepared → resolveCinematicVideoSource → getMediaProfile | Profile from ref, source/dataset attributes; only unprepared clips receive src/preload/load writes. |
| 4 | smoothstep; root CSS variables; setContentPresence | Cached section centers/heights, descendant querySelector, opacity/transform variable writes. Previously seven innerHeight reads: one center + one per section, interleaved with writes. |
| 5 | renderVideos → sourceSwitch.sync | Target map; ordinary same-profile path has attribute/profile reads. capture/refreshGeometry use getComputedStyle and viewport reads only in bounded source-switch transactions, and canvas drawImage only there. |
| 6 | scheduler.setTarget/flush → reset/cancelConfirmation/armConfirmation/publish | Media attributes, duration/currentTime/readyState/seeking; continuous target assignment when needed, bounded rVFC/watchdog registration, requestFrame is coalesced. publish is inactive in production. No DOM box or computed-style reads. |
| 7 | suspend; getFrameReadiness; getCinematicBlend → isReady | Media/frame state, pure numeric blend, diagnostics traces inactive in production. |
| 8 | layerWriter.apply; sourceSwitch.needsReadiness/finish → confirmFrame/getFrameReadiness/release | Cached opacity/visibility/hint differences; source-switch release removes its temporary capture after required frame confirmations. |
| 9 | scheduleIntroRebound | Previously live scrollY after root/content/layer writes once Hero boundary had been reached; timer callback reads fresh scrollY later and may schedule the existing rebound. |
| 10 | Optional debug text | Debug element absent in production. |

There are no offsetWidth/Height, clientWidth/Height or scrollWidth/Height reads in the ordinary render helpers. Video intrinsic videoWidth/Height are media dimensions in capture, not element layout dimensions. Profile matchMedia/innerWidth fallback belongs to responsive profile updates; render obtains the cached ref.

## Exact cause and retained correction

**Desktop:** root/content/layer writes → scheduleIntroRebound → window.scrollY → synchronous UpdateLayoutTree. Exploratory desktop run 1 read at 7804.4 ms cost 56.1 ms (trace 55.960 ms); run 3 read at 9665.2 ms cost 81.3 ms. LoAF names W in the instrumented bundle, corresponding to source render. Matched 16.3.6 trials reproduced costly rebound reads up to 41.6 ms and controller LoAF forced-style durations up to 34.6 ms.

**Mobile:** root variable writes → setContentPresence → innerHeight, followed by section writes → subsequent innerHeight reads. Exploratory mobile intro read at 4091.4 ms cost 46.5 ms; Chrome UpdateLayoutTree within content:start cost 46.359 ms over 508 elements. Mobile boundary read reached 74.0 ms in another exploratory run. The matched-version baseline still spent most controller time in content updates. These are forced **style recalculations**, not evidence of repeated expensive box Layout in the ordinary callback. Chrome reports both through forcedStyleAndLayoutDuration.

Correction only in components/cinematic/use-cinematic-controller.ts:

1. Read viewportHeight alongside scrollY before preparation/styles; pass it to setContentPresence and reuse it for all sections.
2. Pass the existing render scrollY to scheduleIntroRebound. Calls from its later settle timer still default to a fresh scroll read, and its timeout callback retains its fresh read.

Scroll remains the source of progress; the snapshot is per-render, so resize/browser viewport changes are not hidden behind a persistent stale cache. No reveal threshold, timing, source/seek behavior, layer count or tuning value changed. No content update was postponed. Layer writer caching was already working and was preserved.

## Matched-version before/after

Aggregated three runs per row. Durations in milliseconds; p95 is empirical, not a population confidence bound. Initial 7.6 s phase includes navigation and settle around the native intro.

| Profile / phase | Render p95 before → after | Render max before → after | Controller LoAF count before → after | Max forced style in attributed LoAF before → after |
| --- | ---: | ---: | ---: | ---: |
| desktop / intro | 0.6 → 0.5 | 14.1 → 8.2 | 1 → 0 | 0.0 → 0.0 |
| desktop / boundaries | 30.7 → 1.9 | 42.4 → 4.6 | 6 → 0 | 34.6 → 0.0 |
| mobile / intro | 13.2 → 0.5 | 60.8 → 31.9 | 2 → 0 | 25.2 → 0.0 |
| mobile / boundaries | 14.0 → 1.5 | 23.8 → 4.3 | 0 → 0 | 0.0 → 0.0 |

A zero after value in the last column means **no controller-attributed LoAF**, not proof that every render has literally zero style cost. Post-fix traces contain no UpdateLayoutTree/Layout within content or rebound checkpoints in these ordinary intro/boundary scenarios. Short first scroll reads can still synchronize previously pending browser work.

### Logical timing breakdown

Values are p95 / maximum milliseconds across three runs. The affected desktop boundary and mobile initial/intro phases are shown; complete four-phase statistics are in summary.json. Checkpoint resolution is about 0.1 ms and profiling overhead is included.

| Operation | Desktop boundaries before | Desktop boundaries after | Mobile intro before | Mobile intro after |
| --- | ---: | ---: | ---: | ---: |
| geometry | 0.1 / 0.1 | 0.1 / 0.1 | 0.0 / 1.4 | 0.1 / 1.2 |
| progress | 1.3 / 2.4 | 1.2 / 3.5 | 0.1 / 1.5 | 0.1 / 1.6 |
| prepare | 0.2 / 0.8 | 0.1 / 0.8 | 0.1 / 0.1 | 0.1 / 0.2 |
| root-style | 0.1 / 0.3 | 0.1 / 0.2 | 0.1 / 0.2 | 0.1 / 0.2 |
| content | 0.2 / 0.3 | 0.1 / 0.8 | 12.8 / 59.9 | 0.1 / 0.2 |
| source-sync | 0.2 / 0.3 | 0.2 / 0.2 | 0.1 / 1.0 | 0.1 / 0.2 |
| scheduler | 0.5 / 1.1 | 0.4 / 0.8 | 0.1 / 1.1 | 0.1 / 0.6 |
| readiness | 0.1 / 0.2 | 0.1 / 0.2 | 0.1 / 0.2 | 0.1 / 0.2 |
| blend | 0.1 / 0.8 | 0.1 / 0.2 | 0.1 / 0.2 | 0.1 / 0.2 |
| layers | 0.2 / 0.7 | 0.1 / 0.2 | 0.1 / 0.3 | 0.1 / 0.2 |
| rebound | 28.9 / 41.7 | 0.1 / 0.3 | 0.0 / 0.3 | 0.0 / 0.1 |
| render | 30.7 / 42.4 | 1.9 / 4.6 | 13.2 / 60.8 | 0.5 / 31.9 |

One mobile after render measured 31.9 ms despite all measured subregions being short. It was not a LoAF, and the current samples do not isolate that gap; no speculative further change was made.

### RAF and all-page LoAFs

| Profile / phase | RAF p50 / p95 / max before | RAF p50 / p95 / max after | RAF >33.3 / >50 count before → after | All-page LoAF count before → after |
| --- | ---: | ---: | ---: | ---: |
| desktop / intro | 7.0 / 20.9 / 145.8 | 7.0 / 20.8 / 159.7 | 19 / 7 → 26 / 6 | 7 → 7 |
| desktop / boundaries | 7.0 / 34.6 / 90.3 | 7.0 / 27.7 / 76.4 | 81 / 7 → 53 / 1 | 6 → 1 |
| mobile / intro | 7.0 / 14.0 / 250.0 | 7.0 / 14.0 / 465.3 | 11 / 6 → 17 / 7 | 7 → 7 |
| mobile / boundaries | 7.0 / 14.1 / 27.9 | 7.0 / 20.9 / 48.7 | 0 / 0 → 20 / 0 | 0 → 0 |

Overall mobile boundary RAF p95 increased even while controller cost fell; initial maximum RAF intervals also include slow document/layout work from the audit's MutationObserver and other host/browser work. This supports retaining the precise controller fix, and does not support claiming a general FPS improvement.

## Hero insertion, reveal and LCP

The heading is server-rendered in HomeHero and was present at 172.7 ms desktop / 172.8 ms mobile in primary network runs. Its first .ks-enter span has a 220 ms delay and a 900 ms entrance animation; it was sampled at effectively full own opacity by 1414.4 / 1400.3 ms. Its parent was still opacity 0 and the heading was initially below the viewport.

During native intro, tickIntro maps video0.currentTime / duration to runway scroll. render maps that same scroll to local progress. Hero presence multiplies by smoothstep(0.68, 0.98, progress). Thus first visibility requires intro progression near 4.08 s of a six-second clip and the heading entering the viewport. It does **not** wait for video0 completion or for video1 download to finish. Pending/running Hero CSS sets the zero reveal default; the controller's inline presence variables subsequently reveal the content as the narrative progresses.

| Primary network run | Heading LCP | First positive parent reveal sample | Video0 media time at sample | Intro complete | LCP before completion |
| --- | ---: | ---: | ---: | ---: | ---: |
| desktop | 7.792 s | 7.824 s | 4.167 s | 9.666 s | 1.874 s |
| mobile | 5.060 s | 5.158 s | 4.242 s | 6.921 s | 1.861 s |

Heading computed-style/geometry samples are spaced 200 ms apart, so the first positive sample is an upper bound, not the exact first paint. Chrome's heading LCP occurs inside that sampling window. The CSS entrance had already finished several seconds earlier. There is no measured extra controller wait after the intended reveal point.

Classification: the unthrottled 4.32–4.51 s Step 4A LCP is the intentional narrative tradeoff. Mobile emulated-network LCP shifts with video startup. Desktop LCP has an additional **technical media rebuffering delay**: 7.792–9.004 s across primary/repeat, while the heading still appears around media progression 4.1 s. Preserve narrative reveal; address startup buffering through the single follow-up below. No copy/layout/reveal redesign was made.

## Custom Fast 4G-like network profile

CDP Network.emulateNetworkConditions: latency 80 ms, download 1,125,000 bytes/s (**9 Mbps**), upload 187,500 bytes/s (**1.5 Mbps**), offline false, cellular4g connection type. Cache disabled and browser cache cleared before each final run. No CPU throttling. This is a custom browser-emulation profile, not a preset certification or physical cellular test. The CDP method is supported by this Chrome but deprecated by the current protocol in favor of newer network-rule APIs.

Primary final run per viewport plus one desktop repeat, observed for ~20 s each on a stable private production snapshot. Additional exploratory/warmup trials are separate. rVFC can fire on a hidden/not-yet-ready frame: the first callback is **not** called visible. First usable frame below means rVFC with readyState ≥2 and the original video layer's inline opacity >0 and visibility visible; it is a compositor-submission proxy, not physical display instrumentation.

| Run | FCP | Video0 loadeddata | First usable frame | First playing | Video1 loadeddata | Handoff / video1 state | Post-start stalls / total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| desktop network | 0.400 s | 1.462 s | 1.514 s | 1.462 s | 1.371 s | 9.666 s / 4 | 5 / 2.063 s |
| mobile network | 0.524 s | 0.916 s | 0.967 s | 0.916 s | 0.917 s | 6.921 s / 4 | 0 / 0.000 s |
| desktop network-repeat | 0.424 s | 1.476 s | 1.531 s | 1.476 s | 1.398 s | 10.874 s / 4 | 7 / 3.196 s |
| desktop network-isolation | 0.404 s | 1.245 s | 1.304 s | 1.245 s | blocked | 7.449 s / 0 | 1 / 0.188 s |

Normal desktop and mobile handoffs had video1 readyState 4, target currentTime 0 and visible opacity 0.82 at the Hero boundary; video0 retained the 0.18 crossfade share. No additional Hero readiness wait was observed. Initial waiting at media time 0 is startup and is excluded from rebuffering counts.

### Initial media transfer accounting

| Run | Observed MP4 body bytes | Observed encoded body bytes | Approx. body MB |
| --- | ---: | ---: | ---: |
| desktop network | 5,698,363 | 5,698,363 | 5.70 |
| mobile network | 1,877,280 | 1,871,280 | 1.88 |
| desktop network-repeat | 5,695,363 | 5,695,363 | 5.70 |
| desktop network-isolation | 3,662,874 | 3,662,874 | 3.66 |

These are CDP Network.dataReceived sums correlated by requestId to MP4 URLs, through the observation window; HTTP headers are excluded. Body bytes include delivered chunks of eventually canceled media range requests. Small body/encoded differences and canceled partial ranges prevent treating this as exact full-wire accounting. In throttled runs, ResourceTiming reports only 300 bytes/0 encoded for the aborted video1 request, so it would materially undercount transfer; it is preserved as a cross-check rather than used as the total. The two full files still total 8.75 MB desktop / 2.85 MB mobile, as Step 4A measured when transfers completed; throttled paused video1 fetches are partially delivered. Only selected-profile video0/video1 were attached initially.

### One isolated follow-up: desktop native-intro startup buffering

Responsible playback asset: **desktop/video0_Galaxia_h264.mp4** (3,662,874-byte body); competing eager Hero asset: **desktop/video1_SistemaSolar_h264.mp4** (5,088,201-byte full file). Both requests start together around hydration. Desktop normal runs produced 5 and 7 rebuffering events (2.063 and 3.196 s). Mobile produced none in the primary run and none in preceding valid exploratory/warmup observations.

Diagnostic only: block the exact desktop video1 URL at CDP level, keep the 9 Mbps / 80 ms profile, and rerun native intro. Video0 first usable frame improved to 1.304 s and rebuffering fell to one 188 ms event. This supports bandwidth competition as a substantial contributor; the residual stall means contention is not proven to be its only cause. Hero was deliberately unready (readyState 0), so blocking/deleting its preload is **not a shippable correction**. That trial is excluded from regression acceptance.

Follow-up scope: measure one bounded startup bandwidth/buffer policy for **desktop video0**, preserve early video1 frame preparation and the current handoff, then compare the same cold 9 Mbps profile for stalls, first usable frame and readiness. Acceptance: eliminate repeated desktop stalls without an unbounded startup wait, a Hero readiness delay, or any change to 1080p/720p assets, 0.40 threshold, 0.035 fade, 767 px breakpoint, 1/48 seek tolerance or seven layers. No additional broad cinematic optimization phase is warranted.

Mobile encoding/preload strategy is acceptable in these samples and remains frozen. Desktop quality is not reduced based on file size; the measured playback issue is the reason for the isolated follow-up.

## Physical-device availability and manual checks

Windows connected-device inspection found a Samsung-named **Bluetooth BTHENUM** entry, without an ADB/USB browser-debug interface. adb and idevice_id were unavailable on PATH and the checked standard Android platform-tools locations. No controllable Android Chrome or iOS Safari device was available. No physical-device or mobile thermals result is claimed.

| Android Chrome | iPhone Safari |
| --- | --- |
| Fresh load on cellular: intro starts muted/inline; note time to imagery and any stalls. | Fresh Safari load on cellular: intro stays inline; note autoplay/startup/stalls. |
| Slow and fast touch scroll; complete forward and reverse traversal. | Slow and fast touch scroll; complete forward and reverse traversal. |
| Reverse repeatedly around a scene boundary; interrupt automatic intro with touch. | Reverse repeatedly around a scene boundary; interrupt intro with touch. |
| Rotate portrait↔landscape across the 767 px media profile; confirm hold releases. | Rotate portrait↔landscape, including browser-bar expansion/collapse; confirm hold releases. |
| Watch for black frames, frozen holds, delayed catch-up; repeat several minutes and note heat or degraded scroll response. | Watch for black frames, frozen holds, delayed catch-up; repeat several minutes and note heat or degraded scroll response. |

## Regression and final checks

- All three requested suites passed: `node scripts/run-ts.mjs scripts/test-cinematic-seek.ts`, `scripts/test-cinematic-transitions.ts`, and `scripts/test-cinematic-source-switch.ts`. Coverage includes continuous targets, frame-equivalent jitter, readiness, reverse/delayed transitions, style cache, source retention and bounded cleanup.
- Production browser regression passed at both viewports. Automatic intro completed; forward traversal reached document end (scrollY 6492 desktop / 8427 mobile); reverse returned to Hero handoff (900 / 844). Samples visited visible indices 0–6. There were no empty visible-video samples among 26 desktop / 32 mobile checkpoints. This sampled evidence does not establish every composited frame was inspected.
- Manual wheel interruption set introState `interrupted` and paused video0 on both profiles.
- Desktop→mobile→desktop and mobile→desktop→mobile source crossings settled with the correct active source at readyState 4 and no remaining hold. Two early snapshots contained the expected temporary hold; all four settled snapshots had hold count 0.
- `/nosotros` and `/soluciones` each mounted one selected-profile video, readyState 4, with changed scrub time after input on both viewports.
- No browser Runtime exceptions, hydration console errors or production cinematic diagnostics appeared in accepted regression runs. Network primary/repeat runs had no uncaught errors. The deliberately blocked-media diagnostic and the excluded stale-build trial are not acceptance runs.
- Four retained screenshots were visually inspected: desktop forward end, mobile reverse Hero, and two responsive crossing frames. Cinematic imagery covered the inspected frames; no black gap was visible there. All eight captured screenshots remain in the evidence directory.
- `npx tsc --noEmit` passed. Clean final `npm run build` passed on Next 16.3.6 (30 static pages), after removing all profiling marks. Prisma generation used a process-scoped placeholder DATABASE_URL; no database connection or environment file was introduced. Final whitespace normalization was verified to preserve the exact built code semantics.
- `npm run lint` passed with the existing `components/LogoLoop.jsx:244` next/no-img-element warning (0 errors). No new warning was introduced by the controller change.
- `graphify update .` completed with AST extraction and no API/LLM cost: 1395 nodes, 3092 edges. It refreshed the shared code graph, including other concurrent changes. Existing optional SQL parsing was skipped because tree_sitter_sql is not installed; no dependency installation or semantic rebuild was needed for this task.

## Freeze boundary

The reported forced-style pattern is measurably corrected. Steps 3A–3D's controller architecture and current media profiles are frozen against further optimization absent a new reproducible production issue. There is **one exception to overall completion**: the desktop initial-network buffering follow-up described above. The desktop initial preload/buffering strategy is not fully frozen until that isolated result is acceptable. Physical checks remain a deployment validation checklist, not a claim that this computer emulates device decode, Safari or heat behavior.

References: Chrome's [Long Animation Frames documentation](https://developer.chrome.com/docs/web-platform/long-animation-frames) defines forcedStyleAndLayoutDuration attribution; [CDP Network documentation](https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-emulateNetworkConditions) documents emulation units and API status. The findings and numbers above come from this repository's local measurements.
