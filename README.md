# Secloudive

Secloudive is a privacy-first, evidence-based AWS security learning platform.

The repository is currently in **Phase 0: engineering foundation**. Product
functionality will be added only after the approved architecture, privacy,
security, content-rights, and traceability requirements are implemented in
small, reviewable phases.

## Repository layout

- `apps/` contains deployable applications.
- `packages/` contains shared contracts, validation, domain rules, and tooling.
- `content/` contains version-controlled, provenance-tracked learning content.
- `database/` contains schema and seed definitions.
- `docs/` contains architecture, requirements, security, privacy, and operations records.
- `infrastructure/` contains reviewed infrastructure-as-code.

## Content rights

Internet resources may inform research, but Secloudive content must be
original or explicitly compatible with its license. Every content item must
record provenance, licensing, review status, and ownership before publication.

## Local setup

1. Install Node.js and pnpm.
2. Copy `.env.example` to `.env`.
3. Run `pnpm install`.
4. Run `pnpm check`.

No production credentials or real AWS credentials are required for Phase 0.
