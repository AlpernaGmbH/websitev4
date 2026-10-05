import type { CheckKategorie } from '@/lib/check'

export type Netz = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube'

export type AnalyseEingabe = {
  company: string
  city?: string
  industry?: string
  website: string
  socials?: Partial<Record<Netz, { url?: string; freq?: string }>>
}

/** Öffentlicher Text der Startseite, hart begrenzt. Grundlage der KI-Einschätzung. */
export type Snapshot = {
  title: string
  description: string
  headings: string[]
  lang: string
  excerpt: string
  hasOgImage: boolean
  hasTelLink: boolean
  hasMailLink: boolean
  hasImpressum: boolean
}

export type AnalyseErgebnis = {
  checkedAt: string
  company: string
  city: string
  industry: string
  industryLabel: string
  url: string
  score: number
  categories: CheckKategorie[]
  snapshot: Snapshot
  facts: Record<string, unknown>
}

export declare const INDUSTRIES: Record<string, { label: string; shop: 'hoch' | 'mittel' | 'gering'; booking: 'hoch' | 'mittel' | 'gering'; shopHint: string; bookingHint: string }>
export declare function normalizeUrl(raw: unknown): string | null
export declare function analyze(input: AnalyseEingabe): Promise<AnalyseErgebnis>
