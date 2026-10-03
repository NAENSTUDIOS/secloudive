import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShieldAlert, 
  Terminal, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Play, 
  Download, 
  Layers, 
  Flame, 
  ArrowRight,
  Code2,
  Database,
  Building,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { jobPlaybooks } from '../data/jobPlaybooks'
import ForensicQueryStudio from '../components/ForensicQueryStudio'
import DefenderQuoteCallout from '../components/DefenderQuoteCallout'
import { useChallenges } from '../context/ChallengeContext'

export default function JobPlaybookEngine() {
  const {
    executePlaybook,
    playbooksExecuted,
    completedPlaybooksCount
  } = useChallenges()

  const [activePlaybook, setActivePlaybook] = useState(jobPlaybooks[0])
  const [activeTab, setActiveTab] = useState('workflow') // 'workflow' | 'forensics' | 'ciso'
  const [copiedCmd, setCopiedCmd] = useState(null)
  const [activeTerraformView, setActiveTerraformView] = useState('after') // 'before' | 'after'
  const [briefingCopied, setBriefingCopied] = useState(false)

  const handleCopyCmd = (cmd, id) => {
    navigator.clipboard.writeText(cmd)
    setCopiedCmd(id)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  const handleCopyBriefing = () => {
    const text = `# EXECUTIVE INCIDENT POST-MORTEM: ${activePlaybook.title}
Ticket: ${activePlaybook.ticketId}
Severity: ${activePlaybook.severity}
Status: CONTAINED & REMEDIATED

## 1. Executive Summary
${activePlaybook.cisoPostMortem.executiveSummary}

## 2. Root Cause Analysis
${activePlaybook.cisoPostMortem.rootCause}

## 3. Financial & Business Impact
${activePlaybook.cisoPostMortem.financialImpact}

## 4. Key Remediation & Long-Term Hardening
${activePlaybook.cisoPostMortem.remediationActions.map(a => `- ${a}`).join('\n')}

Report Generated via SeCloudive Cloud Security Career Engine.`
    navigator.clipboard.writeText(text)
    setBriefingCopied(true)
    setTimeout(() => setBriefingCopied(false), 2000)
  }

  return (
    <main className="page-shell playbooks-page">
      {/* Top Banner */}
      <div className="playbooks-header">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" /> ENTERPRISE SECOPS PLAYBOOKS /// FROM SCRATCH TO SOLVED
          </div>
          <h1>
            Cloud Security Job Playbook Engine<span>.</span>
          </h1>
          <p>
            Experience how real Cloud Security Engineers, Incident Responders, and DevSecOps leads triage alerts from scratch:
            raw GuardDuty alerts &rarr; minute-0 containment &rarr; Terraform IaC fixes &rarr; automated verification &rarr; CISO post-mortem briefings.
          </p>
        </div>

        <div className="playbooks-header-actions">
          <span style={{
            fontSize: '0.78rem',
            fontFamily: "'DM Mono', monospace",
            fontWeight: 700,
            color: '#10b981',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '6px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle2 size={14} />
            {completedPlaybooksCount || 0}/4 Executed ({ (completedPlaybooksCount || 0) * 100 } XP)
          </span>
          <Link to="/labs" className="button button-ghost">
            <Terminal size={15} /> Hands-on Labs (16)
          </Link>
          <Link to="/investigations" className="button button-primary">
            <ShieldAlert size={15} /> Incident Simulator (25)
          </Link>
        </div>
      </div>

      {/* Motivational Security Defender Quote Callout */}
      <DefenderQuoteCallout 
        category="tactical" 
        autoCycle={true} 
        cycleIntervalMs={14000} 
        className="playbooks-quote-callout"
      />

      {/* Playbook Selector Strip */}
      <div className="playbook-selector-strip">
        {jobPlaybooks.map(pb => (
          <button
            key={pb.id}
            type="button"
            className={`playbook-nav-card ${activePlaybook.id === pb.id ? 'active' : ''}`}
            onClick={() => {
              setActivePlaybook(pb)
              setActiveTab('workflow')
            }}
          >
            <div className="pnc-meta">
              <span className={`risk-tag risk-${pb.severity.includes('CRITICAL') ? 'critical' : 'high'}`}>
                {pb.severity.split(' - ')[0]}
              </span>
              <span className="pnc-ticket">{pb.ticketId}</span>
              {playbooksExecuted?.[pb.id] && (
                <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <CheckCircle2 size={12} /> EXECUTED
                </span>
              )}
            </div>
            <h4>{pb.title}</h4>
            <div className="pnc-footer">
              <span><Clock size={12} /> {pb.slaMinutes}m SLA</span>
              <span className="text-cyan">{pb.category.split(' ')[0]}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Playbook Workspace */}
      <div className="playbook-workspace-card">
        {/* Workspace Nav Header */}
        <div className="workspace-tabs-header">
          <div className="wth-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span className="ticket-pill">{activePlaybook.ticketId}</span>
            <h2 style={{ margin: 0 }}>{activePlaybook.title}</h2>
            <button
              type="button"
              onClick={() => executePlaybook && executePlaybook(activePlaybook.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: playbooksExecuted?.[activePlaybook.id] ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: playbooksExecuted?.[activePlaybook.id] ? '#10b981' : '#ffffff',
                border: playbooksExecuted?.[activePlaybook.id] ? '1px solid #10b981' : 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: playbooksExecuted?.[activePlaybook.id] ? 'none' : '0 2px 10px rgba(14, 165, 233, 0.3)'
              }}
            >
              <CheckCircle2 size={14} />
              <span>{playbooksExecuted?.[activePlaybook.id] ? '✓ Playbook Executed & Evidence Recorded (+100 XP)' : 'Execute Containment & Record Evidence (+100 XP)'}</span>
            </button>
          </div>

          <div className="wth-tabs">
            <button
              type="button"
              className={`wth-tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
              onClick={() => setActiveTab('workflow')}
            >
              <FileText size={15} /> 7-Step Job SOP (Scratch to Solved)
            </button>
            <button
              type="button"
              className={`wth-tab-btn ${activeTab === 'forensics' ? 'active' : ''}`}
              onClick={() => setActiveTab('forensics')}
            >
              <Database size={15} /> Live Forensic Query Studio
            </button>
            <button
              type="button"
              className={`wth-tab-btn ${activeTab === 'ciso' ? 'active' : ''}`}
              onClick={() => setActiveTab('ciso')}
            >
              <Building size={15} /> CISO Post-Mortem Briefing
            </button>
          </div>
        </div>

        {/* Tab 1: Workflow (From Scratch to Solved) */}
        {activeTab === 'workflow' && (
          <div className="playbook-workflow-content">
            {/* Meta Bar */}
            <div className="playbook-meta-bar">
              <div className="pmb-item">
                <span className="label">SEVERITY SLA</span>
                <strong className="text-rose">{activePlaybook.severity} ({activePlaybook.slaMinutes} Mins SLA)</strong>
              </div>
              <div className="pmb-item">
                <span className="label">PRIMARY CATEGORY</span>
                <strong>{activePlaybook.category}</strong>
              </div>
              <div className="pmb-item">
                <span className="label">AFFECTED AWS SERVICES</span>
                <div className="service-tags">
                  {activePlaybook.affectedServices.map(s => <span key={s} className="tag-service">{s}</span>)}
                </div>
              </div>
              <div className="pmb-item">
                <span className="label">MITRE ATT&CK TACTICS</span>
                <div className="mitre-tags">
                  {activePlaybook.mitreTactics.map(m => <span key={m} className="tag-mitre">{m}</span>)}
                </div>
              </div>
            </div>

            {/* Step 1: The Raw Alert & Notification (Scratch) */}
            <div className="workflow-step-section">
              <div className="wss-number">01</div>
              <div className="wss-body">
                <div className="wss-header">
                  <h3>The Raw Inbound Alert & PagerDuty Dispatch</h3>
                  <span className="badge-stage">STAGE 1: SCRATCH INGESTION</span>
                </div>
                <p>
                  How the alert arrives on-call: Amazon GuardDuty or Security Hub detects the anomaly and triggers an automated webhook alert.
                </p>

                <div className="dual-preview-grid">
                  <div className="code-card">
                    <div className="code-card-header">
                      <span><AlertTriangle size={13} className="text-amber" /> Raw Alert JSON ({activePlaybook.rawAlert.source})</span>
                      <span className="text-rose">Score: {activePlaybook.rawAlert.severityScore}/10</span>
                    </div>
                    <pre className="code-pre">
                      {JSON.stringify(activePlaybook.rawAlert.payload, null, 2)}
                    </pre>
                  </div>

                  <div className="code-card">
                    <div className="code-card-header">
                      <span><Flame size={13} className="text-rose" /> PagerDuty / Slack Dispatch Notification</span>
                    </div>
                    <pre className="code-pre text-amber font-mono" style={{ whiteSpace: 'pre-wrap' }}>
                      {activePlaybook.stakeholderNotice}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: First 5 Minutes Scoping */}
            <div className="workflow-step-section">
              <div className="wss-number">02</div>
              <div className="wss-body">
                <div className="wss-header">
                  <h3>First 5 Minutes: Scoping & Triage Questions</h3>
                  <span className="badge-stage">STAGE 2: RAPID TRIAGE</span>
                </div>
                <p>
                  What the Incident Commander and Lead Cloud Security Engineer ask immediately on the incident bridge:
                </p>

                <div className="triage-qa-grid">
                  {activePlaybook.first5Minutes.map((item, idx) => (
                    <div className="triage-qa-card" key={idx}>
                      <div className="tqa-q">
                        <strong>Q{idx + 1}: {item.question}</strong>
                      </div>
                      <div className="tqa-a">
                        <CheckCircle2 size={15} className="text-emerald" />
                        <span>{item.answer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Root Cause Evidence & Smoking Gun */}
            <div className="workflow-step-section">
              <div className="wss-number">03</div>
              <div className="wss-body">
                <div className="wss-header">
                  <h3>Finding the Root Cause: "The Smoking Gun"</h3>
                  <span className="badge-stage">STAGE 3: FORENSIC PROOF</span>
                </div>
                <p>
                  Forensic extraction from CloudTrail and configuration logs proving exactly how the compromise materialized:
                </p>

                <div className="smoking-gun-card">
                  <div className="sgc-header">
                    <div>
                      <strong>Source: {activePlaybook.smokingGun.source}</strong>
                      <span className="sgc-call">API Call: <code>{activePlaybook.smokingGun.call}</code></span>
                    </div>
                    <span className="pulse-dot" style={{ backgroundColor: 'var(--red)' }} />
                  </div>
                  <pre className="code-pre">
                    {JSON.stringify(activePlaybook.smokingGun.rawLog, null, 2)}
                  </pre>
                  <div className="sgc-explanation">
                    <strong>Senior Analyst Breakdown:</strong> {activePlaybook.smokingGun.explanation}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Minute-0 Tactical Containment */}
            <div className="workflow-step-section">
              <div className="wss-number">04</div>
              <div className="wss-body">
                <div className="wss-header">
                  <h3>Minute-0 Tactical Containment (Zero Evidence Loss)</h3>
                  <span className="badge-stage">STAGE 4: EMERGENCY CONTAINMENT</span>
                </div>
                <p>
                  Commands executed immediately to sever attacker access without deleting resources (preserving forensic artifacts):
                </p>

                <div className="containment-commands-list">
                  {activePlaybook.containmentSteps.map((step, idx) => (
                    <div className="cmd-exec-box" key={idx}>
                      <div className="ceb-head">
                        <strong>Action {idx + 1}: {step.action}</strong>
                        <button
                          type="button"
                          className="btn-copy-sm"
                          onClick={() => handleCopyCmd(step.command, `cmd-${idx}`)}
                        >
                          {copiedCmd === `cmd-${idx}` ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                          <span>{copiedCmd === `cmd-${idx}` ? 'Copied' : 'Copy Command'}</span>
                        </button>
                      </div>
                      <code>{step.command}</code>
                      <small className="text-cyan"><CheckCircle2 size={12} /> {step.note}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 5: Permanent Hardening via Terraform IaC */}
            <div className="workflow-step-section">
              <div className="wss-number">05</div>
              <div className="wss-body">
                <div className="wss-header">
                  <h3>Defensible Production Remediation (Terraform IaC)</h3>
                  <span className="badge-stage">STAGE 5: PERMANENT INFRASTRUCTURE FIX</span>
                </div>
                <p>
                  Security fixes must be codified into Terraform so the vulnerability can never recur during future deployments:
                </p>

                <div className="terraform-toggle-card">
                  <div className="ttc-tabs">
                    <button
                      type="button"
                      className={`ttc-tab ${activeTerraformView === 'before' ? 'active-vuln' : ''}`}
                      onClick={() => setActiveTerraformView('before')}
                    >
                      <AlertTriangle size={14} /> Vulnerable Terraform Configuration (Before)
                    </button>
                    <button
                      type="button"
                      className={`ttc-tab ${activeTerraformView === 'after' ? 'active-fixed' : ''}`}
                      onClick={() => setActiveTerraformView('after')}
                    >
                      <CheckCircle2 size={14} /> Hardened Least-Privilege Terraform (After Fix)
                    </button>
                  </div>
                  <pre className="code-pre">
                    {activeTerraformView === 'before' ? activePlaybook.terraformFix.before : activePlaybook.terraformFix.after}
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 6: Verification & Proof */}
            <div className="workflow-step-section">
              <div className="wss-number">06</div>
              <div className="wss-body">
                <div className="wss-header">
                  <h3>Automated Verification & Penetration Testing</h3>
                  <span className="badge-stage">STAGE 6: AUDIT VERIFICATION</span>
                </div>
                <p>
                  Re-running validation tests to mathematically and forensically confirm the attack vector is closed:
                </p>

                <div className="verification-card">
                  <div className="vc-command">
                    <span className="label">Verification Test Probe:</span>
                    <code>{activePlaybook.verification.testCommand}</code>
                  </div>
                  <div className="vc-result">
                    <span className="label">Expected System Response:</span>
                    <pre>{activePlaybook.verification.expectedResult}</pre>
                  </div>
                  <div className="vc-badge">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <strong>{activePlaybook.verification.status}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 7: PIR & Next Steps */}
            <div className="workflow-step-section">
              <div className="wss-number">07</div>
              <div className="wss-body">
                <div className="wss-header">
                  <h3>Post-Incident Review (PIR) & Lessons Learned</h3>
                  <span className="badge-stage">STAGE 7: CLOSING & COMPLIANCE</span>
                </div>
                <p>
                  Final sign-off with executive reporting, financial reconciliation, and permanent detective controls.
                </p>

                <div className="pir-actions-banner">
                  <div>
                    <h4>Ready to Brief Leadership?</h4>
                    <p>Generate a complete executive briefing post-mortem formatted for the Chief Information Security Officer (CISO).</p>
                  </div>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => setActiveTab('ciso')}
                  >
                    <Building size={16} />
                    <span>View CISO Post-Mortem Briefing</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Forensic Query Studio */}
        {activeTab === 'forensics' && (
          <div className="playbook-forensics-tab">
            <ForensicQueryStudio />
          </div>
        )}

        {/* Tab 3: CISO Post-Mortem Briefing */}
        {activeTab === 'ciso' && (
          <div className="playbook-ciso-tab">
            <div className="ciso-briefing-header">
              <div>
                <span className="ticket-pill">CONFIDENTIAL EXECUTIVE REPORT</span>
                <h3>Executive Incident Post-Mortem: {activePlaybook.title}</h3>
                <p className="text-muted">Targeted for CISO, VP of Engineering, and Board Audit Committee</p>
              </div>
              <button type="button" className="button button-primary" onClick={handleCopyBriefing}>
                {briefingCopied ? <Check size={16} /> : <Copy size={16} />}
                <span>{briefingCopied ? 'Report Copied to Clipboard!' : 'Copy Executive Report (.md)'}</span>
              </button>
            </div>

            <div className="ciso-report-document">
              <section className="crd-section">
                <h4>1. Executive Summary</h4>
                <p>{activePlaybook.cisoPostMortem.executiveSummary}</p>
              </section>

              <section className="crd-section">
                <h4>2. Root Cause Analysis</h4>
                <p>{activePlaybook.cisoPostMortem.rootCause}</p>
              </section>

              <section className="crd-section">
                <h4>3. Financial & Data Impact</h4>
                <p>{activePlaybook.cisoPostMortem.financialImpact}</p>
              </section>

              <section className="crd-section">
                <h4>4. Permanent Remediation & Architectural Controls</h4>
                <ul className="remediation-list">
                  {activePlaybook.cisoPostMortem.remediationActions.map((action, i) => (
                    <li key={i}>
                      <CheckCircle2 size={16} className="text-emerald" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
