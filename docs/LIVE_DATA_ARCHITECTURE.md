# Live Data Architecture

## Principle

Every important user action becomes an event, every event becomes durable data, every data point updates analytics, and every dashboard reflects the current source of truth.

`User Action -> Event -> Database -> Realtime -> Analytics -> Dashboard -> Recommendation`

## Data ownership

- Progress, certificates, portfolios, achievements, notes, and private evidence: database.
- Analytics: event system and materialized aggregates.
- Local storage: temporary cache and offline UX only; never authorization or primary ownership.

## Pipeline

Frontend React/Vite -> Supabase Auth -> Supabase Database -> event processing -> analytics -> Realtime channels -> learner/admin dashboards -> AI personalization.

## Events

Track registration, login, path/module/room/lab/project starts and completions, quizzes, certificates, notes, portfolio artifacts, AI chats, hints, career-score updates, achievements, admin actions, security events, and system health.

Events are versioned, traceable, auditable, searchable, reconstructable, secure, realtime-capable, analytics-ready, AI-ready, and portfolio-ready.

## Realtime channels

Use scoped channels for user progress, notes, achievements, certificates, portfolio, platform activity, admin console, security alerts, and analytics. Enforce authorization for every private channel.

## Analytics

Aggregate daily, weekly, monthly, path, module, lab, career, AI, and security metrics. Track popularity, drop-off, completion, learning time, retention, active users, AI quality/cost, errors, latency, RLS violations, broken links, and deployment health.

## Retention

- Hot: 0-90 days, realtime queries and active sessions.
- Warm: 3-12 months, analytics and progress history.
- Cold: 1+ years, archived events and audit storage.

The system must scale from 10 to 100,000+ users through indexed queries, partitioning, aggregation, event retention, and horizontally scalable services.

