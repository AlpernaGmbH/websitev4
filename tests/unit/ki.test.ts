import { describe, expect, it, vi } from 'vitest'
import { buildFakten, einschaetzen, pruefeEinschaetzung } from '@/lib/ki'
import type { AnalyseErgebnis } from '@/lib/marketing-check/analyzer'

const basis: AnalyseErgebnis = {
  checkedAt: '2026-10-05T12:00:00.000Z',
  company: 'Muster Schreinerei AG',
  city: 'Herisau',
  industry: 'craft',
  industryLabel: 'Handwerk, Bau, Garten',
  url: 'https://www.muster-schreinerei.ch/',
  score: 41,
  categories: [
    {
      id: 'seo',
      title: 'Website & SEO',
      weight: 25,
      score: 0.6,
      items: [
        { ok: true, label: 'Seitentitel', detail: 'Vorhanden' },
        { ok: false, label: 'Meta-Beschreibung', detail: 'Fehlt' },
      ],
    },
    {
      id: 'gbp',
      title: 'Google-Business-Profil',
      weight: 20,
      score: 0.25,
      items: [{ ok: false, label: 'Google-Business-Profil', detail: 'Konnte nicht bestätigt werden' }],
    },
  ],
  snapshot: {
    title: 'Schreinerei Muster | Möbel nach Mass',
    description: 'Möbel und Küchen aus Herisau.',
    headings: ['Möbel nach Mass', 'Unsere Küchen', 'Kontakt'],
    lang: 'de-CH',
    excerpt: 'Wir fertigen Möbel und Küchen seit 1987.',
    hasOgImage: false,
    hasTelLink: true,
    hasMailLink: true,
    hasImpressum: true,
  },
  facts: {},
}

const gut = {
  zusammenfassung: 'Die Website sagt klar, was ihr herstellt. Das Google-Profil ist die grösste Lücke.',
  staerken: ['Der Seitentitel nennt Handwerk und Ort.'],
  luecken: ['Auf der Startseite fehlt ein Hinweis, wie du Anfragen stellen kannst.', 'Das Google-Profil liess sich nicht bestätigen.'],
  schritte: [
    { titel: 'Google-Profil prüfen', text: 'Such deinen Betrieb bei Google Maps und ergänze Öffnungszeiten und Fotos.' },
    { titel: 'Meta-Beschreibung ergänzen', text: 'Schreib zwei Sätze, die in der Suche unter dem Titel erscheinen.' },
  ],
}

describe('pruefeEinschaetzung', () => {
  it('akzeptiert eine saubere Antwort', () => {
    const r = pruefeEinschaetzung(gut)
    expect(r?.schritte).toHaveLength(2)
    expect(r?.zusammenfassung).toContain('Google-Profil')
  })

  it('schreibt ß als ss', () => {
    const r = pruefeEinschaetzung({ ...gut, zusammenfassung: 'Die Seite ist sehr groß und klar aufgebaut.' })
    expect(r?.zusammenfassung).toContain('gross')
    expect(r?.zusammenfassung).not.toContain('ß')
  })

  it.each([
    ['Ausrufezeichen', { ...gut, zusammenfassung: 'Das sieht gut aus!' }],
    ['Link', { ...gut, luecken: ['Mehr dazu auf https://example.com lesen.'] }],
    ['Webadresse ohne Schema', { ...gut, luecken: ['Siehe www.example.com für Details.'] }],
    ['E-Mail-Adresse', { ...gut, luecken: ['Schreib an info@example.com bitte.'] }],
    ['Gedankenstrich', { ...gut, zusammenfassung: 'Die Seite ist klar – aber leer.' }],
    ['verbotenes Wort', { ...gut, zusammenfassung: 'Ein ganzheitlicher Auftritt fehlt noch.' }],
    ['Emoji', { ...gut, staerken: ['Starkes Logo 👍'] }],
    ['leere Zusammenfassung', { ...gut, zusammenfassung: '   ' }],
    ['mehr als drei Schritte', { ...gut, schritte: [1, 2, 3, 4].map((n) => ({ titel: `Schritt ${n}`, text: 'Ein kurzer Satz dazu.' })) }],
    ['mehr als zwei Stärken', { ...gut, staerken: ['a eins', 'b zwei', 'c drei'] }],
    ['zu langer Text', { ...gut, zusammenfassung: 'x'.repeat(700) }],
  ])('verwirft: %s', (_name, roh) => {
    expect(pruefeEinschaetzung(roh)).toBeNull()
  })

  it('verwirft Müll', () => {
    expect(pruefeEinschaetzung(null)).toBeNull()
    expect(pruefeEinschaetzung('text')).toBeNull()
    expect(pruefeEinschaetzung({})).toBeNull()
  })
})

describe('buildFakten', () => {
  it('kürzt den Betriebsnamen und nennt nur den Hostnamen der Website', () => {
    const f = buildFakten({ ...basis, company: 'A'.repeat(200) })
    expect(f.betrieb).toHaveLength(80)
    expect(f.website).toBe('muster-schreinerei.ch')
  })

  it('führt nur offene Punkte auf und übernimmt den Schnappschuss', () => {
    const f = buildFakten(basis)
    const seo = f.bereiche.find((b) => b.id === 'seo')
    expect(seo?.offen.map((o) => o.punkt)).toEqual(['Meta-Beschreibung'])
    expect(f.startseite.titel).toBe('Schreinerei Muster | Möbel nach Mass')
    expect(f.startseite.ueberschriften).toContain('Unsere Küchen')
    expect(f.startseite.signale).toEqual({ ogBild: false, telefon: true, mail: true, impressum: true })
  })
})

describe('einschaetzen', () => {
  const mitZugang = { AI_GATEWAY_API_KEY: 'test' }

  it('liefert null ohne KI-Zugang und ruft die KI nicht auf', async () => {
    const generate = vi.fn()
    expect(await einschaetzen(basis, { env: {}, generate })).toBeNull()
    expect(generate).not.toHaveBeenCalled()
  })

  it('liefert die geprüfte Einschätzung', async () => {
    const generate = vi.fn().mockResolvedValue(gut)
    const r = await einschaetzen(basis, { env: mitZugang, generate })
    expect(r?.schritte[0].titel).toBe('Google-Profil prüfen')
    expect(generate).toHaveBeenCalledTimes(1)
    const arg = generate.mock.calls[0][0]
    expect(arg.system).toMatch(/Du-Form/)
    expect(arg.prompt).toContain('Möbel nach Mass')
  })

  it('liefert null, wenn die KI fehlschlägt, und wirft nie', async () => {
    const generate = vi.fn().mockRejectedValue(new Error('boom'))
    await expect(einschaetzen(basis, { env: mitZugang, generate })).resolves.toBeNull()
  })

  it('liefert null, wenn die Antwort die Prüfung nicht besteht', async () => {
    const generate = vi.fn().mockResolvedValue({ ...gut, zusammenfassung: 'Super Ergebnis!' })
    expect(await einschaetzen(basis, { env: mitZugang, generate })).toBeNull()
  })

  it('hält das Tageslimit ein', async () => {
    const generate = vi.fn().mockResolvedValue(gut)
    const env = { ...mitZugang, KI_TAGESLIMIT: '2' }
    const tag = Date.UTC(2031, 0, 5, 10)
    expect(await einschaetzen(basis, { env, generate, jetzt: tag })).not.toBeNull()
    expect(await einschaetzen(basis, { env, generate, jetzt: tag + 1000 })).not.toBeNull()
    expect(await einschaetzen(basis, { env, generate, jetzt: tag + 2000 })).toBeNull()
    // am nächsten Tag geht es wieder
    expect(await einschaetzen(basis, { env, generate, jetzt: tag + 86_400_000 })).not.toBeNull()
  })
})
