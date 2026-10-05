'use client'

import { useRef } from 'react'
import { Menue, Schliessen } from '@/components/Icons'

/** Menü für schmale Bildschirme. Ein <details>, das sich nach dem Antippen eines Links wieder schliesst. */
export function MobileMenu({ links }: { links: { label: string; href: string }[] }) {
  const ref = useRef<HTMLDetailsElement>(null)
  return (
    <details className="menu" ref={ref}>
      <summary aria-label="Menü öffnen oder schliessen">
        <Menue className="menu__auf" />
        <Schliessen className="menu__zu" />
      </summary>
      <nav className="menu__panel" aria-label="Menü">
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => ref.current?.removeAttribute('open')}>
            {l.label}
          </a>
        ))}
      </nav>
    </details>
  )
}
