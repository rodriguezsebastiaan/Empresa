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
  contactStatusOptions,
  formatAdminDateTime,
  getContactSubmissionDetail,
  getRelatedActivityForRecord,
  getStatusLabel,
  listContactSubmissions,
  parseAdminListFilters,
} from '@/lib/admin-data'
import { buildAdminMailto, buildAdminPhone, buildAdminWhatsApp } from '@/lib/admin-links'

export const dynamic = 'force-dynamic'

type ContactosPageProps = {
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
  return `/admin/contactos${query ? `?${query}` : ''}`
}

export default async function AdminContactosPage({ searchParams }: ContactosPageProps) {
  const filters = parseAdminListFilters(await searchParams)
  const list = await listContactSubmissions(filters)
  const selectedId = filters.id || list.items[0]?.id || ''
  const detail = await getContactSubmissionDetail(selectedId)
  const relatedActivity = detail
    ? await getRelatedActivityForRecord({
        entity: 'contactos',
        id: detail.id,
        emailNormalized: detail.emailNormalized,
        phone: detail.phone,
        company: detail.company,
      })
    : []
  const exportHref = `/admin/api/contactos/export${buildPageHref(filters).replace('/admin/contactos', '')}`
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
            <p className="text-xs font-semibold tracking-[0.32em] text-primary">CONTACTOS</p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground">Pipeline del formulario breve</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Priorice por fecha, busque por empresa o correo y revise el contexto completo del
              prospecto antes de mover el estado. La vista lateral concentra acciones, notas,
              historial y actividad relacionada.
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminSummaryTile
          label="EN RANGO"
          value={list.stats.total}
          hint="Total dentro del rango y busqueda actual."
          tone="default"
        />
        <AdminSummaryTile
          label="PENDIENTES"
          value={list.stats.pending}
          hint="Nuevos ingresos sin gestion."
          tone="primary"
        />
        <AdminSummaryTile
          label="EN REVISION"
          value={list.stats.inReview}
          hint="Prospectos que aun requieren analisis."
          tone="accent"
        />
        <AdminSummaryTile
          label="CONTACTADOS"
          value={list.stats.contacted}
          hint="Seguimientos con primer contacto hecho."
          tone="success"
        />
        <AdminSummaryTile
          label="CERRADOS"
          value={list.stats.closed}
          hint="Entradas archivadas o concluidas."
          tone="warning"
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
              href="/admin/contactos"
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
                  placeholder="Empresa, contacto, correo, asunto..."
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-semibold tracking-[0.16em] text-primary">ESTADO</span>
              <select name="status" defaultValue={filters.status} className={fieldClassName}>
                <option value="">Todos</option>
                {contactStatusOptions.map((status) => (
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
                href="/admin/contactos"
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
              Los contadores de arriba ignoran el estado para mostrar el volumen real del rango.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {list.items.length > 0 ? (
              list.items.map((item) => (
                <Link
                  key={item.id}
                  href={buildPageHref(filters, { id: item.id })}
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

                  <p className="mt-3 text-sm font-medium text-foreground/90">{item.subject}</p>

                  <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <p>{item.email}</p>
                    <p>{item.phone}</p>
                    <p>{formatAdminDateTime(item.createdAt)}</p>
                    <p>
                      Notas {item._count.notes} / Historial {item._count.statusHistory}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <AdminStatusBadge status={item.internalEmailStatus} compact />
                    <AdminStatusBadge status={item.clientEmailStatus} compact />
                  </div>
                </Link>
              ))
            ) : (
              <AdminEmptyState>No se encontraron contactos con esos filtros.</AdminEmptyState>
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

        <aside className={`${panelClassName} h-fit`}>
          {detail ? (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.32em] text-primary">DETALLE</p>
                <h2 className="mt-4 text-2xl font-semibold text-foreground">{detail.company}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{detail.name}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <AdminStatusBadge status={detail.status} />
                  <AdminStatusBadge status={detail.internalEmailStatus} compact />
                  <AdminStatusBadge status={detail.clientEmailStatus} compact />
                </div>
              </div>

              <div className="grid gap-3">
                <AdminInfoCard label="ASUNTO">{detail.subject}</AdminInfoCard>
                <AdminInfoCard label="MENSAJE">
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.message}</p>
                </AdminInfoCard>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInfoCard label="CORREO">
                  <a
                    href={buildAdminMailto(detail.email, `Seguimiento de ${detail.company}`)}
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
                    href={buildAdminWhatsApp(detail.phone, `Hola ${detail.name}, gracias por escribir a Konamy Systems.`)}
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
                  <p>{detail.privacyPolicyVersion}</p>
                </AdminInfoCard>
                <AdminInfoCard label="ENTREGA">
                  <div className="flex flex-wrap gap-2">
                    <AdminStatusBadge status={detail.internalEmailStatus} compact />
                    <AdminStatusBadge status={detail.clientEmailStatus} compact />
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

              <form
                action={`/admin/api/contactos/${detail.id}/status`}
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
                    {contactStatusOptions.map((status) => (
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
                action={`/admin/api/contactos/${detail.id}/notes`}
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

              <AdminNotesSection
                items={detail.notes}
                emptyLabel="Todavia no hay notas internas para este contacto."
              />

              <AdminHistorySection
                items={detail.statusHistory}
                emptyLabel="Todavia no hay cambios de estado registrados."
              />
            </div>
          ) : (
            <AdminEmptyState>Seleccione un contacto para ver el detalle completo.</AdminEmptyState>
          )}
        </aside>
      </section>
    </div>
  )
}
