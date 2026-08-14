import type { AdminListFilters } from '@/lib/admin-data'

function buildAdminQueryString(
  filters: AdminListFilters,
  overrides: Partial<AdminListFilters> = {},
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

  return params.toString()
}

export function buildAdminListHref(
  basePath: string,
  filters: AdminListFilters,
  overrides: Partial<AdminListFilters> = {},
) {
  const query = buildAdminQueryString(filters, overrides)
  return `${basePath}${query ? `?${query}` : ''}`
}

export function buildAdminDetailHref(
  basePath: string,
  recordId: string,
  filters: AdminListFilters,
  overrides: Partial<AdminListFilters> = {},
) {
  const query = buildAdminQueryString(filters, overrides)
  return `${basePath}/${recordId}${query ? `?${query}` : ''}`
}
