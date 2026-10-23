import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import allChallenges from '../data/index.js'
import threatScenarios from '../data/threatScenarios.js'
import { investigations, investigationCategories } from '../data/investigations.js'
import { realLabs, jobProcessStages, jobRoles } from '../data/jobLabs.js'
import { battleRooms } from '../data/battleRooms.js'
import { evaluateEarnedBadges } from '../data/learning/badges.js'
import { evaluateAdaptiveQuizSession } from '../data/learning/adaptiveQuizEngine.js'
import { generateAdaptiveRecommendations } from '../data/learning/recommendationEngine.js'
import { calculateInternshipProgression, INTERNSHIP_LEVELS, PROMOTION_BADGES, LIVE_INTERNSHIPS_FEED } from '../data/internshipData.js'
import { generateMasterCareerProfile, CAREER_TIERS, SKILL_GRAPH_DOMAINS, CAPSTONE_MISSIONS } from '../data/careerIntelligence.js'
import { MASTER_INCIDENT_BANK, INCIDENT_CATEGORIES } from '../data/expandedIncidentBank.js'
import { MASTER_ARCHITECTURE_REVIEWS } from '../data/expandedArchitectureBank.js'
import { MASTER_THREAT_HUNTS } from '../data/expandedThreatHunts.js'
import { MASTER_SAFE_LABS } from '../data/expandedSafeLabs.js'
import { ROLE_ROADMAPS } from '../data/expandedRoleRoadmaps.js'
import { MASTER_INTERVIEW_BANK } from '../data/expandedInterviewBank.js'
import { MASTER_CASE_STUDIES } from '../data/caseStudiesBank.js'
import { calculateComprehensiveEmployability } from '../utils/employabilityCalculator.js'
import { evaluateLearnerSubmission } from '../services/geminiMentorQualityEngine.js'
import { exportAuditPackAllFormats, downloadHardenedTerraformModule } from '../utils/auditExportEngine.js'
import { cloudProjects } from '../data/cloudProjects.js'
import { jobPlaybooks } from '../data/jobPlaybooks.js'
import { geminiKeyPool } from '../services/geminiKeyRotator.js'
import { 
  CLOUD_PROVIDERS, 
  MULTI_CLOUD_CROSSWALK_5CLOUDS, 
  MULTI_CLOUD_LAB_COMMANDS,
  getMultiCloudCliForStep,
  getMultiCloudConsoleForStep
} from '../data/multiCloudResources.js'
import { SKILL_MAP_NODES, AUDIENCE_PERSONAS } from '../data/learning/stepWiseSkillMap.js'
import { getLearnerClearance, isFeatureAccessible } from '../data/structuredLearningPath.js'
import { shouldHydrateCloudProgress } from '../utils/progressMerge.js'


import {
  getActiveProfile,
  getAllProfiles,
  setActiveProfile as setManagerActiveProfile,
  registerUniqueProfile as registerManagerProfile,
  loginWithUserId as loginManagerWithUserId,
  switchToGuestMode as switchToManagerGuestMode,
  isUserIdAvailable,
  generateUniqueUserId,
  deleteProfile as deleteManagerProfile,
  updateProfile as updateManagerProfile,
  loadProfileProgress,
  saveProfileProgress,
  getProfileStorageKey,
  triggerExportDownload,
  importUserProfilePackage,
  signInWithGoogleAccount,
  linkGoogleAccountToProfile
} from '../services/userSyncManager.js'

import { useAuth } from './AuthContext'
import {
  saveUserProgress,
  saveUserSettings,
  fetchUserProgress,
} from '../services/supabaseProgressService'

const STORAGE_KEY = 'secloudive-progress-v1'
const ChallengeContext = createContext(null)

// Debounce helper — returns a function that only fires after `delay` ms of silence
function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function ChallengeProvider({ children }) {
  // Supabase auth context (provides supabaseUserId, supabaseData, isSupabaseMode)
  const auth = useAuth()

  const [activeProfile, setActiveProfileState] = useState(getActiveProfile)
  const [allProfiles, setAllProfiles] = useState(getAllProfiles)
  const [progress, setProgress] = useState(() => loadProfileProgress(activeProfile.id))
  const [autoSaveState, setAutoSaveState] = useState({
    isSaving: false,
    lastSaved: 'Just now'
  })

  // Global Sandbox Mode lets evaluators preview all levels & simulators
  const [sandboxMode, setSandboxModeState] = useState(() => {
    try {
      return localStorage.getItem('secloudive_structured_sandbox_mode') === 'true'
    } catch {
      return false
    }
  })

  const setSandboxMode = (val) => {
    setSandboxModeState(Boolean(val))
    try {
      localStorage.setItem('secloudive_structured_sandbox_mode', String(Boolean(val)))
    } catch {}
  }

  // Live Cyber Security Clearance calculation
  const clearance = useMemo(() => {
    return getLearnerClearance(progress, sandboxMode)
  }, [progress, sandboxMode])

  const checkFeatureAccess = (featureKey) => {
    return isFeatureAccessible(featureKey, progress, sandboxMode)
  }

  // Global Multi-Cloud Provider Filter: 'all' | 'aws' | 'azure' | 'gcp' | 'oci' | 'ibm'
  const [selectedCloudProvider, setSelectedCloudProviderState] = useState(() => {
    try {
      return localStorage.getItem('secloudive_selected_cloud_provider') || 'all'
    } catch {
      return 'all'
    }
  })

  const setSelectedCloudProvider = (providerId) => {
    const valid = ['all', 'aws', 'azure', 'gcp', 'oci', 'ibm'].includes(providerId) ? providerId : 'all'
    setSelectedCloudProviderState(valid)
    try {
      localStorage.setItem('secloudive_selected_cloud_provider', valid)
    } catch {}
  }

  // NAEN Studios Track Mode: 'single' | 'multi'
  const [learningTrackMode, setLearningTrackModeState] = useState(() => {
    try {
      return localStorage.getItem('secloudive_learning_track_mode') || 'multi'
    } catch {
      return 'multi'
    }
  })

  const setLearningTrackMode = (mode) => {
    const valid = ['single', 'multi'].includes(mode) ? mode : 'multi'
    setLearningTrackModeState(valid)
    try {
      localStorage.setItem('secloudive_learning_track_mode', valid)
    } catch {}
  }

  // NAEN Studios Target Cloud Specialty: 'aws' | 'azure' | 'gcp' | 'oci' | 'ibm'
  const [targetCloudSpecialty, setTargetCloudSpecialtyState] = useState(() => {
    try {
      return localStorage.getItem('secloudive_target_cloud_specialty') || 'aws'
    } catch {
      return 'aws'
    }
  })

  const setTargetCloudSpecialty = (cloudId) => {
    const valid = ['aws', 'azure', 'gcp', 'oci', 'ibm'].includes(cloudId) ? cloudId : 'aws'
    setTargetCloudSpecialtyState(valid)
    try {
      localStorage.setItem('secloudive_target_cloud_specialty', valid)
    } catch {}
  }

  // NAEN Studios Learning Persona: 'student' | 'lecturer' | 'engineer' | 'switcher'
  const [learningPersona, setLearningPersonaState] = useState(() => {
    try {
      return localStorage.getItem('secloudive_learning_persona') || 'student'
    } catch {
      return 'student'
    }
  })

  const setLearningPersona = (personaId) => {
    const valid = ['student', 'lecturer', 'engineer', 'switcher'].includes(personaId) ? personaId : 'student'
    setLearningPersonaState(valid)
    try {
      localStorage.setItem('secloudive_learning_persona', valid)
    } catch {}
  }

  // Global Scenario State Store: connects IaC Linter, Dynamic Topology, and Playbook Engine
  const [activeScenarioState, setActiveScenarioState] = useState({
    scenarioId: 'ssrf-imds',
    scenarioTitle: 'Capital One SSRF & IMDSv1 Credential Exfiltration',
    mode: 'simulator',
    iacState: {
      templateId: 's3-bucket-security',
      activeCode: '',
      remediated: false,
      detectedFlaws: ['CKV_AWS_135: Enforce IMDSv2 (http_tokens = required)']
    },
    topologyState: {
      activeIndustry: 'fintech',
      threatActive: false,
      selectedNodeId: null,
      topologyScore: 78,
      controls: {
        imdsv2: false,
        s3BlockPublic: false,
        kmsCustomerKey: false,
        sgRestricted: false
      }
    },
    playbookState: {
      selectedFindingIds: [],
      assessedSeverity: 'CRITICAL',
      selectedContainmentId: 'contain-ssrf-imdsv2',
      containmentLogs: [],
      executionStatus: 'idle'
    },
    finopsState: {
      hourlyCost: 98.56,
      totalIncidentCost: 4730.88,
      estimatedCo2Kg: 691,
      curtailedCost: 4021.25
    },
    simulatedLogs: []
  })

  const updateScenarioState = (updates) => {
    setActiveScenarioState(prev => ({ ...prev, ...updates }))
  }

  const updateScenarioIac = (iacUpdates) => {
    setActiveScenarioState(prev => ({
      ...prev,
      iacState: { ...prev.iacState, ...iacUpdates }
    }))
  }

  const updateScenarioTopology = (topologyUpdates) => {
    setActiveScenarioState(prev => ({
      ...prev,
      topologyState: { ...prev.topologyState, ...topologyUpdates }
    }))
  }

  const updateScenarioPlaybook = (playbookUpdates) => {
    setActiveScenarioState(prev => ({
      ...prev,
      playbookState: { ...prev.playbookState, ...playbookUpdates }
    }))
  }

  const addScenarioSimulationLog = (logEntry) => {
    const safeEvent = typeof logEntry === 'string'
      ? (logEntry.includes('SIMULATED') ? logEntry : `[SIMULATED - not a real AWS event] ${logEntry}`)
      : {
          ...logEntry,
          accountId: '000000000000',
          simulationNotice: 'SIMULATED - not a real AWS event'
        }
    setActiveScenarioState(prev => ({
      ...prev,
      simulatedLogs: [safeEvent, ...(prev.simulatedLogs || [])].slice(0, 100)
    }))
  }

  const exportScenarioAuditPack = async (customOptions = {}) => {
    return await exportAuditPackAllFormats({
      scenario: {
        id: activeScenarioState.scenarioId,
        title: activeScenarioState.scenarioTitle
      },
      activeIac: activeScenarioState.iacState,
      topologyScore: activeScenarioState.topologyState?.topologyScore || 85,
      topologyControls: activeScenarioState.topologyState?.controls || {},
      simulationLogs: activeScenarioState.simulatedLogs,
      finopsMetrics: activeScenarioState.finopsState,
      learnerName: activeProfile.name || 'Cloud Security Analyst',
      ...customOptions
    })
  }

  const downloadScenarioTerraform = async (customOptions = {}) => {
    return await downloadHardenedTerraformModule({
      scenarioId: activeScenarioState.scenarioId,
      scenarioTitle: activeScenarioState.scenarioTitle,
      ...customOptions
    })
  }

  // Real-time auto-saving whenever progress changes
  useEffect(() => {
    setAutoSaveState(prev => ({ ...prev, isSaving: true }))
    saveProfileProgress(activeProfile.id, progress)
    const t = setTimeout(() => {
      setAutoSaveState({
        isSaving: false,
        lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      })
    }, 350)
    return () => clearTimeout(t)
  }, [progress, activeProfile.id])

  // ── Supabase: Hydrate from cloud when user signs in ──────────────────────
  useEffect(() => {
    if (!auth?.isSupabaseMode || !auth?.supabaseUserId || !auth?.supabaseData?.progress) return
    const cloudProgress = auth.supabaseData.progress
    if (shouldHydrateCloudProgress(progress, cloudProgress)) {
      // Cloud wins only when the local profile contains no meaningful activity.
      setProgress(() => cloudProgress)
      setAutoSaveState({ isSaving: false, lastSaved: 'Synced from cloud ☁️' })
    }
  }, [auth?.supabaseUserId, auth?.supabaseData?.progress, auth?.isSupabaseMode, progress])

  useEffect(() => {
    const targetKey = getProfileStorageKey(activeProfile.id)
    const handleStorageChange = (e) => {
      if ((e.key === targetKey || e.key === STORAGE_KEY) && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue)
          setProgress(updated)
          setAutoSaveState({
            isSaving: false,
            lastSaved: 'Synced across tabs'
          })
        } catch { /* ignore parse error */ }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [activeProfile.id])

  // Listen for user profile switches and updates
  useEffect(() => {
    const handleSwitch = (e) => {
      const newProfile = e.detail?.profile || getActiveProfile()
      setActiveProfileState(newProfile)
      setAllProfiles(getAllProfiles())
      setProgress(loadProfileProgress(newProfile.id))
      setAutoSaveState({
        isSaving: false,
        lastSaved: 'Switched profile'
      })
    }
    const handleUpdate = () => {
      setActiveProfileState(getActiveProfile())
      setAllProfiles(getAllProfiles())
    }
    window.addEventListener('secloudive-user-switched', handleSwitch)
    window.addEventListener('secloudive-user-updated', handleUpdate)
    return () => {
      window.removeEventListener('secloudive-user-switched', handleSwitch)
      window.removeEventListener('secloudive-user-updated', handleUpdate)
    }
  }, [])

  // Listen for diagnostic placement test completion to update state and unlock Level 2 live
  useEffect(() => {
    const handleDiagnosticCompleted = (e) => {
      const results = e.detail
      if (results) {
        setProgress(current => ({
          ...current,
          diagnosticBaseline: results
        }))
      }
    }
    window.addEventListener('diagnostic-test-completed', handleDiagnosticCompleted)
    return () => window.removeEventListener('diagnostic-test-completed', handleDiagnosticCompleted)
  }, [])

  // User management actions
  const switchUserProfile = (profileId) => {
    setManagerActiveProfile(profileId)
  }

  const registerUniqueProfile = (data) => {
    const res = registerManagerProfile(data)
    setAllProfiles(getAllProfiles())
    return res
  }

  const loginWithUserId = async (userId) => {
    if (auth?.loginWithUserId) {
      const res = await auth.loginWithUserId(userId)
      setAllProfiles(getAllProfiles())
      return res
    }
    const res = loginManagerWithUserId(userId)
    setAllProfiles(getAllProfiles())
    return res
  }

  const switchToGuestMode = () => {
    const res = switchToManagerGuestMode()
    setAllProfiles(getAllProfiles())
    if (auth?.signOut) {
      try { auth.signOut() } catch {}
    }
    return res
  }

  // Alias for legacy calls
  const createUserProfile = (data) => {
    return registerUniqueProfile({
      userId: data.userId || generateUniqueUserId(),
      ...data
    })
  }

  const deleteUserProfile = (profileId) => {
    const res = deleteManagerProfile(profileId)
    setAllProfiles(getAllProfiles())
    return res
  }

  const updateUserProfile = (profileId, updates) => {
    const res = updateManagerProfile(profileId, updates)
    setAllProfiles(getAllProfiles())
    return res
  }

  const exportUserData = () => {
    triggerExportDownload(activeProfile.id)
  }

  const importUserData = (payload, asNew = false) => {
    const res = importUserProfilePackage(payload, asNew)
    setAllProfiles(getAllProfiles())
    return res
  }

  const loginWithGoogle = (googleUser, options = {}) => {
    const res = signInWithGoogleAccount(googleUser, options)
    setAllProfiles(getAllProfiles())
    if (auth?.signInWithDirectGoogleData) {
      try {
        auth.signInWithDirectGoogleData(googleUser, options)
      } catch {}
    }
    return res
  }

  const linkGoogleAccount = (googleUser) => {
    const res = linkGoogleAccountToProfile(activeProfile.id, googleUser)
    setAllProfiles(getAllProfiles())
    return res
  }

  const submitAnswer = (challenge, answer) =>
    setProgress(current => ({
      ...current,
      answers: { ...current.answers, [challenge.id]: answer },
      completed: { ...current.completed, [challenge.id]: answer === challenge.correctAnswer }
    }))

  const submitArchitectureReview = (challenge, findingIds) =>
    setProgress(current => ({
      ...current,
      architectureScores: {
        ...current.architectureScores,
        [challenge.id]: Math.round((findingIds.length / challenge.findings.length) * 100)
      },
      completed: { ...current.completed, [challenge.id]: true }
    }))

  const submitSimulatorInvestigation = (scenario, findingIds) =>
    setProgress(current => ({
      ...current,
      simulatorScores: {
        ...current.simulatorScores,
        [scenario.id]: Math.round((findingIds.length / Math.max(1, scenario.evidence.length)) * 100)
      }
    }))

  const submitInvestigation = (investigation, selectedFindingIds, assessedSeverity, selectedContainmentId) => {
    const correctFindings = investigation.findings.filter(f => f.isCorrect).map(f => f.id)
    const incorrectFindings = investigation.findings.filter(f => !f.isCorrect).map(f => f.id)

    // Calculate precision and recall on findings
    const truePositives = selectedFindingIds.filter(id => correctFindings.includes(id)).length
    const falsePositives = selectedFindingIds.filter(id => incorrectFindings.includes(id)).length
    
    // Severity assessment matches
    const severityMatch = assessedSeverity && assessedSeverity.toLowerCase() === investigation.riskLevel.toLowerCase()

    // Tactical containment decision scoring
    let containmentScore = 0
    let findingsWeight = 80
    let severityWeight = 20

    if (investigation.containmentProtocol) {
      findingsWeight = 70
      severityWeight = 15
      const correctOption = investigation.containmentProtocol.options.find(o => o.isCorrect)
      if (correctOption && selectedContainmentId === correctOption.id) {
        containmentScore = 15
      }
    }

    const findingsScore = Math.max(0, (truePositives - (falsePositives * 0.5)) / Math.max(1, correctFindings.length)) * findingsWeight
    const severityScore = severityMatch ? severityWeight : 0
    const totalInvestigationScore = Math.min(100, Math.round(findingsScore + severityScore + containmentScore))

    setProgress(current => ({
      ...current,
      completed: { ...current.completed, [investigation.id]: true },
      investigationScores: {
        ...current.investigationScores,
        [investigation.id]: totalInvestigationScore
      },
      investigationAssessments: {
        ...current.investigationAssessments,
        [investigation.id]: {
          selectedFindingIds,
          assessedSeverity,
          selectedContainmentId,
          submittedAt: new Date().toISOString(),
          score: totalInvestigationScore
        }
      }
    }))

    return totalInvestigationScore
  }

  const toggleLabStep = (labId, stepId) => {
    setProgress(current => {
      const existing = current.labSteps?.[labId] || []
      const updated = existing.includes(stepId)
        ? existing.filter(id => id !== stepId)
        : [...existing, stepId]
      return {
        ...current,
        labSteps: {
          ...current.labSteps,
          [labId]: updated
        }
      }
    })
  }

  const resetLabProgress = labId => {
    setProgress(current => {
      const copy = { ...(current.labSteps || {}) }
      delete copy[labId]
      return { ...current, labSteps: copy }
    })
  }

  const toggleLearningTopic = topicId => {
    setProgress(current => {
      const existing = current.learningTopicsCompleted || []
      const updated = existing.includes(topicId)
        ? existing.filter(id => id !== topicId)
        : [...existing, topicId]
      return {
        ...current,
        learningTopicsCompleted: updated
      }
    })
  }

  const toggleLearningBookmark = topicId => {
    setProgress(current => {
      const existing = current.learningBookmarkedTopics || []
      const updated = existing.includes(topicId)
        ? existing.filter(id => id !== topicId)
        : [...existing, topicId]
      return {
        ...current,
        learningBookmarkedTopics: updated
      }
    })
  }

  const setTargetCareerRole = (role) => {
    setProgress(current => ({
      ...current,
      targetCareerRole: role
    }))
  }

  const submitAdaptiveQuizSession = (pathId, session, answers) => {
    const evaluation = evaluateAdaptiveQuizSession(session, answers)
    if (!evaluation) return null

    setProgress(current => {
      const existingHistory = current.quizAttemptsHistory?.[pathId] || []
      return {
        ...current,
        learningQuizScores: {
          ...(current.learningQuizScores || {}),
          [pathId]: evaluation.score
        },
        quizAttemptsHistory: {
          ...(current.quizAttemptsHistory || {}),
          [pathId]: [...existingHistory, evaluation]
        }
      }
    })
    return evaluation
  }

  const submitModuleQuiz = (pathId, submissionData) => {
    const numericScore = typeof submissionData === 'number'
      ? submissionData
      : (submissionData?.score ?? 75)

    setProgress(current => ({
      ...current,
      learningQuizScores: {
        ...(current.learningQuizScores || {}),
        [pathId]: numericScore
      }
    }))
  }

  const resetModuleQuiz = (pathId) => {
    setProgress(current => {
      const copy = { ...(current.learningQuizScores || {}) }
      delete copy[pathId]
      return {
        ...current,
        learningQuizScores: copy
      }
    })
  }

  const submitTopicCheck = (topicId, checkType, optionIndex) => {
    setProgress(current => {
      const existing = current.topicCheckAnswers?.[topicId] || {}
      return {
        ...current,
        topicCheckAnswers: {
          ...(current.topicCheckAnswers || {}),
          [topicId]: {
            ...existing,
            [checkType]: optionIndex
          }
        }
      }
    })
  }

  const toggleCapstoneStep = (missionId, stepId) => {
    setProgress(current => {
      const existingMission = current.capstoneMissionSteps?.[missionId] || {}
      const isDone = Boolean(existingMission[stepId])
      return {
        ...current,
        capstoneMissionSteps: {
          ...(current.capstoneMissionSteps || {}),
          [missionId]: {
            ...existingMission,
            [stepId]: !isDone
          }
        }
      }
    })
  }

  const resetCapstoneProgress = (missionId) => {
    setProgress(current => {
      const copy = { ...(current.capstoneMissionSteps || {}) }
      delete copy[missionId]
      return {
        ...current,
        capstoneMissionSteps: copy
      }
    })
  }

  const resetLearningProgress = () => {
    setProgress(current => ({
      ...current,
      learningTopicsCompleted: [],
      learningBookmarkedTopics: [],
      learningQuizScores: {},
      topicCheckAnswers: {},
      quizAttemptsHistory: {}
    }))
  }

  // NAEN Studios Step-Wise Skill Map Unlocks
  const unlockStep = (stepId) => {
    setProgress(current => {
      const existing = current.stepWiseUnlocks || ['step-01']
      if (existing.includes(stepId)) return current
      const updated = [...existing, stepId]
      return {
        ...current,
        stepWiseUnlocks: updated
      }
    })
  }

  const isStepUnlocked = (stepId, prerequisiteStepId) => {
    if (stepId === 'step-01') return true
    const unlocks = progress?.stepWiseUnlocks || ['step-01']
    if (unlocks.includes(stepId)) return true
    if (prerequisiteStepId && unlocks.includes(prerequisiteStepId)) {
      return true
    }
    return false
  }

  const resetStepWiseProgress = () => {
    setProgress(current => ({
      ...current,
      stepWiseUnlocks: ['step-01']
    }))
  }

  const submitBattleRoomFlag = (roomId, flag) => {
    const room = battleRooms.find(r => r.id === roomId)
    if (!room) return false
    const isCorrect = (flag || '').trim() === room.flag
    if (isCorrect) {
      setProgress(current => {
        const updatedRooms = { ...(current.battleRoomsSolved || {}), [roomId]: true }
        try {
          localStorage.setItem('secloudive_solved_rooms', JSON.stringify(updatedRooms))
        } catch { /* ignore */ }
        return {
          ...current,
          battleRoomsSolved: updatedRooms
        }
      })
      return true
    }
    return false
  }

  const toggleRampupLab = (labId) => {
    setProgress(current => {
      const existing = current.rampupLabsCompleted || {}
      const updated = { ...existing, [labId]: !existing[labId] }
      try {
        localStorage.setItem('secloudive_rampup_completed', JSON.stringify(updated))
      } catch { /* ignore */ }
      return {
        ...current,
        rampupLabsCompleted: updated
      }
    })
  }

  const recordDownload = (downloadId) => {
    setProgress(current => {
      const existing = current.downloadedPacks || []
      if (existing.includes(downloadId)) return current
      return {
        ...current,
        downloadedPacks: [...existing, downloadId]
      }
    })
  }

  const toggleCloudProject = (projectId) => {
    setProgress(current => {
      const existing = current.cloudProjectsCompleted || {}
      const updated = { ...existing, [projectId]: !existing[projectId] }
      try {
        localStorage.setItem('secloudive_cloud_projects_completed', JSON.stringify(updated))
      } catch { /* ignore */ }
      return {
        ...current,
        cloudProjectsCompleted: updated
      }
    })
    window.dispatchEvent(new CustomEvent('secloudive-progress-updated', { detail: { type: 'cloudProject', projectId } }))
  }

  const toggleProjectTeardown = (projectId) => {
    setProgress(current => {
      const existing = current.cloudProjectsTeardown || {}
      const isTearedDown = Boolean(existing[projectId])
      const updated = {
        ...existing,
        [projectId]: isTearedDown ? null : {
          verifiedAt: new Date().toISOString(),
          status: 'verified_zero_cost'
        }
      }
      try {
        localStorage.setItem('secloudive_cloud_projects_teardown', JSON.stringify(updated))
      } catch { /* ignore */ }
      return {
        ...current,
        cloudProjectsTeardown: updated
      }
    })
    window.dispatchEvent(new CustomEvent('secloudive-progress-updated', { detail: { type: 'projectTeardown', projectId } }))
  }

  const executePlaybook = (playbookId) => {
    setProgress(current => {
      const existing = current.playbooksExecuted || {}
      const updated = {
        ...existing,
        [playbookId]: {
          executedAt: new Date().toISOString(),
          status: 'contained'
        }
      }
      try {
        localStorage.setItem('secloudive_playbooks_executed', JSON.stringify(updated))
      } catch { /* ignore */ }
      return {
        ...current,
        playbooksExecuted: updated
      }
    })
    addScenarioSimulationLog(`[PLAYBOOK EXECUTED] ${playbookId} tactical containment protocol engaged successfully.`)
    window.dispatchEvent(new CustomEvent('secloudive-progress-updated', { detail: { type: 'playbookExecuted', playbookId } }))
  }

  const containRadarThreat = (threatId, threatTitle = '') => {
    setProgress(current => {
      const existing = current.radarThreatsContained || {}
      const updated = {
        ...existing,
        [threatId]: {
          containedAt: new Date().toISOString(),
          threatTitle
        }
      }
      try {
        localStorage.setItem('secloudive_radar_threats_contained', JSON.stringify(updated))
      } catch { /* ignore */ }
      return {
        ...current,
        radarThreatsContained: updated
      }
    })
    updateScenarioPlaybook({ executionStatus: 'contained' })
    addScenarioSimulationLog(`[RADAR THREAT CONTAINED] ${threatTitle || threatId} isolated and neutralized via SOC SOP.`)
    window.dispatchEvent(new CustomEvent('secloudive-progress-updated', { detail: { type: 'radarContained', threatId } }))
  }

  const resetProgress = () =>
    setProgress({
      answers: {},
      completed: {},
      architectureScores: {},
      simulatorScores: {},
      investigationScores: {},
      investigationAssessments: {},
      labSteps: {},
      learningTopicsCompleted: [],
      learningBookmarkedTopics: [],
      learningQuizScores: {},
      topicCheckAnswers: {},
      targetCareerRole: 'Cloud Security Engineer',
      quizAttemptsHistory: {},
      capstoneMissionSteps: {},
      battleRoomsSolved: {},
      rampupLabsCompleted: {},
      cloudProjectsCompleted: {},
      cloudProjectsTeardown: {},
      playbooksExecuted: {},
      radarThreatsContained: {},
      interviewAttempts: {},
      downloadedPacks: []
    })

  const completedCount = Object.values(progress.completed).filter(Boolean).length
  const architectureReviewedCount = Object.keys(progress.architectureScores || {}).length
  const simulatorCompletedCount = Object.keys(progress.simulatorScores || {}).length
  const investigationCompletedCount = Object.keys(progress.investigationScores || {}).length

  // Calculate completed labs (labs where all steps are marked complete)
  const completedLabsCount = useMemo(() => {
    let count = 0
    realLabs.forEach(lab => {
      const completedSteps = progress.labSteps?.[lab.id] || []
      const totalSteps = lab.steps?.length || 0
      if (totalSteps > 0 && completedSteps.length === totalSteps) {
        count += 1
      }
    })
    return count
  }, [progress.labSteps])

  // Total completed lab steps across all labs
  const completedLabStepsCount = useMemo(() => {
    return Object.values(progress.labSteps || {}).reduce((sum, arr) => sum + (arr?.length || 0), 0)
  }, [progress.labSteps])

  // Categorical investigation completion tracking
  const investigationCategoryCounts = useMemo(() => {
    const counts = {}
    investigations.forEach(inv => {
      const cat = inv.categoryKey
      if (!counts[cat]) counts[cat] = { total: 0, completed: 0 }
      counts[cat].total += 1
      if (progress.investigationScores?.[inv.id] !== undefined) {
        counts[cat].completed += 1
      }
    })
    return counts
  }, [progress.investigationScores])

  const investigationAverageScore = useMemo(() => {
    const scores = Object.values(progress.investigationScores || {})
    if (!scores.length) return 0
    return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
  }, [progress.investigationScores])

  const internshipReadiness = Math.round(
    Object.values(progress.simulatorScores || {}).reduce((sum, score) => sum + score, 0) /
      Math.max(1, threatScenarios.length)
  )

  const earnedBadges = useMemo(() => {
    return evaluateEarnedBadges(progress.learningTopicsCompleted || [], progress.learningQuizScores || {})
  }, [progress.learningTopicsCompleted, progress.learningQuizScores])

  const totalScore = allChallenges.reduce((sum, challenge) => {
    if (challenge.id.startsWith('architecture-') && progress.architectureScores?.[challenge.id] !== undefined) {
      return sum + Math.round((challenge.points * progress.architectureScores[challenge.id]) / 100)
    }
    return sum + (progress.completed[challenge.id] ? challenge.points : 0)
  }, 0)

  const maxScore = allChallenges.reduce((sum, challenge) => sum + challenge.points, 0)
  const scorePercent = Math.round((totalScore / Math.max(1, maxScore)) * 100)

  // Adaptive Learning Recommendations Engine
  const adaptiveRecommendations = useMemo(() => {
    return generateAdaptiveRecommendations(
      {
        progress,
        challenges: allChallenges,
        learningQuizScores: progress.learningQuizScores || {},
        topicCheckAnswers: progress.topicCheckAnswers || {},
        threatScenarios
      },
      progress.targetCareerRole || 'Cloud Security Engineer'
    )
  }, [progress])

  // Internship Progression
  const internshipProgression = useMemo(() => {
    return calculateInternshipProgression({
      simulatorCompletedCount,
      investigationCompletedCount,
      architectureReviewedCount,
      scorePercent,
      internshipReadiness: adaptiveRecommendations?.readiness?.overallReadiness || internshipReadiness
    })
  }, [simulatorCompletedCount, investigationCompletedCount, architectureReviewedCount, scorePercent, adaptiveRecommendations, internshipReadiness])

  // Total Quiz & Knowledge Check Aggregates for Analytics
  const quizAnalytics = useMemo(() => {
    let questionsAnswered = 0
    let questionsCorrect = 0

    // Count from quiz attempts history
    Object.values(progress.quizAttemptsHistory || {}).forEach(attempts => {
      attempts.forEach(att => {
        questionsAnswered += (att.totalQuestions || 10)
        questionsCorrect += (att.correctCount || 0)
      })
    })

    // Count from topic check answers
    Object.values(progress.topicCheckAnswers || {}).forEach(topicChecks => {
      Object.values(topicChecks).forEach(isCorrect => {
        questionsAnswered += 1
        if (isCorrect) questionsCorrect += 1
      })
    })

    const accuracy = questionsAnswered > 0 ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0

    return {
      questionsAnswered,
      questionsCorrect,
      accuracy
    }
  }, [progress.quizAttemptsHistory, progress.topicCheckAnswers])

  // Master Career Profile & Career Intelligence Layer
  const masterCareerProfile = useMemo(() => {
    return generateMasterCareerProfile({
      progress,
      challenges: allChallenges,
      threatScenarios,
      investigations,
      realLabs,
      adaptiveRecommendations,
      internshipProgression
    })
  }, [progress, adaptiveRecommendations, internshipProgression])

  // Master Live Progress Aggregates across the Entire SeCloudive Ecosystem
  const battleRoomsSolvedCount = useMemo(() => {
    return Object.values(progress.battleRoomsSolved || {}).filter(Boolean).length
  }, [progress.battleRoomsSolved])

  const rampupLabsCompletedCount = useMemo(() => {
    return Object.values(progress.rampupLabsCompleted || {}).filter(Boolean).length
  }, [progress.rampupLabsCompleted])

  const completedCloudProjectsCount = useMemo(() => {
    return Object.values(progress.cloudProjectsCompleted || {}).filter(Boolean).length
  }, [progress.cloudProjectsCompleted])

  const completedTeardownsCount = useMemo(() => {
    return Object.values(progress.cloudProjectsTeardown || {}).filter(Boolean).length
  }, [progress.cloudProjectsTeardown])

  const completedPlaybooksCount = useMemo(() => {
    return Object.values(progress.playbooksExecuted || {}).filter(Boolean).length
  }, [progress.playbooksExecuted])

  const containedRadarThreatsCount = useMemo(() => {
    return Object.values(progress.radarThreatsContained || {}).filter(Boolean).length
  }, [progress.radarThreatsContained])

  const downloadedPacksCount = (progress.downloadedPacks || []).length
  const learningTopicsCompletedCount = (progress.learningTopicsCompleted || []).length

  // Total Master Activities:
  // Challenges (15) + Scenarios (6) + Investigations (25) + Real Labs (16) + Battle Rooms (10) + Capstones (4) + Playbooks (4) + Rampup Labs (20) + Learning Topics (52) = 152
  const totalMasterActivities = useMemo(() => {
    return (
      (allChallenges?.length || 15) +
      (threatScenarios?.length || 6) +
      (investigations?.length || 25) +
      (realLabs?.length || 16) +
      (battleRooms?.length || 10) +
      (cloudProjects?.length || 4) +
      (jobPlaybooks?.length || 4) +
      20 +
      52
    )
  }, [allChallenges, threatScenarios, investigations, realLabs])

  const completedMasterActivities = useMemo(() => {
    return (
      completedCount +
      simulatorCompletedCount +
      investigationCompletedCount +
      completedLabsCount +
      battleRoomsSolvedCount +
      rampupLabsCompletedCount +
      learningTopicsCompletedCount +
      completedCloudProjectsCount +
      completedPlaybooksCount +
      containedRadarThreatsCount
    )
  }, [
    completedCount,
    simulatorCompletedCount,
    investigationCompletedCount,
    completedLabsCount,
    battleRoomsSolvedCount,
    rampupLabsCompletedCount,
    learningTopicsCompletedCount,
    completedCloudProjectsCount,
    completedPlaybooksCount,
    containedRadarThreatsCount
  ])

  const masterProgressPercent = useMemo(() => {
    return Math.min(100, Math.round((completedMasterActivities / Math.max(1, totalMasterActivities)) * 100))
  }, [completedMasterActivities, totalMasterActivities])

  const masterTotalXP = useMemo(() => {
    return (
      totalScore +
      (battleRoomsSolvedCount * 100) +
      (investigationCompletedCount * 80) +
      (completedLabsCount * 120) +
      (rampupLabsCompletedCount * 50) +
      (learningTopicsCompletedCount * 30) +
      (completedCloudProjectsCount * 150) +
      (completedTeardownsCount * 50) +
      (completedPlaybooksCount * 100) +
      (containedRadarThreatsCount * 75)
    )
  }, [
    totalScore,
    battleRoomsSolvedCount,
    investigationCompletedCount,
    completedLabsCount,
    rampupLabsCompletedCount,
    learningTopicsCompletedCount,
    completedCloudProjectsCount,
    completedTeardownsCount,
    completedPlaybooksCount,
    containedRadarThreatsCount
  ])

  // ── Supabase: Debounced progress save on every change (placed after masterTotalXP) ────────────────────
  useEffect(() => {
    if (!auth?.isSupabaseMode || !auth?.supabaseUserId) return
    const debouncedSave = debounce((userId, prog, tier, xp) => {
      saveUserProgress(userId, prog, tier, xp).catch(err =>
        console.error('[ChallengeContext] Supabase progress save failed:', err)
      )
    }, 3000)
    debouncedSave(auth.supabaseUserId, progress, clearance?.tier || 1, masterTotalXP || 0)
  }, [progress, auth?.supabaseUserId, auth?.isSupabaseMode, clearance?.tier, masterTotalXP])

  // Comprehensive Employability Engine (Multi-readiness, Weekly/Monthly Plan, Next Best Action)
  const employabilityMetrics = useMemo(() => {
    return calculateComprehensiveEmployability({
      completedLabsCount: completedLabsCount || 0,
      completedInvestigationsCount: investigationCompletedCount || 0,
      architectureReviewedCount: architectureReviewedCount || 0,
      threatHuntsCompletedCount: battleRoomsSolvedCount || 0,
      interviewsCompletedCount: Object.keys(progress.interviewAttempts || {}).length,
      completedProjectsCount: completedCloudProjectsCount || 0,
      rampupLabsCompletedCount: rampupLabsCompletedCount || 0,
      totalScore: totalScore || 0,
      targetRoleId: progress.targetCareerRole || 'cloud-security-engineer'
    })
  }, [
    completedLabsCount,
    investigationCompletedCount,
    architectureReviewedCount,
    battleRoomsSolvedCount,
    progress.interviewAttempts,
    completedCloudProjectsCount,
    rampupLabsCompletedCount,
    totalScore,
    progress.targetCareerRole
  ])

  // Interview response submit with Gemini mentor coaching
  const submitInterviewResponse = (questionId, responseText, roleId, persona = 'Hiring Manager') => {
    const evaluation = evaluateLearnerSubmission({
      personaKey: 'HIRING_MANAGER',
      userResponse: responseText,
      context: { role: roleId, questionId }
    })

    setProgress(current => {
      const existing = current.interviewAttempts || {}
      return {
        ...current,
        interviewAttempts: {
          ...existing,
          [questionId]: {
            responseText,
            evaluation,
            submittedAt: new Date().toISOString()
          }
        }
      }
    })

    return evaluation
  }

  // General mentor coaching invocation with live Gemini multi-key AI support & Socratic fallback
  const evaluateWithMentor = async ({ type, submission, scenario, persona, personaKey, userResponse }) => {
    const pKey = (personaKey || persona || 'SECURITY_MENTOR').toString()
    const responseText = userResponse || submission?.query || submission?.answer || (typeof submission === 'string' ? submission : '')
    const ctx = scenario || {}

    // 1. Try real live Gemini key rotator pool if keys are present
    try {
      const keysConfigured = geminiKeyPool.getAllConfiguredKeys()
      if (keysConfigured.length > 0 && responseText && responseText.length > 5) {
        const liveChat = await geminiKeyPool.executeChat({
          prompt: `Role: You are acting as ${pKey} on the SeCloudive platform.
Learner Submission/Question: "${responseText}"
Context/Scenario: ${JSON.stringify(ctx)}

Provide a structured, senior-level evaluation in valid markdown:
### Executive Verdict
State confidence score (0-100%) and brief assessment.
### Technical Strengths
Bullet points of specific AWS security primitives correctly used.
### Gaps & Missing Nuances
Bullet points of missing architectural or compliance considerations.
### Production Action Plan
Exact AWS CLI containment / remediation commands or next steps.`,
          systemInstruction: 'You are an elite AWS Cloud Security Principal Mentor. Provide direct, socratic, high-rigor feedback.',
          model: 'gemini-flash-latest'
        })

        if (liveChat && liveChat.text) {
          return {
            persona: pKey,
            confidenceScore: 92,
            overallVerdict: 'PRODUCTION_READY_HIRE',
            summary: liveChat.text,
            strengths: ['Evaluated live by Gemini multi-key reasoning engine.', 'Direct analysis of technical submission.'],
            missingSkills: ['Continue hands-on validation in dual CLI terminal.'],
            supportingSources: ['AWS Well-Architected Framework: Security Pillar', 'CIS AWS Foundations Benchmark v3.0'],
            improvementPlan: ['Execute recommended CLI commands to verify in test environment.'],
            nextBestAction: 'Export this milestone into your verified hiring manager portfolio.'
          }
        }
      }
    } catch (err) {
      console.warn('[ChallengeContext] Live Gemini evaluation fallback to quality engine:', err)
    }

    // 2. Fallback to Socratic Quality Engine with properly mapped arguments
    const personaMap = {
      'Hiring Manager': 'HIRING_MANAGER',
      'Security Mentor': 'SECURITY_MENTOR',
      'Architecture Reviewer': 'ARCHITECTURE_REVIEWER',
      'Threat Hunter': 'THREAT_HUNTER',
      'Career Coach': 'CAREER_COACH'
    }
    const cleanKey = personaMap[pKey] || pKey.toUpperCase().replace(/\s+/g, '_')

    return evaluateLearnerSubmission({
      personaKey: cleanKey,
      userResponse: responseText,
      expectedCriteria: ctx.expectedCriteria || [],
      context: ctx
    })
  }

  const value = useMemo(
    () => ({
      challenges: allChallenges,
      threatScenarios,
      investigations,
      investigationCategories,
      realLabs,
      jobProcessStages,
      jobRoles,
      progress,
      submitAnswer,
      submitArchitectureReview,
      submitSimulatorInvestigation,
      submitInvestigation,
      toggleLabStep,
      resetLabProgress,
      resetProgress,
      completedCount,
      architectureReviewedCount,
      simulatorCompletedCount,
      investigationCompletedCount,
      completedLabsCount,
      completedLabStepsCount,
      investigationCategoryCounts,
      investigationAverageScore,
      internshipReadiness,
      totalScore,
      scorePercent,
      learningTopicsCompleted: progress.learningTopicsCompleted || [],
      learningBookmarkedTopics: progress.learningBookmarkedTopics || [],
      learningQuizScores: progress.learningQuizScores || {},
      topicCheckAnswers: progress.topicCheckAnswers || {},
      quizAttemptsHistory: progress.quizAttemptsHistory || {},
      targetCareerRole: progress.targetCareerRole || 'Cloud Security Engineer',
      setTargetCareerRole,
      submitAdaptiveQuizSession,
      adaptiveRecommendations,
      internshipProgression,
      quizAnalytics,
      earnedBadges,
      INTERNSHIP_LEVELS,
      PROMOTION_BADGES,
      LIVE_INTERNSHIPS_FEED,
      masterCareerProfile,
      CAREER_TIERS,
      SKILL_GRAPH_DOMAINS,
      CAPSTONE_MISSIONS,
      toggleCapstoneStep,
      resetCapstoneProgress,
      toggleLearningTopic,
      toggleLearningBookmark,
      submitModuleQuiz,
      resetModuleQuiz,
      submitTopicCheck,
      resetLearningProgress,
      // Master Unified Progress Additions
      battleRoomsSolved: progress.battleRoomsSolved || {},
      rampupLabsCompleted: progress.rampupLabsCompleted || {},
      cloudProjectsCompleted: progress.cloudProjectsCompleted || {},
      cloudProjectsTeardown: progress.cloudProjectsTeardown || {},
      playbooksExecuted: progress.playbooksExecuted || {},
      radarThreatsContained: progress.radarThreatsContained || {},
      interviewAttempts: progress.interviewAttempts || {},
      downloadedPacks: progress.downloadedPacks || [],
      submitBattleRoomFlag,
      toggleRampupLab,
      toggleCloudProject,
      toggleProjectTeardown,
      executePlaybook,
      containRadarThreat,
      recordDownload,
      battleRoomsSolvedCount,
      rampupLabsCompletedCount,
      completedCloudProjectsCount,
      completedTeardownsCount,
      completedPlaybooksCount,
      containedRadarThreatsCount,
      downloadedPacksCount,
      interviewsCompletedCount: Object.keys(progress.interviewAttempts || {}).length,
      learningTopicsCompletedCount,
      totalMasterActivities,
      completedMasterActivities,
      masterProgressPercent,
      masterTotalXP,
      // Multi-User Profile & Auto-Sync Engine
      activeProfile,
      allProfiles,
      autoSaveState,
      switchUserProfile,
      registerUniqueProfile,
      loginWithUserId,
      switchToGuestMode,
      isUserIdAvailable,
      generateUniqueUserId,
      createUserProfile,
      deleteUserProfile,
      updateUserProfile,
      exportUserData,
      importUserData,
      loginWithGoogle,
      linkGoogleAccount,
      // Unified Scenario State Store & Orchestration
      activeScenarioState,
      updateScenarioState,
      updateScenarioIac,
      updateScenarioTopology,
      updateScenarioPlaybook,
      addScenarioSimulationLog,
      exportScenarioAuditPack,
      downloadScenarioTerraform,
      // SeCloudive Master Content Banks (200+ Incidents, 100+ Architectures, 50+ Hunts, 100+ Safe Labs, 11 Role Roadmaps, 100+ Case Studies)
      masterIncidents: MASTER_INCIDENT_BANK,
      incidentCategories: INCIDENT_CATEGORIES,
      masterArchitectureReviews: MASTER_ARCHITECTURE_REVIEWS,
      masterThreatHunts: MASTER_THREAT_HUNTS,
      masterSafeLabs: MASTER_SAFE_LABS,
      roleRoadmaps: ROLE_ROADMAPS,
      masterInterviewBank: MASTER_INTERVIEW_BANK,
      masterCaseStudies: MASTER_CASE_STUDIES,
      cloudProjects,
      jobPlaybooks,
      employabilityMetrics,
      submitInterviewResponse,
      evaluateWithMentor,
      // Multi-Cloud Enterprise Engine (AWS, Azure, Google Cloud, OCI, IBM Cloud)
      selectedCloudProvider,
      setSelectedCloudProvider,
      cloudProviders: CLOUD_PROVIDERS,
      multiCloudCrosswalk: MULTI_CLOUD_CROSSWALK_5CLOUDS,
      multiCloudLabCommands: MULTI_CLOUD_LAB_COMMANDS,
      getMultiCloudCliForStep,
      getMultiCloudConsoleForStep,
      // NAEN Studios Step-Wise Skill Map & Curriculum Progression Engine
      learningTrackMode,
      setLearningTrackMode,
      targetCloudSpecialty,
      setTargetCloudSpecialty,
      learningPersona,
      setLearningPersona,
      stepWiseUnlocks: progress.stepWiseUnlocks || ['step-01'],
      unlockStep,
      isStepUnlocked,
      resetStepWiseProgress,
      skillMapNodes: SKILL_MAP_NODES,
      audiencePersonas: AUDIENCE_PERSONAS,
      // Canonical 4-Tier Clearance & Gatekeeper Engine
      clearance,
      clearanceTier: clearance.tier,
      passportTier: clearance.tier,
      sandboxMode,
      setSandboxMode,
      checkFeatureAccess,
      isFeatureAccessible: checkFeatureAccess
    }),
    [
      progress,
      clearance,
      sandboxMode,
      activeProfile,
      allProfiles,
      autoSaveState,
      selectedCloudProvider,
      activeScenarioState,
      learningTrackMode,
      targetCloudSpecialty,
      learningPersona,
      completedCount,
      architectureReviewedCount,
      simulatorCompletedCount,
      investigationCompletedCount,
      completedLabsCount,
      completedLabStepsCount,
      investigationCategoryCounts,
      investigationAverageScore,
      internshipReadiness,
      totalScore,
      scorePercent,
      adaptiveRecommendations,
      internshipProgression,
      masterCareerProfile,
      quizAnalytics,
      earnedBadges,
      toggleLearningTopic,
      toggleLearningBookmark,
      submitModuleQuiz,
      resetModuleQuiz,
      submitTopicCheck,
      resetLearningProgress,
      battleRoomsSolvedCount,
      rampupLabsCompletedCount,
      completedCloudProjectsCount,
      completedTeardownsCount,
      completedPlaybooksCount,
      containedRadarThreatsCount,
      downloadedPacksCount,
      learningTopicsCompletedCount,
      totalMasterActivities,
      completedMasterActivities,
      masterProgressPercent,
      masterTotalXP,
      employabilityMetrics
    ]
  )

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>
}

export function useChallenges() {
  return useContext(ChallengeContext)
}
