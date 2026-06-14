'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  scroll: number
  mouse: { x: number; y: number }
}

function NetworkSphere({ scroll, mouse }: Props) {
  const groupRef  = useRef<THREE.Group>(null!)
  const pointsRef = useRef<THREE.Points>(null!)
  const linesRef  = useRef<THREE.LineSegments>(null!)

  // Keep latest props accessible in useFrame without stale closures
  const scrollRef = useRef(scroll)
  const mouseRef  = useRef(mouse)
  scrollRef.current = scroll
  mouseRef.current  = mouse

  // Build node positions (Fibonacci sphere) + connection line buffer once
  const { pointBuf, lineBuf } = useMemo(() => {
    const R  = 1.8
    const N  = 130
    const gr = (1 + Math.sqrt(5)) / 2            // golden ratio

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

    // Connect nodes whose squared chord-distance is below threshold
    const THRESH_SQ = 0.68        // ≈ 0.82 units — ~5-7 connections per node
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
    groupRef.current.rotation.y += delta * 0.10
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

    // Subtle breathing pulse on node opacity
    if (pointsRef.current) {
      ;(pointsRef.current.material as THREE.PointsMaterial).opacity =
        (0.72 + Math.sin(t * 0.9) * 0.14) * fade
    }
    // Slower pulse on line opacity
    if (linesRef.current) {
      ;(linesRef.current.material as THREE.LineBasicMaterial).opacity =
        (0.15 + Math.sin(t * 0.55) * 0.05) * fade
    }
  })

  const fade = Math.max(0, 1 - scroll / 650)

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lineBuf, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#f97316"
          transparent
          opacity={0.15 * fade}
          depthWrite={false}
        />
      </lineSegments>

      {/* Node dots */}
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

export default function SkullCanvas({ scroll, mouse }: Props) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'block' }}>
      <Canvas
        camera={{ position: [0, 0.2, 4.8], fov: 42 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <NetworkSphere scroll={scroll} mouse={mouse} />
      </Canvas>
    </div>
  )
}
