import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Artwork from '../components/portfolio/Artwork.jsx'
import projects from './projectData.js'


// The work page: a filmstrip of projects. Scroll it with the wheel, drag it,
// or use the bar underneath. Each frame opens that project's own page.
export default function Projects() {
  const film = useRef(null)
  const drag = useRef(null)
  const [position, setPosition] = useState({ percent: 0, ratio: 1 })

  function syncFilm() {
    const node = film.current
    if (!node) return // a resize can still be reported just after leaving the page
    const max = node.scrollWidth - node.clientWidth
    setPosition({
      percent: max > 0 ? Math.round(node.scrollLeft / max * 100) : 0,
      ratio: node.scrollWidth ? node.clientWidth / node.scrollWidth : 1,
    })
  }

  useEffect(() => {
    const node = film.current
    syncFilm()
    // A vertical wheel moves the strip sideways until it reaches either end.
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

  // A drag that ends on a frame must not open it.
  function guardClick(event) {
    if (event.detail && drag.current?.moved) event.preventDefault()
  }

  return (
    <section className="build-work" aria-labelledby="work-heading">
      <div className="build-work-heading">
        <h1 id="work-heading" className="build-display">Selected work</h1>
        <p>Scroll, drag, or use the bar below.</p>
      </div>
      <div className="build-film" ref={film} onScroll={syncFilm} onPointerDown={beginDrag} onPointerMove={moveDrag}>
        {projects.map((item) => (
          <Link className="build-frame" key={item.slug} to={`/projects/${item.slug}`} draggable={false} onClick={guardClick} aria-label={`Open project: ${item.title}`}>
            <Artwork specimen={item.specimen} scale={0.84} />
            <strong className="build-display">{item.title}</strong>
            <span className="build-frame-description">{item.description}</span>
            <span className="build-frame-open" aria-hidden="true">Open project</span>
          </Link>
        ))}
      </div>
      <div className="build-film-controls">
        <button type="button" className="build-round" aria-label="Previous project" onClick={() => stepFilm(-1)} disabled={position.percent === 0}>←</button>
        <input type="range" min="0" max="100" value={position.percent} style={{ '--film-thumb': `${position.ratio * 100}%` }} aria-label="Scroll the projects" onChange={(event) => {
          const node = film.current
          node.scrollLeft = (node.scrollWidth - node.clientWidth) * Number(event.target.value) / 100
        }} />
        <button type="button" className="build-round" aria-label="Next project" onClick={() => stepFilm(1)} disabled={position.percent === 100}>→</button>
      </div>
    </section>
  )
}
