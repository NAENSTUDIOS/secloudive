import { describe, expect, it } from 'vitest';
import { loadAuthConfig } from './auth-config.js';
import { hasPermission } from './authorization.js';
import { requireActiveSession } from './session.js';

describe('identity foundation', () => {
  it('rejects incomplete Cognito configuration', () => {
    expect(() => loadAuthConfig({})).toThrow('COGNITO_REGION');
  });

  it('accepts a matching Cognito issuer', () => {
    expect(
      loadAuthConfig({
        COGNITO_REGION: 'ap-south-1',
        COGNITO_USER_POOL_ID: 'ap-south-1_example',
        COGNITO_CLIENT_ID: 'client',
        COGNITO_ISSUER: 'https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_example',
      }),
    ).toMatchObject({ region: 'ap-south-1', clientId: 'client' });
  });

  it('keeps learner permissions separate from administration', () => {
    expect(hasPermission(['learner'], 'content:read')).toBe(true);
    expect(hasPermission(['learner'], 'admin:write')).toBe(false);
  });

  it('rejects expired sessions', () => {
    expect(() =>
      requireActiveSession(
        { userId: 'user-1', roles: ['learner'], issuer: 'issuer', expiresAt: 10 },
        10,
      ),
    ).toThrow('expired');
  });
});
