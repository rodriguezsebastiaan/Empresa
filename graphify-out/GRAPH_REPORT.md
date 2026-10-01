# Graph Report - Empresa-main  (2026-10-01)

## Corpus Check
- 190 files · ~953,320 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1403 nodes · 3099 edges · 79 communities (68 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Cinematic Step 4B — controller and network validation
- isAdminActionOriginValid
- validation.ts
- availability-service.ts
- calendar-adapter.ts
- db.ts
- contact-service.ts
- cn
- site-shell.tsx
- config/site.ts
- availability-date-planner.tsx
- app/page.tsx
- package.json
- form-delivery.ts
- resend-adapter.ts
- lib/site.ts
- components.json
- scripts
- compilerOptions
- parseAdminListFilters
- What You Must Do When Invoked
- dependencies
- devDependencies
- test-cinematic-source-switch.ts
- LogoLoop.jsx
- Design System: Conexacod
- [bookingId]/page.tsx
- Product
- overrides
- admin-auth.ts
- use-responsive-cinematic-sources.ts
- next.config.mjs
- Cinematic Step 3C — preparation, frame readiness and layer work
- run-ts.mjs
- [contactId]/page.tsx
- contactos/page.tsx
- postcss.config.mjs
- eslint.config.mjs
- next-env.d.ts
- Conexacod · Producción 1.0
- use-cinematic-controller.ts
- admin-data.ts
- siteConfig
- graphify reference: extra exports and benchmark
- advisory-booking-service.ts
- Cinematic media integration — Step 3A
- AdvisoryBookingForm
- graphify reference: query, path, explain
- ConexaCod security baseline
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- extraction-spec.md
- email-templates.ts
- Cinematic media optimization — Step 2
- Cinematic Step 4C — desktop startup buffering
- test-cinematic-transitions.ts
- Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual.
- email-delivery.ts
- Cinematic Step 3B — measured seek scheduler
- Surface Contract: `/nosotros`
- sanitizeInline
- use-cinematic-page-controller.ts
- auth.ts
- portfolio.ts
- diagnostic-service.ts
- cinematic-transition-proxy.mjs
- Cinematic Step 3D — responsive source replacement with visual retention
- test-cinematic-seek.ts
- (panel)/layout.tsx
- Cinematic Step 4A — production performance baseline
- availability-types.ts
- button.tsx
- approach.tsx
- [bookingId]/status/route.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 59 edges
2. `getDb()` - 46 edges
3. `siteConfig` - 41 edges
4. `lucide-react` - 32 edges
5. `react` - 31 edges
6. `sanitizeInline()` - 27 edges
7. `getCurrentAdmin()` - 26 edges
8. `isAdminActionOriginValid()` - 23 edges
9. `Reveal()` - 22 edges
10. `getSafeAdminReturnTo()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `AdminAvailabilityPage()` --calls--> `getAvailabilitySnapshot()`  [EXTRACTED]
  app/admin/(panel)/reuniones/disponibilidad/page.tsx → lib/availability-service.ts
- `AdminSummaryTile()` --calls--> `cn()`  [EXTRACTED]
  components/admin/admin-ui.tsx → lib/utils.ts
- `SummaryMetric()` --calls--> `cn()`  [EXTRACTED]
  components/admin/availability-date-planner.tsx → lib/utils.ts
- `handleSubmit()` --calls--> `validateAdvisoryBookingForm()`  [EXTRACTED]
  components/advisory-booking-form.tsx → lib/validation.ts
- `AdminDiagnosticDetailPage()` --calls--> `parseAdminListFilters()`  [EXTRACTED]
  app/admin/(panel)/diagnosticos/[diagnosticId]/page.tsx → lib/admin-data.ts

## Import Cycles
- None detected.

## Communities (79 total, 10 thin omitted)

### Community 0 - "Cinematic Step 4B — controller and network validation"
Cohesion: 0.12
Nodes (15): Cinematic Step 4B — controller and network validation, Custom Fast 4G-like network profile, Decision, Environment and reproducibility, Exact cause and retained correction, Freeze boundary, Graph and synchronous render path, Hero insertion, reveal and LCP (+7 more)

### Community 1 - "isAdminActionOriginValid"
Cohesion: 0.22
Nodes (20): POST(), POST(), POST(), POST(), POST(), POST(), POST(), applyAdminSessionCookie() (+12 more)

### Community 2 - "validation.ts"
Cohesion: 0.11
Nodes (37): POST(), GET(), GET(), POST(), POST(), handleSubmit(), DiagnosticWizard(), handleSubmit() (+29 more)

### Community 3 - "availability-service.ts"
Cohesion: 0.07
Nodes (66): getWeekday(), listDateRange(), POST(), redirectBack(), replaceDateException(), listAdvisoryBookings(), addDaysToDateValue(), buildAdvisoryDateTime() (+58 more)

### Community 4 - "calendar-adapter.ts"
Cohesion: 0.19
Nodes (13): CalendarBookingInput, CalendarBookingRecord, buildCalendarRecord(), buildDescription(), CalendarAdapter, GoogleCalendarAdapter, GoogleCalendarEventPayload, GoogleCalendarMockAdapter (+5 more)

### Community 5 - "db.ts"
Cohesion: 0.06
Nodes (42): createPrismaClient(), globalForPrisma, buildMysqlPoolConfig(), getMysqlConnectionSummary(), isMysqlSslEnabled(), normalizePem(), readBooleanEnv(), shouldUseMysqlPoolConfig() (+34 more)

### Community 6 - "contact-service.ts"
Cohesion: 0.15
Nodes (32): buildClientEmail(), buildInternalEmail(), findRecentDuplicateContact(), SubmissionResponse, submitContactForm(), buildClientEmail(), buildInternalEmail(), buildEmailLayout() (+24 more)

### Community 7 - "cn"
Cohesion: 0.06
Nodes (39): AdminPagination(), AdminPaginationProps, AdminShell(), AdminShellProps, getCurrentSection(), navigationItems, allNodes, HeroVisual() (+31 more)

### Community 8 - "site-shell.tsx"
Cohesion: 0.08
Nodes (38): afterBooking, bookingHighlights, metadata, ContactChannel, metadata, metadata, preparedFlow, metadata (+30 more)

### Community 9 - "config/site.ts"
Cohesion: 0.11
Nodes (20): metadata, viewport, robots(), sitemap(), domainIsPlaceholder, instagramUrl, isPlaceholderSiteUrl(), normalizeExternalUrl() (+12 more)

### Community 10 - "availability-date-planner.tsx"
Cohesion: 0.11
Nodes (22): addMonths(), allPlannerWeekdays, AvailabilityDatePlanner(), selectDate(), useVisibleMonthAsPlanRange(), AvailabilityDatePlannerProps, buildMonthDays(), businessPlannerWeekdays (+14 more)

### Community 11 - "app/page.tsx"
Cohesion: 0.13
Nodes (13): metadata, HomeApproach(), steps, benefits, HomeBenefits(), HomeHero(), HomeProjects(), LogoLoopProps (+5 more)

### Community 12 - "package.json"
Cohesion: 0.07
Nodes (27): name, packageManager, prisma, seed, private, version, @base-ui/react, clsx (+19 more)

### Community 13 - "form-delivery.ts"
Cohesion: 0.17
Nodes (25): integrationEnvConfig, buildContactEmailText(), buildDiagnosticEmailText(), buildFromHeader(), deliverContactSubmission(), deliverDiagnosticSubmission(), getAdminNotificationDestination(), getAdminNotificationDestinationLabel() (+17 more)

### Community 14 - "resend-adapter.ts"
Cohesion: 0.17
Nodes (16): BookingEmailInput, buildCancellation(), buildCompanyNotification(), buildCustomerConfirmation(), EmailDeliveryResult, getAdminEmail(), getEmailFrom(), getReplyTo() (+8 more)

### Community 15 - "lib/site.ts"
Cohesion: 0.20
Nodes (17): ContactPage(), ServicesPage(), FloatingLink, FloatingSocialButtons(), InstagramIcon(), HomeCallToAction(), QuickLink, SiteFooterMain() (+9 more)

### Community 16 - "components.json"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 17 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, build, db:check, db:generate, db:migrate, db:migrate:deploy, db:prod:deploy, db:prod:resolve (+11 more)

### Community 18 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 19 - "parseAdminListFilters"
Cohesion: 0.32
Nodes (10): GET(), GET(), recordAdminAuditLog(), clampPage(), escapeCsvCell(), exportContactSubmissions(), exportDiagnosticSubmissions(), parseAdminListFilters() (+2 more)

### Community 20 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 21 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @base-ui/react, class-variance-authority, clsx, dotenv, lucide-react, mariadb, next (+8 more)

### Community 22 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, esbuild, eslint, eslint-config-next, @eslint/eslintrc, postcss, prisma, shadcn (+8 more)

### Community 23 - "test-cinematic-source-switch.ts"
Cohesion: 0.11
Nodes (8): Canvas, Element, fire(), fixture(), Image, main(), timers, Video

### Community 24 - "LogoLoop.jsx"
Cohesion: 0.48
Nodes (6): ANIMATION_CONFIG, LogoLoop, toCssLength(), useAnimationLoop(), useImageLoader(), useResizeObserver()

### Community 25 - "Design System: Conexacod"
Cohesion: 0.10
Nodes (20): Buttons, Cards / Containers, Cinematic Page, Colors, Components, Design System: Conexacod, Do:, Do's and Don'ts (+12 more)

### Community 26 - "[bookingId]/page.tsx"
Cohesion: 0.05
Nodes (69): AdminDiagnosticDetailPage(), DiagnosticDetailPageProps, dynamic, metadata, AdminDiagnosticosPage(), buildMonthRange(), DiagnosticosPageProps, dynamic (+61 more)

### Community 27 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 28 - "overrides"
Cohesion: 0.36
Nodes (9): overrides, browserslist, deepmerge-ts, fast-uri, hono, mariadb, mysql2, pnpm (+1 more)

### Community 29 - "admin-auth.ts"
Cohesion: 0.15
Nodes (23): POST(), AdminLoginPage(), LoginPageProps, metadata, readParam(), ADMIN_ROLE_PERMISSIONS, AdminPermissionKey, authenticateAdmin() (+15 more)

### Community 30 - "use-responsive-cinematic-sources.ts"
Cohesion: 0.24
Nodes (11): CinematicLanding(), CinematicLandingProps, Readiness, Targets, CinematicMediaProfile, cinematicProfileChangeEvent, readMediaProfile(), resolveCinematicVideoSource() (+3 more)

### Community 31 - "next.config.mjs"
Cohesion: 0.40
Nodes (3): contentSecurityPolicy, nextConfig, securityHeaders

### Community 32 - "Cinematic Step 3C — preparation, frame readiness and layer work"
Cohesion: 0.13
Nodes (14): Baseline measured before changing 0.55, Cinematic Step 3C — preparation, frame readiness and layer work, Files changed / created, Final preload threshold: 0.40, Final transition measurements, Incoming-frame preparation and confirmation, Layer writes and compositor hints, Memory and remaining limits (+6 more)

### Community 33 - "run-ts.mjs"
Cohesion: 0.50
Nodes (3): esbuild, entryPoint, outfile

### Community 39 - "Conexacod · Producción 1.0"
Cohesion: 0.13
Nodes (14): Checklist de despliegue, Comportamiento actual esperado, Comportamiento SEO mientras faltan datos reales, Conexacod · Producción 1.0, Contacto por correo, Datos todavía pendientes, Diagnóstico por correo y n8n, Errores controlados y seguridad (+6 more)

### Community 40 - "use-cinematic-controller.ts"
Cohesion: 0.25
Nodes (13): createCinematicSourceSwitch(), createTransitionDiagnostics(), cinematicSeekTolerance, clamp(), createVideoSeekScheduler(), smoothstep(), CinematicControllerRefs, SectionRange (+5 more)

### Community 41 - "admin-data.ts"
Cohesion: 0.07
Nodes (41): AdminPaginatedList, AdvisoryBookingListItem, AdvisoryBookingListResult, bookingActiveStatuses, buildBookingWhere(), buildContactWhere(), buildDateBoundary(), buildDateFilter() (+33 more)

### Community 42 - "siteConfig"
Cohesion: 0.13
Nodes (22): AvailabilityResponse, BookingConfirmation, initialState, PublicAvailabilitySettings, ContactForm(), ContactFormProps, initialState, DiagnosticConfirmation (+14 more)

### Community 43 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 44 - "advisory-booking-service.ts"
Cohesion: 0.24
Nodes (15): buildConfirmation(), buildDateLabel(), buildTimeLabel(), joinIssues(), loadExistingBooking(), resolveDeliveryStatus(), shouldPersistCalendarEventId(), StoredBookingPreview (+7 more)

### Community 45 - "Cinematic media integration — Step 3A"
Cohesion: 0.22
Nodes (8): Browser and network verification, Cinematic media integration — Step 3A, Configuration and profile strategy, Files changed, Limitations, Loading behavior and preserved controller behavior, Step 3B boundary, Validation

### Community 46 - "AdvisoryBookingForm"
Cohesion: 0.28
Nodes (7): AdvisoryBookingForm(), handleSubmit(), loadAvailability(), updateField(), createInitialState(), futureValue(), todayValue()

### Community 47 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 48 - "ConexaCod security baseline"
Cohesion: 0.14
Nodes (12): Abuse and infrastructure still pending, Changes implemented, ConexaCod security baseline, CSP and destination inventory, Dependencies, Existing controls retained, Secrets and applicable boundaries, Verification and limits (+4 more)

### Community 49 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 50 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 51 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 56 - "email-templates.ts"
Cohesion: 0.33
Nodes (11): bookingTemplate(), BookingTemplateData, cleanLine(), diagnosticTemplate(), DiagnosticTemplateData, EmailTemplateInput, escapeHtml(), layout() (+3 more)

### Community 57 - "Cinematic media optimization — Step 2"
Cohesion: 0.12
Nodes (15): Assets generated, Cinematic media optimization — Step 2, Desktop H.264 results, Encoding settings, FFmpeg environment, File-size comparison, Final integrity check, Issues or limitations encountered (+7 more)

### Community 58 - "Cinematic Step 4C — desktop startup buffering"
Cohesion: 0.25
Nodes (7): Candidates and exact conditions, Cinematic Step 4C — desktop startup buffering, Current startup sequence, Decision, Files, Final behavior and validation, Measurement method

### Community 59 - "test-cinematic-transitions.ts"
Cohesion: 0.13
Nodes (15): BlendInput, createCinematicLayerWriter(), getCinematicBlend(), base, delayed, forward, initial, next (+7 more)

### Community 60 - "Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual., Source Nodes

### Community 61 - "email-delivery.ts"
Cohesion: 0.09
Nodes (16): cleanEntity(), cloneDelivery(), CreateEmailDeliveryInput, EmailDeliveryRepository, emailDeliveryStatuses, EmailMessage, EmailProvider, EmailProviderResult (+8 more)

### Community 62 - "Cinematic Step 3B — measured seek scheduler"
Cohesion: 0.17
Nodes (11): Browser regression results, Checks and limitations, Cinematic Step 3B — measured seek scheduler, Equivalent frames, Files changed, Frame confirmation, fallback, and cleanup, Instrumentation and measured before/after counts, Intro and internal-page compatibility (+3 more)

### Community 63 - "Surface Contract: `/nosotros`"
Cohesion: 0.25
Nodes (7): FIRST VIEWPORT, FORM, OWN-WORLD, QUALITY BAR, STORY, Surface Contract: `/nosotros`, THESIS

### Community 64 - "sanitizeInline"
Cohesion: 0.25
Nodes (15): sanitizeAdvisoryBookingData(), sanitizeContactFormData(), sanitizeDiagnosticFormData(), getRequestMetadata(), readClientAddress(), RequestMetadata, safeHeaderValue(), hashPassword() (+7 more)

### Community 65 - "use-cinematic-page-controller.ts"
Cohesion: 0.26
Nodes (8): CinematicPageProps, CinematicPageControllerRefs, ContentRange, cinematicPageConfig, CinematicPageId, cinematicConfig, cinematicMediaSources, CinematicSceneId

### Community 66 - "auth.ts"
Cohesion: 0.27
Nodes (10): base64Url(), buildServiceAccountJwt(), getCalendarRuntimeConfig(), getGoogleAccessToken(), getGoogleCalendarCredentials(), googleCalendarScopes, GoogleServiceAccountCredentials, normalizePrivateKey() (+2 more)

### Community 67 - "portfolio.ts"
Cohesion: 0.16
Nodes (14): generateMetadata(), ProjectPage(), ProjectPageProps, PortfolioSection(), ProjectCard(), ProjectCardProps, ProjectDetail(), getPublishedProjectBySlug() (+6 more)

### Community 68 - "diagnostic-service.ts"
Cohesion: 0.20
Nodes (11): enqueueBookingEmailDeliveries(), enqueueDiagnosticEmailDeliveries(), findRecentDuplicateDiagnostic(), SubmissionResponse, submitDiagnosticForm(), wantsMeetingToBoolean(), isDiagnosticWebhookConfigured(), sendDiagnosticWebhook() (+3 more)

### Community 69 - "cinematic-transition-proxy.mjs"
Cohesion: 0.40
Nodes (4): latencyMs, port, server, upstreamPort

### Community 70 - "Cinematic Step 3D — responsive source replacement with visual retention"
Cohesion: 0.12
Nodes (15): Baseline and final measurements, Cinematic Step 3D — responsive source replacement with visual retention, Files modified / created, Internal pages, Intro behavior, Network and initial payload, Regression and stress results, Reproduction (+7 more)

### Community 72 - "test-cinematic-seek.ts"
Cohesion: 0.13
Nodes (5): fixture(), jitter, Observer, timers, Video

### Community 73 - "(panel)/layout.tsx"
Cohesion: 0.40
Nodes (5): AdminPanelLayout(), dynamic, metadata, requireAdminUser(), adminRoleLabels

### Community 74 - "Cinematic Step 4A — production performance baseline"
Cohesion: 0.15
Nodes (12): Cinematic Step 4A — production performance baseline, Environment and method, Executive result, Frame intervals and long tasks, Initial load and Core Web Vitals, Internal pages and non-cinematic UI, Intro, traversal, and media readiness, Memory checkpoints (+4 more)

### Community 75 - "availability-types.ts"
Cohesion: 0.17
Nodes (10): advisoryTimezone, advisoryTimezoneLabel, advisoryUtcOffset, AvailabilityDateMode, AvailabilityDateSummary, AvailabilityRulesSnapshot, AvailabilitySlot, BusyInterval (+2 more)

### Community 76 - "button.tsx"
Cohesion: 0.67
Nodes (3): Button(), buttonVariants, class-variance-authority

### Community 78 - "[bookingId]/status/route.ts"
Cohesion: 0.67
Nodes (3): POST(), shouldReleaseBookingSlot(), updateAdvisoryBookingStatus()

## Knowledge Gaps
- **539 isolated node(s):** `dynamic`, `dynamic`, `dynamic`, `metadata`, `DiagnosticDetailPageProps` (+534 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 647 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `cn` to `use-cinematic-page-controller.ts`, `portfolio.ts`, `use-cinematic-controller.ts`, `(panel)/layout.tsx`, `availability-date-planner.tsx`, `siteConfig`, `app/page.tsx`, `site-shell.tsx`, `package.json`, `lib/site.ts`, `LogoLoop.jsx`, `[bookingId]/page.tsx`, `use-responsive-cinematic-sources.ts`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `siteConfig` connect `siteConfig` to `auth.ts`, `availability-service.ts`, `calendar-adapter.ts`, `diagnostic-service.ts`, `contact-service.ts`, `cn`, `site-shell.tsx`, `config/site.ts`, `admin-data.ts`, `app/page.tsx`, `advisory-booking-service.ts`, `form-delivery.ts`, `lib/site.ts`, `admin-auth.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `email-delivery.ts` to `availability-service.ts`, `diagnostic-service.ts`, `db.ts`, `contact-service.ts`, `admin-data.ts`, `availability-types.ts`, `advisory-booking-service.ts`, `package.json`, `resend-adapter.ts`, `email-templates.ts`, `admin-auth.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `dynamic`, `dynamic`, `dynamic` to the rest of the system?**
  _539 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Cinematic Step 4B — controller and network validation` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `validation.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11170212765957446 - nodes in this community are weakly interconnected._
- **Should `availability-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0669710806697108 - nodes in this community are weakly interconnected._