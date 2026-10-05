import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/calendly.com/**', (r) => r.abort())
})

test.describe('Startseite', () => {
  test('hat im Hero beide Handlungen', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('.hero')
    await expect(hero.getByRole('heading', { level: 1 })).toContainText('Kunden online finden')
    await expect(hero.getByRole('link', { name: /Termin buchen/ })).toBeVisible()
    await expect(hero.getByRole('link', { name: 'Gratis Marketing-Check' })).toHaveAttribute('href', '#check')
  })

  test('öffnet den Kalender erst nach dem Klick', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('iframe')).toHaveCount(0)
    await page.locator('.hero').getByRole('link', { name: /Termin buchen/ }).click()
    const dialog = page.getByRole('dialog', { name: 'Termin buchen' })
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('iframe')).toHaveAttribute('src', 'https://calendly.com/alperna/erstkontakt')
    await expect(dialog.getByRole('link', { name: 'In neuem Tab öffnen' })).toHaveAttribute('target', '_blank')
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('nennt überall dieselben Fakten', async ({ page }) => {
    await page.goto('/')
    const text = await page.locator('body').innerText()
    expect(text).toContain('28')
    expect(text).not.toMatch(/21 Partner|6 Jahre|100 ?%\s*Zufriedene|175M/i)
  })

  test('zeigt Referenzen, Team und Adresse', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'BC Trogen Speicher' })).toBeVisible()
    await expect(page.getByAltText(/Andrej Good, Mitgründer/).first()).toBeVisible()
    await expect(page.locator('footer')).toContainText('Röhrenbrugg 7')
    await expect(page.locator('footer')).toContainText('CHE-132.724.195')
  })

  test('die FAQ lässt sich aufklappen', async ({ page }) => {
    await page.goto('/')
    const frage = page.getByText('Kann ich euch anrufen?')
    await frage.click()
    await expect(page.getByText('Spontane Anrufe nehmen wir nicht entgegen')).toBeVisible()
  })

  test('bleibt gesperrt für Suchmaschinen, solange nicht freigegeben', async ({ page, request }) => {
    await page.goto('/')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).toMatch(/Disallow: \//)
  })

  test('hat kein horizontales Scrollen', async ({ page }) => {
    await page.goto('/')
    const breiter = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
    expect(breiter).toBe(false)
  })

  test('Impressum und Datenschutz sind erreichbar und als Entwurf gekennzeichnet', async ({ page }) => {
    for (const pfad of ['/impressum', '/datenschutz']) {
      await page.goto(pfad)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.getByRole('note')).toContainText('Entwurf')
    }
  })
})

test.describe('Kontaktformular', () => {
  test('verlangt Name, E-Mail, Nachricht und Einwilligung', async ({ page }) => {
    let gesendet = 0
    await page.route('**/api/kontakt', (r) => {
      gesendet += 1
      return r.fulfill({ status: 200, json: { ok: true } })
    })
    await page.goto('/')
    await page.locator('#kontakt').getByRole('button', { name: 'Anfrage senden' }).click()
    await expect(page.getByText('Bitte gib deinen Namen an.')).toBeVisible()
    await expect(page.getByText('Bitte gib eine gültige E-Mail-Adresse an.')).toBeVisible()
    await expect(page.getByText('Erzähl uns kurz, worum es geht.')).toBeVisible()
    await expect(page.getByText('Bitte bestätige die Einwilligung.')).toBeVisible()
    expect(gesendet).toBe(0)
  })

  test('sendet die Anfrage inklusive Rückrufnummer und bestätigt', async ({ page }) => {
    let body: Record<string, unknown> | null = null
    await page.route('**/api/kontakt', (r) => {
      body = r.request().postDataJSON()
      return r.fulfill({ status: 200, json: { ok: true } })
    })
    await page.goto('/')
    await page.locator('#k-name').fill('Hans Muster')
    await page.locator('#k-firma').fill('Muster AG')
    await page.locator('#k-email').fill('hans@muster.ch')
    await page.locator('#k-telefon').fill('079 123 45 67')
    await page.locator('#k-nachricht').fill('Wir brauchen eine neue Website.')
    await page.locator('#k-einwilligung').check()
    await page.locator('#kontakt').getByRole('button', { name: 'Anfrage senden' }).click()
    await expect(page.getByText('Danke, deine Nachricht ist angekommen.')).toBeVisible()
    expect(body).toMatchObject({ name: 'Hans Muster', email: 'hans@muster.ch', telefon: '079 123 45 67', einwilligung: true, website: '' })
  })

  test('zeigt eine Meldung, wenn der Versand scheitert', async ({ page }) => {
    await page.route('**/api/kontakt', (r) => r.fulfill({ status: 502, json: { ok: false } }))
    await page.goto('/')
    await page.locator('#k-name').fill('Hans Muster')
    await page.locator('#k-email').fill('hans@muster.ch')
    await page.locator('#k-nachricht').fill('Hallo')
    await page.locator('#k-einwilligung').check()
    await page.locator('#kontakt').getByRole('button', { name: 'Anfrage senden' }).click()
    await expect(page.getByText('Das hat leider nicht geklappt.')).toBeVisible()
  })
})
