import { Router } from 'express';
import { data, getModulesForTrack, isAcademyComplete, isModuleUnlocked, unmetPrerequisites } from '../data/loader.js';
import { fetchProgress, markProgress } from '../db.js';
import { signedIn } from '../middleware/auth.js';

export const progress = Router();
progress.get('/', signedIn, async (req, res, next) => { try { res.json((await fetchProgress(req.user.id)).map((row) => row.module_id)); } catch (error) { next(error); } });
progress.post('/:moduleId', signedIn, async (req, res, next) => {
  try {
    const module = data.modules.find((item) => item.id === req.params.moduleId);
    if (!module) return res.status(404).json({ error: 'module not found' });
    const completedRows = await fetchProgress(req.user.id);
    const completed = new Set(completedRows.map((row) => row.module_id));
    if (!isModuleUnlocked(module, completed) && !completed.has(module.id)) return res.status(403).json({ error: 'module is locked', unmetPrerequisites: unmetPrerequisites(module, completed) });
    await markProgress(req.user.id, module.id);
    return res.json({ ok: true });
  } catch (error) { return next(error); }
});
export const summary = Router();
summary.get('/', signedIn, async (req, res, next) => { try { const completed = new Set((await fetchProgress(req.user.id)).map((row) => row.module_id)); const counts = Object.fromEntries(['core', 'aws', 'azure', 'gcp'].map((track) => [track, getModulesForTrack(track).filter((module) => completed.has(module.id)).length])); res.json({ counts, completed: completed.size, total: data.modules.length, academyComplete: isAcademyComplete(completed) }); } catch (error) { next(error); } });
