// ==============================================================================
// SeCloudive Student Portal & Cryptographic Career Dossier
// Dedicated engineering hub for identity, credentials, learning HQ, job tracking, and notes
// ==============================================================================

import { useState, useEffect, useMemo } from 'react'
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
  Code,
  Briefcase,
  Bookmark,
  Calendar,
  TrendingUp,
  Clock,
  Trash2,
  Plus,
  FileCode,
  Layers,
  Search,
  Target
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { useAuth } from '../context/AuthContext'
import { playTactileClick, playSuccessChime } from '../utils/cyberMotionAudio'
import { liveJobFeedAggregator } from '../services/liveJobFeedAggregatorService'
import { LIVE_INTERNSHIPS_DATA } from '../data/liveInternshipsData'

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

const NOTE_TEMPLATES = [
  {
    title: 'IAM Least Privilege Checklist',
    content: `## AWS IAM Least Privilege Checklist
- [ ] No wildcard '*' in Action or Resource on sensitive APIs
- [ ] Explicit Deny precedence tested for unencrypted S3 put-object requests
- [ ] Access Analyzer scan passed with zero finding alerts
- [ ] Permission Boundaries applied to developer roles
- [ ] Multi-Factor Authentication (MFA) strictly required for AssumeRole`
  },
  {
    title: 'S3 Data Hardening Runbook',
    content: `## S3 Data Perimeter Runbook
1. Enforce TLS via bucket policy condition:
   aws:SecureTransport: "false" => Effect: Deny
2. Enable S3 Block Public Access (All 4 settings ON)
3. Enforce default KMS SSE-KMS envelope encryption
4. Enable S3 Object Lock & Versioning for ransomware containment
5. Audit CloudTrail Data Events for suspicious GetObject bursts`
  },
  {
    title: 'CloudTrail Incident Triage Playbook',
    content: `## CloudTrail Incident Triage Playbook
- Step 1: Identify caller identity ARN & source IP:
  aws sts get-caller-identity
- Step 2: Query Athena for anomalous AssumeRole calls across the last 4 hours
- Step 3: Check for backdoor user creation:
  eventName = "CreateUser" OR eventName = "CreateAccessKey"
- Step 4: Attach emergency DenyAll inline policy to compromised principal
- Step 5: Preserve log hash & write forensic timeline report`
  },
  {
    title: 'STAR Method Interview Framework',
    content: `## Behavioral & Technical STAR Framework
- Situation: Discovered an unmonitored IAM access key with AdministratorAccess exposed on GitHub.
- Task: Contain exposure within 5 minutes without disrupting active production workloads.
- Action: Implemented emergency explicit Deny inline policy, rotated key, preserved CloudTrail timeline, and conducted blast radius analysis.
- Result: Prevented $50k simulated cryptomining spike; configured automated GuardDuty Lambda remediation.`
  }
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
    completedCloudProjectsCount = 0,
    completedPlaybooksCount = 0,
    progress = {},
    resetAllProgress
  } = useChallenges() || {}

  const auth = useAuth()
  const isGuest = Boolean(activeProfile?.isGuest || !activeProfile?.id || activeProfile?.id === 'guest')
  const currentUserId = activeProfile?.id || 'GUEST-SANDBOX-7104'

  // Admin Identification check
  const isAdminUser = Boolean(
    activeProfile?.email?.trim().toLowerCase() === 'naenstudios@gmail.com' ||
    activeProfile?.role === 'admin' ||
    activeProfile?.isAdmin === true
  )

  // Portal Navigation Tabs
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'credentials' | 'jobs' | 'notes' | 'settings'

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

  // Tracked Jobs State (Application Pipeline)
  const [trackedJobsMap, setTrackedJobsMap] = useState(() => liveJobFeedAggregator.getTrackedJobs())
  const [jobFilter, setJobFilter] = useState('all') // 'all' | 'saved' | 'applied' | 'interviewing' | 'offer'

  // Student Lab Notes State
  const [notesText, setNotesText] = useState(() => {
    try {
      return localStorage.getItem(`secloudive_student_notes_${currentUserId}`) || 
             localStorage.getItem('secloudive_student_notes') || 
             `# ${activeProfile?.name || 'My'} Cloud Security Lab Journal\n\nRecord technical findings, CLI snippets, and incident containment observations here.\n`
    } catch {
      return ''
    }
  })
  const [notesSavedToast, setNotesSavedToast] = useState(false)

  // Sync state if activeProfile updates
  useEffect(() => {
    if (activeProfile?.name) setName(activeProfile.name)
    if (activeProfile?.bio) setBio(activeProfile.bio)
    if (activeProfile?.targetCareerRole || activeProfile?.role) {
      setTargetRole(activeProfile.targetCareerRole || activeProfile.role)
    }
    if (activeProfile?.avatarUrl) setCustomAvatarUrl(activeProfile.avatarUrl)
  }, [activeProfile])

  // Listen to tracked jobs updates
  useEffect(() => {
    const handleJobsUpdated = (e) => {
      setTrackedJobsMap(e.detail || liveJobFeedAggregator.getTrackedJobs())
    }
    window.addEventListener('tracked-jobs-updated', handleJobsUpdated)
    return () => window.removeEventListener('tracked-jobs-updated', handleJobsUpdated)
  }, [])

  // Auto-save student notes
  const handleNotesChange = (val) => {
    setNotesText(val)
    try {
      localStorage.setItem(`secloudive_student_notes_${currentUserId}`, val)
      localStorage.setItem('secloudive_student_notes', val)
      setNotesSavedToast(true)
      setTimeout(() => setNotesSavedToast(false), 2000)
    } catch {}
  }

  // Insert template into notes
  const insertTemplate = (templateContent) => {
    playTactileClick()
    const updated = notesText ? `${notesText}\n\n${templateContent}` : templateContent
    handleNotesChange(updated)
  }

  // Copy notes to clipboard
  const copyNotesToClipboard = () => {
    playTactileClick()
    try {
      navigator.clipboard.writeText(notesText)
      alert('Lab notes copied to clipboard!')
    } catch {}
  }

  // Download notes as markdown
  const downloadNotesFile = () => {
    playTactileClick()
    try {
      const blob = new Blob([notesText], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `secloudive-lab-notes-${currentUserId}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {}
  }

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

  // Dynamic Next Best Action Recommendation
  const nextBestAction = useMemo(() => {
    if (completedMasterActivities === 0) {
      return {
        title: 'Foundations Initiation: AWS IAM Least Privilege',
        track: 'Identity & Access Management',
        est: '15 min',
        reward: '+150 XP',
        route: '/learning/foundations/iam-privilege-escalation',
        desc: 'Master effective policy evaluation logic, explicit deny precedence, and resource-based vs identity-based policies.'
      }
    }
    if (rampupLabsCompletedCount < 2) {
      return {
        title: '$0 Free Tier Safe Lab: Zero-Billing Cloud Guardrails',
        track: 'Infrastructure Security & FinOps',
        est: '20 min',
        reward: '+200 XP',
        route: '/cost-calculator',
        desc: 'Deploy automated $0.01 billing alarms and automated teardown scripts without incurring cloud charges.'
      }
    }
    if (battleRoomsSolvedCount < 2) {
      return {
        title: 'Live-Fire Combat: SSRF to IMDSv1 Metadata Exfiltration',
        track: 'Combat CTF & Purple Teaming',
        est: '25 min',
        reward: '+250 XP',
        route: '/battle-rooms',
        desc: 'Simulate Capital One-style SSRF, extract EC2 temporary role credentials, and craft a containment rule.'
      }
    }
    if (completedCount < 3) {
      return {
        title: 'SOC Incident Investigation: Stolen Access Key Containment',
        track: 'Cloud Detection & Forensics',
        est: '30 min',
        reward: '+300 XP',
        route: '/investigations',
        desc: 'Reconstruct the attack timeline from raw CloudTrail JSON logs, isolate affected IAM principals, and write a forensic report.'
      }
    }
    return {
      title: 'Executive Capstone: Multi-Cloud Zero-Trust Architecture Review',
      track: 'Enterprise Security Architecture',
      est: '35 min',
      reward: '+400 XP',
      route: '/architecture-reviews',
      desc: 'Audit cross-account role delegations, transit gateways, and KMS envelope encryption configurations.'
    }
  }, [completedMasterActivities, rampupLabsCompletedCount, battleRoomsSolvedCount, completedCount])

  // Tracked Jobs List & Pipeline Counts
  const trackedJobsList = useMemo(() => {
    const list = []
    Object.entries(trackedJobsMap).forEach(([jobId, meta]) => {
      const match = LIVE_INTERNSHIPS_DATA.find(j => j.id === jobId)
      if (match) {
        list.push({
          ...match,
          trackingStatus: meta.status || 'saved',
          trackingNotes: meta.notes || '',
          updatedAt: meta.updatedAt || Date.now()
        })
      }
    })
    return list
  }, [trackedJobsMap])

  const filteredTrackedJobs = useMemo(() => {
    if (jobFilter === 'all') return trackedJobsList
    return trackedJobsList.filter(j => j.trackingStatus === jobFilter)
  }, [trackedJobsList, jobFilter])

  const pipelineCounts = useMemo(() => {
    const counts = { saved: 0, applied: 0, interviewing: 0, offer: 0 }
    trackedJobsList.forEach(j => {
      if (counts[j.trackingStatus] !== undefined) counts[j.trackingStatus]++
    })
    return counts
  }, [trackedJobsList])

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
    playSuccessChime()
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

  const unlockedBadgesCount = BADGES.filter(b => b.isUnlocked).length
  const activeAvatarObj = AVATAR_PRESETS.find(a => a.id === selectedAvatar) || AVATAR_PRESETS[0]

  return (
    <main className="section profile-page-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* ── Top Breadcrumb & Quick Jump ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
          <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/dashboard" style={{ color: '#38bdf8', textDecoration: 'none' }}>Dashboard</Link>
          <span>/</span>
          <span style={{ color: '#f8fafc', fontWeight: 600 }}>Student Portal &amp; Engineering Dossier</span>
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
            <span>Certified Transcript</span>
          </button>
          <Link 
            to="/dashboard#comms-deck" 
            className="button button-ghost"
            style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px', borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
          >
            <MessageSquare size={14} />
            <span>Student Comms Deck</span>
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

      {/* ── Section 1: Hero Student Identity & Clearance Card ── */}
      <div 
        className="cyber-glass-panel"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          padding: '24px 28px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.55)',
          marginBottom: '20px',
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

              {/* Bio / Focus */}
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
              onClick={() => {
                playTactileClick()
                setActiveTab('settings')
                setIsEditing(p => !p)
              }}
              className="button button-ghost motion-button"
              style={{ fontSize: '0.8rem', padding: '8px 16px', gap: '6px', width: '100%', justifyContent: 'center' }}
            >
              <Edit3 size={14} />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile & Role'}</span>
            </button>
          </div>
        </div>

        {/* Level Progression Meter */}
        <div 
          style={{
            marginTop: '20px',
            padding: '12px 16px',
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
      </div>

      {/* ── Section 2: Student Portal Multi-Tab Navigation Bar ── */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {[
          { id: 'overview', label: 'Learning HQ & Sprints', icon: Zap },
          { id: 'credentials', label: 'Credentials & Badges', icon: Award, count: `${unlockedBadgesCount}/${BADGES.length}` },
          { id: 'jobs', label: 'Internships & Job Tracker', icon: Briefcase, count: trackedJobsList.length },
          { id: 'notes', label: 'Lab Notes & Runbooks', icon: FileCode },
          { id: 'settings', label: 'Account & Cloud Sync', icon: User }
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playTactileClick()
                setActiveTab(tab.id)
              }}
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(37, 99, 235, 0.3) 100%)' : 'rgba(15, 23, 42, 0.5)',
                border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.6)' : 'rgba(255, 255, 255, 0.06)'}`,
                color: isActive ? '#38bdf8' : '#94a3b8',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.2)' : 'none'
              }}
            >
              <Icon size={15} style={{ color: isActive ? '#38bdf8' : '#64748b' }} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span 
                  style={{
                    background: isActive ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    padding: '1px 6px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 800
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 1: LEARNING HQ & ACTIVE SPRINTS
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="animate-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Next Best Action Directive Card */}
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(37, 99, 235, 0.2) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              borderRadius: '14px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 8px 30px rgba(2, 132, 199, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', maxWidth: '720px' }}>
              <div 
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  flexShrink: 0
                }}
              >
                <Target size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    RECOMMENDED NEXT SPRINT • {nextBestAction.track}
                  </span>
                  <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 700, padding: '1px 6px' }}>
                    {nextBestAction.reward}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                    ⏱️ {nextBestAction.est}
                  </span>
                </div>
                <h3 style={{ margin: '4px 0 6px', fontSize: '1.15rem', color: '#f8fafc', fontWeight: 800 }}>
                  {nextBestAction.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {nextBestAction.desc}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playTactileClick()
                navigate(nextBestAction.route)
              }}
              className="button button-primary motion-button"
              style={{ fontSize: '0.84rem', padding: '10px 20px', gap: '8px' }}
            >
              <span>Launch Mission</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* 7-Day Velocity & Telemetry Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            
            {/* Master Total XP */}
            <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#38bdf8', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>Master Total XP</span>
                <Zap size={16} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                {masterTotalXP.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#38bdf8' }}>XP</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Total combat &amp; lab score
              </div>
            </div>

            {/* Overall Pathway */}
            <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#10b981', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>Pathway Progress</span>
                <CheckCircle2 size={16} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                {masterProgressPercent}%
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                {completedMasterActivities} of {totalMasterActivities} units
              </div>
            </div>

            {/* Battle Rooms */}
            <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ef4444', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>Battle CTF Flags</span>
                <Flame size={16} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                {battleRoomsSolvedCount}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Simulated captures solved
              </div>
            </div>

            {/* $0 Safe Labs */}
            <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#10b981', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>$0 Safe Labs</span>
                <Terminal size={16} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                {rampupLabsCompletedCount}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Free-tier safe deployments
              </div>
            </div>

            {/* SOC Incident Tickets */}
            <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>SOC Investigations</span>
                <Shield size={16} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                {completedCount}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Tickets investigated
              </div>
            </div>

            {/* Diagnostic Baseline */}
            <div className="motion-card" style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#a855f7', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase' }}>Placement Baseline</span>
                <Compass size={16} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                {diagnosticBaseline ? `${diagnosticBaseline.overallPercentage}%` : 'Unrated'}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                {diagnosticBaseline ? diagnosticBaseline.skillLevel : 'Take placement test'}
              </div>
            </div>

          </div>

          {/* Quick Practice & Combat Launchers Grid */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '12px', letterSpacing: '-0.2px' }}>
              Practice &amp; Simulation Command Launchers
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {[
                { title: 'Purple Team Battle Rooms', route: '/battle-rooms', icon: '⚡', color: '#ef4444', desc: 'Hands-on exploit simulations and defensive remediation.' },
                { title: 'SOC Investigation Simulator', route: '/investigations', icon: '🕵️', color: '#f59e0b', desc: 'Investigate real CloudTrail breaches and contain exposures.' },
                { title: 'Safe Cloud Labs ($0 Free Tier)', route: '/labs', icon: '🪣', color: '#06b6d4', desc: 'Zero-billing AWS production architectures with safe teardowns.' },
                { title: 'Architecture Review Engine', route: '/architecture-reviews', icon: '🏛️', color: '#a855f7', desc: 'CIS Benchmark and Well-Architected Security Pillar reviews.' },
                { title: 'Live Internships & Jobs Radar', route: '/live-internships', icon: '💼', color: '#10b981', desc: '40+ verified cloud security roles & hiring pipelines.' },
                { title: 'AI Mock Technical Interview', route: '/interview-simulator', icon: '🎙️', color: '#38bdf8', desc: 'STAR framework technical questions with instant scoring.' }
              ].map(lab => (
                <div
                  key={lab.title}
                  onClick={() => {
                    playTactileClick()
                    navigate(lab.route)
                  }}
                  className="motion-card"
                  style={{
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div 
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: `${lab.color}18`,
                      border: `1px solid ${lab.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      flexShrink: 0
                    }}
                  >
                    {lab.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                        {lab.title}
                      </div>
                      <ArrowRight size={13} style={{ color: lab.color }} />
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      {lab.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 2: VERIFIED BADGES & CRYPTOGRAPHIC CREDENTIALS
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'credentials' && (
        <div className="animate-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.3px' }}>
                Verified Credentials &amp; Cryptographic Proofs
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                Click any credential to inspect demonstrated competency, hiring interview talking points, and cryptographic SHA256 proof hash.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  playTactileClick()
                  setShowTranscriptModal(true)
                }}
                className="button button-ghost"
                style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
              >
                <Printer size={14} />
                <span>View Official Transcript</span>
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-certificate'))}
                className="button button-ghost"
                style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}
              >
                <Award size={14} />
                <span>Certificate Viewer</span>
              </button>
            </div>
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
                  <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    {badge.desc}
                  </p>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                    <span style={{ color: '#64748b' }}>Proof: {badge.proofHash.slice(0, 10)}...</span>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>Inspect Evidence &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 3: INTERNSHIP & CAREER TRACKER
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'jobs' && (
        <div className="animate-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header & Pipeline Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.3px' }}>
                My Career &amp; Internship Pipeline
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                Track saved opportunities, active submissions, interviews, and offers synchronized from the Live Internships Radar.
              </p>
            </div>
            <Link
              to="/live-internships"
              className="button button-primary motion-button"
              style={{ fontSize: '0.8rem', padding: '8px 16px', gap: '6px' }}
            >
              <Compass size={14} />
              <span>Explore 40+ Live Cloud Roles</span>
            </Link>
          </div>

          {/* Pipeline Summary Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {[
              { id: 'all', label: 'All Tracked', count: trackedJobsList.length, color: '#38bdf8' },
              { id: 'saved', label: 'Bookmarked', count: pipelineCounts.saved, color: '#94a3b8' },
              { id: 'applied', label: 'Applied', count: pipelineCounts.applied, color: '#38bdf8' },
              { id: 'interviewing', label: 'Interviewing', count: pipelineCounts.interviewing, color: '#f59e0b' },
              { id: 'offer', label: 'Offers', count: pipelineCounts.offer, color: '#10b981' }
            ].map(stage => (
              <button
                key={stage.id}
                type="button"
                onClick={() => {
                  playTactileClick()
                  setJobFilter(stage.id)
                }}
                style={{
                  background: jobFilter === stage.id ? `${stage.color}20` : 'rgba(15, 23, 42, 0.7)',
                  border: `1px solid ${jobFilter === stage.id ? stage.color : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '10px',
                  padding: '12px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stage.color, marginTop: '2px' }}>
                  {stage.count}
                </div>
              </button>
            ))}
          </div>

          {/* Tracked Jobs List */}
          {filteredTrackedJobs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTrackedJobs.map(job => (
                <div
                  key={job.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '260px', flex: 1 }}>
                    <div 
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: `${job.logoColor || '#38bdf8'}18`,
                        border: `1px solid ${job.logoColor || '#38bdf8'}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: job.logoColor || '#38bdf8',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        flexShrink: 0
                      }}
                    >
                      {job.logoText || job.company.slice(0, 3)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{job.company}</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>•</span>
                        <span style={{ fontSize: '0.74rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>{job.cloudProvider}</span>
                      </div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                        {job.role}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                        📍 {job.location} • 💰 {job.stipend}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Pipeline */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <select
                      value={job.trackingStatus}
                      onChange={(e) => {
                        playTactileClick()
                        liveJobFeedAggregator.saveTrackedJob(job.id, e.target.value, job.trackingNotes)
                      }}
                      style={{
                        background: '#0f172a',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="saved">Bookmarked</option>
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offer">Offer Extended</option>
                    </select>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-primary motion-button"
                      style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px', textDecoration: 'none' }}
                    >
                      <span>Apply</span>
                      <ExternalLink size={12} />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Remove ${job.role} at ${job.company} from your pipeline?`)) {
                          playTactileClick()
                          liveJobFeedAggregator.removeTrackedJob(job.id)
                        }
                      }}
                      className="button button-ghost"
                      style={{ padding: '6px 10px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      title="Remove from tracking"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '36px 20px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💼</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
                No opportunities in this pipeline stage yet
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: '#94a3b8', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                Browse our real-time multi-cloud career directory with 40+ verified AWS, Azure, GCP, and Multi-Cloud positions.
              </p>
              <Link
                to="/live-internships"
                className="button button-primary motion-button"
                style={{ fontSize: '0.82rem', padding: '8px 18px', gap: '6px' }}
              >
                <span>Browse Live Career Radar</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 4: STUDENT SECURITY LAB NOTES & RUNBOOKS
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'notes' && (
        <div className="animate-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.3px' }}>
                Personal Security Lab Notes &amp; Runbooks
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                Persistent technical journal. Document commands, breach triage findings, and AWS policies directly in your browser profile.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {notesSavedToast && (
                <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={12} /> Auto-saved
                </span>
              )}
              <button
                type="button"
                onClick={copyNotesToClipboard}
                className="button button-ghost"
                style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
              >
                <Copy size={13} />
                <span>Copy</span>
              </button>
              <button
                type="button"
                onClick={downloadNotesFile}
                className="button button-primary"
                style={{ fontSize: '0.78rem', padding: '6px 14px', gap: '6px' }}
              >
                <Download size={13} />
                <span>Export (.md)</span>
              </button>
            </div>
          </div>

          {/* Quick-Insert Security Templates */}
          <div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Quick Insert Engineering Templates:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {NOTE_TEMPLATES.map(tmpl => (
                <button
                  key={tmpl.title}
                  type="button"
                  onClick={() => insertTemplate(tmpl.content)}
                  className="button button-ghost"
                  style={{ fontSize: '0.75rem', padding: '5px 12px', gap: '6px', background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.25)', color: '#38bdf8' }}
                >
                  <Plus size={12} />
                  <span>{tmpl.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Large Notes Scratchpad Editor */}
          <div style={{ position: 'relative' }}>
            <textarea
              rows={16}
              value={notesText}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="# Enter security findings, CLI snippets, and interview prep notes..."
              style={{
                width: '100%',
                background: 'rgba(6, 10, 20, 0.95)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                color: '#f8fafc',
                fontSize: '0.86rem',
                fontFamily: "'DM Mono', monospace, Consolas",
                lineHeight: 1.6,
                resize: 'vertical',
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.6)'
              }}
            />
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 10px',
                fontSize: '0.72rem',
                color: '#64748b',
                fontFamily: 'monospace'
              }}
            >
              <span>{notesText.length} characters • {notesText.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span>Encrypted &amp; Persisted Locally in Profile</span>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 5: ACCOUNT SETTINGS, AVATAR & CLOUD SYNC
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <div className="animate-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Avatar Preset Picker Drawer */}
          <div 
            style={{
              padding: '20px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '14px'
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
              Cyber Defense Avatar Preset
            </div>
            <p style={{ margin: '0 0 14px', fontSize: '0.8rem', color: '#94a3b8' }}>
              Choose a tactical avatar badge representing your cloud security focus.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' }}>
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

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', color: '#94a3b8', marginBottom: '6px' }}>
                Or enter custom image URL (Google Drive, GitHub avatar, Unsplash):
              </label>
              <input
                type="text"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                style={{
                  width: '100%',
                  background: 'rgba(6, 10, 20, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#f8fafc',
                  fontSize: '0.8rem'
                }}
              />
            </div>
          </div>

          {/* Edit Profile Form */}
          <form 
            onSubmit={handleSaveProfile}
            style={{
              padding: '24px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc', marginBottom: '2px' }}>
              Profile Identity &amp; Career Trajectory
            </div>

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
                    background: 'rgba(6, 10, 20, 0.8)',
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
                    background: 'rgba(6, 10, 20, 0.8)',
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
                Engineering Bio &amp; Research Focus:
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your current studies, certifications, and career focus..."
                style={{
                  width: '100%',
                  background: 'rgba(6, 10, 20, 0.8)',
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
                type="submit"
                className="button button-primary motion-button"
                style={{ fontSize: '0.82rem', padding: '8px 22px', gap: '6px' }}
              >
                <Save size={14} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          {saveSuccess && (
            <div 
              style={{
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

          {/* Account Management & Cloud Sync */}
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px', letterSpacing: '-0.3px' }}>
              Account Management &amp; Multi-Device Cloud Sync
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

        </div>
      )}

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
                <strong style={{ fontSize: '0.95rem', color: '#38bdf8' }}>Tier 0{clearance?.tier || 1}: {clearance?.title || 'Foundations'}</strong>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>TOTAL SCORE</span>
                <strong style={{ fontSize: '1.2rem', color: '#38bdf8' }}>{masterTotalXP} XP</strong>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>UNITS MASTERED</span>
                <strong style={{ fontSize: '1.2rem', color: '#10b981' }}>{completedMasterActivities}</strong>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>CTF BATTLE FLAGS</span>
                <strong style={{ fontSize: '1.2rem', color: '#ef4444' }}>{battleRoomsSolvedCount}</strong>
              </div>
            </div>

            {/* Unlocked Credentials */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Demonstrated Engineering Competencies:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {BADGES.filter(b => b.isUnlocked).map(b => (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.5)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{b.icon}</span>
                      <strong style={{ color: '#f8fafc' }}>{b.title}</strong>
                    </div>
                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.74rem' }}>✓ Verified</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }} className="no-print">
              <button
                type="button"
                onClick={() => setShowTranscriptModal(false)}
                className="button button-ghost"
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="button button-primary"
                style={{ fontSize: '0.82rem', padding: '6px 16px', gap: '6px' }}
              >
                <Printer size={14} />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
