import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const EASE = [0.16, 0.84, 0.44, 1]
const INK = '#20221F'
const MUTED = '#66665F'
const FAINT = '#8A8981'
const HAIRLINE = 'rgba(32,34,31,0.14)'
const BG = '#FBF7EF'

// -----------------------------------------------------------------------------
// A quiet, editorial legal-document layout shared by Terms & Privacy. No
// orange/gold anywhere — hierarchy comes from type, spacing and thin lines
// only. Desktop gets a sticky table of contents that tracks scroll position;
// mobile gets a collapsible "Contents" panel. A 2px reading-progress line
// tracks page scroll at the very top of the viewport.
// -----------------------------------------------------------------------------
export default function LegalPage({
  docTitle,
  pageIndex,
  eyebrowLines,
  titleLines,
  description,
  lastUpdated,
  sections,
  contactPrefix,
  contactEmail,
}) {
  useEffect(() => {
    if (docTitle) document.title = docTitle
  }, [docTitle])

  const sectionRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const els = sectionRefs.current.filter(Boolean)
    if (!els.length) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index)
            if (!Number.isNaN(idx)) setActiveIndex(idx)
          }
        })
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections.length])

  const scrollToSection = (i) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[2px] z-40 origin-left pointer-events-none"
        style={{ scaleX: scrollYProgress, background: INK }}
      />

      <LegalHero
        pageIndex={pageIndex}
        eyebrowLines={eyebrowLines}
        titleLines={titleLines}
        description={description}
        lastUpdated={lastUpdated}
      />

      <section className="relative pb-28 md:pb-36" style={{ background: BG }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <MobileTOC sections={sections} activeIndex={activeIndex} onSelect={scrollToSection} />

          <div className="lg:flex lg:gap-16 xl:gap-24">
            <DesktopTOC sections={sections} activeIndex={activeIndex} onSelect={scrollToSection} />

            <div className="flex-1 min-w-0 lg:max-w-[760px]">
              {sections.map((s, i) => (
                <SectionBlock key={s.id} section={s} index={i} setRef={(el) => (sectionRefs.current[i] = el)} />
              ))}

              <LegalClosing contactPrefix={contactPrefix} contactEmail={contactEmail} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function LegalHero({ pageIndex, eyebrowLines, titleLines, description, lastUpdated }) {
  const reduced = useReducedMotion()

  return (
    <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden" style={{ background: BG }}>
      <div aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, ${HAIRLINE}, transparent)` }} />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-8">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-[11px] uppercase tracking-[0.25em] font-semibold mb-8"
          style={{ color: FAINT }}
        >
          {eyebrowLines.join(' / ')}
        </motion.div>

        <h1 className="font-display font-bold leading-[0.98] tracking-tight" style={{ color: INK, fontSize: 'clamp(42px, 7.6vw, 92px)' }}>
          {titleLines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={reduced ? false : { opacity: 0, y: '100%' }}
                animate={reduced ? undefined : { opacity: 1, y: '0%' }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.15 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-8 max-w-[600px] text-[15.5px] md:text-[17px] leading-[1.8]"
          style={{ color: MUTED }}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
        >
          {description}
        </motion.p>

        <motion.div
          className="mt-10 flex items-center gap-3"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.62 }}
        >
          <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold" style={{ color: FAINT }}>
            Last Updated
          </span>
          <span className="h-3 w-px" style={{ background: HAIRLINE }} />
          <span className="text-[13px] font-medium" style={{ color: INK }}>
            {lastUpdated}
          </span>
        </motion.div>

        <motion.div
          aria-hidden
          className="mt-14 h-px origin-left"
          style={{ background: HAIRLINE }}
          initial={reduced ? false : { scaleX: 0 }}
          animate={reduced ? undefined : { scaleX: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
        />

        <motion.div
          className="mt-6 font-mono text-[11px] tracking-[0.15em]"
          style={{ color: '#B4B2A9' }}
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          {pageIndex}
        </motion.div>
      </div>
    </section>
  )
}

function DesktopTOC({ sections, activeIndex, onSelect }) {
  return (
    <nav aria-label="Table of contents" className="hidden lg:block sticky top-32 self-start w-[220px] shrink-0 h-fit">
      <p className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-5" style={{ color: FAINT }}>
        Contents
      </p>
      <ul className="flex flex-col gap-0.5">
        {sections.map((s, i) => {
          const active = activeIndex === i
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                className="relative w-full text-left py-2 pl-4 text-[13.5px] leading-snug transition-all duration-300"
                style={{ color: active ? INK : FAINT, transform: active ? 'translateX(4px)' : 'translateX(0)' }}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[14px] w-px transition-colors duration-300"
                  style={{ background: active ? INK : 'rgba(32,34,31,0.18)' }}
                />
                <span className="font-mono text-[10.5px] mr-2" style={{ color: active ? INK : '#B4B2A9' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.title}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function MobileTOC({ sections, activeIndex, onSelect }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="lg:hidden mb-10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 px-5 border rounded-[14px] text-[12.5px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300"
        style={{ borderColor: HAIRLINE, color: INK }}
      >
        Contents
        <span
          aria-hidden
          className="text-[15px] leading-none transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </span>
      </button>

      <div className="grid transition-[grid-template-rows] duration-500 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <ul className="pt-3 pl-1 flex flex-col gap-0.5">
            {sections.map((s, i) => (
              <li
                key={s.id}
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(-6px)',
                  transition: `opacity 350ms ease ${open ? i * 0.05 : 0}s, transform 350ms ease ${open ? i * 0.05 : 0}s`,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelect(i)
                    setOpen(false)
                  }}
                  className="w-full text-left py-2.5 text-[14px]"
                  style={{ color: activeIndex === i ? INK : MUTED }}
                >
                  <span className="font-mono text-[11px] mr-2" style={{ color: '#B4B2A9' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function SectionBlock({ section, index, setRef }) {
  const localRef = useRef(null)
  const inView = useInView(localRef, { once: true, amount: 0.35 })
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: localRef, offset: ['start end', 'end start'] })
  const numberY = useTransform(scrollYProgress, [0, 1], [10, -10])

  const paragraphs = Array.isArray(section.body) ? section.body : [section.body]

  return (
    <div
      ref={(el) => {
        localRef.current = el
        setRef(el)
      }}
      data-index={index}
      id={section.id}
      className="scroll-mt-28 md:scroll-mt-32 py-9 md:py-12 first:pt-0"
      style={{ borderTop: index === 0 ? 'none' : `1px solid ${HAIRLINE}` }}
    >
      <div className="flex items-start gap-6 md:gap-10">
        <motion.span
          className="font-mono text-[13px] md:text-[14px] shrink-0 pt-1 transition-opacity duration-700"
          style={{ color: FAINT, y: reduced ? 0 : numberY, opacity: inView ? 1 : 0 }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>

        <div className="flex-1 min-w-0">
          <span className="block overflow-hidden">
            <motion.h2
              className="block font-display font-semibold uppercase tracking-tight"
              style={{ color: INK, fontSize: 'clamp(19px, 2.4vw, 25px)' }}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
            >
              {section.title}
            </motion.h2>
          </span>

          <motion.span
            aria-hidden
            className="mt-4 mb-6 block h-px origin-left"
            style={{ background: HAIRLINE }}
            initial={reduced ? false : { scaleX: 0 }}
            animate={reduced ? undefined : inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
          />

          {paragraphs.map((p, pi) => (
            <motion.p
              key={pi}
              className="text-[15px] md:text-[15.5px] leading-[1.8] max-w-[720px]"
              style={{ color: '#5B5A54', marginTop: pi > 0 ? '1em' : 0 }}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE, delay: 0.24 + pi * 0.06 }}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  )
}

function LegalClosing({ contactPrefix, contactEmail }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduced = useReducedMotion()

  return (
    <div ref={ref} className="pt-16 md:pt-20 mt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
      <motion.p
        className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-3"
        style={{ color: FAINT }}
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE }}
      >
        Questions?
      </motion.p>

      <motion.p
        className="text-[15px] md:text-[15.5px] leading-relaxed max-w-[520px]"
        style={{ color: '#5B5A54' }}
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
      >
        {contactPrefix} Reach us at{' '}
        <a
          href={`mailto:${contactEmail}`}
          className="underline underline-offset-4 transition-colors duration-300"
          style={{ color: INK, textDecorationColor: HAIRLINE }}
        >
          {contactEmail}
        </a>
        .
      </motion.p>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
        className="mt-8"
      >
        <Link to="/" className="group inline-flex items-center gap-2 text-[14px] font-semibold" style={{ color: INK }}>
          Back to Nirmora
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  )
}
