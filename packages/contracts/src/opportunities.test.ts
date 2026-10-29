import { describe, expect, it } from 'vitest';
import {
  getOpportunityIdentity,
  isOpportunitySearchable,
  validateOpportunityRecord,
  type OpportunityIngestionRecord,
} from './index.js';

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

describe('opportunity ingestion contracts', () => {
  it('creates a stable provider-scoped identity', () => {
    expect(getOpportunityIdentity(record)).toBe('approved-provider:listing-123');
  });

  it('accepts a complete source-backed record', () => {
    expect(validateOpportunityRecord(record)).toEqual({ valid: true });
  });

  it('rejects insecure or incomplete records', () => {
    const result = validateOpportunityRecord({
      ...record,
      sourceUrl: 'http://provider.example/listing-123',
      opportunity: {
        ...record.opportunity,
        applicationUrl: 'http://example.test/apply',
        title: '',
      },
    });

    expect(result).toEqual({
      valid: false,
      errors: ['sourceUrl must use HTTPS', 'title is required', 'applicationUrl must use HTTPS'],
    });
  });

  it('only exposes active, approved, fresh, and unexpired opportunities', () => {
    const searchable = {
      ...record.opportunity,
      id: 'opportunity-123',
      lifecycle: 'active' as const,
      moderation: 'approved' as const,
      expiresAt: '2026-11-01T00:00:00.000Z',
    };
    const now = new Date('2026-10-26T17:00:00.000Z');

    expect(isOpportunitySearchable(searchable, now)).toBe(true);
    expect(isOpportunitySearchable({ ...searchable, moderation: 'flagged' }, now)).toBe(false);
    expect(
      isOpportunitySearchable({ ...searchable, lastVerifiedAt: '2026-10-01T00:00:00.000Z' }, now),
    ).toBe(false);
    expect(
      isOpportunitySearchable({ ...searchable, expiresAt: '2026-10-25T00:00:00.000Z' }, now),
    ).toBe(false);
  });

  it('rejects an invalid freshness policy', () => {
    expect(() =>
      isOpportunitySearchable(
        {
          ...record.opportunity,
          id: 'opportunity-123',
          lifecycle: 'active',
          moderation: 'approved',
        },
        new Date(),
        0,
      ),
    ).toThrow('maxVerificationAgeMs must be a positive number');
  });
});
