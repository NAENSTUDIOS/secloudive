// =========================================================================
// SeCloudive - AWS Certification Flashcards & Spaced-Repetition Drills
// Targeting SCS-C02 (Security Specialty) & SAA-C03 (Solutions Architect)
// =========================================================================

export const FLASHCARD_DECKS = [
  {
    id: 'scs-c02',
    name: 'AWS Certified Security - Specialty (SCS-C02)',
    code: 'SCS-C02',
    badge: 'Specialty Level',
    color: '#10b981',
    description: 'High-yield exam questions covering IAM Least Privilege, KMS Key Hierarchies, CloudTrail Auditing, Incident Response Runbooks, and Perimeter Defense.',
    cards: [
      {
        id: 'scs-01',
        category: 'IAM & Access Management',
        question: 'What is the evaluation order when an identity-based policy, resource policy, and permissions boundary all exist in the same account?',
        answer: '1. Explicit Deny (overrides everything immediately)\n2. Permission Boundary must allow\n3. Identity-based policy OR Resource-based policy must allow\n4. Default: Implicit Deny if no explicit allow exists.',
        examTip: 'An explicit Deny ANYWHERE in the chain always wins. A Permissions Boundary only sets the MAXIMUM permissions; it never grants access by itself.',
        reference: 'AWS Well-Architected Framework: Security Pillar SEC-01'
      },
      {
        id: 'scs-02',
        category: 'Data Protection & KMS',
        question: 'What are the three core differences between an AWS Customer Managed Key (CMK) and an AWS Managed Key (e.g. aws/s3)?',
        answer: '1. Key Policy: CMKs have editable key policies; AWS Managed keys cannot be edited.\n2. Rotation: CMKs support optional annual auto-rotation; AWS Managed rotate automatically every 1 year.\n3. Cross-Account: Only CMKs can be shared with other AWS accounts via key policies and grants.',
        examTip: 'If an exam question mentions cross-account S3 or EBS encryption sharing, AWS Managed Keys are NEVER the answer—you MUST use a Customer Managed Key (CMK).',
        reference: 'KMS Best Practices / CIS AWS Foundations Benchmark §2.8'
      },
      {
        id: 'scs-03',
        category: 'Infrastructure Security',
        question: 'What port and inbound security group rules are required to connect to an EC2 instance using AWS Systems Manager (SSM) Session Manager?',
        answer: 'ZERO inbound ports are required (Port 22/SSH can and should be completely closed). Session Manager uses outbound HTTPS (Port 443) via SSM Agent to communicate with AWS Systems Manager endpoints.',
        examTip: 'Close Port 22 entirely and use an IAM Role with AmazonSSMManagedInstanceCore attached to the instance profile.',
        reference: 'AWS Systems Manager Documentation: Session Manager Prerequisites'
      },
      {
        id: 'scs-04',
        category: 'Threat Detection & Logging',
        question: 'Which log sources does Amazon GuardDuty analyze without requiring any agents installed on your EC2 instances?',
        answer: '1. AWS CloudTrail Management Events\n2. AWS CloudTrail S3 Data Events\n3. VPC Flow Logs\n4. DNS Query Logs\n5. EKS Audit Logs & Runtime Monitoring\n6. EBS Volume Malware Scanning',
        examTip: 'GuardDuty reads these telemetry sources directly from the underlying AWS hypervisor and network plane—you do NOT need to enable VPC Flow Logs yourself for GuardDuty to inspect them!',
        reference: 'Amazon GuardDuty User Guide: Data Sources'
      },
      {
        id: 'scs-05',
        category: 'Data Protection & S3',
        question: 'What exact Condition block in an S3 bucket policy enforces that all uploads and downloads must use TLS/HTTPS?',
        answer: '{\n  "Sid": "EnforceTLSRequestsOnly",\n  "Effect": "Deny",\n  "Principal": "*",\n  "Action": "s3:*",\n  "Resource": ["arn:aws:s3:::my-bucket", "arn:aws:s3:::my-bucket/*"],\n  "Condition": {\n    "Bool": { "aws:SecureTransport": "false" }\n  }\n}',
        examTip: 'Notice the Boolean condition: if aws:SecureTransport is FALSE, the request is explicitly DENIED.',
        reference: 'AWS Security Best Practices: Enforcing Encryption in Transit'
      },
      {
        id: 'scs-06',
        category: 'Governance & Multi-Account',
        question: 'How do you guarantee across an entire AWS Organization that member accounts cannot delete or disable their CloudTrail audit trails?',
        answer: 'Attach a Service Control Policy (SCP) at the Root or Organizational Unit (OU) level that explicitly Denies: cloudtrail:StopLogging, cloudtrail:DeleteTrail, and cloudtrail:UpdateTrail.',
        examTip: 'SCPs do not apply to the Management (Root) account itself, only to member accounts within the Organization.',
        reference: 'AWS Organizations Documentation: Guardrails with SCPs'
      },
      {
        id: 'scs-07',
        category: 'Perimeter Defense',
        question: 'What is the difference between AWS WAF and AWS Shield Advanced regarding DDoS protection?',
        answer: 'AWS WAF inspects Layer 7 (HTTP/HTTPS) web requests for SQLi, XSS, and rate limits. AWS Shield Standard provides automatic L3/L4 DDoS mitigation for free. AWS Shield Advanced adds 24/7 DDoS Response Team (SRT) support and financial cost protection against traffic scaling spikes.',
        examTip: 'If the question asks about protecting against financial surges from DDoS traffic on CloudFront or Route 53, select AWS Shield Advanced.',
        reference: 'AWS Shield Developer Guide: Shield Standard vs Advanced'
      },
      {
        id: 'scs-08',
        category: 'Data Protection & S3',
        question: 'What is the difference between S3 Object Lock in Compliance Mode vs Governance Mode?',
        answer: 'Compliance Mode: NO user (not even the AWS account root user) can overwrite, delete, or shorten the retention period. Governance Mode: Users with the special permission "s3:BypassGovernanceRetention" can delete objects or alter the retention period.',
        examTip: 'For SEC Rule 17a-4 and strict regulatory WORM (Write Once Read Many) compliance, Compliance Mode is strictly required.',
        reference: 'Amazon S3 User Guide: Object Lock Modes'
      },
      {
        id: 'scs-09',
        category: 'IAM & Governance',
        question: 'Which AWS service uses automated mathematical reasoning and formal logic to detect whether IAM roles or S3 buckets are accessible from outside your account or organization?',
        answer: 'AWS IAM Access Analyzer (part of IAM, free of charge for S3, KMS, SQS, and IAM roles).',
        examTip: 'IAM Access Analyzer identifies resource policies that grant public or cross-account access and generates mathematical findings.',
        reference: 'AWS IAM Access Analyzer Documentation'
      },
      {
        id: 'scs-10',
        category: 'Incident Response & Secrets',
        question: 'What is the immediate AWS CLI command to invalidate active temporary credentials for an IAM role suspected of compromise?',
        answer: 'Attach an inline Deny policy to the role with a Condition: "DateLessThan": { "aws:TokenIssueTime": "<incident-timestamp>" }. This revokes all session tokens issued before the incident time.',
        examTip: 'Deleting the role breaks application availability; injecting an inline Deny with TokenIssueTime invalidates active sessions while allowing immediate re-authentication with new credentials.',
        reference: 'AWS IAM User Guide: Revoking IAM Role Temporary Security Credentials'
      }
    ]
  },

  {
    id: 'saa-c03',
    name: 'AWS Solutions Architect Associate (SAA-C03)',
    code: 'SAA-C03',
    badge: 'Associate Level',
    color: '#38bdf8',
    description: 'Core architectural patterns: Decoupling with SQS/SNS, High Availability across Multi-AZ, S3 Storage Tiering, and Disaster Recovery topologies.',
    cards: [
      {
        id: 'saa-01',
        category: 'Storage & S3',
        question: 'Which S3 storage tier should you choose for data accessed once every 3 months that requires immediate, sub-millisecond retrieval when requested?',
        answer: 'Amazon S3 Glacier Instant Retrieval. It provides millisecond retrieval with lower storage costs than S3 Standard-IA.',
        examTip: 'If milliseconds are needed: Glacier Instant Retrieval. If 3-5 hours are acceptable: Glacier Flexible Retrieval. If 12 hours: Glacier Deep Archive.',
        reference: 'Amazon S3 Storage Classes Matrix'
      },
      {
        id: 'saa-02',
        category: 'Compute & Networking',
        question: 'What is the fundamental difference between an Application Load Balancer (ALB) and a Network Load Balancer (NLB)?',
        answer: 'ALB works at Layer 7 (HTTP/HTTPS, Host/Path Routing, TLS Termination). NLB works at Layer 4 (TCP/UDP, Ultra-low latency, static/Elastic IP per AZ, millions of requests/second).',
        examTip: 'If static IP per subnet or ultra-high throughput with TLS passthrough is required: choose Network Load Balancer (NLB).',
        reference: 'Elastic Load Balancing Overview'
      },
      {
        id: 'saa-03',
        category: 'Networking & VPC',
        question: 'What component must be placed in a public subnet to allow instances in a private subnet to download external OS patches without receiving unsolicited inbound connections?',
        answer: 'A NAT Gateway (or NAT Instance) configured with an Elastic IP address in the public subnet, with private subnet route tables routing 0.0.0.0/0 to the NAT Gateway.',
        examTip: 'NAT Gateways are managed by AWS and scale automatically up to 45 Gbps. For high availability, deploy one NAT Gateway per Availability Zone.',
        reference: 'Amazon VPC User Guide: NAT Gateways'
      },
      {
        id: 'saa-04',
        category: 'Database & DR',
        question: 'How do you design a relational database architecture with multi-region disaster recovery and sub-second replication latency?',
        answer: 'Amazon Aurora Global Database. It uses dedicated storage-level cross-region replication that typically completes in under 1 second without impacting primary database performance.',
        examTip: 'Aurora Global Database supports up to 5 secondary regions and can be promoted to a standalone read/write cluster in under 1 minute (RPO < 1s, RTO < 1m).',
        reference: 'Amazon Aurora Global Databases'
      },
      {
        id: 'saa-05',
        category: 'Decoupling & Messaging',
        question: 'Which AWS messaging service guarantees Exactly-Once processing and First-In-First-Out message ordering for financial transactions?',
        answer: 'Amazon SQS FIFO (First-In, First-Out) queue. It requires a Message Group ID and Message Deduplication ID.',
        examTip: 'Standard SQS queues offer at-least-once delivery (duplicates can happen) and best-effort ordering. Use FIFO queues when order and zero duplication are strict requirements.',
        reference: 'Amazon SQS Documentation: FIFO Queues'
      }
    ]
  },

  {
    id: 'network-ports',
    name: 'Network Ports & Protocol Defense Matrix',
    code: 'PORTS-SEC',
    badge: 'Security Cram Matrix',
    badgeColor: '#f59e0b',
    description: 'Essential port numbers, protocols, and security group isolation rules tested on all AWS certifications and technical cloud security interviews.',
    cards: [
      {
        id: 'port-01',
        category: 'Administrative Protocols',
        question: 'What standard ports are used for SSH and RDP management, and what is the CIS Benchmark recommendation for their security groups?',
        answer: 'SSH: Port 22 (TCP)\nRDP: Port 3389 (TCP/UDP)\nCIS Rule: Ingress from 0.0.0.0/0 or ::/0 must NEVER be allowed. Access should be restricted to trusted corporate VPN CIDRs or replaced entirely with AWS Systems Manager Session Manager.',
        examTip: 'CloudTrail alerts should trigger immediately if AuthorizeSecurityGroupIngress opens 22 or 3389 to 0.0.0.0/0.',
        reference: 'CIS AWS Foundations Benchmark v3.0 §5.2'
      },
      {
        id: 'port-02',
        category: 'Database Ports',
        question: 'Match the standard ports for: MySQL/Aurora MySQL, PostgreSQL/Aurora PostgreSQL, and Microsoft SQL Server.',
        answer: '1. MySQL / Aurora MySQL: Port 3306\n2. PostgreSQL / Aurora PostgreSQL: Port 5432\n3. Microsoft SQL Server: Port 1433\n4. Oracle Database: Port 1521',
        examTip: 'Database security groups should only allow ingress on these ports from the Application Tier security group ID, never from CIDR ranges.',
        reference: 'Amazon RDS Security Group Configuration'
      },
      {
        id: 'port-03',
        category: 'Web & Directory Services',
        question: 'What ports are used for DNS, Active Directory Kerberos, and LDAP over SSL (LDAPS)?',
        answer: '1. DNS: Port 53 (TCP/UDP)\n2. Kerberos (Active Directory): Port 88 (TCP/UDP)\n3. LDAP: Port 389 (TCP/UDP)\n4. LDAPS (Secure LDAP): Port 636 (TCP)',
        examTip: 'When connecting AWS Managed Microsoft AD to on-premises domain controllers, verify that ports 53, 88, 389, and 445 (SMB) are open across AWS Direct Connect or Site-to-Site VPN.',
        reference: 'AWS Directory Service Documentation'
      }
    ]
  }
]
