# Phase 0: Engineering foundation

## Scope

Phase 0 establishes repository conventions, type-checking, content provenance
types, application boundaries, and CI-ready package scripts. It does not
implement authentication, learner functionality, AI behavior, AWS sandboxes,
or production infrastructure.

## Required invariants

- Real credentials are never required for local checks.
- Content provenance is part of the content contract.
- Progress events require actor identity, timestamp, idempotency, and schema version.
- Product behavior is added only through approved, traceable phases.
- Authentication configuration fails explicitly when Cognito is not provisioned.
- Authorization is evaluated server-side from application roles and permissions.
