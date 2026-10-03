import { TrendingUp, ShieldCheck } from 'lucide-react'

export default function ScoreCard({ label, value, detail, tone = 'blue' }) {
  return (
    <div className={`score-card score-${tone} cyber-glass-panel motion-card`}>
      <div className="score-card-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', opacity: 0.7 }} />
      </div>
      <strong style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{value}</strong>
      <div className="score-detail">
        <TrendingUp size={14} /> {detail}
      </div>
    </div>
  )
}
