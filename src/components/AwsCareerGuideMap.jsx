// ==============================================================================
// SeCloudive AWS Career Guide Maps & Architectural Resilience Blueprint
// Specially engineered for AWS Job & Internship Readiness
// 
// Features:
// 1. 4 Tailored AWS Career Roadmaps (Intern -> SOC -> DevSecOps -> Architect)
// 2. Interactive AWS Defense-in-Depth Visual Architecture Map
// 3. ATS-Optimized AWS Resume Bullets Generator (STAR Method)
// 4. Live Synchronized Encouragement & Milestone Tracker
// ==============================================================================

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShieldCheck, 
  Compass, 
  Briefcase, 
  Award, 
  Layers, 
  Terminal, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Lock, 
  Radio, 
  Cpu, 
  FileCode2, 
  Flame, 
  ChevronRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'

export const AWS_CAREER_TRACKS = [
  {
    id: 'aws-intern',
    title: 'AWS Cloud Security Intern',
    tagline: 'Target: AWS, CrowdStrike, Datadog, Big Tech Internships',
    salaryRange: '$45 – $65 / hr ($90k – $135k annualized)',
    timeToJobReady: '4 to 6 Weeks of Deliberate Practice',
    targetCerts: ['AWS Certified Cloud Practitioner (CLF-C02)', 'AWS Solutions Architect Associate (SAA-C03)'],
    badge: '🎓 INTERN READY',
    badgeColor: '#10b981',
    description: 'Master the foundational triage, IAM policies, and cloud evidence collection needed to pass technical screening rounds for hyperscaler security internships.',
    mustHaveSkills: [
      'AWS IAM Policies, AssumeRole & Permission Boundaries',
      'Amazon S3 Bucket Policies & Block Public Access',
      'AWS CloudTrail Log Analysis & Forensic Timeline Reconstruction',
      'Linux Command Line, Bash & Basic Python Scripting'
    ],
    recommendedLabs: [
      { id: 'lab-iam-escalation', name: 'IAM Privilege Escalation Defense', path: '/labs/lab-iam-escalation' },
      { id: 'lab-s3-dlp-kms', name: 'S3 Ransomware & Bucket Policy Lockdown', path: '/labs/lab-s3-dlp-kms' },
      { id: 'lab-cloudtrail-guardrail', name: 'CloudTrail Tampering Detection', path: '/labs/lab-cloudtrail-guardrail' }
    ],
    interviewHighlights: 'Be able to explain what happens when an IAM policy has an explicit Deny vs Allow, how STS AssumeRole temporary credentials expire, and how to verify S3 bucket public exposure via CLI.',
    resumeBullets: [
      'Configured AWS IAM least-privilege boundaries and condition keys (aws:PrincipalTag, aws:SourceVpc), reducing over-permissioned service roles by 64%.',
      'Audited multi-region Amazon S3 storage buckets with AWS CLI automation, remediating 12 public bucket ACLs and implementing KMS customer managed encryption.',
      'Reconstructed cloud security attack timelines from AWS CloudTrail JSON events, isolating compromised access keys and generating incident triage reports.'
    ]
  },
  {
    id: 'aws-soc-analyst',
    title: 'AWS SOC Analyst / Incident Responder',
    tagline: 'Target: 24/7 Cloud SOC, Managed Detection, Tier 1/2 Triage',
    salaryRange: '$95,000 – $130,000 / yr',
    timeToJobReady: '6 to 8 Weeks',
    targetCerts: ['AWS Certified Security – Specialty (SCS-C02)', 'CompTIA Security+ (SY0-701)'],
    badge: '🛡️ SOC DEFENDER',
    badgeColor: '#38bdf8',
    description: 'Handle live alerts, correlate GuardDuty anomalies with VPC Flow Logs using Athena, and automate real-time incident isolation via EventBridge.',
    mustHaveSkills: [
      'Amazon GuardDuty & Security Hub finding prioritization',
      'VPC Flow Logs querying in Amazon Athena',
      'EventBridge + AWS Lambda automated containment',
      'EC2 IMDSv2 metadata theft prevention'
    ],
    recommendedLabs: [
      { id: 'lab-ec2-imds-containment', name: 'EC2 IMDS SSRF Containment & Quarantine', path: '/labs/lab-ec2-imds-containment' },
      { id: 'room-ai-bedrock-injection', name: 'AWS Bedrock Agent Prompt Injection Battle Room', path: '/battle-rooms/room-ai-bedrock-injection' },
      { id: 'inv-iam-privilege-escalation', name: 'SOC Incident: Rogue Administrator Creation', path: '/investigations/inv-iam-privilege-escalation' }
    ],
    interviewHighlights: 'Explain how GuardDuty detects crypto-mining or credential exfiltration, how to investigate a Port 22 brute-force using VPC Flow Logs in Athena, and how you quarantine an infected EC2 instance.',
    resumeBullets: [
      'Triaged and mitigated over 40 high-severity Amazon GuardDuty findings, analyzing VPC Flow Logs via Athena SQL to confirm external C2 traffic.',
      'Automated incident response runbooks with Amazon EventBridge and Lambda, achieving sub-60-second isolation of compromised EC2 instances into a forensic security group.',
      'Enforced IMDSv2 (HttpTokens=required) across 150+ EC2 instances, eliminating SSRF-based metadata credential theft vectors.'
    ]
  },
  {
    id: 'aws-devsecops',
    title: 'AWS DevSecOps & Platform Engineer',
    tagline: 'Target: CI/CD Security, Shift-Left IaC, Kubernetes / EKS',
    salaryRange: '$135,000 – $175,000 / yr',
    timeToJobReady: '8 to 12 Weeks',
    targetCerts: ['AWS Certified DevOps Engineer – Professional (DOP-C02)', 'AWS Certified Security – Specialty (SCS-C02)'],
    badge: '⚡ DEVSECOPS LEAD',
    badgeColor: '#a855f7',
    description: 'Implement secure CI/CD pipelines, eliminate hardcoded credentials using GitHub Actions OIDC to AWS IAM, and harden EKS container workloads.',
    mustHaveSkills: [
      'GitHub Actions OIDC Trust Policies & IAM Role Federation',
      'Terraform IaC security scanning with Checkov & tfsec',
      'Amazon EKS Pod Identity / IRSA & NetworkPolicies',
      'AWS Secrets Manager automated rotation & KMS CMK encryption'
    ],
    recommendedLabs: [
      { id: 'lab-cicd-oidc-hijack', name: 'GitHub Actions OIDC IAM Trust Policy Hardening', path: '/labs/lab-cicd-oidc-hijack' },
      { id: 'lab-eks-pod-compromise', name: 'EKS Pod Compromise & IRSA Containment', path: '/labs/lab-eks-pod-compromise' },
      { id: 'lab-github-secrets-leak', name: 'Hardcoded Secret Revocation & Secrets Manager', path: '/labs/lab-github-secrets-leak' }
    ],
    interviewHighlights: 'Describe how GitHub Actions OIDC eliminates long-lived AWS IAM access keys, how to configure the `sub` claim condition to restrict repository branches, and how EKS Pod Identity isolates microservices.',
    resumeBullets: [
      'Architected keyless CI/CD deployments using GitHub Actions OIDC federation to AWS IAM, deprecating 85+ long-lived developer access keys across production environments.',
      'Implemented automated pre-commit and pipeline IaC guardrails using Checkov and Terraform, preventing security group 0.0.0.0/0 drift and unencrypted storage volumes.',
      'Hardened Amazon EKS clusters by migrating legacy node instance profiles to EKS Pod Identity, scoping granular IAM permissions per namespace container.'
    ]
  },
  {
    id: 'aws-architect',
    title: 'Principal AWS Cloud Security Architect',
    tagline: 'Target: Enterprise Governance, Multi-Account Zero Trust, FinOps',
    salaryRange: '$180,000 – $250,000+ / yr',
    timeToJobReady: '12+ Weeks (Mastery Track)',
    targetCerts: ['AWS Certified Solutions Architect – Professional (SAP-C02)', 'AWS Certified Security – Specialty (SCS-C02)'],
    badge: '👑 ENTERPRISE ARCHITECT',
    badgeColor: '#f59e0b',
    description: 'Architect multi-account AWS Organizations landing zones with Control Tower, enforce preventive Service Control Policies (SCPs), and establish zero-trust network perimeters with Transit Gateway.',
    mustHaveSkills: [
      'AWS Organizations Multi-Account Architecture & Preventive SCPs',
      'AWS Transit Gateway, Network Firewall & PrivateLink VPC Endpoints',
      'AWS KMS Envelope Encryption & Multi-Region Key Architecture',
      'FinOps Guardrails & AWS Budgets Tripwires'
    ],
    recommendedLabs: [
      { id: 'lab-scp-organizations-bypass', name: 'Multi-Account SCP Hierarchy & Region Restrictions', path: '/labs/lab-scp-organizations-bypass' },
      { id: 'lab-kms-ransomware-deletion', name: 'KMS Key Deletion Ransomware & Multi-Party Quorum', path: '/labs/lab-kms-ransomware-deletion' },
      { id: 'lab-tgw-route-poisoning', name: 'Transit Gateway Inspection VPC & Route Table Defense', path: '/labs/lab-tgw-route-poisoning' }
    ],
    interviewHighlights: 'Explain how Service Control Policies filter maximum available permissions without granting permissions, how to design a centralized inspection VPC using Transit Gateway, and how KMS key policies prevent account root takeover.',
    resumeBullets: [
      'Designed multi-account AWS Organizations landing zone with 14 preventive SCPs, enforcing regional lockdowns, mandatory encryption, and immutable CloudTrail logging.',
      'Engineered centralized traffic inspection architecture utilizing AWS Transit Gateway and AWS Network Firewall, inspecting north-south and east-west VPC traffic.',
      'Instituted enterprise KMS key management with multi-party deletion quorums and envelope encryption, safeguarding PB-scale analytical datasets against ransomware.'
    ]
  }
]

export const AWS_DEFENSE_TOPOLOGY_NODES = [
  {
    id: 'edge',
    name: '1. Edge & Perimeter Defense',
    services: ['Amazon CloudFront', 'AWS WAF', 'AWS Shield Advanced', 'Amazon Route 53 DNSSEC'],
    icon: '🌐',
    color: '#38bdf8',
    summary: 'Block DDoS volumetric floods, OWASP Top 10 web injection attacks, and malicious bot traffic before packets ever reach compute VPCs.',
    labLink: '/labs/lab-waf-alb-lockdown',
    interviewQ: 'How does AWS WAF inspect TLS traffic, and what is the difference between rate-based rules and AWS Managed Rule Groups?'
  },
  {
    id: 'identity',
    name: '2. Identity & Permission Perimeter',
    services: ['AWS Organizations SCPs', 'AWS IAM', 'IAM Access Analyzer', 'AWS IAM Identity Center'],
    icon: '🔑',
    color: '#f59e0b',
    summary: 'The primary cloud perimeter: preventive SCP guardrails, Least-Privilege IAM boundaries, and ABAC condition keys stop privilege escalation dead.',
    labLink: '/labs/lab-iam-escalation',
    interviewQ: 'What is the exact evaluation logic when an SCP Deny, IAM Permission Boundary, and Identity-based Allow interact?'
  },
  {
    id: 'compute',
    name: '3. Workload & Container Runtime',
    services: ['Amazon EC2 (IMDSv2)', 'Amazon EKS (Pod Identity)', 'AWS Lambda', 'Amazon Inspector'],
    icon: '⚡',
    color: '#10b981',
    summary: 'Harden virtual machines and container microservices: enforce IMDSv2, isolate pods with IAM roles for service accounts, and scan images for CVEs.',
    labLink: '/labs/lab-ec2-imds-containment',
    interviewQ: 'Why is IMDSv1 vulnerable to SSRF vulnerabilities, and how does IMDSv2 token exchange mitigate the threat?'
  },
  {
    id: 'data',
    name: '4. Data Vault & Encryption',
    services: ['Amazon S3 Block Public Access', 'AWS KMS (SSE-KMS)', 'AWS Secrets Manager', 'Amazon Macie'],
    icon: '🔒',
    color: '#a855f7',
    summary: 'Keep customer data confidential: default KMS Customer Managed Key encryption, bucket policies with VPC endpoint conditions, and automated PII discovery.',
    labLink: '/labs/lab-s3-dlp-kms',
    interviewQ: 'How does envelope encryption work in AWS KMS, and why is the plaintext data key never stored by KMS?'
  },
  {
    id: 'detection',
    name: '5. Detection & Telemetry Radar',
    services: ['AWS CloudTrail', 'Amazon GuardDuty', 'Amazon VPC Flow Logs', 'AWS Security Hub'],
    icon: '🚨',
    color: '#ef4444',
    summary: 'Maintain tamper-proof forensic audit trails: multi-region CloudTrail with digest validation, AI-powered GuardDuty anomaly detection, and Athena query runbooks.',
    labLink: '/labs/lab-cloudtrail-guardrail',
    interviewQ: 'How do you verify if a CloudTrail log file was altered or deleted using AWS CLI digest validation?'
  },
  {
    id: 'ai-bedrock',
    name: '6. Generative AI & Model Security',
    services: ['Amazon Bedrock Guardrails', 'Amazon OpenSearch Serverless', 'AWS PrivateLink', 'Amazon Macie PII'],
    icon: '🤖',
    color: '#ec4899',
    summary: 'Protect autonomous AI agents and LLM applications against prompt injection, sensitive data leakage, and excessive agency tool exploitation.',
    labLink: '/battle-rooms/room-ai-bedrock-injection',
    interviewQ: 'How do Amazon Bedrock Guardrails prevent indirect prompt injection when an LLM agent consumes third-party webhooks or S3 files?'
  }
]

export default function AwsCareerGuideMap() {
  const { 
    completedMasterActivities = 0, 
    totalMasterActivities = 50,
    masterProgressPercent = 0
  } = useChallenges() || {}

  const [activeTrackId, setActiveTrackId] = useState('aws-intern')
  const [activeTopologyNode, setActiveTopologyNode] = useState(AWS_DEFENSE_TOPOLOGY_NODES[0])
  const [copiedBulletIdx, setCopiedBulletIdx] = useState(null)

  const activeTrack = AWS_CAREER_TRACKS.find(t => t.id === activeTrackId) || AWS_CAREER_TRACKS[0]

  const handleCopyBullet = (text, idx) => {
    navigator.clipboard?.writeText(text)
    setCopiedBulletIdx(idx)
    setTimeout(() => setCopiedBulletIdx(null), 2000)
  }

  return (
    <section className="aws-career-guide-map-container" style={{ margin: '30px 0', width: '100%' }}>
      {/* ── Header Badge & Title ── */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 30, 55, 0.98) 100%)',
          border: '1px solid rgba(255, 153, 0, 0.35)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 153, 0, 0.12)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow Accent */}
        <div 
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255, 153, 0, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} 
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ 
                background: 'linear-gradient(135deg, #ff9900 0%, #f59e0b 100%)',
                color: '#0f172a',
                fontSize: '11px',
                fontWeight: 900,
                fontFamily: "'DM Mono', monospace",
                padding: '3px 10px',
                borderRadius: '6px',
                letterSpacing: '0.8px'
              }}>
                AWS CAREER FLIGHT PLAN • 100% AWS SPECIALIZED
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                fontSize: '11px',
                fontFamily: "'DM Mono', monospace",
                padding: '3px 8px',
                borderRadius: '6px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span className="pulse-dot" style={{ width: '6px', height: '6px', background: '#34d399' }} />
                Live Sync: Supabase Connected
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>AWS Cloud Security Job &amp; Internship Launchpad</span>
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', maxWidth: '820px', lineHeight: 1.6, margin: 0 }}>
              Systematic guide maps, interactive defense-in-depth visual architecture, and ATS resume blueprints engineered to take you from beginner to job-ready for AWS security roles with zero fluff.
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '12px 18px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: "'DM Mono', monospace", textTransform: 'uppercase' }}>
              Your Candidate Readiness
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ff9900', fontFamily: "'DM Mono', monospace" }}>
              {masterProgressPercent}%
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              {completedMasterActivities} / {totalMasterActivities} AWS Milestones Mastered
            </div>
          </div>
        </div>

        {/* ── Career Track Selector Tabs ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '10px',
          marginBottom: '24px'
        }}>
          {AWS_CAREER_TRACKS.map((track) => {
            const isSelected = track.id === activeTrackId
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setActiveTrackId(track.id)}
                style={{
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(255, 153, 0, 0.18) 0%, rgba(245, 158, 11, 0.25) 100%)'
                    : 'rgba(15, 23, 42, 0.65)',
                  border: isSelected ? '1px solid #ff9900' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    fontFamily: "'DM Mono', monospace",
                    color: track.badgeColor,
                    background: `${track.badgeColor}22`,
                    border: `1px solid ${track.badgeColor}55`,
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {track.badge}
                  </span>
                  {isSelected && <Sparkles size={13} style={{ color: '#ff9900' }} />}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#ffffff' : '#e2e8f0', marginBottom: '4px' }}>
                  {track.title}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>
                  {track.salaryRange}
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Active Track Deep-Dive Details ── */}
        <div style={{
          background: 'rgba(2, 6, 23, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '22px',
          marginBottom: '26px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontFamily: "'DM Mono', monospace", color: '#ff9900', fontWeight: 700, marginBottom: '2px' }}>
                ROLE TARGET PROFILE &amp; COMPENSATION
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px 0' }}>
                {activeTrack.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', margin: 0 }}>
                {activeTrack.tagline} • Typical timeline: <strong style={{ color: '#cbd5e1' }}>{activeTrack.timeToJobReady}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {activeTrack.targetCerts.map((cert, cIdx) => (
                <span 
                  key={cIdx} 
                  style={{
                    fontSize: '11px',
                    background: 'rgba(255, 153, 0, 0.1)',
                    border: '1px solid rgba(255, 153, 0, 0.3)',
                    color: '#ffb347',
                    padding: '4px 9px',
                    borderRadius: '6px',
                    fontFamily: "'DM Mono', monospace",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Award size={12} />
                  {cert}
                </span>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '20px' }}>
            {activeTrack.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '20px' }}>
            {/* Must-Have Skills */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', fontFamily: "'DM Mono', monospace", marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} />
                MUST-HAVE INTERVIEW &amp; JOB SKILLS
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {activeTrack.mustHaveSkills.map((skill, sIdx) => (
                  <li key={sIdx}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* Recommended Hands-On Labs */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', fontFamily: "'DM Mono', monospace", marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={13} />
                RECOMMENDED 1-CLICK VERIFICATION LABS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeTrack.recommendedLabs.map((lab, lIdx) => (
                  <Link 
                    key={lIdx}
                    to={lab.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(2, 6, 23, 0.7)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      color: '#e2e8f0',
                      textDecoration: 'none',
                      fontSize: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{lab.name}</span>
                    <ArrowRight size={13} className="text-emerald" style={{ color: '#10b981' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Copyable ATS Resume Bullets */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px dashed rgba(255, 153, 0, 0.35)',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#ff9900', fontFamily: "'DM Mono', monospace", display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GraduationCap size={14} />
                VERIFIED ATS RESUME BULLETS (COPY DIRECTLY INTO YOUR RESUME)
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>
                STAR Method • Recruiter Approved
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeTrack.resumeBullets.map((bullet, bIdx) => (
                <div 
                  key={bIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: 'rgba(2, 6, 23, 0.5)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#e2e8f0',
                    lineHeight: 1.5
                  }}
                >
                  <span style={{ flex: 1 }}>• {bullet}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyBullet(bullet, bIdx)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: copiedBulletIdx === bIdx ? '#10b981' : '#cbd5e1',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {copiedBulletIdx === bIdx ? <Check size={12} /> : <Copy size={12} />}
                    {copiedBulletIdx === bIdx ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Interactive AWS Defense-in-Depth Visual Architecture Map ── */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', fontFamily: "'DM Mono', monospace" }}>
                INTERACTIVE GRAPHICAL ARCHITECTURE BLUEPRINT
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 0 0' }}>
                AWS Enterprise Security Defense-in-Depth Topology
              </h3>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: "'DM Mono', monospace" }}>
              Click any perimeter tier to inspect services &amp; interview defense
            </span>
          </div>

          {/* Interactive Tier Nodes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
            marginBottom: '16px'
          }}>
            {AWS_DEFENSE_TOPOLOGY_NODES.map((node) => {
              const isNodeSelected = activeTopologyNode.id === node.id
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveTopologyNode(node)}
                  style={{
                    background: isNodeSelected 
                      ? `linear-gradient(135deg, ${node.color}22 0%, ${node.color}44 100%)`
                      : 'rgba(15, 23, 42, 0.7)',
                    border: isNodeSelected ? `1px solid ${node.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '12px 10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{node.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: isNodeSelected ? '#ffffff' : '#cbd5e1' }}>
                    {node.name}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Selected Architecture Tier Details Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: `1px solid ${activeTopologyNode.color}55`,
            borderRadius: '10px',
            padding: '18px',
            boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${activeTopologyNode.color}15`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div>
                <span style={{
                  fontSize: '10px',
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 800,
                  color: activeTopologyNode.color,
                  letterSpacing: '1px'
                }}>
                  ACTIVE DEFENSE LAYER INSPECTION
                </span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 0 0' }}>
                  {activeTopologyNode.name}
                </h4>
              </div>

              <Link
                to={activeTopologyNode.labLink}
                className="button button-primary btn-sm"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                Launch Associated AWS Lab <ArrowRight size={13} />
              </Link>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 14px 0' }}>
              {activeTopologyNode.summary}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {activeTopologyNode.services.map((svc, sIdx) => (
                <span
                  key={sIdx}
                  style={{
                    fontSize: '11px',
                    fontFamily: "'DM Mono', monospace",
                    background: 'rgba(255, 255, 255, 0.07)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#e2e8f0',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {svc}
                </span>
              ))}
            </div>

            <div style={{
              background: 'rgba(2, 6, 23, 0.6)',
              borderLeft: `3px solid ${activeTopologyNode.color}`,
              padding: '10px 14px',
              borderRadius: '0 6px 6px 0'
            }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: activeTopologyNode.color, fontFamily: "'DM Mono', monospace", marginBottom: '2px' }}>
                TECHNICAL INTERVIEW DEFENSE QUESTION &amp; ANSWER
              </div>
              <div style={{ fontSize: '12px', color: '#f8fafc', fontStyle: 'italic' }}>
                "{activeTopologyNode.interviewQ}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
