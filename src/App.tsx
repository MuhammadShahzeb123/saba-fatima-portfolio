import { Scene } from './components/Scene'
import { HUD } from './components/HUD'
import { useScrollProgress, SCROLL_HEIGHT_VH } from './hooks/useScrollProgress'
import { galleryProjects } from './data/content'

export default function App() {
  const progress = useScrollProgress()

  return (
    <>
      <Scene progress={progress} />
      <HUD progress={progress} />
      <div
        className="scroll-track"
        style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
        aria-hidden
      />
      <noscript>
        <p>
          Saba Fatima portfolio — {galleryProjects.length} projects. Enable JavaScript for the 3D
          experience.
        </p>
      </noscript>
    </>
  )
}
