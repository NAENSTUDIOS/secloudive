import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  CheckCircle2,
  Circle,
  Clock,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Flame,
  Award,
  Download,
  AlertTriangle,
  Play,
  Crosshair,
  Zap,
  Cpu
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import JobProcessFramework from '../components/JobProcessFramework'

export default function RealLabs() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    realLabs,
    jobRoles,
    progress,
    toggleLabStep,
    resetLabProgress,
    completedLabsCount,
    completedLabStepsCount
  } = useChallenges()

  // Directory filter state
  const [selectedRole, setSelectedRole] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showProcessFramework, setShowProcessFramework] = useState(false)

  // Active Lab Player state
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [workflowTab, setWorkflowTab] = useState('cli') // 'cli' | 'console'
  const [copiedCmd, setCopiedCmd] = useState(false)
  const [simulatedExecution, setSimulatedExecution] = useState(null)

  // Identify active lab if id in URL
  const activeLab = useMemo(() => {
    if (!id) return null
    return realLabs.find(lab => lab.id === id) || realLabs[0]
  }, [id, realLabs])

  // Filtered labs for directory
  const filteredLabs = useMemo(() => {
    return realLabs.filter(lab => {
      const matchesRole = selectedRole === 'all' || lab.roleKey === selectedRole
      const matchesSearch =
        !searchQuery ||
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.labNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.scenarioSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.targetServices.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesRole && matchesSearch
    })
  }, [realLabs, selectedRole, searchQuery])

  // Handle command copy
  const handleCopyCommand = cmd => {
    navigator.clipboard.writeText(cmd)
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 2000)
  }

  // Handle live simulated execution in sandbox
  const handleSimulateExecution = step => {
    setSimulatedExecution({
      cmd: step.cliCommand,
      output: step.expectedOutput,
      timestamp: new Date().toLocaleTimeString()
    })
  }

  // Export official Job Runbook & Proof Report (.MD)
  const handleExportLabReport = () => {
    if (!activeLab) return
    const completedStepIds = progress.labSteps?.[activeLab.id] || []
    const completionPct = Math.round((completedStepIds.length / activeLab.steps.length) * 100)

    const markdown = `# CLOUD SECURITY JOB RUNBOOK & REMEDIATION PROOF REPORT
================================================================================
Lab Reference:    ${activeLab.labNumber}
Title:            ${activeLab.title}
Job Role:         ${activeLab.jobRole}
Target System:    ${activeLab.organization}
MITRE ATT&CK:     ${activeLab.mitreTechnique}
Completed:        ${new Date().toUTCString()}
Status:           ${completionPct === 100 ? 'VERIFIED & CLOSED' : 'IN PROGRESS'} (${completionPct}% Steps Completed)
Platform:         SeCloudive Cloud Security Career Development Engine
================================================================================

1. EXECUTIVE INCIDENT SCENARIO
--------------------------------------------------------------------------------
${activeLab.scenarioSummary}

Target AWS Services:
${activeLab.targetServices.map(s => `* ${s}`).join('\n')}

2. STANDARD OPERATING PROCEDURE (SOP) EXECUTION LOG
--------------------------------------------------------------------------------
${activeLab.steps
  .map(
    (step, idx) => `### Step ${idx + 1}: ${step.title} (${step.phase})
Status: ${completedStepIds.includes(step.stepId) ? '[X] COMPLETED & VERIFIED' : '[ ] PENDING EXECUTION'}

* Job Context:
  ${step.jobContext}

* AWS Management Console Navigation:
  ${step.consolePath}

* Exact AWS CLI Command:
  \`\`\`bash
  ${step.cliCommand}
  \`\`\`

* Expected Forensic Signal / Verification:
  \`\`\`json
  ${step.expectedOutput}
  \`\`\`

* Senior Engineer Interview Tip:
  ${step.interviewTip}

* Production Pitfall to Avoid:
  ${step.pitfallWarning}
`
  )
  .join('\n\n')}

================================================================================
Digitally verified through SeCloudive Hands-On Cloud Security Job Labs
================================================================================
`
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cloud-job-runbook-${activeLab.labNumber.toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // ==========================================
  // VIEW 1: ACTIVE LAB PLAYER
  // ==========================================
  if (activeLab) {
    const completedStepIds = progress.labSteps?.[activeLab.id] || []
    const currentStep = activeLab.steps[activeStepIndex] || activeLab.steps[0]
    const isStepDone = completedStepIds.includes(currentStep.stepId)
    const isAllDone = completedStepIds.length === activeLab.steps.length
    const progressPct = Math.round((completedStepIds.length / activeLab.steps.length) * 100)

    return (
      <main className="page-shell real-lab-player-page">
        {/* Navigation Breadcrumb */}
        <div className="workspace-top-bar">
          <Link to="/labs" className="back-to-hub-link">
            <ArrowLeft size={14} />
            <span>All Job Labs</span>
          </Link>
          <div className="workspace-ticket-crumb">
            <span className="crumb-ticket">{activeLab.labNumber}</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-cat">{activeLab.jobRole}</span>
          </div>
          <div className="workspace-status-badge">
            {isAllDone ? (
              <span className="badge-resolved">
                <CheckCircle2 size={13} />
                <span>Lab Mastered (100%)</span>
              </span>
            ) : (
              <span className="badge-in-progress">
                <Clock size={13} />
                <span>{progressPct}% Completed</span>
              </span>
            )}
          </div>
        </div>

        {/* Lab Hero Dossier */}
        <section className="lab-hero-dossier">
          <div className="lab-hero-meta">
            <div className="lab-tags-row">
              <span className="lab-num-pill">{activeLab.labNumber}</span>
              <span className="lab-role-pill">
                <Briefcase size={12} />
                {activeLab.jobRole}
              </span>
              <span className="lab-mitre-pill">
                <Crosshair size={12} />
                MITRE {activeLab.mitreTechnique}
              </span>
            </div>
            <h1 className="lab-hero-title">{activeLab.title}</h1>
            <p className="lab-hero-summary">{activeLab.scenarioSummary}</p>
          </div>

          <div className="lab-context-card">
            <div className="context-item">
              <span className="context-label">Target Organization:</span>
              <strong className="context-val text-amber">{activeLab.organization}</strong>
            </div>
            <div className="context-item">
              <span className="context-label">Estimated SOP Duration:</span>
              <strong className="context-val">{activeLab.estimatedMinutes} Minutes</strong>
            </div>
            <div className="context-item">
              <span className="context-label">Target AWS Services:</span>
              <div className="context-services">
                {activeLab.targetServices.map(svc => (
                  <span key={svc} className="service-tag">
                    {svc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Navigator Bar */}
        <section className="lab-steps-navigator">
          <div className="navigator-header">
            <span className="nav-title">SOP EXECUTION TIMELINE</span>
            <span className="nav-progress-text">
              {completedStepIds.length} of {activeLab.steps.length} Steps Mastered ({progressPct}%)
            </span>
          </div>
          <div className="steps-chips-bar" role="tablist">
            {activeLab.steps.map((step, idx) => {
              const isSelected = activeStepIndex === idx
              const isCompleted = completedStepIds.includes(step.stepId)

              return (
                <button
                  key={step.stepId}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`step-chip-btn ${isSelected ? 'is-active' : ''} ${isCompleted ? 'is-complete' : ''}`}
                  onClick={() => {
                    setActiveStepIndex(idx)
                    setSimulatedExecution(null)
                  }}
                >
                  <span className="chip-step-num">
                    {isCompleted ? <CheckCircle2 size={13} className="text-emerald" /> : `0${idx + 1}`}
                  </span>
                  <span className="chip-step-title">{step.title}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Active Step Hands-On Guide */}
        <section className="active-step-guide-card">
          <div className="active-step-header">
            <div className="step-phase-badge">
              <span className="pulse-dot" />
              <span>{currentStep.phase}</span>
            </div>
            <h2 className="active-step-title">
              Step 0{activeStepIndex + 1}: {currentStep.title}
            </h2>
            <p className="active-step-context">{currentStep.jobContext}</p>
          </div>

          {/* Workflow Mode Tabs (CLI vs Console) */}
          <div className="step-workflow-box">
            <div className="workflow-tab-bar">
              <button
                type="button"
                className={`wf-tab ${workflowTab === 'cli' ? 'active' : ''}`}
                onClick={() => setWorkflowTab('cli')}
              >
                <Terminal size={14} />
                <span>AWS CLI Workflow (Production Speed)</span>
              </button>
              <button
                type="button"
                className={`wf-tab ${workflowTab === 'console' ? 'active' : ''}`}
                onClick={() => setWorkflowTab('console')}
              >
                <Layers size={14} />
                <span>AWS Management Console Navigation</span>
              </button>
            </div>

            {/* CLI View */}
            {workflowTab === 'cli' ? (
              <div className="workflow-content wf-cli-content">
                <div className="cli-command-box">
                  <div className="cli-box-header">
                    <span className="cli-prompt-label">Exact AWS CLI Execution Command:</span>
                    <div className="cli-box-actions">
                      <button
                        type="button"
                        className="cli-action-btn"
                        onClick={() => handleCopyCommand(currentStep.cliCommand)}
                        title="Copy command to clipboard"
                      >
                        {copiedCmd ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                        <span>{copiedCmd ? 'Copied' : 'Copy Command'}</span>
                      </button>
                      <button
                        type="button"
                        className="cli-action-btn btn-execute-sim"
                        onClick={() => handleSimulateExecution(currentStep)}
                        title="Execute in the live sandbox"
                      >
                        <Play size={11} />
                        <span>Run in CloudShell</span>
                      </button>
                    </div>
                  </div>
                  <pre className="cli-command-pre">
                    <code>{currentStep.cliCommand}</code>
                  </pre>
                </div>

                {/* Simulated Terminal Sandbox Output */}
                {simulatedExecution ? (
                  <div className="simulated-terminal-box animate-reveal">
                    <div className="sim-term-header">
                      <span className="sim-term-title">
                        <Terminal size={12} className="text-cyan" />
                        <span>AWS CloudShell Sandbox Response [{simulatedExecution.timestamp}]</span>
                      </span>
                    </div>
                    <pre className="sim-term-output">
                      <code>{simulatedExecution.output}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="expected-output-box">
                    <span className="expected-label">Expected API Response / Forensic Signal:</span>
                    <pre className="expected-pre">
                      <code>{currentStep.expectedOutput}</code>
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              /* Console View */
              <div className="workflow-content wf-console-content">
                <div className="console-path-card">
                  <span className="path-label">AWS Console Navigation Path:</span>
                  <p className="console-path-text">{currentStep.consolePath}</p>
                </div>
                <div className="expected-output-box">
                  <span className="expected-label">Visual Verification On-Screen:</span>
                  <pre className="expected-pre">
                    <code>{currentStep.expectedOutput}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Senior Insights & Pitfalls */}
          <div className="step-insights-grid">
            <div className="insight-card card-interview-tip">
              <div className="insight-head">
                <Award size={15} className="text-cyan" />
                <strong>Senior Engineer Interview Tip</strong>
              </div>
              <p>{currentStep.interviewTip}</p>
            </div>

            <div className="insight-card card-pitfall">
              <div className="insight-head">
                <AlertTriangle size={15} className="text-rose" />
                <strong>Production Pitfall to Avoid</strong>
              </div>
              <p>{currentStep.pitfallWarning}</p>
            </div>
          </div>

          {/* Step Action Controls */}
          <div className="step-actions-footer">
            <button
              type="button"
              className={`button ${isStepDone ? 'button-secondary' : 'button-primary'} mark-step-btn`}
              onClick={() => toggleLabStep(activeLab.id, currentStep.stepId)}
            >
              {isStepDone ? (
                <>
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>Step Completed (Click to Unmark)</span>
                </>
              ) : (
                <>
                  <Circle size={16} />
                  <span>Mark Step as Completed</span>
                </>
              )}
            </button>

            <div className="step-nav-buttons">
              <button
                type="button"
                className="button button-ghost btn-sm"
                disabled={activeStepIndex === 0}
                onClick={() => {
                  setActiveStepIndex(prev => Math.max(0, prev - 1))
                  setSimulatedExecution(null)
                }}
              >
                <ArrowLeft size={13} />
                <span>Previous Step</span>
              </button>
              <button
                type="button"
                className="button button-primary btn-sm"
                disabled={activeStepIndex === activeLab.steps.length - 1}
                onClick={() => {
                  setActiveStepIndex(prev => Math.min(activeLab.steps.length - 1, prev + 1))
                  setSimulatedExecution(null)
                }}
              >
                <span>Next Step</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </section>

        {/* Lab Completion Dossier */}
        {isAllDone && (
          <section className="lab-completed-banner animate-reveal">
            <div className="completed-badge-icon">
              <ShieldCheck size={32} className="text-emerald" />
            </div>
            <div className="completed-copy">
              <h3>Lab Mastered: {activeLab.title}</h3>
              <p>
                You have successfully executed all 6 stages of this production standard operating procedure.
                Your practice record has been logged to your SOC profile.
              </p>
            </div>
            <div className="completed-actions">
              <button
                type="button"
                className="button button-primary btn-sm"
                onClick={handleExportLabReport}
              >
                <Download size={13} />
                <span>Export Job Runbook (.MD)</span>
              </button>
              <button
                type="button"
                className="button button-ghost btn-sm"
                onClick={() => resetLabProgress(activeLab.id)}
              >
                <RotateCcw size={13} />
                <span>Reset Lab</span>
              </button>
            </div>
          </section>
        )}
      </main>
    )
  }

  // ==========================================
  // VIEW 2: LABS DIRECTORY & HUB
  // ==========================================
  return (
    <main className="page-shell real-labs-hub-page">
      {/* Hero Header */}
      <div className="page-heading hub-heading">
        <div className="hub-hero-copy">
          <div className="eyebrow">
            <span className="pulse-dot" /> CLOUD SECURITY JOB RUNBOOKS & HANDS-ON LABS
          </div>
          <h1>
            Practice real cloud jobs.
            <br />
            <em>Master every step of the process.</em>
          </h1>
          <p>
            Step-by-step Standard Operating Procedures (SOPs) executed by Cloud Security Engineers,
            SecOps Responders, and DevSecOps professionals in enterprise production environments.
          </p>
          <div className="hero-cta-row">
            <button
              type="button"
              className="button button-ghost btn-sm"
              onClick={() => setShowProcessFramework(prev => !prev)}
            >
              <Briefcase size={13} />
              <span>{showProcessFramework ? 'Hide SOP Process Guide' : 'View 6-Stage Job SOP Framework'}</span>
            </button>
          </div>
        </div>

        {/* Metrics Banner */}
        <div className="hub-metrics-banner">
          <div className="metric-box">
            <span className="m-label">LABS MASTERED</span>
            <strong className="m-val">
              {completedLabsCount} <small>/ {realLabs.length}</small>
            </strong>
            <span className="m-sub">Production SOPs</span>
          </div>
          <div className="metric-box">
            <span className="m-label">STEPS COMPLETED</span>
            <strong className="m-val text-cyan">{completedLabStepsCount}</strong>
            <span className="m-sub">Guided Actions Verified</span>
          </div>
          <div className="metric-box">
            <span className="m-label">OPERATING STANDARD</span>
            <strong className="m-val-text">AWS Well-Architected</strong>
            <span className="m-sub">SOC2 / PCI-DSS Aligned</span>
          </div>
        </div>
      </div>

      {/* Optional Job Process Framework Section */}
      {showProcessFramework && (
        <div className="embedded-framework-container animate-reveal">
          <JobProcessFramework />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="hub-filter-bar">
        <div className="hub-category-tabs" role="tablist">
          {jobRoles.map(role => (
            <button
              key={role.key}
              role="tab"
              aria-selected={selectedRole === role.key}
              className={`hub-cat-tab ${selectedRole === role.key ? 'active' : ''}`}
              onClick={() => setSelectedRole(role.key)}
            >
              {role.label}
              <span className="tab-count">
                {role.key === 'all'
                  ? realLabs.length
                  : realLabs.filter(l => l.roleKey === role.key).length}
              </span>
            </button>
          ))}
        </div>

        <div className="hub-filter-controls">
          <div className="hub-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search labs by service, role, or attack..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search cloud security job labs"
            />
          </div>
        </div>
      </div>

      {/* Labs Cards Grid */}
      <div className="labs-grid">
        {filteredLabs.map(lab => {
          const completedStepIds = progress.labSteps?.[lab.id] || []
          const isDone = completedStepIds.length === lab.steps.length
          const pct = Math.round((completedStepIds.length / lab.steps.length) * 100)

          return (
            <article key={lab.id} className={`lab-card ${isDone ? 'is-complete' : ''}`}>
              <div className="lab-card-header">
                <div className="lab-card-badges">
                  <span className="lab-num-tag">{lab.labNumber}</span>
                  <span className="lab-role-tag">{lab.jobRole}</span>
                </div>
                <span className="lab-mitre-tag">
                  <Crosshair size={10} />
                  {lab.mitreTechnique.split('-')[0].trim()}
                </span>
              </div>

              <div className="lab-card-body">
                <h3 className="lab-card-title">
                  <Link to={`/labs/${lab.id}`}>{lab.title}</Link>
                </h3>
                <div className="lab-org-sub">
                  <Briefcase size={11} className="text-amber" />
                  <span>{lab.organization}</span>
                </div>
                <p className="lab-card-summary">{lab.scenarioSummary}</p>

                <div className="lab-services-list">
                  {lab.targetServices.map(svc => (
                    <span key={svc} className="service-tag">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lab-card-footer">
                <div className="lab-footer-progress">
                  <div className="progress-bar-track">
                    <span className="progress-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="progress-text">
                    {completedStepIds.length}/{lab.steps.length} Steps ({pct}%)
                  </span>
                </div>

                <Link to={`/labs/${lab.id}`} className="button button-primary btn-sm lab-launch-btn">
                  <span>{isDone ? 'Review SOP' : 'Start Lab'}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
