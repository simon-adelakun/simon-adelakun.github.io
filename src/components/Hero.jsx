import { lazy, Suspense, useEffect, useState } from 'react'

const ParticleCloud = lazy(() => import('./ParticleCloud'))
import { ME, ROLES } from '../data'

export default function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ROLES.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <header className="hero" id="top">
      <div className="hero-glow" />
      <Suspense fallback={<div className="hero-canvas" />}><ParticleCloud /></Suspense>
      <div className="hero-left">
        <small>Bonjour, je suis</small>
        <h1>{ME.nom}</h1>
      </div>
      <div className="hero-right">
        <small>Un créatif</small>
        <div className="roll">
          <span className="ghost">{ROLES[(i + 1) % ROLES.length]}</span>
          <span className="front" key={i}>
            {ROLES[i]}
          </span>
        </div>
      </div>
    </header>
  )
}
