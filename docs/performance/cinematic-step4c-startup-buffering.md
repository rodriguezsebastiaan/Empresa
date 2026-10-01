# Cinematic Step 4C — desktop startup buffering

Date: 2026-10-01. ConexaCod. Local production measurement.

## Decision

**Keep the existing eager video0/video1 behavior. No startup policy is shipped.** Two bounded buffer-priority variants were measured. The 1.5 s / 3 s variant still had repeated stalls. The 2.5 s / 5 s variant improved most runs but failed to complete one observed intro and repeat runs still produced 3–4 stalls. This fails the requested consistency/approximately-zero-or-one-short-stall acceptance gate. The unsuccessful run is retained, not excluded as a lucky/unlucky outlier.

The desktop startup issue remains unresolved. The overall cinematic engine **cannot be declared technically frozen**. Existing freezes for the encodings, seven layers and Steps 3A–3D remain in place. No extra cinematic code optimization is proposed here.

## Current startup sequence

Graphify was queried only for the responsive resolver, ensurePrepared and startIntro relationships; actual source was inspected before editing. The relevant installed Graphify, Next.js and browser guidance and local Next 16.3.6 production/use-client docs were used.

1. cinematic-landing renders seven video elements without src. Only indices 0 and 1 have data-cinematic-eager=true and preload=auto; the rest have preload=none.
2. The responsive hook's initial effect selects desktop/mobile using the existing 767 px breakpoint and attaches src to both eager videos. This begins normal browser loading before the controller prepares them.
3. Controller ensurePrepared(0/1) attaches the selected source if necessary, sets preload=auto, marks prepared and calls load(). Both are prepared again idempotently in startIntro.
4. startIntro suspends video0's seek scheduler, sets currentTime=0 and playbackRate=1, starts native play and follows native currentTime with the existing cinematic scroll/reveal timeline. Duration remains 6 s. Media delays therefore change wall-clock completion, not narrative reveal timing.
5. The render path can also prepare video1 through active/adjacent preparation and the unchanged .40 threshold; source-hook deferral alone would be insufficient.
6. At Hero, video1's scheduler target remains 0 and the existing confirmed-frame/readiness gate controls its .035 crossfade participation. Native completion does not wait for video1 or delay reveal on its behalf. No explicit new Hero wait is added.

Existing controller listeners include loadedmetadata, canplay, seeked and emptied; native play's promise, ended state and currentTime are available. Additional progress, loadeddata, playing and timeupdate listeners were used temporarily to inspect contiguous buffered lead. buffered supplies a static TimeRanges snapshot, with no layout read and no need for extra polling. [HTML Standard: buffered](https://html.spec.whatwg.org/multipage/media.html#dom-media-buffered).

## Candidates and exact conditions

Only candidate A's two small bounded variants were tested; candidate B was skipped. preload is a browser hint and metadata-only loading does not guarantee a meaningful bandwidth partition. Paused auto-preload in the measured runs already stopped after partial delivery; changing its hint was not sufficient grounds to add another permanent path. [HTML Standard: preload](https://html.spec.whatwg.org/multipage/media.html#attr-media-preload).

Both variants attached video0 immediately, deferred desktop video1 src/preparation, and gated every ensurePrepared(1) route. A small nonreactive helper promoted through normal src/preload/load; no fetch/blob, network-adaptive policy or fetchPriority was used. Media listeners were removed and one timer cleared on promotion/disposal. Interruption, skipped intro, reduced motion, play rejection and profile change promoted immediately; profile change used the resolver's latest profile. Mobile stayed eager. Candidate code and deterministic checks are archived as gzip evidence, not shipped source.

| Variant | Contiguous lead test | Absolute maximum delay | Result |
| --- | --- | --- | --- |
| lead15 | buffered range containing currentTime has ≥1.5 s ahead; readyState≥2 and not paused | 3000 ms from controller setup, before native play | Reject: 4–6 stalls |
| lead25 | ≥2.5 s ahead, or the entire finite remaining intro is buffered; readyState≥2 and not paused | 5000 ms from controller setup, before native play | Reject: unstable completion and repeated stalls |

The absolute setup deadline is earlier/stricter than the same budget after loadeddata/playing and also bounds media that never reaches either event. It was never extended recursively. Promotion happened at the deadline in the observed throttled runs. Buffer lead at lead15 promotion was only about .53–.96 s, explaining why 1.5 s was not reached. Neither threshold qualifies as an accepted production value.

## Measurement method

Chrome 154.0.8037.92 headless, Windows, Node 22.14.0, Next 16.3.6 production snapshot on 127.0.0.1:4173; desktop 1440×900, mobile emulation 390×844, DPR 1. No CPU throttle. Native CDP: latency 80 ms, download 1,125,000 B/s, upload 187,500 B/s. Fresh browser target and Network.clearBrowserCache plus cache disabled for every cold trial. No media changes.

Baseline and each initial candidate have three accepted sequential cold trials with identical instrumentation and a ~14 s observation window. The second variant was repeated three times with ~30 s windows to investigate the incomplete run. First usable frame is rVFC with readyState≥2 and video0 visible; first playing is recorded separately. Waiting after playback position>.01 is a post-start stall; duration ends at next playing. An unresolved stall is censored at the last observation and reported as a lower bound. Approximate body bytes are CDP dataReceived summed by request before native completion; for an incomplete run, the table uses 14 s, not a nonexistent handoff. All times below are navigation-relative seconds.

| Policy/run | Usable frame | Playing | Stalls | Total stall s | Longest s | video1 loadeddata | Handoff | video1 readyState | video0 bytes | video1 bytes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| baseline 1 | 1.507 | 1.434 | 5 | 2.064 | 0.659 | 1.359 | 9.623 | 4 | 3662874 | 2033989 |
| baseline 2 | 1.690 | 1.642 | 4 | 1.602 | 0.575 | 1.563 | 9.284 | 4 | 3662874 | 2036989 |
| baseline 3 | 1.685 | 1.629 | 5 | 2.052 | 0.648 | 1.550 | 9.795 | 4 | 3662874 | 2038489 |
| lead15 1 | 1.314 | 1.256 | 6 | 1.621 | 0.497 | 4.413 | 9.007 | 4 | 3662874 | 2032489 |
| lead15 2 | 1.530 | 1.481 | 4 | 1.099 | 0.402 | 4.673 | 8.675 | 4 | 3662874 | 2041489 |
| lead15 3 | 1.353 | 1.301 | 5 | 1.447 | 0.385 | 4.449 | 8.887 | 4 | 3662874 | 2035489 |
| lead25 1 | 1.305 | 1.254 | 1 | 0.160 | 0.160 | 6.110 | 7.452 | 3 | 3662874 | 1144489 |
| lead25 2 | 1.548 | 1.497 | 2 | 0.506 | 0.313 | 6.366 | 8.050 | 3 | 3662874 | 1261489 |
| lead25 3 | 1.488 | 1.429 | 4 | 8.128 ≥ (censored) | 7.239 | 6.339 | — | no handoff | 3662874 | 2032489 |
| lead25-repeat 1 | 1.294 | 1.238 | 3 | 0.532 | 0.278 | 6.163 | 7.848 | 3 | 3662874 | 1331989 |
| lead25-repeat 2 | 1.187 | 1.140 | 4 | 0.702 | 0.282 | 6.202 | 7.950 | 3 | 3662874 | 1081489 |
| lead25-repeat 3 | 1.327 | 1.276 | 1 | 0.157 | 0.157 | 6.153 | 7.461 | 3 | 3662874 | 865489 |

Baseline medians: **5 stalls / 2.052 s**, usable frame **1.685 s**, first playing **1.629 s**, video1 loadeddata **1.550 s**; readyState **4 in all three handoffs**. Retained production behavior is identical to this baseline; no before/after improvement is claimed.

lead15 medians: **5 stalls / 1.447 s**, usable frame **1.353 s**; Hero readyState4 throughout. lead25 initial medians: **2 stalls / .506 s**, usable frame **1.488 s**, but one run never handed off. The repeat medians were **3 stalls / .533 s**, usable frame **1.294 s**, Hero readyState3 in all three repeats. A lower median alone does not pass the specified acceptance gate.

In the failed lead25 run, video0 stalled at mediaTime5.352 s. At ~7.829 s the full [0,6] buffered range was reported and its complete 3,662,874-byte body had been delivered, but readyState remained2 and playback did not resume during observation. No video0 network error was observed. Video1's canceled partial auto-preload is separate and normal browser behavior. This evidence does not establish the cause of the persistent media stall; it cannot safely be dismissed as an instrumentation artifact or hidden by changing frozen controller behavior.

## Final behavior and validation

- **Normal network, restored production behavior:** usable frame .457 s, first playing .407 s, zero stalls; Hero handoff6.423 s, video1 readyState4, target/currentTime0. There is no new fast-network delay because no candidate is retained.
- **Fresh mobile cold 9 Mbps:** usable frame .948 s, playing .895 s, zero stalls; handoff6.911 s, video1 readyState4. Only mobile video0/video1 variants were requested before handoff. No mobile loading changes were retained. This is viewport emulation, not physical-device validation.
- **Manual interruption:** wheel input during native intro produced introState=interrupted immediately; video1 was already eagerly attached. It remained interrupted after the former candidate deadline and video0 did not restart. Because the candidate was rejected, no deferred-preparation path ships. Deterministic candidate checks did pass immediate/idempotent promotion and listener/timer cleanup; its browser interruption-before-promotion check was not accepted or used to approve the candidate.
- **Reduced motion/hash:** initial reduced motion and #hero both yielded skipped intro and immediately attached desktop video1. Existing semantics are unchanged.
- **Source switching:** desktop→mobile and mobile→desktop during native intro preserved the existing temporary source deferral, then settled complete with the latest profile's video1. Post-intro switches in both directions settled with zero remaining source-hold overlays. No startup timer exists in the final source.
- **Existing suites:** test-cinematic-seek.ts, test-cinematic-transitions.ts and test-cinematic-source-switch.ts all passed. This includes forward/reverse targets, stale callbacks, fallback, readiness gates, fixed scroll blend, relevant source replacement, latest-profile wins, intro deferral and cleanup. The temporary candidate coordinator checks also passed before removal.
- **Production browser traversal:** sequential desktop/mobile full forward and reverse wheel traversals completed; no sampled interval had zero visible video layers. Two desktop reverse samples had readyState1 during seek (not proof of a black frame); the retained-frame screenshots show the expected scene. Inspected forward/reverse and profile-switch screenshots show no observed black frames. These samples/screenshots do not prove every individual presented frame. /nosotros and /soluciones reached readyState4 on both profiles. No hydration/runtime exceptions, window errors or production diagnostics were observed.
- An initial concurrent regression/mobile check was invalid: other fresh-target cache clearing/background target activity overlapped it, desktop media remained unready and mobile paused before completion. These raw observations are retained as *concurrent-invalid* evidence. The reported final regression, mobile and normal-network checks were rerun sequentially. All baseline and candidate comparison trials were sequential from the outset.
- **Quality:** production build passed on restored source (30 prerendered pages), using only the process-scoped DATABASE_URL placeholder needed by Prisma generation; no database connection/mutation or .env edit. npx tsc --noEmit passed. Final lint and Graphify refresh are recorded below after removing temporary browser/build artifacts. The first lint attempt included those artifacts and is not the source-code quality result.
- **Final cleanup/quality:** isolated Chrome and production server stopped; temporary scripts, profile and production snapshot removed, detaching the public junction first. npm run lint passed with zero errors and the existing LogoLoop.jsx:244 no-img-element warning. graphify update . completed with AST-only extraction (1,403 nodes / 3,099 edges); its existing missing tree_sitter_sql warning affects two SQL files, unrelated to the scoped cinematic trace. No semantic/API extraction was requested.

## Files

Permanent additions: this report and docs/performance/step4c-evidence/ (summary, compressed raw runs, harness, candidate source and deterministic checks, regression screenshots). Generated graphify-out graph/report artifacts were refreshed. Temporary edits to cinematic-landing.tsx, use-responsive-cinematic-sources.ts and use-cinematic-controller.ts were restored byte-for-byte from their pre-Step4C snapshots. The temporary helper and test were removed from application/scripts. No media, configuration, env or frozen cinematic module change was retained.
