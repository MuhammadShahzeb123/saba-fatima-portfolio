import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  plankTexture,
  paperWallTexture,
  wordmarkTexture,
  woodSignTexture,
  posterTexture,
  cached,
} from '../utils/textures'
import { NAME, TAGLINE } from '../data/content'
import { getIsMobile } from '../hooks/useIsMobile'
import { useTheme } from '../theme/ThemeContext'

const LENGTH = 110
const WIDTH = 5.5
const HEIGHT = 4

const POSTERS: Array<{
  title: string
  doodle: 'star' | 'code' | 'bot' | 'heart' | 'grid'
  side: -1 | 1
  z: number
  y: number
}> = [
  { title: 'AI notes', doodle: 'bot', side: -1, z: -4, y: 2.45 },
  { title: 'CV lab', doodle: 'grid', side: 1, z: -5.5, y: 2.05 },
  { title: '</>', doodle: 'code', side: -1, z: -7, y: 2.65 },
  { title: 'ship it', doodle: 'star', side: 1, z: -9, y: 2.25 },
  { title: 'Flutter', doodle: 'heart', side: -1, z: -11.5, y: 2.15 },
  { title: 'Python', doodle: 'code', side: 1, z: -14, y: 2.55 },
  { title: 'ML', doodle: 'bot', side: -1, z: -22, y: 2.5 },
  { title: 'build', doodle: 'star', side: 1, z: -24, y: 2.1 },
  { title: 'OpenCV', doodle: 'grid', side: -1, z: -27, y: 2.6 },
  { title: 'Dart', doodle: 'code', side: 1, z: -30, y: 2.2 },
  { title: 'learn', doodle: 'grid', side: -1, z: -36, y: 2.4 },
  { title: 'create', doodle: 'heart', side: 1, z: -39, y: 2.3 },
  { title: 'TF', doodle: 'bot', side: -1, z: -44, y: 2.55 },
  { title: 'deploy', doodle: 'code', side: 1, z: -48, y: 2.15 },
  { title: 'notes', doodle: 'star', side: -1, z: -52, y: 2.35 },
  { title: 'hello', doodle: 'heart', side: 1, z: -62, y: 2.25 },
  { title: 'ship', doodle: 'star', side: -1, z: -72, y: 2.5 },
  { title: 'code', doodle: 'code', side: 1, z: -82, y: 2.2 },
]

export function Corridor() {
  const mobile = useMemo(() => getIsMobile(), [])
  const { theme, colors } = useTheme()
  const plank = useMemo(() => cached(`plank@${theme}`, () => plankTexture(640, 1280, theme)), [theme])
  const wall = useMemo(() => cached(`wall@${theme}`, () => paperWallTexture(768, 768, theme)), [theme])
  const wordmark = useMemo(
    () => cached(`wordmark@${theme}`, () => wordmarkTexture(NAME.toUpperCase().split(' ')[0], TAGLINE, 1280, 640, theme)),
    [theme],
  )

  const posters = mobile ? POSTERS.filter((_, i) => i % 2 === 0) : POSTERS

  return (
    <group>
      {/* Floor — higher contrast planks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -LENGTH / 2]}>
        <planeGeometry args={[WIDTH, LENGTH]} />
        <meshBasicMaterial map={plank} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HEIGHT, -LENGTH / 2]}>
        <planeGeometry args={[WIDTH, LENGTH]} />
        <meshBasicMaterial map={wall} />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-WIDTH / 2, HEIGHT / 2, -LENGTH / 2]}>
        <planeGeometry args={[LENGTH, HEIGHT]} />
        <meshBasicMaterial map={wall} />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[WIDTH / 2, HEIGHT / 2, -LENGTH / 2]}>
        <planeGeometry args={[LENGTH, HEIGHT]} />
        <meshBasicMaterial map={wall} />
      </mesh>

      <LodWordmark map={wordmark} />

      {/* Floating sketch props with subtle parallax */}
      <FloatProp position={[-1.6, 2.8, -6]} />
      <FloatProp position={[1.8, 3.0, -10]} kind="plane" />
      <FloatProp position={[-1.2, 2.5, -12]} kind="mug" />
      <FloatProp position={[1.4, 2.7, -20]} kind="pencil" />
      <FloatProp position={[-1.5, 2.9, -32]} kind="plane" />
      <FloatProp position={[1.6, 2.6, -48]} kind="ball" />
      {!mobile && (
        <>
          <FloatProp position={[-1.3, 3.1, -55]} kind="mug" />
          <FloatProp position={[1.5, 2.85, -70]} kind="pencil" />
        </>
      )}

      {posters.map((p) => (
        <WallPoster key={`${p.title}-${p.z}-${theme}`} {...p} />
      ))}

      <DoorLabel text="THE GALLERY" position={[-2.35, 3.35, -18]} />
      <DoorLabel text="ABOUT" position={[2.35, 3.35, -58]} />
      <DoorLabel text="EXPERIENCE" position={[-2.35, 3.35, -68]} />
      <DoorLabel text="SKILLS" position={[2.35, 3.35, -78]} />
      <DoorLabel text="CONTACT" position={[0, 3.35, -88]} />
    </group>
  )
}

function LodWordmark({ map }: { map: THREE.Texture }) {
  const ref = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  useFrame(() => {
    if (!ref.current) return
    const z = ref.current.position.z
    const dist = Math.abs(camera.position.z - z)
    const fade = THREE.MathUtils.clamp((dist - 1.4) / 3.8, 0, 1)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = fade
    const s = 0.72 + fade * 0.28
    ref.current.scale.set(s, s, 1)
    // nudge up slightly when close to reduce clipping through camera
    ref.current.position.y = 2.35 + (1 - fade) * 0.35
  })

  return (
    <mesh ref={ref} position={[0, 2.35, -8.2]}>
      <planeGeometry args={[5.4, 2.6]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} />
    </mesh>
  )
}

function WallPoster({
  title,
  doodle,
  side,
  z,
  y,
}: {
  title: string
  doodle: 'star' | 'code' | 'bot' | 'heart' | 'grid'
  side: -1 | 1
  z: number
  y: number
}) {
  const { theme, colors } = useTheme()
  const tex = useMemo(
    () => cached(`poster-${title}-${z}@${theme}`, () => posterTexture(title, doodle, 448, 576, theme)),
    [title, doodle, z, theme],
  )
  const x = side * (WIDTH / 2 - 0.04)
  const rotY = side > 0 ? -Math.PI / 2 : Math.PI / 2
  return (
    <group position={[x, y, z]} rotation={[0, rotY, 0]}>
      {/* slight depth backing */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[0.92, 1.22, 0.04]} />
        <meshBasicMaterial color={colors.posterBack} />
      </mesh>
      <mesh>
        <planeGeometry args={[0.88, 1.18]} />
        <meshBasicMaterial map={tex} />
      </mesh>
    </group>
  )
}

function DoorLabel({ text, position }: { text: string; position: [number, number, number] }) {
  const { theme } = useTheme()
  const tex = useMemo(() => cached(`label-${text}@${theme}`, () => woodSignTexture(text, 768, 200, theme)), [text, theme])
  const facing = position[0] < 0 ? 1 : position[0] > 0 ? -1 : 0
  return (
    <mesh
      position={position}
      rotation={[0, facing === 0 ? 0 : facing * (Math.PI / 2) * 0.05, 0]}
    >
      <planeGeometry args={[2.5, 0.62]} />
      <meshBasicMaterial map={tex} transparent />
    </mesh>
  )
}

function FloatProp({
  position,
  kind = 'ball',
}: {
  position: [number, number, number]
  kind?: 'ball' | 'plane' | 'mug' | 'pencil'
}) {
  const ref = useRef<THREE.Group>(null)
  const base = useMemo(() => new THREE.Vector3(...position), [position])
  const { camera } = useThree()
  const { colors } = useTheme()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    // bob
    const bob = Math.sin(t * 0.9 + base.z * 0.1) * 0.06
    // subtle parallax vs camera x
    const parallax = (camera.position.x - 0) * 0.15
    ref.current.position.set(base.x + parallax, base.y + bob, base.z)
    ref.current.rotation.y = Math.sin(t * 0.4 + base.z) * 0.15
  })

  return (
    <group ref={ref} position={position}>
      {kind === 'plane' && (
        <mesh rotation={[0.4, 0.5, 0.2]}>
          <planeGeometry args={[0.45, 0.35]} />
          <meshBasicMaterial color={colors.wireframePaper} wireframe />
        </mesh>
      )}
      {kind === 'mug' && (
        <mesh>
          <cylinderGeometry args={[0.12, 0.1, 0.22, 8]} />
          <meshBasicMaterial color={colors.wireframeAlt} wireframe />
        </mesh>
      )}
      {kind === 'pencil' && (
        <mesh rotation={[0.5, 0.2, 1.2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.55, 5]} />
          <meshBasicMaterial color={colors.accent} wireframe />
        </mesh>
      )}
      {kind === 'ball' && (
        <mesh>
          <icosahedronGeometry args={[0.15, 0]} />
          <meshBasicMaterial color={colors.wireframe} wireframe />
        </mesh>
      )}
    </group>
  )
}
