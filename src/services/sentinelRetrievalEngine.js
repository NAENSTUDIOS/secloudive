// =========================================================================
// SeCloudive Sentinel RAG Retrieval & Grounding Engine
// Searches platform scenarios, labs, architecture reviews, and framework citations
// =========================================================================

import { investigations } from '../data/investigations.js'
import { MASTER_INCIDENT_BANK } from '../data/expandedIncidentBank.js'
import { MASTER_SAFE_LABS } from '../data/expandedSafeLabs.js'
import { MASTER_ARCHITECTURE_REVIEWS } from '../data/expandedArchitectureBank.js'
import { UNIFIED_ATTACK_SCENARIOS } from '../data/simulatedAttackScenarios.js'

// Embedded Authoritative Framework Citations
export const FRAMEWORK_CITATIONS = [
  {
    framework: 'CIS AWS Foundations Benchmark v3.0',
    section: '§1.16',
    title: 'Ensure IAM policies that allow full "*:*" administrative privileges are not created',
    details: 'IAM policies must not contain Statement with Effect: Allow, Action: *, and Resource: *. Enforce least privilege using permission boundaries and scoped actions.',
    sourceTag: '[Source: CIS AWS Foundations Benchmark v3.0 §1.16]'
  },
  {
    framework: 'CIS AWS Foundations Benchmark v3.0',
    section: '§1.20',
    title: 'Ensure that S3 Bucket Access is granted through IAM roles and least-privilege policies',
    details: 'S3 bucket access should be managed via scoped IAM role policies rather than long-term user credentials or wide bucket policies.',
    sourceTag: '[Source: CIS AWS Foundations Benchmark v3.0 §1.20]'
  },
  {
    framework: 'CIS AWS Foundations Benchmark v3.0',
    section: '§2.1.1',
    title: 'Ensure all S3 buckets employ encryption-at-rest (SSE-S3 or SSE-KMS)',
    details: 'All S3 buckets must have default encryption enabled using either AWS KMS (SSE-KMS) or Amazon S3-managed keys (SSE-S3) with bucket key enabled to reduce KMS request costs.',
    sourceTag: '[Source: CIS AWS Foundations Benchmark v3.0 §2.1.1]'
  },
  {
    framework: 'CIS AWS Foundations Benchmark v3.0',
    section: '§2.1.2',
    title: 'Ensure S3 Bucket Policy denies HTTP (unencrypted) requests',
    details: 'Bucket policies must enforce TLS in-transit with Condition: {"Bool": {"aws:SecureTransport": "false"}} under Effect: Deny.',
    sourceTag: '[Source: CIS AWS Foundations Benchmark v3.0 §2.1.2]'
  },
  {
    framework: 'CIS AWS Foundations Benchmark v3.0',
    section: '§2.1.5',
    title: 'Ensure S3 Block Public Access is enabled at bucket and account levels',
    details: 'BlockPublicAcls, IgnorePublicAcls, BlockPublicPolicy, and RestrictPublicBuckets must all be set to true.',
    sourceTag: '[Source: CIS AWS Foundations Benchmark v3.0 §2.1.5]'
  },
  {
    framework: 'CIS AWS Foundations Benchmark v3.0',
    section: '§3.1',
    title: 'Ensure CloudTrail is enabled across all regions with log file validation',
    details: 'Multi-region CloudTrail trails must be active, delivered to an encrypted S3 bucket, with EnableLogFileValidation set to true and integrated with CloudWatch Logs.',
    sourceTag: '[Source: CIS AWS Foundations Benchmark v3.0 §3.1]'
  },
  {
    framework: 'NIST SP 800-53 Rev. 5',
    section: 'AC-6',
    title: 'Least Privilege',
    details: 'The organization employs the principle of least privilege, allowing only authorized accesses for users and processes. In AWS, implement via IAM Permission Boundaries, SCPs, and scoped resource ARNs.',
    sourceTag: '[Source: NIST SP 800-53 Rev. 5 AC-6]'
  },
  {
    framework: 'NIST SP 800-53 Rev. 5',
    section: 'AU-2',
    title: 'Event Logging',
    details: 'Identifies the types of events that the system is capable of logging in support of the audit function. Implemented via CloudTrail multi-region trails, VPC Flow Logs, and Route 53 Resolver query logs.',
    sourceTag: '[Source: NIST SP 800-53 Rev. 5 AU-2]'
  },
  {
    framework: 'NIST SP 800-53 Rev. 5',
    section: 'SC-13',
    title: 'Cryptographic Protection',
    details: 'Implements cryptographic modules in accordance with applicable federal laws and standards. In AWS: KMS Customer Managed Keys (CMKs) with annual key rotation and TLS 1.3.',
    sourceTag: '[Source: NIST SP 800-53 Rev. 5 SC-13]'
  },
  {
    framework: 'AWS Well-Architected Framework: Security Pillar',
    section: 'SEC 03',
    title: 'How do you manage permissions for people and machines?',
    details: 'Rely on centralized identity providers, use temporary credentials with STS AssumeRole, define permission guardrails with Service Control Policies (SCPs), and grant least privilege based on activity.',
    sourceTag: '[Source: AWS Well-Architected Framework: Security Pillar SEC 03]'
  },
  {
    framework: 'AWS Well-Architected Framework: Security Pillar',
    section: 'SEC 04',
    title: 'How do you detect and investigate events?',
    details: 'Configure service and application logging (CloudTrail, VPC Flow Logs, GuardDuty), ingest logs into a centralized security account, and automate containment via EventBridge and Lambda.',
    sourceTag: '[Source: AWS Well-Architected Framework: Security Pillar SEC 04]'
  },
  {
    framework: 'MITRE ATT&CK for Cloud (AWS)',
    section: 'T1552.005',
    title: 'Cloud Instance Metadata Service (IMDSv1 SSRF)',
    details: 'Adversaries query the EC2 metadata service (169.254.169.254) via web application vulnerabilities (SSRF) to exfiltrate IAM role credentials. Defense: Enforce IMDSv2 (HttpTokens=required, HttpHopLimit=1).',
    sourceTag: '[Source: MITRE ATT&CK for Cloud T1552.005]'
  },
  {
    framework: 'MITRE ATT&CK for Cloud (AWS)',
    section: 'T1530',
    title: 'Data from Cloud Storage Object',
    details: 'Adversaries access data objects stored in cloud storage buckets that are inadvertently made public or accessible through compromised credentials. Defense: S3 Block Public Access, bucket policies with SecureTransport, and GuardDuty S3 Protection.',
    sourceTag: '[Source: MITRE ATT&CK for Cloud T1530]'
  }
]

/**
 * Normalizes strings for keyword matching
 */
function cleanTerms(text) {
  if (!text) return []
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2)
}

/**
 * Searches the SeCloudive content library for grounded context
 */
export function retrievePlatformContext({ query, route = '', activeScenarioId = null, studentTelemetry = {} }) {
  const qLower = (query || '').toLowerCase().trim()
  const matches = []
  let hasSpecificIdQuery = false

  // 1. Check if user specified a scenario ID or lab ID
  const idPattern = /\b(inv-[a-z0-9-]+|ir-[0-9]+|aws-ir-[0-9]+|lab-[a-z0-9-]+|safe-[a-z0-9-]+|arch-[a-z0-9-]+)\b/i
  const extractedId = qLower.match(idPattern)?.[0]?.toLowerCase() || (activeScenarioId ? activeScenarioId.toLowerCase() : null)

  if (extractedId) {
    hasSpecificIdQuery = true
  }

  // 2. Search investigations / Incident Simulator
  const allInvestigations = [
    ...(Array.isArray(investigations) ? investigations : []),
    ...(Array.isArray(MASTER_INCIDENT_BANK) ? MASTER_INCIDENT_BANK : [])
  ]

  for (const inv of allInvestigations) {
    const invId = (inv.id || inv.ticket || '').toLowerCase()
    const title = (inv.title || inv.sub || '').toLowerCase()
    const summary = (inv.incidentSummary || inv.cause || inv.symptom || '').toLowerCase()

    if (extractedId && (invId === extractedId || invId.includes(extractedId))) {
      matches.push({
        type: 'scenario',
        id: inv.id || inv.ticket || 'SIM-INCIDENT',
        title: inv.title || inv.sub,
        summary: inv.incidentSummary || inv.cause || inv.symptom,
        remediation: inv.remediation || inv.businessContext || 'Enforce IAM boundaries and rotate compromised credentials.',
        services: inv.affectedServices || inv.services || [],
        sourceTag: `[Source: Scenario ${inv.id || inv.ticket}] [SIMULATED - not a real AWS event]`
      })
      break
    } else if (qLower.length > 5 && (title.includes(qLower) || qLower.includes(title))) {
      matches.push({
        type: 'scenario',
        id: inv.id || inv.ticket || 'SIM-INCIDENT',
        title: inv.title || inv.sub,
        summary: inv.incidentSummary || inv.cause,
        remediation: inv.remediation,
        sourceTag: `[Source: Scenario ${inv.id || inv.ticket}] [SIMULATED - not a real AWS event]`
      })
      if (matches.length >= 2) break
    }
  }

  // 3. Search Safe Labs
  if (Array.isArray(MASTER_SAFE_LABS)) {
    for (const lab of MASTER_SAFE_LABS) {
      const labSlug = (lab.slug || lab.id || '').toLowerCase()
      const labTitle = (lab.title || '').toLowerCase()
      if (extractedId && (labSlug === extractedId || labSlug.includes(extractedId))) {
        matches.push({
          type: 'lab',
          id: lab.slug || lab.id,
          title: lab.title,
          objective: lab.objective,
          cost: lab.cost,
          steps: lab.steps?.slice(0, 3) || [],
          sourceTag: `[Source: Lab ${lab.slug || lab.id}] [SIMULATED - not a real AWS event]`
        })
        break
      } else if (qLower.length > 5 && labTitle.includes(qLower)) {
        matches.push({
          type: 'lab',
          id: lab.slug || lab.id,
          title: lab.title,
          objective: lab.objective,
          sourceTag: `[Source: Lab ${lab.slug || lab.id}] [SIMULATED - not a real AWS event]`
        })
        if (matches.length >= 2) break
      }
    }
  }

  // 4. Search Architecture Reviews
  if (Array.isArray(MASTER_ARCHITECTURE_REVIEWS)) {
    for (const arch of MASTER_ARCHITECTURE_REVIEWS) {
      const archTitle = (arch.title || '').toLowerCase()
      if (qLower.length > 5 && (archTitle.includes(qLower) || qLower.includes(archTitle))) {
        matches.push({
          type: 'architecture',
          title: arch.title,
          description: arch.description,
          findings: arch.findings?.map(f => `${f.code}: ${f.title}`).slice(0, 2) || [],
          sourceTag: `[Source: Architecture Review "${arch.title}"]`
        })
        if (matches.length >= 2) break
      }
    }
  }

  // 5. Search Framework Citations (CIS, NIST, Well-Architected, MITRE)
  for (const cite of FRAMEWORK_CITATIONS) {
    const secLower = cite.section.toLowerCase()
    const frameLower = cite.framework.toLowerCase()
    const titleLower = cite.title.toLowerCase()

    if (
      qLower.includes(secLower) ||
      (qLower.includes('cis') && (secLower.includes('1.') || secLower.includes('2.') || secLower.includes('3.'))) ||
      (qLower.includes('nist') && secLower.includes('ac-') || secLower.includes('au-') || secLower.includes('sc-')) ||
      (qLower.includes('well-architected') && secLower.includes('sec')) ||
      (qLower.includes('mitre') && secLower.startsWith('t1')) ||
      titleLower.split(/\s+/).some(word => word.length > 4 && qLower.includes(word))
    ) {
      matches.push({
        type: 'framework',
        framework: cite.framework,
        section: cite.section,
        title: cite.title,
        details: cite.details,
        sourceTag: cite.sourceTag
      })
      if (matches.length >= 3) break
    }
  }

  // 6. Handle "What should I do next?" / Next Best Action
  let nextBestActionData = null
  if (
    qLower.includes('what should i do next') ||
    qLower.includes('next best action') ||
    qLower.includes('what to study next') ||
    qLower.includes('my readiness')
  ) {
    const xp = studentTelemetry.masterTotalXP || 0
    const progress = studentTelemetry.masterProgressPercent || 0
    nextBestActionData = {
      readinessScore: `${progress}% Platform Mastery (${xp} XP)`,
      recommendedAction: progress < 25
        ? 'Complete the IAM Security Foundation Labs (Lab: lab-iam-permission-boundaries) to solidify principle of least privilege.'
        : progress < 60
          ? 'Tackle Investigation Scenario INV-IAM-01 (Shadow Admin) to practice live CloudTrail triage and automated containment.'
          : 'Conduct an Enterprise Architecture Review in Multi-Tenant SaaS isolation and export an Audit Pack.',
      sourceTag: '[Source: SeCloudive Employability Engine Telemetry]'
    }
  }

  // 7. Format Grounded Text
  let groundedText = ''
  let citationTags = []

  if (matches.length > 0) {
    groundedText = matches.map(m => {
      citationTags.push(m.sourceTag)
      if (m.type === 'scenario') {
        return `${m.sourceTag}\nTitle: ${m.title}\nIncident Summary: ${m.summary}\nRemediation Guidance: ${m.remediation}`
      } else if (m.type === 'lab') {
        return `${m.sourceTag}\nTitle: ${m.title}\nObjective: ${m.objective}\nCost: ${m.cost || '$0.00'}\nSteps: ${m.steps?.join(' -> ')}`
      } else if (m.type === 'framework') {
        return `${m.sourceTag}\n${m.framework} ${m.section} - ${m.title}\nDetails: ${m.details}`
      } else if (m.type === 'architecture') {
        return `${m.sourceTag}\nTitle: ${m.title}\nDescription: ${m.description}\nKey Findings: ${m.findings?.join('; ')}`
      }
      return JSON.stringify(m)
    }).join('\n\n')
  }

  if (nextBestActionData) {
    citationTags.push(nextBestActionData.sourceTag)
    groundedText += `\n\n${nextBestActionData.sourceTag}\nStudent Readiness Score: ${nextBestActionData.readinessScore}\nNext Recommended Action: ${nextBestActionData.recommendedAction}`
  }

  // 8. Determine if there is a match or NO match
  const hasMatch = matches.length > 0 || nextBestActionData !== null

  let noMatchDirective = ''
  if (!hasMatch && (hasSpecificIdQuery || qLower.includes('cis') || qLower.includes('nist') || qLower.includes('lab') || qLower.includes('scenario'))) {
    noMatchDirective = `RETRIEVAL_STATUS: NO_MATCH.
The specific lab, scenario, or framework section queried was NOT found in the platform's content library.
MANDATORY GROUNDING INSTRUCTION: You must plainly state: "I don't have that specific material or exact citation in front of me in the SeCloudive content library, check the framework or lab catalog directly." Do NOT invent a plausible-sounding lab ID, incident detail, or section number.`
  }

  return {
    hasMatch,
    citationTags: Array.from(new Set(citationTags)),
    groundedText,
    noMatchDirective
  }
}
