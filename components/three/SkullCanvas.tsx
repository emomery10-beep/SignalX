'use client'
import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  scroll: number
  mouse: { x: number; y: number }
}

function EarthNetwork({ scroll, mouse }: Props) {
  const groupRef  = useRef<THREE.Group>(null!)
  const earthRef  = useRef<THREE.Mesh>(null!)
  const pointsRef = useRef<THREE.Points>(null!)
  const linesRef  = useRef<THREE.LineSegments>(null!)

  const scrollRef = useRef(scroll)
  const mouseRef  = useRef(mouse)
  scrollRef.current = scroll
  mouseRef.current  = mouse

  const [earthTex] = useTexture(['/textures/earth-day.jpg'])

  // Network nodes sitting just above the Earth surface (radius 1.82 vs Earth 1.8)
  const { pointBuf, lineBuf } = useMemo(() => {
    const R  = 1.82
    const N  = 130
    const gr = (1 + Math.sqrt(5)) / 2

    const pts: [number, number, number][] = []
    for (let i = 0; i < N; i++) {
      const theta = Math.acos(1 - 2 * (i + 0.5) / N)
      const phi   = (2 * Math.PI * i) / gr
      pts.push([
        R * Math.sin(theta) * Math.cos(phi),
        R * Math.sin(theta) * Math.sin(phi),
        R * Math.cos(theta),
      ])
    }

    const pointBuf = new Float32Array(pts.flat())

    const THRESH_SQ = 0.70
    const lines: number[] = []
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i][0] - pts[j][0]
        const dy = pts[i][1] - pts[j][1]
        const dz = pts[i][2] - pts[j][2]
        if (dx * dx + dy * dy + dz * dz < THRESH_SQ) {
          lines.push(...pts[i], ...pts[j])
        }
      }
    }

    return { pointBuf, lineBuf: new Float32Array(lines) }
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t    = state.clock.elapsedTime
    const fade = Math.max(0, 1 - scrollRef.current / 650)
    const m    = mouseRef.current

    // Slow auto-rotation + mouse tilt
    groupRef.current.rotation.y += delta * 0.08
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      m.y * 0.12 + Math.sin(t * 0.22) * 0.025,
      0.04,
    )
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -m.x * 0.04,
      0.04,
    )

    // Earth: keep at gentle low opacity
    if (earthRef.current) {
      ;(earthRef.current.material as THREE.MeshPhongMaterial).opacity = 0.28 * fade
    }
    // Dots: breathing pulse
    if (pointsRef.current) {
      ;(pointsRef.current.material as THREE.PointsMaterial).opacity =
        (0.72 + Math.sin(t * 0.9) * 0.14) * fade
    }
    // Lines: slower pulse
    if (linesRef.current) {
      ;(linesRef.current.material as THREE.LineBasicMaterial).opacity =
        (0.16 + Math.sin(t * 0.55) * 0.05) * fade
    }
  })

  const fade = Math.max(0, 1 - scroll / 650)

  return (
    <group ref={groupRef}>
      {/* Ghost Earth — texture visible but very transparent */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshPhongMaterial
          map={earthTex}
          transparent
          opacity={0.28 * fade}
          shininess={6}
          depthWrite={false}
        />
      </mesh>

      {/* Connection lines on top of Earth */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lineBuf, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#f97316"
          transparent
          opacity={0.16 * fade}
          depthWrite={false}
        />
      </lineSegments>

      {/* Amber node dots */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointBuf, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#f97316"
          size={0.058}
          transparent
          opacity={0.80 * fade}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

function EarthFallback({ fade }: { fade: number }) {
  return (
    <mesh>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshBasicMaterial color="#d4c5b0" transparent opacity={0.15 * fade} />
    </mesh>
  )
}

export default function SkullCanvas({ scroll, mouse }: Props) {
  const fade = Math.max(0, 1 - scroll / 650)
  return (
    <div style={{ width: '100%', height: '100%', display: 'block' }}>
      <Canvas
        camera={{ position: [0, 0.2, 4.8], fov: 42 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} color="#d0dff0" />
        <directionalLight position={[6, 4, 4]} intensity={2.0} color="#ffffff" />
        <Suspense fallback={<EarthFallback fade={fade} />}>
          <EarthNetwork scroll={scroll} mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  )
}
