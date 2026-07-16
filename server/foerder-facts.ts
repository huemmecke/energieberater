/** Strukturierte Fakten aus FOERDERPROGRAMME.md – einzige Zahlenquelle für Validierung. */
export const foerderFacts = {
  stand: 'Juli 2026',
  keineDoppelfoerderung: '§ 35c EStG ist nicht kombinierbar mit BAFA oder KfW.',

  bafa: {
    ohneIsfp: {
      foerdersatz: 15,
      maxInvest: { we1: 30000, we2bis6: 15000, abWe7: 8000 },
      energieberatungFoerderung: 50,
    },
    mitIsfp: {
      foerdersatzBis30000: 15,
      foerdersatzUeber30000: 20,
      maxInvest: { we1: 60000, we2bis6: 30000, abWe7: 16000 },
      isfpKostenVon: 1500,
      isfpKostenBis: 3500,
      energieberatungFoerderung: 50,
    },
  },

  kfw358: {
    einkommenUnter: 90000,
    maxKreditJeWe: 120000,
    name: 'KfW-Ergänzungskredit Plus',
  },

  kfw359: {
    einkommenUeber: 90000,
    maxKreditJeWe: 120000,
    name: 'KfW-Ergänzungskredit',
  },

  kfw458: {
    basis: 30,
    klimaBonus: 16,
    klimaBonusGasAlterJahre: 20,
    sozialBonus: [
      { einkommenBis: 30000, bonus: 40 },
      { einkommenBis: 40000, bonus: 30 },
      { einkommenBis: 50000, bonus: 10 },
    ],
    kindErhoehungEinkommen: 10000,
    maxSelbstnutzung: 80,
    maxVermietung: 30,
    kosten: { efh: 28000, we2: 43000, we3: 58000 },
    ab2027WpAusserhalbEuAbzug: 15,
  },

  kfw261: {
    tilgung: { eh70ee: 0, eh50ee: 5, eh40ee: 10 },
    wpbBonus: 10,
    maxKostenJeWe: 150000,
    energieberatungMax: 10000,
    energieberatungFoerderung: 50,
    wpbBaujahrAelterAls: 1957,
    wpbWandanteilUnaniertPct: 75,
  },

  kfw308: {
    einkommenBasis: 90000,
    kindZuschlag: 10000,
    kredit: { einKind: 100000, zweiKinder: 125000, abDrei: 150000 },
    sanierungsfristMonate: 54,
    zielEffizienzhaus: 85,
  },

  para35c: {
    absetzbarPct: 20,
    jahr1Pct: 7,
    jahr2Pct: 7,
    jahr3Pct: 6,
    maxInvestJeWe: 200000,
    maxAbschreibungGesamt: 40000,
    maxJahr1und2: 14000,
    maxJahr3: 12000,
    gebaeudeMinAlterJahre: 10,
    energieberatungAbsetzbarPctJahr1: 50,
  },
} as const

/** Alle bekannten Prozent- und Euro-Werte als String-Liste für Antwort-Validierung. */
export function collectAllowedNumbers(): Set<string> {
  const values: number[] = [
    foerderFacts.bafa.ohneIsfp.foerdersatz,
    foerderFacts.bafa.ohneIsfp.maxInvest.we1,
    foerderFacts.bafa.ohneIsfp.maxInvest.we2bis6,
    foerderFacts.bafa.ohneIsfp.maxInvest.abWe7,
    foerderFacts.bafa.ohneIsfp.energieberatungFoerderung,
    foerderFacts.bafa.mitIsfp.foerdersatzBis30000,
    foerderFacts.bafa.mitIsfp.foerdersatzUeber30000,
    foerderFacts.bafa.mitIsfp.maxInvest.we1,
    foerderFacts.bafa.mitIsfp.maxInvest.we2bis6,
    foerderFacts.bafa.mitIsfp.maxInvest.abWe7,
    foerderFacts.bafa.mitIsfp.isfpKostenVon,
    foerderFacts.bafa.mitIsfp.isfpKostenBis,
    foerderFacts.kfw358.einkommenUnter,
    foerderFacts.kfw358.maxKreditJeWe,
    foerderFacts.kfw359.einkommenUeber,
    foerderFacts.kfw359.maxKreditJeWe,
    foerderFacts.kfw458.basis,
    foerderFacts.kfw458.klimaBonus,
    foerderFacts.kfw458.klimaBonusGasAlterJahre,
    foerderFacts.kfw458.maxSelbstnutzung,
    foerderFacts.kfw458.maxVermietung,
    foerderFacts.kfw458.kosten.efh,
    foerderFacts.kfw458.kosten.we2,
    foerderFacts.kfw458.kosten.we3,
    foerderFacts.kfw458.kindErhoehungEinkommen,
    foerderFacts.kfw458.ab2027WpAusserhalbEuAbzug,
    ...foerderFacts.kfw458.sozialBonus.flatMap((b) => [b.einkommenBis, b.bonus]),
    foerderFacts.kfw261.tilgung.eh70ee,
    foerderFacts.kfw261.tilgung.eh50ee,
    foerderFacts.kfw261.tilgung.eh40ee,
    foerderFacts.kfw261.wpbBonus,
    foerderFacts.kfw261.maxKostenJeWe,
    foerderFacts.kfw261.energieberatungMax,
    foerderFacts.kfw261.energieberatungFoerderung,
    foerderFacts.kfw261.wpbBaujahrAelterAls,
    foerderFacts.kfw261.wpbWandanteilUnaniertPct,
    foerderFacts.kfw308.einkommenBasis,
    foerderFacts.kfw308.kindZuschlag,
    foerderFacts.kfw308.kredit.einKind,
    foerderFacts.kfw308.kredit.zweiKinder,
    foerderFacts.kfw308.kredit.abDrei,
    foerderFacts.kfw308.sanierungsfristMonate,
    foerderFacts.kfw308.zielEffizienzhaus,
    foerderFacts.para35c.absetzbarPct,
    foerderFacts.para35c.jahr1Pct,
    foerderFacts.para35c.jahr2Pct,
    foerderFacts.para35c.jahr3Pct,
    foerderFacts.para35c.maxInvestJeWe,
    foerderFacts.para35c.maxAbschreibungGesamt,
    foerderFacts.para35c.maxJahr1und2,
    foerderFacts.para35c.maxJahr3,
    foerderFacts.para35c.gebaeudeMinAlterJahre,
    foerderFacts.para35c.energieberatungAbsetzbarPctJahr1,
  ]

  const set = new Set<string>()
  for (const n of values) {
    set.add(String(n))
    // deutsche Tausender-Schreibweise
    if (n >= 1000) {
      set.add(n.toLocaleString('de-DE'))
    }
  }
  return set
}
