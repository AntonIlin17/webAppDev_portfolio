import { useEffect, useLayoutEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Artwork from './components/portfolio/Artwork.jsx'
import projects from './pages/projectData.js'
import './App.css'
import './components/portfolio/portfolio.css'

const screens = new Set(['/', '/projects', '/about', '/contact'])

export default function App() {
  const { pathname, hash, key } = useLocation()
  const [specimen, setSpecimen] = useState('orchid')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useLayoutEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return (
    <div className="build-app">
      <a className="build-skip" href="#main-content">Skip to content</a>
      <Artwork kind="horizon" className="build-horizon" />
      <header className={`build-nav${scrolled ? ' build-nav--scrolled' : ''}`}>
        <Link to="/" className="build-mark" aria-label="Anton Ilin, home">
          <span aria-hidden="true" /><span aria-hidden="true" />
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/projects">Work <small>{projects.length}</small></NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>
      <main id="main-content" className={screens.has(pathname) ? 'build-page' : 'site-main build-standard'} tabIndex={-1}>
        <Outlet context={{ specimen, setSpecimen }} />
      </main>
      {key !== 'default' && !hash && <span key={key} className="build-wipe" aria-hidden="true" />}
    </div>
  )
}
