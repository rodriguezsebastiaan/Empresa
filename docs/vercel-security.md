# Vercel security baseline

This project keeps its existing in-memory limiter as a best-effort fallback only. It resets on cold starts, is not shared between instances, and its forwarded-IP identity depends on the trusted hosting proxy. It is not a reliable production rate limit. Production must use a distributed control at the edge; activation cannot be established from this repository.

## Required Vercel WAF rate limiting

Configure these rules in Vercel Dashboard > Project > Firewall > Custom Rules. Match the exact path and method below; group by the platform-observed client IP and return 429 for JSON APIs. Configure the available windows/thresholds for the account's plan, then tune with traffic logs. HTML challenges on fetch endpoints can break the form response flow. See [Vercel rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

| Path | Method | Suggested limit | Window | Purpose |
| --- | --- | ---: | ---: | --- |
| `/admin/api/session/login` | `POST` | 5 requests | 10 min | Protect admin login brute force. |
| `/api/contact` | `POST` | 5 requests | 10 min | Protect the short contact form. |
| `/api/diagnostico` | `POST` | 4 requests | 15 min | Protect diagnostic submissions. |
| `/api/advisory-bookings` | `POST` | 6 requests | 30 min | Protect booking creation and duplicate attempts. |
| `/api/availability` | `GET` | 40 requests | 5 min | Protect availability lookups. |
| `/api/availability/settings` | `GET` | 40 requests | 5 min | Protect public availability metadata. |

If the Vercel plan limits the number of WAF rules, prioritize:

1. `/admin/api/session/login`
2. `/api/advisory-bookings`
3. `/api/diagnostico`
4. `/api/contact`
5. `/api/availability*`

Do not remove the in-memory limiter until the WAF rules are active and verified in production logs.

If Cloudflare already proxies this domain instead, apply equivalent path/method matches in its [rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/), counting by IP, subject to plan-supported periods. Example match: `(http.request.method eq "POST" and http.request.uri.path eq "/api/contact")`. Restrict access to the origin to prevent bypass; do not add a Cloudflare service or account as part of this baseline. Start with the table's policy targets, not a claim that every plan supports those exact windows.

## Sensitive Vercel environment variables

Configure these only as server-side/sensitive environment variables. Do not use the `NEXT_PUBLIC_` prefix for any of them.

| Variable | Scope |
| --- | --- |
| `DATABASE_URL` | Production server only. |
| `AUTH_SECRET` | Production server only. |
| `SMTP_PASSWORD` | Production server only. |
| `RESEND_API_KEY` | Production server only. |
| `GOOGLE_PRIVATE_KEY` | Production server only. |
| `GOOGLE_CLIENT_SECRET` | Production server only. |
| `GOOGLE_REFRESH_TOKEN` | Production server only, only if OAuth flow is reintroduced. |
| `N8N_DIAGNOSTIC_WEBHOOK_SECRET` | Production server only. |

Preview deployments should not point to the production database unless explicitly approved.

## CSP and headers

Security headers are applied in `next.config.mjs`.

- `default-src 'self'`
- `script-src 'self' 'unsafe-inline'` plus Vercel Analytics scripts
- `frame-ancestors 'none'`
- `object-src 'none'`
- `form-action 'self'`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000` only in production, host-only (browsers honor it on HTTPS); no subdomain or preload commitment
- `X-Powered-By` disabled
- Production connections exclude development WebSockets and server-only Google API origins

Inline script/style allowance remains for static Next.js hydration and existing inline styles. A nonce-based policy requires a separate rendering/performance review.

Future frontend integrations that require third-party scripts, frames, images, or connections must be added explicitly to CSP after review.
