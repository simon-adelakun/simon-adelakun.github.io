import { useMemo, useRef } from 'react'
import { Canvas } from './SafeCanvas'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useInView, DPR } from '../hooks'

function earthTexture() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512
  const x = c.getContext('2d')
  x.fillStyle = '#0a1230'; x.fillRect(0, 0, 1024, 512)
  for (let i = 0; i < 38; i++) {
    x.fillStyle = i % 3 ? '#14532d' : '#1d6b3a'
    x.beginPath(); x.ellipse(Math.random() * 1024, 60 + Math.random() * 390, 30 + Math.random() * 90, 20 + Math.random() * 50, Math.random() * 3, 0, 7); x.fill()
  }
  for (let i = 0; i < 700; i++) { x.fillStyle = `rgba(255,${180 + Math.random() * 60},90,${0.4 + Math.random() * 0.6})`; x.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2) }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}

// Rubans qui s'enroulent autour de la planète (rose et bleu), chacun à sa vitesse
function Ribbon({ r, tube, arc, rot, speed, color }) {
  const ref = useRef()
  useFrame((_, d) => { ref.current.rotation.y += d * speed })
  return (
    <group ref={ref} rotation={rot}>
      <mesh scale={[1, 1, 3.4]}><torusGeometry args={[r, tube, 8, 90, arc]} /><meshStandardMaterial color={color} roughness={0.35} metalness={0.2} side={THREE.DoubleSide} /></mesh>
    </group>
  )
}

function Planet() {
  const g = useRef()
  const map = useMemo(earthTexture, [])
  const ribbons = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    r: 1.7 + Math.random() * 0.45, tube: 0.05 + Math.random() * 0.06, arc: 2.2 + Math.random() * 3.4,
    rot: [Math.random() * 3.14, Math.random() * 6.28, Math.random() * 3.14], speed: (Math.random() - 0.5) * 1.2,
    color: i % 2 ? '#f3c4d8' : '#8393ff',
  })), [])
  useFrame(({ pointer }, d) => { g.current.rotation.y += d * 0.15; g.current.rotation.x += (pointer.y * 0.3 - g.current.rotation.x) * 0.04 })
  return (
    <group ref={g}>
      <mesh><sphereGeometry args={[1.5, 64, 64]} /><meshStandardMaterial map={map} roughness={0.7} /></mesh>
      {ribbons.map((rb, i) => <Ribbon key={i} {...rb} />)}
    </group>
  )
}

export default function Globe() {
  const [ref, inView, seen] = useInView()
  return (
    <div className="globe-scene" ref={ref}>
      {seen && (
        <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }} dpr={DPR} frameloop={inView ? 'always' : 'never'}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 3, 5]} intensity={2.4} />
          <pointLight position={[-4, -2, 3]} intensity={30} color="#8393ff" />
          <Planet />
        </Canvas>
      )}
    </div>
  )
}
