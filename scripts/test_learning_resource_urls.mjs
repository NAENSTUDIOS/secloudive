import assert from 'node:assert/strict'
import { learningResourceLibrary } from '../src/data/learning/resourceLibrary.js'

let checked = 0

for (const [trackId, track] of Object.entries(learningResourceLibrary)) {
  const resourceGroups = [
    track.officialDocumentation,
    track.officialLearningPlatforms,
    track.paidResources,
    track.beginnerResources,
    track.intermediateResources,
    track.advancedResources,
    track.bestYouTubeChannels,
    track.bestBooks,
    track.bestArticles,
    track.advancedReferences,
    track.expertResources
  ]

  for (const resource of resourceGroups.flat()) {
    if (!resource || typeof resource !== 'object') continue
    checked += 1
    assert.match(
      String(resource.url || ''),
      /^https?:\/\/\S+$/i,
      `${trackId} contains a resource without a valid HTTP(S) URL: ${resource.title || 'untitled'}`
    )
  }
}

assert.ok(checked > 0, 'Expected at least one learning resource URL to be checked.')
console.log(`Learning resource URL checks passed for ${checked} resources.`)
