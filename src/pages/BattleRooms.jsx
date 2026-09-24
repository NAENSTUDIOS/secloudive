import { useState, useEffect } from 'react'
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
  Briefcase
} from 'lucide-react'
import { battleRooms } from '../data/battleRooms'
import CopyrightDisclaimer from '../components/CopyrightDisclaimer'

export default function BattleRooms() {
  const { id } = useParams()
  const [selectedRoomId, setSelectedRoomId] = useState(id || battleRooms[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('offensive') // 'offensive' | 'defensive' | 'hardening'
  const [copiedIndex, setCopiedIndex] = useState(null)
  
  // CTF Flag state saved in localStorage
  const [userFlagInput, setUserFlagInput] = useState('')
  const [flagStatus, setFlagStatus] = useState(null) // null | 'success' | 'error'
  const [solvedRooms, setSolvedRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('secloudive_solved_rooms')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const currentRoom = battleRooms.find(r => r.id === selectedRoomId) || battleRooms[0]

  useEffect(() => {
    if (id && battleRooms.some(r => r.id === id)) {
      setSelectedRoomId(id)
    }
  }, [id])

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleFlagSubmit = (e) => {
    e.preventDefault()
    if (userFlagInput.trim() === currentRoom.flag) {
      setFlagStatus('success')
      const updated = { ...solvedRooms, [currentRoom.id]: true }
      setSolvedRooms(updated)
      try {
        localStorage.setItem('secloudive_solved_rooms', JSON.stringify(updated))
      } catch (err) {
        console.error('Storage error', err)
      }
    } else {
      setFlagStatus('error')
    }
  }

  const filteredRooms = battleRooms.filter(room => 
    room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isCurrentRoomSolved = !!solvedRooms[currentRoom.id]

  return (
    <main className="page-shell battle-rooms-page">
      {/* Page Header */}
      <div className="battle-header">
        <div>
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
            <strong className="text-emerald">{Object.keys(solvedRooms).length} / {battleRooms.length}</strong>
          </div>
          <div className="stat-item">
            <span>TOTAL XP</span>
            <strong className="text-purple">
              {Object.keys(solvedRooms).reduce((acc, roomId) => {
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
              const isSolved = !!solvedRooms[room.id]
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
              {isCurrentRoomSolved && (
                <div className="solved-pennant">
                  <CheckCircle2 size={16} /> CTF FLAG CAPTURED
                </div>
              )}
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

          {/* Perspective View Selector (Red Team vs Blue Team vs Hardening) */}
          <div className="perspective-tabs">
            <button 
              type="button" 
              className={`p-tab tab-red ${activeTab === 'offensive' ? 'active' : ''}`}
              onClick={() => setActiveTab('offensive')}
            >
              <Skull size={16} /> Red Team: Attack & Exploit PoC
            </button>
            <button 
              type="button" 
              className={`p-tab tab-blue ${activeTab === 'defensive' ? 'active' : ''}`}
              onClick={() => setActiveTab('defensive')}
            >
              <Terminal size={16} /> Blue Team: Detection & Forensics
            </button>
            <button 
              type="button" 
              className={`p-tab tab-green ${activeTab === 'hardening' ? 'active' : ''}`}
              onClick={() => setActiveTab('hardening')}
            >
              <ShieldCheck size={16} /> Remediation: Minute-0 & IaC Defense
            </button>
          </div>

          {/* Room Tasks / Progression */}
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
                      <button
                        type="button"
                        className="btn-copy-code"
                        onClick={() => handleCopyCode(task.codeSnippet, index)}
                      >
                        {copiedIndex === index ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                        <span>{copiedIndex === index ? 'Copied!' : 'Copy Code'}</span>
                      </button>
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
                  <span><strong>Correct Flag!</strong> You earned {currentRoom.points} XP. This attack vector and defense control are registered to your transcript.</span>
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
