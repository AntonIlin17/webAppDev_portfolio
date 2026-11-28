import { Link } from 'react-router-dom'
import me from '../components/portfolio/identity.js'
import resumePdf from '../assets/Anton_Ilin.pdf'

export default function PortfolioAbout() {
  return (
    <>
      <section className="build-about">
        <h1 className="build-display build-statement">{me.belief}</h1>
        <div className="build-about-columns">
          <div>
            <p>{me.intro} {me.about}</p>
            <div className="build-inline-links">
              <a href={resumePdf} download>Download my resume</a>
              <Link to="/education">Education</Link>
              <Link to="/services">Services</Link>
            </div>
          </div>
          <dl className="build-facts">
            {me.facts.map(([term, text]) => <div key={term}><dt>{term}</dt><dd>{text}</dd></div>)}
          </dl>
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
