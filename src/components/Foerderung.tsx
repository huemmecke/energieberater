import { routes } from '../lib/routes'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'

const programs = [
  {
    name: 'BAFA Einzelmaßnahmen',
    accent: 'blue' as const,
    basis: '15 % ohne iSFP (1. WE max. 30.000 €)',
    optimal: 'mit iSFP bis 20 % über 30.000 € (1. WE max. 60.000 €)',
    hinweis: 'Gebäudehülle · optional iSFP',
  },
  {
    name: 'KfW 458 Heizungsförderung',
    accent: 'red' as const,
    basis: '30 % Basisförderung',
    optimal: 'bis 80 % bei Selbstnutzung (mit Boni)',
    hinweis: 'Vermietung max. 30 %',
  },
  {
    name: 'KfW 261 Komplettsanierung',
    accent: 'green' as const,
    basis: 'Tilgung EH 70EE 0 % / 50EE 5 % / 40EE 10 %',
    optimal: '+10 % bei WPB',
    hinweis: 'Max. 150.000 € je WE',
  },
  {
    name: '§35c EStG Steuerbonus',
    accent: 'amber' as const,
    basis: '20 % über 3 Jahre (7/7/6 %)',
    optimal: 'max. 40.000 € gesamt',
    hinweis: 'Nicht kombinierbar mit BAFA/KfW',
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
          <p className="text-lg font-light">Passende Förderung finden</p>
          <p className="mt-2 text-sm font-normal text-white/80">
            Unser Förderberater orientiert sich ausschließlich an unserer dokumentierten
            Wissensbasis – und führt Sie zur Checkliste und zum Beratungstermin.
          </p>
          <a
            href={routes.foerderung}
            className="mt-4 inline-block rounded bg-white px-6 py-3 font-bold text-ewe-navy transition-colors hover:bg-white/90"
          >
            Zum Förderberater
          </a>
        </div>
      </div>
    </section>
  )
}
