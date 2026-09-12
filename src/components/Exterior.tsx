import { useMemo, useState } from 'react'
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

const COLS = 4
const ROWS = 3

export function Exterior() {
  const brick = useMemo(() => {
    const t = cached('brick-hi', () => brickTexture())
    t.repeat.set(1.4, 1.1)
    return t
  }, [])
  const sign = useMemo(
    () => cached('sign-portfolio', () => woodSignTexture('PORTFOLIO', 768, 220)),
    [],
  )
  const foliage = useMemo(() => cached('foliage', () => foliageTexture(640, 640)), [])
  const cat = useMemo(() => cached('cat', () => catTexture(320, 320)), [])
  const planter = useMemo(() => cached('planter', () => planterTexture(640, 320)), [])
  const cobble = useMemo(() => {
    const t = cached('cobble', () => cobbleTexture(640, 640))
    t.repeat.set(2, 4)
    return t
  }, [])

  const trunk = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 160
    c.height = 640
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#5c4033'
    ctx.fillRect(0, 0, 160, 640)
    ctx.strokeStyle = '#2a1810'
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
  }, [])

  const doors = entranceDoorProjects.slice(0, COLS * ROWS)

  return (
    <group position={[0, 0, 2]}>
      {/* Facade brick — slight depth slab */}
      <mesh position={[0, 2.35, -0.08]}>
        <boxGeometry args={[14.2, 6.4, 0.18]} />
        <meshBasicMaterial map={brick} />
      </mesh>
      <mesh position={[0, 2.35, 0.02]}>
        <planeGeometry args={[14, 6.2]} />
        <meshBasicMaterial map={brick} />
      </mesh>

      {/* Deep entrance opening + frame */}
      <DoorFrameWall />

      {/* Wall of project doors / logo-panes */}
      <ProjectDoorWall doors={doors} />

      {/* PORTFOLIO hanging sign */}
      <mesh position={[0, 3.85, 0.22]}>
        <boxGeometry args={[3.35, 0.95, 0.12]} />
        <meshBasicMaterial color="#b8895a" />
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
              <meshBasicMaterial color="#222" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Window with depth */}
      <group position={[4.15, 2.45, 0.12]}>
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[2.15, 2.15, 0.14]} />
          <meshBasicMaterial color="#5c4033" />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.85, 1.85]} />
          <meshBasicMaterial color="#e8f0f5" />
        </mesh>
        <lineSegments position={[0, 0, 0.03]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.85, 1.85)]} />
          <lineBasicMaterial color="#222" />
        </lineSegments>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[0.04, 1.85]} />
          <meshBasicMaterial color="#222" />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[1.85, 0.04]} />
          <meshBasicMaterial color="#222" />
        </mesh>
        <mesh position={[0, 0.15, 0.05]}>
          <planeGeometry args={[1.45, 1.15]} />
          <meshBasicMaterial color="#f5f0e8" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* Planter — boxed depth + texture face */}
      <group position={[4.15, 0.55, 0.45]}>
        <mesh>
          <boxGeometry args={[2.5, 0.75, 0.7]} />
          <meshBasicMaterial color="#a67c4a" />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(2.5, 0.75, 0.7)]} />
          <lineBasicMaterial color="#1a1a1a" />
        </lineSegments>
        <mesh position={[0, 0.55, 0.36]}>
          <planeGeometry args={[2.45, 1.15]} />
          <meshBasicMaterial map={planter} transparent depthWrite={false} />
        </mesh>
      </group>

      {/* Tree */}
      <group position={[-4.55, 0, 0.45]}>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.16, 0.22, 2.8, 8]} />
          <meshBasicMaterial map={trunk} />
        </mesh>
        <mesh position={[-0.5, 2.5, 0]} rotation={[0, 0, 0.7]}>
          <cylinderGeometry args={[0.055, 0.09, 1.15, 5]} />
          <meshBasicMaterial color="#5c4033" />
        </mesh>
        <mesh position={[0.55, 2.65, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.05, 0.08, 1.05, 5]} />
          <meshBasicMaterial color="#5c4033" />
        </mesh>
        <mesh position={[0, 3.25, 0.08]}>
          <planeGeometry args={[3.4, 3.4]} />
          <meshBasicMaterial map={foliage} transparent depthWrite={false} />
        </mesh>
        {/* computer mouse fruit */}
        <group position={[0.9, 2.4, 0.25]}>
          <mesh>
            <boxGeometry args={[0.24, 0.15, 0.3]} />
            <meshBasicMaterial color="#f0ebe3" />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.24, 0.15, 0.3)]} />
            <lineBasicMaterial color="#222" />
          </lineSegments>
          <mesh position={[-0.05, 0.38, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.6, 4]} />
            <meshBasicMaterial color="#222" />
          </mesh>
        </group>
      </group>

      {/* Cat */}
      <mesh position={[-2.2, 0.48, 0.95]}>
        <planeGeometry args={[0.95, 0.95]} />
        <meshBasicMaterial map={cat} transparent depthWrite={false} />
      </mesh>

      {/* Bug doodle */}
      <mesh position={[2.15, 3.95, 0.1]}>
        <circleGeometry args={[0.09, 6]} />
        <meshBasicMaterial color="#222" wireframe />
      </mesh>

      {/* Cobble path with slight thickness cue */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 3.3]}>
        <planeGeometry args={[3.4, 8.2]} />
        <meshBasicMaterial map={cobble} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3.3]}>
        <planeGeometry args={[3.6, 8.4]} />
        <meshBasicMaterial color="#cfc6b6" />
      </mesh>
    </group>
  )
}

function DoorFrameWall() {
  const W = 4.55
  const H = 3.15
  const T = 0.22
  return (
    <group position={[0, 1.55, 0.08]}>
      {/* Outer deep frame */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[W + 0.35, H + 0.35, T]} />
        <meshBasicMaterial color="#3d2e22" />
      </mesh>
      <lineSegments position={[0, 0, 0.06]}>
        <edgesGeometry args={[new THREE.BoxGeometry(W + 0.35, H + 0.35, T)]} />
        <lineBasicMaterial color="#111" />
      </lineSegments>
      {/* Inner reveal */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[W + 0.08, H + 0.08, 0.1]} />
        <meshBasicMaterial color="#5c4330" />
      </mesh>
      {/* Lintel */}
      <mesh position={[0, H / 2 + 0.12, 0.12]}>
        <boxGeometry args={[W + 0.5, 0.18, 0.28]} />
        <meshBasicMaterial color="#4a3424" />
      </mesh>
    </group>
  )
}

function ProjectDoorWall({ doors }: { doors: GalleryProject[] }) {
  const paneW = 1.0
  const paneH = 0.92
  const gapX = 0.08
  const gapY = 0.08
  const totalW = COLS * paneW + (COLS - 1) * gapX
  const totalH = ROWS * paneH + (ROWS - 1) * gapY
  const originX = -totalW / 2 + paneW / 2
  const originY = 1.55 + totalH / 2 - paneH / 2

  return (
    <group position={[0, 0, 0.2]}>
      {doors.map((project, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const x = originX + col * (paneW + gapX)
        const y = originY - row * (paneH + gapY)
        return <ProjectDoorPane key={project.id} project={project} position={[x, y, 0]} size={[paneW, paneH]} />
      })}
      {/* Scroll cue plaque under doors */}
      <mesh position={[0, 0.28, 0.05]}>
        <planeGeometry args={[3.6, 0.32]} />
        <meshBasicMaterial color="#fffef8" />
      </mesh>
      <ScrollCueLabel />
    </group>
  )
}

function ScrollCueLabel() {
  const tex = useMemo(
    () =>
      cached('scroll-cue', () => {
        const c = document.createElement('canvas')
        c.width = 768
        c.height = 96
        const ctx = c.getContext('2d')!
        ctx.fillStyle = '#fffef8'
        ctx.fillRect(0, 0, 768, 96)
        ctx.strokeStyle = '#1a1a1a'
        ctx.lineWidth = 3
        ctx.strokeRect(4, 4, 760, 88)
        ctx.fillStyle = '#1a1a1a'
        ctx.font = 'bold 36px "Space Grotesk", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Scroll to enter corridor  ↓', 384, 50)
        const t = new THREE.CanvasTexture(c)
        t.colorSpace = THREE.SRGBColorSpace
        return t
      }),
    [],
  )
  return (
    <mesh position={[0, 0.28, 0.06]}>
      <planeGeometry args={[3.55, 0.3]} />
      <meshBasicMaterial map={tex} transparent />
    </mesh>
  )
}

function ProjectDoorPane({
  project,
  position,
  size,
}: {
  project: GalleryProject
  position: [number, number, number]
  size: [number, number]
}) {
  const [hot, setHot] = useState(false)
  const tex = useMemo(
    () =>
      cached(`door-pane-${project.id}`, () =>
        projectDoorPaneTexture(project.title, project.color, 512, 640),
      ),
    [project],
  )

  const open = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    window.open(project.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <group position={position}>
      {/* Depth box frame */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[size[0] + 0.06, size[1] + 0.06, 0.1]} />
        <meshBasicMaterial color={hot ? '#2a2a2a' : '#3a2f26'} />
      </mesh>
      {/* Large tap target */}
      <mesh
        position={[0, 0, 0.02]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHot(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHot(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={open}
        onPointerDown={(e) => {
          // Mobile: treat short taps as click even if scroll bridge runs
          e.stopPropagation()
        }}
        onPointerUp={(e) => {
          e.stopPropagation()
          // R3F mobile sometimes misses onClick; open on pointer up if little move
          if ('detail' in e && (e as unknown as { detail?: number }).detail === 0) {
            /* noop */
          }
        }}
      >
        <planeGeometry args={[size[0], size[1]]} />
        <meshBasicMaterial map={tex} color={hot ? '#ffffff' : '#f2f2f2'} />
      </mesh>
      {/* Invisible larger hit area for fat-finger taps (~44px equivalent in world) */}
      <mesh
        position={[0, 0, 0.03]}
        visible={false}
        onClick={open}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHot(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHot(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <planeGeometry args={[size[0] + 0.12, size[1] + 0.12]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}
