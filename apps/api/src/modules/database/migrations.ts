import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

export type MigrationExecutor = {
  execute(sql: string, values?: readonly unknown[]): Promise<void>;
};

export type MigrationTransaction = MigrationExecutor & {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
};

export type MigrationLedger = {
  getApplied(name: string): Promise<{ checksum: string } | undefined>;
  recordApplied(name: string, checksum: string): Promise<void>;
};

export type Migration = {
  name: string;
  sql: string;
};

export function getMigrationChecksum(sql: string): string {
  return createHash('sha256').update(sql, 'utf8').digest('hex');
}

export async function loadMigration(migrationPath: string): Promise<Migration> {
  const name = path.basename(migrationPath);
  if (!/^\d{4}_[a-z0-9-]+\.sql$/.test(name)) {
    throw new Error(`Invalid migration filename: ${name}`);
  }

  const sql = await readFile(migrationPath, 'utf8');
  if (!sql.trim()) {
    throw new Error(`Migration is empty: ${name}`);
  }

  return { name, sql };
}

export async function runMigration(
  executor: MigrationExecutor,
  migration: Migration,
): Promise<void> {
  await executor.execute(migration.sql);
}

export async function applyMigration(
  executor: MigrationExecutor,
  ledger: MigrationLedger,
  migration: Migration,
): Promise<'applied' | 'already_applied'> {
  const checksum = getMigrationChecksum(migration.sql);
  const applied = await ledger.getApplied(migration.name);

  if (applied) {
    if (applied.checksum !== checksum) {
      throw new Error(`Migration checksum mismatch: ${migration.name}`);
    }
    return 'already_applied';
  }

  await executor.execute(migration.sql);
  await ledger.recordApplied(migration.name, checksum);
  return 'applied';
}

export async function applyMigrationTransactionally(
  transaction: MigrationTransaction,
  ledger: MigrationLedger,
  migration: Migration,
): Promise<'applied' | 'already_applied'> {
  const checksum = getMigrationChecksum(migration.sql);
  await transaction.begin();

  try {
    await transaction.execute('SELECT pg_advisory_xact_lock($1)', [migrationLockKey()]);
    const applied = await ledger.getApplied(migration.name);

    if (applied) {
      if (applied.checksum !== checksum) {
        throw new Error(`Migration checksum mismatch: ${migration.name}`);
      }
      await transaction.commit();
      return 'already_applied';
    }

    await transaction.execute(migration.sql);
    await ledger.recordApplied(migration.name, checksum);
    await transaction.commit();
    return 'applied';
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

function migrationLockKey(): number {
  return 736563;
}
