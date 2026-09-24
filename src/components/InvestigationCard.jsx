import { ArrowRight, CheckCircle2, AlertTriangle, ShieldAlert, FileText, Layers, Crosshair, Zap, Terminal } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function InvestigationCard({ investigation, score, isCompleted }) {
  const { id, ticket, category, categoryKey, title, incidentSummary, riskLevel, affectedServices, evidence, mitre, realWorldCase, terminalCommands } = investigation

  const riskClass =
    riskLevel.toLowerCase() === 'critical'
      ? 'risk-critical'
      : riskLevel.toLowerCase() === 'high'
      ? 'risk-high'
      : 'risk-medium'

  const categoryColorClass = `cat-border-${categoryKey || 'iam'}`

  return (
    <article className={`investigation-card ${categoryColorClass} ${isCompleted ? 'is-resolved' : ''}`}>
      <div className="inv-card-header">
        <div className="inv-card-badges">
          <span className="inv-ticket-tag">{ticket}</span>
          <span className={`inv-cat-pill cat-${categoryKey || 'iam'}`}>{category}</span>
          {mitre && (
            <span className="inv-mitre-tag" title={`${mitre.techniqueName} (${mitre.tactic})`}>
              <Crosshair size={10} />
              {mitre.techniqueId}
            </span>
          )}
        </div>
        <span className={`inv-risk-pill ${riskClass}`}>
          <ShieldAlert size={12} />
          {riskLevel}
        </span>
      </div>

      <div className="inv-card-body">
        <h3 className="inv-card-title">
          <Link to={`/investigations/${id}`}>{title}</Link>
        </h3>

        {realWorldCase && (
          <div className="inv-realworld-tag">
            <Zap size={11} className="text-amber" />
            <span>Modeled on: {realWorldCase.split('(')[0].trim()}</span>
          </div>
        )}

        <p className="inv-card-summary">{incidentSummary}</p>

        <div className="inv-services-list">
          {affectedServices.slice(0, 3).map(service => (
            <span key={service} className="inv-service-tag">
              {service}
            </span>
          ))}
          {affectedServices.length > 3 && (
            <span className="inv-service-tag more">+{affectedServices.length - 3}</span>
          )}
        </div>
      </div>

      <div className="inv-card-footer">
        <div className="inv-footer-meta">
          <span className="evidence-count">
            <FileText size={12} />
            {evidence?.length || 0} artifacts
          </span>
          <span className="evidence-count terminal-count">
            <Terminal size={12} />
            {terminalCommands?.length || 4} CLI queries
          </span>
          {isCompleted && (
            <span className="inv-score-badge">
              <CheckCircle2 size={12} />
              {score ?? 100}% Score
            </span>
          )}
        </div>

        <Link to={`/investigations/${id}`} className="inv-action-link">
          <span>{isCompleted ? 'Review Dossier' : 'Investigate'}</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  )
}
