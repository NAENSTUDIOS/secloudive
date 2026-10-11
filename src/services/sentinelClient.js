// =========================================================================
// SeCloudive Sentinel AI Client & Safety Gateway
// Real Gemini Calls, Multi-Key Rotation, Rate Limiting, Mentor Hand-Off & Safety Audits
// =========================================================================

import {
  ASSISTANT_NAME,
  SENTINEL_SYSTEM_PROMPT,
  DISCLOSURE_GEMINI,
  DISCLOSURE_NO_GUARANTEE,
  ATTACHED_TELEMETRY_DISCLOSURE,
  ERROR_MESSAGES,
  REAL_INCIDENT_REDIRECT_TEXT
} from '../config/sentinelConfig.js'
import { retrievePlatformContext } from './sentinelRetrievalEngine.js'
import { evaluateLearnerSubmission } from './geminiMentorQualityEngine.js'

// In-memory safety decline and usage logs (persisted to localStorage if available)
const DECLINE_LOGS_KEY = 'secloudive_sentinel_decline_logs_v1'
const USAGE_STATS_KEY = 'secloudive_sentinel_usage_stats_v1'
const FEEDBACK_LOGS_KEY = 'secloudive_sentinel_feedback_logs_v1'

/**
 * Extracts and discovers all valid Gemini keys across edge contexts, Vite env, and Node.js
 */
export function getRuntimeGeminiKeys(requestContext = null) {
  const discovered = []

  // 1. Discrete validated keys (prioritizes high-speed keys)
  const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {}
  const discreteKeys = [
    metaEnv.VITE_GEMINI_KEY_6,
    metaEnv.VITE_GEMINI_API_KEY,
    metaEnv.VITE_GEMINI_KEY_2,
    metaEnv.VITE_GEMINI_KEY_4,
    metaEnv.VITE_GEMINI_KEY_5,
    metaEnv.VITE_GEMINI_KEY_1,
    metaEnv.VITE_GEMINI_KEY_3
  ]
  discreteKeys.forEach((k, idx) => {
    if (typeof k === 'string' && k.trim().length > 20) {
      const trimmed = k.trim()
      if (!discovered.some(d => d.key === trimmed)) {
        discovered.push({ key: trimmed, source: `Slot ${idx + 1}` })
      }
    }
  })

  // 2. Edge Request Context (e.g. Cloudflare Pages context.env)
  if (requestContext && requestContext.env) {
    const rawKeys = requestContext.env.GEMINI_API_KEYS || requestContext.env.VITE_GEMINI_API_KEYS
    if (typeof rawKeys === 'string') {
      rawKeys.split(',').forEach(k => {
        if (k.trim().length > 20 && !discovered.some(d => d.key === k.trim())) {
          discovered.push({ key: k.trim(), source: 'Edge Request Context' })
        }
      })
    }
  }

  // 3. Vite Environment Pool
  if (metaEnv.GEMINI_API_KEYS || metaEnv.VITE_GEMINI_API_KEYS) {
    const raw = metaEnv.GEMINI_API_KEYS || metaEnv.VITE_GEMINI_API_KEYS
    if (typeof raw === 'string') {
      raw.split(',').forEach(k => {
        if (k.trim().length > 20 && !discovered.some(d => d.key === k.trim())) {
          discovered.push({ key: k.trim(), source: 'Vite Pool (.env)' })
        }
      })
    }
  }

  // 3. Node.js process.env (Server/test runtime)
  if (typeof process !== 'undefined' && process.env) {
    const nodeSlots = [
      process.env.VITE_GEMINI_KEY_6,
      process.env.VITE_GEMINI_API_KEY,
      process.env.VITE_GEMINI_KEY_2,
      process.env.VITE_GEMINI_KEY_4,
      process.env.VITE_GEMINI_KEY_5,
      process.env.VITE_GEMINI_KEY_1,
      process.env.VITE_GEMINI_KEY_3
    ]
    nodeSlots.forEach((k, idx) => {
      if (typeof k === 'string' && k.trim().length > 20 && !discovered.some(d => d.key === k.trim())) {
        discovered.push({ key: k.trim(), source: `Process Slot ${idx + 1}` })
      }
    })
    const pRaw = process.env.GEMINI_API_KEYS || process.env.VITE_GEMINI_API_KEYS
    if (typeof pRaw === 'string') {
      pRaw.split(',').forEach(k => {
        if (k.trim().length > 20 && !discovered.some(d => d.key === k.trim())) {
          discovered.push({ key: k.trim(), source: 'Process Env' })
        }
      })
    }
  }

  // 4. Local User Custom Key
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const custom = window.localStorage.getItem('secloudive_user_gemini_key')
      if (custom && custom.trim().length > 20) {
        discovered.unshift({ key: custom.trim(), source: 'Custom User Key' })
      }
    }
  } catch (e) { /* ignore */ }

  return discovered
}

class SentinelManager {
  constructor() {
    this.keyCooldowns = new Map() // key -> timestamp
    this.keyUsage = new Map()     // key -> count
    this.rotationIdx = 0
    this.userRateLimitWindow = [] // array of timestamps for current user
  }

  /**
   * Check per-user rate limit (15 requests per 60 seconds)
   */
  checkRateLimit() {
    const now = Date.now()
    this.userRateLimitWindow = this.userRateLimitWindow.filter(t => now - t < 60000)
    if (this.userRateLimitWindow.length >= 15) {
      const oldest = this.userRateLimitWindow[0]
      const cooldownRemaining = Math.max(1, Math.ceil((60000 - (now - oldest)) / 1000))
      return { limited: true, cooldownRemaining }
    }
    this.userRateLimitWindow.push(now)
    return { limited: false }
  }

  /**
   * Records safety decline events
   */
  logSafetyDecline(category, messageText) {
    const entry = {
      id: `dec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      category,
      snippet: (messageText || '').slice(0, 100)
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const existing = JSON.parse(window.localStorage.getItem(DECLINE_LOGS_KEY) || '[]')
        existing.unshift(entry)
        window.localStorage.setItem(DECLINE_LOGS_KEY, JSON.stringify(existing.slice(0, 100)))
      }
    } catch (e) { /* ignore storage error */ }

    console.warn(`[Sentinel Safety Guardrail] Triggered: ${category} | Timestamp: ${entry.timestamp}`)
    return entry
  }

  /**
   * Records usage statistics
   */
  recordUsage(keyUsed, modelUsed, estimatedTokens = 150) {
    const today = new Date().toISOString().slice(0, 10)
    const keyPreview = `${keyUsed.slice(0, 6)}...${keyUsed.slice(-4)}`

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stats = JSON.parse(window.localStorage.getItem(USAGE_STATS_KEY) || '{}')
        if (!stats[today]) stats[today] = { totalCalls: 0, estimatedTokens: 0, byKey: {} }
        stats[today].totalCalls += 1
        stats[today].estimatedTokens += estimatedTokens
        stats[today].byKey[keyPreview] = (stats[today].byKey[keyPreview] || 0) + 1
        window.localStorage.setItem(USAGE_STATS_KEY, JSON.stringify(stats))
      }
    } catch (e) { /* ignore */ }
  }

  /**
   * Retrieves decline logs for admin telemetry
   */
  getDeclineLogs() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return JSON.parse(window.localStorage.getItem(DECLINE_LOGS_KEY) || '[]')
      }
    } catch (e) { return [] }
    return []
  }

  /**
   * Retrieves daily and per-key usage telemetry
   */
  getUsageStats() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return JSON.parse(window.localStorage.getItem(USAGE_STATS_KEY) || '{}')
      }
    } catch (e) { return {} }
    return {}
  }

  /**
   * Records user response feedback (thumbs up/down)
   */
  recordFeedback(messageId, isHelpful, comment = '') {
    const feedbackItem = {
      id: `fb-${Date.now()}`,
      messageId,
      isHelpful,
      comment: (comment || '').trim().slice(0, 200),
      timestamp: new Date().toISOString()
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const existing = JSON.parse(window.localStorage.getItem(FEEDBACK_LOGS_KEY) || '[]')
        existing.unshift(feedbackItem)
        window.localStorage.setItem(FEEDBACK_LOGS_KEY, JSON.stringify(existing.slice(0, 100)))
      }
    } catch (e) { /* ignore */ }
    return feedbackItem
  }

  /**
   * Executes a full conversational turn with Sentinel
   */
  async sendMessage({
    message,
    route = '/',
    activeScenarioId = null,
    studentTelemetry = {},
    chatHistory = [],
    context = null,
    forcedFailure = false // For testing error states
  }) {
    const text = (message || '').trim()
    if (!text) return { status: 'EMPTY' }

    // ── 1. CHECK RATE LIMIT ─────────────────────────────────────────────────
    const rlCheck = this.checkRateLimit()
    if (rlCheck.limited) {
      return {
        status: 'RATE_LIMITED',
        reply: `${ERROR_MESSAGES.RATE_LIMITED} (Cooldown: ${rlCheck.cooldownRemaining}s)`,
        cooldownSeconds: rlCheck.cooldownRemaining,
        category: 'rate-limit'
      }
    }

    // ── 2. FORCED FAILURE TEST HOOK ─────────────────────────────────────────
    if (forcedFailure) {
      console.error('[Sentinel Error Logging] Forced model call failure simulated.')
      return {
        status: 'OUTAGE',
        reply: ERROR_MESSAGES.OUTAGE,
        error: 'Forced model call failure'
      }
    }

    const tLower = text.toLowerCase()

    // ── 3. SAFETY RULE: REAL INCIDENT REDIRECT ───────────────────────────────
    const realIncidentPatterns = [
      /\b(my real|our real|actual)\s+aws\s+account\b/i,
      /\b(we are|we're|my account is|i think my account got)\s+(breached|compromised|hacked)\s+(right now|currently|today)\b/i,
      /\b(live intrusion|active breach|active incident)\s+in\s+production\b/i,
      /\breal aws account got breached\b/i
    ]
    if (realIncidentPatterns.some(p => p.test(tLower))) {
      this.logSafetyDecline('real-incident-redirected', text)
      return {
        status: 'REDIRECT_INCIDENT',
        reply: REAL_INCIDENT_REDIRECT_TEXT,
        category: 'real-incident-redirected',
        sourceTag: `[${ASSISTANT_NAME} Emergency Guardrail]`
      }
    }

    // ── 4. SAFETY RULE: OPERATIONAL ATTACK EXPLOIT DECLINE ───────────────────
    const operationalExploitPatterns = [
      /\b(write|generate|give me|create)\s+(an?\s+)?(exploit|attack script|reverse shell|payload|backdoor|malware)\b/i,
      /\bscan the (public internet|real internet|wild)\b/i,
      /\bcrack (real|actual|live)\s+(aws|iam|keys|passwords|accounts)\b/i,
      /\bhow to hack (a real|someone's|into an?)\s+(aws|company|account|server)\b/i
    ]
    if (operationalExploitPatterns.some(p => p.test(tLower))) {
      this.logSafetyDecline('real-attack-request-declined', text)
      const declineResponse = `I cannot produce operational exploit code, attack scripts, or step-by-step instructions usable against real, non-simulated infrastructure, regardless of framing.

Under SeCloudive's security scope, I can explain the mechanics of this attack technique conceptually or help you investigate and contain the equivalent synthetic scenario in our **Investigation Simulator** or **Threat Battle Rooms** ([SIMULATED - not a real AWS event]).

Would you like to examine how detection engineering and CloudTrail/GuardDuty telemetry capture this attack in a simulated environment?`
      return {
        status: 'DECLINE_ATTACK',
        reply: declineResponse,
        category: 'real-attack-request-declined',
        sourceTag: `[${ASSISTANT_NAME} Security Boundary Guardrail]`
      }
    }

    // ── 5. SAFETY RULE: SALARY / HIRE-BY PROMISE DECLINE ─────────────────────
    const outcomePromisePatterns = [
      /\b(guarantee|promise)\s+(me\s+)?(a|that i will get|a salary|a job|\$\d+)/i,
      /\bhow much money (will|am i guaranteed to) make\b/i,
      /\bwill i get hired in \d+ days\b/i,
      /\bpromise me a\b/i
    ]
    if (outcomePromisePatterns.some(p => p.test(tLower))) {
      this.logSafetyDecline('outcome-promise-redirected', text)
      const readinessXP = studentTelemetry.masterTotalXP || 0
      const masteryPct = studentTelemetry.masterProgressPercent || 0
      const declineOutcomeResponse = `I cannot promise or guarantee a specific salary, employment offer, or hiring timeline. Real career outcomes depend on your market, location, prior experience, and personal effort.

What I can provide is your actual SeCloudive readiness data:
• **Current Platform Readiness**: **${masteryPct}% Platform Mastery** (${readinessXP} XP earned)
• **Completed Activities**: ${studentTelemetry.completedMasterActivities || 0} hands-on labs & investigations
• **Recommended Next Step**: Continue completing scenario audit packs and threat battle rooms to build verifiable portfolio proof.

Would you like to see the competencies required to elevate your readiness score to the next tier?`
      return {
        status: 'DECLINE_OUTCOME_PROMISE',
        reply: declineOutcomeResponse,
        category: 'outcome-promise-redirected',
        sourceTag: `[${ASSISTANT_NAME} Career Honesty Guardrail]`
      }
    }

    // ── 6. HAND-OFF: GEMINI MULTI-PERSONA MENTOR ENGINE ─────────────────────
    const mentorGradingPatterns = [
      /\b(grade|evaluate|score)\s+(my\s+)?(work|submission|answer|plan|response|remediation)\b/i,
      /\b(review|critique)\s+my\s+(remediation plan|architecture|answer)\b/i,
      /\bmentor\s+(evaluation|review|grade)\b/i
    ]
    if (mentorGradingPatterns.some(p => p.test(tLower))) {
      // Evaluate submission through the existing Gemini Multi-Persona Mentor Engine
      const evaluation = evaluateLearnerSubmission({
        personaKey: 'SECURITY_MENTOR',
        userResponse: text,
        expectedCriteria: ['containment', 'cloudtrail', 'least privilege', 'permission boundary'],
        context: { route, activeScenarioId }
      })

      const mentorReply = `🎓 **Hand-off to SeCloudive Multi-Persona Mentor Engine**

I have routed your response directly to the **${evaluation.persona}** for formal evaluation (I do not generate competing scores):

• **Evaluation Score**: **${evaluation.confidenceScore} / 100** (${evaluation.overallVerdict})
• **Summary**: ${evaluation.summary}

**Identified Strengths**:
${evaluation.strengths.map(s => `• ${s}`).join('\n')}

**Missing Skills & Nuances**:
${evaluation.missingSkills.map(m => `• ${m}`).join('\n')}

**Step-by-Step Improvement Plan**:
${evaluation.improvementPlan.map(p => `• ${p}`).join('\n')}

**Next Best Action**: ${evaluation.nextBestAction}
*(To review other perspectives, open the full Mentor modal with Hiring Manager or Architecture Reviewer personas).*`

      return {
        status: 'MENTOR_EVALUATION',
        reply: mentorReply,
        sourceTag: `[Source: Gemini Multi-Persona Mentor Engine (${evaluation.persona})]`,
        evaluation
      }
    }

    // ── 7. RETRIEVAL & GROUNDING OVER PLATFORM CONTENT ──────────────────────
    const retrieval = retrievePlatformContext({
      query: text,
      route,
      activeScenarioId,
      studentTelemetry
    })

    // ── 8. EXECUTE REAL GEMINI MODEL CALL ────────────────────────────────────
    const availableKeys = getRuntimeGeminiKeys(context)
    if (availableKeys.length === 0) {
      console.error('[Sentinel Error Logging] No Gemini API keys configured.')
      return {
        status: 'NO_KEYS',
        reply: ERROR_MESSAGES.NO_KEYS,
        error: 'No keys configured'
      }
    }

    const now = Date.now()
    const activeKeys = availableKeys.filter(k => (this.keyCooldowns.get(k.key) || 0) <= now)
    const keyCandidates = activeKeys.length > 0
      ? activeKeys
      : [...availableKeys].sort((a, b) => (this.keyCooldowns.get(a.key) || 0) - (this.keyCooldowns.get(b.key) || 0))

    const startIndex = this.rotationIdx % keyCandidates.length
    const orderedKeys = [
      ...keyCandidates.slice(startIndex),
      ...keyCandidates.slice(0, startIndex)
    ]

    // Assemble the complete grounded prompt with full student context & platform knowledge
    let contextBlock = `\n\n[STUDENT IDENTITY & ACTIVE TELEMETRY]:
- Learner ID: ${studentTelemetry.activeProfileId || 'guest'}
- Learner Name: ${studentTelemetry.activeProfileName || 'Guest Learner'}
- Active Route: ${route}
- Active Lab / Scenario: ${activeScenarioId || 'Courseware Browsing'}
- Platform Mastery: ${studentTelemetry.masterProgressPercent || 0}% (${studentTelemetry.masterTotalXP || 0} XP)
- Completed Activities / Labs: ${studentTelemetry.completedMasterActivities || 0}
- Active Notes Snippet: ${studentTelemetry.currentNotesSnippet ? studentTelemetry.currentNotesSnippet.slice(0, 300) : 'None'}
- Telemetry Notice: ${ATTACHED_TELEMETRY_DISCLOSURE}`

    if (retrieval.groundedText) {
      contextBlock += `\n\n[RETRIEVED PLATFORM CONTENT & CURRICULUM GROUNDING]:\n${retrieval.groundedText}`
    }

    if (retrieval.noMatchDirective) {
      contextBlock += `\n\n${retrieval.noMatchDirective}`
    }

    const combinedSystemPrompt = `${SENTINEL_SYSTEM_PROMPT}${contextBlock}`

    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-flash-latest',
      'gemini-flash-lite-latest'
    ]
    let lastError = null

    for (const keyItem of orderedKeys) {
      const activeKey = keyItem.key

      for (const model of candidateModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`
          const payload = {
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `[System Instruction: ${combinedSystemPrompt}]\n\nUser Question:\n${text}`
                  }
                ]
              }
            ]
          }

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(8000)
          })

          if (response.status === 429) {
            this.keyCooldowns.set(activeKey, Date.now() + 60000)
            console.warn(`[Sentinel Rotator] Key (${keyItem.source}) rate-limited (HTTP 429). Cooldown 60s.`)
            break // try next key
          }

          if (response.status === 503) {
            console.warn(`[Sentinel Rotator] Model ${model} returned HTTP 503 on ${keyItem.source}. Trying fallback model.`)
            continue // try next model on same key
          }

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            console.warn(`[Sentinel Rotator] Key (${keyItem.source}) error HTTP ${response.status}:`, errData?.error?.message || errData)
            lastError = errData?.error?.message || `HTTP ${response.status}`
            if (response.status === 400 || response.status === 403) {
              this.keyCooldowns.set(activeKey, Date.now() + 120000)
              break
            }
            continue
          }

          const data = await response.json()
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (candidateText && candidateText.trim()) {
            this.rotationIdx = (this.rotationIdx + 1) % keyCandidates.length
            this.recordUsage(activeKey, model, 200)

            return {
              status: 'SUCCESS',
              reply: candidateText.trim(),
              sourceTag: retrieval.citationTags.length > 0 ? retrieval.citationTags.join(' ') : '[Source: Platform Guidelines]',
              modelUsed: model,
              keySource: keyItem.source
            }
          }
        } catch (networkError) {
          console.error(`[Sentinel Error Logging] Network error with key ${keyItem.source}:`, networkError)
          lastError = networkError.message
          break
        }
      }
    }

    // Honest failure state: All keys exhausted or outage
    console.error('[Sentinel Error Logging] All Gemini keys exhausted or unavailable. Real error logged:', lastError)
    return {
      status: 'OUTAGE',
      reply: ERROR_MESSAGES.OUTAGE,
      error: lastError || 'All models and keys unavailable'
    }
  }
}

export const sentinelClient = new SentinelManager()
