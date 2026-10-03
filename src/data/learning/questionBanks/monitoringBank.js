// Monitoring & Logging Question Bank: 30 High-Yield Cloud Security Questions
// Classified into Beginner, Intermediate, Advanced, and Engineer Level

export const monitoringQuestionBank = [
  {
    id: 'mon-q01',
    difficulty: 'Beginner',
    category: 'Audit Trails',
    topicId: 'cloudtrail-deep-dive',
    topicTitle: 'CloudTrail Deep Dive',
    question: 'What is the primary function of AWS CloudTrail in a cloud security architecture?',
    options: [
      'To monitor real-time CPU and memory utilization of EC2 instances.',
      'To record, continuously monitor, and retain account activity and API calls made across AWS services for auditing and forensics.',
      'To automatically rewrite vulnerable application source code.',
      'To act as a load balancer for web traffic.'
    ],
    correctAnswer: 'To record, continuously monitor, and retain account activity and API calls made across AWS services for auditing and forensics.',
    explanation: 'AWS CloudTrail provides an immutable audit record of actions taken by a user, role, or AWS service. It records who made the call, when, from what IP address, with what parameters, and the response.',
    engineerReasoning: 'CloudTrail is the foundational source of truth for cloud forensics. Without CloudTrail, you cannot determine how a breach occurred or which data was accessed.',
    businessImpact: 'Essential for regulatory compliance (SOC 2, ISO 27001, PCI-DSS) and rapid incident response.',
    awsBestPractice: 'Enable a multi-region organizational trail that sends logs to an isolated, tamper-proof security audit account.'
  },
  {
    id: 'mon-q02',
    difficulty: 'Beginner',
    category: 'Performance & Telemetry',
    topicId: 'cloudwatch-alarms-metrics',
    topicTitle: 'CloudWatch Alarms & Metrics',
    question: 'How do Amazon CloudWatch Metrics and AWS CloudTrail Logs differ in their operational purpose?',
    options: [
      'CloudWatch tracks quantitative metrics (CPU, disk I/O, error rates) over time; CloudTrail records chronological discrete API events and user actions.',
      'CloudWatch is only used for billing, while CloudTrail is only used for networking.',
      'CloudTrail runs inside Docker containers, while CloudWatch runs on physical switches.',
      'CloudWatch cannot generate alarms, whereas CloudTrail triggers automatic rollbacks.'
    ],
    correctAnswer: 'CloudWatch tracks quantitative metrics (CPU, disk I/O, error rates) over time; CloudTrail records chronological discrete API events and user actions.',
    explanation: 'CloudWatch focuses on performance, operational telemetry, and quantitative timeseries data. CloudTrail focuses on governance, compliance, and auditing of API requests.',
    engineerReasoning: 'Engineers combine both: CloudWatch metric filters ingest CloudTrail logs to generate alarms when suspicious API calls (e.g. root account login) occur.',
    businessImpact: 'Ensures both high operational availability and proactive detection of security breaches.',
    awsBestPractice: 'Create CloudWatch alarms on CloudTrail log metric filters for critical events like unauthorized API calls and IAM policy changes.'
  },
  {
    id: 'mon-q03',
    difficulty: 'Beginner',
    category: 'Intelligent Threat Detection',
    topicId: 'guardduty-threat-detection',
    topicTitle: 'Amazon GuardDuty',
    question: 'How does Amazon GuardDuty detect threat activity without impacting performance or requiring software agents on EC2 instances?',
    options: [
      'By rebooting instances to inspect their hard drives.',
      'By continuously analyzing AWS foundational telemetry streams: CloudTrail management and data events, VPC Flow Logs, and Route 53 DNS query logs.',
      'By reading user emails and chat messages.',
      'By running active brute-force password cracking tests against your workloads.'
    ],
    correctAnswer: 'By continuously analyzing AWS foundational telemetry streams: CloudTrail management and data events, VPC Flow Logs, and Route 53 DNS query logs.',
    explanation: 'GuardDuty is an agentless threat detection service that operates directly at the AWS hypervisor and control plane layer, analyzing CloudTrail, VPC Flow Logs, and DNS queries with machine learning and threat intelligence feeds.',
    engineerReasoning: 'Because it is completely independent of compute instances, threat actors cannot disable, blind, or evade GuardDuty by compromising the operating system.',
    businessImpact: 'Provides immediate enterprise-wide threat detection with zero operational burden, CPU overhead, or software maintenance.',
    awsBestPractice: 'Enable GuardDuty across all AWS accounts and regions centrally using AWS Organizations delegated administration.'
  },
  {
    id: 'mon-q04',
    difficulty: 'Beginner',
    category: 'Compliance & Drift',
    topicId: 'security-hub-config',
    topicTitle: 'Security Hub & AWS Config',
    question: 'What is the primary role of AWS Config in maintaining cloud security posture?',
    options: [
      'To provide free SSL certificates for websites.',
      'To continuously record resource configuration changes, evaluate them against desired compliance rules, and detect drift over time.',
      'To manage office Wi-Fi routers.',
      'To store customer credit card details in plain text.'
    ],
    correctAnswer: 'To continuously record resource configuration changes, evaluate them against desired compliance rules, and detect drift over time.',
    explanation: 'AWS Config acts as a configuration audit recorder. It tracks how resources are configured over time, compares them against compliance rules (e.g., "s3-bucket-public-read-prohibited"), and flags non-compliant assets.',
    engineerReasoning: 'Detecting configuration drift allows security teams to identify misconfigurations (like an opened security group) within seconds of creation.',
    businessImpact: 'Prevents compliance failures during annual audits and minimizes exposure windows for misconfigured infrastructure.',
    awsBestPractice: 'Deploy AWS Config conformance packs across all accounts to enforce CIS AWS Foundations Benchmark standards.'
  },
  {
    id: 'mon-q05',
    difficulty: 'Beginner',
    category: 'Log Querying',
    topicId: 'athena-log-analysis',
    topicTitle: 'Athena Log Analysis',
    question: 'Why is Amazon Athena widely used by cloud security incident response teams for log analysis?',
    options: [
      'It is an interactive, serverless SQL query engine that can directly query terabytes of raw logs stored in Amazon S3 without loading them into a database.',
      'It is a video streaming service for security training videos.',
      'It is an antivirus software installed on Windows laptops.',
      'It replaces the AWS Management Console with a command-line prompt.'
    ],
    correctAnswer: 'It is an interactive, serverless SQL query engine that can directly query terabytes of raw logs stored in Amazon S3 without loading them into a database.',
    explanation: 'Athena uses Presto/Trino to run standard SQL queries directly against compressed JSON, Parquet, or CSV log files in S3. Security analysts can query millions of CloudTrail or VPC Flow records in seconds with zero infrastructure management.',
    engineerReasoning: 'Incident responders need rapid ad-hoc query capabilities across months of forensic logs without the multi-hour delay of spinning up dedicated database clusters.',
    businessImpact: 'Reduces Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR) during active cyber incidents, cutting investigation costs.',
    awsBestPractice: 'Partition log files by year, month, and day in S3 to minimize data scanned and query execution time in Athena.'
  },
  {
    id: 'mon-q06',
    difficulty: 'Beginner',
    category: 'Event Routing',
    topicId: 'eventbridge-automation',
    topicTitle: 'EventBridge & Automated Response',
    question: 'Which AWS service acts as the central event bus for detecting security state changes (such as GuardDuty findings or Config compliance failures) and routing them to automated remediation handlers?',
    options: [
      'Amazon Route 53.',
      'Amazon EventBridge (formerly CloudWatch Events).',
      'AWS Direct Connect.',
      'Amazon Glacier.'
    ],
    correctAnswer: 'Amazon EventBridge (formerly CloudWatch Events).',
    explanation: 'EventBridge routes structured JSON event patterns from AWS services, SaaS partners, and custom applications to targets like AWS Lambda, Step Functions, or SNS topics for automated notification and response.',
    engineerReasoning: 'Decouples security monitoring from remediation logic, allowing event-driven automated containment within seconds of an alert.',
    businessImpact: 'Enables sub-minute automated response, preventing automated ransomware scripts from completing encryption or exfiltration.',
    awsBestPractice: 'Use dead-letter queues (DLQs) on EventBridge rules to ensure failed automated remediation invocations are logged and alerted.'
  },
  {
    id: 'mon-q07',
    difficulty: 'Intermediate',
    category: 'Log Integrity',
    topicId: 'cloudtrail-deep-dive',
    topicTitle: 'CloudTrail Deep Dive',
    question: 'How does AWS CloudTrail Log File Validation enable security teams to prove in a court of law that log files were not modified, deleted, or forged after delivery?',
    options: [
      'By printing paper receipts for every API request.',
      'By generating cryptographic SHA-256 digests and digital signatures for every log file delivered, stored in a digest file signed with an AWS private RSA key.',
      'By deleting logs immediately after they are read.',
      'By restricting console access to administrators only.'
    ],
    correctAnswer: 'By generating cryptographic SHA-256 digests and digital signatures for every log file delivered, stored in a digest file signed with an AWS private RSA key.',
    explanation: 'Log File Validation creates a digest file every hour containing the SHA-256 hash of each delivered log file. It chains digests together cryptographically, so any tampering, deletion, or modification of a log file invalidates the hash chain.',
    engineerReasoning: 'Attackers who gain administrative access often attempt to edit or delete CloudTrail logs to hide their tracks. Log file validation mathematically proves log integrity.',
    businessImpact: 'Provides admissible forensic evidence for law enforcement, insurance claims, and regulatory breach reporting.',
    awsBestPractice: 'Enable Log File Validation on all trails and run `aws cloudtrail validate-logs` regularly to verify integrity.'
  },
  {
    id: 'mon-q08',
    difficulty: 'Intermediate',
    category: 'CloudTrail Event Types',
    topicId: 'cloudtrail-deep-dive',
    topicTitle: 'CloudTrail Deep Dive',
    question: 'Why are CloudTrail S3 Data Events (such as `GetObject` and `PutObject`) not enabled by default on standard management trails?',
    options: [
      'Because AWS does not support logging S3 API operations.',
      'Because Data Events generate massive volume (billions of API calls) and incur substantial additional CloudTrail ingestion and S3 storage costs.',
      'Because S3 data events are encrypted with keys that CloudTrail cannot read.',
      'Because S3 buckets automatically block CloudTrail.'
    ],
    correctAnswer: 'Because Data Events generate massive volume (billions of API calls) and incur substantial additional CloudTrail ingestion and S3 storage costs.',
    explanation: 'Management events log control plane operations (`CreateBucket`, `PutBucketPolicy`). Data events log high-frequency object operations (`GetObject`, `PutObject`). Enabling data events across all buckets without filtering can lead to unexpected monthly bill spikes.',
    engineerReasoning: 'Security engineers must be cost-aware: enable S3 Data Events specifically for sensitive buckets (e.g., PII, financial ledgers, code repositories) using advanced event selectors.',
    businessImpact: 'Prevents thousands of dollars in surprise logging bills while maintaining strict compliance for high-value data assets.',
    awsBestPractice: 'Use CloudTrail Advanced Event Selectors to selectively log data events only for sensitive S3 bucket prefixes or specific IAM roles.'
  },
  {
    id: 'mon-q09',
    difficulty: 'Intermediate',
    category: 'CloudWatch Metric Filters',
    topicId: 'cloudwatch-alarms-metrics',
    topicTitle: 'CloudWatch Alarms & Metrics',
    question: 'To generate a CloudWatch alarm whenever the AWS Root Account is used, which metric filter pattern syntax should be applied to the CloudTrail log group?',
    options: [
      '`{ $.errorCode = "*Unauthorized*" }`',
      '`{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }`',
      '`SELECT * FROM CloudTrail WHERE user = "admin"`',
      '`{ $.eventName = "ConsoleLogin" }`'
    ],
    correctAnswer: '`{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }`',
    explanation: 'This metric filter pattern matches actions performed directly by the root user identity while excluding internal AWS service actions invoked on root behalf, triggering an alert on human root usage.',
    engineerReasoning: 'Root account access should occur strictly for break-glass emergency procedures. Any root activity warrants immediate SecOps investigation.',
    businessImpact: 'Detects root credential compromise immediately, before attackers can delete the AWS account or ransom corporate infrastructure.',
    awsBestPractice: 'Wire this CloudWatch alarm to Amazon SNS to notify the Chief Information Security Officer (CISO) and on-call SecOps pager.'
  },
  {
    id: 'mon-q10',
    difficulty: 'Intermediate',
    category: 'GuardDuty Finding Triage',
    topicId: 'guardduty-threat-detection',
    topicTitle: 'Amazon GuardDuty',
    question: 'A GuardDuty finding states: `CryptoCurrency:EC2/BitcoinTool.B!DNS`. What does this specific finding mean, and what is the underlying threat?',
    options: [
      'The AWS billing department has accepted payment in Bitcoin.',
      'An EC2 instance made DNS queries associated with cryptocurrency mining software or mining pools, indicating unauthorized instance compromise.',
      'The EC2 instance has upgraded its operating system kernel.',
      'An administrator purchased an EC2 Reserved Instance.'
    ],
    correctAnswer: 'An EC2 instance made DNS queries associated with cryptocurrency mining software or mining pools, indicating unauthorized instance compromise.',
    explanation: 'GuardDuty detected DNS requests from an EC2 instance resolving known Bitcoin or Monero mining pool domains. Attackers frequently deploy cryptominers after gaining initial access via exposed SSH or unpatched web applications.',
    engineerReasoning: 'Cryptomining is often a precursor to deeper ransomware or data exfiltration. The presence of miners proves that an external party has achieved remote command execution.',
    businessImpact: 'Cryptominers consume 100% CPU capacity, degrading business services and running up astronomical cloud compute bills.',
    awsBestPractice: 'Immediately isolate the EC2 instance using a quarantine Security Group, take an EBS snapshot for forensic analysis, and terminate the instance.'
  },
  {
    id: 'mon-q11',
    difficulty: 'Intermediate',
    category: 'Security Hub Consolidation',
    topicId: 'security-hub-config',
    topicTitle: 'Security Hub & AWS Config',
    question: 'What is the primary benefit of AWS Security Hub in a multi-account cloud environment?',
    options: [
      'It automatically grants root access to all employees.',
      'It aggregates, normalizes (into AWS Security Finding Format - ASFF), and prioritizes security findings from GuardDuty, Inspector, Macie, IAM Access Analyzer, and third-party tools into a single pane of glass.',
      'It installs physical locks on AWS server racks.',
      'It replaces all software firewalls with hardware cables.'
    ],
    correctAnswer: 'It aggregates, normalizes (into AWS Security Finding Format - ASFF), and prioritizes security findings from GuardDuty, Inspector, Macie, IAM Access Analyzer, and third-party tools into a single pane of glass.',
    explanation: 'Without Security Hub, security teams must inspect dozens of disparate consoles across hundreds of accounts. Security Hub standardizes alerts into ASFF JSON, correlates them, and measures compliance against CIS and NIST standards.',
    engineerReasoning: 'Alert fatigue is a major cause of security blind spots. Security Hub provides centralized triage and scorecards across entire AWS Organizations.',
    businessImpact: 'Reduces operational overhead and ensures executive visibility into company-wide cybersecurity compliance posture.',
    awsBestPractice: 'Designate a central delegated administrator account for Security Hub and enable cross-region finding aggregation.'
  },
  {
    id: 'mon-q12',
    difficulty: 'Intermediate',
    category: 'S3 Log Storage Security',
    topicId: 'cloudtrail-deep-dive',
    topicTitle: 'CloudTrail Deep Dive',
    question: 'To protect the central S3 bucket receiving CloudTrail logs from being tampered with or deleted by a rogue cloud administrator, which security controls MUST be implemented?',
    options: [
      'Share the S3 bucket link in public Slack channels.',
      'Store logs in a dedicated Security Audit account, apply S3 Object Lock in Compliance Mode, enforce SSE-KMS with a KMS key policy restricting deletion, and apply an SCP blocking `s3:DeleteBucket` and `cloudtrail:StopLogging`.',
      'Disable S3 versioning to save disk space.',
      'Set the bucket ACL to Public Read/Write.'
    ],
    correctAnswer: 'Store logs in a dedicated Security Audit account, apply S3 Object Lock in Compliance Mode, enforce SSE-KMS with a KMS key policy restricting deletion, and apply an SCP blocking `s3:DeleteBucket` and `cloudtrail:StopLogging`.',
    explanation: 'S3 Object Lock in Compliance Mode prevents even the root user from deleting objects before the retention period expires. Segregating logs in a dedicated security account protected by SCPs prevents compromised member account admins from tampering with logs.',
    engineerReasoning: 'Separation of duties: workload administrators must not have the ability to modify or delete the audit trail recording their own actions.',
    businessImpact: 'Guarantees compliance with SEC Rule 17a-4 (WORM storage) and ensures unalterable forensic evidence during litigation.',
    awsBestPractice: 'Use KMS customer-managed keys (CMK) with strict key policies that grant CloudTrail write access while forbidding `kms:ScheduleKeyDeletion` to standard admins.'
  },
  {
    id: 'mon-q13',
    difficulty: 'Intermediate',
    category: 'VPC Flow Log Analysis with Athena',
    topicId: 'athena-log-analysis',
    topicTitle: 'Athena Log Analysis',
    question: 'An engineer suspects that an EC2 instance (`10.0.2.45`) was port-scanned from the internet. Which Athena SQL query structure will identify rejected inbound connection attempts to that instance?',
    options: [
      '`SELECT * FROM vpc_flow_logs WHERE dstaddr = "10.0.2.45" AND action = "REJECT" ORDER BY starttime DESC LIMIT 100;`',
      '`DELETE FROM vpc_flow_logs WHERE ip = "10.0.2.45";`',
      '`UPDATE ec2_instances SET status = "clean" WHERE ip = "10.0.2.45";`',
      '`SELECT password FROM users WHERE ip = "10.0.2.45";`'
    ],
    correctAnswer: '`SELECT * FROM vpc_flow_logs WHERE dstaddr = "10.0.2.45" AND action = "REJECT" ORDER BY starttime DESC LIMIT 100;`',
    explanation: 'In VPC flow logs, `dstaddr` represents the destination IP (the EC2 instance), and `action = "REJECT"` indicates packets blocked by Security Groups or NACLs. Sorting by start time reveals the most recent scans.',
    engineerReasoning: 'Analyzing REJECT patterns reveals source IPs, targeted port ranges (e.g. 22, 3389, 445), and the scale of reconnaissance activity against internal systems.',
    businessImpact: 'Enables proactive threat blocking before attackers locate an unhardened, allowed port.',
    awsBestPractice: 'Automate Athena queries via AWS Lambda or Amazon QuickSight dashboards for continuous threat visibility.'
  },
  {
    id: 'mon-q14',
    difficulty: 'Intermediate',
    category: 'Automated Remediation',
    topicId: 'eventbridge-automation',
    topicTitle: 'EventBridge & Automated Response',
    question: 'When AWS Config flags an Amazon S3 bucket as non-compliant with the `s3-bucket-level-public-access-prohibited` rule, how can security teams remediate it automatically?',
    options: [
      'Call AWS support on the phone.',
      'Configure an AWS Config Automatic Remediation action backed by an AWS Systems Manager (SSM) Automation Document (e.g., `AWS-DisableS3BucketPublicReadWrite`).',
      'Delete the entire AWS account.',
      'Reboot the S3 service.'
    ],
    correctAnswer: 'Configure an AWS Config Automatic Remediation action backed by an AWS Systems Manager (SSM) Automation Document (e.g., `AWS-DisableS3BucketPublicReadWrite`).',
    explanation: 'AWS Config remediation links compliance rules directly to SSM Automation runbooks. When a bucket fails compliance, Config executes the runbook automatically, applying Public Access Block within seconds.',
    engineerReasoning: 'Automated remediation closes security gaps instantly without waiting for human intervention or manual tickets.',
    businessImpact: 'Drastically reduces public exposure dwell time from days or weeks to under 30 seconds, preventing data leaks.',
    awsBestPractice: 'Test remediation runbooks in staging first to ensure automated actions do not break legitimate business workloads.'
  },
  {
    id: 'mon-q15',
    difficulty: 'Advanced',
    category: 'CloudTrail Insights',
    topicId: 'cloudtrail-deep-dive',
    topicTitle: 'CloudTrail Deep Dive',
    question: 'What type of security anomalies does AWS CloudTrail Insights detect that standard CloudTrail logging cannot identify on its own?',
    options: [
      'Vulnerabilities in Python code.',
      'Unusual spikes or statistical deviations in write management API call volumes or error rates (e.g. sudden surge in `AccessDenied` or `TerminateInstances` calls).',
      'Physical tampering with AWS data center hardware.',
      'Phishing emails received by employees.'
    ],
    correctAnswer: 'Unusual spikes or statistical deviations in write management API call volumes or error rates (e.g. sudden surge in `AccessDenied` or `TerminateInstances` calls).',
    explanation: 'CloudTrail Insights establishes mathematical baselines of normal API activity. When API call volumes or error rates spike abnormally (such as an attacker running enumeration scripts generating thousands of `AccessDenied` errors), Insights generates an anomaly event.',
    engineerReasoning: 'Attackers testing stolen credentials generate high error volumes. CloudTrail Insights surfaces this anomaly without requiring manual threshold tuning.',
    businessImpact: 'Detects active credential enumeration and reconnaissance in early attack stages before data is exfiltrated.',
    awsBestPractice: 'Enable CloudTrail Insights on all management trails and route insight events to your SecOps notification channel.'
  },
  {
    id: 'mon-q16',
    difficulty: 'Advanced',
    category: 'GuardDuty S3 & EKS Protection',
    topicId: 'guardduty-threat-detection',
    topicTitle: 'Amazon GuardDuty',
    question: 'How does Amazon GuardDuty EKS Protection detect malicious behavior inside containerized Kubernetes workloads?',
    options: [
      'By terminating the EKS cluster every night.',
      'By analyzing Amazon EKS audit logs and monitoring operating system runtime events (process executions, file access, and network sockets) via the lightweight GuardDuty security agent.',
      'By blocking all Docker images.',
      'By reading GitHub pull requests.'
    ],
    correctAnswer: 'By analyzing Amazon EKS audit logs and monitoring operating system runtime events (process executions, file access, and network sockets) via the lightweight GuardDuty security agent.',
    explanation: 'GuardDuty combines Kubernetes control plane audit log analysis with runtime eBPF agent monitoring on EKS nodes, detecting container escapes, privilege escalation, unauthorized process execution, and reverse shells inside containers.',
    engineerReasoning: 'Control plane logs miss in-container activity. Runtime monitoring provides visibility into what executables are running inside pods.',
    businessImpact: 'Prevents containerized supply-chain attacks and runtime compromises in enterprise microservices architectures.',
    awsBestPractice: 'Enable GuardDuty EKS Runtime Monitoring across all production EKS clusters via the EKS add-on.'
  },
  {
    id: 'mon-q17',
    difficulty: 'Advanced',
    category: 'Composite Alarms',
    topicId: 'cloudwatch-alarms-metrics',
    topicTitle: 'CloudWatch Alarms & Metrics',
    question: 'Why are CloudWatch Composite Alarms superior to individual metric alarms for critical enterprise security alerting?',
    options: [
      'They cost 90% less than regular alarms.',
      'They combine multiple underlying alarms using boolean logic (`ALARM("HighErrorRate") AND ALARM("UnusualEgressVolume")`), reducing alert noise and triggering only when true correlated multi-factor incidents occur.',
      'They automatically write incident post-mortems in Microsoft Word.',
      'They disable all cloud firewalls during maintenance.'
    ],
    correctAnswer: 'They combine multiple underlying alarms using boolean logic (`ALARM("HighErrorRate") AND ALARM("UnusualEgressVolume")`), reducing alert noise and triggering only when true correlated multi-factor incidents occur.',
    explanation: 'Composite Alarms evaluate rule expressions across multiple child alarms. This prevents on-call fatigue by suppressing isolated, harmless metric blips and alerting only when correlated anomalies occur simultaneously.',
    engineerReasoning: 'Reduces on-call alert fatigue. A high CPU alarm alone might be a batch job; high CPU coupled with unexpected network egress to an untrusted IP indicates an active threat.',
    businessImpact: 'Improves SOC team focus and response times by ensuring engineers only wake up for genuine, multi-symptom critical incidents.',
    awsBestPractice: 'Use composite alarms to represent complex health and security states across microservice boundaries.'
  },
  {
    id: 'mon-q18',
    difficulty: 'Advanced',
    category: 'Athena Partition Projection',
    topicId: 'athena-log-analysis',
    topicTitle: 'Athena Log Analysis',
    question: 'When querying multi-terabyte CloudTrail or VPC Flow Logs in Amazon Athena, why is "Partition Projection" recommended over traditional `MSCK REPAIR TABLE` or AWS Glue partition crawlers?',
    options: [
      'It deletes older log files automatically.',
      'It avoids expensive S3 metadata listings by calculating partition paths mathematically based on pre-configured rules, preventing query timeouts and reducing query planning time from minutes to milliseconds.',
      'It converts SQL queries into Python code.',
      'It encrypts data with unreadable passwords.'
    ],
    correctAnswer: 'It avoids expensive S3 metadata listings by calculating partition paths mathematically based on pre-configured rules, preventing query timeouts and reducing query planning time from minutes to milliseconds.',
    explanation: 'Glue crawlers and `MSCK REPAIR TABLE` make thousands of S3 ListBucket API calls to discover partitions, which times out on massive datasets. Partition projection calculates date and account partition paths algorithmically in memory.',
    engineerReasoning: 'Critical for high-speed incident response: when investigating an active breach, waiting 20 minutes for a table repair before running a query is unacceptable.',
    businessImpact: 'Saves investigation time during crises and avoids AWS Glue crawler costs.',
    awsBestPractice: 'Configure partition projection on Athena CloudTrail and Flow Log tables using table properties `projection.timestamp.type = "date"`.'
  },
  {
    id: 'mon-q19',
    difficulty: 'Advanced',
    category: 'Cross-Account Central Logging',
    topicId: 'cloudtrail-deep-dive',
    topicTitle: 'CloudTrail Deep Dive',
    question: 'In an AWS Organizations multi-account structure, how does an Organization Trail guarantee centralized governance across all present and future accounts?',
    options: [
      'By sharing the management account password with all users.',
      'An Organization Trail is created in the management account (or delegated administrator); it automatically applies to all member accounts, logs all activity to a central bucket, and member account admins cannot modify or delete it.',
      'It forces all member accounts to use the same VPC.',
      'It copies all application code into a central zip file.'
    ],
    correctAnswer: 'An Organization Trail is created in the management account (or delegated administrator); it automatically applies to all member accounts, logs all activity to a central bucket, and member account admins cannot modify or delete it.',
    explanation: 'Member accounts automatically inherit the Organization Trail. Even root users or full administrators in member accounts cannot stop the trail, delete log files, or alter configuration.',
    engineerReasoning: 'Eliminates rogue or unmonitored accounts. Newly created or invited accounts are automatically enrolled in central audit logging with zero manual steps.',
    businessImpact: 'Guarantees 100% compliance coverage across dynamic corporate cloud footprints and prevents insider rogue account creation.',
    awsBestPractice: 'Delegate CloudTrail administration to a dedicated Security Tooling account to avoid operating from the AWS Organization root management account.'
  },
  {
    id: 'mon-q20',
    difficulty: 'Advanced',
    category: 'CloudWatch Logs Insights Queries',
    topicId: 'cloudwatch-alarms-metrics',
    topicTitle: 'CloudWatch Alarms & Metrics',
    question: 'Which CloudWatch Logs Insights query efficiently identifies the top 10 IAM users generating `AccessDenied` errors in CloudTrail logs over the last 24 hours?',
    options: [
      '`fields @timestamp, @message | filter errorCode = "AccessDenied" | stats count(*) as errorCount by userIdentity.arn | sort errorCount desc | limit 10`',
      '`SELECT * FROM logs WHERE status = "denied"`',
      '`grep "AccessDenied" /var/log/cloudtrail.log | head -n 10`',
      '`DROP TABLE cloudtrail_errors;`'
    ],
    correctAnswer: '`fields @timestamp, @message | filter errorCode = "AccessDenied" | stats count(*) as errorCount by userIdentity.arn | sort errorCount desc | limit 10`',
    explanation: 'CloudWatch Logs Insights syntax uses pipeline operators. Filtering by `errorCode = "AccessDenied"` and aggregating with `stats count(*) by userIdentity.arn` groups errors by IAM identity to pinpoint anomalous actors.',
    engineerReasoning: 'Enables rapid identification of misconfigured services or compromised identities conducting brute-force privilege escalation attempts.',
    businessImpact: 'Pinpoints malfunctioning production microservices or active attackers before operational failure occurs.',
    awsBestPractice: 'Save frequently used threat hunting queries as CloudWatch Insights Saved Queries for fast access during incident triage.'
  },
  {
    id: 'mon-q21',
    difficulty: 'Advanced',
    category: 'Security Hub Custom Actions',
    topicId: 'security-hub-config',
    topicTitle: 'Security Hub & AWS Config',
    question: 'How do Security Hub "Custom Actions" bridge the gap between human analyst decision-making and automated cloud response?',
    options: [
      'They allow analysts to manually delete customer accounts.',
      'They allow a SOC analyst to select one or more findings in the console and click a custom action button, which emits an event to EventBridge to trigger a specific containment runbook (e.g. isolate host, revoke credentials).',
      'They print finding summaries to a local office printer.',
      'They convert findings into social media posts.'
    ],
    correctAnswer: 'They allow a SOC analyst to select one or more findings in the console and click a custom action button, which emits an event to EventBridge to trigger a specific containment runbook (e.g. isolate host, revoke credentials).',
    explanation: 'Custom actions provide "human-in-the-loop" automation: the analyst reviews the evidence, confirms it is not a false positive, and triggers pre-approved automation with a single click.',
    engineerReasoning: 'Full automation carries risk of breaking production. Human-in-the-loop custom actions provide rapid automated execution with human judgment safeguarding availability.',
    businessImpact: 'Reduces containment time from hours to seconds while preventing accidental self-inflicted business outages.',
    awsBestPractice: 'Create custom actions for "Quarantine EC2 Instance", "Revoke Active IAM Sessions", and "Enforce S3 Bucket Private".'
  },
  {
    id: 'mon-q22',
    difficulty: 'Advanced',
    category: 'EventBridge Dead-Letter Queues (DLQs)',
    topicId: 'eventbridge-automation',
    topicTitle: 'EventBridge & Automated Response',
    question: 'In an automated incident response pipeline, why is it critical to attach an Amazon SQS Dead-Letter Queue (DLQ) to EventBridge rules targeting Lambda functions?',
    options: [
      'To increase Lambda function execution memory.',
      'To capture security events if the remediation Lambda fails (e.g. due to concurrency limits, timeouts, or IAM errors), ensuring critical security events are not silently dropped.',
      'To encrypt EventBridge payloads using AES-128.',
      'To bypass AWS CloudTrail logging.'
    ],
    correctAnswer: 'To capture security events if the remediation Lambda fails (e.g. due to concurrency limits, timeouts, or IAM errors), ensuring critical security events are not silently dropped.',
    explanation: 'If a Lambda target is throttled or errors out, EventBridge retries for 24 hours. Without a DLQ, events that fail all retries are permanently lost, leaving security incidents unhandled.',
    engineerReasoning: 'Resilient architecture mandates zero silent failures in security alerting and response pipelines.',
    businessImpact: 'Prevents security blind spots where critical alerts fail to execute remediation without anyone knowing.',
    awsBestPractice: 'Configure DLQs on all security-critical EventBridge rules and create a CloudWatch alarm on the DLQ `ApproximateNumberOfMessagesVisible` metric.'
  },
  {
    id: 'mon-q23',
    difficulty: 'Engineer Level',
    category: 'Advanced Threat Hunting Architecture',
    topicId: 'athena-log-analysis',
    topicTitle: 'Athena Log Analysis',
    question: 'During a major security breach, an attacker modified CloudTrail settings in multiple accounts. As the Lead Security Engineer, what forensic strategy allows you to reconstruct the timeline even if the attacker deleted local CloudWatch log groups?',
    options: [
      'Reboot the AWS management console.',
      'Query the centralized immutable S3 audit bucket in the Security Account using Athena, cross-referencing S3 Server Access Logs, CloudTrail digest files, and VPC Flow Logs across all regions.',
      'Ask the attacker to provide their terminal history.',
      'Rely on local bash history on the instances.'
    ],
    correctAnswer: 'Query the centralized immutable S3 audit bucket in the Security Account using Athena, cross-referencing S3 Server Access Logs, CloudTrail digest files, and VPC Flow Logs across all regions.',
    explanation: 'Because the central security account has isolated credentials and S3 Object Lock, the attacker cannot alter logs in that account. Correlating multiple independent log streams (S3 access logs, CloudTrail, Flow Logs) reconstructs the exact timeline.',
    engineerReasoning: 'Correlating disparate telemetry sources provides non-repudiation and uncovers attacker actions across the entire kill chain.',
    businessImpact: 'Enables accurate root-cause analysis, satisfies mandatory breach reporting deadlines (GDPR 72-hour notification), and guides recovery.',
    awsBestPractice: 'Never store security logs in the same AWS account where workloads reside; always replicate to a dedicated, restricted-access logging account.'
  },
  {
    id: 'mon-q24',
    difficulty: 'Engineer Level',
    category: 'GuardDuty Malware Protection',
    topicId: 'guardduty-threat-detection',
    topicTitle: 'Amazon GuardDuty',
    question: 'How does Amazon GuardDuty Malware Protection initiate agentless scanning of an EC2 instance or container when suspicious activity is detected?',
    options: [
      'By logging into the instance via SSH and running antivirus.',
      'It creates an Amazon EBS snapshot of the affected instance root volume, creates a replica volume in a service-managed AWS account, attaches it to an isolated scanner, and inspects files for trojans and rootkits without impacting the production workload.',
      'By uploading the entire instance RAM to public GitHub.',
      'By turning off the instance power supply.'
    ],
    correctAnswer: 'It creates an Amazon EBS snapshot of the affected instance root volume, creates a replica volume in a service-managed AWS account, attaches it to an isolated scanner, and inspects files for trojans and rootkits without impacting the production workload.',
    explanation: 'GuardDuty takes an EBS snapshot and replicates it into an isolated AWS sandbox environment to run file-system malware analysis. The production workload suffers zero CPU degradation or agent overhead.',
    engineerReasoning: 'Preserves the integrity of the live instance while safely performing deep signature and heuristic malware scanning off-host.',
    businessImpact: 'Quickly identifies whether an alert was triggered by actual malware binaries or legitimate developer tooling, preventing costly false-alarm shut-downs.',
    awsBestPractice: 'Enable GuardDuty Malware Protection for EC2 and S3, and configure automated snapshot retention policies for forensic preservation.'
  },
  {
    id: 'mon-q25',
    difficulty: 'Engineer Level',
    category: 'AWS Config Custom Rules with Lambda',
    topicId: 'security-hub-config',
    topicTitle: 'Security Hub & AWS Config',
    question: 'An enterprise mandates that any IAM Policy granting wildcard `"*"` actions on KMS keys must be flagged as non-compliant immediately. Managed Config rules do not cover this specific edge-case. How should this be implemented?',
    options: [
      'Manually read all IAM policies every Friday afternoon.',
      'Develop an AWS Config Custom Rule backed by an AWS Lambda function that parses the policy JSON, evaluates the `Action` and `Resource` elements, and returns `COMPLIANT` or `NON_COMPLIANT` via `PutEvaluations`.',
      'Disable AWS KMS across all regions.',
      'Ask developers to sign an honor code.'
    ],
    correctAnswer: 'Develop an AWS Config Custom Rule backed by an AWS Lambda function that parses the policy JSON, evaluates the `Action` and `Resource` elements, and returns `COMPLIANT` or `NON_COMPLIANT` via `PutEvaluations`.',
    explanation: 'AWS Config Custom Rules allow security teams to write arbitrary compliance logic in Python/Node.js Lambdas triggered either by configuration changes or on a recurring periodic schedule.',
    engineerReasoning: 'Managed rules cover standard baselines, but custom business logic, proprietary naming conventions, and complex policy evaluations require custom rule engines.',
    businessImpact: 'Automates governance for high-risk assets, ensuring that unique organizational security policies are enforced continuously.',
    awsBestPractice: 'Use the AWS Config Rule Development Kit (RDK) to author, test, and deploy custom rules with Infrastructure-as-Code.'
  },
  {
    id: 'mon-q26',
    difficulty: 'Engineer Level',
    category: 'CloudTrail Tamper Detection & Tripwires',
    topicId: 'cloudtrail-deep-dive',
    topicTitle: 'CloudTrail Deep Dive',
    question: 'An attacker gains administrative access and attempts to evade detection by running `aws cloudtrail stop-logging --name production-trail`. How can you design a tripwire that fires instantly and prevents the command from succeeding?',
    options: [
      'CloudTrail cannot be protected from administrators.',
      'Apply an AWS Organizations Service Control Policy (SCP) denying `cloudtrail:StopLogging`, `cloudtrail:DeleteTrail`, and `cloudtrail:UpdateTrail` across all member accounts, and create an EventBridge rule alerting on any attempt to execute these APIs.',
      'Change the AWS root password every hour.',
      'Disable the AWS Command Line Interface.'
    ],
    correctAnswer: 'Apply an AWS Organizations Service Control Policy (SCP) denying `cloudtrail:StopLogging`, `cloudtrail:DeleteTrail`, and `cloudtrail:UpdateTrail` across all member accounts, and create an EventBridge rule alerting on any attempt to execute these APIs.',
    explanation: 'An SCP establishes an immutable guardrail: even if an attacker has AdministratorAccess or root credentials in the member account, the SCP blocks the action at the AWS evaluation engine level, generating an AccessDenied event.',
    engineerReasoning: 'Guardrails must be enforced above the account level. SCPs cannot be overridden by any identity within member accounts.',
    businessImpact: 'Prevents sophisticated threat actors from blinding enterprise security monitoring before staging an attack.',
    awsBestPractice: 'Enforce baseline security SCPs across all organizational units (OUs) to protect CloudTrail, Config, GuardDuty, and Security Hub from local tampering.'
  },
  {
    id: 'mon-q27',
    difficulty: 'Engineer Level',
    category: 'VPC Flow Log Enrichment',
    topicId: 'athena-log-analysis',
    topicTitle: 'Athena Log Analysis',
    question: 'How does creating a custom VPC Flow Log format with fields like `pkt-srcaddr`, `pkt-dstaddr`, `flow-direction`, and `traffic-path` improve security analysis compared to the default 14-field format?',
    options: [
      'It makes log files smaller by removing IP addresses.',
      'It captures the original packet IPs before NAT traversal, indicates whether traffic is ingress or egress, and reveals whether traffic passed through an Internet Gateway, NAT Gateway, or VPC Peering.',
      'It encrypts packets using quantum computing algorithms.',
      'It replaces the need for an AWS Network Firewall.'
    ],
    correctAnswer: 'It captures the original packet IPs before NAT traversal, indicates whether traffic is ingress or egress, and reveals whether traffic passed through an Internet Gateway, NAT Gateway, or VPC Peering.',
    explanation: 'The default format masks original client IPs when traffic passes through load balancers or NAT gateways. Custom fields like `pkt-srcaddr` preserve the true source IP, and `traffic-path` shows the exact routing hops.',
    engineerReasoning: 'Crucial for forensic attribution. Default flow logs can make all external attacks appear as if they originated from the internal NAT Gateway IP.',
    businessImpact: 'Eliminates ambiguity during breach investigations, enabling rapid identification of external threat actor IP infrastructure.',
    awsBestPractice: 'Configure custom flow log formats on all VPCs to capture `pkt-srcaddr`, `pkt-dstaddr`, `flow-direction`, and `tcp-flags`.'
  },
  {
    id: 'mon-q28',
    difficulty: 'Engineer Level',
    category: 'SIEM Integration & Cross-Account Streaming',
    topicId: 'eventbridge-automation',
    topicTitle: 'EventBridge & Automated Response',
    question: 'To stream real-time CloudWatch Logs from 100 spoke AWS accounts into a centralized Amazon OpenSearch Service cluster or third-party SIEM (Splunk/Datadog) in a Security Account, which architecture is most resilient and cost-effective?',
    options: [
      'Install custom cron jobs on every EC2 instance that curl logs over public internet.',
      'Use Amazon CloudWatch Logs subscription filters configured with cross-account Amazon Kinesis Data Streams or Kinesis Data Firehose, delivering batches to S3 and OpenSearch with automatic backpressure handling.',
      'Export logs to CSV files manually every morning.',
      'Send log files via email attachments.'
    ],
    correctAnswer: 'Use Amazon CloudWatch Logs subscription filters configured with cross-account Amazon Kinesis Data Streams or Kinesis Data Firehose, delivering batches to S3 and OpenSearch with automatic backpressure handling.',
    explanation: 'CloudWatch subscription filters push log events in near-real-time to Kinesis Data Streams/Firehose across account boundaries. Kinesis handles high throughput, buffering, retries, and batching before ingestion into the SIEM.',
    engineerReasoning: 'Scalable and decoupled: handles millions of events per second during attack spikes without dropping data or overwhelming downstream SIEM indexers.',
    businessImpact: 'Ensures continuous real-time threat detection and visibility across the entire enterprise with minimal infrastructure maintenance.',
    awsBestPractice: 'Use Kinesis Data Firehose with GZIP compression and S3 backup for failed index records to prevent log loss.'
  },
  {
    id: 'mon-q29',
    difficulty: 'Engineer Level',
    category: 'Security Hub ASFF Automation',
    topicId: 'security-hub-config',
    topicTitle: 'Security Hub & AWS Config',
    question: 'When parsing AWS Security Finding Format (ASFF) JSON payloads in an automated incident response Lambda, which attribute should you check to verify the severity of the finding in a normalized manner across different security tools?',
    options: [
      '`finding.ImportanceScore`',
      '`finding.Severity.Label` (which normalizes severity into `INFORMATIONAL`, `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`)',
      '`finding.ColorCode`',
      '`finding.UrgencyTag`'
    ],
    correctAnswer: '`finding.Severity.Label` (which normalizes severity into `INFORMATIONAL`, `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`)',
    explanation: 'ASFF normalizes diverse vendor ratings into a unified schema: `Severity.Label` provides standard categories (`INFORMATIONAL`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and `Severity.Normalized` provides an integer score (0-100).',
    engineerReasoning: 'Standardizing severity enables unified routing rules: e.g., page the on-call engineer for `CRITICAL`, create a Jira ticket for `MEDIUM`, and archive `LOW`.',
    businessImpact: 'Eliminates tool-specific triage logic, reducing engineering maintenance and preventing high-severity alerts from being misrouted.',
    awsBestPractice: 'Filter EventBridge rules on `detail.findings.Severity.Label = ["CRITICAL", "HIGH"]` for emergency escalation workflows.'
  },
  {
    id: 'mon-q30',
    difficulty: 'Engineer Level',
    category: 'CloudTrail Lake & SQL Auditing',
    topicId: 'cloudtrail-deep-dive',
    topicTitle: 'CloudTrail Deep Dive',
    question: 'What is the primary architectural advantage of AWS CloudTrail Lake compared to the traditional architecture of CloudTrail delivering to S3 + Athena + Glue Crawler?',
    options: [
      'CloudTrail Lake is a fully managed, immutable data lake that ingests, optimizes, indexes, and retains audit logs with built-in SQL query capabilities, eliminating the need to manage S3 buckets, Glue tables, partition schemas, or KMS key policies.',
      'CloudTrail Lake can only store logs for 30 minutes.',
      'CloudTrail Lake allows users to edit historical log entries.',
      'CloudTrail Lake operates exclusively on mobile devices.'
    ],
    correctAnswer: 'CloudTrail Lake is a fully managed, immutable data lake that ingests, optimizes, indexes, and retains audit logs with built-in SQL query capabilities, eliminating the need to manage S3 buckets, Glue tables, partition schemas, or KMS key policies.',
    explanation: 'CloudTrail Lake unifies log collection, storage, and SQL querying into a single native service. It handles ingestion, indexing, tamper-proof storage up to 7 years, and query execution without manual Glue crawlers or Athena setup.',
    engineerReasoning: 'Greatly simplifies multi-account log architectures and prevents partition drift or query failures caused by malformed log files.',
    businessImpact: 'Lowers operational maintenance overhead and guarantees out-of-the-box audit compliance with predictable pricing.',
    awsBestPractice: 'Use CloudTrail Lake event data stores to aggregate logs across AWS Organizations and integrate external audit sources via CloudTrail Lake integrations.'
  }
]
