import { z } from 'zod'

export const BRANCHEN = ['gastro', 'hotel', 'beauty', 'health', 'fitness', 'retail', 'producer', 'craft', 'b2b', 'realestate', 'auto', 'other'] as const
export const NETZE = ['instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'] as const
export const HAEUFIGKEIT = ['none', 'rare', 'monthly', 'weekly', 'several'] as const

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const webadresse = z
  .string()
  .trim()
  .max(200)
  .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
  .refine((v) => {
    try {
      const u = new URL(v)
      return (u.protocol === 'https:' || u.protocol === 'http:') && u.hostname.includes('.') && !/^(localhost|\d+\.\d+\.\d+\.\d+)$/.test(u.hostname)
    } catch {
      return false
    }
  })

export const checkSchema = z.object({
  company: z.string().trim().min(1).max(120),
  city: z.string().trim().max(80).optional().default(''),
  industry: z.enum(BRANCHEN),
  website: webadresse,
  socials: z
    .partialRecord(z.enum(NETZE), z.object({ url: z.string().trim().max(200).optional(), freq: z.enum(HAEUFIGKEIT).optional() }))
    .optional()
    .default({}),
})

export const leadSchema = z.object({
  email: z.string().trim().max(200).regex(EMAIL),
  einwilligung: z.literal(true),
  company: z.string().trim().min(1).max(120),
  website: z.string().trim().max(200),
  branche: z.string().trim().max(60).optional().default(''),
  ort: z.string().trim().max(80).optional().default(''),
  status: z.enum(['ergebnis', 'fehler', 'abgebrochen']),
  score: z.number().min(0).max(100).optional(),
  befunde: z.array(z.string().trim().max(200)).max(5).optional().default([]),
  einschaetzung: z.string().trim().max(700).optional().default(''),
})

export const kontaktSchema = z.object({
  name: z.string().trim().min(1).max(120),
  firma: z.string().trim().max(160).optional().default(''),
  email: z.string().trim().max(200).regex(EMAIL),
  telefon: z.string().trim().max(40).optional().default(''),
  nachricht: z.string().trim().min(1).max(1500), // Notion nimmt höchstens 2000 Zeichen pro Textblock
  website: z.string().max(200).optional().default(''), // Honigtopf: echte Besucher lassen das Feld leer
  einwilligung: z.literal(true),
})

export type CheckEingabe = z.infer<typeof checkSchema>
export type LeadEingabe = z.infer<typeof leadSchema>
export type KontaktEingabe = z.infer<typeof kontaktSchema>
