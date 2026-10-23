# SeCloudive Execution Governance

## Role

All implementation work is governed as if performed by a Principal Architect, Senior Security Auditor, Database Administrator, DevOps Engineer, QA Lead, Migration Lead, and Technical Product Owner.

The objective is safe, measurable improvement without breaking existing functionality, routes, content, identity, or learner progress.

## Mandatory change protocol

Before changing code:

1. Audit the existing file and related references.
2. Explain current behavior.
3. Define the proposed behavior.
4. Identify dependencies and affected surfaces.
5. Classify risk: LOW, MEDIUM, HIGH, or CRITICAL.
6. Create a rollback strategy.

For every implementation, record:

- Current state
- Proposed state
- Affected components and routes
- Affected data models
- Security impact
- Performance impact
- Accessibility impact
- Migration requirements
- Validation evidence
- Rollback strategy

## File and route safety

Never delete a file or content source immediately. Mark deprecated, create a replacement if needed, migrate references, verify usage, and remove only after validation.

Never remove a route without a redirect table and deep-link test. Preserve legacy mappings such as:

| Legacy route | Canonical destination |
|---|---|
| `/academy` | `/learn` |
| `/learning-center` | `/learn` |
| `/labs` | `/practice` |

The current repository's route aliases must be inventoried before consolidation. No learning module, room, lab, quiz, case study, project, investigation, battle room, threat hunt, PDF, or learning asset may be deleted during reorganization.

## Database safety

Every schema change requires:

1. Current schema snapshot
2. Target schema
3. Versioned forward migration
4. Tested rollback migration
5. Validation queries
6. Data-integrity verification
7. Backward-compatibility assessment
8. RLS and index review

No production database change is complete without zero-loss evidence.

## Security gates

Every feature requires authentication, authorization, secret-management, input-validation, output-encoding, RLS, API, and OWASP review.

Provider keys, service keys, JWT secrets, admin tokens, and database credentials must never appear in React code, browser bundles, client routes, public repositories, localStorage, or sessionStorage. They belong in Supabase Secrets, server environment variables, or Edge Function secrets.

## AI governance

NAEN AI changes must assess prompt injection, jailbreaks, quota abuse, cost abuse, repeated requests, spam, 429 behavior, context leakage, and data leakage. Implement authentication, request filtering, rate limiting, safe context boundaries, retries with backoff, key rotation, structured logging, and progressive hints.

## Performance and accessibility gates

Target FCP under 2 seconds, LCP under 3 seconds, minimized initial bundles, route code splitting, lazy loading, efficient queries, and stable layouts.

Every UI change must support keyboard navigation, screen readers, ARIA labels, reduced motion, focus management, visible focus, and WCAG 2.2 AA contrast.

## Testing gate

A phase cannot be marked complete until applicable unit, integration, security, regression, route, RLS, admin, AI-proxy, performance, and accessibility tests pass with evidence.

## Deployment gate

1. Local validation
2. Staging deployment
3. Security audit
4. Performance audit
5. User acceptance testing
6. Production release
7. Post-release monitoring

Never deploy directly to production.

## Definition of done

No critical vulnerabilities, no exposed secrets, verified RLS, secure admin authorization, working public catalog, unified Learn and Practice journeys, operational notes, AI, analytics, CI/CD, and monitoring are required before production readiness is claimed.

