// Path 1: Identity & Access Management (IAM)
export const iamPath = {
  id: 'iam',
  title: 'Identity & Access Management (IAM)',
  shortTitle: 'IAM Security',
  icon: 'Fingerprint',
  accentColor: '#38bdf8',
  badge: 'Domain 01',
  level: 'Beginner to Advanced',
  estimatedTime: '2 hrs 45 mins',
  description: 'Master the primary control plane of AWS. Learn how principals, evaluation logic, temporary credentials, permissions boundaries, and cross-account trusts define your cloud attack surface.',
  whyItMatters: 'In AWS, identity is the true perimeter. A single over-permissive policy or leaked long-lived access key can bypass all firewalls and lead to total account compromise.',
  topics: [
    {
      id: 'iam-fundamentals',
      title: 'IAM Fundamentals',
      pathId: 'iam',
      level: 'Beginner',
      estimatedTime: '18 min read • 5 min check',
      badge: 'Core Foundation',
      summary: 'Understand the foundational pillars of AWS IAM: principals, authentication vs. authorization, the credential lifecycle, and why the root user must never be used for daily operations.',
      overview: `AWS Identity and Access Management (IAM) is the central security service that controls who is authenticated (signed in) and authorized (has permissions) to perform actions on AWS resources.

IAM operates at the request evaluation phase for every AWS API call. When an API call is made (whether through the AWS Console, AWS CLI, SDKs, or an automated service), AWS inspects:
1. **The Principal**: Who is making the request (Root user, IAM user, IAM role, or federated entity).
2. **The Action**: What operation is being attempted (e.g., \`s3:GetObject\`, \`ec2:RunInstances\`).
3. **The Resource**: Which specific AWS resource ARN is targeted (e.g., \`arn:aws:s3:::customer-pii-data/*\`).
4. **The Context**: Environmental conditions such as client IP address, time of day, whether MFA was used, and SSL/TLS status.

By default, all requests are implicitly denied. Unless an explicit allow policy applies to the principal for that specific action and resource, the request fails with \`AccessDenied\`. Furthermore, any explicit deny anywhere in the evaluation chain immediately trumps all allows.`,
      whyItMatters: 'IAM is the control plane for every resource in your cloud environment. If your IAM architecture is flawed, firewalls, VPCs, and encryption cannot protect your workloads from lateral movement or data exfiltration.',
      securityRisks: [
        'Root account credential compromise causing catastrophic loss of the entire AWS environment.',
        'Creation of static, long-lived access keys that get committed to public GitHub repositories.',
        'Overly broad permissions (e.g., AdministratorAccess) granted to developers or build servers.',
        'Absence of MFA on administrative accounts allowing automated credential-stuffing attacks.'
      ],
      bestPractices: [
        'Lock away the AWS Root user account immediately after creation; delete all root access keys and enable hardware MFA.',
        'Adopt temporary credentials via IAM Roles and AWS IAM Identity Center (Single Sign-On) instead of creating IAM users.',
        'Never attach policies directly to individual users; assign permissions through IAM User Groups or Permission Sets.',
        'Audit credential age and automatically disable keys older than 90 days.'
      ],
      keyTakeaways: [
        'Root is for initial setup and emergency break-glass only — never for day-to-day engineering.',
        'AWS evaluates requests with default deny: no permission exists until explicitly granted.',
        'Explicit Deny always overrides any number of Explicit Allows.',
        'Temporary credentials issued by AWS STS are orders of magnitude safer than static access keys.'
      ],
      realWorldScenario: {
        title: 'The Hardcoded Root Access Key Leak',
        incident: 'A fintech startup developer created access keys for the root account to quickly configure a deployment script. The script was committed to a public Git repository. Within 4 minutes, automated adversary crawlers scraped the key, spun up 80 GPU-intensive EC2 instances in 6 unmonitored AWS regions for crypto-mining, and created backdoor IAM administrative users.',
        impact: '$38,000 in unauthorized compute charges accrued over a 36-hour weekend window, along with risk of customer financial data exposure.',
        detectionMethod: 'AWS Compromised Credentials notification received by email, followed by AWS CloudTrail alert showing DescribeInstances from an unfamiliar foreign IP.'
      },
      commonBeginnerMistakes: [
        'Using the Root account for building applications or provisioning Terraform infrastructure.',
        'Generating static access keys for human users instead of configuring AWS Identity Center (SSO).',
        'Confusing authentication (who you are) with authorization (what you are permitted to do).',
        'Failing to set an account alias and strong account-level password policy.'
      ],
      whatACloudSecEngineerChecks: [
        'Check for active root access keys: `aws iam get-account-summary --query "SummaryMap.AccountAccessKeysPresent"` (Must be 0).',
        'Verify root MFA status: `aws iam get-account-summary --query "SummaryMap.AccountMFAEnabled"` (Must be 1).',
        'Inspect credential report for inactive/stale credentials: `aws iam get-credential-report`.',
        'Verify whether AWS Organizations Service Control Policies (SCPs) block root actions in member accounts.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: SCP Blocking Root User API Calls Across Member Accounts',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RestrictRootUserActions",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "aws:PrincipalArn": "arn:aws:iam::*:root"
        }
      }
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'What is the exact evaluation order when AWS IAM processes a request with multiple policies?',
          interviewerRationale: 'Tests whether the candidate understands the fundamental authorization algorithm of AWS, specifically how explicit denies interact with identity, resource, and boundary policies.',
          modelAnswer: 'AWS starts with a default deny. It evaluates all applicable policies: Organization SCPs, Resource-based policies, IAM Permissions Boundaries, Session Policies, and Identity-based policies. If an Explicit Deny exists in ANY policy, the evaluation terminates immediately with Access Denied. If no explicit deny exists, there must be at least one Explicit Allow within the permissible boundaries for the request to succeed. If no explicit allow exists, the default deny applies.'
        },
        {
          question: 'Why should an enterprise eliminate static IAM access keys in favor of temporary credentials?',
          interviewerRationale: 'Evaluates the candidate\'s modern credential management posture and understanding of AWS STS.',
          modelAnswer: 'Static IAM access keys are long-lived, stored on developer laptops, frequently leaked into code repositories or CI/CD logs, and require manual rotation. Temporary credentials issued by AWS STS (via IAM Roles, Identity Center, or OIDC) have a short lifespan (typically 15 minutes to 1 hour), are automatically refreshed, and cannot be reused indefinitely if exfiltrated.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: AWS Identity and Access Management (IAM) Foundations',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-identity-and-access-management-iam-foundations',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Security Best Practices in IAM',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html',
          type: 'Documentation'
        },
        {
          title: 'AWS IAM Policy Evaluation Logic Reference',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'An engineer has an IAM policy attached granting s3:GetObject on a bucket, but the S3 Bucket Policy contains an explicit Deny for all requests without TLS (aws:SecureTransport: false). If the engineer accesses the object via plaintext HTTP, what happens?',
        options: [
          { id: 'a', text: 'The request succeeds because the user identity policy grants explicit allow.', isCorrect: false, explanation: 'Identity-based allow never overrides an explicit deny in a resource policy.' },
          { id: 'b', text: 'The request is denied because an explicit deny in any applicable policy always takes precedence over an allow.', isCorrect: true, explanation: 'Correct! The explicit Deny in the bucket policy unconditionally overrides the allow in the identity policy.' },
          { id: 'c', text: 'AWS IAM prompts the user to enter their MFA token before allowing the request.', isCorrect: false, explanation: 'MFA cannot convert an explicit deny into an allow unless conditions explicitly specify it.' },
          { id: 'd', text: 'The request succeeds but generates a high-severity GuardDuty finding.', isCorrect: false, explanation: 'The request fails at the API authorization layer; it is not executed.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-iam-01',
        title: 'Investigation: Compromised Access Keys & Privilege Escalation',
        url: '/investigations',
        description: 'Triage raw CloudTrail logs of an exposed access key used to spin up rogue EC2 instances.'
      }
    },
    {
      id: 'users-vs-roles',
      title: 'Users vs Roles',
      pathId: 'iam',
      level: 'Beginner',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Architecture',
      summary: 'Differentiate between human IAM users and temporary assume-role identities. Master instance profiles, Lambda execution roles, and cross-account assumption.',
      overview: `One of the most foundational architecture decisions in cloud security is knowing when to use an IAM User versus an IAM Role.

**IAM Users**:
- Represent a specific human or application identity.
- Possess long-term credentials (password for console, or static Access Key ID & Secret Access Key for CLI).
- Suffer from credential sprawl, laptop theft risk, and manual rotation overhead.

**IAM Roles**:
- Not associated with a single person or static credential.
- Assumed by an authorized principal (an EC2 instance, a Lambda function, a GitHub Actions runner, or a user in another account).
- When a role is assumed, the AWS Security Token Service (STS) issues short-lived temporary security credentials consisting of:
  1. An Access Key ID (starts with \`ASIA...\` indicating temporary STS token).
  2. A Secret Access Key.
  3. A Session Token.
  4. An expiration timestamp (15 minutes to 12 hours).

**Key Role Mechanics**:
- **Trust Policy (AssumeRolePolicyDocument)**: Defines WHO is allowed to assume the role (e.g., \`ec2.amazonaws.com\`, or an external AWS Account ID).
- **Permissions Policy**: Defines WHAT the principal is allowed to do once they have assumed the role.
- **Instance Profile**: A container that passes an IAM role to an EC2 instance without hardcoding credentials in the OS.`,
      whyItMatters: 'Using roles eliminates 95% of credential leakage incidents. Services like EC2, ECS, and Lambda should NEVER have AWS credentials stored in environment variables or configuration files.',
      securityRisks: [
        'Hardcoding static IAM user access keys into application configuration files or Docker containers.',
        'Overly broad trust policies (e.g., Principal: "*") allowing unintended external accounts to assume internal roles.',
        'Compromise of an EC2 instance where the attached instance profile role has AdministratorAccess.',
        'IAM role chaining abuse allowing unauthorized lateral escalation.'
      ],
      bestPractices: [
        'Use Instance Profiles for EC2 and Execution Roles for ECS/Lambda; never embed credentials.',
        'Implement GitHub Actions / GitLab CI OIDC federation to assume IAM roles without storing static keys in CI secrets.',
        'Keep role session duration as short as practical (e.g., 1 hour for engineers, 15 minutes for automation).',
        'Strictly scope the Principal block in every role trust policy to specific ARN patterns.'
      ],
      keyTakeaways: [
        'IAM Users have static keys (starts with AKIA); IAM Roles have temporary STS tokens (starts with ASIA).',
        'A Role has TWO policies: Trust Policy (who can assume it) and Permissions Policy (what it can do).',
        'Never store AWS keys in EC2 instances or Lambda functions — use attached execution roles.',
        'OIDC federation enables CI/CD pipelines to deploy to AWS without storing any long-term secrets.'
      ],
      realWorldScenario: {
        title: 'The Stolen Container Credential File',
        incident: 'An engineering team baked an IAM User secret key into a Docker image deployed to public ECS clusters. A Server-Side Request Forgery (SSRF) flaw in their web app allowed an attacker to dump the environment variables and extract the static access key, giving them persistence for 6 months until detected during an external penetration test.',
        impact: 'Persistent unauthorized access to customer databases and internal source code repositories.',
        detectionMethod: 'Security audit discovered static access keys active without rotation for 180+ days with calls originating from residential Tor exit nodes.'
      },
      commonBeginnerMistakes: [
        'Creating an IAM user for every microservice instead of assigning an IAM task role.',
        'Confusing the Role Trust Policy (who can assume) with the Role Permissions Policy (what it can do).',
        'Leaving role trust policies open to `Principal: "*"` without an ExternalId or condition.',
        'Using EC2 metadata service v1 (IMDSv1) which allows SSRF to steal instance profile credentials.'
      ],
      whatACloudSecEngineerChecks: [
        'Inspect all IAM users to confirm zero static keys exist for non-human applications: `aws iam list-users`.',
        'Verify EC2 instances enforce IMDSv2 (token-based metadata) to prevent SSRF credential theft: `aws ec2 describe-instances --query "Reservations[*].Instances[*].MetadataOptions.HttpTokens"`.',
        'Audit Trust Policies on all roles for wildcard principals: `aws iam get-role --role-name <name> --query "Role.AssumeRolePolicyDocument"`.',
        'Check STS AssumeRole logs in CloudTrail for unexpected external IP addresses.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: Secure Trust Policy Allowing EC2 Instance to Assume a Role',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EC2AssumeRoleTrust",
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "aws:SourceAccount": "123456789012"
        }
      }
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'How do you prevent an attacker from stealing credentials from an EC2 instance metadata service via an SSRF vulnerability?',
          interviewerRationale: 'Evaluates if the candidate knows modern EC2 defense mechanics and the difference between IMDSv1 and IMDSv2.',
          modelAnswer: 'Enforce IMDSv2 (Instance Metadata Service Version 2) across all EC2 instances by setting `HttpTokens=required` and `HttpPutResponseHopLimit=1`. Unlike IMDSv1 which accepts simple GET requests, IMDSv2 requires a session token obtained via an HTTP PUT request with custom headers, which most SSRF attack vectors cannot forge. Furthermore, ensure the instance profile attached to the EC2 instance strictly adheres to least privilege.'
        },
        {
          question: 'What is the difference between a Role Trust Policy and a Role Permission Policy?',
          interviewerRationale: 'Validates that the candidate understands role construction and cannot accidentally configure an open trust boundary.',
          modelAnswer: 'A Trust Policy (AssumeRolePolicyDocument) is a resource-based policy attached to the role that defines WHO is allowed to assume the role (e.g., another AWS account, a federated OIDC provider, or an AWS service like Lambda). A Permission Policy is an identity policy that defines WHAT actions the caller is authorized to execute against which resources once the role is successfully assumed.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Deep Dive on IAM Roles and Temporary Credentials',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: IAM Roles Terms and Concepts',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Architecture Blog: Securing EC2 Instance Metadata with IMDSv2',
          url: 'https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'You discover an EC2 instance where an application needs to read files from an S3 bucket. What is the most secure AWS architecture?',
        options: [
          { id: 'a', text: 'Generate an IAM user access key and save it in ~/.aws/credentials on the instance.', isCorrect: false, explanation: 'Static keys on disk can be stolen via snapshot extraction, file-read flaws, or SSH compromise.' },
          { id: 'b', text: 'Store the access key in an environment variable inside the application container.', isCorrect: false, explanation: 'Environment variables are still static credentials that leak via logs and inspection tools.' },
          { id: 'c', text: 'Attach an IAM Role with an S3 read policy via an EC2 Instance Profile, and require IMDSv2 on the instance.', isCorrect: true, explanation: 'Correct! The AWS SDK will automatically retrieve temporary STS credentials from the metadata service with no hardcoded keys.' },
          { id: 'd', text: 'Make the S3 bucket public so the EC2 instance does not require credentials to read the data.', isCorrect: false, explanation: 'Making the bucket public exposes sensitive data to the entire world.' }
        ]
      },
      bridgeToLabs: {
        type: 'Lab',
        id: 'lab-01',
        title: 'Real Lab: Enforcing IMDSv2 & Role-Based Instance Profiles',
        url: '/labs',
        description: 'Execute hands-on AWS CLI runbooks to replace static credentials with least-privilege instance profiles.'
      }
    },
    {
      id: 'policies',
      title: 'Policies',
      pathId: 'iam',
      level: 'Intermediate',
      estimatedTime: '22 min read • 6 min check',
      badge: 'Core Mechanic',
      summary: 'Master JSON policy grammar: Effect, Action, Resource, and Condition blocks. Compare Identity-based, Resource-based, Permissions Boundaries, and Service Control Policies (SCPs).',
      overview: `In AWS, all permissions are declared as JSON policy documents. A thorough understanding of policy anatomy and evaluation rules is required for every cloud security engineer.

**The Anatomy of a Policy Statement**:
1. **Effect**: Either \`Allow\` or \`Deny\`.
2. **Action**: The specific API operations (e.g., \`ec2:StopInstances\`, \`kms:Decrypt\`).
3. **Resource**: The ARN(s) specifying targets (e.g., \`arn:aws:s3:::prod-orders-bucket/*\`).
4. **Principal**: Required ONLY in Resource-based policies (e.g., S3 bucket policies, KMS key policies) to declare WHO is granted access.
5. **Condition**: Key-value expressions that restrict when the policy applies (e.g., \`aws:SourceIp\`, \`aws:PrincipalArn\`, \`aws:MultiFactorAuthPresent\`, \`s3:x-amz-server-side-encryption\`).

**The 4 Major Policy Categories**:
1. **Identity-Based Policies**: Attached directly to IAM users, groups, or roles (Inline or Managed).
2. **Resource-Based Policies**: Attached directly to resources (e.g., S3 Bucket Policies, KMS Key Policies, SQS Queue Policies). Can grant cross-account access directly without assuming a role.
3. **Permissions Boundaries**: Advanced guardrail that sets the MAXIMUM permissions an identity-based policy can grant.
4. **Service Control Policies (SCPs)**: Account-level guardrails applied across AWS Organizations that establish permission watermarks for entire accounts.`,
      whyItMatters: 'A policy with `"Action": "*"` and `"Resource": "*"` grants super-admin powers. Writing precise policies with strict Resource ARNs and Condition keys is the core craft of cloud defense.',
      securityRisks: [
        'Using `"Resource": "*"` on sensitive actions like `iam:PassRole`, `s3:GetObject`, or `kms:Decrypt`.',
        'Misunderstanding Condition keys leading to open access (e.g., using `StringEquals` instead of `ArnEquals`).',
        'Confusing `NotAction` with a Deny statement, which can inadvertently grant full access to all other actions.',
        'Overwriting critical managed policies with untested inline overrides.'
      ],
      bestPractices: [
        'Always specify explicit Resource ARNs rather than wildcard `*` for data-plane and identity actions.',
        'Use Condition blocks like `aws:SecureTransport: "true"` to enforce TLS across all S3 and API calls.',
        'Utilize `aws:PrincipalOrgID` in resource policies to grant access to all accounts in your organization safely.',
        'Validate all policies through AWS IAM Access Analyzer and linting tools (e.g., Parliament, cfn-nag) before deployment.'
      ],
      keyTakeaways: [
        'A policy document contains Statements with Effect, Action, Resource, and optional Condition blocks.',
        'Resource-based policies require a Principal element; Identity-based policies do not.',
        'Permissions Boundaries and SCPs do not grant permissions; they only restrict the upper ceiling of allowed actions.',
        'Never use NotAction unless paired with an explicit Deny statement.'
      ],
      realWorldScenario: {
        title: 'The Accidental NotAction Backdoor',
        incident: 'A junior administrator intended to restrict a billing role so it could only access billing data. They wrote: `"Effect": "Allow", "NotAction": "s3:*", "Resource": "*"`. This unintended policy granted full unrestricted access to EC2, IAM, KMS, Lambda, DynamoDB, and all other services in the AWS cloud, allowing a contractor to escalate privileges to full administrator.',
        impact: 'Contractor gained unintended administrative visibility over production infrastructure and encryption keys.',
        detectionMethod: 'Discovered during an IAM Access Analyzer policy scan flagging excessive administrative privileges on a billing group.'
      },
      commonBeginnerMistakes: [
        'Believing that `NotAction` creates an explicit deny (it actually grants an allow to everything EXCEPT the specified service).',
        'Omitting trailing wildcard `/*` on S3 bucket ARNs when granting object-level permissions like `s3:GetObject`.',
        'Forgetting that KMS keys require KMS Key Policies; identity policies alone cannot decrypt data if the key policy forbids it.',
        'Attaching AWS-managed `AdministratorAccess` as a temporary fix and forgetting to remove it.'
      ],
      whatACloudSecEngineerChecks: [
        'Run IAM Access Analyzer to detect policies that grant public or cross-account access: `aws accessanalyzer list-findings`.',
        'Search for wildcard actions in customer managed policies: `aws iam list-policies --scope Local`.',
        'Verify that all S3 bucket policies contain a TLS enforcement condition (`aws:SecureTransport: true`).',
        'Audit policy version limits (AWS permits max 5 policy versions before older versions must be pruned).'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: Production-Grade IAM Policy Restricting S3 Access by Tag and Requiring TLS',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowReadTaggedProductionData",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::enterprise-data-warehouse",
        "arn:aws:s3:::enterprise-data-warehouse/analytics/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "true"
        },
        "StringEquals": {
          "s3:ExistingObjectTag/DataClassification": "Confidential"
        }
      }
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'What is the danger of using "Effect": "Allow" with "NotAction": "iam:*", "Resource": "*"?',
          interviewerRationale: 'Tests whether the engineer understands how NotAction evaluates and why it should rarely be used with Allow.',
          modelAnswer: 'This statement allows EVERY AWS action across all services (EC2, S3, RDS, KMS, Secrets Manager, etc.) EXCEPT IAM actions. Beginners often think it only permits non-administrative tasks, but it actually grants near-total administrator access across the entire account. The secure pattern is to explicitly list permitted actions, or use NotAction only inside an explicit Deny statement.'
        },
        {
          question: 'How do Resource-based policies interact with cross-account access compared to Identity-based policies?',
          interviewerRationale: 'Evaluates the candidate\'s deep understanding of AWS trust boundaries and cross-account mechanics.',
          modelAnswer: 'If Account A owns an S3 bucket with a resource policy granting access directly to a principal ARN in Account B, Account B\'s principal can access the resource directly without assuming a role, provided Account B\'s identity policy also permits the action. In contrast, with identity-based policies alone, the user in Account B must use sts:AssumeRole into a role in Account A.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: IAM Policy Concepts and Troubleshooting',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Grammar of the IAM JSON Policy Language',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_grammar.html',
          type: 'Documentation'
        },
        {
          title: 'AWS IAM Policy Simulator Tool Guide',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'An engineer wants to grant a role permission to upload files to an S3 bucket named "corp-assets". They write the Resource as "arn:aws:s3:::corp-assets". When the application runs s3:PutObject, it receives AccessDenied. Why?',
        options: [
          { id: 'a', text: 'The bucket name must contain only uppercase letters.', isCorrect: false, explanation: 'S3 bucket names must be globally unique and lowercase.' },
          { id: 'b', text: 'The resource ARN represents the bucket itself, but object actions require the object path "arn:aws:s3:::corp-assets/*".', isCorrect: true, explanation: 'Correct! Bucket-level actions (e.g. s3:ListBucket) target the bucket ARN, while object actions (s3:PutObject, s3:GetObject) target the object ARN ending in /*.' },
          { id: 'c', text: 'IAM does not allow s3:PutObject without s3:DeleteObject permission.', isCorrect: false, explanation: 'Write permissions can be granted without delete permissions.' },
          { id: 'd', text: 'The IAM policy version must be updated to 2026-01-01.', isCorrect: false, explanation: 'The official AWS policy language version is "2012-10-17".' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-iam-02',
        title: 'Investigation: Wildcard Privilege Escalation via iam:PassRole',
        url: '/investigations',
        description: 'Investigate how an attacker combined iam:PassRole with ec2:RunInstances to create a rogue admin root shell.'
      }
    },
    {
      id: 'least-privilege',
      title: 'Least Privilege',
      pathId: 'iam',
      level: 'Intermediate',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Security Standard',
      summary: 'Implement the principle of least privilege in production. Use CloudTrail analysis, IAM Access Advisor, and Access Analyzer to eliminate wildcard * permissions.',
      overview: `The Principle of Least Privilege (PoLP) states that a security principal should be granted only the minimal set of permissions necessary to perform its intended job function, and nothing more.

In cloud environments, granting excessive privileges (such as \`AdministratorAccess\` or broad wildcards like \`s3:*\`) is the leading cause of lateral movement and data destruction following an initial breach.

**The 3-Step Lifecycle for Least Privilege**:
1. **Start with Guardrails**: Use AWS Organizations SCPs and Permissions Boundaries to block catastrophic actions (e.g., disabling CloudTrail, leaving the Organization, deleting KMS customer managed keys).
2. **Right-Size Permissions Using Telemetry**:
   - **IAM Access Advisor**: Shows which AWS services a role or user has actually used over the last 400 days.
   - **AWS CloudTrail Logs & Athena**: Query exact API calls made by the principal to generate a precise list of actions.
   - **IAM Policy Generator (via CloudTrail)**: AWS can automatically review CloudTrail history for a role and output a tightly scoped policy containing only the actions actually invoked.
3. **Continuous Review & Automated Pruning**: Automatically flag and remove permissions or roles that have remained unused for over 90 days.`,
      whyItMatters: 'If a compromised application has full S3 permissions, the attacker can wipe all backups. If it only has `s3:PutObject` on an incoming drop bucket, the attacker cannot read existing records or delete files.',
      securityRisks: [
        'Wildcard actions (`*`) allowing an attacker with compute access to read sensitive secrets from AWS Secrets Manager.',
        'Permission to invoke `iam:CreatePolicyVersion` or `iam:SetDefaultPolicyVersion`, allowing immediate privilege escalation to administrator.',
        'Stale administrative roles left over from temporary testing becoming dormant backdoors.',
        'Lack of resource scoping allowing an attacker to tamper with production data from a staging role.'
      ],
      bestPractices: [
        'Eliminate all `*` actions in production application roles; replace with explicit verb lists.',
        'Use IAM Access Advisor monthly to identify and detach unused service permissions.',
        'Generate IAM policies directly from CloudTrail activity using the IAM console policy generation feature.',
        'Use separate AWS accounts for Development, Staging, and Production to limit blast radius.'
      ],
      keyTakeaways: [
        'Least privilege is not a one-time setup; it is an ongoing continuous refinement process.',
        'Never grant iam:PassRole with Resource: "*" — an attacker can pass an admin role to a rogue Lambda or EC2 instance.',
        'Use CloudTrail telemetry to identify what an application actually does before locking down policies.',
        'Account separation is the ultimate blast radius reduction technique.'
      ],
      realWorldScenario: {
        title: 'The Over-Permissive Lambda Destruction',
        incident: 'A data ingestion Lambda function was given an execution role with `"Action": "dynamodb:*"` on all tables. A remote code execution flaw in an open-source parsing library was exploited by an attacker. The attacker used the broad permissions to execute `dynamodb:DeleteTable` on the production billing and customer master tables.',
        impact: 'Full production outage lasting 14 hours until point-in-time recovery could be executed across multiple tables.',
        detectionMethod: 'CloudWatch alarm fired on sudden drop in DynamoDB request rate; CloudTrail confirmed DeleteTable invoked from the Lambda execution role.'
      },
      commonBeginnerMistakes: [
        'Attaching `PowerUserAccess` or `AdministratorAccess` because crafting specific policies takes more time.',
        'Using wildcards for both Action and Resource (e.g., `Action: "*", Resource: "*"`).',
        'Failing to remove test policies after troubleshooting is completed.',
        'Not checking whether an IAM role has privilege escalation paths like `iam:AttachUserPolicy`.'
      ],
      whatACloudSecEngineerChecks: [
        'Review Access Advisor in AWS Console to see services not accessed in >90 days: `aws iam generate-service-last-accessed-details`.',
        'Identify dangerous privilege escalation permissions using tools like PMapper or Cloudsplaining.',
        'Check for roles containing `*:*` in policy statements: `aws iam get-account-authorization-details`.',
        'Audit IAM Access Analyzer findings for externally accessible resources.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: Right-Sized Read-Only S3 Role Restricted to a Single Bucket',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowBucketListing",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::production-app-reports",
      "Condition": {
        "StringLike": {
          "s3:prefix": ["daily/*", "monthly/*"]
        }
      }
    },
    {
      "Sid": "AllowObjectRead",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::production-app-reports/*"
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'How do you safely transition a legacy application running with AdministratorAccess to a least-privilege policy without causing downtime?',
          interviewerRationale: 'Tests real-world operational maturity and ability to balance security hardening with production availability.',
          modelAnswer: 'First, enable comprehensive CloudTrail logging for the workload. Let the application run through its complete operational cycle (e.g., 30 days to capture daily, weekly, and monthly batch jobs). Use Amazon Athena or IAM Policy Generator to query the exact API actions invoked by that role. Craft a candidate least-privilege policy. Test the candidate policy in a staging environment under load. Finally, deploy to production while monitoring CloudWatch metrics and CloudTrail for unexpected AccessDenied errors, maintaining a rollback plan.'
        },
        {
          question: 'Which IAM permissions are considered critical privilege escalation risks even if the user does not have AdministratorAccess?',
          interviewerRationale: 'Evaluates the candidate\'s offensive security awareness of cloud privilege escalation paths.',
          modelAnswer: 'Key dangerous permissions include: 1) `iam:CreatePolicyVersion` (can make an existing policy allow everything), 2) `iam:SetDefaultPolicyVersion`, 3) `iam:PassRole` combined with `ec2:RunInstances` or `lambda:CreateFunction` (passing a high-privilege role to a new compute resource), 4) `iam:AttachUserPolicy` or `iam:PutUserPolicy` (attaching admin to oneself), 5) `iam:CreateAccessKey` on another user, and 6) `sts:AssumeRole` without restrictive resource scoping.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Implementing Least Privilege in AWS IAM',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Granting Least Privilege',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Blog: Generate IAM Policies Based on CloudTrail Activity',
          url: 'https://aws.amazon.com/blogs/security/iam-share-service-last-accessed-data-generate-least-privilege-policies/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Which of the following IAM action combinations allows a non-admin user to escalate their permissions to full Administrator?',
        options: [
          { id: 'a', text: 's3:GetObject and s3:PutObject on all buckets.', isCorrect: false, explanation: 'S3 object access allows data access, not IAM policy modification.' },
          { id: 'b', text: 'iam:PassRole and lambda:CreateFunction / lambda:InvokeFunction.', isCorrect: true, explanation: 'Correct! An attacker can create a Lambda function, pass an existing high-privilege IAM role to it, and execute code that attaches AdministratorAccess to their user.' },
          { id: 'c', text: 'cloudwatch:PutMetricData and cloudwatch:GetMetricStatistics.', isCorrect: false, explanation: 'CloudWatch metric operations do not modify IAM permissions.' },
          { id: 'd', text: 'ec2:DescribeInstances and ec2:DescribeSecurityGroups.', isCorrect: false, explanation: 'Describe actions are strictly read-only reconnaissance.' }
        ]
      },
      bridgeToLabs: {
        type: 'Playbook',
        id: 'playbook-01',
        title: 'Job Playbook: CloudTrail to Athena Least-Privilege Remediation',
        url: '/playbooks',
        description: 'Execute an end-to-end 7-stage runbook to right-size an over-permissive application role.'
      }
    },
    {
      id: 'mfa',
      title: 'Multi-Factor Authentication (MFA)',
      pathId: 'iam',
      level: 'Beginner',
      estimatedTime: '15 min read • 5 min check',
      badge: 'Identity Hardening',
      summary: 'Enforce MFA across consoles, API sessions, and sensitive resource deletions. Learn virtual TOTP, FIDO2 WebAuthn hardware keys, and IAM policy condition enforcement.',
      overview: `Multi-Factor Authentication (MFA) requires users to provide two or more verification factors to gain access to AWS resources:
1. **Something you know**: Password or passphrase.
2. **Something you have**: A hardware security key (YubiKey / FIDO2) or a virtual authenticator app (Google Authenticator, 1Password, Duo) generating Time-based One-Time Passwords (TOTP).

**MFA Enforcement Layers**:
- **AWS Console Sign-In**: Enforced via AWS Identity Center or IAM user password policy.
- **AWS CLI / API Calls**: Developers must call \`sts:GetSessionToken --serial-number <MFA-ARN> --token-code <Code>\` to receive temporary STS credentials valid for up to 36 hours.
- **Resource Protection via Policy Condition**: AWS allows policy authors to reject actions unless MFA was actively validated during session creation using the condition key \`"aws:MultiFactorAuthPresent": "true"\`.
- **S3 MFA Delete**: Protects bucket objects from being permanently deleted or having versioning suspended without an active physical MFA device code.`,
      whyItMatters: 'According to industry breach reports, over 80% of cloud credential compromises succeed due to the absence of MFA. Enforcing MFA neutralizes credential-stuffing, phishing, and password reuse attacks.',
      securityRisks: [
        'Root account without MFA allowing single-factor takeover.',
        'IAM users with console passwords and no MFA enforcement.',
        'Service accounts or test users created without MFA enforcement.',
        'Ransomware threat actors deleting S3 backups because MFA Delete was not enabled.'
      ],
      bestPractices: [
        'Enforce FIDO2 / WebAuthn hardware security keys for all privileged administrative access.',
        'Deploy an IAM policy that denies all actions across the AWS account UNTIL the user has authenticated with MFA.',
        'Enable S3 MFA Delete on business-critical backup buckets and audit vaults.',
        'Use AWS Identity Center with centralized SSO MFA instead of local IAM user MFA.'
      ],
      keyTakeaways: [
        'MFA is mandatory for the root account and every human user with console access.',
        'Use "aws:MultiFactorAuthPresent": "true" in policies to enforce MFA on sensitive actions like terminating production databases or deleting S3 objects.',
        'FIDO2 hardware keys are phishing-resistant; virtual TOTP apps are susceptible to modern adversary-in-the-middle (AitM) phishing.',
        'S3 MFA Delete can only be enabled using the root account and the AWS CLI.'
      ],
      realWorldScenario: {
        title: 'The Phished Administrative Console',
        incident: 'A lead engineer was targeted with a sophisticated spear-phishing email masquerading as an internal HR benefits update. The engineer entered their corporate password on the spoofed landing page. Because the AWS account lacked mandatory MFA enforcement, the attacker immediately signed into the AWS Management Console and exported customer database snapshots.',
        impact: 'Exfiltration of 120,000 customer records and mandatory breach disclosure to regulators.',
        detectionMethod: 'GuardDuty UnauthorizedAccess finding triggered by console login from an unusual IP address in an uncharacteristic geolocation.'
      },
      commonBeginnerMistakes: [
        'Assuming that setting a complex 16-character password makes MFA unnecessary.',
        'Believing MFA on the console automatically protects AWS CLI operations (CLI requires STS session tokens).',
        'Losing root account MFA tokens without having configured backup MFA devices.',
        'Failing to block API actions when MFA is absent via IAM policy condition.'
      ],
      whatACloudSecEngineerChecks: [
        'Audit all IAM users without MFA enabled: `aws iam get-credential-report` and check the `mfa_active` column.',
        'Verify root account has multi-factor enabled: `aws iam get-account-summary --query "SummaryMap.AccountMFAEnabled"`.',
        'Verify the presence of an account-wide Self-Service MFA policy that restricts all actions until MFA is active.',
        'Confirm whether hardware FIDO2 keys are mandated for administrative roles.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: Enforce MFA for S3 Bucket Deletion via Condition Block',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyBucketDeletionWithoutMFA",
      "Effect": "Deny",
      "Action": [
        "s3:DeleteBucket",
        "s3:DeleteObject",
        "s3:DeleteObjectVersion"
      ],
      "Resource": "arn:aws:s3:::critical-compliance-vault/*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'How does the condition key "aws:MultiFactorAuthPresent" behave when an IAM role is assumed by an AWS service like EC2 or Lambda?',
          interviewerRationale: 'Tests whether the candidate understands the difference between human temporary sessions and AWS service role sessions.',
          modelAnswer: 'When an AWS service assumes a role (such as an EC2 instance profile or a Lambda execution role), the session is created via sts:AssumeRole by the service itself without human MFA. Therefore, aws:MultiFactorAuthPresent is false or not present. If an IAM policy has a strict Deny condition with Bool: { "aws:MultiFactorAuthPresent": "false" }, the service will be blocked from functioning. Engineers must use BoolIfExists or scope MFA conditions specifically to human-assumed roles.'
        },
        {
          question: 'What is S3 MFA Delete, how is it configured, and what actions does it protect?',
          interviewerRationale: 'Evaluates advanced data protection knowledge and root account operational requirements.',
          modelAnswer: 'S3 MFA Delete adds an extra layer of protection to versioned S3 buckets. It requires an active MFA code for two specific operations: 1) Permanently deleting an object version, and 2) Suspending or changing the versioning state of the bucket. It can ONLY be enabled or disabled via the AWS CLI using the Root account credentials of the bucket owner; it cannot be configured via the AWS Management Console or normal IAM roles.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Securing AWS Accounts with Multi-Factor Authentication',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Using Multi-Factor Authentication (MFA) in AWS',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html',
          type: 'Documentation'
        },
        {
          title: 'AWS IAM Example Policy: Allow Users to Manage Their Own MFA',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_iam_mfa-selfmanage.html',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'A company wants to mandate that engineers can only access production AWS infrastructure after completing MFA. Which strategy is most effective?',
        options: [
          { id: 'a', text: 'Send an email asking engineers to install an authenticator app.', isCorrect: false, explanation: 'Manual requests without policy enforcement do not guarantee compliance.' },
          { id: 'b', text: 'Configure an IAM policy attached to all developer groups with an explicit Deny for all actions if "aws:MultiFactorAuthPresent" is false (except allowing them to manage their own MFA device).', isCorrect: true, explanation: 'Correct! This programmatic enforcement blocks all AWS actions until MFA authentication is validated.' },
          { id: 'c', text: 'Set the maximum password age to 14 days in the account settings.', isCorrect: false, explanation: 'Password age does not enforce multi-factor authentication.' },
          { id: 'd', text: 'Enable AWS Shield Advanced on all public endpoints.', isCorrect: false, explanation: 'AWS Shield protects against DDoS attacks, not identity authentication.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-iam-03',
        title: 'Investigation: Compromised Password Without MFA',
        url: '/investigations',
        description: 'Analyze an incident where an external threat actor logged in using compromised credentials.'
      }
    },
    {
      id: 'permission-boundaries',
      title: 'Permission Boundaries',
      pathId: 'iam',
      level: 'Advanced',
      estimatedTime: '22 min read • 6 min check',
      badge: 'Advanced Governance',
      summary: 'Prevent privilege escalation in delegated administration models. Learn how permissions boundaries set maximum allowed permissions when developers create IAM roles.',
      overview: `A **Permissions Boundary** is an advanced IAM feature used to delegate administration to developers without risking privilege escalation.

In modern engineering organizations, developers need the ability to create IAM roles for their serverless functions (Lambda), containers (ECS), or CI/CD pipelines. However, if you grant developers the permission \`iam:CreateRole\` and \`iam:AttachRolePolicy\`, an unauthorized developer could simply create a role with \`AdministratorAccess\` and assume it, bypassing all security controls!

**How Permissions Boundaries Solve This**:
- A permissions boundary is a managed policy that sets the **maximum permissions** that an identity-based policy can grant to an IAM entity.
- An entity (user or role) can only perform actions that are allowed by **BOTH** its identity-based policy **AND** its permissions boundary.
- If an action is allowed by the identity policy but NOT by the permissions boundary, the action is denied.

**The Delegated Admin Pattern**:
Security engineers allow developers to create roles only under the strict condition that any newly created role MUST have a specific security permissions boundary attached at creation time (enforced via the condition key \`iam:PermissionsBoundary\`).`,
      whyItMatters: 'Permissions boundaries allow developers to move fast and self-provision cloud resources without security becoming a bottleneck, while mathematically guaranteeing they cannot create an admin backdoor.',
      securityRisks: [
        'Granting developers `iam:CreateRole` without enforcing a permissions boundary, enabling immediate privilege escalation to administrator.',
        'Developers modifying or deleting the permissions boundary policy itself.',
        'Omitting critical services (e.g., KMS, Organizations) from the boundary restriction.',
        'Failing to enforce the boundary condition on `iam:PutUserPolicy` and `iam:AttachRolePolicy`.'
      ],
      bestPractices: [
        'Enforce permissions boundaries whenever delegating `iam:CreateUser` or `iam:CreateRole` to application teams.',
        'Use an explicit Deny condition in the boundary to block modifications to security guardrails (CloudTrail, GuardDuty, AWS Config).',
        'Protect the boundary policy itself from being deleted or modified by non-security personnel.',
        'Combine permissions boundaries with AWS Organizations Service Control Policies (SCPs) for multi-account defense.'
      ],
      keyTakeaways: [
        'A permissions boundary defines the maximum ceiling of allowed permissions; it never grants permissions on its own.',
        'Effective permission = Identity Policy ALLOW ∩ Permissions Boundary ALLOW.',
        'Essential for developer self-service in serverless and DevOps workflows.',
        'Must be paired with a condition requiring new roles to attach the boundary.'
      ],
      realWorldScenario: {
        title: 'The Rogue Admin Role Creation',
        incident: 'A SaaS platform granted its DevOps team `iam:CreateRole` so they could automate microservice provisioning. A compromised CI/CD worker token was used by an attacker to execute `aws iam create-role --role-name BackdoorAdmin` and attach `arn:aws:iam::aws:policy/AdministratorAccess`. The attacker then assumed the role to disable GuardDuty and exfiltrate database backups.',
        impact: 'Complete administrative account compromise and data breach through legitimate AWS IAM APIs.',
        detectionMethod: 'Security audit flagged an unauthorized role created with AdministratorAccess and no ticket association.'
      },
      commonBeginnerMistakes: [
        'Thinking that attaching a permissions boundary grants permissions to the role (it only restricts the maximum allowed).',
        'Forgetting to protect the boundary policy itself, allowing the developer to edit the boundary and expand their access.',
        'Not applying the boundary condition to both `iam:CreateRole` and `iam:PutRolePermissionsBoundary`.',
        'Confusing Permissions Boundaries (applied to IAM principals) with SCPs (applied to AWS accounts/OUs).'
      ],
      whatACloudSecEngineerChecks: [
        'Inspect delegated developer policies to ensure `iam:CreateRole` has a strict `iam:PermissionsBoundary` condition.',
        'Verify that the boundary policy ARN cannot be modified: check for `iam:DeletePolicyVersion` or `iam:CreatePolicyVersion` restrictions.',
        'Test role creation without the boundary to confirm the request is rejected with AccessDenied.',
        'Audit all existing IAM roles for missing permissions boundaries.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: Policy Allowing Developers to Create Roles ONLY with Boundary Attached',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowRoleCreationWithBoundaryOnly",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:PutRolePolicy"
      ],
      "Resource": "arn:aws:iam::123456789012:role/app-*",
      "Condition": {
        "StringEquals": {
          "iam:PermissionsBoundary": "arn:aws:iam::123456789012:policy/DeveloperMaxPermissionsBoundary"
        }
      }
    },
    {
      "Sid": "PreventBoundaryRemovalOrTampering",
      "Effect": "Deny",
      "Action": [
        "iam:DeleteRolePermissionsBoundary",
        "iam:DeletePolicy",
        "iam:CreatePolicyVersion"
      ],
      "Resource": "arn:aws:iam::123456789012:policy/DeveloperMaxPermissionsBoundary"
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'If a user has an Identity Policy granting s3:* and a Permissions Boundary granting s3:GetObject, what is their effective permission?',
          interviewerRationale: 'Tests whether the candidate understands the intersection evaluation logic of permissions boundaries.',
          modelAnswer: 'Their effective permission is s3:GetObject only. For an action to be allowed, it must be explicitly permitted by BOTH the identity policy and the permissions boundary. Since the boundary only permits s3:GetObject, all other S3 actions (such as s3:PutObject or s3:DeleteObject) are blocked.'
        },
        {
          question: 'What is the architectural difference between an AWS Organizations SCP and an IAM Permissions Boundary?',
          interviewerRationale: 'Evaluates multi-account governance and scoping comprehension.',
          modelAnswer: 'An SCP is applied at the AWS Organizations level to entire AWS accounts or Organizational Units (OUs). It affects ALL IAM users and roles in that account (including the account root user, but excluding service-linked roles). An IAM Permissions Boundary is an IAM policy attached to a specific IAM user or role within an individual account to constrain the maximum permissions that identity can exercise or delegate.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Delegating Permissions Safely with Permissions Boundaries',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Permissions Boundaries for IAM Entities',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Blog: How to Use Permissions Boundaries to Delegate Role Creation',
          url: 'https://aws.amazon.com/blogs/security/delegate-role-creation-permissions-boundary/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Why must a policy that delegates role creation to developers also deny "iam:DeleteRolePermissionsBoundary"?',
        options: [
          { id: 'a', text: 'Because AWS automatically deletes all IAM roles when a boundary is removed.', isCorrect: false, explanation: 'Roles are not deleted when their boundary is removed.' },
          { id: 'b', text: 'Because without this deny, the developer could create a role with the boundary, immediately remove the boundary, and exercise unrestricted admin access.', isCorrect: true, explanation: 'Correct! If the developer can remove the boundary from their created role, the security control is completely negated.' },
          { id: 'c', text: 'Because permissions boundaries can only be modified by AWS Support.', isCorrect: false, explanation: 'Permissions boundaries are standard customer-managed policies managed by account admins.' },
          { id: 'd', text: 'To prevent CloudTrail from stopping log collection.', isCorrect: false, explanation: 'Boundary deletion does not interact with CloudTrail log collection.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-iam-04',
        title: 'Investigation: Developer Role Escalation via Missing Boundary',
        url: '/investigations',
        description: 'Analyze an incident where an application service role bypassed company policy to acquire administrative rights.'
      }
    },
    {
      id: 'cross-account-access',
      title: 'Cross Account Access',
      pathId: 'iam',
      level: 'Advanced',
      estimatedTime: '25 min read • 7 min check',
      badge: 'Enterprise Architecture',
      summary: 'Architect secure multi-account AWS topologies. Master sts:AssumeRole, trust policies, the Confused Deputy problem, ExternalId, and AWS Organizations Resource Access Manager (RAM).',
      overview: `Modern AWS architectures follow a multi-account strategy where separate accounts isolate Production, Staging, Development, Shared Services, Security Tooling, and Log Archives.

**How Cross-Account Access Works**:
1. **Account A (Resource / Target Account)** hosts an IAM role (e.g., \`SecurityAuditRole\`).
2. The role has a **Trust Policy** specifying that principals from **Account B (Source Account)** are authorized to assume it.
3. A user or automation in Account B calls \`sts:AssumeRole\` targeting the ARN in Account A.
4. AWS STS verifies that Account B's identity policy permits calling \`sts:AssumeRole\` AND Account A's trust policy permits Account B.
5. If both sides agree, STS issues temporary credentials for Account A's role.

**The Confused Deputy Problem & External ID**:
When a third-party SaaS vendor (e.g., Datadog, Wiz, Palo Alto) monitors multiple customers' AWS accounts, an attacker could supply a victim's AWS account ID and role ARN to the SaaS vendor. If the vendor's role blindly assumes customer roles without a unique secret, the vendor acts as a "confused deputy" and exposes the victim's account to the attacker.
To prevent this, AWS requires the use of an **ExternalId**: a unique, non-guessable secret string agreed upon between the customer and the third-party that must be matched in the role's trust policy condition.`,
      whyItMatters: 'Multi-account isolation is the single most effective barrier against account-wide ransomware or catastrophic mistakes. Mastering cross-account trust policies is essential for any cloud security engineer.',
      securityRisks: [
        'Trusting an entire external AWS Account without restricting the specific principal ARN, allowing any user in that account to assume the role.',
        'Omitting the `ExternalId` condition when granting access to third-party SaaS vendors, exposing the account to Confused Deputy attacks.',
        'Using static credentials for cross-account synchronization instead of temporary role assumption.',
        'Overly broad permissions granted to vendor security auditing tools.'
      ],
      bestPractices: [
        'Always require an `ExternalId` when establishing trust with any third-party SaaS provider.',
        'Scope the Principal element in trust policies to specific role ARNs rather than whole account roots whenever possible.',
        'Use AWS Resource Access Manager (RAM) to share subnets, Transit Gateways, and Route 53 resolver rules across accounts without role assumption.',
        'Monitor cross-account role assumptions in CloudTrail Lake or Athena by querying `userIdentity.sessionContext`.'
      ],
      keyTakeaways: [
        'Cross-account role assumption requires TWO permissions: Allow sts:AssumeRole on the caller side, and a Trust Policy on the target side.',
        'The Confused Deputy problem occurs when a third party is tricked into accessing your resources on behalf of an attacker.',
        'ExternalId provides a shared secret condition that neutralizes the Confused Deputy vulnerability.',
        'Prefer AWS Organizations Resource Access Manager (RAM) for native multi-account resource sharing.'
      ],
      realWorldScenario: {
        title: 'The Confused Deputy SaaS Takeover',
        incident: 'A healthcare company hired an external cloud cost optimization SaaS. During setup, the company created an IAM role trusting the SaaS vendor\'s AWS account without an `ExternalId`. A competitor signed up for a trial of the same SaaS, input the healthcare company\'s AWS account number and role ARN. The SaaS vendor assumed the role and displayed the healthcare company\'s entire EC2, S3, and database inventory on the competitor\'s dashboard.',
        impact: 'Massive competitive intelligence leakage and HIPAA regulatory investigation.',
        detectionMethod: 'Security audit of trust policies identified missing ExternalId conditions across 4 vendor integration roles.'
      },
      commonBeginnerMistakes: [
        'Setting `Principal: {"AWS": "123456789012"}` thinking only the root account can assume it (in reality, ANY user or role in that account with AssumeRole permissions can assume it).',
        'Forgetting that the caller in the source account also needs `sts:AssumeRole` in their identity policy.',
        'Hardcoding credentials in scripts across accounts instead of using AWS Profiles and AssumeRole.',
        'Treating the ExternalId as a password that changes daily (it should be persistent per third-party customer relationship).'
      ],
      whatACloudSecEngineerChecks: [
        'Audit all IAM roles with external account trusts: `aws iam list-roles` and check for external AWS Account IDs in `AssumeRolePolicyDocument`.',
        'Verify that every third-party vendor role enforces an `sts:ExternalId` condition.',
        'Check for unexpected cross-account CloudTrail events using Athena: `WHERE recipientAccountId != userIdentity.accountId`.',
        'Confirm that AWS Organizations SCPs restrict which accounts member accounts are allowed to trust.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: Hardened Third-Party Vendor Trust Policy with ExternalId',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SaaSVendorSecureTrust",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::987654321098:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "enterprise-client-uuid-9f82b7c4-11e2"
        }
      }
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'Explain the Confused Deputy problem in AWS and how the sts:ExternalId condition solves it.',
          interviewerRationale: 'A staple Senior Cloud Security Engineer interview question that tests architecture security, threat modeling, and third-party integrations.',
          modelAnswer: 'The Confused Deputy problem occurs when an entity (the deputy, such as a third-party SaaS monitoring platform) is coerced by an unauthorized party into performing an action on a target resource using its own authorized privileges. If the SaaS vendor assumes customer roles based solely on customer account IDs and role names, an attacker could supply a victim\'s account ID and role ARN to their own SaaS account. When the SaaS connects, it assumes the victim\'s role and exposes their data to the attacker. The ExternalId acts as a shared secret between the customer and the vendor: the vendor provides the unique ExternalId when calling sts:AssumeRole, and the customer\'s trust policy denies the call unless that exact ID matches, preventing the attacker from hijacking the vendor\'s deputy status.'
        },
        {
          question: 'Can you access an S3 bucket in Account B from Account A without assuming an IAM role?',
          interviewerRationale: 'Evaluates the candidate\'s understanding of resource-based policies vs identity-based policies across accounts.',
          modelAnswer: 'Yes. Because S3 supports resource-based policies (Bucket Policies), Account B can add Account A\'s principal ARN directly into its bucket policy statement with an explicit Allow. Account A must also ensure the principal\'s identity policy allows s3:GetObject/PutObject on Account B\'s bucket ARN. When both conditions are met, the principal can access the bucket directly using their own credentials without assuming a role.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Architecting Multi-Account Solutions on AWS',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: How to Use an External ID in Cross-Account Roles',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Blog: The Confused Deputy Problem and How to Prevent It',
          url: 'https://aws.amazon.com/blogs/security/how-to-use-external-id-when-granting-access-to-your-aws-resources/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'A third-party security scanner requests access to your AWS account. They ask you to create an IAM role trusting their AWS account ID. What is the single most critical security parameter to include in the role trust policy?',
        options: [
          { id: 'a', text: 'Set the maximum session duration to 12 hours.', isCorrect: false, explanation: 'Long session durations increase exposure window, rather than securing the trust.' },
          { id: 'b', text: 'An "sts:ExternalId" condition matching a unique string generated by the vendor for your tenant.', isCorrect: true, explanation: 'Correct! The ExternalId prevents the Confused Deputy problem where other vendor customers could hijack your role.' },
          { id: 'c', text: 'Attach the AdministratorAccess managed policy to ensure the scanner has full visibility.', isCorrect: false, explanation: 'Scanners should have read-only audit permissions, never administrative access.' },
          { id: 'd', text: 'Set the Principal to "*".', isCorrect: false, explanation: 'Setting Principal to * opens the role to every AWS account on the planet.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-iam-05',
        title: 'Investigation: Cross-Account Role Assumption Anomaly',
        url: '/investigations',
        description: 'Investigate suspicious STS AssumeRole events across production and external account boundaries.'
      }
    },
    {
      id: 'iam-best-practices',
      title: 'IAM Best Practices',
      pathId: 'iam',
      level: 'Intermediate',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Comprehensive Hardening',
      summary: 'Synthesize the complete enterprise IAM hardening checklist: credential rotation, root lockdown, IAM Identity Center (SSO), Access Analyzer, and automated compliance.',
      overview: `A mature AWS security program enforces a defense-in-depth posture across all identity vectors. This topic provides the unified enterprise checklist that cloud security engineers implement during audits and architecture reviews.

**The 8 Pillars of Enterprise IAM Hardening**:
1. **Root Account Fortification**: Hardware MFA, no access keys, root email alias sent to a distributed distribution list, emergency break-glass procedures documented and tested quarterly.
2. **Federated Identity & Single Sign-On (SSO)**: Discontinue individual IAM users with passwords. Integrate corporate identity providers (Okta, Azure AD, Google Workspace) via AWS IAM Identity Center (formerly AWS SSO).
3. **Automated Credential Rotation**: Enforce maximum 90-day rotation on all legacy static keys; automatically disable keys unused for 45 days.
4. **Least-Privilege Enforcement**: Prohibit wildcard \`*\` actions on sensitive services; mandate explicit Resource ARNs.
5. **Session Duration Scoping**: Limit role session lengths (e.g., 1 hour for engineers, 15 minutes for automated pipelines).
6. **Continuous Anomaly Detection**: Ingest IAM CloudTrail events into Amazon GuardDuty to detect compromised credentials, credential stuffing, and unusual API patterns.
7. **Automated Drift Detection & Access Analyzer**: Continuously evaluate all policies for cross-account or public exposure.
8. **Multi-Account Governance**: Enforce Organization-wide Service Control Policies (SCPs) that prevent disabling security services or deploying unapproved regions.`,
      whyItMatters: 'Security is a continuous operational discipline. Implementing a structured checklist eliminates the low-hanging fruit vulnerabilities that cause over 90% of real-world cloud security breaches.',
      securityRisks: [
        'Dormant contractor accounts remaining active after project completion.',
        'Unmonitored IAM users with permanent administrative access.',
        'Failure to detect credential compromise until financial or data loss occurs.',
        'Inability to audit who accessed sensitive data due to shared generic credentials.'
      ],
      bestPractices: [
        'Review the IAM Credential Report monthly to eliminate stale credentials.',
        'Enable AWS IAM Access Analyzer across all AWS Organizations regions.',
        'Use AWS Config rules (e.g., `iam-user-mfa-enabled`, `access-keys-rotated`) to automatically remediate non-compliant configurations.',
        'Conduct simulated "break-glass" drills twice a year to ensure emergency root access works without delay.'
      ],
      keyTakeaways: [
        'Identity is the first and most critical perimeter in modern cloud security.',
        'Zero IAM users is the ultimate enterprise goal — all human access should flow through AWS IAM Identity Center (SSO).',
        'Automated detection and continuous policy auditing must replace manual point-in-time checks.',
        'Break-glass root accounts require strict physical security and dual-custody hardware MFA.'
      ],
      realWorldScenario: {
        title: 'The Orphaned Contractor Backdoor',
        incident: 'A third-party contractor finished their engagement 8 months prior, but their IAM user credentials were not offboarded. The contractor\'s personal laptop was infected with infostealer malware. The threat actor extracted the dormant AWS credentials and used them to exfiltrate proprietary machine learning model weights from an internal S3 bucket.',
        impact: 'Loss of core intellectual property and competitive advantage valued in excess of $4M.',
        detectionMethod: 'Security audit using AWS IAM Access Advisor identified an active login from an account that had been dormant for 240 days.'
      },
      commonBeginnerMistakes: [
        'Sharing credentials among multiple developers instead of issuing individual SSO identities.',
        'Disabling security services like GuardDuty or CloudTrail to reduce minor bill charges.',
        'Ignoring IAM Access Analyzer warnings about external trust relationships.',
        'Not automating offboarding with the corporate HR/IT system.'
      ],
      whatACloudSecEngineerChecks: [
        'Generate and download the IAM credential report: `aws iam generate-credential-report` and `aws iam get-credential-report`.',
        'Verify AWS Config rule evaluation status for IAM: `aws configservice get-compliance-details-by-config-rule --config-rule-name iam-user-mfa-enabled`.',
        'Audit active IAM access keys older than 90 days: `aws iam list-access-keys`.',
        'Verify GuardDuty is enabled across all active and inactive AWS regions.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: Service Control Policy (SCP) Denying Leaving AWS Organizations',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PreventLeavingOrganization",
      "Effect": "Deny",
      "Action": [
        "organizations:LeaveOrganization"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PreventDisablingSecurityServices",
      "Effect": "Deny",
      "Action": [
        "cloudtrail:StopLogging",
        "cloudtrail:DeleteTrail",
        "guardduty:DeleteDetector",
        "guardduty:DisassociateFromMasterAccount",
        "config:DeleteDeliveryChannel"
      ],
      "Resource": "*"
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'If you joined a company as the Lead Cloud Security Engineer and found 150 IAM users with static keys and no MFA, how would you prioritize remediation?',
          interviewerRationale: 'Evaluates executive prioritization, risk management, and the ability to remediate high-risk environments without disrupting business operations.',
          modelAnswer: 'I would prioritize into 3 phases: Phase 1 (Immediate Containment, Days 1-3): Lock down the Root account with hardware MFA and delete any root access keys. Check the credential report for inactive keys (>90 days unused) and immediately disable them. Enable GuardDuty and CloudTrail across all regions for immediate threat visibility. Phase 2 (Identity Centralization, Weeks 1-4): Deploy AWS IAM Identity Center (SSO) integrated with the corporate IdP (e.g. Okta). Mandate MFA for all console access. Create permission sets mapped to job roles. Phase 3 (Deprecation & Enforcement, Weeks 4-8): Migrate human developers from IAM users to SSO. Enforce an automated key rotation policy for service accounts, transitioning compute workloads to IAM Roles and CI/CD to OIDC federation. Finally, delete the legacy IAM users and enforce an SCP preventing future IAM user creation.'
        },
        {
          question: 'What is AWS IAM Access Analyzer and how does it detect external access risks?',
          interviewerRationale: 'Assesses familiarity with native AWS automated reasoning security tooling.',
          modelAnswer: 'IAM Access Analyzer uses automated mathematical reasoning (formal logic) to analyze resource-based policies across S3 buckets, KMS keys, SQS queues, Secrets Manager secrets, and IAM role trust policies. It determines whether any policy allows access to principals outside your trusted zone (either your AWS account or your entire AWS Organization). It continuously flags findings, categorizing public access vs external account access, helping engineers detect accidental data leaks before incidents occur.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: AWS IAM Best Practices and Security Governance',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Security Best Practices in IAM',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Well-Architected Framework: Security Pillar (Identity & Access)',
          url: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/identity-and-access-management.html',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Which of the following represents the single best identity architecture for enterprise human developers accessing AWS?',
        options: [
          { id: 'a', text: 'Create an individual IAM user in each AWS account with static access keys and console passwords.', isCorrect: false, explanation: 'Creates massive credential sprawl, rotation overhead, and security risk.' },
          { id: 'b', text: 'Share a single "Admin" IAM user account among all senior engineers to simplify permission management.', isCorrect: false, explanation: 'Violates non-repudiation, auditing, and least-privilege principles.' },
          { id: 'c', text: 'Federate the corporate Identity Provider (IdP) with AWS IAM Identity Center, enforcing phishing-resistant MFA and assigning temporary role sessions.', isCorrect: true, explanation: 'Correct! Centralized SSO eliminates static credentials and provides automated onboarding and offboarding.' },
          { id: 'd', text: 'Store AWS root credentials in a shared company password manager.', isCorrect: false, explanation: 'Root credentials should never be shared or used for developer access.' }
        ]
      },
      bridgeToLabs: {
        type: 'Architecture',
        id: 'arch-iam-01',
        title: 'Architecture Review: Multi-Account IAM Governance & Landing Zone',
        url: '/architecture-reviews',
        description: 'Audit an enterprise multi-account blueprint for trust boundary and credential sprawl vulnerabilities.'
      }
    }
  ]
}
