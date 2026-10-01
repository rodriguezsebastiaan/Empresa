# Step 5B — Functional and visual QA

Date: 2026-10-01

## Environment and scope

QA ran against a fresh Next.js production build with `next start`, using a process-scoped placeholder `DATABASE_URL` for Prisma generation only. No `.env` file was created and no database was contacted or mutated. Browser testing used clean local production tabs at 1440×900, 1024×768 and 390×844. Resized browser results are not physical-device certification.

## Routes and layout

Inicio, Nosotros, Soluciones, Servicios, Proceso, Contacto, Agendar asesoría and all five implemented project routes loaded successfully. The project slugs are `citas-ya`, `serpleno`, `pr-box`, `estilo-emporium` and `efectuar-sas`. All principal routes were inspected at each target viewport; project routes were checked at desktop and mobile. The nonexistent route and nonexistent project slug returned 404 without a stack trace.

No horizontal overflow or broken images appeared at the tested sizes. There is one H1 per inspected route. The shared header, logo, desktop navigation, mobile menu, scheduling CTA and footer links render. The mobile menu opens, closes on navigation and exposes its CTA. Public copy contained no old Konamy, Vercel or v0 branding. External project/footer links inspected in the code include safe `rel` behavior when opening a new tab.

The LogoLoop displays all five project names/logos, has no public pause control, and its CTA navigates to `/nosotros#proyectos`. The About portfolio anchor lands below the sticky header and survives refresh and Back/Forward. Cards are two equal-width columns on desktop and one column on mobile; order is Citas Ya, SERPLENO, PR BOX, Estilo Emporium, Efectuar SAS. All detail links resolve and all five detail pages render their project heading and images.

## Cinematic behavior

The fresh Inicio load starts the native intro, reaches `complete`, and reveals the Hero. A real wheel interruption during the intro changes its state to `interrupted`. Slow forward traversal crossed at least five scene boundaries; reverse traversal changed video time in the reverse direction. A fast traversal reached the final scene. Crossfade stops retained the blended layers, then the displayed video times remained stable after scrolling stopped. No zero-visible-video sample, black/transparent gap, source-hold element or diagnostic UI was observed. The intro did not restart after interruption/completion.

The Home page served H.264 desktop variants at desktop and mobile variants at 390 px. Crossing the 767 px breakpoint in both directions during a scene and near a scene boundary switched the relevant sources to the matching H.264 profile, kept the visible frame ready, and left no hold element. Internal pages map scroll to their assigned single-video H.264 source; forward and reverse scroll changed the video time in the corresponding direction at desktop and mobile. All sampled internal videos reached ready state 4, and their content stayed readable without horizontal overflow.

## Forms and navigation

Contacto’s empty submit displays a summary and inline field messages. Each error is associated with its control via `aria-describedby`. An invalid `type=email` value is rejected by native constraint validation and keeps focus on the email field. Both cases remain on the form; no contact submission was sent. Required-field `maxLength` bounds are present on the relevant controls.

Agendar asesoría renders at mobile without overflow, exposes labeled fields and date bounds, and reports that a date is required before checking available times. Empty submission displays inline errors for the required fields and does not confirm an appointment. No real contact, email, or booking side effect was triggered. Availability for a chosen date and successful server-side booking were not exercised because the safe test environment has no configured appointment backend.

The primary mobile navigation, portfolio CTA, project anchor, direct detail-route refresh, browser Back and Forward were checked. The native reduced-motion branches were reviewed in the cinematic controllers, but this browser session did not override the operating system’s `prefers-reduced-motion` setting; physical-device/accessibility preference confirmation remains appropriate in Step 5C.

## Accessibility and security smoke checks

Keyboard traversal reaches the skip link, brand link, mobile menu, CTAs and page actions with visible focus styling. Major pages have a main landmark and a single H1. Form controls have labels, status regions use `aria-live`, and decorative cinematic video layers are `aria-hidden`, removed from tab order and have no controls. Images inspected had alt attributes. No clear accessibility regression was found.

The production response includes CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`, COOP and CORP. CSP allows same-origin videos, images, fonts and scripts plus the configured Vercel Analytics origin. H.264 desktop/mobile MP4s returned HTTP 200 with `video/mp4`; the page videos reached ready state 4. The fresh browser console had no errors or warnings. No VP9 or old unoptimized video source appeared in the runtime markup. The removed VP9 public URL now returns 404.

## VP9 evidence decision

The runtime has no references to the four experimental VP9 files. Step 2 records their encoding settings, quality measurements, seek results and full-decode checks, and explicitly says not to promote VP9. To preserve reproducibility while removing them from production serving, the files were moved from `public/videos/cinematic/optimized/experimental/` to `docs/performance/step2-evidence/vp9/`. Only those four paths in the Step 2 report were updated; the findings were not changed.

## Defects, changes and validation

No confirmed application defect was found; no production source fix was necessary. Files changed for Step 5B:

- `docs/performance/cinematic-media-step2.md` — updated VP9 evidence paths and documented that they are not served by the app.
- `docs/performance/step2-evidence/vp9/` — retained the four reproducibility assets outside `public/`.
- `docs/release/step5b-functional-qa.md` — this report.

Final checks passed: cinematic seek, transitions and source-switch suites; security baseline test; `npm run lint` (0 errors, 1 existing `LogoLoop.jsx:244` `no-img-element` warning); `npx tsc --noEmit`; and `npm run build` (30 generated static pages). The build and smoke check used no database connection.

Minor follow-ups: the existing LogoLoop `<img>` lint warning; validate reduced-motion behavior with the device preference enabled; and check real availability/booking integration only in its approved safe test environment. No major visual, navigation, form-validation, security or cinematic regression blocks physical-device checks.

## Step 5C release gate

**GO for Step 5C physical-device validation.** Desktop/tablet/mobile-emulated QA is clean. Step 5C should cover physical Android/iPhone media playback, responsive source changes, native intro behavior, reduced-motion preference, and touch/viewport differences.
