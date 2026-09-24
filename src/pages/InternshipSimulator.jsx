import { useState } from 'react'
import { AlertTriangle, ArrowRight, Check, CheckCircle2, ChevronRight, FileText, Layers, Rocket, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import AttackTimeline from '../components/AttackTimeline'
import CareerRoadmap from '../components/CareerRoadmap'
import { useChallenges } from '../context/ChallengeContext'

export default function InternshipSimulator() {
  const { threatScenarios, progress, submitSimulatorInvestigation, simulatorCompletedCount, internshipReadiness } = useChallenges()
  const [activeId, setActiveId] = useState(threatScenarios[0].id)
  const [selected, setSelected] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const scenario = threatScenarios.find(item => item.id === activeId) || threatScenarios[0]
  const score = progress.simulatorScores?.[scenario.id]

  const growthLevel =
    simulatorCompletedCount >= 9
      ? 'Job-Ready Cloud Security Engineer'
      : simulatorCompletedCount >= 6
      ? 'Cloud Incident Responder'
      : simulatorCompletedCount >= 3
      ? 'Junior Triage Analyst'
      : 'Internship Onboarding'

  function openTicket(ticket) {
    setActiveId(ticket.id)
    setSelected([])
    setSubmitted(false)
  }

  function submit() {
    if (!selected.length) return
    submitSimulatorInvestigation(scenario, selected)
    setSubmitted(true)
  }

  return (
    <main className="page-shell simulator-page">
      <div className="page-heading simulator-heading">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" /> ROLE: CLOUD SECURITY INTERN /// WEEKLY ON-CALL TICKETS
          </div>
          <h1>
            Work the ticket.
            <br />
            <em>Think like an engineer.</em>
          </h1>
          <p>
            Experience realistic on-call rotation: triage weekly tickets, correlate evidence, explain business risk, and recommend safe, durable remediation.
          </p>
        </div>

        <div className="simulator-metrics-banner">
          <div className="simulator-score">
            <span>INTERNSHIP READINESS</span>
            <strong>{internshipReadiness}%</strong>
            <small>{simulatorCompletedCount} / {threatScenarios.length} weekly tickets closed</small>
          </div>
          <div className="simulator-growth-card">
            <span><TrendingUp size={13} /> GROWTH STATUS</span>
            <strong>{growthLevel}</strong>
            <small>{simulatorCompletedCount >= 3 ? 'Active ticket progression' : 'Start with Week 1 ticket'}</small>
          </div>
        </div>
      </div>

      <div className="simulator-grid">
        <aside className="ticket-inbox">
          <div className="inbox-header">
            <span>WEEKLY INTERNSHIP ROTATION</span>
            <strong>{simulatorCompletedCount} / {threatScenarios.length} COMPLETED</strong>
          </div>
          {threatScenarios.map(ticket => {
            const isDone = progress.simulatorScores?.[ticket.id] !== undefined
            const isActive = ticket.id === scenario.id

            return (
              <button
                key={ticket.id}
                className={`ticket-row ${isActive ? 'active' : ''}`}
                onClick={() => openTicket(ticket)}
              >
                <span className="ticket-icon">{ticket.icon}</span>
                <div>
                  <div className="ticket-week-label">
                    <span>{ticket.week || 'Week'}</span>
                    <small>• {ticket.category}</small>
                  </div>
                  <strong>{ticket.weekTopic ? `${ticket.ticket}: ${ticket.weekTopic}` : ticket.title}</strong>
                </div>
                <b className={`risk-${ticket.riskLevel.toLowerCase()}`}>{ticket.riskLevel}</b>
                {isDone && <Check size={14} className="ticket-done" />}
              </button>
            )
          })}
        </aside>

        <section className="ticket-workspace">
          <div className="ticket-header">
            <div>
              <span className="ticket-kicker">
                <FileText size={13} /> {scenario.week ? `${scenario.week.toUpperCase()} / ` : ''}{scenario.ticket} / {scenario.category}
              </span>
              <h2>{scenario.title}</h2>
            </div>
            <span className={`ticket-risk risk-${scenario.riskLevel.toLowerCase()}`}>
              <AlertTriangle size={13} /> {scenario.riskLevel} risk
            </span>
          </div>

          <div className="ticket-summary">
            <span>INCIDENT SUMMARY</span>
            <p>{scenario.incidentSummary}</p>
            <small>{scenario.background}</small>
          </div>

          <div className="ticket-section">
            <div className="ticket-section-title">
              <span>01 / AVAILABLE EVIDENCE</span>
              <small>Select every finding you would escalate to engineering leads.</small>
            </div>
            <div className="evidence-list">
              {scenario.evidence.map((evidence, index) => (
                <button
                  key={evidence}
                  className={selected.includes(index) ? 'selected' : ''}
                  onClick={() =>
                    !submitted &&
                    setSelected(current =>
                      current.includes(index) ? current.filter(item => item !== index) : [...current, index]
                    )
                  }
                >
                  <span>{selected.includes(index) ? <Check size={13} /> : String(index + 1).padStart(2, '0')}</span>
                  {evidence}
                </button>
              ))}
            </div>
          </div>

          {submitted && (
            <div className="ticket-result">
              <div>
                <span>RISK ANALYSIS</span>
                <strong>{score}% coverage</strong>
                <p>Investigation recorded. Compare your escalation findings with the senior response below.</p>
              </div>
              <div>
                <span>BUSINESS IMPACT</span>
                <p>{scenario.impact}</p>
              </div>
              <div>
                <span>REMEDIATION GUIDE</span>
                <ul>
                  {scenario.remediation.map(step => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span>ENGINEER NOTES</span>
                <p>{scenario.notes}</p>
              </div>
            </div>
          )}

          <div className="ticket-actions">
            {submitted ? (
              <button
                className="button button-ghost"
                onClick={() => {
                  setSubmitted(false)
                  setSelected([])
                }}
              >
                Re-open ticket
              </button>
            ) : (
              <button className="button button-primary" disabled={!selected.length} onClick={submit}>
                Submit findings <ArrowRight size={15} />
              </button>
            )}
            <Link className="button button-ghost" to="/report">
              View readiness report
            </Link>
          </div>
        </section>
      </div>

      <section className="simulator-timeline-section">
        <div>
          <div className="report-section-label">02 / ATTACK TIMELINE VISUALIZER</div>
          <h2>Understand how the incident unfolded.</h2>
          <p>
            Security engineers reconstruct time, causality, and containment to make defensible decisions under pressure.
          </p>
        </div>
        <AttackTimeline events={scenario.timeline} />
      </section>

      <CareerRoadmap readiness={internshipReadiness} />

      <section className="why-matters">
        <div className="report-section-label">WHY THIS MATTERS</div>
        <h2>Judgment is a community skill.</h2>
        <p>{scenario.community}</p>
      </section>
    </main>
  )
}
