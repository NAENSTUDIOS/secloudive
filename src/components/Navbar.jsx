// ==============================================================================
// SeCloudive Navbar - Structured Navigation Redesign
// Clean, Uncluttered, Purpose-Driven Navigation Hierarchy
// ==============================================================================

import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'
import SyncStatusBadge from './SyncStatusBadge'
import SeCloudiveLogo from './SeCloudiveLogo'
import { 
  ShieldCheck, 
  ChevronDown, 
  Terminal, 
  Layers, 
  FolderGit2, 
  Skull, 
  Briefcase, 
  Menu, 
  X, 
  ArrowRight,
  ShieldAlert,
  Radio,
  FileCode2,
  Compass,
  GraduationCap,
  BookOpen,
  Sparkles,
  Download,
  Calculator,
  Search,
  Award,
  Volume2,
  VolumeX,
  Zap,
  Trophy,
  CheckCircle2,
  LogIn,
  FileText,
  Maximize
} from 'lucide-react'
import { isAudioFXEnabled, setAudioFXEnabled, playTactileClick } from '../utils/cyberMotionAudio'
import { masterRampUpLabs } from '../data/careerRampUpData'
import { investigations } from '../data/investigations'
import { battleRooms } from '../data/battleRooms'
import GeminiKeyManagerModal from './GeminiKeyManagerModal.jsx'

export default function Navbar() {
  const { 
    completedMasterActivities = 0, 
    totalMasterActivities = 50, 
    masterProgressPercent = 0, 
    masterTotalXP = 0,
    activeProfile,
    clearance,
    sandboxMode
  } = useChallenges() || {}

  const [menuOpen, setMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null) // 'pathway' | 'handson' | 'career' | null
  const [audioEnabled, setAudioEnabled] = useState(() => isAudioFXEnabled())
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useRef(null)

  const closeMenu = () => {
    setMenuOpen(false)
    setActiveDropdown(null)
  }

  // Close dropdown on outside click
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
    playTactileClick()
    setActiveDropdown(prev => prev === name ? null : name)
  }

  const isPathwayActive = ['/learning', '/roadmap', '/categories', '/ramp-up', '/rampup', '/career-rampup', '/career-ramp-up'].some(p => location.pathname.startsWith(p))
  const isHandsOnActive = ['/labs', '/battle-rooms', '/investigations', '/cloudive-studio', '/cost-calculator', '/zero-cost-labs', '/projects', '/architecture-reviews', '/live-portal'].some(p => location.pathname.startsWith(p))
  const isCareerActive = ['/internship-simulator', '/interview-simulator', '/interview', '/hiring-simulator', '/verify-audit-pack', '/verify-pack', '/verify', '/downloads', '/about', '/report', '/playbooks', '/live-internships'].some(p => location.pathname.startsWith(p))

  return (
    <header className="topbar clean-topbar" ref={navRef}>
      {/* Brand Logo */}
      <Link className="brand" to="/" onClick={closeMenu} aria-label="SeCloudive Home">
        <span className="brand-mark">
          <ShieldCheck size={18} />
        </span>
        <SeCloudiveLogo size="sm" variant="two-tone" glow={true} />
        <span
          className="brand-pill-naen"
          style={{
            marginLeft: '6px',
            padding: '2px 7px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(217, 119, 6, 0.28) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            borderRadius: '999px',
            color: '#fbbf24',
            fontSize: '0.62rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.15)'
          }}
        >
          BY NAEN STUDIOS
        </span>
      </Link>

      {/* Primary Clean Navigation */}
      <nav className={`nav-links clean-nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
        {/* Mobile Drawer Live Progress Quick Card */}
        <div className="mobile-progress-drawer-card mobile-only-block">
          <div className="mobile-progress-header">
            <div className="mobile-progress-title">
              <span className="nav-progress-dot" aria-hidden="true" />
              <span>Security Training Progress</span>
            </div>
            <span className="mobile-progress-score">{masterProgressPercent}%</span>
          </div>
          <div className="mobile-progress-bar-track">
            <div className="mobile-progress-bar-fill" style={{ width: `${masterProgressPercent}%` }} />
          </div>
          <div className="mobile-progress-meta">
            <span><strong>{completedMasterActivities}</strong> / {totalMasterActivities} Completed</span>
            <span><strong>{masterTotalXP}</strong> XP</span>
          </div>
          <Link to="/dashboard" onClick={closeMenu} className="btn-mobile-drawer-dashboard">
            Open SOC Readiness Dashboard <ArrowRight size={14} />
          </Link>
          {Boolean(activeProfile?.isGuest || !activeProfile?.id || activeProfile?.id === 'guest') ? (
            <button
              type="button"
              onClick={() => {
                closeMenu()
                playTactileClick()
                window.dispatchEvent(new CustomEvent('open-user-sync-modal'))
              }}
              style={{
                marginTop: '10px',
                width: '100%',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.35) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.55)',
                color: '#38bdf8',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <LogIn size={14} />
              <span>Sign In / Claim Unique ID</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                closeMenu()
                playTactileClick()
                window.dispatchEvent(new CustomEvent('open-user-sync-modal'))
              }}
              style={{
                marginTop: '10px',
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={14} />
              <span>Account: {activeProfile?.id}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              closeMenu()
              playTactileClick()
              window.dispatchEvent(new CustomEvent('open-welcome-modal'))
            }}
            style={{
              marginTop: '6px',
              width: '100%',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#7dd3fc',
              borderRadius: '8px',
              padding: '7px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={13} className="text-cyan animate-pulse" />
            <span>Welcome Tour & Platform Guide</span>
          </button>
        </div>

        {/* 1. Learning Plans & Curriculum */}
        <div className="nav-dropdown-wrapper">
          <button 
            type="button" 
            className={`nav-dropdown-trigger ${isPathwayActive ? 'active' : ''} ${activeDropdown === 'pathway' ? 'is-open' : ''}`}
            onClick={() => toggleDropdown('pathway')}
            aria-expanded={activeDropdown === 'pathway'}
          >
            <BookOpen size={14} style={{ color: '#38bdf8' }} />
            <span>Course Catalog</span>
            <ChevronDown size={14} className="dropdown-caret" />
          </button>
          {activeDropdown === 'pathway' && (
            <div className="nav-dropdown-menu">
              <NavLink to="/learning" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-cyan"><Layers size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Learning Plans</span></div>
                  <p>Structured curriculum from Foundation to Architecture.</p>
                </div>
              </NavLink>
              <NavLink to="/ramp-up" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-emerald"><GraduationCap size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Career Ramp-Up Guides</span></div>
                  <p>Role-based study plans and official certification prep.</p>
                </div>
              </NavLink>
              <NavLink to="/roadmap" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-sky"><Compass size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Full Progression Roadmap</span></div>
                  <p>Visualize your path to Enterprise Cloud Security.</p>
                </div>
              </NavLink>
              <NavLink to="/categories" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-amber"><Layers size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Security Domain Categories</span></div>
                  <p>Deep-dive into all 8 core AWS Security domains.</p>
                </div>
              </NavLink>
            </div>
          )}
        </div>

        {/* 2. Hands-on Labs & Builder Arena */}
        <div className="nav-dropdown-wrapper">
          <button 
            type="button" 
            className={`nav-dropdown-trigger ${isHandsOnActive ? 'active' : ''} ${activeDropdown === 'handson' ? 'is-open' : ''}`}
            onClick={() => toggleDropdown('handson')}
            aria-expanded={activeDropdown === 'handson'}
          >
            <Terminal size={14} style={{ color: '#10b981' }} />
            <span>Hands-on Labs</span>
            <ChevronDown size={14} className="dropdown-caret" />
          </button>
          {activeDropdown === 'handson' && (
            <div className="nav-dropdown-menu">
              <NavLink to="/labs" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-sky"><Terminal size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Builder Labs ($0 Cost)</span></div>
                  <p>Step-by-step production builds in your own AWS account.</p>
                </div>
              </NavLink>
              <NavLink to="/cost-calculator" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-emerald"><Calculator size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>$0 Cost Lab Calculator</span></div>
                  <p>AWS Free-Tier safety limits & teardown audit trails.</p>
                </div>
              </NavLink>
              <NavLink to="/architecture-reviews" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-cyan"><ShieldCheck size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Architecture Reviews</span></div>
                  <p>AWS Well-Architected defense & blast radius triage.</p>
                </div>
              </NavLink>
              <NavLink to="/battle-rooms" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-rose"><Skull size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Threat Battle Rooms</span></div>
                  <p>Live combat scenarios and attack simulations.</p>
                </div>
              </NavLink>
              <NavLink to="/investigations" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-cyan"><ShieldAlert size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>SOC Investigations</span></div>
                  <p>Triage raw forensic evidence and contain blasts.</p>
                </div>
              </NavLink>
              <NavLink to="/projects" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-purple"><FolderGit2 size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Portfolio Projects</span></div>
                  <p>Enterprise-grade architectures for your resume.</p>
                </div>
              </NavLink>
              <NavLink to="/cloudive-studio" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-amber"><Sparkles size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Cloudive Studio</span></div>
                  <p>Interactive threat modeling & topology workbench.</p>
                </div>
              </NavLink>
            </div>
          )}
        </div>

        {/* 3. Job Readiness & Playbooks */}
        <div className="nav-dropdown-wrapper">
          <button 
            type="button" 
            className={`nav-dropdown-trigger ${isCareerActive ? 'active' : ''} ${activeDropdown === 'career' ? 'is-open' : ''}`}
            onClick={() => toggleDropdown('career')}
            aria-expanded={activeDropdown === 'career'}
          >
            <Briefcase size={14} style={{ color: '#f59e0b' }} />
            <span>Job Readiness</span>
            <ChevronDown size={14} className="dropdown-caret" />
          </button>
          {activeDropdown === 'career' && (
            <div className="nav-dropdown-menu">
              <NavLink to="/playbooks" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-cyan"><Briefcase size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Job Playbooks (SOPs)</span></div>
                  <p>Daily workflow routines and engineering manuals.</p>
                </div>
              </NavLink>
              <NavLink to="/interview-simulator" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-purple"><Sparkles size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>AI Interview Simulator</span></div>
                  <p>Mock interviews for 5 different cloud roles.</p>
                </div>
              </NavLink>
              <NavLink to="/internship-simulator" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-amber"><Radio size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>On-Call Simulator</span></div>
                  <p>Simulate on-call shifts and incident paging.</p>
                </div>
              </NavLink>
              <NavLink to="/live-internships" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-emerald"><Award size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Live Internships & Jobs</span></div>
                  <p>Verified cloud security roles & hiring pipelines.</p>
                </div>
              </NavLink>
              <NavLink to="/threat-intel" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-rose"><ShieldAlert size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Live Threat Radar & CVEs</span></div>
                  <p>Real-time vulnerability feeds & threat telemetry.</p>
                </div>
              </NavLink>
              <NavLink to="/downloads" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-sky"><Download size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Free Resource Packs</span></div>
                  <p>Cheat sheets, checklists, and study guides.</p>
                </div>
              </NavLink>
              <NavLink to="/verify-audit-pack" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-emerald"><ShieldCheck size={16} /></div>
                <div className="item-copy">
                  <div className="item-title"><span>Verify Audit Dossier</span></div>
                  <p>Cryptographic proof verification for employers.</p>
                </div>
              </NavLink>
            </div>
          )}
        </div>

        {/* 4. Direct Link: Dashboard */}
        <NavLink to="/dashboard" onClick={closeMenu} className="clean-nav-link" style={{ fontWeight: 700 }}>
          My Dashboard
        </NavLink>

        {/* 5. Admin Portal (Only visible to NAEN Studios) */}
        {activeProfile?.email === 'naenstudios@gmail.com' && (
          <NavLink 
            to="/admin" 
            onClick={closeMenu} 
            className="clean-nav-link" 
            style={{ 
              fontWeight: 800, 
              color: '#f59e0b',
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            Admin Portal
          </NavLink>
        )}
      </nav>

      {/* ── Right Action Controls: Clean, Uncluttered, Purpose-Driven ── */}
      <div className="nav-actions">
        {/* Search Trigger */}
        <button 
          type="button"
          className="nav-search-trigger-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          title="Global Search (Ctrl+/)"
          aria-label="Search"
        >
          <Search size={14} />
          <span className="nav-search-text">Search</span>
          <kbd className="nav-search-kbd">Ctrl+/</kbd>
        </button>

        {/* Welcome Onboarding Tour Trigger */}
        <button 
          type="button"
          className="nav-welcome-trigger-btn"
          onClick={() => {
            playTactileClick()
            window.dispatchEvent(new CustomEvent('open-welcome-modal', { detail: { step: 'welcome' } }))
          }}
          title="Open Welcome Onboarding & Architecture Tour"
          aria-label="Welcome Tour"
          style={{
            background: 'rgba(255, 153, 0, 0.12)',
            border: '1px solid rgba(255, 153, 0, 0.4)',
            color: '#fbbf24',
            borderRadius: '8px',
            padding: '6px 11px',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={13} style={{ color: '#ff9900' }} />
          <span>Welcome Tour</span>
        </button>

        {/* Single Unified Student Identity Pill */}
        {Boolean(activeProfile?.isGuest || !activeProfile?.id || activeProfile?.id === 'guest') ? (
          <button
            type="button"
            className="btn-nav-signin-pill"
            onClick={() => {
              playTactileClick()
              window.dispatchEvent(new CustomEvent('open-user-sync-modal'))
            }}
            title="Sign in with Email, User ID, or Google"
            aria-label="Student Sign In"
            style={{
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.35) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.55)',
              color: '#38bdf8',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 0 14px rgba(56, 189, 248, 0.2)',
              letterSpacing: '0.3px',
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn size={13} />
            <span>Student Sign In</span>
          </button>
        ) : (
          <SyncStatusBadge />
        )}

        {/* 🌟 Dynamic Primary Action: "Start Tier 1" or "Resume" */}
        <Link 
          to={completedMasterActivities === 0 ? "/learning/foundations/linux-fundamentals" : "/dashboard"}
          className="btn-primary-nav-cta"
          onClick={() => playTactileClick()}
          style={{
            background: completedMasterActivities === 0 
              ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' 
              : 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)'
          }}
        >
          {completedMasterActivities === 0 ? (
            <><span>▶ Start Tier 1</span></>
          ) : (
            <><span>▶ Resume ({masterProgressPercent}%)</span></>
          )}
        </Link>

        {/* User Avatar */}
        <button 
          type="button"
          className="avatar-badge" 
          onClick={() => window.dispatchEvent(new CustomEvent('open-user-sync-modal'))}
          title={activeProfile?.authProvider === 'google' 
            ? `Google ID Synced: ${activeProfile?.email || activeProfile?.name}\nUser ID: ${activeProfile?.id}\nClick to manage.`
            : `Active Profile: ${activeProfile?.name || 'Guest'}\nClick to sign in with Google or switch User ID.`}
          style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0, position: 'relative' }}
        >
          {activeProfile?.avatarUrl ? (
            <img 
              src={activeProfile.avatarUrl} 
              alt={activeProfile.name || 'User'} 
              style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid #38bdf8' }}
            />
          ) : (
            <span className="avatar-initials" style={{ color: activeProfile?.avatarColor || '#38bdf8' }}>
              {(activeProfile?.name || 'SOC').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          )}
          <span 
            className="live-dot" 
            style={{ 
              background: activeProfile?.authProvider === 'google' ? '#34a853' : '#38bdf8',
              boxShadow: activeProfile?.authProvider === 'google' ? '0 0 6px #34a853' : '0 0 6px #38bdf8'
            }} 
          />
        </button>

        {/* Mobile Hamburger Toggle */}
        <button 
          className="menu-toggle" 
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} 
          aria-expanded={menuOpen} 
          onClick={() => setMenuOpen(open => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Gemini Key Manager Modal */}
      <GeminiKeyManagerModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />
    </header>
  )
}
