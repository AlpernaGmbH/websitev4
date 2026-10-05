import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Montserrat } from 'next/font/google'
import { TerminProvider } from '@/components/TerminProvider'
import { meta } from '@/lib/content'
import { indexierbar, site } from '@/lib/site'
import './globals.css'

const body = Montserrat({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const display = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-display', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: meta.title,
  description: meta.description,
  alternates: { canonical: '/' },
  // Solange NEXT_PUBLIC_INDEXABLE nicht 1 ist, bleibt die Seite für Suchmaschinen gesperrt.
  robots: indexierbar ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { title: meta.title, description: meta.description, url: site.url, siteName: site.name, locale: 'de_CH', type: 'website' },
  twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
}

export const viewport: Viewport = { themeColor: '#F7F5F0', width: 'device-width', initialScale: 1 }

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.legalName,
  url: site.url,
  email: site.email,
  taxID: site.uid,
  description: meta.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    postalCode: site.address.zip,
    addressLocality: site.address.city,
    addressRegion: site.address.canton,
    addressCountry: 'CH',
  },
  areaServed: ['St. Gallen', 'Appenzell', 'Rheintal', 'Ostschweiz'],
  founder: [
    { '@type': 'Person', name: site.team.andrej.name, sameAs: [site.team.andrej.linkedin] },
    { '@type': 'Person', name: site.team.leander.name, sameAs: [site.team.leander.linkedin] },
  ],
  sameAs: Object.values(site.social),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH" className={`${body.variable} ${display.variable}`}>
      <body>
        <a className="skip" href="#main">
          Zum Inhalt springen
        </a>
        <TerminProvider>{children}</TerminProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  )
}
