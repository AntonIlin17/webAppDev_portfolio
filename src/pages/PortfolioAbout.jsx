import { Link } from 'react-router-dom'
import Artwork from '../components/portfolio/Artwork.jsx'
import me from '../components/portfolio/identity.js'
import resumePdf from '../assets/Anton_Ilin.pdf'

// The about page, set the way the Dither Cabinet describes one of its elements:
// a framed specimen on the left, a sheet of facts on the right, signed underneath.
export default function PortfolioAbout() {
  return (
    <>
      <section className="build-about build-spec">
        <figure className="build-spec-figure">
          <Artwork specimen="orchid" scale={0.84} />
        </figure>
        <div className="build-spec-sheet">
          <p className="build-small">{me.elements.length + 1}<span className="build-slash">/</span>Developer</p>
          <h1 className="build-display">{me.name}</h1>
          <p className="build-copy">
            The <Link to="/projects/dither-cabinet">Dither Cabinet</Link> holds {me.elements.length} elements. This is the one that made them.
          </p>
          <dl className="build-facts">
            {me.facts.map(([term, text]) => <div key={term}><dt>{term}</dt><dd>{text}</dd></div>)}
          </dl>
          <div className="build-inline-links">
            <a href={resumePdf} download>Download my resume</a>
            <Link to="/education">Education</Link>
            <Link to="/services">Services</Link>
          </div>
          <div className="build-signoff">
            <Artwork kind="signature" scale={1.06} />
            <span className="build-small">{me.name}, {new Date().getFullYear()}</span>
          </div>
        </div>
      </section>
      <section className="build-marquee" aria-label="Tools I work with">
        <p className="build-visually-hidden">{me.technologies.join(', ')}</p>
        <div className="build-marquee-track build-display" aria-hidden="true">
          {[0, 1].map((copy) => (
            <span key={copy}>{me.technologies.map((tool) => <span key={tool}>{tool}<i>/</i></span>)}</span>
          ))}
        </div>
      </section>
    </>
  )
}
