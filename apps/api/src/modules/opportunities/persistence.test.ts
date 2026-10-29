import { describe, expect, it } from 'vitest';
import type { OpportunityIngestionRecord } from '@secloudive/contracts';
import { persistAcceptedOpportunity } from './persistence.js';
import { InMemoryOpportunityRepository } from './repository.js';

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

describe('opportunity persistence boundary', () => {
  it('stores a snapshot and upserts the same source identity', async () => {
    const repository = new InMemoryOpportunityRepository();
    const now = new Date('2026-10-26T17:00:00.000Z');

    const first = await persistAcceptedOpportunity(repository, {
      record,
      sourcePayload: '{"title":"first"}',
      now,
      snapshotId: 'snapshot-1',
      opportunityId: 'opportunity-1',
      retentionDays: 90,
    });
    const second = await persistAcceptedOpportunity(repository, {
      record: { ...record, payloadHash: 'sha256:updated' },
      sourcePayload: '{"title":"updated"}',
      now: new Date('2026-10-27T17:00:00.000Z'),
      snapshotId: 'snapshot-2',
      opportunityId: 'opportunity-2',
      retentionDays: 90,
    });

    expect(first.id).toBe('opportunity-1');
    expect(second.id).toBe('opportunity-1');
    expect(second.currentSnapshotId).toBe('snapshot-2');
    expect(repository.snapshotCount()).toBe(2);
  });

  it('rejects invalid retention configuration', async () => {
    await expect(
      persistAcceptedOpportunity(new InMemoryOpportunityRepository(), {
        record,
        sourcePayload: '{}',
        now: new Date('2026-10-26T17:00:00.000Z'),
        snapshotId: 'snapshot-1',
        opportunityId: 'opportunity-1',
        retentionDays: 0,
      }),
    ).rejects.toThrow('retentionDays must be a positive integer');
  });
});
