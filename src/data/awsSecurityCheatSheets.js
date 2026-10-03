// =========================================================================
// SeCloudive - Official AWS Security Cheat Sheets & Interview Study Guides
// Printable, Professional Guides for Cloud Security Engineers
// =========================================================================

export const AWS_SECURITY_CHEAT_SHEETS = [
  {
    id: 'iamConditionsCheatSheet',
    title: 'Top 25 AWS IAM Policy Conditions Master Cheat Sheet',
    subtitle: 'Condition Keys, Operators, Syntax Examples & Zero-Trust Rationale',
    category: 'IAM & Access Control',
    icon: 'Key',
    badge: 'High Interview Frequency',
    badgeColor: '#10b981',
    description: 'The definitive reference guide to AWS IAM condition keys, context blocks, and evaluation operators. Essential for designing least-privilege policies and answering principal authorization interview questions.',
    sections: [
      {
        heading: '1. Global Identity & Principal Conditions',
        items: [
          {
            key: 'aws:PrincipalArn',
            operator: 'ArnEquals / ArnLike',
            example: '"Condition": { "ArnEquals": { "aws:PrincipalArn": "arn:aws:iam::123456789012:role/AdminRole" } }',
            purpose: 'Matches the exact Amazon Resource Name of the entity making the request.'
          },
          {
            key: 'aws:PrincipalOrgID',
            operator: 'StringEquals',
            example: '"Condition": { "StringEquals": { "aws:PrincipalOrgID": "o-a1b2c3d4e5" } }',
            purpose: 'Restricts resource access strictly to principals belonging to your AWS Organization.'
          },
          {
            key: 'aws:PrincipalTag/${TagKey}',
            operator: 'StringEquals',
            example: '"Condition": { "StringEquals": { "aws:PrincipalTag/Department": "SecOps" } }',
            purpose: 'Enforces Attribute-Based Access Control (ABAC) based on tags attached to the principal.'
          },
          {
            key: 'aws:FederatedProvider',
            operator: 'StringEquals',
            example: '"Condition": { "StringEquals": { "aws:FederatedProvider": "accounts.google.com" } }',
            purpose: 'Validates which identity provider (IdP) authenticated the federated user.'
          }
        ]
      },
      {
        heading: '2. Network & Perimeter Conditions',
        items: [
          {
            key: 'aws:SourceIp',
            operator: 'IpAddress / NotIpAddress',
            example: '"Condition": { "IpAddress": { "aws:SourceIp": ["203.0.113.0/24"] } }',
            purpose: 'Restricts actions to trusted corporate public egress IP ranges. (Note: Does not work for AWS service-to-service calls without VPC endpoints).'
          },
          {
            key: 'aws:SourceVpc',
            operator: 'StringEquals',
            example: '"Condition": { "StringEquals": { "aws:SourceVpc": "vpc-0a1b2c3d4e5f6g7h8" } }',
            purpose: 'Ensures traffic originates from a specific VPC via AWS PrivateLink or VPC Endpoints.'
          },
          {
            key: 'aws:SourceVpce',
            operator: 'StringEquals',
            example: '"Condition": { "StringEquals": { "aws:SourceVpce": "vpce-1a2b3c4d" } }',
            purpose: 'Locks down S3 or DynamoDB requests to traverse only through your designated Gateway/Interface VPC Endpoint.'
          },
          {
            key: 'aws:RequestedRegion',
            operator: 'StringEquals / StringNotEquals',
            example: '"Condition": { "StringEquals": { "aws:RequestedRegion": ["us-east-1", "us-west-2"] } }',
            purpose: 'Enforces geographic data residency and blocks malicious provisioning in unapproved AWS regions.'
          }
        ]
      },
      {
        heading: '3. Data Security, Encryption & Transport',
        items: [
          {
            key: 'aws:SecureTransport',
            operator: 'Bool',
            example: '"Condition": { "Bool": { "aws:SecureTransport": "false" } } // In Deny statement',
            purpose: 'Enforces TLS/HTTPS in transit. Any unencrypted HTTP request is strictly denied.'
          },
          {
            key: 's3:x-amz-server-side-encryption',
            operator: 'StringEquals',
            example: '"Condition": { "StringEquals": { "s3:x-amz-server-side-encryption": "aws:kms" } }',
            purpose: 'Requires all uploaded S3 objects to specify server-side encryption with AWS KMS.'
          },
          {
            key: 's3:x-amz-server-side-encryption-aws-kms-key-id',
            operator: 'StringEquals',
            example: '"Condition": { "StringEquals": { "s3:x-amz-server-side-encryption-aws-kms-key-id": "arn:aws:kms:...:key/..." } }',
            purpose: 'Forces objects to be encrypted with a specific Customer Managed Key (CMK) rather than the default AWS managed key.'
          },
          {
            key: 'kms:ViaService',
            operator: 'StringEquals',
            example: '"Condition": { "StringEquals": { "kms:ViaService": "s3.us-east-1.amazonaws.com" } }',
            purpose: 'Restricts KMS key usage exclusively when requested on behalf of a specific integrated AWS service.'
          }
        ]
      },
      {
        heading: '4. Authentication & Session Conditions',
        items: [
          {
            key: 'aws:MultiFactorAuthPresent',
            operator: 'Bool',
            example: '"Condition": { "Bool": { "aws:MultiFactorAuthPresent": "true" } }',
            purpose: 'Guarantees that sensitive actions (e.g. terminating production databases or modifying IAM) require hardware/virtual MFA.'
          },
          {
            key: 'aws:MultiFactorAuthAge',
            operator: 'NumericLessThanEquals',
            example: '"Condition": { "NumericLessThanEquals": { "aws:MultiFactorAuthAge": "3600" } }',
            purpose: 'Forces MFA re-authentication if the session is older than 3600 seconds (1 hour).'
          },
          {
            key: 'aws:CurrentTime',
            operator: 'DateGreaterThan / DateLessThan',
            example: '"Condition": { "DateLessThan": { "aws:CurrentTime": "2026-12-31T23:59:59Z" } }',
            purpose: 'Establishes time-bounded access windows for third-party auditors or contractors.'
          }
        ]
      }
    ]
  },

  {
    id: 'incidentResponseRunbookCard',
    title: 'AWS Incident Response Quick-Reference Card (NIST SP 800-61)',
    subtitle: '6-Phase Containment Runbook & Emergency AWS CLI Commands',
    category: 'Incident Response & SOC',
    icon: 'ShieldAlert',
    badge: 'Critical Runbook',
    badgeColor: '#ef4444',
    description: 'Pocket operational checklist and emergency CLI commands for triaging compromised credentials, active EC2 malware infections, and ransomware data exfiltration events.',
    sections: [
      {
        heading: 'Phase 1 & 2: Identification & Evidence Preservation',
        items: [
          {
            key: 'Preserve Volatile Memory & Disk',
            operator: 'AWS CLI',
            example: 'aws ec2 create-snapshot --volume-id vol-0123456789abcdef0 --description "Incident Forensics vol-0123456789abcdef0"',
            purpose: 'Immediately snapshots the EBS root volume before isolating or rebooting the affected instance.'
          },
          {
            key: 'Identify Calling Principal',
            operator: 'AWS CLI',
            example: 'aws sts get-caller-identity',
            purpose: 'Verifies current authentication context, assumed role session name, and AWS Account ID.'
          }
        ]
      },
      {
        heading: 'Phase 3: Emergency Containment Actions',
        items: [
          {
            key: 'Isolate Compromised EC2 Instance',
            operator: 'AWS CLI',
            example: 'aws ec2 modify-instance-attribute --instance-id i-0123456789 --groups sg-quarantine-isolated',
            purpose: 'Replaces all instance security groups with a quarantine group with ZERO ingress and ZERO egress rules.'
          },
          {
            key: 'Disable Compromised IAM Access Key',
            operator: 'AWS CLI',
            example: 'aws iam update-access-key --user-name DevUser --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive',
            purpose: 'Instantly invalidates active API keys without permanently deleting them (preserves evidence for CloudTrail correlation).'
          },
          {
            key: 'Revoke Active IAM Role Sessions',
            operator: 'AWS CLI Policy',
            example: 'aws iam put-role-policy --role-name CompromisedRole --policy-name RevokeSessions --policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*","Condition":{"DateLessThan":{"aws:TokenIssueTime":"2026-10-01T00:00:00Z"}}}]}\'',
            purpose: 'Injects an inline Deny for any session token issued before the incident timestamp, kicking the attacker out immediately.'
          },
          {
            key: 'Emergency S3 Public Lockdown',
            operator: 'AWS CLI',
            example: 'aws s3control put-public-access-block --account-id 123456789012 --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true',
            purpose: 'Applies account-level S3 Block Public Access across all buckets in the region in a single API call.'
          }
        ]
      }
    ]
  },

  {
    id: 'cloudTrailEventsReference',
    title: 'CloudTrail High-Severity Threat Event Matrix',
    subtitle: 'MITRE ATT&CK Mapping & Athena Threat Hunting Queries',
    category: 'Detection Engineering',
    icon: 'Terminal',
    badge: 'SOC Analyst Essential',
    badgeColor: '#38bdf8',
    description: 'Catalog of 20 high-fidelity CloudTrail events indicating defense evasion, privilege escalation, and lateral movement with copyable Amazon Athena SQL detection queries.',
    sections: [
      {
        heading: '1. Defense Evasion & Anti-Forensics Events',
        items: [
          {
            key: 'StopLogging / DeleteTrail',
            operator: 'Severity: CRITICAL',
            example: 'SELECT eventTime, userIdentity.arn, eventSource FROM cloudtrail_logs WHERE eventName IN (\'StopLogging\', \'DeleteTrail\')',
            purpose: 'Attacker attempting to disable the master audit trail to obscure malicious actions.'
          },
          {
            key: 'PutEventSelectors / UpdateTrail',
            operator: 'Severity: HIGH',
            example: 'SELECT eventTime, userIdentity.userName, requestParameters FROM cloudtrail_logs WHERE eventName = \'PutEventSelectors\'',
            purpose: 'Modifying trail filtering to omit high-value S3 data events or management events.'
          }
        ]
      },
      {
        heading: '2. Privilege Escalation & Persistence Events',
        items: [
          {
            key: 'AttachUserPolicy / AttachRolePolicy',
            operator: 'Severity: HIGH',
            example: 'SELECT eventTime, userIdentity.arn, requestParameters FROM cloudtrail_logs WHERE eventName LIKE \'%Attach%Policy\' AND requestParameters LIKE \'%AdministratorAccess%\'',
            purpose: 'Attaching AWS-managed AdministratorAccess or dangerous permissions to a low-privilege role or user.'
          },
          {
            key: 'CreateAccessKey',
            operator: 'Severity: MEDIUM-HIGH',
            example: 'SELECT eventTime, userIdentity.arn, requestParameters FROM cloudtrail_logs WHERE eventName = \'CreateAccessKey\' AND userIdentity.userName != requestParameters',
            purpose: 'An existing user creating an access key for a different user (backdoor creation).'
          },
          {
            key: 'AuthorizeSecurityGroupIngress (0.0.0.0/0 on 22/3389)',
            operator: 'Severity: HIGH',
            example: 'SELECT eventTime, userIdentity.arn, requestParameters FROM cloudtrail_logs WHERE eventName = \'AuthorizeSecurityGroupIngress\' AND requestParameters LIKE \'%0.0.0.0/0%\'',
            purpose: 'Opening SSH (22) or RDP (3389) directly to the public internet.'
          }
        ]
      }
    ]
  },

  {
    id: 'securitySpecialtyExamMatrix',
    title: 'AWS Certified Security - Specialty (SCS-C02) Quick Matrix',
    subtitle: 'Core Formulas, Port Lookup, KMS Hierarchies & IAM Policy Priority',
    category: 'Certification Prep',
    icon: 'Award',
    badge: 'Exam Cram Matrix',
    badgeColor: '#f59e0b',
    description: 'High-yield exam tables covering KMS key types, KMS Grants vs Key Policies, S3 Policy vs SCP evaluation order, and AWS GuardDuty finding taxonomy.',
    sections: [
      {
        heading: '1. IAM & Organization Policy Evaluation Order',
        items: [
          {
            key: 'Evaluation Logic Flow',
            operator: 'Golden Rule',
            example: '1. Explicit Deny &rarr; 2. SCPs &rarr; 3. Resource Policies &rarr; 4. IAM Permissions Boundaries &rarr; 5. Session Policies &rarr; 6. Identity Policies &rarr; Default Deny',
            purpose: 'An explicit Deny anywhere in the chain ALWAYS overrides any Allow. Default evaluation is Deny unless an explicit Allow exists.'
          },
          {
            key: 'Cross-Account S3 Access Rule',
            operator: 'Double-Allow Rule',
            example: 'Account A (IAM User) &rarr; Account B (S3 Bucket)',
            purpose: 'Requires an explicit Allow in BOTH Account A (identity-based policy) AND Account B (resource-based bucket policy).'
          }
        ]
      },
      {
        heading: '2. KMS Customer Managed Keys (CMK) vs AWS Managed Keys',
        items: [
          {
            key: 'Customer Managed Keys (CMK)',
            operator: 'Full Control',
            example: 'Supports Automatic Annual Rotation, Custom Key Policies, Grants, and Cross-Account Access.',
            purpose: 'Cost: $1.00/month/key. Required for cross-account KMS usage and regulatory compliance.'
          },
          {
            key: 'AWS Managed Keys (aws/s3, aws/ebs)',
            operator: 'Zero Key Policy Edit',
            example: 'Free creation, rotates automatically every 1 year. Cannot be shared across accounts.',
            purpose: 'Cost: $0.00. Key policy cannot be modified; cannot be used for cross-account sharing.'
          }
        ]
      }
    ]
  }
]
