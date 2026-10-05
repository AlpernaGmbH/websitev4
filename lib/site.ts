// Eine Quelle für alle Fakten der Website. Kein Seitentext wiederholt diese Zahlen von Hand.
// Stand 04.10.2026, vom Team bestätigt. Die bisherige Framer-Seite widersprach sich selbst
// (28 oder 21 Partner, 3 oder 6 Jahre). Hier gilt nur dieser Stand.

export const site = {
  name: 'Alperna',
  legalName: 'Alperna GmbH',
  url: 'https://www.alperna.ch',
  email: 'kontakt@alperna.ch',

  address: {
    street: 'Röhrenbrugg 7',
    zip: '9042',
    city: 'Speicher',
    canton: 'AR',
    country: 'Schweiz',
  },
  uid: 'CHE-132.724.195',

  seitJahren: 3,
  partnerAnzahl: 28,
  beitraegeErstellt: 25000,
  studium: 'BWL in St. Gallen',
  erreichbarkeitTageProJahr: 365,
  antwortZeit: 'innert zwei Arbeitstagen',

  preise: {
    websiteAb: 1000,
    websiteMitShooting: 2000,
    einzelbeitrag: 180,
  },

  calendlyUrl: 'https://calendly.com/alperna/erstkontakt',
  // WhatsApp Business, internationales Format ohne Plus. Nur Nachrichten, keine Anrufe.
  whatsapp: '41798513631',
  whatsappText: 'Hallo, ich habe eure Website gesehen und möchte mehr erfahren.',

  social: {
    instagram: 'https://www.instagram.com/alperna_gmbh',
    linkedin: 'https://www.linkedin.com/company/alperna/',
    tiktok: 'https://www.tiktok.com/@alperna_gmbh',
  },

  team: {
    andrej: {
      name: 'Andrej Good',
      linkedin: 'https://www.linkedin.com/in/andrej-good',
      instagram: 'https://www.instagram.com/andrej.alperna',
    },
    leander: {
      name: 'Leander Züst',
      linkedin: 'https://www.linkedin.com/in/leander-z%C3%BCst-3a077b271',
      instagram: 'https://www.instagram.com/leanderzuest',
    },
  },
} as const

export const jahreText = ['null', 'ein', 'zwei', 'drei', 'vier', 'fünf'][site.seitJahren]
export const indexierbar = process.env.NEXT_PUBLIC_INDEXABLE === '1'
