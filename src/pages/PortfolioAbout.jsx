import { useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Artwork from '../components/portfolio/Artwork.jsx'
import me from '../components/portfolio/identity.js'
import resumePdf from '../assets/Anton_Ilin.pdf'

// One dated row in the record: when, what and where, then the detail.
function Entry({ dates, title, where, children }) {
  return (
    <li>
      <p className="build-small">{dates}</p>
      <div>
        <h3 className="build-display">{title}</h3>
        <p className="build-record-where">{where}</p>
      </div>
      {children}
    </li>
  )
}

// The about page: a framed element on the left, who Anton is and a sheet of facts on the right,
// signed underneath.
// The record follows: work experience, then education.
export default function PortfolioAbout() {
  const { hash } = useLocation()

  // The page is loaded on demand, so a link straight to a section has to be honoured here.
  useLayoutEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <>
      <section className="build-about build-spec">
        <figure className="build-spec-figure">
          <Artwork specimen="orchid" scale={0.84} />
        </figure>
        <div className="build-spec-sheet">
          <p className="build-small">Frontend developer<span className="build-slash">/</span>{me.place}</p>
          <h1 className="build-display">{me.name}</h1>
          <p className="build-copy">
            I'm a frontend developer and an AI and software engineering student at {me.school} in {me.place}.
            I build React and TypeScript interfaces, connect them to APIs, and test them the way a real user would use them.
          </p>
          <p className="build-copy">
            In the summer of 2026 I worked as a frontend developer at Paideum. On my own time I build projects end to end,
            like a <Link to="/projects/openclaw-desktop">desktop client for local AI agents</Link>,
            an <Link to="/projects/warehouse-robot">autonomous warehouse robot</Link> and
            a receipt splitter that reads a photo of the bill.
          </p>
          <p className="build-copy">
            Before code I led a painting crew and ran door-to-door sales, so I'm used to talking with clients,
            owning a deadline and explaining things plainly. I care about clean architecture and interfaces that explain themselves.
          </p>
          <dl className="build-facts">
            {me.facts.map(([term, text]) => <div key={term}><dt>{term}</dt><dd>{text}</dd></div>)}
          </dl>
          <div className="build-inline-links">
            <a href={resumePdf} download="Anton_Ilin_Resume.pdf">Download my resume</a>
            <Link to="/about#experience">Work experience</Link>
            <Link to="/about#education">Education</Link>
            <Link to="/services">Services</Link>
          </div>
          <div className="build-signoff">
            <Artwork kind="signature" scale={1.06} />
            <span className="build-small">{me.name}, {new Date().getFullYear()}</span>
          </div>
        </div>
      </section>
      <div className="build-records">
        <section className="build-record" id="experience" aria-labelledby="experience-title">
          <h2 className="build-display" id="experience-title">Work experience</h2>
          <ol className="build-record-list">
            {me.experience.map((job) => (
              <Entry key={job.company} dates={job.dates} title={job.role} where={[job.company, job.place].filter(Boolean).join(', ')}>
                <ul className="build-record-points">
                  {job.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </Entry>
            ))}
          </ol>
        </section>
        <section className="build-record" id="education" aria-labelledby="education-title">
          <h2 className="build-display" id="education-title">Education</h2>
          <ol className="build-record-list">
            {me.education.map((item) => (
              <Entry key={item.program} dates={item.dates} title={item.program} where={`${item.credential}, ${item.school}`}>
                <div className="build-record-courses">
                  <p className="build-small">Relevant courses</p>
                  <ul className="build-tags">
                    {item.courses.map((course) => <li key={course}>{course}</li>)}
                  </ul>
                </div>
              </Entry>
            ))}
          </ol>
        </section>
      </div>
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
