# Graph Report - Empresa-main  (2026-09-25)

## Corpus Check
- 155 files · ~726,796 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1138 nodes · 2726 edges · 70 communities (58 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.84)
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
- contacto/page.tsx
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
- sanitizeInline
- What You Must Do When Invoked
- dependencies
- devDependencies
- admin-ui.tsx
- home-projects.tsx
- [bookingId]/page.tsx
- buildAdminForbiddenResponse
- diagnosticos/page.tsx
- overrides
- portal-hero-visual.tsx
- [diagnosticId]/page.tsx
- next.config.mjs
- AdvisoryBookingForm
- run-ts.mjs
- [contactId]/page.tsx
- contactos/page.tsx
- postcss.config.mjs
- eslint.config.mjs
- next-env.d.ts
- Conexacod · Producción 1.0
- use-cinematic-page-controller.ts
- hasAdminPermission
- admin-detail-shell.tsx
- graphify reference: extra exports and benchmark
- advisory-booking-service.ts
- admin-auth.ts
- contact-service.ts
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
- diagnostic-service.ts
- InMemoryEmailDeliveryRepository
- getCurrentAdmin
- Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual.
- site-shell.tsx
- button.tsx
- advisory-time.ts
- (panel)/layout.tsx
- getRequestMetadata
- admin-status-badge.tsx
- [bookingId]/status/route.ts
- approach.tsx
- prisma

## God Nodes (most connected - your core abstractions)
1. `cn()` - 58 edges
2. `getDb()` - 46 edges
3. `siteConfig` - 38 edges
4. `lucide-react` - 31 edges
5. `react` - 29 edges
6. `sanitizeInline()` - 27 edges
7. `getCurrentAdmin()` - 26 edges
8. `hasAdminPermission()` - 21 edges
9. `buildAdminForbiddenResponse()` - 21 edges
10. `isAdminActionOriginValid()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `AdminAvailabilityPage()` --calls--> `getAvailabilitySnapshot()`  [EXTRACTED]
  app/admin/(panel)/reuniones/disponibilidad/page.tsx → lib/availability-service.ts
- `AdminSummaryTile()` --calls--> `cn()`  [EXTRACTED]
  components/admin/admin-ui.tsx → lib/utils.ts
- `SummaryMetric()` --calls--> `cn()`  [EXTRACTED]
  components/admin/availability-date-planner.tsx → lib/utils.ts
- `handleSubmit()` --calls--> `validateAdvisoryBookingForm()`  [EXTRACTED]
  components/advisory-booking-form.tsx → lib/validation.ts
- `PortalLayer()` --calls--> `cn()`  [EXTRACTED]
  components/portal-hero-visual.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (70 total, 12 thin omitted)

### Community 0 - "admin-data.ts"
Cohesion: 0.07
Nodes (42): AdminListFilters, AdminPaginatedList, AdvisoryBookingListItem, AdvisoryBookingListResult, bookingActiveStatuses, buildBookingWhere(), buildContactWhere(), buildDateBoundary() (+34 more)

### Community 1 - "validation.ts"
Cohesion: 0.12
Nodes (34): POST(), GET(), GET(), POST(), POST(), handleSubmit(), DiagnosticWizard(), handleSubmit() (+26 more)

### Community 2 - "advisory-booking-form.tsx"
Cohesion: 0.13
Nodes (21): AvailabilityResponse, BookingConfirmation, initialState, PublicAvailabilitySettings, ContactForm(), ContactFormProps, initialState, DiagnosticConfirmation (+13 more)

### Community 3 - "availability-service.ts"
Cohesion: 0.07
Nodes (61): getWeekday(), listDateRange(), POST(), redirectBack(), replaceDateException(), buildAdvisoryDateTime(), formatAdvisoryTimeLabel(), formatTimeValueInAdvisoryZone() (+53 more)

### Community 4 - "calendar-adapter.ts"
Cohesion: 0.11
Nodes (25): BusyInterval, CalendarBookingInput, CalendarBookingRecord, buildCalendarRecord(), buildDescription(), CalendarAdapter, getCalendarAdapter(), GoogleCalendarAdapter (+17 more)

### Community 5 - "db.ts"
Cohesion: 0.06
Nodes (42): createPrismaClient(), globalForPrisma, buildMysqlPoolConfig(), getMysqlConnectionSummary(), isMysqlSslEnabled(), normalizePem(), readBooleanEnv(), shouldUseMysqlPoolConfig() (+34 more)

### Community 6 - "mailer.ts"
Cohesion: 0.21
Nodes (20): buildFromHeader(), createTransporter(), getAdminNotificationDestination(), getMissingSmtpEnv(), getSmtpConfig(), getSmtpPassword(), isPlaceholderValue(), isSmtpConfigured() (+12 more)

### Community 7 - "cn"
Cohesion: 0.11
Nodes (22): AdminShell(), AdminShellProps, getCurrentSection(), navigationItems, allNodes, HeroVisual(), leftNodes, Node (+14 more)

### Community 8 - "contacto/page.tsx"
Cohesion: 0.09
Nodes (35): afterBooking, bookingHighlights, metadata, ContactChannel, metadata, metadata, preparedFlow, differentiators (+27 more)

### Community 9 - "config/site.ts"
Cohesion: 0.10
Nodes (21): metadata, viewport, metadata, robots(), sitemap(), domainIsPlaceholder, instagramUrl, isPlaceholderSiteUrl() (+13 more)

### Community 10 - "availability-date-planner.tsx"
Cohesion: 0.08
Nodes (31): addMonths(), allPlannerWeekdays, AvailabilityDatePlanner(), selectDate(), useVisibleMonthAsPlanRange(), AvailabilityDatePlannerProps, buildMonthDays(), businessPlannerWeekdays (+23 more)

### Community 11 - "app/page.tsx"
Cohesion: 0.21
Nodes (7): metadata, CinematicLanding(), HomeApproach(), steps, benefits, HomeBenefits(), HomeHero()

### Community 12 - "package.json"
Cohesion: 0.08
Nodes (24): name, packageManager, private, version, @base-ui/react, clsx, eslint, eslint-config-next (+16 more)

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

### Community 19 - "sanitizeInline"
Cohesion: 0.12
Nodes (18): cleanEntity(), CreateEmailDeliveryInput, EmailDeliveryRepository, emailDeliveryStatuses, EmailProvider, EmailProviderResult, MockEmailProvider, PrismaEmailDeliveryRepository (+10 more)

### Community 20 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 21 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @base-ui/react, class-variance-authority, clsx, dotenv, lucide-react, mariadb, next (+8 more)

### Community 22 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, esbuild, eslint, eslint-config-next, @eslint/eslintrc, postcss, prisma, shadcn (+8 more)

### Community 23 - "admin-ui.tsx"
Cohesion: 0.11
Nodes (21): AdminDashboardPage(), dynamic, metadata, AdminAvailabilityPage(), dynamic, metadata, AdminCollapsiblePanel(), AdminEmptyState() (+13 more)

### Community 24 - "home-projects.tsx"
Cohesion: 0.20
Nodes (12): HomeProjects(), LogoLoopProps, ProjectLogo, projectLogos, projectMarks, TypedLogoLoop, ANIMATION_CONFIG, LogoLoop (+4 more)

### Community 25 - "[bookingId]/page.tsx"
Cohesion: 0.19
Nodes (10): BookingDetailPageProps, dynamic, metadata, AdminBookingRescheduleForm(), AdminBookingRescheduleFormProps, AvailabilityResponse, formatDateForPreview(), fieldClassName (+2 more)

### Community 26 - "buildAdminForbiddenResponse"
Cohesion: 0.22
Nodes (19): POST(), POST(), POST(), POST(), POST(), POST(), POST(), applyAdminSessionCookie() (+11 more)

### Community 27 - "diagnosticos/page.tsx"
Cohesion: 0.16
Nodes (21): AdminDiagnosticosPage(), buildMonthRange(), DiagnosticosPageProps, dynamic, metadata, AdminReunionesPage(), buildWeekRange(), dynamic (+13 more)

### Community 28 - "overrides"
Cohesion: 0.33
Nodes (9): overrides, browserslist, deepmerge-ts, fast-uri, hono, mariadb, mysql2, pnpm (+1 more)

### Community 29 - "portal-hero-visual.tsx"
Cohesion: 0.13
Nodes (14): allNodes, CrystalColumnProps, leftNodes, PortalHeroVisual(), handlePointerMove(), queueParallax(), resetPointer(), PortalLabel() (+6 more)

### Community 30 - "[diagnosticId]/page.tsx"
Cohesion: 0.26
Nodes (12): AdminDiagnosticDetailPage(), DiagnosticDetailPageProps, dynamic, metadata, AdminBookingDetailPage(), AdminInfoCard(), diagnosticStatusOptions, getDiagnosticSubmissionDetail() (+4 more)

### Community 31 - "next.config.mjs"
Cohesion: 0.40
Nodes (3): contentSecurityPolicy, nextConfig, securityHeaders

### Community 32 - "AdvisoryBookingForm"
Cohesion: 0.28
Nodes (7): AdvisoryBookingForm(), handleSubmit(), loadAvailability(), updateField(), createInitialState(), futureValue(), todayValue()

### Community 33 - "run-ts.mjs"
Cohesion: 0.50
Nodes (3): esbuild, entryPoint, outfile

### Community 39 - "Conexacod · Producción 1.0"
Cohesion: 0.13
Nodes (14): Checklist de despliegue, Comportamiento actual esperado, Comportamiento SEO mientras faltan datos reales, Conexacod · Producción 1.0, Contacto por correo, Datos todavía pendientes, Diagnóstico por correo y n8n, Errores controlados y seguridad (+6 more)

### Community 40 - "use-cinematic-page-controller.ts"
Cohesion: 0.22
Nodes (15): CinematicLandingProps, clamp(), seekVideo(), smoothstep(), CinematicControllerRefs, SectionRange, useCinematicController(), render() (+7 more)

### Community 41 - "hasAdminPermission"
Cohesion: 0.42
Nodes (8): GET(), GET(), hasAdminPermission(), recordAdminAuditLog(), escapeCsvCell(), exportContactSubmissions(), exportDiagnosticSubmissions(), serializeCsv()

### Community 42 - "admin-detail-shell.tsx"
Cohesion: 0.38
Nodes (4): AdminDetailAction, AdminDetailActions(), iconMap, AdminDetailShell()

### Community 43 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 44 - "advisory-booking-service.ts"
Cohesion: 0.17
Nodes (15): buildConfirmation(), buildDateLabel(), buildTimeLabel(), enqueueBookingEmailDeliveries(), joinIssues(), loadExistingBooking(), resolveDeliveryStatus(), sanitizeAdvisoryBookingData() (+7 more)

### Community 45 - "admin-auth.ts"
Cohesion: 0.18
Nodes (18): POST(), ADMIN_ROLE_PERMISSIONS, AdminPermissionKey, authenticateAdmin(), AuthenticatedAdmin, clearAdminSessionCookie(), findAuthenticatedAdminByToken(), getAuthSecret() (+10 more)

### Community 46 - "contact-service.ts"
Cohesion: 0.27
Nodes (15): buildClientEmail(), buildInternalEmail(), findRecentDuplicateContact(), sanitizeContactFormData(), SubmissionResponse, submitContactForm(), buildClientEmail(), buildInternalEmail() (+7 more)

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
Cohesion: 0.23
Nodes (13): EmailMessage, bookingTemplate(), BookingTemplateData, cleanLine(), diagnosticTemplate(), DiagnosticTemplateData, EmailTemplateInput, escapeHtml() (+5 more)

### Community 57 - "diagnostic-service.ts"
Cohesion: 0.29
Nodes (10): enqueueDiagnosticEmailDeliveries(), findRecentDuplicateDiagnostic(), sanitizeDiagnosticFormData(), SubmissionResponse, submitDiagnosticForm(), wantsMeetingToBoolean(), isDiagnosticWebhookConfigured(), sendDiagnosticWebhook() (+2 more)

### Community 59 - "getCurrentAdmin"
Cohesion: 0.43
Nodes (7): AdminLoginPage(), LoginPageProps, metadata, readParam(), getAdminLoginErrorMessage(), getAdminRuntimeConfigError(), getCurrentAdmin()

### Community 60 - "Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual., Source Nodes

### Community 61 - "site-shell.tsx"
Cohesion: 0.43
Nodes (5): CinematicPage(), CinematicPageProps, SiteShellProps, cinematicPageConfig, CinematicPageId

### Community 62 - "button.tsx"
Cohesion: 0.67
Nodes (3): Button(), buttonVariants, class-variance-authority

### Community 63 - "advisory-time.ts"
Cohesion: 0.36
Nodes (7): addDaysToDateValue(), formatAdvisoryDateTimeLabel(), formatAdvisoryEndTimeLabel(), formatDateValueInAdvisoryZone(), getTodayInAdvisoryZone(), pad(), pickPart()

### Community 64 - "(panel)/layout.tsx"
Cohesion: 0.40
Nodes (5): AdminPanelLayout(), dynamic, metadata, requireAdminUser(), adminRoleLabels

### Community 65 - "getRequestMetadata"
Cohesion: 0.53
Nodes (5): getRequestMetadata(), readClientAddress(), RequestMetadata, safeHeaderValue(), hashValue()

### Community 66 - "admin-status-badge.tsx"
Cohesion: 0.50
Nodes (4): AdminStatusBadge(), badgeClasses, statusDotClasses, getStatusLabel()

### Community 67 - "[bookingId]/status/route.ts"
Cohesion: 0.67
Nodes (3): POST(), shouldReleaseBookingSlot(), updateAdvisoryBookingStatus()

## Knowledge Gaps
- **389 isolated node(s):** `dynamic`, `dynamic`, `dynamic`, `metadata`, `DiagnosticDetailPageProps` (+384 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 459 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `cn` to `(panel)/layout.tsx`, `advisory-booking-form.tsx`, `use-cinematic-page-controller.ts`, `contacto/page.tsx`, `admin-detail-shell.tsx`, `availability-date-planner.tsx`, `package.json`, `lib/site.ts`, `portal-hero-visual.tsx`, `admin-ui.tsx`, `home-projects.tsx`, `[bookingId]/page.tsx`, `site-shell.tsx`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `email-templates.ts` to `admin-data.ts`, `availability-service.ts`, `db.ts`, `availability-date-planner.tsx`, `advisory-booking-service.ts`, `admin-auth.ts`, `contact-service.ts`, `resend-adapter.ts`, `package.json`, `sanitizeInline`, `diagnostic-service.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `siteConfig` connect `config/site.ts` to `admin-data.ts`, `advisory-booking-form.tsx`, `availability-service.ts`, `calendar-adapter.ts`, `mailer.ts`, `cn`, `contacto/page.tsx`, `app/page.tsx`, `advisory-booking-service.ts`, `form-delivery.ts`, `contact-service.ts`, `lib/site.ts`, `diagnostic-service.ts`, `advisory-time.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `dynamic`, `dynamic`, `dynamic` to the rest of the system?**
  _389 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0664451827242525 - nodes in this community are weakly interconnected._
- **Should `validation.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11627906976744186 - nodes in this community are weakly interconnected._
- **Should `advisory-booking-form.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13105413105413105 - nodes in this community are weakly interconnected._