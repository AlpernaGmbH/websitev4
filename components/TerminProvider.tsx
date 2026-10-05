'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Schliessen } from '@/components/Icons'
import { termin } from '@/lib/content'
import { site } from '@/lib/site'

const Ctx = createContext<{ open: () => void }>({ open: () => {} })

export const useTermin = () => useContext(Ctx)

/** Umschliesst die Seite und rendert den Kalender-Dialog. Calendly wird erst geladen, wenn der Dialog zum ersten Mal aufgeht. */
export function TerminProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [geladen, setGeladen] = useState(false)

  const open = useCallback(() => {
    setGeladen(true)
    const d = ref.current
    if (d && !d.open) d.showModal()
  }, [])

  // Klick auf den abgedunkelten Hintergrund schliesst. Der Dialog selbst hat kein Padding, nur sein Inhalt.
  useEffect(() => {
    const d = ref.current
    if (!d) return
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close()
    }
    d.addEventListener('click', onClick)
    return () => d.removeEventListener('click', onClick)
  }, [])

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <dialog ref={ref} className="dialog dialog--termin" aria-labelledby="termin-titel">
        <div className="dialog__inhalt">
          <div className="dialog__kopf">
            <h2 id="termin-titel">{termin.titel}</h2>
            <button type="button" className="icon-btn" onClick={() => ref.current?.close()} aria-label={termin.schliessen}>
              <Schliessen />
            </button>
          </div>
          {geladen && <iframe className="dialog__rahmen" src={site.calendlyUrl} title="Kalender zur Terminbuchung" loading="lazy" />}
          <p className="dialog__fuss">
            <a href={site.calendlyUrl} target="_blank" rel="noopener noreferrer">
              {termin.neuerTab}
            </a>
          </p>
        </div>
      </dialog>
    </Ctx.Provider>
  )
}

type Variante = 'primary' | 'ghost' | 'light'

/** Link auf den Kalender. Ohne JavaScript öffnet er Calendly im neuen Tab, mit JavaScript den Dialog. */
export function TerminButton({ variant = 'primary', gross, className = '', children }: { variant?: Variante; gross?: boolean; className?: string; children: ReactNode }) {
  const { open } = useTermin()
  return (
    <a
      className={`btn btn--${variant}${gross ? ' btn--gross' : ''} ${className}`.trim()}
      href={site.calendlyUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.preventDefault()
        open()
      }}
    >
      {children}
    </a>
  )
}
