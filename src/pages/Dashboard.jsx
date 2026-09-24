import { Activity, ArrowRight, BarChart3, BriefcaseBusiness, CheckCircle2, Cloud, Flame, Layers, Rocket, ShieldCheck, Target, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import ScoreCard from '../components/ScoreCard'
import ProgressBar from '../components/ProgressBar'
import ChallengeCard from '../components/ChallengeCard'
import SecurityMaturityAssessment from '../components/SecurityMaturityAssessment'
import { useChallenges } from '../context/ChallengeContext'

import JobProcessFramework from '../components/JobProcessFramework'
import { Terminal, Code2, FolderGit2 } from 'lucide-react'

const studyAreas = [
  { key: 'iam', label: 'IAM Security', description: 'Policies, privilege boundaries, and trust relationships' },
  { key: 's3', label: 'S3 Data Security', description: 'Bucket protection, KMS encryption, and access policies' },
  { key: 'network', label: 'Network Security', description: 'Security groups, routing paths, and perimeter isolation' },
  { key: 'monitoring', label: 'Monitoring & Logging', description: 'CloudTrail auditing, alert thresholds, and detection' },
  { key: 'architecture', label: 'Architecture Security', description: 'Multi-finding system reviews and compound risk' },
]

export default function Dashboard() {
  const {
    challenges,
    threatScenarios,
    investigations,
    progress,
    completedCount,
    totalScore,
    scorePercent,
    architectureReviewedCount,
    simulatorCompletedCount,
    investigationCompletedCount,
    investigationAverageScore,
    internshipReadiness,
    realLabs,
    completedLabsCount,
    completedLabStepsCount,
  } = useChallenges()

  const next = challenges.find(challenge => !progress.completed[challenge.id]) || challenges[0]
  const nextTicket = threatScenarios.find(t => progress.simulatorScores?.[t.id] === undefined) || threatScenarios[0]
  const nextInvestigation = investigations?.find(i => progress.investigationScores?.[i.id] === undefined) || investigations?.[0]

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  return (
    <main className="page-shell dashboard">
      <div className="dashboard-header">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" /> {dateLabel.toUpperCase()} /// SOC OPERATIONS DASHBOARD
          </div>
          <h1>
            Cloud Security Operations<span>.</span>
          </h1>
          <p>
            Track your Security Thinking Score, live security incident investigations, on-call tickets, architecture reviews, and organizational maturity.
          </p>
        </div>
        <div className="dashboard-header-actions">
          <Link className="button button-primary" to={nextInvestigation ? `/investigations/${nextInvestigation.id}` : '/investigations'}>
            <ShieldCheck size={16} /> Open Incident Lab ({investigations.length - investigationCompletedCount})
          </Link>
          <Link className="button button-ghost" to="/categories">
            <Layers size={15} /> Scenario Catalog
          </Link>
        </div>
      </div>

      {/* Core KPIs */}
      <div className="score-grid">
        <ScoreCard
          label="SECURITY THINKING SCORE"
          value={`${scorePercent}/100`}
          detail={`${totalScore.toLocaleString()} XP earned`}
        />
        <ScoreCard
          label="INVESTIGATIONS SOLVED"
          value={completedCount}
          detail={`${challenges.length - completedCount} remaining in catalog`}
          tone="orange"
        />
        <ScoreCard
          label="ARCHITECTURE REVIEWS"
          value={architectureReviewedCount}
          detail="5 signature risk lenses"
          tone="purple"
        />
        <ScoreCard
          label="INTERNSHIP READINESS"
          value={`${internshipReadiness}%`}
          detail={`${simulatorCompletedCount} weekly tickets resolved`}
          tone="green"
        />
      </div>

      {/* Learning Analytics: Study Areas & Progress Trends */}
      <section className="dashboard-analytics-panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">LEARNING ANALYTICS</div>
            <h2>Study Areas & Progress Trends</h2>
          </div>
          <span className="analytics-trend-badge">
            <Flame size={14} /> Practice Active • Streak Protected
          </span>
        </div>

        <div className="study-areas-grid">
          {studyAreas.map(area => {
            const items = challenges.filter(c => c.id.startsWith(area.key))
            const complete = items.filter(c => progress.completed[c.id]).length
            const percent = Math.round((complete / Math.max(1, items.length)) * 100)

            return (
              <div className="study-area-card" key={area.key}>
                <div className="study-area-head">
                  <strong>{area.label}</strong>
                  <span>{percent}%</span>
                </div>
                <div className="study-progress-track">
                  <i style={{ width: `${percent}%` }} />
                </div>
                <small>{complete} of {items.length} completed</small>
              </div>
            )
          })}
        </div>
      </section>

      {/* Security Maturity Assessment */}
      <SecurityMaturityAssessment compact />

      {/* Flagship Security Investigation Simulator Section */}
      <section className="flagship-simulator-banner">
        <div className="flagship-banner-copy">
          <div className="eyebrow">
            <span className="pulse-dot" /> FLAGSHIP FEATURE /// 25 PRODUCTION INCIDENT INVESTIGATIONS
          </div>
          <h2>Security Incident Investigation Simulator</h2>
          <p>
            Triage raw IAM policies, S3 buckets, network routes, CloudTrail events, and architecture blueprints.
            Learn real Cloud Security Analyst thinking: identify verified vulnerabilities, assess blast radius, and execute step-by-step remediation.
          </p>
          <div className="flagship-banner-stats">
            <div className="flagship-stat">
              <span>RESOLVED INCIDENTS</span>
              <strong>{investigationCompletedCount} / {investigations.length}</strong>
            </div>
            <div className="flagship-stat">
              <span>TRIAGE ACCURACY</span>
              <strong className="text-cyan">{investigationAverageScore}%</strong>
            </div>
            <div className="flagship-stat">
              <span>COVERAGE</span>
              <strong>5 Domains (IAM, S3, Net, Mon, Arch)</strong>
            </div>
          </div>
        </div>
        <div className="flagship-banner-action">
          <Link
            className="button button-primary btn-large"
            to={nextInvestigation ? `/investigations/${nextInvestigation.id}` : '/investigations'}
          >
            <ShieldCheck size={18} />
            <span>Launch Investigation Simulator</span>
            <ArrowRight size={17} />
          </Link>
          <Link to="/investigations" className="flagship-view-all-link">
            Browse all 25 incident tickets &rarr;
          </Link>
        </div>
      </section>

      {/* Real Hands-On Labs & 6-Stage SOP Framework Banner */}
      <section className="flagship-simulator-banner" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)', borderColor: 'rgba(14, 165, 233, 0.25)' }}>
        <div className="flagship-banner-copy">
          <div className="eyebrow">
            <span className="pulse-dot" style={{ backgroundColor: 'var(--cyan)' }} /> REAL ENTERPRISE WORKFLOWS /// 16 HANDS-ON RUNBOOK LABS
          </div>
          <h2>Real Cloud Security Job Labs & SOP Guides</h2>
          <p>
            Experience how Cloud Security Engineers execute tickets in Fortune 500 environments.
            Follow click-by-click AWS console navigation, run live AWS CLI commands in the interactive CloudShell sandbox, and master the 6-stage industry standard operating procedure.
          </p>
          <div className="flagship-banner-stats">
            <div className="flagship-stat">
              <span>LABS MASTERED</span>
              <strong>{completedLabsCount} / {realLabs?.length || 16}</strong>
            </div>
            <div className="flagship-stat">
              <span>SOP STEPS COMPLETED</span>
              <strong className="text-cyan">{completedLabStepsCount} Steps</strong>
            </div>
            <div className="flagship-stat">
              <span>DUAL-MODE GUIDANCE</span>
              <strong>AWS CLI + Console GUI</strong>
            </div>
          </div>
        </div>
        <div className="flagship-banner-action">
          <Link
            className="button button-primary btn-large"
            to="/labs"
            style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
          >
            <Terminal size={18} />
            <span>Open Real Labs & Runbooks</span>
            <ArrowRight size={17} />
          </Link>
          <Link to="/labs" className="flagship-view-all-link">
            Explore 16 production runbooks & SOPs &rarr;
          </Link>
        </div>
      </section>

      {/* 6-Stage Cloud Security Job SOP Lifecycle */}
      <JobProcessFramework />

      {/* From Scratch to Solved: Job Playbook Engine Banner */}
      <section className="flagship-simulator-banner" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)', borderColor: 'rgba(168, 85, 247, 0.25)' }}>
        <div className="flagship-banner-copy">
          <div className="eyebrow">
            <span className="pulse-dot" style={{ backgroundColor: 'var(--purple)' }} /> END-TO-END SECOPS PLAYBOOKS /// FROM SCRATCH TO SOLVED
          </div>
          <h2>Cloud Security Job Playbook Engine & Forensic Studio</h2>
          <p>
            Experience the complete enterprise problem-solving lifecycle: Inbound GuardDuty JSON alerts &rarr; 5-minute bridge scoping &rarr; smoking gun extraction &rarr; minute-0 containment &rarr; Terraform IaC fixes &rarr; CISO post-mortem briefings.
          </p>
          <div className="flagship-banner-stats">
            <div className="flagship-stat">
              <span>WORKFLOW STAGES</span>
              <strong>7-Step Full SOP</strong>
            </div>
            <div className="flagship-stat">
              <span>FORENSIC QUERY STUDIO</span>
              <strong style={{ color: 'var(--purple, #c084fc)' }}>Athena & CloudWatch</strong>
            </div>
            <div className="flagship-stat">
              <span>EXECUTIVE REPORTING</span>
              <strong>CISO Post-Mortems (.md)</strong>
            </div>
          </div>
        </div>
        <div className="flagship-banner-action">
          <Link
            className="button button-primary btn-large"
            to="/playbooks"
            style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)' }}
          >
            <Layers size={18} />
            <span>Launch Playbook Engine</span>
            <ArrowRight size={17} />
          </Link>
          <Link to="/playbooks" className="flagship-view-all-link">
            Explore 7-step playbooks & query logs &rarr;
          </Link>
        </div>
      </section>

      {/* 100% Free-Tier Capstone Projects Banner */}
      <section className="flagship-simulator-banner" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
        <div className="flagship-banner-copy">
          <div className="eyebrow">
            <span className="pulse-dot" style={{ backgroundColor: 'var(--green, #10b981)' }} /> 100% FREE TIER GUARANTEE /// 4 RESUME-READY CAPSTONE PROJECTS
          </div>
          <h2>Cloud Security Capstone Projects ($0 AWS Cost Guarantee)</h2>
          <p>
            Build and showcase high-impact enterprise security tools in your personal AWS account without paying a dime. Includes automated $0.01 AWS budget alarms, click-by-click tear-down runbooks, and ready-to-paste resume impact statements.
          </p>
          <div className="flagship-banner-stats">
            <div className="flagship-stat">
              <span>ESTIMATED AWS COST</span>
              <strong style={{ color: 'var(--green, #4ade80)' }}>$0.00 (Free Tier)</strong>
            </div>
            <div className="flagship-stat">
              <span>RESUME IMPACT</span>
              <strong>STAR Interview Ready</strong>
            </div>
            <div className="flagship-stat">
              <span>TEAR-DOWN SAFETY</span>
              <strong>1-Click CLI Teardown</strong>
            </div>
          </div>
        </div>
        <div className="flagship-banner-action">
          <Link
            className="button button-primary btn-large"
            to="/projects"
            style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
          >
            <FolderGit2 size={18} />
            <span>Launch Capstone Projects</span>
            <ArrowRight size={17} />
          </Link>
          <Link to="/projects" className="flagship-view-all-link">
            View 4 Free-Tier Projects & Safety Setup &rarr;
          </Link>
        </div>
      </section>

      {/* Active Workspaces */}
      <div className="dashboard-grid">
        {/* Next Investigation */}
        <section className="panel continue-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">UP NEXT / SCENARIO LAB</div>
              <h2>Continue Challenge Track</h2>
            </div>
            <Link to="/categories" className="panel-link">
              View all {challenges.length}
            </Link>
          </div>
          <ChallengeCard challenge={next} />
        </section>

        {/* Next Weekly Internship Ticket */}
        <section className="panel ticket-jump-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">ON-CALL / INTERNSHIP ROTATION</div>
              <h2>{nextTicket.week}: {nextTicket.weekTopic}</h2>
            </div>
            <Link to="/internship-simulator" className="panel-link">
              Inbox ({threatScenarios.length})
            </Link>
          </div>
          <div className="ticket-jump-card">
            <div className="ticket-jump-meta">
              <span className="ticket-badge">{nextTicket.ticket}</span>
              <span className={`risk-tag risk-${nextTicket.riskLevel.toLowerCase()}`}>
                {nextTicket.riskLevel} Risk
              </span>
            </div>
            <h3>{nextTicket.title}</h3>
            <p>{nextTicket.incidentSummary}</p>
            <div className="ticket-jump-actions">
              <Link className="button button-primary" to="/internship-simulator">
                Triage Incident Ticket <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
