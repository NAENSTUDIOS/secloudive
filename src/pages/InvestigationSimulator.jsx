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
  Printer,
  Crosshair,
  Zap,
  Radio,
  Briefcase,
  Circle,
  Play
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import EvidenceViewer from '../components/EvidenceViewer'
import InvestigationCard from '../components/InvestigationCard'
import InteractiveTerminal from '../components/InteractiveTerminal'
import DynamicAttackGraph from '../components/DynamicAttackGraph'
import LabNotesScratchpad from '../components/LabNotesScratchpad'
import DefenderQuoteCallout from '../components/DefenderQuoteCallout'
import { downloadHardenedTerraformModule, exportAuditPackAllFormats } from '../utils/auditExportEngine'

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
  const [selectedContainmentId, setSelectedContainmentId] = useState('')
  const [evidenceMode, setEvidenceMode] = useState('artifacts') // 'artifacts' | 'terminal' | 'runbook'
  const [completedRunbookSteps, setCompletedRunbookSteps] = useState([])
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
        setSelectedContainmentId(priorAssessment.selectedContainmentId || '')
        setShowDossier(true)
        setSubmissionResult({ score: priorAssessment.score })
      } else if (isCompleted) {
        setShowDossier(true)
        setSubmissionResult({ score: progress.investigationScores[activeInvestigation.id] })
      } else {
        setSelectedFindingIds([])
        setAssessedSeverity('')
        setSelectedContainmentId('')
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
        (inv.realWorldCase && inv.realWorldCase.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inv.mitre && (inv.mitre.techniqueId.toLowerCase().includes(searchQuery.toLowerCase()) || inv.mitre.techniqueName.toLowerCase().includes(searchQuery.toLowerCase()))) ||
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
    if (!activeInvestigation || !selectedFindingIds.length || !assessedSeverity) return
    if (activeInvestigation.containmentProtocol && !selectedContainmentId) return

    const finalScore = submitInvestigation(
      activeInvestigation,
      selectedFindingIds,
      assessedSeverity,
      selectedContainmentId
    )
    setSubmissionResult({ score: finalScore })
    setShowDossier(true)
  }

  // Retry / re-investigate
  const handleRetry = () => {
    setShowDossier(false)
    setSelectedFindingIds([])
    setAssessedSeverity('')
    setSelectedContainmentId('')
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
    const chosenContainment = activeInvestigation.containmentProtocol?.options.find(o => o.id === selectedContainmentId)
    const markdown = `# AWS SECURITY INCIDENT POST-MORTEM REPORT
================================================================================
Ticket ID:        ${activeInvestigation.ticket}
Incident:         ${activeInvestigation.title}
Classification:   ${activeInvestigation.riskLevel.toUpperCase()} RISK
Domain:           ${activeInvestigation.category}
Real Incident:    ${activeInvestigation.realWorldCase || 'Enterprise Cloud Misconfiguration'}
MITRE ATT&CK:     ${activeInvestigation.mitre ? `${activeInvestigation.mitre.techniqueId} - ${activeInvestigation.mitre.techniqueName} (${activeInvestigation.mitre.tactic})` : 'N/A'}
Generated:        ${new Date().toUTCString()}
Analyst Status:   CLOSED / RESOLVED (Triage Accuracy: ${scoreVal}%)
Platform:         SeCloudive SOC Operations Center
================================================================================

1. EXECUTIVE INCIDENT SUMMARY
--------------------------------------------------------------------------------
${activeInvestigation.incidentSummary}

2. REAL-WORLD BREACH GROUNDING & ARCHITECTURAL BLAST RADIUS
--------------------------------------------------------------------------------
${activeInvestigation.realWorldCase ? `Historical Case: ${activeInvestigation.realWorldCase}\n` : ''}${activeInvestigation.businessContext}

Affected AWS Services:
${activeInvestigation.affectedServices.map(s => `* ${s}`).join('\n')}

3. TACTICAL CONTAINMENT PROTOCOL (MINUTE-0 DECISION)
--------------------------------------------------------------------------------
${activeInvestigation.containmentProtocol ? `Scenario: ${activeInvestigation.containmentProtocol.scenario}
Selected Action: ${chosenContainment ? `${chosenContainment.label} (${chosenContainment.isCorrect ? 'ACCEPTED' : 'FLAWED'})` : 'Default Automated Quarantining'}
Rationale: ${chosenContainment ? chosenContainment.rationale : 'Standard containment procedures applied.'}` : 'Standard IAM and network isolation applied.'}

4. FORENSIC EVIDENCE ARTIFACTS
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

5. ROOT CAUSE ANALYSIS (RCA)
--------------------------------------------------------------------------------
${activeInvestigation.rootCauseAnalysis}

6. TECHNICAL SECURITY IMPACT
--------------------------------------------------------------------------------
${activeInvestigation.securityImpact}

7. BUSINESS & COMPLIANCE IMPACT
--------------------------------------------------------------------------------
${activeInvestigation.businessImpact}

8. STEP-BY-STEP INCIDENT REMEDIATION & CONTAINMENT PLAN
--------------------------------------------------------------------------------
${activeInvestigation.remediationPlan.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

9. AWS WELL-ARCHITECTED SECURITY BEST PRACTICES
--------------------------------------------------------------------------------
${activeInvestigation.awsBestPractices.map(bp => `* ${bp}`).join('\n')}

10. SECURITY MINDSET & LESSONS LEARNED
--------------------------------------------------------------------------------
${activeInvestigation.lessonsLearned}

================================================================================
Report integrity-checked by SeCloudive SOC Incident Response Simulator
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
          <div className="workspace-status-badge" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <button
              type="button"
              className="button button-ghost btn-sm"
              onClick={() => window.dispatchEvent(new CustomEvent('open-lab-notes'))}
              style={{ fontSize: '0.78rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)', padding: '4px 10px' }}
              title="Open Incident Notes & Interview Talking Points Scratchpad"
            >
              <FileText size={13} />
              <span>Notes & Scratchpad</span>
            </button>
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
              {activeInvestigation.mitre && (
                <span className="mitre-pill" title={`${activeInvestigation.mitre.techniqueName} (${activeInvestigation.mitre.tactic})`}>
                  <Crosshair size={12} />
                  MITRE {activeInvestigation.mitre.techniqueId}: {activeInvestigation.mitre.techniqueName}
                </span>
              )}
            </div>
            <h1 className="incident-hero-title">{activeInvestigation.title}</h1>
            <p className="incident-hero-summary">{activeInvestigation.incidentSummary}</p>

            {activeInvestigation.realWorldCase && (
              <div className="incident-realworld-callout">
                <div className="rw-badge">
                  <Zap size={13} className="text-amber" />
                  <span>REAL-WORLD INCIDENT MODEL</span>
                </div>
                <p className="rw-text">
                  Directly grounded in the historical <strong>{activeInvestigation.realWorldCase}</strong>. Learn the exact technical misconfigurations and forensic signals that led to real-world cloud compromise.
                </p>
              </div>
            )}
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

        {/* Forensic Evidence Locker & Interactive AWS CloudShell */}
        <section className="evidence-locker-section">
          <div className="evidence-locker-top">
            <div className="section-subhead">
              <div className="subhead-icon">
                <Terminal size={16} />
              </div>
              <div>
                <h3>Forensic Evidence Locker</h3>
                <p>
                  Inspect configuration snapshots, IAM policies, and CloudTrail telemetry, or execute
                  live AWS CLI queries inside the SOC CloudShell sandbox.
                </p>
              </div>
            </div>

            <div className="evidence-mode-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={evidenceMode === 'artifacts'}
                className={`evidence-mode-tab ${evidenceMode === 'artifacts' ? 'active' : ''}`}
                onClick={() => setEvidenceMode('artifacts')}
              >
                <FileText size={13} />
                <span>Evidence Artifacts ({activeInvestigation.evidence?.length || 0})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={evidenceMode === 'terminal'}
                className={`evidence-mode-tab ${evidenceMode === 'terminal' ? 'active' : ''}`}
                onClick={() => setEvidenceMode('terminal')}
              >
                <Terminal size={13} />
                <span>AWS CloudShell CLI (Live)</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={evidenceMode === 'runbook'}
                className={`evidence-mode-tab ${evidenceMode === 'runbook' ? 'active' : ''}`}
                onClick={() => setEvidenceMode('runbook')}
              >
                <Briefcase size={13} />
                <span>Job SOP Runbook (Step-by-Step)</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={evidenceMode === 'topology'}
                className={`evidence-mode-tab ${evidenceMode === 'topology' ? 'active' : ''}`}
                onClick={() => setEvidenceMode('topology')}
              >
                <Layers size={13} />
                <span>Live Attack Graph & SIEM</span>
              </button>
            </div>
          </div>

          {evidenceMode === 'artifacts' ? (
            <EvidenceViewer evidenceList={activeInvestigation.evidence} />
          ) : evidenceMode === 'terminal' ? (
            <InteractiveTerminal investigation={activeInvestigation} />
          ) : evidenceMode === 'topology' ? (
            <div style={{ marginTop: '12px' }}>
              <DynamicAttackGraph
                scenarioId={activeInvestigation.categoryKey || 'ssrf'}
                scenarioTitle={activeInvestigation.title}
                mode="live"
              />
            </div>
          ) : (
            <div className="incident-runbook-container animate-reveal">
              <div className="runbook-lead-banner">
                <div className="lead-role-meta">
                  <Briefcase size={14} className="text-cyan" />
                  <strong>Standard Operating Procedure (SOP) & Hands-on Job Guide</strong>
                </div>
                <p className="lead-role-desc">
                  Follow the exact 5-phase triage process used by Tier-2/Tier-3 Cloud Security Engineers.
                  Execute each command, verify the forensic telemetry, and check off each step as you proceed.
                </p>
              </div>

              <div className="runbook-steps-timeline">
                {/* Step 1: Pre-Flight Scoping */}
                <div className={`runbook-step-card ${completedRunbookSteps.includes('step-1') ? 'is-complete' : ''}`}>
                  <div className="rb-step-header">
                    <div className="rb-step-num-pill">
                      {completedRunbookSteps.includes('step-1') ? <CheckCircle2 size={13} className="text-emerald" /> : 'STEP 01'}
                    </div>
                    <h4>Pre-Flight Scoping & Caller Identity Verification</h4>
                    <button
                      type="button"
                      className="rb-complete-toggle"
                      onClick={() => setCompletedRunbookSteps(prev => prev.includes('step-1') ? prev.filter(s => s !== 'step-1') : [...prev, 'step-1'])}
                    >
                      {completedRunbookSteps.includes('step-1') ? <CheckCircle2 size={16} className="text-emerald" /> : <Circle size={16} />}
                      <span>{completedRunbookSteps.includes('step-1') ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                  <p className="rb-step-context">
                    Always establish your caller identity and security session boundary before touching any production infrastructure.
                  </p>
                  <div className="rb-command-box">
                    <code>aws sts get-caller-identity</code>
                    <button
                      type="button"
                      className="rb-run-btn"
                      onClick={() => setEvidenceMode('terminal')}
                      title="Switch to CloudShell to run this query"
                    >
                      <Play size={10} />
                      <span>Run in CloudShell</span>
                    </button>
                  </div>
                  <div className="rb-console-hint">
                    <strong>Console Alternative:</strong> AWS Management Console &gt; Top Navigation Bar &gt; Verify Account ID &amp; IAM Role: <code>SecOps-IncidentResponder</code>
                  </div>
                </div>

                {/* Step 2: Extract Configuration & Policy Telemetry */}
                <div className={`runbook-step-card ${completedRunbookSteps.includes('step-2') ? 'is-complete' : ''}`}>
                  <div className="rb-step-header">
                    <div className="rb-step-num-pill">
                      {completedRunbookSteps.includes('step-2') ? <CheckCircle2 size={13} className="text-emerald" /> : 'STEP 02'}
                    </div>
                    <h4>Extract Live Configuration & Policy Artifacts</h4>
                    <button
                      type="button"
                      className="rb-complete-toggle"
                      onClick={() => setCompletedRunbookSteps(prev => prev.includes('step-2') ? prev.filter(s => s !== 'step-2') : [...prev, 'step-2'])}
                    >
                      {completedRunbookSteps.includes('step-2') ? <CheckCircle2 size={16} className="text-emerald" /> : <Circle size={16} />}
                      <span>{completedRunbookSteps.includes('step-2') ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                  <p className="rb-step-context">
                    Pull the live JSON configuration to inspect whether wildcards (<code>*</code>), open CIDRs (<code>0.0.0.0/0</code>), or public flags are present.
                  </p>
                  <div className="rb-command-box">
                    <code>{activeInvestigation.terminalCommands?.[0]?.cmd || `aws iam get-role-policy --role-name ${activeInvestigation.ticket.toLowerCase()}-role`}</code>
                    <button
                      type="button"
                      className="rb-run-btn"
                      onClick={() => setEvidenceMode('terminal')}
                      title="Switch to CloudShell to run this query"
                    >
                      <Play size={10} />
                      <span>Run in CloudShell</span>
                    </button>
                  </div>
                  <div className="rb-console-hint">
                    <strong>Inspect Artifacts:</strong> Switch to the <em>Evidence Artifacts</em> tab above to view the complete {activeInvestigation.evidence?.length || 2} configuration files extracted from this system.
                  </div>
                </div>

                {/* Step 3: CloudTrail Forensic Log Hunting */}
                <div className={`runbook-step-card ${completedRunbookSteps.includes('step-3') ? 'is-complete' : ''}`}>
                  <div className="rb-step-header">
                    <div className="rb-step-num-pill">
                      {completedRunbookSteps.includes('step-3') ? <CheckCircle2 size={13} className="text-emerald" /> : 'STEP 03'}
                    </div>
                    <h4>Correlate CloudTrail API Activity & Source IPs</h4>
                    <button
                      type="button"
                      className="rb-complete-toggle"
                      onClick={() => setCompletedRunbookSteps(prev => prev.includes('step-3') ? prev.filter(s => s !== 'step-3') : [...prev, 'step-3'])}
                    >
                      {completedRunbookSteps.includes('step-3') ? <CheckCircle2 size={16} className="text-emerald" /> : <Circle size={16} />}
                      <span>{completedRunbookSteps.includes('step-3') ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                  <p className="rb-step-context">
                    Query CloudTrail event history to identify which principal executed the suspicious action, their source IP address, and user agent.
                  </p>
                  <div className="rb-command-box">
                    <code>{activeInvestigation.terminalCommands?.[1]?.cmd || 'aws cloudtrail lookup-events --max-results 5'}</code>
                    <button
                      type="button"
                      className="rb-run-btn"
                      onClick={() => setEvidenceMode('terminal')}
                      title="Switch to CloudShell to run this query"
                    >
                      <Play size={10} />
                      <span>Run in CloudShell</span>
                    </button>
                  </div>
                  <div className="rb-interview-tip-hint">
                    <strong>Senior Pro-Tip:</strong> Correlate the <code>sourceIPAddress</code> against your corporate VPN and AWS NAT Gateway egress IPs to distinguish attacker sessions from internal engineers.
                  </div>
                </div>

                {/* Step 4: Minute-0 Tactical Containment Action */}
                <div className={`runbook-step-card ${completedRunbookSteps.includes('step-4') ? 'is-complete' : ''}`}>
                  <div className="rb-step-header">
                    <div className="rb-step-num-pill">
                      {completedRunbookSteps.includes('step-4') ? <CheckCircle2 size={13} className="text-emerald" /> : 'STEP 04'}
                    </div>
                    <h4>Execute Minute-0 Tactical Containment (Zero Evidence Loss)</h4>
                    <button
                      type="button"
                      className="rb-complete-toggle"
                      onClick={() => setCompletedRunbookSteps(prev => prev.includes('step-4') ? prev.filter(s => s !== 'step-4') : [...prev, 'step-4'])}
                    >
                      {completedRunbookSteps.includes('step-4') ? <CheckCircle2 size={16} className="text-emerald" /> : <Circle size={16} />}
                      <span>{completedRunbookSteps.includes('step-4') ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                  <p className="rb-step-context">
                    Apply immediate isolation to stop attacker lateral movement. Scroll to the <strong>Tactical Containment Protocol</strong> section below to select and execute the optimal minute-0 procedure.
                  </p>
                  <div className="rb-pitfall-alert">
                    <AlertTriangle size={13} className="text-rose" />
                    <span><strong>Critical Pitfall:</strong> Do not delete the IAM user or EC2 instance! Deleting resources erases ephemeral audit logs and destroys forensic evidence needed for compliance reporting.</span>
                  </div>
                </div>

                {/* Step 5: Complete Triage & Submit Post-Mortem */}
                <div className={`runbook-step-card ${completedRunbookSteps.includes('step-5') ? 'is-complete' : ''}`}>
                  <div className="rb-step-header">
                    <div className="rb-step-num-pill">
                      {completedRunbookSteps.includes('step-5') ? <CheckCircle2 size={13} className="text-emerald" /> : 'STEP 05'}
                    </div>
                    <h4>Confirm Findings, Assign Severity & Close Ticket</h4>
                    <button
                      type="button"
                      className="rb-complete-toggle"
                      onClick={() => setCompletedRunbookSteps(prev => prev.includes('step-5') ? prev.filter(s => s !== 'step-5') : [...prev, 'step-5'])}
                    >
                      {completedRunbookSteps.includes('step-5') ? <CheckCircle2 size={16} className="text-emerald" /> : <Circle size={16} />}
                      <span>{completedRunbookSteps.includes('step-5') ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                  <p className="rb-step-context">
                    Select confirmed vulnerabilities in the checklist below, assign the incident severity rating, and submit the dossier to unlock the Tier-3 Root Cause Analysis (RCA) and export the Post-Mortem.
                  </p>
                </div>
              </div>
            </div>
          )}
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

            {/* Tactical Containment Protocol */}
            {activeInvestigation.containmentProtocol && (
              <div className="containment-protocol-box">
                <span className="checklist-legend">
                  TACTICAL CONTAINMENT PROTOCOL (Minute-0 Operational Decision)
                </span>
                <p className="containment-scenario-text">
                  {activeInvestigation.containmentProtocol.scenario}
                </p>
                <div className="containment-options-grid">
                  {activeInvestigation.containmentProtocol.options.map(option => {
                    const isChosen = selectedContainmentId === option.id
                    let feedbackClass = ''
                    if (showDossier) {
                      if (option.isCorrect) feedbackClass = 'containment-correct'
                      else if (isChosen && !option.isCorrect) feedbackClass = 'containment-incorrect'
                    }

                    return (
                      <div
                        key={option.id}
                        className={`containment-option-card ${isChosen ? 'is-chosen' : ''} ${feedbackClass}`}
                        onClick={() => !showDossier && setSelectedContainmentId(option.id)}
                        role="radio"
                        aria-checked={isChosen}
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault()
                            if (!showDossier) setSelectedContainmentId(option.id)
                          }
                        }}
                      >
                        <div className="containment-radio-indicator">
                          <span className={`radio-dot ${isChosen ? 'checked' : ''}`} />
                        </div>
                        <div className="containment-copy">
                          <strong className="containment-title">{option.label}</strong>
                          {showDossier && (
                            <div className="containment-rationale">
                              {option.isCorrect ? (
                                <span className="rationale-tag correct">✓ Optimal SecOps Procedure</span>
                              ) : (
                                <span className="rationale-tag flawed">⚠ Operational Antipattern</span>
                              )}
                              <p className="rationale-text">{option.rationale}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

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
                  disabled={
                    !selectedFindingIds.length ||
                    !assessedSeverity ||
                    (activeInvestigation.containmentProtocol && !selectedContainmentId)
                  }
                  className="button button-primary submit-investigation-btn"
                >
                  <ShieldCheck size={16} />
                  <span>Submit Incident Dossier for Review</span>
                </button>
                <span className="triage-hint">
                  {!selectedFindingIds.length
                    ? 'Select at least one confirmed finding'
                    : !assessedSeverity
                    ? 'Assign a severity rating'
                    : activeInvestigation.containmentProtocol && !selectedContainmentId
                    ? 'Select a Minute-0 Containment action'
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

                <div className="dossier-actions-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => downloadHardenedTerraformModule({ scenarioId: activeInvestigation.id, scenarioTitle: activeInvestigation.title })}
                    className="button button-ghost btn-sm"
                    style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '5px' }}
                    title="Download auto-remediated Terraform blueprint with Checkov & tfsec GitHub Actions workflow"
                  >
                    <Download size={13} />
                    <span>Download Hardened Terraform Module</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => exportAuditPackAllFormats({ scenario: activeInvestigation, learnerName: 'Incident Responder' })}
                    className="button button-ghost btn-sm"
                    style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '5px' }}
                    title="Export complete JSON with HMAC-SHA256 integrity envelope, PDF dossier, and Markdown summary"
                  >
                    <FileText size={13} />
                    <span>Export Audit Pack (Integrity-Checked)</span>
                  </button>
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
              {/* MITRE ATT&CK Mapping Card */}
              {activeInvestigation.mitre && (
                <div className="dossier-card card-mitre">
                  <div className="dossier-card-head">
                    <Crosshair size={16} className="text-cyan" />
                    <h4>MITRE ATT&CK® for Cloud Matrix</h4>
                  </div>
                  <div className="mitre-dossier-content">
                    <div className="mitre-meta-row">
                      <span className="mitre-label">Tactic:</span>
                      <strong className="mitre-value text-cyan">{activeInvestigation.mitre.tactic}</strong>
                    </div>
                    <div className="mitre-meta-row">
                      <span className="mitre-label">Technique:</span>
                      <strong className="mitre-value">{activeInvestigation.mitre.techniqueId} - {activeInvestigation.mitre.techniqueName}</strong>
                    </div>
                    <p className="mitre-expl">
                      Adversaries leverage this technique to bypass conventional security boundaries in AWS environments. Mitigation requires strict principle of least privilege and real-time detection telemetry.
                    </p>
                  </div>
                </div>
              )}

              {/* Real World Breach Grounding Card */}
              {activeInvestigation.realWorldCase && (
                <div className="dossier-card card-realworld">
                  <div className="dossier-card-head">
                    <Zap size={16} className="text-amber" />
                    <h4>Real-World Breach Analysis</h4>
                  </div>
                  <div className="realworld-dossier-content">
                    <strong className="rw-case-title">{activeInvestigation.realWorldCase}</strong>
                    <p className="rw-case-expl">
                      This incident mirrors actual multi-million dollar data breaches where adversaries exploited this precise combination of AWS IAM, networking, or S3 misconfigurations.
                    </p>
                  </div>
                </div>
              )}

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

        {/* Student In-Lab Notes & Incident Scratchpad Drawer */}
        <LabNotesScratchpad
          contextId={activeInvestigation.id}
          contextTitle={`${activeInvestigation.ticket}: ${activeInvestigation.title}`}
          contextType="Security Incident Response Ticket"
          targetServices={activeInvestigation.affectedServices}
          mitreTechnique={activeInvestigation.mitre ? `${activeInvestigation.mitre.techniqueId} (${activeInvestigation.mitre.techniqueName})` : null}
        />
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

      {/* Motivational Security Callout */}
      <DefenderQuoteCallout 
        category="tactical" 
        autoCycle={true} 
        cycleIntervalMs={14000} 
        className="investigation-hub-quote"
      />

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
