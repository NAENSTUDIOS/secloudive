import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Briefcase, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Clock, 
  Trash2, 
  Code2, 
  Layers, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  DollarSign, 
  Info, 
  ChevronDown, 
  ChevronRight,
  Flame,
  ArrowRight,
  Award,
  Sparkles
} from 'lucide-react'
import { cloudProjects, zeroBillingGuide } from '../data/cloudProjects'
import { useChallenges } from '../context/ChallengeContext'
import DefenderQuoteCallout from '../components/DefenderQuoteCallout'

export default function CloudProjects() {
  const {
    cloudProjectsCompleted,
    cloudProjectsTeardown,
    toggleCloudProject,
    toggleProjectTeardown,
    completedCloudProjectsCount,
    completedTeardownsCount
  } = useChallenges()

  const [activeProject, setActiveProject] = useState(cloudProjects[0])
  const [activeTab, setActiveTab] = useState('build') // 'build' | 'teardown' | 'portfolio'
  const [copiedId, setCopiedId] = useState(null)
  const [showSafetyModal, setShowSafetyModal] = useState(false)

  const isVerified = Boolean(cloudProjectsCompleted?.[activeProject.id])
  const isTornDown = Boolean(cloudProjectsTeardown?.[activeProject.id])

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <main className="page-shell projects-page">
      {/* Top Header */}
      <div className="projects-header">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" style={{ backgroundColor: 'var(--green)' }} /> 100% AWS FREE TIER ELIGIBLE /// VERIFIED $0 TEARDOWN WORKFLOW
          </div>
          <h1>
            Cloud Security Capstone Projects<span>.</span>
          </h1>
          <p>
            Build production-grade security architectures in your personal AWS account without paying a single cent.
            Every project includes step-by-step console guides, least-privilege automation, strict tear-down cleanup runbooks, and resume-ready bullet points.
          </p>
        </div>

        <div className="projects-header-actions">
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34d399',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 700
          }}>
            <Award size={15} />
            <span>{completedCloudProjectsCount}/4 Verified ({completedCloudProjectsCount * 150} XP)</span>
          </span>
          <button
            type="button"
            className="button button-ghost btn-safety"
            onClick={() => setShowSafetyModal(!showSafetyModal)}
          >
            <ShieldCheck size={16} className="text-emerald" />
            <span>Zero-Billing Protocol Guide</span>
          </button>
          <Link to="/playbooks" className="button button-primary">
            <Layers size={16} /> Job Playbooks (4)
          </Link>
        </div>
      </div>

      {/* Motivational Builder Quote Callout */}
      <DefenderQuoteCallout 
        category="builder" 
        autoCycle={true} 
        cycleIntervalMs={14000} 
        className="projects-quote-callout"
      />

      {/* Zero Billing Alert Box */}
      {showSafetyModal && (
        <div className="billing-safety-banner">
          <div className="bsb-head">
            <div className="bsb-title">
              <DollarSign size={20} className="text-emerald" />
              <h3>{zeroBillingGuide.title}</h3>
            </div>
            <button type="button" className="btn-close-sm" onClick={() => setShowSafetyModal(false)}>✕</button>
          </div>
          <p className="bsb-intro">{zeroBillingGuide.description}</p>
          
          <div className="bsb-rules-grid">
            {zeroBillingGuide.rules.map((rule, idx) => (
              <div className="bsb-rule-card" key={idx}>
                <strong>Rule {idx + 1}: {rule.title}</strong>
                <p>{rule.description}</p>
                {rule.command && (
                  <div className="bsb-cmd-box">
                    <code>{rule.command}</code>
                    <button type="button" className="btn-copy-sm" onClick={() => handleCopy(rule.command, `rule-${idx}`)}>
                      {copiedId === `rule-${idx}` ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                      <span>{copiedId === `rule-${idx}` ? 'Copied' : 'Copy Alarm Command'}</span>
                    </button>
                  </div>
                )}
                {rule.freeTierAlternatives && (
                  <div className="bsb-alt-box">
                    <small><strong>Free Tier Safe Practice:</strong> {rule.freeTierAlternatives}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Selector Tabs */}
      <div className="project-selector-strip">
        {cloudProjects.map(proj => {
          const projVerified = Boolean(cloudProjectsCompleted?.[proj.id])
          const projCleaned = Boolean(cloudProjectsTeardown?.[proj.id])
          return (
            <button
              key={proj.id}
              type="button"
              className={`project-tab-card ${activeProject.id === proj.id ? 'active' : ''}`}
              onClick={() => {
                setActiveProject(proj)
                setActiveTab('build')
              }}
            >
              <div className="ptc-meta">
                <span className="ptc-num">{proj.number}</span>
                <span className="ptc-cost text-emerald">{proj.cost}</span>
                {projVerified && (
                  <span style={{ fontSize: '0.62rem', background: 'rgba(16, 185, 129, 0.25)', color: '#34d399', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.4)', fontWeight: 700 }}>
                    ✓ Verified
                  </span>
                )}
                {projCleaned && (
                  <span style={{ fontSize: '0.62rem', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.4)', fontWeight: 700 }}>
                    ✓ $0 Cleaned
                  </span>
                )}
              </div>
              <h4>{proj.title}</h4>
              <div className="ptc-footer">
                <span><Clock size={12} /> {proj.estimatedTime}</span>
                <span className="text-cyan">{proj.role.split(' ')[0]}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Project Workspace */}
      <div className="project-workspace-card">
        {/* Header Bar */}
        <div className="pw-header">
          <div className="pwh-info" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span className="project-badge">{activeProject.number}</span>
            <h2 style={{ margin: 0 }}>{activeProject.title}</h2>
            <button
              type="button"
              onClick={() => toggleCloudProject(activeProject.id)}
              style={{
                background: isVerified ? 'rgba(16, 185, 129, 0.22)' : 'rgba(56, 189, 248, 0.15)',
                border: `1px solid ${isVerified ? '#10b981' : 'rgba(56, 189, 248, 0.4)'}`,
                color: isVerified ? '#34d399' : '#38bdf8',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              title="Click to toggle verified status and sync evidence dossier with Dashboard"
            >
              <CheckCircle2 size={15} />
              <span>{isVerified ? '✓ Verified in Personal AWS (+150 XP)' : 'Mark Verified & Record Evidence (+150 XP)'}</span>
            </button>
          </div>

          <div className="pwh-tabs">
            <button
              type="button"
              className={`pwh-tab-btn ${activeTab === 'build' ? 'active' : ''}`}
              onClick={() => setActiveTab('build')}
            >
              <Code2 size={15} /> 1. Step-by-Step Build Guide
            </button>
            <button
              type="button"
              className={`pwh-tab-btn ${activeTab === 'teardown' ? 'active' : ''}`}
              onClick={() => setActiveTab('teardown')}
            >
              <Trash2 size={15} className="text-rose" /> 2. Zero-Billing Tear-Down Runbook
            </button>
            <button
              type="button"
              className={`pwh-tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
              onClick={() => setActiveTab('portfolio')}
            >
              <Briefcase size={15} /> 3. Resume & Portfolio Proof
            </button>
          </div>
        </div>

        {/* Overview Bar */}
        <div className="pw-overview-bar">
          <div className="pwo-item">
            <span className="label">TARGET ROLE</span>
            <strong>{activeProject.role}</strong>
          </div>
          <div className="pwo-item">
            <span className="label">ESTIMATED TIME</span>
            <strong>{activeProject.estimatedTime} ({activeProject.difficulty})</strong>
          </div>
          <div className="pwo-item">
            <span className="label">BILLING COMMITMENT</span>
            <strong className="text-emerald">{activeProject.cost}</strong>
          </div>
          <div className="pwo-item">
            <span className="label">AWS FREE TIER QUOTA</span>
            <small>{activeProject.freeTierQuota}</small>
          </div>
        </div>

        {/* Tab 1: Step-by-Step Build Guide */}
        {activeTab === 'build' && (
          <div className="pw-content-body">
            {/* Architecture Card */}
            <div className="pw-arch-card">
              <div className="pac-head">
                <Layers size={18} className="text-cyan" />
                <h3>Architecture Flow & Threat Model</h3>
              </div>
              <p className="pac-problem"><strong>Business Problem:</strong> {activeProject.businessProblem}</p>
              
              <div className="arch-flow-steps">
                <strong>Architecture Pipeline:</strong>
                <ul>
                  {activeProject.architectureSteps.map((step, idx) => (
                    <li key={idx}><CheckCircle2 size={13} className="text-cyan" /> <span>{step}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Build Steps */}
            <div className="build-steps-list">
              <h3>Implementation Runbook (From Scratch)</h3>
              {activeProject.stepByStepBuild.map(s => (
                <div className="build-step-card" key={s.step}>
                  <div className="bsc-head">
                    <div className="bsc-number">STEP {s.step}</div>
                    <h4>{s.title}</h4>
                  </div>

                  <div className="bsc-console-path">
                    <strong>AWS Management Console Path:</strong>
                    <code>{s.consolePath}</code>
                  </div>

                  {s.cliCommand && (
                    <div className="bsc-cmd-box">
                      <div className="bcb-head">
                        <span><Terminal size={13} /> AWS CLI Equivalent (Terminal Mode)</span>
                        <button
                          type="button"
                          className="btn-copy-sm"
                          onClick={() => handleCopy(s.cliCommand, `build-cmd-${s.step}`)}
                        >
                          {copiedId === `build-cmd-${s.step}` ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                          <span>{copiedId === `build-cmd-${s.step}` ? 'Copied' : 'Copy CLI'}</span>
                        </button>
                      </div>
                      <code>{s.cliCommand}</code>
                    </div>
                  )}

                  {s.codeSnippet && (
                    <div className="bsc-code-box">
                      <div className="bcb-head">
                        <span><Code2 size={13} /> Code / Manifest Implementation</span>
                        <button
                          type="button"
                          className="btn-copy-sm"
                          onClick={() => handleCopy(s.codeSnippet, `build-code-${s.step}`)}
                        >
                          {copiedId === `build-code-${s.step}` ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                          <span>{copiedId === `build-code-${s.step}` ? 'Copied' : 'Copy Code'}</span>
                        </button>
                      </div>
                      <pre>{s.codeSnippet}</pre>
                    </div>
                  )}

                  <p className="bsc-explanation">
                    <Info size={14} className="text-cyan" />
                    <span><strong>Technical Rationale:</strong> {s.explanation}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Call to Next Step */}
            <div className="next-action-prompt">
              <div>
                <h4>Finished Testing Your Project?</h4>
                <p>Record your verifiable portfolio proof and execute the tear-down runbook to ensure $0 billing.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => toggleCloudProject(activeProject.id)}
                  style={{ borderColor: isVerified ? '#10b981' : 'rgba(56, 189, 248, 0.4)', color: isVerified ? '#34d399' : '#38bdf8' }}
                >
                  <CheckCircle2 size={15} />
                  <span>{isVerified ? '✓ Verified in Account' : 'Verify & Record Milestone'}</span>
                </button>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => setActiveTab('teardown')}
                >
                  <Trash2 size={15} /> <span>Open Zero-Billing Tear-Down Runbook</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tear-Down Runbook */}
        {activeTab === 'teardown' && (
          <div className="pw-content-body">
            <div className="teardown-banner">
              <div className="tdb-head">
                <Trash2 size={22} className="text-rose" />
                <div>
                  <h3>Mandatory Zero-Billing Cleanup Runbook</h3>
                  <p>{activeProject.tearDownRunbook.zeroCostPromise}</p>
                  <p style={{ marginTop: '8px', fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic', opacity: 0.9 }}>
                    Follow every step and verify in your AWS billing console. We can't guarantee your account shows $0 if a step is skipped or AWS's own free-tier terms change.
                  </p>
                </div>
              </div>

              <div className="teardown-toggle-btn">
                <button
                  type="button"
                  className={`btn-clean-toggle ${isTornDown ? 'is-cleaned' : ''}`}
                  onClick={() => toggleProjectTeardown(activeProject.id)}
                >
                  <CheckCircle2 size={16} />
                  <span>{isTornDown ? 'Tear-Down Verified Complete ($0 Cost)' : 'Mark Tear-Down Complete'}</span>
                </button>
                {isTornDown && (
                  <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={13} /> Verified in AWS Billing Console • Synced to Profile & Dashboard (+50 XP)
                  </div>
                )}
              </div>
            </div>

            {/* CLI Tear-Down Commands */}
            <div className="teardown-section">
              <h4>1-Liner Automated CLI Clean-Up Commands</h4>
              <p className="text-muted">Copy and run these commands in AWS CloudShell or your terminal to delete all resources in under 30 seconds:</p>

              <div className="td-commands-list">
                {activeProject.tearDownRunbook.cliCommands.map((cmd, cIdx) => (
                  <div className="td-cmd-box" key={cIdx}>
                    <code>{cmd}</code>
                    <button
                      type="button"
                      className="btn-copy-sm"
                      onClick={() => handleCopy(cmd, `td-cmd-${cIdx}`)}
                    >
                      {copiedId === `td-cmd-${cIdx}` ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                      <span>{copiedId === `td-cmd-${cIdx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Console Click-by-Click Clean-Up */}
            <div className="teardown-section">
              <h4>AWS Management Console Click-by-Click Deletion Steps</h4>
              <ul className="td-console-steps">
                {activeProject.tearDownRunbook.consoleSteps.map((step, sIdx) => (
                  <li key={sIdx}>
                    <CheckCircle2 size={15} className="text-cyan" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Resume & Portfolio Proof */}
        {activeTab === 'portfolio' && (
          <div className="pw-content-body">
            <div className="portfolio-banner">
              <Briefcase size={22} className="text-cyan" />
              <div>
                <h3>Add This Project to Your Resume & GitHub Portfolio</h3>
                <p>Presenting real hands-on projects with architectural justification sets you apart from 99% of candidates who only list multiple-choice certifications.</p>
              </div>
            </div>

            {/* GitHub Project Title & Readme */}
            <div className="portfolio-section">
              <div className="pfs-head">
                <h4>GitHub Repository Name & Header</h4>
                <button
                  type="button"
                  className="btn-copy-sm"
                  onClick={() => handleCopy(activeProject.portfolioGuide.githubTitle, 'gh-title')}
                >
                  {copiedId === 'gh-title' ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                  <span>{copiedId === 'gh-title' ? 'Copied' : 'Copy Title'}</span>
                </button>
              </div>
              <code className="pfs-title-box">{activeProject.portfolioGuide.githubTitle}</code>
            </div>

            {/* Resume Bullet Points */}
            <div className="portfolio-section">
              <div className="pfs-head">
                <h4>Resume Experience Bullet Points (Paste Directly on your CV)</h4>
                <button
                  type="button"
                  className="btn-copy-sm"
                  onClick={() => handleCopy(activeProject.portfolioGuide.resumeBullets.map(b => `• ${b}`).join('\n'), 'cv-bullets')}
                >
                  {copiedId === 'cv-bullets' ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                  <span>{copiedId === 'cv-bullets' ? 'Copied' : 'Copy All Bullets'}</span>
                </button>
              </div>
              <ul className="cv-bullets-list">
                {activeProject.portfolioGuide.resumeBullets.map((bullet, bIdx) => (
                  <li key={bIdx}>
                    <CheckCircle2 size={15} className="text-emerald" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Talking Points */}
            <div className="portfolio-section">
              <h4>Senior Engineer Interview Discussion Points</h4>
              <div className="interview-pro-tip">
                <Info size={16} className="text-cyan" />
                <p>{activeProject.portfolioGuide.interviewDiscussionPoints}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
