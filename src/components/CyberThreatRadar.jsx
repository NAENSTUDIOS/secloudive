// =========================================================================
// SeCloudive Master Cyber Threat Radar & Live Telemetry Scope
// Interactive 360-degree SVG radar scanner with live MITRE ATT&CK telemetry
// =========================================================================

import { useState, useEffect } from 'react'
import { 
  Radar, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Flame, 
  Terminal, 
  ExternalLink, 
  X, 
  Volume2, 
  VolumeX, 
  Layers, 
  CheckCircle2,
  AlertTriangle,
  Server,
  Cloud,
  Crosshair
} from 'lucide-react'
import { playTactileClick, playThreatAlert, isAudioFXEnabled, setAudioFXEnabled } from '../utils/cyberMotionAudio'
import { dailyAwsSyncEngine } from '../services/dailyAwsSecuritySync'

const ACTIVE_RADAR_THREATS = [
  {
    id: 'T1552-SSRF',
    technique: 'T1552.005',
    title: 'IMDSv1 Temporary STS Credential Theft',
    severity: 'CRITICAL',
    color: '#f43f5e',
    x: 68, // % from left
    y: 32, // % from top
    sourceIp: '198.51.100.24',
    targetService: 'AWS EC2 / Metadata Service',
    blastRadius: 'All S3 customer vaults and IAM role delegation paths',
    containmentCmd: 'aws ec2 modify-instance-metadata-options --instance-id i-0a817b2 --http-tokens required --http-put-response-hop-limit 1',
    description: 'Adversary leveraged SSRF on web proxy to fetch 169.254.169.254 and extracted secret session keys from ProductionAppProfile.'
  },
  {
    id: 'T1078-IAM',
    technique: 'T1078.004',
    title: 'Console Login Without MFA from Untrusted ASN',
    severity: 'HIGH',
    color: '#f59e0b',
    x: 35,
    y: 28,
    sourceIp: '203.0.113.195',
    targetService: 'AWS IAM Console',
    blastRadius: 'Full organizational billing, route tables, and S3 read paths',
    containmentCmd: 'aws iam update-access-key --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive',
    description: 'CloudTrail logged direct ConsoleLogin for root account from Tor exit node without Virtual MFA prompt completion.'
  },
  {
    id: 'T1530-S3',
    technique: 'T1530',
    title: 'S3 Mass Anonymous Batch GetObject Operation',
    severity: 'CRITICAL',
    color: '#f43f5e',
    x: 74,
    y: 72,
    sourceIp: '185.220.101.5',
    targetService: 'Amazon S3 Vault',
    blastRadius: '2.4 TB patient diagnostic DICOM images and HIPAA records',
    containmentCmd: 'aws s3api put-public-access-block --bucket medical-vault-prod --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"',
    description: 'Bucket policy drift allowed s3:GetObject to Principal: "*" following an unverified CloudFormation stack update.'
  },
  {
    id: 'T1190-DB',
    technique: 'T1190',
    title: 'Aurora PostgreSQL Port 5432 Direct Brute-Force',
    severity: 'HIGH',
    color: '#f59e0b',
    x: 28,
    y: 76,
    sourceIp: '45.154.255.89',
    targetService: 'Amazon RDS Aurora Subnet',
    blastRadius: 'Private transactional customer ledger database',
    containmentCmd: 'aws ec2 revoke-security-group-ingress --group-id sg-01928a --protocol tcp --port 5432 --cidr 0.0.0.0/0',
    description: 'Security group rule inbound 0.0.0.0/0 permitted persistent TCP dictionary attacks against database master credentials.'
  },
  {
    id: 'T1496-MINING',
    technique: 'T1496',
    title: 'EC2 GPU Swarm Hijack for Monero Cryptomining',
    severity: 'CRITICAL',
    color: '#a855f7',
    x: 52,
    y: 58,
    sourceIp: '91.240.118.17',
    targetService: 'Amazon EC2 (g5.4xlarge GPU)',
    blastRadius: '$14,200/day unauthorized compute run-rate',
    containmentCmd: 'aws ec2 stop-instances --instance-ids i-0994fbc28919',
    description: 'Adversary leveraged exposed Kubernetes kubelet debug port to launch privileged container compiling xmrig daemon.'
  }
]

import { useChallenges } from '../context/ChallengeContext'

export default function CyberThreatRadar({ onSelectThreat = null }) {
  const {
    radarThreatsContained = {},
    containRadarThreat,
    activeScenarioState
  } = useChallenges()

  const [selectedThreat, setSelectedThreat] = useState(null)
  const [activeFilter, setActiveFilter] = useState('ALL') // 'ALL' | 'CRITICAL' | 'HIGH'
  const [soundEnabled, setSoundEnabled] = useState(() => isAudioFXEnabled())
  const [copiedCmd, setCopiedCmd] = useState(false)
  const [eventCount, setEventCount] = useState(482)
  const [latestLiveBulletin, setLatestLiveBulletin] = useState(() => {
    const items = dailyAwsSyncEngine.getStoredDailyUpdates()
    return items.find(i => i.isRealLiveFeed) || items[0] || null
  })

  // Listen for real-time live AWS sync updates
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail?.items && e.detail.items.length > 0) {
        const live = e.detail.items.find(i => i.isRealLiveFeed) || e.detail.items[0]
        setLatestLiveBulletin(live)
      }
    }
    window.addEventListener('secloudive_daily_aws_sync', handleSync)
    return () => window.removeEventListener('secloudive_daily_aws_sync', handleSync)
  }, [])

  // Subtle real-time event counter ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setEventCount(prev => prev + Math.floor(Math.random() * 3))
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  // Dynamic threat items decorated with live containment status
  const dynamicThreats = ACTIVE_RADAR_THREATS.map(t => {
    const isContained = Boolean(radarThreatsContained[t.id]) || 
      (t.id === 'T1552-SSRF' && activeScenarioState?.playbookState?.executionStatus === 'contained')
    return {
      ...t,
      isContained,
      color: isContained ? '#10b981' : t.color,
      statusLabel: isContained ? 'CONTAINED' : t.severity
    }
  })

  const containedCount = dynamicThreats.filter(t => t.isContained).length

  const handleThreatClick = (threat) => {
    playThreatAlert()
    setSelectedThreat(threat)
    if (onSelectThreat) onSelectThreat(threat)
  }

  const toggleSound = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    setAudioFXEnabled(next)
    if (next) playTactileClick()
  }

  const handleCopyContainment = (cmd) => {
    playTactileClick()
    navigator.clipboard?.writeText(cmd)
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 2000)
  }

  const handleDeployContainment = (threat) => {
    if (!containRadarThreat) return
    playTactileClick()
    containRadarThreat(threat.id, threat.title)
    setSelectedThreat(prev => prev ? { ...prev, isContained: true, color: '#10b981', statusLabel: 'CONTAINED' } : null)
  }

  const filteredThreats = dynamicThreats.filter(t => {
    if (activeFilter === 'ALL') return true
    return t.severity === activeFilter
  })

  return (
    <div className="threat-radar-container cyber-glass-panel" style={{ margin: '24px 0' }}>
      {/* Radar Control Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(14, 165, 233, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            display: 'grid',
            placeItems: 'center',
            color: '#38bdf8'
          }}>
            <Radar size={18} className="beacon-pulse-emerald" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.68rem', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.08em' }}>
                LIVE SOC RADAR SCOPE
              </span>
              <span style={{ fontSize: '0.62rem', background: containedCount > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)', color: containedCount > 0 ? '#34d399' : '#38bdf8', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${containedCount > 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.3)'}`, fontWeight: 700 }}>
                {containedCount}/5 VECTORS CONTAINED
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
              Real-Time AWS Attack Surface & MITRE ATT&CK Matrix
            </div>
          </div>
        </div>

        {/* Action Controls: Sound FX + Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '6px', padding: '2px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
            {['ALL', 'CRITICAL', 'HIGH'].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  playTactileClick()
                  setActiveFilter(lvl)
                }}
                style={{
                  background: activeFilter === lvl ? '#0284c7' : 'none',
                  color: activeFilter === lvl ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '0.68rem',
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleSound}
            className={`audio-fx-toggle ${soundEnabled ? 'is-active' : ''}`}
            title={soundEnabled ? 'Mute Cyber Audio UI Feedback' : 'Enable Cyber Audio UI Feedback'}
            aria-label="Toggle Cyber Sound Effects"
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>FX: {soundEnabled ? 'ON' : 'MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Real-Time AWS Security Advisory Telemetry Banner */}
      {latestLiveBulletin && (
        <div style={{
          width: '100%',
          padding: '8px 14px',
          background: 'linear-gradient(90deg, rgba(6, 78, 59, 0.35) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(12, 74, 110, 0.35) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.74rem',
          color: '#cbd5e1',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: '#34d399', fontSize: '0.68rem', letterSpacing: '0.04em' }}>
              LIVE AWS ADVISORY INGESTION:
            </span>
            <a 
              href={latestLiveBulletin.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#ffffff', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              title="Read official AWS Security release"
            >
              <span>{latestLiveBulletin.title}</span>
              <ExternalLink size={11} color="#38bdf8" />
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Mono', monospace", fontSize: '0.66rem' }}>
            <span style={{ color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              {latestLiveBulletin.awsService}
            </span>
            <span style={{ color: '#94a3b8' }}>
              Published: {latestLiveBulletin.publishedDate}
            </span>
          </div>
        </div>
      )}

      {/* Main Radar Layout: 360 Scope + Live Threat List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px', alignItems: 'center' }}>
        
        {/* 360-Degree Circular Radar Display */}
        <div className="threat-radar-scope">
          {/* Animated 360 Rotating Conic Beam */}
          <div className="threat-radar-beam" />

          {/* Concentric Distance Rings */}
          <div className="threat-radar-ring radar-ring-1" />
          <div className="threat-radar-ring radar-ring-2" />
          <div className="threat-radar-ring radar-ring-3" />

          {/* Coordinate Crosshairs */}
          <div className="threat-radar-crosshair-x" />
          <div className="threat-radar-crosshair-y" />

          {/* Center Sensor Apex */}
          <div style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#38bdf8',
            boxShadow: '0 0 10px #38bdf8',
            zIndex: 5
          }} />

          {/* Interactive Threat Targets on Scope */}
          {filteredThreats.map(threat => {
            const isSelected = selectedThreat?.id === threat.id
            return (
              <div
                key={threat.id}
                className="radar-target-node"
                style={{
                  left: `${threat.x}%`,
                  top: `${threat.y}%`
                }}
                onClick={() => handleThreatClick(threat)}
                title={`${threat.technique}: ${threat.title}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleThreatClick(threat) }}
              >
                <div
                  className="radar-target-dot"
                  style={{
                    background: threat.color,
                    color: threat.color,
                    transform: isSelected ? 'scale(1.5)' : 'scale(1)'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: isSelected ? '#ffffff' : threat.color,
                  textShadow: '0 2px 4px rgba(0,0,0,0.9)'
                }}>
                  {threat.technique}
                </span>
              </div>
            )
          })}
        </div>

        {/* Radar Telemetry Metrics & Threat Brief */}
        <div>
          {/* Live Telemetry KPI Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>SIEM EVENTS/SEC</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{eventCount}</div>
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>SCOPED PINGS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f43f5e' }}>{filteredThreats.length}</div>
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>CONTAINED STATUS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>{containedCount}/5 Isolated</div>
            </div>
          </div>

          {/* Quick Threat List with Clickable Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
            {filteredThreats.map(threat => {
              const isSelected = selectedThreat?.id === threat.id
              return (
                <div
                  key={threat.id}
                  onClick={() => handleThreatClick(threat)}
                  className="motion-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(56, 189, 248, 0.14)' : 'rgba(30, 41, 59, 0.35)',
                    border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(148, 163, 184, 0.1)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: threat.color,
                      boxShadow: `0 0 8px ${threat.color}`
                    }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: threat.color, fontWeight: 700 }}>
                          {threat.technique}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {threat.title}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                        Source: {threat.sourceIp} • Target: {threat.targetService}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.62rem',
                    fontFamily: "'DM Mono', monospace",
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: threat.isContained ? 'rgba(16, 185, 129, 0.15)' : (threat.severity === 'CRITICAL' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                    color: threat.color,
                    fontWeight: 700
                  }}>
                    {threat.statusLabel}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Selected Threat Diagnostic & Instant Containment Drawer */}
      {selectedThreat && (
        <div style={{
          marginTop: '16px',
          padding: '14px 16px',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: `1px solid ${selectedThreat.color}`,
          boxShadow: `0 0 20px -5px ${selectedThreat.color}33`,
          animation: 'cyberFadeInUp 0.3s ease both'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color={selectedThreat.color} />
              <strong style={{ color: '#ffffff', fontSize: '0.86rem' }}>
                {selectedThreat.technique} Incident Deep Dive: {selectedThreat.title}
              </strong>
            </div>
            <button
              type="button"
              onClick={() => {
                playTactileClick()
                setSelectedThreat(null)
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '2px'
              }}
              aria-label="Close Threat Diagnostic"
            >
              <X size={15} />
            </button>
          </div>

          <p style={{ margin: '0 0 10px 0', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            {selectedThreat.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px', marginBottom: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              <strong>Blast Radius:</strong> <span style={{ color: '#f8fafc' }}>{selectedThreat.blastRadius}</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              <strong>Target Boundary:</strong> <span style={{ color: '#38bdf8' }}>{selectedThreat.targetService}</span>
            </div>
          </div>

          {/* Instant Remediation Command & Containment Action */}
          <div style={{
            background: 'rgba(2, 6, 23, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '6px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
              <Terminal size={13} color="#38bdf8" />
              <code style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.68rem',
                color: '#a5f3fc',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {selectedThreat.containmentCmd}
              </code>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleCopyContainment(selectedThreat.containmentCmd)}
                style={{
                  background: copiedCmd ? '#10b981' : 'rgba(56, 189, 248, 0.2)',
                  color: copiedCmd ? '#020617' : '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0
                }}
              >
                {copiedCmd ? <CheckCircle2 size={12} /> : null}
                {copiedCmd ? 'COPIED' : 'COPY SOP'}
              </button>

              <button
                type="button"
                onClick={() => handleDeployContainment(selectedThreat)}
                disabled={selectedThreat.isContained}
                style={{
                  background: selectedThreat.isContained ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: selectedThreat.isContained ? '#10b981' : '#ffffff',
                  border: selectedThreat.isContained ? '1px solid #10b981' : 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: selectedThreat.isContained ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: selectedThreat.isContained ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <CheckCircle2 size={12} />
                {selectedThreat.isContained ? '✓ VECTOR CONTAINED (+75 XP)' : 'DEPLOY CONTAINMENT (+75 XP)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
