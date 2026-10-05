'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { MOBIL, type KartenProjekt } from '@/lib/karte-projekte'

type Props = {
  projekte: KartenProjekt[]
  heim: { x: number; y: number }
  breite: number
  hoehe: number
  titel: string
  hinweis: string
  children: ReactNode
}

const pct = (v: number, max: number) => `${((v / max) * 100).toFixed(3)}%`
/** Position in Prozent, einmal für die ganze Karte und einmal für den Handy-Ausschnitt */
const pos = (x: number, y: number, breite: number, hoehe: number) =>
  ({ '--x': pct(x, breite), '--y': pct(y, hoehe), '--xm': pct(x - MOBIL.x, MOBIL.w), '--ym': pct(y - MOBIL.y, MOBIL.h) }) as CSSProperties
const km = (v: number) => `${Math.round(v)} km`

/** Karte mit nummerierten Markierungen, Info-Leiste und Liste. Die Karte selbst (SVG) kommt vom Server. */
export function KarteMitListe({ projekte, heim, breite, hoehe, titel, hinweis, children }: Props) {
  const [aktiv, setAktiv] = useState<string | null>(null)
  const flaeche = useRef<HTMLDivElement>(null)
  const p = projekte.find((x) => x.id === aktiv)

  // Die Linie des gewählten Betriebs hervorheben
  useEffect(() => {
    flaeche.current?.querySelectorAll<SVGPathElement>('.route').forEach((r) => r.classList.toggle('route--aktiv', r.dataset.id === aktiv))
  }, [aktiv])

  return (
    <div className="karte-block">
      <figure className="karte" data-hat-aktiv={aktiv !== null}>
        <div className="karte__flaeche" ref={flaeche}>
          {children}

          <div className="pin pin--heim" style={pos(heim.x, heim.y, breite, hoehe)}>
            <span className="pin__heim-punkt" aria-hidden="true" />
            <span className="pin__heim-name">
              <strong>Alperna</strong> Speicher AR
            </span>
          </div>

          {projekte.map((x, i) => (
            <button
              key={x.id}
              type="button"
              className="pin pin--projekt"
              data-aktiv={aktiv === x.id}
              data-oben={x.y < 180}
              style={{ ...pos(x.x, x.y, breite, hoehe), '--i': i } as CSSProperties}
              aria-label={`${x.nr}. ${x.name}, ${x.ort}, ${Math.round(x.km)} Kilometer von Speicher`}
              aria-pressed={aktiv === x.id}
              onMouseEnter={() => setAktiv(x.id)}
              onFocus={() => setAktiv(x.id)}
              onClick={() => setAktiv(x.id)}
            >
              <span className="pin__nr" aria-hidden="true">
                {x.nr}
              </span>
              <span className="pin__etikett" aria-hidden="true">
                {x.name}
              </span>
            </button>
          ))}
        </div>

        <figcaption className="karte__info" role="status" aria-live="polite">
          {p ? (
            <>
              <span className="karte__info-kopf">
                <span className="karte__info-nr">{p.nr}</span>
                <strong>{p.name}</strong>
                <span>
                  {p.ort} · {km(p.km)} von uns
                </span>
              </span>
              {(p.was || p.zahl) && (
                <span className="karte__info-text">
                  {p.was}
                  {p.was && p.zahl ? '. ' : ''}
                  {p.zahl && <b>{p.zahl}</b>}
                </span>
              )}
            </>
          ) : (
            <span className="karte__info-hinweis">{hinweis}</span>
          )}
        </figcaption>
      </figure>

      <div className="karte-liste">
        <p className="karte-liste__titel">{titel}</p>
        <ol>
          {projekte.map((x) => (
            <li key={x.id}>
              <button type="button" className="chip" data-aktiv={aktiv === x.id} onMouseEnter={() => setAktiv(x.id)} onFocus={() => setAktiv(x.id)} onClick={() => setAktiv(x.id)}>
                <span className="chip__nr" aria-hidden="true">
                  {x.nr}
                </span>
                <span className="chip__name">{x.kurz ?? x.name}</span>
                <span className="chip__km">{km(x.km)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
