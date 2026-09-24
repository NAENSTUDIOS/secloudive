import { ArrowRight, CheckCircle2, Compass, Sparkles } from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { learningPaths, resourceCatalog } from '../data/learningResources'
import ResourceCard from './ResourceCard'

const domainKeys = ['iam', 's3', 'network', 'monitoring', 'architecture']
const roadmap = ['Beginner', 'Intermediate', 'Advanced', 'Cloud Security Engineer']

function getDomainScores(challenges, progress) {
  return domainKeys.map(key => {
    const items = challenges.filter(challenge => challenge.id.startsWith(key))
    const reviewScores = key === 'architecture' ? items.map(item => progress.architectureScores?.[item.id]).filter(score => score !== undefined) : []
    const completed = items.filter(item => progress.completed[item.id]).length
    const score = reviewScores.length ? reviewScores.reduce((sum, value) => sum + value, 0) / reviewScores.length : (completed / Math.max(1, items.length)) * 100
    return { key, score }
  })
}

export default function OfficialLearningPaths({ variant = 'report' }) {
  const { challenges, progress } = useChallenges()
  const scores = getDomainScores(challenges, progress)
  const weakest = [...scores].sort((first, second) => first.score - second.score)[0].key
  const average = scores.reduce((sum, domain) => sum + domain.score, 0) / scores.length
  const currentStage = average >= 71 ? 2 : average >= 41 ? 1 : 0
  const path = learningPaths[weakest]
  const isCareer = variant === 'career'
  return <section className={`learning-path-section learning-path-${variant}`} aria-labelledby={`${variant}-learning-path-title`}><div className="learning-path-inner"><div className="learning-path-heading"><div><div className="report-section-label"><Compass size={13} /> {isCareer ? 'CAREER READINESS / OFFICIAL AWS RESOURCES' : 'OFFICIAL AWS LEARNING PATHS'}</div><h2 id={`${variant}-learning-path-title`}>{isCareer ? 'Build the skills behind your next milestone.' : 'Recommended learning path.'}</h2><p>{path.intro} Based on your current assessment, <strong>{path.title}</strong> is the best next step.</p></div><div className="learning-path-signal"><Sparkles size={15} /><span>Weakest signal<br /><strong>{path.title.replace(' Path', '')}</strong></span></div></div><div className="learning-roadmap" aria-label="Learning progression"><div className="learning-roadmap-line" />{roadmap.map((stage, index) => <div className={`learning-roadmap-step ${index < currentStage ? 'is-complete' : ''} ${index === currentStage ? 'is-current' : ''}`} key={stage}><span>{index < currentStage ? <CheckCircle2 size={13} /> : String(index + 1).padStart(2, '0')}</span><strong>{stage}</strong>{index < roadmap.length - 1 && <ArrowRight className="roadmap-arrow" size={15} />}</div>)}</div><div className="recommended-path-block"><div className="learning-subheading"><div><span>01 / YOUR NEXT PATH</span><h3>{path.title}</h3></div><span className="path-score">{Math.round(path === learningPaths[weakest] ? scores.find(score => score.key === weakest).score : 0)}% domain coverage</span></div><div className="resource-grid">{path.resources.map(resourceKey => <ResourceCard key={resourceKey} resource={resourceCatalog[resourceKey]} />)}</div></div><div className="all-paths-block"><div className="learning-subheading"><div><span>02 / EXPLORE BY DOMAIN</span><h3>Build your complete cloud security toolkit.</h3></div></div><div className="path-groups">{Object.entries(learningPaths).map(([key, domainPath]) => <section className={`path-resource-group ${key === weakest ? 'is-weakest' : ''}`} key={key}><div className="path-group-heading"><span>{key === weakest ? 'RECOMMENDED NOW' : 'LEARNING PATH'}</span><strong>{domainPath.title}</strong></div><div className="path-group-resources">{domainPath.resources.map(resourceKey => <ResourceCard key={resourceKey} resource={resourceCatalog[resourceKey]} />)}</div></section>)}</div></div><div className="learning-path-footer"><span>AWS-curated links. No paid services. Learn at your pace.</span><a href="https://aws.amazon.com/security/resources/" target="_blank" rel="noopener noreferrer">Explore all AWS security resources <ArrowRight size={14} /></a></div></div></section>
}
