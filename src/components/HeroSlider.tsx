import { useEffect, useState } from 'react'
import type { SlideAlign } from '../data/heroSlides'
import { heroSlides } from '../data/heroSlides'
import { WarmingStripes } from './ui/WarmingStripes'

const alignClasses: Record<SlideAlign, string> = {
  center: 'items-center justify-center text-center',
  'bottom-center': 'items-end justify-center text-center',
  'bottom-right': 'items-end justify-end text-right pr-8 sm:pr-16',
  'top-right': 'items-start justify-end text-right pt-20 sm:pt-28 pr-8 sm:pr-16',
}

function KineticText({ text, slideKey }: { text: string; slideKey: number }) {
  const words = text.split(' ')
  let charIndex = 0

  return (
    <h1
      className="max-w-4xl text-2xl font-light leading-snug text-white sm:text-3xl lg:text-4xl xl:text-5xl"
      aria-label={text}
    >
      {words.map((word, wordIdx) => (
        <span
          key={`${slideKey}-word-${wordIdx}`}
          className={`inline-block whitespace-nowrap ${wordIdx < words.length - 1 ? 'mr-[0.35em]' : ''}`}
        >
          {[...word].map((char) => {
            const delay = charIndex * 0.04
            charIndex += 1
            return (
              <span
                key={`${slideKey}-ch-${charIndex}-${char}`}
                className="kinetic-char inline-block"
                style={{ animationDelay: `${delay}s` }}
                aria-hidden="true"
              >
                {char}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

export function HeroSlider() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % heroSlides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const slide = heroSlides[active]

  return (
    <section className="relative">
      <div className="relative h-[55vh] min-h-[400px] max-h-[620px] overflow-hidden bg-ewe-navy sm:h-[65vh]">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(28,47,118,0.15), rgba(28,47,118,0.5)), url(${s.image})`,
            }}
            aria-hidden={i !== active}
          />
        ))}

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-6 sm:px-10">
          <div
            className={`flex flex-1 pb-4 ${alignClasses[slide.align]}`}
          >
            <KineticText text={slide.text} slideKey={active} />
          </div>

          <div className="flex shrink-0 justify-center gap-2.5 pb-6 pt-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-7 bg-white shadow-md' : 'w-2.5 bg-white/45 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <WarmingStripes />
    </section>
  )
}
