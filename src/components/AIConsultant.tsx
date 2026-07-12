import { useState, useRef, useEffect } from 'react'
import {
  aiResponses,
  defaultResponse,
  shouldSuggestForm,
  WELCOME_MESSAGE,
} from '../data/aiResponses'
import { INITIAL_QUICK_REPLIES, resolveQuickReplies } from '../data/chatOptions'
import { sendChatMessage, GeminiApiError } from '../lib/gemini'
import { routes } from '../lib/routes'
import { ArrowBullet } from './ui/ArrowBullet'
import { Button } from './ui/Button'
import { SectionHeading } from './ui/SectionHeading'

type Message = {
  role: 'user' | 'assistant'
  content: string
  showFormLink?: boolean
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

function findLocalAnswer(question: string): { answer: string; showFormLink: boolean } {
  const lower = question.toLowerCase()
  for (const rule of aiResponses) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return { answer: rule.answer, showFormLink: !!rule.suggestForm }
    }
  }
  return { answer: defaultResponse, showFormLink: shouldSuggestForm(question) }
}

function detectFormLink(answer: string): boolean {
  const trimmed = answer.trim()
  if (trimmed.length < 30) return false
  const lower = trimmed.toLowerCase()
  return (
    lower.includes('checkliste') ||
    lower.includes('#checkliste') ||
    lower.includes('erstanfrage') ||
    lower.includes('formular ausfüllen')
  )
}

function goToChecklist() {
  window.location.href = routes.checkliste
}

export function AIConsultant({ variant = 'page' }: { variant?: 'page' }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ])
  const [quickReplies, setQuickReplies] = useState<string[]>([...INITIAL_QUICK_REPLIES])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [useGemini, setUseGemini] = useState(true)
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
  ) {
    const fullHistory = [
      ...priorMessages,
      { role: 'assistant' as const, content: answer, showFormLink },
    ]
    const options =
      optionsFromApi && optionsFromApi.length > 0
        ? optionsFromApi
        : resolveQuickReplies(fullHistory, answer)

    setMessages(fullHistory)
    setQuickReplies(options)
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
      let answer: string
      let showFormLink = false
      let optionsFromApi: string[] | undefined

      if (useGemini) {
        const history = updatedMessages.slice(0, -1)
        const result = await sendChatMessage(text, history)
        answer = result.reply
        optionsFromApi = result.quickReplies

        if (!answer) {
          const local = findLocalAnswer(text)
          answer = local.answer
          showFormLink = local.showFormLink
          optionsFromApi = undefined
        } else {
          showFormLink = detectFormLink(answer)
        }
      } else {
        await new Promise((r) => setTimeout(r, 400))
        const local = findLocalAnswer(text)
        answer = local.answer
        showFormLink = local.showFormLink
      }

      applyAssistantReply(answer, updatedMessages, showFormLink, optionsFromApi)
    } catch (err) {
      const local = findLocalAnswer(text)
      const isQuota = err instanceof GeminiApiError && err.code === 'QUOTA_EXCEEDED'

      setApiError(
        isQuota
          ? 'Gemini-Kontingent aufgebraucht – lokale Antwort wird angezeigt.'
          : 'Gemini nicht erreichbar – lokale Antwort wird angezeigt.',
      )

      applyAssistantReply(local.answer, updatedMessages, local.showFormLink)
    } finally {
      setIsTyping(false)
    }
  }

  function handleQuickReply(text: string) {
    if (text === 'Checkliste ausfüllen' || text === 'Zur Checkliste') {
      goToChecklist()
      return
    }
    if (text === 'Kontakt aufnehmen') {
      window.location.href = routes.kontakt
      return
    }
    sendMessage(text)
  }

  const chatHeightClass =
    variant === 'page' ? 'min-h-[220px] max-h-[28rem]' : 'min-h-[140px] max-h-52'

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          withIcon
          title="KI-Energieberater"
          subtitle="Kurzes Erstgespräch – danach Orientierung zu Gesetzen, Förderung und Sanierung."
          align="left"
        />

        <div className="w-full">
          <div className="flex flex-col overflow-hidden rounded border border-ewe-navy/10 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-ewe-navy/10 bg-ewe-navy px-5 py-4">
              <ArrowBullet size="lg" className="brightness-0 invert" />
              <div className="flex-1">
                <p className="font-bold text-white">Energieweiser KI-Berater</p>
                <p className="text-xs font-normal text-white/60">Kurz &amp; dialogorientiert</p>
              </div>
              <label className="flex items-center gap-2 text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={useGemini}
                  onChange={(e) => setUseGemini(e.target.checked)}
                  className="rounded"
                />
                Gemini
              </label>
            </div>

            {apiError && (
              <div className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-xs text-amber-800">
                {apiError}
              </div>
            )}

            <div
              ref={chatContainerRef}
              className={`flex flex-1 flex-col gap-3 overflow-y-auto p-5 ${chatHeightClass}`}
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
                    </div>
                  </div>
                  {msg.showFormLink && msg.role === 'assistant' && (
                    <div className="mt-2 flex justify-start">
                      <a
                        href={routes.checkliste}
                        className="rounded bg-ewe-navy/10 px-3 py-1.5 text-xs font-bold text-ewe-navy hover:bg-ewe-navy/20"
                      >
                        → Checkliste für Erstanfrage ausfüllen
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
