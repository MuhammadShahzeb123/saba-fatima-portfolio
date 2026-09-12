import { Suspense, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Exterior } from './Exterior'
import { Room } from './Room'
import { EntranceCamera } from './EntranceCamera'
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
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(bg)
    gl.setClearColor(bg, 1)
    clearTextureCache(theme)
  }, [theme, colors.fog, scene, gl])

  return null
}

function FreeLook() {
  const { entered } = useGate()
  const mobile = useMemo(() => getIsMobile(), [])

  return (
    <OrbitControls
      makeDefault
      enabled={entered}
      enableRotate={entered}
      enablePan={entered}
      enableZoom={entered}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={mobile ? 0.7 : 0.55}
      panSpeed={0.35}
      minDistance={2.5}
      maxDistance={14}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI / 2 - 0.12}
      target={[0, 1.35, -5]}
    />
  )
}

export function Scene() {
  const mobile = useMemo(() => getIsMobile(), [])
  const { theme, colors } = useTheme()
  const dpr = useMemo(
    () => (mobile ? ([1, 1.5] as [number, number]) : ([1, 1.75] as [number, number])),
    [mobile],
  )

  return (
    <Canvas
      className="scene-canvas"
      dpr={dpr}
      camera={{ position: [0, 1.55, 9.5], fov: 52, near: 0.2, far: 120 }}
      gl={{
        antialias: !mobile,
        powerPreference: mobile ? 'low-power' : 'high-performance',
        alpha: false,
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: colors.paper,
        pointerEvents: 'auto',
        touchAction: 'none',
      }}
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = 'none'
        gl.domElement.style.pointerEvents = 'auto'
        gl.setClearColor(new THREE.Color(colors.paper), 1)
      }}
    >
      <color attach="background" args={[colors.fog]} />
      <fog attach="fog" args={[colors.fog, mobile ? 18 : 22, mobile ? 55 : 70]} />
      <ThemeEnvironment />
      <EntranceCamera />
      <FreeLook />
      <Suspense fallback={null}>
        <Exterior />
        <Room />
      </Suspense>
      <ambientLight intensity={theme === 'dark' ? 0.85 : 1} />
    </Canvas>
  )
}
