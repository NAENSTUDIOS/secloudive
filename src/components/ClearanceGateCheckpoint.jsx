// ==============================================================================
// SeCloudive Cyber Security Clearance Checkpoint
// Displayed when an uncertified user accesses a gated operational environment
// Features live tier progress, prerequisite rationales, and fast-track diagnostic bypass
// ==============================================================================

import { useNavigate } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick } from '../utils/cyberMotionAudio'
import { 
  ShieldAlert, 
  Lock, 
  ArrowRight, 
  Zap, 
  Unlock, 
  Compass, 
  CheckCircle2, 
  Terminal,
  AlertTriangle,
  RotateCcw
} from 'lucide-react'
import '../styles/clearanceGate.css'

export default function ClearanceGateCheckpoint({
  featureKey = 'battle-rooms',
  featureTitle = 'Gated Terminal',
  requiredTierNumber = 3,
  requiredTierName = 'Tier 3 (The Scaling Layer)',
  customDescription
}) {
  const navigate = useNavigate()
  const { 
    clearance, 
    sandboxMode, 
    setSandboxMode 
  } = useChallenges() || {}

  const currentTier = clearance?.tier || 1
  const currentTierPercent = clearance?.currentTierProgressPercent || 0
  const nextMilestone = clearance?.nextMilestone

  const handleLaunchNext = () => {
    playTactileClick()
    if (nextMilestone?.route) {
      navigate(nextMilestone.route)
    } else {
      navigate('/learning')
    }
  }

  const handleOpenDiagnostic = () => {
    playTactileClick()
    window.dispatchEvent(new CustomEvent('open-diagnostic-placement'))
  }

  const handleToggleSandbox = () => {
    playTactileClick()
    if (setSandboxMode) {
      setSandboxMode(true)
    }
  }

  return (
    <div className="clearance-checkpoint-container" role="alert" aria-live="assertive">
      <div className="clearance-checkpoint-card">
        {/* Holographic Header Banner */}
        <div className="clearance-header-banner">
          <div className="clearance-banner-badge">
            <Lock size={13} /> SECURITY CLEARANCE LEVEL INSUFFICIENT
          </div>
          <div className="clearance-hud-id">
            CLEARANCE-GATE-ID: SEC-{requiredTierNumber}00-DENIED
          </div>
        </div>

        {/* Card Body */}
        <div className="clearance-body">
          <div className="clearance-title-area">
            <div className="clearance-lock-hexagon">
              <ShieldAlert size={28} />
            </div>
            <div className="clearance-title-text">
              <h2>Access Restricted: {featureTitle}</h2>
              <p>
                {customDescription || 
                  `This advanced operational terminal requires ${requiredTierName} certification. Complete your prerequisite learning milestones to unlock this terminal.`}
              </p>
            </div>
          </div>

          {/* Dual Status Comparison Deck */}
          <div className="clearance-comparison-deck">
            {/* Required Level */}
            <div className="clearance-deck-card required">
              <div className="clearance-deck-label">
                <span>Required Clearance</span>
                <Lock size={12} color="#f87171" />
              </div>
              <div className="clearance-deck-value" style={{ color: '#f87171' }}>
                Level 0{requiredTierNumber} Required
              </div>
              <div className="clearance-deck-sub">
                {requiredTierName}
              </div>
            </div>

            {/* Current Level */}
            <div className="clearance-deck-card current">
              <div className="clearance-deck-label">
                <span>Your Active Clearance</span>
                <span style={{ color: '#38bdf8' }}>Level 0{currentTier}</span>
              </div>
              <div className="clearance-deck-value" style={{ color: '#38bdf8' }}>
                {clearance?.tierName || `Tier ${currentTier}`}
              </div>
              <div className="clearance-deck-sub">
                {currentTierPercent}% Completed of Active Tier
              </div>
            </div>
          </div>

          {/* Live Clearance Progress Meter */}
          <div className="clearance-progress-row">
            <div className="clearance-progress-meta">
              <strong>Progress Toward Level 0{Math.min(4, currentTier + 1)} Clearance:</strong>
              <span>{currentTierPercent}% Cleared</span>
            </div>
            <div className="clearance-bar-track">
              <div 
                className="clearance-bar-fill" 
                style={{ width: `${currentTierPercent}%` }} 
              />
            </div>
          </div>

          {/* Directive Note */}
          <div className="clearance-directive-note">
            <Terminal size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p>
                <strong>NEXT STEP DIRECTIVE:</strong> Resume your progression at milestone{' '}
                <strong style={{ color: '#f8fafc' }}>
                  "{nextMilestone?.title || 'Foundations'}"
                </strong>{' '}
                to earn the required cryptographic verification for this terminal.
              </p>
            </div>
          </div>

          {/* Actions Deck */}
          <div className="clearance-actions-deck">
            {/* Primary CTA: Jump to current milestone */}
            <button 
              type="button" 
              className="clearance-primary-cta"
              onClick={handleLaunchNext}
            >
              <span>Jump to Current Milestone: {nextMilestone?.title?.slice(0, 38) || 'Continue Path'}</span>
              <ArrowRight size={16} />
            </button>

            {/* Secondary Option: Senior Diagnostic Bypass & Sandbox Mode */}
            <div className="clearance-secondary-options">
              <button 
                type="button" 
                className="clearance-bypass-btn"
                onClick={handleOpenDiagnostic}
                title="If you are already an experienced Cloud or DevOps engineer, test out of Tier 1 & 2 directly"
              >
                <Zap size={14} /> Accelerated Diagnostic Test
              </button>

              <button 
                type="button" 
                className="clearance-sandbox-btn"
                onClick={handleToggleSandbox}
                title="Unlock all terminals in Sandbox Mode for evaluation purposes"
              >
                <Unlock size={14} /> Preview in Sandbox Mode
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  playTactileClick()
                  navigate('/roadmap')
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Compass size={12} /> View Full 4-Tier Progression Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
