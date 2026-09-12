import { Scene } from './components/Scene'
import { HUD } from './components/HUD'
import { InfoPanel } from './components/InfoPanel'
import { galleryProjects } from './data/content'
import { GateProvider } from './context/GateContext'
import { PanelProvider } from './context/PanelContext'

export default function App() {
  return (
    <GateProvider>
      <PanelProvider>
        <Scene />
        <HUD />
        <InfoPanel />
        <noscript>
          <p>
            Saba Fatima portfolio — {galleryProjects.length} projects. Enable JavaScript for the 3D
            experience.
          </p>
        </noscript>
      </PanelProvider>
    </GateProvider>
  )
}
