import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGate } from '../context/GateContext'

const OUTSIDE = new THREE.Vector3(0, 1.55, 9.5)
const INSIDE = new THREE.Vector3(0, 1.6, 1.8)
const LOOK_OUT = new THREE.Vector3(0, 1.4, 2)
const LOOK_IN = new THREE.Vector3(0, 1.35, -4)

/** Dolly from outside to just inside once the gate opens; then OrbitControls owns the camera. */
export function EntranceCamera() {
  const { camera } = useThree()
  const { gateOpen, entered, markEntered } = useGate()
  const look = useRef(LOOK_OUT.clone())
  const started = useRef(false)
  const t = useRef(0)

  useEffect(() => {
    if (!entered) {
      camera.position.copy(OUTSIDE)
      camera.lookAt(LOOK_OUT)
    }
  }, [camera, entered])

  useFrame((_, dt) => {
    if (entered) return

    if (!gateOpen) {
      camera.position.lerp(OUTSIDE, 0.12)
      look.current.lerp(LOOK_OUT, 0.12)
      camera.lookAt(look.current)
      return
    }

    if (!started.current) {
      started.current = true
      t.current = 0
    }

    t.current = Math.min(1, t.current + dt * 0.55)
    const e = 1 - Math.pow(1 - t.current, 3)
    camera.position.lerpVectors(OUTSIDE, INSIDE, e)
    look.current.lerpVectors(LOOK_OUT, LOOK_IN, e)
    camera.lookAt(look.current)

    if (t.current >= 1) markEntered()
  })

  return null
}
