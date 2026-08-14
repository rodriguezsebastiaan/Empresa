import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadDotenv } from 'dotenv'
import mariadb from 'mariadb'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'
import { buildMysqlPoolConfig, getMysqlConnectionSummary } from '@/lib/mysql-config'

for (const fileName of ['.env', '.env.local']) {
  const filePath = resolve(process.cwd(), fileName)

  if (existsSync(filePath)) {
    loadDotenv({ path: filePath, override: false, quiet: true })
  }
}

function fail(message: string): never {
  console.error(`ERROR ${message}`)
  process.exit(1)
}

function sanitizeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)

  return message
    .replace(process.env.DATABASE_URL?.trim() ?? '', '[REDACTED_DATABASE_URL]')
    .replace(process.env.PRODUCTION_APP_DATABASE_URL?.trim() ?? '', '[REDACTED_APP_DATABASE_URL]')
    .replace(process.env.PRODUCTION_DATABASE_URL?.trim() ?? '', '[REDACTED_PRODUCTION_DATABASE_URL]')
    .replace(/password=([^\s;]+)/gi, 'password=[REDACTED]')
}

async function main() {
  const connectionString =
    process.env.PRODUCTION_APP_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim()

  if (!connectionString) {
    fail('Falta PRODUCTION_APP_DATABASE_URL o DATABASE_URL.')
  }

  if (process.env.MYSQL_SSL_ENABLED?.trim().toLowerCase() !== 'true') {
    fail('MYSQL_SSL_ENABLED debe ser true para verificar TLS.')
  }

  const summary = getMysqlConnectionSummary(connectionString)

  console.log('Verificando MySQL TLS sin modificar datos.')
  console.log(`Host: ${summary.host}`)
  console.log(`Puerto: ${summary.port}`)
  console.log(`Base: ${summary.database}`)
  console.log(`Usuario: ${summary.user}`)
  console.log(`MYSQL_SSL_CA configurado: ${summary.sslCaConfigured ? 'si' : 'no'}`)
  console.log(`MYSQL_HOSTNAME configurado: ${summary.hostnameOverrideConfigured ? 'si' : 'no'}`)

  const poolConfig = buildMysqlPoolConfig(connectionString)
  const connection = await mariadb.createConnection(poolConfig)

  try {
    const sslRows = await connection.query<Array<{ Value: string }>>(
      "SHOW STATUS LIKE 'Ssl_cipher'",
    )
    const sslCipher = sslRows[0]?.Value ?? ''

    if (!sslCipher) {
      fail('La conexion se abrio, pero Ssl_cipher esta vacio.')
    }

    console.log('MySQL TLS directo: OK')
    console.log(`Ssl_cipher activo: ${sslCipher ? 'si' : 'no'}`)
  } finally {
    await connection.end()
  }

  const prisma = new PrismaClient({
    adapter: new PrismaMariaDb(poolConfig),
    errorFormat: 'minimal',
  })

  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('Prisma TLS: OK')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  fail(`No fue posible validar TLS: ${sanitizeError(error)}`)
})
