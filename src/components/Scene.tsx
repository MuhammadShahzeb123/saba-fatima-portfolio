import { Suspense, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ScrollCamera } from './ScrollCamera'
import { Exterior } from './Exterior'
import { Corridor } from './Corridor'
import { Gallery } from './Gallery'
import { AboutRoom, ExperienceRoom, SkillsRoom, ContactRoom } from './Rooms'
import { Character } from './Character'
import { Doorways } from './Doorways'
import { getIsMobile } from '../hooks/useIsMobile'
import { useTheme } from '../theme/ThemeContext'
import { clearTextureCache } from '../utils/textures'
import { useGate } from '../context/GateContext'

function ThemeEnvironment() {
  const { theme, colors } = useTheme()
  const { scene, gl } = useThree()

  useEffect(() => {
    const bg = new THREE.Color(colors.fog)
    scene.background = bg
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(bg)
    }
    gl.setClearColor(bg, 1)
    clearTextureCache(theme)
  }, [theme, colors.fog, scene, gl])

  return null
}

/** Pull fog back when near section doors so plaques stay readable. */
function AdaptiveFog({ progress }: { progress: number }) {
  const { scene } = useThree()
  const mobile = useMemo(() => getIsMobile(), [])
  const { colors } = useTheme()

  useEffect(() => {
    const fog = scene.fog
    if (!(fog instanceof THREE.Fog)) return
    // Door zones (approx progress): gallery ~0.25–0.55, about 0.64, exp 0.74, skills 0.84, contact 0.94
    const nearDoor =
      (progress > 0.22 && progress < 0.58) ||
      (progress > 0.6 && progress < 0.98)
    const baseNear = mobile ? 22 : 26
    const baseFar = mobile ? 70 : 85
    fog.near = nearDoor ? (mobile ? 14 : 16) : baseNear
    fog.far = nearDoor ? (mobile ? 55 : 68) : baseFar
    fog.color.set(colors.fog)
  }, [progress, scene, mobile, colors.fog])

  return null
}

export function Scene({ progress }: { progress: number }) {
  const mobile = useMemo(() => getIsMobile(), [])
  const { theme, colors } = useTheme()
  const { gateOpen } = useGate()
  const dpr = useMemo(
    () => (mobile ? ([1, 1.5] as [number, number]) : ([1, 1.75] as [number, number])),
    [mobile],
  )
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
        background: colors.paper,
        // CRITICAL: let native document scroll work on mobile
        pointerEvents: 'none',
        touchAction: 'pan-y',
      }}
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = 'pan-y'
        gl.domElement.style.pointerEvents = 'none'
        gl.setClearColor(new THREE.Color(colors.paper), 1)
      }}
    >
      <color attach="background" args={[colors.fog]} />
      <fog attach="fog" args={[colors.fog, fogNear, fogFar]} />
      <ThemeEnvironment />
      <AdaptiveFog progress={progress} />
      <ScrollCamera progress={progress} gateOpen={gateOpen} />
      <Suspense fallback={null}>
        <Exterior />
        <Corridor />
        <Character />
        <Doorways progress={progress} />
        <Gallery progress={progress} />
        <AboutRoom />
        <ExperienceRoom />
        <SkillsRoom />
        <ContactRoom />
      </Suspense>
      <ambientLight intensity={theme === 'dark' ? 0.85 : 1} />
    </Canvas>
  )
}
