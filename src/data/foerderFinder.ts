/**
 * Entscheidungslogik Förderfinder – Zahlen/Regeln aus FOERDERPROGRAMME.md.
 * Keine KI: rein regelbasiert.
 *
 * Standardmodus: kurze Weichenstellung
 * Expertenmodus: alle steuernden Parameter
 */

export type Vorhaben = 'heizung' | 'huelle' | 'komplett' | 'kauf' | 'gemischt'
export type Nutzung = 'selbst' | 'vermietet'
export type WeCount = '1' | '2' | '3plus'
export type Einkommen =
  | 'bis30'
  | 'bis40'
  | 'bis50'
  | 'bis90'
  | 'ueber90'
  | 'unbekannt'
export type Kinder = '0' | '1' | '2' | '3plus'
export type AlteHeizung = 'oel' | 'gas20' | 'gasEtage' | 'sonst' | 'unbekannt'
export type Isfp = 'ja' | 'nein' | 'offen'
export type GebaeudeAlter = 'unter10' | 'ueber10' | 'vor1957' | 'unbekannt'
export type EffizienzKauf = 'fgh' | 'besser' | 'unbekannt'
export type SteuerInteresse = 'ja' | 'nein' | 'offen'
export type NeueHeizung = 'wp' | 'biomasse' | 'brennstoffzelle' | 'netz' | 'unbekannt'
export type Investition = 'bis30' | 'ueber30' | 'unbekannt'
export type ZielEh = '70ee' | '50ee' | '40ee' | 'offen'
export type JaNeinOffen = 'ja' | 'nein' | 'offen'
export type JaNeinUnbekannt = 'ja' | 'nein' | 'unbekannt'
export type FoerderWeg = 'zuschuss' | 'steuer' | 'vergleich'
export type HuelleMassnahme = 'dach' | 'wand' | 'fenster' | 'mehrere' | 'unbekannt'
export type WpHerkunft = 'eu' | 'ausserhalb' | 'unbekannt' | 'keine-wp'
export type EffizienzBestand = 'h' | 'andere' | 'unbekannt'

export type FinderAnswers = {
  vorhaben?: Vorhaben
  nutzung?: Nutzung
  we?: WeCount
  einkommen?: Einkommen
  kinder?: Kinder
  alteHeizung?: AlteHeizung
  isfp?: Isfp
  gebaeudeAlter?: GebaeudeAlter
  effizienzKauf?: EffizienzKauf
  steuerInteresse?: SteuerInteresse
  /** Expertenmodus */
  neueHeizung?: NeueHeizung
  investition?: Investition
  zielEh?: ZielEh
  wpbWand?: JaNeinUnbekannt
  effizienzBestand?: EffizienzBestand
  huelleKomplett?: JaNeinOffen
  technik261?: JaNeinOffen
  sanierung308Ok?: JaNeinOffen
  einkommensteuer?: JaNeinUnbekannt
  fachunternehmen?: JaNeinOffen
  foerderWeg?: FoerderWeg
  huelleMassnahme?: HuelleMassnahme
  wpHerkunft?: WpHerkunft
}

export type FinderTabId = 'vorhaben' | 'nutzung' | 'gebaeude' | 'haushalt' | 'ergebnis'

export type FinderOption = {
  value: string
  label: string
  hint?: string
}

export type FinderQuestion = {
  id: keyof FinderAnswers
  tab: Exclude<FinderTabId, 'ergebnis'>
  title: string
  subtitle?: string
  options: FinderOption[]
  expertOnly?: boolean
}

export type ProgramMatch = {
  id: string
  name: string
  art: string
  accent: 'blue' | 'red' | 'green' | 'amber' | 'navy'
  likelihood: 'sehr-gut' | 'gut' | 'moeglich' | 'alternative'
  headline: string
  points: string[]
  note?: string
}

export const FINDER_TABS: { id: FinderTabId; label: string; short: string }[] = [
  { id: 'vorhaben', label: 'Vorhaben', short: '1' },
  { id: 'nutzung', label: 'Nutzung', short: '2' },
  { id: 'gebaeude', label: 'Gebäude', short: '3' },
  { id: 'haushalt', label: 'Haushalt', short: '4' },
  { id: 'ergebnis', label: 'Ergebnis', short: '5' },
]

const Q_VORHABEN: FinderQuestion = {
  id: 'vorhaben',
  tab: 'vorhaben',
  title: 'Was planen Sie gerade?',
  subtitle: 'Wählen Sie das, was am ehesten passt – Sie können später alles im Termin vertiefen.',
  options: [
    { value: 'heizung', label: 'Heizungstausch', hint: 'Wärmepumpe, Biomasse, Netz…' },
    { value: 'huelle', label: 'Gebäudehülle', hint: 'Dach, Wand, Fenster, Dämmung' },
    { value: 'komplett', label: 'Komplettsanierung', hint: 'Richtung Effizienzhaus' },
    { value: 'kauf', label: 'Altbau kaufen', hint: 'Kauf + Sanierung' },
    { value: 'gemischt', label: 'Mehreres / noch unsicher', hint: 'Wir grenzen es ein' },
  ],
}

const Q_NUTZUNG: FinderQuestion = {
  id: 'nutzung',
  tab: 'nutzung',
  title: 'Wie wird die Immobilie genutzt?',
  subtitle: 'Manche Boni gelten nur bei Selbstnutzung.',
  options: [
    { value: 'selbst', label: 'Selbst genutzt', hint: 'Sie wohnen selbst darin' },
    { value: 'vermietet', label: 'Vermietet', hint: 'Oder fremdgenutzt' },
  ],
}

const Q_WE: FinderQuestion = {
  id: 'we',
  tab: 'gebaeude',
  title: 'Wie viele Wohneinheiten hat das Gebäude?',
  options: [
    { value: '1', label: '1 Wohneinheit', hint: 'typisch Einfamilienhaus' },
    { value: '2', label: '2 Wohneinheiten' },
    { value: '3plus', label: '3 oder mehr' },
  ],
}

const Q_HEIZUNG: FinderQuestion = {
  id: 'alteHeizung',
  tab: 'gebaeude',
  title: 'Welche Heizung ist derzeit im Einsatz?',
  subtitle: 'Relevant für den Klimageschwindigkeitsbonus (KfW 458).',
  options: [
    { value: 'oel', label: 'Ölheizung' },
    { value: 'gas20', label: 'Gasheizung älter als 20 Jahre' },
    { value: 'gasEtage', label: 'Gasetagenheizung' },
    { value: 'sonst', label: 'Andere / neuer' },
    { value: 'unbekannt', label: 'Weiß ich nicht genau' },
  ],
}

const Q_NEUE_HEIZUNG: FinderQuestion = {
  id: 'neueHeizung',
  tab: 'gebaeude',
  title: 'Welche neue Heizung ist geplant?',
  subtitle: 'KfW 458 fördert u. a. Wärmepumpe, Biomasse, Brennstoffzelle oder Netzanschluss.',
  expertOnly: true,
  options: [
    { value: 'wp', label: 'Wärmepumpe' },
    { value: 'biomasse', label: 'Biomasse-Zentralheizung' },
    { value: 'brennstoffzelle', label: 'Brennstoffzellen-Heizung' },
    { value: 'netz', label: 'Gebäude-/Wärmenetz' },
    { value: 'unbekannt', label: 'Noch offen' },
  ],
}

const Q_WP_HERKUNFT: FinderQuestion = {
  id: 'wpHerkunft',
  tab: 'gebaeude',
  title: 'Herkunft der Wärmepumpe (ab 2027 relevant)?',
  subtitle: 'Außerhalb der EU gefertigte Wärmepumpen: 15 % weniger Förderung (ab 2027).',
  expertOnly: true,
  options: [
    { value: 'eu', label: 'EU-Fertigung' },
    { value: 'ausserhalb', label: 'Außerhalb der EU' },
    { value: 'unbekannt', label: 'Noch unklar' },
    { value: 'keine-wp', label: 'Keine Wärmepumpe' },
  ],
}

const Q_ISFP: FinderQuestion = {
  id: 'isfp',
  tab: 'gebaeude',
  title: 'Haben Sie einen individuellen Sanierungsfahrplan (iSFP)?',
  subtitle: 'Mit iSFP steigen bei BAFA oft die förderfähigen Beträge.',
  options: [
    { value: 'ja', label: 'Ja, liegt vor' },
    { value: 'offen', label: 'Noch nicht – interessiert mich' },
    { value: 'nein', label: 'Nein / erst mal ohne' },
  ],
}

const Q_INVESTITION: FinderQuestion = {
  id: 'investition',
  tab: 'gebaeude',
  title: 'Wie hoch ist die geplante Investition (Gebäudehülle, ca.)?',
  subtitle: 'Bei iSFP: bis 30.000 € → 15 %, darüber → 20 % für den Mehrbetrag.',
  expertOnly: true,
  options: [
    { value: 'bis30', label: 'bis 30.000 €' },
    { value: 'ueber30', label: 'über 30.000 €' },
    { value: 'unbekannt', label: 'Noch unklar' },
  ],
}

const Q_HUELLE_MASSNAHME: FinderQuestion = {
  id: 'huelleMassnahme',
  tab: 'gebaeude',
  title: 'Welche Hüllmaßnahme steht im Vordergrund?',
  expertOnly: true,
  options: [
    { value: 'dach', label: 'Dach / oberste Geschossdecke' },
    { value: 'wand', label: 'Außenwand' },
    { value: 'fenster', label: 'Fenster' },
    { value: 'mehrere', label: 'Mehrere / Kombination' },
    { value: 'unbekannt', label: 'Noch offen' },
  ],
}

const Q_ALTER: FinderQuestion = {
  id: 'gebaeudeAlter',
  tab: 'gebaeude',
  title: 'Wie alt ist das Gebäude ungefähr?',
  options: [
    { value: 'vor1957', label: 'Baujahr vor 1957', hint: 'kann WPB-relevant sein' },
    { value: 'ueber10', label: 'Älter als 10 Jahre' },
    { value: 'unter10', label: 'Jünger als 10 Jahre' },
    { value: 'unbekannt', label: 'Unklar' },
  ],
}

const Q_EFFIZIENZ: FinderQuestion = {
  id: 'effizienzKauf',
  tab: 'gebaeude',
  title: 'Welche Energieeffizienzklasse hat das Kaufobjekt?',
  subtitle: 'Für KfW 308 typischerweise F, G oder H.',
  options: [
    { value: 'fgh', label: 'F, G oder H' },
    { value: 'besser', label: 'Besser als F' },
    { value: 'unbekannt', label: 'Noch unbekannt' },
  ],
}

const Q_EFFIZIENZ_BESTAND: FinderQuestion = {
  id: 'effizienzBestand',
  tab: 'gebaeude',
  title: 'Energieeffizienzklasse vor der Sanierung?',
  subtitle: 'Klasse H kann den WPB-Bonus bei KfW 261 auslösen.',
  expertOnly: true,
  options: [
    { value: 'h', label: 'Klasse H' },
    { value: 'andere', label: 'Andere Klasse' },
    { value: 'unbekannt', label: 'Unbekannt' },
  ],
}

const Q_WPB_WAND: FinderQuestion = {
  id: 'wpbWand',
  tab: 'gebaeude',
  title: 'Sind mind. 75 % der Außenwandfläche unsaniert?',
  subtitle: 'Zusammen mit Baujahr vor 1957: WPB-Bonus (+10 % Tilgung) möglich.',
  expertOnly: true,
  options: [
    { value: 'ja', label: 'Ja, weitgehend unsaniert' },
    { value: 'nein', label: 'Nein / schon saniert' },
    { value: 'unbekannt', label: 'Unklar' },
  ],
}

const Q_ZIEL_EH: FinderQuestion = {
  id: 'zielEh',
  tab: 'gebaeude',
  title: 'Welches Effizienzhaus-Niveau ist Ihr Ziel?',
  subtitle: 'Tilgungszuschuss: EH 70EE 0 % · EH 50EE 5 % · EH 40EE 10 %.',
  expertOnly: true,
  options: [
    { value: '70ee', label: 'EH 70 EE' },
    { value: '50ee', label: 'EH 50 EE' },
    { value: '40ee', label: 'EH 40 EE' },
    { value: 'offen', label: 'Noch offen' },
  ],
}

const Q_HUELLE_KOMPLETT: FinderQuestion = {
  id: 'huelleKomplett',
  tab: 'gebaeude',
  title: 'Sollen alle Hüllflächen verbessert werden?',
  subtitle: 'KfW 261: Dach, Wand, Fenster und Boden müssen verbessert werden.',
  expertOnly: true,
  options: [
    { value: 'ja', label: 'Ja, Komplettpaket' },
    { value: 'nein', label: 'Nein, nur Teile' },
    { value: 'offen', label: 'Noch unklar' },
  ],
}

const Q_TECHNIK_261: FinderQuestion = {
  id: 'technik261',
  tab: 'gebaeude',
  title: 'Wärmepumpe/Biomasse und WRG-Lüftung akzeptabel?',
  subtitle: 'Beide sind bei KfW 261 verpflichtend.',
  expertOnly: true,
  options: [
    { value: 'ja', label: 'Ja, beides ok' },
    { value: 'nein', label: 'Eher nicht' },
    { value: 'offen', label: 'Im Termin klären' },
  ],
}

const Q_SANIERUNG_308: FinderQuestion = {
  id: 'sanierung308Ok',
  tab: 'haushalt',
  title: 'Sanierung auf EH 85 innerhalb von 54 Monaten machbar?',
  subtitle: 'Verpflichtung bei KfW 308 nach dem Kauf.',
  expertOnly: true,
  options: [
    { value: 'ja', label: 'Ja, realistisch' },
    { value: 'nein', label: 'Eher nicht' },
    { value: 'offen', label: 'Noch unklar' },
  ],
}

const Q_EINKOMMEN: FinderQuestion = {
  id: 'einkommen',
  tab: 'haushalt',
  title: 'Zu versteuerndes Haushaltseinkommen (ca.)?',
  subtitle: 'Nur grob – steuert Boni und Kreditvarianten.',
  options: [
    { value: 'bis30', label: 'bis 30.000 €' },
    { value: 'bis40', label: 'bis 40.000 €' },
    { value: 'bis50', label: 'bis 50.000 €' },
    { value: 'bis90', label: 'bis 90.000 €' },
    { value: 'ueber90', label: 'über 90.000 €' },
    { value: 'unbekannt', label: 'Lieber nicht angeben' },
  ],
}

const Q_KINDER: FinderQuestion = {
  id: 'kinder',
  tab: 'haushalt',
  title: 'Wie viele minderjährige Kinder leben im Haushalt?',
  subtitle: 'Erhöht bei manchen Programmen Einkommensgrenzen bzw. Kreditsummen.',
  options: [
    { value: '0', label: 'Keine' },
    { value: '1', label: '1 Kind' },
    { value: '2', label: '2 Kinder' },
    { value: '3plus', label: '3 oder mehr' },
  ],
}

const Q_STEUER: FinderQuestion = {
  id: 'steuerInteresse',
  tab: 'haushalt',
  title: 'Interessiert Sie alternativ die steuerliche Abschreibung (§ 35c EStG)?',
  subtitle: 'Nicht kombinierbar mit BAFA/KfW.',
  options: [
    { value: 'ja', label: 'Ja, alternativ prüfen' },
    { value: 'offen', label: 'Vielleicht – im Termin klären' },
    { value: 'nein', label: 'Nein, eher Zuschuss/Kredit' },
  ],
}

const Q_EINKOMMENSTEUER: FinderQuestion = {
  id: 'einkommensteuer',
  tab: 'haushalt',
  title: 'Zahlen Sie Einkommensteuer?',
  subtitle: 'Voraussetzung, damit § 35c überhaupt wirkt.',
  expertOnly: true,
  options: [
    { value: 'ja', label: 'Ja' },
    { value: 'nein', label: 'Nein / kaum' },
    { value: 'unbekannt', label: 'Unklar' },
  ],
}

const Q_FACHUNTERNEHMEN: FinderQuestion = {
  id: 'fachunternehmen',
  tab: 'haushalt',
  title: 'Sanierung nur durch Fachunternehmen (ohne Eigenleistung)?',
  subtitle: 'Bei § 35c ist Eigenleistung nicht zulässig.',
  expertOnly: true,
  options: [
    { value: 'ja', label: 'Ja, nur Fachunternehmen' },
    { value: 'nein', label: 'Auch Eigenleistung geplant' },
    { value: 'offen', label: 'Noch offen' },
  ],
}

const Q_FOERDER_WEG: FinderQuestion = {
  id: 'foerderWeg',
  tab: 'haushalt',
  title: 'Welchen Förderweg bevorzugen Sie?',
  subtitle: '§ 35c und BAFA/KfW dürfen nicht kombiniert werden.',
  expertOnly: true,
  options: [
    { value: 'zuschuss', label: 'Zuschuss / KfW-Kredit' },
    { value: 'steuer', label: 'Steuerliche Abschreibung' },
    { value: 'vergleich', label: 'Beides im Termin vergleichen' },
  ],
}

function kinderCount(k?: Kinder): number {
  if (k === '1') return 1
  if (k === '2') return 2
  if (k === '3plus') return 3
  return 0
}

function effectiveIncomeForSozialbonus(
  einkommen: Einkommen | undefined,
  kinder: Kinder | undefined,
): Einkommen | 'unbekannt' {
  if (!einkommen || einkommen === 'unbekannt') return 'unbekannt'
  if (einkommen === 'ueber90' || einkommen === 'bis90') return einkommen

  const bump = kinderCount(kinder) * 10000
  if (bump > 0 && einkommen === 'bis40') return 'bis30'
  if (bump > 0 && einkommen === 'bis50') return 'bis40'
  return einkommen
}

function isWpb(answers: FinderAnswers): boolean {
  if (answers.effizienzBestand === 'h') return true
  return answers.gebaeudeAlter === 'vor1957' && answers.wpbWand === 'ja'
}

export function getActiveQuestions(
  answers: FinderAnswers,
  expertMode = false,
): FinderQuestion[] {
  const questions: FinderQuestion[] = [Q_VORHABEN, Q_NUTZUNG]
  const v = answers.vorhaben

  if (!v) return questions

  if (v === 'heizung' || v === 'gemischt') {
    questions.push(Q_HEIZUNG)
    if (expertMode) {
      questions.push(Q_NEUE_HEIZUNG)
      if (answers.neueHeizung === 'wp' || answers.neueHeizung === 'unbekannt') {
        questions.push(Q_WP_HERKUNFT)
      }
    }
  }

  if (v === 'huelle' || v === 'gemischt') {
    questions.push(Q_ISFP)
    if (expertMode) {
      questions.push(Q_HUELLE_MASSNAHME)
      if (answers.isfp === 'ja' || answers.isfp === 'offen') {
        questions.push(Q_INVESTITION)
      }
    }
  }

  if (v === 'komplett' || v === 'gemischt' || v === 'kauf' || (expertMode && answers.nutzung === 'selbst')) {
    if (!questions.some((q) => q.id === 'gebaeudeAlter')) {
      questions.push(Q_ALTER)
    }
  }

  if (v === 'kauf') {
    questions.push(Q_EFFIZIENZ)
    if (expertMode) questions.push(Q_SANIERUNG_308)
  }

  if (expertMode && (v === 'komplett' || v === 'gemischt')) {
    questions.push(Q_EFFIZIENZ_BESTAND)
    if (answers.gebaeudeAlter === 'vor1957') questions.push(Q_WPB_WAND)
    questions.push(Q_ZIEL_EH)
    questions.push(Q_HUELLE_KOMPLETT)
    questions.push(Q_TECHNIK_261)
  }

  questions.push(Q_WE)

  if (
    v === 'heizung' ||
    v === 'huelle' ||
    v === 'gemischt' ||
    v === 'kauf' ||
    (expertMode && v === 'komplett')
  ) {
    questions.push(Q_EINKOMMEN)
  }

  if (v === 'heizung' || v === 'kauf' || v === 'gemischt' || expertMode) {
    if (!questions.some((q) => q.id === 'kinder')) questions.push(Q_KINDER)
  }

  if (answers.nutzung === 'selbst') {
    questions.push(Q_STEUER)
    if (expertMode) {
      questions.push(Q_EINKOMMENSTEUER)
      questions.push(Q_FACHUNTERNEHMEN)
      questions.push(Q_FOERDER_WEG)
    }
  }

  return questions
}

export function getQuestionIndex(answers: FinderAnswers, expertMode = false): number {
  const qs = getActiveQuestions(answers, expertMode)
  for (let i = 0; i < qs.length; i++) {
    if (answers[qs[i].id] == null) return i
  }
  return qs.length
}

export function isFinderComplete(answers: FinderAnswers, expertMode = false): boolean {
  const qs = getActiveQuestions(answers, expertMode)
  return qs.every((q) => answers[q.id] != null)
}

export function getTabStatus(
  tab: FinderTabId,
  answers: FinderAnswers,
  complete: boolean,
  expertMode = false,
): 'done' | 'current' | 'todo' | 'locked' {
  if (tab === 'ergebnis') {
    if (complete) return 'current'
    return 'locked'
  }

  const qs = getActiveQuestions(answers, expertMode)
  const tabQuestions = qs.filter((q) => q.tab === tab)
  if (tabQuestions.length === 0) {
    const order: FinderTabId[] = ['vorhaben', 'nutzung', 'gebaeude', 'haushalt']
    const idx = order.indexOf(tab)
    const prevDone = order.slice(0, idx).every((t) => {
      const tq = qs.filter((q) => q.tab === t)
      return tq.length === 0 || tq.every((q) => answers[q.id] != null)
    })
    return prevDone ? 'done' : 'todo'
  }

  const allDone = tabQuestions.every((q) => answers[q.id] != null)
  if (allDone) return 'done'

  const currentQ = qs[getQuestionIndex(answers, expertMode)]
  if (currentQ?.tab === tab) return 'current'
  return 'todo'
}

export function matchPrograms(answers: FinderAnswers, expertMode = false): ProgramMatch[] {
  const matches: ProgramMatch[] = []
  const v = answers.vorhaben
  const selbst = answers.nutzung === 'selbst'
  const vermietet = answers.nutzung === 'vermietet'
  const zuschussWeg = answers.foerderWeg !== 'steuer'

  // KfW 458
  if (zuschussWeg && (v === 'heizung' || v === 'gemischt' || v === 'komplett')) {
    const systemOk =
      !expertMode ||
      !answers.neueHeizung ||
      answers.neueHeizung === 'wp' ||
      answers.neueHeizung === 'biomasse' ||
      answers.neueHeizung === 'brennstoffzelle' ||
      answers.neueHeizung === 'netz' ||
      answers.neueHeizung === 'unbekannt'

    if (systemOk) {
      const klima =
        selbst &&
        (answers.alteHeizung === 'oel' ||
          answers.alteHeizung === 'gas20' ||
          answers.alteHeizung === 'gasEtage')
      const eink = effectiveIncomeForSozialbonus(answers.einkommen, answers.kinder)
      let sozial = 0
      if (selbst) {
        if (eink === 'bis30') sozial = 40
        else if (eink === 'bis40') sozial = 30
        else if (eink === 'bis50') sozial = 10
      }
      const basis = 30
      const klimaPct = klima ? 16 : 0
      let raw = basis + klimaPct + sozial
      const euAbzug =
        expertMode &&
        answers.neueHeizung === 'wp' &&
        answers.wpHerkunft === 'ausserhalb'
      if (euAbzug) raw = Math.max(0, raw - 15)
      const max = selbst ? 80 : 30
      const total = Math.min(raw, max)
      const kosten =
        answers.we === '2' ? 'bis 43.000 €' : answers.we === '3plus' ? 'ab 58.000 €' : 'bis 28.000 €'

      matches.push({
        id: 'kfw458',
        name: 'KfW 458 – Heizungsförderung',
        art: 'Zuschuss',
        accent: 'red',
        likelihood: v === 'heizung' ? 'sehr-gut' : 'gut',
        headline: vermietet
          ? `Voraussichtlich bis ${max} % (vermietet: ohne Selbstnutzungs-Boni)`
          : `Voraussichtlich bis ca. ${total} % Fördersatz (gedeckelt bei ${max} %)`,
        points: [
          `Basisförderung ${basis} %`,
          klima
            ? `Klimageschwindigkeitsbonus +${klimaPct} % (Selbstnutzung)`
            : 'Klimabonus nur bei Öl / alter Gas / Gasetagenheizung und Selbstnutzung',
          sozial > 0
            ? `Sozialer Einkommensbonus +${sozial} % (Selbstnutzung)`
            : selbst
              ? 'Sozialbonus je nach Einkommen bis 50.000 € (+ Kinderzuschlag)'
              : 'Sozialbonus entfällt bei Vermietung',
          `Max. förderfähige Kosten Orientierung: ${kosten} (je nach WE)`,
          ...(euAbzug
            ? ['Hinweis ab 2027: WP außerhalb EU → 15 % weniger Förderung (hier bereits abgezogen)']
            : []),
          ...(expertMode && answers.neueHeizung && answers.neueHeizung !== 'unbekannt'
            ? [`Geplantes System: ${answers.neueHeizung === 'wp' ? 'Wärmepumpe' : answers.neueHeizung === 'biomasse' ? 'Biomasse' : answers.neueHeizung === 'brennstoffzelle' ? 'Brennstoffzelle' : 'Netzanschluss'}`]
            : []),
        ],
        note: 'Boni und Deckelung laut Wissensbasis – individuelle Prüfung im Termin.',
      })
    }
  }

  // BAFA
  if (zuschussWeg && (v === 'huelle' || v === 'gemischt')) {
    const mitIsfp = answers.isfp === 'ja' || answers.isfp === 'offen'
    const investUeber = answers.investition === 'ueber30'
    matches.push({
      id: 'bafa',
      name: 'BAFA – Einzelmaßnahmen Gebäudehülle',
      art: 'Zuschuss',
      accent: 'blue',
      likelihood: 'sehr-gut',
      headline: mitIsfp
        ? investUeber
          ? 'Mit iSFP und Investition über 30.000 €: 15 % bis 30k, 20 % darüber'
          : 'Mit iSFP: 15 % bis 30.000 €, 20 % für den Anteil darüber'
        : 'Ohne iSFP: 15 % Zuschuss – unkompliziert startbar',
      points: mitIsfp
        ? [
            '1. WE: max. 60.000 € förderfähig je Kalenderjahr',
            '2.–6. WE: je 30.000 € · ab 7. WE: je 16.000 €',
            'iSFP-Kosten Orientierung ca. 1.500–3.500 €',
            '50 % Förderung der Energieberatungskosten',
            ...(answers.huelleMassnahme && answers.huelleMassnahme !== 'unbekannt'
              ? [`Fokus Maßnahme: ${answers.huelleMassnahme}`]
              : []),
          ]
        : [
            '1. WE: max. 30.000 € förderfähig je Kalenderjahr',
            '2.–6. WE: je 15.000 € · ab 7. WE: je 8.000 €',
            '50 % Förderung der Energieberatungskosten',
          ],
      note: answers.isfp === 'offen'
        ? 'Ein iSFP kann die Förderung verbessern – im Termin sinnvoll zu klären.'
        : undefined,
    })

    if (answers.einkommen === 'ueber90') {
      matches.push({
        id: 'kfw359',
        name: 'KfW 359 – Ergänzungskredit',
        art: 'Kredit',
        accent: 'navy',
        likelihood: 'gut',
        headline: 'Ergänzungskredit bis 120.000 € je WE (Einkommen über 90.000 €)',
        points: ['Kombinierbar mit BAFA-Einzelmaßnahmen', 'Für energetische Investitionen'],
      })
    } else if (answers.einkommen && answers.einkommen !== 'unbekannt') {
      matches.push({
        id: 'kfw358',
        name: 'KfW 358 – Ergänzungskredit Plus',
        art: 'Kredit',
        accent: 'navy',
        likelihood: 'gut',
        headline: 'Ergänzungskredit Plus bis 120.000 € je WE (Einkommen unter 90.000 €)',
        points: ['Attraktive Konditionen laut Programm', 'Kombinierbar mit BAFA'],
      })
    } else {
      matches.push({
        id: 'kfw358-359',
        name: 'KfW 358 / 359 – Ergänzungskredit',
        art: 'Kredit',
        accent: 'navy',
        likelihood: 'moeglich',
        headline: 'Zusätzlicher Kredit bis 120.000 € je WE – Variante abhängig vom Einkommen',
        points: ['Unter 90.000 €: KfW 358 (Plus)', 'Über 90.000 €: KfW 359'],
      })
    }
  }

  // KfW 261
  if (zuschussWeg && (v === 'komplett' || v === 'gemischt')) {
    const wpb = isWpb(answers)
    const tilgungBase =
      answers.zielEh === '40ee' ? 10 : answers.zielEh === '50ee' ? 5 : answers.zielEh === '70ee' ? 0 : null
    const tilgung = tilgungBase != null ? tilgungBase + (wpb ? 10 : 0) : null
    const technikOk = !expertMode || answers.technik261 !== 'nein'
    const huelleOk = !expertMode || answers.huelleKomplett !== 'nein'

    let likelihood: ProgramMatch['likelihood'] = v === 'komplett' ? 'sehr-gut' : 'moeglich'
    if (expertMode && (!technikOk || !huelleOk)) likelihood = 'moeglich'

    matches.push({
      id: 'kfw261',
      name: 'KfW 261 – Komplettsanierung Effizienzhaus',
      art: 'Kredit + Tilgungszuschuss',
      accent: 'green',
      likelihood,
      headline:
        tilgung != null
          ? `Tilgungszuschuss voraussichtlich ${tilgung} %${wpb ? ' (inkl. WPB-Bonus)' : ''}`
          : 'Tilgung z. B. EH 50EE 5 % / EH 40EE 10 % – ggf. +10 % bei WPB',
      points: [
        'Max. 150.000 € förderfähige Kosten je WE',
        'Alle Hüllflächen + Wärmepumpe/Biomasse + WRG-Lüftung verpflichtend',
        'Energieberatung bis 10.000 € zu 50 % erstattungsfähig',
        wpb
          ? 'WPB-Status nach Ihren Angaben wahrscheinlich → +10 % Tilgung'
          : 'WPB-Bonus prüfen (Baujahr vor 1957 + 75 % Wand unsaniert oder Klasse H)',
        ...(expertMode && answers.huelleKomplett === 'nein'
          ? ['Hinweis: Ohne vollständige Hüllsanierung ist KfW 261 voraussichtlich nicht passend']
          : []),
        ...(expertMode && answers.technik261 === 'nein'
          ? ['Hinweis: Ohne WP/Biomasse und WRG-Lüftung ist KfW 261 voraussichtlich nicht passend']
          : []),
      ],
    })
  }

  // KfW 308
  if (zuschussWeg && v === 'kauf') {
    const kids = kinderCount(answers.kinder)
    const einkommenOk =
      answers.einkommen !== 'ueber90' && answers.einkommen !== undefined
    const kredit =
      kids >= 3 ? '150.000 €' : kids === 2 ? '125.000 €' : kids >= 1 ? '100.000 €' : null
    const zielgruppe = kids >= 1 && selbst
    const fristOk = !expertMode || answers.sanierung308Ok !== 'nein'

    if (zielgruppe && fristOk) {
      matches.push({
        id: 'kfw308',
        name: 'KfW 308 – Junges Familien-Darlehen',
        art: 'Zinsgünstiger Kredit',
        accent: 'amber',
        likelihood:
          answers.effizienzKauf === 'besser'
            ? 'moeglich'
            : einkommenOk
              ? 'sehr-gut'
              : 'gut',
        headline: kredit
          ? `Sehr zinsgünstiger Kredit bis ${kredit} (je nach Kinderzahl)`
          : 'Kredit bis 150.000 € – abhängig von Kinderzahl',
        points: [
          'Zielgruppe: mind. 1 Kind unter 18, Selbstnutzung',
          'Einkommensgrenze 90.000 € + 10.000 € je weiterem Kind',
          'Objekt typischerweise Effizienzklasse F, G oder H',
          'Sanierung auf mind. Effizienzhaus 85 innerhalb von 54 Monaten',
          ...(answers.sanierung308Ok === 'ja' ? ['Sanierungsfrist 54 Monate: von Ihnen als machbar eingeschätzt'] : []),
        ],
        note:
          answers.effizienzKauf === 'besser'
            ? 'Bei besserer Effizienzklasse als F ggf. andere Wege – im Termin prüfen.'
            : undefined,
      })
    } else {
      matches.push({
        id: 'kfw308-hinweis',
        name: 'KfW 308 – ggf. nicht passend',
        art: 'Hinweis',
        accent: 'amber',
        likelihood: 'moeglich',
        headline: !selbst
          ? 'Programm setzt Selbstnutzung voraus'
          : kids < 1
            ? 'Programm setzt mind. 1 Kind unter 18 voraus'
            : 'Sanierung auf EH 85 in 54 Monaten als eher nicht machbar angegeben',
        points: [
          'Trotzdem können BAFA, KfW 261/458 oder § 35c relevant sein',
          'Im Beratungstermin klären wir Alternativen',
        ],
      })
    }
  }

  // § 35c
  const show35c =
    selbst &&
    (v === 'huelle' || v === 'komplett' || v === 'gemischt' || v === 'heizung') &&
    answers.gebaeudeAlter !== 'unter10' &&
    (!expertMode || answers.einkommensteuer !== 'nein') &&
    (!expertMode || answers.fachunternehmen !== 'nein') &&
    answers.foerderWeg !== 'zuschuss' &&
    (answers.foerderWeg === 'steuer' ||
      answers.foerderWeg === 'vergleich' ||
      answers.steuerInteresse === 'ja' ||
      answers.steuerInteresse === 'offen' ||
      (!expertMode && answers.steuerInteresse == null))

  if (show35c) {
    matches.push({
      id: 'para35c',
      name: '§ 35c EStG – Steuerliche Abschreibung',
      art: 'Steuerermäßigung',
      accent: 'amber',
      likelihood:
        answers.foerderWeg === 'steuer' || answers.steuerInteresse === 'ja'
          ? 'alternative'
          : 'moeglich',
      headline: '20 % der energetischen Kosten über 3 Jahre (7 % / 7 % / 6 %)',
      points: [
        'Max. Investition 200.000 € je WE → max. 40.000 € Abschreibung',
        '1./2. Jahr max. 14.000 €, 3. Jahr max. 12.000 €',
        'Selbstnutzung, Gebäude älter als 10 Jahre, nur Fachunternehmen',
        'Nicht kombinierbar mit BAFA oder KfW',
        ...(answers.einkommensteuer === 'ja' ? ['Einkommensteuer: von Ihnen bejaht'] : []),
        ...(answers.fachunternehmen === 'ja' ? ['Fachunternehmen ohne Eigenleistung: passt'] : []),
      ],
      note: 'Alternative zum Zuschussweg – Nettoeffekt im Termin vergleichen.',
    })
  }

  // Expertenhinweise bei Ausschluss §35c
  if (
    expertMode &&
    selbst &&
    (answers.steuerInteresse === 'ja' || answers.foerderWeg === 'steuer') &&
    (answers.einkommensteuer === 'nein' ||
      answers.fachunternehmen === 'nein' ||
      answers.gebaeudeAlter === 'unter10')
  ) {
    matches.push({
      id: 'para35c-hinweis',
      name: '§ 35c – Voraussetzungen prüfen',
      art: 'Hinweis',
      accent: 'amber',
      likelihood: 'moeglich',
      headline: 'Nach Ihren Angaben sind Voraussetzungen für § 35c voraussichtlich nicht erfüllt',
      points: [
        ...(answers.gebaeudeAlter === 'unter10' ? ['Gebäude jünger als 10 Jahre'] : []),
        ...(answers.einkommensteuer === 'nein' ? ['Keine / kaum Einkommensteuer'] : []),
        ...(answers.fachunternehmen === 'nein' ? ['Eigenleistung geplant – bei § 35c unzulässig'] : []),
        'Im Termin prüfen wir Alternativen über BAFA/KfW',
      ],
    })
  }

  if (matches.length === 0) {
    matches.push({
      id: 'orientierung',
      name: 'Individuelle Orientierung',
      art: 'Nächster Schritt',
      accent: 'navy',
      likelihood: 'moeglich',
      headline: 'Aus Ihren Angaben lassen sich mehrere Wege prüfen',
      points: [
        'Im persönlichen Termin ordnen wir BAFA, KfW und § 35c sauber ein',
        'Keine Online-Aussage ersetzt die zertifizierte Energieberatung',
      ],
    })
  }

  const order = { 'sehr-gut': 0, gut: 1, moeglich: 2, alternative: 3 }
  return matches.sort((a, b) => order[a.likelihood] - order[b.likelihood])
}

export const LIKELIHOOD_LABEL: Record<ProgramMatch['likelihood'], string> = {
  'sehr-gut': 'Sehr gut passend',
  gut: 'Gut denkbar',
  moeglich: 'Möglicherweise',
  alternative: 'Alternative',
}

/** Experten-Antworten entfernen, wenn Modus ausgeschaltet wird (verhindert hängende Pflichtfragen). */
export function stripExpertAnswers(answers: FinderAnswers): FinderAnswers {
  const {
    neueHeizung: _n,
    investition: _i,
    zielEh: _z,
    wpbWand: _w,
    effizienzBestand: _e,
    huelleKomplett: _h,
    technik261: _t,
    sanierung308Ok: _s,
    einkommensteuer: _est,
    fachunternehmen: _f,
    foerderWeg: _fw,
    huelleMassnahme: _hm,
    wpHerkunft: _wp,
    ...rest
  } = answers
  return rest
}
