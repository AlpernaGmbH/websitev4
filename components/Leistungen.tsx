import { Browser, Haken, Kamera, Pin } from '@/components/Icons'
import { leistungen } from '@/lib/content'

const ICONS = [Browser, Pin, Kamera]

export function Leistungen() {
  return (
    <section className="sektion" id={leistungen.id} aria-labelledby="leistungen-titel">
      <div className="container">
        <header className="sektion__kopf">
          <p className="eyebrow">{leistungen.eyebrow}</p>
          <h2 id="leistungen-titel">{leistungen.h2}</h2>
          <p className="lead">{leistungen.lead}</p>
        </header>

        <div className="leistungen">
          {leistungen.karten.map((k, i) => {
            const Icon = ICONS[i]
            return (
              <article className="leistung" key={k.titel}>
                <span className="leistung__icon">
                  <Icon />
                </span>
                <h3>{k.titel}</h3>
                <p className="leistung__versprechen">{k.versprechen}</p>
                <ul className="haken-liste haken-liste--eng">
                  {k.punkte.map((p) => (
                    <li key={p}>
                      <Haken />
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="leistung__preis">
                  <strong>{k.preis}</strong>
                  <span>{k.preisZusatz}</span>
                </p>
              </article>
            )
          })}
        </div>
        <p className="leistungen__weitere">{leistungen.weitere}</p>
      </div>
    </section>
  )
}
