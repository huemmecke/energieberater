export type ChatTurn = {
  role: 'user' | 'assistant'
  content: string
}

export const INITIAL_QUICK_REPLIES = [
  'Heizungstausch planen',
  'Gebäude sanieren',
  'Förderung beantragen',
  'Frage zum GModG',
] as const

const FALLBACK_OPTIONS = [
  'Mehr dazu erfahren',
  'Zur Checkliste',
  'Kontakt aufnehmen',
]

type OptionContext = {
  lastUser: string
  lastAnswer: string
  allUserText: string
  allText: string
  userTurnCount: number
  topic: ConversationTopic
  hasQuestion: boolean
}

type ConversationTopic =
  | 'heizung'
  | 'sanierung'
  | 'foerderung'
  | 'gmodg'
  | 'pv'
  | 'general'

function cleanOption(text: string): string {
  return text
    .replace(/^(ein[e]?|der|die|das)\s+/i, '')
    .replace(/[?.!]+$/, '')
    .trim()
}

function splitOptionList(text: string): string[] {
  return text
    .split(/\s*,\s*|\s+oder\s+/)
    .map(cleanOption)
    .filter((option) => option.length > 0 && option.length <= 40)
    .slice(0, 4)
}

/** Liest Button-Optionen direkt aus der letzten KI-Antwort (z. B. „A, B oder C?“). */
export function extractOptionsFromAnswer(answer: string): string[] {
  const question = answer.includes('?')
    ? answer.slice(0, answer.lastIndexOf('?'))
    : answer

  const introPatterns = [
    /(?:geht es (?:bei ihnen )?um|handelt es um|planen sie|möchten sie|interessiert sie|worum geht es|was planen sie)[:\s]+(.+)$/i,
    /(?:z\.?\s*b\.?|beispielsweise)[:\s]+(.+)$/i,
    /(?:welche[rs]?|was für ein[e]?)[:\s]+(.+)$/i,
  ]

  for (const pattern of introPatterns) {
    const match = question.match(pattern)
    if (match?.[1]) {
      const options = splitOptionList(match[1])
      if (options.length >= 2) return options
    }
  }

  const oderMatch = question.match(/(.+?)\s+oder\s+([^?,]+)$/i)
  if (oderMatch) {
    const left = oderMatch[1]
    const right = cleanOption(oderMatch[2])
    const leftParts = left.split(/,|–|-/).map((part) => cleanOption(part)).filter(Boolean)
    const options = [...leftParts.slice(0, -1), leftParts.at(-1) || '', right].filter(Boolean)
    if (options.length >= 2) return options.slice(-4)
  }

  return []
}

function includesAny(text: string, phrases: string[]): boolean {
  return phrases.some((p) => text.includes(p))
}

function detectTopic(text: string): ConversationTopic {
  if (includesAny(text, ['gmodg', 'heizungsgesetz', 'biotreppe', '65%'])) return 'gmodg'
  if (includesAny(text, ['förder', 'foerder', 'kfw', 'zuschuss', 'bza'])) return 'foerderung'
  if (includesAny(text, ['sanier', 'dämm', 'daemm', 'isfp', 'fenster', 'gebäudehülle'])) return 'sanierung'
  if (includesAny(text, ['heizung', 'wärmepumpe', 'waermepumpe', 'gas', 'öl', 'fernwärme'])) return 'heizung'
  if (includesAny(text, ['pv', 'solar', 'photovoltaik'])) return 'pv'
  return 'general'
}

function ctxFromHistory(history: ChatTurn[], lastAnswer: string): OptionContext {
  const users = history.filter((m) => m.role === 'user')
  const lastUser = users.at(-1)?.content.toLowerCase() ?? ''
  const allUserText = users.map((m) => m.content).join(' ').toLowerCase()
  const allText = history.map((m) => m.content).join(' ').toLowerCase()

  return {
    lastUser,
    lastAnswer: lastAnswer.toLowerCase(),
    allUserText,
    allText,
    userTurnCount: users.length,
    topic: detectTopic(allUserText),
    hasQuestion: lastAnswer.includes('?'),
  }
}

function assistantAsksProjectType(answer: string): boolean {
  return includesAny(answer, [
    'worum geht',
    'was planen',
    'ihr projekt',
    'ihr anliegen',
    'geht es bei',
    'geht es um',
    'was möchten',
    'was moechten',
    'wobei kann',
    'worin kann',
    'welches thema',
    'womit kann',
    'was genau',
    'was interessiert',
  ])
}

function assistantAsksMeasureType(answer: string): boolean {
  return (
    includesAny(answer, ['heizungstausch', 'dämmung', 'sanierung', 'gebäudehülle', 'fenster', 'komplette']) &&
    includesAny(answer, ['geht es', 'planen sie', ' oder ', 'beispielsweise', 'handelt es'])
  )
}

function optionsForOpenQuestion(ctx: OptionContext): string[] | null {
  const { lastAnswer: answer, topic } = ctx

  if (assistantAsksProjectType(answer)) return [...INITIAL_QUICK_REPLIES]
  if (assistantAsksMeasureType(answer)) {
    return ['Heizungstausch', 'Dämmung / Fenster', 'Komplette Sanierung', 'Noch unsicher']
  }

  if (includesAny(answer, ['welche heizung', 'heizung haben', 'aktuell heizen', 'was heizen', 'heizung nutzen', 'heizen sie'])) {
    return ['Gas oder Öl', 'Fernwärme', 'Wärmepumpe', 'Elektroheizung']
  }

  if (includesAny(answer, ['baujahr', 'wie alt', 'wann wurde', 'alter des gebäudes', 'baujahr des'])) {
    return ['Vor 1979', '1979–2002', 'Nach 2002', 'Neubau']
  }

  if (includesAny(answer, ['einzelmaßnahmen', 'umfassende sanierung', 'einzelmaßnahme', 'komplett sanieren', 'einzelmaßnahme'])) {
    return ['Einzelmaßnahme', 'Mehrere Maßnahmen', 'Komplettsanierung', 'Noch unklar']
  }

  if (includesAny(answer, ['wärmepumpe', 'waermepumpe'])) {
    return ['Ja, Wärmepumpe interessiert mich', 'Eher Gas/Biomasse', 'Förderung für Wärmepumpe', 'Voraussetzungen prüfen']
  }

  if (includesAny(answer, ['photovoltaik', ' pv', 'solaranlage', 'solar'])) {
    return ['Neuinstallation planen', 'Anlage erweitern', 'Mit Wärmepumpe kombinieren', 'Förderung für PV']
  }

  if (includesAny(answer, ['gmodg', 'biotreppe', 'heizungsgesetz', '65%-pflicht', '65%-ee', 'gesetzeslage'])) {
    return ['Betrifft das mein Haus?', 'Heizungstausch nötig?', 'Was ist die Biotreppe?', 'Beratung gewünscht']
  }

  if (includesAny(answer, ['förder', 'foerder', 'kfw', 'zuschuss', 'fördermittel', 'förderung'])) {
    return ['Heizungstausch (KfW)', 'Sanierung (BEG)', 'Energieberatung (iSFP)', 'PV-Anlage']
  }

  if (includesAny(answer, ['checkliste', 'erstanfrage', 'formular'])) {
    return ['Zur Checkliste', 'Erst noch eine Frage', 'Kontakt aufnehmen']
  }

  if (includesAny(answer, ['beratung', 'termin', 'vor-ort', 'erstgespräch', 'persönlich'])) {
    return ['Checkliste ausfüllen', 'Kontakt aufnehmen', 'Noch eine Frage stellen']
  }

  if (ctx.hasQuestion && topic === 'heizung') {
    return ['Gas oder Öl', 'Wärmepumpe', 'Förderung prüfen', 'Zur Checkliste']
  }

  if (ctx.hasQuestion && topic === 'sanierung') {
    return ['Einzelmaßnahme', 'Komplettsanierung', 'iSFP erstellen', 'Zur Checkliste']
  }

  if (ctx.hasQuestion && topic === 'foerderung') {
    return ['Heizungstausch (KfW)', 'Sanierung (BEG)', 'Energieberatung (iSFP)', 'Mehr erfahren']
  }

  if (ctx.hasQuestion && topic === 'gmodg') {
    return ['Heizungstausch planen', 'Biotreppe verstehen', 'Beratung anfragen', 'Mehr erfahren']
  }

  if (ctx.hasQuestion) {
    return ['Ja, das trifft zu', 'Nein, eher nicht', 'Mehr Informationen', 'Zur Checkliste']
  }

  return null
}

function optionsForTopic(topic: ConversationTopic, lastUser: string): string[] {
  switch (topic) {
    case 'heizung':
      return ['Förderung für Heizungstausch', 'Wärmepumpe vs. Gas', 'Zur Checkliste', 'Nächste Schritte']
    case 'sanierung':
      return ['Sanierungsfahrplan (iSFP)', 'Förderung für Sanierung', 'Einzelmaßnahme planen', 'Zur Checkliste']
    case 'foerderung':
      return ['Heizungstausch fördern', 'Sanierung fördern', 'Energieberatung (iSFP)', 'Förderhöhe berechnen']
    case 'gmodg':
      return ['Heizungstausch planen', 'Biotreppe verstehen', 'Beratung anfragen', 'Gesetz im Detail']
    case 'pv':
      return ['PV mit Speicher', 'Förderung für PV', 'Mit Heizung kombinieren', 'Zur Checkliste']
    default:
      if (includesAny(lastUser, ['heizung', 'wärmepumpe', 'waermepumpe'])) {
        return ['Förderung prüfen', 'Technik vergleichen', 'Zur Checkliste', 'Nächste Schritte']
      }
      return [...FALLBACK_OPTIONS, 'Neues Thema wählen']
  }
}

export function resolveQuickReplies(
  history: ChatTurn[],
  lastAnswer: string,
): string[] {
  if (!lastAnswer.trim()) {
    return history.some((m) => m.role === 'user') ? [...FALLBACK_OPTIONS] : [...INITIAL_QUICK_REPLIES]
  }

  const extracted = extractOptionsFromAnswer(lastAnswer)
  if (extracted.length >= 2) {
    return extracted
  }

  const ctx = ctxFromHistory(history, lastAnswer)

  if (ctx.userTurnCount === 0) {
    return [...INITIAL_QUICK_REPLIES]
  }

  const questionOptions = optionsForOpenQuestion(ctx)
  if (questionOptions?.length) {
    return questionOptions
  }

  return optionsForTopic(ctx.topic, ctx.lastUser)
}
