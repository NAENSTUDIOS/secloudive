import { useState } from 'react'
import { 
  Rocket, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Play,
  RotateCcw
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'

export default function CapstoneMissionsCard() {
  const { masterCareerProfile, toggleCapstoneStep, resetCapstoneProgress } = useChallenges()
  const [activeMissionId, setActiveMissionId] = useState('capstone-1')

  if (!masterCareerProfile?.capstoneMissions) return null

  const { capstoneMissions } = masterCareerProfile
  const activeMission = capstoneMissions.find(m => m.id === activeMissionId) || capstoneMissions[0]

  return (
    <section className="capstone-missions-card" aria-label="End-to-End Enterprise Capstone Missions">
      <div className="capstone-header">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" style={{ backgroundColor: '#a78bfa' }} />
            <span>Capstone Missions • End-to-End Simulations</span>
          </div>
          <h2>
            Multi-Disciplinary Capstone Missions
          </h2>
          <p>
            Large-scale simulations uniting Learning, Investigations, Architecture Reviews, Threat Intel, and Internship On-Call triage into a unified enterprise challenge.
          </p>
        </div>

        {/* Global Capstone Completion Counter */}
        <div className="capstone-badge-stat">
          <Award size={18} className="text-amber" />
          <div>
            <span className="stat-label">COMPLETED MISSIONS</span>
            <strong className="stat-count text-cyan">
              {capstoneMissions.filter(m => m.isFullyCompleted).length} / {capstoneMissions.length} Fully Mastered
            </strong>
          </div>
        </div>
      </div>

      {/* Mission Selector Tabs */}
      <div className="mission-selector-tabs" role="tablist">
        {capstoneMissions.map(m => {
          const isSelected = m.id === activeMission.id
          return (
            <button
              key={m.id}
              type="button"
              className={`mission-tab-btn ${isSelected ? 'active-mission-tab' : ''}`}
              onClick={() => setActiveMissionId(m.id)}
            >
              <div className="mission-tab-meta">
                <span className="mission-domain-pill">{m.domain}</span>
                <span className="mission-xp-tag">+{m.xpReward} XP</span>
              </div>
              <strong className="mission-tab-title">{m.title}</strong>
              <div className="mission-tab-progress-row">
                <div className="progress-track-mini">
                  <div className="progress-fill-mini" style={{ width: `${m.progressPercent}%` }} />
                </div>
                <span>{m.completedSteps}/{m.totalSteps}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Mission Workspace */}
      <div className="active-mission-body">
        <div className="active-mission-overview">
          <div className="mission-headline-block">
            <div className="mission-scenario-tag">
              <Sparkles size={12} className="text-cyan" />
              <span>SCENARIO: {activeMission.scenario}</span>
            </div>
            <h3>{activeMission.title}</h3>
            <p className="mission-narrative">{activeMission.narrative}</p>
          </div>

          <div className="mission-rewards-box">
            <span className="reward-label">REWARDS UPON COMPLETION</span>
            <div className="reward-items">
              <span className="reward-badge">🏆 {activeMission.badge}</span>
              <span className="reward-badge">⚡ +{activeMission.xpReward} XP</span>
              <span className="reward-badge">📈 +{activeMission.readinessBoost}% Readiness</span>
            </div>
            {activeMission.completedSteps > 0 && (
              <button 
                type="button" 
                className="mission-reset-btn"
                onClick={() => resetCapstoneProgress(activeMission.id)}
                title="Reset this mission's manual progress"
              >
                <RotateCcw size={12} /> Reset Progress
              </button>
            )}
          </div>
        </div>

        {/* 5-Step Pipeline Flow */}
        <div className="mission-steps-flow">
          <span className="steps-flow-label">
            EXECUTION PIPELINE ({activeMission.completedSteps} OF {activeMission.totalSteps} STEPS VERIFIED)
          </span>

          <div className="steps-list">
            {activeMission.steps.map((step, idx) => (
              <div 
                key={step.id} 
                className={`mission-step-row ${step.isCompleted ? 'step-verified' : 'step-pending'}`}
              >
                <div className="step-left">
                  <button
                    type="button"
                    className="step-check-btn"
                    onClick={() => toggleCapstoneStep(activeMission.id, step.id)}
                    aria-label={`Mark step ${idx + 1} as ${step.isCompleted ? 'incomplete' : 'complete'}`}
                  >
                    {step.isCompleted ? (
                      <CheckCircle2 size={18} className="text-emerald" />
                    ) : (
                      <span className="empty-check-circle">{idx + 1}</span>
                    )}
                  </button>
                  <div className="step-copy">
                    <div className="step-meta">
                      <span className="step-type-pill">{step.type}</span>
                      {step.isCompleted && <span className="verified-stamp">✓ Verified</span>}
                    </div>
                    <strong className="step-name">{step.title}</strong>
                    <p className="step-desc">{step.description}</p>
                  </div>
                </div>

                <div className="step-action">
                  <Link to={step.route} className="button button-sm button-ghost step-launch-btn">
                    Launch Step <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {activeMission.isFullyCompleted && (
          <div className="mission-complete-banner">
            <Award size={24} className="text-amber" />
            <div>
              <strong>Capstone Mission Completed!</strong>
              <p>You have satisfied all cross-module milestones. Your verified portfolio proof has been updated.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
