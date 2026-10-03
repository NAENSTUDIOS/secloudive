// ==============================================================================
// SeCloudive Canonical 4-Tier Cloud Engineering Progression & Clearance Engine
// Sequential Progression from Zero to Enterprise Cloud Architect
//
// 🛠️ Tier 1: First Essentials (The Core Toolbox) - Linux, Bash, Python, Git
// 📦 Tier 2: Next Essentials (The Deployment Layer) - Docker, Cloud Primitives, Terraform, Networking
// ⚡ Tier 3: Advanced Essentials (The Scaling Layer) - Kubernetes, CI/CD, Observability, Security Hardening
// 🏛️ Tier 4: Mastery Essentials (The Architecture Layer) - Multi-Cloud, FinOps, Zero Trust, HA/DR
// ==============================================================================

export const STRUCTURED_LEARNING_PHASES = [
  {
    id: 'tier-01',
    phaseNumber: 1,
    tierNumber: 1,
    code: 'TIER-01',
    tag: 'TIER 1 • FIRST ESSENTIALS',
    title: 'The Core Toolbox',
    subtitle: 'The raw primitives required before touching any cloud provider',
    iconEmoji: '🛠️',
    themeColor: '#38bdf8', // Cyan
    difficulty: 'Foundational',
    estimatedTime: '6-8 Hours',
    totalXP: 450,
    prerequisite: 'None — Start here. Master Linux sysadmin, Bash streams, Python automation, and Git.',
    summary: 'Master the non-negotiable bedrock of cloud systems engineering: POSIX file permissions, process hierarchy, signals, systemd services, SSH bastions, resilient Bash automation pipelines (set -euo pipefail), Python cloud SDK scripts (boto3, azure-identity, google-cloud), and Git branch security.',
    competencies: [
      'Linux Foundations: POSIX file permissions (chmod, chown, sticky bits, SUID/SGID), process hierarchy, signals (SIGTERM, SIGKILL), systemd services, journalctl, and SSH ed25519 authentication',
      'Bash Scripting & Automation: Unix pipelines, streams (stdin, stdout, stderr), grep, awk, sed, jq, resilient scripts (set -euo pipefail), environment variables, and exit codes',
      'Python for Cloud Automation: Scripting with Cloud SDKs (boto3, google-cloud, azure-identity), JSON/YAML configs, REST APIs, and automated security audit scripts',
      'Git Version Control & Collaboration: Branching workflows (feature/, release/, GitFlow, Trunk-based), merge conflict resolution, atomic commits, pre-commit hooks, and Pull Request security reviews'
    ],
    milestones: [
      {
        id: 'm1-1',
        trackingId: 'topic:linux-fundamentals',
        title: 'Linux Foundations: Permissions, Systemd & SSH Bastions',
        type: 'theory',
        estimatedMinutes: 30,
        xp: 75,
        route: '/learning/foundations/linux-fundamentals'
      },
      {
        id: 'm1-2',
        trackingId: 'topic:bash-scripting-automation',
        title: 'Bash Scripting: Pipelines, Streams, JQ & Resilient Automation',
        type: 'theory',
        estimatedMinutes: 35,
        xp: 75,
        route: '/learning/foundations/bash-scripting-automation'
      },
      {
        id: 'm1-3',
        trackingId: 'topic:python-cloud-automation',
        title: 'Python for Cloud Automation & Multi-Cloud SDK Scripting',
        type: 'theory',
        estimatedMinutes: 35,
        xp: 75,
        route: '/learning/foundations/python-cloud-automation'
      },
      {
        id: 'm1-4',
        trackingId: 'topic:git-version-control-workflows',
        title: 'Git Version Control: Trunk-Based Flow & PR Security Reviews',
        type: 'theory',
        estimatedMinutes: 30,
        xp: 75,
        route: '/learning/foundations/git-version-control-workflows'
      },
      {
        id: 'm1-5',
        trackingId: 'quiz:foundations',
        title: 'Tier 1 Knowledge Check & Core Toolbox Certification',
        type: 'quiz',
        estimatedMinutes: 15,
        xp: 150,
        route: '/learning/foundations'
      }
    ],
    primaryAction: {
      label: 'Start Tier 1: Core Toolbox',
      route: '/learning/foundations/linux-fundamentals'
    }
  },
  {
    id: 'tier-02',
    phaseNumber: 2,
    tierNumber: 2,
    code: 'TIER-02',
    tag: 'TIER 2 • NEXT ESSENTIALS',
    title: 'The Deployment Layer',
    subtitle: 'Packaging code, declaring cloud infrastructure, and wiring networks',
    iconEmoji: '📦',
    themeColor: '#10b981', // Emerald
    difficulty: 'Intermediate',
    estimatedTime: '8-10 Hours',
    totalXP: 450,
    prerequisite: 'Complete Tier 1: The Core Toolbox (≥ 70% milestones)',
    summary: 'Package applications into minimal, hardened containers and declare repeatable cloud infrastructure across AWS, Azure, and GCP. Master multi-stage Dockerfiles, compute/storage/identity primitives, Terraform HCL state locking, and CIDR subnet networking.',
    competencies: [
      'Docker & Container Isolation: Minimal multi-stage Dockerfiles (Alpine / Distroless), daemon security, non-root execution (USER 10001), cgroup limits, and layer caching',
      'Cloud Provider Core Primitives: Compute (EC2 / Azure VMs / GCE), Storage (S3 / Blob / Cloud Storage: lifecycle, versioning, encryption), Identity (IAM Roles, Service Principals, Workload Identity)',
      'Terraform & Infrastructure as Code (IaC): Declarative HCL syntax, providers, modules, variables, outputs, remote state locking (S3 + DynamoDB / Terraform Cloud), and drift detection',
      'Networking Fundamentals: IPv4/IPv6 CIDR subnet calculations, public vs. private subnets, routing tables, DNS resolution (Route 53, CoreDNS), NAT Gateways, and Layer 4 vs Layer 7 Load Balancers'
    ],
    milestones: [
      {
        id: 'm2-1',
        trackingId: 'topic:docker-container-security',
        title: 'Docker & Container Security: Hardened Non-Root Manifests',
        type: 'theory',
        estimatedMinutes: 35,
        xp: 75,
        route: '/learning/foundations/docker-container-security'
      },
      {
        id: 'm2-2',
        trackingId: 'topic:cloud-provider-primitives',
        title: 'Cloud Primitives: AWS, Azure & GCP Compute, Storage & IAM',
        type: 'theory',
        estimatedMinutes: 35,
        xp: 75,
        route: '/learning/foundations/cloud-provider-primitives'
      },
      {
        id: 'm2-3',
        trackingId: 'topic:terraform-iac-provisioning',
        title: 'Terraform & IaC: Declarative HCL, State Locking & Drift Defense',
        type: 'theory',
        estimatedMinutes: 35,
        xp: 75,
        route: '/learning/foundations/terraform-iac-provisioning'
      },
      {
        id: 'm2-4',
        trackingId: 'topic:networking-fundamentals',
        title: 'Networking Fundamentals: CIDR Subnets, Route Tables & Gateways',
        type: 'theory',
        estimatedMinutes: 30,
        xp: 75,
        route: '/learning/foundations/networking-fundamentals'
      },
      {
        id: 'm2-5',
        trackingId: 'lab:lab-iam-escalation',
        title: 'Lab 01: IAM Privilege Escalation & Blast Radius Defense',
        type: 'lab',
        estimatedMinutes: 35,
        xp: 150,
        route: '/labs/lab-iam-escalation'
      }
    ],
    primaryAction: {
      label: 'Start Tier 2: Deployment Layer',
      route: '/learning/foundations/docker-container-security'
    }
  },
  {
    id: 'tier-03',
    phaseNumber: 3,
    tierNumber: 3,
    code: 'TIER-03',
    tag: 'TIER 3 • ADVANCED ESSENTIALS',
    title: 'The Scaling Layer',
    subtitle: 'Orchestrating microservices, automating releases, and monitoring fleet health',
    iconEmoji: '⚡',
    themeColor: '#8b5cf6', // Violet
    difficulty: 'Advanced',
    estimatedTime: '10-12 Hours',
    totalXP: 600,
    prerequisite: 'Complete Tier 2: The Deployment Layer (≥ 70% milestones)',
    summary: 'Operate and defend modern containerized microservices at enterprise scale. Master Kubernetes pod lifecycles, Helm packaging, Pod Security Standards, end-to-end CI/CD security gates (SAST/DAST/Trivy), Prometheus & Grafana telemetry, and cryptographic secret management.',
    competencies: [
      'Kubernetes Orchestration: Pod lifecycle, Deployments, ReplicaSets, Services (ClusterIP, NodePort, LoadBalancer), Helm chart packaging, ConfigMaps/Secrets, and Pod Security Standards (PSS)',
      'CI/CD Automation Pipelines: Automated pipelines via GitHub Actions, GitLab CI, and Jenkins: Linting -> SAST/DAST -> Container Build -> Terraform Apply -> Automated Rollbacks',
      'Observability & Telemetry: Prometheus metric scraping, Grafana dashboard visualization, Alertmanager, structured log aggregation (ELK / CloudWatch), and distributed tracing',
      'Cloud Security Hardening: Secret management (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault), Policy-as-Code (Checkov, OPA/Rego, Trivy), and envelope encryption with KMS CMKs'
    ],
    milestones: [
      {
        id: 'm3-1',
        trackingId: 'topic:kubernetes-container-orchestration',
        title: 'Kubernetes Orchestration: Deployments, Services & Helm Packaging',
        type: 'theory',
        estimatedMinutes: 40,
        xp: 100,
        route: '/learning/foundations/kubernetes-container-orchestration'
      },
      {
        id: 'm3-2',
        trackingId: 'topic:cicd-automation-pipelines',
        title: 'CI/CD Pipelines: GitHub Actions, OIDC & SAST/DAST Scanning',
        type: 'theory',
        estimatedMinutes: 35,
        xp: 100,
        route: '/learning/foundations/cicd-automation-pipelines'
      },
      {
        id: 'm3-3',
        trackingId: 'topic:observability-prometheus-grafana',
        title: 'Observability & Telemetry: Prometheus Metrics & Grafana Dashboards',
        type: 'theory',
        estimatedMinutes: 35,
        xp: 100,
        route: '/learning/monitoring/observability-prometheus-grafana'
      },
      {
        id: 'm3-4',
        trackingId: 'topic:least-privilege',
        title: 'Cloud Security Hardening: KMS CMKs & Policy-as-Code',
        type: 'theory',
        estimatedMinutes: 35,
        xp: 100,
        route: '/learning/iam/least-privilege'
      },
      {
        id: 'm3-5',
        trackingId: 'battleroom:room-eks-irsa-privilege-escalation',
        title: 'Battle Room: Kubernetes EKS IRSA Token Theft & Containment',
        type: 'battleroom',
        estimatedMinutes: 50,
        xp: 200,
        route: '/battle-rooms/room-eks-irsa-privilege-escalation'
      }
    ],
    primaryAction: {
      label: 'Start Tier 3: Scaling Layer',
      route: '/learning/foundations/kubernetes-container-orchestration'
    }
  },
  {
    id: 'tier-04',
    phaseNumber: 4,
    tierNumber: 4,
    code: 'TIER-04',
    tag: 'TIER 4 • MASTERY ESSENTIALS',
    title: 'The Architecture Layer',
    subtitle: 'Enterprise decision-making, cost governance, and business resilience',
    iconEmoji: '🏛️',
    themeColor: '#f59e0b', // Amber / Gold
    difficulty: 'Mastery / Architect',
    estimatedTime: '12-14 Hours',
    totalXP: 650,
    prerequisite: 'Complete Tier 3: The Scaling Layer (≥ 70% milestones)',
    summary: 'Architect resilient, cost-optimized, and breach-resistant enterprise cloud estates. Master vendor-agnostic multi-cloud strategies, FinOps cost governance and automated waste scrapers, Zero Trust continuous authentication, and multi-region active-active disaster recovery with chaos testing.',
    competencies: [
      'Multi-Cloud Strategy & Portability: Designing vendor-agnostic containerized architectures to avoid vendor lock-in, abstracted egress/ingress, and standardized identity federation',
      'FinOps & Cloud Cost Optimization: Unit economics, rightsizing compute, Savings Plans / Reserved Instances, Spot fleet strategies, automated budget alerts, and orphaned volume scrapers',
      'Zero Trust Architecture (ZTA): Identity-Aware Proxies (IAP / AWS Verified Access), mutual TLS (mTLS), micro-segmentation, and replacing open VPNs with continuous context-based access evaluation',
      'High Availability (HA) & Disaster Recovery (DR): Multi-AZ vs. Multi-Region active-active and active-passive designs, defining and testing RTO and RPO via chaos drills'
    ],
    milestones: [
      {
        id: 'm4-1',
        trackingId: 'topic:multicloud-strategy-portability',
        title: 'Multi-Cloud Strategy: Vendor-Agnostic IaC & Portability Topologies',
        type: 'theory',
        estimatedMinutes: 40,
        xp: 100,
        route: '/learning/architecture/multicloud-strategy-portability'
      },
      {
        id: 'm4-2',
        trackingId: 'topic:finops-cloud-cost-governance',
        title: 'FinOps & Cost Governance: Rightsizing, Spot Fleets & Waste Scrapers',
        type: 'theory',
        estimatedMinutes: 40,
        xp: 100,
        route: '/learning/architecture/finops-cloud-cost-governance'
      },
      {
        id: 'm4-3',
        trackingId: 'topic:zero-trust',
        title: 'Zero Trust Architecture: Identity-Aware Proxies & Contextual Access',
        type: 'theory',
        estimatedMinutes: 40,
        xp: 100,
        route: '/learning/architecture/zero-trust'
      },
      {
        id: 'm4-4',
        trackingId: 'topic:ha-disaster-recovery-resilience',
        title: 'High Availability & Disaster Recovery: Multi-Region RTO/RPO Drills',
        type: 'theory',
        estimatedMinutes: 40,
        xp: 100,
        route: '/learning/architecture/ha-disaster-recovery-resilience'
      },
      {
        id: 'm4-5',
        trackingId: 'studio:cloudive-studio',
        title: 'Cloudive Studio: Multi-Cloud Production Architecture & Auto-Fixer',
        type: 'studio',
        estimatedMinutes: 45,
        xp: 250,
        route: '/cloudive-studio'
      }
    ],
    primaryAction: {
      label: 'Start Tier 4: Architecture Layer',
      route: '/learning/architecture/multicloud-strategy-portability'
    }
  }
]

/**
 * Checks whether a specific milestone is completed in real-time
 * using the learner's actual reactive progress state
 */
export function isMilestoneCompleted(milestone, progress = {}) {
  if (!milestone || !milestone.trackingId) return false
  const [kind, id] = milestone.trackingId.split(':')

  if (kind === 'topic') {
    return (progress.learningTopicsCompleted || []).includes(id)
  }
  if (kind === 'quiz') {
    return progress.learningQuizScores?.[id] !== undefined
  }
  if (kind === 'lab') {
    return Boolean(
      (progress.labSteps?.[id] && progress.labSteps[id].length >= 3) ||
      progress.rampupLabsCompleted?.[id] ||
      progress.completedSafeLabs?.[id]
    )
  }
  if (kind === 'battleroom') {
    return Boolean(progress.battleRoomsSolved?.[id])
  }
  if (kind === 'studio') {
    return Boolean(progress.cloudProjectsCompleted && Object.keys(progress.cloudProjectsCompleted).length > 0)
  }
  if (kind === 'internship') {
    return Boolean(progress.simulatorScores && Object.keys(progress.simulatorScores).length > 0)
  }
  if (kind === 'interview') {
    return Boolean(progress.interviewAttempts && Object.keys(progress.interviewAttempts).length > 0)
  }
  if (kind === 'audit') {
    return Boolean(progress.verifiedAuditPack || (progress.downloadedPacks && progress.downloadedPacks.length > 0))
  }
  if (kind === 'credential') {
    return Boolean(progress.earnedBadges && progress.earnedBadges.length >= 3)
  }

  return false
}

/**
 * Calculates live progress stats for a specific phase/tier
 */
export function getPhaseProgress(phase, progress = {}) {
  const milestones = phase?.milestones || []
  const completedCount = milestones.filter(m => isMilestoneCompleted(m, progress)).length
  const percent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0
  const isMastered = completedCount === milestones.length && milestones.length > 0
  return {
    completedCount,
    totalCount: milestones.length,
    percent,
    isMastered
  }
}

/**
 * Determines whether a tier is unlocked based on sequential prerequisites
 */
export function isPhaseUnlocked(phaseNumber, progress = {}, unlockAllOverride = false) {
  if (unlockAllOverride) return true
  if (phaseNumber === 1) return true

  // For Tier 2, require Tier 1 completion (>= 70%) OR diagnostic baseline override
  if (phaseNumber === 2) {
    const t1 = getPhaseProgress(STRUCTURED_LEARNING_PHASES[0], progress)
    return t1.percent >= 70 || Boolean(
      (progress.diagnosticBaseline && (progress.diagnosticBaseline.recommendedTier >= 2 || progress.diagnosticBaseline.score >= 60)) ||
      progress.stepWiseUnlocks?.includes('step-02') ||
      progress.tierOverride >= 2
    )
  }

  // For Tier 3, require Tier 2 completion (>= 70%)
  if (phaseNumber === 3) {
    const t2 = getPhaseProgress(STRUCTURED_LEARNING_PHASES[1], progress)
    return t2.percent >= 70 || Boolean(
      (progress.diagnosticBaseline && (progress.diagnosticBaseline.recommendedTier >= 3 || progress.diagnosticBaseline.score >= 75)) ||
      progress.stepWiseUnlocks?.includes('step-03') ||
      progress.tierOverride >= 3
    )
  }

  // For Tier 4, require Tier 3 completion (>= 70%)
  if (phaseNumber === 4) {
    const t3 = getPhaseProgress(STRUCTURED_LEARNING_PHASES[2], progress)
    return t3.percent >= 70 || Boolean(
      (progress.diagnosticBaseline && (progress.diagnosticBaseline.recommendedTier >= 4 || progress.diagnosticBaseline.score >= 90)) ||
      progress.stepWiseUnlocks?.includes('step-04') ||
      progress.tierOverride >= 4
    )
  }

  return false
}

/**
 * Determines the learner's current active phase and exact next recommended milestone
 * based on live progress
 */
export function getCurrentLearningStage(progress = {}, unlockAllOverride = false) {
  for (let i = 0; i < STRUCTURED_LEARNING_PHASES.length; i++) {
    const phase = STRUCTURED_LEARNING_PHASES[i]
    const pStats = getPhaseProgress(phase, progress)

    // Check if phase is unlocked
    const unlocked = isPhaseUnlocked(phase.phaseNumber, progress, unlockAllOverride)
    if (!unlocked) {
      // Return previous phase's incomplete item
      const prevPhase = STRUCTURED_LEARNING_PHASES[Math.max(0, i - 1)]
      const firstIncomplete = prevPhase.milestones.find(m => !isMilestoneCompleted(m, progress)) || prevPhase.milestones[0]
      return {
        currentPhase: prevPhase,
        currentStepNumber: prevPhase.phaseNumber,
        nextMilestone: firstIncomplete,
        progressPercent: getPhaseProgress(prevPhase, progress).percent,
        allCompleted: false
      }
    }

    // If unlocked and not yet mastered, find the first incomplete milestone
    if (!pStats.isMastered) {
      const firstIncomplete = phase.milestones.find(m => !isMilestoneCompleted(m, progress)) || phase.milestones[0]
      return {
        currentPhase: phase,
        currentStepNumber: phase.phaseNumber,
        nextMilestone: firstIncomplete,
        progressPercent: pStats.percent,
        allCompleted: false
      }
    }
  }

  // All 4 tiers completed!
  const lastPhase = STRUCTURED_LEARNING_PHASES[3]
  return {
    currentPhase: lastPhase,
    currentStepNumber: 4,
    nextMilestone: lastPhase.milestones[lastPhase.milestones.length - 1],
    progressPercent: 100,
    allCompleted: true
  }
}

/**
 * Canonical Clearance Engine:
 * Maps learner progress to verified Cyber Security Clearance Level (1 through 5)
 */
export function getLearnerClearance(progress = {}, unlockAllOverride = false) {
  if (unlockAllOverride || progress.tierOverride >= 5 || (progress.diagnosticBaseline && progress.diagnosticBaseline.recommendedTier >= 5)) {
    return {
      tier: 5,
      tierCode: 'TIER-05-MASTER',
      tierName: 'Master Cloud Commander (Full Unrestricted Clearance)',
      badge: '🏆 FULL CLEARANCE',
      unlockedAtText: 'Unrestricted Access Active',
      isMasterCleared: true,
      currentTierProgressPercent: 100,
      activeTier: null,
      nextMilestone: null,
      accessibleTierNumbers: [1, 2, 3, 4, 5]
    }
  }

  const t1Stats = getPhaseProgress(STRUCTURED_LEARNING_PHASES[0], progress)
  const t2Stats = getPhaseProgress(STRUCTURED_LEARNING_PHASES[1], progress)
  const t3Stats = getPhaseProgress(STRUCTURED_LEARNING_PHASES[2], progress)
  const t4Stats = getPhaseProgress(STRUCTURED_LEARNING_PHASES[3], progress)

  // Tier 4 Cleared (>= 70%) -> Level 5 Full Clearance
  if (t4Stats.percent >= 70 || progress.diagnosticBaseline?.recommendedTier >= 4) {
    return {
      tier: 5,
      tierCode: 'TIER-05-MASTER',
      tierName: 'Master Cloud Commander (Full Unrestricted Clearance)',
      badge: '🏆 FULL CLEARANCE',
      unlockedAtText: 'Tier 4 Cleared: Full Command Deck Unlocked',
      isMasterCleared: true,
      currentTierProgressPercent: 100,
      activeTier: STRUCTURED_LEARNING_PHASES[3],
      nextMilestone: null,
      accessibleTierNumbers: [1, 2, 3, 4, 5]
    }
  }

  // Tier 3 Cleared (>= 70%) -> Level 4 Clearance
  if (t3Stats.percent >= 70 || progress.diagnosticBaseline?.recommendedTier >= 3) {
    const nextMilestone = STRUCTURED_LEARNING_PHASES[3].milestones.find(m => !isMilestoneCompleted(m, progress)) || STRUCTURED_LEARNING_PHASES[3].milestones[0]
    return {
      tier: 4,
      tierCode: 'TIER-04',
      tierName: 'Tier 4: Architecture Layer',
      badge: 'TIER 4 • ARCHITECT',
      unlockedAtText: 'Tier 3 Cleared: Architecture Reviews & Threat Hunts Unlocked',
      isMasterCleared: false,
      currentTierProgressPercent: t4Stats.percent,
      activeTier: STRUCTURED_LEARNING_PHASES[3],
      nextMilestone,
      accessibleTierNumbers: [1, 2, 3, 4]
    }
  }

  // Tier 2 Cleared (>= 70%) -> Level 3 Clearance
  if (t2Stats.percent >= 70 || progress.diagnosticBaseline?.recommendedTier >= 2) {
    const nextMilestone = STRUCTURED_LEARNING_PHASES[2].milestones.find(m => !isMilestoneCompleted(m, progress)) || STRUCTURED_LEARNING_PHASES[2].milestones[0]
    return {
      tier: 3,
      tierCode: 'TIER-03',
      tierName: 'Tier 3: Scaling Layer',
      badge: 'TIER 3 • SCALING',
      unlockedAtText: 'Tier 2 Cleared: Battle Rooms & Threat Investigations Unlocked',
      isMasterCleared: false,
      currentTierProgressPercent: t3Stats.percent,
      activeTier: STRUCTURED_LEARNING_PHASES[2],
      nextMilestone,
      accessibleTierNumbers: [1, 2, 3]
    }
  }

  // Tier 1 Cleared (>= 70%) -> Level 2 Clearance
  if (t1Stats.percent >= 70 || progress.diagnosticBaseline?.recommendedTier >= 1) {
    const nextMilestone = STRUCTURED_LEARNING_PHASES[1].milestones.find(m => !isMilestoneCompleted(m, progress)) || STRUCTURED_LEARNING_PHASES[1].milestones[0]
    return {
      tier: 2,
      tierCode: 'TIER-02',
      tierName: 'Tier 2: Deployment Layer',
      badge: 'TIER 2 • DEPLOYMENT',
      unlockedAtText: 'Tier 1 Cleared: Cloud Labs, Playbooks & Projects Unlocked',
      isMasterCleared: false,
      currentTierProgressPercent: t2Stats.percent,
      activeTier: STRUCTURED_LEARNING_PHASES[1],
      nextMilestone,
      accessibleTierNumbers: [1, 2]
    }
  }

  // Tier 1 Active (Initial Recruit Level)
  const nextMilestone = STRUCTURED_LEARNING_PHASES[0].milestones.find(m => !isMilestoneCompleted(m, progress)) || STRUCTURED_LEARNING_PHASES[0].milestones[0]
  return {
    tier: 1,
    tierCode: 'TIER-01',
    tierName: 'Tier 1: The Core Toolbox',
    badge: 'TIER 1 • TOOLBOX',
    unlockedAtText: 'Foundations & Guides Active • Labs Locked Until Tier 1 Cleared',
    isMasterCleared: false,
    currentTierProgressPercent: t1Stats.percent,
    activeTier: STRUCTURED_LEARNING_PHASES[0],
    nextMilestone,
    accessibleTierNumbers: [1]
  }
}

/**
 * Gatekeeper Access Validator:
 * Validates whether a specific route or feature terminal is accessible by the user.
 */
export function isFeatureAccessible(featureKey, progress = {}, sandboxMode = false) {
  if (sandboxMode || progress.unlockAllOverride) {
    return {
      accessible: true,
      requiredTier: 1,
      requiredTierName: 'Sandbox Mode Active',
      currentTier: 5,
      isSandbox: true
    }
  }

  const clearance = getLearnerClearance(progress, false)

  const featureTierMap = {
    // Tier 1 features (always open to all)
    'home': 1,
    'learning': 1,
    'theory': 1,
    'foundations': 1,
    'ramp-up': 1,
    'rampup': 1,
    'roadmap': 1,
    'exploration-roadmap': 1,
    'categories': 1,
    'downloads': 1,
    'about': 1,
    'legal': 1,
    'dashboard': 1,
    'diagnostic': 1,
    'cost-calculator': 1,
    'zero-cost-labs': 1,

    // Tier 2 features (Requires Tier 1 Cleared)
    'labs': 2,
    'real-labs': 2,
    'playbooks': 2,
    'projects': 2,

    // Tier 3 features (Requires Tier 2 Cleared)
    'battle-rooms': 3,
    'investigations': 3,
    'challenge': 3,

    // Tier 4 features (Requires Tier 3 Cleared)
    'architecture-reviews': 4,
    'live-portal': 4,

    // Tier 5 features (Requires Tier 4 Cleared - Full Master Clearance)
    'internship-simulator': 5,
    'interview-simulator': 5,
    'interview': 5,
    'hiring-simulator': 5,
    'cloudive-studio': 5,
    'builder-studio': 5,
    'report': 5,
    'verify-pack': 5,
    'verify': 5
  }

  const normalized = (featureKey || '').toLowerCase().replace(/^\//, '').split('/')[0]
  const requiredTier = featureTierMap[normalized] || 1

  const tierNames = {
    1: 'Tier 1 (The Core Toolbox)',
    2: 'Tier 2 (The Deployment Layer)',
    3: 'Tier 3 (The Scaling Layer)',
    4: 'Tier 4 (The Architecture Layer)',
    5: 'Tier 4 Cleared (Full Command Deck Access)'
  }

  const requiredDescriptions = {
    2: 'Requires Tier 1 (Core Toolbox) certification. Complete Linux, Bash, Python, and Git milestones to unlock real cloud labs.',
    3: 'This live-fire threat simulator requires Tier 2 (Deployment Layer) certification. Complete your Docker, Cloud Primitives, and Terraform milestones to unlock this terminal.',
    4: 'This enterprise architecture terminal requires Tier 3 (Scaling Layer) certification. Complete your Kubernetes, CI/CD, and Observability milestones to unlock.',
    5: 'This on-call incident simulator and hiring deck requires Tier 4 (Architecture Layer) certification. Complete Multi-Cloud, FinOps, Zero Trust, and HA/DR milestones.'
  }

  const accessible = clearance.tier >= requiredTier

  return {
    accessible,
    requiredTier,
    requiredTierName: tierNames[requiredTier] || `Tier ${requiredTier}`,
    currentTier: clearance.tier,
    currentTierName: clearance.tierName,
    currentTierPercent: clearance.currentTierProgressPercent,
    nextMilestone: clearance.nextMilestone,
    description: requiredDescriptions[requiredTier] || `Requires ${tierNames[requiredTier]} certification to unlock.`
  }
}

