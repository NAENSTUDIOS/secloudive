import { describe, expect, it } from 'vitest';
import { app } from '../../main.js';

// A minimal valid-looking JWT with a future expiry (year 2099).
// Signature is not verified in Phase 1 — only claims are parsed.
function makeToken(overrides: Record<string, unknown> = {}): string {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: 'user-test-1',
      iss: 'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_test',
      exp: Math.floor(Date.now() / 1000) + 3600,
      'cognito:groups': ['learner'],
      ...overrides,
    }),
  ).toString('base64url');
  return `${header}.${payload}.sig`;
}

const AUTH = { Authorization: `Bearer ${makeToken()}` };

describe('GET /health', () => {
  it('returns ok without authentication', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const body = await res.json() as { status: string };
    expect(body.status).toBe('ok');
  });
});

describe('auth middleware', () => {
  it('rejects requests with no Authorization header', async () => {
    const res = await app.request('/portal/me');
    expect(res.status).toBe(401);
  });

  it('rejects a malformed token', async () => {
    const res = await app.request('/portal/me', {
      headers: { Authorization: 'Bearer not.a.token' },
    });
    expect(res.status).toBe(401);
  });

  it('rejects an expired token', async () => {
    const token = makeToken({ exp: Math.floor(Date.now() / 1000) - 1 });
    const res = await app.request('/portal/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /portal/me', () => {
  it('returns the authenticated learner identity', async () => {
    const res = await app.request('/portal/me', { headers: AUTH });
    expect(res.status).toBe(200);
    const body = await res.json() as { userId: string };
    expect(body.userId).toBe('user-test-1');
  });
});

describe('PUT /portal/me/profile', () => {
  it('accepts a valid profile update', async () => {
    const res = await app.request('/portal/me/profile', {
      method: 'PUT',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: 'Nasir', experienceLevel: 'beginner' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json() as { updated: boolean };
    expect(body.updated).toBe(true);
  });

  it('rejects an invalid experienceLevel', async () => {
    const res = await app.request('/portal/me/profile', {
      method: 'PUT',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ experienceLevel: 'expert' }),
    });
    expect(res.status).toBe(422);
  });
});

describe('POST /progress/events', () => {
  it('records a valid progress event', async () => {
    const res = await app.request('/progress/events', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'module_completed',
        contentId: 'foundation-linux-permissions',
        contentDomain: 'linux',
        idempotencyKey: 'idem-test-1',
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json() as { recorded: boolean };
    expect(body.recorded).toBe(true);
  });

  it('rejects an invalid eventType', async () => {
    const res = await app.request('/progress/events', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'page_viewed', idempotencyKey: 'idem-2' }),
    });
    expect(res.status).toBe(422);
  });

  it('rejects a missing idempotencyKey', async () => {
    const res = await app.request('/progress/events', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'module_started' }),
    });
    expect(res.status).toBe(422);
  });
});

describe('POST /assessments/submit', () => {
  const check = {
    id: 'check-1',
    moduleId: 'foundation-linux-permissions',
    passingScorePct: 80,
    questions: [
      {
        id: 'q1',
        type: 'single_choice',
        stem: 'Which bit allows execution?',
        options: [{ id: 'a', text: 'Read' }, { id: 'b', text: 'Execute' }],
        correctOptionIds: ['b'],
        explanation: 'Execute bit.',
        objectiveId: 'obj-1',
      },
    ],
  };

  it('evaluates and returns a passing result', async () => {
    const res = await app.request('/assessments/submit', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        check,
        answers: [{ questionId: 'q1', selectedOptionIds: ['b'] }],
        attemptNumber: 1,
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json() as { result: { passed: boolean; scorePct: number } };
    expect(body.result.passed).toBe(true);
    expect(body.result.scorePct).toBe(100);
  });

  it('rejects a missing check', async () => {
    const res = await app.request('/assessments/submit', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: [], attemptNumber: 1 }),
    });
    expect(res.status).toBe(422);
  });
});

describe('notes CRUD', () => {
  it('creates a note', async () => {
    const res = await app.request('/notes', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Linux permissions', body: 'chmod 600 is safer.' }),
    });
    expect(res.status).toBe(201);
    const body = await res.json() as { note: { title: string; isPrivate: boolean } };
    expect(body.note.title).toBe('Linux permissions');
    expect(body.note.isPrivate).toBe(true);
  });

  it('rejects a note with no title', async () => {
    const res = await app.request('/notes', {
      method: 'POST',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '', body: 'content' }),
    });
    expect(res.status).toBe(422);
  });

  it('lists notes', async () => {
    const res = await app.request('/notes', { headers: AUTH });
    expect(res.status).toBe(200);
    const body = await res.json() as { notes: unknown[] };
    expect(Array.isArray(body.notes)).toBe(true);
  });

  it('deletes a note', async () => {
    const res = await app.request('/notes/note-123', {
      method: 'DELETE',
      headers: AUTH,
    });
    expect(res.status).toBe(200);
    const body = await res.json() as { deleted: boolean };
    expect(body.deleted).toBe(true);
  });
});
