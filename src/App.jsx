import { NavLink, Outlet } from 'react-router-dom'
import Logo from './components/Logo/Logo.jsx' 
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="brand">
          <Logo />
        </div>
        <nav className="site-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/education">Education</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        © {new Date().getFullYear()} Anton Ilin
      </footer>
    </div>
  )
}
