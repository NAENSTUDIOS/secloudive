import { Router } from 'express';
import passport from 'passport';
import { clearSessionUser, getSessionUser, getSupabaseUser, upsertUserBySupabaseUser } from '../db.js';
export const auth = Router();
auth.get('/me', async (req, res, next) => {
  try {
    const sessionUser = getSessionUser(req);
    if (sessionUser) return res.json(sessionUser);
    const header = req.get('authorization');
    if (!header?.toLowerCase().startsWith('bearer ')) return res.json(null);
    const authUser = await getSupabaseUser(header.slice(7).trim());
    return res.json(authUser ? await upsertUserBySupabaseUser(authUser) : null);
  } catch (error) {
    return next(error);
  }
});
auth.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
auth.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api/auth/failed', session: false }), (req, res) => { req.session.user = req.user; res.redirect(process.env.FRONTEND_ORIGIN || process.env.FRONTEND_URL || '/'); });
auth.get('/failed', (_req, res) => res.status(401).json({ error: 'google authentication failed' }));
auth.post('/logout', async (req, res, next) => { try { await clearSessionUser(req); res.status(204).end(); } catch (e) { next(e); } });
