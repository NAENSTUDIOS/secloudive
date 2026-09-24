import { ArrowUpRight, BookOpen, ExternalLink } from 'lucide-react'

export default function ResourceCard({ resource }) {
  return <article className="resource-card"><div className="resource-card-top"><span className="resource-icon" aria-hidden="true"><BookOpen size={17} /></span><span className="resource-difficulty">{resource.difficulty}</span></div><span className="resource-category">{resource.category}</span><h3>{resource.title}</h3><p>{resource.why}</p><a className="resource-link" href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${resource.title} in a new tab`}>Open resource <ExternalLink size={14} /></a><ArrowUpRight className="resource-arrow" size={16} aria-hidden="true" /></article>
}
