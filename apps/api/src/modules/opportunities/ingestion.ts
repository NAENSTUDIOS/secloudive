import {
  validateOpportunityRecord,
  type OpportunityIngestionRecord,
  type OpportunityProvider,
} from '@secloudive/contracts';

export type ProviderFetchResult<TPayload> = {
  fetchedAt: string;
  payload: TPayload;
};

export type OpportunityProviderAdapter<TPayload> = {
  provider: OpportunityProvider;
  fetch: () => Promise<ProviderFetchResult<TPayload>>;
  normalize: (
    payload: TPayload,
    context: { fetchedAt: string; provider: OpportunityProvider },
  ) => readonly OpportunityIngestionRecord[];
};

export type IngestionResult = {
  accepted: readonly OpportunityIngestionRecord[];
  rejected: readonly {
    record: OpportunityIngestionRecord;
    errors: readonly string[];
  }[];
};

export async function ingestProvider<TPayload>(
  adapter: OpportunityProviderAdapter<TPayload>,
  now = new Date(),
): Promise<IngestionResult> {
  if (!adapter.provider.enabled) {
    throw new Error(`Opportunity provider is disabled: ${adapter.provider.id}`);
  }

  const fetched = await adapter.fetch();
  const records = adapter.normalize(fetched.payload, {
    fetchedAt: fetched.fetchedAt,
    provider: adapter.provider,
  });
  const accepted: OpportunityIngestionRecord[] = [];
  const rejected: IngestionResult['rejected'][number][] = [];

  for (const record of records) {
    const result = validateOpportunityRecord(record, now);
    if (result.valid) {
      accepted.push(record);
    } else {
      rejected.push({ record, errors: result.errors });
    }
  }

  return { accepted, rejected };
}
