import assert from 'node:assert/strict'
import { serializeJsonLd } from '../lib/json-ld'
import { isPageIndexable, seoIndexingEnabled, seoUrl } from '../config/seo'

const hostile = { name: '</script><script>alert("x")</script>', description: 'Colombia & Manizales\u2028\u2029' }
const encoded = serializeJsonLd(hostile)
assert.equal(encoded.includes('<'), false, 'Content must not terminate a JSON-LD script')
assert.deepEqual(JSON.parse(encoded), hostile, 'Escaping must preserve the source data')
assert.equal(seoUrl('/servicios?utm_source=test#desarrollo-web'), 'https://conexacod.com/servicios?utm_source=test#desarrollo-web')
assert.equal(isPageIndexable('privacy'), false, 'Provisional legal content must not be promoted')
assert.equal(isPageIndexable('home'), seoIndexingEnabled)
if (['preview', 'development'].includes(process.env.VERCEL_ENV ?? '')) {
  assert.equal(seoIndexingEnabled, false, 'Preview deployments must not be indexed')
}
console.log('PASS: safe JSON-LD serialization, canonical identity and privacy/preview indexing boundaries.')
