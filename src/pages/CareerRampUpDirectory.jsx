import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Briefcase, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Clock, 
  Sparkles, 
  Award, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  FileCode2, 
  Radio, 
  Skull,
  DollarSign,
  GraduationCap
} from 'lucide-react'
import { rampUpCategories, masterRampUpLabs } from '../data/careerRampUpData'
import CopyrightDisclaimer from '../components/CopyrightDisclaimer'

export default function CareerRampUpDirectory() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [expandedLabId, setExpandedLabId] = useState(masterRampUpLabs[0]?.id || null)
  const [copiedCmdId, setCopiedCmdId] = useState(null)
  
  // Track completed labs in localStorage
  const [completedLabs, setCompletedLabs] = useState(() => {
    try {
      const saved = localStorage.getItem('secloudive_rampup_completed')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Save completion state
  const toggleCompleted = (id) => {
    setCompletedLabs(prev => {
      const updated = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem('secloudive_rampup_completed', JSON.stringify(updated))
      } catch (err) {
        console.error('Storage error', err)
      }
      return updated
    })
  }

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedCmdId(id)
    setTimeout(() => setCopiedCmdId(null), 2000)
  }

  // Filter labs
  const filteredLabs = useMemo(() => {
    return masterRampUpLabs.filter(lab => {
      const matchesCategory = selectedCategory === 'all' || lab.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'all' || lab.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase())
      const matchesSearch = !searchQuery || 
        lab.labTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.targetServices.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesDifficulty && matchesSearch
    })
  }, [selectedCategory, selectedDifficulty, searchQuery])

  const completedCount = Object.values(completedLabs).filter(Boolean).length
  const progressPercent = Math.round((completedCount / masterRampUpLabs.length) * 100)

  return (
    <main className="page-shell rampup-page">
      {/* Header Banner */}
      <div className="rampup-header">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" /> COMPREHENSIVE CURRICULUM & MASTER LAB DIRECTORY
          </div>
          <h1>
            Cloud Roles, Ramp-Up Guides & <em>All Labs.</em>
          </h1>
          <p>
            Master every Cloud Security role from scratch: authoritative career blueprints, original lab links, 
            step-by-step execution walkthroughs, and key skills learned across every Cloud Role, 
            TryHackMe, HackTheBox, and Core Foundations (Linux, Python, Networking, Docker, and IaC).
          </p>
        </div>

        {/* KPI Stats */}
        <div className="rampup-stats-box">
          <div className="stat-card">
            <span>TOTAL LABS</span>
            <strong className="text-cyan">{masterRampUpLabs.length} Modules</strong>
          </div>
          <div className="stat-card">
            <span>MASTERED</span>
            <strong className="text-emerald">{completedCount} Completed ({progressPercent}%)</strong>
          </div>
          <div className="stat-card">
            <span>ORIGINAL LINKS</span>
            <strong className="text-purple">100% Authentic</strong>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="category-chips-bar" role="tablist">
        {rampUpCategories.map(cat => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`cat-chip-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.label}</span>
              <span className="chip-count-pill">{cat.count}</span>
            </button>
          )
        })}
      </div>

      {/* Search and Secondary Filter Controls */}
      <div className="rampup-filter-strip">
        <div className="rampup-search-box">
          <Search size={15} />
          <input 
            type="text" 
            placeholder="Search by role, lab name, AWS service, tool, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rampup-filter-group">
          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="filter-select"
            aria-label="Filter by difficulty"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner / Easy</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced / Hard</option>
          </select>

          <button 
            type="button" 
            className="button button-ghost btn-sm"
            onClick={() => setExpandedLabId(expandedLabId ? null : masterRampUpLabs[0]?.id)}
          >
            {expandedLabId ? 'Collapse View' : 'Expand Top Lab'}
          </button>
        </div>
      </div>

      {/* Labs List Container */}
      <div className="rampup-labs-container">
        {filteredLabs.length === 0 ? (
          <div className="no-results-panel">
            <Sparkles size={24} className="text-amber" />
            <h3>No matching labs found</h3>
            <p>Try searching for other keywords like "IAM", "S3", "GuardDuty", "Python", or "Linux".</p>
            <button 
              type="button" 
              className="button button-ghost btn-sm" 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setSelectedDifficulty('all'); }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredLabs.map((lab, index) => {
            const isExpanded = expandedLabId === lab.id
            const isCompleted = !!completedLabs[lab.id]

            return (
              <article 
                key={lab.id} 
                className={`master-lab-card ${isExpanded ? 'is-expanded' : ''} ${isCompleted ? 'is-completed' : ''}`}
              >
                {/* Lab Card Header Summary */}
                <div 
                  className="lab-card-header-bar"
                  onClick={() => setExpandedLabId(isExpanded ? null : lab.id)}
                >
                  <div className="lch-left">
                    <button 
                      type="button"
                      className="completion-toggle-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleCompleted(lab.id)
                      }}
                      title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={18} className="text-emerald" />
                      ) : (
                        <Circle size={18} className="text-muted" />
                      )}
                    </button>

                    <div className="lch-info">
                      <div className="lch-tags">
                        <span className={`platform-pill tone-${lab.badgeTone}`}>
                          {lab.platform}
                        </span>
                        <span className="role-category-tag">
                          {lab.roleTitle}
                        </span>
                        <span className="difficulty-tag">
                          {lab.difficulty}
                        </span>
                        <span className="duration-tag">
                          <Clock size={11} /> {lab.estimatedTime}
                        </span>
                      </div>

                      <h3 className="lab-card-heading">
                        {index + 1}. {lab.labTitle}
                      </h3>

                      <div className="target-services-row">
                        {lab.targetServices.map(svc => (
                          <span key={svc} className="svc-micro-tag">{svc}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lch-actions" onClick={e => e.stopPropagation()}>
                    {/* Original Lab Link Button */}
                    <a 
                      href={lab.originalLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="button button-primary btn-sm btn-orig-link"
                      title="Open authentic lab in a new tab"
                    >
                      <span>Open Original Lab</span>
                      <ExternalLink size={13} />
                    </a>

                    <button 
                      type="button" 
                      className="btn-expand-toggle"
                      onClick={() => setExpandedLabId(isExpanded ? null : lab.id)}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? 'Collapse lab details' : 'Expand lab details'}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Guide Panel */}
                {isExpanded && (
                  <div className="lab-expanded-body animate-reveal">
                    {/* 1. Role Ramp-Up Guide Dossier */}
                    {lab.roleRampUpGuide && (
                      <div className="role-rampup-dossier-box">
                        <div className="dossier-head">
                          <Briefcase size={16} className="text-cyan" />
                          <h4>Cloud Role Career Context & Ramp-Up Profile</h4>
                        </div>
                        <p className="dossier-summary">{lab.roleRampUpGuide.summary}</p>
                        
                        <div className="dossier-grid">
                          <div className="dossier-item">
                            <span className="d-label">Day-in-the-Life Responsibilities:</span>
                            <span className="d-val">{lab.roleRampUpGuide.dayInLife}</span>
                          </div>
                          {lab.roleRampUpGuide.salaryRange && (
                            <div className="dossier-item">
                              <span className="d-label">Market Compensation:</span>
                              <span className="d-val text-emerald font-mono">{lab.roleRampUpGuide.salaryRange}</span>
                            </div>
                          )}
                          <div className="dossier-item">
                            <span className="d-label">Target Certifications:</span>
                            <div className="cert-tags">
                              {lab.roleRampUpGuide.keyCertifications.map(cert => (
                                <span key={cert} className="cert-pill">
                                  <Award size={11} /> {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. Step-by-Step Execution Walkthrough */}
                    <div className="execution-steps-section">
                      <div className="steps-section-title">
                        <Terminal size={15} className="text-purple" />
                        <h4>Step-by-Step Instructions to Complete</h4>
                        <span className="steps-count-badge">{lab.stepsToComplete.length} Stages</span>
                      </div>

                      <div className="steps-timeline-list">
                        {lab.stepsToComplete.map((stepItem, sIdx) => (
                          <div key={sIdx} className="step-timeline-row">
                            <div className="step-num-bubble">
                              {stepItem.step}
                            </div>
                            <div className="step-content-box">
                              <h5>{stepItem.title}</h5>
                              <p>{stepItem.instruction}</p>

                              {stepItem.commandOrAction && (
                                <div className="step-cmd-wrapper">
                                  <div className="cmd-header-bar">
                                    <span className="cmd-lang-label">
                                      {stepItem.commandOrAction.startsWith('aws ') ? 'AWS CLI' : 
                                       stepItem.commandOrAction.startsWith('terraform') ? 'Terraform' : 
                                       stepItem.commandOrAction.startsWith('docker') ? 'Docker' : 
                                       stepItem.commandOrAction.startsWith('curl') ? 'HTTP / Curl' : 
                                       stepItem.commandOrAction.startsWith('SELECT') ? 'SQL (Athena)' : 'Command / Action'}
                                    </span>
                                    <button 
                                      type="button" 
                                      className="btn-copy-code"
                                      onClick={() => handleCopy(stepItem.commandOrAction, `step-${lab.id}-${sIdx}`)}
                                    >
                                      {copiedCmdId === `step-${lab.id}-${sIdx}` ? (
                                        <>
                                          <Check size={12} className="text-emerald" />
                                          <span>Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={12} />
                                          <span>Copy Command</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <pre className="cmd-code-block">
                                    <code>{stepItem.commandOrAction}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. What You Have Learnt Callout */}
                    <div className="what-you-learned-card">
                      <div className="wyl-head">
                        <GraduationCap size={18} className="text-emerald" />
                        <h4>What You Have Learnt & Layoff-Proof Competencies</h4>
                      </div>

                      <div className="wyl-grid">
                        <div className="wyl-col">
                          <strong>Mastered Technical Skills:</strong>
                          <ul className="competency-list">
                            {lab.whatYouHaveLearnt.coreCompetencies.map((skill, k) => (
                              <li key={k}>
                                <CheckCircle2 size={13} className="text-emerald" />
                                <span>{skill}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="wyl-col interview-col">
                          <strong>Senior Engineer Interview Defense:</strong>
                          <blockquote className="interview-quote">
                            "{lab.whatYouHaveLearnt.interviewTalkingPoint}"
                          </blockquote>
                          <small>Use this explanation when recruiters or hiring managers ask about your hands-on cloud experience.</small>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="card-footer-controls">
                      <a 
                        href={lab.originalLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="button button-primary btn-sm"
                      >
                        <ExternalLink size={13} />
                        <span>Launch {lab.platform} Lab</span>
                      </a>

                      <button 
                        type="button"
                        className={`button ${isCompleted ? 'button-secondary' : 'button-ghost'} btn-sm`}
                        onClick={() => toggleCompleted(lab.id)}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 size={14} className="text-emerald" />
                            <span>Marked as Completed (Click to Reset)</span>
                          </>
                        ) : (
                          <>
                            <Circle size={14} />
                            <span>Mark Lab as Completed</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            )
          })
        )}
      </div>

      {/* Educational Fair Use & Trademark Compliance Footer */}
      <CopyrightDisclaimer />
    </main>
  )
}
