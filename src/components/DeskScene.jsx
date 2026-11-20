import { useMemo, useRef } from 'react'
import { Canvas } from './SafeCanvas'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { useInView, DPR } from '../hooks'

const W = '#060627', G = '#49498a'

// Clavier : quelques touches s'enfoncent au hasard, comme si quelqu'un tapait
function Keys() {
  const refs = useRef([])
  const keys = useMemo(() => { const a = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 13; c++) a.push([-0.95 + c * 0.158, -0.26 + r * 0.17]); return a }, [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    refs.current.forEach((m, i) => { if (m) m.position.y += ((Math.sin(t * 3 + i * 1.7) > 0.96 ? 0 : 0.05) - m.position.y) * 0.4 })
  })
  return keys.map(([x, z], i) => <mesh key={i} ref={(el) => (refs.current[i] = el)} position={[x, 0.05, z]}><boxGeometry args={[0.13, 0.05, 0.13]} /><meshStandardMaterial color="#fff" /></mesh>)
}

// Imprimante : une feuille sort puis disparaît en boucle
function Printer() {
  const paper = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % 7, p = Math.min(1, t / 2.5)
    paper.current.visible = t < 5.5
    paper.current.position.z = 0.35 + p * 0.75
  })
  return (
    <group position={[2.5, 0.1, -0.3]}>
      <RoundedBox args={[1.8, 0.75, 1.3]} radius={0.08} position={[0, 0.375, 0]}><meshStandardMaterial color="#312e55" /></RoundedBox>
      <mesh position={[0, 0.78, -0.2]} rotation={[-0.35, 0, 0]}><boxGeometry args={[1.2, 0.03, 0.8]} /><meshStandardMaterial color="#312e55" /></mesh>
      <mesh position={[0, 0.4, 0.66]}><boxGeometry args={[1.3, 0.12, 0.04]} /><meshStandardMaterial color="#2b2b33" /></mesh>
      <mesh position={[0.65, 0.7, 0.66]}><sphereGeometry args={[0.05, 12, 12]} /><meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={1.2} /></mesh>
      <mesh ref={paper} position={[0, 0.2, 0.4]}><boxGeometry args={[0.95, 0.012, 0.75]} /><meshStandardMaterial color="#fff" /></mesh>
    </group>
  )
}

function Monitor() {
  const screen = useRef()
  useFrame(({ clock }) => { screen.current.emissiveIntensity = 0.55 + Math.sin(clock.elapsedTime * 2) * 0.08 })
  const lines = [[-0.7, 0.45, 0.9, '#c4b5fd'], [-0.55, 0.28, 1.3, '#533e49'], [-0.55, 0.11, 0.8, '#8b5cf6'], [-0.4, -0.06, 1.1, '#c4b5fd'], [-0.7, -0.23, 0.7, '#f472b6'], [-0.55, -0.4, 1.2, '#8b5cf6']]
  return (
    <group position={[-0.9, 0.1, -0.5]}>
      <RoundedBox args={[2.9, 1.8, 0.12]} radius={0.07} position={[0, 1.45, 0]}><meshStandardMaterial color="#0c0622" /></RoundedBox>
      <mesh position={[0, 1.45, 0.07]}><planeGeometry args={[2.65, 1.55]} /><meshStandardMaterial ref={screen} color="white" emissive="#3b1d7a" emissiveIntensity={0.55} /></mesh>
      {lines.map(([x, y, w, c], i) => <mesh key={i} position={[x + w / 2 + 0.1, 1.45 + y, 0.08]}><boxGeometry args={[w, 0.07, 0.01]} /><meshBasicMaterial color={c} /></mesh>)}
      <mesh position={[0, 0.35, 0]}><boxGeometry args={[0.2, 0.7, 0.16]} /><meshStandardMaterial color={G} /></mesh>
      <RoundedBox args={[1.1, 0.07, 0.7]} radius={0.03} position={[0, 0.04, 0.1]}><meshStandardMaterial color={G} /></RoundedBox>
    </group>
  )
}

function Desk() {
  const g = useRef()
  useFrame(({ pointer }) => {
    g.current.rotation.y += (pointer.x * 0.35 - g.current.rotation.y) * 0.05
    g.current.rotation.x += (0.16 - pointer.y * 0.08 - g.current.rotation.x) * 0.05
  })
  return (
    <group ref={g} position={[0, -0.9, 0]}>
      <RoundedBox args={[8, 0.2, 3.6]} radius={0.06} position={[0, 0, 0.2]}><meshStandardMaterial color={W} roughness={0.5} /></RoundedBox>
      {[[-3.7, -1.4], [3.7, -1.4], [-3.7, 1.7], [3.7, 1.7]].map(([x, z], i) => <mesh key={i} position={[x, -1.1, z]}><boxGeometry args={[0.16, 2.1, 0.16]} /><meshStandardMaterial color={G} /></mesh>)}
      <Monitor />
      <group position={[-0.9, 0.1, 1.1]}>
        <RoundedBox args={[2.3, 0.1, 0.95]} radius={0.04}><meshStandardMaterial color={G} /></RoundedBox>
        <Keys />
      </group>
      <group position={[0.85, 0.1, 1.15]}>
        <RoundedBox args={[0.8, 0.02, 0.9]} radius={0.01}><meshStandardMaterial color="#312e55" /></RoundedBox>
        <mesh position={[0, 0.09, 0]} scale={[0.5, 0.45, 0.8]}><sphereGeometry args={[0.28, 20, 20]} /><meshStandardMaterial color="white" /></mesh>
      </group>
      <Printer />
    </group>
  )
}

// Le bureau seul : ordinateur, clavier, souris et imprimante
export default function DeskScene() {
  const [ref, inView, seen] = useInView()
  return (
    <div className="desk" ref={ref}>
      {seen && (
        <Canvas camera={{ position: [0, 3.2, 10], fov: 36 }} dpr={DPR} frameloop={inView ? 'always' : 'never'}>
          <ambientLight intensity={1} />
          <directionalLight position={[3, 6, 6]} intensity={2.2} />
          <pointLight position={[-1, 2.5, 3]} intensity={30} color="#312e55" />
          <Desk />
        </Canvas>
      )}
    </div>
  )
}
