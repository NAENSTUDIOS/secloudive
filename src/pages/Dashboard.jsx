import { useState, useEffect } from 'react'
import { 
  Activity, 
  ArrowRight, 
  BarChart3, 
  BriefcaseBusiness, 
  CheckCircle2, 
  Cloud, 
  Flame, 
  Layers, 
  Rocket, 
  ShieldCheck, 
  Target, 
  Trophy,
  Terminal, 
  Code2, 
  FolderGit2, 
  Skull, 
  Flag,
  Radio,
  FileCode2,
  Sparkles,
  ExternalLink,
  GraduationCap,
  FileDown,
  FileText,
  Download,
  Check,
  Copy,
  X,
  Cpu,
  ChevronDown,
  ChevronUp,
  Compass,
  Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ScoreCard from '../components/ScoreCard'
import ProgressBar from '../components/ProgressBar'
import ChallengeCard from '../components/ChallengeCard'
import SecurityMaturityAssessment from '../components/SecurityMaturityAssessment'
import SkillProfileRadar from '../components/SkillProfileRadar'
import LiveFeedPortal from '../components/LiveFeedPortal'
import JobProcessFramework from '../components/JobProcessFramework'
import CareerJourneyTrack from '../components/CareerJourneyTrack'
import SkillGraphView from '../components/SkillGraphView'
import RecommendationOrchestratorView from '../components/RecommendationOrchestratorView'
import CapstoneMissionsCard from '../components/CapstoneMissionsCard'
import PortfolioEvidenceCard from '../components/PortfolioEvidenceCard'
import RoleSkillGapDashboard from '../components/RoleSkillGapDashboard'
import SafeLabCostCalculator from '../components/SafeLabCostCalculator'
import AIOperationsDashboard from '../components/AIOperationsDashboard'
import MasterEmployabilityHub from '../components/MasterEmployabilityHub'
import CyberThreatRadar from '../components/CyberThreatRadar'
import CyberCommandDeck from '../components/CyberCommandDeck'
import DailyAwsSecurityTicker from '../components/DailyAwsSecurityTicker'
import DailyLearningStreakWidget from '../components/DailyLearningStreakWidget'
import PlatformExplorationRoadmap from '../components/PlatformExplorationRoadmap'
import DefenderQuoteCallout from '../components/DefenderQuoteCallout'
import MultiCloudProviderFilter from '../components/MultiCloudProviderFilter'
import { playTabWhoosh, playTactileClick } from '../utils/cyberMotionAudio'
import { 
  generateRemediationAuditPack, 
  formatAuditPackMarkdown, 
  downloadAuditFile, 
  downloadHardenedTerraformModule,
  printAuditDossierPdf
} from '../utils/auditExportEngine'
import '../styles/careerIntelligence.css'
import '../styles/dashboardStructure.css'
import '../styles/dailyStreakWidget.css'
import { useChallenges } from '../context/ChallengeContext'
import { getCurrentLearningStage } from '../data/structuredLearningPath'

const studyAreas = [
  { key: 'iam', label: 'IAM Security', description: 'Policies, privilege boundaries, and trust relationships' },
  { key: 's3', label: 'S3 Data Security', description: 'Bucket protection, KMS encryption, and access policies' },
  { key: 'network', label: 'Network Security', description: 'Security groups, routing paths, and perimeter isolation' },
  { key: 'monitoring', label: 'Monitoring & Logging', description: 'CloudTrail auditing, alert thresholds, and detection' },
  { key: 'architecture', label: 'Architecture Security', description: 'Multi-finding system reviews and compound risk' },
]

export default function Dashboard() {
  const {
    challenges,
    threatScenarios,
    investigations,
    progress,
    completedCount,
    totalScore,
    scorePercent,
    architectureReviewedCount,
    simulatorCompletedCount,
    investigationCompletedCount,
    investigationAverageScore,
    internshipReadiness,
    realLabs,
    completedLabsCount,
    completedLabStepsCount,
    adaptiveRecommendations,
    masterCareerProfile,
    battleRoomsSolvedCount,
    rampupLabsCompletedCount,
    completedCloudProjectsCount,
    completedTeardownsCount,
    completedPlaybooksCount,
    containedRadarThreatsCount,
    activeProfile
  } = useChallenges()

  const isGuest = Boolean(activeProfile?.isGuest || !activeProfile?.id || activeProfile?.id === 'guest')
  const currentUserId = activeProfile?.id || 'guest'
  const currentStage = getCurrentLearningStage(progress)

  // Clean Tabbed Command Center state
  const [activeTrackTab, setActiveTrackTab] = useState('battlerooms') // 'battlerooms' | 'investigations' | 'labs' | 'playbooks' | 'projects' | 'sop'
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [auditPack, setAuditPack] = useState(null)
  const [copiedAudit, setCopiedAudit] = useState(false)
  const [isExportingZip, setIsExportingZip] = useState(false)
  const [showCostSentinel, setShowCostSentinel] = useState(false)
  const [showAIOpsModal, setShowAIOpsModal] = useState(false)
  const [showPlatformGuide, setShowPlatformGuide] = useState(true)
  const [selectedPersona, setSelectedPersona] = useState('all')

  // Diagnostic Placement Test Baseline state (scoped to user)
  const loadBaseline = () => {
    try {
      const raw = localStorage.getItem(`secloudive_baseline_${currentUserId}`) || 
                  (isGuest ? localStorage.getItem('secloudive_diagnostic_baseline') : null)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  const [diagnosticBaseline, setDiagnosticBaseline] = useState(loadBaseline)

  useEffect(() => {
    setDiagnosticBaseline(loadBaseline())
  }, [currentUserId, isGuest])

  useEffect(() => {
    const handleBaselineUpdated = (e) => {
      if (e.detail) {
        setDiagnosticBaseline(e.detail)
      } else {
        setDiagnosticBaseline(loadBaseline())
      }
    }
    window.addEventListener('diagnostic-test-completed', handleBaselineUpdated)
    return () => window.removeEventListener('diagnostic-test-completed', handleBaselineUpdated)
  }, [currentUserId, isGuest])

  const handleOpenMasterAuditPack = async () => {
    const pack = await generateRemediationAuditPack({
      scenario: {
        id: 'secloudive-master-career-dossier',
        title: 'SeCloudive Master Career Remediation & Compliance Dossier',
        lastVerified: '2026-03-20',
        primaryTechnique: 'T1552.005: Cloud Instance Metadata API',
        mitreTactics: ['Initial Access', 'Privilege Escalation', 'Exfiltration', 'Impact'],
        mitreTechniques: ['T1552.005', 'T1530', 'T1496', 'T1078.004']
      },
      topologyControls: { imdsv2: true, s3BlockPublic: true, sgRestricted: true, kmsCustomerKey: true, vpcEndpoint: true },
      topologyScore: Math.min(100, Math.max(82, scorePercent || 88)),
      isRemediated: true,
      learnerId: masterCareerProfile?.targetCareerRole ? `OPERATOR-${masterCareerProfile.targetCareerRole.toUpperCase().replace(/\s+/g, '-')}` : 'SEC-OPERATOR-7749'
    })
    setAuditPack(pack)
    setShowAuditModal(true)
  }

  const handlePrintAuditPdf = () => {
    if (!auditPack) return
    playTactileClick()
    printAuditDossierPdf(auditPack)
  }

  const handleDownloadMasterAuditJson = () => {
    if (!auditPack) return
    downloadAuditFile(
      `SeCloudive_Master_Remediation_Audit_Pack_${auditPack.meta?.packId || 'ACTIVE'}.json`,
      JSON.stringify(auditPack, null, 2),
      'application/json'
    )
  }

  const handleCopyMasterAuditMarkdown = () => {
    if (!auditPack) return
    const md = formatAuditPackMarkdown(auditPack)
    navigator.clipboard?.writeText(md)
    setCopiedAudit(true)
    setTimeout(() => setCopiedAudit(false), 2000)
  }

  const handleDownloadHardenedModule = async () => {
    setIsExportingZip(true)
    try {
      await downloadHardenedTerraformModule({
        scenarioName: 'SeCloudive Production Cloud Hardening Suite',
        auditId: auditPack?.auditId || 'MASTER-SECLOUDIVE-PROD'
      })
    } finally {
      setIsExportingZip(false)
    }
  }

  const next = challenges.find(challenge => !progress.completed[challenge.id]) || challenges[0]
  const nextTicket = threatScenarios.find(t => progress.simulatorScores?.[t.id] === undefined) || threatScenarios[0]
  const nextInvestigation = investigations?.find(i => progress.investigationScores?.[i.id] === undefined) || investigations?.[0]

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  return (
    <main className="page-shell dashboard clean-dashboard">
      {/* ── Top Header ── */}
      <div className="dashboard-header clean-dashboard-header">
        <div>
          <div className="eyebrow">
            <span className="pulse-dot" /> {dateLabel.toUpperCase()} /// CLOUD SECURITY CAREER COMMAND CENTER
          </div>
          <h1>
            Cloud Security Career OS<span>.</span>
          </h1>
          <p>
            Unified career intelligence platform guiding your transformation from beginner to enterprise Cloud Security Engineer across all 13 SeCloudive operational environments.
          </p>
        </div>
        <div className="dashboard-header-actions">
          <button 
            type="button" 
            className="button button-ghost" 
            onClick={() => window.dispatchEvent(new CustomEvent('open-platform-guide'))}
            style={{ borderColor: 'rgba(56, 189, 248, 0.45)', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)' }}
            title="Open Platform Compass & Guide (Alt+H)"
          >
            <Compass size={15} /> 🎯 Start Guide (Alt+H)
          </button>
          <Link 
            to="/interview-simulator"
            className="button button-ghost"
            style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
          >
            <Sparkles size={15} /> AI Interview Simulator
          </Link>
          <button 
            type="button" 
            className="button button-ghost" 
            onClick={() => setShowAIOpsModal(true)}
            style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
          >
            <Cpu size={15} /> AI Ops & Escalation Queue
          </button>
          <button 
            type="button" 
            className="button button-ghost" 
            onClick={handleOpenMasterAuditPack}
            style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10b981' }}
          >
            <FileDown size={15} /> Export Audit Pack
          </button>
          <Link className="button button-primary" to={nextInvestigation ? `/investigations/${nextInvestigation.id}` : '/investigations'}>
            <ShieldCheck size={16} /> Quick Launch Incident ({investigations.length - investigationCompletedCount} Open)
          </Link>
          <Link className="button button-ghost" to="/categories">
            <Layers size={15} /> All Scenarios
          </Link>
        </div>
      </div>

      {/* ── 🎯 ACTIVE STRUCTURED LEARNING MILESTONE GUIDANCE BANNER ── */}
      <div 
        className="active-milestone-guidance-card animate-reveal"
        style={{
          margin: '0 0 24px 0',
          padding: '18px 24px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            flexShrink: 0
          }}>
            {currentStage.currentPhase.iconEmoji}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.72rem', 
                fontWeight: 800, 
                color: '#38bdf8', 
                background: 'rgba(56, 189, 248, 0.15)', 
                padding: '2px 8px', 
                borderRadius: '4px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                TIER 0{currentStage.currentPhase.tierNumber || currentStage.currentPhase.phaseNumber} • {currentStage.currentPhase.title}
              </span>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Your Structured Zero-to-Hire Pathway
              </span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
              Next Step: {currentStage.nextMilestone.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>
              Estimated time: {currentStage.nextMilestone.estimatedMinutes} mins • Reward: +{currentStage.nextMilestone.xp} XP
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link 
            to={currentStage.nextMilestone.route}
            className="button button-primary"
            style={{ 
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', 
              padding: '10px 20px', 
              fontSize: '0.84rem',
              fontWeight: 800
            }}
          >
            ▶ Launch Next Milestone <ArrowRight size={15} />
          </Link>
          <Link 
            to="/#structured-path" 
            className="button button-ghost"
            style={{ padding: '10px 16px', fontSize: '0.82rem' }}
          >
            All 5 Phases
          </Link>
        </div>
      </div>

      {/* ── GLOBAL 5-CLOUD ENTERPRISE ECOSYSTEM SELECTOR ── */}
      <div style={{ margin: '0 0 24px 0' }}>
        <MultiCloudProviderFilter compact={false} showDetails={true} />
      </div>

      {/* ── UNIQUE USER ID SYSTEM & GUEST MODE NOTIFICATION ── */}
      {isGuest ? (
        <div 
          className="guest-mode-notice-banner animate-reveal" 
          role="alert" 
          style={{
            margin: '0 0 20px 0',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.38)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.18)', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
              👤
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  GUEST MODE ACTIVE
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Temporary local sandbox • Every user must have their own Unique User ID
                </span>
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#f8fafc', marginTop: '3px' }}>
                Claim your Unique User ID to isolate your data & auto-sync progress across sessions
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>
                Everyone has their own unique ID. In that ID, strictly only your labs, incident tickets, notes, and streaks are saved with real-time automatic synchronization.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="button button-primary btn-sm"
            onClick={() => window.dispatchEvent(new CustomEvent('open-user-sync-modal'))}
            style={{ fontSize: '0.84rem', padding: '10px 20px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 12px rgba(245, 158, 11, 0.35)' }}
          >
            <span>Claim Unique User ID</span>
            <ArrowRight size={15} />
          </button>
        </div>
      ) : (
        <div 
          className="user-authenticated-banner animate-reveal" 
          role="status" 
          style={{
            margin: '0 0 20px 0',
            padding: '12px 18px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              AUTHENTICATED USER:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.88rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
              ID: {activeProfile?.id}
            </span>
            <span style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>
              {activeProfile?.name} ({activeProfile?.role || 'Cloud Security Engineer'})
            </span>
            <span style={{ fontSize: '0.74rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700 }}>
              ✓ Data Isolated & Auto-Synced
            </span>
          </div>
          <button
            type="button"
            className="button button-ghost btn-sm"
            onClick={() => window.dispatchEvent(new CustomEvent('open-user-sync-modal'))}
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            Switch User / Backup Data
          </button>
        </div>
      )}

      {/* Embedded Safe Cost Calculator Sentinel Modal / Dropdown */}
      {showCostSentinel && (
        <div className="embedded-cost-sentinel animate-reveal" style={{ marginBottom: '24px' }}>
          <SafeLabCostCalculator onClose={() => setShowCostSentinel(false)} />
        </div>
      )}

      {/* ── 2-MINUTE DIAGNOSTIC PLACEMENT TEST BANNER ── */}
      <div 
        className="diagnostic-placement-banner" 
        style={{
          margin: '0 0 20px 0',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 132, 199, 0.12) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.28)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', flexShrink: 0 }}>
            <Compass size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: diagnosticBaseline ? '#10b981' : '#f59e0b' }}>
                {diagnosticBaseline ? 'BENCHMARKED SKILL BASELINE' : 'SKILL BASELINE PLACEMENT TEST'}
              </span>
              {diagnosticBaseline && (
                <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                  {diagnosticBaseline.overallPercentage}% ({diagnosticBaseline.skillLevel})
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              {diagnosticBaseline
                ? `Recommended Path: ${diagnosticBaseline.recommendedPathTitle}`
                : 'Benchmark your IAM, Networking & Architecture skills in 2 minutes'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
              {diagnosticBaseline
                ? diagnosticBaseline.recommendationReason
                : 'Answer 5 quick scenario questions to automatically identify your knowledge gaps and optimal curriculum starting point.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {diagnosticBaseline ? (
            <>
              <Link
                to={`/learning/${diagnosticBaseline.recommendedPathId}`}
                className="button button-primary btn-sm"
                style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Go to Recommended Path</span>
                <ArrowRight size={14} />
              </Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-test'))}
                className="button button-ghost btn-sm"
                style={{ fontSize: '0.82rem', padding: '8px 14px' }}
              >
                Retake Test
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-test'))}
              className="button button-primary btn-sm"
              style={{ fontSize: '0.82rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Zap size={14} />
              <span>Take 2-Minute Test</span>
            </button>
          )}
        </div>
      </div>

      {/* ── DAILY LEARNING GOAL & STREAK TRACKER WIDGET ── */}
      <DailyLearningStreakWidget />

      {/* ── FUTURISTIC CYBER COMMAND DECK & VISUAL WORLD ── */}
      <CyberCommandDeck />

      {/* ── Categorized Quick Navigation Hub ── */}
      <div className="structured-nav-hub" role="navigation" aria-label="Structured platform navigation" style={{ margin: '24px 0' }}>
        <div className="nav-hub-header">
          <div className="nav-hub-title">
            <Radio size={14} className="text-cyan animate-pulse" />
            <span>SECLOUDIVE ECOSYSTEM DIRECTORY /// 13 OPERATIONAL WORKSPACES</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Active: <span className="text-emerald-400 font-bold">{investigationCompletedCount + completedLabsCount} Completed</span>
          </span>
        </div>

        <div className="nav-hub-groups">
          {/* Group 1: Simulators & Arenas */}
          <div className="nav-hub-group">
            <span className="nav-group-label">
              <Skull size={13} className="text-rose-400" /> Simulators & Arenas
            </span>
            <div className="nav-group-links">
              <Link to="/investigations" className="nav-hub-pill pill-cyan">🔍 Incident Simulator</Link>
              <Link to="/battle-rooms" className="nav-hub-pill pill-rose">⚔️ Battle Rooms (CTF)</Link>
              <Link to="/internship-simulator" className="nav-hub-pill pill-purple">🎓 Internship Rotation</Link>
              <Link to="/interview-simulator" className="nav-hub-pill pill-cyan">🎯 AI Interviewer</Link>
            </div>
          </div>

          {/* Group 2: Hands-on Labs & Engineering */}
          <div className="nav-hub-group">
            <span className="nav-group-label">
              <Terminal size={13} className="text-emerald-400" /> Hands-On Labs & Engineering
            </span>
            <div className="nav-group-links">
              <Link to="/labs" className="nav-hub-pill pill-emerald">💻 16 Enterprise Labs</Link>
              <Link to="/projects" className="nav-hub-pill pill-emerald">📁 Verified $0 Capstones</Link>
              <Link to="/playbooks" className="nav-hub-pill pill-purple">📖 Job Playbooks</Link>
              <Link to="/cloudive-studio" className="nav-hub-pill">⚡ Builder Studio</Link>
            </div>
          </div>

          {/* Group 3: Academy & Curricula */}
          <div className="nav-hub-group">
            <span className="nav-group-label">
              <GraduationCap size={13} className="text-cyan-400" /> Academy & Curricula
            </span>
            <div className="nav-group-links">
              <Link to="/learning" className="nav-hub-pill pill-sky">📚 Learning Center</Link>
              <Link to="/roadmap" className="nav-hub-pill pill-amber" title="Chronological 10-Week Platform Exploration Roadmap & Quotes">🗺️ 10-Week Roadmap</Link>
              <Link to="/ramp-up" className="nav-hub-pill pill-emerald">🧭 5 Role Blueprints</Link>
              <Link to="/architecture-reviews" className="nav-hub-pill pill-cyan">🏛️ Architecture Reviews</Link>
              <Link to="/live-portal" className="nav-hub-pill">📡 Live Threat Feed</Link>
              <Link to="/report" className="nav-hub-pill">📋 Security Report</Link>
            </div>
          </div>

          {/* Group 4: Utilities & Cryptographic Verification */}
          <div className="nav-hub-group">
            <span className="nav-group-label">
              <ShieldCheck size={13} className="text-amber-400" /> Utilities & Verification
            </span>
            <div className="nav-group-links">
              <button 
                type="button" 
                onClick={() => {
                  setShowPlatformGuide(true)
                  window.dispatchEvent(new CustomEvent('open-platform-guide'))
                }} 
                className="nav-hub-pill pill-cyan"
                title="Platform Compass & Zero-Confusion Walkthrough (Alt+H)"
              >
                🧭 Platform Guide
              </button>
              <button 
                type="button" 
                onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-test'))} 
                className="nav-hub-pill pill-amber"
                title="Take 2-Minute Diagnostic Skill Placement Test"
              >
                🎯 Skill Baseline
              </button>
              <button 
                type="button" 
                onClick={() => window.dispatchEvent(new CustomEvent('open-certificate'))} 
                className="nav-hub-pill pill-amber"
              >
                🏆 Certificate
              </button>
              <button 
                type="button" 
                onClick={() => setShowCostSentinel(p => !p)} 
                className="nav-hub-pill pill-emerald"
              >
                💰 Cost Sentinel
              </button>
              <button 
                type="button" 
                onClick={() => window.dispatchEvent(new CustomEvent('open-latency-monitor'))} 
                className="nav-hub-pill pill-cyan"
              >
                📡 AWS Ping
              </button>
              <button 
                type="button" 
                onClick={() => window.dispatchEvent(new CustomEvent('open-flashcards', { detail: { deckId: 'scs-c02' } }))} 
                className="nav-hub-pill pill-cyan"
                title="Open AWS Certification Flashcards & Drills"
              >
                ⚡ AWS Flashcards
              </button>
              <Link to="/verify-pack" className="nav-hub-pill pill-cyan">🛡️ Verify Pack</Link>
              <Link to="/downloads" className="nav-hub-pill pill-purple">📦 Downloads</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Platform Architecture & User Orientation Guide ── */}
      <section className="platform-guide-banner" aria-label="Platform Architecture Guide">
        <div className="guide-banner-head">
          <div className="guide-title-box">
            <div className="guide-icon-badge">
              <Compass size={20} />
            </div>
            <div className="guide-heading-text">
              <h2>When To Use What: 10-Week Platform Roadmap & Motivation Hub</h2>
              <p>Chronological exploration guide detailing exactly when each simulator, lab, and arena should be followed from Day 1 to Week 10.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/roadmap" className="button button-ghost btn-sm" style={{ borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '0.78rem' }}>
              Full Roadmap Page →
            </Link>
            <button 
              type="button" 
              onClick={() => setShowPlatformGuide(prev => !prev)} 
              className="guide-toggle-btn"
              aria-expanded={showPlatformGuide}
            >
              {showPlatformGuide ? <><ChevronUp size={14} /> Collapse Guide</> : <><ChevronDown size={14} /> Open Exploration Guide</>}
            </button>
          </div>
        </div>

        {showPlatformGuide && (
          <div style={{ marginTop: '16px' }}>
            <PlatformExplorationRoadmap compact={false} />
          </div>
        )}
      </section>

      {/* ── ENCOURAGING DEFENDER MOTIVATION CALLOUT (SMOOTH TRANSITION) ── */}
      <DefenderQuoteCallout autoCycle={true} cycleIntervalMs={14000} />

      {/* ======================================================== */}
      {/* ── STAGE 01: CAREER READINESS & COMPETENCY SCORING ── */}
      {/* ======================================================== */}
      <div id="stage-01" className="stage-section-wrapper stage-emerald">
        <div className="stage-header-info">
          <span className="stage-badge">STAGE 01</span>
          <div className="stage-text-block">
            <h3><Trophy size={16} style={{ color: '#34d399' }} /> Career Readiness & Competency Progression</h3>
            <p>Track your 7-tier career milestone timeline, master employability score, and verified skill achievements.</p>
          </div>
        </div>
        <div className="stage-meta-pills">
          <span>CIS AWS Benchmark v3.0</span> • <span>Tier Progression 1–7</span>
        </div>
      </div>

      {/* 1. MASTER CAREER PROFILE & 7-TIER PROGRESSION TIMELINE */}
      <CareerJourneyTrack />

      {/* 2. MASTER EMPLOYABILITY ENGINE & CAREER READINESS OS */}
      <MasterEmployabilityHub />

      {/* Core KPIs Score Grid */}
      <div className="score-grid clean-score-grid">
        <ScoreCard
          label="CURRENT VERIFIED RANK"
          value={masterCareerProfile?.currentTier?.title || 'Beginner'}
          detail={masterCareerProfile?.currentTier?.badge || 'Tier 1'}
          tone="cyan"
        />
        <ScoreCard
          label="CAREER READINESS SCORE"
          value={`${masterCareerProfile?.overallReadinessScore || internshipReadiness}%`}
          detail={`Targeting ${masterCareerProfile?.targetCareerRole || 'Cloud Security Engineer'}`}
          tone="green"
        />
        <ScoreCard
          label="SECURITY THINKING SCORE"
          value={`${scorePercent}/100`}
          detail={`${totalScore.toLocaleString()} XP earned`}
        />
        <ScoreCard
          label="VERIFIED EVIDENCE DOSSIERS"
          value={masterCareerProfile?.portfolioEvidence?.verifiedProjectsCount || 0}
          detail={`${masterCareerProfile?.portfolioEvidence?.demonstratedSkills?.length || 6} Skills Demonstrated`}
          tone="purple"
        />
      </div>

      {/* Mandated Compliance & Integrity Disclaimer */}
      <div className="compliance-disclaimer-notice" style={{ marginTop: '12px', marginBottom: '24px', padding: '12px 18px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '0.82rem', color: '#94a3b8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#38bdf8', fontSize: '1.1rem' }}>ℹ️</span>
          <span><strong>Scoring & Credential Standard:</strong> <em>Illustrative training score, not a certified compliance assessment.</em> Verified against CIS AWS Foundations Benchmark v3.0 logic for simulated educational practice.</span>
        </div>
        <button 
          type="button" 
          onClick={handleOpenMasterAuditPack}
          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <FileDown size={13} /> View Remediation & Compliance Audit Pack (Integrity-Checked)
        </button>
      </div>

      {/* ======================================================== */}
      {/* ── STAGE 02: ACTIVE THREAT INTELLIGENCE & TELEMETRY MATRIX ── */}
      {/* ======================================================== */}
      <div id="stage-02" className="stage-section-wrapper stage-cyan">
        <div className="stage-header-info">
          <span className="stage-badge badge-cyan">STAGE 02</span>
          <div className="stage-text-block">
            <h3><Radio size={16} style={{ color: '#38bdf8' }} /> Real-Time Cyber Threat Radar & Live Intelligence</h3>
            <p>360° detection matrix, hyperscaler feeds, active security advisories, and organization maturity assessment.</p>
          </div>
        </div>
        <div className="stage-meta-pills">
          <span>CloudTrail & GuardDuty</span> • <span>Live MITRE Feeds</span>
        </div>
      </div>

      {/* 3. LIVE 360 CYBER THREAT RADAR & TELEMETRY MATRIX */}
      <CyberThreatRadar />

      {/* DAILY AWS CLOUD SECURITY ADAPTIVE SYNC (AWS CLOUD ONLY) */}
      <DailyAwsSecurityTicker />

      {/* Live Security Intel, Labs & Jobs Portal */}
      <LiveFeedPortal defaultFilter="all" />

      {/* Security Maturity Assessment */}
      <SecurityMaturityAssessment compact />

      {/* ======================================================== */}
      {/* ── STAGE 03: ENTERPRISE SKILLS, CAPSTONES & MARKET GAP ANALYSIS ── */}
      {/* ======================================================== */}
      <div id="stage-03" className="stage-section-wrapper stage-purple">
        <div className="stage-header-info">
          <span className="stage-badge badge-purple">STAGE 03</span>
          <div className="stage-text-block">
            <h3><Layers size={16} style={{ color: '#c084fc' }} /> Enterprise Skill Graph, Capstone Missions & Market Gaps</h3>
            <p>10-domain enterprise architecture ontology, role compensation benchmarks, and verifiable skill dossiers.</p>
          </div>
        </div>
        <div className="stage-meta-pills">
          <span>10 Domain Graph</span> • <span>STAR Dossiers</span>
        </div>
      </div>

      {/* RECOMMENDATION ORCHESTRATOR (6-STAGE UNIFIED PATHWAY) */}
      <RecommendationOrchestratorView />

      {/* 10-DOMAIN ENTERPRISE SKILL GRAPH */}
      <SkillGraphView />

      {/* CROSS-MODULE CAPSTONE MISSIONS */}
      <CapstoneMissionsCard />

      {/* PROFESSIONAL PORTFOLIO TRACKER */}
      <PortfolioEvidenceCard />

      {/* ROLE SKILL GAP & SALARY INTELLIGENCE TERMINAL */}
      <RoleSkillGapDashboard initialRole="cloud-security-engineer" />

      {/* Live Skill Profile Radar */}
      <SkillProfileRadar />

      {/* ======================================================== */}
      {/* ── STAGE 04: INTERACTIVE PRACTICE MODULES & ARENAS ── */}
      {/* ======================================================== */}
      <div id="stage-04" className="stage-section-wrapper stage-rose">
        <div className="stage-header-info">
          <span className="stage-badge badge-rose">STAGE 04</span>
          <div className="stage-text-block">
            <h3><Terminal size={16} style={{ color: '#fb7185' }} /> Interactive Practice Modules & Specialized Arenas</h3>
            <p>Choose an operational track below to launch CTF battle rooms, 25 incident tickets, 16 enterprise SOP labs, or free-tier capstones.</p>
          </div>
        </div>
        <div className="stage-meta-pills">
          <span>Dual Mode: CLI + Console</span> • <span>Verified $0 Teardown</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* UNIFIED INTERACTIVE COMMAND CENTER (Replaces Stacked Banners) */}
      {/* ======================================================== */}
      <section className="command-center-section">
        <div className="command-center-header">
          <div>
            <div className="eyebrow">
              <Sparkles size={12} className="text-cyan" />
              <span>INTERACTIVE PRACTICE MODULES</span>
            </div>
            <h2>Specialized Training Tracks & Arenas</h2>
            <p>Select an operational track to launch dedicated enterprise workflows, forensic queries, or CTF challenges.</p>
          </div>
        </div>

        {/* Clean Segmented Tab Switcher */}
        <div className="track-tab-bar" role="tablist">
          <button 
            type="button" 
            className={`track-tab-btn motion-button ${activeTrackTab === 'battlerooms' ? 'active tab-rose' : ''}`}
            onClick={() => { playTabWhoosh(); setActiveTrackTab('battlerooms'); }}
          >
            <Skull size={15} />
            <span>Battle Rooms (CTF)</span>
            <span className="tab-pill pill-rose">{battleRoomsSolvedCount || 0}/6 Solved</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn motion-button ${activeTrackTab === 'rampup' ? 'active tab-emerald' : ''}`}
            onClick={() => { playTabWhoosh(); setActiveTrackTab('rampup'); }}
          >
            <GraduationCap size={15} />
            <span>Ramp-Up & All Labs</span>
            <span className="tab-pill pill-emerald">{rampupLabsCompletedCount || 0}/20 Labs</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn motion-button ${activeTrackTab === 'investigations' ? 'active tab-cyan' : ''}`}
            onClick={() => { playTabWhoosh(); setActiveTrackTab('investigations'); }}
          >
            <ShieldCheck size={15} />
            <span>Incident Simulator</span>
            <span className="tab-pill">{investigationCompletedCount || 0}/25 Tickets</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn motion-button ${activeTrackTab === 'labs' ? 'active tab-sky' : ''}`}
            onClick={() => { playTabWhoosh(); setActiveTrackTab('labs'); }}
          >
            <Terminal size={15} />
            <span>16 Enterprise Labs</span>
            <span className="tab-pill">{completedLabsCount || 0}/16 Labs</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn motion-button ${activeTrackTab === 'playbooks' ? 'active tab-purple' : ''}`}
            onClick={() => { playTabWhoosh(); setActiveTrackTab('playbooks'); }}
          >
            <FileCode2 size={15} />
            <span>Job Playbooks</span>
            <span className="tab-pill">{completedPlaybooksCount || 0}/4 Executed</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn motion-button ${activeTrackTab === 'projects' ? 'active tab-emerald' : ''}`}
            onClick={() => { playTabWhoosh(); setActiveTrackTab('projects'); }}
          >
            <FolderGit2 size={15} />
            <span>Portfolio Projects</span>
            <span className="tab-pill pill-emerald">{completedCloudProjectsCount || 0}/4 Verified</span>
          </button>

          <button 
            type="button" 
            className={`track-tab-btn motion-button ${activeTrackTab === 'sop' ? 'active tab-amber' : ''}`}
            onClick={() => { playTabWhoosh(); setActiveTrackTab('sop'); }}
          >
            <BriefcaseBusiness size={15} />
            <span>6-Stage SOP Framework</span>
          </button>
        </div>

        {/* Tab: Career Ramp-Up & Master Directory */}
        {activeTrackTab === 'rampup' && (
          <div className="track-featured-card card-rampup animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" style={{ backgroundColor: '#10b981' }} /> CAREER BLUEPRINTS & MASTER LAB DIRECTORY /// ALL HYPERSCALERS
              </div>
              <h3>Cloud Security Roles, Ramp-Up Guides & 20 Master Labs</h3>
              <p>
                Authoritative career blueprints for every cloud security role (Cloud Security Engineer, IAM Architect, DevSecOps Lead, Forensics Analyst, and Security Architect), complete with authentic original links to AWS Workshops, TryHackMe cloud rooms, HackTheBox machines, and foundational labs (Linux, Python Boto3, VPC Networking, Docker, and Terraform IaC).
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>CURATED LABS</span>
                  <strong className="text-cyan">{rampupLabsCompletedCount || 0} / 20 Completed</strong>
                </div>
                <div className="metric-box">
                  <span>CAREER ROLES</span>
                  <strong className="text-emerald">5 Key Roles</strong>
                </div>
                <div className="metric-box">
                  <span>FOUNDATION SCOPE</span>
                  <strong className="text-purple">Linux • Py • Net • Docker • IaC</strong>
                </div>
              </div>
              <div className="track-actions">
                <Link to="/ramp-up" className="button button-primary">
                  <GraduationCap size={16} /> Explore All Roles & Labs <ArrowRight size={15} />
                </Link>
                <Link to="/about" className="button button-ghost">
                  Career Readiness Hub
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Battle Rooms (TryHackMe / HackTheBox Style) */}
        {activeTrackTab === 'battlerooms' && (
          <div className="track-featured-card card-battlerooms animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" style={{ backgroundColor: '#ef4444' }} /> PURPLE TEAM ARENA /// TRYHACKME & HACKTHEBOX STYLE
              </div>
              <h3>Cloud Security Battle Rooms & CTF Arenas</h3>
              <p>
                Experience offensive cloud hacking and defensive engineering: exploit AWS Bedrock Agent prompt injection, SSRF into IMDSv1, bypass GitHub Actions OIDC trust, and submit real CTF flags to prove your layoff-proof skills.
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>ARENA ROOMS</span>
                  <strong className="text-rose">{battleRoomsSolvedCount || 0} / 6 Captured</strong>
                </div>
                <div className="metric-box">
                  <span>PERSPECTIVES</span>
                  <strong>Red vs Blue Team</strong>
                </div>
                <div className="metric-box">
                  <span>THREAT SCOPE</span>
                  <strong>GenAI, IMDSv2, CI/CD, EKS</strong>
                </div>
              </div>
            </div>
            <div className="track-card-action">
              <Link to="/battle-rooms" className="button button-primary btn-large btn-rose">
                <Skull size={18} />
                <span>Launch Battle Rooms</span>
                <ArrowRight size={17} />
              </Link>
              <span className="track-helper-note">Capture verification flags & earn XP</span>
            </div>
          </div>
        )}

        {/* Tab 2: Incident Simulator */}
        {activeTrackTab === 'investigations' && (
          <div className="track-featured-card card-investigations animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" /> FLAGSHIP FEATURE /// 25 PRODUCTION INCIDENT INVESTIGATIONS
              </div>
              <h3>Security Incident Investigation Simulator</h3>
              <p>
                Triage raw IAM policies, S3 buckets, network routes, CloudTrail events, and architecture blueprints.
                Learn real Cloud Security Analyst thinking: identify verified vulnerabilities, assess blast radius, and execute step-by-step remediation.
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>RESOLVED INCIDENTS</span>
                  <strong>{investigationCompletedCount} / {investigations.length}</strong>
                </div>
                <div className="metric-box">
                  <span>TRIAGE ACCURACY</span>
                  <strong className="text-cyan">{investigationAverageScore}%</strong>
                </div>
                <div className="metric-box">
                  <span>COVERAGE</span>
                  <strong>5 Domains (IAM, S3, Net, Mon, Arch)</strong>
                </div>
              </div>
            </div>
            <div className="track-card-action">
              <Link
                className="button button-primary btn-large"
                to={nextInvestigation ? `/investigations/${nextInvestigation.id}` : '/investigations'}
              >
                <ShieldCheck size={18} />
                <span>Launch Investigation Simulator</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/investigations" className="flagship-view-all-link">
                Browse all 25 incident tickets &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Tab 3: 16 Enterprise SOP Labs */}
        {activeTrackTab === 'labs' && (
          <div className="track-featured-card card-labs animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" style={{ backgroundColor: 'var(--cyan)' }} /> REAL ENTERPRISE WORKFLOWS /// 16 HANDS-ON RUNBOOK LABS
              </div>
              <h3>Real Cloud Security Job Labs & SOP Guides</h3>
              <p>
                Experience how Cloud Security Engineers execute tickets in Fortune 500 environments.
                Follow click-by-click AWS console navigation, run live AWS CLI commands in the interactive CloudShell sandbox, and master the 6-stage industry standard operating procedure.
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>LABS MASTERED</span>
                  <strong>{completedLabsCount} / {realLabs?.length || 16}</strong>
                </div>
                <div className="metric-box">
                  <span>SOP STEPS COMPLETED</span>
                  <strong className="text-cyan">{completedLabStepsCount} Steps</strong>
                </div>
                <div className="metric-box">
                  <span>DUAL-MODE GUIDANCE</span>
                  <strong>AWS CLI + Console GUI</strong>
                </div>
              </div>
            </div>
            <div className="track-card-action">
              <Link
                className="button button-primary btn-large btn-sky"
                to="/labs"
              >
                <Terminal size={18} />
                <span>Open 16 Real Labs</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/labs" className="flagship-view-all-link">
                Explore all 16 production runbooks &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Tab 4: Job Playbooks Engine */}
        {activeTrackTab === 'playbooks' && (
          <div className="track-featured-card card-playbooks animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" style={{ backgroundColor: 'var(--purple)' }} /> END-TO-END SECOPS PLAYBOOKS /// FROM SCRATCH TO SOLVED
              </div>
              <h3>Cloud Security Job Playbook Engine & Forensic Studio</h3>
              <p>
                Experience the complete enterprise problem-solving lifecycle: Inbound GuardDuty JSON alerts &rarr; 5-minute bridge scoping &rarr; smoking gun extraction &rarr; minute-0 containment &rarr; Terraform IaC fixes &rarr; CISO post-mortem briefings.
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>PLAYBOOKS EXECUTED</span>
                  <strong className="text-purple">{completedPlaybooksCount || 0} / 4 Executed</strong>
                </div>
                <div className="metric-box">
                  <span>WORKFLOW STAGES</span>
                  <strong>7-Step Full SOP</strong>
                </div>
                <div className="metric-box">
                  <span>EXECUTIVE REPORTING</span>
                  <strong>CISO Post-Mortems (.md)</strong>
                </div>
              </div>
            </div>
            <div className="track-card-action">
              <Link
                className="button button-primary btn-large btn-purple"
                to="/playbooks"
              >
                <Layers size={18} />
                <span>Launch Playbook Engine</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/playbooks" className="flagship-view-all-link">
                Explore 7-step playbooks & query logs &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Tab 5: Portfolio Projects (Verified $0 Teardown Workflow) */}
        {activeTrackTab === 'projects' && (
          <div className="track-featured-card card-projects animate-reveal">
            <div className="track-card-copy">
              <div className="track-eyebrow">
                <span className="pulse-dot" style={{ backgroundColor: 'var(--green, #10b981)' }} /> 100% FREE TIER ELIGIBLE /// VERIFIED $0 TEARDOWN WORKFLOW
              </div>
              <h3>Cloud Security Capstone Projects (Verified $0 Teardown Workflow)</h3>
              <p>
                Build and showcase high-impact enterprise security tools in your personal AWS account without paying a dime. Includes automated $0.01 AWS budget alarms, click-by-click tear-down runbooks, and ready-to-paste resume impact statements.
              </p>
              <div className="track-metrics-grid">
                <div className="metric-box">
                  <span>VERIFIED CAPSTONES</span>
                  <strong className="text-emerald">{completedCloudProjectsCount || 0} / 4 Verified</strong>
                </div>
                <div className="metric-box">
                  <span>$0 TEARDOWNS</span>
                  <strong className="text-cyan">{completedTeardownsCount || 0} / 4 Cleaned</strong>
                </div>
                <div className="metric-box">
                  <span>ESTIMATED AWS COST</span>
                  <strong className="text-emerald">$0.00 (Free Tier)</strong>
                </div>
              </div>
            </div>
            <div className="track-card-action">
              <Link
                className="button button-primary btn-large btn-emerald"
                to="/projects"
              >
                <FolderGit2 size={18} />
                <span>Launch Capstone Projects</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/projects" className="flagship-view-all-link">
                View 4 Free-Tier Projects & Safety Setup &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Tab 6: 6-Stage Job SOP Lifecycle */}
        {activeTrackTab === 'sop' && (
          <div className="animate-reveal" style={{ marginTop: '14px' }}>
            <JobProcessFramework />
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* ── STAGE 05: ACTIVE DISPATCH & CONTINUOUS DRILLS ── */}
      {/* ======================================================== */}
      <div id="stage-05" className="stage-section-wrapper stage-amber">
        <div className="stage-header-info">
          <span className="stage-badge badge-amber">STAGE 05</span>
          <div className="stage-text-block">
            <h3><Rocket size={16} style={{ color: '#fbbf24' }} /> Active Assignments & Domain Study Areas</h3>
            <p>Pick up your next challenge ticket, review your on-call weekly rotation, or drill down into specific security domains.</p>
          </div>
        </div>
        <div className="stage-meta-pills">
          <span>{challenges.length - completedCount} Challenges Remaining</span> • <span>Streak Protected</span>
        </div>
      </div>

      {/* Learning Analytics: Study Areas & Progress Trends */}
      <section className="dashboard-analytics-panel clean-panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">LEARNING ANALYTICS</div>
            <h2>Study Areas & Domain Mastery</h2>
          </div>
          <span className="analytics-trend-badge">
            <Flame size={14} /> Practice Active • Streak Protected
          </span>
        </div>

        <div className="study-areas-grid">
          {studyAreas.map(area => {
            const items = challenges.filter(c => c.id.startsWith(area.key))
            const complete = items.filter(c => progress.completed[c.id]).length
            const percent = Math.round((complete / Math.max(1, items.length)) * 100)

            return (
              <div className="study-area-card clean-study-card" key={area.key}>
                <div className="study-area-head">
                  <strong>{area.label}</strong>
                  <span>{percent}%</span>
                </div>
                <div className="study-progress-track">
                  <i style={{ width: `${percent}%` }} />
                </div>
                <small>{complete} of {items.length} completed</small>
              </div>
            )
          })}
        </div>
      </section>

      {/* Active Workspaces Bento Grid */}
      <div className="dashboard-grid clean-dashboard-grid">
        {/* Next Investigation */}
        <section className="panel continue-panel clean-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">UP NEXT / SCENARIO LAB</div>
              <h2>Continue Challenge Track</h2>
            </div>
            <Link to="/categories" className="panel-link">
              View all {challenges.length}
            </Link>
          </div>
          <ChallengeCard challenge={next} />
        </section>

        {/* Next Weekly Internship Ticket */}
        <section className="panel ticket-jump-panel clean-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">ON-CALL / INTERNSHIP ROTATION</div>
              <h2>{nextTicket.week}: {nextTicket.weekTopic}</h2>
            </div>
            <Link to="/internship-simulator" className="panel-link">
              Inbox ({threatScenarios.length})
            </Link>
          </div>
          <div className="ticket-jump-card clean-ticket-card">
            <div className="ticket-jump-meta">
              <span className="ticket-badge">{nextTicket.ticket}</span>
              <span className={`risk-tag risk-${nextTicket.riskLevel.toLowerCase()}`}>
                {nextTicket.riskLevel} Risk
              </span>
            </div>
            <h3>{nextTicket.title}</h3>
            <p>{nextTicket.incidentSummary}</p>
            <div className="ticket-jump-actions">
              <Link className="button button-primary" to="/internship-simulator">
                Triage Incident Ticket <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Remediation & Compliance Audit Pack Modal */}
      {showAuditModal && auditPack && (
        <div className="audit-modal-backdrop" onClick={() => setShowAuditModal(false)}>
          <div className="audit-modal-window" onClick={e => e.stopPropagation()}>
            <div className="audit-modal-header">
              <div>
                <div className="audit-modal-tag">CRYPTOGRAPHICALLY SEALED AUDIT DOSSIER</div>
                <h3>{auditPack.meta?.packTitle || 'Master Remediation & Compliance Audit Pack'}</h3>
                <p>Digital Seal: <code className="audit-seal-hash">{auditPack.meta?.cryptographicSignature?.slice(0, 32)}...</code></p>
              </div>
              <button type="button" className="btn-close-audit" onClick={() => setShowAuditModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="audit-disclaimer-callout">
              <strong>Integrity Notice:</strong> {auditPack.meta?.disclaimer || 'Illustrative training score, not a certified compliance assessment.'}
            </div>

            <div className="audit-modal-body">
              <div className="audit-metrics-row">
                <div className="audit-metric-box">
                  <span className="metric-label">CIS AWS FOUNDATIONS</span>
                  <strong className="metric-value text-emerald">
                    {auditPack.complianceAudit?.complianceDeltas?.[0]?.initialScore} → {auditPack.complianceAudit?.complianceDeltas?.[0]?.remediatedScore}
                  </strong>
                  <small>Delta: {auditPack.complianceAudit?.complianceDeltas?.[0]?.delta}</small>
                </div>
                <div className="audit-metric-box">
                  <span className="metric-label">NIST 800-53 REV 5</span>
                  <strong className="metric-value text-cyan">
                    {auditPack.complianceAudit?.complianceDeltas?.[1]?.initialScore} → {auditPack.complianceAudit?.complianceDeltas?.[1]?.remediatedScore}
                  </strong>
                  <small>Delta: {auditPack.complianceAudit?.complianceDeltas?.[1]?.delta}</small>
                </div>
                <div className="audit-metric-box">
                  <span className="metric-label">FINOPS INCIDENT DEBT</span>
                  <strong className="metric-value text-emerald">
                    {auditPack.finopsIncidentDebt?.curtailedCost}
                  </strong>
                  <small>Debt: {auditPack.finopsIncidentDebt?.totalIncidentDebt}</small>
                </div>
              </div>

              <div className="audit-subheading" style={{ marginTop: '16px', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.05em' }}>
                CONTAINMENT EXECUTION LEDGER
              </div>
              <div className="audit-containment-list">
                {auditPack.containmentLogs?.map((logLine, idx) => (
                  <div key={idx} className="audit-containment-item">
                    <Check size={14} className="text-emerald" />
                    <span className="step-name" style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{logLine}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="audit-modal-footer">
              <button 
                type="button" 
                className="btn-download-audit" 
                onClick={handlePrintAuditPdf}
                style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', color: '#fff', border: 'none' }}
                title="Open and view or save the official NAEN Studios certified audit dossier PDF"
              >
                <FileText size={14} />
                <span>📄 View & Save NAEN Audit PDF</span>
              </button>
              <button 
                type="button" 
                className="btn-download-audit" 
                onClick={handleDownloadHardenedModule}
                disabled={isExportingZip}
                style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.35)', color: '#38bdf8' }}
                title="Download official Terraform production hardening code module as .zip"
              >
                <Download size={14} />
                <span>{isExportingZip ? 'Packaging Zip...' : 'Download Hardened Module (.zip)'}</span>
              </button>
              <button type="button" className="btn-copy-markdown" onClick={handleCopyMasterAuditMarkdown}>
                <Copy size={14} />
                <span>{copiedAudit ? 'Copied Markdown!' : 'Copy Summary (MD)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SeCloudive Intelligence Engine Operations & Escalation Queue Modal */}
      {showAIOpsModal && (
        <div className="audit-modal-backdrop" onClick={() => setShowAIOpsModal(false)}>
          <div className="audit-modal-window" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <AIOperationsDashboard onClose={() => setShowAIOpsModal(false)} />
          </div>
        </div>
      )}
    </main>
  )
}
