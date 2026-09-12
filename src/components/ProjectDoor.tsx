import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { cached } from '../utils/textures'
import { useTheme } from '../theme/ThemeContext'
import type { Theme } from '../theme/ThemeContext'
import type { GalleryProject } from '../data/content'
import { usePanel } from '../context/PanelContext'
import { useGate } from '../context/GateContext'

const DOOR_W = 1.35
const DOOR_H = 2.2

function labelTexture(
  title: string,
  accent: string,
  theme: Theme,
  ink: string,
  plaque: string,
): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 768
  const ctx = c.getContext('2d')!
  ctx.fillStyle = plaque
  ctx.fillRect(0, 0, 512, 768)
  ctx.fillStyle = accent
  ctx.fillRect(24, 28, 464, 90)
  ctx.strokeStyle = ink
  ctx.lineWidth = 8
  ctx.strokeRect(12, 12, 488, 744)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 36px "Space Grotesk", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const short = title.length > 20 ? title.slice(0, 18) + '…' : title
  ctx.fillText(short, 256, 74)
  ctx.fillStyle = ink
  ctx.font = 'bold 42px "Space Grotesk", system-ui, sans-serif'
  wrapText(ctx, title, 256, 360, 420, 50)
  ctx.font = '28px "Space Grotesk", system-ui, sans-serif'
  ctx.fillStyle = theme === 'dark' ? '#9a958c' : '#5c5346'
  ctx.fillText('Tap for details', 256, 680)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  const startY = y - ((lines.length - 1) * lineHeight) / 2
  lines.slice(0, 4).forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight))
}

type Props = {
  project?: GalleryProject
  label: string
  color?: string
  position: [number, number, number]
  rotationY: number
  kind: 'project' | 'about' | 'contact'
}

export function ProjectDoor({ project, label, color, position, rotationY, kind }: Props) {
  const [hot, setHot] = useState(false)
  const { theme, colors } = useTheme()
  const { entered } = useGate()
  const { openProject, openAbout, openContact } = usePanel()

  const face = useMemo(
    () =>
      cached(`door-label-${kind}-${label}@${theme}`, () =>
        labelTexture(label, color || colors.accent, theme, colors.ink, colors.plaque),
      ),
    [label, color, kind, theme, colors.accent, colors.ink, colors.plaque],
  )

  const onClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (!entered) return
    if (kind === 'project' && project) openProject(project)
    else if (kind === 'about') openAbout()
    else openContact()
  }

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[DOOR_W + 0.12, DOOR_H + 0.12, 0.14]} />
        <meshBasicMaterial color={hot ? colors.doorHot : colors.doorFrame} />
      </mesh>
      <mesh
        position={[0, 0, 0]}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          if (entered) {
            setHot(true)
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerOut={() => {
          setHot(false)
          document.body.style.cursor = 'default'
        }}
      >
        <planeGeometry args={[DOOR_W, DOOR_H]} />
        <meshBasicMaterial map={face} color={hot ? '#ffffff' : '#f5f5f5'} />
      </mesh>
    </group>
  )
}
