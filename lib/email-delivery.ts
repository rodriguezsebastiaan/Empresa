import type {
  EmailDelivery,
  EmailDeliveryProvider,
  EmailDeliveryStatus,
  EmailDeliveryType,
  PrismaClient,
} from '@prisma/client'
import { getDb } from '@/lib/db'
import { normalizeEmail, sanitizeInline } from '@/lib/security'

export type EmailMessage = {
  to: string
  subject: string
  html: string
  text: string
}

export type CreateEmailDeliveryInput = {
  type: EmailDeliveryType
  entityType: string
  entityId: string
  recipient: string
  idempotencyKey: string
  provider?: EmailDeliveryProvider
  scheduledFor?: Date | null
  maxAttempts?: number
}

export type EmailProviderResult =
  | { ok: true; providerMessageId: string }
  | { ok: false; error: string }

export type EmailProvider = {
  kind: EmailDeliveryProvider
  send(message: EmailMessage): Promise<EmailProviderResult>
}

export type EmailDeliveryRepository = {
  create(input: CreateEmailDeliveryInput): Promise<EmailDelivery>
  findByIdempotencyKey(idempotencyKey: string): Promise<EmailDelivery | null>
  markProcessing(id: string, now: Date): Promise<EmailDelivery>
  markSent(id: string, providerMessageId: string, now: Date): Promise<EmailDelivery>
  markFailed(id: string, error: string, now: Date): Promise<EmailDelivery>
  listRetryable(now: Date, limit: number): Promise<EmailDelivery[]>
}

type ProcessRetryableOptions = {
  now?: Date
  limit?: number
  buildMessage: (delivery: EmailDelivery) => Promise<EmailMessage> | EmailMessage
}

const DEFAULT_MAX_ATTEMPTS = 3
const MAX_ERROR_LENGTH = 700

function cleanEntity(value: string, fallback: string) {
  const cleaned = sanitizeInline(value)
  return cleaned.length > 0 ? cleaned : fallback
}

function sanitizeProviderError(error: string) {
  return sanitizeInline(error)
    .replace(/(password|token|secret|api[_-]?key|authorization)=\S+/gi, '$1=[redacted]')
    .slice(0, MAX_ERROR_LENGTH)
}

function sanitizeCreateInput(input: CreateEmailDeliveryInput): CreateEmailDeliveryInput {
  const recipient = normalizeEmail(input.recipient)

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    throw new Error('INVALID_EMAIL_RECIPIENT')
  }

  if (input.idempotencyKey.trim().length < 8) {
    throw new Error('INVALID_IDEMPOTENCY_KEY')
  }

  return {
    ...input,
    entityType: cleanEntity(input.entityType, 'unknown'),
    entityId: cleanEntity(input.entityId, 'unknown'),
    recipient,
    idempotencyKey: sanitizeInline(input.idempotencyKey),
    provider: input.provider ?? 'MOCK',
    scheduledFor: input.scheduledFor ?? null,
    maxAttempts: Math.max(1, input.maxAttempts ?? DEFAULT_MAX_ATTEMPTS),
  }
}

function cloneDelivery(delivery: EmailDelivery): EmailDelivery {
  return {
    ...delivery,
    scheduledFor: delivery.scheduledFor ? new Date(delivery.scheduledFor) : null,
    processingStartedAt: delivery.processingStartedAt ? new Date(delivery.processingStartedAt) : null,
    sentAt: delivery.sentAt ? new Date(delivery.sentAt) : null,
    failedAt: delivery.failedAt ? new Date(delivery.failedAt) : null,
    createdAt: new Date(delivery.createdAt),
    updatedAt: new Date(delivery.updatedAt),
  }
}

export class MockEmailProvider implements EmailProvider {
  kind: EmailDeliveryProvider = 'MOCK'

  constructor(private readonly options: { failWith?: string; onSend?: (message: EmailMessage) => void } = {}) {}

  async send(message: EmailMessage): Promise<EmailProviderResult> {
    this.options.onSend?.(message)

    if (this.options.failWith) {
      return { ok: false, error: this.options.failWith }
    }

    return { ok: true, providerMessageId: `mock_${Date.now()}_${Math.random().toString(16).slice(2)}` }
  }
}

export class ResendEmailProvider implements EmailProvider {
  kind: EmailDeliveryProvider = 'RESEND'

  async send(): Promise<EmailProviderResult> {
    return {
      ok: false,
      error: 'RESEND_PROVIDER_NOT_CONNECTED',
    }
  }
}

export class PrismaEmailDeliveryRepository implements EmailDeliveryRepository {
  constructor(private readonly db: PrismaClient = getDb()) {}

  async create(input: CreateEmailDeliveryInput) {
    const data = sanitizeCreateInput(input)
    const existing = await this.findByIdempotencyKey(data.idempotencyKey)

    if (existing) {
      return existing
    }

    return this.db.emailDelivery.create({
      data: {
        type: data.type,
        entityType: data.entityType,
        entityId: data.entityId,
        recipient: data.recipient,
        idempotencyKey: data.idempotencyKey,
        provider: data.provider,
        scheduledFor: data.scheduledFor,
        maxAttempts: data.maxAttempts,
      },
    })
  }

  findByIdempotencyKey(idempotencyKey: string) {
    return this.db.emailDelivery.findUnique({ where: { idempotencyKey: sanitizeInline(idempotencyKey) } })
  }

  markProcessing(id: string, now: Date) {
    return this.db.emailDelivery.update({
      where: { id },
      data: {
        status: 'PROCESSING',
        processingStartedAt: now,
        attempts: { increment: 1 },
        lastError: null,
      },
    })
  }

  markSent(id: string, providerMessageId: string, now: Date) {
    return this.db.emailDelivery.update({
      where: { id },
      data: {
        status: 'SENT',
        providerMessageId: sanitizeInline(providerMessageId),
        sentAt: now,
        failedAt: null,
        lastError: null,
      },
    })
  }

  markFailed(id: string, error: string, now: Date) {
    return this.db.emailDelivery.update({
      where: { id },
      data: {
        status: 'FAILED',
        failedAt: now,
        lastError: sanitizeProviderError(error),
      },
    })
  }

  listRetryable(now: Date, limit: number) {
    return this.db.emailDelivery.findMany({
      where: {
        status: { in: ['PENDING', 'FAILED'] },
        attempts: { lt: this.db.emailDelivery.fields.maxAttempts },
        OR: [{ scheduledFor: null }, { scheduledFor: { lte: now } }],
      },
      orderBy: [{ scheduledFor: 'asc' }, { createdAt: 'asc' }],
      take: limit,
    })
  }
}

export class InMemoryEmailDeliveryRepository implements EmailDeliveryRepository {
  private readonly deliveries = new Map<string, EmailDelivery>()
  private sequence = 0

  async create(input: CreateEmailDeliveryInput) {
    const data = sanitizeCreateInput(input)
    const existing = await this.findByIdempotencyKey(data.idempotencyKey)

    if (existing) {
      return existing
    }

    const now = new Date()
    const delivery: EmailDelivery = {
      id: `email_delivery_${++this.sequence}`,
      type: data.type,
      entityType: data.entityType,
      entityId: data.entityId,
      recipient: data.recipient,
      status: 'PENDING',
      provider: data.provider ?? 'MOCK',
      providerMessageId: null,
      idempotencyKey: data.idempotencyKey,
      attempts: 0,
      maxAttempts: data.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
      lastError: null,
      scheduledFor: data.scheduledFor ?? null,
      processingStartedAt: null,
      sentAt: null,
      failedAt: null,
      createdAt: now,
      updatedAt: now,
    }

    this.deliveries.set(delivery.id, delivery)
    return cloneDelivery(delivery)
  }

  async findByIdempotencyKey(idempotencyKey: string) {
    const cleaned = sanitizeInline(idempotencyKey)
    const delivery = [...this.deliveries.values()].find((item) => item.idempotencyKey === cleaned)
    return delivery ? cloneDelivery(delivery) : null
  }

  async markProcessing(id: string, now: Date) {
    const delivery = this.getExisting(id)
    delivery.status = 'PROCESSING'
    delivery.processingStartedAt = now
    delivery.attempts += 1
    delivery.lastError = null
    delivery.updatedAt = now
    return cloneDelivery(delivery)
  }

  async markSent(id: string, providerMessageId: string, now: Date) {
    const delivery = this.getExisting(id)
    delivery.status = 'SENT'
    delivery.providerMessageId = sanitizeInline(providerMessageId)
    delivery.sentAt = now
    delivery.failedAt = null
    delivery.lastError = null
    delivery.updatedAt = now
    return cloneDelivery(delivery)
  }

  async markFailed(id: string, error: string, now: Date) {
    const delivery = this.getExisting(id)
    delivery.status = 'FAILED'
    delivery.failedAt = now
    delivery.lastError = sanitizeProviderError(error)
    delivery.updatedAt = now
    return cloneDelivery(delivery)
  }

  async listRetryable(now: Date, limit: number) {
    return [...this.deliveries.values()]
      .filter((delivery) => {
        const canRunNow = !delivery.scheduledFor || delivery.scheduledFor <= now
        const isRetryableStatus = delivery.status === 'PENDING' || delivery.status === 'FAILED'
        return isRetryableStatus && canRunNow && delivery.attempts < delivery.maxAttempts
      })
      .sort((left, right) => {
        const leftTime = left.scheduledFor?.getTime() ?? left.createdAt.getTime()
        const rightTime = right.scheduledFor?.getTime() ?? right.createdAt.getTime()
        return leftTime - rightTime
      })
      .slice(0, limit)
      .map(cloneDelivery)
  }

  count() {
    return this.deliveries.size
  }

  async getById(id: string) {
    const delivery = this.deliveries.get(id)
    return delivery ? cloneDelivery(delivery) : null
  }

  private getExisting(id: string) {
    const delivery = this.deliveries.get(id)

    if (!delivery) {
      throw new Error('EMAIL_DELIVERY_NOT_FOUND')
    }

    return delivery
  }
}

export class EmailDeliveryService {
  constructor(
    private readonly repository: EmailDeliveryRepository = new PrismaEmailDeliveryRepository(),
    private readonly provider: EmailProvider = new MockEmailProvider(),
  ) {}

  create(input: CreateEmailDeliveryInput) {
    return this.repository.create(input)
  }

  async process(delivery: EmailDelivery, message: EmailMessage) {
    if (delivery.status === 'SENT' || delivery.status === 'CANCELLED') {
      return delivery
    }

    if (delivery.attempts >= delivery.maxAttempts) {
      return delivery
    }

    const now = new Date()
    const processing = await this.repository.markProcessing(delivery.id, now)
    const result = await this.provider.send({
      ...message,
      to: normalizeEmail(message.to),
      subject: sanitizeInline(message.subject),
    })
    const finishedAt = new Date()

    if (result.ok) {
      return this.repository.markSent(processing.id, result.providerMessageId, finishedAt)
    }

    return this.repository.markFailed(processing.id, result.error, finishedAt)
  }

  async processRetryable(options: ProcessRetryableOptions) {
    const now = options.now ?? new Date()
    const deliveries = await this.repository.listRetryable(now, options.limit ?? 10)
    const results: EmailDelivery[] = []

    for (const delivery of deliveries) {
      results.push(await this.process(delivery, await options.buildMessage(delivery)))
    }

    return results
  }
}

export const emailDeliveryStatuses: EmailDeliveryStatus[] = ['PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED']
