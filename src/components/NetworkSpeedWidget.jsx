import { useState, useEffect } from 'react'
import { subscribeNetworkSpeed } from '../utils/networkSpeedDetector'
import { Activity, Wifi, Signal, Globe, Zap, X } from 'lucide-react'

export default function NetworkSpeedWidget() {
  const [telemetry, setTelemetry] = useState(() => ({
    effectiveType: '4g',
    downlink: 10,
    rtt: 35,
    statusGrade: 'OPTIMAL (4G/5G)',
    statusColor: '#10b981',
    isOnline: true
  }))
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeNetworkSpeed(data => {
      setTelemetry(data)
    })
    return unsubscribe
  }, [])

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => setIsDetailOpen(!isDetailOpen)}
        title={`Network: ${telemetry.statusGrade} | Latency: ${telemetry.rtt}ms | Throughput: ${telemetry.downlink} Mbps`}
        aria-label="Network Speed Telemetry"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 9px',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '9999px',
          color: '#cbd5e1',
          fontSize: '0.72rem',
          fontFamily: "'DM Mono', monospace",
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: telemetry.statusColor,
            boxShadow: `0 0 8px ${telemetry.statusColor}`,
            display: 'inline-block'
          }}
        />
        <span style={{ color: '#f8fafc', fontWeight: 700 }}>
          {telemetry.rtt}ms
        </span>
        <span style={{ color: '#94a3b8', fontSize: '0.66rem' }}>
          • {telemetry.downlink}M
        </span>
      </button>

      {/* Flyout detail modal if clicked */}
      {isDetailOpen && (
        <div
          role="dialog"
          aria-label="Network Telemetry Details"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 1000,
            width: '280px',
            background: 'rgba(15, 23, 42, 0.96)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '12px',
            padding: '14px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.15)',
            color: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} className="text-cyan" />
              <strong style={{ fontSize: '0.78rem', letterSpacing: '0.05em', color: '#38bdf8' }}>
                AUTO NETWORK DETECTOR
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setIsDetailOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
              aria-label="Close Network Telemetry Details"
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
              <span style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>PING (RTT)</span>
              <strong style={{ fontSize: '1.05rem', color: telemetry.statusColor }}>{telemetry.rtt} ms</strong>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(51, 65, 85, 0.4)' }}>
              <span style={{ fontSize: '0.64rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>DOWNLINK</span>
              <strong style={{ fontSize: '1.05rem', color: '#38bdf8' }}>{telemetry.downlink} Mbps</strong>
            </div>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Connection Grade:</span>
              <span style={{ color: telemetry.statusColor, fontWeight: 700 }}>{telemetry.statusGrade}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Network Type:</span>
              <span style={{ color: '#e2e8f0', textTransform: 'uppercase' }}>{telemetry.effectiveType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Connection State:</span>
              <span style={{ color: telemetry.isOnline ? '#10b981' : '#ef4444' }}>
                {telemetry.isOnline ? 'Online / Stable' : 'Offline'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsDetailOpen(false)
              window.dispatchEvent(new CustomEvent('open-latency-monitor'))
            }}
            style={{
              width: '100%',
              padding: '6px 10px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(129, 140, 248, 0.15))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '6px',
              color: '#38bdf8',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Globe size={13} /> Open Global AWS Ping Matrix
          </button>
        </div>
      )}
    </div>
  )
}
