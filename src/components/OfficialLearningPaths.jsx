import { ArrowRight, CheckCircle2, Compass, Sparkles, Globe } from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { learningPaths, resourceCatalog, getResourcesForDomain } from '../data/learningResources'
import ResourceCard from './ResourceCard'

const domainKeys = ['foundations', 'iam', 's3', 'network', 'monitoring', 'incident-response', 'architecture']
const roadmap = ['Foundations', 'Identity & Data', 'Perimeter & SIEM', 'Incident Response', 'Enterprise Architect']

function getDomainScores(challenges = [], progress = {}) {
  return domainKeys.map(key => {
    const items = challenges.filter(c => c.id && c.id.startsWith(key))
    const reviewScores = key === 'architecture'
      ? items.map(item => progress.architectureScores?.[item.id]).filter(score => score !== undefined)
      : []
    const completed = items.filter(item => progress.completed?.[item.id]).length
    const score = reviewScores.length
      ? reviewScores.reduce((sum, value) => sum + value, 0) / reviewScores.length
      : items.length > 0 ? (completed / items.length) * 100 : 50
    return { key, score: Math.round(score) }
  })
}

export default function OfficialLearningPaths({ variant = 'report' }) {
  const { challenges = [], progress = {}, selectedCloudProvider = 'all' } = useChallenges() || {}
  const scores = getDomainScores(challenges, progress)
  const sorted = [...scores].sort((a, b) => a.score - b.score)
  const weakest = sorted[0]?.key || 'iam'
  const average = scores.reduce((sum, d) => sum + d.score, 0) / Math.max(1, scores.length)
  const currentStage = average >= 80 ? 4 : average >= 60 ? 3 : average >= 40 ? 2 : average >= 20 ? 1 : 0
  const path = learningPaths[weakest] || learningPaths.iam
  const isCareer = variant === 'career'

  return (
    <section className={`learning-path-section learning-path-${variant}`} aria-labelledby={`${variant}-learning-path-title`}>
      <div className="learning-path-inner">
        <div className="learning-path-heading">
          <div>
            <div className="report-section-label">
              <Compass size={13} /> 
              <span>{isCareer ? 'NAEN STUDIOS • CAREER READINESS & MULTI-CLOUD REPOSITORY' : 'OFFICIAL MULTI-CLOUD & CTF LEARNING PATHS'}</span>
            </div>
            <h2 id={`${variant}-learning-path-title`}>
              {isCareer ? 'Build the verified skills behind your next milestone.' : 'Recommended Learning Path & Practice Rooms.'}
            </h2>
            <p>
              {path.intro} Based on your current diagnostic assessment, <strong>{path.title}</strong> is your highest-impact next step.
            </p>
          </div>
          <div className="learning-path-signal">
            <Sparkles size={15} />
            <span>
              Priority Growth Domain<br />
              <strong>{path.title.replace(' Path', '')}</strong>
            </span>
          </div>
        </div>

        {/* Progression Roadmap */}
        <div className="learning-roadmap" aria-label="Learning progression">
          <div className="learning-roadmap-line" />
          {roadmap.map((stage, index) => (
            <div 
              key={stage}
              className={`learning-roadmap-step ${index < currentStage ? 'is-complete' : ''} ${index === currentStage ? 'is-current' : ''}`}
            >
              <span>{index < currentStage ? <CheckCircle2 size={13} /> : String(index + 1).padStart(2, '0')}</span>
              <strong>{stage}</strong>
              {index < roadmap.length - 1 && <ArrowRight className="roadmap-arrow" size={15} />}
            </div>
          ))}
        </div>

        {/* 01: Top Recommended Path Resources */}
        <div className="recommended-path-block">
          <div className="learning-subheading">
            <div>
              <span>01 / YOUR HIGHEST PRIORITY DOMAIN</span>
              <h3>{path.title}</h3>
            </div>
            <span className="path-score">
              {scores.find(s => s.key === weakest)?.score || 0}% verified mastery
            </span>
          </div>
          <div className="resource-grid">
            {path.resources.map(resourceKey => (
              <ResourceCard key={resourceKey} resource={resourceCatalog[resourceKey]} />
            ))}
          </div>
        </div>

        {/* 02: Explore Across All 5 Clouds & CTF Platforms */}
        <div className="all-paths-block">
          <div className="learning-subheading">
            <div>
              <span>02 / MULTI-CLOUD CURRICULUM & CTF LABS</span>
              <h3>Comprehensive Documentation & TryHackMe® / HackTheBox® Catalog</h3>
            </div>
          </div>
          <div className="path-groups">
            {Object.entries(learningPaths).map(([key, domainPath]) => {
              const isWeakest = key === weakest
              return (
                <section className={`path-resource-group ${isWeakest ? 'is-weakest' : ''}`} key={key}>
                  <div className="path-group-heading">
                    <span>{isWeakest ? 'RECOMMENDED FIRST' : 'CURRICULUM TRACK'}</span>
                    <strong>{domainPath.title}</strong>
                  </div>
                  <div className="path-group-resources">
                    {domainPath.resources.map(resourceKey => (
                      <ResourceCard key={resourceKey} resource={resourceCatalog[resourceKey]} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>

        <div className="learning-path-footer">
          <span>NAEN Studios curated multi-cloud documentation, architecture whitepapers & hands-on CTF rooms.</span>
          <a href="/learning" className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300">
            Open Full Step-Wise Progression Map <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
