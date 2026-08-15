import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { CREAM, CHARCOAL, TEXT_SECONDARY, TEXT_MUTED, YELLOW } from '../theme.js'

import engineCreative from '../assets/engine/engine-creative.png'
import contentCollage1 from '../assets/services/section5-influencer-04.png'
import contentCollage2 from '../assets/engine/engine-content.png'
import contentCollage3 from '../assets/services/section5-social-media-marketing-04.png'
import performanceImg from '../assets/engine/engine-performance.png'
import crmImg from '../assets/engine/engine-crm.png'
import websiteImg from '../assets/engine/engine-website.png'
import dataImg from '../assets/engine/engine-data.png'

const EASE = [0.22, 1, 0.36, 1]
const BG = CREAM
const INK = CHARCOAL
const MUTED = TEXT_SECONDARY
const FAINT = TEXT_MUTED
const GOLD = YELLOW
const LINE = 'rgba(32,34,31,0.14)'
const LINE_SOFT = 'rgba(32,34,31,0.08)'
const CARD = '#FAF9F5'

// The Engine's six disciplines, each with a role, a short explanation and a
// "connects with" relationship — the loop closes with Data feeding back
// into Creative. Content is the one exception with no single `img`: it
// renders as a three-photo editorial collage instead (see ContentCollage).
const DISCIPLINES = [
  {
    n: '01',
    key: 'creative',
    title: 'Creative',
    role: 'Ideas become identity.',
    desc: 'Creative establishes the visual language, positioning and ideas that give every other discipline a clear direction.',
    connects: ['Content', 'Website', 'Performance'],
    img: engineCreative,
    alt: 'Nirmora Creative moodboard and brand direction',
  },
  {
    n: '02',
    key: 'content',
    title: 'Content',
    role: 'Stories become attention.',
    desc: 'Content turns strategy into stories, campaigns and experiences that give the brand something meaningful to say.',
    connects: ['Creative', 'Social', 'Performance'],
  },
  {
    n: '03',
    key: 'performance',
    title: 'Performance',
    role: 'Attention becomes growth.',
    desc: 'Performance turns creative attention into measurable acquisition through testing, optimization and continuous improvement.',
    connects: ['Creative', 'Content', 'Data'],
    img: performanceImg,
    alt: 'Performance marketing analytics dashboard',
  },
  {
    n: '04',
    key: 'crm',
    title: 'CRM',
    role: 'Relationships become retention.',
    desc: 'CRM connects customer interactions into one continuous relationship, helping businesses nurture, convert and retain customers.',
    connects: ['Website', 'Performance', 'Data'],
    img: crmImg,
    alt: 'CRM relationship and customer journey system',
  },
  {
    n: '05',
    key: 'website',
    title: 'Website',
    role: 'Experiences become conversion.',
    desc: 'The website turns attention into action by connecting brand, experience, technology and conversion.',
    connects: ['Creative', 'Performance', 'CRM'],
    img: websiteImg,
    alt: 'Website design and development workspace',
  },
  {
    n: '06',
    key: 'data',
    title: 'Data',
    role: 'Signals become smarter decisions.',
    desc: 'Data brings every discipline closer to reality by revealing what is working, what is changing and where the system should adapt.',
    connects: ['Performance', 'CRM', 'Strategy'],
    loopNote: 'Data feeds back into Creative — the system keeps learning.',
    img: dataImg,
    alt: 'Data and analytics network visualization',
  },
]

const SEQUENCE_VH_PER_STATE = 74

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isDesktop
}

/* ============================================================================
   INTRO — a normal (non-pinned) editorial statement. Fades in once; the
   pinned mechanism only covers the six-discipline sequence below it.
   ============================================================================ */
function EngineIntro() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4, once: true })
  const reduced = useReducedMotion()
  const show = reduced || inView

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center">
      <motion.div
        className="uppercase tracking-[0.28em] text-[11px] font-semibold"
        style={{ color: GOLD }}
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE }}
      >
        Nirmora Engine
      </motion.div>
      <motion.h2
        className="mt-5 font-display font-bold leading-[1.08]"
        style={{ color: INK, fontSize: 'clamp(36px, 5.2vw, 64px)' }}
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: EASE, delay: 0.08 }}
      >
        One system.
        <br />
        Every <span style={{ color: GOLD }}>discipline</span>.
      </motion.h2>
      <motion.p
        className="mt-6 max-w-[600px] text-[15.5px] md:text-[17px] leading-relaxed"
        style={{ color: MUTED }}
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
      >
        Nirmora doesn&apos;t treat creative, content, performance, technology and data as isolated
        services. They work together as one connected growth system — where every discipline
        informs the next and every signal feeds the system forward. This is the Nirmora Engine.
      </motion.p>
    </div>
  )
}

/* ============================================================================
   SEQUENCE — desktop only. Scroll position picks ONE discrete active index
   (0-5). Text and visual both swap via AnimatePresence mode="wait" so the
   outgoing state fully exits before the incoming one enters — there is
   never a moment where two disciplines' content visibly compete.
   ============================================================================ */
function useActiveIndex(progress, total) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    return progress.on('change', (p) => {
      setActive(Math.min(total - 1, Math.max(0, Math.floor(p * total))))
    })
  }, [progress, total])
  return active
}

function DisciplineContent({ item }) {
  return (
    <motion.div
      key={item.key}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="max-w-[460px]"
    >
      <p className="font-mono text-[13px] tracking-[0.08em]" style={{ color: GOLD }}>
        {item.n} <span style={{ color: 'rgba(32,34,31,0.32)' }}>/ 06</span>
      </p>
      <h3 className="mt-3 font-display font-bold leading-[1.05]" style={{ color: INK, fontSize: 'clamp(30px, 3.6vw, 46px)' }}>
        {item.title}
      </h3>
      <p className="mt-2 text-[16px] md:text-[17px]" style={{ color: MUTED }}>
        {item.role}
      </p>
      <p className="mt-4 max-w-[420px] text-[13.5px] leading-relaxed" style={{ color: MUTED }}>
        {item.desc}
      </p>

      <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${LINE_SOFT}` }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: FAINT }}>
          Connects with
        </p>
        <p className="mt-1.5 text-[13px]" style={{ color: INK }}>
          {item.connects.join(' · ')}
        </p>
        {item.loopNote && (
          <p className="mt-2 text-[12px] italic" style={{ color: FAINT }}>
            {item.loopNote}
          </p>
        )}
      </div>
    </motion.div>
  )
}

// Content is the one discipline without a single hero photograph — instead
// three images overlap as a layered editorial collage: two smaller cards
// stacked top-left/top-right, a larger foreground card lower-center that
// carries the visual weight. They animate into position with a short
// stagger rather than all at once.
function ContentCollage() {
  return (
    <div className="relative h-full w-full" style={{ background: CARD }}>
      <motion.img
        src={contentCollage1}
        alt="Content creation and storytelling"
        initial={{ opacity: 0, y: 10, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
        whileHover={{ y: -4 }}
        className="absolute left-[4%] top-[4%] h-[48%] w-[54%] rounded-[4px] object-cover"
        style={{ border: `1px solid ${LINE}`, boxShadow: '0 16px 30px -14px rgba(16,18,16,0.32)' }}
      />
      <motion.img
        src={contentCollage2}
        alt="Content strategy across social platforms"
        initial={{ opacity: 0, y: 10, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
        whileHover={{ y: -4 }}
        className="absolute right-[3%] top-[6%] h-[48%] w-[54%] rounded-[4px] object-cover"
        style={{ border: `1px solid ${LINE}`, boxShadow: '0 16px 30px -14px rgba(16,18,16,0.32)' }}
      />
      <motion.img
        src={contentCollage3}
        alt="Content campaign reach and engagement"
        initial={{ opacity: 0, y: 14, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.28 }}
        whileHover={{ y: -5 }}
        className="absolute bottom-[3%] left-[17%] h-[56%] w-[66%] rounded-[5px] object-cover"
        style={{ border: `1px solid ${LINE}`, boxShadow: '0 22px 40px -16px rgba(16,18,16,0.36)' }}
      />
    </div>
  )
}

// The visual frame every discipline shares: a slightly offset backing card
// behind the main image/collage for a layered, premium print-editorial
// feel. `mobile` swaps the fixed desktop min(vw,px)/min(vh,px) box for a
// simple 4:3 box that fills its container instead.
function DisciplineVisual({ item, mobile }) {
  return (
    <motion.div
      key={item.key}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative"
      style={mobile ? { width: '100%', aspectRatio: '4 / 3' } : { width: 'min(40vw, 620px)', height: 'min(48vh, 480px)' }}
    >
      <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-[6px]" style={{ background: CARD, border: `1px solid ${LINE}` }} />
      <div
        className="relative h-full w-full overflow-hidden rounded-[6px]"
        style={{ border: `1px solid ${LINE}`, boxShadow: '0 30px 60px -24px rgba(16,18,16,0.28)' }}
      >
        {item.key === 'content' ? <ContentCollage /> : <img src={item.img} alt={item.alt} className="h-full w-full object-cover" />}
      </div>
    </motion.div>
  )
}

function DisciplineNav({ activeIndex }) {
  return (
    <div className="pointer-events-none absolute left-6 top-36 hidden items-center gap-4 md:left-10 lg:flex lg:top-40">
      {DISCIPLINES.map((d, i) => (
        <span
          key={d.key}
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors duration-500"
          style={{ color: i === activeIndex ? GOLD : 'rgba(32,34,31,0.32)' }}
        >
          <span className="h-[3px] w-[3px] rounded-full transition-colors duration-500" style={{ background: i === activeIndex ? GOLD : 'rgba(32,34,31,0.24)' }} />
          {d.title}
        </span>
      ))}
    </div>
  )
}

// The dashed arc only appears while Data is active — a quiet visual cue
// that the system loops back to Creative rather than a permanent, busy
// flowchart line.
function LoopArc({ active }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -bottom-4 left-1/2 h-4 w-[300px] -translate-x-1/2 md:w-[380px]"
      viewBox="0 0 380 16"
      preserveAspectRatio="none"
      style={{ opacity: active ? 0.55 : 0, transition: 'opacity 600ms ease' }}
    >
      <path d="M 372 3 Q 190 18 8 3" stroke={GOLD} strokeWidth="1" strokeDasharray="2 5" fill="none" />
    </svg>
  )
}

// The bottom navigation — the ONLY interactive way to jump directly to a
// discipline. It never sets activeIndex itself; it only scrolls the pinned
// wrapper to that discipline's band. activeIndex stays derived purely from
// scroll position (useActiveIndex), so scroll and click can never disagree
// — there is exactly one source of truth, and a rapid click sequence just
// retargets the same in-flight smooth scroll.
function ProgressTrack({ progress, activeIndex, onSelect }) {
  const indicatorLeft = useTransform(progress, [0, 1], ['0%', '100%'])
  return (
    <div className="absolute bottom-10 left-1/2 w-[300px] -translate-x-1/2 md:w-[380px]">
      <div className="pointer-events-none relative h-px w-full" style={{ background: LINE }}>
        <motion.div
          className="absolute top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: GOLD, left: indicatorLeft, boxShadow: '0 0 6px rgba(197,138,42,0.5)' }}
          transition={{ type: 'tween', ease: EASE, duration: 0.15 }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between" role="tablist" aria-label="Nirmora Engine disciplines">
        {DISCIPLINES.map((d, i) => {
          const active = i === activeIndex
          return (
            <button
              key={d.key}
              type="button"
              role="tab"
              aria-selected={active}
              aria-current={active ? 'true' : undefined}
              aria-label={`${d.title} — discipline ${d.n} of ${DISCIPLINES.length}`}
              onClick={() => onSelect(i)}
              className="cursor-pointer rounded-sm px-2 py-2 font-mono text-[10px] tracking-[0.06em] outline-none transition-colors duration-300 hover:opacity-100 focus-visible:ring-1 focus-visible:ring-offset-2"
              style={{
                color: active ? GOLD : 'rgba(32,34,31,0.4)',
                opacity: active ? 1 : 0.75,
                '--tw-ring-color': GOLD,
                '--tw-ring-offset-color': BG,
              }}
            >
              {d.n}
            </button>
          )
        })}
      </div>
      <LoopArc active={activeIndex === DISCIPLINES.length - 1} />
    </div>
  )
}

function EngineDesktopSequence() {
  const wrapRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] })
  const activeIndex = useActiveIndex(scrollYProgress, DISCIPLINES.length)
  const activeItem = DISCIPLINES[activeIndex]

  // Clicking a bottom-nav number scrolls the pinned wrapper to the middle
  // of that discipline's band; the scroll listener above then derives
  // activeIndex from the resulting position, same as it does for organic
  // scrolling. A second click before the first scroll settles simply
  // retargets the browser's smooth-scroll animation.
  const scrollToIndex = (i) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const elTop = rect.top + window.scrollY
    const scrollableDistance = el.offsetHeight - window.innerHeight
    const targetProgress = (i + 0.5) / DISCIPLINES.length
    const targetY = elTop + targetProgress * scrollableDistance
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${DISCIPLINES.length * SEQUENCE_VH_PER_STATE}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: BG }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 45% 40% at 88% 10%, rgba(197,138,42,0.06) 0%, rgba(197,138,42,0) 65%)' }}
        />
        <p className="pointer-events-none absolute left-6 top-24 uppercase tracking-[0.24em] text-[10.5px] font-semibold md:left-10 md:top-28" style={{ color: FAINT }}>
          Nirmora Engine
        </p>
        <DisciplineNav activeIndex={activeIndex} />
        <div className="mx-auto flex h-full w-full max-w-[1320px] items-center px-6 md:px-10">
          {/* Fixed min-height reserves space for the tallest state so
              AnimatePresence swaps never shift surrounding layout. */}
          <div className="relative grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16" style={{ minHeight: 420 }}>
            <AnimatePresence mode="wait">
              <DisciplineContent key={activeItem.key} item={activeItem} />
            </AnimatePresence>
            <div className="relative shrink-0" style={{ width: 'min(40vw, 620px)', height: 'min(48vh, 480px)' }}>
              <AnimatePresence mode="wait">
                <DisciplineVisual key={activeItem.key} item={activeItem} />
              </AnimatePresence>
            </div>
          </div>
        </div>
        <ProgressTrack progress={scrollYProgress} activeIndex={activeIndex} onSelect={scrollToIndex} />
      </div>
    </div>
  )
}

/* ============================================================================
   MOBILE / REDUCED-MOTION — normal vertical scrolling. Each discipline
   appears sequentially: image, number, title, role, description, connects.
   No sticky/pinned Engine, no bottom progress navigation on mobile.
   ============================================================================ */
function EngineSequenceItem({ item }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.3, once: true })
  const reduced = useReducedMotion()
  const show = reduced || inView

  return (
    <div ref={ref} className="mx-auto max-w-[520px] px-6 py-9">
      <DisciplineVisual item={item} mobile />
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
      >
        <p className="mt-6 font-mono text-[12px] tracking-[0.08em]" style={{ color: GOLD }}>
          {item.n} <span style={{ color: 'rgba(32,34,31,0.32)' }}>/ 06</span>
        </p>
        <h3 className="mt-2 font-display font-bold text-[24px]" style={{ color: INK }}>
          {item.title}
        </h3>
        <p className="mt-1.5 text-[14px]" style={{ color: MUTED }}>
          {item.role}
        </p>
        <p className="mt-2.5 text-[13px] leading-relaxed" style={{ color: MUTED }}>
          {item.desc}
        </p>
        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${LINE_SOFT}` }}>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: FAINT }}>
            Connects with
          </p>
          <p className="mt-1 text-[12.5px]" style={{ color: INK }}>
            {item.connects.join(' · ')}
          </p>
          {item.loopNote && (
            <p className="mt-2 text-[11.5px] italic" style={{ color: FAINT }}>
              {item.loopNote}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function EngineSequenceMobile() {
  return (
    <div className="relative" style={{ background: BG }}>
      {DISCIPLINES.map((item) => (
        <EngineSequenceItem key={item.key} item={item} />
      ))}
    </div>
  )
}

/* ============================================================================
   RESOLUTION — a normal closing statement after the sequence releases.
   ============================================================================ */
function EngineResolution() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.5, once: true })
  const reduced = useReducedMotion()
  const show = reduced || inView

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center px-6 py-28 md:py-32 text-center" style={{ background: BG }}>
      <motion.h2
        className="font-display font-bold"
        style={{ color: INK, fontSize: 'clamp(30px, 4.4vw, 50px)' }}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        Everything connects.
      </motion.h2>
      <motion.p
        className="mt-5 max-w-[440px] text-[15px] leading-relaxed"
        style={{ color: MUTED }}
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
      >
        Creative. Content. Performance. Website. CRM. Data.
      </motion.p>
      <motion.p
        className="mt-3 font-display font-bold"
        style={{ color: GOLD, fontSize: 'clamp(20px, 2.4vw, 28px)' }}
        initial={reduced ? false : { opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.22 }}
      >
        One system. Continuously learning.
      </motion.p>
      <motion.p
        className="mt-8 text-[13px]"
        style={{ color: FAINT }}
        initial={reduced ? false : { opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.32 }}
      >
        That is the Nirmora Engine.
      </motion.p>
    </div>
  )
}

// =============================================================================
// NIRMORA ENGINE — a premium editorial scroll sequence: one discipline shown
// at a time, not six cards side by side. Desktop pins the viewport for
// ~74vh of scroll per discipline (six states total) with a two-column
// text/visual composition; mobile and prefers-reduced-motion get the same
// six disciplines as a normal, non-pinned vertical sequence instead.
// =============================================================================
export default function Engine() {
  const reduced = useReducedMotion()
  const isDesktop = useIsDesktop()
  const sequential = reduced || !isDesktop

  return (
    <section id="engine" className="relative w-full" style={{ background: BG }}>
      <EngineIntro />
      {sequential ? <EngineSequenceMobile /> : <EngineDesktopSequence />}
      <EngineResolution />
    </section>
  )
}
