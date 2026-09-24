/**
 * SeCloudive Career Ramp-Up Guides & Comprehensive Labs Directory
 * Authoritative hands-on labs with original links, step-by-step execution guides,
 * and "What You Have Learnt" skill competencies for every Cloud Role, TryHackMe,
 * HackTheBox, and Core Foundations (Linux, Python, Networking, Docker, IaC).
 */

export const rampUpCategories = [
  { id: 'all', label: 'All Modules', count: 20 },
  { id: 'cloud-roles', label: 'Cloud Roles & Ramp-Up', count: 5 },
  { id: 'tryhackme', label: 'TryHackMe Cloud', count: 4 },
  { id: 'hackthebox', label: 'HackTheBox Cloud', count: 4 },
  { id: 'linux', label: 'Linux Foundations', count: 2 },
  { id: 'python', label: 'Python Automation', count: 2 },
  { id: 'networking', label: 'Cloud Networking', count: 2 },
  { id: 'docker', label: 'Docker & Containers', count: 2 },
  { id: 'iac', label: 'IaC & Terraform', count: 2 },
]

export const masterRampUpLabs = [
  // =========================================================================
  // 1. CLOUD ROLES & RAMP-UP GUIDES
  // =========================================================================
  {
    id: 'role-secops-engineer',
    category: 'cloud-roles',
    roleTitle: 'Cloud Security Engineer (SecOps & Detection)',
    labTitle: 'AWS Security Hub & GuardDuty Automated Incident Containment',
    originalLink: 'https://workshops.aws/card/AWS%20Security%20Hub%20Workshop',
    platform: 'AWS Official Workshops',
    difficulty: 'Intermediate',
    estimatedTime: '60 mins',
    badgeTone: 'cyan',
    targetServices: ['AWS Security Hub', 'Amazon GuardDuty', 'Amazon EventBridge', 'AWS Lambda'],
    roleRampUpGuide: {
      summary: 'Cloud Security Engineers safeguard multi-account AWS environments, triage detection alerts, and build automated remediation pipelines to reduce Mean Time to Remediate (MTTR).',
      dayInLife: 'Monitoring GuardDuty findings, evaluating Security Hub CIS compliance scorecards, writing EventBridge event-driven automation rules, and collaborating with platform teams on least-privilege policies.',
      keyCertifications: ['AWS Certified Security - Specialty (SCS-C02)', 'GIAC Cloud Security Automation (GCSA)'],
      salaryRange: '$135,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Centralize Detection Telemetry in Security Hub',
        instruction: 'Enable Amazon GuardDuty and AWS Security Hub across all member accounts from the designated Delegated Administrator Security Account.',
        commandOrAction: 'aws securityhub enable-security-hub --enable-default-standards'
      },
      {
        step: 2,
        title: 'Configure EventBridge Detection Filter',
        instruction: 'Create an Amazon EventBridge rule that matches GuardDuty findings with severity >= 7.0 (High/Critical) for EC2 compromise signals.',
        commandOrAction: 'aws events put-rule --name "GuardDuty-HighSev-Trigger" --event-pattern \'{"source":["aws.guardduty"],"detail":{"severity":[7,7.1,7.2,7.3,7.4,7.5,7.6,7.7,7.8,7.9,8,8.1,8.2,8.3,8.4,8.5,8.6,8.7,8.8,8.9]}}\''
      },
      {
        step: 3,
        title: 'Deploy Automated Quarantine Lambda Function',
        instruction: 'Deploy a serverless Python Lambda function that intercepts the instance ID from the event payload and attaches an isolating Quarantine Security Group (blocking 100% inbound/outbound).',
        commandOrAction: 'aws ec2 modify-instance-attribute --instance-id i-0123456789abcdef0 --groups sg-quarantine-isolated'
      },
      {
        step: 4,
        title: 'Simulate Attack & Validate Containment',
        instruction: 'Trigger a simulated DNS data exfiltration query on a test EC2 instance, observe GuardDuty alert generation, and confirm EventBridge executes the quarantine Lambda within 15 seconds.',
        commandOrAction: 'dig @8.8.8.8 test-exfiltration.guardduty-c2.com'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Event-driven serverless automated incident containment',
        'Multi-account Security Hub & GuardDuty architecture',
        'Reducing MTTR from hours to under 30 seconds',
        'Preserving volatile forensic evidence without terminating instances'
      ],
      interviewTalkingPoint: 'I architected an automated EventBridge and Lambda containment pipeline that intercepts GuardDuty severity 7+ C2 indicators and applies quarantine security groups in under 20 seconds, eliminating manual triage delays.'
    }
  },
  {
    id: 'role-iam-architect',
    category: 'cloud-roles',
    roleTitle: 'Cloud IAM & Identity Architect',
    labTitle: 'IAM Policy Sifting & Permission Boundaries Enforcement',
    originalLink: 'https://workshops.aws/card/IAM%20Policy%20Validation',
    platform: 'AWS Official Workshops',
    difficulty: 'Advanced',
    estimatedTime: '75 mins',
    badgeTone: 'purple',
    targetServices: ['AWS IAM', 'IAM Access Analyzer', 'IAM Permission Boundaries', 'AWS CloudTrail'],
    roleRampUpGuide: {
      summary: 'IAM Architects design enterprise identity governance, enforce strict least-privilege access, prevent privilege escalation paths, and govern cross-account STS assume-role trust relationships.',
      dayInLife: 'Reviewing developer access requests, designing Permission Boundaries for CI/CD pipelines, analyzing Access Analyzer findings, and automating unused credential decommissioning.',
      keyCertifications: ['AWS Certified Solutions Architect - Professional (SAP-C02)', 'Certified Identity and Access Manager (CIAM)'],
      salaryRange: '$150,000 - $210,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Generate Activity Baseline from CloudTrail History',
        instruction: 'Use IAM Access Analyzer policy generation to inspect the last 90 days of CloudTrail activity for an overly permissive developer role with AdministratorAccess.',
        commandOrAction: 'aws accessanalyzer start-policy-generation --policy-generation-details \'{"principalArn":"arn:aws:iam::123456789012:role/DevLeadRole"}\''
      },
      {
        step: 2,
        title: 'Validate Policy Grammar and Security Warnings',
        instruction: 'Run policy validation via Access Analyzer CLI to identify security warnings such as wildcard resource actions on sensitive services (e.g. s3:*, iam:*).',
        commandOrAction: 'aws accessanalyzer validate-policy --policy-document file://generated-policy.json --policy-type IDENTITY_POLICY'
      },
      {
        step: 3,
        title: 'Author and Attach IAM Permission Boundary',
        instruction: 'Create an IAM Permission Boundary policy that caps the maximum permissions developers can grant themselves, explicitly denying privilege escalation actions (e.g., iam:CreatePolicyVersion, iam:AttachRolePolicy).',
        commandOrAction: 'aws iam put-role-permissions-boundary --role-name DevLeadRole --permissions-boundary arn:aws:iam::123456789012:policy/DevPermissionBoundary'
      },
      {
        step: 4,
        title: 'Test Privilege Escalation Resistance',
        instruction: 'Assume the DevLeadRole and attempt to attach AdministratorAccess to a secondary role. Confirm IAM denies the request with an explicit boundary violation.',
        commandOrAction: 'aws iam attach-role-policy --role-name SecondaryRole --policy-arn arn:aws:iam::aws:policy/AdministratorAccess'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Eliminating wildcard policies using CloudTrail empirical service utilization data',
        'Enforcing IAM Permission Boundaries to prevent shadow admin escalation',
        'Mathematical formal verification using IAM Access Analyzer',
        'ABAC (Attribute-Based Access Control) tagging strategies'
      ],
      interviewTalkingPoint: 'By establishing mandatory IAM Permission Boundaries on all developer CI/CD roles, I decentralized role creation while mathematically guaranteeing developers could never escalate privileges to administrative control.'
    }
  },
  {
    id: 'role-devsecops-lead',
    category: 'cloud-roles',
    roleTitle: 'DevSecOps & Cloud Platform Security Lead',
    labTitle: 'Keyless GitHub Actions OIDC & Shift-Left Terraform Posture',
    originalLink: 'https://github.com/bridgecrewio/checkov',
    platform: 'Open Source Security / GitHub',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    badgeTone: 'emerald',
    targetServices: ['AWS IAM OIDC', 'GitHub Actions', 'Terraform', 'Checkov', 'Amazon S3'],
    roleRampUpGuide: {
      summary: 'DevSecOps Engineers integrate automated security scanning, policy-as-code, and cryptographic identity federation directly into CI/CD build pipelines before deployment to cloud production.',
      dayInLife: 'Configuring pipeline security gates, auditing Terraform code with Checkov, eliminating hardcoded long-lived credentials via OIDC, and container image vulnerability gating.',
      keyCertifications: ['Certified Kubernetes Security Specialist (CKS)', 'DevSecOps Professional (CDP)'],
      salaryRange: '$140,000 - $190,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Establish IAM OpenID Connect (OIDC) Identity Provider',
        instruction: 'Create an IAM OIDC Identity Provider for token.actions.githubusercontent.com to eliminate stored AWS Access Keys in repository secrets.',
        commandOrAction: 'aws iam create-open-id-connect-provider --url https://token.actions.githubusercontent.com --client-id-list sts.amazonaws.com --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1'
      },
      {
        step: 2,
        title: 'Configure Scoped Role Trust Policy',
        instruction: 'Author an IAM trust policy that only permits AssumeRoleWithWebIdentity when the repository and branch match your organization repository (e.g. repo:org/infra:ref:refs/heads/main).',
        commandOrAction: 'aws iam create-role --role-name GitHubActionsTerraformRole --assume-role-policy-document file://oidc-trust.json'
      },
      {
        step: 3,
        title: 'Add Checkov Static Analysis to GitHub Workflow',
        instruction: 'Configure a GitHub Actions workflow step executing Checkov static analysis against Terraform pull requests with high/critical severity blocking rules.',
        commandOrAction: 'checkov -d ./terraform --framework terraform --soft-fail=false --check HIGH,CRITICAL'
      },
      {
        step: 4,
        title: 'Simulate Misconfiguration & Verify Pull Request Block',
        instruction: 'Commit a Terraform resource with `acl = "public-read"` on an S3 bucket. Verify Checkov fails the CI check and prevents deployment.',
        commandOrAction: 'git commit -m "test: insecure s3 bucket" && git push'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Zero-credential CI/CD authentication via short-lived JWT OIDC tokens',
        'Shift-left static analysis for Infrastructure as Code (Checkov/tfsec)',
        'Preventing credential exfiltration from CI/CD runners',
        'Automated pull-request security compliance gates'
      ],
      interviewTalkingPoint: 'I eliminated 100% of static AWS access keys from our CI/CD pipelines by migrating to GitHub Actions OIDC and established automated Checkov gates that block high-severity IaC misconfigurations before merge.'
    }
  },
  {
    id: 'role-cloud-architect',
    category: 'cloud-roles',
    roleTitle: 'Cloud Security Architect (Multi-Account & Perimeter)',
    labTitle: 'AWS Organizations SCPs & Transit Gateway Egress Firewall',
    originalLink: 'https://workshops.aws/card/AWS%20Network%20Firewall',
    platform: 'AWS Official Workshops',
    difficulty: 'Advanced',
    estimatedTime: '90 mins',
    badgeTone: 'rose',
    targetServices: ['AWS Organizations', 'Service Control Policies (SCPs)', 'AWS Transit Gateway', 'AWS Network Firewall'],
    roleRampUpGuide: {
      summary: 'Cloud Security Architects design the overarching defense-in-depth blueprint: multi-account landing zones, preventative governance guardrails, and centralized inspection perimeters.',
      dayInLife: 'Reviewing cloud architecture designs against the Well-Architected Framework, drafting Organization SCPs, designing hub-and-spoke transit networks, and establishing threat models.',
      keyCertifications: ['AWS Certified Solutions Architect - Professional (SAP-C02)', 'CISSP - Certified Information Systems Security Professional'],
      salaryRange: '$165,000 - $235,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Enforce Organization Guardrails via SCPs',
        instruction: 'Draft an SCP in the root organization denying accounts from leaving AWS Organizations, disabling CloudTrail, or deleting GuardDuty detectors.',
        commandOrAction: 'aws organizations create-policy --content file://deny-disable-security.json --name "DenySecurityDisabling" --type SERVICE_CONTROL_POLICY'
      },
      {
        step: 2,
        title: 'Deploy Hub-and-Spoke Transit Gateway Topology',
        instruction: 'Create an AWS Transit Gateway that interconnects Spoke VPCs (App, Data) with a centralized Egress & Inspection VPC.',
        commandOrAction: 'aws ec2 create-transit-gateway --description "Central-Security-Hub-TGW"'
      },
      {
        step: 3,
        title: 'Configure AWS Network Firewall with Suricata Rules',
        instruction: 'Provision AWS Network Firewall in the Inspection VPC with stateful 5-tuple and domain-filtering rules to block outbound traffic to non-whitelisted domains.',
        commandOrAction: 'aws network-firewall create-firewall --firewall-name EgressFilterFW --firewall-policy-arn arn:aws:network-firewall:... --vpc-id vpc-inspection'
      },
      {
        step: 4,
        title: 'Verify Perimeter Filtering and Logging',
        instruction: 'Generate outbound curl requests from an app instance to test domains. Confirm whitelisted domains succeed and unauthorized outbound connections are dropped with alerts sent to CloudWatch Logs.',
        commandOrAction: 'curl -I https://unauthorized-domain.com'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Non-bypassable organizational guardrails using preventative SCPs',
        'Centralized hub-and-spoke network inspection perimeters',
        'Stateful Suricata network signature authoring',
        'Egress filtering to prevent C2 communications and data exfiltration'
      ],
      interviewTalkingPoint: 'I designed a centralized transit VPC architecture with AWS Network Firewall and strict Organizations SCPs, creating a unified inspection bottleneck that enforces TLS domain whitelisting across 50+ development accounts.'
    }
  },
  {
    id: 'role-forensics-lead',
    category: 'cloud-roles',
    roleTitle: 'Cloud Incident Responder & Digital Forensics Analyst',
    labTitle: 'EC2 Memory Dumps & Athena CloudTrail Kill-Chain Analysis',
    originalLink: 'https://workshops.aws/card/AWS%20Incident%20Response%20and%20Forensics',
    platform: 'AWS Official Workshops',
    difficulty: 'Advanced',
    estimatedTime: '80 mins',
    badgeTone: 'amber',
    targetServices: ['AWS CloudTrail', 'Amazon Athena', 'Amazon EBS Snapshots', 'Amazon S3'],
    roleRampUpGuide: {
      summary: 'Forensics Analysts reconstruct threat actor attack timelines, preserve volatile digital evidence according to legal chain of custody, and perform big-data log correlation in SIEM and Athena.',
      dayInLife: 'Performing memory acquisition on active compromised instances, executing Athena SQL threat hunting queries, correlating IP addresses and user agents, and publishing post-incident RCAs.',
      keyCertifications: ['GIAC Certified Incident Handler (GCIH)', 'GIAC Cloud Forensics Responder (GCFR)'],
      salaryRange: '$145,000 - $195,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Isolate Host and Capture Non-Destructive Snapshot',
        instruction: 'Quarantine the suspected compromised EC2 instance and create consistent EBS snapshots of all attached root and secondary volumes.',
        commandOrAction: 'aws ec2 create-snapshot --volume-id vol-0123456789 --description "Forensic-Preservation-Ticket-104"'
      },
      {
        step: 2,
        title: 'Attach Volume Copy to Isolated Forensics Workstation',
        instruction: 'Create an encrypted volume from the snapshot and attach it as a read-only disk to an isolated digital forensics investigation instance.',
        commandOrAction: 'aws ec2 attach-volume --volume-id vol-forensic-copy --instance-id i-forensics-box --device /dev/sdf'
      },
      {
        step: 3,
        title: 'Query CloudTrail Timeline with Amazon Athena',
        instruction: 'Execute SQL queries in Athena across S3 CloudTrail logs to identify every API call invoked by the compromised IAM Access Key within a 24-hour window.',
        commandOrAction: 'SELECT eventtime, eventsource, eventname, sourceipaddress, useragent FROM cloudtrail_logs WHERE useridentity.accesskeyid = \'ASIAEXAMPLE12345\' ORDER BY eventtime ASC;'
      },
      {
        step: 4,
        title: 'Reconstruct Attacker Blast Radius and Generate SHA-256 Hashes',
        instruction: 'Verify data integrity of all disk images using `sha256sum`, correlate compromised credentials with S3 GetObject and IAM PutRolePolicy events, and assemble the executive timeline.',
        commandOrAction: 'sha256sum /dev/xvdf > evidence-integrity-hash.txt'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Volatile and non-volatile cloud evidence preservation',
        'Legal chain of custody and cryptographic hash verification',
        'Athena high-speed SQL log queries for incident timelines',
        'Correlating IAM temporary STS tokens with underlying root identities'
      ],
      interviewTalkingPoint: 'During an incident response engagement, I performed forensic preservation of compromised EBS volumes and wrote targeted Athena queries that reconstructed an attacker lateral movement path in under 45 minutes.'
    }
  },

  // =========================================================================
  // 2. TRYHACKME CLOUD & SECURITY ROOMS
  // =========================================================================
  {
    id: 'thm-cloud-basics',
    category: 'tryhackme',
    roleTitle: 'Security Fundamentals Track',
    labTitle: 'TryHackMe: Cloud Security Basics & Architecture Room',
    originalLink: 'https://tryhackme.com/room/cloudsecuritybasics',
    platform: 'TryHackMe (Public Room)',
    difficulty: 'Beginner',
    estimatedTime: '45 mins',
    badgeTone: 'rose',
    targetServices: ['IaaS vs PaaS vs SaaS', 'Cloud Attack Surface', 'Shared Responsibility', 'Public Cloud Discovery'],
    roleRampUpGuide: {
      summary: 'Essential foundation room explaining how cloud computing paradigms shift security boundaries, access controls, and responsibility between the cloud provider and the customer.',
      dayInLife: 'Understanding why traditional network perimeter defenses fail in cloud architectures and how identity replaces the firewall as the primary security perimeter.',
      keyCertifications: ['CompTIA Security+', 'AWS Certified Cloud Practitioner'],
      salaryRange: 'Foundational Knowledge'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Deploy TryHackMe Target Machine',
        instruction: 'Navigate to the TryHackMe room link, click "Start Machine", and connect via the OpenVPN configuration or the in-browser AttackBox.',
        commandOrAction: 'sudo openvpn /path/to/your-thm-profile.ovpn'
      },
      {
        step: 2,
        title: 'Analyze Shared Responsibility Scenarios',
        instruction: 'Review the questions covering AWS EC2 vs Lambda vs S3. Identify customer responsibilities (OS patching on EC2 vs IAM policies on S3).',
        commandOrAction: 'Answer Task 2 question on hypervisor vs guest OS patching.'
      },
      {
        step: 3,
        title: 'Identify Exposed Cloud Storage Endpoints',
        instruction: 'Scan the simulated cloud target to identify open endpoints and determine if sensitive assets are exposed via unauthenticated storage APIs.',
        commandOrAction: 'curl -I http://target-instance.thm:8080/storage/public-assets/'
      },
      {
        step: 4,
        title: 'Submit Room Answers & Retrieve Flag',
        instruction: 'Synthesize the findings on cloud risk vectors, answer the verification prompts, and submit the final flag to complete the room.',
        commandOrAction: 'Submit THM{cloud_shared_responsibility_mastered}'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Shared Responsibility matrix differences across service tiers',
        'Identification of cloud-specific perimeter attack vectors',
        'Identity as the new security perimeter',
        'Essential TryHackMe lab navigation and verification procedures'
      ],
      interviewTalkingPoint: 'I understand that in cloud computing, security failures almost never stem from hypervisor flaws—they stem from customer configuration errors in identity and storage access policies.'
    }
  },
  {
    id: 'thm-aws-compromise',
    category: 'tryhackme',
    roleTitle: 'Offensive Cloud Security',
    labTitle: 'TryHackMe: AWS Compromise (Attacking & Defending Leaked Keys)',
    originalLink: 'https://tryhackme.com/room/awscompromise',
    platform: 'TryHackMe (Subscriber)',
    difficulty: 'Intermediate',
    estimatedTime: '60 mins',
    badgeTone: 'rose',
    targetServices: ['AWS CLI', 'AWS IAM', 'Amazon S3', 'Credential Hunting'],
    roleRampUpGuide: {
      summary: 'Practical hands-on scenario simulating an attacker discovering leaked AWS API keys in a public Git commit and escalating privileges inside the target AWS account.',
      dayInLife: 'Conducting credential exposure reviews, tracing compromised credentials in CloudTrail, and executing rapid credential revocation.',
      keyCertifications: ['TryHackMe Cloud Security Pathway', 'Certified Cloud Penetration Tester'],
      salaryRange: '$120,000 - $170,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Extract Leaked AWS Access Keys',
        instruction: 'Review the provided Git commit logs on the target web server to locate accidentally committed `aws_access_key_id` and `aws_secret_access_key`.',
        commandOrAction: 'git log -p -S "AKIA" | grep -E "(AKIA|aws_secret)"'
      },
      {
        step: 2,
        title: 'Configure Attacker AWS CLI Profile',
        instruction: 'Configure the extracted credentials into a local AWS named profile and verify identity using AWS STS.',
        commandOrAction: 'aws configure --profile compromised-key && aws sts get-caller-identity --profile compromised-key'
      },
      {
        step: 3,
        title: 'Enumerate IAM Policies & Extract Flags',
        instruction: 'Enumerate the attached policies to identify missing restrictions, list private S3 buckets, and download confidential company data containing the CTF flag.',
        commandOrAction: 'aws s3 ls --profile compromised-key && aws s3 cp s3://internal-financials-backup/flag.txt . --profile compromised-key'
      },
      {
        step: 4,
        title: 'Perform Defensive Containment (Blue Team)',
        instruction: 'Simulate the SOC remediation: deactivate the exposed IAM access key, invalidate active STS sessions, and configure GitHub secret scanning.',
        commandOrAction: 'aws iam update-access-key --access-key-id AKIAEXPOSURE123 --status Inactive'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Real-world offensive techniques against leaked long-lived IAM keys',
        'Enumeration order-of-operations using AWS CLI',
        'Exfiltration vectors via Amazon S3 bucket reconnaissance',
        'Immediate containment runbooks for compromised cloud identities'
      ],
      interviewTalkingPoint: 'I understand how attackers weaponize exposed AWS keys within seconds of public commits, and how defense requires automated deactivation tools like AWS Git Secrets and GitHub push protection.'
    }
  },
  {
    id: 'thm-red-cloud',
    category: 'tryhackme',
    roleTitle: 'Purple Team Cloud Lab',
    labTitle: 'TryHackMe: Red Cloud (SSRF to IMDSv1 Credential Exfiltration)',
    originalLink: 'https://tryhackme.com/room/redcloud',
    platform: 'TryHackMe (Subscriber)',
    difficulty: 'Hard',
    estimatedTime: '70 mins',
    badgeTone: 'rose',
    targetServices: ['EC2 IMDSv1 vs IMDSv2', 'SSRF (Server-Side Request Forgery)', 'IAM Instance Profiles', 'Lateral Movement'],
    roleRampUpGuide: {
      summary: 'Simulates the infamous Capital One cloud attack vector: exploiting an SSRF vulnerability in a web application to query the AWS link-local Instance Metadata Service and steal IAM role tokens.',
      dayInLife: 'Auditing web applications for SSRF vulnerabilities, enforcing IMDSv2 across enterprise EC2 fleets, and monitoring anomalous metadata service call volumes.',
      keyCertifications: ['Offensive Security Certified Cloud Professional (OSCP/OSCP+)', 'GCSA'],
      salaryRange: '$140,000 - $190,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Identify SSRF Vulnerability in Target Web App',
        instruction: 'Browse the web application on the target machine and locate an image/URL proxy parameter vulnerable to SSRF.',
        commandOrAction: 'curl "http://target.thm/preview?url=http://127.0.0.1:80/"'
      },
      {
        step: 2,
        title: 'Query AWS Link-Local Metadata Service (169.254.169.254)',
        instruction: 'Manipulate the URL parameter to query the AWS EC2 Instance Metadata Service (IMDSv1) at `http://169.254.169.254/latest/meta-data/iam/security-credentials/`.',
        commandOrAction: 'curl "http://target.thm/preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/"'
      },
      {
        step: 3,
        title: 'Exfiltrate Session Tokens & Secret Keys',
        instruction: 'Fetch the active role name and retrieve the temporary AccessKeyId, SecretAccessKey, and Token JSON payload.',
        commandOrAction: 'curl "http://target.thm/preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/WebAppServerRole"'
      },
      {
        step: 4,
        title: 'Implement IMDSv2 Defensive Hardening',
        instruction: 'Execute the AWS CLI command that enforces IMDSv2 (requiring a session token header) and set hop limit to 1 to block SSRF bypass.',
        commandOrAction: 'aws ec2 modify-instance-metadata-options --instance-id i-target --http-tokens required --http-put-response-hop-limit 1'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'SSRF-to-cloud-metadata exploitation mechanics',
        'Understanding how instance profiles provision short-lived STS credentials',
        'IMDSv1 architectural weaknesses vs IMDSv2 session token enforcement',
        'Hop limit tuning to prevent container-to-host metadata theft'
      ],
      interviewTalkingPoint: 'I have hands-on experience demonstrating why IMDSv1 is dangerous in modern cloud architectures, and I routinely enforce IMDSv2 with `http-tokens required` and a hop limit of 1 across all production EC2 instances.'
    }
  },
  {
    id: 'thm-azure-ir',
    category: 'tryhackme',
    roleTitle: 'Multi-Cloud Detection & Response',
    labTitle: 'TryHackMe: Incident Response in Azure Cloud',
    originalLink: 'https://tryhackme.com/room/azureincidentresponse',
    platform: 'TryHackMe',
    difficulty: 'Intermediate',
    estimatedTime: '60 mins',
    badgeTone: 'rose',
    targetServices: ['Azure Active Directory (Entra ID)', 'Azure Activity Logs', 'Microsoft Sentinel', 'Service Principals'],
    roleRampUpGuide: {
      summary: 'Incident response in multi-cloud enterprise environments: investigating unauthorized OAuth application consents, rogue Service Principal registrations, and privilege escalation in Azure.',
      dayInLife: 'Investigating Azure Sentinel alerts, auditing Microsoft Entra ID sign-in logs, and tracing attack paths spanning AWS and Azure environments.',
      keyCertifications: ['Microsoft Certified: Security Operations Analyst (SC-200)', 'GCFR'],
      salaryRange: '$130,000 - $180,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Launch Azure IR Sandbox Environment',
        instruction: 'Start the TryHackMe Azure simulation room and log into the provided Sentinel investigation workstation.',
        commandOrAction: 'Connect to Microsoft Sentinel workspace dashboard.'
      },
      {
        step: 2,
        title: 'Search Entra ID Audit Logs for Rogue App Registrations',
        instruction: 'Run KQL (Kusto Query Language) queries to detect newly created Service Principals with High-Privilege application permissions (e.g. Directory.ReadWrite.All).',
        commandOrAction: 'AuditLogs | where OperationName == "Add service principal" | project TimeGenerated, InitiatedBy, TargetResources'
      },
      {
        step: 3,
        title: 'Trace Anomalous Non-Interactive Sign-Ins',
        instruction: 'Query SigninLogs to determine whether the rogue service principal authenticated from an untrusted anomalous IP address.',
        commandOrAction: 'SigninLogs | where AppId == "suspected-app-id" | project IPAddress, Location, ResultType'
      },
      {
        step: 4,
        title: 'Revoke App Permissions & Invalidate Active Tokens',
        instruction: 'Execute Azure CLI / PowerShell command to revoke client credentials and remove all assigned enterprise role permissions.',
        commandOrAction: 'az ad app credential reset --id "suspected-app-id"'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Kusto Query Language (KQL) for cloud threat hunting',
        'Service Principal and OAuth consent grant abuse vectors',
        'Multi-cloud incident response terminology (AWS IAM vs Azure RBAC)',
        'Automated token revocation in enterprise directory services'
      ],
      interviewTalkingPoint: 'Cloud security requires multi-cloud fluency; I use KQL in Microsoft Sentinel to rapidly hunt rogue service principals and audit non-interactive API access across cloud boundaries.'
    }
  },

  // =========================================================================
  // 3. HACKTHEBOX CLOUD & INFRASTRUCTURE LABS
  // =========================================================================
  {
    id: 'htb-bucket',
    category: 'hackthebox',
    roleTitle: 'Cloud Penetration Testing',
    labTitle: 'HackTheBox: Bucket (AWS S3 & LocalStack Compromise)',
    originalLink: 'https://app.hackthebox.com/machines/Bucket',
    platform: 'HackTheBox (Linux / Medium)',
    difficulty: 'Medium',
    estimatedTime: '90 mins',
    badgeTone: 'emerald',
    targetServices: ['LocalStack', 'Amazon S3', 'Amazon DynamoDB', 'PHP Web Shells'],
    roleRampUpGuide: {
      summary: 'Legendary HackTheBox cloud machine featuring a web server backed by simulated AWS cloud services (LocalStack S3 and DynamoDB), showcasing how misconfigured bucket syncs lead to Remote Code Execution.',
      dayInLife: 'Conducting cloud penetration tests, identifying unauthenticated internal cloud APIs, and auditing microservice storage architecture.',
      keyCertifications: ['HackTheBox Certified Bug Bounty Hunter (HTB CBBH)', 'OSCP'],
      salaryRange: '$135,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Reconnaissance & Virtual Host Enumeration',
        instruction: 'Run Nmap port scan against the target IP and discover virtual hosts `bucket.htb` and `s3.bucket.htb` in the HTTP response headers.',
        commandOrAction: 'echo "10.10.10.212 bucket.htb s3.bucket.htb" | sudo tee -a /etc/hosts'
      },
      {
        step: 2,
        title: 'Enumerate LocalStack S3 Buckets via AWS CLI',
        instruction: 'Use the AWS CLI targeting the custom S3 endpoint URL to list accessible buckets without valid cloud credentials.',
        commandOrAction: 'aws --endpoint-url http://s3.bucket.htb s3 ls'
      },
      {
        step: 3,
        title: 'Upload Web Shell into Synchronized Web Bucket',
        instruction: 'Notice the `adserver` S3 bucket mirrors the web server document root. Upload a lightweight PHP reverse shell into the bucket.',
        commandOrAction: 'aws --endpoint-url http://s3.bucket.htb s3 cp shell.php s3://adserver/'
      },
      {
        step: 4,
        title: 'Trigger Shell & Pivot to DynamoDB for Root Flag',
        instruction: 'Trigger the reverse shell via browser, inspect local DynamoDB tables containing system administrator passwords, and obtain the root flag.',
        commandOrAction: 'curl http://bucket.htb/shell.php && aws --endpoint-url http://s3.bucket.htb dynamodb list-tables'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Interacting with custom cloud endpoints via AWS CLI',
        'Attacking cloud storage buckets serving web assets',
        'DynamoDB NoSQL enumeration for stored credentials',
        'Local privilege escalation stemming from internal cloud services'
      ],
      interviewTalkingPoint: 'I demonstrated on HackTheBox Bucket how an S3 bucket synchronized with a web server document root turns write access into immediate Remote Code Execution, reinforcing the need for strict bucket read-only policies.'
    }
  },
  {
    id: 'htb-included',
    category: 'hackthebox',
    roleTitle: 'Cloud Container & LocalStack Lab',
    labTitle: 'HackTheBox: Included (TFTP, LocalStack & Container Escapes)',
    originalLink: 'https://app.hackthebox.com/machines/Included',
    platform: 'HackTheBox (Linux / Easy)',
    difficulty: 'Easy',
    estimatedTime: '45 mins',
    badgeTone: 'emerald',
    targetServices: ['TFTP Protocol', 'LocalStack S3', 'Docker Container Escapes', 'Linux Capabilities'],
    roleRampUpGuide: {
      summary: 'Demonstrates legacy protocol infiltration (TFTP) leading to an internal Dockerized LocalStack instance, showing how container capabilities can be leveraged to escape to root.',
      dayInLife: 'Securing legacy protocols, container hardening, and preventing development cloud tools from exposing production hosts.',
      keyCertifications: ['HTB Certified Penetration Testing Specialist', 'CompTIA PenTest+'],
      salaryRange: '$110,000 - $160,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Scan UDP Ports & Discover TFTP Service',
        instruction: 'Execute UDP reconnaissance to discover open port 69 (TFTP). Connect to the TFTP service and download internal deployment files.',
        commandOrAction: 'tftp 10.10.10.222 -c get /var/lib/tftpboot/config.php'
      },
      {
        step: 2,
        title: 'Extract Hidden LocalStack Credentials',
        instruction: 'Read the retrieved configuration file to uncover hardcoded access keys and endpoint URLs for an internal LocalStack instance.',
        commandOrAction: 'grep -E "(AWS_|SECRET_)" config.php'
      },
      {
        step: 3,
        title: 'Enumerate Local Cloud Storage',
        instruction: 'Query the internal S3 buckets using the discovered credentials to extract internal SSH private keys and administrative scripts.',
        commandOrAction: 'aws --endpoint-url http://localhost:4566 s3 ls s3://dev-backups/'
      },
      {
        step: 4,
        title: 'Exploit Docker Group Permissions for Root Flag',
        instruction: 'Leverage the compromised user group membership in the `docker` group to spawn a privileged container mounted to the host root filesystem.',
        commandOrAction: 'docker run -v /:/host -it alpine chroot /host /bin/bash'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'UDP service reconnaissance and TFTP credential exfiltration',
        'Auditing containerized LocalStack instances',
        'Docker socket and group permission risks (equivalent to root access)',
        'Container volume mount host isolation escapes'
      ],
      interviewTalkingPoint: 'Giving developers membership in the host Docker group is equivalent to granting passwordless root access; I enforce rootless containers and strict socket access controls.'
    }
  },
  {
    id: 'htb-cyclops',
    category: 'hackthebox',
    roleTitle: 'Serverless Cloud Security',
    labTitle: 'HackTheBox: Cyclops (Serverless Lambda Exploitation)',
    originalLink: 'https://app.hackthebox.com/machines/Cyclops',
    platform: 'HackTheBox (Linux / Hard)',
    difficulty: 'Hard',
    estimatedTime: '120 mins',
    badgeTone: 'emerald',
    targetServices: ['AWS Lambda', 'API Gateway', 'Serverless Environment Variables', 'IAM Role Hijacking'],
    roleRampUpGuide: {
      summary: 'Advanced serverless attack simulation: exploiting an injection vulnerability in a Lambda function runtime, extracting temporary execution tokens from environment variables, and pivoting across cloud accounts.',
      dayInLife: 'Auditing serverless functions for runtime code injection, securing Lambda environment variables with KMS envelope encryption, and IAM execution role scoping.',
      keyCertifications: ['HTB Pro Labs', 'GCSA'],
      salaryRange: '$150,000 - $210,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Reconnoiter Serverless REST API Gateway',
        instruction: 'Map out the serverless API Gateway endpoints and identify parameter handling vulnerabilities in the image processing microservice.',
        commandOrAction: 'ffuf -u http://cyclops.htb/api/v1/FUZZ -w api-endpoints.txt'
      },
      {
        step: 2,
        title: 'Execute Command Injection in Serverless Runtime',
        instruction: 'Inject arbitrary shell commands into the input parameter to break out of the Python script execution context inside the `/var/task` directory.',
        commandOrAction: 'curl -X POST http://cyclops.htb/api/v1/render -d "filename=test.png;env"'
      },
      {
        step: 3,
        title: 'Harvest AWS_SESSION_TOKEN & Temporary Credentials',
        instruction: 'Exfiltrate AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SESSION_TOKEN from the runtime memory environment.',
        commandOrAction: 'curl -X POST http://cyclops.htb/api/v1/render -d "filename=;printenv"'
      },
      {
        step: 4,
        title: 'Enumerate Lambda Execution Role Permissions & Capture Flag',
        instruction: 'Use the stolen execution role credentials to discover overly permissive SQS queues and S3 buckets containing administrative flags.',
        commandOrAction: 'aws sqs list-queues && aws s3 sync s3://cyclops-vault-flag ./'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Serverless execution environment architecture and ephemeral container lifecycle',
        'Runtime environment variable credential harvesting',
        'Scoping Lambda execution roles to single resource ARNs',
        'Mitigating command injection in serverless event handlers'
      ],
      interviewTalkingPoint: 'Serverless architectures are not inherently secure: an injection flaw in a Lambda function immediately compromises its execution role tokens, which is why Lambda IAM policies must strictly adhere to least privilege.'
    }
  },
  {
    id: 'htb-cloud-track',
    category: 'hackthebox',
    roleTitle: 'Full Cloud Security Specialist Track',
    labTitle: 'HackTheBox: Official Cloud Security Skill Track',
    originalLink: 'https://app.hackthebox.com/tracks/Cloud-Security',
    platform: 'HackTheBox Tracks',
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '20+ hours',
    badgeTone: 'emerald',
    targetServices: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Cloud Threat Modeling'],
    roleRampUpGuide: {
      summary: 'The comprehensive HackTheBox structured syllabus covering the modern cloud penetration testing and defensive engineering discipline across major hyperscalers.',
      dayInLife: 'Working as a Senior Cloud Security Consultant, performing offensive cloud readiness audits, and guiding engineering teams on security architecture remediation.',
      keyCertifications: ['HTB Certified Cloud Penetration Tester (CWEE)', 'GIAC Cloud Penetration Tester (GCPN)'],
      salaryRange: '$145,000 - $215,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Complete Cloud Identity & IAM Attack Modules',
        instruction: 'Work through modules detailing cloud credential theft, role chaining, trust abuse, and SAML/OIDC federated authentication attacks.',
        commandOrAction: 'Follow module walkthroughs on app.hackthebox.com/tracks/Cloud-Security'
      },
      {
        step: 2,
        title: 'Execute Cloud Storage & Database Exploitation',
        instruction: 'Solve challenge scenarios involving S3 access control lists, DynamoDB injection, and Azure Blob storage misconfigurations.',
        commandOrAction: 'Submit completion flags on storage challenges.'
      },
      {
        step: 3,
        title: 'Perform Kubernetes & Container Cluster Auditing',
        instruction: 'Attack misconfigured Kubernetes API servers, enumerate etcd secrets, and break out of unprivileged pods.',
        commandOrAction: 'kubectl auth can-i --list'
      },
      {
        step: 4,
        title: 'Final Capstone Assessment & Certificate Verification',
        instruction: 'Complete the final purple-team capstone room, submit the proof-of-concept report, and obtain your certified credential.',
        commandOrAction: 'Export official completion certificate.'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'End-to-end cloud infrastructure penetration testing methodology',
        'Attacking and defending multi-cloud compute, identity, and storage services',
        'Kubernetes cluster security and container isolation auditing',
        'Authoring professional executive cloud security assessment reports'
      ],
      interviewTalkingPoint: 'Completing the HackTheBox Cloud Track equipped me with an offensive mindset that allows me to anticipate attacker lateral movement paths and build robust, defense-in-depth AWS architectures.'
    }
  },

  // =========================================================================
  // 4. FOUNDATIONS: LINUX FOR CLOUD SECURITY
  // =========================================================================
  {
    id: 'linux-bandit',
    category: 'linux',
    roleTitle: 'Core Systems Foundation',
    labTitle: 'OverTheWire: Bandit (Linux Privilege, File & Shell Mastery)',
    originalLink: 'https://overthewire.org/wargames/bandit/',
    platform: 'OverTheWire Wargames',
    difficulty: 'Beginner to Intermediate',
    estimatedTime: '2-3 hours',
    badgeTone: 'amber',
    targetServices: ['Linux Shell', 'File Permissions & SUID', 'SSH Keys', 'Cron & Systemd', 'Base64 & Hex'],
    roleRampUpGuide: {
      summary: 'OverTheWire Bandit is the universal standard for learning practical Linux command-line mastery, file permissions, text manipulation, and security-relevant shell concepts.',
      dayInLife: 'Navigating cloud Linux servers (Amazon Linux 2023, Ubuntu Server), inspecting system processes, and auditing user permission vectors.',
      keyCertifications: ['Linux Professional Institute LPIC-1', 'Red Hat Certified System Administrator (RHCSA)'],
      salaryRange: 'Fundamental Core Skill'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Connect via Secure Shell (SSH)',
        instruction: 'Open your terminal and establish an encrypted SSH session to the Bandit game server on port 2220 with user `bandit0`.',
        commandOrAction: 'ssh bandit0@bandit.labs.overthewire.org -p 2220'
      },
      {
        step: 2,
        title: 'Inspect Hidden Files & Decrypt Password Tokens',
        instruction: 'Master `ls -la`, `cat`, `grep`, `file`, and `tr` to find hidden files, decode base64 hashes, and handle files with spaces or leading dashes.',
        commandOrAction: 'cat ./-filename | base64 -d'
      },
      {
        step: 3,
        title: 'Hunt for SUID Executables & Cron Jobs',
        instruction: 'Progress to levels 15-20: learn to locate executables with the SUID bit set, inspect scheduled cron jobs in `/etc/cron.d/`, and read restricted files.',
        commandOrAction: 'find / -perm -4000 -type f 2>/dev/null'
      },
      {
        step: 4,
        title: 'Complete Level 25 & Record Key Learnings',
        instruction: 'Use SSH private keys, set up local port forwarding, and defeat shell break-outs to obtain mastery of Linux fundamentals.',
        commandOrAction: 'ssh -i bandit14.key bandit14@localhost -p 2220'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Fluent Linux command line operations and pipeline chaining',
        'Understanding UNIX file permissions (rwx, octal notation, SUID/SGID)',
        'SSH public/private key authentication and configuration',
        'Text processing and regex manipulation with grep, awk, and sed'
      ],
      interviewTalkingPoint: 'Since over 90% of cloud workloads run on Linux, my Bandit foundational practice ensures I can troubleshoot, audit, and secure production EC2 instances and containers at the kernel and shell level.'
    }
  },
  {
    id: 'linux-auditd',
    category: 'linux',
    roleTitle: 'Host Security & Auditing',
    labTitle: 'Linux Hardening, Auditd Daemon & File Integrity Monitoring',
    originalLink: 'https://sadservers.com/',
    platform: 'SadServers / Linux Journey',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    badgeTone: 'amber',
    targetServices: ['auditd', 'ausearch / aureport', '/etc/shadow', 'SSH Hardening', 'iptables'],
    roleRampUpGuide: {
      summary: 'Learn how to transform a generic Linux server into a hardened, CIS-compliant bastion host with continuous kernel audit logging and immutable file protection.',
      dayInLife: 'Reviewing host-level audit logs, configuring SSH security policies, locking down root access, and tuning system firewall rules.',
      keyCertifications: ['CIS Linux Benchmark Auditing', 'CompTIA Linux+'],
      salaryRange: '$115,000 - $165,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Harden SSH Daemon Configuration',
        instruction: 'Edit `/etc/ssh/sshd_config` to disable root login, enforce SSH Protocol 2, disable password authentication, and limit max authentication attempts.',
        commandOrAction: 'echo -e "PermitRootLogin no\\nPasswordAuthentication no\\nMaxAuthTries 3" | sudo tee -a /etc/ssh/sshd_config.d/security.conf && sudo systemctl restart sshd'
      },
      {
        step: 2,
        title: 'Install and Configure Linux Audit Framework (auditd)',
        instruction: 'Configure `/etc/audit/rules.d/audit.rules` to monitor critical system files (`/etc/passwd`, `/etc/shadow`, `/etc/sudoers`) for unauthorized write attempts.',
        commandOrAction: 'echo "-w /etc/shadow -p wa -k identity_tampering" | sudo tee -a /etc/audit/rules.d/audit.rules && sudo augenrules --load'
      },
      {
        step: 3,
        title: 'Simulate Identity Tampering & Search Audit Trail',
        instruction: 'Attempt an unauthorized touch on `/etc/shadow` and use `ausearch` to extract the process ID, user ID, and command that triggered the rule.',
        commandOrAction: 'sudo ausearch -k identity_tampering --format text'
      },
      {
        step: 4,
        title: 'Generate Audit Compliance Summary Report',
        instruction: 'Use `aureport` to summarize system authentication failures, executable modifications, and privilege escalation events.',
        commandOrAction: 'sudo aureport --auth --failed --summary'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Kernel-level host auditing using auditd and augenrules',
        'Defending critical identity files from rootkit modification',
        'Production SSH server hardening according to CIS benchmarks',
        'Extracting forensic evidence from Linux system journals'
      ],
      interviewTalkingPoint: 'I implement CIS Level 2 hardening on all base Linux AMIs, including mandatory auditd rules tracking `/etc/shadow` modifications, ensuring zero blind spots on cloud host operating systems.'
    }
  },

  // =========================================================================
  // 5. FOUNDATIONS: PYTHON FOR CLOUD SECURITY AUTOMATION
  // =========================================================================
  {
    id: 'python-boto3',
    category: 'python',
    roleTitle: 'Security Automation Engineering',
    labTitle: 'Boto3 AWS Security Automation: Automated Public S3 Remediation',
    originalLink: 'https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html',
    platform: 'Official Boto3 Documentation & Tutorial',
    difficulty: 'Beginner to Intermediate',
    estimatedTime: '45 mins',
    badgeTone: 'cyan',
    targetServices: ['Python 3', 'Boto3 SDK', 'Amazon S3', 'Public Access Block API'],
    roleRampUpGuide: {
      summary: 'Python is the lingua franca of Cloud Security Automation. Learn to build event-driven scripts that query AWS APIs, detect misconfigurations, and remediate them programmatically.',
      dayInLife: 'Writing Lambda remediation functions, automating vulnerability scans across accounts, and parsing large JSON CloudTrail logs.',
      keyCertifications: ['AWS Certified Developer - Associate', 'Python Institute PCAP'],
      salaryRange: '$125,000 - $175,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Initialize Virtual Environment & Install Boto3',
        instruction: 'Set up an isolated Python environment and install the official AWS SDK for Python (Boto3).',
        commandOrAction: 'python -m venv venv && source venv/bin/activate && pip install boto3'
      },
      {
        step: 2,
        title: 'Write Bucket Auditor Script',
        instruction: 'Create a script that lists all S3 buckets and queries `get_public_access_block` to verify whether Block Public Access is strictly enabled.',
        commandOrAction: 'python -c "import boto3; s3 = boto3.client(\'s3\'); print([b[\'Name\'] for b in s3.list_buckets()[\'Buckets\']])"'
      },
      {
        step: 3,
        title: 'Implement Automated Remediation Function',
        instruction: 'Add logic that automatically applies `put_public_access_block` with all four block settings set to True whenever an open bucket is detected.',
        commandOrAction: 's3.put_public_access_block(Bucket=bucket_name, PublicAccessBlockConfiguration={\'BlockPublicAcls\': True, \'IgnorePublicAcls\': True, \'BlockPublicPolicy\': True, \'RestrictPublicBuckets\': True})'
      },
      {
        step: 4,
        title: 'Execute Script and Verify Immediate Compliance',
        instruction: 'Run your Python script against a test bucket and verify the AWS Console reflects the change to "Bucket and objects not public".',
        commandOrAction: 'python audit_and_remediate_s3.py'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Interacting with AWS cloud APIs using Python and Boto3',
        'Handling pagination, exceptions, and API throttling with botocore',
        'Automated preventative security policy enforcement in code',
        'Creating modular reusable security automation scripts'
      ],
      interviewTalkingPoint: 'I write Python Boto3 automation scripts that proactively audit cloud assets and auto-remediate non-compliant resources in real time, preventing configuration drift.'
    }
  },
  {
    id: 'python-bandit',
    category: 'python',
    roleTitle: 'Application Security & Linting',
    labTitle: 'Bandit: Static Application Security Testing (SAST) for Python',
    originalLink: 'https://github.com/PyCQA/bandit',
    platform: 'PyCQA Open Source Tools',
    difficulty: 'Easy',
    estimatedTime: '30 mins',
    badgeTone: 'cyan',
    targetServices: ['Bandit SAST', 'Python AST', 'Pre-Commit Hooks', 'Secret Detection'],
    roleRampUpGuide: {
      summary: 'Learn how to detect security flaws in Python code (hardcoded passwords, SQL injection, insecure deserialization, weak random generators) before deploying to production.',
      dayInLife: 'Reviewing developer code, configuring SAST scanners in CI/CD pipelines, and writing custom security checks for Python microservices.',
      keyCertifications: ['Certified Secure Software Lifecycle Professional (CSSLP)', 'DevSecOps Certified'],
      salaryRange: '$120,000 - $170,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Install Bandit Security Scanner',
        instruction: 'Install Bandit via pip and inspect the available security scanning profiles.',
        commandOrAction: 'pip install bandit && bandit --version'
      },
      {
        step: 2,
        title: 'Scan Codebase for High-Severity Flaws',
        instruction: 'Execute Bandit recursively against a repository with filters set to output medium and high-severity issues in JSON format.',
        commandOrAction: 'bandit -r ./src -ll -ii -f json -o bandit-report.json'
      },
      {
        step: 3,
        title: 'Analyze and Remediate Identified Findings',
        instruction: 'Locate findings such as `B105: hardcoded_password_string` or `B303: md5` and replace them with secure alternatives (AWS Secrets Manager and SHA-256).',
        commandOrAction: 'Review bandit-report.json and replace hashlib.md5() with hashlib.sha256()'
      },
      {
        step: 4,
        title: 'Configure Automated Git Pre-Commit Hook',
        instruction: 'Set up `.pre-commit-config.yaml` to ensure every developer commit is automatically validated by Bandit before push.',
        commandOrAction: 'pre-commit run --all-files'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Static Application Security Testing (SAST) methodology for Python',
        'Identification of common Python vulnerabilities (OWASP Top 10)',
        'Remediation of weak cryptographic primitives and hardcoded credentials',
        'Integrating pre-commit hooks to shift security left into the IDE'
      ],
      interviewTalkingPoint: 'By establishing Bandit SAST scanning in our developer pre-commit hooks, we eliminated hardcoded credentials and unsafe deserialization bugs before code ever reaches our repository.'
    }
  },

  // =========================================================================
  // 6. FOUNDATIONS: CLOUD NETWORKING FOR SECURITY ENGINEERS
  // =========================================================================
  {
    id: 'net-vpc-immersion',
    category: 'networking',
    roleTitle: 'Network Architecture Security',
    labTitle: 'AWS VPC Immersion Day: Subnets, Route Tables & NACLs vs SGs',
    originalLink: 'https://workshops.aws/card/VPC%20Immersion%20Day',
    platform: 'AWS Official Workshops',
    difficulty: 'Intermediate',
    estimatedTime: '75 mins',
    badgeTone: 'purple',
    targetServices: ['Amazon VPC', 'CIDR IPv4 Planning', 'Security Groups (Stateful)', 'Network ACLs (Stateless)', 'Route Tables'],
    roleRampUpGuide: {
      summary: 'Master the fundamental building block of all cloud security: Virtual Private Clouds. Learn CIDR subnet math, route table isolation, and stateful vs stateless traffic filtering.',
      dayInLife: 'Designing multi-tier VPC architectures, troubleshooting blocked security group ports, auditing public IP allocations, and setting up VPC Peering.',
      keyCertifications: ['AWS Certified Advanced Networking - Specialty (ANS-C01)', 'CompTIA Network+'],
      salaryRange: '$130,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Architect 3-Tier Multi-AZ VPC Topology',
        instruction: 'Create an AWS VPC with CIDR `10.0.0.0/16` and design paired Public, Private Application, and Isolated Database subnets across 2 Availability Zones.',
        commandOrAction: 'aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications \'ResourceType=vpc,Tags=[{Key=Name,Value=Prod-Security-VPC}]\''
      },
      {
        step: 2,
        title: 'Configure Tiered Route Tables and NAT Gateways',
        instruction: 'Attach an Internet Gateway to the Public subnets and route Private Application outbound traffic through a managed NAT Gateway.',
        commandOrAction: 'aws ec2 create-route-table --vpc-id vpc-0123456789'
      },
      {
        step: 3,
        title: 'Implement Least-Privilege Security Group Chaining',
        instruction: 'Configure the Database Security Group to only accept port 5432 (PostgreSQL) from the Application Security Group ID, completely disallowing IP-based ingress.',
        commandOrAction: 'aws ec2 authorize-security-group-ingress --group-id sg-database --protocol tcp --port 5432 --source-group sg-application'
      },
      {
        step: 4,
        title: 'Enforce Stateless Network ACL Layer of Defense',
        instruction: 'Configure Subnet Network ACLs to drop known malicious CIDR ranges and verify traffic filtering using VPC Reachability Analyzer.',
        commandOrAction: 'aws ec2 create-network-acl-entry --network-acl-id acl-0123 --ingress --rule-number 100 --protocol tcp --port-range From=22,To=22 --cidr-block 0.0.0.0/0 --rule-action deny'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'CIDR block planning and subnet partitioning (VLSM)',
        'Stateful (Security Group) vs Stateless (NACL) packet evaluation order',
        'Security Group ID chaining to eliminate fragile IP dependencies',
        'Air-gapping database subnets with zero internet route pathways'
      ],
      interviewTalkingPoint: 'I design cloud networks with defense-in-depth: database tiers reside in fully isolated subnets with no internet gateway or NAT route, and access is strictly governed by security group references rather than IP CIDRs.'
    }
  },
  {
    id: 'net-pcap-analysis',
    category: 'networking',
    roleTitle: 'Network Forensics & Packet Analysis',
    labTitle: 'Wireshark Packet Analysis & AWS VPC Flow Log Correlation',
    originalLink: 'https://www.wireshark.org/',
    platform: 'Wireshark & Packet Forensics Labs',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    badgeTone: 'purple',
    targetServices: ['VPC Flow Logs', 'Wireshark', 'PCAP Inspection', 'DNS Tunneling', 'TCP Handshake'],
    roleRampUpGuide: {
      summary: 'Learn to read raw network traffic: decode packet captures in Wireshark, detect suspicious port scans and C2 beaconing, and aggregate AWS VPC Flow Logs to trace threat actor lateral movement.',
      dayInLife: 'Investigating suspected data exfiltration events, analyzing network flow logs in Athena or Splunk, and validating perimeter firewall effectiveness.',
      keyCertifications: ['Wireshark Certified Network Analyst (WCNA)', 'GCIH'],
      salaryRange: '$125,000 - $175,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Enable AWS VPC Flow Logs to CloudWatch',
        instruction: 'Enable VPC Flow Logs with ALL traffic captured (ACCEPT and REJECT) and 1-minute aggregation intervals.',
        commandOrAction: 'aws ec2 create-flow-logs --resource-type VPC --resource-ids vpc-012345 --traffic-type ALL --log-destination-type cloud-watch-logs'
      },
      {
        step: 2,
        title: 'Filter High-Volume REJECT Signals',
        instruction: 'Use CloudWatch Logs Insights to execute a query locating IPs with repeated REJECT packets on port 22 or 3389 (brute force indicator).',
        commandOrAction: 'fields @timestamp, srcAddr, dstAddr, dstPort, action | filter action == "REJECT" and dstPort in [22, 3389] | stats count() by srcAddr'
      },
      {
        step: 3,
        title: 'Inspect Captured PCAP in Wireshark',
        instruction: 'Open sample network capture in Wireshark and apply display filters (`tcp.flags.syn == 1 and tcp.flags.ack == 0`) to detect port scans.',
        commandOrAction: 'wireshark -r investigation-traffic.pcap'
      },
      {
        step: 4,
        title: 'Detect DNS Data Exfiltration Tunneling',
        instruction: 'Filter DNS requests with excessive payload length (`dns.qry.name.len > 50`) and identify base64-encoded data sent to an attacker nameserver.',
        commandOrAction: 'tshark -r investigation-traffic.pcap -Y "dns.flags.response == 0" -T fields -e dns.qry.name'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'VPC Flow Log record structure (srcAddr, dstAddr, bytes, packets, action)',
        'Wireshark display filters and packet stream reconstruction',
        'Detecting reconnaissance port sweeps and brute force attacks',
        'Recognizing covert network communication channels (DNS tunneling, ICMP payloads)'
      ],
      interviewTalkingPoint: 'VPC Flow Logs are essential for forensic truth; by analyzing rejected connections and DNS query lengths, I can confirm whether a vulnerability probe resulted in actual data ingress or egress.'
    }
  },

  // =========================================================================
  // 7. FOUNDATIONS: DOCKER & CONTAINER SECURITY
  // =========================================================================
  {
    id: 'docker-hardening',
    category: 'docker',
    roleTitle: 'Container Security Engineering',
    labTitle: 'Docker Hardening: Rootless Containers & Dropping Linux Capabilities',
    originalLink: 'https://training.play-with-docker.com/security/',
    platform: 'Play with Docker Classroom',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    badgeTone: 'cyan',
    targetServices: ['Docker Engine', 'Linux Capabilities', 'Seccomp Profiles', 'Non-Root Users'],
    roleRampUpGuide: {
      summary: 'Containers do not contain by default. Learn to eliminate the root user in Dockerfiles, drop unnecessary Linux kernel capabilities, and enforce read-only filesystems.',
      dayInLife: 'Authoring secure Dockerfiles, configuring Kubernetes pod security standards, auditing container runtime security, and preventing container escapes.',
      keyCertifications: ['Certified Kubernetes Security Specialist (CKS)', 'Docker Certified Associate (DCA)'],
      salaryRange: '$135,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Audit Default Insecure Container Capabilities',
        instruction: 'Launch a standard Ubuntu container and inspect the default capabilities granted to process UID 0 (root).',
        commandOrAction: 'docker run --rm -it ubuntu grep Cap /proc/1/status'
      },
      {
        step: 2,
        title: 'Enforce Non-Root User in Dockerfile',
        instruction: 'Update Dockerfile to create an unprivileged user (UID 10001) and set `USER 10001` before the ENTRYPOINT.',
        commandOrAction: 'RUN groupadd -g 10001 appuser && useradd -u 10001 -g appuser -s /sbin/nologin appuser\nUSER 10001'
      },
      {
        step: 3,
        title: 'Drop All Capabilities and Run with Read-Only Filesystem',
        instruction: 'Run the container with `--cap-drop=ALL`, only adding required capabilities, and mount the root filesystem as read-only with a temporary `/tmp` volume.',
        commandOrAction: 'docker run --cap-drop=ALL --read-only --tmpfs /tmp -u 10001:10001 -d secure-api:latest'
      },
      {
        step: 4,
        title: 'Test Container Escape Immunity',
        instruction: 'Attempt to execute administrative commands or install packages inside the container. Confirm the Linux kernel refuses state modification.',
        commandOrAction: 'docker exec -it <container_id> touch /bin/malicious_binary'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Principle of least privilege applied to Linux kernel capabilities',
        'Immutable, read-only container root filesystems',
        'Eliminating root user execution inside containers',
        'Preventing container breakout and host kernel privilege escalation'
      ],
      interviewTalkingPoint: 'Running containers as root is a major anti-pattern; I enforce non-root user execution, `--cap-drop=ALL`, and read-only filesystems across our container workloads.'
    }
  },
  {
    id: 'docker-trivy-scan',
    category: 'docker',
    roleTitle: 'Software Supply Chain Security',
    labTitle: 'Trivy Container Vulnerability Scanning & Distroless Base Images',
    originalLink: 'https://aquasecurity.github.io/trivy/',
    platform: 'Aqua Security Open Source Labs',
    difficulty: 'Easy to Intermediate',
    estimatedTime: '40 mins',
    badgeTone: 'cyan',
    targetServices: ['Trivy Scanner', 'CVE Scanning', 'Google Distroless', 'Alpine Linux', 'CI/CD Pipeline'],
    roleRampUpGuide: {
      summary: 'Learn how to detect known CVEs in container base images, OS packages, and language dependencies using Trivy, and migrate bloated images to secure Distroless alternatives.',
      dayInLife: 'Auditing container registries, setting CVE severity thresholds in deployment pipelines, and managing software bills of materials (SBOMs).',
      keyCertifications: ['CKS', 'Docker Security Specialist'],
      salaryRange: '$130,000 - $180,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Install and Initialize Trivy Scanner',
        instruction: 'Install Trivy CLI and download the latest CVE vulnerability database cache.',
        commandOrAction: 'curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin'
      },
      {
        step: 2,
        title: 'Scan Insecure Base Image for Vulnerabilities',
        instruction: 'Execute a scan against an older Node.js or Python image to observe dozens of critical CVEs in outdated system libraries.',
        commandOrAction: 'trivy image --severity HIGH,CRITICAL node:14-buster'
      },
      {
        step: 3,
        title: 'Refactor to Multi-Stage Build with Google Distroless',
        instruction: 'Refactor the Dockerfile into a multi-stage build that compiles code in a build container, then copies only the binary into `gcr.io/distroless/static-debian12`.',
        commandOrAction: 'FROM golang:1.22 as builder ...\nFROM gcr.io/distroless/static-debian12\nCOPY --from=builder /app/server /'
      },
      {
        step: 4,
        title: 'Re-scan and Enforce Zero Critical Threshold',
        instruction: 'Re-scan the Distroless container image. Confirm vulnerability count drops to 0 and configure pipeline exit code 1 on any critical CVE.',
        commandOrAction: 'trivy image --exit-code 1 --severity CRITICAL my-distroless-app:latest'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Static container image vulnerability scanning with Trivy',
        'Multi-stage Docker build architecture',
        'Distroless minimal container philosophy (removing package managers, bash, curl)',
        'Automated CI/CD vulnerability breaking thresholds'
      ],
      interviewTalkingPoint: 'By migrating our microservices to multi-stage Distroless containers, we reduced our image attack surface by 90% and eliminated OS-level utilities like curl and bash that attackers rely on after code execution.'
    }
  },

  // =========================================================================
  // 8. FOUNDATIONS: INFRASTRUCTURE AS CODE (TERRAFORM) FOR SECURITY
  // =========================================================================
  {
    id: 'iac-terraform-hardening',
    category: 'iac',
    roleTitle: 'Infrastructure as Code Security',
    labTitle: 'Terraform State File Security, Remote Encryption & Locking',
    originalLink: 'https://developer.hashicorp.com/terraform/tutorials',
    platform: 'HashiCorp Official Tutorials',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    badgeTone: 'emerald',
    targetServices: ['HashiCorp Terraform', 'Terraform Remote State', 'Amazon S3', 'Amazon DynamoDB', 'AWS KMS'],
    roleRampUpGuide: {
      summary: 'Terraform state files contain plaintext database passwords, private keys, and sensitive resource configurations. Learn how to secure the state backend with KMS encryption, S3 versioning, and DynamoDB locks.',
      dayInLife: 'Reviewing Terraform pull requests, authoring reusable hardened modules, managing multi-environment state backends, and ensuring secret hygiene.',
      keyCertifications: ['HashiCorp Certified: Terraform Associate', 'AWS Certified DevOps Engineer - Professional'],
      salaryRange: '$130,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Provision Hardened S3 State Storage Bucket',
        instruction: 'Create an S3 bucket configured with default AWS KMS customer-managed key encryption, bucket versioning enabled, and Block Public Access enforced.',
        commandOrAction: 'aws s3api create-bucket --bucket prod-terraform-state-vault-12345 --region us-east-1'
      },
      {
        step: 2,
        title: 'Provision DynamoDB State Locking Table',
        instruction: 'Create an Amazon DynamoDB table with partition key `LockID` (String) to prevent concurrent executions from corrupting infrastructure state.',
        commandOrAction: 'aws dynamodb create-table --table-name terraform-locks --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --billing-mode PAY_PER_REQUEST'
      },
      {
        step: 3,
        title: 'Configure Secure Backend in Terraform Code',
        instruction: 'Declare the backend configuration block in `main.tf` referencing the encrypted bucket, DynamoDB lock table, and `encrypt = true`.',
        commandOrAction: 'terraform {\n  backend "s3" {\n    bucket = "prod-terraform-state-vault-12345"\n    key    = "production/terraform.tfstate"\n    region = "us-east-1"\n    dynamodb_table = "terraform-locks"\n    encrypt = true\n  }\n}'
      },
      {
        step: 4,
        title: 'Initialize and Migrate State to Encrypted Vault',
        instruction: 'Run `terraform init` to migrate existing local state to the encrypted remote S3 vault, ensuring no local `.tfstate` files remain on disk.',
        commandOrAction: 'terraform init -migrate-state'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Securing sensitive plaintext credentials within Terraform state',
        'Preventing state corruption through DynamoDB distributed locking',
        'KMS customer-managed key encryption for compliance audits',
        'State file disaster recovery via S3 versioning'
      ],
      interviewTalkingPoint: 'Terraform state is a prime target for attackers seeking hardcoded secrets; I ensure 100% of our state files are encrypted at rest with customer-managed KMS keys, locked with DynamoDB, and protected by strict bucket policies.'
    }
  },
  {
    id: 'iac-terragoat-checkov',
    category: 'iac',
    roleTitle: 'Policy-as-Code & IaC Auditing',
    labTitle: 'TerraGoat: Hunting & Remediating Vulnerable Terraform Modules',
    originalLink: 'https://github.com/bridgecrewio/terragoat',
    platform: 'Bridgecrew / Palo Alto Networks TerraGoat',
    difficulty: 'Intermediate',
    estimatedTime: '60 mins',
    badgeTone: 'emerald',
    targetServices: ['TerraGoat', 'Checkov', 'Policy-as-Code', 'AWS IAM Misconfigurations', 'S3 Security'],
    roleRampUpGuide: {
      summary: 'Practice hunting and fixing over 40 intentional cloud misconfigurations in TerraGoat, the premier "Vulnerable by Design" Infrastructure as Code repository.',
      dayInLife: 'Running automated IaC posture scans, defining custom organizational Checkov policies, and coaching developers on secure infrastructure code.',
      keyCertifications: ['Checkov Certified Administrator', 'DevSecOps Specialist'],
      salaryRange: '$135,000 - $185,000'
    },
    stepsToComplete: [
      {
        step: 1,
        title: 'Clone TerraGoat Vulnerable Repository',
        instruction: 'Clone the TerraGoat repository containing insecure AWS infrastructure definitions.',
        commandOrAction: 'git clone https://github.com/bridgecrewio/terragoat.git && cd terragoat'
      },
      {
        step: 2,
        title: 'Execute Initial Checkov Security Audit',
        instruction: 'Run Checkov against the `terraform/aws` directory and analyze the summary breakdown of failed checks.',
        commandOrAction: 'checkov -d ./terraform/aws --framework terraform'
      },
      {
        step: 3,
        title: 'Remediate S3 and IAM Violations in Code',
        instruction: 'Fix `CKV_AWS_18` (S3 bucket access logging), `CKV_AWS_19` (S3 encryption), and `CKV_AWS_20` (S3 public read ACL) by adding necessary security arguments.',
        commandOrAction: 'Update s3.tf to enforce aws_s3_bucket_server_side_encryption_configuration'
      },
      {
        step: 4,
        title: 'Verify 100% Passing Checkov Status',
        instruction: 'Re-run Checkov scan and confirm the targeted modules now pass compliance checks without any suppressions.',
        commandOrAction: 'checkov -d ./terraform/aws/s3.tf'
      }
    ],
    whatYouHaveLearnt: {
      coreCompetencies: [
        'Hunting security anti-patterns in Infrastructure as Code',
        'Translating CIS Benchmarks into concrete Terraform block arguments',
        'Authoring policy-as-code guardrails for automated CI enforcement',
        'Remediating compound cloud misconfigurations at the source of truth'
      ],
      interviewTalkingPoint: 'Rather than fighting misconfigurations reactively in the cloud console, I use Checkov and TerraGoat principles to ensure security policies are codified and enforced directly in Terraform prior to deployment.'
    }
  }
]
