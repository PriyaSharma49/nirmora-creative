import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Calendar, Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { SERVICES } from '../data/services.js'

const EASE = [0.22, 1, 0.36, 1]
const SAGE = '#C58A2A'

/* ============================================================================
   BOOKING MODAL — an in-site "Book a Call" flow (calendar → time → details →
   confirmation), used only from ContactPanel. Available times come from
   /api/bookings/availability (the backend is the sole source of truth for
   business hours, already-booked slots and past-time exclusion — nothing
   here is hardcoded). "Confirm Booking" submits to /api/bookings, which
   re-validates and atomically creates the booking server-side; a 409 means
   someone else took the slot first, and the UI drops back to time
   selection with a fresh availability fetch.
   ============================================================================ */

// Quick client-side disabling for calendar cells (past dates, Sundays) so
// the grid doesn't need a network round trip just to render. The backend's
// /api/bookings/availability enforces the same rules independently — this
// is a UX convenience, not the source of truth.
function isDateAvailable(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date < today) return false
  if (date.getDay() === 0) return false // studio is closed Sundays
  return true
}

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Backend times are 24-hour "HH:MM" (IST wall-clock) — displayed as
// 12-hour with AM/PM, but the raw "HH:MM" value is what's actually
// submitted back to /api/bookings.
function formatTime12h(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

function getMonthGrid(viewDate) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function CalendarStep({ viewDate, setViewDate, selectedDate, onSelectDate, selectedTime, onSelectTime, times, timesLoading, timesError }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cells = getMonthGrid(viewDate)
  const canGoPrev = !isSameMonth(viewDate, today) && viewDate > today

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          aria-label="Previous month"
          disabled={!canGoPrev}
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
          className="h-8 w-8 rounded-full flex items-center justify-center text-[#20221F]/60 transition-colors duration-300 hover:text-[#20221F] hover:bg-[#20221F]/5 disabled:opacity-25 disabled:pointer-events-none"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-display text-[15px] font-semibold text-[#20221F]">
          {viewDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
          className="h-8 w-8 rounded-full flex items-center justify-center text-[#20221F]/60 transition-colors duration-300 hover:text-[#20221F] hover:bg-[#20221F]/5"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1.5 mb-1">
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={i} className="text-center text-[10.5px] font-mono uppercase tracking-wider text-[#8A8981]">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1.5">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />
          const available = isDateAvailable(date)
          const selected = isSameDay(date, selectedDate)
          return (
            <div key={i} className="flex items-center justify-center">
              <button
                type="button"
                disabled={!available}
                onClick={() => onSelectDate(date)}
                aria-label={date.toDateString()}
                aria-pressed={selected}
                className={`h-8 w-8 rounded-full text-[13px] transition-all duration-250 flex items-center justify-center ${
                  selected
                    ? 'text-[#FBF7EF] font-semibold'
                    : available
                    ? 'text-[#20221F]/75 hover:bg-[#20221F]/8 hover:text-[#20221F]'
                    : 'text-[#20221F]/20 cursor-not-allowed'
                }`}
                style={selected ? { background: SAGE } : undefined}
              >
                {date.getDate()}
              </button>
            </div>
          )
        })}
      </div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-6 pt-5"
          style={{ borderTop: '1px solid rgba(32,34,31,0.12)' }}
        >
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#8A8981] mb-3">Available times</div>
          {timesLoading ? (
            <p className="text-[13px] text-[#8A8981]">Checking availability…</p>
          ) : timesError ? (
            <p className="text-[13px] text-red-500/90">{timesError}</p>
          ) : times.length ? (
            <div className="grid grid-cols-2 gap-2.5">
              {times.map((t) => {
                const active = t === selectedTime
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onSelectTime(t)}
                    aria-pressed={active}
                    className="rounded-xl py-2.5 text-[13.5px] font-medium transition-all duration-250"
                    style={{
                      background: active ? 'rgba(197,138,42,0.14)' : '#FAF9F5',
                      border: `1px solid ${active ? 'rgba(197,138,42,0.6)' : 'rgba(32,34,31,0.12)'}`,
                      color: active ? SAGE : 'rgba(32,34,31,0.85)',
                    }}
                  >
                    {formatTime12h(t)} <span className="text-[#8A8981] text-[11px]">IST</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-[13px] text-[#8A8981]">No available times on this date — please choose another.</p>
          )}
        </motion.div>
      )}
    </div>
  )
}

function DetailsStep({
  name, email, company, service, projectDetails,
  setName, setEmail, setCompany, setService, setProjectDetails,
  selectedDate, selectedTime, onConfirm, sending, error,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onConfirm()
      }}
    >
      <div className="mb-5 pb-4 flex items-center gap-2.5 text-[13.5px] text-[#66665F]" style={{ borderBottom: '1px solid rgba(32,34,31,0.12)' }}>
        <Calendar size={15} className="text-[#C58A2A] shrink-0" />
        {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {formatTime12h(selectedTime)} IST
      </div>

      <div className="text-[11px] uppercase tracking-[0.14em] text-[#8A8981] mb-4">Your details</div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#8A8981]">Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="field-input-dark" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#8A8981]">Email</span>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="field-input-dark" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#8A8981]">Company</span>
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Brand / company name (optional)" className="field-input-dark" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#8A8981]">Service (optional)</span>
          <select value={service} onChange={(e) => setService(e.target.value)} className="field-input-dark">
            <option value="">Not sure yet</option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.title}>{s.title}</option>
            ))}
            <option value="Full Growth System">Full Growth System</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#8A8981]">Project Details (optional)</span>
          <textarea
            rows={3}
            value={projectDetails}
            onChange={(e) => setProjectDetails(e.target.value)}
            placeholder="A few lines about what you'd like to discuss..."
            className="field-input-dark resize-y"
          />
        </label>
      </div>

      {error && <p className="mt-3 text-[13px] text-red-400/90">{error}</p>}

      <button type="submit" disabled={sending} className="btn-gold-solid justify-center w-full mt-6">
        {sending ? 'Sending…' : 'Confirm Booking'}
        <ChevronRight size={15} />
      </button>
    </form>
  )
}

function SuccessStep({ selectedDate, selectedTime, bookingId, onClose }) {
  return (
    <div className="py-4 text-center">
      <div
        className="mx-auto mb-5 h-12 w-12 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(197,138,42,0.12)', border: '1px solid rgba(197,138,42,0.4)' }}
      >
        <Check size={20} style={{ color: SAGE }} />
      </div>
      <h3 className="font-display text-[22px] font-semibold text-[#20221F] mb-2">Booking confirmed.</h3>
      <p className="text-[14.5px] text-[#66665F] leading-relaxed max-w-[300px] mx-auto">
        Your call is set for{' '}
        {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {formatTime12h(selectedTime)}{' '}
        IST. We'll send a confirmation email, plus reminders 24 hours and 30 minutes before the call.
      </p>
      {bookingId && (
        <p className="mt-3 font-mono text-[11px] tracking-[0.1em] text-[#8A8981]">Booking ID {bookingId}</p>
      )}
      <button type="button" onClick={onClose} className="btn-gold-outline justify-center w-full mt-7">
        Done
      </button>
    </div>
  )
}

export default function BookingModal({ open, onClose, defaults }) {
  const reduced = useReducedMotion()
  const panelRef = useRef(null)

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [step, setStep] = useState('calendar') // calendar | details | success

  const [times, setTimes] = useState([])
  const [timesLoading, setTimesLoading] = useState(false)
  const [timesError, setTimesError] = useState('')

  const [name, setName] = useState(defaults?.name || '')
  const [email, setEmail] = useState(defaults?.email || '')
  const [company, setCompany] = useState(defaults?.company || '')
  const [service, setService] = useState('')
  const [projectDetails, setProjectDetails] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState(null)

  useEffect(() => {
    if (open) {
      setName(defaults?.name || '')
      setEmail(defaults?.email || '')
      setCompany(defaults?.company || '')
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // The backend is the sole source of truth for available times — fetched
  // fresh every time a date is selected, and re-fetched after a booking
  // conflict so a stale slot can never be shown as available twice.
  async function fetchAvailability(date) {
    const dateKey = toDateKey(date)
    setTimesLoading(true)
    setTimesError('')
    try {
      const response = await fetch(`/api/bookings/availability?date=${dateKey}`)
      const data = await response.json()
      if (data.success) {
        setTimes(data.times || [])
      } else {
        setTimesError(data.message || 'Could not load availability.')
        setTimes([])
      }
    } catch (err) {
      console.error(err)
      setTimesError('Could not load availability. Please try again.')
      setTimes([])
    } finally {
      setTimesLoading(false)
    }
  }

  useEffect(() => {
    if (selectedDate) fetchAvailability(selectedDate)
  }, [selectedDate]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  function handleSelectTime(t) {
    setError('')
    setSelectedTime(t)
    setStep('details')
  }

  async function handleConfirm() {
    if (sending) return
    setSending(true)
    setError('')
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          service,
          projectDetails,
          bookingDate: toDateKey(selectedDate),
          bookingTime: selectedTime,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setBookingId(data.booking?.booking_id || null)
        setStep('success')
      } else if (data.conflict) {
        // Someone else took this exact slot between selection and
        // confirmation — drop back to time selection with fresh
        // availability rather than pretending the slot is still open.
        setSelectedTime(null)
        setStep('calendar')
        setError(data.message)
        fetchAvailability(selectedDate)
      } else {
        setError(data.message || 'Could not confirm your booking. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  function handleClose() {
    onClose()
    window.setTimeout(() => {
      setStep('calendar')
      setSelectedDate(null)
      setSelectedTime(null)
      setTimes([])
      setTimesError('')
      setBookingId(null)
      setError('')
      setService('')
      setProjectDetails('')
    }, 300)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={handleClose}
            className="absolute inset-0"
            style={{ background: 'rgba(32,34,31,0.55)', backdropFilter: 'blur(6px)' }}
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Book a call"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="relative w-full sm:max-w-[440px] max-h-[88vh] sm:max-h-[80vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl outline-none"
            style={{
              background: '#FAF9F5',
              border: '1px solid rgba(32,34,31,0.14)',
              boxShadow: '0 30px 80px -20px rgba(32,34,31,0.28)',
            }}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between px-6 md:px-7 pt-6 pb-4" style={{ background: '#FAF9F5' }}>
              <div>
                <h2 className="font-display text-[20px] font-semibold text-[#20221F]">Book a Call</h2>
                {step === 'calendar' && <p className="mt-1 text-[13px] text-[#66665F]">Choose a convenient time to speak with us.</p>}
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="h-8 w-8 -mt-1 -mr-1 rounded-full flex items-center justify-center text-[#20221F]/50 transition-colors duration-300 hover:text-[#20221F] hover:bg-[#20221F]/5 shrink-0"
              >
                <X size={17} />
              </button>
            </div>

            <div className="px-6 md:px-7 pb-7">
              {step === 'calendar' && (
                <>
                  {error && <p className="mb-4 text-[13px] text-red-500/90">{error}</p>}
                  <CalendarStep
                    viewDate={viewDate}
                    setViewDate={setViewDate}
                    selectedDate={selectedDate}
                    onSelectDate={(d) => {
                      setError('')
                      setSelectedDate(d)
                      setSelectedTime(null)
                    }}
                    selectedTime={selectedTime}
                    onSelectTime={handleSelectTime}
                    times={times}
                    timesLoading={timesLoading}
                    timesError={timesError}
                  />
                </>
              )}
              {step === 'details' && (
                <DetailsStep
                  name={name}
                  email={email}
                  company={company}
                  service={service}
                  projectDetails={projectDetails}
                  setName={setName}
                  setEmail={setEmail}
                  setCompany={setCompany}
                  setService={setService}
                  setProjectDetails={setProjectDetails}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onConfirm={handleConfirm}
                  sending={sending}
                  error={error}
                />
              )}
              {step === 'success' && (
                <SuccessStep selectedDate={selectedDate} selectedTime={selectedTime} bookingId={bookingId} onClose={handleClose} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
