import Image from 'next/image'
import { Haken, Pfeil } from '@/components/Icons'
import { Hoehenlinien } from '@/components/Hoehenlinien'
import { Teile } from '@/components/Teile'
import { TerminButton } from '@/components/TerminProvider'
import { hero } from '@/lib/content'

export function Hero() {
  return (
    <section className="hero" id="top">
      <Hoehenlinien className="hero__linien" />
      <div className="container hero__raster">
        <div className="hero__text">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>
            <Teile teile={hero.h1} />
          </h1>
          <p className="lead">{hero.lead}</p>

          <div className="hero__cta">
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

        <figure className="gruender">
          <div className="gruender__fotos">
            <Image
              className="gruender__foto"
              src="/images/team/andrej.webp"
              alt="Andrej Good, Mitgründer der Alperna GmbH"
              width={880}
              height={1100}
              sizes="(min-width: 960px) 240px, 44vw"
              priority
            />
            <Image
              className="gruender__foto gruender__foto--versetzt"
              src="/images/team/leander.webp"
              alt="Leander Züst, Mitgründer der Alperna GmbH"
              width={880}
              height={1100}
              sizes="(min-width: 960px) 240px, 44vw"
              priority
            />
          </div>
          <figcaption>
            <strong>{hero.fotoTitel}</strong>
            <span>{hero.fotoUntertitel}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
