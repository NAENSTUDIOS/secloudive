// ==============================================================================
// SeCloudive Definitive AWS Enterprise Security Services & Architecture Matrix
// 100% Dedicated to Amazon Web Services (AWS) Cloud Security Engineering
// Aligned with AWS Well-Architected Framework (Security Pillar) & SCS-C02
// ==============================================================================

export const CLOUD_PROVIDERS = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    shortName: 'All AWS Security',
    brandColor: '#ff9900',
    accentColor: '#f59e0b',
    iconEmoji: '🟧',
    cliName: 'aws',
    cliDocUrl: 'https://awscli.amazonaws.com/',
    consoleName: 'AWS Management Console',
    wafName: 'AWS Well-Architected Framework (Security Pillar)',
    certKey: 'AWS Certified Security - Specialty (SCS-C02)',
    marketShare: 'Core AWS Cloud Security'
  },
  {
    id: 'aws_iam',
    name: 'AWS Identity & Access Management',
    shortName: 'IAM & Zero Trust',
    brandColor: '#3b82f6',
    accentColor: '#60a5fa',
    iconEmoji: '🛡️',
    cliName: 'aws iam',
    cliDocUrl: 'https://docs.aws.amazon.com/cli/latest/reference/iam/',
    consoleName: 'AWS IAM & IAM Identity Center',
    wafName: 'AWS Security: Identity & Permissions Management',
    certKey: 'SCS-C02 • Domain 1 (Threats & Vulnerabilities)',
    marketShare: 'Least Privilege & SCPs'
  },
  {
    id: 'aws_network',
    name: 'AWS Infrastructure & Network Defense',
    shortName: 'VPC & Perimeter Defense',
    brandColor: '#0ea5e9',
    accentColor: '#38bdf8',
    iconEmoji: '🌐',
    cliName: 'aws ec2',
    cliDocUrl: 'https://docs.aws.amazon.com/cli/latest/reference/ec2/',
    consoleName: 'Amazon VPC, Security Groups & Network Firewall',
    wafName: 'AWS Security: Infrastructure & Perimeter Protection',
    certKey: 'SCS-C02 • Domain 2 (Infrastructure Security)',
    marketShare: 'Network Isolation & DDoS Shield'
  },
  {
    id: 'aws_storage',
    name: 'AWS Data Protection & Cryptography',
    shortName: 'S3, KMS & Macie',
    brandColor: '#10b981',
    accentColor: '#34d399',
    iconEmoji: '📦',
    cliName: 'aws s3api',
    cliDocUrl: 'https://docs.aws.amazon.com/cli/latest/reference/s3api/',
    consoleName: 'Amazon S3 & AWS Key Management Service (KMS)',
    wafName: 'AWS Security: Data Protection & Immutability',
    certKey: 'SCS-C02 • Domain 3 (Data Protection)',
    marketShare: 'Envelope Encryption & Public Block'
  },
  {
    id: 'aws_detection',
    name: 'AWS Detection & Incident Response',
    shortName: 'GuardDuty & Security Hub',
    brandColor: '#ec4899',
    accentColor: '#f472b6',
    iconEmoji: '🚨',
    cliName: 'aws guardduty',
    cliDocUrl: 'https://docs.aws.amazon.com/cli/latest/reference/guardduty/',
    consoleName: 'Amazon GuardDuty, CloudTrail & AWS Security Hub',
    wafName: 'AWS Security: Threat Detection & Incident Response',
    certKey: 'SCS-C02 • Domain 4 (Management & Security Governance)',
    marketShare: 'Real-Time Threat Intelligence'
  }
]

// ------------------------------------------------------------------------------
// Comprehensive AWS Security Architecture & CLI Runbook Matrix (12 Core Domains)
// ------------------------------------------------------------------------------
export const MULTI_CLOUD_CROSSWALK_5CLOUDS = [
  {
    id: 'aws-identity-rbac',
    category: 'Identity & Access Management',
    concept: 'IAM Policies, Roles & Zero-Trust Access Control',
    aws: {
      service: 'AWS IAM & IAM Identity Center',
      resource: 'IAM Users, Groups, Roles, Permission Boundaries, SCPs',
      cli: 'aws iam get-account-authorization-details',
      bestPractice: 'Enforce MFA on all console access, eliminate permanent IAM user access keys, attach Permission Boundaries, and use IAM Access Analyzer to validate JSON policies.'
    }
  },
  {
    id: 'aws-workload-identity',
    category: 'Identity & Access Management',
    concept: 'Workload & Machine Identity (STS & Instance Profiles)',
    aws: {
      service: 'AWS Security Token Service (STS) & Instance Profiles',
      resource: 'EC2 Instance Profiles, EKS IRSA (IAM Roles for Service Accounts), Lambda Execution Roles',
      cli: 'aws sts get-caller-identity',
      bestPractice: 'Never embed AWS keys in code. Use IAM Roles with Instance Profiles for EC2 and OpenID Connect (OIDC) federation for GitHub Actions and Kubernetes pods.'
    }
  },
  {
    id: 'aws-storage-security',
    category: 'Data Protection & Encryption',
    concept: 'Object Storage Defense & Ransomware Immutability',
    aws: {
      service: 'Amazon S3 & S3 Object Lock',
      resource: 'S3 Buckets, Bucket Policies, Access Points, Object Lock, Block Public Access',
      cli: 'aws s3api get-public-access-block --bucket <bucket-name>',
      bestPractice: 'Enable S3 Block Public Access at the AWS account level. Apply restrictive Bucket Policies enforcing TLS (`aws:SecureTransport: true`) and enable S3 Versioning with Object Lock.'
    }
  },
  {
    id: 'aws-encryption-kms',
    category: 'Data Protection & Encryption',
    concept: 'Key Management & Envelope Encryption',
    aws: {
      service: 'AWS Key Management Service (KMS)',
      resource: 'Customer Managed Keys (CMKs), Key Policies, Cryptographic Grants',
      cli: 'aws kms list-keys',
      bestPractice: 'Use Customer Managed Keys (CMKs) with annual automatic rotation. Scope Key Policies to authorized principals only and use Encryption Context for cryptographic integrity.'
    }
  },
  {
    id: 'aws-network-perimeter',
    category: 'Infrastructure & Network Defense',
    concept: 'VPC Segmentation & Perimeter Firewalls',
    aws: {
      service: 'Amazon VPC, Security Groups & Network ACLs',
      resource: 'VPC Subnets, Route Tables, Internet Gateways, NAT Gateways, Security Groups, NACLs',
      cli: 'aws ec2 describe-security-groups --filters Name=ip-permission.cidr,Values="0.0.0.0/0"',
      bestPractice: 'Never open administrative ports (22, 3389) to 0.0.0.0/0. Use stateful Security Groups for microsegmentation and AWS Systems Manager Session Manager for bastionless access.'
    }
  },
  {
    id: 'aws-ddos-waf',
    category: 'Infrastructure & Network Defense',
    concept: 'Application Layer Filtering & DDoS Protection',
    aws: {
      service: 'AWS WAFv2 & AWS Shield',
      resource: 'Web ACLs, Rule Groups, Rate-based Rules, Managed Rule Sets (Core, SQLi, Known Bad Inputs)',
      cli: 'aws wafv2 list-web-acls --scope REGIONAL',
      bestPractice: 'Deploy AWS WAF on Application Load Balancers and CloudFront distributions with Rate-Based rules (limit requests to 100/5min per IP) to mitigate brute-force attacks.'
    }
  },
  {
    id: 'aws-threat-detection',
    category: 'Detection & Incident Response',
    concept: 'Intelligent Threat Detection & Anomaly Monitoring',
    aws: {
      service: 'Amazon GuardDuty & AWS Security Hub',
      resource: 'GuardDuty Detectors, Threat Findings, Security Hub Compliance Standards (CIS, NIST, PCI-DSS)',
      cli: 'aws guardduty list-findings --detector-id <id>',
      bestPractice: 'Enable Amazon GuardDuty across all active regions. Enable S3 Protection, EKS Protection, and Malware Protection. Stream high-severity findings to EventBridge for automated quarantine.'
    }
  },
  {
    id: 'aws-audit-logging',
    category: 'Detection & Incident Response',
    concept: 'Immutable Audit Logging & Forensic Trail',
    aws: {
      service: 'AWS CloudTrail & Amazon CloudWatch',
      resource: 'Multi-Region Trails, Management Events, S3 Data Events, CloudWatch Log Groups, Log Metric Filters',
      cli: 'aws cloudtrail describe-trails',
      bestPractice: 'Configure an organization-wide Multi-Region CloudTrail. Enable Log File Validation and forward logs to a centralized, isolated Security Account S3 bucket with KMS encryption.'
    }
  },
  {
    id: 'aws-forensic-investigation',
    category: 'Detection & Incident Response',
    concept: 'Athena SQL Forensics & Incident Response',
    aws: {
      service: 'Amazon Athena & AWS Detective',
      resource: 'CloudTrail Athena Tables, VPC Flow Log Tables, Detective Graph Summaries',
      cli: 'aws athena start-query-execution --query-string "SELECT eventname, count(*) FROM cloudtrail_logs GROUP BY 1"',
      bestPractice: 'Partition CloudTrail logs in Athena by year, month, and day for cost-efficient sub-second incident queries during active compromises.'
    }
  },
  {
    id: 'aws-secrets-management',
    category: 'Data Protection & Governance',
    concept: 'Secrets Rotation & Zero-Hardcoded Credentials',
    aws: {
      service: 'AWS Secrets Manager & SSM Parameter Store',
      resource: 'Secrets, Auto-Rotation Lambda Triggers, SecureString Parameters',
      cli: 'aws secretsmanager list-secrets',
      bestPractice: 'Store all database passwords and API tokens in AWS Secrets Manager with automatic 30-day rotation via Lambda. Eliminate all plain-text configuration files.'
    }
  },
  {
    id: 'aws-container-security',
    category: 'Compute & Container Security',
    concept: 'EKS & Container Defense',
    aws: {
      service: 'Amazon EKS & Amazon ECR',
      resource: 'ECR Enhanced Scanning, EKS IRSA, Pod Security Standards, Network Policies',
      cli: 'aws ecr describe-repositories',
      bestPractice: 'Enable ECR continuous vulnerability scanning. Enforce EKS Pod Security Standards (Restricted profile) and attach scoped IAM Roles via IRSA rather than worker node instance roles.'
    }
  },
  {
    id: 'aws-iac-security',
    category: 'Governance & DevSecOps',
    concept: 'Infrastructure as Code Guardrails & Compliance',
    aws: {
      service: 'AWS Config & AWS CloudFormation Guard',
      resource: 'AWS Config Rules, Conformance Packs, Remediation Actions, cfn-guard policies',
      cli: 'aws configservice describe-compliance-by-config-rule',
      bestPractice: 'Enforce pre-commit IaC scanning (Checkov, tfsec) and continuous AWS Config evaluation against CIS AWS Foundations Benchmark v3.0.'
    }
  }
]

// ------------------------------------------------------------------------------
// AWS Enterprise Lab CLI & Console Command Bank
// ------------------------------------------------------------------------------
export const MULTI_CLOUD_LAB_COMMANDS = {
  'iam-least-privilege': {
    aws: {
      cli: 'aws iam update-access-key --user-name CandidateDev --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive',
      console: 'Open AWS Console > IAM > Users > CandidateDev > Security Credentials > Deactivate Access Key',
      verify: 'aws iam list-access-keys --user-name CandidateDev'
    }
  },
  's3-public-block': {
    aws: {
      cli: 'aws s3api put-public-access-block --bucket secloudive-prod-vault --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"',
      console: 'Open AWS Console > Amazon S3 > secloudive-prod-vault > Permissions > Edit Block Public Access > Select All > Save changes',
      verify: 'aws s3api get-public-access-block --bucket secloudive-prod-vault'
    }
  },
  'imdsv2-enforcement': {
    aws: {
      cli: 'aws ec2 modify-instance-metadata-options --instance-id i-0123456789abcdef0 --http-tokens required --http-endpoint enabled --http-put-response-hop-limit 1',
      console: 'Open AWS Console > EC2 > Instances > Select instance > Actions > Instance settings > Modify instance metadata options > V2 only (token required) > Hop limit: 1',
      verify: 'aws ec2 describe-instances --instance-ids i-0123456789abcdef0 --query "Reservations[].Instances[].MetadataOptions"'
    }
  },
  'guardduty-remediation': {
    aws: {
      cli: 'aws guardduty create-filter --detector-id 12abc34d567e890f123456789example --name AutoQuarantine --finding-criteria "Criterion={\\"severity\\":{\\"Gte\\":7}}"',
      console: 'Open AWS Console > Amazon GuardDuty > Findings > Filter by Severity >= 7.0 > Actions > Remediate via EventBridge Rule',
      verify: 'aws guardduty list-findings --detector-id 12abc34d567e890f123456789example'
    }
  },
  'cloudtrail-athena': {
    aws: {
      cli: 'aws athena start-query-execution --query-string "SELECT eventname, count(*) as call_count FROM cloudtrail_logs WHERE eventsource=\'iam.amazonaws.com\' GROUP BY eventname ORDER BY call_count DESC LIMIT 10"',
      console: 'Open AWS Console > Amazon Athena > Query Editor > Run query on cloudtrail_logs table',
      verify: 'aws athena get-query-execution --query-execution-id <id>'
    }
  }
}

export function getMultiCloudCliForStep(stepId = 'iam-least-privilege', cloudId = 'aws') {
  const item = MULTI_CLOUD_LAB_COMMANDS[stepId] || MULTI_CLOUD_LAB_COMMANDS['iam-least-privilege']
  return item?.aws?.cli || 'aws sts get-caller-identity'
}

export function getMultiCloudConsoleForStep(stepId = 'iam-least-privilege', cloudId = 'aws') {
  const item = MULTI_CLOUD_LAB_COMMANDS[stepId] || MULTI_CLOUD_LAB_COMMANDS['iam-least-privilege']
  return item?.aws?.console || 'Open AWS Management Console > Select target service > Review security baseline configuration'
}

