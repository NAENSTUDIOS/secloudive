import { ArrowDown, CheckCircle2, Circle, Flame, Rocket, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'

const careerStages = [
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
  const context = useChallenges()
  const progress = context?.progress || { completed: {}, architectureScores: {}, simulatorScores: {} }
  const completedCount = context?.completedCount || 0
  const architectureReviewedCount = context?.architectureReviewedCount || 0
  const simulatorCompletedCount = context?.simulatorCompletedCount || 0

  const currentLevelIndex = readiness >= 80 ? 4 : readiness >= 60 ? 3 : readiness >= 35 ? 2 : readiness >= 15 ? 1 : 0

  // Calculate missing skills dynamically based on learner telemetry
  function getMissingSkills(stageIndex) {
    const stage = careerStages[stageIndex]
    if (stageIndex < currentLevelIndex) return [] // Already mastered

    const missing = []
    if (stageIndex >= 0 && completedCount < 5) missing.push('AWS IAM Fundamentals')
    if (stageIndex >= 1 && completedCount < 15) missing.push('VPC Route Tables')
    if (stageIndex >= 2 && completedCount < 30) missing.push('Audit Trail Analysis')
    if (stageIndex >= 3 && simulatorCompletedCount < 4) missing.push('Attack Timeline Reconstruction')
    if (stageIndex >= 4 && architectureReviewedCount < 3) missing.push('Architecture Security Reviews')

    // Filter to skills actually in this stage
    const matched = stage.requiredSkills.filter(skill => missing.includes(skill))
    return matched.length ? matched : (stageIndex === currentLevelIndex ? [stage.requiredSkills[stage.requiredSkills.length - 1]] : stage.requiredSkills)
  }

  return (
    <section className={`career-roadmap ${compact ? 'is-compact' : ''}`} aria-labelledby="career-roadmap-title">
      <div className="career-roadmap-heading">
        <div>
          <div className="report-section-label">
            <Rocket size={13} /> CAREER DEVELOPMENT ROADMAP
          </div>
          <h2 id="career-roadmap-title">From beginner to Cloud Security Engineer.</h2>
          <p>
            Track your progression across all 5 career milestones: required skills, missing gaps, recommended portfolio projects, and tactical next steps.
          </p>
        </div>
        <div className="roadmap-readiness">
          <strong>{readiness}%</strong>
          <span>
            internship
            <br />
            readiness
          </span>
        </div>
      </div>

      <div className="career-roadmap-list">
        {careerStages.map((stage, index) => {
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
              {index < careerStages.length - 1 && <ArrowDown className="career-roadmap-arrow" size={15} />}
            </div>
          )
        })}
      </div>
    </section>
  )
}
