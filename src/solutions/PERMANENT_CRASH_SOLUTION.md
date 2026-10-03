# SeCLOUDIVE Permanent Crash Prevention & Self-Healing Architecture
**Author:** NAEN Studios / SeCLOUDIVE Engineering  
**Version:** 4.0 Permanent Resilience Release  

---

## 1. Problem Statement & Root Cause
In complex modern React single-page applications connected to live cloud security telemetry, multi-cloud APIs, and background processes, crashes historically occurred due to:
1. **Uncaught Error Cascades**: A minor error in a tertiary widget (like a seasonal canvas particle or latency monitor) unmounted the entire application root.
2. **Infinite Reload Loops**: Automated reload heuristics refreshed the page repeatedly if an error was persistent, trapping the user.
3. **Corrupted Transient State**: Malformed JSON cached in `localStorage` caused initialization failures on app reboot.
4. **Vite Development Process Dropouts**: Background processes in Windows terminated if terminal sessions timed out, displaying `ERR_CONNECTION_REFUSED`.

---

## 2. The Multi-Layer Permanent Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │             USER BROWSER / CLIENT            │
                               └──────────────────────┬───────────────────────┘
                                                      │
                       ┌──────────────────────────────▼──────────────────────────────┐
                       │                   Global Crash Supervisor                    │
                       │           (window.onerror & unhandledrejection)             │
                       └──────────────────────────────┬──────────────────────────────┘
                                                      │
                       ┌──────────────────────────────▼──────────────────────────────┐
                       │                     Root ErrorBoundary                       │
                       │           (Gemini AI Diagnostic & Self-Healing)             │
                       └──────────────────────────────┬──────────────────────────────┘
                                                      │
                       ┌──────────────────────────────▼──────────────────────────────┐
                       │               Isolated SafeBoundary Enclosures               │
                       │      (AppRoutes, Modals, Overlays, Scratchpad, HUD)          │
                       └─────────────────────────────────────────────────────────────┘
```

### Layer 1: Component & Route Isolation (`<SafeBoundary>`)
- Every modal, overlay, monitor, and route is wrapped in an isolated boundary.
- If a route or modal encounters an error, **only that component is isolated**. The `Navbar`, `Footer`, active user profile, and persistent scratchpad continue operating smoothly.

### Layer 2: Autonomous AI Crash Healer (`aiCrashHealer.js`)
- Captures runtime errors, component stacks, and execution context.
- Invokes Gemini AI (with multi-key rotation and zero-latency heuristic fallback) to diagnose the root cause.
- Performs automated, non-destructive state reconciliation (`repairCorruptedStorageKeys()`, cache purging, safe navigation).

### Layer 3: Anti-Thrashing Loop Protection (`crashSupervisor.js`)
- Session-based crash counting halts automated reloads if ≥2 crashes occur within 30 seconds.
- Dispatches a subtle, non-intrusive floating toast to inform the learner of background self-healing without interrupting their training.

### Layer 4: Persistent Watchdog Daemon (`run-secloudive.bat`)
- Continuous Windows watchdog script that detects if port 5173 stops responding.
- Automatically restarts the development engine within 2 seconds.

---

## 3. Telemetry Inspection
Any runtime crash telemetry is saved to `sessionStorage.getItem('secloudive_crash_telemetry_v1')`.  
Inspect it anytime via your browser DevTools console:
```javascript
import { getCrashTelemetryLogs } from './src/solutions/aiCrashHealer.js'
console.table(getCrashTelemetryLogs())
```
