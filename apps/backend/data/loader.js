import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const paths = read('paths.json');
const moduleFiles = fs.readdirSync(path.join(root, 'modules')).filter((file) => file.endsWith('.json'));
const moduleDetails = moduleFiles.map((file) => read(`modules/${file}`));
const modules = moduleDetails.map(({ id, track, level, title, summary, estimatedMinutes, prerequisites }) => ({ id, track, level, title, summary, estimatedMinutes, prerequisites }));
const labs = Object.fromEntries(fs.readdirSync(path.join(root, 'labs')).filter((file) => file.endsWith('.json')).map((file) => { const lab = read(`labs/${file}`); return [lab.id, lab]; }));
export const data = { paths, modules, moduleDetails: new Map(moduleDetails.map((module) => [module.id, module])), scenarios: read('scenarios.json'), labs, trustedSources: read('trusted-sources.json'), pending: read('resources/pending.json'), rejected: read('resources/rejected.json'), resources: [] };

export function validateData(value = data) {
  const tracks = new Set(['core', 'aws', 'azure', 'gcp']);
  const levels = new Set(['beginner', 'intermediate', 'advanced']);
  const ids = new Set(value.modules.map((module) => module.id));
  if (!Array.isArray(value.paths) || !Array.isArray(value.modules)) throw new Error('data/paths.json and data/modules/*.json must contain arrays');
  if (ids.size !== value.modules.length) throw new Error('Duplicate module id in data/modules');
  for (const module of value.modules) {
    if (!module.id || !tracks.has(module.track) || !levels.has(module.level) || !module.title || !module.summary || !Number.isInteger(module.estimatedMinutes) || !Array.isArray(module.prerequisites)) throw new Error(`Invalid module structure: ${module.id || '<unknown>'}`);
    for (const prerequisite of module.prerequisites) if (!ids.has(prerequisite)) throw new Error(`Module ${module.id} references missing prerequisite ${prerequisite}`);
  }
  for (const scenario of value.scenarios) validateScenario(scenario);
  return true;
}

function validateScenario(scenario) {
  if (!scenario.id || !scenario.startStepId || !scenario.steps) throw new Error(`Invalid scenario: ${scenario.id || '<unknown>'}`);
  const visiting = new Set();
  const visited = new Set();
  function walk(stepId) {
    if (stepId === null) return;
    if (visiting.has(stepId)) throw new Error(`Scenario ${scenario.id} contains a cycle`);
    if (visited.has(stepId)) return;
    const step = scenario.steps[stepId];
    if (!step || !Array.isArray(step.choices)) throw new Error(`Scenario ${scenario.id} has invalid step ${stepId}`);
    visiting.add(stepId);
    for (const choice of step.choices) { if (typeof choice.points !== 'number' || typeof choice.label !== 'string') throw new Error(`Scenario ${scenario.id} has invalid choice`); walk(choice.nextStepId); }
    visiting.delete(stepId); visited.add(stepId);
  }
  walk(scenario.startStepId);
}

export function getModule(id) { return data.moduleDetails.get(id); }
export function getModulesForTrack(track) { return data.modules.filter((module) => module.track === track); }
export function unmetPrerequisites(module, completed) { return module.prerequisites.filter((id) => !completed.has(id)); }
export function isModuleUnlocked(module, completed) {
  if (module.track === 'core') return unmetPrerequisites(module, completed).length === 0;
  const coreBeginner = data.modules.filter((item) => item.track === 'core' && item.level === 'beginner').every((item) => completed.has(item.id));
  if (!coreBeginner) return false;
  if (module.track === 'aws' || module.track === 'azure' || module.track === 'gcp') return unmetPrerequisites(module, completed).length === 0;
  return false;
}
export function isAcademyComplete(completed) {
  return ['core', 'aws', 'azure', 'gcp'].every((track) => getModulesForTrack(track).every((module) => completed.has(module.id))) && completed.has('capstone');
}
export function scenarioMaximum(scenario) {
  const visited = new Set();
  function walk(stepId) {
    if (stepId === null || visited.has(stepId)) return 0;
    visited.add(stepId);
    const step = scenario.steps[stepId];
    return Math.max(...step.choices.map((choice) => choice.points + walk(choice.nextStepId)));
  }
  return walk(scenario.startStepId);
}
export function scenarioRating(score, maximum) {
  const ratio = maximum ? score / maximum : 0;
  return ratio >= 0.8 ? 'Excellent' : ratio >= 0.5 ? 'Good' : 'Needs review';
}
export function isPathUnlocked(track, completed) {
  const done = new Set(completed);
  if (track === 'core') return true;
  if (track === 'capstone') return ['aws', 'azure', 'gcp'].every((item) => {
    const modulesForTrack = getModulesForTrack(item);
    return modulesForTrack.length > 0 && modulesForTrack.every((module) => done.has(module.id));
  });
  return ['aws', 'azure', 'gcp'].includes(track) && getModulesForTrack('core').filter((module) => module.level === 'beginner').every((module) => done.has(module.id));
}
export function validateScoreRating(score, maximum) {
  const valid = Number.isFinite(score) && Number.isFinite(maximum) && score >= 0 && score <= maximum;
  return { valid, rating: valid ? scenarioRating(score, maximum) : null };
}
validateData();
