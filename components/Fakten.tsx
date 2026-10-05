import { fakten } from '@/lib/content'

export function Fakten() {
  return (
    <section className="fakten" aria-label="Fakten zu Alperna">
      <div className="container">
        <ul>
          {fakten.map((f) => (
            <li key={f.label}>
              <strong>{f.wert}</strong>
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
