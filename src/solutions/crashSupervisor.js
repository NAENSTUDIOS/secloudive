/**
 * SeCLOUDIVE Runtime Crash Supervisor & Resilience Monitor
 * Path: src/solutions/crashSupervisor.js
 * Architecture: NAEN Studios / SeCLOUDIVE Platform Engineering
 * ============================================================================
 * Provides continuous runtime observation:
 *  - Intercepts uncaught window exceptions and unhandled promise rejections
 *  - Enforces anti-thrashing cooldowns (prevents infinite reload loops)
 *  - Dispatches non-intrusive recovery toasts
 *  - Automatically coordinates with aiCrashHealer
 * ============================================================================
 */

import { handleSiteCrashWithAI, executeSelfHealingAction } from './aiCrashHealer.js'

let isInitialized = false

/**
 * Initializes the global supervisor listeners
 */
export function initCrashSupervisor() {
  if (isInitialized || typeof window === 'undefined') return
  isInitialized = true

  console.log('[Crash Supervisor] Active: continuous self-healing shield initialized.')

  // 1. Intercept uncaught global window errors
  window.addEventListener('error', (event) => {
    // Ignore harmless browser extension or resize-observer errors
    if (
      event?.message?.includes('ResizeObserver loop') ||
      event?.filename?.includes('extension') ||
      event?.filename?.includes('chrome-extension')
    ) {
      return
    }

    console.warn('[Crash Supervisor] Intercepted window runtime error:', event.message)
    handleSiteCrashWithAI({
      error: event.error || new Error(event.message),
      context: `Window Error (${event.filename || 'runtime'})`
    })
  })

  // 2. Intercept unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[Crash Supervisor] Intercepted unhandled promise rejection:', event.reason)
    
    // Check if network drop
    const reasonMsg = String(event?.reason?.message || event?.reason || '')
    if (reasonMsg.includes('Failed to fetch') || reasonMsg.includes('NetworkError')) {
      showSelfHealToast('Network interruption intercepted. Offline fallback active.', 'warning')
    }

    if (event.preventDefault) {
      event.preventDefault()
    }
  })
}

/**
 * Explicit crash reporting hook for React Error Boundaries
 */
export async function reportCrashToSupervisor(error, errorInfo = null, context = 'Component Boundary') {
  // Check reload-loop guard
  const now = Date.now()
  const lastCrashTs = parseInt(sessionStorage.getItem('secloudive_sup_last_ts') || '0', 10)
  const crashCount = parseInt(sessionStorage.getItem('secloudive_sup_count') || '0', 10)

  const isRapidCrash = now - lastCrashTs < 30000
  const updatedCount = isRapidCrash ? crashCount + 1 : 1

  sessionStorage.setItem('secloudive_sup_last_ts', String(now))
  sessionStorage.setItem('secloudive_sup_count', String(updatedCount))

  const isThrashing = updatedCount >= 2

  const diagnosis = await handleSiteCrashWithAI({
    error,
    errorInfo,
    context,
    onAutoHealApplied: (diag) => {
      if (!isThrashing) {
        showSelfHealToast(
          `AI SRE Auto-Healed Exception: ${diag.actionLabel || 'Safe state recovered'}`,
          'success'
        )
      }
    }
  })

  return {
    ...diagnosis,
    isThrashing,
    autoReloadAllowed: !isThrashing
  }
}

/**
 * Creates and renders a floating self-healing notification
 */
function showSelfHealToast(message, type = 'info') {
  if (typeof document === 'undefined') return

  const toastId = 'secloudive-selfheal-toast'
  let toast = document.getElementById(toastId)

  if (!toast) {
    toast = document.createElement('div')
    toast.id = toastId
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%);
      border: 1px solid rgba(56, 189, 248, 0.4);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.2);
      color: #f8fafc;
      padding: 12px 18px;
      border-radius: 10px;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 420px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      transform: translateY(20px);
    `
    document.body.appendChild(toast)
  }

  const iconSvg = type === 'warning'
    ? `<span style="color: #fbbf24; font-size: 16px;">⚠️</span>`
    : `<span style="color: #38bdf8; font-size: 16px;">🛡️</span>`

  toast.innerHTML = `
    ${iconSvg}
    <div style="flex: 1;">
      <div style="font-size: 11px; color: #38bdf8; text-transform: uppercase; font-family: 'DM Mono', monospace; font-weight: 700; letter-spacing: 0.5px;">SeCloudive Self-Healing Shield</div>
      <div>${message}</div>
    </div>
  `

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0)'
  })

  // Auto dismiss after 4.5 seconds
  setTimeout(() => {
    if (toast) {
      toast.style.opacity = '0'
      toast.style.transform = 'translateY(20px)'
      setTimeout(() => {
        if (toast?.parentNode) toast.parentNode.removeChild(toast)
      }, 350)
    }
  }, 4500)
}
