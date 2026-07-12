import { useState } from 'react'
import { brand } from '../design/brand'
import {
  beratungsziele,
  checklistIntro,
  detailzeichnungen,
  planunterlagen,
  sanierungsMassnahmen,
  weitereUnterlagen,
} from '../data/checklistForm'
import { buildMailtoLink, type ChecklistData } from '../lib/formatChecklistEmail'
import { ArrowList } from './ui/ArrowList'
import { Button } from './ui/Button'
import { SectionHeading } from './ui/SectionHeading'

const STEPS = [
  'Eigentümer & Gebäude',
  'Heizung & Technik',
  'Sanierung & Mängel',
  'Beratungsziel',
  'Unterlagen & Senden',
]

const emptyForm = (): ChecklistData => ({
  eigentuemerName: '',
  eigentuemerStrasse: '',
  eigentuemerPlzOrt: '',
  eigentuemerKontakt: '',
  gebaeudeStrasse: '',
  gebaeudePlzOrt: '',
  baujahr: '',
  wohnflaeche: '',
  selbstBewohnt: '',
  gebaeudeart: '',
  gebaeudeartDetails: '',
  mischnutzung: 'nein',
  besonderheiten: '',
  heizungHersteller: '',
  heizungTyp: '',
  heizungEinbaujahr: '',
  heizungEnergietraeger: '',
  wwKombi: '',
  wwDetails: '',
  waermeabgabe: '',
  solarthermie: 'nein',
  solarthermieDetails: '',
  photovoltaik: 'nein',
  photovoltaikDetails: '',
  lueftung: 'nein',
  lueftungDetails: '',
  sanierungDurchgefuehrt: 'nein',
  sanierungMassnahmen: [],
  sanierungDetails: '',
  sanierungGeplant: 'nein',
  sanierungGeplantDetails: '',
  maengel: 'nein',
  maengelDetails: '',
  beratungsziele: [],
  unterlagenPlan: [],
  unterlagenDetail: [],
  unterlagenWeitere: [],
  unterlagenSonstiges: '',
  datenschutz: false,
  datumOrt: '',
})

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-ewe-navy">{label}</span>
      {children}
    </label>
  )
}

function inputClass() {
  return 'w-full rounded border border-ewe-navy/20 px-3 py-2 text-sm font-normal outline-none focus:border-ewe-navy'
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-start gap-2 text-sm font-normal text-ewe-navy">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={(e) => {
              onChange(
                e.target.checked
                  ? [...selected, opt]
                  : selected.filter((s) => s !== opt),
              )
            }}
            className="mt-1"
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  )
}

export function ChecklistForm({ variant = 'page' }: { variant?: 'page' }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<ChecklistData>(emptyForm)
  const [submitted, setSubmitted] = useState(false)

  function update<K extends keyof ChecklistData>(key: K, value: ChecklistData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.datenschutz) return
    window.location.href = buildMailtoLink(form, brand.contact.email)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className={`bg-white ${variant === 'page' ? 'py-12 sm:py-16' : 'py-20'}`}>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-light text-ewe-navy">Vielen Dank!</h2>
          <p className="mt-4 text-ewe-muted">
            Ihr E-Mail-Programm sollte sich geöffnet haben. Bitte senden Sie die
            Nachricht ab – damit erhalten wir Ihre ausgefüllte Checkliste.
          </p>
          <Button className="mt-6" onClick={() => setSubmitted(false)}>
            Formular bearbeiten
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className={`bg-white ${variant === 'page' ? 'py-12 sm:py-16' : 'py-20'}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          withIcon
          title={checklistIntro.title}
          subtitle={checklistIntro.subtitle}
          align="left"
        />

        <div className="mb-8 flex flex-wrap gap-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                step === i
                  ? 'bg-ewe-navy text-white'
                  : 'border border-ewe-navy/20 text-ewe-navy'
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded border border-ewe-navy/10 bg-ewe-off-white p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-light text-ewe-navy">Gebäudeeigentümer/in</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name(n)">
                  <input className={inputClass()} value={form.eigentuemerName} onChange={(e) => update('eigentuemerName', e.target.value)} required />
                </Field>
                <Field label="Telefon / E-Mail">
                  <input className={inputClass()} value={form.eigentuemerKontakt} onChange={(e) => update('eigentuemerKontakt', e.target.value)} required />
                </Field>
                <Field label="Straße, Hausnummer">
                  <input className={inputClass()} value={form.eigentuemerStrasse} onChange={(e) => update('eigentuemerStrasse', e.target.value)} />
                </Field>
                <Field label="PLZ, Ort">
                  <input className={inputClass()} value={form.eigentuemerPlzOrt} onChange={(e) => update('eigentuemerPlzOrt', e.target.value)} />
                </Field>
              </div>

              <h3 className="pt-4 font-light text-ewe-navy">Gebäudeangaben</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Straße, Hausnummer">
                  <input className={inputClass()} value={form.gebaeudeStrasse} onChange={(e) => update('gebaeudeStrasse', e.target.value)} required />
                </Field>
                <Field label="PLZ, Ort">
                  <input className={inputClass()} value={form.gebaeudePlzOrt} onChange={(e) => update('gebaeudePlzOrt', e.target.value)} required />
                </Field>
                <Field label="Baujahr">
                  <input className={inputClass()} value={form.baujahr} onChange={(e) => update('baujahr', e.target.value)} />
                </Field>
                <Field label="Wohnfläche (m²)">
                  <input className={inputClass()} value={form.wohnflaeche} onChange={(e) => update('wohnflaeche', e.target.value)} />
                </Field>
                <Field label="Selbst bewohnt / übernommen seit">
                  <input className={inputClass()} value={form.selbstBewohnt} onChange={(e) => update('selbstBewohnt', e.target.value)} />
                </Field>
                <Field label="Gebäudeart">
                  <select className={inputClass()} value={form.gebaeudeart} onChange={(e) => update('gebaeudeart', e.target.value)}>
                    <option value="">Bitte wählen</option>
                    <option value="Einfamilienhaus">Einfamilienhaus</option>
                    <option value="Mehrfamilienhaus">Mehrfamilienhaus</option>
                    <option value="Reihenhaus">Reihenhaus</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </Field>
              </div>
              <Field label="Weitere Angaben (Anbau, Nutzer, Besonderheiten)">
                <textarea className={inputClass()} rows={3} value={form.gebaeudeartDetails} onChange={(e) => update('gebaeudeartDetails', e.target.value)} />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-light text-ewe-navy">Heizung / Warmwasser</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Hersteller / Modell">
                  <input className={inputClass()} value={form.heizungHersteller} onChange={(e) => update('heizungHersteller', e.target.value)} />
                </Field>
                <Field label="Einbaujahr">
                  <input className={inputClass()} value={form.heizungEinbaujahr} onChange={(e) => update('heizungEinbaujahr', e.target.value)} />
                </Field>
                <Field label="Energieträger">
                  <input className={inputClass()} value={form.heizungEnergietraeger} onChange={(e) => update('heizungEnergietraeger', e.target.value)} placeholder="Gas, Öl, Strom, Pellets…" />
                </Field>
                <Field label="Heizungstyp">
                  <select className={inputClass()} value={form.heizungTyp} onChange={(e) => update('heizungTyp', e.target.value)}>
                    <option value="">Bitte wählen</option>
                    <option value="Standardkessel">Standardkessel</option>
                    <option value="Brennwertkessel">Brennwertkessel</option>
                    <option value="Wärmepumpe">Wärmepumpe</option>
                    <option value="Pellet">Pellet-Zentralheizung</option>
                    <option value="Nachtspeicher">Nachtspeicher / Elektro</option>
                    <option value="Unbekannt">Technik unbekannt</option>
                  </select>
                </Field>
                <Field label="Warmwasser kombiniert mit Heizung?">
                  <select className={inputClass()} value={form.wwKombi} onChange={(e) => update('wwKombi', e.target.value)}>
                    <option value="">–</option>
                    <option value="ja">Ja</option>
                    <option value="nein">Nein</option>
                  </select>
                </Field>
                <Field label="Wärmeabgabe">
                  <select className={inputClass()} value={form.waermeabgabe} onChange={(e) => update('waermeabgabe', e.target.value)}>
                    <option value="">–</option>
                    <option value="Heizkörper">Heizkörper</option>
                    <option value="Fußbodenheizung">Fußbodenheizung</option>
                    <option value="Flächenheizung">Wand-/Flächenheizung</option>
                  </select>
                </Field>
              </div>
              <Field label="Weitere Angaben Warmwasser / Ofen">
                <textarea className={inputClass()} rows={2} value={form.wwDetails} onChange={(e) => update('wwDetails', e.target.value)} />
              </Field>

              <h3 className="pt-2 font-light text-ewe-navy">Solar & Lüftung</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Solarthermie vorhanden?">
                  <select className={inputClass()} value={form.solarthermie} onChange={(e) => update('solarthermie', e.target.value)}>
                    <option value="nein">Nein</option>
                    <option value="ja">Ja</option>
                  </select>
                </Field>
                <Field label="Photovoltaik vorhanden?">
                  <select className={inputClass()} value={form.photovoltaik} onChange={(e) => update('photovoltaik', e.target.value)}>
                    <option value="nein">Nein</option>
                    <option value="ja">Ja</option>
                  </select>
                </Field>
                <Field label="Lüftungsanlage vorhanden?">
                  <select className={inputClass()} value={form.lueftung} onChange={(e) => update('lueftung', e.target.value)}>
                    <option value="nein">Nein</option>
                    <option value="ja">Ja</option>
                  </select>
                </Field>
              </div>
              <Field label="Details Solar / PV / Lüftung">
                <textarea className={inputClass()} rows={2} value={form.solarthermieDetails} onChange={(e) => update('solarthermieDetails', e.target.value)} placeholder="Einbaujahr, Leistung, Typ…" />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Field label="Bereits durchgeführte Sanierungen?">
                <select className={inputClass()} value={form.sanierungDurchgefuehrt} onChange={(e) => update('sanierungDurchgefuehrt', e.target.value)}>
                  <option value="nein">Nein</option>
                  <option value="ja">Ja</option>
                </select>
              </Field>
              {form.sanierungDurchgefuehrt === 'ja' && (
                <>
                  <p className="text-sm font-bold text-ewe-navy">Welche Maßnahmen?</p>
                  <CheckboxGroup
                    options={sanierungsMassnahmen}
                    selected={form.sanierungMassnahmen}
                    onChange={(v) => update('sanierungMassnahmen', v)}
                  />
                  <Field label="Details (Jahr, Dämmstoffstärke…)">
                    <textarea className={inputClass()} rows={3} value={form.sanierungDetails} onChange={(e) => update('sanierungDetails', e.target.value)} />
                  </Field>
                </>
              )}

              <Field label="Geplante oder notwendige Sanierungen?">
                <select className={inputClass()} value={form.sanierungGeplant} onChange={(e) => update('sanierungGeplant', e.target.value)}>
                  <option value="nein">Nein</option>
                  <option value="ja">Ja</option>
                </select>
              </Field>
              {form.sanierungGeplant === 'ja' && (
                <Field label="Geplante Maßnahmen & Zeitraum">
                  <textarea className={inputClass()} rows={3} value={form.sanierungGeplantDetails} onChange={(e) => update('sanierungGeplantDetails', e.target.value)} />
                </Field>
              )}

              <Field label="Bekannte Mängel (Feuchte, Schimmel, Bauschäden)?">
                <select className={inputClass()} value={form.maengel} onChange={(e) => update('maengel', e.target.value)}>
                  <option value="nein">Nein</option>
                  <option value="ja">Ja</option>
                </select>
              </Field>
              {form.maengel === 'ja' && (
                <Field label="Mängel – Ort & Beschreibung">
                  <textarea className={inputClass()} rows={2} value={form.maengelDetails} onChange={(e) => update('maengelDetails', e.target.value)} />
                </Field>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-ewe-navy">Welchen Anforderungen soll die Energieberatung genügen?</p>
              <CheckboxGroup
                options={beratungsziele}
                selected={form.beratungsziele}
                onChange={(v) => update('beratungsziele', v)}
              />
              <ArrowList
                size="sm"
                itemClassName="text-xs text-ewe-muted"
                items={[
                  'Keine Auftragserteilung – Vorbereitung auf Erstgespräch',
                  'Keine Haftung für Fördermittelbeantragung',
                ]}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-ewe-navy">Welche Unterlagen liegen vor?</p>
              <Field label="Planunterlagen">
                <CheckboxGroup options={planunterlagen} selected={form.unterlagenPlan} onChange={(v) => update('unterlagenPlan', v)} />
              </Field>
              <Field label="Detailzeichnungen">
                <CheckboxGroup options={detailzeichnungen} selected={form.unterlagenDetail} onChange={(v) => update('unterlagenDetail', v)} />
              </Field>
              <Field label="Weitere Unterlagen">
                <CheckboxGroup options={weitereUnterlagen} selected={form.unterlagenWeitere} onChange={(v) => update('unterlagenWeitere', v)} />
              </Field>
              <Field label="Sonstige Unterlagen">
                <input className={inputClass()} value={form.unterlagenSonstiges} onChange={(e) => update('unterlagenSonstiges', e.target.value)} />
              </Field>

              <Field label="Datum, Ort">
                <input className={inputClass()} value={form.datumOrt} onChange={(e) => update('datumOrt', e.target.value)} placeholder="12.07.2026, Soest" required />
              </Field>

              <label className="flex items-start gap-3 text-sm font-normal text-ewe-muted">
                <input
                  type="checkbox"
                  checked={form.datenschutz}
                  onChange={(e) => update('datenschutz', e.target.checked)}
                  className="mt-1"
                  required
                />
                <span>
                  Ich willige ein, dass meine Daten vom Ingenieurbüro Die Energieweiser
                  (Jakobistr. 22, 59494 Soest) zur Vorbereitung der Energieberatung
                  gespeichert und verarbeitet werden dürfen.
                </span>
              </label>
            </div>
          )}

          <div className="flex justify-between border-t border-ewe-navy/10 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Zurück
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                Weiter
              </Button>
            ) : (
              <Button type="submit" disabled={!form.datenschutz}>
                Checkliste per E-Mail senden
              </Button>
            )}
          </div>
        </form>

        <p className="mt-4 text-xs text-ewe-muted">{checklistIntro.disclaimer}</p>
      </div>
    </section>
  )
}
