import { useState, useMemo, useEffect } from 'react'
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
  Cpu,
  DollarSign,
  FileCode2,
  FileText,
  Globe,
  Compass,
  Sparkles
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import JobProcessFramework from '../components/JobProcessFramework'
import SafeLabCostCalculator from '../components/SafeLabCostCalculator'
import TerminalPane from '../components/TerminalPane'
import LabNotesScratchpad from '../components/LabNotesScratchpad'
import DefenderQuoteCallout from '../components/DefenderQuoteCallout'
import MultiCloudProviderFilter from '../components/MultiCloudProviderFilter'
import { getLabIacTemplate } from '../data/labIacTemplates'
import { 
  CLOUD_PROVIDERS, 
  getMultiCloudCliForStep, 
  getMultiCloudConsoleForStep 
} from '../data/multiCloudResources'

export default function RealLabs() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    realLabs = [],
    masterSafeLabs = [],
    jobRoles,
    progress,
    toggleLabStep,
    resetLabProgress,
    completedLabsCount,
    completedLabStepsCount,
    selectedCloudProvider = 'all',
    setSelectedCloudProvider
  } = useChallenges()

  // Adapt masterSafeLabs to match RealLabs interface
  const combinedLabs = useMemo(() => {
    const safeLabsAdapted = (masterSafeLabs || []).map(sl => ({
      id: sl.id,
      labNumber: sl.id,
      title: sl.title,
      roleTitle: 'Cloud Security Engineer',
      roleKey: 'cloud-security-engineer',
      difficulty: 'Intermediate',
      estimatedMinutes: parseInt(sl.time) || 25,
      targetServices: sl.services || ['AWS IAM', 'Amazon S3'],
      scenarioSummary: sl.objective,
      prerequisites: [sl.prereqs || 'AWS CLI v2 with authenticated profile'],
      freeTierCompatible: sl.freeTier,
      costEstimate: sl.cost,
      steps: (sl.steps || []).map((stepText, idx) => ({
        stepId: `${sl.id}-step-${idx + 1}`,
        stepNumber: idx + 1,
        title: `Task ${idx + 1}`,
        instructions: stepText,
        cliCommand: idx === (sl.steps.length - 1) ? sl.teardownCommand : `# Step ${idx + 1}\n# ${stepText}`,
        consolePath: 'AWS Management Console',
        expectedOutput: `Validation Check: Step ${idx + 1} completed and verified.`,
        interviewTip: 'Always document the forensic evidence before applying teardown logic.',
        pitfallWarning: 'Never leave unmanaged VPC endpoints or NAT gateways running overnight.'
      })),
      verification: sl.verification,
      securityValidation: sl.securityValidation,
      cleanupChecklist: sl.cleanupChecklist,
      teardownCommand: sl.teardownCommand,
      auditLogRequirement: sl.auditLogRequirement,
      zeroCostVerification: sl.zeroCostVerification
    }))

    const existingIds = new Set((realLabs || []).map(l => l.id))
    const uniqueSafeLabs = safeLabsAdapted.filter(sl => !existingIds.has(sl.id))
    return [...(realLabs || []), ...uniqueSafeLabs]
  }, [realLabs, masterSafeLabs])

  // Directory filter state
  const [selectedRole, setSelectedRole] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showProcessFramework, setShowProcessFramework] = useState(false)
  const [showCostCalculator, setShowCostCalculator] = useState(false)

  // Active Lab Player state
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [workflowTab, setWorkflowTab] = useState('cli') // 'cli' | 'terminal' | 'console' | 'iac'
  const [copiedCmd, setCopiedCmd] = useState(false)
  const [copiedIac, setCopiedIac] = useState(false)
  const [iacFormat, setIacFormat] = useState('terraform') // 'terraform' | 'cloudformation'
  const [simulatedExecution, setSimulatedExecution] = useState(null)
  const [activeCliCloud, setActiveCliCloud] = useState(() => (
    selectedCloudProvider && selectedCloudProvider !== 'all' ? selectedCloudProvider : 'aws'
  ))
  const [showAllCloudsSideBySide, setShowAllCloudsSideBySide] = useState(false)

  useEffect(() => {
    if (selectedCloudProvider && selectedCloudProvider !== 'all') {
      setActiveCliCloud(selectedCloudProvider)
    }
  }, [selectedCloudProvider])

  const handleDownloadIacFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyIac = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedIac(true)
    setTimeout(() => setCopiedIac(false), 2000)
  }

  // Identify active lab if id in URL
  const activeLab = useMemo(() => {
    if (!id) return null
    return combinedLabs.find(lab => lab.id === id) || combinedLabs[0]
  }, [id, combinedLabs])

  // Filtered labs for directory
  const filteredLabs = useMemo(() => {
    return combinedLabs.filter(lab => {
      const matchesRole = selectedRole === 'all' || lab.roleKey === selectedRole
      const matchesSearch =
        !searchQuery ||
        lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.labNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.scenarioSummary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.targetServices?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesRole && matchesSearch
    })
  }, [combinedLabs, selectedRole, searchQuery])

  const [pendingTerminalCmd, setPendingTerminalCmd] = useState('')

  // Handle command copy
  const handleCopyCommand = cmd => {
    navigator.clipboard.writeText(cmd)
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 2000)
  }

  // Handle live simulated execution in sandbox terminal
  const handleSimulateExecution = (step, specificCmd) => {
    const cmd = specificCmd || step.cliCommand
    setPendingTerminalCmd(cmd)
    setWorkflowTab('terminal')
    setSimulatedExecution({
      cmd: cmd,
      output: step.expectedOutput,
      timestamp: new Date().toLocaleTimeString()
    })
  }

  // Export official Job Runbook & Proof Report (.MD)
  const handleExportLabReport = () => {
    if (!activeLab) return
    const labSteps = activeLab.steps || []
    const completedStepIds = progress.labSteps?.[activeLab.id] || []
    const completionPct = Math.round((completedStepIds.length / Math.max(1, labSteps.length)) * 100)

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
${(activeLab.targetServices || []).map(s => `* ${s}`).join('\n')}

2. STANDARD OPERATING PROCEDURE (SOP) EXECUTION LOG
--------------------------------------------------------------------------------
${labSteps
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
    const labSteps = activeLab.steps || []
    const completedStepIds = progress.labSteps?.[activeLab.id] || []
    const currentStep = labSteps[activeStepIndex] || labSteps[0] || {
      stepId: 's1',
      phase: 'Stage 1: Pre-Flight Scoping',
      title: 'Scoping & Verification',
      jobContext: 'Inspect the target environment and verify caller identity.',
      consolePath: 'AWS Console > IAM',
      cliCommand: 'aws sts get-caller-identity',
      expectedOutput: '{}',
      interviewTip: 'Always verify identity before state changes.',
      pitfallWarning: 'Do not modify production without change approval.'
    }
    const isStepDone = completedStepIds.includes(currentStep.stepId)
    const isAllDone = labSteps.length > 0 && completedStepIds.length === labSteps.length
    const progressPct = Math.round((completedStepIds.length / Math.max(1, labSteps.length)) * 100)

    const multiCloudCommands = getMultiCloudCliForStep(currentStep, activeLab)
    const multiCloudConsole = getMultiCloudConsoleForStep(currentStep, activeLab)
    const currentActiveProvider = CLOUD_PROVIDERS.find(p => p.id === activeCliCloud) || CLOUD_PROVIDERS[0]
    const activeCliData = multiCloudCommands[activeCliCloud] || multiCloudCommands.aws

    return (
      <main className="page-shell real-lab-player-page">
        {/* Navigation Breadcrumb */}
        <div className="workspace-top-bar">
          <Link to="/#structured-path" className="back-to-hub-link" style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)', background: 'rgba(56, 189, 248, 0.08)' }}>
            <Compass size={14} />
            <span>Structured Path</span>
          </Link>
          <Link to="/labs" className="back-to-hub-link">
            <ArrowLeft size={14} />
            <span>All Job Labs</span>
          </Link>
          <div className="workspace-ticket-crumb">
            <span className="crumb-ticket">{activeLab.labNumber}</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-cat">{activeLab.jobRole}</span>
          </div>
          <div className="workspace-cloud-filter-wrapper">
            <MultiCloudProviderFilter compact={true} />
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
            <div className="context-item" style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="button button-ghost btn-sm"
                onClick={() => setShowCostCalculator(prev => !prev)}
                style={{ fontSize: '0.78rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
              >
                <DollarSign size={13} />
                <span>{showCostCalculator ? 'Hide Cost & Teardown Sentinel' : 'AWS Cost & 1-Click Teardown'}</span>
              </button>
              <button
                type="button"
                className="button button-ghost btn-sm"
                onClick={() => window.dispatchEvent(new CustomEvent('open-lab-notes'))}
                style={{ fontSize: '0.78rem', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                title="Open In-Lab Technical Notes & Interview Talking Points Scratchpad"
              >
                <FileText size={13} />
                <span>My In-Lab Notes</span>
              </button>
            </div>
          </div>
        </section>

        {/* Embedded Safe AWS Lab Cost Calculator */}
        {showCostCalculator && (
          <SafeLabCostCalculator
            activeLabId={activeLab.id}
            onClose={() => setShowCostCalculator(false)}
          />
        )}

        {/* Step-by-Step Navigator Bar */}
        <section className="lab-steps-navigator">
          <div className="navigator-header">
            <span className="nav-title">SOP EXECUTION TIMELINE</span>
            <span className="nav-progress-text">
              {completedStepIds.length} of {labSteps.length} Steps Mastered ({progressPct}%)
            </span>
          </div>
          <div className="steps-chips-bar" role="tablist">
            {labSteps.map((step, idx) => {
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
                className={`wf-tab ${workflowTab === 'terminal' ? 'active' : ''}`}
                onClick={() => setWorkflowTab('terminal')}
                style={{ borderColor: workflowTab === 'terminal' ? '#38bdf8' : undefined }}
              >
                <Cpu size={14} className="text-cyan" />
                <span>Interactive CloudShell Terminal</span>
              </button>
              <button
                type="button"
                className={`wf-tab ${workflowTab === 'console' ? 'active' : ''}`}
                onClick={() => setWorkflowTab('console')}
              >
                <Layers size={14} />
                <span>AWS Management Console Navigation</span>
              </button>
              <button
                type="button"
                className={`wf-tab ${workflowTab === 'iac' ? 'active' : ''}`}
                onClick={() => setWorkflowTab('iac')}
                style={{ borderColor: workflowTab === 'iac' ? '#10b981' : undefined }}
              >
                <FileCode2 size={14} className="text-emerald" />
                <span>🚀 1-Click Free Tier IaC Launcher</span>
              </button>
            </div>

            {/* Workflow Views */}
            {workflowTab === 'iac' ? (() => {
              const iacBundle = getLabIacTemplate(activeLab.id, activeLab.title)
              const isTf = iacFormat === 'terraform'
              const activeCode = isTf ? iacBundle.terraform : iacBundle.cloudformation
              const filename = isTf ? 'main.tf' : 'template.yaml'

              return (
                <div className="workflow-content wf-iac-content animate-reveal" style={{ padding: '16px' }}>
                  <div className="iac-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        type="button"
                        className={`wf-tab ${isTf ? 'active' : ''}`}
                        onClick={() => setIacFormat('terraform')}
                        style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: '6px' }}
                      >
                        Terraform (main.tf)
                      </button>
                      <button
                        type="button"
                        className={`wf-tab ${!isTf ? 'active' : ''}`}
                        onClick={() => setIacFormat('cloudformation')}
                        style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: '6px' }}
                      >
                        AWS CloudFormation (.yaml)
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 600 }}>
                        🟢 100% Free Tier Safe
                      </span>
                      <button
                        type="button"
                        className="cli-action-btn"
                        onClick={() => handleCopyIac(activeCode)}
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        {copiedIac ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                        <span>{copiedIac ? 'Copied' : `Copy ${isTf ? 'Terraform' : 'CFN'}`}</span>
                      </button>
                      <button
                        type="button"
                        className="cli-action-btn btn-execute-sim"
                        onClick={() => handleDownloadIacFile(filename, activeCode)}
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        <Download size={12} />
                        <span>Download {filename}</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ background: '#070b14', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace", color: '#94a3b8' }}>
                      <span>{filename} /// {iacBundle.title}</span>
                      <span style={{ color: '#10b981' }}>{iacBundle.costNote}</span>
                    </div>
                    <pre style={{ margin: 0, padding: '16px', maxHeight: '380px', overflowY: 'auto', font: "12px/1.5 'DM Mono', monospace", color: '#e2e8f0', background: 'transparent' }}>
                      <code>{activeCode}</code>
                    </pre>
                  </div>

                  {/* Teardown Box */}
                  <div style={{ marginTop: '14px', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#f87171', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <AlertTriangle size={13} /> 1-CLICK CLEANUP & TEARDOWN COMMAND:
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Run this command after testing to guarantee zero lingering resources in your account.</span>
                    </div>
                    <code style={{ background: '#0b101b', color: '#fca5a5', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontFamily: "'DM Mono', monospace", border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                      {iacBundle.teardownCmd}
                    </code>
                  </div>
                </div>
              )
            })() : workflowTab === 'terminal' ? (
              <div className="workflow-content wf-terminal-content animate-reveal" style={{ padding: '4px' }}>
                <TerminalPane 
                  labId={activeLab.id}
                  activeStep={{
                    ...currentStep,
                    cliCommand: activeCliData.command,
                    verify: activeCliData.verify,
                    expectedOutput: currentStep.expectedOutput
                  }}
                  activeCloud={activeCliCloud}
                  pendingCommand={pendingTerminalCmd}
                  onStepVerified={(stepId) => {
                    if (!completedStepIds.includes(stepId)) {
                      toggleLabStep(activeLab.id, stepId)
                    }
                  }}
                  onCommandExecuted={(cmd, out) => {
                    console.log(`[Lab Terminal Executed] ${cmd}`)
                  }} 
                />
              </div>
            ) : workflowTab === 'cli' ? (
              <div className="workflow-content wf-cli-content">
                {/* 5-Cloud Multi-Provider Command Selector & Compare Toggle */}
                <div className="multi-cloud-cli-tabs-bar">
                  <div className="provider-cli-selector" role="tablist" aria-label="Cloud Runbook Provider">
                    {CLOUD_PROVIDERS.map(cp => {
                      const isSelected = activeCliCloud === cp.id
                      return (
                        <button
                          key={cp.id}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          className={`provider-cli-tab ${isSelected ? 'active' : ''}`}
                          onClick={() => {
                            setActiveCliCloud(cp.id)
                            setShowAllCloudsSideBySide(false)
                          }}
                          style={{
                            borderColor: isSelected ? cp.accentColor : 'rgba(148, 163, 184, 0.2)',
                            color: isSelected ? cp.accentColor : '#cbd5e1'
                          }}
                        >
                          <span>{cp.iconEmoji}</span>
                          <span className="provider-name">{cp.shortName}</span>
                          <code className="provider-cli-badge">{cp.cliName}</code>
                        </button>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    className={`toggle-side-by-side-btn ${showAllCloudsSideBySide ? 'active' : ''}`}
                    onClick={() => setShowAllCloudsSideBySide(prev => !prev)}
                    title="Compare CLI commands across all 5 clouds simultaneously"
                  >
                    <Layers size={13} />
                    <span>{showAllCloudsSideBySide ? 'Single Provider' : 'Compare 5 Clouds Side-by-Side'}</span>
                  </button>
                </div>

                {/* Side-by-Side 5-Cloud Comparison Mode */}
                {showAllCloudsSideBySide ? (
                  <div className="multi-cloud-side-by-side-grid animate-reveal">
                    {CLOUD_PROVIDERS.map(cp => {
                      const cmdData = multiCloudCommands[cp.id] || multiCloudCommands.aws
                      return (
                        <div
                          key={cp.id}
                          className="cloud-command-card"
                          style={{
                            borderColor: `color-mix(in srgb, ${cp.accentColor} 45%, rgba(148, 163, 184, 0.2))`
                          }}
                        >
                          <div className="cloud-command-header">
                            <div className="cloud-command-title" style={{ color: cp.accentColor }}>
                              <span>{cp.iconEmoji}</span>
                              <span>{cp.shortName} ({cmdData.cliTool})</span>
                            </div>
                            <button
                              type="button"
                              className="cli-action-btn"
                              style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                              onClick={() => handleCopyCommand(cmdData.command)}
                              title={`Copy ${cp.shortName} command`}
                            >
                              <Copy size={11} />
                              <span>Copy</span>
                            </button>
                          </div>
                          <pre className="cloud-command-pre">
                            <code>{cmdData.command}</code>
                          </pre>
                          <div className="cloud-command-footer">
                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                              Verify: <code style={{ color: '#67e8f9' }}>{cmdData.verify}</code>
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* Standard Active Provider Command Box */
                  <div
                    className="cli-command-box"
                    style={{
                      borderColor: `color-mix(in srgb, ${currentActiveProvider.accentColor} 40%, rgba(56, 189, 248, 0.2))`
                    }}
                  >
                    <div className="cli-box-header">
                      <span className="cli-prompt-label">
                        {currentActiveProvider.iconEmoji} Exact {currentActiveProvider.name} Command ({activeCliData.cliTool}):
                      </span>
                      <div className="cli-box-actions">
                        <button
                          type="button"
                          className="cli-action-btn"
                          onClick={() => handleCopyCommand(activeCliData.command)}
                          title="Copy command to clipboard"
                        >
                          {copiedCmd ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                          <span>{copiedCmd ? 'Copied' : `Copy ${activeCliData.cliTool} Command`}</span>
                        </button>
                        <button
                          type="button"
                          className="cli-action-btn btn-execute-sim"
                          onClick={() => handleSimulateExecution({ ...currentStep, cliCommand: activeCliData.command })}
                          title="Execute in the live sandbox"
                        >
                          <Play size={11} />
                          <span>Run in {activeCliCloud === 'aws' ? 'CloudShell' : `${currentActiveProvider.shortName} Shell`}</span>
                        </button>
                      </div>
                    </div>
                    <pre className="cli-command-pre">
                      <code>{activeCliData.command}</code>
                    </pre>

                    {/* Verification / Forensic Validation Command */}
                    {activeCliData.verify && (
                      <div
                        style={{
                          padding: '8px 14px',
                          background: 'rgba(0, 0, 0, 0.3)',
                          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.74rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <span style={{ color: '#10b981', fontWeight: 700 }}>
                          Validation Signal Query ({activeCliData.cliTool}):
                        </span>
                        <code style={{ color: '#67e8f9', background: 'rgba(15, 23, 42, 0.6)', padding: '2px 6px', borderRadius: '4px', fontFamily: "'DM Mono', monospace" }}>
                          {activeCliData.verify}
                        </code>
                      </div>
                    )}
                  </div>
                )}

                {/* Simulated Terminal Sandbox Output */}
                {simulatedExecution ? (
                  <div className="simulated-terminal-box animate-reveal">
                    <div className="sim-term-header">
                      <span className="sim-term-title">
                        <Terminal size={12} className="text-cyan" />
                        <span>{currentActiveProvider.shortName} Shell Sandbox Response [{simulatedExecution.timestamp}]</span>
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
              /* Console View with Multi-Cloud Switcher */
              <div className="workflow-content wf-console-content">
                <div className="provider-cli-selector" style={{ marginBottom: '12px' }}>
                  {CLOUD_PROVIDERS.map(cp => {
                    const isSelected = activeCliCloud === cp.id
                    return (
                      <button
                        key={cp.id}
                        type="button"
                        className={`provider-cli-tab ${isSelected ? 'active' : ''}`}
                        onClick={() => setActiveCliCloud(cp.id)}
                        style={{
                          borderColor: isSelected ? cp.accentColor : 'rgba(148, 163, 184, 0.2)',
                          color: isSelected ? cp.accentColor : '#cbd5e1'
                        }}
                      >
                        <span>{cp.iconEmoji}</span>
                        <span>{cp.shortName} Console</span>
                      </button>
                    )
                  })}
                </div>
                <div
                  className="console-path-card"
                  style={{ borderLeft: `3px solid ${currentActiveProvider.accentColor}` }}
                >
                  <span className="path-label">
                    {currentActiveProvider.iconEmoji} {currentActiveProvider.name} Navigation Path:
                  </span>
                  <p className="console-path-text">
                    {multiCloudConsole[activeCliCloud] || currentStep.consolePath}
                  </p>
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

          {/* Verified $0 teardown workflow & Cleanup Checklist */}
          {activeLab.zeroCostVerification && (
            <div className="safe-cost-verification-box" style={{
              margin: '20px 0',
              padding: '16px 20px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                  <DollarSign size={16} />
                  <span>Verified $0 teardown workflow</span>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#10b981', color: '#0f172a', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                  100% FREE-TIER SAFE
                </span>
              </div>
              <pre style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px 14px', borderRadius: '6px', fontSize: '0.8rem', color: '#6ee7b7', margin: '0 0 10px 0', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {activeLab.zeroCostVerification}
              </pre>
              {activeLab.teardownCommand && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
                  <strong style={{ color: '#f87171' }}>Teardown Command:</strong>
                  <code style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '3px 8px', borderRadius: '4px', color: '#fbcfe8' }}>
                    {activeLab.teardownCommand}
                  </code>
                </div>
              )}
              <div style={{ marginTop: '10px', fontSize: '0.76rem', color: '#94a3b8', fontStyle: 'italic', borderTop: '1px solid rgba(16, 185, 129, 0.2)', paddingTop: '8px' }}>
                Follow every step and verify in your AWS billing console. We can't guarantee your account shows $0 if a step is skipped or AWS's own free-tier terms change.
              </div>
            </div>
          )}

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
                disabled={activeStepIndex >= labSteps.length - 1}
                onClick={() => {
                  setActiveStepIndex(prev => Math.min(labSteps.length - 1, prev + 1))
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

        {/* Student In-Lab Notes & Scratchpad Drawer */}
        <LabNotesScratchpad
          contextId={activeLab.id}
          contextTitle={`${activeLab.labNumber}: ${activeLab.title}`}
          contextType="Real Enterprise AWS Lab"
          targetServices={activeLab.targetServices}
          mitreTechnique={activeLab.mitreTechnique}
        />
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
            <button
              type="button"
              className="button button-ghost btn-sm"
              onClick={() => setShowCostCalculator(prev => !prev)}
              style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
            >
              <DollarSign size={13} />
              <span>{showCostCalculator ? 'Hide AWS Cost Sentinel' : 'Safe AWS Lab Cost & Teardown Sentinel'}</span>
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

      {/* ── BUILDER RESILIENCE & HANDS-ON ENCOURAGEMENT CALLOUT ── */}
      <DefenderQuoteCallout category="builder" autoCycle={true} cycleIntervalMs={15000} />

      {/* Optional Safe Lab Cost Calculator Sentinel Section */}
      {showCostCalculator && (
        <div className="embedded-cost-calculator-container animate-reveal" style={{ maxWidth: '1200px', margin: '0 auto 24px auto' }}>
          <SafeLabCostCalculator onClose={() => setShowCostCalculator(false)} />
        </div>
      )}

      {/* Optional Job Process Framework Section */}
      {showProcessFramework && (
        <div className="embedded-framework-container animate-reveal">
          <JobProcessFramework />
        </div>
      )}

      {/* Multi-Cloud Global Provider Filter Bar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 20px auto' }}>
        <MultiCloudProviderFilter compact={false} showDetails={true} />
      </div>

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
                  <span className="lab-role-tag">{lab.jobRole || lab.roleTitle}</span>
                  {lab.moduleMarker && (
                    <span style={{ fontSize: '0.65rem', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Sparkles size={10} />
                      {lab.moduleMarker}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {lab.xpReward && (
                    <span style={{ fontSize: '0.65rem', color: '#ff9900', fontWeight: 800, background: 'rgba(255, 153, 0, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      +{lab.xpReward} XP
                    </span>
                  )}
                  {lab.mitreTechnique && (
                    <span className="lab-mitre-tag">
                      <Crosshair size={10} />
                      {lab.mitreTechnique.split('-')[0].trim()}
                    </span>
                  )}
                </div>
              </div>

              <div className="lab-card-body">
                <h3 className="lab-card-title">
                  <Link to={`/labs/${lab.id}`}>{lab.title}</Link>
                </h3>
                <div className="lab-org-sub">
                  <Briefcase size={11} className="text-amber" />
                  <span>{lab.organization || 'Global Cloud Security Team'}</span>
                </div>
                <p className="lab-card-summary">{lab.scenarioSummary}</p>
                {lab.encouragingText && (
                  <p style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '6px', fontWeight: 600 }}>
                    ↳ {lab.encouragingText}
                  </p>
                )}

                <div className="lab-services-list">
                  {lab.targetServices.map(svc => (
                    <span key={svc} className="service-tag">
                      {svc}
                    </span>
                  ))}
                </div>

                {/* 5-Cloud Cross-Platform Support Tags */}
                <div className="lab-card-cloud-row" title="5-Cloud Cross-Platform CLI Runbooks Available">
                  {CLOUD_PROVIDERS.map(cp => {
                    const isTarget = selectedCloudProvider === cp.id
                    return (
                      <span
                        key={cp.id}
                        className={`lab-card-cloud-tag ${isTarget ? 'is-active-filter' : ''}`}
                        style={{
                          borderColor: isTarget ? cp.accentColor : undefined,
                          color: isTarget ? cp.accentColor : undefined,
                          background: isTarget ? `color-mix(in srgb, ${cp.accentColor} 18%, rgba(15, 23, 42, 0.9))` : undefined
                        }}
                      >
                        {cp.iconEmoji} {cp.shortName}
                      </span>
                    )
                  })}
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
