export type AuthConfig = {
  userPoolId: string;
  clientId: string;
  region: string;
  issuer: string;
};

export class AuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthConfigurationError';
  }
}

function required(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new AuthConfigurationError(`Missing required authentication configuration: ${name}`);
  }

  return value.trim();
}

export function loadAuthConfig(env: NodeJS.ProcessEnv = process.env): AuthConfig {
  const region = required('COGNITO_REGION', env.COGNITO_REGION);
  const userPoolId = required('COGNITO_USER_POOL_ID', env.COGNITO_USER_POOL_ID);
  const clientId = required('COGNITO_CLIENT_ID', env.COGNITO_CLIENT_ID);
  const issuer = required('COGNITO_ISSUER', env.COGNITO_ISSUER);

  const expectedIssuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
  if (issuer !== expectedIssuer) {
    throw new AuthConfigurationError(
      'COGNITO_ISSUER must match the configured Cognito region and user pool.',
    );
  }

  return { clientId, issuer, region, userPoolId };
}
