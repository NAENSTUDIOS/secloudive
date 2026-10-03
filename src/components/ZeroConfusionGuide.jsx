import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Compass, 
  Map, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  BookOpen, 
  Terminal, 
  Briefcase, 
  HelpCircle, 
  Lock, 
  DollarSign, 
  UserCheck 
} from 'lucide-react'
import { playTactileClick } from '../utils/cyberMotionAudio'
import '../styles/zeroConfusionGuide.css'

const PERSONA_CONFIGS = {
  beginner: {
    id: 'beginner',
    label: '🐣 New to Cloud Security',
    sub: 'Looking for a step-by-step introduction without getting overwhelmed',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    step1: {
      tag: 'Step 1 • Start Here Today',
      tagClass: 'tag-primary',
      title: 'Take the 2-Minute Diagnostic Placement',
      desc: 'Discover your current cloud baseline and get an automated custom curriculum recommendation.',
      actionType: 'event',
      eventName: 'open-diagnostic-test',
      actionLabel: 'Take 2-Min Placement (Alt+D)'
    },
    step2: {
      tag: 'Step 2 • Foundation',
      tagClass: 'tag-secondary',
      title: 'Academy Domain 01: IAM & Privilege',
      desc: 'Master JSON policies, least privilege, and role assumption with interactive visual checks.',
      actionType: 'link',
      to: '/learning/iam',
      actionLabel: 'Enter IAM Academy'
    },
    avoid: {
      tag: 'Skip for Now',
      tagClass: 'tag-avoid',
      title: 'Hold off on Battle Rooms & On-Call',
      desc: 'High-speed timed incident simulations require hands-on CLI fluency. Build your baseline first!'
    }
  },
  builder: {
    id: 'builder',
    label: '🛠️ Hands-On Builder & DevOps',
    sub: 'Want to write Terraform, deploy architectures, and practice with real AWS CLI',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    step1: {
      tag: 'Step 1 • Deploy Infrastructure',
      tagClass: 'tag-primary',
      title: '16 Enterprise SOP Labs',
      desc: 'Step-by-step hardened IaC deployment guides with verified copy-paste commands and cleanup runbooks.',
      actionType: 'link',
      to: '/labs',
      actionLabel: 'Explore 16 Real Labs'
    },
    step2: {
      tag: 'Step 2 • $0 Guarantee',
      tagClass: 'tag-secondary',
      title: 'Safe Lab Cost Sentinel & 5 Capstones',
      desc: 'Audit your resource usage against AWS Free Tier limits and build portfolio-grade capstones.',
      actionType: 'link',
      to: '/projects',
      actionLabel: 'View Verified Capstones'
    },
    avoid: {
      tag: 'Cost Protection Tip',
      tagClass: 'tag-avoid',
      title: 'Never Leave Resources Running',
      desc: 'Always execute the provided `terraform destroy` teardown steps before logging out.'
    }
  },
  ctf: {
    id: 'ctf',
    label: '🛡️ Blue Team & SOC Defender',
    sub: 'Ready for live simulated attacks, CloudTrail log analysis, and incident triage',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    step1: {
      tag: 'Step 1 • Timed Attack Mitigation',
      tagClass: 'tag-primary',
      title: '8 Adversarial Threat Battle Rooms',
      desc: 'Race against live adversarial countdowns to isolate compromised IAM keys and revoke public S3 ACLs.',
      actionType: 'link',
      to: '/battle-rooms',
      actionLabel: 'Enter Battle Rooms'
    },
    step2: {
      tag: 'Step 2 • Incident Response',
      tagClass: 'tag-secondary',
      title: 'SOC Internship Simulator (On-Call)',
      desc: 'Handle authentic customer incident escalations, submit containment runbooks, and earn supervisor sign-offs.',
      actionType: 'link',
      to: '/internship-simulator',
      actionLabel: 'Launch SOC Simulator'
    },
    avoid: {
      tag: 'Investigation Rule',
      tagClass: 'tag-avoid',
      title: 'Don’t Guess — Inspect Telemetry',
      desc: 'Every scenario has raw synthetic CloudTrail, GuardDuty, and VPC Flow Logs in the evidence pane.'
    }
  },
  jobseeker: {
    id: 'jobseeker',
    label: '🎯 Career Switcher & Job Seeker',
    sub: 'Preparing for technical interviews, AWS certifications, and recruiter dossiers',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    step1: {
      tag: 'Step 1 • Your 10-Week Anchor',
      tagClass: 'tag-primary',
      title: '10-Week Platform Exploration Roadmap',
      desc: 'Follow the proven chronological schedule that guides your studies from Week 1 basics to Week 10 capstone.',
      actionType: 'link',
      to: '/roadmap',
      actionLabel: 'Open 10-Week Roadmap'
    },
    step2: {
      tag: 'Step 2 • Real-Time Practice',
      tagClass: 'tag-secondary',
      title: 'STAR Technical Interview Simulator',
      desc: 'Practice answering tough cloud security interview questions with instant AI feedback and scoring.',
      actionType: 'link',
      to: '/interview-simulator',
      actionLabel: 'Practice STAR Interviews'
    },
    avoid: {
      tag: 'Hiring Tip',
      tagClass: 'tag-avoid',
      title: 'Avoid Unverified Resumes',
      desc: 'Export your cryptographically verifiable SeCloudive Audit Pack Dossier to showcase proof of work.'
    }
  }
}

const WORKSPACE_CATALOG = [
  { id: 'roadmap', name: '🗺️ 10-Week Roadmap', purpose: 'Chronological week-by-week guide with quotes & milestones.', path: '/roadmap' },
  { id: 'learning', name: '📚 Learning Academy', purpose: '52 self-paced modules across IAM, S3, Network & Logging.', path: '/learning' },
  { id: 'labs', name: '💻 16 Real Labs', purpose: 'Step-by-step hands-on SOPs with Terraform IaC & CLI tests.', path: '/labs' },
  { id: 'battlerooms', name: '⚔️ 8 Threat Battle Rooms', purpose: 'Timed attack mitigation CTFs under simulated pressure.', path: '/battle-rooms' },
  { id: 'investigations', name: '🔍 25 Incident Investigations', purpose: 'Deep-dive forensic log analysis and blast radius tracing.', path: '/investigations' },
  { id: 'internship', name: '🏢 SOC Internship Simulator', purpose: 'Authentic 6-week virtual SOC rotation with real ticket queues.', path: '/internship-simulator' },
  { id: 'projects', name: '📁 5 Verified $0 Capstones', purpose: 'Portfolio-ready multi-tier AWS security architectures.', path: '/projects' },
  { id: 'interview', name: '🎙️ STAR Interview Simulator', purpose: 'AI-evaluated cloud security technical & behavioral questions.', path: '/interview-simulator' },
  { id: 'playbooks', name: '📖 Job Playbooks Engine', purpose: 'Hiring rubrics, daily workflows, and salary benchmarks.', path: '/playbooks' },
  { id: 'architecture', name: '🏛️ Architecture Reviews', purpose: 'Compound risk audits across complex enterprise diagrams.', path: '/architecture-reviews' },
  { id: 'studio', name: '⚡ Cloudive Studio', purpose: 'Interactive visual architecture builder and code exporter.', path: '/cloudive-studio' },
  { id: 'rampup', name: '🧭 5 Role Blueprints', purpose: 'Detailed skill breakdown across SOC, Cloud Sec, DevSecOps.', path: '/ramp-up' },
  { id: 'report', name: '📋 Security Dossier & Report', purpose: 'Cryptographic proof-of-work certificate and audit pack export.', path: '/report' }
]

export default function ZeroConfusionGuide({ embeddedIn = 'home' }) {
  const [selectedPersona, setSelectedPersona] = useState('beginner')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const activeConfig = PERSONA_CONFIGS[selectedPersona]

  const handlePersonaClick = (id) => {
    playTactileClick()
    setSelectedPersona(id)
  }

  const handleOpenGuideModal = () => {
    playTactileClick()
    window.dispatchEvent(new CustomEvent('open-platform-guide'))
  }

  const handleActionClick = (action) => {
    playTactileClick()
    if (action.actionType === 'event') {
      window.dispatchEvent(new CustomEvent(action.eventName))
    }
  }

  return (
    <section className="zero-confusion-section animate-reveal" aria-label="Zero Confusion Platform Orientation Guide">
      {/* Header */}
      <div className="zero-confusion-header">
        <div className="zero-confusion-title-area">
          <div className="zero-confusion-icon-badge">
            <Compass size={24} />
          </div>
          <div>
            <h2>How to Explore SeCloudive Without Getting Confused</h2>
            <p>13 workspaces can feel overwhelming. Choose your goal below for your instant 2-step starting sequence.</p>
          </div>
        </div>

        <div className="zero-confusion-actions">
          <button 
            type="button" 
            className="zero-btn-compass"
            onClick={handleOpenGuideModal}
            title="Open Interactive Platform Compass & Cheat Sheet (Alt+H)"
          >
            <Compass size={15} /> Open Platform Guide (Alt+H)
          </button>
          <Link 
            to="/roadmap" 
            className="zero-btn-roadmap"
            onClick={() => playTactileClick()}
            title="View 10-Week Chronological Platform Roadmap"
          >
            <Map size={15} /> 10-Week Roadmap
          </Link>
        </div>
      </div>

      {/* Persona Selectors */}
      <div className="zero-persona-selector-label">What is your primary goal right now?</div>
      <div className="zero-persona-grid">
        {Object.values(PERSONA_CONFIGS).map((persona) => {
          const isActive = selectedPersona === persona.id
          return (
            <button
              key={persona.id}
              type="button"
              className={`zero-persona-card ${isActive ? 'active' : ''}`}
              style={{
                '--persona-accent': persona.accentColor,
                '--persona-glow': persona.glowColor
              }}
              onClick={() => handlePersonaClick(persona.id)}
            >
              <div className="zero-persona-header">
                <span className="zero-persona-name">{persona.label}</span>
                {isActive && <CheckCircle2 size={16} color={persona.accentColor} />}
              </div>
              <span className="zero-persona-desc">{persona.sub}</span>
            </button>
          )
        })}
      </div>

      {/* Active Guidance Box */}
      <div className="zero-guidance-container">
        <div className="zero-guidance-steps-grid">
          {/* Step 1 */}
          <div className="zero-step-box">
            <div>
              <span className={`zero-step-tag ${activeConfig.step1.tagClass}`}>
                {activeConfig.step1.tag}
              </span>
              <h3 className="zero-step-title" style={{ marginTop: '8px' }}>{activeConfig.step1.title}</h3>
              <p className="zero-step-desc" style={{ marginTop: '6px' }}>{activeConfig.step1.desc}</p>
            </div>
            {activeConfig.step1.actionType === 'link' ? (
              <Link 
                to={activeConfig.step1.to} 
                className="zero-step-action-btn btn-solid-emerald"
                onClick={() => playTactileClick()}
              >
                {activeConfig.step1.actionLabel} <ArrowRight size={14} />
              </Link>
            ) : (
              <button 
                type="button" 
                className="zero-step-action-btn btn-solid-emerald"
                onClick={() => handleActionClick(activeConfig.step1)}
              >
                {activeConfig.step1.actionLabel} <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Step 2 */}
          <div className="zero-step-box">
            <div>
              <span className={`zero-step-tag ${activeConfig.step2.tagClass}`}>
                {activeConfig.step2.tag}
              </span>
              <h3 className="zero-step-title" style={{ marginTop: '8px' }}>{activeConfig.step2.title}</h3>
              <p className="zero-step-desc" style={{ marginTop: '6px' }}>{activeConfig.step2.desc}</p>
            </div>
            {activeConfig.step2.actionType === 'link' ? (
              <Link 
                to={activeConfig.step2.to} 
                className="zero-step-action-btn btn-outline-cyan"
                onClick={() => playTactileClick()}
              >
                {activeConfig.step2.actionLabel} <ArrowRight size={14} />
              </Link>
            ) : (
              <button 
                type="button" 
                className="zero-step-action-btn btn-outline-cyan"
                onClick={() => handleActionClick(activeConfig.step2)}
              >
                {activeConfig.step2.actionLabel} <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Advice / What to Avoid */}
          <div className="zero-step-box">
            <div>
              <span className={`zero-step-tag ${activeConfig.avoid.tagClass}`}>
                {activeConfig.avoid.tag}
              </span>
              <h3 className="zero-step-title" style={{ marginTop: '8px' }}>{activeConfig.avoid.title}</h3>
              <p className="zero-step-desc" style={{ marginTop: '6px' }}>{activeConfig.avoid.desc}</p>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic' }}>
              💡 Pro Tip: Press <kbd style={{ padding: '2px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#38bdf8' }}>Alt+H</kbd> anywhere for full navigation guidance.
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible 13 Workspaces Quick Directory */}
      <button 
        type="button" 
        className="zero-drawer-toggle"
        onClick={() => {
          playTactileClick()
          setIsDrawerOpen(prev => !prev)
        }}
      >
        <span>
          {isDrawerOpen ? 'Hide' : 'Show'} The 13 Workspaces Decoded (1-Sentence Explanations)
        </span>
        {isDrawerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isDrawerOpen && (
        <div className="zero-drawer-content">
          <div className="zero-workspaces-quick-grid">
            {WORKSPACE_CATALOG.map(ws => (
              <div key={ws.id} className="zero-workspace-item-card">
                <div className="zero-workspace-meta">
                  <div className="zero-workspace-title-row">
                    <span className="zero-workspace-name">{ws.name}</span>
                  </div>
                  <p className="zero-workspace-purpose">{ws.purpose}</p>
                  <Link 
                    to={ws.path} 
                    className="zero-workspace-link-arrow"
                    onClick={() => playTactileClick()}
                  >
                    Open Workspace <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guarantee & Peace of Mind Strip */}
      <div className="zero-guarantee-strip">
        <div className="zero-guarantee-items">
          <div className="zero-guarantee-pill">
            <DollarSign size={14} color="#10b981" />
            <span><strong>$0 AWS Guarantee:</strong> All labs fit AWS Free Tier with cost alerts</span>
          </div>
          <div className="zero-guarantee-pill">
            <UserCheck size={14} color="#38bdf8" />
            <span><strong>Isolated Progress:</strong> Unique User ID system protects your data</span>
          </div>
          <div className="zero-guarantee-pill">
            <Map size={14} color="#f59e0b" />
            <span><strong>10-Week Anchor:</strong> Always know what to do next at <kbd>/roadmap</kbd></span>
          </div>
        </div>
      </div>
    </section>
  )
}
