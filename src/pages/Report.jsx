import {
  Activity,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Download,
  ExternalLink,
  Eye,
  Fingerprint,
  Flame,
  Gauge,
  GitBranch,
  Layers3,
  Network,
  RefreshCcw,
  Rocket,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Terminal
} from 'lucide-react'
import SeCloudiveLogo from '../components/SeCloudiveLogo'
import { Link } from 'react-router-dom'
import ReportMetric from '../components/ReportMetric'
import BadgeCard from '../components/BadgeCard'
import SecurityMaturityAssessment from '../components/SecurityMaturityAssessment'
import { useChallenges } from '../context/ChallengeContext'

const skillDefinitions = [
  { key: 'iam', label: 'IAM Security', level: 'Advanced', detail: 'Policy analysis is your edge.', icon: <Fingerprint size={18} />, tone: 'cyan' },
  { key: 's3', label: 'S3 Security', level: 'Intermediate', detail: 'Strong data protection instinct.', icon: <ScanSearch size={18} />, tone: 'orange' },
  { key: 'network', label: 'Network Security', level: 'Intermediate', detail: 'Keep mapping attack paths.', icon: <Network size={18} />, tone: 'purple' },
  { key: 'monitoring', label: 'Monitoring & Logging', level: 'Intermediate', detail: 'Your next highest-leverage skill.', icon: <Activity size={18} />, tone: 'green' },
  { key: 'architecture', label: 'Architecture Security', level: 'Beginner', detail: 'Build confidence in system review.', icon: <GitBranch size={18} />, tone: 'blue' },
]

const strengths = [
  ['IAM Policy Analysis', 'Review more completed IAM scenarios to strengthen policy and trust-boundary judgment.', <Fingerprint size={17} />],
  ['Least Privilege Concepts', 'Narrow actions and resources reduce the blast radius of a compromised identity.', <ShieldCheck size={17} />],
  ['S3 Data Protection', 'Storage reviews build practical instincts around exposure, encryption, and recovery.', <ScanSearch size={17} />]
]

const weaknesses = [
  ['CloudTrail Monitoring', 'Complete monitoring scenarios to connect events to a useful investigation timeline.', <Eye size={17} />],
  ['Security Group Auditing', 'Review ingress and egress as attack paths across every workload tier.', <Network size={17} />],
  ['Incident Detection', 'Build confidence turning noisy signals into clear, actionable alerts.', <Activity size={17} />]
]

function levelForScore(score) {
  return score >= 91 ? 'Cloud Security Ready' : score >= 71 ? 'Advanced' : score >= 41 ? 'Intermediate' : 'Beginner'
}

function scoreColor(score) {
  return score >= 91 ? 'green' : score >= 71 ? 'blue' : score >= 41 ? 'yellow' : 'red'
}

function dateLabel() {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())
}

function ArrowRightIcon() {
  return <BarChart3 size={15} />
}

function ShowcaseStat({ icon, value, label }) {
  return (
    <div className="showcase-stat">
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  )
}

export default function Report() {
  const {
    challenges,
    progress,
    completedCount,
    totalScore,
    scorePercent,
    architectureReviewedCount,
    completedLabsCount,
    completedLabStepsCount,
    resetProgress,
    adaptiveRecommendations,
    internshipProgression
  } = useChallenges()

  const currentSkills = skillDefinitions.map(skill => {
    const domain = challenges.filter(challenge => challenge.id.startsWith(skill.key))
    const reviewScores = skill.key === 'architecture'
      ? domain.map(challenge => progress.architectureScores?.[challenge.id]).filter(score => score !== undefined)
      : []
    const complete = domain.filter(challenge => progress.completed[challenge.id]).length
    const value = reviewScores.length
      ? Math.round(reviewScores.reduce((sum, score) => sum + score, 0) / reviewScores.length)
      : Math.round((complete / Math.max(1, domain.length)) * 100)
    return { ...skill, value, level: levelForScore(value) }
  })

  const overall = scorePercent
  const profile = levelForScore(overall)
  const color = scoreColor(overall)
  const badges = currentSkills.map(skill => ({ skill, earned: skill.value >= 20 }))
  const learningHours = Math.round(((completedCount * 12 + architectureReviewedCount * 10) / 60) * 10) / 10

  const profileDescription =
    profile === 'Cloud Security Ready'
      ? 'You are demonstrating the breadth and judgment expected of an early-career cloud security engineer.'
      : 'Your score is calculated from completed decisions across all five security domains.'

  return (
    <main className="report-page premium-report">
      <div className="report-wrap">
        {/* Header */}
        <header className="report-header">
          <div className="report-brandline">
            <div className="report-mark"><ShieldCheck size={16} /></div>
            <SeCloudiveLogo size={14} variant="two-tone" glow={false} />
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', letterSpacing: '0.5px' }}><b>/ SECURITY THINKING REPORT</b></span>
            <span className="report-live"><i /> ASSESSMENT COMPLETE</span>
          </div>

          <div className="report-header-main">
            <div>
              <div className="eyebrow">CLOUD SECURITY DECISION-MAKING ASSESSMENT</div>
              <h1>
                Security Thinking<br />
                <em>Report.</em>
              </h1>
              <p>Your cloud security decision-making assessment based on completed AWS security challenges.</p>
            </div>
            <div className="report-meta">
              <span>ISSUED</span>
              <strong>{dateLabel()}</strong>
              <span>LEARNER PROGRESS</span>
              <strong>{completedCount} / {challenges.length} challenges</strong>
              <button 
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-certificate'))}
                className="button button-primary"
                style={{ marginTop: '10px', fontSize: '11px', padding: '6px 14px', minHeight: '34px', cursor: 'pointer' }}
              >
                🏆 View Certificate
              </button>
            </div>
          </div>
        </header>

        {/* Overall Score Orbit */}
        <section className="report-overall">
          <div className={`score-orbit score-orbit-${color}`}>
            <div>
              <strong>{overall}</strong>
              <span>/ 100</span>
            </div>
          </div>
          <div className="overall-copy">
            <div className="report-section-label">OVERALL SECURITY THINKING SCORE</div>
            <h2>{profile}</h2>
            <p>{profileDescription}</p>
            <div className="overall-tags">
              <span><CheckCircle2 size={13} /> {totalScore.toLocaleString()} XP earned</span>
              <span><Flame size={13} /> {completedCount ? 'Practice active' : 'Start your first lab'}</span>
            </div>
          </div>
          <div className="score-scale">
            <div>
              <span>BEGINNER</span>
              <span>INTERMEDIATE</span>
              <span>ADVANCED</span>
              <span>READY</span>
            </div>
            <div className="scale-line">
              <i className={`scale-marker marker-${color}`} style={{ left: `${overall}%` }} />
            </div>
            <strong>{overall}% assessment confidence</strong>
          </div>
        </section>

        {/* 01 / Skill Breakdown */}
        <section className="report-section">
          <div className="report-section-heading">
            <div>
              <div className="report-section-label">01 / SKILL BREAKDOWN</div>
              <h2>Your security instincts, mapped.</h2>
            </div>
            <span className="section-note">Calculated from completed challenges</span>
          </div>
          <div className="report-metrics-grid">
            {currentSkills.map(({ key: skillKey, ...skill }) => (
              <ReportMetric key={skillKey} {...skill} />
            ))}
          </div>
        </section>

        {/* Strengths & Weaknesses */}
        <div className="report-two-column">
          <section className="report-section report-panel">
            <div className="report-section-label">02 / SECURITY STRENGTHS</div>
            <h2>What you see clearly.</h2>
            <div className="insight-list">
              {strengths.map(([title, copy, icon]) => (
                <div className="insight-row strength" key={title}>
                  <span>{icon}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{copy}</p>
                  </div>
                  <CheckCircle2 size={16} />
                </div>
              ))}
            </div>
          </section>

          <section className="report-section report-panel">
            <div className="report-section-label">03 / IMPROVEMENT AREAS</div>
            <h2>Where to look twice.</h2>
            <div className="insight-list">
              {weaknesses.map(([title, copy, icon]) => (
                <div className="insight-row weakness" key={title}>
                  <span>{icon}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{copy}</p>
                  </div>
                  <span className="insight-arrow"><ArrowRightIcon /></span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 04 / Career Readiness */}
        <section className="career-section">
          <div className="career-copy">
            <div className="report-section-label">04 / CAREER READINESS</div>
            <h2>Cloud Security<br /><span>Career Readiness.</span></h2>
            <p>Your readiness is based on breadth across all five domains and hands-on architecture review coverage.</p>
            <div className="career-next">
              <span>NEXT CAREER MILESTONE</span>
              <strong>{overall >= 71 ? 'Cloud Security Internship' : 'Complete the Intermediate pathway'}</strong>
            </div>
          </div>
          <div className="career-meter">
            <div className="career-meter-top">
              <span>Current profile</span>
              <strong>{overall}%</strong>
            </div>
            <div className="career-track">
              <i style={{ width: `${overall}%` }} />
            </div>
            <div className="career-level">
              <span>ASPIRING ANALYST</span>
              <span>INTERNSHIP READY</span>
            </div>
            <div className="required-skills">
              <span>REQUIRED NEXT SKILLS</span>
              <div>
                {currentSkills.filter(skill => skill.value < 71).slice(0, 4).map(skill => (
                  <b key={skill.key}>{skill.label}</b>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 05 / Personalized Learning Roadmap */}
        <section className="report-section roadmap-report">
          <div className="report-section-heading">
            <div>
              <div className="report-section-label">05 / PERSONALIZED LEARNING ROADMAP</div>
              <h2>Choose your next altitude.</h2>
            </div>
            <span className="section-note">Current position highlighted</span>
          </div>
          <div className="report-roadmap">
            <div className={`roadmap-report-step ${overall >= 1 ? 'complete' : ''}`}>
              <span>01</span>
              <strong>Beginner</strong>
              <small>Foundations</small>
              <CheckCircle2 size={15} />
            </div>
            <div className={`roadmap-report-step ${profile === 'Intermediate' ? 'current' : overall > 40 ? 'complete' : ''}`}>
              <span>02</span>
              <strong>Intermediate</strong>
              <small>{profile === 'Intermediate' ? 'Your current position' : 'Risk analysis'}</small>
              <Target size={15} />
            </div>
            <div className={`roadmap-report-step ${profile === 'Advanced' ? 'current' : overall > 70 ? 'complete' : ''}`}>
              <span>03</span>
              <strong>Advanced</strong>
              <small>{profile === 'Advanced' ? 'Your current position' : 'Systems thinking'}</small>
              <BrainCircuit size={15} />
            </div>
            <div className={`roadmap-report-step ${profile === 'Cloud Security Ready' ? 'current' : ''}`}>
              <span>04</span>
              <strong>Cloud Security Ready</strong>
              <small>Career confidence</small>
              <Rocket size={15} />
            </div>
          </div>
        </section>

        {/* 06 / Engineer Insights */}
        <section className="insights-banner">
          <div className="insights-icon"><Sparkles size={20} /></div>
          <div>
            <div className="report-section-label">06 / ENGINEER INSIGHTS</div>
            <h2>{completedCount ? 'Your evidence is getting stronger.' : 'Your first decision sets the baseline.'}</h2>
            <p>
              {completedCount
                ? `You have completed ${completedCount} challenge${completedCount === 1 ? '' : 's'} and earned ${totalScore} XP. Focus next on ${currentSkills.sort((a, b) => a.value - b.value)[0].label.toLowerCase()} to raise your overall security thinking score.`
                : 'Complete challenges across IAM, data, networking, monitoring, and architecture to generate personalized career guidance.'}
            </p>
          </div>
        </section>

        {/* 07 / Security Badges */}
        <section className="report-section badges-report">
          <div className="report-section-heading">
            <div>
              <div className="report-section-label">07 / SECURITY BADGES</div>
              <h2>Proof of practice.</h2>
            </div>
            <span className="section-note">Earned from real completions</span>
          </div>
          <div className="badges-grid">
            {badges.map(({ skill, earned }) => (
              <BadgeCard
                key={skill.key}
                title={`${skill.label.replace(' Security', '')} ${skill.key === 'architecture' ? 'Reviewer' : skill.key === 'network' ? 'Protector' : skill.key === 'iam' ? 'Defender' : skill.key === 's3' ? 'Guardian' : 'Observer'}`}
                copy={`${skill.value}% domain coverage`}
                icon={skill.icon}
                tone={skill.tone}
                earned={earned}
              />
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 08 / ADAPTIVE LEARNING RECOMMENDATIONS & EXPLANATIONS */}
        {/* ======================================================== */}
        {adaptiveRecommendations && (
          <section className="report-section" style={{ marginTop: '2.5rem' }}>
            <div className="report-section-heading">
              <div>
                <div className="report-section-label">08 / ADAPTIVE RECOMMENDATION ENGINE</div>
                <h2>Personalized Mentorship & Skill Gap Analysis</h2>
              </div>
              <span className="section-note">
                Weighted by target role: {adaptiveRecommendations.targetCareerRole || 'Cloud Security Engineer'}
              </span>
            </div>

            {/* Why generated callout */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontFamily: 'DM Mono', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                <Sparkles size={14} /> WHY THESE RECOMMENDATIONS WERE GENERATED
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                Recommendations are generated by calculating your performance deficit across all 6 cloud security domains, weighted against your selected career goal (<strong>{adaptiveRecommendations.targetCareerRole}</strong>). Areas with score deficits are escalated to 🔴 Critical or 🟠 High priority to guarantee you never get stuck.
              </p>
            </div>

            {/* Recommendations Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {adaptiveRecommendations.allRecommendations?.slice(0, 3).map(rec => (
                <div key={rec.id} style={{ padding: '1.35rem 1.5rem', background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'DM Mono' }}>{rec.icon} {rec.domainName} ({rec.score}%)</span>
                    <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: rec.priority.includes('Critical') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(249, 115, 22, 0.15)', color: rec.priority.includes('Critical') ? '#f87171' : '#fb923c', border: `1px solid ${rec.priority.includes('Critical') ? 'rgba(239, 68, 68, 0.35)' : 'rgba(249, 115, 22, 0.35)'}`, fontWeight: 700, fontFamily: 'DM Mono' }}>
                      {rec.priority}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.5rem' }}>{rec.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 0.85rem' }}>{rec.whyRecommended}</p>

                  <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '6px', marginBottom: '0.85rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <div style={{ marginBottom: '4px' }}><strong>Career Impact:</strong> {rec.careerImpact}</div>
                    <div style={{ marginBottom: '4px' }}><strong>Expected Growth:</strong> <span style={{ color: '#10b981' }}>{rec.expectedImprovement}</span></div>
                    <div><strong>Time Required:</strong> <span style={{ color: '#fb923c' }}>{rec.estimatedTime}</span></div>
                  </div>

                  <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.06)', borderLeft: '2px solid #38bdf8', borderRadius: '0 4px 4px 0', marginBottom: '1rem', fontStyle: 'italic', fontSize: '0.78rem', color: '#e2e8f0' }}>
                    "{rec.mentorAdvice}"
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(51, 65, 85, 0.4)' }}>
                    <Link to={rec.learningPath} className="button button-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                      Start Module <ArrowRight size={13} />
                    </Link>
                    {rec.awsResources?.[0] && (
                      <a href={rec.awsResources[0].url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        AWS Doc <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Security Maturity Assessment */}
        <SecurityMaturityAssessment />

        {/* 09 / Hackathon Showcase */}
        <section className="showcase-section">
          <div className="report-section-label">09 / HACKATHON SHOWCASE</div>
          <h2>The work behind the score.</h2>
          <div className="showcase-grid">
            <ShowcaseStat icon={<Layers3 />} value={completedCount} label="Challenges completed" />
            <ShowcaseStat icon={<Target />} value={completedCount} label="Risk assessments" />
            <ShowcaseStat icon={<Cloud />} value={architectureReviewedCount} label="Architectures reviewed" />
            <ShowcaseStat icon={<Terminal />} value={completedLabsCount || 0} label="Real Labs mastered" />
            <ShowcaseStat icon={<CheckCircle2 />} value={completedLabStepsCount || 0} label="Job SOP steps executed" />
            <ShowcaseStat icon={<Gauge />} value={`${learningHours}h`} label="Learning hours" />
          </div>
        </section>

        {/* Footer Actions */}
        <footer className="report-actions-final">
          <div>
            <div className="report-section-label">THE NEXT DECISION IS YOURS</div>
            <h2>Keep building the instinct.</h2>
          </div>
          <div>
            <Link className="button button-primary" to="/categories">
              Continue learning <ArrowRightIcon />
            </Link>
            <button className="button button-ghost" onClick={resetProgress}>
              <RefreshCcw size={15} /> Retake assessment
            </button>
            <Link className="button button-ghost" to="/dashboard">
              Back to dashboard
            </Link>
            <button className="button button-ghost" onClick={() => window.print()}>
              <Download size={15} /> Save report
            </button>
          </div>
        </footer>
      </div>
    </main>
  )
}
