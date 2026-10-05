// Betriebe, die auf der Karte im Hero erscheinen. Orte: Speicher ist die Mitte der Karte (lib/karte.json).
// Quellen der Orte: BC Trogen Speicher (Vereinsname), Gewerbeverband AR (Sommerkonferenz 2026 in Teufen), Gustav Kahn (Restaurant
// in Romanshorn), Beyond Borders (Anlass auf der Ebenalp), IFJ Startup Helper (St. Gallen), Stiftung Wirtschaftsförderung AR
// (Handelsregistersitz Herisau), Regina Massagen (Praxis in Haslen AI, öffentliches Therapeutenverzeichnis).
import karte from '@/lib/karte.json'

export type PunktName = 'Trogen' | 'Teufen' | 'Romanshorn' | 'St. Gallen' | 'Herisau' | 'Haslen' | 'Ebenalp'

type Punkt = { x: number; y: number; lon: number; lat: number }
const punkte = karte.punkte as unknown as Record<string, Punkt>

export type KartenProjekt = {
  id: string
  name: string
  /** Kürzere Fassung für die Liste */
  kurz?: string
  ort: string
  /** Wie die Gemeinde in lib/karte.json heisst */
  punkt: PunktName
  was?: string
  zahl?: string
  /** Wölbung der Linie von Speicher zum Betrieb */
  bogen: number
  km: number
  nr: number
  x: number
  y: number
}

export const heim = punkte.Speicher

/** Hochformatiger Ausschnitt der Karte für schmale Bildschirme (Einheiten der Karte, siehe lib/karte.json). */
export const MOBIL = { x: 230, y: 40, w: 520, h: 740 }

/** Luftlinie in Kilometern */
export function luftlinieKm(a: { lon: number; lat: number }, b: { lon: number; lat: number }): number {
  const r = Math.PI / 180
  const dLat = (b.lat - a.lat) * r
  const dLon = (b.lon - a.lon) * r
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

type Roh = Omit<KartenProjekt, 'km' | 'nr' | 'x' | 'y'>

const roh: Roh[] = [
  { id: 'bc-trogen-speicher', name: 'BC Trogen Speicher', ort: 'Trogen', punkt: 'Trogen', was: 'Instagram und Videos für den Badmintonclub', zahl: '+690 % Aufrufe in 3 Monaten', bogen: -0.3 },
  { id: 'ifj-startup-helper', name: 'IFJ Startup Helper', ort: 'St. Gallen', punkt: 'St. Gallen', bogen: 0.35 },
  { id: 'gewerbeverband-ar', name: 'Gewerbeverband AR', ort: 'Teufen', punkt: 'Teufen', was: 'Eventfilm, Recap-Video und Portraits der Sommerkonferenz', zahl: '1 Recap-Video, 40 Portraits', bogen: -0.2 },
  { id: 'regina-massagen', name: 'Regina Massagen', ort: 'Haslen AI', punkt: 'Haslen', was: 'Website, Shooting, Instagram und Google-Profil', zahl: '500+ Bilder produziert', bogen: 0.2 },
  { id: 'stiftung-wirtschaftsfoerderung-ar', name: 'Stiftung Wirtschaftsförderung AR', kurz: 'Wirtschaftsförderung AR', ort: 'Herisau', punkt: 'Herisau', bogen: 0.16 },
  { id: 'beyond-borders', name: 'Beyond Borders', ort: 'Ebenalp', punkt: 'Ebenalp', was: 'Fotos und Videos beim Anlass auf der Ebenalp', zahl: '200 Fotos, 120 Videos', bogen: -0.12 },
  { id: 'gustav-kahn', name: 'Gustav Kahn', ort: 'Romanshorn', punkt: 'Romanshorn', was: 'Reels für das Restaurant am Hafen', zahl: '3 Reels an einem Drehtag', bogen: 0.16 },
]

export const kartenProjekte: KartenProjekt[] = roh
  .map((p) => {
    const pt = punkte[p.punkt]
    return { ...p, km: luftlinieKm(heim, pt), x: pt.x, y: pt.y, nr: 0 }
  })
  .sort((a, b) => a.km - b.km)
  .map((p, i) => ({ ...p, nr: i + 1 }))
