import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/** Section door Z positions for look-at framing. */
const DOOR_CUES: Array<{ z: number; x: number; p0: number; p1: number }> = [
  { z: -16, x: -0.55, p0: 0.22, p1: 0.34 }, // gallery start (left)
  { z: -28, x: 0.45, p0: 0.34, p1: 0.46 },
  { z: -40, x: -0.45, p0: 0.46, p1: 0.56 },
  { z: -58, x: 0.7, p0: 0.6, p1: 0.7 }, // about
  { z: -68, x: -0.7, p0: 0.7, p1: 0.79 }, // experience
  { z: -78, x: 0.7, p0: 0.79, p1: 0.88 }, // skills
  { z: -88, x: 0, p0: 0.88, p1: 1 }, // contact
]

/**
 * Camera walks from exterior (z≈10) deep into corridor (z≈-95).
 * While gate is closed, clamp progress so we stay outside looking at the doors.
 */
export function ScrollCamera({
  progress,
  gateOpen,
}: {
  progress: number
  gateOpen: boolean
}) {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(0, 1.4, -20))
  const target = useRef(new THREE.Vector3(0, 1.55, 10))

  useFrame((_, dt) => {
    // Hold just outside until the gate swings open
    const p = gateOpen ? progress : Math.min(progress, 0.025)
    // Slightly slower effective travel through gallery so doors are readable
    const mapped =
      p < 0.22
        ? p
        : p < 0.58
          ? 0.22 + (p - 0.22) * 0.85 // stretch gallery segment
          : 0.22 + 0.36 * 0.85 + (p - 0.58) * 1.08

    const tProg = THREE.MathUtils.clamp(mapped, 0, 1)
    const z = THREE.MathUtils.lerp(10, -95, tProg)
    const y = THREE.MathUtils.lerp(1.55, 1.45, tProg)

    let lookX = 0
    let swayAmp = tProg > 0.1 && tProg < 0.95 ? 0.08 : 0.04
    for (const cue of DOOR_CUES) {
      if (tProg >= cue.p0 && tProg < cue.p1) {
        const u = (tProg - cue.p0) / Math.max(0.001, cue.p1 - cue.p0)
        const envelope = Math.sin(u * Math.PI) // ease in/out toward door
        lookX = cue.x * envelope
        swayAmp = 0.03
        break
      }
    }

    const x = Math.sin(tProg * Math.PI * 4) * swayAmp + lookX * 0.35
    target.current.set(x, y, z)

    const maxStep = 2.8
    const dx = target.current.x - camera.position.x
    const dy = target.current.y - camera.position.y
    const dz = target.current.z - camera.position.z
    const dist = Math.hypot(dx, dy, dz)
    const dampFactor = dist > maxStep ? maxStep / dist : 1

    const t = Math.min(1, 1 - Math.exp(-5 * Math.min(dt, 0.05)))
    camera.position.x += dx * t * dampFactor
    camera.position.y += dy * t * dampFactor
    camera.position.z += dz * t * dampFactor

    if ('near' in camera) {
      const cam = camera as THREE.PerspectiveCamera
      const wantNear = tProg > 0.15 ? 0.35 : 0.15
      if (Math.abs(cam.near - wantNear) > 0.01) {
        cam.near = wantNear
        cam.updateProjectionMatrix()
      }
    }

    const lookZ = camera.position.z - 8
    look.current.lerp(new THREE.Vector3(lookX * 1.2, 1.4, lookZ), 0.1)
    camera.lookAt(look.current)

    if ('fov' in camera) {
      const cam = camera as THREE.PerspectiveCamera
      const targetFov = tProg < 0.08 ? 55 + (1 - tProg / 0.08) * 8 : 50
      cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 4, dt)
      cam.updateProjectionMatrix()
    }
  })

  return null
}
