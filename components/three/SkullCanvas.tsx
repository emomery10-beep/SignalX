'use client'
import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture, Stars } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  scroll: number
  mouse: { x: number; y: number }
}

function EarthMesh({ scroll, mouse }: Props) {
  const earthRef = useRef<THREE.Mesh>(null!)
  const cloudRef = useRef<THREE.Mesh>(null!)

  const [earthTex, cloudTex] = useTexture([
    '/textures/earth-day.jpg',
    '/textures/earth-clouds.png',
  ])

  const fade = Math.max(0, 1 - scroll / 650)

  useFrame((state, delta) => {
    if (!earthRef.current) return
    const t = state.clock.elapsedTime
    // Slow auto-rotation
    earthRef.current.rotation.y += delta * 0.06
    // Mouse parallax tilt with gentle bob
    earthRef.current.rotation.x = THREE.MathUtils.lerp(
      earthRef.current.rotation.x,
      mouse.y * 0.10 + Math.sin(t * 0.2) * 0.02,
      0.04
    )
    earthRef.current.rotation.z = THREE.MathUtils.lerp(
      earthRef.current.rotation.z,
      -mouse.x * 0.05,
      0.04
    )
    // Clouds spin slightly faster than Earth
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.08
      cloudRef.current.rotation.x = earthRef.current.rotation.x
      cloudRef.current.rotation.z = earthRef.current.rotation.z
    }
  })

  return (
    <group>
      {/* Earth surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshPhongMaterial
          map={earthTex}
          transparent
          opacity={fade}
          shininess={18}
          specular={new THREE.Color('#336699')}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.84, 48, 48]} />
        <meshPhongMaterial
          map={cloudTex}
          transparent
          opacity={0.35 * fade}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Atmosphere inner glow */}
      <mesh>
        <sphereGeometry args={[1.78, 32, 32]} />
        <meshBasicMaterial
          color="#1a6fa8"
          transparent
          opacity={0.05 * fade}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere outer halo */}
      <mesh>
        <sphereGeometry args={[2.05, 32, 32]} />
        <meshBasicMaterial
          color="#3388cc"
          transparent
          opacity={0.07 * fade}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function EarthFallback({ fade }: { fade: number }) {
  return (
    <mesh>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshBasicMaterial color="#1a3a5c" transparent opacity={0.4 * fade} />
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
        {/* Lighting — sun from upper-right */}
        <ambientLight intensity={0.18} color="#c8d8f0" />
        <directionalLight position={[6, 4, 4]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-6, -3, -3]} intensity={0.25} color="#2244aa" decay={2} />

        {/* Background stars */}
        <Stars
          radius={90}
          depth={40}
          count={2500}
          factor={3}
          saturation={0.1}
          fade
          speed={0.4}
        />

        <Suspense fallback={<EarthFallback fade={fade} />}>
          <EarthMesh scroll={scroll} mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  )
}
