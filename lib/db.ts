import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as typeof globalThis & {
  __konamyPrisma?: PrismaClient
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL?.trim()

  if (!connectionString) {
    throw new Error('DATABASE_URL_NOT_CONFIGURED')
  }

  const adapter = new PrismaPg({
    connectionString,
  })

  return new PrismaClient({
    adapter,
    errorFormat: 'minimal',
  })
}

export function getDb() {
  if (!globalForPrisma.__konamyPrisma) {
    globalForPrisma.__konamyPrisma = createPrismaClient()
  }

  return globalForPrisma.__konamyPrisma
}

export async function disconnectDb() {
  if (globalForPrisma.__konamyPrisma) {
    await globalForPrisma.__konamyPrisma.$disconnect()
  }

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.__konamyPrisma = undefined
  }
}
