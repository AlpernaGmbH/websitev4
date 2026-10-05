import type { CSSProperties } from 'react'
import karte from '@/lib/karte.json'
import { heim, kartenProjekte } from '@/lib/karte-projekte'

const AR = karte.cantons.find((c) => c.name === 'Appenzell Ausserrhoden')
const AI = karte.cantons.find((c) => c.name === 'Appenzell Innerrhoden')
const seen = karte.lakes.filter((l) => l.name === 'Bodensee')
const staedte = karte.staedte as Record<string, { x: number; y: number }>

/** Geschwungene Linie von Speicher zum Betrieb */
function bogen(a: { x: number; y: number }, b: { x: number; y: number }, kruemmung: number): string {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  return `M${a.x},${a.y} Q${(mx - dy * kruemmung).toFixed(1)},${(my + dx * kruemmung).toFixed(1)} ${b.x},${b.y}`
}

/** Länge des Bogens, damit die Linie sich beim Laden sauber zeichnet */
function laenge(a: { x: number; y: number }, b: { x: number; y: number }, k: number): number {
  const cx = (a.x + b.x) / 2 - (b.y - a.y) * k
  const cy = (a.y + b.y) / 2 + (b.x - a.x) * k
  let l = 0
  let px = a.x
  let py = a.y
  for (let i = 1; i <= 40; i++) {
    const t = i / 40
    const x = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * cx + t ** 2 * b.x
    const y = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * cy + t ** 2 * b.y
    l += Math.hypot(x - px, y - py)
    px = x
    py = y
  }
  return Math.ceil(l) + 2
}

const stadtEtiketten: [string, 'start' | 'end', number, number][] = [
  ['Arbon', 'end', -10, 8],
  ['Rorschach', 'start', 10, 8],
  ['Gossau', 'end', -10, 8],
  ['Appenzell', 'start', 10, 22],
  ['Altstätten', 'start', 10, 8],
  ['Urnäsch', 'end', -10, 8],
]

/** Die Karte als ruhiges SVG. Markierungen und Beschriftungen der Betriebe liegen als HTML darüber (KarteMitListe). */
export function KarteSvg() {
  return (
    <svg id="karte-svg" className="karte__svg" viewBox={`0 0 ${karte.W} ${karte.H}`} role="img" aria-label="Karte der Region Appenzell, St. Gallen und Bodensee mit Speicher in der Mitte und sieben Betrieben aus der Region">
      <rect width={karte.W} height={karte.H} className="k-aussen" />
      <path className="k-wasser-nord" d={karte.nordsee} />
      <g className="k-kantone">
        {karte.cantons.map((c) => (
          <path key={c.name} d={c.d} />
        ))}
      </g>
      {AI && <path className="k-ai" d={AI.d} />}
      {AR && <path className="k-ar" d={AR.d} />}
      <path className="k-gemeinden" d={karte.muniBorders} />
      <path className="k-kantonsgrenze" d={karte.cantonBorders} />
      {AR && <path className="k-ar-linie" d={AR.d} />}
      <g className="k-seen">
        {seen.map((l) => (
          <path key={l.name} d={l.d} />
        ))}
      </g>
      <path className="k-landesgrenze" d={karte.countryBorder} />

      <g className="k-text">
        <text className="k-land" x={karte.extras.oesterreich.x} y={karte.extras.oesterreich.y} textAnchor="middle">
          ÖSTERREICH
        </text>
        <text className="k-land" x={karte.extras.liechtenstein.x} y={karte.extras.liechtenstein.y} textAnchor="middle">
          LIECHTENSTEIN
        </text>
        <text className="k-see" x={karte.extras.bodensee.x} y={karte.extras.bodensee.y} textAnchor="middle">
          Bodensee
        </text>
        <text className="k-tal" x={karte.extras.rheintal.x} y={karte.extras.rheintal.y} textAnchor="middle">
          Rheintal
        </text>
      </g>

      <g className="k-saentis" transform={`translate(${karte.extras.saentis.x} ${karte.extras.saentis.y})`}>
        <path d="M-11,8 L0,-12 L11,8 Z" />
        <text x="16" y="6">
          Säntis 2502 m
        </text>
      </g>

      {stadtEtiketten
        .filter(([n]) => staedte[n])
        .map(([n, anker, dx, dy]) => (
          <g className="k-stadt" key={n}>
            <circle cx={staedte[n].x} cy={staedte[n].y} r="4.5" />
            <text x={staedte[n].x + dx} y={staedte[n].y + dy} textAnchor={anker}>
              {n}
            </text>
          </g>
        ))}

      <g className="k-routen">
        {kartenProjekte.map((p, i) => (
          <path key={p.id} id={`route-${p.id}`} data-id={p.id} className="route" style={{ '--d': `${(0.5 + i * 0.35).toFixed(2)}s`, '--L': laenge(heim, p, p.bogen) } as CSSProperties} d={bogen(heim, p, p.bogen)} />
        ))}
      </g>
    </svg>
  )
}
