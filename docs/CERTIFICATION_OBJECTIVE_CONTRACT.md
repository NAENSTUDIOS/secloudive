# Certification Objective Contract

**Owner:** `OWNER-LEARN-001`  
**Secondary owners:** `OWNER-PRACTICE-001`, `OWNER-CAREER-001`, `OWNER-SEC-001`  
**Status:** `PLANNED`  
**Priority:** Critical

## Rule

No certification objective may exist as isolated theory. Every objective must map to the complete chain:

`Learning resource -> Theory -> Visualization -> Guided practice -> Independent practice -> Threat simulation -> Job simulation -> Architecture review -> Documentation exercise -> Interview questions -> Portfolio artifact -> Career mapping`

## Objective record

```yaml
objective_id: AWS-SCS-IAM-001
certification_id: AWS-SCS
domain: Identity and Access Management
objective_text: Review and design secure identity controls
foundation_dependencies:
  - FOUNDATION-LINUX
  - FOUNDATION-NETWORKING
  - FOUNDATION-AWS
  - FOUNDATION-SECURITY
learning_resources:
  - resource_id: aws-iam-docs
  - resource_id: aws-skill-builder-iam
visualizations:
  - iam-policy-evaluation
guided_practice:
  - lab-create-iam-user
  - lab-create-iam-role
independent_practice:
  - lab-least-privilege-analysis
  - lab-permission-boundaries
threat_simulations:
  - threat-compromised-credentials
  - threat-overly-permissive-policy
job_simulations:
  - task-review-user-permissions
  - task-approve-role-change
  - task-investigate-privilege-escalation
architecture_reviews:
  - review-enterprise-iam-design
investigations:
  - investigation-cloudtrail-access
  - investigation-access-review
documentation_exercises:
  - doc-iam-audit-report
interview_questions:
  - interview-iam-scenarios
portfolio_artifacts:
  - iam-audit-report
career_roles:
  - cloud-security-engineer
  - security-architect
  - soc-analyst
status: PLANNED
owner: OWNER-LEARN-001
```

## IAM domain blueprint

The Identity and Access Management domain must cover:

- Foundations: Linux, networking, AWS fundamentals, security fundamentals
- Official resources: AWS IAM documentation and reviewed AWS Skill Builder IAM modules
- Visual assets: policy evaluation, trust relationships, federation, and cross-account diagrams
- Labs: users, roles, cross-account roles, least privilege, and permission boundaries
- Job tasks: permission review, access-request review, role-change approval, and privilege-escalation investigation
- Threat scenarios: compromised credentials, overly permissive policies, and excessive privileges
- Investigations: CloudTrail analysis and access reviews
- Architecture review: enterprise IAM design
- Portfolio artifact: IAM audit report with findings, severity, remediation, validation, and executive summary

## Objective acceptance gate

An objective is complete only when:

1. All required mappings resolve to existing records.
2. Official resources pass the resource quality threshold.
3. Guided and independent practice have deterministic validators.
4. Threat and job simulations are safe and scoped.
5. Architecture decisions are explainable.
6. Documentation is reviewed.
7. Interview defense is completed.
8. Portfolio evidence is redacted and verifiable.

