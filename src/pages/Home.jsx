import { Link, useLocation } from 'react-router-dom'
import Artwork from '../components/portfolio/Artwork.jsx'
import me from '../components/portfolio/identity.js'

// The landing page: one large dithered orchid with the name set across it.
export default function Home() {
  const { state } = useLocation()

  return (
    <section className="build-monolith">
      <Artwork specimen="orchid" scale={1.1} className="build-hero-art" />
      <h1 className="build-display build-name"><span>Anton</span>{' '}<span>Ilin</span></h1>
      <p className="build-byline">{me.role},<br />{me.school}, {me.place}</p>
      <Link className="build-pill build-hero-link" to="/projects">See the work</Link>
      {state?.submittedName && <p className="build-contact-success" role="status">
        Thanks, <strong>{state.submittedName}</strong>! Your message was captured and I&apos;ll get back to you soon.
      </p>}
    </section>
  )
}
