-- =============================================================================
-- SeCLOUDIVE — Production-Grade Multi-Tenant Supabase Backend Schema v3.0
-- Architecture: NAEN Studios & SeCLOUDIVE Platform Engineering
-- Description: Complete enterprise database schema covering every corner of
--              the platform: Auth, User Profiles, Settings, Granular Progress,
--              Realtime Streaks, Badges, Cryptographic Certificates, AI Sentinel
--              Chat Sessions, Cloudive Studio Labs, Mock Interview Transcripts,
--              Internship Sprints, Flashcard Spaced Repetition, XP Audit Ledger,
--              Tamper-Evident Audit Packs, and Row Level Security (RLS).
-- =============================================================================
-- INSTRUCTIONS FOR SETUP:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_/sql
-- 2. Open "SQL Editor" -> Click "New Query"
-- 3. Paste this ENTIRE file into the editor and click "Run" (or Ctrl + Enter).
-- 4. Check the "Table Editor" and verify all tables are created with RLS active.
-- =============================================================================

-- ── 0. DATABASE EXTENSIONS ───────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";   -- Query performance analysis
CREATE EXTENSION IF NOT EXISTS "pg_trgm";              -- High-speed fuzzy search

-- =============================================================================
-- 1. CORE TABLES
-- =============================================================================

-- ── 1.1 user_profiles ────────────────────────────────────────────────────────
-- Extends auth.users. One primary profile row per registered user.
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id              UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email           TEXT        NOT NULL,
  name            TEXT        NOT NULL DEFAULT 'Learner',
  picture         TEXT,
  role            TEXT        NOT NULL DEFAULT 'learner'
                              CHECK (role IN ('learner', 'instructor', 'admin', 'auditor')),
  student_name    TEXT,                                -- Official name printed on certificates
  clearance_level INTEGER     NOT NULL DEFAULT 1
                              CHECK (clearance_level BETWEEN 1 AND 4),
  total_xp        INTEGER     NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  country_code    TEXT        DEFAULT 'US',
  is_banned       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migration safety for pre-existing user_profiles tables:
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS picture TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS clearance_level INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS total_xp INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT 'US';
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ NOT NULL DEFAULT NOW();


-- ── 1.2 user_settings ────────────────────────────────────────────────────────
-- Per-user platform configurations and customization preferences.
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id                  UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  sandbox_mode             BOOLEAN     NOT NULL DEFAULT FALSE,
  selected_cloud_provider  TEXT        NOT NULL DEFAULT 'all'
                           CHECK (selected_cloud_provider IN ('all','aws','azure','gcp','oci','ibm')),
  target_cloud_specialty   TEXT        NOT NULL DEFAULT 'aws'
                           CHECK (target_cloud_specialty IN ('aws','azure','gcp','oci','ibm')),
  learning_persona         TEXT        NOT NULL DEFAULT 'student'
                           CHECK (learning_persona IN ('student','lecturer','engineer','switcher')),
  learning_track_mode      TEXT        NOT NULL DEFAULT 'multi'
                           CHECK (learning_track_mode IN ('single','multi')),
  learning_view            TEXT        NOT NULL DEFAULT 'grid'
                           CHECK (learning_view IN ('grid','list')),
  audio_fx_enabled         BOOLEAN     NOT NULL DEFAULT TRUE,
  user_gemini_key          TEXT,                       -- Optional custom Gemini API key
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 1.3 user_progress ────────────────────────────────────────────────────────
-- Core learning telemetry. Fast-query indexed scalar columns + full state JSONB.
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id                   UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,

  -- Scalar indexed columns (for leaderboards, tier gates, and real-time badges)
  total_xp                  INTEGER     NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  clearance_tier            INTEGER     NOT NULL DEFAULT 1 CHECK (clearance_tier BETWEEN 1 AND 4),
  target_career_role        TEXT        NOT NULL DEFAULT 'Cloud Security Engineer',

  -- Challenge & Simulator counters
  challenges_completed      INTEGER     NOT NULL DEFAULT 0,
  labs_completed            INTEGER     NOT NULL DEFAULT 0,
  battle_rooms_solved       INTEGER     NOT NULL DEFAULT 0,
  architecture_reviews_done INTEGER     NOT NULL DEFAULT 0,
  investigations_done       INTEGER     NOT NULL DEFAULT 0,
  playbooks_executed        INTEGER     NOT NULL DEFAULT 0,
  radar_threats_contained   INTEGER     NOT NULL DEFAULT 0,
  rampup_completed          BOOLEAN     NOT NULL DEFAULT FALSE,
  capstones_completed       INTEGER     NOT NULL DEFAULT 0,

  -- Diagnostic placement baseline
  diagnostic_baseline       JSONB,
  diagnostic_completed_at   TIMESTAMPTZ,

  -- Complete state blob (fully restores ChallengeContext across devices)
  progress_blob             JSONB       NOT NULL DEFAULT '{}'::JSONB,

  -- Domain specific scores & attempts
  architecture_scores       JSONB       NOT NULL DEFAULT '{}'::JSONB,
  simulator_scores          JSONB       NOT NULL DEFAULT '{}'::JSONB,
  investigation_scores      JSONB       NOT NULL DEFAULT '{}'::JSONB,
  investigation_assessments JSONB       NOT NULL DEFAULT '{}'::JSONB,
  learning_quiz_scores      JSONB       NOT NULL DEFAULT '{}'::JSONB,
  interview_attempts        JSONB       NOT NULL DEFAULT '{}'::JSONB,
  battle_rooms_data         JSONB       NOT NULL DEFAULT '{}'::JSONB,

  -- Learning center topics & bookmarks
  learning_topics_completed JSONB       NOT NULL DEFAULT '[]'::JSONB,
  learning_bookmarked_topics JSONB      NOT NULL DEFAULT '[]'::JSONB,

  -- Hands-on cloud projects & labs
  cloud_projects_completed  JSONB       NOT NULL DEFAULT '[]'::JSONB,
  cloud_projects_teardown   JSONB       NOT NULL DEFAULT '[]'::JSONB,
  lab_steps                 JSONB       NOT NULL DEFAULT '{}'::JSONB,

  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 1.4 user_streaks ─────────────────────────────────────────────────────────
-- Daily activity streak with protection freezes and streak tracking.
CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak  INTEGER     NOT NULL DEFAULT 0,
  longest_streak  INTEGER     NOT NULL DEFAULT 0,
  last_active_date DATE,
  streak_started  TIMESTAMPTZ,
  total_days      INTEGER     NOT NULL DEFAULT 0,
  freeze_count    INTEGER     NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 1.5 user_badges ──────────────────────────────────────────────────────────
-- Earned badges (one row per badge earned by user).
CREATE TABLE IF NOT EXISTS public.user_badges (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id    TEXT        NOT NULL,
  badge_name  TEXT        NOT NULL,
  badge_tier  TEXT        DEFAULT 'bronze',
  earned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, badge_id)
);

-- ── 1.6 user_certificates ────────────────────────────────────────────────────
-- Verifiable completion certificates with SHA-256 cryptographic hashes.
CREATE TABLE IF NOT EXISTS public.user_certificates (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cert_type         TEXT        NOT NULL,              -- e.g., 'mastery', 'tier-1', 'capstone'
  cert_title        TEXT        NOT NULL,
  student_name      TEXT        NOT NULL,
  tier              INTEGER     DEFAULT 1,
  credential_id     TEXT        NOT NULL,              -- Public ID: e.g. NAEN-SEC-2026-ABCD1234
  cert_hash         TEXT        NOT NULL,              -- SHA-256 integrity hash
  verification_code TEXT,                              -- Short verification token
  metadata          JSONB       DEFAULT '{}'::JSONB,
  issued_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, cert_type)
);

-- ── 1.7 chat_sessions ────────────────────────────────────────────────────────
-- Sentinel AI multi-turn conversational history and context memory.
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  messages        JSONB       NOT NULL DEFAULT '[]'::JSONB,
  message_count   INTEGER     NOT NULL DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 1.8 xp_transactions ──────────────────────────────────────────────────────
-- Immutable tamper-resistant audit ledger of all XP changes.
CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount       INTEGER     NOT NULL,
  reason       TEXT        NOT NULL,               -- 'challenge_complete','lab_done','streak_reward'
  reference_id TEXT,                               -- Challenge/Lab ID
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 1.9 custom_labs (Cloudive Studio) ─────────────────────────────────────────
-- User-created custom cyber challenge scenarios, IaC templates, and topologies.
CREATE TABLE IF NOT EXISTS public.custom_labs (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title            TEXT        NOT NULL,
  description      TEXT,
  cloud_provider   TEXT        NOT NULL DEFAULT 'aws'
                               CHECK (cloud_provider IN ('aws','azure','gcp','oci','ibm','multi')),
  difficulty       TEXT        NOT NULL DEFAULT 'intermediate'
                               CHECK (difficulty IN ('beginner','intermediate','advanced','expert')),
  iac_code         TEXT,
  topology_config  JSONB       DEFAULT '{}'::JSONB,
  validation_rules JSONB       DEFAULT '[]'::JSONB,
  is_public        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 1.10 interview_sessions ──────────────────────────────────────────────────
-- Mock interview transcripts, technical defense grading, and Gemini evaluations.
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  track_role          TEXT        NOT NULL DEFAULT 'Cloud Security Engineer',
  question_count      INTEGER     NOT NULL DEFAULT 0,
  overall_score       INTEGER     NOT NULL DEFAULT 0,
  evaluation_feedback TEXT,
  transcripts         JSONB       NOT NULL DEFAULT '[]'::JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 1.11 internship_records ──────────────────────────────────────────────────
-- Virtual internship sprint completions, deliverables, and supervisor sign-offs.
CREATE TABLE IF NOT EXISTS public.internship_records (
  id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sprint_number         INTEGER     NOT NULL,
  sprint_title          TEXT        NOT NULL,
  status                TEXT        NOT NULL DEFAULT 'in_progress'
                                    CHECK (status IN ('in_progress','completed','graded')),
  deliverables          JSONB       DEFAULT '{}'::JSONB,
  supervisor_evaluation JSONB       DEFAULT '{}'::JSONB,
  grade_score           INTEGER     DEFAULT 0,
  completed_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, sprint_number)
);

-- ── 1.12 user_flashcards ─────────────────────────────────────────────────────
-- Spaced repetition flashcard drill state and Leitner box mastery levels.
CREATE TABLE IF NOT EXISTS public.user_flashcards (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  deck_id           TEXT        NOT NULL,
  box_levels        JSONB       DEFAULT '{}'::JSONB,
  total_reviewed    INTEGER     NOT NULL DEFAULT 0,
  accuracy_percent  INTEGER     NOT NULL DEFAULT 0,
  last_reviewed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, deck_id)
);

-- ── 1.13 audit_packs ─────────────────────────────────────────────────────────
-- Tamper-evident cryptographic bundles generated by learners for audits.
CREATE TABLE IF NOT EXISTS public.audit_packs (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pack_hash           TEXT        NOT NULL,
  bundle_name         TEXT        NOT NULL,
  file_url            TEXT,
  verification_status TEXT        NOT NULL DEFAULT 'verified',
  metadata            JSONB       DEFAULT '{}'::JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 1.14 audit_logs ──────────────────────────────────────────────────────────
-- Security, authentication, and access log stream.
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT        NOT NULL,
  metadata    JSONB       DEFAULT '{}'::JSONB,
  ip_hint     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 1.15 user_notes (Universal Engineering Scratchpad & Lab Notes) ──────────
-- Real-time synced engineering observations and forensic lab notes.
CREATE TABLE IF NOT EXISTS public.user_notes (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  context_id   TEXT        NOT NULL DEFAULT 'universal',
  note_content TEXT        NOT NULL DEFAULT '',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, context_id)
);

-- =============================================================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.user_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_certificates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_labs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_flashcards    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_packs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs         ENABLE ROW LEVEL SECURITY;

-- ── user_profiles ──
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
CREATE POLICY "user_profiles_select_own" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "user_profiles_update_own" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- ── user_settings ──
DROP POLICY IF EXISTS "user_settings_all_own" ON public.user_settings;
CREATE POLICY "user_settings_all_own"    ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- ── user_progress ──
DROP POLICY IF EXISTS "user_progress_all_own" ON public.user_progress;
CREATE POLICY "user_progress_all_own"    ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- ── user_streaks ──
DROP POLICY IF EXISTS "user_streaks_all_own" ON public.user_streaks;
CREATE POLICY "user_streaks_all_own"     ON public.user_streaks FOR ALL USING (auth.uid() = user_id);

-- ── user_badges ──
DROP POLICY IF EXISTS "user_badges_select_own" ON public.user_badges;
DROP POLICY IF EXISTS "user_badges_insert_own" ON public.user_badges;
CREATE POLICY "user_badges_select_own"   ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_badges_insert_own"   ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── user_certificates (Owner has full access, public can read for verification) ──
DROP POLICY IF EXISTS "user_certs_select_own" ON public.user_certificates;
DROP POLICY IF EXISTS "user_certs_insert_own" ON public.user_certificates;
DROP POLICY IF EXISTS "user_certs_public_verify" ON public.user_certificates;
CREATE POLICY "user_certs_select_own"    ON public.user_certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_certs_insert_own"    ON public.user_certificates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_certs_public_verify" ON public.user_certificates FOR SELECT USING (true);

-- ── chat_sessions ──
DROP POLICY IF EXISTS "chat_sessions_all_own" ON public.chat_sessions;
CREATE POLICY "chat_sessions_all_own"    ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);

-- ── xp_transactions (Immutable Ledger: read-only for clients, mutated ONLY via award_xp RPC) ──
DROP POLICY IF EXISTS "xp_tx_select_own" ON public.xp_transactions;
DROP POLICY IF EXISTS "xp_tx_insert_own" ON public.xp_transactions;
CREATE POLICY "xp_tx_select_own" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);

-- ── custom_labs (Owners manage their labs; anyone can view public labs) ──
DROP POLICY IF EXISTS "custom_labs_manage_own" ON public.custom_labs;
DROP POLICY IF EXISTS "custom_labs_select_public" ON public.custom_labs;
CREATE POLICY "custom_labs_manage_own"   ON public.custom_labs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "custom_labs_select_public" ON public.custom_labs FOR SELECT USING (is_public = TRUE);

-- ── interview_sessions ──
DROP POLICY IF EXISTS "interview_all_own" ON public.interview_sessions;
CREATE POLICY "interview_all_own"        ON public.interview_sessions FOR ALL USING (auth.uid() = user_id);

-- ── internship_records ──
DROP POLICY IF EXISTS "internship_all_own" ON public.internship_records;
CREATE POLICY "internship_all_own"       ON public.internship_records FOR ALL USING (auth.uid() = user_id);

-- ── user_flashcards ──
DROP POLICY IF EXISTS "flashcards_all_own" ON public.user_flashcards;
CREATE POLICY "flashcards_all_own"       ON public.user_flashcards FOR ALL USING (auth.uid() = user_id);

-- ── audit_packs (Protected: full access for owner, public lookup via verified hash) ──
DROP POLICY IF EXISTS "audit_packs_all_own" ON public.audit_packs;
DROP POLICY IF EXISTS "audit_packs_public_verify" ON public.audit_packs;
CREATE POLICY "audit_packs_all_own"      ON public.audit_packs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "audit_packs_public_verify" ON public.audit_packs FOR SELECT USING (verification_status = 'verified');

-- ── audit_logs ──
DROP POLICY IF EXISTS "audit_logs_select_own" ON public.audit_logs;
CREATE POLICY "audit_logs_select_own"    ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

-- ── user_notes ──
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_notes_all_own" ON public.user_notes;
CREATE POLICY "user_notes_all_own"       ON public.user_notes FOR ALL USING (auth.uid() = user_id);

-- =============================================================================
-- 3. PUBLIC VIEWS (Safe, High-Performance, No PII Leaks)
-- =============================================================================

-- Clean drop for existing views to avoid Postgres 42P16 column mismatch errors
DROP VIEW IF EXISTS public.leaderboard CASCADE;
DROP VIEW IF EXISTS public.leaderboard_tier1 CASCADE;
DROP VIEW IF EXISTS public.leaderboard_tier2 CASCADE;
DROP VIEW IF EXISTS public.leaderboard_tier3 CASCADE;
DROP VIEW IF EXISTS public.leaderboard_tier4 CASCADE;
DROP VIEW IF EXISTS public.verified_credentials CASCADE;
DROP VIEW IF EXISTS public.public_community_labs CASCADE;

-- ── 3.1 Global Leaderboard (Top 100 learners) ─────────────────────────────────
CREATE VIEW public.leaderboard AS
SELECT
  p.id                    AS user_id,
  p.name,
  p.picture,
  p.country_code,
  pr.total_xp             AS xp,
  pr.clearance_tier,
  pr.challenges_completed,
  pr.labs_completed,
  pr.battle_rooms_solved,
  pr.updated_at
FROM public.user_progress pr
JOIN public.user_profiles p ON p.id = pr.user_id
WHERE p.is_banned = FALSE
ORDER BY pr.total_xp DESC
LIMIT 100;

-- ── 3.2 Tier Leaderboards ─────────────────────────────────────────────────────
CREATE VIEW public.leaderboard_tier1 AS
SELECT p.name, p.picture, pr.total_xp AS xp, pr.updated_at
FROM public.user_progress pr
JOIN public.user_profiles p ON p.id = pr.user_id
WHERE p.is_banned = FALSE AND pr.clearance_tier >= 1
ORDER BY pr.total_xp DESC LIMIT 50;

CREATE VIEW public.leaderboard_tier2 AS
SELECT p.name, p.picture, pr.total_xp AS xp, pr.updated_at
FROM public.user_progress pr
JOIN public.user_profiles p ON p.id = pr.user_id
WHERE p.is_banned = FALSE AND pr.clearance_tier >= 2
ORDER BY pr.total_xp DESC LIMIT 50;

CREATE VIEW public.leaderboard_tier3 AS
SELECT p.name, p.picture, pr.total_xp AS xp, pr.updated_at
FROM public.user_progress pr
JOIN public.user_profiles p ON p.id = pr.user_id
WHERE p.is_banned = FALSE AND pr.clearance_tier >= 3
ORDER BY pr.total_xp DESC LIMIT 50;

CREATE VIEW public.leaderboard_tier4 AS
SELECT p.name, p.picture, pr.total_xp AS xp, pr.updated_at
FROM public.user_progress pr
JOIN public.user_profiles p ON p.id = pr.user_id
WHERE p.is_banned = FALSE AND pr.clearance_tier = 4
ORDER BY pr.total_xp DESC LIMIT 50;

-- ── 3.3 Public Certificate Verification View ──────────────────────────────────
CREATE VIEW public.verified_credentials AS
SELECT
  c.id,
  c.credential_id,
  c.cert_type,
  c.cert_title,
  c.student_name,
  c.tier,
  c.cert_hash,
  c.verification_code,
  c.issued_at,
  p.name AS profile_name
FROM public.user_certificates c
JOIN public.user_profiles p ON p.id = c.user_id
WHERE p.is_banned = FALSE;

-- ── 3.4 Public Community Labs View ────────────────────────────────────────────
CREATE VIEW public.public_community_labs AS
SELECT
  l.id,
  l.title,
  l.description,
  l.cloud_provider,
  l.difficulty,
  l.iac_code,
  l.topology_config,
  l.created_at,
  p.name AS author_name,
  p.picture AS author_picture
FROM public.custom_labs l
JOIN public.user_profiles p ON p.id = l.user_id
WHERE l.is_public = TRUE;

-- =============================================================================
-- 4. DATABASE FUNCTIONS & TRIGGERS (SECURITY DEFINER)
-- =============================================================================

-- ── 4.1 Auto-provision new users upon sign-up ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, picture)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email,'user@secloudive.io'), '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, user_profiles.name),
    picture = COALESCE(EXCLUDED.picture, user_profiles.picture),
    last_active = NOW();

  INSERT INTO public.user_settings (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_progress (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_streaks (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.chat_sessions (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.audit_logs (user_id, action, metadata)
  VALUES (NEW.id, 'user_registered', jsonb_build_object('provider', NEW.raw_app_meta_data->>'provider'));

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── 4.2 Award XP (Atomic & Safe) ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id    UUID,
  p_amount     INTEGER,
  p_reason     TEXT,
  p_ref_id     TEXT DEFAULT NULL
)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  v_new_xp INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RETURN 0;
  END IF;

  -- Update user_progress
  UPDATE public.user_progress
  SET total_xp = total_xp + p_amount, updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING total_xp INTO v_new_xp;

  -- Mirror cache on user_profiles
  UPDATE public.user_profiles
  SET total_xp = v_new_xp, last_active = NOW()
  WHERE id = p_user_id;

  -- Append audit ledger row
  INSERT INTO public.xp_transactions (user_id, amount, reason, reference_id)
  VALUES (p_user_id, p_amount, p_reason, p_ref_id);

  RETURN v_new_xp;
END;
$$;

-- ── 4.3 Update Daily Streak ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_streak(p_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  v_today          DATE := CURRENT_DATE;
  v_last_date      DATE;
  v_current_streak INTEGER;
  v_longest        INTEGER;
BEGIN
  SELECT last_active_date, current_streak, longest_streak
  INTO v_last_date, v_current_streak, v_longest
  FROM public.user_streaks WHERE user_id = p_user_id;

  IF v_last_date IS NULL THEN
    UPDATE public.user_streaks SET
      current_streak = 1, longest_streak = 1,
      last_active_date = v_today, streak_started = NOW(),
      total_days = 1, updated_at = NOW()
    WHERE user_id = p_user_id;

  ELSIF v_last_date = v_today THEN
    -- Already logged today
    NULL;

  ELSIF v_last_date = v_today - INTERVAL '1 day' THEN
    -- Consecutive day
    v_current_streak := v_current_streak + 1;
    v_longest := GREATEST(v_longest, v_current_streak);
    UPDATE public.user_streaks SET
      current_streak = v_current_streak,
      longest_streak = v_longest,
      last_active_date = v_today,
      total_days = total_days + 1,
      updated_at = NOW()
    WHERE user_id = p_user_id;

  ELSE
    -- Streak reset
    UPDATE public.user_streaks SET
      current_streak = 1,
      last_active_date = v_today,
      streak_started = NOW(),
      total_days = total_days + 1,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  UPDATE public.user_profiles SET last_active = NOW() WHERE id = p_user_id;
END;
$$;

-- ── 4.4 Save Progress (Full state upsert with automatic scalar sync) ──────────
CREATE OR REPLACE FUNCTION public.save_progress(
  p_user_id   UUID,
  p_blob      JSONB,
  p_tier      INTEGER DEFAULT 1,
  p_xp        INTEGER DEFAULT 0
)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  p_tier := GREATEST(1, LEAST(4, p_tier));
  p_xp   := GREATEST(0, p_xp);

  INSERT INTO public.user_progress (
    user_id, progress_blob, clearance_tier, total_xp,
    challenges_completed, labs_completed, battle_rooms_solved,
    architecture_reviews_done, investigations_done, playbooks_executed,
    radar_threats_contained, rampup_completed,
    architecture_scores, simulator_scores, investigation_scores,
    investigation_assessments, learning_quiz_scores, interview_attempts,
    battle_rooms_data, learning_topics_completed, learning_bookmarked_topics,
    cloud_projects_completed, cloud_projects_teardown, lab_steps,
    updated_at
  ) VALUES (
    p_user_id, p_blob, p_tier, p_xp,
    COALESCE((SELECT count(*) FROM jsonb_object_keys(COALESCE(p_blob->'completed', '{}'::jsonb))), 0),
    COALESCE((SELECT count(*) FROM jsonb_each(COALESCE(p_blob->'labSteps', '{}'::jsonb)) WHERE value != 'null'::jsonb), 0),
    COALESCE(jsonb_array_length(COALESCE(p_blob->'battleRoomsSolved', '[]'::jsonb)), 0),
    COALESCE((SELECT count(*) FROM jsonb_object_keys(COALESCE(p_blob->'architectureScores', '{}'::jsonb))), 0),
    COALESCE((SELECT count(*) FROM jsonb_object_keys(COALESCE(p_blob->'investigationScores', '{}'::jsonb))), 0),
    COALESCE((SELECT count(*) FROM jsonb_object_keys(COALESCE(p_blob->'playbooksExecuted', '{}'::jsonb))), 0),
    COALESCE((SELECT count(*) FROM jsonb_object_keys(COALESCE(p_blob->'radarThreatsContained', '{}'::jsonb))), 0),
    COALESCE((p_blob->>'rampupCompleted')::BOOLEAN, FALSE),
    COALESCE(p_blob->'architectureScores', '{}'::jsonb),
    COALESCE(p_blob->'simulatorScores', '{}'::jsonb),
    COALESCE(p_blob->'investigationScores', '{}'::jsonb),
    COALESCE(p_blob->'investigationAssessments', '{}'::jsonb),
    COALESCE(p_blob->'learningQuizScores', '{}'::jsonb),
    COALESCE(p_blob->'interviewAttempts', '{}'::jsonb),
    COALESCE(p_blob->'battleRoomsData', '{}'::jsonb),
    COALESCE(p_blob->'learningTopicsCompleted', '[]'::jsonb),
    COALESCE(p_blob->'learningBookmarkedTopics', '[]'::jsonb),
    COALESCE(p_blob->'cloudProjectsCompleted', '[]'::jsonb),
    COALESCE(p_blob->'cloudProjectsTeardown', '[]'::jsonb),
    COALESCE(p_blob->'labSteps', '{}'::jsonb),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    progress_blob             = EXCLUDED.progress_blob,
    clearance_tier            = EXCLUDED.clearance_tier,
    total_xp                  = GREATEST(user_progress.total_xp, EXCLUDED.total_xp),
    challenges_completed      = EXCLUDED.challenges_completed,
    labs_completed            = EXCLUDED.labs_completed,
    battle_rooms_solved       = EXCLUDED.battle_rooms_solved,
    architecture_reviews_done = EXCLUDED.architecture_reviews_done,
    investigations_done       = EXCLUDED.investigations_done,
    playbooks_executed        = EXCLUDED.playbooks_executed,
    radar_threats_contained   = EXCLUDED.radar_threats_contained,
    rampup_completed          = EXCLUDED.rampup_completed,
    architecture_scores       = EXCLUDED.architecture_scores,
    simulator_scores          = EXCLUDED.simulator_scores,
    investigation_scores      = EXCLUDED.investigation_scores,
    investigation_assessments = EXCLUDED.investigation_assessments,
    learning_quiz_scores      = EXCLUDED.learning_quiz_scores,
    interview_attempts        = EXCLUDED.interview_attempts,
    battle_rooms_data         = EXCLUDED.battle_rooms_data,
    learning_topics_completed = EXCLUDED.learning_topics_completed,
    learning_bookmarked_topics = EXCLUDED.learning_bookmarked_topics,
    cloud_projects_completed  = EXCLUDED.cloud_projects_completed,
    cloud_projects_teardown   = EXCLUDED.cloud_projects_teardown,
    lab_steps                 = EXCLUDED.lab_steps,
    updated_at                = NOW();

  UPDATE public.user_profiles SET
    total_xp        = GREATEST(total_xp, p_xp),
    clearance_level = p_tier,
    last_active     = NOW()
  WHERE id = p_user_id;

  PERFORM public.update_streak(p_user_id);
END;
$$;

-- ── 4.5 Issue Verifiable Certificate ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.issue_certificate(
  p_user_id       UUID,
  p_cert_type     TEXT,
  p_cert_title    TEXT,
  p_student_name  TEXT,
  p_tier          INTEGER DEFAULT 1,
  p_credential_id TEXT DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  v_cert_id UUID;
  v_cred_id TEXT;
  v_hash    TEXT;
  v_code    TEXT;
BEGIN
  v_cred_id := COALESCE(p_credential_id, 'NAEN-SEC-2026-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8)));
  v_code    := upper(substr(md5(p_user_id::text || p_cert_type), 1, 6));
  v_hash    := encode(digest(p_user_id::text || p_cert_type || v_cred_id || NOW()::text, 'sha256'), 'hex');

  INSERT INTO public.user_certificates (
    user_id, cert_type, cert_title, student_name, tier, credential_id, cert_hash, verification_code
  )
  VALUES (
    p_user_id, p_cert_type, p_cert_title, p_student_name, p_tier, v_cred_id, v_hash, v_code
  )
  ON CONFLICT (user_id, cert_type) DO UPDATE SET
    student_name      = EXCLUDED.student_name,
    cert_title        = EXCLUDED.cert_title,
    cert_hash         = v_hash,
    credential_id     = v_cred_id,
    verification_code = v_code,
    issued_at         = NOW()
  RETURNING id INTO v_cert_id;

  INSERT INTO public.audit_logs (user_id, action, metadata)
  VALUES (p_user_id, 'certificate_issued', jsonb_build_object('credential_id', v_cred_id, 'cert_type', p_cert_type));

  RETURN jsonb_build_object(
    'certificate_id', v_cert_id,
    'credential_id', v_cred_id,
    'verification_code', v_code,
    'cert_hash', v_hash
  );
END;
$$;

-- ── 4.6 Public Certificate Verification Function ──────────────────────────────
CREATE OR REPLACE FUNCTION public.verify_certificate(p_query TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'valid', TRUE,
    'credential_id', c.credential_id,
    'student_name', c.student_name,
    'cert_title', c.cert_title,
    'cert_type', c.cert_type,
    'tier', c.tier,
    'issued_at', c.issued_at,
    'cert_hash', c.cert_hash,
    'verification_code', c.verification_code
  ) INTO v_result
  FROM public.user_certificates c
  WHERE c.credential_id ILIKE trim(p_query)
     OR c.cert_hash ILIKE trim(p_query)
     OR c.id::TEXT = trim(p_query)
  LIMIT 1;

  IF v_result IS NULL THEN
    RETURN jsonb_build_object('valid', FALSE, 'error', 'No authentic certificate found matching query.');
  END IF;

  RETURN v_result;
END;
$$;

-- ── 4.7 Auto-updated timestamp triggers ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

DO $$ BEGIN
  CREATE TRIGGER trg_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_user_streaks_updated_at BEFORE UPDATE ON public.user_streaks FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_chat_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_custom_labs_updated_at BEFORE UPDATE ON public.custom_labs FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
  EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================================================
-- 5. PERFORMANCE INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_user_progress_xp           ON public.user_progress(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_tier          ON public.user_progress(clearance_tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email         ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_xp            ON public.user_profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user        ON public.xp_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user             ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user            ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certs_cred_id          ON public.user_certificates(credential_id);
CREATE INDEX IF NOT EXISTS idx_user_certs_hash             ON public.user_certificates(cert_hash);
CREATE INDEX IF NOT EXISTS idx_custom_labs_public          ON public.custom_labs(is_public, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user     ON public.interview_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_internship_records_user     ON public.internship_records(user_id, sprint_number);
CREATE INDEX IF NOT EXISTS idx_user_notes_user             ON public.user_notes(user_id, context_id);
CREATE INDEX IF NOT EXISTS idx_progress_blob_gin           ON public.user_progress USING GIN (progress_blob);
CREATE INDEX IF NOT EXISTS idx_profiles_name_trgm          ON public.user_profiles USING GIN (name gin_trgm_ops);

-- =============================================================================
-- 6. REALTIME SUBSCRIPTIONS & LIVE SYNC
-- =============================================================================

-- Ensure complete row payloads are sent during WebSocket broadcast
ALTER TABLE public.user_profiles      REPLICA IDENTITY FULL;
ALTER TABLE public.user_progress      REPLICA IDENTITY FULL;
ALTER TABLE public.user_streaks       REPLICA IDENTITY FULL;
ALTER TABLE public.user_badges        REPLICA IDENTITY FULL;
ALTER TABLE public.user_certificates  REPLICA IDENTITY FULL;
ALTER TABLE public.custom_labs        REPLICA IDENTITY FULL;
ALTER TABLE public.chat_sessions      REPLICA IDENTITY FULL;
ALTER TABLE public.interview_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.xp_transactions    REPLICA IDENTITY FULL;
ALTER TABLE public.user_notes         REPLICA IDENTITY FULL;

-- Add tables safely to publication (no errors if already present)
DO $$ 
DECLARE
  t text;
  tables text[] := ARRAY[
    'user_profiles',
    'user_progress',
    'user_streaks',
    'user_badges',
    'user_certificates',
    'custom_labs',
    'chat_sessions',
    'interview_sessions',
    'xp_transactions',
    'user_notes'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', t);
    END IF;
  END LOOP;
END $$;

-- =============================================================================
-- 7. STORAGE BUCKETS & POLICIES (Run in SQL or create in Supabase Storage UI)
-- =============================================================================
-- Buckets:
--   1. 'avatars'       - Public read; authenticated users can upload their own.
--   2. 'certificates'  - Public read; server-side/auth upload.
--   3. 'audit-packs'   - Public read for verification; auth user upload.
--   4. 'lab-artifacts' - Authenticated read/write for IaC and PCAP uploads.

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('certificates', 'certificates', true),
  ('audit-packs', 'audit-packs', true),
  ('lab-artifacts', 'lab-artifacts', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Storage policies (Idempotent: drop before create)
DROP POLICY IF EXISTS "Public avatars read" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload avatar"  ON storage.objects;
CREATE POLICY "Public avatars read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth upload avatar"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Public certs read"   ON storage.objects;
DROP POLICY IF EXISTS "Auth upload certs"   ON storage.objects;
CREATE POLICY "Public certs read"   ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Auth upload certs"   ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Public packs read"   ON storage.objects;
DROP POLICY IF EXISTS "Auth upload packs"   ON storage.objects;
CREATE POLICY "Public packs read"   ON storage.objects FOR SELECT USING (bucket_id = 'audit-packs');
CREATE POLICY "Auth upload packs"   ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'audit-packs' AND auth.uid() IS NOT NULL);

-- 9.4 Private Lab Artifacts (Strictly Authenticated)
DROP POLICY IF EXISTS "Auth read lab-artifacts"   ON storage.objects;
DROP POLICY IF EXISTS "Auth upload lab-artifacts" ON storage.objects;
CREATE POLICY "Auth read lab-artifacts"   ON storage.objects FOR SELECT USING (bucket_id = 'lab-artifacts' AND auth.uid() IS NOT NULL);
CREATE POLICY "Auth upload lab-artifacts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lab-artifacts' AND auth.uid() IS NOT NULL);

-- 9.5 Avatar Modification & Cleanup
DROP POLICY IF EXISTS "Auth update avatar" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete avatar" ON storage.objects;
CREATE POLICY "Auth update avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

-- =============================================================================
-- END OF SECLOUDIVE SUPABASE SCHEMA
-- =============================================================================
