import { useMemo } from 'react'
import * as THREE from 'three'
import {
  brickTexture,
  woodSignTexture,
  foliageTexture,
  catTexture,
  cobbleTexture,
  cached,
} from '../utils/textures'
import { useTheme } from '../theme/ThemeContext'
import { GateDoors } from './GateDoors'

/** Simplified facade — gate only; projects live inside the room. */
export function Exterior() {
  const { theme, colors } = useTheme()
  const brick = useMemo(() => {
    const t = cached(`brick-hi@${theme}`, () => brickTexture(1024, 1024, theme))
    t.repeat.set(1.4, 1.1)
    return t
  }, [theme])
  const sign = useMemo(
    () => cached(`sign-portfolio@${theme}`, () => woodSignTexture('PORTFOLIO', 768, 220, theme)),
    [theme],
  )
  const foliage = useMemo(() => cached(`foliage@${theme}`, () => foliageTexture(640, 640, theme)), [theme])
  const cat = useMemo(() => cached(`cat@${theme}`, () => catTexture(320, 320, theme)), [theme])
  const cobble = useMemo(() => {
    const t = cached(`cobble@${theme}`, () => cobbleTexture(640, 640, theme))
    t.repeat.set(2, 4)
    return t
  }, [theme])

  return (
    <group position={[0, 0, 2]}>
      <mesh position={[0, 2.35, -0.08]}>
        <boxGeometry args={[12, 6.2, 0.18]} />
        <meshBasicMaterial map={brick} />
      </mesh>

      <DoorFrameWall />
      <GateDoors />

      <mesh position={[0, 3.85, 0.22]}>
        <boxGeometry args={[3.35, 0.95, 0.12]} />
        <meshBasicMaterial color={colors.signBoard} />
      </mesh>
      <mesh position={[0, 3.85, 0.29]}>
        <planeGeometry args={[3.25, 0.88]} />
        <meshBasicMaterial map={sign} transparent />
      </mesh>

      <group position={[-4.2, 0, 0.45]}>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.16, 0.22, 2.8, 8]} />
          <meshBasicMaterial color={theme === 'dark' ? '#3a2e24' : '#5c4033'} />
        </mesh>
        <mesh position={[0, 3.25, 0.08]}>
          <planeGeometry args={[3.2, 3.2]} />
          <meshBasicMaterial map={foliage} transparent depthWrite={false} />
        </mesh>
      </group>

      <mesh position={[-2.1, 0.48, 0.95]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial map={cat} transparent depthWrite={false} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 3.2]}>
        <planeGeometry args={[3.2, 7.5]} />
        <meshBasicMaterial map={cobble} />
      </mesh>
    </group>
  )
}

function DoorFrameWall() {
  const { colors } = useTheme()
  const W = 4.55
  const H = 3.15
  const T = 0.22
  return (
    <group position={[0, 1.55, 0.08]}>
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[W + 0.35, H + 0.35, T]} />
        <meshBasicMaterial color={colors.doorFrameDeep} />
      </mesh>
      <lineSegments position={[0, 0, 0.06]}>
        <edgesGeometry args={[new THREE.BoxGeometry(W + 0.35, H + 0.35, T)]} />
        <lineBasicMaterial color={colors.ink} />
      </lineSegments>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[W + 0.08, H + 0.08, 0.1]} />
        <meshBasicMaterial color={colors.doorFrameInner} />
      </mesh>
      <mesh position={[0, H / 2 + 0.12, 0.12]}>
        <boxGeometry args={[W + 0.5, 0.18, 0.28]} />
        <meshBasicMaterial color={colors.doorFrame} />
      </mesh>
    </group>
  )
}
