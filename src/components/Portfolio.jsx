import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { PROJECTS } from '../data/projects.js'

/* ============================================================================
   THE WORK — an editorial field of real client marks rather than a single
   project on stage. Nothing is behind a click: moving the cursor onto a mark
   immediately surfaces its real project info (name, tag, description from
   data/projects.js) in a panel anchored to that mark. Clicking a mark is only
   a shortcut to its existing /work/:slug page. Mobile has no hover, so a
   scroll-driven "closest to center" observer takes over the same role.
   ============================================================================ */

const EASE = [0.22, 1, 0.36, 1]

// A deliberately curated visual sequence — NOT the raw data-file order.
// Dense grid packing (see DesktopField) reads tiles in this order, so this
// list is what actually determines the composition on screen, independent
// of how projects happen to be listed in data/projects.js.
const WORK_ORDER = [
  'sg-rebel-rise-global',
  'urban-aura-realty',
  'didiz',
  'astrelle',
  'bharat-park',
  'bam-and-boo',
  'datel-enterprises',
  'om-sai-industries',
  'soham-enterprises',
]

// Per-project placement on the desktop field. Spans are on a 12-col grid
// with dense auto-flow, so the browser packs them without manual row math —
// this is what keeps the asymmetry safe across 1024/1280/1440+ without
// tiles ever overlapping. `tone` sets how prominent a mark is at rest.
const DESKTOP_LAYOUT = {
  'didiz': { span: 'lg:col-span-4 lg:row-span-3', tone: 'prominent' },
  'urban-aura-realty': { span: 'lg:col-span-3 lg:row-span-2', tone: 'medium' },
  'bharat-park': { span: 'lg:col-span-3 lg:row-span-2', tone: 'quiet' },
  'bam-and-boo': { span: 'lg:col-span-3 lg:row-span-3', tone: 'prominent' },
  'om-sai-industries': { span: 'lg:col-span-2 lg:row-span-2', tone: 'quiet' },
  'sg-rebel-rise-global': { span: 'lg:col-span-4 lg:row-span-3', tone: 'prominent' },
  'astrelle': { span: 'lg:col-span-3 lg:row-span-2', tone: 'medium' },
  'soham-enterprises': { span: 'lg:col-span-2 lg:row-span-2', tone: 'quiet' },
  'datel-enterprises': { span: 'lg:col-span-3 lg:row-span-2', tone: 'medium' },
}

// Mobile is composed as solo / pair rows — never a shrunk copy of the
// desktop field, and in the same curated sequence as the desktop field
// rather than the raw data order. Alternating alignment on the solo rows
// is what keeps it feeling placed rather than centered-and-stacked.
const MOBILE_ROWS = [
  { type: 'solo', slugs: ['sg-rebel-rise-global'], align: 'center' },
  { type: 'pair', slugs: ['didiz', 'astrelle'] },
  { type: 'solo', slugs: ['bam-and-boo'], align: 'start' },
  { type: 'pair', slugs: ['urban-aura-realty', 'datel-enterprises'] },
  { type: 'solo', slugs: ['bharat-park'], align: 'end' },
  { type: 'pair', slugs: ['om-sai-industries', 'soham-enterprises'] },
]

const TONE_OPACITY = { prominent: 1, medium: 0.82, quiet: 0.58 }

// Four gentle idle drift patterns — vertical, horizontal, and two diagonals —
// cycled across tiles so neighboring marks never move in lockstep.
const FLOAT_PATTERNS = [
  (amp) => ({ y: [0, -amp, 0] }),
  (amp) => ({ x: [0, amp, 0] }),
  (amp) => ({ x: [0, amp * 0.6, 0], y: [0, -amp * 0.6, 0] }),
  (amp) => ({ x: [0, -amp * 0.5, 0], y: [0, amp * 0.7, 0] }),
]
const FLOAT_DURATIONS = [4, 5, 6, 7]

function projectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug)
}

/* ---------------------------- Floating logo tile ---------------------------- */

function FloatingLogoTile({
  project,
  index,
  tone = 'medium',
  hoveredSlug,
  onHoverStart,
  onHoverEnd,
  onSelect,
  scrollYProgress,
  reduced,
  boxClassName,
  imgClassName,
}) {
  const isFocused = hoveredSlug === project.slug
  const dimmed = hoveredSlug !== null && !isFocused
  const restOpacity = TONE_OPACITY[tone] ?? 0.85
  const tileRef = useRef(null)

  // Scroll parallax — a small, per-tile vertical drift as the section
  // passes through the viewport (5–15px), varied by index so the field
  // gains a little depth without any tile moving in an obvious way.
  const parallaxRange = 6 + ((index * 3) % 9) // ~6–14px
  const parallaxDir = index % 2 === 0 ? 1 : -1
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, parallaxRange * parallaxDir])

  const floatAmp = 4 + ((index * 2) % 6) // ~4–10px
  const floatPattern = FLOAT_PATTERNS[index % FLOAT_PATTERNS.length](floatAmp)
  const floatDuration = FLOAT_DURATIONS[index % FLOAT_DURATIONS.length]

  return (
    <motion.div style={reduced ? undefined : { y: parallaxY }} className={boxClassName}>
      <motion.div
        animate={reduced ? undefined : floatPattern}
        transition={reduced ? undefined : { duration: floatDuration, repeat: Infinity, ease: 'easeInOut' }}
        className="h-full w-full"
      >
        <motion.button
          ref={tileRef}
          type="button"
          onClick={() => onSelect(project.slug, tileRef.current)}
          onMouseEnter={() => onHoverStart(project.slug, tileRef.current)}
          onMouseLeave={onHoverEnd}
          onFocus={() => onHoverStart(project.slug, tileRef.current)}
          onBlur={onHoverEnd}
          animate={{
            opacity: hoveredSlug === null ? restOpacity : isFocused ? 1 : 0.26,
            scale: isFocused ? 1.06 : dimmed ? 0.97 : 1,
            y: isFocused ? -9 : 0,
            filter: isFocused ? 'brightness(1.12)' : hoveredSlug === null ? 'brightness(1)' : 'brightness(0.78)',
          }}
          transition={{ duration: 0.35, ease: EASE }}
          className="group relative flex h-full w-full items-center justify-center rounded-[26px] p-8 xl:p-10"
          style={{
            background: 'rgba(244,241,232,0.05)',
            boxShadow: isFocused
              ? '0 24px 60px -20px rgba(197,138,42,0.45), inset 0 0 30px rgba(197,138,42,0.07)'
              : '0 10px 30px -22px rgba(0,0,0,0.5)',
            transition: 'box-shadow 0.4s ease',
          }}
          aria-label={`${project.name} — ${project.tag}. View project`}
        >
          <img
            src={project.logo}
            alt={`${project.name} logo`}
            className={`object-contain select-none pointer-events-none ${imgClassName}`}
            draggable={false}
          />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------ Desktop field ------------------------------ */

function DesktopField({ hoveredSlug, onHoverStart, onHoverEnd, onSelect, scrollYProgress, reduced, fieldRef }) {
  return (
    <div
      ref={fieldRef}
      className="hidden lg:grid relative w-full gap-6 xl:gap-7 [grid-auto-flow:dense]"
      style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: 'clamp(64px, 6.4vw, 92px)' }}
    >
      {WORK_ORDER.map((slug, index) => {
        const project = projectBySlug(slug)
        if (!project) return null
        const { span, tone } = DESKTOP_LAYOUT[project.slug] ?? { span: 'lg:col-span-3 lg:row-span-2', tone: 'medium' }
        return (
          <FloatingLogoTile
            key={project.slug}
            project={project}
            index={index}
            tone={tone}
            hoveredSlug={hoveredSlug}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            onSelect={onSelect}
            scrollYProgress={scrollYProgress}
            reduced={reduced}
            boxClassName={span}
            imgClassName="max-h-full max-w-full w-auto h-auto"
          />
        )
      })}
    </div>
  )
}

/* --------------------------- Fixed, viewport-safe panel --------------------------- */

function HoverPanel({ project, rect }) {
  if (!project || !rect) return null

  const PANEL_W = 300
  const MARGIN = 16
  const estHeight = 168

  const spaceBelow = window.innerHeight - rect.bottom
  const side = spaceBelow > estHeight + MARGIN || spaceBelow > rect.top ? 'below' : 'above'
  const top = side === 'below' ? rect.bottom + 14 : rect.top - 14

  const desiredLeft = rect.left + rect.width / 2 - PANEL_W / 2
  const left = Math.min(Math.max(desiredLeft, MARGIN), window.innerWidth - PANEL_W - MARGIN)
  const connectorLeft = Math.min(Math.max(rect.left + rect.width / 2 - left, 20), PANEL_W - 20)

  return (
    <motion.div
      initial={{ opacity: 0, y: side === 'below' ? -8 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: side === 'below' ? -8 : 8 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="fixed z-30 pointer-events-none"
      style={{
        top,
        left,
        width: PANEL_W,
        transform: side === 'above' ? 'translateY(-100%)' : 'none',
      }}
    >
      <span
        aria-hidden
        className="absolute h-3 w-px"
        style={{
          left: connectorLeft,
          top: side === 'below' ? -12 : undefined,
          bottom: side === 'above' ? -12 : undefined,
          background: 'linear-gradient(180deg, rgba(197,138,42,0.7), transparent)',
        }}
      />
      <div
        className="rounded-2xl px-5 py-4"
        style={{ background: 'rgba(250,249,245,0.95)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 46px -20px rgba(32,34,31,0.18), inset 0 0 0 1px rgba(32,34,31,0.08)' }}
      >
        <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#20221F]">{project.name}</div>
        <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#C58A2A]/85">{project.tag}</div>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#66665F]">{project.desc}</p>
      </div>
    </motion.div>
  )
}

/* ------------------------------- Mobile field ------------------------------- */

function MobileTile({ project, isActive, onSelect, observe, boxClassName }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined
    return observe(ref.current, project.slug)
  }, [observe, project.slug])

  return (
    <div ref={ref} data-slug={project.slug} className="w-full">
      <motion.button
        type="button"
        onClick={() => onSelect(project.slug)}
        animate={{
          opacity: isActive ? 1 : 0.62,
          scale: isActive ? 1.03 : 1,
          filter: isActive ? 'brightness(1.1)' : 'brightness(0.9)',
        }}
        transition={{ duration: 0.35, ease: EASE }}
        className={`relative flex w-full items-center justify-center rounded-[24px] ${boxClassName}`}
        style={{
          background: 'rgba(32,34,31,0.035)',
          boxShadow: isActive
            ? '0 20px 46px -20px rgba(197,138,42,0.4), inset 0 0 24px rgba(197,138,42,0.06)'
            : '0 8px 24px -20px rgba(0,0,0,0.5)',
          transition: 'box-shadow 0.4s ease',
        }}
        aria-label={`${project.name} — ${project.tag}. View project`}
      >
        <img
          src={project.logo}
          alt={`${project.name} logo`}
          className="max-h-full max-w-full w-auto h-auto object-contain select-none pointer-events-none"
          draggable={false}
        />
      </motion.button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pt-4 px-1 text-center">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#F4F1E8]">{project.name}</div>
              <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#C58A2A]/85">{project.tag}</div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-[#F4F1E8]/60 max-w-[280px] mx-auto">{project.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileField({ activeSlug, onSelect, observe, reduced }) {
  const alignClass = { center: 'justify-center', start: 'justify-start', end: 'justify-end' }
  return (
    <div className="flex lg:hidden flex-col gap-9 sm:gap-10 w-full">
      {MOBILE_ROWS.map((row, ri) => {
        if (row.type === 'solo') {
          const project = projectBySlug(row.slugs[0])
          return (
            <div key={ri} className={`flex ${alignClass[row.align] ?? 'justify-center'}`}>
              <div className="w-[62vw] max-w-[240px]">
                <MobileTile
                  project={project}
                  isActive={activeSlug === project.slug}
                  onSelect={onSelect}
                  observe={observe}
                  boxClassName="h-[112px]"
                />
              </div>
            </div>
          )
        }
        return (
          <div key={ri} className="flex items-start justify-between px-2 sm:px-4">
            {row.slugs.map((slug, i) => {
              const project = projectBySlug(slug)
              return (
                <div key={slug} className={`w-[38vw] max-w-[160px] ${i === 1 ? 'mt-9 sm:mt-10' : ''}`}>
                  <MobileTile
                    project={project}
                    isActive={activeSlug === project.slug}
                    onSelect={onSelect}
                    observe={observe}
                    boxClassName="h-[80px]"
                  />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------- Portfolio ------------------------------------- */

export default function Portfolio() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()

  const fieldRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: fieldRef, offset: ['start end', 'end start'] })

  // ---- Desktop hover ----
  const [hoveredSlug, setHoveredSlug] = useState(null)
  const [anchorRect, setAnchorRect] = useState(null)

  const handleHoverStart = useCallback((slug, el) => {
    setHoveredSlug(slug)
    if (el) setAnchorRect(el.getBoundingClientRect())
  }, [])
  const handleHoverEnd = useCallback(() => {
    setHoveredSlug(null)
    setAnchorRect(null)
  }, [])
  const handleSelect = useCallback((slug) => navigate(`/work/${slug}`), [navigate])

  // ---- Mobile scroll-driven activation ----
  const [mobileActive, setMobileActive] = useState(null)
  const observersRef = useRef(new Map())

  const observe = useCallback((el, slug) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setMobileActive(slug)
        })
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    )
    observer.observe(el)
    observersRef.current.set(slug, observer)
    return () => {
      observer.disconnect()
      observersRef.current.delete(slug)
    }
  }, [])

  const hoveredProject = hoveredSlug ? projectBySlug(hoveredSlug) : null

  return (
    <section id="work" className="relative section-dark py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[8%] right-[4%] h-[420px] w-[420px] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(197,138,42,0.06), transparent 70%)' }}
      />

      <div className="relative w-full max-w-[1320px] mx-auto px-6 md:px-10">
        <motion.div
          className="max-w-[640px] mx-auto text-center mb-16 md:mb-20"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="eyebrow justify-center">Why Nirmora</div>
          <h2 className="font-display font-semibold leading-[1.1] tracking-tight text-[#F4F1E8]" style={{ fontSize: 'clamp(30px, 4.4vw, 48px)' }}>
            We could tell you.
            <br />
            Or we could show you.
          </h2>
        </motion.div>

        <DesktopField
          fieldRef={fieldRef}
          hoveredSlug={hoveredSlug}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onSelect={handleSelect}
          scrollYProgress={scrollYProgress}
          reduced={reduced}
        />
        <MobileField activeSlug={mobileActive} onSelect={handleSelect} observe={observe} reduced={reduced} />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden lg:block mt-12 lg:mt-16 text-center font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#F4F1E8]/40"
        >
          Hover a mark to see the work
        </motion.p>
      </div>

      <AnimatePresence>
        {hoveredProject && anchorRect && <HoverPanel key="hover-panel" project={hoveredProject} rect={anchorRect} />}
      </AnimatePresence>
    </section>
  )
}
