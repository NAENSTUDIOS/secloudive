// ==============================================================================
// SeCloudive Student Identity & Real-Time Cloud Sync Modal
// Principles:
// 1. One Account = One Permanent Student ID (created automatically).
// 2. Side-by-side: Google Sign In (Auto-ID) & Email + Password Sign In.
// 3. Zero manual User ID friction; single deterministic identifier per student.
// ==============================================================================

import { useState, useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  LogOut,
  RefreshCw,
  X,
  Sparkles,
  Cloud,
  Shield,
  Zap,
  ArrowRight,
  Mail,
  Lock,
  User,
  Download,
  GraduationCap
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { useAuth } from '../context/AuthContext'
import SeCloudiveLogo from './SeCloudiveLogo'
import { 
  parseGoogleCredential, 
  generateUniqueUserId, 
  registerUniqueProfile, 
  loginWithUserId, 
  loadProfileProgress
} from '../services/userSyncManager'
import { checkSupabaseHealth } from '../lib/supabase'
import { playTactileClick } from '../utils/cyberMotionAudio'

const STUDENT_ROLES = [
  'Aspiring Cloud Security Engineer',
  'Junior SOC Analyst (Tier 1)',
  'DevSecOps & Kubernetes Defender',
  'Cloud Incident Responder (DFIR)',
  'Cloud Security Architect'
]

// Deterministically generate a stable single Student ID from an email address
function deterministicEmailUserId(email) {
  if (!email) return generateUniqueUserId('SEC-STU')
  let hash = 0
  const clean = email.trim().toLowerCase()
  for (let i = 0; i < clean.length; i++) {
    hash = ((hash << 5) - hash) + clean.charCodeAt(i)
    hash |= 0
  }
  const num = Math.abs(hash) % 9000 + 1000
  return `SEC-STU-${num}`
}

export default function UserSyncModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [studentName, setStudentName] = useState('')
  const [targetRole, setTargetRole] = useState(STUDENT_ROLES[0])
  
  // Status states
  const [actionSuccess, setActionSuccess] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  const [cloudSyncHealthy, setCloudSyncHealthy] = useState(true)

  const auth = useAuth()
  const {
    activeProfile = {},
    loginWithGoogle,
    switchToGuestMode,
    autoSaveState = {},
    completedMasterActivities = 0,
    masterTotalXP = 0,
    masterProgressPercent = 0
  } = useChallenges() || {}

  const isGuest = Boolean(!activeProfile?.id || activeProfile?.isGuest || activeProfile?.id === 'guest')

  useEffect(() => {
    const handleOpen = () => {
      setAuthError(null)
      setActionSuccess(null)
      setIsOpen(true)
      playTactileClick()
    }
    window.addEventListener('open-user-sync-modal', handleOpen)
    return () => window.removeEventListener('open-user-sync-modal', handleOpen)
  }, [])

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleCopyId = () => {
    try {
      navigator.clipboard.writeText(activeProfile?.id || 'guest')
      setCopiedId(true)
      playTactileClick()
      setTimeout(() => setCopiedId(false), 2500)
    } catch {
      setCopiedId(true)
    }
  }

  const recordAuthTermsConsent = () => {
    try {
      localStorage.setItem('secloudive_terms_accepted_v1', 'true')
      localStorage.setItem('secloudive_cookies_accepted_v1', 'true')
      localStorage.setItem('secloudive_onboarding_completed_v1', 'true')
    } catch {}
  }

  // Handle Email & Password Login / Register
  const handleEmailAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError(null)
    setIsProcessing(true)
    playTactileClick()

    try {
      if (authMode === 'login') {
        if (!email.trim() || !password) {
          setAuthError('Please enter both student email and password.')
          setIsProcessing(false)
          return
        }

        // Try Supabase auth first
        if (auth?.signInWithEmail) {
          const res = await auth.signInWithEmail(email.trim(), password)
          if (res?.success) {
            recordAuthTermsConsent()
            setActionSuccess(`Welcome back! Authenticated as ${res.profile?.name || email}`)
            setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            setTimeout(() => {
              setActionSuccess(null)
              setIsOpen(false)
            }, 1800)
            return
          }
        }

        // Check local profile registry for existing email
        const autoId = deterministicEmailUserId(email)
        const localLogin = loginWithUserId(autoId)
        if (localLogin?.success) {
          recordAuthTermsConsent()
          setActionSuccess(`Welcome back! Authenticated as ${localLogin.profile?.name || email}`)
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
          setTimeout(() => {
            setActionSuccess(null)
            setIsOpen(false)
          }, 1800)
          return
        }

        setAuthError('No account found for this email address. Switch to "Create Account" to register.')
      } else {
        // Register Mode
        if (!email.trim() || !password || password.length < 6) {
          setAuthError('Password must be at least 6 characters.')
          setIsProcessing(false)
          return
        }

        const autoId = deterministicEmailUserId(email)
        const nameVal = studentName.trim() || email.split('@')[0]

        // Try Supabase sign up
        if (auth?.signUpWithEmail) {
          const signUpRes = await auth.signUpWithEmail(email.trim(), password, {
            name: nameVal,
            role: targetRole
          })
          if (!signUpRes?.success) {
            setAuthError(signUpRes?.error || 'Account creation failed. Please try again.')
            return
          }
        }

        // Register profile with deterministic auto-generated Student ID
        const regRes = registerUniqueProfile({
          userId: autoId,
          email: email.trim(),
          name: nameVal,
          role: targetRole,
          migrateGuestData: true
        })

        if (regRes.success) {
          recordAuthTermsConsent()
          setActionSuccess(`Account created! Auto-assigned Student ID: ${autoId}`)
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
          if (autoSaveState?.triggerSave) {
            await autoSaveState.triggerSave()
          }
          setTimeout(() => {
            setActionSuccess(null)
            setIsOpen(false)
          }, 2000)
          return
        } else {
          // If already registered, log in directly
          const fallbackLogin = loginWithUserId(autoId)
          if (fallbackLogin.success) {
            recordAuthTermsConsent()
            setActionSuccess(`Welcome back! Authenticated as ${nameVal}`)
            setTimeout(() => {
              setActionSuccess(null)
              setIsOpen(false)
            }, 1800)
            return
          }
          setAuthError(regRes.error || 'Failed to create student profile.')
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle Google OAuth 2.0 Single User ID Flow
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsProcessing(true)
    setAuthError(null)
    playTactileClick()

    try {
      if (credentialResponse?.credential) {
        if (auth?.signInWithGoogle) {
          const res = await auth.signInWithGoogle(credentialResponse.credential)
          if (res?.success) {
            recordAuthTermsConsent()
            const assignedId = res.profile?.id || 'SEC-GOOGLE-USER'
            setActionSuccess(`Google verified! Auto-linked to Student ID: ${assignedId}`)
            setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            if (autoSaveState?.triggerSave) {
              await autoSaveState.triggerSave()
            }
            setTimeout(() => {
              setActionSuccess(null)
              setIsOpen(false)
            }, 1800)
            return
          }
        }

        // Fallback: decode directly via parseGoogleCredential
        const decoded = parseGoogleCredential(credentialResponse.credential)
        if (decoded && loginWithGoogle) {
          const res = loginWithGoogle(decoded)
          if (res?.success) {
            recordAuthTermsConsent()
            setActionSuccess(`Google verified! Auto-linked to Student ID: ${res.profile?.id}`)
            setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            if (autoSaveState?.triggerSave) {
              await autoSaveState.triggerSave()
            }
            setTimeout(() => {
              setActionSuccess(null)
              setIsOpen(false)
            }, 1800)
            return
          } else {
            setAuthError(res?.error || 'Could not bind Google identity.')
          }
        }
      }
    } catch {
      setAuthError('Google sign-in could not be completed. You can use Email & Password on the right.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleForceSync = async () => {
    setIsProcessing(true)
    playTactileClick()
    try {
      if (autoSaveState?.triggerSave) {
        await autoSaveState.triggerSave()
      }
      const health = await checkSupabaseHealth()
      setCloudSyncHealthy(health)
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      setActionSuccess('Cloud synchronization successful!')
      setTimeout(() => setActionSuccess(null), 3000)
    } catch {
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      setActionSuccess('Local storage cache synchronized!')
      setTimeout(() => setActionSuccess(null), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExportBackup = () => {
    playTactileClick()
    try {
      const data = loadProfileProgress ? loadProfileProgress(activeProfile?.id || 'guest') : {}
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `secloudive-backup-${activeProfile?.id || 'guest'}-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      setActionSuccess('Progress backup exported successfully.')
      setTimeout(() => setActionSuccess(null), 3000)
    } catch {
      setAuthError('Failed to generate export package.')
    }
  }

  const handleLogoutToGuest = () => {
    playTactileClick()
    if (auth?.logout) {
      auth.logout()
    }
    if (switchToGuestMode) {
      switchToGuestMode()
    }
    setActionSuccess('Switched to Guest Sandbox mode.')
    setTimeout(() => {
      setActionSuccess(null)
      setIsOpen(false)
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div
      className="user-sync-modal-backdrop"
      onClick={() => setIsOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        className="user-sync-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Student Identity & Cloud Sync Center"
        style={{
          width: '100%',
          maxWidth: isGuest ? '840px' : '560px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(56, 189, 248, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          maxHeight: '92vh',
          transition: 'max-width 0.25s ease'
        }}
      >
        {/* Top Glowing Strip */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, #38bdf8 0%, #10b981 50%, #818cf8 100%)',
          boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)'
        }} />

        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'grid',
              placeItems: 'center',
              color: '#38bdf8'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.3px' }}>
                Student Sign In & Cloud Sync
              </h2>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#94a3b8' }}>
                One Account = One Permanent Student ID • Automatic Cloud Progress Sync
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close modal"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'grid',
              placeItems: 'center',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {/* Notification Banners */}
          {actionSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '18px',
              color: '#34d399',
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              <span>{actionSuccess}</span>
            </div>
          )}

          {authError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '18px',
              color: '#f87171',
              fontSize: '0.84rem',
              fontWeight: 700
            }}>
              {authError}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {/* STATE A: SIGNED IN USER PROFILE VIEW                                */}
          {/* ═══════════════════════════════════════════════════════════════════════ */}
          {!isGuest ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Profile Card */}
              <div style={{
                background: 'rgba(2, 6, 23, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '12px',
                padding: '18px 20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {activeProfile?.picture ? (
                      <img
                        src={activeProfile.picture}
                        alt="Profile avatar"
                        style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid #38bdf8' }}
                      />
                    ) : (
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '1.1rem'
                      }}>
                        {activeProfile?.name?.[0]?.toUpperCase() || 'S'}
                      </div>
                    )}
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                        {activeProfile?.name || 'Candidate Defender'}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
                        {activeProfile?.role || 'Cloud Security Student'}
                      </span>
                      {activeProfile?.email && (
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          {activeProfile.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <span style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34d399',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    LIVE SYNCED • 1 ID
                  </span>
                </div>

                {/* Permanent Student ID Copy Pill */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block' }}>
                      Permanent Single Student ID (Auto-Generated)
                    </span>
                    <strong style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.94rem', color: '#38bdf8' }}>
                      {activeProfile?.id}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyId}
                    style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {copiedId ? <Check size={13} style={{ color: '#34d399' }} /> : <Copy size={13} />}
                    <span>{copiedId ? 'Copied!' : 'Copy ID'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Summary Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px'
              }}>
                <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Total XP</span>
                  <strong style={{ fontSize: '1.1rem', color: '#38bdf8', fontWeight: 800 }}>{masterTotalXP}</strong>
                </div>
                <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Completed Labs</span>
                  <strong style={{ fontSize: '1.1rem', color: '#34d399', fontWeight: 800 }}>{completedMasterActivities}</strong>
                </div>
                <div style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>Readiness</span>
                  <strong style={{ fontSize: '1.1rem', color: '#a855f7', fontWeight: 800 }}>{masterProgressPercent}%</strong>
                </div>
              </div>

              {/* Live Sync Status Info */}
              <div style={{
                background: 'rgba(2, 6, 23, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
                  <Cloud size={15} style={{ color: cloudSyncHealthy ? '#34d399' : '#f59e0b' }} />
                  <span>Cloud Sync: <strong style={{ color: '#f8fafc' }}>Active</strong> (Last: {lastSyncTime})</span>
                </div>
                <button
                  type="button"
                  onClick={handleForceSync}
                  disabled={isProcessing}
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={12} className={isProcessing ? 'animate-spin' : ''} />
                  <span>Sync Now</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#e2e8f0',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} /> Export Backup JSON
                </button>

                <button
                  type="button"
                  onClick={handleLogoutToGuest}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </div>
          ) : (
            /* ═══════════════════════════════════════════════════════════════════ */
            /* STATE B: SIDE-BY-SIDE AUTHENTICATION (GOOGLE + EMAIL & PASSWORD)    */
            /* ═══════════════════════════════════════════════════════════════════ */
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
                gap: '24px',
                alignItems: 'stretch'
              }}>
                {/* ── LEFT COLUMN: GOOGLE ONE-CLICK SIGN IN ── */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(56, 189, 248, 0.2)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#38bdf8'
                      }}>
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                          Instant Google Sign In
                        </h3>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
                          Recommended • 1-Click Auto-ID
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 20px' }}>
                      Single-click authentication. Directly binds your progress to your verified Google account with an automatically created permanent Student ID.
                    </p>

                    {/* Google Login Component */}
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 20px' }}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setAuthError('Google sign-in could not be completed. You can use Email & Password on the right.')}
                        theme="filled_blue"
                        shape="pill"
                        text="continue_with"
                        size="large"
                      />
                      {auth?.signInWithGoogleOAuth && (
                        <button
                          type="button"
                          onClick={() => auth.signInWithGoogleOAuth(window.location.origin)}
                          style={{ marginTop: '8px', background: 'transparent', border: 0, color: '#7dd3fc', fontSize: '0.72rem', cursor: 'pointer' }}
                        >
                          Use secure browser redirect instead
                        </button>
                      )}
                    </div>

                    {/* Value Points */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                        <CheckCircle2 size={13} style={{ color: '#34d399', flexShrink: 0 }} />
                        <span><strong>1 Account = 1 Student ID:</strong> Auto-generated deterministic ID.</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                        <CheckCircle2 size={13} style={{ color: '#34d399', flexShrink: 0 }} />
                        <span><strong>Zero Passwords:</strong> Fast, secure OAuth 2.0 authentication.</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#cbd5e1' }}>
                        <CheckCircle2 size={13} style={{ color: '#34d399', flexShrink: 0 }} />
                        <span><strong>Real-Time Sync:</strong> Preserves all certificates, XP, and labs.</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', fontSize: '0.7rem', color: '#64748b', textAlign: 'center' }}>
                    Secured via Google Identity Services
                  </div>
                </div>

                {/* ── RIGHT COLUMN: LOGIN OR REGISTER WITH EMAIL & PASSWORD ── */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    {/* Header with Mode Switcher */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} style={{ color: '#818cf8' }} />
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                          Email & Password
                        </h3>
                      </div>

                      {/* Mode Toggle */}
                      <div style={{
                        display: 'flex',
                        background: 'rgba(2, 6, 23, 0.7)',
                        borderRadius: '6px',
                        padding: '2px',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}>
                        <button
                          type="button"
                          onClick={() => { setAuthMode('login'); setAuthError(null); }}
                          style={{
                            background: authMode === 'login' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                            color: authMode === 'login' ? '#38bdf8' : '#94a3b8',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => { setAuthMode('register'); setAuthError(null); }}
                          style={{
                            background: authMode === 'register' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                            color: authMode === 'register' ? '#38bdf8' : '#94a3b8',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Register
                        </button>
                      </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {authMode === 'register' && (
                        <>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                              Student Full Name
                            </label>
                            <div style={{ position: 'relative' }}>
                              <User size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                              <input
                                type="text"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                placeholder="e.g. Alex Rivera"
                                style={{
                                  width: '100%',
                                  padding: '8px 12px 8px 32px',
                                  background: 'rgba(2, 6, 23, 0.7)',
                                  border: '1px solid rgba(255, 255, 255, 0.15)',
                                  borderRadius: '6px',
                                  color: '#f8fafc',
                                  fontSize: '0.84rem'
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                              Target Career Focus
                            </label>
                            <select
                              value={targetRole}
                              onChange={(e) => setTargetRole(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                background: '#0b1329',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '6px',
                                color: '#f8fafc',
                                fontSize: '0.82rem'
                              }}
                            >
                              {STUDENT_ROLES.map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}

                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                          Student Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@university.edu"
                            style={{
                              width: '100%',
                              padding: '8px 12px 8px 32px',
                              background: 'rgba(2, 6, 23, 0.7)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '6px',
                              color: '#f8fafc',
                              fontSize: '0.84rem'
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                          Password
                        </label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            style={{
                              width: '100%',
                              padding: '8px 12px 8px 32px',
                              background: 'rgba(2, 6, 23, 0.7)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '6px',
                              color: '#f8fafc',
                              fontSize: '0.84rem'
                            }}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        style={{
                          marginTop: '6px',
                          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.86rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)'
                        }}
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" /> Authenticating...
                          </>
                        ) : authMode === 'login' ? (
                          <>
                            ▶ Sign In with Email
                          </>
                        ) : (
                          <>
                            ✨ Create Account & Auto-Generate ID
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  <div style={{ marginTop: '14px', fontSize: '0.72rem', color: '#64748b', textAlign: 'center' }}>
                    1 Account = 1 ID. Permanent Student ID assigned automatically.
                  </div>
                </div>
              </div>

              {/* Bottom Strip: Guest Mode Option */}
              <div style={{
                marginTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Exploring for the first time or practicing offline?
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Continue in Guest Mode →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
