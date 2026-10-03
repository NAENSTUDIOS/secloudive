import { useState, useEffect } from 'react'
import {
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  RotateCw,
  Clock,
  Database,
  CheckCircle2,
  X,
  Radio,
  FileCheck2,
  ExternalLink
} from 'lucide-react'
import { getGatewayHealthSnapshot, subscribeGatewayMetrics } from '../services/aiGateway'
import { aiResponseAuditStore } from '../services/aiSafetyGuardrails'
import HumanReviewEscalationQueue from './HumanReviewEscalationQueue'

export default function AIOperationsDashboard({ compact = false, onClose = null }) {
  const [metrics, setMetrics] = useState(getGatewayHealthSnapshot())
  const [showEscalationModal, setShowEscalationModal] = useState(false)
  const [pendingEscalationsCount, setPendingEscalationsCount] = useState(0)

  useEffect(() => {
    const unsubscribe = subscribeGatewayMetrics(updated => {
      setMetrics(updated)
    })
    
    // Count pending escalations from audit store
    const logs = aiResponseAuditStore.getLogs()
    const pending = logs.filter(l => !l.reviewedByHuman && l.confidenceScore < 70).length
    setPendingEscalationsCount(pending)

    return () => unsubscribe()
  }, [])

  const isHealthy = metrics.activeKeys > 0

  return (
    <div className={`ai-ops-dashboard-shell ${compact ? 'is-compact' : ''}`}>
      {/* Top Header */}
      <div className="ai-ops-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <Cpu size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
              SECLOUDIVE INTELLIGENCE ENGINE
            </div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700 }}>
              AI Gateway, Safety Guardrails & Key Rotation
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: isHealthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)', border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`, borderRadius: '20px', color: isHealthy ? '#6ee7b7' : '#fda4af', fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isHealthy ? '#10b981' : '#f43f5e' }} />
            {isHealthy ? 'GATEWAY OPERATIONAL' : 'DEGRADED COOLDOWN'}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Active Gemini Keys</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
            {metrics.activeKeys} / {metrics.totalKeys}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '2px' }}>● Round-robin pool</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Success Rate</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            {metrics.successRate}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>{metrics.successfulRequests} reqs served</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Avg Latency</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c084fc', marginTop: '2px' }}>
            {metrics.averageResponseTimeMs} ms
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>Sub-second inference</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '10px' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Cache Hits</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
            {metrics.cacheHits}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '2px' }}>Zero-cost token save</div>
        </div>
      </div>

      {/* Human Escalation Framework Action Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '8px', marginBottom: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck2 size={16} style={{ color: '#f43f5e' }} />
            <strong style={{ fontSize: '0.85rem', color: '#fda4af' }}>Human Review Escalation Framework</strong>
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.2)', color: '#fecdd3', fontWeight: 700 }}>
              {pendingEscalationsCount} Flagged
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
            Enforces 90%/70% thresholds. Responses with &lt;70% confidence or unverified claims require human review.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowEscalationModal(true)}
          style={{
            padding: '6px 14px',
            background: '#f43f5e',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          Open Escalation Queue <ExternalLink size={12} />
        </button>
      </div>

      {/* Confidence Threshold Guidance Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px', fontSize: '0.72rem' }}>
        <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '6px' }}>
          <strong style={{ color: '#6ee7b7' }}>High (90-100%)</strong>
          <p style={{ margin: '2px 0 0', color: '#94a3b8' }}>✅ Show recommendation directly</p>
        </div>
        <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '6px' }}>
          <strong style={{ color: '#fcd34d' }}>Medium (70-89%)</strong>
          <p style={{ margin: '2px 0 0', color: '#94a3b8' }}>⚠ Show with warning banner</p>
        </div>
        <div style={{ padding: '8px', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '6px' }}>
          <strong style={{ color: '#fda4af' }}>Low (&lt;70%)</strong>
          <p style={{ margin: '2px 0 0', color: '#fda4af' }}>🚨 Require human review</p>
        </div>
      </div>

      {/* Key Pool Health Table */}
      <div style={{ background: 'rgba(2, 6, 23, 0.7)', border: '1px solid rgba(56, 189, 248, 0.15)', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.04em' }}>
            LOAD BALANCED KEY ROTATION STATUS
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
            Active Model: <code style={{ color: '#38bdf8' }}>{metrics.activeModel}</code>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {metrics.keyStatuses?.map((keyItem, i) => (
            <div
              key={keyItem.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '6px',
                fontSize: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: keyItem.status === 'ACTIVE' ? '#10b981' : '#f43f5e' }} />
                <strong style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{keyItem.id}</strong>
                <span style={{ color: '#64748b' }}>• Handled {keyItem.requestsHandled} calls</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {keyItem.failures > 0 && (
                  <span style={{ color: '#f43f5e', fontSize: '0.7rem' }}>{keyItem.failures} failover</span>
                )}
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: keyItem.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    color: keyItem.status === 'ACTIVE' ? '#6ee7b7' : '#fda4af',
                    fontWeight: 700,
                    fontSize: '0.68rem'
                  }}
                >
                  {keyItem.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Isolation Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(15, 23, 42, 0.4)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
        <ShieldCheck size={14} style={{ color: '#38bdf8', flexShrink: 0 }} />
        <span>
          <strong>Zero API Key Exposure:</strong> Keys are securely isolated via environment variables. Resilient fallback reasoning guarantees 100% platform uptime.
        </span>
      </div>

      {/* Render Escalation Queue Modal */}
      <HumanReviewEscalationQueue
        isOpen={showEscalationModal}
        onClose={() => {
          setShowEscalationModal(false)
          // Update pending count
          const logs = aiResponseAuditStore.getLogs()
          const pending = logs.filter(l => !l.reviewedByHuman && l.confidenceScore < 70).length
          setPendingEscalationsCount(pending)
        }}
      />
    </div>
  )
}
