import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Quote,
  RefreshCw,
  Copy,
  Check,
  Compass,
  ShieldCheck,
  Terminal,
  Flame,
  Layers,
  Cpu,
  Clock,
  ArrowRight,
  CheckCircle2,
  Award,
  Zap,
  Skull,
  Radio,
  FileCode2,
  GraduationCap,
  Search,
  Filter,
  CheckSquare
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick, playTabWhoosh } from '../utils/cyberMotionAudio'
import DefenderQuoteCallout from './DefenderQuoteCallout'
import '../styles/platformRoadmap.css'

// Curated Hall of Fame: Cybersecurity & Cloud Architect Wisdom Quotes
export const MOTIVATIONAL_QUOTES = [
  {
    id: 1,
    quote: "Security is not a product, but a continuous process of disciplined observation and verified trust.",
    author: "Bruce Schneier",
    initials: "BS",
    role: "Pioneering Security Technologist & Fellow at Harvard Berkman Klein Center",
    theme: "Process & Discipline",
    category: "general"
  },
  {
    id: 2,
    quote: "The only truly secure system is one that is powered off, cast in concrete, and sealed in a lead-lined room — and even then, I have my doubts.",
    author: "Dr. Gene Spafford",
    initials: "GS",
    role: "Founding Executive Director Emeritus of CERIAS & Cybersecurity Hall of Fame",
    theme: "Humility & Vigilance",
    category: "general"
  },
  {
    id: 3,
    quote: "Failures are a given, and everything will go out of style eventually. In cloud architecture, design resilient systems that absorb shock gracefully.",
    author: "Dr. Werner Vogels",
    initials: "WV",
    role: "VP & Chief Technology Officer, Amazon.com",
    theme: "Resilience & Architecture",
    category: "builder"
  },
  {
    id: 4,
    quote: "The most dangerous phrase in the language is: 'We’ve always done it this way.' Question the defaults, inspect every IAM policy, and challenge implicit trust.",
    author: "Rear Admiral Grace Hopper",
    initials: "GH",
    role: "Computer Scientist Pioneer & Naval Officer",
    theme: "Courage & Innovation",
    category: "career"
  },
  {
    id: 5,
    quote: "If you know the enemy and know yourself, you need not fear the result of a hundred battles.",
    author: "Sun Tzu",
    initials: "ST",
    role: "Author of The Art of War (Ancient Strategic Philosophy for Red & Blue Teaming)",
    theme: "Threat Modeling",
    category: "tactical"
  },
  {
    id: 6,
    quote: "Given enough eyeballs, all vulnerabilities and edge-case bugs become shallow. Transparency in code and logs builds unbreakable security.",
    author: "Linus Torvalds",
    initials: "LT",
    role: "Creator of the Linux Operating System & Git",
    theme: "Auditability",
    category: "builder"
  },
  {
    id: 7,
    quote: "Amateurs hack systems; professionals understand identity, lateral trust chains, and cloud control planes.",
    author: "Cloud Defense Maxim",
    initials: "CD",
    role: "Enterprise Incident Response Protocol",
    theme: "Identity as Perimeter",
    category: "tactical"
  },
  {
    id: 8,
    quote: "Do not let imposter syndrome slow your hands. Every senior cloud architect once stared at their first cryptic IAM JSON error. Press forward; clarity follows execution.",
    author: "SeCloudive Mentor Creed",
    initials: "SM",
    role: "Pedagogical Guiding Principle",
    theme: "Daily Encouragement",
    category: "career"
  },
  {
    id: 9,
    quote: "The attacker only needs to find one crack; the defender must secure everything. But with defense-in-depth, immutable CloudTrail logs, and automated guardrails, we bend time in our favor.",
    author: "SOC Incident Lead Axiom",
    role: "Global Incident Handling Directive",
    initials: "SO",
    theme: "Defense in Depth",
    category: "tactical"
  },
  {
    id: 10,
    quote: "Mastery is not never making a misconfiguration. Mastery is detecting it within 30 seconds, isolating the blast radius, and writing the Terraform rule so it never happens again.",
    author: "DevSecOps Engineering Principle",
    initials: "DO",
    role: "Modern Infrastructure as Code Doctrine",
    theme: "Continuous Improvement",
    category: "builder"
  },
  {
    id: 11,
    quote: "A certification proves you studied the documentation. Building labs, diagnosing errors, and breaking architectures proves you can defend under fire.",
    author: "Kelsey Hightower",
    initials: "KH",
    role: "Open Source Technologist & Cloud Advocate",
    theme: "Hands-on Mastery",
    category: "career"
  },
  {
    id: 12,
    quote: "Never be ashamed of having to look up a command. The best analysts aren't human dictionaries; they are relentless problem solvers.",
    author: "John Hammond",
    initials: "JH",
    role: "Cybersecurity Educator & Threat Researcher",
    theme: "Growth Mindset",
    category: "career"
  },
  {
    id: 13,
    quote: "If you don't test failure modes in your simulated lab environment, production will test you on a Saturday morning with no warning.",
    author: "Adrian Cockcroft",
    initials: "AC",
    role: "Former VP Cloud Architecture Strategy, AWS",
    theme: "Chaos Engineering",
    category: "builder"
  },
  {
    id: 14,
    quote: "If it's smart, it's vulnerable. If it runs in the cloud, it requires continuous observability and immutable audit trails.",
    author: "Mikko Hyppönen",
    initials: "MH",
    role: "Chief Research Officer & Global Cyber Defense Expert",
    theme: "Continuous Observability",
    category: "general"
  }
]

// The 6 Progressive "When to When" Chronological Phases
const ROADMAP_PHASES = [
  {
    phaseId: 'phase-1',
    phaseNumber: '01',
    timeframe: 'Day 01',
    timeBadge: 'First 24 Hours • Genesis',
    difficulty: 1,
    themeColor: '#38bdf8',
    hoursEst: '~2 Hours',
    xpReward: '+200 XP',
    title: 'Genesis: Identity Claim & Diagnostic Skill Placement',
    objective:
      'When you first arrive on SeCloudive, establish your unique secure footprint and baseline your current cloud security reflexes before attempting live incidents.',
    whyNow: 'Eliminates guesswork so you never feel lost or overwhelmed by advanced services.',
    deliverable: 'Unique User ID + Benchmarked Skill Level (Beginner/Intermediate/Advanced) + Day 1 Streak',
    actions: [
      {
        label: 'Claim Unique User ID',
        type: 'event',
        event: 'open-user-sync-modal',
        isPrimary: true,
        desc: 'Ensures strict data isolation so only your progress, notes, and scores sync'
      },
      {
        label: 'Take 2-Min Diagnostic Test',
        type: 'event',
        event: 'open-diagnostic-test',
        isPrimary: false,
        desc: 'Quick 5-scenario evaluation mapping your immediate learning path'
      },
      {
        label: 'Global Cyber HUD (Alt+N / ?)',
        type: 'event',
        event: 'open-cyber-hud',
        isPrimary: false,
        desc: 'Master hotkeys for instantaneous navigation across all 13 spaces'
      }
    ],
    features: [
      {
        icon: ShieldCheck,
        name: 'Unique User ID Architecture',
        detail: 'Isolated local sandbox preventing cross-user state collisions'
      },
      {
        icon: Compass,
        name: '2-Minute Diagnostic Placement',
        detail: 'Evaluates IAM, S3, and VPC knowledge to suggest exact starting module'
      },
      {
        icon: Flame,
        name: 'Daily Learning Streak Tracker',
        detail: 'Build continuous momentum and study habit from day one'
      }
    ]
  },
  {
    phaseId: 'phase-2',
    phaseNumber: '02',
    timeframe: 'Weeks 01–02',
    timeBadge: 'Days 02 to 14 • Foundations',
    difficulty: 2,
    themeColor: '#10b981',
    hoursEst: '~15 Hours',
    xpReward: '+450 XP',
    title: 'Foundations & Curricula: CIS Benchmarks & Triage Fundamentals',
    objective:
      'When you need to solidify mental models of AWS IAM policies, S3 data boundaries, VPC security groups, and CloudTrail auditing before touching production-grade consoles.',
    whyNow: 'Prevents shallow memorization by pairing official documentation with CIS AWS Foundations Benchmark v3.0 audit readiness meters.',
    deliverable: '5 Triage Incidents Resolved + CIS Benchmark Readiness > 60% + 50 AWS Flashcards Reviewed',
    actions: [
      {
        label: 'Explore Learning Center',
        type: 'link',
        to: '/learning',
        isPrimary: true,
        desc: 'Structured curricula with interactive flashcards, cheat sheets, and audit meters'
      },
      {
        label: 'Start Incident Simulator',
        type: 'link',
        to: '/investigations',
        isPrimary: false,
        desc: 'Solve initial IAM privilege escalation and public S3 bucket leaks'
      },
      {
        label: 'AWS Flashcards (Alt+F)',
        type: 'event',
        event: 'open-flashcards',
        detail: { deckId: 'scs-c02' },
        isPrimary: false,
        desc: 'Spaced repetition drills for AWS Security Specialty certification'
      }
    ],
    features: [
      {
        icon: GraduationCap,
        name: 'Interactive Learning Center',
        detail: 'Deep dives on IAM JSON policies, IMDSv2, KMS envelopes, and VPC peering'
      },
      {
        icon: CheckCircle2,
        name: 'CIS Benchmark Audit Meter',
        detail: 'Real-time score reflecting compliance with industry gold standards'
      },
      {
        icon: Zap,
        name: 'Certification Flashcard Engine',
        detail: 'SCS-C02 and SAA-C03 active recall drills with answer reveals'
      }
    ]
  },
  {
    phaseId: 'phase-3',
    phaseNumber: '03',
    timeframe: 'Weeks 03–04',
    timeBadge: 'Days 15 to 28 • Enterprise Labs',
    difficulty: 3,
    themeColor: '#f59e0b',
    hoursEst: '~20 Hours',
    xpReward: '+650 XP',
    title: 'Real-World Hands-On: 16 Enterprise Labs & Zero-Cost Sentinel',
    objective:
      'When you are ready to apply commands in real terminal sessions and the AWS Management Console with dual step-by-step guidance.',
    whyNow: 'Translates theoretical understanding into muscle memory. With our 1-click Terraform modules and Safe Cost Sentinel, you practice $0 architecture safely.',
    deliverable: '8+ Enterprise Labs Completed + 100% Teardown Verification Proof ($0 Bill Guarantee)',
    actions: [
      {
        label: 'Launch 16 Real Labs',
        type: 'link',
        to: '/labs',
        isPrimary: true,
        desc: 'Dual AWS CLI & Console step-by-step runbooks for real Free Tier accounts'
      },
      {
        label: 'Verified $0 Capstone Projects',
        type: 'link',
        to: '/projects',
        isPrimary: false,
        desc: 'Deploy full-stack secure architectures with verifiable GitHub proof'
      },
      {
        label: 'Safe Cost Sentinel',
        type: 'event',
        event: 'open-cost-sentinel',
        isPrimary: false,
        desc: 'Verify teardown steps and prevent unexpected billing charges'
      }
    ],
    features: [
      {
        icon: Terminal,
        name: '16 Enterprise Cloud Labs',
        detail: 'Step-by-step runbooks with copyable AWS CLI commands & screenshot validation'
      },
      {
        icon: FileCode2,
        name: '1-Click IaC Terraform Stacks',
        detail: 'Downloadable IaC snippets ready for instant terraform apply / destroy'
      },
      {
        icon: ShieldCheck,
        name: 'Safe Lab Cost Sentinel',
        detail: 'Calculates hourly expenses and guides safe zero-cost resource cleanup'
      }
    ]
  },
  {
    phaseId: 'phase-4',
    phaseNumber: '04',
    timeframe: 'Weeks 05–06',
    timeBadge: 'Days 29 to 42 • Live-Fire Arenas',
    difficulty: 4,
    themeColor: '#f43f5e',
    hoursEst: '~25 Hours',
    xpReward: '+850 XP',
    title: 'Adversarial Live-Fire: CTF Battle Rooms & SOC On-Call Internship',
    objective:
      'When you need to test your reflexes under real-time constraints: capture flags in adversarial CTF arenas and handle urgent on-call security incidents under SLA countdown clocks.',
    whyNow: 'Employers look for engineers who stay calm under pressure. This phase proves you can contain live attacks and draft executive handovers.',
    deliverable: '6+ CTF Flags Captured + 5 SLA Incident Tickets Handled + Shift Handover Dossier Exported',
    actions: [
      {
        label: 'Enter CTF Battle Rooms',
        type: 'link',
        to: '/battle-rooms',
        isPrimary: true,
        desc: 'Timed speedrun arena with tiered hints and adversarial challenges'
      },
      {
        label: 'SOC On-Call Simulator',
        type: 'link',
        to: '/internship-simulator',
        isPrimary: false,
        desc: 'Simulate high-pressure shifts with live SLA countdowns and handover reports'
      },
      {
        label: 'SOC Runbook Playbooks',
        type: 'link',
        to: '/playbooks',
        isPrimary: false,
        desc: 'Industrial-grade containment and evidence preservation procedures'
      }
    ],
    features: [
      {
        icon: Skull,
        name: 'CTF Battle Rooms Arena',
        detail: 'Under-10-minute speedrun challenge clock with 1.5x XP multipliers & tiered hints'
      },
      {
        icon: Clock,
        name: 'SOC SLA Countdown Timer',
        detail: 'Live 15m/30m/45m response timers with breach alerts and shift notes'
      },
      {
        icon: Radio,
        name: 'Executive Shift Handover Generator',
        detail: '1-click markdown export documenting containment status for senior management'
      }
    ]
  },
  {
    phaseId: 'phase-5',
    phaseNumber: '05',
    timeframe: 'Weeks 07–08',
    timeBadge: 'Days 43 to 56 • Architecture & DevSecOps',
    difficulty: 5,
    themeColor: '#a855f7',
    hoursEst: '~25 Hours',
    xpReward: '+1,000 XP',
    title: 'Engineering Mastery: Cloudive Studio & Compound Architecture Reviews',
    objective:
      'When you transition from responding to incidents to preventing them at design time: visual architecture modeling, attack graph simulation, and IaC security linting.',
    whyNow: 'Distinguishes junior operators from senior cloud architects who build self-defending cloud topologies and optimize FinOps budgets.',
    deliverable: 'Hardened Terraform Module (.tf) + FinOps Cost Briefing + 5 Multi-Finding Architecture Reviews Graded',
    actions: [
      {
        label: 'Open Cloudive Studio',
        type: 'link',
        to: '/cloudive-studio',
        isPrimary: true,
        desc: 'Visual Builder vs. Defender canvas, live Attack Graph & Terraform generator'
      },
      {
        label: 'Architecture Reviews',
        type: 'link',
        to: '/architecture-reviews',
        isPrimary: false,
        desc: 'Analyze compound multi-service failure modes and blast radius'
      },
      {
        label: '5 Role Career Blueprints',
        type: 'link',
        to: '/ramp-up',
        isPrimary: false,
        desc: 'Map your skills directly to Cloud Security Architect, SecOps, or DevSecOps'
      }
    ],
    features: [
      {
        icon: Cpu,
        name: 'Cloudive Studio Visual Canvas',
        detail: 'Toggle between Builder and Defender modes to inspect trust boundaries'
      },
      {
        icon: Layers,
        name: 'Attack Graph & IaC Linter',
        detail: 'Finds IMDSv1 exposures, overly permissive IAM, and generates compliant .tf code'
      },
      {
        icon: Award,
        name: 'Compound Architecture Scoring',
        detail: 'Identifies how single misconfigurations compound into full data breaches'
      }
    ]
  },
  {
    phaseId: 'phase-6',
    phaseNumber: '06',
    timeframe: 'Weeks 09–10',
    timeBadge: 'Days 57 to 70 • Job Ready',
    difficulty: 5,
    themeColor: '#06b6d4',
    hoursEst: '~15 Hours',
    xpReward: '+1,200 XP',
    title: 'Employment Proof: AI Interview Simulator & Cryptographic Dossier',
    objective:
      'When you are ready to interview for cloud security positions and prove your capabilities to hiring managers with unassailable cryptographic evidence.',
    whyNow: 'Completes your journey. Prepares you for rigorous technical interviews using the STAR method, and equips you with a verifiable certificate dossier.',
    deliverable: '85%+ Interview Simulator Score + Cryptographically Signed Certificate Dossier + Verification QR Code',
    actions: [
      {
        label: 'AI Interview Simulator',
        type: 'link',
        to: '/interview-simulator',
        isPrimary: true,
        desc: 'Technical defense scenarios evaluated across STAR method & production safety'
      },
      {
        label: 'View Security Thinking Report',
        type: 'link',
        to: '/report',
        isPrimary: false,
        desc: 'Holistic portfolio evidence, skill radar, and cognitive reasoning timeline'
      },
      {
        label: 'Export Certificate Dossier',
        type: 'event',
        event: 'open-certificate',
        isPrimary: false,
        desc: 'Cryptographically signed credential with SHA-256 hash & dynamic verification'
      }
    ],
    features: [
      {
        icon: Sparkles,
        name: 'AI Interview Simulator (STAR)',
        detail: 'Evaluates your technical precision, production safety, and communication'
      },
      {
        icon: ShieldCheck,
        name: 'Cryptographic Certificate Verification',
        detail: 'Immutable verification pack with SHA-256 checksum and QR code for LinkedIn'
      },
      {
        icon: Award,
        name: 'Candidate Dossier Exporter',
        detail: 'Generates professional portfolio markdown ready for GitHub and resumes'
      }
    ]
  }
]

export default function PlatformExplorationRoadmap({ compact = false }) {
  const {
    completedLabsCount,
    battleRoomsSolvedCount,
    investigationCompletedCount,
    totalScore,
    internshipReadiness,
    activeProfile
  } = useChallenges()

  // Filter Pathfinder & Search
  const [selectedFilter, setSelectedFilter] = useState('all') // 'all' | 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4' | 'phase-5' | 'phase-6'
  const [searchQuery, setSearchQuery] = useState('')

  // Determine user's active stage
  const recommendedPhaseId = useMemo(() => {
    if (investigationCompletedCount === 0 && completedLabsCount === 0) return 'phase-1'
    if (investigationCompletedCount < 5 || completedLabsCount < 2) return 'phase-2'
    if (completedLabsCount < 8) return 'phase-3'
    if (battleRoomsSolvedCount < 4) return 'phase-4'
    if (totalScore < 400) return 'phase-5'
    return 'phase-6'
  }, [investigationCompletedCount, completedLabsCount, battleRoomsSolvedCount, totalScore])

  // Filtered Phases based on tab pill and search keyword
  const filteredPhases = useMemo(() => {
    let list = ROADMAP_PHASES
    if (selectedFilter !== 'all') {
      list = list.filter(p => p.phaseId === selectedFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.objective.toLowerCase().includes(q) ||
        p.timeframe.toLowerCase().includes(q) ||
        p.deliverable.toLowerCase().includes(q) ||
        p.features.some(f => f.name.toLowerCase().includes(q) || f.detail.toLowerCase().includes(q))
      )
    }
    return list
  }, [selectedFilter, searchQuery])

  const handleActionClick = (action) => {
    playTactileClick()
    if (action.type === 'event') {
      window.dispatchEvent(new CustomEvent(action.event, { detail: action.detail }))
    }
  }

  const handleSelectPhase = (phaseId) => {
    playTabWhoosh()
    setSelectedFilter(phaseId)
  }

  return (
    <div className={`platform-roadmap-wrapper ${compact ? 'is-compact' : ''}`}>
      {/* ── ENCOURAGING DEFENDER TRANSMISSION (SMOOTH ROTATING TRANSITION) ── */}
      <DefenderQuoteCallout category="career" autoCycle={true} cycleIntervalMs={14000} />

      {/* ── ROADMAP MAIN CARD ── */}
      <section className="roadmap-card" aria-label="Platform Exploration Roadmap: When to When Flight Plan">
        <div className="roadmap-header-row">
          <div className="roadmap-title-area">
            <div className="roadmap-eyebrow-chip">
              <Sparkles size={13} />
              <span>SECLOUDIVE MASTER FLIGHT PLAN /// 13 OPERATIONAL WORKSPACES</span>
            </div>
            <h2>
              <Compass size={26} style={{ color: '#38bdf8' }} />
              <span>When To Use What: The 10-Week Platform Roadmap</span>
            </h2>
            <p>
              Clarity is velocity. Follow this sequential order to know exactly when each simulator, enterprise lab, CTF arena, and studio tool should be utilized to achieve maximum engineering depth without cognitive overload.
            </p>
          </div>

          <div className="roadmap-user-status-card">
            <div className="user-status-avatar-ring">
              {activeProfile?.id ? activeProfile.id.slice(0, 2).toUpperCase() : 'GU'}
            </div>
            <div className="user-status-info">
              <span className="user-status-title">Active Security Profile</span>
              <span className="user-status-role">{activeProfile?.role || 'Cloud Security Engineer'}</span>
              <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>
                ID: {activeProfile?.id || 'GUEST-MODE'}
              </span>
            </div>
          </div>
        </div>

        {/* ── 10-WEEK VISUAL PIPELINE TRACKER ── */}
        <div className="roadmap-pipeline-bar">
          <div className="pipeline-meta-row">
            <div className="pipeline-heading">
              <Clock size={15} style={{ color: '#38bdf8' }} />
              <span>10-WEEK CHRONOLOGICAL FLIGHT CORRIDOR</span>
            </div>
            <div className="pipeline-stats-group">
              <span>Total Curriculum: <strong className="pipeline-stat-val">70 Days</strong></span>
              <span>•</span>
              <span>16 Enterprise Labs</span>
              <span>•</span>
              <span>25 Incidents</span>
              <span>•</span>
              <span>8 CTF Rooms</span>
            </div>
          </div>

          <div className="pipeline-nodes-track">
            {ROADMAP_PHASES.map((p) => {
              const isActive = selectedFilter === p.phaseId || (selectedFilter === 'all' && p.phaseId === recommendedPhaseId)
              return (
                <button
                  key={p.phaseId}
                  type="button"
                  onClick={() => handleSelectPhase(p.phaseId)}
                  className={`pipeline-node-btn ${isActive ? 'is-active' : ''}`}
                >
                  <span className="pipeline-node-phase">PHASE {p.phaseNumber}</span>
                  <span className="pipeline-node-time">{p.timeframe}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── PATHFINDER MATRIX: "WHERE SHOULD I START?" ── */}
        <div className="pathfinder-box">
          <div className="pathfinder-left">
            <div className="pathfinder-icon">
              <Compass size={22} />
            </div>
            <div>
              <div className="pathfinder-title">Where Should You Start Today?</div>
              <div className="pathfinder-subtitle">
                Filter by your experience level or search specific tools (IAM, Terraform, CTF, SLA, STAR...)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div className="pathfinder-search-wrap">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search tools or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '11px' }}
                >
                  ×
                </button>
              )}
            </div>

            <div className="pathfinder-pills" role="tablist">
              <button
                type="button"
                className={`pathfinder-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                onClick={() => { playTabWhoosh(); setSelectedFilter('all'); }}
              >
                All Phases
              </button>
              <button
                type="button"
                className={`pathfinder-btn ${selectedFilter === 'phase-1' ? 'active' : ''}`}
                onClick={() => { playTabWhoosh(); setSelectedFilter('phase-1'); }}
              >
                Day 1: Genesis
              </button>
              <button
                type="button"
                className={`pathfinder-btn ${selectedFilter === 'phase-2' ? 'active' : ''}`}
                onClick={() => { playTabWhoosh(); setSelectedFilter('phase-2'); }}
              >
                W1–2: Foundations
              </button>
              <button
                type="button"
                className={`pathfinder-btn ${selectedFilter === 'phase-3' ? 'active' : ''}`}
                onClick={() => { playTabWhoosh(); setSelectedFilter('phase-3'); }}
              >
                W3–4: Enterprise Labs
              </button>
              <button
                type="button"
                className={`pathfinder-btn ${selectedFilter === 'phase-4' ? 'active' : ''}`}
                onClick={() => { playTabWhoosh(); setSelectedFilter('phase-4'); }}
              >
                W5–6: CTF & On-Call
              </button>
              <button
                type="button"
                className={`pathfinder-btn ${selectedFilter === 'phase-5' ? 'active' : ''}`}
                onClick={() => { playTabWhoosh(); setSelectedFilter('phase-5'); }}
              >
                W7–8: Studio
              </button>
              <button
                type="button"
                className={`pathfinder-btn ${selectedFilter === 'phase-6' ? 'active' : ''}`}
                onClick={() => { playTabWhoosh(); setSelectedFilter('phase-6'); }}
              >
                W9–10: AI Interview
              </button>
            </div>
          </div>
        </div>

        {/* ── TIMELINE PROGRESSION LIST ── */}
        <div className="timeline-stages-list">
          {filteredPhases.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(2, 6, 23, 0.6)', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
              <Compass size={32} style={{ color: '#64748b', margin: '0 auto 12px' }} />
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.94rem' }}>No roadmap phases match "{searchQuery}"</div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>Try searching for "IAM", "S3", "CTF", "Labs", "Terraform", or clear filters.</p>
              <button
                type="button"
                className="button button-ghost btn-sm"
                onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}
                style={{ marginTop: '12px' }}
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredPhases.map((phase) => {
              const isRecommended = phase.phaseId === recommendedPhaseId
              return (
                <article
                  key={phase.phaseId}
                  className={`timeline-stage-card ${isRecommended ? 'is-active' : ''}`}
                  id={phase.phaseId}
                  style={{ '--stage-theme-color': phase.themeColor }}
                >
                  {/* Marker Box */}
                  <div className="timeline-marker-box" style={{ borderColor: isRecommended ? '#10b981' : phase.themeColor, color: isRecommended ? '#10b981' : phase.themeColor }}>
                    {phase.phaseNumber}
                    <span>STAGE</span>
                  </div>

                  {/* Content Card */}
                  <div className="timeline-content-card">
                    <div className="stage-top-meta">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          className="stage-phase-badge"
                          style={{
                            background: isRecommended ? 'rgba(16, 185, 129, 0.18)' : `rgba(56, 189, 248, 0.14)`,
                            color: isRecommended ? '#10b981' : phase.themeColor,
                            border: `1px solid ${isRecommended ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.3)'}`
                          }}
                        >
                          {isRecommended ? '★ YOUR CURRENT RECOMMENDED FOCUS' : `PHASE ${phase.phaseNumber}`}
                        </span>

                        <span className="stage-time-badge">
                          <Clock size={12} /> {phase.timeBadge}
                        </span>

                        <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontFamily: 'DM Mono, monospace' }}>
                          ⏱️ {phase.hoursEst}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="stage-difficulty-meter" title={`Difficulty: ${phase.difficulty} / 5`}>
                          <span>TIER:</span>
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <span
                              key={lvl}
                              className={`difficulty-pip ${lvl <= phase.difficulty ? 'filled' : ''}`}
                              style={{ backgroundColor: lvl <= phase.difficulty ? phase.themeColor : undefined }}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: '0.74rem', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontFamily: 'DM Mono, monospace' }}>
                          {phase.xpReward}
                        </span>
                      </div>
                    </div>

                    <h3 className="stage-title">{phase.title}</h3>
                    <p className="stage-objective">{phase.objective}</p>

                    {/* Why Now Callout */}
                    <div className="stage-why-callout" style={{ borderLeftColor: phase.themeColor }}>
                      <strong style={{ color: phase.themeColor }}>When & Why To Follow: </strong>
                      {phase.whyNow}
                    </div>

                    {/* Feature Checklist */}
                    <div className="stage-features-grid">
                      {phase.features.map((feature, idx) => {
                        const Icon = feature.icon
                        return (
                          <div key={idx} className="stage-feature-item">
                            <div className="stage-feature-icon-wrap" style={{ borderColor: `${phase.themeColor}55`, color: phase.themeColor }}>
                              <Icon size={16} />
                            </div>
                            <div className="stage-feature-details">
                              <strong>{feature.name}</strong>
                              <span>{feature.detail}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Actions & Deliverable Row */}
                    <div className="stage-actions-row">
                      <div className="stage-deliverable-tag">
                        <CheckCircle2 size={14} />
                        <span>{phase.deliverable}</span>
                      </div>

                      <div className="stage-cta-group">
                        {phase.actions.map((action, actIdx) => {
                          if (action.type === 'link') {
                            return (
                              <Link
                                key={actIdx}
                                to={action.to}
                                className={`stage-cta-link ${action.isPrimary ? 'primary' : 'ghost'}`}
                                title={action.desc}
                                onClick={() => playTactileClick()}
                              >
                                <span>{action.label}</span>
                                <ArrowRight size={13} />
                              </Link>
                            )
                          }
                          return (
                            <button
                              key={actIdx}
                              type="button"
                              onClick={() => handleActionClick(action)}
                              className={`stage-cta-link ${action.isPrimary ? 'primary' : 'ghost'}`}
                              style={{ cursor: 'pointer', border: 'none' }}
                              title={action.desc}
                            >
                              <span>{action.label}</span>
                              <Zap size={13} />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
