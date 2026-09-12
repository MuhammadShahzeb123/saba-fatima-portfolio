import { useEffect, useRef, useState } from 'react'

/** Viewport height used for scroll math (visualViewport on mobile). */
export function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight
}

export function getScrollMax() {
  return Math.max(1, document.documentElement.scrollHeight - getViewportHeight())
}

/** Keep --vvh in sync so scroll-track height works on iOS/Android. */
export function useVisualViewportCssVar() {
  useEffect(() => {
    const apply = () => {
      const h = getViewportHeight()
      document.documentElement.style.setProperty('--vvh', `${h * 0.01}px`)
      // Also sync classic --vh for fallbacks
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }
    apply()
    window.addEventListener('resize', apply)
    window.visualViewport?.addEventListener('resize', apply)
    window.visualViewport?.addEventListener('scroll', apply)
    return () => {
      window.removeEventListener('resize', apply)
      window.visualViewport?.removeEventListener('resize', apply)
      window.visualViewport?.removeEventListener('scroll', apply)
    }
  }, [])
}

/**
 * Touch → window scroll bridge for fixed WebGL canvas.
 * Browser pan-y alone is unreliable when R3F captures pointers.
 */
export function useTouchScrollBridge() {
  useEffect(() => {
    let startY = 0
    let startScroll = 0
    let tracking = false
    let moved = false

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const t = e.target as HTMLElement | null
      // Let HUD / links / buttons handle their own touches
      if (t?.closest?.('.hud, a, button, .paper-btn, .hud-menu, .enter-corridor-btn, input, textarea')) return
      // Prefer canvas / webgl surface; still allow body touches
      startY = e.touches[0].clientY
      startScroll = window.scrollY
      tracking = true
      moved = false
    }

    const onMove = (e: TouchEvent) => {
      if (!tracking || e.touches.length !== 1) return
      const dy = startY - e.touches[0].clientY
      if (Math.abs(dy) > 6) moved = true
      if (moved) {
        // Drive page scroll so ScrollCamera advances on phones
        window.scrollTo(0, startScroll + dy)
        // Prevent browser gesture fighting our scroll when we own it
        if (e.cancelable) e.preventDefault()
      }
    }

    const onEnd = () => {
      tracking = false
      moved = false
    }

    // Capture on document so touches on canvas still reach us
    document.addEventListener('touchstart', onStart, { passive: true, capture: true })
    document.addEventListener('touchmove', onMove, { passive: false, capture: true })
    document.addEventListener('touchend', onEnd, { passive: true, capture: true })
    document.addEventListener('touchcancel', onEnd, { passive: true, capture: true })

    return () => {
      document.removeEventListener('touchstart', onStart, true)
      document.removeEventListener('touchmove', onMove, true)
      document.removeEventListener('touchend', onEnd, true)
      document.removeEventListener('touchcancel', onEnd, true)
    }
  }, [])
}

/** Maps window scroll to 0–1 progress over a tall scroll track. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const smooth = useRef(0)

  useEffect(() => {
    let raf = 0
    const readRaw = () => window.scrollY / getScrollMax()

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const raw = readRaw()
        smooth.current += (raw - smooth.current) * 0.14
        setProgress(smooth.current)
      })
    }

    const tick = () => {
      const raw = readRaw()
      const next = smooth.current + (raw - smooth.current) * 0.1
      if (Math.abs(next - smooth.current) > 0.00005) {
        smooth.current = next
        setProgress(next)
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.visualViewport?.addEventListener('resize', onScroll)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.visualViewport?.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return progress
}

/** Tall track; paired with --vvh so mobile viewports get real scroll distance. */
export const SCROLL_HEIGHT_VH = 900
