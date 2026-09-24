import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { 
  ShieldCheck, 
  ChevronDown, 
  Terminal, 
  Layers, 
  FolderGit2, 
  Skull, 
  Briefcase, 
  Bell, 
  Menu, 
  X, 
  ArrowRight,
  ShieldAlert,
  Radio,
  FileCode2,
  Compass,
  GraduationCap
} from 'lucide-react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null) // 'simulations' | 'handson' | 'curriculum' | null
  const location = useLocation()
  const navRef = useRef(null)

  const closeMenu = () => {
    setMenuOpen(false)
    setActiveDropdown(null)
  }

  // Close dropdown on outside click or location change
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setActiveDropdown(null)
    setMenuOpen(false)
  }, [location.pathname])

  const toggleDropdown = (name) => {
    setActiveDropdown(prev => prev === name ? null : name)
  }

  const isSimulationsActive = ['/investigations', '/battle-rooms', '/internship-simulator'].some(p => location.pathname.startsWith(p))
  const isHandsOnActive = ['/labs', '/playbooks', '/projects'].some(p => location.pathname.startsWith(p))
  const isCurriculumActive = ['/categories', '/architecture-reviews', '/challenge', '/ramp-up'].some(p => location.pathname.startsWith(p))

  return (
    <header className="topbar clean-topbar" ref={navRef}>
      {/* Brand Logo */}
      <Link className="brand" to="/" onClick={closeMenu}>
        <span className="brand-mark">
          <ShieldCheck size={18} />
        </span>
        <span className="brand-text">
          se<span>cloudive</span>
        </span>
      </Link>

      {/* Primary Clean Navigation */}
      <nav className={`nav-links clean-nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
        {/* Dropdown 1: Simulations */}
        <div className="nav-dropdown-wrapper">
          <button 
            type="button" 
            className={`nav-dropdown-trigger ${isSimulationsActive ? 'active' : ''} ${activeDropdown === 'simulations' ? 'is-open' : ''}`}
            onClick={() => toggleDropdown('simulations')}
            aria-expanded={activeDropdown === 'simulations'}
          >
            <span>Simulations</span>
            <ChevronDown size={14} className="dropdown-caret" />
          </button>

          {activeDropdown === 'simulations' && (
            <div className="nav-dropdown-menu">
              <NavLink to="/battle-rooms" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-rose">
                  <Skull size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Battle Rooms (CTF)</span>
                    <span className="badge-pill badge-rose">THM/HTB</span>
                  </div>
                  <p>Red vs Blue team offensive cloud exploits & CTF flag verification.</p>
                </div>
              </NavLink>

              <NavLink to="/investigations" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-cyan">
                  <ShieldAlert size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Incident Simulator</span>
                    <span className="badge-pill badge-cyan">25 Tickets</span>
                  </div>
                  <p>Triage raw evidence, assess blast radius, and execute containment.</p>
                </div>
              </NavLink>

              <NavLink to="/internship-simulator" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-amber">
                  <Radio size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>SOC On-Call Rotation</span>
                    <span className="badge-pill badge-amber">Internship</span>
                  </div>
                  <p>Experience realistic weekly shift incidents and on-call paging.</p>
                </div>
              </NavLink>
            </div>
          )}
        </div>

        {/* Dropdown 2: Hands-On Labs */}
        <div className="nav-dropdown-wrapper">
          <button 
            type="button" 
            className={`nav-dropdown-trigger ${isHandsOnActive ? 'active' : ''} ${activeDropdown === 'handson' ? 'is-open' : ''}`}
            onClick={() => toggleDropdown('handson')}
            aria-expanded={activeDropdown === 'handson'}
          >
            <span>Hands-On Labs</span>
            <ChevronDown size={14} className="dropdown-caret" />
          </button>

          {activeDropdown === 'handson' && (
            <div className="nav-dropdown-menu">
              <NavLink to="/labs" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-sky">
                  <Terminal size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>16 Enterprise SOP Labs</span>
                    <span className="badge-pill badge-sky">Dual CLI/GUI</span>
                  </div>
                  <p>Step-by-step AWS CLI & Console runbooks with simulated CloudShell.</p>
                </div>
              </NavLink>

              <NavLink to="/playbooks" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-purple">
                  <FileCode2 size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Job Playbook Engine</span>
                    <span className="badge-pill badge-purple">7-Stage SOP</span>
                  </div>
                  <p>From Scratch to Solved: GuardDuty alerts to Athena SQL & Terraform.</p>
                </div>
              </NavLink>

              <NavLink to="/projects" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-emerald">
                  <FolderGit2 size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Portfolio Projects ($0)</span>
                    <span className="badge-pill badge-emerald">Free Tier</span>
                  </div>
                  <p>Build 4 resume-ready security architectures with zero AWS billing.</p>
                </div>
              </NavLink>
            </div>
          )}
        </div>

        {/* Dropdown 3: Curriculum */}
        <div className="nav-dropdown-wrapper">
          <button 
            type="button" 
            className={`nav-dropdown-trigger ${isCurriculumActive ? 'active' : ''} ${activeDropdown === 'curriculum' ? 'is-open' : ''}`}
            onClick={() => toggleDropdown('curriculum')}
            aria-expanded={activeDropdown === 'curriculum'}
          >
            <span>Curriculum</span>
            <ChevronDown size={14} className="dropdown-caret" />
          </button>

          {activeDropdown === 'curriculum' && (
            <div className="nav-dropdown-menu nav-dropdown-sm">
              <NavLink to="/ramp-up" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-emerald">
                  <GraduationCap size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Career Ramp-Up & All Labs</span>
                    <span className="badge-pill badge-emerald">20 Labs</span>
                  </div>
                  <p>All cloud roles, TryHackMe, HackTheBox & Foundations guides.</p>
                </div>
              </NavLink>

              <NavLink to="/categories" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-cyan">
                  <Compass size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Scenario Catalog</span>
                  </div>
                  <p>5 domains: IAM, S3, Networking, Monitoring, Architecture.</p>
                </div>
              </NavLink>

              <NavLink to="/architecture-reviews" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-purple">
                  <Layers size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Architecture Reviews</span>
                  </div>
                  <p>Multi-finding blueprint risk analysis and threat modeling.</p>
                </div>
              </NavLink>
            </div>
          )}
        </div>

        {/* Direct Links */}
        <NavLink to="/dashboard" onClick={closeMenu} className="clean-nav-link">
          Dashboard
        </NavLink>

        <NavLink to="/about" onClick={closeMenu} className="clean-nav-link">
          Career Hub
        </NavLink>

        <NavLink to="/report" onClick={closeMenu} className="clean-nav-link">
          Report
        </NavLink>
      </nav>

      {/* Right Action Bar */}
      <div className="nav-actions">
        <Link to="/battle-rooms" className="btn-launch-sm" onClick={closeMenu}>
          <Skull size={13} className="text-rose" />
          <span>Battle Arena</span>
        </Link>

        <Link to="/dashboard" className="avatar-badge" title="SOC Security Analyst">
          <span className="avatar-initials">SOC</span>
          <span className="live-dot" />
        </Link>

        <button 
          className="menu-toggle" 
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} 
          aria-expanded={menuOpen} 
          onClick={() => setMenuOpen(open => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  )
}
