import type { DiagnosticFormData } from '@/lib/validation'

export function buildDiagnosticSummary(data: DiagnosticFormData) {
  return [
    `Empresa: ${data.company}.`,
    `Cargo del contacto: ${data.role}.`,
    `Procesos a mejorar: ${data.processes}.`,
    `Problema principal: ${data.mainProblem}.`,
    `Resultado esperado: ${data.expectedResult}.`,
    `Preferencia de contacto: ${data.contactPreference}.`,
    `Desea asesoría: ${data.wantsMeeting}.`,
  ].join(' ')
}
