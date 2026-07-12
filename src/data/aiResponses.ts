import { brand } from '../design/brand'

type ResponseRule = {
  keywords: string[]
  answer: string
  suggestForm?: boolean
}

export const defaultResponse =
  'Gerne helfe ich Ihnen weiter. Geht es um einen Heizungstausch, eine Sanierung, Förderung oder eine Frage zum GModG?'

export const aiResponses: ResponseRule[] = [
  {
    keywords: ['gmodg', 'heizungsgesetz', '65', 'biotreppe', 'gesetz'],
    answer:
      'Das GModG hebt die 65%-EE-Pflicht ab – stattdessen gilt ab 2029 die Biotreppe für Gas/Öl. Planen Sie einen Heizungstausch oder geht es Ihnen erstmal um eine allgemeine Orientierung?',
  },
  {
    keywords: ['förder', 'kfw', 'zuschuss', 'bza'],
    answer:
      'Ab Juli 2026 gelten neue KfW-Konditionen – besonders für Familien und Geringverdiener. Möchten Sie eine Sanierung oder einen Heizungstausch fördern lassen?',
    suggestForm: true,
  },
  {
    keywords: ['wärmepumpe', 'waermepumpe', 'heizung', 'heizungstausch', 'heizung tauschen'],
    answer:
      'Beim Heizungstausch gilt: erst dämmen, dann heizen. Welche Heizung haben Sie aktuell, und wie alt ist Ihr Gebäude ungefähr?',
    suggestForm: true,
  },
  {
    keywords: ['sanierung', 'dämm', 'daemm', 'isfp', 'sanierungsfahrplan', 'sanieren'],
    answer:
      'Mit einem Sanierungsfahrplan (iSFP) steigt die Förderung deutlich. Geht es um Einzelmaßnahmen oder eine umfassende Sanierung?',
    suggestForm: true,
  },
  {
    keywords: ['photovoltaik', 'pv', 'solar', 'solaranlage'],
    answer:
      'PV lohnt sich besonders mit Wärmepumpe und Speicher. Haben Sie schon eine Anlage oder planen Sie eine Neuinstallation?',
    suggestForm: true,
  },
  {
    keywords: ['beratung', 'termin', 'anfrage', 'kontakt'],
    answer:
      'Für eine persönliche Beratung können Sie unsere Checkliste ausfüllen – so bereiten wir Ihr Erstgespräch optimal vor.',
    suggestForm: true,
  },
]

export const WELCOME_MESSAGE = `Hallo! Ich bin der KI-Berater von ${brand.name}. Geht es um Heizungstausch, Sanierung, Förderung oder eine Frage zum GModG?`

export const FORM_HINT_KEYWORDS = [
  'heizung', 'sanier', 'förder', 'foerder', 'wärmepumpe', 'waermepumpe',
  'beratung', 'termin', 'anfrage', 'isfp', 'checkliste', 'gebäude', 'gebaeude',
]

export function shouldSuggestForm(text: string): boolean {
  const lower = text.toLowerCase()
  return FORM_HINT_KEYWORDS.some((kw) => lower.includes(kw))
}
