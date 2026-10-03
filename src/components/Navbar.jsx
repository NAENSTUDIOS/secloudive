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
  LogIn
} from 'lucide-react'
import { isAudioFXEnabled, setAudioFXEnabled, playTactileClick } from '../utils/cyberMotionAudio'
import { masterRampUpLabs } from '../data/careerRampUpData'
import { investigations } from '../data/investigations'
import { battleRooms } from '../data/battleRooms'

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

  const isPathwayActive = ['/learning', '/roadmap', '/categories'].some(p => location.pathname.startsWith(p))
  const isHandsOnActive = ['/labs', '/battle-rooms', '/investigations', '/cloudive-studio', '/cost-calculator', '/zero-cost-labs'].some(p => location.pathname.startsWith(p))
  const isCareerActive = ['/internship-simulator', '/interview-simulator', '/verify-audit-pack', '/verify-pack', '/downloads', '/about', '/report'].some(p => location.pathname.startsWith(p))

  return (
    <header className="topbar clean-topbar" ref={navRef}>
      {/* Brand Logo */}
      <Link className="brand" to="/" onClick={closeMenu} aria-label="SeCloudive Home">
        <span className="brand-mark">
          <ShieldCheck size={18} />
        </span>
        <SeCloudiveLogo size="sm" variant="two-tone" glow={true} />
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

        {/* ── Dropdown 1: 🎯 Structured Learning Path ── */}
        <div className="nav-dropdown-wrapper">
          <button 
            type="button" 
            className={`nav-dropdown-trigger ${isPathwayActive ? 'active' : ''} ${activeDropdown === 'pathway' ? 'is-open' : ''}`}
            onClick={() => toggleDropdown('pathway')}
            aria-expanded={activeDropdown === 'pathway'}
          >
            <Compass size={14} style={{ color: '#38bdf8' }} />
            <span>Structured Path</span>
            <ChevronDown size={14} className="dropdown-caret" />
          </button>

          {activeDropdown === 'pathway' && (
            <div className="nav-dropdown-menu">
              {/* Tier 1 */}
              <NavLink to="/learning/foundations/linux-fundamentals" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-cyan">
                  <span>🛠️</span>
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Tier 1: The Core Toolbox</span>
                    <span className="badge-pill badge-sky">Start Here</span>
                  </div>
                  <p>Linux, Bash, Python scripting & Git — zero-to-cloud foundations.</p>
                </div>
              </NavLink>

              {/* Tier 2 */}
              <NavLink to="/learning/foundations/docker-container-security" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-emerald">
                  <span>📦</span>
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Tier 2: The Deployment Layer</span>
                    <span className="badge-pill badge-emerald">Deploy</span>
                  </div>
                  <p>Docker, Cloud Primitives, Terraform IaC & Networking fundamentals.</p>
                </div>
              </NavLink>

              {/* Tier 3 */}
              <NavLink to="/learning/foundations/kubernetes-container-orchestration" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-purple">
                  <span>⚡</span>
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Tier 3: The Scaling Layer</span>
                    <span className="badge-pill badge-purple">Scale</span>
                  </div>
                  <p>Kubernetes, CI/CD pipelines, Observability & Security hardening.</p>
                </div>
              </NavLink>

              {/* Tier 4 */}
              <NavLink to="/learning/architecture/multicloud-strategy-portability" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-amber">
                  <span>🏛️</span>
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Tier 4: The Architecture Layer</span>
                    <span className="badge-pill badge-amber">Mastery</span>
                  </div>
                  <p>Multi-Cloud, FinOps, Zero Trust & HA/DR enterprise architecture.</p>
                </div>
              </NavLink>

              {/* Divider */}
              <div style={{ margin: '6px 14px', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

              <NavLink to="/roadmap" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-sky">
                  <Compass size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Full 4-Tier Progression Roadmap</span>
                  </div>
                  <p>Complete sequential pathway from recruit to enterprise architect.</p>
                </div>
              </NavLink>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  closeMenu()
                  window.dispatchEvent(new CustomEvent('open-diagnostic-placement'))
                }}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <div className="item-icon-box text-amber">
                  <Zap size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Take 2-Min Tier Placement Diagnostic</span>
                    <span className="badge-pill badge-amber">Skip Ahead</span>
                  </div>
                  <p>Benchmark skills and fast-track to Tier 2 or 3 directly.</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* ── Dropdown 2: 🛡️ Hands-On Arena ── */}
        <div className="nav-dropdown-wrapper">
          <button 
            type="button" 
            className={`nav-dropdown-trigger ${isHandsOnActive ? 'active' : ''} ${activeDropdown === 'handson' ? 'is-open' : ''}`}
            onClick={() => toggleDropdown('handson')}
            aria-expanded={activeDropdown === 'handson'}
          >
            <Terminal size={14} style={{ color: '#10b981' }} />
            <span>Hands-On Arena</span>
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
                    <span>{masterRampUpLabs?.length || 20} AWS Safe Labs ($0)</span>
                    <span className="badge-pill badge-sky">Dual CLI/GUI</span>
                  </div>
                  <p>Step-by-step production runbooks with $0 Free-Tier guarantee.</p>
                </div>
              </NavLink>

              <NavLink to="/battle-rooms" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-rose">
                  <Skull size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Purple Team Battle Rooms</span>
                    <span className="badge-pill badge-rose">{battleRooms?.length || 10} Rooms</span>
                  </div>
                  <p>Live combat attack scenarios, terminal shell, and CTF flags.</p>
                </div>
              </NavLink>

              <NavLink to="/investigations" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-cyan">
                  <ShieldAlert size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>SOC Incident Simulator</span>
                    <span className="badge-pill badge-cyan">{investigations?.length || 25} Tickets</span>
                  </div>
                  <p>Triage raw forensic evidence, assess blast radius, and contain.</p>
                </div>
              </NavLink>

              <NavLink to="/cloudive-studio" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-cyan">
                  <Layers size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Cloudive Builder Studio</span>
                    <span className="badge-pill badge-cyan">IaC Linter</span>
                  </div>
                  <p>Builder vs Defender canvas, Terraform auto-fixer, and FinOps.</p>
                </div>
              </NavLink>

              <NavLink to="/cost-calculator" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-emerald">
                  <Calculator size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>$0 Free-Tier Lab Calculator</span>
                    <span className="badge-pill badge-emerald">Tripwires</span>
                  </div>
                  <p>Automatic $0.01 billing alarms and teardown bash scripts.</p>
                </div>
              </NavLink>
            </div>
          )}
        </div>

        {/* ── Dropdown 3: 💼 Career & Proof ── */}
        <div className="nav-dropdown-wrapper">
          <button 
            type="button" 
            className={`nav-dropdown-trigger ${isCareerActive ? 'active' : ''} ${activeDropdown === 'career' ? 'is-open' : ''}`}
            onClick={() => toggleDropdown('career')}
            aria-expanded={activeDropdown === 'career'}
          >
            <Briefcase size={14} style={{ color: '#f59e0b' }} />
            <span>Career Hub</span>
            <ChevronDown size={14} className="dropdown-caret" />
          </button>

          {activeDropdown === 'career' && (
            <div className="nav-dropdown-menu nav-dropdown-sm">
              <NavLink to="/internship-simulator" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-amber">
                  <Radio size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>SOC On-Call Internship</span>
                    <span className="badge-pill badge-amber">Experience</span>
                  </div>
                  <p>Simulated on-call shifts, incident paging, and manager review.</p>
                </div>
              </NavLink>

              <NavLink to="/interview-simulator" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-purple">
                  <Sparkles size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Interview Simulator</span>
                    <span className="badge-pill badge-purple">AI Mock</span>
                  </div>
                  <p>Practice technical defense questions across 5 cloud roles.</p>
                </div>
              </NavLink>

              <NavLink to="/verify-audit-pack" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-emerald">
                  <Award size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Verified Audit Pack Proof</span>
                    <span className="badge-pill badge-emerald">HMAC-SHA256</span>
                  </div>
                  <p>Cryptographically sealed dossier for LinkedIn and employers.</p>
                </div>
              </NavLink>

              <NavLink to="/downloads" className="dropdown-item" onClick={closeMenu}>
                <div className="item-icon-box text-sky">
                  <Download size={16} />
                </div>
                <div className="item-copy">
                  <div className="item-title">
                    <span>Free Career Packs (15 Packs)</span>
                  </div>
                  <p>Cheatsheets, checklists, and interview study guides.</p>
                </div>
              </NavLink>
            </div>
          )}
        </div>

        {/* ── Direct Link: Dashboard ── */}
        <NavLink to="/dashboard" onClick={closeMenu} className="clean-nav-link" style={{ fontWeight: 700 }}>
          SOC Dashboard
        </NavLink>
      </nav>

      {/* ── Right Action Controls ── */}
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

        {/* NAEN AI Co-Pilot */}
        <button 
          type="button"
          className="nav-naen-ai-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('open-naen-ai'))}
          title="Open NAEN AI Assistant (Ctrl+K)"
          aria-label="Open NAEN AI"
        >
          <Sparkles size={13} className="text-cyan animate-pulse" />
          <span className="nav-naen-text">NAEN AI</span>
        </button>

        {/* Cyber Audio FX Toggle */}
        <button 
          type="button"
          className={`audio-fx-toggle ${audioEnabled ? 'is-active' : ''}`}
          onClick={() => {
            const next = !audioEnabled
            setAudioEnabled(next)
            setAudioFXEnabled(next)
            if (next) playTactileClick()
          }}
          title={audioEnabled ? 'Cyber Audio Feedback Active (Click to Mute)' : 'Cyber Audio Feedback Muted'}
          aria-label="Toggle audio effects"
        >
          {audioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>{audioEnabled ? 'FX' : 'MUTE'}</span>
        </button>

        {/* Welcome Onboarding Trigger */}
        <button
          type="button"
          className="btn-launch-sm"
          onClick={() => {
            closeMenu()
            playTactileClick()
            window.dispatchEvent(new CustomEvent('open-welcome-modal'))
          }}
          title="Platform Welcome & Identity Guide"
          aria-label="Welcome Guide"
          style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '0.76rem',
            fontWeight: 700
          }}
        >
          <Sparkles size={12} className="text-cyan animate-pulse" />
          <span>Tour</span>
        </button>

        {/* Leaderboard Trigger */}
        <button
          type="button"
          className="btn-launch-sm"
          onClick={() => {
            closeMenu()
            window.dispatchEvent(new CustomEvent('open-leaderboard-modal'))
          }}
          title="Open Weekly Sprint Leaderboard & XP Store"
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: '#fbbf24',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '0.76rem',
            fontFamily: 'monospace'
          }}
        >
          <Trophy size={13} className="text-amber" />
          <span>Sprint</span>
        </button>

        {/* User Sync Status Badge (Google ID / Unique User ID) */}
        <SyncStatusBadge />

        {/* Dedicated Sign In Pill when in Guest Mode */}
        {Boolean(activeProfile?.isGuest || !activeProfile?.id || activeProfile?.id === 'guest') && (
          <button
            type="button"
            className="btn-nav-signin-pill"
            onClick={() => {
              playTactileClick()
              window.dispatchEvent(new CustomEvent('open-user-sync-modal'))
            }}
            title="Sign in with Google, Email, or Unique User ID"
            aria-label="Sign in to your account"
            style={{
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(14, 165, 233, 0.3) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.55)',
              color: '#38bdf8',
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.18)',
              letterSpacing: '0.3px',
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn size={13} />
            <span>Sign In</span>
          </button>
        )}

        {/* Live Tier Clearance Badge */}
        {clearance && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontFamily: "'DM Mono', monospace",
              fontWeight: 700,
              border: `1px solid ${sandboxMode ? 'rgba(245,158,11,0.5)' : 'rgba(56,189,248,0.4)'}`,
              background: sandboxMode ? 'rgba(245,158,11,0.1)' : 'rgba(56,189,248,0.08)',
              color: sandboxMode ? '#fbbf24' : '#38bdf8',
              whiteSpace: 'nowrap',
              letterSpacing: '0.5px'
            }}
            title={sandboxMode ? 'Sandbox Mode: All tiers unlocked' : `Current clearance: ${clearance.tierName}`}
          >
            {sandboxMode ? '🔓 SANDBOX' : `◆ TIER ${clearance.tier}`}
          </span>
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
    </header>
  )
}
