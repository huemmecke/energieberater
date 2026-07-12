type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type ChatResponse = {
  reply?: string
  quickReplies?: string[]
  model?: string
  error?: string
  code?: string
}

export type ChatReply = {
  reply: string
  quickReplies: string[]
}

export class GeminiApiError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.code = code
  }
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
): Promise<ChatReply> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })

  const data: ChatResponse = await res.json()

  if (!res.ok || data.error) {
    throw new GeminiApiError(
      data.error || `API-Fehler (${res.status})`,
      data.code || 'API_ERROR',
    )
  }

  return {
    reply: data.reply?.trim() || '',
    quickReplies: Array.isArray(data.quickReplies) ? data.quickReplies : [],
  }
}
