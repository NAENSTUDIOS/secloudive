import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  Sparkles,
  Quote,
  ShieldCheck,
  Terminal,
  Flame,
  Layers,
  Cpu,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  Target
} from 'lucide-react'
import PlatformExplorationRoadmap, { MOTIVATIONAL_QUOTES } from '../components/PlatformExplorationRoadmap'
import CareerJourneyTrack from '../components/CareerJourneyTrack'
import { useChallenges } from '../context/ChallengeContext'
import { playTabWhoosh, playTactileClick } from '../utils/cyberMotionAudio'
import '../styles/platformRoadmap.css'

export default function PlatformRoadmapPage() {
  const {
    completedLabsCount,
    battleRoomsSolvedCount,
    investigationCompletedCount,
    totalScore,
    activeProfile
  } = useChallenges()

  const [activeTab, setActiveTab] = useState('roadmap') // 'roadmap' | 'quotes' | 'roles'
  const [copiedId, setCopiedId] = useState(null)
  const [quotesCategoryFilter, setQuotesCategoryFilter] = useState('all')

  const handleTabChange = (tab) => {
    playTabWhoosh()
    setActiveTab(tab)
  }

  const handleCopyQuote = (q) => {
    playTactileClick()
    const textToCopy = `"${q.quote}" — ${q.author} (${q.role}) [via SeCloudive]`
    navigator.clipboard?.writeText(textToCopy)
    setCopiedId(q.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredQuotes = quotesCategoryFilter === 'all'
    ? MOTIVATIONAL_QUOTES
    : MOTIVATIONAL_QUOTES.filter(q => q.theme.toLowerCase().includes(quotesCategoryFilter.toLowerCase()))

  return (
    <main className="page-shell platform-roadmap-page">
      {/* ── Breadcrumb & Top Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
          <Link to="/dashboard" style={{ color: '#38bdf8', textDecoration: 'none' }}>Dashboard</Link>
          <span>/</span>
          <span style={{ color: '#f8fafc', fontWeight: 600 }}>Platform Exploration Roadmap</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.74rem', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 10px', borderRadius: '6px', fontFamily: 'DM Mono, monospace' }}>
            ACTIVE PROFILE: {activeProfile?.id || 'GUEST-SANDBOX'}
          </span>
          <span style={{ fontSize: '0.74rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
            {investigationCompletedCount + completedLabsCount + battleRoomsSolvedCount} Milestones Mastered
          </span>
        </div>
      </div>

      {/* ── Main Hero Header ── */}
      <header className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" /> OFFICIAL PLATFORM ONBOARDING & EXPLORATION FLIGHT PLAN
          </div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>When To Use What</span>
            <span style={{ color: '#38bdf8' }}>.</span>
          </h1>
          <p style={{ maxWidth: '840px', fontSize: '0.96rem', lineHeight: '1.65', color: '#cbd5e1' }}>
            SeCloudive brings together 13 enterprise environments — from the 2-Minute Diagnostic Baseline to live-fire CTF Battle Rooms and AI STAR Interview Simulators. 
            Follow this chronological roadmap from Day 1 to Week 10 to master cloud security systematically with zero cognitive overload.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <Link to="/learning" className="button button-ghost" style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}>
            <BookOpen size={15} /> Learning Center
          </Link>
          <Link to="/labs" className="button button-primary">
            <Terminal size={15} /> 16 Real Labs
          </Link>
        </div>
      </header>

      {/* ── Cyber Telemetry Stats Bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <Layers size={18} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>13 Workspaces</div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Unified in 1 Operational OS</div>
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>$0 Spend Guarantee</div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Safe Cost Sentinel Teardowns</div>
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
            <Award size={18} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>CIS Benchmark v3.0</div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Industry Gold Standard Audit</div>
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
            <Zap size={18} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>SHA-256 Verified</div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Cryptographic Proof Dossier</div>
          </div>
        </div>
      </div>

      {/* ── Tab Switcher: Roadmap vs Career Tracks vs Quotes Gallery ── */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(148, 163, 184, 0.15)', paddingBottom: '12px', marginBottom: '24px', overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => handleTabChange('roadmap')}
          className={`button ${activeTab === 'roadmap' ? 'button-primary' : 'button-ghost'}`}
          style={{ fontSize: '0.82rem', padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Compass size={15} />
          <span>Platform Roadmap (When To When Guide)</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('quotes')}
          className={`button ${activeTab === 'quotes' ? 'button-primary' : 'button-ghost'}`}
          style={{ fontSize: '0.82rem', padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Quote size={15} />
          <span>Motivational Quotes Vault ({MOTIVATIONAL_QUOTES.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('roles')}
          className={`button ${activeTab === 'roles' ? 'button-primary' : 'button-ghost'}`}
          style={{ fontSize: '0.82rem', padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Layers size={15} />
          <span>7-Tier Career Journey Progression</span>
        </button>

        <Link
          to="/ramp-up"
          className="button button-ghost"
          style={{ fontSize: '0.82rem', padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', marginLeft: 'auto' }}
        >
          <ExternalLink size={15} />
          <span>5 Role Blueprints & PDF Vault</span>
        </Link>
      </div>

      {/* ── Tab 1: Platform Exploration Roadmap (Core Deliverable) ── */}
      {activeTab === 'roadmap' && (
        <PlatformExplorationRoadmap compact={false} />
      )}

      {/* ── Tab 2: Motivational Quotes Vault ── */}
      {activeTab === 'quotes' && (
        <section aria-label="Cybersecurity & Cloud Defense Wisdom Vault">
          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38bdf8', fontFamily: 'DM Mono, monospace' }}>
                  DEFENDER ENCOURAGEMENT & RESILIENCE VAULT
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 6px 0' }}>
                  Words of the Cyber Masters
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: 0, maxWidth: '720px' }}>
                  Curated wisdom from the pioneers of computer science, military strategy, and cloud defense to keep you grounded, confident, and motivated through complex technical hurdles.
                </p>
              </div>

              {/* Theme filter */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['all', 'Process', 'Humility', 'Resilience', 'Courage', 'Threat Modeling', 'Defense in Depth'].map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => { playTactileClick(); setQuotesCategoryFilter(theme); }}
                    className={`pathfinder-btn ${quotesCategoryFilter === theme ? 'active' : ''}`}
                    style={{ fontSize: '0.74rem', padding: '5px 12px' }}
                  >
                    {theme === 'all' ? 'All Themes' : theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of quotes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              {filteredQuotes.map((q) => (
                <div
                  key={q.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(8, 14, 28, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.25)', fontFamily: 'DM Mono, monospace' }}>
                      {q.theme}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyQuote(q)}
                      style={{ background: 'none', border: 'none', color: copiedId === q.id ? '#10b981' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem' }}
                    >
                      {copiedId === q.id ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedId === q.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '0.94rem', fontWeight: 600, color: '#f8fafc', fontStyle: 'italic', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                    "{q.quote}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontWeight: 800, fontSize: '0.78rem' }}>
                      {q.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f8fafc' }}>{q.author}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: '1.3' }}>{q.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Tab 3: 7-Tier Career Journey Track ── */}
      {activeTab === 'roles' && (
        <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#10b981', fontFamily: 'monospace' }}>
              CAREER READINESS ARCHITECTURE /// 7 TIERS
            </span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 6px 0' }}>
              From Cloud Security Novice to Enterprise Principal Architect
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: 0 }}>
              How each stage of SeCloudive aligns to official enterprise compensation bands, certifications, and technical interviews.
            </p>
          </div>
          <CareerJourneyTrack />
        </div>
      )}
    </main>
  )
}
