import { useMemo, useState } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { galleryProjects, type GalleryProject } from '../data/content'
import { projectFrameTexture, woodSignTexture, doorTexture, cached } from '../utils/textures'
import { PaintRevealMaterial } from '../shaders/PaintRevealMaterial'
import { useTheme } from '../theme/ThemeContext'

const START_Z = -16
const SPACING = 2.35
const WALL_X = 2.55

export function Gallery({ progress }: { progress: number }) {
  // Map progress → approx camera z for proximity cards
  const camZ = THREE.MathUtils.lerp(10, -95, progress)

  return (
    <group>
      {galleryProjects.map((project, i) => {
        const side = i % 2 === 0 ? -1 : 1
        const z = START_Z - i * SPACING
        const near = Math.abs(camZ - z) < 4.2
        return (
          <ProjectDoor
            key={project.id}
            project={project}
            position={[side * WALL_X, 1.55, z]}
            side={side}
            near={near}
          />
        )
      })}
    </group>
  )
}

function ProjectDoor({
  project,
  position,
  side,
  near,
}: {
  project: GalleryProject
  position: [number, number, number]
  side: number
  near: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const { theme, colors } = useTheme()
  const showCard = near || hovered

  const sketch = useMemo(
    () =>
      cached(`proj-s-hi-${project.id}@${theme}`, () =>
        projectFrameTexture(
          project.title,
          project.language || 'Project',
          project.color,
          false,
          768,
          576,
          theme,
        ),
      ),
    [project, theme],
  )
  const color = useMemo(
    () =>
      cached(`proj-c-hi-${project.id}@${theme}`, () =>
        projectFrameTexture(
          project.title,
          project.language || 'Project',
          project.color,
          true,
          768,
          576,
          theme,
        ),
      ),
    [project, theme],
  )
  const plaque = useMemo(
    () =>
      cached(`proj-plaque-${project.id}@${theme}`, () =>
        woodSignTexture(project.title.slice(0, 22).toUpperCase(), 900, 220, theme),
      ),
    [project, theme],
  )
  const doorFace = useMemo(
    () => cached(`gallery-door-face@${theme}`, () => doorTexture(384, 640, false, theme)),
    [theme],
  )

  const tags = project.tech.slice(0, 4).join(' · ') || project.language || 'GitHub'

  return (
    <group position={position} rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
      {/* Door frame depth */}
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[2.55, 2.95, 0.16]} />
        <meshBasicMaterial color={colors.doorFrame} />
      </mesh>
      <lineSegments position={[0, 0, -0.08]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.55, 2.95, 0.16)]} />
        <lineBasicMaterial color={colors.ink} />
      </lineSegments>

      {/* Door panel backing */}
      <mesh position={[0, -0.15, -0.01]}>
        <planeGeometry args={[2.15, 2.45]} />
        <meshBasicMaterial map={doorFace} />
      </mesh>

      {/* Project artwork */}
      <mesh position={[0, 0.15, 0.02]}>
        <planeGeometry args={[2.05, 1.55]} />
        <PaintRevealMaterial sketchMap={sketch} colorMap={color} hovered={hovered || near} />
      </mesh>

      {/* Large label plaque */}
      <mesh position={[0, 1.55, 0.06]}>
        <boxGeometry args={[2.35, 0.58, 0.06]} />
        <meshBasicMaterial color={colors.signBoard} />
      </mesh>
      <mesh position={[0, 1.55, 0.1]}>
        <planeGeometry args={[2.28, 0.52]} />
        <meshBasicMaterial map={plaque} transparent />
      </mesh>

      {/* Info strip on door (canvas text via plaque under title) */}
      <InfoStrip project={project} near={near} />

      {/* Always-present Html hotspot for clicks (canvas is pointer-events:none) */}
      <Html position={[0, 0, 0.15]} center occlude={false} wrapperClass="html-interactive" style={{ pointerEvents: 'auto' }}>
        <button
          type="button"
          className="door-hotspot"
          aria-label={`Open ${project.title} on GitHub`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
        />
      </Html>

      {showCard && (
        <Html
          position={[0, 0.2, 0.35]}
          center
          occlude={false}
          distanceFactor={6}
          wrapperClass="html-interactive" style={{ pointerEvents: 'auto', width: '280px' }}
        >
          <div className="project-tooltip door-card">
            <strong>{project.title}</strong>
            <p>{project.description}</p>
            {tags && <div className="door-tags">{tags}</div>}
            <a
              className="door-github-btn"
              href={project.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Open on GitHub ↗
            </a>
          </div>
        </Html>
      )}
    </group>
  )
}

function InfoStrip({ project, near }: { project: GalleryProject; near: boolean }) {
  const { theme, colors } = useTheme()
  const tex = useMemo(() => {
    return cached(`info-strip-${project.id}@${theme}`, () => {
      const c = document.createElement('canvas')
      c.width = 768
      c.height = 160
      const ctx = c.getContext('2d')!
      ctx.fillStyle = theme === 'dark' ? '#1a1f28' : '#fffef8'
      ctx.fillRect(0, 0, 768, 160)
      ctx.strokeStyle = colors.ink
      ctx.lineWidth = 4
      ctx.strokeRect(4, 4, 760, 152)
      ctx.fillStyle = colors.ink
      ctx.font = 'bold 48px "Space Grotesk", sans-serif'
      ctx.textAlign = 'center'
      const title = project.title.length > 24 ? project.title.slice(0, 22) + '…' : project.title
      ctx.fillText(title, 384, 70)
      ctx.font = '28px "Space Grotesk", sans-serif'
      ctx.fillStyle = colors.muted
      const desc = (project.description || '').slice(0, 52)
      ctx.fillText(desc + (project.description.length > 52 ? '…' : ''), 384, 118)
      const t = new THREE.CanvasTexture(c)
      t.colorSpace = THREE.SRGBColorSpace
      return t
    })
  }, [project, theme, colors.ink, colors.muted])

  return (
    <mesh position={[0, -1.05, 0.05]} scale={near ? 1.05 : 1}>
      <planeGeometry args={[2.1, 0.48]} />
      <meshBasicMaterial map={tex} transparent />
    </mesh>
  )
}

export function galleryEndZ() {
  return START_Z - galleryProjects.length * SPACING
}

// silence unused import warning if tree-shaken
