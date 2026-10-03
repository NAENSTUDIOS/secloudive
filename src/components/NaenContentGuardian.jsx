// ==============================================================================
// NAEN Studios Anti-Plagiarism & Content Protection Guardian
// Exclusively engineered for NAEN Studios / SeCloudive
// Protects proprietary courseware, attack topologies, and runbooks against unauthorized
// automated scraping, screenshot distribution, and plagiarism by competing platforms.
// ==============================================================================

import { useState, useEffect, useCallback } from 'react'
import { ShieldAlert, Mail, MessageSquare, Copy, Check, Lock, AlertTriangle, X, Sparkles } from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'

export default function NaenContentGuardian({ children, contextTitle = 'Platform Courseware', contextId = '' }) {
  const { activeProfile } = useChallenges() || {}
  const [showProtectionModal, setShowProtectionModal] = useState(false)
  const [protectionReason, setProtectionReason] = useState('screen_capture') // 'screen_capture' | 'context_menu' | 'dev_tools'
  const [copiedEmail, setCopiedEmail] = useState(false)

  const userId = activeProfile?.id || 'SEC-ANON-7749'
  const sessionStamp = new Date().toISOString().slice(0, 10)

  // Trigger modal when screen capture key combinations are detected
  const handleKeyDown = useCallback((e) => {
    // Detect PrintScreen key
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      e.preventDefault()
      setProtectionReason('screen_capture')
      setShowProtectionModal(true)
      return false
    }

    // Detect Windows Snipping Tool (Meta + Shift + S)
    if (e.metaKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
      setProtectionReason('screen_capture')
      setShowProtectionModal(true)
    }

    // Detect browser Print / Save shortcut (Ctrl + P or Ctrl + S)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault()
      setProtectionReason('screen_capture')
      setShowProtectionModal(true)
      return false
    }
  }, [])

  // Right-click interceptor on protected educational content
  const handleContextMenu = (e) => {
    // If the click is inside a pre/code tag, allow standard developer copying
    const isCode = e.target.closest('pre') || e.target.closest('code') || e.target.closest('input') || e.target.closest('textarea')
    if (isCode) {
      return
    }

    e.preventDefault()
    setProtectionReason('context_menu')
    setShowProtectionModal(true)
  }

  useEffect(() => {
    window.addEventListener('keyup', handleKeyDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keyup', handleKeyDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // Action 1: Ask doubt in NAEN AI Chatbox
  const handleAskInChatbox = () => {
    setShowProtectionModal(false)
    window.dispatchEvent(
      new CustomEvent('sentinel:open-chat-with-prompt', {
        detail: {
          prompt: `Hi NAEN, I have a doubt regarding: "${contextTitle}" (${contextId || 'Active Topic'}). Can you explain how this works and clarify this step?`
        }
      })
    )
  }

  // Action 2: Email NAEN Studios directly
  const handleEmailNaenStudios = () => {
    const subject = encodeURIComponent(`[NAEN Studios Student Doubt] ${contextTitle} (${userId})`)
    const body = encodeURIComponent(
      `Hello NAEN Studios Academic Team,\n\n` +
      `I am currently studying on SeCloudive and have a doubt regarding the following material:\n\n` +
      `• Topic / Lab: ${contextTitle}\n` +
      `• Context ID: ${contextId || 'General'}\n` +
      `• Learner User ID: ${userId}\n` +
      `• Date: ${new Date().toUTCString()}\n\n` +
      `My Doubt / Question:\n` +
      `[Please describe your question or issue in detail here]\n\n` +
      `Best regards,\n` +
      `${activeProfile?.name || 'SeCloudive Learner'}`
    )
    window.location.href = `mailto:naenstudios@gmail.com?subject=${subject}&body=${body}`
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('naenstudios@gmail.com')
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  return (
    <div className="naen-content-guardian-wrapper" onContextMenu={handleContextMenu}>
      {/* Subtle Foreground Watermark Tile Pattern */}
      <div className="naen-forensic-watermark" aria-hidden="true">
        <div className="watermark-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="watermark-cell">
              <span>NAEN STUDIOS • {userId} • {sessionStamp} • ALL RIGHTS RESERVED</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actual Protected Children Content */}
      <div className="naen-protected-surface">
        {children}
      </div>

      {/* NAEN Studios Security & Doubt Resolution Modal */}
      {showProtectionModal && (
        <div className="naen-guardian-modal-backdrop animate-reveal" role="dialog" aria-modal="true">
          <div className="naen-guardian-modal-box">
            <button
              type="button"
              className="guardian-close-btn"
              onClick={() => setShowProtectionModal(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="guardian-modal-header">
              <div className="guardian-shield-icon">
                <Lock size={24} className="text-cyan animate-pulse" />
              </div>
              <div>
                <span className="guardian-eyebrow">NAEN STUDIOS • INTELLECTUAL PROPERTY NOTICE</span>
                <h3 className="guardian-title">Proprietary Educational Material Protected</h3>
              </div>
            </div>

            <div className="guardian-modal-body">
              <p className="guardian-desc">
                This curriculum, architecture matrix, and forensic runbook are the exclusive proprietary property of <strong>NAEN Studios</strong>. 
                External screenshot sharing, bulk scraping, or distribution outside the platform is restricted to prevent unauthorized replication by competing learning sites.
              </p>

              <div className="guardian-callout-box">
                <div className="callout-head">
                  <Sparkles size={14} className="text-amber" />
                  <strong>Need help or have a question about this step?</strong>
                </div>
                <p className="callout-text">
                  You have full authorized access to ask doubts directly to our real-time AI mentor or email NAEN Studios instructors for 1-on-1 assistance:
                </p>
              </div>

              <div className="guardian-action-grid">
                {/* Option 1: AI Chatbox Doubt */}
                <button
                  type="button"
                  className="guardian-action-card primary-action"
                  onClick={handleAskInChatbox}
                >
                  <div className="action-card-icon">
                    <MessageSquare size={20} />
                  </div>
                  <div className="action-card-text">
                    <strong>Ask Doubt in NAEN AI Chatbox</strong>
                    <span>Instantly answers questions for "{contextTitle}"</span>
                  </div>
                </button>

                {/* Option 2: Email NAEN Studios */}
                <button
                  type="button"
                  className="guardian-action-card email-action"
                  onClick={handleEmailNaenStudios}
                >
                  <div className="action-card-icon">
                    <Mail size={20} />
                  </div>
                  <div className="action-card-text">
                    <strong>Email Instructor at NAEN Studios</strong>
                    <span>Send question to naenstudios@gmail.com</span>
                  </div>
                </button>
              </div>

              <div className="guardian-footer-meta">
                <span className="learner-stamp">Licensed Learner: <code>{userId}</code></span>
                <button
                  type="button"
                  className="copy-email-btn"
                  onClick={handleCopyEmail}
                >
                  {copiedEmail ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                  <span>{copiedEmail ? 'Copied Email' : 'Copy naenstudios@gmail.com'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
