// Fotografiert alle Abschnitte bei drei Breiten, dazu Popup und Ergebnis des Marketing-Checks (mit gemockter Analyse).
// Aufruf: node scripts/shots.mjs <Ausgabeordner>      (erst `npm run build`)
// Mit BASE=https://… gegen eine laufende Seite, sonst startet das Skript `next start` selbst.
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'

const out = process.argv[2] ?? 'shots'
const base = process.env.BASE ?? 'http://localhost:3100'
await mkdir(out, { recursive: true })

let server
if (!process.env.BASE) {
  server = spawn('npx', ['next', 'start', '-p', '3100'], { stdio: 'ignore' })
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) break
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
}

const ergebnis = {
  ok: true,
  ergebnis: {
    company: 'Muster Schreinerei AG',
    city: 'Herisau',
    industryLabel: 'Handwerk, Bau, Garten',
    url: 'https://muster.ch/',
    score: 41,
    categories: [
      { id: 'seo', title: 'Website & SEO', weight: 25, score: 0.6, items: [{ ok: true, label: 'Seitentitel', detail: 'Vorhanden' }, { ok: false, label: 'Meta-Beschreibung', detail: 'Fehlt' }] },
      { id: 'gbp', title: 'Google-Business-Profil', weight: 20, score: 0.25, items: [{ ok: false, label: 'Google-Business-Profil', detail: 'Konnte nicht bestätigt werden' }] },
      { id: 'social', title: 'Social Media', weight: 20, score: 0.44, selfReported: true, items: [{ ok: false, label: 'Instagram', detail: 'Nicht verlinkt' }] },
      { id: 'newsletter', title: 'Newsletter', weight: 9, score: 0, items: [{ ok: false, label: 'Newsletter-Anmeldung', detail: 'Keine Anmeldung gefunden' }] },
    ],
    einschaetzung: {
      zusammenfassung: 'Die Seite sagt klar, was ihr herstellt und wo. Die grösste Lücke ist, dass Besucher nicht sehen, wie sie eine Anfrage stellen können.',
      staerken: ['Der Seitentitel nennt Handwerk und Ort.'],
      luecken: ['Auf der Startseite fehlt ein Hinweis, wie du Anfragen stellen kannst.', 'Das Google-Profil liess sich nicht bestätigen.'],
      schritte: [
        { titel: 'Google-Profil prüfen', text: 'Such deinen Betrieb bei Google Maps und ergänze Öffnungszeiten und Fotos.' },
        { titel: 'Kontakt sichtbar machen', text: 'Setz Telefon oder Formular gut sichtbar in den oberen Teil der Startseite.' },
      ],
    },
  },
}

const abschnitte = ['.header', '.hero', '.belege', '#check', '#leistungen', '#ablauf', '#referenzen', '#ueber-uns', '#fragen', '#kontakt', '.footer']
const browser = await chromium.launch({ channel: 'chrome' })
try {
  for (const [name, w, h] of [['desktop', 1280, 900], ['tablet', 768, 1024], ['handy', 375, 812]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } })
    const page = await ctx.newPage()
    await page.route('**/calendly.com/**', (r) => r.abort())
    await page.route('**/api/check', async (r) => {
      await new Promise((x) => setTimeout(x, 400))
      await r.fulfill({ status: 200, json: ergebnis })
    })
    await page.route('**/api/lead', (r) => r.fulfill({ status: 200, json: { ok: true } }))
    await page.goto(base)
    // Alle Bilder sofort laden, sonst bleiben tiefer liegende Aufnahmen leer
    await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager')))
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 60))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForLoadState('networkidle')
    await page.waitForFunction(() => [...document.images].every((i) => i.complete))
    for (const sel of abschnitte) await page.locator(sel).first().screenshot({ path: `${out}/${name}-${sel.replace(/[^a-z]/g, '')}.png` })

    // Marketing-Check: Popup und Ergebnis
    await page.locator('#c-company').fill('Muster Schreinerei AG')
    await page.locator('#c-city').fill('Herisau')
    await page.locator('#c-industry').selectOption('craft')
    await page.locator('#c-website').fill('www.muster-schreinerei.ch')
    await page.getByRole('button', { name: /Check generieren/ }).click()
    await page.getByRole('dialog').waitFor()
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${out}/${name}-popup.png` })
    await page.locator('#c-email').fill('inhaber@muster.ch')
    await page.locator('#c-einwilligung').check()
    await page.getByRole('button', { name: /Ergebnis anzeigen/ }).click()
    await page.getByRole('heading', { name: 'Deine Online-Sichtbarkeit' }).waitFor()
    await page.waitForTimeout(900)
    await page.locator('#check').screenshot({ path: `${out}/${name}-ergebnis.png` })

    // Kalender-Dialog
    await page.goto(base)
    await page.locator('.hero').getByRole('link', { name: /Termin buchen/ }).click()
    await page.getByRole('dialog').waitFor()
    await page.screenshot({ path: `${out}/${name}-termin.png` })
    await ctx.close()
  }
} finally {
  await browser.close()
  server?.kill()
}
console.log('fertig:', out)
