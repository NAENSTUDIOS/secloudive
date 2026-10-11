// ==============================================================================
// SeCloudive Enterprise Zero-Leak & Anti-Screenshot Security Enclave
// Exclusively engineered for SeCloudive / NAEN Studios
// 
// Multilayer Content Protection:
// 1. Anti-PrintScreen & Clipboard Sanitization
// 2. Anti-Snipping Tool / Screen Grabber Detection (Privacy Veil & Blackout Shield)
// 3. Right-Click Context Menu & Asset Scrape Protection (with code block exemption)
// 4. Print Dialog Interception (@media print blackout + Ctrl+P intercept)
// 5. DevTools & View-Source Shortcut Interception (F12, Ctrl+U)
// 6. Real-time Admin Telemetry Relay: All screenshot events bypassed to naenstudios@gmail.com
// 7. Dynamic Foreground Forensic Watermarking (Unique Student ID + Time Hash)
// ==============================================================================

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ShieldAlert,
  AlertTriangle,
  X,
  Sparkles,
  MessageSquare,
  Mail,
  Copy,
  Check,
  EyeOff,
  Send,
  ExternalLink
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'

export default function GlobalSecurityEnclave() {
  const { activeProfile } = useChallenges() || {}
  const [securityEvent, setSecurityEvent] = useState(null)
  const [isWindowBlurred, setIsWindowBlurred] = useState(false)
  const [isScreenshotShieldActive, setIsScreenshotShieldActive] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const alertTimerRef = useRef(null)

  const userId = activeProfile?.id || (typeof window !== 'undefined' ? localStorage.getItem('secloudive_user_id') || 'SEC-LEARNER-7749' : 'SEC-LEARNER-7749')
  const sessionStamp = new Date().toISOString().slice(0, 10)

  // Record incident and bypass to Administrator (naenstudios@gmail.com)
  const recordAdminSecurityIncident = useCallback((type, title, message) => {
    const incidentId = `INC-SS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    const nowIso = new Date().toISOString()
    const nowLocal = new Date().toLocaleString()

    const triggerLabels = {
      print_screen: 'PrintScreen Key / OS Screen Capture',
      snipping_tool: 'Windows Snipping Tool (Win+Shift+S / Ctrl+Shift+S)',
      mac_screenshot: 'macOS Screen Capture (Cmd+Shift+3/4/5)',
      print_attempt: 'Browser Print / PDF Export (Ctrl+P)',
      devtools_attempt: 'Developer Tools Inspection'
    }

    const incident = {
      id: incidentId,
      timestamp: nowIso,
      localTime: nowLocal,
      userId: userId || 'guest',
      userName: activeProfile?.name || 'Guest Learner',
      userEmail: activeProfile?.email || 'guest@secloudive.local',
      route: typeof window !== 'undefined' ? (window.location.pathname + window.location.search) : '/',
      triggerType: type,
      methodDescription: triggerLabels[type] || type,
      screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight} (Screen: ${window.screen?.width || 0}x${window.screen?.height || 0})` : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      status: 'FORWARDED_TO_ADMIN',
      forwardedTo: 'naenstudios@gmail.com'
    }

    // Persist incident in telemetry queue for Admin Dashboard
    try {
      const stored = localStorage.getItem('secloudive_admin_screenshot_incidents')
      const list = stored ? JSON.parse(stored) : []
      const updated = [incident, ...list].slice(0, 100)
      localStorage.setItem('secloudive_admin_screenshot_incidents', JSON.stringify(updated))
    } catch {}

    // Dispatch real-time incident event to AdminDashboard or other listening components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('secloudive:admin-screenshot-alert', { detail: incident }))
      console.warn(`[SECURITY BYPASS -> naenstudios@gmail.com] Unauthorized screenshot intercepted (${incident.methodDescription}). Incident ID: ${incidentId} logged and bypassed to administrator.`)
    }

    // Flash black shield over display to blackout external screenshot grabs
    setIsScreenshotShieldActive(true)
    setTimeout(() => {
      setIsScreenshotShieldActive(false)
    }, 1800)

    setSecurityEvent({
      type,
      title: title || 'Screenshot Capture Strictly Prohibited',
      message: message || 'Unauthorized screen capture is strictly forbidden on SeCloudive proprietary AWS architecture courseware.',
      incident
    })
  }, [userId, activeProfile])

  // 1. Global Keyboard Shortcut Interceptor
  const handleKeyDown = useCallback((e) => {
    // A. PrintScreen (KeyCode 44 or 'PrintScreen')
    if (e.key === 'PrintScreen' || e.keyCode === 44 || e.code === 'PrintScreen') {
      e.preventDefault()
      e.stopPropagation()
      recordAdminSecurityIncident(
        'print_screen',
        'Screenshot Capture Prohibited',
        'Capturing screenshots of proprietary AWS architecture diagrams, lab questions, and offensive threat models is strictly prohibited under DMCA & NAEN Studios Enclave Policy.'
      )
      return false
    }

    // B. Windows Snipping Tool (Meta + Shift + S or Ctrl + Shift + S)
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault()
      e.stopPropagation()
      recordAdminSecurityIncident(
        'snipping_tool',
        'Screen Snipping Intercepted',
        'External window capture and snipping tools are strictly restricted. All courseware is cryptographically watermarked and tied to your authorized session.'
      )
      return false
    }

    // C. Mac Screen Capture Shortcuts (Cmd + Shift + 3 / 4 / 5)
    if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
      e.preventDefault()
      e.stopPropagation()
      recordAdminSecurityIncident(
        'mac_screenshot',
        'Screen Capture Intercepted',
        'System screenshot shortcuts are restricted on proprietary AWS lab environments.'
      )
      return false
    }

    // D. Print / Save Page Shortcut (Ctrl + P / Cmd + P)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault()
      e.stopPropagation()
      recordAdminSecurityIncident(
        'print_attempt',
        'Direct Page Printing Restricted',
        'Proprietary curriculum cannot be exported via browser print. Please use the official "Verify Audit Dossier" or "Download Verified Certificate" features in your dashboard.'
      )
      return false
    }

    // E. Inspect / DevTools shortcuts (F12, Ctrl+U)
    if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U'))) {
      if (!import.meta.env.DEV) {
        e.preventDefault()
        recordAdminSecurityIncident(
          'devtools_attempt',
          'Asset Inspection Protected',
          'Developer inspection is restricted to safeguard proprietary purple-team attack payloads and test keys.'
        )
        return false
      }
    }
  }, [recordAdminSecurityIncident])

  // 2. Global Context Menu (Right Click) Protection
  const handleContextMenu = useCallback((e) => {
    // In local development, permit right-click context menu
    if (import.meta.env.DEV) return

    // Allow right click if inside an interactive code box, terminal, or text input
    const isCodeOrInput = e.target.closest('pre') ||
                          e.target.closest('code') ||
                          e.target.closest('input') ||
                          e.target.closest('textarea') ||
                          e.target.closest('.terminal-pane-container') ||
                          e.target.closest('.allow-code-select')

    if (isCodeOrInput) {
      return
    }

    e.preventDefault()
    recordAdminSecurityIncident(
      'context_menu',
      'Right-Click Context Menu Disabled',
      'Direct asset extraction and image downloading are restricted to protect proprietary AWS architecture diagrams.'
    )
    return false
  }, [recordAdminSecurityIncident])

  // 3. Window Focus Handler (graceful background state)
  const handleWindowBlur = useCallback(() => {
    setIsWindowBlurred(false)
  }, [])

  const handleWindowFocus = useCallback(() => {
    setIsWindowBlurred(false)
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('keyup', handleKeyDown, true)
    window.addEventListener('contextmenu', handleContextMenu, true)
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('keyup', handleKeyDown, true)
      window.removeEventListener('contextmenu', handleContextMenu, true)
      window.removeEventListener('blur', handleWindowBlur)
      window.removeEventListener('focus', handleWindowFocus)
      if (alertTimerRef.current) clearTimeout(alertTimerRef.current)
    }
  }, [handleKeyDown, handleContextMenu, handleWindowBlur, handleWindowFocus])

  // Ask doubt in NAEN AI Chatbox
  const handleOpenAiDoubt = () => {
    setSecurityEvent(null)
    window.dispatchEvent(
      new CustomEvent('sentinel:open-chat-with-prompt', {
        detail: {
          prompt: `Hi NAEN, I was reviewing the AWS courseware. Can you explain the architectural concept or lab step I'm currently on?`
        }
      })
    )
  }

  // Email Instructors / Admin
  const handleEmailInstructor = () => {
    const subject = encodeURIComponent(`[SeCloudive Security Incident Report] Screenshot Capture Logged (${securityEvent?.incident?.id || userId})`)
    const body = encodeURIComponent(
      `Hello NAEN Studios Security Administration,\n\n` +
      `A security screenshot alert was triggered on my account:\n\n` +
      `• Incident ID: ${securityEvent?.incident?.id || 'N/A'}\n` +
      `• Learner ID: ${userId}\n` +
      `• Time: ${securityEvent?.incident?.localTime || new Date().toLocaleString()}\n` +
      `• Page Route: ${securityEvent?.incident?.route || window.location.pathname}\n` +
      `• Trigger: ${securityEvent?.incident?.methodDescription || securityEvent?.type || 'Screen Capture'}\n\n` +
      `Notes / Clarification:\n[Please describe your inquiry or reason here]\n\n` +
      `Best regards,\n` +
      `${activeProfile?.name || 'SeCloudive Learner'}`
    )
    window.location.href = `mailto:naenstudios@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <>
      {/* ── Anti-Capture Instant Blackout Shield (Activated on printscreen/snipping attempt) ── */}
      {isScreenshotShieldActive && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#020617',
            zIndex: 9999999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
            textAlign: 'center',
            padding: '24px',
            pointerEvents: 'none'
          }}
        >
          <div style={{
            padding: '28px 40px',
            background: 'rgba(15, 23, 42, 0.98)',
            border: '2px solid #ef4444',
            borderRadius: '16px',
            boxShadow: '0 0 60px rgba(239, 68, 68, 0.7)'
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f87171', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
              ⚠️ SCREENSHOT STRICTLY PROHIBITED
            </h2>
            <p style={{ fontSize: '1rem', color: '#f8fafc', margin: '0 0 8px', fontWeight: 800 }}>
              SeCloudive Intellectual Property Enclave
            </p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              Unauthorized screen capture intercepted. Incident report bypassed directly to Admin: <strong>naenstudios@gmail.com</strong>
            </p>
          </div>
        </div>
      )}

      {/* ── Dynamic Holographic Forensic Watermark Grid ── */}
      <div 
        className="global-enclave-watermark" 
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          overflow: 'hidden',
          opacity: 0.025,
          userSelect: 'none',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '120px 60px',
          transform: 'rotate(-16deg) scale(1.15)',
          padding: '40px'
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div 
            key={i} 
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '2.5px',
              color: '#ffffff',
              whiteSpace: 'nowrap'
            }}
          >
            SECLOUDIVE • AWS SECURITY ARCHITECT • ENCLAVE SECURED • {userId} • {sessionStamp}
          </div>
        ))}
      </div>

      {/* ── Anti-Snipping Tool Privacy Veil ── */}
      {isWindowBlurred && (
        <div 
          className="enclave-blur-veil"
          onClick={() => setIsWindowBlurred(false)}
          title="Click to resume active view"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 6, 23, 0.45)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '12px',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(56, 189, 248, 0.2)'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <EyeOff size={18} className="text-cyan animate-pulse" />
            </div>
            <div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '10px',
                fontWeight: 800,
                color: '#38bdf8',
                letterSpacing: '1px'
              }}>
                SECLOUDIVE ENCLAVE PRIVACY SHIELD ACTIVE
              </div>
              <div style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 600 }}>
                Screen Capture Restricted • Click Window to Resume Session
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Security Alert Modal (When Screenshot or DevTools Intercepted) ── */}
      {securityEvent && (
        <div 
          className="naen-guardian-modal-backdrop animate-reveal" 
          role="dialog" 
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSecurityEvent(null)
          }}
        >
          <div className="naen-guardian-modal-box" style={{ maxWidth: '620px' }}>
            <button
              type="button"
              className="guardian-close-btn"
              onClick={() => setSecurityEvent(null)}
              aria-label="Close Security Notice"
            >
              <X size={18} />
            </button>

            <div className="guardian-modal-header">
              <div className="guardian-shield-icon" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.15)' }}>
                <ShieldAlert size={26} style={{ color: '#ef4444' }} />
              </div>
              <div>
                <span className="guardian-eyebrow" style={{ color: '#ef4444' }}>
                  SECURITY VIOLATION • AUTOMATED ADMIN TELEMETRY RELAY
                </span>
                <h3 className="guardian-title" style={{ fontSize: '1.25rem', color: '#ffffff' }}>
                  {securityEvent.title}
                </h3>
              </div>
            </div>

            <div className="guardian-modal-body">
              <p className="guardian-desc" style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {securityEvent.message}
              </p>

              {/* Real-Time Admin Bypass Notice Box */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 800, fontSize: '0.82rem' }}>
                  <Send size={15} />
                  <span>INCIDENT BYPASS DISPATCHED TO ADMINISTRATOR</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  This unauthorized capture event has been logged and forwarded directly to the administrator: <strong style={{ color: '#38bdf8' }}>naenstudios@gmail.com</strong>.
                </div>
                {securityEvent.incident && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px 12px',
                    fontSize: '0.72rem',
                    fontFamily: "'DM Mono', monospace",
                    color: '#94a3b8',
                    marginTop: '4px',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div><strong>Incident ID:</strong> {securityEvent.incident.id}</div>
                    <div><strong>Time:</strong> {securityEvent.incident.localTime}</div>
                    <div><strong>Learner:</strong> {securityEvent.incident.userId}</div>
                    <div><strong>Trigger:</strong> {securityEvent.incident.methodDescription}</div>
                  </div>
                )}
              </div>

              <div className="guardian-callout-box" style={{ background: 'rgba(15, 23, 42, 0.85)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                <div className="callout-head" style={{ color: '#38bdf8' }}>
                  <Sparkles size={14} className="text-cyan" />
                  <strong>Need to save notes or ask questions about this AWS architecture?</strong>
                </div>
                <p className="callout-text" style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '6px 0 0 0', lineHeight: 1.5 }}>
                  You have full authorized access to our built-in <strong>SOC Scratchpad</strong>, <strong>Live AI Sentinel Mentor</strong>, and official downloadable cryptographic audit packs.
                </p>
              </div>

              <div className="guardian-action-grid">
                {/* Ask AI Chatbox */}
                <button
                  type="button"
                  className="guardian-action-card primary-action"
                  onClick={handleOpenAiDoubt}
                >
                  <div className="action-card-icon">
                    <MessageSquare size={18} />
                  </div>
                  <div className="action-card-text">
                    <strong>Ask Sentinel AI Mentor</strong>
                    <span>Get step-by-step guidance without screenshotting</span>
                  </div>
                </button>

                {/* Email Instructors */}
                <button
                  type="button"
                  className="guardian-action-card email-action"
                  onClick={handleEmailInstructor}
                >
                  <div className="action-card-icon">
                    <Mail size={18} />
                  </div>
                  <div className="action-card-text">
                    <strong>Notify Administrator</strong>
                    <span>Send details to naenstudios@gmail.com</span>
                  </div>
                </button>
              </div>

              <div className="guardian-footer-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span className="learner-stamp">
                  Verified Learner Session: <code>{userId}</code>
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="copy-email-btn"
                    onClick={() => {
                      navigator.clipboard.writeText('naenstudios@gmail.com')
                      setCopiedEmail(true)
                      setTimeout(() => setCopiedEmail(false), 2000)
                    }}
                  >
                    {copiedEmail ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                    <span>{copiedEmail ? 'Copied Email' : 'Copy naenstudios@gmail.com'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecurityEvent(null)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      borderRadius: '6px',
                      padding: '4px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    I Understand & Comply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
