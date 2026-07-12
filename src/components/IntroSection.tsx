import { brand } from '../design/brand'
import { ArrowBullet } from './ui/ArrowBullet'

export function IntroSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <div className="mb-6 flex items-center justify-center gap-3 sm:gap-4">
          <ArrowBullet size="heading" />
          <h2 className="text-2xl font-light text-ewe-navy sm:text-3xl">
            {brand.sectionLead}
          </h2>
        </div>
        <p className="text-left text-base font-normal leading-relaxed text-ewe-navy/80 sm:text-center">
          {brand.description} Wir begleiten Sie von der ersten Orientierung über
          Fördermittel bis zur Baubegleitung – mit aktuellem Wissen zu GModG und
          KfW-Änderungen ab Juli 2026.
        </p>
        <p className="mt-4 text-left text-base font-normal leading-relaxed text-ewe-navy/80 sm:text-center">
          <span className="font-bold">{brand.claim.line1.bold}</span>{' '}
          {brand.claim.line1.regular} –{' '}
          <span className="font-bold">{brand.claim.line2.bold}</span>{' '}
          {brand.claim.line2.regular}.
        </p>
      </div>
    </section>
  )
}
