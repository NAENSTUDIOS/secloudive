# SeCloudive Architecture

This is the implementation-level architecture summary. The complete evidence
inventory is in [CODEBASE_AUDIT.md](./CODEBASE_AUDIT.md), and the feature
inventory is in [PRODUCT_MASTER_MAP.md](./PRODUCT_MASTER_MAP.md).

## Current topology

```text
Browser
  └─ React 19 + Vite 8
      ├─ App shell / onboarding / global boundaries
      ├─ React Router 7 route modules
      ├─ ChallengeContext (learning and product state)
      ├─ AuthContext (Supabase/local identity state)
      ├─ localStorage profile/progress fallback
      ├─ optional Supabase client and RPCs
      └─ optional FastAPI intelligence service
            ├─ AI streaming/evaluation
            ├─ feeds and audit endpoints
            └─ separate JWT authentication
```

## Boundaries

- `src/pages/` owns route-level composition.
- `src/components/` owns reusable UI and simulation surfaces.
- `src/data/` owns local learning and scenario content.
- `src/services/` owns external integrations and persistence adapters.
- `src/context/` owns cross-route state.
- `server/` is an optional separately started Python service.
- `supabase/migrations/` is the deployed database source of record unless a
  migration process explicitly says otherwise.

## Architectural decisions

1. Preserve the investigation-first local learning experience.
2. Treat simulated cloud events as educational data, never as real AWS state.
3. Make one identity provider authoritative before adding organization tenancy.
4. Keep cloud persistence optional for offline learning, but make sync failures
   visible rather than silently successful.
5. Add production capabilities incrementally behind explicit contracts.

## Target evolution

- A single API base URL and typed request/response contract.
- Supabase Auth (or one selected provider) as the authoritative identity.
- Server-authoritative RBAC/ABAC for admin and organization operations.
- Versioned progress events/blob migrations.
- Durable audit and analytics event storage.
- Isolated, quota-controlled cloud labs only after the security boundary exists.

## Non-goals

Do not replace the existing route/page system, create duplicate learning
systems, or provision real cloud resources as part of documentation work.
