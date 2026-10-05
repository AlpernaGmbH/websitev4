import Image from 'next/image'
import Link from 'next/link'
import { entwurfHinweis, type Abschnitt } from '@/lib/rechtliches'

/** Rahmen für Impressum und Datenschutz, mit sichtbarem Entwurfshinweis. */
export function RechtlichSeite({ titel, stand, abschnitte }: { titel: string; stand: string; abschnitte: Abschnitt[] }) {
  return (
    <>
      <header className="header header--schlicht">
        <div className="container header__inner">
          <Link href="/" className="logo" aria-label="Alperna, zur Startseite">
            <span className="logo__marke">
              <Image src="/images/brand/alperna-mark.webp" alt="" width={26} height={26} />
            </span>
            <span className="logo__text">Alperna</span>
          </Link>
          <Link className="btn btn--ghost btn--kompakt" href="/">
            Zur Startseite
          </Link>
        </div>
      </header>
      <main id="main" className="rechtlich">
        <div className="container container--schmal">
          <p className="entwurf" role="note">
            {entwurfHinweis}
          </p>
          <h1>{titel}</h1>
          <p className="rechtlich__stand">{stand}</p>
          {abschnitte.map((a) => (
            <section key={a.titel}>
              <h2>{a.titel}</h2>
              {a.absaetze.map((p, i) =>
                typeof p === 'string' ? (
                  <p key={i}>{p}</p>
                ) : (
                  <ul key={i}>
                    {p.liste.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}
        </div>
      </main>
    </>
  )
}
