# SeCloudive Technical Debt Register

## P0 — resolve before enterprise exposure

| Debt | Evidence | Consequence | Remediation |
|---|---|---|---|
| Client-only admin authorization | `AdminGuard.jsx` | Admin controls are not trustworthy | Server-side RBAC/ABAC and audited admin APIs |
| Broad CORS/unprotected backend surfaces | `server/agent_engine.py` | Browser/API abuse and data exposure | Allow-list CORS and shared auth dependency |
| Fragmented identity | `AuthContext`, `userSyncManager`, FastAPI JWT | Wrong ownership/session semantics | Select one authoritative identity model |

## P1 — resolve before scale

| Debt | Consequence | Remediation |
|---|---|---|
| Two schema sources | Migration drift and deployment ambiguity | Canonical migration source plus CI parity check |
| Progress blob/scalar duplication | Counter and learner-state divergence | Versioned server schema and derived counters |
| Direct progress upsert fallback | Weaker validation/atomicity | Explicit failure state or safe server fallback |
| Undefined live-feed endpoint references | Broken live features | Typed API contract and endpoint integration tests |
| In-memory backend users/audits/metrics | Restart data loss and no horizontal scaling | Durable database/event store |
| Client-side AI key storage | Credential exposure | Server-side secret management or remove feature |

## P2 — resolve before broad product expansion

| Debt | Consequence | Remediation |
|---|---|---|
| Route aliases and no 404 | Navigation and analytics ambiguity | Canonical routes and route metadata |
| No formal design system | Inconsistent UI and accessibility regressions | Tokens and reusable primitives |
| No durable analytics events | Weak product and learning measurement | Consent-aware event pipeline |
| Simulation/live distinction varies by surface | Learner misunderstanding | Shared state/label contract |
| Uneven curriculum schema | Inconsistent learning outcomes | Lesson contract and content QA |
| Missing production observability | Slow incident diagnosis | Logs, metrics, traces, SLOs |

## Debt management rules

- Every new integration must have an owner, contract, failure mode, and test.
- Do not add a duplicate route/component/service when an existing surface can
  be extended.
- Do not call simulated behavior “live” or “production”.
- Do not provision real cloud resources without an approved sandbox design.
- Re-run build, supported tests, and security checks for every P0/P1 change.
