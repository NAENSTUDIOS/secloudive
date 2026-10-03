// Cloud Security Internship Simulator Data & Engine
// Powering the Flagship Simulation Experience in SeCloudive
// 5 Career Levels • Real Tickets • Manager Feedback • Real Live Internship Links

export const INTERNSHIP_LEVELS = [
  {
    level: 1,
    id: 'intern',
    title: 'Cloud Security Intern',
    roleTag: 'Level 1 of 5',
    stipend: 'Simulation Training',
    experienceRange: '0 - 3 Months',
    nextPromotion: 'Junior Cloud Security Analyst',
    requiredScore: 0,
    requiredTickets: 0,
    requiredInvestigations: 0,
    requiredReviews: 0,
    responsibilities: [
      'Triage weekly security tickets and correlate initial CloudTrail evidence',
      'Identify obvious public S3 bucket exposures and unhardened security groups',
      'Document evidence for senior review and draft remediation tickets'
    ],
    skillsUnlocked: ['CloudTrail Log Reading', 'S3 Bucket Policy Auditing', 'Security Group Review']
  },
  {
    level: 2,
    id: 'junior-analyst',
    title: 'Junior Cloud Security Analyst',
    roleTag: 'Level 2 of 5',
    stipend: 'Simulated Level Up',
    experienceRange: '3 - 6 Months',
    nextPromotion: 'Cloud Security Analyst',
    requiredScore: 50,
    requiredTickets: 2,
    requiredInvestigations: 2,
    requiredReviews: 1,
    responsibilities: [
      'Investigate privilege escalation paths and over-permissive IAM policies',
      'Analyze VPC Flow Logs for anomalous egress and external reconnaissance',
      'Recommend first-response containment actions for compromised credentials'
    ],
    skillsUnlocked: ['VPC Flow Log Filtering', 'IAM Access Analyzer', 'EBS Snapshot Forensics']
  },
  {
    level: 3,
    id: 'analyst',
    title: 'Cloud Security Analyst',
    roleTag: 'Level 3 of 5',
    stipend: 'Simulated Mid-Tier',
    experienceRange: '6 - 12 Months',
    nextPromotion: 'Junior Cloud Security Engineer',
    requiredScore: 65,
    requiredTickets: 4,
    requiredInvestigations: 4,
    requiredReviews: 2,
    responsibilities: [
      'Lead incident containment: isolate EC2 hosts and revoke active STS sessions',
      'Triage GuardDuty threat intelligence findings across multi-account organizations',
      'Participate in architecture risk reviews using AWS Well-Architected lenses'
    ],
    skillsUnlocked: ['STS Session Invalidation', 'GuardDuty ASFF Correlation', 'Threat Modeling']
  },
  {
    level: 4,
    id: 'junior-engineer',
    title: 'Junior Cloud Security Engineer',
    roleTag: 'Level 4 of 5',
    stipend: 'Simulated Advanced',
    experienceRange: '1 - 2 Years',
    nextPromotion: 'Cloud Security Engineer',
    requiredScore: 78,
    requiredTickets: 6,
    requiredInvestigations: 6,
    requiredReviews: 3,
    responsibilities: [
      'Author Service Control Policies (SCPs) and permissions boundaries',
      'Automate incident response pipelines with EventBridge and Lambda runbooks',
      'Conduct deep-dive architecture reviews for high-risk financial services'
    ],
    skillsUnlocked: ['Organizations SCP Design', 'EventBridge Automation', 'Data Perimeter Enforcement']
  },
  {
    level: 5,
    id: 'security-engineer',
    title: 'Cloud Security Engineer',
    roleTag: 'Level 5 of 5 (Mastery)',
    stipend: 'Simulated Staff Level',
    experienceRange: '2+ Years',
    nextPromotion: 'Staff Cloud Architect / SecOps Lead',
    requiredScore: 88,
    requiredTickets: 8,
    requiredInvestigations: 8,
    requiredReviews: 5,
    responsibilities: [
      'Architect multi-account enterprise Landing Zones with AWS Control Tower',
      'Lead major breach post-mortems and present risk telemetry to executive C-suite',
      'Mentor junior analysts and run chaos engineering security game days'
    ],
    skillsUnlocked: ['Landing Zone Architecture', 'Chaos Security Emulation', 'C-Suite Risk Presentation']
  }
]

export const PROMOTION_BADGES = [
  {
    id: 'badge-intern',
    title: 'Cloud Security Intern',
    icon: '🎖️',
    description: 'Enrolled in the SeCloudive Internship Program and triaged your first weekly ticket.',
    unlockedAt: '1 Ticket Completed'
  },
  {
    id: 'badge-iam-investigator',
    title: 'IAM Investigator',
    icon: '🔑',
    description: 'Successfully identified and contained a critical privilege escalation pathway.',
    unlockedAt: 'Week 1 Ticket Closed'
  },
  {
    id: 'badge-s3-defender',
    title: 'S3 Guardian',
    icon: '🛡️',
    description: 'Remediated public bucket leakage and enforced KMS customer-managed key policies.',
    unlockedAt: 'Week 2 Ticket Closed'
  },
  {
    id: 'badge-threat-hunter',
    title: 'Threat Hunter',
    icon: '🎯',
    description: 'Correlated CloudTrail and GuardDuty alerts to reconstruct an active adversary kill chain.',
    unlockedAt: 'Week 4 Ticket Closed'
  },
  {
    id: 'badge-arch-reviewer',
    title: 'Architecture Reviewer',
    icon: '🏛️',
    description: 'Completed 3 signature AWS Well-Architected risk lens reviews with zero critical misses.',
    unlockedAt: '3 Reviews Completed'
  },
  {
    id: 'badge-analyst-ready',
    title: 'Security Analyst Ready',
    icon: '⚡',
    description: 'Attained Level 3 promotion with >= 70% average investigation accuracy.',
    unlockedAt: 'Level 3 Promotion'
  },
  {
    id: 'badge-engineer-candidate',
    title: 'Cloud Security Engineer Candidate',
    icon: '🚀',
    description: 'Completed 6+ tickets, 6+ investigations, and attained an Internship Readiness Score >= 85%.',
    unlockedAt: 'Level 5 Promotion'
  }
]

/**
 * Real Live Cloud Security Internships & Career Opportunities Feed
 * Curated authentic links to official corporate career portals, updated for active recruitment cycles
 */
export const LIVE_INTERNSHIPS_FEED = [
  {
    id: 'aws-sec-intern',
    company: 'Amazon Web Services (AWS)',
    role: 'Security Engineer Intern (Cloud & Infrastructure)',
    location: 'Seattle, WA / Arlington, VA / Remote Eligible',
    cycle: 'Active Recruitment / Summer 2026-2027',
    status: 'APPLICATIONS ACTIVE',
    statusClass: 'active',
    logo: '☁️',
    description: 'Work with the AWS Security Operations team building automated threat detection, incident response automation, and perimeter guardrails for global hyperscale cloud infrastructure.',
    requirements: ['AWS Fundamentals (IAM, VPC, S3)', 'Python or Go scripting', 'Security problem-solving mindset'],
    applyUrl: 'https://www.amazon.jobs/en/job_categories/security-engineering',
    verifiedDate: 'Live Feed • Updated Weekly'
  },
  {
    id: 'google-mandiant-intern',
    company: 'Google Cloud (Mandiant)',
    role: 'Cloud Incident Response & Threat Intelligence Intern',
    location: 'Sunnyvale, CA / Austin, TX / Reston, VA',
    cycle: 'Rolling Campus Hiring',
    status: 'APPLICATIONS ACTIVE',
    statusClass: 'active',
    logo: '🛡️',
    description: 'Join Mandiant front-line consultants analyzing live nation-state cloud attacks, conducting digital forensics on multi-cloud environments, and writing detection rules.',
    requirements: ['Cloud logging (CloudTrail, VPC Flows)', 'Basic OS internals (Linux/Windows)', 'Curiosity for threat hunting'],
    applyUrl: 'https://careers.google.com/jobs/results/?q=Security%20Engineering%20Intern',
    verifiedDate: 'Live Feed • Updated Weekly'
  },
  {
    id: 'crowdstrike-cloud-intern',
    company: 'CrowdStrike',
    role: 'Cloud Security Research & Falcon Horizon Intern',
    location: 'Remote (US & Global)',
    cycle: 'Summer Cohort Review',
    status: 'ROLLING REVIEWS',
    statusClass: 'review',
    logo: '🦅',
    description: 'Develop cloud threat detection capabilities, research adversary tactics against AWS/Azure/GCP, and create automated Cloud Security Posture Management (CSPM) rules.',
    requirements: ['Familiarity with MITRE ATT&CK Cloud Matrix', 'Hands-on cloud lab experience', 'Scripting ability'],
    applyUrl: 'https://crowdstrike.wd5.myworkdayjobs.com/crowdstrikecareers',
    verifiedDate: 'Live Feed • Updated Weekly'
  },
  {
    id: 'palo-alto-intern',
    company: 'Palo Alto Networks (Unit 42)',
    role: 'Cloud Threat Intelligence & Incident Response Intern',
    location: 'Santa Clara, CA / Plano, TX / Remote',
    cycle: 'Fall & Summer Pipeline',
    status: 'APPLICATIONS ACTIVE',
    statusClass: 'active',
    logo: '🔥',
    description: 'Investigate real-world cloud ransomware cases, analyze Prisma Cloud alerts, and author incident response playbooks for Fortune 500 customers.',
    requirements: ['Understanding of cloud attack vectors', 'Network packet analysis', 'Strong documentation skills'],
    applyUrl: 'https://jobs.paloaltonetworks.com/en/',
    verifiedDate: 'Live Feed • Updated Weekly'
  },
  {
    id: 'datadog-cloudsec-intern',
    company: 'Datadog',
    role: 'Cloud Security Platform Engineering Intern',
    location: 'New York, NY / Boston, MA / Remote',
    cycle: 'Active Recruitment',
    status: 'APPLICATIONS ACTIVE',
    statusClass: 'active',
    logo: '🐶',
    description: 'Help build high-throughput security telemetry ingestion, threat detection engines, and compliance auditing for thousands of cloud microservices.',
    requirements: ['Distributed systems interest', 'Linux networking', 'AWS / Cloud security foundation'],
    applyUrl: 'https://careers.datadoghq.com/',
    verifiedDate: 'Live Feed • Updated Weekly'
  },
  {
    id: 'cisco-talos-intern',
    company: 'Cisco Talos',
    role: 'Security Analyst & Threat Research Intern',
    location: 'Raleigh, NC / Chicago, IL / Remote',
    cycle: 'Active Recruitment',
    status: 'APPLICATIONS ACTIVE',
    statusClass: 'active',
    logo: '⚡',
    description: 'Work alongside premier threat intelligence researchers uncovering novel vulnerabilities, analyzing malware payloads, and defending cloud perimeters.',
    requirements: ['Foundational cybersecurity coursework', 'Log analysis experience', 'Incident triage enthusiasm'],
    applyUrl: 'https://jobs.cisco.com/',
    verifiedDate: 'Live Feed • Updated Weekly'
  }
]

/**
 * Calculates current user internship level and promotion progress
 */
export function calculateInternshipProgression(contextData = {}) {
  const {
    simulatorCompletedCount = 0,
    investigationCompletedCount = 0,
    architectureReviewedCount = 0,
    scorePercent = 0,
    internshipReadiness = 0
  } = contextData

  let currentLevel = INTERNSHIP_LEVELS[0]
  let currentLevelIndex = 0

  for (let i = INTERNSHIP_LEVELS.length - 1; i >= 0; i--) {
    const lvl = INTERNSHIP_LEVELS[i]
    if (
      simulatorCompletedCount >= lvl.requiredTickets &&
      investigationCompletedCount >= lvl.requiredInvestigations &&
      architectureReviewedCount >= lvl.requiredReviews &&
      (scorePercent >= lvl.requiredScore || internshipReadiness >= lvl.requiredScore)
    ) {
      currentLevel = lvl
      currentLevelIndex = i
      break
    }
  }

  const nextLevel = INTERNSHIP_LEVELS[currentLevelIndex + 1] || null

  // Calculate promotion progress percentage towards next level
  let promotionPercent = 100
  let skillsNeeded = []

  if (nextLevel) {
    const ticketProgress = Math.min(1, simulatorCompletedCount / Math.max(1, nextLevel.requiredTickets))
    const invProgress = Math.min(1, investigationCompletedCount / Math.max(1, nextLevel.requiredInvestigations))
    const archProgress = Math.min(1, architectureReviewedCount / Math.max(1, nextLevel.requiredReviews))
    const scoreProgress = Math.min(1, Math.max(scorePercent, internshipReadiness) / Math.max(1, nextLevel.requiredScore))

    promotionPercent = Math.round(((ticketProgress + invProgress + archProgress + scoreProgress) / 4) * 100)

    if (simulatorCompletedCount < nextLevel.requiredTickets) {
      skillsNeeded.push(`Close ${nextLevel.requiredTickets - simulatorCompletedCount} more Weekly Tickets`)
    }
    if (investigationCompletedCount < nextLevel.requiredInvestigations) {
      skillsNeeded.push(`Solve ${nextLevel.requiredInvestigations - investigationCompletedCount} more Investigations`)
    }
    if (architectureReviewedCount < nextLevel.requiredReviews) {
      skillsNeeded.push(`Complete ${nextLevel.requiredReviews - architectureReviewedCount} more Architecture Reviews`)
    }
    if (Math.max(scorePercent, internshipReadiness) < nextLevel.requiredScore) {
      skillsNeeded.push(`Attain >= ${nextLevel.requiredScore}% Readiness/Score (Current: ${Math.max(scorePercent, internshipReadiness)}%)`)
    }
  }

  return {
    currentLevel,
    currentLevelIndex,
    nextLevel,
    promotionPercent,
    skillsNeeded
  }
}

/**
 * Generates realistic Manager Feedback based on user submission coverage and accuracy
 */
export function generateManagerFeedback(scenario, score, selectedCount, totalEvidenceCount) {
  let rating = 'Meets Expectations'
  let ratingClass = 'meets'
  let managerNotes = ''
  let strengths = []
  let areasForImprovement = []

  if (score >= 85) {
    rating = 'Exceeds Expectations'
    ratingClass = 'exceeds'
    managerNotes = `Superb technical analysis on ${scenario.ticket}. You pinpointed the exact root cause, identified the primary blast radius, and proposed durable least-privilege remediation. Ready for advanced assignments.`
    strengths = [
      `Accurate evidence triage (${selectedCount}/${totalEvidenceCount} critical indicators flagged)`,
      'Comprehensive understanding of cloud trust boundaries',
      'Defensible containment order of operations'
    ]
    areasForImprovement = [
      'Document automated infrastructure-as-code guardrails (e.g. AWS Config rules) to prevent future regression.'
    ]
  } else if (score >= 60) {
    rating = 'Meets Expectations'
    ratingClass = 'meets'
    managerNotes = `Solid investigation on ${scenario.ticket}. You correctly flagged key risks, but missed secondary escalation indicators. Review the timeline notes before submitting the final engineering report.`
    strengths = [
      'Identified primary operational risk',
      'Followed standard containment playbook'
    ]
    areasForImprovement = [
      'Double check for lateral movement or cross-account trust modification',
      'Correlate CloudTrail API timestamps more closely with network telemetry'
    ]
  } else {
    rating = 'Needs Growth'
    ratingClass = 'growth'
    managerNotes = `You missed several critical evidence items in ${scenario.ticket}. In live on-call operations, incomplete containment leaves the threat actor active in our environment. Re-examine the timeline and try again.`
    strengths = [
      'Completed initial ticket triage attempt'
    ]
    areasForImprovement = [
      'Focus on least-privilege principles and boundary enforcement',
      'Study CloudTrail event structures and STS credential lifetimes',
      'Never close a ticket until blast radius has been verified'
    ]
  }

  return {
    rating,
    ratingClass,
    managerNotes,
    strengths,
    areasForImprovement,
    reviewedBy: 'Marcus Vance, Lead Cloud SecOps Architect',
    reviewedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

/**
 * Generates comprehensive Monthly Performance Review for the Intern
 */
export function generateMonthlyPerformanceReview(contextData = {}) {
  const {
    simulatorCompletedCount = 0,
    investigationCompletedCount = 0,
    scorePercent = 0,
    internshipReadiness = 0
  } = contextData

  let overallRating = 'Meets Expectations'
  let ratingPill = 'pill-cyan'
  let executiveSummary = ''

  if (internshipReadiness >= 80 || scorePercent >= 80) {
    overallRating = 'Exceeds Expectations'
    ratingPill = 'pill-emerald'
    executiveSummary = 'Intern consistently delivers senior-caliber investigation triage. Exhibits strong cloud architectural intuition, defensible risk communication, and reliable containment execution. Strong candidate for early promotion.'
  } else if (internshipReadiness >= 55 || scorePercent >= 55) {
    overallRating = 'Meets Expectations'
    ratingPill = 'pill-cyan'
    executiveSummary = 'Demonstrating steady progression across core security domains. Reliable execution on standard weekly tickets. Expanding experience in deep-dive monitoring and cross-account architecture reviews is recommended.'
  } else {
    overallRating = 'Developing / Needs Growth'
    ratingPill = 'pill-amber'
    executiveSummary = 'Intern is building foundational cloud security concepts. Additional hands-on practice in CloudTrail forensic correlation and IAM least privilege is required before handling unscheduled high-severity production alerts.'
  }

  return {
    month: 'Current Review Period',
    overallRating,
    ratingPill,
    executiveSummary,
    evaluator: 'Director of Cloud Information Security & Academy Mentorship',
    metrics: {
      ticketsClosed: `${simulatorCompletedCount} Closed`,
      investigationsSolved: `${investigationCompletedCount} Solved`,
      readinessIndex: `${internshipReadiness}%`,
      thinkingScore: `${scorePercent}/100`
    },
    topStrengths: [
      'Security boundary awareness and rapid risk escalation',
      'Familiarity with AWS Well-Architected Security principles'
    ],
    growthGoals: [
      'Master CloudWatch Logs Insights query syntax for sub-minute threat hunting',
      'Complete at least 2 enterprise Architecture Reviews this sprint'
    ]
  }
}
