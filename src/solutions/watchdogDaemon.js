/**
 * SeCLOUDIVE Local Node Watchdog Daemon
 * Path: src/solutions/watchdogDaemon.js
 * Architecture: NAEN Studios / SeCLOUDIVE Platform Engineering
 * ============================================================================
 * Continuously polls localhost:5173 to ensure the Vite dev server never stays down.
 * If 3 consecutive heartbeat probes fail, it triggers a recovery restart.
 * ============================================================================
 */

import http from 'http'
import { spawn } from 'child_process'

const PORT = 5173
const HOST = '127.0.0.1'
const POLL_INTERVAL_MS = 4000
let consecutiveFailures = 0

console.log(`[Watchdog Daemon] Initializing continuous uptime monitor for http://${HOST}:${PORT}/`)

function probeServer() {
  const req = http.get({ host: HOST, port: PORT, path: '/', timeout: 2500 }, (res) => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      if (consecutiveFailures > 0) {
        console.log(`[Watchdog Daemon] Dev server heartbeat restored (HTTP ${res.statusCode}).`)
      }
      consecutiveFailures = 0
    } else {
      consecutiveFailures++
      console.warn(`[Watchdog Daemon] Server returned unexpected status: ${res.statusCode} (Failure ${consecutiveFailures}/3)`)
      checkThreshold()
    }
  })

  req.on('error', (err) => {
    consecutiveFailures++
    console.warn(`[Watchdog Daemon] Connection probe error: ${err.message} (Failure ${consecutiveFailures}/3)`)
    checkThreshold()
  })

  req.on('timeout', () => {
    req.destroy()
    consecutiveFailures++
    console.warn(`[Watchdog Daemon] Heartbeat timed out (Failure ${consecutiveFailures}/3)`)
    checkThreshold()
  })
}

function checkThreshold() {
  if (consecutiveFailures >= 3) {
    console.error(`[Watchdog Daemon] CRITICAL: 3 consecutive heartbeat failures on port ${PORT}!`)
    console.log(`[Watchdog Daemon] Launching self-healing restart of 'npm run dev'...`)
    consecutiveFailures = 0

    const child = spawn('npm.cmd', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true,
      detached: true
    })
    child.unref()
  }
}

// Start interval loop
setInterval(probeServer, POLL_INTERVAL_MS)
probeServer()
