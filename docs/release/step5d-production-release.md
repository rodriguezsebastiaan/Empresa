# Step 5D — Production release validation

Date: 2026-10-01, America/Bogota. Network evidence collected around 16:53 local / 21:53 UTC.

**Final release status: NO-GO.** A confirmed public DNS availability defect prevents access to `https://conexacod.com`. Local gates pass, but Step 5D cannot be closed as production-validated. No application defect was reproduced, and no application source fix was made.

## Source / release snapshot

- Workspace: `C:\Users\juanm\OneDrive\Escritorio\Paginas Web\Empresa-main`.
- Branch: `main`; HEAD: `c32b34203ae553ccd604383d24b8ba8422c0ef7f`.
- Validation targets the existing dirty working tree, not HEAD alone. Before adding this report, status contained 75 modified tracked files, six deleted tracked files and 29 untracked entries (some are directories). All pre-existing work was preserved.
- Installed and declared Next.js: `16.3.6`. Package manager declaration: `pnpm@9.15.9`; both npm and pnpm lockfiles exist. No installation or dependency change occurred.
- `package-lock.json` SHA-256: `d8e20ad33c0b343e0d22321a3250f52e609b0339288d2b33ce9c0703fe76dfa1`.
- `pnpm-lock.yaml` SHA-256: `1991c1651491f0e9c763967de9793e0501e683614560f9e750408871cf380b0a`.
- Source inventory fingerprint: `511da6db77e96d09787e64d1a870a8da96f23da65ae5c753e2ea2acb611f1e5d`, across 169 files. Method: sorted, deduplicated `git ls-files --cached --others --exclude-standard -z`; exclude `.codex/`, `.impeccable/`, `graphify-out/`, `docs/`, `assets/`, `public/`, `.env*` and `tsconfig.tsbuildinfo`; hash each existing file's bytes, mark missing paths `DELETED`, then SHA-256 the JSON array of path/hash pairs. This identifies the inspected source/configuration, not a complete media or deployment fingerprint.
- A command-scoped Git `safe.directory` override handled workspace ownership. Global Git settings were not changed.
- No deployed build ID, deployment commit or source/deployment equivalence could be established. The connected Vercel account returned no projects in its available team; this does not prove the deployment is absent elsewhere. No local Vercel deployment configuration was found in the inspected file inventory.

## Step 5C physical-device record

The user reports completing physical Android validation manually on the real phone using port forwarding, with correct behavior and no observed blocking issue. This is accepted as sufficient to proceed to Step 5D. Codex did not personally perform that physical-device validation. Device model and OS/browser versions were not supplied.

This user update supersedes the earlier unavailable-device status in `step5c-physical-device-validation.md` for this release decision. Physical iOS Safari remains an optional manual compatibility follow-up and is not the reason for NO-GO.

## Local final gate

| Check | Invocation | Result |
| --- | --- | --- |
| Cinematic seek | `node --import tsx scripts/test-cinematic-seek.ts` | PASS |
| Cinematic transitions | `node --import tsx scripts/test-cinematic-transitions.ts` | PASS |
| Cinematic source switch | `node --import tsx scripts/test-cinematic-source-switch.ts` | PASS |
| Security baseline | `node --import tsx scripts/test-security-baseline.ts` | PASS |
| Lint | `npm run lint` | PASS; zero errors, one existing `@next/next/no-img-element` warning at `components/LogoLoop.jsx:244` |
| TypeScript | `npx --no-install tsc --noEmit` | PASS |
| Production build | `npm run build` | PASS; Prisma client generated, 30 static pages generated |

The build used only a process-scoped, non-production placeholder `DATABASE_URL` pointing to loopback for Prisma generation. No `.env` file was created or modified; no database migration, seed, connection test or persistent data mutation was run. Local build output is not evidence of real production availability or integration configuration.

Focused cinematic source inspection found production guards around diagnostics/counters and no `console.log`, `console.debug`, `performance.mark` or `performance.measure` instrumentation in that runtime. Development diagnostics remain intentionally guarded. No new temporary profiling/debug changes were introduced.

## Confirmed blocker: public DNS

**Severity: blocker.** Both required hosts fail before HTTP or TLS negotiation.

| Evidence | Observed result |
| --- | --- |
| Real in-app browser, `https://conexacod.com/` | `net::ERR_NAME_NOT_RESOLVED` |
| `curl.exe -I https://conexacod.com` | Exit 6, could not resolve host |
| `curl.exe -I http://conexacod.com` | Exit 6, could not resolve host |
| `curl.exe -I https://www.conexacod.com` | Exit 6, could not resolve host |
| Google public DNS, apex A | DNS status 0 / NOERROR, no Answer; authority SOA only (NODATA) |
| Google public DNS, apex AAAA | DNS status 0 / NOERROR, no Answer; authority SOA only (NODATA) |
| Google public DNS, www A | DNS status 3 / NXDOMAIN |
| Cloudflare public DNS, apex A | DNS status 0 / NOERROR, no Answer; authority SOA only (NODATA) |
| Network control, `https://example.com` | HTTP 200 outside the restricted network sandbox |

Public DNS response authority: `clay.ns.cloudflare.com. dns.cloudflare.com. 2415849544 10000 2400 604800 1800`.

Reproduction sources: [Google apex A](https://dns.google/resolve?name=conexacod.com&type=A), [Google apex AAAA](https://dns.google/resolve?name=conexacod.com&type=AAAA), [Google www A](https://dns.google/resolve?name=www.conexacod.com&type=A), and [Cloudflare apex A](https://cloudflare-dns.com/dns-query?name=conexacod.com&type=A) with `Accept: application/dns-json`.

Initial sandbox networking also blocked the external control host. The successful external control and public resolver results were obtained after running the read-only network checks outside that restriction. Thus the public DNS result is not inferred solely from sandbox failure. These observations establish the defect at validation time, not its historical cause.

The canonical host intended by source configuration is `https://conexacod.com`. Actual canonical redirects, HTTP-to-HTTPS and www behavior are unverified. No DNS changes were made: the correct deployment target was not available, and guessing its IP/CNAME would risk replacing the intended infrastructure. The domain/deployment owner must identify that target, restore its prescribed DNS records and configure the intended www redirect.

## Production coverage and blocked checks

The following checks remain **BLOCKED BY DNS**, not passed. No alternate preview domain or localhost was substituted for the requested production deployment.

| Area | Production result / scope |
| --- | --- |
| HTTPS / TLS / transport | No TLS session; certificate issuer, SAN hostname coverage, validity, TLS protocol and browser certificate warnings cannot be inspected. No successful redirect chain or loop assessment. |
| Security headers | No HTTP response available; CSP, nosniff, Referrer-Policy, Permissions-Policy, clickjacking protection, HSTS, COOP/CORP, X-Powered-By and CORS cannot be compared against production. |
| CSP runtime | No application document loaded; legitimate Next runtime, media, images, fonts, analytics and form resource allowance are unverified. No application CSP violation was observable. |
| Routes / refresh / navigation | All listed routes below, direct refresh, client navigation, ordinary nonexistent route and nonexistent project slug remain unverified. There are no production HTTP status codes to report. |
| Cinematic smoke | Fresh intro, Hero handoff, forward/reverse scroll, black-frame/gap checks and production diagnostics cannot be observed. |
| Initial network inventory | Selected-profile video0/video1 requests, later-source deferral, desktop/mobile separation and absence of old/VP9 requests remain unverified. |
| Assets / caching | Actual Cache-Control for Next static chunks, MP4s, logos/images, immutable fingerprints and non-fingerprinted media is unavailable. No cache policy was changed. |
| SEO / branding | Rendered titles, descriptions, canonicals, OG image resolution, favicon, logos, robots.txt, sitemap.xml and public old-brand absence remain unverified. |
| Environment boundary | Production `.env`/internal-file exposure and browser-bundle secret leakage could not be tested; deployment environment presence is unknown. |
| Contacto | Page, empty/invalid validation, request behavior and production error sanitization unverified. No real message sent. |
| Agendar asesoría | Page, validation, date controls and safe availability lookup unverified. No appointment created. Unknown whether backend is configured or intentionally pending. |
| Console / runtime / network | Observed browser navigation DNS failure. No app session existed to evaluate hydration, JS errors, failed app requests or extension noise. |
| Performance | FCP/LCP and deployment-only startup regression cannot be observed. No repeat of Steps 4A–4C profiling. |
| Accessibility | Keyboard header/links/forms, visible focus, skip link, H1/main and error associations cannot be checked on production. |
| External services / domain consistency | Enabled production services, analytics success, rendered project/social links and localhost/preview/old-domain leakage remain unknown. |

Requested route inventory, each blocked before production HTTP validation:

- `/`
- `/nosotros`
- `/soluciones`
- `/servicios`
- `/proceso`
- `/contacto`
- `/agendar-asesoria`
- `/proyectos/citas-ya`
- `/proyectos/serpleno`
- `/proyectos/pr-box`
- `/proyectos/estilo-emporium`
- `/proyectos/efectuar-sas`

The local build includes those principal pages and all five statically generated project pages, plus robots and sitemap routes. That is local build evidence only; unavailable production paths were not individually navigated after establishing the host-wide DNS blocker.

## Source configuration observations (not production certification)

`next.config.mjs` defines a global CSP with self-hosted media/images/fonts; Vercel analytics origin `https://va.vercel-scripts.com` is allowed in script/connect directives. Production omits `unsafe-eval` and development websocket allowances. Inline script/style allowance is the existing baseline; no weakening occurred. It defines `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, disabled camera/microphone/geolocation, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, COOP/CORP `same-origin`, and production HSTS `max-age=31536000` without includeSubDomains/preload. `poweredByHeader` is false. No wildcard CORS header is introduced by this configuration. Actual edge/proxy behavior remains unknown.

Scene configuration references optimized desktop/mobile H.264 assets for video0–video6. It does not select experimental VP9 or old master files. This does not prove which files the deployment requests.

Source metadata uses the ConexaCod configuration, SVG favicon, manifest and OG/Twitter image references. The configured fallback domain is `https://conexacod.com`; `NEXT_PUBLIC_SITE_URL` can override it. Robots excludes `/admin/` and `/api/`; sitemap draws from public configured pages and published enabled project detail pages, not admin/test paths. A deployment URL override must therefore be verified when production becomes reachable. External portfolio source links are to prboxcf.com, serplenoo.com, estiloemporium10.com, citasyaa.com.co and efectuar-sas.vercel.app; the last is an intentional portfolio destination, not evidence of a leaked ConexaCod preview host.

The source's public environment references are `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_INSTAGRAM_URL` and `NEXT_PUBLIC_WHATSAPP_NUMBER`. No server credential with a `NEXT_PUBLIC_` prefix was found in this scoped inspection. Integration variables include `DATABASE_URL`, `AUTH_SECRET`, SMTP variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` / `SMTP_PASS`, `SMTP_FROM_EMAIL`, `SMTP_SECURE`), contact/notification destination names, Resend variables (`RESEND_API_KEY`, sender/reply-to names and `RESEND_MODE`), Google Calendar credentials/mode variables, MySQL TLS variables and diagnostic webhook variables. No values were printed or set in production. No missing production variable is asserted without deployment evidence.

Local security tests verify malformed/empty structures, email validation, bounded body handling, administrative origin checks and redirect constraints. Contact route source catches service failures with a generic public message. These do not certify production form delivery or backend readiness.

## Defects, changes and remaining work

| Priority | Finding | Resolution |
| --- | --- | --- |
| Blocker | Apex has no public A/AAAA answer; www A is NXDOMAIN; production inaccessible | Unresolved; requires correct deployment/domain configuration and renewed live checks |
| Low, known | Existing LogoLoop img lint warning | Accepted minor follow-up; no release-only source change justified |
| Informational | iOS Safari physical compatibility not tested | Optional post-release/manual check |
| Informational | Earlier Step 5C report reflects device unavailable at that time | User's later manual Android success recorded above |

Files modified by Step 5D: only `docs/release/step5d-production-release.md`. Ignored build/Prisma/type-check outputs were generated. No application source, media, dependency, environment file, DNS/TLS setting or production record was changed. Graphify tracing/update was unnecessary because the confirmed defect is DNS and no application code was modified.

To close Step 5D: restore DNS against the verified intended hosting target; establish deployed build/commit identity; rerun every blocked production check above, including all routes and form validation without real submissions. Fix only reproduced production defects and, if source changes, rerun affected suites, lint, TypeScript and build, then verify the corrected deployment. Successful local gates do not remove the DNS blocker.

**Final gate: NO-GO — confirmed production DNS/reachability defect; Step 5D remains open.**
