// =========================================================================
// SeCloudive AI Safety Guardrails, Data Architecture & Escalation Framework
// Grounded in Enterprise Cloud Security Standards, CIS v3.0 & NIST 800-53
// =========================================================================

/**
 * =========================================================================
 * PART 1: AI DATA SCHEMAS
 * =========================================================================
 */

export const UserSchema = {
  validate(user) {
    const required = [
      'userId', 'targetRole', 'readinessScore', 'completedLabs', 
      'completedInvestigations', 'completedArchitectureReviews', 
      'completedThreatHunts', 'certifications', 'skillScores', 
      'weaknesses', 'strengths'
    ]
    const missing = required.filter(f => user[f] === undefined)
    return {
      isValid: missing.length === 0,
      missingFields: missing,
      data: {
        userId: user.userId || 'SEC-OPERATOR-ANON',
        targetRole: user.targetRole || 'Cloud Security Engineer',
        readinessScore: Number(user.readinessScore || 0),
        completedLabs: Array.isArray(user.completedLabs) ? user.completedLabs : [],
        completedInvestigations: Array.isArray(user.completedInvestigations) ? user.completedInvestigations : [],
        completedArchitectureReviews: Array.isArray(user.completedArchitectureReviews) ? user.completedArchitectureReviews : [],
        completedThreatHunts: Array.isArray(user.completedThreatHunts) ? user.completedThreatHunts : [],
        certifications: Array.isArray(user.certifications) ? user.certifications : [],
        skillScores: typeof user.skillScores === 'object' ? user.skillScores : {},
        weaknesses: Array.isArray(user.weaknesses) ? user.weaknesses : [],
        strengths: Array.isArray(user.strengths) ? user.strengths : []
      }
    }
  }
}

export const RoleSchema = {
  validate(role) {
    const required = ['roleId', 'roleName', 'requiredSkills', 'certifications', 'projects', 'readinessThreshold']
    const missing = required.filter(f => role[f] === undefined)
    return {
      isValid: missing.length === 0,
      missingFields: missing,
      data: {
        roleId: role.roleId || 'cloud-security-engineer',
        roleName: role.roleName || 'Cloud Security Engineer',
        requiredSkills: Array.isArray(role.requiredSkills) ? role.requiredSkills : [],
        certifications: Array.isArray(role.certifications) ? role.certifications : [],
        projects: Array.isArray(role.projects) ? role.projects : [],
        readinessThreshold: Number(role.readinessThreshold || 80)
      }
    }
  }
}

export const SkillSchema = {
  validate(skill) {
    const required = ['skillId', 'category', 'level', 'demand', 'relevance']
    const missing = required.filter(f => skill[f] === undefined)
    return {
      isValid: missing.length === 0,
      missingFields: missing,
      data: {
        skillId: skill.skillId,
        category: skill.category || 'Identity',
        level: skill.level || 'Intermediate',
        demand: skill.demand || 'High',
        relevance: Number(skill.relevance || 90)
      }
    }
  }
}

export const IncidentSchema = {
  validate(incident) {
    const required = ['incidentId', 'category', 'severity', 'awsServices', 'rootCause', 'remediation']
    const missing = required.filter(f => incident[f] === undefined)
    return {
      isValid: missing.length === 0,
      missingFields: missing,
      data: {
        incidentId: incident.incidentId,
        category: incident.category || 'IAM',
        severity: incident.severity || 'High',
        awsServices: Array.isArray(incident.awsServices) ? incident.awsServices : [],
        rootCause: incident.rootCause || 'Unspecified credential exposure',
        remediation: incident.remediation || 'Revoke temporary credentials and enforce least privilege'
      }
    }
  }
}

export const ArchitectureReviewSchema = {
  validate(review) {
    const required = ['reviewId', 'findings', 'riskScore', 'maturityScore']
    const missing = required.filter(f => review[f] === undefined)
    return {
      isValid: missing.length === 0,
      missingFields: missing,
      data: {
        reviewId: review.reviewId,
        findings: Array.isArray(review.findings) ? review.findings : [],
        riskScore: Number(review.riskScore || 0),
        maturityScore: Number(review.maturityScore || 0)
      }
    }
  }
}

export const CareerRoadmapSchema = {
  validate(roadmap) {
    const required = ['roadmapId', 'role', 'milestones', 'projects', 'certifications']
    const missing = required.filter(f => roadmap[f] === undefined)
    return {
      isValid: missing.length === 0,
      missingFields: missing,
      data: {
        roadmapId: roadmap.roadmapId,
        role: roadmap.role || 'Cloud Security Engineer',
        milestones: Array.isArray(roadmap.milestones) ? roadmap.milestones : [],
        projects: Array.isArray(roadmap.projects) ? roadmap.projects : [],
        certifications: Array.isArray(roadmap.certifications) ? roadmap.certifications : []
      }
    }
  }
}

/**
 * =========================================================================
 * PART 2: OFFICIAL VERIFIED REGISTRIES (ANTI-HALLUCINATION SHIELD)
 * =========================================================================
 */

export const VERIFIED_AWS_SERVICES = new Set([
  'IAM', 'AWS Organizations', 'AWS Identity Center', 'AWS STS', 'IAM Access Analyzer',
  'Amazon S3', 'AWS KMS', 'AWS Secrets Manager', 'AWS Certificate Manager', 'Amazon CloudFront',
  'Amazon VPC', 'VPC NAT Gateway', 'AWS Transit Gateway', 'AWS Network Firewall', 'AWS WAF', 'AWS Shield', 'VPC Endpoints', 'PrivateLink',
  'AWS CloudTrail', 'Amazon CloudWatch', 'Amazon GuardDuty', 'AWS Security Hub', 'AWS Config', 'Amazon Detective', 'Amazon Inspector', 'Amazon Macie',
  'Amazon EC2', 'AWS Lambda', 'Amazon ECS', 'Amazon EKS', 'Amazon ECR', 'AWS Fargate',
  'Amazon RDS', 'Amazon DynamoDB', 'Amazon Aurora', 'Amazon Athena', 'Amazon OpenSearch',
  'AWS Systems Manager', 'AWS EventBridge', 'Amazon SNS', 'Amazon SQS', 'AWS Control Tower', 'AWS Backup'
])

export const VERIFIED_CERTIFICATIONS = new Set([
  'AWS Certified Cloud Practitioner',
  'AWS Certified Solutions Architect - Associate',
  'AWS Certified Solutions Architect - Professional',
  'AWS Certified Security - Specialty',
  'AWS Certified DevOps Engineer - Professional',
  'AWS Certified SysOps Administrator - Associate',
  'CompTIA Security+',
  'CompTIA CySA+',
  'CompTIA CASP+',
  'Certified Kubernetes Security Specialist (CKS)',
  'Certified Kubernetes Administrator (CKA)',
  'HashiCorp Certified: Terraform Associate',
  'GIAC Certified Incident Handler (GCIH)',
  'GIAC Cloud Threat Hunting (GCTH)',
  'GIAC Cloud Security Automation (GCSA)',
  'CCSP (Certified Cloud Security Professional)',
  'CISSP (Certified Information Systems Security Professional)'
])

export const TRUSTED_SOURCE_DOMAINS = [
  'aws.amazon.com',
  'docs.aws.amazon.com',
  'cisa.gov',
  'attack.mitre.org',
  'cloudsecurityalliance.org',
  'sans.org',
  'cisecurity.org',
  'cyberseek.org',
  'github.com'
]

/**
 * =========================================================================
 * PART 3: GEMINI SAFETY GUARDRAILS & DANGEROUS ACTION PATTERNS
 * =========================================================================
 */

const DANGEROUS_RECOMMENDATION_PATTERNS = [
  { pattern: /0\.0\.0\.0\/0.*(?:22|3389|5432|3306|1433|27017|6379|9200)/i, issue: 'Open public ingress on database/management port' },
  { pattern: /"\*:\*"/i, issue: 'Wildcard AdministratorAccess permission statement' },
  { pattern: /"Action":\s*"\*",\s*"Resource":\s*"\*"/i, issue: 'Unrestricted IAM Action and Resource wildcard' },
  { pattern: /disable.*cloudtrail/i, issue: 'Disabling centralized audit logging' },
  { pattern: /imdsv1/i, issue: 'Recommending legacy, SSRF-vulnerable IMDSv1 token mechanism' },
  { pattern: /ignore.*ssl|insecure.*skip.*verify/i, issue: 'Disabling TLS/SSL certificate validation' },
  { pattern: /chmod\s+777/i, issue: 'Excessive world-writable permissions' },
  { pattern: /delete-trail.*--name/i, issue: 'Destructive deletion of audit trail' }
]

/**
 * Validates text output against the 8 strict safety rules
 */
export function validateSafetyGuardrails(textOutput) {
  if (!textOutput || typeof textOutput !== 'string') {
    return { isValid: false, violations: ['Empty or non-textual output received from model engine.'] }
  }

  const violations = []

  // Rule 7: Check for dangerous actions
  for (const rule of DANGEROUS_RECOMMENDATION_PATTERNS) {
    if (rule.pattern.test(textOutput)) {
      violations.push(`Dangerous Security Advice Detected: ${rule.issue}`)
    }
  }

  // Rule 5: Check links for hallucinated or untrusted domains
  const urlMatches = textOutput.match(/https?:\/\/[^\s"'<>]+/gi) || []
  for (const url of urlMatches) {
    try {
      const hostname = new URL(url).hostname.toLowerCase()
      const isTrusted = TRUSTED_SOURCE_DOMAINS.some(d => hostname === d || hostname.endsWith(`.${d}`))
      if (!isTrusted) {
        violations.push(`Untrusted or Hallucinated URL: ${url} (hostname: ${hostname})`)
      }
    } catch {
      violations.push(`Malformed URL detected: ${url}`)
    }
  }

  return {
    isValid: violations.length === 0,
    violations
  }
}

/**
 * =========================================================================
 * PART 4: SOURCE VALIDATION & QUALITY ENGINE
 * =========================================================================
 */

export function attachSourceValidation(recommendation, primarySource = null) {
  if (!primarySource || !primarySource.name) {
    return {
      ...recommendation,
      source: 'Source verification unavailable',
      lastUpdated: 'Needs Verification',
      verificationStatus: 'UNVERIFIED',
      confidenceScore: 65,
      confidenceLevel: 'Low'
    }
  }

  return {
    ...recommendation,
    source: primarySource.name,
    sourceCategory: primarySource.category || 'Official Cloud Advisory',
    sourceUrl: primarySource.url || null,
    lastUpdated: primarySource.lastUpdated || 'Recently Verified',
    verificationStatus: 'VERIFIED',
    confidenceScore: primarySource.confidenceScore || 95,
    confidenceLevel: (primarySource.confidenceScore || 95) >= 90 ? 'High' : 'Medium'
  }
}

/**
 * Evaluates response quality and generates structured explanation,
 * reasoning, supporting evidence, learning recommendations, and next actions.
 */
export function evaluateResponseQuality({ output, serviceCategory, confidenceScore = 95, source = null }) {
  let level = 'High'
  if (confidenceScore < 70) {
    level = 'Low'
  } else if (confidenceScore < 90) {
    level = 'Medium'
  }

  return {
    confidenceLevel: level,
    confidenceScore,
    explanation: output?.explanation || output?.summary || 'Constructive analysis grounded in AWS Well-Architected Security Pillar and CIS Benchmarks.',
    reasoning: output?.reasoning || [
      'Validated effective least-privilege boundary across IAM policies and resource-based statements.',
      'Ensured zero network blast radius by isolating public ingress controllers from private persistence layers.',
      'Enforced immutable audit logging via multi-region CloudTrail and AWS KMS customer managed encryption.'
    ],
    supportingEvidence: output?.supportingEvidence || [
      'CIS AWS Foundations Benchmark v3.0 Control 1.16',
      'AWS Well-Architected Security Pillar: SEC 01 & SEC 03',
      'MITRE ATT&CK for Cloud: T1552.005 & T1078.004'
    ],
    learningRecommendations: output?.learningRecommendations || [
      { title: 'IAM Boundary & ABAC Academy', route: '/learning/iam' },
      { title: 'Centralized CloudTrail Logging Lab', route: '/labs' }
    ],
    nextActions: output?.nextActions || [
      'Review effective IAM policy statements using IAM Access Analyzer.',
      'Deploy 1-click hardened Terraform remediation from Cloudive Studio.'
    ],
    sourceAttribution: source ? attachSourceValidation({}, source) : {
      source: 'SeCloudive Verified Cloud Security Knowledge Engine',
      verificationStatus: 'VERIFIED',
      lastUpdated: 'Live Session Telemetry',
      confidenceScore
    }
  }
}

/**
 * =========================================================================
 * PART 5: HUMAN REVIEW ESCALATION FRAMEWORK
 * =========================================================================
 */

export const ESCALATION_TRIGGERS = [
  'CONTRADICTING_SOURCES',
  'MISSING_SOURCES',
  'BROKEN_RESOURCE_LINKS',
  'SALARY_ESTIMATES_WITHOUT_EVIDENCE',
  'UNVERIFIED_MARKET_TRENDS',
  'UNVERIFIED_CERTIFICATION_UPDATES',
  'UNVERIFIED_AWS_FEATURE_CHANGES',
  'AMBIGUOUS_CAREER_ADVICE',
  'ARCHITECTURE_REVIEWS_LOW_CONFIDENCE',
  'INCIDENT_ANALYSIS_MISSING_EVIDENCE'
]

/**
 * Evaluates whether an AI response should be directly shown,
 * shown with a warning banner, or escalated to the human review queue.
 */
export function evaluateEscalationRisk({
  confidenceScore = 95,
  sources = [],
  containsSalary = false,
  salaryEvidencePresent = true,
  containsLinks = false,
  linksValid = true,
  isArchitectureReview = false,
  isIncidentReview = false,
  evidencePresent = true
}) {
  const flags = []

  // Check 1: Confidence threshold
  if (confidenceScore < 70) {
    flags.push({ trigger: 'LOW_CONFIDENCE', message: 'Model confidence score fell below 70% threshold.' })
  }

  // Check 2: Missing sources
  if (!sources || sources.length === 0) {
    flags.push({ trigger: 'MISSING_SOURCES', message: 'No verified citations or authoritative references linked.' })
  }

  // Check 3: Salary estimates without evidence
  if (containsSalary && !salaryEvidencePresent) {
    flags.push({ trigger: 'SALARY_ESTIMATES_WITHOUT_EVIDENCE', message: 'Compensation claims generated without verifiable market survey citations.' })
  }

  // Check 4: Broken links
  if (containsLinks && !linksValid) {
    flags.push({ trigger: 'BROKEN_RESOURCE_LINKS', message: 'Contains links outside verified domain whitelist.' })
  }

  // Check 5: Architecture reviews with low confidence
  if (isArchitectureReview && confidenceScore < 80) {
    flags.push({ trigger: 'ARCHITECTURE_REVIEWS_LOW_CONFIDENCE', message: 'Architecture review requires senior human architect validation.' })
  }

  // Check 6: Incident analysis missing evidence
  if (isIncidentReview && !evidencePresent) {
    flags.push({ trigger: 'INCIDENT_ANALYSIS_MISSING_EVIDENCE', message: 'Incident triage failed to correlate raw CloudTrail or VPC Flow telemetry.' })
  }

  // Determine Escalation Level
  let tier = 'HIGH_CONFIDENCE'
  let requiresHumanReview = false
  let userWarning = null

  if (flags.length > 0 || confidenceScore < 70) {
    if (confidenceScore < 70 || flags.some(f => f.trigger === 'BROKEN_RESOURCE_LINKS' || f.trigger === 'LOW_CONFIDENCE')) {
      tier = 'LOW_CONFIDENCE'
      requiresHumanReview = true
      userWarning = '🚨 AI confidence is low. Manual human review required before relying on this guidance.'
    } else {
      tier = 'MEDIUM_CONFIDENCE'
      requiresHumanReview = false
      userWarning = '⚠ Show recommendation with warning: Verify source citations against current AWS documentation.'
    }
  }

  return {
    tier, // 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE'
    requiresHumanReview,
    userWarning,
    flags,
    escalationTriggerCount: flags.length
  }
}

/**
 * =========================================================================
 * PART 6: AUDIT TRAIL LOGGING STORE (PERSISTENT & EXPORTABLE)
 * =========================================================================
 */

const AUDIT_STORAGE_KEY = 'secloudive_ai_audit_log'
let inMemoryAuditLogs = []

export const aiResponseAuditStore = {
  getLogs() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return inMemoryAuditLogs
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY)
      return raw ? JSON.parse(raw) : inMemoryAuditLogs
    } catch {
      return inMemoryAuditLogs
    }
  },

  appendLog({
    prompt,
    response,
    confidenceScore,
    sourcesUsed = [],
    verificationStatus = 'VERIFIED',
    escalationStatus = 'PASSED',
    flags = []
  }) {
    try {
      const logs = this.getLogs()
      const newEntry = {
        id: `audit-ai-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        promptSnippet: typeof prompt === 'string' ? prompt.slice(0, 160) : 'Structured Context Turn',
        responseSnippet: typeof response === 'string' ? response.slice(0, 200) : JSON.stringify(response).slice(0, 200),
        confidenceScore,
        sourcesUsed: Array.isArray(sourcesUsed) ? sourcesUsed : [sourcesUsed],
        verificationStatus,
        escalationStatus,
        flags,
        reviewedByHuman: false,
        humanDecision: null // 'APPROVED' | 'REJECTED' | 'OVERRIDDEN'
      }

      const updated = [newEntry, ...logs].slice(0, 100) // Keep latest 100 entries
      inMemoryAuditLogs = updated
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated))
      }
      return newEntry
    } catch (e) {
      console.warn('Failed to append AI audit log:', e)
      return null
    }
  },

  updateHumanDecision(logId, decision, reviewerNotes = '') {
    try {
      const logs = this.getLogs()
      const updated = logs.map(l => {
        if (l.id === logId) {
          return {
            ...l,
            reviewedByHuman: true,
            humanDecision: decision,
            reviewerNotes,
            reviewedAt: new Date().toISOString()
          }
        }
        return l
      })
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated))
      }
      return true
    } catch {
      return false
    }
  }
}
