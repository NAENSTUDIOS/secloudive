# Master Feature Registry

**Version:** 1.1  
**Primary owner:** `OWNER-PRODUCT-001`  
**Last updated:** 2026-10-23  
**Rule:** No feature is production-ready until it has an ID, lifecycle status, primary owner, priority, dependencies, route/data/event/security metadata, tests, and documentation. See [FEATURE_STATUS_GOVERNANCE.md](./FEATURE_STATUS_GOVERNANCE.md) and [FEATURE_OWNER_MODEL.md](./FEATURE_OWNER_MODEL.md).

## Status vocabulary

Only the statuses defined in [FEATURE_STATUS_GOVERNANCE.md](./FEATURE_STATUS_GOVERNANCE.md) are valid. This registry uses `IN_TESTING` for existing repository surfaces that have not passed the full production gate and `IN_DEVELOPMENT` for incomplete implementations.

## Registry

| ID | Feature | Pillar | Priority | Business criticality | Current status | Primary owner | Routes / surfaces | Dependencies | Last updated |
|---|---|---|---|---|---|---|---|---|---|
| CORE-001 | Public landing page | Home | Critical | Important | IN_TESTING | OWNER-PRODUCT-001 | `/`, `Home`, `Hero` | React shell | 2026-10-23 |
| CORE-002 | Global navigation | Core | Critical | Mission Critical | IN_TESTING | OWNER-PRODUCT-001 | Navbar, Footer | Route registry | 2026-10-23 |
| CORE-003 | Route management | Core | Critical | Mission Critical | IN_TESTING | OWNER-ENGINEERING-001 | `AppRoutes` | React Router | 2026-10-23 |
| CORE-004 | Role management | Security | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-SEC-001 | AdminGuard, profiles | Supabase Auth/RBAC | 2026-10-23 |
| AUTH-001 | Google login | Account | Critical | Mission Critical | IN_TESTING | OWNER-SEC-001 | Onboarding/UserSyncModal | Google GIS, Supabase | 2026-10-23 |
| AUTH-002 | Email/password | Account | Critical | Mission Critical | IN_TESTING | OWNER-SEC-001 | Onboarding/UserSyncModal | Supabase Auth | 2026-10-23 |
| AUTH-003 | Magic link | Account | High | Important | IN_TESTING | OWNER-SEC-001 | AuthContext | Supabase Auth | 2026-10-23 |
| AUTH-004 | Guest sandbox | Account | High | Important | IN_TESTING | OWNER-PRODUCT-001 | Onboarding, ChallengeContext | Local isolated state | 2026-10-23 |
| AUTH-005 | Session management | Security | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-SEC-001 | AuthContext | Supabase Auth | 2026-10-23 |
| AUTH-006 | MFA-ready architecture | Security | Critical | Mission Critical | PLANNED | OWNER-SEC-001 | Auth provider | Supabase MFA | 2026-10-23 |
| LEARN-001 | Learning dashboard | Learn | Critical | Mission Critical | IN_TESTING | OWNER-LEARN-001 | `/learning`, LearningCenter | Learning data | 2026-10-23 |
| LEARN-002 | Path catalog | Learn | Critical | Mission Critical | IN_TESTING | OWNER-LEARN-001 | `/learn`, `/academy` | Learning paths | 2026-10-23 |
| LEARN-003 | Module/topic viewer | Learn | Critical | Mission Critical | IN_TESTING | OWNER-LEARN-001 | `/learning/:pathId/:topicId` | Topic data | 2026-10-23 |
| LEARN-004 | Reading and slides | Learn | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-LEARN-001 | LearningCenter/resources | Resource library | 2026-10-23 |
| LEARN-005 | Knowledge checks/quizzes | Learn | Critical | Mission Critical | IN_TESTING | OWNER-LEARN-001 | Learning modules | Quiz banks | 2026-10-23 |
| LEARN-006 | Progress tracking | Learn | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-LEARN-001 | Dashboard/ChallengeContext | Supabase progress | 2026-10-23 |
| LEARN-007 | Recommendations | Learn | High | Important | IN_TESTING | OWNER-LEARN-001 | Dashboard/learning | Recommendation engine | 2026-10-23 |
| PRACTICE-001 | Labs engine | Practice | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-PRACTICE-001 | `/labs` | RealLabs, lab data | 2026-10-23 |
| PRACTICE-002 | Battle rooms | Practice | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-PRACTICE-001 | `/battle-rooms` | Battle data/progress | 2026-10-23 |
| PRACTICE-003 | Investigations | Practice | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-PRACTICE-001 | `/investigations` | Investigation data | 2026-10-23 |
| PRACTICE-004 | Threat hunts | Practice | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-PRACTICE-001 | Threat data/portal | Threat scenarios | 2026-10-23 |
| PRACTICE-005 | Projects | Practice | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-PRACTICE-001 | `/projects` | Cloud project data | 2026-10-23 |
| PRACTICE-006 | Playbooks | Practice | High | Important | IN_DEVELOPMENT | OWNER-PRACTICE-001 | `/playbooks` | Job playbook data | 2026-10-23 |
| PRACTICE-007 | Cost safety | Practice | High | Important | IN_TESTING | OWNER-PRACTICE-001 | `/cost-calculator` | Lab cost data | 2026-10-23 |
| PRACTICE-008 | Real job simulation operating system | Practice | Critical | Mission Critical | PLANNED | OWNER-PRACTICE-001 | Tickets, roleplay, incidents, change workflows | Digital twin, validation engine, evidence store | 2026-10-23 |
| CAREER-001 | Career dashboard/readiness | Career | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-CAREER-001 | `/dashboard`, Report | Career intelligence | 2026-10-23 |
| CAREER-002 | Role roadmaps | Career | High | Important | IN_TESTING | OWNER-CAREER-001 | `/career`, `/roadmap` | Career data | 2026-10-23 |
| CAREER-003 | Internship simulation | Career | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-CAREER-001 | `/internship-simulator` | Internship data | 2026-10-23 |
| CAREER-004 | Interview simulation | Career | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-CAREER-001 | `/interview-simulator` | Interview banks/AI | 2026-10-23 |
| CAREER-005 | Portfolio evidence | Career | Critical | Mission Critical | IN_TESTING | OWNER-CAREER-001 | Profile/report components | Evidence/export services | 2026-10-23 |
| CAREER-006 | Certification center | Career | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-CAREER-001 | Flashcards/certificates | Certification data | 2026-10-23 |
| AI-001 | NAEN assistant | AI | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-AI-001 | Sentinel/AI chat | AI gateway/guardrails | 2026-10-23 |
| AI-002 | Context awareness | AI | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-AI-001 | AI services | Challenge/profile context | 2026-10-23 |
| AI-003 | Hint system | AI | High | Important | IN_DEVELOPMENT | OWNER-AI-001 | Learning/lab UI | AI safety | 2026-10-23 |
| AI-004 | Citation engine | AI | High | Important | IN_DEVELOPMENT | OWNER-AI-001 | AI responses | Resource library | 2026-10-23 |
| AI-005 | Secure AI proxy | Security | Critical | Mission Critical | PLANNED | OWNER-SEC-001 | Server/Edge API | Supabase auth/secrets | 2026-10-23 |
| RESOURCE-001 | Learning resource intelligence | Learn | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-LEARN-001 | Resource catalog, recommendations, admin review | Resource metadata, health worker, review workflow | 2026-10-23 |
| LEARN-008 | Module completeness contract | Learn | Critical | Mission Critical | IN_TESTING | OWNER-LEARN-001 | Module viewer, labs, assessments, evidence | Learning schema, practice validators, portfolio | 2026-10-23 |
| CERT-001 | Certification domain mapping | Career | Critical | Mission Critical | IN_TESTING | OWNER-LEARN-001 | Certification hub, objective map | Certification objectives, learning/practice catalog | 2026-10-23 |
| CAREER-007 | Role operating model | Career | Critical | Mission Critical | IN_TESTING | OWNER-CAREER-001 | Role hub, job simulations, career dashboard | Role catalog, tasks, metrics, evidence | 2026-10-23 |
| FOUNDATION-001 | Foundation resource quality standard | Learn | Critical | Mission Critical | PLANNED | OWNER-LEARN-001 | Foundation paths and modules | Curated resources, labs, assessments, rubric | 2026-10-23 |
| CERT-002 | Certification objective contract | Career | Critical | Mission Critical | PLANNED | OWNER-LEARN-001 | Certification objective pages and work mappings | Certification catalog, resources, labs, simulations, evidence | 2026-10-23 |
| FOUNDATION-002 | Foundation assessment blueprints | Learn | Critical | Mission Critical | IN_TESTING | OWNER-LEARN-001 | Foundation assessments and capstone | Foundation curriculum, labs, rubric, readiness | 2026-10-23 |
| GOVERNANCE-001 | Master audit and perfection framework | Core | Critical | Mission Critical | PLANNED | OWNER-ENGINEERING-001 | Audit reports, CI checks, release gates | Registry, traceability, tests, monitoring | 2026-10-23 |
| NOTES-001 | Notes vault | Account | High | Important | IN_DEVELOPMENT | OWNER-PRODUCT-001 | Profile/lab notes | Notes service/data | 2026-10-23 |
| GAME-001 | XP/levels/badges | Learn | High | Important | IN_DEVELOPMENT | OWNER-LEARN-001 | Dashboard/Profile | ChallengeContext | 2026-10-23 |
| GAME-002 | Streaks/achievements | Learn | High | Important | IN_DEVELOPMENT | OWNER-LEARN-001 | Widgets/Profile | Progress data | 2026-10-23 |
| RT-001 | Event engine | Analytics | Critical | Mission Critical | PLANNED | OWNER-DATA-001 | Backend/database | Event contracts | 2026-10-23 |
| RT-002 | Realtime progress | Analytics | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-DATA-001 | Supabase subscriptions | RLS/channels | 2026-10-23 |
| ANALYTICS-001 | Learner analytics | Analytics | High | Important | IN_DEVELOPMENT | OWNER-DATA-001 | Dashboard/admin | Progress/events | 2026-10-23 |
| ANALYTICS-002 | Admin analytics | Admin | High | Important | IN_DEVELOPMENT | OWNER-DATA-001 | AdminDashboard | Durable event store | 2026-10-23 |
| ADMIN-001 | Admin console | Admin | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-ADMIN-001 | `/admin` | Server RBAC | 2026-10-23 |
| ADMIN-002 | Learner registry | Admin | High | Important | IN_DEVELOPMENT | OWNER-ADMIN-001 | AdminDashboard | User profiles | 2026-10-23 |
| ADMIN-003 | Content operations | Admin | High | Important | PLANNED | OWNER-ADMIN-001 | Admin/CMS | Content tables/RLS | 2026-10-23 |
| ADMIN-004 | Security/audit center | Admin | Critical | Mission Critical | IN_DEVELOPMENT | OWNER-SEC-001 | Enclave/admin | Audit events | 2026-10-23 |
| OPS-001 | Health monitoring | Operations | High | Important | IN_DEVELOPMENT | OWNER-OPS-001 | Health widgets/backend | Metrics | 2026-10-23 |
| OPS-002 | CI/CD and security scans | Operations | High | Important | IN_DEVELOPMENT | OWNER-OPS-001 | Repository workflows | GitHub Actions | 2026-10-23 |

## Feature decision matrix

Every redesign decision must use one of:

| Decision | Meaning |
|---|---|
| Preserve | Keep behavior and migrate only presentation/organization |
| Merge | Combine surfaces while retaining all capabilities and redirecting routes |
| Upgrade | Improve implementation without changing contract |
| Replace | Build a new implementation with a tested migration path |
| Retire | Only after deprecation, reference migration, validation, and explicit approval |

## Traceability requirements

Each registry entry must eventually link to:

- Business goal
- Learning goal
- Career goal
- User benefit
- UI components and routes
- Database tables/RLS policies
- API/Edge endpoints
- Events and analytics
- Admin visibility
- Security review
- Test evidence
- Documentation

## Orphan audit

The repository currently contains a broad code/content surface. Before consolidation, run import/reference analysis for pages, components, services, data files, routes, and assets. An orphan result is a migration task, not permission to delete. Record the result in `ORPHAN_REPORT.md`.
