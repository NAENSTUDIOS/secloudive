import { ExternalLink, ShieldCheck, Download, Scale } from 'lucide-react'
import { Link } from 'react-router-dom'
import CopyrightDisclaimer from './CopyrightDisclaimer'

export default function Footer() {
  return (
    <footer className="footer" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <CopyrightDisclaimer compact />

      {/* Main Footer Links Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '20px'
      }}>
        {/* Learn */}
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.1em', marginBottom: '10px' }}>
            LEARN
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '7px' }} aria-label="Learn navigation">
            <Link to="/learning" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Learning Academy</Link>
            <Link to="/ramp-up" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Career Ramp-Up Tracks</Link>
            <Link to="/downloads" style={{ fontSize: '0.8rem', color: '#f59e0b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Download size={11} /> Free Career Packs
            </Link>
            <Link to="/cost-calculator" style={{ fontSize: '0.8rem', color: '#10b981', textDecoration: 'none' }}>$0 Lab Calculator</Link>
            <Link to="/categories" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Scenario Catalog</Link>
          </nav>
        </div>

        {/* Practice */}
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.1em', marginBottom: '10px' }}>
            PRACTICE
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '7px' }} aria-label="Practice navigation">
            <Link to="/labs" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Enterprise SOP Labs</Link>
            <Link to="/playbooks" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Job Playbooks</Link>
            <Link to="/projects" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Portfolio Projects</Link>
            <Link to="/cloudive-studio" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Builder Studio</Link>
            <Link to="/architecture-reviews" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Architecture Reviews</Link>
          </nav>
        </div>

        {/* Compete */}
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.1em', marginBottom: '10px' }}>
            COMPETE
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '7px' }} aria-label="Compete navigation">
            <Link to="/battle-rooms" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Battle Rooms (CTF)</Link>
            <Link to="/investigations" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Incident Simulator</Link>
            <Link to="/internship-simulator" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>SOC On-Call Rotation</Link>
            <Link to="/interview-simulator" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Interview Simulator</Link>
            <Link to="/live-portal" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Live Threat Hub</Link>
          </nav>
        </div>

        {/* Platform */}
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.1em', marginBottom: '10px' }}>
            PLATFORM
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '7px' }} aria-label="Platform navigation">
            <Link to="/dashboard" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>SOC Dashboard</Link>
            <Link to="/about" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>About & Career Hub</Link>
            <Link to="/report" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none' }}>Progress Report</Link>
            <Link to="/verify-pack" style={{ fontSize: '0.8rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={11} /> Verify Audit Pack
            </Link>
            <Link to="/legal" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Scale size={11} /> Legal & Policies
            </Link>
            <a href="https://github.com/SeCloudive" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              GitHub <ExternalLink size={11} />
            </a>
          </nav>
        </div>

        {/* Studio & Contact */}
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.1em', marginBottom: '10px' }}>
            NAEN STUDIOS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>
              NAEN Studios
            </span>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Creators of NAEN AI & the SeCloudive educational cloud architecture simulator.
            </p>
            <a 
              href="mailto:naenstudios@gmail.com" 
              style={{ fontSize: '0.78rem', color: '#38bdf8', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              naenstudios@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        flexWrap: 'wrap',
        gap: '10px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        paddingTop: '14px'
      }}>
        <div className="footer-brand">
          <span>© 2025–2026 SeCloudive by NAEN Studios. Independent Educational Cloud Security Simulator.</span>
          <span>Official Support: <a href="mailto:naenstudios@gmail.com" style={{ color: '#38bdf8', textDecoration: 'underline' }}>naenstudios@gmail.com</a> • All referenced trademarks belong to their respective owners.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/legal" style={{ fontSize: '0.7rem', color: '#475569', textDecoration: 'none' }}>Terms & Legal</Link>
          <span className="footer-status"><i /> All systems operational</span>
        </div>
      </div>
    </footer>
  )
}
