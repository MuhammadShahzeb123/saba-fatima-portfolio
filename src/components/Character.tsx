import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/** Flat sketched character silhouette in the hub — original, not ITOM art. */
export function Character() {
  const ref = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 768
    const ctx = c.getContext('2d')!
    ctx.clearRect(0, 0, 512, 768)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    ctx.fillStyle = '#f7f3ea'

    // head
    ctx.beginPath()
    ctx.arc(256, 140, 70, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // hair bunches
    ctx.beginPath()
    ctx.ellipse(200, 120, 28, 36, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(312, 120, 28, 36, 0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // smile + eyes
    ctx.beginPath()
    ctx.arc(230, 135, 6, 0, Math.PI * 2)
    ctx.fillStyle = '#111'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(282, 135, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(256, 155, 22, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.stroke()

    // body
    ctx.fillStyle = '#f7f3ea'
    ctx.beginPath()
    ctx.moveTo(190, 220)
    ctx.lineTo(322, 220)
    ctx.lineTo(340, 480)
    ctx.lineTo(172, 480)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // arm wave
    ctx.beginPath()
    ctx.moveTo(322, 260)
    ctx.quadraticCurveTo(400, 200, 380, 140)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(380, 130, 16, 0, Math.PI * 2)
    ctx.stroke()

    // other arm
    ctx.beginPath()
    ctx.moveTo(190, 270)
    ctx.lineTo(140, 360)
    ctx.stroke()

    // legs
    ctx.beginPath()
    ctx.moveTo(220, 480)
    ctx.lineTo(210, 620)
    ctx.lineTo(240, 620)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(290, 480)
    ctx.lineTo(300, 620)
    ctx.lineTo(270, 620)
    ctx.stroke()

    // shoes
    ctx.beginPath()
    ctx.ellipse(220, 630, 28, 12, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(290, 630, 28, 12, 0, 0, Math.PI * 2)
    ctx.stroke()

    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const dist = Math.abs(camera.position.z - ref.current.position.z)
    // LOD: fade & scale down when camera approaches to prevent clipping
    const fade = THREE.MathUtils.clamp((dist - 1.4) / 3.2, 0, 1)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = fade
    const s = 0.7 + fade * 0.3
    ref.current.scale.setScalar(s)
    // nudge slightly aside when very close so camera path stays clear
    const side = (1 - fade) * 0.35
    ref.current.position.x = side
  })

  return (
    <mesh ref={ref} position={[0, 1.15, -7.2]}>
      <planeGeometry args={[1.55, 2.3]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  )
}
