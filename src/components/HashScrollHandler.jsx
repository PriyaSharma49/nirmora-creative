import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const NAV_OFFSET = 96

// A fixed short delay isn't enough when navigating cross-page: PageTransition
// gives the outgoing page a 550ms exit animation (App.jsx's
// AnimatePresence mode="wait" doesn't mount the new page until that
// finishes), so a single 80ms-later lookup for e.g. "#services" from
// another route would consistently fail to find the element and silently
// no-op. Polling until the element actually exists (or a generous timeout
// elapses) handles both cases correctly: same-page hash clicks resolve
// almost immediately, cross-page ones wait out the transition.
const MAX_WAIT_MS = 900
const POLL_INTERVAL_MS = 50

export default function HashScrollHandler() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.replace('#', '')

    let cancelled = false
    let elapsed = 0

    const tryScroll = () => {
      if (cancelled) return
      const el = document.getElementById(id)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
        window.scrollTo({ top, behavior: 'smooth' })
        return
      }
      elapsed += POLL_INTERVAL_MS
      if (elapsed < MAX_WAIT_MS) {
        setTimeout(tryScroll, POLL_INTERVAL_MS)
      }
    }

    const t = setTimeout(tryScroll, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [pathname, hash, key])

  return null
}
