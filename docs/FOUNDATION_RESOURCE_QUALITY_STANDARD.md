# Foundation Resource Quality Standard

**Owner:** `OWNER-LEARN-001`  
**Secondary owners:** `OWNER-PRACTICE-001`, `OWNER-CAREER-001`  
**Status:** `PLANNED`  
**Priority:** Critical

## Mission

Foundations must be strong enough that a learner does not fail an advanced activity because Linux, networking, Git, Python, cloud, security, documentation, or communication was taught weakly.

## Foundation domains

Computer fundamentals, operating systems, Linux, networking, Git and GitHub, Python, cybersecurity fundamentals, cloud fundamentals, documentation, and professional communication.

## Learning progression

Every foundation topic follows:

`Understand -> Visualize -> Observe -> Practice -> Simulate -> Apply -> Troubleshoot -> Explain -> Teach -> Perform`

Every lesson also contains What, Why, How, Where, When, When Not, Mistakes, Best Practices, Security Impact, Job Impact, and Certification Impact.

## Authority standard

Primary resources must come from official documentation or standards: AWS, Microsoft Learn, Google Cloud, Linux Foundation, Red Hat, Ubuntu, Kubernetes, Terraform/HashiCorp, Docker, MITRE, NIST, OWASP, CIS, and CNCF.

Official vendor training is secondary. Trusted industry education is supplementary and clearly labeled. Community content is never approved automatically.

## Quality gates

Every foundation topic must include:

- Official documentation
- Beginner explanation
- Visual explanation and diagram
- Interactive simulation
- Guided lab
- Independent lab
- Troubleshooting guide
- Real job context
- Interview questions
- Assessment
- Portfolio evidence

## Minimum competency areas

### Linux

Filesystems, permissions, users, groups, processes, services, SSH, networking, Bash, packages, monitoring, and logs.

### Networking

OSI, TCP/IP, DNS, HTTP/S, CIDR, routing, switching, NAT, load balancing, firewalls, and VPNs.

### Git and GitHub

Repositories, commits, branches, merges, pull requests, issues, workflows, releases, collaboration, and portfolio quality.

### Python

Syntax, functions, files, APIs, JSON, logging, automation, cloud SDKs, and security automation.

### Cloud and security

Compute, storage, networking, identity, monitoring, encryption, resilience, high availability, scalability, cost, threat modeling, incident response, risk, compliance, and vulnerability management.

## Foundation performance rubric

| Area | Weight |
|---|---:|
| Knowledge understanding | 20% |
| Hands-on performance | 25% |
| Troubleshooting | 15% |
| Documentation | 10% |
| Security understanding | 10% |
| Communication | 10% |
| Problem solving | 10% |

Minimum passing score: 80%, with no automatic pass when a critical security or safety criterion fails.

## Foundation graduation

Learners must complete labs, assessments, troubleshooting, documentation, simulations, mock interviews, portfolio artifacts, learning evidence, manager review, and AI review before progressing to advanced role tracks.

## Foundation events

Emit `foundation_topic_started`, `foundation_lab_completed`, `foundation_troubleshooting_completed`, `foundation_assessment_completed`, `foundation_mock_interview_completed`, `foundation_manager_reviewed`, and `foundation_graduated`.

