// Cloudive Studio: Bridging Cloud Architecture & Building with Defensive Security
// Full dual-mode schemas, interactive topology state, IaC linter rules, FinOps threat scenarios, and Multi-Cloud matrix

export const DUAL_MODE_SCENARIOS = [
  {
    id: 'scenario-3tier',
    title: '3-Tier Microservices Architecture (ALB -> Private ECS -> Aurora RDS)',
    domain: 'Architecture & Network',
    level: 'Intermediate',
    summary: 'How cloud architects build resilient 3-tier web applications, and how security engineers prevent lateral movement.',
    builder: {
      roleTitle: 'DevOps / Cloud Solutions Architect',
      objective: 'Deploy a highly available, auto-scaling web application spanning 2 Availability Zones with zero public database exposure.',
      architectureHighlights: [
        'Public Subnets (AZ-a & AZ-b) hosting Application Load Balancers (ALBs) with HTTPS TLS 1.3 termination.',
        'Private Application Subnets hosting ECS Fargate tasks with isolated routing tables.',
        'Isolated Data Subnets hosting Amazon Aurora PostgreSQL Multi-AZ cluster with no Internet Gateway route.',
        'NAT Gateways for outbound container image pulls and external API calls.'
      ],
      terraformCode: `# Production 3-Tier AWS Architecture Terraform Blueprint
resource "aws_vpc" "production_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Environment = "Production"
    ManagedBy   = "Terraform"
    Compliance  = "CIS-AWS-v3"
  }
}

resource "aws_lb" "external_alb" {
  name               = "prod-public-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]
  drop_invalid_header_fields = true
}

resource "aws_ecs_cluster" "app_cluster" {
  name = "prod-microservices-cluster"
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}`,
      cloudFormationSnippet: `AWSTemplateFormatVersion: '2010-09-09'
Description: Production 3-Tier Multi-AZ VPC Architecture
Resources:
  ProductionVPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Environment
          Value: Production`,
      devopsChecklist: [
        'VPC CIDR /16 divided into public, application, and database subnets.',
        'Multi-AZ redundancy configured across us-east-1a and us-east-1b.',
        'NAT Gateways configured with Elastic IPs for private subnet egress.',
        'Application Load Balancer health checks configured with 15s interval.'
      ]
    },
    defender: {
      roleTitle: 'Senior Cloud Security Engineer',
      threatModel: 'Adversary targeting public ALB via HTTP request smuggling or SQL injection to pivot into internal ECS containers.',
      exploitVector: 'If ECS security group permits ingress from 0.0.0.0/0 rather than strictly the ALB Security Group ID, attackers can bypass WAF and directly target backend API endpoints.',
      strideCategory: 'Elevation of Privilege & Information Disclosure',
      guardrails: [
        'Enforce AWS WAFv2 WebACL on ALB with AWSManagedRulesCommonRuleSet and SQLi rule sets.',
        'Security Group Chaining: ECS Task SG ingress must allow port 8080 ONLY from alb_sg.id (reference by SG ID, not CIDR).',
        'Database SG must allow port 5432 ONLY from ecs_task_sg.id.',
        'Enable VPC Flow Logs with rejected traffic alerting via CloudWatch Metric Filter.'
      ],
      cloudTrailTelemetry: `{
  "eventSource": "ec2.amazonaws.com",
  "eventName": "AuthorizeSecurityGroupIngress",
  "userIdentity": { "type": "AssumedRole", "principalId": "AROA...:build-pipeline" },
  "requestParameters": {
    "groupId": "sg-0a81f3e72c",
    "ipPermissions": [
      { "ipProtocol": "tcp", "fromPort": 8080, "toPort": 8080, "ipRanges": [{ "cidrIp": "0.0.0.0/0" }] }
    ]
  },
  "anomaly": "CRITICAL: Private ECS container exposed directly to public internet without ALB boundary."
}`,
      remediationDiff: `- ingress {
-   from_port   = 8080
-   to_port     = 8080
-   protocol    = "tcp"
-   cidr_blocks = ["0.0.0.0/0"] # VULNERABLE: Direct public ingress
- }
+ ingress {
+   from_port       = 8080
+   to_port         = 8080
+   protocol        = "tcp"
+   security_groups = [aws_security_group.alb_sg.id] # SECURE: SG Chaining
+ }`
    }
  },
  {
    id: 'scenario-datalake',
    title: 'S3 Enterprise Data Lake with KMS CMK & Private VPC Endpoint',
    domain: 'Storage & Cryptography',
    level: 'Advanced',
    summary: 'How architects design petabyte-scale analytics storage, and how security engineers enforce zero-leakage perimeter boundaries.',
    builder: {
      roleTitle: 'Cloud Data Platform Architect',
      objective: 'Store terabytes of customer analytical datasets accessible by EMR Spark clusters and Athena with maximum I/O throughput.',
      architectureHighlights: [
        'S3 bucket configured with intelligent tiering and object lifecycle expiration.',
        'Gateway VPC Endpoint for S3 attached to VPC route tables to route data lake traffic over AWS private backbone ($0 NAT fee).',
        'Athena workgroups partitioned with query result encryption and per-query scan cost limits.'
      ],
      terraformCode: `# S3 Data Lake Infrastructure with Private VPC Endpoint
resource "aws_s3_bucket" "data_lake" {
  bucket = "enterprise-datalake-analytics-prod"
}

resource "aws_vpc_endpoint" "s3_gateway" {
  vpc_id       = aws_vpc.production_vpc.id
  service_name = "com.amazonaws.us-east-1.s3"
  route_table_ids = [aws_route_table.private_app.id]
}`,
      cloudFormationSnippet: `S3GatewayEndpoint:
  Type: AWS::EC2::VPCEndpoint
  Properties:
    VpcId: !Ref ProductionVPC
    ServiceName: !Sub "com.amazonaws.\${AWS::Region}.s3"
    VpcEndpointType: Gateway
    RouteTableIds:
      - !Ref PrivateRouteTable`,
      devopsChecklist: [
        'Gateway endpoint avoids hundreds of dollars in NAT gateway data processing costs.',
        'S3 bucket versioning enabled to prevent accidental deletion of analytical partitions.',
        'Lifecycle rules archive raw logs to S3 Glacier Flexible Retrieval after 90 days.'
      ]
    },
    defender: {
      roleTitle: 'Cloud Security Architect',
      threatModel: 'Compromised insider credential or stolen access key attempting to exfiltrate petabytes of customer records to an external personal S3 bucket.',
      exploitVector: 'Without an Endpoint Policy on the S3 VPC Endpoint, a compromised workload in your private subnet can upload your data to ANY external S3 bucket worldwide.',
      strideCategory: 'Information Disclosure & Data Exfiltration',
      guardrails: [
        'S3 Block Public Access (all 4 flags) enabled at both Account and Bucket level.',
        'Enforce AWS KMS Customer Managed Keys (CMK) with automated key rotation: deny requests without aws:kms header.',
        'VPC Endpoint Policy: Explicitly restrict endpoint traffic ONLY to your corporate AWS Account IDs (Deny Principal: "*" Resource: "arn:aws:s3:::*").',
        'Enforce tls_version >= 1.2 and aws:SecureTransport: true in S3 Bucket Policy.'
      ],
      cloudTrailTelemetry: `{
  "eventSource": "s3.amazonaws.com",
  "eventName": "PutObject",
  "requestParameters": {
    "bucketName": "attacker-owned-drop-bucket",
    "key": "customer_pii_dump.parquet"
  },
  "sourceIPAddress": "10.0.4.12",
  "anomaly": "EXFILTRATION: Workload in private subnet uploaded internal data to external non-corporate S3 bucket."
}`,
      remediationDiff: `+ policy = jsonencode({
+   Version = "2012-10-17"
+   Statement = [{
+     Sid       = "RestrictToOrgBuckets"
+     Effect    = "Allow"
+     Principal = "*"
+     Action    = "s3:*"
+     Resource  = ["arn:aws:s3:::enterprise-datalake-*/*"]
+     Condition = {
+       StringEquals = { "aws:PrincipalOrgID" = "o-enterprise992" }
+     }
+   }]
+ })`
    }
  },
  {
    id: 'scenario-serverless',
    title: 'Serverless REST API (API Gateway -> Lambda -> DynamoDB)',
    domain: 'Serverless & Identity',
    level: 'Beginner / Intermediate',
    summary: 'Building serverless microservices at zero idle cost versus preventing broken object level authorization (BOLA) and Lambda execution role privilege sprawl.',
    builder: {
      roleTitle: 'Full-Stack Cloud Developer',
      objective: 'Build an auto-scaling customer profile API with sub-100ms response time and zero servers to patch or maintain.',
      architectureHighlights: [
        'Amazon API Gateway HTTP API with CORS configuration and JWT authorizer.',
        'AWS Lambda functions running Python 3.12 with ARM64 Graviton runtime for 20% lower cost.',
        'Amazon DynamoDB table with on-demand capacity and point-in-time recovery (PITR).'
      ],
      terraformCode: `# Serverless Microservice API
resource "aws_apigatewayv2_api" "http_api" {
  name          = "customer-profiles-api"
  protocol_type = "HTTP"
}

resource "aws_lambda_function" "profile_handler" {
  function_name = "get-customer-profile"
  runtime       = "python3.12"
  architectures = ["arm64"]
  role          = aws_iam_role.lambda_exec.id
  handler       = "index.handler"
}`,
      cloudFormationSnippet: `CustomerProfileFunction:
  Type: AWS::Serverless::Function
  Properties:
    Handler: index.handler
    Runtime: python3.12
    Architectures:
      - arm64
    Events:
      GetProfile:
        Type: HttpApi
        Properties:
          Path: /profiles/{id}
          Method: get`,
      devopsChecklist: [
        'DynamoDB On-Demand billing scales seamlessly from 0 to 10,000 requests/sec.',
        'Graviton ARM64 architecture cuts runtime execution costs.',
        'API Gateway payload compression enabled for payloads over 1KB.'
      ]
    },
    defender: {
      roleTitle: 'AppSec & Cloud Security Specialist',
      threatModel: 'Attacker probes `/profiles/{id}` API endpoint, tampering with path parameters to read other customers private profile data (IDOR / BOLA).',
      exploitVector: 'Lambda execution role granted `dynamodb:*` across all tables, allowing any code vulnerability or vulnerable NPM/PyPI dependency to dump the entire database.',
      strideCategory: 'Tampering, Spoofing & Information Disclosure',
      guardrails: [
        'Granular IAM Policy: Lambda must only possess `dynamodb:GetItem` and `dynamodb:UpdateItem` on the exact table ARN.',
        'Implement Cognito User Pool JWT claim validation verifying `requestContext.authorizer.jwt.claims.sub == pathParameters.id`.',
        'Enable AWS X-Ray tracing to detect unusual database scanning behavior.',
        'Store secrets in AWS Secrets Manager or Systems Manager Parameter Store with KMS encryption, not in plain Lambda environment variables.'
      ],
      cloudTrailTelemetry: `{
  "eventSource": "dynamodb.amazonaws.com",
  "eventName": "Scan",
  "userIdentity": { "arn": "arn:aws:iam::123456789012:role/get-customer-profile-exec-role" },
  "anomaly": "ABUSE: Microservice intended for single GetItem issued full table Scan extracting 42,000 rows."
}`,
      remediationDiff: `- Resource = "*"
- Action   = "dynamodb:*"
+ Resource = aws_dynamodb_table.customer_profiles.arn
+ Action   = [
+   "dynamodb:GetItem",
+   "dynamodb:PutItem"
+ ]`
    }
  },
  {
    id: 'scenario-zero-trust-org',
    title: 'Multi-Account Zero-Trust AWS Organization (Control Tower -> Transit Gateway -> Inspection VPC)',
    domain: 'Enterprise Multi-Account & Governance',
    level: 'Advanced / Principal',
    summary: 'How Principal Cloud Architects design enterprise multi-account landing zones, and how SecOps isolates blast radius across corporate accounts.',
    builder: {
      roleTitle: 'Principal Cloud Enterprise Architect',
      objective: 'Build an enterprise AWS Organization with automated account vending, dedicated Security & Log Archive accounts, and centralized egress inspection via AWS Transit Gateway.',
      architectureHighlights: [
        'AWS Organizations with AWS Control Tower baseline and dedicated Organizational Units (Core, Security, Prod, Non-Prod).',
        'Centralized Inspection VPC with AWS Network Firewall inspecting all egress and east-west VPC traffic.',
        'AWS Transit Gateway connecting 50+ workload VPCs with spoke routing tables and zero direct inter-VPC peering.',
        'AWS IAM Identity Center (Single Sign-On) integrated with Okta/Azure AD for zero long-lived credentials.'
      ],
      terraformCode: `# AWS Organizations & Transit Gateway Landing Zone Blueprint
resource "aws_organizations_organization" "enterprise_org" {
  aws_service_access_principals = [
    "cloudtrail.amazonaws.com",
    "guardduty.amazonaws.com",
    "sso.amazonaws.com"
  ]
  feature_set = "ALL"
}

resource "aws_ec2_transit_gateway" "central_hub" {
  description                     = "Central enterprise routing hub"
  auto_accept_shared_attachments = "enable"
  default_route_table_association = "disable"
  default_route_table_propagation = "disable"

  tags = {
    Name        = "enterprise-tgw-hub"
    Environment = "Core-Network"
  }
}

resource "aws_organizations_policy" "deny_unapproved_regions" {
  name        = "EnforceApprovedRegions"
  description = "Blocks any resource creation outside us-east-1 and eu-west-1"
  type        = "SERVICE_CONTROL_POLICY"
  content     = jsonencode({
    Version   = "2012-10-17"
    Statement = [{
      Sid       = "DenyUnapprovedRegions"
      Effect    = "Deny"
      NotAction = ["iam:*", "organizations:*", "route53:*", "cloudfront:*"]
      Resource  = "*"
      Condition = {
        StringNotEquals = {
          "aws:RequestedRegion" = ["us-east-1", "eu-west-1"]
        }
      }
    }]
  })
}`,
      cloudFormationSnippet: `EnterpriseControlTowerBaseline:
  Type: AWS::Organizations::Account
  Properties:
    AccountName: Production-Workloads-01
    Email: aws-prod-workloads@enterprise.internal
    RoleName: OrganizationAccountAccessRole`,
      devopsChecklist: [
        'Centralized Transit Gateway eliminates n*(n-1)/2 complex VPC peering connections.',
        'Automated Account Factory for Terraform (AFT) provisions new developer accounts in under 15 minutes.',
        'Single Sign-On session duration limited to 8 hours with mandatory hardware FIDO2 MFA.',
        'Centralized Log Archive account configured with Object Lock (WORM compliance).'
      ]
    },
    defender: {
      roleTitle: 'Director of Cloud SecOps & Threat Management',
      threatModel: 'Compromise of a developer sandbox account attempting to pivot laterally across VPCs to access production databases or tamper with audit trails.',
      exploitVector: 'If Service Control Policies (SCPs) do not protect CloudTrail or Security Hub, an attacker with administrator credentials in a child account can disable logging and operate undetected.',
      strideCategory: 'Repudiation, Elevation of Privilege & Lateral Movement',
      guardrails: [
        'SCP Guardrail: Prevent any child account (including root) from disabling AWS CloudTrail, GuardDuty, or Security Hub.',
        'SCP Guardrail: Deny all API activity in 15+ unused foreign AWS regions (blocks offshore cryptomining).',
        'Transit Gateway Route Table Isolation: Workload VPC route tables cannot route directly to each other; all traffic must traverse the Inspection VPC.',
        'Centralized Delegated Admin: GuardDuty and Security Hub administered strictly from the dedicated Security Tooling account.'
      ],
      cloudTrailTelemetry: `{
  "eventSource": "cloudtrail.amazonaws.com",
  "eventName": "StopLogging",
  "userIdentity": { "type": "AssumedRole", "principalId": "AROA...:compromised-admin" },
  "errorCode": "AccessDenied",
  "errorMessage": "User is not authorized to perform: cloudtrail:StopLogging due to an explicit deny in a Service Control Policy.",
  "anomaly": "CONTAINED: Adversary attempted to disable CloudTrail logs, but the SCP blocked execution at the Organization root level."
}`,
      remediationDiff: `+ resource "aws_organizations_policy" "protect_security_services" {
+   name        = "PreventDisablingSecurityControls"
+   description = "Protects CloudTrail, Config, and GuardDuty across all child accounts"
+   content     = jsonencode({
+     Version   = "2012-10-17"
+     Statement = [{
+       Sid       = "ProtectAuditTrail"
+       Effect    = "Deny"
+       Action    = [
+         "cloudtrail:DeleteTrail",
+         "cloudtrail:StopLogging",
+         "guardduty:DeleteDetector",
+         "guardduty:DisassociateFromMasterAccount"
+       ]
+       Resource  = "*"
+     }]
+   })
+ }`
    }
  },
  {
    id: 'iac-eks-cluster',
    title: 'Kubernetes Amazon EKS Cluster (Insecure API & Secrets)',
    language: 'terraform',
    filename: 'eks_cluster.tf',
    rawCode: `resource "aws_eks_cluster" "prod_k8s" {
  name     = "enterprise-microservices-eks"
  role_arn = aws_iam_role.eks_master_role.arn
  version  = "1.29"

  vpc_config {
    subnet_ids              = [aws_subnet.public_a.id, aws_subnet.public_b.id]
    endpoint_public_access  = true  # FLAGGED: Public endpoint open to 0.0.0.0/0
    endpoint_private_access = false # FLAGGED: Internal nodes must route through internet
    public_access_cidrs     = ["0.0.0.0/0"]
  }

  # FLAGGED: Missing cluster envelope encryption for Kubernetes Secrets
  # Missing enabled_cluster_log_types (api, audit, authenticator)
}`,
    findings: [
      {
        id: 'CKV_AWS_39',
        severity: 'CRITICAL',
        title: 'EKS Cluster API server has public endpoint access enabled without IP restrictions',
        line: 9,
        cwe: 'CWE-284: Improper Access Control to Orchestration Control Plane',
        impact: 'Exposes Kubernetes kube-apiserver port 443 to the global internet, exposing cluster to zero-day vulnerabilities.'
      },
      {
        id: 'CKV_AWS_58',
        severity: 'HIGH',
        title: 'EKS Cluster secrets are not encrypted using AWS KMS Customer Managed Key',
        line: 1,
        cwe: 'CWE-311: Missing Encryption of Sensitive Data',
        impact: 'Kubernetes secrets stored in etcd are not encrypted at rest with envelope KMS cryptography.'
      },
      {
        id: 'CKV_AWS_37',
        severity: 'MEDIUM',
        title: 'EKS Cluster control plane control logs are disabled',
        line: 1,
        cwe: 'CWE-778: Insufficient Logging',
        impact: 'SecOps cannot audit who ran kubectl commands or authenticate anomalous cluster actions.'
      }
    ],
    remediatedCode: `resource "aws_eks_cluster" "prod_k8s" {
  name     = "enterprise-microservices-eks"
  role_arn = aws_iam_role.eks_master_role.arn
  version  = "1.29"

  vpc_config {
    subnet_ids              = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    endpoint_public_access  = false # SECURED: Private VPC endpoint strictly
    endpoint_private_access = true
  }

  # 1. KMS Envelope Encryption for Kubernetes Secrets
  encryption_config {
    provider {
      key_arn = aws_kms_key.eks_secrets_key.arn
    }
    resources = ["secrets"]
  }

  # 2. Comprehensive Control Plane Audit Logging
  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}`
  },
  {
    id: 'iac-iam-wildcard',
    title: 'IAM Execution Role (Wildcard Privilege Sprawl)',
    language: 'terraform',
    filename: 'iam_execution_role.tf',
    rawCode: `resource "aws_iam_role" "app_backend_role" {
  name = "app-microservice-backend-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "backend_policy" {
  name = "backend-full-access"
  role = aws_iam_role.app_backend_role.id

  # FLAGGED: AdministratorAccess equivalent wildcard policy
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "*"
      Resource = "*"
    }]
  })
}`,
    findings: [
      {
        id: 'CKV_AWS_1',
        severity: 'CRITICAL',
        title: 'IAM Policy allows full wildcard actions (*) across all AWS resources (*)',
        line: 23,
        cwe: 'CWE-250: Execution with Unnecessary Privileges',
        impact: 'Any container compromise yields complete administrative control over the entire AWS account.'
      },
      {
        id: 'CKV_AWS_274',
        severity: 'HIGH',
        title: 'IAM Role is missing a Permission Boundary',
        line: 1,
        cwe: 'CWE-284: Unconstrained Privilege Escalation',
        impact: 'Compromised role can create additional administrative users or roles without organization guardrails.'
      }
    ],
    remediatedCode: `resource "aws_iam_role" "app_backend_role" {
  name                 = "app-microservice-backend-exec"
  permissions_boundary = aws_iam_policy.org_permission_boundary.arn # Guardrail enforced

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "backend_policy" {
  name = "backend-least-privilege"
  role = aws_iam_role.app_backend_role.id

  # SECURED: Scoped actions strictly to dedicated table and bucket ARNs
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject", "s3:PutObject"]
        Resource = "arn:aws:s3:::prod-customer-assets/*"
      },
      {
        Effect   = "Allow"
        Action   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem"]
        Resource = aws_dynamodb_table.customer_orders.arn
      }
    ]
  })
}`
  }
]

// Interactive Cloud Architecture Topology Simulator Nodes
export const TOPOLOGY_NODES_DEFAULT = [
  {
    id: 'node-igw',
    name: 'Internet Gateway',
    layer: 'Perimeter',
    type: 'network',
    status: 'active',
    icon: 'Globe',
    position: { x: 50, y: 180 },
    controls: {
      ddosShield: true,
      wafAttached: true
    },
    threatAlert: false,
    details: 'Entry point for external internet traffic into the public VPC subnet.'
  },
  {
    id: 'node-alb',
    name: 'Public Application Load Balancer',
    layer: 'Ingress',
    type: 'compute',
    status: 'active',
    icon: 'Layers',
    position: { x: 220, y: 180 },
    controls: {
      tlsVersion: 'TLSv1.3',
      dropInvalidHeaders: true,
      wafRuleActive: true
    },
    threatAlert: false,
    details: 'Distributes HTTPS client traffic across private microservices.'
  },
  {
    id: 'node-ec2',
    name: 'EC2 App Cluster (Private Subnet)',
    layer: 'Application',
    type: 'compute',
    status: 'vulnerable',
    icon: 'Cpu',
    position: { x: 420, y: 180 },
    controls: {
      imdsVersion: 'v1', // Switchable: v1 or v2
      publicIpAssigned: false,
      securityGroupOpen: false
    },
    threatAlert: true,
    alertMessage: 'IMDSv1 enabled! Vulnerable to SSRF credential extraction.',
    details: 'Runs application workloads in private subnets with instance profile role attached.'
  },
  {
    id: 'node-iam',
    name: 'Instance Profile IAM Role',
    layer: 'Identity',
    type: 'identity',
    status: 'vulnerable',
    icon: 'ShieldAlert',
    position: { x: 420, y: 40 },
    controls: {
      adminAccess: false,
      wildcardActions: true, // Switchable
      boundaryAttached: false
    },
    threatAlert: true,
    alertMessage: 'Contains s3:* wildcard permissions! Over-permissive blast radius.',
    details: 'Supplies temporary STS credentials to EC2 container workloads.'
  },
  {
    id: 'node-s3',
    name: 'Customer S3 Data Vault',
    layer: 'Data Storage',
    type: 'storage',
    status: 'secure',
    icon: 'Database',
    position: { x: 620, y: 100 },
    controls: {
      blockPublicAccess: true, // Switchable
      kmsCustomerKey: true,
      bucketPolicyEnforced: true
    },
    threatAlert: false,
    details: 'Stores confidential customer application data and analytical datasets.'
  },
  {
    id: 'node-rds',
    name: 'Amazon Aurora PostgreSQL',
    layer: 'Database',
    type: 'database',
    status: 'secure',
    icon: 'Database',
    position: { x: 620, y: 260 },
    controls: {
      storageEncrypted: true,
      publiclyAccessible: false,
      iamAuthEnabled: true
    },
    threatAlert: false,
    details: 'Multi-AZ managed relational database in isolated data subnets.'
  }
]

// Infrastructure as Code (IaC) Security Playground Templates
export const IAC_LINTER_TEMPLATES = [
  {
    id: 'iac-s3-insecure',
    title: 'S3 Customer Vault (Insecure Defaults)',
    language: 'terraform',
    filename: 's3_storage.tf',
    rawCode: `resource "aws_s3_bucket" "financial_vault" {
  bucket = "prod-finance-customer-vault-2026"
  acl    = "public-read" # FLAGGED: Public read access

  # Missing KMS Customer Key
  # Missing Server-Side Encryption Configuration
}

resource "aws_s3_bucket_public_access_block" "vault_block" {
  bucket = aws_s3_bucket.financial_vault.id

  block_public_acls       = false # FLAGGED
  block_public_policy     = false # FLAGGED
  ignore_public_acls      = false # FLAGGED
  restrict_public_buckets = false # FLAGGED
}`,
    findings: [
      {
        id: 'CKV_AWS_20',
        severity: 'CRITICAL',
        title: 'S3 Bucket has an ACL allowing public READ access',
        line: 3,
        cwe: 'CWE-732: Incorrect Permission Assignment for Critical Resource',
        impact: 'Exposes confidential customer financial data to internet scraping bots without authentication.'
      },
      {
        id: 'CKV_AWS_53',
        severity: 'HIGH',
        title: 'S3 Block Public Access is disabled on all four flags',
        line: 11,
        cwe: 'CWE-284: Improper Access Control',
        impact: 'Allows any administrator or pipeline to accidentally expose private files to the world.'
      },
      {
        id: 'CKV_AWS_145',
        severity: 'HIGH',
        title: 'S3 Bucket is not encrypted with Customer Managed Key (KMS CMK)',
        line: 1,
        cwe: 'CWE-311: Missing Encryption of Sensitive Data',
        impact: 'Violates PCI-DSS and HIPAA data-at-rest cryptographic requirements.'
      }
    ],
    remediatedCode: `resource "aws_s3_bucket" "financial_vault" {
  bucket = "prod-finance-customer-vault-2026"
}

# 1. Enforce strict ownership & disable legacy ACLs
resource "aws_s3_bucket_ownership_controls" "vault_ownership" {
  bucket = aws_s3_bucket.financial_vault.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# 2. Block all public access unconditionally
resource "aws_s3_bucket_public_access_block" "vault_block" {
  bucket = aws_s3_bucket.financial_vault.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 3. Enforce KMS Customer Managed Key encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "vault_encryption" {
  bucket = aws_s3_bucket.financial_vault.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.vault_cmk.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}`
  },
  {
    id: 'iac-security-group',
    title: 'EC2 Administrative Security Group',
    language: 'terraform',
    filename: 'security_groups.tf',
    rawCode: `resource "aws_security_group" "admin_access" {
  name        = "bastion-ssh-access"
  description = "Allows SSH access to management jump hosts"
  vpc_id      = aws_vpc.production_vpc.id

  ingress {
    description = "SSH from everywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # FLAGGED: Public internet SSH brute-force
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`,
    findings: [
      {
        id: 'CKV_AWS_24',
        severity: 'CRITICAL',
        title: 'Security Group rule allows ingress from 0.0.0.0/0 to port 22 (SSH)',
        line: 11,
        cwe: 'CWE-284: Open Administrative Port',
        impact: 'Exposes bastion hosts to continuous password spray, automated exploit scanners, and botnet intrusions.'
      }
    ],
    remediatedCode: `resource "aws_security_group" "admin_access" {
  name        = "bastion-ssh-access"
  description = "Allows SSH access strictly from corporate VPN gateway"
  vpc_id      = aws_vpc.production_vpc.id

  ingress {
    description = "SSH strictly from corporate VPN CIDR"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["198.51.100.12/32"] # SECURED: Restricted corporate IP
  }

  # Or even better: Eliminate SSH altogether and use AWS Systems Manager Session Manager!
}`
  }
]

// GPU and Compute Catalog for FinOps Simulator
export const COMPUTE_INSTANCES_CATALOG = [
  { id: 'g5.12xlarge', name: 'g5.12xlarge (4x NVIDIA A10G 96GB GPU)', ratePerHour: 5.672, gpuCount: 4, vcpu: 48, ramGb: 192, useCase: 'Deep Learning & Cryptomining' },
  { id: 'p3.16xlarge', name: 'p3.16xlarge (8x NVIDIA V100 128GB GPU)', ratePerHour: 24.48, gpuCount: 8, vcpu: 64, ramGb: 488, useCase: 'High-Density GPU Parallel Hash Compute' },
  { id: 'p4d.24xlarge', name: 'p4d.24xlarge (8x NVIDIA A100 320GB GPU)', ratePerHour: 32.772, gpuCount: 8, vcpu: 96, ramGb: 1152, useCase: 'Ultra-scale Machine Learning Training' },
  { id: 'c5.9xlarge', name: 'c5.9xlarge (36 vCPU Compute-Optimized)', ratePerHour: 1.53, gpuCount: 0, vcpu: 36, ramGb: 72, useCase: 'CPU Password Brute-forcing & Hashcat' },
  { id: 'r5b.24xlarge', name: 'r5b.24xlarge (96 vCPU Memory-Optimized)', ratePerHour: 7.056, gpuCount: 0, vcpu: 96, ramGb: 768, useCase: 'High Throughput In-Memory Data Exfiltration' }
]

// FinOps & Cryptomining Security Anomaly Detection Scenarios
export const FINOPS_SECURITY_SCENARIOS = [
  {
    id: 'finops-cryptomine-01',
    title: 'The Stolen Developer Key: 32x GPU Cryptomining Spike in Cape Town',
    severity: 'CRITICAL SEV-1',
    costSpike: '$45/mo -> $3,840/day',
    regionAbused: 'af-south-1 (Cape Town)',
    trigger: 'An engineer committed an active AWS Access Key ID and Secret Access Key to a public GitHub repository. Within 4 minutes, automated adversary scrapers detected the key and invoked `ec2:RunInstances` spinning up 32 compute-optimized `g5.12xlarge` GPU instances.',
    financialImpact: 'Each `g5.12xlarge` costs $5.67/hr. 32 instances running unmonitored for 72 hours generates $13,063 in unauthorized compute debt.',
    metrics: [
      { timestamp: '00:00', costPerHour: 1.5, instanceCount: 3, alertState: 'Normal' },
      { timestamp: '02:00', costPerHour: 1.5, instanceCount: 3, alertState: 'Normal' },
      { timestamp: '03:14', costPerHour: 48.0, instanceCount: 12, alertState: 'Warning' },
      { timestamp: '03:30', costPerHour: 181.44, instanceCount: 35, alertState: 'CRITICAL SPIKE' },
      { timestamp: '04:00', costPerHour: 181.44, instanceCount: 35, alertState: 'CRITICAL SPIKE' }
    ],
    guardDutyFinding: {
      type: 'CryptoCurrency:EC2/BitcoinTool.B!DNS',
      severity: 8.5,
      resource: 'i-09f481c02ab8394',
      description: 'EC2 instance is querying DNS records associated with known cryptocurrency mining pools (monerohash.com / stratum+tcp).'
    },
    containmentRunbook: [
      {
        step: 1,
        title: 'Emergency IAM Key Invalidation',
        command: 'aws iam update-access-key --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive',
        explanation: 'Instantly revokes the compromised credential to prevent further API calls.'
      },
      {
        step: 2,
        title: 'Terminate Rogue Instances via CLI',
        command: 'aws ec2 terminate-instances --region af-south-1 --instance-ids $(aws ec2 describe-instances --region af-south-1 --filters "Name=instance-state-name,Values=running" --query "Reservations[*].Instances[*].InstanceId" --output text)',
        explanation: 'Stops the financial hemorrhage by tearing down all mining nodes.'
      },
      {
        step: 3,
        title: 'Enforce Regional Service Control Policy (SCP)',
        command: 'aws organizations attach-policy --policy-id p-deny-unused-regions --target-id ou-prod-1234',
        explanation: 'Denies all AWS actions outside approved corporate regions (us-east-1, eu-west-1).'
      },
      {
        step: 4,
        title: 'Configure AWS Budgets & Anomaly Detection',
        command: 'aws budgets create-budget --account-id 123456789012 --budget file://anomaly-budget.json',
        explanation: 'Alerts SecOps via PagerDuty within 15 minutes of any $50+ billing anomaly.'
      }
    ]
  },
  {
    id: 'finops-egress-exfil',
    title: 'The Silent Bandwidth Leak: 180 TB Cross-Region S3 Exfiltration',
    severity: 'HIGH SEV-2',
    costSpike: '$120/mo -> $16,200/wk',
    regionAbused: 'us-east-1 -> ap-southeast-1 (Singapore)',
    trigger: 'An SSRF vulnerability in an internal analytics worker was exploited to dump S3 customer archives across AWS regions to an adversary-owned S3 bucket in Singapore.',
    financialImpact: 'AWS Data Transfer Out to another AWS Region costs $0.09/GB. Transferring 180 TB generated $16,200 in unexpected egress bandwidth charges.',
    metrics: [
      { timestamp: 'Day 1', costPerHour: 4.2, instanceCount: 2, alertState: 'Normal' },
      { timestamp: 'Day 2', costPerHour: 5.1, instanceCount: 2, alertState: 'Normal' },
      { timestamp: 'Day 3', costPerHour: 88.0, instanceCount: 4, alertState: 'Warning' },
      { timestamp: 'Day 4', costPerHour: 220.0, instanceCount: 4, alertState: 'CRITICAL SPIKE' },
      { timestamp: 'Day 5', costPerHour: 220.0, instanceCount: 4, alertState: 'CRITICAL SPIKE' }
    ],
    guardDutyFinding: {
      type: 'Exfiltration:S3/AnomalousBehavior',
      severity: 7.8,
      resource: 'arn:aws:s3:::corporate-customer-archives',
      description: 'Anomalous volume of S3 GetObject API calls originating from an internal EC2 instance sending data to foreign AWS region endpoint.'
    },
    containmentRunbook: [
      {
        step: 1,
        title: 'Attach Emergency Deny S3 Bucket Policy',
        command: 'aws s3api put-bucket-policy --bucket corporate-customer-archives --policy file://emergency-quarantine-policy.json',
        explanation: 'Blocks all non-emergency GetObject calls to halt the data exfiltration stream immediately.'
      },
      {
        step: 2,
        title: 'Restrict S3 Gateway VPC Endpoint Policy',
        command: 'aws ec2 modify-vpc-endpoint --vpc-endpoint-id vpce-0812ab34cd --policy-document file://org-only-endpoint.json',
        explanation: 'Guarantees that private VPC subnets can only access corporate S3 buckets belonging to your AWS Organization.'
      },
      {
        step: 3,
        title: 'Isolate Exfiltrating EC2 Instance',
        command: 'aws ec2 modify-instance-attribute --instance-id i-08a9f345bcd12 --groups sg-quarantine-isolated',
        explanation: 'Replaces instance security groups with a quarantine security group allowing zero inbound and zero outbound traffic.'
      },
      {
        step: 4,
        title: 'Configure Cost Anomaly Detection Alert',
        command: 'aws ce create-anomaly-monitor --anomaly-monitor file://bandwidth-anomaly-monitor.json',
        explanation: 'Deploys machine-learning powered AWS Cost Anomaly Detection for Data Transfer Out metrics.'
      }
    ]
  }
]

// Enterprise Reference Architectures Library (Cloudive Core Blueprints)
export const REFERENCE_ARCHITECTURES = [
  {
    id: 'blueprint-3tier-enterprise',
    title: 'Enterprise High-Availability Multi-AZ Web Application',
    category: 'Full-Stack Web & Microservices',
    slaTarget: '99.99% Availability',
    estimatedMonthlyCost: '$480 - $850 / month',
    wellArchitectedScore: {
      reliability: 95,
      security: 98,
      costOptimization: 88,
      performance: 92,
      operationalExcellence: 90
    },
    summary: 'The battle-tested gold standard for corporate web applications. Combines AWS CloudFront edge caching, Application Load Balancers, containerized ECS Fargate tasks across 3 AZs, and Amazon Aurora Multi-AZ database clustering.',
    coreServices: ['AWS CloudFront', 'Application Load Balancer', 'AWS WAFv2', 'Amazon ECS (Fargate)', 'Amazon Aurora PostgreSQL', 'AWS KMS', 'Amazon CloudWatch'],
    diagramFlow: 'Users -> CloudFront (Edge SSL & WAF) -> ALB (Public Subnet) -> ECS Fargate (Private Subnet) -> Aurora Multi-AZ (Isolated DB Subnet)',
    devopsChecklist: [
      'Multi-AZ distribution across us-east-1a, 1b, and 1c for automated fault tolerance.',
      'Auto Scaling Target Tracking Policy maintained at 65% CPU utilization.',
      'Container Insights enabled for sub-minute container memory & CPU metrics.',
      'Aurora automated storage auto-scaling up to 128 TB.'
    ],
    securityChecklist: [
      'AWS WAFv2 attached to CloudFront and ALB with Rate Limiting (2000 req / 5 min).',
      'Security Group Chaining: ECS allows port 8080 ONLY from alb_sg; Aurora allows port 5432 ONLY from ecs_sg.',
      'Database credentials rotated automatically every 30 days via AWS Secrets Manager.',
      'VPC Flow Logs enabled and delivered to a centralized S3 security bucket.'
    ]
  },
  {
    id: 'blueprint-serverless-event',
    title: 'Serverless Event-Driven Microservices Platform',
    category: 'Serverless & Asynchronous Processing',
    slaTarget: '99.95% Availability',
    estimatedMonthlyCost: '$25 - $180 / month (Pay-per-request)',
    wellArchitectedScore: {
      reliability: 92,
      security: 96,
      costOptimization: 99,
      performance: 90,
      operationalExcellence: 94
    },
    summary: 'Ultra-low cost, infinitely scalable asynchronous event ingestion architecture. Eliminates idle compute charges completely by leveraging API Gateway HTTP APIs, SQS dead-letter queues, EventBridge buses, and DynamoDB On-Demand tables.',
    coreServices: ['Amazon API Gateway', 'AWS Lambda (Graviton ARM64)', 'Amazon EventBridge', 'Amazon SQS (DLQ)', 'Amazon DynamoDB', 'AWS X-Ray'],
    diagramFlow: 'Clients -> API Gateway HTTP API -> SQS Buffer Queue -> Lambda Processing -> EventBridge Event Bus -> DynamoDB Storage',
    devopsChecklist: [
      'Zero idle server costs: you pay strictly for compute milliseconds executed.',
      'Dead Letter Queue (DLQ) configured with 14-day retention for unhandled messages.',
      'Lambda Provisioned Concurrency enabled for latency-critical checkout routes to eliminate cold starts.',
      'ARM64 Graviton architecture selected for 20% better price-performance.'
    ],
    securityChecklist: [
      'Cognito User Pools JWT authentication verified at API Gateway boundary.',
      'Lambda execution roles scoped to exact table ARNs with zero wildcard actions.',
      'DynamoDB Point-In-Time Recovery (PITR) enabled for continuous 35-day backup.',
      'AWS X-Ray active tracing enabled across all microservices for distributed tracing.'
    ]
  },
  {
    id: 'blueprint-ai-datalake',
    title: 'Enterprise AI & Predictive Analytics Lakehouse',
    category: 'Big Data, Analytics & Generative AI',
    slaTarget: '99.9% Availability',
    estimatedMonthlyCost: '$650 - $2,200 / month',
    wellArchitectedScore: {
      reliability: 90,
      security: 99,
      costOptimization: 89,
      performance: 94,
      operationalExcellence: 92
    },
    summary: 'Enterprise big data lakehouse architecture for training machine learning models and querying petabytes of structured and unstructured telemetry using serverless analytics and KMS encryption.',
    coreServices: ['Amazon S3 Intelligent Tiering', 'AWS Glue Crawler & Catalog', 'Amazon Athena Serverless', 'Amazon SageMaker', 'AWS Key Management Service (KMS)'],
    diagramFlow: 'Ingestion Sources -> S3 Raw Bucket -> AWS Glue ETL -> S3 Cleaned Parquet Bucket -> Amazon Athena / SageMaker Studio',
    devopsChecklist: [
      'Data partitioned by year/month/day in Apache Parquet format for 90% query speedup and cost reduction.',
      'S3 Intelligent-Tiering automatically moves cold partitions to Archive Access tiers.',
      'Athena query workgroups configured with maximum scan byte limits per query ($5 hard limit).',
      'AWS Glue Data Quality rules validate incoming schemas and quarantine malformed records.'
    ],
    securityChecklist: [
      'S3 Block Public Access enforced across all data lake buckets.',
      'Customer Managed Key (KMS CMK) encryption with automated annual rotation.',
      'AWS Lake Formation column and row-level access control enforcing least-privilege data masking.',
      'Gateway VPC Endpoint ensures all analytics queries travel over internal private AWS networking.'
    ]
  },
  {
    id: 'blueprint-multi-account-org',
    title: 'Zero-Trust Multi-Account AWS Organization & Landing Zone',
    category: 'Enterprise Governance & Multi-Account',
    slaTarget: '99.999% Governance Resiliency',
    estimatedMonthlyCost: '$900 - $3,500 / month',
    wellArchitectedScore: {
      reliability: 99,
      security: 100,
      costOptimization: 86,
      performance: 95,
      operationalExcellence: 98
    },
    summary: 'The ultimate enterprise security posture. Segregates workloads across dedicated AWS accounts (Management, Security Tooling, Log Archive, Shared Services, Production, Non-Production) tied together via AWS Transit Gateway and centralized egress inspection.',
    coreServices: ['AWS Organizations', 'AWS Control Tower', 'AWS Transit Gateway', 'AWS Network Firewall', 'IAM Identity Center (SSO)', 'Amazon GuardDuty Org Admin'],
    diagramFlow: 'Management Account -> Control Tower Guardrails -> Security OU (GuardDuty, Security Hub, WORM Log Archive) -> Transit Gateway Hub -> Workload Accounts',
    devopsChecklist: [
      'Account Factory for Terraform (AFT) automates pipeline-based provisioning of compliant accounts.',
      'AWS IAM Identity Center with SCIM automated user provisioning from Okta / Azure AD.',
      'Centralized Transit Gateway peering connecting cross-account VPCs without peering mesh complexity.',
      'Service Quotas monitored centrally via CloudWatch dashboards and AWS Budgets.'
    ],
    securityChecklist: [
      'Service Control Policies (SCPs) prevent any account root user from tampering with logging or security tools.',
      'Log Archive account configured with S3 Object Lock (Compliance Mode) to prevent log tampering by ransomware.',
      'AWS Network Firewall deployed in Central Inspection VPC inspecting all internet egress traffic with Suricata rules.',
      'GuardDuty and Security Hub Delegated Administrator centralized in dedicated Security Tooling account.'
    ]
  }
]

// Multi-Cloud Security Crosswalk Matrix (AWS ↔ Azure ↔ GCP ↔ OCI ↔ IBM Cloud)
export const MULTI_CLOUD_CROSSWALK = [
  {
    category: 'Identity & Access',
    concept: 'Workload Identity (No Static Keys)',
    aws: 'IAM Roles + Instance Profiles / STS AssumeRole',
    azure: 'Managed Identities for Azure Resources (System/User Assigned)',
    gcp: 'Workload Identity Federation / Service Account Impersonation',
    oci: 'Instance Principals & Dynamic Groups (X.509 cert metadata)',
    ibm: 'Trusted Profiles & Compute Resource Identity (CRN claims)',
    securityAdvice: 'Eliminate all hardcoded API keys. Use cloud metadata services to fetch short-lived tokens automatically.'
  },
  {
    category: 'Identity & Access',
    concept: 'Organization Boundary / Guardrails',
    aws: 'Service Control Policies (SCPs)',
    azure: 'Azure Management Groups & Azure Policy (Deny Effect)',
    gcp: 'Organization Policy Service (Constraint Rules)',
    oci: 'Compartment Quotas & Security Zones (Strict Guardrail Recipes)',
    ibm: 'Enterprise Policies & Context-Based Restrictions (CBR zones)',
    securityAdvice: 'Place guardrails at the parent organization root to block unauthorized regions, public IP assignment, and unapproved services.'
  },
  {
    category: 'Containers & Kubernetes',
    concept: 'Managed Kubernetes Cluster Service',
    aws: 'Amazon Elastic Kubernetes Service (Amazon EKS)',
    azure: 'Azure Kubernetes Service (AKS)',
    gcp: 'Google Kubernetes Engine (GKE Autopilot / Standard)',
    oci: 'Oracle Container Engine for Kubernetes (OKE)',
    ibm: 'IBM Cloud Kubernetes Service (IKS) & Red Hat OpenShift',
    securityAdvice: 'Disable public endpoint access to the API server, enable cluster control plane audit logs, and enforce KMS envelope encryption for Secrets.'
  },
  {
    category: 'Serverless Compute',
    concept: 'Event-Driven Stateless Microservices',
    aws: 'AWS Lambda (Graviton ARM64 / x86_64)',
    azure: 'Azure Functions (Consumption / Premium Plan)',
    gcp: 'Google Cloud Functions / Google Cloud Run',
    oci: 'Oracle Cloud Functions (Fn Project Serverless)',
    ibm: 'IBM Cloud Code Engine & Cloud Functions',
    securityAdvice: 'Scope execution roles strictly to necessary resources, avoid storing plaintext secrets in environment variables, and enforce short execution timeouts.'
  },
  {
    category: 'Network Security',
    concept: 'Stateful Virtual Firewall',
    aws: 'VPC Security Groups (Stateful)',
    azure: 'Network Security Groups (NSGs)',
    gcp: 'VPC Firewall Rules (Stateful)',
    oci: 'Network Security Groups (NSGs) & Security Lists',
    ibm: 'VPC Security Groups & Network ACLs',
    securityAdvice: 'Never open administrative ports (22, 3389) to 0.0.0.0/0. Chain security groups by ID instead of IP blocks.'
  },
  {
    category: 'Network Security',
    concept: 'Private Cloud Gateway / Backbone Transit',
    aws: 'AWS Transit Gateway & PrivateLink',
    azure: 'Azure Virtual WAN & Azure Private Link',
    gcp: 'Network Connectivity Center & Private Service Connect',
    oci: 'Dynamic Routing Gateway (DRG) & Service Gateway',
    ibm: 'Transit Gateway & Virtual Private Endpoints (VPE)',
    securityAdvice: 'Route internal microservices traffic strictly over cloud provider private backbones without exposing packets to the public internet.'
  },
  {
    category: 'Storage & Encryption',
    concept: 'Object Storage Encryption & Isolation',
    aws: 'Amazon S3 + Block Public Access + KMS CMK',
    azure: 'Azure Blob Storage + Private Endpoint + Customer-Managed Keys (CMK)',
    gcp: 'Cloud Storage + Uniform Bucket-Level Access + Cloud KMS CMEK',
    oci: 'OCI Object Storage (NoPublicAccess) + Vault Master Encryption Key',
    ibm: 'IBM Cloud Object Storage (COS) + Key Protect (FIPS 140-2 L4)',
    securityAdvice: 'Enforce uniform access controls, disable legacy ACLs, and verify HTTPS-only transit policies.'
  },
  {
    category: 'Relational Database',
    concept: 'Managed High-Availability Database Clustering',
    aws: 'Amazon Aurora (Multi-AZ PostgreSQL / MySQL)',
    azure: 'Azure SQL Database / Flexible Server PostgreSQL',
    gcp: 'Google Cloud SQL / Google Cloud AlloyDB',
    oci: 'Oracle Autonomous Database & Base Database Service',
    ibm: 'IBM Cloud Databases for PostgreSQL / Db2 on Cloud',
    securityAdvice: 'Deploy databases in private isolated subnets with zero public IP assignment, enforce TLS 1.3 encryption in transit, and enable automated daily snapshots.'
  },
  {
    category: 'Key Management & Secrets',
    concept: 'Cryptographic Key Management (Hardware HSM)',
    aws: 'AWS Key Management Service (KMS) & AWS CloudHSM',
    azure: 'Azure Key Vault (Keys) & Azure Dedicated HSM',
    gcp: 'Google Cloud Key Management Service (Cloud KMS) & Cloud HSM',
    oci: 'OCI Vault (Hardware Security Module dedicated partitions)',
    ibm: 'IBM Key Protect & Hyper Protect Crypto Services (Keep-Your-Own-Key)',
    securityAdvice: 'Enforce Customer Managed Keys (CMK) with annual automatic rotation; never rely solely on default vendor-managed master keys.'
  },
  {
    category: 'Key Management & Secrets',
    concept: 'Dynamic Secrets & API Key Vaulting',
    aws: 'AWS Secrets Manager (Automatic Lambda Rotation)',
    azure: 'Azure Key Vault (Secrets)',
    gcp: 'Google Cloud Secret Manager',
    oci: 'OCI Vault (Secrets with expiry & reuse prevention rules)',
    ibm: 'IBM Cloud Secrets Manager (TLS auto-renewal & IAM engine)',
    securityAdvice: 'Integrate automated password and API credential rotation to invalidate credentials on a 30-day cadence.'
  },
  {
    category: 'Threat Detection',
    concept: 'Automated Managed Threat Intelligence',
    aws: 'Amazon GuardDuty (DNS, VPC Flow, CloudTrail, EKS)',
    azure: 'Microsoft Defender for Cloud & Microsoft Sentinel',
    gcp: 'Google Cloud Security Command Center (SCC) Event Threat Detection',
    oci: 'OCI Cloud Guard (Activity & Config Detectors with Auto-Responders)',
    ibm: 'IBM Cloud Security and Compliance Center (Workload Protection)',
    securityAdvice: 'Enable threat detection across 100% of accounts. Automatically route high-severity alerts to Slack or PagerDuty.'
  },
  {
    category: 'Post-Mortem & Audit',
    concept: 'Centralized Control Plane Logging',
    aws: 'AWS CloudTrail (Multi-Region Trail with Log File Validation)',
    azure: 'Azure Activity Log + Azure Monitor Diagnostic Settings',
    gcp: 'Cloud Audit Logs (Admin Activity, Data Access, System Events)',
    oci: 'OCI Audit Service (Default 365-day immutable storage)',
    ibm: 'IBM Cloud Activity Tracker (Hosted Event Routing)',
    securityAdvice: 'Ship audit logs to an immutable, write-once-read-many (WORM) storage account with object lock enabled.'
  }
]
