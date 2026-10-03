// S3 Data Security Question Bank: 30 High-Yield Cloud Security Questions
// Classified into Beginner, Intermediate, Advanced, and Engineer Level

export const s3QuestionBank = [
  {
    id: 's3-q01',
    difficulty: 'Beginner',
    category: 'Public Access',
    topicId: 'public-access',
    topicTitle: 'Public Access',
    question: 'Which AWS S3 feature overrides all existing bucket policies and ACLs to guarantee that public access is blocked across every bucket in an AWS account?',
    options: [
      'Amazon S3 Transfer Acceleration',
      'S3 Block Public Access (BPA) configured at the Account level',
      'AWS Shield Standard',
      'Amazon CloudFront Distribution'
    ],
    correctAnswer: 'S3 Block Public Access (BPA) configured at the Account level',
    explanation: 'Enabling S3 Block Public Access at the Account level acts as a master guardrail, preventing any user or bucket policy in the account from ever granting public read or write permissions.',
    engineerReasoning: 'Account-level BPA prevents human error and accidental misconfigurations from exposing sensitive data buckets to the internet.',
    businessImpact: 'Unrestricted public buckets are the #1 cause of cloud data breaches and massive regulatory fines (GDPR, HIPAA, CCPA).',
    awsBestPractice: 'Enable all 4 S3 Block Public Access settings at the Account level unless the account is explicitly designated for public website hosting.'
  },
  {
    id: 's3-q02',
    difficulty: 'Intermediate',
    category: 'Encryption In-Transit',
    topicId: 'bucket-policies',
    topicTitle: 'Bucket Policies',
    question: 'How does a Cloud Security Engineer enforce that all requests to an S3 bucket use encrypted HTTPS connections (TLS 1.2+) rather than plaintext HTTP?',
    options: [
      'By checking the "HTTPS Only" box in the EC2 console.',
      'By adding a bucket policy with `Effect: Deny` on all actions where the condition `"aws:SecureTransport": "false"` matches.',
      'By changing the bucket name to start with `https-`.',
      'By attaching an IAM policy with `Effect: Allow` on port 443.'
    ],
    correctAnswer: 'By adding a bucket policy with `Effect: Deny` on all actions where the condition `"aws:SecureTransport": "false"` matches.',
    explanation: 'The `aws:SecureTransport` condition key tests whether the request was transmitted over TLS. An explicit Deny when `"aws:SecureTransport": "false"` guarantees all plaintext HTTP requests are rejected.',
    engineerReasoning: 'Enforcing encryption in transit ensures data packets cannot be intercepted or tampered with by man-in-the-middle network attacks.',
    businessImpact: 'Plaintext data transmission violates PCI-DSS, SOC 2, and HIPAA compliance mandates and exposes sensitive customer data on the wire.',
    awsBestPractice: 'Apply a standardized HTTPS-only Deny policy to all S3 buckets as a core security baseline.'
  },
  {
    id: 's3-q03',
    difficulty: 'Advanced',
    category: 'Ransomware Defense',
    topicId: 'versioning',
    topicTitle: 'Versioning',
    question: 'An adversary compromises administrative credentials and attempts to delete all objects in an S3 backup bucket. Which combination of features prevents the permanent destruction of these files?',
    options: [
      'S3 Transfer Acceleration and Cross-Region Replication.',
      'S3 Versioning combined with MFA Delete and S3 Object Lock in Compliance Mode.',
      'S3 Intelligent-Tiering and CloudWatch Alarms.',
      'Default SSE-S3 encryption and bucket tags.'
    ],
    correctAnswer: 'S3 Versioning combined with MFA Delete and S3 Object Lock in Compliance Mode.',
    explanation: 'S3 Versioning preserves older versions of modified or deleted objects. MFA Delete requires a hardware MFA token for permanent deletions. Object Lock in Compliance Mode prevents ANY user (including Root) from deleting objects until the retention period expires.',
    engineerReasoning: 'Compliance Mode Object Lock provides a true Write Once, Read Many (WORM) guarantee against insider threats, disgruntled employees, and ransomware.',
    businessImpact: 'Irrevocable backup destruction leaves an organization helpless against extortion ransomware and causes total business failure.',
    awsBestPractice: 'Use S3 Object Lock Compliance Mode on immutability-critical backup buckets in a dedicated, isolated AWS security archive account.'
  },
  {
    id: 's3-q04',
    difficulty: 'Intermediate',
    category: 'Encryption at Rest & Key Control',
    topicId: 'encryption',
    topicTitle: 'Encryption',
    question: 'A compliance auditor requires that all sensitive data in S3 is encrypted at rest and that your team has an auditable log of every single read access to the decryption keys, with the ability to revoke access immediately. Which encryption option meets this requirement?',
    options: [
      'Server-Side Encryption with Amazon S3-Managed Keys (SSE-S3).',
      'Server-Side Encryption with AWS KMS Customer Managed Keys (SSE-KMS / CMK).',
      'Client-Side Encryption with plain Base64 encoding.',
      'Unencrypted storage with a bucket password.'
    ],
    correctAnswer: 'Server-Side Encryption with AWS KMS Customer Managed Keys (SSE-KMS / CMK).',
    explanation: 'SSE-KMS with a Customer Managed Key (CMK) provides granular key policies, automatic CloudTrail auditing for every `kms:Decrypt` call, and the capability to disable the key instantly to freeze data access.',
    engineerReasoning: 'SSE-S3 protects data on disk at AWS data centers, but cannot control access per user or provide separate audit logs for key usage like SSE-KMS does.',
    businessImpact: 'Using SSE-S3 without KMS fails strict regulatory compliance audits (FedRAMP, PCI-DSS Level 1) requiring cryptographic access logging.',
    awsBestPractice: 'Use AWS KMS CMKs with key rotation enabled for confidential, financial, or healthcare data buckets.'
  },
  {
    id: 's3-q05',
    difficulty: 'Beginner',
    category: 'Data Governance & Discovery',
    topicId: 'data-protection',
    topicTitle: 'Data Protection',
    question: 'Which AWS service uses machine learning and pattern matching to continuously scan S3 buckets and identify sensitive data such as credit card numbers, social security numbers, and API keys?',
    options: [
      'AWS WAF',
      'Amazon Macie',
      'Amazon Inspector',
      'AWS Secrets Manager'
    ],
    correctAnswer: 'Amazon Macie',
    explanation: 'Amazon Macie is a fully managed data security and privacy service that automatically discovers and protects sensitive data stored in Amazon S3.',
    engineerReasoning: 'Macie allows security teams to find "shadow data" or unmanaged PII that developers may have accidentally placed in non-compliant buckets.',
    businessImpact: 'Undiscovered PII in public or non-compliant buckets leads to multi-million dollar privacy fines and reputational destruction.',
    awsBestPractice: 'Enable Amazon Macie organization-wide with automated alerts to identify unencrypted or publicly shared sensitive data stores.'
  },
  {
    id: 's3-q06',
    difficulty: 'Engineer Level',
    category: 'Cross-Account Access Guardrails',
    topicId: 'bucket-policies',
    topicTitle: 'Bucket Policies',
    question: 'You want to allow all accounts within your AWS Organization (`o-example12345`) to access a shared dataset bucket, while strictly blocking all external AWS accounts. Which condition key should you use in the bucket policy?',
    options: [
      '`aws:PrincipalType: "Account"`',
      '`aws:PrincipalOrgID: "o-example12345"`',
      '`aws:SourceVpc: "vpc-000000"`',
      '`aws:MultiFactorAuthPresent: "false"`'
    ],
    correctAnswer: '`aws:PrincipalOrgID: "o-example12345"`',
    explanation: 'The `aws:PrincipalOrgID` condition key allows you to define policies that restrict resource access exclusively to principals belonging to accounts inside a specific AWS Organization.',
    engineerReasoning: 'Using `aws:PrincipalOrgID` eliminates the need to manually update bucket policies every time a new member account is created in your AWS Organization.',
    businessImpact: 'Hardcoding individual account IDs leads to operational drift and developers opening buckets to `Principal: "*"` when access fails.',
    awsBestPractice: 'Enforce `aws:PrincipalOrgID` on all internal shared services and data lake buckets.'
  },
  {
    id: 's3-q07',
    difficulty: 'Beginner',
    category: 'Cost & Security Optimization',
    topicId: 'lifecycle-policies',
    topicTitle: 'Lifecycle Policies',
    question: 'How do S3 Lifecycle policies support both cost reduction and security data retention requirements?',
    options: [
      'By compressing files and changing their file extensions.',
      'By automatically transitioning older objects to cheaper storage tiers (Glacier) and permanently expiring noncurrent versions after a specified retention period.',
      'By deleting CloudTrail logs after 24 hours.',
      'By blocking users who download more than 10GB of data.'
    ],
    correctAnswer: 'By automatically transitioning older objects to cheaper storage tiers (Glacier) and permanently expiring noncurrent versions after a specified retention period.',
    explanation: 'Lifecycle policies automate the movement of aging data to lower-cost archival tiers like Glacier Flexible Retrieval and guarantee that expired data is permanently deleted in accordance with compliance schedules.',
    engineerReasoning: 'Retaining noncurrent versions indefinitely creates massive AWS storage bills and exposes stale legacy data to potential breach.',
    businessImpact: 'Unmanaged object versions can accumulate millions of dollars in unexpected storage costs and violate privacy "right to be forgotten" regulations.',
    awsBestPractice: 'Define lifecycle rules that transition objects after 90 days and expire noncurrent versions according to your corporate data retention policy.'
  },
  {
    id: 's3-q08',
    difficulty: 'Engineer Level',
    category: 'Cross-Region Backup Strategy',
    topicId: 'backup-strategy',
    topicTitle: 'Backup Strategy',
    question: 'You are designing an anti-ransomware disaster recovery architecture for critical S3 objects. Which architecture provides the strongest protection against total account compromise?',
    options: [
      'Store all backups in a second bucket in the same account with the same administrator credentials.',
      'Configure Cross-Region Replication (CRR) to a destination bucket in a separate, dedicated AWS Security Archive account with Object Lock enabled and separate root credentials.',
      'Download backups to an office laptop external hard drive daily.',
      'Make the primary bucket publicly readable so employees can restore files themselves.'
    ],
    correctAnswer: 'Configure Cross-Region Replication (CRR) to a destination bucket in a separate, dedicated AWS Security Archive account with Object Lock enabled and separate root credentials.',
    explanation: 'Replicating data across regions to an entirely separate AWS account with separate IAM trust boundaries ensures that even if the primary production account is 100% compromised, the backup archive cannot be deleted or altered.',
    engineerReasoning: 'Account boundaries are the strongest blast radius containment mechanism in AWS. Backups stored in the same account can be deleted by any compromised administrator.',
    businessImpact: 'A single account compromise that wipes out both production and backups forces the company into immediate liquidation or paying extortion.',
    awsBestPractice: 'Deploy a centralized Log and Backup Archive account in AWS Organizations with SCPs preventing any member account administrator from touching the destination buckets.'
  },
  {
    id: 's3-q09',
    difficulty: 'Intermediate',
    category: 'Access Control Lists vs Policies',
    topicId: 'bucket-policies',
    topicTitle: 'Bucket Policies',
    question: 'Why does AWS recommend disabling S3 Access Control Lists (ACLs) using "Object Ownership: Bucket Owner Enforced"?',
    options: [
      'Because ACLs slow down network download speeds by 50%.',
      'Because ACLs are a legacy access control mechanism that can allow external cross-account uploaders to retain ownership and grant public access, whereas Bucket Owner Enforced simplifies security entirely through modern IAM and bucket policies.',
      'Because ACLs require payment for every object permission checked.',
      'Because ACLs cannot be used with JSON files.'
    ],
    correctAnswer: 'Because ACLs are a legacy access control mechanism that can allow external cross-account uploaders to retain ownership and grant public access, whereas Bucket Owner Enforced simplifies security entirely through modern IAM and bucket policies.',
    explanation: 'Historically, if Account B uploaded an object into Account A’s bucket, Account B owned the object and could make it public. "Bucket Owner Enforced" disables ACLs completely, ensuring the bucket owner owns and controls every object via bucket policies.',
    engineerReasoning: 'Managing permissions through both ACLs and Bucket Policies creates hidden exposures and conflicting access paths.',
    businessImpact: 'Misconfigured object ACLs have caused major public leaks where individual objects remained public despite restrictive bucket-level policies.',
    awsBestPractice: 'Enable S3 Object Ownership: Bucket Owner Enforced on all existing and new S3 buckets.'
  },
  {
    id: 's3-q10',
    difficulty: 'Beginner',
    category: 'Public Access',
    topicId: 'public-access',
    topicTitle: 'Public Access',
    question: 'A developer creates an S3 bucket and unchecks "Block all public access" to host images for an internal wiki. However, the bucket URL returns `403 Forbidden` to external users on the internet. Why is the bucket not yet publicly leaking files?',
    options: [
      'Because S3 buckets require a paid subscription to be accessed over the internet.',
      'Because disabling Block Public Access only allows public policies to be applied; by default, buckets have NO public policy and default to explicit deny for unauthenticated principals.',
      'Because AWS scans all uploaded images for security clearance first.',
      'Because the developer’s AWS account is less than 30 days old.'
    ],
    correctAnswer: 'Because disabling Block Public Access only allows public policies to be applied; by default, buckets have NO public policy and default to explicit deny for unauthenticated principals.',
    explanation: 'Disabling Block Public Access removes the preventative guardrail, but does not grant permissions on its own. A bucket policy or ACL granting `Principal: "*"` is still required for external users to read data.',
    engineerReasoning: 'It is a common beginner misconception that unchecking BPA automatically makes the bucket public. However, leaving BPA disabled leaves the door unlocked for any future policy change to expose the bucket.',
    businessImpact: 'An unshielded bucket is one misconfigured Terraform commit away from an instant public data breach.',
    awsBestPractice: 'Keep Block Public Access turned ON at all times unless there is an approved architectural exception.'
  },
  {
    id: 's3-q11',
    difficulty: 'Advanced',
    category: 'Object Lock Modes',
    topicId: 'data-protection',
    topicTitle: 'Data Protection',
    question: 'What is the critical difference between S3 Object Lock in "Governance Mode" versus "Compliance Mode"?',
    options: [
      'Governance Mode is free, whereas Compliance Mode costs $100/month.',
      'In Governance Mode, users with the `s3:BypassGovernanceRetention` permission can delete objects before the retention period expires; in Compliance Mode, NO user (including the AWS Account Root User) can delete objects until retention has expired.',
      'Governance Mode encrypts data, while Compliance Mode does not.',
      'Compliance Mode is only available in the US East (N. Virginia) region.'
    ],
    correctAnswer: 'In Governance Mode, users with the `s3:BypassGovernanceRetention` permission can delete objects before the retention period expires; in Compliance Mode, NO user (including the AWS Account Root User) can delete objects until retention has expired.',
    explanation: 'Compliance Mode enforces strict WORM immutability where no principal, not even the root user, can overwrite or delete the object during retention. Governance mode allows authorized admins to alter retention or delete data if necessary.',
    engineerReasoning: 'Choose Compliance Mode for regulatory requirements (SEC Rule 17a-4) and ransomware protection; choose Governance Mode for testing retention policies.',
    businessImpact: 'Using Governance Mode for regulatory archives can fail compliance examinations if administrators have bypass permissions.',
    awsBestPractice: 'Carefully calculate retention durations before enabling Compliance Mode, as AWS Support cannot delete objects under compliance retention under any circumstances.'
  },
  {
    id: 's3-q12',
    difficulty: 'Engineer Level',
    category: 'VPC Endpoint Perimeter',
    topicId: 'bucket-policies',
    topicTitle: 'Bucket Policies',
    question: 'Your company security policy dictates that production database backups in S3 must NEVER be accessible from the public internet, even by authorized employees with valid credentials. Which policy control enforces this?',
    options: [
      'Enable AWS WAF on the S3 bucket.',
      'Attach a bucket policy that denies all access unless the request originates from your VPC Endpoint (`Condition: { "StringNotEquals": { "aws:sourceVpce": "vpce-12345678" } }`).',
      'Rename the bucket to include `.internal`.',
      'Change the IAM password every 2 hours.'
    ],
    correctAnswer: 'Attach a bucket policy that denies all access unless the request originates from your VPC Endpoint (`Condition: { "StringNotEquals": { "aws:sourceVpce": "vpce-12345678" } }`).',
    explanation: 'Restricting access via the `aws:sourceVpce` condition ensures that traffic must traverse your private AWS network through a designated VPC Endpoint, preventing requests from public IP addresses regardless of credential validity.',
    engineerReasoning: 'Network boundary enforcement prevents stolen IAM credentials from being used from an attacker’s external machine.',
    businessImpact: 'If credentials are stolen, the attacker is completely neutralized because they cannot reach the data without possessing access to your private VPC.',
    awsBestPractice: 'Combine identity policies with network-restricted resource policies (VPC Endpoints) for high-sensitivity data stores.'
  },
  {
    id: 's3-q13',
    difficulty: 'Beginner',
    category: 'Default Encryption',
    topicId: 'encryption',
    topicTitle: 'Encryption',
    question: 'As of 2023, what is the default encryption behavior for all new objects uploaded to any Amazon S3 bucket?',
    options: [
      'All objects are unencrypted by default unless a plugin is installed.',
      'All new objects are automatically encrypted at rest using Server-Side Encryption with Amazon S3 managed keys (SSE-S3) at no additional charge.',
      'All objects require client-side PGP certificates.',
      'Objects are encrypted only if they are larger than 5 GB.'
    ],
    correctAnswer: 'All new objects are automatically encrypted at rest using Server-Side Encryption with Amazon S3 managed keys (SSE-S3) at no additional charge.',
    explanation: 'AWS now applies 256-bit AES encryption (SSE-S3) by default to all new objects uploaded to S3 buckets automatically, ensuring no object is stored in plaintext.',
    engineerReasoning: 'Default SSE-S3 establishes an encryption baseline on disk, though enterprise compliance standards often require upgrading to Customer Managed Keys (SSE-KMS).',
    businessImpact: 'Protects against data theft from physical media decommissioned inside AWS data centers.',
    awsBestPractice: 'Enforce SSE-KMS via bucket settings for compliance with regulatory frameworks requiring customer-controlled key lifecycles.'
  },
  {
    id: 's3-q14',
    difficulty: 'Intermediate',
    category: 'Pre-Signed URLs',
    topicId: 'data-protection',
    topicTitle: 'Data Protection',
    question: 'A web app generates S3 Pre-Signed URLs to allow authenticated users to download their monthly invoices. What is the primary security risk if pre-signed URLs are misconfigured?',
    options: [
      'Pre-signed URLs permanently convert the bucket into a public website.',
      'If the expiration time is set too long (e.g. 7 days), anyone who intercepts or is forwarded the link can download the file without authenticating, using the permissions of the generating identity.',
      'Pre-signed URLs consume 100% of the EC2 instance CPU.',
      'Pre-signed URLs delete the original object after being clicked once.'
    ],
    correctAnswer: 'If the expiration time is set too long (e.g. 7 days), anyone who intercepts or is forwarded the link can download the file without authenticating, using the permissions of the generating identity.',
    explanation: 'A pre-signed URL embeds authentication tokens in the query parameters. Anyone with the URL can access the object until it expires, inheriting the exact permissions of the IAM user or role that generated it.',
    engineerReasoning: 'Keep pre-signed URL lifespans as short as possible (e.g. 5 to 15 minutes) and ensure the generating role has strictly scoped read-only permissions.',
    businessImpact: 'Long-lived pre-signed URLs shared in email or logs allow unauthorized third parties to download confidential customer financial records.',
    awsBestPractice: 'Set pre-signed URL TTLs to the minimum viable window (15 minutes) and generate them from dedicated, least-privileged service roles.'
  },
  {
    id: 's3-q15',
    difficulty: 'Advanced',
    category: 'Bucket Policy vs IAM Policy',
    topicId: 'bucket-policies',
    topicTitle: 'Bucket Policies',
    question: 'When a principal from Account A attempts to read an S3 bucket in Account B, what policy permissions are required for the request to succeed?',
    options: [
      'Only the Identity Policy in Account A needs to allow it.',
      'Only the Bucket Policy in Account B needs to allow it.',
      'BOTH the Identity Policy in Account A MUST allow it AND the Bucket Policy in Account B MUST explicitly grant access to Account A.',
      'Neither; cross-account access is automatically open in the same AWS region.'
    ],
    correctAnswer: 'BOTH the Identity Policy in Account A MUST allow it AND the Bucket Policy in Account B MUST explicitly grant access to Account A.',
    explanation: 'In cross-account scenarios, permission must be granted on BOTH sides: Account A must delegate authority to the user, and Account B must grant trust to Account A in the resource policy.',
    engineerReasoning: 'Cross-account authorization requires dual-handshake consent: the caller’s account must authorize the outbound call, and the resource’s account must authorize the inbound caller.',
    businessImpact: 'Failing to configure both policies results in perplexing `403 Access Denied` errors that stall cross-account migrations.',
    awsBestPractice: 'Document cross-account trust boundaries and use IAM Access Analyzer to confirm cross-account shares.'
  },
  {
    id: 's3-q16',
    difficulty: 'Engineer Level',
    category: 'KMS Key Policy Delegation',
    topicId: 'encryption',
    topicTitle: 'Encryption',
    question: 'An S3 bucket is encrypted with an SSE-KMS Customer Managed Key. An IAM User has `s3:GetObject` allowed in their identity policy and the bucket policy allows them. However, when downloading an object, they receive `Access Denied`. What is the root cause?',
    options: [
      'The S3 bucket name is too long.',
      'The KMS Key Policy does not grant the user (or their account) permission to invoke `kms:Decrypt` on the CMK.',
      'The user is using an outdated web browser.',
      'S3 does not support downloading KMS-encrypted objects.'
    ],
    correctAnswer: 'The KMS Key Policy does not grant the user (or their account) permission to invoke `kms:Decrypt` on the CMK.',
    explanation: 'When reading an object encrypted with SSE-KMS, the caller must possess BOTH `s3:GetObject` permission on S3 AND `kms:Decrypt` permission on the KMS key policy.',
    engineerReasoning: 'SSE-KMS provides dual-layer authorization. Even with full S3 permissions, access is blocked at the cryptographic layer if KMS access is withheld.',
    businessImpact: 'Understanding dual-layer KMS authorization is critical when troubleshooting data access in secure multi-account data lakes.',
    awsBestPractice: 'Ensure the KMS key policy delegates access to the account root (`kms:*` to `arn:aws:iam::ACCOUNT:root`) so IAM policies can manage `kms:Decrypt` permissions.'
  },
  {
    id: 's3-q17',
    difficulty: 'Beginner',
    category: 'S3 Versioning Mechanics',
    topicId: 'versioning',
    topicTitle: 'Versioning',
    question: 'When a user executes a standard `DELETE` request on an object in a versioned S3 bucket without specifying a Version ID, what actually occurs?',
    options: [
      'The object and all historical versions are permanently erased from disk.',
      'S3 inserts a "Delete Marker" as the current version; the original object remains intact and recoverable in the version history.',
      'The bucket is paused for 30 days.',
      'AWS Support receives an emergency ticket.'
    ],
    correctAnswer: 'S3 inserts a "Delete Marker" as the current version; the original object remains intact and recoverable in the version history.',
    explanation: 'In versioned buckets, simple deletes place a 0-byte Delete Marker on top. The object disappears from standard listings, but can be restored immediately by deleting the Delete Marker.',
    engineerReasoning: 'Version markers protect against accidental deletion or rogue user actions.',
    businessImpact: 'Ensures business continuity: accidental mass file deletions can be reversed within minutes using version restoration scripts.',
    awsBestPractice: 'Enable S3 Versioning on all buckets containing business-critical or compliance records.'
  },
  {
    id: 's3-q18',
    difficulty: 'Intermediate',
    category: 'S3 Access Points',
    topicId: 'public-access',
    topicTitle: 'Public Access',
    question: 'What is the architectural purpose of Amazon S3 Access Points?',
    options: [
      'To provide free Wi-Fi in AWS data centers.',
      'To simplify data access management for shared datasets by creating unique hostnames with dedicated, distinct access policies tailored to specific applications or teams.',
      'To convert S3 objects into MP4 video streams.',
      'To replace EC2 virtual machines.'
    ],
    correctAnswer: 'To simplify data access management for shared datasets by creating unique hostnames with dedicated, distinct access policies tailored to specific applications or teams.',
    explanation: 'S3 Access Points allow a single large bucket (e.g. a data lake) to have dozens of individual access endpoints, each with its own network restriction (VPC-only) and granular policy, avoiding a single massive 20KB bucket policy.',
    engineerReasoning: 'Access Points decompose monolithic bucket policies into manageable micro-policies owned by individual tenant teams.',
    businessImpact: 'Prevents policy bloat and accidental overrides in multi-tenant corporate data lakes.',
    awsBestPractice: 'Deploy VPC-restricted S3 Access Points for internal analytics applications accessing centralized data stores.'
  },
  {
    id: 's3-q19',
    difficulty: 'Advanced',
    category: 'CORS Security',
    topicId: 'bucket-policies',
    topicTitle: 'Bucket Policies',
    question: 'An S3 bucket hosts web assets. A junior engineer configures Cross-Origin Resource Sharing (CORS) with `AllowedOrigins: ["*"]` and `AllowedHeaders: ["*"]`. What security risk does this introduce?',
    options: [
      'It increases S3 storage pricing by 200%.',
      'Any malicious website visited by an authenticated user can make cross-origin JavaScript requests to read sensitive data from the S3 bucket via the user’s browser session.',
      'It disables bucket versioning.',
      'It causes S3 uploads to timeout.'
    ],
    correctAnswer: 'Any malicious website visited by an authenticated user can make cross-origin JavaScript requests to read sensitive data from the S3 bucket via the user’s browser session.',
    explanation: 'Setting `AllowedOrigins: "*"` instructs browsers to allow any external domain to make AJAX requests to your bucket, bypassing Same-Origin Policy protections.',
    engineerReasoning: 'CORS rules should only allow explicitly trusted domains (e.g. `https://app.company.com`) rather than global wildcards.',
    businessImpact: 'Permits cross-site data theft and unauthorized API scraping of proprietary media and customer documents.',
    awsBestPractice: 'Restrict CORS allowed origins strictly to your production domain and use CloudFront for caching.'
  },
  {
    id: 's3-q20',
    difficulty: 'Engineer Level',
    category: 'Cross-Region Replication Security',
    topicId: 'backup-strategy',
    topicTitle: 'Backup Strategy',
    question: 'When configuring S3 Cross-Region Replication (CRR) for disaster recovery of KMS-encrypted objects, what additional step is mandatory for replication to function?',
    options: [
      'Convert all files to plaintext before replicating.',
      'Provide an IAM service role with permission to decrypt objects with the source KMS key AND re-encrypt objects with the destination KMS key in the target region.',
      'Use the same KMS Key ID in both regions (KMS keys are global).',
      'Disable versioning on the destination bucket.'
    ],
    correctAnswer: 'Provide an IAM service role with permission to decrypt objects with the source KMS key AND re-encrypt objects with the destination KMS key in the target region.',
    explanation: 'KMS keys are strictly regional. Replicating KMS-encrypted objects requires S3 replication to decrypt using the source region key and re-encrypt with the destination region key, requiring explicit KMS permissions in the replication role.',
    engineerReasoning: 'Understanding that KMS keys do not cross regional boundaries by default is critical when designing multi-region architectures.',
    businessImpact: 'Failing to configure KMS replication permissions causes silent replication failure, leaving the disaster recovery site completely empty.',
    awsBestPractice: 'Monitor S3 replication metrics in CloudWatch (`S3:ReplicationLatency`, `S3:OperationsFailedReplication`).'
  },
  {
    id: 's3-q21',
    difficulty: 'Beginner',
    category: 'Server Access Logging',
    topicId: 'data-protection',
    topicTitle: 'Data Protection',
    question: 'What is the purpose of S3 Server Access Logging, and where should log files be stored?',
    options: [
      'It records detailed records of every request made against a bucket; logs should be stored in a separate, dedicated log bucket to prevent recursive logging loops.',
      'It stores passwords in cleartext on the root drive.',
      'It logs employee keystrokes on office laptops.',
      'It automatically converts PDF files to Word documents.'
    ],
    correctAnswer: 'It records detailed records of every request made against a bucket; logs should be stored in a separate, dedicated log bucket to prevent recursive logging loops.',
    explanation: 'S3 Server Access Logging captures granular access details (requester, bucket name, request time, action, response status, error code). Never configure a bucket to deliver access logs to itself.',
    engineerReasoning: 'Server access logs provide audit visibility independent of CloudTrail, capturing unauthenticated requests and 403 scan attempts.',
    businessImpact: 'Provides forensic records for security incidents and compliance audits (HIPAA, PCI-DSS).',
    awsBestPractice: 'Stream S3 server access logs to a centralized, encrypted logging bucket with lifecycle expiration rules.'
  },
  {
    id: 's3-q22',
    difficulty: 'Intermediate',
    category: 'MFA Delete Architecture',
    topicId: 'versioning',
    topicTitle: 'Versioning',
    question: 'Can S3 MFA Delete be enabled through the standard AWS Management Console UI?',
    options: [
      'Yes, by clicking "Enable MFA Delete" under bucket properties.',
      'No; enabling MFA Delete requires using the AWS CLI or SDK authenticated with the AWS Account Root User credentials and an active MFA serial/token.',
      'Yes, if the bucket is public.',
      'No, because MFA Delete is a deprecated feature.'
    ],
    correctAnswer: 'No; enabling MFA Delete requires using the AWS CLI or SDK authenticated with the AWS Account Root User credentials and an active MFA serial/token.',
    explanation: 'To prevent accidental or malicious console toggling, AWS intentionally requires the AWS CLI/SDK with root credentials and an active MFA code (`--mfa "arn:aws:iam::root-mfa-serial 123456"`) to configure MFA Delete.',
    engineerReasoning: 'Requiring root CLI authentication ensures that a compromised IAM administrator cannot enable or disable MFA Delete without physical root token access.',
    businessImpact: 'Provides the ultimate defense against compromised administrator credentials permanently purging compliance archives.',
    awsBestPractice: 'Configure MFA Delete on regulatory and financial compliance buckets via the AWS CLI using root credentials.'
  },
  {
    id: 's3-q23',
    difficulty: 'Advanced',
    category: 'Multi-Part Upload Hygiene',
    topicId: 'lifecycle-policies',
    topicTitle: 'Lifecycle Policies',
    question: 'An application regularly uploads large 50GB files to S3 via Multipart Uploads. If an upload fails midway, what happens to the uploaded parts, and how should security/cost be managed?',
    options: [
      'AWS deletes incomplete parts automatically after 10 seconds.',
      'Incomplete parts remain stored in the bucket indefinitely, consuming storage space and incurring costs until an S3 Lifecycle rule aborts incomplete multipart uploads.',
      'The entire bucket is locked until the upload resumes.',
      'The partial files are uploaded to GitHub.'
    ],
    correctAnswer: 'Incomplete parts remain stored in the bucket indefinitely, consuming storage space and incurring costs until an S3 Lifecycle rule aborts incomplete multipart uploads.',
    explanation: 'Incomplete multipart upload parts are not visible as normal objects, but they persist on disk and accumulate storage charges forever unless an S3 Lifecycle rule with "Abort incomplete multipart uploads" is configured.',
    engineerReasoning: 'Incomplete multipart uploads can quietly generate thousands of dollars in ghost storage fees on large data buckets.',
    businessImpact: 'Unnecessary storage spending and untracked partial data fragments lingering in compliance buckets.',
    awsBestPractice: 'Always configure a lifecycle rule to abort incomplete multipart uploads after 7 days.'
  },
  {
    id: 's3-q24',
    difficulty: 'Engineer Level',
    category: 'Dual-Layer Encryption (DSSE-KMS)',
    topicId: 'encryption',
    topicTitle: 'Encryption',
    question: 'What is Dual-Layer Server-Side Encryption with AWS KMS (DSSE-KMS), and when should an enterprise mandate its use?',
    options: [
      'It encrypts data twice using two different root passwords.',
      'It applies two independent layers of AES-256 encryption at the hardware and software layers using two distinct KMS keys, specifically designed to satisfy strict National Security Systems (CNSA 2.0) regulatory mandates.',
      'It compresses data by 50% and sends a copy to Google Cloud.',
      'It is a legacy encryption method for Windows XP.'
    ],
    correctAnswer: 'It applies two independent layers of AES-256 encryption at the hardware and software layers using two distinct KMS keys, specifically designed to satisfy strict National Security Systems (CNSA 2.0) regulatory mandates.',
    explanation: 'DSSE-KMS provides dual-layer encryption with independent keys to protect high-security workloads against potential future mathematical compromises of single cryptographic layers.',
    engineerReasoning: 'DSSE-KMS is selected when compliance frameworks (DoD, top-secret government workloads) specifically demand quantum-resistant or dual-layer encryption.',
    businessImpact: 'Enables government contractors and defense organizations to meet CNSA 2.0 compliance without maintaining on-premises hardware security modules.',
    awsBestPractice: 'Use DSSE-KMS for defense and national security workloads requiring defense-in-depth cryptography.'
  },
  {
    id: 's3-q25',
    difficulty: 'Beginner',
    category: 'Bucket Naming Hygiene',
    topicId: 'public-access',
    topicTitle: 'Public Access',
    question: 'Why must S3 bucket names be globally unique across all AWS accounts worldwide?',
    options: [
      'Because AWS only has one physical hard drive.',
      'Because every S3 bucket is assigned a globally addressable DNS domain name (e.g. `bucket-name.s3.amazonaws.com`).',
      'Because bucket names are stored in a public blockchain.',
      'Because AWS charges per character in the bucket name.'
    ],
    correctAnswer: 'Because every S3 bucket is assigned a globally addressable DNS domain name (e.g. `bucket-name.s3.amazonaws.com`).',
    explanation: 'S3 buckets are web-addressable endpoints reachable via standard DNS resolution, necessitating universal uniqueness across all regions and accounts.',
    engineerReasoning: 'Adversaries scan predictable bucket names (e.g. `company-prod-backups`, `company-secret-data`). Naming hygiene and account-level BPA are the first line of defense.',
    businessImpact: 'Predictable bucket names combined with missing Block Public Access are routinely targeted by automated threat intelligence scrapers.',
    awsBestPractice: 'Avoid putting sensitive company identifiers or project codenames in bucket names, and always enforce BPA.'
  },
  {
    id: 's3-q26',
    difficulty: 'Intermediate',
    category: 'Inventory & Auditing',
    topicId: 'data-protection',
    topicTitle: 'Data Protection',
    question: 'How can a security team audit billions of objects in an enterprise data lake for encryption status and replication status without invoking expensive `ListObjectsV2` API calls?',
    options: [
      'Manually click through the AWS console folder by folder.',
      'Enable Amazon S3 Inventory to generate scheduled daily or weekly CSV/ORC/Parquet audit reports delivered to a secure reporting bucket.',
      'Write a bash script that downloads every file to an EC2 instance.',
      'Delete the bucket and recreate it.'
    ],
    correctAnswer: 'Enable Amazon S3 Inventory to generate scheduled daily or weekly CSV/ORC/Parquet audit reports delivered to a secure reporting bucket.',
    explanation: 'S3 Inventory provides an automated, scheduled alternative to the S3 `List` API, outputting a complete metadata catalog (size, encryption status, version ID, replication status, object lock) at a fraction of the cost.',
    engineerReasoning: 'Running millions of `ListObjects` API calls costs money and throttles application performance. S3 Inventory provides offline flat-file auditing.',
    businessImpact: 'Saves thousands of dollars in API charges while giving compliance teams mathematical proof of 100% encryption compliance.',
    awsBestPractice: 'Configure S3 Inventory reports in Apache Parquet format and query them with Amazon Athena.'
  },
  {
    id: 's3-q27',
    difficulty: 'Advanced',
    category: 'Bucket Policy Principal Star Risks',
    topicId: 'bucket-policies',
    topicTitle: 'Bucket Policies',
    question: 'A bucket policy statement contains `Principal: "*", Action: "s3:GetObject", Resource: "arn:aws:s3:::mybucket/*"` with NO condition block. What is the impact of this policy if Block Public Access is disabled?',
    options: [
      'Only IAM users in the owner’s account can read objects.',
      'ANY anonymous user on the public internet can read and download every object in the bucket without authentication.',
      'Objects can only be read during business hours.',
      'AWS will send an invoice to the users who download data.'
    ],
    correctAnswer: 'ANY anonymous user on the public internet can read and download every object in the bucket without authentication.',
    explanation: '`Principal: "*"` with no condition grants wildcard anonymous read access to anyone on the internet who knows the bucket URL.',
    engineerReasoning: 'This is the exact configuration error behind the vast majority of historical S3 data leaks.',
    businessImpact: 'Unrestricted public breach, theft of intellectual property, regulatory investigation, and reputational destruction.',
    awsBestPractice: 'Never deploy `Principal: "*"` without explicit condition keys (`aws:PrincipalOrgID`, `aws:sourceVpce`, `aws:SourceIp`).'
  },
  {
    id: 's3-q28',
    difficulty: 'Engineer Level',
    category: 'Legal Hold vs Retention Period',
    topicId: 'data-protection',
    topicTitle: 'Data Protection',
    question: 'In S3 Object Lock, what is the functional difference between an object’s "Retention Period" and a "Legal Hold"?',
    options: [
      'Retention Periods cost money; Legal Holds are free.',
      'A Retention Period specifies a fixed expiration date (e.g. 7 years); a Legal Hold has NO expiration date and remains in effect until an authorized user explicitly removes it.',
      'Legal Holds can only be placed by AWS Support.',
      'Retention Periods only apply to text files.'
    ],
    correctAnswer: 'A Retention Period specifies a fixed expiration date (e.g. 7 years); a Legal Hold has NO expiration date and remains in effect until an authorized user explicitly removes it.',
    explanation: 'Legal holds provide flexible preservation during ongoing litigation or regulatory inquiries, freezing objects indefinitely independent of standard retention schedules.',
    engineerReasoning: 'Legal holds can be placed on an object even if its retention period has already expired or hasn’t been configured.',
    businessImpact: 'Failing to preserve data under legal hold during corporate litigation results in severe court sanctions and spoliation of evidence penalties.',
    awsBestPractice: 'Use S3 Legal Holds to preserve forensic evidence and litigation documents until corporate legal counsel grants approval.'
  },
  {
    id: 's3-q29',
    difficulty: 'Intermediate',
    category: 'CloudTrail S3 Data Events',
    topicId: 'data-protection',
    topicTitle: 'Data Protection',
    question: 'Why are CloudTrail S3 Data Events (such as `GetObject` and `PutObject`) not enabled by default in standard AWS CloudTrail trails?',
    options: [
      'Because AWS CloudTrail does not support S3.',
      'Because high-volume data-plane operations generate enormous quantities of log events, resulting in significant CloudTrail ingestion and S3 storage costs if enabled across all buckets.',
      'Because S3 data events are encrypted and cannot be logged.',
      'Because data events slow down S3 upload speeds.'
    ],
    correctAnswer: 'Because high-volume data-plane operations generate enormous quantities of log events, resulting in significant CloudTrail ingestion and S3 storage costs if enabled across all buckets.',
    explanation: 'A busy bucket can experience billions of reads and writes per day. Logging every call produces massive log volume. AWS allows you to selectively configure Data Events on high-sensitivity buckets.',
    engineerReasoning: 'Enable Data Events selectively on buckets containing sensitive PII, trade secrets, or compliance archives.',
    businessImpact: 'Enabling S3 data events globally across large media caching buckets can generate tens of thousands of dollars in unexpected CloudTrail bills.',
    awsBestPractice: 'Enable S3 Data Events strictly on designated critical data stores and configure CloudTrail advanced event selectors.'
  },
  {
    id: 's3-q30',
    difficulty: 'Engineer Level',
    category: 'Cross-Account Ownership Takeover',
    topicId: 'bucket-policies',
    topicTitle: 'Bucket Policies',
    question: 'In legacy S3 configurations without "Bucket Owner Enforced", an external vendor in Account B uploaded a file into your bucket in Account A. You discover you cannot read or manage the file. Why did this occur, and how is it permanently solved?',
    options: [
      'The file corrupted during upload; ask the vendor to re-upload.',
      'The object was owned by Account B (the uploader) via ACLs, not Account A. Solution: Enable S3 Object Ownership: Bucket Owner Enforced, which automatically disables ACLs and transfers 100% ownership of all objects to the bucket owner.',
      'The file is encrypted with a secret password.',
      'Account A’s AWS account must be deleted.'
    ],
    correctAnswer: 'The object was owned by Account B (the uploader) via ACLs, not Account A. Solution: Enable S3 Object Ownership: Bucket Owner Enforced, which automatically disables ACLs and transfers 100% ownership of all objects to the bucket owner.',
    explanation: 'Legacy S3 access control assigned ownership to the uploading identity. "Bucket Owner Enforced" strips ACLs and gives the bucket owner full, unilateral ownership and policy control over all objects.',
    engineerReasoning: 'Enforcing Bucket Owner Enforced resolves the classic S3 ownership dilemma and eliminates vendor access backdoors.',
    businessImpact: 'Prevents vendor disputes and guarantees that all data stored in corporate buckets is owned and governed by the enterprise.',
    awsBestPractice: 'Enforce `ObjectOwnership: BucketOwnerEnforced` across all corporate AWS accounts via AWS Config remediation.'
  }
]
