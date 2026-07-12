import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'

const services = [
  {
    title: 'Energieberatung',
    description:
      'Individuelle Analyse Ihres Gebäudes mit Sanierungsfahrplan (iSFP). Staatlich gefördert – 50 % der Beratungskosten werden erstattet.',
  },
  {
    title: 'Heizungsberatung',
    description:
      'Welche Heizung passt zu Ihrem Haus? Wärmepumpe, Biomasse oder Biotreppe – wir beraten technologieoffen und förderoptimiert.',
  },
  {
    title: 'Photovoltaik',
    description:
      'Planung und Baubegleitung von Solaranlagen – vom Einfamilienhaus bis zur Freiflächenanlage.',
  },
  {
    title: 'Fördermittelberatung',
    description:
      'KfW, BAFA, Steuerbonus §35c – wir navigieren Sie durch das Förderdschungel und nutzen alle verfügbaren Programme.',
  },
  {
    title: 'CO₂-Bilanzierung',
    description:
      'Aussagekräftiger Überblick über Ihren ökologischen Fußabdruck mit konkreten Maßnahmen zur Reduktion.',
  },
  {
    title: 'Baubegleitung',
    description:
      'Controlling und Qualitätssicherung bei der Umsetzung Ihrer Sanierungsmaßnahmen.',
  },
]

export function Services() {
  return (
    <section id="leistungen" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          withIcon
          title="Unsere Leistungen"
          subtitle="Von der ersten Beratung bis zur Baubegleitung – alles aus einer Hand."
          align="left"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title}>
              <h3 className="text-lg font-light text-ewe-navy">{service.title}</h3>
              <p className="mt-2 text-sm font-normal leading-relaxed text-ewe-muted">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
