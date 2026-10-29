import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth.js';

export const learnerRoutes = new Hono();

learnerRoutes.use('*', authMiddleware);

learnerRoutes.get('/me', (c) => {
  const session = c.get('session');
  return c.json({
    userId: session.userId,
    roles: session.roles,
    // Full profile will be fetched from DB once Postgres connection is wired
    profile: null,
    onboarding: null,
  });
});

learnerRoutes.put('/me/profile', async (c) => {
  const session = c.get('session');
  const body = await c.req.json<{
    displayName?: string;
    experienceLevel?: string;
    primaryGoal?: string;
    targetRole?: string;
  }>();

  const allowed = new Set([
    'beginner', 'developing', 'practitioner', 'professional',
  ]);
  if (body.experienceLevel && !allowed.has(body.experienceLevel)) {
    return c.json({ error: 'Invalid experienceLevel.' }, 422);
  }

  // Persistence will be added when DB connection is wired.
  return c.json({ userId: session.userId, updated: true, profile: body });
});

learnerRoutes.get('/me/onboarding', (c) => {
  const session = c.get('session');
  return c.json({ userId: session.userId, onboarding: null });
});

learnerRoutes.put('/me/onboarding', async (c) => {
  const session = c.get('session');
  const body = await c.req.json<{ status?: string }>();
  const validStatuses = new Set(['not_started', 'in_progress', 'completed', 'paused']);
  if (body.status && !validStatuses.has(body.status)) {
    return c.json({ error: 'Invalid onboarding status.' }, 422);
  }
  return c.json({ userId: session.userId, updated: true, onboarding: body });
});

learnerRoutes.get('/me/privacy', (c) => {
  const session = c.get('session');
  return c.json({
    userId: session.userId,
    privacy: {
      analytics: false,
      marketing: false,
      aiMemory: false,
      streaks: false,
      instructorVisibility: 'private',
      portfolioVisibility: 'private',
    },
  });
});

learnerRoutes.put('/me/privacy', async (c) => {
  const session = c.get('session');
  const body = await c.req.json<Record<string, unknown>>();
  return c.json({ userId: session.userId, updated: true, privacy: body });
});
