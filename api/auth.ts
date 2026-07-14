import type { IncomingMessage, ServerResponse } from 'node:http'
import { buildSessionCookie, createSessionToken } from '../server/auth.js'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const sitePassword = process.env.SITE_PASSWORD
  if (!sitePassword) {
    res.statusCode = 503
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Passwortschutz ist nicht konfiguriert.' }))
    return
  }

  try {
    const body = JSON.parse(await readBody(req)) as { password?: unknown }
    const password = typeof body.password === 'string' ? body.password : ''

    if (password !== sitePassword) {
      res.statusCode = 401
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Falsches Passwort.' }))
      return
    }

    const token = createSessionToken(sitePassword)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Set-Cookie', buildSessionCookie(token))
    res.end(JSON.stringify({ ok: true }))
  } catch {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Ungültige Anfrage.' }))
  }
}
