-- SeCloudive additive assessment and portfolio evidence storage.
-- Existing local storage and progress tables remain unchanged.

CREATE TABLE IF NOT EXISTS public.foundation_assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  foundation_id TEXT NOT NULL,
  score NUMERIC(5,2) NOT NULL CHECK (score BETWEEN 0 AND 100),
  readiness_level TEXT NOT NULL CHECK (readiness_level IN (
    'BEGINNER',
    'DEVELOPING',
    'JUNIOR_READY',
    'ASSOCIATE_READY',
    'PROFESSIONAL_READY',
    'ADVANCED_TRACK_READY'
  )),
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  assessment_payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.portfolio_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artifact_type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::JSONB,
  role_mappings JSONB NOT NULL DEFAULT '[]'::JSONB,
  source_activity_id TEXT NOT NULL,
  validation_results JSONB NOT NULL DEFAULT '[]'::JSONB,
  documentation JSONB NOT NULL DEFAULT '[]'::JSONB,
  verification_id TEXT NOT NULL UNIQUE,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.foundation_assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_artifacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS foundation_assessment_attempts_select_own ON public.foundation_assessment_attempts;
CREATE POLICY foundation_assessment_attempts_select_own
  ON public.foundation_assessment_attempts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS foundation_assessment_attempts_insert_own ON public.foundation_assessment_attempts;
CREATE POLICY foundation_assessment_attempts_insert_own
  ON public.foundation_assessment_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS portfolio_artifacts_select_own_or_public ON public.portfolio_artifacts;
CREATE POLICY portfolio_artifacts_select_own_or_public
  ON public.portfolio_artifacts FOR SELECT
  USING (auth.uid() = user_id OR (visibility = 'public' AND validation_results @> '[{"status":"passed"}]'::JSONB));

DROP POLICY IF EXISTS portfolio_artifacts_insert_own ON public.portfolio_artifacts;
CREATE POLICY portfolio_artifacts_insert_own
  ON public.portfolio_artifacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS portfolio_artifacts_update_own ON public.portfolio_artifacts;
CREATE POLICY portfolio_artifacts_update_own
  ON public.portfolio_artifacts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS portfolio_artifacts_delete_own ON public.portfolio_artifacts;
CREATE POLICY portfolio_artifacts_delete_own
  ON public.portfolio_artifacts FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_foundation_attempts_user
  ON public.foundation_assessment_attempts(user_id, foundation_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_artifacts_user
  ON public.portfolio_artifacts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_artifacts_public
  ON public.portfolio_artifacts(visibility, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolio_artifacts_source
  ON public.portfolio_artifacts(user_id, artifact_type, source_activity_id);

DO $$ BEGIN
  CREATE TRIGGER trg_portfolio_artifacts_updated_at
    BEFORE UPDATE ON public.portfolio_artifacts
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.foundation_assessment_attempts REPLICA IDENTITY FULL;
ALTER TABLE public.portfolio_artifacts REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND tablename = 'foundation_assessment_attempts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.foundation_assessment_attempts;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND tablename = 'portfolio_artifacts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_artifacts;
  END IF;
END $$;

-- Validation queries:
-- SELECT relrowsecurity FROM pg_class WHERE oid = 'public.portfolio_artifacts'::regclass;
-- SELECT policyname FROM pg_policies WHERE tablename IN ('foundation_assessment_attempts', 'portfolio_artifacts');
