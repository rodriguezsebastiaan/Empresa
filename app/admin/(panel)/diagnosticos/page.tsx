import Link from 'next/link'
import { Download, Mail, MessageSquare, Phone } from 'lucide-react'
import {
  addDaysToDateValue,
  getTodayInAdvisoryZone,
} from '@/lib/advisory-time'
import { AdminPagination } from '@/components/admin/admin-pagination'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import {
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
  const selectedId = filters.id || list.items[0]?.id || ''
  const detail = await getDiagnosticSubmissionDetail(selectedId)
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
  const returnTo = detail ? buildPageHref(filters, { id: detail.id }) : buildPageHref(filters)

  const today = getTodayInAdvisoryZone()
  const yesterday = addDaysToDateValue(today, -1)
  const lastSevenDays = addDaysToDateValue(today, -6)
  const thisMonth = buildMonthRange(today)

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/70 bg-background/50 p-6 backdrop-blur-sm lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.32em] text-primary">DIAGNOSTICOS</p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground">Diagnosticos empresariales</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Revise primero por fecha, lea las respuestas ordenadas por bloques y mantenga el caso
              conectado con notas internas, cambios de estado y actividad relacionada del mismo
              prospecto.
            </p>
          </div>
          <Link
            href={exportHref}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
          >
            <Download className="size-4" />
            EXPORTAR CSV
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminSummaryTile
          label="TOTAL EN RANGO"
          value={list.stats.total}
          hint="Diagnosticos dentro del rango y la busqueda actual."
          tone="default"
        />
        <AdminSummaryTile
          label="PENDIENTES"
          value={list.stats.pending}
          hint="Nuevos diagnosticos por revisar."
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

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(24rem,0.85fr)]">
        <div className={panelClassName}>
          <div className="flex flex-wrap items-center gap-2">
            <AdminQuickFilterLink
              href={buildPageHref(filters, { preset: 'today', from: today, to: today, page: 1, id: '' })}
              label="HOY"
              active={filters.preset === 'today'}
            />
            <AdminQuickFilterLink
              href={buildPageHref(filters, { preset: 'yesterday', from: yesterday, to: yesterday, page: 1, id: '' })}
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

          <form className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]" method="get">
            <div>
              <label className="block">
                <span className="text-xs font-semibold tracking-[0.16em] text-primary">BUSQUEDA</span>
                <input
                  name="q"
                  defaultValue={filters.q}
                  className={fieldClassName}
                  placeholder="Empresa, contacto, sector, correo..."
                />
              </label>
            </div>

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

            <div className="flex flex-wrap items-end gap-3 lg:col-span-4">
              <button
                type="submit"
                className="inline-flex items-center rounded-xl bg-primary px-4 py-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90"
              >
                FILTRAR
              </button>
              <Link
                href="/admin/diagnosticos"
                className="inline-flex items-center rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
              >
                LIMPIAR
              </Link>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {list.total} resultado{list.total === 1 ? '' : 's'} con los filtros aplicados.
            </p>
            <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
              Los contadores superiores ignoran el estado para mostrar la carga del rango.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {list.items.length > 0 ? (
              list.items.map((item) => (
                <Link
                  key={item.id}
                  href={`${buildPageHref(filters, { id: item.id })}#detalle`}
                  className={`block rounded-2xl border p-4 transition-colors ${
                    selectedId === item.id
                      ? 'border-primary/35 bg-primary/8'
                      : 'border-border/70 bg-background/35 hover:border-primary/25'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.company}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.name}</p>
                    </div>
                    <AdminStatusBadge status={item.status} compact />
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">{item.summary}</p>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        SECTOR
                      </p>
                      <p className="mt-1 text-muted-foreground">{item.sector}</p>
                    </div>
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        CIUDAD
                      </p>
                      <p className="mt-1 text-muted-foreground">{item.city}</p>
                    </div>
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        CORREO
                      </p>
                      <p className="mt-1 text-muted-foreground">{item.email}</p>
                    </div>
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        FECHA
                      </p>
                      <p className="mt-1 text-muted-foreground">{formatAdminDateTime(item.createdAt)}</p>
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
                </Link>
              ))
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
        </div>

        <aside id="detalle" className={`${panelClassName} h-fit xl:sticky xl:top-6`}>
          {detail ? (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.32em] text-primary">DETALLE Y ACCIONES</p>
                <h2 className="mt-4 text-2xl font-semibold text-foreground">{detail.company}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {detail.name} - {detail.role}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <AdminStatusBadge status={detail.status} />
                  <AdminStatusBadge status={detail.internalEmailStatus} compact />
                  <AdminStatusBadge status={detail.clientEmailStatus} compact />
                  <AdminStatusBadge status={detail.webhookStatus} compact />
                </div>
              </div>

              <div className="grid gap-3">
                <AdminInfoCard label="RESUMEN EJECUTIVO">
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.summary}</p>
                </AdminInfoCard>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInfoCard label="SECTOR">{detail.sector}</AdminInfoCard>
                <AdminInfoCard label="CIUDAD">{detail.city}</AdminInfoCard>
                <AdminInfoCard label="EQUIPO">{detail.teamSize}</AdminInfoCard>
                <AdminInfoCard
                  label="PREFERENCIA DE CONTACTO"
                  hint={detail.wantsMeeting ? 'Solicito avanzar a una reunion.' : 'No pidio reunion por ahora.'}
                >
                  {detail.contactPreference}
                </AdminInfoCard>
              </div>

              <div className="grid gap-3">
                <AdminInfoCard label="PROCESOS ACTUALES">
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.processes}</p>
                </AdminInfoCard>
                <AdminInfoCard label="OPERACION ACTUAL">
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.currentProcess}</p>
                </AdminInfoCard>
                <AdminInfoCard label="HERRAMIENTAS Y SISTEMAS">
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.tools}</p>
                </AdminInfoCard>
                <AdminInfoCard label="TAREAS REPETITIVAS">
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.repetitiveTasks}</p>
                </AdminInfoCard>
              </div>

              <div className="grid gap-3">
                <AdminInfoCard label="PROBLEMA PRINCIPAL">
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.mainProblem}</p>
                </AdminInfoCard>
                <AdminInfoCard label="RESULTADO ESPERADO">
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.expectedResult}</p>
                </AdminInfoCard>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInfoCard label="CORREO">
                  <a
                    href={buildAdminMailto(detail.email, `Seguimiento de diagnostico ${detail.company}`)}
                    className="inline-flex items-center gap-2 hover:text-primary"
                  >
                    <Mail className="size-4" />
                    {detail.email}
                  </a>
                </AdminInfoCard>
                <AdminInfoCard label="TELEFONO">
                  <a href={buildAdminPhone(detail.phone)} className="inline-flex items-center gap-2 hover:text-primary">
                    <Phone className="size-4" />
                    {detail.phone}
                  </a>
                </AdminInfoCard>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInfoCard label="WHATSAPP">
                  <a
                    href={buildAdminWhatsApp(detail.phone, `Hola ${detail.name}, gracias por completar el diagnostico de Konamy Systems.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-primary"
                  >
                    <MessageSquare className="size-4" />
                    Abrir conversacion
                  </a>
                </AdminInfoCard>
                <AdminInfoCard label="FECHA DE INGRESO">
                  <p>{formatAdminDateTime(detail.createdAt)}</p>
                </AdminInfoCard>
              </div>

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

              <AdminRelatedActivity items={relatedActivity} />

              <AdminTechnicalDetails
                items={[
                  { label: 'Origen', value: detail.requestOrigin ?? 'Sin dato' },
                  { label: 'Ruta', value: detail.requestPath ?? 'Sin dato' },
                  { label: 'Referer', value: detail.referer ?? 'Sin dato' },
                  { label: 'User-Agent', value: detail.userAgent ?? 'Sin dato' },
                  { label: 'IP Hash', value: detail.ipHash ?? 'Sin dato' },
                ]}
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <form
                  action={`/admin/api/diagnosticos/${detail.id}/status`}
                  method="post"
                  className="space-y-4 rounded-2xl border border-border/70 bg-background/35 p-4"
                >
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-primary">CAMBIAR ESTADO</p>
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

                <form
                  action={`/admin/api/diagnosticos/${detail.id}/notes`}
                  method="post"
                  className="space-y-4 rounded-2xl border border-border/70 bg-background/35 p-4"
                >
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-primary">AGREGAR NOTA INTERNA</p>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium text-foreground">Nota</span>
                    <textarea name="note" required className={`${fieldClassName} min-h-[8rem] resize-y`} />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-foreground transition-colors hover:border-primary/35 hover:text-primary"
                  >
                    GUARDAR NOTA
                  </button>
                </form>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <AdminNotesSection
                  items={detail.notes}
                  emptyLabel="Todavia no hay notas internas para este diagnostico."
                />

                <AdminHistorySection
                  items={detail.statusHistory}
                  emptyLabel="Todavia no hay cambios de estado registrados."
                />
              </div>
            </div>
          ) : (
            <AdminEmptyState>Seleccione un diagnostico para ver el detalle completo.</AdminEmptyState>
          )}
        </aside>
      </section>
    </div>
  )
}
