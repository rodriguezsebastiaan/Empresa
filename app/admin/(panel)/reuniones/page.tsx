import Link from 'next/link'
import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { AdminPagination } from '@/components/admin/admin-pagination'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import {
  AdminEmptyState,
  AdminModuleSummaryBoard,
  AdminQuickFilterLink,
} from '@/components/admin/admin-ui'
import { fieldClassName, panelClassName } from '@/components/form-controls'
import { addDaysToDateValue, getTodayInAdvisoryZone } from '@/lib/advisory-time'
import {
  advisoryBookingStatusOptions,
  getStatusLabel,
  listAdvisoryBookings,
  parseAdminListFilters,
} from '@/lib/admin-data'
import { buildAdminDetailHref, buildAdminListHref } from '@/lib/admin-routes'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Asesorías agendadas | Conexacod',
}

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

export default async function AdminReunionesPage({ searchParams }: ReunionesPageProps) {
  const filters = parseAdminListFilters(await searchParams)
  const list = await listAdvisoryBookings(filters)
  const buildListHref = (overrides: Partial<typeof filters> = {}) =>
    buildAdminListHref('/admin/reuniones', filters, overrides)
  const buildDetailHref = (bookingId: string) =>
    buildAdminDetailHref('/admin/reuniones', bookingId, filters)

  const today = getTodayInAdvisoryZone()
  const tomorrow = addDaysToDateValue(today, 1)
  const dayAfterTomorrow = addDaysToDateValue(today, 2)
  const thisWeek = buildWeekRange(today)
  const nextWeek = buildWeekRange(today, 1)

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[1.85rem] border border-border/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(4,13,20,0.46)_48%,rgba(4,13,20,0.7))] p-6 shadow-[0_24px_90px_-72px_var(--primary)] backdrop-blur-sm lg:p-8">
        <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.32em] text-primary">ASESORÍAS</p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground">Asesorías agendadas</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Un listado sobrio para saber quién se reunirá, cuándo será la asesoría y en qué
              estado se encuentra. Todo el detalle operativo se consulta en una vista individual.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/reuniones/disponibilidad"
              className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-primary transition-colors hover:border-primary/45 hover:bg-primary/14"
            >
              CONFIGURAR DISPONIBILIDAD
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
              <Download className="size-4" />
              EXPORTACION NO REQUERIDA
            </div>
          </div>
        </div>
      </section>

      <AdminModuleSummaryBoard
        totalLabel="TOTAL REGISTRADO"
        total={list.stats.total}
        totalHint="Asesorías visibles dentro del rango actual, pensadas para lectura operativa y seguimiento más amplio."
        tone="success"
        metrics={[
          {
            label: 'HOY',
            value: list.stats.today,
            hint: 'Eventos programados para hoy.',
          },
          {
            label: 'PROXIMAS',
            value: list.stats.upcoming,
            hint: 'Asesorías futuras activas.',
          },
          {
            label: 'ACTIVAS',
            value: list.stats.active,
            hint: 'Pendientes o confirmadas.',
          },
        ]}
      />

      <section className={panelClassName}>
        <div className="flex flex-wrap gap-2">
          <AdminQuickFilterLink
            href={buildListHref({ preset: 'today', from: today, to: today, page: 1 })}
            label="HOY"
            active={filters.preset === 'today'}
          />
          <AdminQuickFilterLink
            href={buildListHref({
              preset: 'tomorrow',
              from: tomorrow,
              to: tomorrow,
              page: 1,
            })}
            label="MAÑANA"
            active={filters.preset === 'tomorrow'}
          />
          <AdminQuickFilterLink
            href={buildListHref({
              preset: 'day-after-tomorrow',
              from: dayAfterTomorrow,
              to: dayAfterTomorrow,
              page: 1,
            })}
            label="PASADO MAÑANA"
            active={filters.preset === 'day-after-tomorrow'}
          />
          <AdminQuickFilterLink
            href={buildListHref({
              preset: 'this-week',
              from: thisWeek.from,
              to: thisWeek.to,
              page: 1,
            })}
            label="ESTA SEMANA"
            active={filters.preset === 'this-week'}
          />
          <AdminQuickFilterLink
            href={buildListHref({
              preset: 'next-week',
              from: nextWeek.from,
              to: nextWeek.to,
              page: 1,
            })}
            label="PRÓXIMA SEMANA"
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
                placeholder="Empresa, cliente, correo..."
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
              placeholder="Empresa, cliente, correo..."
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
            El detalle de la asesoría se consulta en una pantalla individual más cómoda de operar.
          </p>
        </div>

        <div className="mt-5 hidden overflow-hidden rounded-[1.5rem] border border-border/70 lg:block">
          <table className="min-w-full table-fixed">
            <thead className="bg-background/65 text-left text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3">EMPRESA</th>
                <th className="px-5 py-3">CLIENTE</th>
                <th className="px-5 py-3">CONTACTO</th>
                <th className="px-5 py-3">FECHA</th>
                <th className="px-5 py-3">HORA</th>
                <th className="px-5 py-3">ESTADO</th>
                <th className="px-5 py-3 text-right">ACCION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-background/22">
              {list.items.length > 0 ? (
                list.items.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-background/36">
                    <td className="px-5 py-4 align-top">
                      <p className="truncate text-sm font-semibold text-foreground" title={item.company}>
                        {item.company}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <p className="text-sm font-medium text-foreground">{item.fullName}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="min-w-0 space-y-2">
                        <p className="truncate text-sm text-foreground" title={item.phone}>
                          {item.phone}
                        </p>
                        <p className="truncate text-sm text-muted-foreground" title={item.email}>
                          {item.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-muted-foreground">
                      {item.scheduledDate}
                    </td>
                    <td className="px-5 py-4 align-top text-sm text-muted-foreground">
                      {item.scheduledTime}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <AdminStatusBadge status={item.status} compact />
                    </td>
                    <td className="px-5 py-4 align-top text-right">
                      <Link
                        href={buildDetailHref(item.id)}
                        className="inline-flex min-w-[7.5rem] items-center justify-center whitespace-nowrap rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-primary transition-colors hover:border-primary/45 hover:bg-primary/14"
                      >
                        VER DETALLE
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-6">
                    <AdminEmptyState>
                      No se encontraron asesorías con esos filtros. Pruebe con otro rango o revise si
                      la agenda está vacía.
                    </AdminEmptyState>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-3 lg:hidden">
          {list.items.length > 0 ? (
            list.items.map((item) => (
              <article key={item.id} className="rounded-[1.45rem] border border-border/70 bg-background/28 p-4">
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
                    <p className="mt-1 text-foreground">{item.phone}</p>
                    <p className="mt-1 truncate text-muted-foreground">{item.email}</p>
                  </div>
                  <div>
                    <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                      FECHA Y HORA
                    </p>
                    <p className="mt-1 text-foreground">{item.scheduledDate}</p>
                    <p className="mt-1 text-muted-foreground">{item.scheduledTime}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={buildDetailHref(item.id)}
                    className="inline-flex items-center whitespace-nowrap rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-primary transition-colors hover:border-primary/45 hover:bg-primary/14"
                  >
                    VER DETALLE
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <AdminEmptyState>
              No se encontraron asesorías con esos filtros. Pruebe con otro rango o revise si la
              agenda está vacía.
            </AdminEmptyState>
          )}
        </div>

        <div className="mt-6">
          <AdminPagination
            page={list.page}
            pageCount={list.pageCount}
            buildHref={(page) => buildListHref({ page })}
          />
        </div>
      </section>
    </div>
  )
}
