import type { MigrationLedger, MigrationTransaction } from './migrations.js';

export type PostgresMigrationQuery = {
  query<T extends object>(
    text: string,
    values: readonly unknown[],
  ): Promise<{ rows: readonly T[] }>;
};

export type PostgresMigrationConnection = PostgresMigrationQuery & {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
};

export function createPostgresMigrationTransaction(
  connection: PostgresMigrationConnection,
): MigrationTransaction {
  return {
    begin: () => connection.begin(),
    commit: () => connection.commit(),
    rollback: () => connection.rollback(),
    execute: async (text, values = []) => {
      await connection.query(text, values);
    },
  };
}

export function createPostgresMigrationLedger(connection: PostgresMigrationQuery): MigrationLedger {
  return {
    async getApplied(name) {
      const result = await connection.query<{ checksum: string }>(
        'SELECT checksum FROM schema_migrations WHERE name = $1',
        [name],
      );
      const row = result.rows[0];
      return row ? { checksum: row.checksum } : undefined;
    },
    async recordApplied(name, checksum) {
      await connection.query(
        `INSERT INTO schema_migrations (name, checksum)
         VALUES ($1, $2)`,
        [name, checksum],
      );
    },
  };
}
