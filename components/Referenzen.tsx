import Image from 'next/image'
import { Pin, Zitat } from '@/components/Icons'
import { referenzen } from '@/lib/content'
import { faelle, logoLeiste, weitere, zitate } from '@/lib/projekte'

export function Referenzen() {
  return (
    <section className="sektion sektion--sand" id={referenzen.id} aria-labelledby="referenzen-titel">
      <div className="container">
        <header className="sektion__kopf">
          <p className="eyebrow">{referenzen.eyebrow}</p>
          <h2 id="referenzen-titel">{referenzen.h2}</h2>
          <p className="lead">{referenzen.lead}</p>
        </header>

        <div className="faelle">
          {faelle.map((f) => (
            <article className="fall" key={f.slug}>
              {f.bild ? (
                <div className="fall__bild">
                  <Image src={f.bild} alt={f.bildAlt ?? f.name} fill sizes="(min-width: 900px) 420px, 92vw" />
                </div>
              ) : (
                <div className="fall__bild fall__bild--logo">
                  <Image src={f.logo} alt={`Logo ${f.name}`} width={144} height={144} />
                </div>
              )}
              <div className="fall__inhalt">
                <p className="fall__ort">
                  {f.ort && <Pin />}
                  {f.ort ? `${f.ort} · ${f.zeitraum}` : f.zeitraum}
                </p>
                <h3>{f.name}</h3>
                <p className="fall__art">{f.art}</p>
                <dl className="zahlen">
                  {f.kennzahlen.map((k) => (
                    <div key={k.label}>
                      <dt>{k.label}</dt>
                      <dd>{k.wert}</dd>
                    </div>
                  ))}
                </dl>
                <p>
                  <b>{referenzen.ausgangslage}:</b> {f.ausgangslage}
                </p>
                <p>
                  <b>{referenzen.umsetzung}:</b> {f.umsetzung}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="weitere">
          <h3>{referenzen.weitereTitel}</h3>
          <ul>
            {weitere.map((w) => (
              <li key={w.name}>
                <strong>{w.name}</strong>
                <span>
                  {w.ort}
                  {w.was ? ` · ${w.was}` : ''}
                </span>
              </li>
            ))}
          </ul>
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
