import { createHash } from 'node:crypto'

export const SESSION_COOKIE = 'ew_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30

export function createSessionToken(password: string): string {
  return createHash('sha256').update(`energieweiser:${password}`).digest('hex')
}

export function buildSessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`
}
