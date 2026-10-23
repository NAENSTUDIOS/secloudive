# Feature Status Governance

## Purpose

Every feature in SeCloudive must have exactly one lifecycle status. A feature may not be implemented, deployed, or retired outside this lifecycle.

## Allowed statuses

| Status | Meaning |
|---|---|
| `PLANNED` | Approved but not started |
| `IN_DESIGN` | UX/UI and architecture work is active |
| `IN_DEVELOPMENT` | Implementation is active |
| `IN_TESTING` | Validation is active |
| `READY_FOR_STAGING` | Approved for staging deployment |
| `STAGING` | Deployed to staging |
| `READY_FOR_PRODUCTION` | Approved for production release |
| `PRODUCTION` | Live and operational |
| `DEPRECATED` | Scheduled for retirement; replacement/migration is required |
| `ARCHIVED` | Retired and preserved for history |
| `BLOCKED` | A documented dependency prevents progress |

## Status transition rules

Allowed forward path:

`PLANNED -> IN_DESIGN -> IN_DEVELOPMENT -> IN_TESTING -> READY_FOR_STAGING -> STAGING -> READY_FOR_PRODUCTION -> PRODUCTION`

Exceptions:

- Any active status may become `BLOCKED` when a dependency is documented.
- `BLOCKED` returns to its previous active status after the dependency is resolved.
- Any active feature may become `DEPRECATED` only with a replacement, migration plan, route mapping, and owner approval.
- `DEPRECATED -> ARCHIVED` requires reference migration, content/data validation, rollback evidence, and explicit approval.
- A status may not skip validation or staging for production release.

## Required status-change record

Every change requires:

| Field | Requirement |
|---|---|
| Feature ID | Existing registry ID |
| Previous status | Prior allowed status |
| New status | New allowed status |
| Owner | Primary owner responsible for the change |
| Date | ISO-8601 date |
| Reason | Concrete technical/product reason |
| Approval | Approver or approval reference |
| Evidence | Tests, review, deployment, or migration evidence |

## Definition of operational status

`PRODUCTION` means the feature is deployed, monitored, secured, documented, and has passed the applicable route, regression, security, accessibility, and data-integrity tests. A code-level implementation is not automatically `PRODUCTION`.

