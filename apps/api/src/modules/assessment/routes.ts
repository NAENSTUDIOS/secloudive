import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth.js';
import { evaluateKnowledgeCheck } from '@secloudive/content-schema';
import type { KnowledgeCheck, SubmittedAnswer } from '@secloudive/content-schema';

export const assessmentRoutes = new Hono();

assessmentRoutes.use('*', authMiddleware);

assessmentRoutes.post('/submit', async (c) => {
  const session = c.get('session');
  const body = await c.req.json<{
    check: KnowledgeCheck;
    answers: SubmittedAnswer[];
    attemptNumber: number;
  }>();

  if (!body.check || !body.check.id) {
    return c.json({ error: 'check is required.' }, 422);
  }
  if (!Array.isArray(body.answers)) {
    return c.json({ error: 'answers must be an array.' }, 422);
  }
  if (!Number.isInteger(body.attemptNumber) || body.attemptNumber < 1) {
    return c.json({ error: 'attemptNumber must be a positive integer.' }, 422);
  }

  let result;
  try {
    result = evaluateKnowledgeCheck(
      body.check,
      body.answers,
      crypto.randomUUID(),
      body.attemptNumber,
    );
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Evaluation failed.' }, 422);
  }

  // Persist to assessment_submissions will be added when DB is wired.
  return c.json({ learnerId: session.userId, result }, 201);
});

assessmentRoutes.get('/:contentId/history', (c) => {
  const session = c.get('session');
  const contentId = c.req.param('contentId');
  if (!contentId?.trim()) {
    return c.json({ error: 'contentId is required.' }, 422);
  }
  // DB query will be added when connection is wired.
  return c.json({ learnerId: session.userId, contentId, submissions: [] });
});
