// Incident Response Question Bank: 30 High-Yield Cloud Security Questions
// Classified into Beginner, Intermediate, Advanced, and Engineer Level

export const incidentResponseQuestionBank = [
  {
    id: 'ir-q01',
    difficulty: 'Beginner',
    category: 'Incident Response Lifecycle',
    topicId: 'incident-lifecycle-frameworks',
    topicTitle: 'Incident Response Lifecycle',
    question: 'According to the NIST SP 800-61 and AWS Incident Response frameworks, what is the FIRST phase in the incident response lifecycle?',
    options: [
      'Containment, Eradication, and Recovery.',
      'Preparation (establishing response plans, pre-configuring tools, access, logging, and running game days).',
      'Calling law enforcement.',
      'Paying ransomware demands.'
    ],
    correctAnswer: 'Preparation (establishing response plans, pre-configuring tools, access, logging, and running game days).',
    explanation: 'Preparation is the foundational phase. You cannot effectively respond to an incident if audit logging is disabled, responders lack emergency credentials, or playbooks do not exist. Preparation ensures teams and tools are ready before an event occurs.',
    engineerReasoning: 'When an active breach occurs, it is too late to figure out how to take forensic snapshots or where CloudTrail logs are stored. Preparation defines success.',
    businessImpact: 'Organizations with well-prepared incident response capabilities reduce breach costs by an average of $2.6 million compared to unprepared organizations.',
    awsBestPractice: 'Pre-deploy security forensic tooling, pre-authorize incident response IAM roles, and conduct quarterly AWS GameDay simulations.'
  },
  {
    id: 'ir-q02',
    difficulty: 'Beginner',
    category: 'Containment Order of Operations',
    topicId: 'host-isolation-containment',
    topicTitle: 'Host Isolation & Containment',
    question: 'An on-call security engineer receives an alert that an EC2 instance is communicating with a known ransomware command-and-control server. What should the engineer do FIRST?',
    options: [
      'Immediately delete the EC2 instance and terminate the AWS account.',
      'Isolate the instance from the network using a quarantine Security Group to contain the blast radius while preserving volatile RAM and disk evidence for forensics.',
      'Send a company-wide email asking who owns the instance.',
      'Post about the incident on social media.'
    ],
    correctAnswer: 'Isolate the instance from the network using a quarantine Security Group to contain the blast radius while preserving volatile RAM and disk evidence for forensics.',
    explanation: 'Containment must precede investigation and eradication. Deleting the instance destroys volatile memory (RAM) and disk evidence, blinding forensic investigators to the root cause and preventing confirmation of whether data was stolen.',
    engineerReasoning: 'In live operations, containment stops the bleeding immediately. Preserving evidence allows responders to determine the initial access vector and full breach scope.',
    businessImpact: 'Prevents ransomware from spreading laterally across enterprise networks while preserving legally defensible forensic evidence.',
    awsBestPractice: 'Replace all attached Security Groups with an isolation Security Group that has zero inbound and zero outbound rules.'
  },
  {
    id: 'ir-q03',
    difficulty: 'Beginner',
    category: 'Compromised Credentials',
    topicId: 'credential-revocation-triage',
    topicTitle: 'Credential Revocation & Triage',
    question: 'A developer accidentally commits an active AWS IAM User Access Key ID and Secret Access Key to a public GitHub repository. What is the immediate containment action?',
    options: [
      'Ask GitHub to delete the commit and assume the key is safe.',
      'Immediately deactivate (or delete) the exposed access key via the AWS Management Console or AWS CLI (`aws iam update-access-key --status Inactive`).',
      'Reboot the developer laptop.',
      'Wait for the monthly billing cycle to review charges.'
    ],
    correctAnswer: 'Immediately deactivate (or delete) the exposed access key via the AWS Management Console or AWS CLI (`aws iam update-access-key --status Inactive`).',
    explanation: 'Automated threat bots scan public GitHub commits in under 60 seconds. Deactivating the key immediately invalidates its ability to make further AWS API calls. Git history deletions do not recall already-scraped keys.',
    engineerReasoning: 'Deactivation is immediate and reversible if needed during emergency triage, permanently closing the external access path.',
    businessImpact: 'Prevents attackers from spinning up hundreds of GPU instances for cryptomining, which can rack up over $50,000 in unauthorized charges within hours.',
    awsBestPractice: 'Deactivate the key immediately, review CloudTrail for all actions taken by that key, rotate credentials, and enable AWS Secrets Manager secret scanning.'
  },
  {
    id: 'ir-q04',
    difficulty: 'Beginner',
    category: 'Evidence Preservation',
    topicId: 'forensic-acquisition-ebs',
    topicTitle: 'Forensic Acquisition & EBS',
    question: 'What is the most effective AWS-native mechanism to preserve the complete disk state of an EC2 instance for forensic examination without altering the source volume?',
    options: [
      'Copy and paste files using Windows Explorer.',
      'Create an Amazon EBS Snapshot of all attached EBS volumes and tag it with incident metadata (`IncidentID`, `Timestamp`, `Evidence-Custodian`).',
      'Take a screenshot of the EC2 console.',
      'Print the bash history to paper.'
    ],
    correctAnswer: 'Create an Amazon EBS Snapshot of all attached EBS volumes and tag it with incident metadata (`IncidentID`, `Timestamp`, `Evidence-Custodian`).',
    explanation: 'EBS snapshots create point-in-time, block-level copies of the volume stored redundantly in S3. Responders can then mount a volume created from the snapshot in an isolated forensic VPC without modifying the original evidence.',
    engineerReasoning: 'Forensic integrity requires that the original evidence is never altered. Working exclusively on copies created from snapshots preserves chain of custody.',
    businessImpact: 'Maintains admissibility of digital evidence for criminal prosecution, insurance claims, and regulatory breach defense.',
    awsBestPractice: 'Copy the snapshot to an isolated Security Forensic AWS account and encrypt it with a dedicated KMS key restricted from workload administrators.'
  },
  {
    id: 'ir-q05',
    difficulty: 'Beginner',
    category: 'Post-Mortem & Blameless Culture',
    topicId: 'post-incident-post-mortem',
    topicTitle: 'Post-Incident Activity & Post-Mortems',
    question: 'What is the primary goal of conducting a "Blameless Post-Mortem" after a major cloud security incident?',
    options: [
      'To identify which employee made the mistake and terminate their employment.',
      'To understand the systemic, procedural, and technical root causes that allowed the incident to occur, and implement preventative engineering guardrails to ensure it never happens again.',
      'To hide the incident from company executives and customers.',
      'To celebrate the end of the work week.'
    ],
    correctAnswer: 'To understand the systemic, procedural, and technical root causes that allowed the incident to occur, and implement preventative engineering guardrails to ensure it never happens again.',
    explanation: 'Blameless post-mortems focus on process and technical failures, not individual human error. If an engineer pushed a public S3 bucket, the root cause is the lack of automated preventative guardrails (like S3 Block Public Access SCPs), not the human typing the command.',
    engineerReasoning: 'Punishing individuals encourages secrecy and hiding of future mistakes. Blameless culture encourages transparency and continuous technical hardening.',
    businessImpact: 'Transforms expensive security failures into permanent institutional resilience and improved security posture.',
    awsBestPractice: 'Document findings in a standardized Post-Incident Review (PIR) document and track corrective action items as high-priority engineering tickets.'
  },
  {
    id: 'ir-q06',
    difficulty: 'Beginner',
    category: 'Detection Alerts',
    topicId: 'cloudtrail-forensics-triage',
    topicTitle: 'CloudTrail Forensics & Triage',
    question: 'When investigating a suspected account compromise in AWS CloudTrail, which event field indicates whether an API call was made using temporary STS credentials versus long-lived IAM user credentials?',
    options: [
      '`recipientAccountId`',
      '`userIdentity.type` (e.g. `AssumedRole` indicates STS temporary credentials, while `IAMUser` indicates long-lived keys)',
      '`awsRegion`',
      '`eventVersion`'
    ],
    correctAnswer: '`userIdentity.type` (e.g. `AssumedRole` indicates STS temporary credentials, while `IAMUser` indicates long-lived keys)',
    explanation: 'The `userIdentity.type` field details the principal mechanism. An `AssumedRole` or `FederatedUser` indicates temporary STS sessions, whereas `IAMUser` indicates permanent credentials. The `accessKeyId` prefix also confirms this (`AKIA` for permanent, `ASIA` for temporary).',
    engineerReasoning: 'Knowing the credential type dictates the containment strategy: deactivating an IAM user key vs. revoking an active STS role session.',
    businessImpact: 'Prevents responders from applying ineffective containment actions that leave attacker sessions active.',
    awsBestPractice: 'Filter CloudTrail events in Athena by `userIdentity.type` and `userIdentity.arn` to trace session provenance.'
  },
  {
    id: 'ir-q07',
    difficulty: 'Intermediate',
    category: 'Revoking Active STS Sessions',
    topicId: 'credential-revocation-triage',
    topicTitle: 'Credential Revocation & Triage',
    question: 'An attacker has assumed an IAM Role and obtained temporary STS credentials valid for 12 hours. If you delete or modify the IAM role policy, previously issued temporary credentials REMAIN VALID until they expire. How do you immediately revoke ALL currently active STS sessions for that role?',
    options: [
      'Restart the AWS cloud region.',
      'Attach an inline policy to the role with `Effect: Deny`, `Action: *`, `Resource: *`, and a `Condition: { DateLessThan: { "aws:TokenIssueTime": "CURRENT_UTC_TIMESTAMP" } }`.',
      'Change the role description.',
      'Wait 12 hours for the credentials to expire naturally.'
    ],
    correctAnswer: 'Attach an inline policy to the role with `Effect: Deny`, `Action: *`, `Resource: *`, and a `Condition: { DateLessThan: { "aws:TokenIssueTime": "CURRENT_UTC_TIMESTAMP" } }`.',
    explanation: 'STS tokens are cryptographically signed and self-contained; AWS does not maintain an active session revocation list. The `aws:TokenIssueTime` condition explicitly denies any request made with a token issued before the specified timestamp, instantly neutralizing all active attacker sessions.',
    engineerReasoning: 'This is the signature cloud security engineer technique for instantaneous STS session termination without deleting the role itself.',
    businessImpact: 'Instantly expels threat actors from the cloud environment, stopping active data exfiltration in seconds.',
    awsBestPractice: 'Use the AWS IAM console "Revoke active sessions" button, which automatically generates and attaches this exact `aws:TokenIssueTime` inline policy.'
  },
  {
    id: 'ir-q08',
    difficulty: 'Intermediate',
    category: 'Network Quarantine Security Group',
    topicId: 'host-isolation-containment',
    topicTitle: 'Host Isolation & Containment',
    question: 'When isolating a compromised EC2 instance using a quarantine Security Group, why is modifying the existing Security Group considered an ANTI-PATTERN compared to attaching a new, dedicated Isolation Security Group?',
    options: [
      'Because AWS charges $100 to edit a security group.',
      'Modifying the existing Security Group immediately affects ALL other EC2 instances sharing that same Security Group, causing an unintended widespread outage across healthy production systems.',
      'Security Groups cannot be edited once created.',
      'Quarantine security groups only work in US regions.'
    ],
    correctAnswer: 'Modifying the existing Security Group immediately affects ALL other EC2 instances sharing that same Security Group, causing an unintended widespread outage across healthy production systems.',
    explanation: 'Security Groups are commonly attached to dozens of auto-scaled instances. Stripping rules from a shared security group severs connectivity for every instance in that fleet, turning a single compromised host into a massive self-inflicted production outage.',
    engineerReasoning: 'Containment must be surgically targeted to the compromised asset. Always create or attach a dedicated isolation SG specifically to that single instance ENI.',
    businessImpact: 'Maintains business uptime for revenue-generating workloads while isolating the infected host.',
    awsBestPractice: 'Pre-create an empty `quarantine-sg` in every VPC during the Preparation phase, ready to be attached instantly during an incident.'
  },
  {
    id: 'ir-q09',
    difficulty: 'Intermediate',
    category: 'Live Memory Forensics',
    topicId: 'forensic-acquisition-ebs',
    topicTitle: 'Forensic Acquisition & EBS',
    question: 'Why is acquiring volatile system memory (RAM) critical before rebooting or powering off a compromised virtual machine?',
    options: [
      'RAM contains the computer’s serial number.',
      'Volatile memory contains active network connections, decrypted encryption keys, running malware injected into memory without disk presence (fileless malware), and injected shellcode that is permanently lost upon power loss.',
      'RAM is required to power on the AWS console.',
      'Rebooting an instance deletes the AWS IAM role.'
    ],
    correctAnswer: 'Volatile memory contains active network connections, decrypted encryption keys, running malware injected into memory without disk presence (fileless malware), and injected shellcode that is permanently lost upon power loss.',
    explanation: 'Modern adversaries use fileless malware (running strictly in process memory) and in-memory credential scrapers (like Mimikatz). Rebooting or stopping an instance empties the RAM, destroying the primary evidence needed to understand how the attacker operated.',
    engineerReasoning: 'Preserving volatile state adheres to the Order of Volatility in digital forensics (RFC 3227): capture registers and RAM before examining non-volatile disk.',
    businessImpact: 'Without memory capture, security teams cannot determine if root-level kernel backdoors were installed or if encryption keys were compromised.',
    awsBestPractice: 'Use AWS Systems Manager to execute LiME (Linux Memory Extractor) or WinPmem to dump memory directly to an S3 bucket before shutting down.'
  },
  {
    id: 'ir-q10',
    difficulty: 'Intermediate',
    category: 'CloudTrail Attack Pattern Recognition',
    topicId: 'cloudtrail-forensics-triage',
    topicTitle: 'CloudTrail Forensics & Triage',
    question: 'During a CloudTrail log audit, you observe a sequence of rapid API calls from a single IP address: `iam:ListUsers`, `iam:ListRoles`, `iam:ListAttachedUserPolicies`, `iam:ListAccessKeys`, and `iam:GetAccountSummary`. What attack phase does this sequence represent?',
    options: [
      'Data Exfiltration.',
      'Reconnaissance and Discovery / Privilege Enumeration (typical of automated attack frameworks like Pacu or ScoutSuite).',
      'Denial of Service.',
      'Ransomware encryption.'
    ],
    correctAnswer: 'Reconnaissance and Discovery / Privilege Enumeration (typical of automated attack frameworks like Pacu or ScoutSuite).',
    explanation: 'After obtaining initial credentials, attackers immediately map out permissions to discover what they can access and find privilege escalation paths. This automated enumeration sequence is characteristic of tools like Pacu.',
    engineerReasoning: 'Recognizing reconnaissance sequences allows SecOps to intercept the attacker in early attack phases before they locate and access crown jewel data.',
    businessImpact: 'Early detection prevents the incident from advancing to data theft or production destruction.',
    awsBestPractice: 'Configure CloudWatch anomaly alerts on high concentrations of `iam:List*` and `iam:Get*` calls from non-automated corporate IPs.'
  },
  {
    id: 'ir-q11',
    difficulty: 'Intermediate',
    category: 'Compromised Root Account Triage',
    topicId: 'credential-revocation-triage',
    topicTitle: 'Credential Revocation & Triage',
    question: 'If you confirm that the AWS Account Root User has been compromised by an unauthorized external party, what sequence of remediation actions is required?',
    options: [
      'Email the attacker asking them to log out.',
      'Reset the root password, rotate or delete all root access keys, change the email address password associated with root, rotate hardware MFA devices, and inspect all IAM users/roles for backdoors.',
      'Wait 30 days for AWS automated account cleanup.',
      'Close your web browser.'
    ],
    correctAnswer: 'Reset the root password, rotate or delete all root access keys, change the email address password associated with root, rotate hardware MFA devices, and inspect all IAM users/roles for backdoors.',
    explanation: 'Root account compromise is the ultimate cloud emergency. Securing root requires regaining control of the email inbox, resetting passwords, invalidating static root keys, re-enrolling hardware MFA, and scrubbing the account for rogue IAM users or cross-account trust roles.',
    engineerReasoning: 'Root has unrestricted access. The attacker will likely have created secondary administrative backdoors to regain access even after a root password reset.',
    businessImpact: 'Prevents total corporate loss of intellectual property, permanent database destruction, and unauthorized resource hijacking.',
    awsBestPractice: 'Engage AWS Support immediately with an Enterprise Critical severity ticket while executing root recovery playbooks.'
  },
  {
    id: 'ir-q12',
    difficulty: 'Intermediate',
    category: 'Canary Recovery Deployment',
    topicId: 'recovery-canary-restoration',
    topicTitle: 'Recovery & Canary Restoration',
    question: 'Why is a "Canary-Based Deployment" recommended over an all-at-once cutover when restoring business services following a security incident?',
    options: [
      'Canaries are trained to detect computer viruses.',
      'Routing a small fraction of traffic (e.g. 5-10%) to the newly hardened infrastructure allows engineers to verify service stability and ensure the attacker’s exploit does not immediately trigger again before exposing all production traffic.',
      'Canary deployments are exempt from AWS taxes.',
      'It reduces the size of database backups.'
    ],
    correctAnswer: 'Routing a small fraction of traffic (e.g. 5-10%) to the newly hardened infrastructure allows engineers to verify service stability and ensure the attacker’s exploit does not immediately trigger again before exposing all production traffic.',
    explanation: 'Canary testing provides a controlled blast radius during recovery. If the remediation failed or if the attacker attempts an immediate re-exploit, only a small percentage of users are impacted, and the canary can be rolled back instantly.',
    engineerReasoning: 'Eradication verification is difficult. Canary traffic allows real-world validation under live telemetry monitoring before declaring an all-clear.',
    businessImpact: 'Protects customer trust and prevents recurring outages from flawed emergency patches.',
    awsBestPractice: 'Use AWS Route 53 weighted routing or AWS CodeDeploy Canary deployment configurations with automated CloudWatch rollback alarms.'
  },
  {
    id: 'ir-q13',
    difficulty: 'Intermediate',
    category: 'Eradication of Hidden Backdoors',
    topicId: 'eradication-threat-hunting',
    topicTitle: 'Eradication & Threat Hunting',
    question: 'During post-compromise eradication, why must security engineers audit IAM Role Trust Policies in addition to standard identity permission policies?',
    options: [
      'Trust policies dictate the price of AWS services.',
      'Attackers frequently modify role trust relationships to add an external attacker-controlled AWS account ID as a trusted principal (`Principal: { "AWS": "arn:aws:iam::ATTACKER_ACCOUNT_ID:root" }`), creating a persistent backdoor that survives password resets.',
      'Trust policies are stored on public web servers.',
      'Trust policies control SSL certificate renewals.'
    ],
    correctAnswer: 'Attackers frequently modify role trust relationships to add an external attacker-controlled AWS account ID as a trusted principal (`Principal: { "AWS": "arn:aws:iam::ATTACKER_ACCOUNT_ID:root" }`), creating a persistent backdoor that survives password resets.',
    explanation: 'A common cloud persistence mechanism is modifying the `AssumeRolePolicyDocument` on an existing high-privilege role to trust an attacker account. Even if you reset all employee passwords, the attacker can still assume the role from the outside.',
    engineerReasoning: 'Thorough eradication requires inspecting both ends of the IAM relationship: who can assume the role (trust policy) and what the role can do (permission policy).',
    businessImpact: 'Prevents the attacker from re-entering the environment weeks later to launch secondary extortion attacks.',
    awsBestPractice: 'Use AWS IAM Access Analyzer to continuously flag roles with cross-account trust relationships outside your AWS Organization.'
  },
  {
    id: 'ir-q14',
    difficulty: 'Intermediate',
    category: 'Chain of Custody in Cloud Forensics',
    topicId: 'forensic-acquisition-ebs',
    topicTitle: 'Forensic Acquisition & EBS',
    question: 'How do cloud security teams maintain a legally defensible "Chain of Custody" for digital evidence acquired in AWS?',
    options: [
      'By taking photos of the AWS server room with a digital camera.',
      'By documenting every action taken, recording cryptographic hashes (SHA-256) of snapshot volumes, logging all forensic access in CloudTrail, and storing copies in write-once-read-many (WORM) S3 buckets with Object Lock.',
      'By deleting logs after 24 hours to preserve privacy.',
      'By having a lawyer sit next to the engineer during keystrokes.'
    ],
    correctAnswer: 'By documenting every action taken, recording cryptographic hashes (SHA-256) of snapshot volumes, logging all forensic access in CloudTrail, and storing copies in write-once-read-many (WORM) S3 buckets with Object Lock.',
    explanation: 'Chain of custody proves evidence was collected properly, untampered, and accounted for from collection to courtroom presentation. S3 Object Lock and CloudTrail non-repudiation provide cryptographic proof of custody.',
    engineerReasoning: 'If chain of custody is broken, judges will dismiss forensic evidence in criminal trials and insurance underwriters may deny breach reimbursement claims.',
    businessImpact: 'Protects the enterprise from legal liability and ensures forensic findings stand up in court or during regulatory investigations.',
    awsBestPractice: 'Automate evidence acquisition using step functions that calculate volume hashes and log metadata to an immutable DynamoDB ledger.'
  },
  {
    id: 'ir-q15',
    difficulty: 'Advanced',
    category: 'Forensic Isolation VPC Architecture',
    topicId: 'host-isolation-containment',
    topicTitle: 'Host Isolation & Containment',
    question: 'What is the architectural design of a dedicated "Forensic Examination VPC" in an isolated Security Operations AWS Account?',
    options: [
      'A public subnet with an open 0.0.0.0/0 route to the internet.',
      'An isolated VPC with NO Internet Gateway, NO NAT Gateway, NO VPC Peering, equipped with pre-warmed forensic analysis EC2 instances (SANS SIFT/Autopsy), receiving EBS snapshot volumes created from the compromised account over encrypted sharing.',
      'A VPC located in a personal developer account.',
      'A shared VPC running production customer databases.'
    ],
    correctAnswer: 'An isolated VPC with NO Internet Gateway, NO NAT Gateway, NO VPC Peering, equipped with pre-warmed forensic analysis EC2 instances (SANS SIFT/Autopsy), receiving EBS snapshot volumes created from the compromised account over encrypted sharing.',
    explanation: 'A forensic VPC must be an airtight sandbox. No outbound internet access ensures that if analyzed malware contains auto-detonation triggers, it cannot phone home or infect other systems.',
    engineerReasoning: 'Separating the forensic workspace from the target environment prevents accidental malware propagation and eliminates conflicting administrative access.',
    businessImpact: 'Enables deep analysis of live malware and adversary artifacts in a zero-risk, mathematically isolated cloud environment.',
    awsBestPractice: 'Share EBS snapshots to the forensic account using AWS RAM or KMS key sharing, create a copy in the forensic account, and analyze the copy.'
  },
  {
    id: 'ir-q16',
    difficulty: 'Advanced',
    category: 'Automated Containment with Step Functions',
    topicId: 'host-isolation-containment',
    topicTitle: 'Host Isolation & Containment',
    question: 'When designing an automated incident response workflow using AWS Step Functions triggered by a GuardDuty finding, what order of operations ensures both containment and forensic preservation?',
    options: [
      'Terminate EC2 instance -> Delete EBS volume -> Alert team.',
      'Tag instance as "Under-Investigation" -> Snapshot attached EBS volumes -> Detach instance from Auto Scaling Group -> Swap Security Groups to Isolation SG -> Send forensic readiness alert to SecOps Slack channel.',
      'Reboot instance -> Clear CloudTrail logs -> Reset passwords.',
      'Power off instance -> Delete VPC -> Call support.'
    ],
    correctAnswer: 'Tag instance as "Under-Investigation" -> Snapshot attached EBS volumes -> Detach instance from Auto Scaling Group -> Swap Security Groups to Isolation SG -> Send forensic readiness alert to SecOps Slack channel.',
    explanation: 'Detaching from the Auto Scaling Group (ASG) prevents the ASG from terminating the unhealthy instance before snapshots are complete. Swapping to an isolation SG contains the network threat while preserving evidence.',
    engineerReasoning: 'If you isolate an instance without detaching it from the ASG, health checks fail and the ASG immediately destroys the instance, wiping out forensic data.',
    businessImpact: 'Automates containment in under 15 seconds while preventing accidental destruction of critical forensic evidence.',
    awsBestPractice: 'Use `ec2:DetachInstances` with `ShouldDecrementDesiredCapacity=false` to preserve the compromised instance while spinning up a clean replacement.'
  },
  {
    id: 'ir-q17',
    difficulty: 'Advanced',
    category: 'Tracing Lateral Movement in CloudTrail',
    topicId: 'cloudtrail-forensics-triage',
    topicTitle: 'CloudTrail Forensics & Triage',
    question: 'An attacker stole credentials for `RoleA` in Account 1, which has trust permissions to assume `RoleB` in Account 2. In Account 2 CloudTrail, what value will appear in the `userIdentity.arn` field, and how do you tie it back to the original identity in Account 1?',
    options: [
      '`userIdentity.arn` will display "Anonymous".',
      '`userIdentity.arn` will display `arn:aws:sts::ACCOUNT_2:assumed-role/RoleB/SESSION_NAME`; you correlate the `SESSION_NAME` with the `sts:AssumeRole` event in Account 1 CloudTrail to identify the original caller `RoleA`.',
      'Account 2 CloudTrail will not record the call.',
      '`userIdentity.arn` displays the hardware MAC address of the laptop.'
    ],
    correctAnswer: '`userIdentity.arn` will display `arn:aws:sts::ACCOUNT_2:assumed-role/RoleB/SESSION_NAME`; you correlate the `SESSION_NAME` with the `sts:AssumeRole` event in Account 1 CloudTrail to identify the original caller `RoleA`.',
    explanation: 'Cross-account STS calls carry a role session name. By querying Account 1 CloudTrail for `eventName = "AssumeRole"` with that session name, responders discover the exact initial principal and source IP that assumed the role.',
    engineerReasoning: 'Cross-account correlation is essential in multi-account organizations. Adversaries hop across account trust boundaries to obscure their point of origin.',
    businessImpact: 'Uncovers the true initial breach point, preventing incomplete investigations that leave the primary entry vector open.',
    awsBestPractice: 'Enforce `${aws:username}` or IAM identity identifiers as mandatory session names in role trust condition keys (`sts:RoleSessionName`).'
  },
  {
    id: 'ir-q18',
    difficulty: 'Advanced',
    category: 'Memory Acquisition under IMDSv2',
    topicId: 'forensic-acquisition-ebs',
    topicTitle: 'Forensic Acquisition & EBS',
    question: 'When executing automated forensic memory acquisition on an EC2 instance where IMDSv2 is strictly enforced (`HttpTokens: required`, `HttpPutResponseHopLimit: 1`), why must forensic scripts be written to request a session token first?',
    options: [
      'IMDSv2 does not support Linux operating systems.',
      'IMDSv2 is session-oriented and requires a `PUT` request with a header `X-aws-ec2-metadata-token-ttl-seconds` to retrieve a signed session token before making any metadata queries, preventing SSRF attacks.',
      'IMDSv2 requires payment in Bitcoin.',
      'IMDSv2 disables local bash commands.'
    ],
    correctAnswer: 'IMDSv2 is session-oriented and requires a `PUT` request with a header `X-aws-ec2-metadata-token-ttl-seconds` to retrieve a signed session token before making any metadata queries, preventing SSRF attacks.',
    explanation: 'Legacy IMDSv1 allowed simple GET requests, enabling SSRF exploits. IMDSv2 requires an initial PUT call to fetch a token. Forensic tools running on the instance must support this token exchange to obtain temporary credentials.',
    engineerReasoning: 'Responders must ensure their forensic automation respects security guardrails (IMDSv2) without failing unexpectedly during an active emergency.',
    businessImpact: 'Prevents response scripts from breaking during live incidents on hardened modern cloud workloads.',
    awsBestPractice: 'Update all incident response automation scripts to use AWS CLI v2, which handles IMDSv2 token negotiation automatically.'
  },
  {
    id: 'ir-q19',
    difficulty: 'Advanced',
    category: 'Golden AMI Replacement Eradication',
    topicId: 'recovery-canary-restoration',
    topicTitle: 'Recovery & Canary Restoration',
    question: 'During eradication, rather than attempting to clean malware or remove rootkits from a running Linux EC2 instance, why is terminating the instance and launching a fresh instance from a verified Golden AMI the standard cloud security practice?',
    options: [
      'Because antivirus software cannot be installed on EC2.',
      'Modern rootkits and kernel implants can hide from operating system scanners; immutable reconstruction from a known-good, audited Golden AMI guarantees complete eradication with zero lingering attacker implants.',
      'AWS charges penalty fees if instances run for more than 48 hours.',
      'Linux kernels cannot be modified.'
    ],
    correctAnswer: 'Modern rootkits and kernel implants can hide from operating system scanners; immutable reconstruction from a known-good, audited Golden AMI guarantees complete eradication with zero lingering attacker implants.',
    explanation: 'Attempting in-place cleanup on a compromised operating system is unreliable; sophisticated malware modifies kernel memory, system binaries, and cron jobs. Tearing down the compromised instance and redeploying from verified code guarantees 100% eradication.',
    engineerReasoning: 'Embraces the cloud paradigm: treat compute as disposable. Never negotiate with an infected operating system.',
    businessImpact: 'Guarantees the threat is completely eradicated and prevents threat actors from re-activating sleeper backdoors weeks later.',
    awsBestPractice: 'Maintain automated CI/CD deployment pipelines that can redeploy the entire application stack from clean source code in minutes.'
  },
  {
    id: 'ir-q20',
    difficulty: 'Advanced',
    category: 'VPC Route Hijacking Containment',
    topicId: 'host-isolation-containment',
    topicTitle: 'Host Isolation & Containment',
    question: 'An advanced attacker has compromised an EC2 instance in a subnet and you suspect they may attempt to evade Security Group isolation by modifying local network configurations or ARP tables. What network-level action guarantees instant, total network isolation at the subnet border?',
    options: [
      'Turn off the building’s power circuit.',
      'Associate the subnet with a dedicated "Quarantine NACL" that has a single rule: `Rule 1: DENY ALL TRAFFIC` for both Inbound and Outbound.',
      'Re-install the Linux operating system.',
      'Change the VPC name.'
    ],
    correctAnswer: 'Associate the subnet with a dedicated "Quarantine NACL" that has a single rule: `Rule 1: DENY ALL TRAFFIC` for both Inbound and Outbound.',
    explanation: 'Network ACLs operate at the subnet boundary in the AWS hypervisor, completely outside the EC2 instance’s control. A subnet-level NACL deny drops all packets before they cross the virtual wire, regardless of instance configuration.',
    engineerReasoning: 'NACLs provide hypervisor-enforced boundary containment that the guest operating system cannot bypass, even with kernel-level root access.',
    businessImpact: 'Stops lateral movement and data exfiltration cold at the network boundary.',
    awsBestPractice: 'Keep pre-configured Quarantine NACLs ready for association during severe malware or ransomware outbreaks.'
  },
  {
    id: 'ir-q21',
    difficulty: 'Advanced',
    category: 'Compromised KMS Key Triage',
    topicId: 'credential-revocation-triage',
    topicTitle: 'Credential Revocation & Triage',
    question: 'If you suspect that an AWS KMS Customer Managed Key (CMK) policy was tampered with to grant decryption rights to an external entity, how can you immediately disable all cryptographic operations for that key without permanently deleting the key material?',
    options: [
      'Call `kms:ScheduleKeyDeletion` with a 7-day waiting period.',
      'Execute `aws kms disable-key --key-id <KEY_ID>`, which immediately transitions the key state to `Disabled`, causing all encryption and decryption requests to fail instantly.',
      'Delete the AWS account.',
      'Remove the key name.'
    ],
    correctAnswer: 'Execute `aws kms disable-key --key-id <KEY_ID>`, which immediately transitions the key state to `Disabled`, causing all encryption and decryption requests to fail instantly.',
    explanation: '`DisableKey` is instantaneous and completely reversible via `EnableKey`. Scheduling key deletion enforces a minimum 7-day waiting period during which the key can still be used unless disabled. Disabling stops all decryption immediately.',
    engineerReasoning: 'Instant containment of the cryptographic boundary: if attackers are actively decrypting sensitive customer data, disabling the key halts the breach in real-time.',
    businessImpact: 'Prevents mass unauthorized decryption of crown jewel data while keeping data recoverable once the incident is contained.',
    awsBestPractice: 'Disable the key immediately, verify CloudTrail logs for unauthorized `kms:Decrypt` calls, and re-encrypt data with a newly generated key.'
  },
  {
    id: 'ir-q22',
    difficulty: 'Advanced',
    category: 'Post-Mortem Metric: MTTD and MTTR',
    topicId: 'post-incident-post-mortem',
    topicTitle: 'Post-Incident Activity & Post-Mortems',
    question: 'In a cloud security post-incident review, what do the metrics "Mean Time to Detect" (MTTD) and "Mean Time to Remediate" (MTTR) measure, and why are they critical KPIs for security engineering teams?',
    options: [
      'They measure the speed of the company’s internet connection.',
      'MTTD measures the duration from initial adversary compromise to security alert generation; MTTR measures the time from detection to full threat containment and eradication. Reducing both minimizes attacker dwell time.',
      'They measure the time it takes to hire new security engineers.',
      'They calculate the monthly AWS cloud bill.'
    ],
    correctAnswer: 'MTTD measures the duration from initial adversary compromise to security alert generation; MTTR measures the time from detection to full threat containment and eradication. Reducing both minimizes attacker dwell time.',
    explanation: 'Attacker dwell time is the gap between initial breach and containment. Lower MTTD means rapid visibility (via GuardDuty/CloudTrail); lower MTTR means rapid automated response (via EventBridge/Lambdas).',
    engineerReasoning: 'A breach that is detected and contained in 3 minutes is a minor operational event; a breach undetected for 200 days results in complete catastrophic data loss.',
    businessImpact: 'Minimizing dwell time directly correlates with lower data recovery costs, fewer stolen records, and lower regulatory penalties.',
    awsBestPractice: 'Track MTTD and MTTR across all security alerts and automate containment runbooks for recurring high-priority finding types.'
  },
  {
    id: 'ir-q23',
    difficulty: 'Engineer Level',
    category: 'Automated Forensic Artifact Ingestion',
    topicId: 'forensic-acquisition-ebs',
    topicTitle: 'Forensic Acquisition & EBS',
    question: 'You are architecting an enterprise cloud forensic pipeline. When an EBS snapshot is taken during an incident, what automated serverless architecture mounts the volume, executes YARA rules, extracts system logs, and exports a timeline to OpenSearch without manual engineer intervention?',
    options: [
      'Running a cron job on a developer’s desktop.',
      'An EventBridge rule on snapshot completion triggers an AWS Step Functions state machine that creates an EBS volume from the snapshot in an isolated forensic account, attaches it to an ephemeral ECS Fargate or EC2 worker, runs automated YARA/log2timeline extraction, uploads artifacts to an S3 WORM bucket, and posts findings to Slack.',
      'Manually downloading the 500GB volume over home Wi-Fi.',
      'Printing the volume data to PDF.'
    ],
    correctAnswer: 'An EventBridge rule on snapshot completion triggers an AWS Step Functions state machine that creates an EBS volume from the snapshot in an isolated forensic account, attaches it to an ephemeral ECS Fargate or EC2 worker, runs automated YARA/log2timeline extraction, uploads artifacts to an S3 WORM bucket, and posts findings to Slack.',
    explanation: 'Serverless forensic orchestration (e.g. AWS Auto-Forensics framework) automates volume mounting, file system artifact carving, YARA signature scanning, and timeline generation, reducing evidence triage from days to minutes.',
    engineerReasoning: 'Automation eliminates human error, preserves strict chain of custody, and allows small SecOps teams to triage complex incidents across thousands of instances.',
    businessImpact: 'Dramatically cuts incident investigation costs and allows responders to confirm malware families before the attacker finishes exfiltration.',
    awsBestPractice: 'Deploy the open-source AWS Automated Forensics solution in your Security Tooling account.'
  },
  {
    id: 'ir-q24',
    difficulty: 'Engineer Level',
    category: 'Adversary Defense Evasion Recognition',
    topicId: 'cloudtrail-forensics-triage',
    topicTitle: 'CloudTrail Forensics & Triage',
    question: 'An advanced adversary with temporary administrative access attempts defense evasion. Which specific sequence of API calls in CloudTrail reveals an active attempt to blind security monitoring and logging before deploying ransomware?',
    options: [
      '`s3:ListBuckets`, `ec2:DescribeInstances`',
      '`cloudtrail:StopLogging`, `cloudtrail:DeleteTrail`, `guardduty:DeleteDetector`, `config:DeleteConfigRule`, and `wafv2:DisassociateWebACL`.',
      '`iam:GetUser`, `sts:GetCallerIdentity`',
      '`route53:GetHostedZone`'
    ],
    correctAnswer: '`cloudtrail:StopLogging`, `cloudtrail:DeleteTrail`, `guardduty:DeleteDetector`, `config:DeleteConfigRule`, and `wafv2:DisassociateWebACL`.',
    explanation: 'Sophisticated threat actors systematically disable telemetry services (CloudTrail, GuardDuty, AWS Config, WAF) prior to destructive actions. Identifying these API calls signals an imminent, critical-tier security disaster.',
    engineerReasoning: 'These actions should never occur in normal operations. Treat any unauthorized attempt to stop logging as a 5-alarm fire.',
    businessImpact: 'Immediate intervention stops complete destruction of company cloud infrastructure and ransomware encryption.',
    awsBestPractice: 'Use Service Control Policies (SCPs) to make it impossible for any identity in member accounts to call these deletion APIs, and wire EventBridge tripwires for immediate alerting.'
  },
  {
    id: 'ir-q25',
    difficulty: 'Engineer Level',
    category: 'Memory Acquisition Kernel Hooks',
    topicId: 'forensic-acquisition-ebs',
    topicTitle: 'Forensic Acquisition & EBS',
    question: 'When capturing RAM from a production Amazon Linux 2023 EC2 instance using kernel modules like LiME (Linux Memory Extractor), what operational risk must the incident responder plan for, and how is it mitigated?',
    options: [
      'The instance could run out of disk space on the root volume; mitigate by streaming the raw memory image directly over an isolated VPC interface endpoint into Amazon S3 rather than saving it to the local root disk.',
      'LiME deletes all user passwords automatically.',
      'The AWS billing console will permanently freeze.',
      'The EC2 instance will change its IP address.'
    ],
    correctAnswer: 'The instance could run out of disk space on the root volume; mitigate by streaming the raw memory image directly over an isolated VPC interface endpoint into Amazon S3 rather than saving it to the local root disk.',
    explanation: 'A 64GB RAM instance will produce a 64GB raw memory dump. If saved locally to an 80GB root disk that is already 60% full, the root disk fills up, crashing the operating system and corrupting volatile state. Streaming directly to S3 via network pipe mitigates this.',
    engineerReasoning: 'Incident responders must understand operating system mechanics so their forensic tools do not accidentally cause the catastrophic failure they are trying to prevent.',
    businessImpact: 'Prevents self-inflicted system crashes and preserves critical volatile forensic evidence.',
    awsBestPractice: 'Compile LiME kernel modules against the specific kernel version in advance during the Preparation phase, and test streaming directly to S3.'
  },
  {
    id: 'ir-q26',
    difficulty: 'Engineer Level',
    category: 'Compromised Organization Management Root Recovery',
    topicId: 'credential-revocation-triage',
    topicTitle: 'Credential Revocation & Triage',
    question: 'In the catastrophic event that the AWS Organization Management Account credentials are fully compromised and the attacker has modified the root email and password, what is the official emergency procedure to recover the organization?',
    options: [
      'Post on public Reddit to ask for assistance.',
      'Contact AWS Trust & Safety / AWS Support through an Enterprise Support emergency phone engagement, verify corporate legal identity and business registration documents via the out-of-band verification protocol, and request account recovery through AWS Security Escalation.',
      'Create a new AWS account and start over.',
      'Wait for the credit card on file to expire.'
    ],
    correctAnswer: 'Contact AWS Trust & Safety / AWS Support through an Enterprise Support emergency phone engagement, verify corporate legal identity and business registration documents via the out-of-band verification protocol, and request account recovery through AWS Security Escalation.',
    explanation: 'AWS maintains an out-of-band identity verification process for compromised root management accounts. Corporate officers must provide notarized documentation, company registration, and phone verification with AWS Trust & Safety to regain ownership.',
    engineerReasoning: 'Technical controls cannot help if the highest organizational root identity is compromised. Knowing the exact provider escalation protocol is a critical senior leadership capability.',
    businessImpact: 'The only pathway to legally and technically reclaim multi-million dollar enterprise cloud infrastructure.',
    awsBestPractice: 'Pre-record your AWS Account ID, Enterprise Support PIN, and designated primary corporate contacts in an offline disaster recovery binder.'
  },
  {
    id: 'ir-q27',
    difficulty: 'Engineer Level',
    category: 'Threat Actor Infrastructure Attribution in CloudTrail',
    topicId: 'cloudtrail-forensics-triage',
    topicTitle: 'CloudTrail Forensics & Triage',
    question: 'How do threat intelligence analysts extract threat actor infrastructure information from CloudTrail `sourceIPAddress` and `userAgent` fields when an attacker routes calls through commercial VPNs or Tor nodes?',
    options: [
      'CloudTrail decrypts Tor traffic automatically.',
      'By cross-referencing source IPs against commercial threat intelligence feeds (MaxMind, GreyNoise, Shodan) to identify Tor exit nodes and bulletproof hosting, while analyzing specific user-agent strings (e.g. customized boto3 strings or python-requests signatures) to fingerprint the attacker’s automated script suite.',
      'By asking AWS to shut down the Tor network.',
      'By inspecting DNS cache on client routers.'
    ],
    correctAnswer: 'By cross-referencing source IPs against commercial threat intelligence feeds (MaxMind, GreyNoise, Shodan) to identify Tor exit nodes and bulletproof hosting, while analyzing specific user-agent strings (e.g. customized boto3 strings or python-requests signatures) to fingerprint the attacker’s automated script suite.',
    explanation: 'Threat actors leave fingerprints in CloudTrail metadata: custom user-agents, request timestamps, and IP ASN classifications. Correlating these across multiple events reveals whether an attack is automated botnet scanning or targeted human hands-on-keyboard activity.',
    engineerReasoning: 'Attribution shapes response posture: automated opportunistic bot scans require simple credential rotation, whereas targeted APT campaigns require deep enterprise-wide persistence hunting.',
    businessImpact: 'Informs executive risk decisions and guides regulatory reporting requirements.',
    awsBestPractice: 'Enrich Athena CloudTrail queries with threat intelligence IP lookup tables using Athena user-defined functions (UDFs).'
  },
  {
    id: 'ir-q28',
    difficulty: 'Engineer Level',
    category: 'Ransomware Blast Radius in S3',
    topicId: 'eradication-threat-hunting',
    topicTitle: 'Eradication & Threat Hunting',
    question: 'A cloud ransomware script assumes an administrative role and executes `s3:PutObject` to overwrite 100,000 corporate documents with encrypted versions. What architectural configuration guarantees that the original unencrypted documents can be restored in seconds with zero data loss?',
    options: [
      'Downloading files to local laptops.',
      'S3 Versioning combined with S3 Object Lock in Compliance Mode (or S3 Versioning with MFA Delete enabled), which ensures previous object versions are immutable and cannot be overwritten or deleted even by the administrative role.',
      'Having a paper backup of all documents.',
      'Renaming the S3 bucket.'
    ],
    correctAnswer: 'S3 Versioning combined with S3 Object Lock in Compliance Mode (or S3 Versioning with MFA Delete enabled), which ensures previous object versions are immutable and cannot be overwritten or deleted even by the administrative role.',
    explanation: 'With S3 Versioning and Object Lock in Compliance Mode, `PutObject` merely creates a new version; the previous unencrypted version remains intact and immutable. Even root cannot delete the previous version before the retention period expires.',
    engineerReasoning: 'Eliminates ransomware leverage: rather than paying millions in ransom, responders simply delete the latest malicious marker or rollback to the previous version.',
    businessImpact: 'Saves millions of dollars in ransom payments and guarantees business continuity during cloud ransomware attacks.',
    awsBestPractice: 'Apply S3 Object Lock in Compliance Mode on critical data lakes and replicate versions across an isolated backup account.'
  },
  {
    id: 'ir-q29',
    difficulty: 'Engineer Level',
    category: 'Cross-Region Incident Response DNS Failover',
    topicId: 'recovery-canary-restoration',
    topicTitle: 'Recovery & Canary Restoration',
    question: 'Following a regional ransomware incident where all compute in `us-east-1` was quarantined, how does a pre-configured Amazon Route 53 Application Recovery Controller (ARC) enable clean traffic redirection to `us-west-2` without human DNS propagation delays?',
    options: [
      'By sending an email to AWS support.',
      'ARC routing controls use highly reliable data plane API calls (with 5 regional endpoints) to toggle routing flags, redirecting global DNS traffic within seconds without waiting for TTL expiration or control plane availability.',
      'By changing the domain registrar name.',
      'By creating a new website.'
    ],
    correctAnswer: 'ARC routing controls use highly reliable data plane API calls (with 5 regional endpoints) to toggle routing flags, redirecting global DNS traffic within seconds without waiting for TTL expiration or control plane availability.',
    explanation: 'Route 53 ARC provides deterministic failover. Its data plane is distributed across 5 isolated cells worldwide, ensuring that even if the primary region’s control plane is down, routing controls can be flipped within 60 seconds.',
    engineerReasoning: 'Standard Route 53 record updates depend on the global control plane in us-east-1. If us-east-1 is compromised or down, control plane updates fail. ARC data plane routing controls bypass this dependency.',
    businessImpact: 'Reduces recovery time objective (RTO) from hours to under 60 seconds during regional disasters.',
    awsBestPractice: 'Integrate Route 53 ARC readiness checks into your multi-region disaster recovery runbooks.'
  },
  {
    id: 'ir-q30',
    difficulty: 'Engineer Level',
    category: 'Continuous Incident Response Readiness Verification',
    topicId: 'incident-lifecycle-frameworks',
    topicTitle: 'Incident Response Lifecycle',
    question: 'How do mature cloud security organizations utilize "Chaos Security Engineering" (or Breach and Attack Simulation - BAS) to continuously validate that their incident detection, alerting, and automated containment pipelines actually work in production?',
    options: [
      'By letting real hackers attack production without supervision.',
      'By executing automated, controlled adversary emulation scenarios (using tools like Stratus Red Team or AWS Fault Injection Simulator) that simulate attack techniques (e.g. creating unauthorized access keys or stopping CloudTrail) to verify that alerts fire and automation contains them within SLA thresholds.',
      'By running virus scans once a year.',
      'By having managers write subjective performance reviews.'
    ],
    correctAnswer: 'By executing automated, controlled adversary emulation scenarios (using tools like Stratus Red Team or AWS Fault Injection Simulator) that simulate attack techniques (e.g. creating unauthorized access keys or stopping CloudTrail) to verify that alerts fire and automation contains them within SLA thresholds.',
    explanation: 'Adversary emulation proves whether detection pipelines work before a real attack occurs. If a simulated `s3:PutBucketPolicy` with public read does not trigger an alert and automated rollback within 60 seconds, the security control is defective and must be fixed.',
    engineerReasoning: 'Security controls suffer silent decay over time as IAM policies, network routes, and codebases evolve. Continuous testing guarantees readiness.',
    businessImpact: 'Prevents the fatal discovery during a real ransomware attack that an alerting rule or containment Lambda was silently failing.',
    awsBestPractice: 'Integrate Stratus Red Team or AWS FIS into weekly staging pipelines and schedule unannounced quarterly red/blue team GameDays.'
  }
]
