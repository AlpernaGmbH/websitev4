import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { faelle, logoLeiste, zitate } from '@/lib/projekte'

const bild = (pfad: string) => join(process.cwd(), 'public', pfad)

describe('Referenzen', () => {
  it('zeigt vier Fälle mit mindestens zwei Kennzahlen', () => {
    expect(faelle).toHaveLength(4)
    for (const f of faelle) expect(f.kennzahlen.length, f.name).toBeGreaterThanOrEqual(2)
  })

  it('verweist nur auf Bilder, die im Repo liegen', () => {
    for (const f of faelle) {
      expect(existsSync(bild(f.logo)), `${f.name}: ${f.logo}`).toBe(true)
      if (f.bild) expect(existsSync(bild(f.bild)), `${f.name}: ${f.bild}`).toBe(true)
    }
    for (const l of logoLeiste) expect(existsSync(bild(l.logo)), `${l.name}: ${l.logo}`).toBe(true)
  })

  it('zeigt jedes Logo höchstens einmal', () => {
    const pfade = logoLeiste.map((l) => l.logo)
    expect(new Set(pfade).size).toBe(pfade.length)
  })

  it('hat drei Zitate mit Betrieb, Branche und Text', () => {
    expect(zitate).toHaveLength(3)
    for (const z of zitate) {
      expect(z.firma.length).toBeGreaterThan(0)
      expect(z.branche.length).toBeGreaterThan(0)
      expect(z.text.length).toBeGreaterThan(40)
    }
  })

  it('verwendet keine Zahl, die auf der Live-Seite widersprüchlich war', () => {
    const alles = JSON.stringify({ faelle, zitate })
    expect(alles).not.toMatch(/21 Partner|6 Jahre|100 ?%/)
  })
})
