import { Router } from 'express';
import { data } from '../data/loader.js';
import { signedIn } from '../middleware/auth.js';
export const labs = Router();
labs.get('/', signedIn, (_req, res) => res.json(Object.values(data.labs).flat()));
labs.get('/:pathId', signedIn, (req, res) => res.json(data.labs[req.params.pathId] || []));
