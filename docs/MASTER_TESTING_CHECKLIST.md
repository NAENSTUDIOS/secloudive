# Master Testing and Validation Checklist

This checklist is evidence-driven. A checked item must reference a test, query, screenshot, report, or deployment record.

## 1. Route testing

- Home, Learn, Practice, Career, and Account load.
- All legacy URLs redirect without loops.
- Valid routes have no 404s.
- Deep links, refresh, back, and forward navigation work.
- Desktop, tablet, and mobile layouts are tested.
- Success target: 100% route coverage.

## 2. Learn testing

- Path catalog, path overview, modules, and rooms load.
- All learning paths and topics remain accessible.
- Topic relationships and progression remain intact.
- Progress, completion, and certification unlocks update correctly.
- Beginner, intermediate, and advanced paths are validated.
- Success target: zero content loss.

## 3. Practice testing

- Labs, battle rooms, investigations, threat hunts, projects, and playbooks load.
- Type, difficulty, duration, search, provider, and path filters work.
- Activities launch, resume, complete, and save results.
- Success target: all activities accessible.

## 4. Content integrity

Record pre- and post-change counts for modules, rooms, labs, projects, investigations, battle rooms, threat hunts, and PDFs. Counts and relationships must match unless an approved migration explicitly changes them.

## 5. Authentication and authorization

Anonymous users can browse but cannot save private progress, access profile data, or access admin tools. Guests can use explicitly scoped temporary access. Authenticated users can log in, log out, persist sessions, and update their profile.

User A cannot read or mutate User B's notes, progress, certificates, profile, or evidence. Non-admins cannot access admin tools. Admin access is server-verified.

## 6. RLS

Attempt unauthorized reads, updates, deletes, and spoofed ownership inserts. Verify all are denied with authenticated database tests. Include positive tests for the owner and approved admin policies.

## 7. Secret exposure

Search source, bundles, source maps, localStorage, sessionStorage, and network behavior for provider keys. Browser calls only the approved proxy; the browser never calls Gemini directly.

## 8. AI proxy

Test authentication, invalid input, rate limits, retries, 429, 500, timeout, logging, key rotation, safe errors, prompt-injection handling, and context boundaries.

## 9. Notes

Test create, search, edit, delete, Markdown export, PDF export, summarization, cleanup, tagging, and data-isolation behavior.

## 10. Admin

Test secure admin login, dashboard loading, live metrics, user analytics, AI metrics, audit search/export, content lifecycle, and command permissions.

## 11. Performance

Measure Home, Learn, Practice, Career, and Account for FCP, LCP, CLS, memory behavior, lazy loading, code splitting, bundle size, and query efficiency.

Targets: FCP < 2 seconds, LCP < 3 seconds, CLS < 0.1.

## 12. Accessibility

Test keyboard-only use, focus visibility, screen readers, labels, contrast, reduced motion, dialogs, tables, form errors, touch targets, and responsive layouts against WCAG 2.2 AA.

## 13. Security regression

Test XSS, CSRF, injection, auth bypass, session misuse, privilege escalation, admin bypass, API abuse, rate limiting, and unsafe error disclosure.

## 14. Deployment

Test build, environment loading, migrations, rollback, release health checks, monitoring, backups, and post-release smoke tests in staging before production.

## Final go-live gate

Zero critical findings, zero exposed secrets, RLS verified, admin security verified, all routes tested, content counts reconciled, performance and accessibility targets measured, monitoring enabled, backup created, rollback tested, staging approved, and production approved.

