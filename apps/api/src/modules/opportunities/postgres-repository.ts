import type {
  OpportunityIngestionRecord,
  OpportunityLifecycle,
  OpportunityModerationState,
} from '@secloudive/contracts';
import type {
  IngestionAttempt,
  OpportunityRepository,
  OpportunitySnapshot,
  StoredOpportunity,
} from './repository.js';

export type SqlExecutor = {
  query<T extends object>(
    text: string,
    values: readonly unknown[],
  ): Promise<{ rows: readonly T[] }>;
};

type OpportunityRow = {
  id: string;
  provider_id: string;
  source_listing_id: string;
  source_type: OpportunityIngestionRecord['opportunity']['sourceType'];
  source_name: string;
  source_url: string;
  title: string;
  organization_name: string;
  opportunity_type: OpportunityIngestionRecord['opportunity']['type'];
  work_mode: OpportunityIngestionRecord['opportunity']['workMode'];
  locations: unknown;
  skills: unknown;
  summary: string;
  application_url: string;
  published_at: string;
  expires_at: string | null;
  last_verified_at: string;
  verified_employer: boolean;
  lifecycle: OpportunityLifecycle;
  moderation: OpportunityModerationState;
  current_snapshot_id: string;
  created_at: string;
  updated_at: string;
};

function asStringArray(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new Error(`Database returned invalid ${field}`);
  }
  return value;
}

function mapOpportunity(row: OpportunityRow): StoredOpportunity {
  const record: OpportunityIngestionRecord = {
    providerId: row.provider_id,
    sourceListingId: row.source_listing_id,
    sourceUrl: row.source_url,
    fetchedAt: row.updated_at,
    payloadHash: `database:${row.current_snapshot_id}`,
    opportunity: {
      title: row.title,
      organizationName: row.organization_name,
      type: row.opportunity_type,
      workMode: row.work_mode,
      locations: asStringArray(row.locations, 'locations'),
      skills: asStringArray(row.skills, 'skills'),
      summary: row.summary,
      applicationUrl: row.application_url,
      sourceType: row.source_type,
      sourceName: row.source_name,
      sourceListingId: row.source_listing_id,
      publishedAt: row.published_at,
      ...(row.expires_at ? { expiresAt: row.expires_at } : {}),
      lastVerifiedAt: row.last_verified_at,
      verifiedEmployer: row.verified_employer,
    },
  };

  return {
    id: row.id,
    identity: `${row.provider_id}:${row.source_listing_id}`,
    record,
    lifecycle: row.lifecycle,
    moderation: row.moderation,
    currentSnapshotId: row.current_snapshot_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class PostgresOpportunityRepository implements OpportunityRepository {
  public constructor(private readonly database: SqlExecutor) {}

  async saveSnapshot(snapshot: OpportunitySnapshot): Promise<void> {
    let sourcePayload: unknown;
    try {
      sourcePayload = JSON.parse(snapshot.sourcePayload);
    } catch {
      throw new Error(`Snapshot ${snapshot.id} sourcePayload must be valid JSON`);
    }

    await this.database.query(
      `INSERT INTO opportunity_snapshots
        (id, provider_id, source_listing_id, payload_hash, source_payload, fetched_at, retained_until)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
       ON CONFLICT (provider_id, source_listing_id, payload_hash) DO NOTHING`,
      [
        snapshot.id,
        snapshot.providerId,
        snapshot.sourceListingId,
        snapshot.payloadHash,
        JSON.stringify(sourcePayload),
        snapshot.fetchedAt,
        snapshot.retainedUntil,
      ],
    );
  }

  async findByIdentity(identity: string): Promise<StoredOpportunity | undefined> {
    const separator = identity.indexOf(':');
    if (separator <= 0 || separator === identity.length - 1) {
      throw new Error('Opportunity identity must contain provider and source listing IDs separated by a colon');
    }
    const providerId = identity.slice(0, separator);
    if (providerId.includes(':')) {
      throw new Error('Opportunity identity providerId must not contain a colon');
    }
    const sourceListingId = identity.slice(separator + 1);
    const result = await this.database.query<OpportunityRow>(
      `SELECT * FROM opportunities
       WHERE provider_id = $1 AND source_listing_id = $2`,
      [providerId, sourceListingId],
    );
    const row = result.rows[0];
    return row ? mapOpportunity(row) : undefined;
  }

  async saveOpportunity(opportunity: StoredOpportunity): Promise<void> {
    const { record } = opportunity;
    const item = record.opportunity;
    await this.database.query(
      `INSERT INTO opportunities
        (id, provider_id, source_listing_id, source_type, source_name, source_url, title,
         organization_name, opportunity_type, work_mode, locations, skills, summary,
         application_url, published_at, expires_at, last_verified_at, verified_employer,
         lifecycle, moderation, current_snapshot_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12::jsonb,
               $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
       ON CONFLICT (provider_id, source_listing_id) DO UPDATE SET
         source_type = EXCLUDED.source_type,
         source_name = EXCLUDED.source_name,
         source_url = EXCLUDED.source_url,
         title = EXCLUDED.title,
         organization_name = EXCLUDED.organization_name,
         opportunity_type = EXCLUDED.opportunity_type,
         work_mode = EXCLUDED.work_mode,
         locations = EXCLUDED.locations,
         skills = EXCLUDED.skills,
         summary = EXCLUDED.summary,
         application_url = EXCLUDED.application_url,
         published_at = EXCLUDED.published_at,
         expires_at = EXCLUDED.expires_at,
         last_verified_at = EXCLUDED.last_verified_at,
         verified_employer = EXCLUDED.verified_employer,
         current_snapshot_id = EXCLUDED.current_snapshot_id,
         updated_at = EXCLUDED.updated_at`,
      [
        opportunity.id,
        record.providerId,
        record.sourceListingId,
        item.sourceType,
        item.sourceName,
        record.sourceUrl,
        item.title,
        item.organizationName,
        item.type,
        item.workMode,
        JSON.stringify(item.locations),
        JSON.stringify(item.skills),
        item.summary,
        item.applicationUrl,
        item.publishedAt,
        item.expiresAt ?? null,
        item.lastVerifiedAt,
        item.verifiedEmployer,
        opportunity.lifecycle,
        opportunity.moderation,
        opportunity.currentSnapshotId,
        opportunity.createdAt,
        opportunity.updatedAt,
      ],
    );
  }

  async saveIngestionAttempt(attempt: IngestionAttempt): Promise<void> {
    await this.database.query(
      `INSERT INTO opportunity_ingestion_attempts
        (id, provider_id, started_at, completed_at, status, accepted_count, rejected_count, error_message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         completed_at = EXCLUDED.completed_at,
         status = EXCLUDED.status,
         accepted_count = EXCLUDED.accepted_count,
         rejected_count = EXCLUDED.rejected_count,
         error_message = EXCLUDED.error_message`,
      [
        attempt.id,
        attempt.providerId,
        attempt.startedAt,
        attempt.completedAt ?? null,
        attempt.status,
        attempt.acceptedCount,
        attempt.rejectedCount,
        attempt.errorMessage ?? null,
      ],
    );
  }
}
