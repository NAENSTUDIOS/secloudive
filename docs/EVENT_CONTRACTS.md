# Event Payload Standards and Contracts

## Base contract

```json
{
  "event_id": "evt_unique_id",
  "event_version": "1.0",
  "event_type": "MODULE_COMPLETED",
  "timestamp": "2026-10-23T00:00:00Z",
  "user": {
    "user_id": "auth-uuid",
    "display_id": "SEC-12345678",
    "role": "student"
  },
  "session": {
    "session_id": "session-id",
    "device_type": "desktop",
    "ip_hash": "hashed-or-omitted"
  },
  "resource": {
    "resource_id": "module-id",
    "resource_type": "module"
  },
  "metadata": {},
  "source": {
    "page": "/learn",
    "application": "web"
  }
}
```

Never include passwords, provider tokens, raw IP addresses, API keys, or unnecessary personal data.

## Event types

`USER_REGISTERED`, `USER_LOGGED_IN`, `PATH_STARTED`, `MODULE_COMPLETED`, `ROOM_COMPLETED`, `LAB_COMPLETED`, `PROJECT_COMPLETED`, `QUIZ_COMPLETED`, `CERTIFICATE_ISSUED`, `PORTFOLIO_ARTIFACT_CREATED`, `NOTE_CREATED`, `NOTE_EXPORTED`, `AI_CHAT_COMPLETED`, `AI_HINT_REQUESTED`, `CAREER_SCORE_UPDATED`, `ACHIEVEMENT_UNLOCKED`, `ADMIN_ACTION`, `SECURITY_EVENT`, and `SYSTEM_HEALTH`.

## Priority

- Critical: security events, admin actions, certificate issuance.
- High: lab, project, and module completion.
- Medium: notes and AI interactions.
- Low: page views and button clicks.

## Delivery

Retry event insertion immediately, after 5 seconds, and after 30 seconds. Send persistent failures to a dead-letter queue. Critical events must never be silently discarded. Apply idempotency keys to prevent duplicate awards and records.

## Validation

Validate event type, version, authenticated ownership, resource relationship, timestamp, metadata size, and allowed fields server-side. Store `created_at` and immutable audit metadata.

