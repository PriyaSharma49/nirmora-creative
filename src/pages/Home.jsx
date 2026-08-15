import { useReducedMotion } from 'framer-motion'
import Hero from '../components/Hero.jsx'
import Engine from '../components/Engine.jsx'
import WhyUs from '../components/WhyUs.jsx'
import Services from '../components/Services.jsx'
import ContactSection from '../components/ContactSection.jsx'
import ContentShowcase from '../components/ContentShowcase.jsx'
import Portfolio from '../components/Portfolio.jsx'
import Process from '../components/Process.jsx'
import Testimonials from '../components/Testimonials.jsx'
import FAQ from '../components/FAQ.jsx'
import CTABand from '../components/CTABand.jsx'

export default function Home() {
  const reduced = useReducedMotion()

  return (
    <>
      <Hero />
      {/* Pulls Engine up over the last portion of Hero's pinned scroll stage
          (see Hero.jsx) so it physically covers the hero rather than just
          scrolling past it. Deliberately NOT overflow-hidden here: Engine's
          own six-discipline sequence uses position:sticky internally
          (EngineDesktopSequence), and overflow:hidden on any ancestor of a
          sticky element breaks its stickiness — the sticky div stops
          pinning against the page and instead becomes stuck at scroll
          position 0 inside this wrapper, rendering once and leaving the
          rest of its scroll-height as blank space. The rounded top corner
          is applied directly on Engine's own root section instead (see
          Engine.jsx), which needs no clipping ancestor to render correctly. */}
      <div className={reduced ? 'relative z-10' : 'relative z-10 -mt-[55vh] md:-mt-[85vh]'}>
        <Engine />
      </div>
      <WhyUs />
      <Services />
      <ContentShowcase />
      <Portfolio />
      <Process />
      <Testimonials />
      <FAQ />
      <CTABand />
      <ContactSection />
    </>
  )
}
