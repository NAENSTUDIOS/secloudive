# Database migrations

The database uses PostgreSQL as the source of truth. Migrations are additive,
reviewed changes and must preserve the domain contracts in
`packages/contracts`.

## Opportunities migration

`migrations/0001_opportunities.sql` creates the first jobs and internships
storage boundary:

- provider permissions and enablement;
- ingestion attempts;
- immutable source payload snapshots;
- normalized opportunities;
- moderation events;
- learner abuse reports; and
- operational audit events.

The `opportunities` table enforces provider/source uniqueness. The partial
active-search index intentionally includes only records that are both active
and approved; application code must still enforce the same predicate when
serving results.

The migration does not include learner applications, candidate profiles, or
employer access to learner evidence. Those are separate privacy-sensitive
surfaces and require explicit consent, retention, authorization, and audit
design before implementation.

## Configuration and execution

The API validates `NODE_ENV` and `DATABASE_URL` before a connection is created.
Production requires a PostgreSQL URL and an application database client
configured for TLS. Masked, non-PostgreSQL, and unsupported environment values
fail explicitly.

Migration execution is intentionally represented by a small executor interface
in `apps/api/src/modules/database/migrations.ts`. A real PostgreSQL client and
migration ledger must be added together. The runner must record migration name,
checksum, start time, completion time, and failure state in a transaction; it
must never mark a failed migration as applied. Reapplying an unchanged
migration is a no-op; changing the SQL after it has been applied fails with a
checksum mismatch instead of silently drifting the schema.

`migrations/0000_migration_ledger.sql` creates the bookkeeping table before
the opportunities migration. Transactional application takes a PostgreSQL
transaction advisory lock, checks the existing checksum, executes the SQL,
records the checksum, and commits. Any failure rolls back the transaction.
