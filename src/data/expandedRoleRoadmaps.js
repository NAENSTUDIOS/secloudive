// ============================================================================
// SeCloudive Master Role-Specific Career Roadmaps (All 11 Industry Roles)
// Complete learning order, required skills, labs, investigations, and milestones
// ============================================================================

export const ROLE_ROADMAPS = [
  {
    id: 'soc-analyst',
    title: 'SOC Analyst (Cloud Tier 1/2)',
    category: 'Security Operations & Triage',
    seniorityLevel: 'Entry to Mid',
    summary: 'Triages live SIEM alerts, correlates CloudTrail and VPC Flow Logs, investigates GuardDuty findings, and initiates first-response containment.',
    salaryRange: '$75,000 - $115,000',
    coreSkills: [
      'CloudTrail Event Inspection & Filtering',
      'Amazon GuardDuty Alert Prioritization',
      'Athena SQL Telemetry Querying',
      'VPC Flow Log Analysis (ACCEPT vs REJECT)',
      'Basic Incident Containment (Access Key Inactivation)'
    ],
    requiredServices: ['AWS CloudTrail', 'Amazon GuardDuty', 'Amazon VPC', 'Amazon Athena', 'AWS Security Hub', 'AWS IAM'],
    certifications: [
      { name: 'AWS Certified Security - Specialty', priority: 'High' },
      { name: 'CompTIA Security+', priority: 'Foundation' }
    ],
    learningOrder: [
      { step: 1, title: 'AWS Cloud Fundamentals & Shared Responsibility', duration: '2 Weeks' },
      { step: 2, title: 'Logging & Telemetry Pipeline (CloudTrail, VPC Flow Logs, S3 Access Logs)', duration: '3 Weeks' },
      { step: 3, title: 'Threat Detection with GuardDuty & Security Hub', duration: '3 Weeks' },
      { step: 4, title: 'Real-Time Athena Forensic Triage & Querying', duration: '3 Weeks' },
      { step: 5, title: 'First-Responder Containment Playbooks', duration: '3 Weeks' }
    ],
    recommendedLabs: [
      'SAFE-LAB-001 (Building Automated IAM Permission Boundaries)',
      'SAFE-LAB-003 (Enforcing S3 Account-Level Block Public Access)',
      'SAFE-LAB-004 (Provisioning VPC Flow Logs to S3 and Querying via Athena)',
      'SAFE-LAB-005 (Simulating GuardDuty Findings & Automating Instant Quarantine)'
    ],
    recommendedInvestigations: [
      'INC-IAM-001 (AdministratorAccess Granted to Contractor)',
      'INC-S3-002 (Patient Diagnostic S3 Vault Publicly Exposed)',
      'INC-NET-003 (Security Group Ingress 0.0.0.0/0 on Port 22 SSH)'
    ],
    portfolioProjects: [
      'Serverless CloudTrail Athena Triage Dashboard with QuickSight',
      'Automated GuardDuty High-Severity Telegram/Slack Dispatcher'
    ],
    interviewMilestones: [
      'Explain the difference between CloudTrail Management Events and S3 Data Events.',
      'Walk through how you investigate an UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration alert.',
      'Demonstrate how to isolate a compromised EC2 instance without rebooting or destroying evidence.'
    ]
  },

  {
    id: 'soc-engineer',
    title: 'SOC Engineer / Detection Engineer',
    category: 'Security Operations & Automation',
    seniorityLevel: 'Mid to Senior',
    summary: 'Builds and automates detection pipelines, writes custom SIEM correlation rules, and integrates SOAR playbooks using EventBridge and Lambda.',
    salaryRange: '$120,000 - $165,000',
    coreSkills: [
      'Custom EventBridge Rule Authoring',
      'Python Boto3 Security Automation',
      'Sigma / YARA Rule Translation to CloudTrail',
      'Amazon Security Lake & OpenSearch Integration',
      'SOAR Automated Remediation Engineering'
    ],
    requiredServices: ['Amazon EventBridge', 'AWS Lambda', 'Amazon OpenSearch', 'Amazon Security Lake', 'Amazon GuardDuty', 'AWS Systems Manager'],
    certifications: [
      { name: 'AWS Certified Security - Specialty', priority: 'Immediate' },
      { name: 'SANS SEC541 (Cloud Security Monitoring & Detection)', priority: 'Career Long' }
    ],
    learningOrder: [
      { step: 1, title: 'Advanced Cloud Architecture & Network Topologies', duration: '2 Weeks' },
      { step: 2, title: 'Event-Driven Detection Engineering with EventBridge', duration: '3 Weeks' },
      { step: 3, title: 'Building Automated SOAR Workflows with Lambda & Step Functions', duration: '4 Weeks' },
      { step: 4, title: 'Centralizing Security Telemetry with Amazon Security Lake', duration: '3 Weeks' },
      { step: 5, title: 'Detection-as-Code (DaC) with Terraform & CI/CD', duration: '3 Weeks' }
    ],
    recommendedLabs: [
      'SAFE-LAB-005 (Automating Instant Quarantine via EventBridge & Lambda)',
      'SAFE-LAB-008 (KMS Customer Managed Key Envelope Encryption)'
    ],
    recommendedInvestigations: [
      'INC-MON-001 (CloudTrail Trail Stopped & Multi-Region Deletion)',
      'INC-DEV-001 (GitHub Actions AWS OIDC Role Hijacking)'
    ],
    portfolioProjects: [
      'Enterprise AWS SOAR Pipeline: Instant Token Revocation on Compromise',
      'Detection-as-Code Repository: 50+ Custom EventBridge Rules for High-Risk CloudTrail Calls'
    ],
    interviewMilestones: [
      'How do you engineer a detection pipeline that suppresses false positives while meeting sub-5 second SLA?',
      'Explain how Amazon Security Lake normalizes OCSF telemetry across multi-cloud environments.',
      'Write a Boto3 script that quarantines an EC2 instance by attaching an isolated security group.'
    ]
  },

  {
    id: 'security-analyst',
    title: 'Security Analyst (Governance, Risk & Posture)',
    category: 'Security Compliance & Governance',
    seniorityLevel: 'Entry to Mid',
    summary: 'Monitors cloud compliance posture, conducts CIS benchmark audits, tracks vulnerability remediation SLAs, and verifies evidence for SOC 2 and ISO 27001.',
    salaryRange: '$85,000 - $125,000',
    coreSkills: [
      'AWS Security Hub Posture Management (CSPM)',
      'AWS Config Conformance Packs Deployment',
      'CIS AWS Foundations Benchmark v3.0 Auditing',
      'Cloud Risk Assessment & SLA Tracking',
      'IAM Credential Report & Access Auditing'
    ],
    requiredServices: ['AWS Security Hub', 'AWS Config', 'AWS Audit Manager', 'AWS IAM Access Analyzer', 'Amazon Inspector'],
    certifications: [
      { name: 'AWS Certified Security - Specialty', priority: 'High' },
      { name: 'CISA (Certified Information Systems Auditor)', priority: 'Moderate' }
    ],
    learningOrder: [
      { step: 1, title: 'Cloud Security Frameworks (NIST CSF, CIS, ISO 27001)', duration: '2 Weeks' },
      { step: 2, title: 'AWS Config Rules & Automated Compliance Baselines', duration: '3 Weeks' },
      { step: 3, title: 'AWS Security Hub Multi-Account Posture Scoring', duration: '3 Weeks' },
      { step: 4, title: 'Vulnerability Management with Amazon Inspector', duration: '2 Weeks' },
      { step: 5, title: 'Audit Evidence Generation with AWS Audit Manager', duration: '2 Weeks' }
    ],
    recommendedLabs: [
      'SAFE-LAB-001 (IAM Permission Boundaries)',
      'SAFE-LAB-003 (S3 Block Public Access & TLS Policies)',
      'SAFE-LAB-006 (Terraform Checkov Compliance Guardrails)'
    ],
    recommendedInvestigations: [
      'INC-S3-003 (Public S3 Bucket via CloudFormation Parameter Drift)',
      'INC-IAM-004 (Shadow Admin Persistence via LoginProfile)'
    ],
    portfolioProjects: [
      'Multi-Account CIS Benchmark Posture Dashboard with AWS Config',
      'Automated Vulnerability SLA Escalation System with Amazon EventBridge'
    ],
    interviewMilestones: [
      'What are the primary differences between AWS Config managed rules and custom Lambda rules?',
      'How do you measure and report Cloud Security Posture Management (CSPM) drift to executive leadership?',
      'Explain the key requirements of CIS AWS Foundations Benchmark Control 1.4 (IAM Root MFA).'
    ]
  },

  {
    id: 'cloud-security-analyst',
    title: 'Cloud Security Analyst',
    category: 'Cloud Security Operations',
    seniorityLevel: 'Mid',
    summary: 'Dedicated analyst bridging SecOps and cloud engineering. Handles day-to-day cloud ticket queues, S3 bucket permissions, IAM role requests, and cloud security exceptions.',
    salaryRange: '$95,000 - $135,000',
    coreSkills: [
      'IAM Policy Review & Scoping (Least Privilege)',
      'VPC Security Group & NACL Ingress Auditing',
      'S3 Bucket Policy Review & KMS Key Governance',
      'WAF Rule Tuning & Web Application Triage',
      'CloudTrail Investigation via Athena'
    ],
    requiredServices: ['AWS IAM', 'Amazon S3', 'Amazon VPC', 'AWS WAF', 'AWS CloudTrail', 'Amazon GuardDuty'],
    certifications: [
      { name: 'AWS Certified Security - Specialty', priority: 'High' },
      { name: 'AWS Solutions Architect - Associate', priority: 'Prerequisite' }
    ],
    learningOrder: [
      { step: 1, title: 'Deep IAM Policy Evaluation Logic & Effective Permissions', duration: '3 Weeks' },
      { step: 2, title: 'VPC Network Security & Security Group Auditing', duration: '3 Weeks' },
      { step: 3, title: 'S3 Data Security, Object Locking & KMS Governance', duration: '3 Weeks' },
      { step: 4, title: 'Web Perimeter Defense with AWS WAF & Shield', duration: '2 Weeks' },
      { step: 5, title: 'Incident Triage & Forensic CloudTrail Analysis', duration: '3 Weeks' }
    ],
    recommendedLabs: [
      'SAFE-LAB-001 (IAM Permission Boundaries)',
      'SAFE-LAB-002 (Cross-Account ExternalId)',
      'SAFE-LAB-004 (VPC Flow Logs & Athena)'
    ],
    recommendedInvestigations: [
      'INC-IAM-002 (PassRole Abuse via EC2 UserData)',
      'INC-NET-002 (IMDSv1 SSRF Extraction of EC2 IAM Role)'
    ],
    portfolioProjects: [
      'Automated Least-Privilege IAM Policy Generator based on CloudTrail Usage',
      'VPC Security Group 0.0.0.0/0 Automated Triage & Remediation Engine'
    ],
    interviewMilestones: [
      'How does AWS evaluate an explicit Deny vs an implicit Deny in a multi-policy context?',
      'What happens when an SCP allows an action but the identity-based policy denies it?',
      'Walk through how you investigate a suspicious S3 bucket data download.'
    ]
  },

  {
    id: 'cloud-security-engineer',
    title: 'Cloud Security Engineer',
    category: 'Engineering & Automation',
    seniorityLevel: 'Mid to Senior',
    summary: 'Designs, implements, and maintains cloud security architecture, landing zones, SCPs, automated self-healing guardrails, and cryptographic controls.',
    salaryRange: '$135,000 - $185,000',
    coreSkills: [
      'AWS Organizations Service Control Policies (SCPs)',
      'Infrastructure as Code (Terraform) Security Modules',
      'IAM Permission Boundaries & Session Policies (ABAC)',
      'KMS Multi-Region Customer Managed Keys & BYOK',
      'Centralized Transit Gateway & Network Firewall Architecture',
      'Automated Remediation with Python Boto3 & SSM'
    ],
    requiredServices: ['AWS Organizations', 'AWS IAM', 'AWS KMS', 'AWS Transit Gateway', 'AWS Network Firewall', 'AWS Control Tower', 'Terraform'],
    certifications: [
      { name: 'AWS Certified Security - Specialty', priority: 'Immediate' },
      { name: 'AWS Certified Solutions Architect - Professional', priority: 'High' }
    ],
    learningOrder: [
      { step: 1, title: 'Multi-Account Landing Zone Architecture & Organizations SCPs', duration: '4 Weeks' },
      { step: 2, title: 'Advanced Cryptographic Engineering with AWS KMS & CloudHSM', duration: '3 Weeks' },
      { step: 3, title: 'Enterprise Transit Gateway & Network Inspection Hubs', duration: '4 Weeks' },
      { step: 4, title: 'Automated Compliance Guardrails with Terraform & Checkov', duration: '3 Weeks' },
      { step: 5, title: 'Zero-Trust IAM Architectures with ABAC & Identity Center', duration: '3 Weeks' }
    ],
    recommendedLabs: [
      'SAFE-LAB-001 (IAM Permission Boundaries)',
      'SAFE-LAB-006 (Terraform Checkov Guardrails)',
      'SAFE-LAB-007 (EKS Pod Identity Least Privilege)',
      'SAFE-LAB-008 (Lambda Private VPC Endpoints)'
    ],
    recommendedInvestigations: [
      'INC-IAM-001 (AdministratorAccess Abuse)',
      'INC-NET-001 (Security Group SSH Lateral Movement)',
      'INC-ORG-002 (Transit Gateway Route Table Poisoning)'
    ],
    portfolioProjects: [
      'Production-Ready Multi-Account Landing Zone with 20+ Defensive SCPs in Terraform',
      'Enterprise AWS Network Firewall Inspection Hub with Suricata Rules'
    ],
    interviewMilestones: [
      'Architect a centralized egress inspection hub using AWS Network Firewall and Transit Gateway.',
      'How do you design an SCP that restricts resource deployment strictly to approved regions while allowing global services like IAM and Route 53?',
      'How does AWS KMS envelope encryption operate under the hood, and how do you protect against CMK deletion?'
    ]
  },

  {
    id: 'devsecops-engineer',
    title: 'DevSecOps Engineer',
    category: 'CI/CD & Pipeline Security',
    seniorityLevel: 'Mid to Senior',
    summary: 'Integrates security scanning into developer workflows. Secures CI/CD pipelines, container registries, Terraform code, and enforces secrets management.',
    salaryRange: '$130,000 - $180,000',
    coreSkills: [
      'Static Application Security Testing (SAST) in GitHub Actions',
      'Infrastructure as Code Scanning (Checkov, tfsec, trivy)',
      'AWS IAM OIDC GitHub Actions / GitLab CI Integration',
      'Container Image Security & ECR Enhanced Scanning',
      'Software Supply Chain Security (SLSA, SBOM, Cosign)',
      'Secrets Management & Dynamic Rotation (AWS Secrets Manager)'
    ],
    requiredServices: ['AWS IAM OIDC', 'Amazon ECR', 'AWS CodeBuild', 'AWS CodePipeline', 'AWS Secrets Manager', 'GitHub Actions', 'Terraform'],
    certifications: [
      { name: 'AWS Certified DevOps Engineer - Professional', priority: 'High' },
      { name: 'AWS Certified Security - Specialty', priority: 'High' }
    ],
    learningOrder: [
      { step: 1, title: 'Secure CI/CD Architecture with Passwordless AWS OIDC', duration: '2 Weeks' },
      { step: 2, title: 'Static Infrastructure as Code Security with Checkov & Trivy', duration: '3 Weeks' },
      { step: 3, title: 'Container Image Hardening, Distroless & ECR Enhanced Scanning', duration: '3 Weeks' },
      { step: 4, title: 'Automated Dynamic Secret Rotation with Secrets Manager & Lambda', duration: '3 Weeks' },
      { step: 5, title: 'Supply Chain Security: SBOM Generation & Signature Verification', duration: '3 Weeks' }
    ],
    recommendedLabs: [
      'SAFE-LAB-006 (Terraform Checkov Pipeline)',
      'SAFE-LAB-007 (EKS Pod Identity Associations)',
      'SAFE-LAB-008 (Lambda Private VPC Endpoints)'
    ],
    recommendedInvestigations: [
      'INC-DEV-001 (GitHub Actions AWS OIDC Role Hijacking)',
      'INC-DEV-002 (Terraform State File Database Password Leak)',
      'INC-SRV-002 (Malicious Lambda Layer Supply Chain)'
    ],
    portfolioProjects: [
      'End-to-End Zero-Trust GitHub Actions Pipeline with AWS OIDC, Checkov, and Cosign Verification',
      'Automated Secrets Manager RDS Password Rotation Lambda Engine'
    ],
    interviewMilestones: [
      'How does AWS IAM OIDC federation with GitHub Actions eliminate long-lived AWS access keys in CI/CD?',
      'What are the primary security risks of Terraform remote state files in S3 and how do you mitigate them?',
      'How do you enforce signed container image admission in Amazon EKS?'
    ]
  },

  {
    id: 'security-architect',
    title: 'Cloud Security Architect',
    category: 'Architecture & Strategy',
    seniorityLevel: 'Senior to Principal',
    summary: 'Defines the overall cloud security vision, threat models enterprise platforms, evaluates vendor risks, and aligns architectures with the AWS Well-Architected Framework.',
    salaryRange: '$175,000 - $245,000+',
    coreSkills: [
      'AWS Well-Architected Security Pillar Reviews',
      'Threat Modeling (STRIDE, DREAD, Attack Trees)',
      'Multi-Region Zero-Trust Network Architecture',
      'Cryptographic Boundary Design & CloudHSM',
      'Enterprise Landing Zone Governance (Control Tower)',
      'Executive Risk Communication & Board Presentations'
    ],
    requiredServices: ['AWS Organizations', 'AWS Control Tower', 'AWS KMS', 'AWS Network Firewall', 'AWS Transit Gateway', 'AWS IAM Identity Center'],
    certifications: [
      { name: 'AWS Certified Solutions Architect - Professional', priority: 'Immediate' },
      { name: 'AWS Certified Security - Specialty', priority: 'Immediate' },
      { name: 'CISSP (Certified Information Systems Security Professional)', priority: 'Career Long' }
    ],
    learningOrder: [
      { step: 1, title: 'Enterprise Threat Modeling Methodology & Systemic Risk', duration: '3 Weeks' },
      { step: 2, title: 'Global Multi-Account Landing Zone Strategy & Boundary Segregation', duration: '4 Weeks' },
      { step: 3, title: 'Zero-Trust Architecture for Cloud Workloads (NIST SP 800-207)', duration: '4 Weeks' },
      { step: 4, title: 'Cryptographic Architecture: BYOK, HYOK, CloudHSM, and Post-Quantum Prep', duration: '3 Weeks' },
      { step: 5, title: 'Executive Governance, Board Reporting, and Regulatory Strategy', duration: '3 Weeks' }
    ],
    recommendedLabs: [
      'SAFE-LAB-001 (IAM Boundaries)',
      'SAFE-LAB-004 (VPC Flow Logs & Athena)',
      'SAFE-LAB-007 (EKS Pod Identity)',
      'SAFE-LAB-008 (Lambda Private VPC Endpoints)'
    ],
    recommendedInvestigations: [
      'INC-ORG-001 (SCP Bypass via Root Credential Recovery)',
      'INC-IAM-003 (Cross-Account AssumeRole Confused Deputy)'
    ],
    portfolioProjects: [
      'Enterprise Well-Architected Security Review Report for Tier-1 FinTech Platform',
      'Global Zero-Trust Multi-Account Cloud Architecture Blueprint with Threat Model'
    ],
    interviewMilestones: [
      'Present a comprehensive threat model for a multi-tenant SaaS application storing PCI/HIPAA data on AWS.',
      'How do you design an enterprise AWS network that prevents data exfiltration without throttling microservice throughput?',
      'How do you balance developer agility with stringent security guardrails in a 5,000-engineer organization?'
    ]
  },

  {
    id: 'security-consultant',
    title: 'Cloud Security Consultant',
    category: 'Advisory & Professional Services',
    seniorityLevel: 'Mid to Senior',
    summary: 'Advises enterprise clients on cloud security migrations, maturity assessments, gap analyses, and prepares organizations for IPO, M&A, and SOC 2 audits.',
    salaryRange: '$130,000 - $190,000',
    coreSkills: [
      'Cloud Security Maturity Modeling (CSMM)',
      'Client Stakeholder Interviewing & Scoping',
      'Gap Analysis against SOC 2, HIPAA, ISO 27001',
      'Architecture Review & Executive Deliverables',
      'Remediation Roadmap Prioritization (Impact vs Effort)'
    ],
    requiredServices: ['AWS Security Hub', 'AWS Audit Manager', 'AWS Config', 'AWS Trusted Advisor', 'AWS Well-Architected Tool'],
    certifications: [
      { name: 'AWS Certified Security - Specialty', priority: 'High' },
      { name: 'CCSP (Certified Cloud Security Professional)', priority: 'High' }
    ],
    learningOrder: [
      { step: 1, title: 'Consulting Methodology: Discovery, Gap Analysis, Roadmap', duration: '3 Weeks' },
      { step: 2, title: 'AWS Well-Architected Framework Assessment Delivery', duration: '3 Weeks' },
      { step: 3, title: 'Compliance Mapping: SOC 2, HIPAA, PCI-DSS to AWS Controls', duration: '3 Weeks' },
      { step: 4, title: 'Technical Writing: Executive Summaries & Board Readouts', duration: '2 Weeks' },
      { step: 5, title: 'M&A Cloud Diligence: Inspecting Inherited AWS Accounts', duration: '3 Weeks' }
    ],
    recommendedLabs: [
      'SAFE-LAB-001 (IAM Boundaries)',
      'SAFE-LAB-003 (S3 Block Public Access)',
      'SAFE-LAB-006 (Terraform Checkov)'
    ],
    recommendedInvestigations: [
      'INC-S3-002 (Patient Diagnostic S3 Vault Publicly Exposed)',
      'INC-DEV-002 (Terraform State Plaintext Secrets)'
    ],
    portfolioProjects: [
      'Comprehensive Cloud Security Assessment & Gap Analysis for Series B Startup',
      'M&A Cloud Risk Due Diligence Audit Playbook'
    ],
    interviewMilestones: [
      'How do you prioritize 100+ Security Hub findings for a client with limited engineering bandwidth?',
      'How do you convince an engineering VP that an architectural security redesign is worth delaying feature releases?',
      'Deliver a simulated 10-minute executive summary of a critical AWS security review.'
    ]
  },

  {
    id: 'threat-hunter',
    title: 'Cloud Threat Hunter',
    category: 'Proactive Threat Intelligence',
    seniorityLevel: 'Senior',
    summary: 'Proactively scours telemetry for advanced persistent threats (APTs), zero-days, and subtle anomalies that evade automated GuardDuty and SIEM alerts.',
    salaryRange: '$140,000 - $195,000',
    coreSkills: [
      'Hypothesis-Driven Threat Hunting Methodology',
      'Advanced Athena / SQL Behavioral Analytics',
      'MITRE ATT&CK Cloud Matrix TTP Mapping',
      'DNS & VPC Flow Log Anomaly Detection',
      'Memory & Disk Forensics in Amazon EC2 (Volatility)',
      'Threat Intelligence Correlation (VirusTotal, AlienVault)'
    ],
    requiredServices: ['AWS CloudTrail', 'Amazon Athena', 'Amazon Route 53 Resolver', 'Amazon VPC', 'Amazon GuardDuty', 'AWS Detective'],
    certifications: [
      { name: 'SANS SEC541 / FOR509 (Enterprise Cloud Forensics)', priority: 'Immediate' },
      { name: 'AWS Certified Security - Specialty', priority: 'High' }
    ],
    learningOrder: [
      { step: 1, title: 'Threat Actor TTPs in Cloud Environments (MITRE ATT&CK Cloud)', duration: '3 Weeks' },
      { step: 2, title: 'Hypothesis Formulation & Large-Scale Athena Telemetry Hunting', duration: '4 Weeks' },
      { step: 3, title: 'Deep Packet & Route 53 DNS Anomaly Analysis', duration: '3 Weeks' },
      { step: 4, title: 'EC2 Volatile Memory Acquisition & Forensic Snapshotting', duration: '3 Weeks' },
      { step: 5, title: 'Investigating Multi-Account Graph Topology with AWS Detective', duration: '3 Weeks' }
    ],
    recommendedLabs: [
      'SAFE-LAB-004 (VPC Flow Logs & Athena)',
      'SAFE-LAB-005 (GuardDuty Simulation)'
    ],
    recommendedInvestigations: [
      'INC-NET-003 (DNS Tunneling via Route 53 Resolver)',
      'INC-IAM-004 (Shadow Admin Persistence via LoginProfile)',
      'INC-K8S-001 (EKS Pod Breakout via Privileged Container)'
    ],
    portfolioProjects: [
      'Cloud Threat Hunting Runbook: 25 Athena SQL Hypotheses for Living-off-the-Cloud TTPs',
      'Automated Forensic Snapshot Acquisition Engine with AWS Lambda'
    ],
    interviewMilestones: [
      'How do you formulate a threat hunt hypothesis when SIEM alerts show zero active incidents?',
      'Walk through how you detect DNS tunneling through Route 53 Resolver using query logs.',
      'How do you extract volatile memory from a running Linux EC2 instance without altering disk state?'
    ]
  },

  {
    id: 'incident-responder',
    title: 'Cloud Incident Responder (CIRT / CSIRT)',
    category: 'Emergency Response & Forensics',
    seniorityLevel: 'Mid to Senior',
    summary: 'Leads emergency containment during active data breaches, ransomware outbreaks, and account takeovers. Preserves legal evidence and directs recovery.',
    salaryRange: '$135,000 - $190,000',
    coreSkills: [
      'Rapid Tactical Containment (STS Revocation, Security Group Isolation)',
      'Forensic EBS Snapshot Isolation & Memory Capture',
      'Chain-of-Custody & Evidence Preservation',
      'Root Cause Analysis (RCA) & Post-Mortem Authoring',
      'AWS CloudTrail Forensic Reconstruction under Pressure'
    ],
    requiredServices: ['AWS CloudTrail', 'AWS IAM', 'Amazon EC2', 'AWS Systems Manager', 'AWS KMS', 'AWS Backup'],
    certifications: [
      { name: 'AWS Certified Security - Specialty', priority: 'Immediate' },
      { name: 'GCIH (GIAC Certified Incident Handler)', priority: 'High' }
    ],
    learningOrder: [
      { step: 1, title: 'Incident Response Lifecycle (NIST SP 800-61 / ISO 27035)', duration: '2 Weeks' },
      { step: 2, title: 'Minute-0 Cloud Containment Strategies (Network, Identity, Data)', duration: '4 Weeks' },
      { step: 3, title: 'Cloud Forensic Imaging & Memory Dumps (EBS Snapshots, LiME)', duration: '3 Weeks' },
      { step: 4, title: 'Post-Mortem Root Cause Analysis & Timeline Construction', duration: '3 Weeks' },
      { step: 5, title: 'Legal & Regulatory Breach Disclosure Guidelines (GDPR, SEC 4-Day Rule)', duration: '2 Weeks' }
    ],
    recommendedLabs: [
      'SAFE-LAB-001 (IAM Boundaries)',
      'SAFE-LAB-004 (VPC Flow Logs & Athena)',
      'SAFE-LAB-005 (GuardDuty Remediation)'
    ],
    recommendedInvestigations: [
      'INC-IAM-001 (Contractor AdministratorAccess Compromise)',
      'INC-S3-001 (Presigned URL Mass Exfiltration)',
      'INC-MON-001 (CloudTrail Trail Stopped)'
    ],
    portfolioProjects: [
      'Enterprise AWS Incident Response Runbook with One-Click Containment CLI',
      'Automated Forensic Sandbox: Isolated Account EC2 Image Analysis Engine'
    ],
    interviewMilestones: [
      'An attacker is actively exfiltrating data from an S3 bucket right now. What are your first three actions in the first 5 minutes?',
      'How do you revoke active STS sessions for a compromised IAM role without breaking legitimate microservices?',
      'How do you maintain chain-of-custody when capturing an EBS snapshot for law enforcement?'
    ]
  },

  {
    id: 'cloud-architect',
    title: 'Cloud Solutions Architect (Security Focused)',
    category: 'Holistic Cloud Architecture',
    seniorityLevel: 'Senior to Principal',
    summary: 'Architects enterprise multi-region cloud infrastructures balancing security, high availability, disaster recovery, and cost efficiency.',
    salaryRange: '$165,000 - $230,000+',
    coreSkills: [
      'AWS Well-Architected Framework (All 6 Pillars)',
      'Multi-Region Active-Active & Pilot Light DR',
      'High-Throughput Transit Gateway Peering & Direct Connect',
      'Cost Governance & FinOps Security Alignment',
      'Container & Serverless Enterprise Reference Architectures'
    ],
    requiredServices: ['Amazon Route 53', 'AWS Transit Gateway', 'Amazon Aurora Global Database', 'AWS Lambda', 'Amazon EKS', 'AWS Organizations'],
    certifications: [
      { name: 'AWS Certified Solutions Architect - Professional', priority: 'Immediate' },
      { name: 'AWS Certified Security - Specialty', priority: 'High' }
    ],
    learningOrder: [
      { step: 1, title: 'Enterprise Network Architecture & Global Resiliency', duration: '4 Weeks' },
      { step: 2, title: 'Data Tier Architecture: Aurora Global Databases & DynamoDB Global Tables', duration: '3 Weeks' },
      { step: 3, title: 'Zero-Downtime Multi-Region Disaster Recovery Strategy (RTO/RPO)', duration: '4 Weeks' },
      { step: 4, title: 'Security Architecture Integration across Microservices & Containers', duration: '3 Weeks' },
      { step: 5, title: 'FinOps: Optimizing Architecture Spend without Sacrificing Security', duration: '3 Weeks' }
    ],
    recommendedLabs: [
      'SAFE-LAB-004 (VPC Flow Logs & Athena)',
      'SAFE-LAB-007 (EKS Pod Identity)',
      'SAFE-LAB-008 (Lambda Private VPC Endpoints)'
    ],
    recommendedInvestigations: [
      'INC-NET-001 (Port 22 SSH Lateral Pivot)',
      'INC-ORG-002 (Transit Gateway Route Table Poisoning)'
    ],
    portfolioProjects: [
      'Multi-Region Active-Active Resilient Architecture with Route 53 ARC and Aurora Global DB',
      'FinOps Security Optimization Framework: Reducing Cloud Spend by 35% with Zero Security Compromise'
    ],
    interviewMilestones: [
      'How do you design a zero-downtime multi-region active-active architecture on AWS with sub-second data replication?',
      'Explain how Route 53 Application Recovery Controller (ARC) prevents routing traffic to impaired regions.',
      'How do you architect a secure hybrid cloud connection between on-premises VMware and AWS VPCs?'
    ]
  }
];

export default ROLE_ROADMAPS;
