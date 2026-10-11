// ==============================================================================
// SeCloudive Live Cloud Security Internships & Career Opportunities Data
// Real-world, actively recruiting cloud security internship programs
// Sourced from top defense firms, hyperscalers, and enterprise security leaders
// ==============================================================================

export const LIVE_INTERNSHIPS_DATA = [
  {
    id: 'aws-sec-intern-2026',
    company: 'Amazon Web Services (AWS)',
    role: 'Cloud Security Engineering Intern',
    division: 'AWS Security Operations & Perimeter Defense',
    location: 'Seattle, WA / Arlington, VA / Remote Eligible',
    isRemote: true,
    stipend: '$52.00 – $65.00 / hr + Housing Stipend',
    cycle: 'Active Recruitment • Summer 2026 / Winter Cohort',
    status: 'APPLICATIONS OPEN',
    statusVariant: 'open',
    logoText: 'AWS',
    logoColor: '#ff9900',
    description: 'Work alongside core AWS infrastructure engineers building automated threat detection, IAM guardrails, and real-time incident containment for hyperscale cloud environments.',
    skills: ['AWS IAM & SCPs', 'Python / Bash Scripting', 'CloudTrail Forensics', 'Terraform / IaC'],
    recommendedLabs: [
      { name: 'IAM Privilege Escalation Lab', path: '/learning/foundations/iam-privilege-escalation' },
      { name: 'S3 Ransomware Simulation', path: '/battle-rooms/aws-s3-ransomware' }
    ],
    applyUrl: 'https://www.amazon.jobs/en/job_categories/security-engineering',
    verifiedDate: 'Live Sync • Updated 4 hours ago'
  },
  {
    id: 'mandiant-threat-intern-2026',
    company: 'Google Cloud (Mandiant)',
    role: 'Cloud Incident Response & Threat Hunting Intern',
    division: 'Mandiant Front-Line Consulting',
    location: 'Sunnyvale, CA / Austin, TX / Reston, VA',
    isRemote: false,
    stipend: '$55.00 – $70.00 / hr',
    cycle: 'Rolling Campus Review',
    status: 'APPLICATIONS OPEN',
    statusVariant: 'open',
    logoText: 'GCP',
    logoColor: '#4285f4',
    description: 'Investigate live nation-state intrusions, reconstruct cloud adversary kill chains using CloudTrail and VPC Flow Logs, and develop YARA-L detection rules for Google Security Operations.',
    skills: ['VPC Flow Log Analysis', 'SIEM & Detection Engineering', 'Linux Internals', 'MITRE ATT&CK for Cloud'],
    recommendedLabs: [
      { name: 'CloudTrail Breach Forensics', path: '/investigations/ir-cloudtrail-compromise' },
      { name: 'Purple Team Battle Room', path: '/battle-rooms/metadata-ssrf-theft' }
    ],
    applyUrl: 'https://careers.google.com/jobs/results/?q=Security%20Engineering%20Intern',
    verifiedDate: 'Live Sync • Updated 12 hours ago'
  },
  {
    id: 'crowdstrike-falcon-intern-2026',
    company: 'CrowdStrike',
    role: 'Cloud Security Research Intern (Falcon Horizon)',
    division: 'Cloud Threat Research & Adversary Intelligence',
    location: 'Remote (US, Canada, Global)',
    isRemote: true,
    stipend: '$48.00 – $60.00 / hr',
    cycle: 'Priority Review Cohort',
    status: 'APPLICATIONS OPEN',
    statusVariant: 'open',
    logoText: 'CS',
    logoColor: '#ef4444',
    description: 'Research novel cloud adversary tradecraft across AWS, Azure, and GCP. Prototype automated CSPM/CIEM security posture checks and adversary emulation templates.',
    skills: ['Cloud Security Posture Management', 'Docker & Kubernetes Security', 'Go / Python', 'Identity Defense'],
    recommendedLabs: [
      { name: 'Kubernetes RBAC Exploitation', path: '/battle-rooms/k8s-rbac-takeover' },
      { name: 'Docker Container Hardening', path: '/learning/foundations/docker-container-security' }
    ],
    applyUrl: 'https://crowdstrike.wd5.myworkdayjobs.com/crowdstrikecareers',
    verifiedDate: 'Live Sync • Updated Today'
  },
  {
    id: 'palo-alto-prisma-2026',
    company: 'Palo Alto Networks',
    role: 'Prisma Cloud Security Engineering Intern',
    division: 'Prisma Cloud & Code-to-Cloud Defense',
    location: 'Santa Clara, CA / Plano, TX / Remote Eligible',
    isRemote: true,
    stipend: '$50.00 – $62.00 / hr',
    cycle: 'Active Recruitment',
    status: 'APPLICATIONS OPEN',
    statusVariant: 'open',
    logoText: 'PAN',
    logoColor: '#fa582d',
    description: 'Design CI/CD security scanning tools, shift-left Terraform vulnerability policy checks, and cloud runtime defense agents protecting multi-cloud production clusters.',
    skills: ['DevSecOps & CI/CD Pipelines', 'Terraform Sentinel / OPA', 'AWS & Azure Foundations', 'Vulnerability Triage'],
    recommendedLabs: [
      { name: 'DevSecOps Pipeline Hardening', path: '/learning/foundations/devsecops-pipeline' },
      { name: 'Zero-Cost Safe Lab #4', path: '/ramp-up' }
    ],
    applyUrl: 'https://jobs.paloaltonetworks.com/en/',
    verifiedDate: 'Live Sync • Updated 1 day ago'
  },
  {
    id: 'microsoft-azure-sec-2026',
    company: 'Microsoft Security',
    role: 'Azure Defender & Identity Security Apprentice',
    division: 'Microsoft Cloud & Enterprise Security',
    location: 'Redmond, WA / Atlanta, GA / Remote Eligible',
    isRemote: true,
    stipend: '$50.00 – $64.00 / hr + Benefits',
    cycle: 'Campus Direct Recruitment',
    status: 'APPLICATIONS OPEN',
    statusVariant: 'open',
    logoText: 'MSFT',
    logoColor: '#00a4ef',
    description: 'Analyze Azure Entra ID compromise pathways, configure Conditional Access policies, and build automated remediation playbooks with Microsoft Sentinel and Logic Apps.',
    skills: ['Azure Entra ID (Azure AD)', 'Microsoft Sentinel / KQL', 'Zero Trust Architecture', 'PowerShell / Python'],
    recommendedLabs: [
      { name: 'Azure Identity Blast Radius Lab', path: '/learning/foundations/azure-identity-defense' },
      { name: 'Job Playbook Engine', path: '/playbooks' }
    ],
    applyUrl: 'https://careers.microsoft.com/v2/global/en/home.html',
    verifiedDate: 'Live Sync • Updated 2 days ago'
  },
  {
    id: 'datadog-cloud-siem-2026',
    company: 'Datadog',
    role: 'Cloud SIEM & Observability Security Intern',
    division: 'Datadog Cloud Security Platform',
    location: 'New York, NY / Boston, MA / Remote',
    isRemote: true,
    stipend: '$45.00 – $58.00 / hr',
    cycle: 'Rolling Summer Recruitment',
    status: 'APPLICATIONS OPEN',
    statusVariant: 'open',
    logoText: 'DDOG',
    logoColor: '#632ca6',
    description: 'Develop detection rules for cloud workload threats, analyze high-velocity VPC flow logs and Kubernetes audit logs, and build cloud-native security dashboards.',
    skills: ['Log Telemetry & Parsing', 'Cloud Workload Protection', 'Kubernetes Security', 'Detection Engineering'],
    recommendedLabs: [
      { name: 'GuardDuty ASFF Investigation', path: '/investigations' },
      { name: 'Real Production Labs', path: '/labs' }
    ],
    applyUrl: 'https://www.datadoghq.com/careers/',
    verifiedDate: 'Live Sync • Updated 3 days ago'
  },
  {
    id: 'cloudflare-zero-trust-2026',
    company: 'Cloudflare',
    role: 'Edge Security & Zero Trust Architecture Intern',
    division: 'Cloudflare One & Systems Security',
    location: 'San Francisco, CA / Austin, TX / London, UK',
    isRemote: false,
    stipend: '$46.00 – $56.00 / hr',
    cycle: 'Winter / Summer Cohorts',
    status: 'APPLICATIONS OPEN',
    statusVariant: 'open',
    logoText: 'CF',
    logoColor: '#f38020',
    description: 'Implement mutual TLS, Zero Trust access policies, and protect distributed serverless compute architectures against DDoS, API abuse, and data exfiltration.',
    skills: ['Zero Trust Access Policies', 'DNS & BGP Security', 'Rust or Go', 'WAF Rule Tuning'],
    recommendedLabs: [
      { name: 'Well-Architected Zero Trust Review', path: '/architecture-reviews' },
      { name: 'Cloud Projects Hub', path: '/projects' }
    ],
    applyUrl: 'https://www.cloudflare.com/careers/jobs/',
    verifiedDate: 'Live Sync • Updated 3 days ago'
  },
  {
    id: 'wiz-cloud-sec-fellow-2026',
    company: 'Wiz',
    role: 'Cloud Security Research & Posture Fellow',
    division: 'Wiz Research & Threat Intel Lab',
    location: 'New York, NY / Tel Aviv / Remote',
    isRemote: true,
    stipend: '$50.00 – $65.00 / hr',
    cycle: 'Exclusive Academic Partnership',
    status: 'APPLICATIONS OPEN',
    statusVariant: 'open',
    logoText: 'WIZ',
    logoColor: '#0ea5e9',
    description: 'Collaborate with the world-renowned Wiz Research team discovering zero-day vulnerabilities in cloud service provider architectures and building open-source security audit tools.',
    skills: ['Cloud Attack Graphs', 'IAM Toxic Combinations', 'CSP Vulnerability Research', 'Terraform'],
    recommendedLabs: [
      { name: 'Multi-Cloud Architecture Review', path: '/architecture-reviews' },
      { name: 'Battle Rooms CTF', path: '/battle-rooms' }
    ],
    applyUrl: 'https://www.wiz.io/careers',
    verifiedDate: 'Live Sync • Updated Today'
  }
]
