import { ablauf } from '@/lib/content'

export function Ablauf() {
  return (
    <section className="sektion" id={ablauf.id} aria-labelledby="ablauf-titel">
      <div className="container">
        <header className="sektion__kopf">
          <p className="eyebrow">{ablauf.eyebrow}</p>
          <h2 id="ablauf-titel">{ablauf.h2}</h2>
          <p className="lead">{ablauf.lead}</p>
        </header>
        <ol className="schritte">
          {ablauf.schritte.map((s, i) => (
            <li key={s.titel}>
              <span className="schritte__nr" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{s.titel}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
