import { useState, useRef, useEffect } from 'react'
import {
  FOERDER_INITIAL_QUICK_REPLIES,
  FOERDER_LOCAL_FALLBACK,
  FOERDER_LOCAL_QUICK_REPLIES,
  FOERDER_WELCOME_MESSAGE,
} from '../data/foerderChat'
import { FoerderApiError, sendFoerderChatMessage } from '../lib/foerderChat'
import { routes } from '../lib/routes'
import { ArrowBullet } from './ui/ArrowBullet'
import { Button } from './ui/Button'
import { SectionHeading } from './ui/SectionHeading'

type Message = {
  role: 'user' | 'assistant'
  content: string
  showFormLink?: boolean
  quellen?: string[]
}

function QuickReplyPanel({
  options,
  onSelect,
  disabled,
}: {
  options: string[]
  onSelect: (text: string) => void
  disabled?: boolean
}) {
  if (options.length === 0) return null

  return (
    <div className="shrink-0 border-t-2 border-ewe-navy/20 bg-ewe-off-white px-4 py-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-ewe-navy">
        <ArrowBullet size="sm" />
        Zum Antworten auswählen
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option)}
            className="rounded-lg border-2 border-ewe-navy/30 bg-white px-4 py-2 text-sm font-normal text-ewe-navy shadow-sm transition-all hover:border-ewe-navy hover:bg-ewe-navy hover:text-white hover:shadow disabled:cursor-not-allowed disabled:opacity-40"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function detectFormLink(answer: string): boolean {
  const lower = answer.toLowerCase()
  return (
    lower.includes('checkliste') ||
    lower.includes('erstanfrage') ||
    lower.includes('beratungstermin') ||
    lower.includes('persönlich')
  )
}

function goToChecklist() {
  window.location.href = routes.checkliste
}

export function FoerderConsultant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: FOERDER_WELCOME_MESSAGE },
  ])
  const [quickReplies, setQuickReplies] = useState<string[]>([...FOERDER_INITIAL_QUICK_REPLIES])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = chatContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  function applyAssistantReply(
    answer: string,
    priorMessages: Message[],
    showFormLink: boolean,
    optionsFromApi?: string[],
    quellen?: string[],
  ) {
    const fullHistory: Message[] = [
      ...priorMessages,
      { role: 'assistant', content: answer, showFormLink, quellen },
    ]
    setMessages(fullHistory)
    setQuickReplies(
      optionsFromApi && optionsFromApi.length > 0
        ? optionsFromApi
        : [...FOERDER_LOCAL_QUICK_REPLIES],
    )
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return

    const userMsg: Message = { role: 'user', content: text.trim() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsTyping(true)
    setApiError(null)

    try {
      const history = updatedMessages.slice(0, -1)
      const result = await sendFoerderChatMessage(text, history)
      const answer = result.reply || FOERDER_LOCAL_FALLBACK
      applyAssistantReply(
        answer,
        updatedMessages,
        detectFormLink(answer),
        result.quickReplies.length > 0 ? result.quickReplies : undefined,
        result.quellen,
      )
    } catch (err) {
      const isQuota = err instanceof FoerderApiError && err.code === 'QUOTA_EXCEEDED'
      setApiError(
        isQuota
          ? 'Gemini-Kontingent aufgebraucht – sichere Fallback-Antwort.'
          : 'Förderberater nicht erreichbar – sichere Fallback-Antwort.',
      )
      applyAssistantReply(
        FOERDER_LOCAL_FALLBACK,
        updatedMessages,
        true,
        [...FOERDER_LOCAL_QUICK_REPLIES],
      )
    } finally {
      setIsTyping(false)
    }
  }

  function handleQuickReply(text: string) {
    if (text === 'Zur Checkliste' || text === 'Checkliste ausfüllen') {
      goToChecklist()
      return
    }
    if (text === 'Kontakt aufnehmen') {
      window.location.href = routes.kontakt
      return
    }
    sendMessage(text)
  }

  return (
    <section className="border-t border-ewe-navy/10 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          withIcon
          title="Förderberater"
          subtitle="Orientierung zu BAFA, KfW und § 35c EStG – ausschließlich auf Basis unserer Förder-Wissensbasis."
          align="left"
        />

        <div className="mb-8 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-normal leading-relaxed text-amber-950">
          <p className="font-bold">Wichtiger Hinweis</p>
          <p className="mt-1">
            Der Förderberater ersetzt keine verbindliche Förder-, Rechts- oder Steuerberatung.
            Alle Angaben stammen aus unserer dokumentierten Wissensbasis. Für Ihre individuelle
            Situation: Checkliste ausfüllen und persönlichen Beratungstermin vereinbaren.
          </p>
        </div>

        <div className="w-full">
          <div className="flex flex-col overflow-hidden rounded border border-ewe-navy/10 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-ewe-navy/10 bg-ewe-navy px-5 py-4">
              <ArrowBullet size="lg" className="brightness-0 invert" />
              <div className="flex-1">
                <p className="font-bold text-white">Energieweiser Förderberater</p>
                <p className="text-xs font-normal text-white/60">
                  Grounded · Wissensbasis FOERDERPROGRAMME
                </p>
              </div>
            </div>

            {apiError && (
              <div className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-xs text-amber-800">
                {apiError}
              </div>
            )}

            <div
              ref={chatContainerRef}
              className="flex min-h-[220px] max-h-[28rem] flex-1 flex-col gap-3 overflow-y-auto p-5"
            >
              {messages.map((msg, i) => (
                <div key={i}>
                  <div
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded px-4 py-3 text-sm font-normal leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-ewe-navy text-white'
                          : 'bg-ewe-off-white text-ewe-navy'
                      }`}
                    >
                      {msg.content}
                      {msg.quellen && msg.quellen.length > 0 && (
                        <p className="mt-2 text-[11px] font-normal text-ewe-muted/80">
                          Quelle: {msg.quellen.join(' · ')}
                        </p>
                      )}
                    </div>
                  </div>
                  {msg.showFormLink && msg.role === 'assistant' && (
                    <div className="mt-2 flex flex-wrap justify-start gap-2">
                      <a
                        href={routes.checkliste}
                        className="rounded bg-ewe-navy/10 px-3 py-1.5 text-xs font-bold text-ewe-navy hover:bg-ewe-navy/20"
                      >
                        → Checkliste für Erstanfrage ausfüllen
                      </a>
                      <a
                        href={routes.kontakt}
                        className="rounded bg-ewe-navy/10 px-3 py-1.5 text-xs font-bold text-ewe-navy hover:bg-ewe-navy/20"
                      >
                        → Beratungstermin anfragen
                      </a>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded bg-ewe-off-white px-4 py-3 text-sm text-ewe-muted">
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">·</span>
                      <span className="animate-bounce [animation-delay:0.1s]">·</span>
                      <span className="animate-bounce [animation-delay:0.2s]">·</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            <QuickReplyPanel
              options={quickReplies}
              onSelect={handleQuickReply}
              disabled={isTyping}
            />

            <div className="border-t border-ewe-navy/10 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage(input)
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Oder eigenes Anliegen eingeben…"
                  className="flex-1 rounded border border-ewe-navy/20 px-4 py-2.5 text-sm font-normal outline-none focus:border-ewe-navy"
                />
                <Button type="submit" disabled={!input.trim() || isTyping}>
                  Senden
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
