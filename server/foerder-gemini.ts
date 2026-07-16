import type { IncomingMessage, ServerResponse } from 'node:http'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { config } from 'dotenv'
import { buildFoerderSystemPrompt } from './foerder-prompt.js'
import {
  parseFoerderStructuredReply,
  SAFE_FALLBACK_QUICK_REPLIES,
  SAFE_FALLBACK_REPLY,
  validateFoerderReply,
} from './foerder-validate.js'

config({ path: '.env.local' })
config()

const DEFAULT_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-flash-latest',
].filter((m): m is string => Boolean(m))

const GENERATION_CONFIG = {
  maxOutputTokens: 768,
  temperature: 0.2,
  thinkingConfig: { thinkingBudget: 0 },
} as const

const SYSTEM_PROMPT = buildFoerderSystemPrompt()

export type ChatHistoryItem = { role: string; content: string }

export type FoerderChatResult = {
  reply: string
  quickReplies: string[]
  quellen: string[]
  model: string
  grounded: boolean
}

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
        'Das Gemini-Kontingent ist aufgebraucht. Bitte in Google AI Studio prüfen oder Billing aktivieren.',
    }
  }

  if (raw.includes('404') || raw.includes('not found') || raw.includes('not available')) {
    return { code: 'MODEL_NOT_FOUND', message: 'Das konfigurierte Modell ist nicht verfügbar.' }
  }

  return { code: 'API_ERROR', message: raw }
}

function safeResult(model: string): FoerderChatResult {
  return {
    reply: SAFE_FALLBACK_REPLY,
    quickReplies: [...SAFE_FALLBACK_QUICK_REPLIES],
    quellen: ['Sicherheitsantwort – Wissensbasis'],
    model,
    grounded: true,
  }
}

async function generateWithFallback(
  genAI: GoogleGenerativeAI,
  message: string,
  chatHistory: ReturnType<typeof sanitizeChatHistory>,
): Promise<FoerderChatResult> {
  let lastError: unknown

  for (const modelName of DEFAULT_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: GENERATION_CONFIG,
      })
      const chat = model.startChat({ history: chatHistory })
      const result = await chat.sendMessage(
        `${message}\n\n(Erinnere dich: Nur Fakten aus der Wissensbasis. Keine erfundenen Zahlen.)`,
      )
      const raw = result.response.text().trim()
      const finishReason = result.response.candidates?.[0]?.finishReason

      if (!raw || (finishReason === 'MAX_TOKENS' && raw.length < 40)) {
        throw new Error(`Leere oder abgeschnittene Antwort (${finishReason})`)
      }

      const structured = parseFoerderStructuredReply(raw)
      if (!structured) {
        return safeResult(modelName)
      }

      const validation = validateFoerderReply(structured.reply)
      if (!validation.ok) {
        console.warn('[foerder-chat] Unbekannte Zahlen verworfen:', validation.unknown)
        return safeResult(modelName)
      }

      return {
        reply: structured.reply,
        quickReplies: structured.quickReplies,
        quellen: structured.quellen,
        model: modelName,
        grounded: true,
      }
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

export async function processFoerderChatMessage(
  message: string,
  history: ChatHistoryItem[] = [],
): Promise<FoerderChatResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw Object.assign(new Error('GEMINI_API_KEY nicht konfiguriert.'), { code: 'MISSING_API_KEY' })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const chatHistory = sanitizeChatHistory(history)
  return generateWithFallback(genAI, message, chatHistory)
}

export async function handleFoerderChat(
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
    res.end(
      JSON.stringify({
        error: 'GEMINI_API_KEY nicht konfiguriert. Bitte in .env.local eintragen.',
        code: 'MISSING_API_KEY',
      }),
    )
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

    const result = await processFoerderChatMessage(message, history)

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

    res.statusCode = code === 'QUOTA_EXCEEDED' ? 429 : 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: message, code }))
  }
}
