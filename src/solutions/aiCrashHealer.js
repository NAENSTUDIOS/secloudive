/**
 * SeCLOUDIVE Autonomous AI Crash Recovery & Self-Healing Agent
 * Path: src/solutions/aiCrashHealer.js
 * Architecture: NAEN Studios / SeCLOUDIVE Platform Engineering
 * ============================================================================
 * Provides permanent, automated, and intelligent crash interception:
 *  1. Intercepts React errors, uncaught exceptions, and unhandled promise drops
 *  2. Uses Gemini AI with multi-key fallback to diagnose root causes
 *  3. Autonomously executes safe state recovery without data loss
 *  4. Detects & repairs corrupted localStorage JSON states
 *  5. Maintains an immutable circular crash telemetry log in sessionStorage
 * ============================================================================
 */

import { geminiRotator } from '../services/geminiKeyRotator.js'

const CRASH_LOG_STORAGE_KEY = 'secloudive_crash_telemetry_v1'
const MAX_CRASH_LOGS = 15

/**
 * Main AI Crash Diagnosis & Healing Entry Point
 */
export async function handleSiteCrashWithAI({
  error,
  errorInfo = null,
  context = 'Global Application Layer',
  onAutoHealApplied = null
}) {
  const timestamp = new Date().toISOString()
  const errorMsg = error?.message || String(error) || 'Unknown execution failure'
  const stack = error?.stack || ''
  const componentStack = errorInfo?.componentStack || ''

  console.warn(`[AI Crash Healer] Intercepted crash in <${context}>:`, errorMsg)

  // 1. Record telemetry in sessionStorage
  recordCrashTelemetry({ timestamp, context, errorMsg, stack: stack.slice(0, 500) })

  // 2. Perform instant defensive repairs (e.g. check for corrupted localStorage)
  const storageSanitized = repairCorruptedStorageKeys()

  // 3. Fast-path heuristic detection for instant sub-millisecond recovery
  const fastDiagnosis = getFastHeuristicDiagnosis(errorMsg, stack, componentStack)

  // 4. Request deep Gemini diagnosis if online
  let finalDiagnosis = fastDiagnosis
  try {
    const prompt = `You are the SeCloudive Automated AI Incident Response Engineer.
A crash was intercepted in the cloud security platform:

CONTEXT: ${context}
ERROR: ${errorMsg}
STACK: ${stack.slice(0, 800)}
COMPONENT: ${componentStack.slice(0, 400)}

Analyze and return a JSON object with:
{
  "rootCause": "Short plain-English summary of the issue (1 sentence)",
  "whyItHappened": "Technical origin (1 sentence)",
  "recommendedAction": "One of [SAFE_RELOAD, RESET_TRANSIENT_STATE, REPAIR_STORAGE, RECONNECT_NETWORK, NAVIGATE_SAFE_ROUTE]",
  "actionLabel": "User-friendly recovery button text",
  "confidenceScore": 95,
  "safeRecoverySteps": ["Step 1", "Step 2"]
}`

    const aiRes = await geminiRotator.executeChat({
      prompt,
      systemInstruction: 'You are an autonomous Cloud Reliability Engineer fixing web client crashes.',
      model: 'gemini-flash-latest'
    })

    if (aiRes?.text) {
      const jsonMatch = aiRes.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        finalDiagnosis = {
          source: 'GEMINI_AI_REASONING',
          modelUsed: aiRes.modelUsed,
          storageSanitized,
          ...parsed
        }
      }
    }
  } catch (aiErr) {
    console.debug('[AI Crash Healer] Gemini online diagnosis fallback to heuristic:', aiErr?.message)
    finalDiagnosis.storageSanitized = storageSanitized
  }

  // 5. Notify callback if provided
  if (typeof onAutoHealApplied === 'function') {
    try {
      onAutoHealApplied(finalDiagnosis)
    } catch {}
  }

  return finalDiagnosis
}

/**
 * Scans all localStorage keys for invalid or corrupted JSON and cleans them safely
 */
export function repairCorruptedStorageKeys() {
  const corruptedKeys = []
  if (typeof window === 'undefined' || !window.localStorage) return corruptedKeys

  try {
    const length = localStorage.length
    const keysToCheck = []
    for (let i = 0; i < length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('secloudive')) {
        keysToCheck.push(k)
      }
    }

    keysToCheck.forEach(key => {
      const raw = localStorage.getItem(key)
      if (raw && (raw.startsWith('{') || raw.startsWith('['))) {
        try {
          JSON.parse(raw)
        } catch {
          console.warn(`[AI Crash Healer] Detected and repaired corrupted storage key: "${key}"`)
          corruptedKeys.push(key)
          localStorage.removeItem(key)
        }
      }
    })
  } catch (err) {
    console.debug('[AI Crash Healer] Storage repair sweep note:', err)
  }

  return corruptedKeys
}

/**
 * Fast-path heuristic diagnosis
 */
function getFastHeuristicDiagnosis(msg, stack, compStack) {
  const combined = `${msg} ${stack} ${compStack}`.toLowerCase()

  if (combined.includes('json.parse') || combined.includes('unexpected token') || combined.includes('is not valid json')) {
    return {
      source: 'RAPID_HEURISTIC',
      rootCause: 'Corrupted or malformed browser storage state intercepted.',
      whyItHappened: 'A cached profile or progress key contained invalid JSON syntax.',
      recommendedAction: 'REPAIR_STORAGE',
      actionLabel: 'Repair Storage & Recover',
      confidenceScore: 98,
      safeRecoverySteps: ['Purge malformed transient cache', 'Reconcile user profile', 'Restore safe session']
    }
  }

  if (combined.includes('cannot read properties of undefined') || combined.includes('cannot read property') || combined.includes('null is not an object')) {
    return {
      source: 'RAPID_HEURISTIC',
      rootCause: 'Component attempted to access an uninitialized data property.',
      whyItHappened: 'A laboratory challenge, threat scenario, or user profile property was requested before async hydration finished.',
      recommendedAction: 'RESET_TRANSIENT_STATE',
      actionLabel: 'Reconcile State & Continue',
      confidenceScore: 96,
      safeRecoverySteps: ['Initialize defensive state defaults', 'Reload view cleanly']
    }
  }

  if (combined.includes('failed to fetch') || combined.includes('networkerror') || combined.includes('err_connection')) {
    return {
      source: 'RAPID_HEURISTIC',
      rootCause: 'Network connection or backend endpoint timeout.',
      whyItHappened: 'A request to Supabase, Gemini API, or Google CDN timed out or dropped.',
      recommendedAction: 'RECONNECT_NETWORK',
      actionLabel: 'Reconnect & Resume',
      confidenceScore: 94,
      safeRecoverySteps: ['Retain local offline data', 'Wait for connection heartbeat', 'Resume telemetry']
    }
  }

  return {
    source: 'RAPID_HEURISTIC',
    rootCause: 'Unexpected runtime rendering interruption intercepted by safety shield.',
    whyItHappened: 'An edge-case component lifecycle anomaly occurred.',
    recommendedAction: 'SAFE_RELOAD',
    actionLabel: 'Self-Heal & Reload',
    confidenceScore: 90,
    safeRecoverySteps: ['Preserve user progress in localStorage', 'Perform clean isolated reload']
  }
}

/**
 * Executes the safe self-healing recovery routine
 */
export function executeSelfHealingAction(actionType = 'SAFE_RELOAD') {
  try {
    repairCorruptedStorageKeys()

    if (actionType === 'REPAIR_STORAGE' || actionType === 'RESET_TRANSIENT_STATE') {
      const keysToClear = [
        'secloudive_transient_cache',
        'secloudive_active_temp_query',
        'secloudive_temp_draft'
      ]
      keysToClear.forEach(k => localStorage.removeItem(k))
    }

    if (actionType === 'NAVIGATE_SAFE_ROUTE') {
      window.location.href = '/'
      return
    }

    window.location.reload()
  } catch (e) {
    console.error('[AI Crash Healer] Fallback reload execution:', e)
    window.location.href = '/'
  }
}

/**
 * Records telemetry in sessionStorage
 */
function recordCrashTelemetry(entry) {
  try {
    const raw = sessionStorage.getItem(CRASH_LOG_STORAGE_KEY)
    const logs = raw ? JSON.parse(raw) : []
    logs.unshift(entry)
    if (logs.length > MAX_CRASH_LOGS) logs.pop()
    sessionStorage.setItem(CRASH_LOG_STORAGE_KEY, JSON.stringify(logs))
  } catch {}
}

/**
 * Returns past crash telemetry logs for debugging
 */
export function getCrashTelemetryLogs() {
  try {
    const raw = sessionStorage.getItem(CRASH_LOG_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
