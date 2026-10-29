-- Secloudive opportunities foundation.
-- This migration stores source-backed listings without storing learner
-- application credentials or private learner evidence.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE opportunity_providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('approved_api', 'approved_feed', 'employer_submission')),
  terms_url TEXT NOT NULL CHECK (terms_url ~ '^https://'),
  display_permission_confirmed_at TIMESTAMPTZ NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE opportunity_ingestion_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id TEXT NOT NULL REFERENCES opportunity_providers(id),
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  accepted_count INTEGER NOT NULL DEFAULT 0 CHECK (accepted_count >= 0),
  rejected_count INTEGER NOT NULL DEFAULT 0 CHECK (rejected_count >= 0),
  error_message TEXT,
  CHECK (
    (status = 'running' AND completed_at IS NULL)
    OR (status IN ('completed', 'failed') AND completed_at IS NOT NULL)
  )
);

CREATE TABLE opportunity_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id TEXT NOT NULL REFERENCES opportunity_providers(id),
  source_listing_id TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  source_payload JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL,
  retained_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider_id, source_listing_id, payload_hash)
);

CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id TEXT NOT NULL REFERENCES opportunity_providers(id),
  source_listing_id TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('approved_api', 'approved_feed', 'employer_submission')),
  source_name TEXT NOT NULL CHECK (length(trim(source_name)) > 0),
  source_url TEXT NOT NULL CHECK (source_url ~ '^https://'),
  title TEXT NOT NULL CHECK (length(trim(title)) > 0),
  organization_name TEXT NOT NULL CHECK (length(trim(organization_name)) > 0),
  opportunity_type TEXT NOT NULL CHECK (
    opportunity_type IN (
      'internship',
      'entry_level',
      'apprenticeship',
      'fellowship',
      'volunteer',
      'contract'
    )
  ),
  work_mode TEXT NOT NULL CHECK (work_mode IN ('remote', 'hybrid', 'onsite')),
  locations JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT NOT NULL CHECK (length(trim(summary)) > 0),
  application_url TEXT NOT NULL CHECK (application_url ~ '^https://'),
  published_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ NOT NULL,
  verified_employer BOOLEAN NOT NULL DEFAULT FALSE,
  lifecycle TEXT NOT NULL DEFAULT 'pending_review' CHECK (
    lifecycle IN ('pending_review', 'active', 'expired', 'withdrawn', 'rejected')
  ),
  moderation TEXT NOT NULL DEFAULT 'unreviewed' CHECK (
    moderation IN ('unreviewed', 'approved', 'flagged')
  ),
  current_snapshot_id UUID NOT NULL REFERENCES opportunity_snapshots(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider_id, source_listing_id),
  CHECK (expires_at IS NULL OR expires_at > published_at)
);

CREATE TABLE opportunity_moderation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id),
  actor_id TEXT NOT NULL,
  previous_state TEXT,
  next_state TEXT NOT NULL CHECK (next_state IN ('unreviewed', 'approved', 'flagged')),
  reason TEXT NOT NULL CHECK (length(trim(reason)) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE opportunity_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id),
  reporter_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('fraud', 'unsafe', 'misleading', 'expired', 'rights', 'other')
  ),
  details TEXT NOT NULL CHECK (length(trim(details)) > 0),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE opportunity_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id),
  provider_id TEXT REFERENCES opportunity_providers(id),
  actor_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'provider_enabled',
      'provider_disabled',
      'listing_ingested',
      'listing_updated',
      'listing_expired',
      'listing_withdrawn',
      'listing_rejected',
      'listing_reported',
      'moderation_changed'
    )
  ),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (opportunity_id IS NOT NULL OR provider_id IS NOT NULL)
);

CREATE INDEX opportunity_snapshots_retention_idx
  ON opportunity_snapshots (retained_until);

CREATE INDEX opportunities_active_search_idx
  ON opportunities (updated_at DESC)
  WHERE lifecycle = 'active' AND moderation = 'approved';

CREATE INDEX opportunity_reports_open_idx
  ON opportunity_reports (created_at)
  WHERE status IN ('open', 'investigating');

CREATE INDEX opportunity_audit_opportunity_idx
  ON opportunity_audit_events (opportunity_id, created_at DESC);
