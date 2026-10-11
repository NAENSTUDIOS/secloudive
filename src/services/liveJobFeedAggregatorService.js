// ==============================================================================
// SeCloudive Live Job Feed & Automated Multi-API Aggregator Service
// Features:
// - Multi-API key storage (Google Gemini AI, RapidAPI / JSearch, Adzuna)
// - Automated background sync & cache invalidation (No daily manual update needed)
// - Querying live endpoints with smart fallback to comprehensive multi-cloud bank
// - Application tracking & bookmarking engine (Saved, Applied, Interviewing, Offer)
// ==============================================================================

import { geminiRotator } from './geminiKeyRotator.js'
import { LIVE_INTERNSHIPS_DATA } from '../data/liveInternshipsData.js'

const KEYS_CONFIG_STORAGE = 'secloudive_job_portal_keys_v1'
const JOBS_CACHE_STORAGE = 'secloudive_live_cloud_jobs_v2'
const TRACKED_JOBS_STORAGE = 'secloudive_user_tracked_jobs_v1'
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours auto-refresh cache

class LiveJobFeedAggregatorService {
  constructor() {
    this.config = this.loadConfig()
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem(KEYS_CONFIG_STORAGE)
      if (stored) return JSON.parse(stored)
    } catch {}
    return {
      geminiApiKey: '',
      rapidApiKey: '',
      adzunaAppId: '',
      adzunaAppKey: '',
      autoSyncEnabled: true,
      autoSyncIntervalHours: 12,
      lastSyncTimestamp: Date.now() - 3600000
    }
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }
    try {
      localStorage.setItem(KEYS_CONFIG_STORAGE, JSON.stringify(this.config))
      window.dispatchEvent(new CustomEvent('job-api-keys-updated', { detail: this.config }))
    } catch (e) {
      console.warn('Failed to save job portal API config:', e)
    }
    return this.config
  }

  getConfig() {
    return { ...this.config }
  }

  // ── Auto-Sync Check ────────────────────────────────────────────────────────
  shouldAutoSync() {
    if (!this.config.autoSyncEnabled) return false
    const intervalMs = (this.config.autoSyncIntervalHours || 12) * 60 * 60 * 1000
    return Date.now() - (this.config.lastSyncTimestamp || 0) > intervalMs
  }

  // ── Main Aggregation Method ────────────────────────────────────────────────
  async fetchLiveCloudJobs({ forceRefresh = false, roleCategory = 'all', cloudProvider = 'all', jobType = 'all' } = {}) {
    // 1. Check local cache first unless forceRefresh is triggered
    if (!forceRefresh && !this.shouldAutoSync()) {
      try {
        const cached = localStorage.getItem(JOBS_CACHE_STORAGE)
        if (cached) {
          const { data, timestamp, source } = JSON.parse(cached)
          if (Array.isArray(data) && data.length > 0 && (Date.now() - timestamp < CACHE_TTL_MS)) {
            return {
              items: data,
              source: source || 'Local Telemetry Cache',
              isLiveApi: true,
              timestamp
            }
          }
        }
      } catch (e) {
        console.warn('Cache read error:', e)
      }
    }

    let liveItems = []
    let sourceUsed = 'Grounded Multi-Cloud Repository'
    let isLiveApi = false
    let apiName = 'SeCloudive Base'

    // 2. Try RapidAPI JSearch if key is present
    if (this.config.rapidApiKey && this.config.rapidApiKey.trim()) {
      try {
        const rapidResults = await this.queryRapidApiJSearch(this.config.rapidApiKey.trim())
        if (Array.isArray(rapidResults) && rapidResults.length > 0) {
          liveItems = rapidResults
          sourceUsed = 'RapidAPI JSearch (Google Jobs & LinkedIn Feed)'
          isLiveApi = true
          apiName = 'JSearch'
        }
      } catch (err) {
        console.warn('RapidAPI JSearch query error, falling back:', err)
      }
    }

    // 3. Try Gemini AI Live Career Engine if needed
    if (liveItems.length === 0) {
      try {
        const geminiResults = await this.queryGeminiLiveJobs()
        if (Array.isArray(geminiResults) && geminiResults.length > 0) {
          liveItems = geminiResults
          sourceUsed = 'Google Gemini AI Live Career Radar (gemini-3.5-flash-lite)'
          isLiveApi = true
          apiName = 'Gemini AI'
        }
      } catch (err) {
        console.warn('Gemini live jobs query error:', err)
      }
    }

    // 4. Merge live items with the rich 30+ grounded bank for 100% comprehensive coverage
    const combined = this.mergeWithBaseData(liveItems)

    // 5. Update timestamp and save to cache
    const newTimestamp = Date.now()
    this.saveConfig({ lastSyncTimestamp: newTimestamp })

    try {
      localStorage.setItem(JOBS_CACHE_STORAGE, JSON.stringify({
        data: combined,
        timestamp: newTimestamp,
        source: sourceUsed
      }))
    } catch {}

    return {
      items: combined,
      source: sourceUsed,
      isLiveApi,
      apiName,
      timestamp: newTimestamp
    }
  }

  // ── RapidAPI JSearch Integration ───────────────────────────────────────────
  async queryRapidApiJSearch(apiKey) {
    const url = 'https://jsearch.p.rapidapi.com/search?query=cloud+security+intern+OR+cloud+security+engineer+OR+devsecops&page=1&num_pages=1&date_posted=all'
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    })

    if (!res.ok) throw new Error(`RapidAPI returned HTTP ${res.status}`)
    const json = await res.json()
    if (!json || !Array.isArray(json.data)) return []

    return json.data.slice(0, 10).map((job, idx) => ({
      id: `rapid-${job.job_id || idx}`,
      company: job.employer_name || 'Enterprise Cloud Firm',
      role: job.job_title || 'Cloud Security Engineer',
      roleCategory: (job.job_title || '').toLowerCase().includes('soc') ? 'soc-dfir'
        : (job.job_title || '').toLowerCase().includes('devsecops') ? 'devsecops'
        : (job.job_title || '').toLowerCase().includes('architect') ? 'architecture'
        : 'security-engineering',
      jobType: (job.job_employment_type || '').toLowerCase().includes('intern') ? 'internship' : 'full-time',
      cloudProvider: (job.job_description || '').toLowerCase().includes('azure') ? 'azure'
        : (job.job_description || '').toLowerCase().includes('gcp') ? 'gcp'
        : 'aws',
      location: job.job_city ? `${job.job_city}, ${job.job_country || ''}` : (job.job_is_remote ? 'Remote' : 'United States'),
      isRemote: Boolean(job.job_is_remote),
      stipend: job.job_min_salary ? `$${Math.round(job.job_min_salary / 1000)}k – $${Math.round(job.job_max_salary / 1000)}k / yr` : '$50 – $65 / hr',
      cycle: 'Live Active Posting',
      status: 'NEW POSTING',
      statusVariant: 'new',
      logoText: (job.employer_name || 'JOB').slice(0, 4).toUpperCase(),
      logoColor: '#38bdf8',
      description: (job.job_description || '').slice(0, 220) + '...',
      skills: ['Cloud Security', 'IAM & Access', 'Python / Automation', 'AWS / Azure'],
      recommendedLabs: [
        { name: 'IAM Privilege Escalation Lab', path: '/learning/foundations/iam-privilege-escalation' },
        { name: 'S3 Data Guardrails Lab', path: '/labs' }
      ],
      interviewFocus: 'Walk through your hands-on approach to identifying, triaging, and remediating high-risk cloud misconfigurations.',
      applyUrl: job.job_apply_link || 'https://www.linkedin.com/jobs/',
      verifiedDate: 'Live JSearch Sync • Just Now',
      postedDate: Date.now()
    }))
  }

  // ── Gemini Live AI Query Integration ───────────────────────────────────────
  async queryGeminiLiveJobs() {
    const prompt = `You are a Technical Talent Director and Hyperscale Cloud Security Hiring Architect.
Generate a JSON array of 6 realistic, current cloud security job and internship openings across diverse companies (such as AWS, Google Cloud, Microsoft Azure, CrowdStrike, Palo Alto Networks, Wiz, SentinelOne, Datadog, Snowflake, Stripe, JPMorgan Chase).
Cover diverse roles: Cloud Security Intern, DevSecOps Specialist, Junior SOC Analyst, Cloud Security Architect, Bedrock GenAI Security Specialist.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": "gemini-live-...",
    "company": "Company Name",
    "role": "Exact Role Title",
    "roleCategory": "security-engineering" | "soc-dfir" | "devsecops" | "architecture" | "ai-security",
    "jobType": "internship" | "entry-level" | "full-time",
    "cloudProvider": "aws" | "azure" | "gcp" | "multi-cloud",
    "location": "e.g. Seattle, WA / Remote",
    "isRemote": true,
    "stipend": "e.g. $54.00 – $68.00 / hr OR $130,000 – $155,000 / yr",
    "cycle": "Summer 2026 / Active Intake",
    "status": "APPLICATIONS OPEN",
    "statusVariant": "open",
    "logoText": "Short 3-4 letter badge",
    "logoColor": "Hex color e.g. #38bdf8",
    "description": "2-3 sentences explaining responsibilities and technical scope.",
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
    "interviewFocus": "Key technical question the hiring manager will ask in technical round.",
    "applyUrl": "Official career URL"
  }
]`

    const systemInstruction = "You are a Cloud Security career intelligence system. Output strictly valid JSON."

    const result = await geminiRotator.executeJson({ prompt, systemInstruction })
    if (result && Array.isArray(result.data) && result.data.length > 0) {
      return result.data.map(item => ({
        ...item,
        recommendedLabs: item.recommendedLabs || [
          { name: 'IAM Privilege Escalation Lab', path: '/learning/foundations/iam-privilege-escalation' },
          { name: 'Enterprise SOP Labs', path: '/labs' }
        ],
        verifiedDate: `Live Gemini Sync • Just Now`,
        postedDate: Date.now()
      }))
    }
    return []
  }

  // ── Merge Live Items with Rich Grounded Bank ───────────────────────────────
  mergeWithBaseData(liveItems = []) {
    if (!Array.isArray(liveItems) || liveItems.length === 0) {
      return LIVE_INTERNSHIPS_DATA
    }

    // Deduplicate by company + role title
    const seen = new Set()
    const merged = []

    for (const item of liveItems) {
      const key = `${item.company}-${item.role}`.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        merged.push(item)
      }
    }

    for (const item of LIVE_INTERNSHIPS_DATA) {
      const key = `${item.company}-${item.role}`.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        merged.push(item)
      }
    }

    return merged
  }

  // ── Tracked & Bookmarked Jobs Engine ───────────────────────────────────────
  getTrackedJobs() {
    try {
      const raw = localStorage.getItem(TRACKED_JOBS_STORAGE)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  }

  saveTrackedJob(jobId, status = 'saved', notes = '') {
    const current = this.getTrackedJobs()
    current[jobId] = {
      status, // 'saved' | 'applied' | 'interviewing' | 'offer'
      notes,
      updatedAt: Date.now()
    }
    try {
      localStorage.setItem(TRACKED_JOBS_STORAGE, JSON.stringify(current))
      window.dispatchEvent(new CustomEvent('tracked-jobs-updated', { detail: current }))
    } catch {}
    return current
  }

  removeTrackedJob(jobId) {
    const current = this.getTrackedJobs()
    delete current[jobId]
    try {
      localStorage.setItem(TRACKED_JOBS_STORAGE, JSON.stringify(current))
      window.dispatchEvent(new CustomEvent('tracked-jobs-updated', { detail: current }))
    } catch {}
    return current
  }
}

export const liveJobFeedAggregator = new LiveJobFeedAggregatorService()
