# Certification Domain Mapping System

**Owner:** `OWNER-LEARN-001`  
**Secondary owners:** `OWNER-CAREER-001`, `OWNER-PRACTICE-001`  
**Status:** `PLANNED`  
**Priority:** Critical

## Mission

Every certification objective must become practical work:

`Domain -> Concepts -> Foundation skills -> Resources -> Guided lab -> Independent lab -> Job task -> Threat scenario -> Investigation -> Architecture review -> Project -> Documentation -> Interview -> Portfolio evidence -> Career role`

Certification readiness is not a quiz score. It is demonstrated capability plus validated knowledge.

## Certification catalog

The mapping engine must support the existing certification scope:

- AWS Cloud Practitioner, Solutions Architect Associate, Developer Associate, SysOps Administrator, Security Specialty
- Azure Fundamentals, Administrator, Solutions Architect Expert, Security Engineer
- Google Cloud foundational and associate/professional tracks
- Kubernetes CKA, CKAD, and CKS
- Terraform Associate
- CompTIA Security+ and CySA+
- CISSP

Certification objectives and URLs must be versioned because exam guides change.

## Domain record

```yaml
mapping_id: CERT-MAP-000
certification_id: AWS-SCS
certification_version: ""
domain_id: ""
objective_text: ""
concepts: []
foundation_topics: []
resource_ids: []
guided_lab_ids: []
independent_lab_ids: []
job_task_ids: []
threat_scenario_ids: []
investigation_ids: []
architecture_review_ids: []
project_ids: []
documentation_task_ids: []
interview_question_set_ids: []
portfolio_artifact_types: []
role_ids: []
assessment_id: ""
status: PLANNED
owner: OWNER-LEARN-001
last_reviewed: 2026-10-23
```

## Example: IAM domain

`IAM objective -> identity fundamentals -> official IAM documentation -> policy evaluation lab -> permission audit job ticket -> excessive-permission investigation -> privilege-escalation threat hunt -> least-privilege architecture review -> IAM remediation project -> audit report -> manager review -> interview defense -> portfolio evidence`

## Readiness gates

For each objective, the learner must complete:

1. Required foundation prerequisites.
2. At least one authoritative reading and one visual explanation.
3. A guided lab and independent lab.
4. A job task with change-control workflow.
5. A mapped threat or incident scenario where relevant.
6. An investigation or architecture review.
7. A project or evidence package.
8. Documentation and manager review.
9. Objective-specific assessment and interview defense.

## Events

Emit `certification_selected`, `certification_domain_started`, `certification_domain_completed`, `certification_lab_completed`, `certification_readiness_updated`, `certification_review_submitted`, and `certificate_issued`.

