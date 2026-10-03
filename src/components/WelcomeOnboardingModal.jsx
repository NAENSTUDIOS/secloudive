import { useState, useEffect } from 'react'
import {
  Sparkles,
  ShieldCheck,
  Compass,
  Terminal,
  LogIn,
  ArrowRight,
  X,
  CheckCircle2,
  Lock,
  Globe,
  Award,
  Zap,
  Flame,
  Radio,
  UserCheck,
  HelpCircle
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick } from '../utils/cyberMotionAudio'
import SeCloudiveLogo from './SeCloudiveLogo'

export default function WelcomeOnboardingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const { activeProfile, switchToGuestMode } = useChallenges() || {}

  useEffect(() => {
    // Check if user has already dismissed or completed the welcome tour
    const hasSeen = localStorage.getItem('secloudive_welcome_dismissed')
    if (!hasSeen) {
      // Auto-trigger on initial visit with smooth 750ms delay
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 750)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      playTactileClick()
    }
    window.addEventListener('open-welcome-modal', handleOpen)
    return () => window.removeEventListener('open-welcome-modal', handleOpen)
  }, [])

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, dontShowAgain])

  const handleDismiss = () => {
    playTactileClick()
    if (dontShowAgain) {
      localStorage.setItem('secloudive_welcome_dismissed', 'true')
    }
    setIsOpen(false)
  }

  const handleSelectSignIn = () => {
    playTactileClick()
    localStorage.setItem('secloudive_welcome_dismissed', 'true')
    setIsOpen(false)
    window.dispatchEvent(new CustomEvent('open-user-sync-modal'))
  }

  const handleSelectGuest = () => {
    playTactileClick()
    localStorage.setItem('secloudive_welcome_dismissed', 'true')
    if (switchToGuestMode) {
      switchToGuestMode()
    }
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div 
      className="welcome-modal-backdrop" 
      onClick={handleDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div 
        className="welcome-modal-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to SeCloudive"
        style={{
          width: '100%',
          maxWidth: '740px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '18px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Top Cyber Accent Bar */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #38bdf8 0%, #3b82f6 50%, #10b981 100%)',
          boxShadow: '0 0 12px rgba(56, 189, 248, 0.6)'
        }} />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close welcome guide"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'grid',
            placeItems: 'center',
            color: '#94a3b8',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f8fafc'
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8'
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
          }}
        >
          <X size={16} />
        </button>

        {/* Header Section */}
        <div style={{ padding: '32px 32px 20px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '999px',
            padding: '4px 14px',
            marginBottom: '16px'
          }}>
            <Radio size={12} className="animate-pulse" style={{ color: '#38bdf8' }} />
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#38bdf8',
              letterSpacing: '1.2px'
            }}>
              PLATFORM ONBOARDING /// ZERO TO HIRE
            </span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <SeCloudiveLogo size="md" variant="two-tone" glow={true} />
          </div>

          <h2 style={{
            fontSize: 'clamp(1.4rem, 2.8vw, 1.85rem)',
            fontWeight: 800,
            color: '#f8fafc',
            margin: '0 0 10px 0',
            letterSpacing: '-0.5px'
          }}>
            Cloud Security Judgment & Architectural Resilience
          </h2>
          <p style={{
            fontSize: '0.92rem',
            color: '#94a3b8',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Welcome! Select how you would like to begin your training today. You can jump directly into hands-on simulations or sign in to sync your verified certificates.
          </p>
        </div>

        {/* Dual Mode Action Cards (Sign In vs Guest Mode) */}
        <div style={{
          padding: '0 28px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {/* Card 1: Sign In / Claim Unique ID */}
          <div 
            style={{
              background: 'linear-gradient(145deg, rgba(14, 165, 233, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              borderRadius: '14px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.15)',
              position: 'relative'
            }}
          >
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                color: '#38bdf8',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
                marginBottom: '12px'
              }}>
                <Sparkles size={11} />
                <span>RECOMMENDED FOR CAREER PROGRESS</span>
              </div>

              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                Sign In / Claim Unique ID
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 16px' }}>
                Authenticate with Google OAuth, Cloud Account, or claim your Unique Student ID to sync all your XP, completed investigations, and certificates across devices.
              </p>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 20px',
                fontSize: '0.78rem',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={13} style={{ color: '#38bdf8', flexShrink: 0 }} />
                  <span>Cross-device cloud synchronization & instant restore</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={13} style={{ color: '#38bdf8', flexShrink: 0 }} />
                  <span>Verifiable HMAC accreditation certificates</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={13} style={{ color: '#38bdf8', flexShrink: 0 }} />
                  <span>ATS-optimized resume & portfolio dossier export</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleSelectSignIn}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                padding: '11px 18px',
                fontSize: '0.88rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(2, 132, 199, 0.45)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <LogIn size={15} />
              <span>Sign In / Claim ID</span>
            </button>
          </div>

          {/* Card 2: Continue as Guest */}
          <div 
            style={{
              background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '14px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.08)',
              position: 'relative'
            }}
          >
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
                marginBottom: '12px'
              }}>
                <Zap size={11} />
                <span>INSTANT ACCESS • NO SIGNUP</span>
              </div>

              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                Continue in Guest Mode
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 16px' }}>
                Explore all 50+ enterprise SOP labs, CTF battle rooms, and incident investigations instantly without creating an account first.
              </p>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 20px',
                fontSize: '0.78rem',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                  <span>Immediate access with zero registration friction</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                  <span>Progress preserved in local browser sandbox</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                  <span>1-click migrate to permanent ID at any time</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleSelectGuest}
              style={{
                width: '100%',
                background: 'rgba(16, 185, 129, 0.16)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                borderRadius: '8px',
                color: '#34d399',
                padding: '11px 18px',
                fontSize: '0.88rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.28)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.16)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span>Explore as Guest</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* 3 Core Highlights Strip */}
        <div style={{
          background: 'rgba(2, 6, 23, 0.75)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'grid',
              placeItems: 'center',
              color: '#38bdf8',
              flexShrink: 0
            }}>
              <Compass size={14} />
            </div>
            <div>
              <strong style={{ color: '#f8fafc', display: 'block' }}>4-Tier Pathway</strong>
              <span style={{ color: '#64748b' }}>Linux to Multi-Cloud</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'grid',
              placeItems: 'center',
              color: '#fb7185',
              flexShrink: 0
            }}>
              <Terminal size={14} />
            </div>
            <div>
              <strong style={{ color: '#f8fafc', display: 'block' }}>Live Combat Labs</strong>
              <span style={{ color: '#64748b' }}>CTF Battle Rooms & SIEM</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'grid',
              placeItems: 'center',
              color: '#34d399',
              flexShrink: 0
            }}>
              <ShieldCheck size={14} />
            </div>
            <div>
              <strong style={{ color: '#f8fafc', display: 'block' }}>$0 Safe Practice</strong>
              <span style={{ color: '#64748b' }}>Zero surprise bills</span>
            </div>
          </div>
        </div>

        {/* Footer Persistence Strip */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.78rem',
          color: '#94a3b8'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: '#38bdf8' }}
            />
            <span>Don't show this orientation automatically again</span>
          </label>

          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Tip: Press <kbd style={{ padding: '2px 5px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>Esc</kbd> anytime to dismiss
          </span>
        </div>
      </div>
    </div>
  )
}
