# Security Audit

This document summarizes security posture from the current implementation.
The prior focused findings and completed fixes are in
[SECURITY_RELIABILITY_AUDIT.md](./SECURITY_RELIABILITY_AUDIT.md).

## Controls present

- Supabase RLS policies for user-owned records.
- Supabase session persistence and local guest isolation.
- Google, email, magic-link, and local profile flows.
- FastAPI JWT issuance/verification.
- PBKDF2 password hashing and fail-closed JWT configuration.
- Input models in FastAPI and client-side validation in profile/learning flows.
- Error boundaries, guardrails, simulated-event notices, and audit exports.
- Ignored environment/credential files.

## Confirmed gaps

| Priority | Gap | Impact |
|---|---|---|
| P0 | Admin authorization is client-side | Unauthorized admin actions cannot be trusted |
| P0 | AI/audit/feed endpoints are not uniformly authenticated | Data exposure and abuse risk |
| P0 | Wildcard CORS | Unrestricted browser origins |
| P1 | Multiple independent identity systems | Incorrect ownership/session decisions |
| P1 | User AI keys handled client-side/settings | Credential exposure risk |
| P1 | Direct progress upsert fallback | Can bypass RPC validation/atomicity |
| P2 | CSP/security headers not clearly configured | Browser defense-in-depth incomplete |
| P2 | No durable threat/audit operations workflow | Weak incident accountability |

## Production security plan

1. Select one authoritative identity and token propagation model.
2. Add a shared FastAPI authorization dependency with role/tenant checks.
3. Replace wildcard CORS with configured environment allow-lists.
4. Move user-provided AI credentials to a server-side secret mechanism or
   remove custom-key support.
5. Add rate limits, request IDs, structured audit events, and retention rules.
6. Add CSP, HSTS, secure cookies, and security headers at the hosting edge.
7. Add dependency, secret, SAST, and DAST checks to CI.

No real cloud resources or credentials were used for this audit.
