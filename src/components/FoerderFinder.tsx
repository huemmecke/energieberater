import { useMemo, useState } from 'react'
import {
  buildFazit,
  FINDER_TABS,
  getActiveQuestions,
  getQuestionIndex,
  getTabStatus,
  isFinderComplete,
  LIKELIHOOD_LABEL,
  matchPrograms,
  stripExpertAnswers,
  type FinderAnswers,
  type FinderFazit,
  type FinderTabId,
  type ProgramMatch,
} from '../data/foerderFinder'
import { routes } from '../lib/routes'
import { ArrowBullet } from './ui/ArrowBullet'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((current / total) * 100))
  const remaining = Math.max(0, total - current)

  return (
    <div className="mt-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-normal text-ewe-muted">
        <span>
          {current >= total
            ? 'Alle Fragen beantwortet'
            : `Frage ${Math.min(current + 1, total)} von ${total}`}
        </span>
        <span>
          {remaining === 0
            ? 'Ergebnis bereit'
            : remaining === 1
              ? 'noch 1 Schritt'
              : `noch ${remaining} Schritte`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ewe-navy/10">
        <div
          className="h-full rounded-full bg-ewe-navy transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function TabBar({
  answers,
  complete,
  expertMode,
  onSelectErgebnis,
}: {
  answers: FinderAnswers
  complete: boolean
  expertMode: boolean
  onSelectErgebnis: () => void
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 sm:gap-2" role="tablist" aria-label="Fortschritt">
      {FINDER_TABS.map((tab) => {
        const status = getTabStatus(tab.id, answers, complete, expertMode)
        const isErgebnis = tab.id === 'ergebnis'
        const clickable = isErgebnis && complete

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={status === 'current'}
            disabled={!clickable && isErgebnis}
            onClick={() => {
              if (clickable) onSelectErgebnis()
            }}
            className={`flex min-w-[4.5rem] flex-1 flex-col items-center rounded-lg border px-2 py-2.5 text-center transition-all duration-300 sm:min-w-0 sm:px-3 ${
              status === 'done'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : status === 'current'
                  ? 'border-ewe-navy bg-ewe-navy text-white shadow-md'
                  : status === 'locked'
                    ? 'border-ewe-navy/10 bg-ewe-off-white text-ewe-muted/50'
                    : 'border-ewe-navy/15 bg-white text-ewe-navy/70'
            }`}
          >
            <span
              className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                status === 'done'
                  ? 'bg-emerald-600 text-white'
                  : status === 'current'
                    ? 'bg-white text-ewe-navy'
                    : 'bg-ewe-navy/10 text-ewe-navy/60'
              }`}
            >
              {status === 'done' ? '✓' : tab.short}
            </span>
            <span className="text-[11px] font-normal leading-tight sm:text-xs">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function AnswerSummary({ answers, expertMode }: { answers: FinderAnswers; expertMode: boolean }) {
  const chips: string[] = []
  if (answers.vorhaben === 'heizung') chips.push('Heizungstausch')
  if (answers.vorhaben === 'huelle') chips.push('Gebäudehülle')
  if (answers.vorhaben === 'komplett') chips.push('Komplettsanierung')
  if (answers.vorhaben === 'kauf') chips.push('Altbaukauf')
  if (answers.vorhaben === 'gemischt') chips.push('Mehrere Themen')
  if (answers.nutzung === 'selbst') chips.push('Selbstnutzung')
  if (answers.nutzung === 'vermietet') chips.push('Vermietet')
  if (answers.we === '1') chips.push('1 WE')
  if (answers.we === '2') chips.push('2 WE')
  if (answers.we === '3plus') chips.push('3+ WE')
  if (answers.isfp === 'ja') chips.push('iSFP vorhanden')
  if (answers.isfp === 'offen') chips.push('iSFP interessant')
  if (answers.alteHeizung === 'oel') chips.push('Ölheizung')
  if (answers.alteHeizung === 'gas20') chips.push('Gas > 20 J.')
  if (answers.alteHeizung === 'gasEtage') chips.push('Gasetagenheizung')
  if (expertMode) {
    if (answers.neueHeizung === 'wp') chips.push('Neue WP')
    if (answers.neueHeizung === 'biomasse') chips.push('Neue Biomasse')
    if (answers.zielEh === '40ee') chips.push('Ziel EH 40')
    if (answers.zielEh === '50ee') chips.push('Ziel EH 50')
    if (answers.zielEh === '70ee') chips.push('Ziel EH 70')
    if (answers.foerderWeg === 'steuer') chips.push('Steuerweg')
    if (answers.foerderWeg === 'zuschuss') chips.push('Zuschussweg')
    if (answers.investition === 'ueber30') chips.push('Investition > 30k')
  }

  if (chips.length === 0) return null

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip}
          className="finder-fade-in rounded-full border border-ewe-navy/15 bg-white px-3 py-1 text-xs font-normal text-ewe-navy"
        >
          {chip}
        </span>
      ))}
    </div>
  )
}

function FazitBox({ fazit }: { fazit: FinderFazit }) {
  return (
    <div className="mb-8 overflow-hidden rounded-xl border-2 border-ewe-navy/15 bg-gradient-to-br from-white via-ewe-off-white to-emerald-50/40 shadow-sm">
      <div className="border-b border-ewe-navy/10 bg-ewe-navy px-5 py-4 text-white sm:px-6">
        <p className="text-xs font-bold uppercase tracking-wide text-white/60">Persönliches Fazit</p>
        <h3 className="mt-1 text-xl font-light sm:text-2xl">{fazit.title}</h3>
        <p className="mt-2 text-sm font-normal text-white/80">{fazit.lead}</p>
      </div>

      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-ewe-navy">
            <ArrowBullet size="sm" />
            Warum diese Wege passen
          </p>
          <ul className="mt-3 space-y-2.5">
            {fazit.why.map((line) => (
              <li key={line} className="text-sm font-normal leading-relaxed text-ewe-muted">
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-ewe-navy">
            <ArrowBullet size="sm" />
            Mögliche Größenordnungen
          </p>
          <ul className="mt-3 space-y-2.5">
            {fazit.sums.map((line) => (
              <li
                key={line}
                className="rounded-lg border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 text-sm font-normal leading-relaxed text-ewe-navy"
              >
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-normal italic text-ewe-muted">
            Orientierungswerte aus unserer Wissensbasis – keine Zusage, keine Rechtsberatung.
          </p>
        </div>
      </div>

      <div className="border-t border-ewe-navy/10 bg-white/70 px-5 py-4 sm:px-6">
        <p className="text-sm font-normal leading-relaxed text-ewe-navy">{fazit.tease}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={routes.kontakt}
            className="inline-flex rounded bg-ewe-navy px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-ewe-navy-light"
          >
            Jetzt neugierig? Termin anfragen
          </a>
          <a
            href={routes.checkliste}
            className="inline-flex rounded border border-ewe-navy/30 px-5 py-2.5 text-sm font-bold text-ewe-navy transition-colors hover:bg-ewe-navy/5"
          >
            Checkliste vorbereiten
          </a>
        </div>
      </div>
    </div>
  )
}

function ResultCard({ match }: { match: ProgramMatch }) {
  return (
    <Card accent={match.accent} className="transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-ewe-muted/70">{match.art}</p>
          <h3 className="mt-1 text-lg font-light text-ewe-navy">{match.name}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            match.likelihood === 'sehr-gut'
              ? 'bg-emerald-100 text-emerald-800'
              : match.likelihood === 'gut'
                ? 'bg-blue-100 text-blue-800'
                : match.likelihood === 'alternative'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-ewe-navy/10 text-ewe-navy'
          }`}
        >
          {LIKELIHOOD_LABEL[match.likelihood]}
        </span>
      </div>
      <p className="mt-3 text-sm font-normal leading-relaxed text-ewe-navy">{match.headline}</p>
      <ul className="mt-3 space-y-1.5">
        {match.points.map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm font-normal text-ewe-muted">
            <ArrowBullet size="sm" className="mt-0.5" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      {match.note && (
        <p className="mt-3 text-xs font-normal italic text-ewe-muted">{match.note}</p>
      )}
    </Card>
  )
}

export function FoerderFinder() {
  const [answers, setAnswers] = useState<FinderAnswers>({})
  const [expertMode, setExpertMode] = useState(false)
  const [showErgebnis, setShowErgebnis] = useState(false)
  const [justAnswered, setJustAnswered] = useState(false)

  const questions = useMemo(
    () => getActiveQuestions(answers, expertMode),
    [answers, expertMode],
  )
  const qIndex = getQuestionIndex(answers, expertMode)
  const complete = isFinderComplete(answers, expertMode)
  const current = questions[qIndex]
  const viewingErgebnis = complete && showErgebnis

  function toggleExpertMode() {
    if (expertMode) {
      setAnswers(stripExpertAnswers(answers))
      setExpertMode(false)
    } else {
      setExpertMode(true)
    }
    setShowErgebnis(false)
  }

  function selectAnswer(id: keyof FinderAnswers, value: string) {
    setJustAnswered(true)
    window.setTimeout(() => setJustAnswered(false), 280)

    const next: FinderAnswers = { ...answers, [id]: value }
    if (id === 'vorhaben') {
      setAnswers({
        vorhaben: value as FinderAnswers['vorhaben'],
        nutzung: answers.nutzung,
      })
      setShowErgebnis(false)
      return
    }
    if (id === 'nutzung') {
      setAnswers({
        ...next,
        steuerInteresse: undefined,
        einkommensteuer: undefined,
        fachunternehmen: undefined,
        foerderWeg: undefined,
      })
      setShowErgebnis(false)
      return
    }
    if (id === 'neueHeizung' && value !== 'wp' && value !== 'unbekannt') {
      next.wpHerkunft = 'keine-wp'
    }

    setAnswers(next)
    const nextQs = getActiveQuestions(next, expertMode)
    if (nextQs.every((q) => next[q.id] != null)) {
      setShowErgebnis(true)
    }
  }

  function goBack() {
    if (viewingErgebnis) {
      setShowErgebnis(false)
      return
    }
    if (qIndex <= 0) return
    const prevQ = questions[qIndex - 1]
    const next = { ...answers }
    delete next[prevQ.id]
    setAnswers(next)
    setShowErgebnis(false)
  }

  function restart() {
    setAnswers({})
    setShowErgebnis(false)
  }

  const matches = viewingErgebnis ? matchPrograms(answers, expertMode) : []
  const fazit = viewingErgebnis ? buildFazit(answers, matches, expertMode) : null
  const activeTab: FinderTabId = viewingErgebnis ? 'ergebnis' : (current?.tab ?? 'vorhaben')

  return (
    <section id="foerderfinder" className="bg-ewe-off-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          withIcon
          title="Förderfinder"
          subtitle="In wenigen Schritten sehen Sie, welche Programme voraussichtlich passen – spielerisch, klar und unverbindlich."
          align="left"
        />

        <div className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-normal leading-relaxed text-amber-950">
          <p className="font-bold">Keine verbindliche Beratung</p>
          <p className="mt-1">
            Der Förderfinder ist eine Orientierungshilfe auf Basis unserer dokumentierten
            Wissensbasis. Er ersetzt keine fachlich verpflichtende Energie-, Förder- oder
            Steuerberatung. Ziel ist, passende Wege sichtbar zu machen – und einen Termin mit
            unserem dena-zertifizierten Energieberater zu vereinbaren.
          </p>
        </div>

        <div className="mb-3 flex items-center justify-between gap-4 rounded-lg border border-ewe-navy/15 bg-white px-4 py-3 shadow-sm">
          <div className="min-w-0">
            <p className="text-sm font-bold text-ewe-navy">Expertenmodus</p>
            <p className="text-xs font-normal text-ewe-muted">
              {expertMode
                ? 'Alle steuernden Parameter – genauer, etwas länger.'
                : 'Aus für den Kurzcheck. An für alle Details.'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={expertMode}
            aria-label="Expertenmodus"
            onClick={toggleExpertMode}
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ewe-navy ${
              expertMode ? 'bg-ewe-navy' : 'bg-ewe-navy/25'
            }`}
          >
            <span
              className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300 ${
                expertMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="overflow-hidden rounded border border-ewe-navy/10 bg-white shadow-sm">
          <div className="border-b border-ewe-navy/10 bg-gradient-to-br from-ewe-navy to-ewe-navy-light px-5 py-5 text-white sm:px-6">
            <div className="flex items-start gap-3">
              <ArrowBullet size="lg" className="mt-0.5 brightness-0 invert" />
              <div className="flex-1">
                <p className="font-bold">Ihr Weg zur passenden Förderung</p>
                <p className="mt-1 text-sm font-normal text-white/75">
                  {expertMode
                    ? 'Alle relevanten Parameter – Tabs zeigen Ihren Fortschritt.'
                    : 'Kurzmodus: Tippen Sie sich durch – oder schalten Sie den Expertenmodus ein.'}
                </p>
              </div>
            </div>
            <div className="mt-5">
              <TabBar
                answers={answers}
                complete={complete}
                expertMode={expertMode}
                onSelectErgebnis={() => setShowErgebnis(true)}
              />
              <ProgressBar
                current={viewingErgebnis ? questions.length : qIndex}
                total={questions.length}
              />
              <AnswerSummary answers={answers} expertMode={expertMode} />
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {!viewingErgebnis && current && (
              <div
                key={`${current.id}-${expertMode}`}
                className={`transition-opacity duration-300 ${justAnswered ? 'opacity-60' : 'opacity-100'}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-ewe-muted/60">
                    {FINDER_TABS.find((t) => t.id === activeTab)?.label}
                  </p>
                  {current.expertOnly && (
                    <span className="rounded-full bg-ewe-navy/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ewe-navy">
                      Expertenfrage
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-xl font-light text-ewe-navy sm:text-2xl">{current.title}</h3>
                {current.subtitle && (
                  <p className="mt-2 text-sm font-normal text-ewe-muted">{current.subtitle}</p>
                )}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {current.options.map((option) => {
                    const selected = answers[current.id] === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => selectAnswer(current.id, option.value)}
                        className={`group rounded-xl border-2 px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                          selected
                            ? 'border-ewe-navy bg-ewe-navy text-white'
                            : 'border-ewe-navy/15 bg-ewe-off-white hover:border-ewe-navy hover:bg-white'
                        }`}
                      >
                        <span className="block text-sm font-bold sm:text-base">{option.label}</span>
                        {option.hint && (
                          <span
                            className={`mt-1 block text-xs font-normal ${
                              selected ? 'text-white/70' : 'text-ewe-muted'
                            }`}
                          >
                            {option.hint}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {viewingErgebnis && fazit && (
              <div className="finder-fade-in">
                <FazitBox fazit={fazit} />

                <h3 className="text-xl font-light text-ewe-navy sm:text-2xl">
                  Die Programme im Überblick
                </h3>
                <p className="mt-2 text-sm font-normal text-ewe-muted">
                  {expertMode
                    ? 'Details zu jedem Weg – weiterhin keine Förderzusage.'
                    : 'Details zu jedem Weg. Für feinere Zahlen: Expertenmodus oder Termin.'}
                </p>

                <div className="mt-6 grid gap-4">
                  {matches.map((match) => (
                    <ResultCard key={match.id} match={match} />
                  ))}
                </div>

                <div className="mt-8 rounded-xl bg-ewe-navy p-6 text-white sm:p-8">
                  <p className="text-lg font-light">Bereit für den nächsten Schritt?</p>
                  <p className="mt-2 text-sm font-normal text-white/80">
                    Unser dena-zertifizierter Energieberater macht aus dieser Orientierung eine
                    belastbare Strategie – ohne Doppelförderung, mit dem richtigen Antragsweg.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={routes.checkliste}
                      className="inline-flex rounded bg-white px-5 py-2.5 text-sm font-bold text-ewe-navy transition-colors hover:bg-white/90"
                    >
                      Checkliste ausfüllen
                    </a>
                    <a
                      href={routes.kontakt}
                      className="inline-flex rounded border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                    >
                      Beratungstermin anfragen
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ewe-navy/10 pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={goBack}
                disabled={qIndex === 0 && !viewingErgebnis}
              >
                Zurück
              </Button>
              <div className="flex flex-wrap gap-2">
                {complete && !viewingErgebnis && (
                  <Button type="button" size="sm" onClick={() => setShowErgebnis(true)}>
                    Zum Ergebnis
                  </Button>
                )}
                {(qIndex > 0 || viewingErgebnis) && (
                  <Button type="button" variant="outline" size="sm" onClick={restart}>
                    Neu starten
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
