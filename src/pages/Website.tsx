import { Header } from '../components/Header'
import { HeroSlider } from '../components/HeroSlider'
import { IntroSection } from '../components/IntroSection'
import { Services } from '../components/Services'
import { LegalUpdates } from '../components/LegalUpdates'
import { Foerderung } from '../components/Foerderung'
import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'

export function Website() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSlider />
        <IntroSection />
        <Services />
        <LegalUpdates />
        <Foerderung />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
