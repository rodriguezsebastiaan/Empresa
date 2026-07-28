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
  contactStatusOptions,
  formatAdminDateTime,
  getStatusLabel,
  listContactSubmissions,
  parseAdminListFilters,
} from '@/lib/admin-data'
import { buildAdminDetailHref, buildAdminListHref } from '@/lib/admin-routes'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Formularios breves | Konamy Systems',
}

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

export default async function AdminContactosPage({ searchParams }: ContactosPageProps) {
  const filters = parseAdminListFilters(await searchParams)
  const list = await listContactSubmissions(filters)
  const buildListHref = (overrides: Partial<typeof filters> = {}) =>
    buildAdminListHref('/admin/contactos', filters, overrides)
  const buildDetailHref = (contactId: string) =>
    buildAdminDetailHref('/admin/contactos', contactId, filters)
  const exportHref = `/admin/api/contactos/export${buildListHref().replace('/admin/contactos', '')}`

  const today = getTodayInAdvisoryZone()
  const yesterday = addDaysToDateValue(today, -1)
  const lastSevenDays = addDaysToDateValue(today, -6)
  const thisMonth = buildMonthRange(today)

  return (
    <div className="space-y-6">
      <section className="rounded-[1.85rem] border border-border/70 bg-background/50 p-6 backdrop-blur-sm lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.32em] text-primary">CONTACTOS</p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground">Formularios breves</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Un listado limpio para saber quién escribió, desde qué empresa, cómo contactarlo y en
              qué estado está. El detalle completo se consulta en una pantalla independiente.
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

      <AdminModuleSummaryBoard
        totalLabel="TOTAL RECIBIDO"
        total={list.stats.total}
        totalHint="Prospectos capturados dentro del rango actual, listos para revisarse con una lectura más amplia."
        tone="primary"
        metrics={[
          {
            label: 'PENDIENTES',
            value: list.stats.pending,
            hint: 'Ingresos nuevos sin gestionar.',
          },
          {
            label: 'EN PROCESO',
            value: list.stats.inProgress,
            hint: 'Casos ya tomados por el equipo.',
          },
          {
            label: 'ATENDIDOS',
            value: list.stats.attended,
            hint: 'Contactados o ya cerrados.',
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
              preset: 'yesterday',
              from: yesterday,
              to: yesterday,
              page: 1,
            })}
            label="AYER"
            active={filters.preset === 'yesterday'}
          />
          <AdminQuickFilterLink
            href={buildListHref({
              preset: 'last-7-days',
              from: lastSevenDays,
              to: today,
              page: 1,
            })}
            label="ULTIMOS 7 DIAS"
            active={filters.preset === 'last-7-days'}
          />
          <AdminQuickFilterLink
            href={buildListHref({
              preset: 'this-month',
              from: thisMonth.from,
              to: thisMonth.to,
              page: 1,
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
            El detalle se abre en una vista amplia, sin recargar el listado con datos secundarios.
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
                      <p className="mt-2 line-clamp-1 text-sm text-muted-foreground" title={item.subject}>
                        {item.subject}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
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
                      {formatAdminDateTime(item.createdAt)}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <AdminStatusBadge status={item.status} compact />
                    </td>
                    <td className="px-5 py-4 align-top text-right">
                      <Link
                        href={buildDetailHref(item.id)}
                        className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold tracking-[0.16em] text-primary transition-colors hover:border-primary/45 hover:bg-primary/14"
                      >
                        VER DETALLE
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-6">
                    <AdminEmptyState>No se encontraron contactos con esos filtros.</AdminEmptyState>
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
                    <p className="mt-1 text-sm text-muted-foreground">{item.name}</p>
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
                      FECHA
                    </p>
                    <p className="mt-1 text-muted-foreground">{formatAdminDateTime(item.createdAt)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={buildDetailHref(item.id)}
                    className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold tracking-[0.16em] text-primary transition-colors hover:border-primary/45 hover:bg-primary/14"
                  >
                    VER DETALLE
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <AdminEmptyState>No se encontraron contactos con esos filtros.</AdminEmptyState>
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
