import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const SKIN = '#9a5c38', SKIN_D = '#7a4429', HAIR = '#17161a'
const mat = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, clearcoat: 0.2, clearcoatRoughness: 0.45, ...o })

// Éclairage « studio » : lumière douce + reflets colorés, sans aucun fichier externe
export function Studio() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 6]} intensity={1.5} />
      <pointLight position={[-5, 2, 3]} intensity={22} color="#a78bfa" />
      <pointLight position={[5, -1, 4]} intensity={12} color="#f472b6" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 3, 5]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-6, 1, 2]} scale={[2, 6, 1]} color="#a78bfa" />
        <Lightformer form="rect" intensity={1.6} position={[6, 0, 2]} scale={[2, 6, 1]} color="#f472b6" />
      </Environment>
    </>
  )
}

// Motif écossais de la chemise : petits carreaux bleu-vert / blanc / noir
function plaid() {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const x = c.getContext('2d')
  x.fillStyle = '#245f6a'; x.fillRect(0, 0, 128, 128)
  x.fillStyle = 'rgba(235,232,224,.95)'; x.fillRect(0, 0, 128, 40); x.fillRect(0, 0, 40, 128)
  x.fillStyle = 'rgba(20,21,24,.82)'; x.fillRect(0, 40, 128, 24); x.fillRect(40, 0, 24, 128)
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

function Limb({ a, b, r, material }) {
  const { pos, q, len } = useMemo(() => {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b)
    return { pos: A.clone().add(B).multiplyScalar(0.5), len: A.distanceTo(B), q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()) }
  }, [a, b])
  return <mesh position={pos} quaternion={q} material={material}><capsuleGeometry args={[r, len, 12, 24]} /></mesh>
}

// Casquette argentée à visière violette, comme sur la référence
function Cap() {
  const silver = useMemo(() => mat('#dcdde4', { metalness: 0.25, roughness: 0.32, clearcoat: 0.5 }), [])
  const trim = useMemo(() => mat('#7c3aed', { roughness: 0.4 }), [])
  return (
    <group position={[0, 0.45, -0.02]} rotation={[-0.12, 0, 0]}>
      <mesh material={silver} scale={[1, 0.8, 1.02]}><sphereGeometry args={[1.1, 56, 36, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      <mesh material={trim} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.02, 1]}><torusGeometry args={[1.1, 0.05, 12, 72]} /></mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, (i * Math.PI) / 3, 0]} scale={[1, 0.8, 1.02]}><torusGeometry args={[1.105, 0.012, 6, 48, Math.PI]} /><meshStandardMaterial color="#b4b5c0" /></mesh>
      ))}
      <mesh material={silver} position={[0, 0.9, 0]}><sphereGeometry args={[0.07, 12, 12]} /></mesh>
      <group position={[0, -0.02, 0.05]} rotation={[0.1, 0, 0]}>
        <mesh material={trim} position={[0, -0.035, 0]}><cylinderGeometry args={[1.5, 1.5, 0.05, 48, 1, false, -Math.PI * 0.34, Math.PI * 0.68]} /></mesh>
        <mesh material={silver}><cylinderGeometry args={[1.48, 1.48, 0.05, 48, 1, false, -Math.PI * 0.34, Math.PI * 0.68]} /></mesh>
      </group>
    </group>
  )
}

function Head() {
  const g = useRef(), eyes = useRef()
  const skin = useMemo(() => mat(SKIN, { roughness: 0.48, clearcoat: 0.25 }), [])
  const skinD = useMemo(() => mat(SKIN_D, { roughness: 0.55 }), [])
  const hair = useMemo(() => mat(HAIR, { roughness: 0.9, clearcoat: 0 }), [])
  const curls = useMemo(() => Array.from({ length: 11 }, (_, i) => { const a = Math.PI * (0.62 + (i / 10) * 0.76); return [Math.sin(a) * 1.04, 0.22 + (i % 2) * 0.12, Math.cos(a) * 1.04] }), [])
  useFrame(({ pointer, clock }) => {
    g.current.rotation.y += (pointer.x * 0.6 - g.current.rotation.y) * 0.06
    g.current.rotation.x += (-pointer.y * 0.3 - g.current.rotation.x) * 0.06
    const t = clock.elapsedTime % 4.8
    eyes.current.scale.y = t > 4.55 ? 1 - Math.sin(((t - 4.55) / 0.25) * Math.PI) * 0.9 : 1
  })
  return (
    <group ref={g} position={[0, 6.2, 0]}>
      <mesh material={skin} scale={[1.02, 1, 1]}><sphereGeometry args={[1, 64, 48]} /></mesh>
      <mesh material={skin} position={[0, -0.34, 0.1]} scale={[0.93, 0.8, 0.9]}><sphereGeometry args={[1, 48, 32]} /></mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 1.02, -0.05, 0]}>
          <mesh material={skin} scale={[0.4, 0.95, 0.8]}><sphereGeometry args={[0.27, 24, 24]} /></mesh>
          <mesh material={skinD} position={[s * 0.04, 0, 0.04]} scale={[0.25, 0.6, 0.5]}><sphereGeometry args={[0.2, 16, 16]} /></mesh>
        </group>
      ))}
      {/* yeux aux paupières lourdes, comme la référence */}
      <group ref={eyes} position={[0, 0.1, 0]}>
        {[-0.37, 0.37].map((x) => (
          <group key={x} position={[x, 0, 0.93]}>
            <mesh scale={[1.15, 0.8, 0.5]}><sphereGeometry args={[0.21, 24, 24]} /><meshStandardMaterial color="#f7f5f2" roughness={0.25} /></mesh>
            <mesh position={[0, -0.01, 0.07]}><sphereGeometry args={[0.11, 20, 20]} /><meshStandardMaterial color="#6f8fa0" roughness={0.2} /></mesh>
            <mesh position={[0, -0.01, 0.15]}><sphereGeometry args={[0.05, 14, 14]} /><meshStandardMaterial color="#08080c" /></mesh>
            <mesh material={skin} position={[0, 0.1, 0.06]} scale={[1.25, 0.62, 0.7]}><sphereGeometry args={[0.22, 24, 24]} /></mesh>
          </group>
        ))}
      </group>
      {[-1, 1].map((s) => (
        <mesh key={s} material={hair} position={[s * 0.38, 0.42, 0.97]} rotation={[0, 0, Math.PI / 2 + s * 0.2]}><capsuleGeometry args={[0.065, 0.38, 8, 16]} /></mesh>
      ))}
      <mesh material={skinD} position={[0, -0.14, 1.04]} scale={[1.1, 0.9, 1]}><sphereGeometry args={[0.2, 24, 24]} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.08, -0.25, 1.1]}><sphereGeometry args={[0.035, 10, 10]} /><meshStandardMaterial color="#2a1008" /></mesh>)}
      {[-1, 1].map((s) => <mesh key={s} material={hair} position={[s * 0.12, -0.32, 0.99]} rotation={[0, 0, Math.PI / 2 - s * 0.12]}><capsuleGeometry args={[0.035, 0.14, 6, 10]} /></mesh>)}
      {/* sourire avec les dents, comme la référence */}
      <mesh position={[0, -0.4, 0.985]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.22, 0.045, 10, 32, Math.PI]} /><meshStandardMaterial color="#6a2b1d" /></mesh>
      <RoundedBox args={[0.42, 0.1, 0.1]} radius={0.04} position={[0, -0.5, 0.97]}><meshStandardMaterial color="#f8f6f2" roughness={0.3} /></RoundedBox>
      <mesh material={hair} position={[0, -0.86, 0.8]} scale={[1.2, 1.3, 0.8]}><sphereGeometry args={[0.13, 14, 14]} /></mesh>
      {/* coupe taper sous la casquette : côtés et nuque dégradés + quelques boucles à l'arrière */}
      <mesh scale={[1.02, 1, 1]}><sphereGeometry args={[1.012, 40, 24, Math.PI * 0.75, Math.PI * 1.5, 1.1, 0.6]} /><meshStandardMaterial color="#2a201c" roughness={1} /></mesh>
      <mesh scale={[1.02, 1, 1]}><sphereGeometry args={[1.008, 40, 24, Math.PI * 0.75, Math.PI * 1.5, 1.7, 0.35]} /><meshStandardMaterial color="#5e3f2d" roughness={1} /></mesh>
      {curls.map((p, i) => <mesh key={i} material={hair} position={p}><sphereGeometry args={[0.18, 12, 12]} /></mesh>)}
      <Cap />
    </group>
  )
}

// Ton Bitmoji en 3D : debout, main au menton, bras croisés. Pieds au sol (y = 0), environ 7,6 unités de haut.
export default function Bitmoji3D() {
  const body = useRef()
  const shirt = useMemo(() => new THREE.MeshPhysicalMaterial({ map: plaid(), roughness: 0.85, sheen: 0.6, sheenRoughness: 0.5 }), [])
  const skin = useMemo(() => mat(SKIN, { roughness: 0.48, clearcoat: 0.25 }), [])
  const pants = useMemo(() => mat('#1d1d24', { roughness: 0.85, clearcoat: 0 }), [])
  const shoe = useMemo(() => mat('#ececf0', { roughness: 0.4, clearcoat: 0.4 }), [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    body.current.position.y = Math.sin(t * 1.6) * 0.05
    body.current.scale.y = 1 + Math.sin(t * 1.6) * 0.006
  })
  return (
    <group ref={body}>
      {[-0.58, 0.58].map((x) => (
        <group key={x}>
          <mesh material={pants} position={[x * 0.9, 1.75, 0]}><cylinderGeometry args={[0.38, 0.5, 3.0, 32]} /></mesh>
          <RoundedBox args={[0.86, 0.46, 1.4]} radius={0.22} smoothness={6} position={[x, 0.24, 0.27]} material={shoe} />
        </group>
      ))}
      <RoundedBox args={[1.8, 0.7, 1.05]} radius={0.3} smoothness={6} position={[0, 3.2, 0]} material={pants} />
      <RoundedBox args={[2.0, 2.2, 1.15]} radius={0.45} smoothness={8} position={[0, 4.05, 0]} material={shirt} />
      <RoundedBox args={[0.7, 2.0, 0.1]} radius={0.05} position={[0, 4.05, 0.6]}><meshStandardMaterial color="#efefef" roughness={0.8} /></RoundedBox>
      <mesh position={[0, 5.2, 0]} material={skin}><cylinderGeometry args={[0.27, 0.32, 0.45, 28]} /></mesh>
      {[-1.08, 1.08].map((x) => <mesh key={x} position={[x, 4.85, 0]} material={shirt}><sphereGeometry args={[0.33, 24, 24]} /></mesh>)}
      {/* bras gauche : main au menton ; bras droit : avant-bras croisé sur le ventre */}
      <Limb a={[-1.08, 4.85, 0]} b={[-0.8, 4.1, 0.58]} r={0.28} material={shirt} />
      <Limb a={[-0.8, 4.1, 0.58]} b={[-0.18, 5.2, 0.8]} r={0.23} material={shirt} />
      <mesh position={[-0.12, 5.36, 0.84]} material={skin}><sphereGeometry args={[0.25, 24, 24]} /></mesh>
      <Limb a={[1.08, 4.85, 0]} b={[1.0, 3.95, 0.52]} r={0.28} material={shirt} />
      <Limb a={[1.0, 3.95, 0.52]} b={[-0.35, 4.05, 0.82]} r={0.23} material={shirt} />
      <mesh position={[-0.56, 4.05, 0.87]} material={skin}><sphereGeometry args={[0.23, 24, 24]} /></mesh>
      <Head />
    </group>
  )
}
