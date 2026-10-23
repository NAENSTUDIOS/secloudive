# SeCloudive Database Map

## Current database

Supabase/PostgreSQL is the intended cloud persistence layer. The dated
migration in `supabase/migrations/` defines:

- `user_profiles`, `user_settings`, `user_progress`
- streaks, badges, certificates, XP transactions
- chat sessions, custom labs, interviews, internships, flashcards
- audit packs, audit logs, notes
- leaderboard/community/credential views
- storage policies and RPCs for progress, XP, certificates, and verification

## Access model

- User-owned records are generally protected with `auth.uid()` RLS checks.
- Public certificate verification and selected public community content are
  deliberate exceptions.
- Frontend services call tables/RPCs directly through the Supabase client.
- Local storage remains the offline fallback.

## Data integrity risks

1. `supabase/migrations/...sql` and `src/lib/supabaseSchema.sql` can drift.
2. `progress_blob` duplicates scalar counters and lacks a visible version
   migration contract.
3. Direct upsert fallback can bypass intended RPC validation.
4. Admin/instructor/auditor policies are not clearly complete.
5. Analytics events, organization tenancy, retention, and deletion workflows
   are not fully modeled.

## Scale direction

- Choose one migration source of truth and enforce migration checks in CI.
- Version progress documents and migrate them server-side.
- Keep derived counters server-maintained.
- Add tenant/org IDs with composite indexes and RLS before enterprise launch.
- Add durable event tables with retention/consent metadata.
- Add caching/search/object storage only when a measured workload requires them.
- Define backup, restore, deletion, and disaster-recovery procedures.

See [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) for current setup
instructions and [CODEBASE_AUDIT.md](./CODEBASE_AUDIT.md) for the full table and
RLS assessment.
