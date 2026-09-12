import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollCamera } from './ScrollCamera'
import { Exterior } from './Exterior'
import { Corridor } from './Corridor'
import { Gallery } from './Gallery'
import { AboutRoom, ExperienceRoom, SkillsRoom, ContactRoom } from './Rooms'
import { Character } from './Character'
import { Doorways } from './Doorways'

function isMobile() {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

export function Scene({ progress }: { progress: number }) {
  const dpr = useMemo(() => (isMobile() ? ([1, 1.25] as [number, number]) : ([1, 1.75] as [number, number])), [])

  return (
    <Canvas
      className="scene-canvas"
      dpr={dpr}
      camera={{ position: [0, 1.55, 10], fov: 52, near: 0.2, far: 200 }}
      gl={{ antialias: !isMobile(), powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, background: '#f4f0e6' }}
    >
      <color attach="background" args={['#f4f0e6']} />
      <fog attach="fog" args={['#f4f0e6', 18, 55]} />
      <ScrollCamera progress={progress} />
      <Suspense fallback={null}>
        <Exterior />
        <Corridor />
        <Character />
        <Doorways />
        <Gallery />
        <AboutRoom />
        <ExperienceRoom />
        <SkillsRoom />
        <ContactRoom />
      </Suspense>
      <ambientLight intensity={1} />
    </Canvas>
  )
}
