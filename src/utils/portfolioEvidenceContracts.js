export const PORTFOLIO_EVIDENCE_REQUIREMENTS = Object.freeze([
  'artifactType',
  'title',
  'summary',
  'skills',
  'roleMappings',
  'sourceActivityId',
  'validationResults',
  'documentation',
  'createdAt',
  'verificationId',
])

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && value !== undefined
}

export function validatePortfolioEvidence(evidence) {
  const missing = PORTFOLIO_EVIDENCE_REQUIREMENTS.filter(field => !hasValue(evidence?.[field]))
  const validationResults = evidence?.validationResults
  const hasPassingValidation = Array.isArray(validationResults)
    && validationResults.length > 0
    && validationResults.every(result => result?.status === 'passed')

  if (!hasPassingValidation) missing.push('validationResults(passing)')

  return {
    complete: missing.length === 0,
    missing: [...new Set(missing)],
  }
}

export function createPortfolioEvidenceDraft({
  artifactType,
  title,
  summary,
  skills = [],
  roleMappings = [],
  sourceActivityId,
  validationResults = [],
  documentation = [],
  createdAt = new Date().toISOString(),
  verificationId,
}) {
  return {
    artifactType,
    title,
    summary,
    skills,
    roleMappings,
    sourceActivityId,
    validationResults,
    documentation,
    createdAt,
    verificationId,
  }
}
