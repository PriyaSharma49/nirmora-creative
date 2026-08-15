import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  ArrowUp,
  Instagram,
  Linkedin,
  Facebook,
  Mail,
  MapPin,
  Clock,
  Send,
} from 'lucide-react'
import { SERVICES } from '../data/services.js'
import logo from '../assets/brand/blackbg-logo.png'

// ---------------------------------------------------------------------------
// Design tokens — shared with the rest of the premium black/gold system
// ---------------------------------------------------------------------------
const EASE = [0.22, 1, 0.36, 1]
const YELLOW = '197,138,42' // "the current" — controlled orange accent, rgb triplet
const BG = '#0D0F0D'
const TEXT_SECONDARY = '#96968F'
const TEXT_FAINT = 'rgba(245,241,232,0.4)'
const LINK_COLOR = '#D8D4CA'

// Why Us and FAQ are content sections rather than necessary footer
// navigation destinations. Home is a plain "/" — not "/#top" — see Nav.jsx
// for the full reasoning; same fix applied here for the same bug.
const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/#services' },
  { label: 'Work', to: '/#work' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const CONTACT_ITEMS = [
  { icon: Mail, label: 'hello@nirmoracreative.com', href: 'mailto:hello@nirmoracreative.com' },
  { icon: MapPin, label: 'Mulund, Maharashtra, India', href: null },
  { icon: Clock, label: 'Mon – Sat, 10:00 AM – 7:00 PM IST', href: null },
]

const WHATSAPP_HREF = 'https://wa.me/917304302068?text=Hi%20Nirmora%2C%20I%27d%20like%20to%20discuss%20a%20project.'

// No lucide equivalent exists — a small hand-drawn glyph, same shape used
// elsewhere in the project's contact surfaces.
function WhatsAppIcon({ size = 17, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 21l1.4-4.9A8.9 8.9 0 1 1 8 19.6L3 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.7 8.9c.1-.5.5-1.4.9-1.4.5 0 .9.9 1 1.3.1.4-.2.7-.4 1-.2.3-.4.4-.2.8.5.9 1.5 1.9 2.4 2.3.4.2.5 0 .8-.2.3-.2.6-.5 1-.3.4.1 1.2.6 1.3 1s-.5.9-1 1.1c-.5.2-1.1.2-2-.1-1.2-.4-2.4-1.3-3.2-2.3-.6-.7-1.2-1.7-1.5-2.5-.1-.3-.2-.5-.1-.7Z"
        fill="currentColor"
      />
    </svg>
  )
}

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com' },
  { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com' },
  { icon: WhatsAppIcon, label: 'WhatsApp', href: WHATSAPP_HREF },
]

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

// ---------------------------------------------------------------------------
// Back to top — unchanged, kept as the site's single global instance
// ---------------------------------------------------------------------------
function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [ripple, setRipple] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    setRipple(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.setTimeout(() => setRipple(false), 650)
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16, pointerEvents: visible ? 'auto' : 'none' }}
      transition={{ duration: 0.4, ease: EASE }}
      className="fixed bottom-7 right-6 md:bottom-9 md:right-9 z-40 h-12 w-12 rounded-full flex items-center justify-center"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: `1px solid rgba(${YELLOW},0.35)`,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 12px 30px -14px rgba(0,0,0,0.6), 0 0 0 1px rgba(${YELLOW},0.06)`,
      }}
      whileHover={{ y: -3, boxShadow: `0 18px 36px -14px rgba(0,0,0,0.65), 0 0 24px -6px rgba(${YELLOW},0.35)` }}
    >
      <span className="relative flex items-center justify-center">
        {ripple && (
          <span
            className="absolute inset-[-6px] rounded-full"
            style={{
              border: `1px solid rgba(${YELLOW},0.55)`,
              animation: 'nirmora-ripple 0.65s ease-out forwards',
            }}
          />
        )}
        <ArrowUp size={18} style={{ color: `rgb(${YELLOW})` }} />
      </span>
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
export default function Footer() {
  const { pathname, hash } = useLocation()
  const currentPath = `${pathname}${hash}`
  const rootRef = useRef(null)

  // Same fix as Nav.jsx: clicking Home while already on "/" with no hash
  // doesn't change the location, so ScrollToTop.jsx never fires — handle
  // that one case manually. Every other Home click already works via the
  // normal route-change path.
  function handleHomeClick() {
    if (pathname === '/' && !hash) {
      // 'instant' bypasses the global scroll-behavior:smooth (index.css) —
      // see ScrollToTop.jsx for the full reasoning.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }
  const lineInView = useInView(rootRef, { once: true, margin: '-100px' })
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    setSubscribed(true)
  }

  return (
    <footer ref={rootRef} className="relative overflow-hidden" style={{ background: BG }}>
      <style>{`
        @keyframes nirmora-ripple {
          0%   { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes nirmora-footer-drift {
          0%   { transform: translate(0px, 0px); }
          50%  { transform: translate(16px, -12px); }
          100% { transform: translate(0px, 0px); }
        }
        .footer-link { position: relative; display: inline-block; color: #D8D4CA; transition: color 0.3s ease, transform 0.3s ease; }
        .footer-link:hover { color: rgb(${YELLOW}); transform: translateX(3px); }
        .footer-legal-link { color: rgba(255,255,255,0.55); transition: color 0.3s ease; }
        .footer-legal-link:hover { color: rgb(${YELLOW}); }
        @media (prefers-reduced-motion: reduce) {
          .nirmora-footer-bg-anim { animation: none !important; }
        }
      `}</style>

      {/* thin gold divider — draws across once, on entering view */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={lineInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1, ease: EASE }}
        className="h-px w-full origin-center"
        style={{ background: `linear-gradient(90deg, transparent, rgba(${YELLOW},0.6), transparent)` }}
      />

      {/* ambient background — kept extremely subtle */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="nirmora-footer-bg-anim absolute -top-32 left-[12%] h-[380px] w-[380px] rounded-full blur-[110px]"
          style={{ background: `rgba(${YELLOW},0.04)`, animation: 'nirmora-footer-drift 24s ease-in-out infinite' }}
        />
        <div
          className="nirmora-footer-bg-anim absolute bottom-[-15%] right-[10%] h-[340px] w-[340px] rounded-full blur-[110px]"
          style={{ background: `rgba(${YELLOW},0.035)`, animation: 'nirmora-footer-drift 28s ease-in-out infinite reverse' }}
        />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="relative max-w-[1280px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1fr] gap-x-10 gap-y-10">
          {/* Brand */}
          <motion.div variants={fadeUp}>
            <img src={logo} alt="Nirmora" className="h-8 md:h-9 w-auto object-contain mb-4" />
            <div className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-2.5" style={{ color: TEXT_FAINT }}>
              Nirmora
            </div>
            <h2 className="font-display font-semibold text-[30px] md:text-[36px] leading-[1.05] text-[#F5F1E8] tracking-tight">
              Nirmora
            </h2>
            <p className="mt-4 max-w-[340px] text-[14px] leading-relaxed" style={{ color: TEXT_SECONDARY }}>
              We engineer connected growth systems where creativity, technology and performance work together.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.08 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="h-9 w-9 rounded-full flex items-center justify-center"
                  style={{
                    border: '1px solid rgba(255,255,255,0.16)',
                    color: 'rgba(255,255,255,0.7)',
                    transition: 'color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = `rgb(${YELLOW})`
                    e.currentTarget.style.borderColor = `rgba(${YELLOW},0.5)`
                    e.currentTarget.style.boxShadow = `0 0 16px -4px rgba(${YELLOW},0.5)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={fadeUp}>
            <div className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-5" style={{ color: TEXT_FAINT }}>
              Navigation
            </div>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={item.to === '/' ? handleHomeClick : undefined}
                    data-active={currentPath === item.to}
                    className="footer-link text-[14px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services (dynamic) */}
          <motion.div variants={fadeUp}>
            <div className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-5" style={{ color: TEXT_FAINT }}>
              Services
            </div>
            <ul className="flex flex-col gap-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="footer-link text-[14px]">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact + newsletter */}
          <motion.div variants={fadeUp}>
            <div className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-5" style={{ color: TEXT_FAINT }}>
              Contact
            </div>
            <ul className="flex flex-col gap-2.5 mb-5">
              {CONTACT_ITEMS.map(({ icon: Icon, label, href }) => {
                const content = (
                  <span className="inline-flex items-start gap-2.5 text-[13.5px] leading-snug" style={{ color: TEXT_SECONDARY }}>
                    <Icon size={14} className="flex-none mt-[2px]" style={{ color: `rgba(${YELLOW},0.9)` }} />
                    {label}
                  </span>
                )
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="hover:text-white transition-colors duration-300">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                )
              })}
            </ul>

            <div className="text-[14px] font-semibold text-[#F5F1E8]/90 mb-0.5">Stay in the loop.</div>
            <p className="text-[12.5px] mb-2.5" style={{ color: TEXT_FAINT }}>
              Occasional notes on growth systems. No spam.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <div
                className="flex-1 flex items-center rounded-full px-3.5 py-2"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.16)',
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  className="w-full bg-transparent text-[13px] text-[#F5F1E8] placeholder-[#F5F1E8]/35 outline-none"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="h-9 w-9 rounded-full flex items-center justify-center flex-none"
                style={{ background: `rgb(${YELLOW})`, color: '#171717' }}
                aria-label="Subscribe"
              >
                <Send size={14} />
              </motion.button>
            </form>
            <p className="mt-2 text-[12px] min-h-[15px]" style={{ color: subscribed ? `rgb(${YELLOW})` : TEXT_FAINT }}>
              {subscribed ? 'You’re on the list.' : ' '}
            </p>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          variants={fadeUp}
          className="mt-8 md:mt-9 pt-5 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}
        >
          <p className="text-[12.5px]" style={{ color: TEXT_FAINT }}>
            © {new Date().getFullYear()} Nirmora. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="footer-legal-link text-[12.5px]">
              Privacy Policy
            </Link>
            <Link to="/terms" className="footer-legal-link text-[12.5px]">
              Terms
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <BackToTop />
    </footer>
  )
}
