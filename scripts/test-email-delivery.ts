import assert from 'node:assert/strict'
import test from 'node:test'
import {
  EmailDeliveryService,
  InMemoryEmailDeliveryRepository,
  MockEmailProvider,
  type EmailMessage,
} from '@/lib/email-delivery'
import { renderEmailTemplate } from '@/lib/email-templates'

function sampleMessage(to = 'cliente@example.com'): EmailMessage {
  return {
    to,
    subject: 'Confirmación Conexacod',
    html: '<p>Contenido seguro</p>',
    text: 'Contenido seguro',
  }
}

test('EmailDelivery crea un registro pendiente e idempotente', async () => {
  const repository = new InMemoryEmailDeliveryRepository()
  const service = new EmailDeliveryService(repository)
  const input = {
    type: 'BOOKING_CONFIRMED_CUSTOMER' as const,
    entityType: 'AdvisoryBooking',
    entityId: 'booking_qa_1',
    recipient: 'Cliente@Example.com',
    idempotencyKey: 'booking_qa_1_customer_confirmation',
  }

  const first = await service.create(input)
  const second = await service.create(input)

  assert.equal(first.id, second.id)
  assert.equal(first.status, 'PENDING')
  assert.equal(first.provider, 'MOCK')
  assert.equal(first.recipient, 'cliente@example.com')
  assert.equal(repository.count(), 1)
})

test('EmailDelivery pasa por PROCESSING y termina SENT con proveedor mock', async () => {
  const repository = new InMemoryEmailDeliveryRepository()
  let statusDuringSend = ''
  const service = new EmailDeliveryService(
    repository,
    new MockEmailProvider({
      onSend: () => {
        statusDuringSend = 'PROCESSING'
      },
    }),
  )
  const delivery = await service.create({
    type: 'BOOKING_CONFIRMED_ADMIN',
    entityType: 'AdvisoryBooking',
    entityId: 'booking_qa_2',
    recipient: 'admin@example.com',
    idempotencyKey: 'booking_qa_2_admin_confirmation',
  })
  const result = await service.process(delivery, sampleMessage('admin@example.com'))

  assert.equal(statusDuringSend, 'PROCESSING')
  assert.equal(result.status, 'SENT')
  assert.equal(result.attempts, 1)
  assert.match(result.providerMessageId ?? '', /^mock_/)
  assert.equal(result.lastError, null)
})

test('EmailDelivery registra fallo sanitizado y respeta maxAttempts', async () => {
  const repository = new InMemoryEmailDeliveryRepository()
  const service = new EmailDeliveryService(
    repository,
    new MockEmailProvider({ failWith: 'password=secreta token=abc123 fallo SMTP' }),
  )
  const delivery = await service.create({
    type: 'DIAGNOSTIC_RECEIVED_ADMIN',
    entityType: 'DiagnosticSubmission',
    entityId: 'diagnostic_qa_1',
    recipient: 'admin@example.com',
    idempotencyKey: 'diagnostic_qa_1_admin_notification',
    maxAttempts: 1,
  })

  const failed = await service.process(delivery, sampleMessage('admin@example.com'))
  const retryResults = await service.processRetryable({ buildMessage: () => sampleMessage() })

  assert.equal(failed.status, 'FAILED')
  assert.equal(failed.attempts, 1)
  assert.equal(retryResults.length, 0)
  assert.match(failed.lastError ?? '', /password=\[redacted\]/)
  assert.match(failed.lastError ?? '', /token=\[redacted\]/)
})

test('EmailDelivery reintenta pendientes y fallidos elegibles', async () => {
  const repository = new InMemoryEmailDeliveryRepository()
  const failingService = new EmailDeliveryService(repository, new MockEmailProvider({ failWith: 'primer fallo' }))
  const delivery = await failingService.create({
    type: 'BOOKING_RESCHEDULED',
    entityType: 'AdvisoryBooking',
    entityId: 'booking_qa_3',
    recipient: 'cliente@example.com',
    idempotencyKey: 'booking_qa_3_rescheduled',
    maxAttempts: 3,
  })
  const failed = await failingService.process(delivery, sampleMessage())
  const successService = new EmailDeliveryService(repository, new MockEmailProvider())
  const results = await successService.processRetryable({ buildMessage: () => sampleMessage() })

  assert.equal(failed.status, 'FAILED')
  assert.equal(results.length, 1)
  assert.equal(results[0].status, 'SENT')
  assert.equal(results[0].attempts, 2)
})

test('Plantillas cubren eventos principales y escapan contenido del usuario', () => {
  const diagnostic = renderEmailTemplate({
    type: 'DIAGNOSTIC_RECEIVED_CUSTOMER',
    data: {
      customerName: '<script>alert(1)</script>',
      company: 'Empresa QA',
      diagnosticId: 'diagnostic_qa_2',
    },
  })
  const booking = renderEmailTemplate({
    type: 'BOOKING_ONE_HOUR_REMINDER',
    data: {
      customerName: 'Cliente QA',
      company: 'Empresa QA',
      bookingId: 'booking_qa_4',
      scheduledAt: '02/09/2026, 9:00 a. m.',
      timezone: 'America/Bogota',
    },
  })

  assert.match(diagnostic.subject, /Diagnóstico recibido/)
  assert.doesNotMatch(diagnostic.html, /<script>/)
  assert.match(diagnostic.html, /&lt;script&gt;/)
  assert.match(booking.subject, /Recordatorio/)
  assert.match(booking.text, /America\/Bogota/)
})
