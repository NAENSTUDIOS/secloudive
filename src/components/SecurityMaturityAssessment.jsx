import { Activity, CheckCircle2, Fingerprint, GitBranch, Layers, Network, ScanSearch, Shield, ShieldCheck } from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'

export default function SecurityMaturityAssessment({ compact = false }) {
  const { challenges, progress, architectureReviewedCount } = useChallenges()

  // Domains
  const domains = [
    {
      key: 'iam',
      label: 'Identity Security',
      icon: <Fingerprint size={16} />,
      color: 'cyan',
      description: 'Least privilege, short-lived roles, credentials hygiene, and trust boundaries.',
    },
    {
      key: 's3',
      label: 'Data Security',
      icon: <ScanSearch size={16} />,
      color: 'orange',
      description: 'Storage access controls, KMS encryption, Object Lock, and backup isolation.',
    },
    {
      key: 'network',
      label: 'Network Security',
      icon: <Network size={16} />,
      color: 'purple',
      description: 'Security group chaining, private routing, egress filtering, and VPC boundaries.',
    },
    {
      key: 'monitoring',
      label: 'Monitoring & Logging',
      icon: <Activity size={16} />,
      color: 'green',
      description: 'Centralized immutable CloudTrail, GuardDuty detections, and actionable alerting.',
    },
    {
      key: 'architecture',
      label: 'Governance & Architecture',
      icon: <GitBranch size={16} />,
      color: 'blue',
      description: 'Multi-account SCPs, defense in depth, Well-Architected reviews, and threat modeling.',
    },
  ]

  function getDomainStats(key) {
    if (key === 'architecture') {
      const archChallenges = challenges.filter(c => c.id.startsWith('architecture-'))
      const scores = archChallenges
        .map(c => progress.architectureScores?.[c.id])
        .filter(s => s !== undefined)
      const avg = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / archChallenges.length)
        : 0
      return {
        completed: architectureReviewedCount,
        total: archChallenges.length,
        percentage: avg,
      }
    }

    const items = challenges.filter(c => c.id.startsWith(key))
    const completed = items.filter(c => progress.completed[c.id]).length
    const percentage = Math.round((completed / Math.max(1, items.length)) * 100)
    return { completed, total: items.length, percentage }
  }

  function getMaturityTier(percent) {
    if (percent >= 80) return { label: 'Level 4: Optimized', tone: 'green' }
    if (percent >= 55) return { label: 'Level 3: Defined', tone: 'blue' }
    if (percent >= 25) return { label: 'Level 2: Developing', tone: 'yellow' }
    return { label: 'Level 1: Initial', tone: 'red' }
  }

  const maturityScores = domains.map(d => {
    const stats = getDomainStats(d.key)
    const tier = getMaturityTier(stats.percentage)
    return { ...d, ...stats, tier }
  })

  const averageMaturity = Math.round(
    maturityScores.reduce((sum, d) => sum + d.percentage, 0) / domains.length
  )

  const overallTier =
    averageMaturity >= 80
      ? 'Resilient Cloud Engineering'
      : averageMaturity >= 55
      ? 'Defined Security Architecture'
      : averageMaturity >= 25
      ? 'Controlled Security Baseline'
      : 'Initial Security Posture'

  return (
    <section className={`security-maturity-section ${compact ? 'is-compact' : ''}`} aria-labelledby="maturity-title">
      <div className="maturity-header">
        <div>
          <div className="report-section-label">
            <Shield size={13} /> SECURITY MATURITY ASSESSMENT
          </div>
          <h2 id="maturity-title">Organizational Cloud Security Maturity.</h2>
          <p>
            Assess your capabilities across the five core cloud security pillars: Identity, Data, Network, Monitoring, and Governance.
          </p>
        </div>
        <div className="overall-maturity-badge">
          <span>MATURITY RATING</span>
          <strong>{overallTier}</strong>
          <small>{averageMaturity}% cumulative benchmark</small>
        </div>
      </div>

      <div className="maturity-grid">
        {maturityScores.map(domain => (
          <div className={`maturity-card ${domain.color}`} key={domain.key}>
            <div className="maturity-card-top">
              <span className="maturity-icon">{domain.icon}</span>
              <span className={`maturity-tier-pill tier-${domain.tier.tone}`}>
                {domain.tier.label}
              </span>
            </div>
            <h3>{domain.label}</h3>
            <p>{domain.description}</p>

            <div className="maturity-meter">
              <div className="maturity-meter-label">
                <span>Coverage</span>
                <strong>{domain.percentage}% ({domain.completed}/{domain.total})</strong>
              </div>
              <div className="maturity-track">
                <i style={{ width: `${domain.percentage}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
