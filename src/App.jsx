import { NavLink, Outlet } from 'react-router-dom'
import Logo from './components/Logo/Logo.jsx' 
import './App.css'

export default function App() {
  return (
    <div className="app">
      {/* Site header with logo and primary nav */}
      <header className="site-header">
        <div className="brand">
          <Logo />
        </div>
        <nav className="site-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : undefined)}>About</NavLink>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : undefined)}>Projects</NavLink>
          <NavLink to="/education" className={({ isActive }) => (isActive ? 'active' : undefined)}>Education</NavLink>
          <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : undefined)}>Services</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : undefined)}>Contact</NavLink>
        </nav>
      </header>

      {/* Route outlet renders the active page */}
      <main className="site-main">
        <Outlet />
      </main>

      {/* TODO: personalize if name changes */}
      <footer className="site-footer">
        © {new Date().getFullYear()} Anton Ilin
      </footer>
    </div>
  )
}
