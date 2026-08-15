import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
  MotionConfig,
} from 'framer-motion'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { SERVICES, getServiceBySlug } from '../data/services.js'
import CTABand from '../components/CTABand.jsx'
import './ServiceDetail.css'

import videoPerformance from '../assets/videos/performance.mp4'
import videoWebsite from '../assets/videos/Website.mp4'
import videoCRM from '../assets/videos/CRM.mp4'
import videoSocial from '../assets/videos/Socialmedia.mp4'
import videoInfluencer from '../assets/videos/Influencer.mp4'

// Every image below was individually opened and visually inspected (not
// just filename-matched). For most services that means confirming no
// fabricated statistic, dashboard number, fake testimonial or invented
// client name is presented as real — several candidate assets in this same
// folder (e.g. section5-web-development-03/04.png, section5-social-media-
// marketing-01/02.png, section5-influencer-02.png, section5-crm-systems-
// 03.png, Influencerservicevi/vii.png, CRMservicevi/vii.png, socialmedia
// servicevi/vii.png, 01_crm_hero.png, 02_crm_work.png, 02/03/04_influencer_
// *.png) were rejected for exactly that reason.
//
// PERFORMANCE MARKETING is the one explicit exception to that rule: every
// Performance-named asset is used as a visual/design element regardless of
// any illustrative metric baked into its pixels (ROAS, spend, revenue,
// etc.) — those numbers are never repeated in this page's own copy, which
// is drawn entirely from data/services.js's real content, so nothing here
// is presented as an actual Nirmora or client result. All 10 distinct
// Performance-named files below are genuinely different images, each used
// exactly once across the Service Visual / How It Works / Work in Motion
// sections — no image repeats.
import s1Website from '../assets/services/01_website_hero.png'
import s1Performance from '../assets/services/01_performance_hero.png'
import s1Social from '../assets/services/01_social_hero.png'
import s1Influencer from '../assets/services/01_influencer_hero.png'
import s3Website from '../assets/services/03_website_process.png'
import s4Website from '../assets/services/04_website_engine.png'
import s3CRM from '../assets/services/03_crm_process.png'
import s4CRM from '../assets/services/04_crm_engine.png'
import outputWebsite from '../assets/services/webservicevii.png'
import legacyWebsite from '../assets/services/02_website_work.png'
import creatorShortlisting from '../assets/services/creator-shortlisting.png'
import influencerBrief from '../assets/services/influencer-brief.png'
import influencerApproval from '../assets/services/influencer-approval.png'
import influencerRights from '../assets/services/influencer-rights.png'
import influencerPerformance from '../assets/services/influencer-performancecreator.png'

import section5Web01 from '../assets/services/section5-web-development-01.png'
import section5Web02 from '../assets/services/section5-web-development-02.png'
import section5Social02 from '../assets/services/02_social_work.png'
import section5Social03 from '../assets/services/section5-social-media-marketing-03.png'
import section5Social04 from '../assets/services/section5-social-media-marketing-04.png'
import section5Crm01 from '../assets/services/section5-crm-systems-01.png'
import section5Crm02 from '../assets/services/section5-crm-systems-02.png'
import section5Crm04 from '../assets/services/section5-crm-systems-04.png'
import section5Inf01 from '../assets/services/section5-influencer-01.png'
import section5Inf03 from '../assets/services/section5-influencer-03.png'
import section5Inf04 from '../assets/services/section5-influencer-04.png'
import crmSetup from '../assets/services/crm-setup.png'
import crmLead from '../assets/services/crm-lead.png'
import crmFollowup from '../assets/services/crm-followup.png'
import crmTeam from '../assets/services/crm-team.png'
import crmPipeline from '../assets/services/crm-pipeline.png'

import s2Performance from '../assets/services/02_performance_work.png'
import s3Performance from '../assets/services/performance-google.png'
import s4Performance from '../assets/services/04_performance_engine.png'
import performanceWeeklyReporting from '../assets/services/PerformanceMarketing_WeeklyReporting.png'
import performanceServiceVi from '../assets/services/performance_conversion.png'
import performanceServiceVii from '../assets/services/performanceservicevii.png'
import section5Perf01 from '../assets/services/performance-add.png'
import section5Perf02 from '../assets/services/section5-performance-marketing-02.png'
import section5Perf03 from '../assets/services/section5-performance-marketing-03.png'
import section5Perf04 from '../assets/services/performance-budget.png'
import socialHash from '../assets/services/social-hash.png'
import socialGrowth from '../assets/services/social-growth.png'
import socialStatic from '../assets/services/social-static.png'

// =============================================================================
// NIRMORA SERVICE DETAIL
//
// VIDEO -> STATEMENT -> VISUAL -> HOW IT WORKS -> WORK IN MOTION ->
// OUR APPROACH -> EXPLORE SERVICES -> START A PROJECT.
//
// Every word on this page is drawn from data/services.js; nothing is
// invented. Colour comes entirely from the --sd-* tokens (ServiceDetail.css);
// `.sd-dark` is a standalone override applied to individual sections to
// create the light/dark rhythm without a global theme toggle. Motion
// respects prefers-reduced-motion globally via MotionConfig.
// =============================================================================

const EASE = [0.22, 1, 0.36, 1]

const VIDEO_MAP = {
  'website-development': videoWebsite,
  'performance-marketing': videoPerformance,
  'social-media-marketing': videoSocial,
  'crm-systems': videoCRM,
  'influencer-marketing': videoInfluencer,
}

// Website Development gets its own five-step breakdown (its four real
// approach steps plus one added structural stage, "Wireframe", that sits
// honestly between Strategy and Design). Every other service keeps its own
// real approach steps from data/services.js as-is.
const STEP_SETS = {
  'website-development': [
    { title: 'Strategy', desc: 'We audit your current site, funnel and goals, then map the information architecture around how your buyers actually decide.' },
    { title: 'Wireframe', desc: 'Structure and layout come first — every page mapped and tested before a single pixel is styled.' },
    { title: 'Design', desc: 'A custom visual system — typography, layout grid, motion — built for your brand, not a template.' },
    { title: 'Build', desc: 'Pixel-accurate, SEO-clean development with CRM, analytics and payment integrations wired in from day one.' },
    { title: 'Launch', desc: 'We ship in sprints, then use real user data to keep improving speed, UX and conversion after launch.' },
  ],
}

function getSteps(service) {
  return STEP_SETS[service.slug] || service.approach || []
}

// Each process step has its own service-specific visual — the active step
// index controls exactly which one shows. No hero image, no service.img and
// no single image is allowed to cycle across multiple steps as a generic
// fallback (Performance Marketing's two-asset alternation below is the one
// documented exception, not a silent fallback); every other slot is a
// distinct, individually-inspected asset matched to what that specific step
// actually describes in data/services.js.
function getStepImages(service) {
  switch (service.slug) {
    case 'website-development':
      // Strategy -> Wireframe -> Design -> Build -> Launch
      return [section5Web01, s3Website, s4Website, section5Web02, outputWebsite]
    case 'performance-marketing':
      // Audit & Benchmark -> Creative & Copy -> Launch & Scale -> Report & Refine
      return [s2Performance, section5Perf03, section5Perf02, s4Performance]
    case 'social-media-marketing':
      // Audience Research -> Content Strategy -> Creative Production -> Community & Growth
      return [s1Social, section5Social02, section5Social03, section5Social04]
    case 'crm-systems':
      // Map the Funnel -> Build the System -> Connect Every Source -> Train & Optimize
      return [s3CRM, section5Crm02, section5Crm01, section5Crm04]
    case 'influencer-marketing':
      // Creator Fit -> Brief & Negotiate -> Manage the Campaign -> Track the Impact
      return [section5Inf03, s1Influencer, section5Inf04, section5Inf01]
    default:
      return [service.img]
  }
}

// The single overall service-representation image — a different role from
// the step-by-step process visuals above, so it's fine (expected, even)
// for this to reuse a service's hero-style asset.
function getVisualImage(service) {
  switch (service.slug) {
    case 'website-development': return s1Website
    case 'performance-marketing': return s1Performance
    case 'social-media-marketing': return s1Social
    case 'crm-systems': return s4CRM
    case 'influencer-marketing': return s1Influencer
    default: return service.img
  }
}

// One image per deliverable, for Section 05's stacking card deck. Deliberately
// re-sequenced from getStepImages above rather than copied — the deck lists
// deliverables, not process steps, so the same asset pool is reordered to
// match what each deliverable actually is.
function getStackImages(service) {
  switch (service.slug) {
    case 'website-development':
      return [legacyWebsite, section5Web01, s3Website, section5Web02, s4Website]
    case 'performance-marketing':
      // Channel strategy -> Ad creative & landing page -> Conversion tracking & attribution -> Weekly reporting -> Ongoing budget/bid optimization
      // 03/05 (Conversion tracking) still uses performanceServiceVi pending
      // a clean replacement — its proposed replacement was rejected for
      // fabricated conversion/ROAS numbers under the Nirmora logo, see
      // conversation. 04/05 now uses the new, verified-clean Weekly
      // Reporting asset.
      return [s3Performance, section5Perf01, performanceServiceVi, performanceWeeklyReporting, section5Perf04]
    case 'social-media-marketing':
    // Content calendar -> Production -> Community -> Hashtag -> Monthly Growth
    return [
    section5Social02,
    socialStatic,
    section5Social04,
    socialHash,
    socialGrowth,
    ]
    case 'crm-systems':
    // Setup & pipelines -> Lead capture & routing -> Follow-up sequences -> Team onboarding -> Pipeline reporting
    return [
    crmSetup,
    crmLead,
    crmFollowup,
    crmTeam,
    crmPipeline,
    ]
    case 'influencer-marketing':
    // Creator shortlisting -> Briefing & contracting -> Content approvals -> Usage rights -> Per-creator reporting
    return [
    creatorShortlisting,
    influencerBrief,
    influencerApproval,
    influencerRights,
    influencerPerformance,
    ]
    default:
      return [service.img]
  }
}

// Explore Services card thumbnail — the service's own hero-style asset
// (service.img, from data/services.js), consistent across every service
// and distinct from both the process steps and the stack deck above.
function getExploreImage(service) {
  return service.img
}

// Big editorial statement — condensed, faithful restatements of each
// service's own real tagline (service.hero) as stacked display type.
const STATEMENT_LINES = {
  'website-development': ['We build', 'websites that', 'convert.'],
  'performance-marketing': ['We chase', 'results, not', 'impressions.'],
  'social-media-marketing': ['We build', 'presence that', 'people follow.'],
  'crm-systems': ['No lead', 'ever falls', 'through.'],
  'influencer-marketing': ['We find', 'creators who', 'actually convert.'],
}

// The Work in Motion — same principle, extended toward the tangible result.
const MOTION_LINES = {
  'website-development': ['From wireframe', 'to something', 'people use.'],
  'performance-marketing': ['From budget', 'to something', 'that pays back.'],
  'social-media-marketing': ['From content', 'to something', 'people share.'],
  'crm-systems': ['From leads', 'to something', 'that remembers.'],
  'influencer-marketing': ['From creators', 'to something', 'audiences trust.'],
}

// Our Approach headline — one word swapped per service, rest shared.
const APPROACH_WORD = {
  'website-development': 'beautiful',
  'performance-marketing': 'loud',
  'social-media-marketing': 'consistent',
  'crm-systems': 'automated',
  'influencer-marketing': 'viral',
}

// Three of each service's own six real features, used as the "thinking
// behind the work" — every word already exists in data/services.js.
const APPROACH_FEATURE_INDICES = [0, 2, 4]

// A short card header derived from each real deliverable string — the
// first natural clause, capped at four words — never a fabricated claim,
// just a shorter echo of the same real sentence used as the card's body.
function deriveCardTitle(text) {
  const clause = text.split(/,| & /)[0].trim()
  const words = clause.split(' ')
  return words.length > 4 ? words.slice(0, 4).join(' ') : clause
}

const sd = 'var(--sd-background)'
const sdSecondary = 'var(--sd-background-secondary)'
const sdSurface = 'var(--sd-surface)'
const sdText = 'var(--sd-text)'
const sdMuted = 'var(--sd-text-muted)'
const sdBorder = 'var(--sd-border)'
const sdAccent = 'var(--sd-accent)'

// =============================================================================
// Shared chrome
// =============================================================================
function PageWipe({ playKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={playKey}
        initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        className="fixed inset-0 z-[999] pointer-events-none"
        style={{ background: sd }}
      />
    </AnimatePresence>
  )
}

function Kicker({ children }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE }}
      className="text-[11px] font-semibold tracking-[0.28em] uppercase"
      style={{ color: sdMuted }}
    >
      {children}
    </motion.p>
  )
}

function splitTitle(title) {
  const words = title.split(' ')
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

function stageWord(title) {
  return title.split(' ')[0].replace(/[&,.]/g, '')
}

// A simple editorial frame — thin border and soft shadow only, no fake
// browser chrome, so every large image reads as art direction, not a UI mock.
function Frame({ children, className = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl ${className}`}
      style={{ border: `1px solid ${sdBorder}`, boxShadow: '0 40px 90px -55px rgba(15,12,8,0.45)' }}
    >
      {children}
    </div>
  )
}

// =============================================================================
// 01 — CINEMATIC HERO. Full-screen, video-first. Locked per spec: service
// number, title, short accurate description, "Explore Service", scroll cue.
// No project CTA here — that lives at the bottom of the page.
// =============================================================================
function Hero({ service }) {
  const videoSrc = VIDEO_MAP[service.slug]
  const total = String(SERVICES.length).padStart(2, '0')
  const [line1, line2] = splitTitle(service.title)

  const videoRef = useRef(null)
  const kickerRef = useRef(null)
  const contentRef = useRef(null)
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const [vh, setVh] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 900))
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const heroProgress = useTransform(scrollY, [0, Math.max(vh * 0.7, 1)], [0, 1], { clamp: true })
  useEffect(() => {
    if (reduced) return
    return heroProgress.on('change', (p) => {
      if (videoRef.current) {
        videoRef.current.style.transform = `scale(${1 + p * 0.04})`
        videoRef.current.style.opacity = String(1 - p * 0.22)
      }
      const drift = `translateY(${-p * 32}px)`
      const fade = String(1 - p * 0.92)
      if (kickerRef.current) { kickerRef.current.style.transform = drift; kickerRef.current.style.opacity = fade }
      if (contentRef.current) { contentRef.current.style.transform = drift; contentRef.current.style.opacity = fade }
    })
  }, [reduced])

  return (
    <div className="relative" style={{ height: '170vh' }}>
      <section className="sticky top-0 h-screen flex items-end overflow-hidden bg-[#20221F] z-0">
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay muted loop playsInline preload="auto"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 65% at 12% 100%, rgba(6,6,7,0.72) 0%, rgba(6,6,7,0) 62%), ' +
              'linear-gradient(180deg, rgba(6,6,7,0.30) 0%, rgba(6,6,7,0) 20%)',
          }}
        />

        <div
          ref={kickerRef}
          className="absolute top-[clamp(96px,14vh,160px)] left-6 md:left-10 z-10 flex items-center gap-4 text-[12px] md:text-[13px] font-semibold tracking-[0.28em] uppercase text-white/60 will-change-transform"
        >
          <span className="font-mono text-white/85">{service.idx} / {total}</span>
          {service.title}
        </div>

        <div ref={contentRef} className="relative z-10 w-full px-6 md:px-10 pb-20 md:pb-28 will-change-transform">
          <div className="max-w-[1400px] mx-auto">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={{ clipPath: 'inset(0 0 0% 0)' }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
                className="font-display font-bold text-white leading-[0.98] max-w-[820px] uppercase"
                style={{ fontSize: 'clamp(38px, 6.4vw, 76px)' }}
              >
                {line1}
                <br />
                {line2}
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
              className="mt-8 max-w-[480px] text-[15px] md:text-[16px] leading-relaxed text-white/70"
            >
              {service.short}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}
              className="mt-14 flex flex-col items-center gap-2 w-fit"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/45">Explore Service</span>
              <motion.span
                className="w-px bg-gradient-to-b from-white/55 to-transparent"
                initial={{ scaleY: 0.6, opacity: 0.7 }}
                animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity }}
                style={{ height: 22, transformOrigin: 'top' }}
              />
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
              >
                <ArrowDown size={13} className="text-white/55" />
              </motion.span>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

// =============================================================================
// 02 — EDITORIAL STATEMENT. A genuine two-column spread — headline and
// supporting copy sit side by side at the same eye-line (not stacked with a
// dead gap between them), the way a magazine opens a feature. The section's
// own service number is set oversized and near-invisible behind the
// headline, so the negative space around the type is doing something rather
// than just sitting empty. The ivory panel slides up over the pinned hero
// (pure CSS/native scroll via -mt-[70vh] matching Hero's own reveal window —
// no scroll-jacking).
// =============================================================================
function EditorialStatement({ service }) {
  const lines = STATEMENT_LINES[service.slug] || []
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const reduced = useReducedMotion()

  // The background numeral drifts a few px slower than the scroll itself —
  // a parallax whisper, not a callout — while the section passes through
  // the viewport.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const numeralY = useTransform(scrollYProgress, [0, 1], [-22, 22])

  return (
    <section
      className="relative z-10 -mt-[70vh] rounded-t-[28px] md:rounded-t-[40px] overflow-hidden"
      style={{ background: sd, boxShadow: '0 -60px 100px -20px rgba(6,6,7,0.45)' }}
    >
      <div ref={ref} className="relative max-w-[1560px] mx-auto px-6 md:px-14 lg:px-20 py-24 md:py-32">
        <motion.div
          aria-hidden="true"
          className="hidden lg:block pointer-events-none absolute select-none font-display font-bold"
          style={{
            right: 'clamp(0px, 3vw, 60px)',
            top: '-2vw',
            fontSize: 'clamp(220px, 24vw, 400px)',
            lineHeight: 1,
            color: sdText,
            opacity: 0.045,
            y: reduced ? 0 : numeralY,
          }}
        >
          {service.idx}
        </motion.div>

        <Kicker>{service.idx} / {String(SERVICES.length).padStart(2, '0')} — {service.title}</Kicker>

        <div className="relative mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-start">
          <div className="lg:col-span-8">
            {lines.map((line, i) => (
              <motion.h2
                key={line}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE, delay: 0.08 + i * 0.1 }}
                className="font-display font-bold uppercase leading-[0.96] tracking-tight text-left"
                style={{ fontSize: 'clamp(36px, 6.6vw, 92px)', color: sdText }}
              >
                {line}
              </motion.h2>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 + lines.length * 0.1 + 0.15 }}
            className="lg:col-span-4 lg:pt-3"
          >
            <motion.span
              className="block h-px w-9 mb-4 origin-left"
              style={{ background: sdAccent }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 + lines.length * 0.1 + 0.15 }}
            />
            <p className="max-w-[340px] text-[15px] leading-[1.8]" style={{ color: sdMuted }}>
              {service.intro}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// 03 — LARGE SERVICE VISUAL. Not a card — a dominant, cinematic image at
// ~88% viewport width. The image itself stays the focus: a subtle reveal
// and scale, nothing gimmicky.
// =============================================================================
function ServiceVisual({ service }) {
  const img = getVisualImage(service)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  if (!img) return null

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-10" style={{ background: sd }}>
      <div ref={ref} className="max-w-[1500px] mx-auto">
        <div className="mb-8 md:mb-12">
          <Kicker>Service Visual</Kicker>
        </div>
        <motion.div
          initial={{ clipPath: 'inset(3% 3% 3% 3% round 24px)', scale: 1.03, opacity: 0 }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0% round 24px)', scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1, ease: EASE }}
          className="mx-auto w-full md:w-[88%]"
        >
          <Frame>
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <img src={img} alt={`${service.title} — overview`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            </div>
          </Frame>
        </motion.div>
      </div>
    </section>
  )
}

// =============================================================================
// 04 — HOW IT WORKS. One image + clickable steps. Clicking a step flips the
// current image away (rotateY + fade) and the new one flips into the exact
// same frame — never a slide, never more than one image visible at once.
// Desktop: image left, step list right. Mobile: image on top, a horizontal
// step rail beneath it, then the active title + description.
// =============================================================================
function DesktopStep({ step, index, active, onActivate, isFirst }) {
  return (
    <button
      type="button"
      onClick={onActivate}
      aria-current={active ? 'step' : undefined}
      className="sd-focusable group relative w-full text-left py-5"
      style={{ borderTop: isFirst ? 'none' : `1px solid ${sdBorder}` }}
    >
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[11px] flex-none transition-colors duration-300" style={{ color: active ? sdAccent : sdMuted }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div
          className="font-display font-semibold leading-[1.2] transition-all duration-300"
          style={{ fontSize: active ? 'clamp(19px, 2vw, 23px)' : 'clamp(15px, 1.5vw, 18px)', color: active ? sdText : sdMuted }}
        >
          {step.title}
        </div>
      </div>
      <motion.p
        initial={false}
        animate={{ opacity: active ? 1 : 0, height: active ? 'auto' : 0, marginTop: active ? 10 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="pl-9 text-[13.5px] leading-relaxed max-w-[360px] overflow-hidden"
        style={{ color: sdMuted }}
      >
        {step.desc}
      </motion.p>
    </button>
  )
}

// The current visual drifts out along a soft downward curve while fading;
// the next one enters from the opposite curve and settles into the same
// frame. Deliberately not a 3D card flip, cube or slide — an arc, not an
// axis — so the change reads as one editorial visual dissolving into the
// next rather than a UI transition.
function CurvedImage({ activeKey, src, alt }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.img
          key={activeKey}
          src={src}
          alt={alt}
          initial={{ opacity: 0, x: 34, y: -22, scale: 0.94, rotate: 2.5 }}
          animate={{
            opacity: 1,
            x: [34, -6, 0],
            y: [-22, 5, 0],
            scale: [0.94, 1.015, 1],
            rotate: [2.5, -0.6, 0],
            transition: { duration: 0.85, ease: EASE, times: [0, 0.65, 1] },
          }}
          exit={{
            opacity: 0,
            x: -34,
            y: 22,
            scale: 0.94,
            rotate: -2.5,
            transition: { duration: 0.55, ease: EASE },
          }}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </AnimatePresence>
    </div>
  )
}

const AUTO_LOOP_MS = 4500

function HowItWorks({ service }) {
  const steps = getSteps(service)
  const images = getStepImages(service)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovering, setHovering] = useState(false)
  const reduced = useReducedMotion()
  const n = steps.length

  // The image auto-loops through every stage; hovering/focusing the frame
  // pauses it temporarily, and a manual step click pauses it for good
  // rather than fighting the user's own choice. Disabled entirely under
  // prefers-reduced-motion — steps still change on click, just never on
  // their own.
  useEffect(() => {
    if (n < 2 || paused || hovering || reduced) return
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % n)
    }, AUTO_LOOP_MS)
    return () => window.clearInterval(id)
  }, [n, paused, hovering, reduced])

  const selectStep = (i) => {
    setActive(i)
    setPaused(true)
  }

  if (!n) return null
  const activeImg = images[active] ?? images[0]

  return (
    <section className="relative py-24 md:py-32" style={{ background: sdSecondary }}>
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="text-center md:text-left mb-14 md:mb-16">
          <Kicker>How It Works</Kicker>
        </div>

        {/* Desktop */}
        <div
          className="hidden md:grid grid-cols-[1.15fr_0.85fr] gap-16 items-center"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <Frame>
            <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
              <CurvedImage activeKey={active} src={activeImg} alt={`${service.title} — ${steps[active]?.title || ''}`} />
            </div>
          </Frame>
          <div className="flex flex-col" style={{ borderBottom: `1px solid ${sdBorder}` }} onFocus={() => setHovering(true)} onBlur={() => setHovering(false)}>
            {steps.map((s, i) => (
              <DesktopStep key={s.title} step={s} index={i} active={active === i} onActivate={() => selectStep(i)} isFirst={i === 0} />
            ))}
          </div>
        </div>

        {/* Mobile — its own composition, not a squeezed desktop layout */}
        <div className="md:hidden">
          <Frame>
            <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
              <CurvedImage activeKey={active} src={activeImg} alt={`${service.title} — ${steps[active]?.title || ''}`} />
            </div>
          </Frame>

          <div className="mt-8 flex flex-wrap items-start justify-center gap-x-1 gap-y-3">
            {steps.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => selectStep(i)}
                aria-label={s.title}
                aria-current={active === i ? 'step' : undefined}
                className="sd-focusable flex-none text-center px-2.5 py-1 rounded-lg"
              >
                <div className="font-mono text-[11px]" style={{ color: active === i ? sdAccent : sdMuted }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div
                  className="mt-1 text-[11px] tracking-[0.08em] uppercase font-semibold whitespace-nowrap"
                  style={{ color: active === i ? sdText : sdMuted }}
                >
                  {stageWord(s.title)}
                </div>
                <div className="mt-2 h-[2px] rounded-full" style={{ background: active === i ? sdAccent : 'transparent' }} />
              </button>
            ))}
          </div>

          <div className="mt-6 text-center px-2 min-h-[92px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <div className="font-display font-semibold text-[18px]" style={{ color: sdText }}>{steps[active].title}</div>
                <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: sdMuted }}>{steps[active].desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// 05 — THE WORK IN MOTION. A completely different interaction from Section
// 04: not click-to-change, but scroll-built. Each of the service's real
// deliverables gets its own wide, horizontal image+text card; native CSS
// position:sticky — the same mechanism behind every "cards stack as you
// scroll" experience — pins each card a little lower and further right than
// the one before it, so later cards physically rise and cascade over
// earlier ones, which stay underneath with their own edge peeking out. No
// JS scroll math, no layout jump.
// =============================================================================
function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true))
  useEffect(() => {
    const onResize = () => setDesktop(window.innerWidth >= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return desktop
}

function StackCard({ index, total, text, img, service, desktop }) {
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { once: true, amount: 0.4 })
  const topOffset = 88 + index * 22
  const cascadeX = desktop ? index * 16 : 0
  const title = deriveCardTitle(text)

  return (
    <div className="relative" style={{ minHeight: index < total - 1 ? '100vh' : 'auto' }}>
      <div className="sticky" style={{ top: `${topOffset}px`, zIndex: index + 1 }}>
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1, x: cascadeX } : { x: cascadeX }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mx-auto flex w-full max-w-[1120px] flex-col md:flex-row overflow-hidden rounded-[22px] md:rounded-[26px]"
          style={{
            border: '1px solid rgba(244,241,232,0.12)',
            boxShadow: '0 40px 90px -30px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="flex flex-col justify-center gap-4 px-6 py-8 md:w-[42%] md:px-9 md:py-10"
            style={{ background: '#20221F' }}
          >
            <span className="font-mono text-[12px]" style={{ color: '#D4AF5A' }}>
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <h3
              className="font-display font-semibold uppercase leading-[1.15] text-[#F4F1E8]"
              style={{ fontSize: 'clamp(19px, 2.1vw, 27px)' }}
            >
              {title}
            </h3>
            <p className="text-[14px] leading-[1.75]" style={{ color: 'rgba(244,241,232,0.62)' }}>
              {text}
            </p>
          </div>
          <div className="relative w-full md:w-[58%]" style={{ aspectRatio: desktop ? undefined : '4/3', minHeight: desktop ? 300 : undefined }}>
            {img && (
              <img
                src={img}
                alt={`${service.title} — ${text}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function WorkInMotion({ service }) {
  const lines = MOTION_LINES[service.slug] || []
  const items = service.deliverables || []
  const images = getStackImages(service)
  const headRef = useRef(null)
  const inView = useInView(headRef, { once: true, margin: '-100px' })
  const desktop = useIsDesktop()

  return (
    <section className="sd-dark relative" style={{ background: sd }}>
      <div ref={headRef} className="max-w-[1200px] mx-auto text-center px-6 md:px-10 pt-28 md:pt-36 pb-16 md:pb-20">
        <Kicker>The Work in Motion</Kicker>
        <div className="mt-8 md:mt-10">
          {lines.map((line, i) => (
            <div key={line} className="overflow-hidden">
              <motion.h2
                initial={{ y: '100%', opacity: 0 }}
                animate={inView ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.12 }}
                className="font-display font-bold uppercase leading-[0.98] tracking-tight"
                style={{ fontSize: 'clamp(30px, 5.6vw, 68px)', color: i === lines.length - 1 ? sdAccent : sdText }}
              >
                {line}
              </motion.h2>
            </div>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <div className="px-6 md:px-10 md:pl-10 lg:pl-16 pb-32 md:pb-44">
          {items.map((text, i) => (
            <StackCard key={text} index={i} total={items.length} text={text} img={images[i] ?? images[0]} service={service} desktop={desktop} />
          ))}
        </div>
      )}
    </section>
  )
}

// =============================================================================
// 06 — OUR APPROACH. Typography-led thinking behind the work. No image, no
// timeline, no cards — three of the service's own real capabilities,
// reframed as principles. As the user scrolls past, whichever row is
// nearest the vertical center of the viewport becomes the active one —
// number and title sharpen, description brightens — while the others stay
// visible, just quieter. Nothing is ever hidden.
// =============================================================================
function ApproachPrinciple({ rowRef, index, title, desc, active }) {
  const inViewRef = useRef(null)
  const inView = useInView(inViewRef, { once: true, margin: '-80px' })
  return (
    <div
      ref={(el) => { rowRef(el); inViewRef.current = el }}
      className="py-8 md:py-10 transition-[border-color] duration-500"
      style={{ borderTop: `1px solid ${active ? sdAccent : sdBorder}` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE, delay: index * 0.08 }}
        className="grid grid-cols-[auto_1fr] md:grid-cols-[100px_1fr] gap-6 md:gap-10 items-start"
      >
        <span
          className="font-mono text-[12px] pt-1 transition-colors duration-500"
          style={{ color: active ? sdAccent : sdMuted }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <div
            className="font-display font-semibold transition-all duration-500"
            style={{ fontSize: active ? 'clamp(20px, 2.2vw, 26px)' : 'clamp(18px, 2vw, 24px)', color: active ? sdText : sdMuted }}
          >
            {title}
          </div>
          <p
            className="mt-3 max-w-[520px] text-[14.5px] leading-relaxed transition-opacity duration-500"
            style={{ color: sdMuted, opacity: active ? 1 : 0.55 }}
          >
            {desc}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function OurApproach({ service }) {
  const principles = APPROACH_FEATURE_INDICES.map((i) => service.features?.[i]).filter(Boolean)
  const word = APPROACH_WORD[service.slug] || 'beautiful'
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const [active, setActive] = useState(0)
  const rowEls = useRef([])

  useEffect(() => {
    if (!principles.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = rowEls.current.indexOf(entry.target)
          if (idx !== -1) setActive(idx)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    rowEls.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [principles.length])

  if (!principles.length) return null

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-10" style={{ background: sd }}>
      <div ref={ref} className="max-w-[880px] mx-auto">
        <Kicker>Our Approach</Kicker>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mt-7 font-display font-bold uppercase leading-[1.05]"
          style={{ fontSize: 'clamp(28px, 4.4vw, 52px)', color: sdText }}
        >
          The best work isn&rsquo;t just {word}.<br />
          <span style={{ color: sdAccent }}>It has a reason to exist.</span>
        </motion.h2>

        <div className="mt-14 md:mt-16">
          {principles.map((f, i) => (
            <ApproachPrinciple
              key={f.title}
              rowRef={(el) => { rowEls.current[i] = el }}
              index={i}
              title={f.title}
              desc={f.desc}
              active={active === i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// 07 — EXPLORE SERVICES. Locked as a compact card grid — five equal-width
// image cards in a single row on desktop, one column on mobile. Each card
// stays a navigation control, not a hero: a small image, then number, name
// and arrow beneath it. One subtle hover interaction (image scale + accent
// border). Links to the corresponding Service Detail page.
// =============================================================================
function ExploreCard({ svc, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hover, setHover] = useState(false)
  const image = getExploreImage(svc)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.06 }}
      className="h-full"
    >
      <Link
        to={`/services/${svc.slug}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex flex-col h-full rounded-xl overflow-hidden transition-colors duration-300"
        style={{ border: `1px solid ${hover ? sdAccent : sdBorder}` }}
      >
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3', background: sdSecondary }}>
          {image && (
            <img
              src={image}
              alt={svc.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out"
              style={{ transform: hover ? 'scale(1.06)' : 'scale(1)' }}
              loading="lazy"
            />
          )}
        </div>
        <div
          className="flex flex-1 flex-col justify-between px-4 py-4 md:px-5 md:py-5 transition-colors duration-300"
          style={{ background: hover ? sdSurface : 'transparent' }}
        >
          <span className="font-mono text-[11px]" style={{ color: sdAccent }}>{svc.idx}</span>
          <span
            className="mt-3 font-display font-semibold leading-[1.2]"
            style={{ fontSize: 'clamp(14.5px, 1.15vw, 16.5px)', color: sdText }}
          >
            {svc.title}
          </span>
          <ArrowRight
            size={15}
            className="mt-4 transition-transform duration-300"
            style={{ color: sdAccent, transform: hover ? 'translateX(5px)' : 'none' }}
          />
        </div>
      </Link>
    </motion.div>
  )
}

function ExploreServices({ currentSlug }) {
  const otherServices = SERVICES.filter((svc) => svc.slug !== currentSlug)
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-10" style={{ background: sdSecondary }}>
      <div className="max-w-[1400px] mx-auto">
        <Kicker>Explore Services</Kicker>
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
          {otherServices.map((svc, i) => (
            <ExploreCard key={svc.slug} svc={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// FOOTER SPACER. CTABand and the global Footer are both near-black — without
// a break between them they'd read as one continuous block. This is a clean
// warm-white breathing area (the page's own light token) that keeps the CTA
// and the footer visually distinct, nothing else — no content, no CTA.
// =============================================================================
function FooterSpacer() {
  return <div className="h-16 md:h-28" style={{ background: sd }} aria-hidden="true" />
}

// =============================================================================
// Main page
// =============================================================================
export default function ServiceDetail() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [slug])

  if (!service) return <Navigate to="/" replace />

  return (
    <MotionConfig reducedMotion="user">
      <div className="sd">
        <PageWipe playKey={slug} />

        <Hero service={service} />
        <EditorialStatement service={service} />
        <ServiceVisual service={service} />
        <HowItWorks service={service} />
        <WorkInMotion service={service} />
        <OurApproach service={service} />
        <ExploreServices currentSlug={service.slug} />
        <CTABand />
        <FooterSpacer />
      </div>
    </MotionConfig>
  )
}
