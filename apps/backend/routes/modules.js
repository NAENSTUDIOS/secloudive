import { Router } from 'express';
import { getModule, isModuleUnlocked, unmetPrerequisites } from '../data/loader.js';
import { fetchProgress } from '../db.js';
import { signedIn } from '../middleware/auth.js';

export const modules = Router();
modules.get('/:id', signedIn, async (req, res, next) => {
  try {
    const module = getModule(req.params.id);
    if (!module) return res.status(404).json({ error: 'module not found' });
    const completed = new Set((await fetchProgress(req.user.id)).map((row) => row.module_id));
    if (!completed.has(module.id) && !isModuleUnlocked(module, completed)) return res.status(403).json({ error: 'module is locked', unmetPrerequisites: unmetPrerequisites(module, completed) });
    return res.json(module);
  } catch (error) { return next(error); }
});
