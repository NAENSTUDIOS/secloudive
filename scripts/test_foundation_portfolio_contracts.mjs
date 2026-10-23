import assert from 'node:assert/strict'
import {
  calculateFoundationReadiness,
  foundationAssessmentFromTrack,
  validateFoundationAssessment,
} from '../src/utils/foundationAssessmentContracts.js'
import {
  createPortfolioEvidenceDraft,
  validatePortfolioEvidence,
} from '../src/utils/portfolioEvidenceContracts.js'
import { learningResourceLibrary } from '../src/data/learning/resourceLibrary.js'

const completeAssessment = {
  knowledgeQuestions: Array.from({ length: 20 }, (_, index) => `Question ${index + 1}`),
  visualQuestions: Array.from({ length: 5 }, (_, index) => `Visual ${index + 1}`),
  miniLabs: ['Lab one', 'Lab two'],
  documentationTask: ['Write findings'],
  troubleshootingScenario: ['Investigate failure'],
  roleSimulation: ['Junior cloud engineer'],
  practicalExam: ['Deploy and validate'],
}

assert.equal(validateFoundationAssessment(completeAssessment).complete, true)
assert.equal(validateFoundationAssessment({ ...completeAssessment, visualQuestions: [] }).complete, false)

for (const trackId of ['cloud-computing', 'linux', 'networking', 'python']) {
  const assessment = foundationAssessmentFromTrack(learningResourceLibrary[trackId])
  assert.equal(validateFoundationAssessment({
    ...assessment,
    knowledgeQuestions: Array.from({ length: 20 }, () => 'Question'),
    visualQuestions: Array.from({ length: 5 }, () => 'Visual'),
  }).complete, true, `${trackId} foundation assessment is incomplete`)
}

assert.deepEqual(calculateFoundationReadiness({
  knowledge: 90,
  practicalLabs: 90,
  troubleshooting: 80,
  documentation: 85,
  architectureUnderstanding: 80,
  securityUnderstanding: 85,
  communication: 90,
}), { score: 86, level: 'PROFESSIONAL_READY', passing: true })

const evidence = createPortfolioEvidenceDraft({
  artifactType: 'IAM audit report',
  title: 'Least privilege review',
  summary: 'Evidence-backed IAM review',
  skills: ['IAM', 'CloudTrail'],
  roleMappings: ['Cloud Security Engineer'],
  sourceActivityId: 'lab-iam-permission-boundaries',
  validationResults: [{ name: 'policy validation', status: 'passed' }],
  documentation: ['audit-report.md'],
  verificationId: 'SEC-EVIDENCE-001',
})
assert.equal(validatePortfolioEvidence(evidence).complete, true)
assert.equal(validatePortfolioEvidence({ ...evidence, validationResults: [] }).complete, false)

console.log('Foundation and portfolio contract checks passed.')
