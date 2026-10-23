# SeCloudive VS Code Master Prompt

> This document is the consolidated, expansion-safe instruction set for future VS Code/Copilot SDK work. It is a planning and implementation contract. It does not authorize an unreviewed rewrite or claim that planned systems are already built.

## Mission

Build SeCloudive as one connected Cloud Security Career Operating System:

`Cloud University + Cloud Academy + Virtual Company + Virtual Internship + Cloud Security SOC + Architecture Studio + Career Accelerator + Portfolio Builder + Certification Platform + AI Mentor + Recruiter Verification`

The North Star is not course completion, hours studied, or certificates earned. The North Star is:

`Verified Job Readiness + Verified Skill Evidence + Verified Portfolio Quality + Verified Employability`

Every change must answer: **Will this help the learner become employable faster with stronger proof of skill?**

## Non-destructive memory and expansion protocol

This project continuously expands. Before any work:

1. Load [MASTER_PLATFORM_INVENTORY.md](./MASTER_PLATFORM_INVENTORY.md).
2. Load [MASTER_FEATURE_REGISTRY.md](./MASTER_FEATURE_REGISTRY.md).
3. Load [MASTER_TRACEABILITY_MATRIX.md](./MASTER_TRACEABILITY_MATRIX.md).
4. Load [EXECUTION_GOVERNANCE.md](./EXECUTION_GOVERNANCE.md).
5. Load [FEATURE_STATUS_GOVERNANCE.md](./FEATURE_STATUS_GOVERNANCE.md).
6. Load [FEATURE_OWNER_MODEL.md](./FEATURE_OWNER_MODEL.md).
7. Inspect the current routes, pages, components, services, data files, schemas, migrations, assets, tests, and workflows.
8. Inspect existing learning paths, modules, topics, labs, battle rooms, investigations, threat hunts, projects, certifications, simulations, role systems, portfolios, admin systems, AI systems, and event contracts.

Never:

- Replace the existing architecture without an approved migration.
- Overwrite or delete existing features, routes, content, assets, data, or educational material.
- Create a competing implementation when an existing capability can be extended.
- Simplify behavior to make implementation easier.
- Mark a planned system as implemented because documentation exists.
- Send private code, credentials, learner data, or provider keys to external AI services.

Ask **“What already exists, what depends on it, and how will this change be rolled back?”** before creating anything.

## Change contract

For every proposed feature or modification, record:

- Existing capability
- Proposed capability
- Feature ID
- Owner and lifecycle status
- Business, learning, and career goals
- Integration points
- Dependencies
- Routes and UI surfaces
- Database and RLS changes
- Events and analytics
- Security and privacy impact
- Accessibility and performance impact
- Tests and acceptance criteria
- Migration and data-integrity plan
- Rollback plan
- Documentation link

No feature may exist outside the registry. No feature may move to production without complete traceability, testing, security review, monitoring, rollback evidence, and owner approval.

## Mandatory technology stack

Preserve the current architecture and use:

- React 19, Vite, JavaScript/JSX, React Router
- Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons
- TanStack Query, Zustand, Framer Motion, React Hook Form, Zod where adopted
- Supabase Auth, PostgreSQL, Supabase Storage, Supabase Realtime, Edge Functions
- Google OAuth and Magic Link
- Gemini through authenticated server-side Edge Functions only
- Vercel, Supabase, GitHub
- Sentry, PostHog, and Supabase Logs
- Vitest, React Testing Library, Playwright, Lighthouse
- Markdown and MDX documentation

Do not migrate to Next.js or switch stacks without an explicit architecture decision, compatibility analysis, migration plan, and approval.

## Connected learner journey

The platform must remain one ecosystem:

`Foundations -> Learning -> Labs -> Projects -> Threat Hunts -> Investigations -> Architecture Reviews -> Job Simulations -> Internships -> Certifications -> Portfolio -> Career Readiness -> Recruiter Verification`

Every new feature must connect to this chain and must preserve existing aliases and learner progress.

## Curriculum contracts

Every module must contain:

What, Why, How, Where, When, When Not, Risks, Best Practices, Common Mistakes, Real Example, Job Context, Guided Lab, Independent Lab, Investigation, Project, Documentation, Assessment, Interview Questions, and Portfolio Evidence.

Every certification objective must contain:

Learning Resource, Theory, Visualization, Guided Practice, Independent Practice, Threat Simulation, Job Simulation, Architecture Review, Documentation Exercise, Interview Questions, Portfolio Artifact, and Career Mapping.

The enforceable contracts are [MODULE_COMPLETENESS_CONTRACT.md](./MODULE_COMPLETENESS_CONTRACT.md) and [CERTIFICATION_OBJECTIVE_CONTRACT.md](./CERTIFICATION_OBJECTIVE_CONTRACT.md).

Every foundation topic must follow:

`Understand -> Visualize -> Observe -> Practice -> Simulate -> Apply -> Troubleshoot -> Explain -> Teach -> Perform`

Foundation domains:

Computer Fundamentals, Operating Systems, Linux, Networking, Git and GitHub, Python, Cybersecurity, Cloud Fundamentals, Documentation, and Professional Communication.

Foundation resources must pass the quality threshold in [FOUNDATION_ASSESSMENT_BLUEPRINTS.md](./FOUNDATION_ASSESSMENT_BLUEPRINTS.md). Weak or unverified resources cannot be the sole source for a core objective.

## Resource intelligence

Prefer official documentation, official training, standards, and authoritative technical sources. Every resource requires:

- Canonical URL and provider
- Authority and accuracy evidence
- Version and freshness
- Practical, career, certification, and job alignment
- License/access notes
- Resource score and review status
- Broken-link and deprecation monitoring

Use the scoring and admission rules in [RESOURCE_INTELLIGENCE_SYSTEM.md](./RESOURCE_INTELLIGENCE_SYSTEM.md) and [FOUNDATION_ASSESSMENT_BLUEPRINTS.md](./FOUNDATION_ASSESSMENT_BLUEPRINTS.md).

Never silently copy third-party content. Store metadata, attribution, canonical links, summaries, and learner-created notes in accordance with provider terms.

## Real work and safe practice

Every practice activity follows:

`Ticket -> Briefing -> Access -> Investigation -> Analysis -> Decision -> Approval -> Implementation -> Validation -> Evidence -> Manager Review -> Closure`

Use the safe digital twin by default. Real-cloud mode requires explicit opt-in, scoped credentials, allowlisted services and regions, cost estimates, budgets, tagging, approval, deployment logs, validation, and teardown verification. Long-lived cloud secrets never reach the browser.

Role tracks include Cloud Engineer, Cloud Security Engineer, SOC Analyst, Security Analyst, DevSecOps Engineer, Platform Engineer, SRE, Cloud Architect, Solutions Architect, Security Architect, Security Consultant, and Principal Architect.

Use [REAL_JOB_SIMULATION_OS.md](./REAL_JOB_SIMULATION_OS.md) and [ROLE_OPERATING_MODEL.md](./ROLE_OPERATING_MODEL.md) for required tickets, incidents, tools, meetings, reports, metrics, promotion evidence, and portfolio outputs.

## Security and data rules

Implement and test:

- Supabase Auth and JWT validation
- Server-authoritative role and admin authorization
- PostgreSQL RLS and ownership isolation
- Storage policies
- Immutable audit logs
- Versioned event contracts and idempotency
- Input validation and safe output handling
- Rate limiting, abuse controls, and prompt-injection defenses
- Secret scanning and bundle/source-map checks

Provider keys, service-role keys, JWT secrets, admin tokens, and database credentials must never be in React code, browser bundles, local storage, session storage, or public repositories.

AI flow:

`Frontend -> Authenticated Supabase Edge Function -> Gemini`

Support key rotation, retries with backoff, 429 handling, cooldown queues, quotas, usage tracking, prompt logging without sensitive content, and admin monitoring.

## NAEN AI boundaries

NAEN may monitor, analyze, recommend, score, create tasks, create findings, tag content, generate reports, and draft fixes.

NAEN may not autonomously:

- Delete data or users
- Change RLS or security policies
- Change admin permissions
- Publish major curriculum or certification changes
- Deploy production changes
- Make irreversible migrations

Owner approval, security review, and audit records are required for critical changes. AI recommendations remain explainable and reviewable.

## Admin and operations

Admin AI monitors content, resources, certifications, labs, security, AI quality, learning gaps, job-market changes, role coverage, portfolios, platform health, integrations, and industry intelligence.

The admin command center must support health reports, findings, task creation, approval queues, owner digests, and audit exports. The platform must clearly show `Configuration Required` for missing integrations rather than pretending that hardcoded data is live.

Reserve provider configuration slots for Supabase, Gemini, Google OAuth, GitHub, Sentry, PostHog, email, storage, job feeds, internship feeds, resource health, certification updates, and industry intelligence. Never commit secrets.

## Required final deliverables

When implementation is explicitly authorized, produce and maintain:

- Architecture and dependency diagrams
- Database ERD and versioned Supabase migrations
- RLS and storage policies with tests
- Edge Functions and AI proxy
- Route and folder structure
- Design system and component library
- Certification, foundation, lab, role, threat, resource, and portfolio matrices
- Event and analytics contracts
- Automated audit reports
- Testing matrix and evidence
- Deployment, monitoring, backup, and rollback plans
- Security review and production-readiness report

These deliverables must be created incrementally and linked to registry entries. Do not generate a false “complete” report while any release blocker remains.

## Quality board

Review every change through these perspectives:

- Product and UX
- Learning science and curriculum
- Cloud and solutions architecture
- Cloud security and enterprise security
- MITRE ATT&CK and NIST incident response
- DevSecOps, platform engineering, and SRE
- Accessibility and performance
- Data, analytics, and privacy
- Operations and release management

Use external AI review only as advisory input. Repository tests, security checks, human approvals, and production evidence are authoritative.

## Release gate

Block release for:

- Missing feature owner, status, traceability, tests, documentation, events, analytics, monitoring, or rollback
- Route, content, data, or educational asset loss
- Exposed secret or provider key
- Auth, authorization, RLS, or tenant-isolation failure
- Unsafe real-cloud behavior
- Critical accessibility, performance, or security regression
- Broken critical learning path
- Missing certification, role, lab, investigation, threat, project, or portfolio coverage
- Unverified security, certification, or resource guidance

## First action for any future task

Do not start by writing new code. First produce a bounded audit of the relevant existing surfaces, compare them to the registry and inventory, identify preservation risks, and state the smallest compatible extension. Then implement only after the change contract, tests, and rollback path are clear.
