import { useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal.jsx'
import { FAQS } from '../data/faqs.js'

const EASE = [0.22, 1, 0.36, 1]
const ACCENT = '#C58A2A'

/* ============================================================================
   FAQ — "interactive conversation" instead of an accordion. A thin spine
   line draws in beside an editorial list of questions; each question is
   plain typography (no card, no border box, no plus icon) that expands its
   answer directly beneath itself. Content is unchanged from data/faqs.js —
   this is a presentation-only rework of the existing homepage section.
   ============================================================================ */

function QuestionRow({ item, index, open, onToggle, inView, reduced }) {
  const baseId = useId()
  const numStr = String(index + 1).padStart(2, '0')

  const rowEntrance = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: inView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, ease: EASE, delay: 0.08 * index },
      }

  return (
    <motion.div {...rowEntrance} className="group relative">
      <div
        className="relative py-6 md:py-7 transition-colors duration-300"
        style={{ borderBottom: `1px solid ${open ? 'rgba(197,138,42,0.4)' : 'rgba(32,34,31,0.14)'}` }}
      >
        <button
          type="button"
          id={`${baseId}-q`}
          aria-expanded={open}
          aria-controls={`${baseId}-a`}
          onClick={onToggle}
          className="w-full text-left flex items-start gap-4 md:gap-5 outline-none focus-visible:ring-1 focus-visible:ring-[#C58A2A]/60 rounded-sm"
        >
          <span
            className="font-mono text-[11px] pt-1.5 shrink-0 transition-colors duration-300"
            style={{ color: open ? ACCENT : '#8A8981' }}
          >
            {numStr}
          </span>

          <span className="flex-1 flex items-start justify-between gap-4 md:gap-6">
            <span
              className="font-display font-semibold leading-[1.3] transition-all duration-300 md:group-hover:translate-x-[5px]"
              style={{
                fontSize: 'clamp(16.5px, 1.6vw, 19px)',
                color: open ? '#20221F' : 'rgba(32,34,31,0.82)',
                display: 'inline-block',
              }}
            >
              {item.q}
            </span>

            <span className="shrink-0 pt-1.5 font-mono text-[13px]" style={{ color: ACCENT }} aria-hidden="true">
              {open ? (
                '−'
              ) : (
                <span className="hidden md:inline-block opacity-0 -translate-x-1 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-300">
                  ↗
                </span>
              )}
            </span>
          </span>
        </button>

        <div className="pl-[calc(11px+1rem)] md:pl-[calc(11px+1.25rem)]">
          <div className="grid transition-[grid-template-rows] duration-400 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
            <div className="overflow-hidden">
              <AnimatePresence>
                {open && (
                  <motion.p
                    id={`${baseId}-a`}
                    role="region"
                    aria-labelledby={`${baseId}-q`}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: reduced ? 0.15 : 0.35, ease: EASE, delay: open ? 0.08 : 0 }}
                    className="pt-3 pb-1 text-[14px] md:text-[14.5px] leading-relaxed max-w-[520px]"
                    style={{ color: '#66665F' }}
                  >
                    {item.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)
  const reduced = useReducedMotion()
  const preview = FAQS.slice(0, 5)

  const listRef = useRef(null)
  const inView = useInView(listRef, { once: true, amount: 0.2 })

  return (
    <section id="faq" className="section-light section-pad-dark">
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-[0.8fr_1.1fr] gap-14">
        <Reveal>
          <div className="eyebrow">FAQ</div>
          <h2 className="font-display font-bold text-[30px] md:text-[42px] text-[#20221F] leading-[1.1]">
            Questions we
            <br />
            get asked <span className="text-[#C58A2A]">most</span>.
          </h2>
          <p className="mt-5 text-[16px] text-[#66665F]">
            Can&apos;t find what you&apos;re looking for?{' '}
            <Link to="/faq" className="text-[#C58A2A] font-bold">
              See the full FAQ
            </Link>
            .
          </p>
        </Reveal>

        <div ref={listRef} className="relative">
          {/* thin spine — draws in once the section enters view */}
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-px origin-top"
            style={{ background: 'linear-gradient(180deg, rgba(32,34,31,0.35), rgba(32,34,31,0.08))' }}
            initial={reduced ? undefined : { scaleY: 0 }}
            animate={reduced ? undefined : inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          />

          <div className="pl-6 md:pl-8">
            {preview.map((item, i) => (
              <QuestionRow
                key={item.q}
                item={item}
                index={i}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                inView={inView}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
