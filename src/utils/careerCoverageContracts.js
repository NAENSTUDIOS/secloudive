const CERTIFICATION_MAPPING_REQUIREMENTS = Object.freeze([
  'learningResources',
  'theory',
  'visualization',
  'guidedPractice',
  'independentPractice',
  'threatSimulation',
  'jobSimulation',
  'architectureReview',
  'documentationExercise',
  'interviewQuestions',
  'portfolioArtifact',
  'careerMapping',
])

const ROLE_COVERAGE_REQUIREMENTS = Object.freeze([
  'dailyTasks',
  'weeklyTasks',
  'monthlyTasks',
  'tools',
  'tickets',
  'incidents',
  'reports',
  'architectureWork',
  'securityWork',
  'operationsWork',
  'performanceMetrics',
  'promotionRequirements',
])

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && value !== undefined
}

export function buildCertificationObjectiveMapping(track, certification) {
  return {
    certification,
    domain: track?.title,
    learningResources: track?.officialDocumentation,
    theory: track?.learningObjectives,
    visualization: track?.visualDiagrams,
    guidedPractice: track?.guidedPractice,
    independentPractice: track?.handsOnLabs,
    threatSimulation: track?.productionIncidents,
    jobSimulation: track?.jobTickets,
    architectureReview: track?.caseStudies,
    documentationExercise: track?.documentationTasks,
    interviewQuestions: track?.interviewQuestions,
    portfolioArtifact: track?.jobReadinessEvidence,
    careerMapping: track?.careerPaths,
  }
}

export function validateCertificationObjectiveMapping(mapping) {
  const missing = CERTIFICATION_MAPPING_REQUIREMENTS.filter(field => !hasValue(mapping?.[field]))

  return {
    complete: missing.length === 0,
    missing,
  }
}

export function buildRoleCoverage(role) {
  return {
    role: role?.title,
    dailyTasks: role?.tasks,
    weeklyTasks: role?.tasks,
    monthlyTasks: role?.tasks,
    tools: role?.tools || ['Cloud console or simulator', 'Version control', 'Observability tooling'],
    tickets: role?.ticket ? [role.ticket] : [],
    incidents: role?.incidents || ['Investigate and document a simulated security incident'],
    reports: role?.reports || ['Investigation or implementation report'],
    architectureWork: role?.architectureWork || ['Review the proposed design and trade-offs'],
    securityWork: role?.securityWork || ['Identify and document security impact'],
    operationsWork: role?.operationsWork || ['Validate health, rollback, and follow-up actions'],
    performanceMetrics: role?.performanceMetrics || ['Technical accuracy', 'Documentation quality', 'Risk awareness'],
    promotionRequirements: role?.promotionRequirements || ['Reviewed evidence portfolio', 'Manager review'],
  }
}

export function validateRoleCoverage(coverage) {
  const missing = ROLE_COVERAGE_REQUIREMENTS.filter(field => !hasValue(coverage?.[field]))

  return {
    complete: missing.length === 0,
    missing,
  }
}

export { CERTIFICATION_MAPPING_REQUIREMENTS, ROLE_COVERAGE_REQUIREMENTS }
