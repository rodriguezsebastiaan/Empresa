import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { config as loadDotenv } from 'dotenv'

const EXPECTED_HOST = '54.84.0.47'
const EXPECTED_PORT = '3306'
const EXPECTED_DATABASE = 'rserpler4_empresaa'
const EXPECTED_USER = 'rserpler4_empresaa'
const INITIAL_MIGRATION = '20260813163000_mysql_initial'
const MIGRATION_NAME_PATTERN = /^\d{14}_[a-z0-9_]+$/

type GuardCommand = 'status' | 'resolve' | 'deploy' | 'seed'

function fail(message: string): never {
  console.error(`ERROR ${message}`)
  process.exit(1)
}

function loadLocalEnvironment() {
  const envPath = resolve(process.cwd(), '.env.local')

  if (!existsSync(envPath)) {
    fail('No existe .env.local en la raiz del proyecto.')
  }

  loadDotenv({ path: envPath, override: false, quiet: true })
}

function parseProductionUrl() {
  const rawUrl = process.env.PRODUCTION_DATABASE_URL?.trim()

  if (!rawUrl) {
    fail('Falta PRODUCTION_DATABASE_URL en .env.local.')
  }

  let url: URL

  try {
    url = new URL(rawUrl)
  } catch {
    fail('PRODUCTION_DATABASE_URL no tiene formato valido.')
  }

  const database = url.pathname.replace(/^\//, '')
  const user = decodeURIComponent(url.username)
  const passwordLength = decodeURIComponent(url.password).length
  const port = url.port || EXPECTED_PORT

  const summary = {
    protocol: url.protocol,
    host: url.hostname,
    port,
    database,
    user,
    passwordConfigured: passwordLength > 0,
  }

  if (summary.protocol !== 'mysql:') {
    fail('La URL de produccion debe usar protocolo mysql://.')
  }

  if (summary.host !== EXPECTED_HOST) {
    fail(`Host inesperado. Esperado: ${EXPECTED_HOST}. Recibido: ${summary.host || 'vacio'}.`)
  }

  if (summary.port !== EXPECTED_PORT) {
    fail(`Puerto inesperado. Esperado: ${EXPECTED_PORT}. Recibido: ${summary.port || 'vacio'}.`)
  }

  if (summary.database !== EXPECTED_DATABASE) {
    fail(`Base inesperada. Esperada: ${EXPECTED_DATABASE}. Recibida: ${summary.database || 'vacia'}.`)
  }

  if (summary.user !== EXPECTED_USER) {
    fail(`Usuario inesperado. Esperado: ${EXPECTED_USER}. Recibido: ${summary.user || 'vacio'}.`)
  }

  if (!summary.passwordConfigured) {
    fail('La contraseña de PRODUCTION_DATABASE_URL esta vacia.')
  }

  url.searchParams.set('allowPublicKeyRetrieval', 'true')

  return {
    prismaUrl: url.toString(),
    summary,
  }
}

function getCommand(): GuardCommand {
  const command = process.argv[2]

  if (command === 'status' || command === 'resolve' || command === 'deploy' || command === 'seed') {
    return command
  }

  fail('Comando invalido. Use status, resolve, deploy o seed.')
}

function getMigrationToResolve(command: GuardCommand) {
  if (command !== 'resolve') {
    return INITIAL_MIGRATION
  }

  const migrationName = process.argv[3]?.trim() || INITIAL_MIGRATION

  if (!MIGRATION_NAME_PATTERN.test(migrationName) || basename(migrationName) !== migrationName) {
    fail('Nombre de migracion invalido.')
  }

  const migrationPath = resolve(process.cwd(), 'prisma', 'migrations', migrationName)

  if (!existsSync(migrationPath)) {
    fail(`No existe la migracion local prisma/migrations/${migrationName}.`)
  }

  return migrationName
}

function getProcessArgs(command: GuardCommand, migrationToResolve: string) {
  if (command === 'seed') {
    return {
      command: 'node',
      args: ['scripts/run-ts.mjs', 'prisma/seed.ts'],
    }
  }

  if (command === 'status') {
    return {
      command: 'npx',
      args: ['prisma', 'migrate', 'status'],
    }
  }

  if (command === 'resolve') {
    return {
      command: 'npx',
      args: ['prisma', 'migrate', 'resolve', '--applied', migrationToResolve],
    }
  }

  return {
    command: 'npx',
    args: ['prisma', 'migrate', 'deploy'],
  }
}

function assertWriteConfirmed(command: GuardCommand) {
  if (command === 'status') {
    return
  }

  if (process.env.CONFIRM_PRODUCTION_DB !== 'YES') {
    fail(`Operacion de escritura bloqueada. Para ejecutar ${command}, use CONFIRM_PRODUCTION_DB=YES.`)
  }
}

function assertSeedEnvironment(command: GuardCommand) {
  if (command !== 'seed') {
    return
  }

  const required = ['ADMIN_SEED_NAME', 'ADMIN_SEED_EMAIL', 'ADMIN_SEED_PASSWORD']
  const missing = required.filter((key) => !process.env[key]?.trim())

  if (missing.length > 0) {
    fail(`Faltan variables para seed: ${missing.join(', ')}.`)
  }
}

loadLocalEnvironment()

const command = getCommand()
const { prismaUrl, summary } = parseProductionUrl()
const migrationToResolve = getMigrationToResolve(command)
const processArgs = getProcessArgs(command, migrationToResolve)

assertWriteConfirmed(command)
assertSeedEnvironment(command)

console.log('Prisma production guard')
console.log(`Comando: ${command}`)
if (command === 'resolve') {
  console.log(`Migracion: ${migrationToResolve}`)
}
console.log(`Host: ${summary.host}`)
console.log(`Puerto: ${summary.port}`)
console.log(`Base: ${summary.database}`)
console.log(`Usuario: ${summary.user}`)
console.log(`Password configurado: ${summary.passwordConfigured ? 'si' : 'no'}`)

const result = spawnSync(processArgs.command, processArgs.args, {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    DATABASE_URL: prismaUrl,
  },
})

process.exit(result.status ?? 1)
