import { brand } from '../design/brand'
import { WarmingStripes } from './ui/WarmingStripes'

export function Hero() {
  return (
    <section className="relative">
      <div
        className="relative flex min-h-[420px] items-end bg-ewe-navy bg-cover bg-center sm:min-h-[500px]"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(28,47,118,0.15), rgba(28,47,118,0.7)), url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80")',
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-32 sm:px-6 sm:pb-16">
          <p className="mb-3 text-sm font-normal text-white/80">
            Aktuell: GModG & KfW-Änderungen ab Juli 2026
          </p>
          <h1 className="max-w-3xl text-3xl font-light leading-snug text-white sm:text-4xl lg:text-5xl">
            {brand.hero}
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal text-white/90">
            <span className="font-bold">{brand.claim.line1.bold}</span>{' '}
            {brand.claim.line1.regular}
            <br />
            <span className="font-bold">{brand.claim.line2.bold}</span>{' '}
            {brand.claim.line2.regular}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#berater"
              className="rounded bg-white px-6 py-3 font-bold text-ewe-navy transition-colors hover:bg-white/90"
            >
              Online-Berater starten
            </a>
            <a
              href="#kontakt"
              className="rounded border border-white/40 px-6 py-3 font-bold text-white transition-colors hover:bg-white/10"
            >
              Beratung anfragen
            </a>
          </div>
        </div>
      </div>
      <WarmingStripes />
    </section>
  )
}
