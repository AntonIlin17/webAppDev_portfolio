import { useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import Artwork from '../components/portfolio/Artwork.jsx'
import me from '../components/portfolio/identity.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function PortfolioContact() {
  const { specimen, setSpecimen } = useOutletContext()
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
      <footer className="build-colophon">
        <div className="build-specimens" aria-label="Change the landing illustration">
          {me.elements.map(([id, name]) => (
            <button key={id} type="button" title={name} aria-label={name} aria-pressed={id === specimen} onClick={() => setSpecimen(id)}>
              <img src={`/build-art/${id}-thumb.webp`} alt="" loading="lazy" width="60" height="60" />
            </button>
          ))}
        </div>
        <div className="build-colophon-row">
          <div>
            <p>Pick an element to change the landing illustration.</p>
            <div className="build-inline-links">
              {user ? <><Link to="/dashboard">Dashboard</Link><button type="button" onClick={logout}>Logout</button></> : <Link to="/login">Login</Link>}
            </div>
          </div>
          <div className="build-signoff">
            <Artwork kind="signature" scale={1.06} />
            <span className="build-small">{me.name}, {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
