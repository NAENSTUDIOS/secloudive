import { useState } from 'react'
import { 
  Trophy, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  ArrowUpRight, 
  Sparkles, 
  Target, 
  Award,
  Zap,
  TrendingUp,
  Briefcase
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'

export default function CareerJourneyTrack() {
  const { masterCareerProfile, setTargetCareerRole } = useChallenges()
  const [expandedTierId, setExpandedTierId] = useState(null)

  if (!masterCareerProfile) return null

  const {
    currentTier,
    nextTier,
    isMaxTier,
    promotionProgressPercent,
    targetCareerRole,
    thinkingScore,
    overallReadinessScore,
    metrics
  } = masterCareerProfile

  const tiers = [
    { tier: 1, id: 'beginner', title: 'Beginner', badge: '🌱 Tier 1', roleFocus: 'Cloud Security Fundamentals' },
    { tier: 2, id: 'cloud-learner', title: 'Cloud Learner', badge: '☁️ Tier 2', roleFocus: 'AWS & Cloud Primitives' },
    { tier: 3, id: 'security-intern', title: 'Security Intern', badge: '🎓 Tier 3', roleFocus: 'Incident Triage & Correlation' },
    { tier: 4, id: 'soc-analyst', title: 'SOC Analyst', badge: '🛡️ Tier 4', roleFocus: 'Live Detection & On-Call Pager' },
    { tier: 5, id: 'cloud-security-analyst', title: 'Cloud Security Analyst', badge: '⚡ Tier 5', roleFocus: 'Threat Modeling & Blast Radius' },
    { tier: 6, id: 'devsecops-engineer', title: 'DevSecOps Engineer', badge: '🔧 Tier 6', roleFocus: 'IaC Hardening & CI/CD Gateways' },
    { tier: 7, id: 'cloud-security-engineer', title: 'Cloud Security Engineer', badge: '👑 Tier 7', roleFocus: 'Enterprise Governance & Zero Trust' }
  ]

  const promotionRequirements = nextTier ? [
    {
      label: 'Security Thinking Score',
      current: `${thinkingScore}%`,
      required: `${nextTier.minThinkingScore}%`,
      isMet: thinkingScore >= nextTier.minThinkingScore,
      actionRoute: '/categories',
      actionLabel: 'Solve Challenges'
    },
    {
      label: 'Academy Topics Mastered',
      current: metrics.learningTopicsCount,
      required: nextTier.minLearningTopics,
      isMet: metrics.learningTopicsCount >= nextTier.minLearningTopics,
      actionRoute: '/learning',
      actionLabel: 'Learn in Academy'
    },
    {
      label: 'Security Investigations Solved',
      current: metrics.investigationCompletedCount,
      required: nextTier.minInvestigations,
      isMet: metrics.investigationCompletedCount >= nextTier.minInvestigations,
      actionRoute: '/investigations',
      actionLabel: 'Launch Investigation'
    },
    {
      label: 'Architecture Reviews Executed',
      current: metrics.architectureReviewedCount,
      required: nextTier.minArchitectureReviews,
      isMet: metrics.architectureReviewedCount >= nextTier.minArchitectureReviews,
      actionRoute: '/architecture-reviews',
      actionLabel: 'Review Blueprints'
    },
    {
      label: 'Enterprise SOP Labs Completed',
      current: metrics.completedLabsCount,
      required: nextTier.minLabs,
      isMet: metrics.completedLabsCount >= nextTier.minLabs,
      actionRoute: '/labs',
      actionLabel: 'Run CloudShell Lab'
    },
    {
      label: 'SOC On-Call Incidents Contained',
      current: metrics.simulatorCompletedCount,
      required: nextTier.minInternshipTickets,
      isMet: metrics.simulatorCompletedCount >= nextTier.minInternshipTickets,
      actionRoute: '/internship-simulator',
      actionLabel: 'Triage On-Call Ticket'
    }
  ] : []

  return (
    <section className="career-journey-track-card" aria-label="Unified Cloud Security Career Progression">
      {/* Header with Career Role & Readiness */}
      <div className="journey-header">
        <div className="journey-title-block">
          <div className="journey-eyebrow">
            <span className="pulse-dot" style={{ backgroundColor: '#38bdf8' }} />
            <span>CAREER INTELLIGENCE LAYER /// 7-TIER PROMOTION SYSTEM</span>
          </div>
          <div className="journey-rank-line">
            <h2>
              Current Rank: <span className="text-cyan">{currentTier.title}</span>
            </h2>
            <span className="tier-pill-active">{currentTier.badge}</span>
            <span className="role-focus-pill">{currentTier.roleFocus}</span>
          </div>
          <p className="journey-description">
            {currentTier.description}
          </p>
        </div>

        {/* Career Target & Salary Benchmark */}
        <div className="journey-target-badge">
          <div className="target-metric-item">
            <span className="target-label">TARGET CAREER ROLE</span>
            <select 
              value={targetCareerRole} 
              onChange={(e) => setTargetCareerRole(e.target.value)}
              className="target-role-dropdown"
              aria-label="Target Career Role"
            >
              <option value="Cloud Security Engineer">Cloud Security Engineer</option>
              <option value="Cloud Security Analyst">Cloud Security Analyst</option>
              <option value="DevSecOps Engineer">DevSecOps Engineer</option>
              <option value="SOC Analyst">SOC Analyst</option>
              <option value="Security Intern">Security Intern</option>
            </select>
          </div>
          <div className="target-metric-item">
            <span className="target-label">ESTIMATED MARKET VALUE</span>
            <span className="target-salary-text">{currentTier.salaryRange}</span>
          </div>
          <div className="target-metric-item">
            <span className="target-label">OVERALL CAREER READINESS</span>
            <div className="readiness-gauge">
              <strong className="text-emerald">{overallReadinessScore}%</strong>
              <div className="gauge-track">
                <div className="gauge-fill" style={{ width: `${overallReadinessScore}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Tier Step Progression Map */}
      <div className="journey-timeline-container">
        <div className="journey-timeline-bar" role="list">
          {tiers.map((t, idx) => {
            const isCompleted = t.tier < currentTier.tier
            const isCurrent = t.tier === currentTier.tier
            const isNext = nextTier && t.tier === nextTier.tier
            const isFuture = t.tier > (nextTier?.tier || currentTier.tier)

            let statusClass = 'tier-future'
            if (isCompleted) statusClass = 'tier-completed'
            if (isCurrent) statusClass = 'tier-current'
            if (isNext) statusClass = 'tier-next'

            return (
              <div 
                key={t.id} 
                className={`timeline-step ${statusClass}`}
                role="listitem"
                onClick={() => setExpandedTierId(expandedTierId === t.id ? null : t.id)}
              >
                <div className="step-indicator">
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-emerald" />
                  ) : isCurrent ? (
                    <span className="active-dot" />
                  ) : (
                    <span className="step-num">{t.tier}</span>
                  )}
                </div>
                <div className="step-info">
                  <span className="step-badge">{t.badge}</span>
                  <strong className="step-title">{t.title}</strong>
                  <span className="step-focus">{t.roleFocus}</span>
                </div>
                {idx < tiers.length - 1 && <div className="step-connector" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Next Promotion Checklist Panel */}
      {!isMaxTier && nextTier ? (
        <div className="promotion-readiness-panel">
          <div className="promotion-panel-head">
            <div>
              <span className="promotion-eyebrow">
                <TrendingUp size={13} className="text-cyan" /> NEXT PROMOTION OBJECTIVES
              </span>
              <h3>
                Requirements to Advance to <span className="text-cyan">{nextTier.title}</span> ({nextTier.badge})
              </h3>
            </div>
            <div className="promotion-progress-status">
              <span className="status-label">Promotion Progress</span>
              <strong className="status-percent">{promotionProgressPercent}%</strong>
              <div className="progress-bar-micro">
                <div className="progress-fill-micro" style={{ width: `${promotionProgressPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="promotion-requirements-grid">
            {promotionRequirements.map((req, i) => (
              <div key={i} className={`requirement-card ${req.isMet ? 'req-satisfied' : 'req-pending'}`}>
                <div className="req-header">
                  <div className="req-icon">
                    {req.isMet ? (
                      <CheckCircle2 size={16} className="text-emerald" />
                    ) : (
                      <Target size={16} className="text-amber" />
                    )}
                  </div>
                  <strong className="req-name">{req.label}</strong>
                </div>
                <div className="req-body">
                  <div className="req-metric">
                    <span className="metric-current">{req.current}</span>
                    <span className="metric-divider">/</span>
                    <span className="metric-target">{req.required} Required</span>
                  </div>
                  {!req.isMet ? (
                    <Link to={req.actionRoute} className="req-action-link">
                      {req.actionLabel} <ArrowUpRight size={12} />
                    </Link>
                  ) : (
                    <span className="req-completed-tag">✓ Met</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Unlocked Perks at Current & Next Tier */}
          <div className="tier-perks-row">
            <div className="perk-box">
              <span className="perk-label">Unlocked at Your Level:</span>
              <div className="perk-chips">
                {currentTier.unlockedPerks?.map((perk, idx) => (
                  <span key={idx} className="perk-chip chip-active">✓ {perk}</span>
                ))}
              </div>
            </div>
            <div className="perk-box">
              <span className="perk-label">Unlocked upon Promotion to {nextTier.title}:</span>
              <div className="perk-chips">
                {nextTier.unlockedPerks?.map((perk, idx) => (
                  <span key={idx} className="perk-chip chip-locked">🔒 {perk}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-tier-tribute">
          <Trophy size={28} className="text-amber" />
          <div>
            <h3>Principal Cloud Security Engineer Status Achieved</h3>
            <p>You have demonstrated comprehensive mastery across IAM, architecture, incident triage, and infrastructure as code.</p>
          </div>
        </div>
      )}
    </section>
  )
}
