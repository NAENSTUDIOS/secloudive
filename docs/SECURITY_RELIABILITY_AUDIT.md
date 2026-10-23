# Security and Reliability Audit

## Scope

This focused audit covers the existing Vite/React learner application, the
optional FastAPI intelligence service, Supabase progress synchronization, and
the repository's supported build/test commands. It does not provision cloud
resources or assume that documented features are implemented.

## Baseline

- `npm run build` passed.
- `npm test` passed.
- The working tree was clean before this audit.

## Confirmed findings

1. **Backend authentication used unsafe development defaults.** The service
   shipped a known JWT fallback secret and stored passwords as unsalted
   SHA-256 hashes. This made token forgery and offline password cracking
   materially easier if the optional backend were exposed.
2. **Cloud progress hydration was ineffective for new local profiles.**
   `getBlankProgress()` returns an object with schema keys, so checking
   `Object.keys(progress).length === 0` never identified blank local state.
   A learner signing in on a new device could therefore miss their cloud
   progress.
3. **The optional backend has an overly broad API boundary.** It enables
   wildcard CORS and exposes AI/audit endpoints without a shared
   authentication dependency. This is deferred from this focused change
   because enforcing it requires coordinating frontend request behavior.

## Changes in this task

- Authentication now fails closed when `JWT_SECRET` is not configured with a
  sufficiently long secret, removes the seeded demo credential, and uses
  salted PBKDF2-SHA256 password hashes for newly registered users.
- Progress hydration now distinguishes blank schema state from meaningful local
  learner progress and loads cloud state when local state is blank.
- Regression tests cover the authentication and hydration fixes.

## Next priority

Add a configurable allow-list CORS policy and an explicit authentication
dependency for protected AI, audit, and telemetry endpoints, then update the
frontend client to send tokens consistently.
