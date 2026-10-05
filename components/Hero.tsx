import { Haken, Pfeil, Pin } from '@/components/Icons'
import { Karte } from '@/components/Karte'
import { TerminButton } from '@/components/TerminProvider'
import { hero } from '@/lib/content'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__raster">
        <div className="hero__text">
          <p className="hero__eyebrow">
            <Pin />
            {hero.eyebrow}
          </p>
          <h1>
            {hero.h1.split('Google-Profil')[0]}
            <span className="nb">Google-Profil</span>
            {hero.h1.split('Google-Profil')[1]}
          </h1>
          <p className="lead">{hero.lead}</p>

          <div className="cta-zeile">
            <div className="cta">
              <TerminButton variant="primary" gross>
                {hero.termin}
                <Pfeil />
              </TerminButton>
              <span className="cta__hinweis">{hero.terminHinweis}</span>
            </div>
            <div className="cta">
              <a className="btn btn--ghost btn--gross" href="#check">
                {hero.check}
              </a>
              <span className="cta__hinweis">{hero.checkHinweis}</span>
            </div>
          </div>

          <ul className="haken-liste">
            {hero.vertrauen.map((t) => (
              <li key={t}>
                <Haken />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <Karte />
      </div>
    </section>
  )
}
