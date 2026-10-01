# Graph Report - Empresa-main  (2026-09-09)

## Corpus Check
- 155 files · ~664,870 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1136 nodes · 2719 edges · 63 communities (52 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- admin-data.ts
- advisory-booking-form.tsx
- calendar-adapter.ts
- availability-service.ts
- events.ts
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
- site-shell.tsx
- components.json
- scripts
- compilerOptions
- email-delivery.ts
- What You Must Do When Invoked
- dependencies
- devDependencies
- advisory-booking-service.ts
- LogoLoop.jsx
- admin-auth.ts
- buildAdminForbiddenResponse
- [bookingId]/page.tsx
- overrides
- portal-hero-visual.tsx
- sanitizeInline
- next.config.mjs
- contact-service.ts
- run-ts.mjs
- [contactId]/page.tsx
- contactos/page.tsx
- postcss.config.mjs
- eslint.config.mjs
- next-env.d.ts
- Konamy Systems · Producción 1.0
- use-cinematic-page-controller.ts
- hasAdminPermission
- email-templates.ts
- graphify reference: extra exports and benchmark
- diagnostic-service.ts
- InMemoryEmailDeliveryRepository
- (panel)/layout.tsx
- graphify reference: query, path, explain
- Vercel security baseline
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- extraction-spec.md
- prisma
- test-availability.ts
- getCurrentAdmin
- availability-types.ts
- Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual.
- [bookingId]/status/route.ts
- button.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 56 edges
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
- `SummaryMetric()` --calls--> `cn()`  [EXTRACTED]
  components/admin/availability-date-planner.tsx → lib/utils.ts
- `PortalLayer()` --calls--> `cn()`  [EXTRACTED]
  components/portal-hero-visual.tsx → lib/utils.ts
- `PortalSvg()` --calls--> `cn()`  [EXTRACTED]
  components/portal-hero-visual.tsx → lib/utils.ts
- `PortalLabel()` --calls--> `cn()`  [EXTRACTED]
  components/portal-hero-visual.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (63 total, 11 thin omitted)

### Community 0 - "admin-data.ts"
Cohesion: 0.07
Nodes (42): AdminListFilters, AdminPaginatedList, AdvisoryBookingListItem, AdvisoryBookingListResult, bookingActiveStatuses, buildBookingWhere(), buildContactWhere(), buildDateBoundary() (+34 more)

### Community 1 - "advisory-booking-form.tsx"
Cohesion: 0.06
Nodes (61): POST(), GET(), GET(), POST(), POST(), AdvisoryBookingForm(), handleSubmit(), loadAvailability() (+53 more)

### Community 2 - "calendar-adapter.ts"
Cohesion: 0.17
Nodes (14): BusyInterval, CalendarBookingInput, CalendarBookingRecord, buildCalendarRecord(), buildDescription(), CalendarAdapter, GoogleCalendarAdapter, GoogleCalendarEventPayload (+6 more)

### Community 3 - "availability-service.ts"
Cohesion: 0.14
Nodes (32): getWeekday(), listDateRange(), POST(), redirectBack(), replaceDateException(), activeBookingStatuses, addMinutesToAvailabilityTime(), buildAvailabilityRangesFromTimes() (+24 more)

### Community 4 - "events.ts"
Cohesion: 0.12
Nodes (24): base64Url(), buildServiceAccountJwt(), getCalendarRuntimeConfig(), getGoogleAccessToken(), getGoogleCalendarCredentials(), googleCalendarScopes, GoogleServiceAccountCredentials, normalizePrivateKey() (+16 more)

### Community 5 - "db.ts"
Cohesion: 0.06
Nodes (42): createPrismaClient(), globalForPrisma, buildMysqlPoolConfig(), getMysqlConnectionSummary(), isMysqlSslEnabled(), normalizePem(), readBooleanEnv(), shouldUseMysqlPoolConfig() (+34 more)

### Community 6 - "mailer.ts"
Cohesion: 0.23
Nodes (19): buildFromHeader(), createTransporter(), getAdminNotificationDestination(), getMissingSmtpEnv(), getSmtpConfig(), getSmtpPassword(), isPlaceholderValue(), isSmtpConfigured() (+11 more)

### Community 7 - "cn"
Cohesion: 0.10
Nodes (23): AdminPagination(), AdminPaginationProps, AdminShell(), AdminShellProps, getCurrentSection(), navigationItems, AdminSummaryTile(), allNodes (+15 more)

### Community 8 - "reveal.tsx"
Cohesion: 0.09
Nodes (26): afterBooking, bookingHighlights, metadata, metadata, preparedFlow, differentiators, metadata, philosophy (+18 more)

### Community 9 - "config/site.ts"
Cohesion: 0.09
Nodes (27): metadata, viewport, metadata, dataCategories, intendedPurposes, metadata, pendingItems, robots() (+19 more)

### Community 10 - "availability-date-planner.tsx"
Cohesion: 0.08
Nodes (28): AdminAvailabilityPage(), dynamic, metadata, addMonths(), allPlannerWeekdays, AvailabilityDatePlanner(), selectDate(), useVisibleMonthAsPlanRange() (+20 more)

### Community 11 - "site-action.tsx"
Cohesion: 0.11
Nodes (18): metadata, HomeApproach(), steps, benefits, HomeBenefits(), HomeCallToAction(), HomeHero(), HomeProjects() (+10 more)

### Community 12 - "package.json"
Cohesion: 0.08
Nodes (25): name, packageManager, private, version, @base-ui/react, clsx, eslint, eslint-config-next (+17 more)

### Community 13 - "form-delivery.ts"
Cohesion: 0.17
Nodes (25): integrationEnvConfig, buildContactEmailText(), buildDiagnosticEmailText(), buildFromHeader(), deliverContactSubmission(), deliverDiagnosticSubmission(), getAdminNotificationDestination(), getAdminNotificationDestinationLabel() (+17 more)

### Community 14 - "resend-adapter.ts"
Cohesion: 0.17
Nodes (16): BookingEmailInput, buildCancellation(), buildCompanyNotification(), buildCustomerConfirmation(), EmailDeliveryResult, getAdminEmail(), getEmailFrom(), getReplyTo() (+8 more)

### Community 15 - "site-shell.tsx"
Cohesion: 0.19
Nodes (19): ContactChannel, ContactPage(), metadata, ServicesPage(), FloatingLink, FloatingSocialButtons(), InstagramIcon(), QuickLink (+11 more)

### Community 16 - "components.json"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 17 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, build, db:check, db:generate, db:migrate, db:migrate:deploy, db:prod:deploy, db:prod:resolve (+11 more)

### Community 18 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 19 - "email-delivery.ts"
Cohesion: 0.09
Nodes (15): enqueueDiagnosticEmailDeliveries(), cleanEntity(), CreateEmailDeliveryInput, EmailDeliveryRepository, EmailDeliveryService, emailDeliveryStatuses, EmailMessage, EmailProvider (+7 more)

### Community 20 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 21 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @base-ui/react, class-variance-authority, clsx, dotenv, lucide-react, mariadb, next (+8 more)

### Community 22 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, esbuild, eslint, eslint-config-next, @eslint/eslintrc, postcss, prisma, shadcn (+8 more)

### Community 23 - "advisory-booking-service.ts"
Cohesion: 0.22
Nodes (17): buildConfirmation(), buildDateLabel(), buildTimeLabel(), enqueueBookingEmailDeliveries(), joinIssues(), loadExistingBooking(), resolveDeliveryStatus(), sanitizeAdvisoryBookingData() (+9 more)

### Community 24 - "LogoLoop.jsx"
Cohesion: 0.48
Nodes (6): ANIMATION_CONFIG, LogoLoop, toCssLength(), useAnimationLoop(), useImageLoader(), useResizeObserver()

### Community 25 - "admin-auth.ts"
Cohesion: 0.18
Nodes (18): POST(), ADMIN_ROLE_PERMISSIONS, AdminPermissionKey, authenticateAdmin(), AuthenticatedAdmin, clearAdminSessionCookie(), findAuthenticatedAdminByToken(), getAuthSecret() (+10 more)

### Community 26 - "buildAdminForbiddenResponse"
Cohesion: 0.22
Nodes (19): POST(), POST(), POST(), POST(), POST(), POST(), POST(), applyAdminSessionCookie() (+11 more)

### Community 27 - "[bookingId]/page.tsx"
Cohesion: 0.05
Nodes (77): AdminDiagnosticDetailPage(), DiagnosticDetailPageProps, dynamic, metadata, AdminDiagnosticosPage(), buildMonthRange(), DiagnosticosPageProps, dynamic (+69 more)

### Community 28 - "overrides"
Cohesion: 0.33
Nodes (9): overrides, browserslist, deepmerge-ts, fast-uri, hono, mariadb, mysql2, pnpm (+1 more)

### Community 29 - "portal-hero-visual.tsx"
Cohesion: 0.13
Nodes (14): allNodes, CrystalColumnProps, leftNodes, PortalHeroVisual(), handlePointerMove(), queueParallax(), resetPointer(), PortalLabel() (+6 more)

### Community 30 - "sanitizeInline"
Cohesion: 0.27
Nodes (13): sanitizeContactFormData(), sanitizeDiagnosticFormData(), getRequestMetadata(), readClientAddress(), RequestMetadata, safeHeaderValue(), hashPassword(), hashValue() (+5 more)

### Community 31 - "next.config.mjs"
Cohesion: 0.40
Nodes (3): contentSecurityPolicy, nextConfig, securityHeaders

### Community 32 - "contact-service.ts"
Cohesion: 0.32
Nodes (13): buildClientEmail(), buildInternalEmail(), findRecentDuplicateContact(), SubmissionResponse, submitContactForm(), buildClientEmail(), buildInternalEmail(), buildEmailLayout() (+5 more)

### Community 33 - "run-ts.mjs"
Cohesion: 0.50
Nodes (3): esbuild, entryPoint, outfile

### Community 39 - "Konamy Systems · Producción 1.0"
Cohesion: 0.13
Nodes (14): Checklist de despliegue, Comportamiento actual esperado, Comportamiento SEO mientras faltan datos reales, Contacto por correo, Datos todavía pendientes, Diagnóstico por correo y n8n, Errores controlados y seguridad, Google Calendar y Google Meet (+6 more)

### Community 40 - "use-cinematic-page-controller.ts"
Cohesion: 0.16
Nodes (20): CinematicLanding(), CinematicLandingProps, CinematicPage(), CinematicPageProps, clamp(), seekVideo(), smoothstep(), CinematicControllerRefs (+12 more)

### Community 41 - "hasAdminPermission"
Cohesion: 0.42
Nodes (8): GET(), GET(), hasAdminPermission(), recordAdminAuditLog(), escapeCsvCell(), exportContactSubmissions(), exportDiagnosticSubmissions(), serializeCsv()

### Community 42 - "email-templates.ts"
Cohesion: 0.33
Nodes (11): bookingTemplate(), BookingTemplateData, cleanLine(), diagnosticTemplate(), DiagnosticTemplateData, EmailTemplateInput, escapeHtml(), layout() (+3 more)

### Community 43 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 44 - "diagnostic-service.ts"
Cohesion: 0.35
Nodes (8): findRecentDuplicateDiagnostic(), SubmissionResponse, submitDiagnosticForm(), wantsMeetingToBoolean(), isDiagnosticWebhookConfigured(), sendDiagnosticWebhook(), buildDiagnosticSummary(), DiagnosticFormData

### Community 46 - "(panel)/layout.tsx"
Cohesion: 0.40
Nodes (5): AdminPanelLayout(), dynamic, metadata, requireAdminUser(), adminRoleLabels

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

### Community 57 - "test-availability.ts"
Cohesion: 0.20
Nodes (9): disconnectDb(), blockedDate, exactDate, restoreDate, sourceDate, specialDate, targetDate, testDate (+1 more)

### Community 58 - "getCurrentAdmin"
Cohesion: 0.43
Nodes (7): AdminLoginPage(), LoginPageProps, metadata, readParam(), getAdminLoginErrorMessage(), getAdminRuntimeConfigError(), getCurrentAdmin()

### Community 59 - "availability-types.ts"
Cohesion: 0.25
Nodes (7): advisoryTimezone, advisoryTimezoneLabel, advisoryUtcOffset, AvailabilityRulesSnapshot, AvailabilitySlot, TimeRange, @prisma/client

### Community 60 - "Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Locate the landing hierarchy, cinematic integration points, LogoLoop, and the preserved iceberg visual., Source Nodes

### Community 61 - "[bookingId]/status/route.ts"
Cohesion: 0.67
Nodes (3): POST(), shouldReleaseBookingSlot(), updateAdvisoryBookingStatus()

### Community 62 - "button.tsx"
Cohesion: 0.67
Nodes (3): Button(), buttonVariants, class-variance-authority

## Knowledge Gaps
- **387 isolated node(s):** `dynamic`, `dynamic`, `dynamic`, `metadata`, `DiagnosticDetailPageProps` (+382 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 458 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `cn` to `advisory-booking-form.tsx`, `use-cinematic-page-controller.ts`, `reveal.tsx`, `availability-date-planner.tsx`, `site-action.tsx`, `package.json`, `(panel)/layout.tsx`, `site-shell.tsx`, `LogoLoop.jsx`, `[bookingId]/page.tsx`, `portal-hero-visual.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `availability-types.ts` to `admin-data.ts`, `contact-service.ts`, `availability-service.ts`, `db.ts`, `email-templates.ts`, `diagnostic-service.ts`, `package.json`, `resend-adapter.ts`, `email-delivery.ts`, `advisory-booking-service.ts`, `admin-auth.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `siteConfig` connect `config/site.ts` to `admin-data.ts`, `advisory-booking-form.tsx`, `calendar-adapter.ts`, `availability-service.ts`, `contact-service.ts`, `events.ts`, `mailer.ts`, `cn`, `reveal.tsx`, `site-action.tsx`, `diagnostic-service.ts`, `form-delivery.ts`, `site-shell.tsx`, `advisory-booking-service.ts`, `[bookingId]/page.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `dynamic`, `dynamic`, `dynamic` to the rest of the system?**
  _387 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin-data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0664451827242525 - nodes in this community are weakly interconnected._
- **Should `advisory-booking-form.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05777345017851347 - nodes in this community are weakly interconnected._
- **Should `availability-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13949579831932774 - nodes in this community are weakly interconnected._