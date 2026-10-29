import type { Context, Next } from 'hono';
import { requireActiveSession, type AuthenticatedSession } from '../modules/identity/session.js';
import type { PlatformRole } from '../modules/identity/authorization.js';

declare module 'hono' {
  interface ContextVariableMap {
    session: AuthenticatedSession;
  }
}

export async function authMiddleware(c: Context, next: Next): Promise<Response | void> {
  const authorization = c.req.header('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return c.json({ error: 'Authentication is required.' }, 401);
  }

  // Phase 1: parse JWT claims only. Full Cognito signature verification
  // will be added when Cognito infrastructure is provisioned.
  const token = authorization.slice(7);
  const parts = token.split('.');
  let session: AuthenticatedSession | null = null;

  try {
    const payload = JSON.parse(
      Buffer.from(parts[1] ?? '', 'base64url').toString('utf8'),
    ) as Record<string, unknown>;

    session = {
      userId: String(payload['sub'] ?? ''),
      roles: (Array.isArray(payload['cognito:groups'])
        ? (payload['cognito:groups'] as string[])
        : ['learner']) as PlatformRole[],
      issuer: String(payload['iss'] ?? ''),
      expiresAt: Number(payload['exp'] ?? 0),
    };
  } catch {
    return c.json({ error: 'Invalid token format.' }, 401);
  }

  try {
    requireActiveSession(session);
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Session invalid.' }, 401);
  }

  c.set('session', session as AuthenticatedSession);
  await next();
}
