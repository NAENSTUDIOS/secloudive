# SeCloudive Learning Audit

## Current pedagogy

The strongest existing learning loop is:

`context -> investigation -> evidence -> finding/severity -> containment ->
remediation -> report/career evidence`.

This is implemented through investigation simulators, labs, challenges,
architecture reviews, battle rooms, threat hunts, quizzes, diagnostics,
recommendations, and employability scoring.

## Coverage

| Track | Current evidence | Status |
|---|---|---|
| AWS security | IAM, S3, networking, monitoring, architecture, incidents | Strong |
| Cloud foundations | Foundation paths, glossary, guides, diagnostics | Implemented locally |
| Multi-cloud | Provider filters, crosswalks, resource data | Partial/content-focused |
| DevOps/DevSecOps | Labs, playbooks, IaC and security scenarios | Partial |
| Kubernetes/Docker/Linux | References and selected content | Uneven |
| AI engineering/prompting | AI services and references | Partial |
| Software engineering | Supporting project/UI/backend content | No complete curriculum verified |
| Career readiness | Roles, roadmap, interview, internships, resume/export | Strong local surface |

## Lesson completeness

Reading, quizzes, labs, notes, assignments, projects, and interview guidance
exist in different combinations. No single lesson contract currently requires
every requested element, and no distinct expert/exam/proctoring system was
verified.

The existing Learning Center now also consumes the normalized
`src/data/learning/resourceLibrary.js` metadata. It covers the requested
technology tracks with a shared level 0-8 progression, official-first source
links, sandbox-safe lab prompts, project ideas, assessments, certifications
where an established mapping exists, interview prompts, career directions,
production use cases, and a maintenance plan. It is an extension of the
existing recap/resource surface, not a second learning page or resource
catalog. Empty certification mappings are intentional and avoid implying that
every technology has a current vendor exam.

Each track also exposes the complete resource contract requested by the
curriculum brief: learning objectives, difficulty, estimated effort, official,
industry, and community tiers, paid/free resource slots, books/articles/video
slots, practice exercises, seven project types, advanced/expert references,
career roadmaps, and certification mappings. Generic industry/community slots
are clearly labeled as discovery starting points; they are not endorsements of
an unverified course or salary outcome.

The contract also exposes explicit beginner, intermediate, and advanced resource
collections plus the requested 15-section output order. These are derived from
the existing official-first source data so the UI can add a richer topic view
without maintaining duplicate content.

The same blueprint now includes a realistic-work layer backed by
`src/data/learning/jobSimulationLibrary.js`: role-play manager requests,
synthetic job tickets with acceptance criteria, SEV-1 through SEV-4 incident
drills, a simulated workday, guided troubleshooting, team handoffs,
documentation and presentation tasks, production-change review stages, and
five interview seniority levels. These are deliberately sandbox-only. They
reuse the repository's existing job labs, playbooks, incident banks, case
studies, interview bank, and employability calculator rather than claiming
that SeCloudive can operate a learner's real cloud environment.

## Learning risks

- Content quality and coverage vary by track.
- Local progress is richer than guaranteed cloud persistence.
- Simulated labs must remain clearly labeled.
- Certificate eligibility and assessment integrity need explicit rules.
- Recommendations rely on client-side progress and can diverge across devices.

## Incremental improvement plan

1. Define a lesson schema: objective, official sources, reading, lab, notes,
   quiz, assignment, project, interview questions, and mastery criteria.
2. Apply it first to AWS foundations, IAM, networking, monitoring, incident
   response, and architecture.
3. Prefer official documentation and learning platforms as the first source
   tier; preserve attribution and links.
4. Add evidence-based mastery and certificate rules.
5. Add track coverage only after content quality and progress migration are
   reliable.

The metadata contract is regression-tested by
`scripts/test_learning_resource_library.mjs`. Salary claims are deliberately
represented as “not included”; compensation is too volatile and
geography-dependent to publish as a static learning fact without a maintained
source.

This audit does not invent or duplicate learning content.
