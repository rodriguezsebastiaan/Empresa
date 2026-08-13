import { mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const [, , entryArg, ...nodeArgs] = process.argv

if (!entryArg) {
  console.error('Usage: node scripts/run-ts.mjs <entry.ts> [...node-args]')
  process.exit(1)
}

const entryPoint = resolve(process.cwd(), entryArg)
const outfile = resolve(process.cwd(), '.local', 'tsx-runner', `${Date.now()}-${Math.random().toString(16).slice(2)}.mjs`)

await mkdir(dirname(outfile), { recursive: true })

await build({
  entryPoints: [entryPoint],
  outfile,
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  packages: 'external',
  sourcemap: 'inline',
  logLevel: 'silent',
})

process.argv = [process.argv[0], entryPoint, ...nodeArgs]

try {
  await import(pathToFileURL(outfile).href)
} finally {
  await rm(outfile, { force: true })
}
