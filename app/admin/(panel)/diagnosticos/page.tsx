import Link from 'next/link'
import { Download } from 'lucide-react'
import { AdminDetailDrawer } from '@/components/admin/admin-detail-drawer'
import { AdminPagination } from '@/components/admin/admin-pagination'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import {
  AdminCollapsiblePanel,
  AdminEmptyState,
  AdminHistorySection,
  AdminInfoCard,
  AdminNotesSection,
  AdminQuickFilterLink,
  AdminRelatedActivity,
  AdminSummaryTile,
  AdminTechnicalDetails,
} from '@/components/admin/admin-ui'
import { fieldClassName, panelClassName } from '@/components/form-controls'
import { addDaysToDateValue, getTodayInAdvisoryZone } from '@/lib/advisory-time'
import {
  diagnosticStatusOptions,
  formatAdminDateTime,
  getDiagnosticSubmissionDetail,
  getRelatedActivityForRecord,
  getStatusLabel,
  listDiagnosticSubmissions,
  parseAdminListFilters,
} from '@/lib/admin-data'
import { buildAdminMailto, buildAdminPhone, buildAdminWhatsApp } from '@/lib/admin-links'

export const dynamic = 'force-dynamic'

type DiagnosticosPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function buildMonthRange(dateValue: string) {
  const [year, month] = dateValue.split('-')
  const monthIndex = Number(month)
  const lastDay = new Date(Date.UTC(Number(year), monthIndex, 0)).getUTCDate()

  return {
    from: `${year}-${month}-01`,
    to: `${year}-${month}-${lastDay.toString().padStart(2, '0')}`,
  }
}

function buildPageHref(
  filters: ReturnType<typeof parseAdminListFilters>,
  overrides: Partial<ReturnType<typeof parseAdminListFilters>> = {},
) {
  const params = new URLSearchParams()
  const nextFilters = {
    ...filters,
    ...overrides,
  }

  if (nextFilters.q) params.set('q', nextFilters.q)
  if (nextFilters.status) params.set('status', nextFilters.status)
  if (nextFilters.from) params.set('from', nextFilters.from)
  if (nextFilters.to) params.set('to', nextFilters.to)
  if (nextFilters.preset) params.set('preset', nextFilters.preset)
  if (nextFilters.page > 1) params.set('page', String(nextFilters.page))
  if (nextFilters.id) params.set('id', nextFilters.id)

  const query = params.toString()
  return `/admin/diagnosticos${query ? `?${query}` : ''}`
}

export default async function AdminDiagnosticosPage({ searchParams }: DiagnosticosPageProps) {
  const filters = parseAdminListFilters(await searchParams)
  const list = await listDiagnosticSubmissions(filters)
  const detail = filters.id ? await getDiagnosticSubmissionDetail(filters.id) : null
  const relatedActivity = detail
    ? await getRelatedActivityForRecord({
        entity: 'diagnosticos',
        id: detail.id,
        emailNormalized: detail.emailNormalized,
        phone: detail.phone,
        company: detail.company,
      })
    : []
  const exportHref = `/admin/api/diagnosticos/export${buildPageHref(filters).replace('/admin/diagnosticos', '')}`
  const closeHref = buildPageHref(filters, { id: '' })
  const returnTo = detail ? buildPageHref(filters, { id: detail.id }) : buildPageHref(filters)

  const today = getTodayInAdvisoryZone()
  const yesterday = addDaysToDateValue(today, -1)
  const lastSevenDays = addDaysToDateValue(today, -6)
  const thisMonth = buildMonthRange(today)

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/70 bg-background/50 p-6 backdrop-blur-sm lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.32em] text-primary">DIAGNOSTICOS</p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground">
              Evaluaciones empresariales
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Priorice por fecha, abra cada empresa en un drawer lateral y revise el contexto
              operativo en bloques mas faciles de leer, sin comprimir el listado principal.
            </p>
          </div>

          <Link
            href={exportHref}
            scroll={false}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
          >
            <Download className="size-4" />
            EXPORTAR CSV
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminSummaryTile
          label="TOTAL"
          value={list.stats.total}
          hint="Diagnosticos dentro del rango actual."
          tone="default"
        />
        <AdminSummaryTile
          label="PENDIENTES"
          value={list.stats.pending}
          hint="Ingresos nuevos pendientes por revisar."
          tone="primary"
        />
        <AdminSummaryTile
          label="EN PROCESO"
          value={list.stats.inProcess}
          hint="Casos en analisis, contacto o propuesta."
          tone="accent"
        />
        <AdminSummaryTile
          label="FINALIZADOS"
          value={list.stats.finalized}
          hint="Casos ganados o descartados."
          tone="success"
        />
      </section>

      <section className={panelClassName}>
        <div className="flex flex-wrap gap-2">
          <AdminQuickFilterLink
            href={buildPageHref(filters, { preset: 'today', from: today, to: today, page: 1, id: '' })}
            label="HOY"
            active={filters.preset === 'today'}
          />
          <AdminQuickFilterLink
            href={buildPageHref(filters, {
              preset: 'yesterday',
              from: yesterday,
              to: yesterday,
              page: 1,
              id: '',
            })}
            label="AYER"
            active={filters.preset === 'yesterday'}
          />
          <AdminQuickFilterLink
            href={buildPageHref(filters, {
              preset: 'last-7-days',
              from: lastSevenDays,
              to: today,
              page: 1,
              id: '',
            })}
            label="ULTIMOS 7 DIAS"
            active={filters.preset === 'last-7-days'}
          />
          <AdminQuickFilterLink
            href={buildPageHref(filters, {
              preset: 'this-month',
              from: thisMonth.from,
              to: thisMonth.to,
              page: 1,
              id: '',
            })}
            label="ESTE MES"
            active={filters.preset === 'this-month'}
          />
          <AdminQuickFilterLink
            href="/admin/diagnosticos"
            label="TODOS"
            active={!filters.preset && !filters.from && !filters.to && !filters.q && !filters.status}
          />
        </div>

        <details className="mt-4 rounded-2xl border border-border/70 bg-background/30 p-4 lg:hidden">
          <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
            FILTROS
          </summary>
          <form className="mt-4 grid gap-4" method="get">
            <label className="block">
              <span className="text-xs font-semibold tracking-[0.16em] text-primary">BUSQUEDA</span>
              <input
                name="q"
                defaultValue={filters.q}
                className={fieldClassName}
                placeholder="Empresa, contacto, sector, correo..."
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-[0.16em] text-primary">ESTADO</span>
              <select name="status" defaultValue={filters.status} className={fieldClassName}>
                <option value="">Todos</option>
                {diagnosticStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold tracking-[0.16em] text-primary">DESDE</span>
                <input name="from" type="date" defaultValue={filters.from} className={fieldClassName} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold tracking-[0.16em] text-primary">HASTA</span>
                <input name="to" type="date" defaultValue={filters.to} className={fieldClassName} />
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center rounded-xl bg-primary px-4 py-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90"
              >
                FILTRAR
              </button>
              <Link
                href="/admin/diagnosticos"
                scroll={false}
                className="inline-flex items-center rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
              >
                LIMPIAR
              </Link>
            </div>
          </form>
        </details>

        <form
          className="mt-4 hidden gap-4 lg:grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto]"
          method="get"
        >
          <label className="block">
            <span className="text-xs font-semibold tracking-[0.16em] text-primary">BUSQUEDA</span>
            <input
              name="q"
              defaultValue={filters.q}
              className={fieldClassName}
              placeholder="Empresa, contacto, sector, correo..."
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold tracking-[0.16em] text-primary">ESTADO</span>
            <select name="status" defaultValue={filters.status} className={fieldClassName}>
              <option value="">Todos</option>
              {diagnosticStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold tracking-[0.16em] text-primary">DESDE</span>
            <input name="from" type="date" defaultValue={filters.from} className={fieldClassName} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold tracking-[0.16em] text-primary">HASTA</span>
            <input name="to" type="date" defaultValue={filters.to} className={fieldClassName} />
          </label>
          <button
            type="submit"
            className="mt-[1.65rem] inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90"
          >
            FILTRAR
          </button>
          <Link
            href="/admin/diagnosticos"
            scroll={false}
            className="mt-[1.65rem] inline-flex items-center justify-center rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
          >
            LIMPIAR
          </Link>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-5">
          <p className="text-sm text-muted-foreground">
            {list.total} resultado{list.total === 1 ? '' : 's'} con los filtros aplicados.
          </p>
          <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground">
            El drawer conserva notas, historial y trazabilidad sin reducir el ancho util.
          </p>
        </div>

        <div className="mt-5 hidden overflow-hidden rounded-[1.45rem] border border-border/70 lg:block">
          <table className="min-w-full table-fixed">
            <thead className="bg-background/65 text-left text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">EMPRESA</th>
                <th className="px-4 py-3">CONTACTO</th>
                <th className="px-4 py-3">SECTOR</th>
                <th className="px-4 py-3">RESUMEN</th>
                <th className="px-4 py-3">FECHA</th>
                <th className="px-4 py-3">ESTADO</th>
                <th className="px-4 py-3">ENTREGA</th>
                <th className="px-4 py-3 text-right">ACCION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-background/22">
              {list.items.length > 0 ? (
                list.items.map((item) => {
                  const selected = detail?.id === item.id

                  return (
                    <tr
                      key={item.id}
                      className={selected ? 'bg-primary/7' : 'transition-colors hover:bg-background/36'}
                    >
                      <td className="px-4 py-4 align-top">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{item.company}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.wantsMeeting ? (
                              <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-primary">
                                QUIERE REUNION
                              </span>
                            ) : null}
                            <span className="rounded-full border border-border/70 bg-background/35 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                              {item.city}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="min-w-0 space-y-2">
                          <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                          <p className="truncate text-sm text-muted-foreground">{item.email}</p>
                          <p className="truncate text-sm text-muted-foreground">{item.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-muted-foreground">
                        {item.sector}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <p className="line-clamp-3 text-sm text-muted-foreground">{item.summary}</p>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-muted-foreground">
                        {formatAdminDateTime(item.createdAt)}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <AdminStatusBadge status={item.status} compact />
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <AdminStatusBadge status={item.internalEmailStatus} compact />
                          <AdminStatusBadge status={item.clientEmailStatus} compact />
                          <AdminStatusBadge status={item.webhookStatus} compact />
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-right">
                        <Link
                          href={buildPageHref(filters, { id: item.id })}
                          scroll={false}
                          className="inline-flex items-center rounded-full border border-border/70 px-3 py-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
                        >
                          VER DETALLE
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-6">
                    <AdminEmptyState>No se encontraron diagnosticos con esos filtros.</AdminEmptyState>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-3 lg:hidden">
          {list.items.length > 0 ? (
            list.items.map((item) => {
              const selected = detail?.id === item.id

              return (
                <article
                  key={item.id}
                  className={`rounded-2xl border p-4 ${
                    selected ? 'border-primary/35 bg-primary/8' : 'border-border/70 bg-background/28'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{item.company}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.name}</p>
                    </div>
                    <AdminStatusBadge status={item.status} compact />
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{item.summary}</p>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        PERFIL
                      </p>
                      <p className="mt-1 text-foreground">{item.sector}</p>
                      <p className="mt-1 text-muted-foreground">{item.city}</p>
                    </div>
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        CONTACTO
                      </p>
                      <p className="mt-1 truncate text-muted-foreground">{item.email}</p>
                      <p className="mt-1 text-muted-foreground">{item.phone}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <AdminStatusBadge status={item.internalEmailStatus} compact />
                    <AdminStatusBadge status={item.clientEmailStatus} compact />
                    <AdminStatusBadge status={item.webhookStatus} compact />
                    {item.wantsMeeting ? (
                      <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-primary">
                        QUIERE REUNION
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <Link
                      href={buildPageHref(filters, { id: item.id })}
                      scroll={false}
                      className="inline-flex items-center rounded-full border border-border/70 px-3 py-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
                    >
                      VER DETALLE
                    </Link>
                  </div>
                </article>
              )
            })
          ) : (
            <AdminEmptyState>No se encontraron diagnosticos con esos filtros.</AdminEmptyState>
          )}
        </div>

        <div className="mt-6">
          <AdminPagination
            page={list.page}
            pageCount={list.pageCount}
            buildHref={(page) => buildPageHref(filters, { page, id: '' })}
          />
        </div>
      </section>

      <AdminDetailDrawer
        key={detail?.id ?? 'diagnosticos-drawer-closed'}
        open={Boolean(detail)}
        closeHref={closeHref}
        title={detail?.company ?? ''}
        subtitle={detail ? `${detail.name} - ${detail.role}` : ''}
        badges={
          detail ? (
            <>
              <AdminStatusBadge status={detail.status} />
              <AdminStatusBadge status={detail.internalEmailStatus} compact />
              <AdminStatusBadge status={detail.clientEmailStatus} compact />
              <AdminStatusBadge status={detail.webhookStatus} compact />
              {detail.wantsMeeting ? (
                <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-primary">
                  QUIERE REUNION
                </span>
              ) : null}
            </>
          ) : null
        }
        actions={
          detail
            ? [
                {
                  label: 'ABRIR CORREO',
                  kind: 'link',
                  value: buildAdminMailto(detail.email, `Seguimiento de diagnostico ${detail.company}`),
                  icon: 'mail',
                },
                {
                  label: 'LLAMAR',
                  kind: 'link',
                  value: buildAdminPhone(detail.phone),
                  icon: 'phone',
                },
                {
                  label: 'WHATSAPP',
                  kind: 'link',
                  value: buildAdminWhatsApp(
                    detail.phone,
                    `Hola ${detail.name}, gracias por completar el diagnostico de Konamy Systems.`,
                  ),
                  icon: 'whatsapp',
                  external: true,
                },
                {
                  label: 'COPIAR CORREO',
                  kind: 'copy',
                  value: detail.email,
                  icon: 'copy',
                },
              ]
            : []
        }
        tabs={
          detail
            ? [
                {
                  id: 'resumen',
                  label: 'RESUMEN',
                  content: (
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <AdminInfoCard label="CONTACTO">{detail.name}</AdminInfoCard>
                        <AdminInfoCard label="EMPRESA">{detail.company}</AdminInfoCard>
                        <AdminInfoCard label="CARGO">{detail.role}</AdminInfoCard>
                        <AdminInfoCard label="SECTOR">{detail.sector}</AdminInfoCard>
                        <AdminInfoCard label="CIUDAD">{detail.city}</AdminInfoCard>
                        <AdminInfoCard label="EQUIPO">{detail.teamSize}</AdminInfoCard>
                        <AdminInfoCard
                          label="PREFERENCIA"
                          hint={
                            detail.wantsMeeting
                              ? 'Solicito avanzar a una reunion.'
                              : 'No pidio reunion por ahora.'
                          }
                          className="sm:col-span-2"
                        >
                          {detail.contactPreference}
                        </AdminInfoCard>
                      </div>

                      <AdminInfoCard label="RESUMEN EJECUTIVO">
                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                          {detail.summary}
                        </p>
                      </AdminInfoCard>

                      <AdminInfoCard label="PROBLEMA PRINCIPAL">
                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                          {detail.mainProblem}
                        </p>
                      </AdminInfoCard>

                      <AdminInfoCard label="RESULTADO ESPERADO">
                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                          {detail.expectedResult}
                        </p>
                      </AdminInfoCard>
                    </div>
                  ),
                },
                {
                  id: 'operacion',
                  label: 'OPERACION',
                  content: (
                    <div className="space-y-4">
                      <AdminCollapsiblePanel
                        title="PROCESOS ACTUALES"
                        summary="Bloques y flujos que la empresa reporta hoy."
                      >
                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                          {detail.processes}
                        </p>
                      </AdminCollapsiblePanel>

                      <AdminCollapsiblePanel
                        title="OPERACION ACTUAL"
                        summary="Como se ejecuta hoy el proceso principal."
                        defaultOpen={false}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                          {detail.currentProcess}
                        </p>
                      </AdminCollapsiblePanel>

                      <AdminCollapsiblePanel
                        title="HERRAMIENTAS Y SISTEMAS"
                        summary="Software, hojas o plataformas en uso."
                        defaultOpen={false}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                          {detail.tools}
                        </p>
                      </AdminCollapsiblePanel>

                      <AdminCollapsiblePanel
                        title="TAREAS REPETITIVAS"
                        summary="Actividad manual o repetitiva detectada."
                        defaultOpen={false}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                          {detail.repetitiveTasks}
                        </p>
                      </AdminCollapsiblePanel>
                    </div>
                  ),
                },
                {
                  id: 'seguimiento',
                  label: 'SEGUIMIENTO',
                  content: (
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <AdminInfoCard
                          label="PRIVACIDAD"
                          hint={`Aceptada el ${formatAdminDateTime(detail.privacyAcceptedAt)}`}
                        >
                          {detail.privacyPolicyVersion}
                        </AdminInfoCard>
                        <AdminInfoCard label="ENTREGA">
                          <div className="flex flex-wrap gap-2">
                            <AdminStatusBadge status={detail.internalEmailStatus} compact />
                            <AdminStatusBadge status={detail.clientEmailStatus} compact />
                            <AdminStatusBadge status={detail.webhookStatus} compact />
                          </div>
                          {detail.lastDeliveryError ? (
                            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                              {detail.lastDeliveryError}
                            </p>
                          ) : null}
                        </AdminInfoCard>
                      </div>

                      <form
                        action={`/admin/api/diagnosticos/${detail.id}/status`}
                        method="post"
                        className="space-y-4 rounded-2xl border border-border/70 bg-background/35 p-4"
                      >
                        <input type="hidden" name="returnTo" value={returnTo} />
                        <div>
                          <p className="text-xs font-semibold tracking-[0.18em] text-primary">
                            CAMBIAR ESTADO
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Actualice el avance comercial sin salir del detalle.
                          </p>
                        </div>
                        <label className="block">
                          <span className="text-sm font-medium text-foreground">Nuevo estado</span>
                          <select name="status" defaultValue={detail.status} className={fieldClassName}>
                            {diagnosticStatusOptions.map((status) => (
                              <option key={status} value={status}>
                                {getStatusLabel(status)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-sm font-medium text-foreground">Nota del cambio</span>
                          <textarea name="note" className={`${fieldClassName} min-h-[7rem] resize-y`} />
                        </label>
                        <button
                          type="submit"
                          className="inline-flex items-center rounded-xl bg-primary px-4 py-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90"
                        >
                          GUARDAR ESTADO
                        </button>
                      </form>
                    </div>
                  ),
                },
                {
                  id: 'notas',
                  label: 'NOTAS',
                  content: (
                    <div className="space-y-4">
                      <form
                        action={`/admin/api/diagnosticos/${detail.id}/notes`}
                        method="post"
                        className="space-y-4 rounded-2xl border border-border/70 bg-background/35 p-4"
                      >
                        <input type="hidden" name="returnTo" value={returnTo} />
                        <div>
                          <p className="text-xs font-semibold tracking-[0.18em] text-primary">
                            AGREGAR NOTA INTERNA
                          </p>
                        </div>
                        <label className="block">
                          <span className="text-sm font-medium text-foreground">Nota</span>
                          <textarea
                            name="note"
                            required
                            className={`${fieldClassName} min-h-[8rem] resize-y`}
                          />
                        </label>
                        <button
                          type="submit"
                          className="inline-flex items-center rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-foreground transition-colors hover:border-primary/35 hover:text-primary"
                        >
                          GUARDAR NOTA
                        </button>
                      </form>
                      <AdminNotesSection
                        items={detail.notes}
                        emptyLabel="Todavia no hay notas internas para este diagnostico."
                      />
                    </div>
                  ),
                },
                {
                  id: 'historial',
                  label: 'HISTORIAL',
                  content: (
                    <AdminHistorySection
                      items={detail.statusHistory}
                      emptyLabel="Todavia no hay cambios de estado registrados."
                    />
                  ),
                },
                {
                  id: 'relacionados',
                  label: 'RELACIONADOS',
                  content: <AdminRelatedActivity items={relatedActivity} />,
                },
                {
                  id: 'tecnico',
                  label: 'TECNICO',
                  content: (
                    <AdminTechnicalDetails
                      items={[
                        { label: 'Origen', value: detail.requestOrigin ?? 'Sin dato' },
                        { label: 'Ruta', value: detail.requestPath ?? 'Sin dato' },
                        { label: 'Referer', value: detail.referer ?? 'Sin dato' },
                        { label: 'User-Agent', value: detail.userAgent ?? 'Sin dato' },
                        { label: 'IP Hash', value: detail.ipHash ?? 'Sin dato' },
                      ]}
                    />
                  ),
                },
              ]
            : []
        }
      />
    </div>
  )
}
