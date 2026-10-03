// Path 4: Monitoring & Logging
export const monitoringPath = {
  id: 'monitoring',
  title: 'Monitoring & Logging (SOC & Telemetry)',
  shortTitle: 'Monitoring & Logging',
  icon: 'Eye',
  accentColor: '#4ade80',
  badge: 'Domain 04',
  level: 'Beginner to Advanced',
  estimatedTime: '2 hrs 30 mins',
  description: 'Turn raw cloud signals into actionable security detection. Master AWS CloudTrail audit trails, CloudWatch metric filters and alarms, Amazon GuardDuty threat intelligence, VPC Flow Logs, and centralized cross-account log consolidation.',
  whyItMatters: 'You cannot defend what you cannot see. When an incident occurs, comprehensive, tamper-evident audit logs are the only mechanism to determine the initial access vector, reconstruct the timeline of compromise, and prove whether data was exfiltrated.',
  topics: [
    {
      id: 'cloudtrail',
      title: 'AWS CloudTrail & Audit Integrity',
      pathId: 'monitoring',
      level: 'Beginner',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Core Telemetry',
      summary: 'Record every API call in your AWS account. Master Multi-Region trails, Management vs. Data events, Log File Integrity validation, and CloudTrail Lake SQL queries.',
      overview: `AWS CloudTrail is the foundational audit recording service for AWS. It captures actions taken by a user, role, or an AWS service as an event.

**Core Event Types in CloudTrail**:
1. **Management Events (Control Plane)**:
   - Provide visibility into administrative operations performed on resources in your AWS account (e.g., \`iam:CreateUser\`, \`ec2:RunInstances\`, \`s3:CreateBucket\`, \`kms:DisableKey\`).
   - Recorded automatically by default for 90 days in the CloudTrail Event History at zero additional cost.
2. **Data Events (Data Plane)**:
   - Provide visibility into high-volume resource operations performed ON or WITHIN resources (e.g., \`s3:GetObject\`, \`s3:PutObject\`, \`lambda:InvokeFunction\`, \`dynamodb:GetItem\`).
   - Not enabled by default due to high volume and cost; must be explicitly enabled for sensitive data buckets.
3. **Insights Events**:
   - Uses anomaly detection models to automatically identify unusual operational activity (e.g., spike in failed API calls, unusual write burst).

**Key Security Hardening Rules for CloudTrail**:
- **Multi-Region Trail**: Must be enabled across ALL regions, even unused regions (attackers often launch cryptominers in unmonitored regions like \`eu-north-1\` or \`ap-south-2\`).
- **Organization Trail**: Managed centrally from the AWS Organizations Management account; member accounts cannot modify, stop, or delete the trail!
- **Log File Integrity Validation**: CloudTrail generates SHA-256 cryptographic hashes and digital signatures for every log file delivered to S3, allowing you to mathematically prove logs were not altered or tampered with.`,
      whyItMatters: 'During a security breach, the first thing an advanced threat actor attempts is calling `cloudtrail:StopLogging` or `cloudtrail:DeleteTrail`. CloudTrail is the primary forensic witness in any investigation.',
      securityRisks: [
        'Single-region trails allowing attackers to deploy infrastructure undetected in unmonitored regions.',
        'Storing CloudTrail logs in a local S3 bucket where a compromised account admin can delete them.',
        'Not enabling Log File Integrity, making logs inadmissible in legal or compliance proceedings.',
        'Omitting Data Events on critical PII buckets, leaving security blind to which files an attacker downloaded.'
      ],
      bestPractices: [
        'Deploy an AWS Organizations Multi-Region Trail that logs to a dedicated, isolated Log Archive AWS Account.',
        'Enable Log File Integrity Validation on all trails.',
        'Protect the S3 log bucket with S3 Object Lock (Compliance Mode) and MFA Delete.',
        'Configure Amazon EventBridge rules to alert the SOC team within 60 seconds if `StopLogging` or `DeleteTrail` is called.'
      ],
      keyTakeaways: [
        'CloudTrail records who did what, from where, and when across all AWS API endpoints.',
        'Always enable Multi-Region Trails across all active and inactive regions.',
        'Store logs in an isolated Log Archive account; never store them exclusively in the production account.',
        'Log File Integrity validation cryptographically proves logs have not been tampered with or modified.'
      ],
      investigationExample: {
        title: 'Forensic CloudTrail JSON Log Analysis of a Credential Abuse Event',
        description: 'Analyzing an actual CloudTrail event showing an attacker using a stolen access key to enumerate S3 buckets from a foreign IP.',
        code: `{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "IAMUser",
    "principalId": "AIDAJ45EXAMPLE678901",
    "arn": "arn:aws:iam::123456789012:user/deployer-service-account",
    "accountId": "123456789012",
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE"
  },
  "eventTime": "2026-03-14T03:22:15Z",
  "eventSource": "s3.amazonaws.com",
  "eventName": "ListBuckets",
  "awsRegion": "us-east-1",
  "sourceIPAddress": "198.51.100.89",
  "userAgent": "aws-cli/2.15.15 Python/3.11.6 Linux/6.5.0",
  "requestParameters": null,
  "responseElements": null,
  "requestID": "C3D4E5F6G7H8I9J0",
  "eventID": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3d364f",
  "readOnly": true,
  "eventType": "AwsApiCall",
  "managementEvent": true,
  "recipientAccountId": "123456789012"
}`
      },
      realWorldScenario: {
        title: 'The Silent Rogue Region Crypto-Mine',
        incident: 'A company only operated in us-east-1 and configured CloudTrail for that single region. An attacker obtained an IAM access key from an abandoned public GitHub repository. Knowing the company only monitored us-east-1, the attacker logged in and launched 120 expensive GPU instances in `ap-southeast-2` (Sydney). The mining cluster operated for 22 days undetected.',
        impact: '$74,000 in unauthorized compute charges billed to the corporate account.',
        detectionMethod: 'Monthly invoice billing alert fired when costs jumped 400% above normal baseline.'
      },
      commonBeginnerMistakes: [
        'Assuming CloudTrail Event History stores logs forever (the default free event history only retains events for 90 days!).',
        'Creating a trail in only one region instead of applying it to all regions.',
        'Failing to enable S3 Data Events on sensitive buckets, making it impossible to determine which specific files were stolen.',
        'Allowing local account administrators to delete CloudTrail log files in S3.'
      ],
      whatACloudSecEngineerChecks: [
        'Check trail multi-region status: `aws cloudtrail describe-trails --query "trailList[*].{Name:Name,IsMultiRegion:IsMultiRegionTrail,LogValidation:LogFileValidationEnabled}"`.',
        'Verify log file integrity validation: `aws cloudtrail validate-logs --trail-arn <TrailARN> --start-time <YYYY-MM-DD>`.',
        'Confirm whether CloudTrail is configured as an Organization Trail across all accounts.',
        'Inspect S3 log bucket permissions to verify MFA Delete or Object Lock is enabled.'
      ],
      codeSnippet: {
        language: 'bash',
        title: 'CLI: Cryptographically Validate CloudTrail Log File Integrity',
        code: `# Validate that CloudTrail logs stored in S3 have not been altered or deleted
aws cloudtrail validate-logs \\
    --trail-arn arn:aws:cloudtrail:us-east-1:123456789012:trail/organization-security-trail \\
    --start-time 2026-03-01T00:00:00Z \\
    --end-time 2026-03-15T23:59:59Z`
      },
      interviewQuestions: [
        {
          question: 'What is the difference between CloudTrail Management Events and Data Events, and why are Data Events not enabled by default?',
          interviewerRationale: 'Evaluates understanding of telemetry tiers, log volume economics, and data classification.',
          modelAnswer: 'Management Events capture control plane operations on AWS resources (e.g. creating an S3 bucket, creating an IAM role, launching an EC2 instance). Data Events capture data plane operations performed on or within resources (e.g. s3:GetObject, s3:PutObject, lambda:InvokeFunction). Data events are not enabled by default because in high-throughput environments, applications may generate millions or billions of object GET and PUT requests daily. Logging all data events indiscriminately would generate terabytes of logs and massive CloudTrail and S3 storage costs. Best practice is to selectively enable Data Events on sensitive compliance, audit, and PII storage buckets.'
        },
        {
          question: 'How do you prevent a malicious insider or compromised administrator from deleting their own CloudTrail audit tracks in S3?',
          interviewerRationale: 'Assesses multi-account architecture, privilege separation, and tamper-resistant logging design.',
          modelAnswer: 'First, deploy an AWS Organizations Trail created in the organization management account, which prevents member account admins from stopping or modifying the trail. Second, configure the trail to deliver logs into an isolated, centralized Log Archive AWS account. Third, in the Log Archive account, attach a bucket policy that denies s3:DeleteObject to all identities (including root). Fourth, enable S3 Object Lock in Compliance Mode with a 365-day retention period, making logs physically immutable. Finally, enable Log File Integrity Validation to detect any tampering attempt mathematically.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: AWS CloudTrail Deep Dive and Forensic Analysis',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Working with CloudTrail Log File Integrity Validation',
          url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-intro.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Reference: Centralized Logging with AWS Organizations and CloudTrail',
          url: 'https://aws.amazon.com/blogs/security/how-to-manage-cross-account-cloudtrail-logs-with-aws-organizations/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'An attacker compromises an administrator credential and calls "cloudtrail:StopLogging" on the production trail. What is the fastest architectural method to detect and respond to this action?',
        options: [
          { id: 'a', text: 'Wait for the monthly AWS bill to show a decrease in CloudTrail charges.', isCorrect: false, explanation: 'Billing updates take days to weeks; too slow for incident response.' },
          { id: 'b', text: 'Configure an Amazon EventBridge rule matching eventName "StopLogging" from cloudtrail.amazonaws.com that immediately triggers an SNS alert to the SOC and invokes a Lambda function to restart logging.', isCorrect: true, explanation: 'Correct! EventBridge detects the API call within seconds and can execute automated containment and alerting.' },
          { id: 'c', text: 'Run an IAM credential report once a week.', isCorrect: false, explanation: 'Credential reports check credential age, not CloudTrail status.' },
          { id: 'd', text: 'Rely on AWS Support to call your office phone.', isCorrect: false, explanation: 'AWS Support does not monitor individual customer trail toggle events.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-mon-01',
        title: 'Investigation: CloudTrail Tampering & Root Session Anomaly',
        url: '/investigations',
        description: 'Analyze an incident where an adversary attempted to disable audit trails following an initial foothold.'
      }
    },
    {
      id: 'cloudwatch',
      title: 'CloudWatch Logs, Metrics & Alarms',
      pathId: 'monitoring',
      level: 'Beginner',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Operational Telemetry',
      summary: 'Harness infrastructure metrics and log streams. Master CloudWatch Log Groups, Metric Filters, Metric Alarms, CloudWatch Synthetics, and querying log streams with CloudWatch Logs Insights.',
      overview: `Amazon CloudWatch is a monitoring and observability service that collects monitoring and operational data in the form of logs, metrics, and events.

**Core CloudWatch Components**:
1. **CloudWatch Metrics**:
   - Time-series data points representing system performance (e.g., \`CPUUtilization\`, \`DiskReadOps\`, \`EstimatedCharges\`, \`4XXErrorRate\`).
   - Retained at varying granularity: 1-minute data for 15 days, 5-minute data for 63 days, and 1-hour data for 455 days (15 months).
2. **CloudWatch Logs**:
   - Centralized repository for OS logs, application logs, container output (ECS/EKS), Lambda execution logs, and VPC Flow Logs.
   - Organized into **Log Groups** (with configurable retention periods, e.g. 90 days or Never Expire) and **Log Streams**.
3. **Metric Filters**:
   - Search and match pattern filters placed on a Log Group (e.g. searching for terms like \`"AccessDenied"\`, \`"FATAL"\`, or \`"sudo"\`).
   - Automatically increments a custom numerical CloudWatch Metric whenever the pattern matches!
4. **CloudWatch Alarms**:
   - Watches a metric over a specified time period and performs one or more actions (e.g., sending an Amazon SNS notification to the SOC or auto-scaling compute).
   - Has three states: \`OK\`, \`ALARM\`, and \`INSUFFICIENT_DATA\`.
5. **CloudWatch Logs Insights**:
   - A purpose-built, highly interactive query language that allows security engineers to scan gigabytes of logs in seconds using syntax like \`fields, filter, stats, sort, limit\`.`,
      whyItMatters: 'CloudWatch turns passive text files into active security sensors. By applying Metric Filters to CloudTrail and application logs, security teams receive instant push notifications the moment an unauthorized administrative action occurs.',
      securityRisks: [
        'Setting log retention to "Never Expire" on high-volume debug logs, causing runaway storage bills.',
        'Leaving critical security events without Metric Alarms (e.g., no alarm for root account logins).',
        'Alert fatigue caused by improperly tuned alarms triggering hundreds of false positives daily.',
        'Not streaming operating system security logs (`/var/log/secure`, `/var/log/auth.log`) to CloudWatch.'
      ],
      bestPractices: [
        'Create CIS AWS Foundations Benchmark metric filters and alarms for root logins, IAM policy changes, and unauthorized API calls.',
        'Configure explicit log retention periods (e.g. 90, 180, or 365 days) on all CloudWatch Log Groups.',
        'Install the unified CloudWatch Agent on all EC2 instances to collect OS security logs and memory metrics.',
        'Use CloudWatch Logs Insights saved queries for standardized SOC incident triage.'
      ],
      keyTakeaways: [
        'Metric Filters convert pattern matches inside log text into numerical metrics.',
        'CloudWatch Alarms evaluate metrics over time thresholds and trigger SNS alerts.',
        'CloudWatch Logs Insights provides fast, SQL-like querying over unstructured log streams.',
        'Always set log retention periods to prevent infinite storage cost growth.'
      ],
      investigationExample: {
        title: 'CloudWatch Logs Insights Query: Finding Unauthorized IAM API Calls',
        description: 'A standardized SOC triage query executed across CloudTrail log groups to identify top users receiving AccessDenied errors.',
        code: `fields @timestamp, eventName, userIdentity.arn, sourceIPAddress, errorCode, errorMessage
| filter errorCode like /AccessDenied/ or errorCode like /UnauthorizedOperation/
| stats count(*) as failureCount by userIdentity.arn, eventName, sourceIPAddress
| sort failureCount desc
| limit 20`
      },
      realWorldScenario: {
        title: 'The Undetected Password Spraying Attack',
        incident: 'An external threat actor conducted a low-and-slow brute-force attack against an internal corporate portal deployed on AWS. Because application authentication logs were stored locally on web server disks without centralized CloudWatch ingestion, the security team had zero visibility. The attacker successfully guessed an engineer\'s password on day 4 and logged in.',
        impact: 'Unauthorized access to internal employee directory and intranet documents.',
        detectionMethod: 'Incident discovered during quarterly audit; CloudWatch Logs was subsequently mandated for all web tiers.'
      },
      commonBeginnerMistakes: [
        'Storing application logs on local EC2 disks that are permanently lost when instances terminate or scale in.',
        'Forgetting that CloudWatch Alarms require an associated Amazon SNS topic to actually notify humans.',
        'Ignoring the "INSUFFICIENT_DATA" alarm state which often indicates logging stopped functioning.',
        'Hardcoding log groups without encryption keys (should be encrypted with Customer Managed KMS Keys).'
      ],
      whatACloudSecEngineerChecks: [
        'Verify CIS Benchmark metric alarms: check for alarms on Root Account Usage, Unauthorized API Calls, and CloudTrail changes.',
        'Inspect CloudWatch Log Group retention policies: `aws logs describe-log-groups --query "logGroups[?retentionInDays==null].logGroupName"`.',
        'Verify KMS encryption on sensitive log groups: check `kmsKeyId` attribute.',
        'Review CloudWatch Alarm state history to detect flapping or ignored alarms.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Terraform: CloudWatch Metric Filter & Alarm for Root User Usage',
        code: `resource "aws_cloudwatch_log_metric_filter" "root_login_filter" {
  name           = "RootAccountUsageDetection"
  pattern        = "{ $.userIdentity.type = \"Root\" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != \"AwsServiceEvent\" }"
  log_group_name = aws_cloudwatch_log_group.cloudtrail_logs.name

  metric_transformation {
    name      = "RootAccountUsageCount"
    namespace = "Security/CISBenchmarks"
    value     = "1"
  }
}

resource "aws_cloudwatch_metric_alarm" "root_login_alarm" {
  alarm_name          = "CRITICAL-RootAccountActivityDetected"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "RootAccountUsageCount"
  namespace           = "Security/CISBenchmarks"
  period              = "60"
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "Immediate alert: AWS Root Account has executed an API call or logged in!"
  alarm_actions       = [aws_sns_topic.soc_high_priority_alerts.arn]
}`
      },
      interviewQuestions: [
        {
          question: 'How do you configure an alarm in AWS to alert the security operations team within 60 seconds whenever the Root user account is used?',
          interviewerRationale: 'Tests whether the candidate knows how to connect CloudTrail, CloudWatch Log Groups, Metric Filters, and SNS into an automated SOC alerting pipeline.',
          modelAnswer: 'First, configure an AWS CloudTrail multi-region trail to stream management events into an Amazon CloudWatch Log Group. Second, create a CloudWatch Metric Filter on that log group with the pattern `{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }` that increments a custom metric "RootAccountUsageCount" by 1. Third, create a CloudWatch Metric Alarm on that metric with a threshold of >= 1 in a 60-second evaluation period. Finally, associate the alarm with an Amazon SNS Topic subscribed to the SOC pager or Slack webhook. When Root executes any action, the alarm trips and notifies the SOC in under a minute.'
        },
        {
          question: 'What is CloudWatch Logs Insights and how does a security analyst use it during an active investigation?',
          interviewerRationale: 'Evaluates practical hands-on threat hunting and log analysis capabilities.',
          modelAnswer: 'CloudWatch Logs Insights is a purpose-built, serverless query engine designed to search and analyze massive volumes of unstructured or JSON logs stored in CloudWatch Log Groups. It uses a high-performance query language supporting commands like fields, filter, stats, sort, parse, and limit. During an investigation, an analyst uses it to query across multiple log groups simultaneously (e.g. CloudTrail, VPC Flow Logs, WAF logs) to filter by source IP, aggregate failed authentication attempts, reconstruct the exact chronological sequence of API calls made by an attacker, and identify compromised resources in seconds.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Monitoring and Alerting with Amazon CloudWatch',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Creating Metrics and Alarms from Log Events Using Filters',
          url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Reference: CIS AWS Foundations Benchmark Alarms Guide',
          url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/cis-aws-foundations-benchmark.html',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Which CloudWatch feature allows you to extract numerical metrics from plaintext or JSON log messages stored in a Log Group without modifying application code?',
        options: [
          { id: 'a', text: 'CloudWatch Contributor Insights', isCorrect: false, explanation: 'Contributor insights analyzes top talkers, but does not create custom metrics from patterns.' },
          { id: 'b', text: 'CloudWatch Metric Filters', isCorrect: true, explanation: 'Correct! Metric Filters match patterns in logs and increment custom numerical metrics.' },
          { id: 'c', text: 'CloudWatch Composite Alarms', isCorrect: false, explanation: 'Composite alarms combine multiple existing alarms using boolean logic.' },
          { id: 'd', text: 'Amazon CloudWatch Synthetics Canaries', isCorrect: false, explanation: 'Synthetics canaries test endpoints with automated browser scripts.' }
        ]
      },
      bridgeToLabs: {
        type: 'Playbook',
        id: 'playbook-02',
        title: 'Job Playbook: CIS Benchmark Alarms Deployment & Validation',
        url: '/playbooks',
        description: 'Deploy Terraform configurations to establish mandatory CIS security alarms for IAM and Root activity.'
      }
    },
    {
      id: 'security-monitoring',
      title: 'Security Monitoring (GuardDuty, Security Hub & Flow Logs)',
      pathId: 'monitoring',
      level: 'Intermediate',
      estimatedTime: '24 min read • 6 min check',
      badge: 'Threat Intelligence',
      summary: 'Deploy modern automated cloud detection. Master Amazon GuardDuty threat intelligence, AWS Security Hub posture scoring, Amazon Detective graph forensics, and VPC Flow Logs analysis.',
      overview: `Modern cloud security requires moving beyond manual log grepping to automated continuous threat detection powered by machine learning and global threat intelligence.

**The AWS Security Monitoring Stack**:
1. **Amazon GuardDuty**:
   - An intelligent, automated threat detection service that continuously monitors for malicious activity and unauthorized behavior.
   - Operates **completely out-of-band**: it analyzes data streams directly from the AWS hypervisor and service planes WITHOUT requiring agents, software installations, or consuming your instance CPU.
   - Primary Data Sources: AWS CloudTrail event logs, VPC Flow Logs, DNS Query Logs, EKS Audit Logs, RDS Login Activity, S3 Data Events, and EBS Volume Malware Scanning.
   - Categorizes findings by severity: High (7.0 - 8.9), Medium (4.0 - 6.9), and Low (0.1 - 3.9).
2. **AWS Security Hub**:
   - Central posture management (CSPM) dashboard that consolidates, organizes, and prioritizes security findings from GuardDuty, Macie, Inspector, IAM Access Analyzer, and AWS Config.
   - Evaluates your accounts against automated compliance frameworks: **CIS AWS Foundations Benchmark**, **PCI-DSS**, and **AWS Foundational Security Best Practices (FSBP)**.
3. **Amazon Detective**:
   - Automatically collects log data and uses machine learning and graph modeling to build interactive visual timelines of security incidents.
   - Helps incident responders quickly determine the root cause, blast radius, and related resources during an investigation.
4. **VPC Flow Logs**:
   - Captures information about IP traffic going to and from network interfaces (ENIs) in your VPC.
   - Essential for detecting port scans, command-and-control beacons, and network reconnaissance.`,
      whyItMatters: 'GuardDuty detects real-world threats (such as EC2 cryptocurrency mining, stolen IAM access keys used from Tor exit nodes, and S3 ransomware activity) within minutes without adding latency or performance overhead to your workloads.',
      securityRisks: [
        'Operating in AWS without GuardDuty enabled, remaining blind to active credential theft and malware beacons.',
        'Enabling GuardDuty only in a primary region, allowing adversaries to execute attacks in secondary regions undetected.',
        'Ignoring high-severity Security Hub compliance findings that expose systems to known vulnerabilities.',
        'Operating production VPCs without VPC Flow Logs, leaving zero network evidence during a breach investigation.'
      ],
      bestPractices: [
        'Enable Amazon GuardDuty across ALL AWS regions in all accounts via AWS Organizations delegated administration.',
        'Enable AWS Security Hub and enforce the AWS Foundational Security Best Practices (FSBP) standard.',
        'Enable VPC Flow Logs on all production VPCs, capturing both ACCEPT and REJECT traffic, streamed to S3 or CloudWatch.',
        'Integrate GuardDuty findings with Amazon EventBridge for automated containment (e.g. isolating compromised EC2 instances).'
      ],
      keyTakeaways: [
        'GuardDuty requires zero agents; it analyzes CloudTrail, DNS, and VPC Flow Logs natively in the AWS fabric.',
        'Security Hub provides centralized security scorecards and automated compliance benchmarking.',
        'Amazon Detective builds graph timelines to accelerate root-cause forensic investigations.',
        'VPC Flow Logs record network connection metadata (source, destination, port, action: ACCEPT/REJECT).'
      ],
      investigationExample: {
        title: 'GuardDuty Finding Analysis: Crypto-Currency Mining on EC2',
        description: 'Anatomy of an active GuardDuty finding showing an EC2 instance beaconing to a known cryptocurrency mining pool.',
        code: `{
  "schemaVersion": "2.0",
  "accountId": "123456789012",
  "region": "us-east-1",
  "type": "CryptoCurrency:EC2/BitcoinTool.B!DNS",
  "resource": {
    "resourceType": "Instance",
    "instanceDetails": {
      "instanceId": "i-0987654321fedcba0",
      "instanceType": "c5.4xlarge",
      "launchTime": "2026-03-12T18:40:00Z"
    }
  },
  "service": {
    "serviceName": "guardduty",
    "detectorId": "d-1234567890abcdef0",
    "action": {
      "actionType": "DNS_REQUEST",
      "dnsRequestAction": {
        "domain": "pool.minexmr.com",
        "protocol": "UDP",
        "blocked": false
      }
    },
    "count": 482,
    "eventFirstSeen": "2026-03-14T01:10:00Z",
    "eventLastSeen": "2026-03-14T03:15:00Z"
  },
  "severity": 8.0,
  "title": "EC2 instance i-0987654321fedcba0 is querying a domain name associated with cryptocurrency mining.",
  "description": "EC2 instance i-0987654321fedcba0 was detected making 482 DNS queries to pool.minexmr.com, an address associated with cryptocurrency mining."
}`
      },
      realWorldScenario: {
        title: 'The Tor Exit Node Credential Detection',
        incident: 'A software engineer\'s AWS credentials were leaked via an unencrypted terminal history on a public GitHub repo. The attacker used the Tor network to connect to the AWS CLI and call `iam:CreateAccessKey` to establish persistence. Amazon GuardDuty immediately detected the API call originating from a known Tor exit node IP and generated a High-Severity finding: `UnauthorizedAccess:IAMUser/TorIP`. An automated EventBridge rule triggered within 45 seconds, revoking the user\'s active sessions and disabling the compromised key before any resources could be modified.',
        impact: 'Zero damage; attack stopped in under 1 minute via automated detection and response.',
        detectionMethod: 'GuardDuty UnauthorizedAccess:IAMUser/TorIP alert routed via EventBridge to AWS Lambda containment function.'
      },
      commonBeginnerMistakes: [
        'Believing GuardDuty requires installing software agents on every EC2 instance (it analyzes AWS backend metadata with zero agents).',
        'Disabling GuardDuty to save a few dollars, leaving the account vulnerable to massive financial and data breaches.',
        'Not enabling GuardDuty in regions where you don\'t run workloads (attackers specifically target unmonitored regions!).',
        'Confusing Security Hub (compliance posture and dashboard) with GuardDuty (active threat intelligence).'
      ],
      whatACloudSecEngineerChecks: [
        'Verify GuardDuty is enabled in all regions: `aws guardduty list-detectors`.',
        'Check for active High/Medium GuardDuty findings: `aws guardduty list-findings --detector-id <ID> --finding-criteria \'{"Criterion": {"severity": {"Gte": 4.0}}}\'`.',
        'Review Security Hub compliance score: `aws securityhub get-findings`.',
        'Verify VPC Flow Logs configuration on all VPCs: `aws ec2 describe-flow-logs`.'
      ],
      codeSnippet: {
        language: 'bash',
        title: 'CLI: Check GuardDuty Detector Status and High-Severity Findings',
        code: `# 1. Verify GuardDuty Detector is Active
DETECTOR_ID=$(aws guardduty list-detectors --query "DetectorIds[0]" --output text)
echo "Active Detector: $DETECTOR_ID"

# 2. List High-Severity Security Findings (Severity >= 7.0)
aws guardduty list-findings \\
    --detector-id $DETECTOR_ID \\
    --finding-criteria '{"Criterion": {"severity": {"Gte": 7.0}}}' \\
    --output json`
      },
      interviewQuestions: [
        {
          question: 'How does Amazon GuardDuty detect threats without requiring any agents installed on EC2 instances or containers?',
          interviewerRationale: 'Evaluates architectural knowledge of AWS native security fabric and out-of-band telemetry.',
          modelAnswer: 'Amazon GuardDuty operates completely out-of-band at the AWS infrastructure and hypervisor level. It ingests and analyzes telemetry directly from core AWS data streams: AWS CloudTrail event logs (control plane API activity), CloudTrail S3 Data Events, VPC Flow Logs (network traffic metadata), DNS Query Logs (domains queried by EC2 instances), and Kubernetes/RDS audit logs. Because it consumes these streams directly from the AWS service fabric, it requires zero agent software, has zero performance impact on compute workloads, cannot be disabled or tampered with by an attacker from inside the guest operating system, and scales automatically.'
        },
        {
          question: 'What is the role of AWS Security Hub in an enterprise multi-account security architecture?',
          interviewerRationale: 'Tests enterprise security posture management (CSPM) and operational centralization.',
          modelAnswer: 'AWS Security Hub serves as the centralized Cloud Security Posture Management (CSPM) service. It performs two primary functions: 1) Centralized Finding Aggregation: Ingests and normalizes security findings across all AWS accounts and regions from GuardDuty, Macie, Inspector, IAM Access Analyzer, AWS Firewall Manager, and partner tools into a unified format (ASFF - AWS Security Finding Format). 2) Automated Compliance Benchmarking: Continuously assesses resources against established standards like the CIS AWS Foundations Benchmark, PCI-DSS, and AWS Foundational Security Best Practices, generating automated posture scores and actionable remediation recommendations.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Threat Detection and Remediation with Amazon GuardDuty',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Amazon GuardDuty Finding Types and Mechanics',
          url: 'https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-active.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Reference: AWS Security Hub User Guide and Standards',
          url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'An attacker breaches an EC2 instance, gains root access to the operating system, and deletes all local log files in /var/log. Can the attacker stop Amazon GuardDuty from analyzing network traffic from that instance?',
        options: [
          { id: 'a', text: 'Yes, by uninstalling the GuardDuty agent from the OS.', isCorrect: false, explanation: 'GuardDuty does not run an agent inside the guest OS.' },
          { id: 'b', text: 'Yes, by disabling the local Linux iptables firewall.', isCorrect: false, explanation: 'GuardDuty reads VPC Flow Logs from the hypervisor, not iptables.' },
          { id: 'c', text: 'No, because GuardDuty analyzes network traffic out-of-band at the AWS hypervisor level (VPC Flow Logs and DNS) without relying on the instance OS.', isCorrect: true, explanation: 'Correct! The attacker has no access to the AWS hypervisor fabric where GuardDuty analyzes telemetry.' },
          { id: 'd', text: 'Yes, if the attacker reboots the instance.', isCorrect: false, explanation: 'Rebooting has no effect on out-of-band AWS monitoring.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-mon-02',
        title: 'Investigation: Triage GuardDuty Crypto-Mining & C2 Beacon',
        url: '/investigations',
        description: 'Investigate an active GuardDuty finding and track the affected EC2 instance using VPC Flow Logs.'
      }
    },
    {
      id: 'alerting',
      title: 'Alerting, EventBridge & Automated Triage',
      pathId: 'monitoring',
      level: 'Intermediate',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Automation',
      summary: 'Build real-time security alerting pipelines. Master Amazon EventBridge rules, Amazon SNS topic routing, automated suppression of false positives, and PagerDuty/Slack webhooks.',
      overview: `Effective security operations require transforming raw security telemetry into rapid, actionable notifications while eliminating alert fatigue.

**The Modern Serverless Alerting Pipeline**:
1. **Event Source**: Amazon GuardDuty, AWS Security Hub, CloudTrail, or AWS Config emits an event in real-time.
2. **Event Router (Amazon EventBridge)**:
   - Evaluates incoming JSON events against custom **Event Patterns** in milliseconds.
   - Example Pattern: Match only High-Severity GuardDuty findings (\`severity >= 7.0\`).
   - Filters out low-priority noise and routes events to targets.
3. **Notification & Ticketing Targets**:
   - **Amazon SNS (Simple Notification Service)**: Fan-out service that delivers push notifications via Email, SMS, or HTTPS webhooks to Slack, Microsoft Teams, and PagerDuty.
   - **AWS Lambda**: Executes custom Python/Node.js logic to enrich findings with asset owner tags, query CMDBs, or open Jira/ServiceNow tickets.
   - **Systems Manager Automation**: Triggers automated runbooks to isolate instances or revoke credentials.

**Preventing Alert Fatigue**:
Alert fatigue occurs when security analysts are overwhelmed by hundreds of low-value, duplicate, or false-positive alerts, causing them to miss genuine critical incidents.
- Use **EventBridge Input Transformers** to format readable alerts with clear context (Asset ID, Region, Severity, Remediation link).
- Group and suppress repetitive alerts within defined time windows.
- Define clear SLA tiers: P1 (Critical - page on-call within 5 min), P2 (High - notify Slack within 15 min), P3/P4 (Medium/Low - aggregate into daily digest).`,
      whyItMatters: 'The average time for an adversary to begin lateral movement after initial access is under 90 minutes. Automated EventBridge alerting and response shrinks detection and containment from days to seconds.',
      securityRisks: [
        'Alert fatigue causing analysts to ignore high-severity security notifications.',
        'Single point of delivery failure (e.g. sending critical alerts only via email that gets caught in spam filters).',
        'Delayed alerting: polling logs every 6 hours instead of event-driven streaming.',
        'Automated remediation scripts executing destructive actions on production systems without safety guardrails.'
      ],
      bestPractices: [
        'Route critical P1 alerts directly to on-call paging platforms (PagerDuty, OpsGenie) with audio alerts.',
        'Use EventBridge Input Transformers to strip JSON clutter and deliver clear, human-readable Slack/Teams cards.',
        'Implement "Alert Deduplication" to prevent notification storms during automated vulnerability scans.',
        'Separate alerting channels by severity: `#soc-critical-alerts` vs. `#soc-info-digests`.'
      ],
      keyTakeaways: [
        'EventBridge matches events in real-time and routes them to SNS, Lambda, or SSM.',
        'Format alerts with Input Transformers so engineers see actionable context immediately.',
        'Tier alerts by severity to protect the on-call team from alert fatigue.',
        'Automate containment for high-confidence threats (e.g. auto-quarantine compromised keys).'
      ],
      investigationExample: {
        title: 'EventBridge Pattern: Capturing High-Severity GuardDuty Findings',
        description: 'JSON pattern used in Amazon EventBridge to filter out low/medium noise and capture only High-severity threats (7.0 - 8.9).',
        code: `{
  "source": ["aws.guardduty"],
  "detail-type": ["GuardDuty Finding"],
  "detail": {
    "severity": [
      {
        "numeric": [">=", 7]
      }
    ]
  }
}`
      },
      realWorldScenario: {
        title: 'The Silent Critical Alert in Spam',
        incident: 'A company configured CloudWatch Alarms to send security notifications to an unmonitored generic email distribution list (`security-alerts@company.com`). During a holiday weekend, GuardDuty triggered an alert for active S3 data exfiltration. The email sat in an unchecked folder for 72 hours until the attacker publicly published the stolen database.',
        impact: 'Exfiltration of 1.2M customer records; failure of notification escalation protocols.',
        detectionMethod: 'Post-incident review revealed that AWS had successfully delivered the alert within 90 seconds, but no human was paged.'
      },
      commonBeginnerMistakes: [
        'Sending all security findings regardless of severity to the same Slack channel, causing engineers to mute the channel.',
        'Sending raw, unformatted JSON payloads to notification channels, making triage slow and confusing.',
        'Failing to verify SNS email subscriptions (pending confirmation link never clicked).',
        'Not setting up dead-letter queues (DLQs) on EventBridge rules to capture failed notification deliveries.'
      ],
      whatACloudSecEngineerChecks: [
        'Inspect EventBridge rules for active security patterns: `aws events list-rules`.',
        'Verify SNS topic subscription status: ensure zero subscriptions are in `PendingConfirmation`.',
        'Test the alerting pipeline end-to-end using simulated events: `aws events put-events`.',
        'Confirm Dead-Letter Queues (DLQs) are attached to critical notification targets.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Terraform: EventBridge Rule Routing Critical GuardDuty Findings to SNS Topic',
        code: `resource "aws_cloudwatch_event_rule" "guardduty_critical" {
  name        = "capture-critical-guardduty-findings"
  description = "Filter and route High Severity GuardDuty alerts to the SOC"

  event_pattern = jsonencode({
    source      = ["aws.guardduty"]
    detail-type = ["GuardDuty Finding"]
    detail = {
      severity = [{ numeric = [">=", 7] }]
    }
  })
}

resource "aws_cloudwatch_event_target" "sns_target" {
  rule      = aws_cloudwatch_event_rule.guardduty_critical.name
  target_id = "SendToSOCNotificationTopic"
  arn       = aws_sns_topic.soc_paging_alerts.arn

  input_transformer {
    input_paths = {
      title       = "$.detail.title"
      severity    = "$.detail.severity"
      region      = "$.region"
      description = "$.detail.description"
    }
    input_template = "\"CRITICAL SECURITY ALERT in <region>! Severity: <severity>\\nTitle: <title>\\nDetails: <description>\""
  }
}`
      },
      interviewQuestions: [
        {
          question: 'How do you design an alert pipeline that alerts the on-call engineer within 2 minutes for critical findings while preventing alert fatigue?',
          interviewerRationale: 'Evaluates production operational maturity, event filtering, and signal-to-noise ratio optimization.',
          modelAnswer: 'Use an event-driven architecture with Amazon EventBridge and tiered routing: 1) Filtering at the Source: Use EventBridge event patterns to match only findings with severity >= 7.0 (High/Critical) or specific high-confidence threat types (e.g. Tor IP usage, crypto-mining, root activity). 2) Tiered Escalation: Route Critical P1 alerts to Amazon SNS connected to an on-call paging tool (PagerDuty/OpsGenie) that rings the engineer\'s phone. Route Medium P2/P3 alerts to a dedicated Slack channel for daytime triage. 3) Human-Centric Formatting: Use EventBridge Input Transformers to strip raw JSON and produce a concise card containing: Account ID, Region, Asset ARN, Attacker IP, and Direct Console Deep-Link. 4) Continuous Tuning: Conduct weekly alert review meetings to identify and suppress noisy false positives.'
        },
        {
          question: 'What is an EventBridge Input Transformer and why is it essential for incident triage?',
          interviewerRationale: 'Tests hands-on knowledge of AWS EventBridge capabilities and operational usability.',
          modelAnswer: 'An EventBridge Input Transformer allows you to extract specific keys from a complex JSON event payload (using Input Paths) and remap them into a customized text or JSON template (using Input Template) before sending to the destination target. Without an input transformer, targets receive the raw 10KB AWS event payload, which is unreadable in Slack, SMS, or mobile push notifications. By transforming the payload, responders immediately see the key forensic facts (e.g., "Critical: S3 Bucket \'prod-data\' made public by User \'deployer\'") without having to parse raw JSON.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Building Event-Driven Architectures with Amazon EventBridge',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Amazon EventBridge Event Patterns and Routing',
          url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Blog: Automated Incident Response with EventBridge and Lambda',
          url: 'https://aws.amazon.com/blogs/security/how-to-automate-incident-response-to-security-findings-with-aws-security-hub/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Which service allows you to evaluate incoming security finding JSON documents in real-time, filter them by severity, and route them to multiple destinations (SNS, Lambda, SSM)?',
        options: [
          { id: 'a', text: 'Amazon Simple Queue Service (SQS)', isCorrect: false, explanation: 'SQS stores messages for polling; it does not filter or route JSON events.' },
          { id: 'b', text: 'Amazon EventBridge', isCorrect: true, explanation: 'Correct! EventBridge evaluates event patterns in real time and routes matching events to multiple targets.' },
          { id: 'c', text: 'AWS Direct Connect', isCorrect: false, explanation: 'Direct Connect is a dedicated physical network connection.' },
          { id: 'd', text: 'AWS Storage Gateway', isCorrect: false, explanation: 'Storage Gateway connects on-premises storage to AWS.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-mon-03',
        title: 'Investigation: High-Volume Alert Fatigue & Signal Extraction',
        url: '/investigations',
        description: 'Filter through noisy event logs to identify a subtle privilege escalation attack buried under benign warnings.'
      }
    },
    {
      id: 'audit-trails',
      title: 'Audit Trails, S3 Vaults & Compliance',
      pathId: 'monitoring',
      level: 'Advanced',
      estimatedTime: '22 min read • 6 min check',
      badge: 'Compliance & Governance',
      summary: 'Design immutable, tamper-evident log archive vaults. Master cross-account log consolidation, S3 Object Lock for logs, 365+ day retention schedules, and meeting SOC 2 & PCI-DSS audit mandates.',
      overview: `In regulatory frameworks (SOC 2 Type II, ISO 27001, PCI-DSS v4.0, HIPAA, and SEC regulations), organizations must maintain comprehensive, tamper-evident audit trails of all system and administrative activity for a minimum of 365 days (and up to 7 years).

**Architecting the Centralized Log Archive Vault**:
1. **Dedicated Log Archive AWS Account**:
   - Belongs to the AWS Organization, but is strictly isolated.
   - Only a tiny number of security executives have emergency break-glass access; standard engineers and developers have ZERO credentials in this account.
2. **Centralized Log Delivery**:
   - CloudTrail Organization Trails, VPC Flow Logs, GuardDuty findings, and CloudWatch Log Streams across ALL member accounts (Prod, Dev, Stage) stream directly to a central S3 bucket in the Log Archive account.
3. **Immutability Enforcement**:
   - **S3 Object Lock (Compliance Mode)**: Enforces WORM storage where log files cannot be deleted, renamed, or modified by ANY user (including AWS root) for 365+ days.
   - **KMS Key Isolation**: Destination log bucket encrypts objects with a KMS key owned exclusively by the Log Archive account. Member accounts have write-only permission (\`kms:GenerateDataKey\`) and cannot decrypt historical logs.
4. **Automated Tiering for Cost Management**:
   - S3 Lifecycle rules transition logs to S3 Glacier Flexible Retrieval after 90 days and Glacier Deep Archive after 180 days, reducing storage costs by over 90% while preserving cryptographic immutability.`,
      whyItMatters: 'If an adversary compromises an administrator account in production, they cannot delete or alter the audit logs in the isolated Log Archive account. This ensures full forensic evidence remains intact for post-breach investigation and legal prosecution.',
      securityRisks: [
        'Storing audit logs inside the production account where compromised admins can delete them.',
        'Failing to retain logs for the compliance-mandated duration (e.g. deleting logs after 30 days when PCI-DSS requires 365 days).',
        'Unencrypted audit buckets allowing unauthorized internal personnel to view sensitive user activity.',
        'Log delivery failure unnoticed due to missing S3 bucket metric alarms.'
      ],
      bestPractices: [
        'Consolidate all organizational audit logs into a dedicated Log Archive AWS Account.',
        'Enable S3 Object Lock in Compliance Mode with a minimum 365-day retention policy.',
        'Use S3 Glacier Deep Archive for long-term multi-year retention to minimize storage costs.',
        'Configure Amazon CloudWatch alarms on log delivery metrics to detect logging interruptions immediately.'
      ],
      keyTakeaways: [
        'Never store audit logs exclusively in the account where workloads run.',
        'Compliance mandates require at least 365 days of audit log retention.',
        'S3 Object Lock Compliance Mode guarantees mathematical immutability for compliance audits.',
        'Glacier Deep Archive provides secure, compliant log storage at under $1 per Terabyte per month.'
      ],
      investigationExample: {
        title: 'Athena SQL Query: Auditing Cross-Account S3 Log Vault Deliveries',
        description: 'SQL query executed in Amazon Athena over centralized CloudTrail logs to verify continuous log delivery across all organization accounts.',
        code: `SELECT 
    recipientaccountid,
    awsregion,
    COUNT(*) as total_events,
    MIN(eventtime) as earliest_event,
    MAX(eventtime) as latest_event
FROM central_cloudtrail_logs_db.cloudtrail_table
WHERE year = '2026' AND month = '03'
GROUP BY recipientaccountid, awsregion
ORDER BY recipientaccountid, total_events DESC;`
      },
      realWorldScenario: {
        title: 'The Failed SOC 2 Type II Audit',
        incident: 'A B2B SaaS startup underwent their first SOC 2 Type II audit. The external auditor requested 12 months of CloudTrail and database query logs. The engineering team discovered that because no lifecycle rules or central archive account existed, a junior developer had deleted the log bucket 6 months earlier to clean up storage, and CloudTrail had defaulted to the 90-day event history.',
        impact: 'Failed SOC 2 audit, delayed $10M enterprise sales deals, and mandatory 6-month re-audit period.',
        detectionMethod: 'Auditor request could not be fulfilled due to missing historical logs.'
      },
      commonBeginnerMistakes: [
        'Relying on CloudTrail 90-day event history for annual compliance audits (it only retains 90 days of management events!).',
        'Not setting up a dedicated Log Archive account, leaving logs vulnerable to production root compromise.',
        'Failing to verify bucket policies, allowing production accounts to read or delete historical archives.',
        'Forgetting to configure Athena tables to query compressed JSON log archives efficiently.'
      ],
      whatACloudSecEngineerChecks: [
        'Verify that the central log bucket has S3 Object Lock enabled in Compliance Mode.',
        'Confirm that bucket policy denies `s3:DeleteObject` and `s3:DeleteBucket` to all principals.',
        'Verify multi-account organization trail status across all member accounts.',
        'Check lifecycle rules to ensure compliance retention timelines (e.g. 365+ days) are satisfied.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: Bucket Policy for Central Log Archive Denying All Deletions',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnforceCentralizedLogArchiveImmutability",
      "Effect": "Deny",
      "Principal": "*",
      "Action": [
        "s3:DeleteObject",
        "s3:DeleteObjectVersion",
        "s3:DeleteBucketPolicy",
        "s3:DeleteBucket"
      ],
      "Resource": [
        "arn:aws:s3:::central-enterprise-audit-vault",
        "arn:aws:s3:::central-enterprise-audit-vault/*"
      ]
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'How do you architect a centralized, immutable audit logging solution for an enterprise with 50+ AWS accounts to satisfy SOC 2 and PCI-DSS compliance?',
          interviewerRationale: 'A classic Principal Cloud Security Architect question testing multi-account governance, compliance, and tamper-resistance.',
          modelAnswer: '1) Dedicated Account: Establish an isolated Log Archive AWS account within AWS Organizations with strictly restricted access (no day-to-day human access). 2) Organization Trail: Create a multi-region Organization Trail in the Organizations management account that automatically records CloudTrail events across all 50+ member accounts and delivers them to a central S3 bucket in the Log Archive account. 3) Immutability: Configure the central S3 bucket with S3 Object Lock in Compliance Mode with a 365-day retention period, rendering logs physically un-deletable even by the root user. 4) Encryption & Access: Encrypt the bucket with a Customer Managed KMS Key owned by the Log Archive account, granting member accounts write-only permissions. 5) Long-Term Lifecycle: Apply lifecycle policies transitioning logs to S3 Glacier Deep Archive after 90 days. 6) Verification: Enable Log File Integrity Validation to mathematically prove logs were unmodified.'
        },
        {
          question: 'Why is S3 Glacier Deep Archive recommended for compliance log storage rather than standard S3?',
          interviewerRationale: 'Evaluates cost optimization, compliance awareness, and lifecycle storage economics.',
          modelAnswer: 'Compliance standards like PCI-DSS and HIPAA require retaining audit logs for 1 to 7 years. In standard S3, storing 50 Terabytes of logs across an enterprise costs approximately $1,150 per month ($13,800/year). In S3 Glacier Deep Archive, the same 50 Terabytes costs approximately $50 per month ($600/year) — a 95% cost reduction. Because compliance logs are write-once and rarely accessed except during audits or investigations, Glacier Deep Archive provides the exact same 11 9s of durability and Object Lock compliance at a fraction of the cost.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Building a Centralized Logging Solution on AWS',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Best Practices for Centralized Log Storage',
          url: 'https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/centralized-logging.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Reference: Compliance Standards in AWS Security Hub',
          url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/standards-reference.html',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Under PCI-DSS requirement 10, how long must audit trail history be retained, and how long must it be immediately available for analysis?',
        options: [
          { id: 'a', text: 'Retained for 30 days; immediately available for 7 days.', isCorrect: false, explanation: 'PCI-DSS requires significantly longer retention.' },
          { id: 'b', text: 'Retained for at least 1 year (365 days), with at least 3 months (90 days) immediately available for analysis.', isCorrect: true, explanation: 'Correct! PCI-DSS v4.0 requires 1 year total retention with 3 months readily available.' },
          { id: 'c', text: 'Retained indefinitely with zero archiving.', isCorrect: false, explanation: 'PCI-DSS specifies a 1-year minimum requirement.' },
          { id: 'd', text: 'Retained for 7 years on paper printouts.', isCorrect: false, explanation: 'Electronic immutable cloud storage is fully compliant.' }
        ]
      },
      bridgeToLabs: {
        type: 'Architecture',
        id: 'arch-mon-01',
        title: 'Architecture Review: Centralized Multi-Account Log Archive Vault',
        url: '/architecture-reviews',
        description: 'Audit an enterprise logging architecture for compliance gaps, KMS permissions, and Object Lock enforcement.'
      }
    },
    {
      id: 'detection',
      title: 'Threat Detection Engineering & SIEM Integration',
      pathId: 'monitoring',
      level: 'Advanced',
      estimatedTime: '24 min read • 6 min check',
      badge: 'Detection Engineering',
      summary: 'Engineer custom threat detection rules. Map attacker TTPs to the MITRE ATT&CK Cloud Matrix, detect credential anomalies, and stream telemetry into SIEMs (OpenSearch, Splunk).',
      overview: `Detection Engineering is the discipline of designing, building, testing, and maintaining automated threat detection logic to identify adversary tactics, techniques, and procedures (TTPs).

**The MITRE ATT&CK for Cloud Matrix**:
Security engineers map detections against the MITRE ATT&CK Cloud Matrix across the kill chain:
1. **Initial Access**: Exposed IAM access keys (T1552), Phishing for console credentials (T1566).
2. **Persistence**: Creating backdoor IAM users (T1136.001), creating access keys on existing users (T1098.001).
3. **Privilege Escalation**: Attaching admin policies to self (T1078.004), modifying permissions boundaries (T1484).
4. **Defense Evasion**: Disabling CloudTrail (T1562.001), clearing CloudWatch Log Streams, disabling GuardDuty.
5. **Credential Access**: Stealing credentials from EC2 metadata service (T1552.005), extracting secrets from Secrets Manager.
6. **Exfiltration**: Exfiltrating S3 buckets to external accounts (T1537), cloning unencrypted EBS snapshots to external account IDs.
7. **Impact**: Deleting databases, running cryptominers (T1496), or executing ransomware.

**SIEM Integration Architectures**:
To correlate AWS events with on-premises firewalls, endpoint detection (EDR), and identity providers:
- Stream CloudTrail, VPC Flow Logs, and GuardDuty findings into **Amazon OpenSearch Service**, **Splunk**, **Datadog**, or **Snowflake** using **Amazon Kinesis Data Firehose**.`,
      whyItMatters: 'Off-the-shelf detection tools miss organization-specific anomalies. Detection engineers write custom rules tailored to their company\'s specific baseline, catching sophisticated attacks before impact occurs.',
      securityRisks: [
        'Relying solely on static vendor rules without custom behavioral detections.',
        'Failing to monitor for internal cloud persistence techniques (e.g. creating rogue IAM access keys).',
        'High false-positive rates causing analysts to ignore detection alerts.',
        'Not testing detection rules using adversary emulation frameworks (e.g., Stratus Red Team).'
      ],
      bestPractices: [
        'Map all cloud detection rules to specific MITRE ATT&CK Cloud technique IDs.',
        'Test detection rules continuously using automated adversary emulation tools like Stratus Red Team or Atomic Red Team.',
        'Stream raw telemetry to a centralized SIEM via Amazon Kinesis Data Firehose for cross-platform correlation.',
        'Establish automated canary tokens (e.g. Honeytokens) in code repositories to detect credential theft immediately.'
      ],
      keyTakeaways: [
        'Detection engineering writes and tunes custom rules mapped to MITRE ATT&CK Cloud tactics.',
        'Monitor for persistence techniques like CreateAccessKey, CreateLoginProfile, and AttachUserPolicy.',
        'Stream multi-account logs to SIEM platforms using Kinesis Data Firehose for unified analytics.',
        'Continuously validate detections using automated attack simulation (Stratus Red Team).'
      ],
      investigationExample: {
        title: 'Athena SQL Query: Detecting Initial Foothold Persistence (New Access Keys)',
        description: 'Detection query identifying instances where an IAM user created access keys for a DIFFERENT user account (Privilege Persistence T1098).',
        code: `SELECT 
    eventtime,
    useridentity.arn as calling_principal,
    requestparameters,
    responseelements,
    sourceipaddress,
    useragent
FROM central_cloudtrail_logs_db.cloudtrail_table
WHERE eventname = 'CreateAccessKey'
  AND json_extract_scalar(requestparameters, '$.userName') != split_part(useridentity.arn, '/', 2)
ORDER BY eventtime DESC;`
      },
      realWorldScenario: {
        title: 'The Hidden Backdoor Key Persistence',
        incident: 'An attacker compromised a developer\'s temporary credentials. Rather than performing noisy cryptomining immediately, the attacker executed `aws iam create-access-key --user-name legacy-billing-svc` on an existing, rarely monitored service account. When the developer\'s original credentials expired 4 hours later, the attacker maintained persistent access through the newly created backdoor key for 3 weeks.',
        impact: 'Persistent unauthorized access; attacker mapped the entire corporate AWS architecture undetected.',
        detectionMethod: 'Detection engineering rule alerted on `CreateAccessKey` called on a dormant account from an unfamiliar IP.'
      },
      commonBeginnerMistakes: [
        'Creating detection rules based solely on static IP blacklists that change constantly.',
        'Writing detection rules without testing them against real attack simulation tools.',
        'Failing to alert on internal IAM persistence commands (e.g., `CreateLoginProfile`).',
        'Not documenting the investigation SOP (Standard Operating Procedure) for each detection alert.'
      ],
      whatACloudSecEngineerChecks: [
        'Verify SIEM ingestion pipeline: check Kinesis Data Firehose delivery stream metrics and error logs.',
        'Test detection alert firing using Stratus Red Team: `stratus detonate aws.defense-evasion.cloudtrail-stop`.',
        'Audit coverage of MITRE ATT&CK Cloud Matrix in Security Hub or SIEM dashboards.',
        'Confirm canary honeytokens are deployed in source repositories to detect leaks.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: EventBridge Rule Detecting Creation of New IAM Console Login Profiles (Backdoor T1136)',
        code: `{
  "source": ["aws.iam"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventSource": ["iam.amazonaws.com"],
    "eventName": [
      "CreateLoginProfile",
      "CreateAccessKey",
      "AttachUserPolicy",
      "PutUserPolicy"
    ]
  }
}`
      },
      interviewQuestions: [
        {
          question: 'How do you test and validate that your cloud detection rules are functioning correctly in production without causing an outage?',
          interviewerRationale: 'Evaluates detection engineering lifecycle, adversary emulation, and operational discipline.',
          modelAnswer: 'I use automated cloud adversary emulation frameworks such as Datadog\'s Stratus Red Team or Red Canary\'s Atomic Red Team. These open-source tools execute granular, reversible attack techniques in a safe, controlled sandbox (for example: executing `aws.defense-evasion.cloudtrail-stop` or `aws.persistence.iam-create-admin-login-profile`). By detonating the technique, we verify the complete pipeline: 1) CloudTrail records the event, 2) EventBridge or the SIEM matches the detection rule, 3) The alert fires with high fidelity, and 4) Automated cleanup safely reverts the changes. We integrate these tests into our continuous CI/CD pipeline to ensure rule drift does not break detections.'
        },
        {
          question: 'What is a Honeytoken (canary credential) in AWS, and how does it provide high-fidelity threat detection?',
          interviewerRationale: 'Assesses deception technology, zero-false-positive detection, and threat intelligence expertise.',
          modelAnswer: 'A Honeytoken is a deliberate, fake AWS IAM access key created with zero legitimate permissions, placed in code repositories, environment variables, or fake configuration files. Because the key has no legitimate operational use, NO authorized application or engineer will ever invoke it. If the key is used in any AWS API call, the likelihood of an active attacker or credential leak is 100%. We configure an immediate P1 alert in CloudWatch or EventBridge on any API call using that key ID, providing an instant, zero-false-positive signal of a security breach.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Advanced Threat Detection and Security Operations',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Streaming CloudTrail to Amazon OpenSearch Service',
          url: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/integrations.html',
          type: 'Documentation'
        },
        {
          title: 'MITRE ATT&CK Matrix for Cloud: Techniques and Mitigations',
          url: 'https://attack.mitre.org/matrices/enterprise/cloud/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Which MITRE ATT&CK technique describes an adversary calling "cloudtrail:StopLogging" to blind the security operations team?',
        options: [
          { id: 'a', text: 'T1562.001: Impair Defenses: Disable Cloud Logs', isCorrect: true, explanation: 'Correct! T1562.001 represents disabling security logging and defense tools.' },
          { id: 'b', text: 'T1059: Command and Scripting Interpreter', isCorrect: false, explanation: 'T1059 describes running command scripts.' },
          { id: 'c', text: 'T1078: Valid Accounts', isCorrect: false, explanation: 'T1078 describes using legitimate credentials.' },
          { id: 'd', text: 'T1496: Resource Hijacking', isCorrect: false, explanation: 'T1496 describes cryptomining and compute theft.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-mon-04',
        title: 'Investigation: Advanced Persistent Threat (APT) Lateral Movement',
        url: '/investigations',
        description: 'Perform end-to-end detection engineering triage across multi-service CloudTrail and VPC Flow Logs.'
      }
    },
    {
      id: 'observability-prometheus-grafana',
      title: 'Cloud Observability: Prometheus, Grafana & Log Aggregation',
      pathId: 'monitoring',
      level: 'Intermediate',
      estimatedTime: '25 min read • 5 min check',
      badge: 'Scaling Layer',
      summary: 'Master the 3 pillars of observability (Metrics, Logs, Traces). Configure Prometheus metric scraping, Grafana dashboards, Alertmanager, and ELK/OpenSearch structured log aggregation.',
      overview: `Observability is the ability to infer the internal states of complex distributed systems based on external outputs. In multi-cluster Kubernetes and cloud architectures, observability separates a 2-minute minor incident from a 6-hour cascading catastrophe.
      
**The Three Pillars of Observability**:
1. **Metrics (Numeric Aggregations Over Time)**:
   - Counters, Gauges, Histograms, and Summaries.
   - Low storage footprint, highly compressible, ideal for real-time alerting.
   - **Prometheus**: Time-series database utilizing a pull-based HTTP scraping model. Uses PromQL for multi-dimensional querying (e.g., \`rate(http_requests_total{status=~"5.."}[5m])\`).
2. **Logs (Discrete Timestamped Event Records)**:
   - High cardinality, unstructured or structured JSON containing contextual error stack traces.
   - Aggregated via tools like Fluentbit, Logstash, or Vector into central search engines (ELK / OpenSearch / CloudWatch Logs).
3. **Traces (Request Lifecycle Across Microservices)**:
   - Tracks a single transaction as it hops across microservice boundaries via distributed context propagation headers (TraceID, SpanID). Powered by OpenTelemetry (OTel) and Jaeger.

**Grafana & Alertmanager**:
- **Grafana**: Central visualization layer querying Prometheus, OpenSearch, and CloudWatch in unified dashboards.
- **Alertmanager**: Deduplicates, groups, and routes Prometheus alert rules to PagerDuty, Slack, or webhook endpoints based on severity labels.`,
      whyItMatters: 'A cluster can have all green health checks while silently failing 30% of user transactions. Metrics and distributed traces expose hidden latency degradation and silent API failures before customers complain.',
      securityRisks: [
        'Accidentally logging sensitive PII, credit card numbers, or API keys in application logs.',
        'Alert fatigue caused by un-tuned threshold alerts, leading on-call engineers to ignore critical alerts.',
        'Leaving Prometheus metrics endpoints (/metrics) or Grafana dashboards exposed without authentication.'
      ],
      bestPractices: [
        'Alert on symptoms that affect users (e.g. high latency, 5xx error rate) rather than causes (high CPU usage).',
        'Use structured JSON logging with standardized fields (`timestamp`, `level`, `service`, `trace_id`, `message`).',
        'Scrub sensitive data at the collector layer using Vector or Fluentbit regex sanitizers.',
        'Protect Grafana instances behind SSO / Identity-Aware Proxies with Role-Based Access Control.'
      ],
      keyTakeaways: [
        'The 3 pillars of observability are Metrics (Prometheus), Logs (ELK/OpenSearch), and Traces (OpenTelemetry).',
        'Prometheus uses a pull-based scraping model and PromQL for time-series math.',
        'Alert on user-impacting symptoms (SLOs) rather than noisy server CPU/memory spikes.',
        'Never log credentials or sensitive PII in plaintext application logs.'
      ],
      codeExample: {
        language: 'yaml',
        title: 'Prometheus Alerting Rule for High HTTP Error Rates & SLO Breaches',
        code: `groups:
- name: api-service-alerts
  rules:
  - alert: HighErrorRate5xx
    expr: |
      (
        sum(rate(http_requests_total{status=~"5.."}[5m]))
        /
        sum(rate(http_requests_total[5m]))
      ) * 100 > 5
    for: 2m
    labels:
      severity: critical
      tier: scaling-layer
    annotations:
      summary: "High HTTP 5xx error rate detected on {{ $labels.service }}"
      description: "Service {{ $labels.service }} is experiencing {{ $value | printf '%.2f' }}% 5xx errors for > 2 minutes. Immediate investigation required."
      runbook_url: "https://internal.wiki/runbooks/api-5xx-incident"`
      },
      cliCommands: [
        {
          command: 'promtool check rules alerts.yml',
          purpose: 'Lint and validate Prometheus alerting rule syntax before deployment.'
        },
        {
          command: 'curl -s http://localhost:9090/metrics | grep -E "^process_resident_memory_bytes"',
          purpose: 'Inspect live Prometheus metrics endpoint directly via HTTP.'
        }
      ],
      interviewQuestions: [
        {
          question: 'What is the difference between Metrics, Logs, and Traces, and how do they work together during an active production outage?',
          interviewerRationale: 'Evaluates production troubleshooting methodology and telemetry systems fluency.',
          modelAnswer: 'Metrics tell you THAT something is broken (e.g., Prometheus triggers an alert that 5xx error rate spiked to 12%). Traces tell you WHERE it is broken (distributed tracing pinpoints that the latency and errors originated in the Payment-Service microservice calling an external payment gateway). Logs tell you WHY it is broken (querying OpenSearch for logs matching that specific TraceID reveals the exact exception stack trace: "Connection timed out to third-party payment gateway"). Together, they reduce Mean Time to Resolution (MTTR) from hours to minutes.'
        }
      ],
      awsResources: [
        {
          title: 'Prometheus Official Documentation: Overview and Architecture',
          url: 'https://prometheus.io/docs/introduction/overview/',
          type: 'Official Documentation'
        },
        {
          title: 'Grafana Labs: Fundamentals of Cloud Observability',
          url: 'https://grafana.com/docs/grafana/latest/fundamentals/',
          type: 'Observability Guide'
        }
      ],
      knowledgeCheck: {
        question: 'In Prometheus, which metric type is designed for monotonically increasing values like total request counts or errors that only increase or reset to zero on restart?',
        options: [
          { id: 'a', text: 'Gauge', isCorrect: false, explanation: 'Gauges represent values that can go up and down (e.g. memory usage).' },
          { id: 'b', text: 'Counter', isCorrect: true, explanation: 'Correct! Counters are monotonically increasing cumulative metrics.' },
          { id: 'c', text: 'Histogram', isCorrect: false, explanation: 'Histograms sample observations and count them in configurable buckets.' },
          { id: 'd', text: 'Summary', isCorrect: false, explanation: 'Summaries calculate configurable quantiles over a sliding time window.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-prometheus-grafana',
        title: 'Master Lab: Prometheus Alerting & Grafana Telemetry Dashboard',
        url: '/investigations',
        description: 'Triage production alerts using Prometheus metrics, PromQL queries, and Grafana dashboards.'
      }
    }
  ]
}
