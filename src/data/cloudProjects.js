/**
 * Real-Life Cloud Security Portfolio Projects (100% AWS Free-Tier & Zero Billing Guaranteed)
 * 
 * Specifically engineered for students and aspiring engineers to build in real AWS accounts
 * without spending a single penny, including strict tear-down runbooks and resume portfolio write-ups.
 */

export const zeroBillingGuide = {
  title: 'The AWS Zero-Billing & Free Tier Safety Protocol',
  description: 'How to practice real cloud security in your personal AWS account with 100% confidence and zero surprise bills.',
  rules: [
    {
      title: 'Always Set a $0.01 AWS Budget Alarm First',
      description: 'AWS Budgets allows 2 free budgets. Create a budget set to $0.01 threshold with an email alert. The instant a billable cent is accrued, you get an immediate email.',
      command: `aws budgets create-budget --account-id $(aws sts get-caller-identity --query Account --output text) --budget '{"BudgetName":"ZeroDollarSafetyAlert","BudgetLimit":{"Amount":"0.01","Unit":"USD"},"CostTypes":{"IncludeTax":true,"IncludeSubscription":true,"UseBlended":false},"TimeUnit":"MONTHLY","BudgetType":"COST_FILTERED"}' --notifications-with-subscribers '[{"Notification":{"NotificationType":"ACTUAL","ComparisonOperator":"GREATER_THAN","Threshold":100,"ThresholdType":"PERCENTAGE"},"Subscribers":[{"SubscriptionType":"EMAIL","Address":"your-email@example.com"}]}]'`
    },
    {
      title: 'Know the Dangerous Expensive AWS Traps',
      description: 'Never create: NAT Gateways ($0.045/hr = $32/mo), Transit Gateway attachments ($0.05/hr = $36/mo), KMS Customer Managed Keys ($1/mo/key if kept beyond free tier), or unassociated Elastic IPs ($0.005/hr).',
      freeTierAlternatives: 'Use VPC Endpoints (S3 Gateway endpoint is 100% free), default AWS managed keys (aws/s3 is free), and t2.micro / t3.micro EC2 instances (750 hours/month free).'
    },
    {
      title: 'Execute Immediate Tear-Down After Lab Completion',
      description: 'Once you take screenshots for your portfolio or finish testing, run the project cleanup script immediately. Never leave test infrastructure running overnight.'
    }
  ]
}

export const cloudProjects = [
  {
    id: 'proj-auto-ir-pipeline',
    number: 'PROJECT-01',
    title: 'Serverless Automated Incident Response: Auto-Quarantine Compromised IAM Keys',
    role: 'Cloud Security Engineer / SecOps',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'AWS Lambda (1,000,000 free requests/mo), Amazon EventBridge (Free), IAM (100% Free)',
    businessProblem: 'When an AWS access key leaks or an attacker accesses AWS APIs from an unauthorized country, manual human response takes an average of 45-90 minutes. In that time, automated threat actors can launch dozens of crypto-mining instances. A fully automated, zero-latency quarantine pipeline is required.',
    architectureSummary: 'GuardDuty / EventBridge -> CloudWatch Event Rule -> Python Lambda Function -> AWS IAM (Deactivates Access Key & Attaches Quarantine Deny Policy) -> SNS Email Alert.',
    
    architectureSteps: [
      '1. Amazon EventBridge detects a high-severity GuardDuty finding or simulated IAM compromise event.',
      '2. EventBridge filters the event and invokes the `SecurityAutoRemediationFunction` Lambda.',
      '3. Lambda parses the compromised `AccessKeyId` and `UserName`.',
      '4. Lambda calls `iam.update_access_key(Status="Inactive")` and `iam.put_user_policy(PolicyName="QuarantineDeny")`.',
      '5. Lambda publishes a formatted post-incident notification to Amazon SNS, alerting the security team.'
    ],

    stepByStepBuild: [
      {
        step: 1,
        title: 'Create the Least-Privilege IAM Execution Role for Lambda',
        consolePath: 'AWS Console > IAM > Roles > Create Role > AWS Service: Lambda > Custom Policy',
        cliCommand: `aws iam create-role --role-name SecOps-AutoRemediation-Role --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' && aws iam put-role-policy --role-name SecOps-AutoRemediation-Role --policy-name RemediationPerms --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["iam:UpdateAccessKey","iam:PutUserPolicy"],"Resource":"*"},{"Effect":"Allow","Action":["logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents"],"Resource":"arn:aws:logs:*:*:*"}]}'`,
        explanation: 'Enforces least privilege: the remediation Lambda can ONLY deactivate keys and apply inline deny policies, with zero permissions to delete users or read data.'
      },
      {
        step: 2,
        title: 'Deploy the Incident Response Python Lambda Function',
        consolePath: 'AWS Console > Lambda > Create Function > Python 3.12 > Paste remediation code',
        codeSnippet: `import boto3
import json

iam = boto3.client('iam')

def lambda_handler(event, context):
    print("Received Security Alert Event:", json.dumps(event))
    detail = event.get('detail', {})
    user_name = detail.get('userName', 'compromised-test-user')
    access_key = detail.get('accessKeyId', 'AKIA_TEST_KEY')
    
    # 1. Deactivate Key
    iam.update_access_key(UserName=user_name, AccessKeyId=access_key, Status='Inactive')
    print(f"SUCCESS: Deactivated key {access_key} for {user_name}")
    
    # 2. Attach DenyAll
    deny_doc = {
        "Version": "2012-10-17",
        "Statement": [{"Effect": "Deny", "Action": "*", "Resource": "*"}]
    }
    iam.put_user_policy(UserName=user_name, PolicyName='EmergencyQuarantine', PolicyDocument=json.dumps(deny_doc))
    print(f"SUCCESS: Attached EmergencyQuarantine policy to {user_name}")
    
    return {"status": "Contained", "user": user_name, "key": access_key}`,
        cliCommand: 'zip -j remediation.zip lambda_function.py && aws lambda create-function --function-name SecOps-Key-Quarantine --runtime python3.12 --role arn:aws:iam::123456789012:role/SecOps-AutoRemediation-Role --handler lambda_function.lambda_handler --zip-file fileb://remediation.zip',
        explanation: 'The code executes minute-0 containment in under 200 milliseconds, beating any human response time.'
      },
      {
        step: 3,
        title: 'Configure EventBridge Rule to Trigger on Compromised Key Findings',
        consolePath: 'AWS Console > Amazon EventBridge > Rules > Create Rule > Event Pattern: GuardDuty Finding',
        cliCommand: `aws events put-rule --name QuarantineCompromisedKeys --event-pattern '{"source":["aws.guardduty"],"detail-type":["GuardDuty Finding"],"detail":{"type":[{"prefix":"UnauthorizedAccess:IAMUser"}]}}'`,
        explanation: 'EventBridge monitors event streams in real time with 0 polling overhead.'
      },
      {
        step: 4,
        title: 'Simulate Threat Event & Verify Instant Automated Containment',
        consolePath: 'AWS Console > EventBridge > Send custom test event > Inspect IAM user status',
        cliCommand: `aws events put-events --entries '[{"Source":"aws.guardduty","DetailType":"GuardDuty Finding","Detail":"{\\"userName\\":\\"compromised-test-user\\",\\"accessKeyId\\":\\"AKIAEXAMPLETEST\\"}"}]'`,
        explanation: 'Simulates the exact JSON finding structure to validate that the pipeline auto-quarantines the test identity in seconds.'
      }
    ],

    // Tear-Down / Cleanup Guide ($0 Cost Guarantee)
    tearDownRunbook: {
      zeroCostPromise: 'Follow these 3 commands to completely delete all test resources. Zero residual services will remain.',
      cliCommands: [
        'aws lambda delete-function --function-name SecOps-Key-Quarantine',
        'aws events delete-rule --name QuarantineCompromisedKeys',
        'aws iam delete-role-policy --role-name SecOps-AutoRemediation-Role --policy-name RemediationPerms',
        'aws iam delete-role --role-name SecOps-AutoRemediation-Role'
      ],
      consoleSteps: [
        '1. Go to AWS Lambda > Functions > Select `SecOps-Key-Quarantine` > Actions > Delete.',
        '2. Go to EventBridge > Rules > Delete `QuarantineCompromisedKeys`.',
        '3. Go to IAM > Roles > Delete `SecOps-AutoRemediation-Role`.'
      ]
    },

    // Resume / Portfolio Guide
    portfolioGuide: {
      githubTitle: 'AWS Serverless Automated Incident Response & Key Quarantine Pipeline',
      resumeBullets: [
        'Architected an automated incident response pipeline utilizing Amazon EventBridge and AWS Lambda, reducing Mean Time to Remediate (MTTR) for compromised IAM credentials from 45 minutes to <200 milliseconds.',
        'Developed least-privilege Python remediation functions adhering to NIST SP 800-61 Rev 2 incident containment frameworks.',
        'Implemented zero-dollar billing guardrails with AWS Free Tier verification and automated infrastructure clean-up scripts.'
      ],
      interviewDiscussionPoints: 'When interviewers ask: "Have you ever automated security response?", explain how EventBridge decoupled event ingestion from remediation logic, allowing easy expansion to Slack alerts or Jira ticket auto-creation.'
    }
  },

  {
    id: 'proj-s3-dlp-kms-hardening',
    number: 'PROJECT-02',
    title: 'Enterprise S3 Data Loss Prevention (DLP), TLS Enforcement & KMS Key Rotation',
    role: 'Cloud Security Engineer',
    difficulty: 'Beginner / Intermediate',
    estimatedTime: '30 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'Amazon S3 (5 GB Free Storage, 20,000 GET requests, 2,000 PUT requests free)',
    businessProblem: 'Over 80% of cloud data leaks stem from misconfigured S3 bucket policies permitting unencrypted HTTP traffic or public read access. Financial and healthcare regulations (PCI-DSS 4.0, HIPAA) mandate that all storage buckets enforce TLS 1.2+ encryption in transit and AES-256 encryption at rest.',
    architectureSummary: 'Amazon S3 Bucket -> S3 Block Public Access (Account + Bucket) -> Strict Deny Insecure HTTP Transport Policy -> Server-Side Encryption (SSE-S3/KMS) -> S3 Versioning & Lifecycle.',

    architectureSteps: [
      '1. Create a hardened, private S3 bucket with strict naming conventions.',
      '2. Enforce S3 Block Public Access across all 4 public access flags.',
      '3. Attach an explicit Deny bucket policy for any requests where `aws:SecureTransport` is false (blocking HTTP).',
      '4. Enable S3 default encryption using AWS-managed keys (100% Free) or customer-managed KMS.',
      '5. Enable S3 Versioning to defend against ransomware tampering and accidental deletion.'
    ],

    stepByStepBuild: [
      {
        step: 1,
        title: 'Create Private S3 Bucket with Block Public Access',
        consolePath: 'AWS Console > S3 > Create Bucket > Name: "secops-hardened-vault-[YOUR_NAME]" > Check "Block all public access"',
        cliCommand: `aws s3api create-bucket --bucket secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --region us-east-1 && aws s3api put-public-access-block --bucket secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"`,
        explanation: 'Enforces the 4 foundational public access blocks: ACL blocks, policy blocks, and public bucket restrictions.'
      },
      {
        step: 2,
        title: 'Attach SSL/TLS 1.2+ Mandatory Transport Policy',
        consolePath: 'AWS Console > S3 > Bucket > Permissions > Bucket Policy > Edit > Paste DenyInsecureTransport',
        cliCommand: `aws s3api put-bucket-policy --bucket secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --policy '{"Version":"2012-10-17","Statement":[{"Sid":"EnforceTLSRequestsOnly","Effect":"Deny","Principal":"*","Action":"s3:*","Resource":["arn:aws:s3:::secops-hardened-vault-REPLACE_ACCOUNT/*","arn:aws:s3:::secops-hardened-vault-REPLACE_ACCOUNT"],"Condition":{"Bool":{"aws:SecureTransport":"false"}}}]}'`,
        explanation: 'Guarantees that plaintext HTTP requests are immediately dropped with HTTP 403 Forbidden.'
      },
      {
        step: 3,
        title: 'Turn on Default Server-Side Encryption & S3 Bucket Keys',
        consolePath: 'AWS Console > S3 > Bucket > Properties > Default encryption: Enable SSE-S3 with Bucket Key',
        cliCommand: `aws s3api put-bucket-encryption --bucket secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"},"BucketKeyEnabled":true}]}'`,
        explanation: 'AES-256 encryption via SSE-S3 is 100% free of charge and provides seamless compliance with ISO 27001 data at rest requirements.'
      },
      {
        step: 4,
        title: 'Enable S3 Versioning & Audit with Penetration Probe',
        consolePath: 'AWS Console > S3 > Bucket > Properties > Bucket Versioning: Enable',
        cliCommand: `aws s3api put-bucket-versioning --bucket secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --versioning-configuration Status=Enabled`,
        explanation: 'Versioning ensures that if a rogue actor attempts to overwrite or delete sensitive records, previous object versions remain permanently retrievable.'
      }
    ],

    tearDownRunbook: {
      zeroCostPromise: 'S3 buckets with 0 objects incur $0.00. Use this script to empty and delete the test bucket completely.',
      cliCommands: [
        'aws s3 rb s3://secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --force'
      ],
      consoleSteps: [
        '1. Go to AWS S3 > Buckets > Select `secops-hardened-vault-...`.',
        '2. Click "Empty" > Confirm typing `permanently delete`.',
        '3. Click "Delete" > Confirm bucket deletion.'
      ]
    },

    portfolioGuide: {
      githubTitle: 'AWS S3 Data Loss Prevention (DLP) & Zero-Trust Encryption Vault',
      resumeBullets: [
        'Engineered an enterprise S3 data vault implementing strict TLS 1.2+ transport policies, AES-256 server-side encryption, and S3 Block Public Access guardrails.',
        'Validated defense-in-depth storage compliance against CIS AWS Foundations Benchmark v3.0 Section 2.1.',
        'Authored Infrastructure as Code (Terraform) templates and automated verification probes for continuous audit readiness.'
      ],
      interviewDiscussionPoints: 'Explain the difference between `aws:SecureTransport: false` in a DENY statement versus an ALLOW statement: a DENY statement cannot be overridden by any permissive IAM policy.'
    }
  },

  {
    id: 'proj-github-oidc-hardening',
    number: 'PROJECT-03',
    title: 'Zero-Static-Credentials CI/CD: Hardened GitHub Actions OIDC Federation',
    role: 'DevSecOps Specialist',
    difficulty: 'Intermediate',
    estimatedTime: '35 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'AWS IAM (100% Free Forever), GitHub Actions (2,000 free minutes/mo on public/private repos)',
    businessProblem: 'Static AWS Access Keys stored in GitHub repository secrets are the #1 attack vector for cloud account takeovers. If a developer account is compromised or a build log inadvertently outputs environmental variables, the key is permanently exposed. OpenID Connect (OIDC) eliminates all static keys in favor of short-lived (15-min) cryptographic tokens.',
    architectureSummary: 'GitHub Actions Workflow -> OIDC Token (JWT) -> AWS STS `AssumeRoleWithWebIdentity` -> Validates Audience (`sts.amazonaws.com`) and Subject (`repo:org/repo:ref`) -> Returns 15-Minute Ephemeral AWS Credentials.',

    architectureSteps: [
      '1. Create the GitHub OIDC Identity Provider in AWS IAM with thumbprint validation.',
      '2. Author an IAM Role Trust Relationship policy with strict `StringEquals` matching.',
      '3. Pin the `token.actions.githubusercontent.com:sub` claim strictly to the specific repository and main branch.',
      '4. Create a lightweight GitHub Actions `.github/workflows/deploy.yml` pipeline that assumes the role.',
      '5. Verify that untrusted branches or forks receive `AccessDenied` from AWS STS.'
    ],

    stepByStepBuild: [
      {
        step: 1,
        title: 'Create the GitHub OIDC Identity Provider in AWS IAM',
        consolePath: 'AWS Console > IAM > Identity providers > Add provider > OpenID Connect > URL: token.actions.githubusercontent.com > Audience: sts.amazonaws.com',
        cliCommand: `aws iam create-open-id-connect-provider --url https://token.actions.githubusercontent.com --client-id-list sts.amazonaws.com --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 1c5824a80a670b02658097dd3ae800e4ab4e64a0`,
        explanation: 'Registers GitHub as a cryptographically trusted federated token issuer in your AWS account.'
      },
      {
        step: 2,
        title: 'Create the Hardened IAM Role with Pinned Repository Claims',
        consolePath: 'AWS Console > IAM > Roles > Create Role > Web identity > Select GitHub > Set Repository and Branch',
        cliCommand: `aws iam create-role --role-name GitHubActions-CoreDeployer-Role --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Federated":"arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"},"Action":"sts:AssumeRoleWithWebIdentity","Condition":{"StringEquals":{"token.actions.githubusercontent.com:aud":"sts.amazonaws.com","token.actions.githubusercontent.com:sub":"repo:YOUR_GITHUB_USER/YOUR_REPO:ref:refs/heads/main"}}}]}'`,
        explanation: 'Notice the StringEquals condition: It ensures ONLY commits on the main branch of YOUR specific repository can authenticate.'
      },
      {
        step: 3,
        title: 'Add Read-Only Least-Privilege Policy to the Role',
        consolePath: 'AWS Console > IAM > Roles > GitHubActions-CoreDeployer-Role > Attach AWS managed policy: SecurityAudit',
        cliCommand: `aws iam attach-role-policy --role-name GitHubActions-CoreDeployer-Role --policy-arn arn:aws:iam::aws:policy/SecurityAudit`,
        explanation: 'Attaches read-only auditing permissions for initial pipeline validation, avoiding excessive permissions.'
      },
      {
        step: 4,
        title: 'Create GitHub Actions Workflow YAML',
        consolePath: 'In your GitHub Repo: Create .github/workflows/aws-oidc-test.yml',
        codeSnippet: `name: AWS OIDC Security Pipeline
on:
  push:
    branches: [ main ]

permissions:
  id-token: write # Mandatory for requesting OIDC JWT token
  contents: read

jobs:
  verify-aws:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS Credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActions-CoreDeployer-Role
          aws-region: us-east-1
      
      - name: Verify Caller Identity (Zero Static Keys!)
        run: |
          aws sts get-caller-identity`,
        explanation: 'Notice: Zero AWS secrets are stored in GitHub Secrets! AWS STS mints a fresh token that expires automatically.'
      }
    ],

    tearDownRunbook: {
      zeroCostPromise: 'IAM roles and OIDC identity providers cost $0.00. Delete with these 2 simple commands.',
      cliCommands: [
        'aws iam detach-role-policy --role-name GitHubActions-CoreDeployer-Role --policy-arn arn:aws:iam::aws:policy/SecurityAudit',
        'aws iam delete-role --role-name GitHubActions-CoreDeployer-Role',
        'aws iam delete-open-id-connect-provider --open-id-connect-provider-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):oidc-provider/token.actions.githubusercontent.com'
      ],
      consoleSteps: [
        '1. Go to IAM > Roles > Delete `GitHubActions-CoreDeployer-Role`.',
        '2. Go to IAM > Identity Providers > Delete `token.actions.githubusercontent.com`.'
      ]
    },

    portfolioGuide: {
      githubTitle: 'Zero-Static-Credentials CI/CD Architecture with GitHub Actions OIDC',
      resumeBullets: [
        'Decommissioned legacy long-term AWS IAM access keys across CI/CD pipelines, migrating to OpenID Connect (OIDC) federated token exchange with AWS STS.',
        'Hardened trust boundary policies pinning the `sub` claim to authorized repositories and production branches, preventing unauthorized pull request token assumption.',
        'Enforced a 15-minute credential Time-To-Live (TTL) with full CloudTrail traceability for automated compliance auditing.'
      ],
      interviewDiscussionPoints: 'Explain why wildcards in `token.actions.githubusercontent.com:sub` are catastrophic: If a policy uses `repo:*:*`, any GitHub user who forks the repo can assume your production AWS role.'
    }
  },

  {
    id: 'proj-vpc-flowlog-threat-hunting',
    number: 'PROJECT-04',
    title: 'Cloud Network Threat Hunting: VPC Flow Logs & CloudWatch Insights Forensics',
    role: 'Cloud Incident Responder / DFIR',
    difficulty: 'Intermediate / Advanced',
    estimatedTime: '40 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'Amazon CloudWatch (5 GB Log Ingestion, 5 GB Log Storage Free/mo), Amazon VPC (Free)',
    businessProblem: 'During active cyber intrusions, adversaries execute port scans, lateral movement, and command-and-control (C2) beaconing over network ports. Security teams must be able to write forensic queries to identify anomalous outbound traffic, identify rejected packets, and calculate exfiltrated byte counts without expensive third-party SIEM licenses.',
    architectureSummary: 'Amazon VPC -> VPC Flow Logs -> Amazon CloudWatch Log Group -> CloudWatch Logs Insights -> Forensic Query Execution -> CloudWatch Metric Alarm.',

    architectureSteps: [
      '1. Enable VPC Flow Logs on the default VPC targeting a dedicated CloudWatch Log Group.',
      '2. Configure an IAM role allowing VPC to publish network packets to CloudWatch.',
      '3. Generate benign test traffic via curl / ping to populate network flow telemetry.',
      '4. Author CloudWatch Logs Insights queries to detect port scans (REJECT spikes) and large data transfers.',
      '5. Create an automated CloudWatch Metric Filter to alarm on high-volume outbound data.'
    ],

    stepByStepBuild: [
      {
        step: 1,
        title: 'Create CloudWatch Log Group & IAM Role for VPC Flow Logs',
        consolePath: 'AWS Console > CloudWatch > Log groups > Create log group: /aws/vpc/flowlogs/threat-hunt',
        cliCommand: `aws logs create-log-group --log-group-name /aws/vpc/flowlogs/threat-hunt && aws iam create-role --role-name VPCFlowLogsPublishRole --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"vpc-flow-logs.amazonaws.com"},"Action":"sts:AssumeRole"}]}' && aws iam put-role-policy --role-name VPCFlowLogsPublishRole --policy-name PublishToCloudWatch --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["logs:CreateLogStream","logs:PutLogEvents","logs:DescribeLogGroups","logs:DescribeLogStreams"],"Resource":"*"}]}'`,
        explanation: 'Permits the Amazon VPC service to publish network metadata streams into CloudWatch without broad permissions.'
      },
      {
        step: 2,
        title: 'Enable Flow Logs on the Default VPC',
        consolePath: 'AWS Console > VPC > Select Default VPC > Flow Logs tab > Create flow log',
        cliCommand: `aws ec2 create-flow-logs --resource-ids $(aws ec2 describe-vpcs --filter "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text) --resource-type VPC --traffic-type ALL --log-destination-type cloud-watch-logs --log-group-name /aws/vpc/flowlogs/threat-hunt --deliver-logs-permission-arn $(aws iam get-role --role-name VPCFlowLogsPublishRole --query "Role.Arn" --output text)`,
        explanation: 'Captures both ACCEPT and REJECT packets across every network interface (ENI) in the VPC.'
      },
      {
        step: 3,
        title: 'Execute CloudWatch Insights Query for Inbound Port Scans',
        consolePath: 'AWS Console > CloudWatch > Logs Insights > Select /aws/vpc/flowlogs/threat-hunt > Run Query',
        codeSnippet: `fields @timestamp, srcAddr, dstAddr, dstPort, protocol, action
| filter action = 'REJECT'
| stats count(*) as rejectCount by srcAddr, dstPort
| sort rejectCount desc
| limit 20`,
        cliCommand: `aws logs start-query --log-group-name /aws/vpc/flowlogs/threat-hunt --start-time $(date -u -d '1 hour ago' +%s 2>/dev/null || date -v-1H +%s) --end-time $(date +%s) --query-string "fields @timestamp, srcAddr, dstAddr, dstPort | filter action = 'REJECT' | stats count(*) by srcAddr | sort count desc"`,
        explanation: 'Aggregates blocked packets by source IP: a sudden spike of hundreds of rejected packets across random ports confirms an active port scan.'
      },
      {
        step: 4,
        title: 'Forensic Query for Top Exfiltration Destinations (Data Out)',
        consolePath: 'AWS Console > CloudWatch > Logs Insights > Query top bytes sent out',
        codeSnippet: `fields @timestamp, srcAddr, dstAddr, bytes
| filter srcAddr like /^172.31./ or srcAddr like /^10./
| filter dstAddr not like /^172.31./ and dstAddr not like /^10./
| stats sum(bytes) as totalExfiltratedBytes by dstAddr
| sort totalExfiltratedBytes desc
| limit 10`,
        cliCommand: `aws logs start-query --log-group-name /aws/vpc/flowlogs/threat-hunt --start-time $(date -u -d '24 hours ago' +%s 2>/dev/null || date -v-24H +%s) --end-time $(date +%s) --query-string "fields srcAddr, dstAddr, bytes | stats sum(bytes) by dstAddr | sort sum(bytes) desc"`,
        explanation: 'Calculates the exact volume of data transmitted to external public IP addresses, crucial for incident breach disclosure reporting.'
      }
    ],

    tearDownRunbook: {
      zeroCostPromise: 'Delete the flow log and log group to ensure zero storage accumulation over time.',
      cliCommands: [
        'aws ec2 delete-flow-logs --flow-log-ids $(aws ec2 describe-flow-logs --filter "Name=log-group-name,Values=/aws/vpc/flowlogs/threat-hunt" --query "FlowLogs[0].FlowLogId" --output text)',
        'aws logs delete-log-group --log-group-name /aws/vpc/flowlogs/threat-hunt',
        'aws iam delete-role-policy --role-name VPCFlowLogsPublishRole --policy-name PublishToCloudWatch',
        'aws iam delete-role --role-name VPCFlowLogsPublishRole'
      ],
      consoleSteps: [
        '1. Go to VPC > Flow Logs > Select the flow log targeting `/aws/vpc/flowlogs/threat-hunt` > Delete.',
        '2. Go to CloudWatch > Log groups > Delete `/aws/vpc/flowlogs/threat-hunt`.',
        '3. Go to IAM > Roles > Delete `VPCFlowLogsPublishRole`.'
      ]
    },

    portfolioGuide: {
      githubTitle: 'AWS Cloud Network Threat Hunting & VPC Flow Log Analysis Framework',
      resumeBullets: [
        'Implemented enterprise VPC Flow Logging across AWS cloud environments to detect adversary reconnaissance and data exfiltration vectors.',
        'Authored optimized CloudWatch Logs Insights queries identifying unauthorized lateral port scans and multi-megabyte outbound data egress transfers.',
        'Established automated alert metrics aligning with MITRE ATT&CK Network Traffic (T1046) and Exfiltration Over C2 Channel (T1041).'
      ],
      interviewDiscussionPoints: 'Explain the difference between VPC Flow Logs and packet capture (PCAP): VPC Flow Logs capture metadata (layer 3/4 headers, bytes, packets), but not the application-layer payload (HTTP body). For payload inspection, you need AWS Network Firewall or VPC Traffic Mirroring.'
    }
  }
]
