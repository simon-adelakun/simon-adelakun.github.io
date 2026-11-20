import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useInView, DPR } from '../hooks'

const CODE = [
  "class RendezVous(models.Model):",
  "    patient = ForeignKey(Patient)",
  "    date = DateTimeField()",
  "send_sms.delay(rdv.id)",
  "calendar.render()",
  "# MERISE -> PostgreSQL",
]

function ScreenContent() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = ((clock.elapsedTime * 0.35) % 1.2) - 0.4
  })
  return (
    <group ref={ref} position={[0, 0.05, 0.02]}>
      {CODE.map((line, i) => (
        <Text
          key={i}
          position={[-0.55, 0.35 - i * 0.12, 0]}
          fontSize={0.07}
          color={i % 2 ? '#a78bfa' : '#67e8f9'}
          anchorX="left"
          anchorY="middle"
          maxWidth={1.2}
        >
          {line}
        </Text>
      ))}
    </group>
  )
}

function Laptop() {
  const lid = useRef()
  const root = useRef()
  const open = useRef(0)

  useFrame(({ clock, pointer }) => {
    // open on load
    open.current = Math.min(1, open.current + 0.012)
    const angle = -Math.PI / 2 + open.current * (Math.PI / 2.15)
    if (lid.current) lid.current.rotation.x = angle
    // mouse tilt
    if (root.current) {
      root.current.rotation.y += (pointer.x * 0.35 - root.current.rotation.y) * 0.06
      root.current.rotation.x += (-pointer.y * 0.15 - root.current.rotation.x) * 0.05
      root.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.04
    }
  })

  return (
    <group ref={root} position={[0, -0.6, 0]} scale={1.35}>
      {/* base */}
      <RoundedBox args={[2.4, 0.08, 1.6]} radius={0.04} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a22" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      {/* keyboard area */}
      <mesh position={[0, 0.05, 0.15]}>
        <boxGeometry args={[2.0, 0.02, 0.9]} />
        <meshStandardMaterial color="#2a2a35" />
      </mesh>
      {/* trackpad */}
      <RoundedBox args={[0.7, 0.01, 0.4]} radius={0.02} position={[0, 0.06, 0.55]}>
        <meshStandardMaterial color="#3a3a48" />
      </RoundedBox>
      {/* lid hinge group */}
      <group ref={lid} position={[0, 0.04, -0.75]}>
        <RoundedBox args={[2.4, 1.5, 0.06]} radius={0.04} position={[0, 0.75, 0]}>
          <meshStandardMaterial color="#1a1a22" metalness={0.5} roughness={0.35} />
        </RoundedBox>
        {/* screen */}
        <mesh position={[0, 0.75, 0.035]}>
          <planeGeometry args={[2.15, 1.3]} />
          <meshStandardMaterial color="#0c0a14" emissive="#1e1b2e" emissiveIntensity={0.4} />
        </mesh>
        <group position={[0, 0.75, 0.04]}>
          <ScreenContent />
        </group>
      </group>
    </group>
  )
}

export default function LaptopScene() {
  const [ref, inView, seen] = useInView()
  return (
    <div className="desk" ref={ref}>
      {seen && (
        <Canvas camera={{ position: [0, 1.2, 5.5], fov: 40 }} dpr={DPR} frameloop={inView ? 'always' : 'never'}>
          <color attach="background" args={['#0a0814']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 5, 4]} intensity={1.8} />
          <pointLight position={[-2, 2, 2]} intensity={25} color="#8b5cf6" />
          <pointLight position={[2, 1, 3]} intensity={15} color="#22d3ee" />
          <Laptop />
        </Canvas>
      )}
    </div>
  )
}
