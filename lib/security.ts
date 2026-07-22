import crypto from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(crypto.scrypt)
const PASSWORD_KEY_LENGTH = 64

export function sanitizeInline(value: string) {
  return value.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export function sanitizeMultiline(value: string) {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, '')
    .replace(/\r\n/g, '\n')
    .trim()
}

export function normalizeEmail(value: string) {
  return sanitizeInline(value).toLowerCase()
}

export function hashValue(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export async function hashPassword(password: string) {
  const normalized = password.trim()

  if (normalized.length < 10) {
    throw new Error('PASSWORD_TOO_SHORT')
  }

  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = (await scryptAsync(normalized, salt, PASSWORD_KEY_LENGTH)) as Buffer
  return `scrypt$${salt}$${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split('$')

  if (algorithm !== 'scrypt' || !salt || !hash) {
    return false
  }

  const derivedKey = (await scryptAsync(password.trim(), salt, PASSWORD_KEY_LENGTH)) as Buffer
  const storedBuffer = Buffer.from(hash, 'hex')

  return storedBuffer.length === derivedKey.length && crypto.timingSafeEqual(storedBuffer, derivedKey)
}

export function createSessionToken() {
  return crypto.randomBytes(32).toString('base64url')
}
