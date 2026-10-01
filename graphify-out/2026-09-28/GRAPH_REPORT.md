# Graph Report - Empresa-main  (2026-09-28)

## Corpus Check
- 165 files · ~831,433 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1201 nodes · 2826 edges · 66 communities (55 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- admin-data.ts
- validation.ts
- advisory-booking-form.tsx
- availability-service.ts
- calendar-adapter.ts
- db.ts
- mailer.ts
- cn
- reveal.tsx
- config/site.ts
- availability-date-planner.tsx
- site-action.tsx
- package.json
- form-delivery.ts
- resend-adapter.ts
- contacto/page.tsx
- components.json
- scripts
- compilerOptions
- admin-ui.tsx
- What You Must Do When Invoked
- dependencies
- devDependencies
- diagnosticos/page.tsx
- LogoLoop.jsx
- Design System: Conexacod
- [diagnosticId]/page.tsx
- Product
- overrides
- portal-hero-visual.tsx
- prisma-production-guard.ts
- next.config.mjs
- [bookingId]/page.tsx
- run-ts.mjs
- [contactId]/page.tsx
- contactos/page.tsx
- postcss.config.mjs
- eslint.config.mjs
- next-env.d.ts
- Conexacod · Producción 1.0
- use-cinematic-page-controller.ts
- contact-service.ts
- diagnostic-service.ts
- graphify reference: extra exports and benchmark
- advisory-booking-service.ts
- sanitizeInline
- email-delivery.ts
- graphify reference: query, path, explain
- Vercel security baseline
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- extraction-spec.md
- email-templates.ts
- site-shell.tsx
- InMemoryEmailDeliveryRepository
- admin-booking-reschedule-form.tsx
- Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual.
- admin-detail-shell.tsx
- button.tsx
- Surface Contract: `/nosotros`
- portfolio.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 58 edges
2. `getDb()` - 46 edges
3. `siteConfig` - 40 edges
4. `lucide-react` - 32 edges
5. `react` - 30 edges
6. `sanitizeInline()` - 27 edges
7. `getCurrentAdmin()` - 26 edges
8. `Reveal()` - 22 edges
9. `SiteAction()` - 21 edges
10. `hasAdminPermission()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `AdminAvailabilityPage()` --calls--> `getAvailabilitySnapshot()`  [EXTRACTED]
  app/admin/(panel)/reuniones/disponibilidad/page.tsx → lib/availability-service.ts
- `ServicesPage()` --calls--> `buildWhatsAppUrl()`  [EXTRACTED]
  app/servicios/page.tsx → lib/site.ts
- `AdminSummaryTile()` --calls--> `cn()`  [EXTRACTED]
  components/admin/admin-ui.tsx → lib/utils.ts
- `SummaryMetric()` --calls--> `cn()`  [EXTRACTED]
  components/admin/availability-date-planner.tsx → lib/utils.ts
- `handleSubmit()` --calls--> `validateAdvisoryBookingForm()`  [EXTRACTED]
  components/advisory-booking-form.tsx → lib/validation.ts

## Import Cycles
- None detected.

## Communities (66 total, 10 thin omitted)

### Community 0 - "admin-data.ts"
Cohesion: 0.05
Nodes (100): POST(), POST(), GET(), POST(), POST(), GET(), POST(), POST() (+92 more)

### Community 1 - "validation.ts"
Cohesion: 0.11
Nodes (35): POST(), GET(), GET(), POST(), POST(), handleSubmit(), DiagnosticWizard(), handleSubmit() (+27 more)

### Community 2 - "advisory-booking-form.tsx"
Cohesion: 0.13
Nodes (21): AvailabilityResponse, BookingConfirmation, initialState, PublicAvailabilitySettings, ContactForm(), ContactFormProps, initialState, DiagnosticConfirmation (+13 more)

### Community 3 - "availability-service.ts"
Cohesion: 0.07
Nodes (57): getWeekday(), listDateRange(), POST(), redirectBack(), replaceDateException(), AdvisoryBookingForm(), handleSubmit(), loadAvailability() (+49 more)

### Community 4 - "calendar-adapter.ts"
Cohesion: 0.08
Nodes (38): BusyInterval, CalendarBookingInput, CalendarBookingRecord, buildCalendarRecord(), buildDescription(), CalendarAdapter, GoogleCalendarAdapter, GoogleCalendarEventPayload (+30 more)

### Community 5 - "db.ts"
Cohesion: 0.09
Nodes (30): createPrismaClient(), globalForPrisma, buildMysqlPoolConfig(), getMysqlConnectionSummary(), isMysqlSslEnabled(), normalizePem(), readBooleanEnv(), shouldUseMysqlPoolConfig() (+22 more)

### Community 6 - "mailer.ts"
Cohesion: 0.21
Nodes (20): buildFromHeader(), createTransporter(), getAdminNotificationDestination(), getMissingSmtpEnv(), getSmtpConfig(), getSmtpPassword(), isPlaceholderValue(), isSmtpConfigured() (+12 more)

### Community 7 - "cn"
Cohesion: 0.10
Nodes (22): AdminPagination(), AdminPaginationProps, AdminShell(), AdminShellProps, getCurrentSection(), navigationItems, allNodes, HeroVisual() (+14 more)

### Community 8 - "reveal.tsx"
Cohesion: 0.08
Nodes (28): afterBooking, bookingHighlights, metadata, metadata, preparedFlow, metadata, values, workingPrinciples (+20 more)

### Community 9 - "config/site.ts"
Cohesion: 0.09
Nodes (26): metadata, viewport, dataCategories, intendedPurposes, metadata, pendingItems, robots(), sitemap() (+18 more)

### Community 10 - "availability-date-planner.tsx"
Cohesion: 0.08
Nodes (31): addMonths(), allPlannerWeekdays, AvailabilityDatePlanner(), selectDate(), useVisibleMonthAsPlanRange(), AvailabilityDatePlannerProps, buildMonthDays(), businessPlannerWeekdays (+23 more)

### Community 11 - "site-action.tsx"
Cohesion: 0.13
Nodes (16): metadata, HomeApproach(), steps, benefits, HomeBenefits(), HomeHero(), HomeProjects(), LogoLoopProps (+8 more)

### Community 12 - "package.json"
Cohesion: 0.07
Nodes (26): name, packageManager, prisma, seed, private, version, @base-ui/react, clsx (+18 more)

### Community 13 - "form-delivery.ts"
Cohesion: 0.17
Nodes (25): integrationEnvConfig, buildContactEmailText(), buildDiagnosticEmailText(), buildFromHeader(), deliverContactSubmission(), deliverDiagnosticSubmission(), getAdminNotificationDestination(), getAdminNotificationDestinationLabel() (+17 more)

### Community 14 - "resend-adapter.ts"
Cohesion: 0.17
Nodes (16): BookingEmailInput, buildCancellation(), buildCompanyNotification(), buildCustomerConfirmation(), EmailDeliveryResult, getAdminEmail(), getEmailFrom(), getReplyTo() (+8 more)

### Community 15 - "contacto/page.tsx"
Cohesion: 0.19
Nodes (18): ContactChannel, ContactPage(), metadata, FloatingLink, FloatingSocialButtons(), InstagramIcon(), HomeCallToAction(), QuickLink (+10 more)

### Community 16 - "components.json"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 17 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, build, db:check, db:generate, db:migrate, db:migrate:deploy, db:prod:deploy, db:prod:resolve (+11 more)

### Community 18 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 19 - "admin-ui.tsx"
Cohesion: 0.12
Nodes (19): AdminDashboardPage(), dynamic, metadata, AdminAvailabilityPage(), dynamic, metadata, AdminExecutiveModuleCard(), AdminHistorySection() (+11 more)

### Community 20 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 21 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @base-ui/react, class-variance-authority, clsx, dotenv, lucide-react, mariadb, next (+8 more)

### Community 22 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, esbuild, eslint, eslint-config-next, @eslint/eslintrc, postcss, prisma, shadcn (+8 more)

### Community 23 - "diagnosticos/page.tsx"
Cohesion: 0.14
Nodes (23): AdminDiagnosticosPage(), buildMonthRange(), DiagnosticosPageProps, dynamic, metadata, AdminReunionesPage(), buildWeekRange(), dynamic (+15 more)

### Community 24 - "LogoLoop.jsx"
Cohesion: 0.48
Nodes (6): ANIMATION_CONFIG, LogoLoop, toCssLength(), useAnimationLoop(), useImageLoader(), useResizeObserver()

### Community 25 - "Design System: Conexacod"
Cohesion: 0.10
Nodes (20): Buttons, Cards / Containers, Cinematic Page, Colors, Components, Design System: Conexacod, Do:, Do's and Don'ts (+12 more)

### Community 26 - "[diagnosticId]/page.tsx"
Cohesion: 0.27
Nodes (11): AdminDiagnosticDetailPage(), DiagnosticDetailPageProps, dynamic, metadata, AdminCollapsiblePanel(), AdminInfoCard(), getDiagnosticSubmissionDetail(), buildAdminMailto() (+3 more)

### Community 27 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 28 - "overrides"
Cohesion: 0.33
Nodes (9): overrides, browserslist, deepmerge-ts, fast-uri, hono, mariadb, mysql2, pnpm (+1 more)

### Community 29 - "portal-hero-visual.tsx"
Cohesion: 0.13
Nodes (14): allNodes, CrystalColumnProps, leftNodes, PortalHeroVisual(), handlePointerMove(), queueParallax(), resetPointer(), PortalLabel() (+6 more)

### Community 30 - "prisma-production-guard.ts"
Cohesion: 0.19
Nodes (13): assertSeedEnvironment(), assertWriteConfirmed(), command, fail(), getCommand(), getMigrationToResolve(), GuardCommand, loadLocalEnvironment() (+5 more)

### Community 31 - "next.config.mjs"
Cohesion: 0.40
Nodes (3): contentSecurityPolicy, nextConfig, securityHeaders

### Community 32 - "[bookingId]/page.tsx"
Cohesion: 0.23
Nodes (11): AdminBookingDetailPage(), BookingDetailPageProps, dynamic, metadata, advisoryBookingStatusOptions, clampPage(), getAdvisoryBookingDetail(), parseAdminListFilters() (+3 more)

### Community 33 - "run-ts.mjs"
Cohesion: 0.50
Nodes (3): esbuild, entryPoint, outfile

### Community 39 - "Conexacod · Producción 1.0"
Cohesion: 0.13
Nodes (14): Checklist de despliegue, Comportamiento actual esperado, Comportamiento SEO mientras faltan datos reales, Conexacod · Producción 1.0, Contacto por correo, Datos todavía pendientes, Diagnóstico por correo y n8n, Errores controlados y seguridad (+6 more)

### Community 40 - "use-cinematic-page-controller.ts"
Cohesion: 0.21
Nodes (16): CinematicLanding(), CinematicLandingProps, clamp(), seekVideo(), smoothstep(), CinematicControllerRefs, SectionRange, useCinematicController() (+8 more)

### Community 41 - "contact-service.ts"
Cohesion: 0.35
Nodes (12): buildClientEmail(), buildInternalEmail(), findRecentDuplicateContact(), SubmissionResponse, submitContactForm(), buildClientEmail(), buildInternalEmail(), buildEmailLayout() (+4 more)

### Community 42 - "diagnostic-service.ts"
Cohesion: 0.29
Nodes (10): enqueueDiagnosticEmailDeliveries(), findRecentDuplicateDiagnostic(), SubmissionResponse, submitDiagnosticForm(), wantsMeetingToBoolean(), isDiagnosticWebhookConfigured(), sendDiagnosticWebhook(), getAdminNotificationDestinationLabel() (+2 more)

### Community 43 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 44 - "advisory-booking-service.ts"
Cohesion: 0.16
Nodes (17): buildConfirmation(), buildDateLabel(), buildTimeLabel(), enqueueBookingEmailDeliveries(), joinIssues(), loadExistingBooking(), resolveDeliveryStatus(), shouldPersistCalendarEventId() (+9 more)

### Community 45 - "sanitizeInline"
Cohesion: 0.22
Nodes (16): sanitizeAdvisoryBookingData(), sanitizeContactFormData(), sanitizeDiagnosticFormData(), cleanEntity(), sanitizeCreateInput(), getRequestMetadata(), readClientAddress(), RequestMetadata (+8 more)

### Community 46 - "email-delivery.ts"
Cohesion: 0.11
Nodes (11): CreateEmailDeliveryInput, EmailDeliveryRepository, emailDeliveryStatuses, EmailMessage, EmailProvider, EmailProviderResult, MockEmailProvider, PrismaEmailDeliveryRepository (+3 more)

### Community 47 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 48 - "Vercel security baseline"
Cohesion: 0.40
Nodes (4): CSP and headers, Required Vercel WAF rate limiting, Sensitive Vercel environment variables, Vercel security baseline

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

### Community 57 - "site-shell.tsx"
Cohesion: 0.43
Nodes (5): CinematicPage(), CinematicPageProps, SiteShellProps, cinematicPageConfig, CinematicPageId

### Community 59 - "admin-booking-reschedule-form.tsx"
Cohesion: 0.33
Nodes (5): AdminBookingRescheduleForm(), AdminBookingRescheduleFormProps, AvailabilityResponse, formatDateForPreview(), fieldClassName

### Community 60 - "Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual., Source Nodes

### Community 61 - "admin-detail-shell.tsx"
Cohesion: 0.38
Nodes (4): AdminDetailAction, AdminDetailActions(), iconMap, AdminDetailShell()

### Community 62 - "button.tsx"
Cohesion: 0.67
Nodes (3): Button(), buttonVariants, class-variance-authority

### Community 63 - "Surface Contract: `/nosotros`"
Cohesion: 0.25
Nodes (7): FIRST VIEWPORT, FORM, OWN-WORLD, QUALITY BAR, STORY, Surface Contract: `/nosotros`, THESIS

### Community 67 - "portfolio.ts"
Cohesion: 0.16
Nodes (14): generateMetadata(), ProjectPage(), ProjectPageProps, PortfolioSection(), ProjectCard(), ProjectCardProps, ProjectDetail(), getPublishedProjectBySlug() (+6 more)

## Knowledge Gaps
- **422 isolated node(s):** `dynamic`, `dynamic`, `dynamic`, `metadata`, `DiagnosticDetailPageProps` (+417 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 499 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `siteConfig` connect `config/site.ts` to `admin-data.ts`, `advisory-booking-form.tsx`, `availability-service.ts`, `calendar-adapter.ts`, `mailer.ts`, `cn`, `reveal.tsx`, `contact-service.ts`, `diagnostic-service.ts`, `site-action.tsx`, `advisory-booking-service.ts`, `form-delivery.ts`, `contacto/page.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `react` connect `cn` to `admin-data.ts`, `advisory-booking-form.tsx`, `portfolio.ts`, `use-cinematic-page-controller.ts`, `reveal.tsx`, `availability-date-planner.tsx`, `site-action.tsx`, `package.json`, `contacto/page.tsx`, `portal-hero-visual.tsx`, `admin-ui.tsx`, `LogoLoop.jsx`, `site-shell.tsx`, `admin-booking-reschedule-form.tsx`, `admin-detail-shell.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `db.ts` to `admin-data.ts`, `availability-service.ts`, `contact-service.ts`, `availability-date-planner.tsx`, `diagnostic-service.ts`, `advisory-booking-service.ts`, `package.json`, `email-delivery.ts`, `resend-adapter.ts`, `email-templates.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `dynamic`, `dynamic`, `dynamic` to the rest of the system?**
  _422 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05049580472921434 - nodes in this community are weakly interconnected._
- **Should `validation.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11212121212121212 - nodes in this community are weakly interconnected._
- **Should `advisory-booking-form.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13105413105413105 - nodes in this community are weakly interconnected._