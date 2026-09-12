import { Scene } from './components/Scene'
import { HUD } from './components/HUD'
import {
  useScrollProgress,
  useVisualViewportCssVar,
  useTouchScrollBridge,
  SCROLL_HEIGHT_VH,
} from './hooks/useScrollProgress'
import { galleryProjects } from './data/content'
import { useIsMobile } from './hooks/useIsMobile'

export default function App() {
  const progress = useScrollProgress()
  useVisualViewportCssVar()
  useTouchScrollBridge()
  const mobile = useIsMobile()

  return (
    <>
      <Scene progress={progress} />
      <HUD progress={progress} />
      <div
        className="scroll-track"
        style={{ height: `calc(var(--vvh, 1vh) * ${SCROLL_HEIGHT_VH})` }}
        aria-hidden
      />
      {mobile && (
        <div className="mobile-hint" aria-hidden>
          Swipe to scroll · Tap doors for GitHub
        </div>
      )}
      <noscript>
        <p>
          Saba Fatima portfolio — {galleryProjects.length} projects. Enable JavaScript for the 3D
          experience.
        </p>
      </noscript>
    </>
  )
}
