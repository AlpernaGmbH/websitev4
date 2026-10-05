import Image from 'next/image'
import { TerminButton } from '@/components/TerminProvider'
import { ueberUns } from '@/lib/content'
import { site } from '@/lib/site'

export function UeberUns() {
  return (
    <section className="sektion sektion--sand" id={ueberUns.id} aria-labelledby="ueber-uns-titel">
      <div className="container">
        <header className="sektion__kopf">
          <p className="eyebrow">{ueberUns.eyebrow}</p>
          <h2 id="ueber-uns-titel">{ueberUns.h2}</h2>
        </header>

        <div className="brief-raster">
          <div className="portraits">
            {(['andrej', 'leander'] as const).map((id) => (
              <figure className="portrait" key={id}>
                <Image src={`/images/team/${id}.webp`} alt={`${site.team[id].name}, Mitgründer der Alperna GmbH`} width={880} height={1100} sizes="(min-width: 960px) 190px, 44vw" />
                <figcaption>
                  {site.team[id].name}
                  <small>{ueberUns.rollen[id].rolle}</small>
                  <span className="portrait__links">
                    <a href={site.team[id].linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${site.team[id].name} auf LinkedIn`}>
                      LinkedIn
                    </a>
                    <a href={site.team[id].instagram} target="_blank" rel="noopener noreferrer" aria-label={`${site.team[id].name} auf Instagram`}>
                      Instagram
                    </a>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <article className="brief">
            <div className="brief__kopf">
              <span className="logo">
                <span className="logo__marke">
                  <Image src="/images/brand/alperna-mark.webp" alt="" width={21} height={21} />
                </span>
                {site.legalName}
              </span>
              <span>
                {site.address.street} · {site.address.zip} {site.address.city} · {ueberUns.briefOrt}
              </span>
            </div>
            <h3>{ueberUns.anrede}</h3>
            {ueberUns.absaetze.map((a) => (
              <p key={a}>{a}</p>
            ))}
            <p className="brief__gruss">{ueberUns.gruss}</p>
            <div className="brief__unterschrift" aria-hidden="true">
              {ueberUns.unterschrift}
            </div>
            <p className="brief__signatur">{ueberUns.signatur}</p>
            <div className="brief__ps">
              <p>
                <b>P.S.</b> {ueberUns.ps}
              </p>
              <a className="btn btn--ghost btn--kompakt" href="#check">
                {ueberUns.psButton}
              </a>
            </div>
          </article>
        </div>

        <div className="einblicke">
          <h3>{ueberUns.einblickeTitel}</h3>
          <ul>
            {ueberUns.einblicke.map((b) => (
              <li key={b.src}>
                <Image src={b.src} alt={b.alt} width={1200} height={800} sizes="(min-width: 960px) 280px, 46vw" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
