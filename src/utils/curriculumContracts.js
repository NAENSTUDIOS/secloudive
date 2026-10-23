export const MODULE_REQUIREMENTS = Object.freeze([
  'what',
  'why',
  'how',
  'where',
  'when',
  'whenNot',
  'risks',
  'bestPractices',
  'commonMistakes',
  'realExample',
  'jobContext',
  'lab',
  'investigation',
  'project',
  'documentation',
  'assessment',
  'interviewQuestions',
  'portfolioEvidence',
])

export const RESOURCE_SCORE_WEIGHTS = Object.freeze({
  authority: 0.3,
  accuracy: 0.2,
  practicalValue: 0.15,
  beginnerFriendliness: 0.1,
  visualQuality: 0.1,
  careerRelevance: 0.1,
  recency: 0.05,
})

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && value !== undefined
}

export function validateModuleCompleteness(module) {
  const missing = MODULE_REQUIREMENTS.filter(field => !hasValue(module?.[field]))

  return {
    complete: missing.length === 0,
    missing,
  }
}

export function moduleFromLearningTrack(track) {
  return {
    what: track?.overview,
    why: track?.learningObjectives,
    how: track?.guidedPractice,
    where: track?.productionUseCases,
    when: track?.realWorldScenarios,
    whenNot: track?.commonMistakes || track?.troubleshootingGuide,
    risks: track?.productionIncidents,
    bestPractices: track?.advancedReferences,
    commonMistakes: track?.commonMistakes || track?.troubleshootingGuide,
    realExample: track?.caseStudies,
    jobContext: track?.rolePlay || track?.jobTickets,
    lab: track?.handsOnLabs,
    investigation: track?.productionIncidents,
    project: track?.projects,
    documentation: track?.documentationTasks,
    assessment: track?.assessments,
    interviewQuestions: track?.interviewQuestions,
    portfolioEvidence: track?.jobReadinessEvidence,
  }
}

export function calculateResourceScore(resource) {
  const dimensions = RESOURCE_SCORE_WEIGHTS
  const score = Object.entries(dimensions).reduce((total, [dimension, weight]) => {
    const value = Number(resource?.[`${dimension}Score`])
    return total + (Number.isFinite(value) ? Math.min(100, Math.max(0, value)) * weight : 0)
  }, 0)

  return Math.round(score * 100) / 100
}

export function classifyResourceScore(score) {
  if (score >= 95) return 'ELITE'
  if (score >= 90) return 'EXCELLENT'
  if (score >= 80) return 'VERY_GOOD'
  if (score >= 70) return 'SUPPLEMENTARY'
  return 'NOT_ALLOWED'
}

export function validateResourceQuality(resource) {
  const score = calculateResourceScore(resource)
  const classification = classifyResourceScore(score)
  const hasCanonicalUrl = typeof resource?.url === 'string' && /^https?:\/\//i.test(resource.url)
  const hasProvider = hasValue(resource?.provider)
  const admitted = score >= 80 && hasCanonicalUrl && hasProvider

  return {
    admitted,
    score,
    classification,
    reasons: [
      ...(hasCanonicalUrl ? [] : ['A canonical HTTP(S) URL is required.']),
      ...(hasProvider ? [] : ['A provider is required.']),
      ...(score >= 80 ? [] : ['Resource score must be at least 80.']),
    ],
  }
}
