// =========================================================================
// SeCloudive AI Memory Model & Cost Optimization Cache Engine
// Stores multi-turn learner history and prevents redundant Gemini model calls
// =========================================================================

const MEMORY_STORAGE_KEY = 'secloudive_ai_learner_memory'
const CACHE_STORAGE_KEY = 'secloudive_ai_cost_cache'

/**
 * AI Memory Model storing historical telemetry across 5 core pillars:
 * 1. Learning History
 * 2. Investigation History
 * 3. Architecture Review History
 * 4. Interview History
 * 5. Career History
 */
let inMemoryCache = null

export const aiMemoryModel = {
  getMemory() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        if (!inMemoryCache) inMemoryCache = this.getDefaultMemory()
        return inMemoryCache
      }
      const raw = localStorage.getItem(MEMORY_STORAGE_KEY)
      return raw ? JSON.parse(raw) : this.getDefaultMemory()
    } catch {
      if (!inMemoryCache) inMemoryCache = this.getDefaultMemory()
      return inMemoryCache
    }
  },

  getDefaultMemory() {
    return {
      learningHistory: [],
      investigationHistory: [],
      architectureHistory: [],
      interviewHistory: [],
      careerHistory: [],
      recentWeaknessesIdentified: [],
      recentStrengthsIdentified: [],
      lastUpdated: new Date().toISOString()
    }
  },

  saveMemory(memory) {
    try {
      inMemoryCache = {
        ...memory,
        lastUpdated: new Date().toISOString()
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(inMemoryCache))
      }
    } catch (e) {
      console.warn('Failed to save AI memory:', e)
    }
  },

  recordLearningEvent(event) {
    const memory = this.getMemory()
    memory.learningHistory.unshift({
      id: `learn-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      ...event
    })
    memory.learningHistory = memory.learningHistory.slice(0, 50)
    this.saveMemory(memory)
  },

  recordInvestigationEvent(event) {
    const memory = this.getMemory()
    memory.investigationHistory.unshift({
      id: `inv-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      ...event
    })
    memory.investigationHistory = memory.investigationHistory.slice(0, 50)
    this.saveMemory(memory)
  },

  recordArchitectureEvent(event) {
    const memory = this.getMemory()
    memory.architectureHistory.unshift({
      id: `arch-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      ...event
    })
    memory.architectureHistory = memory.architectureHistory.slice(0, 50)
    this.saveMemory(memory)
  },

  recordInterviewEvent(event) {
    const memory = this.getMemory()
    memory.interviewHistory.unshift({
      id: `interview-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      ...event
    })
    memory.interviewHistory = memory.interviewHistory.slice(0, 50)
    this.saveMemory(memory)
  },

  recordCareerMilestone(milestone) {
    const memory = this.getMemory()
    memory.careerHistory.unshift({
      id: `milestone-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      ...milestone
    })
    this.saveMemory(memory)
  },

  /**
   * Assembles deep personalized context for Gemini prompts
   */
  assemblePersonalizedContext(learnerProfile = {}) {
    const memory = this.getMemory()
    return {
      targetRole: learnerProfile.targetCareerRole || 'Cloud Security Engineer',
      overallReadiness: learnerProfile.overallReadinessScore || 65,
      thinkingScore: learnerProfile.thinkingScore || 70,
      recentCompletedInvestigations: memory.investigationHistory.slice(0, 3).map(i => i.title || i.id),
      recentArchitectureAudits: memory.architectureHistory.slice(0, 2).map(a => a.blueprintTitle || a.id),
      recentInterviewPerformance: memory.interviewHistory.slice(0, 2).map(i => ({ role: i.role, score: i.score })),
      demonstratedStrengths: memory.recentStrengthsIdentified.slice(0, 3),
      priorityGaps: memory.recentWeaknessesIdentified.slice(0, 3)
    }
  }
}

/**
 * =========================================================================
 * PART 8: COST OPTIMIZATION CACHE ENGINE
 * =========================================================================
 * Eliminates redundant Gemini API calls by caching high-frequency static &
 * trend queries (Job trends, salary benchmarks, roadmaps, AWS service facts).
 */

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 6 // 6 hours cache TTL

export const costOptimizationCache = {
  get(key) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null
      const raw = localStorage.getItem(`${CACHE_STORAGE_KEY}::${key}`)
      if (!raw) return null

      const entry = JSON.parse(raw)
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(`${CACHE_STORAGE_KEY}::${key}`)
        return null
      }
      return entry.data
    } catch {
      return null
    }
  },

  set(key, data, ttlMs = DEFAULT_TTL_MS) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`${CACHE_STORAGE_KEY}::${key}`, JSON.stringify({
          data,
          expiresAt: Date.now() + ttlMs,
          cachedAt: new Date().toISOString()
        }))
      }
    } catch (e) {
      console.warn('Failed to set cost cache:', e)
    }
  },

  clear() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.keys(localStorage)
          .filter(k => k.startsWith(CACHE_STORAGE_KEY))
          .forEach(k => localStorage.removeItem(k))
      }
    } catch {
      // Ignored
    }
  }
}
