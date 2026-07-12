import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'

const programs = [
  {
    name: 'BAFA Einzelmaßnahmen',
    accent: 'blue' as const,
    basis: '15 % Förderung, max. 30.000 €',
    optimal: '20 % Förderung, max. 60.000 €',
    hinweis: 'Mit Sanierungsfahrplan (iSFP)',
  },
  {
    name: 'KfW 458 Heizungsförderung',
    accent: 'red' as const,
    basis: '30 % Grundförderung',
    optimal: 'bis 70 % mit Boni',
    hinweis: 'Neue Konditionen ab 21.07.2026',
  },
  {
    name: 'KfW 261 Komplettsanierung',
    accent: 'green' as const,
    basis: '10 % Basisförderung',
    optimal: 'bis 25 % Tilgungszuschuss',
    hinweis: 'Ziel: Effizienzhaus 70 EE',
  },
  {
    name: '§35c EStG Steuerbonus',
    accent: 'amber' as const,
    basis: '20 % über 3 Jahre',
    optimal: 'max. 40.000 € gesamt',
    hinweis: 'Keine Doppelförderung!',
  },
]

export function Foerderung() {
  return (
    <section id="foerderung" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="Förderprogramme im Überblick"
          subtitle="Zuschüsse, Kredite und Steuervorteile lassen sich kombinieren – mit der richtigen Planung maximieren Sie Ihre Förderung."
          align="left"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {programs.map((program) => (
            <Card key={program.name} accent={program.accent}>
              <h3 className="text-lg font-light text-ewe-navy">{program.name}</h3>
              <p className="mt-1 text-xs font-normal text-ewe-muted">{program.hinweis}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase text-ewe-muted/60">Basis</p>
                  <p className="mt-1 text-sm font-normal">{program.basis}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-ewe-muted/60">Optimal</p>
                  <p className="mt-1 text-sm font-bold text-emerald-700">{program.optimal}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded bg-ewe-navy p-6 text-center text-white sm:p-8">
          <p className="text-lg font-light">Jetzt ist der richtige Zeitpunkt für eine Beratung</p>
          <p className="mt-2 text-sm font-normal text-white/80">
            Die Gesetzes- und Förderlandschaft ändert sich gerade fundamental.
          </p>
          <a
            href="#kontakt"
            className="mt-4 inline-block rounded bg-white px-6 py-3 font-bold text-ewe-navy transition-colors hover:bg-white/90"
          >
            Kostenlose Erstberatung anfragen
          </a>
        </div>
      </div>
    </section>
  )
}
