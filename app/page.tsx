import { Ablauf } from '@/components/Ablauf'
import { Belege } from '@/components/Belege'
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
        <Belege />
        <MarketingCheck />
        <Leistungen />
        <Ablauf />
        <Referenzen />
        <UeberUns />
        <Faq />
        <Kontakt />
      </main>
      <Footer />
    </>
  )
}
