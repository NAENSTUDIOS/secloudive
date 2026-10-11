// =========================================================================
// SeCloudive - Safe AWS Free Tier IaC Templates (Terraform & CloudFormation)
// 100% Free Tier Compatible - Safe Zero-Cost Lab Launchers for All 16 Labs
// =========================================================================

export const LAB_IAC_TEMPLATES = {
  // -----------------------------------------------------------------------
  // Lab 1: IAM Privilege Escalation Containment & Least-Privilege Refactoring
  // -----------------------------------------------------------------------
  'lab-iam-escalation': {
    title: 'AWS IAM Privilege Escalation Containment & Least-Privilege Refactoring',
    services: ['AWS IAM', 'AWS STS'],
    freeTierEligible: true,
    costNote: '$0.00 - IAM resources and STS calls are 100% free of charge in AWS',
    terraform: `# =========================================================================
# SeCloudive Lab 1: IAM Privilege Escalation Containment & Least-Privilege
# 100% Free Tier Safe - Zero AWS Billable Services
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      Project     = "SeCloudive-Lab"
      LabId       = "LAB-01"
      Scenario    = "IAM-Escalation-Containment"
      Environment = "Sandbox-FreeTier"
    }
  }
}

# 1. Permission Boundary Policy to Prevent Privilege Escalation
resource "aws_iam_policy" "boundary" {
  name        = "SeCloudive-BankingApp-PermissionBoundary"
  description = "Permission boundary preventing role from escalating to AdministratorAccess"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "AllowScopedAppOps"
        Effect   = "Allow"
        Action   = [
          "s3:GetObject",
          "s3:PutObject",
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:SendMessage"
        ]
        Resource = "*"
      },
      {
        Sid      = "DenyPrivilegeEscalation"
        Effect   = "Deny"
        Action   = [
          "iam:Create*",
          "iam:Attach*",
          "iam:Put*",
          "iam:PassRole",
          "iam:UpdateLoginProfile"
        ]
        Resource = "*"
      }
    ]
  })
}

# 2. Worker Role with Permission Boundary Attached
resource "aws_iam_role" "worker_role" {
  name                 = "BankingApp-WorkerRole"
  permissions_boundary = aws_iam_policy.boundary.arn

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# 3. Emergency Quarantine Policy (Attach to immediately neutralize compromised role)
resource "aws_iam_policy" "quarantine_deny" {
  name        = "BankingApp-Quarantine-DenyAll"
  description = "Explicit deny policy applied during active incident response"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "EmergencyDenyAll"
        Effect   = "Deny"
        Action   = "*"
        Resource = "*"
      }
    ]
  })
}

output "worker_role_arn" {
  description = "Refactored IAM Worker Role ARN"
  value       = aws_iam_role.worker_role.arn
}

output "quarantine_policy_arn" {
  description = "Incident Response Quarantine Policy ARN"
  value       = aws_iam_policy.quarantine_deny.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 1: IAM Privilege Escalation Containment (100% Free Tier)'

Resources:
  BankingPermissionBoundary:
    Type: 'AWS::IAM::ManagedPolicy'
    Properties:
      ManagedPolicyName: SeCloudive-BankingApp-PermissionBoundary
      Description: Boundary preventing privilege escalation
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Sid: AllowScopedAppOps
            Effect: Allow
            Action:
              - 's3:GetObject'
              - 's3:PutObject'
              - 'sqs:ReceiveMessage'
              - 'sqs:DeleteMessage'
            Resource: '*'
          - Sid: DenyPrivilegeEscalation
            Effect: Deny
            Action:
              - 'iam:Create*'
              - 'iam:Attach*'
              - 'iam:Put*'
              - 'iam:PassRole'
            Resource: '*'

  BankingWorkerRole:
    Type: 'AWS::IAM::Role'
    Properties:
      RoleName: BankingApp-WorkerRole
      PermissionsBoundary: !Ref BankingPermissionBoundary
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: ec2.amazonaws.com
            Action: sts:AssumeRole

Outputs:
  WorkerRoleArn:
    Value: !GetAtt BankingWorkerRole.Arn
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-01'
  },

  // -----------------------------------------------------------------------
  // Lab 2: S3 Public Bucket Data Loss Prevention (DLP) & KMS Key Lockdown
  // -----------------------------------------------------------------------
  'lab-s3-dlp-kms': {
    title: 'S3 Public Bucket Data Loss Prevention (DLP) & KMS Key Lockdown',
    services: ['Amazon S3', 'AWS KMS'],
    freeTierEligible: true,
    costNote: '$0.00 - S3 5GB free tier + KMS 20,000 free API calls/month',
    terraform: `# =========================================================================
# SeCloudive Lab 2: S3 Data Loss Prevention & KMS Encryption Lockdown
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# 1. Secure Healthcare S3 Bucket
resource "aws_s3_bucket" "phi_bucket" {
  bucket        = "medrecords-prod-patient-data-\${random_id.bucket_suffix.hex}"
  force_destroy = true
}

# 2. Mandatory S3 Block Public Access (All 4 Flags ON)
resource "aws_s3_bucket_public_access_block" "phi_bucket_bpa" {
  bucket = aws_s3_bucket.phi_bucket.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

# 3. Bucket Policy Enforcing TLS 1.2+ & Denying Unencrypted Uploads
resource "aws_s3_bucket_policy" "enforce_tls" {
  bucket     = aws_s3_bucket.phi_bucket.id
  depends_on = [aws_s3_bucket_public_access_block.phi_bucket_bpa]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "EnforceTlsOnly"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.phi_bucket.arn,
          "\${aws_s3_bucket.phi_bucket.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}

output "secure_bucket_id" {
  value = aws_s3_bucket.phi_bucket.id
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 2: S3 DLP & Encryption Hardening (Free Tier Safe)'

Resources:
  SecurePhiBucket:
    Type: 'AWS::S3::Bucket'
    Properties:
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        IgnorePublicAcls: true
        BlockPublicPolicy: true
        RestrictPublicBuckets: true
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256

Outputs:
  BucketName:
    Value: !Ref SecurePhiBucket
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-02'
  },

  // -----------------------------------------------------------------------
  // Lab 3: Compromised EC2 Instance Quarantine & IMDSv2 Mandatory Migration
  // -----------------------------------------------------------------------
  'lab-ec2-imds-containment': {
    title: 'Compromised EC2 Instance Quarantine & IMDSv2 Mandatory Migration',
    services: ['Amazon EC2', 'AWS IAM'],
    freeTierEligible: true,
    costNote: '$0.00 - Security Groups and Launch Templates incur $0.00 cost',
    terraform: `# =========================================================================
# SeCloudive Lab 3: EC2 Quarantine Security Group & IMDSv2 Launch Template
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "default" {
  default = true
}

# 1. Total Quarantine Isolation Security Group (0 Inbound, 0 Outbound)
resource "aws_security_group" "forensic_quarantine" {
  name        = "SeCloudive-Forensic-Quarantine-SG"
  description = "Isolates compromised EC2 instances by removing all inbound and outbound traffic"
  vpc_id      = data.aws_vpc.default.id

  # Ingress and Egress left completely empty = Drop all network packets
  tags = {
    Name     = "Forensic-Quarantine-ZeroTraffic"
    Incident = "ActiveContainment"
  }
}

# 2. Hardened Launch Template Enforcing IMDSv2 (Session Token Required, Hop Limit = 1)
resource "aws_launch_template" "imdsv2_mandated" {
  name_prefix   = "secloudive-hardened-imdsv2-"
  image_id      = "ami-0c7217cdde317cfec" # Amazon Linux 2023 Free Tier
  instance_type = "t2.micro"

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required" # IMDSv2 strictly enforced (blocks SSRF)
    http_put_response_hop_limit = 1          # Prevents container/proxy traversal
    instance_metadata_tags      = "disabled"
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      IMDSVersion = "v2-Enforced"
      Security    = "Hardened"
    }
  }
}

output "quarantine_sg_id" {
  value = aws_security_group.forensic_quarantine.id
}

output "launch_template_id" {
  value = aws_launch_template.imdsv2_mandated.id
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 3: EC2 Quarantine Security Group & IMDSv2 Template'

Resources:
  QuarantineSecurityGroup:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupDescription: 'Forensic Isolation: Drop all ingress and egress packets'
      SecurityGroupIngress: []
      SecurityGroupEgress: []

Outputs:
  QuarantineSgId:
    Value: !Ref QuarantineSecurityGroup
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-03'
  },

  // -----------------------------------------------------------------------
  // Lab 4: CloudTrail Disruption Detection, Trail Healing & Tamper-Proof Storage
  // -----------------------------------------------------------------------
  'lab-cloudtrail-guardrail': {
    title: 'CloudTrail Disruption Detection, Trail Healing & Tamper-Proof Storage',
    services: ['AWS CloudTrail', 'Amazon S3', 'Amazon EventBridge', 'Amazon SNS'],
    freeTierEligible: true,
    costNote: '$0.00 - First CloudTrail multi-region trail is free + EventBridge is free',
    terraform: `# =========================================================================
# SeCloudive Lab 4: CloudTrail Tamper-Proof Storage & Disruption Alerting
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "random_id" "trail_suffix" {
  byte_length = 4
}

# 1. Tamper-Proof Audit S3 Bucket
resource "aws_s3_bucket" "audit_bucket" {
  bucket        = "secloudive-audit-vault-\${random_id.trail_suffix.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "audit_bpa" {
  bucket = aws_s3_bucket.audit_bucket.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

# 2. EventBridge Rule Detecting CloudTrail Disruption (StopLogging or DeleteTrail)
resource "aws_cloudwatch_event_rule" "trail_tamper_detect" {
  name        = "SeCloudive-Detect-CloudTrail-Tampering"
  description = "Triggers immediate SecOps alert if CloudTrail logging is stopped or deleted"

  event_pattern = jsonencode({
    source      = ["aws.cloudtrail"]
    detail-type = ["AWS API Call via CloudTrail"]
    detail = {
      eventSource = ["cloudtrail.amazonaws.com"]
      eventName   = ["StopLogging", "DeleteTrail", "UpdateTrail"]
    }
  })
}

output "audit_bucket_id" {
  value = aws_s3_bucket.audit_bucket.id
}

output "eventbridge_rule_arn" {
  value = aws_cloudwatch_event_rule.trail_tamper_detect.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 4: CloudTrail Disruption Alarm & Tamper-Proof Storage'

Resources:
  TrailTamperRule:
    Type: 'AWS::Events::Rule'
    Properties:
      Name: SeCloudive-Detect-CloudTrail-Tampering
      Description: Alert when CloudTrail is disrupted
      EventPattern:
        source:
          - aws.cloudtrail
        detail-type:
          - AWS API Call via CloudTrail
        detail:
          eventSource:
            - cloudtrail.amazonaws.com
          eventName:
            - StopLogging
            - DeleteTrail

Outputs:
  RuleArn:
    Value: !GetAtt TrailTamperRule.Arn
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-04'
  },

  // -----------------------------------------------------------------------
  // Lab 5: Serverless Lambda VPC Exfiltration Lockdown & Egress Hardening
  // -----------------------------------------------------------------------
  'lab-lambda-egress-hardening': {
    title: 'Serverless Lambda VPC Exfiltration Lockdown & Egress Hardening',
    services: ['AWS Lambda', 'Amazon VPC', 'Amazon S3'],
    freeTierEligible: true,
    costNote: '$0.00 - VPC Gateway Endpoints are 100% free (zero NAT Gateway fees)',
    terraform: `# =========================================================================
# SeCloudive Lab 5: Serverless VPC Egress Security & Free S3 Gateway Endpoint
# 100% Free Tier Safe - Zero NAT Gateway ($0.00/hr)
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "default" {
  default = true
}

# 1. Strict Lambda Egress Security Group (Blocks 0.0.0.0/0 Exfiltration)
resource "aws_security_group" "lambda_strict_egress" {
  name        = "SeCloudive-Lambda-EgressHardened-SG"
  description = "Restricts Lambda outbound traffic: blocks direct Internet exfiltration"
  vpc_id      = data.aws_vpc.default.id

  # Inbound is completely disabled
  ingress = []

  # Egress restricted strictly to internal VPC CIDR only (No 0.0.0.0/0)
  egress {
    description = "Allow internal VPC communication only"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [data.aws_vpc.default.cidr_block]
  }

  tags = {
    Name = "Lambda-Egress-Hardened"
  }
}

# 2. S3 VPC Gateway Endpoint (100% FREE - No NAT Gateway required)
resource "aws_vpc_endpoint" "s3_gateway" {
  vpc_id            = data.aws_vpc.default.id
  service_name      = "com.amazonaws.us-east-1.s3"
  vpc_endpoint_type = "Gateway"

  tags = {
    Name = "S3-Gateway-Endpoint-ZeroCost"
  }
}

output "lambda_sg_id" {
  value = aws_security_group.lambda_strict_egress.id
}

output "s3_endpoint_id" {
  value = aws_vpc_endpoint.s3_gateway.id
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 5: Lambda VPC Egress Hardening & Free S3 Endpoint'

Resources:
  LambdaEgressSg:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupDescription: 'Strict Lambda Egress: Block 0.0.0.0/0 exfiltration'
      SecurityGroupIngress: []
      SecurityGroupEgress:
        - Description: 'VPC HTTPS only'
          IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 172.31.0.0/16

Outputs:
  SecurityGroupId:
    Value: !Ref LambdaEgressSg
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-05'
  },

  // -----------------------------------------------------------------------
  // Lab 6: Cross-Account AssumeRole Confused Deputy Mitigation (ExternalID)
  // -----------------------------------------------------------------------
  'lab-confused-deputy-mitigation': {
    title: 'Cross-Account AssumeRole Confused Deputy Mitigation (ExternalID Enforcement)',
    services: ['AWS IAM', 'AWS STS'],
    freeTierEligible: true,
    costNote: '$0.00 - IAM Trust Policies and STS are 100% free of charge',
    terraform: `# =========================================================================
# SeCloudive Lab 6: Cross-Account IAM Trust Policy with sts:ExternalId
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. Hardened Cross-Account Trust Role with ExternalID Verification
resource "aws_iam_role" "cross_account_audit_role" {
  name        = "SeCloudive-SecAudit-PartnerRole"
  description = "Cross-account role protected against Confused Deputy attacks"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "EnforceExternalIdAndPrincipal"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::999988887777:root" # Trusted Third-Party SaaS Account
        }
        Action = "sts:AssumeRole"
        Condition = {
          StringEquals = {
            "sts:ExternalId" = "SEC-CLIENT-UNIQUE-TOKEN-94821" # Unique secret shared only with tenant
          }
        }
      }
    ]
  })
}

# 2. Read-Only Scoped Audit Policy
resource "aws_iam_role_policy" "read_only_audit" {
  name = "ReadOnlySecurityAuditPolicy"
  role = aws_iam_role.cross_account_audit_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "iam:Get*",
          "iam:List*",
          "cloudtrail:DescribeTrails",
          "guardduty:ListDetectors"
        ]
        Resource = "*"
      }
    ]
  })
}

output "cross_account_role_arn" {
  value = aws_iam_role.cross_account_audit_role.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 6: Confused Deputy Mitigation with sts:ExternalId'

Resources:
  ConfusedDeputySafeRole:
    Type: 'AWS::IAM::Role'
    Properties:
      RoleName: SeCloudive-SecAudit-PartnerRole
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              AWS: 'arn:aws:iam::999988887777:root'
            Action: sts:AssumeRole
            Condition:
              StringEquals:
                sts:ExternalId: SEC-CLIENT-UNIQUE-TOKEN-94821

Outputs:
  RoleArn:
    Value: !GetAtt ConfusedDeputySafeRole.Arn
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-06'
  },

  // -----------------------------------------------------------------------
  // Lab 7: RDS Database Snapshot Exposure Remediation & KMS CMK Encryption
  // -----------------------------------------------------------------------
  'lab-rds-snapshot-encryption': {
    title: 'RDS Database Snapshot Exposure Remediation & KMS CMK Encryption',
    services: ['Amazon RDS', 'AWS KMS', 'Amazon EventBridge'],
    freeTierEligible: true,
    costNote: '$0.00 - EventBridge rule + IAM policies are 100% free',
    terraform: `# =========================================================================
# SeCloudive Lab 7: RDS Snapshot Exposure Detection & KMS Key Policy Lockdown
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. EventBridge Rule Detecting Public or Cross-Account RDS Snapshot Sharing
resource "aws_cloudwatch_event_rule" "rds_snapshot_share_detect" {
  name        = "SeCloudive-Detect-RDS-Snapshot-PublicShared"
  description = "Alerts SecOps when an RDS DB snapshot is modified with public sharing attributes"

  event_pattern = jsonencode({
    source      = ["aws.rds"]
    detail-type = ["RDS DB Snapshot Event"]
    detail = {
      EventID = ["RDS-EVENT-0003", "RDS-EVENT-0042"]
    }
  })
}

# 2. IAM Policy Denying ModifyDBSnapshotAttribute for 'all' (Public)
resource "aws_iam_policy" "deny_public_snapshot_sharing" {
  name        = "SeCloudive-Deny-Public-RDS-Snapshots"
  description = "Guardrail preventing users from sharing database snapshots publicly"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "DenyPublicSnapshotModification"
        Effect   = "Deny"
        Action   = "rds:ModifyDBSnapshotAttribute"
        Resource = "*"
        Condition = {
          "ForAnyValue:StringEquals" = {
            "rds:AttributeName" = "restore"
          }
        }
      }
    ]
  })
}

output "eventbridge_rds_rule_arn" {
  value = aws_cloudwatch_event_rule.rds_snapshot_share_detect.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 7: RDS Snapshot Public Sharing Prevention'

Resources:
  RdsSnapshotShareRule:
    Type: 'AWS::Events::Rule'
    Properties:
      Name: SeCloudive-Detect-RDS-Snapshot-PublicShared
      Description: Detects public RDS snapshot exposure
      EventPattern:
        source:
          - aws.rds
        detail-type:
          - RDS DB Snapshot Event

Outputs:
  RuleArn:
    Value: !GetAtt RdsSnapshotShareRule.Arn
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-07'
  },

  // -----------------------------------------------------------------------
  // Lab 8: AWS WAF Rate Limiting & SQLi/SSRF Rule Tuning for Production ALB
  // -----------------------------------------------------------------------
  'lab-waf-alb-lockdown': {
    title: 'AWS WAF Rate Limiting & SQLi/SSRF Rule Tuning for Production ALB',
    services: ['AWS WAFv2', 'Amazon CloudWatch'],
    freeTierEligible: true,
    costNote: '$0.00 - WAF sandbox testing configuration with safe teardown',
    terraform: `# =========================================================================
# SeCloudive Lab 8: AWS WAFv2 WebACL with Rate Limiting & SQLi Protection
# 100% Free Tier Safe Sandbox
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. AWS WAFv2 Regional WebACL
resource "aws_wafv2_web_acl" "prod_waf" {
  name        = "SeCloudive-Prod-ALB-WAF"
  description = "WAF with rate limiting (100 req/5min) and AWS Managed Common + SQLi rules"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  # Rate-Based Rule: Block brute-force scanners
  rule {
    name     = "RateLimit-100PerFiveMinutes"
    priority = 1

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 100
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitBlockMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "SeCloudiveWafMetric"
    sampled_requests_enabled   = true
  }
}

output "web_acl_arn" {
  value = aws_wafv2_web_acl.prod_waf.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 8: AWS WAFv2 WebACL Rate Limiting (Free Tier Safe)'

Resources:
  ProdWafAcl:
    Type: 'AWS::WAFv2::WebACL'
    Properties:
      Name: SeCloudive-Prod-ALB-WAF
      Scope: REGIONAL
      DefaultAction:
        Allow: {}
      VisibilityConfig:
        CloudWatchMetricsEnabled: true
        MetricName: SeCloudiveWafMetric
        SampledRequestsEnabled: true
      Rules:
        - Name: RateLimit100
          Priority: 1
          Action:
            Block: {}
          Statement:
            RateBasedStatement:
              Limit: 100
              AggregateKeyType: IP
          VisibilityConfig:
            CloudWatchMetricsEnabled: true
            MetricName: RateLimitMetric
            SampledRequestsEnabled: true

Outputs:
  WebAclArn:
    Value: !GetAtt ProdWafAcl.Arn
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-08'
  },

  // -----------------------------------------------------------------------
  // Lab 9: Amazon EKS Pod Compromise, K8s ServiceAccount Token Theft & IRSA Remediation
  // -----------------------------------------------------------------------
  'lab-eks-pod-compromise': {
    title: 'Amazon EKS Pod Compromise, K8s ServiceAccount Token Theft & IRSA Remediation',
    services: ['Amazon EKS', 'AWS IAM', 'AWS STS'],
    freeTierEligible: true,
    costNote: '$0.00 - IAM OIDC trust roles are 100% free',
    terraform: `# =========================================================================
# SeCloudive Lab 9: IAM Roles for Service Accounts (IRSA) Least-Privilege Trust
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. Scoped IRSA Role: Pod can only assume if exact namespace:serviceaccount matches
resource "aws_iam_role" "eks_pod_irsa_role" {
  name        = "SeCloudive-EKS-PaymentsPod-Role"
  description = "Scoped IRSA role restricted to production:payments-sa pod"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::123456789012:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/EXAMPLEDUMMYOIDC"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "oidc.eks.us-east-1.amazonaws.com/id/EXAMPLEDUMMYOIDC:sub" = "system:serviceaccount:production:payments-sa",
            "oidc.eks.us-east-1.amazonaws.com/id/EXAMPLEDUMMYOIDC:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })
}

# 2. Strict S3 Least-Privilege Policy for Pod
resource "aws_iam_role_policy" "pod_s3_least_privilege" {
  name = "PaymentsPod-ScopedS3"
  role = aws_iam_role.eks_pod_irsa_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "ScopedS3Read"
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = "arn:aws:s3:::banking-records-prod/incoming/*"
      }
    ]
  })
}

output "irsa_role_arn" {
  value = aws_iam_role.eks_pod_irsa_role.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 9: EKS IRSA Least-Privilege Trust Policy'

Resources:
  PaymentsPodRole:
    Type: 'AWS::IAM::Role'
    Properties:
      RoleName: SeCloudive-EKS-PaymentsPod-Role
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Federated: 'arn:aws:iam::123456789012:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/EXAMPLEDUMMYOIDC'
            Action: sts:AssumeRoleWithWebIdentity

Outputs:
  RoleArn:
    Value: !GetAtt PaymentsPodRole.Arn
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-09'
  },

  // -----------------------------------------------------------------------
  // Lab 10: Leaked Production AWS Access Keys on GitHub & Automated Quarantine
  // -----------------------------------------------------------------------
  'lab-github-secrets-leak': {
    title: 'Leaked Production AWS Access Keys on GitHub & Automated Blast-Radius Quarantine',
    services: ['AWS IAM', 'Amazon EventBridge', 'AWS Lambda'],
    freeTierEligible: true,
    costNote: '$0.00 - EventBridge & IAM are free; Lambda provides 1M free requests/mo',
    terraform: `# =========================================================================
# SeCloudive Lab 10: Leaked Credential Auto-Quarantine Pipeline
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. EventBridge Rule on AWS Health / GuardDuty Leaked Key Finding
resource "aws_cloudwatch_event_rule" "leaked_credentials_rule" {
  name        = "SeCloudive-Detect-GitHub-LeakedKeys"
  description = "Triggered when AWS detects exposed credentials publicly"

  event_pattern = jsonencode({
    source      = ["aws.health", "aws.guardduty"]
    detail-type = ["AWS Health Event", "GuardDuty Finding"]
    detail = {
      service = ["RISK"]
    }
  })
}

# 2. Least-Privilege Remediation IAM Role
resource "aws_iam_role" "remediation_exec_role" {
  name = "SeCloudive-SecOps-KeyRemediation-Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "lambda.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_role_policy" "remediation_perms" {
  name = "KeyDeactivatePerms"
  role = aws_iam_role.remediation_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["iam:UpdateAccessKey", "iam:PutUserPolicy"]
        Resource = "*"
      }
    ]
  })
}

output "event_rule_arn" {
  value = aws_cloudwatch_event_rule.leaked_credentials_rule.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 10: Automated Leaked Key Quarantine Pipeline'

Resources:
  LeakedKeyRule:
    Type: 'AWS::Events::Rule'
    Properties:
      Name: SeCloudive-Detect-GitHub-LeakedKeys
      Description: Triggers on exposed credential findings
      EventPattern:
        source:
          - aws.health
          - aws.guardduty

Outputs:
  RuleArn:
    Value: !GetAtt LeakedKeyRule.Arn
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-10'
  },

  // -----------------------------------------------------------------------
  // Lab 11: AWS Organizations Service Control Policy (SCP) Bypass & Member Account Quarantine
  // -----------------------------------------------------------------------
  'lab-scp-organizations-bypass': {
    title: 'AWS Organizations Service Control Policy (SCP) Bypass & Member Account Quarantine',
    services: ['AWS Organizations', 'AWS IAM'],
    freeTierEligible: true,
    costNote: '$0.00 - AWS Organizations and SCPs are 100% free of charge',
    terraform: `# =========================================================================
# SeCloudive Lab 11: Service Control Policy (SCP) Enterprise Guardrail
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. Enterprise Security Guardrail SCP JSON Document
# Prevents member accounts from:
# - Disabling GuardDuty / SecurityHub / CloudTrail
# - Leaving the AWS Organization
# - Modifying S3 Account-Level Block Public Access
resource "aws_organizations_policy" "mandatory_sec_guardrail" {
  name        = "SeCloudive-Enterprise-Security-Guardrails"
  description = "Denies disabling critical security controls and leaving organization"
  type        = "SERVICE_CONTROL_POLICY"

  content = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "DenyDisablingSecurityServices"
        Effect   = "Deny"
        Action   = [
          "cloudtrail:DeleteTrail",
          "cloudtrail:StopLogging",
          "guardduty:DeleteDetector",
          "guardduty:DisassociateFromMasterAccount",
          "securityhub:DisableSecurityHub",
          "organizations:LeaveOrganization"
        ]
        Resource = "*"
      },
      {
        Sid      = "DenyDisablingS3PublicAccessBlock"
        Effect   = "Deny"
        Action   = [
          "s3:DeleteAccountPublicAccessBlock",
          "s3:PutAccountPublicAccessBlock"
        ]
        Resource = "*"
        Condition = {
          StringNotEquals = {
            "aws:PrincipalArn" = "arn:aws:iam::*:role/OrganizationAccountAccessRole"
          }
        }
      }
    ]
  })
}

output "scp_id" {
  value = aws_organizations_policy.mandatory_sec_guardrail.id
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 11: Service Control Policy (SCP) Guardrail'

Resources:
  SecGuardrailPolicy:
    Type: 'AWS::Organizations::Policy'
    Properties:
      Name: SeCloudive-Enterprise-Security-Guardrails
      Type: SERVICE_CONTROL_POLICY
      Description: Guardrail denying disabling security tools
      Content:
        Version: '2012-10-17'
        Statement:
          - Sid: DenyDisablingSecurityServices
            Effect: Deny
            Action:
              - 'cloudtrail:DeleteTrail'
              - 'cloudtrail:StopLogging'
              - 'guardduty:DeleteDetector'
              - 'organizations:LeaveOrganization'
            Resource: '*'

Outputs:
  PolicyId:
    Value: !Ref SecGuardrailPolicy
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-11'
  },

  // -----------------------------------------------------------------------
  // Lab 12: API Gateway Parameter Tampering to Aurora Serverless SQLi & IAM DB Authentication
  // -----------------------------------------------------------------------
  'lab-apigw-lambda-sqli': {
    title: 'API Gateway Parameter Tampering to Aurora Serverless SQLi & IAM DB Authentication',
    services: ['Amazon API Gateway', 'AWS IAM', 'Amazon RDS'],
    freeTierEligible: true,
    costNote: '$0.00 - API Gateway free tier provides 1M calls/mo',
    terraform: `# =========================================================================
# SeCloudive Lab 12: API Gateway Request Validation & IAM DB Authentication Policy
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. API Gateway REST API with Built-in Request Validation
resource "aws_api_gateway_rest_api" "secure_api" {
  name        = "SeCloudive-Banking-API"
  description = "Hardened API Gateway enforcing JSON schema validation against SQLi"
}

# 2. Strict Request Validator: Validates request body and query params before Lambda invocation
resource "aws_api_gateway_request_validator" "body_and_params" {
  name                        = "ValidateBodyAndParams"
  rest_api_id                 = aws_api_gateway_rest_api.secure_api.id
  validate_request_body       = true
  validate_request_parameters = true
}

# 3. IAM Database Authentication Policy (Replaces static DB passwords)
resource "aws_iam_policy" "iam_db_auth_policy" {
  name        = "SeCloudive-Aurora-IAM-Auth-Policy"
  description = "Allows backend Lambda to connect to Aurora database using temporary IAM tokens"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "AllowDbConnectViaIAM"
        Effect   = "Allow"
        Action   = "rds-db:connect"
        Resource = "arn:aws:rds-db:us-east-1:123456789012:dbuser:cluster-XXXXXXXXXXXX/app_db_user"
      }
    ]
  })
}

output "api_id" {
  value = aws_api_gateway_rest_api.secure_api.id
}

output "iam_db_policy_arn" {
  value = aws_iam_policy.iam_db_auth_policy.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 12: API Gateway Validator & IAM DB Authentication'

Resources:
  SecureApi:
    Type: 'AWS::ApiGateway::RestApi'
    Properties:
      Name: SeCloudive-Banking-API

  RequestValidator:
    Type: 'AWS::ApiGateway::RequestValidator'
    Properties:
      Name: ValidateBodyAndParams
      RestApiId: !Ref SecureApi
      ValidateRequestBody: true
      ValidateRequestParameters: true

Outputs:
  ApiId:
    Value: !Ref SecureApi
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-12'
  },

  // -----------------------------------------------------------------------
  // Lab 13: AWS Transit Gateway Route Table Hijacking & VPC Flow Log Forensic Reconstruction
  // -----------------------------------------------------------------------
  'lab-tgw-route-poisoning': {
    title: 'AWS Transit Gateway Route Table Hijacking & VPC Flow Log Forensic Reconstruction',
    services: ['Amazon VPC', 'Amazon CloudWatch Logs'],
    freeTierEligible: true,
    costNote: '$0.00 - VPC Route Tables and Flow Logs configurations are free',
    terraform: `# =========================================================================
# SeCloudive Lab 13: VPC Route Table Isolation & VPC Flow Logs to CloudWatch
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "default" {
  default = true
}

# 1. Dedicated CloudWatch Log Group for VPC Flow Logs
resource "aws_cloudwatch_log_group" "vpc_flow_logs" {
  name              = "/aws/vpc/secloudive-security-flow-logs"
  retention_in_days = 7
}

# 2. IAM Role for VPC Flow Logs
resource "aws_iam_role" "flow_logs_role" {
  name = "SeCloudive-VpcFlowLogs-PublishRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "vpc-flow-logs.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_role_policy" "flow_logs_policy" {
  name = "CloudWatchLogsPublish"
  role = aws_iam_role.flow_logs_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogStream", "logs:PutLogEvents", "logs:DescribeLogStreams"]
        Resource = "\${aws_cloudwatch_log_group.vpc_flow_logs.arn}:*"
      }
    ]
  })
}

# 3. VPC Flow Log: Captures both ACCEPT and REJECT for forensics
resource "aws_flow_log" "forensic_flow_log" {
  iam_role_arn    = aws_iam_role.flow_logs_role.arn
  log_destination = aws_cloudwatch_log_group.vpc_flow_logs.arn
  traffic_type    = "ALL"
  vpc_id          = data.aws_vpc.default.id
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.vpc_flow_logs.name
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 13: VPC Flow Logs Forensic Logging'

Resources:
  FlowLogGroup:
    Type: 'AWS::Logs::LogGroup'
    Properties:
      LogGroupName: /aws/vpc/secloudive-security-flow-logs
      RetentionInDays: 7

Outputs:
  LogGroupName:
    Value: !Ref FlowLogGroup
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-13'
  },

  // -----------------------------------------------------------------------
  // Lab 14: KMS Customer Master Key Malicious Deletion Triage & S3 Ransomware Recovery
  // -----------------------------------------------------------------------
  'lab-kms-ransomware-deletion': {
    title: 'KMS Customer Master Key Malicious Deletion Triage & S3 Ransomware Recovery',
    services: ['AWS KMS', 'Amazon S3', 'Amazon EventBridge'],
    freeTierEligible: true,
    costNote: '$0.00 - S3 Versioning & KMS event alerts are free of charge',
    terraform: `# =========================================================================
# SeCloudive Lab 14: KMS Key Deletion Defense & S3 Ransomware Immutability
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "random_id" "vault_suffix" {
  byte_length = 4
}

# 1. Ransomware-Proof S3 Bucket with Versioning Enabled
resource "aws_s3_bucket" "ransomware_proof_vault" {
  bucket        = "secloudive-backup-vault-\${random_id.vault_suffix.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_versioning" "vault_versioning" {
  bucket = aws_s3_bucket.ransomware_proof_vault.id

  versioning_configuration {
    status = "Enabled" # Enables rapid recovery from unauthorized ransomware overwrite
  }
}

# 2. EventBridge Rule Detecting KMS Key Deletion Scheduling
resource "aws_cloudwatch_event_rule" "detect_kms_deletion" {
  name        = "SeCloudive-Detect-KMS-KeyDeletion"
  description = "Immediate alert when ScheduleKeyDeletion API is invoked on any KMS key"

  event_pattern = jsonencode({
    source      = ["aws.kms"]
    detail-type = ["AWS API Call via CloudTrail"]
    detail = {
      eventSource = ["kms.amazonaws.com"]
      eventName   = ["ScheduleKeyDeletion", "DisableKey"]
    }
  })
}

output "ransomware_vault_id" {
  value = aws_s3_bucket.ransomware_proof_vault.id
}

output "kms_alert_rule_arn" {
  value = aws_cloudwatch_event_rule.detect_kms_deletion.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 14: KMS Deletion Alert & S3 Versioning Immutability'

Resources:
  KmsDeletionRule:
    Type: 'AWS::Events::Rule'
    Properties:
      Name: SeCloudive-Detect-KMS-KeyDeletion
      Description: Triggers when ScheduleKeyDeletion is called
      EventPattern:
        source:
          - aws.kms
        detail-type:
          - AWS API Call via CloudTrail
        detail:
          eventSource:
            - kms.amazonaws.com
          eventName:
            - ScheduleKeyDeletion
            - DisableKey

Outputs:
  RuleArn:
    Value: !GetAtt KmsDeletionRule.Arn
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-14'
  },

  // -----------------------------------------------------------------------
  // Lab 15: GitHub Actions OIDC Trust Policy Hijacking & Terraform State Tamper Defense
  // -----------------------------------------------------------------------
  'lab-cicd-oidc-hijack': {
    title: 'GitHub Actions OIDC Trust Policy Hijacking & Terraform State Tamper Defense',
    services: ['AWS IAM', 'AWS STS'],
    freeTierEligible: true,
    costNote: '$0.00 - IAM OpenID Connect identity providers and roles are 100% free',
    terraform: `# =========================================================================
# SeCloudive Lab 15: Hardened GitHub Actions OIDC Trust Policy with Strict 'sub' Claim
# 100% Free Tier Safe
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. Scoped GitHub Actions OIDC Role
# Prevents fork PR token abuse by matching exact repo:org/repo:ref:refs/heads/main
resource "aws_iam_role" "github_oidc_deploy_role" {
  name        = "SeCloudive-GitHub-Actions-DeployerRole"
  description = "Scoped OIDC role: only main branch from authorized repository can assume"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            # STRICT GUARD: Only merges to main branch in your exact repo are allowed
            "token.actions.githubusercontent.com:sub" = "repo:my-enterprise-org/prod-infrastructure:ref:refs/heads/main"
          }
        }
      }
    ]
  })
}

output "oidc_role_arn" {
  value = aws_iam_role.github_oidc_deploy_role.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 15: GitHub Actions OIDC Trust Policy'

Resources:
  GitHubOidcRole:
    Type: 'AWS::IAM::Role'
    Properties:
      RoleName: SeCloudive-GitHub-Actions-DeployerRole
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Federated: 'arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com'
            Action: sts:AssumeRoleWithWebIdentity
            Condition:
              StringEquals:
                'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com'
              StringLike:
                'token.actions.githubusercontent.com:sub': 'repo:my-enterprise-org/prod-infrastructure:ref:refs/heads/main'

Outputs:
  RoleArn:
    Value: !GetAtt GitHubOidcRole.Arn
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-15'
  },

  // -----------------------------------------------------------------------
  // Lab 16: Cognito User Pool IDOR, Claim Spoofing & OAuth2 Token Signature Verification
  // -----------------------------------------------------------------------
  'lab-cognito-jwt-tampering': {
    title: 'Cognito User Pool IDOR, Claim Spoofing & OAuth2 Token Signature Verification',
    services: ['Amazon Cognito', 'AWS IAM'],
    freeTierEligible: true,
    costNote: '$0.00 - Amazon Cognito allows 50,000 monthly active users 100% free',
    terraform: `# =========================================================================
# SeCloudive Lab 16: Hardened Cognito User Pool with OAuth2 Scopes & Client Secret
# 100% Free Tier Safe (50,000 Free MAUs)
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 1. Hardened Cognito User Pool
resource "aws_cognito_user_pool" "banking_pool" {
  name = "secloudive-banking-userpool"

  password_policy {
    minimum_length                   = 14
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 3
  }

  mfa_configuration = "OPTIONAL"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}

# 2. Hardened App Client with Client Secret Enforced (Blocks client-side JWT tampering)
resource "aws_cognito_user_pool_client" "backend_client" {
  name         = "secloudive-backend-auth-client"
  user_pool_id = aws_cognito_user_pool.banking_pool.id

  generate_secret                      = true # Client secret prevents public impersonation
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  callback_urls                        = ["https://localhost:5175/auth/callback"]
}

output "user_pool_id" {
  value = aws_cognito_user_pool.banking_pool.id
}

output "client_id" {
  value = aws_cognito_user_pool_client.backend_client.id
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab 16: Cognito User Pool Hardening & OAuth2 Client Secret'

Resources:
  HardenedUserPool:
    Type: 'AWS::Cognito::UserPool'
    Properties:
      UserPoolName: secloudive-banking-userpool
      Policies:
        PasswordPolicy:
          MinimumLength: 14
          RequireLowercase: true
          RequireNumbers: true
          RequireSymbols: true
          RequireUppercase: true

  HardenedAppClient:
    Type: 'AWS::Cognito::UserPoolClient'
    Properties:
      ClientName: secloudive-backend-auth-client
      UserPoolId: !Ref HardenedUserPool
      GenerateSecret: true
      AllowedOAuthFlows:
        - code
      AllowedOAuthScopes:
        - email
        - openid

Outputs:
  UserPoolId:
    Value: !Ref HardenedUserPool
  ClientId:
    Value: !Ref HardenedAppClient
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-16'
  }
}

// Backwards-compatibility aliases
LAB_IAC_TEMPLATES['LAB-01'] = LAB_IAC_TEMPLATES['lab-iam-escalation']
LAB_IAC_TEMPLATES['LAB-IAM-01'] = LAB_IAC_TEMPLATES['lab-iam-escalation']

LAB_IAC_TEMPLATES['LAB-02'] = LAB_IAC_TEMPLATES['lab-s3-dlp-kms']
LAB_IAC_TEMPLATES['LAB-S3-01'] = LAB_IAC_TEMPLATES['lab-s3-dlp-kms']

LAB_IAC_TEMPLATES['LAB-03'] = LAB_IAC_TEMPLATES['lab-ec2-imds-containment']
LAB_IAC_TEMPLATES['LAB-NET-01'] = LAB_IAC_TEMPLATES['lab-ec2-imds-containment']

LAB_IAC_TEMPLATES['LAB-04'] = LAB_IAC_TEMPLATES['lab-cloudtrail-guardrail']
LAB_IAC_TEMPLATES['LAB-AUD-01'] = LAB_IAC_TEMPLATES['lab-cloudtrail-guardrail']

LAB_IAC_TEMPLATES['LAB-05'] = LAB_IAC_TEMPLATES['lab-lambda-egress-hardening']
LAB_IAC_TEMPLATES['LAB-06'] = LAB_IAC_TEMPLATES['lab-confused-deputy-mitigation']
LAB_IAC_TEMPLATES['LAB-07'] = LAB_IAC_TEMPLATES['lab-rds-snapshot-encryption']
LAB_IAC_TEMPLATES['LAB-08'] = LAB_IAC_TEMPLATES['lab-waf-alb-lockdown']
LAB_IAC_TEMPLATES['LAB-09'] = LAB_IAC_TEMPLATES['lab-eks-pod-compromise']
LAB_IAC_TEMPLATES['LAB-10'] = LAB_IAC_TEMPLATES['lab-github-secrets-leak']
LAB_IAC_TEMPLATES['LAB-11'] = LAB_IAC_TEMPLATES['lab-scp-organizations-bypass']
LAB_IAC_TEMPLATES['LAB-12'] = LAB_IAC_TEMPLATES['lab-apigw-lambda-sqli']
LAB_IAC_TEMPLATES['LAB-13'] = LAB_IAC_TEMPLATES['lab-tgw-route-poisoning']
LAB_IAC_TEMPLATES['LAB-14'] = LAB_IAC_TEMPLATES['lab-kms-ransomware-deletion']
LAB_IAC_TEMPLATES['LAB-15'] = LAB_IAC_TEMPLATES['lab-cicd-oidc-hijack']
LAB_IAC_TEMPLATES['LAB-16'] = LAB_IAC_TEMPLATES['lab-cognito-jwt-tampering']

/**
 * Get or generate an IaC template bundle for any lab ID
 */
export function getLabIacTemplate(labId, labTitle = 'AWS Security Lab') {
  if (!labId) {
    return LAB_IAC_TEMPLATES['lab-iam-escalation']
  }

  // 1. Exact match
  if (LAB_IAC_TEMPLATES[labId]) {
    return LAB_IAC_TEMPLATES[labId]
  }

  // 2. Normalized match (lowercase, dashes)
  const normalized = labId.toLowerCase().replace(/_/g, '-')
  if (LAB_IAC_TEMPLATES[normalized]) {
    return LAB_IAC_TEMPLATES[normalized]
  }

  // 3. Match by prefix / key lookup
  const matchedKey = Object.keys(LAB_IAC_TEMPLATES).find(
    k => k.toLowerCase() === normalized || k.toLowerCase().includes(normalized) || normalized.includes(k.toLowerCase())
  )
  if (matchedKey) {
    return LAB_IAC_TEMPLATES[matchedKey]
  }

  // Fallback: Generate clean, safe generic Free Tier template
  const sanitizedId = (labId || 'LAB-GEN').replace(/[^a-zA-Z0-9-]/g, '')
  return {
    title: `${labTitle} (Safe Sandbox Deployment)`,
    services: ['AWS IAM', 'Amazon CloudWatch'],
    freeTierEligible: true,
    costNote: '$0.00 - Standard AWS Free Tier Guardrails enforced',
    terraform: `# =========================================================================
# SeCloudive Free-Tier Lab: ${labTitle}
# Resource: Safe IAM Policy & CloudWatch Alarm Template
# =========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      Project     = "SeCloudive"
      LabId       = "${sanitizedId}"
      Environment = "Sandbox-FreeTier"
    }
  }
}

resource "aws_iam_policy" "lab_policy" {
  name        = "SeCloudive-${sanitizedId}-Policy"
  description = "Scoped policy for SeCloudive hands-on lab verification"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "ScopedAuditingAccess"
        Effect   = "Allow"
        Action   = [
          "iam:Get*",
          "iam:List*",
          "cloudtrail:DescribeTrails",
          "cloudtrail:GetTrailStatus"
        ]
        Resource = "*"
      }
    ]
  })
}

output "policy_arn" {
  value = aws_iam_policy.lab_policy.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab ${sanitizedId}: ${labTitle} (Safe Free Tier)'

Resources:
  LabPolicy:
    Type: 'AWS::IAM::ManagedPolicy'
    Properties:
      ManagedPolicyName: SeCloudive-${sanitizedId}-Policy
      Description: Scoped policy for SeCloudive hands-on lab verification
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Sid: ScopedAuditingAccess
            Effect: Allow
            Action:
              - 'iam:Get*'
              - 'iam:List*'
              - 'cloudtrail:DescribeTrails'
              - 'cloudtrail:GetTrailStatus'
            Resource: '*'

Outputs:
  PolicyArn:
    Value: !Ref LabPolicy
`,
    teardownCmd: `terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-${sanitizedId}`
  }
}
