// ============================================================================
// SeCloudive Master Job-Specific Interview Question Bank
// Spans Beginner, Intermediate, Advanced, Architecture, Incident Response & Behavioral
// Complete with Model Answers, Evaluation Criteria, Follow-Up Probes, and Hiring Manager Notes
// ============================================================================

import { INTERVIEW_ROLES, ARCHITECTURE_INTERVIEW_SCENARIOS, INCIDENT_RESPONSE_INTERVIEW_SCENARIOS } from './interviewBank.js';

export const MASTER_INTERVIEW_BANK = [
  ...INTERVIEW_ROLES,

  // --- SOC Analyst Interview Bank ---
  {
    id: 'soc-analyst',
    title: 'SOC Analyst (Cloud Tier 1 / 2)',
    badge: 'HIGH VOLUME HIRING',
    shortDesc: 'SIEM log correlation, Athena querying, GuardDuty triage, and rapid account containment.',
    salaryRange: '$75,000 - $115,000',
    marketDemand: 'CRITICAL',
    mustKnowSkills: ['CloudTrail Triage', 'GuardDuty Alerting', 'VPC Flow Logs', 'Athena SQL', 'Security Hub'],
    questions: {
      beginner: [
        {
          id: 'soc-b1',
          question: 'What is the exact distinction between CloudTrail Management Events and CloudTrail Data Events, and why are Data Events not enabled by default on all S3 buckets?',
          sampleAnswerHint: 'Management events capture control-plane actions (CreateUser, RunInstances, PutBucketPolicy). Data events capture resource-level operations (GetObject, PutObject). Data events are high-volume and incur significant per-event costs, so they are enabled selectively on sensitive data stores.',
          rubric: 'Accurately distinguishes control-plane vs data-plane, mentions cost and volume considerations, and identifies compliance necessity.',
          followUp: 'If you suspect data was exfiltrated from an S3 bucket that lacked data events, what other logs could you consult?',
          hiringNotes: 'Candidate must mention S3 Server Access Logs or VPC Flow Logs as alternative forensic sources.'
        },
        {
          id: 'soc-b2',
          question: 'Explain what an event with errorCode "Client.UnauthorizedOperation" or "AccessDenied" in CloudTrail indicates during an investigation.',
          sampleAnswerHint: 'It indicates that an API request was evaluated by AWS IAM and failed authorization. A cluster of AccessDenied errors often signifies an attacker conducting discovery or attempting privilege escalation against unpermitted resources.',
          rubric: 'Understands IAM policy evaluation failure, recognizes discovery/reconnaissance patterns, and avoids dismissing as harmless error.',
          followUp: 'How do you differentiate between a developer misconfiguration and a threat actor probing permissions?',
          hiringNotes: 'Look for answers mentioning baseline comparison, user-agent anomalies, off-hours timing, and rapid sequence of distinct API calls.'
        }
      ],
      intermediate: [
        {
          id: 'soc-i1',
          question: 'In Amazon VPC Flow Logs, what does a log entry with action "REJECT" and destination port 445 indicate, and what is your next triage step?',
          sampleAnswerHint: 'It indicates an inbound SMB connection attempt that was blocked by Security Group or NACL rules. Next step is querying VPC Flow Logs across the subnet to determine if other hosts were targeted, verifying source IP reputation in threat intel feeds, and checking if any connection succeeded with action ACCEPT.',
          rubric: 'Identifies port 445 (SMB), understands network boundary enforcement, checks for lateral movement or internet scans, and queries for ACCEPT events.',
          followUp: 'If the log shows ACCEPT on port 445, what is your immediate containment action?',
          hiringNotes: 'Candidate should recommend modifying the security group to remove the permissive inbound rule immediately.'
        },
        {
          id: 'soc-i2',
          question: 'Walk me through how you investigate a GuardDuty finding: "Recon:IAMUser/NetworkPermissions".',
          sampleAnswerHint: '1. Identify the IAM identity and access key ID in the finding details. 2. Query CloudTrail in Athena for all actions performed by that principal in the past 24 hours. 3. Review the source IP address, ASN, and geographic location. 4. Determine if the network discovery calls (e.g. DescribeSecurityGroups, DescribeVpcs) align with standard operational baselines. 5. If anomalous, escalate to CIRT and revoke the session.',
          rubric: 'Structured 5-step investigative workflow: Identity -> Athena CloudTrail -> Geo/ASN -> Baseline comparison -> Containment.',
          followUp: 'What specific query would you run in Athena to see all actions performed by this user in that timeframe?',
          hiringNotes: 'Tests hands-on query familiarity: SELECT eventname, sourceipaddress FROM cloudtrail_logs WHERE useridentity.arn = ...'
        }
      ],
      advanced: [
        {
          id: 'soc-a1',
          question: 'You discover that an attacker assumed an IAM role and executed multiple malicious commands, but legitimate production workloads are also actively using that exact same role. How do you revoke the attacker\'s access without taking down production?',
          sampleAnswerHint: 'Do NOT delete the role or revoke broad permissions. Instead, identify the specific assumed-role session name or issue timestamp. Apply an inline IAM policy with an explicit Deny using the condition key `aws:TokenIssueTime` specifying a cutoff timestamp, or deny the specific `aws:userId` session ARN `role-name:attacker-session-id`.',
          rubric: 'Understands `aws:TokenIssueTime` condition, session-specific ARN blocking, and avoids blunt destructive role deletion.',
          followUp: 'How would you find the exact session timestamp in CloudTrail?',
          hiringNotes: 'Key differentiator between junior and senior SOC analysts: knowledge of non-destructive production containment.'
        }
      ],
      behavioral: [
        {
          id: 'soc-beh1',
          question: 'Describe a situation where a developer insisted a security alert was a false positive, but your investigation revealed real suspicious behavior. How did you handle the conflict?',
          sampleAnswerHint: 'Emphasize evidence-based communication: walked through CloudTrail timeline logs side-by-side, maintained objective focus on the anomalous IP/payload, and collaborated on securing the credential rather than assigning personal blame.',
          rubric: 'Demonstrates diplomatic technical communication, grounding in objective evidence, and blameless post-mortem culture.',
          followUp: 'What did you do afterward to ensure similar false positive claims don\'t delay response time?',
          hiringNotes: 'Assesses emotional intelligence, cross-functional collaboration, and continuous improvement mindset.'
        }
      ]
    }
  },

  // --- DevSecOps Engineer Interview Bank ---
  {
    id: 'devsecops-engineer',
    title: 'DevSecOps Engineer',
    badge: 'HIGH DEMAND',
    shortDesc: 'Automating security gates in CI/CD, Terraform compliance, OIDC federation, and container hardening.',
    salaryRange: '$130,000 - $180,000',
    marketDemand: 'VERY HIGH',
    mustKnowSkills: ['Terraform Checkov', 'GitHub Actions OIDC', 'Container Vulnerability Scanning', 'Secrets Manager', 'SLSA'],
    questions: {
      beginner: [
        {
          id: 'dso-b1',
          question: 'Why should CI/CD pipelines never store permanent AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in GitHub repository secrets, and what is the modern replacement?',
          sampleAnswerHint: 'Static keys can be leaked via pull requests, build logs, or compromised runner environments and do not rotate. The modern gold standard is OpenID Connect (OIDC) federation with AWS IAM, which issues short-lived temporary STS tokens scoped to specific repository branches.',
          rubric: 'Contrasts static credentials vs OIDC temporary credentials, mentions AWS STS, and explains branch scoping.',
          followUp: 'What IAM condition key ensures that only your organization\'s main branch can assume the deployment role?',
          hiringNotes: 'Must mention `token.actions.githubusercontent.com:sub` with `repo:org/repo:ref:refs/heads/main`.'
        }
      ],
      intermediate: [
        {
          id: 'dso-i1',
          question: 'How do you handle sensitive database passwords in Terraform without leaking them into plaintext in `terraform.tfstate` stored in an S3 bucket?',
          sampleAnswerHint: 'Terraform state natively stores sensitive inputs in plaintext. To mitigate this: 1. Generate secrets dynamically using AWS Secrets Manager or KMS rather than hardcoding. 2. Lock S3 state bucket with KMS CMK encryption and restrictive bucket policies. 3. Use Terraform ephemeral values or remote execution backends like HCP Terraform. 4. Never store outputs of secrets in version control.',
          rubric: 'Acknowledges native Terraform state limitation, provides layered cryptographic defense, and recommends dynamic secrets management.',
          followUp: 'If an intern accidentally commits a terraform.tfvars containing an API key, what are your immediate actions?',
          hiringNotes: 'Must mention immediate key revocation/rotation first, before Git history scrubbing.'
        }
      ],
      advanced: [
        {
          id: 'dso-a1',
          question: 'Explain how you design a multi-stage security gate in a GitHub Actions pipeline that enforces zero-trust container deployments to Amazon EKS.',
          sampleAnswerHint: '1. SAST & Secret Scanning with Semgrep and Gitleaks. 2. Infrastructure as Code scanning with Checkov/Tfsec. 3. Container base image vulnerability scanning with Trivy. 4. Image signing with Cosign / Sigstore. 5. EKS admission control using Kyverno or OPA Gatekeeper verifying image cryptographic signatures before allowing pod creation.',
          rubric: 'Covers code, IaC, artifact scanning, image signing, and admission controller policy enforcement.',
          followUp: 'How do you prevent developers from bypassing the Kyverno admission controller during an emergency release?',
          hiringNotes: 'Evaluates architectural maturity: Break-glass role with automated auditing and PagerDuty notification.'
        }
      ]
    }
  },

  // --- Cloud Security Architect Interview Bank ---
  {
    id: 'security-architect',
    title: 'Cloud Security Architect',
    badge: 'EXECUTIVE & LEAD',
    shortDesc: 'Threat modeling, multi-account landing zones, zero-trust network inspection, and board risk posture.',
    salaryRange: '$175,000 - $245,000+',
    marketDemand: 'VERY HIGH',
    mustKnowSkills: ['AWS Control Tower', 'Zero Trust Architecture', 'STRIDE Threat Modeling', 'CloudHSM / BYOK', 'Transit Gateway Firewall'],
    questions: {
      advanced: [
        {
          id: 'csa-a1',
          question: 'Design a multi-region landing zone architecture that isolates a PCI-DSS Cardholder Data Environment (CDE) while allowing centralized security inspection and identity management.',
          sampleAnswerHint: '1. Dedicated AWS Organization OU for CDE accounts, separate from Corporate and Shared Services. 2. Centralized Network/Inspection account hosting AWS Network Firewall and Transit Gateway. 3. Zero direct VPC peering between CDE and non-CDE VPCs. 4. AWS IAM Identity Center with mandatory WebAuthn FIDO2 MFA. 5. Centralized CloudTrail Lake and KMS CMKs with dedicated audit account.',
          rubric: 'Presents account separation, dedicated inspection VPC, cryptographic boundaries, and compliance scoping.',
          followUp: 'How do you prevent developers in non-CDE accounts from creating resources that route into the CDE?',
          hiringNotes: 'Must articulate AWS RAM sharing constraints and Transit Gateway route table isolation.'
        }
      ]
    }
  }
];

export default MASTER_INTERVIEW_BANK;
