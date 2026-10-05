import { Plus } from '@/components/Icons'
import { Teile } from '@/components/Teile'
import { faq } from '@/lib/content'

export function Faq() {
  return (
    <section className="section" id={faq.id} aria-labelledby="faq-titel">
      <div className="container container--schmal">
        <header className="section__kopf">
          <p className="eyebrow">{faq.eyebrow}</p>
          <h2 id="faq-titel">
            <Teile teile={faq.h2} />
          </h2>
        </header>
        <div className="faq">
          {faq.fragen.map((f) => (
            <details key={f.q}>
              <summary>
                <span>{f.q}</span>
                <Plus />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
