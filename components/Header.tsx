import Image from 'next/image'
import { MobileMenu } from '@/components/MobileMenu'
import { TerminButton } from '@/components/TerminProvider'
import { hero, nav } from '@/lib/content'

export function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#top" className="logo" aria-label="Alperna, zum Seitenanfang">
          <span className="logo__marke">
            <Image src="/images/brand/alperna-mark.webp" alt="" width={26} height={26} priority />
          </span>
          <span className="logo__text">Alperna</span>
        </a>
        <nav className="nav" aria-label="Hauptnavigation">
          {nav.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="header__rechts">
          <TerminButton variant="primary" className="btn--kompakt">
            {hero.termin}
          </TerminButton>
          <MobileMenu links={nav} />
        </div>
      </div>
    </header>
  )
}
