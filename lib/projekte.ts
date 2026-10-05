// Referenzen. Fakten und Zahlen von www.alperna.ch (Projektseiten, gelesen am 04.10.2026),
// Ausgangslage und Umsetzung in eigenen Worten (aus dem Vorläufer AlpernaGmbH/websitev2).
// Zitate stehen wörtlich in data/testimonials.json. Pfade gelten ab public/.
import testimonials from '@/data/testimonials.json'

export type Kennzahl = { wert: string; label: string }

export type Fall = {
  slug: string
  name: string
  art: string
  zeitraum: string
  kennzahlen: Kennzahl[]
  leistungen: string[]
  ausgangslage: string
  umsetzung: string
  /** Hauptbild des Falls. Ohne Bild zeigt die Karte das Logo auf ruhiger Fläche. */
  bild?: string
  bildAlt?: string
  logo: string
}

const logo = (slug: string) => `/images/logos/${slug}.webp`

export const faelle: Fall[] = [
  {
    slug: 'bc-trogen-speicher',
    name: 'BC Trogen Speicher',
    art: 'Sportverein (Badminton)',
    zeitraum: '3 Monate',
    kennzahlen: [
      { wert: '+690 %', label: 'Instagram-Aufrufe' },
      { wert: '74’300', label: 'Aufrufe' },
      { wert: '21', label: 'erstellte Beiträge' },
    ],
    leistungen: ['Analyse und Ziele', 'Dreh vor Ort', 'Beiträge und Posting'],
    ausgangslage: 'Der Verein lebt, aber wer nicht in der Halle stand, sah nichts davon. Turniere und Trainings blieben unter den Mitgliedern.',
    umsetzung: 'Wir haben an den Turnieren gefilmt, aus dem Material 21 Beiträge geschnitten und das Posting komplett übernommen.',
    bild: '/images/projekte/bc-trogen-speicher.webp',
    bildAlt: 'Instagram-Profil des BC Trogen Speicher mit Aufnahmen aus der Halle',
    logo: logo('bc-trogen-speicher'),
  },
  {
    slug: 'regina-massagen',
    name: 'Regina Massagen',
    art: 'Massagepraxis',
    zeitraum: 'Laufende Zusammenarbeit',
    kennzahlen: [
      { wert: '500+', label: 'Bilder produziert' },
      { wert: '20', label: 'Video-Assets' },
      { wert: 'rund 12', label: 'Kontakt-Klicks in den ersten sechs Wochen' },
    ],
    leistungen: ['Website', 'Shooting', 'Instagram-Profil', 'Google-Profil'],
    ausgangslage: 'Die Praxis arbeitet gut, neue Kundinnen kamen aber fast nur über Empfehlungen. Online fehlten eine Website und gutes Bildmaterial.',
    umsetzung: 'Wir haben die Website gebaut, die Praxis fotografiert, Instagram eingerichtet und das Google-Profil angelegt. Mit dem Material veröffentlicht Regina heute selbst.',
    bild: '/images/projekte/regina-massagen.webp',
    bildAlt: 'Regina bei der Arbeit in ihrer Massagepraxis',
    logo: logo('regina-massagen'),
  },
  {
    slug: 'alex-breitenmoser',
    name: 'Alex Breitenmoser',
    art: 'Vertriebs-Coaching',
    zeitraum: 'Laufende Zusammenarbeit',
    kennzahlen: [
      { wert: '519’000', label: 'Aufrufe insgesamt' },
      { wert: '303’000', label: 'Aufrufe beim besten Video' },
      { wert: '+500', label: 'neue Follower' },
    ],
    leistungen: ['Positionierung', 'Website', 'Portraits und Videos', 'Social Media'],
    ausgangslage: 'Alex ist Praktiker im Vertrieb. Sein Auftritt zeigte das nicht: kein roter Faden, keine Website, keine klare Positionierung.',
    umsetzung: 'Wir haben ihn als praktizierenden Verkäufer positioniert und Website, Portraits und Videos gemacht. Instagram und YouTube betreuen wir laufend.',
    bild: '/images/projekte/alex-breitenmoser.webp',
    bildAlt: 'Auswahl der Instagram-Videos von Alex Breitenmoser mit Aufrufzahlen',
    logo: logo('alex-breitenmoser'),
  },
  {
    slug: 'gewerbeverband-ar',
    name: 'Gewerbeverband AR',
    art: 'Wirtschaftsverband',
    zeitraum: 'Einzelprojekt',
    kennzahlen: [
      { wert: '1', label: 'Recap-Video' },
      { wert: '40', label: 'Portraits' },
    ],
    leistungen: ['Eventfilm', 'Recap-Video', 'Portraits'],
    ausgangslage: 'Von der Sommerkonferenz gab es weder Videomaterial noch Bilder, weder für den Verband noch für die Referenten.',
    umsetzung: 'Wir haben den Abend gefilmt und wenige Tage danach das Recap-Video geliefert. An einem eigenen Stand sind 40 Portraits entstanden.',
    logo: logo('gewerbeverband-ar'),
  },
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
