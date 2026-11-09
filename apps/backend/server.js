import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Server } from 'socket.io';
import { upsertUserByGoogleId } from './db.js';
import { health } from './routes/health.js';
import { auth } from './routes/auth.js';
import { paths } from './routes/paths.js';
import { modules } from './routes/modules.js';
import { progress, summary } from './routes/progress.js';
import { scenarios } from './routes/scenarios.js';
import { labs } from './routes/labs.js';
import { resources } from './routes/resources.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
const frontendOrigin = process.env.FRONTEND_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: frontendOrigin, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));
app.use(session({ secret: process.env.SESSION_SECRET || 'development-only-change-me', resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 86_400_000 } }));
app.use(passport.initialize());
const googleCallbackUrl = (process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback').replace('/api/api/', '/api/');
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) passport.use(new GoogleStrategy({ clientID: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, callbackURL: googleCallbackUrl }, async (_access, _refresh, profile, done) => { try { done(null, await upsertUserByGoogleId({ id: profile.id, googleId: profile.id, email: profile.emails?.[0]?.value, name: profile.displayName, picture: profile.photos?.[0]?.value })); } catch (e) { done(e); } }));
app.use('/api/health', health); app.use('/api/auth', auth); app.use('/api/api/auth', auth); app.use('/auth', auth); app.use('/api/me', auth); app.use('/api/paths', paths); app.use('/api/modules', modules); app.use('/api/progress', progress); app.use('/api/me/summary', summary); app.use('/api/scenarios', scenarios); app.use('/api/labs', labs); app.use('/api/resources', resources);
app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ error: 'internal server error' }); });
export { app };
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(Number(process.env.PORT || 4000), () => console.log(`backend listening on ${process.env.PORT || 4000}`));
  const io = new Server(server, { cors: { origin: frontendOrigin, credentials: true } });
  io.use((socket, next) => socket.request.headers.cookie ? next() : next(new Error('authentication required')));
  io.on('connection', (socket) => { socket.on('room:join', (room) => { if (typeof room === 'string' && room.length < 100) socket.join(room); }); socket.on('room:leave', (room) => socket.leave(room)); });
}
