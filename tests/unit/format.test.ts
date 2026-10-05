import { describe, expect, it } from 'vitest'
import { chf, fmt } from '@/lib/format'

describe('Schweizer Zahlenschreibweise', () => {
  it('trennt Tausender mit typografischem Apostroph', () => {
    expect(fmt(25000)).toBe('25’000')
    expect(fmt(1234567)).toBe('1’234’567')
  })
  it('lässt kleine Zahlen unverändert', () => {
    expect(fmt(999)).toBe('999')
  })
  it('schreibt Franken mit CHF davor', () => {
    expect(chf(1000)).toBe('CHF 1’000')
    expect(chf(180)).toBe('CHF 180')
  })
})
