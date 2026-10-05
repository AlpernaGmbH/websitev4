import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const alt = 'Alperna: Partner für den digitalen Auftritt'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const marke = `data:image/png;base64,${readFileSync(join(process.cwd(), 'public/images/brand/alperna-mark.png')).toString('base64')}`

export default function OpengraphBild() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#111A28', color: '#FDFBFB', padding: 72 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={marke} width={64} height={64} alt="" />
          <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>Alperna</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 76, lineHeight: 1.08, maxWidth: 980 }}>Wir sorgen dafür, dass dich Kunden online finden.</div>
          <div style={{ fontSize: 30, color: 'rgba(253,251,251,0.78)' }}>{`Website, Google-Profil und Social Media · ${site.address.city} ${site.address.canton}`}</div>
        </div>
      </div>
    ),
    size,
  )
}
