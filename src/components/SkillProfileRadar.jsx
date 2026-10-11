import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, Zap } from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { calculateDomainScores } from '../data/learning/recommendationEngine'

const DOMAIN_CONFIG = [
  { key: 'iam',              label: 'Identity Security',    icon: '🔑', path: '/learning/iam',               color: '#38bdf8' },
  { key: 's3',               label: 'Data Security',        icon: '🪣', path: '/learning/s3',                color: '#a78bfa' },
  { key: 'network',          label: 'Network Security',     icon: '🌐', path: '/learning/network',           color: '#34d399' },
  { key: 'monitoring',       label: 'Monitoring & Logging', icon: '📊', path: '/learning/monitoring',        color: '#fb923c' },
  { key: 'architecture',     label: 'Architecture',         icon: '🏛️', path: '/learning/architecture',      color: '#f472b6' },
  { key: 'incident-response',label: 'Incident Response',    icon: '🚨', path: '/learning/incident-response', color: '#facc15' },
]

function getStrengthLabel(score) {
  if (score >= 81) return { label: 'Strong',            cls: 'strong' }
  if (score >= 61) return { label: 'Developing',        cls: 'developing' }
  if (score >= 41) return { label: 'Needs Improvement', cls: 'needs-improvement' }
  return                  { label: 'Critical Weakness', cls: 'critical-weakness' }
}

// --- Hexagon SVG Radar ---
function HexRadar({ scores }) {
  const cx = 160
  const cy = 160
  const maxR = 120
  const n = 6

  function toXY(i, r) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  }

  const rings = [0.2, 0.4, 0.6, 0.8, 1.0]

  const dataPoints = scores.map((s, i) => {
    const numericScore = typeof s === 'number' ? s : (s?.score ?? 40)
    return toXY(i, (numericScore / 100) * maxR)
  })
  const dataPath = dataPoints.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z'

  return (
    <svg viewBox="0 0 320 320" style={{ width: '100%', maxWidth: '300px', margin: '0 auto', display: 'block' }} aria-hidden="true">
      {/* Rings */}
      {rings.map(r => {
        const pts = Array.from({ length: n }, (_, i) => toXY(i, r * maxR))
        const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z'
        return (
          <path key={r} d={d}
            fill="none"
            stroke="rgba(51,65,85,0.6)"
            strokeWidth={r === 1 ? 1.5 : 1}
            strokeDasharray={r < 1 ? '4 4' : undefined}
          />
        )
      })}

      {/* Spokes */}
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = toXY(i, maxR)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(51,65,85,0.5)" strokeWidth={1} />
      })}

      {/* Data area */}
      <path d={dataPath} fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth={2} />

      {/* Data dots */}
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill={DOMAIN_CONFIG[i].color} stroke="#0f172a" strokeWidth={2} />
      ))}

      {/* Labels */}
      {DOMAIN_CONFIG.map((d, i) => {
        const [x, y] = toXY(i, maxR + 22)
        const anchor = x < cx - 5 ? 'end' : x > cx + 5 ? 'start' : 'middle'
        return (
          <text key={d.key} x={x} y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize={10}
            fontFamily="'DM Mono', monospace"
            fill="#94a3b8"
            style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
          >
            {d.icon} {d.label.split(' ')[0]}
          </text>
        )
      })}
    </svg>
  )
}

export default function SkillProfileRadar({ compact = false }) {
  const {
    challenges, progress, learningQuizScores, topicCheckAnswers, threatScenarios
  } = useChallenges()

  const domainScores = useMemo(() =>
    calculateDomainScores({ progress, challenges, learningQuizScores, topicCheckAnswers, threatScenarios }),
    [progress, challenges, learningQuizScores, topicCheckAnswers, threatScenarios]
  )

  const scores = DOMAIN_CONFIG.map(d => {
    const val = domainScores?.[d.key]
    if (typeof val === 'number') return val
    if (val && typeof val.score === 'number') return val.score
    return 40
  })

  const overallScore = Math.round(
    scores.reduce((a, b) => {
      const numB = typeof b === 'number' ? b : (b?.score ?? 40)
      return a + numB
    }, 0) / Math.max(1, scores.length)
  )

  const strengths = DOMAIN_CONFIG.filter((d, i) => {
    const s = typeof scores[i] === 'number' ? scores[i] : (scores[i]?.score ?? 40)
    return s >= 65
  }).map(d => d.label)

  const weaknesses = DOMAIN_CONFIG.filter((d, i) => {
    const s = typeof scores[i] === 'number' ? scores[i] : (scores[i]?.score ?? 40)
    return s < 55
  }).map(d => d.label)

  return (
    <section className="skill-profile-radar-section" aria-label="Skill Profile Radar">
      <div className="radar-section-header">
        <div>
          <div className="eyebrow"><Zap size={12} /> Adaptive Skill Profile • Live Domain Mastery</div>
          <h2>Your Cloud Security Skill Map</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0.3rem 0 0' }}>
            Scores update in real-time as you complete quizzes, investigations, and tickets.
          </p>
        </div>
        <div className="radar-overall-score">
          <span>OVERALL PROFILE</span>
          <strong style={{ color: overallScore >= 70 ? '#10b981' : overallScore >= 50 ? '#f59e0b' : '#ef4444' }}>
            {overallScore}%
          </strong>
        </div>
      </div>

      <div className="radar-body">
        {/* Hexagon Chart */}
        <div className="radar-chart-wrapper">
          <HexRadar scores={scores} />
        </div>

        {/* Domain Score Bars */}
        <div className="radar-bars-grid">
          {DOMAIN_CONFIG.map((domain, i) => {
            const rawScore = scores[i]
            const score = typeof rawScore === 'number' ? rawScore : (rawScore?.score ?? 40)
            const { label, cls } = getStrengthLabel(score)
            return (
              <div key={domain.key} className="radar-bar-item">
                <div className="radar-bar-top">
                  <span className="radar-domain-name">{domain.icon} {domain.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`radar-strength-tag ${cls}`}>{label}</span>
                    <strong style={{ color: domain.color, fontSize: '0.88rem', fontFamily: 'DM Mono' }}>{score}%</strong>
                  </div>
                </div>
                <div className="radar-bar-track">
                  <div
                    className="radar-bar-fill"
                    style={{ width: `${score}%`, background: `linear-gradient(90deg, ${domain.color}aa, ${domain.color})` }}
                  />
                </div>
                <Link to={domain.path} className="radar-domain-action">
                  Study {domain.label} <ArrowRight size={10} />
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Strengths & Weaknesses Summary */}
      {!compact && (
        <div className="radar-summary-grid">
          <div className="radar-summary-card strengths-card">
            <div className="radar-summary-head">
              <CheckCircle2 size={14} style={{ color: '#10b981' }} />
              <span>Demonstrated Strengths</span>
            </div>
            {strengths.length > 0
              ? strengths.map(s => <div key={s} className="radar-summary-tag strength">{s}</div>)
              : <p className="radar-empty-note">Complete more modules to identify strengths.</p>
            }
          </div>
          <div className="radar-summary-card weaknesses-card">
            <div className="radar-summary-head">
              <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
              <span>Priority Improvement Areas</span>
            </div>
            {weaknesses.length > 0
              ? weaknesses.map(w => {
                  const d = DOMAIN_CONFIG.find(d => d.label === w)
                  return (
                    <Link key={w} to={d?.path || '/learning'} className="radar-summary-tag weakness">
                      {w} — Study Now <ArrowRight size={10} />
                    </Link>
                  )
                })
              : <p className="radar-empty-note" style={{ color: '#10b981' }}>Great work — no critical weaknesses!</p>
            }
          </div>
          <div className="radar-summary-card career-readiness-card">
            <div className="radar-summary-head">
              <TrendingUp size={14} style={{ color: '#38bdf8' }} />
              <span>Career Readiness Signal</span>
            </div>
            <p style={{ fontSize: '0.83rem', color: '#94a3b8', margin: '0 0 0.5rem' }}>
              {overallScore >= 75
                ? 'Your profile matches active Cloud Security internship requirements.'
                : overallScore >= 55
                ? 'You are building a competitive security skill profile. Focus on weaknesses.'
                : 'Prioritize the weakest domains first — targeted study yields the fastest improvement.'
              }
            </p>
            <Link to="/internship-simulator" className="radar-cta-link">
              View Internship Readiness <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
