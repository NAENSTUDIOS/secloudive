// ==============================================================================
// SeCloudive Cyber Security Clearance Modal
// Intercept modal triggered when a user clicks any locked terminal or module
// ==============================================================================

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick, playTabWhoosh } from '../utils/cyberMotionAudio'
import { 
  ShieldAlert, 
  Lock, 
  ArrowRight, 
  Zap, 
  Unlock, 
  X, 
  Terminal, 
  CheckCircle2 
} from 'lucide-react'
import '../styles/clearanceGate.css'

export default function ClearanceGateModal() {
  const navigate = useNavigate()
  const { 
    clearance, 
    sandboxMode, 
    setSandboxMode 
  } = useChallenges() || {}

  const [isOpen, setIsOpen] = useState(false)
  const [modalDetails, setModalDetails] = useState({
    featureKey: 'battle-rooms',
    featureTitle: 'Live Combat Battle Room',
    requiredTierNumber: 3,
    requiredTierName: 'Tier 3 (The Scaling Layer)',
    description: 'This advanced live-fire simulator requires Tier 3 (Scaling Layer) certification. Complete your Kubernetes, CI/CD, and Observability milestones to unlock this terminal.'
  })

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail) {
        setModalDetails(prev => ({
          ...prev,
          ...e.detail
        }))
      }
      playTabWhoosh()
      setIsOpen(true)
    }

    window.addEventListener('open-clearance-gate', handleOpen)
    return () => window.removeEventListener('open-clearance-gate', handleOpen)
  }, [])

  if (!isOpen) return null

  const currentTier = clearance?.tier || 1
  const currentTierPercent = clearance?.currentTierProgressPercent || 0
  const nextMilestone = clearance?.nextMilestone

  const handleClose = () => {
    playTactileClick()
    setIsOpen(false)
  }

  const handleLaunchNext = () => {
    playTactileClick()
    setIsOpen(false)
    if (nextMilestone?.route) {
      navigate(nextMilestone.route)
    } else {
      navigate('/learning')
    }
  }

  const handleOpenDiagnostic = () => {
    playTactileClick()
    setIsOpen(false)
    window.dispatchEvent(new CustomEvent('open-diagnostic-placement'))
  }

  const handleToggleSandbox = () => {
    playTactileClick()
    if (setSandboxMode) {
      setSandboxMode(true)
    }
    setIsOpen(false)
  }

  return (
    <div 
      className="clearance-modal-backdrop" 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="clearance-modal-title"
    >
      <div 
        className="clearance-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Holographic Header */}
        <div className="clearance-header-banner">
          <div className="clearance-banner-badge">
            <Lock size={13} /> SECURITY CLEARANCE LEVEL INSUFFICIENT
          </div>
          <button 
            type="button" 
            onClick={handleClose}
            aria-label="Close Clearance Intercept"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="clearance-body" style={{ padding: '26px' }}>
          <div className="clearance-title-area" style={{ marginBottom: '22px' }}>
            <div className="clearance-lock-hexagon" style={{ width: '48px', height: '48px' }}>
              <ShieldAlert size={24} />
            </div>
            <div className="clearance-title-text">
              <h2 id="clearance-modal-title" style={{ fontSize: '1.25rem' }}>
                Access Restricted: {modalDetails.featureTitle}
              </h2>
              <p style={{ fontSize: '0.88rem' }}>
                {modalDetails.description}
              </p>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="clearance-comparison-deck" style={{ marginBottom: '20px' }}>
            <div className="clearance-deck-card required" style={{ padding: '14px 16px' }}>
              <div className="clearance-deck-label">
                <span>Required Level</span>
                <Lock size={11} color="#f87171" />
              </div>
              <div className="clearance-deck-value" style={{ fontSize: '1rem', color: '#f87171' }}>
                Level 0{modalDetails.requiredTierNumber} Required
              </div>
              <div className="clearance-deck-sub" style={{ fontSize: '0.76rem' }}>
                {modalDetails.requiredTierName}
              </div>
            </div>

            <div className="clearance-deck-card current" style={{ padding: '14px 16px' }}>
              <div className="clearance-deck-label">
                <span>Your Active Level</span>
                <span style={{ color: '#38bdf8' }}>Level 0{currentTier}</span>
              </div>
              <div className="clearance-deck-value" style={{ fontSize: '1rem', color: '#38bdf8' }}>
                {clearance?.tierName || `Tier ${currentTier}`}
              </div>
              <div className="clearance-deck-sub" style={{ fontSize: '0.76rem' }}>
                {currentTierPercent}% Completed of Active Tier
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="clearance-progress-row" style={{ padding: '12px 16px', marginBottom: '20px' }}>
            <div className="clearance-progress-meta">
              <strong style={{ fontSize: '0.78rem' }}>Active Tier Progress:</strong>
              <span>{currentTierPercent}%</span>
            </div>
            <div className="clearance-bar-track">
              <div 
                className="clearance-bar-fill" 
                style={{ width: `${currentTierPercent}%` }} 
              />
            </div>
          </div>

          {/* Directive Note */}
          <div className="clearance-directive-note" style={{ padding: '12px 14px', marginBottom: '22px' }}>
            <Terminal size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '0.82rem' }}>
                <strong>DIRECTIVE:</strong> Complete current milestone{' '}
                <strong style={{ color: '#f8fafc' }}>
                  "{nextMilestone?.title || 'Foundations'}"
                </strong>{' '}
                to advance your clearance level.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="clearance-actions-deck">
            <button 
              type="button" 
              className="clearance-primary-cta"
              onClick={handleLaunchNext}
              style={{ padding: '12px 18px', fontSize: '0.88rem' }}
            >
              <span>Jump to Current Milestone: {nextMilestone?.title?.slice(0, 32) || 'Continue Path'}</span>
              <ArrowRight size={15} />
            </button>

            <div className="clearance-secondary-options">
              <button 
                type="button" 
                className="clearance-bypass-btn"
                onClick={handleOpenDiagnostic}
                style={{ padding: '9px 12px', fontSize: '0.8rem' }}
              >
                <Zap size={13} /> Accelerated Diagnostic Test
              </button>

              <button 
                type="button" 
                className="clearance-sandbox-btn"
                onClick={handleToggleSandbox}
                style={{ padding: '9px 12px', fontSize: '0.8rem' }}
              >
                <Unlock size={13} /> Enable Sandbox Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
