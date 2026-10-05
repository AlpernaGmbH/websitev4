import { NextResponse } from 'next/server'
import { clientIp, zuOft } from '@/lib/ratelimit'
import { kontaktSchema } from '@/lib/schemas'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  if (zuOft(`kontakt:${clientIp(req)}`, 5, 10 * 60_000)) return NextResponse.json({ ok: false }, { status: 429 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  // Honigtopf gefüllt: so tun, als wäre alles gut, und nichts senden.
  if (typeof body === 'object' && body && typeof (body as Record<string, unknown>).website === 'string' && (body as Record<string, string>).website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }
  const parsed = kontaktSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 })

  const url = process.env.N8N_WEBHOOK_URL
  if (!url) return NextResponse.json({ ok: false, grund: 'nicht_konfiguriert' }, { status: 503 })

  const d = parsed.data
  const nachricht = d.telefon ? `${d.nachricht}\n\nRückruf erwünscht: ${d.telefon}` : d.nachricht
  // Inhalte werden nie geloggt, nur Statuscodes.
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: d.name, firma: d.firma, email: d.email, themen: [], nachricht, quelle: 'alperna.ch', zeit: new Date().toISOString() }),
    })
    console.log('kontakt n8n', res.status)
    return res.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false }, { status: 502 })
  } catch {
    console.log('kontakt n8n fehler')
    return NextResponse.json({ ok: false }, { status: 502 })
  }
}
