'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface NeuralHeadProps {
  scroll: number
  mouse: { x: number; y: number }
}

function NeuralHead({ scroll, mouse }: NeuralHeadProps) {
  const groupRef = useRef<THREE.Group>(null!)

  const { positions, linePositions } = useMemo(() => {
    const COUNT = 200
    const pts: THREE.Vector3[] = []

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.55 + (Math.random() - 0.5) * 0.55
      // Slightly taller on Y axis — more head-like silhouette
      pts.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * 1.2 * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ))
    }

    // Buffer for point positions
    const posBuf = new Float32Array(COUNT * 3)
    pts.forEach((p, i) => {
      posBuf[i * 3]     = p.x
      posBuf[i * 3 + 1] = p.y
      posBuf[i * 3 + 2] = p.z
    })

    // Connect nearby points with lines
    const lines: number[] = []
    const DIST = 0.85
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < DIST) {
          lines.push(pts[i].x, pts[i].y, pts[i].z)
          lines.push(pts[j].x, pts[j].y, pts[j].z)
        }
      }
    }

    return {
      positions: posBuf,
      linePositions: new Float32Array(lines),
    }
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Scroll-driven Y rotation — slow but responsive
    groupRef.current.rotation.y = scroll * 0.0038

    // Mouse parallax — smooth lerp
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.y * 0.12 + Math.sin(t * 0.18) * 0.03,
      0.04
    )
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -mouse.x * 0.07,
      0.04
    )
  })

  // Fade as user scrolls down past the hero
  const fade = Math.max(0, 1 - scroll / 650)

  return (
    <group ref={groupRef}>
      {/* Soft ghost head volume */}
      <mesh>
        <sphereGeometry args={[1.52, 48, 48]} />
        <meshStandardMaterial
          color="#1A0500"
          emissive="#C97A44"
          emissiveIntensity={0.12 * fade}
          transparent
          opacity={0.07 * fade}
          roughness={1}
          depthWrite={false}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshStandardMaterial
          color="#FF6B2B"
          emissive="#FF6B2B"
          emissiveIntensity={0.06 * fade}
          transparent
          opacity={0.03 * fade}
          roughness={1}
          depthWrite={false}
        />
      </mesh>

      {/* Neural particles on surface */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#E8531A"
          size={0.038}
          transparent
          opacity={0.82 * fade}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#C97A44"
          transparent
          opacity={0.22 * fade}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}

interface SkullCanvasProps {
  scroll: number
  mouse: { x: number; y: number }
}

export default function SkullCanvas({ scroll, mouse }: SkullCanvasProps) {
  return (
    // Explicit 100%×100% wrapper so R3F ResizeObserver correctly measures
    // the container even when the parent uses position:absolute + inset:0
    // without overflow:hidden to establish a BFC.
    <div style={{ width: '100%', height: '100%', display: 'block' }}>
      <Canvas
        camera={{ position: [0, 0.3, 5], fov: 44 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.25} color="#FF9A5C" />
        <pointLight position={[3, 4, 3]} intensity={2.5} color="#FF6B2B" decay={2} />
        <pointLight position={[-3, -2, 1]} intensity={1.2} color="#FFB347" decay={2} />
        <pointLight position={[0, -4, -2]} intensity={0.6} color="#C97A44" decay={2} />
        <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.35}>
          <NeuralHead scroll={scroll} mouse={mouse} />
        </Float>
      </Canvas>
    </div>
  )
}
