/**
 * Enterprise Cloud Security Job Playbooks: From Scratch to Solved
 * 
 * Modeled after real Fortune 500 SecOps Standard Operating Procedures (SOPs),
 * AWS Security Incident Response Guides, and NIST SP 800-61 Rev 2.
 */

export const jobPlaybooks = [
  {
    id: 'pb-leaked-keys-mining',
    ticketId: 'SEC-INC-9011',
    title: 'P0 Incident: Leaked IAM Admin Access Key & Rogue Compute Mining Infiltration',
    category: 'Identity & Access Management (IAM)',
    severity: 'P0 - CRITICAL',
    slaMinutes: 15,
    businessImpact: 'Unchecked rogue GPU compute costs ($4,200/hr), potential data exfiltration, regulatory disclosure requirement.',
    affectedServices: ['AWS IAM', 'Amazon EC2', 'AWS CloudTrail', 'AWS Cost Anomaly Detection'],
    mitreTactics: ['Initial Access (T1552.001)', 'Execution (T1059.004)', 'Impact (T1496 - Resource Hijacking)'],
    
    // Stage 1: The Raw Alert (Scratch)
    rawAlert: {
      source: 'AWS GuardDuty / Security Hub',
      findingType: 'CryptoCurrency:EC2/BitcoinTool.B!DNS',
      severityScore: 8.5,
      region: 'us-east-1',
      eventTime: '2026-09-24T20:14:22Z',
      payload: {
        schemaVersion: '2.0',
        accountId: '123456789012',
        region: 'us-east-1',
        type: 'CryptoCurrency:EC2/BitcoinTool.B!DNS',
        resource: {
          resourceType: 'AccessKey',
          accessKeyDetails: {
            accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
            principalId: 'AIDAEXAMPLEDEVUSER',
            userName: 'deployer-legacy-admin',
            userType: 'IAMUser'
          }
        },
        service: {
          serviceName: 'guardduty',
          action: {
            actionType: 'DNS_REQUEST',
            dnsRequestAction: {
              domain: 'pool.supportxmr.com',
              protocol: 'UDP',
              blocked: false
            }
          },
          count: 142
        }
      }
    },

    // Stakeholder Dispatch
    stakeholderNotice: `[URGENT INCIDENT ALERT - SEC-INC-9011]
Severity: P0 - Critical
Impacted Account: 123456789012 (Prod-Core)
Detection: Compromised Access Key executing unauthorized GPU instances communicating with mining pool.
Bridge Room: https://meet.company.internal/sec-incident-bridge
Incident Commander: On-Call Lead SecOps Engineer
Status: Triage in Progress - Tactical Containment Initiated.`,

    // First 5 Minutes
    first5Minutes: [
      {
        question: 'Is this key actively executing calls right now?',
        answer: 'Yes, CloudTrail records 142 calls in the last 10 minutes originating from unknown IP 198.51.100.44.'
      },
      {
        question: 'Does the IAM user have console access or just programmatic keys?',
        answer: 'Programmatic keys only. No MFA was attached to this service account.'
      },
      {
        question: 'Which AWS regions are seeing anomalous activity?',
        answer: 'Instances detected in us-east-1, ap-southeast-1, and eu-central-1.'
      }
    ],

    // Forensic Evidence & Smoking Gun
    smokingGun: {
      source: 'AWS CloudTrail Event History',
      call: 'RunInstances & CreateSecurityGroup',
      rawLog: {
        eventTime: '2026-09-24T20:11:05Z',
        eventName: 'RunInstances',
        sourceIPAddress: '198.51.100.44',
        userAgent: 'aws-cli/2.15.15 Python/3.11.6 Linux/5.15.0-89-generic',
        userIdentity: {
          type: 'IAMUser',
          userName: 'deployer-legacy-admin',
          accessKeyId: 'AKIAIOSFODNN7EXAMPLE'
        },
        requestParameters: {
          instancesSet: {
            items: [
              { imageId: 'ami-0c7217cdde317cfec', instanceType: 'g5.12xlarge', minCount: 8, maxCount: 8 }
            ]
          }
        }
      },
      explanation: 'The attacker used the leaked deployer key to launch 8x g5.12xlarge GPU instances simultaneously across 3 regions to mine cryptocurrency.'
    },

    // Minute-0 Tactical Containment
    containmentSteps: [
      {
        action: 'Deactivate Compromised Key',
        command: 'aws iam update-access-key --user-name deployer-legacy-admin --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive',
        note: 'Stops any further API calls signed with this key instantly.'
      },
      {
        action: 'Apply Explicit Deny Boundary Policy',
        command: `aws iam put-user-policy --user-name deployer-legacy-admin --policy-name EmergencyLockdown --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*"}]}'`,
        note: 'Ensures even active cached STS sessions or assume-role tokens are blocked.'
      },
      {
        action: 'Terminate Attacker Rogue Instances',
        command: 'aws ec2 terminate-instances --instance-ids i-0123456789miner1 i-0123456789miner2 --region us-east-1',
        note: 'Immediately halts AWS billing burn rate after taking snapshot metadata.'
      }
    ],

    // Permanent Infrastructure as Code Remediation (Terraform)
    terraformFix: {
      before: `# INSECURE: Long-term IAM user with AdministratorAccess
resource "aws_iam_user" "deployer" {
  name = "deployer-legacy-admin"
}

resource "aws_iam_access_key" "deployer_key" {
  user = aws_iam_user.deployer.name
}

resource "aws_iam_user_policy_attachment" "admin_attach" {
  user       = aws_iam_user.deployer.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}`,
      after: `# HARDENED: Short-lived OIDC role with Least-Privilege & No Static Keys
resource "aws_iam_role" "ci_deployer" {
  name = "GitHubActions-ProdDeployer-Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          "token.actions.githubusercontent.com:sub" = "repo:my-company/production-core:ref:refs/heads/main"
        }
      }
    }]
  })
}

# Attach narrowly scoped deployer permissions (Zero static keys generated!)`
    },

    // Verification Probe
    verification: {
      testCommand: 'aws sts get-caller-identity --profile compromised-key-test',
      expectedResult: 'An error occurred (InvalidClientTokenId) when calling the GetCallerIdentity operation: The security token included in the request is invalid.',
      status: 'VERIFIED CLOSED - 0 Active Access Keys'
    },

    // CISO Executive Post-Mortem
    cisoPostMortem: {
      executiveSummary: 'On Sep 24, 2026, an external threat actor leveraged a leaked long-term AWS access key to spawn 8 GPU instances for cryptocurrency mining. Detection was achieved within 3 minutes via AWS GuardDuty. Full containment was completed in 7 minutes by deactivating the key and attaching an explicit Deny policy. Zero customer data was accessed.',
      rootCause: 'A static IAM access key was committed to an unencrypted developer scratchpad without pre-commit secret detection.',
      financialImpact: '$18.40 compute usage prior to termination (Waived by AWS Support ticket #991028).',
      remediationActions: [
        'Migrated all CI/CD pipelines to GitHub Actions OIDC (0 static access keys).',
        'Implemented AWS Organizations SCP blocking creation of static IAM access keys.',
        'Deployed TruffleHog pre-commit hooks to all engineering GitHub repositories.'
      ]
    }
  },

  {
    id: 'pb-s3-pii-exposure',
    ticketId: 'SEC-INC-9022',
    title: 'P0 Incident: Public S3 Bucket Policy Exposure & Customer PII Exfiltration Prevention',
    category: 'Data Protection & Encryption (S3/KMS)',
    severity: 'P0 - CRITICAL',
    slaMinutes: 15,
    businessImpact: 'GDPR / CCPA violation risk (up to 4% global turnover), customer trust loss, mandatory data protection officer (DPO) notification.',
    affectedServices: ['Amazon S3', 'AWS KMS', 'AWS CloudTrail', 'AWS IAM'],
    mitreTactics: ['Exfiltration (T1537 - Transfer Data to Cloud Account)', 'Collection (T1530 - Data from Cloud Storage)'],

    rawAlert: {
      source: 'AWS Security Hub / S3 Block Public Access',
      findingType: 'Software and Configuration Checks/Industry and Regulatory Standards/AWS-Foundational-Security-Best-Practices/S3.2',
      severityScore: 9.0,
      region: 'us-east-1',
      eventTime: '2026-09-24T21:02:10Z',
      payload: {
        bucketName: 'customer-kyc-financial-docs-prod',
        publicRead: true,
        statementEffect: 'Allow',
        principal: '*',
        action: 's3:GetObject'
      }
    },

    stakeholderNotice: `[PRIVACY & SECURITY INCIDENT - SEC-INC-9022]
Severity: P0 - Critical
Impacted Bucket: customer-kyc-financial-docs-prod
Issue: Public read bucket policy detected on storage tier containing KYC customer documents.
Action: Public access disabled; CloudTrail S3 data event audit underway.`,

    first5Minutes: [
      {
        question: 'Was the data unencrypted or protected by customer-managed KMS?',
        answer: 'Objects had default SSE-S3; a Customer Managed Key (CMK) was missing.'
      },
      {
        question: 'Did any external IP addresses download files before detection?',
        answer: 'CloudTrail S3 data events reveal 3 GetObject requests from an external Tor exit node.'
      }
    ],

    smokingGun: {
      source: 'S3 Bucket Policy JSON',
      call: 'PutBucketPolicy',
      rawLog: {
        Statement: [
          {
            Sid: 'TemporaryVendorAccess',
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: 'arn:aws:s3:::customer-kyc-financial-docs-prod/*'
          }
        ]
      },
      explanation: 'A developer attempted to share sample files with an external marketing auditor by changing Principal to "*" instead of using presigned URLs.'
    },

    containmentSteps: [
      {
        action: 'Enforce S3 Block Public Access',
        command: 'aws s3api put-public-access-block --bucket customer-kyc-financial-docs-prod --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"',
        note: 'Immediately overrides and neutralizes any public bucket policy statements.'
      },
      {
        action: 'Delete Vulnerable Bucket Policy',
        command: 'aws s3api delete-bucket-policy --bucket customer-kyc-financial-docs-prod',
        note: 'Removes the wildcard statement completely.'
      }
    ],

    terraformFix: {
      before: `# INSECURE: Bucket created without public access block
resource "aws_s3_bucket" "kyc_docs" {
  bucket = "customer-kyc-financial-docs-prod"
}`,
      after: `# HARDENED: S3 Public Access Block + CMK KMS Encryption + TLS 1.2+ Enforced
resource "aws_s3_bucket" "kyc_docs" {
  bucket = "customer-kyc-financial-docs-prod"
}

resource "aws_s3_bucket_public_access_block" "kyc_block" {
  bucket = aws_s3_bucket.kyc_docs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "kyc_encrypt" {
  bucket = aws_s3_bucket.kyc_docs.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.kyc_kms.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}`
    },

    verification: {
      testCommand: 'curl -i -s https://customer-kyc-financial-docs-prod.s3.amazonaws.com/passport-sample.pdf',
      expectedResult: 'HTTP/1.1 403 Forbidden\n<Code>AccessDenied</Code>\n<Message>Access Denied</Message>',
      status: 'VERIFIED CLOSED - Public Access Neutralized'
    },

    cisoPostMortem: {
      executiveSummary: 'An inadvertent public bucket policy on customer-kyc-financial-docs-prod was caught by AWS Security Hub within 4 minutes. S3 Block Public Access was immediately enforced. Forensic analysis of S3 data events confirmed only 3 non-sensitive test files were fetched before containment.',
      rootCause: 'Developer bypassed Terraform CI/CD to make manual Console changes for an external vendor test.',
      financialImpact: '$0 direct loss. Potential regulatory compliance penalty averted.',
      remediationActions: [
        'Enforced AWS Organizations SCP blocking S3 PutBucketPolicy with Principal: *.',
        'Enabled AWS Config rule s3-bucket-public-read-prohibited across all corporate accounts.',
        'Migrated vendor document sharing to short-lived AWS Presigned URLs (15-min TTL).'
      ]
    }
  },

  {
    id: 'pb-ssrf-imds-escape',
    ticketId: 'SEC-INC-9033',
    title: 'P1 Incident: Web Application SSRF to EC2 Instance Metadata (IMDSv1) Credential Exfiltration',
    category: 'Workload & Application Security (EC2/SSRF)',
    severity: 'P1 - HIGH',
    slaMinutes: 30,
    businessImpact: 'Attacker obtained temporary AWS STS credentials from instance profile, attempting lateral movement to internal databases.',
    affectedServices: ['Amazon EC2', 'AWS IAM', 'AWS WAF', 'AWS Systems Manager'],
    mitreTactics: ['Initial Access (T1190 - Exploit Public-Facing App)', 'Credential Access (T1552.005 - Cloud Instance Metadata)'],

    rawAlert: {
      source: 'AWS GuardDuty / Threat Intel',
      findingType: 'UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
      severityScore: 8.8,
      region: 'us-west-2',
      eventTime: '2026-09-24T21:18:00Z',
      payload: {
        instanceId: 'i-0992384729webprod',
        roleName: 'WebFrontend-Production-Role',
        clientIp: '203.0.113.195',
        callerIdentity: 'assumed-role/WebFrontend-Production-Role/i-0992384729webprod'
      }
    },

    stakeholderNotice: `[URGENT SECURITY INCIDENT - SEC-INC-9033]
Severity: P1 - High
Detection: Instance metadata credentials exfiltrated outside AWS cloud perimeter.
Action: Instance isolated into forensic quarantine security group; IMDSv2 enforcement underway.`,

    first5Minutes: [
      {
        question: 'Which web tier endpoint allowed the SSRF request?',
        answer: 'The PDF invoice generator endpoint: `/api/v1/render-pdf?url=http://169.254.169.254/latest/meta-data/`.'
      },
      {
        question: 'Is IMDSv2 currently enforced on the instance?',
        answer: 'No. HttpTokens was set to optional (IMDSv1 active).'
      }
    ],

    smokingGun: {
      source: 'NGINX Access Logs on Web Node',
      call: 'GET /api/v1/render-pdf?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/WebFrontend-Production-Role',
      rawLog: {
        request: 'GET /api/v1/render-pdf?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/WebFrontend-Production-Role HTTP/1.1',
        status: 200,
        bytes_sent: 1492
      },
      explanation: 'The PDF generation service fetched the instance profile credentials via HTTP GET request to 169.254.169.254 without token authentication.'
    },

    containmentSteps: [
      {
        action: 'Isolate Instance into Quarantine Security Group',
        command: 'aws ec2 modify-instance-attribute --instance-id i-0992384729webprod --groups sg-quarantine-isolated',
        note: 'Drops all inbound and outbound network connectivity instantly.'
      },
      {
        action: 'Revoke Active STS Sessions for the Role',
        command: `aws iam put-role-policy --role-name WebFrontend-Production-Role --policy-name RevokeOlderSessions --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*","Condition":{"DateLessThan":{"aws:TokenIssueTime":"2026-09-24T21:30:00Z"}}}]}'`,
        note: 'Immediately invalidates the stolen temporary credentials.'
      },
      {
        action: 'Mandate IMDSv2 on the EC2 Workload',
        command: 'aws ec2 modify-instance-metadata-options --instance-id i-0992384729webprod --http-tokens required --http-put-response-hop-limit 1 --http-endpoint enabled',
        note: 'Enforces session token requirement (IMDSv2).'
      }
    ],

    terraformFix: {
      before: `# INSECURE: Default EC2 without IMDSv2 enforcement
resource "aws_instance" "web" {
  ami           = "ami-0123456789abcdef0"
  instance_type = "t3.medium"
}`,
      after: `# HARDENED: Mandatory IMDSv2 with Hop Limit 1
resource "aws_instance" "web" {
  ami           = "ami-0123456789abcdef0"
  instance_type = "t3.medium"

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"  # Forces IMDSv2
    http_put_response_hop_limit = 1           # Blocks container hop
    instance_metadata_tags      = "disabled"
  }
}`
    },

    verification: {
      testCommand: 'curl -i -s http://169.254.169.254/latest/meta-data/iam/security-credentials/',
      expectedResult: 'HTTP/1.1 401 Unauthorized\nContent-Type: text/html',
      status: 'VERIFIED CLOSED - IMDSv1 Blocked with HTTP 401'
    },

    cisoPostMortem: {
      executiveSummary: 'An SSRF vulnerability in the legacy invoice renderer exposed EC2 instance credentials via IMDSv1. GuardDuty detected the external credential usage within 2 minutes. The node was quarantined, active sessions were revoked via TokenIssueTime policy, and IMDSv2 was mandated across all EC2 workloads.',
      rootCause: 'Unvalidated user URL parameter in application layer combined with permissive IMDSv1 settings on infrastructure.',
      financialImpact: '$0 data loss. Application patched within maintenance window.',
      remediationActions: [
        'Enforced AWS Organizations SCP requiring IMDSv2 on all EC2 RunInstances calls.',
        'Deployed AWS WAF SSRF rule group to inspect outgoing request parameters.',
        'Sanitized backend PDF rendering service to reject private IP address ranges (RFC 1918 & 169.254.0.0/16).'
      ]
    }
  },

  {
    id: 'pb-cicd-oidc-supply-chain',
    ticketId: 'SEC-INC-9044',
    title: 'P1 Incident: CI/CD Supply Chain Hijacking & Poisoned GitHub Actions Deployment Role',
    category: 'DevSecOps & Supply Chain Security',
    severity: 'P1 - HIGH',
    slaMinutes: 30,
    businessImpact: 'Unauthorized deployment of modified container images into production Kubernetes cluster.',
    affectedServices: ['AWS IAM (OIDC)', 'Amazon ECR', 'Amazon EKS', 'GitHub Actions'],
    mitreTactics: ['Initial Access (T1195.002 - Supply Chain)', 'Defense Evasion (T1078.004 - Cloud Accounts)'],

    rawAlert: {
      source: 'AWS CloudTrail / Threat Detection',
      findingType: 'SuspiciousRoleAssumption:ExternalGitHubFork',
      severityScore: 8.6,
      region: 'us-east-1',
      eventTime: '2026-09-24T21:40:00Z',
      payload: {
        roleArn: 'arn:aws:iam::123456789012:role/ProductionCIK8sDeployer',
        federatedSubject: 'repo:untrusted-external-fork/core-app:pull_request',
        action: 'sts:AssumeRoleWithWebIdentity'
      }
    },

    stakeholderNotice: `[SUPPLY CHAIN INCIDENT - SEC-INC-9044]
Severity: P1 - High
Detection: GitHub Actions OIDC role assumed from an unauthorized external repository fork.
Action: OIDC trust policy locked to main branch; ECR repository scanned and locked down.`,

    first5Minutes: [
      {
        question: 'How did the external fork pass the OIDC condition check?',
        answer: 'The IAM trust policy used a wildcard: `repo:*:*` instead of pinning the specific organization and repo.'
      },
      {
        question: 'Were any malicious Docker images pushed to ECR?',
        answer: 'One image was pushed: `core-app:sha-hack991`. It was not yet deployed to EKS.'
      }
    ],

    smokingGun: {
      source: 'IAM Role Trust Policy JSON',
      call: 'AssumeRoleWithWebIdentity',
      rawLog: {
        Condition: {
          StringLike: {
            'token.actions.githubusercontent.com:sub': 'repo:*:*'
          }
        }
      },
      explanation: 'The wildcard string match allowed any public GitHub repository running GitHub Actions to assume the production deployer role.'
    },

    containmentSteps: [
      {
        action: 'Lock Down OIDC Condition to Specific Organization & Main Branch',
        command: `aws iam update-assume-role-policy --role-name ProductionCIK8sDeployer --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Federated":"arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"},"Action":"sts:AssumeRoleWithWebIdentity","Condition":{"StringEquals":{"token.actions.githubusercontent.com:aud":"sts.amazonaws.com","token.actions.githubusercontent.com:sub":"repo:my-company/core-app:ref:refs/heads/main"}}}]}'`,
        note: 'Restricts assumption strictly to verified commits on main branch of the official company repository.'
      },
      {
        action: 'Purge Untrusted Image from ECR',
        command: 'aws ecr batch-delete-image --repository-name core-app --image-ids imageTag=sha-hack991',
        note: 'Deletes the unauthorized container image before deployment.'
      }
    ],

    terraformFix: {
      before: `# INSECURE: Wildcard sub matches all of GitHub
Statement = [{
  Effect = "Allow"
  Principal = { Federated = aws_iam_openid_connect_provider.github.arn }
  Action = "sts:AssumeRoleWithWebIdentity"
  Condition = {
    StringLike = { "token.actions.githubusercontent.com:sub" = "repo:*:*" }
  }
}]`,
      after: `# HARDENED: Pinned to specific repo, environment, and branch
Statement = [{
  Effect = "Allow"
  Principal = { Federated = aws_iam_openid_connect_provider.github.arn }
  Action = "sts:AssumeRoleWithWebIdentity"
  Condition = {
    StringEquals = {
      "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
      "token.actions.githubusercontent.com:sub" = "repo:my-company/core-app:ref:refs/heads/main"
    }
  }
}]`
    },

    verification: {
      testCommand: 'aws sts assume-role-with-web-identity --role-arn arn:aws:iam::123456789012:role/ProductionCIK8sDeployer --role-session-name test --web-identity-token "mock.token.fork"',
      expectedResult: 'An error occurred (AccessDenied) when calling the AssumeRoleWithWebIdentity operation: Not authorized',
      status: 'VERIFIED CLOSED - Unauthorized Forks Rejected'
    },

    cisoPostMortem: {
      executiveSummary: 'An overly broad wildcard in an OIDC trust policy permitted an external fork to assume a deployment role. Alerting triggered immediately upon image push to ECR. The untrusted image was deleted, the OIDC trust policy was pinned to the main branch, and EKS clusters were verified clean.',
      rootCause: 'Template copy-pasting during initial GitHub Actions OIDC rollout without automated linter validation.',
      financialImpact: '$0 loss. Production deployment pipeline resumed within 45 minutes.',
      remediationActions: [
        'Added Checkov and tfsec static code analysis to prevent wildcard trust policies in Terraform.',
        'Enabled ECR Image Scanning with Amazon Inspector for continuous vulnerability evaluation.',
        'Implemented EKS admission controller to enforce signed container images via Cosign / Sigstore.'
      ]
    }
  }
]
