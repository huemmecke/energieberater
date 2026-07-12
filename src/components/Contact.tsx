import { brand } from '../design/brand'
import { Button } from './ui/Button'

export function Contact() {
  return (
    <section id="kontakt" className="bg-ewe-navy py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-light sm:text-4xl">Beratung anfragen</h2>
            <p className="mt-4 font-normal leading-relaxed text-white/80">
              Vereinbaren Sie ein unverbindliches Erstgespräch. Die Kosten für die
              Energieberatung werden staatlich zu 50 % gefördert (max. 650 €).
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <p className="font-bold">E-Mail</p>
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="font-normal text-white/80 underline hover:text-white"
                >
                  {brand.contact.email}
                </a>
              </div>
              <div>
                <p className="font-bold">Standort</p>
                <p className="font-normal text-white/80">{brand.contact.location}</p>
              </div>
              <div>
                <p className="font-bold">Zertifizierung</p>
                <p className="font-normal text-white/80">{brand.contact.title}</p>
              </div>
            </div>
          </div>

          <form
            className="rounded bg-white p-6 text-ewe-navy sm:p-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-bold">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-1 w-full rounded border border-ewe-navy/20 px-4 py-2.5 text-sm font-normal outline-none focus:border-ewe-navy"
                  placeholder="Ihr Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold">
                  E-Mail
                </label>
                <input
                  id="email"
                  type="email"
                  className="mt-1 w-full rounded border border-ewe-navy/20 px-4 py-2.5 text-sm font-normal outline-none focus:border-ewe-navy"
                  placeholder="ihre@email.de"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold">
                  Nachricht
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 w-full rounded border border-ewe-navy/20 px-4 py-2.5 text-sm font-normal outline-none focus:border-ewe-navy"
                  placeholder="Worum geht es? Heizungstausch, Sanierung, Förderung…"
                />
              </div>
              <Button type="submit" className="w-full">
                Anfrage senden
              </Button>
              <p className="text-center text-xs font-normal text-ewe-muted">
                Wir melden uns innerhalb von 2 Werktagen bei Ihnen.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
