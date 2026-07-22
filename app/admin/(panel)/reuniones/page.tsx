import Link from 'next/link'
import { AdminPagination } from '@/components/admin/admin-pagination'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import { fieldClassName, panelClassName } from '@/components/form-controls'
import {
  advisoryBookingStatusOptions,
  formatAdminDateTime,
  getAdvisoryBookingDetail,
  listAdvisoryBookings,
  parseAdminListFilters,
} from '@/lib/admin-data'
import { buildAdminMailto, buildAdminPhone, buildAdminWhatsApp } from '@/lib/admin-links'

export const dynamic = 'force-dynamic'

type ReunionesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
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
  const returnTo = detail ? buildPageHref(filters, { id: detail.id }) : buildPageHref(filters)

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/70 bg-background/50 p-6 backdrop-blur-sm lg:p-8">
        <p className="text-xs font-semibold tracking-[0.32em] text-primary">REUNIONES</p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">Seguimiento de asesorias agendadas</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Revise reuniones creadas desde el sitio publico, consulte el enlace de Google Meet, vea
          el identificador del evento de Google Calendar y mantenga notas administrativas sobre
          cada reserva.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)]">
        <div className={panelClassName}>
          <form className="grid gap-4 lg:grid-cols-5" method="get">
            <div className="lg:col-span-2">
              <label className="block">
                <span className="text-xs font-semibold tracking-[0.16em] text-primary">BUSQUEDA</span>
                <input
                  name="q"
                  defaultValue={filters.q}
                  className={fieldClassName}
                  placeholder="Cliente, empresa, correo, telefono..."
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-semibold tracking-[0.16em] text-primary">ESTADO</span>
              <select name="status" defaultValue={filters.status} className={fieldClassName}>
                <option value="">Todos</option>
                {advisoryBookingStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll('_', ' ')}
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

            <div className="flex flex-wrap items-end gap-3 lg:col-span-5">
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

          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {list.total} resultado{list.total === 1 ? '' : 's'}
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
                      <p className="mt-1 text-sm text-muted-foreground">{item.fullName}</p>
                    </div>
                    <AdminStatusBadge status={item.status} compact />
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <p>{item.email}</p>
                    <p>{item.phone}</p>
                    <p>{formatAdminDateTime(item.startAt)}</p>
                    <p>{formatAdminDateTime(item.createdAt)}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <AdminStatusBadge status={item.calendarEventStatus} compact />
                    <AdminStatusBadge status={item.internalEmailStatus} compact />
                    <AdminStatusBadge status={item.clientEmailStatus} compact />
                    {item.googleMeetUrl ? (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.18em] text-primary">
                        MEET LISTO
                      </span>
                    ) : null}
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/20 p-5 text-sm text-muted-foreground">
                No se encontraron reuniones con esos filtros.
              </div>
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
                <p className="mt-2 text-sm text-muted-foreground">{detail.fullName}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <AdminStatusBadge status={detail.status} />
                  <AdminStatusBadge status={detail.calendarEventStatus} compact />
                  <AdminStatusBadge status={detail.internalEmailStatus} compact />
                  <AdminStatusBadge status={detail.clientEmailStatus} compact />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs tracking-[0.16em] text-primary">FECHA Y HORA</p>
                  <p className="mt-2 text-sm text-foreground">{formatAdminDateTime(detail.startAt)}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{detail.timezone}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs tracking-[0.16em] text-primary">DURACION</p>
                  <p className="mt-2 text-sm text-foreground">{detail.durationMinutes} minutos</p>
                  <p className="mt-2 text-xs text-muted-foreground">{detail.modality}</p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs tracking-[0.16em] text-primary">MOTIVO O PROCESO</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{detail.processGoal}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs tracking-[0.16em] text-primary">CORREO</p>
                  <a
                    href={buildAdminMailto(detail.email, `Seguimiento de asesoria ${detail.company}`)}
                    className="mt-2 block text-sm text-foreground hover:text-primary"
                  >
                    {detail.email}
                  </a>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs tracking-[0.16em] text-primary">TELEFONO</p>
                  <a
                    href={buildAdminPhone(detail.phone)}
                    className="mt-2 block text-sm text-foreground hover:text-primary"
                  >
                    {detail.phone}
                  </a>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs tracking-[0.16em] text-primary">WHATSAPP</p>
                  <a
                    href={buildAdminWhatsApp(detail.phone, `Hola ${detail.fullName}, seguimos atentos a su asesoria con Konamy Systems.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-sm text-foreground hover:text-primary"
                  >
                    Abrir conversacion
                  </a>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs tracking-[0.16em] text-primary">CIUDAD</p>
                  <p className="mt-2 text-sm text-foreground">{detail.city}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs tracking-[0.16em] text-primary">GOOGLE MEET</p>
                  {detail.googleMeetUrl ? (
                    <a
                      href={detail.googleMeetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-sm text-foreground hover:text-primary"
                    >
                      Abrir reunion
                    </a>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">Sin enlace disponible.</p>
                  )}
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs tracking-[0.16em] text-primary">GOOGLE CALENDAR</p>
                  {detail.googleCalendarHtmlLink ? (
                    <a
                      href={detail.googleCalendarHtmlLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-sm text-foreground hover:text-primary"
                    >
                      Abrir evento
                    </a>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">Sin enlace HTML disponible.</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground break-all">
                    ID: {detail.googleCalendarEventId ?? 'Sin dato'}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs tracking-[0.16em] text-primary">PRIVACIDAD</p>
                  <p className="mt-2 text-sm text-foreground">{detail.privacyPolicyVersion}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Aceptada el {formatAdminDateTime(detail.privacyAcceptedAt)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs tracking-[0.16em] text-primary">ENTREGA</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <AdminStatusBadge status={detail.calendarEventStatus} compact />
                    <AdminStatusBadge status={detail.internalEmailStatus} compact />
                    <AdminStatusBadge status={detail.clientEmailStatus} compact />
                  </div>
                  {detail.lastDeliveryError ? (
                    <p className="mt-3 text-xs text-muted-foreground">{detail.lastDeliveryError}</p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                <p className="text-xs tracking-[0.16em] text-primary">METADATOS TECNICOS</p>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  <p>Origen: {detail.requestOrigin ?? 'Sin dato'}</p>
                  <p>Ruta: {detail.requestPath ?? 'Sin dato'}</p>
                  <p>Referer: {detail.referer ?? 'Sin dato'}</p>
                  <p>User-Agent: {detail.userAgent ?? 'Sin dato'}</p>
                  <p>IP Hash: {detail.ipHash ?? 'Sin dato'}</p>
                  <p>Creada: {formatAdminDateTime(detail.createdAt)}</p>
                </div>
              </div>

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
                        {status.replaceAll('_', ' ')}
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

              <section className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary">NOTAS INTERNAS</p>
                {detail.notes.length > 0 ? (
                  detail.notes.map((note) => (
                    <article key={note.id} className="rounded-2xl border border-border/70 bg-background/35 p-4">
                      <p className="whitespace-pre-wrap text-sm text-foreground">{note.body}</p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {note.adminUser.name} · {formatAdminDateTime(note.createdAt)}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-background/20 p-4 text-sm text-muted-foreground">
                    Todavia no hay notas internas para esta reunion.
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary">HISTORIAL</p>
                {detail.statusHistory.length > 0 ? (
                  detail.statusHistory.map((entry) => (
                    <article key={entry.id} className="rounded-2xl border border-border/70 bg-background/35 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {entry.fromStatus ? <AdminStatusBadge status={entry.fromStatus} compact /> : null}
                        <span className="text-xs text-muted-foreground">→</span>
                        <AdminStatusBadge status={entry.toStatus} compact />
                      </div>
                      {entry.note ? (
                        <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{entry.note}</p>
                      ) : null}
                      <p className="mt-3 text-xs text-muted-foreground">
                        {entry.adminUser?.name ?? 'Sistema'} · {formatAdminDateTime(entry.createdAt)}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-background/20 p-4 text-sm text-muted-foreground">
                    Todavia no hay cambios de estado registrados.
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/20 p-5 text-sm text-muted-foreground">
              Seleccione una reunion para ver el detalle completo.
            </div>
          )}
        </aside>
      </section>
    </div>
  )
}
