import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Radio,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Zap,
  ArrowRight,
  ExternalLink,
  Flame,
  Clock,
  Layers,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  FileCode2,
  Lock,
  Compass,
  Key,
  Copy,
  Check,
  Cpu
} from 'lucide-react'
import { liveGeminiIntelligence, GROUNDED_BASE_THREAT_INTEL } from '../services/liveGeminiIntelligenceService.js'
import GeminiKeyManagerModal from '../components/GeminiKeyManagerModal.jsx'
import DailyAwsSecurityTicker from '../components/DailyAwsSecurityTicker.jsx'
import { playTactileClick, playSuccessChime } from '../utils/cyberMotionAudio.js'

export const LIVE_BREACH_POSTMORTEMS = [
  {
    id: 'breach-01',
    name: 'The Hyperscale AWS SSRF S3 Exfiltration Breach',
    victim: 'Enterprise Financial Lending Corp',
    attackVector: 'WAF SSRF -> EC2 IMDSv1 Role Theft -> 100M Records S3 Bucket Dump',
    rootCause: 'Reverse proxy forwarder did not validate internal destinations. Attacker requested 169.254.169.254, retrieved IAM role credentials, and invoked s3:Sync.',
    cloudDefenseLesson: 'IMDSv2 hop limits of 1 prevent container and proxy SSRF traversal. S3 bucket policies must enforce VPC endpoint IP tripwires and KMS customer-managed keys.',
    practiceScenario: '/labs'
  },
  {
    id: 'breach-02',
    name: 'The Compromised Hardcoded S3 Bucket Secret Leak',
    victim: 'Global Ride-Hailing Platform',
    attackVector: 'Private GitHub Repo Credential Leak -> AWS S3 Backup Infiltration',
    rootCause: 'Engineers embedded long-lived AWS_ACCESS_KEY_ID in test scripts. Adversaries scanned public commits and accessed unencrypted database snapshots.',
    cloudDefenseLesson: 'Mandate Git pre-commit secret scanners and enforce max 8-hour credential lifetimes with AWS Secrets Manager automated rotation.',
    practiceScenario: '/battle-rooms'
  },
  {
    id: 'breach-03',
    name: 'AWS Cross-Account AssumeRole Confused Deputy Infiltration',
    victim: 'Cloud Analytics Platform',
    attackVector: 'Third-Party SaaS Integration -> Wildcard Role Trust -> Administrative Mutation',
    rootCause: 'IAM AssumeRole policy omitted sts:ExternalId condition and allowed any client account to assume the deployment orchestration role.',
    cloudDefenseLesson: 'Strictly require sts:ExternalId with cryptographically unpredictable random values on all cross-account role trust policies.',
    practiceScenario: '/learning'
  }
]

export const LIVE_STUDENT_TELEMETRY = [
  { student: 'SEC-DEF-4992', action: 'Successfully mitigated IAM Role Wildcard Escalation', lab: 'Tier 3 Battle Room', time: '1m ago' },
  { student: 'SEC-USER-7810', action: 'Deployed $0.00 Terraform CloudWatch Tripwire Alarm', lab: 'Safe Lab #2', time: '3m ago' },
  { student: 'SEC-ENG-1204', action: 'Captured GuardDuty ASFF Investigation Flag', lab: 'SOC Investigation', time: '6m ago' },
  { student: 'SEC-CAROLDEF-4225', action: 'Attained Level 3 Junior Analyst Promotion', lab: 'Internship Simulator', time: '9m ago' },
  { student: 'SEC-USER-3199', action: 'Hardened Docker Container against Root Daemon Escape', lab: 'Tier 2 Academy', time: '14m ago' }
]

export default function LiveThreatIntelPage() {
  const [telemetry, setTelemetry] = useState(LIVE_STUDENT_TELEMETRY)
  const [activeTab, setActiveTab] = useState('cves') // 'cves' | 'breaches' | 'telemetry'
  const [threats, setThreats] = useState(GROUNDED_BASE_THREAT_INTEL)
  const [isLoading, setIsLoading] = useState(false)
  const [syncMeta, setSyncMeta] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)

  // Fetch threat intel from Gemini on mount
  useEffect(() => {
    loadThreatIntel(false)
  }, [])

  const loadThreatIntel = async (forceRefresh = false) => {
    setIsLoading(true)
    try {
      const res = await liveGeminiIntelligence.fetchLiveThreatIntel({ forceRefresh })
      if (res && res.items && res.items.length > 0) {
        setThreats(res.items)
        setSyncMeta({
          source: res.source,
          isLiveAi: res.isLiveAi,
          keyUsed: res.keyUsed,
          timestamp: res.timestamp
        })
      }
    } catch (e) {
      console.warn('Error loading live threats:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSync = () => {
    playTactileClick()
    loadThreatIntel(true)
  }

  const handleCopyCli = (id, command) => {
    playTactileClick()
    navigator.clipboard.writeText(command)
    setCopiedId(id)
    playSuccessChime()
    setTimeout(() => setCopiedId(null), 2500)
  }

  // Subtle live ticker rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const first = prev[0]
        const rest = prev.slice(1)
        return [...rest, first]
      })
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="live-intel-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
        <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none' }}>SeCloudive</Link>
        <span>/</span>
        <span style={{ color: '#94a3b8' }}>Real-Time Operations</span>
        <span>/</span>
        <span style={{ color: '#f8fafc', fontWeight: 700 }}>Live AWS Threat Intel & CVE Radar</span>
      </div>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.95) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(239, 68, 68, 0.1)',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Badges & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '999px',
              padding: '4px 12px',
              color: '#f87171',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '1px'
            }}>
              <Radio size={12} className="animate-pulse" />
              <span>LIVE AWS THREAT RADAR /// CONTINUOUS SYNC</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '999px',
              padding: '4px 12px',
              color: '#34d399',
              fontSize: '0.74rem',
              fontWeight: 800
            }}>
              <Sparkles size={12} />
              <span>Powered by Google Gemini API (gemini-3.5-flash-lite)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#cbd5e1',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Key size={13} color="#38bdf8" />
              <span>Inspect Gemini Keys</span>
            </button>

            <button
              onClick={handleManualSync}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
              }}
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              <span>{isLoading ? 'Querying Gemini...' : 'Sync Live Threat Feed'}</span>
            </button>
          </div>
        </div>

        <h1 style={{
          margin: '0 0 10px 0',
          fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#f8fafc'
        }}>
          Live AWS Threat Intelligence & CVE Radar
        </h1>
        <p style={{
          margin: 0,
          color: '#94a3b8',
          fontSize: '1rem',
          lineHeight: 1.6,
          maxWidth: '820px'
        }}>
          Direct intelligence pipeline tracking real-world AWS Cloud vulnerabilities, active zero-day exploits (IAM assume-role bypass, IMDSv1 token theft, S3 bucket exfiltration, EKS container breakout), mapped to <strong>MITRE ATT&CK Cloud</strong> with authentic remediation runbooks.
        </p>

        {/* Live sync telemetry banner */}
        {syncMeta && (
          <div style={{
            marginTop: '16px',
            fontSize: '0.75rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <span>Feed Source: <strong style={{ color: '#38bdf8' }}>{syncMeta.source}</strong></span>
            <span>•</span>
            <span>Model: <strong style={{ color: '#34d399' }}>gemini-3.5-flash-lite</strong></span>
            {syncMeta.keyUsed && (
              <>
                <span>•</span>
                <span>Key: <strong style={{ color: '#a78bfa' }}>{syncMeta.keyUsed}</strong></span>
              </>
            )}
            <span>•</span>
            <span>Last Updated: <strong style={{ color: '#cbd5e1' }}>{new Date(syncMeta.timestamp).toLocaleTimeString()}</strong></span>
          </div>
        )}

        {/* Live student simulation pulse strip */}
        <div style={{
          marginTop: '20px',
          background: 'rgba(2, 6, 23, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '8px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflow: 'hidden'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#34d399',
            fontSize: '0.74rem',
            fontWeight: 800,
            fontFamily: "'DM Mono', monospace",
            flexShrink: 0
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
            LIVE SIMULATION PULSE:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <strong style={{ color: '#38bdf8' }}>{telemetry[0].student}</strong>
            <span>{telemetry[0].action}</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ color: '#a855f7' }}>{telemetry[0].lab}</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({telemetry[0].time})</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
        {[
          { id: 'cves', label: 'Active AWS CVEs & Zero-Days', count: threats.length },
          { id: 'breaches', label: 'Production Breach Post-Mortems', count: LIVE_BREACH_POSTMORTEMS.length },
          { id: 'daily-sync', label: 'Daily AWS Security Adaptive Sync', count: 'Live RSS' },
          { id: 'telemetry', label: 'Live Platform Telemetry', count: 'Active' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              playTactileClick()
              setActiveTab(tab.id)
            }}
            style={{
              background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              border: activeTab === tab.id ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              borderRadius: '8px',
              padding: '8px 16px',
              color: activeTab === tab.id ? '#f8fafc' : '#94a3b8',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{tab.label}</span>
            <span style={{
              background: activeTab === tab.id ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
              color: activeTab === tab.id ? '#020617' : '#94a3b8',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: Real-time AWS CVEs from Gemini */}
      {activeTab === 'cves' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {threats.map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderLeft: `4px solid ${item.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'}`,
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: item.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: item.severity === 'CRITICAL' ? '#f87171' : '#fbbf24',
                    border: `1px solid ${item.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {item.severity} {item.score ? `CVSS ${item.score}` : ''}
                  </span>

                  <span style={{
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#7dd3fc',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    {item.affectedService || 'AWS Cloud Security'}
                  </span>

                  {item.mitreTechnique && (
                    <span style={{
                      background: 'rgba(168, 85, 247, 0.12)',
                      color: '#c084fc',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      MITRE: {item.mitreTechnique} {item.mitreLabel ? `(${item.mitreLabel})` : ''}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={12} />
                  <span>{item.discoveryDate || 'Live Today'}</span>
                </div>
              </div>

              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                {item.title}
              </h2>

              <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
                {item.summary}
              </p>

              {/* Technical exploitation vector & detection rule */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '12px',
                marginBottom: '16px'
              }}>
                {item.exploitationVector && (
                  <div style={{
                    background: 'rgba(2, 6, 23, 0.6)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                      Adversary Exploitation Vector
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      {item.exploitationVector}
                    </div>
                  </div>
                )}

                {item.detectionRule && (
                  <div style={{
                    background: 'rgba(2, 6, 23, 0.6)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                      GuardDuty / CloudTrail Detection Logic
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      {item.detectionRule}
                    </div>
                  </div>
                )}
              </div>

              {/* CLI Remediation Box */}
              {item.cliRemediation && (
                <div style={{
                  background: '#020617',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.8rem',
                  color: '#38bdf8',
                  marginBottom: '16px',
                  overflowX: 'auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                    <Terminal size={14} color="#34d399" style={{ flexShrink: 0 }} />
                    <span style={{ wordBreak: 'break-all' }}>{item.cliRemediation}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCli(item.id || idx, item.cliRemediation)}
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0
                    }}
                  >
                    {copiedId === (item.id || idx) ? (
                      <>
                        <Check size={12} color="#34d399" />
                        <span style={{ color: '#34d399' }}>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy CLI</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Link to Practice Lab */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link
                  to="/labs"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700
                  }}
                >
                  <span>Replicate & Neutralize in Hands-on SOP Lab</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Breach Post-Mortems */}
      {activeTab === 'breaches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {LIVE_BREACH_POSTMORTEMS.map(postmortem => (
            <div
              key={postmortem.id}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '24px'
              }}
            >
              <h2 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                {postmortem.name}
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#f87171', fontWeight: 700, marginBottom: '14px' }}>
                Target: {postmortem.victim}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                <div>
                  <strong style={{ color: '#f87171' }}>Attack Vector: </strong>
                  {postmortem.attackVector}
                </div>
                <div>
                  <strong style={{ color: '#fbbf24' }}>Root Cause: </strong>
                  {postmortem.rootCause}
                </div>
                <div>
                  <strong style={{ color: '#34d399' }}>Architectural Defense Lesson: </strong>
                  {postmortem.cloudDefenseLesson}
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <Link
                  to={postmortem.practiceScenario}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700
                  }}
                >
                  <span>Simulate Attack & Fix Scenario</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Telemetry Pulse */}
      {activeTab === 'telemetry' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
            Live Student Simulation & Defensive Event Stream
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {LIVE_STUDENT_TELEMETRY.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(2, 6, 23, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '0.84rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={16} color="#34d399" />
                  <strong style={{ color: '#38bdf8' }}>{item.student}</strong>
                  <span style={{ color: '#cbd5e1' }}>{item.action}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#a855f7', fontWeight: 600 }}>{item.lab}</span>
                  <span style={{ color: '#64748b', fontSize: '0.74rem' }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Daily AWS Security Adaptive Sync Ticker */}
      {activeTab === 'daily-sync' && (
        <div style={{ marginTop: '8px' }}>
          <DailyAwsSecurityTicker />
        </div>
      )}

      {/* Gemini Key Manager Modal */}
      <GeminiKeyManagerModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeyUpdated={() => loadThreatIntel(true)}
      />
    </main>
  )
}
