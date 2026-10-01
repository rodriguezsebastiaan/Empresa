import assert from 'node:assert/strict'
import test, { after } from 'node:test'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadDotenv } from 'dotenv'
import { rescheduleAdvisoryBooking } from '@/lib/admin-data'
import { disconnectDb, getDb } from '@/lib/db'
import { addDaysToDateValue, getTodayInAdvisoryZone } from '@/lib/advisory-time'
import {
  assertSlotAvailable,
  buildAvailabilityRangesFromTimes,
  ensureAvailabilitySettings,
  listAvailableSlots,
} from '@/lib/availability-service'

for (const fileName of ['.env', '.env.local']) {
  const filePath = resolve(process.cwd(), fileName)

  if (existsSync(filePath)) {
    loadDotenv({ path: filePath, override: true })
  }
}

const today = getTodayInAdvisoryZone()
const testDate = addDaysToDateValue(today, 7)
const specialDate = addDaysToDateValue(today, 8)
const exactDate = addDaysToDateValue(today, 9)
const blockedDate = addDaysToDateValue(today, 10)
const restoreDate = addDaysToDateValue(today, 11)
const sourceDate = addDaysToDateValue(today, 12)
const targetDate = addDaysToDateValue(today, 13)

after(async () => {
  await disconnectDb()
})

test('availability generates slots from weekly rules and removes local bookings', async () => {
  const db = getDb()
  const settings = await ensureAvailabilitySettings()
  const requestId = `test-${Date.now()}`

  const initial = await listAvailableSlots(testDate)
  assert.equal(initial.configured, true)
  assert.ok(initial.slots.some((slot) => slot.value === '09:00'))

  const slot = await assertSlotAvailable(testDate, '09:00')

  const booking = await db.advisoryBooking.create({
    data: {
      requestId,
      slotKey: slot.slotKey,
      status: 'CONFIRMED',
      fullName: 'Reserva Temporal QA',
      company: 'Conexacod QA',
      email: 'qa-temporal@example.com',
      emailNormalized: 'qa-temporal@example.com',
      phone: '3000000000',
      city: 'Manizales',
      processGoal: 'Prueba temporal de disponibilidad local.',
      modality: settings.defaultModality,
      timezone: settings.timezoneLabel,
      scheduledDate: testDate,
      scheduledTime: '09:00',
      startAt: slot.startAt,
      endAt: slot.endAt,
      durationMinutes: settings.durationMinutes,
      privacyAcceptedAt: new Date(),
      privacyPolicyVersion: 'QA temporal',
      googleCalendarEventId: `test-calendar-${requestId}`,
      calendarEventStatus: 'SKIPPED',
      calendarSyncStatus: 'SKIPPED',
      clientEmailStatus: 'SKIPPED',
      customerEmailStatus: 'SKIPPED',
      internalEmailStatus: 'SKIPPED',
      companyEmailStatus: 'SKIPPED',
    },
  })

  try {
    const afterBooking = await listAvailableSlots(testDate)
    assert.ok(!afterBooking.slots.some((item) => item.value === '09:00'))

    await assert.rejects(() => assertSlotAvailable(testDate, '09:00'), /SLOT_NOT_AVAILABLE/)
  } finally {
    await db.advisoryBooking.delete({ where: { id: booking.id } })
  }
})

test('availability respects blocked periods and special dates', async () => {
  const db = getDb()
  const settings = await ensureAvailabilitySettings()

  const blocked = await db.blockedPeriod.create({
    data: {
      settingsId: settings.id,
      date: testDate,
      startTime: '10:00',
      endTime: '11:00',
      reason: 'QA temporal',
    },
  })

  try {
    const blockedSlots = await listAvailableSlots(testDate)
    assert.ok(!blockedSlots.slots.some((item) => item.value === '10:00'))
  } finally {
    await db.blockedPeriod.delete({ where: { id: blocked.id } })
  }

  const exception = await db.availabilityException.create({
    data: {
      settingsId: settings.id,
      date: specialDate,
      type: 'SPECIAL_HOURS',
      reason: 'QA temporal',
      ranges: {
        create: {
          startTime: '15:00',
          endTime: '16:00',
        },
      },
    },
  })

  try {
    const special = await listAvailableSlots(specialDate)
    assert.deepEqual(
      special.slots.map((slot) => slot.value),
      ['15:00'],
    )
  } finally {
    await db.availabilityException.delete({ where: { id: exception.id } })
  }
})

test('specific dates override weekly rules with exact configured hours', async () => {
  const db = getDb()
  const settings = await ensureAvailabilitySettings()
  const ranges = buildAvailabilityRangesFromTimes(['14:00', '15:00', '16:00'], settings.durationMinutes)

  const exception = await db.availabilityException.create({
    data: {
      settingsId: settings.id,
      date: exactDate,
      type: 'SPECIAL_HOURS',
      reason: 'QA temporal disponibilidad especifica',
      ranges: {
        create: ranges,
      },
    },
  })

  try {
    const availability = await listAvailableSlots(exactDate)
    assert.deepEqual(
      availability.slots.map((slot) => slot.value),
      ['14:00', '15:00', '16:00'],
    )
  } finally {
    await db.availabilityException.delete({ where: { id: exception.id } })
  }
})

test('blocked specific date hides all weekly availability', async () => {
  const db = getDb()
  const settings = await ensureAvailabilitySettings()

  const exception = await db.availabilityException.create({
    data: {
      settingsId: settings.id,
      date: blockedDate,
      type: 'BLOCKED_DAY',
      reason: 'QA bloqueo total',
    },
  })

  try {
    const availability = await listAvailableSlots(blockedDate)
    assert.deepEqual(availability.slots, [])
  } finally {
    await db.availabilityException.delete({ where: { id: exception.id } })
  }
})

test('removing a specific date restores weekly rules', async () => {
  const db = getDb()
  const settings = await ensureAvailabilitySettings()
  const weeklyRule = await db.availabilityRule.create({
    data: {
      settingsId: settings.id,
      weekday: 4,
      startTime: '09:00',
      endTime: '10:00',
      sortOrder: 900,
    },
  })

  const exception = await db.availabilityException.create({
    data: {
      settingsId: settings.id,
      date: restoreDate,
      type: 'SPECIAL_HOURS',
      reason: 'QA restaurar regla semanal',
      ranges: {
        create: buildAvailabilityRangesFromTimes(['16:00'], settings.durationMinutes),
      },
    },
  })

  const special = await listAvailableSlots(restoreDate)
  assert.deepEqual(
    special.slots.map((slot) => slot.value),
    ['16:00'],
  )

  await db.availabilityException.delete({ where: { id: exception.id } })

  try {
    const restored = await listAvailableSlots(restoreDate)
    assert.ok(restored.slots.some((slot) => slot.value === '09:00'))
  } finally {
    await db.availabilityRule.deleteMany({ where: { id: weeklyRule.id } })
  }
})

test('reschedule moves an active booking to selected target availability', async () => {
  const db = getDb()
  const settings = await ensureAvailabilitySettings()
  const requestId = `test-reschedule-${Date.now()}`
  const sourceSlot = await assertSlotAvailable(sourceDate, '09:00')
  const admin = await db.adminUser.findFirst({ select: { id: true } })

  assert.ok(admin)

  const targetException = await db.availabilityException.create({
    data: {
      settingsId: settings.id,
      date: targetDate,
      type: 'SPECIAL_HOURS',
      reason: 'QA destino reagendamiento',
      ranges: {
        create: buildAvailabilityRangesFromTimes(['14:00'], settings.durationMinutes),
      },
    },
  })

  const booking = await db.advisoryBooking.create({
    data: {
      requestId,
      slotKey: sourceSlot.slotKey,
      status: 'CONFIRMED',
      fullName: 'Reserva Reagendamiento QA',
      company: 'Conexacod QA',
      email: 'qa-reagendar@example.com',
      emailNormalized: 'qa-reagendar@example.com',
      phone: '3000000000',
      city: 'Manizales',
      processGoal: 'Prueba temporal de reagendamiento local.',
      modality: settings.defaultModality,
      timezone: settings.timezoneLabel,
      scheduledDate: sourceDate,
      scheduledTime: '09:00',
      startAt: sourceSlot.startAt,
      endAt: sourceSlot.endAt,
      durationMinutes: settings.durationMinutes,
      privacyAcceptedAt: new Date(),
      privacyPolicyVersion: 'QA temporal',
      calendarEventStatus: 'SKIPPED',
      calendarSyncStatus: 'SKIPPED',
      clientEmailStatus: 'SKIPPED',
      customerEmailStatus: 'SKIPPED',
      internalEmailStatus: 'SKIPPED',
      companyEmailStatus: 'SKIPPED',
    },
  })

  try {
    await rescheduleAdvisoryBooking({
      id: booking.id,
      adminUserId: admin.id,
      date: targetDate,
      time: '14:00',
      note: 'QA reagendamiento masivo',
    })

    const moved = await db.advisoryBooking.findUniqueOrThrow({
      where: { id: booking.id },
      select: {
        status: true,
        scheduledDate: true,
        scheduledTime: true,
      },
    })

    assert.equal(moved.status, 'RESCHEDULED')
    assert.equal(moved.scheduledDate, targetDate)
    assert.equal(moved.scheduledTime, '14:00')
  } finally {
    await db.advisoryBooking.deleteMany({ where: { id: booking.id } })
    await db.availabilityException.deleteMany({ where: { id: targetException.id } })
  }
})
