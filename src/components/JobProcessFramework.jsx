import { useState } from 'react'
import {
  GitPullRequest,
  Search,
  Crosshair,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Play
} from 'lucide-react'
import { jobProcessStages } from '../data/jobLabs'

const stageIcons = [
  GitPullRequest,
  Search,
  Crosshair,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2
]

export default function JobProcessFramework({ activeStageIndex = 0, onSelectStage }) {
  const [selectedStage, setSelectedStage] = useState(activeStageIndex)

  const handleSelect = index => {
    setSelectedStage(index)
    if (onSelectStage) {
      onSelectStage(index)
    }
  }

  const currentStage = jobProcessStages[selectedStage] || jobProcessStages[0]
  const IconComponent = stageIcons[selectedStage] || Briefcase

  return (
    <section className="job-process-framework">
      <div className="framework-header">
        <div className="eyebrow-accent">
          <Briefcase size={12} className="text-cyan" />
          <span>ENTERPRISE CLOUD SECURITY OPERATIONS (SOP)</span>
        </div>
        <h2 className="framework-title">How Real Cloud Security Engineers Work</h2>
        <p className="framework-subtitle">
          The standardized 6-stage Standard Operating Procedure (SOP) used by Tier-2/Tier-3 SecOps,
          Incident Response Commanders, and Cloud Security Architects in production enterprises.
        </p>
      </div>

      {/* Stepper Bar */}
      <div className="process-stepper-grid" role="tablist" aria-label="Cloud Security Job SOP Stages">
        {jobProcessStages.map((stage, idx) => {
          const isSelected = selectedStage === idx
          const StepIcon = stageIcons[idx]

          return (
            <button
              key={stage.step}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`process-step-tab ${isSelected ? 'is-active' : ''}`}
              onClick={() => handleSelect(idx)}
            >
              <div className="step-tab-top">
                <span className="step-num">0{stage.step}</span>
                <StepIcon size={14} className="step-icon" />
              </div>
              <span className="step-tab-title">{stage.title}</span>
            </button>
          )
        })}
      </div>

      {/* Active Stage Detailed Card */}
      <div className="active-stage-card">
        <div className="stage-card-header">
          <div className="stage-card-icon-box">
            <IconComponent size={22} className="text-cyan" />
          </div>
          <div className="stage-card-title-group">
            <span className="stage-badge">STAGE 0{currentStage.step} OF 06</span>
            <h3>{currentStage.title}</h3>
            <p className="stage-subtitle">{currentStage.subtitle}</p>
          </div>
        </div>

        <div className="stage-card-body">
          <div className="stage-desc-box">
            <h4>Operational Description</h4>
            <p>{currentStage.description}</p>
          </div>

          <div className="stage-mindset-box">
            <h4>Senior Engineer Mindset</h4>
            <blockquote className="analyst-mindset-quote">
              "{currentStage.analystMindset}"
            </blockquote>
          </div>

          <div className="stage-commands-box">
            <h4>Essential AWS CLI Commands</h4>
            <div className="stage-commands-list">
              {currentStage.essentialCommands.map((cmd, idx) => (
                <div key={idx} className="stage-command-item">
                  <Terminal size={12} className="text-cyan" />
                  <code>{cmd}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
