import { KarteMitListe } from '@/components/KarteMitListe'
import { KarteSvg } from '@/components/KarteSvg'
import { hero } from '@/lib/content'
import karte from '@/lib/karte.json'
import { heim, kartenProjekte } from '@/lib/karte-projekte'

export function Karte() {
  return (
    <KarteMitListe projekte={kartenProjekte} heim={heim} breite={karte.W} hoehe={karte.H} titel={hero.kartenTitel} hinweis={hero.kartenHinweis}>
      <KarteSvg />
    </KarteMitListe>
  )
}
