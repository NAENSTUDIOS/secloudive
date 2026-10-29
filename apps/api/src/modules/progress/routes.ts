import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth.js';

export const progressRoutes = new Hono();

progressRoutes.use('*', authMiddleware);

const VALID_EVENT_TYPES = new Set([
  'module_started',
  'module_completed',
  'assessment_submitted',
  'assessment_passed',
  'assessment_failed',
  'mission_started',
  'mission_completed',
  'note_created',
  'onboarding_completed',
]);

const VALID_DOMAINS = new Set([
  'computer_fundamentals', 'linux', 'networking', 'git_github',
  'python', 'docker', 'ci_cd', 'aws_fundamentals', 'security_fundamentals',
]);

progressRoutes.post('/events', async (c) => {
  const session = c.get('session');
  const body = await c.req.json<{
    eventType: string;
    contentId?: string;
    contentDomain?: string;
    idempotencyKey: string;
    metadata?: Record<string, unknown>;
  }>();

  if (!body.eventType || !VALID_EVENT_TYPES.has(body.eventType)) {
    return c.json({ error: 'Invalid or missing eventType.' }, 422);
  }
  if (!body.idempotencyKey?.trim()) {
    return c.json({ error: 'idempotencyKey is required.' }, 422);
  }
  if (body.contentDomain && !VALID_DOMAINS.has(body.contentDomain)) {
    return c.json({ error: 'Invalid contentDomain.' }, 422);
  }

  // Persistence will be added when DB connection is wired.
  return c.json(
    {
      recorded: true,
      event: {
        learnerId: session.userId,
        eventType: body.eventType,
        contentId: body.contentId ?? null,
        contentDomain: body.contentDomain ?? null,
        idempotencyKey: body.idempotencyKey,
        metadata: body.metadata ?? {},
        occurredAt: new Date().toISOString(),
      },
    },
    201,
  );
});

progressRoutes.get('/events', (c) => {
  const session = c.get('session');
  const domain = c.req.query('domain');
  if (domain && !VALID_DOMAINS.has(domain)) {
    return c.json({ error: 'Invalid domain filter.' }, 422);
  }
  // DB query will be added when connection is wired.
  return c.json({ learnerId: session.userId, events: [] });
});
