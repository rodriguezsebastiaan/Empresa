# Final unused-files cleanup

Date: 2026-10-01

## Initial repository state and scope

The initial Git snapshot contained 75 modified tracked files, 6 already-deleted tracked files and 232 untracked files. The working tree therefore contained substantial pre-existing user work. No pre-existing changes were reverted, overwritten or included in this cleanup. Git required a command-scoped `safe.directory` setting because the checkout owner SID differs from the current process; no global Git setting was changed.

The audit covered App Router routes and special metadata files, shared components, imports and path-based references, configuration, scripts and package scripts, dependencies, CSS usage, public/static assets, media, environment-file names, temporary-output names, release/security/performance documentation, Graphify output and generated directories. Local Next.js 16.3.6 guides for file conventions, public assets and metadata were consulted before treating any route or asset as removable.

## Graphify

`graphify query` and the required post-change `graphify update .` could not run because the CLI is not installed. The configured Graphify Python path also lacks the `graphify` module. The existing `graphify-out/graph.json` contains 1,403 nodes and 3,099 links; its source-file relationships were traversed with a local adjacency fallback. It showed no external callers of the four retired components. Text searches across routes, components, libraries, configuration, scripts and docs corroborated that result. Graphify outputs were left untouched.

## Files removed

Four tracked, otherwise-clean components had no import, dynamic-import, route, test, configuration, documentation or path-based use outside their own definitions. The active routes use their newer replacements:

- `components/benefits.tsx` — replaced by `components/home-benefits.tsx`.
- `components/cta.tsx` — replaced by `components/home-cta.tsx`.
- `components/solutions.tsx` — replaced by `components/home-solutions.tsx`.
- `components/site-footer.tsx` — replaced by `components/site-footer-main.tsx`, used by `components/site-shell.tsx`.

Five tracked, otherwise-clean public files named as generic placeholders had no reference in application source, metadata, config, scripts or documentation. None is a Next.js special metadata filename:

- `public/placeholder-logo.png`
- `public/placeholder-logo.svg`
- `public/placeholder-user.jpg`
- `public/placeholder.jpg`
- `public/placeholder.svg`

These nine files totaled 25,950 bytes (about 25.3 KiB). No source file was edited and no package or lockfile was changed by this cleanup.

## Dead code, dependencies, assets and files retained

- Four unused component modules and their exports were removed with those files. No other exports or helpers were removed.
- No dependencies were removed or upgraded. Packages without direct application imports were retained where they serve React/Next.js, type, ESLint, CLI or transitive tooling requirements. The pre-existing changes to `package.json`, `package-lock.json` and `pnpm-lock.yaml` were preserved.
- No CSS, route, SEO, security, analytics, validation, rate-limit, database, media or source behavior was changed. The `Reveal` helper and its CSS remain actively used.
- Exact duplicate hashes exist between the seven `assets/videos/Video*.mp4` files and their `public/videos/cinematic/Video*.mp4` copies. Both sets were retained because they are cinematic masters/source copies and release evidence explicitly says to preserve the originals. Optimized H.264 desktop/mobile files were retained.
- Eight `assets/images/*.png` files and `public/hero-monument.png` had no literal runtime path reference. They were retained because their source/archive role and potential public-URL consumers are ambiguous.
- Performance and release/security/SEO evidence, compressed profiling/network harnesses under `docs/performance`, database backup schemas/migrations and all scripts were retained. The harnesses are referenced by performance reports; package scripts and reports reference the maintained test/operational scripts.
- The ignored `.next`, `node_modules`, `.pnpm-store`, `.local` and TypeScript build-cache paths were treated as generated/local state and left in place. `.local/tsx-runner` was empty. The scan found no loose `.tmp`, `.temp`, `.bak`, `.old`, `.orig` or log files, or browser profiles. The only reparse point found was a generated link inside `.next`; none was found in source/config directories. The three filename matches for profiling/harness scripts are compressed performance evidence.
- The only root `.env*` file found was `.env.example`; no credential file was found. Existing `.gitignore` rules cover environment files, local/build output, temporary profiles, logs and credential extensions.

## Validation

- `node --import tsx scripts/test-cinematic-seek.ts` — PASS.
- `node --import tsx scripts/test-cinematic-transitions.ts` — PASS.
- `node --import tsx scripts/test-cinematic-source-switch.ts` — PASS.
- `node --import tsx scripts/test-security-baseline.ts` — PASS.
- `npm run lint` — PASS, 0 errors and one existing `<img>` warning at `components/LogoLoop.jsx:244`.
- `npx --no-install tsc --noEmit` — PASS on the final run. An earlier incremental run reported `PortfolioProject.seo` errors; `npx --no-install tsc --noEmit --incremental false` passed, and the subsequent production build completed its TypeScript check. This points to stale incremental state during the first run; no source fix was made.
- `npm run build` — PASS. Prisma Client generation and all 30 static pages completed. `DATABASE_URL` was a process-scoped loopback placeholder; no `.env` file was created, and no database was contacted or mutated.
- Production smoke on local `next start` — PASS for `/`, `/nosotros`, `/soluciones`, `/servicios`, `/proceso`, `/contacto`, `/agendar-asesoria` and `/proyectos/pr-box`. Headings/titles rendered, the header link to Nosotros and browser Back/Forward worked, local fonts reported loaded, visible logo/project images loaded, and the console had no warnings or errors. The tested desktop viewport showed no horizontal overflow. The home intro video0 played and video1 was ready; the hero image and both video URLs returned HTTP 200. No forms were submitted.
- No separate SEO validation script exists in `scripts/` or `package.json`; route metadata and sitemap/robots/manifest conventions were included in the successful build and smoke review.
- The browser smoke was a local desktop production check, not physical-device certification.

## Final Git review

The nine cleanup targets are the only files deleted by this task. Six other tracked deletions were already present in the initial snapshot and were preserved. No unrelated user changes were removed.

Additional edits appeared in the shared working tree during this run and were preserved. Before writing this report, the snapshot showed 78 modified tracked files, 15 tracked deletions and 241 untracked files; the 15 deletions include the 6 initial deletions plus these 9 cleanup deletions. The report itself adds one untracked file. The final status is intentionally not clean because pre-existing and concurrent work remains.

**Estimated cleanup:** 9 files / 25,950 bytes removed. No dependencies removed; no source modules modified.
