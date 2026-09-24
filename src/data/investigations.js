import { investigationDetails } from './investigationDetails.js'

export const investigationCategories = [
  { key: 'all', label: 'All Investigations' },
  { key: 'iam', label: 'IAM Security', color: 'cyan' },
  { key: 's3', label: 'S3 Security', color: 'orange' },
  { key: 'network', label: 'Networking Security', color: 'purple' },
  { key: 'monitoring', label: 'Monitoring & Logging', color: 'green' },
  { key: 'architecture', label: 'Architecture Security', color: 'blue' },
]

const rawInvestigations = [
  // ==========================================
  // 1. IAM SECURITY (5 Investigations)
  // ==========================================
  {
    id: 'inv-iam-01',
    ticket: 'INC-IAM-01',
    category: 'IAM Security',
    categoryKey: 'iam',
    title: 'Shadow Admin: Unrestricted PassRole in Deployment Pipeline',
    incidentSummary: 'An automated alert flagged a developer deployment role being used to create Lambda functions attached to AdministratorAccess.',
    businessContext: 'Fintech core payment processing environment during a sprint deployment window. Customer payment authorization service could be modified.',
    riskLevel: 'Critical',
    affectedServices: ['AWS IAM', 'AWS Lambda', 'AWS STS', 'AWS CloudTrail'],
    evidence: [
      {
        name: 'deployer-policy.json',
        type: 'IAM Policy',
        content: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'AllowComputeCreation',
              Effect: 'Allow',
              Action: ['lambda:CreateFunction', 'lambda:UpdateFunctionCode', 'iam:PassRole'],
              Resource: '*'
            }
          ]
        }, null, 2),
        notes: 'Deployment role allows passing ANY IAM role in the account to newly created Lambda functions without resource constraints.'
      },
      {
        name: 'cloudtrail-event.json',
        type: 'CloudTrail Event',
        content: JSON.stringify({
          eventTime: '2026-09-24T14:22:10Z',
          eventSource: 'lambda.amazonaws.com',
          eventName: 'CreateFunction',
          userIdentity: {
            type: 'AssumedRole',
            arn: 'arn:aws:sts::123456789012:assumed-role/dev-deployer/jordan'
          },
          requestParameters: {
            functionName: 'payment-sync-worker',
            role: 'arn:aws:iam::123456789012:role/AccountAdministrator'
          }
        }, null, 2),
        notes: 'Developer passed the production admin role to an untracked scratch function.'
      }
    ],
    investigationTasks: [
      'Analyze deployer-policy.json for dangerous privilege escalation permissions',
      'Correlate CloudTrail CreateFunction event with target execution role',
      'Assess blast radius across production payment infrastructure',
      'Determine immediate containment order of operations'
    ],
    findings: [
      { id: 'f1', label: 'Wildcard Resource on iam:PassRole allows passing account admin role', isCorrect: true },
      { id: 'f2', label: 'Lack of permissions boundary allows privilege escalation beyond intended tier', isCorrect: true },
      { id: 'f3', label: 'Execution role assigned to Lambda has full AdministratorAccess', isCorrect: true },
      { id: 'f4', label: 'S3 bucket hosting function deployment zip is missing versioning', isCorrect: false }
    ],
    rootCauseAnalysis: 'The deployment pipeline role was granted iam:PassRole with Resource: "*" instead of scoping it to specific worker execution roles with a strict permissions boundary.',
    securityImpact: 'Any user or automated system that can assume the developer deployment role can grant themselves full administrator control over the entire AWS account via Lambda execution.',
    businessImpact: 'Total account compromise risk, potential tampering with payment transaction processing, failure of SOC 2 and PCI-DSS compliance requirements.',
    remediationPlan: [
      'Immediate: Delete the unauthorized Lambda function payment-sync-worker and revoke active STS sessions.',
      'Containment: Restrict deployer-policy.json to allow iam:PassRole only to approved ARNs matching arn:aws:iam::123456789012:role/service-roles/lambda-*',
      'Guardrail: Attach an IAM Permissions Boundary that prevents any role created or passed from having administrator permissions.',
      'Verification: Run AWS IAM Access Analyzer to confirm no cross-boundary delegation paths remain.'
    ],
    awsBestPractices: [
      'Always constrain iam:PassRole to specific target role ARNs using the Resource element.',
      'Use aws:CalledVia or Condition keys to prevent indirect role passing.',
      'Enforce permissions boundaries on all self-service deployment identities.'
    ],
    lessonsLearned: 'iam:PassRole is often overlooked because it sounds administrative but benign; in reality, unrestricted PassRole is equivalent to AdministratorAccess if paired with compute creation services.'
  },
  {
    id: 'inv-iam-02',
    ticket: 'INC-IAM-02',
    category: 'IAM Security',
    categoryKey: 'iam',
    title: 'Stale Root Account Access Keys & Unmonitored Console Logins',
    incidentSummary: 'A security audit detected an active root access key generated 480 days ago that was used from an unfamiliar IP address without MFA.',
    businessContext: 'Enterprise SaaS provider managing customer multi-tenant databases. Root credentials bypass all identity boundaries and organization SCPs.',
    riskLevel: 'Critical',
    affectedServices: ['AWS IAM', 'AWS Organizations', 'AWS CloudTrail'],
    evidence: [
      {
        name: 'credential-report.json',
        type: 'IAM Credential Report',
        content: JSON.stringify({
          user: '<root_account>',
          arn: 'arn:aws:iam::123456789012:root',
          access_key_1_active: true,
          access_key_1_last_rotated: '2025-05-30T10:15:00Z',
          access_key_1_last_used_date: '2026-09-24T08:12:00Z',
          access_key_1_last_used_service: 'iam',
          mfa_active: false
        }, null, 2),
        notes: 'Root access key active for over 15 months and recently used without hardware or virtual MFA.'
      },
      {
        name: 'cloudtrail-root-login.json',
        type: 'CloudTrail Event',
        content: JSON.stringify({
          eventName: 'ConsoleLogin',
          userIdentity: { type: 'Root', principalId: '123456789012', arn: 'arn:aws:iam::123456789012:root' },
          sourceIPAddress: '198.51.100.44',
          additionalEventData: { MFAUsed: 'No' },
          responseElements: { ConsoleLogin: 'Success' }
        }, null, 2),
        notes: 'Successful root console login from an external IP without multi-factor authentication.'
      }
    ],
    investigationTasks: [
      'Examine credential report for root account access keys and rotation dates',
      'Trace CloudTrail history for commands executed by root identity',
      'Initiate account emergency containment protocol',
      'Establish permanent root lockdown and monitoring alarms'
    ],
    findings: [
      { id: 'f1', label: 'Active long-lived root access key exists in production management account', isCorrect: true },
      { id: 'f2', label: 'Root account lacks mandatory Multi-Factor Authentication (MFA)', isCorrect: true },
      { id: 'f3', label: 'No CloudWatch alarm or EventBridge rule routed alerts for root activity', isCorrect: true },
      { id: 'f4', label: 'Database security group is missing egress rule for port 443', isCorrect: false }
    ],
    rootCauseAnalysis: 'Root account credentials were used for initial account setup and never locked down; long-lived keys were generated for legacy scripts and never rotated or removed.',
    securityImpact: 'Root access provides unrestricted destructive control over billing, member accounts, data deletion, and security logs, completely immune to SCP restrictions.',
    businessImpact: 'Catastrophic loss of organizational trust, ransomware extortion risk, regulatory violation under ISO 27001, SOC 2, and HIPAA.',
    remediationPlan: [
      'Immediate: Deactivate and delete all root access keys via AWS IAM console.',
      'Immediate: Reset root password and enforce FIDO2 WebAuthn / hardware security key MFA.',
      'Audit: Review all CloudTrail events performed by the root principal in the last 90 days.',
      'Guardrail: Deploy CloudWatch alarm with SNS notifications for any root account console login or API call.'
    ],
    awsBestPractices: [
      'Never create or maintain access keys for the AWS account root user.',
      'Use AWS IAM Identity Center (SSO) with short-lived sessions for administrative access.',
      'Set an EventBridge rule that immediately pages on-call security when root API activity is detected.'
    ],
    lessonsLearned: 'Root account access keys are the single greatest single-point-of-failure in AWS; zero root keys is a non-negotiable industry baseline.'
  },
  {
    id: 'inv-iam-03',
    ticket: 'INC-IAM-03',
    category: 'IAM Security',
    categoryKey: 'iam',
    title: 'Cross-Account Role Hijack via Missing sts:ExternalId Condition',
    incidentSummary: 'A third-party analytics vendor role trust policy was configured trusting an entire external account without verifying external ID conditions.',
    businessContext: 'Analytics integration processing user telemetry. Confused deputy attacks allow malicious third parties to assume the role on behalf of another client.',
    riskLevel: 'High',
    affectedServices: ['AWS IAM', 'AWS STS', 'Amazon S3'],
    evidence: [
      {
        name: 'trust-policy.json',
        type: 'IAM Trust Policy',
        content: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                AWS: 'arn:aws:iam::999988887777:root'
              },
              Action: 'sts:AssumeRole'
            }
          ]
        }, null, 2),
        notes: 'Trusts entire vendor account root without requiring sts:ExternalId condition.'
      },
      {
        name: 'role-permissions.json',
        type: 'IAM Permissions',
        content: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: ['s3:GetObject', 's3:ListBucket'],
              Resource: ['arn:aws:s3:::customer-telemetry-prod', 'arn:aws:s3:::customer-telemetry-prod/*']
            }
          ]
        }, null, 2),
        notes: 'Role can read all production telemetry exports.'
      }
    ],
    investigationTasks: [
      'Review trust relationship condition keys for sts:ExternalId presence',
      'Assess potential for Confused Deputy exploitation by other vendor customers',
      'Inspect CloudTrail AssumeRole events for unexpected session tags',
      'Refactor trust policy with unique customer external ID and least privilege'
    ],
    findings: [
      { id: 'f1', label: 'Missing sts:ExternalId condition exposes account to Confused Deputy exploit', isCorrect: true },
      { id: 'f2', label: 'Trusting external account root delegates trust to unreviewed external roles', isCorrect: true },
      { id: 'f3', label: 'Role has read access to production telemetry bucket without prefix scoping', isCorrect: true },
      { id: 'f4', label: 'KMS customer managed key policy is missing key deletion grace period', isCorrect: false }
    ],
    rootCauseAnalysis: 'The third-party integration guide was followed improperly, omitting the cryptographically random External ID condition required for SaaS multi-tenant role assumption.',
    securityImpact: 'Another customer of the same vendor could trick the vendor platform into assuming this role, obtaining unauthorized read access to proprietary telemetry data.',
    businessImpact: 'Breach of client confidentiality agreements, data leak of analytics telemetry, and potential loss of enterprise contracts.',
    remediationPlan: [
      'Immediate: Update trust policy to require StringEquals on sts:ExternalId with a high-entropy secret.',
      'Tighten: Narrow the trusted principal from the vendor account root to the exact vendor worker role ARN.',
      'Scope: Restrict S3 bucket permissions to only the specific prefix needed by the analytics engine.'
    ],
    awsBestPractices: [
      'Always require sts:ExternalId when granting cross-account role assumption to third parties.',
      'Pair External ID conditions with sts:SourceArn and short session durations.',
      'Regularly audit external trust policies using AWS IAM Access Analyzer.'
    ],
    lessonsLearned: 'Cross-account trust policies without ExternalId turn your role into an open door for any other tenant sharing the same SaaS vendor.'
  },
  {
    id: 'inv-iam-04',
    ticket: 'INC-IAM-04',
    category: 'IAM Security',
    categoryKey: 'iam',
    title: 'Privilege Escalation via iam:CreatePolicyVersion',
    incidentSummary: 'A junior QA role with limited developer permissions was used to create a new default policy version that attached full AdministratorAccess.',
    businessContext: 'Continuous integration staging environment. Lateral movement could allow compromised staging credentials to access production cross-account roles.',
    riskLevel: 'Critical',
    affectedServices: ['AWS IAM', 'AWS CloudTrail'],
    evidence: [
      {
        name: 'qa-role-policy.json',
        type: 'IAM Policy',
        content: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'iam:CreatePolicyVersion',
                'iam:SetDefaultPolicyVersion',
                'iam:GetPolicy',
                'iam:GetPolicyVersion'
              ],
              Resource: 'arn:aws:iam::123456789012:policy/qa-managed-policy'
            }
          ]
        }, null, 2),
        notes: 'QA role can create and activate new versions of its own managed policy.'
      },
      {
        name: 'cloudtrail-policy-edit.json',
        type: 'CloudTrail Event',
        content: JSON.stringify({
          eventName: 'CreatePolicyVersion',
          requestParameters: {
            policyArn: 'arn:aws:iam::123456789012:policy/qa-managed-policy',
            setAsDefault: true,
            policyDocument: '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"*","Resource":"*"}]}'
          }
        }, null, 2),
        notes: 'The QA identity updated its own attached policy document to Action: * on Resource: *.'
      }
    ],
    investigationTasks: [
      'Identify IAM actions that allow self-modification of policy documents',
      'Trace CloudTrail history for CreatePolicyVersion and SetDefaultPolicyVersion',
      'Revert unauthorized policy versions and lock down policy authoring permissions',
      'Establish IAM permission boundaries across non-admin roles'
    ],
    findings: [
      { id: 'f1', label: 'iam:CreatePolicyVersion with setAsDefault allows direct self-privilege escalation', isCorrect: true },
      { id: 'f2', label: 'QA role lacked permissions boundary restricting max privilege ceiling', isCorrect: true },
      { id: 'f3', label: 'Policy versioning history retains up to 5 versions without audit review', isCorrect: true },
      { id: 'f4', label: 'CloudWatch log group retention was set to 30 days instead of 365 days', isCorrect: false }
    ],
    rootCauseAnalysis: 'Granting iam:CreatePolicyVersion to an identity on policies attached to itself is functionally equivalent to granting full administrative privilege.',
    securityImpact: 'A low-privilege QA test worker identity became a full AWS account administrator in a single API call.',
    businessImpact: 'Unauthorized infrastructure changes, deployment of cryptominers or rogue backdoors, and loss of environment isolation integrity.',
    remediationPlan: [
      'Immediate: Delete the unauthorized policy version and revert default version to v1.',
      'Refactor: Remove iam:CreatePolicyVersion and iam:SetDefaultPolicyVersion from non-administrator roles.',
      'Guardrail: Require all IAM policy updates to go through approved Infrastructure as Code (Terraform/CloudFormation) pipelines with automated linting.'
    ],
    awsBestPractices: [
      'Treat any IAM mutation permission (CreatePolicyVersion, AttachUserPolicy, PutUserPolicy) as Tier-0 Administrator privilege.',
      'Use Service Control Policies (SCPs) in AWS Organizations to prevent non-admins from modifying IAM policies.',
      'Audit effective permissions using IAM Access Analyzer.'
    ],
    lessonsLearned: 'You do not need Action: "*" to be an administrator; permission to edit your own policy is already full administrative access.'
  },
  {
    id: 'inv-iam-05',
    ticket: 'INC-IAM-05',
    category: 'IAM Security',
    categoryKey: 'iam',
    title: 'Compromised CI/CD Runner with Standing IAM Access Keys',
    incidentSummary: 'Long-lived AWS access keys hardcoded into a GitHub Actions runner were leaked in a public build log artifact and used from an unfamiliar ASN.',
    businessContext: 'E-commerce mobile checkout backend. Leaked credentials had read/write access to customer orders and billing endpoints.',
    riskLevel: 'Critical',
    affectedServices: ['AWS IAM', 'AWS CloudTrail', 'Amazon GuardDuty'],
    evidence: [
      {
        name: 'github-actions.log',
        type: 'CI/CD Build Log',
        content: `Step 4/8 - Deploy to AWS
AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Error: failed to sanitize print_env output. Build logs published publicly.`,
        notes: 'Long-lived static access keys dumped into public GitHub Actions runner job output.'
      },
      {
        name: 'guardduty-finding.json',
        type: 'GuardDuty Finding',
        content: JSON.stringify({
          type: 'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
          severity: 8.0,
          resource: { accessKeyId: 'AKIAIOSFODNN7EXAMPLE', userName: 'ci-deployer' },
          service: { action: { awsApiCallAction: { api: 'DescribeInstances', serviceName: 'ec2.amazonaws.com' } } }
        }, null, 2),
        notes: 'GuardDuty detected reconnaissance API calls using the leaked key from a Tor exit node.'
      }
    ],
    investigationTasks: [
      'Deactivate and invalidate compromised static access keys immediately',
      'Query CloudTrail for all API calls made with AKIAIOSFODNN7EXAMPLE in the last 24 hours',
      'Determine data exfiltration or resource modification blast radius',
      'Migrate CI/CD pipeline to short-lived OpenID Connect (OIDC) authentication'
    ],
    findings: [
      { id: 'f1', label: 'Long-lived IAM user access keys used instead of OpenID Connect (OIDC) federation', isCorrect: true },
      { id: 'f2', label: 'Build script leaked unmasked AWS secret keys into publicly accessible logs', isCorrect: true },
      { id: 'f3', label: 'GuardDuty detected external reconnaissance calls originating from an unfamiliar IP', isCorrect: true },
      { id: 'f4', label: 'VPC route table lacks NAT Gateway for private subnets', isCorrect: false }
    ],
    rootCauseAnalysis: 'The team created an IAM User with static API credentials for deployment automation instead of using GitHub Actions OpenID Connect (OIDC) with IAM roles.',
    securityImpact: 'Attacker obtained valid credentials to execute EC2, S3, and IAM read/write operations against the AWS production environment.',
    businessImpact: 'High risk of public disclosure of customer database records, regulatory fines under GDPR, and mandatory breach notification.',
    remediationPlan: [
      'Immediate: Deactivate AKIAIOSFODNN7EXAMPLE in IAM console and delete active sessions.',
      'Triage: Run CloudTrail query on the compromised AccessKeyId to compile an inventory of every accessed resource.',
      'Replace: Delete the IAM User ci-deployer entirely.',
      'Modernize: Configure GitHub Actions OIDC identity provider in IAM with a scoped role trust policy requiring repo and branch claims.'
    ],
    awsBestPractices: [
      'Never create static IAM user access keys for CI/CD pipelines.',
      'Use GitHub OIDC or AWS CodeBuild execution roles for short-lived credentials.',
      'Enable GitHub secret scanning and automated revocation partner integrations with AWS.'
    ],
    lessonsLearned: 'Static credentials in CI/CD are a matter of when, not if, they leak; OIDC provides temporary 15-minute STS tokens that make credential leakage obsolete.'
  },

  // ==========================================
  // 2. S3 SECURITY (5 Investigations)
  // ==========================================
  {
    id: 'inv-s3-01',
    ticket: 'INC-S3-01',
    category: 'S3 Security',
    categoryKey: 's3',
    title: 'Unauthenticated Customer PII Leakage via S3 Block Public Access Disabled',
    incidentSummary: 'A security researcher notified customer support that 15,000 PDF invoices containing customer addresses and tax IDs are indexed by Google.',
    businessContext: 'SaaS billing platform holding international customer invoices. Subject to GDPR and CCPA breach reporting requirements.',
    riskLevel: 'Critical',
    affectedServices: ['Amazon S3', 'AWS CloudTrail', 'AWS IAM Access Analyzer'],
    evidence: [
      {
        name: 's3-bucket-config.json',
        type: 'S3 Configuration',
        content: JSON.stringify({
          BucketName: 'billing-invoices-prod',
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: false,
            IgnorePublicAcls: false,
            BlockPublicPolicy: false,
            RestrictPublicBuckets: false
          }
        }, null, 2),
        notes: 'S3 Block Public Access is completely disabled at both bucket and account levels.'
      },
      {
        name: 'bucket-policy.json',
        type: 'S3 Bucket Policy',
        content: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'PublicInvoiceRead',
              Effect: 'Allow',
              Principal: '*',
              Action: 's3:GetObject',
              Resource: 'arn:aws:s3:::billing-invoices-prod/*'
            }
          ]
        }, null, 2),
        notes: 'Bucket policy allows anonymous unauthenticated reads of all objects in the bucket.'
      }
    ],
    investigationTasks: [
      'Confirm active reachability of public objects via curl or browser without credentials',
      'Analyze CloudTrail data events to calculate the number of unique downloaded documents',
      'Apply emergency S3 Block Public Access to immediately sever public access',
      'Audit remaining organization S3 buckets for public policy drift'
    ],
    findings: [
      { id: 'f1', label: 'S3 Block Public Access controls are completely disabled on the bucket', isCorrect: true },
      { id: 'f2', label: 'Bucket policy has Principal: * allowing anonymous unauthenticated GetObject', isCorrect: true },
      { id: 'f3', label: 'Objects in the bucket contain unencrypted, unmasked Personally Identifiable Information (PII)', isCorrect: true },
      { id: 'f4', label: 'The bucket is missing CloudWatch metric alarms for 4xx errors', isCorrect: false }
    ],
    rootCauseAnalysis: 'Developers disabled Block Public Access during a frontend migration to allow direct browser PDF downloads without implementing pre-signed URLs or CloudFront signed cookies.',
    securityImpact: 'Complete public exposure of confidential customer financial records, tax identifiers, and home addresses to web scrapers and search engine indexing bots.',
    businessImpact: 'Mandatory GDPR data breach notification within 72 hours, class-action lawsuit exposure, and catastrophic loss of enterprise brand reputation.',
    remediationPlan: [
      'Immediate: Enable all 4 S3 Block Public Access settings on billing-invoices-prod immediately.',
      'Immediate: Remove the wildcard statement from the bucket policy.',
      'Architecture: Implement Amazon CloudFront with Origin Access Control (OAC) and short-lived pre-signed URLs (expires in 300s) for invoice downloads.',
      'Guardrail: Enable AWS Organizations Service Control Policy (SCP) preventing non-admin roles from disabling S3 Block Public Access.'
    ],
    awsBestPractices: [
      'Enable S3 Block Public Access at the AWS Organization Account level.',
      'Never use public bucket policies for customer document downloads; use pre-signed URLs.',
      'Use AWS IAM Access Analyzer for S3 to automatically detect public buckets.'
    ],
    lessonsLearned: 'S3 buckets are private by default; making them public for application convenience always results in public data exposure eventually.'
  },
  {
    id: 'inv-s3-02',
    ticket: 'INC-S3-02',
    category: 'S3 Security',
    categoryKey: 's3',
    title: 'Ransomware Deletion Risk: Audit Bucket Lacking Versioning & Object Lock',
    incidentSummary: 'An internal compliance review revealed that the organization primary security audit log bucket has versioning disabled and permits object deletion.',
    businessContext: 'Centralized security log archive storing CloudTrail, VPC Flow Logs, and GuardDuty findings for multi-account financial workloads.',
    riskLevel: 'High',
    affectedServices: ['Amazon S3', 'AWS CloudTrail', 'AWS Organizations'],
    evidence: [
      {
        name: 'audit-bucket-properties.json',
        type: 'S3 Bucket Properties',
        content: JSON.stringify({
          Bucket: 'central-security-logs-prod',
          Versioning: 'Suspended',
          ObjectLockConfiguration: { ObjectLockEnabled: false },
          ServerSideEncryption: { SSEAlgorithm: 'AES256' },
          LifecycleConfiguration: { Rules: [{ Status: 'Enabled', Expiration: { Days: 30 } }] }
        }, null, 2),
        notes: 'Versioning is suspended and Object Lock is disabled. Objects can be permanently deleted with a single s3:DeleteObject call.'
      },
      {
        name: 'bucket-policy-permissions.json',
        type: 'Bucket Policy',
        content: JSON.stringify({
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: 'arn:aws:iam::123456789012:role/AccountAdmin' },
              Action: 's3:*',
              Resource: 'arn:aws:s3:::central-security-logs-prod/*'
            }
          ]
        }, null, 2),
        notes: 'Local account administrator role has unrestricted s3:* permissions including DeleteObject and DeleteBucket.'
      }
    ],
    investigationTasks: [
      'Review bucket versioning status and Object Lock immutability settings',
      'Examine bucket policy for explicit Deny on s3:DeleteObject and s3:DeleteObjectVersion',
      'Verify if cross-account replication is enabled to an isolated archive account',
      'Formulate durable WORM (Write Once, Read Many) compliance configuration'
    ],
    findings: [
      { id: 'f1', label: 'S3 Versioning is suspended, allowing unrecoverable overwrite and deletion', isCorrect: true },
      { id: 'f2', label: 'S3 Object Lock (WORM compliance) is disabled on compliance audit logs', isCorrect: true },
      { id: 'f3', label: 'Account admin role has s3:DeleteObject permission without MFA Delete enforcement', isCorrect: true },
      { id: 'f4', label: 'S3 Transfer Acceleration is disabled', isCorrect: false }
    ],
    rootCauseAnalysis: 'The central logging bucket was created manually without Infrastructure as Code templates enforcing organizational logging standards like S3 Object Lock in Compliance mode.',
    securityImpact: 'An attacker or rogue internal admin who compromises credentials can wipe out all forensic logs, disabling the incident response team ability to reconstruct attacks.',
    businessImpact: 'Failure of SEC Rule 17a-4, FINRA, and PCI-DSS compliance audits, rendering financial licenses subject to regulatory fines and sanctions.',
    remediationPlan: [
      'Immediate: Enable S3 Versioning on central-security-logs-prod immediately.',
      'Policy: Add an explicit Deny statement in bucket policy for s3:DeleteObject and s3:DeleteObjectVersion for all principals except break-glass legal hold.',
      'Architecture: Recreate central audit bucket with S3 Object Lock enabled in Compliance mode with a 365-day retention period.',
      'Isolation: Move logging destination to a dedicated, isolated Log Archive AWS account with no shared administrator access.'
    ],
    awsBestPractices: [
      'Store security audit logs in a dedicated AWS account separate from workload accounts.',
      'Enable S3 Object Lock in Compliance Mode for non-repudiable audit archives.',
      'Enforce S3 MFA Delete for high-consequence storage locations.'
    ],
    lessonsLearned: 'Logs stored in the same blast radius as workloads are not real security logs; an attacker who gets admin access will always delete the evidence first.'
  },
  {
    id: 'inv-s3-03',
    ticket: 'INC-S3-03',
    category: 'S3 Security',
    categoryKey: 's3',
    title: 'Unencrypted Regulated Healthcare Exports Stored in S3',
    incidentSummary: 'An automated compliance scanner found 40,000 patient diagnosis reports uploaded to an S3 bucket without customer-managed KMS key encryption.',
    businessContext: 'HealthTech telehealth provider managing Protected Health Information (PHI). Subject to HIPAA Security Rule encryption and audit mandates.',
    riskLevel: 'High',
    affectedServices: ['Amazon S3', 'AWS KMS', 'AWS CloudTrail'],
    evidence: [
      {
        name: 's3-encryption-status.json',
        type: 'S3 Encryption Config',
        content: JSON.stringify({
          BucketName: 'patient-health-records-prod',
          ServerSideEncryptionConfiguration: {
            Rules: [
              {
                ApplyServerSideEncryptionByDefault: {
                  SSEAlgorithm: 'AES256'
                },
                BucketKeyEnabled: false
              }
            ]
          }
        }, null, 2),
        notes: 'Uses default Amazon-managed SSE-S3 encryption instead of Customer Managed KMS Key (SSE-KMS) with access audit logging.'
      },
      {
        name: 'sample-object-metadata.json',
        type: 'S3 Object Metadata',
        content: JSON.stringify({
          Key: 'records/2026/patient-00912-diagnosis.pdf',
          ServerSideEncryption: 'AES256',
          ContentType: 'application/pdf',
          Metadata: { 'patient-id': '00912', 'data-classification': 'PHI-RESTRICTED' }
        }, null, 2),
        notes: 'Object contains PHI but lacks independent key policy authorization boundaries.'
      }
    ],
    investigationTasks: [
      'Verify bucket default encryption configuration and KMS key policies',
      'Assess distinction between SSE-S3 and SSE-KMS with customer-managed keys',
      'Inspect bucket policy for Deny statement on unencrypted object puts',
      'Design seamless batch re-encryption process for existing patient objects'
    ],
    findings: [
      { id: 'f1', label: 'Bucket relies on default SSE-S3 instead of Customer Managed KMS Key (SSE-KMS)', isCorrect: true },
      { id: 'f2', label: 'Lack of KMS key policy means S3 access permissions cannot be separated from decryption rights', isCorrect: true },
      { id: 'f3', label: 'Bucket policy does not enforce s3:x-amz-server-side-encryption condition on PUT operations', isCorrect: true },
      { id: 'f4', label: 'S3 bucket lacks cross-region read replicas', isCorrect: false }
    ],
    rootCauseAnalysis: 'Developers assumed default SSE-S3 satisfied HIPAA requirements without understanding that SSE-KMS is required to enforce dual-party access control (IAM policy + KMS key policy).',
    securityImpact: 'Anyone with s3:GetObject can read patient diagnosis records without needing kms:Decrypt permissions, preventing dual authorization checks and CloudTrail KMS audit logging.',
    businessImpact: 'HIPAA regulatory audit failure, potential HHS Office for Civil Rights (OCR) investigation, and fines up to $50,000 per violation day.',
    remediationPlan: [
      'Immediate: Provision an AWS KMS Customer Managed Key (CMK) titled phi-data-key with rotation enabled.',
      'Policy: Update bucket policy with an explicit Deny on s3:PutObject unless s3:x-amz-server-side-encryption-aws-kms-key-id matches the CMK ARN.',
      'Update: Enable default bucket encryption to use the new CMK with S3 Bucket Keys enabled for cost efficiency.',
      'Batch: Execute S3 Batch Operations job to re-encrypt all existing objects in place with the CMK.'
    ],
    awsBestPractices: [
      'Use Customer Managed Keys (CMKs) for regulated workloads (HIPAA, PCI, FedRAMP).',
      'Enforce encryption in transit (aws:SecureTransport) and encryption at rest via bucket policy conditions.',
      'Separate KMS Key Administration permissions from Key Usage permissions.'
    ],
    lessonsLearned: 'SSE-S3 protects the physical disk in an AWS data center, but does NOT protect against logical cloud compromise; only SSE-KMS with key policies gives you independent access governance.'
  },
  {
    id: 'inv-s3-04',
    ticket: 'INC-S3-04',
    category: 'S3 Security',
    categoryKey: 's3',
    title: 'Legacy Public ACLs Permitting Anonymous Access on S3 Sub-Prefix',
    incidentSummary: 'An internal penetration test discovered that a legacy subfolder within a corporate data bucket has an Object ACL granting READ to AllUsers.',
    businessContext: 'Media distribution platform hosting both public marketing videos and confidential creator contract PDFs in the same bucket.',
    riskLevel: 'High',
    affectedServices: ['Amazon S3', 'AWS IAM'],
    evidence: [
      {
        name: 'object-acl.json',
        type: 'S3 Object ACL',
        content: JSON.stringify({
          Owner: { DisplayName: 'media-corp-admin', ID: '79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be' },
          Grants: [
            {
              Grantee: { Type: 'Group', URI: 'http://acs.amazonaws.com/groups/global/AllUsers' },
              Permission: 'READ'
            }
          ]
        }, null, 2),
        notes: 'Legacy Object ACL overrides expected private bucket expectations.'
      },
      {
        name: 'bucket-ownership-controls.json',
        type: 'S3 Ownership Controls',
        content: JSON.stringify({
          Rules: [{ ObjectOwnership: 'ObjectWriter' }]
        }, null, 2),
        notes: 'ObjectOwnership is set to ObjectWriter, leaving ACLs active and overriding bucket policies.'
      }
    ],
    investigationTasks: [
      'Inspect S3 Object Ownership settings across the storage estate',
      'Inventory objects granting AllUsers or AuthenticatedUsers ACL permissions',
      'Enforce S3 Object Ownership: BucketOwnerEnforced to disable ACLs globally',
      'Verify application upload scripts do not fail due to hardcoded ACL parameters'
    ],
    findings: [
      { id: 'f1', label: 'ObjectOwnership is set to ObjectWriter, enabling dangerous legacy ACL behavior', isCorrect: true },
      { id: 'f2', label: 'Global AllUsers group grant provides public unauthenticated read access to objects', isCorrect: true },
      { id: 'f3', label: 'Mixing public marketing assets and private creator contracts in a single bucket', isCorrect: true },
      { id: 'f4', label: 'S3 Intelligent-Tiering is not configured for cost optimization', isCorrect: false }
    ],
    rootCauseAnalysis: 'Legacy scripts from 2018 uploaded files using --acl public-read; when Block Public Access was partially reconfigured, Object Ownership was never updated to BucketOwnerEnforced.',
    securityImpact: 'Confidential creator contracts with signatures and bank account routing numbers were publicly readable by anyone who guessed or brute-forced the object key.',
    businessImpact: 'Severe breach of partner and creator contracts, risk of fraud, and public exposure of executive compensation agreements.',
    remediationPlan: [
      'Immediate: Change S3 Object Ownership to BucketOwnerEnforced, which disables all ACLs and makes bucket policy the sole source of truth.',
      'Segregate: Move public marketing assets into a dedicated public-distribution bucket and keep contracts in a strictly isolated internal bucket.',
      'Verify: Update CI/CD and deployment scripts to remove any --acl public-read flags.'
    ],
    awsBestPractices: [
      'Always set S3 Object Ownership to BucketOwnerEnforced for all modern AWS accounts.',
      'Never mix public and private data in the same S3 bucket.',
      'Use bucket policies and IAM roles instead of ACLs for all access management.'
    ],
    lessonsLearned: 'S3 ACLs are a legacy relic from 2006. BucketOwnerEnforced is one of the easiest and highest-impact security controls you can apply in AWS.'
  },
  {
    id: 'inv-s3-05',
    ticket: 'INC-S3-05',
    category: 'S3 Security',
    categoryKey: 's3',
    title: 'Cleartext HTTP Access Allowed via Missing SecureTransport Condition',
    incidentSummary: 'Network packet captures in an enterprise VPC revealed internal microservices transmitting unencrypted API requests over plain HTTP to an S3 endpoint.',
    businessContext: 'Banking core ledger backup system. Wire transfer transaction logs transferred across network boundaries must be encrypted in transit.',
    riskLevel: 'High',
    affectedServices: ['Amazon S3', 'AWS VPC', 'AWS CloudTrail'],
    evidence: [
      {
        name: 'bucket-policy.json',
        type: 'S3 Bucket Policy',
        content: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Sid: 'AllowInternalLedgerService',
              Effect: 'Allow',
              Principal: { AWS: 'arn:aws:iam::123456789012:role/ledger-service-role' },
              Action: ['s3:GetObject', 's3:PutObject'],
              Resource: 'arn:aws:s3:::bank-ledger-records-prod/*'
            }
          ]
        }, null, 2),
        notes: 'Policy allows read/write access but contains NO condition enforcing TLS/HTTPS (aws:SecureTransport: true).'
      },
      {
        name: 'cloudtrail-s3-event.json',
        type: 'CloudTrail Event',
        content: JSON.stringify({
          eventName: 'GetObject',
          requestParameters: { bucketName: 'bank-ledger-records-prod' },
          tlsDetails: null
        }, null, 2),
        notes: 'CloudTrail log indicates request was received over unencrypted plaintext HTTP (tlsDetails is null).'
      }
    ],
    investigationTasks: [
      'Inspect bucket policy for explicit Deny on aws:SecureTransport: false',
      'Trace VPC flow and proxy logs to identify services initiating non-TLS connections',
      'Attach mandatory TLS enforcement policy without breaking production microservices',
      'Configure VPC Endpoint policy for private S3 communication'
    ],
    findings: [
      { id: 'f1', label: 'Bucket policy allows plaintext HTTP transport by omitting aws:SecureTransport Deny condition', isCorrect: true },
      { id: 'f2', label: 'Internal microservice client configuration sends unencrypted HTTP requests over port 80', isCorrect: true },
      { id: 'f3', label: 'Financial ledger transactions vulnerable to in-transit eavesdropping and tampering', isCorrect: true },
      { id: 'f4', label: 'Bucket lacks S3 Lifecycle expiration rule for old ledger versions', isCorrect: false }
    ],
    rootCauseAnalysis: 'Developers configured the AWS SDK endpoint URL with http:// instead of https:// during internal network testing and omitted the standard secure transport bucket guardrail.',
    securityImpact: 'Adversaries or malicious insiders positioned along the network transit path can intercept, read, or tamper with financial transaction payloads in transit.',
    businessImpact: 'Direct violation of PCI-DSS Requirement 4.1 (encrypt transmissions of cardholder data across open, public networks) and federal banking regulations.',
    remediationPlan: [
      'Immediate: Add an explicit Deny bucket policy statement for any request where aws:SecureTransport equals false.',
      'Client: Update ledger service configuration to enforce HTTPS endpoints with TLS 1.2+ minimum.',
      'Network: Route all traffic through an S3 VPC Gateway Endpoint with an endpoint policy enforcing TLS.'
    ],
    awsBestPractices: [
      'Every production S3 bucket policy should have an explicit Deny statement for aws:SecureTransport: false.',
      'Enforce TLS 1.2 or higher for all AWS API calls.',
      'Use S3 VPC Endpoints to keep traffic within the AWS private backbone.'
    ],
    lessonsLearned: 'Encryption at rest is useless if your data travels across the network in cleartext; always mandate aws:SecureTransport: false rejection.'
  },

  // ==========================================
  // 3. NETWORKING SECURITY (5 Investigations)
  // ==========================================
  {
    id: 'inv-net-01',
    ticket: 'INC-NET-01',
    category: 'Networking Security',
    categoryKey: 'network',
    title: 'Private Payments Subnet Misrouted Directly to Internet Gateway',
    incidentSummary: 'An automated compliance scan detected that a private subnet hosting PCI payment gateway EC2 instances has a default route to an Internet Gateway (IGW).',
    businessContext: 'Payment processing system handling credit card CVV and authorization requests. Must be isolated in private subnets with strictly filtered egress.',
    riskLevel: 'Critical',
    affectedServices: ['Amazon VPC', 'EC2', 'AWS Route Tables'],
    evidence: [
      {
        name: 'route-table-association.json',
        type: 'VPC Route Table',
        content: JSON.stringify({
          RouteTableId: 'rtb-088921a99b456cafe',
          AssociatedSubnets: ['subnet-0992a8848483-payments-private-1a'],
          Routes: [
            { DestinationCidrBlock: '10.0.0.0/16', GatewayId: 'local', State: 'active' },
            { DestinationCidrBlock: '0.0.0.0/0', GatewayId: 'igw-03882717181827182', State: 'active' }
          ]
        }, null, 2),
        notes: 'Route table associated with private payments subnet directs 0.0.0.0/0 directly to Internet Gateway (IGW).'
      },
      {
        name: 'subnet-details.json',
        type: 'Subnet Metadata',
        content: JSON.stringify({
          SubnetId: 'subnet-0992a8848483-payments-private-1a',
          CidrBlock: '10.0.20.0/24',
          MapPublicIpOnLaunch: true
        }, null, 2),
        notes: 'Subnet auto-assigns public IPv4 addresses to newly launched instances.'
      }
    ],
    investigationTasks: [
      'Analyze route table routes and determine internet reachability of payment hosts',
      'Verify if instances in subnet-0992a8848483 possess public IPv4 addresses',
      'Inspect security groups attached to instances in the payments subnet',
      'Reroute private subnet egress through NAT Gateway in public subnet'
    ],
    findings: [
      { id: 'f1', label: 'Default route 0.0.0.0/0 points to an Internet Gateway instead of a NAT Gateway', isCorrect: true },
      { id: 'f2', label: 'Subnet has MapPublicIpOnLaunch enabled, making backend instances directly internet-addressable', isCorrect: true },
      { id: 'f3', label: 'PCI payments tier is exposed directly to external inbound network probes', isCorrect: true },
      { id: 'f4', label: 'VPC has DNS Hostnames enabled', isCorrect: false }
    ],
    rootCauseAnalysis: 'A junior engineer misassociated the private payments subnet with the public DMZ route table during a Terraform refactor of VPC modules.',
    securityImpact: 'Instances intended to be isolated backends were placed in a public subnet topology; any misconfigured security group would allow direct internet compromise.',
    businessImpact: 'Immediate loss of PCI-DSS Level 1 Merchant compliance certification; card brands may levy fines of up to $100,000/month until remediated.',
    remediationPlan: [
      'Immediate: Re-associate subnet-0992a8848483 with the private route table pointing 0.0.0.0/0 to the NAT Gateway nat-082728191.',
      'Immediate: Disable MapPublicIpOnLaunch on the payments subnet.',
      'Triage: Inspect VPC Flow Logs for any inbound connections from external IPs to the payment instance IPs.',
      'Guardrail: Add AWS Config managed rule vpc-subnets-isolated-check to prevent future routing regressions.'
    ],
    awsBestPractices: [
      'Maintain separate route tables for public, private, and isolated (database) subnets.',
      'Database and payment subnets should have no route to 0.0.0.0/0 at all if egress is not required.',
      'Use AWS Network Access Analyzer to verify network isolation paths.'
    ],
    lessonsLearned: 'In AWS, a "private" subnet is ONLY private because of its route table; attaching an IGW turns ANY subnet into a public DMZ.'
  },
  {
    id: 'inv-net-02',
    ticket: 'INC-NET-02',
    category: 'Networking Security',
    categoryKey: 'network',
    title: 'Exposed Management Ports: Internet-Facing SSH (Port 22) and RDP (Port 3389)',
    incidentSummary: 'Amazon GuardDuty generated a high-severity finding: BruteForce:EC2/SSH.BruteForce against a production EC2 bastion host.',
    businessContext: 'Core production backend management infrastructure. An attacker brute-forcing credentials could pivot directly to internal databases.',
    riskLevel: 'Critical',
    affectedServices: ['Amazon VPC', 'EC2', 'Amazon GuardDuty'],
    evidence: [
      {
        name: 'security-group-rules.json',
        type: 'Security Group Ingress',
        content: JSON.stringify({
          GroupId: 'sg-0992a8383818182',
          GroupName: 'bastion-host-sg',
          IpPermissions: [
            {
              IpProtocol: 'tcp',
              FromPort: 22,
              ToPort: 22,
              IpRanges: [{ CidrIp: '0.0.0.0/0', Description: 'Temporary debugging - remove later' }]
            },
            {
              IpProtocol: 'tcp',
              FromPort: 3389,
              ToPort: 3389,
              IpRanges: [{ CidrIp: '0.0.0.0/0', Description: 'Windows admin access' }]
            }
          ]
        }, null, 2),
        notes: 'Both SSH (22) and RDP (3389) open to the entire public internet (0.0.0.0/0).'
      },
      {
        name: 'guardduty-ssh-bruteforce.json',
        type: 'GuardDuty Finding',
        content: JSON.stringify({
          type: 'UnauthorizedAccess:EC2/SSHBruteForce',
          severity: 7.2,
          description: '198.51.100.99 is performing SSH brute force attacks against i-0992828181.',
          service: { count: 8420, eventFirstSeen: '2026-09-24T06:00:00Z', eventLastSeen: '2026-09-24T12:00:00Z' }
        }, null, 2),
        notes: 'Over 8,400 failed SSH login attempts detected from a botnet IP.'
      }
    ],
    investigationTasks: [
      'Examine security group ingress rules for 0.0.0.0/0 on sensitive administrative ports',
      'Check auth.log and secure event logs on EC2 instance to confirm whether any brute-force attempts succeeded',
      'Remove 0.0.0.0/0 ingress rules immediately',
      'Decommission bastion host and migrate to AWS Systems Manager Session Manager'
    ],
    findings: [
      { id: 'f1', label: 'Security group permits open ingress on SSH port 22 from 0.0.0.0/0', isCorrect: true },
      { id: 'f2', label: 'Security group permits open ingress on RDP port 3389 from 0.0.0.0/0', isCorrect: true },
      { id: 'f3', label: 'Active brute-force attack in progress with over 8,000 attempts recorded by GuardDuty', isCorrect: true },
      { id: 'f4', label: 'EC2 instance is using an gp3 EBS volume instead of io2', isCorrect: false }
    ],
    rootCauseAnalysis: 'An engineer added temporary debugging rules allowing 0.0.0.0/0 on ports 22 and 3389 to troubleshoot a connection issue and forgot to delete them after resolution.',
    securityImpact: 'Instance subjected to continuous automated password and key dictionary attacks; potential remote code execution or server compromise as an internal network pivot.',
    businessImpact: 'High risk of ransomware deployment, unauthorized access to internal corporate databases, and severe compliance violations.',
    remediationPlan: [
      'Immediate: Delete both ingress rules allowing 0.0.0.0/0 on ports 22 and 3389 from sg-0992a8383818182.',
      'Inspect: Check instance system logs for successful logins during the brute-force window.',
      'Replace: Install AWS Systems Manager (SSM) Agent on the instance and attach the AmazonSSMManagedInstanceCore IAM role.',
      'Decommission: Terminate the bastion host and mandate AWS Systems Manager Session Manager for all future operator shell access.'
    ],
    awsBestPractices: [
      'Never open port 22 or 3389 to 0.0.0.0/0 in any AWS security group.',
      'Use AWS Systems Manager Session Manager for secure, audited browser-based shell access without open inbound ports.',
      'Deploy AWS Network Firewall or AWS WAF for perimeter inspection.'
    ],
    lessonsLearned: 'Bastion hosts with open SSH ports are an outdated pattern. AWS Systems Manager Session Manager gives you zero open inbound ports, IAM authentication, and complete session logging in CloudTrail.'
  },
  {
    id: 'inv-net-03',
    ticket: 'INC-NET-03',
    category: 'Networking Security',
    categoryKey: 'network',
    title: 'Flat Network Perimeter: Database Security Group Accepting Traffic from 0.0.0.0/0',
    incidentSummary: 'An automated vulnerability scanner identified that an Amazon Aurora PostgreSQL cluster security group allows inbound connections on port 5432 from 0.0.0.0/0.',
    businessContext: 'Core production database storing customer credentials, billing records, and personal profiles. Direct database exposure threatens enterprise operations.',
    riskLevel: 'Critical',
    affectedServices: ['Amazon VPC', 'Amazon RDS', 'EC2'],
    evidence: [
      {
        name: 'database-security-group.json',
        type: 'RDS Security Group',
        content: JSON.stringify({
          GroupId: 'sg-0881726a7b8c9d0e1',
          GroupName: 'aurora-postgres-db-sg',
          IpPermissions: [
            {
              IpProtocol: 'tcp',
              FromPort: 5432,
              ToPort: 5432,
              IpRanges: [{ CidrIp: '0.0.0.0/0', Description: 'Database access' }]
            }
          ]
        }, null, 2),
        notes: 'PostgreSQL port 5432 is open to the entire internet instead of being chained to the application tier security group.'
      },
      {
        name: 'rds-instance-configuration.json',
        type: 'RDS Instance Details',
        content: JSON.stringify({
          DBInstanceIdentifier: 'prod-customer-db',
          PubliclyAccessible: true,
          Endpoint: 'prod-customer-db.c9928181.us-east-1.rds.amazonaws.com'
        }, null, 2),
        notes: 'Database instance has PubliclyAccessible set to true and resolves to a public IPv4 IP address.'
      }
    ],
    investigationTasks: [
      'Examine RDS instance PubliclyAccessible flag and attached security groups',
      'Verify if database port 5432 can be reached from external networks',
      'Identify the application tier security group (e.g., sg-app-tier)',
      'Implement security group chaining to restrict port 5432 only to application instances'
    ],
    findings: [
      { id: 'f1', label: 'RDS PostgreSQL port 5432 is open to 0.0.0.0/0 in the security group', isCorrect: true },
      { id: 'f2', label: 'Database instance PubliclyAccessible property is enabled with a public IP', isCorrect: true },
      { id: 'f3', label: 'Lack of security group chaining between application and database tiers', isCorrect: true },
      { id: 'f4', label: 'PostgreSQL automated backup retention is set to 7 days', isCorrect: false }
    ],
    rootCauseAnalysis: 'Developers enabled PubliclyAccessible so they could run database migrations from local laptops, opening port 5432 globally rather than using a VPN or Systems Manager tunnel.',
    securityImpact: 'Production database exposed to internet-wide automated SQL injection probes, brute-force dictionary attacks against postgres user, and potential remote code execution.',
    businessImpact: 'High likelihood of total customer database exfiltration, ransomware database wiping, and enterprise-ending regulatory penalties.',
    remediationPlan: [
      'Immediate: Remove the 0.0.0.0/0 ingress rule on port 5432 from sg-0881726a7b8c9d0e1.',
      'Immediate: Modify RDS instance to set PubliclyAccessible: false and move database to isolated database subnets.',
      'Chaining: Add an ingress rule on port 5432 referencing the SourceSecurityGroupId: sg-app-tier (security group chaining).',
      'Developers: Provide developer database access via AWS Client VPN or Systems Manager Port Forwarding.'
    ],
    awsBestPractices: [
      'Always use security group chaining: source security group A to security group B rather than IP CIDR ranges.',
      'Never set PubliclyAccessible: true on production relational databases.',
      'Place databases in isolated subnets with no internet gateway or NAT gateway routes.'
    ],
    lessonsLearned: 'IP ranges in security groups are fragile and dangerous; security group chaining allows dynamic, zero-trust network boundaries that adapt automatically as instances scale.'
  },
  {
    id: 'inv-net-04',
    ticket: 'INC-NET-04',
    category: 'Networking Security',
    categoryKey: 'network',
    title: 'VPC Peering Route Sprawl Exposing Staging to Production',
    incidentSummary: 'A penetration tester compromised a staging server and discovered they could reach production database endpoints directly through an unrestricted VPC peering connection.',
    businessContext: 'Separate AWS VPCs for staging and production intended to enforce strict environment isolation and prevent staging vulnerabilities from bleeding into production.',
    riskLevel: 'High',
    affectedServices: ['Amazon VPC', 'AWS Route Tables', 'AWS Peering Connections'],
    evidence: [
      {
        name: 'peering-route-table.json',
        type: 'VPC Peering Routes',
        content: JSON.stringify({
          RouteTableId: 'rtb-staging-workloads',
          VpcId: 'vpc-staging-10-1-0-0',
          Routes: [
            { DestinationCidrBlock: '10.1.0.0/16', GatewayId: 'local' },
            { DestinationCidrBlock: '10.0.0.0/16', VpcPeeringConnectionId: 'pcx-08821919292-staging-to-prod', State: 'active' }
          ]
        }, null, 2),
        notes: 'Broad /16 CIDR route allows all staging instances to send packets to any IP in the production VPC.'
      },
      {
        name: 'prod-db-sg.json',
        type: 'Production Security Group',
        content: JSON.stringify({
          GroupId: 'sg-prod-database',
          IpPermissions: [
            {
              IpProtocol: 'tcp',
              FromPort: 5432,
              ToPort: 5432,
              IpRanges: [{ CidrIp: '10.0.0.0/8', Description: 'Internal corporate network' }]
            }
          ]
        }, null, 2),
        notes: 'Production database security group allows all 10.0.0.0/8 IPs, including the peered staging VPC.'
      }
    ],
    investigationTasks: [
      'Map VPC peering connections and routing tables between environments',
      'Identify lateral movement attack paths from staging into production subnets',
      'Audit security group ingress rules using overly permissive /8 or /16 CIDRs',
      'Sever broad peering route and implement VPC lattice or narrow endpoint boundaries'
    ],
    findings: [
      { id: 'f1', label: 'Unrestricted VPC peering connection allows full bidirectional routing between staging and prod', isCorrect: true },
      { id: 'f2', label: 'Production database security group uses overly broad 10.0.0.0/8 CIDR ingress rule', isCorrect: true },
      { id: 'f3', label: 'Environment isolation boundaries broken, allowing staging compromise to pivot into production', isCorrect: true },
      { id: 'f4', label: 'VPC Flow Logs destination is Amazon CloudWatch Logs', isCorrect: false }
    ],
    rootCauseAnalysis: 'A VPC peering connection created for a temporary data sync was left active with broad /16 routes, and production security groups trusted all RFC 1918 private addresses.',
    securityImpact: 'Any compromise of lower-security staging servers (which often run debug code, older packages, or synthetic data) provides direct lateral access to production crown jewels.',
    businessImpact: 'Failure of SOC 2 Trust Services Criteria for environment segregation; risk of production data tampering and audit non-compliance.',
    remediationPlan: [
      'Immediate: Delete the VPC peering connection pcx-08821919292-staging-to-prod.',
      'Refactor: Replace overly broad 10.0.0.0/8 CIDR rules in production security groups with exact production application security group IDs.',
      'Architecture: If data replication between staging and prod is required, use AWS PrivateLink or S3 batch replication rather than network-level peering.'
    ],
    awsBestPractices: [
      'Never peer staging or development VPCs directly with production VPCs.',
      'Avoid 10.0.0.0/8 or /16 CIDR rules in security groups; use specific security group references.',
      'Use AWS Organizations multi-account strategy to keep environments in completely isolated AWS accounts.'
    ],
    lessonsLearned: 'Network peering bridges trust boundaries. If your staging environment can route packets to your production database, you do not have two environments—you have one vulnerable environment.'
  },
  {
    id: 'inv-net-05',
    ticket: 'INC-NET-05',
    category: 'Networking Security',
    categoryKey: 'network',
    title: 'Public IPv4 Auto-Assign Enabled on Internal Workload Subnet',
    incidentSummary: 'An infrastructure review found that internal microservice worker EC2 instances launched last night unexpectedly have public IPv4 addresses assigned.',
    businessContext: 'Internal inventory calculation workers processing warehouse logistics. Instances should only communicate internally over private RFC 1918 addresses.',
    riskLevel: 'Medium',
    affectedServices: ['Amazon VPC', 'EC2'],
    evidence: [
      {
        name: 'subnet-attribute.json',
        type: 'VPC Subnet Attributes',
        content: JSON.stringify({
          SubnetId: 'subnet-03991827181-internal-workers',
          VpcId: 'vpc-01122334455',
          MapPublicIpOnLaunch: true,
          AssignIpv6AddressOnCreation: false
        }, null, 2),
        notes: 'MapPublicIpOnLaunch is true for a subnet named internal-workers.'
      },
      {
        name: 'instance-network-interface.json',
        type: 'ENI Description',
        content: JSON.stringify({
          InstanceId: 'i-09928181282-worker-1',
          PrivateIpAddress: '10.0.4.88',
          Association: {
            PublicIp: '54.210.88.192',
            PublicDnsName: 'ec2-54-210-88-192.compute-1.amazonaws.com'
          }
        }, null, 2),
        notes: 'Worker instance has a globally routable public IPv4 address assigned to eth0.'
      }
    ],
    investigationTasks: [
      'Verify the MapPublicIpOnLaunch setting across all VPC subnets',
      'Check route table for the subnet to confirm whether an IGW route exists',
      'Disable public IP auto-assignment on internal-workers subnet',
      'Identify and remediate running instances that were assigned public IPs'
    ],
    findings: [
      { id: 'f1', label: 'MapPublicIpOnLaunch is enabled on a subnet dedicated to internal backend workers', isCorrect: true },
      { id: 'f2', label: 'Backend worker instances are assigned public IPv4 addresses, increasing attack surface', isCorrect: true },
      { id: 'f3', label: 'Increased AWS billing costs from unnecessary public IPv4 address allocation', isCorrect: true },
      { id: 'f4', label: 'VPC has flow logs enabled with 1-minute aggregation interval', isCorrect: false }
    ],
    rootCauseAnalysis: 'The subnet was provisioned using a copy-pasted configuration template from a public DMZ subnet where MapPublicIpOnLaunch was set to true.',
    securityImpact: 'Backend instances become targets for external internet scans; if any local port is opened on the host, it is directly exposed to external exploit attempts.',
    businessImpact: 'Unnecessary exposure of internal microservices, compliance audit finding, and ongoing AWS public IPv4 hourly charges ($0.005/hr per IP).',
    remediationPlan: [
      'Immediate: Modify subnet attribute to set MapPublicIpOnLaunch: false.',
      'Instances: For existing worker instances, create an AMI, relaunch into private subnets without public IPs, and terminate the exposed instances.',
      'Policy: Enforce an SCP preventing ec2:AssociateAddress and non-admin creation of public subnets.'
    ],
    awsBestPractices: [
      'Keep MapPublicIpOnLaunch set to false by default on all subnets.',
      'Only public subnets housing load balancers or NAT gateways should possess public IP addresses.',
      'Deploy AWS Config rule subnet-auto-assign-public-ip-disabled to detect configuration drift.'
    ],
    lessonsLearned: 'Public IPs are entry points. Internal backend compute should never have a public IP address—ever.'
  },

  // ==========================================
  // 4. MONITORING & LOGGING (5 Investigations)
  // ==========================================
  {
    id: 'inv-mon-01',
    ticket: 'INC-MON-01',
    category: 'Monitoring & Logging',
    categoryKey: 'monitoring',
    title: 'CloudTrail Disabled Prior to Suspicious IAM Role Modification',
    incidentSummary: 'An engineer noticed CloudTrail management event logging was halted for 45 minutes; during that dark window, a new administrator access key was generated.',
    businessContext: 'Regulated securities exchange trading platform. Missing audit trails destroy legal non-repudiation and violate SEC compliance.',
    riskLevel: 'Critical',
    affectedServices: ['AWS CloudTrail', 'Amazon CloudWatch', 'AWS IAM'],
    evidence: [
      {
        name: 'trail-status.json',
        type: 'CloudTrail Status',
        content: JSON.stringify({
          TrailARN: 'arn:aws:cloudtrail:us-east-1:123456789012:trail/organization-core-trail',
          IsLogging: false,
          LatestStopLoggingTime: '2026-09-24T10:00:00Z'
        }, null, 2),
        notes: 'Trail was disabled using StopLogging API call at 10:00:00Z.'
      },
      {
        name: 'last-logged-event.json',
        type: 'CloudTrail Event',
        content: JSON.stringify({
          eventTime: '2026-09-24T09:59:58Z',
          eventName: 'StopLogging',
          userIdentity: {
            type: 'AssumedRole',
            arn: 'arn:aws:sts::123456789012:assumed-role/admin-session/alex'
          },
          requestParameters: { name: 'organization-core-trail' }
        }, null, 2),
        notes: 'StopLogging executed by alex session right before audit logs went dark.'
      }
    ],
    investigationTasks: [
      'Re-enable CloudTrail logging immediately using StartLogging',
      'Correlate remaining telemetry from VPC Flow Logs, GuardDuty, and S3 access logs during the dark window',
      'Lock down CloudTrail configuration permissions via AWS Organizations SCP',
      'Deploy high-priority alarm for any StopLogging, DeleteTrail, or UpdateTrail API calls'
    ],
    findings: [
      { id: 'f1', label: 'CloudTrail trail was disabled using StopLogging by an administrative identity', isCorrect: true },
      { id: 'f2', label: '45-minute audit visibility gap where privileged API calls were not recorded centrally', isCorrect: true },
      { id: 'f3', label: 'No automated alarm or EventBridge rule alerted security responders when logging stopped', isCorrect: true },
      { id: 'f4', label: 'The trail is configured to log across all AWS Regions', isCorrect: false }
    ],
    rootCauseAnalysis: 'An administrator role lacked guardrails preventing it from tampering with security monitoring; the identity disabled logging to cover unauthorized credential creation.',
    securityImpact: 'Destruction of forensic audit trail; responders cannot definitively determine what resources were created, accessed, or exfiltrated during the 45-minute window.',
    businessImpact: 'Severe regulatory breach under Sarbanes-Oxley (SOX) and SEC guidelines; loss of evidentiary integrity for legal prosecution.',
    remediationPlan: [
      'Immediate: Execute StartLogging on organization-core-trail and verify events are arriving in S3.',
      'Triage: Cross-reference VPC Flow Logs and GuardDuty findings to detect activity that occurred while CloudTrail was disabled.',
      'SCP Guardrail: Apply an AWS Organizations SCP that explicitly denies cloudtrail:StopLogging, cloudtrail:DeleteTrail, and cloudtrail:UpdateTrail to all identities except root.',
      'Alerting: Create an Amazon EventBridge rule that sends high-priority PagerDuty alerts on any CloudTrail lifecycle change.'
    ],
    awsBestPractices: [
      'Apply an Organization-level CloudTrail trail deployed from the AWS Organizations management account.',
      'Use SCPs to prevent any member account administrator from stopping or modifying logging.',
      'Deliver CloudTrail logs to a dedicated, write-once Log Archive AWS account.'
    ],
    lessonsLearned: 'Logging is not just an operational feature—it is a critical security control. If your administrators can turn off the cameras, you have no accountability.'
  },
  {
    id: 'inv-mon-02',
    ticket: 'INC-MON-02',
    category: 'Monitoring & Logging',
    categoryKey: 'monitoring',
    title: 'Missing S3 Data Events during Suspected IP Theft Exfiltration',
    incidentSummary: 'A terminated engineer is suspected of downloading proprietary trade secret source code from S3 prior to departure, but the bucket only logs management events.',
    businessContext: 'High-tech semiconductor design firm. Trade secrets and Verilog hardware models stored in S3 represent the company core enterprise value.',
    riskLevel: 'High',
    affectedServices: ['AWS CloudTrail', 'Amazon S3', 'Amazon Athena'],
    evidence: [
      {
        name: 'cloudtrail-selectors.json',
        type: 'CloudTrail Event Selectors',
        content: JSON.stringify({
          TrailName: 'management-audit-trail',
          EventSelectors: [
            {
              ReadWriteType: 'All',
              IncludeManagementEvents: true,
              DataResources: []
            }
          ]
        }, null, 2),
        notes: 'DataResources is empty. CloudTrail is logging management events (CreateBucket, DeleteBucket) but ZERO S3 data events (GetObject, PutObject).'
      },
      {
        name: 's3-bucket-logging.json',
        type: 'S3 Server Access Logging',
        content: JSON.stringify({
          Bucket: 'proprietary-source-code-prod',
          ServerAccessLoggingStatus: 'Disabled'
        }, null, 2),
        notes: 'S3 Server Access Logging is also disabled on the target repository bucket.'
      }
    ],
    investigationTasks: [
      'Review CloudTrail event selectors to determine if S3 Data Events are captured',
      'Check S3 Server Access Logging status on the proprietary source code bucket',
      'Attempt alternative forensic recovery via VPC Flow Logs byte transfer volume metrics',
      'Enable S3 Data Events for all critical data stores'
    ],
    findings: [
      { id: 'f1', label: 'CloudTrail is not configured to log S3 Data Events (GetObject, PutObject)', isCorrect: true },
      { id: 'f2', label: 'S3 Server Access Logging is disabled on the source code bucket', isCorrect: true },
      { id: 'f3', label: 'Forensic investigators cannot verify which specific objects or files were exfiltrated', isCorrect: true },
      { id: 'f4', label: 'CloudTrail log file validation is enabled', isCorrect: false }
    ],
    rootCauseAnalysis: 'S3 Data Events were disabled to save CloudTrail logging costs ($0.10 per 100,000 data events), leaving the organization blind to data-plane access on sensitive assets.',
    securityImpact: 'Total lack of data access visibility. The security team cannot prove or disprove whether intellectual property was downloaded by the departing employee.',
    businessImpact: 'Inability to seek legal injunction against the former employee due to lack of admissible digital evidence; loss of competitive market advantage.',
    remediationPlan: [
      'Immediate: Configure CloudTrail Data Event selector specifically for arn:aws:s3:::proprietary-source-code-prod/*',
      'Backup: Enable S3 Server Access Logging to an isolated logging bucket as a secondary telemetry stream.',
      'Forensics: Analyze VPC Flow Logs for outbound data transfer spikes from the former employee IP during their final week.',
      'Governance: Classify all S3 buckets by data sensitivity and mandate data event logging for Tier 1 Confidential assets.'
    ],
    awsBestPractices: [
      'Enable S3 Data Events on all sensitive, financial, and intellectual property buckets.',
      'Use CloudTrail Advanced Event Selectors to filter for specific prefixes and avoid unnecessary logging noise.',
      'Enable Amazon Macie or S3 Storage Lens to track access anomalies across large storage fleets.'
    ],
    lessonsLearned: 'Management events tell you how the bucket was built; Data events tell you who took the data. You cannot detect data exfiltration without data events.'
  },
  {
    id: 'inv-mon-03',
    ticket: 'INC-MON-03',
    category: 'Monitoring & Logging',
    categoryKey: 'monitoring',
    title: 'Tamperable Audit Logs: Log Archive Stored in Same Account with Public Delete',
    incidentSummary: 'An architecture audit found that CloudTrail logs for the production account are written to a bucket in the same account where administrators can delete logs without MFA.',
    businessContext: 'E-commerce platform subject to annual SOC 2 Type II audit. Audit logs must satisfy strict non-repudiation and separation of duties requirements.',
    riskLevel: 'High',
    affectedServices: ['AWS CloudTrail', 'Amazon S3', 'AWS IAM'],
    evidence: [
      {
        name: 'log-bucket-policy.json',
        type: 'S3 Bucket Policy',
        content: JSON.stringify({
          Id: 'CloudTrailBucketPolicy',
          Statement: [
            {
              Sid: 'AWSCloudTrailWrite',
              Effect: 'Allow',
              Principal: { Service: 'cloudtrail.amazonaws.com' },
              Action: 's3:PutObject',
              Resource: 'arn:aws:s3:::local-prod-cloudtrail-logs/AWSLogs/123456789012/*'
            },
            {
              Sid: 'AllowAdminCleanUp',
              Effect: 'Allow',
              Principal: { AWS: 'arn:aws:iam::123456789012:role/AccountAdmin' },
              Action: 's3:DeleteObject',
              Resource: 'arn:aws:s3:::local-prod-cloudtrail-logs/*'
            }
          ]
        }, null, 2),
        notes: 'Local account admin has explicit s3:DeleteObject permission on the active CloudTrail log archive.'
      },
      {
        name: 'log-file-validation.json',
        type: 'Trail Properties',
        content: JSON.stringify({
          Name: 'production-trail',
          EnableLogFileValidation: false
        }, null, 2),
        notes: 'Log file validation is disabled, preventing detection of modified or deleted log files.'
      }
    ],
    investigationTasks: [
      'Review CloudTrail log destination bucket architecture and account boundaries',
      'Check EnableLogFileValidation status on all active trails',
      'Verify if bucket policy permits s3:DeleteObject to any identity',
      'Migrate log delivery to a dedicated AWS Log Archive account with Object Lock'
    ],
    findings: [
      { id: 'f1', label: 'CloudTrail logs stored in the same AWS account as production workloads', isCorrect: true },
      { id: 'f2', label: 'Bucket policy grants local AccountAdmin role permission to delete audit log files', isCorrect: true },
      { id: 'f3', label: 'EnableLogFileValidation is disabled, preventing cryptographic integrity verification', isCorrect: true },
      { id: 'f4', label: 'S3 bucket has cross-origin resource sharing (CORS) enabled', isCorrect: false }
    ],
    rootCauseAnalysis: 'The cloud environment was set up as a single standalone account rather than using AWS Organizations Control Tower with dedicated Security and Log Archive accounts.',
    securityImpact: 'An attacker who compromises the production account administrator credentials can tamper with or delete audit files, erasing all evidence of their presence.',
    businessImpact: 'Failure of SOC 2 Type II audit due to lack of separation of duties; loss of enterprise cyber insurance coverage.',
    remediationPlan: [
      'Immediate: Remove the AllowAdminCleanUp statement from the log bucket policy.',
      'Immediate: Enable Log File Validation on production-trail (enable-log-file-validation: true).',
      'Architecture: Provision a dedicated AWS Log Archive account using AWS Control Tower.',
      'Policy: Configure CloudTrail to write exclusively to the Log Archive account bucket, with S3 Object Lock in Compliance Mode.'
    ],
    awsBestPractices: [
      'Always store CloudTrail logs in a dedicated, isolated Log Archive AWS account.',
      'Always enable CloudTrail Log File Validation for cryptographic SHA-256 digest verification.',
      'Never grant s3:DeleteObject on audit log buckets to any identity.'
    ],
    lessonsLearned: 'Separation of duties is a fundamental security law. Never store your security cameras inside the room the intruders want to rob.'
  },
  {
    id: 'inv-mon-04',
    ticket: 'INC-MON-04',
    category: 'Monitoring & Logging',
    categoryKey: 'monitoring',
    title: 'Alert Fatigue: Missing CloudWatch Metric Filters for High-Severity Events',
    incidentSummary: 'A compromised IAM user created 12 EC2 instances for crypto-mining; the incident went undetected for 9 days because security monitoring lacked actionable metric alarms.',
    businessContext: 'SaaS startup managing AWS costs and security posture. Cloud bills spiked by $18,000 due to unmonitored infrastructure creation.',
    riskLevel: 'High',
    affectedServices: ['Amazon CloudWatch', 'AWS CloudTrail', 'Amazon SNS'],
    evidence: [
      {
        name: 'cloudwatch-metric-filters.json',
        type: 'CloudWatch Metric Filters',
        content: JSON.stringify({
          LogGroupName: '/aws/cloudtrail/production-events',
          MetricFilters: []
        }, null, 2),
        notes: 'Zero CloudWatch Metric Filters configured on the CloudTrail log group. No alarms for Root, IAM changes, or unauthorized API calls.'
      },
      {
        name: 'sns-topic-subscriptions.json',
        type: 'SNS Subscriptions',
        content: JSON.stringify({
          TopicArn: 'arn:aws:sns:us-east-1:123456789012:security-alerts',
          Subscriptions: []
        }, null, 2),
        notes: 'The security alerts SNS topic has zero active subscribers or paging integrations.'
      }
    ],
    investigationTasks: [
      'Audit CloudWatch Logs metric filters against CIS AWS Foundations Benchmark',
      'Verify SNS alert notification subscriptions and on-call routing channels',
      'Deploy metric filters for root usage, console login without MFA, and IAM policy changes',
      'Create CloudWatch alarms with immediate PagerDuty/Slack notification routing'
    ],
    findings: [
      { id: 'f1', label: 'Zero CloudWatch metric filters configured to turn CloudTrail logs into alarms', isCorrect: true },
      { id: 'f2', label: 'Security alert SNS topic has no subscribers or incident response integration', isCorrect: true },
      { id: 'f3', label: 'Failure to detect anomalous EC2 RunInstances spikes across 9 days of attacker activity', isCorrect: true },
      { id: 'f4', label: 'CloudWatch Logs data retention is set to Never Expire', isCorrect: false }
    ],
    rootCauseAnalysis: 'The team ingested CloudTrail logs into CloudWatch Logs for compliance checkmarks but never created metric filters or alarms to notify on-call personnel of anomalous events.',
    securityImpact: 'Attacker maintained persistence for 9 days unchallenged, creating instances and probing internal infrastructure without triggering any alerts.',
    businessImpact: '$18,000 unauthorized compute bill, resource exhaustion causing latency for legitimate customers, and negative audit report.',
    remediationPlan: [
      'Immediate: Deploy CIS Benchmark metric filters for Root account usage, ConsoleLogin without MFA, IAM policy changes, and unauthorized API calls (errorCode = "*UnauthorizedOperation").',
      'Alerting: Subscribe on-call security engineer Slack channels and PagerDuty to the security-alerts SNS topic.',
      'Billing: Deploy AWS Budget alert with notifications configured at 85% and 100% of forecasted monthly spend.',
      'GuardDuty: Enable Amazon GuardDuty to detect automated cryptomining behavior (CryptoCurrency:EC2/BitcoinTool.B).'
    ],
    awsBestPractices: [
      'Implement the CIS AWS Foundations Benchmark Section 3 monitoring controls.',
      'Pair CloudWatch Metric Alarms with Amazon EventBridge and automated incident routing.',
      'Set proactive AWS Budgets alerts to detect runaway infrastructure creation.'
    ],
    lessonsLearned: 'Logs that nobody watches are just expensive noise. Telemetry only protects you if it triggers an automated alarm with an accountable owner.'
  },
  {
    id: 'inv-mon-05',
    ticket: 'INC-MON-05',
    category: 'Monitoring & Logging',
    categoryKey: 'monitoring',
    title: 'Regional Blind Spot: GuardDuty Disabled in Secondary AWS Region',
    incidentSummary: 'An attacker who obtained compromised credentials avoided detection by launching GPU instances in ap-southeast-2 (Sydney) where GuardDuty was disabled.',
    businessContext: 'Global media streaming platform operating primarily in us-east-1 and us-west-2. Secondary regions were unmonitored.',
    riskLevel: 'High',
    affectedServices: ['Amazon GuardDuty', 'AWS Organizations', 'EC2'],
    evidence: [
      {
        name: 'guardduty-detector-status.json',
        type: 'GuardDuty Regional Status',
        content: JSON.stringify({
          Account: '123456789012',
          Regions: [
            { Region: 'us-east-1', Status: 'ENABLED', DetectorId: 'det-09928181282' },
            { Region: 'us-west-2', Status: 'ENABLED', DetectorId: 'det-08821919292' },
            { Region: 'ap-southeast-2', Status: 'DISABLED', DetectorId: null },
            { Region: 'eu-central-1', Status: 'DISABLED', DetectorId: null }
          ]
        }, null, 2),
        notes: 'GuardDuty was only enabled in 2 domestic regions, leaving all other regions unmonitored.'
      },
      {
        name: 'sydney-instances.json',
        type: 'EC2 DescribeInstances (ap-southeast-2)',
        content: JSON.stringify({
          Region: 'ap-southeast-2',
          Instances: [
            {
              InstanceId: 'i-08819201928282',
              InstanceType: 'g5.12xlarge',
              LaunchTime: '2026-09-22T04:12:00Z',
              State: { Name: 'running' }
            }
          ]
        }, null, 2),
        notes: 'High-cost GPU instances running continuously in Sydney for 48 hours without detection.'
      }
    ],
    investigationTasks: [
      'Audit GuardDuty deployment status across all AWS regions',
      'Terminate rogue EC2 instances running in unauthorized secondary regions',
      'Enable Amazon GuardDuty organization-wide across all commercial regions',
      'Implement an SCP restricting instance launches to approved home regions'
    ],
    findings: [
      { id: 'f1', label: 'Amazon GuardDuty disabled in secondary regions (ap-southeast-2, eu-central-1)', isCorrect: true },
      { id: 'f2', label: 'Attacker deliberately operated in unmonitored region to avoid security telemetry detection', isCorrect: true },
      { id: 'f3', label: 'Lack of region-restriction Service Control Policy (SCP) allowing rogue resource deployment', isCorrect: true },
      { id: 'f4', label: 'EC2 instances are using default Amazon Linux 2 AMI', isCorrect: false }
    ],
    rootCauseAnalysis: 'GuardDuty was manually enabled in the AWS console only for regions the team was actively developing in, ignoring the fact that IAM credentials work globally in every AWS region.',
    securityImpact: 'Attacker exploited a regional visibility blind spot to launch expensive GPU mining workloads undetected for several days.',
    businessImpact: '$12,400 in unauthorized compute charges, potential reputation damage if the instances were used to attack third parties.',
    remediationPlan: [
      'Immediate: Terminate the rogue g5.12xlarge instance in ap-southeast-2 and revoke the involved IAM credentials.',
      'Organization: Enable GuardDuty organization-wide across ALL regions from the AWS Organizations delegated administrator account.',
      'Auto-Enable: Turn on "Auto-Enable for all future accounts and regions" in GuardDuty settings.',
      'SCP: Deploy an SCP restricting all ec2:RunInstances API calls to approved regions (us-east-1 and us-west-2).'
    ],
    awsBestPractices: [
      'Always enable security services (GuardDuty, Security Hub, CloudTrail) in ALL AWS regions, not just used regions.',
      'Use an SCP to restrict allowed regions and prevent attackers from deploying workloads in unmonitored regions.',
      'Deploy AWS Security Hub to centralize multi-region findings into a single dashboard.'
    ],
    lessonsLearned: 'IAM credentials are global. An attacker who steals your keys does not care where your website is hosted—they will deploy their attacks wherever your monitoring is weakest.'
  },

  // ==========================================
  // 5. ARCHITECTURE SECURITY (5 Investigations)
  // ==========================================
  {
    id: 'inv-arc-01',
    ticket: 'INC-ARC-01',
    category: 'Architecture Security',
    categoryKey: 'architecture',
    title: 'Startup Architecture: Public Database, Flat Network & Open Admin SSH',
    incidentSummary: 'A security architecture review of an early-stage startup AWS environment uncovered compounding single-point-of-failure vulnerabilities across identity and network perimeters.',
    businessContext: 'High-growth fintech seed startup launching their MVP. Speed was prioritized over security, resulting in critical flaws across all tiers.',
    riskLevel: 'Critical',
    affectedServices: ['Amazon VPC', 'Amazon RDS', 'AWS IAM', 'Amazon EC2'],
    evidence: [
      {
        name: 'architecture-diagram-spec.json',
        type: 'System Architecture Specification',
        content: JSON.stringify({
          Environment: 'seed-startup-prod',
          VPC: { CIDR: '10.0.0.0/16', Subnets: ['10.0.1.0/24 (public-all-workloads)'] },
          Compute: { Type: 'EC2', PublicIP: true, SecurityGroup: 'sg-all-access-0.0.0.0/0' },
          Database: { Type: 'RDS PostgreSQL', PubliclyAccessible: true, SecurityGroup: 'sg-db-open' },
          Identity: { Type: 'Shared-IAM-User-Admin', RootAccessKeys: 'Active' }
        }, null, 2),
        notes: 'Single public subnet housing frontend, backend, database, and admin access with shared root credentials.'
      }
    ],
    investigationTasks: [
      'Identify all public ingress points across compute and database layers',
      'Evaluate lack of network segmentation (all tiers in a single public subnet)',
      'Assess blast radius of shared credentials and open administrative access',
      'Architect a Well-Architected 3-tier VPC redesign with private subnets'
    ],
    findings: [
      { id: 'f1', label: 'Database is publicly accessible with port 5432 open to the internet', isCorrect: true },
      { id: 'f2', label: 'All workloads coexist in a single public subnet with zero network segmentation', isCorrect: true },
      { id: 'f3', label: 'Open SSH port 22 allows brute-force admin access from 0.0.0.0/0', isCorrect: true },
      { id: 'f4', label: 'The VPC is missing IPv6 egress-only internet gateway', isCorrect: false }
    ],
    rootCauseAnalysis: 'Prioritizing release velocity resulted in using default VPC settings and disabling all network isolation boundaries so developers could connect to everything directly from home.',
    securityImpact: 'A single exploit or leaked database password results in total compromise of the company entire infrastructure, databases, and customer records.',
    businessImpact: 'Uninvestable security posture; institutional venture capital investors and enterprise clients will not pass due diligence.',
    remediationPlan: [
      'Phase 1 (Containment): Remove 0.0.0.0/0 ingress on database and SSH security groups; mandate SSM Session Manager.',
      'Phase 2 (Segmentation): Deploy a 3-tier VPC architecture (Public Web, Private App, Isolated Data subnets across 2 Availability Zones).',
      'Phase 3 (Database): Move RDS into isolated subnets with PubliclyAccessible: false and security group chaining from App tier.',
      'Phase 4 (Identity): Deactivate root access keys and migrate developers to AWS IAM Identity Center.'
    ],
    awsBestPractices: [
      'Follow the AWS Well-Architected Framework Security Pillar.',
      'Adopt a 3-tier VPC architecture (Public, Private, Isolated) as the default baseline.',
      'Enforce defense in depth: network segmentation, identity boundaries, and data encryption must all exist simultaneously.'
    ],
    lessonsLearned: 'Architecture flaws compound. A single misconfiguration is bad; a flat network combined with public databases and shared admin keys turns any small mistake into a company-ending disaster.'
  },
  {
    id: 'inv-arc-02',
    ticket: 'INC-ARC-02',
    category: 'Architecture Security',
    categoryKey: 'architecture',
    title: 'Multi-Tenant SaaS: Shared Cross-Tenant IAM Role without Isolation',
    incidentSummary: 'A code review of a multi-tenant B2B SaaS architecture revealed that background worker containers use a shared wildcard IAM role to access customer DynamoDB data.',
    businessContext: 'B2B enterprise HR software storing employee salary and disciplinary records for Fortune 500 enterprise tenants. Strict isolation is legally required.',
    riskLevel: 'Critical',
    affectedServices: ['Amazon DynamoDB', 'AWS IAM', 'Amazon ECS'],
    evidence: [
      {
        name: 'ecs-task-role.json',
        type: 'IAM Policy',
        content: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:Query'],
              Resource: 'arn:aws:dynamodb:us-east-1:123456789012:table/tenant-data-records'
            }
          ]
        }, null, 2),
        notes: 'Task execution role can query all items across the entire table without tenant-level leading key condition restrictions.'
      },
      {
        name: 'dynamodb-schema.json',
        type: 'DynamoDB Table Design',
        content: JSON.stringify({
          TableName: 'tenant-data-records',
          PartitionKey: 'TenantId',
          SortKey: 'RecordId',
          GlobalSecondaryIndexes: []
        }, null, 2),
        notes: 'All tenants co-located in a single table with TenantId as the partition key.'
      }
    ],
    investigationTasks: [
      'Analyze ECS task role policy for cross-tenant data access boundaries',
      'Verify presence of dynamodb:LeadingKeys condition to enforce partition isolation',
      'Assess confused tenant vulnerability where Tenant A queries Tenant B data',
      'Implement STS session tagging and IAM policy conditions for dynamic tenant isolation'
    ],
    findings: [
      { id: 'f1', label: 'Shared ECS task role has wildcard access to all tenant records in the DynamoDB table', isCorrect: true },
      { id: 'f2', label: 'Lack of dynamodb:LeadingKeys IAM condition permits cross-tenant data access in application code', isCorrect: true },
      { id: 'f3', label: 'An application bug or SQL/NoSQL injection can leak one tenant data to another tenant', isCorrect: true },
      { id: 'f4', label: 'DynamoDB table has Point-in-Time Recovery enabled', isCorrect: false }
    ],
    rootCauseAnalysis: 'The architecture team relied solely on application-level filtering (WHERE tenant_id = req.user.tenantId) without implementing defense in depth at the AWS IAM infrastructure layer.',
    securityImpact: 'An application vulnerability (such as IDOR or broken object level authorization) allows any tenant to access, modify, or delete another tenant confidential HR records.',
    businessImpact: 'Breach of strict multi-tenant customer confidentiality covenants, breach disclosure, and catastrophic loss of enterprise trust.',
    remediationPlan: [
      'Immediate: Implement dynamic session policies using AWS STS AssumeRole with policy conditions restricting dynamodb:LeadingKeys to ${aws:PrincipalTag/TenantId}.',
      'Architecture: Migrate to AWS SaaS Factory Token-Vending Machine pattern for ephemeral, tenant-scoped credentials.',
      'Verification: Add automated integration tests that attempt cross-tenant queries and verify access rejection at the AWS IAM API level.'
    ],
    awsBestPractices: [
      'In multi-tenant SaaS, never rely solely on application code for tenant isolation; enforce it at the AWS policy layer.',
      'Use DynamoDB fine-grained access control with dynamodb:LeadingKeys conditions.',
      'Leverage AWS STS session tags to pass tenant identity into runtime IAM evaluation.'
    ],
    lessonsLearned: 'Application-level tenant checks will eventually fail due to human error. IAM fine-grained access control provides an un-bypassable cryptographic boundary around tenant data.'
  },
  {
    id: 'inv-arc-03',
    ticket: 'INC-ARC-03',
    category: 'Architecture Security',
    categoryKey: 'architecture',
    title: 'Public Serverless Function URL Lacking Auth & WAF Throttling',
    incidentSummary: 'An automated billing alert was triggered when a Lambda function processing heavy PDF image conversions was called 4.2 million times in 6 hours by an external botnet.',
    businessContext: 'Document conversion microservice. Serverless architectures can incur unbounded cloud costs and denial of wallet attacks if unthrottled.',
    riskLevel: 'High',
    affectedServices: ['AWS Lambda', 'AWS WAF', 'AWS IAM'],
    evidence: [
      {
        name: 'lambda-function-url-config.json',
        type: 'Lambda Function URL',
        content: JSON.stringify({
          FunctionName: 'pdf-ocr-converter',
          FunctionUrl: 'https://3a88c7f99120cafe.lambda-url.us-east-1.on.aws/',
          AuthType: 'NONE',
          Cors: { AllowOrigins: ['*'], AllowMethods: ['POST'] }
        }, null, 2),
        notes: 'Public Lambda Function URL configured with AuthType: NONE and wildcard CORS.'
      },
      {
        name: 'lambda-concurrency-settings.json',
        type: 'Lambda Concurrency',
        content: JSON.stringify({
          ReservedConcurrentExecutions: null,
          ProvisionedConcurrentExecutions: null
        }, null, 2),
        notes: 'No reserved concurrency limits set. The function can consume the entire account concurrency pool (1,000 executions).'
      }
    ],
    investigationTasks: [
      'Examine Lambda Function URL authentication type and CORS configuration',
      'Inspect concurrency quotas to identify potential Denial of Wallet (DoW) risk',
      'Check if AWS WAF is attached to the function endpoint',
      'Rearchitect endpoint behind Amazon API Gateway with Cognito/IAM auth and WAF rate limits'
    ],
    findings: [
      { id: 'f1', label: 'Lambda Function URL uses AuthType: NONE, allowing unauthenticated public invocation', isCorrect: true },
      { id: 'f2', label: 'No AWS WAF rate-limiting rules attached to prevent abusive DDoS traffic', isCorrect: true },
      { id: 'f3', label: 'Unreserved concurrency allows runaway billing and starvation of other account Lambdas', isCorrect: true },
      { id: 'f4', label: 'Function memory allocation is set to 2048 MB', isCorrect: false }
    ],
    rootCauseAnalysis: 'Developers chose Lambda Function URLs to bypass API Gateway costs and setup complexity without realizing Function URLs with AuthType: NONE lack native rate limiting or WAF integration.',
    securityImpact: 'Public endpoints allow external attackers to trigger infinite compute cycles, exhausting account concurrency and taking down other internal serverless microservices.',
    businessImpact: '$9,200 surprise AWS billing surge, denial of service for legitimate users, and degradation of payment processing queues.',
    remediationPlan: [
      'Immediate: Delete the public Function URL or change AuthType to AWS_IAM.',
      'Immediate: Set a Reserved Concurrency limit of 50 on the function to cap maximum simultaneous execution costs.',
      'Architecture: Route the workload through Amazon API Gateway with an attached AWS WAF WebACL enforcing rate limiting (e.g. max 100 requests per IP per 5 minutes).',
      'Authentication: Require JSON Web Token (JWT) verification via Amazon Cognito or API Gateway Lambda authorizer.'
    ],
    awsBestPractices: [
      'Never expose compute-heavy Lambda functions via unauthenticated Function URLs.',
      'Use Amazon API Gateway with AWS WAF for public HTTP endpoints.',
      'Always set Reserved Concurrency limits on asynchronous worker Lambdas to prevent account-wide resource exhaustion.'
    ],
    lessonsLearned: 'Serverless scales infinitely, but so does your bill. An unauthenticated serverless endpoint is a blank check written to whoever finds the URL.'
  },
  {
    id: 'inv-arc-04',
    ticket: 'INC-ARC-04',
    category: 'Architecture Security',
    categoryKey: 'architecture',
    title: 'Kubernetes/EKS: Public Control Plane & Over-Privileged Node IAM Profile',
    incidentSummary: 'A compromised container pod running on an Amazon EKS cluster stole the EC2 node instance metadata credentials and used them to create unauthorized IAM roles.',
    businessContext: 'Production microservices cluster hosting customer web applications and order processing backends.',
    riskLevel: 'Critical',
    affectedServices: ['Amazon EKS', 'Amazon EC2', 'AWS IAM'],
    evidence: [
      {
        name: 'eks-cluster-endpoint.json',
        type: 'EKS Cluster Networking',
        content: JSON.stringify({
          ClusterName: 'prod-microservices-cluster',
          ResourcesVpcConfig: {
            EndpointPublicAccess: true,
            PublicAccessCidrs: ['0.0.0.0/0'],
            EndpointPrivateAccess: false
          }
        }, null, 2),
        notes: 'Kubernetes API server control plane endpoint is open to the public internet.'
      },
      {
        name: 'node-instance-profile-policy.json',
        type: 'IAM Node Role Policy',
        content: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: ['iam:*', 'ec2:*', 's3:*'],
              Resource: '*'
            }
          ]
        }, null, 2),
        notes: 'Worker nodes are assigned near-administrator IAM permissions instead of using IAM Roles for Service Accounts (IRSA).'
      }
    ],
    investigationTasks: [
      'Examine EKS cluster API server endpoint access configuration',
      'Audit EC2 node instance profile IAM role permissions for wildcard actions',
      'Assess IMDSv2 configuration and pod metadata isolation boundaries',
      'Migrate pod IAM access to IAM Roles for Service Accounts (IRSA)'
    ],
    findings: [
      { id: 'f1', label: 'Kubernetes control plane API server is publicly reachable from 0.0.0.0/0', isCorrect: true },
      { id: 'f2', label: 'EKS worker node IAM instance profile has dangerous wildcard permissions (iam:*, ec2:*, s3:*)', isCorrect: true },
      { id: 'f3', label: 'Lack of IAM Roles for Service Accounts (IRSA) allows any container pod to steal host credentials', isCorrect: true },
      { id: 'f4', label: 'EKS cluster is running Kubernetes version 1.28', isCorrect: false }
    ],
    rootCauseAnalysis: 'The node group was created with a broad administrator policy for convenience, and pods had unrestricted access to the EC2 Instance Metadata Service (IMDS).',
    securityImpact: 'A single compromised container application escapes pod boundaries and inherits full account administrative privileges via host instance metadata.',
    businessImpact: 'Complete account compromise, supply chain tampering, data theft, and immediate loss of container security compliance certification.',
    remediationPlan: [
      'Immediate: Strip iam:* and administrative policies from the worker node IAM role; restrict it strictly to AmazonEKSWorkerNodePolicy and AmazonEC2ContainerRegistryReadOnly.',
      'Architecture: Enable IAM Roles for Service Accounts (IRSA) with OIDC federation so each pod receives its own temporary, least-privilege role.',
      'IMDSv2: Enforce IMDSv2 with http-put-response-hop-limit: 1 to block container pods from accessing the node metadata endpoint.',
      'Control Plane: Set EKS EndpointPublicAccess to false (or restrict to corporate VPN CIDRs) and enable EndpointPrivateAccess.'
    ],
    awsBestPractices: [
      'Never grant application or management permissions to the EKS worker node instance profile.',
      'Always use IAM Roles for Service Accounts (IRSA) or EKS Pod Identity.',
      'Set EC2 IMDSv2 hop limit to 1 to prevent containerized workloads from querying host credentials.'
    ],
    lessonsLearned: 'In Kubernetes on AWS, if you give the node an admin role, you gave every single pod on that node an admin role. Always use pod-level IAM.'
  },
  {
    id: 'inv-arc-05',
    ticket: 'INC-ARC-05',
    category: 'Architecture Security',
    categoryKey: 'architecture',
    title: 'Disaster Recovery Failure: Backups in Same Blast Radius Lacking Immutability',
    incidentSummary: 'During an incident simulation exercise, the recovery team discovered that production database automated snapshots are stored in the same AWS account without encryption or cross-region replication.',
    businessContext: 'Online retail banking transaction record system. Must maintain verifiable Recovery Point Objective (RPO) < 15 minutes and Recovery Time Objective (RTO) < 2 hours.',
    riskLevel: 'Critical',
    affectedServices: ['AWS Backup', 'Amazon RDS', 'AWS Organizations'],
    evidence: [
      {
        name: 'backup-vault-configuration.json',
        type: 'AWS Backup Vault Details',
        content: JSON.stringify({
          BackupVaultName: 'Default',
          BackupVaultArn: 'arn:aws:backup:us-east-1:123456789012:backup-vault:Default',
          LockState: null,
          MinRetentionDays: null,
          MaxRetentionDays: null
        }, null, 2),
        notes: 'Backup vault lacks AWS Backup Vault Lock; backups can be deleted at any time.'
      },
      {
        name: 'backup-plan.json',
        type: 'AWS Backup Plan',
        content: JSON.stringify({
          BackupPlanName: 'prod-daily-backup',
          Rules: [
            {
              RuleName: 'daily-snapshot',
              TargetBackupVaultName: 'Default',
              ScheduleExpression: 'cron(0 5 ? * * *)',
              CopyActions: []
            }
          ]
        }, null, 2),
        notes: 'CopyActions is empty. Zero cross-region or cross-account replication configured.'
      }
    ],
    investigationTasks: [
      'Analyze AWS Backup vault settings for immutable Vault Lock enforcement',
      'Verify if snapshots are replicated across accounts or regions',
      'Assess blast radius if production AWS account credentials are compromised',
      'Architect an air-gapped cross-account disaster recovery pipeline'
    ],
    findings: [
      { id: 'f1', label: 'Backup vault lacks AWS Backup Vault Lock, permitting malicious or accidental deletion', isCorrect: true },
      { id: 'f2', label: 'Zero cross-account or cross-region backup replication (same blast radius as workloads)', isCorrect: true },
      { id: 'f3', label: 'An account takeover allows an attacker to simultaneously delete production data and all backups', isCorrect: true },
      { id: 'f4', label: 'Snapshots are taken daily instead of weekly', isCorrect: false }
    ],
    rootCauseAnalysis: 'The team relied on default in-account backups without considering ransomware scenarios where attackers delete snapshots before deploying encryption.',
    securityImpact: 'A single compromised admin credential or destructive insider attack leaves the company with zero operational recovery paths and permanent data loss.',
    businessImpact: 'Permanent business failure; inability to recover ledger records will trigger corporate dissolution and regulatory liquidation.',
    remediationPlan: [
      'Immediate: Configure AWS Backup Vault Lock in Compliance Mode with minimum retention lock.',
      'Architecture: Provision a dedicated, isolated Disaster Recovery AWS account within AWS Organizations.',
      'Replication: Configure AWS Backup copy actions to replicate encrypted snapshots to the DR account automatically.',
      'Access: Ensure no administrators in the production account have IAM permissions in the DR account.'
    ],
    awsBestPractices: [
      'Always replicate critical backups to an isolated, separate AWS account (air-gapped DR).',
      'Use AWS Backup Vault Lock in Compliance mode to create non-deletable WORM backups.',
      'Regularly conduct automated restore drills to test real RTO and RPO metrics.'
    ],
    lessonsLearned: 'Backups stored in the same account as production are not backups—they are just copies waiting to be deleted in the same attack.'
  }
]

export const investigations = rawInvestigations.map(inv => ({
  ...inv,
  ...(investigationDetails[inv.id] || {})
}))

export default investigations

