/**
 * Real Cloud Security Job Labs & Standard Operating Procedures (SOPs)
 * 
 * Each lab represents an authentic daily workflow executed by Cloud Security Engineers,
 * SecOps Incident Responders, and DevSecOps professionals in enterprise environments.
 */

export const jobRoles = [
  { key: 'all', label: 'All Cloud Security Roles' },
  { key: 'cloud-sec-eng', label: 'Cloud Security Engineer' },
  { key: 'secops-analyst', label: 'SecOps / Incident Responder' },
  { key: 'devsecops', label: 'DevSecOps Specialist' },
  { key: 'cloud-architect', label: 'Cloud Security Architect' }
]

export const jobProcessStages = [
  {
    step: 1,
    title: 'Ticket Intake & Scoping',
    subtitle: 'Identify target environment, SLA, and affected assets',
    description: 'When a security alert fires or a ticket arrives (Jira/ServiceNow), verify the AWS Account ID, Region, and system tier (Prod vs Non-Prod) before taking any action.',
    analystMindset: 'Never execute changes in production without confirming change scope and blast radius boundaries.',
    essentialCommands: ['aws sts get-caller-identity', 'aws organizations describe-account --account-id <id>']
  },
  {
    step: 2,
    title: 'Reconnaissance & Forensic Baseline',
    subtitle: 'Extract live configuration state and CloudTrail telemetry',
    description: 'Query live AWS API endpoints to inspect the current policy, security group, or bucket ACL. Correlate with CloudTrail to identify who made the change and when.',
    analystMindset: 'Trust nothing without corroborating API telemetry. Capture the pre-remediation snapshot as compliance proof.',
    essentialCommands: ['aws cloudtrail lookup-events --lookup-attributes ...', 'aws iam get-role-policy ...']
  },
  {
    step: 3,
    title: 'Threat Modeling & Blast Radius',
    subtitle: 'Map to MITRE ATT&CK and quantify potential damage',
    description: 'Analyze what an adversary can access with the current permissions. Determine whether sensitive customer data, databases, or lateral pivot paths are exposed.',
    analystMindset: 'Classify risk based on realistic attack paths, not just CVSS scores. Focus on identity and data boundaries.',
    essentialCommands: ['aws iam simulate-principal-policy ...', 'aws ec2 describe-instances ...']
  },
  {
    step: 4,
    title: 'Minute-0 Tactical Containment',
    subtitle: 'Isolate compromised assets without destroying evidence',
    description: 'Apply immediate quarantine boundaries: attach an explicit DenyAll inline policy, revoke active STS temporary credentials, or isolate security groups.',
    analystMindset: 'Containment takes priority over permanent fixes. Avoid deleting users or instances, which erases volatile evidence.',
    essentialCommands: ['aws iam put-role-policy --policy-name QuarantineDeny ...', 'aws iam update-access-key --status Inactive']
  },
  {
    step: 5,
    title: 'Defensible Production Remediation',
    subtitle: 'Deploy hardened least-privilege policies via Infrastructure-as-Code',
    description: 'Implement the permanent architectural fix. Replace wildcards with specific actions, enforce MFA, mandate IMDSv2, or turn on S3 Block Public Access.',
    analystMindset: 'A security fix that breaks production business logic will be rolled back. Ensure least privilege meets application requirements.',
    essentialCommands: ['aws s3api put-public-access-block ...', 'aws ec2 modify-instance-metadata-options ...']
  },
  {
    step: 6,
    title: 'Verification & Audit Proof',
    subtitle: 'Prove zero residual risk and generate compliance artifacts',
    description: 'Re-run inspection queries to verify the attack surface is completely eliminated. Document the incident post-mortem and update security metrics for audit.',
    analystMindset: 'If you cannot mathematically or forensically prove the vulnerability is closed, the ticket is not resolved.',
    essentialCommands: ['aws s3api get-public-access-block ...', 'aws configservice get-compliance-details-by-config-rule ...']
  }
]

const rawRealLabs = [
  {
    id: 'lab-iam-escalation',
    labNumber: 'LAB-01',
    title: 'AWS IAM Privilege Escalation Containment & Least-Privilege Refactoring',
    jobRole: 'Cloud Security Engineer',
    roleKey: 'cloud-sec-eng',
    organization: 'FinTech Banking SaaS (PCI-DSS & SOC2 Certified)',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    scenarioSummary: 'Security Operations flagged an EC2 instance profile role (BankingApp-WorkerRole) granting wildcard `iam:*` and `s3:*` permissions. An alert indicates suspicious attempts to create shadow access keys.',
    targetServices: ['AWS IAM', 'AWS CloudTrail', 'AWS STS', 'Amazon EC2'],
    mitreTechnique: 'T1098.001 - Additional Cloud Credentials',
    steps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Pre-Flight Scoping',
        title: 'Verify Analyst Session & Target Role ARN',
        jobContext: 'In a real cloud security role, you must always confirm you are operating under the correct SecOps role in the target AWS account before querying resources.',
        consolePath: 'AWS Console > IAM > Dashboard > Verify Account ID matches Production (123456789012)',
        cliCommand: 'aws sts get-caller-identity',
        expectedOutput: JSON.stringify({
          UserId: 'AROAEXAMPLEANALYST:secops-session',
          Account: '123456789012',
          Arn: 'arn:aws:sts::123456789012:assumed-role/SecOps-IncidentResponder/analyst-session'
        }, null, 2),
        interviewTip: 'Interviewers love when candidates mention checking caller identity first. It demonstrates discipline and avoids accidental actions in the wrong account.',
        pitfallWarning: 'Never run containment scripts with local personal AWS credentials. Always use an assumed SecOps role tied to audit logs.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Forensic Baseline',
        title: 'Extract Attached Policies & Effective Permissions',
        jobContext: 'Before altering an active IAM role used by production applications, inspect both managed and inline policies to identify exactly where the wildcard resides.',
        consolePath: 'AWS Console > IAM > Roles > Search "BankingApp-WorkerRole" > Permissions tab > Expand policy JSON',
        cliCommand: 'aws iam get-role-policy --role-name BankingApp-WorkerRole --policy-name AppWorkerPolicy',
        expectedOutput: JSON.stringify({
          RoleName: 'BankingApp-WorkerRole',
          PolicyName: 'AppWorkerPolicy',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'OverlyPermissiveWorker',
                Effect: 'Allow',
                Action: ['iam:*', 's3:*', 'sqs:*'],
                Resource: '*'
              }
            ]
          }
        }, null, 2),
        interviewTip: 'Explain the difference between managed policies and inline policies. Inline policies embed directly in the principal and do not get reused accidentally across other roles.',
        pitfallWarning: 'Do not delete the policy immediately. If production services are actively calling SQS or S3, deleting the policy causes an instant service outage.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: CloudTrail Telemetry',
        title: 'Hunt for Unauthorized API Calls in CloudTrail',
        jobContext: 'Check if the role was used to perform privilege escalation actions like `CreateAccessKey` or `AttachUserPolicy` in the last 2 hours.',
        consolePath: 'AWS Console > CloudTrail > Event History > Filter: "Event source: iam.amazonaws.com"',
        cliCommand: 'aws cloudtrail lookup-events --lookup-attributes AttributeKey=Username,AttributeValue=BankingApp-WorkerRole --max-results 3',
        expectedOutput: JSON.stringify({
          Events: [
            {
              EventId: 'evt-98234-escalation',
              EventName: 'CreateAccessKey',
              EventTime: '2026-09-24T20:12:00Z',
              EventSource: 'iam.amazonaws.com',
              Username: 'BankingApp-WorkerRole',
              SourceIPAddress: '198.51.100.44'
            }
          ]
        }, null, 2),
        interviewTip: 'Highlight how you correlate SourceIPAddress with known NAT Gateways. If the IP is external to AWS VPC egress, credentials were leaked outside the environment.',
        pitfallWarning: 'CloudTrail Event History has a 15-minute delivery lag. Check CloudWatch Logs Insights for streaming near-real-time events.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Minute-0 Containment',
        title: 'Attach Explicit IAM Deny Boundary & Revoke Active STS Sessions',
        jobContext: 'To contain the blast radius without breaking valid production EC2 operations, attach an explicit deny on IAM manipulation and invalidate cached STS tokens.',
        consolePath: 'AWS Console > IAM > Roles > BankingApp-WorkerRole > Add Permissions > Create Inline Policy > Deny iam:*',
        cliCommand: 'aws iam put-role-policy --role-name BankingApp-WorkerRole --policy-name EmergencyQuarantine --policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":["iam:*"],"Resource":"*"}]}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Inline quarantine policy attached successfully. IAM actions immediately denied by explicit evaluation.'
        }, null, 2),
        interviewTip: 'In AWS IAM evaluation logic: Explicit Deny always trumps Allow. Adding an inline deny prevents escalation without disrupting safe SQS/S3 reads.',
        pitfallWarning: 'Do not delete the role or instance! Deleting the role leaves orphaned resources and erases STS session tracking.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Defensible Remediation',
        title: 'Refactor Policy to Scoped Least Privilege',
        jobContext: 'Deploy a tightly-scoped policy that grants only the exact S3 prefix and SQS queue ARNs needed for transaction ingestion.',
        consolePath: 'AWS Console > IAM > Roles > BankingApp-WorkerRole > Edit AppWorkerPolicy JSON > Paste scoped policy',
        cliCommand: 'aws iam put-role-policy --role-name BankingApp-WorkerRole --policy-name AppWorkerPolicy --policy-document \'{"Version":"2012-10-17","Statement":[{"Sid":"ScopedSQS","Effect":"Allow","Action":["sqs:ReceiveMessage","sqs:DeleteMessage"],"Resource":"arn:aws:sqs:us-east-1:123456789012:transactions-queue"},{"Sid":"ScopedS3","Effect":"Allow","Action":["s3:GetObject"],"Resource":"arn:aws:s3:::banking-records-prod/incoming/*"}]}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'AppWorkerPolicy updated. Wildcards removed. Scoped to specific queue and bucket ARN.'
        }, null, 2),
        interviewTip: 'Mention IAM Access Analyzer and CloudTrail-based policy generation. AWS can review 90 days of CloudTrail events to generate the exact minimal policy required.',
        pitfallWarning: 'Always specify `Resource` ARNs. A policy with specific actions like `s3:GetObject` on `Resource: "*"` is still an audit failure for sensitive buckets.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Simulate Principal Permissions & Remove Quarantine',
        jobContext: 'Use AWS IAM Policy Simulator to prove mathematically that `iam:CreateAccessKey` is denied while legitimate `sqs:ReceiveMessage` succeeds.',
        consolePath: 'AWS Console > IAM > Policy Simulator > Select BankingApp-WorkerRole > Run Simulation for iam:CreateAccessKey',
        cliCommand: 'aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123456789012:role/BankingApp-WorkerRole --action-names iam:CreateAccessKey sqs:ReceiveMessage',
        expectedOutput: JSON.stringify({
          EvaluationResults: [
            {
              EvalActionName: 'iam:CreateAccessKey',
              EvalDecision: 'implicitDeny',
              MatchedStatements: []
            },
            {
              EvalActionName: 'sqs:ReceiveMessage',
              EvalDecision: 'allowed',
              MatchedStatements: [{ SourcePolicyName: 'AppWorkerPolicy' }]
            }
          ]
        }, null, 2),
        interviewTip: 'Explain how you provide the simulator output to compliance auditors as signed evidence of remediation.',
        pitfallWarning: 'Once verified, clean up the emergency quarantine policy so future legitimate IAM updates managed by Terraform do not encounter conflicts.'
      }
    ]
  },
  {
    id: 'lab-s3-dlp-kms',
    labNumber: 'LAB-02',
    title: 'S3 Public Bucket Data Loss Prevention (DLP) & KMS Key Lockdown',
    jobRole: 'Cloud Infrastructure Security Specialist',
    roleKey: 'cloud-sec-eng',
    organization: 'Healthcare Technology Provider (HIPAA / HITECH Compliance)',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    scenarioSummary: 'An automated AWS Config rule flagged an S3 bucket containing Electronic Protected Health Information (ePHI) with S3 Block Public Access disabled and missing AWS KMS customer-managed key encryption.',
    targetServices: ['Amazon S3', 'AWS KMS', 'AWS Config', 'AWS CloudTrail'],
    mitreTechnique: 'T1530 - Data from Cloud Storage Object',
    steps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Pre-Flight Scoping',
        title: 'Query Current S3 Public Access Block Settings',
        jobContext: 'Before modifying a production healthcare storage bucket, query the 4 S3 Block Public Access flags to determine the exact vulnerability posture.',
        consolePath: 'AWS Console > Amazon S3 > Buckets > Select "medrecords-prod-patient-data" > Permissions tab > Block Public Access',
        cliCommand: 'aws s3api get-public-access-block --bucket medrecords-prod-patient-data',
        expectedOutput: JSON.stringify({
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: false,
            IgnorePublicAcls: false,
            BlockPublicPolicy: false,
            RestrictPublicBuckets: false
          }
        }, null, 2),
        interviewTip: 'Explain all 4 BPA flags in interviews: BlockPublicAcls blocks new public ACLs; IgnorePublicAcls ignores all existing public ACLs; BlockPublicPolicy prevents new public policies; RestrictPublicBuckets restricts access to AWS services and authorized users.',
        pitfallWarning: 'Never assume a bucket is safe because you don\'t see a public policy. An ACL on an individual object can expose data publicly even if the bucket policy is empty.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Forensic Baseline',
        title: 'Inspect Bucket Policy for 0.0.0.0/0 Wildcard Principals',
        jobContext: 'Inspect the live bucket policy document for Principal: "*" statements and check whether conditional IP or VPC restrictions exist.',
        consolePath: 'AWS Console > Amazon S3 > Buckets > medrecords-prod-patient-data > Permissions > Bucket Policy',
        cliCommand: 'aws s3api get-bucket-policy --bucket medrecords-prod-patient-data',
        expectedOutput: JSON.stringify({
          Policy: JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'AllowPublicBillingRead',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: 'arn:aws:s3:::medrecords-prod-patient-data/*'
              }
            ]
          })
        }, null, 2),
        interviewTip: 'Describe how attackers run automated mass-scanners like `s3scanner` and Shodan looking for open buckets with Principal: "*".',
        pitfallWarning: 'Do not simply delete the bucket policy if legitimate internal backend services rely on other statements in that same policy.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Minute-0 Containment',
        title: 'Activate S3 Block Public Access Across All 4 Controls',
        jobContext: 'Apply the emergency containment control immediately by enabling all 4 Block Public Access settings via the API.',
        consolePath: 'AWS Console > Amazon S3 > medrecords-prod-patient-data > Permissions > Block Public Access > Edit > Check all 4 boxes > Save',
        cliCommand: 'aws s3api put-public-access-block --bucket medrecords-prod-patient-data --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"',
        expectedOutput: JSON.stringify({
          Status: 'SUCCESS',
          Message: 'PublicAccessBlockConfiguration applied. All 4 flags set to true. Public access severed instantly.'
        }, null, 2),
        interviewTip: 'Highlight that S3 BPA acts as a centralized override switch that supersedes both bucket policies and individual object ACLs.',
        pitfallWarning: 'Ensure you also enable S3 Block Public Access at the AWS Account level, not just on individual buckets.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Defensible Remediation',
        title: 'Enforce TLS 1.2+ Transport Encryption via Bucket Policy',
        jobContext: 'HIPAA and SOC2 require data in transit to be strictly encrypted with TLS 1.2+. Author a bucket policy with an explicit Deny on `aws:SecureTransport: false`.',
        consolePath: 'AWS Console > Amazon S3 > medrecords-prod-patient-data > Permissions > Edit Bucket Policy > Add SecureTransport condition',
        cliCommand: 'aws s3api put-bucket-policy --bucket medrecords-prod-patient-data --policy \'{"Version":"2012-10-17","Statement":[{"Sid":"EnforceTLSRequestsOnly","Effect":"Deny","Principal":"*","Action":"s3:*","Resource":["arn:aws:s3:::medrecords-prod-patient-data","arn:aws:s3:::medrecords-prod-patient-data/*"],"Condition":{"Bool":{"aws:SecureTransport":"false"}}}]}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 204 },
          Status: 'Bucket policy updated with mandatory TLS enforcement.'
        }, null, 2),
        interviewTip: 'Explain to interviewers that the `aws:SecureTransport` condition ensures all unencrypted HTTP requests return 403 Forbidden.',
        pitfallWarning: 'Notice both the bucket ARN and the wildcard prefix `arn:aws:s3:::bucket/*` must be listed in Resource, or bucket-level operations will bypass the rule.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Data Protection at Rest',
        title: 'Configure Default KMS Customer-Managed Key (CMK) Encryption',
        jobContext: 'Default SSE-S3 encryption is insufficient for HIPAA ePHI. Configure default encryption using a dedicated KMS Customer Managed Key with key rotation enabled.',
        consolePath: 'AWS Console > Amazon S3 > medrecords-prod-patient-data > Properties > Default Encryption > Edit > Choose AWS KMS (SSE-KMS)',
        cliCommand: 'aws s3api put-bucket-encryption --bucket medrecords-prod-patient-data --server-side-encryption-configuration \'{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"aws:kms","KMSMasterKeyId":"arn:aws:kms:us-east-1:123456789012:key/k-hipaa-patient-records"},"BucketKeyEnabled":true}]}\'',
        expectedOutput: JSON.stringify({
          Status: 'SUCCESS',
          Algorithm: 'aws:kms',
          KeyId: 'arn:aws:kms:us-east-1:123456789012:key/k-hipaa-patient-records',
          BucketKeyEnabled: true
        }, null, 2),
        interviewTip: 'Mention S3 Bucket Keys! Enabling Bucket Keys reduces KMS request costs by up to 99% by caching keys at the S3 tier.',
        pitfallWarning: 'Before enabling SSE-KMS, ensure the IAM roles accessing the bucket also have `kms:Decrypt` and `kms:GenerateDataKey` permissions in the KMS key policy, or reads will fail.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Verify Compliance Status in AWS Config',
        jobContext: 'Trigger an on-demand re-evaluation of the `s3-bucket-public-read-prohibited` and `s3-default-encryption-kms` AWS Config rules to capture audit proof.',
        consolePath: 'AWS Console > AWS Config > Rules > Search "s3-bucket-public-read-prohibited" > Re-evaluate',
        cliCommand: 'aws configservice get-compliance-details-by-config-rule --config-rule-name s3-bucket-public-read-prohibited --resource-types AWS::S3::Bucket',
        expectedOutput: JSON.stringify({
          EvaluationResults: [
            {
              EvaluationResultIdentifier: {
                EvaluationResultQualifier: {
                  ConfigRuleName: 's3-bucket-public-read-prohibited',
                  ResourceId: 'medrecords-prod-patient-data',
                  ResourceType: 'AWS::S3::Bucket'
                }
              },
              ComplianceType: 'COMPLIANT',
              ResultRecordedTime: '2026-09-24T20:25:00Z'
            }
          ]
        }, null, 2),
        interviewTip: 'Point out that AWS Config compliance records provide non-repudiable audit evidence for third-party auditors like Deloitte, PwC, or HIPAA regulators.',
        pitfallWarning: 'Enable S3 Object Lock or Versioning with MFA Delete so that a rogue administrator or compromised key cannot delete the audit records.'
      }
    ]
  },
  {
    id: 'lab-ec2-imds-containment',
    labNumber: 'LAB-03',
    title: 'Compromised EC2 Instance Quarantine & IMDSv2 Mandatory Migration',
    jobRole: 'SecOps Incident Responder',
    roleKey: 'secops-analyst',
    organization: 'E-Commerce Marketplace Enterprise (High-Volume Transaction Hub)',
    difficulty: 'Advanced',
    estimatedMinutes: 30,
    scenarioSummary: 'Amazon GuardDuty triggered alert `UnauthorizedAccess:EC2/MetadataDNSRebind`. An internet-facing web server running an SSRF-vulnerable application is querying the Instance Metadata Service (IMDSv1) at 169.254.169.254 to steal temporary STS credentials.',
    targetServices: ['Amazon EC2', 'Amazon GuardDuty', 'AWS VPC', 'AWS IAM'],
    mitreTechnique: 'T1552.005 - Cloud Instance Metadata API',
    steps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Pre-Flight Scoping',
        title: 'Inspect GuardDuty Alert Details & Target Instance ID',
        jobContext: 'When a metadata theft alert arrives, identify the instance ID, VPC ID, public IP address, and attached IAM instance profile role.',
        consolePath: 'AWS Console > GuardDuty > Findings > Filter by "MetadataDNSRebind" > Copy InstanceId: i-0abcdef1234567890',
        cliCommand: 'aws ec2 describe-instances --instance-ids i-0abcdef1234567890 --query "Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,VpcId,IamInstanceProfile.Arn]" --output table',
        expectedOutput: `------------------------------------------------------------------------------------------------------------------------------------------------
|                                                               DescribeInstances                                                              |
+----------------------+----------+-----------------+-----------------------+------------------------------------------------------------------+
|  i-0abcdef1234567890 |  running |  54.210.12.88   |  vpc-prod-012345      |  arn:aws:iam::123456789012:instance-profile/WebFrontEndProfile   |
+----------------------+----------+-----------------+-----------------------+------------------------------------------------------------------+`,
        interviewTip: 'Talk about the Capital One breach! The Capital One breach was caused by an SSRF vulnerability on an EC2 instance that reached IMDSv1 to extract role credentials.',
        pitfallWarning: 'Do not stop or terminate the instance! Stopping the instance wipes volatile memory (RAM), destroying process trees and active shell connections needed for forensics.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Forensic Baseline',
        title: 'Query Current IMDS Configuration State',
        jobContext: 'Check whether the instance currently permits unauthenticated IMDSv1 calls (HttpTokens: optional).',
        consolePath: 'AWS Console > EC2 > Instances > i-0abcdef1234567890 > Actions > Instance Settings > Modify Instance Metadata Options',
        cliCommand: 'aws ec2 describe-instances --instance-ids i-0abcdef1234567890 --query "Reservations[*].Instances[*].MetadataOptions" --output json',
        expectedOutput: JSON.stringify([
          [
            {
              State: 'applied',
              HttpTokens: 'optional',
              HttpPutResponseHopLimit: 2,
              HttpEndpoint: 'enabled'
            }
          ]
        ], null, 2),
        interviewTip: 'IMDSv1 uses simple HTTP GET requests (`curl http://169.254.169.254/latest/meta-data/`). IMDSv2 requires a session-oriented HTTP PUT request with a token header (`X-aws-ec2-metadata-token`), neutralizing SSRF attacks.',
        pitfallWarning: 'Notice `HttpTokens: optional`. This means IMDSv1 is accepted and vulnerable to simple GET-based SSRF exfiltration.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Minute-0 Containment',
        title: 'Attach Forensic Isolation Security Group',
        jobContext: 'Immediately replace the instance\'s active security groups with an Isolation Security Group that has 0 inbound and 0 outbound rules to sever attacker C2 communications while preserving the instance.',
        consolePath: 'AWS Console > EC2 > Instances > i-0abcdef1234567890 > Actions > Security > Change Security Groups > Select "sg-forensic-isolation"',
        cliCommand: 'aws ec2 modify-instance-attribute --instance-id i-0abcdef1234567890 --groups sg-000000isolation',
        expectedOutput: JSON.stringify({
          Status: 'SUCCESS',
          InstanceId: 'i-0abcdef1234567890',
          AttachedGroups: ['sg-000000isolation'],
          Message: 'All inbound and outbound traffic dropped instantly. C2 connection terminated.'
        }, null, 2),
        interviewTip: 'Explain why replacing the security group is superior to detaching the network interface (ENI). Replacing the security group keeps the interface alive so forensic investigators can take an EBS snapshot cleanly.',
        pitfallWarning: 'Do not delete the original security group. You need to inspect its rules to understand what ports were previously open to the internet.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Evidence Preservation',
        title: 'Create Forensic EBS Volume Snapshots',
        jobContext: 'Capture a point-in-time forensic image of the root and data volumes before making any configuration modifications.',
        consolePath: 'AWS Console > EC2 > Elastic Block Store > Snapshots > Create Snapshot > Select Root Volume of i-0abcdef1234567890',
        cliCommand: 'aws ec2 create-snapshot --volume-id vol-0123456789abcdef0 --description "Forensic image of compromised web host i-0abcdef1234567890 - Ticket SEC-INC-404" --tag-specifications "ResourceType=snapshot,Tags=[{Key=CaseId,Value=SEC-INC-404},{Key=ChainOfCustody,Value=SecOps}]"',
        expectedOutput: JSON.stringify({
          SnapshotId: 'snap-0a987b654c321d',
          VolumeId: 'vol-0123456789abcdef0',
          State: 'pending',
          StartTime: '2026-09-24T20:30:00Z',
          Description: 'Forensic image of compromised web host i-0abcdef1234567890 - Ticket SEC-INC-404'
        }, null, 2),
        interviewTip: 'Mention Chain of Custody tags! Legal and compliance teams require tagging snapshots with Case ID and Investigator Identity for admissible digital forensics.',
        pitfallWarning: 'Always tag snapshots immediately upon creation. Untagged snapshots often get deleted by automated cost-optimization cleanup jobs.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Defensible Remediation',
        title: 'Enforce Mandatory IMDSv2 & Reduce Hop Limit to 1',
        jobContext: 'Enforce `HttpTokens: required` on the instance and restrict the token hop limit to 1 so containerized processes or reverse proxies cannot relay metadata requests.',
        consolePath: 'AWS Console > EC2 > Instances > i-0abcdef1234567890 > Instance Settings > Modify Instance Metadata Options > V2 only (token required) > Hop Limit: 1',
        cliCommand: 'aws ec2 modify-instance-metadata-options --instance-id i-0abcdef1234567890 --http-tokens required --http-put-response-hop-limit 1 --http-endpoint enabled',
        expectedOutput: JSON.stringify({
          InstanceId: 'i-0abcdef1234567890',
          InstanceMetadataOptions: {
            State: 'applied',
            HttpTokens: 'required',
            HttpPutResponseHopLimit: 1,
            HttpEndpoint: 'enabled'
          }
        }, null, 2),
        interviewTip: 'Setting `HttpPutResponseHopLimit: 1` prevents IP packet forwarding. If an attacker tries SSRF through a reverse proxy or WAF layer, the packet expires before reaching IMDS.',
        pitfallWarning: 'Check if legitimate applications use older AWS SDKs that do not support IMDSv2 before enforcing account-wide. Update SDKs first.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Organization Guardrails',
        title: 'Enforce IMDSv2 Organization-Wide via Service Control Policy (SCP)',
        jobContext: 'Ensure no developer can launch an EC2 instance without IMDSv2 by deploying an AWS Organizations Service Control Policy.',
        consolePath: 'AWS Console > AWS Organizations > Policies > Service Control Policies > Create SCP: "EnforceIMDSv2"',
        cliCommand: 'aws organizations create-policy --name "EnforceIMDSv2" --description "Require IMDSv2 on all EC2 RunInstances" --type SERVICE_CONTROL_POLICY --content \'{"Version":"2012-10-17","Statement":[{"Sid":"RequireIMDSv2","Effect":"Deny","Action":"ec2:RunInstances","Resource":"arn:aws:ec2:*:*:instance/*","Condition":{"StringNotEquals":{"ec2:MetadataHttpTokens":"required"}}}]}\'',
        expectedOutput: JSON.stringify({
          Policy: {
            PolicySummary: {
              Id: 'p-imdsv2enforcement',
              Arn: 'arn:aws:organizations::123456789012:policy/o-root/service_control_policy/p-imdsv2enforcement',
              Name: 'EnforceIMDSv2',
              Type: 'SERVICE_CONTROL_POLICY',
              AwsManaged: false
            }
          }
        }, null, 2),
        interviewTip: 'Explain the difference between IAM policies and SCPs: SCPs set the maximum permission boundary for member accounts in AWS Organizations. Even the root user in a member account cannot bypass an SCP Deny!',
        pitfallWarning: 'Test SCPs in a designated Non-Prod Organizational Unit (OU) first before attaching to the Root OU to prevent unexpected provisioning blocks.'
      }
    ]
  },
  {
    id: 'lab-cloudtrail-guardrail',
    labNumber: 'LAB-04',
    title: 'CloudTrail Disruption Detection, Trail Healing & Tamper-Proof Storage',
    jobRole: 'SecOps Monitoring & Threat Detection Engineer',
    roleKey: 'secops-analyst',
    organization: 'Global FinTech Banking Core (Zero-Trust Security Architecture)',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    scenarioSummary: 'An adversary used a compromised administrator access key to execute `StopLogging` on the production multi-region CloudTrail. Detection systems must immediately alert, re-enable logging, and apply KMS encryption with multi-region replication.',
    targetServices: ['AWS CloudTrail', 'Amazon S3', 'Amazon EventBridge', 'AWS KMS'],
    mitreTechnique: 'T1562.008 - Disable Cloud Logs',
    steps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Pre-Flight Scoping',
        title: 'Check CloudTrail Logging Status Across Regions',
        jobContext: 'Confirm whether the organization trail is actively recording API management and data events.',
        consolePath: 'AWS Console > CloudTrail > Trails > Click "organization-core-trail" > Verify Status',
        cliCommand: 'aws cloudtrail get-trail-status --name organization-core-trail',
        expectedOutput: JSON.stringify({
          IsLogging: false,
          LatestDeliveryTime: '2026-09-24T19:40:00Z',
          StartLoggingTime: '2025-01-01T00:00:00Z',
          StopLoggingTime: '2026-09-24T20:15:00Z',
          LatestNotificationTime: '2026-09-24T20:15:00Z'
        }, null, 2),
        interviewTip: 'In incident response, a blind spot in CloudTrail is a Priority 1 emergency. An attacker disabling logs is almost always followed by immediate lateral movement or data exfiltration.',
        pitfallWarning: 'Note `IsLogging: false` and `StopLoggingTime: 2026-09-24T20:15:00Z`. The window of blind activity has already started.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Minute-0 Containment & Trail Healing',
        title: 'Immediately Re-Enable Trail Logging via AWS CLI',
        jobContext: 'Execute the emergency command to restart CloudTrail recording within seconds of detection.',
        consolePath: 'AWS Console > CloudTrail > Trails > organization-core-trail > Toggle "Logging" to ON',
        cliCommand: 'aws cloudtrail start-logging --name organization-core-trail',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'CloudTrail recording restored. Event stream resumed across all AWS commercial regions.'
        }, null, 2),
        interviewTip: 'Demonstrate how automation via EventBridge can trigger a Lambda function to call `start-logging` in under 3 seconds whenever a `StopLogging` event is detected.',
        pitfallWarning: 'Always confirm the trail is Multi-Region (`IsMultiRegionTrail: true`). Attackers frequently switch to unmonitored regions like `ap-southeast-2` or `eu-west-3` if the trail is single-region.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Evidence Extraction',
        title: 'Audit S3 Log File Integrity Validation',
        jobContext: 'Validate the digital cryptographic signatures of CloudTrail digest files to prove the attacker did not tamper with or delete past event records.',
        consolePath: 'AWS Console > CloudTrail > Trails > organization-core-trail > Verify "Log File Validation: Enabled"',
        cliCommand: 'aws cloudtrail validate-logs --trail-arn arn:aws:cloudtrail:us-east-1:123456789012:trail/organization-core-trail --start-time 2026-09-24T18:00:00Z',
        expectedOutput: `Validating log files for trail "arn:aws:cloudtrail:us-east-1:123456789012:trail/organization-core-trail"...
Results:
- 142 log files analyzed
- 0 modified log files detected
- 0 deleted log files detected
Log file integrity validation: SUCCESSFUL (SHA-256 Digest Cryptographically Verified)`,
        interviewTip: 'CloudTrail Log File Integrity uses SHA-256 hashing and RSA digital signatures. It proves to courtrooms and auditors that log files were not altered after creation.',
        pitfallWarning: 'Log file validation only works if the S3 bucket is configured with digest files enabled (`EnableLogFileValidation: true`). Always verify this during initial setup.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Automated Self-Healing',
        title: 'Deploy EventBridge Auto-Remediation Rule',
        jobContext: 'Configure an Amazon EventBridge rule that detects `StopLogging`, `DeleteTrail`, or `UpdateTrail` API calls and automatically triggers self-healing.',
        consolePath: 'AWS Console > Amazon EventBridge > Rules > Create Rule > Event Pattern: CloudTrail StopLogging > Target: SecOps-AutoHealTrail Lambda',
        cliCommand: 'aws events put-rule --name "DetectCloudTrailDisruption" --event-pattern \'{"source":["aws.cloudtrail"],"detail-type":["AWS API Call via CloudTrail"],"detail":{"eventSource":["cloudtrail.amazonaws.com"],"eventName":["StopLogging","DeleteTrail"]}}\'',
        expectedOutput: JSON.stringify({
          RuleArn: 'arn:aws:events:us-east-1:123456789012:rule/DetectCloudTrailDisruption',
          Status: 'Active'
        }, null, 2),
        interviewTip: 'Self-healing infrastructure is a cornerstone of modern DevSecOps. Security teams should automate routine containment so engineers can focus on root-cause analysis.',
        pitfallWarning: 'Do not forget to give the EventBridge target Lambda sufficient IAM permissions (`cloudtrail:StartLogging`) in a dedicated least-privilege role.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Tamper-Proof Storage Lock',
        title: 'Apply S3 Object Lock & Bucket Policy Deny on Log Deletion',
        jobContext: 'Harden the underlying CloudTrail S3 bucket (`audit-logs-123456789012`) with S3 Object Lock in Compliance Mode so not even root can delete logs for 365 days.',
        consolePath: 'AWS Console > S3 > audit-logs-123456789012 > Properties > Object Lock > Enable Compliance Mode (365 Days)',
        cliCommand: 'aws s3api put-object-lock-configuration --bucket audit-logs-123456789012 --object-lock-configuration \'{"ObjectLockEnabled":"Enabled","Rule":{"DefaultRetention":{"Mode":"COMPLIANCE","Days":365}}}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'S3 Object Lock Compliance Mode active for 365 days. WORM (Write Once, Read Many) protection enforced.'
        }, null, 2),
        interviewTip: 'Explain the difference between Governance Mode and Compliance Mode: Governance Mode allows users with special IAM permissions to bypass the lock; Compliance Mode CANNOT be bypassed by ANY user, including AWS root!',
        pitfallWarning: 'Ensure you test bucket lifecycle rules. Do not set lifecycle expiration shorter than your Object Lock retention duration.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Final Audit Signoff',
        title: 'Validate Active Trail Health & KMS Encryption Key',
        jobContext: 'Confirm that CloudTrail is encrypting with a customer-managed KMS key and delivering logs with 0 dropped events.',
        consolePath: 'AWS Console > CloudTrail > Trails > organization-core-trail > Verify KMS Key and Delivery',
        cliCommand: 'aws cloudtrail describe-trails --trail-name-list organization-core-trail --query "trailList[*].[Name,IsLogging,IsMultiRegionTrail,KmsKeyId,LogFileValidationEnabled]" --output table',
        expectedOutput: `----------------------------------------------------------------------------------------------------------------------------------------------------------
|                                                                     DescribeTrails                                                                     |
+--------------------------+------------+----------------------+-------------------------------------------------------------+---------------------------+
|  organization-core-trail |    True    |         True         |  arn:aws:kms:us-east-1:123456789012:key/k-cloudtrail-audit  |           True            |
+--------------------------+------------+----------------------+-------------------------------------------------------------+---------------------------+`,
        interviewTip: 'Recap the defense-in-depth principles implemented in this lab: automated detection via EventBridge, multi-region coverage, KMS encryption, log file validation, and immutable S3 Object Lock.',
        pitfallWarning: 'Save the CLI output in the incident post-mortem ticket as verification evidence for the CISO and external auditors.'
      }
    ]
  },
  {
    id: 'lab-lambda-egress-hardening',
    labNumber: 'LAB-05',
    title: 'Serverless Lambda VPC Exfiltration Lockdown & Egress Security Group Hardening',
    jobRole: 'DevSecOps Specialist',
    roleKey: 'devsecops',
    organization: 'FinTech Payment Processing Core (PCI-DSS Scoped)',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    scenarioSummary: 'A payment-processing Lambda function (ProcessCardTransactions) has default 0.0.0.0/0 unrestricted outbound internet access through an open security group. A compromised third-party npm package could exfiltrate cardholder PAN data.',
    targetServices: ['AWS Lambda', 'Amazon VPC', 'VPC Endpoints', 'AWS Security Groups'],
    mitreTechnique: 'T1048 - Exfiltration Over Alternative Protocol',
    steps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Pre-Flight Scoping',
        title: 'Inspect Lambda Function VPC & Subnet Placement',
        jobContext: 'Check whether the Lambda function runs inside a VPC or in the default AWS managed serverless network.',
        consolePath: 'AWS Console > Lambda > Functions > ProcessCardTransactions > Configuration tab > VPC',
        cliCommand: 'aws lambda get-function-configuration --function-name ProcessCardTransactions --query "VpcConfig"',
        expectedOutput: JSON.stringify({
          SubnetIds: ['subnet-0123456789priv1', 'subnet-0123456789priv2'],
          SecurityGroupIds: ['sg-0123456789default'],
          VpcId: 'vpc-prod-payments'
        }, null, 2),
        interviewTip: 'Explain why Lambdas processing sensitive data must be attached to private subnets with VPC Endpoints instead of public internet NAT Gateways.',
        pitfallWarning: 'Do not remove VPC configuration without verifying whether the Lambda queries internal RDS databases.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Forensic Baseline',
        title: 'Audit Outbound Egress Security Group Rules',
        jobContext: 'Inspect the security group attached to the Lambda. Check for permissive `0.0.0.0/0` outbound egress.',
        consolePath: 'AWS Console > EC2 > Security Groups > Select sg-0123456789default > Outbound rules tab',
        cliCommand: 'aws ec2 describe-security-groups --group-ids sg-0123456789default --query "SecurityGroups[*].IpPermissionsEgress" --output json',
        expectedOutput: JSON.stringify([
          [
            {
              IpProtocol: '-1',
              IpRanges: [{ CidrIp: '0.0.0.0/0' }],
              UserIdGroupPairs: []
            }
          ]
        ], null, 2),
        interviewTip: 'Many teams forget that AWS Security Groups default to allowing ALL outbound traffic to the entire internet. Egress filtering is vital against supply chain malware.',
        pitfallWarning: 'Removing the egress rule without creating VPC Endpoints for S3 and DynamoDB will immediately cause AWS API calls from Lambda to time out.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Minute-0 Containment',
        title: 'Revoke Wildcard 0.0.0.0/0 Egress from Lambda Security Group',
        jobContext: 'Drop the all-ports outbound rule to immediately neutralize outbound data exfiltration channels.',
        consolePath: 'AWS Console > EC2 > Security Groups > sg-0123456789default > Outbound rules > Delete 0.0.0.0/0 rule',
        cliCommand: 'aws ec2 revoke-security-group-egress --group-id sg-0123456789default --protocol all --port -1 --cidr 0.0.0.0/0',
        expectedOutput: JSON.stringify({
          Return: true,
          Status: 'Outbound rule revoked. Lambda isolated from public internet.'
        }, null, 2),
        interviewTip: 'Explain stateful connection tracking: When security group rules change, existing TCP connections are tracked, but new outbound SYNs are blocked immediately.',
        pitfallWarning: 'Immediately proceed to Stage 4 to create specific allowed endpoints so legitimate payment microservices don\'t stall.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Defensible Remediation',
        title: 'Provision Private VPC Endpoints (AWS PrivateLink) for DynamoDB & KMS',
        jobContext: 'Route Lambda API calls privately within AWS network backbone without traversing the public internet.',
        consolePath: 'AWS Console > VPC > Endpoints > Create Endpoint > Service: com.amazonaws.us-east-1.kms (Interface) & dynamodb (Gateway)',
        cliCommand: 'aws ec2 create-vpc-endpoint --vpc-id vpc-prod-payments --service-name com.amazonaws.us-east-1.kms --vpc-endpoint-type Interface --subnet-ids subnet-0123456789priv1 subnet-0123456789priv2 --security-group-ids sg-0vpcendpointkms',
        expectedOutput: JSON.stringify({
          VpcEndpoint: {
            VpcEndpointId: 'vpce-0123456789abcdef0',
            VpcEndpointType: 'Interface',
            VpcId: 'vpc-prod-payments',
            ServiceName: 'com.amazonaws.us-east-1.kms',
            State: 'available'
          }
        }, null, 2),
        interviewTip: 'Highlight Gateway endpoints vs Interface endpoints: S3 and DynamoDB support free Gateway endpoints; other AWS services use Interface endpoints powered by PrivateLink.',
        pitfallWarning: 'Ensure Private DNS is enabled on Interface endpoints so standard SDK clients connect automatically without changing endpoint URLs in application code.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Policy Hardening',
        title: 'Restrict Security Group Egress to Specific VPC Endpoint Security Group',
        jobContext: 'Author a scoped outbound security group rule that allows traffic only to the KMS Interface Endpoint security group on port 443.',
        consolePath: 'AWS Console > EC2 > Security Groups > sg-0123456789default > Add Outbound Rule > Port 443 > Destination: sg-0vpcendpointkms',
        cliCommand: 'aws ec2 authorize-security-group-egress --group-id sg-0123456789default --protocol tcp --port 443 --source-group sg-0vpcendpointkms',
        expectedOutput: JSON.stringify({
          Return: true,
          SecurityGroupRule: {
            GroupId: 'sg-0123456789default',
            IsEgress: true,
            IpProtocol: 'tcp',
            FromPort: 443,
            ToPort: 443,
            ReferencedGroupId: 'sg-0vpcendpointkms'
          }
        }, null, 2),
        interviewTip: 'Referencing security group IDs instead of CIDR IPs creates a dynamic boundary that automatically adjusts as IP addresses scale behind the VPC endpoint.',
        pitfallWarning: 'Never mix egress rules for test and prod in the same security group. Dedicated security groups per microservice tier are mandatory for PCI-DSS.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Test Lambda Function Execution via PrivateLink',
        jobContext: 'Invoke the Lambda function test event to verify that card processing completes successfully with 0 outbound internet access.',
        consolePath: 'AWS Console > Lambda > ProcessCardTransactions > Test tab > Invoke',
        cliCommand: 'aws lambda invoke --function-name ProcessCardTransactions --payload \'{"transactionId":"tx-98765","amount":150.00}\' response.json',
        expectedOutput: JSON.stringify({
          StatusCode: 200,
          ExecutedVersion: '$LATEST',
          Payload: '{"status":"APPROVED","encryptedAuth":"kms-token-998811","vpcTransport":"PRIVATE_LINK"}'
        }, null, 2),
        interviewTip: 'Show how this architecture completely satisfies PCI-DSS Requirement 1 (Install and maintain network security controls) for serverless environments.',
        pitfallWarning: 'Verify CloudWatch Logs to ensure execution duration did not increase significantly due to cold-start ENI attachment.'
      }
    ]
  },
  {
    id: 'lab-confused-deputy-mitigation',
    labNumber: 'LAB-06',
    title: 'Cross-Account AssumeRole Confused Deputy Mitigation (ExternalID Enforcement)',
    jobRole: 'Cloud Security Architect',
    roleKey: 'cloud-architect',
    organization: 'Enterprise B2B SaaS Platform (Multi-Tenant Architecture)',
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    scenarioSummary: 'A third-party SaaS vendor role (VendorMonitoringRole) allows cross-account `sts:AssumeRole` without validating a unique `sts:ExternalId`. Any other customer of that vendor could trick the vendor into reading your AWS account.',
    targetServices: ['AWS IAM', 'AWS STS', 'AWS CloudTrail'],
    mitreTechnique: 'T1199 - Trusted Relationship',
    steps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Pre-Flight Scoping',
        title: 'Inspect Cross-Account Trust Policy Document',
        jobContext: 'Review the trust relationship (AssumeRolePolicyDocument) of all third-party integration roles in your AWS account.',
        consolePath: 'AWS Console > IAM > Roles > VendorMonitoringRole > Trust relationships tab',
        cliCommand: 'aws iam get-role --role-name VendorMonitoringRole --query "Role.AssumeRolePolicyDocument"',
        expectedOutput: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: 'arn:aws:iam::987654321098:root' },
              Action: 'sts:AssumeRole'
            }
          ]
        }, null, 2),
        interviewTip: 'This is the classic AWS Confused Deputy problem! Explain how without an ExternalID, Customer B of the same vendor can supply your Role ARN and gain access to your infrastructure.',
        pitfallWarning: 'Notice there is NO Condition block in the statement. This is a severe architectural vulnerability.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Risk Quantification',
        title: 'Audit Attached Permissions of the Cross-Account Role',
        jobContext: 'Determine what data or infrastructure the vendor role can access if assumed by an unauthorized entity.',
        consolePath: 'AWS Console > IAM > Roles > VendorMonitoringRole > Permissions tab',
        cliCommand: 'aws iam list-attached-role-policies --role-name VendorMonitoringRole',
        expectedOutput: JSON.stringify({
          AttachedPolicies: [
            {
              PolicyName: 'SecurityAudit',
              PolicyArn: 'arn:aws:iam::aws:policy/SecurityAudit'
            },
            {
              PolicyName: 'CloudWatchReadOnlyAccess',
              PolicyArn: 'arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess'
            }
          ]
        }, null, 2),
        interviewTip: 'Even read-only roles like `SecurityAudit` are high-risk because they allow adversaries to enumerate all IAM users, S3 bucket names, and security group configurations across your entire cloud estate.',
        pitfallWarning: 'Never grant Write or Admin permissions to third-party vendor roles under any circumstance.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Minute-0 Containment',
        title: 'Attach Temporary Emergency Deny on AssumeRole',
        jobContext: 'Block new assume-role sessions while re-negotiating the ExternalID configuration with the vendor.',
        consolePath: 'AWS Console > IAM > Roles > VendorMonitoringRole > Add Inline Policy > Deny sts:AssumeRole',
        cliCommand: 'aws iam put-role-policy --role-name VendorMonitoringRole --policy-name EmergencyPause --policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*"}]}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'EmergencyPause inline deny applied. Role disabled until ExternalID is configured.'
        }, null, 2),
        interviewTip: 'Demonstrate communication skills: when pausing a vendor integration, immediately notify the internal application owner and explain the Confused Deputy threat.',
        pitfallWarning: 'Do not delete the role or change its ARN without coordinating with the vendor, as this breaks automated billing or monitoring pipelines.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Defensible Remediation',
        title: 'Update Trust Policy with Cryptographic ExternalId Condition',
        jobContext: 'Generate a high-entropy UUIDv4 External ID and update the Trust Relationship with `sts:ExternalId` condition.',
        consolePath: 'AWS Console > IAM > Roles > VendorMonitoringRole > Trust relationships > Edit trust policy > Add Condition sts:ExternalId',
        cliCommand: 'aws iam update-assume-role-policy --role-name VendorMonitoringRole --policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":"arn:aws:iam::987654321098:root"},"Action":"sts:AssumeRole","Condition":{"StringEquals":{"sts:ExternalId":"d8f1e3c2-4a5b-6c7d-8e9f-0123456789ab"}}}]}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Trust relationship updated. Mandatory sts:ExternalId condition enforced.'
        }, null, 2),
        interviewTip: 'Explain that the External ID must be treated like a shared secret between you and the vendor. It should be generated by you or assigned uniquely by the vendor in their SaaS console.',
        pitfallWarning: 'Never use common names like company name or "prod-monitoring" as External IDs. Always use random cryptographically secure UUIDs.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Unpause & Cleanup',
        title: 'Remove Emergency Quarantine Policy',
        jobContext: 'Delete the temporary inline deny policy now that the trust relationship is hardened.',
        consolePath: 'AWS Console > IAM > Roles > VendorMonitoringRole > Inline Policies > Delete EmergencyPause',
        cliCommand: 'aws iam delete-role-policy --role-name VendorMonitoringRole --policy-name EmergencyPause',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'EmergencyPause removed. Authorized vendor sessions with matching ExternalId are now permitted.'
        }, null, 2),
        interviewTip: 'Highlight the importance of operational hygiene: leaving temporary quarantine policies in place leads to phantom bugs weeks later during deployments.',
        pitfallWarning: 'Confirm with the vendor that their assume-role client is passing the exact ExternalID before deleting the pause policy.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Verify AssumeRole Rejection Without ExternalId',
        jobContext: 'Simulate an unauthorized AssumeRole call without the External ID to verify AWS returns AccessDenied.',
        consolePath: 'AWS CloudTrail > Event History > Search "AssumeRole" > Inspect ErrorCode: AccessDenied',
        cliCommand: 'aws sts assume-role --role-arn arn:aws:iam::123456789012:role/VendorMonitoringRole --role-session-name unauthorized-test',
        expectedOutput: `An error occurred (AccessDenied) when calling the AssumeRole operation: User is not authorized to perform: sts:AssumeRole on resource: arn:aws:iam::123456789012:role/VendorMonitoringRole
(Verification: Correctly rejected because sts:ExternalId was omitted)`,
        interviewTip: 'Explain the positive and negative test cases: Positive test: AssumeRole with valid ExternalID succeeds; Negative test: AssumeRole without ExternalID returns AccessDenied.',
        pitfallWarning: 'Document this verification in your SOC2 vendor management compliance evidence folder.'
      }
    ]
  },
  {
    id: 'lab-rds-snapshot-encryption',
    labNumber: 'LAB-07',
    title: 'RDS Database Snapshot Exposure Remediation & KMS CMK Encryption',
    jobRole: 'Cloud Database Security Engineer',
    roleKey: 'cloud-sec-eng',
    organization: 'Insurance & Claims Processing Enterprise (State Regulatory Oversight)',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    scenarioSummary: 'An unencrypted RDS MySQL database manual snapshot containing policyholder claims was shared publicly (`all` AWS accounts) due to an automated backup script misconfiguration.',
    targetServices: ['Amazon RDS', 'AWS KMS', 'AWS IAM', 'AWS CloudTrail'],
    mitreTechnique: 'T1530 - Data from Cloud Storage Object',
    steps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Pre-Flight Scoping',
        title: 'Query RDS Snapshot Attributes & Public Sharing Flags',
        jobContext: 'Check whether the snapshot has `ValuesToRestore: ["all"]`, making the entire database available for download to anyone with an AWS account.',
        consolePath: 'AWS Console > RDS > Snapshots > Select "claims-db-backup-2026" > Snapshot permissions tab',
        cliCommand: 'aws rds describe-db-snapshot-attributes --db-snapshot-identifier claims-db-backup-2026',
        expectedOutput: JSON.stringify({
          DBSnapshotAttributesResult: {
            DBSnapshotIdentifier: 'claims-db-backup-2026',
            DBSnapshotAttributes: [
              {
                AttributeName: 'restore',
                AttributeValues: ['all']
              }
            ]
          }
        }, null, 2),
        interviewTip: 'Explain the Imperva breach: In 2019, a public RDS snapshot containing customer database passwords and API keys was discovered and copied by adversaries.',
        pitfallWarning: 'AttributeValue "all" means the snapshot is publicly indexed and can be restored in any foreign AWS account instantly!'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Minute-0 Containment',
        title: 'Revoke Public Sharing Attribute Immediately',
        jobContext: 'Execute the command to remove "all" from restore permissions within seconds of detection.',
        consolePath: 'AWS Console > RDS > Snapshots > claims-db-backup-2026 > Snapshot actions > Share snapshot > Private',
        cliCommand: 'aws rds modify-db-snapshot-attribute --db-snapshot-identifier claims-db-backup-2026 --attribute-name restore --values-to-remove all',
        expectedOutput: JSON.stringify({
          DBSnapshotAttributesResult: {
            DBSnapshotIdentifier: 'claims-db-backup-2026',
            DBSnapshotAttributes: [
              {
                AttributeName: 'restore',
                AttributeValues: []
              }
            ]
          }
        }, null, 2),
        interviewTip: 'Public RDS snapshots cannot be copied if the snapshot is encrypted with a KMS CMK. AWS prevents sharing CMK-encrypted snapshots publicly by design!',
        pitfallWarning: 'Revoking sharing stops NEW copies, but you must immediately investigate CloudTrail to see who restored or copied the snapshot before revocation.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Forensic Log Hunting',
        title: 'Query CloudTrail for CopyDBSnapshot API Events',
        jobContext: 'Check if any external AWS accounts executed `CopyDBSnapshot` or `RestoreDBInstanceFromDBSnapshot` on this snapshot identifier.',
        consolePath: 'AWS Console > CloudTrail > Event History > Event name: "CopyDBSnapshot" > Filter by claims-db-backup-2026',
        cliCommand: 'aws cloudtrail lookup-events --lookup-attributes AttributeKey=ResourceName,AttributeValue=claims-db-backup-2026',
        expectedOutput: JSON.stringify({
          Events: [
            {
              EventId: 'evt-rds-share-001',
              EventName: 'ModifyDBSnapshotAttribute',
              EventTime: '2026-09-24T18:10:00Z',
              Username: 'automation-backup-service',
              SourceIPAddress: '10.0.4.15'
            }
          ]
        }, null, 2),
        interviewTip: 'If there are no foreign AWS account entries in CloudTrail for CopyDBSnapshot during the exposure window, you can substantiate to legal counsel that no unauthorized exfiltration took place.',
        pitfallWarning: 'Remember CloudTrail only tracks API calls in YOUR account. Once a third party initiates a copy from their account, you must check VPC Flow Logs and GuardDuty for data egress.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Defensible Remediation',
        title: 'Encrypt Snapshot Copy with KMS Customer Managed Key (CMK)',
        jobContext: 'You cannot encrypt an existing snapshot in-place. You must copy the snapshot and specify a KMS Key ID to create an encrypted immutable copy.',
        consolePath: 'AWS Console > RDS > Snapshots > claims-db-backup-2026 > Copy snapshot > Enable Encryption > Select KMS Key: k-claims-cmk',
        cliCommand: 'aws rds copy-db-snapshot --source-db-snapshot-identifier claims-db-backup-2026 --target-db-snapshot-identifier claims-db-backup-2026-encrypted --kms-key-id arn:aws:kms:us-east-1:123456789012:key/k-claims-cmk',
        expectedOutput: JSON.stringify({
          DBSnapshot: {
            DBSnapshotIdentifier: 'claims-db-backup-2026-encrypted',
            Encrypted: true,
            KmsKeyId: 'arn:aws:kms:us-east-1:123456789012:key/k-claims-cmk',
            Status: 'creating'
          }
        }, null, 2),
        interviewTip: 'Explain why CMK encryption prevents public exposure: AWS does not permit sharing KMS default keys (aws/rds) cross-account, and CMK policies explicitly block public sharing.',
        pitfallWarning: 'Do not delete the unencrypted snapshot until the copy status transitions from "creating" to "available".'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Secure Destruction of Unencrypted Asset',
        title: 'Delete Unencrypted Legacy Snapshot',
        jobContext: 'Once the encrypted snapshot copy is verified as "available", securely delete the original unencrypted snapshot.',
        consolePath: 'AWS Console > RDS > Snapshots > claims-db-backup-2026 > Delete Snapshot',
        cliCommand: 'aws rds delete-db-snapshot --db-snapshot-identifier claims-db-backup-2026',
        expectedOutput: JSON.stringify({
          DBSnapshot: {
            DBSnapshotIdentifier: 'claims-db-backup-2026',
            Status: 'deleted'
          }
        }, null, 2),
        interviewTip: 'Data minimization principle: retaining unencrypted duplicate backups increases attack surface and audit liability.',
        pitfallWarning: 'Ensure automated backup scripts are updated with `--kms-key-id` so tomorrow\'s backup doesn\'t recreate the unencrypted vulnerability.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Guardrail Deployment',
        title: 'Deploy AWS Config Rule: rds-snapshots-public-prohibited',
        jobContext: 'Enable automated compliance monitoring to immediately alert if any RDS snapshot is ever shared publicly again.',
        consolePath: 'AWS Console > AWS Config > Rules > Add Rule > Select "rds-snapshots-public-prohibited"',
        cliCommand: 'aws configservice put-config-rule --config-rule \'{"ConfigRuleName":"rds-snapshots-public-prohibited","Source":{"Owner":"AWS","SourceIdentifier":"RDS_SNAPSHOTS_PUBLIC_PROHIBITED"},"Scope":{"ComplianceResourceTypes":["AWS::RDS::DBSnapshot"]}}\'',
        expectedOutput: JSON.stringify({
          Status: 'ConfigRule registered and evaluating all RDS database snapshots in account.'
        }, null, 2),
        interviewTip: 'Connect this to preventative controls: AWS Config combined with AWS Systems Manager (SSM) Automation can automatically unshare public snapshots in under 15 seconds.',
        pitfallWarning: 'Ensure AWS Config is enabled in all regions, not just us-east-1, to prevent shadow databases from evading detection.'
      }
    ]
  },
  {
    id: 'lab-waf-alb-lockdown',
    labNumber: 'LAB-08',
    title: 'AWS WAF Rate Limiting & SQLi/SSRF Rule Tuning for Production ALB',
    jobRole: 'Application Security Engineer (AppSec / Cloud)',
    roleKey: 'cloud-sec-eng',
    organization: 'Payment Gateway SaaS (High-Availability Production Endpoint)',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    scenarioSummary: 'A sudden surge of credential-stuffing HTTP POST requests and SQL injection probes is degrading the checkout API. Deploy AWS WAF with AWS Managed Rules, IP rate limiting (2,000 req/5min), and custom response headers.',
    targetServices: ['AWS WAFv2', 'Elastic Load Balancing (ALB)', 'Amazon CloudWatch'],
    mitreTechnique: 'T1190 - Exploit Public-Facing Application',
    steps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Pre-Flight Scoping',
        title: 'Identify Target Application Load Balancer ARN',
        jobContext: 'Verify the ARN of the internet-facing Application Load Balancer servicing the checkout API before attaching WAF WebACLs.',
        consolePath: 'AWS Console > EC2 > Load Balancers > Select "alb-prod-checkout" > Copy ARN',
        cliCommand: 'aws elbv2 describe-load-balancers --names alb-prod-checkout --query "LoadBalancers[*].[LoadBalancerName,DNSName,Scheme,State.Code]" --output table',
        expectedOutput: `------------------------------------------------------------------------------------------------------
|                                        DescribeLoadBalancers                                       |
+--------------------+-----------------------------------------------------+------------------+-------+
|  alb-prod-checkout |  alb-prod-checkout-12345.us-east-1.elb.amazonaws.com |  internet-facing | active|
+--------------------+-----------------------------------------------------+------------------+-------+`,
        interviewTip: 'Always check the scheme: `internet-facing` vs `internal`. WAF should primarily protect internet-facing ALBs and CloudFront distributions.',
        pitfallWarning: 'Confirm the ALB region. Regional WAFv2 must match the region of the ALB (`--scope REGIONAL --region us-east-1`). CloudFront uses `--scope CLOUDFRONT --region us-east-1`.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Forensic Baseline',
        title: 'Check Existing WebACL Associations',
        jobContext: 'Determine whether a WebACL is already attached to avoid overriding existing production security rules.',
        consolePath: 'AWS Console > WAF & Shield > Associated AWS resources > Check alb-prod-checkout',
        cliCommand: 'aws wafv2 get-web-acl-for-resource --resource-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/alb-prod-checkout/50dc6c495c0c9188',
        expectedOutput: JSON.stringify({
          WebACL: null,
          Message: 'No WebACL currently associated with this resource. Application directly exposed to Layer 7 exploits.'
        }, null, 2),
        interviewTip: 'Without AWS WAF, the Application Load Balancer only provides Layer 4 protection (security groups). Layer 7 attacks like SQL injection, cross-site scripting (XSS), and HTTP floods pass directly through to EC2/containers.',
        pitfallWarning: 'Notice `WebACL: null`. The checkout endpoint is operating without web application firewall inspection.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Defensible Rule Construction',
        title: 'Create WebACL with AWS Managed Common Rule Set (CRS) & SQLi Rules',
        jobContext: 'Author a WebACL that incorporates AWSManagedRulesCommonRuleSet and AWSManagedRulesSQLiRuleSet with block actions.',
        consolePath: 'AWS Console > WAF & Shield > Web ACLs > Create Web ACL > Name: "WebACL-ProdCheckout-Protection" > Add Managed Rule Groups',
        cliCommand: 'aws wafv2 create-web-acl --name WebACL-ProdCheckout-Protection --scope REGIONAL --default-action Allow={} --rules \'[{"Name":"AWS-AWSManagedRulesCommonRuleSet","Priority":1,"Statement":{"ManagedRuleGroupStatement":{"VendorName":"AWS","Name":"AWSManagedRulesCommonRuleSet"}},"OverrideAction":{"None":{}},"VisibilityConfig":{"SampledRequestsEnabled":true,"CloudWatchMetricsEnabled":true,"MetricName":"CommonRulesMetric"}},{"Name":"AWS-AWSManagedRulesSQLiRuleSet","Priority":2,"Statement":{"ManagedRuleGroupStatement":{"VendorName":"AWS","Name":"AWSManagedRulesSQLiRuleSet"}},"OverrideAction":{"None":{}},"VisibilityConfig":{"SampledRequestsEnabled":true,"CloudWatchMetricsEnabled":true,"MetricName":"SQLiRulesMetric"}}]\' --visibility-config "SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=WebACLProdCheckout"',
        expectedOutput: JSON.stringify({
          Summary: {
            Name: 'WebACL-ProdCheckout-Protection',
            Id: 'waf-0123456789prod-acl',
            ARN: 'arn:aws:wafv2:us-east-1:123456789012:regional/webacl/WebACL-ProdCheckout-Protection/waf-0123456789prod-acl'
          }
        }, null, 2),
        interviewTip: 'Explain Rule Priorities and Actions: Priority 1 executes first. If an attack payload matches CommonRuleSet, it is blocked immediately without evaluating subsequent rules, saving processing costs.',
        pitfallWarning: 'When deploying to high-traffic production for the first time, use `Count` mode for 24-48 hours before switching to `Block` to audit for false positives on legitimate customer traffic.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Brute-Force & Flood Containment',
        title: 'Add Rate-Based Rule: Limit 2,000 Requests per 5 Minutes per IP',
        jobContext: 'Protect the checkout login and payment endpoints from brute-force credential stuffing and denial of service (DoS) attacks.',
        consolePath: 'AWS Console > WAF > WebACL-ProdCheckout-Protection > Rules > Add Rule > Rate-based rule > 2,000 requests',
        cliCommand: 'aws wafv2 update-web-acl --name WebACL-ProdCheckout-Protection --scope REGIONAL --id waf-0123456789prod-acl --default-action Allow={} --lock-token "test-token-123" --rules \'[{"Name":"RateLimitPerIP","Priority":0,"Statement":{"RateBasedStatement":{"Limit":2000,"AggregateKeyType":"IP"}},"Action":{"Block":{"CustomResponse":{"ResponseCode":429}}},"VisibilityConfig":{"SampledRequestsEnabled":true,"CloudWatchMetricsEnabled":true,"MetricName":"RateLimitMetric"}}]\' --visibility-config "SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=WebACLProdCheckout"',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Rate-based rule added at Priority 0. Aggressive flooding IPs automatically blocked with HTTP 429 Too Many Requests.'
        }, null, 2),
        interviewTip: 'Rate-based rules track client IPs over a sliding 5-minute evaluation window. As soon as request rates normalize below 2,000, AWS WAF automatically lifts the block.',
        pitfallWarning: 'If legitimate clients connect through corporate forward proxies (e.g. university or hospital networks), consider using AggregateKeyType: IP with forwarded IP header (X-Forwarded-For).'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Live Association',
        title: 'Associate WebACL with Production Application Load Balancer',
        jobContext: 'Link the configured WebACL to the live Application Load Balancer to begin real-time traffic inspection.',
        consolePath: 'AWS Console > WAF & Shield > WebACL-ProdCheckout-Protection > Associated AWS resources > Add AWS resources > Select alb-prod-checkout',
        cliCommand: 'aws wafv2 associate-web-acl --web-acl-arn arn:aws:wafv2:us-east-1:123456789012:regional/webacl/WebACL-ProdCheckout-Protection/waf-0123456789prod-acl --resource-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/alb-prod-checkout/50dc6c495c0c9188',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'WebACL successfully attached to Application Load Balancer alb-prod-checkout.'
        }, null, 2),
        interviewTip: 'Explain zero-downtime attachment: Associating a WAF WebACL does NOT reset existing TCP sessions or restart the Load Balancer.',
        pitfallWarning: 'Ensure CloudWatch alarms are set for WAF BlockedRequests metric so on-call engineers are notified if a surge of blocked traffic begins.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Simulate SQLi Payload & Verify 403 Forbidden Response',
        jobContext: 'Send a controlled test payload containing a standard SQL injection probe to verify WAF blocks the attack at the perimeter.',
        consolePath: 'AWS Console > WAF & Shield > WebACL-ProdCheckout-Protection > Sampled requests tab > Inspect blocked request',
        cliCommand: 'curl -i -s "http://alb-prod-checkout-12345.us-east-1.elb.amazonaws.com/api/v1/checkout?user=1%27%20OR%20%271%27=%271"',
        expectedOutput: `HTTP/1.1 403 Forbidden
Server: awselb/2.0
Date: Thu, 24 Sep 2026 20:50:00 GMT
Content-Type: text/html
Content-Length: 134
Connection: keep-alive
x-amzn-waf-action: block

<html><head><title>403 Forbidden</title></head><body><center><h1>403 Forbidden</h1>Request blocked by WAF policy rule.</center></body></html>`,
        interviewTip: 'Notice the header `x-amzn-waf-action: block` and the HTTP 403 response! This proves conclusively that the attack never reached backend application servers.',
        pitfallWarning: 'Never run automated penetration testing tools or aggressive vulnerability scanners against AWS production endpoints without prior AWS simulated event scoping.'
      }
    ]
  },
  {
    id: 'lab-eks-pod-compromise',
    labNumber: 'LAB-09',
    title: 'Amazon EKS Pod Compromise, K8s ServiceAccount Token Theft & IRSA Remediation',
    jobRole: 'DevSecOps Specialist',
    roleKey: 'devsecops',
    organization: 'Enterprise SaaS & Cloud-Native FinTech (EKS Production)',
    difficulty: 'Advanced',
    timeEstimate: '35 mins',
    mitreAttack: ['T1610 - Deploy Container', 'T1078.004 - Cloud Accounts', 'T1552.001 - Credentials in Files'],
    ticketId: 'SEC-8921',
    sla: '45 mins (P1 Critical)',
    incidentContext: 'GuardDuty EKS Runtime Monitoring detected suspicious container execution: a compromised Pod in the default namespace accessed the Kubernetes API with a stolen ServiceAccount token and attempted to assume the underlying EC2 Node instance profile.',
    architectureContext: 'EKS Cluster v1.30 with managed node groups. Pods share the EC2 worker node IAM role which has excessive permissions (AmazonS3FullAccess, DynamoDBFullAccess).',
    investigationSteps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Alert Triage & Scope Verification',
        title: 'Triage GuardDuty EKS Runtime Finding & Isolate Compromised Pod',
        jobContext: 'Inspect the GuardDuty detection payload to identify the cluster name, namespace, pod name, and container image.',
        consolePath: 'AWS Console > GuardDuty > Findings > Filter by "PrivilegeEscalation:Kubernetes/PrivilegedContainer"',
        cliCommand: 'aws guardduty list-findings --detector-id d-987654321 --finding-criteria \'{"Criterion": {"type": {"Eq": ["PrivilegeEscalation:Kubernetes/PrivilegedContainer"]}}}\'',
        expectedOutput: JSON.stringify({
          FindingIds: ['gd-eks-pod-compromise-9921']
        }, null, 2),
        interviewTip: 'Explain the difference between EKS Audit Log Monitoring and EKS Runtime Monitoring: Audit logs track control plane API calls, while Runtime Monitoring detects processes and syscalls inside containers.',
        pitfallWarning: 'Do not simply delete the pod! If it is managed by a Deployment, Kubernetes will immediately reschedule a new replica with the same vulnerable configuration.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Reconnaissance & Token Inspection',
        title: 'Inspect Worker Node IAM Role & Verify Excessive Node Permissions',
        jobContext: 'Check the IAM role attached to the EKS worker nodes to quantify the blast radius if container escape occurs.',
        consolePath: 'AWS Console > EKS > Clusters > prod-cluster > Compute > Node Groups > Node IAM Role',
        cliCommand: 'aws iam list-attached-role-policies --role-name EKS-Worker-Node-Managed-Role',
        expectedOutput: JSON.stringify({
          AttachedPolicies: [
            { PolicyName: 'AmazonEKSWorkerNodePolicy', PolicyArn: 'arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy' },
            { PolicyName: 'AmazonEKS_CNI_Policy', PolicyArn: 'arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy' },
            { PolicyName: 'AmazonEC2ContainerRegistryReadOnly', PolicyArn: 'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly' },
            { PolicyName: 'AmazonS3FullAccess', PolicyArn: 'arn:aws:iam::aws:policy/AmazonS3FullAccess' }
          ]
        }, null, 2),
        interviewTip: 'Highlight the danger of attaching `AmazonS3FullAccess` to worker nodes: ANY pod running on that EC2 instance can query the AWS metadata service and inherit full S3 access across the account.',
        pitfallWarning: 'Never attach business-data IAM policies (S3, DynamoDB) to EKS worker node roles. Node roles should strictly contain compute-plane infrastructure policies.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Network Quarantine',
        title: 'Apply Kubernetes NetworkPolicy to Block Pod Egress and IMDS Access',
        jobContext: 'Apply a restrictive Kubernetes NetworkPolicy to sever the compromised pod\'s network connectivity to external C2 servers and the metadata endpoint 169.254.169.254.',
        consolePath: 'AWS Console > CloudShell > kubectl apply -f isolate-pod.yaml',
        cliCommand: 'aws eks get-token --cluster-name prod-cluster > /tmp/token && kubectl --token=$(cat /tmp/token) annotate pod payment-service-789bf-2k1 quarantine=true --overwrite',
        expectedOutput: JSON.stringify({
          Status: 'Pod payment-service-789bf-2k1 annotated quarantine=true. Calico/VPC-CNI NetworkPolicy active: all ingress/egress dropped except forensic capture.'
        }, null, 2),
        interviewTip: 'Demonstrate deep knowledge of cloud-native forensics: NetworkPolicy isolation allows live memory analysis without allowing the attacker to exfiltrate data.',
        pitfallWarning: 'Verify that the VPC CNI network policy support or Calico is enabled on the cluster; standard EKS without policy support ignores NetworkPolicy manifests.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Least-Privilege Architecture',
        title: 'Configure IAM Roles for Service Accounts (IRSA) with OIDC',
        jobContext: 'Migrate the workload to use an IAM Role for Service Accounts (IRSA) with a dedicated role scoped strictly to the payment bucket.',
        consolePath: 'AWS Console > IAM > Roles > Create Role > Web identity > Select EKS OIDC Provider > payment-service-account',
        cliCommand: 'aws iam create-role --role-name EKS-PaymentService-IRSA-Role --assume-role-policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Federated":"arn:aws:iam::123456789012:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/EXAMPLE123"},"Action":"sts:AssumeRoleWithWebIdentity","Condition":{"StringEquals":{"oidc.eks.us-east-1.amazonaws.com/id/EXAMPLE123:sub":"system:serviceaccount:payments:payment-sa"}}}]}\'',
        expectedOutput: JSON.stringify({
          Role: {
            RoleName: 'EKS-PaymentService-IRSA-Role',
            Arn: 'arn:aws:iam::123456789012:role/EKS-PaymentService-IRSA-Role'
          }
        }, null, 2),
        interviewTip: 'Explain how IRSA works: AWS STS exchanges the projected Kubernetes service account token for temporary AWS credentials via OIDC federation, eliminating shared node credentials.',
        pitfallWarning: 'Ensure the OIDC condition uses `StringEquals` on both the OIDC issuer URL and the exact `system:serviceaccount:<namespace>:<serviceaccount>` name to prevent cross-namespace token reuse.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Remediation & Hardening',
        title: 'Remove Excessive S3 Policy from Worker Node & Enforce Hop Limit',
        jobContext: 'Detach `AmazonS3FullAccess` from the node role and set the EC2 IMDS hop limit to 1 so pods cannot reach the metadata service.',
        consolePath: 'AWS Console > IAM > Roles > EKS-Worker-Node-Managed-Role > Detach AmazonS3FullAccess',
        cliCommand: 'aws iam detach-role-policy --role-name EKS-Worker-Node-Managed-Role --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess && aws ec2 modify-instance-metadata-options --instance-id i-0123456789node --http-put-response-hop-limit 1 --http-tokens required',
        expectedOutput: JSON.stringify({
          InstanceMetadataOptions: {
            InstanceId: 'i-0123456789node',
            HttpTokens: 'required',
            HttpPutResponseHopLimit: 1,
            HttpEndpoint: 'enabled'
          }
        }, null, 2),
        interviewTip: 'The hop limit of 1 is the golden rule for container security on EC2: because container traffic must traverse a virtual bridge (veth), a hop limit of 1 prevents packets from reaching the metadata IP.',
        pitfallWarning: 'If using AWS VPC CNI with HostNetworking pods, test network plugins carefully before modifying metadata hop limits.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Verify Pod Cannot Access Node Metadata & Successfully Uses IRSA',
        jobContext: 'Run test verification queries inside the payment pod to confirm IMDS requests are dropped and AWS CLI calls only succeed via IRSA.',
        consolePath: 'AWS Console > CloudShell > Test STS caller identity inside pod',
        cliCommand: 'aws sts get-caller-identity',
        expectedOutput: JSON.stringify({
          UserId: 'AROAEXAMPLEIRSA:botocore-session-1234',
          Account: '123456789012',
          Arn: 'arn:aws:sts::123456789012:assumed-role/EKS-PaymentService-IRSA-Role/botocore-session-1234'
        }, null, 2),
        interviewTip: 'Point out the Arn in the output: `assumed-role/EKS-PaymentService-IRSA-Role`. This verifies that the workload is authenticated via IRSA with zero node-level trust exposure.',
        pitfallWarning: 'Document the incident post-mortem and establish an automated EKS PodSecurityPolicy/Kyverno rule requiring all pods to have readOnlyRootFilesystem.'
      }
    ]
  },
  {
    id: 'lab-github-secrets-leak',
    labNumber: 'LAB-10',
    title: 'Leaked Production AWS Access Keys on GitHub & Automated Blast-Radius Quarantine',
    jobRole: 'SecOps / Incident Responder',
    roleKey: 'secops-analyst',
    organization: 'FinTech Payment Processor (PCI-DSS Level 1)',
    difficulty: 'Intermediate',
    timeEstimate: '25 mins',
    mitreAttack: ['T1552.001 - Credentials in Files', 'T1078.004 - Cloud Accounts', 'T1530 - Data from Cloud Storage'],
    ticketId: 'SEC-9102',
    sla: '15 mins (P0 Critical)',
    incidentContext: 'An intern developer accidentally committed a `.env` file containing an active AWS Access Key ID (`AKIAIOSFODNN7EXAMPLE`) to a public GitHub repository. Within 4 minutes, automated bots in Russia and China attempted to spin up GPU EC2 instances and query S3 customer data.',
    architectureContext: 'IAM User `developer-alex` possessed legacy long-term access keys with broad permissions in the production AWS account.',
    investigationSteps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Minute-0 Intake & Deactivation',
        title: 'Immediately Deactivate Compromised AWS Access Key',
        jobContext: 'Kill the compromised access key immediately so no further API requests can be authenticated with these credentials.',
        consolePath: 'AWS Console > IAM > Users > developer-alex > Security credentials > Access keys > Actions > Deactivate',
        cliCommand: 'aws iam update-access-key --user-name developer-alex --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Access key AKIAIOSFODNN7EXAMPLE changed to Inactive.'
        }, null, 2),
        interviewTip: 'Always mark the key `Inactive` rather than deleting it immediately. Keeping the inactive key object preserves the key ID in CloudTrail logs for historical correlation.',
        pitfallWarning: 'Do not spend 20 minutes finding out who leaked it before deactivating the key. Every second the key is active, automated bots spawn crypto-mining instances.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Emergency Blast-Radius Quarantine',
        title: 'Attach Explicit Deny Boundary Policy to IAM User',
        jobContext: 'Apply an inline policy with an explicit Deny on all actions (`*`) to ensure any temporary sessions or active credentials associated with this user are immediately neutralized.',
        consolePath: 'AWS Console > IAM > Users > developer-alex > Add permissions > Create inline policy > JSON: DenyAll',
        cliCommand: 'aws iam put-user-policy --user-name developer-alex --policy-name EmergencyQuarantineDenyAll --policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*"}]}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Inline policy EmergencyQuarantineDenyAll attached. All actions denied by explicit deny.'
        }, null, 2),
        interviewTip: 'In AWS IAM policy evaluation logic, an explicit DENY always trumps any ALLOW. This guarantees that even if the user has AdministratorAccess, all actions are blocked instantly.',
        pitfallWarning: 'Remember that active STS sessions generated via `sts:GetSessionToken` before deactivation might remain valid until expiration unless an explicit deny or RevokeOlderSessions policy is applied.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Forensic CloudTrail Investigation',
        title: 'Audit CloudTrail for All API Calls Executed by the Leaked Key',
        jobContext: 'Query CloudTrail to identify every single API call invoked by `AKIAIOSFODNN7EXAMPLE` in the last 24 hours and list attacker source IP addresses.',
        consolePath: 'AWS Console > CloudTrail > Event history > Lookup: Access Key ID = AKIAIOSFODNN7EXAMPLE',
        cliCommand: 'aws cloudtrail lookup-events --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIAIOSFODNN7EXAMPLE --max-results 10',
        expectedOutput: JSON.stringify({
          Events: [
            { EventName: 'RunInstances', EventTime: '2026-09-24T18:12:00Z', SourceIPAddress: '198.51.100.44', ErrorCode: 'UnauthorizedOperation' },
            { EventName: 'ListBuckets', EventTime: '2026-09-24T18:12:05Z', SourceIPAddress: '198.51.100.44' },
            { EventName: 'GetObject', EventTime: '2026-09-24T18:12:30Z', SourceIPAddress: '203.0.113.89', Resources: [{ ResourceName: 'customer-contracts-prod' }] }
          ]
        }, null, 2),
        interviewTip: 'Demonstrate incident response rigor: Note both failed calls (`UnauthorizedOperation`) and successful calls (`GetObject`). If `GetObject` succeeded, initiate data breach disclosure procedures.',
        pitfallWarning: 'Remember that CloudTrail event delivery has a 5-15 minute latency. If the incident just occurred, continue monitoring the trail for newly arriving events.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Unauthorized Infrastructure Cleanup',
        title: 'Terminate Attacker Compute Instances & Revoke Shared Snapshots',
        jobContext: 'Inspect all EC2 regions for rogue instances spawned by the attacker (commonly `p3.16xlarge` or `g5.12xlarge` for mining).',
        consolePath: 'AWS Console > EC2 > Instances > Check all global regions > Terminate rogue instances',
        cliCommand: 'aws ec2 describe-instances --filters "Name=tag:Owner,Values=developer-alex" --query "Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]"',
        expectedOutput: JSON.stringify([
          ['i-0992381283miner01', 'running', 'g5.4xlarge']
        ], null, 2),
        interviewTip: 'Attackers frequently launch resources in obscure regions (e.g. `ap-southeast-3`, `me-south-1`) where organizations have less monitoring. Check all enabled regions.',
        pitfallWarning: 'Do not terminate the instance until you take an EBS volume snapshot for forensic analysis and memory dump if needed for legal proceedings.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Permanent Architectural Hardening',
        title: 'Migrate Developer to AWS IAM Identity Center (SSO) with MFA',
        jobContext: 'Permanently eliminate long-term access keys. Transition the developer to short-lived credentials via AWS IAM Identity Center with mandatory hardware WebAuthn MFA.',
        consolePath: 'AWS Console > IAM > Users > developer-alex > Delete access key > Enforce AWS IAM Identity Center',
        cliCommand: 'aws iam delete-access-key --user-name developer-alex --access-key-id AKIAIOSFODNN7EXAMPLE',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Long-term access key permanently deleted. User migrated to short-lived SSO credentials with max session duration 1 hour.'
        }, null, 2),
        interviewTip: 'State the modern cloud security standard: "In our organization, IAM users with long-term access keys are strictly prohibited by Service Control Policy (SCP). All human access requires IAM Identity Center SSO."',
        pitfallWarning: 'Ensure pre-commit hooks (such as `trufflehog` or `git-secrets`) are added to developer CI/CD pipelines to block commits containing high-entropy strings.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Verify Zero Active Access Keys for User & Check AWS Health',
        jobContext: 'Verify that the user has 0 active access keys and that AWS Compromised Credentials alerts are cleared.',
        consolePath: 'AWS Console > IAM > Users > developer-alex > Security credentials > Access keys count: 0',
        cliCommand: 'aws iam list-access-keys --user-name developer-alex',
        expectedOutput: JSON.stringify({
          AccessKeyMetadata: []
        }, null, 2),
        interviewTip: 'Show an empty `AccessKeyMetadata: []` list. This provides definitive proof to security compliance auditors that no valid static credentials exist for this principal.',
        pitfallWarning: 'Export and archive the CloudTrail audit log to an immutable S3 bucket with Object Lock for compliance records.'
      }
    ]
  },
  {
    id: 'lab-scp-organizations-bypass',
    labNumber: 'LAB-11',
    title: 'AWS Organizations Service Control Policy (SCP) Bypass & Member Account Quarantine',
    jobRole: 'Cloud Security Architect',
    roleKey: 'cloud-architect',
    organization: 'Global Enterprise Multi-Account Landing Zone (150+ AWS Accounts)',
    difficulty: 'Advanced',
    timeEstimate: '30 mins',
    mitreAttack: ['T1562.001 - Disable or Modify Cloud Tools', 'T1078.004 - Cloud Accounts'],
    ticketId: 'SEC-9244',
    sla: '30 mins (P1 High)',
    incidentContext: 'An administrator in a sandbox AWS account attempted to bypass corporate security boundaries by spinning up unapproved EC2 instance sizes in `af-south-1` and attempting to disable AWS Security Hub.',
    architectureContext: 'AWS Organizations multi-account structure with Core, Workloads, and Sandbox Organizational Units (OUs).',
    investigationSteps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Alert Triage & Scope Verification',
        title: 'Query AWS Config Compliance for Regional Restriction Violations',
        jobContext: 'Inspect AWS Config rule evaluation to pinpoint which member account violated the corporate Region Restriction policy.',
        consolePath: 'AWS Console > AWS Config > Compliance > Rules > required-regions-only',
        cliCommand: 'aws configservice get-compliance-details-by-config-rule --config-rule-name required-regions-only --compliance-types NON_COMPLIANT',
        expectedOutput: JSON.stringify({
          EvaluationResults: [
            {
              EvaluationResultIdentifier: {
                EvaluationResultQualifier: {
                  ConfigRuleName: 'required-regions-only',
                  ResourceType: 'AWS::EC2::Instance',
                  ResourceId: 'i-0af7892341cape'
                }
              },
              ComplianceType: 'NON_COMPLIANT',
              ResultRecordedTime: '2026-09-24T19:00:00Z'
            }
          ]
        }, null, 2),
        interviewTip: 'Explain AWS Config vs SCPs: SCPs are preventive controls (they block API calls before execution), while AWS Config is a detective control (it alerts on non-compliant configurations).',
        pitfallWarning: 'Never assume SCPs cover every action. Master account root is immune to SCPs, and service-linked roles can sometimes execute authorized internal operations.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Reconnaissance & SCP Analysis',
        title: 'Inspect Active SCPs on the Sandbox Organizational Unit',
        jobContext: 'Examine the SCPs attached to the target OU to determine why the regional restriction failed to block the action.',
        consolePath: 'AWS Console > AWS Organizations > Organize accounts > Sandbox OU > Policies tab',
        cliCommand: 'aws organizations list-policies-for-target --target-id ou-prod-sandbox12 --filter SERVICE_CONTROL_POLICY',
        expectedOutput: JSON.stringify({
          Policies: [
            { Id: 'p-FullAWSAccess', Name: 'FullAWSAccess', Type: 'SERVICE_CONTROL_POLICY' }
          ]
        }, null, 2),
        interviewTip: 'Identify the flaw immediately: The Sandbox OU had only `FullAWSAccess` attached! Without an explicit Region Restriction SCP, any region is permitted.',
        pitfallWarning: 'When designing SCPs, remember that SCPs do not grant permissions; they set maximum boundaries. Both an SCP ALLOW and an IAM ALLOW are required.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Account Quarantine',
        title: 'Move Compromised Account to Quarantine OU',
        jobContext: 'Move the offending member account out of the Sandbox OU into the `Quarantine-Isolated` OU where strict lockdown SCPs are enforced.',
        consolePath: 'AWS Console > AWS Organizations > Move account > Destination: Quarantine-OU',
        cliCommand: 'aws organizations move-account --account-id 112233445566 --source-parent-id ou-prod-sandbox12 --destination-parent-id ou-quarantine-isolated',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Account 112233445566 moved to Quarantine OU successfully.'
        }, null, 2),
        interviewTip: 'Explain why moving an account into a Quarantine OU is safer than deleting it: It immediately applies lockdown policies without breaking centralized billing or deleting forensic data.',
        pitfallWarning: 'Verify that the Quarantine OU does NOT inherit permissive SCPs from the organization root.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Quarantine Lockdown Policy',
        title: 'Attach DenyAllExceptSecurityOperations SCP to Quarantined Account',
        jobContext: 'Apply a restrictive SCP that denies all non-security operations while preserving access for the central SecurityAudit role.',
        consolePath: 'AWS Console > AWS Organizations > Policies > Service control policies > Attach SCP-Quarantine-Lockdown',
        cliCommand: 'aws organizations attach-policy --policy-id p-QuarantineStrictLockdown --target-id 112233445566',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Policy p-QuarantineStrictLockdown attached to target account.'
        }, null, 2),
        interviewTip: 'Ensure the Quarantine SCP has a `Condition` with `StringNotLike: { "aws:PrincipalArn": ["arn:aws:iam::*:role/AWSControlTowerExecution", "arn:aws:iam::*:role/SecOps-IncidentResponder"] }` so security teams can still remediate.',
        pitfallWarning: 'Do not lock out the root or management role needed to manage the account remotely.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Permanent Global SCP',
        title: 'Deploy Production-Grade Region Restriction SCP across Workloads',
        jobContext: 'Author a global SCP denying all actions outside `us-east-1` and `us-west-2`, exempting global services like CloudFront, IAM, Route53, and STS.',
        consolePath: 'AWS Console > AWS Organizations > Policies > Create Policy > Name: EnforceApprovedRegionsOnly',
        cliCommand: 'aws organizations create-policy --name EnforceApprovedRegionsOnly --type SERVICE_CONTROL_POLICY --content \'{"Version":"2012-10-17","Statement":[{"Sid":"DenyUnapprovedRegions","Effect":"Deny","NotAction":["cloudfront:*","iam:*","route53:*","support:*","sts:*"],"Resource":"*","Condition":{"StringNotEquals":{"aws:RequestedRegion":["us-east-1","us-west-2"]}}}]}\'',
        expectedOutput: JSON.stringify({
          Policy: {
            PolicySummary: {
              Id: 'p-RegionRestrictionMaster',
              Name: 'EnforceApprovedRegionsOnly',
              Type: 'SERVICE_CONTROL_POLICY'
            }
          }
        }, null, 2),
        interviewTip: 'Why is `NotAction` with global services required? If you deny all actions outside approved regions, global services like CloudFront or Route53 (which operate in `us-east-1` globally) will break!',
        pitfallWarning: 'Always exclude `support:*` and `sts:*` so engineers can open AWS support cases and authenticate.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Attempt Launch in Restricted Region & Confirm AccessDeniedException',
        jobContext: 'Execute a test EC2 launch command targeting `af-south-1` from the member account to verify the SCP denies the call.',
        consolePath: 'AWS Console > CloudShell > Run EC2 launch in af-south-1',
        cliCommand: 'aws ec2 run-instances --image-id ami-012345af --instance-type t3.micro --region af-south-1',
        expectedOutput: `An error occurred (AccessDeniedException) when calling the RunInstances operation: User is not authorized to perform: ec2:RunInstances on resource with an explicit deny in a service control policy.`,
        interviewTip: 'Note the exact error text: `with an explicit deny in a service control policy`. This proves beyond doubt that the SCP is functioning at the organization boundary.',
        pitfallWarning: 'Verify that AWS CloudTrail log files in the management account capture the `AccessDeniedException` event with the SCP policy identifier.'
      }
    ]
  },
  {
    id: 'lab-apigw-lambda-sqli',
    labNumber: 'LAB-12',
    title: 'API Gateway Parameter Tampering to Aurora Serverless SQLi & IAM DB Authentication',
    jobRole: 'Cloud Security Engineer',
    roleKey: 'cloud-sec-eng',
    organization: 'FinTech Consumer Mobile App Backend',
    difficulty: 'Advanced',
    timeEstimate: '35 mins',
    mitreAttack: ['T1190 - Exploit Public-Facing Application', 'T1005 - Data from Local System'],
    ticketId: 'SEC-9311',
    sla: '30 mins (P1 Critical)',
    incidentContext: 'An API Gateway endpoint `/v1/accounts/search` was exploited via raw SQL string concatenation in a Python Lambda function, dumping hashed customer passwords from Aurora PostgreSQL.',
    architectureContext: 'Amazon API Gateway HTTP API -> AWS Lambda (Python 3.12) -> Amazon Aurora PostgreSQL Serverless v2.',
    investigationSteps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Alert Triage & Scope Verification',
        title: 'Inspect API Gateway Access Logs & Identify Malicious Queries',
        jobContext: 'Analyze CloudWatch Logs for API Gateway to identify the attacker\'s request payload and source IP.',
        consolePath: 'AWS Console > CloudWatch > Log groups > /aws/apigateway/prod-api > Search: 500 error or syntax error',
        cliCommand: 'aws logs filter-log-events --log-group-name /aws/apigateway/prod-api --filter-pattern "UNION SELECT" --max-items 5',
        expectedOutput: JSON.stringify({
          events: [
            {
              timestamp: 1727209200000,
              message: 'GET /v1/accounts/search?username=admin%27%20UNION%20SELECT%20password_hash,email%20FROM%20users-- HTTP 500'
            }
          ]
        }, null, 2),
        interviewTip: 'Explain how API Gateway access logs capture the raw query string parameters, user-agent, and response latency. This is essential for reconstructing the attacker\'s discovery timeline.',
        pitfallWarning: 'Ensure API Gateway access logging is enabled with JSON formatting. Without it, you only get basic execution metrics without payload visibility.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Lambda Source Code Inspection',
        title: 'Review Lambda Source Code for Vulnerable SQL String Concatenation',
        jobContext: 'Inspect the Lambda function code to identify the exact line vulnerable to SQL injection.',
        consolePath: 'AWS Console > Lambda > Functions > AccountSearchFunction > Code source > lambda_function.py',
        cliCommand: 'aws lambda get-function --function-name AccountSearchFunction --query "Code.Location"',
        expectedOutput: JSON.stringify({
          VulnerableSnippet: "query = f\"SELECT * FROM accounts WHERE name = '{username}'\"  # INSECURE CONCATENATION"
        }, null, 2),
        interviewTip: 'Point out the vulnerability: The developer used an f-string without parameterized binding. In production Python, always use parameterized queries with `psycopg2` or an ORM like SQLAlchemy.',
        pitfallWarning: 'Never attempt to "sanitize" SQL strings with custom regexes; parameterized queries are the ONLY cryptographically sound defense against SQL injection.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Emergency Perimeter Containment',
        title: 'Deploy API Gateway Request Validator with Strict Regex Schema',
        jobContext: 'Block malicious characters at the API Gateway perimeter using built-in request validation before requests even reach the Lambda function.',
        consolePath: 'AWS Console > API Gateway > Models > Create Model > RequestValidator: Validate body, query string parameters, and headers',
        cliCommand: 'aws apigateway update-request-validator --rest-api-id api-12345 --request-validator-id val-001 --patch-operations op=replace,path=/validateRequestParameters,value=true',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          validateRequestParameters: true,
          Status: 'Request validator active: query strings violating alphanumeric schema are rejected with HTTP 400.'
        }, null, 2),
        interviewTip: 'Highlight defense-in-depth: Even if backend code has a flaw, API Gateway request validation prevents malformed characters from triggering execution, reducing Lambda invocation costs.',
        pitfallWarning: 'Test request validation schemas thoroughly in staging to avoid rejecting legitimate user search queries containing accents or spaces.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Database Identity Hardening',
        title: 'Transition Aurora Database to AWS IAM Database Authentication',
        jobContext: 'Eliminate hardcoded database passwords stored in environment variables. Enable IAM Database Authentication on Aurora PostgreSQL.',
        consolePath: 'AWS Console > RDS > Databases > aurora-prod-cluster > Modify > Database authentication: Password and IAM database authentication',
        cliCommand: 'aws rds modify-db-cluster --db-cluster-identifier aurora-prod-cluster --enable-iam-database-authentication --apply-immediately',
        expectedOutput: JSON.stringify({
          DBCluster: {
            DBClusterIdentifier: 'aurora-prod-cluster',
            IAMDatabaseAuthenticationEnabled: true
          }
        }, null, 2),
        interviewTip: 'Explain IAM Database Authentication: Instead of storing database passwords, Lambda requests an ephemeral 15-minute authentication token from AWS STS via `rds:connect`.',
        pitfallWarning: 'Remember to run `GRANT rds_iam TO <db_user>;` inside PostgreSQL after enabling IAM auth at the cluster level.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Secure Code Deployment',
        title: 'Deploy Patched Lambda Function with Parameterized SQL Queries',
        jobContext: 'Update the Lambda function code to use parameterized queries (`cursor.execute(query, (username,))`) and deploy the patched package.',
        consolePath: 'AWS Console > Lambda > Functions > AccountSearchFunction > Update code > Deploy',
        cliCommand: 'aws lambda update-function-code --function-name AccountSearchFunction --zip-file fileb://patched-search.zip',
        expectedOutput: JSON.stringify({
          FunctionName: 'AccountSearchFunction',
          LastUpdateStatus: 'Successful',
          CodeSha256: '9k8s7d6f5a4b3c2e1f0e9d8c7b6a5f4e3d2c1b0a='
        }, null, 2),
        interviewTip: 'Explain parameterized queries: The database treats the user input strictly as literal data, never as executable SQL command syntax, completely eliminating SQL injection.',
        pitfallWarning: 'Ensure automated CI/CD static application security testing (SAST) tools like Semgrep or Bandit are integrated into the pipeline to catch raw SQL queries.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Execute SQLi Exploit Probe & Confirm Rejection with HTTP 400',
        jobContext: 'Send the original attack probe through the API Gateway endpoint and verify that the perimeter validator blocks the request with HTTP 400 Bad Request.',
        consolePath: 'AWS Console > CloudShell > curl API Gateway endpoint with SQLi probe',
        cliCommand: 'curl -i -s "https://api-12345.execute-api.us-east-1.amazonaws.com/v1/accounts/search?username=admin%27%20OR%201=1--"',
        expectedOutput: `HTTP/2 400 Bad Request
date: Thu, 24 Sep 2026 21:05:00 GMT
content-type: application/json
content-length: 42
x-amzn-errortype: InvalidQueryParameterException

{"message": "Invalid query parameter value"}`,
        interviewTip: 'Notice the response: `400 Bad Request` with `InvalidQueryParameterException`. The attack was dropped entirely at the AWS perimeter, and zero Lambda executions were billed.',
        pitfallWarning: 'Check Aurora query logs to verify zero database calls were recorded during this test.'
      }
    ]
  },
  {
    id: 'lab-tgw-route-poisoning',
    labNumber: 'LAB-13',
    title: 'AWS Transit Gateway Route Table Hijacking & VPC Flow Log Forensic Reconstruction',
    jobRole: 'Cloud Security Engineer',
    roleKey: 'cloud-sec-eng',
    organization: 'Global Multi-VPC Cloud Enterprise Network',
    difficulty: 'Advanced',
    timeEstimate: '35 mins',
    mitreAttack: ['T1557 - Adversary-in-the-Middle', 'T1046 - Network Service Discovery'],
    ticketId: 'SEC-9420',
    sla: '30 mins (P1 Critical)',
    incidentContext: 'An unauthorized IAM principal modified a production Transit Gateway (TGW) route table, routing all traffic destined for the Payment Processing VPC through an unapproved rogue inspection VPC.',
    architectureContext: 'AWS Transit Gateway interconnecting 4 VPCs (Ingress, Egress, Shared Services, Payment Tier).',
    investigationSteps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Alert Triage & Scope Verification',
        title: 'Detect Anomalous Transit Gateway Route Table Associations',
        jobContext: 'Inspect the live Transit Gateway route tables to identify which route was altered and where traffic is currently flowing.',
        consolePath: 'AWS Console > VPC > Transit Gateways > Transit Gateway Route Tables > Routes tab',
        cliCommand: 'aws ec2 search-transit-gateway-routes --transit-gateway-route-table-id tgw-rtb-01234prod --filters "Name=route-search.exact-match,Values=10.50.0.0/16"',
        expectedOutput: JSON.stringify({
          Routes: [
            {
              DestinationCidrBlock: '10.50.0.0/16',
              TransitGatewayAttachmentId: 'tgw-attach-0rogue987',
              Type: 'static',
              State: 'active'
            }
          ]
        }, null, 2),
        interviewTip: 'Explain Transit Gateway Route Tables: Each attached VPC can be associated with a specific route table. A malicious route can divert sensitive database or payment subnets to an attacker-controlled sniffing instance.',
        pitfallWarning: 'Do not delete the Transit Gateway attachment immediately; record the attachment ID and target VPC ID for the incident report and evidence chain.'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: CloudTrail Forensic Attribution',
        title: 'Query CloudTrail for CreateTransitGatewayRoute API Call',
        jobContext: 'Search CloudTrail event logs to identify the user ARN, source IP, and timestamp when the malicious route was inserted.',
        consolePath: 'AWS Console > CloudTrail > Event history > Event name: CreateTransitGatewayRoute',
        cliCommand: 'aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=CreateTransitGatewayRoute --max-results 5',
        expectedOutput: JSON.stringify({
          Events: [
            {
              EventName: 'CreateTransitGatewayRoute',
              EventTime: '2026-09-24T19:45:00Z',
              Username: 'contractor-dev-temp',
              SourceIPAddress: '198.51.100.77',
              UserIdentity: { Arn: 'arn:aws:iam::123456789012:user/contractor-dev-temp' }
            }
          ]
        }, null, 2),
        interviewTip: 'Identify the principal: `contractor-dev-temp`. Review whether this contractor account should have had `ec2:CreateTransitGatewayRoute` permissions.',
        pitfallWarning: 'Always correlate the `SourceIPAddress` with VPN session logs to determine whether the contractor\'s credentials were stolen or abused directly.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Immediate Route Remediation',
        title: 'Delete Poisoned Route & Re-establish Legitimate Payment VPC Path',
        jobContext: 'Delete the rogue static route and restore the correct route pointing directly to the Payment VPC attachment.',
        consolePath: 'AWS Console > VPC > Transit Gateway Route Tables > Select tgw-rtb-01234prod > Delete Route > Add Route 10.50.0.0/16 -> tgw-attach-legit-payment',
        cliCommand: 'aws ec2 delete-transit-gateway-route --transit-gateway-route-table-id tgw-rtb-01234prod --destination-cidr-block 10.50.0.0/16 && aws ec2 create-transit-gateway-route --destination-cidr-block 10.50.0.0/16 --transit-gateway-route-table-id tgw-rtb-01234prod --transit-gateway-attachment-id tgw-attach-0legitpayment',
        expectedOutput: JSON.stringify({
          Route: {
            DestinationCidrBlock: '10.50.0.0/16',
            TransitGatewayAttachmentId: 'tgw-attach-0legitpayment',
            Type: 'static',
            State: 'active'
          }
        }, null, 2),
        interviewTip: 'Show precision: Notice that we immediately restored the correct route in the same step. This ensures legitimate payment processing transactions resume with minimal disruption.',
        pitfallWarning: 'Be aware of route propagation delays (typically 1-3 seconds). Verify that BGP / static routing tables reflect the update.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: VPC Flow Log Exfiltration Analysis',
        title: 'Query VPC Flow Logs to Quantify Data Transferred to Rogue Attachment',
        jobContext: 'Execute a CloudWatch Logs Insights query over VPC Flow Logs to calculate the total bytes transferred to the rogue VPC during the compromise window.',
        consolePath: 'AWS Console > CloudWatch > Logs Insights > Select VPC Flow Logs > Run query',
        cliCommand: 'aws logs start-query --log-group-name /aws/vpc/flowlogs/prod --start-time 1727205000 --end-time 1727210000 --query-string "fields @timestamp, srcAddr, dstAddr, bytes | filter dstAddr like /10.99./ | stats sum(bytes) by srcAddr"',
        expectedOutput: JSON.stringify({
          results: [
            [{ field: 'srcAddr', value: '10.10.4.15' }, { field: 'sum(bytes)', value: '4502000' }]
          ],
          status: 'Complete'
        }, null, 2),
        interviewTip: 'VPC Flow Log metrics (`sum(bytes)`) are critical for breach disclosure: 4.5 MB was transferred. Knowing the exact byte count allows legal and forensic teams to assess if full database dumps occurred.',
        pitfallWarning: 'VPC Flow Logs do not capture packet payload data (application-layer bytes), only IP headers, ports, packets, and byte counts.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Network IAM Permissions Boundary',
        title: 'Enforce IAM Permissions Boundary on Transit Gateway Operations',
        jobContext: 'Create an IAM Permissions Boundary that prevents non-Core-Network engineers from creating or modifying Transit Gateway routes.',
        consolePath: 'AWS Console > IAM > Policies > Create Policy > Restrict TGW Route Modifications',
        cliCommand: 'aws iam put-user-policy --user-name contractor-dev-temp --policy-name DenyTGWModifications --policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":["ec2:*TransitGateway*"],"Resource":"*"}]}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Explicit Deny attached. User cannot execute any Transit Gateway API calls.'
        }, null, 2),
        interviewTip: 'In enterprise cloud environments, networking resources (Transit Gateways, DirectConnect) must be managed strictly by an isolated Network Engineering role through Terraform CI/CD.',
        pitfallWarning: 'Audit existing IAM policies for wildcard actions like `ec2:*` which inadvertently grant full Transit Gateway control.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Verify Legitimate Payment Traffic Routing & Zero Traffic to Rogue VPC',
        jobContext: 'Re-run Transit Gateway route table search to verify 100% of traffic destined for `10.50.0.0/16` routes to the certified payment attachment.',
        consolePath: 'AWS Console > VPC > Transit Gateways > Search routes for 10.50.0.0/16',
        cliCommand: 'aws ec2 search-transit-gateway-routes --transit-gateway-route-table-id tgw-rtb-01234prod --filters "Name=route-search.exact-match,Values=10.50.0.0/16"',
        expectedOutput: JSON.stringify({
          Routes: [
            {
              DestinationCidrBlock: '10.50.0.0/16',
              TransitGatewayAttachmentId: 'tgw-attach-0legitpayment',
              Type: 'static',
              State: 'active'
            }
          ]
        }, null, 2),
        interviewTip: 'Conclude with audit evidence: The verified route targets `tgw-attach-0legitpayment`, and the contractor user is restricted from future network changes.',
        pitfallWarning: 'Document the incident post-mortem and present findings at the weekly security engineering retrospective.'
      }
    ]
  },
  {
    id: 'lab-kms-ransomware-deletion',
    labNumber: 'LAB-14',
    title: 'KMS Customer Master Key Malicious Deletion Triage & S3 Ransomware Recovery',
    jobRole: 'SecOps / Incident Responder',
    roleKey: 'secops-analyst',
    organization: 'Healthcare HealthTech SaaS (HIPAA Certified)',
    difficulty: 'Advanced',
    timeEstimate: '30 mins',
    mitreAttack: ['T1486 - Data Encrypted for Impact', 'T1485 - Data Destruction'],
    ticketId: 'SEC-9550',
    sla: '15 mins (P0 Critical)',
    incidentContext: 'A rogue contractor scheduled the primary AWS KMS Customer Master Key (CMK) encrypting all patient health records for deletion with a 7-day waiting period, threatening to render 50 TB of clinical records permanently unrecoverable.',
    architectureContext: 'AWS KMS Customer Managed Key (CMK) with S3 Bucket Keys encrypting medical patient records (PHI).',
    investigationSteps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Alert Triage & Scope Verification',
        title: 'Inspect KMS Key Status & Confirm Pending Deletion State',
        jobContext: 'Query AWS KMS to check the key state and determine the exact date and time the key is scheduled to be permanently destroyed.',
        consolePath: 'AWS Console > KMS > Customer managed keys > Filter by status: Pending deletion',
        cliCommand: 'aws kms describe-key --key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
        expectedOutput: JSON.stringify({
          KeyMetadata: {
            KeyId: '12345678-1234-1234-1234-123456789012',
            KeyState: 'PendingDeletion',
            DeletionDate: '2026-10-01T20:00:00Z',
            Description: 'Primary PHI Database Encryption Key'
          }
        }, null, 2),
        interviewTip: 'Explain AWS KMS Deletion Semantics: KMS enforces a mandatory minimum waiting period between 7 and 30 days before a key is permanently destroyed. A key can NEVER be deleted instantly.',
        pitfallWarning: 'While a key is in `PendingDeletion` state, all cryptographic operations (`Encrypt`, `Decrypt`, `GenerateDataKey`) fail immediately, causing application downtime!'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Minute-0 Key Recovery',
        title: 'Cancel KMS Key Deletion Immediately to Restore Decryption',
        jobContext: 'Execute `cancel-key-deletion` to immediately transition the KMS key back to `Enabled` state, restoring application decryption operations.',
        consolePath: 'AWS Console > KMS > Customer managed keys > Select key > Key actions > Cancel key deletion',
        cliCommand: 'aws kms cancel-key-deletion --key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
        expectedOutput: JSON.stringify({
          KeyId: 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
          KeyState: 'Enabled'
        }, null, 2),
        interviewTip: 'Calling `cancel-key-deletion` instantaneously changes KeyState to `Enabled`. Application decryption calls begin succeeding within milliseconds without key re-generation.',
        pitfallWarning: 'Do not delay: If the deletion date passes, the cryptographic material is wiped from AWS HSMs forever and ciphertext encrypted with it can NEVER be decrypted by anyone.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Forensic CloudTrail Attribution',
        title: 'Identify Who Called ScheduleKeyDeletion via CloudTrail',
        jobContext: 'Query CloudTrail to identify the IAM identity, source IP, and user-agent that scheduled the key deletion.',
        consolePath: 'AWS Console > CloudTrail > Event history > Event name: ScheduleKeyDeletion',
        cliCommand: 'aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ScheduleKeyDeletion --max-results 1',
        expectedOutput: JSON.stringify({
          Events: [
            {
              EventName: 'ScheduleKeyDeletion',
              EventTime: '2026-09-24T18:00:00Z',
              Username: 'contractor-dev-temp',
              SourceIPAddress: '198.51.100.77',
              UserIdentity: { Arn: 'arn:aws:iam::123456789012:user/contractor-dev-temp' }
            }
          ]
        }, null, 2),
        interviewTip: 'Notice the correlation: The same compromised user `contractor-dev-temp` from the network attack also attempted KMS key destruction, confirming a persistent adversary.',
        pitfallWarning: 'Immediately revoke all active credentials for `contractor-dev-temp` across all accounts.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: KMS Key Policy Hardening',
        title: 'Lock Down KMS Key Policy to Deny ScheduleKeyDeletion for All Non-Root Principals',
        jobContext: 'Update the KMS Key Policy to explicitly deny `kms:ScheduleKeyDeletion` and `kms:DeleteImportedKeyMaterial` for all IAM users and roles.',
        consolePath: 'AWS Console > KMS > Customer managed keys > Select key > Key policy > Edit key policy',
        cliCommand: 'aws kms put-key-policy --key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012 --policy-name default --policy \'{"Version":"2012-10-17","Statement":[{"Sid":"DenyKeyDeletionForNonRoot","Effect":"Deny","Principal":"*","Action":["kms:ScheduleKeyDeletion","kms:Delete*"],"Resource":"*","Condition":{"StringNotEquals":{"aws:PrincipalArn":["arn:aws:iam::123456789012:root"]}}}]}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'KMS Key Policy updated. Deletion operations strictly restricted to AWS Account Root.'
        }, null, 2),
        interviewTip: 'Restricting key deletion to the AWS Account Root is an industry gold standard: In enterprise environments, root credentials require multi-person physical hardware tokens.',
        pitfallWarning: 'Be extremely careful editing KMS key policies: If you remove all administrative access statements, you can lock yourself out of administering the key.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: S3 Ransomware Versioning Defense',
        title: 'Enforce S3 Object Lock & MFA Delete on Patient Records Bucket',
        jobContext: 'Protect the encrypted patient records S3 bucket against malicious overwriting or encryption tampering by enabling S3 Object Lock in Compliance Mode.',
        consolePath: 'AWS Console > S3 > patient-records-prod > Properties > Object Lock: Enable Compliance Mode',
        cliCommand: 'aws s3api put-object-lock-configuration --bucket patient-records-prod --object-lock-configuration \'{"ObjectLockEnabled":"Enabled","Rule":{"DefaultRetention":{"Mode":"COMPLIANCE","Days":365}}}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'S3 Object Lock enabled in COMPLIANCE mode for 365 days. Objects cannot be deleted or overwritten by ANY user, including AWS account root.'
        }, null, 2),
        interviewTip: 'Explain Compliance Mode vs Governance Mode in S3 Object Lock: In Governance mode, users with special IAM permissions can bypass retention. In COMPLIANCE mode, NO ONE (not even root or AWS support) can delete the object until the retention period expires.',
        pitfallWarning: 'Object Lock must be enabled when creating the bucket, or requires contacting AWS Support to turn on for existing buckets.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Verify Key State is Enabled & Decryption Requests Function',
        jobContext: 'Perform a test encryption and decryption round-trip using AWS KMS to prove that cryptographic operations are 100% restored.',
        consolePath: 'AWS Console > CloudShell > Run kms encrypt/decrypt round trip',
        cliCommand: 'aws kms encrypt --key-id arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012 --plaintext "healthcheck" --output text --query CiphertextBlob | aws kms decrypt --ciphertext-blob fileb://<(cat) --output text --query Plaintext',
        expectedOutput: `healthcheck`,
        interviewTip: 'The round-trip verification returns `healthcheck`. This demonstrates that both encryption and decryption pipelines are operational and customer records are protected.',
        pitfallWarning: 'Archive all CloudTrail evidence in an immutable bucket for compliance reporting to healthcare regulators.'
      }
    ]
  },
  {
    id: 'lab-cicd-oidc-hijack',
    labNumber: 'LAB-15',
    title: 'GitHub Actions OIDC Trust Policy Hijacking & Terraform State Tamper Defense',
    jobRole: 'DevSecOps Specialist',
    roleKey: 'devsecops',
    organization: 'Enterprise FinTech Infrastructure (Terraform Core)',
    difficulty: 'Advanced',
    timeEstimate: '35 mins',
    mitreAttack: ['T1195.002 - Compromise Software Supply Chain', 'T1078.004 - Cloud Accounts'],
    ticketId: 'SEC-9672',
    sla: '30 mins (P1 Critical)',
    incidentContext: 'An overly permissive GitHub Actions OIDC IAM Trust Policy allowed any public fork of an open-source tool repository to assume a production deployment role and download sensitive Terraform state files containing database master passwords.',
    architectureContext: 'GitHub Actions CI/CD pipeline using OpenID Connect (OIDC) to assume IAM Role `TerraformDeployerRole`.',
    investigationSteps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Alert Triage & Scope Verification',
        title: 'Inspect Suspicious sts:AssumeRoleWithWebIdentity CloudTrail Events',
        jobContext: 'Search CloudTrail for `AssumeRoleWithWebIdentity` calls to identify which GitHub repository workflows assumed the production role.',
        consolePath: 'AWS Console > CloudTrail > Event history > Event name: AssumeRoleWithWebIdentity',
        cliCommand: 'aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=AssumeRoleWithWebIdentity --max-results 5',
        expectedOutput: JSON.stringify({
          Events: [
            {
              EventName: 'AssumeRoleWithWebIdentity',
              EventTime: '2026-09-24T20:10:00Z',
              SourceIPAddress: '140.82.112.4',
              UserIdentity: {
                PrincipalId: 'token.actions.githubusercontent.com:repo:attacker-account/core-infra:ref:refs/heads/hack',
                Arn: 'arn:aws:sts::123456789012:assumed-role/TerraformDeployerRole/GitHubActions'
              }
            }
          ]
        }, null, 2),
        interviewTip: 'Look at the PrincipalId: `repo:attacker-account/core-infra`. The role was assumed from an external fork owned by `attacker-account`, NOT the corporate GitHub organization `my-org`!',
        pitfallWarning: 'When setting up GitHub Actions OIDC, if you forget to validate the repository owner, ANY GitHub user in the world who creates an action targeting your role ARN can assume it!'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Trust Policy Vulnerability Analysis',
        title: 'Review IAM Role Trust Relationship for Wildcard Condition Flaw',
        jobContext: 'Inspect the trust policy of `TerraformDeployerRole` to spot the wildcard string match.',
        consolePath: 'AWS Console > IAM > Roles > TerraformDeployerRole > Trust relationships tab',
        cliCommand: 'aws iam get-role --role-name TerraformDeployerRole --query "Role.AssumeRolePolicyDocument"',
        expectedOutput: JSON.stringify({
          Statement: [
            {
              Effect: 'Allow',
              Principal: { Federated: 'arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com' },
              Action: 'sts:AssumeRoleWithWebIdentity',
              Condition: {
                StringLike: { 'token.actions.githubusercontent.com:sub': 'repo:*:*' }
              }
            }
          ]
        }, null, 2),
        interviewTip: 'Identify the smoking gun: `repo:*:*`! This wildcard told AWS STS to trust ANY GitHub repository, branch, or pull request on all of GitHub.',
        pitfallWarning: 'Never use `repo:*:*` in OIDC trust conditions. Always pin the exact organization and repository name.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Minute-0 Trust Policy Containment',
        title: 'Lock Down OIDC Condition to Strict Organization & Main Branch',
        jobContext: 'Rewrite the trust policy immediately to restrict assumptions strictly to `repo:my-org/core-infra:ref:refs/heads/main`.',
        consolePath: 'AWS Console > IAM > Roles > TerraformDeployerRole > Edit trust policy',
        cliCommand: 'aws iam update-assume-role-policy --role-name TerraformDeployerRole --policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Federated":"arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"},"Action":"sts:AssumeRoleWithWebIdentity","Condition":{"StringEquals":{"token.actions.githubusercontent.com:aud":"sts.amazonaws.com","token.actions.githubusercontent.com:sub":"repo:my-org/core-infra:ref:refs/heads/main"}}}]}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Trust policy updated with StringEquals condition pinning repo:my-org/core-infra on main branch.'
        }, null, 2),
        interviewTip: 'Explain the two crucial claims: `aud` must match `sts.amazonaws.com`, and `sub` must match `repo:<org>/<repo>:ref:refs/heads/<branch>`. This guarantees only verified workflow runs from the main branch can authenticate.',
        pitfallWarning: 'Do not allow pull requests (`pull_request` events) to assume write-level production deployment roles. PRs from external forks can execute arbitrary code.'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Active Session Invalidation',
        title: 'Revoke All Existing Active STS Sessions Issued Prior to the Fix',
        jobContext: 'Attach an explicit `aws:TokenIssueTime` deny statement to revoke any temporary credentials that the attacker may have assumed in the last hour.',
        consolePath: 'AWS Console > IAM > Roles > TerraformDeployerRole > Revoke sessions tab',
        cliCommand: 'aws iam put-role-policy --role-name TerraformDeployerRole --policy-name RevokeOlderSessions --policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*","Condition":{"DateLessThan":{"aws:TokenIssueTime":"2026-09-24T20:30:00Z"}}}]}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Inline policy RevokeOlderSessions attached. All credentials issued prior to 20:30:00Z rejected.'
        }, null, 2),
        interviewTip: 'Demonstrate deep AWS STS knowledge: Updating a trust policy does NOT cancel active 1-hour session credentials that were already minted. Attaching a `DateLessThan: { aws:TokenIssueTime }` policy is the only way to invalidate them immediately.',
        pitfallWarning: 'Ensure the timestamp is formatted in ISO 8601 UTC format (`YYYY-MM-DDTHH:MM:SSZ`).'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Terraform State Protection',
        title: 'Harden Terraform State S3 Bucket with KMS & Restrict Access',
        jobContext: 'Protect the Terraform S3 state bucket (`terraform-state-prod`) by enabling SSE-KMS with CMK key rotation and denying access to non-CI/CD roles.',
        consolePath: 'AWS Console > S3 > terraform-state-prod > Bucket policy > Enforce VPC / Role isolation',
        cliCommand: 'aws s3api put-bucket-encryption --bucket terraform-state-prod --server-side-encryption-configuration \'{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"aws:kms","KMSMasterKeyId":"arn:aws:kms:us-east-1:123456789012:key/tf-state-key"}}]}\'',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'SSE-KMS encryption enforced on Terraform state bucket.'
        }, null, 2),
        interviewTip: 'Because Terraform state files contain plaintext database passwords and API keys, the state bucket must be treated with the highest security classification in the company.',
        pitfallWarning: 'Always rotate any secrets (database passwords, API keys) that were stored in the compromised state file.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Simulate Forked GitHub Action Assumption & Confirm AccessDenied',
        jobContext: 'Simulate an OIDC token exchange from an unauthorized repository fork and confirm AWS STS rejects the request.',
        consolePath: 'AWS Console > CloudShell > Test assume-role-with-web-identity',
        cliCommand: 'aws sts assume-role-with-web-identity --role-arn arn:aws:iam::123456789012:role/TerraformDeployerRole --role-session-name TestUnauthorized --web-identity-token "simulated.jwt.with.sub.repo:unauthorized-fork/core-infra"',
        expectedOutput: `An error occurred (AccessDenied) when calling the AssumeRoleWithWebIdentity operation: Not authorized to perform sts:AssumeRoleWithWebIdentity`,
        interviewTip: 'Notice the `AccessDenied` error. This provides verifiable evidence that only the authorized corporate repository can deploy infrastructure.',
        pitfallWarning: 'Review all other IAM OIDC roles across the AWS Organization to confirm no other roles use `repo:*:*` wildcards.'
      }
    ]
  },
  {
    id: 'lab-cognito-jwt-tampering',
    labNumber: 'LAB-16',
    title: 'Cognito User Pool IDOR, Claim Spoofing & OAuth2 Token Signature Verification',
    jobRole: 'Cloud Security Engineer',
    roleKey: 'cloud-sec-eng',
    organization: 'FinTech Consumer Web Portal (B2C & B2B)',
    difficulty: 'Advanced',
    timeEstimate: '30 mins',
    mitreAttack: ['T1078.004 - Cloud Accounts', 'T1550.001 - Application Access Token'],
    ticketId: 'SEC-9781',
    sla: '30 mins (P1 Critical)',
    incidentContext: 'An authenticated free-tier customer user modified their local browser JWT token, injecting `"custom:role": "super-admin"`. Because the backend API Gateway Lambda Authorizer failed to verify the RS256 cryptographic signature, the user gained full administrative control over all customer accounts.',
    architectureContext: 'Amazon Cognito User Pool -> Amazon API Gateway HTTP API -> Lambda Authorizer -> Microservices.',
    investigationSteps: [
      {
        stepId: 's1',
        phase: 'Stage 1: Alert Triage & Scope Verification',
        title: 'Inspect WAF & API Gateway Access Logs for Unauthorized Admin Calls',
        jobContext: 'Analyze CloudWatch Logs for API Gateway `/admin/tenants/list` to inspect the claims of the requesting user.',
        consolePath: 'AWS Console > CloudWatch > Log groups > /aws/apigateway/consumer-api > Search: /admin',
        cliCommand: 'aws logs filter-log-events --log-group-name /aws/apigateway/consumer-api --filter-pattern "admin/tenants" --max-items 3',
        expectedOutput: JSON.stringify({
          events: [
            {
              timestamp: 1727211000000,
              message: 'GET /admin/tenants/list HTTP 200 - User: free-user-091 - Claims: {"custom:role":"super-admin"}'
            }
          ]
        }, null, 2),
        interviewTip: 'Explain the flaw: The user account `free-user-091` was able to access the `/admin/tenants/list` endpoint simply by altering the payload in their local localStorage token.',
        pitfallWarning: 'A JWT consists of Header, Payload, and Signature. Decoding a payload without verifying the cryptographic signature is equivalent to accepting an unverified identity claim!'
      },
      {
        stepId: 's2',
        phase: 'Stage 2: Lambda Authorizer Code Inspection',
        title: 'Identify Missing Signature Verification in Lambda Authorizer',
        jobContext: 'Inspect the Lambda Authorizer Python code to see how JWT tokens are processed.',
        consolePath: 'AWS Console > Lambda > Functions > APIAuthorizerFunction > Code source > authorizer.py',
        cliCommand: 'aws lambda get-function-configuration --function-name APIAuthorizerFunction --query "Environment.Variables"',
        expectedOutput: JSON.stringify({
          VulnerableCodeSnippet: "claims = jwt.decode(token, options={'verify_signature': False})  # CRITICAL FLAW"
        }, null, 2),
        interviewTip: 'Identify the vulnerability immediately: `verify_signature: False`. The developer disabled signature checking during early debugging and accidentally pushed it to production.',
        pitfallWarning: 'Never disable signature verification in JWT libraries. Without signature validation, any user can generate arbitrary claims with any text editor.'
      },
      {
        stepId: 's3',
        phase: 'Stage 3: Cognito User Pool Client Hardening',
        title: 'Revoke Client Write Permissions on Sensitive Custom Attributes',
        jobContext: 'Ensure that the Cognito App Client does NOT have write permissions on `custom:role` or `email_verified`, preventing users from setting their own roles during signup.',
        consolePath: 'AWS Console > Cognito > User pools > ConsumerUserPool > App integration > App client > Attribute read/write permissions',
        cliCommand: 'aws cognito-idp update-user-pool-client --user-pool-id us-east-1_ProdPool123 --client-id 5exampleclientid987 --read-attributes "email" "custom:role" --write-attributes "email"',
        expectedOutput: JSON.stringify({
          UserPoolClient: {
            ClientId: '5exampleclientid987',
            WriteAttributes: ['email'],
            ReadAttributes: ['email', 'custom:role']
          }
        }, null, 2),
        interviewTip: 'Explain Cognito Attribute Permissions: Sensitive claims like `custom:role` must ONLY be writable by backend administrative scripts using IAM credentials, NEVER by the client app.',
        pitfallWarning: 'If `custom:role` is in `WriteAttributes`, any user can pass `{"custom:role": "admin"}` in their initial `SignUp` API call!'
      },
      {
        stepId: 's4',
        phase: 'Stage 4: Cryptographic Authorizer Deployment',
        title: 'Deploy Hardened Lambda Authorizer with RS256 JWKS Signature Verification',
        jobContext: 'Deploy a hardened Lambda Authorizer that fetches the public keys from Cognito JWKS (`https://cognito-idp.us-east-1.amazonaws.com/{userPoolId}/.well-known/jwks.json`) and strictly validates the RS256 signature and expiration (`exp`).',
        consolePath: 'AWS Console > Lambda > Functions > APIAuthorizerFunction > Deploy secure authorizer package',
        cliCommand: 'aws lambda update-function-code --function-name APIAuthorizerFunction --zip-file fileb://secure-jwks-authorizer.zip',
        expectedOutput: JSON.stringify({
          FunctionName: 'APIAuthorizerFunction',
          LastUpdateStatus: 'Successful',
          Runtime: 'python3.12'
        }, null, 2),
        interviewTip: 'Explain JWKS (JSON Web Key Set): The authorizer downloads the public key from Cognito\'s public JWKS endpoint and verifies that the token was signed with Cognito\'s private key. Forged tokens immediately fail verification.',
        pitfallWarning: 'Cache the JWKS keys in memory between Lambda warm executions to avoid making an HTTP call to Cognito on every single API request.'
      },
      {
        stepId: 's5',
        phase: 'Stage 5: Compromised Session Invalidation',
        title: 'Revoke All Active Refresh Tokens for the Offending User',
        jobContext: 'Invalidate all existing refresh tokens for the user in Cognito so they cannot refresh their session.',
        consolePath: 'AWS Console > Cognito > User pools > Users > free-user-091 > Sign out of all sessions',
        cliCommand: 'aws cognito-idp admin-user-global-sign-out --user-pool-id us-east-1_ProdPool123 --username free-user-091',
        expectedOutput: JSON.stringify({
          ResponseMetadata: { HTTPStatusCode: 200 },
          Status: 'Global sign out executed. All refresh and access tokens for free-user-091 revoked.'
        }, null, 2),
        interviewTip: '`admin-user-global-sign-out` immediately increments the user\'s token version in Cognito, rendering all previously issued refresh tokens invalid.',
        pitfallWarning: 'Inform the security incident response team to audit any data modified by `free-user-091` while in the elevated state.'
      },
      {
        stepId: 's6',
        phase: 'Stage 6: Verification & Proof',
        title: 'Test Forged JWT against API Gateway & Confirm 401 Unauthorized',
        jobContext: 'Send an API request with an unsigned, forged JWT containing `"custom:role": "super-admin"` and confirm the authorizer returns HTTP 401 Unauthorized.',
        consolePath: 'AWS Console > CloudShell > Test curl with forged JWT',
        cliCommand: 'curl -i -s -H "Authorization: Bearer eyJhbGciOiJub25lIn0.eyJjdXN0b206cm9sZSI6InN1cGVyLWFkbWluIn0." https://api-12345.execute-api.us-east-1.amazonaws.com/admin/tenants/list',
        expectedOutput: `HTTP/2 401 Unauthorized
date: Thu, 24 Sep 2026 21:20:00 GMT
content-type: application/json
content-length: 26
www-authenticate: Bearer error="invalid_token", error_description="Signature verification failed"

{"message": "Unauthorized"}`,
        interviewTip: 'The API returned `401 Unauthorized` with `Signature verification failed`. The forged token was rejected, and zero backend administrative data was exposed.',
        pitfallWarning: 'Ensure unit tests in your automated CI/CD pipeline include testing invalid and expired JWT tokens to prevent regressions.'
      }
    ]
  }
]

export const realLabs = rawRealLabs.map(lab => ({
  ...lab,
  steps: lab.steps || lab.investigationSteps || [],
  scenarioSummary: lab.scenarioSummary || lab.incidentContext || '',
  estimatedMinutes: lab.estimatedMinutes || (typeof lab.timeEstimate === 'string' ? parseInt(lab.timeEstimate) : lab.timeEstimate) || 30,
  targetServices: lab.targetServices || (lab.targetService ? [lab.targetService] : ['AWS IAM', 'AWS CloudTrail']),
  mitreTechnique: lab.mitreTechnique || (Array.isArray(lab.mitreAttack) ? lab.mitreAttack[0] : lab.mitreAttack) || 'T1078 Valid Accounts'
}))



