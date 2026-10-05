import { NextResponse } from 'next/server'
import { clientIp, zuOft } from '@/lib/ratelimit'
import { leadSchema, type LeadEingabe } from '@/lib/schemas'

export const runtime = 'nodejs'

/** Text für den Eintrag im CRM und die Mail an Alperna. */
function nachricht(d: LeadEingabe): string {
  const ort = d.ort ? ` (${d.ort})` : ''
  const ergebnis =
    d.status === 'ergebnis'
      ? `${d.score ?? '?'} von 100. Befunde: ${d.befunde.join('; ') || 'keine'}`
      : d.status === 'fehler'
        ? 'Analyse fehlgeschlagen, Besucher hat die Adresse trotzdem angegeben'
        : 'Besucher hat die Seite vor dem Ergebnis verlassen'
  return [
    'Marketing-Check über alperna.ch',
    `Betrieb: ${d.company}${ort}, Branche: ${d.branche || '-'}`,
    `Website: ${d.website}`,
    `Ergebnis: ${ergebnis}`,
    d.einschaetzung ? `KI-Einschätzung: ${d.einschaetzung}` : '',
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 1900)
}

export async function POST(req: Request) {
  if (zuOft(`lead:${clientIp(req)}`, 10, 10 * 60_000)) return NextResponse.json({ ok: false }, { status: 429 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 })

  const url = process.env.N8N_WEBHOOK_URL
  if (!url) return NextResponse.json({ ok: false, grund: 'nicht_konfiguriert' }, { status: 503 })

  const d = parsed.data
  // Inhalte werden nie geloggt, nur Statuscodes.
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Marketing-Check',
        firma: d.company,
        email: d.email,
        themen: ['Marketing-Check'],
        nachricht: nachricht(d),
        quelle: 'alperna.ch/marketing-check',
        zeit: new Date().toISOString(),
      }),
    })
    console.log('lead n8n', res.status)
    return res.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false }, { status: 502 })
  } catch {
    console.log('lead n8n fehler')
    return NextResponse.json({ ok: false }, { status: 502 })
  }
}
