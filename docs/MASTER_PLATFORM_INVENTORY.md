# Master Platform Inventory

**Inventory version:** 1.0  
**Inventory date:** 2026-10-23  
**Status:** Phase 2 inventory gate recorded

## Purpose

This is the preservation baseline for SeCloudive. It records the current implementation surfaces before architectural consolidation. No feature, route, content source, or asset may be removed without updating this inventory, documenting the decision, and passing the validation checklist.

## Preservation baseline

The product requirements supplied by the product owner identify these content baselines:

| Asset class | Baseline |
|---|---:|
| Learning topics | 67 |
| Labs | 16 |
| Battle rooms | 13 |
| Investigations | 25 |
| Threat hunts | 25 |
| Projects | 14 |
| Case studies | 101 |
| Safe labs | 112 |
| Architecture reviews | 119 |
| Ramp-up labs | 38 |
| PDF resources | 13 |

These are protected counts. Before any content migration, run a source-specific count and save the result beside the migration evidence. A count mismatch blocks completion until reconciled.

## Source inventory

Current repository inventory:

| Surface | Current location | Approximate current files | Classification |
|---|---|---:|---|
| Pages | `src/pages/` | 26 | Category A |
| Components | `src/components/` | 88 | Category A/B |
| Services | `src/services/` | 18 | Category A |
| Data | `src/data/` | 62 | Category A |
| Context | `src/context/` | 2 | Category A |
| Utilities | `src/utils/` | 11 | Category B |
| Routes | `src/routes/` | 1 route registry | Category A |
| Styles | `src/styles/` | 24 | Category B/C |
| Supabase schema/migrations | `src/lib/`, `supabase/` | 2+ | Category A |
| Public/dist PDF assets | `public/`, `dist/` | repository snapshot varies | Category B |

The file counts are inventory hints, not content counts. Use repository scripts and data-specific parsers for exact content counts.

## Route inventory

### Home and learning

`/`, `/learning`, `/learning/:pathId`, `/learning/:pathId/:topicId`, `/learn`, `/learn/:pathId`, `/learn/:pathId/:topicId`, `/academy`, `/academy/:pathId`, `/academy/:pathId/:topicId`, `/categories`, `/roadmap`, `/exploration-roadmap`, `/career-roadmap`, `/aws-roadmap`, `/aws-guide`.

### Career and account

`/career`, `/careers`, `/ramp-up`, `/rampup`, `/career-rampup`, `/career-ramp-up`, `/aws-career`, `/dashboard`, `/profile`, `/user-profile`, `/student-profile`, `/student-portal`, `/portal`, `/report`, `/downloads`, `/internship-simulator`, `/interview-simulator`, `/interview`, `/hiring-simulator`, `/live-internships`, `/internships`, `/jobs`, `/aws-jobs`, `/cloud-jobs`.

### Practice and build

`/labs`, `/labs/:id`, `/playbooks`, `/playbooks/:id`, `/projects`, `/projects/:id`, `/battle-rooms`, `/battle-rooms/:id`, `/investigations`, `/investigations/:id`, `/challenge/:id`, `/architecture-reviews`, `/live-portal`, `/cloudive-studio`, `/builder-studio`, `/cost-calculator`, `/zero-cost-labs`.

### Threats, verification, and operations

`/threat-intel`, `/threats`, `/cves`, `/cve-radar`, `/verify-pack`, `/verify-audit-pack`, `/verify`, `/admin`, `/about`, `/legal`.

### Wildcard behavior

Unknown routes currently resolve to Home. Any future canonicalization must preserve the legacy route map and add explicit redirects where semantics change.

## Page inventory

| Domain | Pages and entry points |
|---|---|
| Public | Home, About, Legal, Downloads |
| Learn | LearningCenter, Categories, PlatformRoadmapPage, CareerRampUpDirectory |
| Practice | RealLabs, BattleRooms, InvestigationSimulator, ArchitectureReviews, CloudProjects, JobPlaybookEngine, CloudiveStudio |
| Career | InternshipSimulator, InterviewSimulator, LiveInternshipsPage, Report |
| Threat intelligence | LiveThreatIntelPage, LiveFeedPortalPage |
| Account | Dashboard, Profile, VerifyAuditPackPage |
| Admin | AdminDashboard guarded by AdminGuard |

## Component inventory

### Shell and navigation

Navbar, Footer, SeCloudiveLogo, ErrorBoundary, SafeBoundary, GlobalSecurityEnclave, GlobalCommandPalette, GlobalCyberHUD, SyncStatusBadge, WelcomeOnboardingModal, UserSyncModal.

### Identity and security

AdminGuard, GoogleSignInButton, ClearanceGateCheckpoint, ClearanceGateModal, CopyrightDisclaimer, NaenContentGuardian, SecurityBadge, UserSyncModal.

### Learning and progression

InteractiveTopicEngine, OfficialLearningPaths, StructuredLearningPathSection, LearningTrackModeSwitcher, StepWiseSkillMap, TopicArchitectureDiagram, TopicJobReadinessCard, TopicMultiCloudCrosswalk, DiagnosticPlacementModal, ProgressBar, DailyLearningStreakWidget, BadgeCard, SkillGraphView, SkillProfileRadar.

### Practice and evidence

InteractiveTerminal, TerminalPane, SafeBoundary, SafeLabCostCalculator, ChallengeCard, InvestigationCard, AttackTimeline, EvidenceViewer, PortfolioEvidenceCard, LabNotesScratchpad, CapstoneMissionsCard, ArchitectureCard, DynamicAttackGraph, DynamicTopologyCanvas.

### Career and AI

CareerRoadmap, CareerJourneyTrack, RoleSkillGapDashboard, MasterEmployabilityHub, JobProcessFramework, AIChatCopilot, SentinelAssistant, EngineerResponse, RecommendationOrchestratorView, Interview and mentor UI surfaces.

### Admin and operations

AIOperationsDashboard, HumanReviewEscalationQueue, JobApiKeysManagerModal, GeminiKeyManagerModal, AdminDashboard, LiveFeedPortal, CyberCommandDeck, GlobalSecurityCommsDeck, ForensicQueryStudio.

## Service inventory

Authentication: `AuthContext`, `googleAuthService`, `passkeyAuthService`, `userSyncManager`, `supabaseProgressService`.

AI: `aiGateway`, `aiSafetyGuardrails`, `sentinelClient`, `sentinelRetrievalEngine`, `chatKnowledgeBase`, `geminiMentorQualityEngine`, `liveGeminiIntelligenceService`, `aiErrorAutoHealer`, `geminiKeyRotator`, `aiMemoryModel`.

Career and jobs: `intelligenceEngine`, `liveJobFeedAggregatorService`, `dailyAwsSecuritySync`, `notesAiEngine`, `userSyncManager`.

## Data inventory

Learning: `src/data/learning/`, `learningResources.js`, `structuredLearningPath.js`, `stepWiseSkillMap.js`, topic question banks, module quizzes, recommendations, and badges.

Practice: labs, investigations, threat scenarios, battle rooms, expanded incident/threat/interview banks, architecture, cloud projects, IaC templates, job labs, playbooks, and simulated attacks.

Career: career intelligence, career ramp-up data, role market data, internship data, live internships, interview banks, job playbooks, and employability data.

## Authentication flows

- Google Identity Services credential flow.
- Supabase `signInWithIdToken`.
- Supabase email/password.
- Supabase magic link.
- Local isolated profile fallback when cloud is unavailable.
- Explicit guest sandbox.
- Session restoration and sign-out.
- Profile synchronization and progress hydration.

Local fallback is a resilience feature, never an authorization source.

## AI features

Sentinel Assistant, AI Chat Copilot, mentor personas, architecture review, interview feedback, career recommendations, notes assistance, resource generation, audit pack generation, live threat/job intelligence, safety guardrails, key rotation, and AI error healing.

## Admin features

AdminGuard, operations dashboard, learner registry, screenshot/security telemetry, live job feed management, diagnostic smoke tests, storage inspection, incident export, human review queue, API key management surfaces, analytics/health surfaces, and content operations.

## Downloads and assets

Downloads include PDFs, audit dossiers, Terraform/IaC bundles, Markdown/JSON exports, certificates, resumes, and learning resource packs. Preserve `public/`, `dist/`, `src/assets/`, generated exports, and named PDF references during restructuring.

## Inventory gate

This inventory is complete enough to begin architecture mapping. Before implementation of a consolidation:

1. Generate exact content counts.
2. Generate a dependency graph for the target feature.
3. Add or update the feature registry.
4. Record route redirects.
5. Validate content and route parity.

