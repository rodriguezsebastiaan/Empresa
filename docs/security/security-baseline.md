# ConexaCod security baseline

Resumed on 2026-09-30. Focused hardening of the current working tree using the installed `cloudflare/security-audit-skill`; not a comprehensive audit or a deployment attestation. Prior safe changes and cinematic/performance work were preserved.

## Existing controls retained

- Centralized headers, development-only cinematic diagnostics, escaped email HTML and safe external-link `rel` attributes.
- Server form validation, honeypots, recent-contact/diagnostic duplicate checks, unique booking request/slot keys and email-delivery idempotency.
- Admin role permissions on exports and mutations, hashed session tokens, account lockout and cookies with HttpOnly, SameSite=Lax and Secure in production. The admin panel is a shared authorized resource, not a multi-tenant API.

## Changes implemented

- `next.config.mjs`: disable X-Powered-By; remove production WebSockets, Google OAuth/Calendar and unused Vitals connections from CSP; retain the existing central nosniff, referrer, permission and clickjacking controls. Host-only HSTS replaces unverified includeSubDomains/preload.
- `lib/request-body.ts`: bound JSON reads to 64 KiB while streaming, cancel oversized bodies (413), require JSON objects and reject invalid UTF-8/JSON. Reusable bounded reader also protects the public admin login.
- `lib/validation.ts`: reject unexpected fields and wrong field types; limit a single bare email to the database's 191-character bound and local part to 64; reject recipient lists, comments and quoted mailbox syntax. Validate actual calendar dates, 24-hour times, bounded request IDs/timezone/modality, and diagnostic choice allowlists. Existing text limits and honeypots remain.
- `app/api/contact/route.ts`, `app/api/diagnostico/route.ts`, `app/api/availability/settings/route.ts`: generic caught failures instead of uncaught provider/database exceptions.
- `lib/advisory-booking-service.ts`: reject request-ID reuse with a different normalized email; use server availability settings for modality/timezone before creating calendar events and bookings. A request ID is still an idempotency capability, not account authentication.
- `lib/admin-auth.ts`: require Origin or Referer from the configured site origin (plus restricted loopback hosts for local verification) for cookie mutations; account for Next's internal localhost URL without trusting arbitrary forwarded hosts. Normalize and constrain redirects to `/admin` or descendants, rejecting traversal/backslashes and unrelated prefixes. Preview admin deployments must configure the existing NEXT_PUBLIC_SITE_URL to their intended origin.
- `app/admin/api/session/login/route.ts`: bound urlencoded input to 8 KiB; reject unsupported formats, duplicate/unexpected fields, and excessive credential lengths before password verification.
- `config/site.ts`: configured external links accept only HTTP(S) URLs.
- `package.json`, `package-lock.json`, `pnpm-lock.yaml`: Next.js/eslint-config-next 16.3.1 → 16.3.6; Nodemailer 9.0.3 → 9.1.1; fast-uri override 3.1.6 → 3.1.8; carry the existing MariaDB security override into npm. Both lockfiles synchronized; pnpm lockfile retains project overrides using declared pnpm 9.15.9.
- `scripts/test-security-baseline.ts`: local regression coverage for valid forms, malformed payloads, mailbox syntax, streaming cancellation, admin origin and redirects.
- `docs/vercel-security.md`: clarified limitations and actionable edge configuration. Graphify code outputs refreshed.

## CSP and destination inventory

Production uses default-src/self, base-uri/self, object-src/none, frame-ancestors/none and form-action/self. Scripts allow self, inline Next hydration and the existing Vercel Analytics origin; styles allow self and existing inline styles. Fonts use self/data; images and media use self/data/blob. Browser connections allow self and the existing Analytics origin. No production unsafe-eval or arbitrary WebSocket origins. All cinematic MP4s, logos and application assets are same-origin; fonts are system fonts. No embedded frames or external form actions.

Google Calendar/OAuth, SMTP, Resend and the configured diagnostic webhook are server integrations, not browser CSP destinations. The installed Analytics SDK uses `/_vercel/insights/script.js` in production. Retained unsafe-inline is a hardening opportunity; introducing nonces would change static rendering and needs a separate performance review.

## Abuse and infrastructure still pending

The existing process-memory limiter was retained, not presented as distributed protection. Honeypots, strict bounded input, duplicate checks and booking/email idempotency reduce low-cost abuse but do not stop distributed spam or credential guessing. Enable and verify edge limits for login, contact, diagnostic, booking and availability; exact path/method/IP policy targets and provider documentation are in [vercel-security.md](../vercel-security.md). No Redis, CAPTCHA, paid product or invented configuration was added. Confirm HTTPS and any subdomain TLS coverage before extending HSTS.

## Secrets and applicable boundaries

Only `.env.example` is Git-tracked; `.env` variants, keys, credentials, dumps and local outputs remain ignored. The source/config scan found no credential-pattern matches. No local secret-bearing env files were available for value comparison; browser bundles were also scanned for patterns. Public variables are site/social configuration; reviewed client imports do not reach database, SMTP, OAuth or webhook secrets. No secret values are included here.

No user HTML injection/dangerouslySetInnerHTML, uploads, user-supplied server fetch URLs or Server Actions were found in the reviewed application paths. Server external destinations are configuration-controlled. Authentication and cookie mutations do exist and were checked; no global CORS was added. Cinematic diagnostics remain guarded by non-production checks without changing timing, videos, scheduler, preload or transitions.

## Dependencies

Next.js patch resolves the audited framework advisories ([Windows server advisory](https://github.com/advisories/GHSA-p293-qw3h-jr36)); images remain unoptimized and no next/og endpoint exists. Final pnpm production audit reports 5 remaining Nodemailer advisories (2 high, 3 moderate), no critical findings. They require Nodemailer 10.x, outside the authorized patch/minor scope. Public email inputs now exclude parser comment/list/quoted forms and are bounded; SMTP uses one configured transport identity. These constraints reduce exposure and are not a claim that the advisories are fixed.

npm's production-filtered audit additionally includes Prisma CLI/dev peers (`@prisma/dev`, find-my-way, valibot) reachable through package dependency metadata; those development servers/parsers are not imported by public route code. Full npm audit reports 13 affected package entries (8 high, 5 moderate, zero critical), including tooling chains through Prisma/shadcn/linters (Hono, MCP SDK, brace-expansion, ip-address, js-yaml, qs, undici). These counts are package entries, not confirmed exploitable application findings. Keep a separate dependency-maintenance follow-up; do not run an indiscriminate major audit fix.

## Verification and limits

- TypeScript and security regression tests passed. Application lint passes with one pre-existing LogoLoop.jsx warning using `eslint . --ignore-pattern '.tmp-*/**' --ignore-pattern '.tmp-*.mjs'`. Unfiltered lint also encounters 29 errors in a concurrently generated, ignored Step 4B Chrome profile; that unrelated profile was not changed or deleted.
- Final official `npm run build` passed, including Prisma generation, with a dummy local database URL and all real integration variables masked. No migration, seed, real email, calendar action or database write was performed.
- Local production HTTP: all seven requested pages return 200; security headers present, X-Powered-By absent, production CSP excludes unsafe-eval and Google/WebSocket connections. Public form handlers reject malformed JSON/non-object, unsupported content types, unexpected fields and oversized bodies with 400/415/422/413. Login rejects oversized/wrong-format/duplicate-field inputs with 413/415/400. Valid booking data reaches the safe 503 response without a configured DB. Anonymous exports redirect to login; cross-origin logout returns 403.
- Browser: all seven pages opened; form rendering and client validation retained. Contact submission reaches the intended handler and displays safe unconfigured/rate-limit feedback. Advisory renders and rejects an empty submission; successful slot selection was not verified without a DB. Date interaction in this browser test did not trigger a slot lookup; availability/settings safe 502 responses were verified directly over HTTP. Cinematic Inicio and Contacto media decode to readyState=4, Contacto images load, and no CSP blocking logs were observed. No production cinematic overlay appears.
- Provider-backed success paths, real booking persistence, authenticated role fixtures, Analytics delivery and deployed headers/WAF require a configured non-production environment or owner-side verification. Local Analytics service availability is separate from CSP compatibility.
- Graphify update is AST-only; two SQL migration files are not parsed because tree_sitter_sql is absent, and community labels may need refresh. No semantic remap or API expense was introduced.
