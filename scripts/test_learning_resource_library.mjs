import assert from 'node:assert/strict'
import {
  learningResourceLibrary,
  getLearningTrackBlueprint,
  learningResourcePathMap,
} from '../src/data/learning/resourceLibrary.js'

const requiredFields = [
  'overview',
  'learningObjectives',
  'prerequisites',
  'difficulty',
  'estimatedHours',
  'levelFramework',
  'officialDocumentation',
  'officialLearningPlatforms',
  'paidResources',
  'beginnerResources',
  'intermediateResources',
  'advancedResources',
  'bestYouTubeChannels',
  'bestBooks',
  'bestArticles',
  'advancedReferences',
  'expertResources',
  'practiceExercises',
  'handsOnLabs',
  'assessments',
  'projects',
  'projectPortfolio',
  'interviewQuestions',
  'careerPaths',
  'careerRoadmaps',
  'outputSections',
  'productionUseCases',
  'continuousLearningPlan',
  'readingMaterials',
  'learningSlides',
  'visualDiagrams',
  'guidedPractice',
  'simulations',
  'caseStudies',
  'teamActivities',
  'realWorldScenarios',
  'rolePlay',
  'dayInTheLife',
  'jobTickets',
  'productionIncidents',
  'troubleshootingGuide',
  'productionDeployments',
  'documentationTasks',
  'presentationTasks',
  'interviewPrep',
  'careerPreparation',
  'jobReadinessEvidence',
]

for (const [id, track] of Object.entries(learningResourceLibrary)) {
  for (const field of requiredFields) {
    assert.ok(track[field], `${id} is missing ${field}`)
  }
  assert.equal(track.levelFramework.length, 9, `${id} must define levels 0-8`)
  assert.deepEqual(track.levelFramework.map(level => level.level), [0, 1, 2, 3, 4, 5, 6, 7, 8])
  assert.ok(track.officialDocumentation.length > 0, `${id} needs an official source`)
  assert.ok(track.beginnerResources.length > 0, `${id} needs beginner resources`)
  assert.ok(track.intermediateResources.length > 0, `${id} needs intermediate resources`)
  assert.ok(track.advancedResources.length > 0, `${id} needs advanced resources`)
  assert.equal(track.outputSections.length, 15, `${id} must expose the 15 requested output sections`)
  assert.ok(track.handsOnLabs.length > 0, `${id} needs a hands-on lab`)
  assert.ok(track.rolePlay.managerRequest, `${id} needs a manager role-play request`)
  assert.ok(track.jobTickets[0].acceptance.length > 0, `${id} needs ticket acceptance criteria`)
  assert.ok(track.productionIncidents.some(incident => incident.severity === 'SEV-1'), `${id} needs a SEV-1 drill`)
  assert.equal(track.dayInTheLife.length, 7, `${id} needs a complete simulated workday`)
}

for (const [pathId, trackIds] of Object.entries(learningResourcePathMap)) {
  assert.ok(trackIds.length > 0, `${pathId} needs mapped learning tracks`)
  assert.equal(getLearningTrackBlueprint(pathId).length, trackIds.length)
}

console.log(`Learning resource library checks passed for ${Object.keys(learningResourceLibrary).length} tracks.`)
