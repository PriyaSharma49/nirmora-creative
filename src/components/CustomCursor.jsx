import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const rawPos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    setEnabled(true)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (e) => {
      rawPos.current.x = e.clientX
      rawPos.current.y = e.clientY
    }
    const onOver = (e) => {
      if (e.target.closest?.('a, button, [role="button"], input, textarea, select, .cursor-hover-target')) {
        document.documentElement.classList.add('cursor-hover')
      }
    }
    const onOut = (e) => {
      if (e.target.closest?.('a, button, [role="button"], input, textarea, select, .cursor-hover-target')) {
        document.documentElement.classList.remove('cursor-hover')
      }
    }
    const onDown = () => document.documentElement.classList.add('cursor-active')
    const onUp = () => document.documentElement.classList.remove('cursor-active')
    const onLeave = () => document.documentElement.classList.add('cursor-hidden')
    const onEnter = () => document.documentElement.classList.remove('cursor-hidden')

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mouseout', onOut, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    let raf
    const tick = () => {
      const isHovering = document.documentElement.classList.contains('cursor-hover')
      const isActive = document.documentElement.classList.contains('cursor-active')
      const overNativeZone = !!document
        .elementFromPoint(rawPos.current.x, rawPos.current.y)
        ?.closest?.('.cursor-native-zone')

      const ringEase = reduced ? 1 : 0.22
      ringPos.current.x += (rawPos.current.x - ringPos.current.x) * ringEase
      ringPos.current.y += (rawPos.current.y - ringPos.current.y) * ringEase

      if (dotRef.current) {
        const dotScale = isActive ? 0.7 : 1
        dotRef.current.style.transform = `translate3d(${rawPos.current.x}px, ${rawPos.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`
        dotRef.current.style.opacity = overNativeZone ? '0' : '1'
      }
      if (ringRef.current) {
        const ringScale = isHovering ? 1.9 : isActive ? 0.85 : 1
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${ringScale})`
        ringRef.current.style.borderColor = isHovering ? 'rgba(240,184,63,0.95)' : 'rgba(214,154,45,0.7)'
        ringRef.current.style.opacity = overNativeZone ? '0' : '1'
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-custom-cursor', 'cursor-hover', 'cursor-active', 'cursor-hidden')
    }
  }, [])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={ringRef}
        className="fixed top-0 left-0 h-7 w-7 rounded-full will-change-transform transition-[border-color] duration-200"
        style={{ border: '1px solid rgba(214,154,45,0.7)' }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-[5px] w-[5px] rounded-full will-change-transform"
        style={{
          background: '#F0B83F',
          boxShadow: '0 0 6px rgba(240,184,63,0.55)',
        }}
      />
    </div>
  )
}
