import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { TECH } from '../data'
import { drawLogo } from '../logos'
import { useInView, DPR } from '../hooks'

// Sphère blanche brillante avec un « logo » coloré, répété pour qu'il soit visible sous plusieurs angles
function texture(label, color) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256
  const x = c.getContext('2d')
  const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#e4e4ea')
  x.fillStyle = g; x.fillRect(0, 0, 512, 256)
  ;[128, 384].forEach((cx) => { x.save(); x.translate(cx, 128); x.scale(0.8, 0.8); drawLogo(label, x, color, '#f4f4f7'); x.restore() })
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

function Balls() {
  const { viewport } = useThree()
  const refs = useRef([]), moved = useRef(false), last = useRef(0)
  const items = useMemo(() => [...TECH, ...TECH.slice(0, 10)].map(([l, c], i) => ({ l, c, i, r: (0.8 + ((i * 37) % 10) / 22) * Math.min(1, viewport.width / 14), x: (Math.random() - 0.5) * 8 })), [])
  const maps = useMemo(() => items.map((b) => texture(b.l, b.c)), [items])
  const [n, setN] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setN((x) => { if (x >= items.length) { clearInterval(t); return x } return x + 1 }), 120)
    const mv = () => (moved.current = true)
    addEventListener('pointermove', mv)
    return () => { clearInterval(t); removeEventListener('pointermove', mv) }
  }, [items.length])

  const kick = (b, dx, dy) => { const m = b.mass(); b.applyImpulse({ x: dx * m, y: dy * m, z: 0 }, true); b.applyTorqueImpulse({ x: 0, y: 0, z: -dx * m * 0.4 }, true) }

  useFrame(({ pointer, clock }) => {
    const px = (pointer.x * viewport.width) / 2, py = (pointer.y * viewport.height) / 2
    refs.current.forEach((b) => {
      if (!b) return
      if (moved.current) {            // la souris repousse les sphères
        const p = b.translation(), dx = p.x - px, dy = p.y - py, d = Math.hypot(dx, dy) || 1
        if (d < 3.6) { const f = ((3.6 - d) / 3.6) * 1.1; kick(b, (dx / d) * f, (dy / d) * f + 0.08) }
      }
    })
    const t = Math.floor(clock.elapsedTime * 1.4)   // coups de pouce réguliers : ça ne s'endort jamais
    if (t !== last.current && n > 4) {
      last.current = t
      const b = refs.current[Math.floor(Math.random() * Math.min(n, refs.current.length))]
      if (b) kick(b, (Math.random() - 0.5) * 8, 9 + Math.random() * 6)
    }
  })

  // un clic fait exploser le tas
  const blast = (e) => {
    refs.current.forEach((b) => {
      if (!b) return
      const p = b.translation(), dx = p.x - e.point.x, dy = p.y - e.point.y, d = Math.hypot(dx, dy) || 1
      kick(b, (dx / d) * 14, (dy / d) * 14 + 8)
    })
  }

  return (
    <>
      {items.slice(0, n).map((b) => (
        <RigidBody key={b.i} ref={(el) => (refs.current[b.i] = el)} colliders="ball" restitution={0.72} friction={0.25} linearDamping={0.05} angularDamping={0.15}
          enabledTranslations={[true, true, false]} position={[b.x, viewport.height / 2 + 2, 0]} linearVelocity={[(Math.random() - 0.5) * 4, -4, 0]}
          rotation={[Math.random() * 3, Math.random() * 3, Math.random() * 3]}>
          <mesh><sphereGeometry args={[b.r, 48, 48]} /><meshStandardMaterial map={maps[b.i]} roughness={0.18} metalness={0.05} /></mesh>
        </RigidBody>
      ))}
      <mesh position={[0, 0, 3]} onPointerDown={blast}><planeGeometry args={[viewport.width, viewport.height]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    </>
  )
}

function Walls() {
  const { viewport: v } = useThree()
  return (
    <>
      <CuboidCollider position={[0, -v.height / 2 - 0.5, 0]} args={[v.width, 0.5, 3]} />
      <CuboidCollider position={[-v.width / 2 - 0.5, 0, 0]} args={[0.5, v.height * 2, 3]} />
      <CuboidCollider position={[v.width / 2 + 0.5, 0, 0]} args={[0.5, v.height * 2, 3]} />
      <CuboidCollider position={[0, v.height / 2 + 14, 0]} args={[v.width, 0.5, 3]} />
    </>
  )
}

export default function TechSpheres() {
  const [ref, inView, seen] = useInView()
  return (
    <section className="spheres" id="stack" ref={ref}>
      <h2 className="spheres-title">MES TECHNOLOGIES</h2>
      {seen && (
        <Canvas camera={{ position: [0, 0, 20], fov: 35 }} dpr={DPR} frameloop={inView ? 'always' : 'never'}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 8, 8]} intensity={2.4} />
          <pointLight position={[-6, -3, 6]} intensity={40} color="#a78bfa" />
          <Physics gravity={[0, -16, 0]}>
            <Balls /><Walls />
          </Physics>
        </Canvas>
      )}
    </section>
  )
}
