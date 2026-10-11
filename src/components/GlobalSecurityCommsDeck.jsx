// ==============================================================================
// SeCloudive Global Security Comms Deck (Free Student & Community Discussion)
// Open, real-time, zero-friction communication hub for all learners (guests & students)
// Features:
// - Free text chat & question posting without any login wall
// - Channel categorization: #general, #lab-help, #threat-intel, #career-prep, #battle-rooms
// - Real-time persistence (localStorage + storage event for cross-tab sync)
// - Emoji reactions, replies, author badge, role indicators, and code snippet support
// - Search, filter, export, and quick conversation starter chips
// ==============================================================================

import { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  Send,
  Hash,
  Smile,
  Search,
  Sparkles,
  Users,
  Shield,
  Zap,
  Code,
  Copy,
  Check,
  RotateCcw,
  Download,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Terminal,
  Compass
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick } from '../utils/cyberMotionAudio'

const COMMS_STORAGE_KEY = 'secloudive_community_comms_v2'

const CHANNELS = [
  { id: 'all', label: 'All Feeds', icon: Compass, color: '#38bdf8' },
  { id: 'general', label: '#general', icon: Hash, color: '#94a3b8' },
  { id: 'lab-help', label: '#lab-help', icon: Terminal, color: '#10b981' },
  { id: 'threat-intel', label: '#threat-intel', icon: Shield, color: '#f59e0b' },
  { id: 'career-prep', label: '#career-prep', icon: Zap, color: '#a855f7' },
  { id: 'battle-rooms', label: '#battle-rooms', icon: AlertCircle, color: '#ef4444' }
]

const QUICK_PROMPTS = [
  { text: 'Stuck on S3 Bucket Policy evaluation — anyone have an example?', channel: 'lab-help' },
  { text: 'How do you test AWS IAM Least Privilege locally without spending $?', channel: 'lab-help' },
  { text: 'Just captured the flag in SSRF IMDSv1 Battle Room! Amazing learning curve.', channel: 'battle-rooms' },
  { text: 'What is the best way to prepare for AWS Certified Security Specialty (SCS-C02)?', channel: 'career-prep' },
  { text: 'Observed a new STS assume-role anomaly in CloudTrail logs today.', channel: 'threat-intel' }
]

const INITIAL_SEED_MESSAGES = [
  {
    id: 'msg-seed-1',
    author: 'Alex Chen',
    authorId: 'SEC-STU-4821',
    role: 'Cloud Security Architect',
    tierBadge: 'Tier 4 Lead',
    channel: 'lab-help',
    content: 'Pro tip for Lab 03 (S3 Data Guardrails): Make sure your bucket policy has an explicit `Deny` on `s3:*` where `aws:SecureTransport` equals `false`. That ensures 100% TLS in transit!',
    timestamp: '12 mins ago',
    createdAt: Date.now() - 12 * 60 * 1000,
    likes: 8,
    reactions: { '🔥': 5, '🛡️': 7, '👍': 4 },
    isPinned: true
  },
  {
    id: 'msg-seed-2',
    author: 'Priya Sharma',
    authorId: 'SEC-STU-2910',
    role: 'Junior SOC Analyst',
    tierBadge: 'Tier 2 Operative',
    channel: 'battle-rooms',
    content: 'The SSRF Metadata room was a huge eye-opener! Seeing how an exposed proxy service can access `169.254.169.254` to steal temporary IAM credentials made the defense side click immediately.',
    timestamp: '25 mins ago',
    createdAt: Date.now() - 25 * 60 * 1000,
    likes: 6,
    reactions: { '🧠': 9, '🔥': 4 },
    isPinned: false
  },
  {
    id: 'msg-seed-3',
    author: 'Marcus Vance',
    authorId: 'SEC-STU-8832',
    role: 'DevSecOps & Kubernetes Defender',
    tierBadge: 'Tier 3 Defender',
    channel: 'career-prep',
    content: 'Had an interview for an AWS Cloud Security Intern role yesterday. They literally asked about the blast radius of wildcard `sts:AssumeRole`! Practicing the SOC scenarios here made explaining my thought process effortless.',
    timestamp: '48 mins ago',
    createdAt: Date.now() - 48 * 60 * 1000,
    likes: 12,
    reactions: { '🚀': 11, '👍': 8 },
    isPinned: false
  },
  {
    id: 'msg-seed-4',
    author: 'Guest Operator',
    authorId: 'GUEST-SANDBOX-7104',
    role: 'Aspiring Cloud Security Engineer',
    tierBadge: 'Tier 1 Cadet',
    channel: 'general',
    content: 'Hello everyone! Just started the Linux and IAM foundations today. Love that everything has $0 cost alarms built in so I do not have to worry about surprise bills.',
    timestamp: '1 hour ago',
    createdAt: Date.now() - 60 * 60 * 1000,
    likes: 5,
    reactions: { '👋': 7, '👍': 6 },
    isPinned: false
  },
  {
    id: 'msg-seed-5',
    author: 'Elena Rostova',
    authorId: 'SEC-STU-9401',
    role: 'Cloud Incident Responder (DFIR)',
    tierBadge: 'Tier 4 Lead',
    channel: 'threat-intel',
    content: 'Reminder: When analyzing CloudTrail logs for credential exfiltration, always check the `userAgent` field for signs of automated enumeration tools like Pacu or AWS CLI scripts.',
    timestamp: '2 hours ago',
    createdAt: Date.now() - 120 * 60 * 1000,
    likes: 9,
    reactions: { '🛡️': 8, '🧠': 6 },
    isPinned: false
  }
]

export default function GlobalSecurityCommsDeck({ className = '' }) {
  const { activeProfile = {}, clearance = {} } = useChallenges() || {}
  
  // Local messages state with persistent storage
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(COMMS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return INITIAL_SEED_MESSAGES
  })

  const [activeChannel, setActiveChannel] = useState('all')
  const [inputMessage, setInputMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [authorNickname, setAuthorNickname] = useState('')
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [selectedReplyTo, setSelectedReplyTo] = useState(null)
  const [onlineCount, setOnlineCount] = useState(48)
  const [copiedMsgId, setCopiedMsgId] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Listen for storage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === COMMS_STORAGE_KEY && e.newValue) {
        try {
          const fresh = JSON.parse(e.newValue)
          if (Array.isArray(fresh)) setMessages(fresh)
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Save messages whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(COMMS_STORAGE_KEY, JSON.stringify(messages))
    } catch {}
  }, [messages])

  // Realistic random fluctuation in active online count
  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount(prev => Math.min(64, Math.max(38, prev + (Math.random() > 0.5 ? 1 : -1))))
    }, 15000)
    return () => clearInterval(timer)
  }, [])

  // Auto-fill or fall back user identity
  const currentDisplayName = authorNickname.trim() || activeProfile?.name || (activeProfile?.id ? `Student ${activeProfile.id.slice(-4)}` : 'Guest Operator')
  const currentStudentId = activeProfile?.id || 'GUEST-SANDBOX'
  const currentRole = activeProfile?.targetCareerRole || activeProfile?.role || 'Cloud Security Learner'
  const currentTierBadge = clearance?.title || 'Tier 1 Cadet'

  const handleSendMessage = (e) => {
    if (e) e.preventDefault()
    if (!inputMessage.trim()) return

    playTactileClick()

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      author: currentDisplayName,
      authorId: currentStudentId,
      role: currentRole,
      tierBadge: currentTierBadge,
      channel: activeChannel === 'all' ? 'general' : activeChannel,
      content: inputMessage.trim(),
      replyTo: selectedReplyTo ? {
        id: selectedReplyTo.id,
        author: selectedReplyTo.author,
        preview: selectedReplyTo.content.slice(0, 60) + (selectedReplyTo.content.length > 60 ? '...' : '')
      } : null,
      timestamp: 'Just now',
      createdAt: Date.now(),
      likes: 0,
      reactions: {},
      isPinned: false
    }

    setMessages(prev => [newMessage, ...prev])
    setInputMessage('')
    setSelectedReplyTo(null)

    // Notify other components if needed
    window.dispatchEvent(new CustomEvent('community-message-sent', { detail: newMessage }))
  }

  const handleAddReaction = (messageId, emoji) => {
    playTactileClick()
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId) return m
      const currentReactions = { ...(m.reactions || {}) }
      currentReactions[emoji] = (currentReactions[emoji] || 0) + 1
      return {
        ...m,
        likes: (m.likes || 0) + 1,
        reactions: currentReactions
      }
    }))
  }

  const handleCopyMessage = (msg) => {
    try {
      navigator.clipboard.writeText(`${msg.author} [${msg.channel}]: ${msg.content}`)
      setCopiedMsgId(msg.id)
      playTactileClick()
      setTimeout(() => setCopiedMsgId(null), 2000)
    } catch {}
  }

  const handleResetToSeed = () => {
    if (window.confirm('Reset the comms deck to standard community feed messages?')) {
      playTactileClick()
      setMessages(INITIAL_SEED_MESSAGES)
      localStorage.removeItem(COMMS_STORAGE_KEY)
    }
  }

  const handleExportChat = () => {
    try {
      const exportData = {
        platform: 'SeCloudive Global Security Comms Deck',
        exportedAt: new Date().toISOString(),
        totalMessages: messages.length,
        messages: messages
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `secloudive-community-chat-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {}
  }

  // Filter messages by channel and search query
  const filteredMessages = messages.filter(m => {
    const matchesChannel = activeChannel === 'all' || m.channel === activeChannel
    const matchesSearch = !searchQuery.trim() || 
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.channel.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesChannel && matchesSearch
  })

  return (
    <div 
      className={`global-comms-deck-container ${className}`}
      style={{
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.55)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'inherit'
      }}
    >
      {/* ── Top Header & Telemetry Bar ── */}
      <div 
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(6, 10, 20, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <MessageSquare size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.3px' }}>
                Global Security Comms Deck
              </h3>
              <span 
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#10b981',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span className="pulse-dot" style={{ width: '6px', height: '6px', backgroundColor: '#10b981' }} />
                Open to All Students
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
              Zero-barrier live collaboration hub. Ask lab questions, share exploit findings, and exchange cloud security advice.
            </p>
          </div>
        </div>

        {/* Right side live status & actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '5px 10px',
              fontSize: '0.75rem',
              color: '#cbd5e1'
            }}
            title="Active learners currently browsing and practicing"
          >
            <Users size={13} style={{ color: '#38bdf8' }} />
            <span><strong>{onlineCount}</strong> online</span>
          </div>

          <button
            type="button"
            onClick={handleExportChat}
            className="button button-ghost"
            style={{ padding: '6px 12px', fontSize: '0.76rem', gap: '4px', height: '32px' }}
            title="Export conversation history"
          >
            <Download size={13} />
            <span>Export Log</span>
          </button>

          <button
            type="button"
            onClick={handleResetToSeed}
            className="button button-ghost"
            style={{ padding: '6px 10px', fontSize: '0.76rem', height: '32px' }}
            title="Reset feed to default"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* ── Channel Navigation & Search Bar ── */}
      <div 
        style={{
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(9, 14, 26, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        {/* Channel Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CHANNELS.map(ch => {
            const IconComponent = ch.icon
            const isActive = activeChannel === ch.id
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  playTactileClick()
                  setActiveChannel(ch.id)
                }}
                style={{
                  background: isActive ? `${ch.color}25` : 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${isActive ? ch.color : 'rgba(255, 255, 255, 0.08)'}`,
                  color: isActive ? ch.color : '#94a3b8',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 800 : 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <IconComponent size={12} />
                <span>{ch.label}</span>
              </button>
            )
          })}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussion..."
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '6px 10px 6px 30px',
              color: '#f8fafc',
              fontSize: '0.78rem'
            }}
          />
        </div>
      </div>

      {/* ── Active User Identity Ribbon ── */}
      <div 
        style={{
          padding: '8px 20px',
          background: 'rgba(56, 189, 248, 0.04)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '0.76rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
          <span style={{ color: '#64748b' }}>Posting as:</span>
          {isEditingNickname ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="text"
                value={authorNickname}
                onChange={(e) => setAuthorNickname(e.target.value)}
                placeholder={currentDisplayName}
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  color: '#38bdf8',
                  fontSize: '0.76rem',
                  fontWeight: 700
                }}
              />
              <button
                type="button"
                onClick={() => setIsEditingNickname(false)}
                style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <strong style={{ color: '#38bdf8' }}>{currentDisplayName}</strong>
              <span style={{ fontFamily: 'monospace', color: '#64748b' }}>({currentStudentId})</span>
              <button
                type="button"
                onClick={() => setIsEditingNickname(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  textDecoration: 'underline',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                change handle
              </button>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#94a3b8' }}>Target: {currentRole}</span>
          <span style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '1px 6px', borderRadius: '4px' }}>
            {currentTierBadge}
          </span>
        </div>
      </div>

      {/* ── Quick Starter Chips ── */}
      <div 
        style={{
          padding: '8px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          background: 'rgba(6, 10, 20, 0.3)'
        }}
      >
        <span style={{ fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={11} style={{ color: '#f59e0b' }} /> Quick Ask:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              playTactileClick()
              setInputMessage(prompt.text)
              setActiveChannel(prompt.channel)
              if (inputRef.current) inputRef.current.focus()
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '3px 10px',
              color: '#94a3b8',
              fontSize: '0.72rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#38bdf8'
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
            }}
          >
            {prompt.text.slice(0, 42)}...
          </button>
        ))}
      </div>

      {/* ── Scrollable Chat Messages Feed ── */}
      <div 
        style={{
          padding: '20px',
          maxHeight: '440px',
          minHeight: '260px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {filteredMessages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <MessageSquare size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>No messages found in this channel.</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>Be the first to post a question or note below!</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = msg.authorId === currentStudentId
            return (
              <div 
                key={msg.id}
                style={{
                  background: msg.isPinned 
                    ? 'rgba(56, 189, 248, 0.08)' 
                    : isMe 
                      ? 'rgba(14, 165, 233, 0.06)' 
                      : 'rgba(15, 23, 42, 0.65)',
                  border: `1px solid ${msg.isPinned ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.07)'}`,
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                  transition: 'border-color 0.15s ease'
                }}
              >
                {/* Message Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#38bdf8'
                      }}
                    >
                      {msg.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc' }}>
                          {msg.author}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                          {msg.authorId}
                        </span>
                        <span 
                          style={{
                            fontSize: '0.68rem',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: 'rgba(56, 189, 248, 0.12)',
                            color: '#38bdf8',
                            fontWeight: 600
                          }}
                        >
                          {msg.tierBadge || 'Student'}
                        </span>
                        {msg.isPinned && (
                          <span style={{ fontSize: '0.68rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            📌 PINNED
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                        {msg.role} • <span style={{ color: '#38bdf8' }}>#{msg.channel}</span> • {msg.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Copy & Reply */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedMsgId === msg.id ? '#10b981' : '#64748b',
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.72rem'
                      }}
                      title="Copy message text"
                    >
                      {copiedMsgId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedMsgId === msg.id ? 'Copied' : ''}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playTactileClick()
                        setSelectedReplyTo(msg)
                        if (inputRef.current) inputRef.current.focus()
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem'
                      }}
                    >
                      Reply
                    </button>
                  </div>
                </div>

                {/* Reply context if present */}
                {msg.replyTo && (
                  <div 
                    style={{
                      borderLeft: '2px solid rgba(56, 189, 248, 0.4)',
                      padding: '4px 10px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '0 4px 4px 0',
                      fontSize: '0.74rem',
                      color: '#94a3b8'
                    }}
                  >
                    Replying to <strong>{msg.replyTo.author}</strong>: &quot;{msg.replyTo.preview}&quot;
                  </div>
                )}

                {/* Message Content */}
                <div 
                  style={{
                    fontSize: '0.86rem',
                    color: '#e2e8f0',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.content}
                </div>

                {/* Reactions Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {['👍', '🔥', '🧠', '🛡️', '🚀'].map(emoji => {
                    const count = msg.reactions?.[emoji] || 0
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleAddReaction(msg.id, emoji)}
                        style={{
                          background: count > 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${count > 0 ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                          borderRadius: '14px',
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: count > 0 ? '#38bdf8' : '#94a3b8',
                          transition: 'transform 0.1s ease'
                        }}
                        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)' }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                      >
                        <span>{emoji}</span>
                        {count > 0 && <span style={{ fontWeight: 700 }}>{count}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Reply To Banner (if active) ── */}
      {selectedReplyTo && (
        <div 
          style={{
            padding: '6px 20px',
            background: 'rgba(56, 189, 248, 0.1)',
            borderTop: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem',
            color: '#38bdf8'
          }}
        >
          <span>Replying to <strong>{selectedReplyTo.author}</strong></span>
          <button
            type="button"
            onClick={() => setSelectedReplyTo(null)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.74rem' }}
          >
            ✕ Cancel
          </button>
        </div>
      )}

      {/* ── Message Composer ── */}
      <form 
        onSubmit={handleSendMessage}
        style={{
          padding: '14px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(6, 10, 20, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <textarea
            ref={inputRef}
            rows={2}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder={`Type your message or question in #${activeChannel === 'all' ? 'general' : activeChannel}... (Press Enter to send, Shift+Enter for new line)`}
            style={{
              flex: 1,
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#f8fafc',
              fontSize: '0.85rem',
              lineHeight: 1.45,
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="button button-primary"
            style={{
              padding: '12px 18px',
              height: 'auto',
              borderRadius: '10px',
              background: inputMessage.trim() 
                ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' 
                : 'rgba(255, 255, 255, 0.08)',
              color: inputMessage.trim() ? '#ffffff' : '#64748b',
              cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 800,
              boxShadow: inputMessage.trim() ? '0 4px 15px rgba(2, 132, 199, 0.4)' : 'none'
            }}
          >
            <Send size={15} />
            <span>Send</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '0.72rem', color: '#64748b' }}>
          <span>Free community text feed • Markdown &amp; code blocks supported • Saved locally &amp; synced across tabs</span>
          <span>Targeting #{activeChannel === 'all' ? 'general' : activeChannel}</span>
        </div>
      </form>
    </div>
  )
}
