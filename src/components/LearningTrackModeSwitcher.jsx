// ==============================================================================
// NAEN Studios Learning Track Mode & Persona Switcher
// Enables learners to choose between Single-Cloud Focus Track vs 5-Cloud Master Track
// and tailor learning experience by Persona (Student, Lecturer, Engineer, Career Switcher).
// ==============================================================================

import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick } from '../utils/cyberMotionAudio'
import { CLOUD_PROVIDERS } from '../data/multiCloudResources'
import { AUDIENCE_PERSONAS } from '../data/learning/stepWiseSkillMap'
import { Sparkles, Globe, Target, UserCheck, Check, Layers } from 'lucide-react'

export default function LearningTrackModeSwitcher({ className = '' }) {
  const {
    learningTrackMode = 'multi',
    setLearningTrackMode,
    targetCloudSpecialty = 'aws',
    setTargetCloudSpecialty,
    learningPersona = 'student',
    setLearningPersona
  } = useChallenges() || {}

  const handleModeChange = (mode) => {
    playTactileClick()
    if (setLearningTrackMode) {
      setLearningTrackMode(mode)
    }
  }

  const handleCloudChange = (cloudId) => {
    playTactileClick()
    if (setTargetCloudSpecialty) {
      setTargetCloudSpecialty(cloudId)
    }
  }

  const handlePersonaChange = (personaId) => {
    playTactileClick()
    if (setLearningPersona) {
      setLearningPersona(personaId)
    }
  }

  const activePersonaObj = AUDIENCE_PERSONAS.find(p => p.id === learningPersona) || AUDIENCE_PERSONAS[0]
  const activeCloudObj = CLOUD_PROVIDERS.find(p => p.id === targetCloudSpecialty) || CLOUD_PROVIDERS[0]

  return (
    <div className={`learning-track-mode-switcher-card ${className}`} role="region" aria-label="Learning Mode & Persona Settings">
      {/* Top Row: Track Mode Selector (Single Cloud vs Multi-Cloud) */}
      <div className="track-mode-header-row">
        <div className="track-mode-title-group">
          <span className="naen-brand-pill">NAEN STUDIOS • CURRICULUM ARCHITECTURE</span>
          <h3 className="track-mode-headline">Select Your Learning Path: Single-Cloud vs. Multi-Cloud</h3>
          <p className="track-mode-desc">
            Choose whether to specialize in one ecosystem or master enterprise cross-cloud defense across all 5 providers.
          </p>
        </div>

        <div className="track-mode-pill-toggle" role="radiogroup" aria-label="Track Mode">
          <button
            type="button"
            className={`track-mode-btn ${learningTrackMode === 'single' ? 'active' : ''}`}
            onClick={() => handleModeChange('single')}
            role="radio"
            aria-checked={learningTrackMode === 'single'}
          >
            <Target size={14} />
            <span>Single-Cloud Specialist Track</span>
          </button>

          <button
            type="button"
            className={`track-mode-btn ${learningTrackMode === 'multi' ? 'active' : ''}`}
            onClick={() => handleModeChange('multi')}
            role="radio"
            aria-checked={learningTrackMode === 'multi'}
          >
            <Globe size={14} />
            <span>5-Cloud Enterprise Master Track</span>
            <span className="mode-highlight-badge">Recommended</span>
          </button>
        </div>
      </div>

      {/* Sub-Row: Single Cloud Ecosystem Selector (Only displayed if Single-Cloud mode active) */}
      {learningTrackMode === 'single' ? (
        <div className="single-cloud-target-subrow animate-reveal">
          <span className="subrow-label">Target Cloud Specialization:</span>
          <div className="single-cloud-pills-wrap">
            {CLOUD_PROVIDERS.map(provider => {
              const isSelected = targetCloudSpecialty === provider.id
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => handleCloudChange(provider.id)}
                  className={`single-target-pill ${isSelected ? 'active' : ''}`}
                  style={{
                    borderColor: isSelected ? provider.accentColor : 'rgba(148, 163, 184, 0.2)',
                    background: isSelected ? `color-mix(in srgb, ${provider.accentColor} 18%, rgba(15, 23, 42, 0.95))` : 'rgba(15, 23, 42, 0.6)'
                  }}
                >
                  <span>{provider.iconEmoji}</span>
                  <span style={{ color: isSelected ? provider.accentColor : '#cbd5e1', fontWeight: isSelected ? 700 : 500 }}>
                    {provider.name}
                  </span>
                  <code className="target-cli-code">{provider.cliName}</code>
                </button>
              )
            })}
          </div>
          <div className="target-specialty-callout">
            <span style={{ color: activeCloudObj.accentColor, fontWeight: 700 }}>
              {activeCloudObj.iconEmoji} {activeCloudObj.shortName} Specialist Pathway:
            </span>
            <span> Curricula, labs, CLI runbooks, and certifications will focus strictly on {activeCloudObj.name} ({activeCloudObj.certKey}).</span>
          </div>
        </div>
      ) : (
        <div className="multi-cloud-active-notice animate-reveal">
          <Layers size={14} className="text-cyan" />
          <span>
            <strong>5-Cloud Comparative Mode Active:</strong> Every foundational concept, lab step, and architecture review presents side-by-side runbooks across <strong>AWS</strong>, <strong>Microsoft Azure</strong>, <strong>Google Cloud (GCP)</strong>, <strong>Oracle Cloud (OCI)</strong>, and <strong>IBM Cloud</strong>.
          </span>
        </div>
      )}

      {/* Persona Pathway Selector (Student, Lecturer, Working Engineer, Career Switcher) */}
      <div className="persona-pathway-section">
        <div className="persona-section-head">
          <UserCheck size={14} className="text-amber" />
          <span className="persona-label">Tailor Curriculum by Learner Background:</span>
        </div>

        <div className="persona-cards-grid">
          {AUDIENCE_PERSONAS.map(persona => {
            const isSelected = learningPersona === persona.id
            return (
              <div
                key={persona.id}
                className={`persona-card ${isSelected ? 'active' : ''}`}
                onClick={() => handlePersonaChange(persona.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handlePersonaChange(persona.id)}
              >
                <div className="persona-card-top">
                  <span className="persona-emoji">{persona.emoji}</span>
                  <div className="persona-name-group">
                    <strong className="persona-title">{persona.title}</strong>
                    <span className="persona-tagline">{persona.tagline}</span>
                  </div>
                  {isSelected && (
                    <span className="persona-active-check">
                      <Check size={12} />
                    </span>
                  )}
                </div>
                <p className="persona-desc">{persona.description}</p>
                <div className="persona-perks-list">
                  {persona.perks.map((perk, idx) => (
                    <span key={idx} className="persona-perk-chip">
                      ✓ {perk}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
