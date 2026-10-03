// Path 8: Career Preparation
export const careerPath = {
  id: 'career',
  title: 'Career Preparation & Industry Readiness',
  shortTitle: 'Career Preparation',
  icon: 'Briefcase',
  accentColor: '#4ade80',
  badge: 'Domain 08',
  level: 'All Levels',
  estimatedTime: '2 hrs 35 mins',
  description: 'Bridge the gap between theoretical knowledge and real-world employment. Master cloud security job roles, SOC analyst daily operations, senior engineering automation, resume crafting that passes ATS, technical interview whiteboarding, and accelerating your first 90 days on the job.',
  whyItMatters: 'Certifications prove you can memorize definitions; hiring managers hire people who demonstrate technical judgment, calm incident triage under pressure, and the ability to articulate trade-offs in an architecture review.',
  topics: [
    {
      id: 'career-roles',
      title: 'Cloud Security Roles & Industry Landscape',
      pathId: 'career',
      level: 'Beginner',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Role Taxonomy',
      summary: 'Navigate the cloud security job market. Compare Cloud Security Analyst, Cloud Security Engineer, Cloud Incident Responder, Cloud Architect, and DevSecOps Specialist.',
      overview: `The cloud security industry offers diverse specializations. Understanding how these roles differ allows you to tailor your learning, projects, and interview preparation effectively.

**The 5 Primary Cloud Security Career Archetypes**:
1. **Cloud Security Analyst (SOC Tier 1 / Tier 2)**:
   - Primary Focus: Real-time monitoring, alert triage, incident detection, and preliminary containment.
   - Day-to-Day: Investigating GuardDuty alerts, querying CloudWatch and CloudTrail, assessing phishing/credential anomalies, and following standard incident playbooks.
   - Ideal Entry Point: Entry-level to mid-level professionals transitioning from IT helpdesk, sysadmin, or general cybersecurity.
2. **Cloud Security Engineer**:
   - Primary Focus: Building, automating, and maintaining defensive security systems and guardrails.
   - Day-to-Day: Writing Terraform/CloudFormation templates, developing Python/Boto3 automation scripts, deploying AWS Config conformance packs, configuring SCPs, and hardening IAM policies.
   - Profile: Highly technical builder with scripting and cloud infrastructure depth.
3. **Cloud Incident Responder / Forensics Specialist (SecOps / DFIR)**:
   - Primary Focus: Live breach containment, root-cause forensic reconstruction, and adversary eradication.
   - Day-to-Day: Forensic EBS disk imaging, memory analysis, Athena SQL hunting, and leading post-mortem reviews.
4. **DevSecOps Engineer / Cloud AppSec**:
   - Primary Focus: Securing CI/CD pipelines, container registries (ECR), and application code before deployment.
   - Day-to-Day: Integrating Checkov, tfsec, and Semgrep into GitHub Actions, managing OIDC federation, and remediating software supply-chain CVEs.
5. **Cloud Security Architect**:
   - Primary Focus: High-level system design, multi-account governance (AWS Control Tower), threat modeling, and executive risk advisory.`,
      whyItMatters: 'Applying to a Cloud Security Engineer role with only Tier 1 analyst skills leads to rejection. Understanding the exact competencies required for each role ensures your resume and interview stories align with what hiring managers are evaluating.',
      securityRisks: [
        'Attempting to learn every tool simultaneously without developing deep mastery of core fundamentals (IAM, Networking, Linux).',
        'Focusing 100% on passing multiple choice certification exams without building hands-on portfolio artifacts.',
        'Not knowing which role aligns with your background, leading to unfocused job applications.',
        'Neglecting software engineering and automation skills (Python/Terraform), which limits career growth.'
      ],
      bestPractices: [
        'Decide on your target role (Analyst vs. Engineer vs. DevSecOps) and tailor your portfolio projects accordingly.',
        'Build public proof-of-work: publish clean, well-documented Terraform repositories on GitHub.',
        'Master the AWS CLI and Python (Boto3) — automation is the primary differentiator between an analyst and an engineer.',
        'Practice articulating technical trade-offs: security vs. performance vs. operational cost.'
      ],
      keyTakeaways: [
        'Cloud Security Analyst triages and responds to live alerts; Cloud Security Engineer designs and automates guardrails.',
        'DevSecOps secures CI/CD pipelines and code; Cloud Architect designs multi-account landing zones.',
        'Python scripting and Terraform Infrastructure as Code are essential skills across all roles.',
        'Portfolio projects demonstrating real-world problem solving outweigh passive video watching.'
      ],
      realWorldScenario: {
        title: 'The Portfolio Project That Secured the Offer',
        incident: 'A candidate transitioning from general IT applied for a Cloud Security Engineer role. While competing candidates had 3 AWS certifications but no code samples, this candidate presented a public GitHub repository deploying an automated GuardDuty-to-Slack alerting pipeline via Terraform, complete with Athena forensic queries and architecture diagrams. During the technical interview, the hiring team spent 40 minutes discussing the candidate\'s code and design choices, resulting in an offer 20% above the target salary.',
        impact: 'Tangible proof-of-work completely outcompeted passive certification resumes.',
        detectionMethod: 'Hiring manager identified practical hands-on capability directly from code artifacts.'
      },
      commonBeginnerMistakes: [
        'Collecting 5+ AWS certifications without writing a single line of Terraform or Python code.',
        'Using generic resume bullets like "Responsible for monitoring cloud security" without quantifying impact.',
        'Applying to Senior Security Architect positions as a junior candidate.',
        'Not learning the fundamentals of Git, version control, and GitHub workflows.'
      ],
      whatACloudSecEngineerChecks: [
        'Verify your public GitHub profile has clean, documented Infrastructure as Code repositories.',
        'Review job descriptions for your target role and list the top 5 recurring technical requirements.',
        'Test your ability to explain an AWS architecture diagram fluently without notes.',
        'Ensure you can write basic Python Boto3 scripts to automate AWS administrative tasks.'
      ],
      codeSnippet: {
        language: 'python',
        title: 'Python (Boto3): Core Competency Script to Audit Inactive IAM Keys Across Accounts',
        code: `import boto3
from datetime import datetime, timezone

def audit_stale_access_keys(max_age_days=90):
    iam = boto3.client('iam')
    users = iam.list_users()['Users']
    now = datetime.now(timezone.utc)
    
    print(f"{'User':<25} {'AccessKeyID':<22} {'Age (Days)':<12} {'Status'}")
    print("-" * 70)
    
    for user in users:
        keys = iam.list_access_keys(UserName=user['UserName'])['AccessKeyMetadata']
        for key in keys:
            age_days = (now - key['CreateDate']).days
            if age_days > max_age_days and key['Status'] == 'Active':
                print(f"{user['UserName']:<25} {key['AccessKeyId']:<22} {age_days:<12} NON-COMPLIANT")

if __name__ == '__main__':
    audit_stale_access_keys()`
      },
      interviewQuestions: [
        {
          question: 'What is the practical difference between a Cloud Security Analyst and a Cloud Security Engineer?',
          interviewerRationale: 'Evaluates role self-awareness, industry understanding, and career trajectory.',
          modelAnswer: 'A Cloud Security Analyst focuses primarily on operational detection, triage, and response: monitoring SIEMs and GuardDuty, investigating alert signals, validating indicators of compromise, and following standard incident playbooks. A Cloud Security Engineer focuses on systemic design, hardening, and automation: writing Infrastructure as Code (Terraform), engineering preventative guardrails (SCPs and Config rules), developing automated incident response Lambda functions, and conducting architectural threat models to prevent incidents before they ever reach the analyst\'s queue.'
        },
        {
          question: 'Which programming language and automation tools are most critical for an aspiring Cloud Security Engineer to master?',
          interviewerRationale: 'Tests technical alignment with modern industry engineering standards.',
          modelAnswer: 'Python (paired with the AWS Boto3 SDK) is the primary programming language for cloud security automation, custom log parsing, and Lambda response runbooks. For Infrastructure as Code, Terraform (HCL) is the dominant enterprise standard across multi-cloud and AWS environments, followed by AWS CloudFormation and the AWS Cloud Development Kit (CDK). Proficiency with Git, Linux shell scripting (Bash), and CI/CD tools (GitHub Actions) completes the core engineering toolkit.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Training & Certification Skills Hub: Cloud Security Career Paths',
          url: 'https://aws.amazon.com/training/skills/',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Certified Security - Specialty Exam Guide and Blueprint',
          url: 'https://aws.amazon.com/certification/certified-security-specialty/',
          type: 'Documentation'
        },
        {
          title: 'SANS Cloud Security Curriculum & Career Roadmap',
          url: 'https://www.sans.org/cloud-security/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Which of the following activities is primarily the responsibility of a Cloud Security Engineer rather than a Tier 1 Cloud Security Analyst?',
        options: [
          { id: 'a', text: 'Triaging an incoming Phishing email ticket.', isCorrect: false, explanation: 'Ticket triage is typically a Tier 1 analyst task.' },
          { id: 'b', text: 'Designing a Terraform module that deploys multi-account AWS Organizations SCPs and automated GuardDuty detectors.', isCorrect: true, explanation: 'Correct! Designing automated guardrails and Infrastructure as Code is core security engineering work.' },
          { id: 'c', text: 'Checking if a user is online in Slack.', isCorrect: false, explanation: 'Basic communication is routine coordination.' },
          { id: 'd', text: 'Resetting a user\'s forgotten password.', isCorrect: false, explanation: 'Password resets are standard IT helpdesk duties.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-car-01',
        title: 'Career Hub: Explore All Cloud Security Roles & Certifications',
        url: '/about',
        description: 'Explore salary bands, day-in-the-life walkthroughs, and recommended certification progressions.'
      }
    },
    {
      id: 'role-security-analyst',
      title: 'Security Analyst Deep Dive & SOC Operations',
      pathId: 'career',
      level: 'Beginner',
      estimatedTime: '22 min read • 5 min check',
      badge: 'Day in the Life',
      summary: 'Master daily Security Operations Center (SOC) workflows. Learn alert triage queues, ticket lifecycles in Jira/ServiceNow, escalation paths, and communicating risk to non-technical stakeholders.',
      overview: `A **Cloud Security Analyst** is on the front lines of cloud defense. Their primary mission is maintaining situational awareness, triaging incoming security telemetry, containing immediate threats, and coordinating escalations.

**A Day in the Life of a Cloud Security Analyst**:
- **09:00 - Shift Handover & Queue Review**: Review unresolved tickets from the overnight shift; inspect the GuardDuty and Security Hub dashboards for any P1/P2 overnight findings.
- **10:00 - Alert Triage & False-Positive Pruning**: Investigate automated alerts (e.g. an anomalous S3 download or an unfamiliar IP login). Query CloudTrail and VPC Flow Logs in Athena to verify context.
- **11:30 - Phishing & Credential Investigation**: Analyze a reported phishing email; verify whether any employee clicked the malicious link; check Okta/AWS SSO logs for suspicious logins.
- **14:00 - Vulnerability & Posture Review**: Review daily Amazon Inspector container image scans; notify application owners of critical CVEs with remediation deadlines.
- **15:30 - Incident Simulation / War Room**: Participate in an internal game day or respond to a live security incident following standard operating procedures (SOPs).
- **17:00 - Shift Handoff Documentation**: Update all active tickets with detailed investigation notes and pass context to the incoming shift.

**The Professional Ticket Lifecycle**:
1. **New / Unassigned**: Alert ingested from EventBridge into Jira/ServiceNow.
2. **In Triage**: Analyst assigned; initial hypothesis and log verification underway.
3. **Escalated / War Room**: True positive confirmed; escalated to Tier 2/Engineer and Incident Commander.
4. **Contained**: Threat isolated (Quarantine SG applied, key deactivated).
5. **Resolved / Closed**: Root cause eradicated; post-mortem ticket linked.`,
      whyItMatters: 'Hiring managers test analyst candidates on methodology, calm problem-solving under stress, and clear communication. Knowing how a real SOC operates proves you are job-ready on day one.',
      securityRisks: [
        'Closing alerts without investigating context to hit artificial queue closure metrics.',
        'Failing to document investigation steps in the ticket, making shift handoffs chaotic.',
        'Not escalating high-severity incidents promptly out of fear of crying wolf.',
        'Using technical jargon when communicating critical security risks to executive leadership.'
      ],
      bestPractices: [
        'Always record the "5 Ws" in your investigation notes: Who, What, When, Where, and Why.',
        'Include exact CloudTrail Event IDs and CLI query snippets in your ticket notes for peer reproducibility.',
        'When escalating, state the risk clearly: Asset affected, confirmed threat, potential business impact, and recommended containment.',
        'Continuously document repetitive false positives to help engineers write better suppression rules.'
      ],
      keyTakeaways: [
        'The SOC analyst is the first responder to security events across the enterprise.',
        'Documentation is critical: if it is not written in the ticket, the investigation did not happen.',
        'Follow established Standard Operating Procedures (SOPs) during active triage.',
        'Communicate clearly using business impact rather than cryptic log payloads.'
      ],
      realWorldScenario: {
        title: 'The Clear Escalation That Stopped an Exfiltration',
        incident: 'A junior SOC analyst noticed a GuardDuty alert for unusual S3 API calls at 11:30 PM. Instead of waiting until morning or closing it as noise, the analyst executed an Athena query, discovered 20,000 files had been downloaded in 15 minutes by an assumed role, and immediately called the on-call Security Engineer. The engineer applied an emergency `TokenIssueTime` Deny policy, stopping the exfiltration within 18 minutes of initial alert.',
        impact: 'Attacker prevented from downloading 80% of the customer database.',
        detectionMethod: 'Disciplined adherence to SOC escalation SLAs and structured triage notes.'
      },
      commonBeginnerMistakes: [
        'Closing alerts without adding investigation notes or evidence links.',
        'Panicking and taking destructive actions without consulting the ticket SOP.',
        'Not checking whether the user was authorized to perform the action before raising an alarm.',
        'Writing emotional or speculative comments in compliance-audited incident tickets.'
      ],
      whatACloudSecEngineerChecks: [
        'Review open SOC ticket queues for SLA compliance (P1 < 15 min, P2 < 1 hour).',
        'Inspect ticket documentation quality: verify presence of CloudTrail Event IDs and IP lookups.',
        'Confirm shift handover notes are documented in the central team wiki.',
        'Verify that analysts have appropriate read-only audit roles in production.'
      ],
      codeSnippet: {
        language: 'markdown',
        title: 'Standard Enterprise SOC Ticket Investigation Template (Jira / ServiceNow)',
        code: `### 1. SUMMARY
- **Alert Type**: Amazon GuardDuty - UnauthorizedAccess:IAMUser/TorIP
- **Target Asset**: IAM Role 'arn:aws:iam::123456789012:role/DataPipelineWorker'
- **Severity**: P2 - HIGH | **Assigned Analyst**: Jane Doe

### 2. INVESTIGATION FINDINGS
- **Source IP**: 198.51.100.89 (Confirmed Tor Exit Node via AbuseIPDB, 100% abuse confidence)
- **First Seen**: 2026-03-14T02:15:22Z | **Last Seen**: 2026-03-14T02:30:10Z
- **API Actions Observed**:
  - \`s3:ListBuckets\` (Success)
  - \`s3:GetObject\` on bucket 'prod-customer-reports' (24 objects accessed)
  - \`iam:CreateAccessKey\` (AccessDenied - blocked by boundary!)

### 3. CONTAINMENT & ACTION TAKEN
- Contacted user owner via Slack (User confirmed they were asleep and not traveling).
- Deactivated static key 'AKIAEXAMPLEKEY12' via AWS CLI.
- Applied emergency STS session revocation policy (TokenIssueTime).
- Escalated to Lead Incident Responder for forensic S3 analysis.`
      },
      interviewQuestions: [
        {
          question: 'How do you structure your investigation notes in a security ticketing system when triaging an incident?',
          interviewerRationale: 'Evaluates operational discipline, analytical structure, and communication clarity.',
          modelAnswer: 'I follow a structured 4-part format: 1) Executive Summary: State the finding type, affected asset ARN, severity tier, and initial assessment. 2) Evidence & Artifacts: Document the forensic facts — Source IP, Geolocation/ASN reputation, User-Agent, exact timestamps, and specific CloudTrail Event IDs or Athena query snippets. 3) Risk & Hypothesis: Explain what the attacker attempted to accomplish (e.g. initial reconnaissance vs. data exfiltration) and what was blocked. 4) Actions Taken & Recommendations: Detail immediate containment actions executed (e.g. key deactivated, quarantine SG applied) and outline clear next steps for the engineering or forensics team.'
        },
        {
          question: 'If you identify a confirmed critical security breach at 2:00 AM on a weekend, how do you handle escalation?',
          interviewerRationale: 'Assesses confidence, adherence to SLAs, and emergency communication protocols.',
          modelAnswer: 'First, I follow our documented Incident Response Escalation matrix. Because it is a confirmed Critical (P1) breach, I immediately trigger the on-call Incident Commander and Lead Security Engineer via PagerDuty (which rings their phones with persistent audio alerts). Second, I open an emergency incident bridge (war room) on Zoom/Slack and post the initial ticket summary with verified IoCs. Third, while waiting for the team to join, I execute pre-authorized initial containment runbooks (e.g. applying a pre-approved quarantine security group to isolate the infected host). Finally, I maintain a live chronological timeline in the incident channel, ensuring all actions taken are timestamped.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Security Operations and SOC Incident Triage',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Security Operations Guide and Playbook Framework',
          url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-security-incident-response-guide/welcome.html',
          type: 'Documentation'
        },
        {
          title: 'SANS Institute: SOC Analyst Fundamentals and Alert Triage',
          url: 'https://www.sans.org/cyber-security-courses/soc-analyst/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Why should a security analyst include exact CloudTrail Event IDs and CLI query snippets in their ticket documentation?',
        options: [
          { id: 'a', text: 'To fill up the character count requirement on the ticket.', isCorrect: false, explanation: 'Arbitrary character counts do not add security value.' },
          { id: 'b', text: 'To ensure peer reproducibility, legal auditability, and clear context during shift handovers.', isCorrect: true, explanation: 'Correct! Exact event IDs allow other engineers, auditors, and legal teams to verify the exact evidence.' },
          { id: 'c', text: 'Because AWS automatically deletes tickets without event IDs.', isCorrect: false, explanation: 'AWS does not manage customer ticketing systems.' },
          { id: 'd', text: 'To encrypt the ticket contents.', isCorrect: false, explanation: 'Text strings do not encrypt tickets.' }
        ]
      },
      bridgeToLabs: {
        type: 'Simulator',
        id: 'sim-04',
        title: 'SOC On-Call Simulator: Live Queue Triage & Escalation',
        url: '/internship-simulator',
        description: 'Step into the SOC analyst seat: triage incoming queue tickets, verify IoCs, and document findings.'
      }
    },
    {
      id: 'role-security-engineer',
      title: 'Cloud Security Engineer Deep Dive & Automation',
      pathId: 'career',
      level: 'Intermediate',
      estimatedTime: '24 min read • 6 min check',
      badge: 'Engineering & Code',
      summary: 'Master the responsibilities of a Cloud Security Engineer. Learn system hardening, writing Terraform guardrails, Python automation with Boto3, threat modeling, and architecture reviews.',
      overview: `A **Cloud Security Engineer** is an architect, software builder, and systems hardener. Their mission is to build scalable, automated security systems that protect the business without slowing down software delivery.

**Core Responsibilities of a Cloud Security Engineer**:
1. **Security as Code (Infrastructure as Code)**:
   - Writing and reviewing reusable, hardened Terraform modules for VPCs, ALBs, S3 buckets, and IAM roles.
   - Enforcing guardrails in CI/CD pipelines using Checkov, tfsec, and OIDC.
2. **Security Automation & Tooling**:
   - Developing automated remediation scripts in Python (Boto3) to automatically quarantine compromised resources or revoke stale keys.
   - Managing security SaaS integrations (SIEMs, CSPM, vulnerability scanners).
3. **Architecture Reviews & Threat Modeling**:
   - Reviewing new application blueprints before launch using frameworks like **STRIDE** (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).
   - Identifying trust boundary weaknesses, public endpoints, and excessive IAM privileges.
4. **Governance & Multi-Account Guardrails**:
   - Engineering AWS Organizations Service Control Policies (SCPs) and AWS Config conformance packs to enforce compliance across 100+ accounts.
5. **Tier 3 Incident Escalation**:
   - Serving as the technical lead during severe security incidents and leading post-mortem guardrail engineering.`,
      whyItMatters: 'Security engineers do not manually click buttons in the AWS console. They engineer automated systems that scale to thousands of cloud resources, multiplying the effectiveness of the entire security organization.',
      securityRisks: [
        'Security becoming a friction-heavy bottleneck that developers actively bypass.',
        'Writing fragile automation scripts that crash during production edge cases.',
        'Failing to keep Terraform modules updated with latest AWS security features.',
        'Not conducting threat models prior to application launches.'
      ],
      bestPractices: [
        'Automate everything: if you perform a manual task more than twice, write a Python/Boto3 script or Terraform resource for it.',
        'Partner with developer teams as an enabler by providing pre-approved, hardened "Paved Road" Terraform modules.',
        'Conduct threat modeling sessions during the sprint planning phase of new software initiatives.',
        'Maintain version-controlled documentation for all security architectures and runbooks.'
      ],
      keyTakeaways: [
        'Cloud Security Engineers build automated defense systems; they do not perform manual click-ops.',
        'Terraform, Python (Boto3), and Git are the core daily languages of the security engineer.',
        'Threat modeling identifies architectural flaws before code is written.',
        'Build "Paved Roads" — make the secure way the easiest way for developers to ship code.'
      ],
      realWorldScenario: {
        title: 'The Automated Self-Healing S3 Guardrail',
        incident: 'In an enterprise with 80 AWS accounts, developers occasionally disabled Block Public Access on buckets to test webhooks, creating massive compliance exposure. A Cloud Security Engineer built an automated self-healing pipeline: Amazon EventBridge matched any `s3:PutAccountPublicAccessBlock` or `s3:PutBucketPublicAccessBlock` event where settings were set to false, immediately triggering an AWS Lambda function that re-enabled all 4 Block Public Access controls within 12 seconds and sent a Slack alert to the developer.',
        impact: 'Public bucket exposure window reduced from days to 12 seconds with zero human intervention.',
        detectionMethod: 'Automated event-driven architecture eliminated a major recurring compliance failure.'
      },
      commonBeginnerMistakes: [
        'Focusing only on finding problems instead of engineering automated solutions.',
        'Writing complex Python scripts without error handling or CloudWatch logging.',
        'Treating developer teams as adversaries rather than engineering partners.',
        'Not testing Terraform modules across multiple AWS regions.'
      ],
      whatACloudSecEngineerChecks: [
        'Review Terraform pull requests for compliance with security module standards.',
        'Verify health and error metrics of automated remediation Lambda functions in CloudWatch.',
        'Conduct bi-weekly threat modeling sessions with development leads.',
        'Inspect SCP coverage across all AWS Organizations organizational units.'
      ],
      codeSnippet: {
        language: 'python',
        title: 'Python (AWS Lambda): Automated Quarantine Function Triggered by EventBridge',
        code: `import boto3

def lambda_handler(event, context):
    ec2 = boto3.client('ec2')
    
    # Extract Instance ID from GuardDuty finding passed by EventBridge
    detail = event.get('detail', {})
    resource = detail.get('resource', {})
    instance_details = resource.get('instanceDetails', {})
    instance_id = instance_details.get('instanceId')
    
    if not instance_id:
        print("No instance ID found in event payload.")
        return
        
    quarantine_sg_id = "sg-0123456789quarantine"
    
    print(f"ISOLATING COMPROMISED HOST: {instance_id}")
    
    # Replace existing security groups with Quarantine SG
    ec2.modify_instance_attribute(
        InstanceId=instance_id,
        Groups=[quarantine_sg_id]
    )
    
    # Add forensic custody tag
    ec2.create_tags(
        Resources=[instance_id],
        Tags=[
            {'Key': 'QuarantineStatus', 'Value': 'IsolatedByAutomation'},
            {'Key': 'IsolationTimestamp', 'Value': str(context.aws_request_id)}
        ]
    )
    
    return {"status": "SUCCESS", "isolated_instance": instance_id}`
      },
      interviewQuestions: [
        {
          question: 'How do you conduct an architectural threat model for a new cloud application using the STRIDE methodology?',
          interviewerRationale: 'Evaluates architectural threat modeling depth, system decomposition, and structured risk analysis.',
          modelAnswer: 'I follow a 4-step process: 1) System Decomposition: Create a data flow diagram (DFD) showing external users, public ALBs, application tiers, databases, and third-party APIs, clearly drawing all Trust Boundaries. 2) Apply STRIDE: Analyze each component and data flow against the 6 STRIDE threats: Spoofing (are identities authenticated via mTLS/OIDC?), Tampering (is data signed and integrity-checked?), Repudiation (are all actions logged in CloudTrail?), Information Disclosure (is data encrypted at rest and in transit?), Denial of Service (are AWS Shield, WAF, and Auto Scaling in place?), and Elevation of Privilege (is least privilege enforced with boundaries?). 3) Risk Mitigation: Translate identified threats into specific engineering controls (e.g. mandating IMDSv2, KMS encryption). 4) Validation: Verify controls in CI/CD and review post-launch.'
        },
        {
          question: 'What is the "Paved Road" security philosophy and how does a Cloud Security Engineer implement it?',
          interviewerRationale: 'Assesses engineering culture, developer enablement, and modern DevSecOps leadership.',
          modelAnswer: 'The "Paved Road" philosophy means instead of saying "No" to developers or acting as an obstructive gatekeeper, the security team builds pre-approved, hardened, well-documented Infrastructure as Code (Terraform) modules and templates for common patterns (e.g. a secure microservice module, a private RDS module, an S3 vault module). If developers use the Paved Road, their code is compliant by default, passes all CI/CD security gates automatically, and deploys without friction. Security becomes the path of least resistance, aligning security goals with engineering velocity.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Advanced Security Automation and DevSecOps',
          url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/100/aws-security-fundamentals',
          type: 'Skill Builder'
        },
        {
          title: 'AWS Well-Architected Security Pillar: Threat Modeling Whitepaper',
          url: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html',
          type: 'Documentation'
        },
        {
          title: 'OWASP Threat Dragon & STRIDE Threat Modeling Guide',
          url: 'https://owasp.org/www-community/Threat_Modeling',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Under the STRIDE threat modeling framework, which threat category corresponds to an attacker modifying an S3 object without authorization?',
        options: [
          { id: 'a', text: 'Spoofing', isCorrect: false, explanation: 'Spoofing represents impersonating an identity.' },
          { id: 'b', text: 'Tampering', isCorrect: true, explanation: 'Correct! Tampering represents unauthorized modification of data or code.' },
          { id: 'c', text: 'Repudiation', isCorrect: false, explanation: 'Repudiation represents denying having performed an action.' },
          { id: 'd', text: 'Denial of Service', isCorrect: false, explanation: 'Denial of service represents disrupting availability.' }
        ]
      },
      bridgeToLabs: {
        type: 'Project',
        id: 'proj-01',
        title: 'Portfolio Project: Automated Security Defense & Response Engine',
        url: '/projects',
        description: 'Build and deploy a complete $0 free-tier cloud security automation portfolio project with Terraform.'
      }
    },
    {
      id: 'required-skills',
      title: 'Required Skills & Core Competency Matrix',
      pathId: 'career',
      level: 'Beginner',
      estimatedTime: '20 min read • 5 min check',
      badge: 'Skill Roadmap',
      summary: 'Master the high-signal technical skills that cloud security hiring managers evaluate: IAM policy mastery, VPC networking, Linux command-line internals, Python/Boto3, and incident triage.',
      overview: `Breaking into and excelling in cloud security requires a balanced combination of foundational IT mechanics, cloud-native services, and engineering automation.

**The 5 Core Technical Competency Pillars**:
1. **AWS Identity & Access Management (IAM)**:
   - Deep evaluation logic: Explicit Deny vs. Allow, SCPs, Boundaries, and Resource Policies.
   - Role trust policies, \`sts:AssumeRole\`, ExternalId, and OIDC federation.
   - Principle of Least Privilege and right-sizing policies using CloudTrail telemetry.
2. **Cloud Networking & Perimeter Defense**:
   - RFC 1918 CIDR subnetting, public vs. private vs. isolated route tables.
   - Stateful Security Groups vs. Stateless NACLs (ephemeral ports).
   - VPC Endpoints (PrivateLink vs. Gateway Endpoints), Transit Gateway, and AWS WAF.
3. **Linux Internals & Command-Line Fluency**:
   - Navigating directories, process inspection (\`ps aux\`, \`lsof -i\`, \`netstat\`), file permissions (\`chmod\`, \`chown\`).
   - Log analysis via \`grep\`, \`awk\`, \`sed\`, and systemd service management.
   - Analyzing \`/var/log/auth.log\`, \`/var/log/secure\`, and \`/etc/passwd\`.
4. **Scripting & Infrastructure as Code (IaC)**:
   - Python 3 with the Boto3 AWS SDK for automation and log parsing.
   - Terraform / OpenTofu for declaring compliant cloud architectures.
   - Git version control, branching, and pull request workflows.
5. **Incident Response & Forensic Triage**:
   - Reconstructing attack timelines using CloudTrail and Amazon Athena SQL.
   - Identifying MITRE ATT&CK Cloud techniques (T1562, T1078, T1552).
   - Executing quarantine isolation and session revocation runbooks.`,
      whyItMatters: 'Candidates who only understand AWS at a conceptual level struggle during technical interviews. Mastering Linux commands, IAM JSON syntax, and Python Boto3 allows you to solve real problems on screen with confidence.',
      securityRisks: [
        'Relying solely on AWS Management Console GUI without learning the AWS CLI or SDKs.',
        'Not knowing basic Linux command-line commands when investigating an EC2 breach.',
        'Inability to write basic JSON IAM policies from memory.',
        'Over-indexing on exotic security tools while neglecting basic TCP/IP networking fundamentals.'
      ],
      bestPractices: [
        'Practice daily in the Linux command line and AWS CLI; avoid using the web console for lab practice.',
        'Build and maintain a personal GitHub repository containing working Boto3 automation scripts and Terraform modules.',
        'Practice writing and debugging IAM JSON policies by hand without a GUI wizard.',
        'Participate in cloud security CTFs and simulated incident investigations.'
      ],
      keyTakeaways: [
        'The 5 pillars: IAM, Networking, Linux Internals, Python/Terraform, and Incident Triage.',
        'CLI and automation skills separate high-earning engineers from entry-level applicants.',
        'Linux command-line mastery is non-negotiable for investigating cloud workloads.',
        'Build deep competence in fundamental networking: CIDRs, routing, and ports.'
      ],
      realWorldScenario: {
        title: 'The Live Whiteboard Technical Screen',
        incident: 'During a final-round interview for a Cloud Security Engineer role, the candidate was given a live terminal and asked: "Here is a broken IAM policy causing an S3 AccessDenied error for an EC2 instance. Identify the bug and fix it using the AWS CLI." Because the candidate had practiced writing raw JSON policies and using the CLI rather than relying on console wizards, they spotted the missing `/*` object wildcard and fixed the policy in 4 minutes, earning an enthusiastic unanimous hire recommendation.',
        impact: 'Hands-on technical competency directly translated into a job offer.',
        detectionMethod: 'Practical terminal evaluation verified genuine engineering ability.'
      },
      commonBeginnerMistakes: [
        'Only using the AWS Console and being completely unable to run AWS CLI commands.',
        'Memorizing answers for certification exams without understanding the underlying networking protocols (TCP, DNS, TLS).',
        'Believing Python scripting is only for software developers, not security engineers.',
        'Ignoring Git and GitHub version control.'
      ],
      whatACloudSecEngineerChecks: [
        'Test ability to run AWS CLI commands from a local terminal: `aws sts get-caller-identity`.',
        'Verify basic Linux command proficiency: `grep`, `awk`, `find`, `netstat`, `systemctl`.',
        'Review personal GitHub repositories for code structure, commit messages, and documentation.',
        'Verify understanding of the TCP 3-way handshake and HTTP/S status codes.'
      ],
      codeSnippet: {
        language: 'bash',
        title: 'Essential Linux Incident Response Commands on an EC2 Instance',
        code: `# 1. Check active listening network ports and connected external sockets
sudo ss -tulpn

# 2. Check running processes, CPU usage, and binary execution paths
ps aux --sort=-%cpu | head -n 15

# 3. Inspect recent user logins and failed authentication attempts
sudo last -n 20
sudo grep -i "failed" /var/log/auth.log | tail -n 20

# 4. Check for modified system binaries in the last 24 hours
sudo find /usr/bin /usr/sbin /bin -type f -mtime -1`
      },
      interviewQuestions: [
        {
          question: 'If you could only master three technical skills to prepare for a Cloud Security Engineer career, which three would you choose and why?',
          interviewerRationale: 'Evaluates priority judgment, self-awareness, and understanding of the core foundations of cloud defense.',
          modelAnswer: 'I would prioritize: 1) AWS IAM & Identity Governance: Identity is the definitive control plane of the cloud. You cannot design a secure system or triage a breach without understanding evaluation logic, boundaries, and STS tokens. 2) Cloud Networking (VPC, Routing, Security Groups): Understanding how packets flow, private endpoints, and microsegmentation dictates blast radius and containment. 3) Python (Boto3) & Infrastructure as Code (Terraform): The defining difference between an analyst and an engineer is the ability to write code to automate detection, deploy guardrails, and build scalable systems. Tools and UI interfaces change, but deep mastery of Identity, Networking, and Code is timeless.'
        },
        {
          question: 'How do you investigate suspicious activity on a Linux EC2 instance using the command line?',
          interviewerRationale: 'Tests hands-on operating system forensics and command-line fluency.',
          modelAnswer: '1) Network: Run `ss -tulpn` or `lsof -i` to identify all active listening ports and established outbound TCP connections (checking for external IP beacons). 2) Processes: Run `ps aux --sort=-%cpu` to look for suspicious binaries running out of `/tmp` or `/dev/shm` or anomalous cryptomining CPU spikes. 3) Identity & Logins: Run `last` to see recent logins, check `/home/*/.ssh/authorized_keys` for newly injected SSH keys, and inspect `/etc/passwd` for unauthorized users with UID 0. 4) Persistence: Inspect crontabs (`/etc/cron*`, `/var/spool/cron/crontabs`) and systemd services (`systemctl list-unit-files --state=enabled`). 5) Logs: Parse `/var/log/auth.log` or `/var/log/secure` using `grep` for brute-force attempts and `sudo` command executions.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Cloud Security Technical Ramp-Up Guide',
          url: 'https://aws.amazon.com/training/skills/',
          type: 'Skill Builder'
        },
        {
          title: 'AWS CLI Command Reference and User Guide',
          url: 'https://docs.aws.amazon.com/cli/latest/reference/',
          type: 'Documentation'
        },
        {
          title: 'Linux Foundation: Introduction to Linux (LFS101)',
          url: 'https://www.linuxfoundation.org/courses/introduction-to-linux',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Which Linux command is used to inspect all active listening TCP/UDP network sockets and their associated process IDs on an EC2 instance?',
        options: [
          { id: 'a', text: 'sudo ss -tulpn (or netstat -tulpn)', isCorrect: true, explanation: 'Correct! "ss -tulpn" displays TCP, UDP, listening sockets, program processes, and numerical ports.' },
          { id: 'b', text: 'cat /etc/hosts', isCorrect: false, explanation: '/etc/hosts maps static hostnames to IP addresses.' },
          { id: 'c', text: 'chmod 777 /var/log', isCorrect: false, explanation: 'chmod modifies file permissions and opening it to 777 is a severe security vulnerability.' },
          { id: 'd', text: 'uname -r', isCorrect: false, explanation: 'uname displays kernel version.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-car-02',
        title: 'Career Hub: Core Skills Checklist & Self-Assessment',
        url: '/about',
        description: 'Complete the interactive Cloud Security Engineer competency self-assessment.'
      }
    },
    {
      id: 'resume-advice',
      title: 'Resume Crafting, Portfolio Strategy & ATS Optimization',
      pathId: 'career',
      level: 'Beginner',
      estimatedTime: '22 min read • 5 min check',
      badge: 'Job Search',
      summary: 'Craft a high-converting cloud security resume. Master the Google XYZ bullet-point formula, bypass Applicant Tracking Systems (ATS), showcase GitHub IaC portfolios, and quantify risk reduction.',
      overview: `Hiring managers and technical recruiters review hundreds of resumes for every cloud security role. Most resumes are immediately rejected because they list generic responsibilities rather than **quantified accomplishments and engineering outcomes.**

**The Google "XYZ" Formula for High-Impact Resume Bullets**:
- *Weak*: "Responsible for managing AWS IAM policies and configuring S3 buckets." (Passive, vague, describes duties).
- *Strong (XYZ Formula)*: **Accomplished [X], as measured by [Y], by doing [Z].**
  - *Example 1*: "Reduced cloud attack surface across 40 AWS accounts by **eliminating 100% of static developer access keys**, migrating 250 engineers to AWS IAM Identity Center (SSO) with hardware MFA."
  - *Example 2*: "Decreased mean-time-to-containment (MTTC) for compromised credentials from **4 hours to 45 seconds** by engineering an automated EventBridge and Lambda quarantine pipeline."
  - *Example 3*: "Prevented cloud misconfigurations from reaching production by deploying **Checkov and tfsec static analysis in GitHub Actions**, blocking 15 critical policy violations during CI/CD pull requests."

**Bypassing the Applicant Tracking System (ATS)**:
- Use clean, standard single-column markdown/word layouts (avoid complex two-column templates or graphical tables that parse incorrectly).
- Use standard section titles: \`Summary\`, \`Technical Skills\`, \`Experience\`, \`Projects\`, \`Certifications\`, \`Education\`.
- Naturally embed high-value keywords from the job description (e.g., \`AWS Organizations\`, \`Service Control Policies (SCPs)\`, \`Terraform\`, \`GuardDuty\`, \`VPC Flow Logs\`, \`Incident Response\`, \`Python Boto3\`).`,
      whyItMatters: 'A great portfolio project or deep technical understanding is wasted if your resume cannot get past the initial 10-second recruiter screening. Framing achievements in terms of risk reduction and business value guarantees interview callbacks.',
      securityRisks: [
        'Listing tools you only watched a 5-minute video on, failing technical interview deep-dives.',
        'Putting confidential client information or proprietary architecture names in public resumes.',
        'Using flashy graphic designer resume templates that break ATS parsers.',
        'Not linking to an active GitHub profile or technical portfolio.'
      ],
      bestPractices: [
        'Quantify every bullet point with percentages, time savings, account numbers, or cost metrics.',
        'Include a dedicated "Technical Projects / Portfolio" section featuring direct clickable GitHub links.',
        'Tailor your resume for each application by aligning keywords with the specific job description.',
        'Export your resume as a clean, text-selectable PDF.'
      ],
      keyTakeaways: [
        'Use the XYZ formula: Accomplished [X], measured by [Y], by doing [Z].',
        'Quantify outcomes: risk reduced, hours saved, percentage compliance increased.',
        'Include direct links to GitHub repositories with clean Terraform code and README diagrams.',
        'Keep formatting clean and ATS-friendly: single column, clear headers, standard fonts.'
      ],
      realWorldScenario: {
        title: 'The Resume Rewrite Transformation',
        incident: 'An engineer submitted 120 applications over 4 months with zero interview callbacks. Their resume listed generic bullet points like "Assisted with AWS security audits" and "Created IAM users". After rewriting the resume using the XYZ formula, quantifying accomplishments ("Audited 15 AWS accounts, remediating 85 non-compliant CIS Benchmark findings using AWS Config"), and adding a direct link to a GitHub repository deploying a 3-tier secure VPC with Terraform, the candidate received 6 interview requests from the next 15 applications.',
        impact: 'Interview callback rate increased from 0% to 40% purely through strategic framing.',
        detectionMethod: 'Recruiters and hiring managers recognized immediate, demonstrable cloud engineering value.'
      },
      commonBeginnerMistakes: [
        'Listing every single AWS service ever created in a giant keyword block.',
        'Describing daily tasks ("Monitored logs") instead of measurable achievements ("Reduced false positives by 40%").',
        'Linking to empty GitHub repositories or repos with no README documentation.',
        'Having spelling errors in core technical terms (e.g. spelling "AWS GuardDuty" as "Guard Duty").'
      ],
      whatACloudSecEngineerChecks: [
        'Verify resume parses cleanly using online ATS resume checkers (Jobscan, ResumeWorded).',
        'Confirm every bullet point contains an action verb and a quantifiable metric.',
        'Test that all links (GitHub, LinkedIn, Portfolio) are live and clickable.',
        'Ensure the resume is concise (strictly 1 page for <5 years experience, max 2 pages for senior roles).'
      ],
      codeSnippet: {
        language: 'markdown',
        title: 'High-Impact Cloud Security Engineer Resume Template (Markdown)',
        code: `## PROFESSIONAL EXPERIENCE

### Cloud Security Engineer | FinTech Solutions Inc. | 2024 – Present
- Architected multi-account AWS Landing Zone for 35 AWS accounts using AWS Control Tower, establishing centralized Log Archive and Security Tooling accounts.
- Enforced organizational least-privilege by designing 12 Service Control Policies (SCPs), blocking root user operations and unauthorized AWS regions.
- Automated incident containment by authoring Python (Boto3) Lambda functions triggered by EventBridge, reducing time-to-isolate for compromised instances to <30 seconds.
- Reduced monthly AWS KMS request spending by $4,200 (78%) across 85 Terabytes of S3 storage by implementing S3 Bucket Keys.

### SOC Security Analyst | Enterprise Defense Corp | 2022 – 2024
- Triaged 40+ daily security alerts from Amazon GuardDuty, AWS Security Hub, and CloudWatch in Jira, maintaining a 98% SLA compliance rate.
- Investigated and contained 14 confirmed credential compromise incidents using CloudTrail and Amazon Athena SQL forensic queries.
- Spearheaded blameless post-mortems for P1 incidents, translating root causes into automated AWS Config remediation rules.`
      },
      interviewQuestions: [
        {
          question: 'How do you demonstrate technical capability on a resume if you do not have professional experience as a Cloud Security Engineer?',
          interviewerRationale: 'Evaluates initiative, self-directed learning, and portfolio construction.',
          modelAnswer: 'By building and documenting tangible, production-grade portfolio projects on GitHub. Instead of listing passive coursework, create 2-3 comprehensive projects: 1) Infrastructure as Code: A Terraform repository deploying a multi-tier VPC with public ALBs, private containers, isolated databases, and WAF rules, complete with an architecture diagram. 2) Security Automation: A Python/Boto3 script or Lambda function that automates an essential security task (e.g. scanning for inactive access keys, auto-remediating unencrypted S3 buckets). 3) Incident Response Walkthrough: A detailed post-mortem report from a simulated CTF incident (like SeCloudive) showing your forensic timeline and containment strategy. Feature these prominently in a "Selected Cloud Security Projects" section with clickable links.'
        },
        {
          question: 'What is the most effective way to describe a routine daily task on a resume to make it sound like engineering accomplishment?',
          interviewerRationale: 'Tests communication framing, business value orientation, and metrics focus.',
          modelAnswer: 'Transform the routine task from passive duty to active business impact using the XYZ formula. For example, instead of writing "Reviewed CloudWatch alarms and updated documentation", write: "Decreased mean-time-to-detect (MTTD) for security incidents by 35% by tuning CloudWatch metric filters and authoring 8 standardized SOC triage runbooks adopted by a team of 10 analysts." This highlights the business outcome (faster detection), quantifies the result (35%), and demonstrates peer leadership.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Career Hub: Resume and Portfolio Best Practices for Cloud Engineers',
          url: 'https://aws.amazon.com/training/skills/',
          type: 'Skill Builder'
        },
        {
          title: 'Google Careers: Resume Writing Guide (XYZ Formula)',
          url: 'https://www.google.com/about/careers/applications/how-we-hire/',
          type: 'Documentation'
        },
        {
          title: 'Cybersecurity Career Guide: Crafting Compelling Security Resumes',
          url: 'https://www.sans.org/blog/how-to-write-a-cyber-security-resume/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Which of the following bullet points represents the strongest, most compelling achievement for a Cloud Security Engineer resume?',
        options: [
          { id: 'a', text: 'Responsible for monitoring GuardDuty and looking at alerts daily.', isCorrect: false, explanation: 'Passive, unquantified, and describes mundane duties.' },
          { id: 'b', text: 'Automated compromised credential containment by engineering an EventBridge and Lambda pipeline, reducing response time from 3 hours to 45 seconds across 30 AWS accounts.', isCorrect: true, explanation: 'Correct! Follows the XYZ formula: action verb, quantified metric, technical specifics, and business impact.' },
          { id: 'c', text: 'Helped the team with cloud security stuff when needed.', isCorrect: false, explanation: 'Extremely vague and informal.' },
          { id: 'd', text: 'Holds AWS Certified Solutions Architect Associate credential.', isCorrect: false, explanation: 'Certifications belong in the certification section, not as experience bullet points.' }
        ]
      },
      bridgeToLabs: {
        type: 'Project',
        id: 'proj-02',
        title: 'Portfolio Projects: 4 Resume-Ready ($0) Architectures',
        url: '/projects',
        description: 'Build 4 verified portfolio projects with complete Terraform templates to showcase on your resume.'
      }
    },
    {
      id: 'interview-preparation',
      title: 'Technical & Behavioral Interview Preparation',
      pathId: 'career',
      level: 'Intermediate',
      estimatedTime: '24 min read • 6 min check',
      badge: 'Interview Mastery',
      summary: 'Ace technical whiteboard architecture screens, live IAM policy debugging, and behavioral interviews using the STAR method (Situation, Task, Action, Result).',
      overview: `Cloud security hiring loops evaluate three distinct dimensions:
1. **Technical Depth & System Design**: Can you architect secure systems, spot vulnerabilities in blueprints, and explain trade-offs?
2. **Hands-On Problem Solving**: Can you troubleshoot an IAM AccessDenied error or isolate a compromised host under live observation?
3. **Behavioral & Culture Fit**: Can you work effectively with development teams, lead through influence, and learn from mistakes?

**Mastering the Technical Architecture Screen**:
- **Step 1: Clarify Requirements**: Never start drawing immediately! Ask about scale, compliance mandates, external user count, and budget.
- **Step 2: Start with Trust Boundaries**: Draw user entry points, edge CDN/WAF, public subnets, private subnets, and isolated data tiers.
- **Step 3: Walk the Flow & Secure Each Layer**: Walk a request from client to database, explaining controls at each step (TLS, WAF, SG chaining, IAM roles, KMS encryption).
- **Step 4: Discuss Failure Modes**: Address "What happens if this database fails? What if an attacker steals an instance credential?"

**Mastering the Behavioral Interview (STAR Method)**:
- **Situation**: Set the scene with concise context (company, project, scale).
- **Task**: Explain your specific responsibility and the challenge faced.
- **Action**: Detail the specific engineering and leadership actions **YOU** took (use "I", not "we").
- **Result**: Quantify the outcome (vulnerabilities closed, dollars saved, downtime prevented).`,
      whyItMatters: 'Brilliant technical engineers often fail interviews because they explain things haphazardly or fail to communicate the business impact of their decisions. Structured frameworks ensure you communicate authority and confidence.',
      securityRisks: [
        'Jumping into architecture solutions without asking clarifying questions about requirements.',
        'Arguing defensively with interviewers when challenged on a design choice.',
        'Using "we did this" in behavioral interviews, making it impossible for the interviewer to assess your personal contribution.',
        'Not having concrete stories prepared for conflict resolution with developers.'
      ],
      bestPractices: [
        'Prepare 5-6 versatile STAR stories covering: a major incident, a project you led, a disagreement with a developer, and a time you failed.',
        'Practice drawing AWS architecture diagrams on a whiteboard or virtual canvas (Excalidraw).',
        'When asked a technical question you don\'t know, be honest: explain how you would find the answer rather than guessing.',
        'Ask high-signal questions at the end of the interview to evaluate the company\'s security culture.'
      ],
      keyTakeaways: [
        'Architecture screens: Clarify requirements, draw trust boundaries, layer defenses, and discuss failure modes.',
        'STAR framework: Situation, Task, Action, and Result (quantified outcome).',
        'Use "I" in behavioral answers to highlight your personal engineering contribution.',
        'Prepare high-signal questions for the interviewer about their on-call burden and security tooling.'
      ],
      realWorldScenario: {
        title: 'The STAR Method Behavioral Turnaround',
        incident: 'An interviewer asked: "Tell me about a time you disagreed with a development team on a security requirement." A candidate answered using STAR: (S) An engineering lead wanted to deploy an application with open SSH port 22 to meet an executive deadline. (T) As security lead, I needed to maintain our zero-internet-SSH policy without delaying the launch. (A) I scheduled a 30-minute working session, deployed AWS Systems Manager Session Manager via Terraform, demonstrated that the team could SSH directly from their terminal without open ports or keys, and integrated it into their pipeline. (R) The application launched 2 days early with zero public ports, and the dev lead thanked me for simplifying their workflow.',
        impact: 'Demonstrated technical problem solving, empathy, developer enablement, and leadership.',
        detectionMethod: 'Interview panel rated candidate as "Strong Hire" across leadership and collaboration.'
      },
      commonBeginnerMistakes: [
        'Giving long, rambling 10-minute answers to simple behavioral questions.',
        'Failing to quantify the Result in STAR stories.',
        'Pretending you know an answer when you don\'t, leading to catastrophic follow-up questions.',
        'Not preparing questions to ask the interviewer at the end of the conversation.'
      ],
      whatACloudSecEngineerChecks: [
        'Practice timed 5-minute STAR story deliveries with a timer.',
        'Review the AWS Leadership Principles (Customer Obsession, Ownership, Bias for Action).',
        'Conduct a mock architecture whiteboarding session with a peer.',
        'Prepare 3 thoughtful questions to ask the hiring manager about team culture.'
      ],
      codeSnippet: {
        language: 'markdown',
        title: 'High-Signal Questions to Ask the Hiring Manager at the End of an Interview',
        code: `### HIGH-SIGNAL QUESTIONS FOR THE INTERVIEWER:

1. **On Security Culture & Engineering Velocity**:
   - "How are security requirements typically introduced into the product roadmap here? Is security involved during initial sprint design, or during final release reviews?"

2. **On Operational Burden & On-Call Health**:
   - "What does the on-call rotation look like for this team, and what is your current ratio of automated remediation vs. manual operational alert triage?"

3. **On Tooling & Governance**:
   - "How mature is your multi-account governance? Are guardrails enforced primarily through Service Control Policies (SCPs) or reactive compliance scans?"

4. **On Success Metrics**:
   - "What would a successful first 90 days look like for the person who takes this role?"`
      },
      interviewQuestions: [
        {
          question: 'How do you handle a situation where a product manager tells you that implementing your security requirement will delay an executive product launch by two weeks?',
          interviewerRationale: 'Evaluates business acumen, risk communication, pragmatism, and executive stakeholder alignment.',
          modelAnswer: 'I approach security as a business risk decision, not a dogmatic gate. 1) Empathy & Collaboration: I sit down with the product manager to understand the launch constraints and business commitments. 2) Threat Modeling & Trade-offs: I evaluate whether we can implement a temporary compensating control (e.g. if the full SSO integration takes two weeks, can we restrict IP access via WAF or deploy a temporary quarantine boundary to launch safely on time?). 3) Quantify Risk: If no compensating control is viable and the vulnerability is critical (e.g. unauthenticated public access), I clearly articulate the business risk (potential breach cost, regulatory penalties) to leadership in plain language. 4) Formal Risk Acceptance: If leadership chooses to proceed, we document a formal, time-bound Risk Acceptance with an agreed remediation date in the next sprint, ensuring security debt is tracked and resolved.'
        },
        {
          question: 'How would you whiteboard a secure 3-tier web application architecture in AWS from scratch?',
          interviewerRationale: 'Tests complete end-to-end cloud architectural synthesis and communication structure.',
          modelAnswer: 'I structure the design into 4 clear steps: 1) Perimeter & Edge: Route 53 with DNSSEC routing to Amazon CloudFront with AWS Shield for DDoS mitigation, attached to an AWS WAF WebACL to inspect OWASP Top 10 payloads. 2) Public Tier (DMZ): An Application Load Balancer terminating TLS 1.3 using ACM certificates, deployed across 2 public subnets alongside NAT Gateways. 3) Application Tier (Private): Auto-scaled ECS containers or EC2 instances in private subnets with security groups allowing traffic ONLY from the ALB security group, enforcing IMDSv2 and using IAM execution roles with least privilege. 4) Data Tier (Isolated): Amazon Aurora PostgreSQL Multi-AZ in isolated subnets with no internet routes, accepting traffic only from application security groups, encrypted with a Customer Managed KMS Key. 5) Governance & Audit: VPC Flow Logs, CloudTrail multi-region logging, and GuardDuty enabled across the account.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Preparing for AWS Technical Whiteboard Interviews',
          url: 'https://aws.amazon.com/training/skills/',
          type: 'Skill Builder'
        },
        {
          title: 'Amazon Leadership Principles and Behavioral Interviewing',
          url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles',
          type: 'Documentation'
        },
        {
          title: 'AWS Well-Architected Framework: Whitepaper & Architecture Center',
          url: 'https://aws.amazon.com/architecture/well-architected/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'When answering behavioral interview questions using the STAR framework, which part of the answer should receive the most time and detail?',
        options: [
          { id: 'a', text: 'The Situation (describing the company background for 8 minutes).', isCorrect: false, explanation: 'The situation should be set up in under 60 seconds.' },
          { id: 'b', text: 'The Action (explaining the specific engineering steps and leadership choices YOU took) and the Result (quantified business outcome).', isCorrect: true, explanation: 'Correct! The Action and Result demonstrate your specific capabilities, problem-solving, and business impact.' },
          { id: 'c', text: 'Complaining about how disorganized the previous team was.', isCorrect: false, explanation: 'Never criticize previous employers or colleagues in interviews.' },
          { id: 'd', text: 'Reciting definitions from AWS documentation.', isCorrect: false, explanation: 'Behavioral interviews evaluate personal experience, not textbook definitions.' }
        ]
      },
      bridgeToLabs: {
        type: 'Investigation',
        id: 'inv-car-03',
        title: 'Career Hub: 50 Common Cloud Security Interview Questions',
        url: '/about',
        description: 'Practice answering 50 technical and behavioral interview questions with model answers.'
      }
    },
    {
      id: 'internship-preparation',
      title: 'Internship & Junior Onboarding (First 90 Days)',
      pathId: 'career',
      level: 'Beginner',
      estimatedTime: '22 min read • 5 min check',
      badge: 'Onboarding Success',
      summary: 'Excel in your first cloud security role or internship. Master the 30-60-90 day performance framework, ask high-signal questions, shadow on-call rotations, and ship a high-impact capstone artifact.',
      overview: `Landing the job is only the beginning. The first 90 days of an internship or junior cloud security role determine your reputation, team trust, and full-time return offer or promotion trajectory.

**The 30-60-90 Day High-Performance Framework**:
1. **Days 1 - 30: Absorb, Map & Listen (The Learner Phase)**:
   - Understand the Architecture: Read company architecture diagrams, understand the multi-account Landing Zone structure, and map trust boundaries.
   - Master the Tooling: Set up your local development environment (AWS CLI, SSO, Git, Terraform, IDE linters).
   - Shadow Senior Engineers: Sit in on alert investigations, architecture reviews, and on-call paging incidents. Take detailed notes.
   - Goal: Ship your first small pull request (e.g. fixing a small Terraform linting issue or updating a runbook) within your first 14 days!
2. **Days 31 - 60: Execute, Triage & Contribute (The Builder Phase)**:
   - Handle Independent Triage: Take primary responsibility for triaging daily SOC alerts or managing low-priority vulnerability findings.
   - Ask High-Signal Questions: Before asking for help, spend 20 minutes researching, formulate an intelligent hypothesis, and present your findings along with the question.
   - Shadow On-Call: Shadow the primary on-call engineer during emergency incidents.
3. **Days 61 - 90: Lead, Automate & Deliver Capstone (The Multiplier Phase)**:
   - Deliver a Capstone Project: Identify an unaddressed friction point (e.g. building an automated Slack bot for IAM key expiration warnings, or authoring a new Checkov policy pack) and build it end-to-end.
   - Present to Leadership: Present your capstone artifact to engineering leadership, demonstrating measurable business impact.`,
      whyItMatters: 'Junior engineers who proactively identify operational friction and ship working automation are universally recognized as top performers and fast-tracked for promotions.',
      securityRisks: [
        'Remaining completely silent and not asking questions out of fear of looking inexperienced.',
        'Making unapproved manual changes directly in production environments.',
        'Asking repetitive questions without taking notes or checking internal documentation first.',
        'Waiting to be assigned tasks instead of proactively identifying areas of improvement.'
      ],
      bestPractices: [
        'Maintain a personal daily engineering log documenting what you learned, who you spoke with, and blockers.',
        'Use the "20-Minute Rule": spend 20 minutes investigating a problem yourself before asking a senior engineer for help.',
        'When asking questions, format them as: "Here is the problem, here is what I tried, here is my hypothesis, am I on the right track?"',
        'Identify an automated tooling project you can deliver as a capstone before your internship concludes.'
      ],
      keyTakeaways: [
        'Days 1-30: Absorb the architecture and ship your first small PR.',
        'Days 31-60: Handle independent triage and shadow on-call incidents.',
        'Days 61-90: Build and ship a high-impact automation capstone project.',
        'Use the 20-minute rule to ask high-signal, well-researched questions.'
      ],
      realWorldScenario: {
        title: 'The Intern Capstone That Became Company Standard',
        incident: 'An intern noticed that developers frequently asked the security team in Slack if their S3 buckets complied with company encryption standards. Rather than manually answering questions, the intern wrote a lightweight Slack slash command bot backed by AWS Lambda that queried AWS Config and returned the instant compliance score of any bucket ARN. The tool was adopted company-wide, saving 15 engineering hours weekly. The intern was offered a full-time Senior Security Engineer position upon graduation.',
        impact: 'Proactive engineering transformed an internship into an accelerated career path.',
        detectionMethod: 'Engineering leadership recognized high-initiative, scalable problem solving.'
      },
      commonBeginnerMistakes: [
        'Suffering from imposter syndrome and waiting for managers to spoon-feed instructions.',
        'Making changes in the AWS Console instead of submitting pull requests through Git.',
        'Not taking notes during 1-on-1s, forcing mentors to repeat architectural explanations.',
        'Leaving capstone documentation unfinished before the internship ends.'
      ],
      whatACloudSecEngineerChecks: [
        'Review your 30-60-90 day written plan with your manager during your first week.',
        'Verify your local development environment has all company security linters configured.',
        'Schedule weekly 1-on-1 feedback syncs with your mentor.',
        'Document all contributions in a personal "Brag Sheet" for performance review.'
      ],
      codeSnippet: {
        language: 'markdown',
        title: 'High-Signal Question Template for Junior Engineers & Interns',
        code: `### HOW TO ASK HIGH-SIGNAL QUESTIONS (THE 20-MINUTE RULE):

❌ WEAK QUESTION:
"Hey, I'm trying to run Terraform and it's giving me an AccessDenied error. Can you help?"
(Forces the senior engineer to do all the debugging from scratch).

✅ HIGH-SIGNAL QUESTION:
"Hey Alex, I'm working on ticket SEC-104 deploying the new KMS key. When I run 'terraform apply', 
I'm receiving AccessDenied on 'kms:CreateKey'. 
- I checked my assumed role in 'aws sts get-caller-identity' and confirmed I'm using the DevSecurityRole.
- I checked the account SCPs and saw statement 'DenyUnapprovedKMS' on our OU.
- My hypothesis is that the SCP requires an environment tag 'Environment=Dev' at creation time.
- I tested adding the tag in my local template, but still hit the error. 
Could you take a look at my branch when you have 5 minutes to see if I'm interpreting the SCP condition correctly?"
(Shows research, effort, clear hypothesis, and respects the senior engineer's time!).`
      },
      interviewQuestions: [
        {
          question: 'What is your strategy for your first 30 days when starting as a Cloud Security Engineer at a new company?',
          interviewerRationale: 'Evaluates self-direction, onboarding velocity, intellectual curiosity, and humility.',
          modelAnswer: 'In my first 30 days, my primary focus is understanding the business, the architecture, and building relationships: 1) Architecture & Landing Zone Mapping: I dive into the AWS Organizations topology, reviewing our account structures, SCPs, Transit Gateway routes, and key data flows. 2) Tooling & Paved Roads: I get my local environment running, explore our Terraform repositories, and understand how developers deploy code to production. 3) Shadowing & Listening: I shadow senior engineers on incident triage and on-call rotations, taking detailed notes on recurring pain points. 4) Quick Win: I aim to ship my first small pull request (e.g. updating an outdated runbook or fixing an IaC policy check) within my first two weeks to validate the deployment pipeline and demonstrate immediate value.'
        },
        {
          question: 'How do you approach asking for help when you are stuck on a difficult technical problem during an internship or new role?',
          interviewerRationale: 'Tests problem-solving methodology, autonomy, respect for team time, and communication skills.',
          modelAnswer: 'I practice the "20-Minute Rule". When I hit a blocker, I spend 20 minutes performing focused troubleshooting: checking the exact error message, reading the relevant AWS documentation, querying CloudTrail logs to verify the failed API call, and searching our internal wiki/Slack history for similar past issues. If I am still stuck after 20 minutes, I reach out to my mentor or team channel using a structured format: 1) What I am trying to achieve, 2) The exact error and behavior observed, 3) What I have already tried and ruled out, and 4) My current working hypothesis. This shows initiative, respects my colleagues\' time, and makes it easy for a senior engineer to unblock me in minutes.'
        }
      ],
      awsResources: [
        {
          title: 'AWS Skill Builder: Cloud Security Ramp-Up and Onboarding Guides',
          url: 'https://aws.amazon.com/training/skills/',
          type: 'Skill Builder'
        },
        {
          title: 'Amazon Culture and Working Backwards Framework',
          url: 'https://www.amazon.jobs/content/en/our-workplace/culture',
          type: 'Documentation'
        },
        {
          title: 'First 90 Days in Tech: SRE and Security Onboarding Best Practices',
          url: 'https://sre.google/workbook/on-call/',
          type: 'Security Reference'
        }
      ],
      knowledgeCheck: {
        question: 'Under the "20-Minute Rule" for junior engineers, what should you do when you encounter a technical blocker?',
        options: [
          { id: 'a', text: 'Immediately message your manager the second you see an error message.', isCorrect: false, explanation: 'Interrupting immediately without troubleshooting shows a lack of initiative.' },
          { id: 'b', text: 'Spend 20 minutes researching, reading logs, and forming a hypothesis; if still blocked, ask a concise question detailing what you tried.', isCorrect: true, explanation: 'Correct! Demonstrates structured effort and respects senior team members\' time.' },
          { id: 'c', text: 'Spend 4 full days struggling in silence without telling anyone.', isCorrect: false, explanation: 'Struggling in silence delays project delivery and hides blockers.' },
          { id: 'd', text: 'Skip the task and pretend it was completed.', isCorrect: false, explanation: 'Dishonesty is a severe professional violation.' }
        ]
      },
      bridgeToLabs: {
        type: 'Simulator',
        id: 'sim-05',
        title: 'SOC On-Call Simulator: First Shift Shadowing Simulation',
        url: '/internship-simulator',
        description: 'Experience your first week on-call: shadow alerts, escalate incidents, and complete shift handover reports.'
      }
    }
  ]
}
