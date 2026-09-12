import { useMemo } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { woodSignTexture, doorTexture, infoCardTexture, cached } from '../utils/textures'
import { useTheme } from '../theme/ThemeContext'
import { portfolio } from '../data/content'

type DoorDef = {
  label: string
  z: number
  side: -1 | 1 | 0
  blurb: string
  tags: string
}

const DOORS: DoorDef[] = [
  {
    label: 'THE GALLERY',
    z: -15,
    side: -1,
    blurb: 'Featured open-source projects on the walls — tap a door for GitHub.',
    tags: 'Repos · Flutter · CV · Python',
  },
  {
    label: 'ABOUT',
    z: -56,
    side: 1,
    blurb: portfolio.about.headline,
    tags: 'Bio · Education',
  },
  {
    label: 'EXPERIENCE',
    z: -66,
    side: -1,
    blurb: 'Roles, internships, and shipping highlights.',
    tags: 'Work · Internships',
  },
  {
    label: 'SKILLS',
    z: -76,
    side: 1,
    blurb: 'Flutter · Computer Vision · AI/ML · Python and more.',
    tags: 'Stack · Tools',
  },
  {
    label: 'CONTACT',
    z: -86,
    side: 0,
    blurb: `${portfolio.contact.email} · Let’s connect.`,
    tags: 'Email · LinkedIn · GitHub',
  },
]

/** Decorative corridor door frames with large plaques + proximity info cards. */
export function Doorways({ progress }: { progress: number }) {
  const camZ = THREE.MathUtils.lerp(10, -95, progress)

  return (
    <group>
      {DOORS.map((d) => (
        <Door key={d.label} {...d} near={Math.abs(camZ - d.z) < 5.5} />
      ))}
    </group>
  )
}

function Door({
  label,
  z,
  side,
  blurb,
  tags,
  near,
}: DoorDef & { near: boolean }) {
  const { theme, colors } = useTheme()
  const sign = useMemo(
    () => cached(`door-sign-lg-${label}@${theme}`, () => woodSignTexture(label, 1024, 280, theme)),
    [label, theme],
  )
  const door = useMemo(
    () => cached(`inner-door-lg@${theme}`, () => doorTexture(448, 720, false, theme)),
    [theme],
  )
  const card = useMemo(
    () =>
      cached(`door-info-${label}@${theme}`, () =>
        infoCardTexture([`#${label}`, `*${tags}`, '', blurb], 640, 420, colors.accent, theme),
      ),
    [label, tags, blurb, theme, colors.accent],
  )

  if (side === 0) {
    return (
      <group position={[0, 0, z]}>
        <mesh position={[0, 3.35, 0]}>
          <boxGeometry args={[3.4, 0.85, 0.1]} />
          <meshBasicMaterial color={colors.signBoard} />
        </mesh>
        <mesh position={[0, 3.35, 0.06]}>
          <planeGeometry args={[3.3, 0.78]} />
          <meshBasicMaterial map={sign} transparent />
        </mesh>
        {near && (
          <Html position={[0, 2.2, 0.4]} center occlude={false} distanceFactor={7} style={{ pointerEvents: 'none' }}>
            <div className="project-tooltip door-card section-card">
              <strong>{label}</strong>
              <p>{blurb}</p>
              <div className="door-tags">{tags}</div>
            </div>
          </Html>
        )}
      </group>
    )
  }

  const x = side * 2.72
  const rotY = side > 0 ? -Math.PI / 2 : Math.PI / 2

  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[0, rotY, 0]} position={[side * 0.06, 1.4, 0]}>
        <boxGeometry args={[1.75, 2.95, 0.22]} />
        <meshBasicMaterial color={colors.doorFrame} />
      </mesh>
      <lineSegments rotation={[0, rotY, 0]} position={[side * 0.06, 1.4, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.75, 2.95, 0.22)]} />
        <lineBasicMaterial color={colors.ink} />
      </lineSegments>
      <mesh rotation={[0, rotY, 0]} position={[0, 1.4, 0]}>
        <planeGeometry args={[1.5, 2.7]} />
        <meshBasicMaterial map={door} />
      </mesh>

      {/* Large plaque */}
      <mesh rotation={[0, rotY, 0]} position={[0, 3.2, 0]}>
        <boxGeometry args={[2.25, 0.72, 0.1]} />
        <meshBasicMaterial color={colors.signBoard} />
      </mesh>
      <mesh rotation={[0, rotY, 0]} position={[0, 3.2, 0.06]}>
        <planeGeometry args={[2.18, 0.66]} />
        <meshBasicMaterial map={sign} transparent />
      </mesh>

      {/* Info card on wall when near */}
      {near && (
        <mesh rotation={[0, rotY, 0]} position={[0, 1.55, 0.85]}>
          <planeGeometry args={[1.35, 0.95]} />
          <meshBasicMaterial map={card} />
        </mesh>
      )}

      <mesh rotation={[0, rotY, 0]} position={[side * 0.02, 2.45, 0.6]}>
        <planeGeometry args={[0.28, 0.1]} />
        <meshBasicMaterial color={colors.accentDoor} />
      </mesh>

      {near && (
        <Html
          position={[side * -0.2, 1.6, 0]}
          rotation={[0, rotY, 0]}
          center
          occlude={false}
          distanceFactor={6}
          style={{ pointerEvents: 'none', width: '240px' }}
        >
          <div className="project-tooltip door-card section-card">
            <strong>{label}</strong>
            <p>{blurb}</p>
            <div className="door-tags">{tags}</div>
          </div>
        </Html>
      )}
    </group>
  )
}
