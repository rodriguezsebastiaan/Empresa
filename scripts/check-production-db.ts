import dns from 'node:dns/promises'
import net from 'node:net'
import { performance } from 'node:perf_hooks'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadDotenv } from 'dotenv'
import mariadb, { type ConnectionConfig } from 'mariadb'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

for (const fileName of ['.env', '.env.local']) {
  const filePath = resolve(process.cwd(), fileName)

  if (existsSync(filePath)) {
    loadDotenv({ path: filePath, override: true })
  }
}

type CheckResult = {
  step: string
  ok: boolean
  detail: string
}

function maskHost(value: string) {
  return value.trim() || 'no configurado'
}

function isSslRequested(url: URL) {
  const ssl = url.searchParams.get('ssl')?.toLowerCase()
  const sslMode = url.searchParams.get('sslmode')?.toLowerCase() ?? url.searchParams.get('ssl-mode')?.toLowerCase()

  return ssl === 'true' || ssl === '1' || sslMode === 'required' || sslMode === 'verify_identity' || sslMode === 'verify_ca'
}

function classifyConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  const lower = message.toLowerCase()

  if (lower.includes('enotfound') || lower.includes('getaddrinfo')) {
    return 'hostname/DNS'
  }

  if (lower.includes('timeout') || lower.includes('timed out')) {
    return 'timeout, puerto o Remote Database Access'
  }

  if (lower.includes('econnrefused') || lower.includes('refused')) {
    return 'puerto cerrado o Remote Database Access'
  }

  if (lower.includes('access denied') || lower.includes('1045')) {
    return 'usuario o contraseña'
  }

  if (lower.includes('ssl') || lower.includes('tls') || lower.includes('certificate')) {
    return 'SSL/TLS'
  }

  if (lower.includes('too many') || lower.includes('max_user_connections') || lower.includes('connection limit')) {
    return 'límite del servidor'
  }

  return 'conexión MySQL'
}

async function checkTcp(host: string, port: number, timeoutMs = 8000) {
  await new Promise<void>((resolvePromise, reject) => {
    const socket = net.createConnection({ host, port })
    const timeout = setTimeout(() => {
      socket.destroy()
      reject(new Error('TCP_TIMEOUT'))
    }, timeoutMs)

    socket.once('connect', () => {
      clearTimeout(timeout)
      socket.end()
      resolvePromise()
    })

    socket.once('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
  })
}

function buildDriverConfig(url: URL): ConnectionConfig {
  const sslRequested = isSslRequested(url)

  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    connectTimeout: 10000,
    allowPublicKeyRetrieval: true,
    ssl: sslRequested ? true : undefined,
  }
}

function printResult(result: CheckResult) {
  console.log(`${result.ok ? 'OK' : 'ERROR'} ${result.step}: ${result.detail}`)
}

async function main() {
  const startedAt = performance.now()
  const rawUrl = process.env.PRODUCTION_DATABASE_URL?.trim()

  if (!rawUrl) {
    printResult({
      step: 'configuración',
      ok: false,
      detail: 'Falta PRODUCTION_DATABASE_URL en .env.local.',
    })
    process.exit(1)
  }

  let url: URL

  try {
    url = new URL(rawUrl)
  } catch {
    printResult({
      step: 'configuración',
      ok: false,
      detail: 'PRODUCTION_DATABASE_URL no tiene formato mysql:// válido.',
    })
    process.exit(1)
  }

  const host = url.hostname
  const port = Number(url.port || 3306)
  const database = url.pathname.replace(/^\//, '')

  if (url.protocol !== 'mysql:' || !host || !database || !url.username) {
    printResult({
      step: 'configuración',
      ok: false,
      detail: 'La URL debe incluir protocolo mysql://, host, usuario y base de datos.',
    })
    process.exit(1)
  }

  console.log('Validando base de datos de producción sin migrar ni modificar datos.')
  console.log(`Host: ${maskHost(host)}`)
  console.log(`Puerto: ${port}`)
  console.log(`Base: ${database}`)

  try {
    const records = await dns.lookup(host, { all: true })
    printResult({
      step: 'DNS',
      ok: true,
      detail: records.map((record) => record.address).join(', '),
    })
  } catch (error) {
    printResult({
      step: 'DNS',
      ok: false,
      detail: `${classifyConnectionError(error)}. Revise DB_HOST.`,
    })
    process.exit(1)
  }

  try {
    await checkTcp(host, port)
    printResult({ step: 'TCP', ok: true, detail: `Puerto ${port} accesible.` })
  } catch (error) {
    printResult({
      step: 'TCP',
      ok: false,
      detail: `${classifyConnectionError(error)}. Revise firewall, puerto o Remote Database Access.`,
    })
    process.exit(1)
  }

  let sslActive = false

  try {
    const connection = await mariadb.createConnection(buildDriverConfig(url))
    const versionRows = await connection.query<Array<{ version: string }>>('SELECT VERSION() AS version')
    const sslRows = await connection.query<Array<{ Variable_name: string; Value: string }>>(
      "SHOW STATUS LIKE 'Ssl_cipher'",
    )
    sslActive = Boolean(sslRows[0]?.Value)
    printResult({
      step: 'MySQL',
      ok: true,
      detail: `Autenticación correcta. Versión: ${versionRows[0]?.version ?? 'no disponible'}. SSL: ${sslActive ? 'activo' : 'inactivo'}.`,
    })
    await connection.end()
  } catch (error) {
    printResult({
      step: 'MySQL',
      ok: false,
      detail: `${classifyConnectionError(error)}. No se imprimieron credenciales.`,
    })
    process.exit(1)
  }

  const prisma = new PrismaClient({
    adapter: new PrismaMariaDb(rawUrl),
    errorFormat: 'minimal',
  })

  try {
    await prisma.$queryRaw`SELECT 1`
    printResult({
      step: 'Prisma',
      ok: true,
      detail: 'Conexión de solo lectura verificada.',
    })
  } catch (error) {
    printResult({
      step: 'Prisma',
      ok: false,
      detail: `${classifyConnectionError(error)}. Revise compatibilidad de Prisma, SSL o permisos.`,
    })
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }

  const durationMs = Math.round(performance.now() - startedAt)
  console.log(`Duración: ${durationMs} ms`)
  console.log(`SSL final: ${sslActive ? 'activo' : 'inactivo'}`)
}

main().catch((error) => {
  printResult({
    step: 'validación',
    ok: false,
    detail: `${classifyConnectionError(error)}. No se imprimieron secretos.`,
  })
  process.exit(1)
})
