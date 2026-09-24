import { useState } from 'react'
import { FileCode, Copy, Check, Terminal, Info, ExternalLink } from 'lucide-react'

export default function EvidenceViewer({ evidenceList = [] }) {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)

  if (!evidenceList || evidenceList.length === 0) {
    return (
      <div className="evidence-empty">
        <Terminal size={18} />
        <span>No forensic artifacts attached to this ticket.</span>
      </div>
    )
  }

  const active = evidenceList[activeTab] || evidenceList[0]

  const handleCopy = () => {
    if (!active?.content) return
    navigator.clipboard.writeText(active.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate line numbers for the code block
  const lines = (active.content || '').split('\n')

  return (
    <div className="evidence-viewer">
      <div className="evidence-header">
        <div className="evidence-tabs" role="tablist" aria-label="Evidence Artifacts">
          {evidenceList.map((item, idx) => (
            <button
              key={item.name || idx}
              role="tab"
              aria-selected={activeTab === idx}
              className={`evidence-tab ${activeTab === idx ? 'is-active' : ''}`}
              onClick={() => {
                setActiveTab(idx)
                setCopied(false)
              }}
            >
              <FileCode size={13} className="tab-icon" />
              <span className="tab-name">{item.name}</span>
              <span className="tab-type">{item.type}</span>
            </button>
          ))}
        </div>

        <div className="evidence-actions">
          <button
            type="button"
            className="evidence-action-btn"
            onClick={handleCopy}
            title="Copy raw artifact"
            aria-label="Copy raw artifact"
          >
            {copied ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy Artifact'}</span>
          </button>
        </div>
      </div>

      {active.notes && (
        <div className="evidence-notes-bar">
          <Info size={14} className="notes-icon" />
          <div className="notes-content">
            <span className="notes-label">Analyst Evidence Context:</span>
            <span className="notes-text">{active.notes}</span>
          </div>
        </div>
      )}

      <div className="evidence-code-container">
        <div className="evidence-line-numbers" aria-hidden="true">
          {lines.map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <pre className="evidence-code-body">
          <code>{active.content}</code>
        </pre>
      </div>

      <div className="evidence-footer">
        <span className="artifact-meta">
          Artifact: <strong>{active.name}</strong> • Type: {active.type} • {lines.length} lines
        </span>
        <span className="status-pill live-telemetry">
          <span className="pulse-dot-small" /> Forensic Snapshot
        </span>
      </div>
    </div>
  )
}
