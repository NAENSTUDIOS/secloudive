import { Router } from 'express';
import { data, scenarioMaximum, scenarioRating } from '../data/loader.js';
import { saveScenarioResult } from '../db.js';
import { signedIn } from '../middleware/auth.js';

export const scenarios = Router();
scenarios.get('/', signedIn, (_req, res) => res.json(data.scenarios.map(({ id, title, role, level, summary, durationMinutes }) => ({ id, title, role, level, summary, durationMinutes }))));
scenarios.get('/:id', signedIn, (req, res) => { const scenario = data.scenarios.find((item) => item.id === req.params.id); return scenario ? res.json(scenario) : res.status(404).json({ error: 'scenario not found' }); });
scenarios.post('/:id/complete', signedIn, async (req, res, next) => {
  try {
    const scenario = data.scenarios.find((item) => item.id === req.params.id);
    const score = req.body?.score;
    if (!scenario) return res.status(404).json({ error: 'scenario not found' });
    if (!Number.isFinite(score) || score < 0) return res.status(400).json({ error: 'score must be a non-negative number' });
    const maximum = scenarioMaximum(scenario);
    if (score > maximum) return res.status(422).json({ error: 'score exceeds scenario maximum', maximum });
    const rating = scenarioRating(score, maximum);
    await saveScenarioResult(req.user.id, { scenarioId: scenario.id, score, rating });
    return res.json({ ok: true, rating, maximum });
  } catch (error) { return next(error); }
});
