import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal.jsx'
import { SERVICES } from '../data/services.js'

import videoWeb from '../assets/videos/Webdevelopmentservice.mp4'
import videoPerformance from '../assets/videos/Performanceservice.mp4'
import videoSocial from '../assets/videos/Socialmediaservice.mp4'
import videoCRM from '../assets/videos/CRMservice.mp4'
import videoInfluencer from '../assets/videos/Influencerservice.mp4'

import posterWeb from '../assets/services/webservicevi.png'
import posterPerformance from '../assets/services/performanceservicevi.png'
import posterSocial from '../assets/services/socialmediaservicevi.png'
import posterInfluencer from '../assets/services/Influencerservicevi.png'
import posterCRM from '../assets/services/CRMservicevi.png'

const VIDEOS = {
  'website-development': videoWeb,
  'performance-marketing': videoPerformance,
  'social-media-marketing': videoSocial,
  'crm-systems': videoCRM,
  'influencer-marketing': videoInfluencer,
}

const POSTERS = {
  'website-development': posterWeb,
  'performance-marketing': posterPerformance,
  'social-media-marketing': posterSocial,
  'crm-systems': posterCRM,
  'influencer-marketing': posterInfluencer,
}

// ---------------------------------------------------------------------------
// Design tokens — cinematic black "digital showroom" theme
// ---------------------------------------------------------------------------
const EASE = [0.22, 1, 0.36, 1]
const GOLD = '197,138,42' // rgb triplet, used inline with alpha
const CARD_BG = '#FAF9F5'
const BORDER_IDLE = 'rgba(32,34,31,0.14)'
const TEXT_SECONDARY = '#66665F'

// Per-card float amplitude (px) and duration (s) — every card drifts differently
const FLOAT = [
  { y: -8, dur: 9.5 },
  { y: 5, dur: 11 },
  { y: -6, dur: 8.5 },
  { y: 8, dur: 10.5 },
  { y: -4, dur: 9 },
]

// Fixed particle field so it doesn't reshuffle on every re-render
const PARTICLES = [
  { top: '12%', left: '8%', size: 3, dur: 14, delay: 0 },
  { top: '68%', left: '4%', size: 2, dur: 18, delay: 1.2 },
  { top: '22%', left: '92%', size: 2, dur: 16, delay: 0.6 },
  { top: '78%', left: '95%', size: 3, dur: 13, delay: 2 },
  { top: '48%', left: '2%', size: 2, dur: 20, delay: 0.4 },
  { top: '5%', left: '55%', size: 2, dur: 15, delay: 1.6 },
  { top: '90%', left: '48%', size: 3, dur: 17, delay: 0.8 },
  { top: '35%', left: '98%', size: 2, dur: 12, delay: 2.4 },
  { top: '60%', left: '50%', size: 2, dur: 19, delay: 1 },
  { top: '15%', left: '30%', size: 2, dur: 14.5, delay: 2.8 },
]

function ServiceTile({ service, index, videoSrc, posterSrc, isActive, onActivate, onDeactivate, parallaxX, parallaxY }) {
  const videoRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const active = hovered || isActive
  const float = FLOAT[index % FLOAT.length]

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) {
      v.play().catch(() => {})
    } else {
      v.pause()
      v.currentTime = 0
    }
  }, [active])

  const handleEnter = () => setHovered(true)
  const handleLeave = () => setHovered(false)
  const handleTap = () => (isActive ? onDeactivate() : onActivate())

  // Depth factor: alternating cards drift slightly more/less on parallax for a layered feel
  const depth = 0.6 + (index % 2 === 0 ? 0.4 : 0.2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 46, rotate: index % 2 === 0 ? -2.5 : 2.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, ease: EASE, delay: index * 0.1 }}
      className="w-full sm:w-[300px]"
    >
      {/* Outer wrapper handles ambient floating drift */}
      <motion.div
        style={{
          animation: `nirmora-float ${float.dur}s ease-in-out infinite alternate`,
          animationPlayState: active ? 'paused' : 'running',
          ['--fy']: `${float.y}px`,
        }}
        animate={{ x: parallaxX * depth, y: parallaxY * depth }}
        transition={{ type: 'spring', stiffness: 60, damping: 18, mass: 0.6 }}
      >
        {/* Traveling glow-border shell */}
        <div
          className="relative rounded-[28px] p-[1.4px] overflow-hidden"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onClick={handleTap}
          style={{ cursor: 'pointer' }}
        >
          <div
            className="absolute inset-[-60%]"
            style={{
              background: `conic-gradient(from 0deg, transparent 0%, rgba(${GOLD},${active ? 0.9 : 0.35}) 8%, transparent 22%, transparent 100%)`,
              animation: `nirmora-spin ${6 + (index % 3)}s linear infinite`,
              transition: 'opacity 0.6s ease',
            }}
          />
          <motion.div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[27px]"
            animate={{
              y: active ? -16 : 0,
              scale: active ? 1.03 : 1,
            }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              background: CARD_BG,
              border: `1px solid ${active ? 'transparent' : BORDER_IDLE}`,
              boxShadow: active
                ? `0 34px 70px -22px rgba(0,0,0,0.65), 0 0 46px -12px rgba(${GOLD},0.28)`
                : '0 18px 44px -26px rgba(0,0,0,0.55)',
              transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
            }}
          >
            <img
              src={posterSrc}
              alt={service.title}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
              style={{ opacity: active ? 0 : 1 }}
            />
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
              style={{ opacity: active ? 1 : 0 }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Content stays below the card — poster is never covered */}
      <div className="mt-6 px-1">
        <h3 className="font-display font-semibold text-[18px] text-[#20221F] leading-snug">
          {service.title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed line-clamp-2" style={{ color: TEXT_SECONDARY }}>
          {service.short}
        </p>
        <Link
          to={`/services/${service.slug}`}
          className="group mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold tracking-wide"
          style={{ color: `rgb(${GOLD})` }}
        >
          Explore
          <ArrowRight size={14} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const [activeIdx, setActiveIdx] = useState(null)
  const sectionRef = useRef(null)

  // Raw mouse-driven motion values, smoothed with a spring for a floaty parallax feel
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { stiffness: 50, damping: 20, mass: 0.5 })
  const springY = useSpring(rawY, { stiffness: 50, damping: 20, mass: 0.5 })
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const unsubX = springX.on('change', (v) => setParallax((p) => ({ ...p, x: v })))
    const unsubY = springY.on('change', (v) => setParallax((p) => ({ ...p, y: v })))
    return () => {
      unsubX()
      unsubY()
    }
  }, [springX, springY])

  const handleMouseMove = (e) => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = (e.clientX - rect.left) / rect.width - 0.5 // -0.5 .. 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5
    const MAX = 8 // px, subtle depth only
    rawX.set(relX * MAX * 2)
    rawY.set(relY * MAX * 2)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const rowOne = SERVICES.slice(0, 3)
  const rowTwo = SERVICES.slice(3, 5)

  const orbitalPaths = useMemo(
    () => [
      'M -80 120 C 200 40, 500 220, 900 90',
      'M -60 320 C 260 420, 560 220, 940 340',
    ],
    []
  )

  return (
    <section
      id="services"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden"
      style={{ background: '#FBF7EF' }}
    >
      <style>{`
        @keyframes nirmora-float {
          0%   { transform: translateY(0px); }
          100% { transform: translateY(var(--fy)); }
        }
        @keyframes nirmora-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes nirmora-drift {
          0%   { transform: translateX(0) translateY(0); }
          50%  { transform: translateX(24px) translateY(-10px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes nirmora-particle {
          0%   { transform: translateY(0) translateX(0); opacity: 0.15; }
          50%  { transform: translateY(-18px) translateX(6px); opacity: 0.3; }
          100% { transform: translateY(0) translateX(0); opacity: 0.15; }
        }
        @media (prefers-reduced-motion: reduce) {
          #services [style*="nirmora-float"],
          #services [style*="nirmora-spin"],
          #services .nirmora-particle,
          #services .nirmora-orbital {
            animation: none !important;
          }
        }
      `}</style>

      {/* ---------------------------------------------------------------- */}
      {/* Ambient depth: gradients, noise, orbital lines, particles          */}
      {/* ---------------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* base gradient wash */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, #FBF7EF 0%, #E9E5DA 60%)' }} />

        {/* soft golden ambient light blobs, ~5% opacity */}
        <div
          className="absolute -top-24 left-[8%] h-[560px] w-[560px] rounded-full blur-[120px]"
          style={{ background: `rgba(${GOLD},0.05)` }}
        />
        <div
          className="absolute bottom-[-10%] right-[6%] h-[520px] w-[520px] rounded-full blur-[120px]"
          style={{ background: `rgba(${GOLD},0.045)` }}
        />

        {/* subtle noise texture */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.035]">
          <filter id="nirmora-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#nirmora-noise)" />
        </svg>

        {/* orbital lines, barely visible, slowly drifting */}
        <svg
          className="nirmora-orbital absolute inset-0 h-full w-full"
          style={{ animation: 'nirmora-drift 22s ease-in-out infinite' }}
          viewBox="0 0 900 480"
          preserveAspectRatio="none"
        >
          {orbitalPaths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={`rgba(${GOLD},0.12)`} strokeWidth="1" />
          ))}
        </svg>

        {/* tiny glowing particles */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="nirmora-particle absolute rounded-full"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: `rgba(${GOLD},0.5)`,
              boxShadow: `0 0 6px rgba(${GOLD},0.4)`,
              animation: `nirmora-particle ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-[1180px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <Reveal className="max-w-[640px] mb-20 md:mb-24">
          <div className="text-[12px] font-semibold tracking-[0.22em] uppercase mb-5" style={{ color: TEXT_SECONDARY }}>
            What We Do
          </div>
          <h2 className="font-display font-semibold text-[36px] md:text-[52px] leading-[1.1] tracking-tight text-[#20221F]">
            Five disciplines, <span style={{ color: `rgb(${GOLD})` }}>one</span> showroom.
          </h2>
          <p className="mt-6 text-[16px] md:text-[17px] leading-relaxed max-w-[520px]" style={{ color: TEXT_SECONDARY }}>
            Hover any tile to preview the work in motion.
          </p>
        </Reveal>

        {/* Row 1 — 3 cards */}
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-16">
          {rowOne.map((service, i) => (
            <ServiceTile
              key={service.slug}
              service={service}
              index={i}
              videoSrc={VIDEOS[service.slug]}
              posterSrc={POSTERS[service.slug]}
              isActive={activeIdx === i}
              onActivate={() => setActiveIdx(i)}
              onDeactivate={() => setActiveIdx(null)}
              parallaxX={parallax.x}
              parallaxY={parallax.y}
            />
          ))}
        </div>

        {/* Row 2 — 2 cards, centered */}
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-16 mt-16">
          {rowTwo.map((service, i) => {
            const idx = i + 3
            return (
              <ServiceTile
                key={service.slug}
                service={service}
                index={idx}
                videoSrc={VIDEOS[service.slug]}
                posterSrc={POSTERS[service.slug]}
                isActive={activeIdx === idx}
                onActivate={() => setActiveIdx(idx)}
                onDeactivate={() => setActiveIdx(null)}
                parallaxX={parallax.x}
                parallaxY={parallax.y}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
