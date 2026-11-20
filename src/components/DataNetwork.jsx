import { useMemo, useRef } from 'react'
import { Canvas } from './SafeCanvas'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useInView, DPR } from '../hooks'

const NODES = [
  { id: 'Front', pos: [-2.8, 1.2, 0], color: '#22d3ee' },
  { id: 'API', pos: [0, 1.8, 0], color: '#a78bfa' },
  { id: 'PostgreSQL', pos: [2.8, 1.0, 0], color: '#f472b6' },
  { id: 'Auth', pos: [-1.2, -0.8, 0], color: '#34d399' },
  { id: 'Celery', pos: [1.4, -1.0, 0], color: '#fbbf24' },
]

const EDGES = [
  [0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4],
]

function Network() {
  const group = useRef()
  const pulses = useRef([])
  const nodeRefs = useRef([])
  const { viewport } = useThree()
  const s = Math.min(1, viewport.width / 7.5)
  // init pulses
  useMemo(() => {
    pulses.current = EDGES.map(() => ({ t: Math.random(), speed: 0.35 + Math.random() * 0.4 }))
  }, [])

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime
    // attract nodes slightly to cursor
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const base = NODES[i].pos
      const tx = base[0] + pointer.x * 0.6
      const ty = base[1] + pointer.y * 0.4
      mesh.position.x += (tx - mesh.position.x) * 0.04
      mesh.position.y += (ty - mesh.position.y) * 0.04
      mesh.position.z = Math.sin(t * 1.5 + i) * 0.15
    })
    // advance pulses
    pulses.current.forEach((p) => {
      p.t = (p.t + p.speed * 0.016) % 1
    })
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.2) * 0.08
    }
  })

  const linePositions = useMemo(() => {
    return EDGES.map(([a, b]) => {
      const A = NODES[a].pos
      const B = NODES[b].pos
      return new Float32Array([A[0], A[1], A[2], B[0], B[1], B[2]])
    })
  }, [])

  return (
    <group ref={group} scale={s}>
      {EDGES.map((_, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={2} array={linePositions[i]} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color="#4c1d95" transparent opacity={0.5} />
        </line>
      ))}
      {/* pulse spheres along edges */}
      {EDGES.map(([a, b], i) => (
        <Pulse key={`p${i}`} a={NODES[a].pos} b={NODES[b].pos} pulse={pulses.current[i]} color={NODES[a].color} />
      ))}
      {NODES.map((n, i) => (
        <group key={n.id}>
          <mesh
            ref={(el) => (nodeRefs.current[i] = el)}
            position={n.pos}
          >
            <sphereGeometry args={[0.28, 24, 24]} />
            <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.85} roughness={0.3} />
          </mesh>
          <Text position={[n.pos[0], n.pos[1] - 0.55, n.pos[2]]} fontSize={0.22} color="#e9e5ff" anchorX="center">
            {n.id}
          </Text>
        </group>
      ))}
    </group>
  )
}

function Pulse({ a, b, pulse, color }) {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current || !pulse) return
    const t = pulse.t
    ref.current.position.set(
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    )
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  )
}

export default function DataNetwork() {
  const [ref, inView, seen] = useInView()
  return (
    <div className="network-scene" ref={ref}>
      {seen && (
        <Canvas camera={{ position: [0, 0.5, 8], fov: 40 }} dpr={DPR} frameloop={inView ? 'always' : 'never'}>
          <color attach="background" args={['#0a0814']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 3, 4]} intensity={40} color="#8b5cf6" />
          <Network />
        </Canvas>
      )}
    </div>
  )
}
