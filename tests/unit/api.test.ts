import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/marketing-check/analyzer', () => ({ analyze: vi.fn() }))
vi.mock('@/lib/ki', () => ({ einschaetzen: vi.fn() }))

import { POST as postCheck } from '@/app/api/check/route'
import { POST as postKontakt } from '@/app/api/kontakt/route'
import { POST as postLead } from '@/app/api/lead/route'
import { analyze } from '@/lib/marketing-check/analyzer'
import { einschaetzen } from '@/lib/ki'

const post = (handler: (r: Request) => Promise<Response>, body: unknown, ip = '10.0.0.1') =>
  handler(
    new Request('http://localhost/api', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify(body),
    }),
  )

const analyseErgebnis = {
  checkedAt: '2026-10-05T12:00:00.000Z',
  company: 'Muster AG',
  city: 'Herisau',
  industry: 'craft',
  industryLabel: 'Handwerk, Bau, Garten',
  url: 'https://www.muster.ch/',
  score: 62,
  categories: [{ id: 'seo', title: 'Website & SEO', weight: 25, score: 0.8, items: [] }],
  snapshot: { title: 'Muster', description: '', headings: [], lang: 'de', excerpt: 'Geheimer Textauszug', hasOgImage: true, hasTelLink: false, hasMailLink: true, hasImpressum: true },
  facts: { intern: true },
}

const einschaetzung = { zusammenfassung: 'Klar aufgebaut.', staerken: [], luecken: [], schritte: [] }

const checkBody = { company: 'Muster AG', city: 'Herisau', industry: 'craft', website: 'www.muster.ch' }

beforeEach(() => {
  vi.mocked(analyze).mockReset()
  vi.mocked(einschaetzen).mockReset()
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('POST /api/check', () => {
  it('weist eine ungültige Website ab', async () => {
    const res = await post(postCheck, { ...checkBody, website: 'localhost' }, '10.1.0.1')
    expect(res.status).toBe(400)
    expect(analyze).not.toHaveBeenCalled()
  })

  it('weist fehlende Pflichtfelder ab', async () => {
    const res = await post(postCheck, { company: 'Muster AG', website: 'muster.ch' }, '10.1.0.2')
    expect(res.status).toBe(400)
  })

  it('ergänzt https:// und liefert Ergebnis mit KI-Einschätzung, ohne interne Felder', async () => {
    vi.mocked(analyze).mockResolvedValue(analyseErgebnis as never)
    vi.mocked(einschaetzen).mockResolvedValue(einschaetzung)
    const res = await post(postCheck, checkBody, '10.1.0.3')
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.ok).toBe(true)
    expect(json.ergebnis.score).toBe(62)
    expect(json.ergebnis.einschaetzung).toEqual(einschaetzung)
    expect(JSON.stringify(json)).not.toContain('Geheimer Textauszug')
    expect(json.ergebnis).not.toHaveProperty('facts')
    expect(analyze).toHaveBeenCalledWith(expect.objectContaining({ website: 'https://www.muster.ch' }))
  })

  it('liefert das Ergebnis ohne Einschätzung, wenn die KI nichts liefert', async () => {
    vi.mocked(analyze).mockResolvedValue(analyseErgebnis as never)
    vi.mocked(einschaetzen).mockResolvedValue(null)
    const json = await (await post(postCheck, checkBody, '10.1.0.4')).json()
    expect(json.ok).toBe(true)
    expect(json.ergebnis.einschaetzung).toBeNull()
  })

  it('gibt die verständliche Meldung der Engine weiter', async () => {
    vi.mocked(analyze).mockRejectedValue(new Error('Die Website konnte nicht geladen werden. Stimmt die Adresse?'))
    const res = await post(postCheck, checkBody, '10.1.0.5')
    const json = await res.json()
    expect(res.status).toBe(422)
    expect(json).toEqual({ ok: false, grund: 'analyse', meldung: 'Die Website konnte nicht geladen werden. Stimmt die Adresse?' })
  })

  it('sperrt nach sechs Anfragen derselben IP', async () => {
    vi.mocked(analyze).mockResolvedValue(analyseErgebnis as never)
    vi.mocked(einschaetzen).mockResolvedValue(null)
    for (let i = 0; i < 6; i++) expect((await post(postCheck, checkBody, '10.1.0.6')).status).toBe(200)
    const res = await post(postCheck, checkBody, '10.1.0.6')
    expect(res.status).toBe(429)
    expect((await res.json()).grund).toBe('zu_oft')
  })
})

describe('POST /api/lead', () => {
  const lead = {
    email: 'inhaber@muster.ch',
    einwilligung: true,
    company: 'Muster AG',
    website: 'www.muster.ch',
    branche: 'Handwerk',
    ort: 'Herisau',
    status: 'ergebnis',
    score: 62,
    befunde: ['Google-Profil nicht bestätigt'],
  }

  it('verlangt die Einwilligung', async () => {
    vi.stubEnv('N8N_WEBHOOK_URL', 'https://n8n.example/webhook/x')
    const res = await post(postLead, { ...lead, einwilligung: false }, '10.2.0.1')
    expect(res.status).toBe(400)
  })

  it('verlangt eine gültige E-Mail-Adresse', async () => {
    vi.stubEnv('N8N_WEBHOOK_URL', 'https://n8n.example/webhook/x')
    const res = await post(postLead, { ...lead, email: 'kein-email' }, '10.2.0.2')
    expect(res.status).toBe(400)
  })

  it('antwortet mit 503, wenn kein Webhook eingerichtet ist', async () => {
    vi.stubEnv('N8N_WEBHOOK_URL', '')
    const res = await post(postLead, lead, '10.2.0.3')
    expect(res.status).toBe(503)
  })

  it('leitet den Lead genau einmal an n8n weiter', async () => {
    vi.stubEnv('N8N_WEBHOOK_URL', 'https://n8n.example/webhook/x')
    const fetchMock = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const res = await post(postLead, lead, '10.2.0.4')
    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://n8n.example/webhook/x')
    const body = JSON.parse(init.body)
    expect(body).toMatchObject({ name: 'Marketing-Check', firma: 'Muster AG', email: 'inhaber@muster.ch', quelle: 'alperna.ch/marketing-check' })
    expect(body.themen).toEqual(['Marketing-Check'])
    expect(body.nachricht).toContain('62 von 100')
    expect(body.nachricht).toContain('Google-Profil nicht bestätigt')
  })

  it('vermerkt einen fehlgeschlagenen Check im Lead', async () => {
    vi.stubEnv('N8N_WEBHOOK_URL', 'https://n8n.example/webhook/x')
    const fetchMock = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    await post(postLead, { ...lead, status: 'fehler', score: undefined, befunde: [] }, '10.2.0.5')
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).nachricht).toMatch(/fehlgeschlagen/i)
  })

  it('antwortet mit 502, wenn n8n nicht annimmt', async () => {
    vi.stubEnv('N8N_WEBHOOK_URL', 'https://n8n.example/webhook/x')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('fehler', { status: 500 })))
    const res = await post(postLead, lead, '10.2.0.6')
    expect(res.status).toBe(502)
  })
})

describe('POST /api/kontakt', () => {
  const kontakt = { name: 'Hans Muster', firma: 'Muster AG', email: 'hans@muster.ch', telefon: '079 123 45 67', nachricht: 'Wir brauchen eine neue Website.', website: '', einwilligung: true }

  it('tut bei gefülltem Honigtopf so, als wäre alles gut, und sendet nichts', async () => {
    vi.stubEnv('N8N_WEBHOOK_URL', 'https://n8n.example/webhook/x')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const res = await post(postKontakt, { ...kontakt, website: 'https://spam.example' }, '10.3.0.1')
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('weist eine ungültige E-Mail-Adresse ab', async () => {
    vi.stubEnv('N8N_WEBHOOK_URL', 'https://n8n.example/webhook/x')
    const res = await post(postKontakt, { ...kontakt, email: 'nope' }, '10.3.0.2')
    expect(res.status).toBe(400)
  })

  it('antwortet mit 503 ohne Webhook', async () => {
    vi.stubEnv('N8N_WEBHOOK_URL', '')
    const res = await post(postKontakt, kontakt, '10.3.0.3')
    expect(res.status).toBe(503)
  })

  it('leitet die Anfrage mit Rückrufnummer an n8n weiter', async () => {
    vi.stubEnv('N8N_WEBHOOK_URL', 'https://n8n.example/webhook/x')
    const fetchMock = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const res = await post(postKontakt, kontakt, '10.3.0.4')
    expect(res.status).toBe(200)
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body).toMatchObject({ name: 'Hans Muster', firma: 'Muster AG', email: 'hans@muster.ch', quelle: 'alperna.ch' })
    expect(body.nachricht).toContain('Wir brauchen eine neue Website.')
    expect(body.nachricht).toContain('Rückruf erwünscht: 079 123 45 67')
  })
})
