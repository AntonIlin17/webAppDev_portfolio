import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Lightbox from '../components/portfolio/Lightbox.jsx'
import projects from './projectData.js'

const displayIndex = (index) => String(index).padStart(2, '0')

/**
 * The media frame on the right of a project page.
 * It shows one item at a time: the demo video if the project has one, then each screenshot.
 * The tabs underneath choose the item. A screenshot opens in the lightbox when clicked.
 */
function ProjectMedia({ project }) {
  const { title, demo, images } = project
  const items = [
    ...(demo ? [{ type: 'video', src: demo, caption: 'Demo', poster: images[0]?.src }] : []),
    ...images.map((image, imageIndex) => ({ type: 'image', imageIndex, ...image })),
  ]
  const [active, setActive] = useState(0)
  const [enlarged, setEnlarged] = useState(null)
  const item = items[active]

  return (
    <div className="build-project-media">
      <figure className="build-shot">
        <figcaption><span aria-hidden="true">○ ○ ○</span> {item.caption}</figcaption>
        <div className="build-shot-stage">
          {item.type === 'video' ? (
            <video key={item.src} src={item.src} poster={item.poster} controls playsInline preload="metadata" aria-label={`${title} demo video`} />
          ) : (
            <button type="button" onClick={() => setEnlarged(item.imageIndex)} aria-label={`Enlarge ${item.caption}`}>
              <img src={item.src} alt={item.alt} />
            </button>
          )}
        </div>
      </figure>
      {items.length > 1 && (
        <div className="build-tabs" role="group" aria-label="Project media">
          {items.map(({ src, caption }, index) => (
            <button type="button" key={src} aria-pressed={index === active} onClick={() => setActive(index)}>
              <i aria-hidden="true">{displayIndex(index + 1)}</i>{caption}
            </button>
          ))}
        </div>
      )}
      {enlarged !== null && <Lightbox title={title} images={images} startIndex={enlarged} onClose={() => setEnlarged(null)} />}
    </div>
  )
}

// One project, on a page of its own: the write-up on the left, its demo and screenshots on the right.
export default function ProjectPage() {
  const { slug } = useParams()
  const index = projects.findIndex((item) => item.slug === slug)

  if (index < 0) {
    return (
      <section className="build-project build-project--missing">
        <div className="build-project-copy">
          <h1 className="build-display">That project is not here.</h1>
          <p className="build-copy">The address may be out of date. Every current project is on the work page.</p>
          <Link className="build-pill" to="/projects">Back to work</Link>
        </div>
      </section>
    )
  }

  const project = projects[index]
  const next = projects[(index + 1) % projects.length]
  const { title, kind, description, approach, contribution, stack, links } = project

  return (
    <article className="build-project" aria-labelledby="project-title">
      <div className="build-project-copy">
        <Link className="build-pill build-back" to="/projects"><span aria-hidden="true">←</span> Back to work</Link>
        <p className="build-small">{kind}</p>
        <h1 id="project-title" className="build-display">{title}</h1>
        <p className="build-copy">{description}</p>
        <dl className="build-facts">
          <div><dt>How it was built</dt><dd>{approach}</dd></div>
          {contribution && <div><dt>My contribution</dt><dd>{contribution}</dd></div>}
        </dl>
        <ul className="build-tags" aria-label="Technologies">{stack.map((tool) => <li key={tool}>{tool}</li>)}</ul>
        <div className="build-inline-links">
          {links.map(({ label, url }) => <a className="build-pill" key={url} href={url}>{label} <span aria-hidden="true">↗</span></a>)}
        </div>
        <Link className="build-next" to={`/projects/${next.slug}`}>
          <span className="build-small">Next project</span>
          <span className="build-display">{next.title}</span>
        </Link>
      </div>
      {/* The key resets the chosen tab when moving from one project to the next. */}
      <ProjectMedia key={project.slug} project={project} />
    </article>
  )
}
