import { describe, expect, it } from 'vitest'
import { naechsterBaustein, type CheckErgebnis, type CheckKategorie } from '@/lib/check'

const kat = (id: string, score: number, weight: number, relevance?: string): CheckKategorie => ({
  id,
  title: id,
  score,
  weight,
  relevance,
  items: [],
})

const ergebnis = (categories: CheckKategorie[]): CheckErgebnis => ({
  company: 'Muster AG',
  industryLabel: 'Handwerk',
  url: 'https://muster.ch/',
  score: 50,
  categories,
})

describe('naechsterBaustein', () => {
  it('schlägt die Kategorie mit der grössten gewichteten Lücke vor', () => {
    const e = ergebnis([kat('seo', 0.9, 25), kat('gbp', 0.2, 20), kat('social', 0.5, 20)])
    expect(naechsterBaustein(e)?.kategorie).toBe('gbp')
    expect(naechsterBaustein(e)?.titel).toBe('Google-Profil')
  })

  it('schlägt nichts vor, wenn keine spürbare Lücke da ist', () => {
    const e = ergebnis([kat('seo', 0.95, 25), kat('gbp', 0.95, 20), kat('social', 0.95, 20)])
    expect(naechsterBaustein(e)).toBeNull()
  })

  it('schlägt Google Ads erst vor, wenn alle anderen Bausteine solide stehen', () => {
    const solide = ergebnis([kat('seo', 0.8, 25), kat('gbp', 0.8, 20), kat('social', 0.8, 20), kat('sea', 0, 12)])
    expect(naechsterBaustein(solide)?.kategorie).toBe('sea')

    const luecken = ergebnis([kat('seo', 0.4, 25), kat('gbp', 0.8, 20), kat('sea', 0, 12)])
    expect(naechsterBaustein(luecken)?.kategorie).toBe('seo')
  })

  it('übergeht Kategorien ohne Gewicht oder mit geringer Relevanz', () => {
    const e = ergebnis([kat('shop', 0, 0, 'gering'), kat('booking', 0, 0), kat('social', 0.1, 20, 'tief'), kat('seo', 0.5, 25)])
    expect(naechsterBaustein(e)?.kategorie).toBe('seo')
  })
})
