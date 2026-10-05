import { belege } from '@/lib/content'

export function Belege() {
  return (
    <section className="belege" aria-label="Fakten zu Alperna">
      <div className="container">
        <ul className="belege__liste">
          {belege.map((b) => (
            <li key={b.label}>
              <strong>{b.wert}</strong>
              <span>{b.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
