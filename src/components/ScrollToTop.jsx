import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return // let the Nav's own scroll-to-section logic handle it
    // 'instant' bypasses the global `scroll-behavior: smooth` (index.css) —
    // a route change should land at the top immediately, like a normal page
    // load, not visibly animate there from wherever the previous page's
    // scroll position was (which for a long previous page reads exactly
    // like "landed at the wrong section" while still mid-animation).
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
