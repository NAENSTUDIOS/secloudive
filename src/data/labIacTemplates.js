// =========================================================================
// SeCloudive - Safe AWS Free Tier IaC Templates (Terraform & CloudFormation)
// 100% Free Tier Compatible - Safe Zero-Cost Lab Launchers
// =========================================================================

export const LAB_IAC_TEMPLATES = {
  // Lab 1: IAM Least Privilege & Privilege Boundaries
  'LAB-IAM-01': {
    title: 'IAM Least-Privilege & Permission Boundary Sandbox',
    services: ['AWS IAM'],
    freeTierEligible: true,
    costNote: '$0.00 - IAM resources are 100% free of charge in AWS',
    terraform: `# =========================================================================
# SeCloudive Free-Tier Lab: IAM Least Privilege & Permission Boundary
# Provider: AWS (Zero Cost IAM Resources)
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
      Environment = "Sandbox-FreeTier"
      LabId       = "LAB-IAM-01"
      Owner       = "SecurityLearner"
    }
  }
}

# 1. Permission Boundary Policy to Prevent Privilege Escalation
resource "aws_iam_policy" "boundary" {
  name        = "SeCloudive-Dev-PermissionBoundary"
  description = "Maximum permissions allowed for the sandboxed developer role"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "AllowScopedEC2AndS3"
        Effect   = "Allow"
        Action   = [
          "ec2:Describe*",
          "s3:ListAllMyBuckets",
          "s3:GetBucketLocation"
        ]
        Resource = "*"
      },
      {
        Sid      = "DenyPrivilegeEscalation"
        Effect   = "Deny"
        Action   = [
          "iam:CreateUser",
          "iam:CreateRole",
          "iam:AttachUserPolicy",
          "iam:AttachRolePolicy",
          "iam:PutUserPolicy",
          "iam:PutRolePolicy",
          "iam:PassRole"
        ]
        Resource = "*"
      }
    ]
  })
}

# 2. Sandboxed IAM Role with Boundary Enforced
resource "aws_iam_role" "sandboxed_dev" {
  name                 = "SeCloudive-RestrictedDeveloperRole"
  permissions_boundary = aws_iam_policy.boundary.arn

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

output "role_arn" {
  description = "Sandboxed IAM Role ARN"
  value       = aws_iam_role.sandboxed_dev.arn
}

output "boundary_arn" {
  description = "Enforced Permission Boundary Policy ARN"
  value       = aws_iam_policy.boundary.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab LAB-IAM-01: IAM Least Privilege & Permission Boundary (Free Tier Safe)'

Metadata:
  SeCloudive:
    LabId: LAB-IAM-01
    Cost: FreeTierEligible

Resources:
  # 1. Permission Boundary Policy
  SeCloudivePermissionBoundary:
    Type: 'AWS::IAM::ManagedPolicy'
    Properties:
      ManagedPolicyName: SeCloudive-Dev-PermissionBoundary
      Description: Maximum allowable permissions for junior developer roles
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Sid: AllowScopedReadOps
            Effect: Allow
            Action:
              - 'ec2:Describe*'
              - 's3:ListAllMyBuckets'
              - 's3:GetBucketLocation'
            Resource: '*'
          - Sid: DenyPrivilegeEscalation
            Effect: Deny
            Action:
              - 'iam:CreateUser'
              - 'iam:CreateRole'
              - 'iam:AttachUserPolicy'
              - 'iam:AttachRolePolicy'
              - 'iam:PassRole'
            Resource: '*'

  # 2. Scoped IAM Role
  SeCloudiveRestrictedRole:
    Type: 'AWS::IAM::Role'
    Properties:
      RoleName: SeCloudive-RestrictedDeveloperRole
      PermissionsBoundary: !Ref SeCloudivePermissionBoundary
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service: ec2.amazonaws.com
            Action: 'sts:AssumeRole'

Outputs:
  RoleArn:
    Description: ARN of the sandboxed IAM role
    Value: !GetAtt SeCloudiveRestrictedRole.Arn
  BoundaryArn:
    Description: ARN of the permission boundary
    Value: !Ref SeCloudivePermissionBoundary
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-IAM-01'
  },

  // Lab 2: S3 Hardening, Public Access Block & SSE-KMS
  'LAB-S3-01': {
    title: 'S3 Zero-Trust Hardening & Public Access Block',
    services: ['Amazon S3', 'AWS KMS'],
    freeTierEligible: true,
    costNote: '$0.00 - Standard S3 Free Tier (5GB storage, 20,000 GET requests)',
    terraform: `# =========================================================================
# SeCloudive Free-Tier Lab: S3 Zero-Trust Hardening & KMS Encryption
# Provider: AWS (Free Tier Storage)
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
      Environment = "Sandbox-FreeTier"
      LabId       = "LAB-S3-01"
    }
  }
}

# 1. Random suffix for globally unique S3 bucket name
resource "random_id" "vault_suffix" {
  byte_length = 4
}

# 2. Hardened Private S3 Bucket
resource "aws_s3_bucket" "secure_vault" {
  bucket        = "secloudive-vault-\${random_id.vault_suffix.hex}"
  force_destroy = true
}

# 3. Enable Strict Block Public Access (All 4 Flags True)
resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket = aws_s3_bucket.secure_vault.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 4. Enforce AES256 / SSE-S3 Encryption by Default
resource "aws_s3_bucket_server_side_encryption_configuration" "encryption" {
  bucket = aws_s3_bucket.secure_vault.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 5. Bucket Policy Enforcing TLS 1.2+ HTTPS Only
resource "aws_s3_bucket_policy" "enforce_tls" {
  bucket = aws_s3_bucket.secure_vault.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "EnforceTLSRequestsOnly"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.secure_vault.arn,
          "\${aws_s3_bucket.secure_vault.arn}/*"
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

output "bucket_name" {
  value = aws_s3_bucket.secure_vault.id
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab LAB-S3-01: S3 Bucket Zero-Trust Hardening with TLS & Public Access Block'

Resources:
  SeCloudiveSecureBucket:
    Type: 'AWS::S3::Bucket'
    Properties:
      BucketName: !Sub 'secloudive-vault-\${AWS::AccountId}-\${AWS::Region}'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256

  SeCloudiveTLSBucketPolicy:
    Type: 'AWS::S3::BucketPolicy'
    Properties:
      Bucket: !Ref SeCloudiveSecureBucket
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Sid: EnforceTLSOnly
            Effect: Deny
            Principal: '*'
            Action: 's3:*'
            Resource:
              - !GetAtt SeCloudiveSecureBucket.Arn
              - !Sub '\${SeCloudiveSecureBucket.Arn}/*'
            Condition:
              Bool:
                'aws:SecureTransport': 'false'

Outputs:
  BucketName:
    Description: Name of the hardened S3 bucket
    Value: !Ref SeCloudiveSecureBucket
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-S3-01'
  },

  // Lab 3: VPC Security Group & Network Segmentation
  'LAB-NET-01': {
    title: 'VPC Perimeter Isolation & Micro-segmentation',
    services: ['Amazon VPC', 'EC2 Security Groups'],
    freeTierEligible: true,
    costNote: '$0.00 - VPCs and Security Groups incur $0.00 in AWS Free Tier',
    terraform: `# =========================================================================
# SeCloudive Free-Tier Lab: VPC Micro-segmentation & Hardened Security Groups
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

# 1. Isolated Sandbox VPC (No Internet Gateway attached)
resource "aws_vpc" "sandbox" {
  cidr_block           = "10.50.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name    = "SeCloudive-Isolated-VPC"
    Project = "SeCloudive"
  }
}

# 2. Private Subnet with Zero Public IP Assignment
resource "aws_subnet" "private_tier" {
  vpc_id                  = aws_vpc.sandbox.id
  cidr_block              = "10.50.1.0/24"
  map_public_ip_on_launch = false

  tags = {
    Name = "SeCloudive-PrivateSubnet-App"
  }
}

# 3. Hardened Security Group: Denies 0.0.0.0/0 Ingress
resource "aws_security_group" "app_tier_sg" {
  name        = "secloudive-app-tier-sg"
  description = "Restricts ingress strictly to VPC internal CIDR; no 0.0.0.0/0 allowed"
  vpc_id      = aws_vpc.sandbox.id

  # Ingress: Allow HTTPS only from internal VPC subnet
  ingress {
    description = "Internal HTTPS only"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [aws_subnet.private_tier.cidr_block]
  }

  # Egress: Scoped to HTTPS out, no arbitrary open outbound
  egress {
    description = "Allow outbound HTTPS for updates"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "SeCloudive-Hardened-SG"
  }
}

output "vpc_id" {
  value = aws_vpc.sandbox.id
}

output "security_group_id" {
  value = aws_security_group.app_tier_sg.id
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab LAB-NET-01: VPC Micro-segmentation & Zero 0.0.0.0/0 Ingress'

Resources:
  SeCloudiveVPC:
    Type: 'AWS::EC2::VPC'
    Properties:
      CidrBlock: 10.50.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: SeCloudive-Isolated-VPC

  SeCloudiveSubnet:
    Type: 'AWS::EC2::Subnet'
    Properties:
      VpcId: !Ref SeCloudiveVPC
      CidrBlock: 10.50.1.0/24
      MapPublicIpOnLaunch: false
      Tags:
        - Key: Name
          Value: SeCloudive-PrivateSubnet-App

  SeCloudiveSecurityGroup:
    Type: 'AWS::EC2::SecurityGroup'
    Properties:
      GroupName: secloudive-app-tier-sg
      GroupDescription: Restricts ingress strictly to internal VPC CIDR
      VpcId: !Ref SeCloudiveVPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 10.50.1.0/24
          Description: Internal HTTPS Only
      SecurityGroupEgress:
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0
          Description: Outbound HTTPS Only

Outputs:
  VpcId:
    Value: !Ref SeCloudiveVPC
  SecurityGroupId:
    Value: !Ref SeCloudiveSecurityGroup
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-NET-01'
  },

  // Lab 4: CloudTrail & Security Auditing
  'LAB-AUD-01': {
    title: 'CloudTrail Multi-Region Audit Trail & Log Integrity',
    services: ['AWS CloudTrail', 'Amazon S3', 'AWS CloudWatch'],
    freeTierEligible: true,
    costNote: '$0.00 - First CloudTrail management event trail is 100% Free in AWS',
    terraform: `# =========================================================================
# SeCloudive Free-Tier Lab: CloudTrail Multi-Region Auditing & Log Validation
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

data "aws_caller_identity" "current" {}

resource "random_id" "trail_id" {
  byte_length = 4
}

# 1. Dedicated S3 Bucket for CloudTrail Audit Logs
resource "aws_s3_bucket" "audit_bucket" {
  bucket        = "secloudive-trail-audit-\${random_id.trail_id.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "audit_block" {
  bucket = aws_s3_bucket.audit_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 2. Bucket Policy Allowing CloudTrail Service Delivery
resource "aws_s3_bucket_policy" "cloudtrail_delivery" {
  bucket = aws_s3_bucket.audit_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AWSCloudTrailAclCheck"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.audit_bucket.arn
      },
      {
        Sid    = "AWSCloudTrailWrite"
        Effect = "Allow"
        Principal = {
          Service = "cloudtrail.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "\${aws_s3_bucket.audit_bucket.arn}/AWSLogs/\${data.aws_caller_identity.current.account_id}/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      }
    ]
  })
}

# 3. Multi-Region Trail with Log File Validation Enabled (CIS AWS §3.2)
resource "aws_cloudtrail" "security_trail" {
  name                          = "secloudive-master-audit-trail"
  s3_bucket_name                = aws_s3_bucket.audit_bucket.id
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_log_file_validation    = true

  depends_on = [aws_s3_bucket_policy.cloudtrail_delivery]
}

output "trail_arn" {
  value = aws_cloudtrail.security_trail.arn
}
`,
    cloudformation: `AWSTemplateFormatVersion: '2010-09-09'
Description: 'SeCloudive Lab LAB-AUD-01: Free Tier CloudTrail Multi-Region Audit Trail'

Resources:
  AuditBucket:
    Type: 'AWS::S3::Bucket'
    Properties:
      BucketName: !Sub 'secloudive-trail-\${AWS::AccountId}'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

  AuditBucketPolicy:
    Type: 'AWS::S3::BucketPolicy'
    Properties:
      Bucket: !Ref AuditBucket
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Sid: CloudTrailAcl
            Effect: Allow
            Principal:
              Service: cloudtrail.amazonaws.com
            Action: 's3:GetBucketAcl'
            Resource: !GetAtt AuditBucket.Arn
          - Sid: CloudTrailWrite
            Effect: Allow
            Principal:
              Service: cloudtrail.amazonaws.com
            Action: 's3:PutObject'
            Resource: !Sub '\${AuditBucket.Arn}/AWSLogs/\${AWS::AccountId}/*'
            Condition:
              StringEquals:
                's3:x-amz-acl': bucket-owner-full-control

  SecurityTrail:
    Type: 'AWS::CloudTrail::Trail'
    DependsOn: AuditBucketPolicy
    Properties:
      TrailName: secloudive-master-audit-trail
      S3BucketName: !Ref AuditBucket
      IsMultiRegionTrail: true
      IncludeGlobalServiceEvents: true
      EnableLogFileValidation: true
      IsLogging: true

Outputs:
  TrailArn:
    Value: !GetAtt SecurityTrail.Arn
`,
    teardownCmd: 'terraform destroy -auto-approve  # or: aws cloudformation delete-stack --stack-name SeCloudive-Lab-AUD-01'
  }
}

/**
 * Get or generate an IaC template bundle for any lab ID
 */
export function getLabIacTemplate(labId, labTitle = 'AWS Security Lab') {
  if (LAB_IAC_TEMPLATES[labId]) {
    return LAB_IAC_TEMPLATES[labId]
  }

  // Fallback: Generate clean, safe generic Free Tier template for any other lab
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

# Sandboxed Security Policy for Lab Verification
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
