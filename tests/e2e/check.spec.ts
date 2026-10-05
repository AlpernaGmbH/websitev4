import { expect, test, type Page, type Route } from '@playwright/test'

const einschaetzung = {
  zusammenfassung: 'Die Seite sagt klar, was ihr anbietet. Das Google-Profil ist die grösste Lücke.',
  staerken: ['Der Titel nennt Handwerk und Ort.'],
  luecken: ['Auf der Startseite fehlt ein Hinweis, wie du Anfragen stellen kannst.'],
  schritte: [{ titel: 'Google-Profil prüfen', text: 'Such deinen Betrieb bei Google Maps und ergänze Öffnungszeiten.' }],
}

const ergebnis = (ki: typeof einschaetzung | null) => ({
  ok: true,
  ergebnis: {
    company: 'Muster AG',
    city: 'Herisau',
    industryLabel: 'Handwerk, Bau, Garten',
    url: 'https://muster.ch/',
    score: 62,
    categories: [
      { id: 'seo', title: 'Website & SEO', weight: 25, score: 0.8, items: [{ ok: true, label: 'Seitentitel', detail: 'Vorhanden' }, { ok: false, label: 'Meta-Beschreibung', detail: 'Fehlt' }] },
      { id: 'gbp', title: 'Google-Business-Profil', weight: 20, score: 0.25, items: [{ ok: false, label: 'Google-Business-Profil', detail: 'Nicht bestätigt' }] },
    ],
    einschaetzung: ki,
  },
})

type Aufruf = { check: unknown[]; lead: Record<string, unknown>[] }

/** Mockt die Routen. Der Check antwortet nach `verzoegerung` ms, so bleibt Zeit, die E-Mail einzugeben. */
async function mocken(page: Page, opts: { ki?: typeof einschaetzung | null; checkStatus?: number; checkBody?: unknown; verzoegerung?: number } = {}) {
  const aufrufe: Aufruf = { check: [], lead: [] }
  await page.route('**/calendly.com/**', (r) => r.abort())
  await page.route('**/api/check', async (route: Route) => {
    aufrufe.check.push(route.request().postDataJSON())
    await new Promise((r) => setTimeout(r, opts.verzoegerung ?? 0))
    const status = opts.checkStatus ?? 200
    await route.fulfill({ status, json: opts.checkBody ?? (status === 200 ? ergebnis(opts.ki === undefined ? einschaetzung : opts.ki) : { ok: false, grund: 'analyse' }) })
  })
  await page.route('**/api/lead', async (route: Route) => {
    aufrufe.lead.push(route.request().postDataJSON())
    await route.fulfill({ status: 200, json: { ok: true } })
  })
  return aufrufe
}

async function formularAusfuellen(page: Page) {
  await page.locator('#c-company').fill('Muster AG')
  await page.locator('#c-city').fill('Herisau')
  await page.locator('#c-industry').selectOption('craft')
  await page.locator('#c-website').fill('www.muster.ch')
}

const popup = (page: Page) => page.getByRole('dialog', { name: /Fast geschafft|Die Analyse hat nicht geklappt/ })
const generieren = (page: Page) => page.getByRole('button', { name: /Check generieren/ })

test.describe('Marketing-Check', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('#check').scrollIntoViewIfNeeded()
  })

  test('verlangt Pflichtfelder, ohne etwas zu senden', async ({ page }) => {
    const aufrufe = await mocken(page)
    await generieren(page).click()
    await expect(page.getByText('Bitte fülle die markierten Felder aus.')).toBeVisible()
    await expect(popup(page)).toBeHidden()
    expect(aufrufe.check).toHaveLength(0)
  })

  test('startet die Analyse sofort und öffnet das Popup', async ({ page }) => {
    const aufrufe = await mocken(page, { verzoegerung: 1500 })
    await formularAusfuellen(page)
    await generieren(page).click()
    await expect(popup(page)).toBeVisible()
    await expect(page.locator('#c-email')).toBeFocused()
    await expect.poll(() => aufrufe.check.length).toBe(1)
    expect(aufrufe.check[0]).toMatchObject({ company: 'Muster AG', city: 'Herisau', industry: 'craft', website: 'www.muster.ch' })
  })

  test('zeigt das Ergebnis erst nach E-Mail und Einwilligung', async ({ page }) => {
    await mocken(page)
    await formularAusfuellen(page)
    await generieren(page).click()
    await expect(popup(page)).toBeVisible()
    // Die Analyse ist längst fertig, aber ohne E-Mail bleibt das Ergebnis verborgen.
    await page.waitForTimeout(800)
    await popup(page).getByRole('button', { name: /Ergebnis anzeigen/ }).click()
    await expect(page.getByText('Bitte gib eine gültige E-Mail-Adresse an.')).toBeVisible()
    await expect(page.getByText('Bitte bestätige die Einwilligung')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Deine Online-Sichtbarkeit' })).toHaveCount(0)

    await page.locator('#c-email').fill('inhaber@muster.ch')
    await popup(page).getByRole('button', { name: /Ergebnis anzeigen/ }).click()
    await expect(page.getByText('Bitte bestätige die Einwilligung')).toBeVisible()
  })

  test('zeigt Ergebnis mit KI-Einschätzung und sendet genau einen Lead', async ({ page }) => {
    const aufrufe = await mocken(page)
    await formularAusfuellen(page)
    await generieren(page).click()
    await page.locator('#c-email').fill('inhaber@muster.ch')
    await page.locator('#c-einwilligung').check()
    await popup(page).getByRole('button', { name: /Ergebnis anzeigen/ }).click()

    await expect(page.getByRole('heading', { name: 'Deine Online-Sichtbarkeit' })).toBeVisible()
    await expect(page.getByRole('img', { name: '62 von 100' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Einschätzung deiner Marke' })).toBeVisible()
    await expect(page.getByText('Google-Profil prüfen')).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.getByRole('link', { name: /Ergebnis im Gespräch besprechen/ })).toBeVisible()

    await expect.poll(() => aufrufe.lead.length).toBe(1)
    expect(aufrufe.lead[0]).toMatchObject({ email: 'inhaber@muster.ch', einwilligung: true, company: 'Muster AG', status: 'ergebnis', score: 62 })
    expect(String(aufrufe.lead[0].einschaetzung)).toContain('Google-Profil')
    await page.waitForTimeout(500)
    expect(aufrufe.lead).toHaveLength(1)
  })

  test('zeigt das Ergebnis auch ohne KI, mit ehrlichem Hinweis', async ({ page }) => {
    await mocken(page, { ki: null })
    await formularAusfuellen(page)
    await generieren(page).click()
    await page.locator('#c-email').fill('inhaber@muster.ch')
    await page.locator('#c-einwilligung').check()
    await popup(page).getByRole('button', { name: /Ergebnis anzeigen/ }).click()
    await expect(page.getByRole('heading', { name: 'Deine Online-Sichtbarkeit' })).toBeVisible()
    await expect(page.getByText('Die KI-Einschätzung war gerade nicht verfügbar.')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Einschätzung deiner Marke' })).toHaveCount(0)
  })

  test('Abbrechen ohne E-Mail behält die Eingaben und sendet keinen Lead', async ({ page }) => {
    const aufrufe = await mocken(page, { verzoegerung: 1000 })
    await formularAusfuellen(page)
    await generieren(page).click()
    await expect(popup(page)).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(popup(page)).toBeHidden()
    await expect(page.locator('#c-company')).toHaveValue('Muster AG')
    await expect(page.locator('#c-website')).toHaveValue('www.muster.ch')
    await page.waitForTimeout(1500)
    expect(aufrufe.lead).toHaveLength(0)
    await expect(page.getByRole('heading', { name: 'Deine Online-Sichtbarkeit' })).toHaveCount(0)
  })

  test('Fehler der Analyse nach der E-Mail: Meldung im Formular und Lead mit Status fehler', async ({ page }) => {
    const aufrufe = await mocken(page, { checkStatus: 502, verzoegerung: 900 })
    await formularAusfuellen(page)
    await generieren(page).click()
    await page.locator('#c-email').fill('inhaber@muster.ch')
    await page.locator('#c-einwilligung').check()
    await popup(page).getByRole('button', { name: /Ergebnis anzeigen/ }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.getByText('Die Analyse hat nicht geklappt.')).toBeVisible()
    await expect(page.locator('#c-company')).toHaveValue('Muster AG')
    await expect.poll(() => aufrufe.lead.length).toBe(1)
    expect(aufrufe.lead[0]).toMatchObject({ email: 'inhaber@muster.ch', status: 'fehler' })
  })

  test('Fehler der Analyse vor der E-Mail: Meldung im Popup statt Eingabefeld', async ({ page }) => {
    const aufrufe = await mocken(page, { checkStatus: 422, checkBody: { ok: false, grund: 'analyse', meldung: 'Die Website konnte nicht geladen werden. Stimmt die Adresse?' } })
    await formularAusfuellen(page)
    await generieren(page).click()
    await expect(page.getByRole('dialog', { name: 'Die Analyse hat nicht geklappt' })).toBeVisible()
    await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Die Website konnte nicht geladen werden')
    await expect(page.locator('#c-email')).toHaveCount(0)
    await page.getByRole('button', { name: 'Schliessen' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.getByText('Die Website konnte nicht geladen werden. Stimmt die Adresse?')).toBeVisible()
    expect(aufrufe.lead).toHaveLength(0)
  })

  test('«Weitere Website prüfen» führt zurück zu einem leeren Formular', async ({ page }) => {
    await mocken(page)
    await formularAusfuellen(page)
    await generieren(page).click()
    await page.locator('#c-email').fill('inhaber@muster.ch')
    await page.locator('#c-einwilligung').check()
    await popup(page).getByRole('button', { name: /Ergebnis anzeigen/ }).click()
    await expect(page.getByRole('heading', { name: 'Deine Online-Sichtbarkeit' })).toBeVisible()
    await page.getByRole('button', { name: 'Weitere Website prüfen' }).click()
    await expect(page.locator('#c-company')).toHaveValue('')
  })
})
