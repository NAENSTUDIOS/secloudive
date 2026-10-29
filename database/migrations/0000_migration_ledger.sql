-- Migration bookkeeping is created before application migrations.
-- The runner serializes migration application with a transaction advisory lock.

CREATE TABLE schema_migrations (
  name TEXT PRIMARY KEY,
  checksum TEXT NOT NULL CHECK (checksum ~ '^[0-9a-f]{64}$'),
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
