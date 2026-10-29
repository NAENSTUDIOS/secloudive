# Jobs and internships portal

## Product boundary

The opportunities portal helps learners discover security-related internships,
entry-level roles, apprenticeships, fellowships, volunteer experience, and
contract work. The initial geography is remote/global with location filtering.

The portal is not an employer-of-record, recruiter, application processor, or
guarantee of employment. Secloudive links learners to the original application
destination and does not collect application passwords.

## Ingestion policy

Listings may enter the platform only through:

- provider APIs with permission to display the listing;
- compatible RSS or structured feeds;
- employer-owned career feeds; or
- verified employer submissions.

Unlicensed scraping of protected job boards is out of scope. Each normalized
listing must retain its source name, source listing ID, original application
URL, publication timestamp, last verification timestamp, and optional expiry
timestamp. Expired, withdrawn, or unverifiable listings must stop appearing in
active search results.

Ingestion will run through provider adapters and an asynchronous normalization
pipeline. The pipeline must deduplicate by provider and source listing ID,
validate required fields, record ingestion errors, and preserve the original
source payload for audit and troubleshooting according to retention policy.

## Trust and safety

Employer submissions require identity verification, contact verification,
moderation, terms acceptance, and an abuse-report path. Verification is not a
promise that an opportunity is suitable or that an employer is risk-free.

Learners must be able to report suspicious listings. The system must support
withdrawal, takedown, audit history, and re-review without silently deleting
the evidence needed to investigate abuse.

Secloudive must never charge a learner to apply, request an application
password, or expose private learner notes or progress to an employer.

## Privacy and matching

Search, saved opportunities, and the private application tracker belong to the
learner. Matching is opt-in and uses only explicitly shareable skills and
evidence. Private notes, diagnostic answers, AI conversations, and unrelated
learning activity are excluded by default.

Employer access to candidate signals requires a separate, revocable consent
record with a clear scope and expiry. The default profile visibility is
private.

## Delivery phases

1. Define and test the shared opportunity contract and learner privacy controls.
2. Build the portal UI with an explicit no-live-data state.
3. Implement one approved provider adapter in a staging environment.
4. Add normalization, deduplication, expiry, moderation, reports, and audit
   events.
5. Add verified employer submissions.
6. Add saved opportunities, alerts, private application tracking, and opt-in
   evidence matching.

## Normalization invariants

The shared contract rejects a record unless it has a provider-scoped source
identity, HTTPS source and application URLs, a stable payload hash, an
organization, a title, a summary, and valid publication and verification
timestamps. An expiry timestamp must be in the future when a record enters the
active pipeline.

The provider-scoped identity is `(providerId, sourceListingId)`. A matching
identity updates the existing listing rather than creating a duplicate. A
changed payload is retained as a new ingestion snapshot so corrections and
withdrawals remain auditable.

Raw provider payloads are stored as immutable snapshots with a payload hash,
fetch time, source identity, and explicit retention deadline. The normalized
listing points to the current snapshot; replacing a listing never destroys
previous snapshots. Snapshot retention must be configured by policy and
enforced by a deletion job after the retention deadline. Secrets, access
tokens, and unrelated provider data must never be copied into a snapshot.

The persistence interface is intentionally independent of PostgreSQL or any
other database. Database migrations must preserve the same uniqueness,
immutability, retention, and audit invariants.

The lifecycle is separate from moderation: a listing can be pending review,
active, expired, withdrawn, or rejected, while moderation records whether it is
unreviewed, approved, or flagged. Only active and approved listings may appear
in learner search results.

Search also applies a configurable verification freshness window. The shared
contract defaults to seven days, but the production policy must configure this
per provider or risk tier and document the choice. A listing with a future
verification timestamp, an invalid timestamp, or an expired `expiresAt` value
is never searchable. The same predicate must be used by API result queries,
cache invalidation, and any precomputed search index.

No live listing should be represented in the UI until the provider, rights,
freshness, and moderation checks are operational.

## Relational persistence

The first PostgreSQL migration is
`database/migrations/0001_opportunities.sql`. It separates provider
configuration, ingestion attempts, immutable source snapshots, normalized
opportunities, moderation events, learner reports, and operational audit
events.

The database enforces provider/source uniqueness, HTTPS URLs, supported
opportunity categories and work modes, valid lifecycle and moderation values,
non-negative ingestion counts, and snapshot retention metadata. A partial
index covers only active and approved listings. The application must still
apply the same predicate in every learner search query.

Learner applications, candidate profiles, and employer access to learning
evidence are deliberately not part of this first migration. They require
separate consent, authorization, retention, export, deletion, and audit
design.
