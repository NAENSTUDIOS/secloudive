import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Bookmark,
  Sparkles,
  Clock,
  Search,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  HelpCircle,
  AlertTriangle,
  Key,
  Database,
  Network,
  Activity,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  Terminal,
  Zap,
  RotateCcw,
  Compass,
  FileCode2,
  Lock,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Brain,
  Lightbulb,
  Crosshair,
  TrendingUp,
  CheckCheck,
  X,
  FileText
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { userSyncManager } from '../services/userSyncManager'
import LabNotesScratchpad from '../components/LabNotesScratchpad'
import DefenderQuoteCallout from '../components/DefenderQuoteCallout'
import {
  learningAcademyPaths,
  learningPathsMap,
  getAllTopics,
  getTopicById,
  getNextTopic,
  getPreviousTopic,
  getPathStats,
  getOverallAcademyStats
} from '../data/learning/index.js'
import { getTopicKnowledgeSuite } from '../data/learning/topicChecks.js'
import { getModuleQuiz, evaluateQuizSubmission } from '../data/learning/moduleQuizzes.js'
import { generateAdaptiveQuizSession } from '../data/learning/adaptiveQuizEngine.js'
import { KNOWLEDGE_BADGES } from '../data/learning/badges.js'
import { getResourcesForDomain } from '../data/learningResources.js'
import NaenContentGuardian from '../components/NaenContentGuardian'
import LearningTrackModeSwitcher from '../components/LearningTrackModeSwitcher'
import StepWiseSkillMap from '../components/StepWiseSkillMap'
import InteractiveTopicEngine from '../components/InteractiveTopicEngine'
import '../styles/learningCenter.css'

// Path icon lookup
const PATH_ICONS = {
  Key: <Key size={18} />,
  Database: <Database size={18} />,
  Network: <Network size={18} />,
  Activity: <Activity size={18} />,
  Layers: <Layers size={18} />,
  ShieldAlert: <ShieldAlert size={18} />,
  ShieldCheck: <ShieldCheck size={18} />,
  Briefcase: <Briefcase size={18} />
}

export default function LearningCenter() {
  const { pathId, topicId } = useParams()
  const navigate = useNavigate()

  const {
    activeProfile,
    selectedCloudProvider = 'all',
    learningTopicsCompleted = [],
    learningBookmarkedTopics = [],
    learningQuizScores = {},
    topicCheckAnswers = {},
    quizAttemptsHistory = {},
    earnedBadges = [],
    toggleLearningTopic,
    toggleLearningBookmark,
    submitAdaptiveQuizSession,
    submitModuleQuiz,
    resetModuleQuiz,
    submitTopicCheck,
    resetLearningProgress
  } = useChallenges()

  // Selected Path & Topic State
  const activePathId = pathId && learningPathsMap[pathId] ? pathId : 'iam'
  const activePath = learningPathsMap[activePathId] || learningAcademyPaths[0]

  const activeTopic = useMemo(() => {
    if (topicId) {
      const found = getTopicById(activePathId, topicId)
      if (found) return found
    }
    return activePath.topics[0]
  }, [activePathId, topicId, activePath])

  // Multi-type knowledge check suite for active topic (3 Quick Checks + 1 Scenario + 1 Engineer Decision)
  const topicSuite = useMemo(() => {
    return getTopicKnowledgeSuite(activeTopic)
  }, [activeTopic])

  // Active check tab index: 0, 1, 2, 3, 4
  const [activeCheckTab, setActiveCheckTab] = useState(0)
  const [showReflection, setShowReflection] = useState(false)

  // Local filter & search state
  const [searchQuery, setSearchQuery] = useState('')

  // NAEN Studios Learning Center View: 'map' (Step-Wise RPG Progression Map) vs 'curriculum' (Deep-dive topics)
  const [activeCenterView, setActiveCenterView] = useState(() => {
    try {
      return localStorage.getItem('secloudive_learning_view') || 'map'
    } catch {
      return 'map'
    }
  })

  const setCenterView = (view) => {
    setActiveCenterView(view)
    try {
      localStorage.setItem('secloudive_learning_view', view)
    } catch {}
  }

  // Diagnostic Placement Test Baseline state (Strictly scoped to user ID)
  const getBaselineData = () => {
    try {
      const activeId = activeProfile?.id || userSyncManager.getActiveProfile()?.id
      const storageKey = activeId ? `secloudive_baseline_${activeId}` : 'secloudive_diagnostic_baseline'
      const raw = localStorage.getItem(storageKey) || localStorage.getItem('secloudive_diagnostic_baseline')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  const [diagnosticBaseline, setDiagnosticBaseline] = useState(getBaselineData)

  useEffect(() => {
    setDiagnosticBaseline(getBaselineData())
  }, [activeProfile?.id])

  useEffect(() => {
    const handleBaselineUpdated = (e) => {
      if (e.detail) {
        setDiagnosticBaseline(e.detail)
      } else {
        setDiagnosticBaseline(getBaselineData())
      }
    }
    const handleProfileChanged = () => {
      setDiagnosticBaseline(getBaselineData())
    }

    window.addEventListener('diagnostic-test-completed', handleBaselineUpdated)
    window.addEventListener('user-profile-changed', handleProfileChanged)
    return () => {
      window.removeEventListener('diagnostic-test-completed', handleBaselineUpdated)
      window.removeEventListener('user-profile-changed', handleProfileChanged)
    }
  }, [activeProfile?.id])
  const [levelFilter, setLevelFilter] = useState('all') // 'all' | 'beginner' | 'intermediate' | 'advanced' | 'bookmarked' | 'completed'

  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // -------------------------------------------------------------------------
  // ADAPTIVE MODULE QUIZ RUNNER STATE (10 Questions from 30 Bank)
  // -------------------------------------------------------------------------
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [currentQuizSession, setCurrentQuizSession] = useState(null)
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0)
  const [quizUserAnswers, setQuizUserAnswers] = useState({})
  const [activeQuizResult, setActiveQuizResult] = useState(null)

  // Fallback module quiz for active path
  const pathModuleQuiz = useMemo(() => {
    return getModuleQuiz(activePath.id)
  }, [activePath.id])

  // Sync route URL if parameters are missing or invalid
  useEffect(() => {
    if (!pathId || !topicId || !learningPathsMap[pathId]) {
      navigate(`/learning/${activePath.id}/${activeTopic.id}`, { replace: true })
    }
  }, [pathId, topicId, activePath.id, activeTopic.id, navigate])

  // Reset tab when topic changes
  useEffect(() => {
    setActiveCheckTab(0)
    setShowReflection(false)
  }, [activeTopic.id])

  // Academy Overall Stats
  const academyStats = useMemo(() => {
    return getOverallAcademyStats(learningTopicsCompleted)
  }, [learningTopicsCompleted])

  // Current Path Stats
  const currentPathStats = useMemo(() => {
    return getPathStats(activePath.id, learningTopicsCompleted)
  }, [activePath.id, learningTopicsCompleted])

  // CIS AWS Foundations Benchmark Domain Readiness
  const cisDomainStats = useMemo(() => {
    const iam = getPathStats('iam', learningTopicsCompleted)
    const storage = getPathStats('storage', learningTopicsCompleted)
    const monitoring = getPathStats('monitoring', learningTopicsCompleted)
    const network = getPathStats('network', learningTopicsCompleted)

    const domains = [
      {
        id: 'iam',
        title: 'Domain 1: Identity & Access Management',
        cisControl: 'CIS AWS 1.1 - 1.22',
        pathId: 'iam',
        stats: iam,
        color: '#38bdf8'
      },
      {
        id: 'storage',
        title: 'Domain 2: Storage & Data Encryption',
        cisControl: 'CIS AWS 2.1 - 2.4',
        pathId: 'storage',
        stats: storage,
        color: '#10b981'
      },
      {
        id: 'monitoring',
        title: 'Domain 3: Logging & Security Monitoring',
        cisControl: 'CIS AWS 3.1 - 3.14',
        pathId: 'monitoring',
        stats: monitoring,
        color: '#c084fc'
      },
      {
        id: 'network',
        title: 'Domain 4: Network & Perimeter Defense',
        cisControl: 'CIS AWS 4.1 - 4.16',
        pathId: 'network',
        stats: network,
        color: '#fb923c'
      }
    ]

    const totalCompleted = iam.completed + storage.completed + monitoring.completed + network.completed
    const totalPossible = iam.total + storage.total + monitoring.total + network.total
    const overallPercent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0

    let grade = 'D (Initial Setup)'
    let gradeColor = '#f43f5e'
    if (overallPercent >= 80) {
      grade = 'A+ (Audit Ready)'
      gradeColor = '#10b981'
    } else if (overallPercent >= 60) {
      grade = 'B (Hardened Baseline)'
      gradeColor = '#38bdf8'
    } else if (overallPercent >= 35) {
      grade = 'C (Active Remediation)'
      gradeColor = '#f59e0b'
    }

    return {
      domains,
      overallPercent,
      grade,
      gradeColor,
      totalCompleted,
      totalPossible
    }
  }, [learningTopicsCompleted])

  // Filtered Topics within the Active Path
  const filteredTopics = useMemo(() => {
    let list = activePath.topics

    if (levelFilter === 'beginner') {
      list = list.filter(t => t.level?.toLowerCase() === 'beginner')
    } else if (levelFilter === 'intermediate') {
      list = list.filter(t => t.level?.toLowerCase() === 'intermediate')
    } else if (levelFilter === 'advanced') {
      list = list.filter(t => t.level?.toLowerCase() === 'advanced')
    } else if (levelFilter === 'bookmarked') {
      list = list.filter(t => learningBookmarkedTopics.includes(t.id))
    } else if (levelFilter === 'completed') {
      list = list.filter(t => learningTopicsCompleted.includes(t.id))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.summary?.toLowerCase().includes(q) ||
        t.overview?.toLowerCase().includes(q) ||
        t.level?.toLowerCase().includes(q)
      )
    }

    return list
  }, [activePath.topics, levelFilter, searchQuery, learningBookmarkedTopics, learningTopicsCompleted])

  // Navigation: Next & Previous
  const nextItem = useMemo(() => getNextTopic(activePath.id, activeTopic.id), [activePath.id, activeTopic.id])
  const prevItem = useMemo(() => getPreviousTopic(activePath.id, activeTopic.id), [activePath.id, activeTopic.id])

  // Status flags for current topic
  const isCurrentTopicCompleted = learningTopicsCompleted.includes(activeTopic.id)
  const isCurrentTopicBookmarked = learningBookmarkedTopics.includes(activeTopic.id)

  // Handle Selection in Topic Multi-Type Checks
  const handleSelectTopicCheckOption = (checkKey, optionIdx, isCorrect) => {
    submitTopicCheck(activeTopic.id, checkKey, optionIdx)

    // Automatically mark topic complete when answering the concept or decision check correctly
    if (isCorrect && !learningTopicsCompleted.includes(activeTopic.id)) {
      toggleLearningTopic(activeTopic.id)
    }
  }

  // Handle Clipboard Copy for CLI / Code blocks
  const handleCopyCode = (text, index) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
      setCopiedSnippetIndex(index)
      setTimeout(() => setCopiedSnippetIndex(null), 2000)
    }
  }

  // Handle Path Tab Selection
  const handleSelectPath = (selectedPathId) => {
    const targetPath = learningPathsMap[selectedPathId]
    if (targetPath && targetPath.topics.length > 0) {
      navigate(`/learning/${targetPath.id}/${targetPath.topics[0].id}`)
    }
  }

  // Handle Topic Navigation
  const handleSelectTopic = (targetTopicId) => {
    navigate(`/learning/${activePath.id}/${targetTopicId}`)
  }

  // -------------------------------------------------------------------------
  // ADAPTIVE MODULE QUIZ ACTIONS (10 Questions sampled from 30 Question Bank)
  // -------------------------------------------------------------------------
  const handleStartModuleQuiz = () => {
    const attempts = quizAttemptsHistory[activePath.id] || []
    const lastAttempt = attempts[attempts.length - 1]
    const prevIds = lastAttempt?.questionResults ? lastAttempt.questionResults.map(q => q.id) : []
    const prevScore = learningQuizScores[activePath.id]

    const session = generateAdaptiveQuizSession({
      pathId: activePath.id,
      previousScore: prevScore,
      previousQuestionIds: prevIds,
      attemptNumber: attempts.length + 1
    })

    setCurrentQuizSession(session)
    setCurrentQuizQuestionIndex(0)
    setQuizUserAnswers({})
    setActiveQuizResult(null)
    setIsQuizModalOpen(true)
  }

  const handleSelectQuizQuestionOption = (questionId, optionIdx) => {
    setQuizUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }))
  }

  const handleNextQuizQuestion = () => {
    if (!currentQuizSession) return
    if (currentQuizQuestionIndex < currentQuizSession.questions.length - 1) {
      setCurrentQuizQuestionIndex(prev => prev + 1)
    } else {
      // Evaluate adaptive quiz session with question randomizations preserved
      const evaluated = submitAdaptiveQuizSession(activePath.id, currentQuizSession, quizUserAnswers)
      setActiveQuizResult(evaluated)
    }
  }

  const handleRetakeQuiz = () => {
    const attempts = quizAttemptsHistory[activePath.id] || []
    const lastAttempt = attempts[attempts.length - 1]
    const prevIds = lastAttempt?.questionResults ? lastAttempt.questionResults.map(q => q.id) : []
    const prevScore = activeQuizResult?.score ?? learningQuizScores[activePath.id]

    // Generate fresh random 10-question set and fresh option order
    const session = generateAdaptiveQuizSession({
      pathId: activePath.id,
      previousScore: prevScore,
      previousQuestionIds: prevIds,
      attemptNumber: attempts.length + 1
    })

    setCurrentQuizSession(session)
    setCurrentQuizQuestionIndex(0)
    setQuizUserAnswers({})
    setActiveQuizResult(null)
  }

  const handleCloseQuizModal = () => {
    setIsQuizModalOpen(false)
  }

  // Get active check object from the 5 questions in topicSuite
  const currentCheckData = useMemo(() => {
    if (!topicSuite || !Array.isArray(topicSuite.questions)) return null
    return topicSuite.questions[activeCheckTab] || topicSuite.questions[0]
  }, [topicSuite, activeCheckTab])

  const savedAnswerForCurrentCheck = topicCheckAnswers[activeTopic.id]?.[activeCheckTab]

  return (
    <div className="learning-center-shell">
      {/* Quick Nav Bar */}
      <nav className="quick-nav-bar" aria-label="Quick navigation" style={{ maxWidth: '1240px', margin: '0 auto', borderRadius: '8px' }}>
        <Link to="/dashboard" className="quick-nav-link">📊 Dashboard</Link>
        <Link to="/internship-simulator" className="quick-nav-link">🎓 Internship Simulator</Link>
        <Link to="/investigations" className="quick-nav-link">🔍 Investigations</Link>
        <Link to="/architecture-reviews" className="quick-nav-link">🏛️ Architecture Reviews</Link>
        <Link to="/report" className="quick-nav-link">📋 Security Report</Link>
        <Link to="/career-rampup" className="quick-nav-link">🚀 Career Ramp-Up</Link>
      </nav>

      {/* ── DEFENDER OBSERVATION & KNOWLEDGE WISDOM CALLOUT ── */}
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <DefenderQuoteCallout category="general" autoCycle={true} cycleIntervalMs={16000} />
      </div>

      {/* --------------------------------------------------------------------
          1. ACADEMY HERO & STATS BANNER
          -------------------------------------------------------------------- */}
      <section className="academy-hero">
        <div className="academy-hero-glow" />
        <div className="academy-hero-top">
          <div className="academy-hero-text">
            <div className="academy-badge-strip">
              <span className="academy-pill pill-cyan">
                <Sparkles size={13} />
                SeCloudive Academy
              </span>
              <span className="academy-pill pill-emerald">
                <ShieldCheck size={13} />
                Knowledge Check & Certification Preparation
              </span>
            </div>
            <h1 className="academy-title">
              Cloud Security <span>Learning Center</span>
            </h1>
            <p className="academy-subtitle">
              Verify your security thinking, IAM evaluation logic, and forensic decision-making through tactical knowledge checks and module assessments before entering live investigation simulators.
            </p>

            {/* Badges Showcase Bar */}
            <div className="badges-showcase-strip">
              <span style={{ fontSize: '11px', color: '#64748b', font: "600 11px 'DM Mono', monospace", textTransform: 'uppercase' }}>
                Knowledge Badges ({earnedBadges.length} / {KNOWLEDGE_BADGES.length}):
              </span>
              {KNOWLEDGE_BADGES.map(badge => {
                const isEarned = earnedBadges.includes(badge.id)
                return (
                  <span
                    key={badge.id}
                    className={`badge-item-chip ${isEarned ? 'earned' : 'locked'}`}
                    title={`${badge.title} (${badge.rarity}): ${badge.requirement}`}
                  >
                    <span>{badge.badgeIcon}</span>
                    <span>{badge.title}</span>
                  </span>
                )
              })}
            </div>
          </div>

          {/* Overall Progress Widget */}
          <div className="academy-stats-box">
            <div
              className="progress-circle-wrap"
              style={{ '--percent': `${academyStats.overallPercent}%` }}
            >
              <div className="progress-circle-inner">
                {academyStats.overallPercent}%
              </div>
            </div>
            <div className="stats-copy">
              <span className="stats-label">Curriculum Mastery</span>
              <span className="stats-number">
                {academyStats.completedTopics} <small style={{ fontSize: '13px', color: '#64748b' }}>/ {academyStats.totalTopics} Topics</small>
              </span>
              <span className="stats-sub">
                {earnedBadges.length} Badges Earned • ~{academyStats.totalEstimatedHours}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          NAEN STUDIOS LEARNING TRACK MODE & PERSONA SWITCHER
          -------------------------------------------------------------------- */}
      <LearningTrackModeSwitcher style={{ margin: '0 0 20px 0' }} />

      {/* --------------------------------------------------------------------
          VIEW SWITCHER TABS: STEP-WISE MAP vs. PATHS CURRICULUM
          -------------------------------------------------------------------- */}
      <div className="naen-learning-view-tabs-bar" role="tablist" style={{ margin: '0 0 24px 0' }}>
        <button
          type="button"
          className={`naen-view-tab-btn ${activeCenterView === 'map' ? 'active' : ''}`}
          onClick={() => setCenterView('map')}
          role="tab"
          aria-selected={activeCenterView === 'map'}
        >
          <Sparkles size={16} />
          <span>🎮 Step-Wise Progression Map (TryHackMe / HTB Style)</span>
          <span className="naen-tab-tag">Step-by-Step Unlocked</span>
        </button>

        <button
          type="button"
          className={`naen-view-tab-btn ${activeCenterView === 'curriculum' ? 'active' : ''}`}
          onClick={() => setCenterView('curriculum')}
          role="tab"
          aria-selected={activeCenterView === 'curriculum'}
        >
          <BookOpen size={16} />
          <span>📚 Deep-Dive Topics & CIS Curriculum ({academyStats.totalTopics} Topics)</span>
        </button>
      </div>

      {activeCenterView === 'map' && (
        <div className="step-wise-map-view-wrapper animate-reveal" style={{ margin: '0 0 32px 0' }}>
          <StepWiseSkillMap />
        </div>
      )}

      {/* --------------------------------------------------------------------
          2-MINUTE DIAGNOSTIC PLACEMENT TEST BANNER
          -------------------------------------------------------------------- */}
      <div 
        className="diagnostic-placement-banner" 
        style={{
          margin: '0 0 20px 0',
          padding: '14px 20px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 132, 199, 0.12) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.28)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', flexShrink: 0 }}>
            <Compass size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: diagnosticBaseline ? '#10b981' : '#f59e0b' }}>
                {diagnosticBaseline ? 'DIAGNOSTIC PLACEMENT BASELINE' : 'SKILL PLACEMENT TEST'}
              </span>
              {diagnosticBaseline && (
                <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '1px 7px', borderRadius: '999px', fontWeight: 700 }}>
                  {diagnosticBaseline.overallPercentage}% ({diagnosticBaseline.skillLevel})
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginTop: '1px' }}>
              {diagnosticBaseline
                ? `Recommended Starting Path: ${diagnosticBaseline.recommendedPathTitle}`
                : 'Not sure which learning path matches your background? Take the 2-Minute Diagnostic.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {diagnosticBaseline ? (
            <>
              {activePathId !== diagnosticBaseline.recommendedPathId && (
                <button
                  type="button"
                  onClick={() => handleSelectPath(diagnosticBaseline.recommendedPathId)}
                  className="button button-primary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                >
                  Switch to Recommended Path
                </button>
              )}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-test'))}
                className="button button-ghost btn-sm"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                Retake Diagnostic
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-test'))}
              className="button button-primary btn-sm"
              style={{ fontSize: '0.78rem', padding: '7px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Zap size={13} />
              <span>Take 2-Minute Diagnostic</span>
            </button>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------------------
          2. FILTER & SEARCH CONTROLS BAR
          -------------------------------------------------------------------- */}
      <div className="academy-controls-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon-left" />
          <input
            type="text"
            className="academy-search-input"
            placeholder="Search concepts, policies, CLI commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills-row">
          <button
            type="button"
            className={`filter-btn ${levelFilter === 'all' ? 'active' : ''}`}
            onClick={() => setLevelFilter('all')}
          >
            All Topics
          </button>
          <button
            type="button"
            className={`filter-btn ${levelFilter === 'beginner' ? 'active' : ''}`}
            onClick={() => setLevelFilter('beginner')}
          >
            Beginner
          </button>
          <button
            type="button"
            className={`filter-btn ${levelFilter === 'intermediate' ? 'active' : ''}`}
            onClick={() => setLevelFilter('intermediate')}
          >
            Intermediate
          </button>
          <button
            type="button"
            className={`filter-btn ${levelFilter === 'advanced' ? 'active' : ''}`}
            onClick={() => setLevelFilter('advanced')}
          >
            Advanced
          </button>
          <button
            type="button"
            className={`filter-btn ${levelFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setLevelFilter('completed')}
          >
            Completed ({learningTopicsCompleted.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${levelFilter === 'bookmarked' ? 'active' : ''}`}
            onClick={() => setLevelFilter('bookmarked')}
          >
            Bookmarked ({learningBookmarkedTopics.length})
          </button>

          {learningTopicsCompleted.length > 0 && (
            <button
              type="button"
              className="filter-btn"
              style={{ color: '#fb7185', marginLeft: 'auto' }}
              onClick={() => setShowResetConfirm(true)}
              title="Reset Learning Progress"
            >
              <RotateCcw size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Resetting Progress */}
      {showResetConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #fb7185',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <h3 style={{ color: '#fb7185', margin: '0 0 10px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} /> Reset Learning Progress?
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: '0 0 20px' }}>
              This will clear all {learningTopicsCompleted.length} completed topic marks, quiz scores, and bookmarked items from your local academy record. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="filter-btn"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="filter-btn"
                style={{ background: '#e11d48', color: '#fff', borderColor: '#e11d48' }}
                onClick={() => {
                  resetLearningProgress()
                  setShowResetConfirm(false)
                }}
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------
          3. 8 PATHS HORIZONTAL TABS SWITCHER
          -------------------------------------------------------------------- */}
      <div className="paths-tab-strip" role="tablist">
        {learningAcademyPaths.map((pathItem) => {
          const stats = getPathStats(pathItem.id, learningTopicsCompleted)
          const isActive = pathItem.id === activePath.id
          const quizScore = learningQuizScores[pathItem.id]

          return (
            <button
              key={pathItem.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`path-tab-card ${isActive ? 'active' : ''}`}
              style={{ '--accent-color': pathItem.color }}
              onClick={() => handleSelectPath(pathItem.id)}
            >
              <div className="path-tab-top">
                <div className="path-icon-badge">
                  {PATH_ICONS[pathItem.icon] || <ShieldCheck size={16} />}
                </div>
                <span className="path-count-badge">
                  {stats.completed}/{stats.total}
                </span>
              </div>
              <h4 className="path-tab-title">{pathItem.shortTitle || pathItem.title}</h4>
              {quizScore && (
                <div style={{ fontSize: '10px', color: quizScore.passed ? '#4ade80' : '#fbbf24', font: "600 10px 'DM Mono', monospace" }}>
                  Quiz: {quizScore.percentage}% {quizScore.passed ? '✓' : ''}
                </div>
              )}
              <div className="path-mini-progress">
                <div
                  className="path-mini-progress-fill"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* --------------------------------------------------------------------
          CIS AWS FOUNDATIONS BENCHMARK v3.0 READINESS HUD
          -------------------------------------------------------------------- */}
      <div
        className="cis-readiness-hud"
        style={{
          margin: '0 0 24px 0',
          padding: '16px 20px',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} style={{ color: '#38bdf8' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                CIS AWS FOUNDATIONS BENCHMARK v3.0 AUDIT READINESS
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
              Real-time compliance alignment across the 4 foundational cloud defense domains.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>OVERALL COMPLIANCE GRADE</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: cisDomainStats.gradeColor }}>
                {cisDomainStats.grade}
              </div>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.9)',
              border: `2px solid ${cisDomainStats.gradeColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: cisDomainStats.gradeColor
            }}>
              {cisDomainStats.overallPercent}%
            </div>
          </div>
        </div>

        {/* 4 CIS Domain Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {cisDomainStats.domains.map(dom => {
            const isSelected = activePathId === dom.pathId
            return (
              <div
                key={dom.id}
                onClick={() => handleSelectPath(dom.pathId)}
                style={{
                  background: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 6, 23, 0.6)',
                  border: isSelected ? `1px solid ${dom.color}` : '1px solid rgba(148, 163, 184, 0.15)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.7rem', color: dom.color, fontWeight: 700 }}>{dom.cisControl}</span>
                  <span style={{ fontSize: '0.75rem', color: '#f8fafc', fontWeight: 800 }}>{dom.stats.percent}%</span>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {dom.title}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
                  <span>{dom.stats.completed}/{dom.stats.total} Controls Verified</span>
                  <span style={{ color: dom.color, textDecoration: 'underline' }}>{isSelected ? 'Active Domain' : 'Switch Domain'}</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${dom.stats.percent}%`, height: '100%', background: dom.color, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* --------------------------------------------------------------------
          4. MAIN ACADEMY WORKSPACE (SPLIT LAYOUT)
          -------------------------------------------------------------------- */}
      <div className="academy-workspace-layout">
        {/* ------------------------------------------------------------------
            LEFT SIDEBAR: TOPIC DIRECTORY & MODULE QUIZ TRIGGER
            ------------------------------------------------------------------ */}
        <aside className="topics-sidebar-panel">
          <div className="sidebar-header" style={{ '--accent-color': activePath.color }}>
            <span className="sidebar-path-tag">{activePath.badge || 'Domain Track'}</span>
            <h3 className="sidebar-path-title">{activePath.title}</h3>
            <div className="sidebar-path-meta">
              <span>{currentPathStats.completed} of {currentPathStats.total} completed ({currentPathStats.percent}%)</span>
              <span>{activePath.estimatedTime}</span>
            </div>
          </div>

          {/* Module Quiz Trigger Card (For 6 core security modules) */}
          {pathModuleQuiz && (
            <div className="module-quiz-trigger-card">
              <div className="quiz-trigger-top">
                <span className="quiz-trigger-title">
                  <Award size={14} style={{ color: '#38bdf8' }} />
                  Module Assessment
                </span>
                {learningQuizScores[activePath.id] ? (
                  <span className="quiz-score-badge" style={{ color: learningQuizScores[activePath.id].passed ? '#4ade80' : '#fbbf24' }}>
                    Score: {learningQuizScores[activePath.id].percentage}%
                  </span>
                ) : (
                  <span className="quiz-score-badge">12 Questions</span>
                )}
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
                Validate end-to-end {activePath.title} mastery and unlock the <strong>{pathModuleQuiz.badgeAwardId}</strong> badge.
              </p>
              <button
                type="button"
                className="btn-launch-quiz"
                onClick={handleStartModuleQuiz}
              >
                <Zap size={13} />
                <span>{learningQuizScores[activePath.id] ? 'Retake Module Quiz' : 'Launch Module Quiz'}</span>
              </button>
            </div>
          )}

          <nav className="topics-nav-list" aria-label="Topics Navigation" style={{ marginTop: '16px' }}>
            {filteredTopics.length === 0 ? (
              <div style={{ padding: '20px 10px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                No topics match your filter criteria.
              </div>
            ) : (
              filteredTopics.map((topicItem) => {
                const isCompleted = learningTopicsCompleted.includes(topicItem.id)
                const isBookmarked = learningBookmarkedTopics.includes(topicItem.id)
                const isCurrent = topicItem.id === activeTopic.id

                return (
                  <button
                    key={topicItem.id}
                    type="button"
                    className={`topic-nav-btn ${isCurrent ? 'active' : ''}`}
                    onClick={() => handleSelectTopic(topicItem.id)}
                  >
                    <span className="topic-status-icon">
                      {isCompleted ? (
                        <CheckCircle2 size={16} style={{ color: '#4ade80' }} />
                      ) : (
                        <Circle size={16} style={{ color: '#475569' }} />
                      )}
                    </span>
                    <span className="topic-nav-title">{topicItem.title}</span>
                    {isBookmarked && (
                      <Bookmark size={12} style={{ color: '#fbbf24', flexShrink: 0 }} />
                    )}
                    <span className={`topic-level-dot level-${topicItem.level?.toLowerCase() || 'beginner'}`}>
                      {topicItem.level?.[0] || 'B'}
                    </span>
                  </button>
                )
              })
            )}
          </nav>

          {/* Quick link to Hands-On Lab for this path */}
          {activePath.relatedLabs && activePath.relatedLabs.length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Corresponding Practice Lab
              </div>
              <Link
                to={activePath.relatedLabs[0].path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.15)',
                  fontSize: '12px',
                  color: '#38bdf8',
                  textDecoration: 'none'
                }}
              >
                <span>{activePath.relatedLabs[0].title}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </aside>

        {/* ------------------------------------------------------------------
            RIGHT WORKSPACE: TOPIC CONTENT DETAIL
            ------------------------------------------------------------------ */}
        <main className="topic-detail-content">
          <NaenContentGuardian
            contextTitle={`NAEN Studios • ${activePath.title} • ${activeTopic.title}`}
            contextId={`learning-topic-${activeTopic.id}`}
            author="NAEN Studios Cloud Defense Research"
          >
          {/* Header Card */}
          <div className="topic-header-card">
            <div className="topic-breadcrumb-bar">
              <div className="topic-breadcrumb">
                <Link to="/#structured-path" style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: '11px', fontFamily: 'monospace' }}>
                  🎯 Structured Path
                </Link>
                <ChevronRight size={12} />
                <Link to="/learning">Academy</Link>
                <ChevronRight size={12} />
                <span style={{ color: activePath.color }}>{activePath.title}</span>
                <ChevronRight size={12} />
                <span style={{ color: '#f8fafc' }}>{activeTopic.title}</span>
              </div>
              <div className="topic-meta-chips">
                <span className="meta-chip">
                  <Clock size={12} /> {activeTopic.estimatedTime || '15 mins'}
                </span>
                <span className={`topic-level-dot level-${activeTopic.level?.toLowerCase() || 'beginner'}`}>
                  {activeTopic.level || 'Intermediate'}
                </span>
              </div>
            </div>

            <h2 className="topic-header-title">{activeTopic.title}</h2>
            <p className="topic-summary-lead">{activeTopic.summary}</p>

            <div className="topic-actions-strip">
              <div className="topic-interactive-btns">
                <button
                  type="button"
                  className={`btn-complete-toggle ${isCurrentTopicCompleted ? 'completed' : 'incomplete'}`}
                  onClick={() => toggleLearningTopic(activeTopic.id)}
                >
                  {isCurrentTopicCompleted ? (
                    <>
                      <CheckCircle2 size={16} /> Marked Complete
                    </>
                  ) : (
                    <>
                      <Circle size={16} /> Mark as Complete
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={`btn-bookmark-toggle ${isCurrentTopicBookmarked ? 'bookmarked' : ''}`}
                  onClick={() => toggleLearningBookmark(activeTopic.id)}
                  title={isCurrentTopicBookmarked ? 'Remove Bookmark' : 'Bookmark Topic'}
                >
                  <Bookmark size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('secloudive:toggle-notes', {
                      detail: { contextId: `learning-topic-${activeTopic.id}` }
                    }))
                  }}
                  className="button button-ghost"
                  style={{
                    fontSize: '0.78rem',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#38bdf8',
                    borderColor: 'rgba(56, 189, 248, 0.35)',
                    borderRadius: '8px'
                  }}
                  title="Open isolated scratchpad for this topic"
                >
                  <FileText size={14} />
                  <span>Topic Notes</span>
                </button>
              </div>

              {/* Prev / Next Header shortcuts */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {prevItem && (
                  <button
                    type="button"
                    className="filter-btn"
                    onClick={() => navigate(`/learning/${prevItem.path.id}/${prevItem.topic.id}`)}
                    title={`Previous: ${prevItem.topic.title}`}
                  >
                    <ArrowLeft size={13} style={{ display: 'inline', marginRight: '4px' }} /> Prev
                  </button>
                )}
                {nextItem && (
                  <button
                    type="button"
                    className="filter-btn"
                    onClick={() => navigate(`/learning/${nextItem.path.id}/${nextItem.topic.id}`)}
                    title={`Next: ${nextItem.topic.title}`}
                  >
                    Next <ArrowRight size={13} style={{ display: 'inline', marginLeft: '4px' }} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── INTERACTIVE TOPIC ENGINE (Theory / How It Works / Live CLI / Recap) ── */}
          <div className="learning-card-section" style={{ padding: '20px' }}>
            <InteractiveTopicEngine
              topic={activeTopic}
              pathResources={getResourcesForDomain ? getResourcesForDomain(activePath.id, selectedCloudProvider) : []}
            />
          </div>

          {/* 4. What a Cloud Security Engineer Would Check */}
          {activeTopic.whatEngineerChecks && activeTopic.whatEngineerChecks.length > 0 && (
            <div className="learning-card-section">
              <div className="learning-card-header">
                <div className="learning-card-icon">
                  <Terminal size={16} />
                </div>
                <h3 className="learning-card-title">What a Cloud Security Engineer Would Check</h3>
              </div>

              <div className="inspection-checklist">
                {activeTopic.whatEngineerChecks.map((item, idx) => (
                  <div className="inspection-item" key={idx}>
                    <div className="inspection-icon">
                      <Terminal size={14} />
                    </div>
                    <div className="inspection-text" style={{ flex: 1 }}>
                      <strong>{item.title || `Check #${idx + 1}`}:</strong> {item.detail || item}
                      {item.command && (
                        <div style={{ marginTop: '8px', position: 'relative' }}>
                          <pre style={{
                            margin: 0,
                            padding: '8px 12px',
                            background: '#091322',
                            borderRadius: '6px',
                            border: '1px solid rgba(148, 163, 184, 0.1)',
                            font: "11px/1.5 'DM Mono', monospace",
                            color: '#38bdf8',
                            overflowX: 'auto'
                          }}>
                            {item.command}
                          </pre>
                          <button
                            type="button"
                            className="filter-btn"
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '8px',
                              padding: '2px 6px',
                              fontSize: '10px'
                            }}
                            onClick={() => handleCopyCode(item.command, idx)}
                          >
                            {copiedSnippetIndex === idx ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Common Beginner Mistakes */}
          {activeTopic.commonMistakes && activeTopic.commonMistakes.length > 0 && (
            <div className="learning-card-section">
              <div className="learning-card-header">
                <div className="learning-card-icon" style={{ color: '#fb7185' }}>
                  <AlertTriangle size={16} />
                </div>
                <h3 className="learning-card-title">Common Beginner Mistakes & Pitfalls</h3>
              </div>

              <div className="inspection-checklist">
                {activeTopic.commonMistakes.map((mistake, idx) => (
                  <div className="inspection-item" key={idx} style={{ borderColor: 'rgba(251, 113, 133, 0.2)' }}>
                    <div className="inspection-icon" style={{ color: '#fb7185' }}>
                      <AlertTriangle size={14} />
                    </div>
                    <div className="inspection-text">
                      {typeof mistake === 'string' ? (
                        <span>{mistake}</span>
                      ) : (
                        <>
                          <div style={{ color: '#f8fafc', fontWeight: 600, marginBottom: '4px' }}>
                            {mistake.title || mistake.mistake}
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.6' }}>
                            <strong style={{ color: '#4ade80' }}>Correct Approach:</strong> {mistake.solution || mistake.whyBad}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Technical Interview Preparation */}
          {activeTopic.interviewQuestions && activeTopic.interviewQuestions.length > 0 && (
            <div className="learning-card-section">
              <div className="learning-card-header">
                <div className="learning-card-icon" style={{ color: '#a78bfa' }}>
                  <HelpCircle size={16} />
                </div>
                <h3 className="learning-card-title">Technical Interview Questions & Model Answers</h3>
              </div>

              <div className="interview-qa-list">
                {activeTopic.interviewQuestions.map((qa, idx) => (
                  <div className="interview-card" key={idx}>
                    <h4 className="interview-question-title">
                      <HelpCircle size={15} />
                      {qa.question}
                    </h4>
                    {qa.interviewerRationale && (
                      <div className="interview-rationale-box">
                        <strong>What the Interviewer is Evaluating:</strong> {qa.interviewerRationale}
                      </div>
                    )}
                    <div className="interview-answer-box">
                      <strong>Model Answer: </strong>
                      <span>{qa.answer}</span>
                    </div>
                    {qa.pitfalls && (
                      <div style={{ marginTop: '10px', fontSize: '12px', color: '#fb7185' }}>
                        <strong>Avoid this trap: </strong>{qa.pitfalls}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Key Takeaways */}
          {activeTopic.keyTakeaways && activeTopic.keyTakeaways.length > 0 && (
            <div className="learning-card-section" style={{ background: 'rgba(30, 41, 59, 0.4)' }}>
              <div className="learning-card-header">
                <div className="learning-card-icon" style={{ color: '#38bdf8' }}>
                  <Award size={16} />
                </div>
                <h3 className="learning-card-title">Key Engineering Takeaways</h3>
              </div>
              <ul className="bullet-checklist">
                {activeTopic.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={14} style={{ color: '#38bdf8' }} />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ----------------------------------------------------------------
              8. MULTI-TYPE KNOWLEDGE CHECK & DECISION SUITE
              ---------------------------------------------------------------- */}
          {topicSuite && currentCheckData && (
            <div className="topic-checks-suite-card">
              <div className="learning-card-header">
                <div className="learning-card-icon" style={{ color: '#38bdf8' }}>
                  <Zap size={16} />
                </div>
                <div>
                  <h3 className="learning-card-title">Knowledge Validation Suite</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                    Verify understanding across concepts, security principles, attack scenarios, and tactical decisions.
                  </p>
                </div>
              </div>

              {/* 5 Check Tabs: 3 Quick Checks + 1 Scenario + 1 Engineer Decision */}
              <div className="check-type-tabs" role="tablist">
                {topicSuite.questions.map((q, idx) => {
                  const isDone = topicCheckAnswers[activeTopic.id]?.[idx] !== undefined
                  let icon = '💡'
                  let tabLabel = `Quick Check ${idx + 1}`
                  if (idx === 0) { icon = '💡'; tabLabel = '1. Concept Check' }
                  else if (idx === 1) { icon = '⚙️'; tabLabel = '2. Mechanics Check' }
                  else if (idx === 2) { icon = '⚠️'; tabLabel = '3. Anti-Pattern Check' }
                  else if (idx === 3) { icon = '🎯'; tabLabel = '4. Scenario Check' }
                  else if (idx === 4) { icon = '⚡'; tabLabel = '5. Engineer Decision' }

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`check-tab-btn ${activeCheckTab === idx ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                      onClick={() => setActiveCheckTab(idx)}
                    >
                      <span>{icon}</span>
                      <span>{tabLabel}</span>
                      {isDone && <Check size={12} />}
                    </button>
                  )
                })}
              </div>

              {/* Question Text & Meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 8px' }}>
                <span style={{ font: "700 11px 'DM Mono', monospace", color: '#38bdf8', textTransform: 'uppercase' }}>
                  {currentCheckData.typeTitle || `Question ${activeCheckTab + 1} of 5`}
                </span>
                <span className={`topic-level-dot level-${(currentCheckData.difficulty || 'Intermediate').toLowerCase().replace(' ', '-')}`}>
                  {currentCheckData.difficulty || 'Intermediate'}
                </span>
              </div>
              <p className="quiz-question-text" style={{ margin: '0 0 16px' }}>{currentCheckData.question}</p>

              {/* Options */}
              <div className="quiz-options-list">
                {currentCheckData.options.map((option, optIdx) => {
                  const letters = ['A', 'B', 'C', 'D', 'E']
                  const isSubmitted = savedAnswerForCurrentCheck !== undefined
                  const isSelected = savedAnswerForCurrentCheck === optIdx
                  const isCorrect = typeof option === 'object' && option !== null && 'isCorrect' in option
                    ? Boolean(option.isCorrect)
                    : optIdx === currentCheckData.correctIndex

                  let btnClass = 'quiz-option-btn'
                  if (isSubmitted) {
                    if (isSelected && isCorrect) btnClass += ' selected-correct'
                    else if (isSelected && !isCorrect) btnClass += ' selected-wrong'
                    else if (isCorrect) btnClass += ' selected-correct'
                  }

                  const optionText = typeof option === 'string'
                    ? option
                    : (option?.text || option?.title || option?.id || '')

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      className={btnClass}
                      onClick={() => handleSelectTopicCheckOption(activeCheckTab, optIdx, isCorrect)}
                      disabled={isSubmitted}
                    >
                      <span className="option-letter-badge">{letters[optIdx]}</span>
                      <span>{optionText}</span>
                    </button>
                  )
                })}
              </div>

              {/* Feedback Banner */}
              {savedAnswerForCurrentCheck !== undefined && (
                <div className={`quiz-feedback-banner ${savedAnswerForCurrentCheck === currentCheckData.correctIndex ? 'correct' : 'wrong'}`}>
                  {savedAnswerForCurrentCheck === currentCheckData.correctIndex ? (
                    <div>
                      <strong>✓ Correct Validation!</strong> {currentCheckData.explanation}
                    </div>
                  ) : (
                    <div>
                      <strong>⚠️ Security Review Needed:</strong> {currentCheckData.explanation}
                    </div>
                  )}

                  {/* Engineer Decision Trio Meta */}
                  {currentCheckData.engineerReasoning && (
                    <div className="decision-meta-trio" style={{ marginTop: '14px' }}>
                      <div className="trio-box trio-reasoning">
                        <span className="trio-label">🛡️ Senior Engineer Reasoning</span>
                        <p className="trio-content">{currentCheckData.engineerReasoning}</p>
                      </div>
                      {currentCheckData.businessImpact && (
                        <div className="trio-box trio-impact">
                          <span className="trio-label">⚠️ Business Impact</span>
                          <p className="trio-content">{currentCheckData.businessImpact}</p>
                        </div>
                      )}
                      {currentCheckData.awsBestPractice && (
                        <div className="trio-box trio-practice">
                          <span className="trio-label">📋 AWS Best Practice</span>
                          <p className="trio-content">{currentCheckData.awsBestPractice}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 5. Reflection Question Card */}
              {topicSuite.reflectionPrompt && (
                <div className="reflection-card">
                  <div
                    className="reflection-header"
                    onClick={() => setShowReflection(prev => !prev)}
                  >
                    <h5 className="reflection-prompt-title">
                      <span>💭</span>
                      <span>Engineer Reflection Question</span>
                    </h5>
                    <button type="button" className="filter-btn" style={{ padding: '3px 8px', fontSize: '11px' }}>
                      {showReflection ? (
                        <>Hide Guidance <ChevronUp size={12} style={{ display: 'inline', marginLeft: '4px' }} /></>
                      ) : (
                        <>Reveal Guidance <ChevronDown size={12} style={{ display: 'inline', marginLeft: '4px' }} /></>
                      )}
                    </button>
                  </div>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: '8px 0 0' }}>
                    {topicSuite.reflectionPrompt.prompt}
                  </p>

                  {showReflection && (
                    <div className="reflection-guidance-box">
                      <strong>Senior SecOps Perspective:</strong> {topicSuite.reflectionPrompt.guidance}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 9. Resources — rendered inside InteractiveTopicEngine Recap & Refs tab above */}

          {/* 10. Bridge to SeCloudive Hands-On Practice */}
          <div className="bridge-lab-banner">
            <div className="bridge-info">
              <span className="bridge-label">
                <Sparkles size={13} />
                Bridge to Live SOC Field Practice
              </span>
              <h4 className="bridge-title">
                {activeTopic.handsOnBridge?.title || `Apply ${activeTopic.title} in SeCloudive Labs`}
              </h4>
              <p className="bridge-desc">
                {activeTopic.handsOnBridge?.description ||
                  'Transition from theoretical understanding into realistic investigations, CLI execution runbooks, and threat modeling.'}
              </p>
            </div>
            <Link
              to={activeTopic.handsOnBridge?.path || '/investigations'}
              className="btn-launch-bridge"
            >
              <span>{activeTopic.handsOnBridge?.cta || 'Launch Scenario Lab'}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* 11. Bottom Navigation Controls (Previous / Next Topic) */}
          <div className="topic-bottom-nav">
            {prevItem ? (
              <button
                type="button"
                className="btn-nav-step"
                onClick={() => navigate(`/learning/${prevItem.path.id}/${prevItem.topic.id}`)}
              >
                <ArrowLeft size={16} />
                <span>
                  <small style={{ display: 'block', fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Previous Topic</small>
                  {prevItem.topic.title}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextItem ? (
              <button
                type="button"
                className="btn-nav-step"
                style={{ marginLeft: 'auto', background: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)' }}
                onClick={() => navigate(`/learning/${nextItem.path.id}/${nextItem.topic.id}`)}
              >
                <span style={{ textAlign: 'right' }}>
                  <small style={{ display: 'block', fontSize: '10px', color: '#38bdf8', textTransform: 'uppercase' }}>Next Topic</small>
                  {nextItem.topic.title}
                </span>
                <ArrowRight size={16} style={{ color: '#38bdf8' }} />
              </button>
            ) : (
              <Link
                to="/investigations"
                className="btn-nav-step"
                style={{ marginLeft: 'auto', background: 'rgba(74, 222, 128, 0.15)', borderColor: '#4ade80' }}
              >
                <span>
                  <small style={{ display: 'block', fontSize: '10px', color: '#4ade80', textTransform: 'uppercase' }}>Academy Complete</small>
                  Enter Investigation Simulator
                </span>
                <ArrowRight size={16} style={{ color: '#4ade80' }} />
              </Link>
            )}
          </div>
          </NaenContentGuardian>
        </main>
      </div>

      {/* --------------------------------------------------------------------
          5. MODULE QUIZ RUNNER MODAL & RESULTS EXPERIENCE
          -------------------------------------------------------------------- */}
      {isQuizModalOpen && (currentQuizSession || pathModuleQuiz) && (
        <div className="quiz-runner-modal">
          <div className="quiz-runner-box">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={handleCloseQuizModal}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            {(() => {
              const activeSession = currentQuizSession || {
                domainName: pathModuleQuiz.title,
                tierLabel: 'Standard Assessment',
                questions: pathModuleQuiz.questions
              }
              const currentQ = activeSession.questions[currentQuizQuestionIndex] || activeSession.questions[0]
              const totalQ = activeSession.questions.length

              if (!activeQuizResult) {
                return (
                  /* ACTIVE QUIZ QUESTION VIEW */
                  <div>
                    <div className="quiz-runner-header">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ font: "700 11px 'DM Mono', monospace", color: '#38bdf8', textTransform: 'uppercase' }}>
                            {activeSession.domainName}
                          </span>
                          <span className="academy-pill pill-emerald" style={{ fontSize: '10px', padding: '2px 8px' }}>
                            {activeSession.tierLabel}
                          </span>
                        </div>
                        <h3 style={{ margin: '4px 0 0', fontSize: '18px', color: '#f8fafc' }}>
                          Question {currentQuizQuestionIndex + 1} of {totalQ}
                        </h3>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="academy-pill pill-cyan">
                          {currentQ.topicTitle || currentQ.category || 'Domain Practice'}
                        </span>
                        <span className={`topic-level-dot level-${(currentQ.difficulty || 'Intermediate').toLowerCase().replace(' ', '-')}`}>
                          {currentQ.difficulty || 'Intermediate'}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="quiz-progress-track">
                      <div
                        className="quiz-progress-fill"
                        style={{
                          width: `${((currentQuizQuestionIndex + 1) / totalQ) * 100}%`
                        }}
                      />
                    </div>

                    {/* Question */}
                    <p style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc', lineHeight: '1.6', margin: '16px 0 20px' }}>
                      {currentQ.question}
                    </p>

                    {/* Shuffled Options List */}
                    <div className="quiz-options-list">
                      {currentQ.options.map((opt, optIdx) => {
                        const letters = ['A', 'B', 'C', 'D', 'E']
                        const qId = currentQ.id
                        const selectedIdx = quizUserAnswers[qId]
                        const isAnswered = selectedIdx !== undefined
                        const isSelected = selectedIdx === optIdx
                        const isCorrect = typeof opt === 'object' && opt !== null && 'isCorrect' in opt
                          ? Boolean(opt.isCorrect)
                          : optIdx === currentQ.correctIndex

                        let btnClass = 'quiz-option-btn'
                        if (isAnswered) {
                          if (isSelected && isCorrect) btnClass += ' selected-correct'
                          else if (isSelected && !isCorrect) btnClass += ' selected-wrong'
                          else if (isCorrect) btnClass += ' selected-correct'
                        }

                        const optText = typeof opt === 'string'
                          ? opt
                          : (opt?.text || opt?.title || opt?.id || '')

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            className={btnClass}
                            onClick={() => handleSelectQuizQuestionOption(qId, optIdx)}
                            disabled={isAnswered}
                          >
                            <span className="option-letter-badge">{letters[optIdx]}</span>
                            <span>{optText}</span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Senior Explanation on Answer */}
                    {quizUserAnswers[currentQ.id] !== undefined && (
                      <div
                        className={`quiz-feedback-banner ${quizUserAnswers[currentQ.id] === currentQ.correctIndex ? 'correct' : 'wrong'}`}
                        style={{ marginTop: '20px' }}
                      >
                        <div style={{ marginBottom: '6px' }}>
                          <strong>{quizUserAnswers[currentQ.id] === currentQ.correctIndex ? '✓ Correct Answer' : '✗ Incorrect Selection'}</strong>
                        </div>
                        <div>{currentQ.explanation}</div>
                        {currentQ.engineerReasoning && (
                          <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.95 }}>
                            <strong>Senior SecOps Note:</strong> {currentQ.engineerReasoning}
                          </div>
                        )}
                        {currentQ.businessImpact && (
                          <div style={{ marginTop: '4px', fontSize: '12px', opacity: 0.9 }}>
                            <strong>Business Impact:</strong> {currentQ.businessImpact}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                      <button
                        type="button"
                        className="btn-launch-bridge"
                        disabled={quizUserAnswers[currentQ.id] === undefined}
                        onClick={handleNextQuizQuestion}
                      >
                        <span>
                          {currentQuizQuestionIndex < totalQ - 1 ? 'Next Question' : 'Complete & View Evaluation'}
                        </span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )
              }

              /* RESULTS SCREEN */
              const finalScore = activeQuizResult.score ?? activeQuizResult.percentage ?? 0
              const isPassed = activeQuizResult.passed ?? (finalScore >= 70)
              const strongList = activeQuizResult.strongTopics || activeQuizResult.strongAreas || []
              const weakList = activeQuizResult.weakTopics || activeQuizResult.weakAreas || []

              return (
                <div className="quiz-results-view">
                  <div
                    className="score-radial-large"
                    style={{
                      '--score-percent': `${finalScore}%`,
                      '--score-color': isPassed ? '#4ade80' : '#fb7185'
                    }}
                  >
                    <div className="score-radial-inner">
                      <span className="score-radial-number">{finalScore}%</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {activeQuizResult.correctCount ?? activeQuizResult.score} / {activeQuizResult.totalQuestions ?? activeQuizResult.total ?? 10} Correct
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', color: isPassed ? '#4ade80' : '#fb7185' }}>
                      {isPassed ? 'Knowledge Benchmark Passed!' : 'Knowledge Review Required'}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '0 auto', maxWidth: '520px', lineHeight: '1.6' }}>
                      {activeQuizResult.adaptiveFeedback ||
                        (isPassed
                          ? `Outstanding performance! You demonstrated comprehensive operational understanding of ${activeSession.domainName}.`
                          : `Score: ${finalScore}%. We have prepared remediation recommendations below before you proceed.`)}
                    </p>
                  </div>

                  {/* Difficulty Breakdown Badges */}
                  {activeQuizResult.difficultyStats && (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', width: '100%', margin: '6px 0' }}>
                      {Object.entries(activeQuizResult.difficultyStats).map(([diffName, diffStat]) => {
                        if (!diffStat.total) return null
                        const pct = Math.round((diffStat.correct / diffStat.total) * 100)
                        return (
                          <div key={diffName} className="study-area-card" style={{ padding: '8px 14px', minWidth: '110px' }}>
                            <small style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>{diffName}</small>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: pct >= 70 ? '#4ade80' : '#fb7185' }}>
                              {diffStat.correct}/{diffStat.total} ({pct}%)
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Strong & Weak Areas */}
                  <div className="areas-grid">
                    <div className="areas-box">
                      <div className="areas-title strong">
                        <CheckCheck size={14} /> Strong Topics (&ge; 80%)
                      </div>
                      {strongList.length > 0 ? (
                        <div className="area-tags-wrap">
                          {strongList.map((area, i) => (
                            <span key={i} className="area-tag-pill" style={{ color: '#86efac', borderColor: 'rgba(74, 222, 128, 0.3)' }}>
                              {area.title || area} {area.percent ? `(${area.percent}%)` : ''}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Continue practicing to establish mastery.</p>
                      )}
                    </div>

                    <div className="areas-box">
                      <div className="areas-title weak">
                        <AlertTriangle size={14} /> Weak Topics (&lt;60%)
                      </div>
                      {weakList.length > 0 ? (
                        <div className="area-tags-wrap">
                          {weakList.map((area, i) => (
                            <span key={i} className="area-tag-pill" style={{ color: '#fca5a5', borderColor: 'rgba(251, 113, 133, 0.3)' }}>
                              {area.title || area} {area.percent ? `(${area.percent}%)` : ''}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}>All tested topics verified above 60%!</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '14px' }}>
                    <button
                      type="button"
                      className="filter-btn"
                      style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                      onClick={handleRetakeQuiz}
                    >
                      <RotateCcw size={13} style={{ display: 'inline', marginRight: '6px' }} />
                      Generate New Randomized Question Set
                    </button>

                    <Link
                      to="/investigations"
                      className="btn-launch-bridge"
                      onClick={handleCloseQuizModal}
                    >
                      <span>Launch Live Investigation</span>
                      <ArrowRight size={14} />
                    </Link>

                    <Link
                      to="/internship-simulator"
                      className="filter-btn"
                      onClick={handleCloseQuizModal}
                    >
                      <span>Internship Simulator</span>
                    </Link>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Embedded Topic Notes Scratchpad */}
      <LabNotesScratchpad
        contextId={`learning-topic-${activeTopic.id}`}
        title={`Topic Notes: ${activeTopic.title}`}
      />
    </div>
  )
}
