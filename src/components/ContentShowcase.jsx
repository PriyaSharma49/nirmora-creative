import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import succeedGraphic from '../assets/social/succeed.webp'
import timeGraphic from '../assets/social/time.webp'
import contentCalendar from '../assets/services/section5-social-media-marketing-01.png'
import onSet from '../assets/services/section5-influencer-02.png'
import proofVisual from '../assets/services/section5-influencer-01.png'

/* ============================================================================
   CONTENT SHOWCASE — homepage-only section, self-contained. Sits between
   Services and Portfolio. Uses the same section-dark / eyebrow utilities
   already shared across the homepage rather than introducing new global
   styles. Every image is either an unbranded creative graphic or a Nirmora-
   owned concept image with no visible third-party name/logo/contact
   information baked in — nothing here is presented as a named client
   project; captions use neutral, honest editorial labels instead.
   ============================================================================ */

const EASE = [0.22, 1, 0.36, 1]

const CARDS = [
  { img: succeedGraphic, title: 'Creative Concept', category: 'CONTENT STUDY' },
  { img: timeGraphic, title: 'Visual Language', category: 'CREATIVE DIRECTION' },
  { img: contentCalendar, title: 'Content Calendar', category: 'CONTENT PLANNING' },
  { img: onSet, title: 'On Set', category: 'CONTENT PRODUCTION' },
]

// Small, per-card entry offsets (Animation 5) — a few px of directionality
// per card rather than one uniform fade-up, all settling to the same rest
// position. Kept well under 30px so the row never feels like it's flying in.
const CARD_OFFSETS = [
  { x: -20, y: 24 },
  { x: 0, y: 32 },
  { x: 20, y: 24 },
  { x: 12, y: 30 },
]

const cardVariants = {
  hidden: (i) => ({ opacity: 0, scale: 0.97, x: CARD_OFFSETS[i % 4].x, y: CARD_OFFSETS[i % 4].y }),
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.1 },
  }),
}

const imageVariants = {
  hidden: (i) => ({ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.06 }),
  visible: (i) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    scale: 1,
    transition: { duration: 0.9, ease: EASE, delay: i * 0.1 + 0.15 },
  }),
  hover: { scale: 1.03, transition: { duration: 0.5, ease: EASE } },
}

const titleVariants = {
  hidden: (i) => ({ opacity: 0, y: 12 }),
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: i * 0.1 + 0.55 } }),
  hover: { y: -3, transition: { duration: 0.3, ease: EASE } },
}

const categoryVariants = {
  hidden: (i) => ({ opacity: 0, y: 12 }),
  visible: (i) => ({ opacity: 0.6, y: 0, transition: { duration: 0.5, ease: EASE, delay: i * 0.1 + 0.64 } }),
  hover: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
}

function ContentCard({ card, index, reduced }) {
  if (reduced) {
    return (
      <div>
        <div className="relative overflow-hidden rounded-[20px]" style={{ aspectRatio: '3/4', border: '1px solid rgba(32,34,31,0.14)' }}>
          <img src={card.img} alt={card.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="mt-4">
          <div className="font-display font-semibold text-[16px] text-[#20221F]">{card.title}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8981]">{card.category}</div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.35 }}
      variants={cardVariants}
    >
      <div
        className="relative overflow-hidden rounded-[20px]"
        style={{
          aspectRatio: '3/4',
          border: '1px solid rgba(32,34,31,0.14)',
          boxShadow: '0 24px 60px -30px rgba(0,0,0,0.6)',
        }}
      >
        <motion.div custom={index} variants={imageVariants} className="absolute inset-0">
          <img src={card.img} alt={card.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        </motion.div>
      </div>
      <div className="mt-4">
        <motion.div custom={index} variants={titleVariants} className="font-display font-semibold text-[16px] text-[#20221F]">
          {card.title}
        </motion.div>
        <motion.div custom={index} variants={categoryVariants} className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8A8981]">
          {card.category}
        </motion.div>
      </div>
    </motion.div>
  )
}

function ProofBlock({ reduced }) {
  const visualRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: visualRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-14, 14])

  return (
    <div className="mt-20 md:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 24 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="lg:col-span-6"
      >
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="eyebrow"
        >
          The Craft
        </motion.div>
        <motion.h3
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="font-display font-semibold text-[30px] md:text-[42px] leading-[1.12] tracking-tight text-[#20221F]"
        >
          Creative built to <span className="text-[#C58A2A]">earn attention.</span>
        </motion.h3>
        <motion.p
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="mt-5 max-w-[440px] text-[15px] md:text-[16px] leading-relaxed"
          style={{ color: '#66665F' }}
        >
          Every piece is made to be noticed, not just posted.
        </motion.p>
      </motion.div>

      <motion.div
        ref={visualRef}
        initial={reduced ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
        className="lg:col-span-6"
      >
        <div
          className="relative overflow-hidden rounded-[24px]"
          style={{ aspectRatio: '16/10', border: '1px solid rgba(32,34,31,0.14)', boxShadow: '0 30px 70px -30px rgba(0,0,0,0.6)' }}
        >
          <motion.img
            src={proofVisual}
            alt="Creative direction behind the work"
            style={reduced ? undefined : { y: parallaxY }}
            className="absolute inset-0 h-[112%] w-full object-cover"
            loading="lazy"
          />
        </div>
      </motion.div>
    </div>
  )
}

export default function ContentShowcase() {
  const reduced = useReducedMotion()

  return (
    <section className="relative section-light py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[10%] left-[6%] h-[380px] w-[380px] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(197,138,42,0.06), transparent 70%)' }}
      />

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-16">
          <div className="max-w-[520px]">
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="eyebrow"
            >
              Content
            </motion.div>
            <h2 className="font-display font-semibold leading-[1.08] tracking-tight text-[#20221F]" style={{ fontSize: 'clamp(30px, 4.4vw, 46px)' }}>
              <span className="block overflow-hidden">
                <motion.span
                  initial={reduced ? undefined : { opacity: 0, y: 26, filter: 'blur(6px)' }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.65, ease: EASE, delay: 0.12 }}
                  className="block"
                >
                  A few pieces from
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={reduced ? undefined : { opacity: 0, y: 26, filter: 'blur(6px)' }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.65, ease: EASE, delay: 0.26 }}
                  className="block"
                >
                  the content calendar.
                </motion.span>
              </span>
            </h2>
          </div>

          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
            className="max-w-[300px] text-[14.5px] md:text-[15px] leading-relaxed md:text-right"
            style={{ color: '#66665F' }}
          >
            A glimpse into the kind of creative thinking behind every piece we make.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-7">
          {CARDS.map((card, i) => (
            <ContentCard key={card.title} card={card} index={i} reduced={reduced} />
          ))}
        </div>

        <ProofBlock reduced={reduced} />
      </div>
    </section>
  )
}
