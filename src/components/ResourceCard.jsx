import { ArrowUpRight, BookOpen, ExternalLink, ShieldCheck, Flame, Terminal } from 'lucide-react'

export default function ResourceCard({ resource }) {
  if (!resource) return null

  const isThm = (resource.provider === 'tryhackme') || (resource.title || '').includes('TryHackMe')
  const isHtb = (resource.provider === 'hackthebox') || (resource.title || '').includes('HackTheBox')
  const isAzure = resource.provider === 'azure'
  const isGcp = resource.provider === 'gcp'
  const isOci = resource.provider === 'oci'
  const isIbm = resource.provider === 'ibm'
  const isLinux = resource.provider === 'linux'
  const isPython = resource.provider === 'python'
  const isNetworking = resource.provider === 'networking'
  const isDocker = resource.provider === 'docker'
  const isTerraform = resource.provider === 'terraform'
  const isRoadmap = resource.provider === 'roadmap'
  const isAws = resource.provider === 'aws' || (!isThm && !isHtb && !isAzure && !isGcp && !isOci && !isIbm && !isLinux && !isPython && !isNetworking && !isDocker && !isTerraform && !isRoadmap)

  let providerLabel = 'AWS'
  let providerColor = '#f59e0b'

  if (isThm) {
    providerLabel = 'TryHackMe'
    providerColor = '#f43f5e'
  } else if (isHtb) {
    providerLabel = 'HackTheBox'
    providerColor = '#22c55e'
  } else if (isAzure) {
    providerLabel = 'Azure'
    providerColor = '#0ea5e9'
  } else if (isGcp) {
    providerLabel = 'Google Cloud'
    providerColor = '#ef4444'
  } else if (isOci) {
    providerLabel = 'Oracle Cloud'
    providerColor = '#ea580c'
  } else if (isIbm) {
    providerLabel = 'IBM Cloud'
    providerColor = '#6366f1'
  } else if (isLinux) {
    providerLabel = 'Linux'
    providerColor = '#eab308'
  } else if (isPython) {
    providerLabel = 'Python'
    providerColor = '#38bdf8'
  } else if (isNetworking) {
    providerLabel = 'Networking'
    providerColor = '#06b6d4'
  } else if (isDocker) {
    providerLabel = 'Docker'
    providerColor = '#0284c7'
  } else if (isTerraform) {
    providerLabel = 'Terraform'
    providerColor = '#8b5cf6'
  } else if (isRoadmap) {
    providerLabel = '90-Day Roadmap'
    providerColor = '#10b981'
  }

  return (
    <article className="resource-card" style={{ borderLeft: `3px solid ${providerColor}` }}>
      <div className="resource-card-top">
        <span className="resource-icon" aria-hidden="true" style={{ color: providerColor }}>
          {isThm ? <Flame size={17} /> : (isHtb || isLinux) ? <Terminal size={17} /> : <BookOpen size={17} />}
        </span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span 
            style={{ 
              font: "700 10px 'DM Mono', monospace", 
              color: providerColor, 
              background: `${providerColor}18`, 
              padding: '2px 6px', 
              borderRadius: '4px',
              border: `1px solid ${providerColor}33`
            }}
          >
            {providerLabel}
          </span>
          <span className="resource-difficulty">{resource.difficulty || 'All Levels'}</span>
          {resource.tier && (
            <span 
              style={{ 
                font: "600 10px 'DM Mono', monospace", 
                color: resource.tier.includes('Free') ? '#10b981' : '#f59e0b', 
                background: resource.tier.includes('Free') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', 
                padding: '2px 6px', 
                borderRadius: '4px',
                border: `1px solid ${resource.tier.includes('Free') ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}` 
              }}
            >
              {resource.tier}
            </span>
          )}
        </div>
      </div>

      <span className="resource-category">{resource.category}</span>
      <h3 style={{ fontSize: '15px', margin: '4px 0 8px', color: '#f8fafc' }}>{resource.title}</h3>
      <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 10px' }}>{resource.why}</p>

      {resource.billingSafetyNote && (
        <div style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 0 12px', background: 'rgba(16, 185, 129, 0.08)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <ShieldCheck size={12} style={{ flexShrink: 0 }} />
          <span>{resource.billingSafetyNote}</span>
        </div>
      )}

      <a
        className="resource-link"
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${resource.title} in a new tab`}
      >
        <span>Open Resource</span>
        <ExternalLink size={13} />
      </a>
      <ArrowUpRight className="resource-arrow" size={16} aria-hidden="true" />
    </article>
  )
}
