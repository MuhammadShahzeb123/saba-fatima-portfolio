import { useEffect, useRef, useState } from 'react'
import { getIsMobile } from './useIsMobile'

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
 * Native document scroll is the camera driver.
 * Do NOT preventDefault on touchmove — canvas uses pointer-events:none
 * so the browser scrolls the tall .scroll-track freely.
 */
export function useTouchScrollBridge() {
  // Intentionally empty: previous preventDefault bridge blocked mobile scroll.
  // Interactions live in HUD / Html hotspots with pointer-events:auto.
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
        smooth.current += (raw - smooth.current) * 0.18
        setProgress(smooth.current)
      })
    }

    const tick = () => {
      const raw = readRaw()
      const next = smooth.current + (raw - smooth.current) * 0.12
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

/** Tall track; taller on mobile so finger swipes have room to move the camera. */
export function getScrollHeightVh() {
  return getIsMobile() ? 1200 : 900
}

export const SCROLL_HEIGHT_VH = 900
