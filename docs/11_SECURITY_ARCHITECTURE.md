# Security Architecture

## Required controls

OAuth, MFA, server-verified sessions, RBAC, RLS, audit logs, rate limiting, input validation, secure headers, encryption, OWASP-aligned development, and safe error handling.

## Identity

Supabase Auth UUID is the authoritative identity. A separate display ID such as `SEC-XXXX` is presentation only. Local storage may cache UX state but cannot grant access, admin role, or ownership.

## Data

Users may access only their own profiles, progress, notes, certificates, and private evidence. Policies must enforce `auth.uid() = user_id`. Admin capabilities require a server-verified database role.

## AI and operations

Gemini and other provider keys remain server-side. Log failed logins, AI abuse attempts, admin actions, rate limits, and security-relevant data changes without storing secrets.

