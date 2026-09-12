import { useMemo, useState } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  brickTexture,
  woodSignTexture,
  foliageTexture,
  catTexture,
  planterTexture,
  cobbleTexture,
  projectDoorPaneTexture,
  cached,
} from '../utils/textures'
import { entranceDoorProjects, type GalleryProject } from '../data/content'
import { useTheme } from '../theme/ThemeContext'
import { GateDoors } from './GateDoors'
import { useGate } from '../context/GateContext'

const COLS = 4
const ROWS = 3

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
  const planter = useMemo(() => cached(`planter@${theme}`, () => planterTexture(640, 320, theme)), [theme])
  const cobble = useMemo(() => {
    const t = cached(`cobble@${theme}`, () => cobbleTexture(640, 640, theme))
    t.repeat.set(2, 4)
    return t
  }, [theme])

  const trunk = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 160
    c.height = 640
    const ctx = c.getContext('2d')!
    ctx.fillStyle = theme === 'dark' ? '#3a2e24' : '#5c4033'
    ctx.fillRect(0, 0, 160, 640)
    ctx.strokeStyle = theme === 'dark' ? '#1a1410' : '#2a1810'
    ctx.lineWidth = 2.2
    for (let i = 0; i < 22; i++) {
      const x = 12 + Math.random() * 130
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.quadraticCurveTo(x + (Math.random() - 0.5) * 24, 320, x + (Math.random() - 0.5) * 18, 640)
      ctx.stroke()
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [theme])

  const doors = entranceDoorProjects.slice(0, COLS * ROWS)

  return (
    <group position={[0, 0, 2]}>
      <mesh position={[0, 2.35, -0.08]}>
        <boxGeometry args={[14.2, 6.4, 0.18]} />
        <meshBasicMaterial map={brick} />
      </mesh>
      <mesh position={[0, 2.35, 0.02]}>
        <planeGeometry args={[14, 6.2]} />
        <meshBasicMaterial map={brick} />
      </mesh>

      <DoorFrameWall />
      <GateDoors />
      <ProjectDoorWall doors={doors} />

      <mesh position={[0, 3.85, 0.22]}>
        <boxGeometry args={[3.35, 0.95, 0.12]} />
        <meshBasicMaterial color={colors.signBoard} />
      </mesh>
      <mesh position={[0, 3.85, 0.29]}>
        <planeGeometry args={[3.25, 0.88]} />
        <meshBasicMaterial map={sign} transparent />
      </mesh>
      {([-1.3, 1.3] as const).map((x) => (
        <group key={x} position={[x, 4.4, 0.28]}>
          {[0, 0.12, 0.24].map((y) => (
            <mesh key={y} position={[0, -y, 0]}>
              <torusGeometry args={[0.045, 0.014, 6, 10]} />
              <meshBasicMaterial color={colors.ink} />
            </mesh>
          ))}
        </group>
      ))}

      <group position={[4.15, 2.45, 0.12]}>
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[2.15, 2.15, 0.14]} />
          <meshBasicMaterial color={theme === 'dark' ? '#3a2e24' : '#5c4033'} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.85, 1.85]} />
          <meshBasicMaterial color={colors.windowGlass} />
        </mesh>
        <lineSegments position={[0, 0, 0.03]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.85, 1.85)]} />
          <lineBasicMaterial color={colors.ink} />
        </lineSegments>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[0.04, 1.85]} />
          <meshBasicMaterial color={colors.ink} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[1.85, 0.04]} />
          <meshBasicMaterial color={colors.ink} />
        </mesh>
        <mesh position={[0, 0.15, 0.05]}>
          <planeGeometry args={[1.45, 1.15]} />
          <meshBasicMaterial color={colors.windowShade} transparent opacity={0.35} />
        </mesh>
      </group>

      <group position={[4.15, 0.55, 0.45]}>
        <mesh>
          <boxGeometry args={[2.5, 0.75, 0.7]} />
          <meshBasicMaterial color={colors.signBoard} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(2.5, 0.75, 0.7)]} />
          <lineBasicMaterial color={colors.ink} />
        </lineSegments>
        <mesh position={[0, 0.55, 0.36]}>
          <planeGeometry args={[2.45, 1.15]} />
          <meshBasicMaterial map={planter} transparent depthWrite={false} />
        </mesh>
      </group>

      <group position={[-4.55, 0, 0.45]}>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.16, 0.22, 2.8, 8]} />
          <meshBasicMaterial map={trunk} />
        </mesh>
        <mesh position={[-0.5, 2.5, 0]} rotation={[0, 0, 0.7]}>
          <cylinderGeometry args={[0.055, 0.09, 1.15, 5]} />
          <meshBasicMaterial color={theme === 'dark' ? '#3a2e24' : '#5c4033'} />
        </mesh>
        <mesh position={[0.55, 2.65, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.05, 0.08, 1.05, 5]} />
          <meshBasicMaterial color={theme === 'dark' ? '#3a2e24' : '#5c4033'} />
        </mesh>
        <mesh position={[0, 3.25, 0.08]}>
          <planeGeometry args={[3.4, 3.4]} />
          <meshBasicMaterial map={foliage} transparent depthWrite={false} />
        </mesh>
        <group position={[0.9, 2.4, 0.25]}>
          <mesh>
            <boxGeometry args={[0.24, 0.15, 0.3]} />
            <meshBasicMaterial color={colors.avatarBack} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.24, 0.15, 0.3)]} />
            <lineBasicMaterial color={colors.ink} />
          </lineSegments>
          <mesh position={[-0.05, 0.38, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.6, 4]} />
            <meshBasicMaterial color={colors.ink} />
          </mesh>
        </group>
      </group>

      <mesh position={[-2.2, 0.48, 0.95]}>
        <planeGeometry args={[0.95, 0.95]} />
        <meshBasicMaterial map={cat} transparent depthWrite={false} />
      </mesh>

      <mesh position={[2.15, 3.95, 0.1]}>
        <circleGeometry args={[0.09, 6]} />
        <meshBasicMaterial color={colors.ink} wireframe />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 3.3]}>
        <planeGeometry args={[3.4, 8.2]} />
        <meshBasicMaterial map={cobble} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3.3]}>
        <planeGeometry args={[3.6, 8.4]} />
        <meshBasicMaterial color={colors.cobbleEdge} />
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

function ProjectDoorWall({ doors }: { doors: GalleryProject[] }) {
  const { gateOpen } = useGate()
  const paneW = 1.05
  const paneH = 0.98
  const gapX = 0.06
  const gapY = 0.06
  const totalW = COLS * paneW + (COLS - 1) * gapX
  const totalH = ROWS * paneH + (ROWS - 1) * gapY
  const originX = -totalW / 2 + paneW / 2
  const originY = 1.55 + totalH / 2 - paneH / 2

  // Sit just behind the swinging gate so panes appear when doors open
  return (
    <group position={[0, 0, 0.12]} >
      {doors.map((project, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const x = originX + col * (paneW + gapX)
        const y = originY - row * (paneH + gapY)
        return (
          <ProjectDoorPane
            key={project.id}
            project={project}
            position={[x, y, 0]}
            size={[paneW, paneH]}
            interactive={gateOpen}
          />
        )
      })}
      <CuePlate />
      <ScrollCueLabel />
    </group>
  )
}

function CuePlate() {
  const { colors } = useTheme()
  return (
    <mesh position={[0, 0.22, 0.05]}>
      <planeGeometry args={[3.6, 0.32]} />
      <meshBasicMaterial color={colors.cuePlate} />
    </mesh>
  )
}

function ScrollCueLabel() {
  const { theme, colors } = useTheme()
  const { gateOpen } = useGate()
  const tex = useMemo(
    () =>
      cached(`scroll-cue-v2@${theme}`, () => {
        const c = document.createElement('canvas')
        c.width = 768
        c.height = 96
        const ctx = c.getContext('2d')!
        ctx.fillStyle = colors.scrollCueBg
        ctx.fillRect(0, 0, 768, 96)
        ctx.strokeStyle = colors.scrollCueInk
        ctx.lineWidth = 3
        ctx.strokeRect(4, 4, 760, 88)
        ctx.fillStyle = colors.scrollCueInk
        ctx.font = 'bold 36px "Space Grotesk", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Open gate · Scroll to enter  ↓', 384, 50)
        const t = new THREE.CanvasTexture(c)
        t.colorSpace = THREE.SRGBColorSpace
        return t
      }),
    [theme, colors.scrollCueBg, colors.scrollCueInk],
  )
  if (gateOpen) return null
  return (
    <mesh position={[0, 0.22, 0.06]}>
      <planeGeometry args={[3.55, 0.3]} />
      <meshBasicMaterial map={tex} transparent />
    </mesh>
  )
}

function ProjectDoorPane({
  project,
  position,
  size,
  interactive,
}: {
  project: GalleryProject
  position: [number, number, number]
  size: [number, number]
  interactive: boolean
}) {
  const [hot, setHot] = useState(false)
  const { theme, colors } = useTheme()
  const tex = useMemo(
    () =>
      cached(`door-pane-hi-${project.id}@${theme}`, () =>
        projectDoorPaneTexture(project.title, project.color, 640, 800, theme),
      ),
    [project, theme],
  )

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[size[0] + 0.08, size[1] + 0.08, 0.12]} />
        <meshBasicMaterial color={hot ? colors.doorHot : colors.doorIdle} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[size[0], size[1]]} />
        <meshBasicMaterial map={tex} color={hot ? colors.doorTintHot : colors.doorTintIdle} />
      </mesh>
      {/* Html hotspot — pointer events auto so taps work with canvas none */}
      {interactive && (
        <Html position={[0, 0, 0.08]} center occlude={false} wrapperClass="html-interactive" style={{ pointerEvents: 'auto' }}>
          <button
            type="button"
            className={`pane-hotspot ${hot ? 'hot' : ''}`}
            title={project.title}
            onMouseEnter={() => setHot(true)}
            onMouseLeave={() => setHot(false)}
            onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
          >
            <span className="pane-hotspot-label">{project.title}</span>
            <span className="pane-hotspot-cta">GitHub ↗</span>
          </button>
        </Html>
      )}
      {hot && interactive && (
        <Html position={[0, size[1] * 0.55, 0.1]} center occlude={false} style={{ pointerEvents: 'none' }}>
          <div className="project-tooltip pane-tooltip">
            <strong>{project.title}</strong>
            <p>{project.name}</p>
          </div>
        </Html>
      )}
    </group>
  )
}
