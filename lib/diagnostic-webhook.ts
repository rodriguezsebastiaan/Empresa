import crypto from 'node:crypto'

export function isDiagnosticWebhookConfigured() {
  return Boolean(
    process.env.N8N_DIAGNOSTIC_WEBHOOK_URL?.trim() &&
      process.env.N8N_DIAGNOSTIC_WEBHOOK_SECRET?.trim(),
  )
}

export async function sendDiagnosticWebhook(payload: Record<string, unknown>) {
  const webhookUrl = process.env.N8N_DIAGNOSTIC_WEBHOOK_URL?.trim()
  const webhookSecret = process.env.N8N_DIAGNOSTIC_WEBHOOK_SECRET?.trim()

  if (!webhookUrl || !webhookSecret) {
    throw new Error('DIAGNOSTIC_WEBHOOK_NOT_CONFIGURED')
  }

  const body = JSON.stringify({
    source: 'konamy-systems-web',
    submittedAt: new Date().toISOString(),
    payload,
  })

  const signature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex')
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Konamy-Signature': signature,
    },
    body,
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('DIAGNOSTIC_WEBHOOK_FAILED')
  }
}
