import { useState } from 'react'
import { 
  Activity, 
  ArrowRight, 
  BarChart3, 
  BriefcaseBusiness, 
  CheckCircle2, 
  Cloud, 
  Flame, 
  Layers, 
  Rocket, 
  ShieldCheck, 
  Target, 
  Trophy,
  Terminal, 
  Code2, 
  FolderGit2, 
  Skull, 
  Flag,
  Radio,
  FileCode2,
  Sparkles,
  ExternalLink,
  GraduationCap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ScoreCard from '../components/ScoreCard'
import ProgressBar from '../components/ProgressBar'
import ChallengeCard from '../components/ChallengeCard'
import SecurityMaturityAssessment from '../components/SecurityMaturityAssessment'
import { useChallenges } from '../context/ChallengeContext'
import JobProcessFramework from '../components/JobProcessFramework'

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

  // Clean Tabbed Command Center state
  const [activeTrackTab, setActiveTrackTab] = useState('battlerooms') // 'battlerooms' | 'investigations' | 'labs' | 'playbooks' | 'projects' | 'sop'

  const next = challenges.find(challenge => !progress.completed[challenge.id]) || challenges[0]
  const nextTicket = threatScenarios.find(t => progress.simulatorScores?.[t.id] === undefined) || threatScenarios[0]
  const nextInvestigation = investigations?.find(i => progress.investigationScores?.[i.id] === undefined) || investigations?.[0]

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  return (
    <main className="page-shell dashboard clean-dashboard">
      {/* Top Header */}
      <div className="dashboard-header clean-dashboard-header">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" /> {dateLabel.toUpperCase()} /// SOC OPERATIONS COMMAND
          </div>
          <h1>
            Cloud Security Operations<span>.</span>
          </h1>
          <p>
            Real-time security posture, incident triage readiness, active technical debt investigations, and enterprise battle rooms.
          </p>
        </div>
        <div className="dashboard-header-actions">
          <Link className="button button-primary" to={nextInvestigation ? `/investigations/${nextInvestigation.id}` : '/investigations'}>
            <ShieldCheck size={16} /> Quick Launch Incident ({investigations.length - investigationCompletedCount} Open)
          </Link>
          <Link className="button button-ghost" to="/categories">
            <Layers size={15} /> All Scenarios
          </Link>
        </div>
      </div>

      {/* Core KPIs Score Grid */}
      <div className="score-grid clean-score-grid">
        <ScoreCard
          label="SECURITY THINKING SCORE"
          value={`${scorePercent}/100`}
          detail={`${totalScore.toLocaleString()} XP earned`}
        />
        <ScoreCard
          label="INVESTIGATIONS SOLVED"
          value={completedCount}
          detail={`${challenges.length - completedCount} in catalog`}
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
          detail={`${simulatorCompletedCount} tickets resolved`}
          tone="green"
        />
      </div>

      {/* Learning Analytics: Study Areas & Progress Trends */}
      <section className="dashboard-analytics-panel clean-panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">LEARNING ANALYTICS</div>
            <h2>Study Areas & Domain Mastery</h2>
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
              <div className="study-area-card clean-study-card" key={area.key}>
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

      {/* ======================================================== */}
      {/* UNIFIED INTERACTIVE COMMAND CENTER (Replaces Stacked Banners) */}
      {/* ======================================================== */}
      <section className="command-center-section">
        <div className="command-center-header">
          <div>
            <div className="eyebrow">
              <Sparkles size={12} className="text-cyan" />
              <span>INTERACTIVE PRACTICE MODULES</span>
            </div>
            <h2>Specialized Training Tracks & Arenas</h2>
            <p>Select an operational track to launch dedicated enterprise workflows, forensic queries, or CTF challenges.</p>
          </div>
        </div>

        {/* Clean Segmented Tab Switcher */}
        <div className="track-tab-bar" role="tablist">
          <button 
            type="button" 
            className={`track-tab-btn ${activeTrackTab === 'battlerooms' ? 'active tab-rose' : ''}`}
            onClick={() => setActiveTrackTab('battlerooms')}
          >
            <Skull size={15} />
            <span>Battle Rooms (CTF)</span>
            <span className="tab-pill pill-rose">HOT</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn ${activeTrackTab === 'rampup' ? 'active tab-emerald' : ''}`}
            onClick={() => setActiveTrackTab('rampup')}
          >
            <GraduationCap size={15} />
            <span>Ramp-Up & All Labs</span>
            <span className="tab-pill pill-emerald">20 Labs</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn ${activeTrackTab === 'investigations' ? 'active tab-cyan' : ''}`}
            onClick={() => setActiveTrackTab('investigations')}
          >
            <ShieldCheck size={15} />
            <span>Incident Simulator</span>
            <span className="tab-pill">25 Tickets</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn ${activeTrackTab === 'labs' ? 'active tab-sky' : ''}`}
            onClick={() => setActiveTrackTab('labs')}
          >
            <Terminal size={15} />
            <span>16 Enterprise Labs</span>
            <span className="tab-pill">SOP Runbooks</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn ${activeTrackTab === 'playbooks' ? 'active tab-purple' : ''}`}
            onClick={() => setActiveTrackTab('playbooks')}
          >
            <FileCode2 size={15} />
            <span>Job Playbooks</span>
            <span className="tab-pill">7-Stage</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn ${activeTrackTab === 'projects' ? 'active tab-emerald' : ''}`}
            onClick={() => setActiveTrackTab('projects')}
          >
            <FolderGit2 size={15} />
            <span>Portfolio Projects</span>
            <span className="tab-pill pill-emerald">$0 Cost</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn ${activeTrackTab === 'sop' ? 'active tab-amber' : ''}`}
            onClick={() => setActiveTrackTab('sop')}
          >
            <BriefcaseBusiness size={15} />
            <span>6-Stage SOP Framework</span>
          </button>
        </div>

        {/* Tab: Career Ramp-Up & Master Directory */}
        {activeTrackTab === 'rampup' && (
          <div className="track-featured-card card-rampup animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" style={{ backgroundColor: '#10b981' }} /> CAREER BLUEPRINTS & MASTER LAB DIRECTORY /// ALL HYPERSCALERS
              </div>
              <h3>Cloud Security Roles, Ramp-Up Guides & 20 Master Labs</h3>
              <p>
                Authoritative career blueprints for every cloud security role (Cloud Security Engineer, IAM Architect, DevSecOps Lead, Forensics Analyst, and Security Architect), complete with authentic original links to AWS Workshops, TryHackMe cloud rooms, HackTheBox machines, and foundational labs (Linux, Python Boto3, VPC Networking, Docker, and Terraform IaC).
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>CAREER ROLES</span>
                  <strong className="text-emerald">5 Key Roles</strong>
                </div>
                <div className="metric-box">
                  <span>CURATED LABS</span>
                  <strong className="text-cyan">20 Original Labs</strong>
                </div>
                <div className="metric-box">
                  <span>FOUNDATION SCOPE</span>
                  <strong className="text-purple">Linux • Py • Net • Docker • IaC</strong>
                </div>
              </div>
              <div className="track-actions">
                <Link to="/ramp-up" className="button button-primary">
                  <GraduationCap size={16} /> Explore All Roles & Labs <ArrowRight size={15} />
                </Link>
                <Link to="/about" className="button button-ghost">
                  Career Readiness Hub
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Battle Rooms (TryHackMe / HackTheBox Style) */}
        {activeTrackTab === 'battlerooms' && (
          <div className="track-featured-card card-battlerooms animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" style={{ backgroundColor: '#ef4444' }} /> PURPLE TEAM ARENA /// TRYHACKME & HACKTHEBOX STYLE
              </div>
              <h3>Cloud Security Battle Rooms & CTF Arenas</h3>
              <p>
                Experience offensive cloud hacking and defensive engineering: exploit AWS Bedrock Agent prompt injection, SSRF into IMDSv1, bypass GitHub Actions OIDC trust, and submit real CTF flags to prove your layoff-proof skills.
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>ARENA ROOMS</span>
                  <strong className="text-rose">6 Battle Rooms</strong>
                </div>
                <div className="metric-box">
                  <span>PERSPECTIVES</span>
                  <strong>Red vs Blue Team</strong>
                </div>
                <div className="metric-box">
                  <span>THREAT SCOPE</span>
                  <strong>GenAI, IMDSv2, CI/CD, EKS</strong>
                </div>
              </div>
            </div>
            <div className="track-card-action">
              <Link to="/battle-rooms" className="button button-primary btn-large btn-rose">
                <Skull size={18} />
                <span>Launch Battle Rooms</span>
                <ArrowRight size={17} />
              </Link>
              <span className="track-helper-note">Capture verification flags & earn XP</span>
            </div>
          </div>
        )}

        {/* Tab 2: Incident Simulator */}
        {activeTrackTab === 'investigations' && (
          <div className="track-featured-card card-investigations animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" /> FLAGSHIP FEATURE /// 25 PRODUCTION INCIDENT INVESTIGATIONS
              </div>
              <h3>Security Incident Investigation Simulator</h3>
              <p>
                Triage raw IAM policies, S3 buckets, network routes, CloudTrail events, and architecture blueprints.
                Learn real Cloud Security Analyst thinking: identify verified vulnerabilities, assess blast radius, and execute step-by-step remediation.
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>RESOLVED INCIDENTS</span>
                  <strong>{investigationCompletedCount} / {investigations.length}</strong>
                </div>
                <div className="metric-box">
                  <span>TRIAGE ACCURACY</span>
                  <strong className="text-cyan">{investigationAverageScore}%</strong>
                </div>
                <div className="metric-box">
                  <span>COVERAGE</span>
                  <strong>5 Domains (IAM, S3, Net, Mon, Arch)</strong>
                </div>
              </div>
            </div>
            <div className="track-card-action">
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
          </div>
        )}

        {/* Tab 3: 16 Enterprise SOP Labs */}
        {activeTrackTab === 'labs' && (
          <div className="track-featured-card card-labs animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" style={{ backgroundColor: 'var(--cyan)' }} /> REAL ENTERPRISE WORKFLOWS /// 16 HANDS-ON RUNBOOK LABS
              </div>
              <h3>Real Cloud Security Job Labs & SOP Guides</h3>
              <p>
                Experience how Cloud Security Engineers execute tickets in Fortune 500 environments.
                Follow click-by-click AWS console navigation, run live AWS CLI commands in the interactive CloudShell sandbox, and master the 6-stage industry standard operating procedure.
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>LABS MASTERED</span>
                  <strong>{completedLabsCount} / {realLabs?.length || 16}</strong>
                </div>
                <div className="metric-box">
                  <span>SOP STEPS COMPLETED</span>
                  <strong className="text-cyan">{completedLabStepsCount} Steps</strong>
                </div>
                <div className="metric-box">
                  <span>DUAL-MODE GUIDANCE</span>
                  <strong>AWS CLI + Console GUI</strong>
                </div>
              </div>
            </div>
            <div className="track-card-action">
              <Link
                className="button button-primary btn-large btn-sky"
                to="/labs"
              >
                <Terminal size={18} />
                <span>Open 16 Real Labs</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/labs" className="flagship-view-all-link">
                Explore all 16 production runbooks &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Tab 4: Job Playbooks Engine */}
        {activeTrackTab === 'playbooks' && (
          <div className="track-featured-card card-playbooks animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" style={{ backgroundColor: 'var(--purple)' }} /> END-TO-END SECOPS PLAYBOOKS /// FROM SCRATCH TO SOLVED
              </div>
              <h3>Cloud Security Job Playbook Engine & Forensic Studio</h3>
              <p>
                Experience the complete enterprise problem-solving lifecycle: Inbound GuardDuty JSON alerts &rarr; 5-minute bridge scoping &rarr; smoking gun extraction &rarr; minute-0 containment &rarr; Terraform IaC fixes &rarr; CISO post-mortem briefings.
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>WORKFLOW STAGES</span>
                  <strong>7-Step Full SOP</strong>
                </div>
                <div className="metric-box">
                  <span>FORENSIC QUERY STUDIO</span>
                  <strong className="text-purple">Athena & CloudWatch</strong>
                </div>
                <div className="metric-box">
                  <span>EXECUTIVE REPORTING</span>
                  <strong>CISO Post-Mortems (.md)</strong>
                </div>
              </div>
            </div>
            <div className="track-card-action">
              <Link
                className="button button-primary btn-large btn-purple"
                to="/playbooks"
              >
                <Layers size={18} />
                <span>Launch Playbook Engine</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/playbooks" className="flagship-view-all-link">
                Explore 7-step playbooks & query logs &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Tab 5: Portfolio Projects ($0 AWS Cost Guarantee) */}
        {activeTrackTab === 'projects' && (
          <div className="track-featured-card card-projects animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" style={{ backgroundColor: 'var(--green, #10b981)' }} /> 100% FREE TIER GUARANTEE /// 4 RESUME-READY CAPSTONE PROJECTS
              </div>
              <h3>Cloud Security Capstone Projects ($0 AWS Cost Guarantee)</h3>
              <p>
                Build and showcase high-impact enterprise security tools in your personal AWS account without paying a dime. Includes automated $0.01 AWS budget alarms, click-by-click tear-down runbooks, and ready-to-paste resume impact statements.
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>ESTIMATED AWS COST</span>
                  <strong className="text-emerald">$0.00 (Free Tier)</strong>
                </div>
                <div className="metric-box">
                  <span>RESUME IMPACT</span>
                  <strong>STAR Interview Ready</strong>
                </div>
                <div className="metric-box">
                  <span>TEAR-DOWN SAFETY</span>
                  <strong>1-Click CLI Teardown</strong>
                </div>
              </div>
            </div>
            <div className="track-card-action">
              <Link
                className="button button-primary btn-large btn-emerald"
                to="/projects"
              >
                <FolderGit2 size={18} />
                <span>Launch Capstone Projects</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/projects" className="flagship-view-all-link">
                View 4 Free-Tier Projects & Safety Setup &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Tab 6: 6-Stage Job SOP Lifecycle */}
        {activeTrackTab === 'sop' && (
          <div className="animate-reveal" style={{ marginTop: '14px' }}>
            <JobProcessFramework />
          </div>
        )}
      </section>

      {/* Active Workspaces Bento Grid */}
      <div className="dashboard-grid clean-dashboard-grid">
        {/* Next Investigation */}
        <section className="panel continue-panel clean-panel">
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
        <section className="panel ticket-jump-panel clean-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">ON-CALL / INTERNSHIP ROTATION</div>
              <h2>{nextTicket.week}: {nextTicket.weekTopic}</h2>
            </div>
            <Link to="/internship-simulator" className="panel-link">
              Inbox ({threatScenarios.length})
            </Link>
          </div>
          <div className="ticket-jump-card clean-ticket-card">
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
