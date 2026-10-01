// Local regression fixture: delay video2 responses, then limit them to ~2 MB/s.
// Does not alter application sources or the production server.
import http from 'node:http'
import { Transform } from 'node:stream'

const port = Number(process.env.CINEMATIC_PROXY_PORT || 3002)
const upstreamPort = Number(process.env.CINEMATIC_UPSTREAM_PORT || 3000)
const latencyMs = Number(process.env.CINEMATIC_LATENCY_MS || 1200)
const failProfile = process.env.CINEMATIC_FAIL_PROFILE
const bytesPerSecond = 2_000_000
const server = http.createServer((request, response) => {
  const slow = /\/optimized\/(desktop|mobile)\/video2_/.test(request.url || '')
  if (slow && failProfile && request.url?.includes(`/optimized/${failProfile}/`)) {
    response.writeHead(503, { 'content-type': 'text/plain', 'cache-control': 'no-store' })
    response.end('Deliberate cinematic source-switch failure fixture')
    return
  }
  const headers = { ...request.headers, host: `127.0.0.1:${upstreamPort}` }
  delete headers['accept-encoding']
  const upstream = http.request({ hostname: '127.0.0.1', port: upstreamPort,
    method: request.method, path: request.url, headers }, incoming => {
    incoming.pause()
    const begin = () => {
      if (response.destroyed) { incoming.destroy(); return }
      response.writeHead(incoming.statusCode || 502, {
        ...incoming.headers, 'cache-control': 'no-store',
      })
      if (!slow) incoming.pipe(response)
      else {
        const limiter = new Transform({
          transform(chunk, _encoding, callback) {
            setTimeout(() => callback(null, chunk), Math.ceil(chunk.length / bytesPerSecond * 1000))
          },
        })
        incoming.pipe(limiter).pipe(response)
        response.on('close', () => limiter.destroy())
      }
    }
    const delay = slow ? setTimeout(begin, latencyMs) : null
    if (!slow) begin()
    response.on('close', () => {
      if (delay !== null) clearTimeout(delay)
      incoming.destroy()
    })
  })
  upstream.on('error', error => {
    if (!response.headersSent) response.writeHead(502)
    response.end(error.message)
  })
  response.on('close', () => upstream.destroy())
  request.pipe(upstream)
})
server.listen(port, '127.0.0.1', () => {
  console.log(`Cinematic test proxy: http://127.0.0.1:${port}; video2 latency ${latencyMs} ms, ~2 MB/s`)
})
process.on('SIGINT', () => server.close(() => process.exit(0)))
