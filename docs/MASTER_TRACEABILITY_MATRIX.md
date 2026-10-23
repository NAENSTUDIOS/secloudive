# Master Traceability Matrix

**Version:** 1.0  
**Owner:** `OWNER-DATA-001`  
**Last updated:** 2026-10-23  
**Release rule:** A feature cannot move to `READY_FOR_PRODUCTION` until every required traceability column has an owner, implementation reference, test reference, and documentation link.

## Required trace

Every feature in [MASTER_FEATURE_REGISTRY.md](./MASTER_FEATURE_REGISTRY.md) must trace to:

1. Business goal
2. Learning goal
3. Career goal
4. Technical component
5. Database tables
6. Events
7. Analytics
8. Tests
9. Documentation

`N/A` is not a valid production value. If a field does not apply, record `None - owner approved` with a reason.

## Platform traceability

| Feature ID | Business goal | Learning goal | Career goal | Technical component | Database tables | Events | Analytics | Tests | Documentation |
|---|---|---|---|---|---|---|---|---|---|
| CORE-001 | Explain platform value and convert visitors | Discover learning routes | Understand target roles | `src/pages/Home.jsx`, `src/components/Hero.jsx` | None - public surface | `page_viewed`, `catalog_cta_clicked` | Landing conversion | Home route, responsive, accessibility | `MASTER_PLATFORM_INVENTORY.md`, `00_MASTER_VISION.md` |
| CORE-002 | Make platform capabilities discoverable | Navigate learning and practice | Find career tools | `src/components/Navbar.jsx`, `Footer.jsx` | None - shell | `navigation_clicked` | Navigation funnel | Route/link, keyboard, mobile | `MASTER_PLATFORM_INVENTORY.md` |
| CORE-003 | Preserve reliable access to every capability | Reach paths and activities | Reach career and portfolio tools | `src/routes/AppRoutes.jsx` | None - router | `route_viewed`, `route_error` | Route coverage | Route matrix, deep-link, redirect | `MASTER_PLATFORM_INVENTORY.md`, `ORPHAN_REPORT.md` |
| CORE-004 | Protect privileged operations | Learn secure access patterns | Demonstrate access governance | `AdminGuard`, AuthContext, server RBAC target | `profiles`, `admin_roles` target | `authorization_denied`, `admin_accessed` | Authorization failures | Positive/negative authorization, RLS | `11_SECURITY_ARCHITECTURE.md`, `FEATURE_STATUS_GOVERNANCE.md` |
| AUTH-001 | Reduce login friction securely | Understand federated identity | Use enterprise identity workflows | Google GIS, Supabase `signInWithIdToken` | `auth.users`, `profiles` | `auth_started`, `auth_succeeded`, `auth_failed` | Login conversion and failure rate | Google login, callback, fail-closed | `SUPABASE_SETUP_GUIDE.md` |
| AUTH-002 | Provide reliable account access | Learn account/session hygiene | Maintain professional identity | `AuthContext`, onboarding forms | `auth.users`, `profiles` | `auth_started`, `auth_succeeded`, `auth_failed` | Auth funnel | Registration, login, logout, reset | `SUPABASE_SETUP_GUIDE.md` |
| LEARN-001 | Increase learning completion | Build structured cloud skills | Improve role readiness | `LearningCenter`, learning data | `learning_paths`, `learning_modules`, `progress` target | `path_viewed`, `module_started`, `module_completed` | Completion, time, drop-off | Path/module/content parity | `02_LEARNING_ARCHITECTURE.md` |
| LEARN-002 | Make authoritative learning discoverable | Select a coherent path | Map skills to target roles | `OfficialLearningPaths`, path data | `learning_paths` target | `path_selected` | Path selection and progression | Catalog/filter/deep-link | `RESOURCE_INTELLIGENCE_SYSTEM.md` |
| LEARN-003 | Teach applicable concepts | Connect theory to tasks | Build job-ready knowledge | `InteractiveTopicEngine`, topic data | `topics`, `topic_checks` target | `topic_started`, `knowledge_check_completed` | Skill mastery | Topic rendering, quiz integrity | `02_LEARNING_ARCHITECTURE.md` |
| LEARN-006 | Preserve measurable progress | Reflect mastery accurately | Evidence readiness | `ChallengeContext`, progress service | `progress`, `activity_attempts` target | `progress_updated`, `module_completed` | Progress and retention | Save/resume/isolation | `LIVE_DATA_ARCHITECTURE.md` |
| PRACTICE-001 | Convert knowledge into capability | Safely practice cloud work | Produce verifiable evidence | `RealLabs`, `InteractiveTerminal`, validation engine target | `labs`, `lab_attempts`, `lab_evidence` target | `lab_started`, `lab_step_completed`, `lab_completed` | Accuracy, hints, failures | Lab validation and safe mode | `REAL_JOB_SIMULATION_OS.md` |
| PRACTICE-003 | Develop investigation judgment | Analyze realistic evidence | Demonstrate incident response | `InvestigationSimulator`, `EvidenceViewer` | `investigations`, `evidence_items`, `investigation_reports` target | `investigation_started`, `finding_recorded`, `investigation_submitted` | Detection and investigation quality | Evidence, scoring, report | `REAL_JOB_SIMULATION_OS.md` |
| PRACTICE-005 | Produce end-to-end outcomes | Apply multiple skills | Create portfolio projects | `CloudProjects`, project data | `projects`, `project_artifacts` target | `project_started`, `project_completed` | Project quality and completion | Project lifecycle/export | `04_LAB_SYSTEM.md` |
| CAREER-001 | Improve employability | Identify skill gaps | Prepare for role expectations | `MasterEmployabilityHub`, `RoleSkillGapDashboard` | `profiles`, `skills`, `role_targets` target | `role_selected`, `skill_gap_viewed` | Readiness score and gaps | Calculation fixtures and regression | `06_CAREER_SYSTEM.md` |
| CAREER-005 | Make work verifiable | Capture applied learning | Give recruiters evidence | `PortfolioEvidenceCard`, export utilities | `portfolio_artifacts`, `evidence` target | `portfolio_artifact_created`, `portfolio_exported` | Artifact views and exports | Evidence integrity/export | `06_CAREER_SYSTEM.md` |
| CAREER-006 | Connect study to certification | Validate domain mastery | Plan certification progression | Certification data and certificate UI | `certifications`, `certificates` target | `certification_started`, `certificate_issued` | Readiness and pass metrics | Certificate issuance/verification | `08_CERTIFICATION_SYSTEM.md` |
| AI-001 | Increase learning support safely | Explain without replacing practice | Improve interview and career preparation | `aiGateway`, `SentinelAssistant` | `ai_sessions`, `ai_messages` target | `ai_session_started`, `ai_chat_completed` | Usage, quality, safety | Auth, prompt injection, citation | `07_AI_MENTOR_SYSTEM.md` |
| AI-004 | Improve trust in recommendations | Learn from authoritative material | Defend technical decisions | Citation/retrieval target | `resources`, `resource_citations` target | `citation_shown`, `citation_feedback` | Citation coverage and feedback | Citation/source validation | `RESOURCE_INTELLIGENCE_SYSTEM.md` |
| AI-005 | Protect provider credentials | Learn secure AI operations | Model production security practice | Authenticated server/Edge proxy target | `ai_audit_events` target | `ai_request_allowed`, `ai_request_blocked` | Latency, errors, abuse | Secret exposure, rate limit, auth | `11_SECURITY_ARCHITECTURE.md` |
| NOTES-001 | Retain learner context | Reflect and consolidate learning | Maintain work notes and evidence | Notes service/UI target | `notes`, `note_tags` target | `note_created`, `note_updated`, `note_exported` | Note usage and retrieval | CRUD, isolation, export | `07_AI_MENTOR_SYSTEM.md` |
| RT-001 | Build trustworthy product insight | Observe learning behavior | Measure readiness outcomes | Event ingestion target | `events`, `event_dead_letters` target | All versioned domain events | Funnels, retention, quality | Schema, idempotency, retry | `EVENT_CONTRACTS.md` |
| ANALYTICS-001 | Improve learner outcomes | Identify blockers | Measure job readiness | Analytics views/dashboard | `events`, aggregate views | `analytics_query_executed` | Completion, skill, career metrics | Metric fixtures and privacy | `LIVE_DATA_ARCHITECTURE.md` |
| ADMIN-001 | Operate the platform responsibly | Improve content and learner support | Review evidence and quality | `AdminDashboard`, admin services | `admin_roles`, `audit_logs` | `admin_action`, `audit_record_created` | Operations and governance | RBAC, audit, export | `FEATURE_OWNER_MODEL.md` |
| ADMIN-003 | Maintain authoritative content | Keep resources current | Preserve skill-market alignment | CMS target and resource workflow | `resources`, `resource_reviews` target | `resource_submitted`, `resource_verified` | Resource quality and freshness | Review workflow, broken-link scan | `RESOURCE_INTELLIGENCE_SYSTEM.md` |
| LEARN-008 | Guarantee applied learning | Complete understanding through performance | Build demonstrable capability | Module completeness contract | `learning_modules`, `module_requirements` target | `module_completed`, `module_evidence_created` | Section completion and outcomes | Module contract validator | `MODULE_COMPLETENESS_CONTRACT.md` |
| CERT-001 | Make certification preparation job-relevant | Master each certification domain | Map credentials to role capability | Certification mapping engine | `certifications`, `certification_domains` target | `certification_domain_completed`, `certification_readiness_updated` | Domain readiness and evidence coverage | Mapping completeness and readiness | `CERTIFICATION_DOMAIN_MAPPING.md` |
| CAREER-007 | Explain and simulate professional roles | Practice role-specific work | Measure job readiness and promotion | Role operating model | `roles`, `role_tasks`, `role_metrics` target | `ticket_started`, `manager_review_completed`, `role_readiness_updated` | Role performance and promotion readiness | Role coverage and scoring | `ROLE_OPERATING_MODEL.md` |
| FOUNDATION-001 | Prevent weak prerequisites | Build durable foundational understanding | Qualify learners for advanced roles | Foundation quality pipeline | `foundation_topics`, `foundation_attempts` target | `foundation_assessment_completed`, `foundation_graduated` | Foundation mastery and remediation | Rubric, lab, troubleshooting, interview | `FOUNDATION_RESOURCE_QUALITY_STANDARD.md` |
| CERT-002 | Make every certification objective practical | Connect exam domains to real work | Demonstrate role capability through evidence | Certification objective contract | `certification_objectives`, `objective_mappings` target | `certification_objective_completed`, `portfolio_artifact_created` | Objective readiness and mapping coverage | Mapping completeness and objective gate | `CERTIFICATION_OBJECTIVE_CONTRACT.md` |
| FOUNDATION-002 | Produce reliable entry-level capability | Validate foundation understanding and practice | Qualify learners for advanced role tracks | Foundation assessment engine | `foundation_assessments`, `foundation_attempts` target | `foundation_assessment_completed`, `foundation_capstone_completed` | Readiness bands and remediation | Blueprint, practical exam, capstone | `FOUNDATION_ASSESSMENT_BLUEPRINTS.md` |
| GOVERNANCE-001 | Prevent quality and safety regressions | Keep learning and practice trustworthy | Protect learner and recruiter outcomes | Audit pipeline and release gates | `audit_runs`, `audit_findings` target | `audit_started`, `audit_finding_created`, `release_blocked` | Quality, risk, and remediation trends | Automated, specialist, human approval | `MASTER_AUDIT_FRAMEWORK.md` |
| OPS-001 | Maintain availability | Learn operational discipline | Demonstrate production readiness | Health checks and monitoring | `health_checks`, metrics target | `health_check_failed`, `incident_opened` | Availability, latency, error rate | Health and alert tests | `13_PRODUCTION_READINESS.md` |

## Coverage of remaining registry entries

The following IDs inherit their trace from the listed parent system and require a feature-specific row before `READY_FOR_PRODUCTION`:

| Registry IDs | Parent trace | Required next action |
|---|---|---|
| AUTH-003, AUTH-004, AUTH-005, AUTH-006 | Authentication and security | Add route, event, RLS, and test evidence |
| LEARN-004, LEARN-005, LEARN-007, GAME-001, GAME-002 | Learn and progression | Add resource, assessment, and analytics evidence |
| PRACTICE-002, PRACTICE-004, PRACTICE-006, PRACTICE-007 | Practice and validation | Add activity-specific validators and evidence schema |
| CAREER-002, CAREER-003, CAREER-004 | Career systems | Add role, interview, and simulation evidence |
| AI-002, AI-003 | AI mentor | Add safety, hint, and context-boundary tests |
| RT-002, ANALYTICS-002 | Data and realtime | Add channel, RLS, and metric evidence |
| ADMIN-002, ADMIN-004 | Admin and security | Add server authorization and audit evidence |
| OPS-002 | Operations | Add workflow, scan, deployment, and rollback evidence |

This is an explicit coverage queue, not a waiver. The release gate remains blocked while required rows are incomplete.

## Requirements traceability

| Requirement ID | Requirement | Features | Events | Status | Owner |
|---|---|---|---|---|---|
| RTM-001 | Public catalog browsing | LEARN-001, LEARN-002, CAREER-001 | `catalog_viewed`, `path_selected` | IN_DEVELOPMENT | OWNER-PRODUCT-001 |
| RTM-002 | Real-time progress tracking | RT-001, RT-002, LEARN-006 | `module_completed`, `lab_completed`, `project_completed` | PLANNED | OWNER-DATA-001 |
| RTM-003 | NAEN AI mentor | AI-001, AI-002, AI-003, AI-004 | `ai_chat_completed`, `ai_hint_requested` | IN_DEVELOPMENT | OWNER-AI-001 |
| RTM-004 | Safe role-based job simulation | PRACTICE-001, PRACTICE-003, CAREER-003 | `ticket_started`, `validation_completed`, `manager_reviewed` | PLANNED | OWNER-PRACTICE-001 |
| RTM-005 | Authoritative resource curation | LEARN-002, AI-004, ADMIN-003 | `resource_verified`, `resource_deprecated` | PLANNED | OWNER-LEARN-001 |

## No-feature-left-behind release gate

Release is blocked when any feature is missing:

- Owner
- Allowed status
- Traceability row
- Tests
- Documentation
- Events
- Analytics impact
- Security review
- Rollback plan
- Monitoring
