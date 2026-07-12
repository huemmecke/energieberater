export const brand = {
  name: 'die energieweiser',
  tagline: 'Energieberatung, die wirkt!',
  slogan: 'Hände für die Wende',
  claim: {
    line1: { bold: 'Energieberatung mit Sinn', regular: 'für das Ganze' },
    line2: { bold: 'und Verstand', regular: 'für das Detail' },
  },
  hero: 'Wie können wir unser Schätzchen fit machen für die Zukunft?',
  sectionLead: 'Mit einer Energieberatung, die wirkt',
  description:
    'Ingenieurbüro für Beratung, Planung und Realisierung von Energielösungen aus erneuerbaren Energien.',
  contact: {
    email: 'kontakt@energieweiser.de',
    location: 'Soest, NRW',
    person: 'Carsten Neubauer',
    title: 'dena-zertifizierter Energie-Effizienz-Experte',
  },
} as const

export const colors = {
  navy: '#1c2f76',
  navyDark: '#15245d',
  navyLight: '#2a4494',
  white: '#ffffff',
  offWhite: '#fafbfc',
  text: '#1c2f76',
  textMuted: '#4a5568',
  stripeBlue: '#4575b4',
  stripeRed: '#a50026',
} as const

export const typography = {
  fontFamily: "'BioRhyme', Georgia, serif",
  weights: {
    extraLight: 200,
    light: 300,
    regular: 400,
    bold: 700,
    extraBold: 800,
  },
} as const
