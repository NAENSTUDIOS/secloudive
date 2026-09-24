import { Clock3, ShieldAlert } from 'lucide-react'

export default function AttackTimeline({ events = [], compact = false }) {
  return <div className={`attack-timeline ${compact ? 'is-compact' : ''}`} aria-label="Incident attack timeline">{events.map(([time, title, detail], index) => <div className="timeline-event" key={`${time}-${title}`}><div className="timeline-marker"><span>{index + 1}</span></div><div className="timeline-content"><div><time><Clock3 size={12} /> {time}</time><strong>{title}</strong></div>{!compact && <p>{detail}</p>}</div></div>)}</div>
}

export function TimelineSummary({ scenario }) { return <section className="timeline-summary"><div className="report-section-label"><ShieldAlert size={13} /> INCIDENT TIMELINE / {scenario.ticket}</div><h3>How the incident unfolded</h3><AttackTimeline events={scenario.timeline} compact /></section> }
