/**
 * SeCloudive User Data & Auto-Save Synchronization Engine
 * Developed for NAEN Studios / SeCloudive Platform
 * 
 * Rules:
 * 1. Every registered user has their own UNIQUE User ID (no two users can share an ID).
 * 2. In that User ID, only their data is saved (challenges, labs, notes, flashcards, diagnostic baseline).
 * 3. All progress automatically syncs in real time with the active User ID.
 * 4. If no User ID is active, the platform runs in GUEST MODE with isolated temporary data.
 * 5. Users can claim their Unique User ID from Guest Mode and migrate their progress seamlessly.
 */

import { createIntegrityEnvelope, verifyExportPackage } from '../utils/auditExportEngine.js'

export const PROFILES_REGISTRY_KEY = 'secloudive_profiles_registry_v1'
export const ACTIVE_PROFILE_KEY = 'secloudive_active_profile_id_v1'
export const LEGACY_STORAGE_KEY = 'secloudive-progress-v1'

export const GUEST_PROFILE_ID = 'guest'

export const GUEST_PROFILE = {
  id: GUEST_PROFILE_ID,
  isGuest: true,
  name: 'Guest Learner',
  email: '',
  role: 'Cloud Security Explorer',
  avatarColor: '#64748b',
  createdAt: new Date().toISOString(),
  lastActive: new Date().toISOString()
}

/**
 * Validates a User ID format: 3-32 chars, alphanumeric, hyphens, underscores
 */
export function validateUserIdFormat(rawId) {
  if (!rawId || typeof rawId !== 'string') return { valid: false, error: 'User ID cannot be empty.' }
  const clean = rawId.trim()
  if (clean.length < 3) return { valid: false, error: 'User ID must be at least 3 characters.' }
  if (clean.length > 32) return { valid: false, error: 'User ID must be 32 characters or fewer.' }
  if (!/^[a-zA-Z0-9_-]+$/.test(clean)) {
    return { valid: false, error: 'User ID can only contain letters, numbers, hyphens (-), and underscores (_).' }
  }
  if (clean.toLowerCase() === GUEST_PROFILE_ID) {
    return { valid: false, error: '"guest" is a reserved platform identifier for Guest Mode.' }
  }
  return { valid: true, cleanId: clean }
}

/**
 * Checks if a User ID is available (unique across the platform)
 */
export function isUserIdAvailable(rawId) {
  const check = validateUserIdFormat(rawId)
  if (!check.valid) return false
  const profiles = getAllProfiles()
  return !profiles.some(p => p.id.toLowerCase() === check.cleanId.toLowerCase())
}

/**
 * Generates an available unique random User ID (e.g. SEC-USER-7492)
 */
export function generateUniqueUserId(prefix = 'SEC-USER') {
  let candidate = ''
  let attempts = 0
  const profiles = getAllProfiles()
  do {
    const rand = Math.floor(1000 + Math.random() * 9000)
    candidate = `${prefix}-${rand}`
    attempts++
  } while (profiles.some(p => p.id.toLowerCase() === candidate.toLowerCase()) && attempts < 100)
  return candidate
}

/**
 * Read all registered user profiles (excluding guest)
 */
export function getAllProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_REGISTRY_KEY)
    if (!raw) return []
    const profiles = JSON.parse(raw)
    if (!Array.isArray(profiles)) return []
    return profiles.filter(p => p && p.id && p.id !== GUEST_PROFILE_ID)
  } catch (err) {
    console.warn('[UserSyncManager] Error reading profiles registry:', err)
    return []
  }
}

/**
 * Get the currently active profile.
 * Defaults to GUEST_PROFILE if no user is authenticated or explicitly set to 'guest'.
 */
export function getActiveProfile() {
  try {
    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY)
    
    // Explicit guest mode or no active profile set -> return Guest Mode
    if (!activeId || activeId === GUEST_PROFILE_ID) {
      return { ...GUEST_PROFILE }
    }

    const profiles = getAllProfiles()
    const found = profiles.find(p => p.id.toLowerCase() === activeId.toLowerCase())
    if (found) {
      return { ...found, isGuest: false }
    }

    // If activeId was not found in registered profiles, fall back to Guest Mode
    return { ...GUEST_PROFILE }
  } catch {
    return { ...GUEST_PROFILE }
  }
}

/**
 * Set active profile and notify the entire application
 */
export function setActiveProfile(profileId) {
  try {
    if (profileId === GUEST_PROFILE_ID) {
      return switchToGuestMode()
    }

    const profiles = getAllProfiles()
    const target = profiles.find(p => p.id.toLowerCase() === profileId.toLowerCase())
    if (!target) return false

    target.lastActive = new Date().toISOString()
    localStorage.setItem(ACTIVE_PROFILE_KEY, target.id)
    localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(profiles))

    // Sync student name for legacy certificate components
    localStorage.setItem('secloudive_student_name', target.name)

    // Broadcast change
    window.dispatchEvent(new CustomEvent('secloudive-user-switched', { detail: { profile: { ...target, isGuest: false } } }))
    return true
  } catch (err) {
    console.error('[UserSyncManager] Failed to set active profile:', err)
    return false
  }
}

/**
 * Switch back to Guest Mode
 */
export function switchToGuestMode() {
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, GUEST_PROFILE_ID)
    window.dispatchEvent(new CustomEvent('secloudive-user-switched', { detail: { profile: { ...GUEST_PROFILE } } }))
    return true
  } catch (err) {
    console.error('[UserSyncManager] Failed to switch to guest mode:', err)
    return false
  }
}

/**
 * Register a new UNIQUE User ID.
 * Everyone cannot have the same ID. Validates uniqueness before creating.
 * Optionally migrates any current guest progress into the new User ID.
 */
export function registerUniqueProfile({
  userId,
  name,
  role = 'Cloud Security Engineer',
  email = '',
  avatarColor = '#38bdf8',
  migrateGuestData = true
}) {
  try {
    const validation = validateUserIdFormat(userId)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    const cleanId = validation.cleanId
    if (!isUserIdAvailable(cleanId)) {
      return {
        success: false,
        error: `User ID "${cleanId}" is already claimed. Each user must have their own unique User ID.`
      }
    }

    const profiles = getAllProfiles()
    const newProfile = {
      id: cleanId,
      isGuest: false,
      name: name?.trim() || cleanId,
      email: email.trim(),
      role,
      avatarColor,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }

    // Migrate guest data if requested
    if (migrateGuestData) {
      const guestProgress = loadProfileProgress(GUEST_PROFILE_ID)
      saveProfileProgress(cleanId, guestProgress)

      // Migrate guest streak if present
      const guestStreak = localStorage.getItem('secloudive_streak_guest') || localStorage.getItem('secloudive_streak_data')
      if (guestStreak) {
        localStorage.setItem(`secloudive_streak_${cleanId}`, guestStreak)
      }

      // Migrate guest diagnostic baseline if present
      const guestBaseline = localStorage.getItem('secloudive_baseline_guest') || localStorage.getItem('secloudive_diagnostic_baseline')
      if (guestBaseline) {
        localStorage.setItem(`secloudive_baseline_${cleanId}`, guestBaseline)
        localStorage.setItem('secloudive_diagnostic_baseline', guestBaseline)
      }

      // Migrate guest flashcard stats if present
      const guestFlashcards = localStorage.getItem('secloudive_flashcard_stats')
      if (guestFlashcards) {
        localStorage.setItem(`secloudive_flashcards_${cleanId}`, guestFlashcards)
      }
    }

    profiles.push(newProfile)
    localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(profiles))
    setActiveProfile(cleanId)

    return { success: true, profile: newProfile }
  } catch (err) {
    console.error('[UserSyncManager] Error registering unique profile:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Log in / switch to an existing registered User ID
 */
export function loginWithUserId(rawId) {
  try {
    if (!rawId || !rawId.trim()) {
      return { success: false, error: 'Please enter your User ID.' }
    }
    const clean = rawId.trim()
    if (clean.toLowerCase() === GUEST_PROFILE_ID) {
      switchToGuestMode()
      return { success: true, profile: GUEST_PROFILE }
    }

    const profiles = getAllProfiles()
    const found = profiles.find(p => p.id.toLowerCase() === clean.toLowerCase())
    if (!found) {
      return {
        success: false,
        notFound: true,
        requestedId: clean,
        error: `User ID "${clean}" was not found. Please verify your ID or register a new one.`
      }
    }

    setActiveProfile(found.id)
    return { success: true, profile: found }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Log in / switch to an existing registered User ID with cloud-lookup fallback
 */
export async function loginWithUserIdAsync(rawId) {
  try {
    const localRes = loginWithUserId(rawId)
    if (localRes.success) return localRes

    const clean = rawId?.trim()
    if (!clean) return localRes

    // If Supabase is available, check if the profile exists in the cloud
    try {
      const { supabase, isSupabaseConfigured } = await import('../lib/supabase.js')
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .or(`id.ilike.${clean},email.ilike.${clean}`)
          .maybeSingle()

        if (!error && data) {
          const profiles = getAllProfiles()
          let restored = profiles.find(p => p.id.toLowerCase() === data.id.toLowerCase())
          if (!restored) {
            restored = {
              id: data.id,
              name: data.name || data.student_name || data.id,
              email: data.email || '',
              role: data.role || 'Cloud Security Engineer',
              avatarColor: '#38bdf8',
              avatarUrl: data.picture || null,
              createdAt: data.created_at || new Date().toISOString(),
              lastActive: new Date().toISOString()
            }
            profiles.push(restored)
            localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(profiles))
          }

          // Fetch cloud progress if available
          try {
            const { fetchUserProgress } = await import('./supabaseProgressService.js')
            const cloudProgress = await fetchUserProgress(data.id)
            if (cloudProgress?.progress_blob) {
              saveProfileProgress(data.id, cloudProgress.progress_blob)
            }
          } catch {}

          setActiveProfile(restored.id)
          return { success: true, profile: restored, fromCloud: true }
        }
      }
    } catch (e) {
      console.warn('[UserSyncManager] Cloud lookup notice:', e)
    }

    return {
      success: false,
      notFound: true,
      requestedId: clean,
      error: `User ID "${clean}" was not found. Would you like to register it now?`
    }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Delete a user profile (removes their isolated progress and registry entry)
 */
export function deleteProfile(profileId) {
  try {
    if (profileId === GUEST_PROFILE_ID) {
      // Clear guest sandbox
      localStorage.removeItem(getProfileStorageKey(GUEST_PROFILE_ID))
      localStorage.removeItem('secloudive_streak_guest')
      localStorage.removeItem('secloudive_baseline_guest')
      return { success: true }
    }

    let profiles = getAllProfiles()
    profiles = profiles.filter(p => p.id !== profileId)
    localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(profiles))

    // Remove isolated stored data for this profile
    localStorage.removeItem(getProfileStorageKey(profileId))
    localStorage.removeItem(`secloudive_user_${profileId}_chat_v2`)
    localStorage.removeItem(`secloudive_user_${profileId}_history`)
    localStorage.removeItem(`secloudive_streak_${profileId}`)
    localStorage.removeItem(`secloudive_baseline_${profileId}`)
    localStorage.removeItem(`secloudive_flashcards_${profileId}`)

    const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY)
    if (activeId === profileId) {
      switchToGuestMode()
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Update profile details (e.g. name or role)
 */
export function updateProfile(profileId, updates) {
  try {
    if (profileId === GUEST_PROFILE_ID) {
      return null
    }

    const profiles = getAllProfiles()
    const target = profiles.find(p => p.id === profileId)
    if (!target) return null

    Object.assign(target, updates, { lastActive: new Date().toISOString() })
    localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(profiles))

    if (localStorage.getItem(ACTIVE_PROFILE_KEY) === profileId && updates.name) {
      localStorage.setItem('secloudive_student_name', updates.name)
    }

    window.dispatchEvent(new CustomEvent('secloudive-user-updated', { detail: { profile: target } }))
    return target
  } catch (err) {
    console.error('[UserSyncManager] Failed to update profile:', err)
    return null
  }
}

/**
 * ==============================================================================
 * GOOGLE AUTHENTICATION & SINGLE USER ID DETERMINISTIC SYNC
 * Rule: Exactly ONE User ID per Google Account (1-to-1 bijective mapping).
 * No profile duplicates or fragmented state.
 * ==============================================================================
 */

/**
 * Decodes a Google OAuth JWT Identity credential without external dependencies.
 */
export function parseGoogleCredential(credentialToken) {
  try {
    if (!credentialToken || typeof credentialToken !== 'string') return null
    const parts = credentialToken.split('.')
    if (parts.length < 2) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(jsonPayload)
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name || payload.given_name || payload.email?.split('@')[0],
      picture: payload.picture,
      emailVerified: Boolean(payload.email_verified)
    }
  } catch (err) {
    console.warn('[UserSyncManager] Failed to parse Google credential token:', err)
    return null
  }
}

/**
 * Deterministically generates a single User ID for a Google account
 */
export function deterministicGoogleUserId(googleUser) {
  if (!googleUser || (!googleUser.sub && !googleUser.email)) {
    return generateUniqueUserId('SEC-GGL')
  }

  // Derive stable suffix from sub or email
  const seed = (googleUser.sub || googleUser.email || '').toString()
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0 // 32bit int
  }
  const positive = Math.abs(hash)
  const code = (positive % 9000 + 1000).toString()

  const prefix = googleUser.email
    ? googleUser.email.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
    : 'GGL'

  const candidate = `SEC-${prefix || 'GGL'}-${code}`
  return candidate
}

/**
 * Find an existing profile bound to a Google Account (by sub or email)
 */
export function findProfileByGoogleAccount(googleUser) {
  if (!googleUser) return null
  const profiles = getAllProfiles()
  
  // 1. Check exact googleSub match (most immutable identifier)
  if (googleUser.sub) {
    const subMatch = profiles.find(p => p.googleSub && p.googleSub === googleUser.sub)
    if (subMatch) return subMatch
  }

  // 2. Check verified email match
  if (googleUser.email) {
    const normEmail = googleUser.email.trim().toLowerCase()
    const emailMatch = profiles.find(p => p.email && p.email.trim().toLowerCase() === normEmail)
    if (emailMatch) return emailMatch
  }

  return null
}

/**
 * Sign in or Register via Google Authentication.
 * STRICT ENFORCEMENT: Exactly ONE User ID per Google Account.
 * - If this Google account already has a registered User ID, logs into that exact User ID.
 * - If not, provisions a single User ID bound permanently to this Google account.
 */
export function signInWithGoogleAccount(googleUser, options = {}) {
  try {
    if (!googleUser || (!googleUser.sub && !googleUser.email)) {
      return { success: false, error: 'Invalid Google account data.' }
    }

    const profiles = getAllProfiles()
    const existing = findProfileByGoogleAccount(googleUser)

    // SCENARIO 1: Existing profile already bound to this Google Account
    if (existing) {
      // Ensure Google metadata is up to date
      if (!existing.googleSub && googleUser.sub) {
        existing.googleSub = googleUser.sub
      }
      if (googleUser.picture && !existing.avatarUrl) {
        existing.avatarUrl = googleUser.picture
      }
      existing.authProvider = 'google'
      existing.lastActive = new Date().toISOString()
      localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(profiles))

      setActiveProfile(existing.id)

      return {
        success: true,
        profile: existing,
        isNew: false,
        syncStatus: 'single_user_id_synced',
        message: `Synced to your single User ID: ${existing.id}`
      }
    }

    // SCENARIO 2: User requested to link their CURRENT active profile to this Google Account
    const active = getActiveProfile()
    if (options.linkCurrentProfile && active && !active.isGuest) {
      return linkGoogleAccountToProfile(active.id, googleUser)
    }

    // SCENARIO 3: Provision a brand new single User ID for this Google Account
    let candidateId = deterministicGoogleUserId(googleUser)
    
    // Ensure no conflict
    if (!isUserIdAvailable(candidateId)) {
      candidateId = `${candidateId}-${Math.floor(10 + Math.random() * 90)}`
    }

    const newProfile = {
      id: candidateId,
      isGuest: false,
      name: googleUser.name?.trim() || candidateId,
      email: googleUser.email?.trim() || '',
      role: 'Cloud Security Engineer',
      avatarColor: '#38bdf8',
      avatarUrl: googleUser.picture || null,
      authProvider: 'google',
      googleSub: googleUser.sub || null,
      googleLinkedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }

    // Migrate any guest data if requested
    if (options.migrateGuestData !== false) {
      const guestProgress = loadProfileProgress(GUEST_PROFILE_ID)
      saveProfileProgress(candidateId, guestProgress)

      const guestStreak = localStorage.getItem('secloudive_streak_guest') || localStorage.getItem('secloudive_streak_data')
      if (guestStreak) {
        localStorage.setItem(`secloudive_streak_${candidateId}`, guestStreak)
      }

      const guestBaseline = localStorage.getItem('secloudive_baseline_guest') || localStorage.getItem('secloudive_diagnostic_baseline')
      if (guestBaseline) {
        localStorage.setItem(`secloudive_baseline_${candidateId}`, guestBaseline)
      }
    }

    profiles.push(newProfile)
    localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(profiles))
    setActiveProfile(candidateId)

    return {
      success: true,
      profile: newProfile,
      isNew: true,
      syncStatus: 'new_single_user_id_registered',
      message: `Registered single User ID "${newProfile.id}" permanently bound to Google Account.`
    }
  } catch (err) {
    console.error('[UserSyncManager] Google Sign-in error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Link a Google Account to a specific existing profile.
 * Strictly checks that no OTHER profile is bound to this Google account.
 */
export function linkGoogleAccountToProfile(profileId, googleUser) {
  try {
    if (!profileId || profileId === GUEST_PROFILE_ID) {
      return { success: false, error: 'Cannot link Google account to Guest Mode.' }
    }
    if (!googleUser || (!googleUser.sub && !googleUser.email)) {
      return { success: false, error: 'Invalid Google account data.' }
    }

    const profiles = getAllProfiles()
    
    // Check if another profile is already using this Google account
    const existing = findProfileByGoogleAccount(googleUser)
    if (existing && existing.id.toLowerCase() !== profileId.toLowerCase()) {
      return {
        success: false,
        error: `This Google account (${googleUser.email || googleUser.sub}) is already bound to User ID "${existing.id}". SeCloudive enforces that a Google account maps to ONLY ONE User ID.`
      }
    }

    const target = profiles.find(p => p.id.toLowerCase() === profileId.toLowerCase())
    if (!target) {
      return { success: false, error: `Profile "${profileId}" not found.` }
    }

    target.authProvider = 'google'
    target.googleSub = googleUser.sub || target.googleSub
    target.email = googleUser.email || target.email
    if (googleUser.picture) target.avatarUrl = googleUser.picture
    target.googleLinkedAt = new Date().toISOString()
    target.lastActive = new Date().toISOString()

    localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(profiles))
    setActiveProfile(target.id)

    return {
      success: true,
      profile: target,
      message: `User ID "${target.id}" is now permanently linked to Google Account (${googleUser.email}).`
    }
  } catch (err) {
    return { success: false, error: err.message }
  }
}


/**
 * Storage Key for a specific profile's progress
 */
export function getProfileStorageKey(profileId) {
  const safeId = profileId || GUEST_PROFILE_ID
  return `secloudive_user_${safeId}_progress_v2`
}

/**
 * Load progress for a profile
 */
export function loadProfileProgress(profileId) {
  const safeId = profileId || GUEST_PROFILE_ID
  const key = getProfileStorageKey(safeId)
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      return JSON.parse(raw)
    }

    // If default or guest has legacy store, migrate it
    if (safeId === 'default' || safeId === GUEST_PROFILE_ID) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY)
      if (legacyRaw) {
        try {
          const parsedLegacy = JSON.parse(legacyRaw)
          localStorage.setItem(key, JSON.stringify(parsedLegacy))
          return parsedLegacy
        } catch { /* ignore parse error */ }
      }
    }

    return getBlankProgress()
  } catch (err) {
    console.warn(`[UserSyncManager] Error loading progress for ${safeId}:`, err)
    return getBlankProgress()
  }
}

/**
 * Save progress for a profile with automatic history snapshotting and auto-sync broadcast
 */
let saveTimeout = null
export function saveProfileProgress(profileId, progressData) {
  const safeId = profileId || GUEST_PROFILE_ID
  const key = getProfileStorageKey(safeId)
  try {
    // Immediate save into user's isolated store
    localStorage.setItem(key, JSON.stringify(progressData))

    // Debounced snapshot history
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      saveProgressSnapshot(safeId, progressData)
    }, 1500)

    // Notify listeners of auto-save completion
    window.dispatchEvent(new CustomEvent('secloudive-autosave-complete', {
      detail: {
        profileId: safeId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    }))

    return true
  } catch (err) {
    console.error(`[UserSyncManager] Error saving progress for ${safeId}:`, err)
    return false
  }
}

/**
 * Save a periodic rolling snapshot (keeps last 5 snapshots)
 */
function saveProgressSnapshot(profileId, data) {
  try {
    const historyKey = `secloudive_user_${profileId}_history`
    const rawHistory = localStorage.getItem(historyKey)
    let history = rawHistory ? JSON.parse(rawHistory) : []
    if (!Array.isArray(history)) history = []

    history.unshift({
      timestamp: new Date().toISOString(),
      summary: {
        completedCount: Object.keys(data.completed || {}).length,
        learningCount: (data.learningTopicsCompleted || []).length,
        labStepsCount: Object.values(data.labSteps || {}).reduce((s, a) => s + (a?.length || 0), 0)
      }
    })

    history = history.slice(0, 5)
    localStorage.setItem(historyKey, JSON.stringify(history))
  } catch {
    // Non-critical if storage is tight
  }
}

/**
 * Blank progress schema
 */
export function getBlankProgress() {
  return {
    answers: {},
    completed: {},
    architectureScores: {},
    simulatorScores: {},
    investigationScores: {},
    investigationAssessments: {},
    labSteps: {},
    learningTopicsCompleted: [],
    learningBookmarkedTopics: [],
    learningQuizScores: {},
    topicCheckAnswers: {},
    targetCareerRole: 'Cloud Security Engineer',
    quizAttemptsHistory: {},
    capstoneMissionSteps: {},
    battleRoomsSolved: {},
    rampupLabsCompleted: {},
    cloudProjectsCompleted: {},
    cloudProjectsTeardown: {},
    playbooksExecuted: {},
    radarThreatsContained: {},
    interviewAttempts: {},
    downloadedPacks: []
  }
}

/**
 * Export complete user profile package as JSON
 */
export function exportUserProfilePackage(profileId) {
  const profile = getAllProfiles().find(p => p.id === profileId) || getActiveProfile()
  const progress = loadProfileProgress(profile.id)
  const chatKey = `secloudive_user_${profile.id}_chat_v2`
  const chatHistory = localStorage.getItem(chatKey) || localStorage.getItem('secloudive_ai_chat_history_v2') || '[]'

  let parsedChat = []
  try { parsedChat = JSON.parse(chatHistory) } catch { /* ignore */ }

  const exportPayload = {
    secloudiveVersion: '3.0.0-integrity',
    exportedAt: new Date().toISOString(),
    organization: 'NAEN Studios',
    support: 'naenstudios@gmail.com',
    simulatedDataDisclaimer: 'SIMULATED - not a real AWS event. Generated for local educational & verification audit purposes only.',
    simulatedIdentifiersNotice: 'All account numbers (000000000000), ARNs (arn:aws:simulated:...) and event IDs are synthetic non-operational identifiers.',
    profile: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatarColor: profile.avatarColor,
      isGuest: Boolean(profile.isGuest)
    },
    progress,
    chatHistory: parsedChat
  }

  return exportPayload
}

/**
 * Download profile export as an integrity-checked JSON file
 */
export async function triggerExportDownload(profileId) {
  const rawData = exportUserProfilePackage(profileId)
  const enveloped = await createIntegrityEnvelope(rawData, 'user_profile_package')
  const blob = new Blob([JSON.stringify(enveloped, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const safeName = (rawData.profile.id || 'user').replace(/[^a-z0-9]/gi, '_').toLowerCase()
  a.href = url
  a.download = `secloudive_profile_backup_${safeName}_${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return enveloped
}

/**
 * Import profile package from JSON object
 */
export function importUserProfilePackage(rawPayload) {
  try {
    const payload = (rawPayload && rawPayload.integrityEnvelope && rawPayload.payload)
      ? rawPayload.payload
      : rawPayload

    if (!payload || !payload.profile || !payload.progress) {
      return { success: false, message: 'Invalid SeCloudive backup package format.' }
    }

    const profiles = getAllProfiles()
    let targetId = payload.profile.id

    // Ensure not guest
    if (!targetId || targetId === GUEST_PROFILE_ID) {
      targetId = generateUniqueUserId()
    }

    // If ID already exists for someone else on this device, append imported timestamp
    if (profiles.some(p => p.id.toLowerCase() === targetId.toLowerCase())) {
      targetId = `${targetId}_imported_${Date.now().toString(36)}`
    }

    const profileObj = {
      ...payload.profile,
      id: targetId,
      isGuest: false,
      lastActive: new Date().toISOString()
    }

    profiles.push(profileObj)
    localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(profiles))

    // Save isolated progress
    saveProfileProgress(targetId, payload.progress)

    // Save chat history if available
    if (Array.isArray(payload.chatHistory) && payload.chatHistory.length > 0) {
      localStorage.setItem(`secloudive_user_${targetId}_chat_v2`, JSON.stringify(payload.chatHistory))
    }

    // Switch to imported profile
    setActiveProfile(targetId)

    return { success: true, profile: profileObj }
  } catch (err) {
    console.error('[UserSyncManager] Import failed:', err)
    return { success: false, message: err.message }
  }
}

/**
 * Generate portable Base64 sync token
 */
export function generateSyncToken(profileId) {
  try {
    const pkg = exportUserProfilePackage(profileId)
    const compact = {
      p: pkg.profile,
      pr: pkg.progress,
      t: Date.now()
    }
    const jsonStr = JSON.stringify(compact)
    return btoa(encodeURIComponent(jsonStr))
  } catch (err) {
    console.error('[UserSyncManager] Sync token generation failed:', err)
    return null
  }
}

/**
 * Restore from portable Base64 sync token
 */
export function restoreFromSyncToken(tokenStr) {
  try {
    const decoded = decodeURIComponent(atob(tokenStr.trim()))
    const compact = JSON.parse(decoded)
    if (!compact.p || !compact.pr) {
      return { success: false, message: 'Invalid sync token format.' }
    }
    const fullPkg = {
      secloudiveVersion: '3.0.0',
      exportedAt: new Date().toISOString(),
      profile: compact.p,
      progress: compact.pr,
      chatHistory: []
    }
    return importUserProfilePackage(fullPkg)
  } catch (err) {
    return { success: false, message: 'Failed to decode sync token: ' + err.message }
  }
}

export const userSyncManager = {
  validateUserIdFormat,
  isUserIdAvailable,
  generateUniqueUserId,
  getAllProfiles,
  getActiveProfile,
  setActiveProfile,
  switchToGuestMode,
  registerUniqueProfile,
  loginWithUserId,
  loginWithUserIdAsync,
  deleteProfile,
  updateProfile,
  getProfileStorageKey,
  loadProfileProgress,
  saveProfileProgress,
  getBlankProgress,
  exportUserProfilePackage,
  importUserProfilePackage,
  generateSyncToken,
  restoreFromSyncToken,
  parseGoogleCredential,
  deterministicGoogleUserId,
  findProfileByGoogleAccount,
  signInWithGoogleAccount,
  linkGoogleAccountToProfile
}

export default userSyncManager


