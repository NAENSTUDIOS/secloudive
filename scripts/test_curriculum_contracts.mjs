import assert from 'node:assert/strict'
import {
  calculateResourceScore,
  classifyResourceScore,
  moduleFromLearningTrack,
  validateModuleCompleteness,
  validateResourceQuality,
} from '../src/utils/curriculumContracts.js'
import { learningResourceLibrary } from '../src/data/learning/resourceLibrary.js'

const completeModule = {
  what: 'What',
  why: 'Why',
  how: 'How',
  where: 'Where',
  when: 'When',
  whenNot: 'When not',
  risks: ['Risk'],
  bestPractices: ['Practice'],
  commonMistakes: ['Mistake'],
  realExample: ['Example'],
  jobContext: ['Job'],
  lab: ['Lab'],
  investigation: ['Investigation'],
  project: ['Project'],
  documentation: ['Documentation'],
  assessment: ['Assessment'],
  interviewQuestions: ['Question'],
  portfolioEvidence: ['Evidence'],
}

assert.deepEqual(validateModuleCompleteness(completeModule), { complete: true, missing: [] })
assert.deepEqual(validateModuleCompleteness({ ...completeModule, lab: [] }), {
  complete: false,
  missing: ['lab'],
})

for (const track of Object.values(learningResourceLibrary)) {
  const result = validateModuleCompleteness(moduleFromLearningTrack(track))
  assert.equal(result.complete, true, `${track.id} is incomplete: ${result.missing.join(', ')}`)
}

const elite = calculateResourceScore({
  authorityScore: 100,
  accuracyScore: 100,
  practicalValueScore: 100,
  beginnerFriendlinessScore: 100,
  visualQualityScore: 100,
  careerRelevanceScore: 100,
  recencyScore: 100,
})
assert.equal(elite, 100)
assert.equal(classifyResourceScore(elite), 'ELITE')

assert.deepEqual(validateResourceQuality({
  provider: 'aws',
  url: 'https://docs.aws.amazon.com/',
  authorityScore: 95,
  accuracyScore: 95,
  practicalValueScore: 90,
  beginnerFriendlinessScore: 85,
  visualQualityScore: 80,
  careerRelevanceScore: 95,
  recencyScore: 90,
}).admitted, true)

assert.equal(validateResourceQuality({ provider: 'unknown', url: 'not-a-url', authorityScore: 100 }).admitted, false)

console.log('Curriculum contract checks passed.')
