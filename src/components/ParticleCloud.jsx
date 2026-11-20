import { useMemo, useRef } from 'react'
import { Canvas } from './SafeCanvas'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ME } from '../data'
import { useInView, DPR } from '../hooks'

const COUNT = 2800

/** Points formant le nom (ex. ADELAKUN) puis dispersion au survol souris */
function Cloud() {
  const points = useRef()
  const { positions, targets, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const targets = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)

    // 1) Définir le texte EN PREMIER
    const label = '</>'

    // 2) Dessiner le texte sur un canvas 2D
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, 512, 256)
    ctx.fillStyle = '#fff'
    const size = 220
    ctx.font = `bold ${size}px Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, 256, 128)

    // 3) Lire les pixels → positions 3D
    const img = ctx.getImageData(0, 0, 512, 256).data
    const pts = []
    for (let y = 0; y < 256; y += 2) {
      for (let x = 0; x < 512; x += 2) {
        if (img[(y * 512 + x) * 4] > 128) {
          pts.push([
            (x / 512 - 0.5) * 16,
            (0.5 - y / 256) * 6,
            (Math.random() - 0.5) * 0.6,
          ])
        }
      }
    }

    // sécurité si aucun pixel blanc
    if (pts.length === 0) {
      pts.push([0, 0, 0])
    }

    for (let i = 0; i < COUNT; i++) {
      const t = pts[i % pts.length]
      targets[i * 3] = t[0] + (Math.random() - 0.5) * 0.15
      targets[i * 3 + 1] = t[1] + (Math.random() - 0.5) * 0.15
      targets[i * 3 + 2] = t[2]
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      const u = i / COUNT
      colors[i * 3] = 0.55 + u * 0.4
      colors[i * 3 + 1] = 0.35 + (1 - u) * 0.25
      colors[i * 3 + 2] = 0.95
    }
    return { positions, targets, colors }
  }, [])

  const mouse = useRef({ x: 0, y: 0 })

  useFrame(({ clock, pointer }) => {
    mouse.current.x = pointer.x * 7
    mouse.current.y = pointer.y * 4
    const t = clock.elapsedTime
    const assemble = Math.min(1, t / 2.2)
    const pos = points.current.geometry.attributes.position.array
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      const tx = targets[ix]
      const ty = targets[ix + 1]
      const tz = targets[ix + 2]
      const dx = tx - mouse.current.x
      const dy = ty - mouse.current.y
      const d = Math.sqrt(dx * dx + dy * dy) || 1
      const force = d < 2.8 ? (2.8 - d) / 2.8 : 0
      const ang = Math.atan2(dy, dx) + t
      const sx = tx + Math.cos(ang) * force * 3.5
      const sy = ty + Math.sin(ang) * force * 3.5
      const sz = tz + force * 2
      const mix = assemble * (1 - force * 0.85)
      pos[ix] += (sx * mix + positions[ix] * (1 - mix) - pos[ix]) * 0.08
      pos[ix + 1] += (sy * mix + positions[ix + 1] * (1 - mix) - pos[ix + 1]) * 0.08
      pos[ix + 2] += (sz * mix + positions[ix + 2] * (1 - mix) - pos[ix + 2]) * 0.08
    }
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.rotation.y = Math.sin(t * 0.15) * 0.08
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function ParticleCloud() {
  const [ref, inView] = useInView('0px')
  return (
    <div ref={ref} className="hero-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, Math.max(11, 16.5 / (innerWidth / innerHeight))], fov: 42 }} dpr={DPR} frameloop={inView ? 'always' : 'never'}>
        <color attach="background" args={['#0a0814']} />
        <ambientLight intensity={0.4} />
        <Cloud />
      </Canvas>
    </div>
  )
}
