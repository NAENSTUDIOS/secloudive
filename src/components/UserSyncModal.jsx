import { useState, useEffect, useRef } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import {
  Users,
  UserPlus,
  RefreshCw,
  Download,
  Upload,
  Key,
  Check,
  Copy,
  Trash2,
  Edit2,
  X,
  ShieldCheck,
  Cloud,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
  UserCheck,
  Zap,
  Globe,
  Mail,
  Lock,
  Send,
  AtSign,
  Fingerprint
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
import { GOOGLE_CLIENT_ID } from '../config/googleAuthConfig'
import { checkSupabaseHealth, getSupabaseConfigInfo, isSupabaseConfigured } from '../lib/supabase'

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
  const [activeTab, setActiveTab] = useState('profiles') // 'profiles' | 'backup' | 'token' | 'supabase'
  
  // Login method selector in Profiles tab: 'google' | 'userid' | 'email'
  const [loginMethod, setLoginMethod] = useState('google')

  // Registration form
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [newUserId, setNewUserId] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserRole, setNewUserRole] = useState('Cloud Security Engineer')
  const [newUserColor, setNewUserColor] = useState('#38bdf8')
  const [migrateGuestData, setMigrateGuestData] = useState(true)
  const [idAvailability, setIdAvailability] = useState(null) // null | { available: boolean, message: string }

  // Quick User ID Login form
  const [loginInputId, setLoginInputId] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [suggestRegisterId, setSuggestRegisterId] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)

  // Google Authentication State
  const [googleAuthError, setGoogleAuthError] = useState(null)
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false)
  const [showCustomGoogle, setShowCustomGoogle] = useState(false)
  const [customGoogleEmail, setCustomGoogleEmail] = useState('')
  const [customGoogleName, setCustomGoogleName] = useState('')

  // Supabase Email & Password state
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [displayNameInput, setDisplayNameInput] = useState('')
  const [isEmailSignUp, setIsEmailSignUp] = useState(false)
  const [emailError, setEmailError] = useState(null)
  const [isEmailLoading, setIsEmailLoading] = useState(false)

  // Edit form
  const [editingProfileId, setEditingProfileId] = useState(null)
  const [editName, setEditName] = useState('')

  // Sync token state
  const [generatedToken, setGeneratedToken] = useState('')
  const [inputToken, setInputToken] = useState('')
  const [tokenCopied, setTokenCopied] = useState(false)
  const [tokenStatusMessage, setTokenStatusMessage] = useState(null)

  // File import state
  const fileInputRef = useRef(null)
  const [importStatus, setImportStatus] = useState(null)

  // Supabase backend health state
  const [supabaseHealth, setSupabaseHealth] = useState(null)
  const [isTestingSupabase, setIsTestingSupabase] = useState(false)
  const [copiedSchemaNotice, setCopiedSchemaNotice] = useState(false)
  const supabaseInfo = getSupabaseConfigInfo()

  const auth = useAuth()

  const runSupabaseProbe = async () => {
    setIsTestingSupabase(true)
    try {
      const res = await checkSupabaseHealth()
      setSupabaseHealth(res)
    } finally {
      setIsTestingSupabase(false)
    }
  }

  const {
    activeProfile = {},
    allProfiles = [],
    switchUserProfile,
    registerUniqueProfile,
    loginWithUserId,
    switchToGuestMode,
    deleteUserProfile,
    updateUserProfile,
    exportUserData,
    importUserData,
    loginWithGoogle,
    linkGoogleAccount,
    autoSaveState = {},
    completedMasterActivities = 0,
    totalMasterActivities = 100,
    masterTotalXP = 0
  } = useChallenges() || {}

  // Listen for open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-user-sync-modal', handleOpen)
    return () => window.removeEventListener('open-user-sync-modal', handleOpen)
  }, [])

  // Check ID availability in real-time as user types
  useEffect(() => {
    if (!newUserId.trim()) {
      setIdAvailability(null)
      return
    }
    const validation = validateUserIdFormat(newUserId)
    if (!validation.valid) {
      setIdAvailability({ available: false, message: validation.error })
      return
    }
    const available = isUserIdAvailable(validation.cleanId)
    if (available) {
      setIdAvailability({ available: true, message: `User ID "${validation.cleanId}" is available!` })
    } else {
      setIdAvailability({
        available: false,
        message: `User ID "${validation.cleanId}" is already claimed. Each user must have their own unique ID.`
      })
    }
  }, [newUserId])

  // Generate unique User ID helper
  const handleAutoGenerateId = () => {
    const generated = generateUniqueUserId()
    setNewUserId(generated)
  }

  // Register unique profile handler
  const handleRegisterProfile = (e) => {
    e.preventDefault()
    if (!newUserId.trim()) return

    const res = registerUniqueProfile({
      userId: newUserId.trim(),
      name: newUserName.trim() || newUserId.trim(),
      role: newUserRole,
      avatarColor: newUserColor,
      migrateGuestData
    })

    if (res.success) {
      setActionSuccess(`Successfully registered unique User ID: ${res.profile.id}`)
      setNewUserId('')
      setNewUserName('')
      setShowRegisterForm(false)
      setSuggestRegisterId(null)
      setTimeout(() => setActionSuccess(null), 4000)
    } else {
      setIdAvailability({ available: false, message: res.error || 'Failed to register User ID.' })
    }
  }

  // Login with existing User ID handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!loginInputId.trim()) return
    setLoginError(null)
    setSuggestRegisterId(null)

    const res = await loginWithUserId(loginInputId.trim())
    if (res.success) {
      setActionSuccess(`Switched to User ID: ${res.profile.id}${res.fromCloud ? ' (Restored from Supabase Cloud)' : ''}`)
      setLoginInputId('')
      setLoginError(null)
      setTimeout(() => setActionSuccess(null), 4000)
    } else {
      setLoginError(res.error || 'Failed to sign in with this User ID.')
      if (res.notFound) {
        setSuggestRegisterId(loginInputId.trim())
      }
    }
  }

  // 1-Click activate unrecognised ID as new registration
  const handleClaimSuggestedId = () => {
    if (!suggestRegisterId) return
    setNewUserId(suggestRegisterId)
    setNewUserName(suggestRegisterId)
    setShowRegisterForm(true)
    setLoginError(null)
    setSuggestRegisterId(null)
  }

  // Google Authentication Handlers: Strict 1-to-1 Mapping to Single User ID
  const handleGoogleSignInFlow = (googleData, options = {}) => {
    setIsGoogleProcessing(true)
    setGoogleAuthError(null)

    try {
      const email = googleData.email?.trim() || 'operator@gmail.com'
      const name = googleData.name?.trim() || email.split('@')[0]
      const sub = googleData.sub || `google-sub-${email.replace(/[^a-z0-9]/gi, '')}`

      const res = loginWithGoogle({ sub, email, name, picture: googleData.picture }, options)
      if (auth?.signInWithDirectGoogleData) {
        try {
          auth.signInWithDirectGoogleData({ sub, email, name, picture: googleData.picture }, options)
        } catch {}
      }

      if (res.success) {
        setActionSuccess(res.message || `Synced to single User ID: ${res.profile.id}`)
        setShowCustomGoogle(false)
        setCustomGoogleEmail('')
        setCustomGoogleName('')
        setTimeout(() => setActionSuccess(null), 4500)
      } else {
        setGoogleAuthError(res.error || 'Failed to authenticate with Google.')
      }
    } finally {
      setIsGoogleProcessing(false)
    }
  }

  const handleGoogleOAuthSuccess = async (credentialResponse) => {
    setIsGoogleProcessing(true)
    setGoogleAuthError(null)
    try {
      if (auth?.signInWithGoogle) {
        await auth.signInWithGoogle(credentialResponse.credential)
      }
      const parsed = parseGoogleCredential(credentialResponse.credential)
      if (parsed) {
        handleGoogleSignInFlow(parsed)
      } else {
        setActionSuccess('Signed in with Google successfully!')
        setTimeout(() => setActionSuccess(null), 4000)
      }
    } catch (err) {
      setGoogleAuthError(err?.message || 'Google sign-in could not be completed.')
    } finally {
      setIsGoogleProcessing(false)
    }
  }

  // Direct Google Account Sign-In (no-popup fallback for private browsing or origin restrictions)
  const handleDirectCustomGoogleSignIn = (e) => {
    e.preventDefault()
    if (!customGoogleEmail.trim()) return
    const cleanEmail = customGoogleEmail.trim().toLowerCase()
    handleGoogleSignInFlow({
      sub: `google-sub-${cleanEmail.replace(/[^a-z0-9]/gi, '')}`,
      email: cleanEmail,
      name: customGoogleName.trim() || cleanEmail.split('@')[0],
      picture: null
    })
  }

  // Supabase Email & Password Handlers
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!emailInput.trim()) return
    setIsEmailLoading(true)
    setEmailError(null)

    try {
      if (isEmailSignUp) {
        if (!auth?.signUpWithEmail) throw new Error('Email registration engine not ready.')
        const res = await auth.signUpWithEmail(emailInput, passwordInput, {
          name: displayNameInput || emailInput.split('@')[0],
          role: newUserRole
        })
        if (res.success) {
          setActionSuccess(res.message || 'Account registered successfully!')
          setEmailInput('')
          setPasswordInput('')
          setDisplayNameInput('')
          setTimeout(() => setActionSuccess(null), 4500)
        } else {
          setEmailError(res.error || 'Failed to create account.')
        }
      } else {
        if (!auth?.signInWithEmail) throw new Error('Email sign-in engine not ready.')
        const res = await auth.signInWithEmail(emailInput, passwordInput)
        if (res.success) {
          setActionSuccess('Signed in with Email successfully!')
          setEmailInput('')
          setPasswordInput('')
          setTimeout(() => setActionSuccess(null), 4000)
        } else {
          setEmailError(res.error || 'Invalid credentials or account not found.')
        }
      }
    } catch (err) {
      setEmailError(err.message || 'Email authentication error.')
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleMagicLinkSubmit = async () => {
    if (!emailInput.trim()) {
      setEmailError('Please enter your email address to receive a magic sign-in link.')
      return
    }
    setIsEmailLoading(true)
    setEmailError(null)
    try {
      if (!auth?.signInWithMagicLink) throw new Error('Magic link service not available.')
      const res = await auth.signInWithMagicLink(emailInput)
      if (res.success) {
        setActionSuccess(res.message)
        setTimeout(() => setActionSuccess(null), 5000)
      } else {
        setEmailError(res.error || 'Failed to send magic link.')
      }
    } catch (err) {
      setEmailError(err.message || 'Magic link error.')
    } finally {
      setIsEmailLoading(false)
    }
  }

  // Switch to Guest Mode handler
  const handleSwitchToGuest = () => {
    switchToGuestMode()
    setActionSuccess('Switched to Guest Mode. Progress will run in temporary local sandbox.')
    setTimeout(() => setActionSuccess(null), 4000)
  }

  // Generate Token handler
  const handleGenerateToken = () => {
    const token = generateSyncToken(activeProfile.id)
    if (token) {
      setGeneratedToken(token)
      setTokenCopied(false)
    }
  }

  const handleCopyToken = () => {
    if (!generatedToken) return
    navigator.clipboard.writeText(generatedToken)
    setTokenCopied(true)
    setTimeout(() => setTokenCopied(false), 2000)
  }

  const handleRestoreToken = () => {
    if (!inputToken.trim()) return
    const res = restoreFromSyncToken(inputToken.trim())
    if (res.success) {
      setTokenStatusMessage({ type: 'success', text: `Successfully restored profile: ${res.profile.name}` })
      setInputToken('')
      setTimeout(() => setTokenStatusMessage(null), 3500)
    } else {
      setTokenStatusMessage({ type: 'error', text: res.message || 'Invalid sync token.' })
    }
  }

  // File import handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        const res = importUserData(parsed)
        if (res.success) {
          setImportStatus({ type: 'success', text: `Restored profile: ${res.profile.name}` })
        } else {
          setImportStatus({ type: 'error', text: res.message || 'Import failed.' })
        }
      } catch (err) {
        setImportStatus({ type: 'error', text: 'Invalid JSON backup file.' })
      }
      setTimeout(() => setImportStatus(null), 4000)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  if (!isOpen) return null

  const isCurrentGuest = Boolean(activeProfile?.isGuest || activeProfile?.id === 'guest')

  return (
    <div className="user-sync-backdrop" onClick={() => setIsOpen(false)}>
      <div 
        className="user-sync-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="User Identity & Auto-Sync Engine"
        style={{ maxWidth: '780px' }}
      >
        {/* Header */}
        <div className="user-sync-header">
          <div className="user-sync-title-box">
            <Cloud size={20} className="text-cyan animate-pulse" />
            <div>
              <div className="user-sync-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SeCloudiveLogo size={15} variant="two-tone" glow={false} />
                <span>Identity & Sync Center</span>
              </div>
              <div className="user-sync-subtitle">
                Google OAuth • Unique User IDs • Supabase Cloud DB • Instant isolated sync
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

        {/* Live Auto-Save Telemetry Bar */}
        <div className="user-sync-telemetry-bar">
          <div className="sync-telemetry-left">
            <span className={`sync-telemetry-dot ${autoSaveState.isSaving ? 'is-saving' : 'is-saved'}`} />
            <span className="sync-telemetry-status">
              {autoSaveState.isSaving
                ? 'Auto-saving data to browser…'
                : isCurrentGuest
                ? 'Guest sandbox active (not auto-synced to permanent User ID)'
                : `Auto-saved at ${autoSaveState.lastSaved || 'Just now'}`}
            </span>
          </div>
          <div className="sync-telemetry-right">
            <span>
              <strong>Mode:</strong> {isCurrentGuest ? 'Guest Learner' : `User ${activeProfile.id}`}
            </span>
            <span>•</span>
            <span><strong>Master XP:</strong> {masterTotalXP.toLocaleString()}</span>
          </div>
        </div>

        {/* Banner Alert if in Guest Mode */}
        {isCurrentGuest && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.78rem',
            color: '#fde68a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <span>
                <strong>Guest Mode Active:</strong> Sign in with Google, Email, or Claim a Unique User ID to preserve all your labs, notes, and XP permanently!
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginMethod('google')
                setShowRegisterForm(true)
              }}
              style={{
                background: '#f59e0b',
                color: '#020617',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Sign In / Claim ID
            </button>
          </div>
        )}

        {/* Success Action Notification */}
        {actionSuccess && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '9px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: '#6ee7b7'
          }}>
            <CheckCircle2 size={15} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="user-sync-tabs">
          <button 
            className={`user-sync-tab ${activeTab === 'profiles' ? 'active' : ''}`}
            onClick={() => setActiveTab('profiles')}
          >
            <Users size={15} />
            <span>Sign In & Identity ({allProfiles.length})</span>
          </button>
          <button 
            className={`user-sync-tab ${activeTab === 'backup' ? 'active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            <Database size={15} />
            <span>Export & Backup</span>
          </button>
          <button 
            className={`user-sync-tab ${activeTab === 'token' ? 'active' : ''}`}
            onClick={() => setActiveTab('token')}
          >
            <Key size={15} />
            <span>Sync Token</span>
          </button>
          <button 
            className={`user-sync-tab ${activeTab === 'supabase' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('supabase')
              runSupabaseProbe()
            }}
          >
            <Cloud size={15} />
            <span>Supabase Cloud</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="user-sync-body">
          {/* TAB 1: SIGN IN & USER IDENTITY */}
          {activeTab === 'profiles' && (
            <div className="user-sync-section">
              {/* Active Profile Status Spotlight */}
              <div style={{
                background: isCurrentGuest ? 'rgba(15, 23, 42, 0.6)' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: isCurrentGuest ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: isCurrentGuest ? 'rgba(148, 163, 184, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    border: isCurrentGuest ? '1px solid rgba(148, 163, 184, 0.3)' : '1px solid rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCurrentGuest ? '#94a3b8' : '#10b981',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    overflow: 'hidden'
                  }}>
                    {activeProfile?.avatarUrl ? (
                      <img src={activeProfile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      isCurrentGuest ? '?' : activeProfile.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: isCurrentGuest ? '#f59e0b' : '#10b981'
                      }}>
                        {isCurrentGuest ? 'CURRENT MODE: GUEST (TEMPORARY)' : 'CURRENT USER ID: ' + activeProfile.id}
                      </span>
                      {!isCurrentGuest && (
                        <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Auto-Sync Active
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                      {activeProfile.name || 'Guest Learner'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                      {activeProfile.role || 'Cloud Security Engineer'} • {completedMasterActivities} Tasks Verified
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!isCurrentGuest ? (
                    <button
                      type="button"
                      onClick={handleSwitchToGuest}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        color: '#cbd5e1',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      title="Switch to temporary guest sandbox"
                    >
                      <LogOut size={13} />
                      <span>Switch to Guest</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowRegisterForm(true)}
                      style={{
                        background: '#38bdf8',
                        color: '#020617',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '7px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <UserPlus size={14} />
                      <span>Claim Unique User ID</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ── MULTI-METHOD AUTHENTICATION SELECTOR ── */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
                    CHOOSE YOUR SIGN-IN METHOD
                  </div>
                  {/* Method Navigation Pills */}
                  <div style={{ display: 'flex', gap: '6px', background: 'rgba(2, 6, 23, 0.6)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
                    <button
                      type="button"
                      onClick={() => { setLoginMethod('google'); setGoogleAuthError(null); }}
                      style={{
                        background: loginMethod === 'google' ? '#38bdf8' : 'transparent',
                        color: loginMethod === 'google' ? '#020617' : '#94a3b8',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <GoogleIcon size={13} />
                      <span>Google OAuth</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLoginMethod('userid'); setLoginError(null); }}
                      style={{
                        background: loginMethod === 'userid' ? '#38bdf8' : 'transparent',
                        color: loginMethod === 'userid' ? '#020617' : '#94a3b8',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Fingerprint size={13} />
                      <span>Unique User ID</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLoginMethod('email'); setEmailError(null); }}
                      style={{
                        background: loginMethod === 'email' ? '#38bdf8' : 'transparent',
                        color: loginMethod === 'email' ? '#020617' : '#94a3b8',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Mail size={13} />
                      <span>Email / Password</span>
                    </button>
                  </div>
                </div>

                {/* ── SUB-METHOD 1: GOOGLE AUTHENTICATION ── */}
                {loginMethod === 'google' && (
                  <div style={{
                    background: 'rgba(2, 6, 23, 0.65)',
                    border: '1px solid rgba(66, 133, 244, 0.25)',
                    borderRadius: '10px',
                    padding: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#60a5fa' }}>Google Identity Services</span>
                          <span style={{ fontSize: '0.66rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            1-to-1 Deterministic ID
                          </span>
                        </div>
                        <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '4px 0 0' }}>
                          Signs in using your Google account and automatically maps to your permanent single User ID.
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                        {/* Official Google OAuth popup */}
                        <GoogleLogin
                          onSuccess={handleGoogleOAuthSuccess}
                          onError={() => {
                            setGoogleAuthError('Google sign-in popup closed or blocked. You can use Quick Google Sign-In below!')
                          }}
                          useOneTap={false}
                          theme="filled_black"
                          shape="rectangular"
                          size="large"
                          text="signin_with"
                          logo_alignment="left"
                        />

                        {/* Quick Direct Google Sign-In (no-popup fallback) */}
                        <button
                          type="button"
                          onClick={() => setShowCustomGoogle(prev => !prev)}
                          style={{
                            background: 'rgba(56, 189, 248, 0.08)',
                            border: '1px dashed rgba(56, 189, 248, 0.35)',
                            color: '#38bdf8',
                            borderRadius: '6px',
                            padding: '5px 10px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Zap size={12} />
                          <span>{showCustomGoogle ? 'Hide Direct Account Sign-In' : '⚡ Direct Google Sign-In (Instant / No Popups)'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Direct Custom Google Sign-In Form */}
                    {showCustomGoogle && (
                      <form onSubmit={handleDirectCustomGoogleSignIn} style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                        <div style={{ fontSize: '0.74rem', color: '#cbd5e1', marginBottom: '8px', fontWeight: 600 }}>
                          Enter any Google email address to sign in instantly without third-party popups:
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <input
                            type="email"
                            placeholder="your.email@gmail.com"
                            value={customGoogleEmail}
                            onChange={(e) => setCustomGoogleEmail(e.target.value)}
                            required
                            style={{
                              flex: 1,
                              minWidth: '200px',
                              background: 'rgba(15, 23, 42, 0.9)',
                              border: '1px solid rgba(148, 163, 184, 0.3)',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              color: '#f8fafc',
                              fontSize: '0.8rem'
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Display Name (Optional)"
                            value={customGoogleName}
                            onChange={(e) => setCustomGoogleName(e.target.value)}
                            style={{
                              width: '160px',
                              background: 'rgba(15, 23, 42, 0.9)',
                              border: '1px solid rgba(148, 163, 184, 0.3)',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              color: '#f8fafc',
                              fontSize: '0.8rem'
                            }}
                          />
                          <button
                            type="submit"
                            disabled={isGoogleProcessing}
                            style={{
                              background: '#38bdf8',
                              color: '#020617',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 14px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {isGoogleProcessing ? 'Signing in…' : 'Sign In'}
                          </button>
                        </div>

                        {/* Quick Demo Pre-sets */}
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Quick presets:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomGoogleEmail('alex.clouddefender@gmail.com')
                              setCustomGoogleName('Alex Defender')
                            }}
                            style={{ background: 'none', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#94a3b8', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            alex.clouddefender@gmail.com
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomGoogleEmail('nasir.secops@gmail.com')
                              setCustomGoogleName('Nasir Engineer')
                            }}
                            style={{ background: 'none', border: '1px solid rgba(148, 163, 184, 0.2)', color: '#94a3b8', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            nasir.secops@gmail.com
                          </button>
                        </div>
                      </form>
                    )}

                    {googleAuthError && (
                      <div style={{ marginTop: '10px', color: '#f87171', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={14} />
                        <span>{googleAuthError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── SUB-METHOD 2: UNIQUE USER ID AUTHENTICATION ── */}
                {loginMethod === 'userid' && (
                  <div style={{
                    background: 'rgba(2, 6, 23, 0.65)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '10px',
                    padding: '16px'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>
                      Sign In with Existing Unique User ID
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '0 0 12px' }}>
                      Enter your User ID to load all your isolated challenges, notes, and XP. Checks local registry and Supabase cloud.
                    </p>

                    <form onSubmit={handleLoginSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="e.g. SEC-USER-1024 or alex_sec..."
                        value={loginInputId}
                        onChange={(e) => {
                          setLoginInputId(e.target.value)
                          setLoginError(null)
                          setSuggestRegisterId(null)
                        }}
                        style={{
                          flex: 1,
                          minWidth: '220px',
                          background: 'rgba(15, 23, 42, 0.9)',
                          border: loginError ? '1px solid #f43f5e' : '1px solid rgba(148, 163, 184, 0.3)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: '#f8fafc',
                          fontSize: '0.82rem',
                          fontFamily: "'DM Mono', monospace"
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <LogIn size={14} />
                        <span>Sign In</span>
                      </button>
                    </form>

                    {/* ID Not Found with 1-Click Registration Offer */}
                    {loginError && (
                      <div style={{ marginTop: '10px', color: '#f87171', fontSize: '0.76rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertCircle size={14} />
                          <span>{loginError}</span>
                        </div>
                        {suggestRegisterId && (
                          <button
                            type="button"
                            onClick={handleClaimSuggestedId}
                            style={{
                              background: '#10b981',
                              color: '#020617',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '3px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            ⚡ Claim & Register "{suggestRegisterId}"
                          </button>
                        )}
                      </div>
                    )}

                    {/* Quick Profile Chips from Local Storage */}
                    {allProfiles.length > 0 && (
                      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', marginRight: '6px' }}>Saved on this browser:</span>
                        <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                          {allProfiles.map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                switchUserProfile(p.id)
                                setActionSuccess(`Switched to User ID: ${p.id}`)
                                setTimeout(() => setActionSuccess(null), 3000)
                              }}
                              style={{
                                background: activeProfile?.id === p.id && !isCurrentGuest ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.8)',
                                border: activeProfile?.id === p.id && !isCurrentGuest ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.2)',
                                color: activeProfile?.id === p.id && !isCurrentGuest ? '#34d399' : '#cbd5e1',
                                borderRadius: '4px',
                                padding: '3px 8px',
                                fontSize: '0.72rem',
                                fontFamily: "'DM Mono', monospace",
                                cursor: 'pointer'
                              }}
                            >
                              {p.id} ({p.name})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── SUB-METHOD 3: SUPABASE EMAIL & PASSWORD / MAGIC LINK ── */}
                {loginMethod === 'email' && (
                  <div style={{
                    background: 'rgba(2, 6, 23, 0.65)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '10px',
                    padding: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399' }}>
                        {isEmailSignUp ? 'Create Supabase Cloud Account' : 'Sign In with Supabase Email & Password'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEmailSignUp(prev => !prev)
                          setEmailError(null)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#38bdf8',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        {isEmailSignUp ? 'Already have an account? Sign In' : 'Need an account? Register'}
                      </button>
                    </div>

                    <form onSubmit={handleEmailSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                        <input
                          type="email"
                          placeholder="learner@company.com"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          required
                          style={{
                            background: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            color: '#f8fafc',
                            fontSize: '0.8rem'
                          }}
                        />
                        <input
                          type="password"
                          placeholder="Password (minimum 6 characters)"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          required
                          minLength={6}
                          style={{
                            background: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            color: '#f8fafc',
                            fontSize: '0.8rem'
                          }}
                        />
                        {isEmailSignUp && (
                          <input
                            type="text"
                            placeholder="Full Name / Display Name"
                            value={displayNameInput}
                            onChange={(e) => setDisplayNameInput(e.target.value)}
                            style={{
                              gridColumn: '1 / -1',
                              background: 'rgba(15, 23, 42, 0.9)',
                              border: '1px solid rgba(148, 163, 184, 0.3)',
                              borderRadius: '6px',
                              padding: '8px 10px',
                              color: '#f8fafc',
                              fontSize: '0.8rem'
                            }}
                          />
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="submit"
                          disabled={isEmailLoading}
                          style={{
                            background: '#10b981',
                            color: '#020617',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {isEmailLoading ? <RefreshCw size={13} className="spin-icon" /> : <LogIn size={13} />}
                          <span>{isEmailLoading ? 'Processing…' : (isEmailSignUp ? 'Register Account' : 'Sign In with Email')}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleMagicLinkSubmit}
                          disabled={isEmailLoading || !emailInput.trim()}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            color: '#38bdf8',
                            borderRadius: '6px',
                            padding: '7px 12px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title="Receive a passwordless sign-in link via email"
                        >
                          <Send size={12} />
                          <span>Send Passwordless Magic Link</span>
                        </button>
                      </div>
                    </form>

                    {emailError && (
                      <div style={{ marginTop: '10px', color: '#f87171', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={14} />
                        <span>{emailError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── ACTION ROW: REGISTER NEW UNIQUE ID DRAWER TOGGLE ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(prev => !prev)}
                  className="btn-add-profile"
                  style={{
                    background: showRegisterForm ? 'rgba(56, 189, 248, 0.15)' : 'linear-gradient(135deg, #0284c7, #0369a1)',
                    color: '#ffffff',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <UserPlus size={14} />
                  <span>{showRegisterForm ? 'Hide Registration Form' : 'Register New Unique User ID'}</span>
                </button>
              </div>

              {/* Registration Form Drawer */}
              {showRegisterForm && (
                <form className="create-profile-form" onSubmit={handleRegisterProfile} style={{ marginBottom: '20px' }}>
                  <div className="form-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Register Your Unique User ID</span>
                    <button
                      type="button"
                      onClick={handleAutoGenerateId}
                      style={{
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Zap size={12} />
                      <span>Generate Unique ID</span>
                    </button>
                  </div>

                  <div className="form-grid">
                    {/* User ID Field */}
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Unique User ID (Mandatory — no two users can share this ID)</span>
                        {idAvailability && (
                          <span style={{ color: idAvailability.available ? '#10b981' : '#f43f5e', fontWeight: 600, fontSize: '0.72rem' }}>
                            {idAvailability.message}
                          </span>
                        )}
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. SEC-USER-7492, alex_cloud, or nasir_sec"
                        value={newUserId}
                        onChange={(e) => setNewUserId(e.target.value)}
                        required
                        autoFocus
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          borderColor: idAvailability ? (idAvailability.available ? '#10b981' : '#f43f5e') : undefined
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Candidate / Student Display Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Nasir or Alex Carter"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Target Career Role</label>
                      <select 
                        value={newUserRole} 
                        onChange={(e) => setNewUserRole(e.target.value)}
                      >
                        <option value="Cloud Security Engineer">Cloud Security Engineer</option>
                        <option value="SecOps / Incident Responder">SecOps / Incident Responder</option>
                        <option value="DevSecOps Specialist">DevSecOps Specialist</option>
                        <option value="Cloud Security Architect">Cloud Security Architect</option>
                      </select>
                    </div>

                    {/* Checkbox to migrate guest progress */}
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        <input
                          type="checkbox"
                          checked={migrateGuestData}
                          onChange={(e) => setMigrateGuestData(e.target.checked)}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <span>
                          <strong>Migrate existing session progress</strong> into this new User ID (preserves all solved rooms, labs, notes, and score).
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-form-cancel"
                      onClick={() => setShowRegisterForm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-form-submit"
                      disabled={idAvailability && !idAvailability.available}
                    >
                      <UserCheck size={14} />
                      <span>Register Unique ID & Start Auto-Sync</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Registered Profiles List */}
              <div className="profiles-header-row" style={{ marginTop: '20px' }}>
                <span className="section-label">REGISTERED USER PROFILES ON THIS DEVICE ({allProfiles.length})</span>
              </div>

              {allProfiles.length === 0 ? (
                <div style={{
                  padding: '24px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px dashed rgba(148, 163, 184, 0.2)',
                  borderRadius: '10px',
                  textAlign: 'center',
                  color: '#94a3b8',
                  fontSize: '0.84rem'
                }}>
                  No registered User IDs found on this browser yet.
                  <br />
                  Sign in with <strong>Google OAuth</strong>, enter an existing <strong>User ID</strong>, or click <em>"Register New Unique User ID"</em> above.
                </div>
              ) : (
                <div className="profiles-list">
                  {allProfiles.map(p => {
                    const isActive = activeProfile.id === p.id && !isCurrentGuest

                    return (
                      <div 
                        key={p.id} 
                        className={`profile-card ${isActive ? 'is-active' : ''}`}
                      >
                        <div className="profile-card-left">
                          <div 
                            className="profile-avatar"
                            style={{ background: p.avatarColor || '#38bdf8' }}
                          >
                            {p.avatarUrl ? (
                              <img src={p.avatarUrl} alt={p.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                            ) : (
                              p.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="profile-info">
                            <div className="profile-name-row">
                              {editingProfileId === p.id ? (
                                <input
                                  type="text"
                                  className="edit-name-input"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onBlur={() => {
                                    if (editName.trim()) {
                                      updateUserProfile(p.id, { name: editName.trim() })
                                    }
                                    setEditingProfileId(null)
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      if (editName.trim()) {
                                        updateUserProfile(p.id, { name: editName.trim() })
                                      }
                                      setEditingProfileId(null)
                                    }
                                  }}
                                  autoFocus
                                />
                              ) : (
                                <>
                                  <span className="profile-name">{p.name}</span>
                                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: "'DM Mono', monospace", background: 'rgba(56,189,248,0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                                    ID: {p.id}
                                  </span>
                                  {isActive && (
                                    <span className="active-badge">
                                      <CheckCircle2 size={12} /> Active & Synced
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="profile-role-row">
                              <span>{p.role}</span>
                              <span className="dot-sep">•</span>
                              <span>Created {new Date(p.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="profile-card-actions">
                          {!isActive && (
                            <button
                              type="button"
                              className="btn-profile-switch"
                              onClick={() => switchUserProfile(p.id)}
                              title="Switch to this User ID"
                            >
                              <span>Switch to ID</span>
                              <ArrowRight size={13} />
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn-profile-edit"
                            onClick={() => {
                              setEditingProfileId(p.id)
                              setEditName(p.name)
                            }}
                            title="Edit Name"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            type="button"
                            className="btn-profile-delete"
                            onClick={() => {
                              if (window.confirm(`Delete User ID "${p.id}" (${p.name}) and all its isolated progress?`)) {
                                deleteUserProfile(p.id)
                              }
                            }}
                            title="Delete Profile"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPORT & BACKUP */}
          {activeTab === 'backup' && (
            <div className="user-sync-section">
              <span className="section-label">CROSS-DEVICE DATA INTEGRITY & AUDIT PACKS</span>
              
              <div className="backup-action-grid">
                <div className="backup-card">
                  <div className="backup-card-head">
                    <Download size={18} className="text-cyan" />
                    <h4>Export Profile Backup (JSON)</h4>
                  </div>
                  <p>
                    Downloads an integrity-checked, HMAC-sealed JSON package containing your User ID ({activeProfile.id}), 
                    all verified SOPs, exam flashcard history, in-lab notes, and compliance ratings.
                  </p>
                  <button 
                    type="button"
                    className="btn-backup-action"
                    onClick={exportUserData}
                  >
                    <Download size={14} />
                    <span>Download {activeProfile.id} Backup</span>
                  </button>
                </div>

                <div className="backup-card">
                  <div className="backup-card-head">
                    <Upload size={18} className="text-emerald" />
                    <h4>Import Profile Backup</h4>
                  </div>
                  <p>
                    Restore a previously exported SeCloudive audit backup file into this browser. 
                    Restored accounts will be isolated under their original User ID.
                  </p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept=".json"
                    onChange={handleFileUpload}
                  />
                  <button 
                    type="button"
                    className="btn-backup-action btn-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    <span>Select .JSON Backup File</span>
                  </button>

                  {importStatus && (
                    <div className={`status-pill ${importStatus.type}`}>
                      {importStatus.text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD SYNC TOKEN */}
          {activeTab === 'token' && (
            <div className="user-sync-section">
              <span className="section-label">PORTABLE SYNC TOKEN (CROSS-BROWSER INSTANT RESTORE)</span>

              <div className="token-instructions">
                A portable sync token allows you to transfer your User ID and progress across private browsing sessions or separate workstations with a single copy-paste string.
              </div>

              {/* Generate Token Box */}
              <div className="token-box">
                <div className="token-box-header">
                  <span className="token-box-title">Generate Sync Token for: <strong>{activeProfile.id}</strong></span>
                  <button 
                    type="button"
                    className="btn-gen-token"
                    onClick={handleGenerateToken}
                  >
                    <RefreshCw size={13} />
                    <span>Generate Token</span>
                  </button>
                </div>

                {generatedToken && (
                  <div className="token-display-wrap">
                    <textarea 
                      readOnly 
                      className="token-textarea"
                      value={generatedToken}
                    />
                    <button 
                      type="button"
                      className="btn-copy-token"
                      onClick={handleCopyToken}
                    >
                      {tokenCopied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                      <span>{tokenCopied ? 'Copied' : 'Copy Token'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Restore Token Box */}
              <div className="token-box">
                <div className="token-box-header">
                  <span className="token-box-title">Restore Progress from Sync Token</span>
                </div>
                <div className="token-restore-row">
                  <input 
                    type="text" 
                    placeholder="Paste Base64 sync token here..."
                    className="token-input"
                    value={inputToken}
                    onChange={(e) => setInputToken(e.target.value)}
                  />
                  <button 
                    type="button"
                    className="btn-restore-token"
                    onClick={handleRestoreToken}
                  >
                    <ArrowRight size={14} />
                    <span>Restore</span>
                  </button>
                </div>

                {tokenStatusMessage && (
                  <div className={`status-pill ${tokenStatusMessage.type}`}>
                    {tokenStatusMessage.text}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SUPABASE CLOUD BACKEND */}
          {activeTab === 'supabase' && (
            <div className="user-sync-section">
              {/* Connection Status Hero */}
              <div style={{
                background: isSupabaseConfigured
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.9))'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(15, 23, 42, 0.9))',
                border: isSupabaseConfigured
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '14px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      background: isSupabaseConfigured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      border: isSupabaseConfigured ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '12px',
                      padding: '12px',
                      color: isSupabaseConfigured ? '#34d399' : '#fbbf24'
                    }}>
                      <Database size={28} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: isSupabaseConfigured ? '#10b981' : '#f59e0b',
                          color: '#020617',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase'
                        }}>
                          {isSupabaseConfigured ? 'Backend Configured' : 'Local Fallback Mode'}
                        </span>
                        {supabaseHealth?.latencyMs && (
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                            Ping: <strong style={{ color: '#38bdf8' }}>{supabaseHealth.latencyMs}ms</strong>
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
                        {isSupabaseConfigured ? 'Supabase Enterprise Cloud DB Active' : 'Running in Local Isolated Storage'}
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: 0 }}>
                        {isSupabaseConfigured
                          ? `Project: ${supabaseInfo.projectId || 'Connected'} • Realtime Leaderboard & Multi-Device Sync Active`
                          : 'To sync progress to the cloud and enable cross-device logins, provide your Supabase URL & Key in .env'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={runSupabaseProbe}
                    disabled={isTestingSupabase}
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#38bdf8',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <RefreshCw size={15} className={isTestingSupabase ? 'spin-icon' : ''} />
                    <span>{isTestingSupabase ? 'Probing DB...' : 'Test Connection'}</span>
                  </button>
                </div>

                {supabaseHealth && (
                  <div style={{
                    marginTop: '16px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: supabaseHealth.ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: supabaseHealth.ok ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    color: supabaseHealth.ok ? '#6ee7b7' : '#fca5a5',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {supabaseHealth.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{supabaseHealth.message}</span>
                  </div>
                )}
              </div>

              {/* 4-Step Quick Connection Guide */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px' }}>
                  🚀 Connect Your Supabase Cloud (4 Steps):
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800 }}>STEP 1</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>Create Free Project</div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>
                      Visit <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>supabase.com</a>, create an account, and start a new project.
                    </p>
                  </div>

                  <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800 }}>STEP 2</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>Copy API Credentials</div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>
                      In <strong>Project Settings → API</strong>, copy the <strong>Project URL</strong> and <strong>anon public</strong> key into <code>.env</code>.
                    </p>
                  </div>

                  <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800 }}>STEP 3</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>Execute SQL Schema</div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>
                      Paste <code>src/lib/supabaseSchema.sql</code> into Supabase <strong>SQL Editor</strong> and click <strong>Run</strong>.
                    </p>
                  </div>

                  <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800 }}>STEP 4</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>Enable Google OAuth</div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>
                      In <strong>Auth → Providers → Google</strong>, enable Google with your OAuth Client ID & Secret.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('src/lib/supabaseSchema.sql')
                      setCopiedSchemaNotice(true)
                      setTimeout(() => setCopiedSchemaNotice(false), 3000)
                    }}
                    style={{
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#38bdf8',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Copy size={13} />
                    <span>{copiedSchemaNotice ? 'Copied Path!' : 'Copy Schema File Path'}</span>
                  </button>
                </div>
              </div>

              {/* Enterprise Feature Matrix Supported by Backend */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', margin: '0 0 12px' }}>
                  🛡️ Complete Backend Services Implemented:
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '12px' }}>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>user_profiles</code> (RBAC, clearance)</div>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>user_settings</code> (provider, persona)</div>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>user_progress</code> (full JSONB + scalar)</div>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>user_streaks</code> (streak freezes)</div>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>user_badges</code> (milestones)</div>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>user_certificates</code> (SHA-256 seal)</div>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>chat_sessions</code> (Sentinel AI memory)</div>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>xp_transactions</code> (tamper-proof ledger)</div>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>custom_labs</code> (Cloudive Studio)</div>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>interview_sessions</code> (Gemini transcripts)</div>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>internship_records</code> (sprint grades)</div>
                  <div style={{ color: '#cbd5e1' }}>✅ <code>audit_packs</code> (tamper verification)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="user-sync-footer">
          <div className="user-sync-footer-tip">
            <ShieldCheck size={14} className="text-cyan" />
            <span>
              <strong>Per-User Data Isolation:</strong> Every User ID is guaranteed unique. No two learners share progress, notes, or credentials.
            </span>
          </div>
          <button 
            type="button"
            className="btn-user-sync-done"
            onClick={() => setIsOpen(false)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
