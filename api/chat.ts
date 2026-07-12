import { processChatMessage } from '../server/gemini'

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const { message, history = [] } = (await request.json()) as {
      message?: string
      history?: { role: string; content: string }[]
    }

    if (!message?.trim()) {
      return Response.json({ error: 'Nachricht fehlt' }, { status: 400 })
    }

    const result = await processChatMessage(message, history)
    return Response.json(result)
  } catch (err) {
    const code =
      err && typeof err === 'object' && 'code' in err && typeof err.code === 'string'
        ? err.code
        : 'API_ERROR'
    const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler'

    const status =
      code === 'QUOTA_EXCEEDED' ? 429 : code === 'MISSING_API_KEY' ? 500 : 500

    return Response.json({ error: errorMessage, code }, { status })
  }
}
