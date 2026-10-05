// Holt die Team- und Kulissenfotos von alperna.ch und erzeugt die WebP-Dateien im Repo.
// Aufruf: node scripts/prepare-images.mjs
// Logos und Projektbilder stammen aus dem Vorläufer (AlpernaGmbH/websitev2) und liegen schon als WebP in public/images.
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const FRAMER = 'https://framerusercontent.com/images/'

// 4:5 Hochformat für die Gründer. `position` bestimmt den Ausschnitt.
const aufgaben = [
  { quelle: 'iwaqIdZLeZXZJMqidnD3bSMSHY.jpg', ziel: 'public/images/team/andrej.webp', breite: 880, hoehe: 1100, position: 'attention' },
  { quelle: 'hWvlDZcWO7blpdESrjYFvjl9mIM.png', ziel: 'public/images/team/leander.webp', breite: 880, hoehe: 1100, position: 'north' },
  { quelle: '8ontrkfaX26syra9ZCqUkEr5yOg.jpg', ziel: 'public/images/kulissen/interview.webp', breite: 1200, hoehe: 800, position: 'centre' },
  { quelle: 'Ir6lIEDvsHIkBNTLv1hafkwoI.jpg', ziel: 'public/images/kulissen/kamera.webp', breite: 1200, hoehe: 800, position: 'centre' },
  { quelle: 'GhsMxGp6HdTqtd9r0Nlx8AriKI.jpg', ziel: 'public/images/kulissen/schnitt.webp', breite: 1200, hoehe: 800, position: 'centre' },
  { quelle: '9WFbIcevBo0G7RV4XgvGLlfpUxU.jpg', ziel: 'public/images/kulissen/licht.webp', breite: 1200, hoehe: 800, position: 'centre' },
]

for (const a of aufgaben) {
  const res = await fetch(FRAMER + a.quelle)
  if (!res.ok) throw new Error(`${a.quelle}: HTTP ${res.status}`)
  const roh = Buffer.from(await res.arrayBuffer())
  const out = await sharp(roh).resize(a.breite, a.hoehe, { fit: 'cover', position: a.position }).webp({ quality: 82 }).toBuffer()
  await mkdir(dirname(a.ziel), { recursive: true })
  await writeFile(a.ziel, out)
  console.log(`${a.ziel}  ${Math.round(out.length / 1024)} kB`)
}
