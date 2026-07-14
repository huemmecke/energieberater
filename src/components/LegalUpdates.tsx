import { legalUpdates } from '../data/legalUpdates'
import { ArrowList } from './ui/ArrowList'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'

export function LegalUpdates() {
  const { gmodg, kfw } = legalUpdates

  return (
    <section id="gesetze" className="bg-ewe-off-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="Was sich ab Juli 2026 ändert"
          subtitle="Die Energieweiser berücksichtigen die aktuellen Gesetzesänderungen in jeder Beratung."
          align="left"
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <Card accent="navy">
            <div className="mb-4 space-y-3">
              <h3 className="text-xl font-light text-ewe-navy">{gmodg.title}</h3>
              <span className="inline-block max-w-full rounded bg-emerald-100 px-3 py-1.5 text-xs font-bold leading-snug text-emerald-800">
                {gmodg.status}
              </span>
            </div>
            <p className="mb-6 text-sm font-normal text-ewe-muted">
              Inkrafttreten: {gmodg.inkrafttreten}
            </p>
            <ul className="space-y-4">
              {gmodg.punkte.map((punkt) => (
                <li key={punkt.label}>
                  <p className="font-bold text-ewe-navy">{punkt.label}</p>
                  <p className="mt-1 text-sm font-normal text-ewe-muted">{punkt.text}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card accent="navy">
            <h3 className="text-xl font-light text-ewe-navy">{kfw.title}</h3>
            <p className="mt-2 text-sm font-bold text-ewe-navy">{kfw.datum}</p>
            <p className="mt-2 text-sm font-normal text-ewe-muted">{kfw.uebergang}</p>

            <div className="mt-6">
              <h4 className="font-bold text-emerald-700">Mehr Förderung</h4>
              <ArrowList
                className="mt-3"
                size="sm"
                itemClassName="text-sm font-normal text-ewe-muted"
                items={kfw.mehrFoerderung}
              />
            </div>

            <div className="mt-6">
              <h4 className="font-bold text-red-600">Weniger Förderung</h4>
              <ArrowList
                className="mt-3"
                size="sm"
                itemClassName="text-sm font-normal text-ewe-muted"
                items={kfw.wenigerFoerderung}
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
