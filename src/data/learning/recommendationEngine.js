// Adaptive Learning Recommendation Engine for SeCloudive Academy
// Analyzes multi-dimensional learner performance:
// - Quiz scores & Knowledge checks
// - Investigation triage results
// - Architecture review coverage
// - Decision lab accuracy
// - Security thinking score
// - Target career role weighting
// Generates prioritized, explainable guidance behaving like a Senior Cloud Security Mentor

export const DOMAINS = {
  IAM: {
    id: 'iam',
    name: 'Identity & Access Management',
    shortName: 'Identity Security',
    icon: '🔑',
    learningPath: '/learning/iam',
    learningModuleTitle: 'Identity & Access Management (IAM)',
    investigationId: 'iam-privilege-escalation',
    investigationTitle: 'Investigation: IAM Privilege Escalation & Rogue Policies',
    investigationPath: '/investigations',
    decisionLabTitle: 'Decision Lab: Developer Admin Permissions & Boundaries',
    architectureChallenge: 'Architecture Review: Cross-Account IAM & Boundary Lenses',
    awsResources: [
      { title: 'AWS Well-Architected: Identity & Access Management Pillar', url: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/identity-and-access-management.html' },
      { title: 'AWS IAM Best Practices Guide', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html' },
      { title: 'AWS Skill Builder: IAM Policy Masterclass', url: 'https://skillbuilder.aws/' }
    ]
  },
  S3: {
    id: 's3',
    name: 'Data Security (S3 & KMS)',
    shortName: 'Data Security',
    icon: '🪣',
    learningPath: '/learning/s3',
    learningModuleTitle: 'Data Security (S3)',
    investigationId: 's3-bucket-exposure',
    investigationTitle: 'Investigation: Public S3 Exposure & Unencrypted Vaults',
    investigationPath: '/investigations',
    decisionLabTitle: 'Decision Lab: Public Bucket Triage & Versioning Lock',
    architectureChallenge: 'Architecture Review: Data Perimeter & KMS Key Policies',
    awsResources: [
      { title: 'AWS S3 Security Best Practices', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html' },
      { title: 'AWS KMS Cryptographic Details Whitepaper', url: 'https://docs.aws.amazon.com/kms/latest/cryptographic-details/' },
      { title: 'AWS Skill Builder: Data Protection on AWS', url: 'https://skillbuilder.aws/' }
    ]
  },
  NETWORK: {
    id: 'network',
    name: 'Network Security (VPC)',
    shortName: 'Network Security',
    icon: '🌐',
    learningPath: '/learning/network',
    learningModuleTitle: 'Network Security',
    investigationId: 'network-security-groups',
    investigationTitle: 'Investigation: Exposed Admin Ports & Flat Subnets',
    investigationPath: '/investigations',
    decisionLabTitle: 'Decision Lab: Security Groups vs NACLs in Breach Containment',
    architectureChallenge: 'Architecture Review: Zero Trust Subnet Segmentation',
    awsResources: [
      { title: 'VPC Security Best Practices', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-best-practices.html' },
      { title: 'AWS Network Firewall Architecture Guide', url: 'https://docs.aws.amazon.com/network-firewall/latest/developerguide/' },
      { title: 'AWS Skill Builder: AWS Networking Basics', url: 'https://skillbuilder.aws/' }
    ]
  },
  MONITORING: {
    id: 'monitoring',
    name: 'Monitoring & Logging (CloudTrail/Watch)',
    shortName: 'Monitoring & Logging',
    icon: '📊',
    learningPath: '/learning/monitoring',
    learningModuleTitle: 'Monitoring & Logging',
    investigationId: 'monitoring-disabled-cloudtrail',
    investigationTitle: 'Investigation: Tampered Trails & Blind Spot Evasion',
    investigationPath: '/investigations',
    decisionLabTitle: 'Decision Lab: Disabled CloudTrail & GuardDuty Triage',
    architectureChallenge: 'Architecture Review: Immutable Centralized Log Archives',
    awsResources: [
      { title: 'AWS CloudTrail User Guide & Forensic Queries', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html' },
      { title: 'Amazon GuardDuty Threat Intelligence Findings', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings.html' },
      { title: 'AWS Skill Builder: Cloud Operations & Threat Detection', url: 'https://skillbuilder.aws/' }
    ]
  },
  ARCHITECTURE: {
    id: 'architecture',
    name: 'Security Architecture',
    shortName: 'Architecture Security',
    icon: '🏛️',
    learningPath: '/learning/architecture',
    learningModuleTitle: 'Security Architecture',
    investigationId: 'arch-compound-misconfig',
    investigationTitle: 'Investigation: Multi-Tier Perimeter Failure & Blast Radius',
    investigationPath: '/architecture-reviews',
    decisionLabTitle: 'Decision Lab: Blast Radius Containment & Landing Zone Governance',
    architectureChallenge: 'Architecture Review: 5 Signature Enterprise Risk Lenses',
    awsResources: [
      { title: 'AWS Well-Architected Framework: Security Pillar Whitepaper', url: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/' },
      { title: 'AWS Multi-Account Strategy & Landing Zones', url: 'https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/' },
      { title: 'AWS Skill Builder: Architecting on AWS Security Track', url: 'https://skillbuilder.aws/' }
    ]
  },
  INCIDENT_RESPONSE: {
    id: 'incident-response',
    name: 'Incident Response & Triage',
    shortName: 'Incident Response',
    icon: '🚨',
    learningPath: '/learning/incident-response',
    learningModuleTitle: 'Incident Response',
    investigationId: 'ir-active-compromise',
    investigationTitle: 'Investigation: Active Token Theft, Host Isolation & Token Revocation',
    investigationPath: '/internship-simulator',
    decisionLabTitle: 'Decision Lab: Host Quarantine & aws:TokenIssueTime Revocation',
    architectureChallenge: 'Architecture Review: Forensic Isolation VPC & S3 WORM Ledgers',
    awsResources: [
      { title: 'AWS Incident Response Guide Whitepaper', url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-security-incident-response-guide/' },
      { title: 'NIST SP 800-61 Computer Security Incident Handling Guide', url: 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final' },
      { title: 'AWS Skill Builder: Incident Detection and Response', url: 'https://skillbuilder.aws/' }
    ]
  }
}

/**
 * Computes exact domain mastery scores (0-100%) from user progress state
 */
export function calculateDomainScores(contextData = {}) {
  const {
    progress = {},
    challenges = [],
    learningQuizScores = {},
    topicCheckAnswers = {},
    threatScenarios = []
  } = contextData

  const domainScores = {}

  Object.values(DOMAINS).forEach(domain => {
    let totalPoints = 0
    let earnedPoints = 0

    // 1. Module Quiz Performance (Weight: 35%)
    const quizScore = learningQuizScores[domain.id]
    if (typeof quizScore === 'number') {
      totalPoints += 35
      earnedPoints += (quizScore / 100) * 35
    } else {
      // Benchmark default if not taken yet
      totalPoints += 35
      earnedPoints += 14 // Baseline 40% initial assumption
    }

    // 2. Investigation Challenges in this domain (Weight: 35%)
    const matchingChallenges = challenges.filter(c =>
      (c.id || '').toLowerCase().startsWith(domain.id) ||
      (c.category || '').toLowerCase().includes(domain.id)
    )
    if (matchingChallenges.length > 0) {
      totalPoints += 35
      const completedCount = matchingChallenges.filter(c => progress.completed?.[c.id]).length
      earnedPoints += (completedCount / matchingChallenges.length) * 35
    } else {
      totalPoints += 35
      earnedPoints += 14
    }

    // 3. Internship Simulator Weekly Tickets (Weight: 20%)
    const matchingTickets = threatScenarios.filter(t =>
      (t.category || '').toLowerCase().includes(domain.id) ||
      (t.ticket || '').toLowerCase().includes(domain.id)
    )
    if (matchingTickets.length > 0) {
      totalPoints += 20
      let ticketScoresSum = 0
      let evaluatedCount = 0
      matchingTickets.forEach(t => {
        if (typeof progress.simulatorScores?.[t.id] === 'number') {
          ticketScoresSum += progress.simulatorScores[t.id]
          evaluatedCount++
        }
      })
      if (evaluatedCount > 0) {
        earnedPoints += (ticketScoresSum / (evaluatedCount * 100)) * 20
      }
    } else {
      totalPoints += 20
      earnedPoints += (progress.completedCount || 0) > 0 ? 10 : 6
    }

    // 4. Topic Knowledge Checks (Weight: 10%)
    const matchingChecks = Object.entries(topicCheckAnswers).filter(([key]) =>
      key.startsWith(domain.id)
    )
    if (matchingChecks.length > 0) {
      totalPoints += 10
      const correctChecks = matchingChecks.filter(([, isCorrect]) => isCorrect).length
      earnedPoints += (correctChecks / matchingChecks.length) * 10
    } else {
      totalPoints += 10
      earnedPoints += 4
    }

    const finalPercent = Math.min(100, Math.max(0, Math.round((earnedPoints / Math.max(1, totalPoints)) * 100)))

    // Classify score tier
    let tier = 'Critical'
    let tierClass = 'critical'
    let priorityBadge = '🔴 Critical'
    let levelLabel = 'Critical Weakness'

    if (finalPercent >= 81) {
      tier = 'Strong'
      tierClass = 'strong'
      priorityBadge = '🟢 Low'
      levelLabel = 'Demonstrated Strength'
    } else if (finalPercent >= 61) {
      tier = 'Developing'
      tierClass = 'developing'
      priorityBadge = '🟡 Medium'
      levelLabel = 'Developing Competency'
    } else if (finalPercent >= 41) {
      tier = 'NeedsImprovement'
      tierClass = 'needs-improvement'
      priorityBadge = '🟠 High'
      levelLabel = 'Needs Improvement'
    }

    domainScores[domain.id] = {
      ...domain,
      score: finalPercent,
      tier,
      tierClass,
      priorityBadge,
      levelLabel
    }
  })

  return domainScores
}

/**
 * Calculates overall Internship Readiness Score & Stage Progression
 * Tiers:
 * <50%: Beginner
 * 50-70%: Cloud Security Learner
 * 70-85%: Cloud Security Analyst Ready
 * >85%: Cloud Security Internship Ready
 */
export function calculateInternshipReadiness(domainScores, progress = {}) {
  const scoresArray = Object.values(domainScores).map(d => d.score)
  const technicalKnowledge = Math.round(scoresArray.reduce((acc, s) => acc + s, 0) / Math.max(1, scoresArray.length))
  
  const investigationAbility = Math.min(100, Math.round(((progress.investigationCompletedCount || progress.completedCount || 0) / 10) * 100))
  const architectureReviewSkill = Math.min(100, Math.round(((progress.architectureReviewedCount || 0) / 5) * 100))
  const securityDecisionMaking = Math.min(100, Math.round(((progress.simulatorCompletedCount || 0) / 6) * 100))

  const overallReadiness = Math.round(
    technicalKnowledge * 0.4 +
    investigationAbility * 0.25 +
    architectureReviewSkill * 0.2 +
    securityDecisionMaking * 0.15
  )

  let stage = 'Beginner'
  let nextStage = 'Cloud Security Learner'
  let targetRole = 'Cloud Security Engineer'
  let roleFitPercentage = Math.min(100, Math.max(25, overallReadiness))

  if (overallReadiness >= 85) {
    stage = 'Cloud Security Internship Ready'
    nextStage = 'Junior Cloud Security Engineer'
  } else if (overallReadiness >= 70) {
    stage = 'Cloud Security Analyst Ready'
    nextStage = 'Cloud Security Internship Ready'
  } else if (overallReadiness >= 50) {
    stage = 'Cloud Security Learner'
    nextStage = 'Cloud Security Analyst Ready'
  }

  return {
    overallReadiness,
    stage,
    nextStage,
    targetRole,
    roleFitPercentage,
    breakdown: {
      technicalKnowledge,
      investigationAbility,
      architectureReviewSkill,
      securityDecisionMaking
    }
  }
}

/**
 * Generates Weighted, Prioritized Recommendations with Full Explanations & Senior Mentor Insights
 */
export function generateAdaptiveRecommendations(contextData = {}, targetCareerRole = 'Cloud Security Engineer') {
  const domainScores = calculateDomainScores(contextData)
  const readiness = calculateInternshipReadiness(domainScores, contextData.progress)

  // Career Goal Domain Weights
  const careerWeights = {
    'Cloud Security Engineer': { iam: 1.4, monitoring: 1.3, architecture: 1.4, 'incident-response': 1.2, network: 1.1, s3: 1.1 },
    'Security Analyst': { monitoring: 1.5, 'incident-response': 1.4, iam: 1.2, network: 1.2, s3: 1.0, architecture: 1.0 },
    'Cloud Architect': { architecture: 1.5, network: 1.3, s3: 1.3, iam: 1.2, monitoring: 1.0, 'incident-response': 1.0 },
    'SOC Analyst': { monitoring: 1.5, 'incident-response': 1.4, network: 1.2, iam: 1.1, s3: 1.0, architecture: 0.9 }
  }

  const activeWeights = careerWeights[targetCareerRole] || careerWeights['Cloud Security Engineer']

  // Sort domains by weighted priority score (lowest score * career weight = highest urgency)
  const rankedDomains = Object.values(domainScores).map(d => {
    const weight = activeWeights[d.id] || 1.0
    // Priority calculation: lower score produces higher deficit
    const deficit = (100 - d.score) * weight
    return {
      ...d,
      weight,
      deficit
    }
  }).sort((a, b) => b.deficit - a.deficit)

  const topWeaknesses = rankedDomains.slice(0, 3)
  const topStrengths = [...rankedDomains].sort((a, b) => b.score - a.score).slice(0, 3)

  // Generate detailed explainable recommendations for each domain deficit
  const allRecommendations = rankedDomains.map((domain, rank) => {
    const score = domain.score
    let priority = '🔴 Critical'
    let priorityClass = 'critical'
    let explanationText = ''
    let expectedImprovement = '+15–25% in domain mastery'
    let estTime = '45 Minutes'

    if (score < 40) {
      priority = '🔴 Critical'
      priorityClass = 'critical'
      explanationText = `Critical weakness detected in ${domain.shortName} (${score}%). This skill deficit is currently blocking progression toward Cloud Security Analyst readiness.`
      expectedImprovement = '+20–30% in core foundation'
      estTime = '45–60 Minutes'
    } else if (score <= 60) {
      priority = '🟠 High'
      priorityClass = 'high'
      explanationText = `This area needs improvement (${score}%) and should be addressed before advancing to higher-severity enterprise investigations.`
      expectedImprovement = '+10–20% in applied decision confidence'
      estTime = '35–45 Minutes'
    } else if (score <= 80) {
      priority = '🟡 Medium'
      priorityClass = 'medium'
      explanationText = `You have built a reliable foundation in ${domain.shortName} (${score}%). Additional hands-on practice will solidify engineering instincts.`
      expectedImprovement = '+5–15% in complex triage accuracy'
      estTime = '30 Minutes'
    } else {
      priority = '🟢 Low'
      priorityClass = 'low'
      explanationText = `Demonstrated strength (${score}%). Continue sharpening skills with advanced scenarios and threat emulation.`
      expectedImprovement = '+5% in edge-case mastery'
      estTime = '20 Minutes'
    }

    // Role-specific career impact
    let careerImpact = ''
    if (targetCareerRole === 'Cloud Security Engineer') {
      careerImpact = `${targetCareerRole}s are expected to design automated guardrails, boundary policies, and least-privilege configurations for ${domain.shortName} at production scale.`
    } else if (targetCareerRole === 'Security Analyst') {
      careerImpact = `Security Analysts rely continuously on ${domain.shortName} telemetry to triage alerts, distinguish false positives, and isolate compromised cloud assets.`
    } else {
      careerImpact = `Essential for enterprise cloud governance, passing regulatory audits, and preventing multi-tenant data leaks.`
    }

    // Mentor guidance quote ("What a Cloud Security Engineer would tell you")
    const mentorQuotes = {
      iam: `In cloud security, Identity is your new network perimeter. If you don't master IAM policy evaluation and boundary conditions, attackers will use stolen tokens to walk right past your firewalls.`,
      s3: `Public S3 buckets and unencrypted vaults remain the most common source of high-profile cloud data breaches. You must know how to enforce S3 Block Public Access and KMS key policies with your eyes closed.`,
      network: `Don't rely solely on Security Groups. Understand VPC routing, PrivateLink endpoints, and NACLs. An engineer who knows how to isolate a host in under 60 seconds saves the company from ransomware.`,
      monitoring: `You cannot stop what you cannot see. Attackers first attempt to disable CloudTrail and GuardDuty. Building tamper-proof centralized logging is the mark of a true senior engineer.`,
      architecture: `Security is an emergent system property. Individual controls will fail; your architecture must ensure that a single compromised component never exposes the entire business.`,
      'incident-response': `When a crisis hits, never panic and delete the server. Contain first, preserve volatile RAM and EBS snapshots, revoke active STS tokens, and verify root cause before declaring an all-clear.`
    }

    const mentorAdvice = mentorQuotes[domain.id] || mentorQuotes.iam

    return {
      id: `rec-${domain.id}`,
      rank: rank + 1,
      domainId: domain.id,
      domainName: domain.name,
      shortName: domain.shortName,
      icon: domain.icon,
      score: domain.score,
      priority,
      priorityClass,
      title: `${domain.learningModuleTitle} Mastery Path`,
      whyRecommended: explanationText,
      reason: explanationText,
      currentSkillGap: `${100 - domain.score}% competency gap in ${domain.shortName}`,
      skillGap: `${100 - domain.score}% competency gap in ${domain.shortName}`,
      careerImpact,
      expectedImprovement,
      estimatedTime: estTime,
      mentorAdvice,
      engineerAdvice: mentorAdvice,
      learningPath: domain.learningPath,
      actionUrl: domain.learningPath,
      investigationTitle: domain.investigationTitle,
      investigationPath: domain.investigationPath,
      decisionLabTitle: domain.decisionLabTitle,
      architectureChallenge: domain.architectureChallenge,
      nextStepUnlock: `Completing this module unlocks the ${domain.shortName} Architecture Review Challenge, improves your Internship Readiness by up to +12%, and strengthens your Security Thinking Score.`,
      awsResources: domain.awsResources
    }
  })

  // Smart Next Action: Single most critical task
  const primaryDeficit = allRecommendations[0]
  const smartNextAction = {
    title: `Complete: ${primaryDeficit.title}`,
    actionUrl: primaryDeficit.learningPath,
    category: primaryDeficit.shortName,
    priority: primaryDeficit.priority,
    priorityClass: primaryDeficit.priorityClass,
    reason: `${primaryDeficit.shortName} is currently your lowest-scoring domain (${primaryDeficit.score}%) and represents the primary barrier to your ${readiness.nextStage} milestone.`,
    expectedBenefit: primaryDeficit.expectedImprovement,
    estimatedTime: primaryDeficit.estimatedTime,
    mentorTip: primaryDeficit.mentorAdvice
  }

  // Career Roadmap Stage Info
  const careerRoadmap = {
    currentStage: readiness.stage,
    nextStage: readiness.nextStage,
    targetRole: targetCareerRole,
    missingSkills: topWeaknesses.map(w => w.shortName),
    demonstratedStrengths: topStrengths.map(s => s.shortName),
    recommendedActions: [
      `Complete ${topWeaknesses[0]?.shortName || 'Monitoring'} Knowledge Checks & Labs`,
      `Resolve 2 Architecture Reviews focused on ${topWeaknesses[1]?.shortName || 'IAM'}`,
      `Pass the Adaptive Assessment for ${topWeaknesses[0]?.shortName || 'Security'} with >= 70%`
    ]
  }

  return {
    domainScores,
    readiness,
    recommendations: allRecommendations,
    topRecommendations: allRecommendations.slice(0, 3),
    allRecommendations,
    smartNextAction,
    topWeaknesses,
    topStrengths,
    careerRoadmap,
    targetCareerRole
  }
}
