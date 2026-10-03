// Knowledge Badges Catalog and Evaluation Engine for SeCloudive Academy

export const KNOWLEDGE_BADGES = [
  {
    id: 'iam-explorer',
    title: 'IAM Explorer',
    pathId: 'iam',
    icon: 'Key',
    badgeIcon: '🔑',
    color: '#38bdf8',
    rarity: 'Common',
    requirement: 'Complete at least 4 IAM topics or score 70%+ on IAM Module Quiz',
    description: 'Demonstrated solid grasp of IAM users, roles, STS tokens, and basic policy mechanics.'
  },
  {
    id: 'iam-defender',
    title: 'IAM Defender',
    pathId: 'iam',
    icon: 'ShieldCheck',
    badgeIcon: '🛡️',
    color: '#38bdf8',
    rarity: 'Rare',
    requirement: 'Score 85%+ on IAM Security Module Quiz',
    description: 'Mastered policy evaluation logic, permission boundaries, confused deputy defenses, and least privilege engineering.'
  },
  {
    id: 's3-guardian',
    title: 'S3 Guardian',
    pathId: 's3',
    icon: 'Database',
    badgeIcon: '🪣',
    color: '#fb923c',
    rarity: 'Rare',
    requirement: 'Score 85%+ on S3 Data Security Module Quiz',
    description: 'Proven capability to enforce S3 Block Public Access, SSE-KMS key policies, Object Lock (WORM), and TLS-only transit.'
  },
  {
    id: 'network-protector',
    title: 'Network Protector',
    pathId: 'network',
    icon: 'Network',
    badgeIcon: '🌐',
    color: '#a855f7',
    rarity: 'Rare',
    requirement: 'Score 85%+ on Network Security Module Quiz',
    description: 'Mastered VPC subnet slicing, Stateful Security Groups vs Stateless NACLs, PrivateLink, and egress perimeter routing.'
  },
  {
    id: 'monitoring-specialist',
    title: 'Monitoring Specialist',
    pathId: 'monitoring',
    icon: 'Activity',
    badgeIcon: '👁️',
    color: '#4ade80',
    rarity: 'Rare',
    requirement: 'Score 85%+ on Monitoring & Logging Module Quiz',
    description: 'Expertise in multi-region CloudTrail auditing, CloudWatch anomaly metrics, GuardDuty threat triage, and Athena SQL forensics.'
  },
  {
    id: 'architecture-reviewer',
    title: 'Architecture Reviewer',
    pathId: 'architecture',
    icon: 'Layers',
    badgeIcon: '🏛️',
    color: '#60a5fa',
    rarity: 'Epic',
    requirement: 'Score 85%+ on Security Architecture Module Quiz',
    description: 'Qualified to review enterprise multi-account landing zones, Defense-in-Depth layers, and Zero Trust identity perimeters.'
  },
  {
    id: 'incident-commander',
    title: 'Incident Commander',
    pathId: 'incident-response',
    icon: 'ShieldAlert',
    badgeIcon: '🚨',
    color: '#f43f5e',
    rarity: 'Epic',
    requirement: 'Score 85%+ on Incident Response Module Quiz',
    description: 'Trained in NIST SP 800-61 cloud containment, forensic EBS snapshot preservation, session token revocation, and post-mortems.'
  },
  {
    id: 'cloud-security-scholar',
    title: 'Cloud Security Scholar',
    pathId: 'all',
    icon: 'Award',
    badgeIcon: '🎓',
    color: '#f59e0b',
    rarity: 'Legendary',
    requirement: 'Earn at least 4 Module Defender badges across SeCloudive Academy',
    description: 'Achieved cross-domain mastery across Identity, Data, Network, Monitoring, and Incident Engineering.'
  }
]

// Evaluates which badges a user has earned based on topic completions and quiz scores
export function evaluateEarnedBadges(completedTopicIds = [], quizScores = {}) {
  const earned = []

  // IAM Explorer
  const iamCompletedCount = completedTopicIds.filter(id => id.startsWith('iam-') || id === 'users-vs-roles' || id === 'policies-deep-dive' || id === 'least-privilege' || id === 'mfa-enforcement' || id === 'permission-boundaries' || id === 'cross-account' || id === 'iam-best-practices').length
  const iamQuiz = quizScores['iam']
  if (iamCompletedCount >= 4 || (iamQuiz && iamQuiz.percentage >= 70)) {
    earned.push('iam-explorer')
  }

  // Path Quiz Badges (85%+ threshold)
  if (quizScores['iam']?.percentage >= 85) earned.push('iam-defender')
  if (quizScores['s3']?.percentage >= 85) earned.push('s3-guardian')
  if (quizScores['network']?.percentage >= 85) earned.push('network-protector')
  if (quizScores['monitoring']?.percentage >= 85) earned.push('monitoring-specialist')
  if (quizScores['architecture']?.percentage >= 85) earned.push('architecture-reviewer')
  if (quizScores['incident-response']?.percentage >= 85) earned.push('incident-commander')

  // Cloud Security Scholar (4+ rare/epic badges)
  const coreDefenderBadges = [
    'iam-defender',
    's3-guardian',
    'network-protector',
    'monitoring-specialist',
    'architecture-reviewer',
    'incident-commander'
  ]
  const defenderCount = coreDefenderBadges.filter(b => earned.includes(b)).length
  if (defenderCount >= 4) {
    earned.push('cloud-security-scholar')
  }

  return earned
}
