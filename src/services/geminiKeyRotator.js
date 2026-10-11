// ==============================================================================
// SeCloudive Gemini Multi-Key Rotation Engine (Option B Implementation)
// ==============================================================================
// Dynamically discovers keys from Vite .env pool and localStorage, balances
// load round-robin, and fails over on HTTP 429 rate limit errors automatically.
// Uses official Google 'gemini-flash-latest' and 'gemini-3.5-flash' models.
// ==============================================================================

export const GEMINI_LIMITS_SPEC = {
  'gemini-flash-latest': {
    name: 'Gemini Flash (Latest High-Speed Model - Recommended)',
    freeTier: {
      rpm: 15,          // Requests Per Minute
      rpd: 1500,        // Requests Per Day (Reset at midnight UTC)
      tpm: 1000000,     // Tokens Per Minute
      cost: '100% Free'
    },
    paidTier: {
      rpm: 2000,
      rpd: 'Unlimited (Pay per token)',
      tpm: 4000000,
      cost: '$0.075 / 1M input tokens'
    }
  },
  'gemini-3.5-flash': {
    name: 'Gemini 3.5 Flash (Advanced Architectural Reasoning)',
    freeTier: {
      rpm: 15,
      rpd: 1500,
      tpm: 1000000,
      cost: '100% Free'
    },
    paidTier: {
      rpm: 2000,
      rpd: 'Unlimited',
      tpm: 4000000
    }
  },
  'gemini-pro-latest': {
    name: 'Gemini Pro (Deep Technical Audit)',
    freeTier: {
      rpm: 2,           // Very strict: only 1 request every 30 seconds
      rpd: 50,          // Max 50 queries per day
      tpm: 32000,
      cost: '100% Free'
    },
    paidTier: {
      rpm: 1000,
      rpd: 'Unlimited',
      tpm: 4000000,
      cost: '$1.25 / 1M input tokens'
    }
  }
}

class ClientKeyPoolManager {
  constructor() {
    this.disabledUntil = new Map() // key -> timestamp (ms)
    this.rotationIndex = 0
    this.keyUsageCount = new Map() // key -> total successful calls
  }

  // Validate that a key looks like a real Google AI Studio key or Gemini token
  isValidKey(key) {
    if (!key || typeof key !== 'string') return false
    const trimmed = key.trim()
    if (!trimmed.startsWith('AIzaSy') && !trimmed.startsWith('AQ.')) return false
    if (trimmed.includes('YourFirstKey') || trimmed.includes('YourSecondKey') || trimmed.includes('YourKey') || trimmed.includes('YOUR_KEY')) {
      return false
    }
    return trimmed.length >= 25
  }

  // Get list of all currently configured keys from .env pool and localStorage
  getAllConfiguredKeys() {
    const keys = []
    
    // 1. Direct User key from localStorage (Highest priority if learner provides personal key)
    let userCustomKey = null
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        userCustomKey = window.localStorage.getItem('secloudive_user_gemini_key')
      }
    } catch (e) {
      // Ignored in non-browser or sandbox contexts
    }
    if (this.isValidKey(userCustomKey)) {
      keys.push({ key: userCustomKey.trim(), source: 'Local User Key', id: 'custom' })
    }

    // 2. Option B: Multi-Key Pool from Vite Environment Variables (.env) or Node environment
    const metaEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {}
    const procEnv = (typeof process !== 'undefined' && process.env) ? process.env : {}
    const env = { ...procEnv, ...metaEnv }

    const envKeys = [
      { key: env.VITE_GEMINI_KEY_6, id: 'env_pool_6' },
      { key: env.VITE_GEMINI_API_KEY, id: 'env_fallback' },
      { key: env.VITE_GEMINI_KEY_1, id: 'env_pool_1' },
      { key: env.VITE_GEMINI_KEY_2, id: 'env_pool_2' },
      { key: env.VITE_GEMINI_KEY_3, id: 'env_pool_3' },
      { key: env.VITE_GEMINI_KEY_4, id: 'env_pool_4' },
      { key: env.VITE_GEMINI_KEY_5, id: 'env_pool_5' }
    ]

    envKeys.forEach((item, index) => {
      if (this.isValidKey(item.key)) {
        // Avoid duplicate keys if defined in multiple slots
        if (!keys.some(k => k.key === item.key.trim())) {
          keys.push({
            key: item.key.trim(),
            source: `Option B Pool (Slot ${index + 1})`,
            id: item.id
          })
        }
      }
    })

    return keys
  }

  // Get active pool statistics for display in the UI
  getPoolStatus() {
    const allKeys = this.getAllConfiguredKeys()
    const now = Date.now()
    const activeKeys = allKeys.filter(k => (this.disabledUntil.get(k.key) || 0) <= now)
    const cooledDownKeys = allKeys.filter(k => (this.disabledUntil.get(k.key) || 0) > now)

    // Calculate aggregated capacity
    const flashLimit = GEMINI_LIMITS_SPEC['gemini-flash-latest'].freeTier
    const poolRpm = (activeKeys.length || 1) * flashLimit.rpm
    const poolRpd = (activeKeys.length || 1) * flashLimit.rpd

    return {
      totalKeys: allKeys.length,
      activeKeysCount: activeKeys.length,
      coolingDownCount: cooledDownKeys.length,
      poolRpm,
      poolRpd,
      hasKeys: allKeys.length > 0,
      mode: allKeys.length > 1
        ? 'Option B (Multi-Key Rotation Pool Active)'
        : allKeys.length === 1
          ? 'Single Key Active'
          : 'Grounded Local Mode (No Gemini Keys Configured)',
      keysDetail: allKeys.map(k => ({
        id: k.id,
        source: k.source,
        preview: `${k.key.slice(0, 8)}...${k.key.slice(-4)}`,
        status: (this.disabledUntil.get(k.key) || 0) > now ? 'Cooling Down (429)' : 'Ready',
        usageCount: this.keyUsageCount.get(k.key) || 0
      }))
    }
  }

  // Mark a key as rate-limited (HTTP 429) with cooldown seconds
  markRateLimited(key, cooldownSeconds = 60) {
    const until = Date.now() + cooldownSeconds * 1000
    this.disabledUntil.set(key, until)
    console.warn(`[GeminiKeyRotator] Key ...${key.slice(-4)} rate-limited (429). Cooldown: ${cooldownSeconds}s.`)
  }

  // Method alias for executeChat
  execute(params) {
    return this.executeChat(params)
  }

  // Execute Gemini API call with automatic round-robin and instant failover across all pool keys
  async executeChat({ prompt, systemInstruction, model = 'gemini-flash-latest' }) {
    const configuredKeys = this.getAllConfiguredKeys()
    if (configuredKeys.length === 0) {
      return null // Signal to caller to use local grounded knowledge base
    }

    const now = Date.now()
    // Available keys not in cooldown
    const availableKeys = configuredKeys.filter(k => (this.disabledUntil.get(k.key) || 0) <= now)
    
    // If all keys in pool are cooled down, force the one with the soonest cooldown expiration
    const keyCandidates = availableKeys.length > 0
      ? availableKeys
      : [...configuredKeys].sort((a, b) => (this.disabledUntil.get(a.key) || 0) - (this.disabledUntil.get(b.key) || 0))

    // Try keys sequentially starting from rotation offset
    const startIndex = this.rotationIndex % keyCandidates.length
    const orderedKeys = [
      ...keyCandidates.slice(startIndex),
      ...keyCandidates.slice(0, startIndex)
    ]

    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-flash-latest',
      model,
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite'
    ]

    for (const keyItem of orderedKeys) {
      const activeKey = keyItem.key
      
      for (const currentModel of candidateModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${activeKey}`
          const payload = {
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: systemInstruction ? `[System Instruction: ${systemInstruction}]\n\n${prompt}` : prompt
                  }
                ]
              }
            ]
          }

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })

          // Handle Rate Limit (HTTP 429) -> Failover to next key in pool
          if (response.status === 429) {
            this.markRateLimited(activeKey, 60)
            break // Try next key
          }

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            console.warn(`[GeminiKeyRotator] Key ${keyItem.id} returned HTTP ${response.status} for ${currentModel}:`, errData?.error?.message || errData)
            if (response.status === 400 || response.status === 403) {
              this.markRateLimited(activeKey, 120)
              break // Try next key
            }
            continue // Try next candidate model
          }

          const data = await response.json()
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (candidateText) {
            // Success! Record usage and advance rotation index for next call
            this.rotationIndex = (this.rotationIndex + 1) % keyCandidates.length
            const currentUsage = this.keyUsageCount.get(activeKey) || 0
            this.keyUsageCount.set(activeKey, currentUsage + 1)

            return {
              text: candidateText,
              keyUsed: `${activeKey.slice(0, 6)}...${activeKey.slice(-4)}`,
              keySource: keyItem.source,
              modelUsed: currentModel,
              success: true
            }
          }
        } catch (networkError) {
          console.warn(`[GeminiKeyRotator] Network error calling Gemini with key ${keyItem.id}:`, networkError)
          break // Try next key
        }
      }
    }

    // All keys exhausted or failed -> Fallback to grounded local knowledge engine
    return null
  }

  // Execute Gemini API call with structured JSON response
  async executeJson({ prompt, systemInstruction, model = 'gemini-flash-latest' }) {
    const configuredKeys = this.getAllConfiguredKeys()
    if (configuredKeys.length === 0) return null

    const now = Date.now()
    const availableKeys = configuredKeys.filter(k => (this.disabledUntil.get(k.key) || 0) <= now)
    const keyCandidates = availableKeys.length > 0
      ? availableKeys
      : [...configuredKeys].sort((a, b) => (this.disabledUntil.get(a.key) || 0) - (this.disabledUntil.get(b.key) || 0))

    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-flash-latest',
      model,
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite'
    ]

    for (const keyItem of keyCandidates) {
      const activeKey = keyItem.key

      for (const currentModel of candidateModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${activeKey}`
          const payload = {
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: systemInstruction ? `[System Instruction: ${systemInstruction}]\n\n${prompt}` : prompt
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          }

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })

          if (response.status === 429) {
            this.markRateLimited(activeKey, 60)
            break
          }

          if (!response.ok) {
            continue
          }

          const data = await response.json()
          const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (rawJson) {
            try {
              const parsed = JSON.parse(rawJson)
              const currentUsage = this.keyUsageCount.get(activeKey) || 0
              this.keyUsageCount.set(activeKey, currentUsage + 1)
              return {
                data: parsed,
                keyUsed: `${activeKey.slice(0, 6)}...${activeKey.slice(-4)}`,
                modelUsed: currentModel,
                success: true
              }
            } catch (jsonErr) {
              console.warn('[GeminiKeyRotator] JSON parse error:', jsonErr)
            }
          }
        } catch (e) {
          console.warn('[GeminiKeyRotator] executeJson error:', e)
          break
        }
      }
    }

    return null
  }
}

// Export singleton instances
export const geminiRotator = new ClientKeyPoolManager()
export const geminiKeyPool = geminiRotator
export default geminiRotator
