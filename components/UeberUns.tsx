import Image from 'next/image'
import { Teile } from '@/components/Teile'
import { ueberUns } from '@/lib/content'
import { site } from '@/lib/site'

export function UeberUns() {
  return (
    <section className="section section--tint" id={ueberUns.id} aria-labelledby="ueber-uns-titel">
      <div className="container">
        <header className="section__kopf">
          <p className="eyebrow">{ueberUns.eyebrow}</p>
          <h2 id="ueber-uns-titel">
            <Teile teile={ueberUns.h2} />
          </h2>
          <p className="lead">{ueberUns.lead}</p>
        </header>

        <div className="team">
          {ueberUns.karten.map((k) => {
            const p = site.team[k.id]
            return (
              <article className="person" key={k.id}>
                <Image src={`/images/team/${k.id}.webp`} alt={`${p.name}, Mitgründer der Alperna GmbH`} width={880} height={1100} sizes="(min-width: 960px) 200px, 40vw" />
                <div>
                  <h3>{p.name}</h3>
                  <p className="person__rolle">{k.rolle}</p>
                  <p>{k.text}</p>
                  <p className="person__links">
                    <a href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} auf LinkedIn`}>
                      LinkedIn
                    </a>
                    <a href={p.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} auf Instagram`}>
                      Instagram
                    </a>
                  </p>
                </div>
              </article>
            )
          })}
        </div>

        <aside className="jung">
          <h3>{ueberUns.jungTitel}</h3>
          <p>{ueberUns.jungText}</p>
        </aside>

        <div className="einblicke">
          <h3>{ueberUns.einblickeTitel}</h3>
          <ul>
            {ueberUns.einblicke.map((b) => (
              <li key={b.src}>
                <Image src={b.src} alt={b.alt} width={1200} height={800} sizes="(min-width: 960px) 270px, 46vw" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
