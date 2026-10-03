import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  Radio, 
  Terminal, 
  Lock, 
  Cpu, 
  Layers, 
  Activity, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Server, 
  Zap, 
  Key,
  Flame,
  AlertTriangle,
  FileCheck2,
  X
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { 
  playTactileClick, 
  playTabWhoosh, 
  isAudioFXEnabled, 
  setAudioFXEnabled 
} from '../utils/cyberMotionAudio'
import '../styles/cyberCommandDeck.css'

export default function CyberCommandDeck() {
  const { 
    totalScore, 
    scorePercent, 
    completedLabsCount, 
    battleRoomsSolvedCount, 
    investigationCompletedCount,
    containedRadarThreatsCount
  } = useChallenges()

  const [activeNode, setActiveNode] = useState('iam') // 'iam' | 'waf' | 'nitro' | 'kms' | 'guardduty'
  const [copiedCmd, setCopiedCmd] = useState(null)
  const [soundEnabled, setSoundEnabled] = useState(isAudioFXEnabled())

  useEffect(() => {
    const handleAudioChange = (e) => {
      if (e.detail && typeof e.detail.enabled === 'boolean') {
        setSoundEnabled(e.detail.enabled)
      }
    }
    window.addEventListener('secloudive_audio_fx_change', handleAudioChange)
    return () => window.removeEventListener('secloudive_audio_fx_change', handleAudioChange)
  }, [])

  const toggleSound = () => {
    const nextState = !soundEnabled
    setSoundEnabled(nextState)
    setAudioFXEnabled(nextState)
    if (nextState) {
      playTactileClick()
    }
  }

  const handleNodeSelect = (nodeId) => {
    playTactileClick()
    setActiveNode(prev => prev === nodeId ? null : nodeId)
  }

  const handleCopyCommand = (cmdText, cmdId) => {
    playTactileClick()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmdText)
      setCopiedCmd(cmdId)
      setTimeout(() => setCopiedCmd(null), 2500)
    }
  }

  const cyberNodes = [
    {
      id: 'iam',
      title: 'IAM Zero-Trust & Privilege Guard',
      shortName: 'IAM Sentinel',
      badge: 'Zero-Trust Enforced',
      status: 'OPTIMAL',
      icon: Lock,
      metricLabel: 'Least-Privilege Baseline',
      metricVal: '100% Policy Bound',
      description: 'Granular STS session tagging, automated credential rotation, and IMDSv2 mandatory tokens.',
      inspectDetails: {
        architecture: 'AWS Identity & Access Management boundary policies restricting unmanaged privilege escalation vectors, wildcards (*), and cross-account assumption vulnerabilities.',
        remediation: 'Audit IAM credential reports every 24h. Enforce MFA delete on all S3 production buckets and revoke dormant access keys older than 90 days.',
        cliCommand: 'aws iam get-credential-report --output json | jq \'.content | @base64d | fromjson\'',
        cliLabel: 'Audit IAM Credentials & Dormant Keys'
      }
    },
    {
      id: 'waf',
      title: 'Cloud Perimeter & WAFv2 Shield',
      shortName: 'WAFv2 Ingress',
      badge: 'L7 Shield Active',
      status: 'ACTIVE',
      icon: Shield,
      metricLabel: 'Inspection Latency',
      metricVal: '0.8ms Core Shield',
      description: 'Layer 7 inspection engine neutralizing SQLi, Cross-Site Scripting, bad bots, and OWASP Top 10 vectors.',
      inspectDetails: {
        architecture: 'AWS WAFv2 WebACL deployed in front of CloudFront and Application Load Balancer with rate-limiting rules (100 req/5min) and Managed Core Rule Sets.',
        remediation: 'Inspect WAF sampled requests to catch zero-day scanning sweeps. Automatically pipe blocked telemetry into Kinesis Firehose for instant SIEM triage.',
        cliCommand: 'aws wafv2 list-web-acls --scope REGIONAL --query "WebACLs[*].[Name,Id]" --output table',
        cliLabel: 'List Regional WebACL Hardening Rules'
      }
    },
    {
      id: 'nitro',
      title: 'Nitro Enclaves & Compute Isolation',
      shortName: 'Nitro Isolation',
      badge: 'Hardware Attested',
      status: 'ENCRYPTED',
      icon: Cpu,
      metricLabel: 'Micro-VM Isolation',
      metricVal: 'Zero External I/O',
      description: 'Isolated, hardened micro-VMs with no persistent storage, interactive SSH access, or external network connectivity.',
      inspectDetails: {
        architecture: 'AWS Nitro System cryptographic attestation verifying enclave image file (EIF) integrity against expected PCR0 hashes before releasing secrets.',
        remediation: 'Enforce IMDSv2 HopLimit=1 on all EC2 launch templates to prevent metadata exfiltration via Server-Side Request Forgery (SSRF).',
        cliCommand: 'aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,MetadataOptions.HttpTokens]" --output table',
        cliLabel: 'Audit IMDSv2 Mandatory Token Status'
      }
    },
    {
      id: 'kms',
      title: 'KMS Key Vault & Data Hardening',
      shortName: 'KMS Hardware HSM',
      badge: 'FIPS 140-3 Level 3',
      status: 'SECURE',
      icon: Key,
      metricLabel: 'Customer Managed Keys (CMK)',
      metricVal: 'Envelope AES-256 Active',
      description: 'Hardware Security Module (HSM) backing customer managed keys with annual automatic key rotation.',
      inspectDetails: {
        architecture: 'Envelope encryption utilizing 256-bit AES-GCM data encryption keys (DEKs) wrapped by KMS master keys for S3 buckets, RDS databases, and EBS volumes.',
        remediation: 'Verify CMK key policies do not grant Root wildcard permissions. Validate that AWS CloudTrail records all kms:Decrypt API requests.',
        cliCommand: 'aws kms list-keys --query "Keys[*].KeyId" --output json',
        cliLabel: 'Enumerate Customer Managed Master Keys'
      }
    },
    {
      id: 'guardduty',
      title: 'GuardDuty & SIEM Nexus Detection',
      shortName: 'GuardDuty SIEM',
      badge: 'Continuous ML Threat Detection',
      status: 'MONITORING',
      icon: Radio,
      metricLabel: 'Threat Telemetry Stream',
      metricVal: '0 High Severity Open',
      description: 'Continuous analysis of CloudTrail management events, VPC Flow Logs, and DNS logs for anomalies.',
      inspectDetails: {
        architecture: 'Multi-account AWS GuardDuty detector integrated with AWS EventBridge rules triggering Lambda-based automated containment playbooks upon high-severity findings.',
        remediation: 'Filter for Recon:IAMUser/NetworkPermissions and UnauthorizedAccess:EC2/TorIPCaller findings. Immediately isolate suspect security groups upon trigger.',
        cliCommand: 'aws guardduty list-detectors --query "DetectorIds[0]" --output text',
        cliLabel: 'Fetch Master Threat Detector ID'
      }
    }
  ]

  const selectedNodeData = cyberNodes.find(n => n.id === activeNode)

  return (
    <div className="cyber-world-deck" aria-label="Futuristic Cyber Security Command Deck">
      {/* ── Main Clean Cyber Matrix Canvas (No distracting photo) ────── */}
      <div className="cwd-stage">
        <div className="cwd-grid-pattern" />

        {/* ── Top Cyber HUD Bar ──────────────────────────────────────── */}
        <div className="cwd-hud-top">
          <div className="cwd-hud-brand">
            <div className="cwd-hud-emblem">
              <Zap size={20} className="text-cyan" />
            </div>
            <div className="cwd-hud-title">
              <h2>
                SeCloudive Cyber Command Deck
                <Sparkles size={14} style={{ color: '#38bdf8' }} />
              </h2>
              <span>Next-Gen Cloud Security Career Simulation Grid</span>
            </div>
          </div>

          <div className="cwd-hud-telemetry-pills">
            <div className="cwd-telemetry-pill">
              <span className="cwd-pulse-dot" />
              <span>Grid Status: <strong>LIVE SIM</strong></span>
            </div>

            <div className="cwd-telemetry-pill emerald">
              <Shield size={12} style={{ color: '#10b981' }} />
              <span>Security Score: <strong>{scorePercent || 0}%</strong></span>
            </div>

            <div className="cwd-telemetry-pill">
              <Terminal size={12} style={{ color: '#38bdf8' }} />
              <span>Labs: <strong>{completedLabsCount || 0}/16 Solved</strong></span>
            </div>

            <div className="cwd-telemetry-pill rose">
              <Flame size={12} style={{ color: '#f43f5e' }} />
              <span>CTF Battle: <strong>{battleRoomsSolvedCount || 0}/6 Cleared</strong></span>
            </div>

            <button 
              type="button" 
              className="cwd-sound-btn" 
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Cyber Audio FX' : 'Enable Cyber Audio FX'}
              aria-label="Toggle Cyber Sound Effects"
            >
              {soundEnabled ? (
                <>
                  <Volume2 size={13} />
                  <span>AUDIO ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} />
                  <span>AUDIO MUTED</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Symmetrical 5-Column Cloud Security Nodes ──────────────── */}
        <div className="cwd-constellation-stage" role="region" aria-label="Interactive Cloud Security Nodes">
          {cyberNodes.map((node) => {
            const Icon = node.icon
            const isSelected = activeNode === node.id

            return (
              <div 
                key={node.id}
                className={`cwd-node-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleNodeSelect(node.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNodeSelect(node.id) }}
                aria-pressed={isSelected}
              >
                <div className="cwd-node-header">
                  <div className="cwd-node-icon">
                    <Icon size={16} />
                  </div>
                  <span className="cwd-node-badge">{node.badge}</span>
                </div>
                <h3>{node.shortName}</h3>
                <p className="cwd-node-desc">{node.description}</p>
                <div className="cwd-node-metrics">
                  <span className="cwd-metric-label">{node.metricLabel}</span>
                  <span className="cwd-metric-val">{node.metricVal}</span>
                </div>
                {isSelected && (
                  <div className="cwd-card-active-tag">
                    <span className="cwd-active-dot" /> ACTIVE NODE
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Interactive Holographic Drawer / Inspector ────────────── */}
        {selectedNodeData && (
          <div className="cwd-inspector-drawer" role="complementary" aria-label="Security Node Diagnostic Drawer">
            <div className="cwd-drawer-head">
              <div className="cwd-drawer-title">
                <span className="cwd-drawer-status-pill">{selectedNodeData.status}</span>
                <h4>{selectedNodeData.title}</h4>
              </div>
              <button 
                type="button" 
                className="cwd-drawer-close-btn"
                onClick={() => { playTactileClick(); setActiveNode(null); }}
                aria-label="Close Diagnostics Drawer"
              >
                <X size={13} />
                <span>Close</span>
              </button>
            </div>

            <div className="cwd-drawer-body">
              <div className="cwd-drawer-col">
                <div className="cwd-drawer-info-card">
                  <div className="cwd-info-label">
                    <Server size={13} style={{ color: '#38bdf8' }} /> Architecture Topology
                  </div>
                  <p>{selectedNodeData.inspectDetails.architecture}</p>
                </div>
                <div className="cwd-drawer-info-card">
                  <div className="cwd-info-label">
                    <Shield size={13} style={{ color: '#10b981' }} /> SOP Hardening Guidance
                  </div>
                  <p>{selectedNodeData.inspectDetails.remediation}</p>
                </div>
              </div>

              <div className="cwd-drawer-col">
                <div className="cwd-drawer-cli-card">
                  <div className="cwd-info-label">
                    <Terminal size={13} style={{ color: '#38bdf8' }} /> {selectedNodeData.inspectDetails.cliLabel}
                  </div>
                  <div className="cwd-cmd-box">
                    <code>{selectedNodeData.inspectDetails.cliCommand}</code>
                    <button 
                      type="button" 
                      className={`cwd-copy-btn ${copiedCmd === selectedNodeData.id ? 'copied' : ''}`}
                      onClick={() => handleCopyCommand(selectedNodeData.inspectDetails.cliCommand, selectedNodeData.id)}
                      aria-label="Copy AWS CLI Command"
                    >
                      {copiedCmd === selectedNodeData.id ? (
                        <>
                          <Check size={12} />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>COPY CLI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom Warp Portals Strip ──────────────────────────────── */}
        <div className="cwd-hud-bottom">
          <div className="cwd-ticker">
            <Radio size={14} className="cwd-ticker-icon" />
            <span>
              SYSTEM TELEMETRY: <code>AWS ZERO-TRUST SIMULATION GRID READY</code> • 16 Labs, 6 CTF Battle Rooms & 25 Incident Tickets
            </span>
          </div>

          <div className="cwd-portals-group">
            <Link 
              to="/battle-rooms" 
              className="cwd-portal-btn rose motion-button"
              onClick={playTabWhoosh}
            >
              <Flame size={14} />
              <span>Launch CTF Battle</span>
            </Link>

            <Link 
              to="/investigations" 
              className="cwd-portal-btn cyan motion-button"
              onClick={playTabWhoosh}
            >
              <Shield size={14} />
              <span>Incident Simulator</span>
            </Link>

            <Link 
              to="/labs" 
              className="cwd-portal-btn emerald motion-button"
              onClick={playTabWhoosh}
            >
              <Terminal size={14} />
              <span>16 Enterprise Labs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
