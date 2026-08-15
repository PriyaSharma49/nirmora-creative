import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { SERVICES } from '../data/services.js'

const EASE = [0.22, 1, 0.36, 1]
const GOLD = '#C58A2A'
const INK = '#252525'
const MUTED = '#68665F'
const RULE = 'rgba(37,37,37,0.1)'

function useReveal(amount = 0.3) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount })
  return [ref, inView]
}

/* ============================================================================
   01 — HERO. No image, no visual standing in for one. Full-width
   typography: eyebrow, a "01" marker, the headline as the dominant
   element, supporting copy, a discipline label, and a thin rule closing
   the composition — the grid and type carry the page, not a second column.
   ============================================================================ */
function AboutHero() {
  const reduced = useReducedMotion()
  return (
    <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-24" style={{ background: '#F7F4EC' }}>
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10">
        <motion.div
          className="flex items-center gap-2 text-[12.5px] mb-8"
          style={{ color: 'rgba(37,37,37,0.45)' }}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Link to="/" className="transition-colors hover:text-[#C58A2A]">Home</Link>
          <span>/</span>
          <span style={{ color: 'rgba(37,37,37,0.7)' }}>About</span>
        </motion.div>

        <div className="flex items-baseline gap-4">
          <motion.span
            className="font-mono text-[13px] shrink-0"
            style={{ color: GOLD }}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.04 }}
          >
            01
          </motion.span>
          <motion.div
            className="eyebrow"
            style={{ color: GOLD }}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.06 }}
          >
            About Nirmora
          </motion.div>
        </div>

        <motion.h1
          className="mt-5 font-display font-bold leading-[1.08] tracking-tight"
          style={{ color: INK, fontSize: 'clamp(38px, 6vw, 76px)', maxWidth: '78%' }}
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.12 }}
        >
          We build systems that make businesses <span style={{ color: GOLD }}>grow.</span>
        </motion.h1>

        <motion.p
          className="mt-8 max-w-[520px] text-[15.5px] md:text-[17px] leading-[1.75]"
          style={{ color: MUTED }}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
        >
          Nirmora Creative brings strategy, creative, technology, performance and data into
          one connected growth system — built for brands that want more than isolated
          marketing.
        </motion.p>

        <motion.p
          className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: 'rgba(37,37,37,0.4)' }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.32 }}
        >
          Creative · Strategy · Technology · Growth
        </motion.p>

        <motion.div
          className="mt-12 h-px w-full origin-left"
          style={{ background: RULE }}
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
        />
      </div>
    </section>
  )
}

/* ============================================================================
   BIG STATEMENT — a short typographic transition directly beneath the
   hero, distinct from Who We Are below it: one large line, one line of
   support, nothing else.
   ============================================================================ */
function BigStatement() {
  const [ref, inView] = useReveal(0.4)
  return (
    <section ref={ref} className="relative py-16 md:py-20" style={{ background: '#F7F4EC' }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-10 items-baseline">
        <motion.h2
          className="font-display font-bold leading-[1.15]"
          style={{ color: INK, fontSize: 'clamp(26px, 3.2vw, 40px)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          Different disciplines. <span style={{ color: GOLD }}>One direction.</span>
        </motion.h2>
        <motion.p
          className="text-[14.5px] leading-relaxed"
          style={{ color: MUTED }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
        >
          Every part of a Nirmora engagement is built to inform the next one, not operate on
          its own.
        </motion.p>
      </div>
    </section>
  )
}

/* ============================================================================
   02 — WHO WE ARE. Unchanged from the prior editorial pass — already
   text-led, already consistent with the real service list.
   ============================================================================ */
const CAPABILITIES = SERVICES.map((s) => s.title.split(' ')[0].toUpperCase())

function WhoWeAre() {
  const [ref, inView] = useReveal(0.35)
  return (
    <section id="who-we-are" ref={ref} className="relative py-20 md:py-28" style={{ background: '#FDFBF6' }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
        <div>
          <motion.div
            className="eyebrow"
            style={{ color: GOLD }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
          >
            02 — Who We Are
          </motion.div>
          <motion.h2
            className="font-display font-bold leading-[1.16]"
            style={{ color: INK, fontSize: 'clamp(28px, 3.2vw, 42px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          >
            Nirmora sits at the intersection of creativity, technology and growth.
          </motion.h2>
        </div>

        <div>
          <motion.p
            className="max-w-[560px] text-[16px] leading-[1.8]"
            style={{ color: MUTED }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.14 }}
          >
            Nirmora Creative is a growth-focused digital partner built around connected
            thinking. We bring together the disciplines businesses often manage separately —
            influencer, social, performance, website and CRM — so every part works toward the
            same outcome.
          </motion.p>
          <motion.p
            className="mt-4 text-[15px] font-semibold"
            style={{ color: INK }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
          >
            Less fragmentation. More momentum.
          </motion.p>

          <motion.p
            className="mt-10 pt-8 text-[12px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: INK, borderTop: `1px solid ${RULE}` }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
          >
            {CAPABILITIES.join('  ·  ')}
          </motion.p>
        </div>
      </div>
    </section>
  )
}

/* ============================================================================
   03 — HOW WE THINK. Four principles, one continuous editorial list —
   thin dividers, no cards, no background boxes.
   ============================================================================ */
const BELIEFS = [
  { n: '01', title: 'Think Beyond the Brief', desc: 'The stated task is a starting point, not the whole problem.' },
  { n: '02', title: 'Design With Purpose', desc: 'Every visual and technical decision should serve the business outcome.' },
  { n: '03', title: 'Build for Momentum', desc: 'Work that keeps compounding after launch, not work that ends at launch.' },
  { n: '04', title: 'Measure What Matters', desc: 'Track the signals that actually change decisions, not vanity numbers.' },
]

function BeliefRow({ b, index, active, onActivate, total }) {
  const isActive = active === index
  return (
    <div
      className="cursor-pointer py-6 outline-none"
      style={{ borderBottom: index === total - 1 ? 'none' : `1px solid ${RULE}` }}
      onMouseEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      onClick={() => onActivate(index)}
      tabIndex={0}
      role="button"
      aria-expanded={isActive}
    >
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[12px] transition-colors duration-300" style={{ color: isActive ? GOLD : MUTED }}>
          {b.n}
        </span>
        <h4
          className="font-display text-[20px] md:text-[24px] font-semibold transition-transform duration-300"
          style={{ color: INK, transform: isActive ? 'translateX(6px)' : 'translateX(0)' }}
        >
          {b.title}
        </h4>
      </div>
      <div className="grid transition-[grid-template-rows] duration-400 ease-out" style={{ gridTemplateRows: isActive ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <p className="mt-2 max-w-[440px] pl-[38px] text-[14px] leading-relaxed" style={{ color: MUTED }}>
            {b.desc}
          </p>
        </div>
      </div>
    </div>
  )
}

function HowWeThink() {
  const [ref, inView] = useReveal(0.3)
  const [active, setActive] = useState(0)
  return (
    <section ref={ref} className="relative py-20 md:py-28" style={{ background: '#FDFBF6' }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="max-w-[560px]">
          <motion.div className="eyebrow" style={{ color: GOLD }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease: EASE }}>
            03 — How We Think
          </motion.div>
          <motion.h2
            className="font-display font-bold leading-[1.18]"
            style={{ color: INK, fontSize: 'clamp(26px, 3vw, 38px)' }}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
          >
            Good growth doesn&apos;t come from isolated tactics.
          </motion.h2>
        </div>

        <motion.div
          className="mt-10 max-w-[640px]"
          style={{ borderTop: `1px solid ${RULE}` }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
        >
          {BELIEFS.map((b, i) => (
            <BeliefRow key={b.n} b={b} index={i} active={active} onActivate={setActive} total={BELIEFS.length} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================================
   04 — THE SYSTEM. Explains the philosophy behind the Nirmora Engine in
   words, not a diagram — the real 5 services flowing into one line, no
   nodes, no circles, no orbit. The Engine gets one text link, never its
   own visual here.
   ============================================================================ */
function TheSystem() {
  const [ref, inView] = useReveal(0.3)
  return (
    <section ref={ref} className="relative py-20 md:py-28" style={{ background: '#F7F4EC' }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <motion.div className="eyebrow" style={{ color: GOLD }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease: EASE }}>
          04 — The System
        </motion.div>
        <motion.h2
          className="mt-3 font-display font-bold leading-[1.16] max-w-[640px]"
          style={{ color: INK, fontSize: 'clamp(24px, 2.8vw, 34px)' }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
        >
          Strategy shouldn&apos;t sit apart from creative. Creative shouldn&apos;t sit apart from
          technology. Everything moves in the same direction.
        </motion.h2>

        <motion.div
          className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-3"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE, delay: 0.18 }}
        >
          {CAPABILITIES.map((c, i) => (
            <span key={c} className="flex items-baseline gap-3">
              <span className="font-display font-semibold" style={{ color: INK, fontSize: 'clamp(20px, 2.6vw, 30px)' }}>{c}</span>
              {i < CAPABILITIES.length - 1 && <ArrowRight size={16} style={{ color: GOLD }} />}
            </span>
          ))}
        </motion.div>

        <motion.p
          className="mt-8 max-w-[560px] text-[15px] leading-relaxed"
          style={{ color: MUTED }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.26 }}
        >
          Each discipline informs the next instead of operating in isolation. That connected
          model — not a separate service catalogue — is what we call the Nirmora Engine.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.32 }}
        >
          <Link to="/#engine" className="group mt-3 inline-flex items-center gap-2 text-[13.5px] font-semibold" style={{ color: INK }}>
            Explore the Engine
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: GOLD }} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================================
   05 — OUR APPROACH. A vertical progression, typography-led — each stage
   highlights as it scrolls into view (its own useInView, not a shared
   scrubbing timeline), never a giant illustrated timeline.
   ============================================================================ */
const APPROACH = [
  { n: '01', title: 'Understand', desc: 'The business, the market and the real goal behind the request.' },
  { n: '02', title: 'Define', desc: 'What success actually looks like, and how it will be measured.' },
  { n: '03', title: 'Create', desc: 'Strategy and creative direction built around that definition.' },
  { n: '04', title: 'Build', desc: 'The system, campaign or experience, built to the real spec.' },
  { n: '05', title: 'Activate', desc: 'Launch across the channels that matter to that business.' },
  { n: '06', title: 'Optimise', desc: 'Real performance data feeding the next decision.' },
]

function ApproachRow({ a }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.6 })
  const reduced = useReducedMotion()
  const active = reduced || inView
  return (
    <div ref={ref} className="flex items-start gap-5 py-5 transition-opacity duration-500" style={{ opacity: active ? 1 : 0.38 }}>
      <span className="font-mono text-[12px] shrink-0 pt-1.5 transition-colors duration-500" style={{ color: active ? GOLD : MUTED }}>
        {a.n}
      </span>
      <div>
        <h4 className="font-display font-semibold transition-transform duration-500" style={{ color: INK, fontSize: 'clamp(19px, 2.2vw, 25px)', transform: active ? 'translateX(0)' : 'translateX(-6px)' }}>
          {a.title}
        </h4>
        <p className="mt-1.5 max-w-[420px] text-[13.5px] leading-relaxed" style={{ color: MUTED }}>
          {a.desc}
        </p>
      </div>
    </div>
  )
}

function HowWeWork() {
  const [ref, inView] = useReveal(0.25)
  return (
    <section ref={ref} className="relative py-20 md:py-28" style={{ background: '#FDFBF6' }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
        <div>
          <motion.div className="eyebrow" style={{ color: GOLD }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease: EASE }}>
            05 — How We Work
          </motion.div>
          <motion.h2
            className="mt-3 font-display font-bold leading-[1.18] max-w-[380px]"
            style={{ color: INK, fontSize: 'clamp(26px, 3vw, 38px)' }}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
          >
            The same process, every time.
          </motion.h2>
        </div>

        <div style={{ borderTop: `1px solid ${RULE}` }}>
          {APPROACH.map((a) => (
            <ApproachRow key={a.n} a={a} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================================
   06 — WHY NIRMORA. A different rhythm from the earlier editorial lists on
   purpose — a 2-column typographic grid rather than a vertical accordion,
   so the page doesn't repeat the same section shape three times in a row.
   ============================================================================ */
const DIFFERENTIATORS = [
  { title: 'Connected Disciplines', desc: 'Different capabilities working as one system, not separate vendors.' },
  { title: 'Strategic Creativity', desc: 'Creative decisions grounded in business thinking, not decoration.' },
  { title: 'Built for Momentum', desc: 'Work designed to keep improving after launch, not disappear after it.' },
  { title: 'Measurable Impact', desc: 'Ideas connected to outcomes that are actually tracked.' },
]

function WhyNirmora() {
  const [ref, inView] = useReveal(0.25)
  return (
    <section ref={ref} className="relative py-20 md:py-28" style={{ background: '#F7F4EC' }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <motion.div className="eyebrow" style={{ color: GOLD }} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5, ease: EASE }}>
          06 — Why Nirmora
        </motion.div>
        <motion.h2
          className="mt-3 font-display font-bold leading-[1.14] max-w-[680px]"
          style={{ color: INK, fontSize: 'clamp(28px, 3.6vw, 44px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.06 }}
        >
          Not another collection of services. A connected growth system.
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-10">
          {DIFFERENTIATORS.map((d, i) => (
            <motion.div
              key={d.title}
              style={{ borderTop: `1px solid ${RULE}`, paddingTop: 20 }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.08 }}
            >
              <h4 className="font-display text-[19px] font-semibold" style={{ color: INK }}>{d.title}</h4>
              <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: MUTED }}>{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================================
   08 — CLOSING CTA.
   ============================================================================ */
function AboutCTA() {
  const [ref, inView] = useReveal(0.5)
  return (
    <section ref={ref} className="relative py-24 md:py-28" style={{ background: '#FDFBF6' }}>
      <div className="max-w-[820px] mx-auto px-6 md:px-8 text-center">
        <motion.div
          className="mx-auto mb-8 h-px w-16"
          style={{ background: RULE }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        />
        <motion.div
          className="eyebrow justify-center"
          style={{ color: GOLD }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
        >
          Let&apos;s Build
        </motion.div>
        <motion.h2
          className="font-display font-bold leading-[1.16]"
          style={{ color: INK, fontSize: 'clamp(28px, 4vw, 44px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.14 }}
        >
          Your next stage of growth should feel connected.
        </motion.h2>
        <motion.p
          className="mt-5 text-[15.5px] leading-relaxed"
          style={{ color: MUTED }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
        >
          Bring your brand, digital experience and growth systems into one direction.
        </motion.p>
        <motion.div
          className="mt-9"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.28 }}
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2.5 rounded-full pl-7 pr-2 py-2 text-[14px] font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: GOLD, color: '#171717' }}
          >
            Start a Project
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717]/10">
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <BigStatement />
      <WhoWeAre />
      <HowWeThink />
      <TheSystem />
      <HowWeWork />
      <WhyNirmora />
      <AboutCTA />
    </>
  )
}
