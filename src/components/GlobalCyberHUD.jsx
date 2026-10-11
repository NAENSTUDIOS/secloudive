// =========================================================================
// SeCloudive - Global Cyber HUD & Floating Quick Tools
// Multi-tool floating docking station with universal hotkeys
// =========================================================================

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Zap,
  Terminal,
  FileEdit,
  Award,
  Compass,
  Radio,
  User,
  HelpCircle,
  X,
  Volume2,
  VolumeX,
  ChevronUp,
  Cpu,
  MessageSquare
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { isAudioFXEnabled, setAudioFXEnabled, playTactileClick, playTabWhoosh } from '../utils/cyberMotionAudio'
import '../styles/globalCyberHud.css'

export default function GlobalCyberHUD() {
  const location = useLocation()
  const navigate = useNavigate()
  const { activeProfile } = useChallenges() || {}
  const [isOpen, setIsOpen] = useState(false)
  const [showShortcutsModal, setShowShortcutsModal] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(() => isAudioFXEnabled())

  const userId = activeProfile?.id || 'guest'
  const isGuest = Boolean(activeProfile?.isGuest || userId === 'guest')

  // Universal keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input, textarea, or contentEditable
      const tag = e.target?.tagName?.toLowerCase()
      const isInput = tag === 'input' || tag === 'textarea' || e.target?.isContentEditable

      if (e.key === 'Escape') {
        setIsOpen(false)
        setShowShortcutsModal(false)
        return
      }

      // Alt + N or Ctrl + Shift + N -> Notes
      if ((e.altKey && e.key.toLowerCase() === 'n') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'n')) {
        e.preventDefault()
        playTactileClick()
        window.dispatchEvent(new CustomEvent('toggle-lab-notes'))
        return
      }

      // Alt + F or Ctrl + Shift + F -> Flashcards
      if ((e.altKey && e.key.toLowerCase() === 'f') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f')) {
        e.preventDefault()
        playTactileClick()
        window.dispatchEvent(new CustomEvent('open-flashcards', { detail: { deckId: 'scs-c02' } }))
        return
      }

      // Alt + D or Ctrl + Shift + D -> Diagnostic Placement
      if ((e.altKey && e.key.toLowerCase() === 'd') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault()
        playTactileClick()
        window.dispatchEvent(new CustomEvent('open-diagnostic-test'))
        return
      }

      // Alt + P or Ctrl + Shift + P -> Edge Latency Ping
      if ((e.altKey && e.key.toLowerCase() === 'p') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p')) {
        e.preventDefault()
        playTactileClick()
        window.dispatchEvent(new CustomEvent('open-latency-monitor'))
        return
      }

      // Alt + U or Ctrl + Shift + U -> User ID & Sync
      if ((e.altKey && e.key.toLowerCase() === 'u') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'u')) {
        e.preventDefault()
        playTactileClick()
        window.dispatchEvent(new CustomEvent('open-user-sync-modal'))
        return
      }

      // Alt + R or Ctrl + Shift + R -> Platform Exploration Roadmap
      if ((e.altKey && e.key.toLowerCase() === 'r') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r')) {
        e.preventDefault()
        playTactileClick()
        navigate('/roadmap')
        return
      }

      // Alt + O -> Security Profile & Dossier
      if ((e.altKey && e.key.toLowerCase() === 'o') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o')) {
        e.preventDefault()
        playTactileClick()
        navigate('/profile')
        return
      }

      // Alt + C -> Community Comms Deck
      if ((e.altKey && e.key.toLowerCase() === 'c') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault()
        playTactileClick()
        navigate('/dashboard#comms-deck')
        return
      }

      // Alt + H or Ctrl + Shift + H -> Platform Compass & Clarity Guide
      if ((e.altKey && e.key.toLowerCase() === 'h') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h')) {
        e.preventDefault()
        playTactileClick()
        window.dispatchEvent(new CustomEvent('open-platform-guide'))
        return
      }

      // '?' key when not in an input -> Shortcuts Guide
      if (e.key === '?' && !isInput && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault()
        playTactileClick()
        setShowShortcutsModal(prev => !prev)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto-close on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const toggleHud = () => {
    playTactileClick()
    setIsOpen(prev => !prev)
  }

  const handleAction = (eventName, detail) => {
    playTactileClick()
    setIsOpen(false)
    window.dispatchEvent(new CustomEvent(eventName, { detail }))
  }

  const toggleAudio = () => {
    const next = !audioEnabled
    setAudioEnabled(next)
    setAudioFXEnabled(next)
    if (next) playTactileClick()
  }

  return (
    <>
      <div className="cyber-hud-container" role="region" aria-label="Global Cyber HUD Actions">
        {/* Expanded Quick Action Palette */}
        {isOpen && (
          <div className="cyber-hud-palette">
            <div className="hud-palette-header">
              <span>CYBER COMMAND DOCK</span>
              <span className="hud-user-tag">{isGuest ? 'GUEST' : `ID: ${userId.slice(0, 10)}`}</span>
            </div>

            {/* Tool 1: Universal Notes */}
            <button
              type="button"
              className="hud-item-btn"
              onClick={() => handleAction('toggle-lab-notes')}
              title="Open Notes & Technical Scratchpad (Alt+N)"
            >
              <div className="hud-item-left">
                <div className="hud-item-icon text-cyan">
                  <FileEdit size={14} />
                </div>
                <span>Notes & Scratchpad</span>
              </div>
              <kbd className="hud-kbd">Alt+N</kbd>
            </button>

            {/* Tool 2: AWS Flashcards */}
            <button
              type="button"
              className="hud-item-btn"
              onClick={() => handleAction('open-flashcards', { deckId: 'scs-c02' })}
              title="Open AWS Certification Flashcards & Drills (Alt+F)"
            >
              <div className="hud-item-left">
                <div className="hud-item-icon text-amber">
                  <Zap size={14} />
                </div>
                <span>AWS Flashcards</span>
              </div>
              <kbd className="hud-kbd">Alt+F</kbd>
            </button>

            {/* Tool 3: Diagnostic Skill Baseline */}
            <button
              type="button"
              className="hud-item-btn"
              onClick={() => handleAction('open-diagnostic-test')}
              title="Take 2-Minute Diagnostic Skill Placement Test (Alt+D)"
            >
              <div className="hud-item-left">
                <div className="hud-item-icon text-emerald">
                  <Compass size={14} />
                </div>
                <span>Skill Baseline Test</span>
              </div>
              <kbd className="hud-kbd">Alt+D</kbd>
            </button>

            {/* Tool 4: AWS Edge Ping Latency */}
            <button
              type="button"
              className="hud-item-btn"
              onClick={() => handleAction('open-latency-monitor')}
              title="Test Live HTTP Latency to 8 AWS Global Regions (Alt+P)"
            >
              <div className="hud-item-left">
                <div className="hud-item-icon text-sky">
                  <Radio size={14} />
                </div>
                <span>AWS Edge Latency</span>
              </div>
              <kbd className="hud-kbd">Alt+P</kbd>
            </button>

            {/* Tool 5: User ID & Data Sync */}
            <button
              type="button"
              className="hud-item-btn"
              onClick={() => handleAction('open-user-sync-modal')}
              title="Manage User ID, Data Isolation & Cloud Sync (Alt+U)"
            >
              <div className="hud-item-left">
                <div className="hud-item-icon text-purple">
                  <User size={14} />
                </div>
                <span>User ID & Sync</span>
              </div>
              <kbd className="hud-kbd">Alt+U</kbd>
            </button>

            {/* Tool: Security Profile & Dossier */}
            <button
              type="button"
              className="hud-item-btn"
              onClick={() => { playTactileClick(); setIsOpen(false); navigate('/profile'); }}
              title="Open Security Profile & Cryptographic Career Dossier (Alt+O)"
            >
              <div className="hud-item-left">
                <div className="hud-item-icon text-cyan">
                  <User size={14} />
                </div>
                <span>Profile &amp; Dossier</span>
              </div>
              <kbd className="hud-kbd">Alt+O</kbd>
            </button>

            {/* Tool: Community Comms Deck */}
            <button
              type="button"
              className="hud-item-btn"
              onClick={() => { playTactileClick(); setIsOpen(false); navigate('/dashboard#comms-deck'); }}
              title="Open Global Security Comms Deck & Free Chat (Alt+C)"
            >
              <div className="hud-item-left">
                <div className="hud-item-icon text-emerald">
                  <MessageSquare size={14} />
                </div>
                <span>Community Chat Deck</span>
              </div>
              <kbd className="hud-kbd">Alt+C</kbd>
            </button>

            {/* Tool: 10-Week Exploration Roadmap */}
            <button
              type="button"
              className="hud-item-btn"
              onClick={() => { playTactileClick(); setIsOpen(false); navigate('/roadmap'); }}
              title="Open 10-Week Platform Roadmap & Motivation Hub (Alt+R)"
            >
              <div className="hud-item-left">
                <div className="hud-item-icon text-amber">
                  <Compass size={14} />
                </div>
                <span>10-Week Roadmap</span>
              </div>
              <kbd className="hud-kbd">Alt+R</kbd>
            </button>

            {/* Tool: Platform Compass & Guide */}
            <button
              type="button"
              className="hud-item-btn"
              onClick={() => handleAction('open-platform-guide')}
              title="Open Platform Compass & Zero Confusion Guide (Alt+H)"
            >
              <div className="hud-item-left">
                <div className="hud-item-icon text-cyan">
                  <Compass size={14} />
                </div>
                <span>Platform Compass</span>
              </div>
              <kbd className="hud-kbd">Alt+H</kbd>
            </button>

            {/* Tool 6: Audio FX Toggle */}
            <button
              type="button"
              className="hud-item-btn"
              onClick={toggleAudio}
              title="Toggle Cyber Motion Sound Effects"
            >
              <div className="hud-item-left">
                <div className="hud-item-icon text-slate-300">
                  {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </div>
                <span>Audio Effects</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: audioEnabled ? '#10b981' : '#94a3b8', fontWeight: 700 }}>
                {audioEnabled ? 'ON' : 'MUTE'}
              </span>
            </button>

            {/* Tool 7: Keyboard Shortcuts */}
            <button
              type="button"
              className="hud-item-btn"
              onClick={() => { playTactileClick(); setIsOpen(false); setShowShortcutsModal(true); }}
              title="View All Keyboard Shortcuts (?)"
            >
              <div className="hud-item-left">
                <div className="hud-item-icon text-cyan">
                  <HelpCircle size={14} />
                </div>
                <span>Hotkeys Guide</span>
              </div>
              <kbd className="hud-kbd">?</kbd>
            </button>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          type="button"
          className={`cyber-hud-main-trigger ${isOpen ? 'is-open' : ''}`}
          onClick={toggleHud}
          aria-label="Toggle Cyber Command HUD Tools"
          title="Cyber HUD Tools (Alt+N: Notes, Alt+F: Flashcards, Alt+U: User ID, ?: Hotkeys)"
        >
          <span className="hud-pulse-ring" />
          {isOpen ? <X size={22} /> : <Cpu size={22} />}
        </button>
      </div>

      {/* Keyboard Shortcuts Guide Modal */}
      {showShortcutsModal && (
        <div className="shortcuts-modal-backdrop" onClick={() => setShowShortcutsModal(false)}>
          <div 
            className="shortcuts-modal-card" 
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts Guide"
          >
            <div className="shortcuts-header">
              <div className="shortcuts-title-box">
                <Cpu size={20} className="text-cyan" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800 }}>
                    SeCloudive Cyber Command Shortcuts
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Instant keyboard navigation across the entire ecosystem
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowShortcutsModal(false)}
                aria-label="Close shortcuts guide"
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="shortcuts-body">
              <div className="shortcut-row">
                <span className="shortcut-label">Socratic AI Co-Pilot</span>
                <div className="shortcut-keys">
                  <kbd className="hud-kbd">Ctrl</kbd> + <kbd className="hud-kbd">K</kbd>
                </div>
              </div>

              <div className="shortcut-row">
                <span className="shortcut-label">Global Omnisearch</span>
                <div className="shortcut-keys">
                  <kbd className="hud-kbd">Ctrl</kbd> + <kbd className="hud-kbd">/</kbd>
                </div>
              </div>

              <div className="shortcut-row">
                <span className="shortcut-label">In-Lab Notes & Scratchpad</span>
                <div className="shortcut-keys">
                  <kbd className="hud-kbd">Alt</kbd> + <kbd className="hud-kbd">N</kbd>
                </div>
              </div>

              <div className="shortcut-row">
                <span className="shortcut-label">AWS Certification Flashcards</span>
                <div className="shortcut-keys">
                  <kbd className="hud-kbd">Alt</kbd> + <kbd className="hud-kbd">F</kbd>
                </div>
              </div>

              <div className="shortcut-row">
                <span className="shortcut-label">Skill Baseline Diagnostic</span>
                <div className="shortcut-keys">
                  <kbd className="hud-kbd">Alt</kbd> + <kbd className="hud-kbd">D</kbd>
                </div>
              </div>

              <div className="shortcut-row">
                <span className="shortcut-label">User ID & Auto-Sync Engine</span>
                <div className="shortcut-keys">
                  <kbd className="hud-kbd">Alt</kbd> + <kbd className="hud-kbd">U</kbd>
                </div>
              </div>

              <div className="shortcut-row">
                <span className="shortcut-label">10-Week Exploration Roadmap</span>
                <div className="shortcut-keys">
                  <kbd className="hud-kbd">Alt</kbd> + <kbd className="hud-kbd">R</kbd>
                </div>
              </div>

              <div className="shortcut-row">
                <span className="shortcut-label">Platform Compass & Guide</span>
                <div className="shortcut-keys">
                  <kbd className="hud-kbd">Alt</kbd> + <kbd className="hud-kbd">H</kbd>
                </div>
              </div>

              <div className="shortcut-row">
                <span className="shortcut-label">AWS Edge Latency Ping</span>
                <div className="shortcut-keys">
                  <kbd className="hud-kbd">Alt</kbd> + <kbd className="hud-kbd">P</kbd>
                </div>
              </div>

              <div className="shortcut-row">
                <span className="shortcut-label">Close Modals / Drawers</span>
                <div className="shortcut-keys">
                  <kbd className="hud-kbd">Esc</kbd>
                </div>
              </div>
            </div>

            <div style={{ padding: '14px 24px', background: 'rgba(15, 23, 42, 0.5)', borderTop: '1px solid rgba(148, 163, 184, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8' }}>
              <span>Press <kbd className="hud-kbd">?</kbd> anywhere to open this cheatsheet</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Active User: {userId}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
