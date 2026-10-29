import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { learnerRoutes } from './modules/learner/routes.js';
import { progressRoutes } from './modules/progress/routes.js';
import { assessmentRoutes } from './modules/assessment/routes.js';
import { notesRoutes } from './modules/notes/routes.js';

export const serviceName = 'secloudive-api';

export function createHealthResponse() {
  return {
    service: serviceName,
    status: 'ok' as const,
  };
}

const app = new Hono();

// ── Health ──────────────────────────────────────────────────────────────────
app.get('/health', (c) => c.json(createHealthResponse()));

// ── Learner ─────────────────────────────────────────────────────────────────
app.route('/portal', learnerRoutes);

// ── Progress ─────────────────────────────────────────────────────────────────
app.route('/progress', progressRoutes);

// ── Assessments ──────────────────────────────────────────────────────────────
app.route('/assessments', assessmentRoutes);

// ── Notes ────────────────────────────────────────────────────────────────────
app.route('/notes', notesRoutes);

// ── 404 ──────────────────────────────────────────────────────────────────────
app.notFound((c) => c.json({ error: 'Not found.' }, 404));

app.onError((err, c) => {
  if (process.env['NODE_ENV'] === 'development') {
    console.error(err);
  }
  return c.json({ error: 'An unexpected error occurred.' }, 500);
});

// ── Start ────────────────────────────────────────────────────────────────────
const port = Number(process.env['PORT'] ?? 4000);

if (process.env['NODE_ENV'] !== 'test') {
  serve({ fetch: app.fetch, port }, () => {
    console.log(`${serviceName} listening on port ${port}`);
  });
}

export { app };
