import { describe, expect, it, vi } from 'vitest';
import {
  applyMigration,
  applyMigrationTransactionally,
  getMigrationChecksum,
  loadMigration,
  runMigration,
} from './migrations.js';

describe('database migrations', () => {
  it('executes a valid migration exactly as loaded', async () => {
    const execute = vi.fn().mockResolvedValue(undefined);
    const migration = {
      name: '0001_opportunities.sql',
      sql: 'CREATE TABLE example (id text);',
    };

    await runMigration({ execute }, migration);

    expect(execute).toHaveBeenCalledWith(migration.sql);
  });

  it('rejects invalid migration filenames', async () => {
    await expect(loadMigration('C:\\migrations\\bad.sql')).rejects.toThrow(
      'Invalid migration filename: bad.sql',
    );
  });

  it('records a checksum only after successful execution', async () => {
    const execute = vi.fn().mockResolvedValue(undefined);
    const recordApplied = vi.fn().mockResolvedValue(undefined);
    const migration = {
      name: '0001_opportunities.sql',
      sql: 'CREATE TABLE example (id text);',
    };

    await expect(
      applyMigration(
        { execute },
        { getApplied: vi.fn().mockResolvedValue(undefined), recordApplied },
        migration,
      ),
    ).resolves.toBe('applied');

    expect(recordApplied).toHaveBeenCalledWith(migration.name, getMigrationChecksum(migration.sql));
  });

  it('does not reapply a matching migration', async () => {
    const execute = vi.fn().mockResolvedValue(undefined);
    const migration = {
      name: '0001_opportunities.sql',
      sql: 'CREATE TABLE example (id text);',
    };

    await expect(
      applyMigration(
        { execute },
        {
          getApplied: vi.fn().mockResolvedValue({
            checksum: getMigrationChecksum(migration.sql),
          }),
          recordApplied: vi.fn(),
        },
        migration,
      ),
    ).resolves.toBe('already_applied');

    expect(execute).not.toHaveBeenCalled();
  });

  it('rejects migration checksum drift', async () => {
    await expect(
      applyMigration(
        { execute: vi.fn() },
        {
          getApplied: vi.fn().mockResolvedValue({ checksum: 'old-checksum' }),
          recordApplied: vi.fn(),
        },
        { name: '0001_opportunities.sql', sql: 'changed sql' },
      ),
    ).rejects.toThrow('Migration checksum mismatch: 0001_opportunities.sql');
  });

  it('does not record a failed migration', async () => {
    const recordApplied = vi.fn();
    await expect(
      applyMigration(
        {
          execute: vi.fn().mockRejectedValue(new Error('database unavailable')),
        },
        { getApplied: vi.fn().mockResolvedValue(undefined), recordApplied },
        { name: '0001_opportunities.sql', sql: 'CREATE TABLE example (id text);' },
      ),
    ).rejects.toThrow('database unavailable');
    expect(recordApplied).not.toHaveBeenCalled();
  });

  it('applies a migration atomically under a database advisory lock', async () => {
    const calls: string[] = [];
    const transaction = {
      begin: vi.fn(async () => {
        calls.push('begin');
      }),
      execute: vi.fn(async (sql: string) => {
        calls.push(sql);
      }),
      commit: vi.fn(async () => {
        calls.push('commit');
      }),
      rollback: vi.fn(async () => {
        calls.push('rollback');
      }),
    };
    const recordApplied = vi.fn(async (name: string, checksum: string) => {
      calls.push(`record:${name}:${checksum}`);
    });
    const migration = {
      name: '0001_opportunities.sql',
      sql: 'CREATE TABLE example (id text);',
    };

    await expect(
      applyMigrationTransactionally(
        transaction,
        { getApplied: vi.fn().mockResolvedValue(undefined), recordApplied },
        migration,
      ),
    ).resolves.toBe('applied');

    expect(calls[0]).toBe('begin');
    expect(calls[1]).toContain('pg_advisory_xact_lock');
    expect(calls.at(-1)).toBe('commit');
    expect(transaction.rollback).not.toHaveBeenCalled();
  });

  it('rolls back when migration execution fails', async () => {
    const transaction = {
      begin: vi.fn().mockResolvedValue(undefined),
      execute: vi.fn().mockRejectedValue(new Error('database unavailable')),
      commit: vi.fn(),
      rollback: vi.fn().mockResolvedValue(undefined),
    };

    await expect(
      applyMigrationTransactionally(
        transaction,
        { getApplied: vi.fn().mockResolvedValue(undefined), recordApplied: vi.fn() },
        { name: '0001_opportunities.sql', sql: 'CREATE TABLE example (id text);' },
      ),
    ).rejects.toThrow('database unavailable');
    expect(transaction.commit).not.toHaveBeenCalled();
    expect(transaction.rollback).toHaveBeenCalledOnce();
  });

  it('does not reapply a matching migration transactionally', async () => {
    const transaction = {
      begin: vi.fn().mockResolvedValue(undefined),
      execute: vi.fn().mockResolvedValue(undefined),
      commit: vi.fn().mockResolvedValue(undefined),
      rollback: vi.fn(),
    };
    const migration = {
      name: '0000_migration_ledger.sql',
      sql: 'CREATE TABLE schema_migrations (name text);',
    };

    await expect(
      applyMigrationTransactionally(
        transaction,
        {
          getApplied: vi.fn().mockResolvedValue({
            checksum: getMigrationChecksum(migration.sql),
          }),
          recordApplied: vi.fn(),
        },
        migration,
      ),
    ).resolves.toBe('already_applied');
    expect(transaction.execute).toHaveBeenCalledOnce();
    expect(transaction.commit).toHaveBeenCalledOnce();
  });
});
