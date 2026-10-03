import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Compass,
  X,
  Sparkles,
  ShieldCheck,
  Terminal,
  Skull,
  Radio,
  BookOpen,
  Layers,
  Award,
  Zap,
  CheckCircle2,
  HelpCircle,
  FolderGit2,
  FileCode2,
  Search,
  ArrowRight,
  ShieldAlert,
  Clock,
  ExternalLink,
  GraduationCap
} from 'lucide-react'
import { playTabWhoosh, playTactileClick } from '../utils/cyberMotionAudio'
import '../styles/platformClarityGuide.css'

const GOAL_PATHWAYS = [
  {
    id: 'path-beginner',
    tag: 'Path 01 • Absolute Beginner',
    title: 'New to Cloud & Security',
    icon: BookOpen,
    color: '#38bdf8',
    desc: 'Never used AWS or analyzed an IAM policy before? Start here with bite-sized concepts before touching production environments.',
    steps: [
      { label: 'Step 1', text: 'Take the 2-Minute Diagnostic Skill Placement Test (Alt+D)' },
      { label: 'Step 2', text: 'Master IAM JSON Policies & S3 Perimeters in Learning Center' },
      { label: 'Step 3', text: 'Review AWS Certification Flashcards & Exam Drills (Alt+F)' }
    ],
    actionLabel: 'Start with Learning Academy',
    actionRoute: '/learning'
  },
  {
    id: 'path-builder',
    tag: 'Path 02 • Hands-On Builder',
    title: 'Real Terminal & AWS Practice',
    icon: Terminal,
    color: '#10b981',
    desc: 'You understand basic concepts and want real terminal commands, 1-click Terraform stacks, and verified $0 AWS Free Tier practice.',
    steps: [
      { label: 'Step 1', text: 'Follow the 16 Enterprise SOP Labs with dual CLI & Console steps' },
      { label: 'Step 2', text: 'Deploy verified $0 Portfolio Capstones into your Free Tier account' },
      { label: 'Step 3', text: 'Use Safe Cost Sentinel to verify $0 teardowns and prevent billing' }
    ],
    actionLabel: 'Launch 16 Real Labs',
    actionRoute: '/labs'
  },
  {
    id: 'path-ctf',
    tag: 'Path 03 • Adversarial CTF',
    title: 'Red vs Blue & Incident On-Call',
    icon: Skull,
    color: '#f43f5e',
    desc: 'You love competitive hacking, timed challenge rooms, and high-pressure production on-call paging with strict SLA countdowns.',
    steps: [
      { label: 'Step 1', text: 'Capture flags under the 10-minute speedrun clock in Battle Rooms' },
      { label: 'Step 2', text: 'Handle urgent production outages under 15m/30m SLA clocks' },
      { label: 'Step 3', text: 'Generate and export executive Shift Handover Reports' }
    ],
    actionLabel: 'Enter CTF Battle Rooms',
    actionRoute: '/battle-rooms'
  },
  {
    id: 'path-interview',
    tag: 'Path 04 • Career & Job Seeker',
    title: 'Interviews & Cryptographic Proof',
    icon: Award,
    color: '#a855f7',
    desc: 'Preparing for cloud security interviews or need verifiable proof of skill to impress hiring managers on LinkedIn and resumes.',
    steps: [
      { label: 'Step 1', text: 'Practice real-time technical defense in AI Interview Simulator' },
      { label: 'Step 2', text: 'Export structured STAR methodology candidate evaluation dossiers' },
      { label: 'Step 3', text: 'Generate SHA-256 sealed Certificate Dossier with verification QR code' }
    ],
    actionLabel: 'Practice AI Interviews',
    actionRoute: '/interview-simulator'
  }
]

const WORKSPACES_DIRECTORY = [
  {
    category: 'Live Threat Simulators & Arenas',
    badge: 'Hands-On Attack/Defend',
    workspaces: [
      {
        name: 'Incident Simulator',
        route: '/investigations',
        icon: ShieldAlert,
        desc: 'Triage 25 realistic production security tickets with raw CloudTrail & GuardDuty logs to contain the blast radius.'
      },
      {
        name: 'CTF Battle Rooms',
        route: '/battle-rooms',
        icon: Skull,
        desc: 'Red vs Blue offensive exploit arena with a 10-minute speedrun clock, 1.5x XP multipliers, and 3-tier hints.'
      },
      {
        name: 'SOC On-Call Rotation',
        route: '/internship-simulator',
        icon: Radio,
        desc: 'Experience high-pressure SOC shifts with live 15m/30m SLA countdown clocks and 1-click executive handover reports.'
      },
      {
        name: 'AI Interview Simulator',
        route: '/interview-simulator',
        icon: Sparkles,
        desc: 'Practice technical defense rounds evaluated across STAR rigor, production safety, and technical depth with audio waveforms.'
      }
    ]
  },
  {
    category: 'Hands-On Labs & Engineering Studios',
    badge: '$0 Free Tier Safe',
    workspaces: [
      {
        name: '16 Enterprise Labs',
        route: '/labs',
        icon: Terminal,
        desc: 'Dual AWS CLI & Console step-by-step runbooks for real Free Tier accounts with copyable command validation.'
      },
      {
        name: 'Cloudive Builder Studio',
        route: '/cloudive-studio',
        icon: Layers,
        desc: 'Visual Builder vs Defender canvas, live Attack Graph simulation, IaC security linter, and 1-click Terraform exporter.'
      },
      {
        name: 'Job Playbook Engine',
        route: '/playbooks',
        icon: FileCode2,
        desc: '7-stage industrial runbooks connecting raw alerts to Athena SQL queries, bash scripts, and Terraform fixes.'
      },
      {
        name: 'Portfolio Projects ($0)',
        route: '/projects',
        icon: FolderGit2,
        desc: 'Deploy 4 resume-ready security architectures with verified $0 teardown workflows and GitHub proofs.'
      }
    ]
  },
  {
    category: 'Academy, Benchmarks & Career OS',
    badge: 'Curriculum & Theory',
    workspaces: [
      {
        name: 'Learning Academy',
        route: '/learning',
        icon: BookOpen,
        desc: 'Curated paths covering IAM, S3, VPC Networking, and CIS AWS Foundations Benchmark v3.0 audit readiness meters.'
      },
      {
        name: '10-Week Platform Roadmap',
        route: '/roadmap',
        icon: Compass,
        desc: 'Chronological "When To Use What" guide from Day 1 to Week 10, paired with inspirational security quotes.'
      },
      {
        name: 'Career Ramp-Up & PDF Vault',
        route: '/ramp-up',
        icon: GraduationCap,
        desc: '5 role blueprints, TryHackMe/HackTheBox skill matrices, and 15 downloadable enterprise study workbooks.'
      },
      {
        name: 'Architecture Reviews',
        route: '/architecture-reviews',
        icon: Layers,
        desc: 'Analyze multi-finding compound architectural risks and learn how small misconfigurations compound into breaches.'
      },
      {
        name: 'Master Readiness Dashboard',
        route: '/dashboard',
        icon: Award,
        desc: 'Your central command center tracking employability score, daily learning streaks, and 7-tier career progression.'
      }
    ]
  }
]

export default function PlatformClarityGuideModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('pathways') // 'pathways' | 'workspaces' | 'rules' | 'hotkeys'
  const [searchFilter, setSearchFilter] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleOpen = () => {
      playTabWhoosh()
      setIsOpen(true)
    }

    const handleKeyDown = (e) => {
      // Alt + H or Ctrl + Shift + H -> Open Clarity Guide
      if ((e.altKey && e.key.toLowerCase() === 'h') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h')) {
        e.preventDefault()
        handleOpen()
        return
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('open-platform-guide', handleOpen)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('open-platform-guide', handleOpen)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleClose = () => {
    playTactileClick()
    setIsOpen(false)
  }

  const handleNavigate = (route) => {
    playTactileClick()
    setIsOpen(false)
    navigate(route)
  }

  const filteredWorkspaces = WORKSPACES_DIRECTORY.map(group => ({
    ...group,
    workspaces: group.workspaces.filter(ws =>
      ws.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ws.desc.toLowerCase().includes(searchFilter.toLowerCase())
    )
  })).filter(group => group.workspaces.length > 0)

  if (!isOpen) return null

  return (
    <div className="clarity-modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="clarity-guide-title">
      <div className="clarity-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="clarity-modal-header">
          <div className="clarity-header-title-box">
            <div className="clarity-header-icon">
              <Compass size={24} />
            </div>
            <div className="clarity-header-text">
              <h2 id="clarity-guide-title">
                <span>Platform Compass & Clarity Guide</span>
                <span style={{ fontSize: '0.74rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.3)', fontFamily: 'DM Mono, monospace' }}>
                  ZERO CONFUSION
                </span>
              </h2>
              <p>Everything you need to navigate SeCloudive with complete confidence. Choose your goal or decode the 13 workspaces.</p>
            </div>
          </div>

          <button
            type="button"
            className="clarity-close-btn"
            onClick={handleClose}
            aria-label="Close Platform Compass"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="clarity-tabs-nav" role="tablist">
          <button
            type="button"
            className={`clarity-tab-btn ${activeTab === 'pathways' ? 'active' : ''}`}
            onClick={() => { playTabWhoosh(); setActiveTab('pathways'); }}
          >
            <Sparkles size={14} />
            <span>Where Should I Start? (4 Goals)</span>
          </button>

          <button
            type="button"
            className={`clarity-tab-btn ${activeTab === 'workspaces' ? 'active' : ''}`}
            onClick={() => { playTabWhoosh(); setActiveTab('workspaces'); }}
          >
            <Layers size={14} />
            <span>The 13 Workspaces Decoded</span>
          </button>

          <button
            type="button"
            className={`clarity-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => { playTabWhoosh(); setActiveTab('rules'); }}
          >
            <ShieldCheck size={14} />
            <span>3 Golden Rules (No Confusion)</span>
          </button>

          <button
            type="button"
            className={`clarity-tab-btn ${activeTab === 'hotkeys' ? 'active' : ''}`}
            onClick={() => { playTabWhoosh(); setActiveTab('hotkeys'); }}
          >
            <Zap size={14} />
            <span>Hotkeys & Shortcuts</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="clarity-modal-body">
          {/* ── TAB 1: 4 GOAL PATHWAYS ── */}
          {activeTab === 'pathways' && (
            <div className="clarity-pathways-grid">
              {GOAL_PATHWAYS.map((p) => {
                const Icon = p.icon
                return (
                  <div
                    key={p.id}
                    className="clarity-pathway-card"
                    style={{ '--pathway-color': p.color }}
                  >
                    <div>
                      <div className="pathway-card-header">
                        <div className="pathway-card-icon" style={{ borderColor: `${p.color}55`, color: p.color }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <span className="pathway-tag">{p.tag}</span>
                          <h3 className="pathway-title">{p.title}</h3>
                        </div>
                      </div>

                      <p className="pathway-desc">{p.desc}</p>

                      <div className="pathway-meta-list">
                        {p.steps.map((st, sIdx) => (
                          <div key={sIdx} className="pathway-meta-item">
                            <strong style={{ color: p.color }}>{st.label}:</strong>
                            <span>{st.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="pathway-action-btn"
                      onClick={() => handleNavigate(p.actionRoute)}
                    >
                      <span>{p.actionLabel}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── TAB 2: 13 WORKSPACES DIRECTORY ── */}
          {activeTab === 'workspaces' && (
            <div className="clarity-workspaces-section">
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(148, 163, 184, 0.25)', borderRadius: '10px', padding: '8px 14px', gap: '10px' }}>
                <Search size={15} style={{ color: '#38bdf8' }} />
                <input
                  type="text"
                  placeholder="Filter workspaces by keyword (e.g., CTF, Labs, Interview, Terraform, S3)..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#f8fafc', fontSize: '0.84rem', width: '100%' }}
                />
                {searchFilter && (
                  <button
                    type="button"
                    onClick={() => setSearchFilter('')}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                )}
              </div>

              {filteredWorkspaces.map((cluster, cIdx) => (
                <div key={cIdx} className="workspace-cluster-group">
                  <div className="workspace-cluster-head">
                    <div className="workspace-cluster-title">
                      <span>{cluster.category}</span>
                    </div>
                    <span className="workspace-cluster-badge">{cluster.badge}</span>
                  </div>

                  <div className="workspace-cards-grid">
                    {cluster.workspaces.map((ws, wIdx) => {
                      const Icon = ws.icon
                      return (
                        <div key={wIdx} className="workspace-micro-card">
                          <div className="workspace-micro-top">
                            <Icon size={18} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <h4 className="workspace-micro-title">{ws.name}</h4>
                              <p className="workspace-micro-desc">{ws.desc}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="workspace-micro-link"
                            onClick={() => handleNavigate(ws.route)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            <span>Open {ws.name}</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TAB 3: 3 GOLDEN RULES ── */}
          {activeTab === 'rules' && (
            <div className="clarity-rules-list">
              <div className="clarity-rule-box">
                <div className="rule-number-badge">1</div>
                <div className="rule-content">
                  <h3>One User, One Unique ID (Strict Data Isolation)</h3>
                  <p>
                    You do not need passwords that risk being compromised. Every engineer on SeCloudive has their own Unique User ID (e.g. <code>SEC-ENG-8821</code>). 
                    All your lab notes, incident triage scores, streaks, and certificates are isolated exclusively to your ID and automatically synchronized. 
                    If you are currently on Guest Mode, claim your ID anytime via <strong>Alt+U</strong> with zero loss of progress.
                  </p>
                </div>
              </div>

              <div className="clarity-rule-box">
                <div className="rule-number-badge">2</div>
                <div className="rule-content">
                  <h3>$0 Spend Guarantee (No Surprise AWS Invoices)</h3>
                  <p>
                    All 16 Enterprise Labs and 4 Capstones are rigorously designed for the AWS Free Tier. Every lab includes automated 
                    Safe Cost Sentinel calculations and copy-paste <code>terraform destroy</code> / teardown runbooks so you can practice production 
                    infrastructure safely without spending a single dollar.
                  </p>
                </div>
              </div>

              <div className="clarity-rule-box">
                <div className="rule-number-badge">3</div>
                <div className="rule-content">
                  <h3>The 10-Week Roadmap is Your Anchor (Alt+R)</h3>
                  <p>
                    Whenever you wonder "What should I do today?", open the <strong>10-Week Roadmap (/roadmap)</strong>. It lays out the exact 
                    progression from Day 1 (Diagnostic Baseline) through Weeks 1–2 (Foundations), Weeks 3–4 (Real Labs), Weeks 5–6 (CTF & On-Call), 
                    Weeks 7–8 (Cloudive Studio), and Weeks 9–10 (AI Interview Simulator & Verified Certificate Dossier).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 4: HOTKEYS & FAST TOOLS ── */}
          {activeTab === 'hotkeys' && (
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px 0' }}>Universal Global Hotkeys</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Use these system-wide hotkeys anywhere across the 13 workspaces to move instantly without searching menus.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>Platform Clarity Guide (This Modal)</span>
                  <kbd style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontFamily: 'DM Mono, monospace', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Alt + H</kbd>
                </div>

                <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>10-Week Platform Roadmap</span>
                  <kbd style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontFamily: 'DM Mono, monospace', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Alt + R</kbd>
                </div>

                <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>Universal Lab Notes & Scratchpad</span>
                  <kbd style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontFamily: 'DM Mono, monospace', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Alt + N</kbd>
                </div>

                <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>AWS Certification Flashcards</span>
                  <kbd style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontFamily: 'DM Mono, monospace', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Alt + F</kbd>
                </div>

                <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>2-Min Skill Placement Diagnostic</span>
                  <kbd style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontFamily: 'DM Mono, monospace', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Alt + D</kbd>
                </div>

                <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>User ID & Data Isolation Engine</span>
                  <kbd style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontFamily: 'DM Mono, monospace', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Alt + U</kbd>
                </div>

                <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>NAEN AI Socratic Co-Pilot</span>
                  <kbd style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontFamily: 'DM Mono, monospace', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Ctrl + K</kbd>
                </div>

                <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 600 }}>Global Omnisearch Across Workspaces</span>
                  <kbd style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontFamily: 'DM Mono, monospace', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Ctrl + /</kbd>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="clarity-modal-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span>Still feeling unsure? Ask the <strong>NAEN AI Co-Pilot (Ctrl+K)</strong> anytime for real-time guidance.</span>
          </div>

          <div className="clarity-footer-actions">
            <button
              type="button"
              className="button button-ghost btn-sm"
              onClick={() => { handleClose(); window.dispatchEvent(new CustomEvent('open-diagnostic-test')); }}
              style={{ fontSize: '0.76rem', padding: '6px 14px' }}
            >
              Take 2-Min Placement
            </button>
            <button
              type="button"
              className="button button-primary btn-sm"
              onClick={() => handleNavigate('/roadmap')}
              style={{ fontSize: '0.76rem', padding: '6px 14px' }}
            >
              <span>Explore 10-Week Roadmap</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
