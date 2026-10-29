import { describe, expect, it, vi } from 'vitest';
import type { OpportunityIngestionRecord, OpportunityProvider } from '@secloudive/contracts';
import { ingestProvider } from './ingestion.js';

const provider: OpportunityProvider = {
  id: 'approved-provider',
  name: 'Approved provider',
  type: 'approved_api',
  termsUrl: 'https://provider.example/terms',
  displayPermissionConfirmedAt: '2026-10-01T00:00:00.000Z',
  enabled: true,
};

const record: OpportunityIngestionRecord = {
  providerId: provider.id,
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
    sourceName: provider.name,
    sourceListingId: 'listing-123',
    publishedAt: '2026-10-20T17:00:00.000Z',
    lastVerifiedAt: '2026-10-26T17:00:00.000Z',
    verifiedEmployer: true,
  },
};

describe('opportunity provider ingestion', () => {
  it('accepts valid normalized records and reports invalid records', async () => {
    const result = await ingestProvider({
      provider,
      fetch: vi.fn().mockResolvedValue({
        fetchedAt: '2026-10-26T17:00:00.000Z',
        payload: { listings: 2 },
      }),
      normalize: () => [
        record,
        {
          ...record,
          sourceListingId: 'invalid',
          sourceUrl: 'http://provider.example/invalid',
          opportunity: {
            ...record.opportunity,
            sourceListingId: 'invalid',
            applicationUrl: 'http://example.test/apply',
            title: '',
          },
        },
      ],
    });

    expect(result.accepted).toHaveLength(1);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]?.errors).toEqual([
      'sourceUrl must use HTTPS',
      'title is required',
      'applicationUrl must use HTTPS',
    ]);
  });

  it('fails explicitly when a provider is disabled', async () => {
    await expect(
      ingestProvider({
        provider: { ...provider, enabled: false },
        fetch: vi.fn(),
        normalize: () => [],
      }),
    ).rejects.toThrow('Opportunity provider is disabled: approved-provider');
  });
});
