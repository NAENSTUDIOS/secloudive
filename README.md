# SecLoudive

The repository includes a deployable React/Vite product workspace in
`apps/frontend`. It uses React Router, TailwindCSS, Axios, and Supabase Auth,
PostgreSQL, Row Level Security, and private Storage. Deploy the frontend to
Vercel and apply `supabase/migrations/20261108230000_secloudive_product_workspace.sql`
to the Supabase project.

```powershell
corepack pnpm install
corepack pnpm --filter @secloudive/frontend dev
```

Set `apps/frontend/.env.local` from `apps/frontend/.env.example`. The frontend
supports signup, login, password recovery, protected dashboard routes, product
CRUD/search, admin role management, activity history, and RLS-backed storage.

The existing learning-resource prototype remains under `apps/web` and
`content/`; it is separate from the Vite product workspace.

## Cloud Security Academy frontend

The Vite workspace includes the academy routes `/academy`, `/paths/:track`,
`/modules/:moduleId`, `/labs/:labId`, `/scenarios`, `/resources`, and
`/admin/resources`. It uses the backend contracts in the Cloud Security
Academy specification and falls back to bundled demo data when
`VITE_USE_MOCKS=true`. Authentication uses Supabase sessions for email/password
and sends the Supabase access token as a bearer token to the Express API. Google
sign-in uses the Express OAuth session at `${VITE_API_BASE_URL}/auth/google`;
both flows are accepted by the backend.

## Academy backend deployment

The Express academy backend lives in `apps/backend` and deploys to Render.
Set its root directory to `apps/backend`, build command to `npm install`, start
command to `npm start`, and health check to `/api/health`. Do not deploy
`apps/frontend` to Render; Vite is deployed on Vercel. If Render reports
`vite: not found`, the Render service is using the wrong root directory or
build command. Change the service settings to exactly the values above and
redeploy. Set the environment
variables documented in `render.yaml`; secrets stay in the Render dashboard.

The React frontend deploys to Cloudflare Pages with build command `npm run build`
from `apps/frontend`, output directory `dist`, and `VITE_API_BASE_URL` pointing
at the Render service. `apps/frontend/public/_redirects` preserves SPA routes.
For local development, copy `apps/frontend/.env.example` and
`apps/backend/.env.example` to `.env.local`/`.env` respectively. Set
`FRONTEND_ORIGIN` to the exact frontend origin, and set
`GOOGLE_CALLBACK_URL` to `${backend-origin}/api/auth/google/callback`. Never
place `SUPABASE_SERVICE_ROLE_KEY`, Google secrets, or LLM keys in the frontend.

### Vercel frontend setup

Use `apps/frontend` as the Vercel **Root Directory**. Use `npm run build` as
the build command and `dist` as the output directory. Add these Project
Environment Variables:

- `VITE_SUPABASE_URL`: the Supabase project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: the Supabase publishable/anon key.
- `VITE_API_BASE_URL`: the deployed Render API URL ending in `/api`.
- `VITE_USE_MOCKS`: `false`.

The committed [vercel.json](./apps/frontend/vercel.json) provides the SPA
fallback for React Router. The Vercel frontend origin must exactly match the
backend `FRONTEND_ORIGIN` value, and that origin must also be added to the
Supabase Auth redirect allowlist.

Secloudive is a privacy-first, evidence-based AWS security learning platform.

The repository is currently in **Phase 0: engineering foundation**. Product
functionality will be added only after the approved architecture, privacy,
security, content-rights, and traceability requirements are implemented in
small, reviewable phases.

## Repository layout

- `apps/` contains deployable applications.
- `packages/` contains shared contracts, validation, domain rules, and tooling.
- `content/` contains version-controlled, provenance-tracked learning content.
- `database/` contains schema and seed definitions.
- `docs/` contains architecture, requirements, security, privacy, and operations records.
- `infrastructure/` contains reviewed infrastructure-as-code.

## Content rights

Internet resources may inform research, but Secloudive content must be
original or explicitly compatible with its license. Every content item must
record provenance, licensing, review status, and ownership before publication.

## Local setup

1. Install Node.js and pnpm.
2. Copy `.env.example` to `.env`.
3. Run `pnpm install`.
4. Run `pnpm check`.

No production credentials or real AWS credentials are required for Phase 0.
