// ==============================================================================
// SeCloudive Student Profile & Cryptographic Career Dossier
// Dedicated engineering hub for identity, credentials, clearance, and skill metrics
// ==============================================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

  // Editable Profile Form State
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(activeProfile?.name || 'On-Call Cloud Security Analyst')
  const [bio, setBio] = useState(activeProfile?.bio || 'Practicing AWS least privilege, forensic threat containment, and infrastructure-as-code defense on SeCloudive.')
  const [targetRole, setTargetRole] = useState(activeProfile?.targetCareerRole || activeProfile?.role || TARGET_ROLES[0])
  const [selectedAvatar, setSelectedAvatar] = useState(activeProfile?.avatarPreset || 'av-iam')
  
  // Status states
  const [copiedId, setCopiedId] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  // Sync state if activeProfile updates
  useEffect(() => {
    if (activeProfile?.name) setName(activeProfile.name)
    if (activeProfile?.bio) setBio(activeProfile.bio)
    if (activeProfile?.targetCareerRole || activeProfile?.role) {
      setTargetRole(activeProfile.targetCareerRole || activeProfile.role)
    }
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

  // Handle Save Profile
  const handleSaveProfile = (e) => {
    if (e) e.preventDefault()
    playTactileClick()

    if (updateUserProfile && activeProfile?.id) {
      updateUserProfile(activeProfile.id, {
        name: name.trim() || 'Cloud Security Analyst',
        bio: bio.trim(),
        targetCareerRole: targetRole,
        role: targetRole,
        avatarPreset: selectedAvatar
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
            avatarPreset: selectedAvatar
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

  // Security Credentials & Badges logic
  const BADGES = [
    {
      id: 'iam-least-privilege',
      title: 'AWS Least Privilege Sentinel',
      category: 'Identity & Access',
      desc: 'Enforced zero-wildcard IAM policies and boundary guardrails.',
      isUnlocked: learningTopicsCompletedCount >= 2 || completedCount >= 1,
      icon: '🛡️',
      color: '#38bdf8'
    },
    {
      id: 's3-guardrails',
      title: 'S3 Data Guardrails Guardian',
      category: 'Data Protection',
      desc: 'Hardened object storage with TLS enforcement and bucket locks.',
      isUnlocked: completedLabsCount >= 1 || rampupLabsCompletedCount >= 1,
      icon: '🪣',
      color: '#06b6d4'
    },
    {
      id: 'cloudtrail-forensics',
      title: 'CloudTrail Forensics Specialist',
      category: 'Detection & Audit',
      desc: 'Extracted credential exfiltration timelines from live forensic logs.',
      isUnlocked: completedCount >= 2,
      icon: '🕵️',
      color: '#f59e0b'
    },
    {
      id: 'flag-hunter',
      title: 'Purple Team Flag Hunter',
      category: 'Combat CTF',
      desc: 'Executed end-to-end exploit simulations in live Battle Rooms.',
      isUnlocked: battleRoomsSolvedCount >= 1,
      icon: '⚡',
      color: '#ef4444'
    },
    {
      id: 'zero-billing',
      title: 'Zero-Billing Cloud Architect',
      category: 'Infrastructure',
      desc: 'Configured automated $0.01 alarms with 1-click teardown automation.',
      isUnlocked: rampupLabsCompletedCount >= 2,
      icon: '🎯',
      color: '#10b981'
    },
    {
      id: 'multi-cloud-sovereign',
      title: 'Multi-Cloud Sovereign',
      category: 'Enterprise Cloud',
      desc: 'Practiced telemetry crosswalk across AWS, Azure, GCP & OCI.',
      isUnlocked: true, // Baseline open for all learners
      icon: '🌐',
      color: '#a855f7'
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
          marginBottom: '28px',
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
                  cursor: 'pointer'
                }}
                onClick={() => setShowAvatarPicker(p => !p)}
                title="Click to change your Cyber Avatar preset"
              >
                {activeProfile?.avatarUrl ? (
                  <img src={activeProfile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '18px', objectFit: 'cover' }} />
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
                    borderRadius: '12px'
                  }}
                >
                  {isGuest ? 'Guest Sandbox Profile' : activeProfile?.authProvider === 'google' ? 'Google Authenticated' : 'Verified Student Account'}
                </span>
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

            <button
              type="button"
              onClick={() => setIsEditing(p => !p)}
              className="button button-ghost"
              style={{ fontSize: '0.8rem', padding: '8px 16px', gap: '6px', width: '100%', justifyContent: 'center' }}
            >
              <Edit3 size={14} />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile & Bio'}</span>
            </button>
          </div>
        </div>

        {/* ── Avatar Preset Picker (collapsible) ── */}
        {showAvatarPicker && (
          <div 
            style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(6, 10, 20, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '12px'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
              Select Cyber Avatar Preset:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
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
          </div>
        )}

        {/* ── Edit Profile Form Drawer ── */}
        {isEditing && (
          <form 
            onSubmit={handleSaveProfile}
            style={{
              marginTop: '20px',
              padding: '20px',
              background: 'rgba(6, 10, 20, 0.85)',
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
                className="button button-primary"
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
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px', padding: '16px' }}>
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
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '16px' }}>
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
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', padding: '16px' }}>
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
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '16px' }}>
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
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '12px', padding: '16px' }}>
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
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '16px' }}>
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
              Badges unlock automatically as you prove competency in live scenarios and safe labs.
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
              style={{
                background: badge.isUnlocked ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.4)',
                border: `1px solid ${badge.isUnlocked ? `${badge.color}35` : 'rgba(255, 255, 255, 0.06)'}`,
                borderLeft: `4px solid ${badge.isUnlocked ? badge.color : '#334155'}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                opacity: badge.isUnlocked ? 1 : 0.65
              }}
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
            className="button button-primary"
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
            className="button button-ghost"
            style={{ fontSize: '0.82rem', padding: '8px 16px', gap: '6px' }}
          >
            <Compass size={14} />
            <span>Switch to Guest Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="button button-ghost"
            style={{ fontSize: '0.82rem', padding: '8px 16px', gap: '6px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.35)' }}
          >
            <AlertTriangle size={14} />
            <span>Reset Progress</span>
          </button>
        </div>

        {/* Reset Confirmation Prompt */}
        {showResetConfirm && (
          <div 
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
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
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
          className="button button-primary"
          style={{ fontSize: '0.82rem', padding: '10px 18px', gap: '6px' }}
        >
          <span>Jump to Comms Deck</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </main>
  )
}
