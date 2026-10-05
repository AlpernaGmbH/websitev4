import Image from 'next/image'
import { Zitat } from '@/components/Icons'
import { Teile } from '@/components/Teile'
import { referenzen } from '@/lib/content'
import { faelle, logoLeiste, zitate } from '@/lib/projekte'

export function Referenzen() {
  return (
    <section className="section" id={referenzen.id} aria-labelledby="referenzen-titel">
      <div className="container">
        <header className="section__kopf">
          <p className="eyebrow">{referenzen.eyebrow}</p>
          <h2 id="referenzen-titel">
            <Teile teile={referenzen.h2} />
          </h2>
          <p className="lead">{referenzen.lead}</p>
        </header>

        <div className="faelle">
          {faelle.map((f) => (
            <article className="fall" key={f.slug}>
              {f.bild ? (
                <div className="fall__bild">
                  <Image src={f.bild} alt={f.bildAlt ?? f.name} fill sizes="(min-width: 960px) 540px, 92vw" />
                </div>
              ) : (
                <div className="fall__bild fall__bild--logo">
                  <Image src={f.logo} alt={`Logo ${f.name}`} width={144} height={144} />
                </div>
              )}
              <div className="fall__inhalt">
                <header className="fall__kopf">
                  {f.bild && <Image src={f.logo} alt={`Logo ${f.name}`} width={56} height={56} />}
                  <div>
                    <h3>{f.name}</h3>
                    <p>
                      {f.art} · {f.zeitraum}
                    </p>
                  </div>
                </header>
                <dl className="zahlen">
                  {f.kennzahlen.map((k) => (
                    <div key={k.label}>
                      <dt>{k.label}</dt>
                      <dd>{k.wert}</dd>
                    </div>
                  ))}
                </dl>
                <h4>{referenzen.ausgangslage}</h4>
                <p>{f.ausgangslage}</p>
                <h4>{referenzen.umsetzung}</h4>
                <p>{f.umsetzung}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="stimmen">
          <h3>{referenzen.zitateTitel}</h3>
          <ul>
            {zitate.map((z) => (
              <li key={z.projekt}>
                <figure>
                  <Zitat className="stimmen__zeichen" />
                  <blockquote>
                    <p>«{z.text}»</p>
                  </blockquote>
                  <figcaption>
                    <strong>{z.firma}</strong>
                    <span>{z.branche}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>

        <div className="partner">
          <h3>{referenzen.logoTitel}</h3>
          <ul className="avatare">
            {logoLeiste.map((l) => (
              <li key={l.name}>
                <Image src={l.logo} alt={l.name} title={l.name} width={72} height={72} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
