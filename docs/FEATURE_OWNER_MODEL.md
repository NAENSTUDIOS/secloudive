# Feature Owner Model

## Owner types

| Owner ID | Responsibility |
|---|---|
| `PRODUCT_OWNER` | Vision, business goals, prioritization, product experience |
| `LEARNING_OWNER` | Curriculum, learning outcomes, assessments, reading, slides |
| `ENGINEERING_OWNER` | Code, architecture, implementation, quality |
| `SECURITY_OWNER` | Authentication, authorization, RLS, secrets, security controls |
| `AI_OWNER` | NAEN AI, prompts, context, safety, quality, AI operations |
| `DATA_OWNER` | Analytics, events, reporting, metrics, data quality |
| `OPERATIONS_OWNER` | Deployment, monitoring, availability, backups, incident response |
| `ADMIN_OWNER` | Admin experience, moderation, governance, content operations |

Every feature has one `primary_owner` and may have one or more `secondary_owners`.

## Assigned portfolio owners

| Owner ID | Title | Scope |
|---|---|---|
| `OWNER-PRODUCT-001` | Platform Product Owner | Home, navigation, roadmaps, learning experience, career experience |
| `OWNER-ENGINEERING-001` | Platform Engineering Owner | Code, architecture, route integrity, implementation quality, and technical delivery |
| `OWNER-LEARN-001` | Learning Systems Owner | Learning paths, modules, rooms, assessments, reading, slides |
| `OWNER-PRACTICE-001` | Practice Platform Owner | Labs, battle rooms, threat hunts, investigations, projects, playbooks |
| `OWNER-CAREER-001` | Career Systems Owner | Resume scanner, portfolio, interviews, readiness, internships |
| `OWNER-AI-001` | NAEN AI Owner | AI tutor, notes, guidance, AI analytics, AI monitoring |
| `OWNER-SEC-001` | Security Owner | Authentication, authorization, RLS, admin authorization, audit logs |
| `OWNER-DATA-001` | Data and Insights Owner | Realtime events, analytics warehouse, reports, dashboards, metrics |
| `OWNER-OPS-001` | Platform Operations Owner | Deployments, CI/CD, monitoring, backups, incident response |
| `OWNER-ADMIN-001` | Administration Owner | Admin experience, learner registry, moderation, content operations, governance |

## Owner responsibilities

The primary owner:

1. Maintains feature requirements and acceptance criteria.
2. Reviews dependencies and risk.
3. Ensures tests and documentation exist.
4. Approves lifecycle status transitions within their authority.
5. Coordinates rollback and incident response.

Secondary owners review cross-domain impact and must approve changes affecting their responsibility area.

## Feature record template

```yaml
feature_id: FEATURE-001
feature_name: Example feature
domain: Learn
description: Short purpose statement
current_status: PLANNED
priority: High
business_criticality: Important
primary_owner: OWNER-LEARN-001
secondary_owners:
  - OWNER-ENGINEERING-001
dependencies: []
routes: []
database_tables: []
events_produced: []
events_consumed: []
rls_policies: []
analytics_impact: None
ai_impact: None
portfolio_impact: None
learning_impact: None
career_impact: None
security_impact: None
testing_coverage: Not started
documentation_link: ./feature-doc.md
last_updated: 2026-10-23
version: 1.0
```

## Governance rule

No feature may exist outside the Master Feature Registry. If ownership is unknown, the feature is `BLOCKED`, not ownerless.
