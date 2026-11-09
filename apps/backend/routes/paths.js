import { Router } from 'express';
import { data, isModuleUnlocked } from '../data/loader.js';
import { fetchProgress } from '../db.js';
import { signedIn } from '../middleware/auth.js';

export const paths = Router();
paths.get('/', signedIn, async (req, res, next) => {
  try {
    const completed = new Set((await fetchProgress(req.user.id)).map((row) => row.module_id));
    res.json(data.paths.map((path) => ({ ...path, modules: data.modules.filter((module) => module.track === path.id).map((module) => ({ ...module, status: completed.has(module.id) ? 'completed' : isModuleUnlocked(module, completed) ? 'available' : 'locked' })) })));
  } catch (error) { next(error); }
});
