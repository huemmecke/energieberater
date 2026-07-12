import logo from '../../assets/ewe_logo_light_landscape.svg'
import { routes } from '../lib/routes'

const navItems = [
  { href: routes.home, label: 'Home' },
  { href: routes.berater, label: 'KI-Berater' },
  { href: routes.checkliste, label: 'Checkliste' },
  { href: routes.about, label: 'Über uns' },
  { href: routes.kontakt, label: 'Kontakt' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <a href={routes.home} className="shrink-0">
          <img src={logo} alt="die energieweiser" className="h-9 w-auto sm:h-10" />
        </a>

        <nav className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 sm:gap-x-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-normal text-ewe-navy transition-colors hover:font-bold sm:text-base"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
