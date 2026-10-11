// ==============================================================================
// NAEN Studios Multi-Cloud & Hands-On Learning Resource Catalog
// Authoritative references across: AWS • Azure • GCP • OCI • IBM Cloud
// Plus TryHackMe® & HackTheBox® Cloud Security Attack & Defense Rooms
// ==============================================================================

export const resourceCatalog = {
  // ----------------------------------------------------------------------------
  // 1. AWS OFFICIAL RESOURCES
  // ----------------------------------------------------------------------------
  skillBuilder: { 
    id: 'skillBuilder',
    title: 'AWS Skill Builder', 
    provider: 'aws', 
    category: 'Learning Platform', 
    difficulty: 'All Levels', 
    url: 'https://explore.skillbuilder.aws/', 
    why: 'Build structured AWS knowledge with guided digital learning, ramp-up guides, and hands-on practice.' 
  },
  skillsHub: { 
    id: 'skillsHub',
    title: 'AWS Training & Certification Skills Hub', 
    provider: 'aws', 
    category: 'Career Development', 
    difficulty: 'All Levels', 
    url: 'https://aws.amazon.com/training/skills/', 
    why: 'Find role-based training and certification pathways aligned to cloud security careers.' 
  },
  iamDocs: { 
    id: 'iamDocs',
    title: 'AWS IAM Security & Policy Evaluation Guide', 
    provider: 'aws', 
    category: 'IAM Security', 
    difficulty: 'Intermediate', 
    url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html', 
    why: 'Deepen policy analysis, identity boundaries, least privilege, and trust relationships.' 
  },
  s3Docs: { 
    id: 's3Docs',
    title: 'Amazon S3 Security & Data Protection Documentation', 
    provider: 'aws', 
    category: 'Data Security', 
    difficulty: 'Beginner', 
    url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html', 
    why: 'Strengthen practical knowledge of bucket access, encryption, versioning, and Block Public Access.' 
  },
  vpcDocs: { 
    id: 'vpcDocs',
    title: 'Amazon VPC & Network Boundary Documentation', 
    provider: 'aws', 
    category: 'Network Security', 
    difficulty: 'Intermediate', 
    url: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html', 
    why: 'Learn how subnets, routes, security groups, PrivateLink, and network boundaries shape risk.' 
  },
  cloudTrailDocs: { 
    id: 'cloudTrailDocs',
    title: 'AWS CloudTrail Multi-Region Audit Trail Guide', 
    provider: 'aws', 
    category: 'Monitoring & SIEM', 
    difficulty: 'Intermediate', 
    url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html', 
    why: 'Turn AWS API activity into reliable audit trails, log validation hashes, and incident evidence.' 
  },
  cloudWatchDocs: { 
    id: 'cloudWatchDocs',
    title: 'Amazon CloudWatch Observability & Alarms', 
    provider: 'aws', 
    category: 'Monitoring & SIEM', 
    difficulty: 'Intermediate', 
    url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html', 
    why: 'Build practical detection, alerting, metrics, and operational visibility.' 
  },
  securityBestPractices: { 
    id: 'securityBestPractices',
    title: 'AWS Security Best Practices Whitepaper', 
    provider: 'aws', 
    category: 'Security Foundations', 
    difficulty: 'Intermediate', 
    url: 'https://aws.amazon.com/architecture/security-identity-compliance/', 
    why: 'Connect AWS security controls to a durable identity, data, and compliance strategy.' 
  },
  wellArchitected: { 
    id: 'wellArchitected',
    title: 'AWS Well-Architected Framework: Security Pillar', 
    provider: 'aws', 
    category: 'Architecture Security', 
    difficulty: 'Advanced', 
    url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html', 
    why: 'Review workloads systematically through the Security Pillar and resilient design principles.' 
  },
  securityResources: { 
    id: 'securityResources',
    title: 'AWS Security Learning & Solutions Hub', 
    provider: 'aws', 
    category: 'Security Foundations', 
    difficulty: 'All Levels', 
    url: 'https://aws.amazon.com/security/resources/', 
    why: 'Explore AWS-curated security guidance, solutions, and practical learning references.' 
  },

  // ----------------------------------------------------------------------------
  // 2. MICROSOFT AZURE OFFICIAL RESOURCES
  // ----------------------------------------------------------------------------
  azureLearn: {
    id: 'azureLearn',
    title: 'Microsoft Learn: Azure Security Engineer Associate (AZ-500)',
    provider: 'azure',
    category: 'Learning Platform',
    difficulty: 'Intermediate',
    url: 'https://learn.microsoft.com/en-us/training/courses/az-500t00',
    why: 'Official Microsoft guided learning paths covering identity, platform protection, and security operations.'
  },
  azureSecurityBenchmark: {
    id: 'azureSecurityBenchmark',
    title: 'Microsoft Cloud Security Benchmark (MCSB v3)',
    provider: 'azure',
    category: 'Security Foundations',
    difficulty: 'Intermediate',
    url: 'https://learn.microsoft.com/en-us/security/benchmark/azure/introduction',
    why: 'Industry standard security baseline mapping Azure controls to CIS and NIST SP 800-53.'
  },
  azureEntraDocs: {
    id: 'azureEntraDocs',
    title: 'Microsoft Entra ID & PIM Architectural Documentation',
    provider: 'azure',
    category: 'IAM Security',
    difficulty: 'Intermediate',
    url: 'https://learn.microsoft.com/en-us/entra/identity/',
    why: 'Master Conditional Access, Privileged Identity Management (PIM), and Workload Managed Identities.'
  },
  azureKeyVaultDocs: {
    id: 'azureKeyVaultDocs',
    title: 'Azure Key Vault & Managed HSM Cryptography Guide',
    provider: 'azure',
    category: 'Data Security',
    difficulty: 'Intermediate',
    url: 'https://learn.microsoft.com/en-us/azure/key-vault/general/overview',
    why: 'Cryptographic key management, customer-managed keys (CMK), and automated certificate lifecycle.'
  },
  azureSentinelKql: {
    id: 'azureSentinelKql',
    title: 'Microsoft Sentinel SIEM: KQL Threat Hunting Reference',
    provider: 'azure',
    category: 'Monitoring & SIEM',
    difficulty: 'Advanced',
    url: 'https://learn.microsoft.com/en-us/azure/sentinel/kusto-overview',
    why: 'Learn Kusto Query Language (KQL) to hunt advanced persistent threats across enterprise telemetry.',
    tier: 'Free Docs',
    billingSafetyNote: 'Zero cloud billing; reference syntax & hunting queries'
  },
  azureSecurityRampUpGuide: {
    id: 'azureSecurityRampUpGuide',
    title: 'Microsoft Learn: Security, Identity & Compliance Ramp-Up Guide',
    provider: 'azure',
    category: 'Career Development',
    difficulty: 'All Levels',
    url: 'https://learn.microsoft.com/security',
    why: 'Official Microsoft Ramp-Up curriculum mapping role pathways from fundamentals (SC-900) to enterprise security engineering.',
    tier: '100% Free',
    billingSafetyNote: 'Free interactive modules with zero-cost Microsoft Learn Sandboxes'
  },
  azureDefenderXdr: {
    id: 'azureDefenderXdr',
    title: 'Microsoft Defender XDR & Defender for Cloud Architecture',
    provider: 'azure',
    category: 'Monitoring & SIEM',
    difficulty: 'Intermediate',
    url: 'https://learn.microsoft.com/en-us/defender-for-cloud/',
    why: 'Unified security posture management (CSPM), regulatory compliance dashboards, and multi-cloud server protection.',
    tier: 'Free Docs / 30-Day Trial',
    billingSafetyNote: 'Free documentation & Microsoft Learn lab walkthroughs'
  },
  azurePurviewGovernance: {
    id: 'azurePurviewGovernance',
    title: 'Microsoft Purview: Data Governance & Sensitivity Labels',
    provider: 'azure',
    category: 'Data Security',
    difficulty: 'Intermediate',
    url: 'https://learn.microsoft.com/en-us/purview/',
    why: 'Automate data classification, sensitivity labels, DLP policies, and data lineage across multi-cloud estates.',
    tier: 'Free Docs',
    billingSafetyNote: 'Zero-billing architecture reference & policy templates'
  },
  azureSc900Fundamentals: {
    id: 'azureSc900Fundamentals',
    title: 'Microsoft SC-900: Security, Compliance, and Identity Fundamentals',
    provider: 'azure',
    category: 'Certification & Career',
    difficulty: 'Beginner',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/security-compliance-and-identity-fundamentals/',
    why: 'Foundational certification covering Zero Trust, Microsoft Entra, Defender, Sentinel, and compliance concepts.',
    tier: 'Free Learning / $99 Exam',
    billingSafetyNote: 'Free online self-paced learning paths on Microsoft Learn'
  },
  azureSc500Exam: {
    id: 'azureSc500Exam',
    title: 'Microsoft SC-500: Security Technologies & Transition Pathway',
    provider: 'azure',
    category: 'Certification & Career',
    difficulty: 'Advanced',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/',
    why: 'Advanced security engineering across identity, platform protection, network perimeters, and operations.',
    tier: 'Free Learning / $165 Exam',
    billingSafetyNote: 'Free Microsoft Learn courseware & hands-on GitHub labs'
  },

  // ----------------------------------------------------------------------------
  // 3. GOOGLE CLOUD PLATFORM (GCP) OFFICIAL RESOURCES
  // ----------------------------------------------------------------------------
  gcpArchitectureFramework: {
    id: 'gcpArchitectureFramework',
    title: 'Google Cloud Architecture Framework: Security & Privacy',
    provider: 'gcp',
    category: 'Architecture Security',
    difficulty: 'Advanced',
    url: 'https://cloud.google.com/architecture/framework/security',
    why: 'Google Cloud authoritative design principles for zero trust, data sovereignty, and compliance.',
    tier: '100% Free Docs',
    billingSafetyNote: 'Free architectural design whitepapers and blueprints'
  },
  gcpWorkloadIdentity: {
    id: 'gcpWorkloadIdentity',
    title: 'GKE Workload Identity Federation Guide',
    provider: 'gcp',
    category: 'IAM Security',
    difficulty: 'Intermediate',
    url: 'https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity',
    why: 'Eliminate static service account keys in Kubernetes by binding K8s ServiceAccounts to Google IAM.',
    tier: 'Free Docs',
    billingSafetyNote: 'Free documentation & step-by-step federated identity guide'
  },
  gcpKmsDocs: {
    id: 'gcpKmsDocs',
    title: 'Google Cloud KMS & Envelope Encryption Guide',
    provider: 'gcp',
    category: 'Data Security',
    difficulty: 'Intermediate',
    url: 'https://cloud.google.com/kms/docs',
    why: 'Master Cloud KMS CryptoKeys, automatic 30-day rotation, and CMEK integration with BigQuery and GCS.',
    tier: 'Free Docs',
    billingSafetyNote: 'Free documentation with free tier key version operations'
  },
  gcpSccDocs: {
    id: 'gcpSccDocs',
    title: 'Security Command Center (SCC) & Posture Management',
    provider: 'gcp',
    category: 'Monitoring & SIEM',
    difficulty: 'Intermediate',
    url: 'https://cloud.google.com/security-command-center/docs',
    why: 'Centralized vulnerability management, threat detection, and asset discovery across Google Cloud.',
    tier: 'Free Standard / Premium',
    billingSafetyNote: 'SCC Standard Tier is available at zero additional cost'
  },
  gcpSecurityRampUpGuide: {
    id: 'gcpSecurityRampUpGuide',
    title: 'Google Cloud Ramp-Up Guide: Security, Identity & Compliance',
    provider: 'gcp',
    category: 'Career Development',
    difficulty: 'All Levels',
    url: 'https://cloud.google.com/security',
    why: 'The official 2-page curated Google Cloud Ramp-Up guide detailing skills.google pathways, Chronicle, and PCSE certification.',
    tier: '100% Free',
    billingSafetyNote: '100% Free digital curriculum via skills.google and official documentation'
  },
  gcpChronicleSecOps: {
    id: 'gcpChronicleSecOps',
    title: 'Google Cloud Chronicle SIEM & SecOps Documentation',
    provider: 'gcp',
    category: 'Monitoring & SIEM',
    difficulty: 'Advanced',
    url: 'https://cloud.google.com/chronicle/docs',
    why: 'Petabyte-scale security telemetry ingestion, UDM (Unified Data Model), and YARA-L rule authoring.',
    tier: 'Free Docs',
    billingSafetyNote: 'Free documentation & YARA-L detection syntax reference'
  },
  gcpVpcScDocs: {
    id: 'gcpVpcScDocs',
    title: 'Google Cloud VPC Service Controls (VPC-SC) Perimeter Architecture',
    provider: 'gcp',
    category: 'Network Security',
    difficulty: 'Advanced',
    url: 'https://cloud.google.com/vpc-service-controls/docs',
    why: 'Mitigate data exfiltration risks by creating contextual service perimeters around BigQuery, Cloud Storage, and APIs.',
    tier: 'Free Docs',
    billingSafetyNote: 'Free official architecture guides and dry-run perimeter blueprints'
  },
  gcpCloudDlpDocs: {
    id: 'gcpCloudDlpDocs',
    title: 'Google Cloud Sensitive Data Protection (Cloud DLP) Guide',
    provider: 'gcp',
    category: 'Data Security',
    difficulty: 'Intermediate',
    url: 'https://cloud.google.com/sensitive-data-protection/docs',
    why: 'Automated discovery, classification, and de-identification (masking, tokenization) of PII/PHI in cloud workloads.',
    tier: 'Free Docs / Free Tier',
    billingSafetyNote: 'Free monthly quota available for discovery inspections'
  },
  gcpPcseExamGuide: {
    id: 'gcpPcseExamGuide',
    title: 'Google Cloud Professional Cloud Security Engineer (PCSE) Guide',
    provider: 'gcp',
    category: 'Certification & Career',
    difficulty: 'Advanced',
    url: 'https://cloud.google.com/learn/certification/cloud-security-engineer',
    why: 'Industry-standard credential validating mastery of GCP IAM, organizational policies, network perimeter, and incident response.',
    tier: 'Free Guide / $200 Exam',
    billingSafetyNote: 'Free official sample questions, exam guide & skills tracks'
  },

  // ----------------------------------------------------------------------------
  // 4. ORACLE CLOUD (OCI) & IBM CLOUD OFFICIAL RESOURCES
  // ----------------------------------------------------------------------------
  ociSecurityArch: {
    id: 'ociSecurityArch',
    title: 'OCI Architecture Center: Cloud Security Reference Architecture',
    provider: 'oci',
    category: 'Architecture Security',
    difficulty: 'Intermediate',
    url: 'https://docs.oracle.com/en/solutions/security-reference-architecture/index.html',
    why: 'Tenancy isolation, compartment boundaries, OCI Vault, and off-box virtualization security.'
  },
  ociCloudGuardDocs: {
    id: 'ociCloudGuardDocs',
    title: 'OCI Cloud Guard & Security Zones Guide',
    provider: 'oci',
    category: 'Security Foundations',
    difficulty: 'Intermediate',
    url: 'https://docs.oracle.com/en-us/iaas/cloud-guard/using/index.htm',
    why: 'Continuous compliance monitoring and automated detector/responder recipes across OCI tenancies.'
  },
  ibmFinancialFramework: {
    id: 'ibmFinancialFramework',
    title: 'IBM Cloud Framework for Financial Services',
    provider: 'ibm',
    category: 'Architecture Security',
    difficulty: 'Advanced',
    url: 'https://www.ibm.com/cloud/financial-services',
    why: 'Pre-engineered compliance architectures for highly regulated banking, insurance, and fintech workloads.'
  },
  ibmCbrDocs: {
    id: 'ibmCbrDocs',
    title: 'IBM Cloud Context-Based Restrictions (CBR) Architecture',
    provider: 'ibm',
    category: 'Network Security',
    difficulty: 'Advanced',
    url: 'https://cloud.ibm.com/docs/account?topic=account-context-restrictions-whatis',
    why: 'Enforce network origin boundaries at the data plane for IAM tokens and API calls.'
  },

  // ----------------------------------------------------------------------------
  // 5. TRYHACKME® CLOUD ATTACK & DEFENSE ROOMS
  // ----------------------------------------------------------------------------
  thmCloudBasics: {
    id: 'thmCloudBasics',
    title: 'TryHackMe: Cloud Security Basics & Architecture Room',
    provider: 'tryhackme',
    category: 'Hands-On CTF Lab',
    difficulty: 'Beginner',
    url: 'https://tryhackme.com/room/cloudsecuritybasics',
    why: 'Essential foundation room explaining how cloud paradigms shift security boundaries and the shared responsibility model.'
  },
  thmAwsCompromise: {
    id: 'thmAwsCompromise',
    title: 'TryHackMe: AWS Compromise (Attacking & Defending Leaked Keys)',
    provider: 'tryhackme',
    category: 'Hands-On CTF Lab',
    difficulty: 'Intermediate',
    url: 'https://tryhackme.com/room/awscompromise',
    why: 'Hands-on offensive exploitation and blue team remediation of leaked AWS access keys and IAM policy escalation.'
  },
  thmRedCloud: {
    id: 'thmRedCloud',
    title: 'TryHackMe: Red Cloud (SSRF to IMDSv1 Credential Exfiltration)',
    provider: 'tryhackme',
    category: 'Hands-On CTF Lab',
    difficulty: 'Intermediate',
    url: 'https://tryhackme.com/room/redcloud',
    why: 'Simulates the real-world Capital One breach mechanics: SSRF metadata theft, instance profiles, and S3 exfiltration.'
  },
  thmAzureIr: {
    id: 'thmAzureIr',
    title: 'TryHackMe: Incident Response in Azure Cloud',
    provider: 'tryhackme',
    category: 'Hands-On CTF Lab',
    difficulty: 'Intermediate',
    url: 'https://tryhackme.com/room/azureincidentresponse',
    why: 'Investigate compromised Azure Entra ID service principals and hunt rogue token activity using Microsoft Sentinel.',
    tier: 'Free Room',
    billingSafetyNote: '100% Free TryHackMe room with zero Azure cloud consumption'
  },
  thmPreSecurity: {
    id: 'thmPreSecurity',
    title: 'TryHackMe: Pre-Security Pathway (Networking, Web, Linux)',
    provider: 'tryhackme',
    category: 'Hands-On CTF Pathway',
    difficulty: 'Beginner',
    url: 'https://tryhackme.com/path/outline/presecurity',
    why: 'Essential pre-requisite track covering network fundamentals, OSI model, subnetting, Linux command line, and web basics.',
    tier: 'Free / Free Rooms Included',
    billingSafetyNote: 'Zero cloud billing; in-browser interactive attack/defense machines'
  },
  thmSocLevel1: {
    id: 'thmSocLevel1',
    title: 'TryHackMe: SOC Level 1 Career Path (Cyber Defense & SIEM)',
    provider: 'tryhackme',
    category: 'Hands-On CTF Pathway',
    difficulty: 'Intermediate',
    url: 'https://tryhackme.com/path/outline/soclevel1',
    why: 'Comprehensive blue team career path covering Splunk, ELK, network traffic analysis with Wireshark/Zeek, and digital forensics.',
    tier: 'Free Rooms / Subscription',
    billingSafetyNote: 'Browser-based labs, no AWS/GCP/Azure subscription needed'
  },
  thmJrPentester: {
    id: 'thmJrPentester',
    title: 'TryHackMe: Junior Penetration Tester Pathway',
    provider: 'tryhackme',
    category: 'Hands-On CTF Pathway',
    difficulty: 'Intermediate',
    url: 'https://tryhackme.com/path/outline/jrpenetrationtester',
    why: 'Hands-on offensive methodology covering Burp Suite, Metasploit, privilege escalation, and vulnerability exploitation.',
    tier: 'Free Rooms / Subscription',
    billingSafetyNote: 'Isolated attack boxes with zero financial risk'
  },
  thmCompTIASecPlus: {
    id: 'thmCompTIASecPlus',
    title: 'TryHackMe: CompTIA Security+ SY0-701 Practice Rooms',
    provider: 'tryhackme',
    category: 'Certification & Career',
    difficulty: 'Beginner',
    url: 'https://tryhackme.com/module/comptia-security',
    why: 'Interactive labs mapped to CompTIA Security+ domains: threats, cryptography, identity management, and incident response.',
    tier: 'Free / Subscription',
    billingSafetyNote: 'Practice exam scenarios with zero cloud infrastructure cost'
  },

  // ----------------------------------------------------------------------------
  // 6. HACKTHEBOX® CLOUD & INFRASTRUCTURE MACHINES
  // ----------------------------------------------------------------------------
  htbBucket: {
    id: 'htbBucket',
    title: 'HackTheBox: Bucket (AWS S3 & LocalStack Compromise)',
    provider: 'hackthebox',
    category: 'Hands-On CTF Machine',
    difficulty: 'Medium',
    url: 'https://app.hackthebox.com/machines/Bucket',
    why: 'Hands-on cloud machine featuring LocalStack S3 and DynamoDB misconfiguration leading to web shell execution.',
    tier: 'Free / VIP',
    billingSafetyNote: 'Zero AWS charges; emulated LocalStack target'
  },
  htbIncluded: {
    id: 'htbIncluded',
    title: 'HackTheBox: Included (TFTP, LocalStack & Container Escapes)',
    provider: 'hackthebox',
    category: 'Hands-On CTF Machine',
    difficulty: 'Easy',
    url: 'https://app.hackthebox.com/machines/Included',
    why: 'Exploit container misconfigurations and Docker host mounts on cloud infrastructure to escalate to root.',
    tier: 'Free Machine',
    billingSafetyNote: 'Free HTB machine; zero cloud spending'
  },

  // ----------------------------------------------------------------------------
  // 7. CORE ENGINEERING & IAC FOUNDATIONS
  // ----------------------------------------------------------------------------
  cisBenchmarksOfficial: {
    id: 'cisBenchmarksOfficial',
    title: 'CIS Center for Internet Security: Cloud Benchmarks',
    provider: 'cis',
    category: 'Compliance & Audit',
    difficulty: 'All Levels',
    url: 'https://www.cisecurity.org/cis-benchmarks/',
    why: 'Authoritative, consensus-driven security configuration standards for AWS, Azure, GCP, and OCI.',
    tier: '100% Free PDFs',
    billingSafetyNote: 'Free consensus benchmark PDFs'
  },
  terraformCheckov: {
    id: 'terraformCheckov',
    title: 'Bridgecrew Checkov: Multi-Cloud IaC Security Scanner',
    provider: 'bridgecrew',
    category: 'DevSecOps & Automation',
    difficulty: 'Intermediate',
    url: 'https://www.checkov.io/',
    why: 'Prevent cloud misconfigurations before deployment by scanning Terraform, CloudFormation, and Kubernetes manifests.',
    tier: '100% Free Open Source',
    billingSafetyNote: 'Open-source CLI runs locally in terminal or CI/CD pipeline'
  },
  linuxSurvivalOfficial: {
    id: 'linuxSurvivalOfficial',
    title: 'Linux Journey & Command-Line Foundations',
    provider: 'linux',
    category: 'Foundations',
    difficulty: 'Beginner',
    url: 'https://linuxjourney.com/',
    why: 'Master the Linux terminal, directory tree, file permissions (chmod/chown), process management, systemd, and bash scripting.',
    tier: '100% Free',
    billingSafetyNote: 'Free open educational resource; run on local terminal or WSL'
  },
  pythonBoto3Official: {
    id: 'pythonBoto3Official',
    title: 'Python Cloud Automation & Boto3 Official Documentation',
    provider: 'python',
    category: 'Foundations',
    difficulty: 'Intermediate',
    url: 'https://boto3.amazonaws.com/v1/documentation/api/latest/index.html',
    why: 'The canonical guide for writing Python scripts to query, audit, and automate cloud infrastructure APIs.',
    tier: '100% Free',
    billingSafetyNote: 'Free open-source SDK; runs locally against read-only describe APIs'
  },
  networkingCloudGuide: {
    id: 'networkingCloudGuide',
    title: 'Cloud Networking & CIDR Subnetting Reference',
    provider: 'networking',
    category: 'Foundations',
    difficulty: 'Beginner',
    url: 'https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/',
    why: 'Understand IPv4/IPv6 CIDR math, subnets, route tables, NAT gateways, stateful security groups vs stateless NACLs.',
    tier: '100% Free',
    billingSafetyNote: 'Free educational material; zero infrastructure needed'
  },
  dockerHardeningGuide: {
    id: 'dockerHardeningGuide',
    title: 'Docker Security & Container Hardening Best Practices',
    provider: 'docker',
    category: 'Foundations',
    difficulty: 'Intermediate',
    url: 'https://docs.docker.com/engine/security/',
    why: 'Run non-root containers, minimize image attack surfaces with Alpine/Distroless, manage secrets, and scan with Trivy.',
    tier: '100% Free',
    billingSafetyNote: 'Free open-source Docker engine; run on local workstation'
  },
  terraformLearnOfficial: {
    id: 'terraformLearnOfficial',
    title: 'HashiCorp Learn: Terraform Infrastructure as Code',
    provider: 'terraform',
    category: 'Foundations',
    difficulty: 'Intermediate',
    url: 'https://developer.hashicorp.com/terraform/tutorials',
    why: 'Declarative HCL authoring, remote state locking with S3 & DynamoDB, variables, modules, and Checkov linting.',
    tier: '100% Free',
    billingSafetyNote: 'Free open CLI; pair with LocalStack or terraform plan for zero cloud cost'
  },
  roadmap90DayCloud: {
    id: 'roadmap90DayCloud',
    title: 'ZeroToCloud: 90-Day Cloud Engineer Action Roadmap & Capstones',
    provider: 'roadmap',
    category: 'Career Development',
    difficulty: 'All Levels',
    url: 'https://zerotocloud.co/',
    why: 'The complete day-by-day 3-month roadmap breaking down Month 1 Foundations, Month 2 Multi-Cloud Projects, and Month 3 Interview Prep.',
    tier: '100% Free',
    billingSafetyNote: 'Self-paced architecture guide with free tier budget guardrails'
  }
}

// ------------------------------------------------------------------------------
// Learning Paths Mapping Across All Domains
// ------------------------------------------------------------------------------
export const learningPaths = {
  foundations: {
    title: 'Genesis Cloud Foundations Path',
    brand: 'NAEN Studios',
    curator: 'NAEN Studios Security Engineering',
    intro: 'Master hypervisors, virtualization primitives, Linux administration, Python scripting, networking CIDRs, Docker isolation, and the Shared Responsibility model across all clouds.',
    resources: ['securityBestPractices', 'thmCloudBasics', 'linuxSurvivalOfficial', 'pythonBoto3Official', 'networkingCloudGuide', 'dockerHardeningGuide', 'terraformLearnOfficial', 'azureSecurityBenchmark', 'cisBenchmarksOfficial', 'roadmap90DayCloud']
  },
  iam: { 
    title: 'Identity & Access Management (IAM) Path', 
    brand: 'NAEN Studios',
    curator: 'NAEN Studios Security Engineering',
    intro: 'Your identity and access architecture is the primary perimeter in the modern cloud.', 
    resources: ['iamDocs', 'thmAwsCompromise', 'azureEntraDocs', 'gcpWorkloadIdentity', 'skillBuilder', 'azureSecurityRampUpGuide', 'gcpSecurityRampUpGuide'] 
  },
  s3: { 
    title: 'Storage & Cryptographic Protection Path', 
    brand: 'NAEN Studios',
    curator: 'NAEN Studios Security Engineering',
    intro: 'Enforce Block Public Access, customer-managed KMS encryption, and object immutability.', 
    resources: ['s3Docs', 'htbBucket', 'azureKeyVaultDocs', 'gcpKmsDocs', 'azurePurviewGovernance', 'gcpCloudDlpDocs', 'securityResources'] 
  },
  network: { 
    title: 'Virtual Networks & Perimeter Defense Path', 
    brand: 'NAEN Studios',
    curator: 'NAEN Studios Security Engineering',
    intro: 'Eliminate 0.0.0.0/0 ingress, configure private endpoints, and isolate critical compute workloads.', 
    resources: ['vpcDocs', 'networkingCloudGuide', 'ibmCbrDocs', 'gcpVpcScDocs', 'wellArchitected', 'terraformCheckov'] 
  },
  monitoring: { 
    title: 'Threat Detection & SIEM Observability Path', 
    brand: 'NAEN Studios',
    curator: 'NAEN Studios Security Engineering',
    intro: 'Turn multi-cloud API activity into reliable audit evidence, GuardDuty findings, and Sentinel KQL hunts.', 
    resources: ['cloudTrailDocs', 'cloudWatchDocs', 'azureSentinelKql', 'azureDefenderXdr', 'gcpSccDocs', 'gcpChronicleSecOps', 'thmSocLevel1'] 
  },
  'incident-response': {
    title: 'Incident Response & Minute-0 Threat Containment Path',
    brand: 'NAEN Studios',
    curator: 'NAEN Studios Security Engineering',
    intro: 'Contain real attacks: SSRF metadata theft, compromised STS tokens, and supply-chain CI/CD poisoning.',
    resources: ['thmRedCloud', 'thmAzureIr', 'htbIncluded', 'thmJrPentester', 'securityBestPractices']
  },
  architecture: { 
    title: 'Multi-Cloud Architecture & Hardened IaC Path', 
    brand: 'NAEN Studios',
    curator: 'NAEN Studios Security Engineering',
    intro: 'Build the broad 5-cloud systems view expected from an enterprise cloud security architect.', 
    resources: ['wellArchitected', 'gcpArchitectureFramework', 'ociSecurityArch', 'ibmFinancialFramework', 'dockerHardeningGuide', 'terraformLearnOfficial', 'terraformCheckov'] 
  },
  career: { 
    title: 'Cloud Security Engineer Career & Capstone Path', 
    brand: 'NAEN Studios',
    curator: 'NAEN Studios Security Engineering',
    intro: 'Demonstrate verified employability, defend architectural choices in interviews, and claim the NAEN Studios Credential.', 
    resources: ['skillsHub', 'skillBuilder', 'azureLearn', 'azureSc900Fundamentals', 'azureSc500Exam', 'gcpPcseExamGuide', 'thmCompTIASecPlus', 'roadmap90DayCloud', 'wellArchitected'] 
  }
}

// ------------------------------------------------------------------------------
// Helper Accessor Functions
// ------------------------------------------------------------------------------
export function getResourcesForDomain(domainKey, cloudProvider = 'all') {
  const path = learningPaths[domainKey] || learningPaths.iam
  const allRes = path.resources
    .map(resKey => resourceCatalog[resKey])
    .filter(Boolean)
    .map(res => ({
      ...res,
      curator: 'NAEN Studios',
      brand: 'NAEN Studios',
      curatedBy: 'NAEN Studios Security Engineering'
    }))
  
  if (cloudProvider === 'all') return allRes
  return allRes.filter(res => res.provider === cloudProvider || res.provider === 'tryhackme' || res.provider === 'hackthebox')
}

export function getTryHackMeRoomsForDomain(domainKey) {
  const path = learningPaths[domainKey] || learningPaths.iam
  return path.resources
    .map(resKey => resourceCatalog[resKey])
    .filter(res => res && res.provider === 'tryhackme')
    .map(res => ({
      ...res,
      curator: 'NAEN Studios',
      brand: 'NAEN Studios',
      curatedBy: 'NAEN Studios Security Engineering'
    }))
}

export function getHackTheBoxRoomsForDomain(domainKey) {
  const path = learningPaths[domainKey] || learningPaths.iam
  return path.resources
    .map(resKey => resourceCatalog[resKey])
    .filter(res => res && res.provider === 'hackthebox')
    .map(res => ({
      ...res,
      curator: 'NAEN Studios',
      brand: 'NAEN Studios',
      curatedBy: 'NAEN Studios Security Engineering'
    }))
}

export function getAllMultiCloudResources() {
  return Object.values(resourceCatalog).map(res => ({
    ...res,
    curator: 'NAEN Studios',
    brand: 'NAEN Studios',
    curatedBy: 'NAEN Studios Security Engineering'
  }))
}
