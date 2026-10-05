import { NextResponse } from 'next/server'
import type { CheckErgebnis } from '@/lib/check'
import { einschaetzen } from '@/lib/ki'
import { analyze } from '@/lib/marketing-check/analyzer'
import { clientIp, zuOft } from '@/lib/ratelimit'
import { checkSchema } from '@/lib/schemas'

export const runtime = 'nodejs'
export const maxDuration = 60

// Der Check ruft fremde Server ab und kann die KI aufrufen. Deshalb ein enges Limit pro IP.
const MAX = 6
const FENSTER = 10 * 60_000

export async function POST(req: Request) {
  if (zuOft(`check:${clientIp(req)}`, MAX, FENSTER)) return NextResponse.json({ ok: false, grund: 'zu_oft' }, { status: 429 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, grund: 'ungueltig' }, { status: 400 })
  }
  const parsed = checkSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok: false, grund: 'ungueltig' }, { status: 400 })

  // Inhalte werden nie geloggt, nur Statuscodes.
  try {
    const roh = await analyze(parsed.data)
    const einschaetzung = await einschaetzen(roh)
    const ergebnis: CheckErgebnis = {
      company: roh.company,
      city: roh.city,
      industryLabel: roh.industryLabel,
      url: roh.url,
      score: roh.score,
      categories: roh.categories,
      einschaetzung,
    }
    console.log('check ok', einschaetzung ? 'mit ki' : 'ohne ki')
    return NextResponse.json({ ok: true, ergebnis }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    // Die Engine wirft verständliche Meldungen («Die Website konnte nicht geladen werden …»), die der Besucher beheben kann.
    const meldung = e instanceof Error && e.message.length < 200 ? e.message : null
    console.log('check fehler', meldung ? 'engine' : 'unbekannt')
    if (meldung) return NextResponse.json({ ok: false, grund: 'analyse', meldung }, { status: 422 })
    return NextResponse.json({ ok: false, grund: 'analyse' }, { status: 502 })
  }
}
