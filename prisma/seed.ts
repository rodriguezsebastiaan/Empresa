import { disconnectDb, getDb } from '../lib/db'
import { hashPassword, normalizeEmail, sanitizeInline } from '../lib/security'

async function main() {
  const prisma = getDb()
  const email = process.env.ADMIN_SEED_EMAIL?.trim()
  const password = process.env.ADMIN_SEED_PASSWORD?.trim()
  const name = sanitizeInline(process.env.ADMIN_SEED_NAME?.trim() || 'Administrador Konamy')

  if (!email || !password) {
    throw new Error(
      'ADMIN_SEED_EMAIL y ADMIN_SEED_PASSWORD son obligatorios para crear el primer administrador.',
    )
  }

  const emailNormalized = normalizeEmail(email)
  const passwordHash = await hashPassword(password)

  await prisma.adminUser.upsert({
    where: {
      emailNormalized,
    },
    update: {
      email: sanitizeInline(email),
      name,
      passwordHash,
      isActive: true,
      role: 'OWNER',
    },
    create: {
      email: sanitizeInline(email),
      emailNormalized,
      name,
      passwordHash,
      isActive: true,
      role: 'OWNER',
    },
  })
}

main()
  .then(async () => {
    await disconnectDb()
  })
  .catch(async (error) => {
    console.error(error)
    await disconnectDb()
    process.exit(1)
  })
