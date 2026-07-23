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
  advisoryBookingStatusOptions,
  formatAdminDateTime,
  getAdvisoryBookingDetail,
  getRelatedActivityForRecord,
  getStatusLabel,
  listAdvisoryBookings,
  parseAdminListFilters,
} from '@/lib/admin-data'
import { buildAdminMailto, buildAdminPhone, buildAdminWhatsApp } from '@/lib/admin-links'

export const dynamic = 'force-dynamic'

type ReunionesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function buildWeekRange(dateValue: string, offsetWeeks = 0) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const probe = new Date(Date.UTC(year, month - 1, day))
  const dayOfWeek = probe.getUTCDay()
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  probe.setUTCDate(probe.getUTCDate() + diffToMonday + offsetWeeks * 7)

  const start = `${probe.getUTCFullYear()}-${String(probe.getUTCMonth() + 1).padStart(2, '0')}-${String(probe.getUTCDate()).padStart(2, '0')}`
  const endDate = new Date(probe)
  endDate.setUTCDate(endDate.getUTCDate() + 6)
  const end = `${endDate.getUTCFullYear()}-${String(endDate.getUTCMonth() + 1).padStart(2, '0')}-${String(endDate.getUTCDate()).padStart(2, '0')}`

  return { from: start, to: end }
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
  return `/admin/reuniones${query ? `?${query}` : ''}`
}

export default async function AdminReunionesPage({ searchParams }: ReunionesPageProps) {
  const filters = parseAdminListFilters(await searchParams)
  const list = await listAdvisoryBookings(filters)
  const detail = filters.id ? await getAdvisoryBookingDetail(filters.id) : null
  const relatedActivity = detail
    ? await getRelatedActivityForRecord({
        entity: 'reuniones',
        id: detail.id,
        emailNormalized: detail.emailNormalized,
        phone: detail.phone,
        company: detail.company,
      })
    : []
  const closeHref = buildPageHref(filters, { id: '' })
  const returnTo = detail ? buildPageHref(filters, { id: detail.id }) : buildPageHref(filters)

  const today = getTodayInAdvisoryZone()
  const tomorrow = addDaysToDateValue(today, 1)
  const dayAfterTomorrow = addDaysToDateValue(today, 2)
  const thisWeek = buildWeekRange(today)
  const nextWeek = buildWeekRange(today, 1)

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/70 bg-background/50 p-6 backdrop-blur-sm lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.32em] text-primary">REUNIONES</p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground">Agenda de asesorias</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Revise la agenda completa, filtre por dia o semana y abra cada reserva en un drawer
              lateral con accesos, estado, notas e historial sin romper la lectura del listado.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
            <Download className="size-4" />
            EXPORTACION NO REQUERIDA
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminSummaryTile
          label="TOTAL"
          value={list.stats.total}
          hint="Reservas dentro del rango actual."
          tone="default"
        />
        <AdminSummaryTile
          label="HOY"
          value={list.stats.today}
          hint="Eventos agendados para hoy."
          tone="primary"
        />
        <AdminSummaryTile
          label="PROXIMAS"
          value={list.stats.upcoming}
          hint="Reuniones futuras activas."
          tone="accent"
        />
        <AdminSummaryTile
          label="ACTIVAS"
          value={list.stats.active}
          hint="Pendientes o confirmadas."
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
              preset: 'tomorrow',
              from: tomorrow,
              to: tomorrow,
              page: 1,
              id: '',
            })}
            label="MANANA"
            active={filters.preset === 'tomorrow'}
          />
          <AdminQuickFilterLink
            href={buildPageHref(filters, {
              preset: 'day-after-tomorrow',
              from: dayAfterTomorrow,
              to: dayAfterTomorrow,
              page: 1,
              id: '',
            })}
            label="PASADO MANANA"
            active={filters.preset === 'day-after-tomorrow'}
          />
          <AdminQuickFilterLink
            href={buildPageHref(filters, {
              preset: 'this-week',
              from: thisWeek.from,
              to: thisWeek.to,
              page: 1,
              id: '',
            })}
            label="ESTA SEMANA"
            active={filters.preset === 'this-week'}
          />
          <AdminQuickFilterLink
            href={buildPageHref(filters, {
              preset: 'next-week',
              from: nextWeek.from,
              to: nextWeek.to,
              page: 1,
              id: '',
            })}
            label="PROXIMA SEMANA"
            active={filters.preset === 'next-week'}
          />
          <AdminQuickFilterLink
            href="/admin/reuniones"
            label="TODAS"
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
                placeholder="Empresa, cliente, correo, proceso..."
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-[0.16em] text-primary">ESTADO</span>
              <select name="status" defaultValue={filters.status} className={fieldClassName}>
                <option value="">Todos</option>
                {advisoryBookingStatusOptions.map((status) => (
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
                href="/admin/reuniones"
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
              placeholder="Empresa, cliente, correo, proceso..."
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold tracking-[0.16em] text-primary">ESTADO</span>
            <select name="status" defaultValue={filters.status} className={fieldClassName}>
              <option value="">Todos</option>
              {advisoryBookingStatusOptions.map((status) => (
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
            href="/admin/reuniones"
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
            La agenda mantiene sus accesos y estados sin empujar el detalle a una segunda columna fija.
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
                <th className="px-4 py-3">HORARIO</th>
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
                          {item.googleMeetUrl ? (
                            <span className="mt-2 inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-primary">
                              MEET LISTO
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <p className="truncate text-sm font-medium text-foreground">{item.fullName}</p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="min-w-0 space-y-2">
                          <p className="truncate text-sm text-muted-foreground">{item.email}</p>
                          <p className="truncate text-sm text-muted-foreground">{item.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-muted-foreground">
                        {item.scheduledDate}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="text-sm text-muted-foreground">
                          <p>{item.scheduledTime}</p>
                          <p className="mt-2">{formatAdminDateTime(item.startAt)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <AdminStatusBadge status={item.status} compact />
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <AdminStatusBadge status={item.calendarEventStatus} compact />
                          <AdminStatusBadge status={item.internalEmailStatus} compact />
                          <AdminStatusBadge status={item.clientEmailStatus} compact />
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
                    <AdminEmptyState>
                      No se encontraron reuniones con esos filtros. Pruebe con otro rango o revise si
                      la agenda esta vacia.
                    </AdminEmptyState>
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
                      <p className="mt-1 text-sm text-muted-foreground">{item.fullName}</p>
                    </div>
                    <AdminStatusBadge status={item.status} compact />
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        CONTACTO
                      </p>
                      <p className="mt-1 truncate text-muted-foreground">{item.email}</p>
                      <p className="mt-1 text-muted-foreground">{item.phone}</p>
                    </div>
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        FECHA Y HORA
                      </p>
                      <p className="mt-1 text-foreground">{item.scheduledDate}</p>
                      <p className="mt-1 text-muted-foreground">{item.scheduledTime}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <AdminStatusBadge status={item.calendarEventStatus} compact />
                    <AdminStatusBadge status={item.internalEmailStatus} compact />
                    <AdminStatusBadge status={item.clientEmailStatus} compact />
                    {item.googleMeetUrl ? (
                      <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-primary">
                        MEET LISTO
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
            <AdminEmptyState>
              No se encontraron reuniones con esos filtros. Pruebe con otro rango o revise si la
              agenda esta vacia.
            </AdminEmptyState>
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
        key={detail?.id ?? 'reuniones-drawer-closed'}
        open={Boolean(detail)}
        closeHref={closeHref}
        title={detail?.company ?? ''}
        subtitle={detail ? `${detail.fullName} - ${detail.scheduledDate} ${detail.scheduledTime}` : ''}
        badges={
          detail ? (
            <>
              <AdminStatusBadge status={detail.status} />
              <AdminStatusBadge status={detail.calendarEventStatus} compact />
              <AdminStatusBadge status={detail.internalEmailStatus} compact />
              <AdminStatusBadge status={detail.clientEmailStatus} compact />
              {detail.googleMeetUrl ? (
                <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-primary">
                  MEET LISTO
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
                  value: buildAdminMailto(detail.email, `Seguimiento de asesoria ${detail.company}`),
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
                    `Hola ${detail.fullName}, seguimos atentos a su asesoria con Konamy Systems.`,
                  ),
                  icon: 'whatsapp',
                  external: true,
                },
                ...(detail.googleMeetUrl
                  ? [
                      {
                        label: 'ABRIR MEET',
                        kind: 'link' as const,
                        value: detail.googleMeetUrl,
                        icon: 'video' as const,
                        external: true,
                      },
                    ]
                  : []),
                ...(detail.googleCalendarHtmlLink
                  ? [
                      {
                        label: 'CALENDAR',
                        kind: 'link' as const,
                        value: detail.googleCalendarHtmlLink,
                        icon: 'calendar' as const,
                        external: true,
                      },
                    ]
                  : []),
              ]
            : []
        }
        tabs={
          detail
            ? [
                {
                  id: 'agenda',
                  label: 'AGENDA',
                  content: (
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <AdminInfoCard label="FECHA">{detail.scheduledDate}</AdminInfoCard>
                        <AdminInfoCard label="HORA DE INICIO" hint={`${detail.durationMinutes} minutos`}>
                          {formatAdminDateTime(detail.startAt)}
                        </AdminInfoCard>
                        <AdminInfoCard label="HORA FINAL">{formatAdminDateTime(detail.endAt)}</AdminInfoCard>
                        <AdminInfoCard label="ZONA HORARIA">{detail.timezone}</AdminInfoCard>
                        <AdminInfoCard label="MODALIDAD">{detail.modality}</AdminInfoCard>
                        <AdminInfoCard label="CIUDAD">{detail.city}</AdminInfoCard>
                      </div>

                      <AdminInfoCard label="MOTIVO O PROCESO">
                        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                          {detail.processGoal}
                        </p>
                      </AdminInfoCard>

                      <AdminCollapsiblePanel
                        title="CALENDAR Y MEET"
                        summary="Accesos y trazabilidad del evento generado."
                      >
                        <div className="grid gap-3 sm:grid-cols-2">
                          <AdminInfoCard label="GOOGLE MEET">
                            {detail.googleMeetUrl ? (
                              <a
                                href={detail.googleMeetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary transition-opacity hover:opacity-80"
                              >
                                Abrir reunion
                              </a>
                            ) : (
                              <p className="text-muted-foreground">Sin enlace disponible.</p>
                            )}
                          </AdminInfoCard>
                          <AdminInfoCard label="GOOGLE CALENDAR">
                            {detail.googleCalendarHtmlLink ? (
                              <a
                                href={detail.googleCalendarHtmlLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary transition-opacity hover:opacity-80"
                              >
                                Abrir evento
                              </a>
                            ) : (
                              <p className="text-muted-foreground">Sin enlace HTML disponible.</p>
                            )}
                            <p className="mt-3 break-all text-xs text-muted-foreground">
                              ID: {detail.googleCalendarEventId ?? 'Sin dato'}
                            </p>
                          </AdminInfoCard>
                        </div>
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
                            <AdminStatusBadge status={detail.calendarEventStatus} compact />
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

                      <form
                        action={`/admin/api/reuniones/${detail.id}/status`}
                        method="post"
                        className="space-y-4 rounded-2xl border border-border/70 bg-background/35 p-4"
                      >
                        <input type="hidden" name="returnTo" value={returnTo} />
                        <div>
                          <p className="text-xs font-semibold tracking-[0.18em] text-primary">
                            CAMBIAR ESTADO
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Actualice confirmacion, reprogramacion o cierre sin salir de la agenda.
                          </p>
                        </div>
                        <label className="block">
                          <span className="text-sm font-medium text-foreground">Nuevo estado</span>
                          <select name="status" defaultValue={detail.status} className={fieldClassName}>
                            {advisoryBookingStatusOptions.map((status) => (
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
                        action={`/admin/api/reuniones/${detail.id}/notes`}
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
                        emptyLabel="Todavia no hay notas internas para esta reunion."
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
                        { label: 'Creada', value: formatAdminDateTime(detail.createdAt) },
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
