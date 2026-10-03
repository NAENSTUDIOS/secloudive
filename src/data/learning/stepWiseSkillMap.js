// ==============================================================================
// NAEN Studios Step-Wise Skill & Career Map Engine
// TryHackMe / HackTheBox Style RPG Node Progression
// Exclusively designed for NAEN Studios • SeCloudive
// Each step is unlocked sequentially as learners complete verified prerequisites.
// Supports both Single-Cloud Specialty Mode and Multi-Cloud Master Mode.
// ==============================================================================

export const SKILL_MAP_NODES = [
  {
    id: 'step-01',
    stepNumber: 1,
    code: 'GEN-101',
    title: 'Genesis: Cloud Architecture & Security Foundations',
    subtitle: 'Step 1: Core Primitives, Shared Responsibility & Hypervisors',
    badgeEmoji: '🌱',
    themeColor: '#38bdf8',
    difficulty: 'Beginner',
    estimatedTime: '4-6 Hours',
    xpReward: 300,
    flagSecret: 'NAEN{GENESIS_CLOUD_FOUNDATIONS_UNLOCKED}',
    prerequisiteStepId: null, // Always unlocked
    targetRoles: ['Student / Fresher', 'Career Switcher', 'DevOps Transitioner'],
    summary: 'Master the fundamental mechanics of virtualized cloud infrastructure: Hypervisors, Shared Responsibility across IaaS/PaaS/SaaS, Subnetting (CIDR), and the OSI model in modern clouds.',
    
    // Multi-Cloud Cross-Walk Coverage for this Node
    cloudPrims: {
      aws: 'EC2, Nitro Hypervisor, VPC, AWS Shared Responsibility',
      azure: 'Azure Virtual Machines, VNet, Azure Security Responsibility',
      gcp: 'Compute Engine, Andromeda Virtual Network, GCP Security Model',
      oci: 'OCI Compute (Off-box Virtualization), VCN, OCI Shared Model',
      ibm: 'IBM Cloud Virtual Servers, VPC Gen 2, IBM Shared Responsibility'
    },

    curriculumCheckpoints: [
      { id: 'c1-1', title: 'Shared Responsibility Model Matrix across 5 Clouds', type: 'topic', pathId: 'foundations', topicId: 'foundations-shared-resp' },
      { id: 'c1-2', title: 'CIDR Subnet Math & Virtual Cloud Routing Tables', type: 'topic', pathId: 'foundations', topicId: 'foundations-subnets' },
      { id: 'c1-3', title: 'Genesis Foundations Adaptive Knowledge Check', type: 'quiz', pathId: 'foundations' }
    ],

    handsOnLabRef: {
      labId: 'lab-01',
      title: 'Lab 01: Pre-Flight Scoping & Caller Identity Verification',
      route: '/labs/lab-01'
    },

    unlockCriteriaText: 'Complete all 3 Genesis Foundations topics and score ≥ 70% on the Foundations Check.'
  },
  {
    id: 'step-02',
    stepNumber: 2,
    code: 'IAM-201',
    title: 'Identity & Access Management (Zero Static Keys)',
    subtitle: 'Step 2: RBAC, IAM Roles, IMDSv2 & Workload Federation',
    badgeEmoji: '🔑',
    themeColor: '#10b981',
    difficulty: 'Intermediate',
    estimatedTime: '6-8 Hours',
    xpReward: 450,
    flagSecret: 'NAEN{IAM_LEAST_PRIVILEGE_ZERO_TRUST_DEFENDER}',
    prerequisiteStepId: 'step-01',
    targetRoles: ['IAM Analyst', 'Cloud Security Engineer', 'SOC Responder'],
    summary: 'Identity is the primary security perimeter in the modern cloud. Eliminate static API keys, enforce short-lived STS tokens via IMDSv2, and implement Workload Identity Federation.',

    cloudPrims: {
      aws: 'IAM Roles, Instance Profiles, IMDSv2 (`HttpTokens=required`), AWS STS',
      azure: 'Entra ID Managed Identities (System & User Assigned), PIM, Role Assignments',
      gcp: 'Google Cloud Workload Identity Federation, Service Account Impersonation',
      oci: 'OCI Instance Principals, Dynamic Groups (X.509 cert metadata), Compartments',
      ibm: 'IBM Cloud Trusted Profiles, Compute Resource Identity (CRN claims)'
    },

    curriculumCheckpoints: [
      { id: 'c2-1', title: 'IAM Least Privilege & Privilege Boundary Enforcement', type: 'topic', pathId: 'iam', topicId: 'iam-least-privilege' },
      { id: 'c2-2', title: 'Workload Identity Federation: Zero Static Keys Architecture', type: 'topic', pathId: 'iam', topicId: 'iam-roles-sts' },
      { id: 'c2-3', title: 'IAM Security & Least Privilege Module Assessment', type: 'quiz', pathId: 'iam' }
    ],

    handsOnLabRef: {
      labId: 'lab-02',
      title: 'Lab 02: IAM Least Privilege & Stale Credential Deprecation',
      route: '/labs/lab-02'
    },

    unlockCriteriaText: 'Solve Lab 02 and pass the IAM Module Assessment to unlock Object Storage Security.'
  },
  {
    id: 'step-03',
    stepNumber: 3,
    code: 'STR-301',
    title: 'Object Storage & Cryptographic Data Protection',
    subtitle: 'Step 3: Public Access Quarantine, KMS CMKs & Immutability',
    badgeEmoji: '🛡️',
    themeColor: '#f59e0b',
    difficulty: 'Intermediate',
    estimatedTime: '5-7 Hours',
    xpReward: 500,
    flagSecret: 'NAEN{STORAGE_LOCKDOWN_KMS_CMK_SEALED}',
    prerequisiteStepId: 'step-02',
    targetRoles: ['Data Security Architect', 'Cloud Compliance Officer', 'DevSecOps Lead'],
    summary: 'Cloud object stores house the enterprise crown jewels. Enforce account-level Block Public Access, customer-managed KMS key encryption, and Object Lock / WORM immutability.',

    cloudPrims: {
      aws: 'Amazon S3 Block Public Access, Bucket Policies, KMS CMK 365d Rotation, Object Lock',
      azure: 'Blob Storage `allowBlobPublicAccess: false`, Key Vault Customer Managed Keys, Immutability',
      gcp: 'Cloud Storage Uniform Bucket-Level Access, Cloud KMS CryptoKeys, Retention Policies',
      oci: 'OCI Object Storage `NoPublicAccess`, Vault KMS Encryption, Retention Rules',
      ibm: 'IBM Cloud Object Storage (COS) Public Access Block, Key Protect, Retention Holds'
    },

    curriculumCheckpoints: [
      { id: 'c3-1', title: 'Object Storage Public Access Lockdown & Bucket Policies', type: 'topic', pathId: 's3', topicId: 's3-bucket-protection' },
      { id: 'c3-2', title: 'Customer Managed Keys (CMK) & Envelope Encryption (DEK/KEK)', type: 'topic', pathId: 's3', topicId: 's3-kms-encryption' },
      { id: 'c3-3', title: 'Storage & Encryption Module Mastery Assessment', type: 'quiz', pathId: 's3' }
    ],

    handsOnLabRef: {
      labId: 'lab-03',
      title: 'Lab 03: S3 Bucket Public Access Quarantine & KMS Lockdown',
      route: '/labs/lab-03'
    },

    unlockCriteriaText: 'Complete S3 Data Protection checkpoints and execute the Storage Lockdown Runbook.'
  },
  {
    id: 'step-04',
    stepNumber: 4,
    code: 'NET-401',
    title: 'Virtual Networks & Inbound Perimeter Isolation',
    subtitle: 'Step 4: Security Groups, PrivateLink Endpoints & Firewalls',
    badgeEmoji: '🌐',
    themeColor: '#ec4899',
    difficulty: 'Hard',
    estimatedTime: '6-8 Hours',
    xpReward: 550,
    flagSecret: 'NAEN{PERIMETER_QUARANTINE_ISOLATION_VERIFIED}',
    prerequisiteStepId: 'step-03',
    targetRoles: ['Network Security Engineer', 'Cloud Infrastructure Architect'],
    summary: 'Prevent lateral attacker movement and perimeter breaches. Eliminate 0.0.0.0/0 administrative ingress, route API traffic through Private Endpoints, and configure stateful firewalls.',

    cloudPrims: {
      aws: 'VPC Security Groups, Network ACLs, AWS PrivateLink Interface Endpoints, AWS WAF',
      azure: 'Azure Network Security Groups (NSGs), Azure Private Link, Azure Firewall, WAF',
      gcp: 'Google Cloud VPC Firewall Rules, Private Service Connect, Cloud Armor',
      oci: 'OCI Network Security Groups (NSGs), Service Gateway, OCI Web Application Firewall',
      ibm: 'IBM Cloud VPC Security Groups, Virtual Private Endpoints (VPE), Cloud Internet Services'
    },

    curriculumCheckpoints: [
      { id: 'c4-1', title: 'Stateful Virtual Firewalls & Security Group Ingress Hardening', type: 'topic', pathId: 'network', topicId: 'network-security-groups' },
      { id: 'c4-2', title: 'Private Endpoints vs NAT Gateways: Zero-Egress Architecture', type: 'topic', pathId: 'network', topicId: 'network-perimeter' },
      { id: 'c4-3', title: 'Virtual Network Defense Assessment', type: 'quiz', pathId: 'network' }
    ],

    handsOnLabRef: {
      labId: 'lab-04',
      title: 'Lab 04: Emergency Inbound Quarantine & Security Group Remediation',
      route: '/labs/lab-04'
    },

    unlockCriteriaText: 'Isolate vulnerable compute nodes and pass the Virtual Network Defense Assessment.'
  },
  {
    id: 'step-05',
    stepNumber: 5,
    code: 'DET-501',
    title: 'Threat Detection & Autonomous SIEM Engineering',
    subtitle: 'Step 5: CloudTrail Auditing, GuardDuty Alerts & Athena Threat Hunting',
    badgeEmoji: '🔍',
    themeColor: '#8b5cf6',
    difficulty: 'Hard / Forensics',
    estimatedTime: '7-9 Hours',
    xpReward: 650,
    flagSecret: 'NAEN{CLOUDTRAIL_ATHENA_HUNTING_MASTER}',
    prerequisiteStepId: 'step-04',
    targetRoles: ['Threat Hunter', 'SOC Tier 2/3 Analyst', 'SecOps Engineer'],
    summary: 'Uncover advanced persistent threats operating inside the control plane. Author SQL threat hunting queries in Athena, ingest multi-region audit trails, and correlate ML anomaly signals.',

    cloudPrims: {
      aws: 'AWS CloudTrail Multi-Region Trail, Amazon GuardDuty, Amazon Athena, Security Lake',
      azure: 'Azure Activity Log, Microsoft Defender for Cloud, Microsoft Sentinel (KQL)',
      gcp: 'Google Cloud Audit Logs, Security Command Center (SCC), Google Chronicle SIEM',
      oci: 'OCI Audit Service (365d retention), OCI Cloud Guard, OCI Logging Analytics',
      ibm: 'IBM Cloud Activity Tracker, Security and Compliance Center, IBM QRadar SIEM'
    },

    curriculumCheckpoints: [
      { id: 'c5-1', title: 'CloudTrail Multi-Region Log File Validation & Integrity Hashes', type: 'topic', pathId: 'monitoring', topicId: 'monitoring-cloudtrail' },
      { id: 'c5-2', title: 'Athena Threat Hunting Queries: Hunting Stolen STS Credentials', type: 'topic', pathId: 'monitoring', topicId: 'monitoring-detection' },
      { id: 'c5-3', title: 'Threat Hunting & Observability Assessment', type: 'quiz', pathId: 'monitoring' }
    ],

    handsOnLabRef: {
      labId: 'lab-05',
      title: 'Lab 05: CloudTrail Audit Log Validation & GuardDuty Incident Triage',
      route: '/labs/lab-05'
    },

    unlockCriteriaText: 'Execute 3 successful Athena threat hunts and verify multi-region trail immutability.'
  },
  {
    id: 'step-06',
    stepNumber: 6,
    code: 'IR-601',
    title: 'Incident Response & Minute-0 Threat Containment',
    subtitle: 'Step 6: SSRF Exploits, Bedrock AI Injections & OIDC Revocations',
    badgeEmoji: '💥',
    themeColor: '#ef4444',
    difficulty: 'Insane / Live Combat',
    estimatedTime: '8-10 Hours',
    xpReward: 750,
    flagSecret: 'NAEN{MINUTE_ZERO_CONTAINMENT_HERO}',
    prerequisiteStepId: 'step-05',
    targetRoles: ['Incident Commander', 'CIRT Lead', 'Principal Defender'],
    summary: 'Real attack containment under active pressure. Neutralize SSRF metadata theft (Capital One), autonomous AI prompt injections on AWS Bedrock, and supply-chain CI/CD pipeline poisoning.',

    cloudPrims: {
      aws: 'AWS Systems Manager Automation, IAM Session Revocation, Bedrock Guardrails',
      azure: 'Microsoft Sentinel Automated Playbooks (Logic Apps), Entra Revoke-SignInSessions',
      gcp: 'Google Cloud SCC Automated Findings Notification, Pub/Sub Cloud Functions Containment',
      oci: 'OCI Cloud Guard Responder Recipes, OCI Events Python Functions Quarantine',
      ibm: 'IBM QRadar SOAR Playbooks, Context-Based Restrictions Emergency Deny Rules'
    },

    curriculumCheckpoints: [
      { id: 'c6-1', title: 'Minute-0 Incident Triage & Forensic Evidence Preservation', type: 'topic', pathId: 'incident-response', topicId: 'ir-triage' },
      { id: 'c6-2', title: 'Automated Playbook Execution: Revoking Compromised Principal Sessions', type: 'topic', pathId: 'incident-response', topicId: 'ir-containment' },
      { id: 'c6-3', title: 'High-Severity Incident Response Assessment', type: 'quiz', pathId: 'incident-response' }
    ],

    handsOnLabRef: {
      labId: 'room-ssrf-imds-theft',
      title: 'Battle Room: SSRF to IMDSv1 Metadata Theft (Capital One Heist)',
      route: '/battle-rooms'
    },

    unlockCriteriaText: 'Neutralize an active threat in the Battle Room and pass the Incident Response Assessment.'
  },
  {
    id: 'step-07',
    stepNumber: 7,
    code: 'ARC-701',
    title: 'Multi-Cloud Architecture & Hardened IaC Engineering',
    subtitle: 'Step 7: 5-Cloud Crosswalk, Terraform Modules & CI/CD Pipelines',
    badgeEmoji: '🏛️',
    themeColor: '#0ea5e9',
    difficulty: 'Master / Architect',
    estimatedTime: '8-12 Hours',
    xpReward: 850,
    flagSecret: 'NAEN{TERRAFORM_MULTI_CLOUD_HARDENED_ARCHITECT}',
    prerequisiteStepId: 'step-06',
    targetRoles: ['Solutions Architect', 'DevSecOps Architect', 'Enterprise Security Lead'],
    summary: 'Design zero-residual, enterprise multi-cloud architectures. Build production Terraform blueprints supporting AWS (`hashicorp/aws`), Azure (`azurerm`), GCP (`google`), OCI (`oci`), and IBM (`ibm`).',

    cloudPrims: {
      aws: 'AWS Organizations SCPs, Transit Gateway, Terraform AWS Provider v5',
      azure: 'Azure Management Groups, Azure Policy, Terraform AzureRM Provider v3',
      gcp: 'Google Cloud Organization Policies, Shared VPC, Terraform Google Provider v5',
      oci: 'OCI Security Zones, Dynamic Routing Gateway (DRG), Terraform OCI Provider v5',
      ibm: 'IBM Cloud Enterprise Tier, Transit Gateway, Terraform IBM Provider v1.50'
    },

    curriculumCheckpoints: [
      { id: 'c7-1', title: 'Well-Architected Security Pillar Framework across 5 Clouds', type: 'topic', pathId: 'architecture', topicId: 'arch-well-architected' },
      { id: 'c7-2', title: 'Production Multi-Cloud Terraform Engineering with Checkov Scanning', type: 'topic', pathId: 'architecture', topicId: 'arch-terraform' },
      { id: 'c7-3', title: 'Enterprise Architecture & Cloudive Studio Mastery Assessment', type: 'quiz', pathId: 'architecture' }
    ],

    handsOnLabRef: {
      labId: 'cloudive-studio-iac',
      title: 'Cloudive Studio: 5-Cloud Crosswalk & Terraform Auto-Fixer',
      route: '/cloudive-studio'
    },

    unlockCriteriaText: 'Complete the Multi-Cloud Terraform blueprint scan with 0 Checkov/tfsec errors.'
  },
  {
    id: 'step-08',
    stepNumber: 8,
    code: 'CAP-801',
    title: 'Capstone Mission & NAEN Studios Verified Credential',
    subtitle: 'Step 8: Final Enterprise Defense, FinOps Audit & Career Proof',
    badgeEmoji: '👑',
    themeColor: '#eab308',
    difficulty: 'Grandmaster / Verified',
    estimatedTime: '10-14 Hours',
    xpReward: 1200,
    flagSecret: 'NAEN{PRINCIPAL_DEFENDER_CAPSTONE_CONQUERED}',
    prerequisiteStepId: 'step-07',
    targetRoles: ['Principal Cloud Security Engineer', 'CISO / Security Director'],
    summary: 'The ultimate demonstration of career mastery. Resolve a multi-stage compound cyberattack across hybrid cloud infrastructure, export an HMAC-sealed Audit Pack, and earn the NAEN Studios Credential.',

    cloudPrims: {
      aws: 'Full AWS Enterprise Ecosystem Integration',
      azure: 'Microsoft Entra ID + Sentinel + Defender for Cloud',
      gcp: 'Google Cloud SCC Premium + Chronicle SIEM',
      oci: 'OCI Cloud Guard + Vault + Tenancy Governance',
      ibm: 'IBM Cloud Security and Compliance Center + QRadar'
    },

    curriculumCheckpoints: [
      { id: 'c8-1', title: 'Comprehensive Cloud Security Interview Defense Simulation', type: 'interview', route: '/interview-simulator' },
      { id: 'c8-2', title: 'Master Remediation & Compliance Audit Pack Generation (.PDF / .MD)', type: 'audit', route: '/dashboard' },
      { id: 'c8-3', title: 'NAEN Studios Official Verified Credential Seal Issue', type: 'certificate', route: '/report' }
    ],

    handsOnLabRef: {
      labId: 'capstone-audit-pack',
      title: 'Master Capstone: HMAC-SHA256 Cryptographic Audit Dossier Export',
      route: '/verify-audit-pack'
    },

    unlockCriteriaText: 'Achieve 100% Platform Mastery, export the verified Audit Pack, and claim your credential.'
  }
]

export const AUDIENCE_PERSONAS = [
  {
    id: 'student',
    title: 'Student & Academic Fresher',
    emoji: '🎓',
    tagline: 'Zero-to-Hero Foundational Mastery',
    description: 'Tailored for students and graduates entering cloud security. Emphasizes foundational mental models, $0 Free-Tier safe labs, and entry-level interview question banks.',
    recommendedStartingStep: 'step-01',
    perks: ['Free-Tier Safe Lab Sentinel', 'Interactive Foundations (Not PDFs)', 'Beginner Diagnostic Placement']
  },
  {
    id: 'lecturer',
    title: 'Lecturer & Academic Faculty',
    emoji: '👨‍🏫',
    tagline: 'Curriculum, Syllabi & Classroom Grading',
    description: 'Designed for professors, university instructors, and bootcamp trainers. Provides structured courseware, syllabus export rubrics, and automated student submission verification.',
    recommendedStartingStep: 'step-01',
    perks: ['Curriculum Mapping to NIST/CIS', 'Student Verification Checkpoints', 'Official NAEN Studios Syllabus']
  },
  {
    id: 'engineer',
    title: 'Working Cloud & DevOps Engineer',
    emoji: '💼',
    tagline: 'Production Hardening & Threat Triage',
    description: 'Built for active cloud engineers looking to specialize in security. Focuses on minute-0 incident containment, Terraform modules, FinOps debt reduction, and real APT scenarios.',
    recommendedStartingStep: 'step-04',
    perks: ['Multi-Cloud Terraform Blueprints', 'FinOps Curtailed Cost Ledger', 'TryHackMe/HackTheBox Style Rooms']
  },
  {
    id: 'switcher',
    title: 'IT & Career Switcher',
    emoji: '🔄',
    tagline: 'Fast-Track Transferrable Skills',
    description: 'Crafted for sysadmins, developers, or network engineers transitioning into cloud security. Maps your existing IT skills directly to high-paying cloud security competencies.',
    recommendedStartingStep: 'step-02',
    perks: ['Skill Gap Transition Dashboard', 'Cryptographic Proof Portfolio', 'Targeted Recruiter Talking Points']
  }
]
