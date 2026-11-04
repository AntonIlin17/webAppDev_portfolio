// Projects page: featured work with live in-page demos, notebook cards, and
// earlier coursework with a lightbox gallery.
import { useEffect, useState } from 'react'
import systemDiagram from '../assets/systemDiagram.jpg'
import rssFeedMain from '../assets/rssFeedMain.png'
import rssFeed1 from '../assets/rssFeed1.png'
import Reveal from '../components/Reveal.jsx'
import GlowText from '../components/GlowText.jsx'
import { EARLIER, FEATURED } from '../data/projects.js'
import SplitEngineDemo from '../demos/SplitEngineDemo.jsx'
import WarehouseSimDemo from '../demos/WarehouseSimDemo.jsx'
import NotebookDemo from '../demos/notebook/NotebookDemo.jsx'
import '../demos/demos.css'

const IMAGES = { systemDiagram, rssFeedMain, rssFeed1 }

const DEMOS = {
  stingysplitter: SplitEngineDemo,
  'warehouse-robot': WarehouseSimDemo,
  'ml-coursework': NotebookDemo,
}

function FeaturedProject({ project, index, onOpen }) {
  const Demo = DEMOS[project.id]
  const wide = project.layout === 'wide'
  return (
    <Reveal as="li" className={`project project--featured ${wide ? 'project--wide' : ''}`} delay={index * 60}>
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <GlowText className="project-stack" text={project.stack} />
        {project.role && <p className="project-role">{project.role}</p>}
        <div className="project-stats">
          {project.stats.map((s) => (
            <div className="project-stat" key={s.label}><b>{s.value}</b><span>{s.label}</span></div>
          ))}
        </div>
        <ul className="project-facts">{project.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        {project.links.length > 0 && (
          <div className="project-actions">
            {project.links.map((l) => (
              <a key={l.href} className={`btn ${l.primary ? 'btn-primary' : 'btn-ghost'}`} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
            ))}
          </div>
        )}
        {project.note && <p className="demo-small demo-muted" style={{ marginTop: '1rem' }}>{project.note}</p>}
      </div>
      <div className="project-demo">{Demo && <Demo onOpenImage={onOpen} />}</div>
    </Reveal>
  )
}

function EarlierProject({ project, onOpen }) {
  const images = project.imageKeys.map((k) => IMAGES[k])
  const main = images[0]
  const thumbs = images.slice(1)
  return (
    <Reveal as="li" className={`project ${images.length === 0 ? 'project--no-media' : ''}`}>
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>
      {main && (
        <div className="project-media">
          <img className="project-main" src={main} alt={`${project.title} main screenshot`} onClick={() => onOpen(images, 0)} />
          {thumbs.length > 0 && (
            <div className="project-thumbs">
              {thumbs.map((src, idx) => (
                <img key={src} src={src} alt={`${project.title} extra ${idx + 1}`} onClick={() => onOpen(images, idx + 1)} />
              ))}
            </div>
          )}
        </div>
      )}
    </Reveal>
  )
}

export default function Projects() {
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 })

  const openLightbox = (images, index = 0) => setLightbox({ open: true, images, index })
  const closeLightbox = () => setLightbox({ open: false, images: [], index: 0 })
  const stepLightbox = (dir) =>
    setLightbox((lb) => ({ ...lb, index: (lb.index + dir + lb.images.length) % lb.images.length }))

  useEffect(() => {
    if (!lightbox.open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowRight') stepLightbox(1)
      else if (e.key === 'ArrowLeft') stepLightbox(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox.open])

  return (
    <section className="card">
      <Reveal>
        <span className="section-eyebrow">Selected work</span>
        <h1>Projects</h1>
        <p className="lead">Things I&apos;ve designed, built, and tested. Most of them you can try right here.</p>
      </Reveal>

      <ul className="project-list">
        {FEATURED.map((p, i) => <FeaturedProject key={p.id} project={p} index={i} onOpen={openLightbox} />)}
      </ul>

      <Reveal className="section-divider">
        <span className="section-eyebrow">Earlier work</span>
        <h2>Coursework & prototypes</h2>
      </Reveal>
      <ul className="project-list">
        {EARLIER.map((p) => <EarlierProject key={p.title} project={p} onOpen={openLightbox} />)}
      </ul>

      {lightbox.open && (
        <div className="lightbox-overlay" role="dialog" aria-modal="true" onClick={closeLightbox}>
          <button className="lightbox-close" aria-label="Close" onClick={closeLightbox}>×</button>
          {lightbox.images.length > 1 && (
            <>
              <button className="lightbox-nav left" aria-label="Previous" onClick={(e) => { e.stopPropagation(); stepLightbox(-1) }}>‹</button>
              <button className="lightbox-nav right" aria-label="Next" onClick={(e) => { e.stopPropagation(); stepLightbox(1) }}>›</button>
            </>
          )}
          <img className="lightbox-img" src={lightbox.images[lightbox.index]} alt={`Screenshot ${lightbox.index + 1}`} onClick={(e) => e.stopPropagation()} />
          {lightbox.images.length > 1 && <div className="lightbox-counter">{lightbox.index + 1} / {lightbox.images.length}</div>}
        </div>
      )}
    </section>
  )
}
