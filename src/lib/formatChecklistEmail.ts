export type ChecklistData = {
  eigentuemerName: string
  eigentuemerStrasse: string
  eigentuemerPlzOrt: string
  eigentuemerKontakt: string
  gebaeudeStrasse: string
  gebaeudePlzOrt: string
  baujahr: string
  wohnflaeche: string
  selbstBewohnt: string
  gebaeudeart: string
  gebaeudeartDetails: string
  mischnutzung: string
  besonderheiten: string
  heizungHersteller: string
  heizungTyp: string
  heizungEinbaujahr: string
  heizungEnergietraeger: string
  wwKombi: string
  wwDetails: string
  waermeabgabe: string
  solarthermie: string
  solarthermieDetails: string
  photovoltaik: string
  photovoltaikDetails: string
  lueftung: string
  lueftungDetails: string
  sanierungDurchgefuehrt: string
  sanierungMassnahmen: string[]
  sanierungDetails: string
  sanierungGeplant: string
  sanierungGeplantDetails: string
  maengel: string
  maengelDetails: string
  beratungsziele: string[]
  unterlagenPlan: string[]
  unterlagenDetail: string[]
  unterlagenWeitere: string[]
  unterlagenSonstiges: string
  datenschutz: boolean
  datumOrt: string
}

export function formatChecklistEmail(data: ChecklistData): { subject: string; body: string } {
  const jaNein = (v: string) => v || '–'
  const list = (items: string[]) => (items.length ? items.join(', ') : '–')

  const body = `Checkliste Datenaufnahme Wohngebäude 2026
=====================================

GEBÄUDEEIGENTÜMER/IN
Name: ${data.eigentuemerName}
Adresse: ${data.eigentuemerStrasse}, ${data.eigentuemerPlzOrt}
Kontakt: ${data.eigentuemerKontakt}

GEBÄUDEANGABEN
Adresse: ${data.gebaeudeStrasse}, ${data.gebaeudePlzOrt}
Baujahr: ${data.baujahr}
Wohnfläche: ${data.wohnflaeche} m²
Selbst bewohnt / übernommen seit: ${data.selbstBewohnt}
Gebäudeart: ${data.gebaeudeart}
Details: ${data.gebaeudeartDetails}
Mischnutzung: ${jaNein(data.mischnutzung)}
Besonderheiten: ${jaNein(data.besonderheiten)}

HEIZUNG / WARMWASSER
Hersteller/Modell: ${data.heizungHersteller}
Typ: ${data.heizungTyp}
Einbaujahr: ${data.heizungEinbaujahr}
Energieträger: ${data.heizungEnergietraeger}
WW Kombi mit Heizung: ${jaNein(data.wwKombi)}
WW Details: ${data.wwDetails}
Wärmeabgabe: ${data.waermeabgabe}

SOLAR & LÜFTUNG
Solarthermie: ${jaNein(data.solarthermie)}
Details: ${data.solarthermieDetails}
Photovoltaik: ${jaNein(data.photovoltaik)}
Details: ${data.photovoltaikDetails}
Lüftung: ${jaNein(data.lueftung)}
Details: ${data.lueftungDetails}

SANIERUNG
Bereits durchgeführt: ${jaNein(data.sanierungDurchgefuehrt)}
Maßnahmen: ${list(data.sanierungMassnahmen)}
Details: ${data.sanierungDetails}
Geplant/notwendig: ${jaNein(data.sanierungGeplant)}
Geplante Maßnahmen: ${data.sanierungGeplantDetails}

MÄNGEL
Vorhanden: ${jaNein(data.maengel)}
Details: ${data.maengelDetails}

BERATUNGSZIELE
${list(data.beratungsziele)}

VORLIEGENDE UNTERLAGEN
Planunterlagen: ${list(data.unterlagenPlan)}
Detailzeichnungen: ${list(data.unterlagenDetail)}
Weitere: ${list(data.unterlagenWeitere)}
Sonstiges: ${data.unterlagenSonstiges || '–'}

DATENSCHUTZ EINWILLIGUNG: ${data.datenschutz ? 'Ja' : 'Nein'}
Datum, Ort: ${data.datumOrt}
`

  return {
    subject: `Erstanfrage Checkliste – ${data.eigentuemerName || 'Wohngebäude'}`,
    body,
  }
}

export function buildMailtoLink(data: ChecklistData, email = 'kontakt@energieweiser.de'): string {
  const { subject, body } = formatChecklistEmail(data)
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
