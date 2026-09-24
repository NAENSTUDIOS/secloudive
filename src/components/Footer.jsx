import { ExternalLink, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import CopyrightDisclaimer from './CopyrightDisclaimer'

export default function Footer() {
  return (
    <footer className="footer" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <CopyrightDisclaimer compact />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
        <div className="footer-brand">
          <span>© 2025-2026 SeCloudive. Independent Educational Cloud Security Simulator.</span>
          <span>All referenced trademarks (AWS®, TryHackMe®, HackTheBox®, CIS®) belong to their respective owners.</span>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/about">About & Legal Disclaimers</Link>
          <Link to="/projects">Capstone Projects ($0)</Link>
          <Link to="/labs">Enterprise SOP Labs</Link>
          <Link to="/playbooks">Job Playbooks</Link>
          <a href="https://github.com/SeCloudive" target="_blank" rel="noreferrer">GitHub <ExternalLink size={12} /></a>
        </nav>
        <span className="footer-status"><i /> All systems operational</span>
      </div>
    </footer>
  )
}
