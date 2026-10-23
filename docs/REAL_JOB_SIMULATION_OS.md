# Real Job Simulation Operating System

**Owner:** `OWNER-PRACTICE-001`  
**Secondary owners:** `OWNER-LEARN-001`, `OWNER-SEC-001`, `OWNER-CAREER-001`  
**Status:** `PLANNED`  
**Priority:** Critical

## Mission

Turn cloud learning into safe, repeatable professional practice:

`Ticket -> Briefing -> Access -> Investigation -> Decision -> Change -> Validation -> Evidence -> Manager review -> Closure`

Learners practice job behavior without receiving permission to attack real systems or deploy uncontrolled infrastructure.

## Supported role tracks

- Cloud Security Engineer
- Cloud Engineer
- DevSecOps Engineer
- SOC Analyst
- Incident Responder
- Security Architect
- Solutions Architect
- Cloud Consultant

## Activity contract

Each activity includes:

| Field | Required content |
|---|---|
| `activity_id` | Stable registry identifier |
| `role` | Job role and seniority |
| `ticket` | Business request, priority, requester, SLA |
| `briefing` | Scope, assumptions, allowed actions |
| `environment_mode` | `SIMULATION` or approved `REAL_CLOUD` |
| `objectives` | Observable outcomes |
| `tasks` | Ordered steps with dependencies |
| `constraints` | Safety, cost, access, and time limits |
| `validators` | Task, policy, architecture, security, documentation, manager, AI |
| `deliverables` | Report, runbook, diagram, evidence, RCA, or change record |
| `scoring` | Accuracy, risk, quality, speed, communication, compliance |
| `framework_mappings` | AWS, MITRE ATT&CK, NIST, CIS, OWASP |
| `portfolio_outputs` | Redacted evidence package and recruiter summary |

## Standard workflow

1. Receive a ticket with business context and severity.
2. Read the scope and confirm permitted actions.
3. Inspect the simulated environment and available evidence.
4. Record observations before making changes.
5. Form a hypothesis and identify business/security impact.
6. Propose a change or containment plan.
7. Request approval when the activity requires change control.
8. Apply the change through the simulation's controlled interface.
9. Run automated and manual validation.
10. Produce documentation and evidence.
11. Defend decisions in manager/architect review.
12. Close the ticket with lessons learned and follow-up tasks.

## Initial scenario catalog

### Cloud security

- IAM permission audit and least-privilege remediation
- Public S3 exposure and sensitive-data review
- KMS key usage and rotation investigation
- Compromised IAM credential response
- GuardDuty finding triage
- CloudTrail malicious API activity investigation
- Security Hub control failure remediation
- Network segmentation and security-group review

### Cloud engineering

- Production VPC deployment request
- Private/public subnet and routing design
- EC2 deployment, hardening, patching, monitoring, and backup
- Multi-account landing-zone design
- Disaster recovery and resilience review

### Solutions architecture

- SaaS architecture review for availability, security, scale, cost, and recovery
- Well-Architected security and reliability review
- Architecture decision record and review-board presentation

### DevSecOps

- Terraform security review
- Secret detection and secure CI/CD workflow
- Container image and Kubernetes policy validation
- Pipeline change approval and evidence package

### SOC and incident response

- Unauthorized API call triage
- CloudTrail, GuardDuty, Security Hub, and CloudWatch correlation
- Credential theft, privilege escalation, resource hijacking, and exfiltration scenarios
- NIST preparation, detection, response, recovery, and continuous improvement

## Safe simulation modes

### `SIMULATION` (default)

- No cloud account required
- No external network exploitation
- Deterministic digital-twin state
- Synthetic logs, findings, identities, resources, and evidence
- Reversible state transitions
- Automated teardown after attempt expiry

### `REAL_CLOUD` (restricted)

Requires explicit opt-in, authenticated account linkage, scoped temporary credentials, allowlisted services/regions, budget limits, resource tags, cost estimate, approval, deployment log, validation, and teardown verification. The platform must refuse execution when any safety prerequisite is missing.

The browser never receives long-lived provider secrets. Real-cloud orchestration belongs behind an authenticated server boundary.

## Validation and scoring

Required validators:

- Task completion
- Architecture correctness
- Policy correctness
- Security controls
- Evidence quality
- Documentation quality
- Manager review
- AI safety and rubric alignment

Scoring dimensions:

Technical accuracy, security quality, architecture quality, investigation quality, documentation quality, decision quality, communication quality, speed, efficiency, compliance, and risk awareness.

No activity is complete because a learner clicked a button; required validators and deliverables must pass.

## Framework mapping

Every scenario maps to one or more:

- AWS Well-Architected Security Pillar
- MITRE ATT&CK Cloud tactics and techniques
- NIST incident-response lifecycle
- CIS Benchmarks
- AWS Security Hub controls
- OWASP guidance

## Evidence and portfolio

Successful activities generate only learner-owned, redacted artifacts:

- Change request
- Implementation plan
- Runbook or playbook
- Architecture diagram
- Validation report
- Incident report or RCA
- Lessons learned
- Executive summary
- Skill and role mapping
- GitHub-ready Markdown export

Evidence must not include credentials, private customer data, uncontrolled exploit instructions, or third-party copyrighted content.

## Events

- `ticket_assigned`
- `ticket_started`
- `investigation_step_completed`
- `change_requested`
- `change_approved`
- `simulation_change_applied`
- `validation_completed`
- `evidence_submitted`
- `manager_review_completed`
- `ticket_closed`
- `portfolio_artifact_created`

