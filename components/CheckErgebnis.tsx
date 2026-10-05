'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { Haken, Pfeil } from '@/components/Icons'
import { TerminButton } from '@/components/TerminProvider'
import { naechsterBaustein, type CheckErgebnis } from '@/lib/check'
import { check } from '@/lib/content'

const r = check.ergebnis
const prozent = (x: number) => `${Math.round(x * 100)} %`

export function CheckErgebnisAnsicht({ e, onNochmal }: { e: CheckErgebnis; onNochmal: () => void }) {
  const rec = naechsterBaustein(e)
  const satz = e.score >= 70 ? r.stark : e.score >= 40 ? r.mittel : r.schwach
  const kopf = useRef<HTMLHeadingElement>(null)
  const ki = e.einschaetzung

  useEffect(() => {
    kopf.current?.focus({ preventScroll: true })
    kopf.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <section className="ergebnis" aria-labelledby="ergebnis-titel">
      <div className="ergebnis__kopf">
        <div>
          <p className="ergebnis__fuer">
            {r.fuer} {e.company}
            {e.city ? ` · ${e.city}` : ''} · {e.industryLabel}
          </p>
          <h3 id="ergebnis-titel" ref={kopf} tabIndex={-1}>
            {r.titel}
          </h3>
          <p className="ergebnis__satz">{satz}</p>
        </div>
        <p className="score" style={{ '--p': e.score } as CSSProperties} role="img" aria-label={`${e.score} ${r.von}`}>
          <span>{e.score}</span>
          <small>{r.von}</small>
        </p>
      </div>

      {ki ? (
        <div className="ki">
          <h4>{r.kiTitel}</h4>
          <p className="ki__hinweis">{r.kiHinweis}</p>
          <p className="ki__zusammenfassung">{ki.zusammenfassung}</p>
          <div className="ki__spalten">
            {ki.staerken.length > 0 && (
              <div>
                <h5>{r.kiStaerken}</h5>
                <ul className="haken-liste haken-liste--eng">
                  {ki.staerken.map((s) => (
                    <li key={s}>
                      <Haken />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {ki.luecken.length > 0 && (
              <div>
                <h5>{r.kiLuecken}</h5>
                <ul className="punkt-liste">
                  {ki.luecken.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {ki.schritte.length > 0 && (
            <div className="ki__schritte">
              <h5>{r.kiSchritte}</h5>
              <ol>
                {ki.schritte.map((s) => (
                  <li key={s.titel}>
                    <strong>{s.titel}</strong>
                    <span>{s.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      ) : (
        <p className="ki ki--fehlt">{r.keineKi}</p>
      )}

      <h4 className="ergebnis__zwischentitel">{r.messwerte}</h4>
      <div className="kategorien">
        {e.categories.map((k) => {
          const offen = k.items.filter((it) => !it.ok)
          const erledigt = k.items.filter((it) => it.ok)
          return (
            <article className="kategorie" key={k.id} data-irrelevant={k.weight <= 0}>
              <div className="kategorie__kopf">
                <h5>{k.title}</h5>
                <span>{prozent(k.score)}</span>
              </div>
              <div className="balken" role="presentation">
                <span style={{ width: `${Math.round(k.score * 100)}%` }} />
              </div>
              {(k.selfReported || k.verified === false) && (
                <p className="kategorie__marken">
                  {k.selfReported && <span>{r.selbstangabe}</span>}
                  {k.verified === false && <span>{r.nichtGeprueft}</span>}
                </p>
              )}
              {offen.length > 0 && (
                <ul className="befunde">
                  {offen.map((it) => (
                    <li key={it.label}>
                      <span className="befunde__zeichen befunde__zeichen--offen" role="img" aria-label={r.luecke}>
                        !
                      </span>
                      <span>
                        {it.label}
                        <small>{it.detail}</small>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {erledigt.length > 0 && (
                <details className="erledigt">
                  <summary>{offen.length ? `${erledigt.length} ${r.weitereOk}` : `${r.allesOk} (${erledigt.length})`}</summary>
                  <ul className="befunde">
                    {erledigt.map((it) => (
                      <li key={it.label}>
                        <span className="befunde__zeichen befunde__zeichen--ok" role="img" aria-label={r.ok}>
                          <Haken />
                        </span>
                        <span>
                          {it.label}
                          <small>{it.detail}</small>
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {(k.hint || k.note) && <p className="kategorie__hinweis">{k.hint ?? k.note}</p>}
            </article>
          )
        })}
      </div>

      <aside className="naechster">
        <p className="eyebrow">{r.naechsterBaustein}</p>
        <h4>{rec ? rec.titel : r.keinBaustein}</h4>
        <p>{rec ? r.grund : r.keinBausteinText}</p>
      </aside>

      <p className="ergebnis__grenze">{r.grenze}</p>
      <div className="ergebnis__aktionen">
        <TerminButton variant="primary" gross>
          {r.termin}
          <Pfeil />
        </TerminButton>
        <button type="button" className="btn btn--ghost btn--gross" onClick={onNochmal}>
          {r.nochmal}
        </button>
      </div>
    </section>
  )
}
