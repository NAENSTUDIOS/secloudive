// ==============================================================================
// SeCloudive Student Learning Pathway & Sandbox Checkpoint
// Guides aspiring students through recommended tier progression with 1-click sandbox access
// ==============================================================================

import { useNavigate } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick } from '../utils/cyberMotionAudio'
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Zap, 
  Unlock, 
  Compass, 
  CheckCircle2, 
  Terminal,
  Sparkles,
  BookOpen,
  GraduationCap
} from 'lucide-react'
import '../styles/clearanceGate.css'

export default function ClearanceGateCheckpoint({
  featureKey = 'battle-rooms',
  featureTitle = 'Hands-On Environment',
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
    <div className="clearance-checkpoint-container" role="region" aria-label="Student Learning Checkpoint">
      <div className="clearance-checkpoint-card" style={{ maxWidth: '640px' }}>
        {/* Pathway Header Banner */}
        <div className="clearance-header-banner" style={{ background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)' }}>
          <div className="clearance-banner-badge" style={{ color: '#38bdf8' }}>
            <GraduationCap size={14} /> RECOMMENDED STUDENT LEARNING PATHWAY
          </div>
          <div className="clearance-hud-id" style={{ color: '#94a3b8' }}>
            PREREQUISITE GUIDE • TIER 0{requiredTierNumber}
          </div>
        </div>

        {/* Card Body */}
        <div className="clearance-body">
          <div className="clearance-title-area">
            <div className="clearance-lock-hexagon" style={{ background: 'rgba(56, 189, 248, 0.12)', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}>
              <Terminal size={28} />
            </div>
            <div className="clearance-title-text">
              <h2>{featureTitle}</h2>
              <p>
                {customDescription || 
                  `This advanced hands-on lab builds upon concepts covered in ${requiredTierName}. You can either follow the recommended foundational path or unlock this lab immediately in Student Sandbox Mode.`}
              </p>
            </div>
          </div>

          {/* Dual Status Comparison Deck */}
          <div className="clearance-comparison-deck">
            {/* Recommended Level */}
            <div className="clearance-deck-card required" style={{ borderColor: 'rgba(56, 189, 248, 0.35)', background: 'rgba(56, 189, 248, 0.06)' }}>
              <div className="clearance-deck-label">
                <span>Recommended Level</span>
                <Sparkles size={12} color="#38bdf8" />
              </div>
              <div className="clearance-deck-value" style={{ color: '#38bdf8' }}>
                Tier 0{requiredTierNumber} Track
              </div>
              <div className="clearance-deck-sub" style={{ color: '#94a3b8' }}>
                {requiredTierName}
              </div>
            </div>

            {/* Current Level */}
            <div className="clearance-deck-card current">
              <div className="clearance-deck-label">
                <span>Your Active Progress</span>
                <span style={{ color: '#34d399' }}>Tier 0{currentTier}</span>
              </div>
              <div className="clearance-deck-value" style={{ color: '#34d399' }}>
                {clearance?.tierName || `Tier ${currentTier}`}
              </div>
              <div className="clearance-deck-sub">
                {currentTierPercent}% Completed in Current Tier
              </div>
            </div>
          </div>

          {/* Directive Note */}
          <div className="clearance-directive-note" style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
            <Sparkles size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                <strong style={{ color: '#38bdf8' }}>Aspiring Student Flexibility:</strong> At SeCloudive, you are never locked out of learning. 
                Want to dive right in? Click <strong>"Unlock in Student Sandbox"</strong> below to explore freely, or follow the structured roadmap step-by-step.
              </p>
            </div>
          </div>

          {/* Actions Deck */}
          <div className="clearance-actions-deck" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Primary Action 1: Instant Sandbox Unlock */}
            <button 
              type="button" 
              className="clearance-primary-cta"
              onClick={handleToggleSandbox}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '14px 20px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(5, 150, 105, 0.35)'
              }}
            >
              <Unlock size={17} />
              <span>Unlock &amp; Explore in Student Sandbox (Instant Access)</span>
            </button>

            {/* Primary Action 2: Follow Recommended Milestone */}
            <button 
              type="button" 
              onClick={handleLaunchNext}
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                padding: '12px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <BookOpen size={15} />
              <span>Recommended First: {nextMilestone?.title?.slice(0, 35) || 'Foundations Milestone'}</span>
              <ArrowRight size={14} />
            </button>

            {/* Secondary Option: Senior Diagnostic Bypass */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button 
                type="button" 
                className="clearance-bypass-btn"
                onClick={handleOpenDiagnostic}
                style={{ flex: 1, padding: '9px 12px', fontSize: '0.78rem' }}
                title="Already know Linux or Docker? Take the 2-minute diagnostic to test out directly"
              >
                <Zap size={14} /> Fast-Track Placement Test
              </button>

              <button 
                type="button" 
                onClick={() => {
                  playTactileClick()
                  navigate('/roadmap')
                }}
                className="clearance-bypass-btn"
                style={{ flex: 1, padding: '9px 12px', fontSize: '0.78rem' }}
              >
                <Compass size={14} /> View 4-Tier Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
