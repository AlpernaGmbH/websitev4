'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { kontakt } from '@/lib/content'
import { EMAIL } from '@/lib/schemas'

const f = kontakt.formular
type Status = 'bereit' | 'sendet' | 'erfolg' | 'fehler'

export function KontaktFormular() {
  const [status, setStatus] = useState<Status>('bereit')
  const [ungueltig, setUngueltig] = useState<string[]>([])

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const form = ev.currentTarget
    const d = new FormData(form)
    const val = (k: string) => String(d.get(k) ?? '').trim()
    const neu: string[] = []
    if (!val('name')) neu.push('name')
    if (!EMAIL.test(val('email'))) neu.push('email')
    if (!val('nachricht')) neu.push('nachricht')
    if (d.get('einwilligung') !== 'on') neu.push('einwilligung')
    setUngueltig(neu)
    if (neu.length) {
      form.querySelector<HTMLElement>(`[name="${neu[0]}"]`)?.focus()
      return
    }
    setStatus('sendet')
    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: val('name'),
          firma: val('firma'),
          email: val('email'),
          telefon: val('telefon'),
          nachricht: val('nachricht'),
          website: val('website'),
          einwilligung: true,
        }),
      })
      if (!res.ok) throw new Error('versand')
      setStatus('erfolg')
      form.reset()
    } catch {
      setStatus('fehler')
    }
  }

  const bad = (n: string) => ungueltig.includes(n)

  if (status === 'erfolg') {
    return (
      <p className="form__erfolg" role="status">
        {f.erfolg}
      </p>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="feld" data-invalid={bad('name')}>
        <label htmlFor="k-name">{f.name.label}</label>
        <input id="k-name" name="name" type="text" autoComplete="name" placeholder={f.name.platzhalter} required aria-invalid={bad('name')} aria-describedby={bad('name') ? 'k-name-fehler' : undefined} />
        {bad('name') && (
          <p className="feld__fehler" id="k-name-fehler">
            {f.name.fehler}
          </p>
        )}
      </div>

      <div className="form__zeile">
        <div className="feld">
          <label htmlFor="k-firma">{f.firma.label}</label>
          <input id="k-firma" name="firma" type="text" autoComplete="organization" placeholder={f.firma.platzhalter} />
        </div>
        <div className="feld" data-invalid={bad('email')}>
          <label htmlFor="k-email">{f.email.label}</label>
          <input id="k-email" name="email" type="email" autoComplete="email" placeholder={f.email.platzhalter} required aria-invalid={bad('email')} aria-describedby={bad('email') ? 'k-email-fehler' : undefined} />
          {bad('email') && (
            <p className="feld__fehler" id="k-email-fehler">
              {f.email.fehler}
            </p>
          )}
        </div>
      </div>

      <div className="feld">
        <label htmlFor="k-telefon">
          {f.telefon.label} <small>({f.telefon.hinweis})</small>
        </label>
        <input id="k-telefon" name="telefon" type="tel" autoComplete="tel" placeholder={f.telefon.platzhalter} />
      </div>

      <div className="feld" data-invalid={bad('nachricht')}>
        <label htmlFor="k-nachricht">{f.nachricht.label}</label>
        <textarea id="k-nachricht" name="nachricht" rows={5} placeholder={f.nachricht.platzhalter} required aria-invalid={bad('nachricht')} aria-describedby={bad('nachricht') ? 'k-nachricht-fehler' : undefined} />
        {bad('nachricht') && (
          <p className="feld__fehler" id="k-nachricht-fehler">
            {f.nachricht.fehler}
          </p>
        )}
      </div>

      {/* Honigtopf: für Menschen unsichtbar, Skripte füllen ihn aus. */}
      <div className="honigtopf" aria-hidden="true">
        <label htmlFor="k-website">Website</label>
        <input id="k-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="feld feld--check" data-invalid={bad('einwilligung')}>
        <input id="k-einwilligung" name="einwilligung" type="checkbox" aria-invalid={bad('einwilligung')} aria-describedby={bad('einwilligung') ? 'k-einwilligung-fehler' : undefined} />
        <label htmlFor="k-einwilligung">
          {f.einwilligung} (<Link href="/datenschutz">Datenschutz</Link>)
        </label>
        {bad('einwilligung') && (
          <p className="feld__fehler" id="k-einwilligung-fehler">
            {f.einwilligungFehler}
          </p>
        )}
      </div>

      <div className="form__senden">
        <button className="btn btn--primary" type="submit" disabled={status === 'sendet'}>
          {status === 'sendet' ? f.senden : f.button}
        </button>
        <p className="form__status" role="status" aria-live="polite" data-state={status === 'fehler' ? 'fehler' : 'bereit'}>
          {status === 'fehler' ? f.fehlerVersand : ''}
        </p>
      </div>
    </form>
  )
}
