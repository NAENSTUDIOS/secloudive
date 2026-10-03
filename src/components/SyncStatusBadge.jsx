import { Cloud, Check, RefreshCw, UserCheck, ShieldAlert, User, Sparkles } from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'

export default function SyncStatusBadge() {
  const { activeProfile = {}, autoSaveState = {} } = useChallenges() || {}
  const isSaving = autoSaveState.isSaving
  const isGuest = Boolean(activeProfile.isGuest || !activeProfile.id || activeProfile.id === 'guest')
  const userId = activeProfile.id || 'guest'

  const handleOpenSyncModal = () => {
    window.dispatchEvent(new CustomEvent('open-user-sync-modal'))
  }

  if (isGuest) {
    return (
      <button
        type="button"
        className="nav-sync-badge-btn is-guest"
        onClick={handleOpenSyncModal}
        title="Running in Guest Mode (Temporary Sandbox)&#10;Click to claim your Unique User ID, isolate your data, and enable auto-sync!"
        aria-label="Running in Guest Mode. Click to claim unique User ID"
        style={{
          border: '1px solid rgba(245, 158, 11, 0.4)',
          background: 'rgba(245, 158, 11, 0.1)',
          color: '#fbbf24'
        }}
      >
        <div className="nav-sync-status-indicator">
          <User size={13} className="text-amber" />
          <span className="sync-live-dot" style={{ background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
        </div>

        <div className="nav-sync-text-group" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className="nav-sync-label" style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.74rem' }}>
            Guest Mode
          </span>
          <span
            className="nav-sync-user-tag"
            style={{
              borderColor: 'rgba(245, 158, 11, 0.5)',
              color: '#000',
              background: '#f59e0b',
              fontWeight: 800,
              fontSize: '0.62rem',
              padding: '1px 5px',
              borderRadius: '4px'
            }}
          >
            Claim ID
          </span>
        </div>
      </button>
    )
  }

  // Authenticated unique user ID
  return (
    <button
      type="button"
      className="nav-sync-badge-btn is-authenticated"
      onClick={handleOpenSyncModal}
      title={`Unique User ID: ${userId}\nProfile: ${activeProfile.name || 'Cloud Security Engineer'}\nStatus: ${isSaving ? 'Auto-saving changes…' : 'Isolated Data & Auto-Sync Active'}\nClick to manage user profiles or export backup.`}
      aria-label={`Logged in as ${userId}. Auto-sync active.`}
      style={{
        border: '1px solid rgba(16, 185, 129, 0.35)',
        background: 'rgba(15, 23, 42, 0.85)'
      }}
    >
      <div className="nav-sync-status-indicator">
        {isSaving ? (
          <RefreshCw size={12} className="sync-spin-icon text-cyan" />
        ) : (
          <Cloud size={13} className="text-emerald" />
        )}
        <span className={`sync-live-dot ${isSaving ? 'is-saving' : 'is-saved'}`} />
      </div>

      <div className="nav-sync-text-group" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="nav-sync-label" style={{ fontSize: '0.74rem', color: isSaving ? '#38bdf8' : activeProfile.authProvider === 'google' ? '#34d399' : '#10b981', fontWeight: 600 }}>
          {isSaving ? 'Saving…' : activeProfile.authProvider === 'google' ? 'Google ID Synced' : 'Auto-Sync'}
        </span>
        <span 
          className="nav-sync-user-tag"
          style={{ 
            borderColor: activeProfile.authProvider === 'google' ? 'rgba(52, 211, 153, 0.5)' : `${activeProfile.avatarColor || '#38bdf8'}60`, 
            color: activeProfile.authProvider === 'google' ? '#34d399' : activeProfile.avatarColor || '#38bdf8',
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '0.68rem',
            padding: '1px 6px',
            borderRadius: '4px',
            background: 'rgba(15, 23, 42, 0.6)'
          }}
        >
          {userId.length > 12 ? `${userId.slice(0, 10)}…` : userId}
        </span>
      </div>
    </button>
  )
}
