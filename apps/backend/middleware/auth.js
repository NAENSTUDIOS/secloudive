import { getSessionUser, getSupabaseUser, upsertUserBySupabaseUser } from '../db.js';

export async function signedIn(req, res, next) {
  try {
    const sessionUser = getSessionUser(req);
    if (sessionUser) {
      req.user = sessionUser;
      return next();
    }
    const header = req.get('authorization');
    if (!header?.toLowerCase().startsWith('bearer ')) return res.status(401).json({ error: 'sign-in required' });
    const authUser = await getSupabaseUser(header.slice(7).trim());
    if (!authUser) return res.status(401).json({ error: 'sign-in required' });
    req.user = await upsertUserBySupabaseUser(authUser);
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function adminOnly(req, res, next) {
  return signedIn(req, res, () => {
    if (!(req.user.isAdmin || req.user.role === 'admin')) return res.status(403).json({ error: 'admin required' });
    return next();
  });
}
