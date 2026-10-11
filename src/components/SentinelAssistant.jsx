// =========================================================================
// SeCloudive Sentinel & NAEN AI Assistant — Production Interactive Panel
// Features:
// 1. NAEN AI Copilot Chat (Gemini AI, strict safety guardrails, prompt chips)
// 2. Integrated Security Notes Organiser & Scratchpad (Cloud & local storage sync)
// 3. 1-Click "Save to Notes" from chat responses
// 4. Quick Runbook Templates & AI Notes Generator
// =========================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Shield,
  MessageSquare,
  FileText,
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
  Activity,
  Copy,
  Check,
  Download,
  Trash2,
  Edit3,
  Eye,
  BookOpen,
  Compass
} from 'lucide-react'

// ── Markdown & Code Block Formatter for NAEN AI ─────────────────────────────
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.warn('Copy failed', e)
    }
  }

  return (
    <div className="sentinel-code-block">
      <div className="sentinel-code-header">
        <span>{language ? language.toUpperCase() : 'COMMAND / CODE'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="sentinel-copy-btn"
          title="Copy code to clipboard"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="sentinel-code-content">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const KNOWN_PLATFORM_ROUTES = [
  '/downloads',
  '/labs',
  '/investigations',
  '/battle-rooms',
  '/internships',
  '/internship-simulator',
  '/interviews',
  '/projects',
  '/studio',
  '/learn',
  '/architecture',
  '/threat-intel',
  '/ramp-up',
  '/playbooks',
  '/roadmap',
  '/dashboard',
  '/admin',
  '/verify'
]

function renderLineWithTokens(line, onNavigate, keyPrefix) {
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\/[a-z0-9_-]+)/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index))
    }
    const token = match[0]
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`${keyPrefix}-${match.index}`} style={{ color: '#f8fafc', fontWeight: 700 }}>
          {token.slice(2, -2)}
        </strong>
      )
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={`${keyPrefix}-${match.index}`} className="sentinel-inline-code">
          {token.slice(1, -1)}
        </code>
      )
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const linkLabel = token.match(/\[([^\]]+)\]/)?.[1] || 'Link'
      const linkUrl = token.match(/\(([^)]+)\)/)?.[1] || '#'
      const isInternal = linkUrl.startsWith('/')
      if (isInternal) {
        parts.push(
          <button
            key={`${keyPrefix}-${match.index}`}
            type="button"
            className="sentinel-route-link-pill"
            onClick={() => onNavigate(linkUrl)}
          >
            <Compass size={10} />
            <span>{linkLabel}</span>
          </button>
        )
      } else {
        parts.push(
          <a
            key={`${keyPrefix}-${match.index}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#38bdf8', textDecoration: 'underline' }}
          >
            {linkLabel}
          </a>
        )
      }
    } else if (KNOWN_PLATFORM_ROUTES.includes(token)) {
      parts.push(
        <button
          key={`${keyPrefix}-${match.index}`}
          type="button"
          className="sentinel-route-link-pill"
          onClick={() => onNavigate(token)}
          title={`Go to ${token}`}
        >
          <Compass size={10} />
          <span>{token}</span>
        </button>
      )
    } else {
      parts.push(token)
    }
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex))
  }

  return parts
}

function FormattedParagraphs({ text, onNavigate }) {
  if (!text) return null
  const lines = text.split('\n')

  return (
    <>
      {lines.map((line, lIdx) => {
        const trimmed = line.trim()
        if (!trimmed) {
          return <div key={lIdx} style={{ height: '0.35rem' }} />
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lIdx} className="sentinel-md-h3">
              {renderLineWithTokens(trimmed.slice(4), onNavigate, `h3-${lIdx}`)}
            </h4>
          )
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={lIdx} className="sentinel-md-h3">
              {renderLineWithTokens(trimmed.slice(3), onNavigate, `h2-${lIdx}`)}
            </h3>
          )
        }
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletContent = trimmed.slice(2)
          return (
            <div key={lIdx} className="sentinel-md-bullet">
              <span className="sentinel-bullet-dot" />
              <div>{renderLineWithTokens(bulletContent, onNavigate, `b-${lIdx}`)}</div>
            </div>
          )
        }

        const numMatch = trimmed.match(/^(\d+\.)\s+(.*)/)
        if (numMatch) {
          return (
            <div key={lIdx} className="sentinel-md-bullet" style={{ gap: '0.35rem' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'DM Mono', fontSize: '0.74rem' }}>{numMatch[1]}</span>
              <div>{renderLineWithTokens(numMatch[2], onNavigate, `num-${lIdx}`)}</div>
            </div>
          )
        }

        return (
          <p key={lIdx} style={{ margin: '0.22rem 0' }}>
            {renderLineWithTokens(trimmed, onNavigate, `p-${lIdx}`)}
          </p>
        )
      })}
    </>
  )
}

function FormattedTextChunk({ text, onNavigate }) {
  if (!text) return null

  // Split by markdown code blocks ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'code', lang: match[1], code: match[2].trim() })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return (
    <div className="sentinel-md-body">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return <CodeBlock key={idx} code={part.code} language={part.lang} />
        }
        return <FormattedParagraphs key={idx} text={part.content} onNavigate={onNavigate} />
      })}
    </div>
  )
}
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
import { saveChatHistory, fetchChatHistory, fetchUserNote, saveUserNote } from '../services/supabaseProgressService'
import { generateNotesOrLabSteps } from '../services/notesAiEngine.js'
import { playTactileClick } from '../utils/cyberMotionAudio'
import '../styles/sentinelAssistant.css'

// Pre-packaged cyber runbook & study note templates
const NOTE_TEMPLATES = [
  {
    label: '+ Incident Runbook',
    template: `## 🚨 Cloud Incident Response Runbook
- **Date/Time:** ${new Date().toLocaleString()}
- **Environment:** AWS Multi-Tenant Production
- **Trigger Alert:** GuardDuty UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration
- **Root Cause & Affected ARN:** 
- **Minute-0 Containment:**
  1. \`aws iam update-access-key --status Inactive\`
  2. Applied DenyAll inline policy to compromised identity
  3. Isolated EC2 Security Group (0 inbound / 0 outbound)
- **Forensics & Artifacts:**
  - Preserved EBS Volume Snapshot ID:
  - Athena CloudTrail Query:
- **Long-term Remediation:** Enforce IMDSv2 (Hop=1) and migrate to GitHub Actions OIDC federation.
`
  },
  {
    label: '+ IAM Least Privilege',
    template: `## 🛡️ IAM Least Privilege Audit Notes
- **Target Role / Principal:** 
- **Overpermissive Wildcards Identified:** \`Action: "*"\`, \`Resource: "*"\`
- **Scoped Permissions Applied:**
  - Removed \`AdministratorAccess\`
  - Implemented condition keys: \`aws:PrincipalOrgID\`, \`aws:SecureTransport: true\`
- **Permission Boundary Attached:** \`PB-CloudDev-Tier1\`
`
  },
  {
    label: '+ Interview STAR',
    template: `## 💼 Technical Interview Notes (STAR Framework)
- **Question:** How do you handle compromised EC2 instances without destroying volatile evidence?
- **[S] Situation:** C2 beaconing detected from a prod container host in us-east-1.
- **[T] Task:** Isolate the host immediately while preserving RAM and disk states.
- **[A] Action:** Avoided reboot/termination. Attached quarantine SG, dumped memory to S3 via SSM, and took EBS snapshot.
- **[R] Result:** Attacker severed in <3 minutes with zero customer data exposure.
`
  },
  {
    label: '+ CLI Cheatsheet',
    template: `## ⚡ Handy Cloud Security CLI Commands
\`\`\`bash
# 1. Audit active IAM access keys
aws iam list-access-keys --user-name <candidate-user>

# 2. Deactivate an exposed key immediately
aws iam update-access-key --user-name <user> --access-key-id <key-id> --status Inactive

# 3. Check S3 Block Public Access status
aws s3api get-public-access-block --bucket <bucket-name>

# 4. Verify EC2 IMDSv2 enforcement
aws ec2 describe-instances --instance-ids <instance-id> --query "Reservations[].Instances[].MetadataOptions"
\`\`\`
`
  }
]

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
    activeChallenge = null,
    activeProfile = {}
  } = challengeContext

  const activeScenarioId = activeScenarioState?.scenarioId || activeChallenge?.id || null
  const auth = useAuth()
  const userPrefix = activeProfile?.id || auth?.supabaseUserId || 'guest'

  // Panel state: 'chat' vs 'notes'
  const [panelTab, setPanelTab] = useState('chat') // 'chat' | 'notes'
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showAdminView, setShowAdminView] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  // ── Notes Organiser State ──────────────────────────────────────────────────
  const [notesScope, setNotesScope] = useState('context') // 'context' | 'global'
  const [notesMode, setNotesMode] = useState('edit') // 'edit' | 'preview'
  const [notesContent, setNotesContent] = useState('')
  const [notesLastSaved, setNotesLastSaved] = useState('')
  const [notesCopied, setNotesCopied] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  const [notesAiQuery, setNotesAiQuery] = useState('')
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false)

  const effectiveContextId = notesScope === 'context' 
    ? (activeScenarioId || location.pathname.replace(/[^a-zA-Z0-9_-]/g, '_') || 'home')
    : 'global_notebook'

  const notesStorageKey = `secloudive_notes_${userPrefix}_${effectiveContextId}`

  // Messages
  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 'sentinel-init',
        sender: 'assistant',
        text: `Hello, I'm **NAEN AI**, your cloud security analyst mentor on SeCloudive.\n\nI can help orient your next steps, un-stick investigations, explain CIS/NIST concepts, and organize your technical runbooks and interview notes.\n\n*What scenario, lab, or internship challenge are you tackling today?*`,
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

  // Load Notes on scope / context change
  useEffect(() => {
    const saved = localStorage.getItem(notesStorageKey)
    if (saved) {
      setNotesContent(saved)
    } else {
      setNotesContent('')
    }

    if (userPrefix && userPrefix !== 'guest') {
      fetchUserNote(userPrefix, effectiveContextId).then(cloudNote => {
        if (cloudNote && cloudNote !== saved) {
          setNotesContent(cloudNote)
          localStorage.setItem(notesStorageKey, cloudNote)
        }
      }).catch(() => {})
    }
  }, [notesStorageKey, effectiveContextId, userPrefix])

  // Auto-save Notes (debounced 400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notesStorageKey) {
        localStorage.setItem(notesStorageKey, notesContent)
        setNotesLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        if (userPrefix && userPrefix !== 'guest') {
          saveUserNote(userPrefix, effectiveContextId, notesContent).catch(() => {})
        }
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [notesContent, notesStorageKey, userPrefix, effectiveContextId])

  // Feedback tracking per message
  const [feedbackState, setFeedbackState] = useState({})
  const [adminDeclineLogs, setAdminDeclineLogs] = useState([])
  const [adminUsageStats, setAdminUsageStats] = useState({})

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const notesTextareaRef = useRef(null)

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen && !isMinimized && panelTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isMinimized, isTyping, panelTab])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && panelTab === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, isMinimized, panelTab])

  // Global keyboard shortcut & event listeners
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

    const handleOpenChat = () => {
      setIsOpen(true)
      setIsMinimized(false)
      setPanelTab('chat')
    }

    const handleOpenNotes = () => {
      setIsOpen(true)
      setIsMinimized(false)
      setPanelTab('notes')
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-naen-ai', handleOpenChat)
    window.addEventListener('open-sentinel-ai', handleOpenChat)
    window.addEventListener('open-lab-notes', handleOpenNotes)
    window.addEventListener('toggle-lab-notes', handleOpenNotes)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-naen-ai', handleOpenChat)
      window.removeEventListener('open-sentinel-ai', handleOpenChat)
      window.removeEventListener('open-lab-notes', handleOpenNotes)
      window.removeEventListener('toggle-lab-notes', handleOpenNotes)
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

  // Handle chat sending
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
          completedMasterActivities,
          activeProfileId: activeProfile?.id || 'guest',
          activeProfileName: activeProfile?.name || 'Guest Learner',
          activeProfileEmail: activeProfile?.email || '',
          currentNotesSnippet: notesContent ? notesContent.slice(0, 300) : ''
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
  }, [inputText, isTyping, cooldownRemaining, location.pathname, activeScenarioId, masterTotalXP, masterProgressPercent, completedMasterActivities, activeProfile, notesContent])

  // Append assistant message text to student's active notes
  const handleAppendToNotes = (text) => {
    playTactileClick()
    const cleanText = text.replace(/\[Source:.*?\]/g, '').trim()
    const noteEntry = `\n\n### 💡 Key Takeaway from NAEN AI (${new Date().toLocaleTimeString()}):\n${cleanText}\n`
    setNotesContent(prev => (prev ? prev + noteEntry : noteEntry))
    setToastMsg('Saved to Notes Organiser!')
    setTimeout(() => setToastMsg(null), 2500)
  }

  // Insert Note Template
  const handleInsertTemplate = (templateStr) => {
    playTactileClick()
    setNotesContent(prev => (prev ? `${prev}\n\n${templateStr}` : templateStr))
    setNotesMode('edit')
    setToastMsg('Template inserted!')
    setTimeout(() => setToastMsg(null), 2000)
  }

  // Generate Notes with AI
  const handleGenerateAiNotes = async (e) => {
    e?.preventDefault()
    const q = notesAiQuery.trim()
    if (!q || isGeneratingNotes) return
    setIsGeneratingNotes(true)
    playTactileClick()

    try {
      const generated = await generateNotesOrLabSteps(q, 'BRIEF_NOTES', {
        contextId: effectiveContextId,
        route: location.pathname
      })

      if (generated) {
        setNotesContent(prev => `${prev ? prev + '\n\n' : ''}## 🤖 AI Note: ${q}\n${generated}`)
        setNotesAiQuery('')
        setToastMsg('AI Notes generated & appended!')
        setTimeout(() => setToastMsg(null), 2500)
      }
    } catch (err) {
      setToastMsg('Could not generate notes. Please try again.')
      setTimeout(() => setToastMsg(null), 2500)
    } finally {
      setIsGeneratingNotes(false)
    }
  }

  // Copy Notes
  const handleCopyNotes = () => {
    playTactileClick()
    try {
      navigator.clipboard.writeText(notesContent)
      setNotesCopied(true)
      setToastMsg('Notes copied to clipboard!')
      setTimeout(() => {
        setNotesCopied(false)
        setToastMsg(null)
      }, 2000)
    } catch {
      setNotesCopied(true)
    }
  }

  // Download Notes as .md
  const handleDownloadNotes = () => {
    playTactileClick()
    const blob = new Blob([notesContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `secloudive-notes-${effectiveContextId}-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    setToastMsg('Notes exported as Markdown file!')
    setTimeout(() => setToastMsg(null), 2500)
  }

  // Clear Notes
  const handleClearNotes = () => {
    if (!notesContent.trim()) return
    if (window.confirm('Are you sure you want to clear your notes for this section?')) {
      playTactileClick()
      setNotesContent('')
      setToastMsg('Notes cleared.')
      setTimeout(() => setToastMsg(null), 2000)
    }
  }

  // Feedback handlers
  const handleVote = (msgId, voteType) => {
    setFeedbackState(prev => ({
      ...prev,
      [msgId]: { ...prev[msgId], voted: voteType, submitted: false }
    }))
    sentinelClient.recordFeedback(msgId, voteType === 'up')
  }

  const handleFeedbackComment = (msgId, comment) => {
    if (!comment.trim()) return
    setFeedbackState(prev => ({
      ...prev,
      [msgId]: { ...prev[msgId], comment, submitted: true }
    }))
    const currentVote = feedbackState[msgId]?.voted === 'up'
    sentinelClient.recordFeedback(msgId, currentVote, comment)
  }

  // Pre-configured high-impact prompt chips across website and resources
  const promptChips = [
    { label: '🗺️ Platform Navigator', query: 'Guide me through SeCloudive: what are all the key tools, simulators, labs, and routes available?' },
    { label: '📚 15 Official Workbooks', query: 'What are all 15 official NAEN Studios PDF workbooks and what does each cover?' },
    { label: '🏛️ Real Case Studies', query: 'Explain the Capital One SSRF and Uber 2022 credential leak case studies, their root causes, and prevention.' },
    { label: '⚡ Top 25 IAM Conditions', query: 'What are the top AWS IAM policy conditions (aws:PrincipalOrgID, aws:SourceVpc, aws:SecureTransport) and when should I use them?' },
    { label: '💼 Live Internships 2026', query: 'What live cloud security internships are currently active (AWS, Mandiant, CrowdStrike) and what skills are required?' },
    { label: '🎯 SCS-C02 Exam Strategy', query: 'What is the exact evaluation order when identity policies, resource policies, and permission boundaries conflict in AWS?' }
  ]

  const handleResetChat = () => {
    setMessages([
      {
        id: `sentinel-reset-${Date.now()}`,
        sender: 'assistant',
        text: `Chat cleared. I'm **NAEN AI**, your cloud security analyst mentor.\n\nAsk me anything about Linux foundations, Docker/Terraform labs, Kubernetes security, multi-cloud architecture, or internship interview prep!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceTag: '[Source: Platform Guidelines]'
      }
    ])
  }

  // Word count helper
  const wordCount = notesContent.trim() ? notesContent.trim().split(/\s+/).length : 0

  return (
    <>
      {/* ── FLOATING ACTION BUTTON (FAB LAUNCHER) ─────────────────────────── */}
      {!isOpen && (
        <button
          id="sentinel-fab-button"
          onClick={() => {
            playTactileClick()
            setIsOpen(true)
          }}
          aria-label="Open NAEN AI Floating Chat Box (Ctrl+K)"
          title="Open NAEN AI Floating Chat Box (Ctrl+K)"
          className="sentinel-launcher"
          style={{
            background: 'linear-gradient(135deg, rgba(2, 44, 34, 0.95) 0%, rgba(6, 78, 59, 0.95) 45%, rgba(14, 116, 144, 0.9) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.65)',
            boxShadow: '0 10px 35px -5px rgba(2, 132, 199, 0.45), 0 0 25px rgba(16, 185, 129, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div className="sentinel-launcher-icon">
            <Sparkles size={17} style={{ color: '#38bdf8' }} className="animate-pulse" />
            <span className="sentinel-ping-dot" style={{ background: '#10b981' }} />
          </div>
          <span style={{ fontWeight: 800, letterSpacing: '0.4px', color: '#f8fafc' }}>NAEN AI</span>
          <span className="sentinel-shortcut-pill" style={{ background: 'rgba(15, 23, 42, 0.8)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>Ctrl+K</span>
        </button>
      )}

      {/* ── EXPANDING FLOATING CHAT BOX WINDOW ─────────────────────────────── */}
      {isOpen && (
        <div
          id="sentinel-chat-panel"
          role="region"
          aria-label="NAEN AI Security Assistant & Notes Organiser"
          className={`sentinel-modal ${isMinimized ? 'minimized' : ''}`}
          style={{
            background: 'linear-gradient(180deg, #070d1d 0%, #030712 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 40px rgba(56, 189, 248, 0.2)'
          }}
        >
          {/* HEADER */}
          <div className="sentinel-header" style={{ background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.95) 100%)', borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div className="sentinel-brand">
              <div className="sentinel-avatar" style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}>
                <Sparkles size={16} />
              </div>
              <div className="sentinel-title-box">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>NAEN AI</span>
                  <span className="sentinel-role-tag" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                    🟢 Online Copilot
                  </span>
                </h3>
                <p className="sentinel-disclosure-sub">
                  {DISCLOSURE_GEMINI}
                </p>
              </div>
            </div>

            <div className="sentinel-header-actions">
              <button
                type="button"
                onClick={handleResetChat}
                title="Start New Conversation"
                aria-label="Reset chat"
                className="sentinel-btn-icon"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setShowAdminView(prev => !prev)}
                title="Admin & Safety Telemetry View"
                aria-label="Admin telemetry"
                className={`sentinel-btn-icon ${showAdminView ? 'active' : ''}`}
              >
                <BarChart3 size={15} />
              </button>
              <button
                type="button"
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
                type="button"
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
              {/* ── UNIFIED TAB SWITCHER: CHAT VS NOTES ORGANISER ───────────── */}
              <div className="sentinel-tab-switcher">
                <button
                  type="button"
                  className={`sentinel-tab-btn ${panelTab === 'chat' ? 'active' : ''}`}
                  onClick={() => { playTactileClick(); setPanelTab('chat'); }}
                >
                  <MessageSquare size={13} />
                  <span>AI Copilot</span>
                </button>
                <button
                  type="button"
                  className={`sentinel-tab-btn ${panelTab === 'notes' ? 'active' : ''}`}
                  onClick={() => { playTactileClick(); setPanelTab('notes'); }}
                >
                  <FileText size={13} />
                  <span>Notes Organiser</span>
                  {notesContent.trim() && <span className="notes-saved-dot" />}
                </button>
              </div>

              {/* Toast Message Notification */}
              {toastMsg && (
                <div style={{
                  padding: '6px 12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderBottom: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle2 size={13} />
                  <span>{toastMsg}</span>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* TAB 1: AI COPILOT CHAT VIEW                                    */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              {panelTab === 'chat' && (
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

                  {/* QUICK WEBSITE NAVIGATION STRIP */}
                  {!showAdminView && (
                    <div className="sentinel-nav-strip">
                      <span style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 700, paddingRight: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Nav:</span>
                      {[
                        { label: '📥 15 Workbooks', path: '/downloads' },
                        { label: '🧪 Free Labs ($0)', path: '/labs' },
                        { label: '🕵️ Investigations', path: '/investigations' },
                        { label: '⚔️ Battle Rooms', path: '/battle-rooms' },
                        { label: '💼 Internships', path: '/internships' },
                        { label: '🎤 Mock Interviews', path: '/interviews' },
                        { label: '📐 Studio', path: '/studio' },
                        { label: '📚 Curriculum', path: '/learn' }
                      ].map((nav, nIdx) => (
                        <button
                          key={nIdx}
                          type="button"
                          className={`sentinel-nav-pill ${location.pathname === nav.path ? 'active' : ''}`}
                          onClick={() => {
                            playTactileClick()
                            navigate(nav.path)
                          }}
                          title={`Navigate to ${nav.label} (${nav.path})`}
                        >
                          <span>{nav.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* ADMIN VIEW */}
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
                            <FormattedTextChunk
                              text={msg.text}
                              onNavigate={(targetPath) => {
                                playTactileClick()
                                navigate(targetPath)
                              }}
                            />

                            {msg.sourceTag && (
                              <div className="sentinel-source-tag">
                                <CheckCircle2 size={12} />
                                <span>{msg.sourceTag}</span>
                              </div>
                            )}

                            {/* 1-Click "Save to Notes" action on assistant messages */}
                            {msg.sender === 'assistant' && msg.id !== 'sentinel-init' && (
                              <button
                                type="button"
                                onClick={() => handleAppendToNotes(msg.text)}
                                title="Append this solution to your Notes Organiser"
                                className="sentinel-append-note-btn"
                              >
                                <FileText size={11} />
                                <span>📌 Save to Notes</span>
                              </button>
                            )}
                          </div>

                          {/* ASSISTANT MESSAGE CONTROLS & FEEDBACK */}
                          {msg.sender === 'assistant' && msg.id !== 'sentinel-init' && (
                            <div className="sentinel-feedback-row">
                              <span>{msg.timestamp}</span>

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

                  {/* TEXTAREA INPUT */}
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

                    <div className="sentinel-disclosure-foot">
                      {DISCLOSURE_NO_GUARANTEE}
                    </div>
                  </div>
                </>
              )}

              {/* ═══════════════════════════════════════════════════════════════ */}
              {/* TAB 2: INTEGRATED SECURITY NOTES ORGANISER                     */}
              {/* ═══════════════════════════════════════════════════════════════ */}
              {panelTab === 'notes' && (
                <div className="sentinel-notes-container">
                  {/* Top Control Bar */}
                  <div className="sentinel-notes-topbar">
                    {/* Scope Selector */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => { playTactileClick(); setNotesScope('context'); }}
                        className={`sentinel-tool-btn ${notesScope === 'context' ? 'active' : ''}`}
                      >
                        📍 Page Notes
                      </button>
                      <button
                        type="button"
                        onClick={() => { playTactileClick(); setNotesScope('global'); }}
                        className={`sentinel-tool-btn ${notesScope === 'global' ? 'active' : ''}`}
                      >
                        🌐 Global Notebook
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="sentinel-notes-tools">
                      <button
                        type="button"
                        onClick={() => { playTactileClick(); setNotesMode(m => m === 'edit' ? 'preview' : 'edit'); }}
                        className="sentinel-tool-btn"
                        title={notesMode === 'edit' ? 'Switch to Markdown Preview' : 'Switch to Editor'}
                      >
                        {notesMode === 'edit' ? <Eye size={12} /> : <Edit3 size={12} />}
                        <span>{notesMode === 'edit' ? 'Preview' : 'Edit'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyNotes}
                        className="sentinel-tool-btn"
                        title="Copy All Notes"
                      >
                        {notesCopied ? <Check size={12} style={{ color: '#34d399' }} /> : <Copy size={12} />}
                        <span>{notesCopied ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadNotes}
                        className="sentinel-tool-btn"
                        title="Download Markdown (.md)"
                      >
                        <Download size={12} />
                        <span>Export</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleClearNotes}
                        className="sentinel-tool-btn"
                        title="Clear Notes"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Template Starters Bar */}
                  <div className="sentinel-templates-bar">
                    <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, paddingRight: '4px' }}>
                      TEMPLATES:
                    </span>
                    {NOTE_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInsertTemplate(tmpl.template)}
                        className="sentinel-template-chip"
                      >
                        {tmpl.label}
                      </button>
                    ))}
                  </div>

                  {/* AI Notes Generation Bar */}
                  <form onSubmit={handleGenerateAiNotes} style={{
                    padding: '0.45rem 0.85rem',
                    background: 'rgba(56, 189, 248, 0.05)',
                    borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    <input
                      type="text"
                      value={notesAiQuery}
                      onChange={(e) => setNotesAiQuery(e.target.value)}
                      placeholder="Ask AI to generate runbook or notes (e.g. S3 Public Access)..."
                      style={{
                        flex: 1,
                        background: 'rgba(2, 6, 23, 0.8)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        color: '#f8fafc',
                        fontSize: '0.74rem'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!notesAiQuery.trim() || isGeneratingNotes}
                      style={{
                        background: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Sparkles size={12} className={isGeneratingNotes ? 'animate-spin' : ''} />
                      <span>{isGeneratingNotes ? 'Writing...' : 'AI Notes'}</span>
                    </button>
                  </form>

                  {/* Notes Editor or Preview */}
                  {notesMode === 'edit' ? (
                    <textarea
                      ref={notesTextareaRef}
                      value={notesContent}
                      onChange={(e) => setNotesContent(e.target.value)}
                      placeholder="Start typing your technical runbook, command steps, attack vectors, or interview notes here... (Supports Markdown)"
                      className="sentinel-notes-editor"
                    />
                  ) : (
                    <div className="sentinel-notes-preview">
                      {notesContent.trim() ? (
                        <div style={{ whiteSpace: 'pre-wrap', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem' }}>
                          {notesContent}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                          <BookOpen size={28} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                          <p style={{ margin: 0, fontSize: '0.82rem' }}>No notes in this section yet.</p>
                          <small>Switch to "Edit" or click a template above to start taking notes.</small>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes Footer Status */}
                  <div className="sentinel-notes-foot">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="notes-saved-dot" />
                      <span>Auto-saved {notesLastSaved ? `at ${notesLastSaved}` : 'locally'}</span>
                    </div>
                    <div>
                      <span>{wordCount} words • {notesContent.length} chars</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
