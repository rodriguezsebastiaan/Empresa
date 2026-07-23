import Link from 'next/link'
import { CalendarDays, Download, Mail, MessageSquare, Phone, Video } from 'lucide-react'
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
  const selectedId = filters.id || list.items[0]?.id || ''
  const detail = await getAdvisoryBookingDetail(selectedId)
  const relatedActivity = detail
    ? await getRelatedActivityForRecord({
        entity: 'reuniones',
        id: detail.id,
        emailNormalized: detail.emailNormalized,
        phone: detail.phone,
        company: detail.company,
      })
    : []
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
          <div>
            <p className="text-xs font-semibold tracking-[0.32em] text-primary">REUNIONES</p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground">Agenda operativa de asesorias</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Revise la agenda del dia, filtre por manana o por semana y consulte cada reserva con
              acceso directo a Meet, Calendar, correo y WhatsApp cuando esos datos ya existan.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
            <Download className="size-4" />
            EXPORTACION NO REQUERIDA EN ESTA VISTA
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminSummaryTile
          label="TOTAL EN RANGO"
          value={list.stats.total}
          hint="Reservas dentro del rango y la busqueda actual."
          tone="default"
        />
        <AdminSummaryTile
          label="HOY"
          value={list.stats.today}
          hint="Eventos del dia actual."
          tone="primary"
        />
        <AdminSummaryTile
          label="PROXIMAS"
          value={list.stats.upcoming}
          hint="Reuniones futuras pendientes o confirmadas."
          tone="accent"
        />
        <AdminSummaryTile
          label="ACTIVAS"
          value={list.stats.active}
          hint="Reservas con estado pendiente o confirmado."
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
              href={buildPageHref(filters, { preset: 'tomorrow', from: tomorrow, to: tomorrow, page: 1, id: '' })}
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

          <form className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]" method="get">
            <div>
              <label className="block">
                <span className="text-xs font-semibold tracking-[0.16em] text-primary">BUSQUEDA</span>
                <input
                  name="q"
                  defaultValue={filters.q}
                  className={fieldClassName}
                  placeholder="Empresa, cliente, correo, proceso..."
                />
              </label>
            </div>

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

            <div className="flex flex-wrap items-end gap-3 lg:col-span-4">
              <button
                type="submit"
                className="inline-flex items-center rounded-xl bg-primary px-4 py-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90"
              >
                FILTRAR
              </button>
              <Link
                href="/admin/reuniones"
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
              Vista optimizada para priorizar agenda, confirmacion y novedades.
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
                      <p className="mt-1 text-sm text-muted-foreground">{item.fullName}</p>
                    </div>
                    <AdminStatusBadge status={item.status} compact />
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        CORREO
                      </p>
                      <p className="mt-1 text-muted-foreground">{item.email}</p>
                    </div>
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        TELEFONO
                      </p>
                      <p className="mt-1 text-muted-foreground">{item.phone}</p>
                    </div>
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        FECHA
                      </p>
                      <p className="mt-1 text-muted-foreground">{item.scheduledDate}</p>
                    </div>
                    <div>
                      <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                        HORA
                      </p>
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
                    <span className="rounded-full border border-border/70 bg-background/35 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                      Notas {item._count.notes} / Historial {item._count.statusHistory}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <AdminEmptyState>
                No se encontraron reuniones con esos filtros. Pruebe con otro rango o revise si la
                agenda de hoy esta vacia.
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
        </div>

        <aside id="detalle" className={`${panelClassName} h-fit xl:sticky xl:top-6`}>
          {detail ? (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.32em] text-primary">DETALLE Y ACCIONES</p>
                <h2 className="mt-4 text-2xl font-semibold text-foreground">{detail.company}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{detail.fullName}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <AdminStatusBadge status={detail.status} />
                  <AdminStatusBadge status={detail.calendarEventStatus} compact />
                  <AdminStatusBadge status={detail.internalEmailStatus} compact />
                  <AdminStatusBadge status={detail.clientEmailStatus} compact />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInfoCard label="FECHA">
                  <div className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    {detail.scheduledDate}
                  </div>
                </AdminInfoCard>
                <AdminInfoCard label="HORA DE INICIO" hint={`${detail.durationMinutes} minutos`}>
                  {formatAdminDateTime(detail.startAt)}
                </AdminInfoCard>
                <AdminInfoCard label="HORA FINAL">
                  {formatAdminDateTime(detail.endAt)}
                </AdminInfoCard>
                <AdminInfoCard label="ZONA HORARIA">{detail.timezone}</AdminInfoCard>
                <AdminInfoCard label="MODALIDAD">{detail.modality}</AdminInfoCard>
                <AdminInfoCard label="CIUDAD">{detail.city}</AdminInfoCard>
              </div>

              <AdminInfoCard label="MOTIVO O PROCESO">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.processGoal}</p>
              </AdminInfoCard>

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInfoCard label="CORREO">
                  <a
                    href={buildAdminMailto(detail.email, `Seguimiento de asesoria ${detail.company}`)}
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
                    href={buildAdminWhatsApp(detail.phone, `Hola ${detail.fullName}, seguimos atentos a su asesoria con Konamy Systems.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-primary"
                  >
                    <MessageSquare className="size-4" />
                    Abrir conversacion
                  </a>
                </AdminInfoCard>
                <AdminInfoCard label="GOOGLE MEET">
                  {detail.googleMeetUrl ? (
                    <a
                      href={detail.googleMeetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 hover:text-primary"
                    >
                      <Video className="size-4" />
                      Abrir reunion
                    </a>
                  ) : (
                    <p className="text-muted-foreground">Sin enlace disponible.</p>
                  )}
                </AdminInfoCard>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInfoCard label="GOOGLE CALENDAR">
                  {detail.googleCalendarHtmlLink ? (
                    <a
                      href={detail.googleCalendarHtmlLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 hover:text-primary"
                    >
                      <CalendarDays className="size-4" />
                      Abrir evento
                    </a>
                  ) : (
                    <p className="text-muted-foreground">Sin enlace HTML disponible.</p>
                  )}
                  <p className="mt-3 text-xs break-all text-muted-foreground">
                    ID: {detail.googleCalendarEventId ?? 'Sin dato'}
                  </p>
                </AdminInfoCard>
                <AdminInfoCard
                  label="PRIVACIDAD"
                  hint={`Aceptada el ${formatAdminDateTime(detail.privacyAcceptedAt)}`}
                >
                  {detail.privacyPolicyVersion}
                </AdminInfoCard>
              </div>

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

              <AdminRelatedActivity items={relatedActivity} />

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

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <form
                  action={`/admin/api/reuniones/${detail.id}/status`}
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

                <form
                  action={`/admin/api/reuniones/${detail.id}/notes`}
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
                  emptyLabel="Todavia no hay notas internas para esta reunion."
                />

                <AdminHistorySection
                  items={detail.statusHistory}
                  emptyLabel="Todavia no hay cambios de estado registrados."
                />
              </div>
            </div>
          ) : (
            <AdminEmptyState>
              No hay una reunion seleccionada. Abra una tarjeta de la lista para ver el detalle
              completo y gestionar su seguimiento.
            </AdminEmptyState>
          )}
        </aside>
      </section>
    </div>
  )
}
