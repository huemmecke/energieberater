import logo from '../../assets/ewe_logo_light_landscape.svg'
import { brand } from '../design/brand'
import { ArrowList } from './ui/ArrowList'
import { WarmingStripes } from './ui/WarmingStripes'

export function Footer() {
  return (
    <footer>
      <div className="bg-ewe-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <img
                src={logo}
                alt={brand.name}
                className="mb-4 h-10 brightness-0 invert"
              />
              <p className="text-sm font-normal leading-relaxed text-white/80">
                {brand.description}
              </p>
              <p className="mt-3 text-sm font-bold text-white">{brand.tagline}</p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/60">
                Leistungen
              </h3>
              <ArrowList
                size="sm"
                itemClassName="text-sm font-normal text-white/80 [&_img]:brightness-0 [&_img]:invert"
                items={[
                  'Energieberatung & iSFP',
                  'Heizungs- & Sanierungsberatung',
                  'CO₂-Bilanzierung',
                  'PV-Planung & Baubegleitung',
                ]}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/60">
                Kontakt
              </h3>
              <ArrowList
                size="sm"
                itemClassName="text-sm font-normal text-white/80 [&_img]:brightness-0 [&_img]:invert"
                items={[
                  brand.contact.person,
                  brand.contact.title,
                  brand.contact.location,
                  <a
                    key="email"
                    href={`mailto:${brand.contact.email}`}
                    className="underline decoration-white/30 hover:text-white"
                  >
                    {brand.contact.email}
                  </a>,
                ]}
              />
            </div>
          </div>

          <div className="mt-8 border-t border-white/20 pt-6 text-center text-xs font-normal text-white/50">
            <p>© {new Date().getFullYear()} {brand.name} · Stand: Juli 2026</p>
            <p className="mt-1">
              Hinweis: Keine Rechtsberatung. Gesetzesänderungen können sich noch ändern.
            </p>
          </div>
        </div>
      </div>
      <WarmingStripes />
    </footer>
  )
}
