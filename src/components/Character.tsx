import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../theme/ThemeContext'
import { cached } from '../utils/textures'

/** Flat sketched character silhouette in the hub — original, not ITOM art. */
export function Character() {
  const ref = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const { theme, colors } = useTheme()

  const tex = useMemo(() => {
    return cached(`character@${theme}`, () => {
    const c = document.createElement('canvas')
    c.width = 640
    c.height = 960
    const ctx = c.getContext('2d')!
    ctx.clearRect(0, 0, 640, 960)
    ctx.strokeStyle = colors.ink
    ctx.lineWidth = 3.5
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.fillStyle = colors.characterFill

    const ink = (fn: () => void) => {
      fn()
      ctx.fill()
      ctx.stroke()
      // second pass for sketch doubling
      ctx.save()
      ctx.globalAlpha = 0.35
      ctx.lineWidth = 1.6
      ctx.translate(1.5, 1)
      fn()
      ctx.stroke()
      ctx.restore()
      ctx.lineWidth = 3.5
      ctx.globalAlpha = 1
    }

    // head
    ink(() => {
      ctx.beginPath()
      ctx.arc(320, 175, 88, 0, Math.PI * 2)
    })

    // hair bunches
    ink(() => {
      ctx.beginPath()
      ctx.ellipse(248, 150, 36, 46, -0.3, 0, Math.PI * 2)
    })
    ink(() => {
      ctx.beginPath()
      ctx.ellipse(392, 150, 36, 46, 0.3, 0, Math.PI * 2)
    })

    // smile + eyes
    ctx.fillStyle = colors.ink
    ctx.beginPath()
    ctx.arc(288, 168, 7, 0, Math.PI * 2)
    ctx.arc(352, 168, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(320, 195, 28, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.stroke()

    // glasses
    ctx.beginPath()
    ctx.arc(288, 168, 22, 0, Math.PI * 2)
    ctx.arc(352, 168, 22, 0, Math.PI * 2)
    ctx.moveTo(310, 168)
    ctx.lineTo(330, 168)
    ctx.stroke()

    // body
    ctx.fillStyle = colors.characterFill
    ink(() => {
      ctx.beginPath()
      ctx.moveTo(235, 275)
      ctx.lineTo(405, 275)
      ctx.lineTo(428, 600)
      ctx.lineTo(212, 600)
      ctx.closePath()
    })

    // arm wave
    ctx.beginPath()
    ctx.moveTo(405, 325)
    ctx.quadraticCurveTo(510, 250, 485, 175)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(485, 162, 20, 0, Math.PI * 2)
    ctx.stroke()

    // other arm
    ctx.beginPath()
    ctx.moveTo(235, 340)
    ctx.lineTo(170, 450)
    ctx.stroke()

    // legs
    ctx.beginPath()
    ctx.moveTo(275, 600)
    ctx.lineTo(260, 780)
    ctx.lineTo(300, 780)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(365, 600)
    ctx.lineTo(380, 780)
    ctx.lineTo(340, 780)
    ctx.stroke()

    // shoes
    ctx.beginPath()
    ctx.ellipse(275, 792, 36, 14, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(365, 792, 36, 14, 0, 0, Math.PI * 2)
    ctx.stroke()

    // hatch shading on dress
    ctx.globalAlpha = 0.22
    for (let i = 0; i < 10; i++) {
      ctx.beginPath()
      ctx.moveTo(250, 320 + i * 22)
      ctx.lineTo(390, 325 + i * 22)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
    })
  }, [theme, colors.ink, colors.characterFill])

  useFrame(() => {
    if (!ref.current) return
    const dist = Math.abs(camera.position.z - ref.current.position.z)
    const fade = THREE.MathUtils.clamp((dist - 1.6) / 3.4, 0, 1)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = fade
    const s = 0.68 + fade * 0.32
    ref.current.scale.setScalar(s)
    const side = (1 - fade) * 0.45
    ref.current.position.x = side
  })

  return (
    <mesh ref={ref} position={[0, 1.15, -7.2]}>
      <planeGeometry args={[1.6, 2.4]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  )
}
