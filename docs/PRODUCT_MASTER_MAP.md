# SeCloudive Product Master Map

**Purpose:** Evidence-based inventory of what the current repository provides.
“Implemented” means a working local or code-level surface exists; it does not
mean a production backend, live cloud account, or external integration is
guaranteed.

## Product pillars

| Pillar | Existing surface | Status |
|---|---|---|
| Learn | Learning center, paths, topics, quizzes, diagnostic placement, badges | Implemented locally |
| Build | Labs, projects, IaC templates, Cloudive Studio | Implemented as safe local/simulated workflows |
| Collaborate | Public/custom labs and leaderboards | Partial |
| Earn | XP, streaks, badges, certificates, audit packs, employability report | Implemented / cloud-conditional |
| Deploy | Playbooks, remediation guidance, exportable Terraform/audit artifacts | Simulated/content-focused; no real provisioning demonstrated |
| Scale | Architecture reviews, battle rooms, threat simulations, career readiness | Implemented locally; enterprise tenancy incomplete |

## Public website

| Feature | Evidence | Status | Dependencies / risks |
|---|---|---|---|
| Landing page | `src/pages/Home.jsx`, `src/components/Hero.jsx` | Implemented | Large global shell |
| Marketing/about | `/about`, `About.jsx`, `Footer`, `Navbar` | Implemented | Copy and aliases should be consolidated |
| Documentation/resources | Downloads, guides, glossary, cheat sheets, learning data | Implemented locally | No CMS workflow |
| Pricing | No dedicated pricing route/page found | Missing | Requires product/package decision |
| Contact | No dedicated contact workflow found | Missing | Requires support/CRM destination |
| Legal | `/legal`, `LegalPage.jsx` | Implemented | Consent persistence is primarily client-side |

## Authentication and identity

| Feature | Evidence | Status | Key gap |
|---|---|---|---|
| Google OAuth | `AuthContext`, `googleAuthService`, `GoogleSignInButton` | Implemented / partial | Coexists with local identity and Supabase |
| Email/password | Supabase and optional FastAPI auth endpoints | Implemented / partial | Separate identity stores |
| Magic link | `AuthContext` Supabase OTP flow | Implemented / environment-dependent | Requires configured Supabase |
| Registration | Local profiles and backend register endpoint | Implemented / partial | Backend store is in memory |
| Password reset | Supabase recovery flow references exist | Environment-dependent | Requires Supabase email configuration |
| Email verification | Supabase capability, no complete product workflow verified | Partial | Needs explicit UX/state handling |
| MFA | No complete MFA workflow verified | Missing | Must be server/provider-backed |
| Guest mode | `userSyncManager`, onboarding, local profile storage | Implemented | Must remain clearly separate from authenticated status |
| Session controls | Supabase persistence and FastAPI JWT expiry | Partial | No unified session/revocation model |

## User system

| Feature | Evidence | Status |
|---|---|---|
| Profiles and profile switching | `Profile.jsx`, `UserSyncModal`, `userSyncManager` | Implemented locally |
| Learner dashboard | `Dashboard.jsx`, `ChallengeContext` | Implemented locally |
| Settings/preferences | Context state, Supabase settings service | Implemented / cloud-conditional |
| Notifications | UI/toast-style notifications and live widgets; no durable notification center verified | Partial |
| Activity/audit logs | Supabase audit schema and local audit/export flows | Partial |
| Progress tracking | Challenge context, local storage, Supabase progress RPC/schema | Implemented / cloud-conditional |
| Streaks, XP, badges | Learning data, context, Supabase RPC/tables | Implemented / cloud-conditional |

## Admin system

| Feature | Evidence | Status |
|---|---|---|
| Admin dashboard | `/admin`, `AdminDashboard.jsx` | Partial; client-side gate |
| User management | Local learner registry/profile tools | Partial; not server-authoritative |
| Content management | Cloudive Studio/custom labs | Partial; no full CMS |
| Analytics | Local admin telemetry and gateway metrics | Partial |
| Moderation/audit queue | Human review component and audit structures | Partial; durable workflow not established |
| RBAC/ABAC | Role fields and UI guards | Partial; server enforcement missing |

## Learning system

| Feature | Evidence | Status |
|---|---|---|
| Beginner through advanced paths | `src/data/learning/*`, structured learning path/gates | Implemented locally |
| AWS track | IAM, S3, networking, monitoring, architecture, investigations | Implemented |
| Azure/GCP/multi-cloud | `multiCloudResources.js`, provider filters/crosswalks | Partial; mostly content/crosswalk |
| Terraform/Kubernetes/Docker/Linux/DevOps | Labs, projects, guides, and roadmap references vary by topic | Partial; coverage is not uniform |
| Security/DevSecOps/SRE | Incidents, threat hunts, architecture and monitoring data | Implemented locally |
| AI/prompt/software engineering tracks | AI services and roadmap references | Partial; no complete dedicated curricula verified |
| Interactive labs | `RealLabs`, safe lab data, terminal and IaC components | Implemented as simulation/content |
| Sandboxes | Sandbox mode and LocalStack-aware backend inspection | Partial; no managed multi-tenant sandbox |
| Assessments/quizzes | Diagnostic placement, topic checks, module/adaptive quizzes | Implemented locally |
| Challenges/incidents | Challenge banks, investigations, battle rooms, threat hunts | Implemented locally |
| Exams | No separate proctored/exam system verified | Missing |
| Certificates | Certificate modal, Supabase certificate functions, verification page | Partial; cloud deployment required for authoritative verification |
| Skill tracking | Skill graph, role gaps, employability calculator | Implemented locally |

## Project and portfolio system

| Feature | Evidence | Status |
|---|---|---|
| Build projects | `CloudProjects.jsx`, `cloudProjects.js` | Implemented locally |
| Save projects | Local progress and custom lab/project services | Partial |
| Share projects | Public custom labs and audit exports | Partial |
| Export projects | Audit pack, Terraform, PDF/resume utilities | Implemented locally |
| Clone templates | IaC/lab template data | Partial |
| Cloud/DevOps/security/AI categories | Project and lab data | Implemented as content categories |
| Web development category | No strong dedicated project catalog verified | Partial/missing |
| Public portfolio | `PortfolioEvidenceCard`, report/export flows | Partial |
| GitHub integration | No complete OAuth/repository sync workflow verified | Missing |
| Resume builder/export | Career components and PDF exporter | Partial; builder depth varies |
| Career roadmap | Roadmap, ramp-up, role and skill-gap data | Implemented locally |

## AI system

| Feature | Evidence | Status | Key gap |
|---|---|---|---|
| AI Copilot/chat | `AIChatCopilot`, `SentinelAssistant`, `sentinelClient` | Implemented / optional backend |
| Code explanation | AI prompts/services reference analysis behavior | Partial; live model/config dependent |
| Architecture review | Architecture page/data and `/api/ai/architecture` | Implemented / partially static |
| Project generation | Cloudive Studio/project data | Partial |
| Documentation generation | Export and AI utilities | Partial |
| Security auditing | Guardrails, mentor, audit-pack flows | Implemented / partially simulated |
| Cloud architecture design | Architecture reviews and crosswalk data | Implemented locally |
| Resume optimization | Resume/career services and UI | Partial |
| Interview preparation | Interview simulator/bank/evaluation endpoint | Implemented / simplistic scoring |
| AI mentors | AWS/security/career personas and mentor quality engine | Implemented locally |
| Recommendations/skill gaps | Recommendation engine and employability calculator | Implemented locally |
| Content generation/workflow automation | No complete durable job/workflow platform verified | Missing/partial |
| AI governance | Safety guardrails and human escalation components | Partial; endpoint auth/audit durability incomplete |

## Cloud system

| Feature | Evidence | Status |
|---|---|---|
| AWS learning | AWS data, labs, incidents, feeds, guides | Implemented |
| Azure/GCP learning | Multi-cloud resources and provider filter | Partial |
| Real AWS integration | Optional LocalStack inspection and feed services | No production resource provisioning evidenced |
| Terraform/IaC | Templates, linter/remediation/export utilities | Implemented as safe local artifacts |
| Cost controls | Safe lab cost calculator and simulated FinOps state | Implemented locally |
| Cloud deployment | Amplify configuration and deployment docs | Frontend-oriented; backend contract incomplete |
| Kubernetes/container platform | No complete deployment manifests or managed runtime contract verified | Missing/partial |

## Community and collaboration

| Feature | Status | Evidence / gap |
|---|---|---|
| Forums | Missing | No dedicated forum route/data model verified |
| Messaging/chat | Partial | AI chat exists; peer messaging is not established |
| Teams/study groups | Missing | No durable organization/team model verified |
| Collaboration | Partial | Public/custom labs and leaderboards |
| Mentorship | Partial | AI mentors and escalation queue; human mentor workflow absent |
| Events | Missing | No event catalog/workflow verified |
| Leaderboards/rankings | Partial/implemented backend design | Views, modal, realtime service; deployment dependent |

## Analytics

| Audience | Existing | Status |
|---|---|---|
| Learner progress analytics | Scores, XP, streaks, employability/report views | Implemented locally |
| Learning analytics | Counters, quiz attempts, recommendations | Partial; no event pipeline |
| Admin growth/revenue analytics | No durable growth/revenue model verified | Missing |
| Engagement analytics | Gateway metrics and local telemetry | Partial |
| Security/audit analytics | Audit logs, packs, metrics | Partial; backend stores are not durable |

## Security and compliance readiness

| Capability | Current state | Readiness |
|---|---|---|
| OWASP-oriented controls | Guardrails, RLS, input/data checks, boundaries | Partial |
| CSP and secure headers | Not clearly configured in hosting/app contract | Missing |
| Input validation | Pydantic backend models and frontend guards | Partial |
| Audit logs | Schema and local export flows | Partial |
| Threat detection | Simulated threat radar/incident content | Educational simulation |
| GDPR readiness | Legal page and local consent concepts | Early/partial |
| SOC 2 / ISO 27001 readiness | No control catalog/evidence program verified | Missing |
| RBAC/ABAC | Role fields and client guards | Not production-ready |
| MFA/session revocation | Not complete | Missing |

## DevOps, database, and UX

### DevOps

Vite build, npm scripts, Amplify configuration, deployment documentation, and
local backend startup exist. Docker/Kubernetes/Terraform infrastructure,
GitHub Actions, Prometheus/Grafana, tracing, and production SLOs are not
established in the inspected repository.

### Database

Supabase/PostgreSQL schema, functions, views, RLS, storage policies, and
indexes are extensive. Redis, search, object-storage architecture, tenant
partitioning, migration governance, and caching strategy are not established
as complete platform systems.

### UX/design system

The application has extensive CSS modules/styles, responsive components,
dark cyber-security visual language, onboarding, modals, boundaries, and
progress feedback. A formal token/component/accessibility system, light mode,
central accessibility audit, and consistent mobile contract are not clearly
documented.

## Business-impact roadmap

### P0: Trust and security

1. Make Supabase (or a dedicated identity provider) the authoritative identity.
2. Protect FastAPI AI/audit/feed endpoints with bearer-token verification.
3. Replace wildcard CORS and client-only admin authorization.
4. Remove client-side AI-key storage or replace it with a secure server-side
   secret flow.

### P1: Reliability and data integrity

1. Select one canonical Supabase schema source and verify migration parity.
2. Version and migrate `progress_blob`; define local/cloud conflict rules.
3. Publish one backend base URL and typed API contract.
4. Resolve undefined `/api/live-aws-sync` and `/api/live-cloud-jobs` references.
5. Add durable audit/analytics events and observable persistence failures.

### P1: Learning product quality

1. Keep current investigation-first learning path as the canonical core.
2. Fill only verified curriculum gaps by track, beginning with foundations,
   IAM, networking, monitoring, incident response, and architecture.
3. Add explicit assessment/exam and certificate eligibility rules.
4. Label every simulated lab and reserve real cloud execution for isolated,
   quota-controlled environments.

### P2: Enterprise and community expansion

1. Add organization tenancy and server-authoritative roles.
2. Add moderated community spaces, teams, mentorship, and events.
3. Add GitHub portfolio integration and job/certification tracking.
4. Add production observability, SLOs, compliance evidence, and disaster
   recovery exercises.

## Non-goals for this inventory

This map does not claim that missing features should be added immediately. It
does not create duplicate pages, invent learning content, provision cloud
resources, or replace the existing investigation-based learning experience.
