import { Hono } from 'hono';
import { authMiddleware } from '../../middleware/auth.js';

export const notesRoutes = new Hono();

notesRoutes.use('*', authMiddleware);

notesRoutes.get('/', (c) => {
  const session = c.get('session');
  const contentId = c.req.query('contentId');
  // DB query will be added when connection is wired.
  return c.json({ learnerId: session.userId, contentId: contentId ?? null, notes: [] });
});

notesRoutes.post('/', async (c) => {
  const session = c.get('session');
  const body = await c.req.json<{
    title: string;
    body: string;
    contentId?: string;
    tags?: string[];
    isPrivate?: boolean;
  }>();

  if (!body.title?.trim()) {
    return c.json({ error: 'title is required.' }, 422);
  }

  const note = {
    id: crypto.randomUUID(),
    learnerId: session.userId,
    title: body.title.trim(),
    body: body.body ?? '',
    contentId: body.contentId ?? null,
    tags: Array.isArray(body.tags) ? body.tags : [],
    isPrivate: body.isPrivate !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Persist to learner_notes will be added when DB is wired.
  return c.json({ note }, 201);
});

notesRoutes.put('/:noteId', async (c) => {
  const session = c.get('session');
  const noteId = c.req.param('noteId');
  const body = await c.req.json<{
    title?: string;
    body?: string;
    tags?: string[];
    isPrivate?: boolean;
  }>();

  // Ownership check against DB will be added when connection is wired.
  return c.json({
    learnerId: session.userId,
    noteId,
    updated: true,
    changes: body,
  });
});

notesRoutes.delete('/:noteId', (c) => {
  const session = c.get('session');
  const noteId = c.req.param('noteId');
  // Soft-delete (set deleted_at) will be added when DB is wired.
  return c.json({ learnerId: session.userId, noteId, deleted: true });
});
