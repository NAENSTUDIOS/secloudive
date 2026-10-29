import { describe, expect, it } from 'vitest';
import { loadDatabaseConfig } from './config.js';

describe('database configuration', () => {
  it('requires a real PostgreSQL URL', () => {
    expect(loadDatabaseConfig('development', 'postgres://localhost/secloudive')).toEqual({
      url: 'postgres://localhost/secloudive',
      environment: 'development',
      sslRequired: false,
    });
  });

  it('requires TLS in production', () => {
    expect(loadDatabaseConfig('production', 'postgres://db.example/secloudive').sslRequired).toBe(
      true,
    );
  });

  it('rejects masked, invalid, and unsupported configuration', () => {
    expect(() => loadDatabaseConfig('development', '******localhost:5432/secloudive')).toThrow(
      'DATABASE_URL is required and must not be masked',
    );
    expect(() => loadDatabaseConfig('development', 'mysql://localhost/secloudive')).toThrow(
      'DATABASE_URL must use the postgres or postgresql protocol',
    );
    expect(() => loadDatabaseConfig('staging', 'postgres://localhost/secloudive')).toThrow(
      'NODE_ENV must be development, test, or production',
    );
  });
});
