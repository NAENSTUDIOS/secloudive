# Learning Resource Intelligence System

**Owner:** `OWNER-LEARN-001`  
**Secondary owner:** `OWNER-DATA-001`  
**Status:** `PLANNED`  
**Priority:** Critical

## Mission

SeCloudive curates authoritative cloud, security, DevOps, architecture, and career resources so learners can study, practice, validate, and build evidence without relying on unreviewed search results.

The system recommends resources; it does not silently copy or republish third-party content. Store metadata, attribution, canonical URLs, short summaries, and learner-created notes. Respect provider terms, robots policies, licensing, and takedown requests.

## Authority hierarchy

| Tier | Sources | Default trust |
|---|---|---:|
| 1 | AWS, Microsoft Learn, Google Cloud, Kubernetes, Terraform, Linux, OWASP, MITRE, NIST, CIS, CNCF documentation | 1.00 |
| 2 | AWS Skill Builder, Microsoft Learn paths, Google Cloud Skills Boost, HashiCorp Learn, Docker, Kubernetes Training, CNCF courses | 0.90 |
| 3 | TryHackMe, Hack The Box, Cloud Academy, A Cloud Guru, KodeKloud, Coursera, edX, Udemy Business, Pluralsight, LinkedIn Learning | 0.75 |
| 4 | AWS, Microsoft, Google, Cloudflare, Netflix, Uber, HashiCorp, CNCF, MITRE, OWASP technical publications | 0.80 |
| 5 | GitHub, Medium, Dev.to, Reddit, Stack Overflow, YouTube | 0.45 until reviewed |

Tier is a starting signal, not a substitute for review.

## Resource record

```text
resource_id, title, description, resource_type, author, url, provider,
domain, difficulty, estimated_minutes, skills, score, verification_status,
last_reviewed, created_at, updated_at, license, canonical_url, reviewer_id
```

Allowed `resource_type` values: Documentation, Video, Lab, Course, GitHub Repository, Cheat Sheet, Whitepaper, Case Study, Blog, Research Paper, Certification Guide, Architecture Guide, Security Advisory, Playbook, Reference Architecture.

Allowed `verification_status` values: Pending, Verified, Approved, Deprecated, Broken, Outdated.

## Score

```text
score =
  authority_score * 0.30 +
  accuracy_score * 0.20 +
  recency_score * 0.15 +
  practical_value_score * 0.15 +
  career_value_score * 0.10 +
  community_rating_score * 0.10
```

Each component is normalized to 0-100 and must retain reviewer evidence. Community ratings cannot raise an unverified resource to `Approved`.

## Review workflow

1. Ingest metadata from an allowed source.
2. Canonicalize and deduplicate the URL.
3. Check HTTP status, redirects, TLS, and content availability.
4. Identify provider, publication date, version, and deprecation notices.
5. Assign domain, skills, difficulty, and estimated time.
6. Score authority, accuracy, recency, practical value, career value, and community signal.
7. Require human review for security, certification, incident, and production guidance.
8. Mark `Verified` or `Approved` with reviewer and evidence.
9. Recheck links and freshness on a scheduled cadence.
10. Mark broken/outdated/deprecated resources and notify affected modules.

Reject clickbait, AI-generated spam, unverified tutorials, misleading content, and outdated security advice.

## Module completeness contract

Every module must reference:

- Primary reading
- Official documentation
- Architecture diagram
- Video or alternative visual explanation
- Cheat sheet
- Practical lab
- Assessment
- Career relevance
- Interview relevance
- Portfolio relevance

Missing references block the module from `READY_FOR_STAGING`.

## Recommendation inputs and outputs

Inputs: current role, target role, progress, skill gaps, completed modules, failed checks, career goal, certification goal, and resource history.

Outputs: ranked readings, labs, projects, certifications, videos, documentation, and an explanation of why each item was recommended.

Recommendations must be explainable, scoped to the learner's permissions, and based on verified resources by default.

## Resource health events

Emit:

- `resource_submitted`
- `resource_verified`
- `resource_approved`
- `resource_link_checked`
- `resource_broken`
- `resource_outdated`
- `resource_deprecated`
- `resource_recommended`
- `resource_feedback_submitted`

Never expose provider credentials in the browser. Health checks run from a controlled server or scheduled worker.

