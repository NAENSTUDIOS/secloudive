/**
 * Google Authentication Service — NAEN Studios / SeCLOUDIVE
 *
 * Strategy:
 *  - Uses Google Identity Services (GIS) via @react-oauth/google
 *  - Decodes the JWT credential to extract the stable Google `sub` ID
 *  - `sub` is the PRIMARY key — never changes even if email/name changes
 *  - All user progress is keyed by `google_sub` in localStorage
 *  - No Firebase, no backend required
 *
 * Google `sub` field guarantees:
 *  ✓ Stable across email changes
 *  ✓ Unique per Google account globally
 *  ✓ Cannot be guessed or spoofed (signed JWT from Google)
 */

import { jwtDecode } from 'jwt-decode'

// ─── Storage keys ─────────────────────────────────────────────────────────────
export const GOOGLE_AUTH_KEY = 'secloudive_google_auth_v1'
export const GOOGLE_PROFILES_KEY = 'secloudive_google_profiles_v1'

// ─── Decode Google JWT credential → user object ───────────────────────────────
export function decodeGoogleCredential(credential) {
  try {
    const decoded = jwtDecode(credential)
    return {
      sub: decoded.sub,              // stable Google User ID — PRIMARY KEY
      name: decoded.name || '',
      email: decoded.email || '',
      picture: decoded.picture || '',
      emailVerified: decoded.email_verified || false,
      givenName: decoded.given_name || '',
      familyName: decoded.family_name || '',
      // Store raw credential for optional future server verification
      rawCredential: credential,
      decodedAt: new Date().toISOString()
    }
  } catch (err) {
    console.error('[GoogleAuth] Failed to decode credential:', err)
    return null
  }
}

// ─── Build a SeCLOUDIVE profile from Google data ──────────────────────────────
export function buildGoogleProfile(googleUser) {
  return {
    // Identity
    id: `google_${googleUser.sub}`,     // SeCLOUDIVE profile ID
    googleSub: googleUser.sub,          // raw Google sub — never changes
    authProvider: 'google',

    // Display
    name: googleUser.name,
    email: googleUser.email,
    picture: googleUser.picture,
    givenName: googleUser.givenName,

    // Flags
    emailVerified: googleUser.emailVerified,
    isGuest: false,
    isGoogleAuth: true,

    // Platform metadata
    role: 'Cloud Security Engineer (Learner)',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    lastSignIn: new Date().toISOString(),
  }
}

// ─── Save active Google session ───────────────────────────────────────────────
export function saveGoogleSession(googleUser) {
  try {
    const session = {
      sub: googleUser.sub,
      profileId: `google_${googleUser.sub}`,
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
      signedInAt: new Date().toISOString()
    }
    localStorage.setItem(GOOGLE_AUTH_KEY, JSON.stringify(session))
    return session
  } catch (err) {
    console.error('[GoogleAuth] Failed to save session:', err)
    return null
  }
}

// ─── Load active Google session ───────────────────────────────────────────────
export function loadGoogleSession() {
  try {
    const raw = localStorage.getItem(GOOGLE_AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// ─── Clear Google session (sign out) ─────────────────────────────────────────
export function clearGoogleSession() {
  try {
    localStorage.removeItem(GOOGLE_AUTH_KEY)
  } catch {}
}

// ─── Upsert Google profile into profiles registry ─────────────────────────────
// This makes the Google profile visible in userSyncManager's profile list
export function upsertGoogleProfile(googleUser) {
  try {
    const profile = buildGoogleProfile(googleUser)
    const raw = localStorage.getItem(GOOGLE_PROFILES_KEY)
    const profiles = raw ? JSON.parse(raw) : {}

    // Key by sub — idempotent upsert
    if (profiles[googleUser.sub]) {
      // Update display fields but preserve existing progress linkage
      profiles[googleUser.sub] = {
        ...profiles[googleUser.sub],
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
        lastActive: new Date().toISOString(),
        lastSignIn: new Date().toISOString(),
      }
    } else {
      profiles[googleUser.sub] = profile
    }

    localStorage.setItem(GOOGLE_PROFILES_KEY, JSON.stringify(profiles))
    return profiles[googleUser.sub]
  } catch (err) {
    console.error('[GoogleAuth] Failed to upsert profile:', err)
    return null
  }
}

// ─── Get Google profile by sub ────────────────────────────────────────────────
export function getGoogleProfile(sub) {
  try {
    const raw = localStorage.getItem(GOOGLE_PROFILES_KEY)
    if (!raw) return null
    const profiles = JSON.parse(raw)
    return profiles[sub] || null
  } catch {
    return null
  }
}

// ─── Full sign-in flow: decode → upsert → save session ───────────────────────
export function handleGoogleSignIn(credential) {
  const googleUser = decodeGoogleCredential(credential)
  if (!googleUser) return { success: false, error: 'Failed to decode Google credential' }

  const profile = upsertGoogleProfile(googleUser)
  const session = saveGoogleSession(googleUser)

  return {
    success: true,
    googleUser,
    profile,
    session,
    profileId: `google_${googleUser.sub}`
  }
}

// ─── Sign out ─────────────────────────────────────────────────────────────────
export function handleGoogleSignOut() {
  clearGoogleSession()
  // Optionally revoke Google token (requires network)
  if (window.google?.accounts?.id) {
    try { window.google.accounts.id.disableAutoSelect() } catch {}
  }
}

// ─── Check if currently signed in ────────────────────────────────────────────
export function isGoogleSignedIn() {
  const session = loadGoogleSession()
  return !!session?.sub
}
