-- Secloudive learner foundation.
-- Covers: accounts, profiles, onboarding, consent, sessions,
-- progress events, assessment submissions, and private notes.
-- Learner application data and employer access require separate migrations.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Learner accounts ────────────────────────────────────────────────────────

CREATE TABLE learners (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cognito_sub   TEXT        NOT NULL UNIQUE,
  email         TEXT        NOT NULL UNIQUE CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  email_verified BOOLEAN    NOT NULL DEFAULT FALSE,
  auth_provider TEXT        NOT NULL CHECK (auth_provider IN ('password', 'google')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

CREATE INDEX learners_cognito_sub_idx ON learners (cognito_sub);
CREATE INDEX learners_email_idx       ON learners (email);

-- ── Learner profiles ────────────────────────────────────────────────────────

CREATE TABLE learner_profiles (
  learner_id        UUID        PRIMARY KEY REFERENCES learners(id) ON DELETE CASCADE,
  display_name      TEXT        CHECK (length(trim(display_name)) >= 2),
  experience_level  TEXT        CHECK (experience_level IN ('beginner','developing','practitioner','professional')),
  primary_goal      TEXT        CHECK (primary_goal IN (
                                  'learn_foundations','career_change','job_preparation',
                                  'current_role','certification','portfolio','teaching')),
  target_role       TEXT        CHECK (target_role IN (
                                  'foundation_learner','cloud_security_analyst','soc_analyst',
                                  'iam_engineer','cloud_security_engineer','devsecops_engineer',
                                  'security_architect','grc_specialist')),
  plan_version      TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Onboarding ──────────────────────────────────────────────────────────────

CREATE TABLE learner_onboarding (
  learner_id  UUID        PRIMARY KEY REFERENCES learners(id) ON DELETE CASCADE,
  status      TEXT        NOT NULL DEFAULT 'not_started'
                          CHECK (status IN ('not_started','in_progress','completed','paused')),
  started_at  TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (completed_at IS NULL OR status = 'completed')
);

CREATE TABLE learner_diagnostic_results (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id  UUID        NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  domain      TEXT        NOT NULL CHECK (domain IN (
                            'computer_fundamentals','linux','networking','git_github',
                            'python','docker','ci_cd','aws_fundamentals','security_fundamentals')),
  level       TEXT        NOT NULL CHECK (level IN ('beginner','developing','practitioner','professional')),
  evidence_required BOOLEAN NOT NULL DEFAULT TRUE,
  schema_version TEXT     NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (learner_id, domain)
);

-- ── Consent records ─────────────────────────────────────────────────────────

CREATE TABLE consent_records (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id  UUID        NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL CHECK (type IN ('terms','privacy','analytics','marketing','ai_memory')),
  version     TEXT        NOT NULL CHECK (length(trim(version)) > 0),
  granted     BOOLEAN     NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash     TEXT,
  UNIQUE (learner_id, type, version)
);

CREATE INDEX consent_records_learner_idx ON consent_records (learner_id, type);

-- ── Sessions ────────────────────────────────────────────────────────────────

CREATE TABLE learner_sessions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id    UUID        NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  cognito_jti   TEXT        NOT NULL UNIQUE,
  issued_at     TIMESTAMPTZ NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  revoked_at    TIMESTAMPTZ,
  user_agent    TEXT,
  ip_hash       TEXT,
  CHECK (expires_at > issued_at)
);

CREATE INDEX learner_sessions_learner_idx  ON learner_sessions (learner_id, expires_at DESC);
CREATE INDEX learner_sessions_active_idx   ON learner_sessions (expires_at)
  WHERE revoked_at IS NULL;

-- ── Progress events ─────────────────────────────────────────────────────────

CREATE TABLE progress_events (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id       UUID        NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  event_type       TEXT        NOT NULL CHECK (event_type IN (
                                 'module_started','module_completed','assessment_submitted',
                                 'assessment_passed','assessment_failed','mission_started',
                                 'mission_completed','note_created','onboarding_completed')),
  content_id       TEXT,
  content_domain   TEXT        CHECK (content_domain IN (
                                 'computer_fundamentals','linux','networking','git_github',
                                 'python','docker','ci_cd','aws_fundamentals','security_fundamentals')),
  idempotency_key  TEXT        NOT NULL UNIQUE,
  schema_version   INTEGER     NOT NULL DEFAULT 1 CHECK (schema_version > 0),
  metadata         JSONB       NOT NULL DEFAULT '{}'::jsonb,
  occurred_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX progress_events_learner_idx  ON progress_events (learner_id, occurred_at DESC);
CREATE INDEX progress_events_content_idx  ON progress_events (content_id)
  WHERE content_id IS NOT NULL;

-- ── Assessment submissions ───────────────────────────────────────────────────

CREATE TABLE assessment_submissions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id       UUID        NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  content_id       TEXT        NOT NULL CHECK (length(trim(content_id)) > 0),
  attempt_number   INTEGER     NOT NULL DEFAULT 1 CHECK (attempt_number > 0),
  score_pct        SMALLINT    CHECK (score_pct BETWEEN 0 AND 100),
  passed           BOOLEAN,
  answers          JSONB       NOT NULL DEFAULT '[]'::jsonb,
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  graded_at        TIMESTAMPTZ,
  UNIQUE (learner_id, content_id, attempt_number),
  CHECK (graded_at IS NULL OR graded_at >= submitted_at)
);

CREATE INDEX assessment_submissions_learner_idx ON assessment_submissions (learner_id, content_id);

-- ── Learner notes ────────────────────────────────────────────────────────────

CREATE TABLE learner_notes (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id   UUID        NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
  title        TEXT        NOT NULL CHECK (length(trim(title)) > 0),
  body         TEXT        NOT NULL DEFAULT '',
  content_id   TEXT,
  tags         JSONB       NOT NULL DEFAULT '[]'::jsonb,
  is_private   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ
);

CREATE INDEX learner_notes_learner_idx  ON learner_notes (learner_id, updated_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX learner_notes_content_idx  ON learner_notes (content_id)
  WHERE content_id IS NOT NULL AND deleted_at IS NULL;

-- ── Privacy preferences ──────────────────────────────────────────────────────

CREATE TABLE learner_privacy_preferences (
  learner_id              UUID    PRIMARY KEY REFERENCES learners(id) ON DELETE CASCADE,
  analytics               BOOLEAN NOT NULL DEFAULT FALSE,
  marketing               BOOLEAN NOT NULL DEFAULT FALSE,
  ai_memory               BOOLEAN NOT NULL DEFAULT FALSE,
  streaks                 BOOLEAN NOT NULL DEFAULT FALSE,
  instructor_visibility   TEXT    NOT NULL DEFAULT 'private'
                          CHECK (instructor_visibility IN ('private','assigned_work')),
  portfolio_visibility    TEXT    NOT NULL DEFAULT 'private'
                          CHECK (portfolio_visibility IN ('private','reviewers')),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
