export type DatabaseConfig = {
  url: string;
  environment: 'development' | 'test' | 'production';
  sslRequired: boolean;
};

const supportedEnvironments = new Set(['development', 'test', 'production']);

export function loadDatabaseConfig(
  environment: string | undefined,
  databaseUrl: string | undefined,
): DatabaseConfig {
  if (!environment || !supportedEnvironments.has(environment)) {
    throw new Error('NODE_ENV must be development, test, or production');
  }
  if (!databaseUrl || databaseUrl.includes('******')) {
    throw new Error('DATABASE_URL is required and must not be masked');
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL');
  }

  if (parsedUrl.protocol !== 'postgres:' && parsedUrl.protocol !== 'postgresql:') {
    throw new Error('DATABASE_URL must use the postgres or postgresql protocol');
  }
  if (!parsedUrl.hostname) {
    throw new Error('DATABASE_URL must include a database host');
  }

  return {
    url: databaseUrl,
    environment: environment as DatabaseConfig['environment'],
    sslRequired: environment === 'production',
  };
}
