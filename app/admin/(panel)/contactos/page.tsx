import Link from 'next/link'
import { Download } from 'lucide-react'
import { AdminPagination } from '@/components/admin/admin-pagination'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import { AdminDetailDrawer } from '@/components/admin/admin-detail-drawer'
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
  addDaysToDateValue,
  getTodayInAdvisoryZone,
} from '@/lib/advisory-time'
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
  const detail = filters.id ? await getContactSubmissionDetail(filters.id) : null
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
            <p className="text-xs font-semibold tracking-[0.32em] text-primary">CONTACTOS</p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground">Formularios breves</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Revise ingresos por fecha, mantenga el seguimiento comercial visible y abra cada
              prospecto en un drawer con historial, notas y actividad relacionada sin comprimir el
              listado principal.
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
          hint="Formularios dentro del rango actual."
          tone="default"
        />
        <AdminSummaryTile
          label="PENDIENTES"
          value={list.stats.pending}
          hint="Ingresos nuevos sin gestion."
          tone="primary"
        />
        <AdminSummaryTile
          label="EN PROCESO"
          value={list.stats.inProgress}
          hint="Casos abiertos ya tomados por el equipo."
          tone="accent"
        />
        <AdminSummaryTile
          label="ATENDIDOS"
          value={list.stats.attended}
          hint="Prospectos ya contactados o cerrados."
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
            href="/admin/contactos"
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
                placeholder="Empresa, contacto, correo..."
              />
            </label>
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
                href="/admin/contactos"
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
              placeholder="Empresa, contacto, correo, asunto..."
            />
          </label>
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
          <button
            type="submit"
            className="mt-[1.65rem] inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90"
          >
            FILTRAR
          </button>
          <Link
            href="/admin/contactos"
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
            El estado se mantiene visible en espanol y el detalle se abre sin comprimir el listado.
          </p>
        </div>

        <div className="mt-5 hidden overflow-hidden rounded-[1.45rem] border border-border/70 lg:block">
          <table className="min-w-full table-fixed">
            <thead className="bg-background/65 text-left text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">EMPRESA</th>
                <th className="px-4 py-3">CLIENTE</th>
                <th className="px-4 py-3">CONTACTO</th>
                <th className="px-4 py-3">FECHA</th>
                <th className="px-4 py-3">ESTADO</th>
                <th className="px-4 py-3">SEGUIMIENTO</th>
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
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.subject}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="min-w-0 space-y-2">
                          <p className="truncate text-sm text-foreground">{item.phone}</p>
                          <p className="truncate text-sm text-muted-foreground">{item.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-muted-foreground">
                        {formatAdminDateTime(item.createdAt)}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <AdminStatusBadge status={item.status} compact />
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Notas {item._count.notes} / Historial {item._count.statusHistory}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <AdminStatusBadge status={item.internalEmailStatus} compact />
                            <AdminStatusBadge status={item.clientEmailStatus} compact />
                          </div>
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
                  <td colSpan={7} className="px-4 py-6">
                    <AdminEmptyState>No se encontraron contactos con esos filtros.</AdminEmptyState>
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
                    selected
                      ? 'border-primary/35 bg-primary/8'
                      : 'border-border/70 bg-background/28'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{item.company}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.name}</p>
                    </div>
                    <AdminStatusBadge status={item.status} compact />
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{item.subject}</p>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        CONTACTO
                      </p>
                      <p className="mt-1 text-foreground">{item.phone}</p>
                      <p className="mt-1 truncate text-muted-foreground">{item.email}</p>
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
      </section>

      <AdminDetailDrawer
        key={detail?.id ?? 'contactos-drawer-closed'}
        open={Boolean(detail)}
        closeHref={closeHref}
        title={detail?.company ?? ''}
        subtitle={detail ? `${detail.name} - ${formatAdminDateTime(detail.createdAt)}` : ''}
        badges={
          detail ? (
            <>
              <AdminStatusBadge status={detail.status} />
              <AdminStatusBadge status={detail.internalEmailStatus} compact />
              <AdminStatusBadge status={detail.clientEmailStatus} compact />
            </>
          ) : null
        }
        actions={
          detail
            ? [
                {
                  label: 'ABRIR CORREO',
                  kind: 'link',
                  value: buildAdminMailto(detail.email, `Seguimiento de ${detail.company}`),
                  icon: 'mail',
                },
                {
                  label: 'WHATSAPP',
                  kind: 'link',
                  value: buildAdminWhatsApp(
                    detail.phone,
                    `Hola ${detail.name}, gracias por escribir a Konamy Systems.`,
                  ),
                  icon: 'whatsapp',
                  external: true,
                },
                {
                  label: 'LLAMAR',
                  kind: 'link',
                  value: buildAdminPhone(detail.phone),
                  icon: 'phone',
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
                        <AdminInfoCard label="CORREO">{detail.email}</AdminInfoCard>
                        <AdminInfoCard label="TELEFONO">{detail.phone}</AdminInfoCard>
                        <AdminInfoCard label="ASUNTO / SERVICIO" className="sm:col-span-2">
                          {detail.subject}
                        </AdminInfoCard>
                      </div>
                      <AdminInfoCard label="MENSAJE">
                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                          {detail.message}
                        </p>
                      </AdminInfoCard>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <AdminInfoCard label="FECHA">{formatAdminDateTime(detail.createdAt)}</AdminInfoCard>
                        <AdminInfoCard
                          label="PRIVACIDAD"
                          hint={`Aceptada el ${formatAdminDateTime(detail.privacyAcceptedAt)}`}
                        >
                          {detail.privacyPolicyVersion}
                        </AdminInfoCard>
                      </div>
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
                  ),
                },
                {
                  id: 'seguimiento',
                  label: 'SEGUIMIENTO',
                  content: (
                    <form
                      action={`/admin/api/contactos/${detail.id}/status`}
                      method="post"
                      className="space-y-4 rounded-2xl border border-border/70 bg-background/35 p-4"
                    >
                      <input type="hidden" name="returnTo" value={returnTo} />
                      <div>
                        <p className="text-xs font-semibold tracking-[0.18em] text-primary">
                          CAMBIAR ESTADO
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          El contador de pendientes se actualiza segun el estado real del registro.
                        </p>
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
                  ),
                },
                {
                  id: 'notas',
                  label: 'NOTAS',
                  content: (
                    <div className="space-y-4">
                      <form
                        action={`/admin/api/contactos/${detail.id}/notes`}
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
                        emptyLabel="Todavia no hay notas internas para este contacto."
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
                    <div className="space-y-4">
                      <AdminTechnicalDetails
                        items={[
                          { label: 'Origen', value: detail.requestOrigin ?? 'Sin dato' },
                          { label: 'Ruta', value: detail.requestPath ?? 'Sin dato' },
                          { label: 'Referer', value: detail.referer ?? 'Sin dato' },
                          { label: 'User-Agent', value: detail.userAgent ?? 'Sin dato' },
                          { label: 'IP Hash', value: detail.ipHash ?? 'Sin dato' },
                        ]}
                      />
                    </div>
                  ),
                },
              ]
            : []
        }
      />
    </div>
  )
}
