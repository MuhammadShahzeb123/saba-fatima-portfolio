import { useMemo } from 'react'
import * as THREE from 'three'
import { galleryProjects } from '../data/content'
import { plankTexture, paperWallTexture, cached } from '../utils/textures'
import { useTheme } from '../theme/ThemeContext'
import { ProjectDoor } from './ProjectDoor'
import { Character } from './Character'

const ROOM_R = 7.2
const CENTER_Z = -5

export function Room() {
  const { theme, colors } = useTheme()
  const plank = useMemo(() => {
    const t = cached(`room-plank@${theme}`, () => plankTexture(640, 1280, theme))
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(3, 3)
    return t
  }, [theme])
  const wall = useMemo(() => cached(`room-wall@${theme}`, () => paperWallTexture(768, 768, theme)), [theme])

  const doors = useMemo(() => {
    const specials: Array<{
      id: string
      label: string
      color: string
      kind: 'about' | 'contact'
      project?: undefined
    }> = [
      { id: 'about', label: 'About', color: '#0d9488', kind: 'about' },
      { id: 'contact', label: 'Contact', color: '#7c3aed', kind: 'contact' },
    ]
    const items = [
      ...galleryProjects.map((p) => ({
        id: p.id,
        label: p.title,
        color: p.color,
        kind: 'project' as const,
        project: p,
      })),
      ...specials,
    ]
    const n = items.length
    // Horseshoe: leave gap at entrance (+Z relative to room center)
    return items.map((item, i) => {
      const t = n === 1 ? 0.5 : i / (n - 1)
      const angle = Math.PI * 0.2 + t * Math.PI * 1.6 // ~36° → ~324° via back
      const x = Math.sin(angle) * ROOM_R
      const z = CENTER_Z - Math.cos(angle) * ROOM_R
      const rotationY = Math.atan2(-x, CENTER_Z - z)
      return { ...item, position: [x, 1.15, z] as [number, number, number], rotationY }
    })
  }, [])

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, CENTER_Z]}>
        <circleGeometry args={[ROOM_R + 1.5, 48]} />
        <meshBasicMaterial map={plank} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.8, CENTER_Z]}>
        <circleGeometry args={[ROOM_R + 1.5, 48]} />
        <meshBasicMaterial map={wall} />
      </mesh>
      {/* Soft ring wall backdrop */}
      <mesh position={[0, 1.9, CENTER_Z]}>
        <cylinderGeometry args={[ROOM_R + 0.4, ROOM_R + 0.4, 3.8, 48, 1, true]} />
        <meshBasicMaterial map={wall} side={THREE.BackSide} />
      </mesh>

      {doors.map((d) => (
        <ProjectDoor
          key={d.id}
          label={d.label}
          color={d.color}
          kind={d.kind}
          project={d.project}
          position={d.position}
          rotationY={d.rotationY}
        />
      ))}

      {/* Character near room center */}
      <group position={[0, 0, CENTER_Z]}>
        <Character />
      </group>

      {/* Subtle center rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, CENTER_Z]}>
        <circleGeometry args={[1.4, 24]} />
        <meshBasicMaterial color={colors.signBoard} transparent opacity={0.55} />
      </mesh>
    </group>
  )
}

export const PROJECT_DOOR_COUNT = galleryProjects.length
