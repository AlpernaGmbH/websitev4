import type { MetadataRoute } from 'next'
import { indexierbar, site } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  if (!indexierbar) return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: `${site.url}/sitemap.xml` }
}
