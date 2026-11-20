import { useEffect, useRef, useState } from 'react'
import { Canvas } from './SafeCanvas'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo as useM } from 'react'
import * as THREE from 'three'
import { Html, RoundedBox } from '@react-three/drei'
import { drawLogo } from '../logos'
import { KEYS } from '../data'
import { useInView, DPR } from '../hooks'

const COLS = 5, GAP = 1.2

// logo blanc (ou foncé sur les touches claires) dessiné sur la touche
function logoTexture(k) {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const x = c.getContext('2d')
  x.fillStyle = k.c; x.fillRect(0, 0, 256, 256)
  x.translate(128, 128); x.scale(0.92, 0.92)
  drawLogo(k.n, x, k.t, k.c)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

function Key({ k, i, hover, setHover, pressed }) {
  const ref = useRef()
  const tex = useM(() => logoTexture(k), [k])
  const x = ((i % COLS) - 2) * GAP, z = (Math.floor(i / COLS) - 1.5) * GAP
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const rise = Math.min(1, Math.max(0, (t - 0.2 - i * 0.05) / 0.6))
    const e = 1 - Math.pow(1 - rise, 3)
    const press = pressed.current[i] ? Math.max(0, 1 - (t - pressed.current[i]) / 0.25) : 0
    const target = 0.55 - 1.6 * (1 - e) - (hover === i ? 0.18 : 0) - press * 0.32 + Math.sin(t * 1.2 + i) * 0.02
    ref.current.position.y += (target - ref.current.position.y) * 0.3
  })
  return (
    <group position={[x, 0, z]}>
      <group ref={ref} position={[0, -1, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHover(i) }}
        onPointerOut={() => setHover(null)}
        onClick={() => { pressed.current[i] = performance.now() / 1000 }}>
        <RoundedBox args={[1, 0.6, 1]} radius={0.16} smoothness={6}><meshPhysicalMaterial color={k.c} roughness={0.3} clearcoat={0.5} /></RoundedBox>
        <mesh position={[0, 0.305, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.74, 0.74]} /><meshStandardMaterial map={tex} roughness={0.35} /></mesh>
      </group>
    </group>
  )
}

function Board() {
  const [hover, setHover] = useState(null)
  const pressed = useRef({})
  const clock = useThree((s) => s.clock)
  const group = useRef()
  // appuyer sur une touche du clavier réel enfonce une touche 3D
  useEffect(() => {
    let off
    const kd = (e) => {
      const i = (e.key.length === 1 ? e.key.toUpperCase().charCodeAt(0) : 7) % KEYS.length
      pressed.current[i] = clock.elapsedTime; setHover(i)
      clearTimeout(off); off = setTimeout(() => setHover(null), 1400)
    }
    addEventListener('keydown', kd)
    return () => { removeEventListener('keydown', kd); clearTimeout(off) }
  }, [clock])
  useFrame(({ pointer }) => { group.current.rotation.y += (-Math.PI / 4 + pointer.x * 0.25 - group.current.rotation.y) * 0.05 })
  return (
    <>
      <group ref={group} rotation={[0, -Math.PI / 4, 0]}>
        <RoundedBox args={[COLS * GAP + 0.7, 0.4, 4 * GAP + 0.7]} radius={0.2} position={[0, -0.05, 0]}><meshStandardMaterial color="#14121f" roughness={0.6} /></RoundedBox>
        {KEYS.map((k, i) => <Key key={k.n} k={k} i={i} hover={hover} setHover={setHover} pressed={pressed} />)}
      </group>
      {hover !== null && (
        <Html position={[-5.2, 1.6, 1]} center style={{ pointerEvents: 'none' }}>
          <div className="tip"><b>{KEYS[hover].n}</b><span>{KEYS[hover].tip}</span></div>
        </Html>
      )}
    </>
  )
}

// recule la caméra sur écran étroit pour que tout le clavier reste visible
const KZ = Math.max(1, 1.25 / (innerWidth / (innerHeight * 0.72)))

export default function TechKeyboard() {
  const [ref, inView, seen] = useInView()
  return (
    <section className="stars kbsec" id="clavier" ref={ref}>
      <h2 className="heavy">Tech Stack</h2>
      <p className="hint">(astuce : appuie sur une touche)</p>
      <div className="kb-scene">
        {seen && (
          <Canvas key="kb" camera={{ position: [0, 8.5 * KZ, 9 * KZ], fov: 34 }} dpr={DPR} frameloop={inView ? 'always' : 'never'}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[4, 8, 5]} intensity={2.3} />
            <pointLight position={[-5, 3, -2]} intensity={25} color="#8b5cf6" />
            <Board />
          </Canvas>
        )}
      </div>
    </section>
  )
}
