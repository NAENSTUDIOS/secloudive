import { useState, useMemo } from 'react'
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
  Sparkles,
  Server,
  Network,
  Lock,
  GitBranch,
  Compass,
  HelpCircle,
  BookOpen
} from 'lucide-react'
import { cloudProjects, zeroBillingGuide, careerRealityGuide } from '../data/cloudProjects'
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

  const [selectedTrack, setSelectedTrack] = useState('all') // 'all' | 'cloud-engineer' | 'solutions-architect' | 'cloud-security'
  const [activeProjectId, setActiveProjectId] = useState(cloudProjects[0].id)
  const [activeTab, setActiveTab] = useState('build') // 'build' | 'teardown' | 'portfolio'
  const [copiedId, setCopiedId] = useState(null)
  const [showSafetyModal, setShowSafetyModal] = useState(false)
  const [showRealityGuide, setShowRealityGuide] = useState(true)

  // Filter projects by track
  const filteredProjects = useMemo(() => {
    if (selectedTrack === 'all') return cloudProjects
    return cloudProjects.filter(p => p.track === selectedTrack)
  }, [selectedTrack])

  // Current active project (fallback to first filtered if current active not in filtered)
  const activeProject = useMemo(() => {
    const found = filteredProjects.find(p => p.id === activeProjectId)
    return found || filteredProjects[0] || cloudProjects[0]
  }, [filteredProjects, activeProjectId])

  const isVerified = Boolean(cloudProjectsCompleted?.[activeProject.id])
  const isTornDown = Boolean(cloudProjectsTeardown?.[activeProject.id])

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Generate GitHub README Template Markdown for Tab 3
  const generateReadmeTemplate = (proj) => {
    return `# ${proj.portfolioGuide.githubTitle}

## 📌 Executive Summary & Business Problem
${proj.businessProblem}

## 🏗️ Architecture Architecture
\`\`\`
${proj.architectureSummary}
\`\`\`

### Step-by-Step Data Flow:
${proj.architectureSteps.map(s => `- ${s}`).join('\n')}

---

## 💰 Cost & Free-Tier Quota Guarantee
- **Total Infrastructure Cost**: \`$0.00 USD\`
- **AWS Free Tier Eligible**: ${proj.freeTierQuota}
- **Cost Guardrails**: Verified with AWS Budgets \$0.01 alert and 1-click teardown script.

---

## 🚀 Step-by-Step Implementation Runbook

${proj.stepByStepBuild.map(s => `### Step ${s.step}: ${s.title}
**Console Path**: \`${s.consolePath}\`
${s.cliCommand ? `\`\`\`bash\n${s.cliCommand}\n\`\`\`` : ''}
${s.codeSnippet ? `\`\`\`${s.cliCommand ? 'yaml' : 'python'}\n${s.codeSnippet}\n\`\`\`` : ''}
> **Technical Rationale**: ${s.explanation}
`).join('\n')}

---

## 🧹 Zero-Billing Teardown Verification
After capturing test results, execute the clean-up script to permanently remove test infrastructure:
\`\`\`bash
${proj.tearDownRunbook.cliCommands.join('\n')}
\`\`\`

---

## 🎯 Resume & Skills Demonstrated
${proj.portfolioGuide.resumeBullets.map(b => `- ${b}`).join('\n')}

---
*Built as part of the SeCloudive Hands-on Cloud Capstone Portfolio Curriculum.*`
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
            Cloud & Security Capstone Projects<span>.</span>
          </h1>
          <p>
            Build real, production-grade cloud architectures in your personal AWS account with verified \$0 cost.
            Covers the essential stepping-stone ladder: <strong>Cloud Engineer</strong> foundations, <strong>Cloud Solutions Architect</strong> resilience, and <strong>Cloud Security Engineer</strong> zero-trust defense.
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
            <span>{completedCloudProjectsCount}/{cloudProjects.length} Verified ({completedCloudProjectsCount * 150} XP)</span>
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 700
          }}>
            <Trash2 size={15} />
            <span>{completedTeardownsCount}/{cloudProjects.length} \$0 Cleaned</span>
          </span>

          <button
            type="button"
            className="button button-ghost btn-safety"
            onClick={() => setShowSafetyModal(!showSafetyModal)}
          >
            <ShieldCheck size={16} className="text-emerald" />
            <span>Zero-Billing Protocol</span>
          </button>
        </div>
      </div>

      {/* Motivational Builder Quote Callout */}
      <DefenderQuoteCallout 
        category="builder" 
        autoCycle={true} 
        cycleIntervalMs={14000} 
        className="projects-quote-callout"
      />

      {/* The Stepping Stone Career Reality Banner */}
      <div className="career-reality-banner" style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Compass size={22} className="text-cyan" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc', fontWeight: 800 }}>
                {careerRealityGuide.title}
              </h3>
              <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                {careerRealityGuide.subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="button button-ghost"
            style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            onClick={() => setShowRealityGuide(!showRealityGuide)}
          >
            {showRealityGuide ? 'Hide Strategy Guide' : 'View 3-Stage Career Strategy'}
          </button>
        </div>

        {showRealityGuide && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '16px' }}>
              {careerRealityGuide.summary}
            </p>

            {/* Stepping Stone 3-Stage Ladder */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
              marginBottom: '16px'
            }}>
              {careerRealityGuide.steppingStones.map((stone, sIdx) => (
                <div key={sIdx} style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'DM Mono, monospace', color: '#38bdf8', fontWeight: 700 }}>
                      {stone.stage}
                    </span>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px' }}>
                      {stone.role}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.88rem', color: '#f1f5f9' }}>{stone.focus}</strong>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.45 }}>
                    {stone.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Recruiter Psychology Takeaways */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '14px'
            }}>
              {careerRealityGuide.realities.map((r, rIdx) => (
                <div key={rIdx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{
                    fontFamily: 'DM Mono, monospace',
                    fontWeight: 800,
                    color: '#10b981',
                    fontSize: '0.9rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {r.number}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: '#f1f5f9', display: 'block', marginBottom: '2px' }}>
                      {r.title}
                    </strong>
                    <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                      {r.description}
                    </p>
                    <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                      💡 {r.takeaway}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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

      {/* Track Filter Pills Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '18px',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>
          Filter by Track:
        </span>
        <button
          type="button"
          onClick={() => setSelectedTrack('all')}
          style={{
            background: selectedTrack === 'all' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${selectedTrack === 'all' ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
            color: selectedTrack === 'all' ? '#38bdf8' : '#94a3b8',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          All Capstones ({cloudProjects.length})
        </button>

        <button
          type="button"
          onClick={() => setSelectedTrack('cloud-engineer')}
          style={{
            background: selectedTrack === 'cloud-engineer' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${selectedTrack === 'cloud-engineer' ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
            color: selectedTrack === 'cloud-engineer' ? '#38bdf8' : '#94a3b8',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Server size={13} />
          <span>Cloud Engineer ({cloudProjects.filter(p => p.track === 'cloud-engineer').length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedTrack('solutions-architect')}
          style={{
            background: selectedTrack === 'solutions-architect' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${selectedTrack === 'solutions-architect' ? '#c084fc' : 'rgba(255, 255, 255, 0.1)'}`,
            color: selectedTrack === 'solutions-architect' ? '#c084fc' : '#94a3b8',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Network size={13} />
          <span>Solutions Architect ({cloudProjects.filter(p => p.track === 'solutions-architect').length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedTrack('cloud-security')}
          style={{
            background: selectedTrack === 'cloud-security' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${selectedTrack === 'cloud-security' ? '#10b981' : 'rgba(255, 255, 255, 0.1)'}`,
            color: selectedTrack === 'cloud-security' ? '#34d399' : '#94a3b8',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Lock size={13} />
          <span>Cloud Security ({cloudProjects.filter(p => p.track === 'cloud-security').length})</span>
        </button>
      </div>

      {/* Project Selector Tabs */}
      <div className="project-selector-strip">
        {filteredProjects.map(proj => {
          const projVerified = Boolean(cloudProjectsCompleted?.[proj.id])
          const projCleaned = Boolean(cloudProjectsTeardown?.[proj.id])
          return (
            <button
              key={proj.id}
              type="button"
              className={`project-tab-card ${activeProject.id === proj.id ? 'active' : ''}`}
              onClick={() => {
                setActiveProjectId(proj.id)
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
                <span style={{
                  color: proj.track === 'cloud-security' ? '#34d399' : proj.track === 'solutions-architect' ? '#c084fc' : '#38bdf8',
                  fontWeight: 600
                }}>
                  {proj.trackLabel.split(' ')[0]} {proj.trackLabel.split(' ')[1]}
                </span>
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
            <span style={{
              fontSize: '0.72rem',
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: 700,
              background: activeProject.track === 'cloud-security' ? 'rgba(16, 185, 129, 0.15)' : activeProject.track === 'solutions-architect' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              color: activeProject.track === 'cloud-security' ? '#34d399' : activeProject.track === 'solutions-architect' ? '#c084fc' : '#38bdf8',
              border: `1px solid ${activeProject.track === 'cloud-security' ? 'rgba(16, 185, 129, 0.3)' : activeProject.track === 'solutions-architect' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`
            }}>
              {activeProject.trackLabel}
            </span>
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
              <Briefcase size={15} /> 3. Resume & GitHub Blueprint
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
                <p>Record your verifiable portfolio proof and execute the tear-down runbook to ensure \$0 billing.</p>
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
                    Follow every step and verify in your AWS billing console. We cannot guarantee your account shows \$0 if a step is skipped or AWS free-tier terms change.
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

            {/* GitHub README Blueprint Template */}
            <div className="portfolio-section">
              <div className="pfs-head">
                <h4>GitHub README.md Complete Blueprint Template</h4>
                <button
                  type="button"
                  className="btn-copy-sm"
                  onClick={() => handleCopy(generateReadmeTemplate(activeProject), 'gh-readme')}
                >
                  {copiedId === 'gh-readme' ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                  <span>{copiedId === 'gh-readme' ? 'Copied' : 'Copy Complete README.md'}</span>
                </button>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 10px' }}>
                Paste this into your GitHub repository’s <code>README.md</code>. Includes architecture diagrams, CLI steps, free tier guarantee, and verified teardown proof.
              </p>
              <div style={{
                background: '#090d16',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '14px',
                maxHeight: '260px',
                overflowY: 'auto',
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.75rem',
                color: '#94a3b8',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.45
              }}>
                {generateReadmeTemplate(activeProject)}
              </div>
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
