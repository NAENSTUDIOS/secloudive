import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'

export default function SkillGraphView() {
  const { masterCareerProfile } = useChallenges()
  const [filterDomain, setFilterDomain] = useState('all') // 'all' | 'deficit' | 'proficient'

  if (!masterCareerProfile) return null

  const { skillGraph, currentTier, targetCareerRole } = masterCareerProfile

  const filteredDomains = skillGraph.filter(domain => {
    if (filterDomain === 'deficit') return domain.gap > 0
    if (filterDomain === 'proficient') return domain.gap <= 0
    return true
  })

  // Calculate average mastery and average requirement
  const avgCurrent = Math.round(skillGraph.reduce((acc, d) => acc + d.currentMastery, 0) / skillGraph.length)
  const avgRequired = Math.round(skillGraph.reduce((acc, d) => acc + d.requiredMastery, 0) / skillGraph.length)

  return (
    <section className="skill-graph-panel" aria-label="10-Domain Enterprise Cloud Security Skill Graph">
      <div className="skill-graph-header">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" style={{ backgroundColor: '#10b981' }} />
            <span>Enterprise Skill Graph • 10 Cybersecurity Domains</span>
          </div>
          <h2>
            Skills Map & Mastery Benchmark
          </h2>
          <p>
            Real-time telemetry measuring Current Mastery vs. Required Mastery for <strong>{currentTier?.title}</strong> targeting <strong>{targetCareerRole}</strong>.
          </p>
        </div>

        {/* Global Domain KPI stats */}
        <div className="skill-graph-kpis">
          <div className="skill-kpi-box">
            <span className="kpi-label">Average Mastery</span>
            <strong className="kpi-value text-cyan">{avgCurrent}%</strong>
          </div>
          <div className="skill-kpi-box">
            <span className="kpi-label">Target Tier Target</span>
            <strong className="kpi-value text-purple">{avgRequired}%</strong>
          </div>
          <div className="skill-kpi-box">
            <span className="kpi-label">Competency Delta</span>
            <strong className={`kpi-value ${avgCurrent >= avgRequired ? 'text-emerald' : 'text-amber'}`}>
              {avgCurrent >= avgRequired ? `+${avgCurrent - avgRequired}% Ahead` : `-${avgRequired - avgCurrent}% Gap`}
            </strong>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="skill-filter-bar">
        <div className="filter-buttons">
          <button 
            type="button"
            className={`filter-btn ${filterDomain === 'all' ? 'active' : ''}`}
            onClick={() => setFilterDomain('all')}
          >
            All 10 Domains ({skillGraph.length})
          </button>
          <button 
            type="button"
            className={`filter-btn ${filterDomain === 'deficit' ? 'active tab-deficit' : ''}`}
            onClick={() => setFilterDomain('deficit')}
          >
            Priority Skill Gaps ({skillGraph.filter(d => d.gap > 0).length})
          </button>
          <button 
            type="button"
            className={`filter-btn ${filterDomain === 'proficient' ? 'active tab-proficient' : ''}`}
            onClick={() => setFilterDomain('proficient')}
          >
            Tier Satisfied ({skillGraph.filter(d => d.gap <= 0).length})
          </button>
        </div>

        <div className="skill-legend">
          <span className="legend-item">
            <span className="legend-bar legend-current" /> Current Mastery
          </span>
          <span className="legend-item">
            <span className="legend-line legend-target" /> Target Tier Target
          </span>
        </div>
      </div>

      {/* 10 Domains Grid */}
      <div className="skill-domains-grid">
        {filteredDomains.map(d => {
          const hasGap = d.gap > 0
          const trendColor = d.trend === 'Rapid Growth' ? '#10b981' : d.trend === 'Needs Practice' ? '#f59e0b' : '#38bdf8'

          return (
            <div key={d.id} className={`domain-card ${hasGap ? 'card-has-gap' : 'card-satisfied'}`}>
              <div className="domain-card-head">
                <div className="domain-icon-title">
                  <span className="domain-emoji-badge">{d.icon}</span>
                  <div>
                    <strong className="domain-title">{d.name}</strong>
                    <span className="domain-short">{d.shortName}</span>
                  </div>
                </div>
                <div className="domain-trend-badge" style={{ borderColor: trendColor, color: trendColor }}>
                  <TrendingUp size={11} /> {d.trend}
                </div>
              </div>

              <p className="domain-description">{d.description}</p>

              {/* Progress Dual Bar */}
              <div className="mastery-track-container">
                <div className="mastery-labels">
                  <span>Current: <strong>{d.currentMastery}%</strong></span>
                  <span>Required: <strong>{d.requiredMastery}%</strong></span>
                </div>
                <div className="mastery-bar-track">
                  {/* Target line */}
                  <div 
                    className="mastery-target-marker" 
                    style={{ left: `${Math.min(100, d.requiredMastery)}%` }} 
                    title={`Required: ${d.requiredMastery}%`}
                  />
                  {/* Current fill */}
                  <div 
                    className={`mastery-current-fill ${hasGap ? 'fill-deficit' : 'fill-satisfied'}`}
                    style={{ 
                      width: `${Math.min(100, d.currentMastery)}%`,
                      backgroundColor: d.color 
                    }}
                  />
                </div>
                <div className="mastery-gap-row">
                  {hasGap ? (
                    <span className="gap-alert text-amber">
                      <AlertTriangle size={12} /> {d.gap}% gap for {currentTier?.title}
                    </span>
                  ) : (
                    <span className="gap-satisfied text-emerald">
                      <CheckCircle2 size={12} /> Meets or exceeds role target
                    </span>
                  )}
                  <span className="weight-tag">Weight: {Math.round(d.weight * 100)}%</span>
                </div>
              </div>

              {/* Action Link to Corresponding SeCloudive Module */}
              <div className="domain-action-footer">
                <Link to={d.primaryModule} className="domain-cta-link">
                  Harden in {d.moduleTitle} <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
