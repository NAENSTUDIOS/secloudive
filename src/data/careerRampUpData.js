/**
 * SeCloudive Career Ramp-Up Guides & Comprehensive Labs Directory
 * Authoritative hands-on labs with original links, step-by-step execution guides,
 * and "What You Have Learnt" skill competencies for every Cloud Role, TryHackMe,
 * HackTheBox, and Core Foundations (Linux, Python, Networking, Docker, IaC).
 */

export const rampUpCategories = [
  { id: 'all', label: 'All Modules' },
  { id: 'cloud-roles', label: 'Cloud Roles & Ramp-Up' },
  { id: 'google-cloud', label: 'Google Cloud Ramp-Up' },
  { id: 'azure-cloud', label: 'Microsoft Azure Ramp-Up' },
  { id: 'tryhackme', label: 'TryHackMe Cloud' },
  { id: 'hackthebox', label: 'HackTheBox Cloud' },
  { id: 'roadmap-90', label: '90-Day Cloud Roadmap' },
  { id: 'linux', label: 'Linux Foundations' },
  { id: 'python', label: 'Python Automation' },
  { id: 'networking', label: 'Cloud Networking' },
  { id: 'docker', label: 'Docker & Containers' },
  { id: 'iac', label: 'IaC & Terraform' },
]

/**
 * Authoritative Official Ramp-Up Guide PDFs & Industry Whitepapers
 * Direct links hosted on official AWS CDN, Google Cloud, Microsoft Learn, TryHackMe & ZeroToCloud.
 */
export const officialRampUpPdfs = [
  {
    id: 'pdf-gcp-security-rampup',
    title: 'Google Cloud Ramp-Up Guide: Security, Identity and Compliance',
    roleTag: 'Google Cloud Security Engineer (PCSE)',
    publisher: 'Google Cloud Training & Certification',
    officialPdfUrl: 'https://cloud.google.com/security',
    badgeTone: 'cyan',
    badgeText: 'Google Official Guide',
    pageCount: '2 Pages (Curated Ramp-Up)',
    domainsCovered: [
      'Cloud IAM & Workload Identity Federation',
      'Threat Detection & Security Command Center (SCC)',
      'Data Protection & KMS/Sensitive Data Protection (DLP)',
      'Infrastructure & GKE Container Hardening',
      'Assured Workloads & Compliance Offerings',
      'Professional Cloud Security Engineer (PCSE) Track'
    ],
    summary: 'The authoritative Google Cloud Ramp-Up guide detailing skills.google paths, Chronicle SecOps, KMS envelope encryption, VPC Service Controls, and the PCSE certification journey.'
  },
  {
    id: 'pdf-azure-security-rampup',
    title: 'Microsoft Learn Ramp-Up Guide: Security, Identity and Compliance',
    roleTag: 'Azure & AI Security Engineer (SC-500 / SC-200)',
    publisher: 'Microsoft Learn',
    officialPdfUrl: 'https://learn.microsoft.com/security',
    badgeTone: 'purple',
    badgeText: 'Microsoft Learn Guide',
    pageCount: '2 Pages (Curated Ramp-Up)',
    domainsCovered: [
      'Microsoft Entra ID & PIM Governance',
      'Microsoft Sentinel SIEM & Defender XDR',
      'Azure Key Vault & Purview Data Governance',
      'Network Security Groups & Azure Firewall',
      'Microsoft Cloud Security Benchmark (MCSB)',
      'SC-500 Cloud & AI Security Engineer (Replaces AZ-500)'
    ],
    summary: 'Authoritative Microsoft Learn curriculum detailing Entra ID, Microsoft Sentinel threat hunting, Defender for Cloud, Key Vault, Purview compliance, and the new SC-500 Cloud and AI Security Engineer transition track.'
  },
  {
    id: 'pdf-tryhackme-rampup',
    title: 'TryHackMe Ramp-Up Guide: Offensive & Defensive Security',
    roleTag: 'Hands-On Cyber & SOC Security',
    publisher: 'TryHackMe Learning Platform',
    officialPdfUrl: 'https://tryhackme.com/paths',
    badgeTone: 'rose',
    badgeText: 'TryHackMe Official Guide',
    pageCount: '2 Pages (Curated Ramp-Up)',
    domainsCovered: [
      'Pre Security & Complete Beginner Foundations',
      'Cyber Security 101 Track',
      'SOC Level 1 & Splunk Threat Detection',
      'Jr Penetration Tester & Web Exploitation',
      'CompTIA Security+ SY0-701 & PenTest+',
      'SEC1 / SAL1 / PT1 Certification Exams'
    ],
    summary: 'The authoritative browser-based hands-on cyber security ramp-up guide covering foundational networking/Linux, defensive SOC investigation, offensive penetration testing, and TryHackMe capstone certifications.'
  },
  {
    id: 'pdf-90day-cloud-roadmap',
    title: '90-Day Cloud Engineer Roadmap (Zero to Cloud)',
    roleTag: 'Associate to Professional Cloud Engineer',
    publisher: 'ZeroToCloud.co',
    officialPdfUrl: 'https://zerotocloud.co',
    badgeTone: 'emerald',
    badgeText: 'ZeroToCloud Official Roadmap',
    pageCount: '3 Pages (Month 1-3 Progression)',
    domainsCovered: [
      'Month 1: Tech Foundations (Linux, Net, Docker, Terraform, Python)',
      'Month 2: High-Quality Cloud Projects (Beginner & Intermediate)',
      'Month 3: Portfolio, STAR Interview Defense & Job Hunt'
    ],
    summary: 'Structured 3-month action plan transitioning beginners into job-ready Cloud Engineers: Month 1 Tech Foundations, Month 2 Project Building, and Month 3 Technical Interview & Portfolio Defense.'
  },
  {
    id: 'pdf-security',
    title: 'AWS Ramp-Up Guide: Security',
    roleTag: 'Cloud Security / SecOps',
    publisher: 'AWS Training & Certification',
    officialPdfUrl: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Ramp-Up_Guide_Security.pdf',
    badgeTone: 'cyan',
    badgeText: 'AWS Official PDF',
    pageCount: '12 Pages',
    domainsCovered: ['Identity & Access Management', 'Detection & GuardDuty', 'Infrastructure Protection', 'Data Protection & KMS', 'Incident Response'],
    summary: 'The authoritative AWS curriculum detailing foundational to advanced security courses, whitepapers, self-paced labs, and certification roadmaps for Cloud Security Engineers.'
  },
  {
    id: 'pdf-architect',
    title: 'AWS Ramp-Up Guide: Architect',
    roleTag: 'Solutions Architect',
    publisher: 'AWS Training & Certification',
    officialPdfUrl: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Ramp-Up_Guide_Architect.pdf',
    badgeTone: 'purple',
    badgeText: 'AWS Official PDF',
    pageCount: '14 Pages',
    domainsCovered: ['Multi-Account Organizations', 'Resilient Compute & VPC', 'High Availability Storage', 'Well-Architected Reviews', 'Cost Optimization'],
    summary: 'Authoritative architect learning pathway outlining steps to design highly available, cost-efficient, fault-tolerant, and secure distributed cloud systems on AWS.'
  },
  {
    id: 'pdf-devops',
    title: 'AWS Ramp-Up Guide: DevOps Engineer',
    roleTag: 'DevSecOps & CI/CD',
    publisher: 'AWS Training & Certification',
    officialPdfUrl: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Ramp-Up_Guide_DevOps.pdf',
    badgeTone: 'emerald',
    badgeText: 'AWS Official PDF',
    pageCount: '10 Pages',
    domainsCovered: ['CodePipeline & CodeBuild', 'Infrastructure as Code', 'Automated Testing & SAST', 'Continuous Delivery', 'Monitoring & Observability'],
    summary: 'Comprehensive roadmap for automating the software development lifecycle, implementing continuous delivery methodologies, and enforcing security gates in pipelines.'
  },
  {
    id: 'pdf-operations',
    title: 'AWS Ramp-Up Guide: Cloud Operations (SysOps)',
    roleTag: 'Cloud SysOps & Operations',
    publisher: 'AWS Training & Certification',
    officialPdfUrl: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Ramp-Up_Guide_Operations.pdf',
    badgeTone: 'amber',
    badgeText: 'AWS Official PDF',
    pageCount: '11 Pages',
    domainsCovered: ['Systems Manager & Fleet Mgmt', 'CloudWatch Metrics & Alarms', 'Backup & Disaster Recovery', 'Patch Management', 'Cost Governance'],
    summary: 'Step-by-step guidance for deploying, managing, automating, and maintaining workloads in cloud environments using AWS Systems Manager and observability tools.'
  },
  {
    id: 'pdf-networking',
    title: 'AWS Ramp-Up Guide: Advanced Networking',
    roleTag: 'Cloud Network Engineer',
    publisher: 'AWS Training & Certification',
    officialPdfUrl: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Ramp-Up_Guide_Networking.pdf',
    badgeTone: 'cyan',
    badgeText: 'AWS Official PDF',
    pageCount: '9 Pages',
    domainsCovered: ['Transit Gateway & Direct Connect', 'VPC Flow Logs & Traffic Mirroring', 'Route 53 & Hybrid DNS', 'Network Firewall', 'PrivateLink'],
    summary: 'Master enterprise-scale cloud network architectures, hybrid Direct Connect routing topologies, multi-VPC segmentation, and stateful packet inspection.'
  },
  {
    id: 'pdf-cloud-essentials',
    title: 'AWS Ramp-Up Guide: Cloud Essentials',
    roleTag: 'Cloud Foundations',
    publisher: 'AWS Training & Certification',
    officialPdfUrl: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Ramp-Up_Guide_Cloud_Essentials.pdf',
    badgeTone: 'rose',
    badgeText: 'AWS Official PDF',
    pageCount: '8 Pages',
    domainsCovered: ['Core AWS Services (EC2, S3, IAM, VPC)', 'Shared Responsibility Model', 'Billing & Cost Explorer', 'Cloud Value Proposition', 'Security Basics'],
    summary: 'Foundational roadmap for anyone starting their cloud journey—covers core concepts, global cloud infrastructure, basic security governance, and economics.'
  },
  {
    id: 'pdf-developer',
    title: 'AWS Ramp-Up Guide: Developer',
    roleTag: 'Cloud Software Engineer',
    publisher: 'AWS Training & Certification',
    officialPdfUrl: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Ramp-Up_Guide_Developer.pdf',
    badgeTone: 'purple',
    badgeText: 'AWS Official PDF',
    pageCount: '11 Pages',
    domainsCovered: ['AWS SDKs & CLI', 'Serverless (Lambda & API Gateway)', 'DynamoDB NoSQL Data Modeling', 'Cognito Identity', 'AppSync & Event-Driven'],
    summary: 'Curated resource guide for developers writing cloud-native applications, using AWS SDKs, managing state with DynamoDB, and building serverless microservices.'
  },
  {
    id: 'pdf-well-architected-security',
    title: 'AWS Well-Architected Framework: Security Pillar',
    roleTag: 'Enterprise Architecture & SecOps',
    publisher: 'AWS Technical Documentation',
    officialPdfUrl: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/wellarchitected-security-pillar.pdf',
    badgeTone: 'emerald',
    badgeText: 'Official Whitepaper PDF',
    pageCount: '86 Pages',
    domainsCovered: ['Identity & Permissions', 'Incident Response Playbooks', 'Data Classification & KMS', 'Network Segregation', 'Continuous Auditability'],
    summary: 'The industry-standard definitive whitepaper by AWS architects detailing design principles and best practices for securing cloud workloads in production.'
  },
  {
    id: 'pdf-cis-benchmark',
    title: 'CIS AWS Foundations Benchmark v3.0 Specification',
    roleTag: 'Compliance & Hardening',
    publisher: 'Center for Internet Security (CIS)',
    officialPdfUrl: 'https://www.cisecurity.org/benchmark/amazon_web_services',
    badgeTone: 'amber',
    badgeText: 'Industry Standard Spec',
    pageCount: '150+ Pages',
    domainsCovered: ['Root Account MFA & Protection', 'IAM Password Policies', 'CloudTrail Multi-Region Logging', 'S3 Bucket Block Public Access', 'VPC Flow Logs'],
    summary: 'Consensus-driven security benchmarks used globally by regulated industries to configure baseline cloud security settings across AWS accounts.'
  }
]

export const masterRampUpLabs = [
  // =========================================================================
  // 1. CLOUD ROLES & RAMP-UP GUIDES
  // =========================================================================
  {
    id: 'role-secops-engineer',
    category: 'cloud-roles',
    roleTitle: 'Cloud Security Engineer (SecOps & Detection)',
    labTitle: 'AWS Security Hub & GuardDuty Automated Incident Containment',
    originalLink: 'https://workshops.aws/card/AWS%20Security%20Hub%20Workshop',
    officialPdfUrl: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Ramp-Up_Guide_Security.pdf',
    officialGuideName: 'AWS Ramp-Up Guide: Security (Official PDF)',
    platform: 'AWS Official Workshops',
    difficulty: 'Intermediate',
    estimatedTime: '60 mins',
    badgeTone: 'cyan',
    targetServices: ['AWS Security Hub', 'Amazon GuardDuty', 'Amazon EventBridge', 'AWS Lambda'],
    roleRampUpGuide: {
      summary: 'Cloud Security Engineers safeguard multi-account AWS environments, triage detection alerts, and build automated remediation pipelines to reduce Mean Time to Remediate (MTTR).',
      dayInLife: 'Monitoring GuardDuty findings, evaluating Security Hub CIS compliance scorecards, writing EventBridge event-driven automation rules, and collaborating with platform teams on least-privilege policies.',
      keyCertifications: ['AWS Certified Security - Specialty (SCS-C02)', 'GIAC Cloud Security Automation (GCSA)'],
      salaryRange: '$135,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Centralize Detection Telemetry in Security Hub',
        instruction: 'Enable Amazon GuardDuty and AWS Security Hub across all member accounts from the designated Delegated Administrator Security Account.',
        commandOrAction: 'aws securityhub enable-security-hub --enable-default-standards'
      },
      {
        step: 2,
        title: 'Configure EventBridge Detection Filter',
        instruction: 'Create an Amazon EventBridge rule that matches GuardDuty findings with severity >= 7.0 (High/Critical) for EC2 compromise signals.',
        commandOrAction: 'aws events put-rule --name "GuardDuty-HighSev-Trigger" --event-pattern \'{"source":["aws.guardduty"],"detail":{"severity":[7,7.1,7.2,7.3,7.4,7.5,7.6,7.7,7.8,7.9,8,8.1,8.2,8.3,8.4,8.5,8.6,8.7,8.8,8.9]}}\''
      },
      {
        step: 3,
        title: 'Deploy Automated Quarantine Lambda Function',
        instruction: 'Deploy a serverless Python Lambda function that intercepts the instance ID from the event payload and attaches an isolating Quarantine Security Group (blocking 100% inbound/outbound).',
        commandOrAction: 'aws ec2 modify-instance-attribute --instance-id i-0123456789abcdef0 --groups sg-quarantine-isolated'
      },
      {
        step: 4,
        title: 'Simulate Attack & Validate Containment',
        instruction: 'Trigger a simulated DNS data exfiltration query on a test EC2 instance, observe GuardDuty alert generation, and confirm EventBridge executes the quarantine Lambda within 15 seconds.',
        commandOrAction: 'dig @8.8.8.8 test-exfiltration.guardduty-c2.com'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Event-driven serverless automated incident containment',
        'Multi-account Security Hub & GuardDuty architecture',
        'Reducing MTTR from hours to under 30 seconds',
        'Preserving volatile forensic evidence without terminating instances'
      ],
      interviewTalkingPoint: 'I architected an automated EventBridge and Lambda containment pipeline that intercepts GuardDuty severity 7+ C2 indicators and applies quarantine security groups in under 20 seconds, eliminating manual triage delays.'
    }
  },
  {
    id: 'role-iam-architect',
    category: 'cloud-roles',
    roleTitle: 'Cloud IAM & Identity Architect',
    labTitle: 'IAM Policy Sifting & Permission Boundaries Enforcement',
    originalLink: 'https://workshops.aws/card/IAM%20Policy%20Validation',
    officialPdfUrl: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Ramp-Up_Guide_Security.pdf',
    officialGuideName: 'AWS Ramp-Up Guide: Security (Official PDF)',
    platform: 'AWS Official Workshops',
    difficulty: 'Advanced',
    estimatedTime: '75 mins',
    badgeTone: 'purple',
    targetServices: ['AWS IAM', 'IAM Access Analyzer', 'IAM Permission Boundaries', 'AWS CloudTrail'],
    roleRampUpGuide: {
      summary: 'IAM Architects design enterprise identity governance, enforce strict least-privilege access, prevent privilege escalation paths, and govern cross-account STS assume-role trust relationships.',
      dayInLife: 'Reviewing developer access requests, designing Permission Boundaries for CI/CD pipelines, analyzing Access Analyzer findings, and automating unused credential decommissioning.',
      keyCertifications: ['AWS Certified Solutions Architect - Professional (SAP-C02)', 'Certified Identity and Access Manager (CIAM)'],
      salaryRange: '$150,000 - $210,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Generate Activity Baseline from CloudTrail History',
        instruction: 'Use IAM Access Analyzer policy generation to inspect the last 90 days of CloudTrail activity for an overly permissive developer role with AdministratorAccess.',
        commandOrAction: 'aws accessanalyzer start-policy-generation --policy-generation-details \'{"principalArn":"arn:aws:iam::123456789012:role/DevLeadRole"}\''
      },
      {
        step: 2,
        title: 'Validate Policy Grammar and Security Warnings',
        instruction: 'Run policy validation via Access Analyzer CLI to identify security warnings such as wildcard resource actions on sensitive services (e.g. s3:*, iam:*).',
        commandOrAction: 'aws accessanalyzer validate-policy --policy-document file://generated-policy.json --policy-type IDENTITY_POLICY'
      },
      {
        step: 3,
        title: 'Author and Attach IAM Permission Boundary',
        instruction: 'Create an IAM Permission Boundary policy that caps the maximum permissions developers can grant themselves, explicitly denying privilege escalation actions (e.g., iam:CreatePolicyVersion, iam:AttachRolePolicy).',
        commandOrAction: 'aws iam put-role-permissions-boundary --role-name DevLeadRole --permissions-boundary arn:aws:iam::123456789012:policy/DevPermissionBoundary'
      },
      {
        step: 4,
        title: 'Test Privilege Escalation Resistance',
        instruction: 'Assume the DevLeadRole and attempt to attach AdministratorAccess to a secondary role. Confirm IAM denies the request with an explicit boundary violation.',
        commandOrAction: 'aws iam attach-role-policy --role-name SecondaryRole --policy-arn arn:aws:iam::aws:policy/AdministratorAccess'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Eliminating wildcard policies using CloudTrail empirical service utilization data',
        'Enforcing IAM Permission Boundaries to prevent shadow admin escalation',
        'Mathematical formal verification using IAM Access Analyzer',
        'ABAC (Attribute-Based Access Control) tagging strategies'
      ],
      interviewTalkingPoint: 'By establishing mandatory IAM Permission Boundaries on all developer CI/CD roles, I decentralized role creation while mathematically guaranteeing developers could never escalate privileges to administrative control.'
    }
  },
  {
    id: 'role-devsecops-lead',
    category: 'cloud-roles',
    roleTitle: 'DevSecOps & Cloud Platform Security Lead',
    labTitle: 'Keyless GitHub Actions OIDC & Shift-Left Terraform Posture',
    originalLink: 'https://github.com/bridgecrewio/checkov',
    officialPdfUrl: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Ramp-Up_Guide_DevOps.pdf',
    officialGuideName: 'AWS Ramp-Up Guide: DevOps Engineer (Official PDF)',
    platform: 'Open Source Security / GitHub',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    badgeTone: 'emerald',
    targetServices: ['AWS IAM OIDC', 'GitHub Actions', 'Terraform', 'Checkov', 'Amazon S3'],
    roleRampUpGuide: {
      summary: 'DevSecOps Engineers integrate automated security scanning, policy-as-code, and cryptographic identity federation directly into CI/CD build pipelines before deployment to cloud production.',
      dayInLife: 'Configuring pipeline security gates, auditing Terraform code with Checkov, eliminating hardcoded long-lived credentials via OIDC, and container image vulnerability gating.',
      keyCertifications: ['Certified Kubernetes Security Specialist (CKS)', 'DevSecOps Professional (CDP)'],
      salaryRange: '$140,000 - $190,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Establish IAM OpenID Connect (OIDC) Identity Provider',
        instruction: 'Create an IAM OIDC Identity Provider for token.actions.githubusercontent.com to eliminate stored AWS Access Keys in repository secrets.',
        commandOrAction: 'aws iam create-open-id-connect-provider --url https://token.actions.githubusercontent.com --client-id-list sts.amazonaws.com --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1'
      },
      {
        step: 2,
        title: 'Configure Scoped Role Trust Policy',
        instruction: 'Author an IAM trust policy that only permits AssumeRoleWithWebIdentity when the repository and branch match your organization repository (e.g. repo:org/infra:ref:refs/heads/main).',
        commandOrAction: 'aws iam create-role --role-name GitHubActionsTerraformRole --assume-role-policy-document file://oidc-trust.json'
      },
      {
        step: 3,
        title: 'Add Checkov Static Analysis to GitHub Workflow',
        instruction: 'Configure a GitHub Actions workflow step executing Checkov static analysis against Terraform pull requests with high/critical severity blocking rules.',
        commandOrAction: 'checkov -d ./terraform --framework terraform --soft-fail=false --check HIGH,CRITICAL'
      },
      {
        step: 4,
        title: 'Simulate Misconfiguration & Verify Pull Request Block',
        instruction: 'Commit a Terraform resource with `acl = "public-read"` on an S3 bucket. Verify Checkov fails the CI check and prevents deployment.',
        commandOrAction: 'git commit -m "test: insecure s3 bucket" && git push'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Zero-credential CI/CD authentication via short-lived JWT OIDC tokens',
        'Shift-left static analysis for Infrastructure as Code (Checkov/tfsec)',
        'Preventing credential exfiltration from CI/CD runners',
        'Automated pull-request security compliance gates'
      ],
      interviewTalkingPoint: 'I eliminated 100% of static AWS access keys from our CI/CD pipelines by migrating to GitHub Actions OIDC and established automated Checkov gates that block high-severity IaC misconfigurations before merge.'
    }
  },
  {
    id: 'role-cloud-architect',
    category: 'cloud-roles',
    roleTitle: 'Cloud Security Architect (Multi-Account & Perimeter)',
    labTitle: 'AWS Organizations SCPs & Transit Gateway Egress Firewall',
    originalLink: 'https://workshops.aws/card/AWS%20Network%20Firewall',
    officialPdfUrl: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Ramp-Up_Guide_Architect.pdf',
    officialGuideName: 'AWS Ramp-Up Guide: Architect (Official PDF)',
    platform: 'AWS Official Workshops',
    difficulty: 'Advanced',
    estimatedTime: '90 mins',
    badgeTone: 'rose',
    targetServices: ['AWS Organizations', 'Service Control Policies (SCPs)', 'AWS Transit Gateway', 'AWS Network Firewall'],
    roleRampUpGuide: {
      summary: 'Cloud Security Architects design the overarching defense-in-depth blueprint: multi-account landing zones, preventative governance guardrails, and centralized inspection perimeters.',
      dayInLife: 'Reviewing cloud architecture designs against the Well-Architected Framework, drafting Organization SCPs, designing hub-and-spoke transit networks, and establishing threat models.',
      keyCertifications: ['AWS Certified Solutions Architect - Professional (SAP-C02)', 'CISSP - Certified Information Systems Security Professional'],
      salaryRange: '$165,000 - $235,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Enforce Organization Guardrails via SCPs',
        instruction: 'Draft an SCP in the root organization denying accounts from leaving AWS Organizations, disabling CloudTrail, or deleting GuardDuty detectors.',
        commandOrAction: 'aws organizations create-policy --content file://deny-disable-security.json --name "DenySecurityDisabling" --type SERVICE_CONTROL_POLICY'
      },
      {
        step: 2,
        title: 'Deploy Hub-and-Spoke Transit Gateway Topology',
        instruction: 'Create an AWS Transit Gateway that interconnects Spoke VPCs (App, Data) with a centralized Egress & Inspection VPC.',
        commandOrAction: 'aws ec2 create-transit-gateway --description "Central-Security-Hub-TGW"'
      },
      {
        step: 3,
        title: 'Configure AWS Network Firewall with Suricata Rules',
        instruction: 'Provision AWS Network Firewall in the Inspection VPC with stateful 5-tuple and domain-filtering rules to block outbound traffic to non-whitelisted domains.',
        commandOrAction: 'aws network-firewall create-firewall --firewall-name EgressFilterFW --firewall-policy-arn arn:aws:network-firewall:... --vpc-id vpc-inspection'
      },
      {
        step: 4,
        title: 'Verify Perimeter Filtering and Logging',
        instruction: 'Generate outbound curl requests from an app instance to test domains. Confirm whitelisted domains succeed and unauthorized outbound connections are dropped with alerts sent to CloudWatch Logs.',
        commandOrAction: 'curl -I https://unauthorized-domain.com'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Non-bypassable organizational guardrails using preventative SCPs',
        'Centralized hub-and-spoke network inspection perimeters',
        'Stateful Suricata network signature authoring',
        'Egress filtering to prevent C2 communications and data exfiltration'
      ],
      interviewTalkingPoint: 'I designed a centralized transit VPC architecture with AWS Network Firewall and strict Organizations SCPs, creating a unified inspection bottleneck that enforces TLS domain whitelisting across 50+ development accounts.'
    }
  },
  {
    id: 'role-forensics-lead',
    category: 'cloud-roles',
    roleTitle: 'Cloud Incident Responder & Digital Forensics Analyst',
    labTitle: 'EC2 Memory Dumps & Athena CloudTrail Kill-Chain Analysis',
    originalLink: 'https://workshops.aws/card/AWS%20Incident%20Response%20and%20Forensics',
    officialPdfUrl: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/wellarchitected-security-pillar.pdf',
    officialGuideName: 'AWS Well-Architected Security Pillar (Whitepaper PDF)',
    platform: 'AWS Official Workshops',
    difficulty: 'Advanced',
    estimatedTime: '80 mins',
    badgeTone: 'amber',
    targetServices: ['AWS CloudTrail', 'Amazon Athena', 'Amazon EBS Snapshots', 'Amazon S3'],
    roleRampUpGuide: {
      summary: 'Forensics Analysts reconstruct threat actor attack timelines, preserve volatile digital evidence according to legal chain of custody, and perform big-data log correlation in SIEM and Athena.',
      dayInLife: 'Performing memory acquisition on active compromised instances, executing Athena SQL threat hunting queries, correlating IP addresses and user agents, and publishing post-incident RCAs.',
      keyCertifications: ['GIAC Certified Incident Handler (GCIH)', 'GIAC Cloud Forensics Responder (GCFR)'],
      salaryRange: '$145,000 - $195,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Isolate Host and Capture Non-Destructive Snapshot',
        instruction: 'Quarantine the suspected compromised EC2 instance and create consistent EBS snapshots of all attached root and secondary volumes.',
        commandOrAction: 'aws ec2 create-snapshot --volume-id vol-0123456789 --description "Forensic-Preservation-Ticket-104"'
      },
      {
        step: 2,
        title: 'Attach Volume Copy to Isolated Forensics Workstation',
        instruction: 'Create an encrypted volume from the snapshot and attach it as a read-only disk to an isolated digital forensics investigation instance.',
        commandOrAction: 'aws ec2 attach-volume --volume-id vol-forensic-copy --instance-id i-forensics-box --device /dev/sdf'
      },
      {
        step: 3,
        title: 'Query CloudTrail Timeline with Amazon Athena',
        instruction: 'Execute SQL queries in Athena across S3 CloudTrail logs to identify every API call invoked by the compromised IAM Access Key within a 24-hour window.',
        commandOrAction: 'SELECT eventtime, eventsource, eventname, sourceipaddress, useragent FROM cloudtrail_logs WHERE useridentity.accesskeyid = \'ASIAEXAMPLE12345\' ORDER BY eventtime ASC;'
      },
      {
        step: 4,
        title: 'Reconstruct Attacker Blast Radius and Generate SHA-256 Hashes',
        instruction: 'Verify data integrity of all disk images using `sha256sum`, correlate compromised credentials with S3 GetObject and IAM PutRolePolicy events, and assemble the executive timeline.',
        commandOrAction: 'sha256sum /dev/xvdf > evidence-integrity-hash.txt'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Volatile and non-volatile cloud evidence preservation',
        'Legal chain of custody and cryptographic hash verification',
        'Athena high-speed SQL log queries for incident timelines',
        'Correlating IAM temporary STS tokens with underlying root identities'
      ],
      interviewTalkingPoint: 'During an incident response engagement, I performed forensic preservation of compromised EBS volumes and wrote targeted Athena queries that reconstructed an attacker lateral movement path in under 45 minutes.'
    }
  },

  // =========================================================================
  // 2. TRYHACKME CLOUD & SECURITY ROOMS
  // =========================================================================
  {
    id: 'thm-cloud-basics',
    category: 'tryhackme',
    roleTitle: 'Security Fundamentals Track',
    labTitle: 'TryHackMe: Cloud Security Basics & Architecture Room',
    originalLink: 'https://tryhackme.com/room/cloudsecuritybasics',
    platform: 'TryHackMe (Public Room)',
    difficulty: 'Beginner',
    estimatedTime: '45 mins',
    badgeTone: 'rose',
    targetServices: ['IaaS vs PaaS vs SaaS', 'Cloud Attack Surface', 'Shared Responsibility', 'Public Cloud Discovery'],
    roleRampUpGuide: {
      summary: 'Essential foundation room explaining how cloud computing paradigms shift security boundaries, access controls, and responsibility between the cloud provider and the customer.',
      dayInLife: 'Understanding why traditional network perimeter defenses fail in cloud architectures and how identity replaces the firewall as the primary security perimeter.',
      keyCertifications: ['CompTIA Security+', 'AWS Certified Cloud Practitioner'],
      salaryRange: 'Foundational Knowledge'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Deploy TryHackMe Target Machine',
        instruction: 'Navigate to the TryHackMe room link, click "Start Machine", and connect via the OpenVPN configuration or the in-browser AttackBox.',
        commandOrAction: 'sudo openvpn /path/to/your-thm-profile.ovpn'
      },
      {
        step: 2,
        title: 'Analyze Shared Responsibility Scenarios',
        instruction: 'Review the questions covering AWS EC2 vs Lambda vs S3. Identify customer responsibilities (OS patching on EC2 vs IAM policies on S3).',
        commandOrAction: 'Answer Task 2 question on hypervisor vs guest OS patching.'
      },
      {
        step: 3,
        title: 'Identify Exposed Cloud Storage Endpoints',
        instruction: 'Scan the simulated cloud target to identify open endpoints and determine if sensitive assets are exposed via unauthenticated storage APIs.',
        commandOrAction: 'curl -I http://target-instance.thm:8080/storage/public-assets/'
      },
      {
        step: 4,
        title: 'Submit Room Answers & Retrieve Flag',
        instruction: 'Synthesize the findings on cloud risk vectors, answer the verification prompts, and submit the final flag to complete the room.',
        commandOrAction: 'Submit THM{cloud_shared_responsibility_mastered}'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Shared Responsibility matrix differences across service tiers',
        'Identification of cloud-specific perimeter attack vectors',
        'Identity as the new security perimeter',
        'Essential TryHackMe lab navigation and verification procedures'
      ],
      interviewTalkingPoint: 'I understand that in cloud computing, security failures almost never stem from hypervisor flaws—they stem from customer configuration errors in identity and storage access policies.'
    }
  },
  {
    id: 'thm-aws-compromise',
    category: 'tryhackme',
    roleTitle: 'Offensive Cloud Security',
    labTitle: 'TryHackMe: AWS Compromise (Attacking & Defending Leaked Keys)',
    originalLink: 'https://tryhackme.com/room/awscompromise',
    platform: 'TryHackMe (Subscriber)',
    difficulty: 'Intermediate',
    estimatedTime: '60 mins',
    badgeTone: 'rose',
    targetServices: ['AWS CLI', 'AWS IAM', 'Amazon S3', 'Credential Hunting'],
    roleRampUpGuide: {
      summary: 'Practical hands-on scenario simulating an attacker discovering leaked AWS API keys in a public Git commit and escalating privileges inside the target AWS account.',
      dayInLife: 'Conducting credential exposure reviews, tracing compromised credentials in CloudTrail, and executing rapid credential revocation.',
      keyCertifications: ['TryHackMe Cloud Security Pathway', 'Certified Cloud Penetration Tester'],
      salaryRange: '$120,000 - $170,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Extract Leaked AWS Access Keys',
        instruction: 'Review the provided Git commit logs on the target web server to locate accidentally committed `aws_access_key_id` and `aws_secret_access_key`.',
        commandOrAction: 'git log -p -S "AKIA" | grep -E "(AKIA|aws_secret)"'
      },
      {
        step: 2,
        title: 'Configure Attacker AWS CLI Profile',
        instruction: 'Configure the extracted credentials into a local AWS named profile and verify identity using AWS STS.',
        commandOrAction: 'aws configure --profile compromised-key && aws sts get-caller-identity --profile compromised-key'
      },
      {
        step: 3,
        title: 'Enumerate IAM Policies & Extract Flags',
        instruction: 'Enumerate the attached policies to identify missing restrictions, list private S3 buckets, and download confidential company data containing the CTF flag.',
        commandOrAction: 'aws s3 ls --profile compromised-key && aws s3 cp s3://internal-financials-backup/flag.txt . --profile compromised-key'
      },
      {
        step: 4,
        title: 'Perform Defensive Containment (Blue Team)',
        instruction: 'Simulate the SOC remediation: deactivate the exposed IAM access key, invalidate active STS sessions, and configure GitHub secret scanning.',
        commandOrAction: 'aws iam update-access-key --access-key-id AKIAEXPOSURE123 --status Inactive'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Real-world offensive techniques against leaked long-lived IAM keys',
        'Enumeration order-of-operations using AWS CLI',
        'Exfiltration vectors via Amazon S3 bucket reconnaissance',
        'Immediate containment runbooks for compromised cloud identities'
      ],
      interviewTalkingPoint: 'I understand how attackers weaponize exposed AWS keys within seconds of public commits, and how defense requires automated deactivation tools like AWS Git Secrets and GitHub push protection.'
    }
  },
  {
    id: 'thm-red-cloud',
    category: 'tryhackme',
    roleTitle: 'Purple Team Cloud Lab',
    labTitle: 'TryHackMe: Red Cloud (SSRF to IMDSv1 Credential Exfiltration)',
    originalLink: 'https://tryhackme.com/room/redcloud',
    platform: 'TryHackMe (Subscriber)',
    difficulty: 'Hard',
    estimatedTime: '70 mins',
    badgeTone: 'rose',
    targetServices: ['EC2 IMDSv1 vs IMDSv2', 'SSRF (Server-Side Request Forgery)', 'IAM Instance Profiles', 'Lateral Movement'],
    roleRampUpGuide: {
      summary: 'Simulates the infamous Capital One cloud attack vector: exploiting an SSRF vulnerability in a web application to query the AWS link-local Instance Metadata Service and steal IAM role tokens.',
      dayInLife: 'Auditing web applications for SSRF vulnerabilities, enforcing IMDSv2 across enterprise EC2 fleets, and monitoring anomalous metadata service call volumes.',
      keyCertifications: ['Offensive Security Certified Cloud Professional (OSCP/OSCP+)', 'GCSA'],
      salaryRange: '$140,000 - $190,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Identify SSRF Vulnerability in Target Web App',
        instruction: 'Browse the web application on the target machine and locate an image/URL proxy parameter vulnerable to SSRF.',
        commandOrAction: 'curl "http://target.thm/preview?url=http://127.0.0.1:80/"'
      },
      {
        step: 2,
        title: 'Query AWS Link-Local Metadata Service (169.254.169.254)',
        instruction: 'Manipulate the URL parameter to query the AWS EC2 Instance Metadata Service (IMDSv1) at `http://169.254.169.254/latest/meta-data/iam/security-credentials/`.',
        commandOrAction: 'curl "http://target.thm/preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"'
      },
      {
        step: 3,
        title: 'Exfiltrate Session Tokens & Secret Keys',
        instruction: 'Fetch the active role name and retrieve the temporary AccessKeyId, SecretAccessKey, and Token JSON payload.',
        commandOrAction: 'curl "http://target.thm/preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/WebAppServerRole"'
      },
      {
        step: 4,
        title: 'Implement IMDSv2 Defensive Hardening',
        instruction: 'Execute the AWS CLI command that enforces IMDSv2 (requiring a session token header) and set hop limit to 1 to block SSRF bypass.',
        commandOrAction: 'aws ec2 modify-instance-metadata-options --instance-id i-target --http-tokens required --http-put-response-hop-limit 1'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'SSRF-to-cloud-metadata exploitation mechanics',
        'Understanding how instance profiles provision short-lived STS credentials',
        'IMDSv1 architectural weaknesses vs IMDSv2 session token enforcement',
        'Hop limit tuning to prevent container-to-host metadata theft'
      ],
      interviewTalkingPoint: 'I have hands-on experience demonstrating why IMDSv1 is dangerous in modern cloud architectures, and I routinely enforce IMDSv2 with `http-tokens required` and a hop limit of 1 across all production EC2 instances.'
    }
  },
  {
    id: 'thm-azure-ir',
    category: 'tryhackme',
    roleTitle: 'Multi-Cloud Detection & Response',
    labTitle: 'TryHackMe: Incident Response in Azure Cloud',
    originalLink: 'https://tryhackme.com/room/azureincidentresponse',
    platform: 'TryHackMe',
    difficulty: 'Intermediate',
    estimatedTime: '60 mins',
    badgeTone: 'rose',
    targetServices: ['Azure Active Directory (Entra ID)', 'Azure Activity Logs', 'Microsoft Sentinel', 'Service Principals'],
    roleRampUpGuide: {
      summary: 'Incident response in multi-cloud enterprise environments: investigating unauthorized OAuth application consents, rogue Service Principal registrations, and privilege escalation in Azure.',
      dayInLife: 'Investigating Azure Sentinel alerts, auditing Microsoft Entra ID sign-in logs, and tracing attack paths spanning AWS and Azure environments.',
      keyCertifications: ['Microsoft Certified: Security Operations Analyst (SC-200)', 'GCFR'],
      salaryRange: '$130,000 - $180,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Launch Azure IR Sandbox Environment',
        instruction: 'Start the TryHackMe Azure simulation room and log into the provided Sentinel investigation workstation.',
        commandOrAction: 'Connect to Microsoft Sentinel workspace dashboard.'
      },
      {
        step: 2,
        title: 'Search Entra ID Audit Logs for Rogue App Registrations',
        instruction: 'Run KQL (Kusto Query Language) queries to detect newly created Service Principals with High-Privilege application permissions (e.g. Directory.ReadWrite.All).',
        commandOrAction: 'AuditLogs | where OperationName == "Add service principal" | project TimeGenerated, InitiatedBy, TargetResources'
      },
      {
        step: 3,
        title: 'Trace Anomalous Non-Interactive Sign-Ins',
        instruction: 'Query SigninLogs to determine whether the rogue service principal authenticated from an untrusted anomalous IP address.',
        commandOrAction: 'SigninLogs | where AppId == "suspected-app-id" | project IPAddress, Location, ResultType'
      },
      {
        step: 4,
        title: 'Revoke App Permissions & Invalidate Active Tokens',
        instruction: 'Execute Azure CLI / PowerShell command to revoke client credentials and remove all assigned enterprise role permissions.',
        commandOrAction: 'az ad app credential reset --id "suspected-app-id"'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Kusto Query Language (KQL) for cloud threat hunting',
        'Service Principal and OAuth consent grant abuse vectors',
        'Multi-cloud incident response terminology (AWS IAM vs Azure RBAC)',
        'Automated token revocation in enterprise directory services'
      ],
      interviewTalkingPoint: 'Cloud security requires multi-cloud fluency; I use KQL in Microsoft Sentinel to rapidly hunt rogue service principals and audit non-interactive API access across cloud boundaries.'
    }
  },

  // =========================================================================
  // 3. HACKTHEBOX CLOUD & INFRASTRUCTURE LABS
  // =========================================================================
  {
    id: 'htb-bucket',
    category: 'hackthebox',
    roleTitle: 'Cloud Penetration Testing',
    labTitle: 'HackTheBox: Bucket (AWS S3 & LocalStack Compromise)',
    originalLink: 'https://app.hackthebox.com/machines/Bucket',
    platform: 'HackTheBox (Linux / Medium)',
    difficulty: 'Medium',
    estimatedTime: '90 mins',
    badgeTone: 'emerald',
    targetServices: ['LocalStack', 'Amazon S3', 'Amazon DynamoDB', 'PHP Web Shells'],
    roleRampUpGuide: {
      summary: 'Legendary HackTheBox cloud machine featuring a web server backed by simulated AWS cloud services (LocalStack S3 and DynamoDB), showcasing how misconfigured bucket syncs lead to Remote Code Execution.',
      dayInLife: 'Conducting cloud penetration tests, identifying unauthenticated internal cloud APIs, and auditing microservice storage architecture.',
      keyCertifications: ['HackTheBox Certified Bug Bounty Hunter (HTB CBBH)', 'OSCP'],
      salaryRange: '$135,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Reconnaissance & Virtual Host Enumeration',
        instruction: 'Run Nmap port scan against the target IP and discover virtual hosts `bucket.htb` and `s3.bucket.htb` in the HTTP response headers.',
        commandOrAction: 'echo "10.10.10.212 bucket.htb s3.bucket.htb" | sudo tee -a /etc/hosts'
      },
      {
        step: 2,
        title: 'Enumerate LocalStack S3 Buckets via AWS CLI',
        instruction: 'Use the AWS CLI targeting the custom S3 endpoint URL to list accessible buckets without valid cloud credentials.',
        commandOrAction: 'aws --endpoint-url http://s3.bucket.htb s3 ls'
      },
      {
        step: 3,
        title: 'Upload Web Shell into Synchronized Web Bucket',
        instruction: 'Notice the `adserver` S3 bucket mirrors the web server document root. Upload a lightweight PHP reverse shell into the bucket.',
        commandOrAction: 'aws --endpoint-url http://s3.bucket.htb s3 cp shell.php s3://adserver/'
      },
      {
        step: 4,
        title: 'Trigger Shell & Pivot to DynamoDB for Root Flag',
        instruction: 'Trigger the reverse shell via browser, inspect local DynamoDB tables containing system administrator passwords, and obtain the root flag.',
        commandOrAction: 'curl http://bucket.htb/shell.php && aws --endpoint-url http://s3.bucket.htb dynamodb list-tables'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Interacting with custom cloud endpoints via AWS CLI',
        'Attacking cloud storage buckets serving web assets',
        'DynamoDB NoSQL enumeration for stored credentials',
        'Local privilege escalation stemming from internal cloud services'
      ],
      interviewTalkingPoint: 'I demonstrated on HackTheBox Bucket how an S3 bucket synchronized with a web server document root turns write access into immediate Remote Code Execution, reinforcing the need for strict bucket read-only policies.'
    }
  },
  {
    id: 'htb-included',
    category: 'hackthebox',
    roleTitle: 'Cloud Container & LocalStack Lab',
    labTitle: 'HackTheBox: Included (TFTP, LocalStack & Container Escapes)',
    originalLink: 'https://app.hackthebox.com/machines/Included',
    platform: 'HackTheBox (Linux / Easy)',
    difficulty: 'Easy',
    estimatedTime: '45 mins',
    badgeTone: 'emerald',
    targetServices: ['TFTP Protocol', 'LocalStack S3', 'Docker Container Escapes', 'Linux Capabilities'],
    roleRampUpGuide: {
      summary: 'Demonstrates legacy protocol infiltration (TFTP) leading to an internal Dockerized LocalStack instance, showing how container capabilities can be leveraged to escape to root.',
      dayInLife: 'Securing legacy protocols, container hardening, and preventing development cloud tools from exposing production hosts.',
      keyCertifications: ['HTB Certified Penetration Testing Specialist', 'CompTIA PenTest+'],
      salaryRange: '$110,000 - $160,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Scan UDP Ports & Discover TFTP Service',
        instruction: 'Execute UDP reconnaissance to discover open port 69 (TFTP). Connect to the TFTP service and download internal deployment files.',
        commandOrAction: 'tftp 10.10.10.222 -c get /var/lib/tftpboot/config.php'
      },
      {
        step: 2,
        title: 'Extract Hidden LocalStack Credentials',
        instruction: 'Read the retrieved configuration file to uncover hardcoded access keys and endpoint URLs for an internal LocalStack instance.',
        commandOrAction: 'grep -E "(AWS_|SECRET_)" config.php'
      },
      {
        step: 3,
        title: 'Enumerate Local Cloud Storage',
        instruction: 'Query the internal S3 buckets using the discovered credentials to extract internal SSH private keys and administrative scripts.',
        commandOrAction: 'aws --endpoint-url http://localhost:4566 s3 ls s3://dev-backups/'
      },
      {
        step: 4,
        title: 'Exploit Docker Group Permissions for Root Flag',
        instruction: 'Leverage the compromised user group membership in the `docker` group to spawn a privileged container mounted to the host root filesystem.',
        commandOrAction: 'docker run -v /:/host -it alpine chroot /host /bin/bash'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'UDP service reconnaissance and TFTP credential exfiltration',
        'Auditing containerized LocalStack instances',
        'Docker socket and group permission risks (equivalent to root access)',
        'Container volume mount host isolation escapes'
      ],
      interviewTalkingPoint: 'Giving developers membership in the host Docker group is equivalent to granting passwordless root access; I enforce rootless containers and strict socket access controls.'
    }
  },
  {
    id: 'htb-cyclops',
    category: 'hackthebox',
    roleTitle: 'Serverless Cloud Security',
    labTitle: 'HackTheBox: Cyclops (Serverless Lambda Exploitation)',
    originalLink: 'https://app.hackthebox.com/machines/Cyclops',
    platform: 'HackTheBox (Linux / Hard)',
    difficulty: 'Hard',
    estimatedTime: '120 mins',
    badgeTone: 'emerald',
    targetServices: ['AWS Lambda', 'API Gateway', 'Serverless Environment Variables', 'IAM Role Hijacking'],
    roleRampUpGuide: {
      summary: 'Advanced serverless attack simulation: exploiting an injection vulnerability in a Lambda function runtime, extracting temporary execution tokens from environment variables, and pivoting across cloud accounts.',
      dayInLife: 'Auditing serverless functions for runtime code injection, securing Lambda environment variables with KMS envelope encryption, and IAM execution role scoping.',
      keyCertifications: ['HTB Pro Labs', 'GCSA'],
      salaryRange: '$150,000 - $210,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Reconnoiter Serverless REST API Gateway',
        instruction: 'Map out the serverless API Gateway endpoints and identify parameter handling vulnerabilities in the image processing microservice.',
        commandOrAction: 'ffuf -u http://cyclops.htb/api/v1/FUZZ -w api-endpoints.txt'
      },
      {
        step: 2,
        title: 'Execute Command Injection in Serverless Runtime',
        instruction: 'Inject arbitrary shell commands into the input parameter to break out of the Python script execution context inside the `/var/task` directory.',
        commandOrAction: 'curl -X POST http://cyclops.htb/api/v1/render -d "filename=test.png;env"'
      },
      {
        step: 3,
        title: 'Harvest AWS_SESSION_TOKEN & Temporary Credentials',
        instruction: 'Exfiltrate AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SESSION_TOKEN from the runtime memory environment.',
        commandOrAction: 'curl -X POST http://cyclops.htb/api/v1/render -d "filename=;printenv"'
      },
      {
        step: 4,
        title: 'Enumerate Lambda Execution Role Permissions & Capture Flag',
        instruction: 'Use the stolen execution role credentials to discover overly permissive SQS queues and S3 buckets containing administrative flags.',
        commandOrAction: 'aws sqs list-queues && aws s3 sync s3://cyclops-vault-flag ./'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Serverless execution environment architecture and ephemeral container lifecycle',
        'Runtime environment variable credential harvesting',
        'Scoping Lambda execution roles to single resource ARNs',
        'Mitigating command injection in serverless event handlers'
      ],
      interviewTalkingPoint: 'Serverless architectures are not inherently secure: an injection flaw in a Lambda function immediately compromises its execution role tokens, which is why Lambda IAM policies must strictly adhere to least privilege.'
    }
  },
  {
    id: 'htb-cloud-track',
    category: 'hackthebox',
    roleTitle: 'Full Cloud Security Specialist Track',
    labTitle: 'HackTheBox: Official Cloud Security Skill Track',
    originalLink: 'https://app.hackthebox.com/tracks/Cloud-Security',
    platform: 'HackTheBox Tracks',
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '20+ hours',
    badgeTone: 'emerald',
    targetServices: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Cloud Threat Modeling'],
    roleRampUpGuide: {
      summary: 'The comprehensive HackTheBox structured syllabus covering the modern cloud penetration testing and defensive engineering discipline across major hyperscalers.',
      dayInLife: 'Working as a Senior Cloud Security Consultant, performing offensive cloud readiness audits, and guiding engineering teams on security architecture remediation.',
      keyCertifications: ['HTB Certified Cloud Penetration Tester (CWEE)', 'GIAC Cloud Penetration Tester (GCPN)'],
      salaryRange: '$145,000 - $215,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Complete Cloud Identity & IAM Attack Modules',
        instruction: 'Work through modules detailing cloud credential theft, role chaining, trust abuse, and SAML/OIDC federated authentication attacks.',
        commandOrAction: 'Follow module walkthroughs on app.hackthebox.com/tracks/Cloud-Security'
      },
      {
        step: 2,
        title: 'Execute Cloud Storage & Database Exploitation',
        instruction: 'Solve challenge scenarios involving S3 access control lists, DynamoDB injection, and Azure Blob storage misconfigurations.',
        commandOrAction: 'Submit completion flags on storage challenges.'
      },
      {
        step: 3,
        title: 'Perform Kubernetes & Container Cluster Auditing',
        instruction: 'Attack misconfigured Kubernetes API servers, enumerate etcd secrets, and break out of unprivileged pods.',
        commandOrAction: 'kubectl auth can-i --list'
      },
      {
        step: 4,
        title: 'Final Capstone Assessment & Certificate Verification',
        instruction: 'Complete the final purple-team capstone room, submit the proof-of-concept report, and obtain your certified credential.',
        commandOrAction: 'Export official completion certificate.'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'End-to-end cloud infrastructure penetration testing methodology',
        'Attacking and defending multi-cloud compute, identity, and storage services',
        'Kubernetes cluster security and container isolation auditing',
        'Authoring professional executive cloud security assessment reports'
      ],
      interviewTalkingPoint: 'Completing the HackTheBox Cloud Track equipped me with an offensive mindset that allows me to anticipate attacker lateral movement paths and build robust, defense-in-depth AWS architectures.'
    }
  },

  // =========================================================================
  // 4. FOUNDATIONS: LINUX FOR CLOUD SECURITY
  // =========================================================================
  {
    id: 'linux-bandit',
    category: 'linux',
    roleTitle: 'Core Systems Foundation',
    labTitle: 'OverTheWire: Bandit (Linux Privilege, File & Shell Mastery)',
    originalLink: 'https://overthewire.org/wargames/bandit/',
    platform: 'OverTheWire Wargames',
    difficulty: 'Beginner to Intermediate',
    estimatedTime: '2-3 hours',
    badgeTone: 'amber',
    targetServices: ['Linux Shell', 'File Permissions & SUID', 'SSH Keys', 'Cron & Systemd', 'Base64 & Hex'],
    roleRampUpGuide: {
      summary: 'OverTheWire Bandit is the universal standard for learning practical Linux command-line mastery, file permissions, text manipulation, and security-relevant shell concepts.',
      dayInLife: 'Navigating cloud Linux servers (Amazon Linux 2023, Ubuntu Server), inspecting system processes, and auditing user permission vectors.',
      keyCertifications: ['Linux Professional Institute LPIC-1', 'Red Hat Certified System Administrator (RHCSA)'],
      salaryRange: 'Fundamental Core Skill'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Connect via Secure Shell (SSH)',
        instruction: 'Open your terminal and establish an encrypted SSH session to the Bandit game server on port 2220 with user `bandit0`.',
        commandOrAction: 'ssh bandit0@bandit.labs.overthewire.org -p 2220'
      },
      {
        step: 2,
        title: 'Inspect Hidden Files & Decrypt Password Tokens',
        instruction: 'Master `ls -la`, `cat`, `grep`, `file`, and `tr` to find hidden files, decode base64 hashes, and handle files with spaces or leading dashes.',
        commandOrAction: 'cat ./-filename | base64 -d'
      },
      {
        step: 3,
        title: 'Hunt for SUID Executables & Cron Jobs',
        instruction: 'Progress to levels 15-20: learn to locate executables with the SUID bit set, inspect scheduled cron jobs in `/etc/cron.d/`, and read restricted files.',
        commandOrAction: 'find / -perm -4000 -type f 2>/dev/null'
      },
      {
        step: 4,
        title: 'Complete Level 25 & Record Key Learnings',
        instruction: 'Use SSH private keys, set up local port forwarding, and defeat shell break-outs to obtain mastery of Linux fundamentals.',
        commandOrAction: 'ssh -i bandit14.key bandit14@localhost -p 2220'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Fluent Linux command line operations and pipeline chaining',
        'Understanding UNIX file permissions (rwx, octal notation, SUID/SGID)',
        'SSH public/private key authentication and configuration',
        'Text processing and regex manipulation with grep, awk, and sed'
      ],
      interviewTalkingPoint: 'Since over 90% of cloud workloads run on Linux, my Bandit foundational practice ensures I can troubleshoot, audit, and secure production EC2 instances and containers at the kernel and shell level.'
    }
  },
  {
    id: 'linux-auditd',
    category: 'linux',
    roleTitle: 'Host Security & Auditing',
    labTitle: 'Linux Hardening, Auditd Daemon & File Integrity Monitoring',
    originalLink: 'https://sadservers.com/',
    platform: 'SadServers / Linux Journey',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    badgeTone: 'amber',
    targetServices: ['auditd', 'ausearch / aureport', '/etc/shadow', 'SSH Hardening', 'iptables'],
    roleRampUpGuide: {
      summary: 'Learn how to transform a generic Linux server into a hardened, CIS-compliant bastion host with continuous kernel audit logging and immutable file protection.',
      dayInLife: 'Reviewing host-level audit logs, configuring SSH security policies, locking down root access, and tuning system firewall rules.',
      keyCertifications: ['CIS Linux Benchmark Auditing', 'CompTIA Linux+'],
      salaryRange: '$115,000 - $165,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Harden SSH Daemon Configuration',
        instruction: 'Edit `/etc/ssh/sshd_config` to disable root login, enforce SSH Protocol 2, disable password authentication, and limit max authentication attempts.',
        commandOrAction: 'echo -e "PermitRootLogin no\\nPasswordAuthentication no\\nMaxAuthTries 3" | sudo tee -a /etc/ssh/sshd_config.d/security.conf && sudo systemctl restart sshd'
      },
      {
        step: 2,
        title: 'Install and Configure Linux Audit Framework (auditd)',
        instruction: 'Configure `/etc/audit/rules.d/audit.rules` to monitor critical system files (`/etc/passwd`, `/etc/shadow`, `/etc/sudoers`) for unauthorized write attempts.',
        commandOrAction: 'echo "-w /etc/shadow -p wa -k identity_tampering" | sudo tee -a /etc/audit/rules.d/audit.rules && sudo augenrules --load'
      },
      {
        step: 3,
        title: 'Simulate Identity Tampering & Search Audit Trail',
        instruction: 'Attempt an unauthorized touch on `/etc/shadow` and use `ausearch` to extract the process ID, user ID, and command that triggered the rule.',
        commandOrAction: 'sudo ausearch -k identity_tampering --format text'
      },
      {
        step: 4,
        title: 'Generate Audit Compliance Summary Report',
        instruction: 'Use `aureport` to summarize system authentication failures, executable modifications, and privilege escalation events.',
        commandOrAction: 'sudo aureport --auth --failed --summary'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Kernel-level host auditing using auditd and augenrules',
        'Defending critical identity files from rootkit modification',
        'Production SSH server hardening according to CIS benchmarks',
        'Extracting forensic evidence from Linux system journals'
      ],
      interviewTalkingPoint: 'I implement CIS Level 2 hardening on all base Linux AMIs, including mandatory auditd rules tracking `/etc/shadow` modifications, ensuring zero blind spots on cloud host operating systems.'
    }
  },

  // =========================================================================
  // 5. FOUNDATIONS: PYTHON FOR CLOUD SECURITY AUTOMATION
  // =========================================================================
  {
    id: 'python-boto3',
    category: 'python',
    roleTitle: 'Security Automation Engineering',
    labTitle: 'Boto3 AWS Security Automation: Automated Public S3 Remediation',
    originalLink: 'https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html',
    platform: 'Official Boto3 Documentation & Tutorial',
    difficulty: 'Beginner to Intermediate',
    estimatedTime: '45 mins',
    badgeTone: 'cyan',
    targetServices: ['Python 3', 'Boto3 SDK', 'Amazon S3', 'Public Access Block API'],
    roleRampUpGuide: {
      summary: 'Python is the lingua franca of Cloud Security Automation. Learn to build event-driven scripts that query AWS APIs, detect misconfigurations, and remediate them programmatically.',
      dayInLife: 'Writing Lambda remediation functions, automating vulnerability scans across accounts, and parsing large JSON CloudTrail logs.',
      keyCertifications: ['AWS Certified Developer - Associate', 'Python Institute PCAP'],
      salaryRange: '$125,000 - $175,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Initialize Virtual Environment & Install Boto3',
        instruction: 'Set up an isolated Python environment and install the official AWS SDK for Python (Boto3).',
        commandOrAction: 'python -m venv venv && source venv/bin/activate && pip install boto3'
      },
      {
        step: 2,
        title: 'Write Bucket Auditor Script',
        instruction: 'Create a script that lists all S3 buckets and queries `get_public_access_block` to verify whether Block Public Access is strictly enabled.',
        commandOrAction: 'python -c "import boto3; s3 = boto3.client(\'s3\'); print([b[\'Name\'] for b in s3.list_buckets()[\'Buckets\']])"'
      },
      {
        step: 3,
        title: 'Implement Automated Remediation Function',
        instruction: 'Add logic that automatically applies `put_public_access_block` with all four block settings set to True whenever an open bucket is detected.',
        commandOrAction: 's3.put_public_access_block(Bucket=bucket_name, PublicAccessBlockConfiguration={\'BlockPublicAcls\': True, \'IgnorePublicAcls\': True, \'BlockPublicPolicy\': True, \'RestrictPublicBuckets\': True})'
      },
      {
        step: 4,
        title: 'Execute Script and Verify Immediate Compliance',
        instruction: 'Run your Python script against a test bucket and verify the AWS Console reflects the change to "Bucket and objects not public".',
        commandOrAction: 'python audit_and_remediate_s3.py'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Interacting with AWS cloud APIs using Python and Boto3',
        'Handling pagination, exceptions, and API throttling with botocore',
        'Automated preventative security policy enforcement in code',
        'Creating modular reusable security automation scripts'
      ],
      interviewTalkingPoint: 'I write Python Boto3 automation scripts that proactively audit cloud assets and auto-remediate non-compliant resources in real time, preventing configuration drift.'
    }
  },
  {
    id: 'python-bandit',
    category: 'python',
    roleTitle: 'Application Security & Linting',
    labTitle: 'Bandit: Static Application Security Testing (SAST) for Python',
    originalLink: 'https://github.com/PyCQA/bandit',
    platform: 'PyCQA Open Source Tools',
    difficulty: 'Easy',
    estimatedTime: '30 mins',
    badgeTone: 'cyan',
    targetServices: ['Bandit SAST', 'Python AST', 'Pre-Commit Hooks', 'Secret Detection'],
    roleRampUpGuide: {
      summary: 'Learn how to detect security flaws in Python code (hardcoded passwords, SQL injection, insecure deserialization, weak random generators) before deploying to production.',
      dayInLife: 'Reviewing developer code, configuring SAST scanners in CI/CD pipelines, and writing custom security checks for Python microservices.',
      keyCertifications: ['Certified Secure Software Lifecycle Professional (CSSLP)', 'DevSecOps Certified'],
      salaryRange: '$120,000 - $170,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Install Bandit Security Scanner',
        instruction: 'Install Bandit via pip and inspect the available security scanning profiles.',
        commandOrAction: 'pip install bandit && bandit --version'
      },
      {
        step: 2,
        title: 'Scan Codebase for High-Severity Flaws',
        instruction: 'Execute Bandit recursively against a repository with filters set to output medium and high-severity issues in JSON format.',
        commandOrAction: 'bandit -r ./src -ll -ii -f json -o bandit-report.json'
      },
      {
        step: 3,
        title: 'Analyze and Remediate Identified Findings',
        instruction: 'Locate findings such as `B105: hardcoded_password_string` or `B303: md5` and replace them with secure alternatives (AWS Secrets Manager and SHA-256).',
        commandOrAction: 'Review bandit-report.json and replace hashlib.md5() with hashlib.sha256()'
      },
      {
        step: 4,
        title: 'Configure Automated Git Pre-Commit Hook',
        instruction: 'Set up `.pre-commit-config.yaml` to ensure every developer commit is automatically validated by Bandit before push.',
        commandOrAction: 'pre-commit run --all-files'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Static Application Security Testing (SAST) methodology for Python',
        'Identification of common Python vulnerabilities (OWASP Top 10)',
        'Remediation of weak cryptographic primitives and hardcoded credentials',
        'Integrating pre-commit hooks to shift security left into the IDE'
      ],
      interviewTalkingPoint: 'By establishing Bandit SAST scanning in our developer pre-commit hooks, we eliminated hardcoded credentials and unsafe deserialization bugs before code ever reaches our repository.'
    }
  },

  // =========================================================================
  // 6. FOUNDATIONS: CLOUD NETWORKING FOR SECURITY ENGINEERS
  // =========================================================================
  {
    id: 'net-vpc-immersion',
    category: 'networking',
    roleTitle: 'Network Architecture Security',
    labTitle: 'AWS VPC Immersion Day: Subnets, Route Tables & NACLs vs SGs',
    originalLink: 'https://workshops.aws/card/VPC%20Immersion%20Day',
    platform: 'AWS Official Workshops',
    difficulty: 'Intermediate',
    estimatedTime: '75 mins',
    badgeTone: 'purple',
    targetServices: ['Amazon VPC', 'CIDR IPv4 Planning', 'Security Groups (Stateful)', 'Network ACLs (Stateless)', 'Route Tables'],
    roleRampUpGuide: {
      summary: 'Master the fundamental building block of all cloud security: Virtual Private Clouds. Learn CIDR subnet math, route table isolation, and stateful vs stateless traffic filtering.',
      dayInLife: 'Designing multi-tier VPC architectures, troubleshooting blocked security group ports, auditing public IP allocations, and setting up VPC Peering.',
      keyCertifications: ['AWS Certified Advanced Networking - Specialty (ANS-C01)', 'CompTIA Network+'],
      salaryRange: '$130,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Architect 3-Tier Multi-AZ VPC Topology',
        instruction: 'Create an AWS VPC with CIDR `10.0.0.0/16` and design paired Public, Private Application, and Isolated Database subnets across 2 Availability Zones.',
        commandOrAction: 'aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications \'ResourceType=vpc,Tags=[{Key=Name,Value=Prod-Security-VPC}]\''
      },
      {
        step: 2,
        title: 'Configure Tiered Route Tables and NAT Gateways',
        instruction: 'Attach an Internet Gateway to the Public subnets and route Private Application outbound traffic through a managed NAT Gateway.',
        commandOrAction: 'aws ec2 create-route-table --vpc-id vpc-0123456789'
      },
      {
        step: 3,
        title: 'Implement Least-Privilege Security Group Chaining',
        instruction: 'Configure the Database Security Group to only accept port 5432 (PostgreSQL) from the Application Security Group ID, completely disallowing IP-based ingress.',
        commandOrAction: 'aws ec2 authorize-security-group-ingress --group-id sg-database --protocol tcp --port 5432 --source-group sg-application'
      },
      {
        step: 4,
        title: 'Enforce Stateless Network ACL Layer of Defense',
        instruction: 'Configure Subnet Network ACLs to drop known malicious CIDR ranges and verify traffic filtering using VPC Reachability Analyzer.',
        commandOrAction: 'aws ec2 create-network-acl-entry --network-acl-id acl-0123 --ingress --rule-number 100 --protocol tcp --port-range From=22,To=22 --cidr-block 0.0.0.0/0 --rule-action deny'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'CIDR block planning and subnet partitioning (VLSM)',
        'Stateful (Security Group) vs Stateless (NACL) packet evaluation order',
        'Security Group ID chaining to eliminate fragile IP dependencies',
        'Air-gapping database subnets with zero internet route pathways'
      ],
      interviewTalkingPoint: 'I design cloud networks with defense-in-depth: database tiers reside in fully isolated subnets with no internet gateway or NAT route, and access is strictly governed by security group references rather than IP CIDRs.'
    }
  },
  {
    id: 'net-pcap-analysis',
    category: 'networking',
    roleTitle: 'Network Forensics & Packet Analysis',
    labTitle: 'Wireshark Packet Analysis & AWS VPC Flow Log Correlation',
    originalLink: 'https://www.wireshark.org/',
    platform: 'Wireshark & Packet Forensics Labs',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    badgeTone: 'purple',
    targetServices: ['VPC Flow Logs', 'Wireshark', 'PCAP Inspection', 'DNS Tunneling', 'TCP Handshake'],
    roleRampUpGuide: {
      summary: 'Learn to read raw network traffic: decode packet captures in Wireshark, detect suspicious port scans and C2 beaconing, and aggregate AWS VPC Flow Logs to trace threat actor lateral movement.',
      dayInLife: 'Investigating suspected data exfiltration events, analyzing network flow logs in Athena or Splunk, and validating perimeter firewall effectiveness.',
      keyCertifications: ['Wireshark Certified Network Analyst (WCNA)', 'GCIH'],
      salaryRange: '$125,000 - $175,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Enable AWS VPC Flow Logs to CloudWatch',
        instruction: 'Enable VPC Flow Logs with ALL traffic captured (ACCEPT and REJECT) and 1-minute aggregation intervals.',
        commandOrAction: 'aws ec2 create-flow-logs --resource-type VPC --resource-ids vpc-012345 --traffic-type ALL --log-destination-type cloud-watch-logs'
      },
      {
        step: 2,
        title: 'Filter High-Volume REJECT Signals',
        instruction: 'Use CloudWatch Logs Insights to execute a query locating IPs with repeated REJECT packets on port 22 or 3389 (brute force indicator).',
        commandOrAction: 'fields @timestamp, srcAddr, dstAddr, dstPort, action | filter action == "REJECT" and dstPort in [22, 3389] | stats count() by srcAddr'
      },
      {
        step: 3,
        title: 'Inspect Captured PCAP in Wireshark',
        instruction: 'Open sample network capture in Wireshark and apply display filters (`tcp.flags.syn == 1 and tcp.flags.ack == 0`) to detect port scans.',
        commandOrAction: 'wireshark -r investigation-traffic.pcap'
      },
      {
        step: 4,
        title: 'Detect DNS Data Exfiltration Tunneling',
        instruction: 'Filter DNS requests with excessive payload length (`dns.qry.name.len > 50`) and identify base64-encoded data sent to an attacker nameserver.',
        commandOrAction: 'tshark -r investigation-traffic.pcap -Y "dns.flags.response == 0" -T fields -e dns.qry.name'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'VPC Flow Log record structure (srcAddr, dstAddr, bytes, packets, action)',
        'Wireshark display filters and packet stream reconstruction',
        'Detecting reconnaissance port sweeps and brute force attacks',
        'Recognizing covert network communication channels (DNS tunneling, ICMP payloads)'
      ],
      interviewTalkingPoint: 'VPC Flow Logs are essential for forensic truth; by analyzing rejected connections and DNS query lengths, I can confirm whether a vulnerability probe resulted in actual data ingress or egress.'
    }
  },

  // =========================================================================
  // 7. FOUNDATIONS: DOCKER & CONTAINER SECURITY
  // =========================================================================
  {
    id: 'docker-hardening',
    category: 'docker',
    roleTitle: 'Container Security Engineering',
    labTitle: 'Docker Hardening: Rootless Containers & Dropping Linux Capabilities',
    originalLink: 'https://training.play-with-docker.com/security/',
    platform: 'Play with Docker Classroom',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    badgeTone: 'cyan',
    targetServices: ['Docker Engine', 'Linux Capabilities', 'Seccomp Profiles', 'Non-Root Users'],
    roleRampUpGuide: {
      summary: 'Containers do not contain by default. Learn to eliminate the root user in Dockerfiles, drop unnecessary Linux kernel capabilities, and enforce read-only filesystems.',
      dayInLife: 'Authoring secure Dockerfiles, configuring Kubernetes pod security standards, auditing container runtime security, and preventing container escapes.',
      keyCertifications: ['Certified Kubernetes Security Specialist (CKS)', 'Docker Certified Associate (DCA)'],
      salaryRange: '$135,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Audit Default Insecure Container Capabilities',
        instruction: 'Launch a standard Ubuntu container and inspect the default capabilities granted to process UID 0 (root).',
        commandOrAction: 'docker run --rm -it ubuntu grep Cap /proc/1/status'
      },
      {
        step: 2,
        title: 'Enforce Non-Root User in Dockerfile',
        instruction: 'Update Dockerfile to create an unprivileged user (UID 10001) and set `USER 10001` before the ENTRYPOINT.',
        commandOrAction: 'RUN groupadd -g 10001 appuser && useradd -u 10001 -g appuser -s /sbin/nologin appuser\nUSER 10001'
      },
      {
        step: 3,
        title: 'Drop All Capabilities and Run with Read-Only Filesystem',
        instruction: 'Run the container with `--cap-drop=ALL`, only adding required capabilities, and mount the root filesystem as read-only with a temporary `/tmp` volume.',
        commandOrAction: 'docker run --cap-drop=ALL --read-only --tmpfs /tmp -u 10001:10001 -d secure-api:latest'
      },
      {
        step: 4,
        title: 'Test Container Escape Immunity',
        instruction: 'Attempt to execute administrative commands or install packages inside the container. Confirm the Linux kernel refuses state modification.',
        commandOrAction: 'docker exec -it <container_id> touch /bin/malicious_binary'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Principle of least privilege applied to Linux kernel capabilities',
        'Immutable, read-only container root filesystems',
        'Eliminating root user execution inside containers',
        'Preventing container breakout and host kernel privilege escalation'
      ],
      interviewTalkingPoint: 'Running containers as root is a major anti-pattern; I enforce non-root user execution, `--cap-drop=ALL`, and read-only filesystems across our container workloads.'
    }
  },
  {
    id: 'docker-trivy-scan',
    category: 'docker',
    roleTitle: 'Software Supply Chain Security',
    labTitle: 'Trivy Container Vulnerability Scanning & Distroless Base Images',
    originalLink: 'https://aquasecurity.github.io/trivy/',
    platform: 'Aqua Security Open Source Labs',
    difficulty: 'Easy to Intermediate',
    estimatedTime: '40 mins',
    badgeTone: 'cyan',
    targetServices: ['Trivy Scanner', 'CVE Scanning', 'Google Distroless', 'Alpine Linux', 'CI/CD Pipeline'],
    roleRampUpGuide: {
      summary: 'Learn how to detect known CVEs in container base images, OS packages, and language dependencies using Trivy, and migrate bloated images to secure Distroless alternatives.',
      dayInLife: 'Auditing container registries, setting CVE severity thresholds in deployment pipelines, and managing software bills of materials (SBOMs).',
      keyCertifications: ['CKS', 'Docker Security Specialist'],
      salaryRange: '$130,000 - $180,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Install and Initialize Trivy Scanner',
        instruction: 'Install Trivy CLI and download the latest CVE vulnerability database cache.',
        commandOrAction: 'curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin'
      },
      {
        step: 2,
        title: 'Scan Insecure Base Image for Vulnerabilities',
        instruction: 'Execute a scan against an older Node.js or Python image to observe dozens of critical CVEs in outdated system libraries.',
        commandOrAction: 'trivy image --severity HIGH,CRITICAL node:14-buster'
      },
      {
        step: 3,
        title: 'Refactor to Multi-Stage Build with Google Distroless',
        instruction: 'Refactor the Dockerfile into a multi-stage build that compiles code in a build container, then copies only the binary into `gcr.io/distroless/static-debian12`.',
        commandOrAction: 'FROM golang:1.22 as builder ...\nFROM gcr.io/distroless/static-debian12\nCOPY --from=builder /app/server /'
      },
      {
        step: 4,
        title: 'Re-scan and Enforce Zero Critical Threshold',
        instruction: 'Re-scan the Distroless container image. Confirm vulnerability count drops to 0 and configure pipeline exit code 1 on any critical CVE.',
        commandOrAction: 'trivy image --exit-code 1 --severity CRITICAL my-distroless-app:latest'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Static container image vulnerability scanning with Trivy',
        'Multi-stage Docker build architecture',
        'Distroless minimal container philosophy (removing package managers, bash, curl)',
        'Automated CI/CD vulnerability breaking thresholds'
      ],
      interviewTalkingPoint: 'By migrating our microservices to multi-stage Distroless containers, we reduced our image attack surface by 90% and eliminated OS-level utilities like curl and bash that attackers rely on after code execution.'
    }
  },

  // =========================================================================
  // 8. FOUNDATIONS: INFRASTRUCTURE AS CODE (TERRAFORM) FOR SECURITY
  // =========================================================================
  {
    id: 'iac-terraform-hardening',
    category: 'iac',
    roleTitle: 'Infrastructure as Code Security',
    labTitle: 'Terraform State File Security, Remote Encryption & Locking',
    originalLink: 'https://developer.hashicorp.com/terraform/tutorials',
    platform: 'HashiCorp Official Tutorials',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    badgeTone: 'emerald',
    targetServices: ['HashiCorp Terraform', 'Terraform Remote State', 'Amazon S3', 'Amazon DynamoDB', 'AWS KMS'],
    roleRampUpGuide: {
      summary: 'Terraform state files contain plaintext database passwords, private keys, and sensitive resource configurations. Learn how to secure the state backend with KMS encryption, S3 versioning, and DynamoDB locks.',
      dayInLife: 'Reviewing Terraform pull requests, authoring reusable hardened modules, managing multi-environment state backends, and ensuring secret hygiene.',
      keyCertifications: ['HashiCorp Certified: Terraform Associate', 'AWS Certified DevOps Engineer - Professional'],
      salaryRange: '$130,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Provision Hardened S3 State Storage Bucket',
        instruction: 'Create an S3 bucket configured with default AWS KMS customer-managed key encryption, bucket versioning enabled, and Block Public Access enforced.',
        commandOrAction: 'aws s3api create-bucket --bucket prod-terraform-state-vault-12345 --region us-east-1'
      },
      {
        step: 2,
        title: 'Provision DynamoDB State Locking Table',
        instruction: 'Create an Amazon DynamoDB table with partition key `LockID` (String) to prevent concurrent executions from corrupting infrastructure state.',
        commandOrAction: 'aws dynamodb create-table --table-name terraform-locks --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --billing-mode PAY_PER_REQUEST'
      },
      {
        step: 3,
        title: 'Configure Secure Backend in Terraform Code',
        instruction: 'Declare the backend configuration block in `main.tf` referencing the encrypted bucket, DynamoDB lock table, and `encrypt = true`.',
        commandOrAction: 'terraform {\n  backend "s3" {\n    bucket = "prod-terraform-state-vault-12345"\n    key    = "production/terraform.tfstate"\n    region = "us-east-1"\n    dynamodb_table = "terraform-locks"\n    encrypt = true\n  }\n}'
      },
      {
        step: 4,
        title: 'Initialize and Migrate State to Encrypted Vault',
        instruction: 'Run `terraform init` to migrate existing local state to the encrypted remote S3 vault, ensuring no local `.tfstate` files remain on disk.',
        commandOrAction: 'terraform init -migrate-state'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Securing sensitive plaintext credentials within Terraform state',
        'Preventing state corruption through DynamoDB distributed locking',
        'KMS customer-managed key encryption for compliance audits',
        'State file disaster recovery via S3 versioning'
      ],
      interviewTalkingPoint: 'Terraform state is a prime target for attackers seeking hardcoded secrets; I ensure 100% of our state files are encrypted at rest with customer-managed KMS keys, locked with DynamoDB, and protected by strict bucket policies.'
    }
  },
  {
    id: 'iac-terragoat-checkov',
    category: 'iac',
    roleTitle: 'Policy-as-Code & IaC Auditing',
    labTitle: 'TerraGoat: Hunting & Remediating Vulnerable Terraform Modules',
    originalLink: 'https://github.com/bridgecrewio/terragoat',
    platform: 'Bridgecrew / Palo Alto Networks TerraGoat',
    difficulty: 'Intermediate',
    estimatedTime: '60 mins',
    badgeTone: 'emerald',
    targetServices: ['TerraGoat', 'Checkov', 'Policy-as-Code', 'AWS IAM Misconfigurations', 'S3 Security'],
    roleRampUpGuide: {
      summary: 'Practice hunting and fixing over 40 intentional cloud misconfigurations in TerraGoat, the premier "Vulnerable by Design" Infrastructure as Code repository.',
      dayInLife: 'Running automated IaC posture scans, defining custom organizational Checkov policies, and coaching developers on secure infrastructure code.',
      keyCertifications: ['Checkov Certified Administrator', 'DevSecOps Specialist'],
      salaryRange: '$135,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Clone TerraGoat Vulnerable Repository',
        instruction: 'Clone the TerraGoat repository containing insecure AWS infrastructure definitions.',
        commandOrAction: 'git clone https://github.com/bridgecrewio/terragoat.git && cd terragoat'
      },
      {
        step: 2,
        title: 'Execute Initial Checkov Security Audit',
        instruction: 'Run Checkov against the `terraform/aws` directory and analyze the summary breakdown of failed checks.',
        commandOrAction: 'checkov -d ./terraform/aws --framework terraform'
      },
      {
        step: 3,
        title: 'Remediate S3 and IAM Violations in Code',
        instruction: 'Fix `CKV_AWS_18` (S3 bucket access logging), `CKV_AWS_19` (S3 encryption), and `CKV_AWS_20` (S3 public read ACL) by adding necessary security arguments.',
        commandOrAction: 'Update s3.tf to enforce aws_s3_bucket_server_side_encryption_configuration'
      },
      {
        step: 4,
        title: 'Verify 100% Passing Checkov Status',
        instruction: 'Re-run Checkov scan and confirm the targeted modules now pass compliance checks without any suppressions.',
        commandOrAction: 'checkov -d ./terraform/aws/s3.tf'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Hunting security anti-patterns in Infrastructure as Code',
        'Translating CIS Benchmarks into concrete Terraform block arguments',
        'Authoring policy-as-code guardrails for automated CI enforcement',
        'Remediating compound cloud misconfigurations at the source of truth'
      ],
      interviewTalkingPoint: 'Rather than fighting misconfigurations reactively in the cloud console, I use Checkov and TerraGoat principles to ensure security policies are codified and enforced directly in Terraform prior to deployment.'
    }
  },

  // =========================================================================
  // 8. GOOGLE CLOUD (GCP) SECURITY RAMP-UP LABS
  // =========================================================================
  {
    id: 'gcp-iam-workload-identity',
    category: 'google-cloud',
    roleTitle: 'Google Cloud Security Engineer (PCSE)',
    labTitle: 'Google Cloud IAM & GKE Workload Identity Federation (Zero Static Keys)',
    originalLink: 'https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity',
    officialPdfUrl: 'https://cloud.google.com/security',
    officialGuideName: 'Google Cloud Ramp-Up Guide: Security, Identity and Compliance',
    platform: 'Google Cloud Skills Boost / Official Documentation',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    badgeTone: 'cyan',
    targetServices: ['Google Cloud IAM', 'GKE Workload Identity', 'Service Accounts', 'OIDC Federation'],
    roleRampUpGuide: {
      summary: 'Eliminate long-lived Google Cloud Service Account JSON keys by binding Kubernetes ServiceAccounts directly to Google Cloud IAM identities using Workload Identity Federation.',
      dayInLife: 'Configuring least-privilege IAM roles, auditing service account key creation, and integrating GKE clusters with Google Cloud APIs.',
      keyCertifications: ['Professional Cloud Security Engineer (PCSE)', 'Google Cloud Digital Leader'],
      salaryRange: '$140,000 - $195,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Enable Workload Identity on GKE Cluster',
        instruction: 'Enable Workload Identity on a GKE cluster to establish the identity namespace binding.',
        commandOrAction: 'gcloud container clusters update prod-cluster --workload-pool=PROJECT_ID.svc.id.goog --zone=us-central1-a'
      },
      {
        step: 2,
        title: 'Create Google Cloud IAM Service Account (GSA)',
        instruction: 'Provision a dedicated Google Service Account with scoped permissions (e.g. roles/storage.objectViewer on bucket).',
        commandOrAction: 'gcloud iam service-accounts create gke-storage-reader --description="GSA for reading storage" --display-name="gke-storage-reader"'
      },
      {
        step: 3,
        title: 'Bind Kubernetes KSA to Google GSA via Workload Identity',
        instruction: 'Grant the Kubernetes ServiceAccount the `roles/iam.workloadIdentityUser` role on the Google Service Account.',
        commandOrAction: 'gcloud iam service-accounts add-iam-policy-binding gke-storage-reader@PROJECT_ID.iam.gserviceaccount.com --role roles/iam.workloadIdentityUser --member "serviceAccount:PROJECT_ID.svc.id.goog[default/ksa-storage-reader]"'
      },
      {
        step: 4,
        title: 'Annotate Kubernetes ServiceAccount and Validate Pod Access',
        instruction: 'Annotate the KSA with the GSA email address and deploy a test pod to confirm token generation without storing any static key files.',
        commandOrAction: 'kubectl annotate serviceaccount ksa-storage-reader iam.gke.io/gcp-service-account=gke-storage-reader@PROJECT_ID.iam.gserviceaccount.com'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Eliminating static JSON service account keys in Google Cloud',
        'GKE Workload Identity Federation architecture',
        'Binding Kubernetes ServiceAccounts to Google IAM principals',
        'Scoped IAM permissions for microservice workloads'
      ],
      interviewTalkingPoint: 'I eliminated high-risk static JSON service account credentials across our Kubernetes fleet by implementing GKE Workload Identity Federation, ensuring pods authenticate via short-lived OIDC tokens.'
    }
  },
  {
    id: 'gcp-scc-threat-detection',
    category: 'google-cloud',
    roleTitle: 'Cloud Detection & SecOps Engineer',
    labTitle: 'Google Cloud Security Command Center (SCC) & Chronicle Threat Detection',
    originalLink: 'https://cloud.google.com/security-command-center',
    officialPdfUrl: 'https://cloud.google.com/security',
    officialGuideName: 'Google Cloud Ramp-Up Guide: Security, Identity and Compliance',
    platform: 'Google Cloud Console & Chronicle SecOps',
    difficulty: 'Intermediate',
    estimatedTime: '55 mins',
    badgeTone: 'cyan',
    targetServices: ['Security Command Center (SCC)', 'Google SecOps (Chronicle)', 'Cloud Audit Logs', 'Event Threat Detection'],
    roleRampUpGuide: {
      summary: 'Centralize security posture, identify misconfigurations across cloud assets, and triage real-time security alerts using Google Cloud Security Command Center and Chronicle SecOps.',
      dayInLife: 'Investigating high-severity SCC findings, correlating Cloud Audit Logs with threat intelligence, and configuring automated alert routing to Slack or PagerDuty.',
      keyCertifications: ['Professional Cloud Security Engineer (PCSE)', 'Chronicle Certified Analyst'],
      salaryRange: '$145,000 - $200,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Activate Security Command Center Standard / Premium',
        instruction: 'Initialize Security Command Center at the organization level and enable built-in security services (Security Health Analytics and Event Threat Detection).',
        commandOrAction: 'gcloud scc sources list --organization=ORGANIZATION_ID'
      },
      {
        step: 2,
        title: 'Export Cloud Audit Logs to BigQuery for SIEM Analysis',
        instruction: 'Configure an organization-wide log sink routing Admin Activity and Data Access audit logs to a secure BigQuery dataset.',
        commandOrAction: 'gcloud logging sinks create org-audit-sink bigquery.googleapis.com/projects/PROJECT_ID/datasets/audit_logs --organization=ORGANIZATION_ID --include-children'
      },
      {
        step: 3,
        title: 'Investigate Event Threat Detection Anomaly Alerts',
        instruction: 'Simulate an anomalous IAM key generation or brute force event and triage the finding in SCC Event Threat Detection dashboard.',
        commandOrAction: 'gcloud scc findings list ORGANIZATION_ID --source=SOURCE_ID --filter="state=\\"ACTIVE\\" AND severity=\\"HIGH\\""'
      },
      {
        step: 4,
        title: 'Automate Finding Notification via Cloud Pub/Sub & Cloud Functions',
        instruction: 'Set up an SCC Continuous Export feed that publishes new high-severity findings to a Pub/Sub topic for automated security containment.',
        commandOrAction: 'gcloud scc notifications create high-sev-alerts --organization=ORGANIZATION_ID --pubsub-topic=projects/PROJECT_ID/topics/security-alerts --filter="severity=\\"HIGH\\""'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Organization-level asset discovery with Cloud Asset Inventory',
        'Real-time threat detection with Event Threat Detection and Chronicle',
        'Cloud Audit Log centralization and forensic querying',
        'Continuous export and automated incident notification pipelines'
      ],
      interviewTalkingPoint: 'I architected an organization-wide Security Command Center posture pipeline that correlates Cloud Audit Logs in Chronicle and streams high-severity findings to automated remediation functions in under 30 seconds.'
    }
  },
  {
    id: 'gcp-kms-dlp-protection',
    category: 'google-cloud',
    roleTitle: 'Cloud Data Security Specialist',
    labTitle: 'Google Cloud KMS Envelope Encryption & Cloud Sensitive Data Protection (DLP)',
    originalLink: 'https://cloud.google.com/kms/docs',
    officialPdfUrl: 'https://cloud.google.com/security',
    officialGuideName: 'Google Cloud Ramp-Up Guide: Security, Identity and Compliance',
    platform: 'Google Cloud Security Services',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    badgeTone: 'cyan',
    targetServices: ['Cloud Key Management Service (KMS)', 'Sensitive Data Protection (DLP)', 'Cloud Storage (GCS)', 'CMEK'],
    roleRampUpGuide: {
      summary: 'Implement Customer-Managed Encryption Keys (CMEK) with Cloud KMS for data at rest and discover, classify, and de-identify sensitive PII using Sensitive Data Protection (Cloud DLP).',
      dayInLife: 'Managing cryptographic key rotation, configuring CMEK on BigQuery and GCS buckets, and authoring DLP inspection templates for compliance audits.',
      keyCertifications: ['PCSE', 'CDPSE'],
      salaryRange: '$135,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Provision Cloud KMS Keyring and CryptoKey with Auto-Rotation',
        instruction: 'Create a Cloud KMS keyring in `us-central1` and configure a symmetric encryption key with automated 90-day key rotation.',
        commandOrAction: 'gcloud kms keyrings create data-protection-ring --location=us-central1 && gcloud kms keys create gcs-cmek-key --location=us-central1 --keyring=data-protection-ring --purpose=encryption --rotation-period=7776000s --next-rotation-time=2026-11-01T00:00:00Z'
      },
      {
        step: 2,
        title: 'Enforce CMEK Encryption on Cloud Storage Bucket',
        instruction: 'Grant the GCS service agent `roles/cloudkms.cryptoKeyEncrypterDecrypter` and enforce the KMS key as the default bucket encryption standard.',
        commandOrAction: 'gcloud storage buckets create gs://vault-cmek-protected --location=us-central1 --default-encryption-key=projects/PROJECT_ID/locations/us-central1/keyRings/data-protection-ring/cryptoKeys/gcs-cmek-key'
      },
      {
        step: 3,
        title: 'Configure Cloud DLP Sensitive Data Inspection Template',
        instruction: 'Create a DLP inspection template configured to scan files for credit card numbers (CREDIT_CARD_NUMBER) and US social security numbers (US_SOCIAL_SECURITY_NUMBER).',
        commandOrAction: 'gcloud dlp inspect-templates create --display-name="PII-Scanner" --info-types=CREDIT_CARD_NUMBER,US_SOCIAL_SECURITY_NUMBER'
      },
      {
        step: 4,
        title: 'Execute DLP Scan and De-Identify Test Records',
        instruction: 'Run a Cloud DLP scan on sample customer data, verify masking of sensitive fields with cryptographic hashing, and review the inspection findings report.',
        commandOrAction: 'gcloud dlp jobs create --inspect-template=projects/PROJECT_ID/inspectTemplates/PII-Scanner --storage-type=GCS --bucket=gs://vault-cmek-protected'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Cloud KMS envelope encryption and automated key rotation lifecycle',
        'Configuring Customer-Managed Encryption Keys (CMEK) on GCS and BigQuery',
        'Sensitive data classification and regex inspection using Cloud DLP',
        'Meeting GDPR/HIPAA cryptographic storage mandates on Google Cloud'
      ],
      interviewTalkingPoint: 'I configured Cloud KMS CMEK with automated 90-day rotation for all production storage buckets and implemented Cloud DLP inspection templates to automatically mask PII before it reaches analytical datastores.'
    }
  },
  {
    id: 'gcp-vpc-firewall-armor',
    category: 'google-cloud',
    roleTitle: 'Cloud Network & Perimeter Defender',
    labTitle: 'Google Cloud VPC Firewalls, Cloud Armor & GKE Hardening',
    originalLink: 'https://cloud.google.com/armor',
    officialPdfUrl: 'https://cloud.google.com/security',
    officialGuideName: 'Google Cloud Ramp-Up Guide: Security, Identity and Compliance',
    platform: 'Google Cloud Skills Boost',
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '60 mins',
    badgeTone: 'cyan',
    targetServices: ['VPC Firewall Rules', 'Hierarchical Firewalls', 'Google Cloud Armor', 'VPC Service Controls'],
    roleRampUpGuide: {
      summary: 'Build layered perimeter defenses in Google Cloud: configure hierarchical firewall policies at the organization level, protect public endpoints with Google Cloud Armor WAF/DDoS, and enforce VPC Service Controls.',
      dayInLife: 'Writing Cloud Armor WAF rules, preventing data exfiltration with VPC Service Controls perimeters, and validating zero-trust network boundaries.',
      keyCertifications: ['Professional Cloud Network Engineer', 'PCSE'],
      salaryRange: '$140,000 - $190,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Deploy Hierarchical Organization Firewall Policy',
        instruction: 'Create an organization-wide hierarchical firewall policy that globally blocks inbound SSH (port 22) and RDP (port 3389) across all projects.',
        commandOrAction: 'gcloud compute org-security-policies create --organization=ORGANIZATION_ID --display-name="Org-Baseline-Policy"'
      },
      {
        step: 2,
        title: 'Configure Google Cloud Armor Edge Security Policy',
        instruction: 'Create a Cloud Armor security policy and attach pre-configured WAF rules that block SQL Injection (SQLi) and Cross-Site Scripting (XSS).',
        commandOrAction: 'gcloud compute security-policies create edge-waf-policy && gcloud compute security-policies rules create 1000 --security-policy=edge-waf-policy --expression="evaluatePreconfiguredExpr(\'sqli-v33-stable\')" --action=deny-403'
      },
      {
        step: 3,
        title: 'Attach Cloud Armor Policy to External HTTP(S) Load Balancer',
        instruction: 'Link the Cloud Armor policy to the backend service of the production external Application Load Balancer.',
        commandOrAction: 'gcloud compute backend-services update prod-web-service --security-policy=edge-waf-policy --global'
      },
      {
        step: 4,
        title: 'Enforce VPC Service Controls Data Perimeter',
        instruction: 'Create an Access Context Manager perimeter surrounding Google Cloud Storage and BigQuery to prevent unauthorized API requests originating outside approved networks.',
        commandOrAction: 'gcloud access-context-manager perimeters create prod_data_perimeter --policy=POLICY_ID --resources=projects/PROJECT_NUMBER --restricted-services=storage.googleapis.com,bigquery.googleapis.com'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Hierarchical firewall policy inheritance across Google Cloud organizations',
        'Google Cloud Armor WAF rules and OWASP Top 10 mitigation',
        'VPC Service Controls data exfiltration defense',
        'Securing GKE private clusters without external IP addresses'
      ],
      interviewTalkingPoint: 'By pairing hierarchical organization firewall rules with Google Cloud Armor WAF and VPC Service Controls perimeters, I established a defense-in-depth perimeter that stops both application exploits and credential exfiltration.'
    }
  },

  // =========================================================================
  // 9. MICROSOFT AZURE SECURITY RAMP-UP LABS
  // =========================================================================
  {
    id: 'azure-entra-conditional-access',
    category: 'azure-cloud',
    roleTitle: 'Azure Identity & Access Architect',
    labTitle: 'Microsoft Entra ID, PIM & Conditional Access Policy Enforcement',
    originalLink: 'https://learn.microsoft.com/training/entra',
    officialPdfUrl: 'https://learn.microsoft.com/security',
    officialGuideName: 'Microsoft Learn Ramp-Up Guide: Security, Identity and Compliance',
    platform: 'Microsoft Learn Training Hub',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    badgeTone: 'purple',
    targetServices: ['Microsoft Entra ID', 'Conditional Access', 'Privileged Identity Management (PIM)', 'MFA'],
    roleRampUpGuide: {
      summary: 'Master Microsoft Entra ID (formerly Azure Active Directory), configure Just-In-Time role elevation with Privileged Identity Management (PIM), and enforce zero-trust Conditional Access policies.',
      dayInLife: 'Reviewing risky user sign-ins, managing PIM role activations, auditing managed identities, and configuring passwordless authentication.',
      keyCertifications: ['Microsoft Certified: Identity and Access Administrator Associate (SC-300)', 'SC-900'],
      salaryRange: '$135,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Audit Entra ID Role Assignments & Enable PIM',
        instruction: 'Identify permanent Global Administrators and transition them to eligible roles managed by Privileged Identity Management (PIM) requiring approval.',
        commandOrAction: 'az rest --method get --url "https://graph.microsoft.com/v1.0/roleManagement/directory/roleAssignments"'
      },
      {
        step: 2,
        title: 'Configure Conditional Access Policy for Administrative Portals',
        instruction: 'Create an Entra ID Conditional Access policy targeting Azure Management that mandates Phishing-Resistant MFA and Compliant Devices.',
        commandOrAction: 'Review Conditional Access policy template: Require MFA for Azure Management'
      },
      {
        step: 3,
        title: 'Implement Managed Identities for Azure Workloads',
        instruction: 'Convert static client secrets in app code to Azure System-Assigned Managed Identities for Azure App Services and Virtual Machines.',
        commandOrAction: 'az webapp identity assign --name prod-billing-app --resource-group prod-rg'
      },
      {
        step: 4,
        title: 'Simulate Risky Sign-in and Validate Automatic Remediation',
        instruction: 'Simulate an untrusted IP connection using Tor or VPN and verify Entra Identity Protection flags the session as high risk and forces an immediate password reset.',
        commandOrAction: 'az rest --method get --url "https://graph.microsoft.com/v1.0/identityProtection/riskyUsers"'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Zero-trust identity architecture with Microsoft Entra ID',
        'Privileged Identity Management (PIM) just-in-time elevation',
        'Risk-based Conditional Access policy authoring',
        'Eliminating static credentials with Managed Identities'
      ],
      interviewTalkingPoint: 'I eliminated permanent administrative access across our Azure tenant by enforcing Microsoft Entra PIM with mandatory MFA approval, reducing our standing privilege attack surface to zero.'
    }
  },
  {
    id: 'azure-sentinel-defender-soc',
    category: 'azure-cloud',
    roleTitle: 'Azure Security Operations Analyst (SC-200)',
    labTitle: 'Microsoft Sentinel SIEM & Defender for Cloud Threat Hunting (KQL)',
    originalLink: 'https://learn.microsoft.com/training/defender',
    officialPdfUrl: 'https://learn.microsoft.com/security',
    officialGuideName: 'Microsoft Learn Ramp-Up Guide: Security, Identity and Compliance',
    platform: 'Microsoft Learn Interactive Sandbox',
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '60 mins',
    badgeTone: 'purple',
    targetServices: ['Microsoft Sentinel', 'Microsoft Defender for Cloud', 'Kusto Query Language (KQL)', 'Logic Apps'],
    roleRampUpGuide: {
      summary: 'Collect, detect, investigate, and respond to threats across multi-cloud and hybrid environments using Microsoft Sentinel cloud-native SIEM and Microsoft Defender XDR.',
      dayInLife: 'Writing Kusto Query Language (KQL) threat hunting queries, tuning Defender for Cloud recommendations, investigating incident entities, and authoring automated playbooks.',
      keyCertifications: ['Microsoft Certified: Security Operations Analyst Associate (SC-200)', 'SC-500'],
      salaryRange: '$130,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Onboard Data Connectors to Microsoft Sentinel Workspace',
        instruction: 'Connect Microsoft Entra ID, Azure Activity, and Microsoft Defender for Cloud telemetry into an Azure Log Analytics workspace.',
        commandOrAction: 'az sentinel data-connector create --resource-group soc-rg --workspace-name soc-sentinel --name "AzureActivity" --kind "AzureActivity"'
      },
      {
        step: 2,
        title: 'Author KQL Threat Hunting Query for Brute-Force Activity',
        instruction: 'Write a Kusto Query Language (KQL) query that detects IP addresses with more than 10 failed login attempts followed by a successful sign-in.',
        commandOrAction: 'SigninLogs | where ResultType != "0" | summarize FailedCount = count() by IPAddress, UserPrincipalName | where FailedCount > 10'
      },
      {
        step: 3,
        title: 'Configure Analytics Rule with Automated Incident Creation',
        instruction: 'Create an automated detection scheduled rule in Sentinel that maps findings to the MITRE ATT&CK Initial Access tactic.',
        commandOrAction: 'az sentinel alert-rule create --resource-group soc-rg --workspace-name soc-sentinel --name "Suspicious-Brute-Force" --severity "High"'
      },
      {
        step: 4,
        title: 'Deploy Automated Response Playbook via Azure Logic Apps',
        instruction: 'Trigger a Logic App playbook that automatically revokes user sessions in Entra ID whenever a high-severity Sentinel incident is confirmed.',
        commandOrAction: 'az logic workflow create --resource-group soc-rg --name "Revoke-Compromised-User-Session"'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Cloud SIEM architecture with Microsoft Sentinel and Log Analytics',
        'Kusto Query Language (KQL) threat hunting and forensic data analysis',
        'Incident investigation, entity mapping, and timeline reconstruction',
        'Automated incident containment with Azure Logic Apps playbooks'
      ],
      interviewTalkingPoint: 'I built custom KQL analytics rules in Microsoft Sentinel that detect brute force anomalies and trigger automated Logic App playbooks to revoke compromised Entra ID sessions in under 15 seconds.'
    }
  },
  {
    id: 'azure-keyvault-purview',
    category: 'azure-cloud',
    roleTitle: 'Cloud Data Governance & Encryption Architect',
    labTitle: 'Azure Key Vault Managed HSM & Microsoft Purview Data Governance',
    originalLink: 'https://learn.microsoft.com/azure/key-vault',
    officialPdfUrl: 'https://learn.microsoft.com/security',
    officialGuideName: 'Microsoft Learn Ramp-Up Guide: Security, Identity and Compliance',
    platform: 'Microsoft Learn Enterprise Architecture',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    badgeTone: 'purple',
    targetServices: ['Azure Key Vault', 'Managed HSM', 'Microsoft Purview', 'Customer-Managed Keys (CMK)'],
    roleRampUpGuide: {
      summary: 'Protect cryptographic keys, secrets, and TLS certificates in Azure Key Vault and Managed HSM, and discover sensitive enterprise data across hybrid clouds with Microsoft Purview.',
      dayInLife: 'Configuring access policies and RBAC on Key Vaults, automating certificate auto-renewal, and tracking data lineage in Microsoft Purview.',
      keyCertifications: ['SC-500 (Replaces AZ-500)', 'Microsoft Certified: Azure Security Engineer'],
      salaryRange: '$135,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Deploy Hardened Azure Key Vault with Private Endpoint',
        instruction: 'Provision an Azure Key Vault with soft-delete and purge protection enabled, restricting access to approved virtual networks via Private Link.',
        commandOrAction: 'az keyvault create --name "prod-keyvault-sec" --resource-group "prod-sec-rg" --location "eastus" --enable-purge-protection true --enable-soft-delete true'
      },
      {
        step: 2,
        title: 'Generate RSA Customer-Managed Encryption Key (CMK)',
        instruction: 'Create an RSA-4096 cryptographic key with automated 1-year rotation for encrypting Azure Storage and SQL Database transparently.',
        commandOrAction: 'az keyvault key create --vault-name "prod-keyvault-sec" --name "sql-db-cmek" --kty RSA --size 4096'
      },
      {
        step: 3,
        title: 'Configure Role-Based Access Control (Azure RBAC) for Key Vault',
        instruction: 'Assign the "Key Vault Secrets User" role to the application managed identity, avoiding broad legacy access policies.',
        commandOrAction: 'az role assignment create --role "Key Vault Secrets User" --assignee-object-id <APP_IDENTITY_ID> --scope /subscriptions/<SUB_ID>/resourceGroups/prod-sec-rg/providers/Microsoft.KeyVault/vaults/prod-keyvault-sec'
      },
      {
        step: 4,
        title: 'Register Data Source in Microsoft Purview Governance Portal',
        instruction: 'Scan Azure Blob Storage using Microsoft Purview to automatically map data sensitivity labels and assess regulatory compliance.',
        commandOrAction: 'Review Purview Compliance Manager dashboard: Microsoft Cloud Security Benchmark'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Azure Key Vault security controls (Soft-delete, Purge protection, Private Link)',
        'Managing CMK encryption keys and automated cryptographic rotation',
        'Azure Key Vault RBAC permission model',
        'Data discovery and classification with Microsoft Purview'
      ],
      interviewTalkingPoint: 'I configured Azure Key Vault with purge protection and Private Link, ensuring our application retrieved database connection strings at runtime using Azure RBAC without static credentials.'
    }
  },
  {
    id: 'azure-firewall-jit-access',
    category: 'azure-cloud',
    roleTitle: 'Azure Cloud & AI Security Engineer (SC-500)',
    labTitle: 'Azure Firewall, Network Security Groups & Just-In-Time (JIT) VM Access',
    originalLink: 'https://learn.microsoft.com/azure/firewall/overview',
    officialPdfUrl: 'https://learn.microsoft.com/security',
    officialGuideName: 'Microsoft Learn Ramp-Up Guide: Security, Identity and Compliance',
    platform: 'Microsoft Learn SC-5002 Lab Path',
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '55 mins',
    badgeTone: 'purple',
    targetServices: ['Azure Firewall', 'Network Security Groups (NSGs)', 'Just-In-Time (JIT) VM Access', 'Application Security Groups'],
    roleRampUpGuide: {
      summary: 'Master network boundary security in Azure: configure Network Security Groups, deploy stateful Azure Firewall with Threat Intelligence filtering, and enforce Just-In-Time (JIT) VM access.',
      dayInLife: 'Auditing open inbound ports on virtual networks, designing Hub-and-Spoke network topologies, and managing microsegmentation rules.',
      keyCertifications: ['Cloud and AI Security Engineer Associate (SC-500)', 'AZ-700 Azure Network Engineer'],
      salaryRange: '$140,000 - $195,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Architect Hub-and-Spoke Virtual Network Topology',
        instruction: 'Create an Azure Hub VNet for central firewall routing and peer it with Application Spoke VNets.',
        commandOrAction: 'az network vnet create --name "hub-vnet" --resource-group "net-rg" --address-prefixes "10.0.0.0/16" --subnet-name "AzureFirewallSubnet" --subnet-prefix "10.0.1.0/24"'
      },
      {
        step: 2,
        title: 'Deploy Azure Firewall Standard with Threat Intelligence',
        instruction: 'Provision Azure Firewall Standard and configure threat intelligence mode to "Alert and Deny" for known malicious IP addresses.',
        commandOrAction: 'az network firewall create --name "prod-azfirewall" --resource-group "net-rg" --location "eastus" --threat-intel-mode "Deny"'
      },
      {
        step: 3,
        title: 'Configure NSG Microsegmentation with Application Security Groups',
        instruction: 'Use Application Security Groups (ASGs) to segment Web, Business Logic, and Database tiers without relying on brittle IP addresses.',
        commandOrAction: 'az network asg create --name "asg-database" --resource-group "net-rg" --location "eastus"'
      },
      {
        step: 4,
        title: 'Enable Just-in-Time (JIT) VM Access in Defender for Cloud',
        instruction: 'Lock down port 22 and 3389 so ports are closed by default and only open on-demand for authorized users for 3 hours after approval.',
        commandOrAction: 'az security jit-policy add --resource-group "compute-rg" --location "eastus" --name "default" --vm-name "bastion-vm"'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Hub-and-Spoke enterprise Azure network architecture',
        'Stateful Azure Firewall traffic inspection and Threat Intelligence filtering',
        'Network microsegmentation using Application Security Groups (ASGs)',
        'Just-In-Time (JIT) VM port lockdown mitigating automated brute-force bots'
      ],
      interviewTalkingPoint: 'I replaced permanent open management ports with Defender for Cloud Just-In-Time (JIT) VM Access and routed all outbound traffic through Azure Firewall, blocking 100% of unauthorized egress attempts.'
    }
  },

  // =========================================================================
  // 10. TRYHACKME OFFENSIVE & DEFENSIVE SECURITY LABS
  // =========================================================================
  {
    id: 'thm-pre-security',
    category: 'tryhackme',
    roleTitle: 'Cyber Security Foundations',
    labTitle: 'TryHackMe: Pre Security & Complete Beginner Foundations',
    originalLink: 'https://tryhackme.com/path/presecurity',
    officialPdfUrl: 'https://tryhackme.com/paths',
    officialGuideName: 'TryHackMe Ramp-Up Guide: Offensive & Defensive Security',
    platform: 'TryHackMe Free Tier',
    difficulty: 'Beginner',
    estimatedTime: '60 mins',
    badgeTone: 'rose',
    targetServices: ['Networking Basics', 'Web Fundamentals', 'Linux Command Line', 'Windows Basics'],
    roleRampUpGuide: {
      summary: 'The universal zero-experience entry point: learn how computers talk across networks, master web HTTP methods and status codes, and navigate Linux and Windows shells.',
      dayInLife: 'Understanding the underlying protocols (DNS, TCP, HTTP) that cloud security controls are designed to defend.',
      keyCertifications: ['TryHackMe SEC1 Capstone', 'CompTIA A+'],
      salaryRange: 'Fundamental Prerequisite'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Complete Network OSI & TCP/IP Model Rooms',
        instruction: 'Understand packets, frames, MAC addresses, and the 3-way TCP handshake (SYN, SYN-ACK, ACK).',
        commandOrAction: 'Navigate to tryhackme.com/path/presecurity and complete Network Fundamentals'
      },
      {
        step: 2,
        title: 'Master HTTP Requests, Headers & Status Codes',
        instruction: 'Learn how browsers communicate with web servers using GET, POST, PUT, DELETE, and examine response codes (200, 301, 403, 500).',
        commandOrAction: 'curl -Iv https://tryhackme.com'
      },
      {
        step: 3,
        title: 'Complete Linux Fundamentals Rooms 1, 2, and 3',
        instruction: 'Practice navigating Linux directories, manipulating files, reading logs, and configuring file permissions inside the in-browser VM.',
        commandOrAction: 'cat /etc/os-release && whoami && ls -la'
      },
      {
        step: 4,
        title: 'Complete Complete Beginner Learning Path Capstone',
        instruction: 'Synthesize networking, Linux, and web basics to solve the foundational challenge rooms and earn your Pre Security badge.',
        commandOrAction: 'Submit completion flags on TryHackMe Pre Security path'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'TCP/IP networking model and packet flow fundamentals',
        'HTTP request/response structure and header analysis',
        'Hands-on Linux command line navigation and file permissions',
        'Foundational mental model for all cyber security specializations'
      ],
      interviewTalkingPoint: 'I built strong hands-on fundamentals on TryHackMe Pre Security, ensuring I understand the exact protocol behavior and packet flow behind every cloud firewall and proxy configuration.'
    }
  },
  {
    id: 'thm-soc-level-1',
    category: 'tryhackme',
    roleTitle: 'SOC Analyst Tier 1 / Blue Team',
    labTitle: 'TryHackMe: SOC Level 1 Path & Splunk SIEM Threat Hunting',
    originalLink: 'https://tryhackme.com/paths',
    officialPdfUrl: 'https://tryhackme.com/paths',
    officialGuideName: 'TryHackMe Ramp-Up Guide: Offensive & Defensive Security',
    platform: 'TryHackMe Interactive AttackBox & VMs',
    difficulty: 'Intermediate',
    estimatedTime: '75 mins',
    badgeTone: 'rose',
    targetServices: ['Splunk SIEM', 'CyberChef', 'Wireshark', 'Phishing Analysis', 'YARA'],
    roleRampUpGuide: {
      summary: 'The industry-regarded training path for Security Operations Center (SOC) analysts: ingest raw system logs, detect adversary techniques in Splunk, analyze phishing emails, and decode malicious payloads in CyberChef.',
      dayInLife: 'Triaging SIEM security alerts, analyzing suspicious email attachments, searching proxy logs for C2 beaconing, and writing incident response escalation tickets.',
      keyCertifications: ['SAL1 (TryHackMe SOC Level 1)', 'CompTIA CySA+'],
      salaryRange: '$90,000 - $130,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Ingest and Search Server Logs in Splunk',
        instruction: 'Query authentication and web access logs in Splunk using Search Processing Language (SPL) to isolate failed login spikes.',
        commandOrAction: 'index=web_logs sourcetype=access_combined status=403 | stats count by clientip | sort -count'
      },
      {
        step: 2,
        title: 'De-obfuscate Suspicious Payloads with CyberChef',
        instruction: 'Take base64-encoded and XOR-obfuscated PowerShell commands discovered in incident logs and decode them to plain text.',
        commandOrAction: 'Use CyberChef recipe: "From Base64" -> "Remove null bytes"'
      },
      {
        step: 3,
        title: 'Inspect Email Headers for Phishing Indicators',
        instruction: 'Analyze raw email headers to verify SPF, DKIM, and DMARC alignment and extract originating mail server IPs and URLs.',
        commandOrAction: 'Review Authentication-Results headers for spf=pass and dkim=pass'
      },
      {
        step: 4,
        title: 'Investigate Malware Sandbox Execution Report',
        instruction: 'Analyze behavioral reports from real malware execution in an isolated sandbox, identifying registry persistence keys and outbound C2 domains.',
        commandOrAction: 'Review Sysmon Event ID 1 (Process Create) and Event ID 3 (Network Connect)'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Splunk SPL log search and threat detection syntax',
        'Phishing analysis and email header authentication (SPF/DKIM/DMARC)',
        'Payload de-obfuscation and forensic analysis using CyberChef',
        'Sysmon event log triage and process creation monitoring'
      ],
      interviewTalkingPoint: 'In the TryHackMe SOC Level 1 path, I practiced realistic alert triage, writing targeted Splunk queries to isolate brute force attacks and decoding obfuscated PowerShell scripts using CyberChef.'
    }
  },
  {
    id: 'thm-jr-pentester',
    category: 'tryhackme',
    roleTitle: 'Penetration Tester / Red Team (PT1 Track)',
    labTitle: 'TryHackMe: Jr Penetration Tester & Web Fundamentals Path',
    originalLink: 'https://tryhackme.com/paths',
    officialPdfUrl: 'https://tryhackme.com/paths',
    officialGuideName: 'TryHackMe Ramp-Up Guide: Offensive & Defensive Security',
    platform: 'TryHackMe Labs',
    difficulty: 'Intermediate',
    estimatedTime: '90 mins',
    badgeTone: 'rose',
    targetServices: ['Burp Suite', 'OWASP Top 10', 'Privilege Escalation', 'Nmap', 'Metasploit'],
    roleRampUpGuide: {
      summary: 'Learn ethical hacking methodology: scan network targets with Nmap, intercept and tamper with web traffic using Burp Suite, exploit OWASP Top 10 vulnerabilities, and escalate privileges on Linux and Windows machines.',
      dayInLife: 'Conducting web application security assessments, finding authorization bypasses (IDOR), and demonstrating real-world risk to engineering teams.',
      keyCertifications: ['PT1 (TryHackMe Jr PenTester)', 'eJPT', 'CompTIA PenTest+'],
      salaryRange: '$105,000 - $155,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Perform Host Discovery and Port Scanning with Nmap',
        instruction: 'Execute service version detection and default NSE vulnerability scripts against the target machine.',
        commandOrAction: 'nmap -sC -sV -p- -oN scan-results.txt 10.10.X.X'
      },
      {
        step: 2,
        title: 'Intercept Web Requests with Burp Suite Proxy',
        instruction: 'Configure browser to proxy traffic through Burp Suite, capture HTTP POST requests, and use Burp Repeater to manipulate parameters.',
        commandOrAction: 'Launch Burp Suite -> Proxy -> Intercept -> Send to Repeater'
      },
      {
        step: 3,
        title: 'Exploit Insecure Direct Object References (IDOR)',
        instruction: 'Inspect customer profile API endpoints, modify user ID parameters (`user_id=101` -> `user_id=1`), and view unauthorized records.',
        commandOrAction: 'curl -H "Cookie: session=xyz" http://10.10.X.X/profile?id=1'
      },
      {
        step: 4,
        title: 'Escalate Privileges via Sudo Misconfiguration',
        instruction: 'Inspect `sudo -l` permissions, identify unprivileged commands that can spawn interactive shells, and obtain root flag.',
        commandOrAction: 'sudo -l && sudo find . -exec /bin/sh \\; -quit'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Methodical penetration testing reconnaissance and enumeration',
        'Burp Suite traffic interception, request tampering, and analysis',
        'OWASP Top 10 vulnerabilities (SQLi, IDOR, Broken Authentication)',
        'Linux privilege escalation techniques using misconfigured sudo rights'
      ],
      interviewTalkingPoint: 'Working through the TryHackMe Jr Penetration Tester path gave me hands-on familiarity with attacker tooling like Burp Suite and Nmap, enabling me to anticipate exploitation paths when hardening cloud web applications.'
    }
  },
  {
    id: 'thm-comptia-secplus',
    category: 'tryhackme',
    roleTitle: 'Security Operations & Compliance',
    labTitle: 'TryHackMe: CompTIA Security+ (SY0-701) Hands-On Attack & Defense',
    originalLink: 'https://tryhackme.com/paths',
    officialPdfUrl: 'https://tryhackme.com/paths',
    officialGuideName: 'TryHackMe Ramp-Up Guide: Offensive & Defensive Security',
    platform: 'TryHackMe Rooms',
    difficulty: 'Beginner to Intermediate',
    estimatedTime: '60 mins',
    badgeTone: 'rose',
    targetServices: ['CompTIA Security+ SY0-701', 'Cryptography', 'Identity & Access', 'Vulnerability Assessment'],
    roleRampUpGuide: {
      summary: 'Practical hands-on rooms aligned directly to the CompTIA Security+ (SY0-701) exam objectives: General Security Concepts, Threats/Vulnerabilities, Security Architecture, Security Operations, and Security Program Management.',
      dayInLife: 'Reviewing security posture, conducting basic vulnerability assessments, enforcing security hygiene, and preparing for industry certification.',
      keyCertifications: ['CompTIA Security+ (SY0-701)', 'SEC1 Capstone'],
      salaryRange: '$85,000 - $125,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Complete Cryptography & Symmetric/Asymmetric Ciphers Room',
        instruction: 'Understand the mathematical difference between AES symmetric encryption and RSA/ECC asymmetric key pairs, and practice hashing with SHA-256.',
        commandOrAction: 'echo -n "SecurityPlus701" | sha256sum'
      },
      {
        step: 2,
        title: 'Analyze Identity Federation and Authentication Protocols',
        instruction: 'Compare SAML 2.0, OAuth 2.0, and OpenID Connect (OIDC) authentication flows and review access token structures in JWT.io.',
        commandOrAction: 'Review TryHackMe Authentication Rooms: Tokens, Sessions, and Federation'
      },
      {
        step: 3,
        title: 'Conduct Vulnerability Assessment with OpenVAS / Nessus',
        instruction: 'Run an automated vulnerability scan against an internal network subnet and prioritize findings based on CVSS v3.1 scores.',
        commandOrAction: 'Analyze CVSS score metrics: Base Score, Exploitability, and Impact'
      },
      {
        step: 4,
        title: 'Complete Security+ Capstone Assessment Room',
        instruction: 'Solve practical scenarios testing incident triage, firewall rule remediation, and business continuity planning to validate exam readiness.',
        commandOrAction: 'Submit completion flags on TryHackMe Security+ aligned modules'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'CompTIA Security+ SY0-701 domain knowledge tested in hands-on environments',
        'Symmetric and asymmetric cryptographic architecture and PKI lifecycle',
        'Modern federated authentication protocols (SAML, OAuth, OIDC)',
        'CVSS vulnerability scoring and remediation prioritization'
      ],
      interviewTalkingPoint: 'I paired theoretical CompTIA Security+ study with hands-on practice on TryHackMe, reinforcing concepts like CVSS triage, PKI certificate chains, and federated identity with live virtual machines.'
    }
  },

  // =========================================================================
  // 11. 90-DAY CLOUD ENGINEER ROADMAP (ZEROTOCLOUD)
  // =========================================================================
  {
    id: 'roadmap-month-1-foundations',
    category: 'roadmap-90',
    roleTitle: 'Cloud Engineer (Month 1: Tech Foundations)',
    labTitle: '90-Day Roadmap Month 1: Multi-Tier VPC, Linux SSH Bastion & Terraform Provisioning',
    originalLink: 'https://zerotocloud.co',
    officialPdfUrl: 'https://zerotocloud.co',
    officialGuideName: '90-Day Cloud Engineer Roadmap (Zero to Cloud)',
    platform: 'ZeroToCloud.co Curriculum',
    difficulty: 'Beginner to Intermediate',
    estimatedTime: '90 mins',
    badgeTone: 'emerald',
    targetServices: ['Linux SSH Bastion', 'Amazon VPC Subnets', 'Terraform HCL', 'Docker Containers', 'Python Automation'],
    roleRampUpGuide: {
      summary: 'Month 1 Tech Foundations from the 90-Day Roadmap: create an AWS account, learn core compute and networking services, configure Linux SSH bastions, write Terraform code to deploy basic cloud resources, and package containers with Docker.',
      dayInLife: 'Building cloud infrastructure from code, connecting via SSH, testing routing components, and learning foundational container basics.',
      keyCertifications: ['AWS Certified Cloud Practitioner', 'HashiCorp Certified: Terraform Associate'],
      salaryRange: '$95,000 - $135,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Create Cloud Account & Configure Zero-Billing Cost Alerts',
        instruction: 'Create AWS account, enable root account MFA, and configure AWS Budgets with a $1.00 monthly threshold alert to prevent unexpected bills.',
        commandOrAction: 'aws budgets create-budget --account-id ACCOUNT_ID --budget file://zero-spend-budget.json'
      },
      {
        step: 2,
        title: 'Build Tiered Network with Public and Private Subnets',
        instruction: 'Create an Amazon VPC with public and private subnets, attach an Internet Gateway, and configure routing components for outbound access.',
        commandOrAction: 'aws ec2 create-vpc --cidr-block 10.0.0.0/16'
      },
      {
        step: 3,
        title: 'Deploy Linux Compute Instance & Connect via SSH',
        instruction: 'Launch an Amazon Linux 2023 instance, configure security group access rules, and connect securely using an SSH private key.',
        commandOrAction: 'ssh -i ~/.ssh/cloud-key.pem ec2-user@<PUBLIC_IP>'
      },
      {
        step: 4,
        title: 'Provision Cloud Resources Declaratively with Terraform',
        instruction: 'Write Terraform code (`main.tf`, `variables.tf`, `outputs.tf`) to automate provisioning of the VPC and compute instance, storing state remotely.',
        commandOrAction: 'terraform init && terraform plan && terraform apply'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Setting up secure cloud accounts with zero-billing safeguards',
        'Designing public and private subnet routing topologies',
        'Connecting to Linux compute workloads via SSH key pairs',
        'Automating infrastructure provisioning with Terraform HCL'
      ],
      interviewTalkingPoint: 'In Month 1 of my cloud roadmap, I built a complete multi-tier VPC from scratch using Terraform, incorporating Linux SSH bastions, stateful security groups, and automated cost budget alerts.'
    }
  },
  {
    id: 'roadmap-month-2-projects',
    category: 'roadmap-90',
    roleTitle: 'Cloud Engineer (Month 2: High-Quality Projects)',
    labTitle: '90-Day Roadmap Month 2: Production-Grade Cloud Architecture & Automated CI/CD',
    originalLink: 'https://zerotocloud.co',
    officialPdfUrl: 'https://zerotocloud.co',
    officialGuideName: '90-Day Cloud Engineer Roadmap (Zero to Cloud)',
    platform: 'GitHub & Cloud Projects Portfolio',
    difficulty: 'Intermediate',
    estimatedTime: '120 mins',
    badgeTone: 'emerald',
    targetServices: ['High-Availability ECS/EKS', 'GitHub Actions CI/CD', 'Multi-AZ RDS', 'CloudWatch Observability'],
    roleRampUpGuide: {
      summary: 'Month 2 Projects from the 90-Day Roadmap: transition from tutorials to building 3-5 high-quality, production-grade cloud projects that demonstrate end-to-end engineering competence.',
      dayInLife: 'Architecting resilient multi-AZ applications, setting up continuous delivery pipelines, troubleshooting deployment errors, and filling knowledge gaps.',
      keyCertifications: ['AWS Certified Solutions Architect - Associate (SAA-C03)', 'CKA'],
      salaryRange: '$115,000 - $165,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Architect Highly Available Multi-AZ Application Tier',
        instruction: 'Deploy an auto-scaling application across multiple Availability Zones behind an Application Load Balancer with health checks.',
        commandOrAction: 'aws autoscaling create-auto-scaling-group --auto-scaling-group-name prod-asg --min-size 2 --max-size 6 --vpc-zone-identifier "subnet-1,subnet-2"'
      },
      {
        step: 2,
        title: 'Provision Multi-AZ Relational Database with Auto-Failover',
        instruction: 'Deploy an Amazon RDS PostgreSQL instance configured with Multi-AZ replication and automated daily snapshots.',
        commandOrAction: 'aws rds create-db-instance --db-instance-identifier prod-db --multi-az --engine postgres --allocated-storage 20'
      },
      {
        step: 3,
        title: 'Automate Deployments with GitHub Actions CI/CD',
        instruction: 'Create a GitHub Actions workflow that builds Docker images, runs security scans, and deploys to cloud infrastructure via OIDC role assumption.',
        commandOrAction: 'git commit -m "feat: automated OIDC deployment workflow" && git push origin main'
      },
      {
        step: 4,
        title: 'Implement Centralized Observability & Alarms',
        instruction: 'Set up CloudWatch custom metrics, application log streaming, and SNS notifications alerting when HTTP 5xx error rates exceed 1%.',
        commandOrAction: 'aws cloudwatch put-metric-alarm --alarm-name "High-5xx-Error-Rate" --metric-name HTTPCode_Target_5XX_Count --threshold 10'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Building 3-5 portfolio-ready production cloud systems',
        'Multi-AZ fault tolerance and automated database failover',
        'CI/CD pipeline automation using GitHub Actions and OIDC',
        'Centralized cloud observability, metric dashboards, and alert triggers'
      ],
      interviewTalkingPoint: 'For my Month 2 portfolio capstone, I engineered a highly available containerized application spanning two Availability Zones with automated GitHub Actions CI/CD and multi-AZ RDS failover.'
    }
  },
  {
    id: 'roadmap-month-3-interview-prep',
    category: 'roadmap-90',
    roleTitle: 'Candidate to Hired Cloud Engineer (Month 3: Job & Interview Prep)',
    labTitle: '90-Day Roadmap Month 3: Technical Portfolio, STAR Interview Defense & Job Hunt',
    originalLink: 'https://zerotocloud.co',
    officialPdfUrl: 'https://zerotocloud.co',
    officialGuideName: '90-Day Cloud Engineer Roadmap (Zero to Cloud)',
    platform: 'Career & Interview Command Deck',
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '90 mins',
    badgeTone: 'emerald',
    targetServices: ['Cloud Architecture Defense', 'STAR Behavioral Framing', 'Technical Resume Alignment', 'Mock Interviews'],
    roleRampUpGuide: {
      summary: 'Month 3 Job & Interview Prep from the 90-Day Roadmap: document projects publicly (GitHub, LinkedIn, Medium), rewrite your resume to highlight cloud impact, prepare architecture and STAR behavioral questions, and run mock interviews.',
      dayInLife: 'Refining portfolio architecture diagrams, practicing behavioral interview stories, applying strategically, and networking with engineering managers.',
      keyCertifications: ['All Foundation & Role Credentials Verified'],
      salaryRange: '$120,000 - $175,000 (Target Offer)'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Publish Comprehensive Technical Project Documentation',
        instruction: 'Document your top 3 cloud projects on GitHub with architecture diagrams (using draw.io or Cloudcraft), technical tradeoffs, and reproduction steps.',
        commandOrAction: 'git push origin main && publish project walkthrough on LinkedIn/Medium'
      },
      {
        step: 2,
        title: 'Rewrite Resume Aligned to Cloud Engineer Role',
        instruction: 'Revise resume bullet points to quantify impact using the formula: "Accomplished [X] as measured by [Y] by doing [Z]" (e.g. reduced deployment time by 80% using Terraform).',
        commandOrAction: 'Review resume against SeCloudive Career Guide & ATS keyword baselines'
      },
      {
        step: 3,
        title: 'Prepare Architectural Defense & STAR Behavioral Stories',
        instruction: 'Formulate 5 core STAR (Situation, Task, Action, Result) stories covering troubleshooting an outage, handling disagreement, and resolving security vulnerabilities.',
        commandOrAction: 'Practice model answers in SeCloudive Interview Simulator'
      },
      {
        step: 4,
        title: 'Execute Consistent Outreach & Track Applications',
        instruction: 'Establish a structured tracker for job applications, connect directly with technical recruiters and engineering managers, and iterate based on interview feedback.',
        commandOrAction: 'Track 10 weekly targeted applications and conduct weekly mock interviews'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Documenting cloud architecture and architectural decisions clearly',
        'Quantifying technical achievements on engineering resumes',
        'Mastering the STAR method for behavioral and leadership interviews',
        'Defending system design tradeoffs and failure recovery in technical interviews'
      ],
      interviewTalkingPoint: 'By rigorously practicing architectural defense and structuring my experiences into STAR format stories, I can clearly explain the business rationale and security tradeoffs behind every engineering choice I make.'
    }
  }
]
