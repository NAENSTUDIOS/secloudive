import { useState, useEffect, useCallback } from 'react'
import {
  Radio,
  RefreshCw,
  X,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  Server,
  ShieldCheck,
  Sparkles
} from 'lucide-react'

const AWS_REGIONS = [
  { id: 'us-east-1', name: 'US East (N. Virginia)', continent: 'North America', endpoint: 'https://dynamodb.us-east-1.amazonaws.com/' },
  { id: 'us-west-2', name: 'US West (Oregon)', continent: 'North America', endpoint: 'https://dynamodb.us-west-2.amazonaws.com/' },
  { id: 'eu-west-1', name: 'Europe (Ireland)', continent: 'Europe', endpoint: 'https://dynamodb.eu-west-1.amazonaws.com/' },
  { id: 'eu-central-1', name: 'Europe (Frankfurt)', continent: 'Europe', endpoint: 'https://dynamodb.eu-central-1.amazonaws.com/' },
  { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)', continent: 'Asia Pacific', endpoint: 'https://dynamodb.ap-south-1.amazonaws.com/' },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', continent: 'Asia Pacific', endpoint: 'https://dynamodb.ap-southeast-1.amazonaws.com/' },
  { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', continent: 'Asia Pacific', endpoint: 'https://dynamodb.ap-northeast-1.amazonaws.com/' },
  { id: 'sa-east-1', name: 'South America (São Paulo)', continent: 'South America', endpoint: 'https://dynamodb.sa-east-1.amazonaws.com/' }
]

export default function AwsLatencyMonitor() {
  const [isOpen, setIsOpen] = useState(false)
  const [latencies, setLatencies] = useState({}) // { [regionId]: { ms: number, status: 'testing'|'done'|'error' } }
  const [isTestingAll, setIsTestingAll] = useState(false)
  const [bestRegion, setBestRegion] = useState(null)

  // Listen for open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-latency-monitor', handleOpen)
    return () => window.removeEventListener('open-latency-monitor', handleOpen)
  }, [])

  // Ping an individual region
  const pingRegion = useCallback(async (region) => {
    const start = performance.now()
    try {
      // Use fetch with no-cors or HEAD to measure round trip time to AWS endpoint
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)

      await fetch(region.endpoint, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      const duration = Math.round(performance.now() - start)
      return { ms: duration, status: 'done' }
    } catch (err) {
      // Even if CORS or abort triggers, elapsed time measures connection latency
      const duration = Math.round(performance.now() - start)
      if (duration < 3900) {
        return { ms: duration, status: 'done' }
      }
      return { ms: 999, status: 'error' }
    }
  }, [])

  // Run ping test on all regions
  const runPingTest = useCallback(async () => {
    setIsTestingAll(true)
    const initialStatus = {}
    AWS_REGIONS.forEach(r => {
      initialStatus[r.id] = { ms: null, status: 'testing' }
    })
    setLatencies(initialStatus)

    const results = {}
    // Run sequentially/in pairs to avoid browser connection pool congestion
    for (const region of AWS_REGIONS) {
      const res = await pingRegion(region)
      results[region.id] = res
      setLatencies(prev => ({ ...prev, [region.id]: res }))
    }

    // Determine lowest latency region
    let lowest = null
    let lowestMs = Infinity
    Object.entries(results).forEach(([id, data]) => {
      if (data.status === 'done' && data.ms < lowestMs) {
        lowestMs = data.ms
        lowest = id
      }
    })

    setBestRegion(lowest)
    setIsTestingAll(false)
  }, [pingRegion])

  // Run initial test when opened
  useEffect(() => {
    if (isOpen && Object.keys(latencies).length === 0) {
      runPingTest()
    }
  }, [isOpen, latencies, runPingTest])

  if (!isOpen) return null

  return (
    <div className="latency-modal-backdrop" onClick={() => setIsOpen(false)}>
      <div 
        className="latency-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="AWS Global Edge Latency & Ping Monitor"
      >
        {/* Header */}
        <div className="latency-header">
          <div className="latency-header-title">
            <Radio size={20} className="text-emerald animate-pulse" />
            <div>
              <div className="latency-title-text">AWS Global Edge Latency Monitor</div>
              <div className="latency-sub-text">Real-time HTTP round-trip ping from your browser to AWS regional edge points</div>
            </div>
          </div>
          <div className="latency-header-actions">
            <button 
              className="btn-latency-refresh"
              onClick={runPingTest}
              disabled={isTestingAll}
              title="Re-run ping benchmark across all regions"
            >
              <RefreshCw size={15} className={isTestingAll ? 'animate-spin' : ''} />
              <span>{isTestingAll ? 'Testing...' : 'Ping All'}</span>
            </button>
            <button 
              className="btn-latency-close" 
              onClick={() => setIsOpen(false)}
              aria-label="Close Latency Monitor"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Best Region Recommendation Card */}
        {bestRegion && (
          <div className="latency-best-card">
            <div className="latency-best-icon">
              <Zap size={22} className="text-amber" />
            </div>
            <div className="latency-best-copy">
              <div className="latency-best-title">
                Optimal Lab Region: <strong>{AWS_REGIONS.find(r => r.id === bestRegion)?.name}</strong> ({bestRegion})
              </div>
              <p>
                Your fastest direct round-trip latency is <strong>{latencies[bestRegion]?.ms} ms</strong>. 
                For best CLI responsiveness and minimal network overhead when practicing labs, 
                set your default region to <code>aws configure set default.region {bestRegion}</code>.
              </p>
            </div>
          </div>
        )}

        {/* Regions Grid */}
        <div className="latency-grid">
          {AWS_REGIONS.map((region) => {
            const data = latencies[region.id]
            const isBest = bestRegion === region.id
            const ms = data?.ms

            let statusColor = '#94a3b8'
            let statusText = 'Pending'
            if (data?.status === 'testing') {
              statusText = 'Pinging...'
              statusColor = '#38bdf8'
            } else if (data?.status === 'done') {
              if (ms < 75) {
                statusColor = '#10b981' // Fast
                statusText = 'Optimal'
              } else if (ms < 160) {
                statusColor = '#38bdf8' // Good
                statusText = 'Moderate'
              } else {
                statusColor = '#f59e0b' // High
                statusText = 'Distant'
              }
            } else if (data?.status === 'error') {
              statusColor = '#ef4444'
              statusText = 'Timeout'
            }

            return (
              <div 
                key={region.id} 
                className={`latency-card ${isBest ? 'is-best-region' : ''}`}
              >
                <div className="latency-card-header">
                  <div className="latency-region-info">
                    <span className="latency-region-id">{region.id}</span>
                    {isBest && <span className="latency-best-tag">Fastest</span>}
                  </div>
                  <span 
                    className="latency-status-tag"
                    style={{ color: statusColor, borderColor: `${statusColor}40`, backgroundColor: `${statusColor}15` }}
                  >
                    {statusText}
                  </span>
                </div>

                <div className="latency-region-name">{region.name}</div>

                <div className="latency-metric-row">
                  <div className="latency-ms-display">
                    {data?.status === 'testing' ? (
                      <span className="latency-measuring">...</span>
                    ) : ms !== null && ms !== undefined ? (
                      <>
                        <span className="latency-ms-number" style={{ color: statusColor }}>{ms}</span>
                        <span className="latency-ms-unit">ms</span>
                      </>
                    ) : (
                      <span className="latency-idle">—</span>
                    )}
                  </div>
                  
                  {/* Visual Latency Bar */}
                  <div className="latency-bar-track">
                    <div 
                      className="latency-bar-fill" 
                      style={{ 
                        width: `${Math.min(100, Math.max(8, ((300 - (ms || 300)) / 300) * 100))}%`,
                        backgroundColor: statusColor
                      }} 
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Educational Architecture Callout */}
        <div className="latency-edu-note">
          <div className="latency-edu-header">
            <Info size={16} className="text-sky" />
            <strong>AWS Well-Architected Performance Pillar Insight</strong>
          </div>
          <p>
            In production enterprise designs, never rely on a single region for global users. 
            Leverage <strong>Amazon CloudFront (Edge Caching)</strong> for static & dynamic TLS termination, 
            <strong>AWS Global Accelerator</strong> for anycast IP routing, and 
            <strong>Amazon Route 53 Latency-Based Routing</strong> to automatically direct traffic to the lowest-latency pool.
          </p>
        </div>

        {/* Footer */}
        <div className="latency-footer">
          <span>Engineered by NAEN Studios • Official Support: <a href="mailto:naenstudios@gmail.com">naenstudios@gmail.com</a></span>
          <button 
            className="btn-latency-done"
            onClick={() => setIsOpen(false)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
