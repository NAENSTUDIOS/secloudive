// IAM Question Bank: 30 High-Yield Cloud Security Questions
// Classified into Beginner, Intermediate, Advanced, and Engineer Level

export const iamQuestionBank = [
  {
    id: 'iam-q01',
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
    correctAnswer: 'Roles issue temporary security credentials via STS with automatic rotation, eliminating static secret exposure.',
    explanation: 'IAM Roles utilize AWS STS to provision short-lived temporary credentials (starting with ASIA) that rotate automatically through the EC2 metadata service, removing the danger of leaked static secrets.',
    engineerReasoning: 'Static keys in application configs or code are the #1 source of public cloud breaches. IAM Roles replace hardcoded credentials with time-bounded, non-exportable tokens.',
    businessImpact: 'Leaked static credentials can remain active undetected for months, incurring massive compute fraud or regulatory fines.',
    awsBestPractice: 'Enforce IMDSv2 and attach IAM instance profiles to EC2 instead of ever generating long-lived IAM user keys for machine workloads.'
  },
  {
    id: 'iam-q02',
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
    correctAnswer: 'Least Privilege, because `iam:*` allows the engineer to create new administrative credentials and escalate privilege across the entire account.',
    explanation: 'Granting `iam:*` provides full administrative control over identity. Even in staging, a compromised identity with `iam:CreateAccessKey` or `iam:AttachRolePolicy` can escalate to AdministratorAccess and establish hidden backdoors.',
    engineerReasoning: 'Permission escalation paths frequently start with loose IAM permissions in non-production accounts that connect to shared resources or enterprise networks.',
    businessImpact: 'Privilege escalation enables attackers to seize full control of cloud resources, destroy backups, or pivot into production networks.',
    awsBestPractice: 'Use AWS IAM Access Analyzer and CloudTrail to identify the exact API calls required and enforce granular, resource-specific permissions.'
  },
  {
    id: 'iam-q03',
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
    correctAnswer: 'The request is DENIED because the bucket policy explicit Deny takes precedence over any explicit Allow.',
    explanation: 'In AWS IAM policy evaluation logic, an Explicit Deny ALWAYS overrides any number of Explicit Allows, regardless of whether the allow is on the user, group, or resource.',
    engineerReasoning: 'Understanding that Deny trumps Allow is vital when designing perimeter guardrails and network IP restrictions.',
    businessImpact: 'Misunderstanding policy precedence leads either to unintended public data leakage or breaking critical production pipelines.',
    awsBestPractice: 'Use Explicit Deny in resource policies to enforce baseline network perimeter boundaries (such as corporate CIDR or VPC endpoint requirements).'
  },
  {
    id: 'iam-q04',
    difficulty: 'Advanced',
    category: 'Cross-Account & Confused Deputy',
    topicId: 'cross-account',
    topicTitle: 'Cross Account Access',
    question: 'A SaaS security auditing vendor requests an IAM Role in your AWS account so their automated scanner can inspect your configuration. Which parameter MUST you mandate in the role trust policy to protect against the Confused Deputy vulnerability?',
    options: [
      'An `aws:SourceVpc` condition matching the vendor VPC ID.',
      'A unique, secret `sts:ExternalId` condition supplied by you to the vendor.',
      'A `Principal: "*"` entry combined with an AWS WAF rate limit.',
      'An explicit deny on `kms:Decrypt`.'
    ],
    correctAnswer: 'A unique, secret `sts:ExternalId` condition supplied by you to the vendor.',
    explanation: 'The `sts:ExternalId` condition ensures that another customer of the SaaS vendor cannot trick the vendor into assuming your IAM role to exfiltrate your AWS telemetry (the classic Confused Deputy attack).',
    engineerReasoning: 'When allowing a 3rd party service to assume an IAM role in your account, `sts:ExternalId` is non-negotiable to maintain cryptographic separation between multi-tenant customers.',
    businessImpact: 'Without ExternalId, any rogue customer of the same 3rd-party SaaS platform could view and extract sensitive resources from your AWS account.',
    awsBestPractice: 'Always require `sts:ExternalId` in cross-account trust policies for 3rd-party vendor integrations.'
  },
  {
    id: 'iam-q05',
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
    correctAnswer: 'Only for break-glass emergency recovery, changing account contact/billing details, or closing the account.',
    explanation: 'The Root user has unrestricted access to all account resources that cannot be revoked by IAM policies. AWS Well-Architected strictly forbids day-to-day use of the Root account.',
    engineerReasoning: 'Zero access keys should ever exist for Root. Multi-Factor Authentication (hardware FIDO token) must be enabled, with credentials stored in an enterprise physical vault.',
    businessImpact: 'A compromised Root user results in complete account takeover, hostage ransomware, or unrecoverable deletion of all cloud infrastructure.',
    awsBestPractice: 'Lock away root credentials, remove all root access keys, enforce hardware MFA, and create IAM Identity Center (SSO) administrator roles.'
  },
  {
    id: 'iam-q06',
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
    correctAnswer: 'IAM Permissions Boundary attached to the developer identity or mandated on all newly created roles.',
    explanation: 'An IAM Permissions Boundary sets the maximum permissions an identity or newly created role can possess. Even if the developer creates a role with `AdministratorAccess`, the effective permissions will never exceed the boundary.',
    engineerReasoning: 'Permissions boundaries solve the delegated administration problem in enterprise organizations without creating a bottleneck on the central security team.',
    businessImpact: 'Without boundaries, developers delegated `iam:CreateRole` can grant themselves full admin permissions and bypass all security reviews.',
    awsBestPractice: 'Combine `iam:PermissionsBoundary` with an SCP or IAM condition that prevents developers from modifying the boundary policy or creating roles without it.'
  },
  {
    id: 'iam-q07',
    difficulty: 'Engineer Level',
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
    correctAnswer: 'Attach an inline policy to the role with an explicit Deny on all actions where `aws:TokenIssueTime` is earlier than the incident containment timestamp.',
    explanation: 'Because STS tokens are cryptographically signed, they remain valid until expiration unless an explicit Deny policy with the `aws:TokenIssueTime` condition is attached to the role, invalidating all previously issued tokens instantly.',
    engineerReasoning: 'Deleting and recreating the role breaks trust relationships and doesn’t immediately stop tokens cached by the attacker in all scenarios.',
    businessImpact: 'Failing to revoke temporary tokens allows an adversary to continue exfiltrating data for up to 12 hours after detection.',
    awsBestPractice: 'Use the AWS IAM Console "Revoke Active Sessions" button or deploy a policy with `DateLessThan: { "aws:TokenIssueTime": "YYYY-MM-DDTHH:MM:SSZ" }`.'
  },
  {
    id: 'iam-q08',
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
    correctAnswer: '`aws:MultiFactorAuthPresent: "true"`',
    explanation: '`aws:MultiFactorAuthPresent: "true"` tests whether the credentials used to make the request were authenticated with an active MFA device.',
    engineerReasoning: 'Enforcing MFA at the policy condition level guarantees that even if a session credential is stolen, high-risk APIs (e.g. `iam:Delete*`, `s3:DeleteBucket`) cannot be executed without re-prompting.',
    businessImpact: 'Stolen passwords or phishing compromises without MFA enforcement lead to immediate full account takeovers.',
    awsBestPractice: 'Enforce MFA across all interactive human users and mandate MFA in IAM policies for destructive actions.'
  },
  {
    id: 'iam-q09',
    difficulty: 'Engineer Level',
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
    correctAnswer: 'Reject static keys; configure OIDC (OpenID Connect) federation so GitHub Actions assumes an IAM Role via STS temporary credentials without storing any static secrets.',
    explanation: 'OIDC federation allows GitHub Actions to exchange an ephemeral OIDC JWT token for short-lived AWS STS credentials, completely eliminating the risk of stored static credentials leaking from repository secrets.',
    engineerReasoning: 'Long-term keys in CI/CD secrets frequently leak through build logs, compromised dependencies, or compromised dev accounts.',
    businessImpact: 'Static CI/CD keys are among the most common vectors in public cloud breaches and software supply-chain attacks.',
    awsBestPractice: 'Always use OIDC federation with specific branch and repository condition checks (`repo:org/repo:ref:refs/heads/main`) for CI/CD deployments.'
  },
  {
    id: 'iam-q10',
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
    correctAnswer: 'Because if the application is compromised via SSRF or RCE, the attacker has permission to list, delete, and exfiltrate data from ALL existing and future S3 buckets across the account.',
    explanation: 'Wildcard actions on wildcard resources violate least privilege and expand the blast radius to every bucket in the account. An attacker who compromises the application gains carte blanche over all data assets.',
    engineerReasoning: 'Security engineers constrain roles to specific bucket ARNs and specific actions (`s3:GetObject`, `s3:PutObject`) rather than broad wildcards.',
    businessImpact: 'A single web application flaw turns into a catastrophic company-wide data breach compromising confidential customer databases.',
    awsBestPractice: 'Scope resource ARNs strictly to `arn:aws:s3:::specific-bucket-name/*` and use AWS IAM Access Analyzer to detect overly permissive policies.'
  },
  {
    id: 'iam-q11',
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
    correctAnswer: 'The launch is blocked because SCPs define the maximum allowable permissions for all accounts in the OU, and an SCP Deny cannot be overridden by local administrators.',
    explanation: 'SCPs are organization-level guardrails that filter the maximum available permissions for member accounts. Local administrators (even with AdministratorAccess) cannot override an SCP Deny.',
    engineerReasoning: 'SCPs provide guardrail enforcement that prevents developer teams or compromised local credentials from bypassing fundamental organization policies.',
    businessImpact: 'Without SCPs, compromised credentials in any single account can spin up unauthorized expensive compute or disable logging across regions.',
    awsBestPractice: 'Use SCPs to enforce non-negotiable boundaries, such as disabling unapproved regions, protecting CloudTrail, and blocking root user activity.'
  },
  {
    id: 'iam-q12',
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
    correctAnswer: '`ASIA...` (e.g., ASIAIOSFODNN7EXAMPLE)',
    explanation: 'Temporary security credentials generated by AWS STS start with the prefix `ASIA`. Long-term static IAM user keys start with `AKIA`.',
    engineerReasoning: 'Recognizing credential prefixes is critical during triage. If you see an `AKIA` key in a Git repo, it will remain active forever until rotated; an `ASIA` key will expire shortly but indicates an active role was assumed.',
    businessImpact: 'Failing to distinguish between static and temporary keys leads to ineffective containment during security incidents.',
    awsBestPractice: 'Never commit AWS keys to version control; implement git pre-commit secret scanners (e.g. git-secrets, trufflehog) across all engineering repos.'
  },
  {
    id: 'iam-q13',
    difficulty: 'Engineer Level',
    category: 'IMDSv2 & SSRF Defense',
    topicId: 'users-vs-roles',
    topicTitle: 'Users vs Roles',
    question: 'How does configuring `HttpTokens: required` (IMDSv2) on an EC2 instance mitigate Server-Side Request Forgery (SSRF) credential theft compared to IMDSv1?',
    options: [
      'It encrypts all local hard drives using AES-256.',
      'It mandates a session-oriented `PUT` request with an `X-aws-ec2-metadata-token-ttl-seconds` header to obtain a session token before metadata can be read, which simple SSRF URL injection payloads cannot forge.',
      'It prevents the instance from communicating over IPv6.',
      'It forces all EC2 instances to require MFA before launching.'
    ],
    correctAnswer: 'It mandates a session-oriented `PUT` request with an `X-aws-ec2-metadata-token-ttl-seconds` header to obtain a session token before metadata can be read, which simple SSRF URL injection payloads cannot forge.',
    explanation: 'IMDSv1 allows simple `GET` requests to retrieve role credentials, making it trivial for an SSRF vulnerability to fetch STS keys. IMDSv2 requires a `PUT` request with special headers to get a token, blocking standard HTTP GET-based SSRF vectors.',
    engineerReasoning: 'IMDSv2 is the primary architectural defense against metadata credential theft in modern cloud environments.',
    businessImpact: 'The Capital One breach was caused by an SSRF flaw reading IMDSv1 credentials. Enforcing IMDSv2 neutralizes this exact attack class.',
    awsBestPractice: 'Set `HttpTokens: required` and configure SCPs to block launching EC2 instances with IMDSv1 enabled.'
  },
  {
    id: 'iam-q14',
    difficulty: 'Intermediate',
    category: 'Policy Evaluation',
    topicId: 'policies-deep-dive',
    topicTitle: 'Policies',
    question: 'What is the default authorization posture in AWS IAM when no policy explicitly allows or denies an API action?',
    options: [
      'Explicit Allow',
      'Implicit Deny (Default Deny)',
      'Prompt for Root Password',
      'Forward to Security Operations'
    ],
    correctAnswer: 'Implicit Deny (Default Deny)',
    explanation: 'AWS IAM starts with an implicit deny by default: all requests are denied unless an applicable policy explicitly allows the action.',
    engineerReasoning: 'Default deny is a cornerstone of zero trust; access must be explicitly earned and scoped rather than assumed.',
    businessImpact: 'Misunderstanding default deny can lead administrators to add broad allow wildcards when debugging authorization failures.',
    awsBestPractice: 'Rely on implicit deny for baseline protection and grant explicit permissions surgically.'
  },
  {
    id: 'iam-q15',
    difficulty: 'Advanced',
    category: 'Permission Boundaries',
    topicId: 'permission-boundaries',
    topicTitle: 'Permission Boundaries',
    question: 'An IAM Role has an attached Identity Policy granting `s3:*` and `ec2:*`. However, its Permissions Boundary policy only allows `s3:GetObject` and `s3:PutObject`. What are the effective permissions of the role?',
    options: [
      '`s3:*` and `ec2:*` (Identity policy overrides boundaries).',
      '`s3:GetObject` and `s3:PutObject` only (Effective permissions are the intersection of the identity policy and the permissions boundary).',
      'Zero permissions because the policies conflict.',
      '`ec2:*` only.'
    ],
    correctAnswer: '`s3:GetObject` and `s3:PutObject` only (Effective permissions are the intersection of the identity policy and the permissions boundary).',
    explanation: 'The effective permissions of a principal with a permission boundary are the INTERSECTION of what is allowed in the identity-based policy AND what is allowed in the boundary.',
    engineerReasoning: 'Boundaries serve as guardrails. Actions not included in the boundary are implicitly denied regardless of what the role’s identity policy allows.',
    businessImpact: 'Permissions boundaries prevent privilege escalation by junior engineers or compromised deployment automation.',
    awsBestPractice: 'Use IAM permission boundaries to safely delegate IAM role creation to DevOps teams.'
  },
  {
    id: 'iam-q16',
    difficulty: 'Engineer Level',
    category: 'PassRole & Privilege Escalation',
    topicId: 'least-privilege',
    topicTitle: 'Least Privilege',
    question: 'Why is granting `iam:PassRole` combined with `ec2:RunInstances` without a resource constraint considered a high-risk privilege escalation vector?',
    options: [
      'Because `iam:PassRole` deletes the IAM role after passing it.',
      'Because a user can launch an EC2 instance, pass an existing highly privileged administrative role to it, and then log into the instance to execute admin commands via the instance profile credentials.',
      'Because `ec2:RunInstances` requires root access.',
      'Because AWS charges double for passed roles.'
    ],
    correctAnswer: 'Because a user can launch an EC2 instance, pass an existing highly privileged administrative role to it, and then log into the instance to execute admin commands via the instance profile credentials.',
    explanation: '`iam:PassRole` allows a principal to assign an IAM role to an AWS service. If unrestricted, an attacker with low privileges can pass the `AdministratorAccess` role to a new instance and harvest the credentials.',
    engineerReasoning: 'Always constrain `iam:PassRole` with `Resource: "arn:aws:iam::account:role/specific-workload-role"` and restrict which services can receive it.',
    businessImpact: 'Unconstrained PassRole allows low-privilege developers or compromised service accounts to escalate directly to account administrators.',
    awsBestPractice: 'Never grant `iam:PassRole` on `Resource: "*"`; always restrict the resource ARN to specifically approved roles.'
  },
  {
    id: 'iam-q17',
    difficulty: 'Beginner',
    category: 'MFA Enforcement',
    topicId: 'mfa-enforcement',
    topicTitle: 'MFA',
    question: 'Which of the following is considered the most secure MFA device type for protecting the AWS Account Root User?',
    options: [
      'SMS text message to a mobile phone',
      'FIDO2 / WebAuthn Hardware Security Key (e.g., YubiKey)',
      'Virtual Authenticator app on a shared company laptop',
      'Email verification link'
    ],
    correctAnswer: 'FIDO2 / WebAuthn Hardware Security Key (e.g., YubiKey)',
    explanation: 'Hardware security keys (FIDO2/WebAuthn) provide phishing-resistant authentication that cannot be intercepted by SIM swapping (SMS) or stolen via software malware.',
    engineerReasoning: 'SMS MFA is vulnerable to SIM-swap attacks and SS7 interception. Hardware security keys offer the strongest cryptographic assurance.',
    businessImpact: 'SIM-swap compromises have led to catastrophic crypto and cloud account takeovers.',
    awsBestPractice: 'Enforce hardware FIDO2 security keys for the AWS Account Root User and all privileged security administrators.'
  },
  {
    id: 'iam-q18',
    difficulty: 'Intermediate',
    category: 'Access Analyzer',
    topicId: 'least-privilege',
    topicTitle: 'Least Privilege',
    question: 'What is the primary function of AWS IAM Access Analyzer?',
    options: [
      'To automatically reset user passwords every 90 days.',
      'To analyze resource-based policies using mathematical logic (automated reasoning) to identify resources shared with external principals outside your zone of trust.',
      'To scan EC2 instances for operating system viruses.',
      'To calculate monthly AWS cloud bills.'
    ],
    correctAnswer: 'To analyze resource-based policies using mathematical logic (automated reasoning) to identify resources shared with external principals outside your zone of trust.',
    explanation: 'IAM Access Analyzer evaluates resource policies (S3, KMS, IAM Roles, SQS, Secrets Manager) using automated reasoning to detect any unintended public or cross-account access.',
    engineerReasoning: 'Access Analyzer continuously scans your policies to flag resources that have accidentally been made public or shared with external accounts.',
    businessImpact: 'Catches accidental public bucket exposures or open role trust policies before adversaries exploit them.',
    awsBestPractice: 'Enable IAM Access Analyzer in all active regions and treat findings as high-priority security defects.'
  },
  {
    id: 'iam-q19',
    difficulty: 'Advanced',
    category: 'Condition Keys',
    topicId: 'policies-deep-dive',
    topicTitle: 'Policies',
    question: 'An enterprise wants to ensure that internal developers can only access AWS resources if they are connected through the corporate VPN. Which condition key should be used in the IAM policy?',
    options: [
      '`aws:SourceIp` (e.g., `aws:SourceIp: "198.51.100.0/24"`)',
      '`aws:PrincipalType: "VPN"`',
      '`aws:MultiFactorAuthPresent: "true"`',
      '`aws:SecureTransport: "false"`'
    ],
    correctAnswer: '`aws:SourceIp` (e.g., `aws:SourceIp: "198.51.100.0/24"`)',
    explanation: 'The `aws:SourceIp` condition key evaluates the public IP address from which the API call originated, allowing access to be restricted strictly to corporate egress CIDR blocks.',
    engineerReasoning: 'Restricting source IPs prevents stolen credentials from being exercised from arbitrary attacker infrastructure outside corporate networks.',
    businessImpact: 'If a credential leaks, the attacker cannot execute API calls unless they also possess a foothold inside the corporate VPN.',
    awsBestPractice: 'Use `aws:SourceIp` with caution when services call other services on your behalf, or use `aws:ViaAWSService` exceptions.'
  },
  {
    id: 'iam-q20',
    difficulty: 'Engineer Level',
    category: 'ABAC vs RBAC',
    topicId: 'iam-best-practices',
    topicTitle: 'IAM Best Practices',
    question: 'What is the primary operational and security advantage of Attribute-Based Access Control (ABAC) over traditional Role-Based Access Control (RBAC) in large-scale cloud environments?',
    options: [
      'ABAC eliminates the need for IAM policies entirely.',
      'ABAC scales seamlessly by using resource and principal tags (e.g., `aws:PrincipalTag/Department = aws:ResourceTag/Department`), eliminating the need to write new individual IAM policies every time new resources or teams are added.',
      'ABAC provides free AWS KMS encryption.',
      'ABAC allows anonymous users to access databases.'
    ],
    correctAnswer: 'ABAC scales seamlessly by using resource and principal tags (e.g., `aws:PrincipalTag/Department = aws:ResourceTag/Department`), eliminating the need to write new individual IAM policies every time new resources or teams are added.',
    explanation: 'In ABAC, permissions are granted dynamically based on matching tags between the user and the resource. As teams scale, new resources with matching tags are protected automatically without policy updates.',
    engineerReasoning: 'RBAC leads to role explosion (hundreds of custom roles for every project). ABAC collapses this into a single policy that evaluates tags dynamically.',
    businessImpact: 'Reduces IAM policy maintenance overhead by 90% and prevents policy drift in high-growth enterprises.',
    awsBestPractice: 'Implement ABAC with standardized tag enforcement via AWS Organizations tag policies.'
  },
  {
    id: 'iam-q21',
    difficulty: 'Beginner',
    category: 'Credential Hygiene',
    topicId: 'iam-fundamentals',
    topicTitle: 'IAM Fundamentals',
    question: 'How often should inactive or stale IAM access keys be audited and removed in a secure cloud environment?',
    options: [
      'Never; access keys do not expire.',
      'Continuously / every 90 days or fewer, using AWS IAM Credential Reports and automated key rotation tools.',
      'Once every 5 years.',
      'Only after an active breach occurs.'
    ],
    correctAnswer: 'Continuously / every 90 days or fewer, using AWS IAM Credential Reports and automated key rotation tools.',
    explanation: 'CIS Benchmarks and compliance standards (SOC 2, PCI-DSS) require rotating or deactivating keys that have not been used for 90 days or more.',
    engineerReasoning: 'Stale, forgotten access keys are prime targets for credential harvesting because no one monitors them.',
    businessImpact: 'Unrotated keys increase the window of vulnerability if a developer committed the key to a backup or historical commit.',
    awsBestPractice: 'Generate the IAM Credential Report weekly and automate deletion of keys inactive for 90+ days.'
  },
  {
    id: 'iam-q22',
    difficulty: 'Intermediate',
    category: 'Role Trust Policies',
    topicId: 'users-vs-roles',
    topicTitle: 'Users vs Roles',
    question: 'What is the critical difference between an IAM Role’s "Trust Policy" and its "Permissions Policy"?',
    options: [
      'Trust Policies define billing; Permissions Policies define encryption.',
      'The Trust Policy defines WHO is allowed to assume the role (the principal); the Permissions Policy defines WHAT actions the principal can perform once the role is assumed.',
      'Trust Policies apply only to human users; Permissions Policies apply only to EC2.',
      'There is no difference; they are identical documents.'
    ],
    correctAnswer: 'The Trust Policy defines WHO is allowed to assume the role (the principal); the Permissions Policy defines WHAT actions the principal can perform once the role is assumed.',
    explanation: 'A Trust Policy (AssumeRolePolicyDocument) governs the entry door: which AWS service or account can assume the role. The Permissions Policy governs the interior: what AWS APIs can be invoked.',
    engineerReasoning: 'Beginners frequently confuse these two policies, accidentally adding permissions to trust policies or opening trust policies to `Principal: "*"` without realization.',
    businessImpact: 'An open trust policy allows external attackers to assume the role and inherit all of its permissions.',
    awsBestPractice: 'Audit trust policies regularly and never use `Principal: "*"` without strict `Condition` blocks.'
  },
  {
    id: 'iam-q23',
    difficulty: 'Advanced',
    category: 'NotPrincipal Vulnerability',
    topicId: 'policies-deep-dive',
    topicTitle: 'Policies',
    question: 'Why does AWS strongly advise against using `"Effect": "Allow"` with `"NotPrincipal"` in resource-based policies?',
    options: [
      'Because `NotPrincipal` is not a valid JSON keyword.',
      'Because `"Effect": "Allow"` with `"NotPrincipal"` grants access to EVERY principal in the entire world EXCEPT the ones listed, which almost always results in accidental public exposure.',
      'Because it causes the AWS console to crash.',
      'Because it doubles KMS charges.'
    ],
    correctAnswer: 'Because `"Effect": "Allow"` with `"NotPrincipal"` grants access to EVERY principal in the entire world EXCEPT the ones listed, which almost always results in accidental public exposure.',
    explanation: '`NotPrincipal` combined with `Allow` grants permissions to everyone other than the specified principals. To enforce restrictions, use `"Effect": "Deny"` with `NotPrincipal` instead.',
    engineerReasoning: 'This is one of the most dangerous traps in IAM policy authoring. Using `Allow` with `NotPrincipal` has caused massive public data leaks.',
    businessImpact: 'Unintended global public access granted to proprietary databases, keys, or S3 buckets.',
    awsBestPractice: 'Only use `NotPrincipal` in combination with an explicit `"Effect": "Deny"`.'
  },
  {
    id: 'iam-q24',
    difficulty: 'Engineer Level',
    category: 'PrincipalOrgID Guardrails',
    topicId: 'cross-account',
    topicTitle: 'Cross Account Access',
    question: 'How does using `Condition: { "StringEquals": { "aws:PrincipalOrgID": "o-xyz123" } }` in a resource policy improve upon listing individual AWS Account IDs?',
    options: [
      'It speeds up API response times.',
      'It automatically restricts access to any current or future account belonging to your AWS Organization, eliminating manual policy updates and preventing external third-party access.',
      'It bypasses the need for IAM roles.',
      'It enables free cloud storage.'
    ],
    correctAnswer: 'It automatically restricts access to any current or future account belonging to your AWS Organization, eliminating manual policy updates and preventing external third-party access.',
    explanation: '`aws:PrincipalOrgID` binds access to membership in your AWS Organization. When new member accounts are created, they inherit access automatically while all external accounts remain blocked.',
    engineerReasoning: 'Centralizing identity boundaries around the Organization ID eliminates configuration drift and human maintenance errors.',
    businessImpact: 'Prevents operational bottlenecks where deployments fail because a new AWS account was forgotten in a resource policy.',
    awsBestPractice: 'Use `aws:PrincipalOrgID` in S3, KMS, and SQS resource policies for enterprise shared services.'
  },
  {
    id: 'iam-q25',
    difficulty: 'Beginner',
    category: 'IAM Groups',
    topicId: 'iam-fundamentals',
    topicTitle: 'IAM Fundamentals',
    question: 'Can an IAM Group be referenced as a `Principal` in an IAM resource-based policy (such as an S3 bucket policy)?',
    options: [
      'Yes, by using the Group ARN.',
      'No; IAM Groups cannot be principals in resource policies because a group is not an authenticating entity.',
      'Yes, if the group has fewer than 10 members.',
      'Yes, but only in us-east-1.'
    ],
    correctAnswer: 'No; IAM Groups cannot be principals in resource policies because a group is not an authenticating entity.',
    explanation: 'IAM Groups are purely an administrative convenience for attaching policies to multiple users at once. They cannot be specified as a `Principal` in resource policies or role trust policies.',
    engineerReasoning: 'To grant a group of users access via resource policies, use conditions matching tags or use an IAM Role that members assume.',
    businessImpact: 'Attempting to use Group ARNs in resource policies results in policy syntax errors or failed deployments.',
    awsBestPractice: 'Migrate human users from legacy IAM Groups to AWS IAM Identity Center (SSO) with permission sets.'
  },
  {
    id: 'iam-q26',
    difficulty: 'Intermediate',
    category: 'Inline vs Managed Policies',
    topicId: 'policies-deep-dive',
    topicTitle: 'Policies',
    question: 'What is the security difference between an AWS Managed Policy and an Inline Policy?',
    options: [
      'Managed policies are encrypted; inline policies are plaintext.',
      'AWS Managed Policies are pre-created and maintained by AWS across all accounts; Inline Policies are embedded directly into a single principal and are deleted if that principal is deleted.',
      'Inline policies have a 10-character limit.',
      'Managed policies cannot be audited by CloudTrail.'
    ],
    correctAnswer: 'AWS Managed Policies are pre-created and maintained by AWS across all accounts; Inline Policies are embedded directly into a single principal and are deleted if that principal is deleted.',
    explanation: 'AWS Managed Policies provide standard templates (e.g. `AdministratorAccess`). Customer Managed Policies can be reused across roles. Inline policies maintain a strict 1:1 relationship with a specific identity.',
    engineerReasoning: 'Customer Managed Policies with versioning are preferred for auditing and governance over unversioned inline policies.',
    businessImpact: 'Relying on broad AWS Managed Policies (like `PowerUserAccess`) often grants excessive unintended privileges.',
    awsBestPractice: 'Create purpose-built Customer Managed Policies with strict version control in Git/Terraform.'
  },
  {
    id: 'iam-q27',
    difficulty: 'Advanced',
    category: 'Service-Linked Roles',
    topicId: 'users-vs-roles',
    topicTitle: 'Users vs Roles',
    question: 'What is an AWS Service-Linked Role, and how does its security model differ from a standard custom IAM role?',
    options: [
      'A role that only links to external social media accounts.',
      'A predefined IAM role linked directly to an AWS service that includes all permissions the service requires to call other AWS services on your behalf, with permissions that cannot be modified by the customer.',
      'A temporary role that expires after 60 seconds.',
      'A role that does not generate CloudTrail logs.'
    ],
    correctAnswer: 'A predefined IAM role linked directly to an AWS service that includes all permissions the service requires to call other AWS services on your behalf, with permissions that cannot be modified by the customer.',
    explanation: 'Service-Linked Roles (e.g., `AWSServiceRoleForAutoScaling`) are managed by AWS to allow services to operate securely without requiring customers to manually craft complex policies.',
    engineerReasoning: 'You cannot edit the permissions of a service-linked role. Deleting the role requires first deleting the associated service resource.',
    businessImpact: 'Prevents misconfigured customer policies from breaking core AWS service management infrastructure.',
    awsBestPractice: 'Allow AWS services to create service-linked roles automatically when enabling managed services.'
  },
  {
    id: 'iam-q28',
    difficulty: 'Engineer Level',
    category: 'OIDC Federation Claims',
    topicId: 'iam-best-practices',
    topicTitle: 'IAM Best Practices',
    question: 'In a GitHub Actions OIDC trust policy, which condition key must you enforce to prevent ANY GitHub repository in the world from assuming your deployment role?',
    options: [
      '`token.actions.githubusercontent.com:sub` matching your specific repository (e.g. `repo:my-org/my-repo:ref:refs/heads/main`)',
      '`aws:SourceVpc: "vpc-000"`',
      '`aws:PrincipalType: "GitHub"`',
      '`aws:MultiFactorAuthPresent: "true"`'
    ],
    correctAnswer: '`token.actions.githubusercontent.com:sub` matching your specific repository (e.g. `repo:my-org/my-repo:ref:refs/heads/main`)',
    explanation: 'The `sub` (subject) claim in GitHub’s OIDC token identifies the exact repository and branch. Without this condition, any user on GitHub could obtain a token signed by GitHub and assume your role.',
    engineerReasoning: 'Failing to validate the `sub` claim is the #1 mistake when configuring OIDC, turning your cloud account into an open backdoor for any GitHub user.',
    businessImpact: 'Total account takeover: any external attacker with a free GitHub account can assume your deployment role and seize infrastructure.',
    awsBestPractice: 'Always validate both `:aud` (audience) and `:sub` (subject) in OIDC trust policies.'
  },
  {
    id: 'iam-q29',
    difficulty: 'Intermediate',
    category: 'Session Policies',
    topicId: 'users-vs-roles',
    topicTitle: 'Users vs Roles',
    question: 'When assuming an IAM role using the `sts:AssumeRole` API, what is the effect of passing an optional "Session Policy" parameter?',
    options: [
      'It expands the permissions of the role to include full administrative access.',
      'It further restricts the permissions of the resulting temporary session to the intersection of the role’s permissions policy and the session policy.',
      'It extends the session duration to 72 hours.',
      'It encrypts the caller’s local terminal.'
    ],
    correctAnswer: 'It further restricts the permissions of the resulting temporary session to the intersection of the role’s permissions policy and the session policy.',
    explanation: 'Session policies act as an inline boundary for that specific temporary session. They can only narrow permissions, never expand them.',
    engineerReasoning: 'Session policies allow applications to assume a general role and dynamically scope down credentials for specific tenants or tasks.',
    businessImpact: 'Prevents multi-tenant applications from accidentally leaking data across tenants sharing the same execution role.',
    awsBestPractice: 'Use session policies when vending temporary credentials to multi-tenant workloads or dynamic job runners.'
  },
  {
    id: 'iam-q30',
    difficulty: 'Engineer Level',
    category: 'Evaluation Logic with SCPs & Boundaries',
    topicId: 'policies-deep-dive',
    topicTitle: 'Policies',
    question: 'An IAM principal attempts an API call. An explicit Allow exists in the Identity Policy. An SCP allows the action. No Explicit Deny exists. However, an attached Permissions Boundary does NOT mention the action. What is the final evaluation decision?',
    options: [
      'ALLOW, because Identity Policy and SCP both allow it.',
      'DENY, because the action is implicitly denied by the Permissions Boundary (all boundaries must explicitly allow the action for it to succeed).',
      'ALLOW, but with a warning log in CloudWatch.',
      'The call is held in pending status for 24 hours.'
    ],
    correctAnswer: 'DENY, because the action is implicitly denied by the Permissions Boundary (all boundaries must explicitly allow the action for it to succeed).',
    explanation: 'For an action to be permitted when a Permissions Boundary is present, the action MUST be allowed by the Identity Policy, the SCP, AND the Permissions Boundary. If any one of them does not allow it, it results in an implicit deny.',
    engineerReasoning: 'Mastering the comprehensive 6-factor evaluation order (Explicit Deny -> SCP -> Resource Policy -> Identity Policy -> Permission Boundary -> Session Policy) is the hallmark of an advanced cloud security engineer.',
    businessImpact: 'Understanding why an API call is denied avoids blind trial-and-error changes that accidentally open security vulnerabilities.',
    awsBestPractice: 'Design layered defenses so that SCPs, Boundaries, and Identity policies reinforce each other.'
  }
]
