// Comprehensive Module Quizzes for SeCloudive Academy
// 6 Core Modules • 12 Questions each • Total 72 High-Yield Questions

export const moduleQuizzes = {
  iam: {
    pathId: 'iam',
    title: 'IAM Security Module Assessment',
    description: 'Verify your knowledge of identity architecture, evaluation logic, STS tokens, cross-account boundaries, and least privilege enforcement before entering live simulations.',
    passingScore: 70,
    badgeAwardId: 'iam-defender',
    badgeMinScore: 85,
    recommendedInvestigationId: 'inv-iam-01',
    recommendedInvestigationTitle: 'Investigation: Compromised Access Keys & Privilege Escalation',
    recommendedInvestigationPath: '/investigations',
    nextModulePathId: 's3',
    nextModuleTitle: 'Data Security (S3)',
    questions: [
      {
        id: 'iam-q1',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Identity Architecture',
        topicId: 'users-vs-roles',
        topicTitle: 'Users vs Roles',
        question: 'What is the primary security advantage of assigning an IAM Role to an EC2 instance instead of embedding an IAM User access key in the application configuration?',
        options: [
          'Roles encrypt outbound HTTP requests using AWS KMS automatically.',
          'Roles issue temporary security credentials via STS with automatic rotation, eliminating static secret exposure.',
          'Roles bypass all IAM evaluation logic, reducing AWS latency.',
          'Roles permit root-level actions without requiring MFA.'
        ],
        correctIndex: 1,
        explanation: 'IAM Roles utilize AWS Security Token Service (STS) to provision short-lived temporary credentials (starting with ASIA) that rotate automatically through the EC2 metadata service, removing the danger of leaked static secrets.',
        engineerReasoning: 'Static keys in application configs or code are the #1 source of public cloud breaches. IAM Roles replace hardcoded credentials with time-bounded, non-exportable tokens.',
        businessImpact: 'Leaked static credentials can remain active undetected for months, incurring massive compute fraud or regulatory fines.',
        awsBestPractice: 'Enforce IMDSv2 and attach IAM instance profiles to EC2 instead of ever generating long-lived IAM user keys for machine workloads.'
      },
      {
        id: 'iam-q2',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Least Privilege',
        topicId: 'least-privilege',
        topicTitle: 'Least Privilege',
        question: 'A junior engineer requests `iam:*` permissions in a staging AWS account to troubleshoot deployment errors. Which fundamental security principle does this violate, and why is it dangerous?',
        options: [
          'Defense-in-Depth, because staging is not protected by an AWS WAF.',
          'Least Privilege, because `iam:*` allows the engineer to create new administrative credentials and escalate privilege across the entire account.',
          'Data Sovereignty, because IAM policies are replicated across multiple global AWS regions.',
          'Separation of Duties, because staging and production must share identical IAM users.'
        ],
        correctIndex: 1,
        explanation: 'Granting `iam:*` provides full administrative control over identity. Even in staging, a compromised identity with `iam:CreateAccessKey` or `iam:AttachRolePolicy` can escalate to AdministratorAccess and establish hidden backdoors.',
        engineerReasoning: 'Permission escalation paths frequently start with loose IAM permissions in non-production accounts that connect to shared resources or enterprise networks.',
        businessImpact: 'Privilege escalation enables attackers to seize full control of cloud resources, destroy backups, or pivot into production networks.',
        awsBestPractice: 'Use AWS IAM Access Analyzer and CloudTrail to identify the exact API calls required and enforce granular, resource-specific permissions.'
      },
      {
        id: 'iam-q3',
        type: 'scenario',
        difficulty: 'Intermediate',
        category: 'Policy Evaluation',
        topicId: 'policies-deep-dive',
        topicTitle: 'Policies',
        question: 'An IAM User has an identity policy with `Effect: Allow, Action: s3:GetObject, Resource: arn:aws:s3:::customer-vault/*`. However, the bucket policy on `customer-vault` contains `Effect: Deny, Action: s3:*, Resource: arn:aws:s3:::customer-vault/*, Condition: { NotIpAddress: { aws:SourceIp: "198.51.100.0/24" } }`. The user connects from IP `203.0.113.50`. What is the result of their `GetObject` request?',
        options: [
          'The request is ALLOWED because identity policies override bucket policies.',
          'The request is DENIED because the bucket policy explicit Deny takes precedence over any explicit Allow.',
          'The request succeeds if the user is authenticated via MFA.',
          'The request generates a CloudWatch alarm but downloads the file successfully.'
        ],
        correctIndex: 1,
        explanation: 'In AWS IAM policy evaluation logic, an Explicit Deny ALWAYS overrides any number of Explicit Allows, regardless of whether the allow is on the user, group, or resource.',
        engineerReasoning: 'Understanding that Deny trumps Allow is vital when designing perimeter guardrails and network IP restrictions.',
        businessImpact: 'Misunderstanding policy precedence leads either to unintended public data leakage or breaking critical production pipelines.',
        awsBestPractice: 'Use Explicit Deny in resource policies to enforce baseline network perimeter boundaries (such as corporate CIDR or VPC endpoint requirements).'
      },
      {
        id: 'iam-q4',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'Confused Deputy & Cross-Account',
        topicId: 'cross-account',
        topicTitle: 'Cross Account Access',
        question: 'A SaaS security auditing vendor requests an IAM Role in your AWS account so their automated scanner can inspect your configuration. Which parameter MUST you mandate in the role trust policy to protect against the Confused Deputy vulnerability?',
        options: [
          'An `aws:SourceVpc` condition matching the vendor VPC ID.',
          'A unique, secret `sts:ExternalId` condition supplied by you to the vendor.',
          'A `Principal: "*"` entry combined with an AWS WAF rate limit.',
          'An explicit deny on `kms:Decrypt`.'
        ],
        correctIndex: 1,
        explanation: 'The `sts:ExternalId` condition ensures that another customer of the SaaS vendor cannot trick the vendor into assuming your IAM role to exfiltrate your AWS telemetry (the classic Confused Deputy attack).',
        engineerReasoning: 'When allowing a 3rd party service to assume an IAM role in your account, `sts:ExternalId` is non-negotiable to maintain cryptographic separation between multi-tenant customers.',
        businessImpact: 'Without ExternalId, any rogue customer of the same 3rd-party SaaS platform could view and extract sensitive resources from your AWS account.',
        awsBestPractice: 'Always require `sts:ExternalId` in cross-account trust policies for 3rd-party vendor integrations.'
      },
      {
        id: 'iam-q5',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Root Account Hardening',
        topicId: 'iam-fundamentals',
        topicTitle: 'IAM Fundamentals',
        question: 'Under what specific circumstance should a Cloud Security Engineer log in directly as the AWS Account Root User?',
        options: [
          'To write and deploy daily Terraform infrastructure modules.',
          'Only for break-glass emergency recovery, changing account contact/billing details, or closing the account.',
          'To conduct weekly security vulnerability scanning.',
          'Whenever granting another engineer AdministratorAccess.'
        ],
        correctIndex: 1,
        explanation: 'The Root user has unrestricted access to all account resources that cannot be revoked by IAM policies. AWS Well-Architected strictly forbids day-to-day use of the Root account.',
        engineerReasoning: 'Zero access keys should ever exist for Root. Multi-Factor Authentication (hardware FIDO token) must be enabled, with credentials stored in an enterprise physical vault.',
        businessImpact: 'A compromised Root user results in complete account takeover, hostage ransomware, or unrecoverable deletion of all cloud infrastructure.',
        awsBestPractice: 'Lock away root credentials, remove all root access keys, enforce hardware MFA, and create IAM Identity Center (SSO) administrator roles.'
      },
      {
        id: 'iam-q6',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Delegated Admin Guardrails',
        topicId: 'permission-boundaries',
        topicTitle: 'Permission Boundaries',
        question: 'You want to allow development teams to create their own IAM roles for Lambda functions without letting them grant themselves `AdministratorAccess`. Which AWS mechanism accomplishes this?',
        options: [
          'AWS Shield Advanced.',
          'IAM Permissions Boundary attached to the developer identity or mandated on all newly created roles.',
          'S3 Bucket Lifecycle Policies.',
          'VPC Flow Logs.'
        ],
        correctIndex: 1,
        explanation: 'An IAM Permissions Boundary sets the maximum permissions an identity or newly created role can possess. Even if the developer creates a role with `AdministratorAccess`, the effective permissions will never exceed the boundary.',
        engineerReasoning: 'Permissions boundaries solve the delegated administration problem in enterprise organizations without creating a bottleneck on the central security team.',
        businessImpact: 'Without boundaries, developers delegated `iam:CreateRole` can grant themselves full admin permissions and bypass all security reviews.',
        awsBestPractice: 'Combine `iam:PermissionsBoundary` with an SCP or IAM condition that prevents developers from modifying the boundary policy or creating roles without it.'
      },
      {
        id: 'iam-q7',
        type: 'scenario',
        difficulty: 'Advanced',
        category: 'Token Lifetime & Blast Radius',
        topicId: 'users-vs-roles',
        topicTitle: 'Users vs Roles',
        question: 'During a live incident, your SOC observes that an attacker compromised temporary credentials from an IAM Role with a 12-hour session duration. Which action immediately revokes active STS credentials without deleting the role?',
        options: [
          'Delete the IAM Role and immediately recreate it with the same name.',
          'Attach an inline policy to the role with an explicit Deny on all actions where `aws:TokenIssueTime` is earlier than the incident containment timestamp.',
          'Reboot the EC2 instance hosting the application.',
          'Rotate the AWS account root password.'
        ],
        correctIndex: 1,
        explanation: 'Because STS tokens are cryptographically signed, they remain valid until expiration unless an explicit Deny policy with the `aws:TokenIssueTime` condition is attached to the role, invalidating all previously issued tokens instantly.',
        engineerReasoning: 'Deleting and recreating the role breaks trust relationships and doesn’t immediately stop tokens cached by the attacker in all scenarios.',
        businessImpact: 'Failing to revoke temporary tokens allows an adversary to continue exfiltrating data for up to 12 hours after detection.',
        awsBestPractice: 'Use the AWS IAM Console "Revoke Active Sessions" button or deploy a policy with `DateLessThan: { "aws:TokenIssueTime": "YYYY-MM-DDTHH:MM:SSZ" }`.'
      },
      {
        id: 'iam-q8',
        type: 'concept',
        difficulty: 'Intermediate',
        category: 'MFA Enforcement',
        topicId: 'mfa-enforcement',
        topicTitle: 'MFA',
        question: 'Which IAM policy condition key verifies that a human principal completed multi-factor authentication during their current session?',
        options: [
          '`aws:MultiFactorAuthPresent: "true"`',
          '`aws:SecureTransport: "true"`',
          '`aws:TokenIssueTime: "now"`',
          '`aws:PrincipalType: "MFA"`'
        ],
        correctIndex: 0,
        explanation: '`aws:MultiFactorAuthPresent: "true"` tests whether the credentials used to make the request were authenticated with an active MFA device.',
        engineerReasoning: 'Enforcing MFA at the policy condition level guarantees that even if a session credential is stolen, high-risk APIs (e.g. `iam:Delete*`, `s3:DeleteBucket`) cannot be executed without re-prompting.',
        businessImpact: 'Stolen passwords or phishing compromises without MFA enforcement lead to immediate full account takeovers.',
        awsBestPractice: 'Enforce MFA across all interactive human users and mandate MFA in IAM policies for destructive actions.'
      },
      {
        id: 'iam-q9',
        type: 'engineerDecision',
        difficulty: 'Intermediate',
        category: 'CI/CD Credential Security',
        topicId: 'iam-best-practices',
        topicTitle: 'IAM Best Practices',
        question: 'A DevOps engineer wants to store long-term AWS access keys in GitHub Secrets so GitHub Actions can deploy infrastructure. As the Cloud Security Engineer, how should you respond?',
        options: [
          'Approve it, provided the keys are rotated once every 365 days.',
          'Reject static keys; configure OIDC (OpenID Connect) federation so GitHub Actions assumes an IAM Role via STS temporary credentials without storing any static secrets.',
          'Approve it, but mandate that the IAM user must have the AdministratorAccess policy.',
          'Require the keys to be written into the GitHub repository `.env` file.'
        ],
        correctIndex: 1,
        explanation: 'OIDC federation allows GitHub Actions to exchange an ephemeral OIDC JWT token for short-lived AWS STS credentials, completely eliminating the risk of stored static credentials leaking from repository secrets.',
        engineerReasoning: 'Long-term keys in CI/CD secrets frequently leak through build logs, compromised dependencies, or compromised dev accounts.',
        businessImpact: 'Static CI/CD keys are among the most common vectors in public cloud breaches and software supply-chain attacks.',
        awsBestPractice: 'Always use OIDC federation with specific branch and repository condition checks (`repo:org/repo:ref:refs/heads/main`) for CI/CD deployments.'
      },
      {
        id: 'iam-q10',
        type: 'securityThinking',
        difficulty: 'Advanced',
        category: 'Least Privilege',
        topicId: 'least-privilege',
        topicTitle: 'Least Privilege',
        question: 'Why is `Action: "s3:*"` combined with `Resource: "*"` considered an extreme security flaw in an application execution role, even if the application only reads one bucket?',
        options: [
          'Because S3 requires cross-region replication fees for wildcard calls.',
          'Because if the application is compromised via SSRF or RCE, the attacker has permission to list, delete, and exfiltrate data from ALL existing and future S3 buckets across the account.',
          'Because wildcards automatically disable TLS encryption on S3 buckets.',
          'Because AWS billing doubles for wildcard policies.'
        ],
        correctIndex: 1,
        explanation: 'Wildcard actions on wildcard resources violate least privilege and expand the blast radius to every bucket in the account. An attacker who compromises the application gains carte blanche over all data assets.',
        engineerReasoning: 'Security engineers constrain roles to specific bucket ARNs and specific actions (`s3:GetObject`, `s3:PutObject`) rather than broad wildcards.',
        businessImpact: 'A single web application flaw turns into a catastrophic company-wide data breach compromising confidential customer databases.',
        awsBestPractice: 'Scope resource ARNs strictly to `arn:aws:s3:::specific-bucket-name/*` and use AWS IAM Access Analyzer to detect overly permissive policies.'
      },
      {
        id: 'iam-q11',
        type: 'scenario',
        difficulty: 'Intermediate',
        category: 'Service Control Policies',
        topicId: 'iam-fundamentals',
        topicTitle: 'IAM Fundamentals',
        question: 'An AWS Organizations Service Control Policy (SCP) attached to an OU contains `Effect: Deny, Action: ec2:RunInstances, Resource: "*", Condition: { StringNotEquals: { "ec2:InstanceType": ["t3.micro", "t3.small"] } }`. An engineer in a member account with the `AdministratorAccess` policy attempts to launch a `c5.large` instance. What happens?',
        options: [
          'The instance launches because AdministratorAccess bypasses SCPs.',
          'The launch is blocked because SCPs define the maximum allowable permissions for all accounts in the OU, and an SCP Deny cannot be overridden by local administrators.',
          'The instance launches, but the engineer receives an email warning from AWS Organizations.',
          'The instance is terminated after 15 minutes.'
        ],
        correctIndex: 1,
        explanation: 'SCPs are organization-level guardrails that filter the maximum available permissions for member accounts. Local administrators (even with AdministratorAccess) cannot override an SCP Deny.',
        engineerReasoning: 'SCPs provide guardrail enforcement that prevents developer teams or compromised local credentials from bypassing fundamental organization policies.',
        businessImpact: 'Without SCPs, compromised credentials in any single account can spin up unauthorized expensive compute or disable logging across regions.',
        awsBestPractice: 'Use SCPs to enforce non-negotiable boundaries, such as disabling unapproved regions, protecting CloudTrail, and blocking root user activity.'
      },
      {
        id: 'iam-q12',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Credential Types',
        topicId: 'users-vs-roles',
        topicTitle: 'Users vs Roles',
        question: 'Which prefix indicates that an AWS Access Key ID belongs to a temporary STS session rather than a long-lived IAM User?',
        options: [
          '`AKIA...` (e.g., AKIAIOSFODNN7EXAMPLE)',
          '`ASIA...` (e.g., ASIAIOSFODNN7EXAMPLE)',
          '`ROOT...` (e.g., ROOTIOSFODNN7EXAMPLE)',
          '`IAMK...` (e.g., IAMKIOSFODNN7EXAMPLE)'
        ],
        correctIndex: 1,
        explanation: 'Temporary security credentials generated by AWS STS start with the prefix `ASIA`. Long-term static IAM user keys start with `AKIA`.',
        engineerReasoning: 'Recognizing credential prefixes is critical during triage. If you see an `AKIA` key in a Git repo, it will remain active forever until rotated; an `ASIA` key will expire shortly but indicates an active role was assumed.',
        businessImpact: 'Failing to distinguish between static and temporary keys leads to ineffective containment during security incidents.',
        awsBestPractice: 'Never commit AWS keys to version control; implement git pre-commit secret scanners (e.g. git-secrets, trufflehog) across all engineering repos.'
      }
    ]
  },

  s3: {
    pathId: 's3',
    title: 'S3 Data Security Module Assessment',
    description: 'Evaluate your readiness in object storage encryption, bucket policies, Block Public Access controls, Object Lock (WORM), versioning, and compliance monitoring.',
    passingScore: 70,
    badgeAwardId: 's3-guardian',
    badgeMinScore: 85,
    recommendedInvestigationId: 'inv-s3-01',
    recommendedInvestigationTitle: 'Investigation: Public S3 Exposure & Data Exfiltration',
    recommendedInvestigationPath: '/investigations',
    nextModulePathId: 'network',
    nextModuleTitle: 'Network Security',
    questions: [
      {
        id: 's3-q1',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Public Access',
        topicId: 'public-access',
        topicTitle: 'Public Access',
        question: 'Which AWS S3 feature overrides all existing bucket policies and ACLs to guarantee that public access is blocked across every bucket in an AWS account?',
        options: [
          'Amazon S3 Transfer Acceleration',
          'S3 Block Public Access (BPA) configured at the Account level',
          'AWS Shield Standard',
          'Amazon CloudFront Distribution'
        ],
        correctIndex: 1,
        explanation: 'Enabling S3 Block Public Access at the Account level acts as a master guardrail, preventing any user or bucket policy in the account from ever granting public read or write permissions.',
        engineerReasoning: 'Account-level BPA prevents human error and accidental misconfigurations from exposing sensitive data buckets to the internet.',
        businessImpact: 'Unrestricted public buckets are the #1 cause of cloud data breaches and massive regulatory fines (GDPR, HIPAA, CCPA).',
        awsBestPractice: 'Enable all 4 S3 Block Public Access settings at the Account level unless the account is explicitly designated for public website hosting.'
      },
      {
        id: 's3-q2',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Encryption In-Transit',
        topicId: 'bucket-policies',
        topicTitle: 'Bucket Policies',
        question: 'How does a Cloud Security Engineer enforce that all requests to an S3 bucket use encrypted HTTPS connections (TLS 1.2+) rather than plaintext HTTP?',
        options: [
          'By checking the "HTTPS Only" box in the EC2 console.',
          'By adding a bucket policy with `Effect: Deny` on all actions where the condition `"aws:SecureTransport": "false"` matches.',
          'By changing the bucket name to start with `https-`.',
          'By attaching an IAM policy with `Effect: Allow` on port 443.'
        ],
        correctIndex: 1,
        explanation: 'The `aws:SecureTransport` condition key tests whether the request was transmitted over TLS. An explicit Deny when `"aws:SecureTransport": "false"` guarantees all plaintext HTTP requests are rejected.',
        engineerReasoning: 'Enforcing encryption in transit ensures data packets cannot be intercepted or tampered with by man-in-the-middle network attacks.',
        businessImpact: 'Plaintext data transmission violates PCI-DSS, SOC 2, and HIPAA compliance mandates and exposes sensitive customer data on the wire.',
        awsBestPractice: 'Apply a standardized HTTPS-only Deny policy to all S3 buckets as a core security baseline.'
      },
      {
        id: 's3-q3',
        type: 'scenario',
        difficulty: 'Intermediate',
        category: 'Ransomware Defense',
        topicId: 'versioning',
        topicTitle: 'Versioning',
        question: 'An adversary compromises administrative credentials and attempts to delete all objects in an S3 backup bucket. Which combination of features prevents the permanent destruction of these files?',
        options: [
          'S3 Transfer Acceleration and Cross-Region Replication.',
          'S3 Versioning combined with MFA Delete and S3 Object Lock in Compliance Mode.',
          'S3 Intelligent-Tiering and CloudWatch Alarms.',
          'Default SSE-S3 encryption and bucket tags.'
        ],
        correctIndex: 1,
        explanation: 'S3 Versioning preserves older versions of modified or deleted objects. MFA Delete requires a hardware MFA token for permanent deletions. Object Lock in Compliance Mode prevents ANY user (including Root) from deleting objects until the retention period expires.',
        engineerReasoning: 'Compliance Mode Object Lock provides a true Write Once, Read Many (WORM) guarantee against insider threats, disgruntled employees, and ransomware.',
        businessImpact: 'Irrevocable backup destruction leaves an organization helpless against extortion ransomware and causes total business failure.',
        awsBestPractice: 'Use S3 Object Lock Compliance Mode on immutability-critical backup buckets in a dedicated, isolated AWS security archive account.'
      },
      {
        id: 's3-q4',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'Encryption at Rest & Key Control',
        topicId: 'encryption',
        topicTitle: 'Encryption',
        question: 'A compliance auditor requires that all sensitive data in S3 is encrypted at rest and that your team has an auditable log of every single read access to the decryption keys, with the ability to revoke access immediately. Which encryption option meets this requirement?',
        options: [
          'Server-Side Encryption with Amazon S3-Managed Keys (SSE-S3).',
          'Server-Side Encryption with AWS KMS Customer Managed Keys (SSE-KMS / CMK).',
          'Client-Side Encryption with plain Base64 encoding.',
          'Unencrypted storage with a bucket password.'
        ],
        correctIndex: 1,
        explanation: 'SSE-KMS with a Customer Managed Key (CMK) provides granular key policies, automatic CloudTrail auditing for every `kms:Decrypt` call, and the capability to disable the key instantly to freeze data access.',
        engineerReasoning: 'SSE-S3 protects data on disk at AWS data centers, but cannot control access per user or provide separate audit logs for key usage like SSE-KMS does.',
        businessImpact: 'Using SSE-S3 without KMS fails strict regulatory compliance audits (FedRAMP, PCI-DSS Level 1) requiring cryptographic access logging.',
        awsBestPractice: 'Use AWS KMS CMKs with key rotation enabled for confidential, financial, or healthcare data buckets.'
      },
      {
        id: 's3-q5',
        type: 'concept',
        difficulty: 'Intermediate',
        category: 'Data Governance & Discovery',
        topicId: 'data-protection',
        topicTitle: 'Data Protection',
        question: 'Which AWS service uses machine learning and pattern matching to continuously scan S3 buckets and identify sensitive data such as credit card numbers, social security numbers, and API keys?',
        options: [
          'AWS WAF',
          'Amazon Macie',
          'Amazon Inspector',
          'AWS Secrets Manager'
        ],
        correctIndex: 1,
        explanation: 'Amazon Macie is a fully managed data security and privacy service that automatically discovers and protects sensitive data stored in Amazon S3.',
        engineerReasoning: 'Macie allows security teams to find "shadow data" or unmanaged PII that developers may have accidentally placed in non-compliant buckets.',
        businessImpact: 'Undiscovered PII in public or non-compliant buckets leads to multi-million dollar privacy fines and reputational destruction.',
        awsBestPractice: 'Enable Amazon Macie organization-wide with automated alerts to identify unencrypted or publicly shared sensitive data stores.'
      },
      {
        id: 's3-q6',
        type: 'scenario',
        difficulty: 'Advanced',
        category: 'Cross-Account Access Guardrails',
        topicId: 'bucket-policies',
        topicTitle: 'Bucket Policies',
        question: 'You want to allow all accounts within your AWS Organization (`o-example12345`) to access a shared dataset bucket, while strictly blocking all external AWS accounts. Which condition key should you use in the bucket policy?',
        options: [
          '`aws:PrincipalType: "Account"`',
          '`aws:PrincipalOrgID: "o-example12345"`',
          '`aws:SourceVpc: "vpc-000000"`',
          '`aws:MultiFactorAuthPresent: "false"`'
        ],
        correctIndex: 1,
        explanation: 'The `aws:PrincipalOrgID` condition key allows you to define policies that restrict resource access exclusively to principals belonging to accounts inside a specific AWS Organization.',
        engineerReasoning: 'Using `aws:PrincipalOrgID` eliminates the need to manually update bucket policies every time a new member account is created in your AWS Organization.',
        businessImpact: 'Hardcoding individual account IDs leads to operational drift and developers opening buckets to `Principal: "*"` when access fails.',
        awsBestPractice: 'Enforce `aws:PrincipalOrgID` on all internal shared services and data lake buckets.'
      },
      {
        id: 's3-q7',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Cost & Security Optimization',
        topicId: 'lifecycle-policies',
        topicTitle: 'Lifecycle Policies',
        question: 'How do S3 Lifecycle policies support both cost reduction and security data retention requirements?',
        options: [
          'By compressing files and changing their file extensions.',
          'By automatically transitioning older objects to cheaper storage tiers (Glacier) and permanently expiring noncurrent versions after a specified retention period.',
          'By deleting CloudTrail logs after 24 hours.',
          'By blocking users who download more than 10GB of data.'
        ],
        correctIndex: 1,
        explanation: 'Lifecycle policies automate the movement of aging data to lower-cost archival tiers like Glacier Flexible Retrieval and guarantee that expired data is permanently deleted in accordance with compliance schedules.',
        engineerReasoning: 'Retaining noncurrent versions indefinitely creates massive AWS storage bills and exposes stale legacy data to potential breach.',
        businessImpact: 'Unmanaged object versions can accumulate millions of dollars in unexpected storage costs and violate privacy "right to be forgotten" regulations.',
        awsBestPractice: 'Define lifecycle rules that transition objects after 90 days and expire noncurrent versions according to your corporate data retention policy.'
      },
      {
        id: 's3-q8',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'Cross-Region Backup Strategy',
        topicId: 'backup-strategy',
        topicTitle: 'Backup Strategy',
        question: 'You are designing an anti-ransomware disaster recovery architecture for critical S3 objects. Which architecture provides the strongest protection against total account compromise?',
        options: [
          'Store all backups in a second bucket in the same account with the same administrator credentials.',
          'Configure Cross-Region Replication (CRR) to a destination bucket in a separate, dedicated AWS Security Archive account with Object Lock enabled and separate root credentials.',
          'Download backups to an office laptop external hard drive daily.',
          'Make the primary bucket publicly readable so employees can restore files themselves.'
        ],
        correctIndex: 1,
        explanation: 'Replicating data across regions to an entirely separate AWS account with separate IAM trust boundaries ensures that even if the primary production account is 100% compromised, the backup archive cannot be deleted or altered.',
        engineerReasoning: 'Account boundaries are the strongest blast radius containment mechanism in AWS. Backups stored in the same account can be deleted by any compromised administrator.',
        businessImpact: 'A single account compromise that wipes out both production and backups forces the company into immediate liquidation or paying extortion.',
        awsBestPractice: 'Deploy a centralized Log and Backup Archive account in AWS Organizations with SCPs preventing any member account administrator from touching the destination buckets.'
      },
      {
        id: 's3-q9',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Access Control Lists vs Policies',
        topicId: 'bucket-policies',
        topicTitle: 'Bucket Policies',
        question: 'Why does AWS recommend disabling S3 Access Control Lists (ACLs) using "Object Ownership: Bucket Owner Enforced"?',
        options: [
          'Because ACLs slow down network download speeds by 50%.',
          'Because ACLs are a legacy access control mechanism that can allow external cross-account uploaders to retain ownership and grant public access, whereas Bucket Owner Enforced simplifies security entirely through modern IAM and bucket policies.',
          'Because ACLs require payment for every object permission checked.',
          'Because ACLs cannot be used with JSON files.'
        ],
        correctIndex: 1,
        explanation: 'Historically, if Account B uploaded an object into Account A’s bucket, Account B owned the object and could make it public. "Bucket Owner Enforced" disables ACLs completely, ensuring the bucket owner owns and controls every object via bucket policies.',
        engineerReasoning: 'Managing permissions through both ACLs and Bucket Policies creates hidden exposures and conflicting access paths.',
        businessImpact: 'Misconfigured object ACLs have caused major public leaks where individual objects remained public despite restrictive bucket-level policies.',
        awsBestPractice: 'Enable S3 Object Ownership: Bucket Owner Enforced on all existing and new S3 buckets.'
      },
      {
        id: 's3-q10',
        type: 'scenario',
        difficulty: 'Beginner',
        category: 'Public Access',
        topicId: 'public-access',
        topicTitle: 'Public Access',
        question: 'A developer creates an S3 bucket and unchecks "Block all public access" to host images for an internal wiki. However, the bucket URL returns `403 Forbidden` to external users on the internet. Why is the bucket not yet publicly leaking files?',
        options: [
          'Because S3 buckets require a paid subscription to be accessed over the internet.',
          'Because disabling Block Public Access only allows public policies to be applied; by default, buckets have NO public policy and default to explicit deny for unauthenticated principals.',
          'Because AWS scans all uploaded images for security clearance first.',
          'Because the developer’s AWS account is less than 30 days old.'
        ],
        correctIndex: 1,
        explanation: 'Disabling Block Public Access removes the preventative guardrail, but does not grant permissions on its own. A bucket policy or ACL granting `Principal: "*"` is still required for external users to read data.',
        engineerReasoning: 'It is a common beginner misconception that unchecking BPA automatically makes the bucket public. However, leaving BPA disabled leaves the door unlocked for any future policy change to expose the bucket.',
        businessImpact: 'An unshielded bucket is one misconfigured Terraform commit away from an instant public data breach.',
        awsBestPractice: 'Keep Block Public Access turned ON at all times unless there is an approved architectural exception.'
      },
      {
        id: 's3-q11',
        type: 'concept',
        difficulty: 'Intermediate',
        category: 'Object Lock Modes',
        topicId: 'data-protection',
        topicTitle: 'Data Protection',
        question: 'What is the critical difference between S3 Object Lock in "Governance Mode" versus "Compliance Mode"?',
        options: [
          'Governance Mode is free, whereas Compliance Mode costs $100/month.',
          'In Governance Mode, users with the `s3:BypassGovernanceRetention` permission can delete objects before the retention period expires; in Compliance Mode, NO user (including the AWS Account Root User) can delete objects until retention has expired.',
          'Governance Mode encrypts data, while Compliance Mode does not.',
          'Compliance Mode is only available in the US East (N. Virginia) region.'
        ],
        correctIndex: 1,
        explanation: 'Compliance Mode enforces strict WORM immutability where no principal, not even the root user, can overwrite or delete the object during retention. Governance mode allows authorized admins to alter retention or delete data if necessary.',
        engineerReasoning: 'Choose Compliance Mode for regulatory requirements (SEC Rule 17a-4) and ransomware protection; choose Governance Mode for testing retention policies.',
        businessImpact: 'Using Governance Mode for regulatory archives can fail compliance examinations if administrators have bypass permissions.',
        awsBestPractice: 'Carefully calculate retention durations before enabling Compliance Mode, as AWS Support cannot delete objects under compliance retention under any circumstances.'
      },
      {
        id: 's3-q12',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'VPC Endpoint Perimeter',
        topicId: 'bucket-policies',
        topicTitle: 'Bucket Policies',
        question: 'Your company security policy dictates that production database backups in S3 must NEVER be accessible from the public internet, even by authorized employees with valid credentials. Which policy control enforces this?',
        options: [
          'Enable AWS WAF on the S3 bucket.',
          'Attach a bucket policy that denies all access unless the request originates from your VPC Endpoint (`Condition: { "StringNotEquals": { "aws:sourceVpce": "vpce-12345678" } }`).',
          'Rename the bucket to include `.internal`.',
          'Change the IAM password every 2 hours.'
        ],
        correctIndex: 1,
        explanation: 'Restricting access via the `aws:sourceVpce` condition ensures that traffic must traverse your private AWS network through a designated VPC Endpoint, preventing requests from public IP addresses regardless of credential validity.',
        engineerReasoning: 'Network boundary enforcement prevents stolen IAM credentials from being used from an attacker’s external machine.',
        businessImpact: 'If credentials are stolen, the attacker is completely neutralized because they cannot reach the data without possessing access to your private VPC.',
        awsBestPractice: 'Combine identity policies with network-restricted resource policies (VPC Endpoints) for high-sensitivity data stores.'
      }
    ]
  },

  network: {
    pathId: 'network',
    title: 'Network Security Module Assessment',
    description: 'Test your understanding of VPC isolation, subnet segmentation, Security Groups vs NACLs, PrivateLink, load balancer WAF integration, and private egress boundaries.',
    passingScore: 70,
    badgeAwardId: 'network-protector',
    badgeMinScore: 85,
    recommendedInvestigationId: 'inv-net-01',
    recommendedInvestigationTitle: 'Investigation: Compromised EC2 & Unauthorized Lateral Movement',
    recommendedInvestigationPath: '/investigations',
    nextModulePathId: 'monitoring',
    nextModuleTitle: 'Monitoring & Logging',
    questions: [
      {
        id: 'net-q1',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Security Groups vs NACLs',
        topicId: 'security-groups-vs-nacls',
        topicTitle: 'Security Groups',
        question: 'Why are AWS Security Groups described as "stateful", whereas Network Access Control Lists (NACLs) are described as "stateless"?',
        options: [
          'Security Groups store data in memory, while NACLs store data on disk.',
          'Security Groups automatically allow return traffic for established inbound connections; NACLs evaluate inbound and outbound rules independently and require explicit rules for both directions.',
          'Security Groups apply to entire VPCs, while NACLs apply to individual EC2 instances.',
          'Security Groups only inspect UDP packets, while NACLs inspect TCP packets.'
        ],
        correctIndex: 1,
        explanation: 'Because Security Groups are stateful, return traffic for an authorized inbound request is automatically allowed outbound regardless of outbound rules. NACLs are stateless, meaning return traffic must explicitly match an outbound rule (including ephemeral ports 1024–65535).',
        engineerReasoning: 'Stateless filtering requires configuring wide ephemeral port ranges on return paths, which beginners frequently break when configuring custom NACLs.',
        businessImpact: 'Misunderstanding stateless NACL return rules causes sudden outages during deployments when legitimate response traffic is dropped.',
        awsBestPractice: 'Use Security Groups as the primary host-level firewall and keep NACLs as broad subnet-level coarse defense-in-depth filters.'
      },
      {
        id: 'net-q2',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Subnet Topology',
        topicId: 'subnets',
        topicTitle: 'Subnets',
        question: 'In a production 3-tier web architecture (Web, App, Database), in which subnet tier should the RDS database instances reside, and what route table configuration must be enforced?',
        options: [
          'In the Public Subnet with an Internet Gateway route so developers can manage it from home.',
          'In an Isolated Private Subnet with NO route to an Internet Gateway and NO public IP addresses assigned.',
          'In the Web Subnet with port 3306 opened to `0.0.0.0/0`.',
          'In the default VPC with automatic public DNS.'
        ],
        correctIndex: 1,
        explanation: 'Databases should always be placed in an isolated private subnet without public IPs or direct internet routes. Application servers communicate with the database over internal VPC private IPs.',
        engineerReasoning: 'Eliminating direct internet routability ensures that an attacker cannot reach the database listening port without first compromising an intermediate application tier.',
        businessImpact: 'Databases placed in public subnets with weak passwords or zero-day flaws are routinely discovered and ransomed within hours by automated crawlers.',
        awsBestPractice: 'Deploy database workloads across at least two Availability Zones in private subnets with no route to an Internet Gateway.'
      },
      {
        id: 'net-q3',
        type: 'scenario',
        difficulty: 'Intermediate',
        category: 'Security Group Hygiene',
        topicId: 'security-groups-vs-nacls',
        topicTitle: 'Security Groups',
        question: 'During a security audit, you discover a Security Group rule allowing `Inbound: Port 22 (SSH), Source: 0.0.0.0/0`. What is the immediate threat, and what is the recommended remediation?',
        options: [
          'Zero threat because SSH is encrypted; leave it open for developer convenience.',
          'Threat: Automated brute-force attacks and exploitation of SSH zero-days from anywhere in the world. Remediation: Remove `0.0.0.0/0` and replace with AWS Systems Manager (SSM) Session Manager for agent-based access without open ports.',
          'Threat: High AWS bandwidth costs. Remediation: Change the port to 2222.',
          'Threat: The instance will shut down. Remediation: Add a NACL that allows port 22.'
        ],
        correctIndex: 1,
        explanation: 'Opening port 22 to `0.0.0.0/0` exposes the machine to continuous credential stuffing and exploit attempts. AWS Systems Manager Session Manager enables encrypted CLI shell access via IAM policies without requiring any open inbound ports or public IPs.',
        engineerReasoning: 'Eliminating all open inbound administrative ports (22 SSH, 3389 RDP) shrinks the attack surface to zero at the network perimeter.',
        businessImpact: 'Compromised SSH keys or brute-forced passwords allow adversaries to gain root shells on EC2 instances and pivot internally.',
        awsBestPractice: 'Disable inbound SSH across all Security Groups and mandate AWS Systems Manager Session Manager with CloudTrail logging.'
      },
      {
        id: 'net-q4',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'Private Connectivity',
        topicId: 'private-networking',
        topicTitle: 'Private Networking',
        question: 'EC2 instances in a private subnet need to upload audit logs to Amazon S3. The CISO mandates that the traffic must NEVER leave the AWS private network backbone and must NOT incur NAT Gateway data processing charges. Which solution fulfills both requirements?',
        options: [
          'Attach an Internet Gateway to the private subnet route table.',
          'Create an S3 Gateway VPC Endpoint in the VPC and associate it with the private subnet route table.',
          'Route all traffic through an open proxy EC2 instance in a public subnet.',
          'Use an SSH tunnel to a developer laptop.'
        ],
        correctIndex: 1,
        explanation: 'AWS provides S3 Gateway VPC Endpoints free of charge. Traffic between instances in the VPC and Amazon S3 traverses the private AWS global network without traversing the public internet or incurring NAT Gateway data fees.',
        engineerReasoning: 'Gateway VPC Endpoints for S3 and DynamoDB provide high bandwidth, zero data processing cost, and seamless private network routing.',
        businessImpact: 'Routing heavy S3 data through NAT Gateways costs $0.045/GB in data processing fees, resulting in tens of thousands of dollars in wasted operational spend.',
        awsBestPractice: 'Configure S3 and DynamoDB Gateway VPC Endpoints in all VPCs as a cost and security standard.'
      },
      {
        id: 'net-q5',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'NAT vs IGW',
        topicId: 'internet-gateway',
        topicTitle: 'Internet Gateway',
        question: 'What is the functional difference between an Internet Gateway (IGW) and a NAT Gateway?',
        options: [
          'An IGW is used for databases, while a NAT Gateway is used for web servers.',
          'An IGW enables bi-directional communication (both inbound and outbound) for public instances; a NAT Gateway allows private subnet instances to initiate outbound connections to the internet while blocking unsolicited inbound connections from the internet.',
          'An IGW costs $1/hour, while a NAT Gateway is always free.',
          'An IGW only works with IPv6, while a NAT Gateway only works with IPv4.'
        ],
        correctIndex: 1,
        explanation: 'An IGW performs 1:1 NAT for public instances to receive inbound internet connections. A NAT Gateway allows private instances to download OS security patches outbound without exposing them to inbound internet attacks.',
        engineerReasoning: 'Understanding egress-only vs ingress-capable routing is essential for proper network zoning and preventing accidental exposure of internal systems.',
        businessImpact: 'Placing private application services behind an IGW with public IPs exposes their application ports directly to internet-wide port scans.',
        awsBestPractice: 'Keep application and worker nodes in private subnets with routes pointing to a managed NAT Gateway for outbound patch management only.'
      },
      {
        id: 'net-q6',
        type: 'securityThinking',
        difficulty: 'Advanced',
        category: 'VPC Peering Security',
        topicId: 'private-networking',
        topicTitle: 'Private Networking',
        question: 'Two VPCs are connected via a VPC Peering connection. VPC A is peered with VPC B, and VPC B is peered with VPC C. Can an EC2 instance in VPC A directly communicate with an instance in VPC C through VPC B?',
        options: [
          'Yes, because VPC Peering is transitive by default.',
          'No, because VPC Peering does NOT support transitive routing; a direct peering connection or AWS Transit Gateway is required.',
          'Yes, provided both VPCs use the same AWS account root password.',
          'Yes, if Security Groups in VPC B allow all traffic.'
        ],
        correctIndex: 1,
        explanation: 'VPC Peering does not support edge-to-edge routing (transitive peering). You cannot hop through an intermediate VPC. For centralized hub-and-spoke transitive routing, AWS Transit Gateway must be used.',
        engineerReasoning: 'Non-transitive peering is a security advantage because it enforces strict point-to-point network trust and prevents unauthorized network bridging.',
        businessImpact: 'Misunderstanding peering topology leads to architectural gridlock or accidentally connecting production networks to untrusted dev environments.',
        awsBestPractice: 'Use AWS Transit Gateway with separate route tables for complex multi-VPC enterprise network architectures with centralized inspection.'
      },
      {
        id: 'net-q7',
        type: 'scenario',
        difficulty: 'Intermediate',
        category: 'Load Balancer Security',
        topicId: 'load-balancers',
        topicTitle: 'Load Balancers',
        question: 'You deploy an Application Load Balancer (ALB) in public subnets in front of backend EC2 instances in private subnets. How should the EC2 instances’ Security Group be configured to ensure traffic only comes from the ALB?',
        options: [
          'Allow Inbound: Port 80/443, Source: `0.0.0.0/0`.',
          'Allow Inbound: Port 80/443, Source: The Security Group ID of the Application Load Balancer (e.g., `sg-alb12345`).',
          'Allow Inbound: All traffic from the Internet Gateway.',
          'Allow Inbound: Any IP address ending in `.1`.'
        ],
        correctIndex: 1,
        explanation: 'Security Groups can reference other Security Groups as their source. Referencing the ALB Security Group guarantees that only traffic routed through the load balancer (where WAF and SSL inspection occur) can reach backend instances.',
        engineerReasoning: 'Security group referencing allows instances to dynamically accept traffic from auto-scaling ALB nodes without needing to manage changing IP addresses.',
        businessImpact: 'Opening backend instance ports to IP ranges allows attackers who discover internal IP addresses or bypass the ALB to attack instances directly.',
        awsBestPractice: 'Chain Security Groups: Web Tier accepts traffic from ALB SG; DB Tier accepts traffic only from App Tier SG.'
      },
      {
        id: 'net-q8',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'Third-Party PrivateLink',
        topicId: 'private-networking',
        topicTitle: 'Private Networking',
        question: 'Your company needs to consume an external banking API hosted in another vendor’s AWS account. Both companies’ VPCs use overlapping CIDR blocks (`10.0.0.0/16`). How can you securely connect to the vendor service without re-IPing either network?',
        options: [
          'Create a standard VPC Peering connection and ignore IP conflict warnings.',
          'Deploy an AWS PrivateLink (VPC Interface Endpoint) connection to the vendor’s VPC Endpoint Service.',
          'Make both VPCs public and send unencrypted traffic over the internet.',
          'Merge both AWS accounts into one.'
        ],
        correctIndex: 1,
        explanation: 'AWS PrivateLink uses Network Load Balancers and Elastic Network Interfaces (ENIs) to expose specific services across accounts without requiring network peering or routing between VPC CIDRs, completely avoiding overlapping IP issues.',
        engineerReasoning: 'PrivateLink provides unidirectional, service-specific connectivity without opening the rest of either company’s VPC to lateral movement.',
        businessImpact: 'VPC Peering fails completely when CIDRs overlap; re-IPing an enterprise network can cost hundreds of thousands of dollars and months of delay.',
        awsBestPractice: 'Use AWS PrivateLink for SaaS vendor integrations and cross-organization microservice sharing.'
      },
      {
        id: 'net-q9',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'CIDR Planning',
        topicId: 'vpc-basics',
        topicTitle: 'VPC Basics',
        question: 'In an AWS VPC subnet with the CIDR block `10.0.1.0/24` (256 theoretical IP addresses), how many IP addresses are actually available for your EC2 instances and ENIs?',
        options: [
          '256',
          '251 (AWS reserves 5 IP addresses in every subnet: .0 network, .1 router, .2 DNS, .3 future use, and .255 broadcast)',
          '254',
          '128'
        ],
        correctIndex: 1,
        explanation: 'AWS reserves the first 4 IP addresses (.0, .1, .2, .3) and the last IP address (.255) of every subnet for internal VPC routing, DNS, and DHCP infrastructure.',
        engineerReasoning: 'Knowing that AWS reserves 5 IP addresses per subnet is critical when sizing small subnets (e.g., a `/28` only has 11 usable IPs).',
        businessImpact: 'Under-sizing subnets can lead to IP exhaustion during traffic spikes, preventing auto-scaling groups from launching new instances and causing customer outages.',
        awsBestPractice: 'Plan VPC CIDR architectures with sufficient room for growth (e.g., `/16` for VPC, `/20` or `/24` for subnets).'
      },
      {
        id: 'net-q10',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Egress Filtering',
        topicId: 'internet-gateway',
        topicTitle: 'Internet Gateway',
        question: 'Why do sophisticated attackers prioritize establishing outbound command-and-control (C2) channels over ports 80 and 443, and how should a cloud network engineer defend against it?',
        options: [
          'Because ports 80 and 443 are free of charge on AWS.',
          'Because traditional firewalls and Security Groups frequently allow all outbound traffic (`0.0.0.0/0 on all ports`). Defense: Implement an egress proxy or AWS Network Firewall with Domain Name / FQDN filtering to block unauthorized outbound domains.',
          'Because AWS prohibits scanning on ports 80 and 443.',
          'Because attackers cannot use encryption on any other port.'
        ],
        correctIndex: 1,
        explanation: 'Outbound security groups default to allowing all egress traffic. Attackers exploit this to beacon out to malicious domain names over HTTPS. AWS Network Firewall can inspect SNI (Server Name Indication) to block unauthorized domains.',
        engineerReasoning: 'Restricting egress is just as critical as restricting ingress; if a server is compromised, egress controls prevent data exfiltration and reverse shell connections.',
        businessImpact: 'Unrestricted egress allows automated malware to download second-stage payloads and exfiltrate sensitive databases to attacker drop-boxes.',
        awsBestPractice: 'Enforce centralized egress inspection using AWS Network Firewall or an egress proxy filtering outbound traffic by approved domain allowlists.'
      },
      {
        id: 'net-q11',
        type: 'scenario',
        difficulty: 'Advanced',
        category: 'NACL Evaluation Order',
        topicId: 'security-groups-vs-nacls',
        topicTitle: 'NACLs',
        question: 'A Network ACL has Rule 100: `Allow, TCP 443, 0.0.0.0/0` and Rule 50: `Deny, TCP 443, 198.51.100.5/32`. An inbound packet arrives from `198.51.100.5` on port 443. How does the NACL evaluate the packet?',
        options: [
          'The packet is ALLOWED because Rule 100 allows all IPs.',
          'The packet is DENIED because NACLs evaluate rules in numerical order starting with the lowest number, and Rule 50 (Deny) matches first.',
          'The packet is held in a buffer until an administrator approves it.',
          'The packet is routed to a blackhole route table.'
        ],
        correctIndex: 1,
        explanation: 'NACL rules are processed in strict order from lowest number to highest number. The moment a rule matches the packet attributes, the action (Allow or Deny) is taken immediately and no further rules are evaluated.',
        engineerReasoning: 'When adding emergency block rules to a NACL (e.g. blocking a DDoS IP), always assign it a rule number lower than your general allow rules.',
        businessImpact: 'Adding a Deny rule with number 200 after an Allow rule with number 100 will have ZERO effect, leaving an active attack path open.',
        awsBestPractice: 'Leave increments of 10 or 100 between NACL rule numbers (e.g., 100, 110, 120) so emergency blocks can be inserted with lower numbers.'
      },
      {
        id: 'net-q12',
        type: 'engineerDecision',
        difficulty: 'Intermediate',
        category: 'Web Application Defense',
        topicId: 'load-balancers',
        topicTitle: 'Load Balancers',
        question: 'Your web application is experiencing an automated SQL Injection and Cross-Site Scripting (XSS) attack targeting public HTTP endpoints. Which AWS service should be attached to the Application Load Balancer to mitigate this without altering application code?',
        options: [
          'Amazon Route 53',
          'AWS WAF (Web Application Firewall)',
          'AWS Shield Standard',
          'Amazon VPC Flow Logs'
        ],
        correctIndex: 1,
        explanation: 'AWS WAF inspects HTTP/HTTPS requests at Layer 7 and blocks malicious request payloads (including SQLi, XSS, and bad bot traffic) before the traffic ever reaches your backend EC2 instances.',
        engineerReasoning: 'Deploying AWS Managed Rules for Core Rule Set (CRS) and SQL database protection provides immediate Layer 7 protection at the perimeter.',
        businessImpact: 'Unmitigated SQL injection allows attackers to dump the entire backend database directly through web form inputs.',
        awsBestPractice: 'Attach AWS WAF with rate-based rules and AWS Managed Rule Groups to all internet-facing Application Load Balancers and CloudFront distributions.'
      }
    ]
  },

  monitoring: {
    pathId: 'monitoring',
    title: 'Monitoring & Logging Module Assessment',
    description: 'Assess your skills in CloudTrail management, multi-region auditing, CloudWatch anomaly detection, GuardDuty threat triage, and forensic Athena SQL log queries.',
    passingScore: 70,
    badgeAwardId: 'monitoring-specialist',
    badgeMinScore: 85,
    recommendedInvestigationId: 'inv-mon-01',
    recommendedInvestigationTitle: 'Investigation: CloudTrail Tampering & Defense Evasion',
    recommendedInvestigationPath: '/investigations',
    nextModulePathId: 'architecture',
    nextModuleTitle: 'Security Architecture',
    questions: [
      {
        id: 'mon-q1',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Audit Trails',
        topicId: 'cloudtrail',
        topicTitle: 'CloudTrail',
        question: 'What is the primary role of AWS CloudTrail in a cloud security operations program?',
        options: [
          'It acts as an anti-virus engine that automatically cleans malware from EC2 instances.',
          'It records every AWS API call made in the account (who, what, when, from where, and which credentials were used), providing an immutable audit trail for security and forensics.',
          'It monitors CPU and RAM utilization metrics on virtual servers.',
          'It generates SSL certificates for custom domain names.'
        ],
        correctIndex: 1,
        explanation: 'AWS CloudTrail provides an immutable audit history of actions taken by a user, role, or AWS service in the AWS Management Console, SDKs, and CLI tools.',
        engineerReasoning: 'CloudTrail is the foundational ground truth for all cloud security investigations. Without CloudTrail, you cannot prove what an attacker did or determine blast radius.',
        businessImpact: 'Disabling or failing to configure CloudTrail results in complete regulatory non-compliance and blinds the organization during security incidents.',
        awsBestPractice: 'Enable a Multi-Region Organization Trail delivering to an encrypted, isolated S3 bucket in a dedicated log archive account with Log File Validation enabled.'
      },
      {
        id: 'mon-q2',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Anti-Tampering',
        topicId: 'audit-trails',
        topicTitle: 'Audit Trails',
        question: 'During a breach, an attacker attempts to modify or delete historical CloudTrail log files stored in an S3 bucket to cover their tracks. Which CloudTrail feature allows a forensic investigator to mathematically prove whether logs were altered or deleted?',
        options: [
          'CloudWatch Synthetics',
          'CloudTrail Log File Validation (Digest Files)',
          'Amazon QuickSight',
          'S3 Static Website Hosting'
        ],
        correctIndex: 1,
        explanation: 'When Log File Validation is enabled, CloudTrail generates cryptographic digest files (SHA-256 hashes signed with RSA) every hour. Any modification, deletion, or injection of log records breaks the digital signature chain.',
        engineerReasoning: 'Cryptographic digest verification ensures evidence will hold up in court or regulatory enforcement actions following a major breach.',
        businessImpact: 'If an adversary successfully deletes logs without detection, the organization cannot determine whether intellectual property or customer data was stolen.',
        awsBestPractice: 'Run `aws cloudtrail validate-logs` during forensic investigations to verify log integrity.'
      },
      {
        id: 'mon-q3',
        type: 'scenario',
        difficulty: 'Intermediate',
        category: 'Threat Detection',
        topicId: 'detection',
        topicTitle: 'Detection',
        question: 'Amazon GuardDuty generates the finding `UnauthorizedAccess:EC2/TorIP`. What does this finding indicate, and what should be the immediate containment action?',
        options: [
          'An EC2 instance is downloading high volumes of video files; reboot the instance.',
          'An EC2 instance is communicating with a known Tor exit node or darknet anonymizer; isolate the EC2 instance immediately by applying a quarantine Security Group with zero inbound/outbound rules.',
          'The AWS billing threshold has been reached; contact AWS support.',
          'A developer logged in from their home office; ignore the finding.'
        ],
        correctIndex: 1,
        explanation: 'Tor exit node communication is a high-confidence indicator of compromise (C2 beaconing, malware downloads, or an attacker using a Tor proxy). Applying a quarantine security group cuts network access instantly while preserving memory.',
        engineerReasoning: 'Containment must precede termination. Cutting network connectivity stops active exfiltration while keeping the instance running for forensic memory acquisition.',
        businessImpact: 'Failing to respond immediately allows ransomware to propagate laterally across the internal VPC network.',
        awsBestPractice: 'Automate quarantine response actions using Amazon EventBridge and AWS Lambda for critical GuardDuty findings.'
      },
      {
        id: 'mon-q4',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'Forensic Log Analysis',
        topicId: 'audit-trails',
        topicTitle: 'Audit Trails',
        question: 'You need to investigate 50 million CloudTrail JSON records across a 30-day window to identify all IAM policies modified by a specific compromised role. Downloading and parsing JSON files manually is too slow. Which AWS architecture solves this?',
        options: [
          'Copy files to a local spreadsheet and filter manually.',
          'Partition the S3 bucket and use Amazon Athena to run standard serverless SQL queries directly against the CloudTrail logs.',
          'Enable AWS Trusted Advisor.',
          'Ask AWS Support to read the logs for you.'
        ],
        correctIndex: 1,
        explanation: 'Amazon Athena is an interactive, serverless SQL query service that integrates directly with S3. By partitioning CloudTrail logs by year, month, and day, you can query millions of records in seconds.',
        engineerReasoning: 'Speed of analysis directly impacts containment time. Athena allows investigators to write complex SQL joins to trace attacker lateral movement.',
        businessImpact: 'Slow forensic analysis allows active threats to maintain persistence and expands breach remediation costs into millions of dollars.',
        awsBestPractice: 'Maintain pre-configured Athena tables with CloudTrail partition projection in your security operations account.'
      },
      {
        id: 'mon-q5',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Threat Intelligence',
        topicId: 'detection',
        topicTitle: 'Detection',
        question: 'Which underlying data sources does Amazon GuardDuty analyze to detect unauthorized behavior and malicious activity in an AWS account without requiring agent installation?',
        options: [
          'Only operating system `/var/log/messages` files.',
          'AWS CloudTrail event logs, VPC Flow Logs, DNS Query logs, EKS audit logs, and S3 data events.',
          'Employee Slack messages and email inboxes.',
          'GitHub public pull requests.'
        ],
        correctIndex: 1,
        explanation: 'GuardDuty operates at the cloud infrastructure control plane, continuously consuming CloudTrail management/data events, VPC Flow Logs, and DNS queries directly from AWS fabric telemetry without impacting workload performance.',
        engineerReasoning: 'Agentless detection ensures complete visibility across all accounts and instances without requiring agent deployment or maintenance.',
        businessImpact: 'Without GuardDuty, compromised instances and stolen API credentials can operate undetected for months.',
        awsBestPractice: 'Enable Amazon GuardDuty across all regions in every account via AWS Organizations delegated administrator.'
      },
      {
        id: 'mon-q6',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Metric Alarms',
        topicId: 'alerting',
        topicTitle: 'Alerting',
        question: 'Why is it critical to create a CloudWatch Metric Filter and Alarm specifically monitoring for the `AuthorizeSecurityGroupIngress` and `AuthorizeSecurityGroupEgress` API calls in CloudTrail?',
        options: [
          'Because changing Security Groups increases monthly AWS billings.',
          'Because attackers who gain initial access frequently alter Security Group rules to open administrative ports (e.g. 22 SSH, 3389 RDP) or permit outbound data exfiltration.',
          'Because Security Groups can only be modified 5 times per month.',
          'Because AWS automatically shuts down instances if security groups are edited.'
        ],
        correctIndex: 1,
        explanation: 'Unauthorized perimeter modification is a classic indicator of attacker defense evasion and backdoor creation. Alerting on security group modifications provides immediate warning of perimeter erosion.',
        engineerReasoning: 'Real-time alerting on security group changes catches both malicious compromises and accidental developer mistakes before assets are exploited.',
        businessImpact: 'Unmonitored security group changes turn private internal database networks into publicly accessible targets.',
        awsBestPractice: 'Deploy CIS Benchmark recommended CloudWatch metric filters and SNS alerting for all security group, network ACL, and gateway changes.'
      },
      {
        id: 'mon-q7',
        type: 'scenario',
        difficulty: 'Advanced',
        category: 'Root Activity Alerting',
        topicId: 'alerting',
        topicTitle: 'Alerting',
        question: 'A security engineer receives an urgent PagerDuty alert: `CloudTrail Alert: AWS Root Account Login Detected from Residential ISP in Eastern Europe`. What is the immediate priority?',
        options: [
          'Wait until the morning standup to verify if the VP of Engineering was traveling.',
          'Initiate P1 Incident Response: verify legitimacy immediately, contact account owner, rotate root password, terminate all active root console sessions, and check CloudTrail for unauthorized IAM or resource creation.',
          'Delete the CloudWatch alarm to silence the notification.',
          'Send a support ticket to AWS asking for a refund.'
        ],
        correctIndex: 1,
        explanation: 'Root account access from an unknown IP is a P1 red alert. Because Root possesses unrestricted power, immediate triage and credential invalidation are required to prevent permanent loss of the AWS account.',
        engineerReasoning: 'Every minute an attacker holds root credentials increases the probability of them deleting backups, establishing administrative persistence, or deploying ransomware.',
        businessImpact: 'Complete account compromise, intellectual property loss, or permanent company shutdown.',
        awsBestPractice: 'Enforce hardware MFA on Root, store credentials in an offline corporate safe, and alert 24/7 on any root API or console usage.'
      },
      {
        id: 'mon-q8',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'Automated Containment',
        topicId: 'security-monitoring',
        topicTitle: 'Security Monitoring',
        question: 'You want to build an automated containment workflow that instantly disables any IAM Access Key if AWS Health or GuardDuty detects that the key was published to a public GitHub repository. Which architecture is recommended?',
        options: [
          'Hire an offshore team to refresh GitHub search every 10 minutes.',
          'Configure Amazon EventBridge to capture the AWS Health / GuardDuty event and trigger an AWS Lambda function that executes `iam:UpdateAccessKey` with `Status: Inactive`.',
          'Use an S3 lifecycle policy to delete the IAM user.',
          'Deploy an EC2 instance that runs a bash script once per week.'
        ],
        correctIndex: 1,
        explanation: 'EventBridge combined with Lambda enables event-driven security orchestration (SOAR). When AWS detects a leaked key, the event triggers Lambda to revoke the key within seconds, mitigating the attack before adversaries can exploit it.',
        engineerReasoning: 'Automated adversary bots scrape GitHub and deploy crypto-miners within 2 to 4 minutes of a commit. Automated remediation is the only way to beat automated attackers.',
        businessImpact: 'Automated key deactivation prevents tens of thousands of dollars in fraudulent compute charges and data theft.',
        awsBestPractice: 'Implement automated event-driven containment for high-severity, high-confidence security events.'
      },
      {
        id: 'mon-q9',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Log Aggregation',
        topicId: 'cloudwatch',
        topicTitle: 'CloudWatch',
        question: 'What is the function of the unified CloudWatch Agent when installed on EC2 instances or on-premises servers?',
        options: [
          'It replaces the Linux operating system kernel.',
          'It collects internal operating system metrics (e.g. Memory utilization, disk space) and local log files (e.g. `/var/log/secure`, Windows Event Logs) and streams them to CloudWatch.',
          'It accelerates internet browsing speeds for users.',
          'It decrypts KMS keys.'
        ],
        correctIndex: 1,
        explanation: 'Standard EC2 hypervisor metrics cannot see inside the guest OS. The CloudWatch Agent bridges this gap by collecting guest-level memory metrics, disk utilization, and application log files.',
        engineerReasoning: 'Correlating guest OS authentication logs (e.g. SSH logins in `/var/log/secure`) with cloud control plane CloudTrail events provides end-to-end incident visibility.',
        businessImpact: 'Without host-level logs, investigators cannot determine what commands an attacker executed once they gained a shell on an EC2 instance.',
        awsBestPractice: 'Bake the CloudWatch Agent into base Golden AMIs and stream system logs to centralized CloudWatch log groups.'
      },
      {
        id: 'mon-q10',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Multi-Region Auditing',
        topicId: 'cloudtrail',
        topicTitle: 'CloudTrail',
        question: 'Your company only operates infrastructure in `us-east-1`. Why MUST CloudTrail be configured as a "Multi-Region Trail" rather than a single-region trail?',
        options: [
          'Because AWS charges double for single-region trails.',
          'Because adversaries who compromise credentials frequently launch unauthorized crypto-mining instances or create backdoors in unmonitored regions (e.g. `ap-southeast-1` or `eu-west-3`) to avoid detection.',
          'Because multi-region trails make websites load faster globally.',
          'Because single-region trails only log database events.'
        ],
        correctIndex: 1,
        explanation: 'Attackers know organizations often only monitor their primary active region. They deliberately target unused regions to deploy resource-intensive workloads without triggering local alerts.',
        engineerReasoning: 'Visibility must cover the entire global footprint of AWS. A multi-region trail logs activity across all 30+ AWS regions automatically.',
        businessImpact: 'Unmonitored foreign regions can accumulate tens of thousands of dollars in compute charges and host malicious phishing infrastructure in your company’s name.',
        awsBestPractice: 'Always configure CloudTrail as a multi-region trail and deploy SCPs restricting API calls in unapproved regions.'
      },
      {
        id: 'mon-q11',
        type: 'scenario',
        difficulty: 'Advanced',
        category: 'Log Destination Isolation',
        topicId: 'audit-trails',
        topicTitle: 'Audit Trails',
        question: 'Where should the destination S3 bucket for enterprise CloudTrail logs be located in an AWS Organizations multi-account structure?',
        options: [
          'In the production account alongside the web application database.',
          'In a dedicated, isolated Log Archive AWS account with restricted administrative access, MFA Delete, S3 Object Lock, and KMS CMK encryption.',
          'In a developer’s personal AWS account.',
          'On a public S3 bucket so all employees can review logs.'
        ],
        correctIndex: 1,
        explanation: 'Segregating logs into an isolated Log Archive account prevents compromised administrators in member accounts (Dev, Staging, Prod) from altering or deleting their own audit trails.',
        engineerReasoning: 'Separation of duties requires that the entities being audited do not have permissions to modify the audit storage.',
        businessImpact: 'If logs are stored in the production account, an attacker who compromises production admin can delete all evidence, blinding the post-mortem team.',
        awsBestPractice: 'Use AWS Control Tower or Landing Zone architecture to provision a dedicated Log Archive account with centralized bucket replication.'
      },
      {
        id: 'mon-q12',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Management vs Data Events',
        topicId: 'cloudtrail',
        topicTitle: 'CloudTrail',
        question: 'What is the distinction between CloudTrail "Management Events" and CloudTrail "Data Events"?',
        options: [
          'Management Events are for managers; Data Events are for developers.',
          'Management Events track control-plane operations (e.g. creating a bucket, launching an instance, updating a policy); Data Events track high-volume resource-level operations (e.g. `s3:GetObject`, `s3:PutObject`, `lambda:Invoke`).',
          'Data Events are free of charge, while Management Events require payment.',
          'Management Events are only stored for 1 hour.'
        ],
        correctIndex: 1,
        explanation: 'Management events provide control-plane visibility (e.g. `CreateUser`, `AttachRolePolicy`). Data events capture specific object-level data plane operations (e.g. individual S3 object reads and writes).',
        engineerReasoning: 'Data events generate massive volume and cost. Security engineers selectively enable Data Events on high-sensitivity data buckets (PII, financial) rather than every bucket.',
        businessImpact: 'Enabling S3 data events on high-throughput cache buckets can unexpectedly generate thousands of dollars in CloudTrail ingestion fees.',
        awsBestPractice: 'Log all management events globally, and selectively enable S3 and Lambda data events on critical asset stores.'
      }
    ]
  },

  architecture: {
    pathId: 'architecture',
    title: 'Security Architecture Module Assessment',
    description: 'Validate your grasp of AWS Well-Architected Framework, multi-account Landing Zones, Shared Responsibility models, Defense-in-Depth, and Zero Trust design.',
    passingScore: 70,
    badgeAwardId: 'architecture-reviewer',
    badgeMinScore: 85,
    recommendedInvestigationId: 'inv-arch-01',
    recommendedInvestigationTitle: 'Architecture Review: Multi-Tier Cloud Threat Model',
    recommendedInvestigationPath: '/architecture-reviews',
    nextModulePathId: 'incident-response',
    nextModuleTitle: 'Incident Response',
    questions: [
      {
        id: 'arch-q1',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Shared Responsibility',
        topicId: 'shared-responsibility-model',
        topicTitle: 'Shared Responsibility',
        question: 'Under the AWS Shared Responsibility Model, which component is the customer exclusively responsible for securing when running an EC2 virtual machine?',
        options: [
          'Physical security of the AWS data center and server racks.',
          'Guest operating system patching, application firewall rules, and IAM access controls.',
          'Decommissioning and physical shredding of failed hard drives.',
          'Hypervisor firmware security.'
        ],
        correctIndex: 1,
        explanation: 'AWS manages security "OF" the cloud (hardware, hypervisor, facilities). The customer manages security "IN" the cloud (guest OS patches, network rules, IAM policies, and application code).',
        engineerReasoning: 'Assuming AWS automatically patches your EC2 operating systems or configures your firewalls is a fatal beginner mistake that leaves servers unpatched.',
        businessImpact: 'Unpatched guest OS vulnerabilities lead to automated exploitation, ransomware, and compliance audit failure.',
        awsBestPractice: 'Use AWS Systems Manager Patch Manager to automate guest OS security updates across all EC2 instances.'
      },
      {
        id: 'arch-q2',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Multi-Account Landing Zones',
        topicId: 'secure-aws-architectures',
        topicTitle: 'Landing Zones',
        question: 'Why does enterprise cloud security architecture mandate using multiple AWS accounts separated into Organizational Units (OUs) rather than running all workloads in a single large account?',
        options: [
          'Because AWS only permits one EC2 instance per account.',
          'To establish hard blast radius boundaries: a compromise in a development account cannot affect production, and security/logging can be isolated into dedicated accounts.',
          'To bypass AWS billing charges.',
          'Because single-account architectures cannot use IAM roles.'
        ],
        correctIndex: 1,
        explanation: 'AWS Account boundaries are the strongest isolation boundary in AWS. They provide distinct resource limits, separate IAM credential stores, and isolated audit environments.',
        engineerReasoning: 'Single-account multi-tenant environments inevitably suffer from human error, cross-environment privilege escalation, and noisy neighbor resource exhaustion.',
        businessImpact: 'In a single-account architecture, a junior developer making an error or leaking a key in dev can bring down or corrupt production.',
        awsBestPractice: 'Implement AWS Control Tower with separate Core OUs (Log Archive, Security Tooling) and Workload OUs (Dev, Staging, Prod).'
      },
      {
        id: 'arch-q3',
        type: 'scenario',
        difficulty: 'Intermediate',
        category: 'Defense in Depth',
        topicId: 'defense-in-depth',
        topicTitle: 'Defense in Depth',
        question: 'An architecture proposal for a customer payment portal relies solely on an AWS WAF at the perimeter, with database instances running in the same public subnet as the web server with unencrypted storage. Which architectural flaw does this represent?',
        options: [
          'Failure to use Docker containers.',
          'Single Point of Failure / Absence of Defense in Depth: if the WAF is bypassed by a zero-day exploit, the attacker has immediate direct access to the unencrypted database.',
          'Over-engineering the security perimeter.',
          'Failure to use Amazon Route 53.'
        ],
        correctIndex: 1,
        explanation: 'Defense in Depth dictates that multiple independent layers of security (WAF, private subnets, security group chaining, IAM least privilege, encryption at rest, and audit logging) must protect the asset.',
        engineerReasoning: 'Never rely on a single defensive control. Assume any perimeter control can and will fail.',
        businessImpact: 'A single zero-day vulnerability in the web tier leads to instant catastrophic exfiltration of raw customer payment data.',
        awsBestPractice: 'Isolate databases in private subnets, encrypt with KMS CMKs, enforce TLS in transit, and require least privilege database credentials.'
      },
      {
        id: 'arch-q4',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'Zero Trust Architecture',
        topicId: 'zero-trust',
        topicTitle: 'Zero Trust',
        question: 'Which of the following statements best embodies the core principle of Zero Trust Architecture in modern cloud environments?',
        options: [
          'Trust all traffic originating from inside the corporate VPN subnet.',
          'Never trust, always verify: do not grant implicit trust based on network location; authenticate and authorize every request explicitly based on identity, context, and data sensitivity.',
          'Disable all firewalls and rely solely on user passwords.',
          'Trust all internal microservices because they share the same VPC.'
        ],
        correctIndex: 1,
        explanation: 'Zero Trust eliminates the concept of a "trusted internal network." Every microservice call must authenticate (e.g. mutual TLS + signed IAM tokens) and authorize explicitly regardless of whether it originates inside the VPC.',
        engineerReasoning: 'Perimeter-only security fails completely once an attacker lands on an internal node and moves laterally through trusted flat networks.',
        businessImpact: 'Flat networks allow an attacker who compromises a single low-value marketing blog to move freely into core financial databases.',
        awsBestPractice: 'Implement mTLS between microservices, use IAM SigV4 authentication, and eliminate network-based implicit trust.'
      },
      {
        id: 'arch-q5',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Well-Architected Framework',
        topicId: 'security-design-principles',
        topicTitle: 'Well-Architected',
        question: 'Which of the following is NOT one of the 7 foundational design principles of the AWS Well-Architected Framework Security Pillar?',
        options: [
          'Implement a strong identity foundation.',
          'Apply security at all layers (Defense in Depth).',
          'Rely exclusively on manual security reviews and avoid automated checks.',
          'Keep people away from data.'
        ],
        correctIndex: 2,
        explanation: 'The Security Pillar strongly advocates for automating security best practices and incident response. Manual processes are prone to error, drift, and slow response times.',
        engineerReasoning: 'Automated policy enforcement, infrastructure-as-code linting, and automated remediation scale with the business; manual checks do not.',
        businessImpact: 'Manual security reviews bottleneck engineering releases, leading teams to bypass security processes entirely.',
        awsBestPractice: 'Automate security guardrails with Terraform, AWS Config rules, and CI/CD security scanning.'
      },
      {
        id: 'arch-q6',
        type: 'securityThinking',
        difficulty: 'Advanced',
        category: 'Immutable Infrastructure',
        topicId: 'secure-aws-architectures',
        topicTitle: 'Immutable Infrastructure',
        question: 'Why is "Immutable Infrastructure" (replacing running instances with freshly baked AMIs rather than patching live servers via SSH) considered a major security advancement?',
        options: [
          'Because AMIs do not require operating systems.',
          'It eliminates configuration drift, prevents attackers from maintaining persistent backdoors, and removes the need for developer SSH access to production.',
          'Because immutable servers are immune to all software bugs.',
          'Because AWS provides immutable EC2 instances for free.'
        ],
        correctIndex: 1,
        explanation: 'In immutable infrastructure, servers are never patched in-place. If an attacker plants a backdoor or webshell, it is destroyed automatically during the next automated deployment.',
        engineerReasoning: 'Eliminating live SSH access and regularly cycling instances enforces a clean known-good state across the fleet.',
        businessImpact: 'Reduces operational maintenance overhead and prevents advanced persistent threat (APT) actors from establishing multi-month footholds.',
        awsBestPractice: 'Use EC2 Image Builder to build hardened Golden AMIs and deploy them via Auto Scaling Groups with zero direct SSH access.'
      },
      {
        id: 'arch-q7',
        type: 'scenario',
        difficulty: 'Intermediate',
        category: 'Shared Responsibility',
        topicId: 'shared-responsibility-model',
        topicTitle: 'Shared Responsibility',
        question: 'When migrating from self-managed PostgreSQL on EC2 to Amazon RDS PostgreSQL, which security responsibility shifts from the customer to AWS?',
        options: [
          'Database user password management.',
          'Operating system patching, database engine security updates, and underlying hardware maintenance.',
          'Writing database SQL queries.',
          'Enforcing row-level security policies.'
        ],
        correctIndex: 1,
        explanation: 'In managed services (PaaS) like RDS, AWS manages OS patching, hypervisor maintenance, and database engine point releases. The customer still manages database users, table access, and network security groups.',
        engineerReasoning: 'Offloading low-value OS maintenance to AWS frees the security team to focus on high-value data modeling, least privilege, and application vulnerabilities.',
        businessImpact: 'Reduces the likelihood of unpatched database server vulnerabilities and simplifies regulatory compliance reporting.',
        awsBestPractice: 'Enable Auto Minor Version Upgrade on Amazon RDS instances and schedule maintenance windows.'
      },
      {
        id: 'arch-q8',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'Disaster Recovery RTO/RPO',
        topicId: 'secure-aws-architectures',
        topicTitle: 'Secure Architecture',
        question: 'A critical financial system requires a Recovery Point Objective (RPO) of under 5 minutes and a Recovery Time Objective (RTO) of under 15 minutes in the event of a regional disaster. Which architecture pattern meets this requirement?',
        options: [
          'Backup and Restore (restore from nightly tape backup).',
          'Pilot Light (minimal core services running in second region).',
          'Multi-Region Active-Active with Amazon Aurora Global Database and Route 53 latency routing with automatic failover.',
          'A single EC2 instance in us-east-1.'
        ],
        correctIndex: 2,
        explanation: 'Aurora Global Database replicates data across regions in typically under 1 second (RPO < 1s) and can be promoted to a primary region in under a minute (RTO < 1m), meeting strict RTO/RPO criteria.',
        engineerReasoning: 'Understanding disaster recovery tiers (Backup/Restore -> Pilot Light -> Warm Standby -> Multi-Region Active/Active) is fundamental when balancing cost vs availability requirements.',
        businessImpact: 'Failing to meet agreed-upon business RTO/RPO during a regional outage leads to millions in revenue loss and contract penalties.',
        awsBestPractice: 'Test disaster recovery failover procedures quarterly using automated game day simulations.'
      },
      {
        id: 'arch-q9',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Security by Design',
        topicId: 'security-design-principles',
        topicTitle: 'Security Design',
        question: 'What does the security design principle "Keep people away from data" mean in cloud engineering practice?',
        options: [
          'Firing all database administrators.',
          'Eliminating direct manual access to production databases and servers; requiring all interactions to occur through audited APIs, automated CI/CD pipelines, and reporting tools.',
          'Deleting customer data after 30 seconds.',
          'Blocking all access to the internet.'
        ],
        correctIndex: 1,
        explanation: 'Human errors and intentional insider access account for a massive percentage of breaches. Automating processes removes direct manual data handling and enforces accountability.',
        engineerReasoning: 'Engineers should not run manual `psql` queries against live production customer databases from their laptops.',
        businessImpact: 'Prevents rogue employees or compromised laptops from dumping raw customer records.',
        awsBestPractice: 'Use AWS Secrets Manager, IAM Database Authentication, and automated ETL pipelines with zero direct human database access.'
      },
      {
        id: 'arch-q10',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Service Control Policies',
        topicId: 'secure-aws-architectures',
        topicTitle: 'Landing Zones',
        question: 'In an AWS Organization, an SCP is attached to the Root OU with an explicit Deny on `kms:ScheduleKeyDeletion`. An administrator in a member account tries to delete a KMS CMK. What happens and why?',
        options: [
          'The key is deleted because the member account administrator has full IAM privileges in their account.',
          'The deletion is denied because an SCP attached at the Organization level sets an immutable boundary that member account administrators cannot override.',
          'The key is deleted, but an alert is sent to AWS Support.',
          'The KMS service crashes.'
        ],
        correctIndex: 1,
        explanation: 'SCPs provide guardrail enforcement that cannot be bypassed by any user or role in member accounts, including the member account root user.',
        engineerReasoning: 'SCPs protect critical infrastructure controls (e.g. disabling logging, deleting encryption keys, leaving AWS Organizations) from rogue insiders or ransomware.',
        businessImpact: 'Prevents ransomware actors with local administrative credentials from destroying the keys required to decrypt production databases.',
        awsBestPractice: 'Use SCPs to protect security baselines (GuardDuty, CloudTrail, KMS key deletion, and regional boundaries).'
      },
      {
        id: 'arch-q11',
        type: 'scenario',
        difficulty: 'Advanced',
        category: 'Microsegmentation',
        topicId: 'defense-in-depth',
        topicTitle: 'Defense in Depth',
        question: 'Your microservices architecture runs on Amazon EKS. A vulnerability in an external customer-facing microservice allows Remote Code Execution (RCE). How do you prevent the compromised pod from querying the AWS EC2 metadata service and stealing node IAM credentials?',
        options: [
          'Reboot the Kubernetes cluster every hour.',
          'Enforce IMDSv2 with `HttpEndpoint: enabled` and `HttpPutResponseHopLimit: 1`, combined with IAM Roles for Service Accounts (IRSA) and Kubernetes NetworkPolicies.',
          'Uninstall Docker from the worker nodes.',
          'Make all Kubernetes pods administrative root.'
        ],
        correctIndex: 1,
        explanation: 'Setting the IMDSv2 hop limit to 1 ensures that HTTP packets from inside a container (which is at least 2 network hops away) cannot reach the EC2 metadata endpoint. IRSA gives pods their own temporary STS credentials.',
        engineerReasoning: 'Securing the node metadata service is the single most important control in Kubernetes cloud security to prevent container-to-cloud privilege escalation.',
        businessImpact: 'Stolen node credentials frequently grant the attacker permission to read other pods’ secrets or escalate to full AWS account compromise.',
        awsBestPractice: 'Always configure `HttpPutResponseHopLimit: 1` on container host worker nodes and use IRSA or EKS Pod Identities.'
      },
      {
        id: 'arch-q12',
        type: 'engineerDecision',
        difficulty: 'Intermediate',
        category: 'Centralized Ingress Architecture',
        topicId: 'secure-aws-architectures',
        topicTitle: 'Landing Zones',
        question: 'In an enterprise multi-account environment with 40 VPCs, what is the best architectural practice for inspecting inbound public internet traffic with Next-Gen Firewalls / AWS Network Firewall?',
        options: [
          'Deploy an independent public load balancer and firewall cluster in all 40 VPCs.',
          'Centralize all public internet ingress in a dedicated "Inspection / Edge VPC" using AWS Transit Gateway to route traffic to spoke VPCs after inspection.',
          'Require users to connect through TeamViewer.',
          'Disable firewalls to improve network latency.'
        ],
        correctIndex: 1,
        explanation: 'A centralized Ingress / Inspection VPC minimizes the public attack perimeter, consolidates expensive firewall appliances, and ensures consistent security policy enforcement across all enterprise workloads.',
        engineerReasoning: 'Centralizing edge routing simplifies rule management, reduces NAT Gateway costs, and provides a single choke-point for traffic analysis.',
        businessImpact: 'Managing 40 independent internet gateways creates massive configuration drift and guarantees unmonitored backdoors will emerge.',
        awsBestPractice: 'Use a Centralized Ingress and Egress VPC architecture connected via AWS Transit Gateway with appliance mode enabled.'
      }
    ]
  },

  'incident-response': {
    pathId: 'incident-response',
    title: 'Incident Response Module Assessment',
    description: 'Evaluate your ability to execute cloud triage, volatile evidence preservation, active containment protocols, credential eradication, and post-mortem analysis under NIST SP 800-61.',
    passingScore: 70,
    badgeAwardId: 'incident-commander',
    badgeMinScore: 85,
    recommendedInvestigationId: 'inv-ir-01',
    recommendedInvestigationTitle: 'Incident Simulator: Live SOC On-Call Incident Paging',
    recommendedInvestigationPath: '/internship-simulator',
    nextModulePathId: 'iam',
    nextModuleTitle: 'IAM Security (Review)',
    questions: [
      {
        id: 'ir-q1',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Incident Lifecycle',
        topicId: 'detection-and-triage',
        topicTitle: 'Detection & Triage',
        question: 'According to NIST SP 800-61 and AWS incident response frameworks, what is the correct chronological sequence of phases in an incident response lifecycle?',
        options: [
          'Remediation -> Eradication -> Containment -> Detection -> Post-Mortem',
          'Preparation -> Detection & Analysis -> Containment, Eradication & Recovery -> Post-Incident Activity',
          'Post-Mortem -> Backup -> Containment -> Triage',
          'Termination -> Legal Review -> PR Statement -> Investigation'
        ],
        correctIndex: 1,
        explanation: 'NIST SP 800-61 defines four core phases: 1. Preparation; 2. Detection & Analysis; 3. Containment, Eradication & Recovery; 4. Post-Incident Activity (Lessons Learned).',
        engineerReasoning: 'Following an established lifecycle prevents panic, ensures evidence is preserved before systems are altered, and drives structured recovery.',
        businessImpact: 'Jumping straight to wiping a compromised server before preservation destroys evidence required for legal disclosure, law enforcement, and finding root cause.',
        awsBestPractice: 'Build, maintain, and rehearse automated incident response playbooks for top cloud threats before incidents happen.'
      },
      {
        id: 'ir-q2',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Forensic Preservation',
        topicId: 'investigation-and-forensics',
        topicTitle: 'Investigation & Forensics',
        question: 'Why should a security engineer NEVER terminate or reboot an EC2 instance immediately upon discovering an active adversary on the system?',
        options: [
          'Because AWS charges a termination fee.',
          'Because rebooting or terminating wipes volatile memory (RAM), destroying active network sockets, injected in-memory malware, and encryption keys needed for forensic attribution.',
          'Because terminating an instance automatically deletes all CloudTrail logs.',
          'Because instances cannot be replaced once terminated.'
        ],
        correctIndex: 1,
        explanation: 'Volatile artifacts (RAM, running processes, open network sockets, uncommitted bash history) only exist in memory. Terminating the instance destroys this evidence forever.',
        engineerReasoning: 'Preserve evidence first: isolate the instance via security group, take an EBS volume snapshot, and acquire volatile memory before touching system state.',
        businessImpact: 'Without memory evidence, you cannot prove whether customer data was exfiltrated or identify the initial root cause vector.',
        awsBestPractice: 'Use EC2 memory acquisition tools (e.g. LiME) and create immediate EBS snapshots for offline forensic analysis in an isolated account.'
      },
      {
        id: 'ir-q3',
        type: 'scenario',
        difficulty: 'Intermediate',
        category: 'Active Containment',
        topicId: 'containment',
        topicTitle: 'Containment',
        question: 'An EC2 instance is actively exfiltrating customer records to an attacker IP. You need to immediately contain the network threat WITHOUT destroying system state or cutting off SSM Session Manager access. What is the recommended action?',
        options: [
          'Delete the VPC and terminate all instances.',
          'Replace the instance’s Security Group with an "Isolation Security Group" that contains NO inbound and NO outbound rules, while leaving the instance running.',
          'Turn off the power switch on the data center rack.',
          'Change the root password of the AWS account.'
        ],
        correctIndex: 1,
        explanation: 'Applying a Quarantine Security Group with 0 inbound and 0 outbound rules instantly severs all TCP/UDP connections to the attacker while keeping the virtual machine running for forensic acquisition.',
        engineerReasoning: 'Security group modifications take effect immediately on active connections, stopping data exfiltration within milliseconds.',
        businessImpact: 'Instant containment stops live data theft and limits regulatory exposure under breach notification laws.',
        awsBestPractice: 'Maintain pre-created Quarantine Security Groups in every VPC ready to be attached via automated containment scripts.'
      },
      {
        id: 'ir-q4',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'Credential Revocation',
        topicId: 'remediation',
        topicTitle: 'Remediation',
        question: 'An attacker stole the temporary credentials of an IAM Role `DataProcessorRole` that has an allowable session duration of 12 hours. Which action guarantees that the attacker’s active tokens are rendered completely useless immediately?',
        options: [
          'Wait 12 hours for the credentials to expire naturally.',
          'Attach an inline policy to `DataProcessorRole` with `Effect: Deny, Action: "*", Resource: "*", Condition: { DateLessThan: { "aws:TokenIssueTime": "<CURRENT_TIMESTAMP>" } }`.',
          'Change the IAM Role description in the AWS console.',
          'Restart the application on EC2.'
        ],
        correctIndex: 1,
        explanation: 'The `aws:TokenIssueTime` condition explicitly denies any request signed with credentials issued prior to the containment timestamp, instantly killing active stolen sessions.',
        engineerReasoning: 'STS tokens cannot be revoked by deleting the user password or rotating local keys; explicit policy denial on TokenIssueTime is the only instantaneous revocation method.',
        businessImpact: 'Leaving stolen credentials active for up to 12 hours gives attackers ample time to install backdoors and complete data theft.',
        awsBestPractice: 'Use the IAM console "Revoke active sessions" feature or deploy the automated `aws:TokenIssueTime` denial script.'
      },
      {
        id: 'ir-q5',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Forensic Isolation',
        topicId: 'investigation-and-forensics',
        topicTitle: 'Investigation & Forensics',
        question: 'Why should forensic analysis of compromised EBS disk snapshots be performed in an isolated Security Forensics AWS Account rather than in the production account?',
        options: [
          'Because forensics in production is forbidden by AWS terms of service.',
          'To prevent malware from spreading to other production systems, eliminate the risk of accidental production disruption, and maintain an immutable chain of custody.',
          'Because EBS snapshots cannot be mounted in the same account.',
          'To avoid paying for AWS CloudTrail.'
        ],
        correctIndex: 1,
        explanation: 'Mounting a compromised disk in an isolated forensics account ensures that any dormant malware, autoruns, or logic bombs cannot affect production systems or communicate with internal assets.',
        engineerReasoning: 'A dedicated forensics account ensures strict separation of duties, restricted access for certified investigators, and clean legal evidence custody.',
        businessImpact: 'Accidentally executing malware on a live production workstation can cause a secondary, catastrophic outage.',
        awsBestPractice: 'Share encrypted EBS snapshots with a dedicated Forensics account and mount volumes as read-only on isolated analysis workstations.'
      },
      {
        id: 'ir-q6',
        type: 'securityThinking',
        difficulty: 'Intermediate',
        category: 'Eradication & Backdoors',
        topicId: 'remediation',
        topicTitle: 'Remediation',
        question: 'During eradication, your team removed the malware from the compromised EC2 server. Why is this insufficient to declare the threat eliminated?',
        options: [
          'Because antivirus scans must run 10 times consecutively.',
          'Because the attacker may have created persistent cloud backdoors (e.g. new IAM users, modified role trust policies, rogue access keys, Lambda event hooks, or unauthorized AMIs) that survive server cleanup.',
          'Because EC2 instances must be decommissioned after 30 days regardless.',
          'Because AWS retains backups of all deleted malware.'
        ],
        correctIndex: 1,
        explanation: 'Cloud attacks rarely stay confined to a single host. Attackers establish cloud control-plane persistence by generating new IAM access keys, creating rogue administrative users, or backdooring trust relationships.',
        engineerReasoning: 'True eradication requires a full control-plane audit: check all IAM changes, newly created roles, modified SCPs, and unauthorized security groups.',
        businessImpact: 'Failing to eliminate cloud-level backdoors allows the attacker to walk back into the environment weeks later.',
        awsBestPractice: 'Deploy AWS IAM Access Analyzer and run automated credential reports to verify no unauthorized principals or access keys were created during the incident.'
      },
      {
        id: 'ir-q7',
        type: 'scenario',
        difficulty: 'Advanced',
        category: 'Recovery & Validation',
        topicId: 'recovery',
        topicTitle: 'Recovery',
        question: 'You are preparing to restore a customer database from an S3 backup following an extensive ransomware incident. What step MUST precede bringing the restored database back into production traffic?',
        options: [
          'Make the database public so customers can verify their records.',
          'Validate backup integrity, confirm the restore point predates the initial attacker compromise, scan for backdoors, and verify that the vulnerability used for initial access has been patched.',
          'Immediately connect all web servers to full production traffic.',
          'Turn off monitoring to speed up database indexing.'
        ],
        correctIndex: 1,
        explanation: 'Restoring a database containing the same vulnerability that caused the breach or restoring from a backup that already contains the attacker’s backdoor will result in immediate reinfection.',
        engineerReasoning: 'Verify the timeline: identify the exact timestamp of initial access and select a restore point prior to that event.',
        businessImpact: 'Restoring an unpatched system causes immediate reinfection, extending downtime and multiplying recovery expenses.',
        awsBestPractice: 'Test restored instances in an isolated staging environment before routing production DNS traffic.'
      },
      {
        id: 'ir-q8',
        type: 'engineerDecision',
        difficulty: 'Intermediate',
        category: 'Post-Mortem Engineering',
        topicId: 'lessons-learned',
        topicTitle: 'Lessons Learned',
        question: 'What is the purpose of conducting a "Blameless Post-Mortem" following a resolved security incident?',
        options: [
          'To identify which individual engineer should be disciplined or terminated.',
          'To focus on systemic root causes, gaps in automated guardrails, and detection latency, fostering a culture where engineers report vulnerabilities transparently without fear.',
          'To draft an NDA preventing anyone from speaking about the breach.',
          'To delete incident documentation before auditors review it.'
        ],
        correctIndex: 1,
        explanation: 'Blameless culture recognizes that human error is inevitable; systemic failures allow errors to turn into incidents. Focus on improving guardrails, monitoring, and runbooks.',
        engineerReasoning: 'If engineers fear punishment, they will hide mistakes, delay reporting incidents, and attempt secret cleanups that worsen breaches.',
        businessImpact: 'A blameless post-mortem leads to permanent architectural hardening, preventing identical failures from ever occurring again.',
        awsBestPractice: 'Publish post-mortem action items with designated owners and measurable SLA delivery dates tracked in sprint backlogs.'
      },
      {
        id: 'ir-q9',
        type: 'concept',
        difficulty: 'Beginner',
        category: 'Severity Triage',
        topicId: 'detection-and-triage',
        topicTitle: 'Detection & Triage',
        question: 'Which of the following scenarios should be classified as a Priority 1 (P1 / Critical) Cloud Security Incident?',
        options: [
          'A developer forgot their IAM password and requested a password reset.',
          'Active data exfiltration from a core customer database accompanied by compromised Root or Administrator credentials.',
          'A test S3 bucket in a sandbox account was tagged with an incorrect cost center.',
          'A minor CloudWatch alarm triggered on 60% CPU usage.'
        ],
        correctIndex: 1,
        explanation: 'A P1 Critical incident involves active, confirmed compromise of high-value business assets, core identity compromise, or active exfiltration threatening business continuity.',
        engineerReasoning: 'Proper severity classification directs organizational resources immediately to real emergencies while avoiding on-call burnout on low-risk issues.',
        businessImpact: 'Misclassifying a P1 breach as P3 leads to sluggish response times and catastrophic unchecked data loss.',
        awsBestPractice: 'Define unambiguous, documented severity definitions (P1 to P4) with automated escalation paths linked to 24/7 on-call rosters.'
      },
      {
        id: 'ir-q10',
        type: 'securityThinking',
        difficulty: 'Advanced',
        category: 'Canary Recovery',
        topicId: 'recovery',
        topicTitle: 'Recovery',
        question: 'When bringing production workloads back online after an incident, why is a "Canary Deployment" or phased traffic shift superior to an immediate 100% cutover?',
        options: [
          'Because AWS only allows 10% traffic increases per day.',
          'It allows the security and engineering teams to monitor a small subset of traffic (e.g. 5%) for abnormal database queries, error rates, or attacker reactivation before full exposure.',
          'Because canary deployments do not require SSL certificates.',
          'Because canary deployments bypass all firewall rules.'
        ],
        correctIndex: 1,
        explanation: 'Phased recovery exposes the newly hardened system to a limited blast radius. If hidden vulnerabilities or lateral movement attempts persist, they can be detected and stopped before affecting the entire customer base.',
        engineerReasoning: 'Phased recovery balances business pressure to restore availability with the security imperative to ensure the environment is safe.',
        businessImpact: 'A full cutover that fails re-triggers a company-wide P1 incident and damages customer trust twice in a single week.',
        awsBestPractice: 'Use AWS Route 53 weighted routing or AWS CodeDeploy canary traffic shifting during post-incident recovery.'
      },
      {
        id: 'ir-q11',
        type: 'scenario',
        difficulty: 'Intermediate',
        category: 'Forensic Snapshotting',
        topicId: 'investigation-and-forensics',
        topicTitle: 'Investigation & Forensics',
        question: 'You take an Amazon EBS snapshot of a compromised web server’s root volume for forensic investigation. How do you guarantee the forensic integrity of the snapshot so the evidence cannot be altered?',
        options: [
          'Save the snapshot as a `.zip` file on your laptop.',
          'EBS snapshots are inherently immutable (point-in-time read-only blocks stored in S3); copy the snapshot to an isolated Forensics account and apply S3 Object Lock or KMS encryption to prevent deletion.',
          'Reboot the instance to finalize the snapshot.',
          'Print out the block hash on paper.'
        ],
        correctIndex: 1,
        explanation: 'EBS snapshots are read-only point-in-time block captures. When copied to a dedicated security account with restrictive IAM policies and KMS keys, they cannot be modified by production users.',
        engineerReasoning: 'Chain of custody requires showing that evidence could not have been tampered with between acquisition and courtroom presentation.',
        businessImpact: 'Altered or unverified evidence cannot be used to prosecute threat actors or defend against regulatory enforcement actions.',
        awsBestPractice: 'Document forensic snapshot IDs, generate SHA-256 hashes of disk volumes, and record the chain of custody in the incident ticket.'
      },
      {
        id: 'ir-q12',
        type: 'engineerDecision',
        difficulty: 'Advanced',
        category: 'Communication Protocols',
        topicId: 'lessons-learned',
        topicTitle: 'Lessons Learned',
        question: 'During a suspected breach of your company’s internal network, the incident commander orders the response team to switch communications to an out-of-band (OOB) channel (e.g. external Signal or dedicated secondary Slack). Why?',
        options: [
          'Because secondary chat apps have cooler emojis.',
          'Because if the attacker has compromised corporate Active Directory, email, or internal Slack, they can monitor incident response channels, anticipate containment actions, and wipe evidence before the team strikes.',
          'To prevent the cloud security team from receiving spam.',
          'Because AWS policies mandate using Signal for all meetings.'
        ],
        correctIndex: 1,
        explanation: 'Sophisticated adversaries actively monitor internal company communications (Slack, Teams, Outlook) to track the IR team’s progress and stay one step ahead of containment maneuvers.',
        engineerReasoning: 'Out-of-band communication ensures complete confidentiality and prevents the adversary from knowing when and how containment will occur.',
        businessImpact: 'Tipping off an adversary causes them to accelerate ransomware encryption or deploy destructive disk wipers before containment executes.',
        awsBestPractice: 'Establish pre-tested, out-of-band emergency communication channels and document escalation phone trees during the preparation phase.'
      }
    ]
  }
}

// Helper to retrieve quiz by pathId
export function getModuleQuiz(pathId) {
  return moduleQuizzes[pathId] || null
}

// Calculate score, strong areas, weak areas, and recommended topics
export function evaluateQuizSubmission(quiz, selectedAnswers = {}) {
  let score = 0
  const total = quiz.questions.length
  const categoryStats = {}
  const missedTopicsMap = {}

  quiz.questions.forEach((q, idx) => {
    const isCorrect = selectedAnswers[q.id] === q.correctIndex
    if (isCorrect) {
      score += 1
    } else {
      missedTopicsMap[q.topicId] = {
        id: q.topicId,
        title: q.topicTitle,
        pathId: quiz.pathId
      }
    }

    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { correct: 0, total: 0 }
    }
    categoryStats[q.category].total += 1
    if (isCorrect) {
      categoryStats[q.category].correct += 1
    }
  })

  const percentage = Math.round((score / Math.max(1, total)) * 100)
  const passed = percentage >= quiz.passingScore
  const earnedBadge = percentage >= (quiz.badgeMinScore || 85) ? quiz.badgeAwardId : null

  // Categorize strong & weak areas
  const strongAreas = []
  const weakAreas = []

  Object.entries(categoryStats).forEach(([cat, stats]) => {
    const pct = Math.round((stats.correct / stats.total) * 100)
    if (pct >= 75) {
      strongAreas.push(cat)
    } else {
      weakAreas.push(cat)
    }
  })

  const recommendedTopics = Object.values(missedTopicsMap)

  return {
    score,
    total,
    percentage,
    passed,
    earnedBadge,
    strongAreas,
    weakAreas,
    recommendedTopics,
    submittedAt: new Date().toISOString()
  }
}
