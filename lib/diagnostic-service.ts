import { DeliveryStatus } from '@prisma/client'
import { siteConfig } from '@/config/site'
import { getDb } from '@/lib/db'
import { isDiagnosticWebhookConfigured, sendDiagnosticWebhook } from '@/lib/diagnostic-webhook'
import {
  buildEmailLayout,
  getMissingSmtpEnv,
  isSmtpConfigured,
  renderDefinitionList,
  sendEmail,
} from '@/lib/mailer'
import { getRequestMetadata } from '@/lib/request-metadata'
import { normalizeEmail, sanitizeInline, sanitizeMultiline } from '@/lib/security'
import { buildDiagnosticSummary } from '@/lib/submission-summary'
import type { DiagnosticFormData } from '@/lib/validation'

type SubmissionResponse = {
  status: number
  body: Record<string, unknown>
}

function sanitizeDiagnosticFormData(data: DiagnosticFormData) {
  return {
    name: sanitizeInline(data.name),
    company: sanitizeInline(data.company),
    role: sanitizeInline(data.role),
    email: sanitizeInline(data.email),
    emailNormalized: normalizeEmail(data.email),
    phone: sanitizeInline(data.phone),
    city: sanitizeInline(data.city),
    sector: sanitizeInline(data.sector),
    teamSize: sanitizeInline(data.teamSize),
    processes: sanitizeMultiline(data.processes),
    currentProcess: sanitizeMultiline(data.currentProcess),
    tools: sanitizeMultiline(data.tools),
    repetitiveTasks: sanitizeMultiline(data.repetitiveTasks),
    mainProblem: sanitizeMultiline(data.mainProblem),
    expectedResult: sanitizeMultiline(data.expectedResult),
    contactPreference: sanitizeInline(data.contactPreference),
    wantsMeeting: sanitizeInline(data.wantsMeeting),
  }
}

function wantsMeetingToBoolean(value: string) {
  return value.toLowerCase().startsWith('s')
}

function buildInternalEmail(input: ReturnType<typeof sanitizeDiagnosticFormData>, summary: string) {
  return {
    subject: `[Diagnóstico] ${input.company} · ${input.name}`,
    text: [
      'Nuevo diagnóstico empresarial recibido desde Konamy Systems.',
      '',
      summary,
      '',
      `Nombre: ${input.name}`,
      `Empresa: ${input.company}`,
      `Cargo: ${input.role}`,
      `Correo: ${input.email}`,
      `Teléfono: ${input.phone}`,
      `Ciudad: ${input.city}`,
      `Sector: ${input.sector}`,
      `Tamaño aproximado: ${input.teamSize}`,
      '',
      `Procesos a mejorar: ${input.processes}`,
      `Cómo opera hoy: ${input.currentProcess}`,
      `Herramientas actuales: ${input.tools}`,
      `Tareas repetitivas: ${input.repetitiveTasks}`,
      `Problema principal: ${input.mainProblem}`,
      `Resultado esperado: ${input.expectedResult}`,
      `Preferencia de contacto: ${input.contactPreference}`,
      `Interés en asesoría: ${input.wantsMeeting}`,
    ].join('\n'),
    html: buildEmailLayout({
      eyebrow: 'NUEVO DIAGNÓSTICO',
      title: `${input.company} · ${input.name}`,
      intro: summary,
      bodyHtml: renderDefinitionList([
        { label: 'Cargo', value: input.role },
        { label: 'Correo', value: input.email },
        { label: 'Teléfono', value: input.phone },
        { label: 'Ciudad', value: input.city },
        { label: 'Sector', value: input.sector },
        { label: 'Procesos', value: input.processes },
        { label: 'Problema', value: input.mainProblem },
        { label: 'Resultado', value: input.expectedResult },
      ]),
    }),
  }
}

function buildClientEmail(input: ReturnType<typeof sanitizeDiagnosticFormData>, summary: string) {
  return {
    subject: 'Recibimos su diagnóstico empresarial · Konamy Systems',
    text: [
      `Hola ${input.name},`,
      '',
      'Su diagnóstico empresarial quedó registrado correctamente.',
      'Le compartimos un resumen de la información recibida para que tenga trazabilidad del envío.',
      '',
      summary,
      '',
      `Procesos a mejorar: ${input.processes}`,
      `Problema principal: ${input.mainProblem}`,
      `Resultado esperado: ${input.expectedResult}`,
      `Preferencia de contacto: ${input.contactPreference}`,
      `Interés en asesoría: ${input.wantsMeeting}`,
      '',
      'Puede responder este correo si desea ampliar contexto antes de la asesoría.',
      '',
      'Konamy Systems',
    ].join('\n'),
    html: buildEmailLayout({
      eyebrow: 'DIAGNÓSTICO RECIBIDO',
      title: `Gracias, ${input.name}`,
      intro:
        'Su diagnóstico empresarial ya quedó registrado correctamente. Este resumen le sirve como comprobante de lo que recibimos.',
      bodyHtml: renderDefinitionList([
        { label: 'Empresa', value: input.company },
        { label: 'Procesos', value: input.processes },
        { label: 'Problema', value: input.mainProblem },
        { label: 'Resultado', value: input.expectedResult },
        { label: 'Contacto preferido', value: input.contactPreference },
      ]),
      footer: `${siteConfig.name}<br>Puede continuar con asesoría, WhatsApp o contacto cuando lo necesite.`,
    }),
  }
}

export async function submitDiagnosticForm(
  data: DiagnosticFormData,
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
            'El diagnóstico está listo, pero todavía no existe una base de datos configurada para guardar envíos reales.',
        },
      }
    }

    throw error
  }

  const payload = sanitizeDiagnosticFormData(data)
  const summary = buildDiagnosticSummary(data)
  const metadata = getRequestMetadata(request)

  const submission = await db.diagnosticSubmission.create({
    data: {
      status: 'NEW',
      name: payload.name,
      company: payload.company,
      role: payload.role,
      email: payload.email,
      emailNormalized: payload.emailNormalized,
      phone: payload.phone,
      city: payload.city,
      sector: payload.sector,
      teamSize: payload.teamSize,
      processes: payload.processes,
      currentProcess: payload.currentProcess,
      tools: payload.tools,
      repetitiveTasks: payload.repetitiveTasks,
      mainProblem: payload.mainProblem,
      expectedResult: payload.expectedResult,
      contactPreference: payload.contactPreference,
      wantsMeeting: wantsMeetingToBoolean(payload.wantsMeeting),
      summary,
      privacyAcceptedAt: new Date(),
      privacyPolicyVersion: siteConfig.legal.privacyPolicyVersionLabel,
      requestOrigin: metadata.requestOrigin,
      requestPath: metadata.requestPath,
      referer: metadata.referer,
      userAgent: metadata.userAgent,
      ipHash: metadata.ipHash,
      statusHistory: {
        create: {
          toStatus: 'NEW',
          note: 'Registro creado desde el diagnóstico multipaso.',
        },
      },
    },
  })

  const smtpReady = isSmtpConfigured()
  const webhookReady = isDiagnosticWebhookConfigured()
  const destinationEmail = process.env.DIAGNOSTIC_DESTINATION_EMAIL?.trim()

  let internalEmailStatus: DeliveryStatus = smtpReady && destinationEmail ? 'PENDING' : 'SKIPPED'
  let clientEmailStatus: DeliveryStatus = smtpReady ? 'PENDING' : 'SKIPPED'
  let webhookStatus: DeliveryStatus = webhookReady ? 'PENDING' : 'SKIPPED'
  const notificationIssues: string[] = []

  if (!smtpReady) {
    notificationIssues.push(
      `SMTP pendiente: ${getMissingSmtpEnv().join(', ') || 'revise SMTP_PORT o el proveedor SMTP'}`,
    )
  }

  if (!destinationEmail) {
    notificationIssues.push(siteConfig.integrations.diagnostics.destinationEmailEnv)
  }

  if (!webhookReady) {
    notificationIssues.push(siteConfig.integrations.diagnostics.webhookEnv.join(', '))
  }

  const internalEmail = buildInternalEmail(payload, summary)
  const clientEmail = buildClientEmail(payload, summary)

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
      notificationIssues.push('No fue posible enviar la notificación interna del diagnóstico.')
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
      notificationIssues.push('No fue posible enviar la copia automática al cliente.')
    }
  }

  if (webhookReady) {
    try {
      await sendDiagnosticWebhook({
        diagnosticId: submission.id,
        summary,
        ...payload,
      })
      webhookStatus = 'SENT'
    } catch {
      webhookStatus = 'FAILED'
      notificationIssues.push('No fue posible entregar el diagnóstico al webhook de n8n.')
    }
  }

  await db.diagnosticSubmission.update({
    where: { id: submission.id },
    data: {
      internalEmailStatus,
      clientEmailStatus,
      webhookStatus,
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
      diagnosticId: submission.id,
      message:
        notificationIssues.length > 0
          ? 'El diagnóstico fue registrado correctamente. Algunas notificaciones o automatizaciones quedaron pendientes.'
          : 'El diagnóstico fue registrado y distribuido correctamente.',
    },
  }
}
