import type { ReactNode } from 'react'
import logo from '../../assets/ewe_logo_light_landscape.svg'
import arrowLight from '../../assets/ewe_arrow_light.svg'
import arrowRegular from '../../assets/ewe_arrow_regular.svg'
import { brand, colors } from '../design/brand'
import { ArrowList } from '../components/ui/ArrowList'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SectionHeading } from '../components/ui/SectionHeading'
import { WarmingStripes } from '../components/ui/WarmingStripes'

function UiSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="border-b border-ewe-navy/10 py-16">
      <h2 className="mb-8 text-2xl font-bold text-ewe-navy">{title}</h2>
      {children}
    </section>
  )
}

export function UiSetPage() {
  return (
    <div className="min-h-screen bg-ewe-off-white">
      <header className="sticky top-0 z-50 border-b border-ewe-navy/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ewe-muted">
              Energieweiser Design System
            </p>
            <h1 className="text-xl font-bold text-ewe-navy">UI-Set Preview</h1>
          </div>
          <a
            href="/"
            className="text-sm font-normal text-ewe-navy underline hover:font-bold"
          >
            → Website Preview
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <UiSection id="typografie" title="Typografie – BioRhyme">
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs font-bold uppercase text-ewe-muted">Claim</p>
              <p className="text-3xl text-ewe-navy">
                <span className="font-bold">{brand.claim.line1.bold}</span>{' '}
                <span className="font-normal">{brand.claim.line1.regular}</span>
              </p>
              <p className="text-3xl text-ewe-navy">
                <span className="font-bold">{brand.claim.line2.bold}</span>{' '}
                <span className="font-normal">{brand.claim.line2.regular}</span>
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase text-ewe-muted">Tagline</p>
              <p className="text-lg font-bold text-ewe-navy">{brand.tagline}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <p className="text-sm font-normal text-ewe-muted">Regular 400 – Fließtext</p>
              <p className="text-sm font-bold text-ewe-navy">Bold 700 – Hervorhebung</p>
            </div>
          </div>
        </UiSection>

        <UiSection id="farben" title="Farbpalette">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(colors).map(([name, hex]) => (
              <div key={name} className="text-center">
                <div
                  className="mx-auto h-14 w-full rounded border border-ewe-navy/10"
                  style={{ backgroundColor: hex }}
                />
                <p className="mt-2 text-xs font-bold text-ewe-navy">{name}</p>
                <p className="text-xs text-ewe-muted">{hex}</p>
              </div>
            ))}
          </div>
        </UiSection>

        <UiSection id="logo" title="Logo">
          <img src={logo} alt="Logo" className="h-14" />
          <p className="mt-3 text-sm text-ewe-muted">
            Datei: <code>assets/ewe_logo_light_landscape.svg</code>
          </p>
        </UiSection>

        <UiSection id="pfeile" title="Pfeil-Bullets (ewe_arrow)">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <p className="mb-4 text-sm font-bold text-ewe-navy">Regular – klein (&lt; sm)</p>
              <img src={arrowRegular} alt="" className="mb-4 h-8" />
              <ArrowList
                size="sm"
                items={[
                  'Energieberatung & iSFP',
                  'Heizungs- & Sanierungsberatung',
                  'CO₂-Bilanzierung',
                ]}
              />
            </Card>
            <Card>
              <p className="mb-4 text-sm font-bold text-ewe-navy">Light – groß (≥ sm)</p>
              <img src={arrowLight} alt="" className="mb-4 h-10" />
              <ArrowList
                size="lg"
                items={[
                  'Individuelle Analyse Ihres Gebäudes',
                  'Sanierungsfahrplan (iSFP)',
                  'Fördermittel optimal nutzen',
                ]}
              />
            </Card>
          </div>
          <p className="mt-4 text-sm text-ewe-muted">
            Responsive: <code>ewe_arrow_regular.svg</code> auf Mobile,{' '}
            <code>ewe_arrow_light.svg</code> ab Breakpoint sm.
          </p>
        </UiSection>

        <UiSection id="komponenten" title="Komponenten">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <p className="mb-4 text-sm font-bold text-ewe-navy">Buttons</p>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </Card>
            <Card accent="navy">
              <SectionHeading
                withIcon
                title="Section Heading"
                subtitle="Mit Pfeil-Bullet als Leit-Icon"
                align="left"
              />
            </Card>
          </div>
        </UiSection>

        <UiSection id="warming-stripes" title="Warming Stripes">
          <div className="overflow-hidden rounded border border-ewe-navy/10">
            <div className="bg-white p-4 text-sm text-ewe-navy">Content-Bereich</div>
            <WarmingStripes />
            <div className="bg-ewe-navy p-4 text-sm font-bold text-white">{brand.tagline}</div>
          </div>
        </UiSection>

        <UiSection id="footer-preview" title="Footer-Aufbau">
          <Card>
            <ArrowList
              items={[
                'Navy-Hintergrund mit Logo (invertiert)',
                'Warming Stripes als schmaler Abschluss-Streifen',
                'BioRhyme Regular für Fließtext, Bold für Überschriften',
              ]}
            />
          </Card>
        </UiSection>
      </main>

      <footer className="mt-8">
        <div className="bg-ewe-navy px-6 py-4 text-center text-sm font-normal text-white/70">
          UI-Set Preview · Basierend auf input/ewe_web_20230312.pdf & ewe_flyer_98x210_FA_hi.pdf
        </div>
        <WarmingStripes />
      </footer>
    </div>
  )
}
