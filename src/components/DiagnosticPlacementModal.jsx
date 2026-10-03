import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  X,
  ShieldCheck,
  Zap,
  Target,
  Copy,
  Check
} from 'lucide-react'
import {
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_DOMAINS,
  evaluateDiagnosticPlacement
} from '../data/diagnosticPlacementQuestions'
import '../styles/diagnosticPlacement.css'
import { useChallenges } from '../context/ChallengeContext'

export default function DiagnosticPlacementModal() {
  const navigate = useNavigate()
  const { activeProfile } = useChallenges() || {}
  const userId = activeProfile?.id || 'guest'
  const baselineStorageKey = `secloudive_baseline_${userId}`

  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState('intro') // 'intro' | 'quiz' | 'results'
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [diagnosticResult, setDiagnosticResult] = useState(null)
  const [copiedSummary, setCopiedSummary] = useState(false)

  // Load baseline for current user
  const loadBaselineForUser = () => {
    try {
      const saved = localStorage.getItem(baselineStorageKey) || (userId === 'guest' ? localStorage.getItem('secloudive_diagnostic_baseline') : null)
      if (saved) return JSON.parse(saved)
    } catch {
      return null
    }
    return null
  }

  // Reload when active user changes
  useEffect(() => {
    const baseline = loadBaselineForUser()
    setDiagnosticResult(baseline)
    if (baseline && isOpen) {
      setView('results')
    }
  }, [userId])

  // Listen for global trigger
  useEffect(() => {
    const handleOpen = () => {
      const saved = loadBaselineForUser()
      if (saved) {
        setDiagnosticResult(saved)
        setView('results')
      } else {
        setView('intro')
      }
      setIsOpen(true)
    }

    window.addEventListener('open-diagnostic-test', handleOpen)
    window.addEventListener('open-diagnostic-placement', handleOpen)
    return () => {
      window.removeEventListener('open-diagnostic-test', handleOpen)
      window.removeEventListener('open-diagnostic-placement', handleOpen)
    }
  }, [userId, baselineStorageKey])

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!isOpen) return null

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIdx]
  const isLastQuestion = currentIdx === DIAGNOSTIC_QUESTIONS.length - 1
  const selectedAnswerId = currentQ ? userAnswers[currentQ.id] : null

  const handleStartTest = () => {
    setUserAnswers({})
    setCurrentIdx(0)
    setView('quiz')
  }

  const handleSelectOption = (optId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId
    }))
  }

  const handleNext = () => {
    if (!selectedAnswerId) return

    if (isLastQuestion) {
      // Evaluate test
      const results = evaluateDiagnosticPlacement(userAnswers)
      setDiagnosticResult(results)
      localStorage.setItem(baselineStorageKey, JSON.stringify(results))
      localStorage.setItem('secloudive_diagnostic_baseline', JSON.stringify(results))
      window.dispatchEvent(
        new CustomEvent('diagnostic-test-completed', { detail: results })
      )
      setView('results')
    } else {
      setCurrentIdx((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1)
    }
  }

  const handleLaunchPath = (pathId) => {
    setIsOpen(false)
    navigate(`/learning/${pathId}`)
  }

  const handleCopySummary = () => {
    if (!diagnosticResult) return
    const text = `SeCloudive Skill Baseline Assessment:
Score: ${diagnosticResult.overallPercentage}% (${diagnosticResult.correctCount}/${diagnosticResult.totalQuestions})
Tier: ${diagnosticResult.skillLevel}
Recommended Path: ${diagnosticResult.recommendedPathTitle}
Rationale: ${diagnosticResult.recommendationReason}`

    navigator.clipboard.writeText(text)
    setCopiedSummary(true)
    setTimeout(() => setCopiedSummary(false), 2000)
  }

  return (
    <div
      className="diagnostic-modal-backdrop"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Skill Baseline Diagnostic Assessment"
    >
      <div
        className="diagnostic-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="diagnostic-header">
          <div className="diagnostic-header-left">
            <div className="diag-icon-shield">
              <Compass size={20} />
            </div>
            <div className="diagnostic-title-group">
              <h2>2-Minute Skill Baseline Test</h2>
              <div className="diagnostic-subtitle">
                Adaptive placement test across IAM, VPC Networking & Resilient Architecture
              </div>
            </div>
          </div>
          <button
            className="btn-diag-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="diagnostic-body">
          {/* VIEW 1: INTRO */}
          {view === 'intro' && (
            <div className="diag-intro-container">
              <div className="diag-intro-badge">
                <Zap size={14} /> 5 Quick Scenario Questions • ~2 Minutes
              </div>
              <h3 className="diag-intro-title">
                Find Your Optimal Cloud Security Starting Point
              </h3>
              <p className="diag-intro-desc">
                Don't guess where to begin. This fast diagnostic assesses your practical decision-making across
                identity policies, network routing, decoupling, and incident triage—then automatically charts your optimal learning path.
              </p>

              <div className="diag-domains-preview">
                {Object.values(DIAGNOSTIC_DOMAINS).map((d) => (
                  <div key={d.id} className="diag-domain-pill-card">
                    {d.name}
                  </div>
                ))}
              </div>

              <button
                className="btn-start-diag"
                onClick={handleStartTest}
              >
                <span>Begin 2-Minute Diagnostic</span>
                <ArrowRight size={17} />
              </button>
            </div>
          )}

          {/* VIEW 2: QUIZ RUNNER */}
          {view === 'quiz' && currentQ && (
            <div>
              {/* Progress counter & Meta tags */}
              <div className="diag-progress-row">
                <div className="diag-q-counter">
                  Question {currentIdx + 1} of {DIAGNOSTIC_QUESTIONS.length}
                </div>
                <div className="diag-q-meta-tags">
                  <span className="diag-meta-pill">{currentQ.domainName}</span>
                  <span className="diag-meta-pill">{currentQ.difficulty}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="diag-bar-track">
                <div
                  className="diag-bar-fill"
                  style={{
                    width: `${((currentIdx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%`
                  }}
                />
              </div>

              {/* Question Prompt */}
              <div className="diag-scenario-box">
                <div className="diag-scenario-tag">
                  <Target size={13} /> {currentQ.scenario}
                </div>
                <p className="diag-question-text">{currentQ.question}</p>
              </div>

              {/* Options */}
              <div className="diag-options-list">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswerId === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`diag-option-btn ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => handleSelectOption(opt.id)}
                    >
                      <span className="diag-option-letter">{opt.id}</span>
                      <span>{opt.text}</span>
                    </button>
                  )
                })}
              </div>

              {/* Navigation Footer */}
              <div className="diag-nav-footer">
                <button
                  className="btn-diag-back"
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                >
                  <ArrowLeft size={15} />
                  <span>Previous</span>
                </button>

                <button
                  className="btn-diag-next"
                  onClick={handleNext}
                  disabled={!selectedAnswerId}
                >
                  <span>{isLastQuestion ? 'Complete & Benchmark' : 'Next Question'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: RESULTS & PATH RECOMMENDATION */}
          {view === 'results' && diagnosticResult && (
            <div className="diag-results-container">
              {/* Summary Card */}
              <div className="diag-results-summary-card">
                <div className="diag-summary-left">
                  <div className="diag-skill-tier-badge">
                    <Award size={14} className="text-amber" />
                    <span>{diagnosticResult.skillBadge}</span>
                  </div>
                  <h3 className="diag-summary-headline">
                    {diagnosticResult.skillLevel}
                  </h3>
                  <p className="diag-summary-desc">
                    {diagnosticResult.summaryRationale}
                  </p>
                </div>
                <div className="diag-score-circle">
                  <span className="diag-score-number">
                    {diagnosticResult.overallPercentage}%
                  </span>
                  <span className="diag-score-label">
                    {diagnosticResult.correctCount}/{diagnosticResult.totalQuestions} Correct
                  </span>
                </div>
              </div>

              {/* Recommended Starting Path Spotlight */}
              <div className="diag-recommendation-box">
                <div className="diag-rec-header">
                  <div className="diag-rec-tag">
                    <Sparkles size={14} /> AI Diagnostic Recommendation
                  </div>
                </div>
                <h4 className="diag-rec-title">
                  {diagnosticResult.recommendedPathTitle}
                </h4>
                <p className="diag-rec-reason">
                  {diagnosticResult.recommendationReason}
                </p>
                <div className="diag-rec-actions">
                  <button
                    className="btn-launch-path"
                    onClick={() => handleLaunchPath(diagnosticResult.recommendedPathId)}
                  >
                    <span>Launch Recommended Path</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    className="btn-retake-diag"
                    onClick={handleStartTest}
                  >
                    <RotateCcw size={14} />
                    <span>Retake Test</span>
                  </button>
                  <button
                    className="btn-retake-diag"
                    onClick={handleCopySummary}
                    title="Copy Baseline Summary"
                  >
                    {copiedSummary ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                    <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
                  </button>
                </div>
              </div>

              {/* Domain Mastery Breakdown */}
              <div className="diag-domains-grid">
                <div className="diag-domains-heading">
                  Domain Knowledge Breakdown
                </div>
                {Object.values(diagnosticResult.domainBreakdown).map((dom) => (
                  <div key={dom.domainId} className="diag-domain-row">
                    <span className="diag-domain-name">{dom.name}</span>
                    <div className="diag-domain-meter">
                      <div
                        className={`diag-domain-meter-fill ${
                          dom.scorePct >= 100 ? 'score-100' : 'score-0'
                        }`}
                        style={{ width: `${dom.scorePct}%` }}
                      />
                    </div>
                    <span className="diag-domain-score-txt">
                      {dom.scorePct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
