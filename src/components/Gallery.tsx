import { useMemo, useState } from 'react'
import { Html } from '@react-three/drei'
import { galleryProjects, type GalleryProject } from '../data/content'
import { projectFrameTexture, cached } from '../utils/textures'
import { PaintRevealMaterial } from '../shaders/PaintRevealMaterial'
import { useTheme } from '../theme/ThemeContext'

const START_Z = -16
const SPACING = 1.85
const WALL_X = 2.55

export function Gallery() {
  return (
    <group>
      {galleryProjects.map((project, i) => {
        const side = i % 2 === 0 ? -1 : 1
        const z = START_Z - i * SPACING
        return (
          <ProjectFrame
            key={project.id}
            project={project}
            position={[side * WALL_X, 1.55, z]}
            side={side}
          />
        )
      })}
    </group>
  )
}

function ProjectFrame({
  project,
  position,
  side,
}: {
  project: GalleryProject
  position: [number, number, number]
  side: number
}) {
  const [hovered, setHovered] = useState(false)
  const { theme, colors } = useTheme()
  const sketch = useMemo(
    () =>
      cached(`proj-s-${project.id}@${theme}`, () =>
        projectFrameTexture(project.title, project.language || 'Project', project.color, false, 640, 480, theme),
      ),
    [project, theme],
  )
  const color = useMemo(
    () =>
      cached(`proj-c-${project.id}@${theme}`, () =>
        projectFrameTexture(project.title, project.language || 'Project', project.color, true, 640, 480, theme),
      ),
    [project, theme],
  )

  return (
    <group position={position} rotation={[0, side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
      {/* Frame backing */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          window.open(project.url, '_blank', 'noopener,noreferrer')
        }}
      >
        <planeGeometry args={[2.35, 1.75]} />
        <PaintRevealMaterial sketchMap={sketch} colorMap={color} hovered={hovered} />
      </mesh>

      {/* Arrow cue */}
      <mesh position={[0, -1.0, 0.02]}>
        <planeGeometry args={[0.35, 0.2]} />
        <meshBasicMaterial color={colors.ink} />
      </mesh>

      {hovered && (
        <Html
          position={[0, 1.1, 0]}
          center
          distanceFactor={5}
          style={{ pointerEvents: 'none', width: '260px' }}
        >
          <div className="project-tooltip">
            <strong>{project.title}</strong>
            <p>{project.description}</p>
            <span>★ {project.stars} · Open on GitHub ↗</span>
          </div>
        </Html>
      )}
    </group>
  )
}

export function galleryEndZ() {
  return START_Z - galleryProjects.length * SPACING
}
