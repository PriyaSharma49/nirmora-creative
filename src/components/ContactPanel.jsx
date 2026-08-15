import { useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowRight, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { SERVICES } from '../data/services.js'
import BookingModal from './BookingModal.jsx'

const EASE = [0.22, 1, 0.36, 1]
const SAGE = '#C58A2A'
const WHATSAPP_HREF = 'https://wa.me/917304302068?text=Hi%20Nirmora%2C%20I%27d%20like%20to%20discuss%20a%20project.'
const EMAIL = 'nirmoracreative@gmail.com'

/* ============================================================================
   CONTACT PANEL — the shared two-column editorial contact experience used by
   both the standalone /contact page and the homepage's own Contact section.
   Left: real contact info (email, phone, WhatsApp, studio, socials). Right:
   the existing contact form, submitting to /api/contact (Supabase + Google
   Sheets + Gmail via Apps Script). Every string here is either the site's own real contact
   detail or copy explicitly given — nothing invented.
   ============================================================================ */

// lucide-react ships no WhatsApp mark, so this is a small hand-drawn one in
// the same thin-stroke language as the rest of the site's line icons.
function WhatsAppIcon({ size = 16, ...props }) {
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

// WhatsApp already has its own dedicated link under the phone number, so it
// is deliberately left out of this row to avoid duplicating it.
const SOCIALS = [
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/nirmoracreative/', Icon: Instagram },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com', Icon: Linkedin },
  { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com', Icon: Facebook },
]

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] uppercase tracking-[0.14em] text-[#8A8981]">{label}</span>
      {children}
    </label>
  )
}

// The one Book a Call CTA on this page — a bordered, secondary card (never
// filled) so it never competes visually with the primary Send Message
// button below it. Same booking mechanism as before: opens the existing
// BookingModal via onOpen, nothing about the destination/behavior changed.
function BookACallCard({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-all duration-300"
      style={{ background: '#FAF9F5', border: '1px solid rgba(197,138,42,0.35)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(197,138,42,0.7)'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197,138,42,0.10)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(197,138,42,0.35)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ border: `1px solid ${SAGE}` }}>
        <Phone size={16} strokeWidth={1.7} style={{ color: SAGE }} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] text-[#66665F]">Have questions? Let&apos;s connect.</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[15px] font-semibold text-[#20221F] transition-colors duration-300 group-hover:text-[#C58A2A]">
          Book a Call
          <ArrowRight size={14} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </span>
    </button>
  )
}

function MagneticSendButton({ pending, className = '', ...props }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 14, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 150, damping: 14, mass: 0.4 })

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.18)
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3)
  }
  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={`group btn-gold-solid justify-center w-full ${className}`}
      {...props}
    >
      {pending ? 'Sending…' : 'Send Message'}
      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
    </motion.button>
  )
}

function HeadingReveal({ reduced, inView }) {
  const lines = ['Let’s build your', 'growth system.']
  return (
    <h2 className="font-display font-bold text-[30px] md:text-[40px] text-[#20221F] leading-[1.12]">
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE, delay: 0.1 + i * 0.12 }}
            className="block"
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h2>
  )
}

export default function ContactPanel() {
  const reduced = useReducedMotion()
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true, amount: 0.15 })

  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [referenceId, setReferenceId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [service, setService] = useState(SERVICES[0].title)
  const [message, setMessage] = useState('')
  const [bookingOpen, setBookingOpen] = useState(false)

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Mirrors the backend's own validation (api/contact.js) exactly, so the
  // user never fires a request that's guaranteed to 400 — but the backend
  // re-checks everything independently regardless, since this is only a
  // convenience layer.
  function validate() {
    if (!name.trim()) return 'Please enter your name.'
    if (!email.trim()) return 'Please enter your email.'
    if (!EMAIL_RE.test(email.trim())) return 'Please enter a valid email address.'
    if (!company.trim()) return 'Please enter your company name.'
    if (!service.trim()) return 'Please select a service.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (sending) return

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSending(true)
    setError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, service, projectDetails: message }),
      })
      const data = await response.json()
      if (data.success) {
        setSent(true)
        setReferenceId(data.submissionId || '')
        setName('')
        setEmail('')
        setCompany('')
        setService(SERVICES[0].title)
        setMessage('')
      } else {
        // User-entered data is intentionally left in place so nothing is
        // lost on a retry.
        setError(data.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      ref={containerRef}
      initial={reduced ? undefined : { opacity: 0, y: 26 }}
      animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative"
    >
      <div className="glass-card relative grid grid-cols-1 lg:grid-cols-2 lg:divide-x lg:divide-[#20221F]/10">
        {/* ---------------- LEFT — CONTACT INFO ---------------- */}
        <div className="p-8 md:p-12 lg:p-14">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="eyebrow"
          >
            Get In Touch
          </motion.div>

          <HeadingReveal reduced={reduced} inView={inView} />

          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
            className="mt-5 max-w-[420px] text-[15.5px] leading-relaxed text-[#66665F]"
          >
            Tell us where your brand is today. We&apos;ll come back with a clear plan — not a generic proposal.
          </motion.p>

          <div className="mt-10 flex flex-col gap-7">
            {[
              {
                label: 'Email',
                delay: 0.54,
                node: (
                  <a href={`mailto:${EMAIL}`} className="group inline-flex items-center gap-2.5 font-semibold text-[#20221F] text-[16px] md:text-[17px]">
                    <Mail size={17} strokeWidth={1.7} style={{ color: SAGE }} className="shrink-0" />
                    <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#C58A2A]">{EMAIL}</span>
                  </a>
                ),
              },
              {
                label: 'Phone',
                delay: 0.64,
                node: (
                  <div className="flex flex-col items-start">
                    <a href="tel:+917304302068" className="group inline-flex items-center gap-2.5 font-semibold text-[#20221F] text-[16px] md:text-[17px]">
                      <Phone size={17} strokeWidth={1.7} style={{ color: SAGE }} className="shrink-0" />
                      <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#C58A2A]">
                        +91 73043 02068
                      </span>
                    </a>
                    <a
                      href={WHATSAPP_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat with Nirmora on WhatsApp"
                      className="group mt-3 inline-flex items-center gap-2 pl-[27px] text-[13.5px] text-[#8A8981] transition-colors duration-300 hover:text-[#C58A2A]"
                    >
                      <WhatsAppIcon
                        size={14}
                        className="shrink-0 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-px"
                      />
                      <span className="border-b border-transparent pb-px transition-colors duration-300 group-hover:border-[#C58A2A]/40">
                        Chat with us on WhatsApp
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1"> →</span>
                      </span>
                    </a>
                  </div>
                ),
              },
              {
                label: 'Studio',
                delay: 0.7,
                node: (
                  <span className="inline-flex items-center gap-2.5 font-semibold text-[#20221F] text-[16px] md:text-[17px]">
                    <MapPin size={17} strokeWidth={1.7} style={{ color: SAGE }} className="shrink-0" />
                    Mulund, Maharashtra, India
                  </span>
                ),
              },
            ].map((row) => (
              <motion.div
                key={row.label}
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE, delay: row.delay }}
              >
                <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8981] mb-1.5">{row.label}</span>
                {row.node}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: 0.86 }}
            className="flex gap-3 mt-9"
          >
            {SOCIALS.map(({ key, label, href, Icon }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-[rgba(32,34,31,0.14)] flex items-center justify-center text-[#66665F] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.06] hover:text-[#C58A2A] hover:border-[#C58A2A] hover:shadow-[0_0_16px_rgba(197,138,42,0.35)]"
              >
                <Icon size={16} strokeWidth={1.7} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* ---------------- RIGHT — FORM ---------------- */}
        <motion.form
          onSubmit={handleSubmit}
          noValidate
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={reduced ? undefined : inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
          className="p-8 md:p-12 lg:p-14 flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Name">
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="field-input-dark" />
            </Field>
            <Field label="Email">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="field-input-dark" />
            </Field>
          </div>

          <Field label="Company">
            <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Brand / company name" className="field-input-dark" />
          </Field>

          <Field label="Service Interested In">
            <select value={service} onChange={(e) => setService(e.target.value)} className="field-input-dark">
              {SERVICES.map((s) => (
                <option key={s.slug} value={s.title}>{s.title}</option>
              ))}
              <option>Full Growth System</option>
            </select>
          </Field>

          <Field label="Tell us about your project">
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="A few lines about your brand and goals..."
              className="field-input-dark resize-y"
            />
          </Field>

          <BookACallCard onOpen={() => setBookingOpen(true)} />

          <MagneticSendButton type="submit" disabled={sending} pending={sending} className="mt-1" />

          {sent && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="text-center text-[13.5px] text-[#C58A2A]"
              role="status"
            >
              ✓ Thanks — we&apos;ll be in touch within one business day.
              {referenceId && <span className="block mt-1 font-mono text-[11px] text-[#8A8981]">Reference {referenceId}</span>}
            </motion.div>
          )}

          {error && !sent && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="text-center text-[13.5px] text-red-500/90"
              role="alert"
            >
              {error}
            </motion.div>
          )}
        </motion.form>
      </div>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} defaults={{ name, email, company }} />
    </motion.div>
  )
}
