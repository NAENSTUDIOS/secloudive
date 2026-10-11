// ==============================================================================
// SeCloudive Topic Architecture & Visual Threat Diagram Engine
// Renders dynamic, interactive, graphical cloud architecture flowcharts
// for every topic across IAM, S3, Network, Monitoring, Architecture, and AI.
// ==============================================================================

import { useState } from 'react'
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Layers, 
  Terminal, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Cpu, 
  Sparkles,
  Zap,
  Eye,
  Key,
  Database,
  Radio,
  Activity,
  AlertTriangle
} from 'lucide-react'

// Domain-tailored architecture blueprints
const TOPOLOGY_BLUEPRINTS = {
  iam: {
    domainName: 'AWS Identity & Access Management (IAM)',
    threatVector: 'Compromised Access Key / Overprivileged Principal',
    threatColor: '#ef4444',
    nodes: [
      {
        stage: 'ENTRY',
        label: 'Caller Request',
        sub: 'CLI / Console / SDK',
        icon: <Key size={16} />,
        color: '#f59e0b',
        detail: 'Authentication validates credentials (STS assume role token, sigv4 signature).'
      },
      {
        stage: 'GUARD 1',
        label: 'Organizations SCP',
        sub: 'Preventive Guardrail',
        icon: <Lock size={16} />,
        color: '#ef4444',
        detail: 'Filters max allowable permissions across member accounts. Explicit Deny cannot be bypassed.'
      },
      {
        stage: 'GUARD 2',
        label: 'Permission Boundary',
        sub: 'Max Priv Ceiling',
        icon: <ShieldCheck size={16} />,
        color: '#a855f7',
        detail: 'Ensures developers cannot escalate privileges by creating admin roles.'
      },
      {
        stage: 'DECISION',
        label: 'IAM Policy Engine',
        sub: 'Principal + Context',
        icon: <Cpu size={16} />,
        color: '#38bdf8',
        detail: 'Evaluates Identity Policy + Resource Policy + Conditions (aws:PrincipalTag, aws:SourceVpc).'
      },
      {
        stage: 'TARGET',
        label: 'Target AWS Resource',
        sub: 'Least-Privilege API',
        icon: <CheckCircle2 size={16} />,
        color: '#10b981',
        detail: 'Request authorized. Scoped only to explicitly permitted actions and resources.'
      }
    ]
  },
  s3: {
    domainName: 'Amazon S3 & Data Protection Perimeter',
    threatVector: 'Unauthenticated Public Scraper / Ransomware Exfiltration',
    threatColor: '#ef4444',
    nodes: [
      {
        stage: 'ATTACK',
        label: 'External Scanner',
        sub: 'Automated Crawl',
        icon: <AlertTriangle size={16} />,
        color: '#ef4444',
        detail: 'Adversary probes bucket endpoints attempting anonymous GetObject or PutObject.'
      },
      {
        stage: 'WALL 1',
        label: 'Block Public Access',
        sub: 'Account & Bucket Level',
        icon: <Lock size={16} />,
        color: '#f59e0b',
        detail: 'Enforces 4 BPA flags. Overrides any accidental public ACLs or broad wildcards.'
      },
      {
        stage: 'WALL 2',
        label: 'Bucket Policy',
        sub: 'VPC Endpoint Required',
        icon: <Layers size={16} />,
        color: '#38bdf8',
        detail: 'Enforces TLS (aws:SecureTransport) and restricts traffic strictly to corporate VPC Endpoint.'
      },
      {
        stage: 'CRYPT',
        label: 'AWS KMS Key Policy',
        sub: 'SSE-KMS Encryption',
        icon: <Key size={16} />,
        color: '#a855f7',
        detail: 'Plaintext data key unwrap denied to unauthorized principals. Prevents ransomware theft.'
      },
      {
        stage: 'VAULT',
        label: 'Encrypted S3 Vault',
        sub: 'Versioning + Object Lock',
        icon: <CheckCircle2 size={16} />,
        color: '#10b981',
        detail: 'WORM protection guarantees data cannot be modified or deleted even by admin root.'
      }
    ]
  },
  network: {
    domainName: 'Amazon VPC & Network Boundary Security',
    threatVector: 'Port 22/3389 Brute-Force / C2 Lateral Movement',
    threatColor: '#ef4444',
    nodes: [
      {
        stage: 'INGRESS',
        label: 'Internet Ingress',
        sub: 'Route 53 DNS',
        icon: <Radio size={16} />,
        color: '#f59e0b',
        detail: 'Inbound traffic routed through Route 53 with DNSSEC verification.'
      },
      {
        stage: 'EDGE',
        label: 'AWS WAF & Shield',
        sub: 'DDoS & Layer 7 Rules',
        icon: <ShieldAlert size={16} />,
        color: '#ef4444',
        detail: 'Filters OWASP Top 10 SQLi/XSS payloads and blocks anomalous bot scraping.'
      },
      {
        stage: 'ROUTER',
        label: 'Transit Gateway',
        sub: 'Central Inspection VPC',
        icon: <Layers size={16} />,
        color: '#38bdf8',
        detail: 'Inspects inter-VPC east-west and egress north-south traffic with AWS Network Firewall.'
      },
      {
        stage: 'HOST',
        label: 'Private Subnet EC2',
        sub: 'IMDSv2 Enforced',
        icon: <Cpu size={16} />,
        color: '#a855f7',
        detail: 'Workload runs in private subnet with no public IP. Token-based IMDSv2 blocks SSRF.'
      },
      {
        stage: 'RADAR',
        label: 'VPC Flow Logs',
        sub: 'Athena SIEM Forensics',
        icon: <CheckCircle2 size={16} />,
        color: '#10b981',
        detail: '100% of packet metadata logged to CloudWatch/S3 for automated anomaly correlation.'
      }
    ]
  },
  monitoring: {
    domainName: 'AWS Detection & Incident Telemetry',
    threatVector: 'Stealth Intrusion / Disabled Logging / Crypto-Mining',
    threatColor: '#ef4444',
    nodes: [
      {
        stage: 'SIGNAL',
        label: 'API Event Stream',
        sub: 'CloudTrail Multi-Region',
        icon: <Activity size={16} />,
        color: '#38bdf8',
        detail: 'Captures all management events across all 32 AWS regions with SHA-256 digest validation.'
      },
      {
        stage: 'ANALYZER',
        label: 'Amazon GuardDuty',
        sub: 'ML Threat Intelligence',
        icon: <ShieldAlert size={16} />,
        color: '#ef4444',
        detail: 'Detects compromised credentials, Tor exits, DNS exfiltration, and anomalous IAM spikes.'
      },
      {
        stage: 'ROUTER',
        label: 'Amazon EventBridge',
        sub: 'Real-Time Bus',
        icon: <Zap size={16} />,
        color: '#f59e0b',
        detail: 'Filters finding severity >= 7.0 (HIGH/CRITICAL) and dispatches automated response target.'
      },
      {
        stage: 'ACTION',
        label: 'Auto-Remediation Lambda',
        sub: 'Sub-Second Quarantine',
        icon: <Cpu size={16} />,
        color: '#a855f7',
        detail: 'Attaches isolation security group, disables access key, and invalidates STS sessions.'
      },
      {
        stage: 'AUDIT',
        label: 'Incident Dossier',
        sub: 'Verified Evidence',
        icon: <CheckCircle2 size={16} />,
        color: '#10b981',
        detail: 'Forensic evidence preserved in immutable S3 bucket for CIRT root-cause review.'
      }
    ]
  },
  architecture: {
    domainName: 'Enterprise Cloud Architecture & Multi-Account Governance',
    threatVector: 'Compound Failure / Blast Radius Contagion',
    threatColor: '#ef4444',
    nodes: [
      {
        stage: 'ROOT',
        label: 'AWS Organizations',
        sub: 'Dedicated Security OU',
        icon: <Layers size={16} />,
        color: '#f59e0b',
        detail: 'Multi-account isolation: separate Log Archive, Security Tooling, Dev, and Prod accounts.'
      },
      {
        stage: 'POLICY',
        label: 'Organization SCPs',
        sub: 'Immutable Guardrails',
        icon: <Lock size={16} />,
        color: '#ef4444',
        detail: 'Denies root user logins, prevents turning off CloudTrail, locks sensitive regions.'
      },
      {
        stage: 'TRANSIT',
        label: 'Transit Gateway',
        sub: 'Inspection VPC',
        icon: <Radio size={16} />,
        color: '#38bdf8',
        detail: 'Shared services and cross-account VPC peering channeled through deep packet inspection.'
      },
      {
        stage: 'ZERO-TRUST',
        label: 'PrivateLink Endpoints',
        sub: 'No Internet Transit',
        icon: <Key size={16} />,
        color: '#a855f7',
        detail: 'Workloads communicate with AWS API endpoints privately without traverse through public web.'
      },
      {
        stage: 'RESILIENCE',
        label: 'Well-Architected Pillar',
        sub: 'HA / DR / Zero Blast',
        icon: <CheckCircle2 size={16} />,
        color: '#10b981',
        detail: 'Single account or server compromise cannot pivot to customer databases or keys.'
      }
    ]
  },
  foundations: {
    domainName: 'Cloud Engineering Core Toolbox (Linux, Docker, Terraform)',
    threatVector: 'Root Container Escapes / Hardcoded Secrets in IaC',
    threatColor: '#ef4444',
    nodes: [
      {
        stage: 'CODE',
        label: 'Developer Commit',
        sub: 'Git & Bash Shell',
        icon: <Terminal size={16} />,
        color: '#f59e0b',
        detail: 'Linux terminal foundations: secure file permissions (chmod 600) and SSH key hygiene.'
      },
      {
        stage: 'LINT',
        label: 'Shift-Left IaC Scan',
        sub: 'Checkov & tfsec',
        icon: <Lock size={16} />,
        color: '#ef4444',
        detail: 'Scans Terraform code pre-commit to block 0.0.0.0/0 security groups and unencrypted disks.'
      },
      {
        stage: 'BUILD',
        label: 'Container Hardening',
        sub: 'Docker & Trivy CVE Scan',
        icon: <Layers size={16} />,
        color: '#38bdf8',
        detail: 'Multi-stage builds, non-root USER directive, and vulnerability scanning for base images.'
      },
      {
        stage: 'ORCHESTRATE',
        label: 'Kubernetes / EKS',
        sub: 'Pod Identity & NetworkPolicy',
        icon: <Cpu size={16} />,
        color: '#a855f7',
        detail: 'Scoped service account tokens isolate pod permissions. Eliminates node instance profile sharing.'
      },
      {
        stage: 'DEPLOY',
        label: 'Immutable Infrastructure',
        sub: 'Production Ready',
        icon: <CheckCircle2 size={16} />,
        color: '#10b981',
        detail: 'Zero manual console changes. 100% reproducible, auditable cloud deployments.'
      }
    ]
  },
  incident: {
    domainName: 'AWS Incident Response & Containment Protocol',
    threatVector: 'Active Production Intrusion / Data Exfiltration',
    threatColor: '#ef4444',
    nodes: [
      {
        stage: 'DETECT',
        label: 'Anomaly Trigger',
        sub: 'GuardDuty / CloudTrail',
        icon: <AlertTriangle size={16} />,
        color: '#ef4444',
        detail: 'High-severity finding alerts on anomalous API calls or Tor exit node traffic.'
      },
      {
        stage: 'TRIAGE',
        label: 'Evidence Preservation',
        sub: 'EBS Volume Snapshot',
        icon: <Layers size={16} />,
        color: '#f59e0b',
        detail: 'Instant forensic volume snapshot taken before terminating or modifying infected instance.'
      },
      {
        stage: 'CONTAIN',
        label: 'Quarantine Security Group',
        sub: 'Revoke Ingress & Egress',
        icon: <ShieldAlert size={16} />,
        color: '#ef4444',
        detail: 'Attaches isolation security group with 0 inbound/outbound rules to sever active C2 channels.'
      },
      {
        stage: 'REVOKE',
        label: 'IAM Invalidation',
        sub: 'STS Session Invalidation',
        icon: <Key size={16} />,
        color: '#a855f7',
        detail: 'Revokes active temporary credentials by updating the IAM role assume-role policy with DenyBefore.'
      },
      {
        stage: 'REPORT',
        label: 'CIRT Root-Cause Dossier',
        sub: 'Timeline Verified',
        icon: <CheckCircle2 size={16} />,
        color: '#10b981',
        detail: 'Complete post-incident analysis report with Athena SQL queries and remediation pull request.'
      }
    ]
  },
  career: {
    domainName: 'AWS Security Career Flight Plan & Interview Defense',
    threatVector: 'Credential Gaps / Experience Paradox',
    threatColor: '#f59e0b',
    nodes: [
      {
        stage: 'FOUNDATION',
        label: 'Diagnostic Placement',
        sub: 'Skill Baseline',
        icon: <Sparkles size={16} />,
        color: '#f59e0b',
        detail: '2-Minute evaluation benchmarks your cloud skills and maps you directly to the correct starting tier.'
      },
      {
        stage: 'ARENA',
        label: 'Real AWS Job Labs',
        sub: '$0 Safe Sandbox',
        icon: <Terminal size={16} />,
        color: '#38bdf8',
        detail: '18 production scenarios with 1-click Terraform templates and automated verification tripwires.'
      },
      {
        stage: 'COMBAT',
        label: 'Purple Team Battle Rooms',
        sub: 'TryHackMe/HTB CTF',
        icon: <ShieldAlert size={16} />,
        color: '#ef4444',
        detail: 'Defend against Bedrock Prompt Injection, S3 Ransomware, and CI/CD OIDC account takeover.'
      },
      {
        stage: 'DEFENSE',
        label: 'AI Interview Simulator',
        sub: 'STAR Method Mastery',
        icon: <Cpu size={16} />,
        color: '#a855f7',
        detail: 'Practice answering tough hiring manager questions with instant real-time AI scoring and feedback.'
      },
      {
        stage: 'HIRED',
        label: 'Verified Audit Dossier',
        sub: 'Intern & Job Offers',
        icon: <CheckCircle2 size={16} />,
        color: '#10b981',
        detail: 'Cryptographically verifiable evidence of cloud security judgment ready for resumes and LinkedIn.'
      }
    ]
  }
}

export default function TopicArchitectureDiagram({ topic, pathId = 'iam' }) {
  const [selectedNodeIdx, setSelectedNodeIdx] = useState(0)

  // Find matching domain blueprint
  const normalizedPath = (pathId || '').toLowerCase()
  const blueprintKey = Object.keys(TOPOLOGY_BLUEPRINTS).find(k => normalizedPath.includes(k)) || 'iam'
  const blueprint = TOPOLOGY_BLUEPRINTS[blueprintKey]

  const activeNode = blueprint.nodes[selectedNodeIdx] || blueprint.nodes[0]

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(8, 14, 28, 0.98) 100%)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)'
    }}>
      {/* ── Top Blueprint Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontSize: '10px',
              fontFamily: "'DM Mono', monospace",
              fontWeight: 800,
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '2px 8px',
              borderRadius: '4px',
              letterSpacing: '0.8px'
            }}>
              INTERACTIVE ARCHITECTURAL TOPOLOGY
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              • {topic?.title || blueprint.domainName}
            </span>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            {blueprint.domainName}
          </h3>
        </div>

        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: '#f87171'
        }}>
          <AlertTriangle size={13} />
          <span>Threat Vector: {blueprint.threatVector}</span>
        </div>
      </div>

      {/* ── Interactive Topology Flow Visualizer ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${blueprint.nodes.length}, 1fr)`,
        gap: '8px',
        marginBottom: '16px',
        overflowX: 'auto',
        paddingBottom: '6px'
      }}>
        {blueprint.nodes.map((node, idx) => {
          const isSelected = selectedNodeIdx === idx
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedNodeIdx(idx)}
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${node.color}22 0%, ${node.color}35 100%)` 
                  : 'rgba(2, 6, 23, 0.6)',
                border: isSelected ? `1.5px solid ${node.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '12px 10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                minWidth: '120px'
              }}
            >
              <div style={{
                fontSize: '9px',
                fontWeight: 800,
                fontFamily: "'DM Mono', monospace",
                color: node.color,
                marginBottom: '4px',
                letterSpacing: '0.5px'
              }}>
                {node.stage}
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                margin: '0 auto 6px auto',
                borderRadius: '6px',
                background: `${node.color}20`,
                border: `1px solid ${node.color}50`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: node.color
              }}>
                {node.icon}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? '#ffffff' : '#cbd5e1', lineHeight: 1.2 }}>
                {node.label}
              </div>
              <div style={{ fontSize: '9px', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {node.sub}
              </div>

              {/* Connecting arrow indicator */}
              {idx < blueprint.nodes.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  color: '#475569',
                  pointerEvents: 'none'
                }}>
                  <ArrowRight size={12} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Active Selected Stage Details ── */}
      <div style={{
        background: 'rgba(2, 6, 23, 0.85)',
        borderLeft: `4px solid ${activeNode.color}`,
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '0 8px 8px 0',
        padding: '14px 18px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, fontFamily: "'DM Mono', monospace", color: activeNode.color }}>
              STAGE {selectedNodeIdx + 1} OF {blueprint.nodes.length}: {activeNode.stage}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc' }}>
              • {activeNode.label} ({activeNode.sub})
            </span>
          </div>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>
            Click other nodes to inspect stage
          </span>
        </div>
        <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
          {activeNode.detail}
        </p>
      </div>
    </div>
  )
}
