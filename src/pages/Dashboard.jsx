import { Activity, ArrowRight, BarChart3, BriefcaseBusiness, CheckCircle2, Cloud, Flame, Layers, Rocket, ShieldCheck, Target, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import ScoreCard from '../components/ScoreCard'
import ProgressBar from '../components/ProgressBar'
import ChallengeCard from '../components/ChallengeCard'
import SecurityMaturityAssessment from '../components/SecurityMaturityAssessment'
import { useChallenges } from '../context/ChallengeContext'

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
