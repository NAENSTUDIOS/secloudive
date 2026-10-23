import assert from 'node:assert/strict'
import { hasMeaningfulProgress, shouldHydrateCloudProgress } from '../src/utils/progressMerge.js'

const blankProgress = {
  answers: {},
  completed: {},
  learningTopicsCompleted: [],
  targetCareerRole: 'Cloud Security Engineer'
}
const completedProgress = { ...blankProgress, completed: { 'iam-1': true } }
const cloudProgress = { ...blankProgress, completed: { 'iam-1': true, 's3-1': true } }

assert.equal(hasMeaningfulProgress(blankProgress), false)
assert.equal(hasMeaningfulProgress(completedProgress), true)
assert.equal(shouldHydrateCloudProgress(blankProgress, cloudProgress), true)
assert.equal(shouldHydrateCloudProgress(completedProgress, cloudProgress), false)
console.log('Progress merge regression tests passed.')
