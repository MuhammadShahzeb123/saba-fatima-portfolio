import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollCamera } from './ScrollCamera'
import { Exterior } from './Exterior'
import { Corridor } from './Corridor'
import { Gallery } from './Gallery'
import { AboutRoom, ExperienceRoom, SkillsRoom, ContactRoom } from './Rooms'
import { Character } from './Character'
import { Doorways } from './Doorways'
import { getIsMobile } from '../hooks/useIsMobile'

export function Scene({ progress }: { progress: number }) {
  const mobile = useMemo(() => getIsMobile(), [])
  // Mobile: clamp dpr [1, 1.5] for perf; desktop a bit sharper
  const dpr = useMemo(
    () => (mobile ? ([1, 1.5] as [number, number]) : ([1, 1.75] as [number, number])),
    [mobile],
  )
  // Less washed-out fog — push far plane out, start later
  const fogNear = mobile ? 22 : 26
  const fogFar = mobile ? 70 : 85

  return (
    <Canvas
      className="scene-canvas"
      dpr={dpr}
      camera={{ position: [0, 1.55, 10], fov: 52, near: 0.2, far: 200 }}
      gl={{
        antialias: !mobile,
        powerPreference: mobile ? 'low-power' : 'high-performance',
        alpha: false,
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#f4f0e6',
        touchAction: 'pan-y',
      }}
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = 'pan-y'
      }}
    >
      <color attach="background" args={['#f4f0e6']} />
      <fog attach="fog" args={['#f4f0e6', fogNear, fogFar]} />
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
