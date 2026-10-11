// =========================================================================
// SeCloudive Sentinel & NAEN AI Unified RAG Retrieval & Grounding Engine
// Full Website Access • All 15 Workbooks • 100+ Case Studies • Real Internships
// Cheat Sheets • Cert Flashcards • Threat Hunts • Incident Playbooks • Labs
// =========================================================================

import { investigations } from '../data/investigations.js'
import { MASTER_INCIDENT_BANK } from '../data/expandedIncidentBank.js'
import { MASTER_SAFE_LABS } from '../data/expandedSafeLabs.js'
import { MASTER_ARCHITECTURE_REVIEWS } from '../data/expandedArchitectureBank.js'
import { UNIFIED_ATTACK_SCENARIOS } from '../data/simulatedAttackScenarios.js'
import { getAllTopics } from '../data/learning/index.js'
import { PACK_EDUCATIONAL_DETAILS } from '../utils/resourceGenerator.js'
import { MASTER_CASE_STUDIES } from '../data/caseStudiesBank.js'
import { AWS_SECURITY_CHEAT_SHEETS } from '../data/awsSecurityCheatSheets.js'
import { FLASHCARD_DECKS } from '../data/awsCertificationFlashcards.js'
import { MASTER_THREAT_HUNTS } from '../data/expandedThreatHunts.js'
import { jobPlaybooks } from '../data/jobPlaybooks.js'
import { LIVE_INTERNSHIPS_DATA } from '../data/liveInternshipsData.js'
import { CLOUD_PROVIDERS } from '../data/multiCloudResources.js'
import { INTERVIEW_ROLES } from '../data/interviewBank.js'

// ── 1. PLATFORM ROUTE & FEATURE DIRECTORY ──────────────────────────────────
export const PLATFORM_PAGE_DIRECTORY = [
  {
    path: '/',
    title: 'SeCloudive Home & Threat Ticker',
    description: 'Executive overview, live threat intelligence ticker, interactive sandbox previews, and terminal simulator.',
    category: 'Home & Portal'
  },
  {
    path: '/learn',
    title: 'Learning Center & Modular Curriculum',
    description: '60+ structured cloud security modules across Foundations, IAM, S3, Network, Monitoring, Incident Response, Architecture, and Career Paths with interactive quizzes.',
    category: 'Curriculum'
  },
  {
    path: '/labs',
    title: 'Real Labs ($0.00 Free Tier Guarantee)',
    description: 'Production-hardened, zero-cost sandbox labs with step-by-step commands and downloadable Terraform / CloudFormation IaC templates.',
    category: 'Hands-on Labs'
  },
  {
    path: '/investigations',
    title: 'Incident Investigation Simulator',
    description: 'Hands-on CloudTrail SIEM forensics, Amazon Athena queries, synthetic attack triage, and containment runbooks.',
    category: 'Forensics & SIEM'
  },
  {
    path: '/battle-rooms',
    title: 'Cloud Threat Battle Rooms',
    description: 'Live attack & defense arena (TryHackMe/HackTheBox style) featuring timed intrusion challenges, CTF flags, and MITRE ATT&CK mapping.',
    category: 'Attack & Defense'
  },
  {
    path: '/architecture',
    title: 'Architecture Reviews & Threat Modeling',
    description: 'Architectural threat modeling for Multi-Tenant SaaS, FinTech Core Banking, and Zero-Trust Landing Zones.',
    category: 'Cloud Architecture'
  },
  {
    path: '/downloads',
    title: 'Official Downloads & 15 Engineering Workbooks',
    description: 'Download all 15 accredited NAEN Studios PDF workbooks (Linux, Python Boto3, Docker, Kubernetes, GitOps, 3-Tier VPC, DevSecOps, Lakehouse, Bedrock GenAI), production IaC zips, and the Master Audit Tracker Dossier PDF.',
    category: 'Downloads & Workbooks'
  },
  {
    path: '/threat-intel',
    title: 'Live Threat Intelligence Portal',
    description: 'Real-time CISA KEV feeds, active CVE alerts, and cloud vulnerability advisories summarized by Gemini AI.',
    category: 'Threat Intel'
  },
  {
    path: '/internships',
    title: 'Live Cloud Security Internships Directory',
    description: 'Active recruiting programs at AWS, Google Mandiant, CrowdStrike, Microsoft, Cloudflare, Palo Alto Networks ($48-$70/hr) with direct application links.',
    category: 'Careers & Internships'
  },
  {
    path: '/internship-simulator',
    title: '8-Week Virtual Internship Simulator',
    description: 'Structured 8-week virtual security internship simulation with weekly deliverables, pull request reviews, and portfolio verification.',
    category: 'Internship Simulator'
  },
  {
    path: '/interviews',
    title: 'Cloud Security Interview Simulator',
    description: 'Interactive AI mock interview arena evaluating technical depth, behavioral answers (STAR method), and architectural trade-offs.',
    category: 'Interview Prep'
  },
  {
    path: '/projects',
    title: 'Production Cloud Projects Portfolio',
    description: 'Portfolio-grade cloud security projects with verified architectures, Terraform code, and GitHub presentation guidance.',
    category: 'Projects'
  },
  {
    path: '/studio',
    title: 'Cloudive Studio (Architecture Canvas)',
    description: 'Visual cloud diagramming and threat analysis tool to model cloud architectures and run automated security audits.',
    category: 'Tools & Design'
  },
  {
    path: '/ramp-up',
    title: 'Career Ramp-Up Directory',
    description: 'Structured career transition roadmaps: SysAdmin to Cloud Security, Helpdesk to SOC Analyst, Software Engineer to DevSecOps.',
    category: 'Career Transitions'
  },
  {
    path: '/playbooks',
    title: 'Enterprise Job Playbooks & Runbooks',
    description: 'P0/P1 incident response Standard Operating Procedures (SOPs), automated containment scripts, and forensic checklists.',
    category: 'Job Playbooks'
  },
  {
    path: '/roadmap',
    title: 'Platform Exploration Roadmap',
    description: 'Interactive curriculum decision tree and learning path recommendation engine.',
    category: 'Roadmap'
  },
  {
    path: '/dashboard',
    title: 'Student Dashboard & Progress Tracker',
    description: 'Track your XP, tier progression, completed labs, badges, notes scratchpad, and study streak.',
    category: 'Student Hub'
  },
  {
    path: '/admin',
    title: 'Admin Dashboard & Telemetry',
    description: 'Executive administration, student metrics, decline logs, screenshot security alerts, and system audit logs.',
    category: 'Admin'
  },
  {
    path: '/verify',
    title: 'Cryptographic Audit Pack Verification',
    description: 'Verify authenticity of student certificates and exported audit packs using SHA-256 signatures.',
    category: 'Verification'
  }
]

// ── 2. EMBEDDED AUTHORITATIVE FRAMEWORK CITATIONS ─────────────────────────
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
 * Searches the SeCloudive platform knowledge base for grounded context
 */
export function retrievePlatformContext({ query, route = '', activeScenarioId = null, studentTelemetry = {} }) {
  const qLower = (query || '').toLowerCase().trim()
  const matches = []

  // Extract any specific scenario / lab ID
  const idPattern = /\b(inv-[a-z0-9-]+|ir-[0-9]+|aws-ir-[0-9]+|lab-[a-z0-9-]+|safe-[a-z0-9-]+|arch-[a-z0-9-]+|cs-[0-9]+|hunt-[0-9]+|pb-[a-z0-9-]+|scs-[0-9]+)\b/i
  const extractedId = qLower.match(idPattern)?.[0]?.toLowerCase() || (activeScenarioId ? activeScenarioId.toLowerCase() : null)

  // ── 1. PLATFORM NAVIGATION / WEBSITE PAGES ───────────────────────────────
  if (
    qLower.includes('where') ||
    qLower.includes('how to find') ||
    qLower.includes('navigate') ||
    qLower.includes('page') ||
    qLower.includes('route') ||
    qLower.includes('url') ||
    qLower.includes('portal') ||
    qLower.includes('tool') ||
    qLower.includes('download') ||
    qLower.includes('internship') ||
    qLower.includes('studio') ||
    qLower.includes('battle') ||
    qLower.includes('playbook') ||
    qLower.includes('roadmap') ||
    qLower.includes('interview')
  ) {
    for (const page of PLATFORM_PAGE_DIRECTORY) {
      if (
        qLower.includes(page.path.toLowerCase()) ||
        qLower.includes(page.title.toLowerCase()) ||
        cleanTerms(page.title).some(t => qLower.includes(t) && t.length > 4) ||
        cleanTerms(page.description).some(d => qLower.includes(d) && d.length > 5)
      ) {
        matches.push({
          type: 'navigation',
          title: page.title,
          path: page.path,
          category: page.category,
          description: page.description,
          sourceTag: `[Source: SeCloudive Platform Route: ${page.path}]`
        })
        if (matches.length >= 3) break
      }
    }
  }

  // ── 2. OFFICIAL NAEN STUDIOS 15 WORKBOOKS & RESOURCE PACKS ───────────────
  if (
    qLower.includes('workbook') ||
    qLower.includes('pack') ||
    qLower.includes('pdf') ||
    qLower.includes('download') ||
    qLower.includes('linux') ||
    qLower.includes('python') ||
    qLower.includes('boto3') ||
    qLower.includes('docker') ||
    qLower.includes('kubernetes') ||
    qLower.includes('eks') ||
    qLower.includes('git') ||
    qLower.includes('gitops') ||
    qLower.includes('associate') ||
    qLower.includes('devsecops') ||
    qLower.includes('lakehouse') ||
    qLower.includes('bedrock') ||
    qLower.includes('genai') ||
    qLower.includes('bundle') ||
    qLower.includes('dossier')
  ) {
    if (PACK_EDUCATIONAL_DETAILS && typeof PACK_EDUCATIONAL_DETAILS === 'object') {
      for (const [packKey, pack] of Object.entries(PACK_EDUCATIONAL_DETAILS)) {
        const titleLower = (pack.title || '').toLowerCase()
        const roleLower = (pack.targetRole || '').toLowerCase()
        const overviewLower = (pack.overview || '').toLowerCase()

        if (
          (extractedId && extractedId.includes(packKey.toLowerCase())) ||
          titleLower.includes(qLower) ||
          qLower.includes(packKey.toLowerCase()) ||
          cleanTerms(titleLower).some(t => qLower.includes(t) && t.length > 4)
        ) {
          const sampleLabs = (pack.labs || []).slice(0, 2).map(l => `${l.labTitle}: ${l.objective}`)
          matches.push({
            type: 'workbook',
            title: pack.title,
            targetRole: pack.targetRole,
            certPath: pack.certPath,
            overview: (pack.overview || '').slice(0, 280),
            sampleLabs,
            sourceTag: `[Source: Official NAEN Workbook: "${pack.title}"]`
          })
          if (matches.length >= 4) break
        }
      }
    }

    if (qLower.includes('dossier') || qLower.includes('tracker') || qLower.includes('master pdf') || qLower.includes('audit pack')) {
      matches.push({
        type: 'dossier',
        title: 'SeCloudive Master Architectural & Audit Tracker Dossier (PDF)',
        description: 'Official 3-page vector A4 dossier covering all 10 platform architecture pillars, verified controls, and completion checklist. Downloadable via /downloads and /admin.',
        sourceTag: '[Source: SECLOUDIVE_MASTER_TRACKER_DOSSIER.pdf (NAEN Studios 2026)]'
      })
    }
  }

  // ── 3. REAL-WORLD CASE STUDIES BANK (100+ Studies) ────────────────────────
  if (
    qLower.includes('case study') ||
    qLower.includes('breach') ||
    qLower.includes('capital one') ||
    qLower.includes('uber') ||
    qLower.includes('tesla') ||
    qLower.includes('circleci') ||
    qLower.includes('code spaces') ||
    qLower.includes('incident analysis') ||
    (extractedId && extractedId.startsWith('cs-'))
  ) {
    if (Array.isArray(MASTER_CASE_STUDIES)) {
      for (const cs of MASTER_CASE_STUDIES) {
        const csId = (cs.id || '').toLowerCase()
        const csTitle = (cs.title || '').toLowerCase()
        const csDesc = (cs.whatHappened || cs.rootCause || '').toLowerCase()

        if (
          (extractedId && csId === extractedId) ||
          csTitle.includes(qLower) ||
          cleanTerms(csTitle).some(t => qLower.includes(t) && t.length > 4) ||
          (qLower.includes('capital one') && csTitle.includes('capital one')) ||
          (qLower.includes('uber') && csTitle.includes('uber')) ||
          (qLower.includes('tesla') && csTitle.includes('tesla'))
        ) {
          matches.push({
            type: 'case_study',
            id: cs.id,
            title: cs.title,
            industry: cs.industry,
            whatHappened: cs.whatHappened,
            rootCause: cs.rootCause,
            remediation: cs.remediation,
            prevention: cs.prevention,
            sourceTag: `[Source: Enterprise Case Study: ${cs.title} (${cs.id})]`
          })
          if (matches.length >= 3) break
        }
      }
    }
  }

  // ── 4. AWS SECURITY CHEAT SHEETS & CONDITIONS ────────────────────────────
  if (
    qLower.includes('cheat sheet') ||
    qLower.includes('condition') ||
    qLower.includes('principalarn') ||
    qLower.includes('principalorgid') ||
    qLower.includes('sourceip') ||
    qLower.includes('sourcevpc') ||
    qLower.includes('securetransport') ||
    qLower.includes('iam condition') ||
    qLower.includes('kms key policy')
  ) {
    if (Array.isArray(AWS_SECURITY_CHEAT_SHEETS)) {
      for (const cs of AWS_SECURITY_CHEAT_SHEETS) {
        const csTitle = (cs.title || '').toLowerCase()
        if (csTitle.includes(qLower) || cleanTerms(csTitle).some(t => qLower.includes(t) && t.length > 4)) {
          const sampleSections = (cs.sections || []).slice(0, 2).map(s => {
            const items = (s.items || []).slice(0, 3).map(i => `${i.key} (${i.operator}): ${i.purpose}`)
            return `${s.heading}\n${items.join('\n')}`
          })
          matches.push({
            type: 'cheat_sheet',
            title: cs.title,
            details: sampleSections.join('\n\n'),
            sourceTag: `[Source: AWS Security Cheat Sheet: "${cs.title}"]`
          })
          if (matches.length >= 2) break
        }
      }
    }
  }

  // ── 5. AWS CERTIFICATION FLASHCARDS (SCS-C02 & SAA-C03) ──────────────────
  if (
    qLower.includes('certification') ||
    qLower.includes('scs-c02') ||
    qLower.includes('saa-c03') ||
    qLower.includes('security specialty') ||
    qLower.includes('flashcard') ||
    qLower.includes('exam') ||
    (extractedId && extractedId.startsWith('scs-'))
  ) {
    if (Array.isArray(FLASHCARD_DECKS)) {
      for (const deck of FLASHCARD_DECKS) {
        for (const card of (deck.cards || [])) {
          const cardId = (card.id || '').toLowerCase()
          const qText = (card.question || '').toLowerCase()
          if (
            (extractedId && cardId === extractedId) ||
            cleanTerms(qText).some(t => qLower.includes(t) && t.length > 4) ||
            (qLower.includes('order') && qText.includes('evaluation order')) ||
            (qLower.includes('difference') && qText.includes('customer managed key'))
          ) {
            matches.push({
              type: 'flashcard',
              id: card.id,
              category: card.category,
              question: card.question,
              answer: card.answer,
              examTip: card.examTip,
              sourceTag: `[Source: AWS Cert Flashcard (${deck.code} • ${card.id})]`
            })
            if (matches.length >= 3) break
          }
        }
      }
    }
  }

  // ── 6. THREAT HUNTING MISSIONS & PLAYBOOKS ────────────────────────────────
  if (
    qLower.includes('threat hunt') ||
    qLower.includes('hunting') ||
    qLower.includes('hypothesis') ||
    qLower.includes('athena query') ||
    qLower.includes('dormant') ||
    qLower.includes('shadow admin') ||
    (extractedId && extractedId.startsWith('hunt-'))
  ) {
    if (Array.isArray(MASTER_THREAT_HUNTS)) {
      for (const hunt of MASTER_THREAT_HUNTS) {
        const hId = (hunt.id || '').toLowerCase()
        const hTitle = (hunt.title || '').toLowerCase()
        if (
          (extractedId && hId === extractedId) ||
          cleanTerms(hTitle).some(t => qLower.includes(t) && t.length > 4)
        ) {
          matches.push({
            type: 'threat_hunt',
            id: hunt.id,
            title: hunt.title,
            hypothesis: hunt.hypothesis,
            mitre: hunt.mitreTechnique,
            huntQuery: hunt.huntQuery,
            remediation: hunt.remediation,
            sourceTag: `[Source: Threat Hunt Mission ${hunt.id}] [SIMULATED - not a real AWS event]`
          })
          if (matches.length >= 2) break
        }
      }
    }
  }

  // ── 7. JOB PLAYBOOKS & INCIDENT RESPONSE SOPs ─────────────────────────────
  if (
    qLower.includes('playbook') ||
    qLower.includes('runbook') ||
    qLower.includes('sop') ||
    qLower.includes('p0 incident') ||
    qLower.includes('containment') ||
    (extractedId && extractedId.startsWith('pb-'))
  ) {
    if (Array.isArray(jobPlaybooks)) {
      for (const pb of jobPlaybooks) {
        const pId = (pb.id || '').toLowerCase()
        const pTitle = (pb.title || '').toLowerCase()
        if ((extractedId && pId === extractedId) || cleanTerms(pTitle).some(t => qLower.includes(t) && t.length > 4)) {
          matches.push({
            type: 'job_playbook',
            id: pb.id,
            ticket: pb.ticketId,
            title: pb.title,
            severity: pb.severity,
            slaMinutes: pb.slaMinutes,
            businessImpact: pb.businessImpact,
            sourceTag: `[Source: Job Playbook: "${pb.title}"]`
          })
          if (matches.length >= 2) break
        }
      }
    }
  }

  // ── 8. LIVE CLOUD SECURITY INTERNSHIPS ────────────────────────────────────
  if (
    qLower.includes('internship') ||
    qLower.includes('intern') ||
    qLower.includes('stipend') ||
    qLower.includes('mandiant') ||
    qLower.includes('crowdstrike') ||
    qLower.includes('hiring') ||
    qLower.includes('career opportunity')
  ) {
    if (Array.isArray(LIVE_INTERNSHIPS_DATA)) {
      for (const intern of LIVE_INTERNSHIPS_DATA) {
        const companyLower = (intern.company || '').toLowerCase()
        const roleLower = (intern.role || '').toLowerCase()
        if (
          companyLower.includes(qLower) ||
          cleanTerms(companyLower).some(c => qLower.includes(c)) ||
          cleanTerms(roleLower).some(r => qLower.includes(r) && r.length > 4)
        ) {
          matches.push({
            type: 'internship',
            company: intern.company,
            role: intern.role,
            stipend: intern.stipend,
            location: intern.location,
            skills: (intern.skills || []).join(', '),
            applyUrl: intern.applyUrl,
            sourceTag: `[Source: Live Internship: ${intern.company} — ${intern.role}]`
          })
          if (matches.length >= 2) break
        }
      }
    }
  }

  // ── 9. INTERVIEW ROLES & MOCK INTERVIEW QUESTIONS ────────────────────────
  if (
    qLower.includes('interview') ||
    qLower.includes('star method') ||
    qLower.includes('question') ||
    qLower.includes('rubric') ||
    qLower.includes('behavioral')
  ) {
    if (Array.isArray(INTERVIEW_ROLES)) {
      for (const ir of INTERVIEW_ROLES) {
        const titleLower = (ir.title || '').toLowerCase()
        if (titleLower.includes(qLower) || cleanTerms(titleLower).some(t => qLower.includes(t) && t.length > 4)) {
          const sampleQ = ir.questions?.beginner?.[0] || ir.questions?.intermediate?.[0]
          matches.push({
            type: 'interview_role',
            title: ir.title,
            salaryRange: ir.salaryRange,
            mustKnowSkills: (ir.mustKnowSkills || []).join(', '),
            sampleQuestion: sampleQ ? `${sampleQ.question} (Hint: ${sampleQ.sampleAnswerHint})` : '',
            sourceTag: `[Source: Interview Role Bank: "${ir.title}"]`
          })
          if (matches.length >= 2) break
        }
      }
    }
  }

  // ── 10. MULTI-CLOUD ARCHITECTURE MAPPINGS ────────────────────────────────
  if (
    qLower.includes('multi-cloud') ||
    qLower.includes('azure') ||
    qLower.includes('gcp') ||
    qLower.includes('google cloud') ||
    qLower.includes('oci') ||
    qLower.includes('cloud provider')
  ) {
    if (Array.isArray(CLOUD_PROVIDERS)) {
      for (const cp of CLOUD_PROVIDERS) {
        if (qLower.includes(cp.id) || (cp.name && qLower.includes(cp.name.toLowerCase()))) {
          matches.push({
            type: 'cloud_provider',
            name: cp.name,
            cliName: cp.cliName,
            framework: cp.wafName,
            certification: cp.certKey,
            sourceTag: `[Source: Multi-Cloud Matrix: "${cp.name}"]`
          })
          if (matches.length >= 2) break
        }
      }
    }
  }

  // ── 11. INVESTIGATIONS & INCIDENT SIMULATOR ──────────────────────────────
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

  // ── 12. SAFE FREE TIER LABS ──────────────────────────────────────────────
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

  // ── 13. ARCHITECTURE REVIEWS ─────────────────────────────────────────────
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

  // ── 14. CURRICULUM TOPICS ────────────────────────────────────────────────
  try {
    const allTopics = getAllTopics() || []
    for (const topic of allTopics) {
      const topicId = (topic.id || '').toLowerCase()
      const topicTitle = (topic.title || '').toLowerCase()
      if (
        (qLower.length > 3 && (topicTitle.includes(qLower) || qLower.includes(topicTitle) || topicId.includes(qLower))) ||
        (cleanTerms(topicTitle).some(t => qLower.includes(t) && t.length > 4))
      ) {
        matches.push({
          type: 'course_topic',
          title: topic.title,
          description: topic.description || topic.summary || '',
          keyTakeaways: topic.keyTakeaways || topic.bullets || [],
          sourceTag: `[Source: SeCloudive Curriculum: "${topic.title}"]`
        })
        if (matches.length >= 3) break
      }
    }
  } catch (err) {
    console.warn('Curriculum retrieval fallback:', err)
  }

  // ── 15. FRAMEWORK CITATIONS ──────────────────────────────────────────────
  for (const cite of FRAMEWORK_CITATIONS) {
    const secLower = cite.section.toLowerCase()
    const frameLower = cite.framework.toLowerCase()
    const titleLower = cite.title.toLowerCase()

    if (
      qLower.includes(secLower) ||
      (qLower.includes('cis') && (secLower.includes('1.') || secLower.includes('2.') || secLower.includes('3.'))) ||
      (qLower.includes('nist') && (secLower.includes('ac-') || secLower.includes('au-') || secLower.includes('sc-'))) ||
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

  // ── 16. NEXT BEST ACTION & TELEMETRY GUIDANCE ─────────────────────────────
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
        ? 'Complete the Linux Shell Scripting Workbook & IAM Security Foundation Labs (/labs) to solidify the principle of least privilege.'
        : progress < 60
          ? 'Tackle Incident Investigation Scenario INV-IAM-01 (Shadow Admin) (/investigations) to practice live CloudTrail triage and automated containment.'
          : 'Conduct an Enterprise Architecture Review in Multi-Tenant SaaS isolation (/architecture) and export an accredited Audit Pack.',
      sourceTag: '[Source: SeCloudive Employability Engine Telemetry]'
    }
  }

  // ── 17. FORMAT GROUNDED TEXT ─────────────────────────────────────────────
  let groundedText = ''
  let citationTags = []

  if (matches.length > 0) {
    groundedText = matches.map(m => {
      citationTags.push(m.sourceTag)
      if (m.type === 'navigation') {
        return `${m.sourceTag}\nPage: ${m.title} (${m.path})\nCategory: ${m.category}\nCapabilities: ${m.description}`
      } else if (m.type === 'workbook') {
        return `${m.sourceTag}\nTitle: ${m.title}\nTarget Role: ${m.targetRole}\nCert Alignment: ${m.certPath}\nOverview: ${m.overview}\nSample Labs: ${(m.sampleLabs || []).join(' | ')}`
      } else if (m.type === 'dossier') {
        return `${m.sourceTag}\nTitle: ${m.title}\nDetails: ${m.description}`
      } else if (m.type === 'case_study') {
        return `${m.sourceTag}\nTitle: ${m.title} (Industry: ${m.industry})\nIncident: ${m.whatHappened}\nRoot Cause: ${m.rootCause}\nRemediation: ${m.remediation}\nPrevention: ${m.prevention}`
      } else if (m.type === 'cheat_sheet') {
        return `${m.sourceTag}\nTitle: ${m.title}\nKey Conditions & Controls:\n${m.details}`
      } else if (m.type === 'flashcard') {
        return `${m.sourceTag}\nCategory: ${m.category}\nQuestion: ${m.question}\nAnswer: ${m.answer}\nExam Tip: ${m.examTip}`
      } else if (m.type === 'threat_hunt') {
        return `${m.sourceTag}\nTitle: ${m.title}\nHypothesis: ${m.hypothesis}\nMITRE: ${m.mitre}\nAthena Query:\n${m.huntQuery}\nRemediation: ${m.remediation}`
      } else if (m.type === 'job_playbook') {
        return `${m.sourceTag}\nTicket: ${m.ticket} - ${m.title}\nSeverity: ${m.severity} (SLA: ${m.slaMinutes}m)\nImpact: ${m.businessImpact}`
      } else if (m.type === 'internship') {
        return `${m.sourceTag}\nCompany: ${m.company} - ${m.role}\nCompensation: ${m.stipend} (${m.location})\nRequired Skills: ${m.skills}\nApplication Link: ${m.applyUrl}`
      } else if (m.type === 'interview_role') {
        return `${m.sourceTag}\nRole: ${m.title} (Salary Benchmark: ${m.salaryRange})\nRequired Skills: ${m.mustKnowSkills}\nCore Interview Drill: ${m.sampleQuestion}`
      } else if (m.type === 'cloud_provider') {
        return `${m.sourceTag}\nProvider: ${m.name} (CLI: ${m.cliName})\nSecurity Framework: ${m.framework}\nFlagship Cert: ${m.certification}`
      } else if (m.type === 'scenario') {
        return `${m.sourceTag}\nTitle: ${m.title}\nIncident Summary: ${m.summary}\nRemediation Guidance: ${m.remediation}`
      } else if (m.type === 'lab') {
        return `${m.sourceTag}\nTitle: ${m.title}\nObjective: ${m.objective}\nCost: ${m.cost || '$0.00'}\nSteps: ${m.steps?.join(' -> ')}`
      } else if (m.type === 'course_topic') {
        return `${m.sourceTag}\nTopic: ${m.title}\nDescription: ${m.description}\nTakeaways: ${(m.keyTakeaways || []).join('; ')}`
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

  const hasMatch = matches.length > 0 || nextBestActionData !== null

  // Empower Gemini with full cloud security technical knowledge
  const generalKnowledgeDirective = `[AUTHORITATIVE CLOUD SECURITY KNOWLEDGE GUIDELINE]:
You are NAEN AI, an elite cloud security copilot and mentor. Answer with high technical authority, including relevant CLI commands, AWS/Azure/GCP service explanations, architecture diagrams or JSON/YAML/Bash snippets where helpful, and tie your explanation back to SeCloudive's learning modules, workbooks (/downloads), and free tier labs (/labs).`

  return {
    hasMatch,
    citationTags: Array.from(new Set(citationTags)),
    groundedText,
    noMatchDirective: generalKnowledgeDirective
  }
}
