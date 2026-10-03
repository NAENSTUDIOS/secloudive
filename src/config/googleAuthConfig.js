/**
 * Google OAuth Configuration — NAEN Studios / SeCLOUDIVE
 *
 * SETUP INSTRUCTIONS:
 * ──────────────────
 * 1. Go to https://console.cloud.google.com/
 * 2. Create/select your project
 * 3. Go to APIs & Services → Credentials
 * 4. Create OAuth 2.0 Client ID → Web Application
 * 5. Add these Authorized JavaScript Origins:
 *    - http://localhost:5173
 *    - http://localhost:5174
 *    - http://localhost:5175
 *    - http://localhost:3000
 *    - https://your-production-domain.com  (when deploying)
 * 6. Copy the Client ID and paste it below
 * 7. No redirect URIs needed — we use popup mode (no backend)
 *
 * The Client ID is NOT a secret — it's safe to commit to frontend code.
 * It only works from authorized origins you configure above.
 */

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '997442635688-bvsb0nubr3v8ovhq05ejv1eu79d8e0c0.apps.googleusercontent.com'

/**
 * Scopes requested from Google.
 * We only need `openid profile email` — no Drive, Calendar, or other access.
 */
export const GOOGLE_SCOPES = 'openid profile email'

/**
 * Whether Google One Tap (auto-prompt) is enabled.
 * Set to false for explicit button-click only.
 */
export const GOOGLE_ONE_TAP_ENABLED = false
