import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Artwork from './components/portfolio/Artwork.jsx'
import Cursor from './components/portfolio/Cursor.jsx'
import Opening from './components/portfolio/Opening.jsx'
import Wipe from './components/portfolio/Wipe.jsx'
import './App.css'
import './components/portfolio/portfolio.css'

// Pages designed edge to edge. Every other route gets the centred column used by the older pages.
const screens = new Set(['/', '/projects', '/about', '/contact'])
const isScreen = (pathname) => screens.has(pathname) || pathname.startsWith('/projects/')

// The frame around every page: the dotted backdrop, the top bar, the page itself,
// then the layers that sit over it (page wipe, opening, cursor, progress line).
export default function App() {
  const { pathname, hash, key } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const progress = useRef(null)

  useEffect(() => {
    const update = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 24)
      if (progress.current) progress.current.style.transform = `scaleX(${range > 4 ? Math.min(1, window.scrollY / range) : 0})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname])

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
          <NavLink to="/projects">Work</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>
      <main id="main-content" className={isScreen(pathname) ? 'build-page' : 'site-main build-standard'} tabIndex={-1}>
        <Outlet />
      </main>
      <i ref={progress} className="build-progress" aria-hidden="true" />
      {key !== 'default' && !hash && <Wipe key={key} />}
      <Opening />
      <Cursor />
    </div>
  )
}
