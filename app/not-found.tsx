import Link from 'next/link'

export default function NichtGefunden() {
  return (
    <main id="main" className="rechtlich">
      <div className="container container--schmal">
        <p className="eyebrow">Fehler 404</p>
        <h1>
          Diese Seite <em>gibt es nicht.</em>
        </h1>
        <p className="lead">Vielleicht hilft dir die Startseite weiter.</p>
        <p>
          <Link className="btn btn--primary" href="/">
            Zur Startseite
          </Link>
        </p>
      </div>
    </main>
  )
}
