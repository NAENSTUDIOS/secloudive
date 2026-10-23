import assert from 'node:assert/strict'
import {
  buildCertificationObjectiveMapping,
  buildRoleCoverage,
  validateCertificationObjectiveMapping,
  validateRoleCoverage,
} from '../src/utils/careerCoverageContracts.js'
import { learningResourceLibrary } from '../src/data/learning/resourceLibrary.js'
import { getRoleSimulation } from '../src/data/learning/jobSimulationLibrary.js'

for (const track of Object.values(learningResourceLibrary)) {
  for (const certification of track.certifications) {
    const mapping = buildCertificationObjectiveMapping(track, certification)
    const result = validateCertificationObjectiveMapping(mapping)
    assert.equal(result.complete, true, `${track.id}/${certification} is incomplete: ${result.missing.join(', ')}`)
  }
}

const role = buildRoleCoverage(getRoleSimulation('security-analyst'))
assert.equal(validateRoleCoverage(role).complete, true)
assert.deepEqual(validateRoleCoverage({ ...role, tickets: [] }), {
  complete: false,
  missing: ['tickets'],
})

console.log('Career coverage contract checks passed.')
