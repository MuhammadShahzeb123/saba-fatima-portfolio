import { useMemo } from 'react'
import * as THREE from 'three'
import {
  brickTexture,
  doorTexture,
  woodSignTexture,
  foliageTexture,
  catTexture,
  planterTexture,
  cobbleTexture,
  cached,
} from '../utils/textures'

export function Exterior() {
  const brick = useMemo(() => cached('brick', () => brickTexture()), [])
  const doorL = useMemo(() => cached('door-l', () => doorTexture()), [])
  const doorR = useMemo(() => cached('door-r', () => doorTexture()), [])
  const sign = useMemo(() => cached('sign-portfolio', () => woodSignTexture('PORTFOLIO', 640, 180)), [])
  const foliage = useMemo(() => cached('foliage', () => foliageTexture()), [])
  const cat = useMemo(() => cached('cat', () => catTexture()), [])
  const planter = useMemo(() => cached('planter', () => planterTexture()), [])
  const cobble = useMemo(() => {
    const t = cached('cobble', () => cobbleTexture())
    t.repeat.set(2, 4)
    return t
  }, [])

  // Bark / trunk canvas
  const trunk = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 128
    c.height = 512
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#5c4033'
    ctx.fillRect(0, 0, 128, 512)
    ctx.strokeStyle = '#2a1810'
    ctx.lineWidth = 2
    for (let i = 0; i < 18; i++) {
      const x = 10 + Math.random() * 100
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.quadraticCurveTo(x + (Math.random() - 0.5) * 20, 256, x + (Math.random() - 0.5) * 16, 512)
      ctx.stroke()
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])

  return (
    <group position={[0, 0, 2]}>
      {/* Facade */}
      <mesh position={[0, 2.2, 0]}>
        <planeGeometry args={[14, 6]} />
        <meshBasicMaterial map={brick} />
      </mesh>

      {/* Double doors with tech logos */}
      <mesh position={[-0.85, 1.35, 0.05]}>
        <planeGeometry args={[1.55, 2.75]} />
        <meshBasicMaterial map={doorL} />
      </mesh>
      <mesh position={[0.85, 1.35, 0.05]}>
        <planeGeometry args={[1.55, 2.75]} />
        <meshBasicMaterial map={doorR} />
      </mesh>
      {/* Door frame outline */}
      <lineSegments position={[0, 1.35, 0.06]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(3.3, 2.85)]} />
        <lineBasicMaterial color="#1a1a1a" />
      </lineSegments>

      {/* PORTFOLIO hanging sign */}
      <mesh position={[0, 3.55, 0.1]}>
        <planeGeometry args={[3.2, 0.9]} />
        <meshBasicMaterial map={sign} transparent />
      </mesh>
      {/* Chain links */}
      {([-1.25, 1.25] as const).map((x) => (
        <group key={x} position={[x, 4.05, 0.11]}>
          {[0, 0.12, 0.24].map((y) => (
            <mesh key={y} position={[0, -y, 0]}>
              <torusGeometry args={[0.04, 0.012, 6, 10]} />
              <meshBasicMaterial color="#222" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Window */}
      <group position={[3.7, 2.35, 0.06]}>
        <mesh>
          <planeGeometry args={[1.9, 1.9]} />
          <meshBasicMaterial color="#e8f0f5" />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.9, 1.9)]} />
          <lineBasicMaterial color="#222" />
        </lineSegments>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.035, 1.9]} />
          <meshBasicMaterial color="#222" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.9, 0.035]} />
          <meshBasicMaterial color="#222" />
        </mesh>
        {/* curtains doodle */}
        <mesh position={[0, 0.2, 0.02]}>
          <planeGeometry args={[1.5, 1.2]} />
          <meshBasicMaterial color="#f5f0e8" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* Planter with plants + duck */}
      <mesh position={[3.7, 0.95, 0.25]}>
        <planeGeometry args={[2.4, 1.2]} />
        <meshBasicMaterial map={planter} transparent depthWrite={false} />
      </mesh>

      {/* Tree (left) — trunk + cloud foliage + mouse "fruit" */}
      <group position={[-4.4, 0, 0.35]}>
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.14, 0.2, 2.7, 8]} />
          <meshBasicMaterial map={trunk} />
        </mesh>
        {/* branches */}
        <mesh position={[-0.45, 2.4, 0]} rotation={[0, 0, 0.7]}>
          <cylinderGeometry args={[0.05, 0.08, 1.1, 5]} />
          <meshBasicMaterial color="#5c4033" />
        </mesh>
        <mesh position={[0.5, 2.55, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.045, 0.07, 1.0, 5]} />
          <meshBasicMaterial color="#5c4033" />
        </mesh>
        <mesh position={[0, 3.1, 0.05]}>
          <planeGeometry args={[3.2, 3.2]} />
          <meshBasicMaterial map={foliage} transparent depthWrite={false} />
        </mesh>
        {/* computer mouse hanging like fruit */}
        <group position={[0.85, 2.35, 0.2]}>
          <mesh>
            <boxGeometry args={[0.22, 0.14, 0.28]} />
            <meshBasicMaterial color="#f0ebe3" />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.22, 0.14, 0.28)]} />
            <lineBasicMaterial color="#222" />
          </lineSegments>
          {/* cord */}
          <mesh position={[-0.05, 0.35, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.55, 4]} />
            <meshBasicMaterial color="#222" />
          </mesh>
        </group>
      </group>

      {/* Cat */}
      <mesh position={[-2.15, 0.45, 0.9]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial map={cat} transparent depthWrite={false} />
      </mesh>

      {/* Small bug doodle on wall */}
      <mesh position={[2.0, 3.8, 0.07]}>
        <circleGeometry args={[0.08, 6]} />
        <meshBasicMaterial color="#222" wireframe />
      </mesh>

      {/* Cobble path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3.2]}>
        <planeGeometry args={[3.2, 8]} />
        <meshBasicMaterial map={cobble} />
      </mesh>
    </group>
  )
}
