import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Reveal, { RevealStagger, RevealItem } from './Reveal.jsx'

const STEPS = [
  { n: '01', title: 'Discover', desc: 'We study your brand, audience and business goals from the inside out — no assumptions.' },
  { n: '02', title: 'Strategize', desc: 'A channel plan tied to specific, measurable growth targets — not guesswork.' },
  { n: '03', title: 'Build', desc: 'Brand, website, CRM and creative — built as one connected system, not disjointed pieces.' },
  { n: '04', title: 'Launch', desc: 'Campaigns and product ship in tightly scoped, fast-moving sprints.' },
  { n: '05', title: 'Optimize', desc: 'We read the data weekly, cut what isn’t converting, and scale what works.' },
]

const EASE = [0.22, 1, 0.36, 1]
const GRADIENT = 'linear-gradient(135deg, #D9A441, #C58A2A)'
const ACCENT = '#C58A2A'
const LINE = '#20221F'
const NEUTRAL = 'rgba(32,34,31,0.35)'

/* ============================================================================
   FIVE-STAGE PROCESS ANIMATION — one connected story told in small, abstract
   2D geometry anchored to the existing circles, driven entirely by scroll
   progress through the section (fully reversible, no autoplay):

     01 Discover   — scattered points gather toward the circle
     02 Strategize — points align into a small geometric structure
     03 Build      — the structure grows connections into a tiny network
     04 Launch     — the network compresses into a marker that accelerates
     05 Optimize   — the marker slows and traces one settling loop

   Nothing here touches the section's copy, layout, circles or line — every
   piece below is a purely additive, pointer-events-none overlay.
   ============================================================================ */

function useStepProgress(scrollYProgress, start, end) {
  return useTransform(scrollYProgress, [start, end], [0, 1], { clamp: true })
}

function useTravelDistance(fromRef, toRef, axis) {
  const [travel, setTravel] = useState(120)
  useEffect(() => {
    function measure() {
      if (!fromRef.current || !toRef.current) return
      const a = fromRef.current.getBoundingClientRect()
      const b = toRef.current.getBoundingClientRect()
      const d =
        axis === 'x'
          ? b.left + b.width / 2 - (a.left + a.width / 2)
          : b.top + b.height / 2 - (a.top + a.height / 2)
      if (d > 0) setTravel(d)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [fromRef, toRef, axis])
  return travel
}

/* --------------------------------- Shared bits --------------------------------- */

// A small ring around the step's own circle — the "this step is active" cue,
// reused identically across all five steps for visual consistency.
function StepGlow({ progress, reduced }) {
  const opacity = useTransform(progress, [0, 0.25, 1], [0, 1, 0.5])
  const scale = useTransform(progress, [0, 0.2, 0.3], [1, 1.06, 1])
  if (reduced) {
    return (
      <motion.div
        aria-hidden
        className="absolute inset-[-6px] rounded-full pointer-events-none"
        style={{ border: '1px solid rgba(197,138,42,0.5)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.55 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
    )
  }
  return (
    <motion.div
      aria-hidden
      className="absolute inset-[-6px] rounded-full pointer-events-none"
      style={{ border: '1px solid rgba(197,138,42,0.5)', boxShadow: '0 0 12px rgba(197,138,42,0.3)', opacity, scale }}
    />
  )
}

// One small point. Fades in, optionally drifts from (x,y) to (toX,toY), and
// optionally fades back out — all driven by the same local step progress.
function AnimDot({ x, y, toX = x, toY = y, progress, fadeInStart, fadeInEnd, moveStart = 0, moveEnd = 0.001, fadeOutStart = 999, fadeOutEnd = 999.1, color, r = 2.4 }) {
  const cx = useTransform(progress, [moveStart, moveEnd], [x, toX])
  const cy = useTransform(progress, [moveStart, moveEnd], [y, toY])
  const opacity = useTransform(progress, [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd], [0, 1, 1, 0])
  return <motion.circle cx={cx} cy={cy} r={r} fill={color} style={{ opacity }} />
}

// One connecting line that draws itself in via pathLength.
function AnimLine({ x1, y1, x2, y2, progress, drawStart, drawEnd, color = LINE, holdOpacity = 0.7 }) {
  const pathLength = useTransform(progress, [drawStart, drawEnd], [0, 1])
  const opacity = useTransform(progress, [drawStart, Math.min(drawStart + 0.02, 1)], [0, holdOpacity])
  return <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} strokeLinecap="round" style={{ pathLength, opacity }} />
}

// A thin expanding, fading ring — the "settle" pulse at the end of a stage.
function StagePulse({ progress, start, peak, end }) {
  const r = useTransform(progress, [start, end], [10, 24])
  const opacity = useTransform(progress, [start, peak, end], [0, 0.7, 0])
  return <motion.circle cx={0} cy={0} r={r} fill="none" stroke={LINE} strokeWidth={1} style={{ opacity }} />
}

function Overlay({ children }) {
  return (
    <svg
      aria-hidden
      viewBox="-50 -50 100 100"
      className="pointer-events-none absolute overflow-visible"
      style={{ width: 100, height: 100, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    >
      {children}
    </svg>
  )
}

/* ------------------------------- 01 — Discover ------------------------------- */
// Scattered information → gathering → discovery.

const DISCOVER_POINTS = [
  { x: -34, y: -20 },
  { x: 30, y: -28 },
  { x: -26, y: 26 },
  { x: 32, y: 20 },
  { x: 2, y: -36 },
]

function DiscoverAnim({ progress, reduced, compact }) {
  if (reduced) {
    return (
      <Overlay>
        <motion.circle
          cx={0} cy={0} r={0} fill="none" stroke={LINE} strokeWidth={1}
          initial={{ opacity: 0, r: 8 }} whileInView={{ opacity: 0.6, r: 18 }}
          viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6, ease: EASE }}
        />
      </Overlay>
    )
  }
  const points = compact ? DISCOVER_POINTS.slice(0, 4) : DISCOVER_POINTS
  return (
    <Overlay>
      {points.map((p, i) => {
        const d = i * 0.025
        return (
          <AnimDot
            key={i}
            x={p.x} y={p.y} toX={0} toY={0}
            progress={progress}
            fadeInStart={0.08 + d} fadeInEnd={0.24 + d}
            moveStart={0.4} moveEnd={0.82 + d}
            fadeOutStart={0.85 + d} fadeOutEnd={0.96 + d}
            color={i % 2 === 0 ? ACCENT : NEUTRAL}
          />
        )
      })}
      <StagePulse progress={progress} start={0.84} peak={0.92} end={1} />
    </Overlay>
  )
}

/* ------------------------------ 02 — Strategize ------------------------------ */
// Information → structure. Points align into a small diamond framework.

const STRUCTURE_POINTS = [
  { x: 0, y: -26 },
  { x: 26, y: 0 },
  { x: 0, y: 26 },
  { x: -26, y: 0 },
]

function StrategizeAnim({ progress, reduced }) {
  if (reduced) {
    return (
      <Overlay>
        <motion.path
          d="M 0 -14 L 14 0 L 0 14 L -14 0 Z" fill="none" stroke={LINE} strokeWidth={1}
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }}
          viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6, ease: EASE }}
        />
      </Overlay>
    )
  }
  return (
    <Overlay>
      {STRUCTURE_POINTS.map((p, i) => (
        <AnimDot
          key={i}
          x={p.x * 0.3} y={p.y * 0.3} toX={p.x} toY={p.y}
          progress={progress}
          fadeInStart={0.04} fadeInEnd={0.16}
          moveStart={0.18} moveEnd={0.48}
          color={ACCENT}
        />
      ))}
      <AnimLine x1={0} y1={-26} x2={26} y2={0} progress={progress} drawStart={0.54} drawEnd={0.67} />
      <AnimLine x1={26} y1={0} x2={0} y2={26} progress={progress} drawStart={0.62} drawEnd={0.75} />
      <AnimLine x1={0} y1={26} x2={-26} y2={0} progress={progress} drawStart={0.7} drawEnd={0.83} />
      <AnimLine x1={-26} y1={0} x2={0} y2={-26} progress={progress} drawStart={0.78} drawEnd={0.91} />
      <StagePulse progress={progress} start={0.9} peak={0.96} end={1} />
    </Overlay>
  )
}

/* --------------------------------- 03 — Build --------------------------------- */
// Structure → connected system. A small hub-and-spoke network assembles.

function BuildAnim({ progress, reduced }) {
  if (reduced) {
    return (
      <Overlay>
        <motion.g
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }}
          viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6, ease: EASE }}
        >
          <path d="M 0 -14 L 14 0 L 0 14 L -14 0 Z M 0 0 L 0 -14 M 0 0 L 14 0 M 0 0 L 0 14 M 0 0 L -14 0" fill="none" stroke={LINE} strokeWidth={1} />
        </motion.g>
      </Overlay>
    )
  }
  return (
    <Overlay>
      {STRUCTURE_POINTS.map((p, i) => (
        <AnimDot key={i} x={p.x} y={p.y} progress={progress} fadeInStart={0} fadeInEnd={0.06} color={ACCENT} />
      ))}
      <AnimLine x1={0} y1={-26} x2={26} y2={0} progress={progress} drawStart={0} drawEnd={0.05} color="rgba(32,34,31,0.28)" holdOpacity={0.28} />
      <AnimLine x1={26} y1={0} x2={0} y2={26} progress={progress} drawStart={0} drawEnd={0.05} color="rgba(32,34,31,0.28)" holdOpacity={0.28} />
      <AnimLine x1={0} y1={26} x2={-26} y2={0} progress={progress} drawStart={0} drawEnd={0.05} color="rgba(32,34,31,0.28)" holdOpacity={0.28} />
      <AnimLine x1={-26} y1={0} x2={0} y2={-26} progress={progress} drawStart={0} drawEnd={0.05} color="rgba(32,34,31,0.28)" holdOpacity={0.28} />

      <AnimDot x={0} y={0} progress={progress} fadeInStart={0.1} fadeInEnd={0.22} color={ACCENT} r={2.8} />

      <AnimLine x1={0} y1={0} x2={0} y2={-26} progress={progress} drawStart={0.28} drawEnd={0.42} />
      <AnimLine x1={0} y1={0} x2={26} y2={0} progress={progress} drawStart={0.4} drawEnd={0.54} />
      <AnimLine x1={0} y1={0} x2={0} y2={26} progress={progress} drawStart={0.52} drawEnd={0.66} />
      <AnimLine x1={0} y1={0} x2={-26} y2={0} progress={progress} drawStart={0.64} drawEnd={0.78} />

      <StagePulse progress={progress} start={0.86} peak={0.94} end={1} />
    </Overlay>
  )
}

/* --------------------------------- 04 — Launch --------------------------------- */
// System → momentum. The network compresses into a marker that accelerates.

function MarkerBase({ axis, children }) {
  const isX = axis === 'x'
  // Off the circle's own centerline (up for both the horizontal desktop row
  // and the vertical mobile rail) so the marker never sits on the digit —
  // its glow and the digit share the same accent color and blend together
  // at a glance if they overlap.
  const offset = isX ? 'translate(-50%, calc(-50% - 30px))' : 'translate(-50%, calc(-50% - 16px))'
  return (
    <div aria-hidden className="absolute top-1/2 left-1/2 pointer-events-none z-20" style={{ transform: offset }}>
      {children}
    </div>
  )
}

function LaunchAnim({ progress, travel, axis, reduced }) {
  const isX = axis === 'x'

  // Fades IN briefly (the built structure arriving), then out as it
  // compresses — must start at 0, not 1, or it would sit fully visible on
  // Step 04's circle from page load until scroll ever reaches this band.
  const networkOpacity = useTransform(progress, [0, 0.03, 0.09, 0.13], [0, 0.55, 0.55, 0])
  const markerOpacity = useTransform(progress, [0.06, 0.16], [0, 1])
  const markerScaleIn = useTransform(progress, [0.06, 0.16], [0.6, 1])

  const pos = useTransform(
    progress,
    [0.16, 0.3, 0.36, 0.4, 0.44, 0.5, 0.72, 0.9, 1],
    [0, 0, -4, 2, 0, 4, travel * 0.5, travel * 0.78, travel * 0.76]
  )
  const moveScale = useTransform(progress, [0.16, 0.4, 0.44, 0.5, 0.6, 0.72, 1], [1, 1, 0.97, 1.02, 1.015, 1.03, 1])
  const trailScale = useTransform(progress, [0.44, 0.52, 0.85, 1], [0, 1, 1, 0])
  const trailOpacity = useTransform(progress, [0.44, 0.5, 0.8, 0.92, 1], [0, 0.8, 0.6, 0.15, 0])
  const pulse = useTransform(progress, [0.16, 0.22, 0.3], [0, 0.7, 0])

  if (reduced) {
    return (
      <MarkerBase axis={axis}>
        <motion.div
          initial={{ opacity: 0, ...(isX ? { x: 6 } : { y: 6 }) }}
          whileInView={{ opacity: 1, ...(isX ? { x: 0 } : { y: 0 }) }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="w-[8px] h-[8px] rotate-45"
          style={{ background: GRADIENT, boxShadow: '0 0 6px rgba(197,138,42,0.5)' }}
        />
      </MarkerBase>
    )
  }

  return (
    <>
      <Overlay>
        <motion.g style={{ opacity: networkOpacity }}>
          {STRUCTURE_POINTS.map((p, i) => (
            <circle key={i} cx={p.x * 0.65} cy={p.y * 0.65} r={1.8} fill={ACCENT} opacity={0.55} />
          ))}
        </motion.g>
      </Overlay>
      <MarkerBase axis={axis}>
        <motion.div
          className="absolute top-1/2 left-1/2 rounded-full"
          style={
            isX
              ? { x: pos, scaleX: trailScale, opacity: trailOpacity, transformOrigin: 'right center', width: 22, height: 2, marginTop: -1, marginLeft: -22, background: 'linear-gradient(90deg, transparent, rgba(197,138,42,0.7))' }
              : { y: pos, scaleY: trailScale, opacity: trailOpacity, transformOrigin: 'center bottom', width: 2, height: 22, marginTop: -22, marginLeft: -1, background: 'linear-gradient(180deg, transparent, rgba(197,138,42,0.7))' }
          }
        />
        <motion.div style={isX ? { x: pos, scale: moveScale, opacity: markerOpacity } : { y: pos, scale: moveScale, opacity: markerOpacity }} className="relative">
          <motion.div
            aria-hidden
            className="absolute -inset-1.5 rounded-full"
            style={{ opacity: pulse, background: 'radial-gradient(circle, rgba(197,138,42,0.5), transparent 70%)' }}
          />
          <motion.div
            className="w-[8px] h-[8px] rotate-45"
            style={{ scale: markerScaleIn, background: GRADIENT, boxShadow: '0 0 6px rgba(197,138,42,0.5)' }}
          />
        </motion.div>
      </MarkerBase>
    </>
  )
}

/* -------------------------------- 05 — Optimize -------------------------------- */
// Momentum → continuous loop. The marker slows, traces one settling orbit.

function OptimizeAnim({ progress, axis, reduced }) {
  const angle = useTransform(progress, [0.22, 0.72], [0, 360])
  const radius = useTransform(progress, [0.22, 0.32, 0.64, 0.78], [0, 15, 15, 0])
  const angleRad = useTransform(angle, (a) => (a * Math.PI) / 180)
  const loopX = useTransform([angleRad, radius], ([a, r]) => r * Math.sin(a))
  const loopY = useTransform([angleRad, radius], ([a, r]) => -r * (1 - Math.cos(a)))
  const guidePathLength = useTransform(progress, [0.22, 0.72], [0, 1])
  const guideOpacity = useTransform(progress, [0.24, 0.32, 0.75, 0.85], [0, 0.5, 0.5, 0])
  const markerOpacity = useTransform(progress, [0, 0.12, 0.82, 1], [0, 1, 1, 0.7])
  const pulse = useTransform(progress, [0.85, 0.92, 1], [0, 0.7, 0])

  if (reduced) {
    return (
      <MarkerBase axis={axis}>
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.7 }}
          viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5, ease: EASE }}
          className="relative"
        >
          <div className="w-[8px] h-[8px] rounded-full" style={{ border: `1px solid ${ACCENT}` }} />
        </motion.div>
      </MarkerBase>
    )
  }

  return (
    <MarkerBase axis={axis}>
      <Overlay>
        <motion.circle cx={0} cy={-15} r={15} fill="none" stroke={LINE} strokeWidth={1} style={{ pathLength: guidePathLength, opacity: guideOpacity }} />
      </Overlay>
      <motion.div style={{ x: loopX, y: loopY, opacity: markerOpacity }} className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
        <motion.div aria-hidden className="absolute -inset-1.5 rounded-full" style={{ opacity: pulse, background: 'radial-gradient(circle, rgba(197,138,42,0.5), transparent 70%)' }} />
        <div className="w-[8px] h-[8px] rotate-45" style={{ background: GRADIENT, boxShadow: '0 0 6px rgba(197,138,42,0.5)' }} />
      </motion.div>
    </MarkerBase>
  )
}

/* ------------------------------- Step dispatcher ------------------------------- */

function StepAnim({ index, axis, progress, travel, reduced, compact }) {
  if (index === 0) return <DiscoverAnim progress={progress} reduced={reduced} compact={compact} />
  if (index === 1) return <StrategizeAnim progress={progress} reduced={reduced} />
  if (index === 2) return <BuildAnim progress={progress} reduced={reduced} />
  if (index === 3) return <LaunchAnim progress={progress} travel={travel} axis={axis} reduced={reduced} />
  if (index === 4) return <OptimizeAnim progress={progress} axis={axis} reduced={reduced} />
  return null
}

const BANDS = [0, 0.2, 0.4, 0.6, 0.8, 1]

export default function Process() {
  const reduced = useReducedMotion()

  const desktopWrapRef = useRef(null)
  const d04Ref = useRef(null)
  const d05Ref = useRef(null)

  const mobileWrapRef = useRef(null)
  const m04Ref = useRef(null)
  const m05Ref = useRef(null)

  // The circle row itself is short next to the viewport, so the default
  // "fully enters -> fully exits" mapping spends most of progress 0-1 on
  // the row being mostly off-screen, pushing Launch/Optimize (the back
  // half of the 5-stage story) past the point where the row has already
  // scrolled out of view. Narrowing the crossing points keeps progress
  // 0-1 within the window where the row is actually well inside the
  // viewport, so every stage stays watchable while it plays.
  const { scrollYProgress: dScroll } = useScroll({ target: desktopWrapRef, offset: ['start 0.75', 'end 0.25'] })
  const { scrollYProgress: mScroll } = useScroll({ target: mobileWrapRef, offset: ['start 0.75', 'end 0.25'] })

  const dTravel = useTravelDistance(d04Ref, d05Ref, 'x')
  const mTravel = useTravelDistance(m04Ref, m05Ref, 'y')

  const dProgress = [
    useStepProgress(dScroll, BANDS[0], BANDS[1]),
    useStepProgress(dScroll, BANDS[1], BANDS[2]),
    useStepProgress(dScroll, BANDS[2], BANDS[3]),
    useStepProgress(dScroll, BANDS[3], BANDS[4]),
    useStepProgress(dScroll, BANDS[4], BANDS[5]),
  ]
  const mProgress = [
    useStepProgress(mScroll, BANDS[0], BANDS[1]),
    useStepProgress(mScroll, BANDS[1], BANDS[2]),
    useStepProgress(mScroll, BANDS[2], BANDS[3]),
    useStepProgress(mScroll, BANDS[3], BANDS[4]),
    useStepProgress(mScroll, BANDS[4], BANDS[5]),
  ]

  return (
    <section id="process" className="relative overflow-hidden section-pad-dark bg-[#DCD8CE]">
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-8">
        <Reveal className="max-w-[680px] mx-auto text-center mb-20">
          <div className="eyebrow justify-center">Our Process</div>
          <h2 className="font-display font-bold text-[30px] md:text-[44px] text-[#20221F] leading-[1.1]">
            A five-step system,
            <br />
            run on every <span className="text-[#C58A2A]">project</span>.
          </h2>
          <p className="mt-5 text-[16px] text-[#66665F]">
            Nothing improvised. Every engagement moves through the same disciplined
            sequence, so growth compounds instead of resetting each month.
          </p>
        </Reveal>

        {/* Horizontal connected timeline — desktop */}
        <div ref={desktopWrapRef} className="hidden md:block relative">
          <div className="absolute top-[27px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#20221F]/20 to-transparent" />
          <RevealStagger className="grid grid-cols-5 gap-6">
            {STEPS.map((s, i) => (
              <RevealItem key={s.n} className="relative flex flex-col items-center text-center px-2">
                <div
                  ref={i === 3 ? d04Ref : i === 4 ? d05Ref : undefined}
                  className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center border border-[#20221F]/14 bg-[#F4F0E7] font-mono text-[13px] text-[#20221F] mb-6"
                >
                  <span className="relative z-30">{s.n}</span>
                  <StepGlow progress={dProgress[i]} reduced={reduced} />
                  <StepAnim index={i} axis="x" progress={dProgress[i]} travel={dTravel} reduced={reduced} />
                </div>
                <h4 className="font-display text-[19px] font-semibold text-[#20221F] mb-2.5">{s.title}</h4>
                <p className="text-[13.5px] leading-relaxed text-[#66665F]">{s.desc}</p>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>

        {/* Vertical connected timeline — mobile. A true two-column grid: a
            fixed 64px marker column (line + circle) and a fluid content
            column, physically separate CSS Grid tracks rather than
            absolute-position math. A circle constrained to its own grid
            column cannot visually reach into the content column next to
            it — that's what makes this immune to the class of overlap bug
            two earlier absolute-positioned attempts had. The marker
            column is wide enough (64px) to contain StepGlow's 6px ring
            expansion and the 02 step's rotated-diamond overlay too, so
            neither bleeds into the heading beside it. */}
        <div ref={mobileWrapRef} className="md:hidden relative">
          <div
            aria-hidden
            className="pointer-events-none absolute top-6 bottom-6 w-px bg-gradient-to-b from-[#20221F]/22 via-[#20221F]/14 to-[#20221F]/22"
            style={{ left: 32 }}
          />
          <RevealStagger className="flex flex-col gap-9">
            {STEPS.map((s, i) => (
              <RevealItem key={s.n} className="w-full">
                <div className="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-x-4">
                  <div className="flex items-center justify-center">
                    <div
                      ref={i === 3 ? m04Ref : i === 4 ? m05Ref : undefined}
                      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#20221F]/14 bg-[#F4F0E7] font-mono text-[12px] text-[#20221F]"
                    >
                      <span className="relative z-30">{s.n}</span>
                      <StepGlow progress={mProgress[i]} reduced={reduced} />
                      <StepAnim index={i} axis="y" progress={mProgress[i]} travel={mTravel} reduced={reduced} compact />
                    </div>
                  </div>
                  <div className="min-w-0 pt-1.5">
                    <h4 className="font-display text-[19px] font-semibold text-[#20221F]">{s.title}</h4>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-[#66665F]">{s.desc}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  )
}
