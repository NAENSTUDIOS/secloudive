import {
  getOpportunityIdentity,
  type OpportunityIngestionRecord,
  type OpportunityLifecycle,
  type OpportunityModerationState,
} from '@secloudive/contracts';

export type OpportunitySnapshot = {
  id: string;
  identity: string;
  providerId: string;
  sourceListingId: string;
  fetchedAt: string;
  payloadHash: string;
  sourcePayload: string;
  retainedUntil: string;
};

export type StoredOpportunity = {
  id: string;
  identity: string;
  record: OpportunityIngestionRecord;
  lifecycle: OpportunityLifecycle;
  moderation: OpportunityModerationState;
  currentSnapshotId: string;
  createdAt: string;
  updatedAt: string;
};

export type IngestionAttempt = {
  id: string;
  providerId: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'failed';
  acceptedCount: number;
  rejectedCount: number;
  errorMessage?: string;
};

export interface OpportunityRepository {
  saveSnapshot(snapshot: OpportunitySnapshot): Promise<void>;
  findByIdentity(identity: string): Promise<StoredOpportunity | undefined>;
  saveOpportunity(opportunity: StoredOpportunity): Promise<void>;
  saveIngestionAttempt(attempt: IngestionAttempt): Promise<void>;
}

export class InMemoryOpportunityRepository implements OpportunityRepository {
  private readonly snapshots = new Map<string, OpportunitySnapshot>();
  private readonly opportunities = new Map<string, StoredOpportunity>();
  private readonly attempts = new Map<string, IngestionAttempt>();

  async saveSnapshot(snapshot: OpportunitySnapshot): Promise<void> {
    this.snapshots.set(snapshot.id, snapshot);
  }

  async findByIdentity(identity: string): Promise<StoredOpportunity | undefined> {
    return this.opportunities.get(identity);
  }

  async saveOpportunity(opportunity: StoredOpportunity): Promise<void> {
    this.opportunities.set(opportunity.identity, opportunity);
  }

  async saveIngestionAttempt(attempt: IngestionAttempt): Promise<void> {
    this.attempts.set(attempt.id, attempt);
  }

  snapshotCount(): number {
    return this.snapshots.size;
  }

  attemptCount(): number {
    return this.attempts.size;
  }
}

export function createSnapshot(
  record: OpportunityIngestionRecord,
  sourcePayload: string,
  now: Date,
  retentionDays: number,
  id: string,
): OpportunitySnapshot {
  if (!Number.isInteger(retentionDays) || retentionDays <= 0) {
    throw new Error('retentionDays must be a positive integer');
  }

  const retainedUntil = new Date(now);
  retainedUntil.setUTCDate(retainedUntil.getUTCDate() + retentionDays);

  return {
    id,
    identity: getOpportunityIdentity(record),
    providerId: record.providerId,
    sourceListingId: record.sourceListingId,
    fetchedAt: record.fetchedAt,
    payloadHash: record.payloadHash,
    sourcePayload,
    retainedUntil: retainedUntil.toISOString(),
  };
}
