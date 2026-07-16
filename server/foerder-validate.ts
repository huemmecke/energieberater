import { collectAllowedNumbers } from './foerder-facts.js'

const ALLOWED_NUMBERS = collectAllowedNumbers()

/** Jahreszahlen, die in Kontextantworten vorkommen dürfen. */
const YEAR_OR_CONTEXT_SAFE = new Set(['2026', '2027', '2029', '1957'])

export type FoerderStructured = {
  reply: string
  quickReplies: string[]
  quellen: string[]
}

export const SAFE_FALLBACK_REPLY =
  'Dazu kann ich auf Basis unserer aktuellen Förder-Wissensbasis keine belastbare Aussage treffen. Bitte füllen Sie die Checkliste aus oder vereinbaren Sie einen Beratungstermin – dann prüfen wir Ihre Situation persönlich. Worum geht es Ihnen vorrangig: Heizung, Gebäudehülle, Komplettsanierung oder Altbaukauf?'

export const SAFE_FALLBACK_QUICK_REPLIES = [
  'Heizungstausch',
  'Gebäudehülle / Dämmung',
  'Komplettsanierung',
  'Zur Checkliste',
]

/**
 * Extrahiert Prozent- und Euro-ähnliche Zahlen aus dem Antworttext.
 * Erlaubt nur Werte, die in der Faktenliste vorkommen.
 */
export function findUnknownNumbers(reply: string): string[] {
  const unknown: string[] = []
  const patterns = [
    /(\d{1,3}(?:\.\d{3})+|\d+)\s*%/g,
    /(\d{1,3}(?:\.\d{3})+|\d+)\s*€/g,
    /(\d{1,3}(?:\.\d{3})+)\s*(?:Euro|EUR)?/gi,
  ]

  for (const pattern of patterns) {
    for (const match of reply.matchAll(pattern)) {
      const raw = match[1]
      const normalized = raw.replace(/\./g, '')
      if (ALLOWED_NUMBERS.has(raw) || ALLOWED_NUMBERS.has(normalized)) continue
      if (YEAR_OR_CONTEXT_SAFE.has(normalized)) continue
      if (!unknown.includes(raw)) unknown.push(raw)
    }
  }

  return unknown
}

export function validateFoerderReply(reply: string): { ok: boolean; unknown: string[] } {
  const unknown = findUnknownNumbers(reply)
  return { ok: unknown.length === 0, unknown }
}

export function parseFoerderStructuredReply(raw: string): FoerderStructured | null {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidates = [fenced?.[1]?.trim(), trimmed].filter(Boolean) as string[]

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as {
        reply?: unknown
        quickReplies?: unknown
        quellen?: unknown
      }
      if (!parsed.reply || typeof parsed.reply !== 'string') continue
      if (!Array.isArray(parsed.quickReplies)) continue

      const quickReplies = parsed.quickReplies
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map((item) => item.trim().slice(0, 40))
        .slice(0, 4)

      if (quickReplies.length < 2) continue

      const quellen = Array.isArray(parsed.quellen)
        ? parsed.quellen
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .map((item) => item.trim().slice(0, 80))
            .slice(0, 3)
        : []

      return {
        reply: parsed.reply.trim(),
        quickReplies,
        quellen,
      }
    } catch {
      // next candidate
    }
  }

  return null
}
