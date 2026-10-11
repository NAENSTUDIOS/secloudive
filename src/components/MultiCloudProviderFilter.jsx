// ==============================================================================
// SeCloudive AWS Security Core Services & Domain Filter Bar
// 100% Dedicated to Amazon Web Services (AWS) Cloud Security
// ==============================================================================

import { useChallenges } from '../context/ChallengeContext'
import { playTactileClick } from '../utils/cyberMotionAudio'
import { ExternalLink, Sparkles, Check, Shield } from 'lucide-react'

export default function MultiCloudProviderFilter({ compact = false, showDetails = false, className = '' }) {
  const { selectedCloudProvider = 'all', setSelectedCloudProvider, cloudProviders = [] } = useChallenges() || {}

  const handleSelect = (providerId) => {
    playTactileClick()
    if (setSelectedCloudProvider) {
      setSelectedCloudProvider(providerId)
    }
  }

  const activeProviderObj = cloudProviders.find(p => p.id === selectedCloudProvider)

  return (
    <div className={`multi-cloud-provider-bar ${compact ? 'is-compact' : ''} ${className}`} role="region" aria-label="AWS Security Services Filter">
      <div className="cloud-pills-row">
        <span className="cloud-pills-label">
          <Shield size={14} className="text-cyan animate-pulse" />
          <span>AWS Security Domains:</span>
        </span>

        {/* All AWS Security Pill */}
        <button
          type="button"
          onClick={() => handleSelect('all')}
          className={`cloud-pill ${selectedCloudProvider === 'all' ? 'active pill-all' : ''}`}
          aria-pressed={selectedCloudProvider === 'all'}
        >
          <span className="cloud-pill-emoji">🟧</span>
          <span className="cloud-pill-title">All AWS Security</span>
          <span className="cloud-pill-count">5 Domains</span>
        </button>

        {/* Individual AWS Security Pillar Pills */}
        {cloudProviders.map(provider => {
          const isSelected = selectedCloudProvider === provider.id
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => handleSelect(provider.id)}
              className={`cloud-pill ${isSelected ? 'active' : ''}`}
              style={{
                borderColor: isSelected ? provider.accentColor : 'rgba(148, 163, 184, 0.2)',
                background: isSelected ? `color-mix(in srgb, ${provider.accentColor} 18%, rgba(15, 23, 42, 0.9))` : 'rgba(15, 23, 42, 0.65)'
              }}
              aria-pressed={isSelected}
            >
              <span className="cloud-pill-emoji">{provider.iconEmoji}</span>
              <span className="cloud-pill-title" style={{ color: isSelected ? provider.accentColor : '#cbd5e1' }}>
                {provider.shortName}
              </span>
              <span className="cloud-pill-cli font-mono text-muted">
                ${provider.cliName}
              </span>
            </button>
          )
        })}
      </div>

      {/* Optional Provider Detail Banner */}
      {showDetails && activeProviderObj && (
        <div 
          className="cloud-provider-detail-banner"
          style={{
            borderLeftColor: activeProviderObj.accentColor
          }}
        >
          <div className="cpd-left">
            <span className="cpd-emoji">{activeProviderObj.iconEmoji}</span>
            <div>
              <div className="cpd-name">
                <strong>{activeProviderObj.name}</strong> • <span style={{ color: activeProviderObj.accentColor }}>{activeProviderObj.marketShare}</span>
              </div>
              <div className="cpd-meta">
                <span><strong>Target Cert:</strong> {activeProviderObj.certKey}</span>
                <span>•</span>
                <span><strong>Security Framework:</strong> {activeProviderObj.wafName}</span>
              </div>
            </div>
          </div>
          <a
            href={activeProviderObj.cliDocUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cpd-cli-link"
            style={{ color: activeProviderObj.accentColor, borderColor: `color-mix(in srgb, ${activeProviderObj.accentColor} 40%, transparent)` }}
          >
            <span>{activeProviderObj.cliName} Documentation</span>
            <ExternalLink size={13} />
          </a>
        </div>
      )}
    </div>
  )
}
