import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse as parseDotenv } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

const initialEnv = { ...process.env }
const mergedLocalEnv: Record<string, string> = {}

for (const fileName of ['.env', '.env.local']) {
  const filePath = resolve(process.cwd(), fileName)

  if (existsSync(filePath)) {
    Object.assign(mergedLocalEnv, parseDotenv(readFileSync(filePath)))
  }
}

for (const [key, value] of Object.entries(mergedLocalEnv)) {
  if (initialEnv[key] === undefined) {
    process.env[key] = value
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
