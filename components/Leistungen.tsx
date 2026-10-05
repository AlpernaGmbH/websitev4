import { Browser, Haken, Kamera, Pin } from '@/components/Icons'
import { Teile } from '@/components/Teile'
import { leistungen } from '@/lib/content'

const ICONS = [Browser, Pin, Kamera]

export function Leistungen() {
  return (
    <section className="section" id={leistungen.id} aria-labelledby="leistungen-titel">
      <div className="container">
        <header className="section__kopf">
          <p className="eyebrow">{leistungen.eyebrow}</p>
          <h2 id="leistungen-titel">
            <Teile teile={leistungen.h2} />
          </h2>
          <p className="lead">{leistungen.lead}</p>
        </header>

        <div className="karten">
          {leistungen.karten.map((k, i) => {
            const Icon = ICONS[i]
            return (
              <article className="karte" key={k.titel}>
                <span className="karte__icon">
                  <Icon />
                </span>
                <h3>{k.titel}</h3>
                <p className="karte__preis">
                  <strong>{k.preis}</strong>
                  <span>{k.preisZusatz}</span>
                </p>
                <p>{k.text}</p>
                <ul className="haken-liste haken-liste--eng">
                  {k.punkte.map((p) => (
                    <li key={p}>
                      <Haken />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
        <p className="weitere">{leistungen.weitere}</p>
      </div>
    </section>
  )
}
