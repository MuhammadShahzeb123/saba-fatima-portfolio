import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/** Camera walks from exterior (z≈10) deep into corridor (z≈-95). */
export function ScrollCamera({ progress }: { progress: number }) {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(0, 1.4, -20))
  const target = useRef(new THREE.Vector3(0, 1.55, 10))

  useFrame((_, dt) => {
    const p = progress
    const z = THREE.MathUtils.lerp(10, -95, p)
    const y = THREE.MathUtils.lerp(1.55, 1.45, p)
    // gentle sway, reduced near props so we stay centered in corridor
    const swayAmp = p > 0.1 && p < 0.95 ? 0.1 : 0.05
    const x = Math.sin(p * Math.PI * 4) * swayAmp

    target.current.set(x, y, z)

    // Safer damp — avoid overshoot into walls/props; clamp max step on big jumps
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

    // Keep a safer near clip so wall text / character don't slice as badly
    if ('near' in camera) {
      const cam = camera as THREE.PerspectiveCamera
      // Slightly higher near when deep in corridor reduces large-prop clipping artifacts
      const wantNear = p > 0.15 ? 0.35 : 0.15
      if (Math.abs(cam.near - wantNear) > 0.01) {
        cam.near = wantNear
        cam.updateProjectionMatrix()
      }
    }

    const lookZ = camera.position.z - 8
    look.current.lerp(new THREE.Vector3(0, 1.4, lookZ), 0.12)
    camera.lookAt(look.current)

    if ('fov' in camera) {
      const cam = camera as THREE.PerspectiveCamera
      const targetFov = p < 0.08 ? 55 + (1 - p / 0.08) * 8 : 52
      cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 4, dt)
      cam.updateProjectionMatrix()
    }
  })

  return null
}
