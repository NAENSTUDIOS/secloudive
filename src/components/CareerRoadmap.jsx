import { useState } from 'react'
import { 
  ArrowDown, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Rocket, 
  ShieldAlert, 
  ShieldCheck, 
  Briefcase, 
  Compass, 
  Layers, 
  Award, 
  Terminal, 
  Cpu, 
  BookOpen,
  DollarSign,
  ChevronRight
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'

const defaultCareerStages = [
  {
    title: 'Beginner',
    requiredSkills: ['Shared Responsibility Model', 'AWS IAM Fundamentals', 'S3 Access Basics'],
    project: 'Map an AWS account threat surface & enforce root account MFA guardrails',
    nextStep: 'Complete introductory IAM policy analysis and public S3 bucket investigations',
    threshold: 15,
  },
  {
    title: 'AWS Cloud Practitioner',
    requiredSkills: ['Core AWS Services', 'Identity vs Resource Policies', 'VPC Route Tables', 'CloudTrail Logging'],
    project: 'Write an AWS account security baseline checklist based on CIS benchmarks',
    nextStep: 'Audit network boundaries, open security groups, and storage encryption drift',
    threshold: 35,
  },
  {
    title: 'Cloud Security Learner',
    requiredSkills: ['Least Privilege IAM Policies', 'S3 Bucket Encryption & KMS', 'Security Group Chaining', 'Audit Trail Analysis'],
    project: 'Investigate and remediate an active data leakage path with CloudTrail proof',
    nextStep: 'Practice privilege escalation detection and cross-account trust boundary analysis',
    threshold: 60,
  },
  {
    title: 'Security Analyst',
    requiredSkills: ['Incident Detection & Triage', 'GuardDuty Detections', 'Attack Timeline Reconstruction', 'Blast Radius Scoping'],
    project: 'Build an end-to-end incident response timeline, evidence dossier, and executive brief',
    nextStep: 'Work on-call security tickets in the Cloud Security Internship Simulator',
    threshold: 80,
  },
  {
    title: 'Cloud Security Engineer',
    requiredSkills: ['Multi-Account Guardrails (SCPs)', 'Architecture Security Reviews', 'Threat Modeling', 'Automated Remediation'],
    project: 'Design a resilient multi-tenant SaaS architecture with zero public database exposure',
    nextStep: 'Lead multi-finding architecture reviews and publish your Security Thinking Report',
    threshold: 100,
  },
]

export default function CareerRoadmap({ readiness = 0, compact = false }) {
  const {
    progress,
    completedCount = 0,
    architectureReviewedCount = 0,
    simulatorCompletedCount = 0,
    roleRoadmaps,
    targetCareerRole,
    setTargetCareerRole
  } = useChallenges()

  const [viewMode, setViewMode] = useState('role') // 'role' | 'progression'
  const [selectedRoleId, setSelectedRoleId] = useState('cloud-security-engineer')

  const roadmaps = roleRoadmaps || []
  const getRoleId = r => r?.roleId || r?.id || ''
  const activeRoadmap = roadmaps.find(r => getRoleId(r) === selectedRoleId) || roadmaps[0] || {}

  const currentLevelIndex = readiness >= 80 ? 4 : readiness >= 60 ? 3 : readiness >= 35 ? 2 : readiness >= 15 ? 1 : 0

  // Calculate missing skills dynamically based on learner telemetry
  function getMissingSkills(stageIndex) {
    const stage = defaultCareerStages[stageIndex]
    if (stageIndex < currentLevelIndex) return [] // Already mastered

    const missing = []
    if (stageIndex >= 0 && completedCount < 5) missing.push('AWS IAM Fundamentals')
    if (stageIndex >= 1 && completedCount < 15) missing.push('VPC Route Tables')
    if (stageIndex >= 2 && completedCount < 30) missing.push('Audit Trail Analysis')
    if (stageIndex >= 3 && simulatorCompletedCount < 4) missing.push('Attack Timeline Reconstruction')
    if (stageIndex >= 4 && architectureReviewedCount < 3) missing.push('Architecture Security Reviews')

    const matched = stage.requiredSkills.filter(skill => missing.includes(skill))
    return matched.length ? matched : (stageIndex === currentLevelIndex ? [stage.requiredSkills[stage.requiredSkills.length - 1]] : stage.requiredSkills)
  }

  return (
    <section className={`career-roadmap ${compact ? 'is-compact' : ''}`} aria-labelledby="career-roadmap-title">
      <div className="career-roadmap-heading" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="report-section-label">
            <Rocket size={13} /> Career Roadmap • 11 Specialized Roles
          </div>
          <h2 id="career-roadmap-title" style={{ margin: '4px 0' }}>
            Role-Specific Mastery & Career Roadmaps.
          </h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>
            Comprehensive curricula across all 11 cloud security roles with required AWS services, phased learning order, hands-on labs, portfolio requirements, and hiring milestone benchmarks.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '8px', padding: '3px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
            <button
              type="button"
              onClick={() => setViewMode('role')}
              style={{
                background: viewMode === 'role' ? '#38bdf8' : 'none',
                color: viewMode === 'role' ? '#0f172a' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              11 Role Curricula
            </button>
            <button
              type="button"
              onClick={() => setViewMode('progression')}
              style={{
                background: viewMode === 'progression' ? '#38bdf8' : 'none',
                color: viewMode === 'progression' ? '#0f172a' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              5-Tier Milestones
            </button>
          </div>

          <div className="roadmap-readiness">
            <strong>{readiness}%</strong>
            <span>
              readiness
              <br />
              index
            </span>
          </div>
        </div>
      </div>

      {/* Role-Specific Deep Dive View */}
      {viewMode === 'role' && (
        <div style={{ marginTop: '20px' }}>
          {/* Role Horizontal Picker */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.15)'
          }}>
            {roadmaps.map(r => {
              const rId = getRoleId(r)
              const isSelected = selectedRoleId === rId || (!selectedRoleId && rId === getRoleId(activeRoadmap))
              return (
                <button
                  key={rId || r.title}
                  type="button"
                  onClick={() => {
                    setSelectedRoleId(rId)
                    if (setTargetCareerRole) setTargetCareerRole(r.title)
                  }}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                    color: isSelected ? '#38bdf8' : '#94a3b8',
                    border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.12)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Briefcase size={13} />
                  {r.title}
                </button>
              )
            })}
          </div>

          {activeRoadmap && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              {/* Header with Title and Salary */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    ROLE CURRICULUM BLUEPRINT
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    {activeRoadmap.title}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                    {activeRoadmap.summary || activeRoadmap.description}
                  </p>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '8px 14px', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>COMPENSATION BENCHMARK</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                    {activeRoadmap.salaryRange || activeRoadmap.targetSalary || '$120,000 - $160,000'}
                  </div>
                </div>
              </div>

              {/* Skills & AWS Services Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '22px' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px', padding: '14px', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                  <div style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} /> Core Required Skills
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(activeRoadmap.coreSkills || activeRoadmap.skills || []).map((s, idx) => (
                      <span key={idx} style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#bae6fd', fontSize: '0.76rem', padding: '2px 8px', borderRadius: '4px' }}>
                        {typeof s === 'string' ? s : (s?.name || JSON.stringify(s))}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px', padding: '14px', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                  <div style={{ fontSize: '0.76rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={14} /> Critical AWS Services
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(activeRoadmap.requiredServices || activeRoadmap.awsServices || []).map((srv, idx) => (
                      <span key={idx} style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fef08a', fontSize: '0.76rem', padding: '2px 8px', borderRadius: '4px' }}>
                        {typeof srv === 'string' ? srv : (srv?.name || JSON.stringify(srv))}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phased Learning Order */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={14} color="#38bdf8" /> Phased Learning Order
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {(activeRoadmap.learningOrder || []).map((lo, idx) => (
                    <div key={idx} style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                        {lo.phase || `PHASE ${lo.step || idx + 1}`} {lo.duration ? `/// ${lo.duration}` : ''}
                      </div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc', margin: '3px 0 6px 0' }}>
                        {typeof lo.title === 'string' ? lo.title : (lo.title?.name || JSON.stringify(lo.title))}
                      </div>
                      {Array.isArray(lo.topics) && lo.topics.length > 0 && (
                        <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.76rem', color: '#94a3b8' }}>
                          {lo.topics.map((top, tIdx) => (
                            <li key={tIdx}>{typeof top === 'string' ? top : (top?.name || JSON.stringify(top))}</li>
                          ))}
                        </ul>
                      )}
                      {lo.milestone && (
                        <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#10b981', borderTop: '1px solid rgba(148, 163, 184, 0.1)', paddingTop: '6px' }}>
                          <strong>Milestone:</strong> {typeof lo.milestone === 'string' ? lo.milestone : (lo.milestone?.name || JSON.stringify(lo.milestone))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects, Certifications & Portfolio Requirements */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.35)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Target Portfolio Project
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                    {activeRoadmap.portfolioProjects?.[0] || activeRoadmap.projects?.[0] || 'Build verifiable multi-account landing zone with least-privilege guardrails.'}
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.35)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#ec4899', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Certifications that Matter
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(activeRoadmap.certifications || []).map((cert, cIdx) => (
                      <span key={cIdx} style={{ background: 'rgba(236, 72, 153, 0.12)', color: '#fbcfe8', fontSize: '0.74rem', padding: '2px 8px', borderRadius: '4px' }}>
                        {typeof cert === 'string' ? cert : `${cert.name || cert.title || 'Certification'}${cert.priority ? ` (${cert.priority})` : ''}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5-Tier Milestones Progression View */}
      {viewMode === 'progression' && (
        <div className="career-roadmap-list" style={{ marginTop: '20px' }}>
          {defaultCareerStages.map((stage, index) => {
            const isComplete = index < currentLevelIndex
            const isCurrent = index === currentLevelIndex
            const missing = getMissingSkills(index)

            return (
              <div
                className={`career-roadmap-step ${isComplete ? 'is-complete' : ''} ${isCurrent ? 'is-current' : ''}`}
                key={stage.title}
              >
                <div className="career-roadmap-node">
                  {isComplete ? <CheckCircle2 size={16} /> : isCurrent ? <ShieldCheck size={16} /> : <Circle size={13} />}
                </div>
                <div className="career-roadmap-copy">
                  <div className="stage-badge-line">
                    <strong>{stage.title}</strong>
                    {isCurrent && <span className="current-badge"><Flame size={11} /> Active Milestone</span>}
                  </div>

                  <div className="roadmap-block">
                    <span className="block-label">REQUIRED SKILLS</span>
                    <div className="skill-pills">
                      {stage.requiredSkills.map(skill => (
                        <span key={skill} className="skill-pill">{skill}</span>
                      ))}
                    </div>
                  </div>

                  {!isComplete && missing.length > 0 && (
                    <div className="roadmap-block missing-block">
                      <span className="block-label missing-label"><ShieldAlert size={10} /> MISSING SKILLS</span>
                      <div className="skill-pills">
                        {missing.map(skill => (
                          <span key={skill} className="skill-pill missing-pill">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="roadmap-block">
                    <span className="block-label">PORTFOLIO PROJECT</span>
                    <small>{stage.project}</small>
                  </div>

                  <div className="roadmap-block">
                    <span className="block-label">NEXT STEP</span>
                    <p className="next-step-copy">{stage.nextStep}</p>
                  </div>
                </div>
                {index < defaultCareerStages.length - 1 && <ArrowDown className="career-roadmap-arrow" size={15} />}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
