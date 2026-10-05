// Erzeugt Favicon, Apple-Icon und ein PNG der Bildmarke aus public/images/brand/alperna-mark.webp.
// Aufruf: node scripts/make-icons.mjs
import sharp from 'sharp'

const NAVY = '#111A28'
const marke = 'public/images/brand/alperna-mark.webp'

async function kachel(groesse, ziel, { rund }) {
  const innen = Math.round(groesse * 0.64)
  const m = await sharp(marke).resize(innen, innen, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  const radius = rund ? Math.round(groesse * 0.22) : 0
  const maske = Buffer.from(`<svg width="${groesse}" height="${groesse}"><rect width="${groesse}" height="${groesse}" rx="${radius}" fill="${NAVY}"/></svg>`)
  await sharp(maske).composite([{ input: m, gravity: 'center' }]).png().toFile(ziel)
  console.log(ziel)
}

await kachel(512, 'app/icon.png', { rund: true })
await kachel(180, 'app/apple-icon.png', { rund: false })
await sharp(marke).resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile('public/images/brand/alperna-mark.png')
console.log('public/images/brand/alperna-mark.png')
