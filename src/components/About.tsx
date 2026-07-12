import { brand } from '../design/brand'
import carstenPhoto from '../../assets/img/carsten-neubauer.png'
import { ArrowList } from './ui/ArrowList'
import { SectionHeading } from './ui/SectionHeading'

export function About() {
  return (
    <section id="about" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-8 overflow-hidden rounded">
              <img
                src={carstenPhoto}
                alt={`${brand.contact.person}, ${brand.contact.title}`}
                className="aspect-[4/5] w-full max-w-sm object-cover object-top"
              />
            </div>

            <SectionHeading
              title={brand.contact.person}
              subtitle={brand.contact.title}
              align="left"
            />

            <div className="space-y-4 font-normal text-ewe-muted">
              <p>
                Studium Angewandte Physik (FH Aachen), Erfahrung im Lehmbau und als
                Fachplaner für ökologische Dämmmaterialien. Seit 2023 Ingenieurbüro
                „Die Energieweiser" in Soest.
              </p>
              <p>
                Von Mehrparteienhäusern bis historischem Fachwerk – ich begleite
                Sie bei der energetischen Sanierung Ihres Eigenheims.
              </p>
            </div>

            <ArrowList
              className="mt-6"
              size="md"
              itemClassName="text-sm font-normal text-ewe-muted"
              items={[
                'dena-zertifiziert seit 2022',
                'Individueller Sanierungsfahrplan',
                'Fördermittel optimal nutzen',
                'Baubegleitung & Controlling',
              ]}
            />
          </div>

          <div className="rounded bg-ewe-navy p-8 text-white lg:mt-16">
            <blockquote className="text-xl font-bold leading-relaxed">
              „Die beste Energie ist die, die wir nicht verbrauchen."
            </blockquote>
            <p className="mt-6 text-sm font-normal text-white/80">
              Gebäude sind wesentliche CO₂-Verursacher. Durch gezielte Sanierung
              senken Sie nicht nur Ihre Kosten, sondern leisten einen aktiven
              Beitrag zum Klimaschutz.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded bg-white/10 p-4 text-center">
                <p className="text-2xl font-bold">2023</p>
                <p className="text-xs font-normal text-white/60">Gründung</p>
              </div>
              <div className="rounded bg-white/10 p-4 text-center">
                <p className="text-2xl font-bold">Soest</p>
                <p className="text-xs font-normal text-white/60">Standort</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
