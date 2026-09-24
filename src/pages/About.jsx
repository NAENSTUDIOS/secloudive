import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShieldCheck, 
  Terminal, 
  Briefcase, 
  Award, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ArrowRight,
  ExternalLink,
  Code2,
  Database,
  Building,
  ChevronDown,
  ChevronRight,
  Flame,
  Layers
} from 'lucide-react'

const careerRoles = [
  {
    role: 'Cloud Security Analyst (SOC Tier 1/2)',
    focus: 'Detection & Triage',
    salary: '$95,000 - $130,000',
    description: 'Monitors real-time alerts from AWS GuardDuty, Security Hub, and SIEMs (Splunk/Datadog). Triages suspicious IP addresses, investigates compromised IAM credentials, and triggers containment runbooks.',
    dailyTasks: [
      'Triage 15-30 automated AWS Security Hub and GuardDuty findings per shift.',
      'Correlate CloudTrail events to identify who, what, when, and from where an API call originated.',
      'Execute minute-0 containment runbooks (e.g. deactivate compromised access keys, isolate EC2s).',
      'Maintain shift handovers and document preliminary incident timelines in Jira/ServiceNow.'
    ],
    topTools: ['AWS GuardDuty', 'AWS CloudTrail', 'Athena', 'Splunk/Datadog', 'Jira Service Desk'],
    certifications: ['AWS Certified Security - Specialty', 'CompTIA Security+', 'GIAC Cloud Security (GCSA)']
  },
  {
    role: 'Cloud Security Engineer (SecOps / Infra)',
    focus: 'Hardening & Remediation',
    salary: '$135,000 - $185,000',
    description: 'Builds and enforces preventive and detective security controls. Implements least-privilege IAM policies, KMS encryption keys, VPC network boundaries, and Terraform policy-as-code guardrails.',
    dailyTasks: [
      'Audit and refactor overly permissive IAM policies (removing AdministratorAccess and wildcard actions).',
      'Configure AWS KMS Customer Managed Keys (CMKs) with automated rotation for S3, RDS, and EBS.',
      'Deploy and tune AWS WAF WebACLs with rate-based and SQLi managed rule groups.',
      'Codify security baselines in Terraform and validate pull requests with Checkov/tfsec.'
    ],
    topTools: ['AWS IAM & Access Analyzer', 'AWS KMS', 'Terraform', 'AWS WAF', 'AWS Config'],
    certifications: ['AWS Solutions Architect Associate', 'AWS Certified Security - Specialty', 'CISSP']
  },
  {
    role: 'DevSecOps Specialist',
    focus: 'Pipeline & Container Security',
    salary: '$140,000 - $190,000',
    description: 'Integrates automated security testing into CI/CD pipelines. Secures Docker container images, enforces EKS/Kubernetes pod security policies, manages secrets, and secures GitHub Actions OIDC trust.',
    dailyTasks: [
      'Migrate deployment pipelines from static AWS access keys to GitHub Actions OIDC federation.',
      'Implement SAST/DAST/SCA scanners (Semgrep, Trivy, Snyk) in CI/CD pipeline stages.',
      'Configure Kubernetes IAM Roles for Service Accounts (IRSA) and NetworkPolicies on Amazon EKS.',
      'Enforce Amazon ECR image scanning with Amazon Inspector and sign images with Cosign.'
    ],
    topTools: ['GitHub Actions OIDC', 'Amazon EKS', 'Trivy / Snyk', 'Docker / ECR', 'Checkov'],
    certifications: ['Certified Kubernetes Security Specialist (CKS)', 'AWS DevOps Engineer - Professional']
  },
  {
    role: 'Cloud Incident Responder (DFIR)',
    focus: 'Forensics & Containment',
    salary: '$145,000 - $205,000',
    description: 'Leads deep-dive investigations of active breaches, ransomware attempts, and advanced persistent threats. Conducts memory dumping, EBS snapshot forensics, and reconstructs adversary attack paths.',
    dailyTasks: [
      'Capture forensic disk images by taking EBS snapshots and mounting them in an isolated analysis VPC.',
      'Dump volatile memory from compromised EC2 instances using LiME or AWS Systems Manager.',
      'Query Athena over terabytes of VPC Flow Logs and CloudTrail to trace lateral movement.',
      'Author formal Root Cause Analysis (RCA) and Post-Incident Reviews (PIR) for executive leadership.'
    ],
    topTools: ['AWS CloudTrail', 'VPC Flow Logs', 'AWS Systems Manager', 'Volatilitiy / LiME', 'Athena'],
    certifications: ['GIAC Cloud Forensics (GCFA)', 'GIAC Incident Handler (GCIH)']
  },
  {
    role: 'Cloud Security Architect',
    focus: 'Governance & Zero Trust',
    salary: '$175,000 - $250,000+',
    description: 'Designs multi-account landing zone architectures for entire enterprises. Enforces Service Control Policies (SCPs) in AWS Organizations, designs zero-trust network boundaries, and leads compliance audits.',
    dailyTasks: [
      'Architect AWS Organizations multi-account structure with Core, Workloads, and Security OUs.',
      'Author and deploy preventative Service Control Policies (SCPs) enforcing regional and identity guardrails.',
      'Design centralized Transit Gateway and AWS Network Firewall traffic inspection architectures.',
      'Ensure cloud compliance with SOC2 Type II, ISO 27001, PCI-DSS, and FedRAMP frameworks.'
    ],
    topTools: ['AWS Organizations & Control Tower', 'Transit Gateway', 'AWS Network Firewall', 'IAM SCPs'],
    certifications: ['AWS Solutions Architect Professional', 'CISSP-ISSAP', 'CCSK']
  }
]

const interviewQuestions = [
  {
    q: 'How would you handle a compromised EC2 instance without destroying volatile forensic evidence?',
    starModel: {
      situation: 'A production EC2 instance was detected communicating with a known C2 beaconing IP address in Russia.',
      task: 'Isolate the instance from the network immediately while preserving the volatile RAM state and disk artifacts for legal forensics.',
      action: 'I did NOT terminate or reboot the instance. Instead, I modified the EC2 security group to a Quarantine SG with 0 inbound and 0 outbound rules. Then, using AWS Systems Manager Run Command, I captured a volatile memory dump to S3, and took a point-in-time EBS volume snapshot before detaching.',
      result: 'The attacker was severed in under 3 minutes, memory artifacts preserved the injected process payload, and the business incurred zero customer data exposure.'
    }
  },
  {
    q: 'How do you mitigate the Confused Deputy problem in cross-account IAM role assumptions?',
    starModel: {
      situation: 'A multi-tenant SaaS vendor needed access to our AWS account to monitor CloudWatch metrics via sts:AssumeRole.',
      task: 'Prevent an attacker from tricking the vendor service into using its assumed role against our target account without authorization.',
      action: 'I updated the IAM role Trust Relationship policy to mandate an sts:ExternalId condition with a cryptographically random UUID shared privately with the vendor. I also enforced an aws:PrincipalArn condition restricting the vendor identity.',
      result: 'Eliminated the confused deputy vulnerability, meeting ISO 27001 third-party risk audit compliance.'
    }
  },
  {
    q: 'How do you roll out S3 Block Public Access across 200 AWS accounts without breaking production?',
    starModel: {
      situation: 'Executive mandate required enabling S3 Block Public Access account-wide to eliminate data breach exposure across 200 legacy accounts.',
      task: 'Enforce the control without disrupting legitimate public web assets (e.g. public website assets, marketing CDN origins).',
      action: 'I used AWS IAM Access Analyzer for S3 to discover all buckets currently permitting public access. We identified 4 legitimate marketing buckets and migrated their assets behind CloudFront with Origin Access Control (OAC). Once verified, I deployed an AWS Organizations Service Control Policy enforcing S3 Block Public Access account-wide.',
      result: 'Achieved 100% public bucket remediation with 0 minutes of application downtime.'
    }
  },
  {
    q: 'What is your procedure when an AWS Access Key is accidentally leaked to a public GitHub repository?',
    starModel: {
      situation: 'An automated alert notified our SOC that an active production AWS Access Key was pushed to a public GitHub repo.',
      task: 'Execute minute-0 containment to prevent automated crypto-mining bots from exploiting the key.',
      action: 'Within 2 minutes, I ran aws iam update-access-key --status Inactive to kill the key, attached an explicit DenyAll inline policy to the user to invalidate cached STS sessions, and audited CloudTrail for RunInstances calls from unfamiliar IPs.',
      result: 'Zero unauthorized resources were spun up, and we permanently migrated that service to GitHub Actions OIDC federation with 0 static keys.'
    }
  }
]

const cisBenchmarks = [
  { section: '1. Identity & Access Management (IAM)', rules: ['1.4 - Ensure no root user account access key exists', '1.5 - Ensure MFA is enabled for all IAM users with console passwords', '1.16 - Ensure IAM policies are attached only to groups or roles, not individual users', '1.17 - Ensure credentials unused for 45+ days are disabled or deleted'] },
  { section: '2. Storage & Encryption (S3/KMS)', rules: ['2.1.1 - Ensure S3 Block Public Access is enabled at account level', '2.1.2 - Ensure S3 bucket policies enforce SSL/TLS (aws:SecureTransport: true)', '2.2.1 - Ensure EBS default encryption is enabled in all regions', '2.3.1 - Ensure RDS storage encryption is enabled with KMS CMK'] },
  { section: '3. Logging & Monitoring (CloudTrail)', rules: ['3.1 - Ensure CloudTrail is enabled in all regions with multi-region trail', '3.2 - Ensure CloudTrail log file integrity validation is enabled', '3.4 - Ensure CloudTrail S3 bucket access logging is enabled', '3.7 - Ensure CloudWatch alarms exist for unauthorized API calls (AccessDenied)'] },
  { section: '4. Networking & Firewalls (VPC)', rules: ['4.1 - Ensure no security groups allow ingress from 0.0.0.0/0 to port 22 (SSH)', '4.2 - Ensure no security groups allow ingress from 0.0.0.0/0 to port 3389 (RDP)', '4.3 - Ensure VPC Flow Logging is enabled in all VPCs with active traffic', '4.4 - Ensure default security group of every VPC restricts all inbound and outbound traffic'] }
]

export default function About() {
  const [activeTab, setActiveTab] = useState('matrix') // 'matrix' | 'interviews' | 'cis' | 'mission'
  const [copiedQ, setCopiedQ] = useState(null)

  const handleCopyStar = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedQ(idx)
    setTimeout(() => setCopiedQ(null), 2000)
  }

  return (
    <main className="page-shell about-page">
      {/* Header */}
      <div className="about-hero">
        <div className="eyebrow">
          <span className="pulse-dot" /> SECLOUDIVE /// CLOUD SECURITY CAREER & KNOWLEDGE HUB
        </div>
        <h1>
          Mastering Cloud Security Engineering<span>.</span>
        </h1>
        <p>
          SeCloudive was built on one foundational principle: <strong>Do not teach AWS services — teach how Cloud Security Engineers think.</strong>
          Explore role career paths, daily operational responsibilities, senior interview STAR breakdowns, and the CIS AWS Hardening Benchmark.
        </p>

        <div className="about-nav-tabs">
          <button
            type="button"
            className={`about-nav-btn ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            <Briefcase size={15} /> Career Role Matrix (5 Specializations)
          </button>
          <button
            type="button"
            className={`about-nav-btn ${activeTab === 'interviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('interviews')}
          >
            <HelpCircle size={15} /> Senior Interview STAR Answers
          </button>
          <button
            type="button"
            className={`about-nav-btn ${activeTab === 'cis' ? 'active' : ''}`}
            onClick={() => setActiveTab('cis')}
          >
            <Award size={15} /> CIS AWS Benchmark v3.0 Blueprint
          </button>
          <button
            type="button"
            className={`about-nav-btn ${activeTab === 'mission' ? 'active' : ''}`}
            onClick={() => setActiveTab('mission')}
          >
            <BookOpen size={15} /> The SeCloudive Mission
          </button>
        </div>
      </div>

      {/* Tab 1: Career Role Matrix */}
      {activeTab === 'matrix' && (
        <section className="career-matrix-section">
          <div className="section-head-card">
            <h3>Enterprise Cloud Security Specialization Matrix</h3>
            <p>Compare the 5 distinct career tracks in cloud security, their real daily operational responsibilities, core toolchains, and compensation benchmarks.</p>
          </div>

          <div className="roles-grid">
            {careerRoles.map((role, idx) => (
              <div className="role-card" key={idx}>
                <div className="role-card-header">
                  <div>
                    <span className="role-focus-badge">{role.focus}</span>
                    <h3>{role.role}</h3>
                  </div>
                  <strong className="role-salary">{role.salary}</strong>
                </div>

                <p className="role-desc">{role.description}</p>

                <div className="role-block">
                  <strong>Daily Operational Responsibilities:</strong>
                  <ul>
                    {role.dailyTasks.map((task, tIdx) => (
                      <li key={tIdx}><CheckCircle2 size={13} className="text-cyan" /> <span>{task}</span></li>
                    ))}
                  </ul>
                </div>

                <div className="role-footer-meta">
                  <div>
                    <small>PRIMARY TOOLCHAIN</small>
                    <div className="tool-chips">
                      {role.topTools.map(t => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                  <div>
                    <small>TARGET CERTIFICATIONS</small>
                    <div className="cert-chips">
                      {role.certifications.map(c => <span key={c}>{c}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 2: Interview Questions & STAR Models */}
      {activeTab === 'interviews' && (
        <section className="interviews-section">
          <div className="section-head-card">
            <h3>Top Cloud Security Engineer Interview Questions (STAR Method)</h3>
            <p>Hiring managers at FAANG, Fortune 500 banks, and top cyber firms evaluate candidate reasoning using the Situation-Task-Action-Result (STAR) model. Learn how to structure answers with technical precision.</p>
          </div>

          <div className="star-qa-list">
            {interviewQuestions.map((item, idx) => (
              <div className="star-card" key={idx}>
                <div className="star-q-head">
                  <span className="q-number">Q{idx + 1}</span>
                  <h4>{item.q}</h4>
                  <button
                    type="button"
                    className="btn-copy-sm"
                    onClick={() => handleCopyStar(`${item.q}\n\nSituation: ${item.starModel.situation}\nTask: ${item.starModel.task}\nAction: ${item.starModel.action}\nResult: ${item.starModel.result}`, idx)}
                  >
                    {copiedQ === idx ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                    <span>{copiedQ === idx ? 'Copied!' : 'Copy STAR Answer'}</span>
                  </button>
                </div>

                <div className="star-body-grid">
                  <div className="star-part part-s">
                    <strong>[S] SITUATION</strong>
                    <p>{item.starModel.situation}</p>
                  </div>
                  <div className="star-part part-t">
                    <strong>[T] TASK</strong>
                    <p>{item.starModel.task}</p>
                  </div>
                  <div className="star-part part-a">
                    <strong>[A] ACTION (TECHNICAL PROOF)</strong>
                    <p>{item.starModel.action}</p>
                  </div>
                  <div className="star-part part-r">
                    <strong>[R] RESULT & BUSINESS IMPACT</strong>
                    <p>{item.starModel.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 3: CIS Benchmark v3.0 */}
      {activeTab === 'cis' && (
        <section className="cis-section">
          <div className="section-head-card">
            <h3>CIS AWS Foundations Benchmark v3.0 Hardening Blueprint</h3>
            <p>The Center for Internet Security (CIS) AWS Foundations Benchmark is the globally recognized baseline for securing AWS environments. These controls are tested across every SeCloudive challenge and lab.</p>
          </div>

          <div className="cis-grid">
            {cisBenchmarks.map((bench, idx) => (
              <div className="cis-card" key={idx}>
                <div className="cis-head">
                  <Award size={18} className="text-cyan" />
                  <h4>{bench.section}</h4>
                </div>
                <ul className="cis-rules-list">
                  {bench.rules.map((rule, rIdx) => (
                    <li key={rIdx}>
                      <CheckCircle2 size={14} className="text-emerald" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 4: The SeCloudive Mission */}
      {activeTab === 'mission' && (
        <section className="mission-section">
          <div className="mission-manifesto-card">
            <span className="manifesto-eyebrow">THE SECLOUDIVE MANIFESTO</span>
            <h2>Why We Built This Platform</h2>
            <p>
              Traditional cybersecurity learning is broken. It teaches users to memorize multiple-choice answers for multiple-choice exams, or hands them pre-cooked "click Next" labs that require zero critical thinking.
            </p>
            <p>
              In real enterprise cloud environments, no alert arrives as a multiple-choice question. You are confronted with noisy CloudTrail logs, conflicting IAM policies, and active business stakeholders demanding zero downtime.
            </p>
            <p>
              <strong>SeCloudive changes the game:</strong> We put learners directly into the seat of an on-call Cloud Security Engineer. You triage the evidence, evaluate the trade-offs, map attacker blast radius, execute minute-0 containment, and defend your decisions with architectural proof.
            </p>

            <div className="manifesto-pillars-grid">
              <div className="pillar-box">
                <Terminal size={22} className="text-cyan" />
                <h4>Practice Over Theory</h4>
                <p>Real AWS CLI syntax, raw GuardDuty alerts, and authentic CloudTrail event telemetry.</p>
              </div>
              <div className="pillar-box">
                <Briefcase size={22} className="text-purple" />
                <h4>Job-Ready Reasoning</h4>
                <p>Think in terms of blast radius, business availability, and defensible least privilege.</p>
              </div>
              <div className="pillar-box">
                <ShieldCheck size={22} className="text-emerald" />
                <h4>Defensible Architecture</h4>
                <p>Move beyond temporary fixes: codify permanent solutions into hardened Terraform IaC.</p>
              </div>
            </div>

            <div className="manifesto-cta">
              <Link to="/playbooks" className="button button-primary">
                Launch Job Playbook Engine <ArrowRight size={16} />
              </Link>
              <Link to="/labs" className="button button-ghost">
                Explore 16 Hands-on Labs
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
