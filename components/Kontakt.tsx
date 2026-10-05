import { Chat, Kalender, Mail, Pfeil, Pin } from '@/components/Icons'
import { KontaktFormular } from '@/components/KontaktFormular'
import { TerminButton } from '@/components/TerminProvider'
import { kontakt } from '@/lib/content'
import { site } from '@/lib/site'

const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappText)}`
const adresse = `${site.legalName}, ${site.address.street}, ${site.address.zip} ${site.address.city}`
const karteUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresse)}`

export function Kontakt() {
  return (
    <section className="sektion sektion--sand" id={kontakt.id} aria-labelledby="kontakt-titel">
      <div className="container kontakt">
        <div className="kontakt__links">
          <p className="eyebrow">{kontakt.eyebrow}</p>
          <h2 id="kontakt-titel">{kontakt.h2}</h2>
          <p className="lead">{kontakt.lead}</p>

          <ul className="wege">
            <li className="weg weg--haupt">
              <Kalender />
              <div>
                <strong>{kontakt.termin}</strong>
                <span>{kontakt.terminText}</span>
              </div>
              <TerminButton variant="primary" className="btn--kompakt">
                {kontakt.termin}
                <Pfeil />
              </TerminButton>
            </li>
            <li className="weg">
              <Chat />
              <div>
                <strong>WhatsApp</strong>
                <span>{kontakt.whatsappText}</span>
              </div>
              <a className="btn btn--ghost btn--kompakt" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                {kontakt.whatsapp}
              </a>
            </li>
            <li className="weg">
              <Mail />
              <div>
                <strong>{site.email}</strong>
                <span>{kontakt.mailText}</span>
              </div>
              <a className="btn btn--ghost btn--kompakt" href={`mailto:${site.email}`}>
                {kontakt.mail}
              </a>
            </li>
            <li className="weg">
              <Pin />
              <div>
                <strong>{kontakt.adresse}</strong>
                <span>
                  {site.address.street}, {site.address.zip} {site.address.city} {site.address.canton}
                </span>
              </div>
              <a className="btn btn--ghost btn--kompakt" href={karteUrl} target="_blank" rel="noopener noreferrer">
                Auf der Karte
              </a>
            </li>
          </ul>
        </div>

        <div className="kontakt__formular">
          <h3>{kontakt.formularTitel}</h3>
          <KontaktFormular />
        </div>
      </div>
    </section>
  )
}
