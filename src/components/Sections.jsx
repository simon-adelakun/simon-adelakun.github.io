import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ABOUT, CAREER, CV, DESIGNS, DO, EXP, ME, SKILLS, SOCIALS, WORKS } from '../data'

// Les scènes 3D (three.js) sont chargées à la demande : la page s'affiche plus vite.
const Globe = lazy(() => import('./Globe'))
const DeskScene = lazy(() => import('./DeskScene'))
const DataNetwork = lazy(() => import('./DataNetwork'))

export function Nav() {
  return (
    <nav className="nav" aria-label="Navigation principale">
      <a href="#top" className="nav-logo">{ME.prenom}</a>
      <a href={`mailto:${ME.email}`} className="nav-mail">{ME.email}</a>
      <div className="nav-links"><a href="#about">À PROPOS</a><a href="#work">TRAVAUX</a><a href="#design">DESIGN</a><a href="#contact">CONTACT</a></div>
    </nav>
  )
}

export function About() {
  return (
    <section className="about" id="about">
      <div className="about-text">
        <small>À PROPOS</small>
        <p>{ABOUT}</p>
      </div>
      <div className="about-photo">
        <img src="/moi.jpg" alt="Portrait d'Adelakun Taiwo Simon Adelani, ingénieur logiciel" width="420" height="525" loading="lazy" decoding="async" />
      </div>
    </section>
  )
}

export function Network() {
  return (
    <section className="network">
      <h2 className="big">ARCHITECTURE</h2>
      <p className="network-hint">Front · API · Base de données — rapproche le curseur des nœuds</p>
      <Suspense fallback={<div className="network-scene" />}><DataNetwork /></Suspense>
    </section>
  )
}

export function WhatIDo() {
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % DO.length), 4000); return () => clearInterval(t) }, [])
  return (
    <section className="whatido">
      <h2 className="big">CE QUE<br />JE FAIS</h2>
      <Suspense fallback={<div className="desk" />}><DeskScene /></Suspense>
      <div className="dcard" key={i}>
        <i /><i /><i /><i />
        <b>{DO[i].t}</b><em>Description</em><p>{DO[i].d}</p>
      </div>
    </section>
  )
}

export function Career() {
  const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('on', e.isIntersecting)), { threshold: 0.7 })
    ref.current.querySelectorAll('.crow').forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [])
  return (
    <section className="career" ref={ref}>
      <h2>Mon parcours<br /><span>& expérience</span></h2>
      {CAREER.map((c) => (
        <div className="crow" key={c.r}>
          <div className="cr"><b>{c.r}</b><small>{c.o}</small></div>
          <div className="cy">{c.y}</div>
          <div className="cd"><span className="dot" />{c.d.trim().length > 1 && <p>{c.d}</p>}</div>
        </div>
      ))}
    </section>
  )
}

function Shot({ t, img, imgs }) {
  const list = imgs && imgs.length ? imgs : img ? [img] : []
  const [k, setK] = useState(0)
  useEffect(() => {
    if (list.length < 2) return
    const id = setInterval(() => setK((x) => (x + 1) % list.length), 3500)
    return () => clearInterval(id)
  }, [list.length])
  if (list.length) return (
    <div className={`shot shot-img${list.length > 1 ? ' shot-multi' : ''}`} onClick={() => list.length > 1 && setK((x) => (x + 1) % list.length)}>
      <img key={list[k]} src={list[k]} alt={`Capture ${k + 1} du projet ${t}`} loading="lazy" decoding="async" />
      {list.length > 1 && <div className="shot-dots">{list.map((_, i) => <button key={i} type="button" className={i === k ? 'on' : ''} aria-label={`Voir la capture ${i + 1}`} onClick={(e) => { e.stopPropagation(); setK(i) }} />)}</div>}
    </div>
  )
  return <div className="shot" aria-hidden="true"><div className="bar"><i /><i /><i /></div><div className="shot-body"><b>{t}</b><span /><span /><span className="s2" /></div></div>
}

export function Work() {
  return (
    <section className="work" id="work">
      <h2>Mes <span>travaux</span></h2>
      <div className="track">
        {WORKS.map((w) => (
          <article key={w.n}>
            <Shot t={w.t} img={w.img} imgs={w.imgs} />
            <div className="winfo"><div className="wnum">{w.n}</div><div className="wt"><b>{w.t}</b><small>{w.c}</small></div><h4>Outils et fonctionnalités</h4><p>{w.tools}</p>{(w.demo || w.repo) && <div className="wlinks">{w.demo && <a href={w.demo} target="_blank" rel="noopener noreferrer">Voir le site ↗</a>}{w.repo && <a href={w.repo} target="_blank" rel="noopener noreferrer">Code source ↗</a>}</div>}</div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Designs() {
  return (
    <section className="designs" id="design">
      <h2>Design <span>graphique</span></h2>
      <p className="hint">Affiches réalisées pour des commerces d’Abidjan — touchez une affiche pour l’agrandir</p>
      <div className="design-grid">
        {DESIGNS.map((d) => (
          <a className="design-card" key={d.t} href={d.img} target="_blank" rel="noopener noreferrer">
            <img src={d.img} alt={`${d.c} : ${d.t}`} loading="lazy" decoding="async" />
            <span><b>{d.t}</b><small>{d.c}</small></span>
          </a>
        ))}
      </div>
    </section>
  )
}

export function Skills() {
  return (
    <section className="stars skills" id="skills">
      <h2 className="heavy">Compétences</h2>
      <p className="hint">Ce que j’utilise au quotidien</p>
      <div className="skills-grid">
        {SKILLS.map((s) => (
          <article className="skill-card" key={s.g}>
            <h3>{s.g}</h3>
            <div className="chips">{s.t.map((t) => <span key={t}>{t}</span>)}</div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Experience() {
  return (
    <section className="stars exp">
      <h2 className="heavy">Expérience</h2>
      <p className="hint">Mon parcours professionnel</p>
      <div className="stack-cards">
        {EXP.map((e, i) => (
          <article className="glass" key={e.r} style={{ top: `${90 + i * 28}px` }}>
            <header><div><h3>{e.r}</h3><small>{e.o}</small></div><span className="pill">{e.date}</span></header>
            <ul>{e.b.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="chips">{e.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Contact() {
  const [f, setF] = useState({ nom: '', mail: '', msg: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const send = (e) => {
    e.preventDefault()
    window.location.href = `mailto:${ME.email}?subject=${encodeURIComponent('Message de ' + f.nom)}&body=${encodeURIComponent(f.msg + '\n\n' + f.nom + ' — ' + f.mail)}`
  }
  return (
    <section className="contact" id="contact">
      <Suspense fallback={<div className="globe-scene" />}><Globe /></Suspense>
      <form onSubmit={send}>
        <small>PRENDRE CONTACT</small>
        <h2>Contact.</h2>
        <label>Ton nom<input required value={f.nom} onChange={set('nom')} placeholder="Comment tu t’appelles ?" /></label>
        <label>Ton e-mail<input required type="email" value={f.mail} onChange={set('mail')} placeholder="Quelle est ton adresse e-mail ?" /></label>
        <label>Ton message<textarea required value={f.msg} onChange={set('msg')} placeholder="Que veux-tu me dire ?" /></label>
        <button type="submit">Envoyer</button>
        <div className="contact-links">
          <a href={CV.url} download>{CV.label} ↓</a>
          {SOCIALS.github && <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
          {SOCIALS.linkedin && <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
          {SOCIALS.instagram && <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>}
       <a href={`tel:${ME.telIntl}`}>{ME.tel} ↗</a>
          {SOCIALS.whatsapp && <a href={SOCIALS.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>}
        </div>
      </form>
    </section>
  )
}
