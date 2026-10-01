import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'

const base = new URL(process.argv[2] ?? 'http://127.0.0.1:3105')
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'Use the local production server')
const routes = ['/', '/nosotros', '/soluciones', '/servicios', '/proceso', '/contacto', '/agendar-asesoria', '/diagnostico', '/privacidad',
  '/proyectos/citas-ya', '/proyectos/serpleno', '/proyectos/pr-box', '/proyectos/estilo-emporium', '/proyectos/efectuar-sas']
const decode = (text) => text.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const plainText = (text) => decode(text.replace(/<!--[\s\S]*?-->|<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], decode(match[2])]))
}
function parse(html) {
  const tags = (name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map((match) => attributes(match[0]))
  const meta = Object.fromEntries(tags('meta').map((tag) => [tag.name ?? tag.property, tag.content]))
  const canonical = tags('link').filter((tag) => tag.rel === 'canonical').map((tag) => tag.href)
  const graphs = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]))
  const nodes = graphs.flatMap((graph) => { assert.equal(graph['@context'], 'https://schema.org'); return graph['@graph'] })
  return {
    title: plainText(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''), meta, canonical, nodes,
    h1: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((match) => plainText(match[1])),
    headings: [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map((match) => ({ level: Number(match[1]), text: plainText(match[2]) })),
    links: [...new Set(tags('a').map((tag) => tag.href).filter(Boolean))],
    ids: new Set([...html.matchAll(/\bid="([^"]*)"/g)].map((match) => decode(match[1]))),
    images: tags('img'),
  }
}
const documents = new Map()
const titles = new Set(), descriptions = new Set(), assets = new Set()
const matrix = []
for (const route of routes) {
  const response = await fetch(new URL(route, base), { signal: AbortSignal.timeout(15000) })
  assert.equal(response.status, 200, `${route} must return 200`)
  const html = await response.text(), doc = parse(html)
  documents.set(route, doc)
  assert.match(html, /<html[^>]*lang="es"/)
  assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${route}: one main landmark`)
  assert.equal(doc.h1.length, 1, `${route}: one H1`)
  assert.ok(doc.h1[0].length > 0)
  assert.ok(doc.links.includes('#main-content'), `${route}: skip link`)
  assert.ok(doc.title && !titles.has(doc.title), `${route}: unique title`)
  titles.add(doc.title)
  assert.ok(doc.meta.description && !descriptions.has(doc.meta.description), `${route}: unique description`)
  descriptions.add(doc.meta.description)
  assert.equal(doc.canonical.length, 1, `${route}: one canonical`)
  const canonical = new URL(doc.canonical[0])
  assert.equal(canonical.origin, 'https://conexacod.com')
  assert.equal(canonical.pathname, route)
  assert.equal(canonical.search, '')
  assert.equal(doc.meta['og:title'], doc.title)
  assert.equal(doc.meta['og:description'], doc.meta.description)
  assert.equal(new URL(doc.meta['og:url']).pathname, route)
  assert.equal(doc.meta['twitter:title'], doc.title)
  assert.equal(doc.meta['twitter:description'], doc.meta.description)
  assert.equal(doc.meta['twitter:card'], 'summary_large_image')
  assert.ok(doc.meta.robots.includes(route === '/privacidad' ? 'noindex' : 'index, follow'))
  const ids = new Set(doc.nodes.map((node) => node['@id']))
  assert.equal(ids.size, doc.nodes.length, `${route}: unique structured entity IDs`)
  const org = doc.nodes.find((node) => node['@type'] === 'Organization')
  assert.equal(org.name, 'ConexaCod')
  assert.equal(org['@id'], 'https://conexacod.com/#organization')
  assert.equal(org.location.address.addressLocality, 'Manizales')
  assert.ok(!org.telephone && !org.email && !org.sameAs && !org.location.address.streetAddress, 'No provisional business facts')
  const inspect = (value) => {
    if (Array.isArray(value)) return value.forEach(inspect)
    if (value && typeof value === 'object') {
      if (value['@id']) assert.ok(ids.has(value['@id']), `${route}: resolve graph reference ${value['@id']}`)
      assert.ok(!['Review', 'AggregateRating', 'VideoObject', 'LocalBusiness', 'FAQPage'].includes(value['@type']), 'No unjustified schema')
      if (value.image && typeof value.image === 'string') assets.add(value.image)
      Object.values(value).forEach(inspect)
    }
  }
  doc.nodes.forEach(inspect)
  assets.add(org.logo.url)
  assets.add(doc.meta['og:image'])
  for (const image of doc.images) {
    assert.ok('alt' in image, `${route}: all images have alt`)
    assert.ok(image.width && image.height, `${route}: image dimensions`)
  }
  if (route.startsWith('/proyectos/')) {
    const crumbs = doc.nodes.find((node) => node['@type'] === 'BreadcrumbList').itemListElement
    assert.deepEqual(crumbs.map((item) => item.position), [1, 2, 3])
    assert.equal(crumbs[2].name, doc.h1[0])
    assert.ok(doc.links.some((href) => href.startsWith('/servicios#')), 'Project links to relevant services')
    assert.ok(doc.links.includes('/contacto'))
    assert.ok(doc.nodes.some((node) => node['@type'] === 'CreativeWork'))
  }
  for (let i = 1; i < doc.headings.length; i++) assert.ok(doc.headings[i].level <= doc.headings[i - 1].level + 1, `${route}: heading hierarchy`)
  const csp = response.headers.get('content-security-policy')
  assert.ok(csp?.includes("frame-ancestors 'none'") && !csp.includes('unsafe-eval'), 'Production CSP preserved')
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(response.headers.get('x-powered-by'), null)
  matrix.push({ route, status: response.status, title: doc.title, description: doc.meta.description, canonical: doc.canonical[0], h1: doc.h1[0],
    schema: doc.nodes.map((node) => node['@type']), internalLinks: doc.links.filter((href) => href.startsWith('/')), robots: doc.meta.robots })
}
const reached = new Set(['/'])
for (let changed = true; changed;) {
  changed = false
  for (const route of [...reached]) for (const href of documents.get(route)?.links ?? []) {
    const target = new URL(href, new URL(route, base))
    if (target.origin === base.origin && documents.has(target.pathname) && !reached.has(target.pathname)) { reached.add(target.pathname); changed = true }
  }
}
assert.equal(reached.size, routes.length, 'No orphan public routes')
for (const [route, doc] of documents) for (const href of doc.links.filter((link) => link.startsWith('/') || link.startsWith('#'))) {
  const target = new URL(href, new URL(route, base))
  assert.ok(documents.has(target.pathname), `${route}: known internal destination ${href}`)
  if (target.hash) assert.ok(documents.get(target.pathname).ids.has(decodeURIComponent(target.hash.slice(1))), `${route}: fragment ${href} exists`)
}
const services = documents.get('/servicios').nodes.filter((node) => node['@type'] === 'Service')
assert.equal(services.length, 13, 'All visible service entries are represented')
for (const service of services) assert.ok(documents.get('/servicios').ids.has(new URL(service.url).hash.slice(1)), 'Service schema links to visible section')
const sitemapResponse = await fetch(new URL('/sitemap.xml', base))
assert.equal(sitemapResponse.status, 200)
const sitemap = await sitemapResponse.text()
const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(decode(match[1])))
assert.deepEqual(listed.map((url) => url.pathname).sort(), routes.filter((route) => route !== '/privacidad').sort())
assert.ok(listed.every((url) => url.origin === 'https://conexacod.com'))
assert.ok(!/<lastmod>|<priority>|<changefreq>/.test(sitemap), 'No invented sitemap hints or dates')
const robotsResponse = await fetch(new URL('/robots.txt', base))
assert.equal(robotsResponse.status, 200)
const robots = await robotsResponse.text()
assert.match(robots, /Allow: \/\s/)
assert.match(robots, /Disallow: \/admin\$/)
assert.match(robots, /Disallow: \/admin\//)
assert.match(robots, /Sitemap: https:\/\/conexacod\.com\/sitemap\.xml/)
for (const asset of [...assets, 'https://conexacod.com/manifest.webmanifest']) {
  const url = new URL(asset)
  assert.equal(url.origin, 'https://conexacod.com')
  const response = await fetch(new URL(url.pathname, base), { method: 'HEAD' })
  assert.equal(response.status, 200, `Metadata/structured image asset ${url.pathname}`)
}
for (const route of ['/ruta-seo-inexistente', '/proyectos/proyecto-seo-inexistente']) {
  const response = await fetch(new URL(route, base))
  assert.equal(response.status, 404, `${route}: true 404`)
  assert.match(await response.text(), /name="robots" content="noindex/)
}
const queryResponse = await fetch(new URL('/servicios?utm_source=seo-check', base))
assert.deepEqual(parse(await queryResponse.text()).canonical, documents.get('/servicios').canonical, 'Query parameters do not change canonical')
await mkdir('.local/seo', { recursive: true })
await writeFile('.local/seo/route-matrix.json', JSON.stringify({ base: base.origin, matrix, robots, sitemap, resolvedAssets: [...assets], validatedAt: new Date().toISOString() }, null, 2))
console.log(`PASS: ${matrix.length} rendered routes, ${listed.length} sitemap URLs, graph references, unique metadata, fragments, assets, 404s, query canonicals and security headers.`)
