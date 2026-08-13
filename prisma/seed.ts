import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadDotenv } from 'dotenv'
import { disconnectDb, getDb } from '../lib/db'
import { hashPassword, normalizeEmail, sanitizeInline } from '../lib/security'

for (const fileName of ['.env', '.env.local']) {
  const filePath = resolve(process.cwd(), fileName)

  if (existsSync(filePath)) {
    loadDotenv({ path: filePath, override: true })
  }
}

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

  const owner = await prisma.adminUser.upsert({
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

  const permissions = [
    ['dashboard:view', 'Ver indicadores ejecutivos del panel.'],
    ['contacts:view', 'Ver formularios breves.'],
    ['contacts:edit', 'Actualizar estados y notas de formularios breves.'],
    ['diagnostics:view', 'Ver diagnósticos empresariales.'],
    ['diagnostics:edit', 'Actualizar estados y notas de diagnósticos empresariales.'],
    ['bookings:view', 'Ver asesorías agendadas.'],
    ['bookings:edit', 'Administrar estados, notas y reagendamientos de asesorías.'],
    ['exports:download', 'Exportar información operativa en CSV.'],
  ] as const

  for (const [key, description] of permissions) {
    const permission = await prisma.adminPermission.upsert({
      where: { key },
      update: { description },
      create: { key, description },
    })

    for (const role of ['OWNER', 'ADMIN'] as const) {
      await prisma.adminRolePermission.upsert({
        where: {
          role_permissionId: {
            role,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          role,
          permissionId: permission.id,
        },
      })
    }
  }

  const settings = await prisma.availabilitySettings.findFirst({
    orderBy: { createdAt: 'asc' },
  })

  if (!settings) {
    await prisma.availabilitySettings.create({
      data: {
        isEnabled: true,
        timezone: 'America/Bogota',
        timezoneLabel: 'America/Bogota',
        durationMinutes: 45,
        bufferMinutes: 15,
        minNoticeHours: 12,
        maxDaysAhead: 30,
        defaultModality: 'Virtual',
        calendarMockMode: 'none',
        updatedByAdminId: owner.id,
        rules: {
          create: [
            { weekday: 1, startTime: '09:00', endTime: '12:00', sortOrder: 10 },
            { weekday: 1, startTime: '14:00', endTime: '17:00', sortOrder: 20 },
            { weekday: 2, startTime: '09:00', endTime: '12:00', sortOrder: 10 },
            { weekday: 2, startTime: '14:00', endTime: '17:00', sortOrder: 20 },
            { weekday: 3, startTime: '09:00', endTime: '12:00', sortOrder: 10 },
            { weekday: 3, startTime: '14:00', endTime: '17:00', sortOrder: 20 },
            { weekday: 4, startTime: '09:00', endTime: '12:00', sortOrder: 10 },
            { weekday: 4, startTime: '14:00', endTime: '17:00', sortOrder: 20 },
            { weekday: 5, startTime: '09:00', endTime: '12:00', sortOrder: 10 },
            { weekday: 5, startTime: '14:00', endTime: '17:00', sortOrder: 20 },
          ],
        },
      },
    })
  }
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
