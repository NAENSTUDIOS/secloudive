import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  FileText,
  Terminal,
  Activity,
  Award,
  Layers,
  Flame,
  CheckSquare,
  Square,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Download,
  Printer
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import EvidenceViewer from '../components/EvidenceViewer'
import InvestigationCard from '../components/InvestigationCard'

export default function InvestigationSimulator() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    investigations,
    investigationCategories,
    progress,
    submitInvestigation,
    investigationCompletedCount,
    investigationAverageScore,
    investigationCategoryCounts
  } = useChallenges()

  // State for Hub View
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRisk, setSelectedRisk] = useState('all')

  // State for Active Workspace View
  const [selectedFindingIds, setSelectedFindingIds] = useState([])
  const [assessedSeverity, setAssessedSeverity] = useState('')
  const [showDossier, setShowDossier] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)

  // Find active investigation if `id` is in URL
  const activeInvestigation = useMemo(() => {
    if (!id) return null
    return investigations.find(item => item.id === id) || investigations[0]
  }, [id, investigations])

  // Sync state when active investigation changes or has previous assessment
  useEffect(() => {
    if (activeInvestigation) {
      const priorAssessment = progress.investigationAssessments?.[activeInvestigation.id]
      const isCompleted = progress.investigationScores?.[activeInvestigation.id] !== undefined
      if (priorAssessment) {
        setSelectedFindingIds(priorAssessment.selectedFindingIds || [])
        setAssessedSeverity(priorAssessment.assessedSeverity || '')
        setShowDossier(true)
        setSubmissionResult({ score: priorAssessment.score })
      } else if (isCompleted) {
        setShowDossier(true)
        setSubmissionResult({ score: progress.investigationScores[activeInvestigation.id] })
      } else {
        setSelectedFindingIds([])
        setAssessedSeverity('')
        setShowDossier(false)
        setSubmissionResult(null)
      }
    }
  }, [activeInvestigation, progress])

  // Filter investigations in Hub view
  const filteredInvestigations = useMemo(() => {
    return investigations.filter(inv => {
      const matchesCategory =
        selectedCategory === 'all' || inv.categoryKey === selectedCategory
      const matchesRisk =
        selectedRisk === 'all' || inv.riskLevel.toLowerCase() === selectedRisk.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        inv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.ticket.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.incidentSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.affectedServices.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesRisk && matchesSearch
    })
  }, [investigations, selectedCategory, selectedRisk, searchQuery])

  // Toggle finding in checklist
  const toggleFinding = findingId => {
    if (showDossier) return // Read-only after submission unless retrying
    setSelectedFindingIds(prev =>
      prev.includes(findingId) ? prev.filter(i => i !== findingId) : [...prev, findingId]
    )
  }

  // Submit investigation
  const handleSubmit = e => {
    e.preventDefault()
    if (!activeInvestigation || !selectedFindingIds.length) return

    const finalScore = submitInvestigation(
      activeInvestigation,
      selectedFindingIds,
      assessedSeverity
    )
    setSubmissionResult({ score: finalScore })
    setShowDossier(true)
  }

  // Retry / re-investigate
  const handleRetry = () => {
    setShowDossier(false)
    setSelectedFindingIds([])
    setAssessedSeverity('')
    setSubmissionResult(null)
  }

  // Next investigation helper
  const handleNext = () => {
    if (!activeInvestigation) return
    const currentIndex = investigations.findIndex(i => i.id === activeInvestigation.id)
    const nextInv = investigations[(currentIndex + 1) % investigations.length]
    navigate(`/investigations/${nextInv.id}`)
  }

  // Export official Incident Post-Mortem Report (.MD)
  const handleExportPostMortem = () => {
    if (!activeInvestigation) return
    const scoreVal = submissionResult?.score ?? progress.investigationScores?.[activeInvestigation.id] ?? 100
    const markdown = `# AWS SECURITY INCIDENT POST-MORTEM REPORT
================================================================================
Ticket ID:        ${activeInvestigation.ticket}
Incident:         ${activeInvestigation.title}
Classification:   ${activeInvestigation.riskLevel.toUpperCase()} RISK
Domain:           ${activeInvestigation.category}
Generated:        ${new Date().toUTCString()}
Analyst Status:   CLOSED / RESOLVED (Triage Accuracy: ${scoreVal}%)
Platform:         SeCloudive SOC Operations Center
================================================================================

1. EXECUTIVE INCIDENT SUMMARY
--------------------------------------------------------------------------------
${activeInvestigation.incidentSummary}

2. BUSINESS CONTEXT & BLAST RADIUS
--------------------------------------------------------------------------------
${activeInvestigation.businessContext}

Affected AWS Services:
${activeInvestigation.affectedServices.map(s => `* ${s}`).join('\n')}

3. FORENSIC EVIDENCE ARTIFACTS
--------------------------------------------------------------------------------
${activeInvestigation.evidence
  .map(
    (e, idx) => `### Artifact ${idx + 1}: ${e.name} (${e.type})
Analyst Context: ${e.notes}

\`\`\`json
${e.content}
\`\`\``
  )
  .join('\n\n')}

4. ROOT CAUSE ANALYSIS (RCA)
--------------------------------------------------------------------------------
${activeInvestigation.rootCauseAnalysis}

5. TECHNICAL SECURITY IMPACT
--------------------------------------------------------------------------------
${activeInvestigation.securityImpact}

6. BUSINESS & COMPLIANCE IMPACT
--------------------------------------------------------------------------------
${activeInvestigation.businessImpact}

7. STEP-BY-STEP INCIDENT REMEDIATION & CONTAINMENT PLAN
--------------------------------------------------------------------------------
${activeInvestigation.remediationPlan.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

8. AWS WELL-ARCHITECTED SECURITY BEST PRACTICES
--------------------------------------------------------------------------------
${activeInvestigation.awsBestPractices.map(bp => `* ${bp}`).join('\n')}

9. SECURITY MINDSET & LESSONS LEARNED
--------------------------------------------------------------------------------
${activeInvestigation.lessonsLearned}

================================================================================
Report digitally signed by SeCloudive SOC Incident Response Simulator
================================================================================
`
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `incident-postmortem-${activeInvestigation.ticket.toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Calculate analyst operational readiness tier
  const readinessTier = useMemo(() => {
    if (investigationCompletedCount >= 20) return 'Principal Cloud Incident Commander'
    if (investigationCompletedCount >= 15) return 'Senior Cloud Security Analyst'
    if (investigationCompletedCount >= 10) return 'Cloud Security Incident Responder'
    if (investigationCompletedCount >= 5) return 'Junior SOC Triage Specialist'
    return 'Incident Responder Trainee'
  }, [investigationCompletedCount])

  // ==========================================
  // VIEW 1: ACTIVE INVESTIGATION WORKSPACE
  // ==========================================
  if (activeInvestigation) {
    const isCompleted = progress.investigationScores?.[activeInvestigation.id] !== undefined
    const currentScore = submissionResult?.score ?? progress.investigationScores?.[activeInvestigation.id]

    return (
      <main className="page-shell investigation-workspace-page">
        {/* Breadcrumb Navigation */}
        <div className="workspace-top-bar">
          <Link to="/investigations" className="back-to-hub-link">
            <ArrowLeft size={14} />
            <span>All Incidents</span>
          </Link>
          <div className="workspace-ticket-crumb">
            <span className="crumb-ticket">{activeInvestigation.ticket}</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-cat">{activeInvestigation.category}</span>
          </div>
          <div className="workspace-status-badge">
            {showDossier ? (
              <span className="badge-resolved">
                <CheckCircle2 size={13} />
                <span>Ticket Closed ({currentScore}%)</span>
              </span>
            ) : (
              <span className="badge-in-progress">
                <Activity size={13} />
                <span>Active Triage</span>
              </span>
            )}
          </div>
        </div>

        {/* Incident Header & Executive Context */}
        <section className="incident-dossier-hero">
          <div className="incident-hero-meta">
            <span className="eyebrow-accent">
              <span className="pulse-dot" /> SECURITY INCIDENT RESPONSE OPERATIONS
            </span>
            <div className="incident-tags-row">
              <span className={`cat-pill cat-${activeInvestigation.categoryKey}`}>
                {activeInvestigation.category}
              </span>
              <span className={`risk-pill risk-${activeInvestigation.riskLevel.toLowerCase()}`}>
                <ShieldAlert size={12} />
                {activeInvestigation.riskLevel} Risk
              </span>
              <span className="ticket-id-pill">{activeInvestigation.ticket}</span>
            </div>
            <h1 className="incident-hero-title">{activeInvestigation.title}</h1>
            <p className="incident-hero-summary">{activeInvestigation.incidentSummary}</p>
          </div>

          <div className="business-context-card">
            <div className="b-context-header">
              <Flame size={15} className="b-context-icon" />
              <strong>Mission-Critical Business Context</strong>
            </div>
            <p className="b-context-text">{activeInvestigation.businessContext}</p>
            <div className="affected-services-box">
              <span className="affected-label">Affected AWS Services:</span>
              <div className="affected-pills">
                {activeInvestigation.affectedServices.map(service => (
                  <span key={service} className="service-tag">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Operational Tasks Checklist */}
        <section className="investigation-tasks-section">
          <div className="section-subhead">
            <div className="subhead-icon">
              <CheckSquare size={16} />
            </div>
            <div>
              <h3>Investigation Tasks</h3>
              <p>Systematic triage objectives for this security incident:</p>
            </div>
          </div>
          <ul className="investigation-tasks-list">
            {activeInvestigation.investigationTasks.map((task, idx) => (
              <li key={idx} className="task-item">
                <span className="task-num">0{idx + 1}</span>
                <span className="task-desc">{task}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Forensic Evidence Locker */}
        <section className="evidence-locker-section">
          <div className="section-subhead">
            <div className="subhead-icon">
              <Terminal size={16} />
            </div>
            <div>
              <h3>Forensic Evidence Locker</h3>
              <p>
                Inspect configuration snapshots, IAM policies, network maps, and CloudTrail
                telemetry extracted from the affected environment.
              </p>
            </div>
          </div>
          <EvidenceViewer evidenceList={activeInvestigation.evidence} />
        </section>

        {/* Interactive Investigation Form */}
        <section className="findings-triage-section">
          <div className="section-subhead">
            <div className="subhead-icon">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h3>Analyst Findings & Severity Escalation</h3>
              <p>
                Correlate the evidence above. Check all true vulnerabilities present in this
                incident while filtering out false alarms.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="triage-form">
            <div className="findings-checklist-box">
              <span className="checklist-legend">
                CONFIRMED FINDINGS IDENTIFICATION (Select all verified vulnerabilities)
              </span>
              <div className="findings-grid">
                {activeInvestigation.findings.map(finding => {
                  const isSelected = selectedFindingIds.includes(finding.id)
                  let feedbackClass = ''
                  if (showDossier) {
                    if (finding.isCorrect && isSelected) feedbackClass = 'finding-true-positive'
                    else if (finding.isCorrect && !isSelected)
                      feedbackClass = 'finding-missed-positive'
                    else if (!finding.isCorrect && isSelected)
                      feedbackClass = 'finding-false-positive'
                  }

                  return (
                    <div
                      key={finding.id}
                      className={`finding-card ${isSelected ? 'is-selected' : ''} ${feedbackClass}`}
                      onClick={() => toggleFinding(finding.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault()
                          toggleFinding(finding.id)
                        }
                      }}
                    >
                      <div className="finding-checkbox">
                        {isSelected ? (
                          <CheckSquare size={18} className="checkbox-active" />
                        ) : (
                          <Square size={18} className="checkbox-empty" />
                        )}
                      </div>
                      <div className="finding-content">
                        <span className="finding-label">{finding.label}</span>
                        {showDossier && (
                          <span className="finding-status-badge">
                            {finding.isCorrect ? (
                              <span className="text-emerald">✓ True Vulnerability</span>
                            ) : (
                              <span className="text-rose">✗ False Positive / Distractor</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Severity Assessment */}
            <div className="severity-triage-box">
              <span className="checklist-legend">BLAST RADIUS & SEVERITY TRIAGE</span>
              <p className="severity-prompt">
                Based on business context and potential exploit impact, what severity rating would
                you assign on this security ticket?
              </p>
              <div className="severity-selector">
                {['Critical', 'High', 'Medium'].map(sev => {
                  const isChosen = assessedSeverity.toLowerCase() === sev.toLowerCase()
                  const isCorrectSev =
                    activeInvestigation.riskLevel.toLowerCase() === sev.toLowerCase()
                  let sevClass = ''
                  if (showDossier) {
                    if (isCorrectSev) sevClass = 'sev-correct'
                    else if (isChosen && !isCorrectSev) sevClass = 'sev-incorrect'
                  }

                  return (
                    <button
                      key={sev}
                      type="button"
                      disabled={showDossier}
                      className={`severity-option sev-${sev.toLowerCase()} ${isChosen ? 'is-chosen' : ''} ${sevClass}`}
                      onClick={() => setAssessedSeverity(sev)}
                    >
                      <ShieldAlert size={14} />
                      <span>{sev}</span>
                      {showDossier && isCorrectSev && <span className="sev-match">✓ Expected</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit Action */}
            {!showDossier ? (
              <div className="triage-actions-bar">
                <button
                  type="submit"
                  disabled={!selectedFindingIds.length || !assessedSeverity}
                  className="button button-primary submit-investigation-btn"
                >
                  <ShieldCheck size={16} />
                  <span>Submit Incident Dossier for Review</span>
                </button>
                <span className="triage-hint">
                  {!selectedFindingIds.length
                    ? 'Select at least one confirmed finding'
                    : !assessedSeverity
                    ? 'Assign a severity rating to complete triage'
                    : 'Ready to submit assessment'}
                </span>
              </div>
            ) : (
              <div className="post-submission-score-banner">
                <div className="submission-score-visual">
                  <div className="score-circle-sm">
                    <strong>{currentScore}%</strong>
                    <span>Accuracy</span>
                  </div>
                  <div>
                    <h4>Investigation Dossier Accepted</h4>
                    <p>
                      Your incident assessment has been logged in the SOC audit registry with an
                      accuracy score of <strong>{currentScore}%</strong>.
                    </p>
                  </div>
                </div>

                <div className="dossier-actions-row">
                  <button
                    type="button"
                    onClick={handleExportPostMortem}
                    className="button button-ghost btn-sm export-btn"
                    title="Download complete incident post-mortem markdown"
                  >
                    <Download size={13} />
                    <span>Export Post-Mortem (.MD)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="button button-ghost btn-sm"
                  >
                    <RotateCcw size={13} />
                    <span>Re-Investigate</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="button button-primary btn-sm"
                  >
                    <span>Next Incident</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </form>
        </section>

        {/* Post-Submission Resolution Dossier */}
        {showDossier && (
          <section className="resolution-dossier-section animate-reveal">
            <div className="resolution-dossier-header">
              <div className="dossier-header-copy">
                <span className="dossier-badge">OFFICIAL INCIDENT RESOLUTION DOSSIER</span>
                <h2>Root Cause Analysis & Comprehensive Remediation</h2>
                <p>
                  Standard Operating Procedure (SOP) documentation authored by Tier-3 Incident
                  Response for ticket <strong>{activeInvestigation.ticket}</strong>.
                </p>
              </div>
              <div className="dossier-header-actions">
                <button
                  type="button"
                  onClick={handleExportPostMortem}
                  className="button button-primary btn-sm"
                >
                  <Download size={13} />
                  <span>Download Post-Mortem (.MD)</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="button button-ghost btn-sm"
                  title="Print dossier or save as PDF"
                >
                  <Printer size={13} />
                  <span>Print Dossier</span>
                </button>
              </div>
            </div>

            <div className="dossier-grid">
              {/* Root Cause Analysis */}
              <div className="dossier-card card-rca">
                <div className="dossier-card-head">
                  <Terminal size={16} className="text-cyan" />
                  <h4>Root Cause Analysis (RCA)</h4>
                </div>
                <p>{activeInvestigation.rootCauseAnalysis}</p>
              </div>

              {/* Security Impact */}
              <div className="dossier-card card-security-impact">
                <div className="dossier-card-head">
                  <ShieldAlert size={16} className="text-rose" />
                  <h4>Technical Security Impact</h4>
                </div>
                <p>{activeInvestigation.securityImpact}</p>
              </div>

              {/* Business Impact */}
              <div className="dossier-card card-business-impact">
                <div className="dossier-card-head">
                  <Flame size={16} className="text-amber" />
                  <h4>Business & Compliance Impact</h4>
                </div>
                <p>{activeInvestigation.businessImpact}</p>
              </div>

              {/* Step-by-Step Remediation Plan */}
              <div className="dossier-card card-remediation span-full">
                <div className="dossier-card-head">
                  <ShieldCheck size={16} className="text-emerald" />
                  <h4>Step-by-Step Incident Remediation Plan</h4>
                </div>
                <ol className="remediation-steps-list">
                  {activeInvestigation.remediationPlan.map((step, idx) => (
                    <li key={idx} className="remediation-step-item">
                      <span className="step-counter">Step {idx + 1}</span>
                      <p className="step-text">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* AWS Best Practices */}
              <div className="dossier-card card-best-practices">
                <div className="dossier-card-head">
                  <Award size={16} className="text-cyan" />
                  <h4>AWS Well-Architected Best Practices</h4>
                </div>
                <ul className="bullet-insights-list">
                  {activeInvestigation.awsBestPractices.map((bp, idx) => (
                    <li key={idx}>{bp}</li>
                  ))}
                </ul>
              </div>

              {/* Lessons Learned */}
              <div className="dossier-card card-lessons">
                <div className="dossier-card-head">
                  <TrendingUp size={16} className="text-purple" />
                  <h4>Security Mindset & Lessons Learned</h4>
                </div>
                <p className="lesson-text">{activeInvestigation.lessonsLearned}</p>
              </div>
            </div>
          </section>
        )}
      </main>
    )
  }

  // ==========================================
  // VIEW 2: INVESTIGATION HUB & DIRECTORY
  // ==========================================
  return (
    <main className="page-shell investigation-hub-page">
      {/* Hero / Header */}
      <div className="page-heading hub-heading">
        <div className="hub-hero-copy">
          <div className="eyebrow">
            <span className="pulse-dot" /> SOC INCIDENT RESPONSE SIMULATOR /// AWS CLOUD DEFENSE
          </div>
          <h1>
            Investigate real incidents.
            <br />
            <em>Think like a Security Analyst.</em>
          </h1>
          <p>
            Experience true security operations: inspect raw policies and CloudTrail telemetry,
            triage active exposures across 5 cloud domains, and execute defensible remediation plans.
          </p>
        </div>

        {/* Operational Telemetry Banner */}
        <div className="hub-metrics-banner">
          <div className="metric-box">
            <span className="m-label">INCIDENTS CLOSED</span>
            <strong className="m-val">
              {investigationCompletedCount} <small>/ {investigations.length}</small>
            </strong>
            <span className="m-sub">
              {Math.round((investigationCompletedCount / investigations.length) * 100)}% Resolved
            </span>
          </div>
          <div className="metric-box">
            <span className="m-label">AVG TRIAGE ACCURACY</span>
            <strong className="m-val text-cyan">{investigationAverageScore}%</strong>
            <span className="m-sub">Evidence Correlation</span>
          </div>
          <div className="metric-box">
            <span className="m-label">ANALYST READINESS</span>
            <strong className="m-val-text">{readinessTier}</strong>
            <span className="m-sub">Operations Standing</span>
          </div>
        </div>
      </div>

      {/* Category Progress Trackers */}
      <div className="category-trackers-grid">
        {investigationCategories
          .filter(c => c.key !== 'all')
          .map(cat => {
            const countData = investigationCategoryCounts[cat.key] || { total: 5, completed: 0 }
            const pct = Math.round((countData.completed / countData.total) * 100)

            return (
              <div
                key={cat.key}
                className={`cat-tracker-card ${selectedCategory === cat.key ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(cat.key)}
              >
                <div className="tracker-top">
                  <span className={`tracker-badge cat-${cat.key}`}>{cat.label}</span>
                  <span className="tracker-count">
                    {countData.completed}/{countData.total}
                  </span>
                </div>
                <div className="tracker-bar">
                  <span
                    className={`tracker-fill fill-${cat.key}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="tracker-pct">{pct}% Investigated</span>
              </div>
            )
          })}
      </div>

      {/* Search and Filters Bar */}
      <div className="hub-filter-bar">
        {/* Category Tabs */}
        <div className="hub-category-tabs" role="tablist">
          {investigationCategories.map(cat => (
            <button
              key={cat.key}
              role="tab"
              aria-selected={selectedCategory === cat.key}
              className={`hub-cat-tab ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
              <span className="tab-count">
                {cat.key === 'all'
                  ? investigations.length
                  : investigations.filter(i => i.categoryKey === cat.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search Field & Severity Filter */}
        <div className="hub-filter-controls">
          <div className="hub-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search tickets, services, or attacks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search incident investigations"
            />
          </div>

          <div className="hub-risk-select">
            <Filter size={13} className="filter-icon" />
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              aria-label="Filter by risk severity"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Investigation Cards Grid */}
      {filteredInvestigations.length === 0 ? (
        <div className="no-investigations-box">
          <ShieldAlert size={36} className="empty-icon" />
          <h3>No matching security incidents found</h3>
          <p>Try clearing your search query or selecting a different domain category.</p>
          <button
            type="button"
            className="button button-ghost btn-sm"
            onClick={() => {
              setSelectedCategory('all')
              setSelectedRisk('all')
              setSearchQuery('')
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="investigations-grid">
          {filteredInvestigations.map(inv => {
            const isCompleted = progress.investigationScores?.[inv.id] !== undefined
            const score = progress.investigationScores?.[inv.id]

            return (
              <InvestigationCard
                key={inv.id}
                investigation={inv}
                score={score}
                isCompleted={isCompleted}
              />
            )
          })}
        </div>
      )}
    </main>
  )
}
