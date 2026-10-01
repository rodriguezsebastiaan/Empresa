import assert from 'node:assert/strict'
import { readJsonRequestBody } from '../lib/request-body'
import { validateContactForm, validateAdvisoryBookingForm, validateDiagnosticForm } from '../lib/validation'
import { getSafeAdminReturnTo, isAdminActionOriginValid } from '../lib/admin-auth'

async function main() {
  const contact = { name: 'Test User', company: 'Test Company', email: 'test@example.invalid', phone: '1234567890', subject: 'Test contact', message: 'Local security validation message.', privacyAccepted: true, website: '' }
  const booking = { fullName: 'Test User', company: 'Test Company', email: 'test@example.invalid', phone: '1234567890', city: 'Bogotá', processGoal: 'Local security validation', modality: 'Asesoría virtual', date: '2026-10-15', time: '09:00', timezone: 'America/Bogota (GMT-5)', requestId: 'c9a41854-85a5-4084-a4b1-491ed7f47879', privacyAccepted: true, website: '' }
  const diagnostic = { ...contact, role: 'Director', city: 'Bogotá', sector: 'Services', teamSize: '10', processes: 'Local test processes', currentProcess: 'Local test process description', tools: 'Local tools', repetitiveTasks: 'Local repetitive task description', mainProblem: 'Local problem description', expectedResult: 'Local expected result description', contactPreference: 'Correo', wantsMeeting: 'Sí' }
  const diagnosticInput: Record<string, unknown> = { ...diagnostic }
  delete diagnosticInput.subject
  delete diagnosticInput.message
  assert.equal(validateContactForm(contact).success, true)
  for (const email of ['person(comment)@example.invalid', 'first@example.invalid,second@example.invalid', '"quoted"@example.invalid', 'x'.repeat(65) + '@example.invalid']) {
    assert.equal(validateContactForm({ ...contact, email }).success, false)
  }
  assert.equal(validateAdvisoryBookingForm(booking).success, true)
  assert.equal(validateDiagnosticForm(diagnosticInput).success, true)
  for (const bad of [null, [], 'text', { ...contact, email: 'a'.repeat(192) + '@test.invalid' }, { ...contact, website: 'bot' }, { ...contact, extra: 'unexpected' }, { ...contact, privacyAccepted: 'true' }, { ...contact, website: {} }]) {
    assert.equal(validateContactForm(bad).success, false)
  }
  for (const bad of [{ date: '2026-02-30' }, { time: '24:00' }, { requestId: 'a'.repeat(81) }, { timezone: 'a'.repeat(81) }]) {
    assert.equal(validateAdvisoryBookingForm({ ...booking, ...bad }).success, false)
  }
  assert.equal(validateDiagnosticForm({ ...diagnosticInput, wantsMeeting: 'anything' }).success, false)
  assert.equal(validateDiagnosticForm({ ...diagnosticInput, contactPreference: 'anything' }).success, false)

  const jsonRequest = (body: string, type = 'application/json') => new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': type }, body })
  for (const [body, status] of [['null', 400], ['[]', 400], ['{', 400], ['"text"', 400], ['{"large":"' + 'a'.repeat(65536) + '"}', 413]] as const) {
    const result = await readJsonRequestBody(jsonRequest(body))
    assert.equal(result.success, false)
    if (!result.success) assert.equal(result.status, status)
  }
  assert.equal((await readJsonRequestBody(jsonRequest(JSON.stringify(contact)))).success, true)
  const wrongType = await readJsonRequestBody(jsonRequest('{}', 'text/plain'))
  assert.equal(wrongType.success, false)
  if (!wrongType.success) assert.equal(wrongType.status, 415)
  let cancelled = false
  const stream = new ReadableStream<Uint8Array>({ pull(controller) { controller.enqueue(new Uint8Array(128)) }, cancel() { cancelled = true } })
  const streamed = await readJsonRequestBody(new Request('http://localhost', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: stream, duplex: 'half' } as RequestInit), 200)
  assert.equal(streamed.success, false)
  if (!streamed.success) assert.equal(streamed.status, 413)
  assert.equal(cancelled, true)

  for (const path of ['//evil.invalid', '/admin/../../outside', '/administrator', '/admin/..\\outside', 'https://evil.invalid']) assert.equal(getSafeAdminReturnTo(path), '/admin')
  assert.equal(getSafeAdminReturnTo('/admin/reuniones?status=CONFIRMED'), '/admin/reuniones?status=CONFIRMED')
  assert.equal(isAdminActionOriginValid(new Request('https://local.invalid/admin', { headers: { origin: 'https://evil.invalid' } })), false)
  assert.equal(isAdminActionOriginValid(new Request('https://local.invalid/admin')), false)
  assert.equal(isAdminActionOriginValid(new Request('https://conexacod.com/admin', { headers: { origin: 'https://conexacod.com' } })), true)
  assert.equal(isAdminActionOriginValid(new Request('http://localhost:3100/admin', { headers: { host: '127.0.0.1:3100', origin: 'http://127.0.0.1:3100' } })), true)
  assert.equal(isAdminActionOriginValid(new Request('http://localhost:3100/admin', { headers: { host: 'evil.invalid', origin: 'https://evil.invalid' } })), false)
  assert.equal(isAdminActionOriginValid(new Request('http://localhost:3100/admin', { headers: { host: 'conexacod.com', origin: 'http://localhost:3100' } })), false)
  console.log('Security baseline validation passed: valid fixtures, malformed inputs, bounded streams, admin origin and redirects.')
}

void main().catch((error: unknown) => { console.error(error); process.exitCode = 1 })
