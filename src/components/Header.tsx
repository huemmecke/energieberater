import { useEffect, useState } from 'react'
import logo from '../../assets/ewe_logo_light_landscape.svg'
import { routes } from '../lib/routes'
import { ArrowBullet } from './ui/ArrowBullet'

const navItems = [
  { href: routes.home, label: 'Home' },
  { href: routes.berater, label: 'KI-Berater' },
  { href: routes.checkliste, label: 'Checkliste' },
  { href: routes.about, label: 'Über uns' },
  { href: routes.kontakt, label: 'Kontakt' },
]

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-6" aria-hidden="true">
      <span
        className={`absolute left-0 block h-0.5 w-6 rounded bg-ewe-navy transition-all duration-300 ${
          open ? 'top-2 rotate-45' : 'top-0'
        }`}
      />
      <span
        className={`absolute left-0 top-2 block h-0.5 w-6 rounded bg-ewe-navy transition-all duration-300 ${
          open ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
        }`}
      />
      <span
        className={`absolute left-0 block h-0.5 w-6 rounded bg-ewe-navy transition-all duration-300 ${
          open ? 'top-2 -rotate-45' : 'top-4'
        }`}
      />
    </span>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ewe-navy/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10 lg:py-5">
          <a href={routes.home} className="shrink-0">
            <img src={logo} alt="die energieweiser" className="h-8 w-auto sm:h-9 lg:h-10" />
          </a>

          <nav className="hidden items-center gap-x-8 lg:flex" aria-label="Hauptnavigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-normal text-ewe-navy transition-colors hover:font-bold lg:text-base"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded lg:hidden"
            aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <BurgerIcon open={menuOpen} />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-ewe-navy/40 transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Menü schließen"
          tabIndex={menuOpen ? 0 : -1}
          onClick={closeMenu}
        />

        <nav
          id="mobile-nav"
          className={`absolute inset-y-0 right-0 flex w-[min(100vw,20rem)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-label="Mobile Navigation"
          aria-hidden={!menuOpen}
        >
          <div className="flex items-center justify-between border-b border-ewe-navy/10 px-5 py-4">
            <span className="text-sm font-light text-ewe-navy">Navigation</span>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded"
              aria-label="Menü schließen"
              onClick={closeMenu}
            >
              <BurgerIcon open />
            </button>
          </div>

          <ul className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-normal text-ewe-navy transition-colors hover:bg-ewe-off-white"
                  onClick={closeMenu}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <ArrowBullet size="sm" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
