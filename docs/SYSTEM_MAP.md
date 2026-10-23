# SeCloudive System Map

## Runtime map

| System | Current implementation | Contract status |
|---|---|---|
| Web application | React/Vite in `src/` | Working build |
| Routing | `src/routes/AppRoutes.jsx` | Working, alias-heavy |
| Learner state | `ChallengeContext` + local profile storage | Working offline |
| Identity | `AuthContext`, Supabase, local profiles, Google, FastAPI JWT | Fragmented |
| Cloud persistence | Supabase tables/RPCs/RLS | Optional and environment-dependent |
| AI service | Local fallback plus optional FastAPI/Gemini | Partial |
| Live feeds | Vite proxy, feed services, external URLs | Partial/drift-prone |
| Deployment | Amplify frontend configuration | Backend contract incomplete |

## Data flows

### Learner progress

`UI action -> ChallengeContext -> local profile progress -> debounced Supabase
save when configured`.

Hydration is cloud-aware and preserves meaningful local progress. Conflict
resolution and progress schema versioning remain future work.

### Authentication

`Supabase session or local/Google flow -> AuthContext -> profile + progress`.

The FastAPI JWT flow is separate and must not be treated as equivalent to the
Supabase session until a unified contract is implemented.

### AI

`UI/service -> local grounded fallback or optional FastAPI/Gemini -> streamed
or structured response`.

AI endpoints currently need a uniform authorization and audit policy.

## Failure modes

- Supabase unavailable: local mode continues; cloud sync is unavailable.
- FastAPI unavailable: local AI/fallback behavior may continue.
- Feed unavailable: live content is incomplete.
- Persistence failure: must be surfaced explicitly in future reliability work.

## Ownership map

| Concern | Primary code |
|---|---|
| Routes | `src/routes/AppRoutes.jsx` |
| Progress | `src/context/ChallengeContext.jsx` |
| Auth | `src/context/AuthContext.jsx` |
| Local identity | `src/services/userSyncManager.js` |
| Supabase | `src/lib/supabase.js`, `src/services/supabaseProgressService.js` |
| Backend | `server/agent_engine.py`, `server/auth.py` |
| Schema | `supabase/migrations/` |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for design direction.
