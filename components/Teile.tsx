import type { Teil } from '@/lib/content'

/** Überschrift aus Teilen. Das Akzentwort wird kursiv gesetzt und golden markiert. */
export function Teile({ teile }: { teile: Teil[] }) {
  return (
    <>
      {teile.map((p, i) => (p.em ? <em key={i}>{p.t}</em> : <span key={i}>{p.t}</span>))}
    </>
  )
}
