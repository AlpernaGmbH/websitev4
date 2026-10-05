import { Ablauf } from '@/components/Ablauf'
import { Fakten } from '@/components/Fakten'
import { Faq } from '@/components/Faq'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Kontakt } from '@/components/Kontakt'
import { Leistungen } from '@/components/Leistungen'
import { MarketingCheck } from '@/components/MarketingCheck'
import { Referenzen } from '@/components/Referenzen'
import { UeberUns } from '@/components/UeberUns'

export default function Startseite() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Fakten />
        <MarketingCheck />
        <Leistungen />
        <Referenzen />
        <Ablauf />
        <UeberUns />
        <Faq />
        <Kontakt />
      </main>
      <Footer />
    </>
  )
}
