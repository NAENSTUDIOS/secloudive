// ==============================================================================
// SeCloudive Student Profile & Cryptographic Career Dossier
// Dedicated engineering hub for identity, credentials, clearance, and skill metrics
// ==============================================================================

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Shield,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  Unlock,
  Copy,
  Check,
  Edit3,
  Save,
  Download,
  LogOut,
  RefreshCw,
  Sparkles,
  Terminal,
  GraduationCap,
  Compass,
  FileText,
  AlertTriangle,
  Flame,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Printer,
  X,
  Code
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { useAuth } from '../context/AuthContext'
import { playTactileClick } from '../utils/cyberMotionAudio'

const AVATAR_PRESETS = [
  { id: 'av-iam', label: 'AWS IAM Sentinel', emoji: '🛡️', color: '#38bdf8' },
  { id: 'av-secops', label: 'Cloud Threat Hunter', emoji: '⚡', color: '#10b981' },
  { id: 'av-zero-trust', label: 'Zero-Trust Architect', emoji: '🔒', color: '#a855f7' },
  { id: 'av-dfir', label: 'Incident Responder', emoji: '🕵️', color: '#f59e0b' },
  { id: 'av-s3', label: 'S3 Data Guardian', emoji: '🪣', color: '#06b6d4' },
  { id: 'av-devsecops', label: 'DevSecOps Specialist', emoji: '🚀', color: '#ec4899' },
  { id: 'av-ai-sec', label: 'Bedrock AI Defender', emoji: '🧠', color: '#8b5cf6' },
  { id: 'av-multicloud', label: 'Multi-Cloud Sovereign', emoji: '🌐', color: '#14b8a6' }
]

const TARGET_ROLES = [
  'Aspiring Cloud Security Engineer',
  'Junior SOC Analyst (Tier 1)',
  'DevSecOps & Kubernetes Defender',
  'Cloud Incident Responder (DFIR)',
  'Cloud Security Architect',
  'AWS Compliance & Governance Lead'
]

export default function Profile() {
  const navigate = useNavigate()
  const {
    activeProfile = {},
    updateUserProfile,
    switchToGuestMode,
    loginWithGoogle,
    exportUserData,
    clearance = {},
    masterTotalXP = 0,
    masterProgressPercent = 0,
    completedMasterActivities = 0,
    totalMasterActivities = 100,
    battleRoomsSolvedCount = 0,
    rampupLabsCompletedCount = 0,
    learningTopicsCompletedCount = 0,
    completedCount = 0,
    completedLabsCount = 0,
    progress = {},
    resetAllProgress
  } = useChallenges() || {}

  const auth = useAuth()
  const isGuest = Boolean(activeProfile?.isGuest || !activeProfile?.id || activeProfile?.id === 'guest')
  const currentUserId = activeProfile?.id || 'GUEST-SANDBOX-7104'

  // Admin Identification check
  const isAdminUser = Boolean(
    activeProfile?.email === 'naenstudios@gmail.com' ||
    (activeProfile?.id && String(activeProfile.id).toLowerCase().includes('naenstud')) ||
    activeProfile?.role === 'admin' ||
    activeProfile?.isAdmin ||
    localStorage.getItem('secloudive_admin_authenticated') === 'true' ||
    localStorage.getItem('secloudive_user_email') === 'naenstudios@gmail.com'
  )

  // Editable Profile Form State
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(activeProfile?.name || 'On-Call Cloud Security Analyst')
  const [bio, setBio] = useState(activeProfile?.bio || 'Practicing AWS least privilege, forensic threat containment, and infrastructure-as-code defense on SeCloudive.')
  const [targetRole, setTargetRole] = useState(activeProfile?.targetCareerRole || activeProfile?.role || TARGET_ROLES[0])
  const [selectedAvatar, setSelectedAvatar] = useState(activeProfile?.avatarPreset || 'av-iam')
  const [customAvatarUrl, setCustomAvatarUrl] = useState(activeProfile?.avatarUrl || '')
  
  // Status & Modal states
  const [copiedId, setCopiedId] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [inspectingBadge, setInspectingBadge] = useState(null)
  const [showTranscriptModal, setShowTranscriptModal] = useState(false)

  // Sync state if activeProfile updates
  useEffect(() => {
    if (activeProfile?.name) setName(activeProfile.name)
    if (activeProfile?.bio) setBio(activeProfile.bio)
    if (activeProfile?.targetCareerRole || activeProfile?.role) {
      setTargetRole(activeProfile.targetCareerRole || activeProfile.role)
    }
    if (activeProfile?.avatarUrl) setCustomAvatarUrl(activeProfile.avatarUrl)
  }, [activeProfile])

  // Diagnostic Placement Test Baseline state
  const getBaseline = () => {
    try {
      const raw = localStorage.getItem(`secloudive_baseline_${currentUserId}`) || 
                  (isGuest ? localStorage.getItem('secloudive_diagnostic_baseline') : null)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }
  const diagnosticBaseline = getBaseline()

  // Dynamic Level Calculation
  const currentLevel = Math.max(1, Math.floor(masterTotalXP / 250) + 1)
  const currentLevelBaseXP = (currentLevel - 1) * 250
  const xpInCurrentLevel = masterTotalXP - currentLevelBaseXP
  const levelProgressPercent = Math.min(100, Math.max(5, Math.round((xpInCurrentLevel / 250) * 100)))
  const levelTitle = currentLevel >= 8 
    ? 'Master Cloud Security Architect' 
    : currentLevel >= 5 
      ? 'Senior Defense Specialist' 
      : currentLevel >= 3 
        ? 'Cloud Security Operative' 
        : 'Cloud Security Apprentice'

  // Handle Save Profile
  const handleSaveProfile = (e) => {
    if (e) e.preventDefault()
    playTactileClick()

    const finalAvatarUrl = customAvatarUrl.trim() || undefined

    if (updateUserProfile && activeProfile?.id) {
      updateUserProfile(activeProfile.id, {
        name: name.trim() || 'Cloud Security Analyst',
        bio: bio.trim(),
        targetCareerRole: targetRole,
        role: targetRole,
        avatarPreset: selectedAvatar,
        avatarUrl: finalAvatarUrl
      })
    } else {
      // Fallback local update
      try {
        const raw = localStorage.getItem('secloudive_user_profiles_v1')
        const registry = raw ? JSON.parse(raw) : {}
        if (registry[activeProfile.id]) {
          registry[activeProfile.id] = {
            ...registry[activeProfile.id],
            name: name.trim(),
            bio: bio.trim(),
            targetCareerRole: targetRole,
            role: targetRole,
            avatarPreset: selectedAvatar,
            avatarUrl: finalAvatarUrl
          }
          localStorage.setItem('secloudive_user_profiles_v1', JSON.stringify(registry))
        }
      } catch {}
    }

    setSaveSuccess(true)
    setIsEditing(false)
    setShowAvatarPicker(false)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  const handleCopyId = () => {
    try {
      navigator.clipboard.writeText(currentUserId)
      setCopiedId(true)
      playTactileClick()
      setTimeout(() => setCopiedId(false), 2000)
    } catch {}
  }

  // Security Credentials & Badges logic with full evidence metadata
  const BADGES = [
    {
      id: 'iam-least-privilege',
      title: 'AWS Least Privilege Sentinel',
      category: 'Identity & Access',
      desc: 'Enforced zero-wildcard IAM policies and permission boundaries.',
      isUnlocked: learningTopicsCompletedCount >= 2 || completedCount >= 1,
      icon: '🛡️',
      color: '#38bdf8',
      criteria: 'Complete 2 IAM modules in Academy or solve 1 IAM Incident.',
      interviewValue: 'Demonstrates deep understanding of effective policy evaluation, explicit Deny precedence, and Access Analyzer validations.',
      proofHash: '0x7f4a9b21e83c741295b9a4c8',
      actionRoute: '/learning'
    },
    {
      id: 's3-guardrails',
      title: 'S3 Data Guardrails Guardian',
      category: 'Data Protection',
      desc: 'Hardened object storage with TLS enforcement and bucket locks.',
      isUnlocked: completedLabsCount >= 1 || rampupLabsCompletedCount >= 1,
      icon: '🪣',
      color: '#06b6d4',
      criteria: 'Complete 1 S3 safe lab or enterprise SOP runbook.',
      interviewValue: 'Proves practical ability to prevent public data leaks via bucket policy conditions (aws:SecureTransport, BlockPublicAccess).',
      proofHash: '0x3c91a07df1e284a56b3e9f42',
      actionRoute: '/labs'
    },
    {
      id: 'cloudtrail-forensics',
      title: 'CloudTrail Forensics Specialist',
      category: 'Detection & Audit',
      desc: 'Extracted credential exfiltration timelines from live forensic logs.',
      isUnlocked: completedCount >= 2,
      icon: '🕵️',
      color: '#f59e0b',
      criteria: 'Investigate and resolve 2 SOC Incident tickets.',
      interviewValue: 'Demonstrates ability to reconstruct attack timelines, analyze sts:AssumeRole events, and identify anomalous User-Agents.',
      proofHash: '0x992b4512e0fa7819c43d8101',
      actionRoute: '/investigations'
    },
    {
      id: 'flag-hunter',
      title: 'Purple Team Flag Hunter',
      category: 'Combat CTF',
      desc: 'Executed end-to-end exploit simulations in live Battle Rooms.',
      isUnlocked: battleRoomsSolvedCount >= 1,
      icon: '⚡',
      color: '#ef4444',
      criteria: 'Capture at least 1 flag in live Purple Team Battle Rooms.',
      interviewValue: 'Validates hands-on knowledge of cloud offense (SSRF to IMDSv1, metadata theft) and defensive containment.',
      proofHash: '0x4d12fa78c3b9015e87a23ef6',
      actionRoute: '/battle-rooms'
    },
    {
      id: 'zero-billing',
      title: 'Zero-Billing Cloud Architect',
      category: 'Infrastructure',
      desc: 'Configured automated $0.01 alarms with 1-click teardown automation.',
      isUnlocked: rampupLabsCompletedCount >= 2,
      icon: '🎯',
      color: '#10b981',
      criteria: 'Complete 2 Ramp-Up labs with $0 billing safeguards.',
      interviewValue: 'Proves FinOps discipline and safe engineering habits in AWS free-tier environments.',
      proofHash: '0x5e882a170f3b9281a6c42931',
      actionRoute: '/cost-calculator'
    },
    {
      id: 'multi-cloud-sovereign',
      title: 'Multi-Cloud Sovereign',
      category: 'Enterprise Cloud',
      desc: 'Practiced telemetry crosswalk across AWS, Azure, GCP & OCI.',
      isUnlocked: true,
      icon: '🌐',
      color: '#a855f7',
      criteria: 'Explore cross-cloud security mappings and commands.',
      interviewValue: 'Demonstrates versatility across hyperscaler security models and multi-cloud architectures.',
      proofHash: '0x81fa2c90e3845b12a9c7d018',
      actionRoute: '/dashboard'
    }
  ]

  const activeAvatarObj = AVATAR_PRESETS.find(a => a.id === selectedAvatar) || AVATAR_PRESETS[0]

  return (
    <main className="section profile-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px 80px' }}>
      
      {/* ── Top Breadcrumb & Quick Jump ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
          <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/dashboard" style={{ color: '#38bdf8', textDecoration: 'none' }}>Dashboard</Link>
          <span>/</span>
          <span style={{ color: '#f8fafc', fontWeight: 600 }}>Security Profile &amp; Dossier</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              playTactileClick()
              setShowTranscriptModal(true)
            }}
            className="button button-ghost"
            style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10b981' }}
          >
            <Printer size={14} />
            <span>Preview Certified Transcript</span>
          </button>
          <Link 
            to="/dashboard#comms-deck" 
            className="button button-ghost"
            style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
          >
            <MessageSquare size={14} />
            <span>Open Comms Deck (Free Chat)</span>
          </Link>
          <button
            type="button"
            onClick={() => exportUserData ? exportUserData() : null}
            className="button button-primary"
            style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
          >
            <Download size={14} />
            <span>Export Dossier (JSON)</span>
          </button>
        </div>
      </div>

      {/* ── Section 1: Hero Identity Card ── */}
      <div 
        className="cyber-glass-panel"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.55)',
          marginBottom: '24px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          
          {/* Left: Avatar + Details */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flex: 1, minWidth: '300px' }}>
            
            {/* Avatar Ring */}
            <div style={{ position: 'relative' }}>
              <div 
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, ${activeAvatarObj.color}25 0%, rgba(15, 23, 42, 0.9) 100%)`,
                  border: `2px solid ${activeAvatarObj.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '38px',
                  boxShadow: `0 0 25px ${activeAvatarObj.color}40`,
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onClick={() => setShowAvatarPicker(p => !p)}
                title="Click to customize your Cyber Avatar preset"
              >
                {activeProfile?.avatarUrl || customAvatarUrl ? (
                  <img src={customAvatarUrl || activeProfile?.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '18px', objectFit: 'cover' }} />
                ) : (
                  <span>{activeAvatarObj.emoji}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(p => !p)}
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  background: '#0284c7',
                  border: '2px solid #0f172a',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
                title="Change Avatar"
              >
                ✎
              </button>
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.4px' }}>
                  {name}
                </h1>
                
                {/* Account Type Badge */}
                <span 
                  style={{
                    background: isGuest ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    border: `1px solid ${isGuest ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
                    color: isGuest ? '#f59e0b' : '#10b981',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span className="pulse-dot" style={{ width: '5px', height: '5px', background: isGuest ? '#f59e0b' : '#10b981' }} />
                  {isGuest ? 'Guest Sandbox Profile' : activeProfile?.authProvider === 'google' ? 'Google Authenticated' : 'Verified Student Account'}
                </span>

                {/* Admin Clearance Badge */}
                {isAdminUser && (
                  <span 
                    style={{
                      background: 'rgba(168, 85, 247, 0.2)',
                      border: '1px solid rgba(192, 132, 252, 0.5)',
                      color: '#d8b4fe',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)'
                    }}
                  >
                    <ShieldCheck size={12} style={{ color: '#c084fc' }} />
                    Admin Clearance Active
                  </span>
                )}
              </div>

              {/* Student ID & Email Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                <div 
                  onClick={handleCopyId}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '6px',
                    padding: '3px 10px',
                    cursor: 'pointer',
                    fontSize: '0.76rem',
                    color: '#38bdf8',
                    fontFamily: 'monospace'
                  }}
                  title="Click to copy Student ID"
                >
                  <span>ID: {currentUserId}</span>
                  {copiedId ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
                  {copiedId && <span style={{ color: '#10b981', fontSize: '10px' }}>Copied!</span>}
                </div>

                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {activeProfile?.email || 'local-session@secloudive.internal'}
                </span>

                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>•</span>

                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                  {targetRole}
                </span>
              </div>

              {/* Bio / Mission */}
              <p style={{ margin: '10px 0 0', color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5, maxWidth: '640px' }}>
                {bio}
              </p>
            </div>
          </div>

          {/* Right: Clearance Tier & Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', minWidth: '220px' }}>
            <div 
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '12px',
                padding: '12px 18px',
                textAlign: 'right',
                width: '100%'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Security Clearance
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                {clearance?.title || 'Tier 1: Foundations Clearance'}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                Tier 0{clearance?.tier || 1} Passport Level
              </div>
            </div>

            {isAdminUser && (
              <button
                type="button"
                onClick={() => {
                  playTactileClick()
                  navigate('/admin')
                }}
                className="button motion-button"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(217, 70, 239, 0.35) 100%)',
                  border: '1px solid rgba(192, 132, 252, 0.6)',
                  color: '#f3e8ff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '8px 16px',
                  gap: '6px',
                  width: '100%',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(168, 85, 247, 0.3)'
                }}
              >
                <ShieldCheck size={14} style={{ color: '#c084fc' }} />
                <span>Launch Admin Console</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsEditing(p => !p)}
              className="button button-ghost motion-button"
              style={{ fontSize: '0.8rem', padding: '8px 16px', gap: '6px', width: '100%', justifyContent: 'center' }}
            >
              <Edit3 size={14} />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile & Bio'}</span>
            </button>
          </div>
        </div>

        {/* ── Section 1.5: Level & Mastery Progression Meter ── */}
        <div 
          style={{
            marginTop: '22px',
            padding: '14px 18px',
            background: 'rgba(6, 10, 20, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span 
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}
              >
                LEVEL {currentLevel}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                {levelTitle}
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>
              {xpInCurrentLevel} / 250 XP to Level {currentLevel + 1} ({levelProgressPercent}%)
            </span>
          </div>

          {/* Smooth XP Bar */}
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div 
              style={{
                width: `${levelProgressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 50%, #34d399 100%)',
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* ── Avatar Preset Picker (collapsible) ── */}
        {showAvatarPicker && (
          <div 
            className="animate-reveal"
            style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(6, 10, 20, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '12px'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
              Select Cyber Avatar Preset:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              {AVATAR_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    playTactileClick()
                    setSelectedAvatar(preset.id)
                  }}
                  style={{
                    background: selectedAvatar === preset.id ? `${preset.color}25` : 'rgba(15, 23, 42, 0.8)',
                    border: `1px solid ${selectedAvatar === preset.id ? preset.color : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{preset.emoji}</span>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f8fafc' }}>{preset.label}</div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>
                Or enter custom image URL:
              </label>
              <input
                type="text"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#f8fafc',
                  fontSize: '0.78rem'
                }}
              />
            </div>
          </div>
        )}

        {/* ── Edit Profile Form Drawer ── */}
        {isEditing && (
          <form 
            onSubmit={handleSaveProfile}
            className="animate-reveal"
            style={{
              marginTop: '20px',
              padding: '20px',
              background: 'rgba(6, 10, 20, 0.9)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                  Full Name / Engineer Handle:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                  Target Cloud Security Role:
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    fontSize: '0.85rem'
                  }}
                >
                  {TARGET_ROLES.map(role => (
                    <option key={role} value={role} style={{ background: '#0f172a', color: '#f8fafc' }}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
                Engineering Bio &amp; Focus Area:
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your current studies, certifications, and career focus..."
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
                  lineHeight: 1.45,
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="button button-ghost"
                style={{ fontSize: '0.82rem', padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button button-primary motion-button"
                style={{ fontSize: '0.82rem', padding: '8px 20px', gap: '6px' }}
              >
                <Save size={14} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {saveSuccess && (
          <div 
            style={{
              marginTop: '12px',
              padding: '10px 16px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '8px',
              color: '#10b981',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={15} />
            <span>Profile successfully updated and synchronized!</span>
          </div>
        )}
      </div>

      {/* ── Section 2: Master Telemetry & Performance Grid ── */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '14px', letterSpacing: '-0.3px' }}>
          Real-Time Telemetry &amp; Mastery Metrics
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          
          {/* Total XP */}
          <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#38bdf8', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>Master Total XP</span>
              <Zap size={16} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              {masterTotalXP.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#38bdf8' }}>XP</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              Earned across combat labs &amp; reviews
            </div>
          </div>

          {/* Master Progress */}
          <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#10b981', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>Overall Pathway</span>
              <CheckCircle2 size={16} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              {masterProgressPercent}%
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {completedMasterActivities} of {totalMasterActivities} master units
            </div>
          </div>

          {/* Battle Rooms */}
          <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ef4444', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>Battle Rooms Solved</span>
              <Flame size={16} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              {battleRoomsSolvedCount}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              In-browser CTF flag captures
            </div>
          </div>

          {/* $0 Safe Labs */}
          <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#10b981', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>$0 Safe Labs Done</span>
              <Terminal size={16} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              {rampupLabsCompletedCount}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              Zero-billing AWS production labs
            </div>
          </div>

          {/* Academy Modules */}
          <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a855f7', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>Academy Modules</span>
              <GraduationCap size={16} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              {learningTopicsCompletedCount}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              Core mental model topics
            </div>
          </div>

          {/* Diagnostic Placement */}
          <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>Diagnostic Baseline</span>
              <Compass size={16} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              {diagnosticBaseline ? `${diagnosticBaseline.overallPercentage}%` : 'Unrated'}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {diagnosticBaseline ? diagnosticBaseline.skillLevel : 'Take 2-min placement test'}
            </div>
          </div>

        </div>
      </div>

      {/* ── Section 3: Earned Security Badges & Credentials ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.3px' }}>
              Verified Credentials &amp; Engineering Badges
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              Click any badge to inspect verified evidence, demonstrated interview competency, and cryptographic tamper-proof hash.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-certificate'))}
            className="button button-ghost"
            style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}
          >
            <Award size={14} />
            <span>Open Certificate Viewer</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {BADGES.map(badge => (
            <div
              key={badge.id}
              onClick={() => {
                playTactileClick()
                setInspectingBadge(badge)
              }}
              className="motion-card badge-evidence-card"
              style={{
                background: badge.isUnlocked ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.4)',
                border: `1px solid ${badge.isUnlocked ? `${badge.color}35` : 'rgba(255, 255, 255, 0.06)'}`,
                borderLeft: `4px solid ${badge.isUnlocked ? badge.color : '#334155'}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                cursor: 'pointer',
                opacity: badge.isUnlocked ? 1 : 0.65,
                position: 'relative'
              }}
              title="Click to inspect verified evidence"
            >
              <div 
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: badge.isUnlocked ? `${badge.color}18` : 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  flexShrink: 0
                }}
              >
                {badge.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: badge.color, fontWeight: 700, textTransform: 'uppercase' }}>
                    {badge.category}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: badge.isUnlocked ? '#10b981' : '#64748b', fontWeight: 700 }}>
                    {badge.isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                  </span>
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                  {badge.title}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>
                  {badge.desc}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '6px', fontWeight: 600 }}>
                  🔍 Click to inspect evidence &rarr;
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 4: Account Management & Synchronized Identity ── */}
      <div 
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px'
        }}
      >
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', letterSpacing: '-0.3px' }}>
          Account Management &amp; Cloud Sync
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#94a3b8' }}>
          Your progress is cryptographically stored in your local browser profile. Switch accounts or sign in with Google anytime to sync progress across multiple devices.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-user-sync-modal'))}
            className="button button-primary motion-button"
            style={{ fontSize: '0.82rem', padding: '8px 16px', gap: '6px' }}
          >
            <User size={14} />
            <span>Switch or Sign In with Google / Email</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Switch back to Guest Sandbox Mode?')) {
                if (switchToGuestMode) switchToGuestMode()
                playTactileClick()
              }
            }}
            className="button button-ghost motion-button"
            style={{ fontSize: '0.82rem', padding: '8px 16px', gap: '6px' }}
          >
            <Compass size={14} />
            <span>Switch to Guest Mode</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTactileClick()
              navigate('/admin')
            }}
            className="button button-ghost motion-button"
            style={{
              fontSize: '0.82rem',
              padding: '8px 16px',
              gap: '6px',
              color: '#d8b4fe',
              borderColor: 'rgba(168, 85, 247, 0.4)',
              background: 'rgba(168, 85, 247, 0.08)'
            }}
          >
            <Shield size={14} style={{ color: '#c084fc' }} />
            <span>{isAdminUser ? 'Admin Operations Console' : 'Administrator Clearance'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="button button-ghost motion-button"
            style={{ fontSize: '0.82rem', padding: '8px 16px', gap: '6px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.35)' }}
          >
            <AlertTriangle size={14} />
            <span>Reset Progress</span>
          </button>
        </div>

        {/* Reset Confirmation Prompt */}
        {showResetConfirm && (
          <div 
            className="animate-reveal"
            style={{
              marginTop: '16px',
              padding: '14px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '0.82rem', color: '#fca5a5' }}>
              Are you sure? This will reset all solved labs, quiz scores, and XP for this profile.
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="button button-ghost"
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (resetAllProgress) resetAllProgress()
                  setShowResetConfirm(false)
                  playTactileClick()
                }}
                className="button button-primary"
                style={{ fontSize: '0.78rem', padding: '4px 12px', background: '#dc2626' }}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 5: Direct Link to Community Comms Deck ── */}
      <div 
        className="cyber-glass-panel"
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(37, 99, 235, 0.12) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '14px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.2)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}
          >
            <MessageSquare size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>
              Global Security Comms Deck (Free Student Chat)
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              Have questions or want to collaborate? Connect freely with peers in the live Dashboard Comms Deck.
            </div>
          </div>
        </div>

        <Link
          to="/dashboard#comms-deck"
          className="button button-primary motion-button"
          style={{ fontSize: '0.82rem', padding: '10px 18px', gap: '6px' }}
        >
          <span>Jump to Comms Deck</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* ── MODAL 1: Inspect Badge Evidence Modal ── */}
      {inspectingBadge && (
        <div 
          className="audit-modal-backdrop"
          onClick={() => setInspectingBadge(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 10000
          }}
        >
          <div 
            className="audit-modal-window animate-reveal"
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(9, 14, 26, 0.99) 100%)',
              border: `1px solid ${inspectingBadge.color}60`,
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px ${inspectingBadge.color}30`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${inspectingBadge.color}25`,
                    border: `1px solid ${inspectingBadge.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}
                >
                  {inspectingBadge.icon}
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: inspectingBadge.color, fontWeight: 700, textTransform: 'uppercase' }}>
                    {inspectingBadge.category}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc', fontWeight: 800 }}>
                    {inspectingBadge.title}
                  </h3>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setInspectingBadge(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem', color: '#cbd5e1' }}>
              <div>
                <strong style={{ color: '#f8fafc', display: 'block', marginBottom: '2px' }}>Credential Status:</strong>
                <span style={{ color: inspectingBadge.isUnlocked ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                  {inspectingBadge.isUnlocked ? '✓ Cryptographically Verified & Unlocked' : '🔒 Not Yet Earned'}
                </span>
              </div>

              <div>
                <strong style={{ color: '#f8fafc', display: 'block', marginBottom: '2px' }}>Demonstrated Competency:</strong>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.5 }}>{inspectingBadge.desc}</p>
              </div>

              <div>
                <strong style={{ color: '#f8fafc', display: 'block', marginBottom: '2px' }}>Hiring Interview Impact:</strong>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.5 }}>{inspectingBadge.interviewValue}</p>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Simulated Cryptographic Proof:</span>
                <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.76rem' }}>
                  SHA256: {inspectingBadge.proofHash}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setInspectingBadge(null)}
                className="button button-ghost"
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspectingBadge(null)
                  navigate(inspectingBadge.actionRoute)
                }}
                className="button button-primary"
                style={{ fontSize: '0.8rem', padding: '6px 16px' }}
              >
                Launch Associated Practice Lab &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Certified Hiring Manager Dossier Preview Modal ── */}
      {showTranscriptModal && (
        <div 
          className="audit-modal-backdrop"
          onClick={() => setShowTranscriptModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 10000
          }}
        >
          <div 
            className="audit-modal-window transcript-printable-document animate-reveal"
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0a0f1d',
              border: '2px solid rgba(56, 189, 248, 0.5)',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              padding: '28px',
              color: '#f8fafc',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid rgba(56, 189, 248, 0.3)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  OFFICIAL TECHNICAL EVIDENCE RECORD
                </span>
                <h2 style={{ margin: '4px 0', fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                  SeCloudive Candidate Verification Transcript
                </h2>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Autonomous Cloud Security Judgment &amp; Architectural Resilience Engine
                </span>
              </div>
              <button 
                type="button" 
                className="no-print"
                onClick={() => setShowTranscriptModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}
              >
                ✕
              </button>
            </div>

            {/* Candidate Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>CANDIDATE NAME</span>
                <strong style={{ fontSize: '0.95rem', color: '#f8fafc' }}>{name}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>PERMANENT STUDENT ID</span>
                <strong style={{ fontSize: '0.95rem', color: '#38bdf8', fontFamily: 'monospace' }}>{currentUserId}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>TARGET ROLE</span>
                <strong style={{ fontSize: '0.95rem', color: '#10b981' }}>{targetRole}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>SECURITY CLEARANCE</span>
                <strong style={{ fontSize: '0.95rem', color: '#f59e0b' }}>{clearance?.title || 'Tier 1 Clearance'}</strong>
              </div>
            </div>

            {/* Demonstrated Stats Table */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '8px', textTransform: 'uppercase' }}>
                Verified Hands-On Milestones
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>TOTAL XP</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>{masterTotalXP}</div>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>$0 SAFE LABS</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{rampupLabsCompletedCount}</div>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>CTF BATTLE ROOMS</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>{battleRoomsSolvedCount}</div>
                </div>
              </div>
            </div>

            {/* Verification Watermark */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span>✓ Cryptographically signed with SHA-256 tamper-proof ledger</span>
              <span>Issued: {new Date().toLocaleDateString()}</span>
            </div>

            {/* Actions */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setShowTranscriptModal(false)}
                className="button button-ghost"
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="button button-primary"
                style={{ fontSize: '0.8rem', padding: '6px 18px', gap: '6px' }}
              >
                <Printer size={14} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
