import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Bell, Menu, ShieldCheck, X } from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  return <header className="topbar">
    <Link className="brand" to="/"><span className="brand-mark"><ShieldCheck size={18} /></span><span>se<span>cloudive</span></span></Link>
    <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
      <Link to="/#why" onClick={closeMenu}>Why SeCloudive</Link>
      <Link to="/#domains" onClick={closeMenu}>Domains</Link>
      <NavLink to="/investigations" onClick={closeMenu} className="nav-highlight">Investigations</NavLink>
      <NavLink to="/labs" onClick={closeMenu} className="nav-labs-link">Real Labs & SOPs</NavLink>
      <NavLink to="/playbooks" onClick={closeMenu} className="nav-playbooks-link">Job Playbooks</NavLink>
      <NavLink to="/categories" onClick={closeMenu}>Challenges</NavLink>
      <NavLink to="/internship-simulator" onClick={closeMenu}>SOC On-Call</NavLink>
      <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
      <NavLink to="/report" onClick={closeMenu}>Report</NavLink>
      <NavLink to="/about" onClick={closeMenu}>About</NavLink>
    </nav>
    <div className="nav-actions"><button className="icon-button" aria-label="Notifications"><Bell size={17} /></button><div className="avatar" aria-label="User profile">JD</div><button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
  </header>
}
