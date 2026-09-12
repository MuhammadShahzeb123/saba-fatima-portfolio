import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../theme/ThemeContext'
import { cached } from '../utils/textures'
import type { Theme } from '../theme/ThemeContext'

function drawCharacter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  ink: string,
  fill: string,
  faceImg: HTMLImageElement | null,
) {
  ctx.clearRect(0, 0, w, h)
  ctx.strokeStyle = ink
  ctx.lineWidth = 4.5
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.fillStyle = fill

  const inkShape = (fn: () => void, fillIt = true) => {
    fn()
    if (fillIt) ctx.fill()
    ctx.stroke()
    ctx.save()
    ctx.globalAlpha = 0.28
    ctx.lineWidth = 2
    ctx.translate(2, 1.5)
    fn()
    ctx.stroke()
    ctx.restore()
    ctx.lineWidth = 4.5
    ctx.globalAlpha = 1
  }

  const cx = w / 2

  // —— Hijab / head silhouette (likeness to avatar) ——
  inkShape(() => {
    ctx.beginPath()
    ctx.ellipse(cx, 260, 145, 165, 0, 0, Math.PI * 2)
  })

  // Hijab drape layers
  inkShape(() => {
    ctx.beginPath()
    ctx.moveTo(cx - 130, 220)
    ctx.quadraticCurveTo(cx - 175, 380, cx - 110, 520)
    ctx.quadraticCurveTo(cx - 40, 480, cx - 90, 280)
    ctx.closePath()
  }, true)
  inkShape(() => {
    ctx.beginPath()
    ctx.moveTo(cx + 130, 220)
    ctx.quadraticCurveTo(cx + 175, 380, cx + 110, 520)
    ctx.quadraticCurveTo(cx + 40, 480, cx + 90, 280)
    ctx.closePath()
  }, true)

  // Under-cap peak
  ctx.beginPath()
  ctx.moveTo(cx - 70, 140)
  ctx.quadraticCurveTo(cx, 95, cx + 70, 140)
  ctx.stroke()

  // Face oval
  const faceR = 95
  const faceY = 255
  inkShape(() => {
    ctx.beginPath()
    ctx.ellipse(cx, faceY, faceR * 0.92, faceR, 0, 0, Math.PI * 2)
  })

  // Optional avatar face composite (desaturated + soft edge)
  if (faceImg && faceImg.complete && faceImg.naturalWidth > 0) {
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(cx, faceY, faceR * 0.78, faceR * 0.85, 0, 0, Math.PI * 2)
    ctx.clip()
    const fw = faceR * 2.1
    const fh = faceR * 2.4
    ctx.filter = 'grayscale(0.55) contrast(1.15) brightness(1.05)'
    ctx.globalAlpha = 0.72
    ctx.drawImage(faceImg, cx - fw / 2, faceY - fh / 2 - 10, fw, fh)
    ctx.filter = 'none'
    ctx.globalAlpha = 1
    ctx.restore()

    // Soft sketch edge over photo
    ctx.save()
    ctx.globalAlpha = 0.45
    ctx.strokeStyle = ink
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(cx, faceY, faceR * 0.78, faceR * 0.85, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  // Round glasses
  ctx.lineWidth = 3.5
  ctx.beginPath()
  ctx.arc(cx - 38, faceY - 8, 28, 0, Math.PI * 2)
  ctx.arc(cx + 38, faceY - 8, 28, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx - 10, faceY - 8)
  ctx.lineTo(cx + 10, faceY - 8)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx - 66, faceY - 8)
  ctx.lineTo(cx - 88, faceY - 18)
  ctx.moveTo(cx + 66, faceY - 8)
  ctx.lineTo(cx + 88, faceY - 18)
  ctx.stroke()

  // Eyes (over glasses if no photo, or reinforce)
  ctx.fillStyle = ink
  ctx.beginPath()
  ctx.arc(cx - 38, faceY - 6, 5, 0, Math.PI * 2)
  ctx.arc(cx + 38, faceY - 6, 5, 0, Math.PI * 2)
  ctx.fill()

  // Brows
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(cx - 58, faceY - 42)
  ctx.quadraticCurveTo(cx - 38, faceY - 50, cx - 18, faceY - 40)
  ctx.moveTo(cx + 18, faceY - 40)
  ctx.quadraticCurveTo(cx + 38, faceY - 50, cx + 58, faceY - 42)
  ctx.stroke()

  // Smile
  ctx.beginPath()
  ctx.arc(cx, faceY + 28, 32, 0.12 * Math.PI, 0.88 * Math.PI)
  ctx.stroke()

  // —— Outfit: kurta / top ——
  ctx.fillStyle = fill
  ctx.lineWidth = 4.5
  inkShape(() => {
    ctx.beginPath()
    ctx.moveTo(cx - 120, 480)
    ctx.lineTo(cx + 120, 480)
    ctx.lineTo(cx + 145, 780)
    ctx.lineTo(cx - 145, 780)
    ctx.closePath()
  })

  // Neckline
  ctx.beginPath()
  ctx.moveTo(cx - 40, 480)
  ctx.quadraticCurveTo(cx, 530, cx + 40, 480)
  ctx.stroke()

  // Kurta side slits
  ctx.globalAlpha = 0.35
  for (let i = 0; i < 12; i++) {
    ctx.beginPath()
    ctx.moveTo(cx - 100, 520 + i * 20)
    ctx.lineTo(cx + 100, 525 + i * 20)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // —— Arms ——
  // Left arm relaxed
  ctx.beginPath()
  ctx.moveTo(cx - 118, 540)
  ctx.quadraticCurveTo(cx - 200, 620, cx - 170, 720)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx - 168, 735, 22, 16, 0.2, 0, Math.PI * 2)
  ctx.stroke()

  // Right arm waving / holding laptop
  ctx.beginPath()
  ctx.moveTo(cx + 118, 530)
  ctx.quadraticCurveTo(cx + 210, 480, cx + 195, 400)
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx + 190, 385, 20, 16, -0.3, 0, Math.PI * 2)
  ctx.stroke()

  // Laptop under left arm / held
  ctx.fillStyle = fill
  inkShape(() => {
    ctx.beginPath()
    ctx.rect(cx - 55, 700, 130, 85)
  })
  ctx.beginPath()
  ctx.moveTo(cx - 55, 700)
  ctx.lineTo(cx - 30, 640)
  ctx.lineTo(cx + 100, 640)
  ctx.lineTo(cx + 75, 700)
  ctx.closePath()
  ctx.stroke()
  // Screen hatch
  ctx.globalAlpha = 0.25
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.moveTo(cx - 20, 650 + i * 8)
    ctx.lineTo(cx + 85, 650 + i * 8)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // —— Jeans ——
  inkShape(() => {
    ctx.beginPath()
    ctx.moveTo(cx - 90, 780)
    ctx.lineTo(cx - 100, 1100)
    ctx.lineTo(cx - 30, 1100)
    ctx.lineTo(cx - 20, 780)
    ctx.closePath()
  })
  inkShape(() => {
    ctx.beginPath()
    ctx.moveTo(cx + 20, 780)
    ctx.lineTo(cx + 30, 1100)
    ctx.lineTo(cx + 100, 1100)
    ctx.lineTo(cx + 90, 780)
    ctx.closePath()
  })

  // Seam lines
  ctx.beginPath()
  ctx.moveTo(cx - 60, 790)
  ctx.lineTo(cx - 65, 1090)
  ctx.moveTo(cx + 60, 790)
  ctx.lineTo(cx + 65, 1090)
  ctx.stroke()

  // Shoes
  inkShape(() => {
    ctx.beginPath()
    ctx.ellipse(cx - 70, 1125, 48, 22, 0, 0, Math.PI * 2)
  })
  inkShape(() => {
    ctx.beginPath()
    ctx.ellipse(cx + 70, 1125, 48, 22, 0, 0, Math.PI * 2)
  })

  // Cross-hatch shading on kurta
  ctx.globalAlpha = 0.18
  ctx.lineWidth = 1.8
  for (let i = 0; i < 18; i++) {
    ctx.beginPath()
    ctx.moveTo(cx - 110 + i * 8, 500)
    ctx.lineTo(cx - 90 + i * 8, 770)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function buildCharacterTexture(
  theme: Theme,
  ink: string,
  fill: string,
  faceImg: HTMLImageElement | null,
): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 1536
  const ctx = c.getContext('2d')!
  drawCharacter(ctx, 1024, 1536, ink, fill, faceImg)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.needsUpdate = true
  return t
}

/** Detailed sketched character — hijab + glasses + kurta, optional avatar face. */
export function Character() {
  const ref = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const { theme, colors } = useTheme()
  const [faceImg, setFaceImg] = useState<HTMLImageElement | null>(null)
  const [texVersion, setTexVersion] = useState(0)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setFaceImg(img)
      setTexVersion((v) => v + 1)
    }
    img.src = `${import.meta.env.BASE_URL}avatar.jpg`
  }, [])

  const tex = useMemo(() => {
    // Bust cache when face loads so we regenerate with likeness
    const key = `character-hi-v2@${theme}@face${faceImg ? 1 : 0}@${texVersion}`
    return cached(key, () => buildCharacterTexture(theme, colors.ink, colors.characterFill, faceImg))
  }, [theme, colors.ink, colors.characterFill, faceImg, texVersion])

  useFrame(({ clock }) => {
    if (!ref.current || !groupRef.current) return
    const t = clock.elapsedTime

    // Idle bob + gentle wave
    const bob = Math.sin(t * 1.4) * 0.025
    const wave = Math.sin(t * 2.2) * 0.015
    groupRef.current.position.y = 1.15 + bob
    groupRef.current.rotation.z = wave * 0.4

    const dist = Math.abs(camera.position.z - groupRef.current.position.z)
    const fade = THREE.MathUtils.clamp((dist - 1.6) / 3.4, 0, 1)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = fade
    const s = 0.68 + fade * 0.32
    ref.current.scale.setScalar(s)
    // Slide aside when camera is too close (LOD / anti-clip)
    groupRef.current.position.x = (1 - fade) * 0.55
  })

  return (
    <group ref={groupRef} position={[0, 1.15, -7.2]}>
      <mesh ref={ref}>
        <planeGeometry args={[1.75, 2.65]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}
