// Referenzen. Fakten und Zahlen von www.alperna.ch (Projektseiten, gelesen am 04.10.2026) und aus den Kundenunterlagen.
// Zitate stehen wörtlich in data/testimonials.json. Bildpfade gelten ab public/.
import testimonials from '@/data/testimonials.json'

export type Kennzahl = { wert: string; label: string }

export type Fall = {
  slug: string
  name: string
  art: string
  ort: string
  zeitraum: string
  kennzahlen: Kennzahl[]
  ausgangslage: string
  umsetzung: string
  /** Hauptbild. Ohne Bild zeigt die Karte das Logo auf ruhiger Fläche. */
  bild?: string
  bildAlt?: string
  logo: string
}

const logo = (slug: string) => `/images/logos/${slug}.webp`

export const faelle: Fall[] = [
  {
    slug: 'bc-trogen-speicher',
    name: 'BC Trogen Speicher',
    art: 'Badmintonclub',
    ort: 'Trogen',
    zeitraum: '3 Monate',
    kennzahlen: [
      { wert: '+690 %', label: 'Instagram-Aufrufe' },
      { wert: '74’300', label: 'Aufrufe' },
      { wert: '21', label: 'erstellte Beiträge' },
    ],
    ausgangslage: 'Turniere und Training sah nur, wer in der Halle stand.',
    umsetzung: 'Wir haben vor Ort gefilmt, 21 Beiträge geschnitten und das Posting übernommen.',
    bild: '/images/projekte/bc-trogen-speicher.webp',
    bildAlt: 'Instagram-Profil des BC Trogen Speicher mit Aufnahmen aus der Halle',
    logo: logo('bc-trogen-speicher'),
  },
  {
    slug: 'regina-massagen',
    name: 'Regina Massagen',
    art: 'Massagepraxis',
    ort: 'Haslen AI',
    zeitraum: 'Laufende Zusammenarbeit',
    kennzahlen: [
      { wert: '500+', label: 'Bilder produziert' },
      { wert: '20', label: 'Video-Assets' },
      { wert: 'rund 12', label: 'Kontakt-Klicks in den ersten sechs Wochen' },
    ],
    ausgangslage: 'Neue Kundinnen kamen fast nur über Empfehlungen.',
    umsetzung: 'Wir haben die Website gebaut, die Praxis fotografiert und Instagram sowie das Google-Profil eingerichtet.',
    bild: '/images/projekte/regina-massagen.webp',
    bildAlt: 'Regina bei der Arbeit in ihrer Massagepraxis',
    logo: logo('regina-massagen'),
  },
  {
    slug: 'alex-breitenmoser',
    name: 'Alex Breitenmoser',
    art: 'Vertriebs-Coaching',
    ort: '',
    zeitraum: 'Laufende Zusammenarbeit',
    kennzahlen: [
      { wert: '519’000', label: 'Aufrufe insgesamt' },
      { wert: '303’000', label: 'Aufrufe beim besten Video' },
      { wert: '+500', label: 'neue Follower' },
    ],
    ausgangslage: 'Ein Praktiker im Vertrieb, aber ohne klare Positionierung und ohne Website.',
    umsetzung: 'Wir haben ihn positioniert, Website, Portraits und Videos gemacht und betreuen Instagram und YouTube laufend.',
    bild: '/images/projekte/alex-breitenmoser.webp',
    bildAlt: 'Auswahl der Instagram-Videos von Alex Breitenmoser mit Aufrufzahlen',
    logo: logo('alex-breitenmoser'),
  },
  {
    slug: 'gewerbeverband-ar',
    name: 'Gewerbeverband AR',
    art: 'Wirtschaftsverband',
    ort: 'Teufen',
    zeitraum: 'Einzelprojekt',
    kennzahlen: [
      { wert: '1', label: 'Recap-Video' },
      { wert: '40', label: 'Portraits' },
    ],
    ausgangslage: 'Von der Sommerkonferenz in Teufen gab es kein Bildmaterial.',
    umsetzung: 'Wir haben den Abend gefilmt, wenige Tage später das Recap-Video geliefert und 40 Portraits gemacht.',
    logo: logo('gewerbeverband-ar'),
  },
]

export type Weiterer = { name: string; ort: string; was?: string }

/** Weitere Betriebe aus der Region, die auch auf der Karte erscheinen */
export const weitere: Weiterer[] = [
  { name: 'Gustav Kahn', ort: 'Romanshorn', was: 'Restaurant, 3 Reels an einem Drehtag' },
  { name: 'Beyond Borders', ort: 'Ebenalp', was: '200 Fotos und 120 Videos' },
  { name: 'IFJ Startup Helper', ort: 'St. Gallen' },
  { name: 'Stiftung Wirtschaftsförderung AR', ort: 'Herisau' },
]

export type LogoEintrag = { name: string; logo: string }

/** Reihenfolge: zuerst die Region, dann die übrigen. */
export const logoLeiste: LogoEintrag[] = [
  { name: 'Gewerbeverband AR', logo: logo('gewerbeverband-ar') },
  { name: 'BC Trogen Speicher', logo: logo('bc-trogen-speicher') },
  { name: 'Appenzellerland Sport', logo: logo('appenzellerland-sport') },
  { name: 'Gustav Kahn', logo: logo('gustav-kahn') },
  { name: 'Regina Massagen', logo: logo('regina-massagen') },
  { name: 'LifeBoost', logo: logo('lifeboost') },
  { name: 'Alex Breitenmoser', logo: logo('alex-breitenmoser') },
  { name: 'Klartext von 2 Kanten', logo: logo('klartext-von-zwei-kanten') },
  { name: 'Nordcloud, an IBM Company', logo: logo('nordcloud') },
  { name: 'Brog3r', logo: logo('brog3r') },
  { name: 'I love Zero', logo: logo('i-love-zero') },
  { name: 'Pocket Properties App', logo: logo('pocket-properties-app') },
  { name: 'Whitetail Fever', logo: logo('whitetail-fever') },
  { name: 'Boostraft', logo: logo('boostraft') },
  { name: 'Nordlicht Wealth Management', logo: logo('nordlicht-wealth-management') },
]

export type Zitat = { projekt: string; firma: string; branche: string; text: string }

const AUSGEWAEHLT = ['bc-trogen-speicher', 'appenzellerland-sport', 'alex-breitenmoser']

export const zitate: Zitat[] = AUSGEWAEHLT.map((slug) => {
  const z = testimonials.zitate.find((x) => x.projekt === slug)
  if (!z) throw new Error(`Zitat fehlt: ${slug}`)
  return { projekt: z.projekt, firma: z.firma, branche: z.branche, text: z.text }
})
