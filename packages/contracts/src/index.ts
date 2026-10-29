export type HealthStatus = {
  service: string;
  status: 'ok' | 'degraded' | 'unavailable';
};

export type ProgressEvent = {
  id: string;
  type: string;
  actorId: string;
  occurredAt: string;
  idempotencyKey: string;
  schemaVersion: number;
};

export type AuthProvider = 'password' | 'google';

export type AuthIntent =
  'register' | 'login' | 'verify_email' | 'recover_account' | 'reset_password' | 'revoke_sessions';

export type ConsentType = 'terms' | 'privacy' | 'analytics' | 'marketing' | 'ai_memory';

export type ConsentRecord = {
  type: ConsentType;
  version: string;
  granted: boolean;
  recordedAt: string;
};

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed' | 'paused';

export type ExperienceLevel = 'beginner' | 'developing' | 'practitioner' | 'professional';

export type LearnerGoal =
  | 'learn_foundations'
  | 'career_change'
  | 'job_preparation'
  | 'current_role'
  | 'certification'
  | 'portfolio'
  | 'teaching';

export type TargetRole =
  | 'foundation_learner'
  | 'cloud_security_analyst'
  | 'soc_analyst'
  | 'iam_engineer'
  | 'cloud_security_engineer'
  | 'devsecops_engineer'
  | 'security_architect'
  | 'grc_specialist';

export type DiagnosticDomain =
  | 'computer_fundamentals'
  | 'linux'
  | 'networking'
  | 'git_github'
  | 'python'
  | 'docker'
  | 'ci_cd'
  | 'aws_fundamentals'
  | 'security_fundamentals';

export type DiagnosticResult = {
  domain: DiagnosticDomain;
  level: ExperienceLevel;
  evidenceRequired: boolean;
  version: string;
};

export type PrivacyPreferences = {
  analytics: boolean;
  marketing: boolean;
  aiMemory: boolean;
  streaks: boolean;
  instructorVisibility: 'private' | 'assigned_work';
  portfolioVisibility: 'private' | 'reviewers';
};

export type LearnerOnboarding = {
  status: OnboardingStatus;
  experienceLevel?: ExperienceLevel;
  primaryGoal?: LearnerGoal;
  targetRole?: TargetRole;
  diagnosticResults: readonly DiagnosticResult[];
  privacy: PrivacyPreferences;
  planVersion?: string;
};

export type OpportunityType =
  'internship' | 'entry_level' | 'apprenticeship' | 'fellowship' | 'volunteer' | 'contract';

export type OpportunityWorkMode = 'remote' | 'hybrid' | 'onsite';

export type OpportunitySourceType = 'approved_api' | 'approved_feed' | 'employer_submission';

export type OpportunityLifecycle =
  'pending_review' | 'active' | 'expired' | 'withdrawn' | 'rejected';

export type OpportunityModerationState = 'unreviewed' | 'approved' | 'flagged';

export type Opportunity = {
  id: string;
  title: string;
  organizationName: string;
  type: OpportunityType;
  workMode: OpportunityWorkMode;
  locations: readonly string[];
  skills: readonly string[];
  summary: string;
  applicationUrl: string;
  sourceType: OpportunitySourceType;
  sourceName: string;
  sourceListingId: string;
  lifecycle: OpportunityLifecycle;
  moderation: OpportunityModerationState;
  publishedAt: string;
  expiresAt?: string;
  lastVerifiedAt: string;
  verifiedEmployer: boolean;
};

export function isOpportunitySearchable(
  opportunity: Opportunity,
  now = new Date(),
  maxVerificationAgeMs = 1000 * 60 * 60 * 24 * 7,
): boolean {
  if (!Number.isFinite(maxVerificationAgeMs) || maxVerificationAgeMs <= 0) {
    throw new Error('maxVerificationAgeMs must be a positive number');
  }

  if (opportunity.lifecycle !== 'active' || opportunity.moderation !== 'approved') {
    return false;
  }

  const verifiedAt = Date.parse(opportunity.lastVerifiedAt);
  if (Number.isNaN(verifiedAt) || verifiedAt > now.getTime()) {
    return false;
  }

  if (now.getTime() - verifiedAt > maxVerificationAgeMs) {
    return false;
  }

  return !opportunity.expiresAt || Date.parse(opportunity.expiresAt) > now.getTime();
}

export type OpportunityProvider = {
  id: string;
  name: string;
  type: Exclude<OpportunitySourceType, 'employer_submission'>;
  termsUrl: string;
  displayPermissionConfirmedAt: string;
  enabled: boolean;
};

export type OpportunityIngestionRecord = {
  providerId: string;
  sourceListingId: string;
  sourceUrl: string;
  fetchedAt: string;
  payloadHash: string;
  opportunity: Omit<Opportunity, 'id' | 'lifecycle' | 'moderation'>;
};

export type OpportunityValidationResult =
  { valid: true } | { valid: false; errors: readonly string[] };

export type OpportunityPreferences = {
  types: readonly OpportunityType[];
  workModes: readonly OpportunityWorkMode[];
  locations: readonly string[];
  skills: readonly string[];
  alertFrequency: 'daily' | 'weekly' | 'off';
  profileMatching: boolean;
};

export function getOpportunityIdentity(
  record: Pick<OpportunityIngestionRecord, 'providerId' | 'sourceListingId'>,
): string {
  if (!record.providerId.trim() || record.providerId.includes(':')) {
    throw new Error('providerId must be non-empty and must not contain a colon');
  }
  return `${record.providerId}:${record.sourceListingId}`;
}

export function validateOpportunityRecord(
  record: OpportunityIngestionRecord,
  now = new Date(),
): OpportunityValidationResult {
  const errors: string[] = [];
  const opportunity = record.opportunity;

  if (!record.fetchedAt || Number.isNaN(Date.parse(record.fetchedAt))) {
    errors.push('fetchedAt must be an ISO date');
  }
  if (!record.providerId.trim()) errors.push('providerId is required');
  if (!record.sourceListingId.trim()) errors.push('sourceListingId is required');
  if (!record.sourceUrl.startsWith('https://')) errors.push('sourceUrl must use HTTPS');
  if (!record.payloadHash.trim()) errors.push('payloadHash is required');
  if (!opportunity.title.trim()) errors.push('title is required');
  if (!opportunity.organizationName.trim()) errors.push('organizationName is required');
  if (!opportunity.summary.trim()) errors.push('summary is required');
  if (!opportunity.applicationUrl.startsWith('https://')) {
    errors.push('applicationUrl must use HTTPS');
  }
  if (!opportunity.sourceName.trim()) errors.push('sourceName is required');
  if (!opportunity.publishedAt || Number.isNaN(Date.parse(opportunity.publishedAt))) {
    errors.push('publishedAt must be an ISO date');
  }
  if (!opportunity.lastVerifiedAt || Number.isNaN(Date.parse(opportunity.lastVerifiedAt))) {
    errors.push('lastVerifiedAt must be an ISO date');
  }
  if (opportunity.expiresAt && Number.isNaN(Date.parse(opportunity.expiresAt))) {
    errors.push('expiresAt must be an ISO date');
  }
  if (opportunity.expiresAt && Date.parse(opportunity.expiresAt) <= now.getTime()) {
    errors.push('expiresAt must be in the future');
  }

  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}
