import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

// Nirmora's actual working principles — not client testimonials. No quote
// marks, no names, no companies, no ratings: nothing here claims to be a
// verified third-party endorsement.
const PRINCIPLES = [
  { n: '01', title: 'Direct Access', desc: 'You work directly with the people doing the work — not through unnecessary layers.' },
  { n: '02', title: 'Clear Reporting', desc: 'We explain what happened, what matters, and what comes next in language you can actually understand.' },
  { n: '03', title: 'One Accountable Team', desc: 'Strategy, creative, performance, website, CRM and the wider system work together instead of operating as disconnected pieces.' },
]

const MAIN_COPY =
  'No layers between you and the work. Direct access to the people doing it, reporting you can actually understand, and one team accountable for the whole system — not just a single piece of it.'

// Minimal editorial line-icons — thin stroke, no fills except the small
// connection dots already used elsewhere in this section's own language.
// When reduced motion is on, initial already equals the animate target and
// duration is 0 — the icon simply appears fully drawn, no stroke-draw motion.
function iconAnim(reduced, initial, animate, transition) {
  return reduced ? { initial: animate, animate, transition: { duration: 0 } } : { initial, animate, transition }
}

function DirectAccessIcon({ reduced, ...props }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" {...props}>
      <motion.path
        d="M5 4 L5 17 L9.2 13.6 L12.3 20 L14.6 18.9 L11.4 12.5 L16.5 12.5 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        strokeLinecap="round"
        {...iconAnim(reduced, { pathLength: 0 }, { pathLength: 1 }, { duration: 0.6, ease: EASE })}
      />
      <motion.path
        d="M15 11 L20 8.3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="1 2.6"
        {...iconAnim(reduced, { pathLength: 0, opacity: 0 }, { pathLength: 1, opacity: 1 }, { duration: 0.4, ease: EASE, delay: 0.25 })}
      />
      <motion.circle
        cx="22.5"
        cy="7"
        r="2.4"
        stroke="currentColor"
        strokeWidth="1.3"
        {...iconAnim(reduced, { pathLength: 0, scale: 0.6, opacity: 0 }, { pathLength: 1, scale: 1, opacity: 1 }, { duration: 0.4, ease: EASE, delay: 0.35 })}
        style={{ transformOrigin: '22.5px 7px' }}
      />
    </svg>
  )
}

function ClearReportingIcon({ reduced, ...props }) {
  return (
    <svg viewBox="0 0 28 28" fill="none" {...props}>
      <motion.path
        d="M2 13.5 C6.5 7, 21.5 7, 26 13.5 C21.5 20, 6.5 20, 2 13.5 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        {...iconAnim(reduced, { pathLength: 0 }, { pathLength: 1 }, { duration: 0.6, ease: EASE })}
      />
      <motion.circle
        cx="14"
        cy="13.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        {...iconAnim(reduced, { pathLength: 0, scale: 0.6, opacity: 0 }, { pathLength: 1, scale: 1, opacity: 1 }, { duration: 0.4, ease: EASE, delay: 0.2 })}
        style={{ transformOrigin: '14px 13.5px' }}
      />
      <motion.path
        d="M3.5 23 L8 20 L12 22 L16.5 17.5 L20.5 19.7 L24.5 15.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
        {...iconAnim(reduced, { pathLength: 0 }, { pathLength: 1 }, { duration: 0.45, ease: EASE, delay: 0.3 })}
      />
    </svg>
  )
}

function AccountableTeamIcon({ reduced, ...props }) {
  const dots = [
    { cx: 14, cy: 4.3 },
    { cx: 3.6, cy: 22 },
    { cx: 24.4, cy: 22 },
  ]
  return (
    <svg viewBox="0 0 28 28" fill="none" {...props}>
      <motion.path
        d="M14 6.6 L5.4 20.4 M14 6.6 L22.6 20.4 M6.4 21 L21.6 21"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        {...iconAnim(reduced, { pathLength: 0 }, { pathLength: 1 }, { duration: 0.6, ease: EASE })}
      />
      {dots.map((c, i) => (
        <motion.circle
          key={i}
          cx={c.cx}
          cy={c.cy}
          r="2.2"
          fill="currentColor"
          {...iconAnim(reduced, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1 }, { duration: 0.35, ease: EASE, delay: 0.3 + i * 0.08 })}
          style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
        />
      ))}
    </svg>
  )
}

const ICONS = [DirectAccessIcon, ClearReportingIcon, AccountableTeamIcon]

// True only for devices with a real hover-capable pointer (desktop mouse),
// so hover-only interaction never gets triggered/stuck on touch.
function useCanHover() {
  const [canHover, setCanHover] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setCanHover(mq.matches)
    const onChange = (e) => setCanHover(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return canHover
}

// A premium information card, not a floating editorial block — warm light
// surface, subtle border, restrained shadow, a discrete hover lift. Card
// number/icon/title/description in that fixed order, per card.
function PrincipleCard({ p, index, inView, reduced, canHover }) {
  const Icon = ICONS[index]
  const [hovered, setHovered] = useState(false)
  const isHovered = canHover && hovered

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-[16px] px-7 py-8 md:py-9"
      style={{
        background: isHovered ? '#FFFFFF' : '#FAF9F5',
        border: `1px solid ${isHovered ? 'rgba(197,138,42,0.35)' : 'rgba(32,34,31,0.1)'}`,
        boxShadow: isHovered ? '0 22px 46px -26px rgba(32,34,31,0.2)' : '0 10px 26px -22px rgba(32,34,31,0.12)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'transform 350ms cubic-bezier(0.22,1,0.36,1), background 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
      }}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={reduced || inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : index * 0.12 }}
    >
      <span className="font-mono text-[12px] tracking-[0.12em]" style={{ color: '#C58A2A' }}>
        {p.n}
      </span>

      <div className="mt-5 mb-4" style={{ color: isHovered ? '#C58A2A' : '#20221F', transition: 'color 300ms ease' }}>
        <Icon reduced={reduced} className="w-6 h-6" aria-hidden="true" />
      </div>

      <h3 className="font-display text-[19px] font-semibold" style={{ color: '#20221F' }}>
        {p.title}
      </h3>
      <p className="mt-2.5 text-[13.5px] leading-relaxed" style={{ color: '#66665F' }}>
        {p.desc}
      </p>
    </motion.div>
  )
}

function Principles({ inView, reduced, canHover }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
      {PRINCIPLES.map((p, i) => (
        <PrincipleCard key={p.n} p={p} index={i} inView={inView} reduced={reduced} canHover={canHover} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const reduced = useReducedMotion()
  const canHover = useCanHover()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section id="testimonials" ref={ref} className="section-light section-pad-dark">
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full blur-[130px] bg-[radial-gradient(circle,rgba(197,138,42,0.08)_0%,rgba(197,138,42,0)_70%)]" />

      <div className="relative max-w-[1180px] mx-auto px-6 md:px-8">
        <div className="max-w-[680px] mx-auto text-center mb-14 md:mb-16">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="eyebrow justify-center"
          >
            Client Voices
          </motion.div>

          <h2 className="font-display font-bold text-[30px] md:text-[44px] text-[#20221F] leading-[1.1]">
            <span className="block overflow-hidden">
              <motion.span
                initial={reduced ? undefined : { opacity: 0, y: 22 }}
                animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}
                className="block"
              >
                What it&apos;s like to
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={reduced ? undefined : { opacity: 0, y: 22 }}
                animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
                className="block"
              >
                actually work with <span className="text-[#C58A2A]">us</span>.
              </motion.span>
            </span>
          </h2>

          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.42 }}
            className="mt-6 text-[15px] md:text-[16px] leading-relaxed"
            style={{ color: '#66665F' }}
          >
            {MAIN_COPY}
          </motion.p>
        </div>

        <Principles inView={inView} reduced={reduced} canHover={canHover} />
      </div>
    </section>
  )
}
