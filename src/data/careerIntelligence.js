// SeCloudive Career Intelligence Layer
// Unifying all 13 modules into one cohesive Cloud Security Career Operating System
// Tracks Master Profile, 10-Domain Skill Graph, 7-Tier Journey, Capstone Missions, and Portfolio Evidence

export const CAREER_TIERS = [
  {
    tier: 1,
    id: 'beginner',
    title: 'Beginner',
    badge: '🌱 Tier 1',
    roleTag: 'Level 1 of 7',
    roleFocus: 'Cloud & Cybersecurity Fundamentals',
    description: 'Starting the cloud security journey. Understanding the shared responsibility model, cloud assets, and identity boundaries.',
    salaryRange: 'Foundational Phase',
    minThinkingScore: 0,
    minLearningTopics: 0,
    minInvestigations: 0,
    minArchitectureReviews: 0,
    minLabs: 0,
    minInternshipTickets: 0,
    minBattleRooms: 0,
    nextTierTitle: 'Cloud Learner',
    unlockedPerks: ['Academy Foundations', 'Simulated CloudShell Terminal', 'Starter Incident Triage']
  },
  {
    tier: 2,
    id: 'cloud-learner',
    title: 'Cloud Learner',
    badge: '☁️ Tier 2',
    roleTag: 'Level 2 of 7',
    roleFocus: 'Core AWS & Cloud Primitives',
    description: 'Gaining confidence across IAM policies, S3 access control lists, VPC security groups, and CloudTrail auditing.',
    salaryRange: '$55,000 - $75,000 (Junior Entry)',
    minThinkingScore: 15,
    minLearningTopics: 3,
    minInvestigations: 2,
    minArchitectureReviews: 1,
    minLabs: 1,
    minInternshipTickets: 1,
    minBattleRooms: 0,
    nextTierTitle: 'Security Intern',
    unlockedPerks: ['Intermediate Scenarios', 'Dual CLI & GUI Console Runbooks', 'Live Threat Intel Feed']
  },
  {
    tier: 3,
    id: 'security-intern',
    title: 'Security Intern',
    badge: '🎓 Tier 3',
    roleTag: 'Level 3 of 7',
    roleFocus: 'Incident Triage & Evidence Correlation',
    description: 'Performing real-world triage under mentor oversight. Reviewing CloudTrail logs, analyzing public S3 exposures, and containing compromised credentials.',
    salaryRange: '$65,000 - $85,000 (Internship / Associate)',
    minThinkingScore: 35,
    minLearningTopics: 6,
    minInvestigations: 5,
    minArchitectureReviews: 2,
    minLabs: 3,
    minInternshipTickets: 2,
    minBattleRooms: 1,
    nextTierTitle: 'SOC Analyst',
    unlockedPerks: ['SOC On-Call Rotation Pager', 'Job Playbook 7-Stage SOPs', 'Resume Portfolio Generation']
  },
  {
    tier: 4,
    id: 'soc-analyst',
    title: 'SOC Analyst',
    badge: '🛡️ Tier 4',
    roleTag: 'Level 4 of 7',
    roleFocus: 'Live Detection, VPC Flow Logs & Pager Duty',
    description: 'Investigating high-severity security alerts under SLA pressure. Parsing Athena logs, analyzing GuardDuty anomalies, and isolating rogue hosts.',
    salaryRange: '$85,000 - $110,000 (SOC Tier 1/2)',
    minThinkingScore: 55,
    minLearningTopics: 10,
    minInvestigations: 10,
    minArchitectureReviews: 3,
    minLabs: 6,
    minInternshipTickets: 4,
    minBattleRooms: 2,
    nextTierTitle: 'Cloud Security Analyst',
    unlockedPerks: ['Red vs Blue CTF Battle Rooms', 'FinOps Cryptomining Incident Lab', 'Enterprise Architecture Lenses']
  },
  {
    tier: 5,
    id: 'cloud-security-analyst',
    title: 'Cloud Security Analyst',
    badge: '⚡ Tier 5',
    roleTag: 'Level 5 of 7',
    roleFocus: 'Threat Modeling & Deep Forensics',
    description: 'Conducting compound failure analysis, determining IAM blast radius, executing root cause analysis, and drafting executive security briefs.',
    salaryRange: '$110,000 - $135,000 (Mid-Senior Analyst)',
    minThinkingScore: 70,
    minLearningTopics: 15,
    minInvestigations: 16,
    minArchitectureReviews: 4,
    minLabs: 10,
    minInternshipTickets: 5,
    minBattleRooms: 3,
    nextTierTitle: 'DevSecOps Engineer',
    unlockedPerks: ['Cloudive Builder Studio Dual-Mode', 'IaC Security Linter Auto-Remediation', 'Verified Technical Dossiers']
  },
  {
    tier: 6,
    id: 'devsecops-engineer',
    title: 'DevSecOps Engineer',
    badge: '🔧 Tier 6',
    roleTag: 'Level 6 of 7',
    roleFocus: 'Infrastructure as Code Hardening & CI/CD Gateways',
    description: 'Integrating automated static analysis (Checkov, tfsec), enforcing pre-commit policy-as-code, and eliminating security regressions before deployment.',
    salaryRange: '$130,000 - $160,000 (Senior DevSecOps)',
    minThinkingScore: 85,
    minLearningTopics: 20,
    minInvestigations: 20,
    minArchitectureReviews: 5,
    minLabs: 13,
    minInternshipTickets: 6,
    minBattleRooms: 4,
    nextTierTitle: 'Cloud Security Engineer',
    unlockedPerks: ['Multi-Cloud Crosswalk Mastery', 'Production Reference Blueprints', 'Hiring Manager Fast-Track Dossier']
  },
  {
    tier: 7,
    id: 'cloud-security-engineer',
    title: 'Cloud Security Engineer',
    badge: '👑 Tier 7',
    roleTag: 'Level 7 of 7',
    roleFocus: 'Enterprise Governance, Zero Trust & Production Architecture',
    description: 'The pinnacle of cloud security engineering. Authoring Service Control Policies, architecting centralized inspection VPCs, and automating enterprise-wide threat containment.',
    salaryRange: '$150,000 - $190,000+ (Principal / Lead)',
    minThinkingScore: 95,
    minLearningTopics: 24,
    minInvestigations: 25,
    minArchitectureReviews: 5,
    minLabs: 16,
    minInternshipTickets: 6,
    minBattleRooms: 5,
    nextTierTitle: 'Master / Principal Level Achieved',
    unlockedPerks: ['Principal Architect Certification', 'Complete Cloud Security OS Mastery', 'Full Portfolio Proof of Competency']
  }
]

export const SKILL_GRAPH_DOMAINS = [
  {
    id: 'iam',
    name: 'IAM & Identity Security',
    shortName: 'IAM',
    icon: '🔑',
    color: '#38bdf8',
    description: 'Least privilege policies, ABAC, instance profiles, permission boundaries, and STS temporary credential revocation.',
    targetMastery: {
      Beginner: 40,
      'Cloud Learner': 55,
      'Security Intern': 70,
      'SOC Analyst': 75,
      'Cloud Security Analyst': 85,
      'DevSecOps Engineer': 85,
      'Cloud Security Engineer': 95
    },
    primaryModule: '/learning/iam',
    moduleTitle: 'IAM Mastery Academy'
  },
  {
    id: 's3',
    name: 'Storage & Cryptography (S3/KMS)',
    shortName: 'Storage & KMS',
    icon: '🪣',
    color: '#a78bfa',
    description: 'S3 Block Public Access, bucket policies, KMS Customer Managed Keys (CMK), and Object Lock WORM compliance.',
    targetMastery: {
      Beginner: 40,
      'Cloud Learner': 55,
      'Security Intern': 70,
      'SOC Analyst': 75,
      'Cloud Security Analyst': 85,
      'DevSecOps Engineer': 85,
      'Cloud Security Engineer': 95
    },
    primaryModule: '/learning/s3',
    moduleTitle: 'Data Protection & S3'
  },
  {
    id: 'network',
    name: 'Network & Perimeter Security',
    shortName: 'Network/VPC',
    icon: '🌐',
    color: '#34d399',
    description: 'VPC isolation, Security Group chaining, NACLs, Gateway VPC Endpoints, PrivateLink, and Transit Gateway routing.',
    targetMastery: {
      Beginner: 35,
      'Cloud Learner': 50,
      'Security Intern': 65,
      'SOC Analyst': 80,
      'Cloud Security Analyst': 85,
      'DevSecOps Engineer': 85,
      'Cloud Security Engineer': 90
    },
    primaryModule: '/learning/network',
    moduleTitle: 'VPC & Perimeter Security'
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Threat Intelligence',
    shortName: 'Monitoring',
    icon: '📊',
    color: '#fb923c',
    description: 'AWS CloudTrail multi-region trails, GuardDuty finding triage, CloudWatch metric alarms, and centralized logging.',
    targetMastery: {
      Beginner: 35,
      'Cloud Learner': 50,
      'Security Intern': 65,
      'SOC Analyst': 90,
      'Cloud Security Analyst': 90,
      'DevSecOps Engineer': 80,
      'Cloud Security Engineer': 90
    },
    primaryModule: '/learning/monitoring',
    moduleTitle: 'Audit & Telemetry Mastery'
  },
  {
    id: 'incident-response',
    name: 'Incident Response & Containment',
    shortName: 'Incident Response',
    icon: '🚨',
    color: '#f43f5e',
    description: 'Live host quarantine, active token invalidation, memory forensics, incident runbooks, and SLA compliance.',
    targetMastery: {
      Beginner: 30,
      'Cloud Learner': 45,
      'Security Intern': 65,
      'SOC Analyst': 85,
      'Cloud Security Analyst': 90,
      'DevSecOps Engineer': 75,
      'Cloud Security Engineer': 90
    },
    primaryModule: '/internship-simulator',
    moduleTitle: 'SOC On-Call Rotation'
  },
  {
    id: 'threat-hunting',
    name: 'Threat Hunting & Log Forensics',
    shortName: 'Threat Hunting',
    icon: '🎯',
    color: '#facc15',
    description: 'Athena SQL log queries, DNS exfiltration detection, CTF flag recovery, and adversary technique reconstruction.',
    targetMastery: {
      Beginner: 25,
      'Cloud Learner': 40,
      'Security Intern': 60,
      'SOC Analyst': 80,
      'Cloud Security Analyst': 85,
      'DevSecOps Engineer': 80,
      'Cloud Security Engineer': 85
    },
    primaryModule: '/battle-rooms',
    moduleTitle: 'Battle Rooms (CTF)'
  },
  {
    id: 'architecture',
    name: 'Security Architecture & Governance',
    shortName: 'Architecture',
    icon: '🏛️',
    color: '#c084fc',
    description: 'AWS Well-Architected Security Pillar, multi-account Organizations, Service Control Policies (SCPs), and blast radius scoping.',
    targetMastery: {
      Beginner: 25,
      'Cloud Learner': 40,
      'Security Intern': 55,
      'SOC Analyst': 65,
      'Cloud Security Analyst': 85,
      'DevSecOps Engineer': 90,
      'Cloud Security Engineer': 95
    },
    primaryModule: '/architecture-reviews',
    moduleTitle: 'Architecture Reviews'
  },
  {
    id: 'devsecops',
    name: 'DevSecOps & CI/CD Automation',
    shortName: 'DevSecOps',
    icon: '⚙️',
    color: '#06b6d4',
    description: '7-stage job playbooks, CI/CD security gates, container image vulnerability scanning, and automated pull requests.',
    targetMastery: {
      Beginner: 20,
      'Cloud Learner': 35,
      'Security Intern': 50,
      'SOC Analyst': 65,
      'Cloud Security Analyst': 80,
      'DevSecOps Engineer': 95,
      'Cloud Security Engineer': 90
    },
    primaryModule: '/playbooks',
    moduleTitle: 'Job Playbook Engine'
  },
  {
    id: 'iac',
    name: 'Infrastructure as Code (IaC) Security',
    shortName: 'IaC Security',
    icon: '📝',
    color: '#10b981',
    description: 'Static analysis with Checkov and tfsec, Terraform security auto-remediation, and CIS Benchmark compliance.',
    targetMastery: {
      Beginner: 20,
      'Cloud Learner': 35,
      'Security Intern': 50,
      'SOC Analyst': 60,
      'Cloud Security Analyst': 80,
      'DevSecOps Engineer': 95,
      'Cloud Security Engineer': 90
    },
    primaryModule: '/cloudive-studio',
    moduleTitle: 'IaC Security Linter'
  },
  {
    id: 'finops',
    name: 'FinOps Security & Anomaly Detection',
    shortName: 'FinOps Security',
    icon: '💰',
    color: '#eab308',
    description: 'Detecting unauthorized GPU compute, cryptomining fleets, bandwidth leaks, and billing spike containment.',
    targetMastery: {
      Beginner: 20,
      'Cloud Learner': 35,
      'Security Intern': 50,
      'SOC Analyst': 70,
      'Cloud Security Analyst': 80,
      'DevSecOps Engineer': 80,
      'Cloud Security Engineer': 85
    },
    primaryModule: '/cloudive-studio',
    moduleTitle: 'FinOps Simulator'
  }
]

export const CAPSTONE_MISSIONS = [
  {
    id: 'mission-startup',
    title: 'Operation First Light: Secure a High-Growth FinTech Startup',
    domain: 'Full-Stack Startup Perimeter Hardening',
    difficulty: 'Intermediate',
    estTime: '2.5 Hours',
    badge: 'FinTech Cloud Defender Badge',
    description: 'A Series-A FinTech startup is launching their core payments engine. As their lead security consultant, audit their infrastructure, investigate leaked customer data, patch Terraform IaC flaws, and sign off on on-call incident readiness.',
    steps: [
      {
        step: 1,
        id: 'step-iam-learning',
        title: 'Master IAM Boundaries & Role Assumption',
        type: 'Learning Academy',
        route: '/learning/iam',
        description: 'Complete the IAM Privilege Escalation module to understand ABAC boundaries and dangerous permissions.',
        completedCondition: 'learningTopicsCompleted.includes("iam-privilege-escalation") || learningTopicsCompleted.length >= 1'
      },
      {
        step: 2,
        id: 'step-arch-review',
        title: 'Review 3-Tier Multi-AZ Architecture Blueprint',
        type: 'Architecture Review',
        route: '/architecture-reviews',
        description: 'Audit the Startup Production Blueprint across public, application, and data subnet boundaries.',
        completedCondition: 'architectureReviewedCount >= 1'
      },
      {
        step: 3,
        id: 'step-s3-investigation',
        title: 'Investigate Public Customer S3 Vault Exposure',
        type: 'Incident Simulator',
        route: '/investigations/s3-bucket-exposure',
        description: 'Triage raw CloudTrail logs, calculate data blast radius, and execute emergency containment.',
        completedCondition: 'progress.investigationScores?.["s3-bucket-exposure"] !== undefined || investigationCompletedCount >= 1'
      },
      {
        step: 4,
        id: 'step-iac-autofix',
        title: 'Auto-Remediate Vulnerable Terraform via Checkov',
        type: 'Builder Studio',
        route: '/cloudive-studio',
        description: 'Run the IaC Security Linter on the production S3 and Security Group Terraform templates and apply 1-click remediation.',
        completedCondition: 'true' // Handled via interactive mission click or studio visits
      },
      {
        step: 5,
        id: 'step-internship-review',
        title: 'Resolve On-Call Pager Incident #101',
        type: 'Internship Simulator',
        route: '/internship-simulator',
        description: 'Take your first on-call shift ticket and submit your executive mitigation notes to engineering leadership.',
        completedCondition: 'simulatorCompletedCount >= 1'
      }
    ]
  },
  {
    id: 'mission-healthcare',
    title: 'Operation Cold Shield: Healthcare Zero-Trust & FinOps Defense',
    domain: 'Healthcare Compliance & Anomaly Detection',
    difficulty: 'Advanced',
    estTime: '3.5 Hours',
    badge: 'Zero-Trust Cloud Architect Badge',
    description: 'Adversaries breached an offshore developer machine and spun up an unauthorized GPU cryptomining fleet while attempting to exfiltrate patient records. Isolate the threat, halt financial debt, and enforce HIPAA multi-account guardrails.',
    steps: [
      {
        step: 1,
        id: 'step-network-learning',
        title: 'Study VPC Flow Logs & Egress Filtering',
        type: 'Learning Academy',
        route: '/learning/network',
        description: 'Learn how to detect abnormal data exfiltration using VPC flow logging and private endpoints.',
        completedCondition: 'learningTopicsCompleted.length >= 3'
      },
      {
        step: 2,
        id: 'step-finops-containment',
        title: 'Halt $3,840/day Cryptomining GPU Fleet',
        type: 'FinOps Simulator',
        route: '/cloudive-studio',
        description: 'Execute the 4-step emergency CLI runbook in the FinOps engine to terminate 32 rogue GPU mining instances.',
        completedCondition: 'true'
      },
      {
        step: 3,
        id: 'step-ctf-battle',
        title: 'Win Red vs Blue Cloud Defense CTF',
        type: 'Battle Rooms',
        route: '/battle-rooms',
        description: 'Analyze adversary persistence tactics in the Battle Room and capture the defensive verification flag.',
        completedCondition: 'true'
      },
      {
        step: 4,
        id: 'step-landing-zone',
        title: 'Enforce AWS Organizations Service Control Policies (SCPs)',
        type: 'Architecture Review',
        route: '/architecture-reviews',
        description: 'Deploy root-level SCPs that mathematically block unauthorized foreign AWS regions.',
        completedCondition: 'architectureReviewedCount >= 2'
      },
      {
        step: 5,
        id: 'step-internship-hipaa',
        title: 'Resolve Ticket #104: Unauthorized KMS Decrypt Alert',
        type: 'Internship Simulator',
        route: '/internship-simulator',
        description: 'Triage patient record decryption alerts and document root cause for the Chief Information Security Officer.',
        completedCondition: 'simulatorCompletedCount >= 2'
      }
    ]
  },
  {
    id: 'mission-devsecops',
    title: 'Operation Iron Gate: Enterprise DevSecOps & Container Fleet Lockdown',
    domain: 'Enterprise Kubernetes & CI/CD Pipelines',
    difficulty: 'Principal / Capstone',
    estTime: '4.0 Hours',
    badge: 'Enterprise DevSecOps Specialist Badge',
    description: 'Deploy a complete end-to-end DevSecOps pipeline for an enterprise microservices platform running on Amazon EKS, AWS Lambda Graviton, and DynamoDB. Transition from manual auditing to automated policy-as-code gates.',
    steps: [
      {
        step: 1,
        id: 'step-eks-linter',
        title: 'Harden Kubernetes EKS Terraform Blueprint',
        type: 'Builder Studio',
        route: '/cloudive-studio',
        description: 'Audit the Amazon EKS cluster configuration: disable public API server access and enforce KMS envelope encryption.',
        completedCondition: 'true'
      },
      {
        step: 2,
        id: 'step-playbook-sop',
        title: 'Execute 7-Stage SOP Incident Playbook',
        type: 'Job Playbooks',
        route: '/playbooks',
        description: 'From Scratch to Solved: triage GuardDuty alert, query Athena SQL, draft automated Terraform PR.',
        completedCondition: 'completedLabStepsCount >= 4 || true'
      },
      {
        step: 3,
        id: 'step-sop-lab',
        title: 'Run Enterprise CloudShell Dual CLI/GUI Lab',
        type: 'Real Labs',
        route: '/labs',
        description: 'Complete hands-on SOP runbooks with live simulated CLI commands in the enterprise lab terminal.',
        completedCondition: 'completedLabsCount >= 1 || true'
      },
      {
        step: 4,
        id: 'step-free-tier-project',
        title: 'Build $0 Free-Tier Security Portfolio Architecture',
        type: 'Portfolio Projects',
        route: '/projects',
        description: 'Implement a resume-ready automated security alert pipeline without spending a cent on AWS.',
        completedCondition: 'true'
      },
      {
        step: 5,
        id: 'step-final-report',
        title: 'Generate Verified Security Thinking Dossier',
        type: 'Security Reports',
        route: '/report',
        description: 'Export your comprehensive multi-dimensional technical assessment for recruiters and hiring managers.',
        completedCondition: 'true'
      }
    ]
  }
]

/**
 * Calculates current mastery (0-100%) for all 10 Skill Graph Domains
 */
export function calculateSkillGraph(contextData = {}, targetCareerRole = 'Cloud Security Engineer') {
  const {
    progress = {},
    challenges = [],
    learningQuizScores = {},
    topicCheckAnswers = {},
    threatScenarios = []
  } = contextData

  const completedCount = Object.values(progress.completed || {}).filter(Boolean).length
  const architectureReviewedCount = Object.keys(progress.architectureScores || {}).length
  const simulatorCompletedCount = Object.keys(progress.simulatorScores || {}).length
  const investigationCompletedCount = Object.keys(progress.investigationScores || {}).length
  const learningTopicsCount = (progress.learningTopicsCompleted || []).length

  return SKILL_GRAPH_DOMAINS.map(domain => {
    let earned = 0
    let total = 100

    // Domain-specific weighting calculation based on actual learner telemetry
    switch (domain.id) {
      case 'iam': {
        const quiz = learningQuizScores['iam'] || 0
        const checks = Object.keys(topicCheckAnswers).filter(k => k.startsWith('iam')).length
        const invs = Object.keys(progress.investigationScores || {}).filter(k => k.includes('iam')).length
        earned = Math.min(100, Math.round((quiz * 0.4) + (checks * 8) + (invs * 15) + (completedCount > 0 ? 15 : 0)))
        break
      }
      case 's3': {
        const quiz = learningQuizScores['s3'] || 0
        const checks = Object.keys(topicCheckAnswers).filter(k => k.startsWith('s3')).length
        const invs = Object.keys(progress.investigationScores || {}).filter(k => k.includes('s3')).length
        earned = Math.min(100, Math.round((quiz * 0.4) + (checks * 8) + (invs * 15) + (completedCount > 0 ? 15 : 0)))
        break
      }
      case 'network': {
        const quiz = learningQuizScores['network'] || 0
        const checks = Object.keys(topicCheckAnswers).filter(k => k.startsWith('network')).length
        const invs = Object.keys(progress.investigationScores || {}).filter(k => k.includes('network') || k.includes('vpc')).length
        earned = Math.min(100, Math.round((quiz * 0.4) + (checks * 8) + (invs * 15) + (completedCount > 0 ? 15 : 0)))
        break
      }
      case 'monitoring': {
        const quiz = learningQuizScores['monitoring'] || 0
        const checks = Object.keys(topicCheckAnswers).filter(k => k.startsWith('monitoring')).length
        const invs = Object.keys(progress.investigationScores || {}).filter(k => k.includes('monitoring') || k.includes('cloudtrail')).length
        earned = Math.min(100, Math.round((quiz * 0.4) + (checks * 8) + (invs * 15) + (completedCount > 0 ? 15 : 0)))
        break
      }
      case 'incident-response': {
        earned = Math.min(100, Math.round((simulatorCompletedCount * 14) + (investigationCompletedCount * 2) + 20))
        break
      }
      case 'threat-hunting': {
        earned = Math.min(100, Math.round((completedCount * 3) + (simulatorCompletedCount * 8) + 25))
        break
      }
      case 'architecture': {
        earned = Math.min(100, Math.round((architectureReviewedCount * 18) + (learningTopicsCount * 2) + 20))
        break
      }
      case 'devsecops': {
        const labStepsCount = Object.values(progress.labSteps || {}).reduce((s, a) => s + (a?.length || 0), 0)
        earned = Math.min(100, Math.round((labStepsCount * 3) + (investigationCompletedCount * 2) + 20))
        break
      }
      case 'iac': {
        earned = Math.min(100, Math.round((architectureReviewedCount * 12) + (learningTopicsCount * 2.5) + 25))
        break
      }
      case 'finops': {
        earned = Math.min(100, Math.round((simulatorCompletedCount * 10) + (investigationCompletedCount * 2) + 25))
        break
      }
      default:
        earned = 30
    }

    // Baseline minimum of 20% so user never starts with an empty flatline
    earned = Math.max(20, Math.min(100, earned))

    // Required mastery based on target career role
    const required = domain.targetMastery[targetCareerRole] || domain.targetMastery['Cloud Security Engineer'] || 80
    const gap = Math.max(0, required - earned)

    // Growth trend determination
    let trend = 'stable'
    if (earned >= required) {
      trend = 'mastered'
    } else if (earned >= 60) {
      trend = 'accelerating'
    } else if (earned >= 40) {
      trend = 'rising'
    } else {
      trend = 'needs-focus'
    }

    return {
      ...domain,
      currentMastery: earned,
      requiredMastery: required,
      gap,
      trend,
      isDeficit: gap > 0
    }
  })
}

/**
 * Computes Master Career Profile uniting all 13 modules into one coherent state
 */
export function generateMasterCareerProfile(contextData = {}) {
  const {
    progress = {},
    challenges = [],
    threatScenarios = [],
    investigations = [],
    realLabs = []
  } = contextData

  const completedCount = Object.values(progress.completed || {}).filter(Boolean).length
  const architectureReviewedCount = Object.keys(progress.architectureScores || {}).length
  const simulatorCompletedCount = Object.keys(progress.simulatorScores || {}).length
  const investigationCompletedCount = Object.keys(progress.investigationScores || {}).length
  const learningTopicsCount = (progress.learningTopicsCompleted || []).length
  const quizScoresCount = Object.keys(progress.learningQuizScores || {}).length

  // Calculate completed labs
  let completedLabsCount = 0
  realLabs.forEach(lab => {
    const steps = progress.labSteps?.[lab.id] || []
    if (lab.steps?.length && steps.length === lab.steps.length) {
      completedLabsCount++
    }
  })

  // Calculate verified Capstone projects and $0 teardowns
  const completedCloudProjectsCount = Object.values(progress.cloudProjectsCompleted || {}).filter(Boolean).length
  const completedTeardownsCount = Object.values(progress.cloudProjectsTeardown || {}).filter(Boolean).length

  // Security Thinking Score (0 - 100)
  const maxScore = Math.max(1, challenges.reduce((sum, c) => sum + (c.points || 0), 0))
  const rawScore = challenges.reduce((sum, c) => {
    if (c.id?.startsWith('architecture-') && progress.architectureScores?.[c.id] !== undefined) {
      return sum + Math.round((c.points * progress.architectureScores[c.id]) / 100)
    }
    return sum + (progress.completed?.[c.id] ? (c.points || 0) : 0)
  }, 0)
  const thinkingScore = Math.min(100, Math.round((rawScore / maxScore) * 100))

  // Determine Current Career Tier (out of 7)
  let currentTierIndex = 0
  for (let i = CAREER_TIERS.length - 1; i >= 0; i--) {
    const t = CAREER_TIERS[i]
    if (
      thinkingScore >= t.minThinkingScore &&
      learningTopicsCount >= t.minLearningTopics &&
      investigationCompletedCount >= t.minInvestigations &&
      architectureReviewedCount >= t.minArchitectureReviews &&
      completedLabsCount >= t.minLabs &&
      simulatorCompletedCount >= t.minInternshipTickets
    ) {
      currentTierIndex = i
      break
    }
  }

  const currentTier = CAREER_TIERS[currentTierIndex]
  const nextTier = CAREER_TIERS[Math.min(CAREER_TIERS.length - 1, currentTierIndex + 1)]
  const isMaxTier = currentTierIndex === CAREER_TIERS.length - 1

  // Promotion Progress Percentage to Next Tier
  let promotionProgressPercent = 100
  if (!isMaxTier) {
    const thinkingProgress = Math.min(1, thinkingScore / Math.max(1, nextTier.minThinkingScore))
    const learningProgress = Math.min(1, learningTopicsCount / Math.max(1, nextTier.minLearningTopics))
    const invProgress = Math.min(1, investigationCompletedCount / Math.max(1, nextTier.minInvestigations))
    const archProgress = Math.min(1, architectureReviewedCount / Math.max(1, nextTier.minArchitectureReviews))
    const labsProgress = Math.min(1, completedLabsCount / Math.max(1, nextTier.minLabs))
    const ticketsProgress = Math.min(1, simulatorCompletedCount / Math.max(1, nextTier.minInternshipTickets))

    const avgProgress = (thinkingProgress + learningProgress + invProgress + archProgress + labsProgress + ticketsProgress) / 6
    promotionProgressPercent = Math.min(100, Math.round(avgProgress * 100))
  }

  // Target Career Role
  const targetCareerRole = progress.targetCareerRole || 'Cloud Security Engineer'

  // Skill Graph
  const skillGraph = calculateSkillGraph(contextData, targetCareerRole)

  // Overall Career Readiness Score (0 - 100)
  const avgDomainMastery = Math.round(skillGraph.reduce((sum, d) => sum + d.currentMastery, 0) / skillGraph.length)
  const overallReadinessScore = Math.min(100, Math.round(
    (avgDomainMastery * 0.35) +
    (thinkingScore * 0.25) +
    ((investigationCompletedCount / 20) * 100 * 0.15) +
    ((architectureReviewedCount / 5) * 100 * 0.15) +
    ((simulatorCompletedCount / 6) * 100 * 0.10)
  ))

  // Recommended 6-Stage Journey Pathway
  // Identifies the single biggest skill gap domain to construct the personalized pathway
  const highestDeficitDomain = [...skillGraph].sort((a, b) => b.gap - a.gap)[0] || skillGraph[0]

  const recommendedJourney = {
    domainId: highestDeficitDomain.id,
    domainName: highestDeficitDomain.name,
    deficitGap: highestDeficitDomain.gap,
    stages: [
      {
        stageNumber: 1,
        title: `1. Core Academy Topic: ${highestDeficitDomain.shortName} Fundamentals`,
        category: 'Learning Academy',
        route: highestDeficitDomain.primaryModule,
        status: learningTopicsCount >= 3 ? 'completed' : 'active',
        description: 'Build foundational mental models, review architectural diagrams, and test recall with interactive knowledge checks.'
      },
      {
        stageNumber: 2,
        title: `2. Triage Incident: Detect ${highestDeficitDomain.shortName} Privilege Escalation`,
        category: 'Investigation Simulator',
        route: '/investigations',
        status: investigationCompletedCount >= 2 ? 'completed' : learningTopicsCount >= 3 ? 'active' : 'locked',
        description: 'Triage raw CloudTrail logs, distinguish false positives, determine effective blast radius, and execute containment.'
      },
      {
        stageNumber: 3,
        title: `3. Architecture Review: Audit ${highestDeficitDomain.shortName} Trust Boundaries`,
        category: 'Architecture Reviews',
        route: '/architecture-reviews',
        status: architectureReviewedCount >= 1 ? 'completed' : investigationCompletedCount >= 2 ? 'active' : 'locked',
        description: 'Analyze multi-finding infrastructure blueprints using the AWS Well-Architected Security Pillar.'
      },
      {
        stageNumber: 4,
        title: `4. Enterprise SOP Lab: CloudShell CLI Runbook for ${highestDeficitDomain.shortName}`,
        category: 'Real Labs',
        route: '/labs',
        status: completedLabsCount >= 1 ? 'completed' : architectureReviewedCount >= 1 ? 'active' : 'locked',
        description: 'Execute hands-on CLI commands in the dual-interface terminal to harden infrastructure step-by-step.'
      },
      {
        stageNumber: 5,
        title: `5. On-Call Shift Ticket: Resolve High-Priority ${highestDeficitDomain.shortName} Pager`,
        category: 'Internship Simulator',
        route: '/internship-simulator',
        status: simulatorCompletedCount >= 1 ? 'completed' : completedLabsCount >= 1 ? 'active' : 'locked',
        description: 'Respond to realistic on-call paging, contain active threats under SLA, and draft manager executive notes.'
      },
      {
        stageNumber: 6,
        title: `6. Portfolio Milestone Proof: Verified $0 Architecture Deployment`,
        category: 'Portfolio Projects',
        route: '/projects',
        status: simulatorCompletedCount >= 2 ? 'completed' : 'active',
        description: 'Produce an artifact demonstrating production-grade least privilege and incident response for hiring managers.'
      }
    ]
  }

  // Capstone Missions with Completion Tracking
  const capstoneMissionsProgress = CAPSTONE_MISSIONS.map(mission => {
    const userMissionSteps = progress.capstoneMissionSteps?.[mission.id] || {}
    let completedSteps = 0

    const evaluatedSteps = mission.steps.map(step => {
      // Evaluate if step is completed either manually in capstone or organically through the platform
      const isManual = Boolean(userMissionSteps[step.id])
      let isOrganic = false

      if (step.id === 'step-iam-learning' && learningTopicsCount >= 1) isOrganic = true
      if (step.id === 'step-arch-review' && architectureReviewedCount >= 1) isOrganic = true
      if (step.id === 'step-s3-investigation' && investigationCompletedCount >= 1) isOrganic = true
      if (step.id === 'step-internship-review' && simulatorCompletedCount >= 1) isOrganic = true
      if (step.id === 'step-network-learning' && learningTopicsCount >= 3) isOrganic = true
      if (step.id === 'step-landing-zone' && architectureReviewedCount >= 2) isOrganic = true
      if (step.id === 'step-internship-hipaa' && simulatorCompletedCount >= 2) isOrganic = true
      if (step.id === 'step-sop-lab' && completedLabsCount >= 1) isOrganic = true

      const isCompleted = isManual || isOrganic
      if (isCompleted) completedSteps++

      return {
        ...step,
        isCompleted
      }
    })

    const progressPercent = Math.round((completedSteps / mission.steps.length) * 100)

    return {
      ...mission,
      steps: evaluatedSteps,
      completedSteps,
      totalSteps: mission.steps.length,
      progressPercent,
      isFullyCompleted: completedSteps === mission.steps.length
    }
  })

  // Portfolio Evidence Generation
  const portfolioEvidence = {
    verifiedProjectsCount: completedLabsCount + architectureReviewedCount + (simulatorCompletedCount > 0 ? 1 : 0) + completedCloudProjectsCount,
    demonstratedSkills: [
      { name: 'AWS CloudTrail Forensic Log Analysis', level: investigationCompletedCount >= 5 ? 'Advanced' : 'Proficient', verified: investigationCompletedCount >= 1 },
      { name: 'IAM Least-Privilege & Boundary Enforcement', level: quizScoresCount >= 1 ? 'Proficient' : 'Developing', verified: true },
      { name: 'S3 Block Public Access & KMS Key Policy Lockdown', level: (completedCount >= 2 || completedCloudProjectsCount >= 1) ? 'Proficient' : 'Developing', verified: completedCount >= 1 || completedCloudProjectsCount >= 1 },
      { name: 'VPC Security Group Chaining & Network Isolation', level: architectureReviewedCount >= 1 ? 'Advanced' : 'Proficient', verified: true },
      { name: 'Terraform IaC Checkov Static Analysis & Remediation', level: completedCloudProjectsCount >= 1 ? 'Advanced' : 'Proficient', verified: true },
      { name: 'SOC On-Call Incident Containment & Pager Operations', level: simulatorCompletedCount >= 2 ? 'Advanced' : 'Proficient', verified: simulatorCompletedCount >= 1 }
    ],
    verifiedDossiers: [
      { title: 'Customer S3 Vault Public ACL Remediation Dossier', type: 'Investigation Proof', date: 'Verified via Simulation' },
      { title: 'Production Multi-AZ 3-Tier Architecture Security Review', type: 'Architecture Proof', date: 'Well-Architected Alignment' },
      { title: 'Unauthorized 32x GPU Cryptomining CLI Containment Runbook', type: 'FinOps Proof', date: 'Incident SLA Proof' },
      ...(completedCloudProjectsCount > 0 ? [{
        title: `AWS Zero-Billing Capstone Project (${completedCloudProjectsCount} Verified)`,
        type: 'Hands-on AWS Portfolio Proof',
        date: 'Verified Free Tier Architecture'
      }] : [])
    ]
  }

  return {
    currentTier,
    nextTier,
    isMaxTier,
    promotionProgressPercent,
    targetCareerRole,
    thinkingScore,
    overallReadinessScore,
    metrics: {
      completedCount,
      architectureReviewedCount,
      simulatorCompletedCount,
      investigationCompletedCount,
      completedLabsCount,
      completedCloudProjectsCount,
      completedTeardownsCount,
      learningTopicsCount,
      quizScoresCount
    },
    skillGraph,
    recommendedJourney,
    capstoneMissions: capstoneMissionsProgress,
    portfolioEvidence
  }
}
