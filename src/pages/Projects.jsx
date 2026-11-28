import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Artwork from '../components/portfolio/Artwork.jsx'
import projects from './projectData.js'

const projectArtwork = ['gyroscope', 'dahlia', 'coral', 'helix', 'ammonite']
const displayIndex = (index) => String(index).padStart(2, '0')

function ProjectSheet({ project, onEnlarge, onClose }) {
  const dialog = useRef(null)
  const close = useRef(null)
  useOpenDialog(dialog, close)
  const { title, description, approach, contribution, stack, links, images } = project
  const cover = images[0]
  return (
    <dialog ref={dialog} className="build-project-sheet" aria-label={title}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="build-sheet-inner">
        <button type="button" ref={close} className="build-pill build-sheet-close" aria-label="Close project" onClick={onClose}>Close ×</button>
        <div className="build-sheet-copy">
          <h2 className="build-display">{title}</h2>
          <p className="build-copy">{description}</p>
          <dl className="build-facts">
            <div><dt>How it was built</dt><dd>{approach}</dd></div>
            {contribution && <div><dt>My contribution</dt><dd>{contribution}</dd></div>}
          </dl>
          <ul className="build-tags" aria-label="Technologies">{stack.map((tool) => <li key={tool}>{tool}</li>)}</ul>
          <div className="build-inline-links">{links.map(({ label, url }) => <a className="build-pill" key={url} href={url}>{label} <span aria-hidden="true">↗</span></a>)}</div>
        </div>
        <div className="build-sheet-media">
          <figure className="build-shot">
            <figcaption><span aria-hidden="true">○ ○ ○</span> {cover.caption}</figcaption>
            <button type="button" onClick={() => onEnlarge(0)} aria-label={`Enlarge ${cover.caption}`}>
              <img src={cover.src} alt={cover.alt} />
            </button>
          </figure>
          <div className="build-thumbnails" role="group" aria-label="More project screenshots">
            {images.slice(1).map(({ src, alt, caption }, index) => (
              <button type="button" key={src} onClick={() => onEnlarge(index + 1)} aria-label={`Enlarge ${caption}`}>
                <img src={src} alt={alt} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </dialog>
  )
}

function useOpenDialog(dialogRef, closeRef) {
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    const opener = document.activeElement
    dialog.showModal()
    closeRef.current.focus()
    return () => {
      dialog.close()
      if (opener?.isConnected) opener.focus()
    }
  }, [dialogRef, closeRef])
}

function ProjectLightbox({ project, startIndex, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const [index, setIndex] = useState(startIndex)
  const { images, title } = project
  const image = images[index]

  useOpenDialog(dialogRef, closeRef)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.contains(document.activeElement)) {
      const control = dialog.querySelector('.lightbox-nav') ?? closeRef.current
      control.focus()
    }
  }, [index])

  function move(offset) {
    setIndex((current) => Math.max(0, Math.min(current + offset, images.length - 1)))
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox-overlay"
      aria-label={`${title} image gallery`}
      onKeyDown={handleKeyDown}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <button ref={closeRef} type="button" className="lightbox-close" aria-label="Close gallery" onClick={onClose}>×</button>
      {index > 0 && (
        <button type="button" className="lightbox-nav left" aria-label="Previous image" onClick={() => move(-1)}>‹</button>
      )}
      <figure className="lightbox-figure">
        <img className="lightbox-img" src={image.src} alt={image.alt} />
        <figcaption className="lightbox-caption" aria-live="polite">
          <span>{image.caption}</span>
          <span className="lightbox-counter">{index + 1} / {images.length}</span>
        </figcaption>
      </figure>
      {index < images.length - 1 && (
        <button type="button" className="lightbox-nav right" aria-label="Next image" onClick={() => move(1)}>›</button>
      )}
    </dialog>
  )
}

export default function Projects() {
  const film = useRef(null)
  const drag = useRef(null)
  const [position, setPosition] = useState({ percent: 0, ratio: 1, first: 1, last: 1 })
  const [project, setProject] = useState(null)
  const [imageIndex, setImageIndex] = useState(null)

  function syncFilm() {
    const node = film.current
    const cards = [...node.children]
    const max = node.scrollWidth - node.clientWidth
    const visible = cards.filter((card) => card.offsetLeft + card.offsetWidth > node.scrollLeft + 8 && card.offsetLeft + 8 < node.scrollLeft + node.clientWidth)
    setPosition({
      percent: max > 0 ? Math.round(node.scrollLeft / max * 100) : 0,
      ratio: node.scrollWidth ? node.clientWidth / node.scrollWidth : 1,
      first: visible.length ? cards.indexOf(visible[0]) + 1 : 1,
      last: visible.length ? cards.indexOf(visible.at(-1)) + 1 : 1,
    })
  }

  useEffect(() => {
    const node = film.current
    syncFilm()
    function wheel(event) {
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY) || event.ctrlKey) return
      const limit = node.scrollWidth - node.clientWidth
      if (event.deltaY > 0 ? node.scrollLeft >= limit - 1 : node.scrollLeft <= 0) return
      event.preventDefault()
      node.scrollBy({ left: (event.deltaMode === 1 ? 16 : 1) * event.deltaY })
    }
    node.addEventListener('wheel', wheel, { passive: false })
    const observer = window.ResizeObserver && new ResizeObserver(syncFilm)
    observer?.observe(node)
    return () => {
      observer?.disconnect()
      node.removeEventListener('wheel', wheel)
    }
  }, [])

  function stepFilm(direction) {
    const node = film.current
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    node.scrollBy({ left: direction * node.firstElementChild.offsetWidth, behavior: motion })
  }

  function beginDrag(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { x: event.clientX, start: film.current.scrollLeft, moved: false }
  }

  function moveDrag(event) {
    const current = drag.current
    if (!current || !(event.buttons & 1)) return
    const distance = event.clientX - current.x
    if (!current.moved && Math.abs(distance) < 6) return
    current.moved = true
    film.current.scrollLeft = current.start - distance
  }

  function openProject(item, event) {
    if (event.detail && drag.current?.moved) return
    setProject(item)
  }

  return (
    <section className="build-work" aria-labelledby="work-heading">
      <div className="build-work-heading">
        <h1 id="work-heading" className="build-display">Selected work</h1>
        <p>Scroll, drag, or use the bar below.</p>
      </div>
      <div className="build-film" ref={film} onScroll={syncFilm} onPointerDown={beginDrag} onPointerMove={moveDrag}>
        {projects.map((item, index) => (
          <button className="build-frame" type="button" key={item.title} onClick={(event) => openProject(item, event)} aria-label={`Open project: ${item.title}`}>
            <span className="build-frame-number" aria-hidden="true">{displayIndex(index + 1)}</span>
            <Artwork specimen={projectArtwork[index]} scale={0.84} />
            <strong className="build-display">{item.title}</strong>
            <span className="build-frame-description">{item.description}</span>
            <span className="build-frame-open" aria-hidden="true">Open project</span>
          </button>
        ))}
      </div>
      <div className="build-film-controls">
        <button type="button" className="build-round" aria-label="Previous project" onClick={() => stepFilm(-1)} disabled={position.percent === 0}>←</button>
        <input type="range" min="0" max="100" value={position.percent} style={{ '--film-thumb': `${position.ratio * 100}%` }} aria-label="Scroll the projects" onChange={(event) => {
          const node = film.current
          node.scrollLeft = (node.scrollWidth - node.clientWidth) * Number(event.target.value) / 100
        }} />
        <span>{displayIndex(position.first)}–{displayIndex(position.last)} / {displayIndex(projects.length)}</span>
        <button type="button" className="build-round" aria-label="Next project" onClick={() => stepFilm(1)} disabled={position.percent === 100}>→</button>
      </div>
      {project && <ProjectSheet project={project} onEnlarge={setImageIndex} onClose={() => setProject(null)} />}
      {imageIndex !== null && <ProjectLightbox project={project} startIndex={imageIndex} onClose={() => setImageIndex(null)} />}
    </section>
  )
}
