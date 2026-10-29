import { describe, expect, it } from 'vitest';
import type { OpportunityIngestionRecord } from '@secloudive/contracts';
import { PostgresOpportunityRepository, type SqlExecutor } from './postgres-repository.js';
import type { StoredOpportunity } from './repository.js';

const record: OpportunityIngestionRecord = {
  providerId: 'approved-provider',
  sourceListingId: 'listing-123',
  sourceUrl: 'https://provider.example/listing-123',
  fetchedAt: '2026-10-26T17:00:00.000Z',
  payloadHash: 'sha256:example',
  opportunity: {
    title: 'Cloud security intern',
    organizationName: 'Example Security',
    type: 'internship',
    workMode: 'remote',
    locations: ['Global'],
    skills: ['Linux'],
    summary: 'Learn with a supervised security team.',
    applicationUrl: 'https://example.test/apply',
    sourceType: 'approved_api',
    sourceName: 'Approved provider',
    sourceListingId: 'listing-123',
    publishedAt: '2026-10-20T17:00:00.000Z',
    lastVerifiedAt: '2026-10-26T17:00:00.000Z',
    verifiedEmployer: true,
  },
};

function storedOpportunity(): StoredOpportunity {
  return {
    id: 'opportunity-123',
    identity: 'approved-provider:listing-123',
    record,
    lifecycle: 'pending_review',
    moderation: 'unreviewed',
    currentSnapshotId: 'snapshot-123',
    createdAt: '2026-10-26T17:00:00.000Z',
    updatedAt: '2026-10-26T17:00:00.000Z',
  };
}

describe('Postgres opportunity repository', () => {
  it('uses parameterized SQL for snapshots and opportunities', async () => {
    const calls: { text: string; values: readonly unknown[] }[] = [];
    const database: SqlExecutor = {
      query: async <T extends object>(text: string, values: readonly unknown[]) => {
        calls.push({ text, values });
        return { rows: [] as readonly T[] };
      },
    };
    const repository = new PostgresOpportunityRepository(database);

    await repository.saveSnapshot({
      id: 'snapshot-123',
      identity: 'approved-provider:listing-123',
      providerId: record.providerId,
      sourceListingId: record.sourceListingId,
      fetchedAt: record.fetchedAt,
      payloadHash: record.payloadHash,
      sourcePayload: '{"title":"safe"}',
      retainedUntil: '2027-01-24T17:00:00.000Z',
    });
    await repository.saveOpportunity(storedOpportunity());

    expect(calls).toHaveLength(2);
    expect(calls.every(({ text }) => text.includes('$1'))).toBe(true);
    expect(calls[0]?.text).not.toContain('{"title":"safe"}');
    expect(calls[0]?.values).toContain('{"title":"safe"}');
  });

  it('rejects invalid snapshot JSON explicitly', async () => {
    const database: SqlExecutor = {
      query: async () => ({ rows: [] }),
    };
    const repository = new PostgresOpportunityRepository(database);

    await expect(
      repository.saveSnapshot({
        id: 'snapshot-123',
        identity: 'approved-provider:listing-123',
        providerId: record.providerId,
        sourceListingId: record.sourceListingId,
        fetchedAt: record.fetchedAt,
        payloadHash: record.payloadHash,
        sourcePayload: 'not-json',
        retainedUntil: '2027-01-24T17:00:00.000Z',
      }),
    ).rejects.toThrow('Snapshot snapshot-123 sourcePayload must be valid JSON');
  });
});
