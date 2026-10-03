/**
 * AuthContext — SeCLOUDIVE / NAEN Studios
 * ==========================================
 * Universal Multi-Method Authentication & Identity Engine:
 *  1. Google OAuth 2.0 (GIS with Supabase signInWithIdToken + graceful local fallback)
 *  2. Direct Google Account Sign-In (for private windows or popup-restricted browsers)
 *  3. Email & Password Authentication (Supabase Auth)
 *  4. Magic Link Passwordless Sign-In (Supabase OTP)
 *  5. Unique User ID Authentication (Instant local & cloud lookup)
 *  6. Fast Guest Sandbox Mode (Non-destructive exploratory session)
 *
 * Resilience Guarantee:
 *  - If Supabase cloud is unreachable or unconfigured, all auth gracefully
 *    falls back to local isolated storage without throwing or crashing.
 *  - Every Google sign-in strictly maps to a single deterministic User ID.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  upsertUserProfile,
  loadFullUserData,
  saveUserSettings,
} from '../services/supabaseProgressService'

// Legacy localStorage auth & userSyncManager
import {
  handleGoogleSignIn   as legacyGoogleSignIn,
  handleGoogleSignOut  as legacyGoogleSignOut,
  loadGoogleSession    as legacyLoadSession,
  getGoogleProfile     as legacyGetProfile,
  decodeGoogleCredential
} from '../services/googleAuthService'
import {
  ACTIVE_PROFILE_KEY,
  GUEST_PROFILE,
  getActiveProfile,
  getAllProfiles,
  signInWithGoogleAccount,
  loginWithUserIdAsync,
  switchToGuestMode as managerSwitchToGuest,
  registerUniqueProfile as managerRegisterProfile
} from '../services/userSyncManager'

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null)   // Active user object
  const [profile,     setProfile]       = useState(() => getActiveProfile()) // Active profile
  const [supabaseData, setSupabaseData] = useState(null)   // Hydrated cloud data
  const [isSignedIn,  setIsSignedIn]    = useState(() => {
    const p = getActiveProfile()
    return Boolean(p && !p.isGuest && p.id !== 'guest')
  })
  const [loading,     setLoading]       = useState(true)
  const [authError,   setAuthError]     = useState(null)

  // ── Sync with userSyncManager events ────────────────────────────────────────
  useEffect(() => {
    const handleUserSwitched = (e) => {
      const active = e.detail?.profile || getActiveProfile()
      setProfile(active)
      if (active && !active.isGuest && active.id !== 'guest') {
        setIsSignedIn(true)
        if (!currentUser) {
          setCurrentUser({
            id: active.id,
            email: active.email || '',
            name: active.name || active.id,
            picture: active.avatarUrl || null,
            user_metadata: {
              full_name: active.name,
              avatar_url: active.avatarUrl
            }
          })
        }
      } else {
        setIsSignedIn(false)
        setCurrentUser(null)
      }
    }

    window.addEventListener('secloudive-user-switched', handleUserSwitched)
    return () => window.removeEventListener('secloudive-user-switched', handleUserSwitched)
  }, [currentUser])

  // ── Supabase Auth Listener / Session Restore ─────────────────────────────────
  useEffect(() => {
    let subscription = null

    if (isSupabaseConfigured && supabase) {
      // 1. Listen for Supabase auth state changes
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            await _handleSupabaseSession(session.user)
          } else {
            // Only clear user if no local profile is actively signed in
            const local = getActiveProfile()
            if (!local || local.isGuest || local.id === 'guest') {
              _clearUser()
            }
          }
          setLoading(false)
        }
      )
      subscription = data?.subscription

      // 2. Initial session check on mount
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          _handleSupabaseSession(session.user)
        } else {
          _restoreLocalSession()
        }
      }).catch(() => {
        _restoreLocalSession()
      })
    } else {
      _restoreLocalSession()
    }

    return () => {
      subscription?.unsubscribe?.()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle a valid Supabase session ──────────────────────────────────────────
  async function _handleSupabaseSession(user) {
    setCurrentUser(user)
    setIsSignedIn(true)

    const userEmail = user.email || ''
    const userName  = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner'
    const userPic   = user.user_metadata?.avatar_url || null

    // Sync with userSyncManager
    const syncRes = signInWithGoogleAccount({
      sub: user.id,
      email: userEmail,
      name: userName,
      picture: userPic
    }, { migrateGuestData: false })

    if (syncRes.success) {
      setProfile(syncRes.profile)
    }

    // Upsert the profile row in Supabase database
    try {
      await upsertUserProfile({
        id:      syncRes.profile?.id || user.id,
        email:   userEmail,
        name:    userName,
        picture: userPic,
      })
    } catch {}

    // Load full user data from Supabase
    try {
      const data = await loadFullUserData(syncRes.profile?.id || user.id)
      if (data) {
        setSupabaseData({
          settings:     data.settings     ?? null,
          progress:     data.progress     ?? null,
          progressMeta: data.progressMeta ?? null,
          chatMessages: data.chatMessages ?? [],
        })
      }
    } catch {}
    setLoading(false)
  }

  // ── Restore from localStorage (fallback & offline persistence) ───────────────
  function _restoreLocalSession() {
    try {
      const active = getActiveProfile()
      if (active && !active.isGuest && active.id !== 'guest') {
        setProfile(active)
        setIsSignedIn(true)
        setCurrentUser({
          id: active.id,
          email: active.email || '',
          name: active.name || active.id,
          picture: active.avatarUrl || null,
          user_metadata: {
            full_name: active.name,
            avatar_url: active.avatarUrl
          }
        })
      } else {
        const session = legacyLoadSession()
        if (session?.sub) {
          const googleProfile = legacyGetProfile(session.sub)
          if (googleProfile) {
            setCurrentUser(session)
            setProfile(googleProfile)
            setIsSignedIn(true)
          }
        }
      }
    } catch (e) {
      console.warn('[AuthContext] Local session restore failed:', e)
    } finally {
      setLoading(false)
    }
  }

  // ── Clear user state ────────────────────────────────────────────────────────
  function _clearUser() {
    setCurrentUser(null)
    setProfile(GUEST_PROFILE)
    setSupabaseData(null)
    setIsSignedIn(false)
    setAuthError(null)
  }

  // ─── METHOD 1: Google OAuth Sign In (with resilient local fallback) ──────────
  const signInWithGoogle = useCallback(async (credential) => {
    setLoading(true)
    setAuthError(null)

    // Decode Google JWT credential
    let googleUser = null
    try {
      googleUser = decodeGoogleCredential(credential)
    } catch {}

    // If Supabase is configured, try Supabase signInWithIdToken
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: credential,
        })
        if (!error && data?.user) {
          await _handleSupabaseSession(data.user)
          setLoading(false)
          return { success: true, method: 'supabase_google' }
        }
        if (error) {
          console.warn('[AuthContext] Supabase signInWithIdToken notice, falling back to local sync:', error.message)
        }
      } catch (err) {
        console.warn('[AuthContext] Supabase handshake notice:', err)
      }
    }

    // Resilient fallback: decode and sync directly via userSyncManager
    if (googleUser && (googleUser.sub || googleUser.email)) {
      const syncRes = signInWithGoogleAccount(googleUser)
      if (syncRes.success) {
        setCurrentUser(googleUser)
        setProfile(syncRes.profile)
        setIsSignedIn(true)

        // Try direct Supabase DB upsert in background
        if (isSupabaseConfigured) {
          upsertUserProfile({
            id: syncRes.profile.id,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture
          }).catch(() => {})
        }

        setLoading(false)
        return { success: true, profile: syncRes.profile, method: 'local_google_sync' }
      }
    }

    // Legacy fallback
    const legacyRes = legacyGoogleSignIn(credential)
    if (legacyRes.success) {
      setCurrentUser(legacyRes.googleUser)
      setProfile(legacyRes.profile)
      setIsSignedIn(true)
      setLoading(false)
      return { success: true, profile: legacyRes.profile, method: 'legacy_google' }
    }

    setAuthError('Google sign-in could not be completed.')
    setLoading(false)
    return { success: false, error: 'Google sign-in failed.' }
  }, [])

  // ─── METHOD 2: Direct Google Data Sign In (Sandbox / Fallback) ───────────────
  const signInWithDirectGoogleData = useCallback((googleData, options = {}) => {
    setAuthError(null)
    const syncRes = signInWithGoogleAccount(googleData, options)
    if (syncRes.success) {
      setCurrentUser(googleData)
      setProfile(syncRes.profile)
      setIsSignedIn(true)

      if (isSupabaseConfigured) {
        upsertUserProfile({
          id: syncRes.profile.id,
          email: googleData.email || '',
          name: googleData.name || syncRes.profile.name,
          picture: googleData.picture || null
        }).catch(() => {})
      }

      return syncRes
    }
    setAuthError(syncRes.error || 'Failed to authenticate Google user data.')
    return syncRes
  }, [])

  // ─── METHOD 3: Supabase Email & Password Sign In ─────────────────────────────
  const signInWithEmail = useCallback(async (email, password) => {
    setLoading(true)
    setAuthError(null)

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })

        if (error) {
          setAuthError(error.message)
          setLoading(false)
          return { success: false, error: error.message }
        }

        if (data?.user) {
          await _handleSupabaseSession(data.user)
          setLoading(false)
          return { success: true, user: data.user }
        }
      } catch (err) {
        setAuthError(err.message)
        setLoading(false)
        return { success: false, error: err.message }
      }
    }

    // Local registry check if offline/unconfigured
    const profiles = getAllProfiles()
    const found = profiles.find(p => p.email && p.email.toLowerCase() === email.trim().toLowerCase())
    if (found) {
      setProfile(found)
      setCurrentUser({ id: found.id, email: found.email, name: found.name })
      setIsSignedIn(true)
      setLoading(false)
      return { success: true, profile: found }
    }

    setLoading(false)
    setAuthError('Email authentication requires a configured Supabase backend or previously registered profile.')
    return { success: false, error: 'Account not found in local registry.' }
  }, [])

  // ─── METHOD 4: Supabase Email Sign Up ────────────────────────────────────────
  const signUpWithEmail = useCallback(async (email, password, { name = '', role = 'Cloud Security Engineer' } = {}) => {
    setLoading(true)
    setAuthError(null)

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim() || email.split('@')[0],
              role
            }
          }
        })

        if (error) {
          setAuthError(error.message)
          setLoading(false)
          return { success: false, error: error.message }
        }

        if (data?.user) {
          // If session returned immediately (confirm email disabled), handle session
          if (data.session) {
            await _handleSupabaseSession(data.user)
          } else {
            // Registered, email confirmation pending
            const regRes = managerRegisterProfile({
              userId: `SEC-${email.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-${Math.floor(1000 + Math.random() * 9000)}`,
              name: name.trim() || email.split('@')[0],
              email: email.trim(),
              role
            })
            if (regRes.success) {
              setProfile(regRes.profile)
              setIsSignedIn(true)
            }
          }
          setLoading(false)
          return {
            success: true,
            user: data.user,
            needsEmailConfirmation: !data.session,
            message: data.session ? 'Sign up successful!' : 'Account registered! Please check your email to confirm.'
          }
        }
      } catch (err) {
        setAuthError(err.message)
        setLoading(false)
        return { success: false, error: err.message }
      }
    }

    // Local-only registration if Supabase is unconfigured
    const regRes = managerRegisterProfile({
      userId: `SEC-${email.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role
    })

    setLoading(false)
    if (regRes.success) {
      setProfile(regRes.profile)
      setIsSignedIn(true)
      return { success: true, profile: regRes.profile }
    }
    setAuthError(regRes.error)
    return { success: false, error: regRes.error }
  }, [])

  // ─── METHOD 5: Passwordless Magic Link Sign In ───────────────────────────────
  const signInWithMagicLink = useCallback(async (email) => {
    setAuthError(null)
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Magic link sign-in requires an active Supabase cloud connection.' }
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin
        }
      })
      if (error) {
        setAuthError(error.message)
        return { success: false, error: error.message }
      }
      return { success: true, message: `Magic sign-in link sent to ${email}! Check your inbox.` }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  // ─── METHOD 6: Unique User ID Sign In ────────────────────────────────────────
  const loginWithUserId = useCallback(async (rawId) => {
    setAuthError(null)
    const res = await loginWithUserIdAsync(rawId)
    if (res.success) {
      setProfile(res.profile)
      setIsSignedIn(true)
      setCurrentUser({
        id: res.profile.id,
        name: res.profile.name,
        email: res.profile.email || '',
        picture: res.profile.avatarUrl || null
      })
      return res
    }
    setAuthError(res.error)
    return res
  }, [])

  // ─── Sign Out / Switch to Guest Mode ─────────────────────────────────────────
  const signOut = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try { await supabase.auth.signOut() } catch {}
    }
    legacyGoogleSignOut()
    managerSwitchToGuest()
    _clearUser()
  }, [])

  // ─── Helper: save settings to Supabase ───────────────────────────────────────
  const saveSettings = useCallback(async (settingsPartial) => {
    if (isSupabaseConfigured && profile?.id) {
      await saveUserSettings(profile.id, settingsPartial)
    }
  }, [profile])

  // ─── Derived values ──────────────────────────────────────────────────────────
  const supabaseUserId = isSupabaseConfigured ? (currentUser?.id ?? profile?.id ?? null) : null

  const value = {
    // Auth state
    currentUser,
    profile,
    isSignedIn,
    loading,
    authError,

    // Supabase data loaded on sign-in
    supabaseData,
    supabaseUserId,
    isSupabaseMode: isSupabaseConfigured,

    // Unified Authentication Methods
    signIn: signInWithGoogle,                // Alias for backwards compatibility
    signInWithGoogle,
    signInWithDirectGoogleData,
    signInWithEmail,
    signUpWithEmail,
    signInWithMagicLink,
    loginWithUserId,
    signOut,
    saveSettings,

    // Shorthand getters
    profileId:   profile?.id || 'guest',
    displayName: profile?.name || currentUser?.user_metadata?.full_name || currentUser?.name || 'Guest Learner',
    avatar:      profile?.avatarUrl || currentUser?.user_metadata?.avatar_url || currentUser?.picture || null,
    email:       profile?.email || currentUser?.email || null,
    isGuest:     Boolean(profile?.isGuest || profile?.id === 'guest' || !isSignedIn)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

export default AuthContext
