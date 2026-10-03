// Security Architecture Question Bank: 30 High-Yield Cloud Security Questions
// Classified into Beginner, Intermediate, Advanced, and Engineer Level

export const architectureQuestionBank = [
  {
    id: 'arch-q01',
    difficulty: 'Beginner',
    category: 'Shared Responsibility',
    topicId: 'shared-responsibility-model',
    topicTitle: 'Shared Responsibility Model',
    question: 'Under the AWS Shared Responsibility Model, which security task is the sole responsibility of the customer when running an Amazon EC2 instance?',
    options: [
      'Applying physical locks to the data center server racks.',
      'Patching the guest operating system, configuring local firewalls, and managing application software vulnerabilities.',
      'Decommissioning and physically destroying damaged hardware storage drives.',
      'Maintaining the virtualization hypervisor software.'
    ],
    correctAnswer: 'Patching the guest operating system, configuring local firewalls, and managing application software vulnerabilities.',
    explanation: 'AWS manages security "OF" the cloud (hardware, physical data centers, hypervisor). For IaaS services like EC2, the customer is strictly responsible for security "IN" the cloud, including the OS, application patches, security groups, and IAM permissions.',
    engineerReasoning: 'A common misconception is assuming AWS handles operating system patching. Unpatched EC2 instances remain vulnerable to known CVEs regardless of AWS infrastructure security.',
    businessImpact: 'Failure to patch guest OS software leads to remote code execution, ransomware, and regulatory fines for negligence.',
    awsBestPractice: 'Use AWS Systems Manager Patch Manager to automate regular security patching across all EC2 instances.'
  },
  {
    id: 'arch-q02',
    difficulty: 'Beginner',
    category: 'Defense in Depth',
    topicId: 'defense-in-depth-zero-trust',
    topicTitle: 'Defense-in-Depth & Zero Trust',
    question: 'What is the core philosophy of the "Defense-in-Depth" security architecture principle?',
    options: [
      'Relying exclusively on a single ultra-secure perimeter firewall so internal systems need no security.',
      'Implementing multiple layered security controls across data, compute, network, identity, and monitoring so that if one layer fails, subsequent layers prevent breach.',
      'Buying cybersecurity insurance instead of configuring technical controls.',
      'Storing all sensitive database passwords in a public code repository.'
    ],
    correctAnswer: 'Implementing multiple layered security controls across data, compute, network, identity, and monitoring so that if one layer fails, subsequent layers prevent breach.',
    explanation: 'Defense-in-depth ensures no single point of security failure exists. For example, if a web application vulnerability is exploited, network isolation, IAM least privilege, S3 bucket encryption, and GuardDuty detection prevent complete data exfiltration.',
    engineerReasoning: 'Perimeter firewalls will inevitably be bypassed. Layered defenses contain the adversary and limit blast radius.',
    businessImpact: 'Prevents catastrophic single-point failures from resulting in enterprise-wide data theft or ransomware shutdown.',
    awsBestPractice: 'Combine WAF at the edge, Security Groups at the network layer, IAM role policies at the identity layer, and KMS encryption at the data layer.'
  },
  {
    id: 'arch-q03',
    difficulty: 'Beginner',
    category: 'Landing Zone Multi-Account',
    topicId: 'multi-account-landing-zone',
    topicTitle: 'Multi-Account Landing Zones',
    question: 'Why does AWS strongly recommend a multi-account strategy over running all corporate workloads inside a single AWS account with multiple VPCs?',
    options: [
      'Because AWS accounts are physically located in different countries.',
      'An AWS account provides the strongest isolation boundary in AWS; isolating environments (Dev, Staging, Prod) into separate accounts prevents cross-environment blast radius and limits security blast radius.',
      'Single accounts are limited to only 5 EC2 instances total.',
      'Multi-account setups eliminate the need for IAM users or passwords.'
    ],
    correctAnswer: 'An AWS account provides the strongest isolation boundary in AWS; isolating environments (Dev, Staging, Prod) into separate accounts prevents cross-environment blast radius and limits security blast radius.',
    explanation: 'The AWS account is the ultimate boundary for identity, quotas, billing, and blast radius. A compromised identity in a development account cannot affect production when separated by account boundaries and Organizations SCPs.',
    engineerReasoning: 'VPC peering or loose IAM in a single account can easily lead to lateral privilege escalation. Account boundaries provide mathematical segregation.',
    businessImpact: 'Prevents a security breach in a low-security testing environment from exposing production customer data or taking down revenue systems.',
    awsBestPractice: 'Deploy AWS Control Tower to set up a Well-Architected multi-account landing zone with automated organizational guardrails.'
  },
  {
    id: 'arch-q04',
    difficulty: 'Beginner',
    category: 'Well-Architected Framework',
    topicId: 'well-architected-security',
    topicTitle: 'Well-Architected Security Pillar',
    question: 'Which of the following is one of the seven foundational design principles for security in the cloud according to the AWS Well-Architected Framework?',
    options: [
      'Grant all developers administrator access to accelerate feature velocity.',
      'Apply security at all layers, implement a strong identity foundation, and automate security best practices.',
      'Disable audit logging to reduce AWS bill costs.',
      'Store production database credentials in unencrypted configuration files.'
    ],
    correctAnswer: 'Apply security at all layers, implement a strong identity foundation, and automate security best practices.',
    explanation: 'The AWS Well-Architected Security Pillar defines 7 principles: 1) Implement a strong identity foundation, 2) Enable traceability, 3) Apply security at all layers, 4) Automate security best practices, 5) Protect data in transit and at rest, 6) Keep people away from data, and 7) Prepare for security events.',
    engineerReasoning: 'Aligning architectural decisions with Well-Architected principles ensures standardized, defensible security posture across teams.',
    businessImpact: 'Reduces architectural technical debt, passes regulatory audits, and minimizes probability of security incidents.',
    awsBestPractice: 'Conduct formal AWS Well-Architected Tool reviews before launching any workload into production.'
  },
  {
    id: 'arch-q05',
    difficulty: 'Beginner',
    category: 'Immutable Infrastructure',
    topicId: 'immutable-infrastructure',
    topicTitle: 'Immutable Infrastructure & Golden Images',
    question: 'What is the core security advantage of adopting an "Immutable Infrastructure" model for virtual servers and containers?',
    options: [
      'Servers can never be shut down or restarted.',
      'Servers are never modified or patched in-place; instead, updated Golden Images are deployed and old instances are destroyed, eliminating configuration drift and backdoor persistence.',
      'Immutable servers do not require network connectivity.',
      'Immutable servers run without operating systems.'
    ],
    correctAnswer: 'Servers are never modified or patched in-place; instead, updated Golden Images are deployed and old instances are destroyed, eliminating configuration drift and backdoor persistence.',
    explanation: 'In immutable infrastructure, servers are treated as cattle, not pets. If a patch or update is needed, a new hardened AMI/container image is built and tested in CI/CD, deployed via Auto Scaling, and the old servers are terminated, wiping out any attacker implants.',
    engineerReasoning: 'Manual SSH patching leads to snowflake servers with unknown security states. Immutability guarantees all running servers match audited source code.',
    businessImpact: 'Eliminates configuration drift, guarantees predictable rollbacks, and denies threat actors long-term persistence on compromised compute.',
    awsBestPractice: 'Build automated AMI pipelines using EC2 Image Builder and disallow SSH/RDP ingress in production security groups.'
  },
  {
    id: 'arch-q06',
    difficulty: 'Beginner',
    category: 'Zero Trust Principles',
    topicId: 'defense-in-depth-zero-trust',
    topicTitle: 'Defense-in-Depth & Zero Trust',
    question: 'What is the foundational mantra of the Zero Trust security model?',
    options: [
      'Trust everything inside the corporate network; verify only external internet traffic.',
      'Never trust, always verify: assume breach and verify every request explicitly based on identity, context, and data sensitivity regardless of network location.',
      'Only trust traffic that originates from macOS laptops.',
      'Trust any request that provides a valid email address.'
    ],
    correctAnswer: 'Never trust, always verify: assume breach and verify every request explicitly based on identity, context, and data sensitivity regardless of network location.',
    explanation: 'Zero Trust eliminates the concept of an "internal trusted network." Every access request must be authenticated, authorized, and encrypted, whether originating from inside the VPC or outside.',
    engineerReasoning: 'Attackers frequently compromise VPNs or phishing targets. Once inside the perimeter, traditional models allow uninhibited lateral movement. Zero Trust stops lateral movement.',
    businessImpact: 'Prevents internal network penetration from turning into catastrophic ransomware or full intellectual property loss.',
    awsBestPractice: 'Enforce mutual TLS, short-lived IAM credentials, and continuous context validation across all service-to-service communication.'
  },
  {
    id: 'arch-q07',
    difficulty: 'Intermediate',
    category: 'Landing Zone Account Structure',
    topicId: 'multi-account-landing-zone',
    topicTitle: 'Multi-Account Landing Zones',
    question: 'In an AWS Control Tower multi-account landing zone, what is the dedicated purpose of the "Log Archive" and "Security Tooling" core accounts in the Security OU?',
    options: [
      'The Log Archive account hosts customer websites, while Security Tooling runs billing reports.',
      'The Log Archive account centralizes immutable audit logs (CloudTrail, Config, Flow Logs) with restricted access; Security Tooling centralizes security services (GuardDuty, Security Hub, IAM Access Analyzer) with delegated administration.',
      'They are backup accounts used only if the root account password is lost.',
      'They provide free gaming servers for internal employees.'
    ],
    correctAnswer: 'The Log Archive account centralizes immutable audit logs (CloudTrail, Config, Flow Logs) with restricted access; Security Tooling centralizes security services (GuardDuty, Security Hub, IAM Access Analyzer) with delegated administration.',
    explanation: 'Separating Log Archive and Security Tooling implements separation of duties. Even security operations engineers who manage GuardDuty in Security Tooling do not have permission to delete or alter raw logs stored in Log Archive.',
    engineerReasoning: 'If the security operations tooling account is compromised, the attacker still cannot tamper with forensic evidence in Log Archive.',
    businessImpact: 'Satisfies rigorous third-party compliance standards requiring unalterable, independent audit storage.',
    awsBestPractice: 'Enforce S3 Object Lock and strict cross-account KMS key policies on the centralized Log Archive bucket.'
  },
  {
    id: 'arch-q08',
    difficulty: 'Intermediate',
    category: 'Data Perimeter Architecture',
    topicId: 'data-perimeter-guardrails',
    topicTitle: 'Data Perimeter Architecture',
    question: 'What are the three fundamental perimeter dimensions that comprise an AWS Data Perimeter architecture to prevent data exfiltration?',
    options: [
      'Physical fences, security guards, and biometric scanners.',
      'Identity Perimeter (who can access), Resource Perimeter (what resources can be accessed), and Network Perimeter (from where requests originate).',
      'CPU utilization, memory limits, and disk storage quotas.',
      'JavaScript, CSS, and HTML validation rules.'
    ],
    correctAnswer: 'Identity Perimeter (who can access), Resource Perimeter (what resources can be accessed), and Network Perimeter (from where requests originate).',
    explanation: 'An AWS Data Perimeter ensures: 1) Only trusted corporate identities can access corporate data, 2) Trusted identities can only access trusted resources (no exfiltration to personal buckets), and 3) Access must originate from trusted network locations (VPCs or corporate IPs).',
    engineerReasoning: 'Standard identity policies fail if an employee uses valid corporate credentials from a personal laptop or uploads company data to a personal external AWS bucket. Data perimeters solve this.',
    businessImpact: 'Comprehensive defense against insider threat data theft and unauthorized external access.',
    awsBestPractice: 'Combine SCPs (`aws:PrincipalOrgID`), resource policies (`aws:ResourceOrgID`), and VPC endpoint policies (`aws:SourceVpc`) to enforce all three dimensions.'
  },
  {
    id: 'arch-q09',
    difficulty: 'Intermediate',
    category: 'Threat Modeling with STRIDE',
    topicId: 'cloud-threat-modeling',
    topicTitle: 'Cloud Threat Modeling & STRIDE',
    question: 'In the STRIDE threat modeling framework, which threat category corresponds to an attacker modifying an S3 object or altering a database transaction, and what is the primary architectural mitigation?',
    options: [
      'Spoofing; mitigated by increasing CPU count.',
      'Tampering; mitigated by cryptographic integrity controls, digital signatures, S3 Versioning, and S3 Object Lock.',
      'Information Disclosure; mitigated by disabling website CSS.',
      'Repudiation; mitigated by deleting CloudTrail logs.'
    ],
    correctAnswer: 'Tampering; mitigated by cryptographic integrity controls, digital signatures, S3 Versioning, and S3 Object Lock.',
    explanation: 'STRIDE stands for Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege. Tampering involves unauthorized modification of data, mitigated by cryptographic hashing, versioning, and immutable storage.',
    engineerReasoning: 'Threat modeling before writing code identifies where tampering can occur, allowing engineers to design immutable safeguards upfront.',
    businessImpact: 'Prevents silent corruption of financial ledger records, medical records, or production deployment artifacts.',
    awsBestPractice: 'Perform STRIDE threat modeling during system design reviews and record mitigations in architectural decision records (ADRs).'
  },
  {
    id: 'arch-q10',
    difficulty: 'Intermediate',
    category: 'Service Control Policy Architecture',
    topicId: 'multi-account-landing-zone',
    topicTitle: 'Multi-Account Landing Zones',
    question: 'Why are AWS Organizations Service Control Policies (SCPs) considered preventive guardrails rather than identity grant policies?',
    options: [
      'Because SCPs automatically charge credit cards for API usage.',
      'SCPs specify the MAXIMUM available permissions across an account or OU; they do not grant permissions on their own, but rather act as an impenetrable boundary filter that no local admin can override.',
      'SCPs only apply to guest users without passwords.',
      'SCPs delete resources that violate corporate naming rules.'
    ],
    correctAnswer: 'SCPs specify the MAXIMUM available permissions across an account or OU; they do not grant permissions on their own, but rather act as an impenetrable boundary filter that no local admin can override.',
    explanation: 'An SCP establishes a permission ceiling. Even if an IAM user in a member account is granted `AdministratorAccess`, an SCP denying `s3:DeleteBucket` renders the administrator completely unable to delete buckets.',
    engineerReasoning: 'Central security teams cannot audit every individual IAM policy in hundreds of accounts. SCPs enforce non-negotiable enterprise boundaries globally.',
    businessImpact: 'Prevents account-level administrators from turning off security tooling, disabling logging, or deploying unapproved costly services.',
    awsBestPractice: 'Attach baseline SCPs to the Root OU to restrict unused AWS regions, prevent leaving the AWS Organization, and protect security agent configurations.'
  },
  {
    id: 'arch-q11',
    difficulty: 'Intermediate',
    category: 'Blast Radius Reduction',
    topicId: 'well-architected-security',
    topicTitle: 'Well-Architected Security Pillar',
    question: 'How does an architectural design that isolates microservices into separate VPCs and separate IAM roles reduce "Blast Radius" during a security incident?',
    options: [
      'It physically stops electricity from flowing to the server.',
      'If a vulnerability is exploited in one microservice (e.g. public frontend), the attacker’s access is constrained to that isolated VPC and limited role, preventing immediate compromise of the backend database or adjacent services.',
      'It causes the entire AWS data center to reboot.',
      'It alerts the local police department automatically.'
    ],
    correctAnswer: 'If a vulnerability is exploited in one microservice (e.g. public frontend), the attacker’s access is constrained to that isolated VPC and limited role, preventing immediate compromise of the backend database or adjacent services.',
    explanation: 'Blast radius reduction ensures a security compromise is contained to the smallest possible domain. Strict network boundaries and isolated least-privilege roles prevent the attacker from pivoting laterally.',
    engineerReasoning: 'Assuming breach is fundamental to modern cloud architecture: design systems so that any single compromised node causes minimal collateral damage.',
    businessImpact: 'Turns what could have been a catastrophic company-ending breach into a localized, manageable minor security incident.',
    awsBestPractice: 'Use separate execution roles and isolated subnets for each microservice tier rather than shared monolithic roles.'
  },
  {
    id: 'arch-q12',
    difficulty: 'Intermediate',
    category: 'Secure CI/CD Architecture',
    topicId: 'immutable-infrastructure',
    topicTitle: 'Immutable Infrastructure & Golden Images',
    question: 'When designing a secure CI/CD pipeline for deploying cloud infrastructure via Terraform or AWS CDK, how should the deployment pipeline authenticate to AWS without using static, long-lived access keys?',
    options: [
      'Hardcode the AWS root user password in the GitHub Actions workflow YAML.',
      'Configure OpenID Connect (OIDC) identity federation between the CI/CD provider (e.g. GitHub Actions/GitLab) and an AWS IAM Role, allowing ephemeral STS temporary credentials scoped to the specific repository and branch.',
      'Email access keys to developers whenever a commit is pushed.',
      'Disable authentication in the AWS account.'
    ],
    correctAnswer: 'Configure OpenID Connect (OIDC) identity federation between the CI/CD provider (e.g. GitHub Actions/GitLab) and an AWS IAM Role, allowing ephemeral STS temporary credentials scoped to the specific repository and branch.',
    explanation: 'OIDC eliminates static AWS secrets in CI/CD repositories. The pipeline exchanges an OIDC token issued by GitHub/GitLab for short-lived AWS STS credentials, with IAM trust policies enforcing exact repository and branch conditions.',
    engineerReasoning: 'Leaked CI/CD secrets stored in GitHub repository settings are a leading vector for public cloud supply-chain attacks. OIDC completely eliminates static secrets.',
    businessImpact: 'Prevents supply chain compromise and eliminates the operational overhead of rotating long-lived service account keys.',
    awsBestPractice: 'Enforce `Condition: { StringLike: { "token.actions.githubusercontent.com:sub": "repo:my-org/my-repo:ref:refs/heads/main" } }` in the IAM role trust policy.'
  },
  {
    id: 'arch-q13',
    difficulty: 'Intermediate',
    category: 'KMS Key Hierarchy Architecture',
    topicId: 'defense-in-depth-zero-trust',
    topicTitle: 'Defense-in-Depth & Zero Trust',
    question: 'In AWS Key Management Service (KMS), what is "Envelope Encryption" and why is it a core architectural pattern for high-performance cloud data security?',
    options: [
      'Sending paper letters containing secret passwords in physical envelopes.',
      'Encrypting plaintext data with a unique Data Encryption Key (DEK), and then encrypting the DEK with a root KMS Customer Master Key (KMS key), storing the encrypted DEK alongside the encrypted data.',
      'Encrypting data using an algorithm that only works on postal codes.',
      'Compressing files into .zip archives without passwords.'
    ],
    correctAnswer: 'Encrypting plaintext data with a unique Data Encryption Key (DEK), and then encrypting the DEK with a root KMS Customer Master Key (KMS key), storing the encrypted DEK alongside the encrypted data.',
    explanation: 'KMS keys cannot encrypt data larger than 4KB directly. Envelope encryption uses KMS to generate and protect a local 256-bit symmetric DEK, which encrypts multi-gigabyte files locally at hardware speeds without sending raw data over the network.',
    engineerReasoning: 'Envelope encryption drastically reduces network latency, avoids KMS API rate limits, and ensures data can be decrypted only by callers authorized to call `kms:Decrypt` on the master key.',
    businessImpact: 'Enables high-throughput encryption for petabyte-scale data lakes while maintaining centralized cryptographic access control.',
    awsBestPractice: 'Use the AWS Encryption SDK to handle envelope encryption, key caching, and cryptographic verification automatically.'
  },
  {
    id: 'arch-q14',
    difficulty: 'Intermediate',
    category: 'Secrets Management Architecture',
    topicId: 'well-architected-security',
    topicTitle: 'Well-Architected Security Pillar',
    question: 'Why should microservices retrieve database passwords from AWS Secrets Manager at application runtime rather than reading them from environment variables baked into container images?',
    options: [
      'Environment variables are visible in container inspection tools, process listings (`docker inspect`, `/proc`), and CI/CD logs, and do not support automated cryptographic rotation without rebuilding images.',
      'Environment variables can only store numbers, not letters.',
      'AWS Secrets Manager is completely free with no API limits.',
      'Docker containers crash if environment variables are used.'
    ],
    correctAnswer: 'Environment variables are visible in container inspection tools, process listings (`docker inspect`, `/proc`), and CI/CD logs, and do not support automated cryptographic rotation without rebuilding images.',
    explanation: 'Environment variables persist in memory, container metadata, and log dumps. Secrets Manager allows applications to fetch secrets dynamically with caching, audit every access in CloudTrail, and rotate database credentials automatically with Lambda.',
    engineerReasoning: 'Dynamic retrieval separates code from configuration and credentials, enabling zero-downtime secret rotation.',
    businessImpact: 'Prevents leaked container image layers in public registries from exposing production database credentials.',
    awsBestPractice: 'Use AWS Secrets Manager with automated 30-day rotation and cache secrets in application memory with TTLs to reduce API costs.'
  },
  {
    id: 'arch-q15',
    difficulty: 'Advanced',
    category: 'Landing Zone Management Account Protection',
    topicId: 'multi-account-landing-zone',
    topicTitle: 'Multi-Account Landing Zones',
    question: 'Why does the AWS Well-Architected Framework mandate that NO operational or production workloads should EVER be deployed inside the AWS Organization Management (Payer) Account?',
    options: [
      'The management account does not have access to EC2 or S3.',
      'Service Control Policies (SCPs) do NOT apply to the Management Account; therefore, workloads deployed there bypass all organizational guardrails and a compromise gives the attacker unrestricted access to all member accounts.',
      'The management account charges double the standard pricing.',
      'AWS terminates accounts that run workloads in the management account.'
    ],
    correctAnswer: 'Service Control Policies (SCPs) do NOT apply to the Management Account; therefore, workloads deployed there bypass all organizational guardrails and a compromise gives the attacker unrestricted access to all member accounts.',
    explanation: 'The management account is immune to SCPs and has ultimate root authority across the entire AWS Organization. Compromise of an application running in the management account compromises the entire corporate AWS estate.',
    engineerReasoning: 'The management account should be treated as an ultra-restricted root boundary used strictly for billing consolidation, SCP administration, and account vending.',
    businessImpact: 'Protects the enterprise from existential catastrophic takeover where an attacker uses management account privileges to delete all corporate member accounts.',
    awsBestPractice: 'Lock away management account root credentials with hardware MFA, delegate all operational services (GuardDuty, Security Hub, CloudTrail) to member accounts, and enforce zero day-to-day user logins.'
  },
  {
    id: 'arch-q16',
    difficulty: 'Advanced',
    category: 'Zero Trust Identity Federation with ABAC',
    topicId: 'defense-in-depth-zero-trust',
    topicTitle: 'Defense-in-Depth & Zero Trust',
    question: 'How does Attribute-Based Access Control (ABAC) provide superior architectural scalability over Role-Based Access Control (RBAC) in large enterprise cloud environments?',
    options: [
      'ABAC eliminates all IAM policies completely.',
      'ABAC defines permissions dynamically based on matching principal tags and resource tags (e.g. `${aws:PrincipalTag/Department} == ${aws:ResourceTag/Department}`), eliminating the need to create new IAM roles every time a new project or team is created.',
      'ABAC requires users to authenticate with finger-print biometrics on AWS servers.',
      'ABAC only works for S3 buckets.'
    ],
    correctAnswer: 'ABAC defines permissions dynamically based on matching principal tags and resource tags (e.g. `${aws:PrincipalTag/Department} == ${aws:ResourceTag/Department}`), eliminating the need to create new IAM roles every time a new project or team is created.',
    explanation: 'In RBAC, adding 50 teams requires creating 50 separate roles and updating hundreds of policies. In ABAC, a single generic role policy allows access if the user’s department tag matches the resource tag, scaling automatically without policy sprawl.',
    engineerReasoning: 'Prevents policy size limit exhaustion and administrative overhead in enterprises with thousands of developers.',
    businessImpact: 'Drastically accelerates developer onboarding and minimizes human error in permission maintenance.',
    awsBestPractice: 'Enforce mandatory resource tagging via AWS Organizations tag policies and pass SAML/OIDC session tags during SSO federation.'
  },
  {
    id: 'arch-q17',
    difficulty: 'Advanced',
    category: 'Data Perimeter Resource Restrictions',
    topicId: 'data-perimeter-guardrails',
    topicTitle: 'Data Perimeter Architecture',
    question: 'An enterprise wants to ensure that corporate developer laptops can only push/pull code to corporate AWS CodeCommit repositories and corporate S3 buckets, blocking access to external personal AWS accounts. Which SCP condition enforces this across all organizational accounts?',
    options: [
      '`Condition: { StringEquals: { "aws:PrincipalType": "User" } }`',
      '`Condition: { StringNotEquals: { "aws:ResourceOrgID": "o-xxxxxxxxxx" } }` combined with `Effect: Deny` for all S3 and CodeCommit actions.',
      '`Condition: { NumericLessThan: { "aws:MultiFactorAuthAge": "3600" } }`',
      '`Condition: { Bool: { "aws:SecureTransport": "true" } }`'
    ],
    correctAnswer: '`Condition: { StringNotEquals: { "aws:ResourceOrgID": "o-xxxxxxxxxx" } }` combined with `Effect: Deny` for all S3 and CodeCommit actions.',
    explanation: 'The `aws:ResourceOrgID` condition key identifies the AWS Organization ID of the resource being accessed. An explicit Deny for any resource whose Organization ID does not match your corporate Org ID blocks developers from exfiltrating data to external AWS accounts.',
    engineerReasoning: 'Enforces the Resource Perimeter dimension of the Data Perimeter: trusted identities cannot interact with untrusted external resources.',
    businessImpact: 'Stops malicious insiders or compromised developer tokens from exfiltrating proprietary source code to outside AWS infrastructure.',
    awsBestPractice: 'Apply this SCP to developer organizational units, with exceptions granted only for verified public vendor resource ARNs.'
  },
  {
    id: 'arch-q18',
    difficulty: 'Advanced',
    category: 'Automated Golden AMI Pipelines',
    topicId: 'immutable-infrastructure',
    topicTitle: 'Immutable Infrastructure & Golden Images',
    question: 'In an enterprise Golden AMI pipeline built with EC2 Image Builder, what sequence of validation steps ensures that newly created AMIs are safe for production deployment?',
    options: [
      'Build AMI -> Immediately deploy to all production servers -> Wait for user bug reports.',
      'Base OS hardening (CIS Benchmark) -> Security agent installation -> Vulnerability scanning (Amazon Inspector) -> Automated compliance testing in a sandbox VPC -> Cryptographic signing -> Distribution to member accounts via AWS RAM.',
      'Upload the AMI to a public AWS marketplace.',
      'Disable antivirus and logging before building the AMI.'
    ],
    correctAnswer: 'Base OS hardening (CIS Benchmark) -> Security agent installation -> Vulnerability scanning (Amazon Inspector) -> Automated compliance testing in a sandbox VPC -> Cryptographic signing -> Distribution to member accounts via AWS RAM.',
    explanation: 'A defensible golden image pipeline enforces automated testing: hardening against CIS benchmarks, injecting logging/EDR agents, verifying with Inspector for zero critical CVEs, and testing before automated cross-account sharing.',
    engineerReasoning: 'Security baked into the base image shifts vulnerability management left, preventing insecure configurations from ever reaching production.',
    businessImpact: 'Ensures 100% compliance across tens of thousands of instances and drastically reduces operational vulnerability remediation workloads.',
    awsBestPractice: 'Automate AMI rebuilds weekly or immediately upon release of high-severity CVE patches, automatically triggering Auto Scaling instance refreshes.'
  },
  {
    id: 'arch-q19',
    difficulty: 'Advanced',
    category: 'Threat Modeling Attack Trees',
    topicId: 'cloud-threat-modeling',
    topicTitle: 'Cloud Threat Modeling & STRIDE',
    question: 'When constructing an attack tree for a serverless application consisting of API Gateway, AWS Lambda, and DynamoDB, which threat scenario represents an "Elevation of Privilege" attack, and what is the proper architectural mitigation?',
    options: [
      'Sending 10,000 HTTP requests per second to exhaust memory; mitigated by autoscaling.',
      'An attacker exploits a SQL/NoSQL injection flaw in the Lambda handler to execute commands under the Lambda execution role; mitigated by least-privilege IAM policies, input validation, and parameter sanitization.',
      'Viewing public API documentation on GitHub.',
      'Renaming a DynamoDB table.'
    ],
    correctAnswer: 'An attacker exploits a SQL/NoSQL injection flaw in the Lambda handler to execute commands under the Lambda execution role; mitigated by least-privilege IAM policies, input validation, and parameter sanitization.',
    explanation: 'Elevation of Privilege occurs when an unauthenticated or low-privilege user tricks the application into executing actions with the higher privileges of the Lambda execution role. Granular IAM scoping ensures even compromised functions cannot access sensitive tables.',
    engineerReasoning: 'Serverless functions are not magically immune to injection flaws. If the Lambda role has `dynamodb:*`, injection grants total database takeover.',
    businessImpact: 'Prevents unauthorized data manipulation or administrative privilege acquisition through application-layer flaws.',
    awsBestPractice: 'Scope Lambda IAM execution roles to exact table ARNs and specific DynamoDB actions (`dynamodb:GetItem`, `dynamodb:PutItem`), never wildcard `*`.'
  },
  {
    id: 'arch-q20',
    difficulty: 'Advanced',
    category: 'Secure Architecture Drift Detection',
    topicId: 'well-architected-security',
    topicTitle: 'Well-Architected Security Pillar',
    question: 'How can cloud architects prevent and detect "Security Architecture Drift" when infrastructure is provisioned through AWS CloudFormation or Terraform?',
    options: [
      'Prohibit developers from checking in code.',
      'Enforce GitOps pipelines with pre-commit security linting (Checkov, tfsec, cfn-nag), disallow direct console changes via SCPs, and run automated CloudFormation Drift Detection / Terraform Plan audits continuously.',
      'Re-install Terraform every morning.',
      'Allow all team members to make emergency manual console edits.'
    ],
    correctAnswer: 'Enforce GitOps pipelines with pre-commit security linting (Checkov, tfsec, cfn-nag), disallow direct console changes via SCPs, and run automated CloudFormation Drift Detection / Terraform Plan audits continuously.',
    explanation: 'Architecture drift occurs when out-of-band changes (e.g. manual console clicks) bypass reviewed IaC templates. Blocking console write access with SCPs and enforcing automated IaC scanning maintains audited architectural state.',
    engineerReasoning: 'Manual changes during fires become permanent vulnerabilities. Enforcing IaC as the single source of truth guarantees architecture reproducibility.',
    businessImpact: 'Ensures that security posture evaluated during audits matches the reality of live cloud infrastructure.',
    awsBestPractice: 'Use AWS Config rules to monitor and alert on configuration changes that did not originate from your authorized CI/CD deployment role.'
  },
  {
    id: 'arch-q21',
    difficulty: 'Advanced',
    category: 'Private Link Multi-Tenant Architecture',
    topicId: 'defense-in-depth-zero-trust',
    topicTitle: 'Defense-in-Depth & Zero Trust',
    question: 'A SaaS provider hosts a secure financial analytics service in AWS Account A and wants to offer private connectivity to 500 different enterprise customer AWS accounts without exposing the service to the internet or managing 500 VPC peering links. Which architecture satisfies this requirement?',
    options: [
      'Create 500 Internet Gateways.',
      'Deploy an AWS PrivateLink VPC Endpoint Service fronted by a Network Load Balancer (NLB) in Account A, allowing customer accounts to connect privately via Interface VPC Endpoints.',
      'Ask all customers to move into Account A.',
      'Run the service over unencrypted HTTP.'
    ],
    correctAnswer: 'Deploy an AWS PrivateLink VPC Endpoint Service fronted by a Network Load Balancer (NLB) in Account A, allowing customer accounts to connect privately via Interface VPC Endpoints.',
    explanation: 'AWS PrivateLink allows service providers to offer unidirectional, private TCP connectivity. Customers create Interface Endpoints in their VPCs that map to the provider NLB, requiring zero IP route coordination or peering management.',
    engineerReasoning: 'PrivateLink completely eliminates CIDR overlap problems and prevents customer networks from routing into each other.',
    businessImpact: 'Unlocks enterprise sales with banks and healthcare companies that forbid public internet API exposure for sensitive data.',
    awsBestPractice: 'Enforce explicit AWS Account ID whitelisting in the Endpoint Service permissions and require TLS 1.3 across the NLB.'
  },
  {
    id: 'arch-q22',
    difficulty: 'Advanced',
    category: 'Multi-Region Disaster Recovery & Security',
    topicId: 'well-architected-security',
    topicTitle: 'Well-Architected Security Pillar',
    question: 'When designing a Multi-Region Active-Active security architecture with cross-region S3 replication and KMS encryption, which KMS feature is essential for ensuring replicated data can be seamlessly decrypted in the secondary region during a regional failover?',
    options: [
      'KMS Multi-Region Keys (MRKs), which share the same key material, key ID, and ARN across replicated regions.',
      'Exporting private keys to text files and uploading them to Dropbox.',
      'Disabling KMS in the secondary region.',
      'Using the default AWS-managed S3 key.'
    ],
    correctAnswer: 'KMS Multi-Region Keys (MRKs), which share the same key material, key ID, and ARN across replicated regions.',
    explanation: 'Standard KMS keys are strictly single-region. If an object is encrypted with a standard key in us-east-1 and replicated to us-west-2, it must be re-encrypted or decrypted with west keys. Multi-Region Keys allow identical cryptographic operations across regions without re-encryption.',
    engineerReasoning: 'Ensures seamless disaster recovery: applications failing over to the secondary region can decrypt data immediately using the same cryptographic material.',
    businessImpact: 'Guarantees business continuity and eliminates catastrophic data lockout during major cloud provider regional outages.',
    awsBestPractice: 'Use KMS Multi-Region replica keys for cross-region disaster recovery datastores and automate failover testing semi-annually.'
  },
  {
    id: 'arch-q23',
    difficulty: 'Engineer Level',
    category: 'Advanced Zero Trust Architecture with SPIFFE/SPIRE',
    topicId: 'defense-in-depth-zero-trust',
    topicTitle: 'Defense-in-Depth & Zero Trust',
    question: 'In an advanced cloud-native Zero Trust architecture spanning Amazon EKS, on-premises Kubernetes, and serverless containers, how does the SPIFFE/SPIRE standard provide cryptographic workload identity without static secrets?',
    options: [
      'By requiring developers to type passwords into container consoles.',
      'It issues short-lived, cryptographically verified X.509 SVIDs (SPIFFE Verifiable Identity Documents) dynamically based on node attestation and container kernel attributes, establishing mutual TLS identity between microservices across any cloud.',
      'By using IP addresses as passwords.',
      'By disabling all container networking.'
    ],
    correctAnswer: 'It issues short-lived, cryptographically verified X.509 SVIDs (SPIFFE Verifiable Identity Documents) dynamically based on node attestation and container kernel attributes, establishing mutual TLS identity between microservices across any cloud.',
    explanation: 'SPIFFE provides standard workload identities. SPIRE attests running processes and issues 1-hour mTLS certificates directly into container memory, enabling true zero-trust microservice communication independent of underlying network topology.',
    engineerReasoning: 'Replaces fragile network-based firewalls with cryptographic workload identity verification that works seamlessly across multi-cloud and hybrid environments.',
    businessImpact: 'Eliminates cloud vendor lock-in and provides cryptographic attestation compliant with federal Zero Trust mandates (Executive Order 14028).',
    awsBestPractice: 'Integrate SPIRE with AWS IAM Roles Anywhere to allow hybrid on-premises workloads to obtain AWS STS tokens without storing long-lived IAM keys.'
  },
  {
    id: 'arch-q24',
    difficulty: 'Engineer Level',
    category: 'Landing Zone Account Factory Customization (AFC)',
    topicId: 'multi-account-landing-zone',
    topicTitle: 'Multi-Account Landing Zones',
    question: 'How do cloud platform architects automate the baseline provisioning of new AWS accounts so that every newly created account automatically receives hardened VPCs, security tooling, and compliance guardrails before developers gain access?',
    options: [
      'By manually logging into each new account and clicking buttons in the console.',
      'By using AWS Control Tower Account Factory for Terraform (AFT) or CloudFormation Account Factory Customization, which triggers an automated pipeline deploying baseline security infrastructure upon account vending.',
      'By emailing developers AWS root credentials.',
      'By disabling CloudTrail in new accounts.'
    ],
    correctAnswer: 'By using AWS Control Tower Account Factory for Terraform (AFT) or CloudFormation Account Factory Customization, which triggers an automated pipeline deploying baseline security infrastructure upon account vending.',
    explanation: 'Account Factory for Terraform (AFT) orchestrates GitOps-driven account creation: when a new account is requested, AFT enrolls it in the Org, attaches mandatory SCPs, provisions VPCs with Gateway Endpoints, configures central logging, and installs security tooling automatically.',
    engineerReasoning: 'Manual account provisioning inevitably results in forgotten security controls and unmonitored shadow accounts. Automated vending guarantees 100% compliance at birth.',
    businessImpact: 'Reduces account provisioning time from weeks to minutes while guaranteeing zero security gaps.',
    awsBestPractice: 'Store AFT account customization code in version-controlled repositories with mandatory peer review pull requests.'
  },
  {
    id: 'arch-q25',
    difficulty: 'Engineer Level',
    category: 'Formal Verification of Network Architecture',
    topicId: 'data-perimeter-guardrails',
    topicTitle: 'Data Perimeter Architecture',
    question: 'An enterprise cloud architect must prove mathematically to government regulators that NO network path exists between the "Payment Processing Subnet" and the "Public Internet Gateway". What AWS technology provides this formal mathematical proof?',
    options: [
      'Running a `ping` command from a developer laptop.',
      'AWS Network Access Analyzer, which uses automated mathematical reasoning and formal logic across all VPC route tables, security groups, and NACLs to prove whether any theoretical path exists.',
      'Asking the network administrator to write a letter of attestation.',
      'Rebooting the VPC router.'
    ],
    correctAnswer: 'AWS Network Access Analyzer, which uses automated mathematical reasoning and formal logic across all VPC route tables, security groups, and NACLs to prove whether any theoretical path exists.',
    explanation: 'Network Access Analyzer relies on formal methods (Zelkova theorem prover). It does not send packets; it evaluates configuration state mathematically to prove path non-existence under all possible routing combinations.',
    engineerReasoning: 'Penetration testing and packet scanning can miss edge cases. Formal verification provides 100% mathematical certainty for compliance audits.',
    businessImpact: 'Eliminates compliance audit disputes for PCI-DSS, FedRAMP High, and defense workloads.',
    awsBestPractice: 'Define Network Access Scopes in CI/CD pipelines to automatically fail builds if a pull request creates a potential path to untrusted networks.'
  },
  {
    id: 'arch-q26',
    difficulty: 'Engineer Level',
    category: 'Ephemeral Compute Security in Auto Scaling',
    topicId: 'immutable-infrastructure',
    topicTitle: 'Immutable Infrastructure & Golden Images',
    question: 'When deploying auto-scaling EC2 instance fleets behind an Application Load Balancer with zero SSH access allowed, how should production debugging and emergency troubleshooting be securely conducted?',
    options: [
      'Open port 22 temporarily to 0.0.0.0/0.',
      'Use AWS Systems Manager Session Manager with IAM role authorization, recording all keystrokes and session logs to an encrypted, centralized S3 audit bucket, or use EC2 Instance Connect with ephemeral SSH keys.',
      'Reboot instances in single-user mode.',
      'Share a master private key among all engineers.'
    ],
    correctAnswer: 'Use AWS Systems Manager Session Manager with IAM role authorization, recording all keystrokes and session logs to an encrypted, centralized S3 audit bucket, or use EC2 Instance Connect with ephemeral SSH keys.',
    explanation: 'Session Manager provides secure shell access over HTTPS via the SSM Agent. It requires zero open inbound firewall ports, no bastion hosts, integrates with corporate SSO, and logs all executed commands immutably to S3/CloudWatch.',
    engineerReasoning: 'Permanently closes port 22 across all security groups, eliminating SSH brute-force attacks and rogue key distribution.',
    businessImpact: 'Prevents credential leaks and provides complete forensic accountability for administrator actions on production instances.',
    awsBestPractice: 'Enforce Session Manager KMS encryption and stream session transcripts directly to CloudWatch Logs with metric alarms for sensitive commands.'
  },
  {
    id: 'arch-q27',
    difficulty: 'Engineer Level',
    category: 'Break-Glass Emergency Access Architecture',
    topicId: 'well-architected-security',
    topicTitle: 'Well-Architected Security Pillar',
    question: 'In a strictly governed enterprise AWS environment where all human access is federated through Okta/Azure AD, how should a "Break-Glass" emergency access procedure be architected for when the external Identity Provider (IdP) suffers an outage?',
    options: [
      'Store a shared admin password on a sticky note under the server rack.',
      'Maintain a dedicated IAM Emergency Administrator user in the Management Account with a long, randomized password split between two executives, protected by a hardware FIDO security key stored in a physical safe, with alarms alerting SecOps instantly upon any login attempt.',
      'Grant all employees permanent root access.',
      'Disable the AWS Organization.'
    ],
    correctAnswer: 'Maintain a dedicated IAM Emergency Administrator user in the Management Account with a long, randomized password split between two executives, protected by a hardware FIDO security key stored in a physical safe, with alarms alerting SecOps instantly upon any login attempt.',
    explanation: 'Break-glass procedures require independent authentication when SSO is down. Two-person integrity (split secret), hardware MFA, and instantaneous alerting ensure the emergency identity is used only during genuine crises and cannot be abused unnoticed.',
    engineerReasoning: 'A disaster where the corporate IdP goes offline while AWS infrastructure is experiencing an active incident requires pre-planned, audited emergency access.',
    businessImpact: 'Prevents enterprise-wide operational paralysis during third-party identity provider outages.',
    awsBestPractice: 'Test break-glass procedures quarterly and configure CloudWatch alarms that page executive leadership the moment emergency credentials are authenticated.'
  },
  {
    id: 'arch-q28',
    difficulty: 'Engineer Level',
    category: 'Cross-Account IAM Roles Anywhere for On-Premises',
    topicId: 'defense-in-depth-zero-trust',
    topicTitle: 'Defense-in-Depth & Zero Trust',
    question: 'How does AWS IAM Roles Anywhere enable physical on-premises servers to securely obtain AWS temporary credentials without managing long-lived IAM user access keys?',
    options: [
      'By running an ethernet cable directly to an AWS datacenter.',
      'It establishes trust with a customer Public Key Infrastructure (PKI) Certificate Authority (CA); on-premises servers present an X.509 digital certificate signed by the CA to exchange for short-lived AWS STS credentials.',
      'By publishing AWS keys in on-premises DNS records.',
      'By disabling IAM authentication on physical servers.'
    ],
    correctAnswer: 'It establishes trust with a customer Public Key Infrastructure (PKI) Certificate Authority (CA); on-premises servers present an X.509 digital certificate signed by the CA to exchange for short-lived AWS STS credentials.',
    explanation: 'IAM Roles Anywhere extends IAM Roles to non-AWS workloads. By anchoring trust in your enterprise PKI, servers sign requests with their local private key to vend temporary STS credentials, ending the practice of hardcoding static IAM access keys on-premises.',
    engineerReasoning: 'Static keys stored on physical servers or VMs in branch offices are frequently compromised. PKI-backed temporary credentials enforce modern zero-trust identity standards.',
    businessImpact: 'Prevents on-premises server compromise from leaking permanent access keys that grant persistent access to AWS cloud environments.',
    awsBestPractice: 'Use AWS Certificate Manager Private CA (or existing enterprise CA) and revoke certificates immediately when on-premises servers are decommissioned.'
  },
  {
    id: 'arch-q29',
    difficulty: 'Engineer Level',
    category: 'Data Perimeter Network Scoping with PrivateLink',
    topicId: 'data-perimeter-guardrails',
    topicTitle: 'Data Perimeter Architecture',
    question: 'Which SCP condition pattern prevents any IAM principal in your AWS Organization from making API calls from outside your corporate network or corporate VPCs, effectively enforcing the Network Perimeter dimension of the Data Perimeter?',
    options: [
      '`Condition: { StringEquals: { "aws:username": "admin" } }`',
      '`Condition: { NotIpAddressIfExists: { "aws:SourceIp": ["CORPORATE_IPS"] }, StringNotEqualsIfExists: { "aws:sourceVpc": ["vpc-xxxxxx"] }, BoolIfExists: { "aws:ViaAWSService": "false" } }` combined with `Effect: Deny`.',
      '`Condition: { NumericEquals: { "aws:CurrentTime": "12:00" } }`',
      '`Condition: { StringEquals: { "aws:UserAgent": "Mozilla" } }`'
    ],
    correctAnswer: '`Condition: { NotIpAddressIfExists: { "aws:SourceIp": ["CORPORATE_IPS"] }, StringNotEqualsIfExists: { "aws:sourceVpc": ["vpc-xxxxxx"] }, BoolIfExists: { "aws:ViaAWSService": "false" } }` combined with `Effect: Deny`.',
    explanation: 'This condition checks whether the call originates from authorized corporate IP ranges or authorized corporate VPCs. The `aws:ViaAWSService` check ensures that internal AWS service-to-service calls (like DynamoDB backups or CloudWatch logs) are not accidentally broken.',
    engineerReasoning: 'Enforcing network perimeter conditions renders stolen credentials completely useless to an attacker on the public internet.',
    businessImpact: 'Neutralizes phishing and credential theft: even if an employee’s credentials are leaked, the attacker cannot authenticate from external networks.',
    awsBestPractice: 'Carefully test with `aws:ViaAWSService` and service-linked role exemptions in non-production environments to avoid breaking internal AWS service operations.'
  },
  {
    id: 'arch-q30',
    difficulty: 'Engineer Level',
    category: 'Continuous Compliance with Conformance Packs',
    topicId: 'well-architected-security',
    topicTitle: 'Well-Architected Security Pillar',
    question: 'How do AWS Organizations and AWS Config Organization Conformance Packs enable enterprise security architects to enforce continuous, immutable compliance governance across 500 member accounts with zero drift?',
    options: [
      'By sending a monthly compliance newsletter to developers.',
      'An Organization Conformance Pack is deployed from the management account across all member accounts as a single YAML package; member account administrators cannot edit, delete, or disable the rules, and compliance data aggregates automatically to the central security account.',
      'By shutting down non-compliant accounts after 24 hours.',
      'By requiring developers to pass an exam before deploying resources.'
    ],
    correctAnswer: 'An Organization Conformance Pack is deployed from the management account across all member accounts as a single YAML package; member account administrators cannot edit, delete, or disable the rules, and compliance data aggregates automatically to the central security account.',
    explanation: 'Organization Conformance Packs package Config rules and remediation runbooks into a single immutable deployment. Member accounts inherit them automatically and cannot tamper with them, providing continuous compliance reporting to the CISO.',
    engineerReasoning: 'Provides mathematical assurance that security governance is uniform across all business units, regardless of organizational growth or developer turnover.',
    businessImpact: 'Prevents multi-million dollar regulatory fines by maintaining provable, continuous compliance with PCI-DSS, NIST 800-53, and HIPAA.',
    awsBestPractice: 'Deploy the official Operational Best Practices for CIS AWS Foundations Benchmark Conformance Pack across all accounts.'
  }
]
