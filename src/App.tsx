import { useCallback, useMemo } from 'react'
import { Scene } from './components/Scene'
import { HUD } from './components/HUD'
import {
  useScrollProgress,
  useVisualViewportCssVar,
  getScrollHeightVh,
  getScrollMax,
} from './hooks/useScrollProgress'
import { galleryProjects } from './data/content'
import { useIsMobile } from './hooks/useIsMobile'
import { GateProvider } from './context/GateContext'

export default function App() {
  const progress = useScrollProgress()
  useVisualViewportCssVar()
  const mobile = useIsMobile()
  const scrollVh = useMemo(() => getScrollHeightVh(), [mobile])

  const nudgeScroll = useCallback((dir: 1 | -1) => {
    const max = getScrollMax()
    const step = getScrollMax() * 0.1 || window.innerHeight * 0.1
    // Prefer 10% of max scroll range so scrubber advances camera meaningfully
    const amount = Math.max(step, max * 0.1)
    window.scrollTo({ top: Math.max(0, Math.min(max, window.scrollY + dir * amount)), behavior: 'smooth' })
  }, [])

  return (
    <GateProvider progress={progress}>
      <Scene progress={progress} />
      <HUD progress={progress} />
      <div
        className="scroll-track"
        style={{ height: `calc(var(--vvh, 1vh) * ${scrollVh})` }}
        aria-hidden
      />
      {mobile && (
        <div className="mobile-scrubber" aria-label="Scroll controls">
          <button type="button" className="scrub-btn" aria-label="Scroll up" onClick={() => nudgeScroll(-1)}>
            ▲
          </button>
          <div className="scrub-meter">
            <div className="scrub-fill" style={{ height: `${Math.min(100, progress * 100)}%` }} />
          </div>
          <button type="button" className="scrub-btn" aria-label="Scroll down" onClick={() => nudgeScroll(1)}>
            ▼
          </button>
        </div>
      )}
      <noscript>
        <p>
          Saba Fatima portfolio — {galleryProjects.length} projects. Enable JavaScript for the 3D
          experience.
        </p>
      </noscript>
    </GateProvider>
  )
}
