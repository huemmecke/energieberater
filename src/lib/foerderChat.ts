export class FoerderApiError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'FoerderApiError'
    this.code = code
  }
}

export type FoerderChatHistoryItem = {
  role: 'user' | 'assistant'
  content: string
}

export type FoerderChatResponse = {
  reply: string
  quickReplies: string[]
  quellen: string[]
  grounded: boolean
}

export async function sendFoerderChatMessage(
  message: string,
  history: FoerderChatHistoryItem[] = [],
): Promise<FoerderChatResponse> {
  const res = await fetch('/api/foerder-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  const data = (await res.json()) as {
    reply?: string
    quickReplies?: string[]
    quellen?: string[]
    grounded?: boolean
    error?: string
    code?: string
  }

  if (!res.ok) {
    throw new FoerderApiError(data.error ?? 'Förderberater-API Fehler', data.code ?? 'API_ERROR')
  }

  return {
    reply: data.reply ?? '',
    quickReplies: Array.isArray(data.quickReplies) ? data.quickReplies : [],
    quellen: Array.isArray(data.quellen) ? data.quellen : [],
    grounded: data.grounded !== false,
  }
}
