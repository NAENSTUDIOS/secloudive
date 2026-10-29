import type { PlatformRole } from './authorization.js';

export type AuthenticatedSession = {
  userId: string;
  roles: readonly PlatformRole[];
  issuer: string;
  expiresAt: number;
};

export class SessionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SessionValidationError';
  }
}

export function requireActiveSession(
  session: AuthenticatedSession | null,
  nowSeconds = Math.floor(Date.now() / 1000),
): AuthenticatedSession {
  if (!session) {
    throw new SessionValidationError('Authentication is required.');
  }

  if (!session.userId || session.roles.length === 0) {
    throw new SessionValidationError('Authenticated session is incomplete.');
  }

  if (session.expiresAt <= nowSeconds) {
    throw new SessionValidationError('Session has expired.');
  }

  if (!session.issuer) {
    throw new SessionValidationError('Session issuer is missing.');
  }

  return session;
}
