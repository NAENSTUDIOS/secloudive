// =========================================================================
// SeCloudive Enterprise AWS Incident Library & Threat Simulation Bank
// Covers FinTech, SaaS, Healthcare, E-Commerce, and Cloud Native Enterprises
// =========================================================================

export const ENTERPRISE_INCIDENTS = [
  {
    id: 'INC-IAM-001',
    category: 'Identity & Access Management',
    severity: 'CRITICAL',
    companyType: 'FinTech Payment Gateway',
    title: 'AdministratorAccess Granted to Contractor Account with Cross-Account Trust Abuse',
    businessContext: 'A third-party frontend development agency was provisioned an IAM role to debug an API integration. An engineer attached AdministratorAccess instead of a scoped policy, and the externalId condition was omitted.',
    timeline: [
      { time: 'T-00:00', event: 'Contractor IAM role updated with AdministratorAccess policy.' },
      { time: 'T-00:14', event: 'Adversary compromises contractor workstation, extracts session token.' },
      { time: 'T-00:26', event: 'Unrecognized IP assumes role ProductionGatewayAdmin via STS from Tor exit node.' },
      { time: 'T-00:41', event: 'New IAM user created with console access; CloudTrail trail deletion attempted.' }
    ],
    symptoms: 'GuardDuty alert: UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration. CloudWatch billing anomaly triggered for new compute swarms.',
    availableEvidence: [
      'CloudTrail Event: sts:AssumeRole for role ProductionGatewayAdmin (IP: 185.220.101.4)',
      'CloudTrail Event: iam:CreateUser for username backup-sync-admin',
      'IAM Policy Document showing AdministratorAccess without Permission Boundary'
    ],
    awsServices: ['AWS IAM', 'AWS STS', 'AWS CloudTrail', 'Amazon GuardDuty', 'AWS Organizations'],
    rootCause: 'Lack of Service Control Policy (SCP) blocking wildcard AdministratorAccess in developer accounts and absence of externalId constraint in cross-account trust policy.',
    investigationTasks: [
      'Query Athena CloudTrail logs for all actions performed by assumed role session.',
      'Check if any secondary IAM access keys or console users were spawned.',
      'Revoke active STS sessions issued prior to current UTC timestamp.'
    ],
    securityFindings: [
      'Over-privileged cross-account IAM trust relationship without externalId.',
      'Missing IAM permission boundaries on role creation.',
      'No multi-region CloudTrail trail protection against deletion.'
    ],
    businessImpact: 'High risk of PCI-DSS Level 1 decertification, payment routing tampering, and regulatory disclosure mandates.',
    technicalImpact: 'Full account takeover vulnerability with root-equivalent execution rights.',
    remediationPlan: [
      'Attach inline Deny policy for all STS tokens issued before T-00:26.',
      'Delete unauthorized IAM user backup-sync-admin.',
      'Implement AWS Organizations SCP preventing iam:AttachUserPolicy with AdministratorAccess.'
    ],
    awsBestPractices: 'Enforce ABAC tagging, mandatory MFA for assume role, and IAM Access Analyzer automated policy validation.',
    attackPath: 'Contractor Workstation Compromise -> Stolen Temporary STS Token -> AssumeRole Bypass (Missing externalId) -> Create Secondary Admin -> CloudTrail Suppression Attempt',
    interviewQuestions: [
      {
        question: 'How does an externalId prevent confused deputy attacks in AWS cross-account role trust?',
        expectedInsight: 'It acts as a shared secret verified by STS, ensuring a third party cannot use their customer role ARN to access another customer\'s AWS account.'
      },
      {
        question: 'If an adversary assumes an admin role, how do you immediately revoke their access without breaking other production workloads?',
        expectedInsight: 'Apply an inline policy with an explicit Deny using the aws:TokenIssueTime condition to revoke tokens issued before the incident timestamp.'
      }
    ],
    careerRoleActions: {
      cloudSecurityEngineer: 'Authors SCPs and enforces Terraform IAM permission boundaries across the landing zone.',
      socAnalyst: 'Triages GuardDuty finding, correlates CloudTrail IP addresses, and executes session revocation playbook.',
      devSecOpsEngineer: 'Integrates Checkov/tfsec in CI/CD pipeline to reject Terraform PRs containing wildcard IAM statements.'
    }
  },

  {
    id: 'INC-S3-002',
    category: 'S3 & Data Security',
    severity: 'CRITICAL',
    companyType: 'HealthTech Electronic Health Records',
    title: 'HIPAA Patient Diagnostic S3 Vault Publicly Exposed via ACL Drift',
    businessContext: 'During a data lake migration, a data engineering script mistakenly used PutObjectAcl with PublicRead, overriding inherited bucket policies on an un-blocked bucket.',
    timeline: [
      { time: 'T-00:00', event: 'Bulk upload script executes with s3:PutObjectAcl set to public-read.' },
      { time: 'T-01:10', event: 'Automated internet search engine crawler begins indexing DICOM imaging records.' },
      { time: 'T-02:30', event: 'Security researcher reports open URL accessing patient scans to disclosure inbox.' }
    ],
    symptoms: 'S3 Server Access Logs demonstrate massive GET request spikes from untrusted foreign IP addresses with referer headers matching web search crawlers.',
    availableEvidence: [
      'S3 Access Log: 200 GET /patient-records/scan_991823.dcm from IP 66.249.66.1',
      'Bucket Policy configuration showing lack of aws:SecureTransport enforcement',
      'Account-level S3 Block Public Access is set to false'
    ],
    awsServices: ['Amazon S3', 'AWS KMS', 'AWS Macie', 'Amazon CloudWatch'],
    rootCause: 'Account-level S3 Block Public Access was not enforced in the organization landing zone.',
    investigationTasks: [
      'Enable Macie to discover all sensitive data identifiers (SSNs, medical record IDs).',
      'Scan all 1.2M objects in bucket to determine exact exposure count.',
      'Enable S3 Server-Side Encryption with Customer Managed Key (SSE-KMS).'
    ],
    securityFindings: [
      'Object-level ACL allowed public read access.',
      'Default AWS-managed encryption allowed unauthorized read by anyone with S3 permissions.',
      'Absence of S3 object versioning and MFA delete.'
    ],
    businessImpact: 'Mandatory breach notification to Department of Health & Human Services (HHS), potential fines exceeding $2.5M.',
    technicalImpact: 'Direct exfiltration of unencrypted sensitive patient health data (PHI).',
    remediationPlan: [
      'Enable all four S3 Block Public Access settings immediately.',
      'Migrate objects to dedicated Customer Managed CMK with strict key policy.',
      'Deploy AWS Config rule s3-bucket-public-read-prohibited with automated Systems Manager remediation.'
    ],
    awsBestPractices: 'Always enforce S3 Block Public Access at the AWS Account level and require aws:SecureTransport SSL in all bucket policies.',
    attackPath: 'Misconfigured Script ACL -> Public Read Exposed -> Crawler Indexing -> Unauthorized External Data Exfiltration',
    interviewQuestions: [
      {
        question: 'What is the exact behavior of the four S3 Block Public Access settings?',
        expectedInsight: 'block_public_acls, ignore_public_acls, block_public_policy, and restrict_public_buckets isolate ACLs and bucket policies respectively at either account or bucket level.'
      }
    ],
    careerRoleActions: {
      cloudSecurityEngineer: 'Configures account-level S3 Block Public Access via AWS Control Tower guardrail.',
      socAnalyst: 'Analyzes S3 access logs via Amazon Athena to determine specific IP addresses that accessed PHI files.',
      devSecOpsEngineer: 'Creates pre-commit git hooks that block hardcoded bucket ACL configurations.'
    }
  },

  {
    id: 'INC-NET-003',
    category: 'Network Security',
    severity: 'HIGH',
    companyType: 'SaaS Multi-Tenant Cloud Platform',
    title: 'Bastion Host Ingress Security Group Opened to 0.0.0.0/0 on SSH Port 22',
    businessContext: 'An on-call DevOps engineer temporarily allowed 0.0.0.0/0 on port 22 to troubleshoot an outage from home, but forgot to revert the security group rule.',
    timeline: [
      { time: 'T-00:00', event: 'Security group rule added permitting TCP 22 from 0.0.0.0/0.' },
      { time: 'T-00:08', event: 'Automated botnet begins dictionary attack against OpenSSH on bastion.' },
      { time: 'T-01:45', event: 'Adversary gains access using compromised private key with weak passphrase.' }
    ],
    symptoms: 'VPC Flow Logs exhibit tens of thousands of REJECT and ACCEPT records on port 22 across consecutive IP subnets.',
    availableEvidence: [
      'VPC Flow Log: ACCEPT 194.26.29.112 10.0.1.10 22 TCP',
      'Auth.log on EC2 instance: Failed password for invalid user admin from 194.26.29.112',
      'Security Group ingress rule ID sgr-0881923 allowing 0.0.0.0/0'
    ],
    awsServices: ['Amazon EC2', 'Amazon VPC', 'AWS Systems Manager', 'VPC Flow Logs'],
    rootCause: 'Use of legacy SSH bastion host over the public internet rather than modern zero-trust AWS Systems Manager Session Manager.',
    investigationTasks: [
      'Inspect bastion ~/.ssh/authorized_keys for unauthorized keys.',
      'Check if SSH forwarding (Agent Forwarding) was active, exposing developer credentials.',
      'Audit internal VPC routing table for lateral connections to application subnets.'
    ],
    securityFindings: [
      'Direct public internet exposure on management port 22.',
      'Missing AWS Systems Manager agent configuration.',
      'Lack of automated drift detection on security group rules.'
    ],
    businessImpact: 'Unauthorized entry point to internal corporate network; potential lateral movement to database tier.',
    technicalImpact: 'Host compromise with interactive bash shell inside internal VPC perimeter.',
    remediationPlan: [
      'Delete ingress rule sgr-0881923 immediately.',
      'Terminate bastion EC2 instance and replace with AWS Systems Manager Session Manager.',
      'Enforce SCP blocking ingress rules with CidrIp: 0.0.0.0/0 on port 22.'
    ],
    awsBestPractices: 'Decommission all SSH bastion hosts in favor of AWS Systems Manager Session Manager with VPC endpoints.',
    attackPath: 'Open Security Group 0.0.0.0/0 -> Automated SSH Brute Force -> Host Shell -> Internal VPC Lateral Pivot',
    interviewQuestions: [
      {
        question: 'Why is AWS Systems Manager Session Manager superior to a traditional SSH bastion host?',
        expectedInsight: 'It requires zero open inbound security group ports, uses IAM for authentication and authorization, and logs all keystrokes to CloudWatch/S3.'
      }
    ],
    careerRoleActions: {
      cloudSecurityEngineer: 'Replaces all bastions with SSM Session Manager and restricts subnet routing.',
      socAnalyst: 'Monitors VPC Flow Logs and isolates instances using security group quarantine rules.',
      devSecOpsEngineer: 'Adds CI/CD linting rule flagging security groups with CidrIp: 0.0.0.0/0.'
    }
  },

  {
    id: 'INC-SEC-004',
    category: 'Serverless & AppSec',
    severity: 'HIGH',
    companyType: 'E-Commerce Marketplace',
    title: 'Serverless Lambda Function SSRF via Unvalidated Image URL Parameter',
    businessContext: 'An image processing Lambda function accepted an external imageUrl query parameter without whitelist sanitization, allowing an attacker to query internal microservices.',
    timeline: [
      { time: 'T-00:00', event: 'Adversary submits request: GET /resize?url=http://169.254.169.254/latest/meta-data/' },
      { time: 'T-00:02', event: 'Lambda execution environment fetches metadata and base64 encodes it in image response.' },
      { time: 'T-00:15', event: 'Adversary retrieves Lambda execution role session token.' }
    ],
    symptoms: 'CloudWatch Lambda logs show requests with destination IPs in link-local address block 169.254.0.0/16.',
    availableEvidence: [
      'CloudWatch Log: Request URL: http://169.254.169.254/latest/meta-data/iam/security-credentials/',
      'API Gateway access log showing repetitive SSRF probing on /resize endpoint',
      'Lambda execution role policy with broad DynamoDB access'
    ],
    awsServices: ['AWS Lambda', 'Amazon API Gateway', 'Amazon DynamoDB', 'AWS WAF'],
    rootCause: 'Insecure application code directly fetching client-controlled URLs without network or validation controls.',
    investigationTasks: [
      'Audit Lambda execution role permissions to determine what data was accessible.',
      'Inspect DynamoDB CloudTrail data events to check for unauthorized GetItem/Scan calls.',
      'Verify if Lambda was attached to a private VPC with private DNS.'
    ],
    securityFindings: [
      'Application-layer SSRF vulnerability.',
      'Over-privileged Lambda execution role.',
      'Lack of AWS WAF SSRF rule on API Gateway.'
    ],
    businessImpact: 'Exposure of customer order database and API tokens stored in DynamoDB.',
    technicalImpact: 'Internal network reconnaissance and privilege escalation via serverless runtime.',
    remediationPlan: [
      'Deploy AWS WAF on API Gateway with managed SSRF protection rules.',
      'Refactor Lambda code to validate URL domain against an allowlist.',
      'Place Lambda inside private VPC with VPC Endpoints and block link-local routing.'
    ],
    awsBestPractices: 'Apply least privilege to Lambda execution roles and use AWS WAF for API Gateway perimeter defense.',
    attackPath: 'Unvalidated Image Parameter -> Lambda Internal Request -> Metadata API Exposure -> DynamoDB Exfiltration',
    interviewQuestions: [
      {
        question: 'How do you protect serverless AWS Lambda functions from SSRF attacks?',
        expectedInsight: 'Sanitize input URLs with strict domain allowlists, attach Lambda to a VPC with restricted egress security groups, and scope execution role permissions.'
      }
    ],
    careerRoleActions: {
      cloudSecurityEngineer: 'Deploys WAF WebACL on API Gateway and configures Lambda VPC routing.',
      socAnalyst: 'Creates CloudWatch metric filter for 169.254.169.254 string occurrences in Lambda logs.',
      devSecOpsEngineer: 'Runs SAST security scanning in git pipeline to detect unvalidated URL fetching.'
    }
  },

  {
    id: 'INC-FIN-005',
    category: 'FinOps Security',
    severity: 'CRITICAL',
    companyType: 'AI/ML Analytics Startup',
    title: 'Compromised CI/CD Git Token Spawns GPU Cryptomining Swarm',
    businessContext: 'A developer committed a personal access token with AWS deployment rights to a public GitHub repository. Within 4 minutes, an automated bot scraped the token and deployed 32 p3.16xlarge instances across 4 AWS regions.',
    timeline: [
      { time: 'T-00:00', event: 'AWS Access Key committed to public git repo in file config/aws.env.' },
      { time: 'T-00:04', event: 'Bot scrapes token from commit history.' },
      { time: 'T-00:09', event: 'ec2:RunInstances called for 32x p3.16xlarge in us-west-2, eu-west-1, and ap-southeast-1.' },
      { time: 'T-00:35', event: 'Account incurs $8,400/hour in compute charges before detection.' }
    ],
    symptoms: 'CloudWatch billing alert triggered for 400% budget breach. EC2 GPU instances running at 100% compute with outbound traffic on port 3333.',
    availableEvidence: [
      'CloudTrail Event: ec2:RunInstances with instanceType: p3.16xlarge (IP: 91.240.118.2)',
      'VPC Flow Log: Outbound connection to pool.supportxmr.com:3333',
      'GitHub Secret Scanning alert email received by developer'
    ],
    awsServices: ['Amazon EC2', 'AWS Budgets', 'AWS CloudTrail', 'Amazon GuardDuty', 'AWS Organizations'],
    rootCause: 'Hardcoded credentials in source code repository without pre-commit scanning or automated quarantine.',
    investigationTasks: [
      'Deactivate compromised access key via AWS IAM immediately.',
      'Terminate all rogue EC2 instances across all regions.',
      'Check if any snapshots, AMIs, or VPC peerings were created for persistence.'
    ],
    securityFindings: [
      'Credentials stored in plaintext in version control.',
      'Lack of SCP restricting allowed AWS regions (e.g. only us-east-1 and us-west-2).',
      'High default EC2 Service Quota limits allowed rapid deployment of expensive instances.'
    ],
    businessImpact: '$45,000 cloud bill in 6 hours, potential insolvency for early-stage startup.',
    technicalImpact: 'Massive resource abuse for unauthorized cryptomining.',
    remediationPlan: [
      'Deactivate access key pair via IAM console or CLI.',
      'Execute automated cleanup script terminating all instances with tag Purpose=miner.',
      'Implement AWS Organizations SCP restricting allowed regions and limiting high-cost instance types.'
    ],
    awsBestPractices: 'Never commit AWS keys; use IAM Roles for GitHub Actions via OIDC federation and set AWS Budget automated anomaly alerts.',
    attackPath: 'Plaintext Key in Git -> Botnet Scraper -> Multi-Region GPU RunInstances -> Cryptomining Pool Connection',
    interviewQuestions: [
      {
        question: 'How does OIDC authentication eliminate static AWS access keys in CI/CD pipelines?',
        expectedInsight: 'GitHub Actions exchanges a short-lived OIDC token with AWS STS AssumeRoleWithWebIdentity, provisioning temporary 1-hour credentials with zero stored secrets.'
      }
    ],
    careerRoleActions: {
      cloudSecurityEngineer: 'Configures GitHub Actions OIDC federation and deletes all IAM user access keys.',
      socAnalyst: 'Uses CloudTrail lake query to identify all regions where RunInstances was executed.',
      devSecOpsEngineer: 'Installs GitGuardian / truffleHog in pre-commit git hooks to prevent secret commits.'
    }
  },
  {
    id: 'INC-HLTH-001',
    category: 'Storage & Cryptography',
    severity: 'CRITICAL',
    companyType: 'HealthTech EHR Platform',
    title: 'Unencrypted S3 Patient Health Information (PHI) Vault Exposed via Permissive ACL & Missing SSE-KMS',
    businessContext: 'A legacy patient scan ingestion pipeline uploaded diagnostic imaging directly to an S3 bucket configured with ACL public-read and default AWS managed keys instead of Customer Managed Keys (CMK) under HIPAA rules.',
    timeline: [
      { time: 'T-00:00', event: 'Data pipeline script updates bucket policy, disabling S3 Block Public Access to accommodate legacy hospital vendor.' },
      { time: 'T-01:15', event: 'Public OSINT scanning service indexifies bucket objects containing patient radiology scans.' },
      { time: 'T-02:45', event: 'High-volume external downloads (140 GB) logged by CloudWatch Metric on bucket patient-scan-vault.' },
      { time: 'T-03:10', event: 'Security Operations alerted via AWS Security Hub finding S3.2: S3 buckets should prohibit public read access.' }
    ],
    symptoms: 'AWS Security Hub S3.2 finding. GuardDuty finding: Exfiltration:S3/AnomalousVolume. OCR HIPAA breach notification triggered.',
    availableEvidence: [
      'CloudTrail Event: s3:PutBucketPublicAccessBlock setting IgnorePublicAcls=false, BlockPublicPolicy=false',
      'VPC Flow Log: High volume outbound egress to non-whitelisted residential IP addresses',
      'S3 Access Logs: 24,000+ GET requests for /radiology/*.dcm from external user agents'
    ],
    awsServices: ['Amazon S3', 'AWS KMS', 'AWS Security Hub', 'AWS CloudTrail', 'Amazon GuardDuty'],
    rootCause: 'Manual override of account-level S3 Block Public Access and failure to enforce SSE-KMS with Customer Managed Keys with annual rotation.',
    investigationTasks: [
      'Enable S3 Block Public Access immediately across the entire AWS account.',
      'Reconstruct list of accessed object keys from S3 server access logs to define breach scope.',
      'Audit all hospital data ingestion scripts for hardcoded public ACL parameters.'
    ],
    securityFindings: [
      'Account-level S3 Block Public Access was disabled.',
      'Bucket was encrypted with standard SSE-S3 rather than Customer Managed CMK required for HIPAA.',
      'S3 Object Lock and versioning were disabled, exposing records to deletion.'
    ],
    businessImpact: 'HIPAA violation fines up to $1.9M, mandatory notification to Department of Health & Human Services, class-action exposure.',
    technicalImpact: 'Confidentiality loss of 24,000+ patient medical records and diagnostic images.',
    remediationPlan: [
      'Execute aws s3api put-public-access-block enforcing all four flags: BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, RestrictPublicBuckets.',
      'Migrate bucket to SSE-KMS using dedicated CMK with key policy restricted to the clinical ingest role.',
      'Implement AWS Organizations SCP preventing any IAM identity from modifying S3 Block Public Access.'
    ],
    awsBestPractices: 'Enforce S3 Block Public Access at the AWS Organizations root, require SSE-KMS via bucket policy condition StringNotEquals s3:x-amz-server-side-encryption=aws:kms.',
    attackPath: 'Overridden Block Public Access -> S3 ACL public-read -> External OSINT Recon -> Bulk Object Download via S3 API',
    interviewQuestions: [
      {
        question: 'Under HIPAA and CIS AWS Benchmark, why is SSE-KMS with a Customer Managed Key required over default SSE-S3?',
        expectedInsight: 'SSE-KMS introduces a separate authorization boundary; an IAM principal with s3:GetObject cannot read data unless explicitly granted kms:Decrypt in the KMS key policy, preventing lateral administrative access.'
      }
    ],
    careerRoleActions: {
      cloudSecurityEngineer: 'Authors SCP blocking S3 public access disabling and enforces KMS CMK in Terraform.',
      socAnalyst: 'Pivots on S3 access logs via Athena to generate precise forensic report of compromised patient records.',
      devSecOpsEngineer: 'Integrates OPA/Checkov rules in CI/CD pipeline blocking S3 bucket definitions without BlockPublicAccess.'
    }
  },
  {
    id: 'INC-SAAS-001',
    category: 'Tenant Isolation & IAM',
    severity: 'CRITICAL',
    companyType: 'B2B Enterprise SaaS',
    title: 'Cross-Tenant Data Exposure via Missing IAM Policy Variable in DynamoDB Multi-Tenant Tables',
    businessContext: 'A fast-growing multi-tenant SaaS CRM platform consolidated client data into single-table DynamoDB designs. An API refactor omitted the ${aws:PrincipalTag/TenantId} condition in the backend service IAM role policy.',
    timeline: [
      { time: 'T-00:00', event: 'Microservice deployment updates IAM policy for TenantWorkerRole, removing dynamic leading-keys condition.' },
      { time: 'T-00:30', event: 'Tenant Alpha user triggers search API with wildcard partition key query.' },
      { time: 'T-00:31', event: 'DynamoDB Query response returns customer records belonging to Tenant Beta and Tenant Gamma.' },
      { time: 'T-00:45', event: 'Security disclosure received via Bug Bounty report from Tenant Alpha security team.' }
    ],
    symptoms: 'DynamoDB Query operations returning cross-partition data. Bug bounty escalation with proof-of-concept cross-tenant leak.',
    availableEvidence: [
      'IAM Policy Document for TenantWorkerRole missing dynamodb:LeadingKeys condition',
      'CloudTrail Event: dynamodb:Query executed with PartitionKey not matching calling tenant ID',
      'API Gateway access logs demonstrating query parameter tampering'
    ],
    awsServices: ['Amazon DynamoDB', 'AWS IAM', 'AWS STS', 'Amazon API Gateway', 'AWS CloudTrail'],
    rootCause: 'Removal of fine-grained IAM access control (dynamodb:LeadingKeys) with dynamic STS session tags during microservice refactoring.',
    investigationTasks: [
      'Audit all IAM policies attached to tenant processing ECS/Lambda tasks.',
      'Check DynamoDB CloudTrail data events to measure how many cross-tenant queries executed.',
      'Validate ABAC session tagging pipeline in Cognito/STS token issuance.'
    ],
    securityFindings: [
      'Missing fine-grained access control policy variables in IAM role.',
      'No tenant isolation integration tests in CI/CD regression suite.',
      'Direct client-supplied partition keys accepted without server-side validation.'
    ],
    businessImpact: 'SOC 2 Type II audit exception, customer contract breach, enterprise customer churn.',
    technicalImpact: 'Logical tenant isolation collapsed across 400+ enterprise accounts in shared database.',
    remediationPlan: [
      'Re-attach IAM policy enforcing dynamodb:LeadingKeys: ["${aws:PrincipalTag/TenantId}"] on all DynamoDB actions.',
      'Implement tenant isolation middleware validating JWT claims before issuing database requests.',
      'Deploy automated architectural unit tests in GitHub Actions verifying tenant boundary enforcement.'
    ],
    awsBestPractices: 'Use AWS SaaS Factory dynamic session broker pattern with STS AssumeRole session tags and LeadingKeys conditions.',
    attackPath: 'Over-Permissive Service IAM Role -> DynamoDB Query Parameter Tampering -> Cross-Tenant Partition Bleed',
    interviewQuestions: [
      {
        question: 'How do you enforce tenant isolation in single-table DynamoDB using AWS IAM?',
        expectedInsight: 'Use fine-grained IAM policy conditions: dynamodb:LeadingKeys matched to ${aws:PrincipalTag/TenantId}, ensuring callers can only query partition keys matching their authenticated tenant identity.'
      }
    ],
    careerRoleActions: {
      cloudSecurityEngineer: 'Architects ABAC session tag broker and writes hardened DynamoDB IAM policies.',
      socAnalyst: 'Reviews data access logs to verify whether sensitive tenant data was cached or persisted downstream.',
      devSecOpsEngineer: 'Builds automated tenant leakage integration tests into pull request verification workflows.'
    }
  },
  {
    id: 'INC-ECOM-001',
    category: 'Supply Chain & CDN',
    severity: 'HIGH',
    companyType: 'Global E-Commerce Retailer',
    title: 'Magecart Supply-Chain Script Injected into Public S3 CloudFront Origin via Misconfigured Ingress',
    businessContext: 'An e-commerce checkout site served static JavaScript assets from an S3 origin behind CloudFront. The bucket policy allowed s3:PutObject from any AWS identity in the developer account VPC.',
    timeline: [
      { time: 'T-00:00', event: 'Developer security group allows inbound SSH from public subnet; bastion host compromised.' },
      { time: 'T-01:20', event: 'Adversary uses bastion credentials to execute s3:PutObject, overwriting checkout-bundle.js with obfuscated skimmer.' },
      { time: 'T-01:25', event: 'CloudFront invalidation triggered, propagating skimmer to edge POPs worldwide.' },
      { time: 'T-03:40', event: 'Fraud detection algorithms flag anomalous credit card routing to unauthorized foreign merchant IDs.' }
    ],
    symptoms: 'Customer reports of fraudulent card activity. Amazon GuardDuty alert: UnauthorizedAccess:EC2/MaliciousIPCaller.',
    availableEvidence: [
      'CloudTrail Event: s3:PutObject for checkout-bundle.js from internal VPC bastion host',
      'CloudFront Invalidation request logged via CloudTrail for /static/checkout-bundle.js',
      'File integrity diff showing 42 lines of malicious JavaScript injected into checkout bundle'
    ],
    awsServices: ['Amazon CloudFront', 'Amazon S3', 'AWS WAF', 'AWS CloudTrail', 'Amazon GuardDuty'],
    rootCause: 'S3 bucket policy allowed PutObject from internal VPC without restricting specific deployment IAM roles or enforcing Object Lock.',
    investigationTasks: [
      'Roll back S3 object version to known good release immediately.',
      'Invalidate CloudFront edge cache globally to purge malicious script.',
      'Isolate compromised bastion host by modifying its security group to zero ingress/egress.'
    ],
    securityFindings: [
      'S3 origin permitted direct write access from general VPC CIDR.',
      'CloudFront Origin Access Control (OAC) was not configured with read-only bucket policy.',
      'Lack of Subresource Integrity (SRI) hashes on script tags in checkout HTML.'
    ],
    businessImpact: 'PCI-DSS forensic investigation required, customer notification mandates, merchant account suspension risk.',
    technicalImpact: 'Payment credential exfiltration directly from customer browser sessions.',
    remediationPlan: [
      'Configure S3 bucket policy strictly granting read-only access to CloudFront service principal via Origin Access Control (OAC).',
      'Enforce S3 Object Lock and S3 Versioning, requiring MFA-delete for asset overwrites.',
      'Implement Subresource Integrity (SRI) and Content Security Policy (CSP) blocking unauthorized external script domains.'
    ],
    awsBestPractices: 'Use CloudFront OAC with S3 buckets set to private, use CI/CD pipeline with cryptographic artifact signing.',
    attackPath: 'Bastion Compromise -> s3:PutObject Overwrite -> CloudFront Edge Cache Invalidation -> In-Browser Credit Card Skim',
    interviewQuestions: [
      {
        question: 'How does CloudFront Origin Access Control (OAC) secure S3 origins compared to legacy OAI?',
        expectedInsight: 'OAC supports all S3 buckets in all regions, supports SSE-KMS encryption with AWS KMS service principals, and uses SigV4 authentication to prevent direct S3 bypass.'
      }
    ],
    careerRoleActions: {
      cloudSecurityEngineer: 'Migrates CDN origins to CloudFront OAC and restricts S3 bucket write policies strictly to the deployment role.',
      socAnalyst: 'Captures memory dump and disk snapshot of compromised bastion host for forensic timeline analysis.',
      devSecOpsEngineer: 'Automates Subresource Integrity (SRI) hash injection into HTML build pipeline.'
    }
  }
]
