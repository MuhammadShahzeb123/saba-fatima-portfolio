import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */ `
uniform sampler2D uSketch;
uniform sampler2D uColor;
uniform float uReveal;
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec4 sketch = texture2D(uSketch, vUv);
  vec4 color = texture2D(uColor, vUv);
  float n = noise(vUv * 6.0 + uTime * 0.05);
  float edge = smoothstep(uReveal - 0.25, uReveal + 0.15, n + vUv.x * 0.15);
  float reveal = 1.0 - edge;
  reveal = mix(0.0, reveal, smoothstep(0.0, 0.05, uReveal));
  if (uReveal > 0.95) reveal = 1.0;
  vec4 mixed = mix(sketch, color, reveal);
  gl_FragColor = mixed;
}
`

type Props = {
  sketchMap: THREE.Texture
  colorMap: THREE.Texture
  hovered?: boolean
  side?: THREE.Side
}

export function PaintRevealMaterial({
  sketchMap,
  colorMap,
  hovered = false,
  side = THREE.FrontSide,
}: Props) {
  const ref = useRef<THREE.ShaderMaterial>(null)
  const target = useRef(0)

  const uniforms = useMemo(
    () => ({
      uSketch: { value: sketchMap },
      uColor: { value: colorMap },
      uReveal: { value: 0 },
      uTime: { value: 0 },
    }),
    [sketchMap, colorMap],
  )

  useEffect(() => {
    target.current = hovered ? 1 : 0
  }, [hovered])

  useFrame((_, dt) => {
    const m = ref.current
    if (!m) return
    m.uniforms.uTime.value += dt
    m.uniforms.uReveal.value = THREE.MathUtils.damp(
      m.uniforms.uReveal.value,
      target.current,
      6,
      dt,
    )
  })

  return (
    <shaderMaterial
      ref={ref}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      side={side}
      transparent
    />
  )
}
