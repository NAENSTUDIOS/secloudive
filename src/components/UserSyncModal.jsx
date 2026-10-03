import { useState, useEffect, useRef } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import {
  Fingerprint,
  ShieldCheck,
  Zap,
  Cloud,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
  Globe,
  Lock,
  Key,
  Download,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Laptop,
  Smartphone,
  Shield,
  UserCheck,
  UserPlus
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { useAuth } from '../context/AuthContext'
import SeCloudiveLogo from './SeCloudiveLogo'
import {
  generateSyncToken,
  restoreFromSyncToken,
  isUserIdAvailable,
  validateUserIdFormat,
  generateUniqueUserId,
  parseGoogleCredential,
  deterministicGoogleUserId
} from '../services/userSyncManager'
import {
  isPasskeySupported,
  registerPasskey,
  authenticatePasskey,
  hasPasskeyForUser,
  getEnrolledPasskeys
} from '../services/passkeyAuthService'
import { checkSupabaseHealth, isSupabaseConfigured } from '../lib/supabase'

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  )
}

export default function UserSyncModal() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Status feedback
  const [actionSuccess, setActionSuccess] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState(null)
  const [ambientSyncStatus, setAmbientSyncStatus] = useState(null)

  // Passkey enrollment state
  const [hasPasskeyEnrolled, setHasPasskeyEnrolled] = useState(false)
  const [isPasskeyEnrolling, setIsPasskeyEnrolling] = useState(false)

  // Student ID Input
  const [studentIdInput, setStudentIdInput] = useState('')
  const [suggestClaimId, setSuggestClaimId] = useState(null)
  const [copiedIdNotice, setCopiedIdNotice] = useState(false)

  // Direct Google Account Fallback
  const [showDirectGoogle, setShowDirectGoogle] = useState(false)
  const [directGoogleEmail, setDirectGoogleEmail] = useState('')

  // Vault Tools (Collapsible Drawer for power users)
  const [showVaultDrawer, setShowVaultDrawer] = useState(false)
  const [generatedToken, setGeneratedToken] = useState('')
  const [inputToken, setInputToken] = useState('')
  const [tokenCopied, setTokenCopied] = useState(false)
  const [tokenStatusMessage, setTokenStatusMessage] = useState(null)
  const [importStatus, setImportStatus] = useState(null)
  const fileInputRef = useRef(null)

  const auth = useAuth()
  const {
    activeProfile = {},
    allProfiles = [],
    switchUserProfile,
    registerUniqueProfile,
    loginWithUserId,
    switchToGuestMode,
    deleteUserProfile,
    exportUserData,
    importUserData,
    loginWithGoogle,
    autoSaveState = {},
    completedMasterActivities = 0,
    totalMasterActivities = 100,
    masterTotalXP = 0
  } = useChallenges() || {}

  const isCurrentGuest = Boolean(activeProfile?.isGuest || activeProfile?.id === 'guest')

  // Listen for open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-user-sync-modal', handleOpen)
    return () => window.removeEventListener('open-user-sync-modal', handleOpen)
  }, [])

  // Check passkey enrollment whenever active profile changes
  useEffect(() => {
    if (activeProfile?.id && !isCurrentGuest) {
      setHasPasskeyEnrolled(hasPasskeyForUser(activeProfile.id))
    } else {
      const keys = getEnrolledPasskeys()
      setHasPasskeyEnrolled(keys.length > 0)
    }
  }, [activeProfile, isCurrentGuest])

  // Ambient automatic sync helper: automatically called upon ANY authentication
  const triggerAmbientSync = async (profileId) => {
    try {
      if (autoSaveState?.triggerSave) {
        await autoSaveState.triggerSave()
      }
      const health = await checkSupabaseHealth()
      setAmbientSyncStatus(health)
      setLastSyncTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    } catch {
      setLastSyncTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
  }

  // ── AUTH METHOD 1: Biometric Passkey / WebAuthn ─────────────────────────────
  const handlePasskeyAuthenticate = async () => {
    setIsProcessing(true)
    setAuthError(null)

    try {
      const res = await authenticatePasskey(isCurrentGuest ? null : activeProfile?.id)
      if (res.success) {
        const switchRes = await loginWithUserId(res.userId)
        if (switchRes.success) {
          setActionSuccess(`Passkey Verified! Synced to ${switchRes.profile.name || res.userId}`)
          await triggerAmbientSync(res.userId)
          setTimeout(() => setActionSuccess(null), 4000)
        } else {
          setAuthError('Passkey verified, but profile could not be activated.')
        }
      } else if (!res.cancelled) {
        setAuthError(res.error || 'Biometric authentication could not be completed.')
      }
    } catch {
      setAuthError('Biometric prompt was cancelled or unavailable on this device.')
    } finally {
      setIsProcessing(false)
    }
  }

  // 1-Click Enroll Hardware Passkey for currently active profile
  const handleEnrollPasskey = async () => {
    if (isCurrentGuest) {
      setAuthError('Please sign in or claim a Student ID before enrolling a biometric passkey.')
      return
    }

    setIsPasskeyEnrolling(true)
    setAuthError(null)

    try {
      const res = await registerPasskey({
        userId: activeProfile.id,
        userName: activeProfile.name || activeProfile.id,
        displayName: `${activeProfile.name || activeProfile.id} (${activeProfile.id})`
      })

      if (res.success) {
        setHasPasskeyEnrolled(true)
        setActionSuccess('Hardware Passkey enrolled! You can now unlock with Windows Hello / Touch ID.')
        await triggerAmbientSync(activeProfile.id)
        setTimeout(() => setActionSuccess(null), 4500)
      } else if (!res.cancelled) {
        setAuthError(res.error || 'Failed to enroll passkey.')
      }
    } catch {
      setAuthError('Passkey enrollment was cancelled.')
    } finally {
      setIsPasskeyEnrolling(false)
    }
  }

  // ── AUTH METHOD 2: Google Cloud Identity & Single Sign-On ──────────────────
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsProcessing(true)
    setAuthError(null)

    try {
      if (auth?.signInWithGoogle) {
        await auth.signInWithGoogle(credentialResponse.credential)
      }
      const parsed = parseGoogleCredential(credentialResponse.credential)
      if (parsed) {
        const email = parsed.email?.trim() || 'student@gmail.com'
        const name = parsed.name?.trim() || email.split('@')[0]
        const sub = parsed.sub || `google-sub-${email.replace(/[^a-z0-9]/gi, '')}`

        const res = loginWithGoogle({ sub, email, name, picture: parsed.picture })
        if (res.success) {
          setActionSuccess(`Google Account Connected & Synced: ${res.profile.id}`)
          await triggerAmbientSync(res.profile.id)
          setTimeout(() => setActionSuccess(null), 4000)
        } else {
          setAuthError(res.error || 'Failed to bind Google Identity.')
        }
      }
    } catch {
      setAuthError('Google sign-in could not be completed. You can use Direct Email or Student ID.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDirectGoogleSubmit = async (e) => {
    e.preventDefault()
    if (!directGoogleEmail.trim()) return
    const cleanEmail = directGoogleEmail.trim().toLowerCase()
    setIsProcessing(true)
    setAuthError(null)

    try {
      const res = loginWithGoogle({
        sub: `google-sub-${cleanEmail.replace(/[^a-z0-9]/gi, '')}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        picture: null
      })
      if (res.success) {
        setActionSuccess(`Signed in with Google Account: ${res.profile.id}`)
        setDirectGoogleEmail('')
        setShowDirectGoogle(false)
        await triggerAmbientSync(res.profile.id)
        setTimeout(() => setActionSuccess(null), 4000)
      }
    } catch {
      setAuthError('Direct Google sign-in failed. Please verify your email format.')
    } finally {
      setIsProcessing(false)
    }
  }

  // ── AUTH METHOD 3: Student ID / Instant Claim ──────────────────────────────
  const handleStudentIdLogin = async (e) => {
    e?.preventDefault()
    if (!studentIdInput.trim()) return
    setIsProcessing(true)
    setAuthError(null)
    setSuggestClaimId(null)

    try {
      const res = await loginWithUserId(studentIdInput.trim())
      if (res.success) {
        setActionSuccess(`Switched to Student ID: ${res.profile.id}`)
        setStudentIdInput('')
        await triggerAmbientSync(res.profile.id)
        setTimeout(() => setActionSuccess(null), 4000)
      } else {
        setAuthError(res.error || `Student ID "${studentIdInput.trim()}" not found.`)
        if (res.notFound) {
          setSuggestClaimId(studentIdInput.trim())
        }
      }
    } catch {
      setAuthError('Could not verify Student ID.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Instant 1-Tap Generate & Claim Student ID (Zero tedious forms!)
  const handleInstantGenerateId = async () => {
    setIsProcessing(true)
    setAuthError(null)

    try {
      const newId = generateUniqueUserId('SEC-STUDENT')
      const res = registerUniqueProfile({
        userId: newId,
        name: 'Cyber Security Analyst',
        role: 'Cloud Security Engineer',
        color: '#38bdf8',
        migrateGuestData: isCurrentGuest
      })

      if (res.success) {
        setActionSuccess(`New Student ID Activated: ${res.profile.id}`)
        await triggerAmbientSync(res.profile.id)
        setTimeout(() => setActionSuccess(null), 4000)
      } else {
        setAuthError(res.error || 'Failed to generate Student ID.')
      }
    } catch {
      setAuthError('Error activating Student ID.')
    } finally {
      setIsProcessing(false)
    }
  }

  // 1-Click Claim Suggested ID
  const handleClaimSuggested = () => {
    if (!suggestClaimId) return
    const res = registerUniqueProfile({
      userId: suggestClaimId,
      name: suggestClaimId,
      role: 'Cloud Security Engineer',
      color: '#38bdf8',
      migrateGuestData: isCurrentGuest
    })
    if (res.success) {
      setActionSuccess(`Claimed & Activated Student ID: ${res.profile.id}`)
      setSuggestClaimId(null)
      setStudentIdInput('')
      setAuthError(null)
      triggerAmbientSync(res.profile.id)
      setTimeout(() => setActionSuccess(null), 4000)
    }
  }

  // 1-Click Copy Active ID
  const handleCopyId = () => {
    if (activeProfile?.id) {
      navigator.clipboard.writeText(activeProfile.id)
      setCopiedIdNotice(true)
      setTimeout(() => setCopiedIdNotice(false), 2000)
    }
  }

  // Switch to Guest Mode
  const handleSwitchToGuest = () => {
    switchToGuestMode()
    setActionSuccess('Switched to Guest Sandbox. Progress is isolated locally.')
    setTimeout(() => setActionSuccess(null), 3500)
  }

  // Vault Tools: Generate Offline Token
  const handleGenerateToken = () => {
    try {
      const token = generateSyncToken(activeProfile.id)
      setGeneratedToken(token)
    } catch {
      setTokenStatusMessage({ type: 'error', text: 'Failed to generate sync token.' })
    }
  }

  const handleCopyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken)
      setTokenCopied(true)
      setTimeout(() => setTokenCopied(false), 2000)
    }
  }

  const handleRestoreToken = async () => {
    if (!inputToken.trim()) return
    const res = restoreFromSyncToken(inputToken.trim())
    if (res.success) {
      setTokenStatusMessage({ type: 'success', text: `Restored progress for ${res.profile.id}!` })
      setInputToken('')
      await triggerAmbientSync(res.profile.id)
      setTimeout(() => setTokenStatusMessage(null), 4000)
    } else {
      setTokenStatusMessage({ type: 'error', text: res.error || 'Invalid sync token string.' })
    }
  }

  // Vault Tools: Export JSON
  const handleDownloadBackup = () => {
    try {
      const dataStr = exportUserData(activeProfile.id)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `secloudive-vault-${activeProfile.id}-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      setActionSuccess('Encrypted vault backup downloaded!')
      setTimeout(() => setActionSuccess(null), 3000)
    } catch {
      setAuthError('Failed to generate vault backup.')
    }
  }

  // Vault Tools: Import JSON
  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        const res = importUserData(content)
        if (res.success) {
          setImportStatus({ type: 'success', text: `Vault restored for User ${res.profile.id}!` })
          await triggerAmbientSync(res.profile.id)
          setTimeout(() => setImportStatus(null), 4000)
        } else {
          setImportStatus({ type: 'error', text: res.error || 'Import failed.' })
        }
      }
    }
    reader.readAsText(file)
  }

  if (!isOpen) return null

  return (
    <div className="user-sync-backdrop" onClick={() => setIsOpen(false)}>
      <div 
        className="user-sync-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cyber Identity & Ambient Sync Nexus"
        style={{
          maxWidth: '720px',
          width: '95%',
          background: 'linear-gradient(180deg, rgba(11, 20, 38, 0.98) 0%, rgba(3, 7, 18, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.12)',
          overflow: 'hidden'
        }}
      >
        {/* Top Accent Bar */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, #38bdf8 0%, #3b82f6 50%, #10b981 100%)',
          boxShadow: '0 0 10px rgba(56, 189, 248, 0.6)'
        }} />

        {/* Unified Header */}
        <div style={{
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'grid',
              placeItems: 'center',
              color: '#38bdf8'
            }}>
              <Fingerprint size={20} className="animate-pulse" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SeCloudiveLogo size={14} variant="two-tone" glow={false} />
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.2px' }}>
                  Cloud Identity & Sync Center
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Biometric Passkeys • Google Identity • Zero-Trust Cloud Sync
              </div>
            </div>
          </div>

          <button 
            className="btn-user-sync-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Ambient Sync Telemetry Ribbon */}
        <div style={{
          padding: '8px 24px',
          background: 'rgba(2, 6, 23, 0.7)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: '#94a3b8',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
            <span style={{ color: '#cbd5e1' }}>
              <strong>Ambient Sync Active:</strong> All labs, notes & XP continuously secured
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Synced: <strong style={{ color: '#38bdf8' }}>{lastSyncTimestamp || autoSaveState.lastSaved || 'Real-time'}</strong></span>
            <span>•</span>
            <span>Master XP: <strong style={{ color: '#f59e0b' }}>{masterTotalXP.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Status Alerts */}
        {actionSuccess && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#6ee7b7'
          }}>
            <CheckCircle2 size={15} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {authError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#fca5a5'
          }}>
            <AlertCircle size={15} />
            <span>{authError}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div style={{ padding: '20px 24px', maxHeight: '72vh', overflowY: 'auto' }}>
          
          {/* 1. CURRENT IDENTITY SPOTLIGHT */}
          <div style={{
            background: isCurrentGuest 
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%)',
            border: isCurrentGuest ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '14px',
            padding: '18px 20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: isCurrentGuest ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                  border: isCurrentGuest ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: isCurrentGuest ? '#fbbf24' : '#38bdf8',
                  overflow: 'hidden'
                }}>
                  {activeProfile?.avatarUrl ? (
                    <img src={activeProfile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    isCurrentGuest ? '?' : (activeProfile.name?.charAt(0)?.toUpperCase() || 'U')
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc' }}>
                      {isCurrentGuest ? 'Guest Learner' : (activeProfile.name || 'Cloud Security Engineer')}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      background: isCurrentGuest ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: isCurrentGuest ? '#fbbf24' : '#34d399',
                      border: isCurrentGuest ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)'
                    }}>
                      {isCurrentGuest ? 'GUEST SANDBOX' : 'ACTIVE STUDENT ID'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12px', color: '#94a3b8' }}>
                    <span>Student ID:</span>
                    <strong style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{activeProfile.id}</strong>
                    {!isCurrentGuest && (
                      <button
                        type="button"
                        onClick={handleCopyId}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedIdNotice ? '#10b981' : '#94a3b8',
                          cursor: 'pointer',
                          padding: '1px 4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '11px'
                        }}
                      >
                        {copiedIdNotice ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedIdNotice ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!isCurrentGuest && !hasPasskeyEnrolled && (
                  <button
                    type="button"
                    onClick={handleEnrollPasskey}
                    disabled={isPasskeyEnrolling}
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Fingerprint size={14} className={isPasskeyEnrolling ? 'animate-pulse' : ''} />
                    <span>{isPasskeyEnrolling ? 'Enrolling…' : 'Enroll Passkey'}</span>
                  </button>
                )}

                {hasPasskeyEnrolled && !isCurrentGuest && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#34d399',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <ShieldCheck size={13} />
                    <span>Passkey Enrolled</span>
                  </span>
                )}

                {!isCurrentGuest ? (
                  <button
                    type="button"
                    onClick={handleSwitchToGuest}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#cbd5e1',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <LogOut size={13} />
                    <span>Switch to Guest</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleInstantGenerateId}
                    style={{
                      background: '#10b981',
                      border: 'none',
                      color: '#020617',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Zap size={13} />
                    <span>Claim Student ID</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. UNIFIED AUTHENTICATION & SYNC (COMBINED TECHNOLOGIES) */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(148, 163, 184, 0.16)',
            borderRadius: '14px',
            padding: '22px',
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: '#38bdf8' }} />
                <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Unified Sign In & Cloud Sync
                </h3>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0', lineHeight: 1.5 }}>
                Sign in using your preferred method. Your labs, notes, and XP synchronize automatically to your isolated cloud vault.
              </p>
            </div>

            {/* Combined Modern Gateways: Passkey + Google */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px',
              marginBottom: '14px'
            }}>
              {/* Option A: Biometric Passkey */}
              <button
                type="button"
                onClick={handlePasskeyAuthenticate}
                disabled={isProcessing}
                style={{
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(37, 99, 235, 0.18) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  padding: '12px 16px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)'
                }}
              >
                <Fingerprint size={18} style={{ color: '#38bdf8' }} className={isProcessing ? 'animate-pulse' : ''} />
                <span>{isProcessing ? 'Verifying Scan…' : 'Sign in with Passkey'}</span>
              </button>

              {/* Option B: Google Single Sign-On */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(2, 6, 23, 0.6)',
                borderRadius: '10px',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                padding: '6px'
              }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setAuthError('Google sign-in was cancelled or blocked.')}
                  useOneTap={false}
                  theme="filled_black"
                  shape="rectangular"
                  size="large"
                  text="signin_with"
                  width="100%"
                />
              </div>
            </div>

            {/* Direct Google Email Fallback Toggle */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setShowDirectGoogle(prev => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {showDirectGoogle ? 'Hide email entry' : 'Prefer direct Google email without popups?'}
              </button>
            </div>

            {showDirectGoogle && (
              <form onSubmit={handleDirectGoogleSubmit} style={{
                marginBottom: '16px',
                padding: '12px',
                background: 'rgba(2, 6, 23, 0.7)',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                  Direct Instant Account Sign-In (Private Browsing / Sandboxes):
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={directGoogleEmail}
                    onChange={(e) => setDirectGoogleEmail(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      minWidth: '220px',
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isProcessing}
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '7px 16px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '16px 0',
              color: '#64748b',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.6px'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.15)' }} />
              <span style={{ padding: '0 12px' }}>or sign in with Student ID</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(148, 163, 184, 0.15)' }} />
            </div>

            {/* Option C: Smart Student ID Input + 1-Tap Auto-Generate */}
            <form onSubmit={handleStudentIdLogin} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Enter Student ID (e.g. SEC-STUDENT-4921)..."
                value={studentIdInput}
                onChange={(e) => {
                  setStudentIdInput(e.target.value)
                  setAuthError(null)
                  setSuggestClaimId(null)
                }}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  background: 'rgba(2, 6, 23, 0.8)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#f8fafc',
                  fontSize: '12.5px',
                  fontFamily: "'DM Mono', monospace"
                }}
              />
              <button
                type="submit"
                disabled={isProcessing || !studentIdInput.trim()}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogIn size={14} />
                <span>{isProcessing ? 'Syncing…' : 'Sign In & Sync'}</span>
              </button>

              <button
                type="button"
                onClick={handleInstantGenerateId}
                disabled={isProcessing}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  borderRadius: '8px',
                  padding: '9px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Zap size={13} />
                <span>⚡ Auto-Generate ID</span>
              </button>
            </form>

            {suggestClaimId && (
              <div style={{
                marginTop: '10px',
                padding: '10px 14px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '12px',
                color: '#6ee7b7'
              }}>
                <span>ID "{suggestClaimId}" is unclaimed! Would you like to activate it now?</span>
                <button
                  type="button"
                  onClick={handleClaimSuggested}
                  style={{
                    background: '#10b981',
                    color: '#020617',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '5px 12px',
                    fontWeight: 800,
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Claim & Activate
                </button>
              </div>
            )}

            {/* Quick Switch Profiles on this Device */}
            {allProfiles.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
                <span style={{ fontSize: '11px', color: '#64748b', marginRight: '8px' }}>Active profiles on this device:</span>
                <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {allProfiles.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={async () => {
                        switchUserProfile(p.id)
                        setActionSuccess(`Switched to Student ID: ${p.id}`)
                        await triggerAmbientSync(p.id)
                        setTimeout(() => setActionSuccess(null), 3000)
                      }}
                      style={{
                        background: activeProfile?.id === p.id && !isCurrentGuest ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.8)',
                        border: activeProfile?.id === p.id && !isCurrentGuest ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.2)',
                        color: activeProfile?.id === p.id && !isCurrentGuest ? '#34d399' : '#cbd5e1',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontFamily: "'DM Mono', monospace",
                        cursor: 'pointer'
                      }}
                    >
                      {p.id} ({p.name || 'Student'})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. COLLAPSIBLE OFFLINE VAULT TOOLS (Clean Drawer for Power Users) */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <button
              type="button"
              onClick={() => setShowVaultDrawer(prev => !prev)}
              style={{
                width: '100%',
                padding: '12px 18px',
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#cbd5e1',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={14} style={{ color: '#38bdf8' }} />
                <span>Offline Vault Tools (Encrypted JSON & Air-Gapped Sync Token)</span>
              </div>
              {showVaultDrawer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showVaultDrawer && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(148, 163, 184, 0.1)', background: 'rgba(2, 6, 23, 0.4)' }}>
                <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.45 }}>
                  Working in an air-gapped lab or transferring data without internet? Use encrypted file backups or a copy-paste Base64 token.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  {/* File Backup Card */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                      Encrypted JSON File Archive
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={handleDownloadBackup}
                        style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.35)',
                          color: '#38bdf8',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Download size={12} />
                        <span>Export JSON</span>
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={handleImportFile}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          color: '#34d399',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Upload size={12} />
                        <span>Import JSON</span>
                      </button>
                    </div>

                    {importStatus && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: importStatus.type === 'success' ? '#6ee7b7' : '#fca5a5' }}>
                        {importStatus.text}
                      </div>
                    )}
                  </div>

                  {/* Sync Token Card */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
                        Base64 Sync String
                      </span>
                      <button
                        type="button"
                        onClick={handleGenerateToken}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#38bdf8',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Generate Token
                      </button>
                    </div>

                    {generatedToken && (
                      <div style={{ marginBottom: '8px' }}>
                        <textarea
                          readOnly
                          value={generatedToken}
                          style={{
                            width: '100%',
                            height: '52px',
                            background: 'rgba(2, 6, 23, 0.8)',
                            border: '1px solid rgba(148, 163, 184, 0.2)',
                            borderRadius: '4px',
                            color: '#94a3b8',
                            fontSize: '9.5px',
                            fontFamily: 'monospace',
                            padding: '4px 6px',
                            resize: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleCopyToken}
                          style={{
                            background: 'rgba(56, 189, 248, 0.15)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            color: '#38bdf8',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '4px'
                          }}
                        >
                          {tokenCopied ? <Check size={11} /> : <Copy size={11} />}
                          <span>{tokenCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Paste sync token here..."
                        value={inputToken}
                        onChange={(e) => setInputToken(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'rgba(2, 6, 23, 0.8)',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '4px',
                          padding: '5px 8px',
                          fontSize: '11px',
                          color: '#f8fafc',
                          fontFamily: 'monospace'
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleRestoreToken}
                        style={{
                          background: '#10b981',
                          color: '#020617',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '5px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Restore
                      </button>
                    </div>

                    {tokenStatusMessage && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: tokenStatusMessage.type === 'success' ? '#6ee7b7' : '#fca5a5' }}>
                        {tokenStatusMessage.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Unified Clean Footer */}
        <div style={{
          padding: '14px 24px',
          background: 'rgba(8, 15, 30, 0.95)',
          borderTop: '1px solid rgba(148, 163, 184, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#94a3b8' }}>
            <ShieldCheck size={14} style={{ color: '#38bdf8' }} />
            <span>
              <strong>Zero-Trust Per-User Isolation:</strong> Every Student ID is strictly isolated. No data leaks between learners.
            </span>
          </div>

          <button 
            type="button"
            className="btn-user-sync-done"
            onClick={() => setIsOpen(false)}
            style={{
              padding: '8px 20px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '7px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
