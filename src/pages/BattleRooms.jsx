import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ShieldAlert, 
  Terminal, 
  Flame, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Copy, 
  Check, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Skull, 
  Cpu, 
  Layers,
  Flag,
  RotateCcw,
  BookOpen,
  Briefcase,
  Timer,
  Play,
  Pause,
  Lightbulb,
  FileEdit,
  Zap,
  Trophy,
  CornerDownLeft,
  CheckCircle,
  FileCode,
  ExternalLink,
  FileText,
  Shield
} from 'lucide-react'
import { battleRooms } from '../data/battleRooms'
import CopyrightDisclaimer from '../components/CopyrightDisclaimer'
import LabNotesScratchpad from '../components/LabNotesScratchpad'
import DefenderQuoteCallout from '../components/DefenderQuoteCallout'
import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick, playTabWhoosh } from '../utils/cyberMotionAudio'

export default function BattleRooms() {
  const { id } = useParams()
  const { battleRoomsSolved, submitBattleRoomFlag, addMasterXP } = useChallenges()
  const [selectedRoomId, setSelectedRoomId] = useState(id || battleRooms[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('offensive') // 'offensive' | 'defensive' | 'hardening' | 'writeup'
  const [copiedIndex, setCopiedIndex] = useState(null)
  
  // CTF Flag state
  const [userFlagInput, setUserFlagInput] = useState('')
  const [flagStatus, setFlagStatus] = useState(null) // null | 'success' | 'error'

  // CTF Speedrun Mission Timer state
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(true)

  // Progressive Hints State
  const [unlockedHints, setUnlockedHints] = useState([]) // [1, 2, 3]

  // In-Browser Live Interactive Terminal State
  const [terminalLines, setTerminalLines] = useState([])
  const [terminalInput, setTerminalInput] = useState('')
  const [isTerminalRunning, setIsTerminalRunning] = useState(false)
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const terminalEndRef = useRef(null)

  const currentRoom = battleRooms.find(r => r.id === selectedRoomId) || battleRooms[0]

  // Reset room-specific timer and hints on room switch
  useEffect(() => {
    setTimerSeconds(0)
    setIsTimerActive(true)
    setUnlockedHints([])
    setUserFlagInput('')
    setFlagStatus(null)
  }, [selectedRoomId])

  // Timer interval
  useEffect(() => {
    let interval = null
    if (isTimerActive && !battleRoomsSolved[currentRoom.id]) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerActive, currentRoom.id, battleRoomsSolved])

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  const isSpeedrunEligible = timerSeconds < 600 && !battleRoomsSolved[currentRoom.id]

  useEffect(() => {
    if (id && battleRooms.some(r => r.id === id)) {
      setSelectedRoomId(id)
    }
  }, [id])

  const handleCopyCode = (code, index) => {
    playTactileClick()
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Initialize terminal session for active room
  useEffect(() => {
    setTerminalLines([
      { type: 'sys', text: `[CloudShell v3.2.0-sec] Session initialized for ${currentRoom.title}` },
      { type: 'sys', text: `Target Asset: ${currentRoom.scenarioContext?.affectedAsset || currentRoom.scenarioContext?.targetBucket || 'AWS Cloud Infrastructure'} | Role: SecOps Analyst` },
      { type: 'sys', text: `Type 'help' for incident inspection commands, or click '▶ Run in Terminal' on any task.` }
    ])
  }, [selectedRoomId])

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [terminalLines])

  const handleExecuteCommand = (cmdToRun) => {
    const rawCmd = (cmdToRun || terminalInput).trim()
    if (!rawCmd) return

    playTactileClick()
    setTerminalLines(prev => [...prev, { type: 'cmd', text: rawCmd }])
    setTerminalInput('')
    setIsTerminalRunning(true)

    setTimeout(() => {
      setIsTerminalRunning(false)
      const lower = rawCmd.toLowerCase()

      if (lower === 'help') {
        setTerminalLines(prev => [
          ...prev,
          {
            type: 'output',
            text: `Available Incident Commands:
  - aws sts get-caller-identity               (Inspect active IAM credentials)
  - aws s3 ls                                 (List accessible S3 buckets)
  - aws guardduty list-findings               (Query active threat detections)
  - aws cloudtrail lookup-events              (Query recent management API calls)
  - kubectl get pods -A                       (List Kubernetes pods across namespaces)
  - terraform plan                            (Simulate IaC security validation)
  - cat /flag.txt                             (Inspect captured verification token)
  - clear                                     (Clear terminal screen)`
          }
        ])
      } else if (lower === 'clear') {
        setTerminalLines([])
      } else if (lower.includes('flag') || lower === 'cat /flag.txt') {
        setTerminalLines(prev => [
          ...prev,
          {
            type: 'flag',
            text: `[FLAG TOKEN DISCOVERED]: ${currentRoom.flag}`
          }
        ])
      } else if (lower.includes('sts get-caller-identity') || lower.includes('caller-identity')) {
        setTerminalLines(prev => [
          ...prev,
          {
            type: 'output',
            text: JSON.stringify({
              UserId: "AROA3XAMPLESECINVESTIGATOR:session-01",
              Account: "123456789012",
              Arn: `arn:aws:sts::123456789012:assumed-role/SecOps-IncidentResponder/${currentRoom.id}-auditor`
            }, null, 2)
          }
        ])
      } else if (lower.includes('s3 ls')) {
        setTerminalLines(prev => [
          ...prev,
          {
            type: 'output',
            text: `2026-09-30 14:22:10 ${currentRoom.scenarioContext?.targetBucket || 's3://production-audit-logs-vault'}\n2026-09-30 14:23:45 s3://corp-internal-finance-archive-2026\n2026-09-30 14:25:01 s3://aws-cloudtrail-logs-123456789012`
          }
        ])
      } else if (lower.includes('guardduty')) {
        setTerminalLines(prev => [
          ...prev,
          {
            type: 'output',
            text: JSON.stringify({
              FindingIds: [
                `gd-${currentRoom.id}-alert-001`,
                "gd-threat-telemetry-compromise-high"
              ],
              DetectorId: "d-9876543210ab",
              FindingType: currentRoom.category.includes('GenAI') ? "UnauthorizedAccess:IAMUser/BedrockExfiltration" : "UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration"
            }, null, 2)
          }
        ])
      } else if (lower.includes('kubectl')) {
        setTerminalLines(prev => [
          ...prev,
          {
            type: 'output',
            text: `NAMESPACE     NAME                               READY   STATUS    RESTARTS   AGE
kube-system   aws-node-5kx8z                     1/1     Running   0          42d
kube-system   coredns-78fcd69978-2j4p9           1/1     Running   0          42d
payments      payment-gateway-6f9b8c9d4-x7k2p    1/1     Running   0          3h
security      falco-daemonset-9m2k1              1/1     Running   0          18d`
          }
        ])
      } else if (lower.includes('terraform')) {
        setTerminalLines(prev => [
          ...prev,
          {
            type: 'output',
            text: `Terraform used the selected providers to generate the following execution plan.
Resource actions are indicated with the following symbols:
  + create
  ~ update in-place

Terraform will perform the following actions:
  # aws_iam_role_policy.strict_least_privilege will be created
  + resource "aws_iam_role_policy" "strict_least_privilege" {
      + id     = (known after apply)
      + policy = (jsonencode strict zero-trust policy)
    }

Plan: 1 to add, 0 to change, 0 to destroy.
[CHECK] 0 policy violations detected via Checkov / tfsec.`
          }
        ])
      } else {
        // Echo command executed successfully
        setTerminalLines(prev => [
          ...prev,
          {
            type: 'output',
            text: `[EXECUTION OK] Command successfully executed against simulated target node.\nExit Code: 0 (SUCCESS)\nEvent telemetry recorded to CloudTrail / Athena stream.`
          }
        ])
      }
    }, 200)
  }

  const handleFlagSubmit = (e) => {
    e.preventDefault()
    playTactileClick()
    const success = submitBattleRoomFlag(currentRoom.id, userFlagInput)
    if (success) {
      setFlagStatus('success')
      setIsTimerActive(false)
      // Award speedrun bonus if completed quickly
      if (isSpeedrunEligible && typeof addMasterXP === 'function') {
        addMasterXP(50)
      }
    } else {
      setFlagStatus('error')
    }
  }

  const handleUnlockHint = (hintNum, cost) => {
    playTactileClick()
    if (!unlockedHints.includes(hintNum)) {
      setUnlockedHints(prev => [...prev, hintNum])
    }
  }

  const filteredRooms = battleRooms.filter(room => 
    room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isCurrentRoomSolved = !!battleRoomsSolved[currentRoom.id]

  return (
    <main className="page-shell battle-rooms-page">
      {/* Page Header */}
      <div className="battle-header">
        <div>
          <div style={{ marginBottom: '8px' }}>
            <Link to="/#structured-path" style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'rgba(56, 189, 248, 0.1)', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '11px', fontFamily: 'monospace' }}>
              🎯 Structured Path • Tier 4: Architecture Layer
            </Link>
          </div>
          <div className="eyebrow">
            <span className="pulse-dot" style={{ backgroundColor: '#ef4444' }} /> PURPLE TEAM CLOUD BATTLE ROOMS /// TRYHACKME & HACKTHEBOX STYLE
          </div>
          <h1>
            Cloud Security Battle Rooms<span>.</span>
          </h1>
          <p>
            Master the dual perspectives of Cloud Security: exploit real cloud vulnerabilities as an attacker (Red Team), trace the forensic smoking gun in CloudTrail as a defender (Blue Team), and permanently harden infrastructure.
          </p>
        </div>

        <div className="battle-stats-badge">
          <div className="stat-item">
            <span>SOLVED ROOMS</span>
            <strong className="text-emerald">{Object.keys(battleRoomsSolved).length} / {battleRooms.length}</strong>
          </div>
          <div className="stat-item">
            <span>TOTAL XP</span>
            <strong className="text-purple">
              {Object.keys(battleRoomsSolved).reduce((acc, roomId) => {
                const room = battleRooms.find(r => r.id === roomId)
                return acc + (room?.points || 0)
              }, 0)} pts
            </strong>
          </div>
        </div>
      </div>

      {/* Trademark Reference Notice */}
      <div className="thm-htb-notice">
        <Sparkles size={16} className="text-amber" />
        <span>
          <strong>Pedagogical Reference:</strong> Inspired by the gamified hands-on challenge rooms popularized by <em>TryHackMe®</em> and <em>HackTheBox®</em>. Built with 100% original AWS enterprise attack-and-defense simulations.
        </span>
      </div>

      {/* ── ENCOURAGING DEFENDER TACTICAL WISDOM CALLOUT ── */}
      <DefenderQuoteCallout category="tactical" autoCycle={true} cycleIntervalMs={14000} />

      <div className="battle-container-layout">
        {/* Left Sidebar: Room List */}
        <aside className="battle-sidebar">
          <div className="battle-search-box">
            <Search size={15} />
            <input 
              type="text" 
              placeholder="Filter rooms by name, threat, category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="room-nav-list">
            {filteredRooms.map((room) => {
              const isSolved = !!battleRoomsSolved[room.id]
              const isSelected = room.id === currentRoom.id
              return (
                <button
                  type="button"
                  key={room.id}
                  onClick={() => {
                    setSelectedRoomId(room.id)
                    setUserFlagInput('')
                    setFlagStatus(null)
                  }}
                  className={`room-nav-card ${isSelected ? 'active' : ''} ${isSolved ? 'solved' : ''}`}
                >
                  <div className="room-nav-top">
                    <span className="room-cat-tag">{room.category}</span>
                    <span className={`room-diff-tag diff-${room.difficulty.toLowerCase().split('/')[0].trim()}`}>
                      {room.difficulty}
                    </span>
                  </div>
                  <h4>{room.title}</h4>
                  <div className="room-nav-foot">
                    <span>{room.duration} • {room.points} XP</span>
                    {isSolved ? (
                      <span className="solved-badge"><CheckCircle2 size={13} /> Solved</span>
                    ) : (
                      <span className="unsolved-badge"><Lock size={12} /> Open</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Right Main Panel: Room Workspace */}
        <section className="battle-workspace">
          {/* Room Banner */}
          <div className="room-banner-card">
            <div className="room-banner-top">
              <div className="room-meta-tags">
                <span className="room-category-pill">{currentRoom.category}</span>
                <span className="room-duration-pill">{currentRoom.duration}</span>
                <span className="room-points-pill">{currentRoom.points} Points</span>
                <span className="room-mitre-pill">{currentRoom.mitreTactic}</span>
              </div>

              {/* Speedrun Timer & Notes Action Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div 
                  className="ctf-speedrun-timer-box"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    fontSize: '0.78rem',
                    fontFamily: 'monospace'
                  }}
                  title="Mission Elapsed Timer. Complete under 10m for 1.5x Speedrun XP bonus!"
                >
                  <Timer size={14} className={isSpeedrunEligible ? 'text-amber animate-pulse' : 'text-slate-400'} />
                  <span style={{ color: isSpeedrunEligible ? '#fbbf24' : '#94a3b8', fontWeight: 700 }}>
                    {formatTimer(timerSeconds)}
                  </span>
                  {isSpeedrunEligible && (
                    <span style={{ fontSize: '0.62rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '1px 4px', borderRadius: '4px', fontWeight: 800 }}>
                      1.5x BONUS
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => { playTactileClick(); setIsTimerActive(p => !p); }}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 2px' }}
                    title={isTimerActive ? 'Pause Timer' : 'Resume Timer'}
                  >
                    {isTimerActive ? <Pause size={12} /> : <Play size={12} />}
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-room-notes-trigger"
                  onClick={() => {
                    playTactileClick()
                    window.dispatchEvent(new CustomEvent('open-lab-notes', { detail: { contextId: currentRoom.id } }))
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <FileEdit size={13} />
                  <span>Room Notes</span>
                </button>

                {isCurrentRoomSolved && (
                  <div className="solved-pennant">
                    <CheckCircle2 size={16} /> CTF FLAG CAPTURED
                  </div>
                )}
              </div>
            </div>

            <h2>{currentRoom.title}</h2>
            <p className="room-summary-text">{currentRoom.summary}</p>

            {/* Layoff-Proof Skills Defense Card */}
            <div className="layoff-proof-card">
              <div className="lp-icon">
                <Briefcase size={20} />
              </div>
              <div className="lp-body">
                <strong>WHY THIS MAKES YOU INDISPENSABLE & LAYOFF-PROOF:</strong>
                <p>{currentRoom.layoffProofValue}</p>
              </div>
            </div>

            {/* Legacy vs Modern Comparison */}
            <div className="legacy-modern-strip">
              <div className="lm-col lm-legacy">
                <span className="lm-label"><AlertTriangle size={13} /> Legacy Technical Debt (The Mistake)</span>
                <p>{currentRoom.legacyVsModern.legacyMistake}</p>
              </div>
              <div className="lm-col lm-modern">
                <span className="lm-label"><CheckCircle2 size={13} /> Modern Production Standard (Zero Trust)</span>
                <p>{currentRoom.legacyVsModern.modernFix}</p>
              </div>
            </div>
          </div>

          {/* Perspective View Selector (Red Team vs Blue Team vs Hardening vs Writeup) */}
          <div className="perspective-tabs" style={{ flexWrap: 'wrap', gap: '8px' }}>
            <button 
              type="button" 
              className={`p-tab tab-red ${activeTab === 'offensive' ? 'active' : ''}`}
              onClick={() => { playTabWhoosh(); setActiveTab('offensive'); }}
            >
              <Skull size={16} /> Red Team: Attack & Exploit PoC
            </button>
            <button 
              type="button" 
              className={`p-tab tab-blue ${activeTab === 'defensive' ? 'active' : ''}`}
              onClick={() => { playTabWhoosh(); setActiveTab('defensive'); }}
            >
              <Terminal size={16} /> Blue Team: Detection & Forensics
            </button>
            <button 
              type="button" 
              className={`p-tab tab-green ${activeTab === 'hardening' ? 'active' : ''}`}
              onClick={() => { playTabWhoosh(); setActiveTab('hardening'); }}
            >
              <ShieldCheck size={16} /> Remediation: Minute-0 & IaC Defense
            </button>
            <button 
              type="button" 
              className={`p-tab tab-amber ${activeTab === 'writeup' ? 'active' : ''}`}
              onClick={() => { playTabWhoosh(); setActiveTab('writeup'); }}
              style={{
                borderColor: isCurrentRoomSolved ? 'rgba(245, 158, 11, 0.5)' : 'rgba(148, 163, 184, 0.25)',
                background: activeTab === 'writeup' ? 'rgba(245, 158, 11, 0.15)' : 'transparent'
              }}
            >
              {isCurrentRoomSolved ? <Unlock size={16} className="text-amber" /> : <Lock size={16} className="text-slate" />}
              <span>Official Writeup & Solutions</span>
              {!isCurrentRoomSolved && (
                <span style={{ fontSize: '0.62rem', background: 'rgba(239,68,68,0.2)', color: '#f87171', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                  LOCKED
                </span>
              )}
            </button>
          </div>

          {/* WRITEUP TAB: HTB-Style Post-Completion Intelligence Dossier */}
          {activeTab === 'writeup' ? (
            <div className="writeup-tab-container" style={{ margin: '20px 0' }}>
              {!isCurrentRoomSolved ? (
                <div style={{
                  padding: '40px 24px',
                  textAlign: 'center',
                  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(9, 14, 23, 0.95) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <Lock size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px 0' }}>
                    Classified Incident Post-Mortem & Solutions Sealed
                  </h3>
                  <p style={{ maxWidth: '580px', margin: '0 auto 20px', color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.6 }}>
                    In accordance with Hack The Box and TryHackMe pedagogical standards, the official incident post-mortem,
                    senior architect walkthrough, and copyable hardened Terraform blueprint are sealed until you capture the flag.
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    marginBottom: '20px',
                    fontSize: '0.8rem'
                  }}>
                    <span style={{ color: '#94a3b8' }}>Target Flag: <strong style={{ color: '#38bdf8', fontFamily: 'monospace' }}>{currentRoom.flag.slice(0, 10)}...</strong></span>
                    <span style={{ color: '#94a3b8' }}>Reward: <strong style={{ color: '#f59e0b' }}>+{currentRoom.points} XP</strong></span>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => {
                        const inputEl = document.querySelector('.flag-text-input')
                        inputEl?.focus()
                        inputEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }}
                      style={{ margin: '0 auto' }}
                    >
                      <Flag size={15} /> Jump to Flag Submission
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(9, 14, 23, 0.98) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '16px',
                  padding: '28px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6)'
                }}>
                  {/* Unlocked Banner */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle size={20} className="text-emerald" />
                      <div>
                        <strong style={{ color: '#34d399', fontSize: '0.92rem' }}>Proof of Mastery Verified • Classified Dossier Unlocked</strong>
                        <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>You captured the verification flag. Official senior defender debrief is now accessible.</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.74rem', background: '#059669', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
                      SOLVED
                    </span>
                  </div>

                  {/* Section 1: Executive Incident Summary */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={18} className="text-cyan" /> 1. Incident Executive Summary & Root Cause
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: 1.6, background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {currentRoom.writeup?.incidentSummary || currentRoom.summary}
                    </p>
                  </div>

                  {/* Section 2: MITRE ATT&CK Chain Table */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={18} className="text-rose" /> 2. MITRE ATT&CK Chain Reconstruction
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', overflow: 'hidden' }}>
                        <thead>
                          <tr style={{ background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '10px 14px', textAlign: 'left', color: '#94a3b8' }}>TACTIC</th>
                            <th style={{ padding: '10px 14px', textAlign: 'left', color: '#94a3b8' }}>TECHNIQUE</th>
                            <th style={{ padding: '10px 14px', textAlign: 'left', color: '#94a3b8' }}>EXPLOIT DETAILS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(currentRoom.writeup?.mitreAttackChain || [
                            { tactic: 'Initial Access', technique: 'T1190 Exploit Public-Facing Application', detail: currentRoom.summary }
                          ]).map((chain, cIdx) => (
                            <tr key={cIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: '10px 14px', fontWeight: 700, color: '#38bdf8' }}>{chain.tactic}</td>
                              <td style={{ padding: '10px 14px', color: '#f8fafc', fontFamily: 'monospace', fontSize: '0.78rem' }}>{chain.technique}</td>
                              <td style={{ padding: '10px 14px', color: '#cbd5e1' }}>{chain.detail}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 3: Senior Cloud Security Engineer Step-by-Step Walkthrough */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={18} className="text-amber" /> 3. Senior Engineer Tactical Walkthrough
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(currentRoom.writeup?.seniorEngineerWalkthrough || [
                        `1. Reconnaissance: Verify target asset ${currentRoom.scenarioContext?.affectedAsset || currentRoom.scenarioContext?.targetBucket || 'cloud asset'}.`,
                        `2. Root Cause: ${currentRoom.legacyVsModern.legacyMistake}`,
                        `3. Permanent Fix: ${currentRoom.legacyVsModern.modernFix}`
                      ]).map((step, sIdx) => (
                        <div key={sIdx} style={{ padding: '10px 14px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.84rem', color: '#e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.72rem' }}>
                            {sIdx + 1}
                          </span>
                          <span style={{ lineHeight: 1.5 }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Hardened Production Terraform Blueprint */}
                  {currentRoom.writeup?.hardenedTerraformCode && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileCode size={18} className="text-emerald" /> 4. Production-Hardened Terraform Blueprint
                        </h3>
                        <button
                          type="button"
                          className="btn-copy-code"
                          onClick={() => handleCopyCode(currentRoom.writeup.hardenedTerraformCode, 'writeup-tf')}
                        >
                          {copiedIndex === 'writeup-tf' ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                          <span>{copiedIndex === 'writeup-tf' ? 'Copied Blueprint!' : 'Copy Terraform'}</span>
                        </button>
                      </div>
                      <div className="code-block-wrapper">
                        <pre className="code-content" style={{ maxHeight: '300px' }}>
                          <code>{currentRoom.writeup.hardenedTerraformCode}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Section 5: Continuous Detection Rule (KQL / Athena) */}
                  {currentRoom.writeup?.detectionRuleKQL && (
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Terminal size={18} className="text-cyan" /> 5. Continuous SIEM Detection Rule (KQL / Athena)
                      </h3>
                      <div className="code-block-wrapper">
                        <pre className="code-content" style={{ maxHeight: '200px' }}>
                          <code>{currentRoom.writeup.detectionRuleKQL}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Section 6: Architectural Lessons Learned */}
                  {currentRoom.writeup?.lessonsLearned && (
                    <div style={{
                      padding: '14px 18px',
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: '10px',
                      fontSize: '0.84rem',
                      color: '#cbd5e1'
                    }}>
                      <strong style={{ color: '#38bdf8' }}>💡 Principal Cloud Architect Takeaway:</strong> {currentRoom.writeup.lessonsLearned}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Room Tasks / Progression */
            <div className="room-tasks-container">
              {currentRoom.tasks
                .filter(t => {
                  if (activeTab === 'offensive') return t.type === 'offensive'
                  if (activeTab === 'defensive') return t.type === 'defensive'
                  return t.type === 'containment' || t.type === 'hardening'
                })
                .map((task, index) => (
                  <div className="battle-task-card" key={index}>
                    <div className="task-card-header">
                      <span className="task-step-pill">Stage {task.step}</span>
                      <h3>{task.title}</h3>
                    </div>

                    <p className="task-instruction">{task.instruction}</p>

                    <div className="code-block-wrapper">
                      <div className="code-block-bar">
                        <span className="code-lang-tag">
                          {task.codeSnippet.startsWith('SELECT') || task.codeSnippet.startsWith('--') ? 'SQL (Athena / CloudWatch)' : task.codeSnippet.startsWith('{') ? 'JSON / OpenAPI Schema' : 'Bash / AWS CLI'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn-copy-code"
                            onClick={() => handleExecuteCommand(task.codeSnippet)}
                            style={{
                              background: 'rgba(56, 189, 248, 0.15)',
                              border: '1px solid rgba(56, 189, 248, 0.4)',
                              color: '#38bdf8'
                            }}
                            title="Execute this command directly in the Live Terminal"
                          >
                            <Play size={12} />
                            <span>Run in Terminal</span>
                          </button>
                          <button
                            type="button"
                            className="btn-copy-code"
                            onClick={() => handleCopyCode(task.codeSnippet, index)}
                          >
                            {copiedIndex === index ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                            <span>{copiedIndex === index ? 'Copied!' : 'Copy Code'}</span>
                          </button>
                        </div>
                      </div>
                      <pre className="code-content">
                        <code>{task.codeSnippet}</code>
                      </pre>
                    </div>

                    <div className="task-explanation-box">
                      <InfoIcon size={15} />
                      <span><strong>Security Engineering Insight:</strong> {task.explanation}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* DOCKED IN-BROWSER INTERACTIVE ATTACK & DEFENSE TERMINAL */}
          <div 
            className="interactive-battle-terminal"
            style={{
              margin: '24px 0',
              background: '#030712',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
            }}
          >
            {/* Terminal Header Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              background: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid rgba(56, 189, 248, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                  <Terminal size={14} className="text-cyan" />
                  <span>CloudShell v3.2.0-sec ({activeTab === 'offensive' ? 'RedTeam-Attack' : activeTab === 'defensive' ? 'BlueTeam-SOC' : 'IaC-Hardening'})</span>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    ● LIVE SANDBOX
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setTerminalLines([])}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontFamily: 'monospace'
                  }}
                  title="Clear terminal screen"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Terminal Output Screen */}
            <div style={{
              padding: '14px 16px',
              minHeight: '180px',
              maxHeight: '320px',
              overflowY: 'auto',
              fontFamily: "'DM Mono', 'Fira Code', monospace",
              fontSize: '0.8rem',
              color: '#f8fafc',
              lineHeight: 1.5
            }}>
              {terminalLines.map((line, idx) => (
                <div key={idx} style={{ marginBottom: '6px' }}>
                  {line.type === 'sys' && (
                    <div style={{ color: '#38bdf8' }}>{line.text}</div>
                  )}
                  {line.type === 'cmd' && (
                    <div style={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: activeTab === 'offensive' ? '#f43f5e' : '#10b981' }}>
                        {activeTab === 'offensive' ? 'attacker@kali-cloud:~#' : 'analyst@soc-console:~$'}
                      </span>
                      <span>{line.text}</span>
                    </div>
                  )}
                  {line.type === 'output' && (
                    <div style={{ color: '#94a3b8', whiteSpace: 'pre-wrap', paddingLeft: '12px', borderLeft: '2px solid rgba(56, 189, 248, 0.2)' }}>
                      {line.text}
                    </div>
                  )}
                  {line.type === 'flag' && (
                    <div style={{
                      padding: '8px 12px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '6px',
                      color: '#34d399',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>{line.text}</span>
                      <button
                        type="button"
                        onClick={() => {
                          playTactileClick()
                          setUserFlagInput(currentRoom.flag)
                        }}
                        style={{
                          background: '#059669',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        Insert Into Flag Box
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isTerminalRunning && (
                <div style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', animation: 'pulse 0.8s infinite' }} />
                  <span>Executing command against cloud node...</span>
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input Bar & Quick Action Chips */}
            <div style={{
              padding: '10px 16px',
              background: 'rgba(11, 19, 34, 0.8)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  handleExecuteCommand(terminalInput)
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <span style={{ color: activeTab === 'offensive' ? '#f43f5e' : '#10b981', fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 700 }}>
                  {activeTab === 'offensive' ? 'attacker@kali-cloud:~#' : 'analyst@soc-console:~$'}
                </span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Enter CLI command (e.g. aws sts get-caller-identity, kubectl get pods, cat /flag.txt, help)"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f8fafc',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.82rem'
                  }}
                />
                <button
                  type="submit"
                  disabled={isTerminalRunning}
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    cursor: 'pointer',
                    fontSize: '0.74rem',
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CornerDownLeft size={12} />
                  <span>Run</span>
                </button>
              </form>

              {/* Quick Command Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Quick Probe:</span>
                {[
                  'aws sts get-caller-identity',
                  'aws s3 ls',
                  'aws guardduty list-findings',
                  'cat /flag.txt',
                  'help'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleExecuteCommand(chip)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '4px',
                      color: '#cbd5e1',
                      fontSize: '0.68rem',
                      fontFamily: 'monospace',
                      padding: '2px 7px',
                      cursor: 'pointer'
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTF Progressive Hint Drawer */}
          <div 
            className="ctf-hints-container" 
            style={{
              margin: '20px 0',
              padding: '16px 20px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lightbulb size={16} className="text-amber" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                  Progressive Tactical Hints (THM/HTB Style)
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                {unlockedHints.length} of 3 Hints Unlocked
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              {/* Hint 1 */}
              <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8' }}>HINT 1 (RECONNAISSANCE)</span>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>FREE</span>
                </div>
                {unlockedHints.includes(1) ? (
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
                    Inspect the action group schema or IAM trust policy. Look for missing resource condition constraints such as <code>aws:PrincipalArn</code> or open S3 prefixes.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUnlockHint(1, 0)}
                    className="button button-ghost btn-sm"
                    style={{ fontSize: '0.76rem', padding: '4px 10px', width: '100%' }}
                  >
                    <Unlock size={12} /> Unlock Recon Hint
                  </button>
                )}
              </div>

              {/* Hint 2 */}
              <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b' }}>HINT 2 (FORENSIC QUERY)</span>
                  <span style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 700 }}>-10 XP</span>
                </div>
                {unlockedHints.includes(2) ? (
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
                    In CloudWatch / Athena logs, search for API events where <code>errorCode IS NULL</code> and the user identity type was <code>AssumedRole</code> or <code>AWSService</code>.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUnlockHint(2, 10)}
                    className="button button-ghost btn-sm"
                    style={{ fontSize: '0.76rem', padding: '4px 10px', width: '100%' }}
                  >
                    <Unlock size={12} /> Unlock Query Hint (-10 XP)
                  </button>
                )}
              </div>

              {/* Hint 3 */}
              <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ef4444' }}>HINT 3 (FLAG TOKEN)</span>
                  <span style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700 }}>-15 XP</span>
                </div>
                {unlockedHints.includes(3) ? (
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
                    The flag token has the structure <code>{currentRoom.flag.slice(0, 10)}...</code>. It is extracted from the simulated exfiltration output in Stage 3.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUnlockHint(3, 15)}
                    className="button button-ghost btn-sm"
                    style={{ fontSize: '0.76rem', padding: '4px 10px', width: '100%' }}
                  >
                    <Unlock size={12} /> Unlock Flag Token Hint (-15 XP)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CTF Flag Submission & Proof-of-Skill Box */}
          <div className="flag-submission-card">
            <div className="flag-header">
              <Flag size={20} className="text-amber" />
              <div>
                <h3>Proof of Mastery: Capture the Flag (CTF)</h3>
                <p>Verify your technical understanding by submitting the solution verification flag, or use the instant validation probe.</p>
              </div>
            </div>

            <form onSubmit={handleFlagSubmit} className="flag-form">
              <div className="flag-input-group">
                <input 
                  type="text" 
                  placeholder="Enter flag format: FLAG{...}" 
                  value={userFlagInput}
                  onChange={(e) => {
                    setUserFlagInput(e.target.value)
                    setFlagStatus(null)
                  }}
                  className={`flag-text-input ${flagStatus === 'success' ? 'is-valid' : flagStatus === 'error' ? 'is-invalid' : ''}`}
                />
                <button type="submit" className="button button-primary">
                  Submit Flag
                </button>
                <button 
                  type="button" 
                  className="button button-ghost"
                  onClick={() => {
                    playTactileClick()
                    setUserFlagInput(currentRoom.flag)
                    setFlagStatus(null)
                  }}
                  title="Reveal flag for self-study and verification"
                >
                  <Unlock size={14} /> Reveal Flag
                </button>
              </div>

              {flagStatus === 'success' && (
                <div className="flag-alert alert-success">
                  <CheckCircle2 size={16} />
                  <span>
                    <strong>Correct Flag!</strong> You earned {currentRoom.points} XP 
                    {isSpeedrunEligible && ' + 50 XP Speedrun Bonus'}! This attack vector and defense control are registered to your transcript.
                  </span>
                </div>
              )}

              {flagStatus === 'error' && (
                <div className="flag-alert alert-error">
                  <AlertTriangle size={16} />
                  <span><strong>Incorrect Flag.</strong> Review the Blue Team detection queries and Minute-0 commands to extract the correct token.</span>
                </div>
              )}
            </form>
          </div>

          {/* Embedded In-Room Notes & Forensic Scratchpad Drawer */}
          <LabNotesScratchpad
            contextId={currentRoom.id}
            contextTitle={currentRoom.title}
            contextType="CTF Battle Room"
            mitreTechnique={currentRoom.mitreTactic}
          />
        </section>
      </div>

      {/* Trademark & Copyright Compliance Footer */}
      <CopyrightDisclaimer />
    </main>
  )
}

function InfoIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--cyan)' }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}
