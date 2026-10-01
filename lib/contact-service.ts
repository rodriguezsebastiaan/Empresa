import { DeliveryStatus } from '@prisma/client'
import { siteConfig } from '@/config/site'
import { getDb } from '@/lib/db'
import {
  buildEmailLayout,
  formatEmailDateTime,
  getAdminNotificationDestination,
  getAdminNotificationDestinationLabel,
  getMissingSmtpEnv,
  isSmtpConfigured,
  renderDefinitionList,
  sendEmail,
} from '@/lib/mailer'
import { getRequestMetadata } from '@/lib/request-metadata'
import { normalizeEmail, sanitizeInline, sanitizeMultiline } from '@/lib/security'
import type { ContactFormData } from '@/lib/validation'

type SubmissionResponse = {
  status: number
  body: Record<string, unknown>
}

function sanitizeContactFormData(data: ContactFormData) {
  return {
    name: sanitizeInline(data.name),
    company: sanitizeInline(data.company),
    email: sanitizeInline(data.email),
    emailNormalized: normalizeEmail(data.email),
    phone: sanitizeInline(data.phone),
    subject: sanitizeInline(data.subject),
    message: sanitizeMultiline(data.message),
  }
}

function buildInternalEmail(input: ReturnType<typeof sanitizeContactFormData>, receivedAt: Date) {
  const receivedAtLabel = formatEmailDateTime(receivedAt)

  return {
    subject: `[Contacto] ${input.subject} · ${input.company}`,
    text: [
      'Nuevo contacto desde Conexacod.',
      '',
      `Nombre: ${input.name}`,
      `Empresa: ${input.company}`,
      `Correo: ${input.email}`,
      `Teléfono: ${input.phone}`,
      `Asunto: ${input.subject}`,
      `Fecha: ${receivedAtLabel}`,
      '',
      'Mensaje:',
      input.message,
    ].join('\n'),
    html: buildEmailLayout({
      eyebrow: 'NUEVO CONTACTO',
      title: input.subject,
      intro: 'Se registró una nueva consulta breve desde el sitio corporativo.',
      bodyHtml: renderDefinitionList([
        { label: 'Nombre', value: input.name },
        { label: 'Empresa', value: input.company },
        { label: 'Correo', value: input.email },
        { label: 'Teléfono', value: input.phone },
        { label: 'Asunto', value: input.subject },
        { label: 'Fecha', value: receivedAtLabel },
        { label: 'Mensaje', value: input.message },
      ]),
    }),
  }
}

function buildClientEmail(input: ReturnType<typeof sanitizeContactFormData>, receivedAt: Date) {
  const receivedAtLabel = formatEmailDateTime(receivedAt)

  return {
    subject: 'Recibimos su solicitud de contacto · Conexacod',
    text: [
      `Hola ${input.name},`,
      '',
      'Recibimos su solicitud de contacto y la registramos correctamente.',
      'Revisaremos el contexto compartido para responderle con el siguiente paso más adecuado.',
      '',
      `Empresa: ${input.company}`,
      `Asunto: ${input.subject}`,
      `Fecha: ${receivedAtLabel}`,
      '',
      'Mensaje recibido:',
      input.message,
      '',
      'Conexacod',
    ].join('\n'),
    html: buildEmailLayout({
      eyebrow: 'CONTACTO RECIBIDO',
      title: `Gracias, ${input.name}`,
      intro:
        'Su solicitud ya quedó registrada correctamente en Conexacod. Revisaremos el contexto para responderle por el canal más adecuado.',
      bodyHtml: renderDefinitionList([
        { label: 'Empresa', value: input.company },
        { label: 'Asunto', value: input.subject },
        { label: 'Fecha', value: receivedAtLabel },
        { label: 'Canal siguiente', value: 'Correo, WhatsApp o asesoría según el caso.' },
      { label: 'Privacidad', value: 'La información será tratada según la política de privacidad vigente de Conexacod.' },
      ]),
    }),
  }
}

async function findRecentDuplicateContact(
  input: ReturnType<typeof sanitizeContactFormData>,
) {
  const db = getDb()
  const duplicateWindow = new Date(Date.now() - 10 * 60 * 1000)

  return db.contactSubmission.findFirst({
    where: {
      emailNormalized: input.emailNormalized,
      company: input.company,
      subject: input.subject,
      message: input.message,
      createdAt: {
        gte: duplicateWindow,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      internalEmailStatus: true,
      clientEmailStatus: true,
      lastDeliveryError: true,
    },
  })
}

export async function submitContactForm(
  data: ContactFormData,
  request: Request,
): Promise<SubmissionResponse> {
  let db

  try {
    db = getDb()
  } catch (error) {
    if (error instanceof Error && error.message === 'DATABASE_URL_NOT_CONFIGURED') {
      return {
        status: 503,
        body: {
          success: false,
          configured: false,
          message:
            'El formulario está listo, pero todavía no existe una base de datos configurada para guardar solicitudes reales.',
        },
      }
    }

    throw error
  }

  const payload = sanitizeContactFormData(data)
  const metadata = getRequestMetadata(request)
  const receivedAt = new Date()
  const duplicate = await findRecentDuplicateContact(payload)

  if (duplicate) {
    return {
      status: 200,
      body: {
        success: true,
        stored: true,
        idempotent: true,
        partial: Boolean(duplicate.lastDeliveryError),
        contactId: duplicate.id,
        message:
          duplicate.lastDeliveryError ||
          duplicate.internalEmailStatus === 'FAILED' ||
          duplicate.clientEmailStatus === 'FAILED'
            ? 'La solicitud ya estaba registrada. Algunas notificaciones quedaron pendientes o parciales.'
            : 'La solicitud ya había sido registrada anteriormente.',
      },
    }
  }

  const submission = await db.contactSubmission.create({
    data: {
      status: 'NEW',
      name: payload.name,
      company: payload.company,
      email: payload.email,
      emailNormalized: payload.emailNormalized,
      phone: payload.phone,
      subject: payload.subject,
      message: payload.message,
      privacyAcceptedAt: receivedAt,
      privacyPolicyVersion: siteConfig.legal.privacyPolicyVersionLabel,
      requestOrigin: metadata.requestOrigin,
      requestPath: metadata.requestPath,
      referer: metadata.referer,
      userAgent: metadata.userAgent,
      ipHash: metadata.ipHash,
      statusHistory: {
        create: {
          toStatus: 'NEW',
          note: 'Registro creado desde el formulario breve de contacto.',
        },
      },
    },
  })

  const smtpReady = isSmtpConfigured()
  const destinationEmail = getAdminNotificationDestination('CONTACT_DESTINATION_EMAIL')

  let internalEmailStatus: DeliveryStatus = smtpReady && destinationEmail ? 'PENDING' : 'SKIPPED'
  let clientEmailStatus: DeliveryStatus = smtpReady ? 'PENDING' : 'SKIPPED'
  const notificationIssues: string[] = []

  if (!smtpReady) {
    notificationIssues.push(
      `SMTP pendiente: ${getMissingSmtpEnv().join(', ') || 'revise SMTP_PORT o el proveedor SMTP'}`,
    )
  }

  if (!destinationEmail) {
    notificationIssues.push(getAdminNotificationDestinationLabel('CONTACT_DESTINATION_EMAIL'))
  }

  const internalEmail = buildInternalEmail(payload, receivedAt)
  const clientEmail = buildClientEmail(payload, receivedAt)

  if (smtpReady && destinationEmail) {
    try {
      await sendEmail({
        to: destinationEmail,
        subject: internalEmail.subject,
        text: internalEmail.text,
        html: internalEmail.html,
        replyTo: payload.email,
      })
      internalEmailStatus = 'SENT'
    } catch {
      internalEmailStatus = 'FAILED'
      notificationIssues.push('No fue posible enviar la notificación interna de contacto.')
    }
  }

  if (smtpReady) {
    try {
      await sendEmail({
        to: payload.email,
        subject: clientEmail.subject,
        text: clientEmail.text,
        html: clientEmail.html,
      })
      clientEmailStatus = 'SENT'
    } catch {
      clientEmailStatus = 'FAILED'
      notificationIssues.push('No fue posible enviar la confirmación automática al cliente.')
    }
  }

  await db.contactSubmission.update({
    where: { id: submission.id },
    data: {
      internalEmailStatus,
      clientEmailStatus,
      lastDeliveryAttemptAt: new Date(),
      lastDeliveryError: notificationIssues.length > 0 ? notificationIssues.join(' ') : null,
    },
  })

  return {
    status: 200,
    body: {
      success: true,
      stored: true,
      partial: notificationIssues.length > 0,
      contactId: submission.id,
      message:
        notificationIssues.length > 0
          ? 'La solicitud fue registrada correctamente. Las notificaciones automáticas quedaron pendientes o parciales.'
          : 'La solicitud fue registrada y notificada correctamente.',
    },
  }
}
