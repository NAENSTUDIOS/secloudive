// ==============================================================================
// SeCloudive Structured Learning Path Component
// Interactive 4-Tier Zero-to-Engineer Roadmap with Sequential Level Unlocks
// 100% Live Progress, Real-Time Sync, and Prerequisite Enforcement
// ==============================================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  STRUCTURED_LEARNING_PHASES, 
  getCurrentLearningStage,
  isMilestoneCompleted,
  getPhaseProgress,
  isPhaseUnlocked
} from '../data/structuredLearningPath'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick, playTabWhoosh } from '../utils/cyberMotionAudio'
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Zap, 
  ChevronDown, 
  Lock, 
  Unlock, 
  Compass, 
  Terminal, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink,
  BookOpen,
  Award,
  Circle,
  Check
} from 'lucide-react'
import '../styles/structuredLearning.css'

export default function StructuredLearningPathSection({ className = '' }) {
  const navigate = useNavigate()
  const { 
    progress = {}, 
    battleRoomsSolved = {},
    masterTotalXP = 0,
    sandboxMode,
    setSandboxMode
  } = useChallenges() || {}

  const handleToggleSandbox = (val) => {
    playTactileClick()
    if (setSandboxMode) setSandboxMode(val)
  }

  const currentStage = getCurrentLearningStage(progress, sandboxMode)
  const [expandedPhaseId, setExpandedPhaseId] = useState(currentStage.currentPhase?.id || 'tier-01')

  const togglePhase = (phaseId) => {
    playTabWhoosh()
    setExpandedPhaseId(prev => prev === phaseId ? null : phaseId)
  }

  const handleLaunchMilestone = (route) => {
    playTactileClick()
    navigate(route)
  }

  return (
    <section className={`structured-learning-container ${className}`} id="structured-path" aria-label="Complete Structured Learning Roadmap">
      {/* 🧭 Top Decision Banner: "Where Do I Start?" */}
      <div className="start-here-decision-card">
        <div className="decision-card-header">
          <div className="decision-title-group">
            <span className="decision-badge">
              <Compass size={12} /> STRUCTURED ZERO-CONFUSION DIRECTIVE
            </span>
            <h2>Where Should You Start?</h2>
            <p>4-tier sequential path from core tools to enterprise architecture. Live progress sync. Zero guesswork.</p>

            {/* 4-Tier Visual Orientation Strip */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              {[
                { n: 1, label: 'Core Toolbox',       color: '#38bdf8', icon: '🛠️' },
                { n: 2, label: 'Deployment Layer',   color: '#10b981', icon: '📦' },
                { n: 3, label: 'Scaling Layer',      color: '#a78bfa', icon: '⚡' },
                { n: 4, label: 'Architecture Layer', color: '#f59e0b', icon: '🏛️' }
              ].map(({ n, label, color, icon }) => (
                <span
                  key={n}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.68rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color,
                    background: `${color}18`,
                    border: `1px solid ${color}55`,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {icon} Tier {n}: {label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* Mode Switcher Pill */}
            <div className="mode-toggle-pill" title="Toggle between strict level-by-level unlocking or free preview sandbox mode">
              <button 
                type="button" 
                className={`mode-toggle-btn ${!sandboxMode ? 'active' : ''}`}
                onClick={() => handleToggleSandbox(false)}
              >
                <Lock size={12} /> Strict Level Path
              </button>
              <button 
                type="button" 
                className={`mode-toggle-btn ${sandboxMode ? 'active' : ''}`}
                onClick={() => handleToggleSandbox(true)}
              >
                <Unlock size={12} /> Sandbox Mode
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                Active Level:
              </span>
              <span style={{ 
                background: 'rgba(56, 189, 248, 0.15)', 
                color: '#38bdf8', 
                padding: '4px 10px', 
                borderRadius: '6px', 
                fontSize: '0.78rem', 
                fontFamily: 'monospace',
                fontWeight: 700,
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                LEVEL 0{currentStage.currentStepNumber}
              </span>
            </div>
          </div>
        </div>

        {/* 2 Path Decision Grid */}
        <div className="decision-paths-grid">
          {/* Path 1: Absolute Beginner */}
          <div className="path-choice-card highlighted">
            <div className="path-choice-top">
              <div className="path-choice-icon" style={{ color: '#38bdf8' }}>
                🌱
              </div>
              <div className="path-choice-text">
                <span className="path-choice-tag">RECOMMENDED FOR 80% OF DEFENDERS</span>
                <h3>Brand New to Cloud Security?</h3>
                <p>
                  Start at Step 1. Learn core architecture, Shared Responsibility, and fundamental CLI verification. Zero prerequisites needed.
                </p>
              </div>
            </div>
            <div className="path-choice-footer">
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Estimated: <strong>4-6 Hours</strong> • <strong>+400 XP</strong>
              </span>
              <button 
                type="button" 
                className="button button-primary"
                onClick={() => {
                  playTactileClick()
                  navigate('/learning/foundations/linux-fundamentals')
                }}
                style={{ padding: '8px 16px', fontSize: '0.82rem', background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', fontWeight: 800 }}
              >
                Start Tier 1: Core Toolbox <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Path 2: Experienced Transitioner */}
          <div className="path-choice-card">
            <div className="path-choice-top">
              <div className="path-choice-icon" style={{ color: '#f59e0b' }}>
                ⚡
              </div>
              <div className="path-choice-text">
                <span className="path-choice-tag" style={{ color: '#f59e0b' }}>DIAGNOSTIC PLACEMENT</span>
                <h3>Already Have Cloud or DevOps Experience?</h3>
                <p>
                  Take our 2-minute diagnostic test to assess your IAM and network knowledge and fast-track to Tier 2 or 3.
                </p>
              </div>
            </div>
            <div className="path-choice-footer">
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                10 Diagnostic Questions • Instant Placement
              </span>
              <button 
                type="button" 
                className="button button-ghost"
                onClick={() => {
                  playTactileClick()
                  window.dispatchEvent(new CustomEvent('open-diagnostic-placement'))
                }}
                style={{ padding: '8px 16px', fontSize: '0.82rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b' }}
              >
                Take Diagnostic <Zap size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Journey Callout Banner ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 22px',
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '12px',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Zap size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'monospace', fontWeight: 800 }}>
                ▶ YOUR NEXT RECOMMENDED MILESTONE
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                • Phase 0{currentStage.currentStepNumber}
              </span>
            </div>
            <strong style={{ fontSize: '0.96rem', color: '#f8fafc', display: 'block', marginTop: '2px' }}>
              {currentStage.nextMilestone?.title || 'All Milestones Mastered!'}
            </strong>
          </div>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={() => currentStage.nextMilestone?.route && handleLaunchMilestone(currentStage.nextMilestone.route)}
          style={{ padding: '8px 20px', fontSize: '0.84rem', fontWeight: 700 }}
        >
          Resume Next Step <ArrowRight size={14} />
        </button>
      </div>

      {/* ── Section Heading ── */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="eyebrow" style={{ justifyContent: 'center', marginBottom: '8px' }}>
          <span className="pulse-dot" style={{ background: '#38bdf8' }} /> THE CANONICAL ROADMAP
        </div>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#f8fafc', margin: '0 0 10px', letterSpacing: '-0.8px' }}>
          5 Progressive Phases from Zero to Hire
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '15px', lineHeight: 1.6 }}>
          Complete each phase in order. Every level unlocks automatically as you master the prerequisites, with live progress sync across your entire browser session.
        </p>
      </div>

      {/* ── 4-Tier Interactive Learning Timeline ── */}
      <div className="phases-timeline-wrapper">
        {STRUCTURED_LEARNING_PHASES.map((phase) => {
          const isExpanded = expandedPhaseId === phase.id
          const isActive = currentStage.currentPhase?.id === phase.id
          const isUnlocked = isPhaseUnlocked(phase.phaseNumber, progress, sandboxMode)
          const phaseStats = getPhaseProgress(phase, progress)

          return (
            <div 
              key={phase.id} 
              className={`phase-card ${isActive ? 'active-phase' : ''} ${!isUnlocked ? 'is-locked' : ''}`}
              style={{ '--phase-color': phase.themeColor }}
            >
              {/* Phase Header Bar */}
              <div 
                className="phase-card-header"
                onClick={() => togglePhase(phase.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') togglePhase(phase.id) }}
                aria-expanded={isExpanded}
              >
                <div className="phase-header-left">
                  <div className="phase-icon-badge">
                    {phase.iconEmoji}
                  </div>
                  <div className="phase-title-meta">
                    <div className="phase-code-row">
                      <span className="phase-number-chip">PHASE 0{phase.phaseNumber}</span>
                      <span className="phase-tag-pill">{phase.tag}</span>
                      {isActive && (
                        <span style={{ 
                          fontSize: '9px', 
                          fontFamily: 'monospace', 
                          background: 'rgba(56, 189, 248, 0.2)', 
                          color: '#38bdf8', 
                          padding: '1px 6px', 
                          borderRadius: '4px',
                          fontWeight: 800
                        }}>
                          ▶ CURRENT LEVEL
                        </span>
                      )}
                      {!isUnlocked && (
                        <span style={{ 
                          fontSize: '9px', 
                          fontFamily: 'monospace', 
                          background: 'rgba(245, 158, 11, 0.2)', 
                          color: '#fbbf24', 
                          padding: '1px 6px', 
                          borderRadius: '4px',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <Lock size={9} /> LOCKED
                        </span>
                      )}
                    </div>
                    <h3 className="phase-main-title">{phase.title}</h3>
                    <p className="phase-subtitle">{phase.subtitle}</p>
                  </div>
                </div>

                <div className="phase-header-right">
                  {/* Real-time Progress Bar */}
                  <div className="phase-progress-bar-wrap">
                    <div className="phase-progress-track">
                      <div 
                        className="phase-progress-fill" 
                        style={{ 
                          width: `${isUnlocked ? phaseStats.percent : 0}%`, 
                          background: phase.themeColor 
                        }} 
                      />
                    </div>
                    <div className="phase-progress-label">
                      <span>{isUnlocked ? `${phaseStats.completedCount}/${phaseStats.totalCount} Done` : 'Locked'}</span>
                      <span>{isUnlocked ? `${phaseStats.percent}%` : '0%'}</span>
                    </div>
                  </div>

                  <div className="phase-stat-chips">
                    <span className="stat-chip">
                      <Clock size={12} /> {phase.estimatedTime}
                    </span>
                    <span className="stat-chip" style={{ color: '#facc15' }}>
                      <Zap size={12} /> +{phase.totalXP} XP
                    </span>
                    {phaseStats.isMastered ? (
                      <span className="stat-chip mastered-chip">
                        <Award size={12} /> Mastered
                      </span>
                    ) : !isUnlocked ? (
                      <span className="stat-chip locked-chip">
                        <Lock size={12} /> Locked
                      </span>
                    ) : (
                      <span className="stat-chip live-progress-chip">
                        <CheckCircle2 size={12} /> {phaseStats.completedCount}/{phaseStats.totalCount}
                      </span>
                    )}
                  </div>

                  <ChevronDown size={18} className={`toggle-arrow ${isExpanded ? 'is-open' : ''}`} />
                </div>
              </div>

              {/* Phase Body (Expanded View) */}
              {isExpanded && (
                <div className="phase-card-body">
                  {/* Locked Banner if not unlocked */}
                  {!isUnlocked && (
                    <div className="phase-locked-banner">
                      <Lock size={16} />
                      <div>
                        <strong>Level 0{phase.phaseNumber} is Currently Locked:</strong> Prerequisite: {phase.prerequisite}.
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleToggleSandbox(true)}
                        className="button button-ghost"
                        style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: '11px', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                      >
                        <Unlock size={12} /> Switch to Sandbox Mode
                      </button>
                    </div>
                  )}

                  {/* Summary Callout */}
                  <div className="phase-summary-box">
                    <p>{phase.summary}</p>
                  </div>

                  {/* Core Competencies Unlocked */}
                  <div style={{ marginBottom: '22px' }}>
                    <div className="milestones-section-title">
                      <ShieldCheck size={14} className="text-cyan" />
                      <span>Verified Competencies You Will Master</span>
                    </div>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                      gap: '8px' 
                    }}>
                      {phase.competencies.map((comp, idx) => (
                        <div key={idx} style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '8px', 
                          fontSize: '12.5px', 
                          color: '#cbd5e1', 
                          background: 'rgba(15, 23, 42, 0.6)', 
                          padding: '8px 12px', 
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.04)'
                        }}>
                          <CheckCircle2 size={14} style={{ color: phase.themeColor, flexShrink: 0, marginTop: '2px' }} />
                          <span>{comp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones Grid with Live Dynamic Status */}
                  <div>
                    <div className="milestones-section-title">
                      <Terminal size={14} className="text-cyan" />
                      <span>Phase 0{phase.phaseNumber} Step-by-Step Curriculum Milestones</span>
                    </div>
                    <div className="milestones-grid">
                      {phase.milestones.map((m) => {
                        const isCompleted = isMilestoneCompleted(m, progress)
                        const isNext = !isCompleted && currentStage.nextMilestone?.id === m.id

                        return (
                          <div
                            key={m.id}
                            className={`milestone-item-card ${isCompleted ? 'is-completed' : ''} ${isNext && isUnlocked ? 'is-active-next' : ''} ${!isUnlocked ? 'is-locked' : ''}`}
                            onClick={() => {
                              if (!isUnlocked) {
                                playTactileClick()
                                handleToggleSandbox(true)
                                return
                              }
                              handleLaunchMilestone(m.route)
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                if (isUnlocked) handleLaunchMilestone(m.route)
                              }
                            }}
                          >
                            <div className="milestone-badge-row">
                              <span className={`milestone-type-pill type-${m.type}`}>
                                {m.type}
                              </span>
                              {isCompleted ? (
                                <span className="milestone-status-badge completed">
                                  <CheckCircle2 size={11} /> DONE (+{m.xp} XP)
                                </span>
                              ) : isNext && isUnlocked ? (
                                <span className="milestone-status-badge active-next">
                                  <Zap size={11} /> UP NEXT
                                </span>
                              ) : !isUnlocked ? (
                                <span className="milestone-status-badge locked">
                                  <Lock size={11} /> LOCKED
                                </span>
                              ) : (
                                <span className="milestone-status-badge pending">
                                  +{m.xp} XP
                                </span>
                              )}
                            </div>

                            <h4 className="milestone-title">{m.title}</h4>

                            <div className="milestone-footer-row">
                              <span><Clock size={11} style={{ display: 'inline', marginRight: '3px' }} /> {m.estimatedMinutes} mins</span>
                              {!isUnlocked ? (
                                <span style={{ color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                                  <Lock size={11} /> Click to Unlock
                                </span>
                              ) : isCompleted ? (
                                <span style={{ color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
                                  <CheckCircle2 size={12} /> Complete
                                </span>
                              ) : (
                                <span className="milestone-cta-link">
                                  Launch <ArrowRight size={12} />
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Phase Footer & Launch CTA */}
                  <div className="phase-action-footer">
                    {!isUnlocked ? (
                      <>
                        <div className="phase-prereq-note">
                          <Lock size={13} style={{ color: '#f59e0b' }} />
                          <span style={{ color: '#fbbf24' }}>Prerequisite: {phase.prerequisite}</span>
                        </div>
                        <button 
                          type="button" 
                          className="button button-ghost"
                          onClick={() => handleToggleSandbox(true)}
                          style={{ padding: '8px 16px', fontSize: '0.82rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                        >
                          <Unlock size={13} /> Unlock with Sandbox Mode
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="phase-prereq-note">
                          <ShieldCheck size={13} style={{ color: '#10b981' }} />
                          <span>Level Unlocked • Prerequisites Satisfied</span>
                        </div>

                        <Link 
                          to={phase.primaryAction.route}
                          className="btn-launch-phase"
                          onClick={() => playTactileClick()}
                        >
                          {phaseStats.isMastered ? 'Review Phase' : phase.primaryAction.label} <ArrowRight size={15} />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
