// ==============================================================================
// NAEN Studios Step-Wise Skill & Career Map Component
// TryHackMe / HackTheBox Style RPG Progression Path
// Exclusively engineered for NAEN Studios • SeCloudive
// Nodes unlock sequentially step-by-step as learners complete prerequisites.
// ==============================================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'
import { SKILL_MAP_NODES, AUDIENCE_PERSONAS } from '../data/learning/stepWiseSkillMap'
import { CLOUD_PROVIDERS } from '../data/multiCloudResources'
import { playTactileClick } from '../utils/cyberMotionAudio'
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Play, 
  ChevronRight, 
  Award, 
  Zap, 
  ShieldAlert, 
  Flame, 
  Sparkles,
  KeyRound,
  ExternalLink,
  Info
} from 'lucide-react'

export default function StepWiseSkillMap({ className = '' }) {
  const navigate = useNavigate()
  const {
    learningTrackMode = 'multi',
    targetCloudSpecialty = 'aws',
    learningPersona = 'student',
    stepWiseUnlocks = ['step-01'],
    unlockStep,
    isStepUnlocked,
    learningTopicsCompleted = [],
    learningQuizScores = {}
  } = useChallenges() || {}

  const [activeNodeModal, setActiveNodeModal] = useState(null)
  const [flagInput, setFlagInput] = useState('')
  const [flagFeedback, setFlagFeedback] = useState(null)

  const activePersonaObj = AUDIENCE_PERSONAS.find(p => p.id === learningPersona) || AUDIENCE_PERSONAS[0]
  const activeCloudObj = CLOUD_PROVIDERS.find(p => p.id === targetCloudSpecialty) || CLOUD_PROVIDERS[0]

  // Calculate overall unlock progress
  const unlockedCount = SKILL_MAP_NODES.filter(node => {
    if (isStepUnlocked) return isStepUnlocked(node.id, node.prerequisiteStepId)
    return (stepWiseUnlocks || ['step-01']).includes(node.id) || node.stepNumber === 1
  }).length

  const progressPercent = Math.round((unlockedCount / SKILL_MAP_NODES.length) * 100)
  const totalXP = SKILL_MAP_NODES.reduce((acc, n) => acc + (n.xpReward || 0), 0)

  const handleLaunchStep = (node) => {
    playTactileClick()
    if (node.handsOnLabRef?.route) {
      navigate(node.handsOnLabRef.route)
    } else if (node.curriculumCheckpoints?.[0]?.pathId) {
      const cp = node.curriculumCheckpoints[0]
      if (cp.topicId) {
        navigate(`/learning/${cp.pathId}/${cp.topicId}`)
      } else {
        navigate(`/learning/${cp.pathId}`)
      }
    }
  }

  const handleClaimFlag = (node) => {
    playTactileClick()
    if (!flagInput.trim()) return

    if (flagInput.trim() === node.flagSecret) {
      setFlagFeedback({ success: true, message: `Flag verified! +${node.xpReward} XP awarded & next step unlocked.` })
      if (unlockStep) {
        const nextNode = SKILL_MAP_NODES.find(n => n.stepNumber === node.stepNumber + 1)
        if (nextNode) {
          unlockStep(nextNode.id)
        }
      }
      setTimeout(() => {
        setFlagFeedback(null)
        setFlagInput('')
        setActiveNodeModal(null)
      }, 1800)
    } else {
      setFlagFeedback({ success: false, message: 'Invalid flag secret. Inspect lab logs or finish the module assessment.' })
    }
  }

  return (
    <div className={`step-wise-skill-map-container ${className}`} role="region" aria-label="Step-Wise Skill Progression Map">
      {/* Top Map Header & Progression Hud */}
      <div className="skill-map-hud-header">
        <div className="map-hud-left">
          <div className="map-naen-pill">
            <Sparkles size={12} />
            <span>NAEN STUDIOS • STEP-WISE ROADMAP ENGINE</span>
          </div>
          <h2 className="map-hud-title">Cloud Defense Progression Map</h2>
          <p className="map-hud-subtitle">
            TryHackMe & HackTheBox style sequential step unlocking. Complete checkpoints, verify hands-on lab telemetry, and unlock high-tier cloud security competencies.
          </p>
          <div className="map-persona-banner">
            <span className="persona-badge-icon">{activePersonaObj.emoji}</span>
            <span className="persona-badge-text">
              Target Profile: <strong>{activePersonaObj.title}</strong> — Recommended starting node: <em>Step {SKILL_MAP_NODES.find(n => n.id === activePersonaObj.recommendedStartingStep)?.stepNumber || 1}</em>
            </span>
          </div>
        </div>

        <div className="map-hud-stats">
          <div className="map-stat-card">
            <span className="stat-label">Unlocked Steps</span>
            <div className="stat-val-group">
              <span className="stat-val-num">{unlockedCount}</span>
              <span className="stat-val-max">/ {SKILL_MAP_NODES.length}</span>
            </div>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="map-stat-card">
            <span className="stat-label">Curriculum Track</span>
            <div className="stat-val-highlight">
              {learningTrackMode === 'multi' ? (
                <span style={{ color: '#38bdf8' }}>5-Cloud Enterprise Master</span>
              ) : (
                <span style={{ color: activeCloudObj.accentColor }}>{activeCloudObj.name} Specialist</span>
              )}
            </div>
            <span className="stat-val-sub">Total XP Pool: {totalXP} XP</span>
          </div>
        </div>
      </div>

      {/* The Visual Sequential Node Path */}
      <div className="skill-map-track-nodes">
        {SKILL_MAP_NODES.map((node, index) => {
          const isUnlocked = isStepUnlocked 
            ? isStepUnlocked(node.id, node.prerequisiteStepId)
            : (stepWiseUnlocks || ['step-01']).includes(node.id) || node.stepNumber === 1

          const isNextInLine = !isUnlocked && (
            node.stepNumber === 1 ||
            (stepWiseUnlocks || ['step-01']).includes(node.prerequisiteStepId)
          )

          return (
            <div 
              key={node.id} 
              className={`skill-node-card ${isUnlocked ? 'unlocked' : 'locked'} ${isNextInLine ? 'next-in-line' : ''}`}
              style={{ '--node-theme': node.themeColor }}
            >
              {/* Connector Line to Next Step */}
              {index < SKILL_MAP_NODES.length - 1 && (
                <div className={`node-connector-line ${isUnlocked ? 'active' : ''}`} />
              )}

              {/* Node Card Header */}
              <div className="node-card-top">
                <div className="node-step-tag">
                  <span className="node-emoji">{node.badgeEmoji}</span>
                  <span className="node-step-number">STEP 0{node.stepNumber}</span>
                  <span className="node-code">{node.code}</span>
                </div>

                <div className="node-status-badge">
                  {isUnlocked ? (
                    <span className="badge-unlocked">
                      <Unlock size={12} /> UNLOCKED
                    </span>
                  ) : (
                    <span className="badge-locked">
                      <Lock size={12} /> LOCKED
                    </span>
                  )}
                </div>
              </div>

              {/* Node Title & Subtitle */}
              <h3 className="node-title">{node.title}</h3>
              <p className="node-subtitle">{node.subtitle}</p>

              {/* Cloud Coverage Indicator */}
              <div className="node-cloud-coverage">
                {learningTrackMode === 'multi' ? (
                  <div className="multi-cloud-tag-row">
                    <span className="tag-lead">5-Cloud Parity:</span>
                    <span className="cloud-chip aws">AWS</span>
                    <span className="cloud-chip azure">Azure</span>
                    <span className="cloud-chip gcp">GCP</span>
                    <span className="cloud-chip oci">OCI</span>
                    <span className="cloud-chip ibm">IBM</span>
                  </div>
                ) : (
                  <div className="single-cloud-tag-row">
                    <span className="tag-lead">{activeCloudObj.name}:</span>
                    <span className="cloud-service-spec" style={{ color: activeCloudObj.accentColor }}>
                      {node.cloudPrims[targetCloudSpecialty] || node.cloudPrims.aws}
                    </span>
                  </div>
                )}
              </div>

              {/* Node Summary */}
              <p className="node-summary-text">{node.summary}</p>

              {/* Checkpoints Preview */}
              <div className="node-checkpoints-list">
                <span className="checkpoints-heading">Verified Curriculum Milestones:</span>
                <ul>
                  {node.curriculumCheckpoints.map(cp => (
                    <li key={cp.id} className="checkpoint-item">
                      <CheckCircle2 size={13} className="cp-icon" />
                      <span>{cp.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Node Card Actions Footer */}
              <div className="node-card-footer">
                <div className="node-meta-left">
                  <span className="meta-time">{node.estimatedTime}</span>
                  <span className="meta-xp">+{node.xpReward} XP</span>
                  <span className="meta-diff" style={{ borderColor: node.themeColor, color: node.themeColor }}>
                    {node.difficulty}
                  </span>
                </div>

                <div className="node-action-right">
                  {isUnlocked ? (
                    <div className="unlocked-actions-group">
                      <button
                        type="button"
                        className="btn-launch-step"
                        onClick={() => handleLaunchStep(node)}
                      >
                        <Play size={13} fill="currentColor" />
                        <span>Launch Lab</span>
                      </button>
                      <button
                        type="button"
                        className="btn-flag-check"
                        onClick={() => setActiveNodeModal(node)}
                        title="Submit CTF Flag or View Unlock Proof"
                      >
                        <KeyRound size={13} />
                        <span>Submit Flag</span>
                      </button>
                    </div>
                  ) : (
                    <div className="locked-action-group">
                      <button
                        type="button"
                        className="btn-locked-step"
                        onClick={() => setActiveNodeModal(node)}
                      >
                        <Lock size={13} />
                        <span>Unlock Requirements</span>
                      </button>
                      {isNextInLine && unlockStep && (
                        <button
                          type="button"
                          className="btn-force-unlock"
                          onClick={() => {
                            playTactileClick()
                            unlockStep(node.id)
                          }}
                          title="Verify Prerequisites & Unlock Node"
                        >
                          <Sparkles size={11} />
                          <span>Unlock Step</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Flag / Step Unlock Details Modal */}
      {activeNodeModal && (
        <div className="node-details-modal-overlay" onClick={() => setActiveNodeModal(null)}>
          <div className="node-details-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row" style={{ borderBottomColor: activeNodeModal.themeColor }}>
              <div className="modal-title-group">
                <span className="modal-step-tag">STEP 0{activeNodeModal.stepNumber} • {activeNodeModal.code}</span>
                <h3 className="modal-node-title">{activeNodeModal.title}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setActiveNodeModal(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-content">
              {/* Unlock Requirement Box */}
              <div className="unlock-criteria-callout">
                <Info size={16} className="info-icon" />
                <div>
                  <strong>Unlock Criteria:</strong>
                  <p>{activeNodeModal.unlockCriteriaText}</p>
                </div>
              </div>

              {/* 5-Cloud Crosswalk for this specific node */}
              <div className="node-cloud-crosswalk-modal">
                <h4 className="crosswalk-title">5-Cloud Architecture Primitives for this Level:</h4>
                <div className="crosswalk-grid-modal">
                  <div className="cloud-spec-row">
                    <span className="cloud-label aws">AWS:</span>
                    <span className="cloud-val">{activeNodeModal.cloudPrims.aws}</span>
                  </div>
                  <div className="cloud-spec-row">
                    <span className="cloud-label azure">Azure:</span>
                    <span className="cloud-val">{activeNodeModal.cloudPrims.azure}</span>
                  </div>
                  <div className="cloud-spec-row">
                    <span className="cloud-label gcp">GCP:</span>
                    <span className="cloud-val">{activeNodeModal.cloudPrims.gcp}</span>
                  </div>
                  <div className="cloud-spec-row">
                    <span className="cloud-label oci">OCI:</span>
                    <span className="cloud-val">{activeNodeModal.cloudPrims.oci}</span>
                  </div>
                  <div className="cloud-spec-row">
                    <span className="cloud-label ibm">IBM:</span>
                    <span className="cloud-val">{activeNodeModal.cloudPrims.ibm}</span>
                  </div>
                </div>
              </div>

              {/* CTF Flag Submission for this Step */}
              <div className="flag-submission-section">
                <h4 className="flag-section-title">
                  <KeyRound size={15} style={{ color: activeNodeModal.themeColor }} />
                  <span>TryHackMe / HackTheBox CTF Flag Verification</span>
                </h4>
                <p className="flag-instructions">
                  Obtained the proof of remediation flag after completing this step's real lab or incident triage? Enter it below:
                </p>
                
                <div className="flag-input-group">
                  <input
                    type="text"
                    className="flag-text-input"
                    placeholder="NAEN{FLAG_HERE} or enter secret"
                    value={flagInput}
                    onChange={e => setFlagInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="flag-submit-btn"
                    onClick={() => handleClaimFlag(activeNodeModal)}
                  >
                    Verify Flag
                  </button>
                </div>

                {flagFeedback && (
                  <div className={`flag-feedback-alert ${flagFeedback.success ? 'success' : 'error'}`}>
                    {flagFeedback.success ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                    <span>{flagFeedback.message}</span>
                  </div>
                )}

                <div className="hint-flag-box">
                  <small>Lab Instructor Flag Secret for this Step: <code>{activeNodeModal.flagSecret}</code></small>
                </div>
              </div>
            </div>

            <div className="modal-footer-row">
              <button
                type="button"
                className="button button-ghost"
                onClick={() => setActiveNodeModal(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  setActiveNodeModal(null)
                  handleLaunchStep(activeNodeModal)
                }}
              >
                Launch Assigned Lab & Modules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
