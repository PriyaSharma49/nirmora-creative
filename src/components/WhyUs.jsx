import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]
const GOLD = '#C58A2A'
// Dark section, matching Service Detail's .sd-dark tokens exactly
// (--sd-background:#171916, --sd-text:#F4F1E8) — this section is now part
// of the site's DARK -> LIGHT -> DARK rhythm rather than a light section.
// Every tone below is the same relationship as before (INK primary / MUTED
// body / NUMBER_COLOR / SECONDARY quietest, one three-tone material system
// for the sheets, one shared inner surface), just inverted for a dark
// ground: light warm text instead of dark, light-tinted borders/lines
// instead of dark-tinted ones.
const BG = '#171916'
const INK = '#F4F1E8'
const MUTED = '#C9C6BC'
const NUMBER_COLOR = '#B5B2A8'
const SECONDARY = 'rgba(244,241,232,0.5)'
const DIAGRAM_LINE = 'rgba(244,241,232,0.6)'
// Three dark warm-neutral surfaces (echoing the original ivory/greige/sand
// family) — distinguishable from the page background and from each other,
// not one tone repeated three times. Hover variants go slightly LIGHTER
// (not darker, as they did on the light version) since lightening reads as
// elevation on a dark ground. One shared inner surface, a touch darker
// than the sheet itself, keeps the "paper within paper" depth.
const SHEET_TONES = ['#252822', '#242624', '#282420']
const SHEET_TONES_DEEP = ['#2D3129', '#2B2D2B', '#302B25']
const INNER_SURFACES = ['#1E201C', '#1E201C', '#1E201C']
const BORDER = 'rgba(244,241,232,0.16)'
const BORDER_SOFT = 'rgba(244,241,232,0.09)'

const PRINCIPLES = [
  {
    n: '01',
    tag: 'NMR–01',
    title: 'Direct Access',
    desc: 'You work directly with the people actually doing the work — not layers of account management between you and the team.',
  },
  {
    n: '02',
    tag: 'NMR–02',
    title: 'One Accountable Team',
    desc: 'Strategy, creative, performance, web and CRM work toward the same business outcome instead of operating as disconnected services.',
  },
  {
    n: '03',
    tag: 'NMR–03',
    title: 'Built to Compound',
    desc: 'Every insight, campaign and decision should make the next one smarter.',
  },
]

function useTier() {
  const [tier, setTier] = useState(() => {
    if (typeof window === 'undefined') return 'desktop'
    const w = window.innerWidth
    return w >= 1024 ? 'desktop' : w >= 768 ? 'tablet' : 'mobile'
  })
  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 1024px)')
    const mqTablet = window.matchMedia('(min-width: 768px)')
    const compute = () => setTier(mqDesktop.matches ? 'desktop' : mqTablet.matches ? 'tablet' : 'mobile')
    compute()
    mqDesktop.addEventListener('change', compute)
    mqTablet.addEventListener('change', compute)
    return () => {
      mqDesktop.removeEventListener('change', compute)
      mqTablet.removeEventListener('change', compute)
    }
  }, [])
  return tier
}

/* ============================================================================
   Registration marks / technical chrome shared by every sheet — a whisper
   of blueprint detail, not decoration for its own sake.
   ============================================================================ */
function TechnicalFrame({ tag, index }) {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute left-[10px] top-[10px] h-[7px] w-[7px]" style={{ borderTop: `1px solid ${BORDER}`, borderLeft: `1px solid ${BORDER}` }} />
      <span aria-hidden className="pointer-events-none absolute right-[10px] bottom-[10px] h-[7px] w-[7px]" style={{ borderBottom: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}` }} />
      <span aria-hidden className="pointer-events-none absolute right-4 top-3.5 font-mono text-[9px] tracking-[0.12em]" style={{ color: SECONDARY }}>
        {tag}
      </span>
      <span aria-hidden className="pointer-events-none absolute left-4 bottom-3.5 font-mono text-[9px] tracking-[0.12em]" style={{ color: SECONDARY }}>
        PRINCIPLE {index + 1} / 03
      </span>
    </>
  )
}

/* ============================================================================
   Sheet 01 — a direct line between two points, a gold point drifting
   along it. No link icon; the relationship is the graphic. The connecting
   line draws itself (scaleX) over the first half of the sheet's own
   assembly window, at full graphite strength — never a faint tint — so it
   reads clearly even mid-draw.
   ============================================================================ */
function ConnectionVisual({ active, reduced, progress }) {
  const showLoop = active && !reduced
  const lineScale = useTransform(progress, [0, 0.5], [0, 1])
  return (
    <div className="relative mt-3 flex h-[38px] items-center justify-between" aria-hidden>
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <span className="h-[6px] w-[6px] rounded-full" style={{ background: INK }} />
        <span className="font-mono text-[9px] tracking-[0.14em]" style={{ color: SECONDARY }}>YOU</span>
      </div>
      <div className="relative mx-3 h-px flex-1" style={{ background: 'rgba(74,72,65,0.2)' }}>
        <motion.span className="absolute inset-y-0 left-0 block h-px origin-left" style={{ background: DIAGRAM_LINE, scaleX: lineScale }} />
        {showLoop ? (
          <motion.span
            className="absolute top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full"
            style={{ background: GOLD, boxShadow: '0 0 4px rgba(197,138,42,0.6)' }}
            animate={{ left: ['2%', '96%', '2%'] }}
            transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity }}
          />
        ) : (
          <span className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: GOLD }} />
        )}
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        <span className="h-[6px] w-[6px] rounded-full" style={{ background: GOLD }} />
        <span className="font-mono text-[9px] tracking-[0.14em]" style={{ color: SECONDARY }}>NIRMORA</span>
      </div>
    </div>
  )
}

/* ============================================================================
   Sheet 02 — a clean engineered organizational system, not an orbit:
   Strategy above, Creative / Nirmora / Performance in one accountable row,
   CRM and Website below — connected by thin structural lines. Constructs in
   order across the sheet's own assembly window: the Nirmora centre point
   appears, the Strategy connector draws, the Creative<->Performance row
   draws, the CRM/Website connector draws, then the labels resolve. Every
   stage lands well inside full opacity/scale — nothing here settles at a
   faint value.
   ============================================================================ */
function OrgSystemVisual({ active, reduced, progress }) {
  const centerOp = useTransform(progress, [0, 0.18], [0, 1])
  const topScale = useTransform(progress, [0.14, 0.36], [0, 1])
  const rowScale = useTransform(progress, [0.3, 0.52], [0, 1])
  const bottomScale = useTransform(progress, [0.46, 0.68], [0, 1])
  const labelsOp = useTransform(progress, [0.58, 0.85], [0, 1])

  return (
    <div className="relative mt-3 flex h-[80px] flex-col items-center justify-between" aria-hidden>
      <motion.span className="font-mono uppercase" style={{ fontSize: '7px', letterSpacing: '0.08em', color: SECONDARY, opacity: labelsOp }}>
        Strategy
      </motion.span>
      <motion.span aria-hidden className="h-[9px] w-px origin-top" style={{ background: DIAGRAM_LINE, scaleY: topScale }} />

      <div className="relative flex w-full items-center justify-between">
        <motion.span aria-hidden className="absolute left-[13%] right-[13%] top-1/2 h-px -translate-y-1/2 origin-left" style={{ background: DIAGRAM_LINE, scaleX: rowScale }} />
        <motion.span className="relative font-mono uppercase" style={{ fontSize: '7px', letterSpacing: '0.06em', color: SECONDARY, opacity: labelsOp }}>
          Creative
        </motion.span>
        <motion.span className="relative" style={{ opacity: centerOp }}>
          <motion.span
            className="font-display font-semibold uppercase"
            style={{ fontSize: '7.5px', letterSpacing: '0.04em', color: GOLD }}
            animate={active && !reduced ? { opacity: [1, 0.8, 1] } : { opacity: 1 }}
            transition={{ duration: 3.4, ease: 'easeInOut', repeat: active && !reduced ? Infinity : 0 }}
          >
            Nirmora
          </motion.span>
        </motion.span>
        <motion.span className="relative font-mono uppercase" style={{ fontSize: '7px', letterSpacing: '0.06em', color: SECONDARY, opacity: labelsOp }}>
          Performance
        </motion.span>
      </div>

      <motion.span aria-hidden className="h-[9px] w-px origin-top" style={{ background: DIAGRAM_LINE, scaleY: bottomScale }} />
      <motion.div className="flex items-center gap-4" style={{ opacity: labelsOp }}>
        <span className="font-mono uppercase" style={{ fontSize: '7px', letterSpacing: '0.08em', color: SECONDARY }}>
          CRM
        </span>
        <span className="font-mono uppercase" style={{ fontSize: '7px', letterSpacing: '0.08em', color: SECONDARY }}>
          Website
        </span>
      </motion.div>
    </div>
  )
}

/* ============================================================================
   Sheet 03 — a widening staircase of bars. Not an arrow; accumulation read
   directly as growing form. Each bar draws left-to-right in sequence, and
   each step's fill is a progressively darker graphite than the last (never
   a pale beige tint) so the build reads clearly at every stage, not just
   once finished.
   ============================================================================ */
const COMPOUND_STEPS = [
  { label: '01', w: 32, color: '#5C594E' },
  { label: '02', w: 50, color: '#7A766A' },
  { label: '03', w: 68, color: '#A19D8F' },
  { label: '04', w: 86, color: '#C9C6BC' },
  { label: 'GROWTH', w: 100, final: true },
]

function CompoundVisual({ progress }) {
  const scale0 = useTransform(progress, [0.0, 0.22], [0, 1])
  const scale1 = useTransform(progress, [0.16, 0.38], [0, 1])
  const scale2 = useTransform(progress, [0.32, 0.54], [0, 1])
  const scale3 = useTransform(progress, [0.48, 0.7], [0, 1])
  const scale4 = useTransform(progress, [0.64, 0.9], [0, 1])
  const scales = [scale0, scale1, scale2, scale3, scale4]

  const label0 = useTransform(progress, [0.06, 0.22], [0, 1])
  const label1 = useTransform(progress, [0.22, 0.38], [0, 1])
  const label2 = useTransform(progress, [0.38, 0.54], [0, 1])
  const label3 = useTransform(progress, [0.54, 0.7], [0, 1])
  const label4 = useTransform(progress, [0.7, 0.9], [0, 1])
  const labels = [label0, label1, label2, label3, label4]

  return (
    <div className="mt-3 flex flex-col gap-[4px]" aria-hidden>
      {COMPOUND_STEPS.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
          <motion.span
            className="h-[5px] rounded-[1px] origin-left"
            style={{ width: `${s.w}%`, background: s.final ? GOLD : s.color, scaleX: scales[i] }}
          />
          <motion.span className="shrink-0 font-mono text-[8px] tracking-[0.1em]" style={{ color: s.final ? GOLD : SECONDARY, opacity: labels[i] }}>
            {s.label}
          </motion.span>
        </div>
      ))}
    </div>
  )
}

const VISUALS = [ConnectionVisual, OrgSystemVisual, CompoundVisual]

function SheetBody({ principle, index, active, reduced, hovered, progress }) {
  const Visual = VISUALS[index]
  return (
    <div className="relative flex h-full flex-col px-7 py-6">
      <span className="font-mono text-[11px] font-semibold tracking-wide" style={{ color: NUMBER_COLOR }}>
        {principle.n}
      </span>

      <h3
        className="mt-1.5 font-display text-[16px] font-semibold uppercase tracking-[0.02em] transition-colors duration-300"
        style={{ color: hovered ? '#FDFBF6' : INK }}
      >
        {principle.title}
      </h3>

      <p className="mt-2 max-w-[280px] text-[11.5px] leading-snug" style={{ color: MUTED }}>
        {principle.desc}
      </p>

      <div>
        <Visual active={active} reduced={reduced} progress={progress} />
      </div>
    </div>
  )
}

/* ============================================================================
   PINNED experience — desktop & tablet. A SHORT scroll-progress value (the
   wrapper is only ~1.1 extra viewports of scroll beyond the sticky hold, not
   a multi-screen journey) drives one thing only: the three sheets assemble
   from a slightly stacked/offset/rotated start into their resting position.
   That finishes within the first ~40% of the scroll distance; the rest is
   an automatic hold (nothing left to animate) until the section releases
   into normal flow. Hover is a plain discrete lift on a child element, so
   it never fights the scroll-driven transform on the parent for the same
   CSS property, and is available as soon as a sheet is on screen.
   ============================================================================ */
// Vertical separation kept deliberately small — depth (rotateZ tilt +
// hover lift + shadow), not physical distance, is what reads as "three
// separate layers." This is what keeps 01 below the navbar and 03 inside
// the viewport at rest instead of spilling off top/bottom.
const TIER_CONFIG = {
  desktop: { sep: 210, sheetW: 430, sheetH: 190, gap: 676 },
  tablet: { sep: 175, sheetW: 350, sheetH: 165, gap: 572 },
}

// One phase, driven by a single scroll-progress input: sheets start
// slightly stacked/offset/rotated (like a deck coming apart) and assemble
// into their resting position via position + rotation only. Each
// useTransform range ends well before the wrapper's scroll distance is used
// up (see posStart/posEnd below) — framer-motion clamps output at the
// range's edges by default, so once assembly finishes the values simply stop
// changing for the remainder of the scroll: that clamped plateau *is* the
// hold phase, with no separate state machine, listener or timer needed.
//
// Deliberately NOT animated here: sheet opacity, content opacity, or blur.
// The sheet and its content are always fully rendered/readable — "hidden"
// at the start of assembly means positioned/rotated out of its final spot
// (and partly under its neighbours, like a physical stack), never faded
// out. Stacking an outer opacity fade with an inner content-opacity fade
// (the previous bug) compounds multiplicatively into a washed-out result;
// removing both fixes that at the source rather than tuning the numbers.
// The one thing that DOES progress locally is the internal diagram inside
// each sheet (see visualT below, fed to ConnectionVisual/OrgSystemVisual/
// CompoundVisual) — a construction animation, not a visibility fade.
function PinnedSheet({ index, principle, progress, cfg, hoveredIndex, setHoveredIndex, reduced }) {
  const rest = [-cfg.sep, 0, cfg.sep][index]
  const stacked = [-30, -10, 22][index]
  const baseRotate = [-1.3, 0, 1.3][index]
  const startRotate = [-7, 4, -6][index]

  const posStart = 0.08 + index * 0.06
  const posEnd = posStart + 0.22

  const y = useTransform(progress, [posStart, posEnd], [stacked, rest])
  const rotate = useTransform(progress, [posStart, posEnd], [startRotate, baseRotate])
  const visualT = useTransform(progress, [posStart, posEnd], [0, 1])

  const hovered = !reduced && hoveredIndex === index
  const dimmed = !reduced && hoveredIndex !== null && hoveredIndex !== index

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        x: '-50%',
        y,
        rotate,
        width: cfg.sheetW,
        height: cfg.sheetH,
        marginTop: -cfg.sheetH / 2,
      }}
    >
      <div
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex((cur) => (cur === index ? null : cur))}
        className="relative h-full w-full"
        style={{
          overflow: 'hidden',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1), box-shadow 380ms ease, border-color 300ms ease, background 300ms ease, opacity 300ms ease',
          background: hovered ? SHEET_TONES_DEEP[index] : SHEET_TONES[index],
          border: `1px solid ${hovered ? 'rgba(197,138,42,0.55)' : BORDER}`,
          borderRadius: '3px',
          boxShadow: hovered ? '0 30px 54px -16px rgba(20,19,14,0.38)' : '0 20px 38px -14px rgba(20,19,14,0.28)',
          opacity: dimmed ? 0.96 : 1,
        }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-[6px] rounded-[2px]" style={{ background: INNER_SURFACES[index], border: `1px solid ${BORDER_SOFT}` }} />
        <TechnicalFrame tag={principle.tag} index={index} />
        <div className="relative h-full">
          <SheetBody principle={principle} index={index} active={!reduced} reduced={reduced} hovered={hovered} progress={visualT} />
        </div>
      </div>
    </motion.div>
  )
}

function PinnedWhyUs({ tier }) {
  const wrapRef = useRef(null)
  const reduced = useReducedMotion()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const cfg = TIER_CONFIG[tier]

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] })

  // ~1.1 viewport of actual scroll interaction beyond the sticky hold.
  // Assembly (see PinnedSheet) finishes by roughly 40% of that distance;
  // the remaining ~60% is an automatic, unanimated hold — the composition
  // simply sits still because nothing is left to interpolate — until the
  // wrapper's own scroll range ends and the section releases back into
  // normal document flow with no separate release animation required.
  return (
    <div ref={wrapRef} id="whyus" className="cursor-native-zone relative" style={{ height: '210vh' }}>
      <section className="sticky top-0 flex h-screen items-center overflow-hidden" style={{ background: BG }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 40% 35% at 12% 85%, rgba(197,138,42,0.06) 0%, rgba(197,138,42,0) 65%)' }}
        />

        <div className="relative mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-10 px-6 md:px-10 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-8 lg:pr-[6vw]">
          <div className="max-w-[400px]">
            {/* One-time entrance only — no scroll-linked opacity. Once
                mounted this content stays fully visible regardless of
                scroll position; only the sheets track scroll progress. */}
            <motion.div
              className="mb-6 inline-flex items-center gap-3"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <span className="h-px w-6" style={{ background: GOLD }} />
              <span className="text-[12px] font-semibold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
                Why Nirmora
              </span>
            </motion.div>

            <motion.h2
              className="font-display font-semibold leading-[1.1] tracking-tight"
              style={{ color: INK, fontSize: 'clamp(32px, 3.6vw, 46px)' }}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
            >
              It is <span style={{ color: GOLD }}>engineered.</span>
            </motion.h2>

            <motion.p
              className="mt-5 text-[15.5px] leading-relaxed"
              style={{ color: MUTED }}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.16 }}
            >
              A growth partner built around the whole system, not just one piece of it.
            </motion.p>
          </div>

          <div className="relative ml-auto" style={{ height: cfg.gap, width: cfg.sheetW + 70, maxWidth: '100%' }}>
            {PRINCIPLES.map((p, i) => (
              <PinnedSheet
                key={p.n}
                index={i}
                principle={p}
                progress={scrollYProgress}
                cfg={cfg}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

/* ============================================================================
   SEQUENTIAL layout — used on mobile (its own dedicated, compact
   composition — not a shrunk desktop, and not three full-screen slides) and
   whenever prefers-reduced-motion is on (any tier). Sheets are auto-height
   and content-driven, stacked with a short gap, each settling from a small
   tilt/offset once it scrolls into view. No pin, no continuous animation —
   the whole section stays within roughly 1.2–1.6 mobile viewport heights.
   ============================================================================ */
function SequentialSheet({ principle, index, animated }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const tilt = index % 2 === 0 ? -1.4 : 1.4
  const show = !animated || inView
  // Mobile diagrams aren't scroll-linked — always fully drawn; only the
  // whole card animates in as a unit.
  const staticProgress = useMotionValue(1)

  return (
    <div ref={ref} className="relative mx-auto w-[92vw] max-w-[420px]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 translate-x-[7px] translate-y-[7px] rounded-[3px]"
        style={{ background: 'rgba(244,241,232,0.06)', border: `1px solid ${BORDER_SOFT}` }}
      />
      <motion.div
        className="relative overflow-hidden rounded-[3px] px-5 py-5"
        style={{ background: SHEET_TONES[index], border: `1px solid ${BORDER}`, boxShadow: '0 18px 34px -16px rgba(20,19,14,0.24)' }}
        initial={animated ? { opacity: 0, y: 22, rotate: tilt, scale: 0.98 } : false}
        animate={show ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : {}}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-[6px] rounded-[2px]" style={{ background: INNER_SURFACES[index], border: `1px solid ${BORDER_SOFT}` }} />
        <TechnicalFrame tag={principle.tag} index={index} />

        <div className="relative">
          <span className="font-mono text-[12px] tracking-wide" style={{ color: SECONDARY }}>
            {principle.n}
          </span>
          <h3 className="mt-2 font-display text-[18px] font-semibold uppercase tracking-[0.02em]" style={{ color: INK }}>
            {principle.title}
          </h3>
          <p className="mt-2 text-[13px] leading-snug" style={{ color: MUTED }}>
            {principle.desc}
          </p>

          {(() => {
            const Visual = VISUALS[index]
            return <Visual active={animated && show} reduced={!animated} progress={staticProgress} />
          })()}
        </div>
      </motion.div>
    </div>
  )
}

function SequentialWhyUs({ animated }) {
  const introRef = useRef(null)
  const introInView = useInView(introRef, { once: true, amount: 0.25 })
  const showIntro = !animated || introInView

  return (
    <section id="whyus" className="cursor-native-zone relative w-full overflow-hidden py-14 md:py-16" style={{ background: BG }}>
      <div aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, ${BORDER}, transparent)` }} />
      <div aria-hidden className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, ${BORDER}, transparent)` }} />

      <div ref={introRef} className="mx-auto mb-8 max-w-[560px] px-6 text-center md:px-10">
        <motion.div
          className="mb-4 inline-flex items-center gap-3"
          initial={animated ? { opacity: 0, y: 10 } : false}
          animate={showIntro ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span className="h-px w-6" style={{ background: GOLD }} />
          <span className="text-[12px] font-semibold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
            Why Nirmora
          </span>
          <span className="h-px w-6" style={{ background: GOLD }} />
        </motion.div>

        <motion.h2
          className="font-display font-semibold leading-[1.14] tracking-tight"
          style={{ color: INK, fontSize: 'clamp(28px, 7.5vw, 38px)' }}
          initial={animated ? { opacity: 0, y: 16 } : false}
          animate={showIntro ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
        >
          It is <span style={{ color: GOLD }}>engineered.</span>
        </motion.h2>

        <motion.p
          className="mx-auto mt-3 max-w-[380px] text-[14px] leading-relaxed"
          style={{ color: MUTED }}
          initial={animated ? { opacity: 0, y: 12 } : false}
          animate={showIntro ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.14 }}
        >
          A growth partner built around the whole system, not just one piece of it.
        </motion.p>
      </div>

      <div className="flex flex-col gap-8 px-6">
        {PRINCIPLES.map((p, i) => (
          <SequentialSheet key={p.n} principle={p} index={i} animated={animated} />
        ))}
      </div>
    </section>
  )
}

// =============================================================================
// WHY NIRMORA — Architectural Layers. Desktop/tablet get a SHORT pinned
// section (~1.1 extra viewports of scroll) whose progress drives ONE thing:
// three sheets assembling from a slightly stacked/offset/rotated start into
// their resting position (position + rotation + a quick 0.8->1 opacity
// ramp — never blur, never scale, never a second fade-out). Every transform
// range finishes within roughly the first 40% of that scroll distance;
// framer-motion clamps values past a range's end by default, so the
// remaining ~60% is an automatic, do-nothing hold — the composition is
// simply still, fully visible and readable, until the wrapper's scroll
// distance runs out and the section releases into normal document flow.
// Mobile (and prefers-reduced-motion, any tier) gets its own compact,
// auto-height, non-pinned stack — same three cards, same content, no pin.
// =============================================================================
export default function WhyUs() {
  const reduced = useReducedMotion()
  const tier = useTier()

  if (reduced || tier === 'mobile') {
    return <SequentialWhyUs animated={!reduced} />
  }
  return <PinnedWhyUs tier={tier} />
}
