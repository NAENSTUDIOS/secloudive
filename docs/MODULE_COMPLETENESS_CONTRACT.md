# Module Completeness Contract

**Owner:** `OWNER-LEARN-001`  
**Secondary owners:** `OWNER-PRACTICE-001`, `OWNER-CAREER-001`  
**Status:** `PLANNED`  
**Priority:** Critical

## Rule

No module may contain theory alone. A module is complete only when it connects understanding to safe practice, professional work, assessment, and evidence.

## Required module sections

Every module record must contain all sections below:

| Section | Required learner outcome |
|---|---|
| What | Define the concept and its vocabulary |
| Why | Explain the problem, value, and trade-offs |
| How | Show mechanics, configuration, and decision flow |
| Where | Identify systems and professional contexts where it is used |
| When | Identify appropriate use cases and timing |
| When not | Identify anti-patterns, limits, and alternatives |
| Risks | Explain security, reliability, cost, privacy, and operational risks |
| Best practices | Provide current, authoritative recommendations |
| Common mistakes | Show failure modes and how to diagnose them |
| Real example | Connect the concept to a realistic architecture or incident |
| Job context | Define role, ticket, tools, stakeholders, and deliverables |
| Lab | Provide guided and independent safe practice |
| Investigation | Require evidence analysis or troubleshooting |
| Project | Produce an integrated outcome |
| Documentation | Produce a runbook, report, ADR, or implementation plan |
| Assessment | Validate knowledge and applied performance |
| Interview questions | Include technical, scenario, architecture, and behavioral questions |
| Portfolio evidence | Produce a redacted, verifiable artifact |

## Completion gates

A module cannot advance to `READY_FOR_STAGING` until:

1. All required sections are present.
2. At least one authoritative resource is linked.
3. The guided lab and independent lab have validators.
4. The investigation includes synthetic evidence and an expected reasoning path.
5. The project has acceptance criteria and an exportable artifact.
6. Assessment includes a passing threshold and remediation path.
7. Interview questions map to the module skills.
8. Portfolio output contains skill, role, rubric, timestamp, and verification metadata.

## Module data contract

```yaml
module_id: LEARN-MODULE-000
title: Example module
path_id: foundations
prerequisites: []
objectives: []
what: ""
why: ""
how: ""
where: ""
when: ""
when_not: ""
risks: []
best_practices: []
common_mistakes: []
real_examples: []
job_context:
  roles: []
  tickets: []
  tools: []
  deliverables: []
resources: []
guided_lab_id: ""
independent_lab_id: ""
investigation_id: ""
project_id: ""
documentation_tasks: []
assessment_id: ""
interview_question_set_id: ""
portfolio_artifact_type: ""
status: PLANNED
owner: OWNER-LEARN-001
```

## Validation events

Emit `module_started`, `module_section_viewed`, `module_lab_completed`, `module_investigation_completed`, `module_assessment_completed`, `module_interview_completed`, `module_evidence_created`, and `module_completed`.

