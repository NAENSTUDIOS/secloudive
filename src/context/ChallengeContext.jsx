import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import allChallenges from '../data/index.js'
import threatScenarios from '../data/threatScenarios.js'
import { investigations, investigationCategories } from '../data/investigations.js'
import { realLabs, jobProcessStages, jobRoles } from '../data/jobLabs.js'

const STORAGE_KEY = 'secloudive-progress-v1'
const ChallengeContext = createContext(null)

function readProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    return {
      answers: raw.answers || {},
      completed: raw.completed || {},
      architectureScores: raw.architectureScores || {},
      simulatorScores: raw.simulatorScores || {},
      investigationScores: raw.investigationScores || {},
      investigationAssessments: raw.investigationAssessments || {},
      labSteps: raw.labSteps || {}
    }
  } catch {
    return {
      answers: {},
      completed: {},
      architectureScores: {},
      simulatorScores: {},
      investigationScores: {},
      investigationAssessments: {},
      labSteps: {}
    }
  }
}

export function ChallengeProvider({ children }) {
  const [progress, setProgress] = useState(readProgress)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

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

  const resetProgress = () =>
    setProgress({
      answers: {},
      completed: {},
      architectureScores: {},
      simulatorScores: {},
      investigationScores: {},
      investigationAssessments: {},
      labSteps: {}
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
      if (completedSteps.length === lab.steps.length) {
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

  const totalScore = allChallenges.reduce((sum, challenge) => {
    if (challenge.id.startsWith('architecture-') && progress.architectureScores?.[challenge.id] !== undefined) {
      return sum + Math.round((challenge.points * progress.architectureScores[challenge.id]) / 100)
    }
    return sum + (progress.completed[challenge.id] ? challenge.points : 0)
  }, 0)

  const maxScore = allChallenges.reduce((sum, challenge) => sum + challenge.points, 0)
  const scorePercent = Math.round((totalScore / Math.max(1, maxScore)) * 100)

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
      scorePercent
    }),
    [
      progress,
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
      scorePercent
    ]
  )

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>
}

export function useChallenges() {
  return useContext(ChallengeContext)
}

