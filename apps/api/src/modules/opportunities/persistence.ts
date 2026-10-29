import { getOpportunityIdentity, type OpportunityIngestionRecord } from '@secloudive/contracts';
import {
  createSnapshot,
  type IngestionAttempt,
  type OpportunityRepository,
  type StoredOpportunity,
} from './repository.js';

export type PersistAcceptedInput = {
  record: OpportunityIngestionRecord;
  sourcePayload: string;
  now: Date;
  snapshotId: string;
  opportunityId: string;
  retentionDays: number;
};

export async function persistAcceptedOpportunity(
  repository: OpportunityRepository,
  input: PersistAcceptedInput,
): Promise<StoredOpportunity> {
  const identity = getOpportunityIdentity(input.record);
  const existing = await repository.findByIdentity(identity);
  const snapshot = createSnapshot(
    input.record,
    input.sourcePayload,
    input.now,
    input.retentionDays,
    input.snapshotId,
  );
  await repository.saveSnapshot(snapshot);

  const opportunity: StoredOpportunity = {
    id: existing?.id ?? input.opportunityId,
    identity,
    record: input.record,
    lifecycle: existing?.lifecycle ?? 'pending_review',
    moderation: existing?.moderation ?? 'unreviewed',
    currentSnapshotId: snapshot.id,
    createdAt: existing?.createdAt ?? input.now.toISOString(),
    updatedAt: input.now.toISOString(),
  };
  await repository.saveOpportunity(opportunity);
  return opportunity;
}

export async function completeIngestionAttempt(
  repository: OpportunityRepository,
  attempt: IngestionAttempt,
): Promise<void> {
  if (attempt.status === 'running') {
    throw new Error('Cannot complete an ingestion attempt with running status');
  }
  await repository.saveIngestionAttempt(attempt);
}
