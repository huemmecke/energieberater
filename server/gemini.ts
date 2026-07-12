import type { IncomingMessage, ServerResponse } from 'node:http'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { config } from 'dotenv'
import { buildSystemPrompt } from './prompt.js'

config({ path: '.env.local' })
config()

const DEFAULT_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-flash-latest',
].filter((m): m is string => Boolean(m))

const GENERATION_CONFIG = {
  maxOutputTokens: 512,
  temperature: 0.7,
  thinkingConfig: { thinkingBudget: 0 },
} as const

const SYSTEM_PROMPT = buildSystemPrompt()

export type ChatHistoryItem = { role: string; content: string }

export type ChatResult = {
  reply: string
  quickReplies: string[]
  model: string
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

function sanitizeChatHistory(history: ChatHistoryItem[]) {
  const filtered = history.filter((m) => m.role === 'user' || m.role === 'assistant')

  let start = 0
  while (start < filtered.length && filtered[start].role === 'assistant') {
    start++
  }

  return filtered.slice(start).slice(-8).map((m) => ({
    role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
    parts: [{ text: m.content }],
  }))
}

function parseApiError(err: unknown): { code: string; message: string } {
  const raw = err instanceof Error ? err.message : 'Unbekannter Fehler'

  if (raw.includes('429') || raw.includes('quota') || raw.includes('Quota')) {
    return {
      code: 'QUOTA_EXCEEDED',
      message:
        'Das Gemini-Kontingent ist aufgebraucht. Bitte in Google AI Studio prüfen oder Billing aktivieren. Bis dahin nutzen wir lokale Antworten.',
    }
  }

  if (raw.includes('404') || raw.includes('not found') || raw.includes('not available')) {
    return { code: 'MODEL_NOT_FOUND', message: 'Das konfigurierte Modell ist nicht verfügbar.' }
  }

  return { code: 'API_ERROR', message: raw }
}

export function parseStructuredReply(raw: string): { reply: string; quickReplies: string[] } | null {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidates = [fenced?.[1]?.trim(), trimmed].filter(Boolean) as string[]

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as { reply?: unknown; quickReplies?: unknown }
      if (!parsed.reply || !Array.isArray(parsed.quickReplies)) continue

      const quickReplies = parsed.quickReplies
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map((item) => item.trim().slice(0, 40))
        .slice(0, 4)

      if (quickReplies.length >= 2) {
        return { reply: String(parsed.reply).trim(), quickReplies }
      }
    } catch {
      // try next candidate
    }
  }

  return null
}

async function generateWithFallback(
  genAI: GoogleGenerativeAI,
  message: string,
  chatHistory: ReturnType<typeof sanitizeChatHistory>,
): Promise<{ reply: string; quickReplies: string[]; model: string }> {
  let lastError: unknown

  for (const modelName of DEFAULT_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: GENERATION_CONFIG,
      })
      const chat = model.startChat({ history: chatHistory })
      const result = await chat.sendMessage(message)
      const raw = result.response.text().trim()
      const finishReason = result.response.candidates?.[0]?.finishReason

      if (!raw || (finishReason === 'MAX_TOKENS' && raw.length < 40)) {
        throw new Error(`Leere oder abgeschnittene Antwort (${finishReason})`)
      }

      const structured = parseStructuredReply(raw)
      if (structured) {
        return { ...structured, model: modelName }
      }

      return { reply: raw, quickReplies: [], model: modelName }
    } catch (err) {
      lastError = err
      const { code } = parseApiError(err)
      if (code === 'MODEL_NOT_FOUND') continue
      if (code === 'QUOTA_EXCEEDED') continue
      throw err
    }
  }

  throw lastError
}

export async function processChatMessage(
  message: string,
  history: ChatHistoryItem[] = [],
): Promise<ChatResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw Object.assign(new Error('GEMINI_API_KEY nicht konfiguriert.'), { code: 'MISSING_API_KEY' })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const chatHistory = sanitizeChatHistory(history)
  return generateWithFallback(genAI, message, chatHistory)
}

export async function handleGeminiChat(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  if (!process.env.GEMINI_API_KEY) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      error: 'GEMINI_API_KEY nicht konfiguriert. Bitte in .env.local eintragen.',
      code: 'MISSING_API_KEY',
    }))
    return
  }

  try {
    const raw = await readBody(req)
    const { message, history = [] } = JSON.parse(raw) as {
      message: string
      history?: ChatHistoryItem[]
    }

    if (!message?.trim()) {
      res.statusCode = 400
      res.end(JSON.stringify({ error: 'Nachricht fehlt' }))
      return
    }

    const result = await processChatMessage(message, history)

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result))
  } catch (err) {
    const code =
      err && typeof err === 'object' && 'code' in err && typeof err.code === 'string'
        ? err.code
        : parseApiError(err).code
    const message =
      err instanceof Error ? err.message : parseApiError(err).message

    res.statusCode = code === 'QUOTA_EXCEEDED' ? 429 : code === 'MISSING_API_KEY' ? 500 : 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: message, code }))
  }
}
