import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadDotenv } from 'dotenv'
import EmbeddedPostgres from 'embedded-postgres'

for (const fileName of ['.env', '.env.local']) {
  const filePath = resolve(process.cwd(), fileName)

  if (existsSync(filePath)) {
    loadDotenv({ path: filePath, override: true })
  }
}

function readPort() {
  const parsed = Number.parseInt(process.env.LOCAL_POSTGRES_PORT ?? '54329', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 54329
}

const port = readPort()
const database = process.env.LOCAL_POSTGRES_DB?.trim() || 'konamy'
const user = process.env.LOCAL_POSTGRES_USER?.trim() || 'postgres'
const password = process.env.LOCAL_POSTGRES_PASSWORD?.trim() || 'postgres'
const databaseDir = resolve(process.cwd(), '.local', 'postgres')

mkdirSync(resolve(process.cwd(), '.local'), { recursive: true })

const pg = new EmbeddedPostgres({
  databaseDir,
  port,
  user,
  password,
  persistent: true,
  onLog: () => {},
})

async function ensureDatabase() {
  try {
    await pg.createDatabase(database)
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : ''

    if (!message.includes('already exists')) {
      throw error
    }
  }
}

async function stopAndExit(code = 0) {
  try {
    await pg.stop()
  } finally {
    process.exit(code)
  }
}

async function main() {
  await pg.initialise()
  await pg.start()
  await ensureDatabase()

  const connectionString = `postgresql://${user}:${password}@127.0.0.1:${port}/${database}`

  console.log('LOCAL_POSTGRES_READY')
  console.log(`DATABASE_URL=${connectionString}`)
  console.log(`DATA_DIR=${databaseDir}`)
  console.log('Press Ctrl+C to stop the local instance.')

  process.on('SIGINT', () => {
    void stopAndExit(0)
  })

  process.on('SIGTERM', () => {
    void stopAndExit(0)
  })
}

main().catch(async (error) => {
  console.error(error)
  await stopAndExit(1)
})
