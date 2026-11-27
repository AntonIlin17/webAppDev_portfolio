import { useLayoutEffect, useRef, useState } from 'react'
import Reveal from '../components/Reveal.jsx'
import projects from './projectData.js'

function ProjectCard({ project, onOpen }) {
  const { title, description, approach, contribution, stack, links, images } = project

  return (
    <Reveal as="li" className="project">
      <h2>{title}</h2>
      <div className="project-media">
        {images.map(({ src, alt, caption }, index) => (
          <button
            className={`project-image${index === 0 ? ' project-image--cover' : ''}`}
            type="button"
            key={src}
            onClick={() => onOpen({ project, index })}
            aria-label={`Enlarge ${caption}`}
          >
            <img src={src} alt={alt} decoding="async" loading="lazy" />
          </button>
        ))}
      </div>
      <div className="project-details">
        <p>{description}</p>
        <p><strong>How it was built</strong> {approach}</p>
        {contribution && <p><strong>My contribution</strong> {contribution}</p>}
        <ul className="project-stack" aria-label="Technologies">
          {stack.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
        {links.length > 0 && (
          <div className="project-links">
            {links.map(({ label, url }) => <a key={url} href={url}>{label} <span aria-hidden="true">↗</span></a>)}
          </div>
        )}
      </div>
    </Reveal>
  )
}

function ProjectLightbox({ project, startIndex, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const [index, setIndex] = useState(startIndex)
  const { images, title } = project
  const image = images[index]

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    const opener = document.activeElement
    dialog.showModal()
    closeRef.current.focus()
    return () => {
      dialog.close()
      opener?.focus()
    }
  }, [])

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
  const [gallery, setGallery] = useState(null)

  return (
    <section className="card">
      <Reveal>
        <h1>My Work</h1>
      </Reveal>
      <ul className="project-list">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} onOpen={setGallery} />
        ))}
      </ul>
      {gallery && (
        <ProjectLightbox project={gallery.project} startIndex={gallery.index} onClose={() => setGallery(null)} />
      )}
    </section>
  )
}
