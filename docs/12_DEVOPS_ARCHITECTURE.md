# DevOps Architecture

Use Docker for reproducible services, Kubernetes for deployable workloads, Terraform for infrastructure, and GitHub Actions for automation.

Pipeline:

`Build -> Test -> Security Scan -> Deploy -> Verify -> Monitor`

Required checks include dependency review, secret scanning, linting, unit tests, production build, migration safety, rollback readiness, and environment separation. Stable and development branches must have protected review and required checks.

