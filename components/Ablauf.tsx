import { Teile } from '@/components/Teile'
import { ablauf } from '@/lib/content'

export function Ablauf() {
  return (
    <section className="section section--tint" id={ablauf.id} aria-labelledby="ablauf-titel">
      <div className="container">
        <header className="section__kopf">
          <p className="eyebrow">{ablauf.eyebrow}</p>
          <h2 id="ablauf-titel">
            <Teile teile={ablauf.h2} />
          </h2>
          <p className="lead">{ablauf.lead}</p>
        </header>
        <ol className="schritte">
          {ablauf.etappen.map((e, i) => (
            <li key={e.titel}>
              <span className="schritte__nr" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{e.titel}</h3>
              <p>{e.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
