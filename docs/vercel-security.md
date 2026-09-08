# Vercel security baseline

This project keeps local in-memory rate limiting as an application fallback, but production on Vercel must use a distributed control at the edge.

## Required Vercel WAF rate limiting

Configure these rules in Vercel Dashboard > Project > Security > WAF / Firewall. Use IP address as the primary key. Keep action as block or challenge according to the plan available in the account.

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
- `Strict-Transport-Security` only in production

Future frontend integrations that require third-party scripts, frames, images, or connections must be added explicitly to CSP after review.
