// Path 6: Incident Response
export const incidentResponsePath = {
  id: 'incident-response',
  title: 'Cloud Incident Response & Digital Forensics',
  shortTitle: 'Incident Response',
  icon: 'ShieldAlert',
  accentColor: '#fb7185',
  badge: 'Domain 06',
  level: 'Intermediate to Advanced',
  estimatedTime: '2 hrs 40 mins',
  description: 'Master the complete NIST SP 800-61 / ISO 27035 incident response lifecycle tailored to AWS. Learn detection triage, volatile forensic capture, emergency IAM revocation, quarantine isolation security groups, immutable backup restoration, and blameless post-mortems.',
  whyItMatters: 'Breaches are inevitable; catastrophic loss is not. How quickly and methodically your team triages evidence, isolates compromised identities, and preserves forensic integrity dictates whether an intrusion is a minor footnote or a business-ending disaster.',
  topics: [
    {
      id: 'ir-detection',
      title: 'Detection, Alert Triage & Severity Classification',
      pathId: 'incident-response',
      level: 'Intermediate',
      estimatedTime: '22 min read • 5 min check',
      badge: 'Phase 1: Detection',
      summary: 'Triage security alerts under pressure. Validate Indicators of Compromise (IoCs), distinguish true positives from benign anomalies, and assign severity classifications (P1 to P4).',
      overview: `Incident Response begins the moment an anomaly or threat detection fires. In AWS environments, alerts originate from Amazon GuardDuty, AWS Security Hub, CloudWatch Alarms, third-party SIEMs, or external notification channels (e.g. AWS Trust & Safety emails).

**The 4 Incident Severity Levels (P1 - P4)**:
1. **P1 - Critical (Immediate Page / SLA: <15 mins)**:
   - Active ransomware encryption in progress, confirmed root account compromise, production database exfiltration, or total service disruption.
   - Requires immediate war room assembly, automated containment, and executive briefing.
2. **P2 - High (SLA: <1 hour)**:
   - Compromised IAM user access key detected on external IP, unauthorized EC2 instances launched in foreign region, or public S3 bucket containing confidential data.
3. **P3 - Medium (SLA: <4 hours)**:
   - Suspicious port scanning, unapproved IAM policy modification without privilege escalation, or security group opened to corporate IP.
4. **P4 - Low / Informational (SLA: <24 hours)**:
   - Routine vulnerability scan findings, non-compliant resource tag, or low-severity compliance drift.

**The Triage Validation Checklist**:
- **Validate the Principal**: Was the action executed by an authorized human or deployment pipeline?
- **Verify Geolocation & IP Reputation**: Is the source IP from an unexpected ASN, Tor exit node, or residential proxy?
- **Check the User-Agent**: Was the call made via standard corporate tooling or custom adversary scripts (e.g. \`kali-linux\`, \`pacu\`, \`curl\`)?
- **Determine Blast Radius**: Did the caller attempt additional actions or query other services?`,
      whyItMatters: 'Misclassifying a P1 critical breach as a low-priority ticket gives attackers hours of uninterrupted runway to exfiltrate data and destroy backups.',
      securityRisks: [
        'Ignoring high-severity GuardDuty alerts assuming they are false positives.',
        'Delayed initial triage allowing an attacker to move laterally across accounts.',
        'Panicking and terminating an instance immediately, permanently destroying volatile RAM evidence.',
        'No defined escalation path or on-call rotation causing alerts to sit unacknowledged.'
      ],
      bestPractices: [
        'Establish automated PagerDuty/OpsGenie rotations for P1/P2 incident response.',
        'Implement standardized triage playbooks for the top 5 alert types (Exposed Keys, Crypto-Mining, Public S3, GuardDuty Tor, Root Activity).',
        'Check AWS CloudTrail for the 60 minutes before and after the alert timestamp to map context.',
        'Record all investigation notes, findings, and hypotheses in a shared incident timeline ticket.'
      ],
      keyTakeaways: [
        'Categorize every incident into P1 (Critical), P2 (High), P3 (Medium), or P4 (Low).',
        'Verify identity, source IP, user-agent, and recent API activity before taking action.',
        'Never terminate an instance during initial triage — preserve forensic evidence first!',
        'Document every action taken in a formal incident ticket for auditability.'
      ],
      realWorldScenario: {
        title: 'The Ignored Crypto-Miner Escalation',
        incident: 'A SOC analyst received a GuardDuty finding: `CryptoCurrency:EC2/BitcoinTool.B!DNS`. Believing it was an engineer testing blockchain technology, the analyst downgraded the ticket to P4 without verifying with the server owner. In reality, an external attacker had gained a web shell and was using the miner as a decoy while simultaneously discovering and downloading the company\'s primary customer database.',
        impact: 'Exfiltration of 600,000 customer records that went undetected for 4 days due to improper triage.',
        detectionMethod: 'Incident discovered when the attacker emailed corporate leadership demanding an extortion payment.'
      },
      commonBeginnerMistakes: [
        'Assuming all GuardDuty alerts are false alarms without performing forensic verification.',
        'Immediately deleting an EC2 instance before taking an EBS snapshot or capturing memory.',
        'Sending critical alerts via email instead of paging on-call engineers.',
        'Not checking whether the compromised credentials were used in multiple AWS regions.'
      ],
      whatACloudSecEngineerChecks: [
        'Inspect the raw GuardDuty finding JSON: `aws guardduty get-findings --detector-id <ID> --finding-ids <FindingID>`.',
        'Query CloudTrail for all actions performed by the suspicious access key in the last 24 hours.',
        'Check IP address reputation on VirusTotal, AbuseIPDB, and GreyNoise.',
        'Verify if the affected resource has sensitive data classification tags.'
      ],
      codeSnippet: {
        language: 'bash',
        title: 'CLI: Query CloudTrail for All API Calls Made by Compromised Access Key',
        code: `# Retrieve the complete timeline of API actions executed by a suspected compromised key
aws cloudtrail lookup-events \\
    --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIAIOSFODNN7EXAMPLE \\
    --max-results 50 \\
    --query "Events[*].{Time:EventTime,Name:EventName,Source:EventSource,IP:SourceIPAddress,UserAgent:UserAgent}" \\
    --output table`
      },
      interviewQuestions: [
        {
          question: 'You receive an alert that an IAM access key was used from an unrecognized IP address in another country. Walk me through your first 15 minutes of triage.',
          interviewerRationale: 'A premier Senior Incident Responder interview question testing order of operations, analytical rigor, and threat verification.',
          modelAnswer: 'Minute 0-5 (Verification): I immediately look up the access key in IAM to identify the owner (human engineer or service account). I check our HR directory and Slack to see if the user is traveling, using a VPN, or if it is an authorized pipeline. I inspect the source IP on AbuseIPDB/VirusTotal for Tor exit node, VPN, or known malicious scanner tags. Minute 5-10 (Timeline Analysis): I query CloudTrail using `lookup-events` for that AccessKeyId across all AWS regions. I look for reconnaissance commands (`Describe*`, `List*`), privilege escalation (`CreateAccessKey`, `AttachUserPolicy`), and high-impact actions (`DeleteTable`, `StopLogging`). Minute 10-15 (Triage Decision): If the calls are unrecognized and from a malicious IP, I classify the incident as P1/P2 Critical, open a formal incident channel, and immediately initiate containment (attaching an explicit Deny policy to the user and deactivating the key).'
        },
        {
          question: 'What is the danger of immediately terminating an EC2 instance the moment a security alert fires?',
          interviewerRationale: 'Evaluates forensic awareness and preservation of volatile digital evidence.',
          modelAnswer: 'Terminating the instance immediately destroys all volatile evidence stored in RAM (active network connections, unwritten log buffers, malware payloads running only in memory, and injected process artifacts). Furthermore, if the instance was backed by ephemeral instance store volumes or configured with "DeleteOnTermination" on EBS, the disk itself is permanently wiped. Proper procedure is to contain the instance first (isolating it with a quarantine security group) and capture forensic EBS snapshots and memory dumps before terminating or rebuilding.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Incident Response and Threat Triage on AWS',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Security Incident Response Guide',
          url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-security-incident-response-guide/welcome.html',
          type: 'Documentation'
        },
        {
          title: 'NIST Computer Security Incident Handling Guide (SP 800-61 Rev. 2)',
          url: 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'What is the very first action a cloud security responder should take when triaging an active alert regarding a suspected compromised EC2 instance?',
        options: [
          { id: 'a', text: 'Immediately terminate the instance to prevent any further network packets.', isCorrect: false, explanation: 'Terminating the instance destroys volatile evidence and disk contents.' },
          { id: 'b', text: 'Verify the alert details, confirm the finding is active, and preserve evidence (EBS snapshots and memory) before taking disruptive containment steps.', isCorrect: true, explanation: 'Correct! Evidence preservation and verification must precede irreversible destructive actions.' },
          { id: 'c', text: 'Reboot the EC2 instance to see if the issue clears itself.', isCorrect: false, explanation: 'Rebooting wipes volatile memory and alerts the adversary.' },
          { id: 'd', text: 'Delete all security groups associated with the VPC.', isCorrect: false, explanation: 'Deleting security groups disrupts production and is blocked if ENIs are attached.' }
        ]
      },
      bridgeToLabs: {
        type: 'Simulator',
        id: 'sim-01',
        title: 'SOC On-Call Simulator: P1 Compromised Credential Triage',
        url: '/internship-simulator',
        description: 'Take the on-call pager, analyze raw evidence, and assign severity classification under time pressure.'
      }
    },
    {
      id: 'ir-investigation',
      title: 'Investigation, Timeline Reconstruction & Forensics',
      pathId: 'incident-response',
      level: 'Advanced',
      estimatedTime: '26 min read • 7 min check',
      badge: 'Phase 2: Investigation',
      summary: 'Reconstruct the complete attacker timeline. Master forensic EBS volume snapshots, volatile memory analysis, Athena SQL querying across CloudTrail, and tracing lateral movement.',
      overview: `Once an incident is verified, responders must reconstruct the complete **Attack Timeline** to answer four critical questions:
1. **Initial Access**: How did the attacker get in?
2. **Dwell Time**: When did the intrusion begin, and how long has the adversary been present?
3. **Blast Radius**: What systems, credentials, databases, and S3 objects were touched or modified?
4. **Data Exfiltration**: Was sensitive data copied, exported, or exfiltrated?

**Forensic Evidence Capture in AWS**:
1. **Disk Forensics via EBS Snapshots**:
   - Create an instantaneous point-in-time snapshot of all attached EBS volumes: \`aws ec2 create-snapshot\`.
   - Copy the snapshot into an isolated **Forensic Investigation Account** to prevent tampering.
   - Attach the snapshot volume to a dedicated forensic analysis workstation (running tools like Autopsy, SIFT, or Volatility) as **read-only** (\`noexec, ro\`).
2. **Volatile Memory (RAM) Acquisition**:
   - Capture memory using kernel modules (LiME for Linux) or tools like AWS Systems Manager runbooks before isolating network interfaces.
3. **Log Correlation with Amazon Athena**:
   - Query millions of CloudTrail, VPC Flow, and S3 access logs in S3 using SQL to build a unified chronological timeline.`,
      whyItMatters: 'Without an accurate attack timeline, you cannot determine if the attacker left backdoors or accessed unencrypted databases. Guessing leads to incomplete eradication and reinfection.',
      securityRisks: [
        'Analyzing forensic disks directly on the infected instance, contaminating file timestamps and evidence.',
        'Failing to preserve chain of custody, rendering forensic evidence inadmissible in court.',
        'Missing secondary persistence mechanisms (e.g. rogue IAM keys or modified Lambda functions).',
        'Relying on local syslog files that the attacker wiped with `rm -rf /var/log/*`.'
      ],
      bestPractices: [
        'Automate forensic disk snapshots and memory acquisition using AWS Systems Manager Automation runbooks.',
        'Conduct all deep forensic analysis inside an isolated Forensics AWS Account with separate credentials.',
        'Use Amazon Athena to query CloudTrail logs partitioned by year/month/day for rapid SQL investigation.',
        'Hash all forensic disk images (SHA-256) immediately upon acquisition to prove evidentiary integrity.'
      ],
      keyTakeaways: [
        'Reconstruct the complete chronological timeline from initial access to containment.',
        'Never analyze evidence on the compromised host; clone EBS snapshots to a dedicated forensic account.',
        'Mount forensic disks as read-only to preserve original file access timestamps (MACB).',
        'Use Athena SQL to correlate CloudTrail, VPC Flow Logs, and Route 53 DNS queries.'
      ],
      investigationExample: {
        title: 'Athena SQL: Timeline Reconstruction of Attacker API Activity',
        description: 'SQL query reconstructing the exact sequence of actions taken by an attacker session ID across all AWS services.',
        code: `SELECT 
    eventtime,
    eventsource,
    eventname,
    awsregion,
    sourceipaddress,
    useragent,
    errorcode,
    requestparameters
FROM central_cloudtrail_logs_db.cloudtrail_table
WHERE useridentity.accesskeyid = 'AKIAIOSFODNN7EXAMPLE'
   OR sourceipaddress = '198.51.100.89'
ORDER BY eventtime ASC;`
      },
      realWorldScenario: {
        title: 'The Hidden Persistence Discovered via Forensic Snapshot',
        incident: 'An attacker compromised an EC2 web server and was detected running a miner. The DevOps team wanted to terminate the instance, but the security team took an EBS snapshot first and mounted it in their forensics lab. Inspection of the disk revealed that the attacker had added an unauthorized SSH public key to `/home/ubuntu/.ssh/authorized_keys`, created a cron job in `/etc/cron.d/sync`, and planted a persistent web shell. Had the instance simply been rebooted or cleaned manually, the persistence would have survived.',
        impact: 'Full discovery of all persistence artifacts allowed 100% complete eradication.',
        detectionMethod: 'Forensic filesystem timeline analysis using Plaso/log2timeline on the cloned EBS volume.'
      },
      commonBeginnerMistakes: [
        'Logging into the compromised instance via SSH and running commands that overwrite memory and file access timestamps.',
        'Attaching a forensic snapshot volume as read-write, contaminating the filesystem metadata.',
        'Not checking CloudTrail for actions executed in other AWS regions during the intrusion window.',
        'Searching only for the username rather than the specific temporary STS Session Name or AccessKeyId.'
      ],
      whatACloudSecEngineerChecks: [
        'Snapshot all EBS volumes attached to compromised instances: `aws ec2 create-snapshot`.',
        'Calculate SHA-256 hash of the snapshot to establish chain of custody.',
        'Query Athena for all API actions associated with the attacker\'s IP address and session context.',
        'Inspect VPC Flow Logs for outbound data transfer volumes indicating exfiltration.'
      ],
      codeSnippet: {
        language: 'bash',
        title: 'CLI: Create Forensic Snapshot of Compromised EC2 Volume with Custody Tags',
        code: `# Capture an immediate forensic snapshot tagged with incident tracking metadata
aws ec2 create-snapshot \\
    --volume-id vol-0123456789abcdef0 \\
    --description "FORENSIC-EVIDENCE: Incident INC-2026-0842 - Host i-0a1b2c3d4e5f" \\
    --tag-specifications 'ResourceType=snapshot,Tags=[{Key=SecurityIncident,Value=INC-2026-0842},{Key=CustodyOwner,Value=SecurityIRTeam},{Key=PreserveEvidence,Value=DoNotDelete}]'`
      },
      interviewQuestions: [
        {
          question: 'How do you perform a digital forensics investigation on a compromised Amazon EC2 instance while maintaining strict evidentiary integrity?',
          interviewerRationale: 'Evaluates forensic methodology, chain of custody, and cloud-specific investigation workflows.',
          modelAnswer: '1) Network Containment: Isolate the instance using a quarantine security group (dropping all ingress and egress) while keeping the instance running. 2) Volatile Memory Capture: If feasible, capture RAM using SSM runbooks or LiME before stopping the instance. 3) Disk Acquisition: Create point-in-time EBS snapshots of all attached volumes. 4) Chain of Custody: Tag the snapshots with the Incident ID, timestamp, and investigator name, and generate SHA-256 hashes. 5) Account Isolation: Share and copy the snapshots into an isolated Forensic AWS Account with separate credentials. 6) Analysis: In the forensic account, create new EBS volumes from the snapshots and attach them as secondary, read-only drives (`mount -o ro,noexec`) to an analysis workstation running autopsy or SIFT tools, ensuring the original evidence is never altered.'
        },
        {
          question: 'In AWS CloudTrail logs, what is the significance of the "userIdentity.sessionContext" field during an investigation?',
          interviewerRationale: 'Tests deep knowledge of IAM temporary credentials and assume-role forensic attribution.',
          modelAnswer: 'When API calls are made using temporary credentials issued by AWS STS (via IAM Roles), `userIdentity.arn` shows the assumed role ARN, but `userIdentity.sessionContext.sessionIssuer` and `userIdentity.sessionContext.attributes` show WHO originally assumed the role, the creation timestamp, whether MFA was used, and the specific `RoleSessionName`. This allows investigators to trace the complete identity lineage back to the original human identity, SSO SAML subject, or automated pipeline that initiated the session.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Digital Forensics and Evidence Preservation in the Cloud',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Whitepaper: Automated Forensic Analysis in AWS',
          url: 'https://docs.aws.amazon.com/whitepapers/latest/automated-forensic-analysis-in-aws/automated-forensic-analysis-in-aws.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Blog: How to Mount Forensic EBS Volumes Safely',
          url: 'https://aws.amazon.com/blogs/security/how-to-automate-forensic-disk-collection-in-aws/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'When attaching a cloned forensic EBS volume to an analysis workstation, which mount options should always be specified to preserve evidence integrity?',
        options: [
          { id: 'a', text: 'mount -o rw,exec (Read-Write with execution)', isCorrect: false, explanation: 'Read-write alters filesystem metadata and file access times.' },
          { id: 'b', text: 'mount -o ro,noexec (Read-Only with no execution)', isCorrect: true, explanation: 'Correct! Read-only preserves access timestamps and prevents executing malicious code.' },
          { id: 'c', text: 'mount -t nfs -o sync', isCorrect: false, explanation: 'NFS is for network filesystems, not local forensic block devices.' },
          { id: 'd', text: 'Format the volume with mkfs.ext4 first.', isCorrect: false, explanation: 'Formatting destroys all evidence on the disk.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-ir-01',
        title: 'Investigation: Forensic Timeline Analysis with Athena SQL',
        url: '/investigations',
        description: 'Query CloudTrail and VPC Flow Logs in Athena to reconstruct the exact 4-hour timeline of an adversary.'
      }
    },
    {
      id: 'ir-containment',
      title: 'Containment Strategies & Isolation Workflows',
      pathId: 'incident-response',
      level: 'Advanced',
      estimatedTime: '24 min read • 6 min check',
      badge: 'Phase 3: Containment',
      summary: 'Stop active damage without destroying evidence. Implement Quarantine Security Groups, revoke active IAM STS sessions via inline Deny policies, and cut off attacker footholds immediately.',
      overview: `**Containment** is the phase where responders take decisive action to stop the adversary from causing further damage, moving laterally, or exfiltrating data, while preserving critical evidence for forensic analysis.

**The Two Pillars of Cloud Containment**:
1. **Network Containment (EC2 / Containers)**:
   - **The Quarantine Security Group Pattern**: Replace the existing security groups on the compromised instance\'s ENI with a dedicated \`Quarantine-SG\`.
   - The Quarantine SG has:
     - **Inbound**: ZERO rules (drops all incoming traffic).
     - **Outbound**: ZERO rules (drops all outgoing traffic, immediately cutting off active reverse shells, command-and-control beacons, and exfiltration streams).
     - Optional: Allow port 443 ONLY to the private IP of a forensic analysis server or Systems Manager endpoint.
   - **Why this is superior to stopping/terminating**: The instance remains powered on, preserving RAM, active processes, and open network socket states!
2. **Identity Containment (IAM Users & Roles)**:
   - **Step 1: Deactivate Static Credentials**: Set access keys to \`Inactive\` (\`aws iam update-access-key --status Inactive\`).
   - **Step 2: Revoke Active Temporary Sessions**: Deleting or deactivating a key does NOT invalidate temporary STS credentials already issued! To immediately kill active sessions, attach an inline policy with an explicit Deny for all actions where \`aws:TokenIssueTime\` is prior to the current timestamp.
   - **Step 3: Reset Console Passwords & Delete Login Profiles**.`,
      whyItMatters: 'Deactivating an IAM user key does NOT terminate active STS sessions; an attacker who assumed a role can continue operating for up to 12 hours. Applying an immediate `TokenIssueTime` deny policy invalidates all active sessions within 5 seconds.',
      securityRisks: [
        'Failing to revoke active STS sessions, allowing the attacker to continue operating after keys are disabled.',
        'Terminating instances prematurely, alerting the adversary and destroying volatile evidence.',
        'Accidentally isolating production systems due to inaccurate asset identification.',
        'Not checking for backdoor roles or secondary keys created by the attacker prior to containment.'
      ],
      bestPractices: [
        'Pre-create a Quarantine Security Group in every VPC during peacetime so it is instantly available.',
        'Use the IAM console "Revoke Sessions" button or deploy a `TokenIssueTime` Deny policy to kill active role sessions.',
        'Maintain automated Lambda containment runbooks triggered by high-severity EventBridge findings.',
        'Ensure the security team retains emergency break-glass permissions that cannot be locked out by containment policies.'
      ],
      keyTakeaways: [
        'Containment must isolate the threat while preserving running RAM and disk state.',
        'Quarantine Security Groups remove all inbound and outbound rules, killing C2 beacons instantly.',
        'Deactivating an access key does not revoke active STS sessions — use an aws:TokenIssueTime Deny policy.',
        'Isolate both the network layer (Security Groups) and the identity layer (IAM).'
      ],
      diagram: `
+-------------------------------------------------------------------------------------------------+
|                                 QUARANTINE ISOLATION SECURITY GROUP PATTERN                     |
|                                                                                                 |
|   BEFORE CONTAINMENT (ACTIVE INFECTION):                                                        |
|   [ Internet C2 Server ] <==== (Active Reverse Shell) ====> [ Compromised EC2 Instance ]        |
|                                                             Security Group: sg-production-web   |
|                                                             Inbound: 443, Outbound: All         |
|                                                                                                 |
|   CONTAINMENT ACTION:                                                                           |
|   Security Team / Lambda executes: Replace Security Group with sg-quarantine                    |
|                                                                                                 |
|   AFTER CONTAINMENT (ISOLATED & PRESERVED):                                                     |
|   [ Internet C2 Server ]   X (CONNECTION DROPPED!) X        [ Compromised EC2 Instance ]        |
|                                                             Security Group: sg-quarantine       |
|                                                             Inbound: NONE (0 rules)             |
|                                                             Outbound: NONE (0 rules)            |
|                                                             * Instance remains running!         |
|                                                             * RAM & processes preserved!        |
+-------------------------------------------------------------------------------------------------+
`,
      realWorldScenario: {
        title: 'The Persistent Stolen Role Session',
        incident: 'A security engineer discovered that an attacker was using an IAM access key to dump S3 customer files. The engineer clicked "Deactivate Key" in the IAM console and assumed the incident was contained. Two hours later, customer files were still being downloaded! The attacker had used the key to call `sts:AssumeRole` before the key was disabled, obtaining a 12-hour temporary session token that remained valid. The team had to attach an emergency `TokenIssueTime` Deny policy to immediately kill the active session.',
        impact: 'Continued exfiltration for 2 hours due to incomplete credential containment.',
        detectionMethod: 'S3 Data Events CloudTrail stream showed continued GetObject API calls from the assumed role session.'
      },
      commonBeginnerMistakes: [
        'Believing that deactivating an IAM user key terminates already-issued STS session tokens.',
        'Deleting the security group attached to a live instance (AWS API will reject deleting an in-use SG; you must replace it!).',
        'Rebooting the server, which kills volatile RAM evidence and notifies the attacker.',
        'Failing to isolate cross-account trust roles that the attacker may have assumed.'
      ],
      whatACloudSecEngineerChecks: [
        'Verify compromised EC2 instance has only the Quarantine Security Group attached: `aws ec2 describe-instances`.',
        'Verify active IAM sessions are revoked using an inline `TokenIssueTime` policy.',
        'Confirm that the compromised user\'s access keys are set to `Status: Inactive`.',
        'Check CloudTrail to confirm that subsequent API calls from the attacker return `403 AccessDenied`.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: Emergency IAM Revocation Policy (Invalidating Active STS Tokens)',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RevokeAllActiveSessionsPriorToNow",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "DateLessThan": {
          "aws:TokenIssueTime": "2026-03-14T04:30:00Z"
        }
      }
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'If you deactivate an IAM user\'s access keys, why can an attacker still continue making AWS API calls, and how do you immediately terminate their access?',
          interviewerRationale: 'A staple Senior Incident Response interview question testing deep understanding of AWS STS session mechanics.',
          modelAnswer: 'Deactivating an IAM access key only prevents the key from signing NEW requests or issuing NEW temporary tokens. If the attacker previously called `sts:GetSessionToken` or `sts:AssumeRole`, STS issued temporary credentials (Access Key starting with ASIA, Secret Key, and Session Token) with an expiration timestamp that can be valid for up to 12 or 36 hours. The AWS authorization engine validates the signature against the STS token independently of the original key state. To immediately terminate active sessions, you must attach an inline policy to the user or role with an explicit Deny on `*` with a condition `DateLessThan` on `aws:TokenIssueTime` set to the current UTC timestamp. This immediately rejects any API call signed with a token issued prior to that moment.'
        },
        {
          question: 'How does a Quarantine Security Group allow security teams to isolate an EC2 instance without powering it down?',
          interviewerRationale: 'Evaluates live response methodology, volatile forensics, and network isolation.',
          modelAnswer: 'A Quarantine Security Group is pre-configured with zero inbound rules and zero outbound rules. Using `aws ec2 modify-instance-attribute --groups <Quarantine-SG-ID>`, responders replace the instance\'s existing security groups with the quarantine group on all attached ENIs. Because Security Groups are evaluated statefully at the virtual hypervisor interface, replacing the group immediately terminates all existing TCP connections (killing attacker reverse shells and C2 beacons) and blocks all new inbound/outbound packets. Because the instance remains powered on, volatile memory (RAM), open process trees, unwritten logs, and temporary files remain preserved for live forensic analysis.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Automated Incident Containment and Remediation',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Revoking IAM Role Temporary Security Credentials',
          url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Security Blog: Isolating Compromised EC2 Instances with Quarantine Security Groups',
          url: 'https://aws.amazon.com/blogs/security/how-to-automate-incident-response-to-contain-compromised-ec2-instances/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'An attacker stole an IAM role credential valid for 6 hours. You need to immediately block all actions by this session without deleting the role itself. What condition key in an explicit Deny policy accomplishes this?',
        options: [
          { id: 'a', text: '"aws:SecureTransport": "false"', isCorrect: false, explanation: 'This enforces TLS, but does not revoke sessions.' },
          { id: 'b', text: '"aws:TokenIssueTime": DateLessThan <CurrentTimestamp>', isCorrect: true, explanation: 'Correct! Denying actions where TokenIssueTime is prior to the current time immediately invalidates all active STS sessions.' },
          { id: 'c', text: '"aws:CurrentTime": DateGreaterThan <Now>', isCorrect: false, explanation: 'This evaluates request time, not the token generation time.' },
          { id: 'd', text: '"aws:PrincipalArn": "arn:aws:iam::*:root"', isCorrect: false, explanation: 'This matches the root account, not temporary role tokens.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-ir-02',
        title: 'Investigation: Emergency STS Session Revocation & Quarantine Isolation',
        url: '/investigations',
        description: 'Execute rapid containment protocols on a live compromised IAM role and isolate affected EC2 instances.'
      }
    },
    {
      id: 'ir-remediation',
      title: 'Remediation, Eradication & Vulnerability Removal',
      pathId: 'incident-response',
      level: 'Intermediate',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Phase 4: Eradication',
      summary: 'Eliminate root causes and eradicate threats completely. Patch software vulnerabilities, rotate all associated secrets, correct Infrastructure as Code (Terraform) drift, and roll clean golden AMIs.',
      overview: `**Eradication and Remediation** is the phase where responders eliminate the components of the incident (malware, compromised credentials, unpatched vulnerabilities) and fix the root architectural weaknesses that enabled the breach.

**Core Steps of Cloud Eradication**:
1. **Root-Cause Elimination**:
   - Patch the underlying vulnerability (e.g. updating an out-of-date Apache Log4j library, fixing an unescaped SQL parameter, or closing a public security group).
2. **Total Credential & Secret Turnover**:
   - Assume that ANY secret, API token, database password, or private key accessible on the compromised host or account was exfiltrated.
   - Rotate all database master credentials in AWS Secrets Manager.
   - Re-issue all application API keys and rotate TLS certificates.
3. **Rebuilding from Immutable Golden Images (Never "Clean" an Infected Host!)**:
   - In cloud computing, **never attempt to manually "disinfect" or remove malware from an infected EC2 instance or container**. Attackers leave hidden rootkits and kernel hooks.
   - **The Cloud Native Eradication Standard**: Terminate the compromised instance completely. Build a fresh, hardened machine image (Golden AMI) using automated pipelines (Packer/EC2 Image Builder) with patched software, and deploy clean instances via Auto Scaling.
4. **Fixing Infrastructure as Code (IaC)**:
   - If the misconfiguration was deployed via Terraform or CloudFormation, update the template and commit the fix to source control. Never make manual "click-ops" fixes in the AWS Console that will be overwritten on the next deployment!`,
      whyItMatters: 'Manual "cleanup" of an infected server has an 80%+ failure rate. Adopting immutable cloud patterns (destroying the infected instance and deploying a freshly baked golden image) guarantees complete eradication.',
      securityRisks: [
        'Attempting to manually delete malware files and leaving hidden backdoors or rootkits active.',
        'Fixing an issue in the AWS Console without updating the Terraform source code, causing the vulnerability to reappear on the next CI/CD deploy (drift).',
        'Rotating the primary access key but forgetting to rotate secondary credentials stored on the instance.',
        'Rushing into production before root cause verification is completed.'
      ],
      bestPractices: [
        'Treat cloud instances as "cattle, not pets": terminate infected instances and redeploy from verified clean AMIs.',
        'Rotate all secrets stored in AWS Secrets Manager and SSM Parameter Store associated with the workload.',
        'Commit all security remediations into Infrastructure as Code (Terraform) and enforce automated PR security scans.',
        'Run Amazon Inspector to verify that new golden AMIs contain zero critical CVEs before deployment.'
      ],
      keyTakeaways: [
        'Never disinfect an infected cloud instance; terminate it and redeploy from a clean, hardened golden image.',
        'Rotate all secrets and credentials accessible from the compromised environment.',
        'Remediate vulnerabilities in Infrastructure as Code (IaC) to prevent configuration drift.',
        'Validate remediation with automated vulnerability scanning (Amazon Inspector).'
      ],
      realWorldScenario: {
        title: 'The Reappearing Vulnerability via Terraform Drift',
        incident: 'An incident responder manually removed a public `0.0.0.0/0` SSH rule from a security group in the AWS Console following an intrusion. Two weeks later, the DevOps team ran a routine `terraform apply` for a feature release. Because the Terraform code in Git still contained the public SSH rule, Terraform re-applied the open rule to production, and the exact same attacker re-compromised the environment 6 hours later.',
        impact: 'Second breach of the same environment due to failure to remediate in code.',
        detectionMethod: 'GuardDuty alert fired on SSH brute force on the newly re-opened security group.'
      },
      commonBeginnerMistakes: [
        'Modifying security groups or IAM policies manually in the console without committing changes to Terraform.',
        'Assuming antivirus software on a Linux server completely cleans rootkits.',
        'Rotating the user\'s AWS password but forgetting to rotate their active access keys.',
        'Not checking GitHub commit history for the source of leaked credentials.'
      ],
      whatACloudSecEngineerChecks: [
        'Verify that all compromised instances have been terminated and replaced with verified AMIs.',
        'Confirm Secrets Manager secret rotation: `aws secretsmanager rotate-secret --secret-id <SecretId>`.',
        'Verify Terraform plan output confirms zero security group drift: `terraform plan`.',
        'Run Amazon Inspector scan on the replacement AMI to confirm 0 critical CVEs.'
      ],
      codeSnippet: {
        language: 'bash',
        title: 'CLI: Trigger Immediate Secrets Manager Secret Rotation',
        code: `# Trigger immediate automated rotation of a database password that may have been compromised
aws secretsmanager rotate-secret \\
    --secret-id production/database/master-credentials \\
    --rotation-lambda-arn arn:aws:lambda:us-east-1:123456789012:function:RotateDatabaseSecret`
      },
      interviewQuestions: [
        {
          question: 'Why is the cloud-native approach to malware eradication "terminate and redeploy" rather than running antivirus cleanup scripts on the infected virtual machine?',
          interviewerRationale: 'Evaluates understanding of immutable infrastructure, modern DevOps security, and anti-forensics threats.',
          modelAnswer: 'In traditional on-premises environments, servers were customized pets that were difficult to rebuild, forcing teams to attempt manual malware removal. However, modern adversaries install kernel-level rootkits, modify system binaries, and place hidden cron jobs that antivirus scanners routinely miss. In the cloud, infrastructure is immutable and ephemeral. By capturing forensic snapshots first, terminating the infected instance, and redeploying a clean instance from a hardened, version-controlled Golden AMI via automated CI/CD pipelines, you mathematically guarantee that 100% of adversary artifacts are eliminated with zero lingering backdoors.'
        },
        {
          question: 'What is Configuration Drift in the context of security incident remediation, and how do you prevent it?',
          interviewerRationale: 'Tests understanding of Infrastructure as Code (IaC) governance and production change control.',
          modelAnswer: 'Configuration Drift occurs when emergency security changes (e.g. closing an open security group port or tightening an S3 bucket policy) are made manually in the AWS Console ("click-ops") without updating the underlying Infrastructure as Code (Terraform or CloudFormation) repository. The next time a developer runs `terraform apply`, Terraform detects the manual console change as drift and reverts the security fix back to the insecure template state. To prevent this, all remediations must be committed directly to the IaC repository, tested in CI/CD, and deployed through the automated pipeline. Organizations also use automated drift detection tools (like AWS Config or driftctl) to alert on unmanaged manual changes.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Building Resilient and Secure Golden Image Pipelines',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Rotating Secrets in AWS Secrets Manager',
          url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html',
          type: 'Documentation'
        },
        {
          title: 'AWS EC2 Image Builder User Guide for Hardened Golden AMIs',
          url: 'https://docs.aws.amazon.com/imagebuilder/latest/userguide/what-is-image-builder.html',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Following a security incident involving an EC2 instance, what is the industry best practice for eradicating the malware?',
        options: [
          { id: 'a', text: 'Run an antivirus scan and restart the Apache web service.', isCorrect: false, explanation: 'Manual cleanup routinely misses kernel rootkits and persistent backdoors.' },
          { id: 'b', text: 'Preserve forensic snapshots, terminate the compromised instance, and redeploy a fresh instance from a verified, patched Golden AMI via Infrastructure as Code.', isCorrect: true, explanation: 'Correct! Immutable infrastructure replacement guarantees complete eradication of adversary artifacts.' },
          { id: 'c', text: 'Change the root password and leave the server running.', isCorrect: false, explanation: 'Leaving the compromised server running allows backdoors to persist.' },
          { id: 'd', text: 'Disconnect the Internet Gateway permanently.', isCorrect: false, explanation: 'Disconnecting the IGW breaks production connectivity across the VPC.' }
        ]
      },
      bridgeToLabs: {
        type: 'Playbook',
        id: 'playbook-03',
        title: 'Job Playbook: Compromised Secret Rotation & Immutable Redeployment',
        url: '/playbooks',
        description: 'Execute an end-to-end SOP to rotate compromised database secrets and redeploy clean application workloads.'
      }
    },
    {
      id: 'ir-recovery',
      title: 'Recovery, Validation & Enhanced Monitoring',
      pathId: 'incident-response',
      level: 'Intermediate',
      estimatedTime: '18 min read • 5 min check',
      badge: 'Phase 5: Recovery',
      summary: 'Restore production safely without reinfection. Master restoring from clean immutable backups, canary traffic validation, deploying enhanced monitoring, and establishing formal criteria for service restoration.',
      overview: `**Recovery** is the phase where systems are restored to normal operational service and tested to verify that they are functioning cleanly without reinfection or degradation.

**The 4 Pillars of Secure Cloud Recovery**:
1. **Restoring from Clean, Verified Backups**:
   - Determine the exact point in time prior to the initial compromise (using the timeline developed during the Investigation phase).
   - Restore database snapshots or S3 backups from an immutable backup vault (AWS Backup Vault Lock) created BEFORE the attacker achieved initial access.
2. **Canary & Phased Traffic Ramp-Up**:
   - Never switch 100% of production traffic to restored systems immediately.
   - Use Application Load Balancer weighted routing or Amazon Route 53 weighted DNS records to route 5% of traffic initially (Canary phase).
   - Monitor error rates, latency, and security logs for 30 minutes before ramping up to 25%, 50%, and 100%.
3. **Enhanced Post-Incident Monitoring**:
   - Lower alert thresholds in CloudWatch and GuardDuty for 14 to 30 days post-incident.
   - Deploy high-frequency synthetic canaries (CloudWatch Synthetics) to continuously test critical business transactions.
4. **Formal Criteria for Service Handover**:
   - The Incident Commander, Lead Security Engineer, and Engineering VP must formally sign off on the recovery checklist before incident closure.`,
      whyItMatters: 'Rushing systems back into production without canary validation often re-triggers the attack or restores corrupted data, forcing a secondary emergency shutdown and compounding business downtime.',
      securityRisks: [
        'Restoring a database backup that already contains attacker backdoors or SQL injection payloads.',
        'Opening 100% of traffic immediately, overwhelming newly restored cache layers and crashing databases.',
        'Removing enhanced security monitoring too early, missing secondary adversary comeback attempts.',
        'Not validating data integrity against audit logs prior to reopening financial services.'
      ],
      bestPractices: [
        'Restore from backup points verified to precede the earliest known attacker activity.',
        'Deploy canary traffic splits (e.g. 5% -> 25% -> 100%) using ALB weighted target groups.',
        'Maintain high-sensitivity CloudWatch alarms and GuardDuty monitoring for 30 days post-incident.',
        'Conduct automated data reconciliation to verify database consistency post-restore.'
      ],
      keyTakeaways: [
        'Verify backup point-in-time precedes attacker initial access.',
        'Use canary traffic shifting to validate restored systems before full cutover.',
        'Enforce 14-30 days of enhanced post-incident monitoring.',
        'Obtain formal multi-stakeholder sign-off before closing the recovery phase.'
      ],
      realWorldScenario: {
        title: 'The Premature Cutover Disaster',
        incident: 'Following a ransomware attack on a transactional database, the IT team restored the most recent snapshot taken 2 hours before the ransom note appeared. They immediately reopened the application to full customer traffic. Unfortunately, the attacker had compromised the system 14 hours earlier, and the restored database contained the attacker\'s backdoor triggers. The attacker re-encrypted the database 45 minutes later.',
        impact: 'Secondary outage, loss of customer trust, and an additional 18 hours of downtime.',
        detectionMethod: 'Security audit revealed that the restoration point was selected without completing forensic timeline analysis.'
      },
      commonBeginnerMistakes: [
        'Restoring the latest backup without checking if it was created after the adversary breached the perimeter.',
        'Failing to test database read/write integrity before directing customer traffic.',
        'Immediately returning to peacetime monitoring thresholds instead of maintaining heightened post-incident alerting.',
        'Not notifying customer support of the staged recovery schedule.'
      ],
      whatACloudSecEngineerChecks: [
        'Verify restoration point timestamp is strictly prior to earliest CloudTrail indicator of compromise.',
        'Confirm ALB target health checks report 100% healthy across all targets.',
        'Review CloudWatch latency and 5XX error metrics during the canary ramp-up phase.',
        'Verify enhanced CloudWatch alarms are active for the post-incident observation period.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Terraform: ALB Weighted Target Group for 5% Canary Recovery Validation',
        code: `resource "aws_lb_listener_rule" "canary_recovery_test" {
  listener_arn = aws_lb_listener.front_end.arn
  priority     = 10

  action {
    type = "forward"
    forward {
      target_group {
        arn    = aws_lb_target_group.restored_canary_fleet.arn
        weight = 5 # 5% Canary Traffic to Restored Clean Fleet
      }
      target_group {
        arn    = aws_lb_target_group.maintenance_holding_page.arn
        weight = 95 # 95% Traffic temporarily held
      }
    }
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}`
      },
      interviewQuestions: [
        {
          question: 'How do you determine the safe point-in-time to restore a database backup following a ransomware or tampering incident?',
          interviewerRationale: 'Evaluates forensic timeline correlation with disaster recovery restoration decisions.',
          modelAnswer: 'You must ground the restoration decision in the forensic timeline established during the Investigation phase. Identify the earliest confirmed Indicator of Compromise (IoC) — such as the first anomalous API call, initial phishing login, or unauthorized privilege escalation in CloudTrail. You then select the latest automated backup or point-in-time recovery (PITR) snapshot created PRIOR to that initial access timestamp (with a safety buffer of several hours). Restoring any snapshot taken after initial access risks restoring attacker backdoors, web shells, or pre-planted logic bombs.'
        },
        {
          question: 'What is the purpose of canary traffic shifting during service recovery, and how is it implemented in AWS?',
          interviewerRationale: 'Assesses deployment safety, resilience validation, and load balancing mechanics.',
          modelAnswer: 'Canary traffic shifting allows you to introduce production traffic gradually (e.g. 5% -> 25% -> 100%) to a newly restored system rather than flipping 100% of traffic instantly. This validates: 1) That restored database connections and caches can handle load without crashing, 2) That no latent errors or application exceptions occur on real requests, and 3) That security monitors detect zero unexpected outbound connections. In AWS, this is implemented using Application Load Balancer Weighted Target Groups or AWS Route 53 Weighted Routing, allowing precise percentage-based traffic control.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Disaster Recovery and Business Continuity Architecture',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Documentation: Point-in-Time Recovery for Amazon DynamoDB and RDS',
          url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html',
          type: 'Documentation'
        },
        {
          title: 'AWS Architecture Reference: Safe Deployments with Canary Testing on ALB',
          url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html#target-group-weight',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'When restoring a production database after an incident, why is it dangerous to simply restore the most recent snapshot taken right before the alarm sounded?',
        options: [
          { id: 'a', text: 'Because AWS charges double for restoring recent snapshots.', isCorrect: false, explanation: 'Restoration pricing is not based on snapshot age.' },
          { id: 'b', text: 'Because the attacker may have compromised the database hours or days before detection, meaning the most recent snapshot already contains malicious modifications or backdoors.', isCorrect: true, explanation: 'Correct! Dwell time means the initial compromise often precedes the detection alarm by hours, days, or weeks.' },
          { id: 'c', text: 'Because RDS does not support point-in-time recovery within 24 hours.', isCorrect: false, explanation: 'RDS PITR supports restoration down to the latest 5 minutes.' },
          { id: 'd', text: 'Because recent snapshots cannot be encrypted.', isCorrect: false, explanation: 'Recent snapshots support full KMS encryption.' }
        ]
      },
      bridgeToLabs: {
        type: 'Simulator',
        id: 'sim-02',
        title: 'SOC On-Call Simulator: Safe Recovery & Canary Cutover',
        url: '/internship-simulator',
        description: 'Lead the recovery phase: select clean snapshot restoration points and execute staged canary traffic shifts.'
      }
    },
    {
      id: 'ir-lessons-learned',
      title: 'Lessons Learned, Post-Mortems & Guardrail Engineering',
      pathId: 'incident-response',
      level: 'Intermediate',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Phase 6: Post-Mortem',
      summary: 'Close the loop on security incidents. Lead blameless post-mortems, identify systemic root causes (the 5 Whys), track corrective action items to completion, and engineer permanent preventative guardrails.',
      overview: `The final and most crucial phase of the incident response lifecycle is **Lessons Learned** (also known as the Post-Incident Review [PIR] or Post-Mortem).

**The Blameless Post-Mortem Philosophy**:
- Incidents are viewed as **systemic failures**, never individual human failures.
- If an engineer clicked a phishing link or made a bucket public, the failure is that the **architecture allowed a single human action to cause a catastrophic breach without guardrails!**
- Blaming individuals creates a culture of fear where employees hide mistakes and delay reporting breaches. A blameless culture encourages rapid reporting and deep structural improvements.

**The 5 Whys Root-Cause Analysis Framework**:
Example:
- *Why did the S3 bucket leak customer data?* -> Because it was public.
- *Why was it public?* -> Because a developer disabled Block Public Access.
- *Why did the developer disable it?* -> Because an external service needed to upload files.
- *Why was direct S3 used instead of an API?* -> Because no secure presigned URL service existed.
- *Why was there no automated preventative guardrail?* -> Because the account lacked an SCP blocking public S3 changes.
- **Root Architectural Fix**: Deploy an SCP blocking S3 public access, and build an automated pre-signed URL ingestion microservice!

**Tracking Action Items to Completion**:
Every post-mortem document must produce prioritized, assigned, and dated engineering action items (Preventive, Detective, and Responsive) tracked in Jira/ServiceNow to ensure the exact same incident can never happen again.`,
      whyItMatters: 'A team that does not conduct rigorous post-mortems is doomed to repeat the same incident. Converting painful security failures into permanent automated guardrails is how elite cloud security engineering organizations are forged.',
      securityRisks: [
        'Failing to conduct a post-mortem, allowing the same vulnerability to be exploited again weeks later.',
        'Blaming individual engineers, leading to a toxic culture where teams hide security vulnerabilities.',
        'Creating a list of action items that are never prioritized or tracked to completion.',
        'Not updating runbooks, leaving the next on-call engineer unprepared.'
      ],
      bestPractices: [
        'Conduct the blameless post-mortem meeting within 48-72 hours of incident closure while memories are fresh.',
        'Engage cross-functional stakeholders: Security, DevOps, Engineering, Product, and Legal.',
        'Implement "Preventative Guardrails as Code" (SCPs, AWS Config rules, Terraform policies) for every identified root cause.',
        'Publish an internal sanitized post-mortem report to educate the entire engineering organization.'
      ],
      keyTakeaways: [
        'Blameless culture focuses on systemic and architectural flaws, not human fault.',
        'Use the 5 Whys technique to dig past surface symptoms to the root systemic cause.',
        'Every post-mortem must produce actionable engineering tickets with owners and deadlines.',
        'Turn incidents into automated preventative guardrails (SCPs and Config rules).'
      ],
      investigationExample: {
        title: 'Post-Mortem Timeline & Action Item Matrix',
        description: 'Standard enterprise post-mortem table mapping incident phases to corrective engineering guardrails.',
        code: `================================================================================
INCIDENT POST-MORTEM: INC-2026-0842 (Exposed CI/CD Deployer Key)
================================================================================
Dwell Time: 38 minutes | Time to Detection: 4 minutes | Time to Contain: 11 minutes
Total Data Impact: ZERO customer records exfiltrated.
--------------------------------------------------------------------------------
ACTION ITEM MATRIX:
1. PREVENTIVE (P0 - Due: 3 Days): 
   Migrate GitHub Actions to AWS OIDC Federation; permanently eliminate static 
   IAM access keys in CI/CD. Assigned: Lead DevOps Engineer.
2. PREVENTIVE (P0 - Due: 5 Days): 
   Deploy AWS Organizations SCP denying EC2 instance launches in unapproved regions.
   Assigned: Cloud Security Architect.
3. DETECTIVE (P1 - Due: 7 Days): 
   Add EventBridge rule paging on-call within 60s for any unrecognized ASN login.
   Assigned: SOC Lead.
4. DOCUMENTATION (P2 - Due: 10 Days): 
   Update Incident Runbook #04 (Compromised Key Triage) with new Athena queries.
   Assigned: Incident Responder.
================================================================================`
      },
      realWorldScenario: {
        title: 'The Blameless Post-Mortem That Saved the Company',
        incident: 'A junior engineer accidentally pushed AWS root credentials to a public repository. Rather than firing the engineer, leadership held a blameless post-mortem. The team asked: "Why did our systems allow a developer to have access to the root account in the first place? Why did our git push hooks not catch the key?" The team deployed an SCP blocking root API calls, implemented pre-commit secret scanners across all git repositories, and enrolled all developers in AWS IAM Identity Center (SSO). Six months later, a contractor tried to commit an API key, but the pre-commit hook blocked it instantly.',
        impact: 'A systemic vulnerability permanently eliminated across 400 developers.',
        detectionMethod: 'Security cultural maturity transformed a near-miss into an automated enterprise defense.'
      },
      commonBeginnerMistakes: [
        'Assigning personal blame to engineers instead of fixing architectural guardrails.',
        'Filing a post-mortem document and never looking at the action items again.',
        'Delaying the post-mortem meeting for weeks until critical details and logs are forgotten.',
        'Not sharing post-mortem lessons across other engineering teams in the company.'
      ],
      whatACloudSecEngineerChecks: [
        'Review the completed Post-Incident Review document for completeness and timeline accuracy.',
        'Verify that all high-priority (P0/P1) corrective action items have assigned Jira tickets and sprint dates.',
        'Confirm that new preventative SCPs or AWS Config rules have been deployed to production.',
        'Verify that the incident response runbook has been updated with the latest remediation steps.'
      ],
      codeSnippet: {
        language: 'json',
        title: 'Example: Preventative SCP Engineered from Post-Mortem (Restricting Unapproved Regions)',
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PostMortemGuardrailDenyUnapprovedRegions",
      "Effect": "Deny",
      "NotAction": [
        "iam:*",
        "organizations:*",
        "route53:*",
        "budgets:*",
        "wafv2:*",
        "cloudfront:*",
        "shield:*"
      ],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": [
            "us-east-1",
            "us-west-2"
          ]
        }
      }
    }
  ]
}`
      },
      interviewQuestions: [
        {
          question: 'What is a "Blameless Post-Mortem" and why is it considered a foundational principle in modern engineering and security teams?',
          interviewerRationale: 'Assesses security culture, leadership maturity, emotional intelligence, and systemic thinking.',
          modelAnswer: 'A blameless post-mortem assumes that people make decisions based on the information they had at the time, and that human error is a symptom of a flawed system, not the root cause. If you punish or blame an engineer for misconfiguring a resource, employees will actively hide mistakes, avoid reporting security anomalies, and delay containment out of fear. In a blameless post-mortem, the focus shifts to systemic questions: "Why did our guardrails allow this misconfiguration? Why was our detection delayed? How can we make it impossible for anyone to make this mistake again?" This fosters transparency, rapid reporting, and leads to durable preventative guardrails (like SCPs and pre-commit hooks) that protect the entire company.'
        },
        {
          question: 'Explain the "5 Whys" methodology and how you use it to identify the true root cause of a cloud security failure.',
          interviewerRationale: 'Evaluates analytical depth, structured problem solving, and ability to separate symptoms from causes.',
          modelAnswer: 'The 5 Whys is an iterative interrogative technique used to explore the cause-and-effect relationships underlying a problem. Rather than stopping at the immediate symptom (e.g. "An S3 bucket was public"), you ask "Why?" repeatedly: 1) Why was it public? A script uploaded files with a public ACL. 2) Why did the script use a public ACL? Because the developer copied a legacy code snippet from StackOverflow. 3) Why was legacy code used? Because the company had no standardized internal SDK or documentation for pre-signed URLs. 4) Why did AWS permit the public ACL? Because S3 Block Public Access was not enforced at the account level. 5) Why was Block Public Access not enforced? Because the account lacked an automated landing zone SCP guardrail. The root fix is not "tell developers not to copy code"; the root fix is deploying an SCP that blocks public access across all accounts permanently.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Building a Culture of Security and Continuous Improvement',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Well-Architected Framework: Security Pillar - Incident Response Phase',
          url: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/incident-response.html',
          type: 'Documentation'
        },
        {
          title: 'Google SRE Book: Postmortem Culture - Learning from Failure',
          url: 'https://sre.google/sre-book/postmortem-culture/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'During a post-mortem review, a manager demands that an engineer be formally reprimanded for accidentally disabling an S3 bucket policy. As the Senior Cloud Security Engineer, how should you respond?',
        options: [
          { id: 'a', text: 'Agree with the manager and revoke all of the engineer\'s AWS credentials permanently.', isCorrect: false, explanation: 'Blaming individuals destroys transparency and psychological safety.' },
          { id: 'b', text: 'Explain the principle of a blameless post-mortem: focus on why the system allowed a single engineer to disable a critical policy, and engineer an SCP that prevents anyone from disabling bucket policies in the future.', isCorrect: true, explanation: 'Correct! Elite security teams build systemic guardrails that make catastrophic mistakes impossible.' },
          { id: 'c', text: 'Cancel the post-mortem meeting to avoid conflict.', isCorrect: false, explanation: 'Canceling post-mortems guarantees the same failure will repeat.' },
          { id: 'd', text: 'Tell the team that security incidents cannot be prevented.', isCorrect: false, explanation: 'Incidents can be prevented through systemic guardrail engineering.' }
        ]
      },
      bridgeToLabs: {
        type: 'Simulator',
        id: 'sim-03',
        title: 'SOC On-Call Simulator: Post-Mortem & Preventative Guardrail Engineering',
        url: '/internship-simulator',
        description: 'Complete a full incident lifecycle: draft the blameless post-mortem and deploy preventive SCP guardrails.'
      }
    }
  ]
}
