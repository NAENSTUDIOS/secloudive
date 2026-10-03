// SeCloudive Safe AWS Lab Cost Calculator & Teardown Data Engine
// Covers 16 key AWS services, Free Tier policies, emergency triggers, and ordered teardown plans

export const AWS_SERVICES_COST_CATALOG = [
  {
    id: 'ec2',
    name: 'Amazon EC2 (Elastic Compute Cloud)',
    category: 'Compute',
    icon: 'Cpu',
    unitCostDescription: '$0.0116/hr (t3.micro) to $0.526/hr (g4dn.xlarge GPU)',
    hourlyRate: 0.0116,
    freeTierAvailable: true,
    freeTierDetails: '750 hours/month of t2.micro or t3.micro for 12 months',
    monthlyRisk: 'Medium',
    riskLevel: 'small', // 'safe' | 'small' | 'moderate' | 'high'
    costDriver: 'Instance type & running hours. GPU or xlarge instances quickly incur high charges.',
    sampleQuantityLabel: 'Instances running (t3.micro)',
    defaultQuantity: 1,
    defaultHoursPerDay: 4
  },
  {
    id: 's3',
    name: 'Amazon S3 (Simple Storage Service)',
    category: 'Storage',
    icon: 'HardDrive',
    unitCostDescription: '$0.023 per GB-month (Standard)',
    hourlyRate: 0.000032, // roughly $0.023 / 720
    freeTierAvailable: true,
    freeTierDetails: '5 GB Standard storage, 20,000 GET, 2,000 PUT requests',
    monthlyRisk: 'Low',
    riskLevel: 'safe',
    costDriver: 'Volume of stored objects, public egress bandwidth, and cross-region replication.',
    sampleQuantityLabel: 'Storage volume (GB)',
    defaultQuantity: 5,
    defaultHoursPerDay: 24
  },
  {
    id: 'rds',
    name: 'Amazon RDS (Relational Database Service)',
    category: 'Database',
    icon: 'Database',
    unitCostDescription: '$0.017/hr (db.t3.micro) + $0.115/GB storage',
    hourlyRate: 0.017,
    freeTierAvailable: true,
    freeTierDetails: '750 hours/month of db.t2.micro/db.t3.micro Single-AZ + 20 GB storage',
    monthlyRisk: 'Medium',
    riskLevel: 'small',
    costDriver: 'Running DB instances and automated snapshot retention.',
    sampleQuantityLabel: 'Database instances (db.t3.micro)',
    defaultQuantity: 1,
    defaultHoursPerDay: 2
  },
  {
    id: 'lambda',
    name: 'AWS Lambda (Serverless Compute)',
    category: 'Compute',
    icon: 'Zap',
    unitCostDescription: '$0.20 per 1M requests + $0.0000166667 for every GB-second',
    hourlyRate: 0.0001,
    freeTierAvailable: true,
    freeTierDetails: '1,000,000 free requests per month and 3.2M seconds compute time (Always Free)',
    monthlyRisk: 'Minimal',
    riskLevel: 'safe',
    costDriver: 'Invocation count & execution duration. Loops without timeouts can spike.',
    sampleQuantityLabel: 'Monthly Invocations (in 10,000s)',
    defaultQuantity: 1,
    defaultHoursPerDay: 24
  },
  {
    id: 'apigateway',
    name: 'Amazon API Gateway',
    category: 'Networking',
    icon: 'Network',
    unitCostDescription: '$1.00 per 1M HTTP API calls ($3.50 for REST API)',
    hourlyRate: 0.0002,
    freeTierAvailable: true,
    freeTierDetails: '1,000,000 API calls per month for 12 months',
    monthlyRisk: 'Low',
    riskLevel: 'safe',
    costDriver: 'API request volume and cache memory allocation.',
    sampleQuantityLabel: 'API calls (in 10,000s)',
    defaultQuantity: 1,
    defaultHoursPerDay: 24
  },
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront (CDN)',
    category: 'Networking',
    icon: 'Globe',
    unitCostDescription: '$0.085/GB data transfer out',
    hourlyRate: 0.0001,
    freeTierAvailable: true,
    freeTierDetails: '1 TB of data transfer out per month, 10,000,000 HTTP/HTTPS requests (Always Free)',
    monthlyRisk: 'Minimal',
    riskLevel: 'safe',
    costDriver: 'High outbound bandwidth to public internet.',
    sampleQuantityLabel: 'Monthly egress (GB)',
    defaultQuantity: 5,
    defaultHoursPerDay: 24
  },
  {
    id: 'route53',
    name: 'Amazon Route 53 (DNS & Routing)',
    category: 'Networking',
    icon: 'Layers',
    unitCostDescription: '$0.50 per hosted zone / month + $0.40 per 1M queries',
    hourlyRate: 0.0007,
    freeTierAvailable: false,
    freeTierDetails: 'No free tier for hosted zones. $0.50 minimum monthly charge per domain.',
    monthlyRisk: 'Low',
    riskLevel: 'small',
    costDriver: 'Number of active public/private hosted zones.',
    sampleQuantityLabel: 'Hosted Zones',
    defaultQuantity: 1,
    defaultHoursPerDay: 24
  },
  {
    id: 'natgateway',
    name: 'VPC NAT Gateway (High Cost Alert)',
    category: 'Networking',
    icon: 'ShieldAlert',
    unitCostDescription: '$0.045/hour (~$32.40/month fixed) + $0.045/GB data processed',
    hourlyRate: 0.045,
    freeTierAvailable: false,
    freeTierDetails: 'NO FREE TIER. Fixed charge starts immediately upon creation even with 0 traffic.',
    monthlyRisk: 'VERY HIGH',
    riskLevel: 'high',
    costDriver: 'Hourly continuous existence in private subnets. Primary cause of student bill spikes.',
    sampleQuantityLabel: 'NAT Gateways provisioned',
    defaultQuantity: 1,
    defaultHoursPerDay: 24
  },
  {
    id: 'eks',
    name: 'Amazon EKS (Elastic Kubernetes Service)',
    category: 'Containers',
    icon: 'Box',
    unitCostDescription: '$0.10/hour (~$73.00/month cluster fee) + underlying EC2 node costs',
    hourlyRate: 0.10,
    freeTierAvailable: false,
    freeTierDetails: 'NO FREE TIER for EKS control plane. $73/month flat cluster fee.',
    monthlyRisk: 'VERY HIGH',
    riskLevel: 'high',
    costDriver: 'EKS control plane fee + EC2 worker nodes + Load Balancers.',
    sampleQuantityLabel: 'EKS Clusters',
    defaultQuantity: 1,
    defaultHoursPerDay: 24
  },
  {
    id: 'ecs',
    name: 'Amazon ECS on AWS Fargate',
    category: 'Containers',
    icon: 'Boxes',
    unitCostDescription: '$0.04048 per vCPU-hr + $0.004445 per GB-hr',
    hourlyRate: 0.015,
    freeTierAvailable: false,
    freeTierDetails: 'No dedicated Fargate free tier, but ECS management itself is free.',
    monthlyRisk: 'Medium',
    riskLevel: 'small',
    costDriver: 'Task running duration and assigned vCPU/memory sizing.',
    sampleQuantityLabel: 'Fargate Tasks running (0.25 vCPU)',
    defaultQuantity: 1,
    defaultHoursPerDay: 4
  },
  {
    id: 'dynamodb',
    name: 'Amazon DynamoDB (NoSQL Database)',
    category: 'Database',
    icon: 'Server',
    unitCostDescription: '$0.25/GB storage + $1.25 per million write request units',
    hourlyRate: 0.0001,
    freeTierAvailable: true,
    freeTierDetails: '25 GB of storage, 25 provisioned Write and Read Capacity Units (Always Free)',
    monthlyRisk: 'Minimal',
    riskLevel: 'safe',
    costDriver: 'Provisioned throughput mode vs on-demand mode.',
    sampleQuantityLabel: 'Storage (GB)',
    defaultQuantity: 2,
    defaultHoursPerDay: 24
  },
  {
    id: 'cloudtrail',
    name: 'AWS CloudTrail (Management & Data Events)',
    category: 'Security & Audit',
    icon: 'FileText',
    unitCostDescription: 'First multi-region copy FREE. Data events $0.10 per 100,000 events.',
    hourlyRate: 0.0002,
    freeTierAvailable: true,
    freeTierDetails: '1 multi-region management trail is 100% Free forever.',
    monthlyRisk: 'Low',
    riskLevel: 'safe',
    costDriver: 'Enabling high-volume S3 object-level or Lambda data events.',
    sampleQuantityLabel: 'Trails configured',
    defaultQuantity: 1,
    defaultHoursPerDay: 24
  },
  {
    id: 'cloudwatch',
    name: 'Amazon CloudWatch (Metrics & Logs)',
    category: 'Monitoring',
    icon: 'Activity',
    unitCostDescription: '$0.50/GB log ingestion + $0.30 per custom metric / month',
    hourlyRate: 0.001,
    freeTierAvailable: true,
    freeTierDetails: '10 custom metrics, 5 GB log data ingestion, 3 dashboards (Always Free)',
    monthlyRisk: 'Low',
    riskLevel: 'safe',
    costDriver: 'VPC Flow Logs or application debug logs without retention expiration.',
    sampleQuantityLabel: 'Ingested Logs (GB/month)',
    defaultQuantity: 2,
    defaultHoursPerDay: 24
  },
  {
    id: 'guardduty',
    name: 'Amazon GuardDuty (Threat Detection)',
    category: 'Security & Audit',
    icon: 'Shield',
    unitCostDescription: '$4.00 per 1M CloudTrail events + $0.80/GB VPC Flow Log analysis',
    hourlyRate: 0.002,
    freeTierAvailable: true,
    freeTierDetails: '30-day full free trial for every newly enabled AWS account.',
    monthlyRisk: 'Low to Medium',
    riskLevel: 'small',
    costDriver: 'High traffic VPCs generating millions of Flow Log records.',
    sampleQuantityLabel: 'Monitored accounts',
    defaultQuantity: 1,
    defaultHoursPerDay: 24
  },
  {
    id: 'securityhub',
    name: 'AWS Security Hub (CSPM & Compliance)',
    category: 'Security & Audit',
    icon: 'CheckSquare',
    unitCostDescription: '$0.0010 per compliance check (first 10,000/mo)',
    hourlyRate: 0.0015,
    freeTierAvailable: true,
    freeTierDetails: '30-day full free trial for all security standards.',
    monthlyRisk: 'Low',
    riskLevel: 'safe',
    costDriver: 'Number of active security standards (CIS, PCI-DSS, AWS Foundational) on many resources.',
    sampleQuantityLabel: 'Active Standards',
    defaultQuantity: 1,
    defaultHoursPerDay: 24
  },
  {
    id: 'config',
    name: 'AWS Config (Configuration Recording)',
    category: 'Security & Audit',
    icon: 'Compass',
    unitCostDescription: '$0.003 per configuration item recorded + $0.001 per rule evaluation',
    hourlyRate: 0.003,
    freeTierAvailable: false,
    freeTierDetails: 'No dedicated free tier. Can bill quickly if all resources are recorded dynamically.',
    monthlyRisk: 'Medium',
    riskLevel: 'moderate',
    costDriver: 'Frequent infrastructure churn triggering thousands of configuration records.',
    sampleQuantityLabel: 'Recorded rules',
    defaultQuantity: 3,
    defaultHoursPerDay: 24
  }
]

export const PRECONFIGURED_LAB_PROJECTS = [
  {
    id: 'lab-s3-lake',
    title: 'Secure S3 Data Lake & KMS Encryption',
    category: 'Data Security',
    servicesUsed: ['Amazon S3', 'AWS KMS', 'AWS CloudTrail'],
    servicesCatalogIds: ['s3', 'cloudtrail'],
    estimatedDailyCost: '$0.02',
    estimatedMonthlyCost: '$0.50 - $1.80',
    freeTierAvailable: true,
    freeTierInstructions: 'Keep storage under 5 GB, create 1 customer managed key, and rely on the default free CloudTrail management trail.',
    riskLevel: 'safe', // safe | small | moderate | high
    riskBadge: '🟢 Safe (Free Tier)',
    costWarning: 'Very low risk. Ensure S3 versioning does not accumulate hundreds of large file revisions without lifecycle policies.'
  },
  {
    id: 'lab-multi-account-logging',
    title: 'Multi-Account Centralized Audit Logging',
    category: 'Governance & Audit',
    servicesUsed: ['AWS CloudTrail', 'Amazon S3', 'Amazon CloudWatch', 'AWS KMS'],
    servicesCatalogIds: ['cloudtrail', 's3', 'cloudwatch'],
    estimatedDailyCost: '$0.05',
    estimatedMonthlyCost: '$1.20 - $3.50',
    freeTierAvailable: true,
    freeTierInstructions: 'Use 1 centralized aggregation bucket with S3 lifecycle rule to transition to Glacier after 30 days. Stay under 5 GB log ingestion.',
    riskLevel: 'safe',
    riskBadge: '🟢 Safe (Free Tier)',
    costWarning: 'Setting CloudWatch log retention to "Never Expire" will slowly grow storage costs over multiple months.'
  },
  {
    id: 'lab-zero-trust-vpc',
    title: 'Zero Trust VPC, Transit Gateway & Flow Logs',
    category: 'Network Security',
    servicesUsed: ['Amazon VPC', 'VPC NAT Gateway', 'Amazon EC2', 'Amazon CloudWatch'],
    servicesCatalogIds: ['ec2', 'natgateway', 'cloudwatch'],
    estimatedDailyCost: '$1.15',
    estimatedMonthlyCost: '$34.50 - $48.00',
    freeTierAvailable: false,
    freeTierInstructions: 'To practice 100% Free: Replace NAT Gateway with a free t2.micro NAT Instance or VPC Interface Endpoints during lab testing.',
    riskLevel: 'moderate',
    riskBadge: '🟠 Moderate Cost Risk',
    costWarning: 'NAT Gateway has a mandatory $0.045/hour fee (~$32.40/mo) even when idle. ALWAYS teardown immediately after completing the lab.'
  },
  {
    id: 'lab-eks-defense',
    title: 'Production Amazon EKS Cluster & Container Security',
    category: 'Kubernetes DevSecOps',
    servicesUsed: ['Amazon EKS', 'Amazon EC2', 'Amazon GuardDuty', 'Application Load Balancer'],
    servicesCatalogIds: ['eks', 'ec2', 'guardduty'],
    estimatedDailyCost: '$3.20',
    estimatedMonthlyCost: '$85.00 - $120.00',
    freeTierAvailable: false,
    freeTierInstructions: 'Use local Kind (Kubernetes in Docker) or Minikube for local zero-cost practice before deploying to real AWS EKS.',
    riskLevel: 'high',
    riskBadge: '🔴 High Cost Risk',
    costWarning: 'EKS control plane incurs $0.10/hr ($73/mo) fixed cost regardless of worker node size. Must be deleted immediately post-lab.'
  },
  {
    id: 'lab-cryptomining-simulation',
    title: 'FinOps Cryptomining Incident Simulation',
    category: 'FinOps & SecOps',
    servicesUsed: ['Amazon EC2 (GPU g4dn)', 'AWS CloudTrail', 'Amazon CloudWatch', 'Amazon SNS'],
    servicesCatalogIds: ['ec2', 'cloudtrail', 'cloudwatch'],
    estimatedDailyCost: '$12.60 (if real GPU)',
    estimatedMonthlyCost: '$0.00 (in SeCloudive Studio)',
    freeTierAvailable: true,
    freeTierInstructions: 'Run the entire simulated incident inside SeCloudive Cloudive Studio where GPU telemetry is simulated at $0 real AWS cost.',
    riskLevel: 'high',
    riskBadge: '🔴 High Cost Risk (Real AWS)',
    costWarning: 'G4dn GPU instances cost $0.526/hr ($380/mo each). Leaving an instance running overnight costs $12+. Use SeCloudive sandbox.'
  },
  {
    id: 'lab-iam-least-privilege',
    title: 'Automated IAM Least-Privilege Auditor',
    category: 'Identity Security',
    servicesUsed: ['AWS Lambda', 'Amazon EventBridge', 'AWS IAM', 'Amazon SNS'],
    servicesCatalogIds: ['lambda'],
    estimatedDailyCost: '$0.00',
    estimatedMonthlyCost: '$0.00',
    freeTierAvailable: true,
    freeTierInstructions: 'Lambda and EventBridge remain well within the 1M requests/month Always Free Tier. Zero billable resources created.',
    riskLevel: 'safe',
    riskBadge: '🟢 100% Free Tier ($0)',
    costWarning: 'No cost risk. Excellent resume project to build and keep deployed long-term.'
  }
]

export const EMERGENCY_COST_TRIGGERS = [
  {
    id: 'forgotten-ec2',
    title: 'Forgotten Running EC2 Instances',
    severity: 'High',
    impact: 'A standard t3.medium or t3.large left running continuously incurs $30 to $65/month.',
    prevention: 'Set up an AWS CloudWatch Alarm with an EC2 Stop Action when CPU utilization stays below 2% for 1 hour.'
  },
  {
    id: 'idle-nat-gw',
    title: 'Idle VPC NAT Gateway',
    severity: 'Critical',
    impact: '$0.045/hr flat rate = $1.08/day = $32.40/month even if 0 bytes of traffic pass through it.',
    prevention: 'Never leave NAT Gateways active overnight. Delete the NAT Gateway and release its Elastic IP immediately after testing.'
  },
  {
    id: 'orphaned-albs',
    title: 'Idle Application Load Balancers (ALBs)',
    severity: 'Medium',
    impact: '$0.0225/hr = $0.54/day = ~$16.20/month base fee per load balancer plus LCU charges.',
    prevention: 'Delete the ALB and associated target groups once testing finishes.'
  },
  {
    id: 'unattached-eips',
    title: 'Unattached Elastic IP Addresses (EIP)',
    severity: 'Small',
    impact: 'AWS bills $0.005/hr ($3.60/month) for Elastic IPs that are allocated but NOT attached to a running instance.',
    prevention: 'Release Elastic IPs immediately when terminating instances or NAT Gateways.'
  },
  {
    id: 'infinite-cloudwatch',
    title: 'CloudWatch Logs Set to "Never Expire"',
    severity: 'Medium',
    impact: 'VPC Flow Logs or noisy audit trails silently accumulate hundreds of GBs over 3-6 months.',
    prevention: 'Always configure log group retention to 7 or 14 days for student and lab accounts.'
  }
]

export const TEARDOWN_ORDERED_STEPS = [
  {
    order: 1,
    resourceType: 'EC2 Instances & EKS Node Groups',
    action: 'Terminate Instances',
    reason: 'Stops hourly compute billing immediately and unbinds attached network interfaces and storage volumes.',
    cliCommand: 'aws ec2 terminate-instances --instance-ids $(aws ec2 describe-instances --query "Reservations[].Instances[].InstanceId" --output text)',
    verificationCheck: 'EC2 instance status shows "terminated"'
  },
  {
    order: 2,
    resourceType: 'Application Load Balancers & Target Groups',
    action: 'Delete Load Balancers',
    reason: 'Must be deleted before VPC or subnets can be disassociated; removes the $16.20/mo base charge.',
    cliCommand: 'aws elbv2 delete-load-balancer --load-balancer-arn <ALB_ARN>',
    verificationCheck: 'No active load balancers returned by aws elbv2 describe-load-balancers'
  },
  {
    order: 3,
    resourceType: 'VPC NAT Gateways',
    action: 'Delete NAT Gateways',
    reason: 'Eliminates the #1 unexpected bill cause ($32.40/mo flat fee). Takes ~2-3 minutes to reach deleted state.',
    cliCommand: 'aws ec2 delete-nat-gateway --nat-gateway-id <NAT_ID>',
    verificationCheck: 'NAT Gateway state transition confirmed as "deleted"'
  },
  {
    order: 4,
    resourceType: 'Elastic IP Addresses',
    action: 'Release Elastic IPs',
    reason: 'AWS charges $3.60/month for unattached Elastic IPs. Releasing returns the IP to the AWS pool.',
    cliCommand: 'aws ec2 release-address --allocation-id <ALLOC_ID>',
    verificationCheck: 'aws ec2 describe-addresses returns empty array'
  },
  {
    order: 5,
    resourceType: 'RDS Database Instances',
    action: 'Delete DB Instance (skip final snapshot)',
    reason: 'Stops DB engine compute and allocated gp3 storage charges.',
    cliCommand: 'aws rds delete-db-instance --db-instance-identifier <DB_ID> --skip-final-snapshot',
    verificationCheck: 'DB instance status shows "deleting" then completely disappears'
  },
  {
    order: 6,
    resourceType: 'EBS Volumes & Snapshots',
    action: 'Delete Unattached Volumes',
    reason: 'Unattached EBS volumes continue to accrue $0.08 - $0.10 per GB-month.',
    cliCommand: 'aws ec2 delete-volume --volume-id <VOL_ID>',
    verificationCheck: 'No available (unattached) volumes remain'
  },
  {
    order: 7,
    resourceType: 'Test S3 Buckets',
    action: 'Empty and Delete Buckets',
    reason: 'Removes storage footprint and lifecycle evaluation rules.',
    cliCommand: 'aws s3 rb s3://<BUCKET_NAME> --force',
    verificationCheck: 'Bucket no longer listed in aws s3 ls'
  },
  {
    order: 8,
    resourceType: 'Test CloudTrail Trails & Log Groups',
    action: 'Delete Test Trails',
    reason: 'Ensures no multi-region duplicate trails continue writing to storage.',
    cliCommand: 'aws cloudtrail delete-trail --name <TRAIL_NAME>',
    verificationCheck: 'Only default organizational trail remains active'
  }
]

export const SAMPLE_TEARDOWN_AUDIT_LOGS = [
  {
    id: 'audit-001',
    labName: 'Secure S3 Data Lake & KMS Encryption',
    user: 'Security-Learner-781',
    startTime: '2026-09-24T10:15:00Z',
    endTime: '2026-09-24T11:42:00Z',
    resourcesCreated: ['s3:sec-lake-vault-01', 'kms:alias/sec-lake-cmk', 'cloudtrail:s3-lake-trail'],
    resourcesDeleted: ['s3:sec-lake-vault-01 (purged)', 'cloudtrail:s3-lake-trail', 'kms:scheduled_deletion'],
    cleanupStatus: 'VERIFIED_100_PERCENT',
    remainingResources: 0,
    estimatedRemainingCost: '$0.00',
    monthlySavings: '$1.80/mo',
    auditResult: 'PASS',
    signedHash: 'sha256-e9b418fa901c9472e39c4f'
  },
  {
    id: 'audit-002',
    labName: 'Zero Trust VPC & Transit Gateway',
    user: 'Security-Learner-781',
    startTime: '2026-09-25T14:00:00Z',
    endTime: '2026-09-25T15:35:00Z',
    resourcesCreated: ['vpc:vpc-0a817b', 'natgw:nat-04fa81', 'eip:eipalloc-01f78', 'ec2:i-0881bf2'],
    resourcesDeleted: ['ec2:terminated', 'natgw:deleted', 'eip:released', 'vpc:deleted'],
    cleanupStatus: 'VERIFIED_100_PERCENT',
    remainingResources: 0,
    estimatedRemainingCost: '$0.00',
    monthlySavings: '$36.20/mo',
    auditResult: 'PASS',
    signedHash: 'sha256-47b2c918a09f83e201bfa8'
  }
]
