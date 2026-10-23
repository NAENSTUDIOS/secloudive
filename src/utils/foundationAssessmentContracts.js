export const FOUNDATION_ASSESSMENT_REQUIREMENTS = Object.freeze([
  'knowledgeQuestions',
  'visualQuestions',
  'miniLabs',
  'documentationTask',
  'troubleshootingScenario',
  'roleSimulation',
  'practicalExam',
])

export const FOUNDATION_READINESS_WEIGHTS = Object.freeze({
  knowledge: 0.2,
  practicalLabs: 0.25,
  troubleshooting: 0.2,
  documentation: 0.1,
  architectureUnderstanding: 0.1,
  securityUnderstanding: 0.1,
  communication: 0.05,
})

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && value !== undefined
}

export function validateFoundationAssessment(assessment) {
  const missing = FOUNDATION_ASSESSMENT_REQUIREMENTS.filter(field => !hasValue(assessment?.[field]))
  const knowledgeCount = Array.isArray(assessment?.knowledgeQuestions)
    ? assessment.knowledgeQuestions.length
    : 0
  const visualCount = Array.isArray(assessment?.visualQuestions)
    ? assessment.visualQuestions.length
    : 0

  if (knowledgeCount < 20) missing.push('knowledgeQuestions(20 minimum)')
  if (visualCount < 5) missing.push('visualQuestions(5 minimum)')

  return {
    complete: missing.length === 0,
    missing: [...new Set(missing)],
  }
}

export function calculateFoundationReadiness(scores) {
  const weightedScore = Object.entries(FOUNDATION_READINESS_WEIGHTS).reduce(
    (total, [dimension, weight]) => {
      const score = Number(scores?.[dimension])
      return total + (Number.isFinite(score) ? Math.min(100, Math.max(0, score)) * weight : 0)
    },
    0,
  )

  const score = Math.round(weightedScore * 100) / 100
  const level = score >= 96
    ? 'ADVANCED_TRACK_READY'
    : score >= 86
      ? 'PROFESSIONAL_READY'
      : score >= 76
        ? 'ASSOCIATE_READY'
        : score >= 61
          ? 'JUNIOR_READY'
          : score >= 41
            ? 'DEVELOPING'
            : 'BEGINNER'

  return { score, level, passing: score >= 80 }
}

export function foundationAssessmentFromTrack(track) {
  return {
    knowledgeQuestions: track?.assessments,
    visualQuestions: track?.visualDiagrams,
    miniLabs: track?.handsOnLabs,
    documentationTask: track?.documentationTasks,
    troubleshootingScenario: track?.troubleshootingGuide,
    roleSimulation: track?.rolePlay,
    practicalExam: track?.productionDeployments,
  }
}
