import test from 'node:test';
import assert from 'node:assert/strict';
import { data, isPathUnlocked, scenarioMaximum, scenarioRating, validateScoreRating } from '../data/loader.js';
test('path unlock rules', () => {
  const core = data.modules.filter((module) => module.track === 'core' && module.level === 'beginner').map((module) => module.id);
  assert.equal(isPathUnlocked('core', []), true);
  assert.equal(isPathUnlocked('aws', []), false);
  assert.equal(isPathUnlocked('aws', core), true);
  assert.equal(isPathUnlocked('capstone', ['aws', 'azure', 'gcp']), false);
});
test('score and rating validation', () => {
  const maximum = scenarioMaximum(data.scenarios[0]);
  assert.equal(validateScoreRating(maximum, maximum).valid, true);
  assert.equal(validateScoreRating(-1, maximum).valid, false);
  assert.equal(validateScoreRating(maximum + 1, maximum).valid, false);
  assert.equal(scenarioRating(maximum, maximum), 'Excellent');
});
test('resource data is validated', async () => { const { data } = await import('../data/loader.js'); assert.ok(Array.isArray(data.trustedSources)); });
