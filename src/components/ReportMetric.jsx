import { ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function ReportMetric({ icon, label, value, level, detail, tone = 'blue' }) {
  return <article className={`report-metric report-metric-${tone}`}>
    <div className="report-metric-top"><span className="report-metric-icon">{icon}</span><span className="report-metric-level">{level}</span></div>
    <div className="report-metric-label">{label}</div>
    <div className="report-metric-score"><strong>{value}%</strong><span>{value >= 80 ? <CheckCircle2 size={14} /> : <ShieldAlert size={14} />}</span></div>
    <div className="report-progress"><span style={{ width: `${value}%` }} /></div>
    <div className="report-metric-detail">{detail}<ArrowUpRight size={14} /></div>
  </article>
}
