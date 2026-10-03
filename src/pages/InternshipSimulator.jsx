import { useState, useMemo, useEffect } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Flame,
  Globe,
  GraduationCap,
  Layers,
  Lock,
  MessageSquare,
  Radio,
  RefreshCcw,
  Rocket,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal,
  TrendingUp,
  UserCheck,
  Zap,
  Timer,
  Bell,
  BellRing,
  Copy,
  FileDown,
  X,
  FileEdit
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AttackTimeline from '../components/AttackTimeline'
import CareerRoadmap from '../components/CareerRoadmap'
import LabNotesScratchpad from '../components/LabNotesScratchpad'
import DefenderQuoteCallout from '../components/DefenderQuoteCallout'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick } from '../utils/cyberMotionAudio'
import {
  INTERNSHIP_LEVELS,
  PROMOTION_BADGES,
  LIVE_INTERNSHIPS_FEED,
  generateManagerFeedback,
  generateMonthlyPerformanceReview
} from '../data/internshipData'
import '../styles/internship.css'

export default function InternshipSimulator() {
  const {
    threatScenarios,
    investigations,
    progress,
    submitSimulatorInvestigation,
    simulatorCompletedCount,
    investigationCompletedCount,
    architectureReviewedCount,
    scorePercent,
    internshipReadiness,
    internshipProgression,
    quizAnalytics,
    adaptiveRecommendations,
    activeProfile
  } = useChallenges()

  const [activeId, setActiveId] = useState(threatScenarios[0]?.id || 'ticket-001')
  const [selected, setSelected] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(internshipProgression?.currentLevelIndex || 0)
  const [showMonthlyReview, setShowMonthlyReview] = useState(false)
  const [ticketFilter, setTicketFilter] = useState('all') // 'all' | 'critical' | 'open' | 'closed'
  const [pagerAlertActive, setPagerAlertActive] = useState(true)
  const [showHandoffModal, setShowHandoffModal] = useState(false)
  const [copiedHandoff, setCopiedHandoff] = useState(false)

  const scenario = threatScenarios.find(item => item.id === activeId) || threatScenarios[0]
  const isTicketClosed = progress.simulatorScores?.[scenario.id] !== undefined
  const ticketCoverageScore = progress.simulatorScores?.[scenario.id] ?? (submitted ? Math.round((selected.length / Math.max(1, scenario.evidence.length)) * 100) : 0)

  // Incident SLA countdown timer per ticket
  const initialSla = useMemo(() => {
    if (scenario.riskLevel === 'Critical') return 900 // 15 mins
    if (scenario.riskLevel === 'High') return 1800 // 30 mins
    return 2700 // 45 mins
  }, [scenario.riskLevel])

  const [slaTime, setSlaTime] = useState(initialSla)

  useEffect(() => {
    setSlaTime(initialSla)
  }, [scenario.id, initialSla])

  useEffect(() => {
    if (isTicketClosed || submitted) return
    const interval = setInterval(() => {
      setSlaTime(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [isTicketClosed, submitted, scenario.id])

  const formatSla = (secs) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  // Shift Handover Report Generator
  const generateHandoffReport = () => {
    const closedCount = Object.keys(progress.simulatorScores || {}).length
    const openCount = threatScenarios.length - closedCount
    const engineerId = activeProfile?.id || 'GUEST-SOC-OPERATOR'
    const engineerName = activeProfile?.name || 'On-Call SOC Engineer'
    const dateStr = new Date().toISOString().split('T')[0]
    const timeStr = new Date().toLocaleTimeString()

    return `# SECLOUDIVE SOC ON-CALL SHIFT HANDOVER REPORT
**Date:** ${dateStr} | **Time:** ${timeStr}
**On-Call Engineer:** ${engineerName} (ID: ${engineerId})
**Shift Status:** COMPLETED / HANDOFF TO ROTATION SPRINT

---
### 1. Shift Executive Summary
- **Total Queue Assigned:** ${threatScenarios.length} tickets
- **Tickets Remediated & Closed:** ${closedCount}
- **Tickets In-Flight / Escalated:** ${openCount}
- **Active SLA Adherence:** ${slaTime > 0 ? '100% WITHIN SLA' : 'SLA BREACH DETECTED - ESCALATED'}

---
### 2. High-Priority Threat Activity
${threatScenarios.slice(0, 5).map((t, idx) => `
#### ${idx + 1}. [${t.ticket}] ${t.title}
- **Severity:** ${t.riskLevel.toUpperCase()}
- **Category:** ${t.category}
- **Status:** ${progress.simulatorScores?.[t.id] !== undefined ? `CLOSED (${progress.simulatorScores[t.id]}% Evidence Triage Score)` : 'OPEN - Handed off to Next Shift'}
- **Remediation Note:** ${t.remediation ? t.remediation[0] : 'Telemetry isolated.'}
`).join('')}

---
### 3. Immediate Action Items for Incoming On-Call Lead
1. Verify CloudTrail trail integrity and KMS customer managed key policies for pending tickets.
2. Check VPC flow log captures for unexpected cross-region egress to unlisted IPs.
3. Review IAM passrole boundaries on Bedrock agent tool action groups.

*Report cryptographically generated by SeCloudive SOC On-Call Internship Simulator.*`
  }

  // Progression Data
  const { currentLevel, currentLevelIndex, nextLevel, promotionPercent, skillsNeeded } = internshipProgression || {
    currentLevel: INTERNSHIP_LEVELS[0],
    currentLevelIndex: 0,
    nextLevel: INTERNSHIP_LEVELS[1],
    promotionPercent: 25,
    skillsNeeded: ['Close 2 more Weekly Tickets']
  }

  // Active level detail view
  const viewingLevel = INTERNSHIP_LEVELS[selectedLevelIndex] || currentLevel

  // Manager Feedback calculation
  const managerFeedback = useMemo(() => {
    return generateManagerFeedback(
      scenario,
      isTicketClosed ? ticketCoverageScore : (submitted ? ticketCoverageScore : 75),
      selected.length || scenario.evidence.length,
      scenario.evidence.length
    )
  }, [scenario, isTicketClosed, ticketCoverageScore, submitted, selected])

  // Monthly Performance Review
  const monthlyReview = useMemo(() => {
    return generateMonthlyPerformanceReview({
      simulatorCompletedCount,
      investigationCompletedCount,
      scorePercent,
      internshipReadiness
    })
  }, [simulatorCompletedCount, investigationCompletedCount, scorePercent, internshipReadiness])

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return threatScenarios.filter(ticket => {
      const closed = progress.simulatorScores?.[ticket.id] !== undefined
      if (ticketFilter === 'critical') return ticket.riskLevel.toLowerCase() === 'critical'
      if (ticketFilter === 'open') return !closed
      if (ticketFilter === 'closed') return closed
      return true
    })
  }, [threatScenarios, progress.simulatorScores, ticketFilter])

  // Current or next open ticket
  const currentOpenTicket = threatScenarios.find(t => progress.simulatorScores?.[t.id] === undefined) || scenario

  function openTicket(ticket) {
    setActiveId(ticket.id)
    setSelected([])
    setSubmitted(false)
  }

  function submitTicket() {
    if (!selected.length) return
    submitSimulatorInvestigation(scenario, selected)
    setSubmitted(true)
  }

  function handleJumpToTicket(ticketId) {
    setActiveId(ticketId)
    setSelected([])
    setSubmitted(false)
    const el = document.getElementById('ticket-workstation')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Determine which badges are unlocked
  const earnedBadgesMap = useMemo(() => {
    return {
      'badge-intern': simulatorCompletedCount >= 1,
      'badge-iam-investigator': progress.simulatorScores?.['ticket-001'] !== undefined,
      'badge-s3-defender': progress.simulatorScores?.['ticket-002'] !== undefined,
      'badge-threat-hunter': progress.simulatorScores?.['ticket-004'] !== undefined,
      'badge-arch-reviewer': architectureReviewedCount >= 3,
      'badge-analyst-ready': currentLevelIndex >= 2,
      'badge-engineer-candidate': currentLevelIndex >= 4 || internshipReadiness >= 85
    }
  }, [simulatorCompletedCount, progress.simulatorScores, architectureReviewedCount, currentLevelIndex, internshipReadiness])

  return (
    <main className="page-shell internship-container">
      {/* Quick Nav Bar */}
      <nav className="quick-nav-bar" aria-label="Quick navigation">
        <Link to="/dashboard" className="quick-nav-link">📊 Dashboard</Link>
        <Link to="/learning" className="quick-nav-link">📚 Learning Center</Link>
        <Link to="/investigations" className="quick-nav-link">🔍 Investigations</Link>
        <Link to="/architecture-reviews" className="quick-nav-link">🏛️ Architecture Reviews</Link>
        <Link to="/report" className="quick-nav-link">📋 Security Report</Link>
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontFamily: 'DM Mono', color: '#38bdf8', letterSpacing: '0.06em' }}>
          INTERNSHIP COMMAND • LEVEL {currentLevelIndex + 1}/5
        </span>
      </nav>

      {/* ======================================================== */}
      {/* 01 / HEADER: SOC ON-CALL COMMAND */}
      {/* ======================================================== */}
      <header className="internship-header">
        <div className="internship-header-top">
          <div>
            <div className="internship-welcome-eyebrow">
              <span className="pulse-green" /> ROLE: {currentLevel.title.toUpperCase()} /// ON-CALL ROTATION
            </div>
            <h1>
              Cloud Security <em>Internship Command.</em>
            </h1>
            <p>
              Experience realistic on-call engineering: triage weekly tickets, correlate forensic evidence, draft remediation plans, and earn promotions through demonstrable cloud security skill.
            </p>
          </div>

          <div className="internship-meta-actions">
            <div className="internship-level-pill">
              <Briefcase size={16} className="text-cyan" />
              <span>{currentLevel.roleTag} • <strong>{currentLevel.title}</strong></span>
            </div>
            <button
              type="button"
              className="btn-review-trigger"
              onClick={() => setShowMonthlyReview(!showMonthlyReview)}
            >
              <Award size={15} />
              {showMonthlyReview ? 'Hide Monthly Review' : 'View Performance Review'}
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 02 / MAIN PERFORMANCE OVERVIEW (6 KPIS) */}
      {/* ======================================================== */}
      <section className="internship-kpis-grid" aria-label="Performance Overview">
        <div className="internship-kpi-card">
          <div className="internship-kpi-head">
            <span>INTERNSHIP READINESS</span>
            <div className="internship-kpi-icon emerald"><ShieldCheck size={16} /></div>
          </div>
          <strong>{internshipReadiness}%</strong>
          <small>{simulatorCompletedCount} of {threatScenarios.length} tickets closed</small>
          <div className="internship-kpi-bar">
            <i style={{ width: `${internshipReadiness}%`, background: '#10b981' }} />
          </div>
        </div>

        <div className="internship-kpi-card">
          <div className="internship-kpi-head">
            <span>SECURITY THINKING</span>
            <div className="internship-kpi-icon cyan"><Sparkles size={16} /></div>
          </div>
          <strong>{scorePercent}/100</strong>
          <small>Autonomous decision accuracy</small>
          <div className="internship-kpi-bar">
            <i style={{ width: `${scorePercent}%`, background: '#38bdf8' }} />
          </div>
        </div>

        <div className="internship-kpi-card">
          <div className="internship-kpi-head">
            <span>TICKETS CLOSED</span>
            <div className="internship-kpi-icon orange"><FileText size={16} /></div>
          </div>
          <strong>{simulatorCompletedCount} / {threatScenarios.length}</strong>
          <small>Weekly on-call incidents</small>
          <div className="internship-kpi-bar">
            <i style={{ width: `${Math.round((simulatorCompletedCount / threatScenarios.length) * 100)}%`, background: '#f97316' }} />
          </div>
        </div>

        <div className="internship-kpi-card">
          <div className="internship-kpi-head">
            <span>INVESTIGATIONS</span>
            <div className="internship-kpi-icon purple"><Terminal size={16} /></div>
          </div>
          <strong>{investigationCompletedCount} / {investigations.length}</strong>
          <small>Deep forensics & containment</small>
          <div className="internship-kpi-bar">
            <i style={{ width: `${Math.round((investigationCompletedCount / investigations.length) * 100)}%`, background: '#a855f7' }} />
          </div>
        </div>

        <div className="internship-kpi-card">
          <div className="internship-kpi-head">
            <span>ARCH REVIEWS</span>
            <div className="internship-kpi-icon blue"><Layers size={16} /></div>
          </div>
          <strong>{architectureReviewedCount} / 5</strong>
          <small>Well-Architected risk lenses</small>
          <div className="internship-kpi-bar">
            <i style={{ width: `${Math.round((architectureReviewedCount / 5) * 100)}%`, background: '#3b82f6' }} />
          </div>
        </div>

        <div className="internship-kpi-card">
          <div className="internship-kpi-head">
            <span>KNOWLEDGE CHECKS</span>
            <div className="internship-kpi-icon amber"><GraduationCap size={16} /></div>
          </div>
          <strong>{quizAnalytics?.questionsCorrect || 0}</strong>
          <small>{quizAnalytics?.accuracy || 0}% overall quiz accuracy</small>
          <div className="internship-kpi-bar">
            <i style={{ width: `${quizAnalytics?.accuracy || 0}%`, background: '#f59e0b' }} />
          </div>
        </div>
      </section>

      {/* Motivational Defender Quote Callout */}
      <DefenderQuoteCallout 
        category="career" 
        autoCycle={true} 
        cycleIntervalMs={14000} 
        className="internship-quote-callout"
      />

      {/* ======================================================== */}
      {/* 03 / HIGHLIGHTED CURRENT ASSIGNMENT HERO CARD */}
      {/* ======================================================== */}
      <section className="current-assignment-card" aria-label="Current Security Assignment">
        <div>
          <div className="assignment-meta-tags">
            <span className="internship-welcome-eyebrow" style={{ margin: 0, padding: '3px 10px' }}>
              CURRENT SECURITY ASSIGNMENT
            </span>
            <span className={`badge-risk ${currentOpenTicket.riskLevel.toLowerCase()}`}>
              {currentOpenTicket.riskLevel} Risk
            </span>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'DM Mono' }}>
              {currentOpenTicket.ticket} • {currentOpenTicket.category}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> ~25 Mins Triage
            </span>
          </div>
          <h2 className="assignment-title">{currentOpenTicket.title}</h2>
          <p className="assignment-desc">{currentOpenTicket.incidentSummary}</p>
        </div>

        <div className="assignment-actions">
          <button
            type="button"
            className="btn-triage"
            onClick={() => handleJumpToTicket(currentOpenTicket.id)}
          >
            Triage Incident Ticket <ArrowRight size={15} />
          </button>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {isTicketClosed ? '✅ Previously closed • Click to review' : '⚠️ Pending engineering triage'}
          </span>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 04 / MONTHLY PERFORMANCE REVIEW (EXPANDABLE) */}
      {/* ======================================================== */}
      {showMonthlyReview && (
        <section className="monthly-review-card">
          <div className="monthly-review-head">
            <div>
              <div className="internship-welcome-eyebrow" style={{ margin: 0 }}>
                EVALUATION PERIOD /// {monthlyReview.month.toUpperCase()}
              </div>
              <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.4rem', color: '#f8fafc' }}>
                Executive Performance Review
              </h3>
              <small style={{ color: '#94a3b8' }}>Evaluated by: {monthlyReview.evaluator}</small>
            </div>
            <span className={`rating-pill ${monthlyReview.overallRating.includes('Exceeds') ? 'exceeds' : monthlyReview.overallRating.includes('Meets') ? 'meets' : 'growth'}`}>
              {monthlyReview.overallRating}
            </span>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 1rem' }}>
            "{monthlyReview.executiveSummary}"
          </p>

          <div className="review-telemetry-grid">
            <div className="telemetry-item">
              <span>TICKETS CLOSED</span>
              <strong>{monthlyReview.metrics.ticketsClosed}</strong>
            </div>
            <div className="telemetry-item">
              <span>INVESTIGATIONS</span>
              <strong>{monthlyReview.metrics.investigationsSolved}</strong>
            </div>
            <div className="telemetry-item">
              <span>READINESS INDEX</span>
              <strong>{monthlyReview.metrics.readinessIndex}</strong>
            </div>
            <div className="telemetry-item">
              <span>THINKING SCORE</span>
              <strong>{monthlyReview.metrics.thinkingScore}</strong>
            </div>
          </div>

          <div className="manager-feedback-grid">
            <div className="feedback-subcard strengths">
              <h4><CheckCircle2 size={14} /> Demonstrated Strengths</h4>
              <ul>
                {monthlyReview.topStrengths.map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="feedback-subcard growth">
              <h4><Target size={14} /> Next Sprint Growth Objectives</h4>
              <ul>
                {monthlyReview.growthGoals.map(g => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 05 / PROMOTION TRACKER (5 CAREER LEVELS) */}
      {/* ======================================================== */}
      <section className="promotion-tracker-section" aria-label="Career Promotion Tracker">
        <div className="promotion-tracker-heading">
          <div>
            <div className="internship-welcome-eyebrow" style={{ margin: 0 }}>
              CAREER ADVANCEMENT /// 5-TIER PROMOTION PATHWAY
            </div>
            <h2>Promotion Tracker: {currentLevel.title}</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
              Promotions are awarded strictly on verified evidence: closed tickets, completed investigations, and architecture reviews.
            </p>
          </div>

          <div className="promotion-progress-meta">
            <strong>{promotionPercent}%</strong>
            <small>Towards {nextLevel ? nextLevel.title : 'Staff Architect'}</small>
          </div>
        </div>

        {/* 5 Levels Grid */}
        <div className="levels-timeline">
          {INTERNSHIP_LEVELS.map((lvl, idx) => {
            const isCurrent = idx === currentLevelIndex
            const isCompleted = idx < currentLevelIndex
            const isViewing = idx === selectedLevelIndex

            return (
              <div
                key={lvl.id}
                className={`level-node-card ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                style={isViewing ? { borderColor: '#818cf8' } : {}}
                onClick={() => setSelectedLevelIndex(idx)}
              >
                <div className="level-badge-tag">
                  <span>{lvl.roleTag}</span>
                  {isCompleted ? <Check size={13} /> : isCurrent ? <Flame size={13} /> : <Lock size={12} />}
                </div>
                <h4 className="level-title">{lvl.title}</h4>
                <div className="level-req-summary">
                  {lvl.requiredTickets} Tkt • {lvl.requiredInvestigations} Inv • {lvl.requiredScore}%
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Level Responsibilities & Unlocked Skills */}
        <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontFamily: 'DM Mono', fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase' }}>
              {viewingLevel.title} Specifications ({viewingLevel.experienceRange})
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Next Target: {viewingLevel.nextPromotion}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', textTransform: 'uppercase', fontFamily: 'DM Mono', marginBottom: '0.4rem' }}>
                Key Engineering Responsibilities:
              </strong>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.6' }}>
                {viewingLevel.responsibilities.map(r => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', textTransform: 'uppercase', fontFamily: 'DM Mono', marginBottom: '0.4rem' }}>
                Skills & Capabilities Unlocked:
              </strong>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {viewingLevel.skillsUnlocked.map(s => (
                  <span key={s} className="req-chip" style={{ background: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skills needed for next promotion callout */}
        {skillsNeeded && skillsNeeded.length > 0 && (
          <div className="skills-needed-box">
            <strong>REQUIRED FOR NEXT PROMOTION:</strong>
            <div className="skills-needed-chips">
              {skillsNeeded.map(req => (
                <span key={req} className="skill-needed-chip">
                  <Target size={11} style={{ display: 'inline', marginRight: '4px' }} />
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 06 / MANAGER FEEDBACK PANEL */}
      {/* ======================================================== */}
      <section className="manager-feedback-panel" aria-label="Lead Engineer Manager Review">
        <div className="manager-feedback-head">
          <div>
            <div className="internship-welcome-eyebrow" style={{ margin: 0 }}>
              LEAD ARCHITECT FEEDBACK /// {managerFeedback.reviewedBy.toUpperCase()}
            </div>
            <h3 style={{ margin: '0.35rem 0 0', fontSize: '1.3rem', color: '#f8fafc' }}>
              On-Call Investigation Assessment: {scenario.ticket}
            </h3>
          </div>
          <span className={`rating-pill ${managerFeedback.ratingClass}`}>
            {managerFeedback.rating}
          </span>
        </div>

        <div className="manager-quote-block">
          <p>"{managerFeedback.managerNotes}"</p>
          <span className="manager-quote-meta">
            Reviewed by {managerFeedback.reviewedBy} • {managerFeedback.reviewedAt}
          </span>
        </div>

        <div className="manager-feedback-grid">
          <div className="feedback-subcard strengths">
            <h4><CheckCircle2 size={14} /> Strong Engineering Decisions</h4>
            <ul>
              {managerFeedback.strengths.map(s => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="feedback-subcard growth">
            <h4><AlertTriangle size={14} /> Areas to Tighten Up</h4>
            <ul>
              {managerFeedback.areasForImprovement.map(a => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 07 / WEEKLY SECURITY TICKET WORKBENCH */}
      {/* ======================================================== */}
      <section className="ticket-workbench-section" id="ticket-workstation">
        <div style={{ marginBottom: '1rem' }}>
          <div className="internship-welcome-eyebrow">
            INCIDENT WORKBENCH /// ON-CALL TRIAGE QUEUE
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.2rem 0 0.4rem', color: '#f8fafc' }}>
            Active Security Ticket Queue
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            Inspect available telemetry, isolate compromised principals, correlate CloudTrail events, and submit remediation findings.
          </p>
        </div>

        {/* Filters */}
        <div className="workbench-filter-bar">
          <button
            type="button"
            className={`filter-btn ${ticketFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTicketFilter('all')}
          >
            All Tickets ({threatScenarios.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${ticketFilter === 'critical' ? 'active' : ''}`}
            onClick={() => setTicketFilter('critical')}
          >
            Critical Risk
          </button>
          <button
            type="button"
            className={`filter-btn ${ticketFilter === 'open' ? 'active' : ''}`}
            onClick={() => setTicketFilter('open')}
          >
            Open ({threatScenarios.length - simulatorCompletedCount})
          </button>
          <button
            type="button"
            className={`filter-btn ${ticketFilter === 'closed' ? 'active' : ''}`}
            onClick={() => setTicketFilter('closed')}
          >
            Closed ({simulatorCompletedCount})
          </button>
        </div>

        {/* Layout: Sidebar Queue + Active Workspace */}
        <div className="workbench-layout">
          {/* Sidebar */}
          <aside className="tickets-sidebar">
            <div className="tickets-sidebar-head">
              <span>ON-CALL QUEUE</span>
              <strong>{simulatorCompletedCount}/{threatScenarios.length} CLOSED</strong>
            </div>

            <div style={{ maxHeight: '560px', overflowY: 'auto' }}>
              {filteredTickets.map(ticket => {
                const isDone = progress.simulatorScores?.[ticket.id] !== undefined
                const isActive = ticket.id === scenario.id

                return (
                  <button
                    key={ticket.id}
                    type="button"
                    className={`ticket-item-row ${isActive ? 'active' : ''}`}
                    onClick={() => openTicket(ticket)}
                  >
                    <div className="ticket-item-left">
                      <span className="ticket-item-week">{ticket.week} • {ticket.category}</span>
                      <span className="ticket-item-title">{ticket.title}</span>
                    </div>
                    <div className="ticket-item-right">
                      <span className={`badge-risk ${ticket.riskLevel.toLowerCase()}`}>
                        {ticket.riskLevel}
                      </span>
                      {isDone && <CheckCircle2 size={15} style={{ color: '#10b981' }} />}
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Active Workstation */}
          <section className="ticket-active-workstation">
            <div className="workstation-header">
              <div>
                <span className="workstation-kicker">
                  <FileText size={13} /> {scenario.week} / {scenario.ticket} / {scenario.category}
                </span>
                <h3>{scenario.title}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Live SLA Countdown Clock */}
                <div
                  className="sla-countdown-badge"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    background: isTicketClosed 
                      ? 'rgba(16, 185, 129, 0.15)' 
                      : slaTime === 0 
                        ? 'rgba(239, 68, 68, 0.2)' 
                        : 'rgba(15, 23, 42, 0.8)',
                    border: `1px solid ${isTicketClosed ? 'rgba(16, 185, 129, 0.4)' : slaTime === 0 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(56, 189, 248, 0.3)'}`,
                    fontSize: '0.78rem',
                    fontFamily: 'monospace'
                  }}
                  title="Target Resolution SLA based on incident risk level"
                >
                  <Timer size={13} className={slaTime < 300 && !isTicketClosed ? 'text-rose animate-pulse' : 'text-cyan'} />
                  <span style={{ color: isTicketClosed ? '#10b981' : slaTime < 300 ? '#f43f5e' : '#38bdf8', fontWeight: 700 }}>
                    {isTicketClosed ? 'SLA RESOLVED' : slaTime === 0 ? 'SLA BREACH' : `SLA: ${formatSla(slaTime)}`}
                  </span>
                </div>

                {/* Shift Notes Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick()
                    window.dispatchEvent(new CustomEvent('open-lab-notes', { detail: { contextId: `soc-ticket-${scenario.id}` } }))
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Open Shift Notes & Incident Logs"
                >
                  <FileEdit size={13} />
                  <span>Shift Notes</span>
                </button>

                {/* Shift Handoff Report Generator */}
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick()
                    setShowHandoffModal(true)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    background: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    color: '#c084fc',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Generate Executive Shift Handover Report"
                >
                  <FileDown size={13} />
                  <span>Shift Handoff</span>
                </button>

                <span className={`badge-risk ${scenario.riskLevel.toLowerCase()}`}>
                  <AlertTriangle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {scenario.riskLevel} Risk
                </span>
              </div>
            </div>

            <div className="workstation-context-box">
              <strong>INCIDENT CONTEXT & SUMMARY</strong>
              <p>{scenario.incidentSummary}</p>
              <small>{scenario.background}</small>
            </div>

            {/* Evidence Checklist */}
            <div className="evidence-selection-title">
              <span>01 / IDENTIFY & ESCALATE CRITICAL EVIDENCE</span>
              <small style={{ color: '#94a3b8' }}>Flag indicators for the senior response brief</small>
            </div>

            <div className="evidence-options-list">
              {scenario.evidence.map((evidence, index) => {
                const isSelected = selected.includes(index)

                return (
                  <button
                    key={evidence}
                    type="button"
                    className={`evidence-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      if (!submitted) {
                        setSelected(curr =>
                          curr.includes(index) ? curr.filter(i => i !== index) : [...curr, index]
                        )
                      }
                    }}
                  >
                    <div className="evidence-checkbox-icon">
                      {isSelected ? <Check size={14} /> : String(index + 1).padStart(2, '0')}
                    </div>
                    <span>{evidence}</span>
                  </button>
                )
              })}
            </div>

            {/* Results or Submit Button */}
            {submitted || isTicketClosed ? (
              <div className="ticket-solved-results">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontFamily: 'DM Mono', fontSize: '0.72rem', color: '#10b981', textTransform: 'uppercase' }}>
                      EVIDENCE COVERAGE
                    </span>
                    <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.25rem', color: '#f8fafc' }}>
                      {ticketCoverageScore}% Coverage Achieved
                    </h4>
                  </div>
                  <span className="badge-risk" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                    TICKET VERIFIED
                  </span>
                </div>

                <div className="results-grid-2col">
                  <div className="result-block">
                    <span>BUSINESS IMPACT</span>
                    <p>{scenario.impact}</p>
                  </div>

                  <div className="result-block">
                    <span>SENIOR NOTES</span>
                    <p>{scenario.notes}</p>
                  </div>
                </div>

                <div className="result-block" style={{ marginBottom: '1.25rem' }}>
                  <span>REMEDIATION PROTOCOL</span>
                  <ul>
                    {scenario.remediation.map(step => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="filter-btn"
                    onClick={() => {
                      setSubmitted(false)
                      setSelected([])
                    }}
                  >
                    <RefreshCcw size={13} style={{ display: 'inline', marginRight: '6px' }} />
                    Re-open & Retake Ticket
                  </button>
                  <Link to="/report" className="btn-triage" style={{ textDecoration: 'none' }}>
                    View Thinking Report <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-triage"
                  disabled={!selected.length}
                  style={!selected.length ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  onClick={submitTicket}
                >
                  Submit Investigation Findings <ArrowRight size={15} />
                </button>
              </div>
            )}

            {/* Embedded In-Workstation Notes & Shift Log */}
            <LabNotesScratchpad
              contextId={`soc-ticket-${scenario.id}`}
              contextTitle={`SOC Ticket: ${scenario.ticket} - ${scenario.title}`}
              contextType="SOC On-Call Incident"
            />
          </section>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 08 / WHAT A CLOUD SECURITY ENGINEER WOULD DO */}
      {/* ======================================================== */}
      <section className="engineer-guidance-card" aria-label="Senior Engineer Containment Guidance">
        <div className="internship-welcome-eyebrow" style={{ margin: 0, color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.35)', background: 'rgba(16, 185, 129, 0.1)' }}>
          SENIOR MENTORSHIP /// INCIDENT RUNBOOK
        </div>
        <h3><ShieldCheck size={20} /> What a Cloud Security Engineer Would Do</h3>
        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1rem', maxWidth: '850px' }}>
          When triaging live security alerts, senior engineers follow a disciplined containment order of operations to stop adversary lateral movement before attempting root-cause cleanup.
        </p>

        <div className="containment-order-list">
          <div className="containment-step-card">
            <span className="containment-step-num">STEP 01</span>
            <strong>Isolate & Sever Access</strong>
            <p>Revoke active STS sessions, detach standing admin policies, or isolate compromised EC2 instances in an quarantine security group.</p>
          </div>

          <div className="containment-step-card">
            <span className="containment-step-num">STEP 02</span>
            <strong>Preserve Forensics</strong>
            <p>Snapshot attached EBS volumes and verify CloudTrail log integrity before deleting instances or restarting compromised containers.</p>
          </div>

          <div className="containment-step-card">
            <span className="containment-step-num">STEP 03</span>
            <strong>Scope Blast Radius</strong>
            <p>Query CloudWatch Logs Insights across all regions for access keys, assumed roles, and unusual API spikes originating from the same IP.</p>
          </div>

          <div className="containment-step-card">
            <span className="containment-step-num">STEP 04</span>
            <strong>Automate Guardrail</strong>
            <p>Deploy AWS Config rules or Service Control Policies (SCPs) to ensure the anti-pattern cannot be reintroduced by other teams.</p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 09 / ADAPTIVE LEARNING RECOMMENDATIONS CARD */}
      {/* ======================================================== */}
      {adaptiveRecommendations?.recommendations?.[0] && (
        <section style={{ marginTop: '2rem', padding: '1.75rem 2rem', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <div className="internship-welcome-eyebrow" style={{ margin: 0 }}>
              ADAPTIVE MENTOR RECOMMENDATION
            </div>
            <span className={`badge-risk ${adaptiveRecommendations.recommendations[0].priority.includes('Critical') ? 'critical' : 'high'}`}>
              {adaptiveRecommendations.recommendations[0].priority}
            </span>
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.5rem' }}>
            Recommended Next Step: {adaptiveRecommendations.recommendations[0].title}
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1rem' }}>
            <strong>Why this matters:</strong> {adaptiveRecommendations.recommendations[0].reason}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.85rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'DM Mono', display: 'block' }}>SKILL GAP TARGET</span>
              <strong style={{ fontSize: '0.88rem', color: '#f1f5f9' }}>{adaptiveRecommendations.recommendations[0].skillGap}</strong>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'DM Mono', display: 'block' }}>EXPECTED IMPROVEMENT</span>
              <strong style={{ fontSize: '0.88rem', color: '#10b981' }}>{adaptiveRecommendations.recommendations[0].expectedImprovement}</strong>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'DM Mono', display: 'block' }}>ESTIMATED TIME</span>
              <strong style={{ fontSize: '0.88rem', color: '#fb923c' }}>{adaptiveRecommendations.recommendations[0].estimatedTime}</strong>
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.08)', borderLeft: '3px solid #38bdf8', borderRadius: '0 6px 6px 0', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'DM Mono', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Senior Cloud Security Engineer Perspective:
            </span>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#e2e8f0', fontStyle: 'italic' }}>
              "{adaptiveRecommendations.recommendations[0].engineerAdvice}"
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to={adaptiveRecommendations.recommendations[0].actionUrl || '/learning'} className="btn-triage" style={{ textDecoration: 'none' }}>
              Launch Recommended Module <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 10 / PROMOTION BADGES SHELF */}
      {/* ======================================================== */}
      <section className="badges-shelf-section" aria-label="Promotion Badges Shelf">
        <div className="internship-welcome-eyebrow" style={{ margin: 0 }}>
          CREDENTIALS & HONORS /// VERIFIED BADGES
        </div>
        <h3>Promotion Badges & Career Milestones</h3>
        <div className="badges-grid-shelf">
          {PROMOTION_BADGES.map(badge => {
            const isUnlocked = earnedBadgesMap[badge.id]

            return (
              <div
                key={badge.id}
                className={`promotion-badge-item ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="badge-big-icon">{badge.icon}</div>
                <strong>{badge.title}</strong>
                <p>{badge.description}</p>
                <span className="badge-unlock-req">
                  {isUnlocked ? '✅ UNLOCKED' : `🔒 ${badge.unlockedAt}`}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11 / LIVE CLOUD SECURITY INTERNSHIPS FEED (AUTHENTIC LINKS) */}
      {/* ======================================================== */}
      <section className="live-internships-section" aria-label="Live Cloud Security Internships Feed">
        <div className="live-internships-head">
          <div>
            <span className="live-feed-pill">
              <i /> LIVE INTERNSHIP RECRUITMENT FEED
            </span>
            <h2>Active Cloud Security Internships & Career Portals</h2>
            <p>
              Curated official openings from premier security leaders. Links connect directly to official company career portals for the active hiring cycle.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'DM Mono' }}>
              READINESS MATCH INDEX
            </span>
            <strong style={{ display: 'block', fontSize: '1.4rem', color: '#38bdf8' }}>
              {internshipReadiness}% Profile Match
            </strong>
          </div>
        </div>

        <div className="internships-cards-grid">
          {LIVE_INTERNSHIPS_FEED.map(job => (
            <article key={job.id} className="live-internship-card">
              <div className="internship-card-head">
                <div className="company-logo-box">{job.logo}</div>
                <div className="company-title-info">
                  <strong>{job.company}</strong>
                  <h3>{job.role}</h3>
                </div>
                <span className={`internship-status-tag ${job.statusClass}`}>
                  {job.status}
                </span>
              </div>

              <div className="internship-meta-row">
                <span>📍 {job.location}</span>
                <span>🗓️ {job.cycle}</span>
              </div>

              <p className="internship-desc">{job.description}</p>

              <div>
                <div className="requirements-title">KEY FOCUS AREAS / REQUIREMENTS:</div>
                <div className="req-chips-container">
                  {job.requirements.map(req => (
                    <span key={req} className="req-chip">{req}</span>
                  ))}
                </div>
              </div>

              <div className="internship-card-footer">
                <span className="feed-verified-label">{job.verifiedDate}</span>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-apply-portal"
                >
                  Apply on Official Portal <ExternalLink size={13} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 12 / ATTACK TIMELINE VISUALIZER */}
      {/* ======================================================== */}
      <section className="simulator-timeline-section" style={{ marginTop: '3.5rem' }}>
        <div>
          <div className="report-section-label">ATTACK TIMELINE VISUALIZER</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.4rem 0 0.6rem' }}>
            Reconstruct how the breach unfolded.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Security engineers connect CloudTrail timestamps, API sequences, and network flow alerts to map adversary causality under operational pressure.
          </p>
        </div>
        <AttackTimeline events={scenario.timeline} />
      </section>

      {/* Career Roadmap */}
      <CareerRoadmap readiness={internshipReadiness} />

      {/* SHIFT HANDOVER REPORT MODAL */}
      {showHandoffModal && (
        <div className="shortcuts-modal-backdrop" onClick={() => setShowHandoffModal(false)}>
          <div className="shortcuts-modal-card" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
            <div className="shortcuts-header">
              <div className="shortcuts-title-box">
                <FileDown size={20} className="text-purple" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800 }}>
                    SOC On-Call Shift Handover Report
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Executive sprint briefing for incoming SecOps engineering team
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowHandoffModal(false)}
                aria-label="Close modal"
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px 24px', maxHeight: '55vh', overflowY: 'auto' }}>
              <pre style={{ margin: 0, padding: '16px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '10px', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {generateHandoffReport()}
              </pre>
            </div>

            <div style={{ padding: '16px 24px', background: 'rgba(15, 23, 42, 0.6)', borderTop: '1px solid rgba(148, 163, 184, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                ✓ Generated for ID: {activeProfile?.id || 'GUEST-OPERATOR'}
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="button button-ghost btn-sm"
                  onClick={() => {
                    playTactileClick()
                    const report = generateHandoffReport()
                    navigator.clipboard.writeText(report)
                    setCopiedHandoff(true)
                    setTimeout(() => setCopiedHandoff(false), 2000)
                  }}
                >
                  {copiedHandoff ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                  <span>{copiedHandoff ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
                </button>
                <button
                  type="button"
                  className="button button-primary btn-sm"
                  onClick={() => {
                    playTactileClick()
                    const report = generateHandoffReport()
                    const blob = new Blob([report], { type: 'text/markdown' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `SeCloudive_SOC_Shift_Handover_${new Date().toISOString().split('T')[0]}.md`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  }}
                >
                  <FileDown size={14} />
                  <span>Download .md File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
