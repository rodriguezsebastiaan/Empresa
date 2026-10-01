import { buildPageStructuredData } from '@/lib/structured-data'
import type { SitePageKey } from '@/config/site'
import { serializeJsonLd } from '@/lib/json-ld'

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}

export function PageStructuredData({ pageKey }: { pageKey: SitePageKey }) {
  return <JsonLd data={buildPageStructuredData(pageKey)} />
}
