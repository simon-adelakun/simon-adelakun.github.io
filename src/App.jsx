import { lazy, Suspense } from 'react'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import { About, Career, Contact, Designs, Experience, Nav, Network, Skills, WhatIDo, Work } from './components/Sections'
import { ME } from './data'

// Scènes 3D lourdes : chargées à la demande
const TechSpheres = lazy(() => import('./components/TechSpheres'))
const TechKeyboard = lazy(() => import('./components/TechKeyboard'))

export default function App() {
  return (
    <>
      <a className="skip" href="#about">Aller au contenu</a>
      <Cursor />
      <Nav />
      <Hero />
      <main>
        <About />
        <Network />
        <WhatIDo />
        <Career />
        <Work />
        <Designs />
        <Suspense fallback={<section className="spheres" />}><TechSpheres /></Suspense>
        <Suspense fallback={<section className="stars kbsec" />}><TechKeyboard /></Suspense>
        <Skills />
        <Experience />
        <Contact />
      </main>
      <footer>© 2026 {ME.nom} · {ME.lieu}</footer>
    </>
  )
}
