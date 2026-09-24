import { TrendingUp } from 'lucide-react'
export default function ScoreCard({ label, value, detail, tone = 'blue' }) { return <div className={`score-card score-${tone}`}><div className="score-card-label">{label}</div><strong>{value}</strong><div className="score-detail"><TrendingUp size={14} /> {detail}</div></div> }
