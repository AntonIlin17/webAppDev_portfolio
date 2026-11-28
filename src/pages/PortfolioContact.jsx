import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Artwork from '../components/portfolio/Artwork.jsx'
import me from '../components/portfolio/identity.js'
import { useAuth } from '../context/AuthContext.jsx'

// The contact page: the email address set large beside a reaching hand, and a one-line footer.
export default function PortfolioContact() {
  const { user, logout } = useAuth()
  const [message, setMessage] = useState('')
  const email = useRef(null)

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(me.email)
      setMessage('Address copied')
    } catch {
      email.current.focus()
      setMessage('Select the address to copy it.')
    }
  }

  return (
    <>
      <section className="build-contact" aria-label="Contact">
        <div className="build-contact-copy">
          <p className="build-small">{me.status}</p>
          <h1 className="build-display build-email"><a ref={email} href={`mailto:${me.email}`}>{me.email.split('@')[0]}<wbr />@{me.email.split('@')[1]}</a></h1>
          <p className="build-copy">Write to me about a role, a project, or the cabinet.</p>
          <div className="build-inline-links">
            <button className="build-pill" type="button" onClick={copyAddress}>Copy address</button>
            <Link to="/contact/form">Contact form</Link>
          </div>
          <p className="build-copy-status" role="status">{message}</p>
        </div>
        <Artwork specimen="hand" scale={0.9} className="build-contact-art" />
      </section>
      <footer className="build-footer">
        <span>© {new Date().getFullYear()} {me.name}</span>
        <nav aria-label="Footer">
          <Link to="/projects">Work</Link>
          <Link to="/about">About</Link>
          {user
            ? <><Link to="/dashboard">Dashboard</Link><button type="button" onClick={logout}>Logout</button></>
            : <Link to="/login">Login</Link>}
        </nav>
      </footer>
    </>
  )
}
