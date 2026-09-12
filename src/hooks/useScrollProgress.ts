import { useEffect, useRef, useState } from 'react'

/** Maps window scroll to 0–1 progress over a tall scroll track. */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const smooth = useRef(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        const raw = window.scrollY / max
        smooth.current += (raw - smooth.current) * 0.12
        setProgress(smooth.current)
      })
    }
    const tick = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const raw = window.scrollY / max
      const next = smooth.current + (raw - smooth.current) * 0.08
      if (Math.abs(next - smooth.current) > 0.00005) {
        smooth.current = next
        setProgress(next)
      }
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return progress
}

export const SCROLL_HEIGHT_VH = 900
