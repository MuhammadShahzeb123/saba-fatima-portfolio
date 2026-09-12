import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { doorTexture, cached } from '../utils/textures'
import { useTheme } from '../theme/ThemeContext'
import { useGate } from '../context/GateContext'
import { useMemo } from 'react'

const DOOR_W = 2.15
const DOOR_H = 3.05

/** Hinged double doors — swing open when gateOpen. */
export function GateDoors() {
  const { gateOpen } = useGate()
  const { theme, colors } = useTheme()
  const leftRef = useRef<THREE.Group>(null)
  const rightRef = useRef<THREE.Group>(null)
  const leftAngle = useRef(0)
  const rightAngle = useRef(0)

  const doorTex = useMemo(
    () => cached(`gate-door-panel@${theme}`, () => doorTexture(512, 768, true, theme)),
    [theme],
  )

  useFrame((_, dt) => {
    const targetL = gateOpen ? -Math.PI * 0.92 : 0
    const targetR = gateOpen ? Math.PI * 0.92 : 0
    const k = 1 - Math.exp(-5.5 * Math.min(dt, 0.05))
    leftAngle.current += (targetL - leftAngle.current) * k
    rightAngle.current += (targetR - rightAngle.current) * k
    if (leftRef.current) leftRef.current.rotation.y = leftAngle.current
    if (rightRef.current) rightRef.current.rotation.y = rightAngle.current
  })

  return (
    <group position={[0, 1.52, 0.55]}>
      <group ref={leftRef} position={[-DOOR_W / 2, 0, 0]}>
        <mesh position={[DOOR_W / 2, 0, 0]}>
          <boxGeometry args={[DOOR_W, DOOR_H, 0.1]} />
          <meshBasicMaterial color={colors.doorFrame} />
        </mesh>
        <mesh position={[DOOR_W / 2, 0, 0.055]}>
          <planeGeometry args={[DOOR_W - 0.08, DOOR_H - 0.08]} />
          <meshBasicMaterial map={doorTex} />
        </mesh>
        <mesh position={[DOOR_W - 0.28, 0, 0.1]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={colors.ink} />
        </mesh>
      </group>

      <group ref={rightRef} position={[DOOR_W / 2, 0, 0]}>
        <mesh position={[-DOOR_W / 2, 0, 0]}>
          <boxGeometry args={[DOOR_W, DOOR_H, 0.1]} />
          <meshBasicMaterial color={colors.doorFrame} />
        </mesh>
        <mesh position={[-DOOR_W / 2, 0, 0.055]}>
          <planeGeometry args={[DOOR_W - 0.08, DOOR_H - 0.08]} />
          <meshBasicMaterial map={doorTex} />
        </mesh>
        <mesh position={[-DOOR_W + 0.28, 0, 0.1]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={colors.ink} />
        </mesh>
      </group>

      {!gateOpen && (
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[0.04, DOOR_H + 0.05, 0.02]} />
          <meshBasicMaterial color={colors.ink} />
        </mesh>
      )}
    </group>
  )
}
