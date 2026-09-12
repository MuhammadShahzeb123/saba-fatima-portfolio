import { useMemo } from 'react'
import * as THREE from 'three'
import { woodSignTexture, doorTexture, cached } from '../utils/textures'

/** Decorative corridor door frames for section cues — boxes for depth. */
export function Doorways() {
  const doors: Array<{ label: string; z: number; side: -1 | 1 | 0 }> = [
    { label: 'THE GALLERY', z: -15, side: -1 },
    { label: 'ABOUT', z: -56, side: 1 },
    { label: 'EXPERIENCE', z: -66, side: -1 },
    { label: 'SKILLS', z: -76, side: 1 },
    { label: 'CONTACT', z: -86, side: 0 },
  ]

  return (
    <group>
      {doors.map((d) => (
        <Door key={d.label} {...d} />
      ))}
    </group>
  )
}

function Door({
  label,
  z,
  side,
}: {
  label: string
  z: number
  side: -1 | 1 | 0
}) {
  const sign = useMemo(
    () => cached(`door-sign-${label}`, () => woodSignTexture(label, 768, 200)),
    [label],
  )
  const door = useMemo(() => cached('inner-door', () => doorTexture(384, 640, false)), [])

  if (side === 0) {
    return (
      <group position={[0, 0, z]}>
        <mesh position={[0, 3.2, 0]}>
          <boxGeometry args={[2.9, 0.7, 0.08]} />
          <meshBasicMaterial color="#b8895a" />
        </mesh>
        <mesh position={[0, 3.2, 0.05]}>
          <planeGeometry args={[2.8, 0.65]} />
          <meshBasicMaterial map={sign} transparent />
        </mesh>
      </group>
    )
  }

  const x = side * 2.72
  const rotY = side > 0 ? -Math.PI / 2 : Math.PI / 2

  return (
    <group position={[x, 0, z]}>
      {/* Deep frame */}
      <mesh rotation={[0, rotY, 0]} position={[side * 0.06, 1.4, 0]}>
        <boxGeometry args={[1.55, 2.75, 0.18]} />
        <meshBasicMaterial color="#4a3424" />
      </mesh>
      <lineSegments rotation={[0, rotY, 0]} position={[side * 0.06, 1.4, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.55, 2.75, 0.18)]} />
        <lineBasicMaterial color="#111" />
      </lineSegments>
      <mesh rotation={[0, rotY, 0]} position={[0, 1.4, 0]}>
        <planeGeometry args={[1.35, 2.55]} />
        <meshBasicMaterial map={door} />
      </mesh>
      <mesh rotation={[0, rotY, 0]} position={[0, 3.05, 0]}>
        <boxGeometry args={[1.95, 0.55, 0.08]} />
        <meshBasicMaterial color="#b8895a" />
      </mesh>
      <mesh rotation={[0, rotY, 0]} position={[0, 3.05, 0.05]}>
        <planeGeometry args={[1.9, 0.52]} />
        <meshBasicMaterial map={sign} transparent />
      </mesh>
      <mesh rotation={[0, rotY, 0]} position={[side * 0.02, 2.4, 0.55]}>
        <planeGeometry args={[0.22, 0.09]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  )
}
