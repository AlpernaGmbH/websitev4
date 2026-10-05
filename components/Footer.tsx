import Image from 'next/image'
import Link from 'next/link'
import { footer, nav } from '@/lib/content'
import { site } from '@/lib/site'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__raster">
        <div className="footer__marke">
          <a href="#top" className="logo logo--hell" aria-label="Alperna, zum Seitenanfang">
            <span className="logo__marke">
              <Image src="/images/brand/alperna-mark.webp" alt="" width={26} height={26} />
            </span>
            <span className="logo__text">Alperna</span>
          </a>
          <p>{footer.about}</p>
        </div>

        <nav aria-label="Seitenübersicht">
          <h2>Auf dieser Seite</h2>
          <ul>
            {nav.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2>Kontakt</h2>
          <address>
            {site.legalName}
            <br />
            {site.address.street}
            <br />
            {site.address.zip} {site.address.city}
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <br />
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </address>
        </div>

        <div>
          <h2>Folge uns</h2>
          <ul>
            <li>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer">
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer__unten">
        <p>
          {footer.copyright} · UID {site.uid}
        </p>
        <p>{footer.karte}</p>
        <ul>
          {footer.rechtliches.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
