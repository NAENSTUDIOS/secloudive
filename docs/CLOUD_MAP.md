# SeCloudive Cloud Map

## Current cloud-related surfaces

| Capability | Current implementation | Truth |
|---|---|---|
| Frontend hosting | `amplify.yml`, Vite build, deployment docs | Frontend deployment supported |
| Database/auth | Supabase client, migrations, RLS | Optional environment integration |
| AWS learning | Incidents, labs, guides, feeds, IaC templates | Strong educational content |
| Multi-cloud learning | Provider filters and crosswalk data | Content-focused |
| Local cloud inspection | Optional LocalStack-aware Python tools | Local/test capability |
| Cloud provisioning | No production provisioning path verified | Not implemented |
| Cost safety | Safe lab calculator and simulated FinOps state | Local simulation |
| Live intelligence | RSS/jobs/feed services and proxies | Partial; endpoint drift |

## Safety boundary

The platform should default to simulated/safe educational state. Any future real
cloud sandbox must enforce:

- isolated accounts/projects/subscriptions;
- per-user and per-organization quotas;
- deny-by-default IAM and short-lived credentials;
- network isolation and egress controls;
- budget alarms and hard spend limits;
- automatic teardown with verified cleanup;
- immutable audit events;
- explicit learner consent and clear live/simulated labels.

## Deployment gaps

- Vite/Amplify deployment is documented, but the FastAPI service has no unified
  production hosting/base URL contract.
- No Docker/Kubernetes/Terraform deployment manifests were verified.
- No CI/CD pipeline with security scanning and environment promotion was
  verified.
- No Prometheus/Grafana/tracing/SLO contract was verified.

## Incremental roadmap

1. Stabilize frontend/backend API and identity contracts.
2. Add secure backend deployment and observability.
3. Add provider-neutral sandbox interfaces with a simulated adapter first.
4. Introduce real cloud adapters only behind quotas, policy checks, and tests.
