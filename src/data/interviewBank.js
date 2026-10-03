// =========================================================================
// SeCloudive Enterprise Interview Question & Scenario Bank
// =========================================================================

export const INTERVIEW_ROLES = [
  {
    id: 'cloud-sec-eng',
    title: 'Cloud Security Engineer',
    badge: 'FLAGSHIP ROLE',
    shortDesc: 'IAM boundaries, infrastructure-as-code defense, GuardDuty detection, and Well-Architected governance.',
    salaryRange: '$145,000 - $210,000',
    marketDemand: 'VERY HIGH',
    mustKnowSkills: ['AWS IAM & SCPs', 'Terraform Hardening', 'CloudTrail Auditing', 'VPC Architecture', 'KMS Encryption'],
    questions: {
      beginner: [
        {
          id: 'cse-b1',
          question: 'What is the difference between an IAM Role and an IAM User in AWS, and why do security teams mandate roles for EC2 and Lambda compute workloads?',
          sampleAnswerHint: 'Roles use short-lived temporary security credentials (AWS STS) that rotate automatically, eliminating the risk of long-lived access key leaks.',
          rubric: 'Mentions STS, temporary credentials, automatic rotation, and elimination of static access keys.'
        },
        {
          id: 'cse-b2',
          question: 'Explain how S3 Block Public Access works at the account level versus the bucket level, and what happens if a bucket policy grants public access when the account-level block is active?',
          sampleAnswerHint: 'Account-level BPA acts as a centralized preventative guardrail. If active, it overrides any permissive bucket policy, preventing data exposure.',
          rubric: 'Identifies the override hierarchy, preventative nature of BPA, and defense-in-depth.'
        }
      ],
      intermediate: [
        {
          id: 'cse-i1',
          question: 'How does IMDSv2 mitigate Server-Side Request Forgery (SSRF) vulnerabilities compared to IMDSv1 on AWS EC2 instances?',
          sampleAnswerHint: 'IMDSv2 requires a session-oriented PUT request with the X-aws-ec2-metadata-token-ttl-seconds header to obtain a token, and enforces a network hop-limit of 1 so reverse proxies cannot forward token requests.',
          rubric: 'Highlights session token requirement, PUT method requirement, and hop-limit 1 packet restriction.'
        },
        {
          id: 'cse-i2',
          question: 'In an AWS Organization, what happens if an IAM policy allows s3:PutObject, but the parent OU has a Service Control Policy (SCP) that explicitly denies s3:PutObject?',
          sampleAnswerHint: 'An explicit deny in an SCP overrides any IAM allow statement across the entire account boundary. The action will be denied.',
          rubric: 'Explains policy evaluation logic, explicit deny precedence, and account boundary guardrails.'
        }
      ],
      advanced: [
        {
          id: 'cse-a1',
          question: 'You must architect a multi-account AWS environment where an audit tool in Account A assumes a cross-account role in Account B. How do you prevent the Confused Deputy problem?',
          sampleAnswerHint: 'Require an external ID (sts:ExternalId condition) in the trust policy and validate the calling principal ARN (aws:PrincipalArn).',
          rubric: 'Explains Confused Deputy, sts:ExternalId condition, and trust relationship scoping.'
        },
        {
          id: 'cse-a2',
          question: 'How do you enforce that all data written to an S3 data lake must be encrypted with a specific Customer Managed KMS Key (CMK) and reject objects encrypted with AWS-managed keys?',
          sampleAnswerHint: 'Implement an S3 bucket policy denying s3:PutObject unless s3:x-amz-server-side-encryption-aws-kms-key-id matches the CMK ARN and the encryption header is aws:kms.',
          rubric: 'Specifies bucket policy condition keys: s3:x-amz-server-side-encryption and kms key ID check.'
        }
      ],
      scenario: [
        {
          id: 'cse-s1',
          question: 'Scenario: GuardDuty triggers a finding "CryptoCurrency:EC2/BitcoinTool.B!DNS" on an internal application server. Walk me through your first 60 minutes of response.',
          sampleAnswerHint: '1. Triage finding & isolate EC2 via quarantine Security Group. 2. Capture memory & EBS snapshot for forensics. 3. Revoke IAM instance profile temporary credentials. 4. Pivot into CloudTrail & VPC Flow Logs. 5. Notify business stakeholders and patch root cause.',
          rubric: 'Order of operations: quarantine first, preserve forensic evidence before termination, revoke credentials, analyze telemetry, patch vulnerability.'
        }
      ]
    }
  },
  {
    id: 'soc-analyst',
    title: 'SOC Analyst / Incident Responder',
    badge: 'DETECTION & RESPONSE',
    shortDesc: 'SIEM alert triage, CloudTrail log analysis, GuardDuty investigation, and threat hunting.',
    salaryRange: '$95,000 - $145,000',
    marketDemand: 'HIGH',
    mustKnowSkills: ['CloudTrail Triage', 'GuardDuty Alerting', 'VPC Flow Logs', 'MITRE ATT&CK', 'Playbook Execution'],
    questions: {
      beginner: [
        {
          id: 'soc-b1',
          question: 'What is the difference between CloudTrail management events and data events, and why aren’t S3 data events enabled by default on all buckets?',
          sampleAnswerHint: 'Management events capture control plane API calls (CreateBucket, RunInstances). Data events capture object-level operations (GetObject, PutObject). Data events are high volume and incur additional logging costs.',
          rubric: 'Distinguishes control plane vs data plane and highlights volume/cost considerations.'
        }
      ],
      intermediate: [
        {
          id: 'soc-i1',
          question: 'You see an AWS CloudTrail event with eventSource "signin.amazonaws.com" and errorMessage "Failed authentication" repeated 40 times in 2 minutes for different usernames. What is this and how do you triage it?',
          sampleAnswerHint: 'This indicates a password spraying or credential stuffing attack. Triage: identify the source IP, check if any accounts succeeded, verify MFA enforcement, and block the IP at AWS WAF or perimeter firewall.',
          rubric: 'Identifies password spraying, checks for successful sign-ins, verifies MFA, blocks source IP.'
        }
      ],
      advanced: [
        {
          id: 'soc-a1',
          question: 'An attacker gains access to an IAM user key and deletes the primary CloudTrail trail. How do you detect this and what preventative architecture stops it?',
          sampleAnswerHint: 'Detect via Amazon EventBridge rule on StopLogging or DeleteTrail. Prevent via SCP in the AWS Organization management account denying cloudtrail:DeleteTrail and cloudtrail:StopLogging across all member accounts.',
          rubric: 'Combines EventBridge alert detection with SCP-based preventative immutability.'
        }
      ],
      scenario: [
        {
          id: 'soc-s1',
          question: 'Scenario: GuardDuty reports "UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS". What does this alert mean and what are your immediate containment steps?',
          sampleAnswerHint: 'Means EC2 instance profile STS credentials obtained via metadata service were used from an IP address outside of AWS. Containment: revoke active STS sessions by attaching an inline deny policy with aws:TokenIssueTime, quarantine EC2 instance, and enforce IMDSv2.',
          rubric: 'Understands credential theft outside AWS, uses aws:TokenIssueTime to revoke active tokens immediately.'
        }
      ]
    }
  },
  {
    id: 'devsecops-eng',
    title: 'DevSecOps Engineer',
    badge: 'CI/CD & IAC HARDENING',
    shortDesc: 'Automating security guardrails in GitHub Actions, Terraform static analysis with Checkov, and container scanning.',
    salaryRange: '$140,000 - $195,000',
    marketDemand: 'VERY HIGH',
    mustKnowSkills: ['Terraform Security', 'Checkov / tfsec', 'GitHub Actions', 'Container Security (Trivy)', 'Secrets Scanning'],
    questions: {
      beginner: [
        {
          id: 'dso-b1',
          question: 'How do you prevent developers from committing hardcoded AWS access keys or passwords to Git repositories?',
          sampleAnswerHint: 'Use pre-commit hooks (like Gitleaks or git-secrets), enforce centralized secret scanning in GitHub Actions, and utilize AWS Secrets Manager or Parameter Store instead of plaintext config files.',
          rubric: 'Covers shift-left pre-commit hooks, CI/CD scanning, and dynamic secret management.'
        }
      ],
      intermediate: [
        {
          id: 'dso-i1',
          question: 'What is the role of tools like Checkov and tfsec in a Terraform deployment pipeline, and how do you handle security findings that block a production build?',
          sampleAnswerHint: 'Static analysis scanners identify misconfigurations before deployment. High/Critical findings fail the pipeline. Exceptions require signed architectural waivers and temporary suppression with expiration dates.',
          rubric: 'Explains IaC static analysis, automated build gates, and controlled exception workflows.'
        }
      ],
      advanced: [
        {
          id: 'dso-a1',
          question: 'How do you implement OIDC (OpenID Connect) authentication between GitHub Actions and AWS, and why is it superior to storing static AWS credentials in repository secrets?',
          sampleAnswerHint: 'GitHub Actions exchanges a short-lived OIDC JWT token with AWS STS for temporary IAM role credentials. Eliminates static long-lived credentials in GitHub repository secrets and enforces strict audience/subject claims.',
          rubric: 'Explains OIDC trust relationship, STS AssumeRoleWithWebIdentity, and elimination of long-lived secrets.'
        }
      ],
      scenario: [
        {
          id: 'dso-s1',
          question: 'Scenario: A critical zero-day is announced in an open-source Docker base image used across 40 microservices on AWS EKS. How do you audit, prioritize, and automate the remediation rollout?',
          sampleAnswerHint: '1. Scan ECR container registries using automated vulnerability scanning (Amazon Inspector/Trivy). 2. Identify running pods via Kubernetes admission controller. 3. Update parent base image in centralized pipeline. 4. Trigger canary builds and automated rolling updates.',
          rubric: 'Registry scanning, runtime visibility, automated base image patching, and safe deployment rollback.'
        }
      ]
    }
  }
]

export const ARCHITECTURE_INTERVIEW_SCENARIOS = [
  {
    id: 'arch-scen-1',
    title: 'Public Facing Multi-Tier E-Commerce Architecture',
    companyContext: 'High-growth online retailer processing 100k daily credit card orders on AWS.',
    architectureSummary: 'Internet -> Public ALB -> Auto Scaling EC2 Fleet (Public Subnet) -> RDS MySQL Database (Single AZ).',
    diagramNodes: [
      { id: 'n1', label: 'Internet', type: 'external' },
      { id: 'n2', label: 'Public ALB', type: 'lb', subnet: 'Public Subnet 10.0.1.0/24' },
      { id: 'n3', label: 'EC2 App Nodes', type: 'compute', subnet: 'Public Subnet 10.0.1.0/24', flag: 'Direct Public IP Assigned' },
      { id: 'n4', label: 'RDS MySQL', type: 'database', subnet: 'Public Subnet 10.0.1.0/24', flag: 'Publicly Accessible = true' }
    ],
    knownFlaws: [
      'EC2 application instances reside in public subnets with direct internet IPs.',
      'RDS database has publiclyAccessible = true and resides in public subnet.',
      'Single AZ deployment introduces catastrophic availability risk.',
      'No WAF attached to the Public Application Load Balancer.'
    ],
    interviewerExpectations: [
      'Candidate must recommend moving EC2 to private subnets with NAT Gateway egress.',
      'Candidate must mandate moving RDS to isolated database subnets with Multi-AZ replication.',
      'Candidate must attach AWS WAF with rate-limiting and SQL injection rule groups.'
    ]
  },
  {
    id: 'arch-scen-2',
    title: 'FinTech Serverless Payment Processing Architecture',
    companyContext: 'Banking API handling account balances and wire transactions.',
    architectureSummary: 'Mobile Client -> Amazon API Gateway -> Lambda Functions -> DynamoDB + S3 Statement Archive.',
    diagramNodes: [
      { id: 'n1', label: 'Mobile App', type: 'client' },
      { id: 'n2', label: 'API Gateway', type: 'api', flag: 'Missing API Key / JWT Authorizer' },
      { id: 'n3', label: 'Payment Lambda', type: 'serverless', flag: 'IAM Role has AdministratorAccess' },
      { id: 'n4', label: 'DynamoDB', type: 'database', flag: 'Default AWS KMS Key' },
      { id: 'n5', label: 'S3 Statements', type: 'storage', flag: 'No Object Lock or Versioning' }
    ],
    knownFlaws: [
      'Lambda execution role possesses overly broad permissions (AdministratorAccess).',
      'API Gateway endpoints lack token authentication / Cognito authorizer.',
      'S3 bucket lacks Object Lock and versioning, exposing financial statements to ransomware deletion.'
    ],
    interviewerExpectations: [
      'Enforce least-privilege IAM policy scoped strictly to dynamodb:PutItem and s3:PutObject.',
      'Implement JWT validation via Amazon Cognito or custom Lambda Authorizer.',
      'Enable S3 Versioning, Object Lock Compliance Mode, and Customer Managed KMS key.'
    ]
  }
]

export const INCIDENT_RESPONSE_INTERVIEW_SCENARIOS = [
  {
    id: 'ir-scen-1',
    title: 'Compromised IAM Developer Key & Automated Cryptomining Spree',
    severity: 'CRITICAL',
    mitreTactic: 'Impact / Resource Hijacking (T1496)',
    scenarioPrompt: 'At 02:14 UTC on a Saturday, an engineer receives an automated AWS Budgets alert indicating spend exceeded 400% of normal baseline. GuardDuty displays 12 findings for CryptoCurrency:EC2/BitcoinTool.B!DNS across 3 unapproved AWS regions (ap-southeast-1, eu-central-1, sa-east-1).',
    questions: [
      {
        phase: 'Detection',
        question: 'What CloudTrail events and telemetry do you examine immediately to determine which credential was compromised?',
        sampleResponse: 'Search CloudTrail for RunInstances events in the unauthorized regions, filter by eventName and check the userIdentity block for user ARN, access key ID, and source IP.'
      },
      {
        phase: 'Investigation',
        question: 'How do you ascertain if the adversary created persistence mechanisms or secondary IAM accounts?',
        sampleResponse: 'Query CloudTrail for CreateUser, CreateAccessKey, AttachUserPolicy, PutUserPolicy, and CreateLoginProfile within the incident timeframe across all regions.'
      },
      {
        phase: 'Containment',
        question: 'What is your immediate containment action plan?',
        sampleResponse: '1. Invalidate compromised access keys immediately (UpdateAccessKey status=Inactive). 2. Attach an explicit DenyAll inline policy to the user. 3. Terminate unauthorized EC2 GPU instances. 4. Revoke active STS temporary sessions.'
      },
      {
        phase: 'Remediation',
        question: 'What preventative guardrail stops unauthorized region deployment from ever occurring again?',
        sampleResponse: 'Implement an AWS Organizations Service Control Policy (SCP) with a requestedRegion condition that restricts API calls to authorized regions only (e.g. us-east-1 and us-west-2).'
      }
    ]
  }
]
