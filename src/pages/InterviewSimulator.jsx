import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Award,
  Terminal,
  Cpu,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  Send,
  Target,
  BarChart3,
  Layers,
  ArrowRight,
  RefreshCw,
  Clock,
  ExternalLink,
  Flame,
  HelpCircle,
  TrendingUp,
  Brain,
  Download,
  Printer,
  Mic,
  Volume2,
  FileDown
} from 'lucide-react'
import { printResumePdf, downloadResumeMarkdown } from '../utils/resumePdfExporter'
import { useChallenges } from '../context/ChallengeContext'
import {
  INTERVIEW_ROLES,
  ARCHITECTURE_INTERVIEW_SCENARIOS,
  INCIDENT_RESPONSE_INTERVIEW_SCENARIOS
} from '../data/interviewBank'
import { interviewSimulatorService, resumeCoachService } from '../services/intelligenceEngine'
import AIOperationsDashboard from '../components/AIOperationsDashboard'
import LabNotesScratchpad from '../components/LabNotesScratchpad'
import DefenderQuoteCallout from '../components/DefenderQuoteCallout'
import '../styles/careerIntelligence.css'

export default function InterviewSimulator() {
  const {
    completedCount,
    architectureReviewedCount,
    completedLabsCount,
    investigationCompletedCount,
    totalScore,
    internshipReadiness,
    masterCareerProfile,
    submitInterviewResponse,
    interviewsCompletedCount,
    interviewAttempts
  } = useChallenges()

  // Tab State: 'mock' | 'architecture' | 'incident' | 'resume' | 'readiness' | 'final'
  const [activeTab, setActiveTab] = useState('mock')

  // Mock Interview State
  const [selectedRole, setSelectedRole] = useState(INTERVIEW_ROLES[0])
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate') // 'beginner' | 'intermediate' | 'advanced' | 'scenario'
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [showSampleHint, setShowSampleHint] = useState(false)

  // Architecture Interview State
  const [activeArchScenario, setActiveArchScenario] = useState(ARCHITECTURE_INTERVIEW_SCENARIOS[0])
  const [archRisks, setArchRisks] = useState('')
  const [archTradeoffs, setArchTradeoffs] = useState('')
  const [archImprovements, setArchImprovements] = useState('')
  const [isEvaluatingArch, setIsEvaluatingArch] = useState(false)
  const [archFeedback, setArchFeedback] = useState(null)

  // Incident Response Interview State
  const [activeIrScenario, setActiveIrScenario] = useState(INCIDENT_RESPONSE_INTERVIEW_SCENARIOS[0])
  const [irAnswers, setIrAnswers] = useState({ detection: '', investigation: '', containment: '', remediation: '' })
  const [isEvaluatingIr, setIsEvaluatingIr] = useState(false)
  const [irFeedback, setIrFeedback] = useState(null)

  // Resume Generator State
  const [resumeData, setResumeData] = useState(null)
  const [isGeneratingResume, setIsGeneratingResume] = useState(false)
  const [copiedResume, setCopiedResume] = useState(false)

  // AI Operations Telemetry Modal
  const [showAIOpsModal, setShowAIOpsModal] = useState(false)

  // Current questions pool for selected role & difficulty
  const questionsList = useMemo(() => {
    return selectedRole?.questions?.[selectedDifficulty] || []
  }, [selectedRole, selectedDifficulty])

  const activeQuestion = questionsList[activeQuestionIdx] || questionsList[0]

  // Handle Mock Answer Evaluation
  const handleEvaluateMockAnswer = async () => {
    if (!userAnswer.trim()) return
    setIsEvaluating(true)
    try {
      const result = await interviewSimulatorService.evaluateAnswer({
        role: selectedRole.title,
        question: activeQuestion.question,
        answer: userAnswer,
        difficulty: selectedDifficulty
      })
      setEvaluationResult(result.content)
      if (submitInterviewResponse) {
        submitInterviewResponse(
          activeQuestion.id || `${selectedRole.id}-${selectedDifficulty}-${activeQuestionIdx}`,
          userAnswer,
          selectedRole.title,
          'Hiring Manager'
        )
      }
    } finally {
      setIsEvaluating(false)
    }
  }

  // Handle Architecture Evaluation
  const handleEvaluateArchitecture = async () => {
    setIsEvaluatingArch(true)
    try {
      const result = await interviewSimulatorService.evaluateArchitectureInterview({
        architectureTitle: activeArchScenario.title,
        risksIdentified: archRisks,
        tradeoffsExplained: archTradeoffs,
        improvementsRecommended: archImprovements
      })
      setArchFeedback(result.content)
      if (submitInterviewResponse) {
        const fullResp = `Risks: ${archRisks}\nTradeoffs: ${archTradeoffs}\nImprovements: ${archImprovements}`
        submitInterviewResponse(
          activeArchScenario.id || activeArchScenario.title,
          fullResp,
          'Cloud Security Architect',
          'Architecture Reviewer'
        )
      }
    } finally {
      setIsEvaluatingArch(false)
    }
  }

  // Handle Incident Response Evaluation
  const handleEvaluateIncidentResponse = async () => {
    setIsEvaluatingIr(true)
    try {
      const result = await interviewSimulatorService.evaluateIncidentResponseInterview({
        incidentTitle: activeIrScenario.title,
        detection: irAnswers.detection,
        investigation: irAnswers.investigation,
        containment: irAnswers.containment,
        remediation: irAnswers.remediation
      })
      setIrFeedback(result.content)
      if (submitInterviewResponse) {
        const fullResp = `Detection: ${irAnswers.detection}\nInvestigation: ${irAnswers.investigation}\nContainment: ${irAnswers.containment}\nRemediation: ${irAnswers.remediation}`
        submitInterviewResponse(
          activeIrScenario.id || activeIrScenario.title,
          fullResp,
          'Incident Response Lead',
          'Security Mentor'
        )
      }
    } finally {
      setIsEvaluatingIr(false)
    }
  }

  // Handle Resume Generation
  const handleGenerateResume = async () => {
    setIsGeneratingResume(true)
    try {
      const result = await resumeCoachService.generateResumeContent({
        completedLabs: completedLabsCount,
        completedInvestigations: investigationCompletedCount,
        targetRole: selectedRole.title
      })
      setResumeData(result.content)
    } finally {
      setIsGeneratingResume(false)
    }
  }

  // Compute Hiring Readiness Scores
  const technicalReadiness = Math.min(100, Math.round(55 + (completedCount * 1.5)))
  const securityReadiness = Math.min(100, Math.max(70, internshipReadiness || 78))
  const architectureReadiness = Math.min(100, Math.round(50 + (architectureReviewedCount * 5)))
  const investigationReadiness = Math.min(100, Math.round(55 + (investigationCompletedCount * 2)))
  const overallEmployabilityScore = Math.round((technicalReadiness + securityReadiness + architectureReadiness + investigationReadiness) / 4)

  // STAR Method 4-Pillar Breakdown
  const starScores = useMemo(() => {
    if (!evaluationResult) return { situation: 0, task: 0, action: 0, result: 0 }
    const total = evaluationResult.score || 75
    const s = Math.min(25, Math.max(15, Math.round(total * 0.25)))
    const t = Math.min(25, Math.max(15, Math.round(total * 0.24 + 1)))
    const a = Math.min(25, Math.max(15, Math.round(total * 0.26)))
    const r = Math.min(25, Math.max(12, total - (s + t + a)))
    return { situation: s, task: t, action: a, result: r }
  }, [evaluationResult])

  // Export Candidate Dossier Markdown
  const handleExportCandidateDossier = () => {
    const md = `# SECLOUDIVE CANDIDATE INTERVIEW DOSSIER
**Generated**: ${new Date().toUTCString()}
**Candidate Profile**: ${masterCareerProfile?.title || 'Cloud Security Engineer Candidate'}
**Target Track**: ${selectedRole.title} (${selectedDifficulty.toUpperCase()})
**Overall Employability Score**: ${overallEmployabilityScore}%

---

## 1. Hiring Readiness Breakdown
- Technical Readiness: ${technicalReadiness}% (${completedCount} Challenges Validated)
- Security Readiness: ${securityReadiness}%
- Architecture Readiness: ${architectureReadiness}%
- Investigation Readiness: ${investigationReadiness}%

## 2. Mock Interview Question & Response
- **Question**: "${activeQuestion?.question}"
- **Candidate Answer**:
> ${userAnswer || '(No answer recorded)'}

### Hiring Manager Assessment:
- **Verdict**: ${evaluationResult?.hireRecommendation || 'Pending Review'}
- **Score**: ${evaluationResult?.score || 0}/100
- **Technical Accuracy**: ${evaluationResult?.technicalAccuracy || 'N/A'}
- **Communication Clarity**: ${evaluationResult?.communicationClarity || 'N/A'}

### STAR Method Matrix:
- **Situation (Context & Threat Boundary)**: ${starScores.situation}/25
- **Task (Objectives & Controls)**: ${starScores.task}/25
- **Action (AWS Execution & Policy Logic)**: ${starScores.action}/25
- **Result (Blast Radius Containment)**: ${starScores.result}/25

### Key Strengths:
${(evaluationResult?.keyStrengths || []).map(s => `- ${s}`).join('\n') || '- None recorded'}

### Missing Elements & Areas for Growth:
${(evaluationResult?.missingElements || []).map(m => `- ${m}`).join('\n') || '- None recorded'}

### Follow-Up Interviewer Probe:
"${evaluationResult?.followUpQuestion || 'N/A'}"

---
*SeCloudive Enterprise Cloud Security Training Simulator • Non-production pedagogical assessment dossier*
`
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SeCloudive_Interview_Dossier_${selectedRole.id}_${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="page-shell clean-dashboard" style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Header */}
      <div className="dashboard-header clean-dashboard-header" style={{ marginBottom: '20px' }}>
        <div>
          <div className="eyebrow">
            <Sparkles size={12} className="text-cyan" />
            <span>AI-POWERED HIRING INTELLIGENCE /// SECLOUDIVE INTELLIGENCE ENGINE</span>
          </div>
          <h1>
            Cloud Security Interview & Hiring Simulator<span>.</span>
          </h1>
          <p>
            Master real-world technical, architectural, and incident response interviews for Cloud Security Engineer, SOC Analyst, and DevSecOps positions.
          </p>
        </div>

        <div className="dashboard-header-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('secloudive:toggle-notes', {
                detail: { contextId: 'interview-candidate-notes' }
              }))
            }}
            style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
            title="Candidate Notes & Talking Points"
          >
            <FileText size={15} /> Candidate Notes
          </button>
          {evaluationResult && (
            <button
              type="button"
              className="button button-ghost"
              onClick={handleExportCandidateDossier}
              style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10b981' }}
              title="Download Interview Dossier (.md)"
            >
              <FileDown size={15} /> Export Dossier
            </button>
          )}
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setShowAIOpsModal(true)}
            style={{ borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}
          >
            <Cpu size={15} /> AI Gateway Telemetry
          </button>
          <Link to="/dashboard" className="button button-ghost">
            Back to Command Center
          </Link>
        </div>
      </div>

      {/* ── ENCOURAGING INTERVIEW READINESS & ANTI-IMPOSTER CALLOUT ── */}
      <DefenderQuoteCallout category="career" autoCycle={true} cycleIntervalMs={16000} />

      {/* Hiring Readiness Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>OVERALL EMPLOYABILITY SCORE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
            {overallEmployabilityScore}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px' }}>● Market Competitive</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>TECHNICAL READINESS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            {technicalReadiness}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{completedCount} challenges validated</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(192, 132, 252, 0.25)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>ARCHITECTURE READINESS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc', marginTop: '2px' }}>
            {architectureReadiness}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Well-Architected evaluation</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(251, 146, 60, 0.25)', borderRadius: '10px', padding: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>INVESTIGATION READINESS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fb923c', marginTop: '2px' }}>
            {investigationReadiness}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>CloudTrail & SIEM triage</div>
        </div>
      </div>

      {/* Compliance Disclaimer Notice */}
      <div style={{ marginBottom: '24px', padding: '10px 16px', background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
        <span style={{ color: '#38bdf8' }}>ℹ️</span>
        <span><em>Illustrative training score, not a certified compliance assessment.</em> Evaluations reflect pedagogical interview readiness benchmarks.</span>
      </div>

      {/* Segmented Navigation Tab Bar */}
      <div className="track-tab-bar" role="tablist" style={{ marginBottom: '24px' }}>
        <button
          type="button"
          className={`track-tab-btn ${activeTab === 'mock' ? 'active tab-cyan' : ''}`}
          onClick={() => setActiveTab('mock')}
        >
          <Brain size={15} />
          <span>1. Mock Interview Arena</span>
        </button>

        <button
          type="button"
          className={`track-tab-btn ${activeTab === 'architecture' ? 'active tab-purple' : ''}`}
          onClick={() => setActiveTab('architecture')}
        >
          <Layers size={15} />
          <span>2. Architecture Interview</span>
        </button>

        <button
          type="button"
          className={`track-tab-btn ${activeTab === 'incident' ? 'active tab-rose' : ''}`}
          onClick={() => setActiveTab('incident')}
        >
          <AlertTriangle size={15} />
          <span>3. Incident Response Round</span>
        </button>

        <button
          type="button"
          className={`track-tab-btn ${activeTab === 'resume' ? 'active tab-emerald' : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          <FileText size={15} />
          <span>4. Resume & Evidence Coach</span>
        </button>

        <button
          type="button"
          className={`track-tab-btn ${activeTab === 'readiness' ? 'active tab-cyan' : ''}`}
          onClick={() => setActiveTab('readiness')}
        >
          <Target size={15} />
          <span>5. Weak Areas & Study Plan</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MOCK INTERVIEW ARENA */}
      {/* ========================================================================= */}
      {activeTab === 'mock' && (
        <section className="clean-panel" style={{ padding: '24px' }}>
          {/* Role & Difficulty Selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                TARGET INTERVIEW TRACK:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {INTERVIEW_ROLES.map(role => (
                  <button
                    key={role.id}
                    type="button"
                    className={`button ${selectedRole.id === role.id ? 'button-primary' : 'button-ghost'}`}
                    onClick={() => { setSelectedRole(role); setActiveQuestionIdx(0); setEvaluationResult(null); setUserAnswer('') }}
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    {role.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                DIFFICULTY LEVEL:
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['beginner', 'intermediate', 'advanced', 'scenario'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    className={`button ${selectedDifficulty === lvl ? 'button-primary' : 'button-ghost'}`}
                    onClick={() => { setSelectedDifficulty(lvl); setActiveQuestionIdx(0); setEvaluationResult(null); setUserAnswer('') }}
                    style={{ fontSize: '0.75rem', padding: '4px 10px', textTransform: 'capitalize' }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Display Card */}
          {activeQuestion ? (
            <div>
              <div style={{ background: 'rgba(2, 6, 23, 0.75)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                    QUESTION {activeQuestionIdx + 1} OF {questionsList.length} • {selectedRole.title} ({selectedDifficulty.toUpperCase()})
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSampleHint(!showSampleHint)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}
                  >
                    {showSampleHint ? 'Hide Guidance Hint' : 'View Guidance Hint'}
                  </button>
                </div>

                <h2 style={{ fontSize: '1.15rem', color: '#f8fafc', lineHeight: 1.5, margin: 0 }}>
                  "{activeQuestion.question}"
                </h2>

                {showSampleHint && (
                  <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', fontSize: '0.82rem', color: '#bae6fd' }}>
                    <strong>Interviewer Focus Hint:</strong> {activeQuestion.sampleAnswerHint}
                  </div>
                )}

                {/* Question Stepper Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(148, 163, 184, 0.15)', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    type="button"
                    className="button button-ghost"
                    disabled={activeQuestionIdx === 0}
                    onClick={() => {
                      setActiveQuestionIdx(prev => Math.max(0, prev - 1))
                      setUserAnswer('')
                      setEvaluationResult(null)
                    }}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    <ChevronLeft size={13} /> Prev Question
                  </button>

                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {questionsList.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActiveQuestionIdx(idx)
                          setUserAnswer('')
                          setEvaluationResult(null)
                        }}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          border: activeQuestionIdx === idx ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.25)',
                          background: activeQuestionIdx === idx ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                          color: activeQuestionIdx === idx ? '#38bdf8' : '#94a3b8',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                        title={`Jump to Question ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="button button-ghost"
                    disabled={activeQuestionIdx >= questionsList.length - 1}
                    onClick={() => {
                      setActiveQuestionIdx(prev => Math.min(questionsList.length - 1, prev + 1))
                      setUserAnswer('')
                      setEvaluationResult(null)
                    }}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    Next Question <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {/* Candidate Answer Box */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>
                  YOUR RESPONSE (Type your technical answer as you would explain it to the hiring manager):
                </label>
                <textarea
                  rows={5}
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Explain your technical reasoning, specific AWS services, IAM policy conditions, order of containment operations, and architectural tradeoffs..."
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: '8px',
                    padding: '14px',
                    color: '#f8fafc',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    resize: 'vertical'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Word Count: {userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0} words
                  </span>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={handleEvaluateMockAnswer}
                    disabled={isEvaluating || !userAnswer.trim()}
                    style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}
                  >
                    {isEvaluating ? (
                      <>
                        <RefreshCw size={14} className="spin-icon" />
                        <span>Evaluating via AI Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Submit for Hiring Manager Review</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Animated Audio Waveform Thinking Visualizer during Evaluation */}
              {isEvaluating && (
                <div className="interview-waveform-container">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <Mic size={16} className="spin-icon" style={{ animationDuration: '3s' }} />
                    <strong style={{ letterSpacing: '0.03em' }}>AI HIRING MANAGER SYNTHESIZING RESPONSE EVALUATION...</strong>
                  </div>
                  <div className="waveform-bars-row">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <span key={i} className="waveform-bar" />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', marginTop: '6px' }}>
                    <span>Evaluating STAR structure, technical accuracy & AWS policy logic</span>
                    <span>Simulated Latency: ~380ms • Gateway: Anthropic Claude / Gemini Flash</span>
                  </div>
                </div>
              )}

              {/* Evaluation Feedback Panel */}
              {evaluationResult && (
                <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '20px', marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                      <strong style={{ fontSize: '1rem', color: '#f8fafc' }}>
                        Hiring Manager Evaluation: {evaluationResult.hireRecommendation}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem' }}>
                        Score: {evaluationResult.score}/100
                      </span>
                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={handleExportCandidateDossier}
                        style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                        title="Download Interview Dossier (.md)"
                      >
                        <FileDown size={13} /> Dossier (.md)
                      </button>
                    </div>
                  </div>

                  {/* STAR Method 4-Pillar Breakdown Matrix */}
                  <div className="star-matrix-grid">
                    <div className="star-card" style={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                      <div className="star-header">
                        <span className="star-letter" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>S</span>
                        <span className="star-score" style={{ color: '#38bdf8' }}>{starScores.situation}/25</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>Situation & Perimeter</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Architecture context & risk framing</div>
                    </div>

                    <div className="star-card" style={{ borderColor: 'rgba(192, 132, 252, 0.3)' }}>
                      <div className="star-header">
                        <span className="star-letter" style={{ background: 'rgba(192, 132, 252, 0.2)', color: '#c084fc' }}>T</span>
                        <span className="star-score" style={{ color: '#c084fc' }}>{starScores.task}/25</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>Task & Compliance</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Security objectives & SLA guardrails</div>
                    </div>

                    <div className="star-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                      <div className="star-header">
                        <span className="star-letter" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>A</span>
                        <span className="star-score" style={{ color: '#10b981' }}>{starScores.action}/25</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>Action & AWS Tools</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>IAM policies, CLI & containment</div>
                    </div>

                    <div className="star-card" style={{ borderColor: 'rgba(251, 146, 60, 0.3)' }}>
                      <div className="star-header">
                        <span className="star-letter" style={{ background: 'rgba(251, 146, 60, 0.2)', color: '#fb923c' }}>R</span>
                        <span className="star-score" style={{ color: '#fb923c' }}>{starScores.result}/25</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>Result & Containment</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Blast radius reduction & verification</div>
                    </div>
                  </div>

                  <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '12px' }}>
                    {evaluationResult.technicalAccuracy}
                  </p>

                  <div className="interview-grid-2col" style={{ gap: '14px', marginBottom: '16px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <strong style={{ color: '#6ee7b7', fontSize: '0.78rem', textTransform: 'uppercase' }}>Key Strengths</strong>
                      <ul style={{ margin: '6px 0 0', paddingLeft: '16px', color: '#e2e8f0', fontSize: '0.82rem' }}>
                        {evaluationResult.keyStrengths?.map((s, idx) => <li key={idx}>{s}</li>)}
                      </ul>
                    </div>

                    <div style={{ background: 'rgba(251, 146, 60, 0.08)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(251, 146, 60, 0.2)' }}>
                      <strong style={{ color: '#fdba74', fontSize: '0.78rem', textTransform: 'uppercase' }}>Missing Elements to Mention</strong>
                      <ul style={{ margin: '6px 0 0', paddingLeft: '16px', color: '#e2e8f0', fontSize: '0.82rem' }}>
                        {evaluationResult.missingElements?.map((m, idx) => <li key={idx}>{m}</li>)}
                      </ul>
                    </div>
                  </div>

                  {evaluationResult.followUpQuestion && (
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                      <strong style={{ color: '#38bdf8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <HelpCircle size={14} /> Interviewer Follow-Up Probe:
                      </strong>
                      <p style={{ margin: '6px 0 0', color: '#bae6fd', fontSize: '0.85rem' }}>
                        "{evaluationResult.followUpQuestion}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>No questions available for this level.</div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ARCHITECTURE INTERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'architecture' && (
        <section className="clean-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div className="eyebrow">SYSTEMS REVIEW ROUND</div>
            <h2>AWS Architecture Interview Simulator</h2>
            <p>Analyze realistic enterprise AWS designs. Identify security vulnerabilities, discuss architectural tradeoffs, and propose hardened solutions.</p>
          </div>

          <div className="interview-grid-2col" style={{ gap: '20px', marginBottom: '20px' }}>
            {/* Architecture Scenario Details */}
            <div style={{ background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', padding: '18px' }}>
              <span className="item-badge">{activeArchScenario.companyContext}</span>
              <h3 style={{ margin: '10px 0 6px', color: '#f8fafc' }}>{activeArchScenario.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{activeArchScenario.architectureSummary}</p>

              <div style={{ marginTop: '14px', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                ARCHITECTURE COMPONENTS IN SCOPE:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {activeArchScenario.diagramNodes.map(node => (
                  <div key={node.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '6px', fontSize: '0.75rem' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{node.label}</span>
                    {node.flag && <span style={{ color: '#f43f5e' }}>⚠️ {node.flag}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Inputs */}
            <div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1' }}>1. IDENTIFY ARCHITECTURAL RISKS:</label>
                <textarea
                  rows={3}
                  value={archRisks}
                  onChange={e => setArchRisks(e.target.value)}
                  placeholder="e.g. Public IP directly exposed on EC2, single-AZ RDS risk, missing WAF..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '6px', padding: '8px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1' }}>2. EXPLAIN SECURITY VS LATENCY/COST TRADEOFFS:</label>
                <textarea
                  rows={3}
                  value={archTradeoffs}
                  onChange={e => setArchTradeoffs(e.target.value)}
                  placeholder="e.g. Adding private NAT gateways increases availability zone data transfer cost but guarantees perimeter isolation..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '6px', padding: '8px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1' }}>3. RECOMMENDED HARDENED TOPOLOGY:</label>
                <textarea
                  rows={3}
                  value={archImprovements}
                  onChange={e => setArchImprovements(e.target.value)}
                  placeholder="e.g. Move RDS to dedicated isolated subnet, attach AWS WAF to ALB, enforce IMDSv2..."
                  style={{ width: '100%', background: '#090d16', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '6px', padding: '8px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <button
                type="button"
                className="button button-primary"
                onClick={handleEvaluateArchitecture}
                disabled={isEvaluatingArch}
                style={{ width: '100%' }}
              >
                {isEvaluatingArch ? 'Evaluating Architecture...' : 'Submit Architecture Review'}
              </button>
            </div>
          </div>

          {/* Architecture Feedback */}
          {archFeedback && (
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ color: '#c084fc', fontSize: '1.05rem' }}>{archFeedback.interviewerVerdict} (Score: {archFeedback.score}/100)</strong>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.6 }}>{archFeedback.feedback}</p>
              <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(192, 132, 252, 0.1)', borderRadius: '6px', fontSize: '0.8rem', color: '#e9d5ff' }}>
                <strong>Portfolio Talking Point:</strong> {archFeedback.portfolioTalkingPoint}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INCIDENT RESPONSE ROUND */}
      {/* ========================================================================= */}
      {activeTab === 'incident' && (
        <section className="clean-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div className="eyebrow">SOC INVESTIGATION ROUND</div>
            <h2>Incident Response Hiring Simulator</h2>
            <p>Explain your end-to-end incident response playbook: Detection signals, Forensic pivot points, Containment order of operations, and Permanent remediation.</p>
          </div>

          <div style={{ background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '10px', padding: '18px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="risk-tag risk-critical">SEVERITY: {activeIrScenario.severity}</span>
              <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600 }}>{activeIrScenario.mitreTactic}</span>
            </div>
            <h3 style={{ margin: '6px 0', color: '#f8fafc' }}>{activeIrScenario.title}</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>{activeIrScenario.scenarioPrompt}</p>
          </div>

          <div className="interview-grid-2col" style={{ gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8' }}>1. DETECTION TELEMETRY:</label>
              <textarea
                rows={3}
                value={irAnswers.detection}
                onChange={e => setIrAnswers({ ...irAnswers, detection: e.target.value })}
                placeholder="What CloudTrail events and telemetry do you examine immediately?"
                style={{ width: '100%', background: '#090d16', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '6px', padding: '8px', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8' }}>2. INVESTIGATION PIVOTS:</label>
              <textarea
                rows={3}
                value={irAnswers.investigation}
                onChange={e => setIrAnswers({ ...irAnswers, investigation: e.target.value })}
                placeholder="How do you check for secondary persistence, backdoor keys, or lateral movement?"
                style={{ width: '100%', background: '#090d16', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '6px', padding: '8px', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f43f5e' }}>3. CONTAINMENT EXECUTION (ORDER MATTERS):</label>
              <textarea
                rows={3}
                value={irAnswers.containment}
                onChange={e => setIrAnswers({ ...irAnswers, containment: e.target.value })}
                placeholder="What exact containment actions do you execute first without destroying evidence?"
                style={{ width: '100%', background: '#090d16', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '6px', padding: '8px', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981' }}>4. PERMANENT REMEDIATION & PREVENTATIVE GUARDRAILS:</label>
              <textarea
                rows={3}
                value={irAnswers.remediation}
                onChange={e => setIrAnswers({ ...irAnswers, remediation: e.target.value })}
                placeholder="What Organizations SCPs, IAM boundaries, or Terraform fixes prevent this forever?"
                style={{ width: '100%', background: '#090d16', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '6px', padding: '8px', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <button
            type="button"
            className="button button-primary"
            onClick={handleEvaluateIncidentResponse}
            disabled={isEvaluatingIr}
            style={{ width: '100%' }}
          >
            {isEvaluatingIr ? 'Analyzing IR Playbook...' : 'Submit Incident Response Walkthrough'}
          </button>

          {irFeedback && (
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', padding: '20px', marginTop: '20px' }}>
              <strong style={{ color: '#fb7185', fontSize: '1.05rem' }}>{irFeedback.interviewerVerdict} (Score: {irFeedback.score}/100)</strong>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '8px' }}>{irFeedback.feedback}</p>
              <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '6px', fontSize: '0.8rem', color: '#fecdd3' }}>
                <strong>Key Evaluation Highlight:</strong> {irFeedback.highlight}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: RESUME & EVIDENCE COACH */}
      {/* ========================================================================= */}
      {activeTab === 'resume' && (
        <section className="clean-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div className="eyebrow">PORTFOLIO INTELLIGENCE</div>
              <h2>Resume Project & Evidence Evaluator</h2>
              <p>Automatically maps your completed SeCloudive labs, investigations, and battle rooms into quantified resume bullet points and interview talking points.</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="button button-ghost"
                onClick={() => printResumePdf(masterCareerProfile)}
                title="Print or save as official NAEN Studios accredited ATS-friendly PDF (No VS Code association)"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderColor: 'rgba(56,189,248,0.45)', color: '#38bdf8' }}
              >
                <Printer size={14} />
                <span>📄 View & Save NAEN PDF Resume</span>
              </button>

              <button
                type="button"
                className="button button-primary"
                onClick={handleGenerateResume}
                disabled={isGeneratingResume}
                style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}
              >
                {isGeneratingResume ? 'Generating Resume Evidence...' : 'Generate Resume Bullets'}
              </button>
            </div>
          </div>

          {resumeData ? (
            <div>
              {/* Professional Headline */}
              <div style={{ background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '16px', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>RECOMMENDED LINKEDIN HEADLINE</span>
                <h4 style={{ margin: '4px 0 0', color: '#f8fafc', fontSize: '0.98rem' }}>{resumeData.headline}</h4>
                <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{resumeData.summary}</p>
              </div>

              {/* Quantified Bullets */}
              <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '18px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                    EXPERIENCE BULLET POINTS (READY TO PASTE ON RESUME)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(resumeData.resumeBullets?.join('\n'))
                      setCopiedResume(true)
                      setTimeout(() => setCopiedResume(false), 2000)
                    }}
                    style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {copiedResume ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                    <span>{copiedResume ? 'Copied Bullets!' : 'Copy All Bullets'}</span>
                  </button>
                </div>

                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '10px', color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {resumeData.resumeBullets?.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              {/* Interview Talking Points */}
              <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(192, 132, 252, 0.25)', borderRadius: '8px', padding: '18px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                  INTERVIEW TALKING POINTS (DEFEND YOUR WORK IN INTERVIEWS)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {resumeData.interviewTalkingPoints?.map((tp, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'rgba(2, 6, 23, 0.5)', borderRadius: '6px' }}>
                      <strong style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>{tp.topic}:</strong>
                      <span style={{ color: '#cbd5e1', fontSize: '0.82rem', marginLeft: '6px' }}>{tp.point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <FileText size={36} style={{ color: '#38bdf8', marginBottom: '12px' }} />
              <h3>Ready to Translate Practice into Career Currency</h3>
              <p>Click "Generate Resume Bullets" to convert your {completedLabsCount} completed labs and {investigationCompletedCount} investigations into hiring-ready bullets.</p>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: WEAK AREAS & STUDY PLAN */}
      {/* ========================================================================= */}
      {activeTab === 'readiness' && (
        <section className="clean-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div className="eyebrow">DIAGNOSTIC INTELLIGENCE</div>
            <h2>Interview Weak Areas & Study Recommendations</h2>
            <p>Identifies knowledge gaps based on your test history and recommends targeted practice modules.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', marginBottom: '8px' }}>
                PRIORITY GAP #1: IAM PERMISSION BOUNDARIES
              </div>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                Delegating IAM admin power to developers without explicit permission boundaries creates immediate privilege escalation vulnerabilities.
              </p>
              <div style={{ marginTop: '12px' }}>
                <Link to="/learning/iam" className="button button-ghost" style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#38bdf8' }}>
                  Launch IAM Module <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            <div style={{ background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(251, 146, 60, 0.25)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb923c', textTransform: 'uppercase', marginBottom: '8px' }}>
                PRIORITY GAP #2: CLOUDTRAIL MANAGEMENT VS DATA EVENTS
              </div>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                Missing object-level logging prevents attribution of specific data exfiltration events in S3 buckets.
              </p>
              <div style={{ marginTop: '12px' }}>
                <Link to="/learning/monitoring" className="button button-ghost" style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#38bdf8' }}>
                  Launch Monitoring Module <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            <div style={{ background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(192, 132, 252, 0.25)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', marginBottom: '8px' }}>
                PRIORITY GAP #3: MULTI-ACCOUNT SCPS
              </div>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                Hiring managers frequently ask how to prevent unauthorized region usage or CloudTrail deletion across all accounts.
              </p>
              <div style={{ marginTop: '12px' }}>
                <Link to="/playbooks" className="button button-ghost" style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#38bdf8' }}>
                  Review Playbook <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* AI Operations Modal */}
      {showAIOpsModal && (
        <div className="audit-modal-backdrop" onClick={() => setShowAIOpsModal(false)}>
          <div className="audit-modal-window" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <AIOperationsDashboard onClose={() => setShowAIOpsModal(false)} />
          </div>
        </div>
      )}

      {/* Candidate Interview Prep Scratchpad */}
      <LabNotesScratchpad
        contextId="interview-candidate-notes"
        title="Candidate Interview Prep Scratchpad"
      />
    </main>
  )
}
