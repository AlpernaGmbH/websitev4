import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import karte from '@/lib/karte.json'
import { heim, kartenProjekte } from '@/lib/karte-projekte'
import { faelle, logoLeiste, weitere, zitate } from '@/lib/projekte'

const bild = (pfad: string) => join(process.cwd(), 'public', pfad)

describe('Kartenprojekte', () => {
  it('zeigt sieben Betriebe aus der Region', () => {
    expect(kartenProjekte).toHaveLength(7)
    expect(new Set(kartenProjekte.map((p) => p.id)).size).toBe(7)
  })

  it('verortet jedes Projekt innerhalb der Karte', () => {
    for (const p of kartenProjekte) {
      expect(p.x, p.name).toBeGreaterThan(0)
      expect(p.x, p.name).toBeLessThan(karte.W)
      expect(p.y, p.name).toBeGreaterThan(0)
      expect(p.y, p.name).toBeLessThan(karte.H)
    }
    expect(heim.x).toBeGreaterThan(0)
  })

  it('nummeriert von nah nach fern', () => {
    const km = kartenProjekte.map((p) => p.km)
    expect(kartenProjekte.map((p) => p.nr)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect([...km].sort((a, b) => a - b)).toEqual(km)
  })

  it('rechnet plausible Entfernungen von Speicher', () => {
    const trogen = kartenProjekte.find((p) => p.ort === 'Trogen')
    const romanshorn = kartenProjekte.find((p) => p.ort === 'Romanshorn')
    expect(trogen?.km).toBeGreaterThan(2)
    expect(trogen?.km).toBeLessThan(4)
    expect(romanshorn?.km).toBeGreaterThan(16)
    expect(romanshorn?.km).toBeLessThan(21)
  })

  it('enthält die von Andrej genannten Betriebe', () => {
    const namen = kartenProjekte.map((p) => p.name)
    for (const n of ['Beyond Borders', 'IFJ Startup Helper', 'Stiftung Wirtschaftsförderung AR']) expect(namen).toContain(n)
  })
})

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

  it('führt weitere Betriebe mit Ort auf', () => {
    expect(weitere.length).toBeGreaterThanOrEqual(3)
    for (const w of weitere) {
      expect(w.name.length).toBeGreaterThan(0)
      expect(w.ort.length).toBeGreaterThan(0)
    }
  })

  it('verwendet keine Zahl, die auf der alten Seite widersprüchlich war', () => {
    const alles = JSON.stringify({ faelle, zitate, weitere })
    expect(alles).not.toMatch(/21 Partner|6 Jahre|100 ?%/)
  })
})
