# SeCloudive Codebase Audit

**Audit date:** 2026-10-22  
**Scope:** Existing repository implementation only. This document does not treat
roadmap language, screenshots, or aspirational copy as proof of a working
feature.

## Executive summary

SeCloudive is a React 19/Vite application with a large data-driven cloud
security learning surface, optional Supabase persistence, and an optional
FastAPI intelligence service. The core learner journey is implemented locally:
onboarding, learning paths, quizzes, challenges, labs, investigations,
projects, career tooling, reports, and simulated security evidence.

The platform is not yet a single production architecture. Supabase Auth,
local profile storage, Google flows, and FastAPI JWT authentication coexist.
The frontend can operate without Supabase or FastAPI, so cloud and AI behavior
is environment-dependent. The most important production risks are server-side
authorization, identity fragmentation, API endpoint drift, schema drift, and
the difference between simulated and real cloud execution.

## Baseline verification

- `npm run build`: passed.
- `npm test`: passed after the focused hardening changes.
- Backend authentication regression tests: passed with declared Python
  dependencies supplied ephemerally through `uv`.
- No deployment or cloud provisioning was performed.

## Repository structure

| Area | Location | Purpose | Status / risk |
|---|---|---|---|
| Frontend entry and shell | `src/App.jsx`, `src/main.jsx` | Browser shell, onboarding gate, providers, global overlays | Implemented; global shell is broad and stateful |
| Routes | `src/routes/AppRoutes.jsx` | Lazy-loaded route composition and tier gates | Implemented; aliases and gate metadata are duplicated |
| Pages | `src/pages/` | Route-level learning, career, simulator, admin, and evidence views | Implemented locally |
| Components | `src/components/` | Reusable UI, simulations, AI, identity, progress, and admin components | Implemented; large surface raises regression risk |
| State | `src/context/` | `ChallengeContext` progress/product state and `AuthContext` identity/cloud state | Implemented; two identity models coexist |
| Data | `src/data/` | Learning paths, banks, labs, incidents, projects, careers, threat scenarios | Strong local content coverage |
| Services | `src/services/` | Supabase, AI, feeds, auth, sync, export, and live integrations | Partial; several integrations are optional or drift-prone |
| Utilities | `src/utils/` | Export, employability, PDF, Supabase helpers, motion/audio | Implemented; some utilities persist sensitive/user data locally |
| Optional backend | `server/` | FastAPI AI, feed, audit, health, and JWT endpoints | Partial; separate deployment/auth contract |
| Database | `supabase/migrations/`, `src/lib/supabaseSchema.sql` | PostgreSQL tables, functions, views, RLS, storage policies | Implemented design; two schema sources can diverge |
| Operations | `scripts/`, `amplify.yml`, `vite.config.js`, `DEPLOYMENT.md` | Build, audits, local feed proxy, Amplify deployment | Implemented; frontend/backend deployment contract incomplete |

## Application architecture

### Frontend

- React 19 with Vite 8 and React Router 7.
- `App.jsx` mounts `BrowserRouter`, `ChallengeProvider`, global security/error
  boundaries, onboarding, navigation, footer, assistant, and modals.
- Route components are mostly lazy-loaded in `AppRoutes.jsx`.
- Data-driven local simulation is the default operating mode.
- Local storage is used for identity, onboarding, preferences, progress,
  streaks, chat, and recovery state.

### Routing architecture

Primary route families in `src/routes/AppRoutes.jsx`:

- Foundation and learning: `/`, `/learning/*`, `/learn/*`, `/academy/*`,
  `/categories`, roadmap and cost-calculator aliases.
- Career and profile: `/career*`, `/ramp*`, `/dashboard`, `/profile*`,
  `/jobs`, `/internships`.
- Security practice: `/labs*`, `/projects*`, `/playbooks*`,
  `/battle-rooms*`, `/investigations*`, `/challenge/:id`,
  `/architecture-reviews`, `/threat-intel*`.
- AI and evidence: `/internship-simulator`, `/interview*`,
  `/cloudive-studio`, `/report`, `/verify*`, `/downloads`.
- Administration: `/admin` behind `AdminGuard`.

**Risks and improvements**

- Many aliases point to the same page and increase maintenance surface.
- Route gates request tier 5 in places while the database clearance constraint
  supports tiers 1–4.
- `/admin` is client-gated; it is not a server authorization boundary.
- Unknown paths fall back to the home page rather than a dedicated 404.
- There is no central route metadata registry for permissions, ownership,
  analytics, or navigation.

## API architecture

The optional FastAPI service in `server/agent_engine.py` exposes:

- Health/metrics: `/api/health`, `/api/gateway/metrics`.
- Streaming AI: `/api/antigravity/stream`, `/api/mentor/chat`.
- AI evaluation: `/api/ai/mentor`, `/api/ai/interview`,
  `/api/ai/architecture`, `/api/ai/incident`, `/api/ai/career`,
  `/api/ai/resume`.
- Feeds: `/api/feed/rss`, `/api/feed/health`, `/api/feed/refresh`.
- Audits: `/api/audit/logs`, `/api/audit/decision`.
- Auth/status: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`,
  `/api/supabase/status`.

Frontend services also reference live feed paths such as
`/api/live-aws-sync` and `/api/live-cloud-jobs`, which are not present in the
inspected FastAPI route list.

**Risks and improvements**

- FastAPI is optional and has no single production base URL contract.
- CORS is broad and AI/audit/feed surfaces are not uniformly protected.
- Backend users and audit/metrics stores are in memory.
- No shared typed API contract exists.
- Some AI responses are deterministic/static rather than demonstrably model
  backed.

## Database architecture

The dated Supabase migration defines profiles, settings, progress, streaks,
badges, certificates, chat, XP, labs, interviews, internships, flashcards,
audit packs/logs, notes, leaderboards, community labs, and credential views.
It also defines RPCs including `save_progress`, `award_xp`,
`issue_certificate`, and `verify_certificate`.

RLS policies generally scope records to `auth.uid()`, with public verification
and public community-lab exceptions.

**Risks and improvements**

- `supabase/migrations/...sql` and `src/lib/supabaseSchema.sql` are parallel
  schema sources and may drift.
- The frontend falls back from `save_progress` RPC to direct upsert, which can
  weaken atomic/server validation guarantees.
- JSON `progress_blob` and scalar counters can diverge without a versioned
  migration strategy.
- Admin/instructor/auditor policy enforcement is not clearly server-authoritative.
- User-provided Gemini keys are represented in settings and require a safer
  secrets design.

## State, identity, and persistence

`ChallengeContext` owns learner progress, challenges, labs, projects, career
state, tier gates, cloud filters, sandbox mode, and autosave. `AuthContext`
owns Supabase session restoration, local fallback identity, Google flows,
guest mode, and cloud hydration. `userSyncManager` maintains local profiles and
per-profile progress.

**Status:** Core learner state is implemented. Cloud synchronization is
conditional on Supabase configuration.

**Risks:** Supabase Auth, local profiles, Google services, and FastAPI JWTs are
separate identity systems. Graceful fallback can make a local identity appear
authenticated while the cloud is unavailable. Local and cloud progress have
different semantics. There is no single token/session contract or event stream.

## Component and page inventory

### Learning and progress

`LearningCenter`, `Categories`, `OfficialLearningPaths`,
`StructuredLearningPathSection`, `InteractiveTopicEngine`, `ProgressBar`,
`BadgeCard`, `DailyLearningStreakWidget`, `SkillGraphView`, and
`StepWiseSkillMap`.

### Security simulation

`RealLabs`, `InvestigationSimulator`, `ArchitectureReviews`, `BattleRooms`,
`InteractiveTerminal`, `ForensicQueryStudio`, `DynamicAttackGraph`,
`DynamicTopologyCanvas`, `CyberThreatRadar`, `EvidenceViewer`,
`AttackTimeline`, and `SafeLabCostCalculator`.

### Career and portfolio

`CareerRampUpDirectory`, `CareerRoadmap`, `CareerJourneyTrack`,
`MasterEmployabilityHub`, `RoleSkillGapDashboard`, `PortfolioEvidenceCard`,
`InterviewSimulator`, `LiveInternshipsPage`, and resume/audit exporters.

### AI and assistant

`AIChatCopilot`, `SentinelAssistant`, `RecommendationOrchestratorView`,
`HumanReviewEscalationQueue`, `NaenContentGuardian`, and mentor services.

### Identity and administration

`WelcomeOnboardingModal`, `GoogleSignInButton`, `UserSyncModal`,
`AdminGuard`, `AdminDashboard`, `Profile`, `GlobalSecurityEnclave`,
`SafeBoundary`, and `ErrorBoundary`.

## Security inventory

### Implemented

- Supabase RLS design and authenticated user-scoped tables.
- Auth/session persistence and guest isolation.
- Error boundaries and safety/guardrail services.
- Simulated identifiers and explicit simulated-event notices.
- Audit-pack generation and certificate verification functions.
- Backend JWT flow with fail-closed secret configuration and PBKDF2 password
  hashing after the hardening change.
- Environment files and common key files are ignored by Git.

### Partial or risky

- Client-side admin authorization.
- Wildcard backend CORS and inconsistent endpoint authorization.
- Multiple identity/session systems.
- Local storage of user-provided AI credentials.
- Direct-upsert fallback around progress RPCs.
- No demonstrated CSP/secure-header policy for production hosting.
- No durable server-side threat detection or audit queue.

## AI inventory

Implemented local and optional backend surfaces include mentor chat, Sentinel
assistant, interview evaluation, architecture review, incident generation,
career/resume coaching, retrieval/vector-store helpers, key rotation, safety
guardrails, and human-review escalation.

**Status:** Product surface implemented; production model governance is
partial. External keys are optional, fallback behavior is local, and several
responses are static or deterministic.

## Admin, user, cloud, and analytics inventory

| Area | Current implementation | Status |
|---|---|---|
| User profiles | Local profile registry plus Supabase profiles | Implemented / dual-system |
| Dashboards | Learner dashboard, report, profile, employability views | Implemented locally |
| Admin | Admin dashboard, local controls, learner registry and sync tools | Partial; client-authorized |
| Cloud learning | AWS-focused labs, multi-cloud data, IaC templates, cost calculator | Implemented as safe simulation/content |
| AWS/Azure/GCP execution | Data and crosswalks exist; real provisioning is not evidenced | Missing as production execution |
| Community | Cloudive Studio and public/custom labs | Partial; moderation and forum/chat system absent |
| Analytics | Progress counters, gateway metrics, audit logs, leaderboards | Partial; no durable product event pipeline |

## Missing or incomplete platform capabilities

- Authoritative architecture/product map (created alongside this audit).
- Unified API, auth, and deployment contract.
- Server-authoritative RBAC/ABAC and admin operations.
- Durable analytics/event model with consent and retention.
- Versioned progress schema and migration tooling.
- Complete community forums, messaging, teams, mentorship, and events.
- Real cloud sandbox provisioning with quotas, isolation, billing controls, and
  teardown guarantees.
- Dedicated 404 and route-level permission metadata.
- Production observability stack and documented SLOs.

## Prioritized roadmap

1. **P0 — Establish one security boundary:** unify Supabase/FastAPI identity,
   restrict CORS, protect AI/audit/feed endpoints, and move admin checks
   server-side.
2. **P0 — Make persistence trustworthy:** choose one schema source, add
   progress versioning/migrations, remove unsafe direct-upsert fallback, and
   define cloud/local conflict semantics.
3. **P1 — Close integration drift:** publish a typed API contract, configure a
   single backend base URL, and either implement or remove undefined feed
   endpoints.
4. **P1 — Separate simulation from execution:** label simulator capabilities
   consistently; design isolated, quota-controlled sandboxes before any real
   provider integration.
5. **P1 — Formalize observability and analytics:** consented events, durable
   audit records, error tracking, SLOs, and operational dashboards.
6. **P2 — Consolidate product navigation:** route metadata, canonical URLs,
   permission declarations, a 404 page, and removal of redundant aliases only
   after usage verification.
7. **P2 — Expand collaboration:** moderation, teams, messaging, mentorship,
   events, and organization tenancy built on server-authoritative policies.

