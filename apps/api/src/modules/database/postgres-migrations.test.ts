import { describe, expect, it, vi } from 'vitest';
import {
  createPostgresMigrationLedger,
  createPostgresMigrationTransaction,
} from './postgres-migrations.js';

describe('PostgreSQL migration adapters', () => {
  it('passes SQL and values to the database client', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [] });
    const connection = {
      query,
      begin: vi.fn(),
      commit: vi.fn(),
      rollback: vi.fn(),
    };
    const transaction = createPostgresMigrationTransaction(connection);

    await transaction.execute('SELECT $1', ['value']);

    expect(query).toHaveBeenCalledWith('SELECT $1', ['value']);
  });

  it('reads and records checksums with parameterized queries', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce({ rows: [{ checksum: 'a'.repeat(64) }] })
      .mockResolvedValueOnce({ rows: [] });
    const ledger = createPostgresMigrationLedger({ query });

    await expect(ledger.getApplied('0000_migration_ledger.sql')).resolves.toEqual({
      checksum: 'a'.repeat(64),
    });
    await ledger.recordApplied('0001_opportunities.sql', 'b'.repeat(64));

    expect(query).toHaveBeenNthCalledWith(
      1,
      'SELECT checksum FROM schema_migrations WHERE name = $1',
      ['0000_migration_ledger.sql'],
    );
    expect(query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('INSERT INTO schema_migrations'),
      ['0001_opportunities.sql', 'b'.repeat(64)],
    );
  });
});
