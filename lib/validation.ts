export type FieldErrors = Record<string, string>

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: FieldErrors }

export type ContactFormData = {
  name: string
  company: string
  email: string
  phone: string
  subject: string
  message: string
  privacyAccepted: boolean
  website?: string
}

export type AdvisoryBookingFormData = {
  fullName: string
  company: string
  email: string
  phone: string
  city: string
  processGoal: string
  modality: string
  date: string
  time: string
  timezone: string
  privacyAccepted: boolean
  requestId: string
  website?: string
}

export type DiagnosticFormData = {
  name: string
  company: string
  role: string
  email: string
  phone: string
  city: string
  sector: string
  teamSize: string
  processes: string
  currentProcess: string
  tools: string
  repetitiveTasks: string
  mainProblem: string
  expectedResult: string
  contactPreference: string
  wantsMeeting: string
  privacyAccepted: boolean
  website?: string
}

function toStringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function toBooleanValue(value: unknown) {
  return value === true || value === 'true' || value === 'on'
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isTimeValue(value: string) {
  return /^\d{2}:\d{2}$/.test(value)
}

function applyLengthRule(
  errors: FieldErrors,
  key: string,
  value: string,
  minimum: number,
  maximum: number,
  label: string,
) {
  if (!value) {
    errors[key] = `${label} es obligatorio.`
    return
  }

  if (value.length < minimum) {
    errors[key] = `${label} debe tener al menos ${minimum} caracteres.`
    return
  }

  if (value.length > maximum) {
    errors[key] = `${label} debe tener máximo ${maximum} caracteres.`
  }
}

function contactBase(input: unknown) {
  const record = input && typeof input === 'object' ? (input as Record<string, unknown>) : {}

  return {
    name: toStringValue(record.name),
    company: toStringValue(record.company),
    email: toStringValue(record.email),
    phone: toStringValue(record.phone),
    subject: toStringValue(record.subject),
    message: toStringValue(record.message),
    privacyAccepted: toBooleanValue(record.privacyAccepted),
    website: toStringValue(record.website),
  }
}

export function validateContactForm(input: unknown): ValidationResult<ContactFormData> {
  const data = contactBase(input)
  const errors: FieldErrors = {}

  if (data.website) {
    errors.website = 'Spam detectado.'
  }

  applyLengthRule(errors, 'name', data.name, 2, 80, 'El nombre')
  applyLengthRule(errors, 'company', data.company, 2, 80, 'La empresa')
  applyLengthRule(errors, 'subject', data.subject, 4, 100, 'El asunto')
  applyLengthRule(errors, 'message', data.message, 20, 1200, 'El mensaje')

  if (!data.email) {
    errors.email = 'El correo es obligatorio.'
  } else if (!isEmail(data.email)) {
    errors.email = 'Ingrese un correo válido.'
  }

  if (!data.phone) {
    errors.phone = 'El teléfono es obligatorio.'
  } else if (data.phone.length < 7 || data.phone.length > 25) {
    errors.phone = 'Ingrese un teléfono válido.'
  }

  if (!data.privacyAccepted) {
    errors.privacyAccepted = 'Debe aceptar la política de privacidad.'
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  return { success: true, data }
}

export function validateAdvisoryBookingForm(
  input: unknown,
): ValidationResult<AdvisoryBookingFormData> {
  const record = input && typeof input === 'object' ? (input as Record<string, unknown>) : {}

  const data: AdvisoryBookingFormData = {
    fullName: toStringValue(record.fullName),
    company: toStringValue(record.company),
    email: toStringValue(record.email),
    phone: toStringValue(record.phone),
    city: toStringValue(record.city),
    processGoal: toStringValue(record.processGoal),
    modality: toStringValue(record.modality),
    date: toStringValue(record.date),
    time: toStringValue(record.time),
    timezone: toStringValue(record.timezone),
    privacyAccepted: toBooleanValue(record.privacyAccepted),
    requestId: toStringValue(record.requestId),
    website: toStringValue(record.website),
  }

  const errors: FieldErrors = {}

  if (data.website) {
    errors.website = 'Spam detectado.'
  }

  applyLengthRule(errors, 'fullName', data.fullName, 2, 90, 'El nombre completo')
  applyLengthRule(errors, 'company', data.company, 2, 90, 'La empresa')
  applyLengthRule(errors, 'city', data.city, 2, 80, 'La ciudad')
  applyLengthRule(
    errors,
    'processGoal',
    data.processGoal,
    12,
    600,
    'El motivo de la asesoría',
  )

  if (!data.email) {
    errors.email = 'El correo es obligatorio.'
  } else if (!isEmail(data.email)) {
    errors.email = 'Ingrese un correo válido.'
  }

  if (!data.phone) {
    errors.phone = 'El teléfono es obligatorio.'
  } else if (data.phone.length < 7 || data.phone.length > 25) {
    errors.phone = 'Ingrese un teléfono válido.'
  }

  if (!data.modality) {
    errors.modality = 'La modalidad es obligatoria.'
  }

  if (!isIsoDate(data.date)) {
    errors.date = 'Seleccione una fecha válida.'
  }

  if (!isTimeValue(data.time)) {
    errors.time = 'Seleccione una hora válida.'
  }

  if (!data.timezone) {
    errors.timezone = 'La zona horaria es obligatoria.'
  }

  if (!data.requestId || data.requestId.length < 8) {
    errors.requestId = 'No se pudo preparar la solicitud. Recargue la página.'
  }

  if (!data.privacyAccepted) {
    errors.privacyAccepted = 'Debe aceptar la política de privacidad.'
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  return { success: true, data }
}

export function validateDiagnosticForm(input: unknown): ValidationResult<DiagnosticFormData> {
  const record = input && typeof input === 'object' ? (input as Record<string, unknown>) : {}

  const data: DiagnosticFormData = {
    name: toStringValue(record.name),
    company: toStringValue(record.company),
    role: toStringValue(record.role),
    email: toStringValue(record.email),
    phone: toStringValue(record.phone),
    city: toStringValue(record.city),
    sector: toStringValue(record.sector),
    teamSize: toStringValue(record.teamSize),
    processes: toStringValue(record.processes),
    currentProcess: toStringValue(record.currentProcess),
    tools: toStringValue(record.tools),
    repetitiveTasks: toStringValue(record.repetitiveTasks),
    mainProblem: toStringValue(record.mainProblem),
    expectedResult: toStringValue(record.expectedResult),
    contactPreference: toStringValue(record.contactPreference),
    wantsMeeting: toStringValue(record.wantsMeeting),
    privacyAccepted: toBooleanValue(record.privacyAccepted),
    website: toStringValue(record.website),
  }

  const errors = validateDiagnosticStep(7, data)

  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  return { success: true, data }
}

export function validateDiagnosticStep(
  step: number,
  input: Partial<DiagnosticFormData>,
) {
  const errors: FieldErrors = {}

  if (step >= 0) {
    applyLengthRule(errors, 'name', input.name?.trim() ?? '', 2, 80, 'El nombre')
    applyLengthRule(errors, 'company', input.company?.trim() ?? '', 2, 90, 'La empresa')
    applyLengthRule(errors, 'role', input.role?.trim() ?? '', 2, 80, 'El cargo')

    if (!input.email?.trim()) {
      errors.email = 'El correo es obligatorio.'
    } else if (!isEmail(input.email.trim())) {
      errors.email = 'Ingrese un correo válido.'
    }

    if (!input.phone?.trim()) {
      errors.phone = 'El teléfono es obligatorio.'
    } else if (input.phone.trim().length < 7 || input.phone.trim().length > 25) {
      errors.phone = 'Ingrese un teléfono válido.'
    }
  }

  if (step >= 1) {
    applyLengthRule(errors, 'city', input.city?.trim() ?? '', 2, 80, 'La ciudad')
    applyLengthRule(errors, 'sector', input.sector?.trim() ?? '', 2, 80, 'El sector')
    applyLengthRule(
      errors,
      'teamSize',
      input.teamSize?.trim() ?? '',
      2,
      50,
      'El tamaño aproximado',
    )
  }

  if (step >= 2) {
    applyLengthRule(
      errors,
      'processes',
      input.processes?.trim() ?? '',
      12,
      500,
      'Los procesos a mejorar',
    )
    applyLengthRule(
      errors,
      'currentProcess',
      input.currentProcess?.trim() ?? '',
      12,
      700,
      'Cómo se realiza actualmente',
    )
  }

  if (step >= 3) {
    applyLengthRule(
      errors,
      'tools',
      input.tools?.trim() ?? '',
      3,
      500,
      'Las herramientas actuales',
    )
    applyLengthRule(
      errors,
      'repetitiveTasks',
      input.repetitiveTasks?.trim() ?? '',
      12,
      500,
      'Las tareas repetitivas',
    )
  }

  if (step >= 4) {
    applyLengthRule(
      errors,
      'mainProblem',
      input.mainProblem?.trim() ?? '',
      15,
      700,
      'La dificultad principal',
    )
  }

  if (step >= 5) {
    applyLengthRule(
      errors,
      'expectedResult',
      input.expectedResult?.trim() ?? '',
      15,
      700,
      'El resultado esperado',
    )
  }

  if (step >= 6) {
    if (!input.contactPreference?.trim()) {
      errors.contactPreference = 'Seleccione una preferencia de contacto.'
    }

    if (!input.wantsMeeting?.trim()) {
      errors.wantsMeeting = 'Indique si desea agendar una reunión.'
    }
  }

  if (step >= 7) {
    if (!input.privacyAccepted) {
      errors.privacyAccepted = 'Debe aceptar la política de privacidad.'
    }

    if (input.website?.trim()) {
      errors.website = 'Spam detectado.'
    }
  }

  return errors
}
