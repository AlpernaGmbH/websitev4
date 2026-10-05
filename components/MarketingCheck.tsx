'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CheckErgebnisAnsicht } from '@/components/CheckErgebnis'
import { Haken, Pfeil, Schliessen } from '@/components/Icons'
import { Teile } from '@/components/Teile'
import type { CheckErgebnis } from '@/lib/check'
import { check as t } from '@/lib/content'
import { EMAIL } from '@/lib/schemas'

type Phase = 'form' | 'popup' | 'ergebnis'
type Analyse = { status: 'laeuft' } | { status: 'fertig'; ergebnis: CheckErgebnis } | { status: 'fehler'; meldung: string }
type Eingabe = { company: string; city: string; industry: string; branche: string; website: string }

/** Fehler mit einem Text, den der Besucher lesen darf. */
class MeldungFehler extends Error {}

const protokoll = (w: string) => (/^https?:\/\//i.test(w) ? w : `https://${w}`)
function gueltigeAdresse(w: string) {
  try {
    return new URL(protokoll(w.trim())).hostname.includes('.')
  } catch {
    return false
  }
}

const f = t.formular
const p = t.popup

export function MarketingCheck() {
  const [phase, setPhase] = useState<Phase>('form')
  const [ungueltig, setUngueltig] = useState<string[]>([])
  const [meldung, setMeldung] = useState('')
  const [analyse, setAnalyse] = useState<Analyse | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [eingabe, setEingabe] = useState<Eingabe | null>(null)
  const [schritt, setSchritt] = useState(0)
  const [popupFehler, setPopupFehler] = useState<string[]>([])

  const abbruch = useRef<AbortController | null>(null)
  const leadGesendet = useRef(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const phaseRef = useRef<Phase>('form')
  phaseRef.current = phase

  // Popup öffnen und schliessen
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (phase === 'popup') {
      if (!d.open) d.showModal()
      // Das Feld ist beim Einbau des Dialogs unsichtbar, `autoFocus` greift darum nicht. Daher von Hand.
      d.querySelector<HTMLInputElement>('#c-email')?.focus()
    } else if (d.open) d.close()
  }, [phase])

  // Fortschrittsanzeige. Die Schritte sind ein Mass für die Wartezeit, keine echten Meldungen der Analyse.
  const laeuft = analyse?.status === 'laeuft'
  useEffect(() => {
    if (!laeuft) return
    setSchritt(0)
    const id = setInterval(() => setSchritt((s) => Math.min(s + 1, p.schritte.length - 1)), 3500)
    return () => clearInterval(id)
  }, [laeuft])

  function leadPayload(status: 'ergebnis' | 'fehler' | 'abgebrochen', ergebnis?: CheckErgebnis) {
    if (!email || !eingabe) return null
    const schwaechste = ergebnis
      ? [...ergebnis.categories]
          .filter((k) => k.weight > 0)
          .sort((a, b) => a.score - b.score)
          .slice(0, 3)
          .map((k) => `${k.title} ${Math.round(k.score * 100)} %`)
      : []
    return {
      email,
      einwilligung: true,
      company: eingabe.company,
      website: eingabe.website,
      branche: eingabe.branche,
      ort: eingabe.city,
      status,
      ...(ergebnis ? { score: ergebnis.score } : {}),
      befunde: schwaechste,
      ...(ergebnis?.einschaetzung ? { einschaetzung: ergebnis.einschaetzung.zusammenfassung } : {}),
    }
  }

  // Ergebnis zeigen, sobald E-Mail und Analyse da sind. Der Lead geht genau einmal raus.
  useEffect(() => {
    if (!email || !analyse || analyse.status === 'laeuft') return
    if (!leadGesendet.current) {
      leadGesendet.current = true
      const payload = leadPayload(analyse.status === 'fertig' ? 'ergebnis' : 'fehler', analyse.status === 'fertig' ? analyse.ergebnis : undefined)
      if (payload) {
        fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {})
      }
    }
    if (analyse.status === 'fertig') {
      setPhase('ergebnis')
    } else {
      setMeldung(analyse.meldung)
      setAnalyse(null)
      setPhase('form')
    }
    // leadPayload liest nur Zustand, der hier schon in den Abhängigkeiten steckt
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, analyse])

  // Verlässt jemand die Seite mit eingegebener E-Mail vor dem Ergebnis, geht der Lead als «abgebrochen» raus.
  useEffect(() => {
    const h = () => {
      if (leadGesendet.current || phaseRef.current !== 'popup') return
      const payload = leadPayload('abgebrochen')
      if (!payload) return
      leadGesendet.current = true
      navigator.sendBeacon('/api/lead', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    }
    window.addEventListener('pagehide', h)
    return () => window.removeEventListener('pagehide', h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, eingabe])

  function abbrechen() {
    abbruch.current?.abort()
    abbruch.current = null
    setAnalyse(null)
    setEmail(null)
    setPopupFehler([])
    setPhase('form')
  }

  function zuruecksetzen() {
    abbrechen()
    setMeldung('')
    setEingabe(null)
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const form = ev.currentTarget
    const d = new FormData(form)
    const val = (k: string) => String(d.get(k) ?? '').trim()
    const neu: string[] = []
    if (!val('company')) neu.push('company')
    if (!val('industry')) neu.push('industry')
    if (!val('website') || !gueltigeAdresse(val('website'))) neu.push('website')
    setUngueltig(neu)
    if (neu.length) {
      setMeldung(f.pflicht)
      form.querySelector<HTMLElement>(`[name="${neu[0]}"]`)?.focus()
      return
    }

    const socials: Record<string, { url?: string; freq?: string }> = {}
    for (const [n] of t.netze) {
      const url = val(n)
      const freq = val(`${n}_freq`)
      if (url || freq) socials[n] = { url: url || undefined, freq: freq || undefined }
    }
    const branche = t.branchen.find(([v]) => v === val('industry'))?.[1] ?? val('industry')
    const ein: Eingabe = { company: val('company'), city: val('city'), industry: val('industry'), branche, website: val('website') }

    // Die Analyse startet sofort. Während der Besucher seine E-Mail-Adresse eingibt, läuft sie im Hintergrund.
    abbruch.current?.abort()
    const ctrl = new AbortController()
    abbruch.current = ctrl
    leadGesendet.current = false
    setMeldung('')
    setEingabe(ein)
    setEmail(null)
    setPopupFehler([])
    setAnalyse({ status: 'laeuft' })
    setPhase('popup')

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: ein.company, city: ein.city, industry: ein.industry, website: ein.website, socials }),
        signal: ctrl.signal,
      })
      const json = await res.json().catch(() => null)
      if (res.status === 429) throw new MeldungFehler(t.fehler.zuOft)
      if (!res.ok || !json?.ok) throw new MeldungFehler(typeof json?.meldung === 'string' ? json.meldung : t.fehler.allgemein)
      setAnalyse({ status: 'fertig', ergebnis: json.ergebnis as CheckErgebnis })
    } catch (err) {
      if (ctrl.signal.aborted) return
      setAnalyse({ status: 'fehler', meldung: err instanceof MeldungFehler ? err.message : t.fehler.allgemein })
    }
  }

  function onEmail(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const d = new FormData(ev.currentTarget)
    const adresse = String(d.get('email') ?? '').trim()
    const neu: string[] = []
    if (!EMAIL.test(adresse)) neu.push('email')
    if (d.get('einwilligung') !== 'on') neu.push('einwilligung')
    setPopupFehler(neu)
    if (neu.length) {
      ev.currentTarget.querySelector<HTMLElement>(`[name="${neu[0]}"]`)?.focus()
      return
    }
    setEmail(adresse)
  }

  const ergebnis = phase === 'ergebnis' && analyse?.status === 'fertig' ? analyse.ergebnis : null
  const invalid = (n: string) => ungueltig.includes(n)
  const popupBad = (n: string) => popupFehler.includes(n)
  // Schlägt die Analyse fehl, bevor eine E-Mail-Adresse da ist, ersetzt die Meldung das Eingabefeld im Popup.
  const popupMeldung = analyse?.status === 'fehler' && !email ? analyse.meldung : null

  return (
    <section className={`check${ergebnis ? ' check--ergebnis' : ''}`} id={t.id} aria-labelledby="check-titel">
      <div className="container check__raster">
        <div className="check__text">
          <p className="eyebrow eyebrow--hell">{t.eyebrow}</p>
          <h2 id="check-titel">
            <Teile teile={t.h2} />
          </h2>
          <p className="lead">{t.lead}</p>
          <ul className="haken-liste haken-liste--hell">
            {t.punkte.map((x) => (
              <li key={x}>
                <Haken />
                {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="check__karte">
          {ergebnis ? (
            <CheckErgebnisAnsicht e={ergebnis} onNochmal={zuruecksetzen} />
          ) : (
            <form className="form" onSubmit={onSubmit} noValidate aria-describedby="check-status" data-testid="check-formular">
              <fieldset>
                <legend>{f.betrieb}</legend>
                <div className="feld" data-invalid={invalid('company')}>
                  <label htmlFor="c-company">{f.firma}</label>
                  <input id="c-company" type="text" name="company" autoComplete="organization" required aria-invalid={invalid('company')} />
                </div>
                <div className="form__zeile">
                  <div className="feld">
                    <label htmlFor="c-city">{f.ort}</label>
                    <input id="c-city" type="text" name="city" autoComplete="address-level2" />
                  </div>
                  <div className="feld" data-invalid={invalid('industry')}>
                    <label htmlFor="c-industry">{f.branche}</label>
                    <select id="c-industry" name="industry" defaultValue="" required aria-invalid={invalid('industry')}>
                      <option value="" disabled>
                        {f.brancheWaehlen}
                      </option>
                      {t.branchen.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="feld" data-invalid={invalid('website')}>
                  <label htmlFor="c-website">{f.website}</label>
                  <input id="c-website" type="text" inputMode="url" name="website" placeholder={f.websiteHinweis} autoComplete="url" required aria-invalid={invalid('website')} />
                </div>
              </fieldset>

              <details className="weitere-angaben">
                <summary>
                  {f.social} <small>({f.optional})</small>
                </summary>
                <p className="hinweis">{f.socialHinweis}</p>
                <div className="netze">
                  {t.netze.map(([n, l]) => (
                    <div className="netz" key={n}>
                      <div className="feld">
                        <label htmlFor={`c-${n}`}>{l}</label>
                        <input id={`c-${n}`} type="text" name={n} placeholder={f.kanalAdresse} autoComplete="off" />
                      </div>
                      <div className="feld">
                        <label htmlFor={`c-${n}-freq`}>{f.haeufigkeit}</label>
                        <select id={`c-${n}-freq`} name={`${n}_freq`} defaultValue="">
                          <option value="">{f.haeufigkeitWaehlen}</option>
                          {t.haeufigkeit.map(([v, hl]) => (
                            <option key={v} value={v}>
                              {hl}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </details>

              <div className="form__senden">
                <button className="btn btn--primary btn--gross" type="submit">
                  {f.start}
                  <Pfeil />
                </button>
                <p className="form__status" id="check-status" role="status" aria-live="polite" data-state={meldung ? 'fehler' : 'bereit'}>
                  {meldung || f.hinweis}
                </p>
              </div>
              {meldung && meldung !== f.pflicht && (
                <p className="hinweis">
                  {t.fehler.direkt}{' '}
                  <a href="#kontakt" className="link">
                    Zum Kontakt
                  </a>
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      <dialog ref={dialog} className="dialog dialog--check" aria-labelledby="popup-titel" onClose={() => phaseRef.current === 'popup' && abbrechen()}>
        <form className="dialog__inhalt" onSubmit={onEmail} noValidate>
          <div className="dialog__kopf">
            <h2 id="popup-titel">{popupMeldung ? p.fehlerTitel : p.titel}</h2>
            <button type="button" className="icon-btn" onClick={abbrechen} aria-label={p.abbrechen}>
              <Schliessen />
            </button>
          </div>

          {popupMeldung ? (
            <>
              <p className="form__status" role="alert" data-state="fehler">
                {popupMeldung}
              </p>
              <p className="hinweis">{t.fehler.direkt}</p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  abbrechen()
                  setMeldung(popupMeldung)
                }}
              >
                {p.schliessen}
              </button>
            </>
          ) : (
            <>
              {!email ? (
                <>
                  <p>{p.lead}</p>
                  <div className="feld" data-invalid={popupBad('email')}>
                    <label htmlFor="c-email">{p.email}</label>
                    <input id="c-email" name="email" type="email" autoComplete="email" placeholder={p.emailPlatzhalter} autoFocus aria-invalid={popupBad('email')} aria-describedby={popupBad('email') ? 'c-email-fehler' : undefined} />
                    {popupBad('email') && (
                      <p className="feld__fehler" id="c-email-fehler">
                        {p.emailFehler}
                      </p>
                    )}
                  </div>
                  <div className="feld feld--check" data-invalid={popupBad('einwilligung')}>
                    <input id="c-einwilligung" name="einwilligung" type="checkbox" aria-invalid={popupBad('einwilligung')} aria-describedby={popupBad('einwilligung') ? 'c-einwilligung-fehler' : undefined} />
                    <label htmlFor="c-einwilligung">
                      {p.einwilligung} (
                      <Link href="/datenschutz" target="_blank">
                        {p.einwilligungLink}
                      </Link>
                      )
                    </label>
                    {popupBad('einwilligung') && (
                      <p className="feld__fehler" id="c-einwilligung-fehler">
                        {p.einwilligungFehler}
                      </p>
                    )}
                  </div>
                  <button className="btn btn--primary btn--gross" type="submit">
                    {p.button}
                    <Pfeil />
                  </button>
                </>
              ) : (
                <p className="dialog__warten" role="status">
                  {p.warten}
                </p>
              )}

              <div className="fortschritt" aria-live="polite">
                <p className="fortschritt__titel">{analyse?.status === 'fertig' ? p.fertig : p.laeuftTitel}</p>
                <ol>
                  {p.schritte.map((s, i) => (
                    <li key={s} data-state={analyse?.status === 'fertig' || i < schritt ? 'fertig' : i === schritt ? 'jetzt' : 'offen'}>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </form>
      </dialog>
    </section>
  )
}
