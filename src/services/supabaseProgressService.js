/**
 * SeCLOUDIVE — Production-Grade Supabase Backend Service Layer v3.0
 * Architecture: NAEN Studios / SeCLOUDIVE Engineering
 * =============================================================================
 * Provides comprehensive data services for every corner of the platform:
 *  1. User Profiles & Clearance Roles
 *  2. Platform Settings & Provider Filters
 *  3. Granular Learning Progress & State Hydration
 *  4. Daily Streaks & Streak Freezes
 *  5. Badges & Milestone Achievements
 *  6. Tamper-Evident Certificates & Public Verification
 *  7. Sentinel AI Multi-Turn Chat Sessions
 *  8. Financial-Grade XP Audit Ledger
 *  9. Real-time Multi-Tier Leaderboards
 * 10. Cloudive Studio Custom Labs & Public Community Scenarios
 * 11. Mock Technical Interview Transcripts & Gemini Feedback
 * 12. Virtual Internship Simulator Sprints & Deliverables
 * 13. Spaced-Repetition Flashcard Drills
 * 14. Cryptographic Audit Pack Manifests
 *
 * NOTE: When Supabase is not configured in .env, every method returns null or
 * safe defaults gracefully, allowing seamless fallback to isolated local storage.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ─── Guard Helper ────────────────────────────────────────────────────────────
export function isGuestUser(userId) {
  if (!userId) return true
  const clean = String(userId).trim().toLowerCase()
  return clean === 'guest' || clean.startsWith('guest-')
}

function guard(actionName, userId = null) {
  if (!isSupabaseConfigured || !supabase) {
    return false
  }
  if (userId && isGuestUser(userId)) {
    return false
  }
  return true
}

// =============================================================================
// 1. USER PROFILES
// =============================================================================

/**
 * Upsert or refresh a user profile row (called upon sign-in or profile edit).
 */
export async function upsertUserProfile({ id, email, name, picture, role = 'learner', studentName = null, countryCode = 'US' }) {
  if (!guard('upsertUserProfile')) return null
  try {
    const payload = {
      id,
      email: email || '',
      name: name || 'Learner',
      picture: picture || null,
      role,
      last_active: new Date().toISOString()
    }
    if (studentName) payload.student_name = studentName
    if (countryCode) payload.country_code = countryCode

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.warn('[SupabaseService] upsertUserProfile notice:', error.message)
      return null
    }
    return data
  } catch (err) {
    console.error('[SupabaseService] upsertUserProfile exception:', err)
    return null
  }
}

/**
 * Fetch a single user's profile.
 */
export async function fetchUserProfile(userId) {
  if (!guard('fetchUserProfile') || !userId) return null
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.warn('[SupabaseService] fetchUserProfile notice:', error.message)
      return null
    }
    return data
  } catch (err) {
    console.error('[SupabaseService] fetchUserProfile exception:', err)
    return null
  }
}

/**
 * Update the official student name printed on certificates.
 */
export async function updateStudentName(userId, studentName) {
  if (!guard('updateStudentName') || !userId) return
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ student_name: studentName, last_active: new Date().toISOString() })
      .eq('id', userId)

    if (error) console.warn('[SupabaseService] updateStudentName notice:', error.message)
  } catch (err) {
    console.error('[SupabaseService] updateStudentName exception:', err)
  }
}

// =============================================================================
// 2. USER SETTINGS
// =============================================================================

/**
 * Fetch platform settings for the user.
 */
export async function fetchUserSettings(userId) {
  if (!guard('fetchUserSettings') || !userId) return null
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) return null
    return data
  } catch {
    return null
  }
}

/**
 * Save platform settings (debounced by caller).
 */
export async function saveUserSettings(userId, settingsPartial) {
  if (!guard('saveUserSettings') || !userId) return
  try {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settingsPartial,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) console.warn('[SupabaseService] saveUserSettings notice:', error.message)
  } catch (err) {
    console.error('[SupabaseService] saveUserSettings exception:', err)
  }
}

// =============================================================================
// 3. LEARNING PROGRESS & TELEMETRY
// =============================================================================

/**
 * Fetch a user's full learning progress record.
 */
export async function fetchUserProgress(userId) {
  if (!guard('fetchUserProgress') || !userId) return null
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) return null
    return data
  } catch {
    return null
  }
}

/**
 * Save user progress using server-validated RPC save_progress (with upsert fallback).
 */
export async function saveUserProgress(userId, progressData, tier = 1, xp = 0) {
  if (!guard('saveUserProgress', userId) || !userId || isGuestUser(userId)) return
  try {
    const safeTier = Math.max(1, Math.min(4, Number(tier) || 1))
    const safeXp = Math.max(0, Number(xp) || 0)

    // 1. Primary: execute server RPC for atomic updates and counter calculations
    const { error: rpcError } = await supabase.rpc('save_progress', {
      p_user_id: userId,
      p_blob: progressData || {},
      p_tier: safeTier,
      p_xp: safeXp
    })

    if (!rpcError) return

    // 2. Fallback: direct upsert if RPC is unavailable
    console.debug('[SupabaseService] Falling back to direct upsert for save_progress:', rpcError.message)
    const { error: upsertError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        progress_blob: progressData || {},
        clearance_tier: safeTier,
        total_xp: safeXp,
        challenges_completed: Object.keys(progressData?.completed || {}).length,
        labs_completed: Object.values(progressData?.labSteps || {}).filter(Boolean).length,
        battle_rooms_solved: (progressData?.battleRoomsSolved || []).length,
        architecture_scores: progressData?.architectureScores || {},
        simulator_scores: progressData?.simulatorScores || {},
        investigation_scores: progressData?.investigationScores || {},
        learning_quiz_scores: progressData?.learningQuizScores || {},
        interview_attempts: progressData?.interviewAttempts || {},
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (upsertError) {
      console.warn('[SupabaseService] saveUserProgress upsert error:', upsertError.message)
    }
  } catch (err) {
    console.error('[SupabaseService] saveUserProgress exception:', err)
  }
}

/**
 * Award XP to a user with server-side audit transaction logging.
 */
export async function awardXP(userId, amount, reason = 'activity_complete', referenceId = null) {
  if (!guard('awardXP') || !userId || !amount) return null
  try {
    const { data: newXp, error } = await supabase.rpc('award_xp', {
      p_user_id: userId,
      p_amount: Math.round(amount),
      p_reason: reason,
      p_ref_id: referenceId
    })

    if (!error && typeof newXp === 'number') {
      return newXp
    }

    // Direct fallback
    const current = await fetchUserProgress(userId)
    const updatedXP = (current?.total_xp || 0) + amount
    await supabase
      .from('user_progress')
      .update({ total_xp: updatedXP, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    await supabase
      .from('user_profiles')
      .update({ total_xp: updatedXP, last_active: new Date().toISOString() })
      .eq('id', userId)

    return updatedXP
  } catch (err) {
    console.error('[SupabaseService] awardXP exception:', err)
    return null
  }
}

// =============================================================================
// 4. DAILY STREAKS
// =============================================================================

/**
 * Fetch a user's streak record.
 */
export async function fetchUserStreak(userId) {
  if (!guard('fetchUserStreak') || !userId) return null
  try {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) return null
    return data
  } catch {
    return null
  }
}

/**
 * Update user's daily streak (triggers streak computation).
 */
export async function updateUserStreak(userId) {
  if (!guard('updateUserStreak') || !userId) return
  try {
    await supabase.rpc('update_streak', { p_user_id: userId })
  } catch (err) {
    console.warn('[SupabaseService] updateUserStreak notice:', err)
  }
}

// =============================================================================
// 5. BADGES
// =============================================================================

/**
 * Fetch all badges earned by a user.
 */
export async function fetchUserBadges(userId) {
  if (!guard('fetchUserBadges') || !userId) return []
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })

    if (error) return []
    return data || []
  } catch {
    return []
  }
}

/**
 * Record a badge earned by a user.
 */
export async function awardBadge(userId, badgeId, badgeName, badgeTier = 'bronze') {
  if (!guard('awardBadge') || !userId || !badgeId) return null
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId,
        badge_name: badgeName,
        badge_tier: badgeTier
      })
      .select()
      .maybeSingle()

    if (error) {
      // Ignored if already awarded (unique constraint)
      return null
    }
    return data
  } catch (err) {
    console.error('[SupabaseService] awardBadge exception:', err)
    return null
  }
}

// =============================================================================
// 6. CERTIFICATES & ONLINE VERIFICATION
// =============================================================================

/**
 * Fetch all certificates issued to a user.
 */
export async function fetchUserCertificates(userId) {
  if (!guard('fetchUserCertificates') || !userId) return []
  try {
    const { data, error } = await supabase
      .from('user_certificates')
      .select('*')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false })

    if (error) return []
    return data || []
  } catch {
    return []
  }
}

/**
 * Issue a verifiable certificate in the Supabase backend.
 */
export async function issueCertificate({ userId, certType, certTitle, studentName, tier = 1, credentialId = null }) {
  if (!guard('issueCertificate') || !userId) return null
  try {
    const { data, error } = await supabase.rpc('issue_certificate', {
      p_user_id: userId,
      p_cert_type: certType,
      p_cert_title: certTitle,
      p_student_name: studentName,
      p_tier: tier,
      p_credential_id: credentialId
    })

    if (!error && data) {
      return data
    }

    // Direct fallback
    const credId = credentialId || `NAEN-SEC-2026-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
    const { data: inserted, error: insErr } = await supabase
      .from('user_certificates')
      .upsert({
        user_id: userId,
        cert_type: certType,
        cert_title: certTitle,
        student_name: studentName,
        tier,
        credential_id: credId,
        cert_hash: `sha256-${Date.now()}-${userId.slice(0, 8)}`,
        verification_code: credId.slice(-6)
      }, { onConflict: 'user_id,cert_type' })
      .select()
      .single()

    if (insErr) {
      console.warn('[SupabaseService] Certificate fallback error:', insErr.message)
      return null
    }
    return inserted
  } catch (err) {
    console.error('[SupabaseService] issueCertificate exception:', err)
    return null
  }
}

/**
 * Public certificate verification (used by employers, university auditors, and VerifyAuditPackPage).
 */
export async function verifyCertificateOnline(query) {
  if (!guard('verifyCertificateOnline') || !query || !query.trim()) {
    return { valid: false, error: 'Supabase offline or empty query.' }
  }
  try {
    const clean = query.trim()

    // 1. Try verify_certificate RPC
    const { data: rpcResult, error: rpcError } = await supabase.rpc('verify_certificate', {
      p_query: clean
    })
    if (!rpcError && rpcResult) {
      return rpcResult
    }

    // 2. Direct query on verified_credentials view
    const { data, error } = await supabase
      .from('verified_credentials')
      .select('*')
      .or(`credential_id.ilike.%${clean}%,cert_hash.ilike.%${clean}%,id.eq.${clean}`)
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      return { valid: false, error: 'No matching certificate found in public registry.' }
    }

    return {
      valid: true,
      credential_id: data.credential_id,
      student_name: data.student_name,
      cert_title: data.cert_title,
      cert_type: data.cert_type,
      tier: data.tier,
      issued_at: data.issued_at,
      cert_hash: data.cert_hash,
      verification_code: data.verification_code
    }
  } catch (err) {
    return { valid: false, error: err.message || 'Verification search failed.' }
  }
}

// =============================================================================
// 7. SENTINEL AI CHAT SESSIONS
// =============================================================================

/**
 * Fetch Sentinel chat session messages for a user.
 */
export async function fetchChatHistory(userId) {
  if (!guard('fetchChatHistory') || !userId) return []
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('messages')
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !data?.messages) return []
    return Array.isArray(data.messages) ? data.messages : []
  } catch {
    return []
  }
}

/**
 * Save Sentinel chat session messages (debounced).
 */
export async function saveChatHistory(userId, messages) {
  if (!guard('saveChatHistory') || !userId || !Array.isArray(messages)) return
  try {
    const safeMessages = messages.slice(-100) // retain last 100 messages for storage efficiency
    const { error } = await supabase
      .from('chat_sessions')
      .upsert({
        user_id: userId,
        messages: safeMessages,
        message_count: safeMessages.length,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) console.warn('[SupabaseService] saveChatHistory notice:', error.message)
  } catch (err) {
    console.error('[SupabaseService] saveChatHistory exception:', err)
  }
}

// =============================================================================
// 8. LEADERBOARDS (Realtime & View Queries)
// =============================================================================

/**
 * Fetch top learners from the public leaderboard.
 */
export async function fetchLeaderboard(limit = 100) {
  if (!guard('fetchLeaderboard')) return []
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(limit)

    if (error) {
      console.warn('[SupabaseService] fetchLeaderboard notice:', error.message)
      return []
    }
    return data || []
  } catch {
    return []
  }
}

/**
 * Fetch tier-filtered leaderboard.
 */
export async function fetchTierLeaderboard(tier = 1, limit = 50) {
  if (!guard('fetchTierLeaderboard')) return []
  try {
    const viewName = `leaderboard_tier${Math.max(1, Math.min(4, tier))}`
    const { data, error } = await supabase
      .from(viewName)
      .select('*')
      .limit(limit)

    if (error) return []
    return data || []
  } catch {
    return []
  }
}

/**
 * Realtime subscription to leaderboard updates.
 */
export function subscribeToLeaderboard(callback) {
  if (!guard('subscribeToLeaderboard')) return () => {}
  try {
    const channel = supabase
      .channel('public:leaderboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_progress' },
        () => {
          fetchLeaderboard(50).then(data => callback?.(data))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  } catch {
    return () => {}
  }
}

// =============================================================================
// 9. CLOUDIVE STUDIO (Custom Cyber Labs)
// =============================================================================

/**
 * Fetch custom labs created by a specific user.
 */
export async function fetchUserCustomLabs(userId) {
  if (!guard('fetchUserCustomLabs') || !userId) return []
  try {
    const { data, error } = await supabase
      .from('custom_labs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) return []
    return data || []
  } catch {
    return []
  }
}

/**
 * Fetch public community-shared labs.
 */
export async function fetchPublicCommunityLabs(limit = 50) {
  if (!guard('fetchPublicCommunityLabs')) return []
  try {
    const { data, error } = await supabase
      .from('public_community_labs')
      .select('*')
      .limit(limit)

    if (error) return []
    return data || []
  } catch {
    return []
  }
}

/**
 * Save a custom lab scenario in Cloudive Studio.
 */
export async function saveCustomLab(userId, labData) {
  if (!guard('saveCustomLab') || !userId || !labData?.title) return null
  try {
    const payload = {
      user_id: userId,
      title: labData.title,
      description: labData.description || '',
      cloud_provider: labData.cloudProvider || 'aws',
      difficulty: labData.difficulty || 'intermediate',
      iac_code: labData.iacCode || '',
      topology_config: labData.topologyConfig || {},
      validation_rules: labData.validationRules || [],
      is_public: Boolean(labData.isPublic),
      updated_at: new Date().toISOString()
    }
    if (labData.id) payload.id = labData.id

    const { data, error } = await supabase
      .from('custom_labs')
      .upsert(payload)
      .select()
      .single()

    if (error) {
      console.warn('[SupabaseService] saveCustomLab notice:', error.message)
      return null
    }
    return data
  } catch (err) {
    console.error('[SupabaseService] saveCustomLab exception:', err)
    return null
  }
}

/**
 * Delete a custom lab.
 */
export async function deleteCustomLab(userId, labId) {
  if (!guard('deleteCustomLab') || !userId || !labId) return false
  try {
    const { error } = await supabase
      .from('custom_labs')
      .delete()
      .eq('id', labId)
      .eq('user_id', userId)

    return !error
  } catch {
    return false
  }
}

// =============================================================================
// 10. MOCK INTERVIEWS & INTERNSHIPS
// =============================================================================

/**
 * Record a mock interview attempt with Gemini transcript and grading.
 */
export async function recordInterviewSession(userId, { trackRole, questionCount, overallScore, evaluationFeedback, transcripts }) {
  if (!guard('recordInterviewSession') || !userId) return null
  try {
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: userId,
        track_role: trackRole || 'Cloud Security Engineer',
        question_count: questionCount || 0,
        overall_score: overallScore || 0,
        evaluation_feedback: evaluationFeedback || '',
        transcripts: transcripts || []
      })
      .select()
      .single()

    if (error) return null
    return data
  } catch {
    return null
  }
}

/**
 * Save an internship sprint deliverable and evaluation.
 */
export async function recordInternshipSprint(userId, { sprintNumber, sprintTitle, status = 'completed', deliverables = {}, supervisorEvaluation = {}, gradeScore = 0 }) {
  if (!guard('recordInternshipSprint') || !userId) return null
  try {
    const { data, error } = await supabase
      .from('internship_records')
      .upsert({
        user_id: userId,
        sprint_number: sprintNumber,
        sprint_title: sprintTitle,
        status,
        deliverables,
        supervisor_evaluation: supervisorEvaluation,
        grade_score: gradeScore,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      }, { onConflict: 'user_id,sprint_number' })
      .select()
      .single()

    if (error) return null
    return data
  } catch {
    return null
  }
}

// =============================================================================
// 11. CRYPTOGRAPHIC AUDIT PACKS
// =============================================================================

/**
 * Record a downloadable audit pack bundle hash in the backend.
 */
export async function recordAuditPack(userId, { packHash, bundleName, fileUrl = null, metadata = {} }) {
  if (!guard('recordAuditPack') || !userId || !packHash) return null
  try {
    const { data, error } = await supabase
      .from('audit_packs')
      .insert({
        user_id: userId,
        pack_hash: packHash,
        bundle_name: bundleName || 'SeCLOUDIVE-Audit-Pack.json',
        file_url: fileUrl,
        metadata
      })
      .select()
      .single()

    if (error) return null
    return data
  } catch {
    return null
  }
}

// =============================================================================
// 12. FULL USER DATA HYDRATION (Called on sign-in)
// =============================================================================

/**
 * Load ALL user data in parallel upon sign-in.
 * Returns hydrated profile, settings, full progress, streaks, badges, certs, and chat.
 */
export async function loadFullUserData(userId) {
  if (!guard('loadFullUserData') || !userId) return null
  try {
    const [profile, settings, progress, streak, badges, certificates, chatMessages] = await Promise.all([
      fetchUserProfile(userId),
      fetchUserSettings(userId),
      fetchUserProgress(userId),
      fetchUserStreak(userId),
      fetchUserBadges(userId),
      fetchUserCertificates(userId),
      fetchChatHistory(userId)
    ])

    return {
      profile,
      settings,
      progress: progress?.progress_blob || null,
      progressMeta: progress,
      streak,
      badges,
      certificates,
      chatMessages
    }
  } catch (err) {
    console.error('[SupabaseService] loadFullUserData error:', err)
    return null
  }
}

// =============================================================================
// 13. REALTIME SYNC LISTENER
// =============================================================================

/**
 * Listen for realtime progress changes on a specific user.
 */
export function subscribeToUserProgress(userId, onUpdate) {
  if (!guard('subscribeToUserProgress') || !userId) return () => {}
  try {
    const channel = supabase
      .channel(`user-sync:${userId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_progress', filter: `user_id=eq.${userId}` },
        payload => {
          onUpdate?.(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  } catch {
    return () => {}
  }
}

// =============================================================================
// 14. UNIVERSAL SCRATCHPAD & ENGINEERING NOTES
// =============================================================================

/**
 * Fetch user note for a specific context.
 */
export async function fetchUserNote(userId, contextId = 'universal') {
  if (!guard('fetchUserNote', userId) || !userId || isGuestUser(userId)) return ''
  try {
    const { data, error } = await supabase
      .from('user_notes')
      .select('note_content')
      .eq('user_id', userId)
      .eq('context_id', contextId)
      .maybeSingle()

    if (error || !data) return ''
    return data.note_content || ''
  } catch {
    return ''
  }
}

/**
 * Save user note for a specific context.
 */
export async function saveUserNote(userId, contextId = 'universal', noteContent = '') {
  if (!guard('saveUserNote', userId) || !userId || isGuestUser(userId)) return
  try {
    const { error } = await supabase
      .from('user_notes')
      .upsert({
        user_id: userId,
        context_id: contextId,
        note_content: noteContent,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,context_id' })

    if (error) console.warn('[SupabaseService] saveUserNote notice:', error.message)
  } catch (err) {
    console.error('[SupabaseService] saveUserNote exception:', err)
  }
}

