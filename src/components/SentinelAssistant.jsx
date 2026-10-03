// =========================================================================
// SeCloudive Sentinel AI Assistant — Production Interactive Panel
// Floating assistant panel with page-awareness, strict safety guardrails,
// visible disclosures, lightweight feedback, accessibility, and admin telemetry.
// =========================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Shield,
  MessageSquare,
  X,
  Send,
  Sparkles,
  AlertTriangle,
  Info,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  BarChart3,
  ExternalLink,
  ChevronDown,
  Lock,
  Cpu,
  Clock,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react'
import {
  ASSISTANT_NAME,
  DISCLOSURE_GEMINI,
  DISCLOSURE_NO_GUARANTEE,
  ATTACHED_TELEMETRY_DISCLOSURE,
  ERROR_MESSAGES
} from '../config/sentinelConfig.js'
import { sentinelClient } from '../services/sentinelClient.js'
import { useChallenges } from '../context/ChallengeContext'
import { useAuth } from '../context/AuthContext'
import { saveChatHistory, fetchChatHistory } from '../services/supabaseProgressService'
import '../styles/sentinelAssistant.css'

export default function SentinelAssistant() {
  const location = useLocation()
  const navigate = useNavigate()

  // Telemetry from ChallengeContext
  const challengeContext = useChallenges() || {}
  const {
    completedMasterActivities = 0,
    totalMasterActivities = 100,
    masterProgressPercent = 0,
    masterTotalXP = 0,
    activeScenarioState = null,
    activeChallenge = null
  } = challengeContext

  const activeScenarioId = activeScenarioState?.scenarioId || activeChallenge?.id || null
  const auth = useAuth()

  // UI state
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showAdminView, setShowAdminView] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  // Messages
  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 'sentinel-init',
        sender: 'assistant',
        text: `Hello, I'm **${ASSISTANT_NAME}**, your cloud security analyst assistant on SeCloudive.\n\nI can help orient your next steps, un-stick investigations and safe labs, explain CIS/NIST framework concepts, or hand off your work to the Multi-Persona Mentor Engine for rigorous grading.\n\n*What scenario, lab, or career milestone are you working through today?*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceTag: '[Source: Platform Guidelines]'
      }
    ]
  })

  // Hydrate chat from Supabase if logged in
  useEffect(() => {
    if (!auth?.supabaseUserId) return
    fetchChatHistory(auth.supabaseUserId).then(cloudMsgs => {
      if (cloudMsgs && cloudMsgs.length > 0) {
        setMessages(cloudMsgs)
      }
    }).catch(err => console.debug('[SentinelAssistant] Cloud chat load notice:', err))
  }, [auth?.supabaseUserId])

  // Persist chat to Supabase (debounced)
  useEffect(() => {
    if (!auth?.supabaseUserId || messages.length <= 1) return
    const t = setTimeout(() => {
      saveChatHistory(auth.supabaseUserId, messages)
    }, 2000)
    return () => clearTimeout(t)
  }, [messages, auth?.supabaseUserId])

  // Feedback tracking per message: { [msgId]: { voted: 'up' | 'down', comment: string, submitted: boolean } }
  const [feedbackState, setFeedbackState] = useState({})
  const [adminDeclineLogs, setAdminDeclineLogs] = useState([])
  const [adminUsageStats, setAdminUsageStats] = useState({})

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isMinimized, isTyping])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, isMinimized])

  // Global keyboard shortcut: Ctrl+K / Cmd+K and Escape to close, plus custom event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        setIsMinimized(false)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    const handleOpenCustomEvent = () => {
      setIsOpen(true)
      setIsMinimized(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-naen-ai', handleOpenCustomEvent)
    window.addEventListener('open-sentinel-ai', handleOpenCustomEvent)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-naen-ai', handleOpenCustomEvent)
      window.removeEventListener('open-sentinel-ai', handleOpenCustomEvent)
    }
  }, [isOpen])

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return
    const interval = setInterval(() => {
      setCooldownRemaining(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [cooldownRemaining])

  // Load admin logs when admin view opens
  useEffect(() => {
    if (showAdminView) {
      setAdminDeclineLogs(sentinelClient.getDeclineLogs())
      setAdminUsageStats(sentinelClient.getUsageStats())
    }
  }, [showAdminView])

  // Handle message sending
  const handleSend = useCallback(async (customText) => {
    const query = (customText || inputText).trim()
    if (!query || isTyping) return

    if (cooldownRemaining > 0) return

    const userMessageId = `usr-${Date.now()}`
    const userMsg = {
      id: userMessageId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    try {
      const response = await sentinelClient.sendMessage({
        message: query,
        route: location.pathname,
        activeScenarioId,
        studentTelemetry: {
          masterTotalXP,
          masterProgressPercent,
          completedMasterActivities
        }
      })

      if (response.status === 'RATE_LIMITED') {
        setCooldownRemaining(response.cooldownSeconds || 60)
      }

      const botMsg = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        status: response.status,
        sourceTag: response.sourceTag,
        modelUsed: response.modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      console.error('[Sentinel UI] Unexpected chat error:', err)
      setMessages(prev => [
        ...prev,
        {
          id: `ast-err-${Date.now()}`,
          sender: 'assistant',
          text: ERROR_MESSAGES.OUTAGE,
          status: 'OUTAGE',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }, [
    inputText,
    isTyping,
    cooldownRemaining,
    location.pathname,
    activeScenarioId,
    masterTotalXP,
    masterProgressPercent,
    completedMasterActivities
  ])

  // Handle feedback submission
  const handleVote = (msgId, voteType) => {
    setFeedbackState(prev => ({
      ...prev,
      [msgId]: { ...prev[msgId], voted: voteType }
    }))
    sentinelClient.recordFeedback(msgId, voteType === 'up')
  }

  const handleFeedbackComment = (msgId, comment) => {
    setFeedbackState(prev => ({
      ...prev,
      [msgId]: { ...prev[msgId], comment, submitted: true }
    }))
    const currentVote = feedbackState[msgId]?.voted === 'up'
    sentinelClient.recordFeedback(msgId, currentVote, comment)
  }

  // Pre-configured orientation prompt chips
  const promptChips = [
    { label: '🧭 What should I do next?', query: 'What should I do next based on my readiness?' },
    { label: '🛡️ Explain S3 Least Privilege (CIS)', query: 'Explain how S3 bucket policy least privilege works under CIS AWS Foundations Benchmark §2.1.1' },
    { label: '🎓 Grade my remediation plan', query: 'Can you review my remediation plan: I will revoke STS session tokens, attach a permission boundary with Deny on iam:*, and query CloudTrail in Athena.' },
    { label: '💼 Career Readiness Path', query: 'What skills are required for me to transition to a Cloud Security Engineer role?' }
  ]

  return (
    <>
      {/* ── FLOATING ACTION BUTTON (FAB) ─────────────────────────────────── */}
      {!isOpen && (
        <button
          id="sentinel-fab-button"
          onClick={() => setIsOpen(true)}
          aria-label={`Open ${ASSISTANT_NAME} AI Assistant (Ctrl+K)`}
          className="sentinel-launcher"
        >
          <div className="sentinel-launcher-icon">
            <Shield size={18} style={{ color: '#34d399' }} />
            <span className="sentinel-ping-dot" />
          </div>
          <span>{ASSISTANT_NAME}</span>
          <span className="sentinel-shortcut-pill">Ctrl+K</span>
        </button>
      )}

      {/* ── EXPANDING CHAT PANEL ─────────────────────────────────────────── */}
      {isOpen && (
        <div
          id="sentinel-chat-panel"
          role="region"
          aria-label={`${ASSISTANT_NAME} Security Assistant`}
          className={`sentinel-modal ${isMinimized ? 'minimized' : ''}`}
        >
          {/* HEADER */}
          <div className="sentinel-header">
            <div className="sentinel-brand">
              <div className="sentinel-avatar">
                <Shield size={16} />
              </div>
              <div className="sentinel-title-box">
                <h3>
                  {ASSISTANT_NAME}
                  <span className="sentinel-role-tag">Analyst Copilot</span>
                </h3>
                {/* MANDATORY VISIBLE DISCLOSURE 1 */}
                <p className="sentinel-disclosure-sub">
                  {DISCLOSURE_GEMINI}
                </p>
              </div>
            </div>

            <div className="sentinel-header-actions">
              <button
                onClick={() => setShowAdminView(prev => !prev)}
                title="Admin & Safety Telemetry View"
                aria-label="Admin telemetry"
                className={`sentinel-btn-icon ${showAdminView ? 'active' : ''}`}
              >
                <BarChart3 size={15} />
              </button>
              <button
                onClick={() => setIsMinimized(prev => !prev)}
                aria-label={isMinimized ? 'Expand panel' : 'Minimize panel'}
                className="sentinel-btn-icon"
              >
                <ChevronDown
                  size={15}
                  style={{
                    transform: isMinimized ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant panel"
                className="sentinel-btn-icon close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* PAGE-AWARE CONTEXT BAR */}
              <div className="sentinel-context-bar">
                <div className="sentinel-context-label">
                  <Terminal size={13} style={{ color: '#38bdf8', flexShrink: 0 }} />
                  <span>
                    Route: <span className="sentinel-context-route">{location.pathname}</span>
                    {activeScenarioId && (
                      <> • Active: <span className="sentinel-context-scenario">{activeScenarioId}</span></>
                    )}
                  </span>
                </div>
                <div title={ATTACHED_TELEMETRY_DISCLOSURE} style={{ cursor: 'help', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <Info size={13} style={{ color: '#64748b' }} />
                </div>
              </div>

              {/* ADMIN & TELEMETRY VIEW OVERLAY */}
              {showAdminView ? (
                <div className="sentinel-admin-container">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(148, 163, 184, 0.15)', paddingBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 700 }}>
                      <BarChart3 size={16} />
                      {ASSISTANT_NAME} Admin & Safety Telemetry
                    </h4>
                    <button
                      onClick={() => setShowAdminView(false)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.72rem' }}
                    >
                      Back to Chat
                    </button>
                  </div>

                  {/* Quota & Cost View */}
                  <div className="sentinel-admin-card">
                    <div className="sentinel-admin-title">
                      <span>Daily Usage Metrics</span>
                      <span style={{ color: '#34d399', fontWeight: 700 }}>Active Key Pool</span>
                    </div>
                    {Object.keys(adminUsageStats).length === 0 ? (
                      <p style={{ margin: 0, color: '#64748b', fontStyle: 'italic', fontSize: '0.75rem' }}>No calls recorded in this session yet.</p>
                    ) : (
                      Object.entries(adminUsageStats).map(([day, s]) => (
                        <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.74rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0' }}>
                            <span>Date: <span style={{ fontFamily: 'DM Mono, monospace' }}>{day}</span></span>
                            <span>Total Calls: <span style={{ fontFamily: 'DM Mono, monospace', color: '#34d399', fontWeight: 700 }}>{s.totalCalls}</span></span>
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>
                            Estimated Tokens: ~{s.estimatedTokens} (Cost: &lt; $0.001)
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Safety Decline Logs */}
                  <div className="sentinel-admin-card">
                    <div className="sentinel-admin-title">
                      <span>Safety Decline Logs</span>
                      <span style={{ color: '#fbbf24' }}>
                        {adminDeclineLogs.length} Events Logged
                      </span>
                    </div>
                    {adminDeclineLogs.length === 0 ? (
                      <p style={{ margin: 0, color: '#64748b', fontStyle: 'italic', fontSize: '0.75rem' }}>
                        Zero safety declines recorded yet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                        {adminDeclineLogs.map(dec => (
                          <div key={dec.id} style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(120, 53, 15, 0.2)', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: '0.72rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fde68a', fontFamily: 'DM Mono, monospace' }}>
                              <span>{dec.category}</span>
                              <span style={{ color: '#64748b', fontSize: '0.65rem' }}>{new Date(dec.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              "{dec.snippet}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* CHAT MESSAGES CONTAINER */
                <div
                  role="log"
                  aria-live="polite"
                  aria-atomic="false"
                  className="sentinel-messages-area"
                >
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`sentinel-msg-row ${msg.sender}`}
                    >
                      <div
                        className={`sentinel-bubble ${msg.sender} ${
                          msg.status === 'OUTAGE'
                            ? 'outage'
                            : msg.status === 'RATE_LIMITED'
                              ? 'rate-limited'
                              : ''
                        }`}
                      >
                        <div>{msg.text}</div>

                        {msg.sourceTag && (
                          <div className="sentinel-source-tag">
                            <CheckCircle2 size={12} />
                            <span>{msg.sourceTag}</span>
                          </div>
                        )}
                      </div>

                      {/* ASSISTANT MESSAGE CONTROLS & FEEDBACK */}
                      {msg.sender === 'assistant' && msg.id !== 'sentinel-init' && (
                        <div className="sentinel-feedback-row">
                          <span>{msg.timestamp}</span>

                          {/* THUMBS UP / DOWN LIGHTWEIGHT FEEDBACK */}
                          <button
                            onClick={() => handleVote(msg.id, 'up')}
                            aria-label="Thumbs up"
                            title="Helpful response"
                            className={`sentinel-feedback-btn ${feedbackState[msg.id]?.voted === 'up' ? 'selected-up' : ''}`}
                          >
                            <ThumbsUp size={12} />
                          </button>
                          <button
                            onClick={() => handleVote(msg.id, 'down')}
                            aria-label="Thumbs down"
                            title="Not helpful"
                            className={`sentinel-feedback-btn down ${feedbackState[msg.id]?.voted === 'down' ? 'selected-down' : ''}`}
                          >
                            <ThumbsDown size={12} />
                          </button>

                          {/* INLINE COMMENT POPUP IF VOTED */}
                          {feedbackState[msg.id]?.voted && !feedbackState[msg.id]?.submitted && (
                            <input
                              type="text"
                              placeholder="Optional feedback..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleFeedbackComment(msg.id, e.currentTarget.value)
                                }
                              }}
                              className="sentinel-feedback-input"
                            />
                          )}
                          {feedbackState[msg.id]?.submitted && (
                            <span style={{ color: '#34d399', fontSize: '0.68rem', fontWeight: 600 }}>Thanks!</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="sentinel-typing-box">
                      <div className="sentinel-dots">
                        <span className="sentinel-dot" />
                        <span className="sentinel-dot" />
                        <span className="sentinel-dot" />
                      </div>
                      <span>
                        {ASSISTANT_NAME} is analyzing...
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* QUICK PROMPT CHIPS */}
              {!showAdminView && messages.length <= 2 && (
                <div className="sentinel-chips-bar">
                  {promptChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip.query)}
                      className="sentinel-chip-btn"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}

              {/* COOLDOWN RATE LIMIT BANNER IF ACTIVE */}
              {cooldownRemaining > 0 && (
                <div className="sentinel-cooldown-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={13} />
                    <span>Rate limit cooldown active</span>
                  </div>
                  <span>{cooldownRemaining}s</span>
                </div>
              )}

              {/* EXPANDING TEXTAREA INPUT */}
              <div className="sentinel-input-area">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="sentinel-input-form"
                >
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder={`Ask ${ASSISTANT_NAME} about scenarios, labs, or careers...`}
                    rows={1}
                    disabled={isTyping || cooldownRemaining > 0}
                    className="sentinel-textarea"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping || cooldownRemaining > 0}
                    aria-label="Send message"
                    className="sentinel-send-btn"
                  >
                    <Send size={14} />
                  </button>
                </form>

                {/* MANDATORY VISIBLE DISCLOSURE 2 */}
                <div className="sentinel-disclosure-foot">
                  {DISCLOSURE_NO_GUARANTEE}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
