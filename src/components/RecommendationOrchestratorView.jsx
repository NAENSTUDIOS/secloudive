import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Play, 
  Target, 
  BookOpen, 
  ShieldAlert, 
  Layers, 
  Terminal, 
  BriefcaseBusiness, 
  FolderGit2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useChallenges } from '../context/ChallengeContext'

export default function RecommendationOrchestratorView() {
  const { masterCareerProfile } = useChallenges()

  if (!masterCareerProfile?.recommendedJourney) return null

  const { recommendedJourney } = masterCareerProfile
  const { targetRole, domainName, reason, stages } = recommendedJourney

  const getStageIcon = (category) => {
    switch (category) {
      case 'Learning Center': return <BookOpen size={16} />
      case 'Investigation Simulator': return <ShieldAlert size={16} />
      case 'Architecture Reviews': return <Layers size={16} />
      case 'Real Labs': return <Terminal size={16} />
      case 'Internship Simulator': return <BriefcaseBusiness size={16} />
      case 'Portfolio Projects': return <FolderGit2 size={16} />
      default: return <Target size={16} />
    }
  }

  const completedStagesCount = stages.filter(s => s.status === 'completed').length
  const totalStages = stages.length
  const journeyProgressPercent = Math.round((completedStagesCount / totalStages) * 100)

  return (
    <section className="recommendation-orchestrator-card" aria-label="Recommendation Orchestrator Pathway">
      <div className="orchestrator-header">
        <div className="orchestrator-title-block">
          <div className="orchestrator-eyebrow">
            <Sparkles size={13} className="text-cyan" />
            <span>Career Intelligence Layer • Recommendation Orchestrator</span>
          </div>
          <h2>
            End-to-End Career Pathway: <span className="text-cyan">{domainName}</span>
          </h2>
          <p className="orchestrator-reason">
            <strong>Target Role Alignment ({targetRole}):</strong> {reason}
          </p>
        </div>

        <div className="orchestrator-progress-badge">
          <div className="progress-badge-meta">
            <span className="badge-label">PATHWAY COMPLETION</span>
            <strong className="badge-value text-emerald">{completedStagesCount} of {totalStages} Stages</strong>
          </div>
          <div className="orchestrator-progress-track">
            <div className="orchestrator-progress-fill" style={{ width: `${journeyProgressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* 6-Stage Linear Pipeline */}
      <div className="orchestrator-stages-pipeline">
        {stages.map((stage, idx) => {
          const isDone = stage.status === 'completed'
          const isActive = stage.status === 'active'
          const isLocked = stage.status === 'locked'

          return (
            <div key={idx} className={`stage-step-card ${isDone ? 'stage-done' : isActive ? 'stage-active' : 'stage-locked'}`}>
              <div className="stage-step-top">
                <div className="stage-num-badge">
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-emerald" />
                  ) : isLocked ? (
                    <Lock size={14} className="text-slate-400" />
                  ) : (
                    <span className="active-pulse-num">{stage.stageNumber}</span>
                  )}
                </div>
                <div className="stage-category-tag">
                  {getStageIcon(stage.category)}
                  <span>{stage.category}</span>
                </div>
                <span className={`stage-status-pill pill-${stage.status}`}>
                  {isDone ? 'Completed' : isActive ? 'Up Next' : 'Locked'}
                </span>
              </div>

              <strong className="stage-title">{stage.title}</strong>
              <p className="stage-description">{stage.description}</p>

              <div className="stage-card-action">
                {isDone ? (
                  <Link to={stage.route} className="button button-ghost button-sm">
                    Review Stage <ArrowRight size={12} />
                  </Link>
                ) : isActive ? (
                  <Link to={stage.route} className="button button-primary button-sm">
                    <Play size={12} /> Launch Activity <ArrowRight size={12} />
                  </Link>
                ) : (
                  <span className="locked-helper-text">
                    Complete previous stages to unlock
                  </span>
                )}
              </div>

              {idx < stages.length - 1 && (
                <div className="stage-connector-arrow">
                  &darr;
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
