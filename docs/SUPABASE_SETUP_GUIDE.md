# 🚀 SeCLOUDIVE — Production-Grade Supabase Backend Complete Guide v3.5
**NAEN Studios & SeCLOUDIVE Platform Engineering**

---

## 🏛️ CORE ARCHITECTURAL DIRECTIVE
> **MANDATORY RULE**: Whenever ANY new feature, page, modal, or data structure is added to SeCLOUDIVE, the backend database tables, Row Level Security (RLS) policies, and service methods MUST be built for it simultaneously. No frontend feature exists in isolation without its corresponding cloud-persisted backend counterpart.

---

## 📋 Active Project Credentials & Configuration

The active Supabase project for SeCLOUDIVE is **`wcthjlnbkwkhvxrcuwfx`** hosted in AWS Tokyo (`ap-northeast-1`).

| Setting | Value | Scope |
| :--- | :--- | :--- |
| **Project Ref** | `wcthjlnbkwkhvxrcuwfx` | Global identifier |
| **API URL** | `https://wcthjlnbkwkhvxrcuwfx.supabase.co` | Frontend & Backend REST |
| **Publishable Key** | `sb_publishable_Nr-5SFgh_G403Mf0HrloWw_FRul_fFu` | Client Safe |
| **Anon Public Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Client Safe (`.env`) |
| **Service Role Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | 🔒 Backend Only (`server/.env`) |
| **Pooler Region** | `aws-0-ap-northeast-1.pooler.supabase.com` | PostgreSQL Engine |

---

## 🔌 Connection Strings & Pooler Configuration

### 1. Shared Transaction-Mode Pooler (IPv4 Optimized, Port 6543)
Ideal for serverless queries, high concurrency, and client connections:
```ini
DATABASE_URL="postgresql://postgres.wcthjlnbkwkhvxrcuwfx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### 2. Session-Mode Pooler (DDL & Migrations, Port 5432)
Used for running migrations, schema alterations, and session variables:
```ini
DIRECT_URL="postgresql://postgres.wcthjlnbkwkhvxrcuwfx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
```

### 3. Direct Postgres Connection
```ini
postgresql://postgres:[YOUR-PASSWORD]@db.wcthjlnbkwkhvxrcuwfx.supabase.co:5432/postgres
```

> **Database Password**: You can set or reset your database password in the [Supabase Dashboard > Project Settings > Database](https://supabase.com/dashboard/project/wcthjlnbkwkhvxrcuwfx/settings/database).

---

## 🛠️ Supabase CLI & MCP Integration

### 1. Initialize & Link Project
Run these commands in the root of the project:
```bash
# Login to Supabase CLI (if not already logged in)
supabase login

# Project is initialized with config.toml
supabase init

# Link local workspace to cloud project
supabase link --project-ref wcthjlnbkwkhvxrcuwfx
```

### 2. Claude & AI IDE MCP Integration
Connect your MCP server directly to this Supabase project with full database inspection, documentation, functions, and debugging tools:
```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=wcthjlnbkwkhvxrcuwfx&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"
```

---

## 📁 Multi-Layer Architecture Implementation

### 1. Frontend Client Layer (`src/lib/supabase.js`)
- Dual-environment resolution: reads `VITE_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Latency telemetry probe via `checkSupabaseHealth()`.
- Auto session refresh and isolated local storage persistence.

### 2. SSR & Next.js Server Components (`src/utils/supabase/`)
- `src/utils/supabase/server.js`: Server-side client using `@supabase/ssr` with cookie stores.
- `src/utils/supabase/middleware.js`: Edge middleware client with cookie header forwarding.
- `src/utils/supabase/client.js`: Isomorphic browser client helper.

### 3. Python FastAPI Backend Engine (`server/`)
- `server/supabase_client.py`: High-performance Python Supabase client using zero external dependencies (`urllib.request`).
- `/api/supabase/status`: Real-time health diagnostic endpoint returning latency and table reachability.
- Automatic audit event logging into `public.audit_logs`.
- Mock interview transcript archiving into `public.interview_sessions`.

### 4. Enterprise Schema & Migrations (`src/lib/supabaseSchema.sql`)
- Located at: `src/lib/supabaseSchema.sql` and `supabase/migrations/20261003000000_secloudive_core_schema.sql`.
- 14 Production Tables:
  1. `user_profiles` (Auth, clearance levels 1-4, student name, total XP)
  2. `user_settings` (Multi-cloud provider filters, learning personas, themes)
  3. `user_progress` (Real-time telemetry, labs, battle rooms, radar threats)
  4. `user_streaks` (Consecutive days, longest streak, streak freezes)
  5. `user_badges` (Milestone achievements and verifiable badges)
  6. `user_certificates` (Cryptographic SHA-256 certificate ledger)
  7. `chat_sessions` (Sentinel AI multi-turn memory model)
  8. `xp_transactions` (Tamper-evident append-only ledger)
  9. `custom_labs` (Cloudive Studio community IaC scenarios)
  10. `interview_sessions` (Mock interview audio/text transcripts & scores)
  11. `internship_records` (Sprints 1-4, supervisor sign-offs, deliverables)
  12. `user_flashcards` (Leitner spaced repetition intervals)
  13. `audit_packs` (HMAC-SHA256 verified remediation archives)
  14. `audit_logs` (Security monitoring, login events, tamper alerts)
- 4 High-Speed Views:
  - `public.leaderboard` (All-time and weekly global rankings)
  - `public.leaderboard_tier1` through `tier4` (Rankings by clearance level)
  - `public.verified_credentials` (Public employer credential check)
  - `public.public_community_labs` (Shared lab scenarios)
- Stored Procedures (RPCs):
  - `save_progress` (Atomic JSONB state upsert + scalar metric synchronization)
  - `award_xp` (Tamper-proof ledger transaction and profile update)
  - `update_streak` (Daily calendar calculation)
  - `issue_certificate` (SHA-256 digest + credential generation)
  - `verify_certificate` (Public lookup by ID or cryptographic hash)

---

## 🔍 Verification & Health Check

### In-App Connection Ping
1. Click the **User Identity / Auto-Sync** badge in the navbar (or press `Ctrl + K` -> "User Identity").
2. Select the **Supabase Backend** tab.
3. Click **Test Connection Ping**:
   - Returns `Connected to Supabase (XXms)` with status `Ready`.

### Public Credential Verification Check
1. Navigate to `/verify-audit-pack` in your browser.
2. Switch to **Online Credential Verification (Supabase Cloud)**.
3. Test with any credential ID to query the live Supabase `verified_credentials` view.

---

*SeCLOUDIVE Platform Engineering — NAEN Studios © 2026*
