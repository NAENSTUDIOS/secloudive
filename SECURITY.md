# SecLoudive security checklist

## Secrets

- Keep `SUPABASE_SERVICE_ROLE_KEY`, Google client secrets, `SESSION_SECRET`, and
  LLM keys only in the Render environment.
- Only `VITE_` values may be exposed to the browser. Never put a Supabase
  service-role/secret key in `apps/frontend`.
- Rotate any credential pasted into chat or committed accidentally.

## OAuth redirects

- Local callback: `http://localhost:4000/api/auth/google/callback`
- Production callback: `https://<render-service>.onrender.com/api/auth/google/callback`
- Add both origins and callbacks in Google Cloud Console and the backend
  provider configuration. Add the frontend origin to CORS.

## Database

- RLS is enabled on backend-owned tables in `supabase/migrations/001_init.sql`.
- There are intentionally no anon/authenticated policies on those tables:
  the Express server uses `SUPABASE_SERVICE_ROLE_KEY` and performs authorization
  in the API layer.
- Review RLS and database advisors before production changes.

## Operational checks

- Run `npm audit --omit=dev` in `apps/backend` before deployment.
- Keep `ADMIN_EMAILS` as a small explicit allowlist.
- Render free instances sleep while idle; use `/api/health` for uptime checks,
  understanding that external keep-alive services may have their own policies.
