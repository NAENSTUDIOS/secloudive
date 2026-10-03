/**
 * SeCloudive Initial 2-Minute Diagnostic Placement Test ("Skill Baseline Test")
 * Benchmarks candidate knowledge across core domains:
 * - Identity & Access Management (IAM)
 * - VPC & Network Security
 * - Resilient Architecture & Decoupling
 * - S3 Storage & Data Protection
 * - Threat Detection & Incident Response
 */

export const DIAGNOSTIC_DOMAINS = {
  iam: {
    id: 'iam',
    name: 'IAM & Access Governance',
    icon: 'Key',
    recommendedPathId: 'iam',
    pathTitle: 'Identity & Access Management (IAM) Path',
    badge: 'IAM Guardian'
  },
  network: {
    id: 'network',
    name: 'VPC & Network Security',
    icon: 'Network',
    recommendedPathId: 'network',
    pathTitle: 'VPC & Network Security Path',
    badge: 'Perimeter Defender'
  },
  architecture: {
    id: 'architecture',
    name: 'Resilient Cloud Architecture',
    icon: 'Layers',
    recommendedPathId: 'architecture',
    pathTitle: 'Resilient Architecture & Well-Architected Path',
    badge: 'Reliability Architect'
  },
  s3: {
    id: 's3',
    name: 'S3 Data Protection & Encryption',
    icon: 'Database',
    recommendedPathId: 's3',
    pathTitle: 'S3 Data Protection & Storage Security Path',
    badge: 'Data Security Sentinel'
  },
  monitoring: {
    id: 'monitoring',
    name: 'Detection & Incident Response',
    icon: 'ShieldAlert',
    recommendedPathId: 'incident-response',
    pathTitle: 'Incident Response & Threat Containment Path',
    badge: 'SOC Incident Commander'
  }
}

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'diag-iam-01',
    domain: 'iam',
    domainName: 'Identity & Access Management',
    difficulty: 'Intermediate',
    estimatedSeconds: 25,
    scenario: 'IAM Evaluation Logic & Permissions Boundaries',
    question:
      'An IAM Role has an attached Identity-based Policy allowing "s3:*" across all resources. An administrator subsequently attaches an IAM Permissions Boundary allowing only "s3:GetObject" and "s3:ListBucket". What occurs when an application assuming this role attempts to call "s3:PutObject"?',
    options: [
      {
        id: 'A',
        text: 'The PutObject request succeeds because identity policies take precedence over permissions boundaries within the same account.'
      },
      {
        id: 'B',
        text: 'The PutObject request is rejected with an explicit AccessDenied error because permissions boundaries set the maximum allowable permissions (intersection logic).',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'The PutObject request succeeds only if S3 Block Public Access is disabled at the target bucket level.'
      },
      {
        id: 'D',
        text: 'The request is held in an asynchronous IAM queue until an administrator approves the policy divergence.'
      }
    ],
    explanation:
      'In AWS IAM policy evaluation, an action is allowed only if both the identity-based policy AND the permissions boundary allow it (the intersection). Because "s3:PutObject" is not explicitly permitted by the boundary, the resulting effective permission evaluates to an implicit deny.',
    citation: 'AWS IAM User Guide — Evaluating Policies: Permissions Boundaries'
  },
  {
    id: 'diag-net-02',
    domain: 'network',
    domainName: 'VPC & Network Security',
    difficulty: 'Intermediate',
    estimatedSeconds: 25,
    scenario: 'Private Subnet Data Ingestion & VPC Isolation',
    question:
      'An Amazon EC2 cluster resides in a strictly private subnet with no public IP addresses and no NAT Gateway. The cluster must securely upload heavy log batches to Amazon S3 without incurring data transfer charges or routing traffic across the public internet. Which architectural control fulfills this requirement?',
    options: [
      {
        id: 'A',
        text: 'Deploy an AWS Client VPN and route S3 HTTPS traffic over a virtual network adapter.'
      },
      {
        id: 'B',
        text: 'Create a VPC Gateway Endpoint for Amazon S3 and associate it with the private subnet\'s route table.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Attach an Internet Gateway to the VPC and configure an egress Security Group rule permitting port 443.'
      },
      {
        id: 'D',
        text: 'Launch an EC2 NAT instance in the private subnet with IP forwarding and iptables masquerade.'
      }
    ],
    explanation:
      'VPC Gateway Endpoints for Amazon S3 (and DynamoDB) provide private, direct routing from VPC subnets to S3 across the AWS global backbone. They are free of charge, require no NAT device or internet gateway, and are secured using Endpoint Policies and Route Table entries.',
    citation: 'AWS VPC User Guide — Gateway VPC Endpoints for Amazon S3'
  },
  {
    id: 'diag-arch-03',
    domain: 'architecture',
    domainName: 'Resilient Architecture & Decoupling',
    difficulty: 'Advanced',
    estimatedSeconds: 25,
    scenario: 'High-Concurrency Spikes & Decoupled Processing',
    question:
      'During sudden traffic spikes, a synchronous REST microservice fails because the relational database hits 100% CPU utilization, causing connection pool exhaustion and dropped user requests. According to the AWS Well-Architected Reliability Pillar, what design refactoring should you apply?',
    options: [
      {
        id: 'A',
        text: 'Upgrade the database instance to the largest available vertical instance class and turn off Multi-AZ replication.'
      },
      {
        id: 'B',
        text: 'Introduce an Amazon SQS queue between the frontend API and the worker tier to decouple and buffer ingestion, scaling worker consumers via Auto Scaling.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Store order payloads directly in EC2 ephemeral instance store volumes and write a root cron job to flush them periodically.'
      },
      {
        id: 'D',
        text: 'Deploy an Application Load Balancer directly in front of the database on TCP port 3306.'
      }
    ],
    explanation:
      'Decoupling synchronous components using message queues (Amazon SQS) prevents traffic surges from overwhelming downstream relational databases. The queue absorbs traffic spikes safely, while worker nodes scale horizontally to drain messages at a sustainable database write rate.',
    citation: 'AWS Well-Architected Framework — Reliability Pillar: Loose Coupling'
  },
  {
    id: 'diag-s3-04',
    domain: 's3',
    domainName: 'S3 Data Protection & Encryption',
    difficulty: 'Intermediate',
    estimatedSeconds: 25,
    scenario: 'Ransomware & Malicious Object Deletion Mitigation',
    question:
      'A compliance auditor mandates that an S3 bucket storing regulatory financial records must prevent object deletion or overwrite—even by the AWS Account Root User or compromised administrative IAM credentials—for a mandatory 7-year retention period. Which configuration guarantees this immutability?',
    options: [
      {
        id: 'A',
        text: 'Enable S3 Server-Side Encryption with Amazon S3 managed keys (SSE-S3) and set bucket CORS rules to GET only.'
      },
      {
        id: 'B',
        text: 'Enable S3 Versioning and configure S3 Object Lock in Compliance Mode with a 7-year retention period.',
        isCorrect: true
      },
      {
        id: 'C',
        text: 'Apply an S3 Lifecycle Rule that transitions all objects to S3 Glacier Deep Archive after 24 hours.'
      },
      {
        id: 'D',
        text: 'Configure an AWS WAF Web ACL on the bucket with IP rate-limiting rules targeting HTTP DELETE methods.'
      }
    ],
    explanation:
      'S3 Object Lock in Compliance Mode enforces strict WORM (Write Once, Read Many) immutability. During the retention period, no user—including the root account user or AWS Support—can overwrite or delete protected object versions until the retention timer elapses.',
    citation: 'Amazon S3 User Guide — Locking Objects Using Compliance Mode'
  },
  {
    id: 'diag-mon-05',
    domain: 'monitoring',
    domainName: 'Detection & Incident Response',
    difficulty: 'Advanced',
    estimatedSeconds: 25,
    scenario: 'Compromised Access Key Triage & Containment',
    question:
      'An automated Amazon GuardDuty finding alert ("UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration") indicates an IAM user\'s long-term access keys were exfiltrated and are generating abnormal DescribeInstances calls from an unrecognized overseas IP address. What is the immediate first-priority containment action?',
    options: [
      {
        id: 'A',
        text: 'Immediately change the IAM user password, deactivate or delete the compromised Access Key ID, and attach an inline deny-all policy or revoke active STS sessions.',
        isCorrect: true
      },
      {
        id: 'B',
        text: 'Reboot all EC2 instances across all availability zones to flush memory-resident credentials.'
      },
      {
        id: 'C',
        text: 'Issue a support ticket to AWS and wait 48 hours for automated telemetry confirmation before modifying IAM entities.'
      },
      {
        id: 'D',
        text: 'Grant the IAM user temporary AdministratorAccess to determine if the attacker attempts privilege escalation.'
      }
    ],
    explanation:
      'In accordance with standard SOC SOPs and the AWS Incident Response Guide, immediate containment for compromised IAM access keys is deactivating the active key pair, attaching an explicit Deny policy (or AWSRevokeOlderSessions), and invalidating temporary STS sessions to cut off the adversary instantly.',
    citation: 'AWS Security Incident Response Guide — Handling Compromised IAM Credentials'
  }
]

/**
 * Evaluates submitted diagnostic answers and computes:
 * - Overall percentage & points
 * - Domain-by-domain mastery scores
 * - Weakest domain identification
 * - Recommended learning path and rationale
 */
export function evaluateDiagnosticPlacement(userAnswers) {
  let correctCount = 0
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length
  const domainBreakdown = {}

  // Initialize domains
  Object.keys(DIAGNOSTIC_DOMAINS).forEach(domKey => {
    domainBreakdown[domKey] = {
      domainId: domKey,
      name: DIAGNOSTIC_DOMAINS[domKey].name,
      pathTitle: DIAGNOSTIC_DOMAINS[domKey].pathTitle,
      recommendedPathId: DIAGNOSTIC_DOMAINS[domKey].recommendedPathId,
      total: 0,
      correct: 0,
      scorePct: 0
    }
  })

  DIAGNOSTIC_QUESTIONS.forEach(q => {
    const isCorrect = userAnswers[q.id] === q.options.find(opt => opt.isCorrect)?.id
    if (isCorrect) correctCount++

    if (domainBreakdown[q.domain]) {
      domainBreakdown[q.domain].total += 1
      if (isCorrect) domainBreakdown[q.domain].correct += 1
      domainBreakdown[q.domain].scorePct = Math.round(
        (domainBreakdown[q.domain].correct / domainBreakdown[q.domain].total) * 100
      )
    }
  })

  const overallPercentage = Math.round((correctCount / totalQuestions) * 100)

  // Determine skill level tier
  let skillLevel = 'Aspiring Cloud Practitioner'
  let skillBadge = 'Novice Scout'
  let summaryRationale = ''

  if (overallPercentage === 100) {
    skillLevel = 'Elite Cloud Security Specialist'
    skillBadge = 'Master Cloud Defender'
    summaryRationale =
      'Flawless diagnostic mastery. You demonstrated thorough architectural command of IAM boundaries, private VPC routing, SQS decoupling, S3 Object Lock, and incident triage.'
  } else if (overallPercentage >= 80) {
    skillLevel = 'Advanced Cloud Security Engineer'
    skillBadge = 'Senior Threat Analyst'
    summaryRationale =
      'Strong cloud security foundation with specialized domain strengths. Targeting your specific missed domain will quickly qualify you for senior architecture and SOC tier-2 roles.'
  } else if (overallPercentage >= 60) {
    skillLevel = 'Associate Cloud Practitioner'
    skillBadge = 'Practitioner Associate'
    summaryRationale =
      'Solid working familiarity with AWS cloud primitives. Strengthening your core policy evaluation and network boundary mechanics will elevate your technical problem-solving.'
  } else if (overallPercentage >= 40) {
    skillLevel = 'Foundational Cloud Learner'
    skillBadge = 'Junior Builder'
    summaryRationale =
      'Good initial instincts. We recommend starting with structured foundational paths to solidify AWS shared responsibility, IAM evaluation, and secure VPC layouts.'
  } else {
    skillLevel = 'Cloud Security Explorer'
    skillBadge = 'Cadet Initiate'
    summaryRationale =
      'Welcome to cloud security! Starting from first principles will give you a decisive advantage over memorization-based learning.'
  }

  // Find weakest domain(s)
  const sortedDomains = Object.values(domainBreakdown).sort((a, b) => a.scorePct - b.scorePct)
  const weakestDomain = sortedDomains[0]

  // Decide recommended starting path
  let recommendedPathId = 'iam'
  let recommendedPathTitle = 'Identity & Access Management (IAM) Path'
  let recommendationReason = ''

  if (overallPercentage < 40) {
    recommendedPathId = 'foundations'
    recommendedPathTitle = 'Cloud Security Foundations & Shared Responsibility'
    recommendationReason =
      'Build your core security vocabulary, shared responsibility mental model, and AWS global infrastructure basics before tackling complex multi-vector scenarios.'
  } else if (overallPercentage === 100) {
    recommendedPathId = 'incident-response'
    recommendedPathTitle = 'Incident Response & Threat Containment Path'
    recommendationReason =
      'You are ready for adversarial combat. Dive straight into live incident containment, forensic log analysis, and threat neutralization.'
  } else {
    // Recommend the weakest domain path
    recommendedPathId = weakestDomain.recommendedPathId
    recommendedPathTitle = weakestDomain.pathTitle
    recommendationReason = `Your baseline assessment flagged ${weakestDomain.name} as your highest-impact growth area. Mastering this module will close your primary security skill gap.`
  }

  return {
    correctCount,
    totalQuestions,
    overallPercentage,
    skillLevel,
    skillBadge,
    summaryRationale,
    domainBreakdown,
    weakestDomain,
    recommendedPathId,
    recommendedPathTitle,
    recommendationReason,
    completedAt: new Date().toISOString()
  }
}
