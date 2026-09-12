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
  { title: 'AI notes', doodle: 'bot', side: -1, z: -5, y: 2.4 },
  { title: 'CV lab', doodle: 'grid', side: 1, z: -7, y: 2.1 },
  { title: '</>', doodle: 'code', side: -1, z: -11, y: 2.6 },
  { title: 'ship it', doodle: 'star', side: 1, z: -13, y: 2.3 },
  { title: 'Flutter', doodle: 'heart', side: -1, z: -22, y: 2.5 },
  { title: 'Python', doodle: 'code', side: 1, z: -28, y: 2.2 },
  { title: 'ML', doodle: 'bot', side: -1, z: -36, y: 2.55 },
  { title: 'build', doodle: 'star', side: 1, z: -42, y: 2.15 },
  { title: 'learn', doodle: 'grid', side: -1, z: -50, y: 2.4 },
  { title: 'create', doodle: 'heart', side: 1, z: -62, y: 2.3 },
  { title: 'deploy', doodle: 'code', side: -1, z: -72, y: 2.5 },
  { title: 'hello', doodle: 'star', side: 1, z: -82, y: 2.2 },
]

export function Corridor() {
  const plank = useMemo(() => cached('plank', () => plankTexture()), [])
  const wall = useMemo(() => cached('wall', () => paperWallTexture()), [])
  const wordmark = useMemo(
    () => cached('wordmark', () => wordmarkTexture(NAME.toUpperCase().split(' ')[0], TAGLINE)),
    [],
  )

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

      {/* Hub wordmark — LOD fade when camera approaches */}
      <LodWordmark map={wordmark} />

      {/* Floating sketch props */}
      <FloatProp position={[-1.6, 2.8, -6]} />
      <FloatProp position={[1.8, 3.0, -10]} kind="plane" />
      <FloatProp position={[-1.2, 2.5, -12]} kind="mug" />
      <FloatProp position={[1.4, 2.7, -20]} kind="pencil" />
      <FloatProp position={[-1.5, 2.9, -32]} kind="plane" />
      <FloatProp position={[1.6, 2.6, -48]} kind="ball" />

      {/* Wall posters / doodles for density */}
      {POSTERS.map((p) => (
        <WallPoster key={`${p.title}-${p.z}`} {...p} />
      ))}

      {/* Door labels — larger for readability */}
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
    // Fade & shrink when camera gets close to avoid clipping through wordmark
    const fade = THREE.MathUtils.clamp((dist - 1.2) / 3.5, 0, 1)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = fade
    const s = 0.75 + fade * 0.25
    ref.current.scale.set(s, s, 1)
  })

  return (
    <mesh ref={ref} position={[0, 2.35, -8.2]}>
      <planeGeometry args={[5.2, 2.5]} />
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
  const tex = useMemo(
    () => cached(`poster-${title}-${z}`, () => posterTexture(title, doodle)),
    [title, doodle, z],
  )
  const x = side * (WIDTH / 2 - 0.04)
  const rotY = side > 0 ? -Math.PI / 2 : Math.PI / 2
  return (
    <mesh position={[x, y, z]} rotation={[0, rotY, 0]}>
      <planeGeometry args={[0.85, 1.15]} />
      <meshBasicMaterial map={tex} />
    </mesh>
  )
}

function DoorLabel({ text, position }: { text: string; position: [number, number, number] }) {
  const tex = useMemo(() => cached(`label-${text}`, () => woodSignTexture(text, 640, 160)), [text])
  const facing = position[0] < 0 ? 1 : position[0] > 0 ? -1 : 0
  return (
    <mesh
      position={position}
      rotation={[0, facing === 0 ? 0 : facing * (Math.PI / 2) * 0.05, 0]}
    >
      <planeGeometry args={[2.4, 0.6]} />
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
  if (kind === 'plane') {
    return (
      <mesh position={position} rotation={[0.4, 0.5, 0.2]}>
        <planeGeometry args={[0.45, 0.35]} />
        <meshBasicMaterial color="#f5f0e6" wireframe />
      </mesh>
    )
  }
  if (kind === 'mug') {
    return (
      <group position={position}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.1, 0.22, 8]} />
          <meshBasicMaterial color="#eee" wireframe />
        </mesh>
      </group>
    )
  }
  if (kind === 'pencil') {
    return (
      <mesh position={position} rotation={[0.5, 0.2, 1.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.55, 5]} />
        <meshBasicMaterial color="#f5d76e" wireframe />
      </mesh>
    )
  }
  return (
    <mesh position={position}>
      <icosahedronGeometry args={[0.15, 0]} />
      <meshBasicMaterial color="#ddd" wireframe />
    </mesh>
  )
}
