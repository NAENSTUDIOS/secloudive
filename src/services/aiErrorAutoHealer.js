/**
 * ============================================================================
 * SeCloudive Automated Gemini AI Error Diagnostician & Self-Healing Service
 * Diagnoses client-side exceptions, network interruptions, and runtime failures
 * using the Gemini API (with resilient multi-key rotation and local fallback heuristics).
 * ============================================================================
 */

import { geminiRotator } from './geminiKeyRotator.js'

/**
 * Analyzes any caught runtime error with Gemini AI or intelligent heuristics
 */
export async function diagnoseErrorWithGemini({ error, errorInfo = null, context = 'Root Application Boundary' }) {
  const errorMessage = error?.message || error?.toString() || 'Unknown runtime exception'
  const stack = error?.stack || ''
  const componentStack = errorInfo?.componentStack || ''

  // 1. Check for known pattern signatures for instant rapid heuristic diagnosis
  const rapidDiagnosis = detectKnownSignature(errorMessage, stack, componentStack)

  // 2. Attempt deep Gemini reasoning through resilient key rotator
  try {
    const prompt = `You are the SeCloudive Automated AI Incident Healer and Senior Cloud/React Architect.
A client-side error occurred in the security training simulator:

ERROR: ${errorMessage}
CONTEXT: ${context}
STACK TRACE:
${stack.slice(0, 1000)}
COMPONENT STACK:
${componentStack.slice(0, 600)}

Please return a concise JSON diagnostic report with:
1. "rootCause": Plain English summary of the exact bug or interruption (max 2 sentences).
2. "whyItHappened": Technical reason (e.g. Temporal Dead Zone, missing export, socket disconnect, network timeout).
3. "recommendedAction": One of ["SAFE_RELOAD", "RESET_TRANSIENT_STATE", "RECONNECT_NETWORK", "NAVIGATE_HOME"].
4. "actionLabel": A short human-friendly button title for automated recovery.
5. "confidenceScore": Integer 70-99.
6. "preventionTip": Senior engineer advice on how to prevent this in production cloud systems.`

    const aiResponse = await geminiRotator.executeChat({
      prompt,
      systemInstruction: 'You are an autonomous Cloud Reliability Engineer and AI SRE diagnosing web simulator failures.',
      model: 'gemini-flash-latest'
    })

    if (aiResponse?.text) {
      // Parse JSON from code fence or raw string
      const jsonMatch = aiResponse.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          source: 'GEMINI_AI_REASONING',
          modelUsed: aiResponse.modelUsed,
          keyUsed: aiResponse.keyUsed,
          ...parsed
        }
      }
    }
  } catch (aiErr) {
    console.warn('[AIErrorAutoHealer] Gemini online diagnosis fallback to heuristic:', aiErr)
  }

  // 3. Fallback to grounded rapid heuristic if Gemini API is unreachable or network interrupted
  return rapidDiagnosis
}

/**
 * Pattern-based intelligent diagnosis for instant zero-latency recovery
 */
function detectKnownSignature(msg, stack, compStack) {
  const text = `${msg} ${stack} ${compStack}`.toLowerCase()

  if (text.includes('before initialization') || text.includes('cannot access') || text.includes('referenceerror')) {
    return {
      source: 'GEMINI_HEURISTIC_ENGINE',
      rootCause: 'JavaScript Temporal Dead Zone (TDZ) or uninitialized variable reference.',
      whyItHappened: 'A state variable or hook was accessed before its declaration in the component lifecycle.',
      recommendedAction: 'RESET_TRANSIENT_STATE',
      actionLabel: 'Auto-Reconcile State & Reload',
      confidenceScore: 95,
      preventionTip: 'Declare all memoized dependencies before child hooks and verify lexical scope order.'
    }
  }

  if (text.includes('is not defined') || text.includes('not exported')) {
    return {
      source: 'GEMINI_HEURISTIC_ENGINE',
      rootCause: 'Missing component or module symbol export.',
      whyItHappened: 'A Lucide icon or data module was referenced in JSX without a corresponding import statement.',
      recommendedAction: 'SAFE_RELOAD',
      actionLabel: 'Purge Module Cache & Reload',
      confidenceScore: 96,
      preventionTip: 'Use TypeScript or automated static linting to catch unimported identifiers at build time.'
    }
  }

  if (text.includes('network') || text.includes('fetch') || text.includes('connection') || text.includes('lookup') || text.includes('stream reading error')) {
    return {
      source: 'GEMINI_HEURISTIC_ENGINE',
      rootCause: 'Network connection socket interruption or DNS lookup failure.',
      whyItHappened: 'The remote host or local proxy connection was temporarily interrupted while streaming telemetry.',
      recommendedAction: 'RECONNECT_NETWORK',
      actionLabel: 'Reconnect & Resume Simulation',
      confidenceScore: 92,
      preventionTip: 'Implement exponential backoff retry and circuit-breaker patterns for resilient cloud telemetry.'
    }
  }

  return {
    source: 'GEMINI_HEURISTIC_ENGINE',
    rootCause: 'Unhandled client-side execution interruption caught by safety boundary.',
    whyItHappened: 'An unexpected component state permutation occurred during render.',
    recommendedAction: 'SAFE_RELOAD',
    actionLabel: 'Auto-Recover Application',
    confidenceScore: 88,
    preventionTip: 'Always isolate external data reads with safe optional chaining (?.) and default values.'
  }
}

/**
 * Executes the automated self-healing recovery procedure
 */
export function executeAutoHeal(actionType = 'SAFE_RELOAD') {
  try {
    // 1. Purge transient session / corrupted storage keys without wiping learner progress
    const keysToCheck = ['secloudive_active_temp_query', 'secloudive_transient_cache', 'secloudive_temp_draft']
    keysToCheck.forEach(k => localStorage.removeItem(k))

    // 2. Perform target recovery
    if (actionType === 'NAVIGATE_HOME') {
      window.location.href = '/'
      return
    }

    // 3. Clean safe reload
    window.location.reload()
  } catch (err) {
    console.error('[AIErrorAutoHealer] Recovery execution error:', err)
    window.location.href = '/'
  }
}

export default {
  diagnoseErrorWithGemini,
  executeAutoHeal
}
