import { describe, expect, it } from 'vitest'
import { zuOft } from '@/lib/ratelimit'

describe('zuOft', () => {
  it('lässt so viele Anfragen zu, wie erlaubt sind, und sperrt die nächste', () => {
    const t0 = 1_000_000
    for (let i = 0; i < 5; i++) expect(zuOft('ip-a', 5, 60_000, t0 + i)).toBe(false)
    expect(zuOft('ip-a', 5, 60_000, t0 + 10)).toBe(true)
  })

  it('lässt nach Ablauf des Fensters wieder zu', () => {
    const t0 = 2_000_000
    for (let i = 0; i < 6; i++) zuOft('ip-b', 5, 60_000, t0 + i)
    expect(zuOft('ip-b', 5, 60_000, t0 + 61_000)).toBe(false)
  })

  it('zählt jeden Schlüssel für sich', () => {
    const t0 = 3_000_000
    for (let i = 0; i < 6; i++) zuOft('ip-c', 5, 60_000, t0 + i)
    expect(zuOft('ip-d', 5, 60_000, t0 + 10)).toBe(false)
  })

  it('zählt Anfragen mit verschiedenen Zwecken getrennt', () => {
    const t0 = 4_000_000
    for (let i = 0; i < 6; i++) zuOft('check:ip-e', 5, 60_000, t0 + i)
    expect(zuOft('kontakt:ip-e', 5, 60_000, t0 + 10)).toBe(false)
  })
})
